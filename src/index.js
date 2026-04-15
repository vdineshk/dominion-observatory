// DOMINION OBSERVATORY v1.0
// The Behavioral Trust Layer for the Agent Economy
// Deployed on Cloudflare Workers + D1
// 
// What this does:
// 1. Agents call check_trust() to get reliability scores for any MCP server
// 2. Agents call report_interaction() to report their experience after calling a server
// 3. Data accumulates in D1 — this is the moat
// 4. Scores improve with more data — this is the flywheel
//
// Tools exposed via MCP:
// - check_trust: Get trust score for any MCP server URL
// - report_interaction: Report success/failure after calling an MCP server
// - get_leaderboard: Top-rated MCP servers by category
// - get_baselines: Behavioral baselines for a tool category
// - check_anomaly: Is this agent behavior normal for this tool category?

const SCHEMA = `
CREATE TABLE IF NOT EXISTS servers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE NOT NULL,
  name TEXT,
  description TEXT,
  category TEXT DEFAULT 'uncategorized',
  first_seen TEXT DEFAULT (datetime('now')),
  last_checked TEXT,
  total_calls INTEGER DEFAULT 0,
  successful_calls INTEGER DEFAULT 0,
  failed_calls INTEGER DEFAULT 0,
  avg_latency_ms REAL DEFAULT 0,
  p95_latency_ms REAL DEFAULT 0,
  uptime_30d REAL DEFAULT 0,
  trust_score REAL DEFAULT 50.0,
  static_score REAL DEFAULT 50.0,
  runtime_score REAL DEFAULT 50.0,
  github_url TEXT,
  github_stars INTEGER DEFAULT 0,
  has_auth INTEGER DEFAULT 0,
  last_error TEXT,
  last_error_time TEXT
);

CREATE TABLE IF NOT EXISTS interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  server_id INTEGER NOT NULL,
  timestamp TEXT DEFAULT (datetime('now')),
  agent_id TEXT,
  tool_name TEXT,
  success INTEGER NOT NULL,
  latency_ms REAL,
  error_type TEXT,
  error_message TEXT,
  http_status INTEGER,
  FOREIGN KEY (server_id) REFERENCES servers(id)
);

CREATE TABLE IF NOT EXISTS baselines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  metric TEXT NOT NULL,
  avg_value REAL,
  p50_value REAL,
  p95_value REAL,
  min_value REAL,
  max_value REAL,
  sample_count INTEGER DEFAULT 0,
  last_updated TEXT DEFAULT (datetime('now')),
  UNIQUE(category, metric)
);

CREATE TABLE IF NOT EXISTS daily_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  server_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  total_calls INTEGER DEFAULT 0,
  successful_calls INTEGER DEFAULT 0,
  avg_latency_ms REAL,
  p95_latency_ms REAL,
  trust_score REAL,
  UNIQUE(server_id, date),
  FOREIGN KEY (server_id) REFERENCES servers(id)
);

CREATE INDEX IF NOT EXISTS idx_interactions_server ON interactions(server_id);
CREATE INDEX IF NOT EXISTS idx_interactions_timestamp ON interactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_servers_category ON servers(category);
CREATE INDEX IF NOT EXISTS idx_servers_trust ON servers(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_daily_server_date ON daily_snapshots(server_id, date);
`;

// ============================================================
// MCP TOOL DEFINITIONS
// ============================================================

const TOOLS = [
  {
    name: "check_trust",
    description: "Get the trust score and reliability metrics for any MCP server. Use this BEFORE calling an unknown MCP server to assess if it's reliable. Returns trust_score (0-100), latency stats, uptime, success rate, and how many agents have used it. Scores above 70 indicate reliable servers. Scores below 30 indicate risky servers.",
    inputSchema: {
      type: "object",
      properties: {
        server_url: {
          type: "string",
          description: "The URL of the MCP server to check (e.g., https://example.workers.dev/mcp)"
        }
      },
      required: ["server_url"]
    }
  },
  {
    name: "report_interaction",
    description: "Report the outcome of calling an MCP server. Call this AFTER you use any MCP server to contribute to the trust network. Your report helps other agents make better decisions. This is free and takes <1ms.",
    inputSchema: {
      type: "object",
      properties: {
        server_url: {
          type: "string",
          description: "The URL of the MCP server you called"
        },
        success: {
          type: "boolean",
          description: "Did the call succeed? true = worked as expected, false = error or unexpected result"
        },
        latency_ms: {
          type: "number",
          description: "How long the call took in milliseconds"
        },
        tool_name: {
          type: "string",
          description: "Which tool you called on the server"
        },
        error_type: {
          type: "string",
          description: "If failed: timeout, auth_error, invalid_response, server_error, rate_limited, schema_mismatch"
        },
        error_message: {
          type: "string",
          description: "If failed: brief error description"
        },
        http_status: {
          type: "integer",
          description: "HTTP status code returned (200, 429, 500, etc.)"
        }
      },
      required: ["server_url", "success"]
    }
  },
  {
    name: "get_leaderboard",
    description: "Get the top-rated MCP servers, optionally filtered by category. Use this to discover the most reliable MCP servers in the ecosystem. Categories include: weather, finance, code, data, search, compliance, transport, productivity, communication.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by category (optional). Leave empty for overall leaderboard."
        },
        limit: {
          type: "integer",
          description: "Number of results (default 10, max 50)"
        }
      }
    }
  },
  {
    name: "get_baselines",
    description: "Get behavioral baselines for a tool category. Shows what 'normal' looks like — average latency, success rates, typical call patterns. Use this to evaluate whether a specific server's performance is within normal range for its category.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "The tool category to get baselines for (e.g., weather, finance, code, data)"
        }
      },
      required: ["category"]
    }
  },
  {
    name: "check_anomaly",
    description: "Check if observed behavior from an MCP server is anomalous compared to baselines. Use this when a server seems slow, unreliable, or returns unexpected results. Returns whether the behavior deviates significantly from normal patterns.",
    inputSchema: {
      type: "object",
      properties: {
        server_url: {
          type: "string",
          description: "The MCP server URL to check"
        },
        observed_latency_ms: {
          type: "number",
          description: "The latency you observed"
        },
        observed_success_rate: {
          type: "number",
          description: "Success rate you've observed (0.0 to 1.0)"
        }
      },
      required: ["server_url"]
    }
  },
  {
    name: "register_server",
    description: "Register a new MCP server in the observatory. Server owners can register their servers to start building a trust score. Registration is free.",
    inputSchema: {
      type: "object",
      properties: {
        server_url: {
          type: "string",
          description: "The MCP server URL"
        },
        name: {
          type: "string",
          description: "Human-readable name of the server"
        },
        description: {
          type: "string",
          description: "What the server does"
        },
        category: {
          type: "string",
          description: "Primary category: weather, finance, code, data, search, compliance, transport, productivity, communication, other"
        },
        github_url: {
          type: "string",
          description: "GitHub repository URL (optional, improves static score)"
        }
      },
      required: ["server_url", "name"]
    }
  },
  {
    name: "get_server_history",
    description: "Get daily trust score and performance history for a server over the last 30 days. Use this to see trends — is the server improving or degrading?",
    inputSchema: {
      type: "object",
      properties: {
        server_url: {
          type: "string",
          description: "The MCP server URL"
        }
      },
      required: ["server_url"]
    }
  },
  {
    name: "observatory_stats",
    description: "Get overall statistics about the Dominion Observatory — total servers tracked, total interactions recorded, coverage by category, and data freshness. Use this to understand the scope of the trust network.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "get_compliance_report",
    description: "Export a compliance-ready audit trail of all recorded interactions. Formatted for EU AI Act Article 12 and Singapore IMDA Agentic AI Governance Framework. Filter by server, agent, or date range. Essential for enterprises that need to prove their AI agents are behaving correctly.",
    inputSchema: {
      type: "object",
      properties: {
        server_url: {
          type: "string",
          description: "Filter by server URL (optional)"
        },
        agent_id: {
          type: "string",
          description: "Filter by agent ID (optional)"
        },
        start_date: {
          type: "string",
          description: "Start date in YYYY-MM-DD format (optional)"
        },
        end_date: {
          type: "string",
          description: "End date in YYYY-MM-DD format (optional)"
        }
      }
    }
  }
];

// ============================================================
// TOOL HANDLERS
// ============================================================

async function handleCheckTrust(db, params) {
  const { server_url } = params;
  const server = await db.prepare("SELECT * FROM servers WHERE url = ?").bind(server_url).first();
  
  if (!server) {
    return {
      found: false,
      server_url,
      message: "Server not yet tracked. Register it with register_server or report an interaction to start building its trust score.",
      trust_score: null
    };
  }

  const recentInteractions = await db.prepare(
    "SELECT COUNT(*) as count, AVG(latency_ms) as avg_lat FROM interactions WHERE server_id = ? AND timestamp > datetime('now', '-7 days')"
  ).bind(server.id).first();

  return {
    found: true,
    server_url: server.url,
    name: server.name,
    category: server.category,
    trust_score: Math.round(server.trust_score * 10) / 10,
    static_score: Math.round(server.static_score * 10) / 10,
    runtime_score: Math.round(server.runtime_score * 10) / 10,
    metrics: {
      total_calls: server.total_calls,
      success_rate: server.total_calls > 0 ? Math.round((server.successful_calls / server.total_calls) * 1000) / 10 : null,
      avg_latency_ms: Math.round(server.avg_latency_ms),
      p95_latency_ms: Math.round(server.p95_latency_ms),
      uptime_30d: server.uptime_30d
    },
    recent_7d: {
      interactions: recentInteractions?.count || 0,
      avg_latency_ms: recentInteractions?.avg_lat ? Math.round(recentInteractions.avg_lat) : null
    },
    first_seen: server.first_seen,
    last_checked: server.last_checked,
    has_auth: !!server.has_auth,
    github_stars: server.github_stars,
    last_error: server.last_error,
    last_error_time: server.last_error_time
  };
}

async function handleReportInteraction(db, params) {
  const { server_url, success, latency_ms, tool_name, error_type, error_message, http_status } = params;

  // Get or create server
  let server = await db.prepare("SELECT id, total_calls, successful_calls, avg_latency_ms FROM servers WHERE url = ?").bind(server_url).first();
  
  if (!server) {
    await db.prepare(
      "INSERT INTO servers (url, name, trust_score) VALUES (?, ?, 50.0)"
    ).bind(server_url, server_url).run();
    server = await db.prepare("SELECT id, total_calls, successful_calls, avg_latency_ms FROM servers WHERE url = ?").bind(server_url).first();
  }

  // Record interaction
  await db.prepare(
    "INSERT INTO interactions (server_id, success, latency_ms, tool_name, error_type, error_message, http_status, agent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(
    server.id,
    success ? 1 : 0,
    latency_ms || null,
    tool_name || null,
    error_type || null,
    error_message || null,
    http_status || null,
    params.agent_id || 'anonymous'
  ).run();

  // Update server stats
  const newTotal = server.total_calls + 1;
  const newSuccessful = server.successful_calls + (success ? 1 : 0);
  const newAvgLatency = latency_ms 
    ? ((server.avg_latency_ms * server.total_calls) + latency_ms) / newTotal 
    : server.avg_latency_ms;

  // Calculate new runtime score based on success rate and latency
  const successRate = newSuccessful / newTotal;
  const latencyScore = latency_ms ? Math.max(0, 100 - (latency_ms / 50)) : 50; // 0ms = 100, 5000ms = 0
  const runtimeScore = (successRate * 70) + (latencyScore * 0.3);

  // Combined trust score: 30% static + 70% runtime (runtime matters more)
  const staticScore = (await db.prepare("SELECT static_score FROM servers WHERE id = ?").bind(server.id).first())?.static_score || 50;
  const trustScore = (staticScore * 0.3) + (runtimeScore * 0.7);

  await db.prepare(
    `UPDATE servers SET 
      total_calls = ?, successful_calls = ?, avg_latency_ms = ?,
      runtime_score = ?, trust_score = ?, last_checked = datetime('now'),
      last_error = CASE WHEN ? = 0 THEN ? ELSE last_error END,
      last_error_time = CASE WHEN ? = 0 THEN datetime('now') ELSE last_error_time END
    WHERE id = ?`
  ).bind(
    newTotal, newSuccessful, newAvgLatency,
    Math.round(runtimeScore * 10) / 10, Math.round(trustScore * 10) / 10,
    success ? 1 : 0, error_message || null,
    success ? 1 : 0,
    server.id
  ).run();

  return {
    recorded: true,
    server_url,
    new_trust_score: Math.round(trustScore * 10) / 10,
    total_interactions: newTotal,
    success_rate: Math.round(successRate * 1000) / 10,
    message: "Thank you for contributing to the trust network. Your report helps every agent make better decisions."
  };
}

async function handleGetLeaderboard(db, params) {
  const limit = Math.min(params.limit || 10, 50);
  const category = params.category;

  let query, results;
  if (category) {
    results = await db.prepare(
      "SELECT url, name, category, trust_score, total_calls, successful_calls, avg_latency_ms, first_seen FROM servers WHERE category = ? AND total_calls >= 5 ORDER BY trust_score DESC LIMIT ?"
    ).bind(category, limit).all();
  } else {
    results = await db.prepare(
      "SELECT url, name, category, trust_score, total_calls, successful_calls, avg_latency_ms, first_seen FROM servers WHERE total_calls >= 1 ORDER BY trust_score DESC LIMIT ?"
    ).bind(limit).all();
  }

  return {
    category: category || "all",
    servers: (results.results || []).map(s => ({
      url: s.url,
      name: s.name,
      category: s.category,
      trust_score: Math.round(s.trust_score * 10) / 10,
      success_rate: s.total_calls > 0 ? Math.round((s.successful_calls / s.total_calls) * 1000) / 10 : null,
      avg_latency_ms: Math.round(s.avg_latency_ms),
      total_interactions: s.total_calls,
      tracked_since: s.first_seen
    })),
    total_results: (results.results || []).length,
    min_interactions: 1,
    generated_at: new Date().toISOString()
  };
}

async function handleGetBaselines(db, params) {
  const { category } = params;
  const baselines = await db.prepare(
    "SELECT * FROM baselines WHERE category = ?"
  ).bind(category).all();

  if (!baselines.results || baselines.results.length === 0) {
    // Generate baselines from actual data
    const stats = await db.prepare(`
      SELECT 
        AVG(i.latency_ms) as avg_latency,
        AVG(CASE WHEN i.success = 1 THEN 1.0 ELSE 0.0 END) as avg_success_rate,
        COUNT(*) as total_interactions,
        COUNT(DISTINCT i.server_id) as server_count
      FROM interactions i
      JOIN servers s ON i.server_id = s.id
      WHERE s.category = ? AND i.latency_ms IS NOT NULL
    `).bind(category).first();

    return {
      category,
      baselines_available: false,
      preliminary_stats: stats ? {
        avg_latency_ms: stats.avg_latency ? Math.round(stats.avg_latency) : null,
        avg_success_rate: stats.avg_success_rate ? Math.round(stats.avg_success_rate * 1000) / 10 : null,
        total_interactions: stats.total_interactions,
        servers_tracked: stats.server_count
      } : null,
      message: "Baselines for this category are still being established. More interaction data needed."
    };
  }

  return {
    category,
    baselines_available: true,
    metrics: baselines.results.reduce((acc, b) => {
      acc[b.metric] = {
        average: b.avg_value,
        median: b.p50_value,
        p95: b.p95_value,
        min: b.min_value,
        max: b.max_value,
        sample_count: b.sample_count
      };
      return acc;
    }, {}),
    last_updated: baselines.results[0]?.last_updated
  };
}

async function handleCheckAnomaly(db, params) {
  const { server_url, observed_latency_ms, observed_success_rate } = params;
  
  const server = await db.prepare("SELECT * FROM servers WHERE url = ?").bind(server_url).first();
  if (!server) {
    return { error: "Server not tracked. Register it first or report interactions." };
  }

  const anomalies = [];

  if (observed_latency_ms && server.avg_latency_ms > 0) {
    const ratio = observed_latency_ms / server.avg_latency_ms;
    if (ratio > 3) anomalies.push({ metric: "latency", severity: "high", detail: `${Math.round(observed_latency_ms)}ms is ${Math.round(ratio)}x the average of ${Math.round(server.avg_latency_ms)}ms` });
    else if (ratio > 2) anomalies.push({ metric: "latency", severity: "medium", detail: `${Math.round(observed_latency_ms)}ms is ${Math.round(ratio)}x the average` });
  }

  if (observed_success_rate !== undefined && server.total_calls >= 10) {
    const expectedRate = server.successful_calls / server.total_calls;
    const diff = expectedRate - observed_success_rate;
    if (diff > 0.3) anomalies.push({ metric: "success_rate", severity: "high", detail: `Observed ${Math.round(observed_success_rate * 100)}% vs expected ${Math.round(expectedRate * 100)}%` });
    else if (diff > 0.15) anomalies.push({ metric: "success_rate", severity: "medium", detail: `Observed ${Math.round(observed_success_rate * 100)}% vs expected ${Math.round(expectedRate * 100)}%` });
  }

  return {
    server_url,
    is_anomalous: anomalies.length > 0,
    anomalies,
    server_baselines: {
      avg_latency_ms: Math.round(server.avg_latency_ms),
      success_rate: server.total_calls > 0 ? Math.round((server.successful_calls / server.total_calls) * 1000) / 10 : null,
      total_data_points: server.total_calls
    },
    recommendation: anomalies.length > 0 
      ? "Consider using an alternative server or retrying later." 
      : "Server behavior appears normal."
  };
}

// ============================================================
// CATEGORY INFERENCE
// Keyword-based classifier — promotes 'other'/'uncategorized' servers
// into real categories so baselines actually mean something.
// Order matters: more specific categories come first.
// ============================================================
const CATEGORY_PATTERNS = [
  // Weather is a small but valuable category — match early.
  ["weather", /\b(weather|forecast|meteo|climate|noaa|ipma|temperature|precipitation)\b/i],
  // Finance / payments / commerce
  ["finance", /\b(stripe|paypal|payment|payments|invoice|billing|stock|stocks|trading|crypto|bitcoin|ethereum|wallet|bank|banking|finance|financial|accounting|ledger|tax|escrow|gumroad|mercadolibre|shopify|woocommerce|polygon|coinbase|defi|nft|treasury|payroll)\b/i],
  // Compliance / legal / governance / audit
  ["compliance", /\b(compliance|gdpr|hipaa|sox|pci|audit|legal|law|regulation|regulatory|policy|attestation|governance|risk|imda|eu ai act|nist|iso 27001|soc 2)\b/i],
  // Search / retrieval / scraping
  ["search", /\b(search|tavily|brave search|exa|serper|firecrawl|crawl|scrap(er|ing)|jina|perplexity|kagi|duckduckgo|google search|bing|web search|retriev(al|er)|deepwiki|desearch)\b/i],
  // Communication / messaging / email / chat
  ["communication", /\b(gmail|email|mail|outlook|slack|discord|telegram|whatsapp|sms|twilio|sendgrid|messag(e|ing)|chat|inbox|notification|webhook|signal|teams|zoom|meet|smtp|imap|pubsub|agentmail)\b/i],
  // Code / dev / git / CI / cloud infra
  ["code", /\b(github|gitlab|bitbucket|git\b|repo|repository|code|codebase|ci\/cd|pipeline|deploy|deployment|devops|terraform|kubernetes|k8s|docker|aws|gcp|azure|cloudflare|vercel|netlify|railway|render|fly\.io|heroku|jenkins|circleci|sentry|datadog|grafana|prometheus|lint|test runner|debug|ide|jetbrains|vscode|cursor|playwright|puppeteer|selenium|zuplo)\b/i],
  // Data / databases / analytics / warehouses
  ["data", /\b(mysql|postgres|postgresql|sqlite|mongodb|mongo|redis|cassandra|elastic(search)?|clickhouse|duckdb|snowflake|bigquery|databricks|redshift|airtable|notion db|metabase|tableau|powerbi|analytics|data warehouse|etl|dbt|kafka|spark|hadoop|s3|bucket|storage|pocketbase|supabase|firebase|prisma|sql\b|nosql|cloudinary|sift)\b/i],
  // Productivity / project mgmt / docs / notes / calendar
  ["productivity", /\b(notion|trello|asana|jira|linear|monday|clickup|todoist|airtable|calendar|google calendar|outlook calendar|reminder|task|todo|note|notes|docs|google docs|confluence|obsidian|evernote|spreadsheet|excel|google sheets|hubspot|salesforce|crm|workflow|n8n|zapier|make|automat(e|ion))\b/i],
  // Transport / travel / mobility
  ["transport", /\b(flight|airline|airport|hotel|airbnb|booking|expedia|uber|lyft|grab|taxi|train|rail|transit|maps|directions|routing|navigation|gps|fleet|shipping|logistics|dhl|fedex|ups|tracking number)\b/i],
  // Media / video / audio / image / streaming / social
  ["media", /\b(youtube|tiktok|instagram|twitter|x\.com|facebook|reddit|linkedin|pinterest|video|audio|podcast|music|spotify|soundcloud|image|photo|tavus|stable diffusion|midjourney|dall.?e|tts|stt|whisper|elevenlabs|ffmpeg|streaming|transcript|caption|subtitle|cloudinary|freebeat)\b/i],
  // Education / learning / reference
  ["education", /\b(course|learn(ing)?|tutorial|education|school|university|wikipedia|wiki\b|knowledge base|encyclopedia|dictionary|translate|translation|language|duolingo|khan|coursera|udemy|pronunciation)\b/i],
  // Security / scanning / auth / secrets
  ["security", /\b(security|vulnerability|cve|sast|dast|pentest|penetration|firewall|waf|auth|authentication|oauth|saml|sso|2fa|mfa|secret|vault|kms|encryption|tls|certificate|password|owasp|exposure)\b/i],
  // Health / fitness / wellness
  ["health", /\b(health|fitness|workout|strava|nutrition|diet|medical|doctor|hospital|patient|drug|medication|wellness|sleep|meditation)\b/i],
];

function inferCategory(name, description, url) {
  const haystack = [name || "", description || "", url || ""].join(" ").toLowerCase();
  if (!haystack.trim()) return null;
  // Reject pure test/demo entries — they should not pollute real categories.
  if (/^(test|echo|demo|sample|hello world|mcp-test|example|placeholder)$/i.test((name || "").trim())) {
    return "test";
  }
  for (const [category, pattern] of CATEGORY_PATTERNS) {
    if (pattern.test(haystack)) return category;
  }
  return null;
}

// Categories the classifier should overwrite (anything generic counts as "needs work").
const GENERIC_CATEGORIES = new Set(["other", "uncategorized", null, "", undefined]);

// ============================================================
// ACTIVE PROBE
// The Observatory observes. Without active probing, interaction count
// depends entirely on external agents finding us — single point of failure.
// Cron triggers this periodically to probe registered MCP endpoints,
// recording real latency/success as interactions tagged agent_id='observatory_probe'.
// ============================================================

// Only probe URLs that look like real callable endpoints, not directory listing pages.
function isProbableEndpoint(url) {
  if (!url) return false;
  if (url.includes("dominion-observatory")) return false; // never probe self
  // Same-account Cloudflare Workers can't be reliably probed via public URL —
  // Cloudflare routes the request back to the calling Worker's edge node and
  // hits our own catch-all 404 (confirmed via /admin/probe-one diagnostic).
  // These need to be probed externally or via service bindings, not here.
  if (url.includes("sgdata.workers.dev")) return false;
  if (url.startsWith("|")) return false; // malformed URL from bad bulk import (description leaked into url field)
  if (url.includes("github.com/")) return false; // repo link, not an endpoint
  if (url.includes("example.com")) return false; // placeholder
  if (url.includes("smithery.ai/server/")) return false;  // smithery listing page, not endpoint
  if (url.includes("apitracker.io/mcp-server/")) return false; // apitracker listing
  if (url.includes("glama.ai/mcp/servers/")) return false; // glama listing
  if (url.includes("mcp.so/server/")) return false; // mcp.so listing
  // Must parse as a real URL with http(s) scheme.
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  } catch {
    return false;
  }
  return /workers\.dev|vercel\.app|fly\.io|run\.app|herokuapp\.com|onrender\.com|railway\.app|deno\.dev|\/mcp(\?|$|\/)/i.test(url);
}

async function probeOneServer(server) {
  const start = Date.now();
  try {
    // Prefer POST tools/list to /mcp (real MCP probe). Fall back to HEAD if not /mcp.
    const isMcp = server.url.includes("/mcp");
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);
    let res;
    if (isMcp) {
      res = await fetch(server.url, {
        method: "POST",
        signal: ctrl.signal,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "DominionObservatory-Probe/1.0 (+https://dominion-observatory.sgdata.workers.dev)"
        },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} })
      });
    } else {
      res = await fetch(server.url, {
        method: "HEAD",
        signal: ctrl.signal,
        headers: {
          "User-Agent": "DominionObservatory-Probe/1.0 (+https://dominion-observatory.sgdata.workers.dev)"
        }
      });
    }
    clearTimeout(timeout);
    const latency = Date.now() - start;
    const ok = res.status >= 200 && res.status < 500; // 4xx still means server is alive
    const success = res.status >= 200 && res.status < 400;
    return {
      success,
      latency_ms: latency,
      http_status: res.status,
      error_type: success ? null : (res.status >= 500 ? "server_error" : "client_error"),
      error_message: success ? null : `HTTP ${res.status}`
    };
  } catch (e) {
    const latency = Date.now() - start;
    const isTimeout = e.name === "AbortError" || /timeout/i.test(e.message || "");
    return {
      success: false,
      latency_ms: latency,
      http_status: null,
      error_type: isTimeout ? "timeout" : "network_error",
      error_message: (e.message || String(e)).slice(0, 200)
    };
  }
}

// Probe up to `max` due servers. Records each as an interaction via the existing
// handleReportInteraction path so trust scores update consistently.
async function runProbeBatch(db, max = 25) {
  // Pick servers that look probable, oldest-checked first (round-robin).
  // Pull more than `max` so JS-side isProbableEndpoint() filtering still leaves
  // a full batch even when many SQL hits get rejected by the stricter JS filter.
  const rows = await db.prepare(
    `SELECT id, url, name FROM servers
     WHERE (url LIKE '%workers.dev%'
        OR url LIKE '%vercel.app%'
        OR url LIKE '%fly.io%'
        OR url LIKE '%run.app%'
        OR url LIKE '%onrender.com%'
        OR url LIKE '%railway.app%'
        OR url LIKE '%deno.dev%'
        OR url LIKE '%/mcp%')
       AND url NOT LIKE '%dominion-observatory%'
       AND url NOT LIKE '%smithery.ai%'
       AND url NOT LIKE '%apitracker.io%'
       AND url NOT LIKE '%glama.ai%'
       AND url NOT LIKE '%mcp.so%'
       AND url NOT LIKE '|%'
       AND url NOT LIKE '%github.com%'
       AND url NOT LIKE '%example.com%'
       AND url NOT LIKE '%sgdata.workers.dev%'
     ORDER BY COALESCE(last_checked, '1970-01-01') ASC
     LIMIT ?`
  ).bind(max * 8).all();
  const candidates = (rows.results || []).filter(s => isProbableEndpoint(s.url)).slice(0, max);
  if (candidates.length === 0) return { probed: 0, ok: 0, fail: 0 };

  const results = await Promise.all(candidates.map(s => probeOneServer(s)));
  let ok = 0;
  for (let i = 0; i < candidates.length; i++) {
    const s = candidates[i];
    const r = results[i];
    if (r.success) ok++;
    // Use the existing report path so trust score / runtime score / last_checked update consistently.
    await handleReportInteraction(db, {
      server_url: s.url,
      success: r.success,
      latency_ms: r.latency_ms,
      tool_name: "observatory_probe",
      error_type: r.error_type,
      error_message: r.error_message,
      http_status: r.http_status,
      agent_id: "observatory_probe"
    }).catch(() => { /* never let one failure poison the batch */ });
  }
  return { probed: candidates.length, ok, fail: candidates.length - ok };
}

async function handleRegisterServer(db, params) {
  const { server_url, name, description, category, github_url } = params;

  // Prevent self-tracking — Observatory must never track itself
  if (server_url && server_url.includes("dominion-observatory")) {
    return { registered: false, error: "Observatory cannot track itself. This creates circular data." };
  }

  // Resolve final category: caller-supplied wins if specific, otherwise infer.
  let finalCategory = category;
  if (GENERIC_CATEGORIES.has(finalCategory)) {
    finalCategory = inferCategory(name, description, server_url) || finalCategory || 'uncategorized';
  }

  const existing = await db.prepare("SELECT id FROM servers WHERE url = ?").bind(server_url).first();
  if (existing) {
    // Update if exists
    await db.prepare(
      "UPDATE servers SET name = COALESCE(?, name), description = COALESCE(?, description), category = COALESCE(?, category), github_url = COALESCE(?, github_url) WHERE url = ?"
    ).bind(name, description || null, finalCategory || null, github_url || null, server_url).run();

    return { registered: true, updated: true, server_url, category: finalCategory, message: "Server profile updated." };
  }

  // Calculate static score
  let staticScore = 50;
  if (github_url) staticScore += 10;
  if (description && description.length > 50) staticScore += 10;
  if (finalCategory && finalCategory !== 'other' && finalCategory !== 'uncategorized') staticScore += 5;

  await db.prepare(
    "INSERT INTO servers (url, name, description, category, github_url, static_score, trust_score) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(server_url, name, description || null, finalCategory || 'uncategorized', github_url || null, staticScore, staticScore).run();

  return {
    registered: true,
    updated: false,
    server_url,
    initial_trust_score: staticScore,
    message: "Server registered. Trust score will improve as agents report interactions. Share your server URL with agents and encourage them to report outcomes."
  };
}

async function handleGetServerHistory(db, params) {
  const { server_url } = params;
  const server = await db.prepare("SELECT id FROM servers WHERE url = ?").bind(server_url).first();
  if (!server) return { error: "Server not tracked." };

  const history = await db.prepare(
    "SELECT date, total_calls, successful_calls, avg_latency_ms, trust_score FROM daily_snapshots WHERE server_id = ? ORDER BY date DESC LIMIT 30"
  ).bind(server.id).all();

  return {
    server_url,
    days: (history.results || []).map(d => ({
      date: d.date,
      calls: d.total_calls,
      success_rate: d.total_calls > 0 ? Math.round((d.successful_calls / d.total_calls) * 1000) / 10 : null,
      avg_latency_ms: d.avg_latency_ms ? Math.round(d.avg_latency_ms) : null,
      trust_score: Math.round(d.trust_score * 10) / 10
    })),
    trend: (history.results || []).length >= 2 
      ? (history.results[0].trust_score > history.results[history.results.length - 1].trust_score ? "improving" : "declining")
      : "insufficient_data"
  };
}

async function handleObservatoryStats(db) {
  const stats = await db.prepare(`
    SELECT 
      COUNT(*) as total_servers,
      SUM(total_calls) as total_interactions,
      AVG(trust_score) as avg_trust_score
    FROM servers
  `).first();

  const categories = await db.prepare(
    "SELECT category, COUNT(*) as count FROM servers GROUP BY category ORDER BY count DESC"
  ).all();

  const recentActivity = await db.prepare(
    "SELECT COUNT(*) as count FROM interactions WHERE timestamp > datetime('now', '-24 hours')"
  ).first();

  // Honest split: probe-generated data vs. agent-reported data.
  const sourceSplit = await db.prepare(
    `SELECT
       SUM(CASE WHEN agent_id = 'observatory_probe' THEN 1 ELSE 0 END) as probes,
       SUM(CASE WHEN agent_id != 'observatory_probe' OR agent_id IS NULL THEN 1 ELSE 0 END) as agent_reported
     FROM interactions`
  ).first();

  const recentSplit = await db.prepare(
    `SELECT
       SUM(CASE WHEN agent_id = 'observatory_probe' THEN 1 ELSE 0 END) as probes_24h,
       SUM(CASE WHEN agent_id != 'observatory_probe' OR agent_id IS NULL THEN 1 ELSE 0 END) as agent_reported_24h
     FROM interactions WHERE timestamp > datetime('now', '-24 hours')`
  ).first();

  return {
    observatory: "Dominion Observatory",
    version: "1.1.0",
    total_servers_tracked: stats?.total_servers || 0,
    total_interactions_recorded: stats?.total_interactions || 0,
    average_trust_score: stats?.avg_trust_score ? Math.round(stats.avg_trust_score * 10) / 10 : null,
    interactions_last_24h: recentActivity?.count || 0,
    interaction_sources: {
      observatory_probes_total: sourceSplit?.probes || 0,
      agent_reported_total: sourceSplit?.agent_reported || 0,
      observatory_probes_24h: recentSplit?.probes_24h || 0,
      agent_reported_24h: recentSplit?.agent_reported_24h || 0
    },
    categories: (categories.results || []).map(c => ({ name: c.category, servers: c.count })),
    data_collection_started: "2026-04-08",
    message: "Observatory observes via active probes AND records agent-reported interactions. Probe-source and agent-source counts are tracked separately for honest baselines."
  };
}

async function handleComplianceReport(db, params) {
  const { server_url, agent_id, start_date, end_date } = params || {};

  let query = `
    SELECT i.id as interaction_id, i.timestamp, s.url as server_url, s.name as server_name,
           s.category, i.agent_id, i.tool_name, i.success, i.http_status, i.latency_ms,
           i.error_type, i.error_message
    FROM interactions i
    JOIN servers s ON i.server_id = s.id
    WHERE 1=1
  `;
  const binds = [];

  if (server_url) {
    query += " AND s.url = ?";
    binds.push(server_url);
  }
  if (agent_id) {
    query += " AND i.agent_id = ?";
    binds.push(agent_id);
  }
  if (start_date) {
    query += " AND i.timestamp >= ?";
    binds.push(start_date);
  }
  if (end_date) {
    query += " AND i.timestamp <= ?";
    binds.push(end_date + " 23:59:59");
  }
  query += " ORDER BY i.timestamp DESC LIMIT 1000";

  const stmt = binds.length > 0 ? db.prepare(query).bind(...binds) : db.prepare(query);
  const results = await stmt.all();

  return {
    compliance_framework: [
      "EU AI Act Article 12",
      "Singapore IMDA Agentic AI Governance Framework"
    ],
    generated_at: new Date().toISOString(),
    filters_applied: { server_url: server_url || null, agent_id: agent_id || null, start_date: start_date || null, end_date: end_date || null },
    total_records: (results.results || []).length,
    interactions: (results.results || []).map(r => ({
      interaction_id: r.interaction_id,
      timestamp: r.timestamp,
      server: { url: r.server_url, name: r.server_name, category: r.category },
      agent_id: r.agent_id,
      tool_called: r.tool_name,
      outcome: {
        success: !!r.success,
        http_status: r.http_status,
        latency_ms: r.latency_ms
      },
      error: r.error_type ? { type: r.error_type, message: r.error_message } : null
    })),
    attestation: "Dominion Observatory — behavioral audit trail. Data stored in Cloudflare D1, Singapore region."
  };
}

// ============================================================
// MCP PROTOCOL HANDLER
// ============================================================

async function handleMCPRequest(request, db) {
  const body = await request.json();
  const { method, id, params } = body;

  // JSON-RPC responses
  const respond = (result) => new Response(JSON.stringify({ jsonrpc: "2.0", id, result }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });

  const respondError = (code, message) => new Response(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });

  try {
    switch (method) {
      case "initialize":
        return respond({
          protocolVersion: "2025-11-05",
          capabilities: {
            tools: { listChanged: false },
            prompts: { listChanged: false },
            resources: { listChanged: false }
          },
          serverInfo: {
            name: "Dominion Observatory",
            version: "1.0.0"
          }
        });

      case "notifications/initialized":
        return respond({});

      case "prompts/list":
        return respond({
          prompts: [
            {
              name: "assess_server_trust",
              description: "Check trust score and reliability of an MCP server before using it. Provide the server URL and get a full trust assessment including score, latency, success rate, and recommendation.",
              arguments: [
                {
                  name: "server_url",
                  description: "The URL of the MCP server to assess",
                  required: true
                }
              ]
            },
            {
              name: "ecosystem_overview",
              description: "Get a high-level overview of the MCP server ecosystem — how many servers are tracked, top categories, and the current state of behavioral baselines.",
              arguments: []
            }
          ]
        });

      case "prompts/get": {
        const promptName = params?.name;
        if (promptName === "assess_server_trust") {
          const serverUrl = params?.arguments?.server_url || "https://example.com/mcp";
          return respond({
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: `Check the trust score for the MCP server at ${serverUrl}. Use the check_trust tool with this URL, then summarize whether it's safe to use — include the trust score, success rate, average latency, and your recommendation.`
                }
              }
            ]
          });
        } else if (promptName === "ecosystem_overview") {
          return respond({
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: "Get the current Observatory stats using the observatory_stats tool, then get the leaderboard of top servers. Summarize the ecosystem health: how many servers are tracked, how many interactions have been recorded, and which categories have the most reliable servers."
                }
              }
            ]
          });
        }
        return respondError(-32601, `Unknown prompt: ${promptName}`);
      }

      case "resources/list":
        return respond({
          resources: [
            {
              uri: "observatory://stats",
              name: "Observatory Statistics",
              description: "Current network-wide statistics including total servers tracked, interactions recorded, and category breakdown.",
              mimeType: "application/json"
            },
            {
              uri: "observatory://leaderboard",
              name: "Server Leaderboard",
              description: "Top-rated MCP servers across all categories, ranked by trust score.",
              mimeType: "application/json"
            }
          ]
        });

      case "resources/read": {
        const resourceUri = params?.uri;
        if (resourceUri === "observatory://stats") {
          const stats = await handleObservatoryStats(db);
          return respond({
            contents: [
              {
                uri: "observatory://stats",
                mimeType: "application/json",
                text: JSON.stringify(stats, null, 2)
              }
            ]
          });
        } else if (resourceUri === "observatory://leaderboard") {
          const leaderboard = await handleGetLeaderboard(db, { limit: 20 });
          return respond({
            contents: [
              {
                uri: "observatory://leaderboard",
                mimeType: "application/json",
                text: JSON.stringify(leaderboard, null, 2)
              }
            ]
          });
        }
        return respondError(-32002, `Unknown resource: ${resourceUri}`);
      }

      case "tools/list":
        return respond({ tools: TOOLS });

      case "tools/call": {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};

        let result;
        switch (toolName) {
          case "check_trust":
            result = await handleCheckTrust(db, toolArgs);
            break;
          case "report_interaction":
            result = await handleReportInteraction(db, toolArgs);
            break;
          case "get_leaderboard":
            result = await handleGetLeaderboard(db, toolArgs);
            break;
          case "get_baselines":
            result = await handleGetBaselines(db, toolArgs);
            break;
          case "check_anomaly":
            result = await handleCheckAnomaly(db, toolArgs);
            break;
          case "register_server":
            result = await handleRegisterServer(db, toolArgs);
            break;
          case "get_server_history":
            result = await handleGetServerHistory(db, toolArgs);
            break;
          case "observatory_stats":
            result = await handleObservatoryStats(db);
            break;
          case "get_compliance_report":
            result = await handleComplianceReport(db, toolArgs);
            break;
          default:
            return respondError(-32601, `Unknown tool: ${toolName}`);
        }

        return respond({
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        });
      }

      case "ping":
        return respond({});

      default:
        return respondError(-32601, `Method not supported: ${method}`);
    }
  } catch (err) {
    return respondError(-32603, `Internal error: ${err.message}`);
  }
}

// ============================================================
// MAIN WORKER EXPORT
// ============================================================

export default {
  // Cloudflare cron entry point. Configured in wrangler.jsonc.
  // Runs every 15 minutes; probes ~25 callable MCP endpoints per run.
  // Result: ~2,400 real probes/day = enough data for category baselines
  // independent of organic agent flywheel.
  async scheduled(controller, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        const result = await runProbeBatch(env.DB, 25);
        console.log("scheduled probe", JSON.stringify(result));
      } catch (e) {
        console.log("scheduled probe error", e.message);
      }
    })());
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const db = env.DB;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // Initialize DB schema on first request (idempotent)
    if (url.pathname === "/init" && request.method === "POST") {
      const statements = SCHEMA.split(';').filter(s => s.trim());
      for (const stmt of statements) {
        await db.prepare(stmt).run();
      }
      return new Response(JSON.stringify({ initialized: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Admin: cleanup self-tracking entries
    if (url.pathname === "/admin/cleanup-self" && request.method === "POST") {
      const deleted = await db.prepare("DELETE FROM servers WHERE url LIKE '%dominion-observatory%'").run();
      return new Response(JSON.stringify({ cleaned: true, changes: deleted.meta?.changes || 0 }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Admin: clean up rows whose `url` field was polluted by a bad bulk import
    // (e.g., `|description|||https://real.url/mcp`). Either repair them by
    // extracting the real URL, or delete unrecoverable rows. Token-gated.
    if (url.pathname === "/admin/clean-malformed-urls" && request.method === "POST") {
      const token = request.headers.get("x-admin-token") || url.searchParams.get("token");
      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401, headers: { "Content-Type": "application/json" }
        });
      }
      try {
      const dryRun = url.searchParams.get("dry_run") === "1";
      const bad = await db.prepare("SELECT id, url FROM servers WHERE url LIKE '|%' LIMIT 200").all();
      const rows = bad.results || [];
      // Build the plan in JS first, then dispatch via a single db.batch().
      const updates = [];
      const deletes = [];
      const seenUrls = new Set();
      for (const row of rows) {
        const m = row.url.match(/(https?:\/\/[^\s|]+)\s*$/);
        if (m) {
          const cleanUrl = m[1];
          // If this clean URL collides within this batch, drop the duplicate.
          if (seenUrls.has(cleanUrl)) {
            deletes.push(row.id);
          } else {
            seenUrls.add(cleanUrl);
            updates.push({ id: row.id, url: cleanUrl });
          }
        } else {
          deletes.push(row.id);
        }
      }
      let repaired = 0;
      let deleted = 0;
      let collisions = 0;
      if (!dryRun) {
        // Pre-check collisions with already-existing rows in one query.
        if (updates.length > 0) {
          const placeholders = updates.map(() => "?").join(",");
          const existing = await db.prepare(
            `SELECT url FROM servers WHERE url IN (${placeholders})`
          ).bind(...updates.map(u => u.url)).all();
          const existingSet = new Set((existing.results || []).map(r => r.url));
          // Move colliders from updates -> deletes.
          for (let i = updates.length - 1; i >= 0; i--) {
            if (existingSet.has(updates[i].url)) {
              deletes.push(updates[i].id);
              updates.splice(i, 1);
              collisions++;
            }
          }
        }
        const stmts = [];
        for (const u of updates) {
          stmts.push(db.prepare("UPDATE servers SET url = ? WHERE id = ?").bind(u.url, u.id));
        }
        for (const id of deletes) {
          stmts.push(db.prepare("DELETE FROM servers WHERE id = ?").bind(id));
        }
        if (stmts.length > 0) {
          const results = await db.batch(stmts);
          repaired = results.slice(0, updates.length).reduce((a, r) => a + (r.meta?.changes || 0), 0);
          deleted = results.slice(updates.length).reduce((a, r) => a + (r.meta?.changes || 0), 0);
        }
      } else {
        repaired = updates.length;
        deleted = deletes.length;
      }
      return new Response(JSON.stringify({
        scanned: rows.length, repaired, deleted, dry_run: dryRun, collisions
      }, null, 2), { headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message, stack: (e.stack || "").split("\n").slice(0, 5) }, null, 2), {
          status: 500, headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Admin: probe a single URL and return the raw response info. Diagnostic.
    if (url.pathname === "/admin/probe-one" && request.method === "POST") {
      const token = request.headers.get("x-admin-token") || url.searchParams.get("token");
      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401, headers: { "Content-Type": "application/json" }
        });
      }
      const target = url.searchParams.get("url");
      if (!target) return new Response(JSON.stringify({ error: "url required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const result = await probeOneServer({ url: target });
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Admin: trigger a probe batch immediately (token-gated). Used to verify
    // probing works without waiting for the next cron tick.
    if (url.pathname === "/admin/probe-now" && request.method === "POST") {
      const token = request.headers.get("x-admin-token") || url.searchParams.get("token");
      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401, headers: { "Content-Type": "application/json" }
        });
      }
      const max = Math.min(parseInt(url.searchParams.get("max") || "25"), 100);
      const result = await runProbeBatch(db, max);
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Admin: backfill categories for 'other'/'uncategorized' servers using inferCategory().
    // Token-gated via env.ADMIN_TOKEN. Processes one batch per call so it stays under
    // Worker CPU limits — caller paginates by passing offset.
    if (url.pathname === "/admin/recategorize" && request.method === "POST") {
      const token = request.headers.get("x-admin-token") || url.searchParams.get("token");
      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401, headers: { "Content-Type": "application/json" }
        });
      }
      const batchSize = Math.min(parseInt(url.searchParams.get("batch_size") || "500"), 1000);
      const afterId = parseInt(url.searchParams.get("after_id") || "0");
      const dryRun = url.searchParams.get("dry_run") === "1";
      const rows = await db.prepare(
        "SELECT id, name, description, url FROM servers WHERE category IN ('other', 'uncategorized') AND id > ? ORDER BY id LIMIT ?"
      ).bind(afterId, batchSize).all();
      const candidates = rows.results || [];
      const updates = [];
      const counts = {};
      let lastId = afterId;
      for (const row of candidates) {
        if (row.id > lastId) lastId = row.id;
        const newCat = inferCategory(row.name, row.description, row.url);
        if (newCat) {
          updates.push({ id: row.id, category: newCat });
          counts[newCat] = (counts[newCat] || 0) + 1;
        }
      }
      let updated = 0;
      if (!dryRun && updates.length > 0) {
        // Batch UPDATE via D1 transactional batch.
        const stmts = updates.map(u =>
          db.prepare("UPDATE servers SET category = ? WHERE id = ?").bind(u.category, u.id)
        );
        const results = await db.batch(stmts);
        updated = results.reduce((acc, r) => acc + (r.meta?.changes || 0), 0);
      }
      const remaining = await db.prepare(
        "SELECT COUNT(*) as c FROM servers WHERE category IN ('other', 'uncategorized')"
      ).first();
      return new Response(JSON.stringify({
        scanned: candidates.length,
        matched: updates.length,
        updated,
        dry_run: dryRun,
        next_after_id: lastId,
        done: candidates.length < batchSize,
        remaining_generic: remaining?.c || 0,
        category_counts_this_batch: counts
      }, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // MCP endpoint
    if (url.pathname === "/mcp" && request.method === "POST") {
      return handleMCPRequest(request, db);
    }

    // REST API for quick trust checks (non-MCP agents can use this too)
    if (url.pathname === "/api/trust" && request.method === "GET") {
      const serverUrl = url.searchParams.get("url");
      if (!serverUrl) return new Response(JSON.stringify({ error: "url parameter required" }), { status: 400 });
      const result = await handleCheckTrust(db, { server_url: serverUrl });
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // REST API for leaderboard
    if (url.pathname === "/api/leaderboard" && request.method === "GET") {
      const category = url.searchParams.get("category");
      const limit = parseInt(url.searchParams.get("limit") || "10");
      const result = await handleGetLeaderboard(db, { category, limit });
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // REST API for stats
    if (url.pathname === "/api/stats" && request.method === "GET") {
      const result = await handleObservatoryStats(db);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // REST API for reporting interactions (non-MCP agents can use this)
    if (url.pathname === "/api/report" && request.method === "POST") {
      try {
        const body = await request.json();
        if (!body.server_url || body.success === undefined) {
          return new Response(JSON.stringify({ error: "server_url and success (boolean) required" }), {
            status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }
        const result = await handleReportInteraction(db, body);
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // REST API for registering servers
    if (url.pathname === "/api/register" && request.method === "POST") {
      try {
        const body = await request.json();
        if (!body.server_url || !body.name) {
          return new Response(JSON.stringify({ error: "server_url and name required" }), {
            status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }
        const result = await handleRegisterServer(db, body);
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // REST API for compliance export
    if (url.pathname === "/api/compliance" && request.method === "GET") {
      const result = await handleComplianceReport(db, {
        server_url: url.searchParams.get("server_url"),
        agent_id: url.searchParams.get("agent_id"),
        start_date: url.searchParams.get("start_date"),
        end_date: url.searchParams.get("end_date")
      });
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // REST API for listing all tracked servers
    if (url.pathname === "/api/servers" && request.method === "GET") {
      const category = url.searchParams.get("category");
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
      let query = "SELECT url, name, category, trust_score, total_calls, first_seen FROM servers";
      const binds = [];
      if (category) {
        query += " WHERE category = ?";
        binds.push(category);
      }
      query += " ORDER BY trust_score DESC LIMIT ?";
      binds.push(limit);
      const stmt = binds.length > 1 ? db.prepare(query).bind(...binds) : db.prepare(query).bind(limit);
      const results = await stmt.all();
      return new Response(JSON.stringify({
        servers: (results.results || []).map(s => ({
          url: s.url, name: s.name, category: s.category,
          trust_score: Math.round(s.trust_score * 10) / 10,
          total_interactions: s.total_calls, tracked_since: s.first_seen
        })),
        total: (results.results || []).length
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Landing page
    return new Response(JSON.stringify({
      name: "Dominion Observatory",
      version: "1.0.0",
      description: "The behavioral trust layer for the AI agent economy. Check MCP server reliability before you call. Report outcomes to strengthen the trust network.",
      endpoints: {
        mcp: "/mcp",
        trust_check: "/api/trust?url=<server_url>",
        leaderboard: "/api/leaderboard?category=<category>&limit=<n>",
        stats: "/api/stats",
        report_interaction: "POST /api/report {server_url, success, latency_ms?, tool_name?, error_type?, error_message?, http_status?}",
        register_server: "POST /api/register {server_url, name, description?, category?, github_url?}",
        compliance_export: "/api/compliance?server_url=<url>&agent_id=<id>&start_date=<YYYY-MM-DD>&end_date=<YYYY-MM-DD>",
        servers_list: "/api/servers?category=<category>&limit=<n>"
      },
      tools: TOOLS.map(t => ({ name: t.name, description: t.description })),
      data_since: "2026-04-08",
      operator: "Dominion Agent Economy Engine",
      region: "Global (Cloudflare Edge)"
    }, null, 2), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
};
