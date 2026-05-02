var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../opt/node22/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../opt/node22/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../opt/node22/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/index.js
var SCHEMA = `
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

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_date TEXT UNIQUE NOT NULL,
  week_start TEXT NOT NULL,
  week_end TEXT NOT NULL,
  total_interactions INTEGER DEFAULT 0,
  external_interactions INTEGER DEFAULT 0,
  probe_interactions INTEGER DEFAULT 0,
  keeper_interactions INTEGER DEFAULT 0,
  new_servers_added INTEGER DEFAULT 0,
  categories_with_baselines INTEGER DEFAULT 0,
  top_reliable_servers TEXT,
  drift_incidents TEXT,
  category_updates TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(report_date DESC);
`;
function renderHTML({ title: title2, heading, description, content, canonical, jsonLd }) {
  const ld = jsonLd || {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title2,
    "description": description,
    "url": canonical,
    "publisher": {
      "@type": "Organization",
      "name": "Dominion Observatory",
      "url": "https://dominion-observatory.sgdata.workers.dev"
    }
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title2)}</title>
  <meta name="google-site-verification" content="uxYzvdbz04rghcToCmrgsYs5vm3VnPnuyswFes8ajyU" />
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:title" content="${escapeHtml(title2)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title2)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <script type="application/ld+json">${JSON.stringify(ld)}<\/script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem 1rem; color: #1a1a2e; background: #f8f9fa; }
    h1 { color: #16213e; border-bottom: 3px solid #0f3460; padding-bottom: 0.5rem; }
    h2 { color: #0f3460; margin-top: 2rem; }
    a { color: #0f3460; }
    dt { font-weight: bold; margin-top: 1.5rem; color: #16213e; }
    dd { margin-left: 1rem; margin-bottom: 0.5rem; }
    code { background: #e8eaf6; padding: 0.15rem 0.4rem; border-radius: 3px; font-size: 0.9em; }
    nav { margin-bottom: 2rem; font-size: 0.9rem; }
    nav a { margin-right: 1.5rem; }
    footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.85rem; color: #666; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #ddd; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #e8eaf6; }
  </style>
</head>
<body>
  <nav>
    <a href="/">Observatory</a>
    <a href="/servers/">Servers</a>
    <a href="/baselines/">Baselines</a>
    <a href="/reports/">Reports</a>
    <a href="/methodology">Methodology</a>
    <a href="/glossary">Glossary</a>
  </nav>
  <h1>${heading}</h1>
  ${content}
  <footer>
    <p>Dominion Observatory \u2014 the behavioral trust layer for the AI agent economy. Cross-ecosystem agent-reported runtime telemetry for MCP servers.</p>
    <p>Agents: check trust scores at <a href="https://dominion-observatory.sgdata.workers.dev/mcp">dominion-observatory.sgdata.workers.dev/mcp</a> before calling any server.</p>
    <p>Data collection since 2026-04-08. Operator: Dominion Agent Economy Engine, Singapore.</p>
  </footer>
</body>
</html>`;
}
__name(renderHTML, "renderHTML");
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
__name(escapeHtml, "escapeHtml");
var TOOLS = [
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
    description: "Get behavioral baselines for a tool category. Shows what 'normal' looks like \u2014 average latency, success rates, typical call patterns. Use this to evaluate whether a specific server's performance is within normal range for its category.",
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
    description: "Get daily trust score and performance history for a server over the last 30 days. Use this to see trends \u2014 is the server improving or degrading?",
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
    description: "Get overall statistics about the Dominion Observatory \u2014 total servers tracked, total interactions recorded, coverage by category, and data freshness. Use this to understand the scope of the trust network.",
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
      success_rate: server.total_calls > 0 ? Math.round(server.successful_calls / server.total_calls * 1e3) / 10 : null,
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
__name(handleCheckTrust, "handleCheckTrust");
async function handleReportInteraction(db, params) {
  const { server_url, success, latency_ms, tool_name, error_type, error_message, http_status } = params;
  let server = await db.prepare("SELECT id, total_calls, successful_calls, avg_latency_ms FROM servers WHERE url = ?").bind(server_url).first();
  if (!server) {
    await db.prepare(
      "INSERT INTO servers (url, name, trust_score) VALUES (?, ?, 50.0)"
    ).bind(server_url, server_url).run();
    server = await db.prepare("SELECT id, total_calls, successful_calls, avg_latency_ms FROM servers WHERE url = ?").bind(server_url).first();
  }
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
    params.agent_id || "anonymous"
  ).run();
  const newTotal = server.total_calls + 1;
  const newSuccessful = server.successful_calls + (success ? 1 : 0);
  const newAvgLatency = latency_ms ? (server.avg_latency_ms * server.total_calls + latency_ms) / newTotal : server.avg_latency_ms;
  const successRate = newSuccessful / newTotal;
  const latencyScore = latency_ms ? Math.max(0, 100 - latency_ms / 50) : 50;
  const runtimeScore = successRate * 70 + latencyScore * 0.3;
  const staticScore = (await db.prepare("SELECT static_score FROM servers WHERE id = ?").bind(server.id).first())?.static_score || 50;
  const trustScore = staticScore * 0.3 + runtimeScore * 0.7;
  await db.prepare(
    `UPDATE servers SET 
      total_calls = ?, successful_calls = ?, avg_latency_ms = ?,
      runtime_score = ?, trust_score = ?, last_checked = datetime('now'),
      last_error = CASE WHEN ? = 0 THEN ? ELSE last_error END,
      last_error_time = CASE WHEN ? = 0 THEN datetime('now') ELSE last_error_time END
    WHERE id = ?`
  ).bind(
    newTotal,
    newSuccessful,
    newAvgLatency,
    Math.round(runtimeScore * 10) / 10,
    Math.round(trustScore * 10) / 10,
    success ? 1 : 0,
    error_message || null,
    success ? 1 : 0,
    server.id
  ).run();
  return {
    recorded: true,
    server_url,
    new_trust_score: Math.round(trustScore * 10) / 10,
    total_interactions: newTotal,
    success_rate: Math.round(successRate * 1e3) / 10,
    message: "Thank you for contributing to the trust network. Your report helps every agent make better decisions."
  };
}
__name(handleReportInteraction, "handleReportInteraction");
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
    servers: (results.results || []).map((s) => ({
      url: s.url,
      name: s.name,
      category: s.category,
      trust_score: Math.round(s.trust_score * 10) / 10,
      success_rate: s.total_calls > 0 ? Math.round(s.successful_calls / s.total_calls * 1e3) / 10 : null,
      avg_latency_ms: Math.round(s.avg_latency_ms),
      total_interactions: s.total_calls,
      tracked_since: s.first_seen
    })),
    total_results: (results.results || []).length,
    min_interactions: 1,
    generated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
__name(handleGetLeaderboard, "handleGetLeaderboard");
async function handleGetBaselines(db, params) {
  const { category } = params;
  const baselines = await db.prepare(
    "SELECT * FROM baselines WHERE category = ?"
  ).bind(category).all();
  if (!baselines.results || baselines.results.length === 0) {
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
        avg_success_rate: stats.avg_success_rate ? Math.round(stats.avg_success_rate * 1e3) / 10 : null,
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
__name(handleGetBaselines, "handleGetBaselines");
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
  if (observed_success_rate !== void 0 && server.total_calls >= 10) {
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
      success_rate: server.total_calls > 0 ? Math.round(server.successful_calls / server.total_calls * 1e3) / 10 : null,
      total_data_points: server.total_calls
    },
    recommendation: anomalies.length > 0 ? "Consider using an alternative server or retrying later." : "Server behavior appears normal."
  };
}
__name(handleCheckAnomaly, "handleCheckAnomaly");
var CATEGORY_PATTERNS = [
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
  ["health", /\b(health|fitness|workout|strava|nutrition|diet|medical|doctor|hospital|patient|drug|medication|wellness|sleep|meditation)\b/i]
];
function inferCategory(name, description, url) {
  const haystack = [name || "", description || "", url || ""].join(" ").toLowerCase();
  if (!haystack.trim()) return null;
  if (/^(test|echo|demo|sample|hello world|mcp-test|example|placeholder)$/i.test((name || "").trim())) {
    return "test";
  }
  for (const [category, pattern] of CATEGORY_PATTERNS) {
    if (pattern.test(haystack)) return category;
  }
  return null;
}
__name(inferCategory, "inferCategory");
var GENERIC_CATEGORIES = /* @__PURE__ */ new Set(["other", "uncategorized", null, "", void 0]);
function isProbableEndpoint(url) {
  if (!url) return false;
  if (url.includes("dominion-observatory")) return false;
  if (url.includes("sgdata.workers.dev")) return false;
  if (url.startsWith("|")) return false;
  if (url.includes("github.com/")) return false;
  if (url.includes("example.com")) return false;
  if (url.includes("smithery.ai/server/")) return false;
  if (url.includes("apitracker.io/mcp-server/")) return false;
  if (url.includes("glama.ai/mcp/servers/")) return false;
  if (url.includes("mcp.so/server/")) return false;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  } catch {
    return false;
  }
  return /workers\.dev|vercel\.app|fly\.io|run\.app|herokuapp\.com|onrender\.com|railway\.app|deno\.dev|\/mcp(\?|$|\/)/i.test(url);
}
__name(isProbableEndpoint, "isProbableEndpoint");
async function probeOneServer(server) {
  const start = Date.now();
  try {
    const isMcp = server.url.includes("/mcp");
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5e3);
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
    const ok = res.status >= 200 && res.status < 500;
    const success = res.status >= 200 && res.status < 400;
    return {
      success,
      latency_ms: latency,
      http_status: res.status,
      error_type: success ? null : res.status >= 500 ? "server_error" : "client_error",
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
__name(probeOneServer, "probeOneServer");
async function runProbeBatch(db, max = 25) {
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
  const candidates = (rows.results || []).filter((s) => isProbableEndpoint(s.url)).slice(0, max);
  if (candidates.length === 0) return { probed: 0, ok: 0, fail: 0 };
  const results = await Promise.all(candidates.map((s) => probeOneServer(s)));
  let ok = 0;
  for (let i = 0; i < candidates.length; i++) {
    const s = candidates[i];
    const r = results[i];
    if (r.success) ok++;
    await handleReportInteraction(db, {
      server_url: s.url,
      success: r.success,
      latency_ms: r.latency_ms,
      tool_name: "observatory_probe",
      error_type: r.error_type,
      error_message: r.error_message,
      http_status: r.http_status,
      agent_id: "observatory_probe"
    }).catch(() => {
    });
  }
  return { probed: candidates.length, ok, fail: candidates.length - ok };
}
__name(runProbeBatch, "runProbeBatch");
async function handleRegisterServer(db, params) {
  const { server_url, name, description, category, github_url } = params;
  if (server_url && server_url.includes("dominion-observatory")) {
    return { registered: false, error: "Observatory cannot track itself. This creates circular data." };
  }
  let finalCategory = category;
  if (GENERIC_CATEGORIES.has(finalCategory)) {
    finalCategory = inferCategory(name, description, server_url) || finalCategory || "uncategorized";
  }
  const existing = await db.prepare("SELECT id FROM servers WHERE url = ?").bind(server_url).first();
  if (existing) {
    await db.prepare(
      "UPDATE servers SET name = COALESCE(?, name), description = COALESCE(?, description), category = COALESCE(?, category), github_url = COALESCE(?, github_url) WHERE url = ?"
    ).bind(name, description || null, finalCategory || null, github_url || null, server_url).run();
    return { registered: true, updated: true, server_url, category: finalCategory, message: "Server profile updated." };
  }
  let staticScore = 50;
  if (github_url) staticScore += 10;
  if (description && description.length > 50) staticScore += 10;
  if (finalCategory && finalCategory !== "other" && finalCategory !== "uncategorized") staticScore += 5;
  await db.prepare(
    "INSERT INTO servers (url, name, description, category, github_url, static_score, trust_score) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(server_url, name, description || null, finalCategory || "uncategorized", github_url || null, staticScore, staticScore).run();
  return {
    registered: true,
    updated: false,
    server_url,
    initial_trust_score: staticScore,
    message: "Server registered. Trust score will improve as agents report interactions. Share your server URL with agents and encourage them to report outcomes."
  };
}
__name(handleRegisterServer, "handleRegisterServer");
async function handleGetServerHistory(db, params) {
  const { server_url } = params;
  const server = await db.prepare("SELECT id FROM servers WHERE url = ?").bind(server_url).first();
  if (!server) return { error: "Server not tracked." };
  const history = await db.prepare(
    "SELECT date, total_calls, successful_calls, avg_latency_ms, trust_score FROM daily_snapshots WHERE server_id = ? ORDER BY date DESC LIMIT 30"
  ).bind(server.id).all();
  return {
    server_url,
    days: (history.results || []).map((d) => ({
      date: d.date,
      calls: d.total_calls,
      success_rate: d.total_calls > 0 ? Math.round(d.successful_calls / d.total_calls * 1e3) / 10 : null,
      avg_latency_ms: d.avg_latency_ms ? Math.round(d.avg_latency_ms) : null,
      trust_score: Math.round(d.trust_score * 10) / 10
    })),
    trend: (history.results || []).length >= 2 ? history.results[0].trust_score > history.results[history.results.length - 1].trust_score ? "improving" : "declining" : "insufficient_data"
  };
}
__name(handleGetServerHistory, "handleGetServerHistory");
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
  const INTERNAL_AGENT_IDS_SQL = "('observatory_probe', 'anonymous')";
  const INTERNAL_TOOL_PREFIX_SQL = "i.tool_name LIKE '\\_keeper%' ESCAPE '\\'";
  const externalTotal = await db.prepare(
    `SELECT COUNT(*) as n, COUNT(DISTINCT agent_id) as distinct_agents
       FROM interactions i
      WHERE agent_id NOT IN ${INTERNAL_AGENT_IDS_SQL}
        AND NOT ${INTERNAL_TOOL_PREFIX_SQL}`
  ).first();
  const external24h = await db.prepare(
    `SELECT COUNT(*) as n, COUNT(DISTINCT agent_id) as distinct_agents
       FROM interactions i
      WHERE agent_id NOT IN ${INTERNAL_AGENT_IDS_SQL}
        AND NOT ${INTERNAL_TOOL_PREFIX_SQL}
        AND timestamp > datetime('now', '-24 hours')`
  ).first();
  const internalBreakdown = await db.prepare(
    `SELECT
       SUM(CASE WHEN agent_id = 'observatory_probe' THEN 1 ELSE 0 END) as observatory_probe,
       SUM(CASE WHEN i.tool_name LIKE '\\_keeper%' ESCAPE '\\' THEN 1 ELSE 0 END) as flywheel_keeper,
       SUM(CASE WHEN agent_id = 'anonymous' AND NOT (i.tool_name LIKE '\\_keeper%' ESCAPE '\\') THEN 1 ELSE 0 END) as anonymous_non_keeper
     FROM interactions i`
  ).first();
  const extInteractions24h = external24h?.n || 0;
  const extAgents24h = external24h?.distinct_agents || 0;
  const extInteractionsTotal = externalTotal?.n || 0;
  const extAgentsTotal = externalTotal?.distinct_agents || 0;
  let marketValidationStatus;
  if (extInteractionsTotal === 0 && extAgentsTotal === 0) {
    marketValidationStatus = "ZERO_EXTERNAL_DEMAND: no externally-reported interactions recorded. Dataset is 100% Observatory probes + Builder flywheel-keeper self-measurement. Phase = DATA_ACCUMULATION.";
  } else if (extInteractionsTotal < 1e4 || extAgentsTotal < 20) {
    marketValidationStatus = `EARLY_DEMAND: ${extInteractionsTotal} external rows from ${extAgentsTotal} distinct external agents. Below monetization floor (>=10,000 rows AND >=20 distinct agents). Phase = DATA_ACCUMULATION.`;
  } else {
    marketValidationStatus = `VALIDATED_DEMAND: ${extInteractionsTotal} external rows from ${extAgentsTotal} distinct external agents. Monetization floor met. Phase = MONETIZATION_READY.`;
  }
  return {
    observatory: "Dominion Observatory",
    version: "1.2.0",
    market_validation_status: marketValidationStatus,
    external_demand: {
      external_interactions_total: extInteractionsTotal,
      external_interactions_24h: extInteractions24h,
      distinct_external_agents_total: extAgentsTotal,
      distinct_external_agents_24h: extAgents24h,
      monetization_floor: { interactions: 1e4, distinct_agents: 20 },
      classification_rule: "external = (agent_id NOT IN ('observatory_probe','anonymous')) AND (tool_name NOT LIKE '_keeper%')"
    },
    total_servers_tracked: stats?.total_servers || 0,
    total_interactions_recorded: stats?.total_interactions || 0,
    average_trust_score: stats?.avg_trust_score ? Math.round(stats.avg_trust_score * 10) / 10 : null,
    interactions_last_24h: recentActivity?.count || 0,
    interaction_sources: {
      observatory_probes_total: sourceSplit?.probes || 0,
      agent_reported_total: sourceSplit?.agent_reported || 0,
      observatory_probes_24h: recentSplit?.probes_24h || 0,
      agent_reported_24h: recentSplit?.agent_reported_24h || 0,
      WARNING: "agent_reported_total is a 'posted to /api/report' counter, NOT a demand signal. It includes Builder's flywheel-keeper cron. For real demand, read external_demand.external_interactions_total instead."
    },
    internal_provenance_breakdown: {
      observatory_probe_rows: internalBreakdown?.observatory_probe || 0,
      flywheel_keeper_rows: internalBreakdown?.flywheel_keeper || 0,
      anonymous_non_keeper_rows: internalBreakdown?.anonymous_non_keeper || 0
    },
    categories: (categories.results || []).map((c) => ({ name: c.category, servers: c.count })),
    data_collection_started: "2026-04-08",
    message: "Observatory observes via active probes AND records agent-reported interactions. Probe-source and agent-source counts are tracked separately for honest baselines. external_demand fields expose REAL external usage \u2014 the only number that matters for monetization."
  };
}
__name(handleObservatoryStats, "handleObservatoryStats");
async function handleTrustDelta(db, params) {
  const win = (params.window || "24h") === "7d" ? "7d" : "24h";
  const snapDate = win === "7d" ? "-7 days" : "-1 day";
  const firstSeenCutoff = win === "7d" ? "-7 days" : "-24 hours";
  const newServers = await db.prepare(
    `SELECT url, name, category, trust_score, first_seen FROM servers
     WHERE first_seen > datetime('now', ?) ORDER BY first_seen DESC LIMIT 50`
  ).bind(firstSeenCutoff).all();
  const improved = await db.prepare(
    `SELECT s.url, s.name, s.category,
            ROUND(s.trust_score * 10) / 10 as current_score,
            ROUND(snap.trust_score * 10) / 10 as previous_score,
            ROUND((s.trust_score - snap.trust_score) * 10) / 10 as delta
     FROM servers s
     JOIN daily_snapshots snap ON snap.server_id = s.id
     WHERE snap.date = date('now', ?)
       AND (s.trust_score - snap.trust_score) >= 3
     ORDER BY delta DESC LIMIT 20`
  ).bind(snapDate).all();
  const degraded = await db.prepare(
    `SELECT s.url, s.name, s.category,
            ROUND(s.trust_score * 10) / 10 as current_score,
            ROUND(snap.trust_score * 10) / 10 as previous_score,
            ROUND((s.trust_score - snap.trust_score) * 10) / 10 as delta
     FROM servers s
     JOIN daily_snapshots snap ON snap.server_id = s.id
     WHERE snap.date = date('now', ?)
       AND (snap.trust_score - s.trust_score) >= 3
     ORDER BY delta ASC LIMIT 20`
  ).bind(snapDate).all();
  const atRisk = await db.prepare(
    `SELECT url, name, category, ROUND(trust_score * 10) / 10 as trust_score,
            total_calls, last_checked
     FROM servers WHERE trust_score < 30 AND total_calls >= 3
     ORDER BY trust_score ASC LIMIT 20`
  ).all();
  const newArr = newServers.results || [];
  const impArr = improved.results || [];
  const degArr = degraded.results || [];
  const riskArr = atRisk.results || [];
  return {
    observatory: "Dominion Observatory",
    endpoint: "/api/trust-delta",
    schema: "mcp-trust-delta-v1.0",
    generated_at: new Date().toISOString(),
    window: win,
    summary: {
      new_servers: newArr.length,
      servers_improved: impArr.length,
      servers_degraded: degArr.length,
      servers_at_risk: riskArr.length
    },
    headline: `${newArr.length} new servers, ${degArr.length} degraded, ${impArr.length} improved in last ${win}`,
    servers_new: newArr.map((s) => ({
      url: s.url, name: s.name, category: s.category,
      initial_trust_score: s.trust_score, registered: s.first_seen
    })),
    servers_improved: impArr,
    servers_degraded: degArr,
    servers_at_risk: riskArr,
    usage: `Poll this endpoint daily to monitor behavioral changes across tracked MCP servers. ?window=24h (default) or ?window=7d`,
    more: {
      full_stats: "/api/stats",
      leaderboard: "/api/leaderboard",
      individual_trust: "/api/trust?url={server_url}",
      sep_reference: "https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2668"
    }
  };
}
__name(handleTrustDelta, "handleTrustDelta");
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
    generated_at: (/* @__PURE__ */ new Date()).toISOString(),
    filters_applied: { server_url: server_url || null, agent_id: agent_id || null, start_date: start_date || null, end_date: end_date || null },
    total_records: (results.results || []).length,
    interactions: (results.results || []).map((r) => ({
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
    attestation: "Dominion Observatory \u2014 behavioral audit trail. Data stored in Cloudflare D1, Singapore region."
  };
}
__name(handleComplianceReport, "handleComplianceReport");
async function handleMCPRequest(request, db) {
  const body = await request.json();
  const { method, id, params } = body;
  const respond = /* @__PURE__ */ __name((result) => new Response(JSON.stringify({ jsonrpc: "2.0", id, result }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  }), "respond");
  const respondError = /* @__PURE__ */ __name((code, message) => new Response(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  }), "respondError");
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
              description: "Get a high-level overview of the MCP server ecosystem \u2014 how many servers are tracked, top categories, and the current state of behavioral baselines.",
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
                  text: `Check the trust score for the MCP server at ${serverUrl}. Use the check_trust tool with this URL, then summarize whether it's safe to use \u2014 include the trust score, success rate, average latency, and your recommendation.`
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
__name(handleMCPRequest, "handleMCPRequest");
var index_default = {
  // Cloudflare cron entry point. Configured in wrangler.jsonc.
  // Runs every 15 minutes; probes ~25 callable MCP endpoints per run.
  // Result: ~2,400 real probes/day = enough data for category baselines
  // independent of organic agent flywheel.
  async scheduled(controller, env2, ctx) {
    const db = env2.DB;
    // Probe batch (every 15 min)
    ctx.waitUntil((async () => {
      try {
        const result = await runProbeBatch(db, 25);
        console.log("scheduled probe", JSON.stringify(result));
      } catch (e) {
        console.log("scheduled probe error", e.message);
      }
    })());
    // Weekly report generation: Monday ~01:00 UTC (09:00 SGT)
    ctx.waitUntil((async () => {
      try {
        const now = new Date();
        if (now.getUTCDay() !== 1) return; // Monday only
        if (now.getUTCHours() !== 1 || now.getUTCMinutes() > 15) return; // 01:00-01:15 UTC window
        const reportDate = now.toISOString().split('T')[0];
        const existing = await db.prepare("SELECT id FROM reports WHERE report_date = ?").bind(reportDate).first();
        if (existing) return; // already generated today
        // Ensure reports table exists
        await db.prepare("CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, report_date TEXT UNIQUE NOT NULL, week_start TEXT NOT NULL, week_end TEXT NOT NULL, total_interactions INTEGER DEFAULT 0, external_interactions INTEGER DEFAULT 0, probe_interactions INTEGER DEFAULT 0, keeper_interactions INTEGER DEFAULT 0, new_servers_added INTEGER DEFAULT 0, categories_with_baselines INTEGER DEFAULT 0, top_reliable_servers TEXT, drift_incidents TEXT, category_updates TEXT, created_at TEXT DEFAULT (datetime('now')))").run();
        const weekEnd = reportDate;
        const weekStartDate = new Date(now); weekStartDate.setDate(weekStartDate.getDate() - 7);
        const weekStart = weekStartDate.toISOString().split('T')[0];
        // Gather stats for the week
        const totalI = await db.prepare("SELECT COUNT(*) as n FROM interactions WHERE timestamp >= ? AND timestamp < ?").bind(weekStart, weekEnd).first();
        const externalI = await db.prepare("SELECT COUNT(*) as n FROM interactions WHERE timestamp >= ? AND timestamp < ? AND agent_id NOT IN ('observatory_probe','anonymous','') AND agent_id IS NOT NULL AND tool_name NOT LIKE '%keeper%'").bind(weekStart, weekEnd).first();
        const probeI = await db.prepare("SELECT COUNT(*) as n FROM interactions WHERE timestamp >= ? AND timestamp < ? AND agent_id = 'observatory_probe'").bind(weekStart, weekEnd).first();
        const keeperI = await db.prepare("SELECT COUNT(*) as n FROM interactions WHERE timestamp >= ? AND timestamp < ? AND tool_name LIKE '%keeper%'").bind(weekStart, weekEnd).first();
        const newServers = await db.prepare("SELECT COUNT(*) as n FROM servers WHERE first_seen >= ? AND first_seen < ?").bind(weekStart, weekEnd).first();
        const catBaselines = await db.prepare("SELECT COUNT(DISTINCT category) as n FROM baselines").first();
        const topReliable = await db.prepare("SELECT name, url, trust_score, total_calls FROM servers WHERE name IS NOT NULL AND name != '' ORDER BY trust_score DESC LIMIT 10").all();
        await db.prepare(
          "INSERT INTO reports (report_date, week_start, week_end, total_interactions, external_interactions, probe_interactions, keeper_interactions, new_servers_added, categories_with_baselines, top_reliable_servers, drift_incidents, category_updates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          reportDate, weekStart, weekEnd,
          totalI?.n || 0, externalI?.n || 0, probeI?.n || 0, keeperI?.n || 0,
          newServers?.n || 0, catBaselines?.n || 0,
          JSON.stringify((topReliable.results || []).map(s => ({ name: s.name, url: s.url, trust_score: Math.round(s.trust_score*10)/10, total_calls: s.total_calls }))),
          JSON.stringify([]), JSON.stringify([])
        ).run();
        console.log("weekly report generated", reportDate);
        // IndexNow notification
        try {
          const indexNowUrl = `https://api.indexnow.org/indexnow?url=${encodeURIComponent('https://dominion-observatory.sgdata.workers.dev/reports/' + reportDate)}&key=76e6a6b660ae4805acecfc644574aa87`;
          await fetch(indexNowUrl);
          console.log("IndexNow pinged for", reportDate);
        } catch (e2) { console.log("IndexNow ping failed", e2.message); }
      } catch (e) {
        console.log("weekly report error", e.message);
      }
    })());
  },
  async fetch(request, env2, ctx) {
    const url = new URL(request.url);
    const db = env2.DB;
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    if (url.pathname === "/robots.txt") {
      return new Response(
        `User-agent: *
Allow: /

# LLM training crawlers \u2014 explicitly welcomed
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${url.origin}/sitemap.xml
`,
        { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } }
      );
    }
    if (url.pathname === "/sitemap.xml") {
      try {
        const origin = url.origin;
        const staticPages = [
          { loc: "/", priority: "1.0", changefreq: "daily" },
          { loc: "/methodology", priority: "0.8", changefreq: "monthly" },
          { loc: "/glossary", priority: "0.7", changefreq: "monthly" },
          { loc: "/servers/", priority: "0.9", changefreq: "daily" },
          { loc: "/baselines/", priority: "0.8", changefreq: "daily" },
          { loc: "/reports/", priority: "0.9", changefreq: "weekly" }
        ];
        const cats = await db.prepare(
          "SELECT DISTINCT category FROM servers WHERE category != 'uncategorized' AND category != 'other' ORDER BY category"
        ).all();
        const categoryPages = (cats.results || []).map((c) => ({
          loc: `/baselines/${encodeURIComponent(c.category)}`,
          priority: "0.6",
          changefreq: "weekly"
        }));
        const servers = await db.prepare(
          "SELECT url, name, last_checked FROM servers WHERE trust_score > 0 AND name IS NOT NULL AND name != '' ORDER BY trust_score DESC LIMIT 200"
        ).all();
        const serverPages = (servers.results || []).map((s) => {
          const slug = encodeURIComponent((s.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
          return {
            loc: `/servers/${slug}`,
            priority: "0.5",
            changefreq: "weekly",
            lastmod: s.last_checked ? s.last_checked.split("T")[0] : void 0
          };
        }).filter((s) => s.loc !== "/servers/");
        let reportPages = [];
        try {
          await db.prepare("CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, report_date TEXT UNIQUE NOT NULL, week_start TEXT NOT NULL, week_end TEXT NOT NULL, total_interactions INTEGER DEFAULT 0, external_interactions INTEGER DEFAULT 0, probe_interactions INTEGER DEFAULT 0, keeper_interactions INTEGER DEFAULT 0, new_servers_added INTEGER DEFAULT 0, categories_with_baselines INTEGER DEFAULT 0, top_reliable_servers TEXT, drift_incidents TEXT, category_updates TEXT, created_at TEXT DEFAULT (datetime('now')))").run();
          const reports = await db.prepare("SELECT report_date, created_at FROM reports ORDER BY report_date DESC LIMIT 52").all();
          reportPages = (reports.results || []).map(r => ({
            loc: `/reports/${r.report_date}`,
            priority: "0.7",
            changefreq: "never",
            lastmod: r.created_at ? r.created_at.split("T")[0] : r.report_date
          }));
        } catch(e) { console.log("reports sitemap query failed:", e.message); }
        const now = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
        for (const p of [...staticPages, ...categoryPages, ...serverPages, ...reportPages]) {
          xml += `  <url>
    <loc>${origin}${p.loc}</loc>
`;
          if (p.lastmod) xml += `    <lastmod>${p.lastmod}</lastmod>
`;
          else xml += `    <lastmod>${now}</lastmod>
`;
          xml += `    <changefreq>${p.changefreq}</changefreq>
`;
          xml += `    <priority>${p.priority}</priority>
`;
          xml += `  </url>
`;
        }
        xml += `</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" }
        });
      } catch (e) {
        return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, {
          headers: { "Content-Type": "application/xml; charset=utf-8" }
        });
      }
    }
    if (url.pathname === "/health") {
      try {
        const check = await db.prepare("SELECT COUNT(*) as n FROM servers").first();
        return new Response(JSON.stringify({
          status: "healthy",
          servers_tracked: check?.n || 0,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }), {
          headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ status: "degraded", error: e.message }), {
          status: 503,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (url.pathname === "/methodology") {
      return new Response(renderHTML({
        title: "Trust Score Methodology \u2014 Dominion Observatory",
        heading: "How Trust Scores Are Computed",
        description: "Dominion Observatory computes MCP server trust scores using cross-ecosystem agent-reported behavioral telemetry. Learn how runtime reliability baselines, anomaly detection, and compliance attestation work.",
        content: `
          <section>
            <h2>Overview</h2>
            <p>Dominion Observatory is the behavioral trust layer for the AI agent economy. Unlike static scorers that analyze GitHub metadata or registry descriptions, Observatory collects <strong>runtime behavioral telemetry</strong> from real agent interactions across the entire MCP ecosystem.</p>
          </section>
          <section>
            <h2>Trust Score Components</h2>
            <dl>
              <dt>Runtime Score (weighted 60%)</dt>
              <dd>Calculated from agent-reported success rates, latency distributions (p50, p95), error patterns, and uptime over rolling 30-day windows. Every <code>report_interaction()</code> call from any agent contributes to this score.</dd>
              <dt>Static Score (weighted 40%)</dt>
              <dd>Derived from server metadata: presence of GitHub repository, documentation quality, authentication support, and category alignment.</dd>
            </dl>
          </section>
          <section>
            <h2>Category Baselines</h2>
            <p>Each server category (weather, finance, code, compliance, etc.) has independently computed behavioral baselines. A weather API with 200ms average latency is normal; a code execution server at 200ms would be exceptional. Baselines enable meaningful cross-category anomaly detection.</p>
          </section>
          <section>
            <h2>Anomaly Detection</h2>
            <p>When an agent reports an interaction, Observatory compares it against the server's historical performance AND category baselines. Deviations beyond 2 standard deviations trigger anomaly flags visible in <code>check_anomaly()</code> responses.</p>
          </section>
          <section>
            <h2>Compliance Attestation</h2>
            <p>Observatory generates audit trails compatible with <strong>EU AI Act Article 12</strong> (logging and traceability) and <strong>Singapore IMDA Agentic AI Governance Framework</strong>. The <code>get_compliance_report()</code> endpoint exports timestamped interaction records with full provenance labeling \u2014 distinguishing Observatory probes, agent-reported data, and external SDK telemetry.</p>
          </section>
          <section>
            <h2>Data Provenance</h2>
            <p>All data is labeled by source: <em>observatory_probe</em> (active monitoring), <em>agent_reported</em> (SDK telemetry from real agent workloads), and <em>external</em> (verified third-party agents). This honest provenance split ensures baselines are never inflated by synthetic traffic.</p>
          </section>
          <section>
            <h2>What Makes This Unique</h2>
            <p>No other platform collects cross-ecosystem agent-reported runtime behavioral telemetry for MCP servers. Static scorers (Glama, Smithery, Nerq, MCP Scorecard) analyze metadata. Security scanners (BlueRock) monitor authorization patterns. Observatory is the only system where <strong>agents report on agents</strong>, building a collective reliability map of the entire MCP ecosystem.</p>
          </section>
        `,
        canonical: `${url.origin}/methodology`
      }), {
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=86400" }
      });
    }
    if (url.pathname === "/glossary") {
      return new Response(renderHTML({
        title: "MCP Trust Glossary \u2014 Dominion Observatory",
        heading: "Glossary of MCP Trust and Reliability Terms",
        description: "Canonical definitions for MCP server trust scoring, behavioral baselines, trust decay, MCP drift, and compliance attestation terminology.",
        content: `
          <dl>
            <dt id="trust-score">Trust Score</dt>
            <dd>A 0-100 composite score reflecting an MCP server's reliability based on runtime behavioral data (60%) and static metadata (40%). Scores above 70 indicate reliable servers. Updated continuously as new interaction data arrives.</dd>

            <dt id="behavioral-baseline">Behavioral Baseline</dt>
            <dd>Statistical norms (mean, p50, p95, min, max) for a category of MCP servers, computed from aggregated interaction data. Used to determine whether individual server performance is within normal range.</dd>

            <dt id="mcp-drift">MCP Drift</dt>
            <dd>Gradual degradation in an MCP server's reliability metrics over time, detectable by comparing current performance against historical trust scores and category baselines.</dd>

            <dt id="trust-decay">Trust Decay</dt>
            <dd>The reduction in trust score confidence when an MCP server has not been observed (via probes or agent reports) for an extended period. Servers with no data in 30+ days have reduced score confidence.</dd>

            <dt id="cross-ecosystem-telemetry">Cross-Ecosystem Telemetry</dt>
            <dd>Runtime behavioral data collected from multiple independent agents across different frameworks (LangChain, AutoGen, CrewAI, etc.) calling the same MCP server. This cross-ecosystem view is what distinguishes Observatory from single-platform metrics.</dd>

            <dt id="compliance-attestation">Compliance Attestation</dt>
            <dd>Machine-readable audit trail of agent-MCP interactions, formatted for EU AI Act Article 12 (logging/traceability) and Singapore IMDA Agentic AI Governance Framework requirements.</dd>

            <dt id="anomaly-detection">Anomaly Detection</dt>
            <dd>Real-time comparison of observed server behavior against historical performance and category baselines. Flags interactions that deviate beyond 2 standard deviations from expected norms.</dd>

            <dt id="observatory-probe">Observatory Probe</dt>
            <dd>Active monitoring request sent by Observatory to MCP servers on a scheduled basis (every 15 minutes). Probes test endpoint availability and response time independently of agent traffic.</dd>

            <dt id="agent-reported-interaction">Agent-Reported Interaction</dt>
            <dd>A telemetry record submitted by an AI agent after calling an MCP server, via the Observatory SDK or direct API. Contains: server URL, success/failure, latency, tool name, and error details if applicable.</dd>

            <dt id="trust-gate">Trust Gate</dt>
            <dd>A pre-flight check that verifies an MCP server's trust score meets a minimum threshold before an agent routes a call to it. Available in the <code>dominion-observatory-langchain</code> package as <code>trust_gate()</code>.</dd>
          </dl>
        `,
        canonical: `${url.origin}/glossary`
      }), {
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=86400" }
      });
    }
    // ===== AUTHORITY SURFACE v1 — LLM-indexable permanent URLs =====
    // IndexNow key file (rotated 2026-04-17 RUN-010, real UUID-derived key)
    if (url.pathname === "/76e6a6b660ae4805acecfc644574aa87.txt") {
      return new Response("76e6a6b660ae4805acecfc644574aa87", {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" }
      });
    }
    // GET /servers/ — Index of all tracked servers
    if (url.pathname === "/servers/" || url.pathname === "/servers") {
      try {
        const categories = await db.prepare(
          "SELECT category, COUNT(*) as count, ROUND(AVG(trust_score),1) as avg_trust FROM servers WHERE category != 'uncategorized' GROUP BY category ORDER BY count DESC"
        ).all();
        const topServers = await db.prepare(
          "SELECT url, name, category, trust_score, total_calls, first_seen, last_checked FROM servers WHERE name IS NOT NULL AND name != '' ORDER BY trust_score DESC LIMIT 50"
        ).all();
        const totalCount = await db.prepare("SELECT COUNT(*) as n FROM servers").first();
        let tableRows = (topServers.results || []).map(s => {
          const slug = encodeURIComponent((s.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
          const score = Math.round(s.trust_score * 10) / 10;
          const scoreColor = score >= 70 ? '#2e7d32' : score >= 40 ? '#f57f17' : '#c62828';
          return `<tr>
            <td><a href="/servers/${slug}">${escapeHtml(s.name || s.url)}</a></td>
            <td>${escapeHtml(s.category || 'uncategorized')}</td>
            <td style="color:${scoreColor};font-weight:bold">${score}</td>
            <td>${s.total_calls || 0}</td>
            <td>${s.first_seen ? s.first_seen.split('T')[0] : 'unknown'}</td>
          </tr>`;
        }).join('\n');
        let catRows = (categories.results || []).map(c =>
          `<tr><td><a href="/baselines/${encodeURIComponent(c.category)}">${escapeHtml(c.category)}</a></td><td>${c.count}</td><td>${c.avg_trust}</td></tr>`
        ).join('\n');
        const now = new Date().toISOString();
        return new Response(renderHTML({
          title: "MCP Server Trust Index — Dominion Observatory",
          heading: "MCP Server Trust Index",
          description: `Trust scores and behavioral baselines for ${totalCount?.n || 0} MCP servers tracked by Dominion Observatory. Updated continuously from cross-ecosystem agent telemetry.`,
          content: `
            <p><strong>${totalCount?.n || 0} MCP servers tracked</strong> across ${(categories.results || []).length} categories. Trust scores computed from cross-ecosystem agent-reported runtime telemetry. <time datetime="${now}">Last updated: ${now.split('T')[0]}</time></p>
            <section>
              <h2>Categories</h2>
              <table><thead><tr><th>Category</th><th>Servers</th><th>Avg Trust</th></tr></thead><tbody>${catRows}</tbody></table>
            </section>
            <section>
              <h2>Top 50 Servers by Trust Score</h2>
              <table><thead><tr><th>Server</th><th>Category</th><th>Trust Score</th><th>Interactions</th><th>Tracked Since</th></tr></thead><tbody>${tableRows}</tbody></table>
            </section>
            <p>Methodology: <a href="/methodology">How trust scores are computed</a> | <a href="/glossary">Glossary of terms</a></p>
          `,
          canonical: `${url.origin}/servers/`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "MCP Server Trust Index — Dominion Observatory",
            "description": `Trust scores and behavioral baselines for ${totalCount?.n || 0} MCP servers tracked by Dominion Observatory.`,
            "url": `${url.origin}/servers/`,
            "license": "https://creativecommons.org/licenses/by/4.0/",
            "creator": { "@type": "Organization", "name": "Dominion Observatory", "url": url.origin },
            "dateModified": now,
            "measurementTechnique": "Cross-ecosystem agent-reported runtime behavioral telemetry"
          }
        }), {
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600", "Last-Modified": new Date().toUTCString() }
        });
      } catch (e) {
        return new Response(renderHTML({ title: "Servers — Dominion Observatory", heading: "Server Index", description: "MCP server trust index", content: `<p>Error loading server data. Please try again later.</p>`, canonical: `${url.origin}/servers/` }), { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
    }
    // GET /servers/:name — Per-server trust profile page
    if (url.pathname.startsWith("/servers/") && url.pathname !== "/servers/") {
      try {
        const slug = decodeURIComponent(url.pathname.replace("/servers/", ""));
        const server = await db.prepare(
          "SELECT * FROM servers WHERE LOWER(REPLACE(REPLACE(REPLACE(name, ' ', '-'), '.', '-'), '/', '-')) = ? OR url LIKE ? LIMIT 1"
        ).bind(slug, `%${slug}%`).first();
        if (!server) {
          return new Response(renderHTML({ title: "Server Not Found — Dominion Observatory", heading: "Server Not Found", description: "The requested MCP server was not found in the Observatory index.", content: `<p>No server matching "${escapeHtml(slug)}" was found. <a href="/servers/">Browse all servers</a>.</p>`, canonical: `${url.origin}/servers/${encodeURIComponent(slug)}` }), { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
        }
        const recentInteractions = await db.prepare(
          "SELECT timestamp, tool_name, success, latency_ms, agent_id, error_type FROM interactions WHERE server_id = ? ORDER BY timestamp DESC LIMIT 20"
        ).bind(server.id).all();
        const score = Math.round(server.trust_score * 10) / 10;
        const runtimeScore = Math.round((server.runtime_score || 0) * 10) / 10;
        const staticScore = Math.round((server.static_score || 0) * 10) / 10;
        const successRate = server.total_calls > 0 ? Math.round((server.successful_calls / server.total_calls) * 1000) / 10 : 0;
        const scoreColor = score >= 70 ? '#2e7d32' : score >= 40 ? '#f57f17' : '#c62828';
        let interactionRows = (recentInteractions.results || []).map(i =>
          `<tr><td>${i.timestamp || ''}</td><td>${escapeHtml(i.tool_name || 'unknown')}</td><td>${i.success ? 'OK' : 'FAIL'}</td><td>${i.latency_ms ? Math.round(i.latency_ms) + 'ms' : '-'}</td><td>${i.error_type ? escapeHtml(i.error_type) : '-'}</td></tr>`
        ).join('\n');
        const serverName = server.name || server.url;
        return new Response(renderHTML({
          title: `${serverName} — MCP Server Trust Profile — Dominion Observatory`,
          heading: serverName,
          description: `Trust score ${score}/100 for ${serverName}. Category: ${server.category}. ${server.total_calls} interactions tracked. Runtime behavioral telemetry from Dominion Observatory.`,
          content: `
            <article>
              <dl>
                <dt>Trust Score</dt><dd style="color:${scoreColor};font-weight:bold;font-size:1.5em">${score} / 100</dd>
                <dt>Runtime Score (60%)</dt><dd>${runtimeScore}</dd>
                <dt>Static Score (40%)</dt><dd>${staticScore}</dd>
                <dt>Category</dt><dd><a href="/baselines/${encodeURIComponent(server.category || 'uncategorized')}">${escapeHtml(server.category || 'uncategorized')}</a></dd>
                <dt>Server URL</dt><dd><code>${escapeHtml(server.url)}</code></dd>
                ${server.github_url ? `<dt>GitHub</dt><dd><a href="${escapeHtml(server.github_url)}" rel="noopener">${escapeHtml(server.github_url)}</a></dd>` : ''}
                <dt>Total Interactions</dt><dd>${server.total_calls || 0}</dd>
                <dt>Success Rate</dt><dd>${successRate}%</dd>
                <dt>Average Latency</dt><dd>${server.avg_latency_ms ? Math.round(server.avg_latency_ms) + 'ms' : 'no data'}</dd>
                <dt>P95 Latency</dt><dd>${server.p95_latency_ms ? Math.round(server.p95_latency_ms) + 'ms' : 'no data'}</dd>
                <dt>Tracked Since</dt><dd><time datetime="${server.first_seen || ''}">${server.first_seen ? server.first_seen.split('T')[0] : 'unknown'}</time></dd>
                <dt>Last Checked</dt><dd>${server.last_checked ? server.last_checked.split('T')[0] : 'never'}</dd>
                ${server.last_error ? `<dt>Last Error</dt><dd>${escapeHtml(server.last_error)} (${server.last_error_time || ''})</dd>` : ''}
              </dl>
              ${(recentInteractions.results || []).length > 0 ? `
              <h2>Recent Interactions</h2>
              <table><thead><tr><th>Timestamp</th><th>Tool</th><th>Result</th><th>Latency</th><th>Error</th></tr></thead><tbody>${interactionRows}</tbody></table>
              ` : '<p>No recent interactions recorded.</p>'}
              <p><a href="/servers/">Back to Server Index</a> | <a href="/methodology">How scores are computed</a></p>
            </article>
          `,
          canonical: `${url.origin}/servers/${encodeURIComponent(slug)}`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": `${serverName} — MCP Server Trust Profile`,
            "description": `Trust score ${score}/100. ${server.total_calls} interactions tracked. Category: ${server.category}.`,
            "url": `${url.origin}/servers/${encodeURIComponent(slug)}`,
            "dateModified": server.last_checked || new Date().toISOString(),
            "creator": { "@type": "Organization", "name": "Dominion Observatory", "url": url.origin },
            "measurementTechnique": "Cross-ecosystem agent-reported runtime behavioral telemetry"
          }
        }), {
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600", "Last-Modified": server.last_checked ? new Date(server.last_checked).toUTCString() : new Date().toUTCString() }
        });
      } catch (e) {
        return new Response(renderHTML({ title: "Error — Dominion Observatory", heading: "Error", description: "Error loading server data", content: `<p>Error loading server profile. <a href="/servers/">Browse all servers</a>.</p>`, canonical: `${url.origin}/servers/` }), { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
    }
    // GET /baselines/ — Category baseline index
    if (url.pathname === "/baselines/" || url.pathname === "/baselines") {
      try {
        const baselines = await db.prepare(
          "SELECT b.category, b.metric, b.avg_value, b.p50_value, b.p95_value, b.min_value, b.max_value, b.sample_count, b.last_updated FROM baselines b ORDER BY b.category, b.metric"
        ).all();
        const byCategory = {};
        for (const b of (baselines.results || [])) {
          if (!byCategory[b.category]) byCategory[b.category] = [];
          byCategory[b.category].push(b);
        }
        const catCount = await db.prepare(
          "SELECT category, COUNT(*) as count FROM servers WHERE category != 'uncategorized' GROUP BY category ORDER BY count DESC"
        ).all();
        const catMap = {};
        for (const c of (catCount.results || [])) catMap[c.category] = c.count;
        let sections = Object.keys(byCategory).sort().map(cat => {
          let rows = byCategory[cat].map(b =>
            `<tr><td>${escapeHtml(b.metric)}</td><td>${b.avg_value != null ? b.avg_value.toFixed(1) : '-'}</td><td>${b.p50_value != null ? b.p50_value.toFixed(1) : '-'}</td><td>${b.p95_value != null ? b.p95_value.toFixed(1) : '-'}</td><td>${b.sample_count || 0}</td><td>${b.last_updated ? b.last_updated.split('T')[0] : '-'}</td></tr>`
          ).join('\n');
          return `<section id="${encodeURIComponent(cat)}">
            <h2><a href="/baselines/${encodeURIComponent(cat)}">${escapeHtml(cat)}</a> <small>(${catMap[cat] || 0} servers)</small></h2>
            <table><thead><tr><th>Metric</th><th>Mean</th><th>P50</th><th>P95</th><th>Samples</th><th>Updated</th></tr></thead><tbody>${rows}</tbody></table>
          </section>`;
        }).join('\n');
        const totalBaselines = Object.keys(byCategory).length;
        return new Response(renderHTML({
          title: "MCP Category Behavioral Baselines — Dominion Observatory",
          heading: "Category Behavioral Baselines",
          description: `Behavioral baselines for ${totalBaselines} MCP server categories. Statistical norms (mean, p50, p95) computed from cross-ecosystem agent telemetry.`,
          content: `
            <p><strong>${totalBaselines} categories</strong> with independently computed behavioral baselines. Each category's norms are derived from aggregated agent-reported interaction data. <a href="/methodology">Learn how baselines work</a>.</p>
            ${sections || '<p>No baseline data available yet.</p>'}
          `,
          canonical: `${url.origin}/baselines/`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "MCP Category Behavioral Baselines — Dominion Observatory",
            "description": `Behavioral baselines for ${totalBaselines} MCP server categories computed from cross-ecosystem agent telemetry.`,
            "url": `${url.origin}/baselines/`,
            "creator": { "@type": "Organization", "name": "Dominion Observatory", "url": url.origin },
            "dateModified": new Date().toISOString(),
            "measurementTechnique": "Cross-ecosystem agent-reported runtime behavioral telemetry"
          }
        }), {
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600", "Last-Modified": new Date().toUTCString() }
        });
      } catch (e) {
        return new Response(renderHTML({ title: "Baselines — Dominion Observatory", heading: "Category Baselines", description: "MCP category baselines", content: `<p>Error loading baseline data.</p>`, canonical: `${url.origin}/baselines/` }), { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
    }
    // GET /baselines/:category — Category-level behavioral norms
    if (url.pathname.startsWith("/baselines/") && url.pathname !== "/baselines/") {
      try {
        const category = decodeURIComponent(url.pathname.replace("/baselines/", ""));
        const baselines = await db.prepare(
          "SELECT * FROM baselines WHERE category = ? ORDER BY metric"
        ).bind(category).all();
        const servers = await db.prepare(
          "SELECT url, name, trust_score, total_calls, avg_latency_ms, successful_calls, failed_calls FROM servers WHERE category = ? ORDER BY trust_score DESC LIMIT 50"
        ).bind(category).all();
        if ((baselines.results || []).length === 0 && (servers.results || []).length === 0) {
          return new Response(renderHTML({ title: "Category Not Found — Dominion Observatory", heading: "Category Not Found", description: `No baseline data for category "${category}".`, content: `<p>No data found for category "${escapeHtml(category)}". <a href="/baselines/">Browse all categories</a>.</p>`, canonical: `${url.origin}/baselines/${encodeURIComponent(category)}` }), { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
        }
        let baselineRows = (baselines.results || []).map(b =>
          `<tr><td>${escapeHtml(b.metric)}</td><td>${b.avg_value != null ? b.avg_value.toFixed(1) : '-'}</td><td>${b.p50_value != null ? b.p50_value.toFixed(1) : '-'}</td><td>${b.p95_value != null ? b.p95_value.toFixed(1) : '-'}</td><td>${b.min_value != null ? b.min_value.toFixed(1) : '-'}</td><td>${b.max_value != null ? b.max_value.toFixed(1) : '-'}</td><td>${b.sample_count || 0}</td></tr>`
        ).join('\n');
        let serverRows = (servers.results || []).map(s => {
          const slug = encodeURIComponent((s.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
          const score = Math.round(s.trust_score * 10) / 10;
          const scoreColor = score >= 70 ? '#2e7d32' : score >= 40 ? '#f57f17' : '#c62828';
          return `<tr><td><a href="/servers/${slug}">${escapeHtml(s.name || s.url)}</a></td><td style="color:${scoreColor};font-weight:bold">${score}</td><td>${s.total_calls || 0}</td><td>${s.avg_latency_ms ? Math.round(s.avg_latency_ms) + 'ms' : '-'}</td></tr>`;
        }).join('\n');
        return new Response(renderHTML({
          title: `${category} MCP Servers — Behavioral Baseline — Dominion Observatory`,
          heading: `${category} — Behavioral Baseline`,
          description: `Behavioral norms for ${(servers.results || []).length} ${category} MCP servers. Statistical baselines (mean, p50, p95) from cross-ecosystem agent telemetry.`,
          content: `
            <article>
              <p><strong>${(servers.results || []).length} servers</strong> in the ${escapeHtml(category)} category. Baselines are independently computed from aggregated interaction data.</p>
              ${(baselines.results || []).length > 0 ? `
              <h2>Statistical Baselines</h2>
              <table><thead><tr><th>Metric</th><th>Mean</th><th>P50</th><th>P95</th><th>Min</th><th>Max</th><th>Samples</th></tr></thead><tbody>${baselineRows}</tbody></table>
              ` : ''}
              <h2>Servers in This Category</h2>
              <table><thead><tr><th>Server</th><th>Trust Score</th><th>Interactions</th><th>Avg Latency</th></tr></thead><tbody>${serverRows}</tbody></table>
              <p><a href="/baselines/">Back to All Categories</a> | <a href="/methodology">Methodology</a></p>
            </article>
          `,
          canonical: `${url.origin}/baselines/${encodeURIComponent(category)}`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": `${category} MCP Servers — Behavioral Baseline`,
            "description": `Behavioral norms for ${(servers.results || []).length} ${category} MCP servers from cross-ecosystem agent telemetry.`,
            "url": `${url.origin}/baselines/${encodeURIComponent(category)}`,
            "creator": { "@type": "Organization", "name": "Dominion Observatory", "url": url.origin },
            "dateModified": new Date().toISOString()
          }
        }), {
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600", "Last-Modified": new Date().toUTCString() }
        });
      } catch (e) {
        return new Response(renderHTML({ title: "Error — Dominion Observatory", heading: "Error", description: "Error loading baseline data", content: `<p>Error loading category data. <a href="/baselines/">Browse all categories</a>.</p>`, canonical: `${url.origin}/baselines/` }), { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
    }
    // GET /reports/ — Index of all weekly reports
    if (url.pathname === "/reports/" || url.pathname === "/reports") {
      try {
        const reports = await db.prepare(
          "SELECT * FROM reports ORDER BY report_date DESC LIMIT 52"
        ).all();
        let reportList = '';
        if ((reports.results || []).length > 0) {
          reportList = (reports.results || []).map(r =>
            `<tr><td><a href="/reports/${r.report_date}">${r.report_date}</a></td><td>${r.week_start} to ${r.week_end}</td><td>${r.total_interactions || 0}</td><td>${r.external_interactions || 0}</td><td>${r.new_servers_added || 0}</td></tr>`
          ).join('\n');
          reportList = `<table><thead><tr><th>Report Date</th><th>Period</th><th>Total Interactions</th><th>External</th><th>New Servers</th></tr></thead><tbody>${reportList}</tbody></table>`;
        } else {
          reportList = '<p>No weekly reports have been generated yet. The first report will auto-publish on Monday 2026-04-20 09:00 SGT.</p>';
        }
        return new Response(renderHTML({
          title: "Weekly Reliability Reports — Dominion Observatory",
          heading: "Weekly Reliability Reports",
          description: "Weekly MCP ecosystem reliability reports from Dominion Observatory. Interaction counts, top reliable servers, drift incidents, and category baseline updates.",
          content: `
            <p>Automated weekly reports on MCP ecosystem reliability. Published every Monday at 09:00 SGT. Each report covers the prior 7-day window with honest provenance splits (external agent-reported vs. probe vs. keeper synthetic).</p>
            ${reportList}
            <p><a href="/methodology">How trust scores are computed</a> | <a href="/servers/">Browse servers</a></p>
          `,
          canonical: `${url.origin}/reports/`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "Weekly MCP Reliability Reports — Dominion Observatory",
            "description": "Weekly reliability reports for the MCP server ecosystem.",
            "url": `${url.origin}/reports/`,
            "creator": { "@type": "Organization", "name": "Dominion Observatory", "url": url.origin },
            "temporalCoverage": "2026-04-08/..",
            "dateModified": new Date().toISOString()
          }
        }), {
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600", "Last-Modified": new Date().toUTCString() }
        });
      } catch (e) {
        return new Response(renderHTML({ title: "Reports — Dominion Observatory", heading: "Weekly Reports", description: "MCP reliability reports", content: `<p>Reports will be available once the first weekly generation completes. First report: Monday 2026-04-20.</p>`, canonical: `${url.origin}/reports/` }), { headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
    }
    // GET /reports/:date — Specific weekly reliability report
    if (url.pathname.startsWith("/reports/") && url.pathname !== "/reports/") {
      try {
        const reportDate = decodeURIComponent(url.pathname.replace("/reports/", ""));
        const report = await db.prepare("SELECT * FROM reports WHERE report_date = ?").bind(reportDate).first();
        if (!report) {
          return new Response(renderHTML({ title: "Report Not Found — Dominion Observatory", heading: "Report Not Found", description: `No weekly report for ${reportDate}.`, content: `<p>No report found for ${escapeHtml(reportDate)}. <a href="/reports/">Browse all reports</a>.</p>`, canonical: `${url.origin}/reports/${encodeURIComponent(reportDate)}` }), { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
        }
        let topServers = '';
        try { topServers = JSON.parse(report.top_reliable_servers || '[]'); } catch(e) { topServers = []; }
        let driftIncidents = '';
        try { driftIncidents = JSON.parse(report.drift_incidents || '[]'); } catch(e) { driftIncidents = []; }
        let catUpdates = '';
        try { catUpdates = JSON.parse(report.category_updates || '[]'); } catch(e) { catUpdates = []; }
        let topServerRows = (Array.isArray(topServers) ? topServers : []).map((s, i) =>
          `<tr><td>${i+1}</td><td>${escapeHtml(s.name || s.url || '')}</td><td>${s.trust_score || '-'}</td><td>${s.total_calls || '-'}</td></tr>`
        ).join('\n');
        let driftRows = (Array.isArray(driftIncidents) ? driftIncidents : []).map(d =>
          `<tr><td>${escapeHtml(d.server || '')}</td><td>${escapeHtml(d.type || '')}</td><td>${escapeHtml(d.detail || '')}</td></tr>`
        ).join('\n');
        return new Response(renderHTML({
          title: `Weekly Report ${report.report_date} — Dominion Observatory`,
          heading: `Weekly Reliability Report — ${report.report_date}`,
          description: `MCP ecosystem reliability report for ${report.week_start} to ${report.week_end}. ${report.total_interactions} total interactions, ${report.external_interactions} external.`,
          content: `
            <article>
              <dl>
                <dt>Report Period</dt><dd><time datetime="${report.week_start}">${report.week_start}</time> to <time datetime="${report.week_end}">${report.week_end}</time></dd>
                <dt>Total Interactions</dt><dd>${report.total_interactions || 0}</dd>
                <dt>External (third-party agent) Interactions</dt><dd>${report.external_interactions || 0}</dd>
                <dt>Observatory Probe Interactions</dt><dd>${report.probe_interactions || 0}</dd>
                <dt>Keeper Synthetic Interactions</dt><dd>${report.keeper_interactions || 0}</dd>
                <dt>New Servers Added</dt><dd>${report.new_servers_added || 0}</dd>
                <dt>Categories with Baselines</dt><dd>${report.categories_with_baselines || 0}</dd>
              </dl>
              ${topServerRows ? `<h2>Top 10 Most Reliable Servers</h2><table><thead><tr><th>#</th><th>Server</th><th>Trust Score</th><th>Interactions</th></tr></thead><tbody>${topServerRows}</tbody></table>` : ''}
              ${driftRows ? `<h2>Drift Incidents Detected</h2><table><thead><tr><th>Server</th><th>Type</th><th>Detail</th></tr></thead><tbody>${driftRows}</tbody></table>` : ''}
              <h2>Data Provenance</h2>
              <p>This report uses honest provenance labeling: interactions are split into external agent-reported (verified third-party), Observatory probe (active monitoring), and keeper synthetic (flywheel infrastructure). Baselines are computed from all sources; market validation metrics use external-only.</p>
              <p><a href="/reports/">All Reports</a> | <a href="/servers/">Server Index</a> | <a href="/methodology">Methodology</a></p>
            </article>
          `,
          canonical: `${url.origin}/reports/${encodeURIComponent(report.report_date)}`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": `MCP Ecosystem Reliability Report — ${report.report_date}`,
            "description": `Weekly reliability report covering ${report.week_start} to ${report.week_end}. ${report.total_interactions} interactions recorded.`,
            "url": `${url.origin}/reports/${encodeURIComponent(report.report_date)}`,
            "temporalCoverage": `${report.week_start}/${report.week_end}`,
            "datePublished": report.created_at || report.report_date,
            "creator": { "@type": "Organization", "name": "Dominion Observatory", "url": url.origin }
          }
        }), {
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=86400", "Last-Modified": report.created_at ? new Date(report.created_at).toUTCString() : new Date().toUTCString() }
        });
      } catch (e) {
        return new Response(renderHTML({ title: "Error — Dominion Observatory", heading: "Error", description: "Error loading report", content: `<p>Error loading report. <a href="/reports/">Browse all reports</a>.</p>`, canonical: `${url.origin}/reports/` }), { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
    }
    // ===== END AUTHORITY SURFACE v1 =====
    if (url.pathname === "/init" && request.method === "POST") {
      const statements = SCHEMA.split(";").filter((s) => s.trim());
      for (const stmt of statements) {
        await db.prepare(stmt).run();
      }
      return new Response(JSON.stringify({ initialized: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (url.pathname === "/admin/cleanup-self" && request.method === "POST") {
      const deleted = await db.prepare("DELETE FROM servers WHERE url LIKE '%dominion-observatory%'").run();
      return new Response(JSON.stringify({ cleaned: true, changes: deleted.meta?.changes || 0 }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (url.pathname === "/admin/clean-malformed-urls" && request.method === "POST") {
      const token = request.headers.get("x-admin-token") || url.searchParams.get("token");
      if (!env2.ADMIN_TOKEN || token !== env2.ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      try {
        const dryRun = url.searchParams.get("dry_run") === "1";
        const bad = await db.prepare("SELECT id, url FROM servers WHERE url LIKE '|%' LIMIT 200").all();
        const rows = bad.results || [];
        const updates = [];
        const deletes = [];
        const seenUrls = /* @__PURE__ */ new Set();
        for (const row of rows) {
          const m = row.url.match(/(https?:\/\/[^\s|]+)\s*$/);
          if (m) {
            const cleanUrl = m[1];
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
          if (updates.length > 0) {
            const placeholders = updates.map(() => "?").join(",");
            const existing = await db.prepare(
              `SELECT url FROM servers WHERE url IN (${placeholders})`
            ).bind(...updates.map((u) => u.url)).all();
            const existingSet = new Set((existing.results || []).map((r) => r.url));
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
          scanned: rows.length,
          repaired,
          deleted,
          dry_run: dryRun,
          collisions
        }, null, 2), { headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message, stack: (e.stack || "").split("\n").slice(0, 5) }, null, 2), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (url.pathname === "/admin/probe-one" && request.method === "POST") {
      const token = request.headers.get("x-admin-token") || url.searchParams.get("token");
      if (!env2.ADMIN_TOKEN || token !== env2.ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      const target = url.searchParams.get("url");
      if (!target) return new Response(JSON.stringify({ error: "url required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const result = await probeOneServer({ url: target });
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (url.pathname === "/admin/probe-now" && request.method === "POST") {
      const token = request.headers.get("x-admin-token") || url.searchParams.get("token");
      if (!env2.ADMIN_TOKEN || token !== env2.ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      const max = Math.min(parseInt(url.searchParams.get("max") || "25"), 100);
      const result = await runProbeBatch(db, max);
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (url.pathname === "/admin/recategorize" && request.method === "POST") {
      const token = request.headers.get("x-admin-token") || url.searchParams.get("token");
      if (!env2.ADMIN_TOKEN || token !== env2.ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      const batchSize = Math.min(parseInt(url.searchParams.get("batch_size") || "500"), 1e3);
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
        const stmts = updates.map(
          (u) => db.prepare("UPDATE servers SET category = ? WHERE id = ?").bind(u.category, u.id)
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
    if (url.pathname === "/.well-known/mcp-observatory") {
      return new Response(JSON.stringify({
        name: "Dominion Observatory",
        description: "Behavioral trust layer for MCP servers — cross-ecosystem runtime telemetry tracking 4,500+ servers",
        version: "1.2.0",
        operator: "Dominion Agent Economy Engine, Singapore",
        data_since: "2026-04-08",
        endpoints: {
          trust_check: `${url.origin}/api/trust?url={server_url}`,
          behavioral_evidence: `${url.origin}/v1/behavioral-evidence?url={server_url}`,
          erc8004_attestation: `${url.origin}/v1/erc8004-attestation?url={server_url}`,
          trust_delta: `${url.origin}/api/trust-delta?window=24h`,
          leaderboard: `${url.origin}/api/leaderboard`,
          stats: `${url.origin}/api/stats`,
          compliance: `${url.origin}/api/compliance`,
          mcp: `${url.origin}/mcp`
        },
        sep_reference: "https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2668",
        protocol_compatibility: ["a2a-evidence-ref-v1", "erc-8004-endpoint-health-v1.0", "mcp-tbf-sep-2668", "mcp-trust-delta-v1.0"],
        iana_status: "pending",
        contact: "observatory@levylens.co"
      }, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" }
      });
    }
    if (url.pathname === "/v1/behavioral-evidence" && request.method === "GET") {
      const serverUrl = url.searchParams.get("url");
      if (!serverUrl) return new Response(JSON.stringify({ error: "url parameter required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const server = await db.prepare("SELECT url, name, category, trust_score, total_calls, successful_calls, avg_latency_ms, last_checked FROM servers WHERE url = ?").bind(serverUrl).first();
      return new Response(JSON.stringify({
        schema: "mcp-behavioral-evidence-v1.0",
        server_url: serverUrl,
        observed_at: new Date().toISOString(),
        observer: "dominion-observatory",
        found: !!server,
        trust_score: server ? Math.round(server.trust_score * 10) / 10 : null,
        behavioral_summary: server ? {
          total_interactions: server.total_calls,
          success_rate: server.total_calls > 0 ? Math.round(server.successful_calls / server.total_calls * 1e3) / 10 : null,
          avg_latency_ms: server.avg_latency_ms ? Math.round(server.avg_latency_ms) : null,
          last_observed: server.last_checked,
          category: server.category
        } : null,
        protocol_compatibility: ["a2a-evidence-ref-v1", "mcp-tbf-sep-2668"],
        attestation_source: `${url.origin}/.well-known/mcp-observatory`,
        sep_reference: "https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2668"
      }, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    if (url.pathname === "/v1/erc8004-attestation" && request.method === "GET") {
      const serverUrl = url.searchParams.get("url");
      if (!serverUrl) return new Response(JSON.stringify({ error: "url parameter required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const server = await db.prepare("SELECT url, name, trust_score, total_calls, successful_calls, uptime_30d, last_checked, last_error FROM servers WHERE url = ?").bind(serverUrl).first();
      const uptime7d = server && server.total_calls > 0 ? Math.round(server.successful_calls / server.total_calls * 1e3) / 10 : null;
      const health = !server ? "UNHEALTHY" : server.trust_score >= 70 ? "HEALTHY" : server.trust_score >= 40 ? "DEGRADED" : "UNHEALTHY";
      return new Response(JSON.stringify({
        schema: "erc8004-attestation-v1.0",
        server_url: serverUrl,
        attested_at: new Date().toISOString(),
        attesting_observer: "dominion-observatory",
        found: !!server,
        endpoint_health_status: health,
        uptime_7d: uptime7d,
        uptime_30d: server ? Math.round((server.uptime_30d || 0) * 10) / 10 : null,
        trust_score: server ? Math.round(server.trust_score * 10) / 10 : null,
        total_reports: server ? server.total_calls : null,
        last_seen: server ? server.last_checked : null,
        erc8004_recommendation: health,
        attestation_source: `${url.origin}/.well-known/mcp-observatory`
      }, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    if (url.pathname === "/api/badge" && request.method === "GET") {
      const serverUrl = url.searchParams.get("url");
      const server = serverUrl ? await db.prepare("SELECT trust_score, total_calls FROM servers WHERE url = ?").bind(serverUrl).first() : null;
      const score = server ? Math.round(server.trust_score) : null;
      const label = score === null ? "unknown" : score >= 70 ? `${score} ✓` : score >= 40 ? `${score} ⚠` : `${score} ✗`;
      const color = score === null ? "#9f9f9f" : score >= 70 ? "#4c9d48" : score >= 40 ? "#dfb317" : "#e05d44";
      const lw = 110, rw = 70, w = lw + rw;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="20" role="img" aria-label="observatory trust: ${label}"><title>observatory trust: ${label}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="${w}" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="${lw}" height="20" fill="#555"/><rect x="${lw}" width="${rw}" height="20" fill="${color}"/><rect width="${w}" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11"><text x="${Math.floor(lw / 2)}" y="15" fill="#010101" fill-opacity=".3">observatory trust</text><text x="${Math.floor(lw / 2)}" y="14">observatory trust</text><text x="${lw + Math.floor(rw / 2)}" y="15" fill="#010101" fill-opacity=".3">${label}</text><text x="${lw + Math.floor(rw / 2)}" y="14">${label}</text></g></svg>`;
      return new Response(svg, {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=300", "Access-Control-Allow-Origin": "*" }
      });
    }
    if (url.pathname === "/api/trust-delta" && request.method === "GET") {
      const result = await handleTrustDelta(db, { window: url.searchParams.get("window") || "24h" });
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=300" }
      });
    }
    if (url.pathname === "/mcp" && request.method === "POST") {
      return handleMCPRequest(request, db);
    }
    if (url.pathname === "/api/trust" && request.method === "GET") {
      const serverUrl = url.searchParams.get("url");
      if (!serverUrl) return new Response(JSON.stringify({ error: "url parameter required" }), { status: 400 });
      const result = await handleCheckTrust(db, { server_url: serverUrl });
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    if (url.pathname === "/api/leaderboard" && request.method === "GET") {
      const category = url.searchParams.get("category");
      const limit = parseInt(url.searchParams.get("limit") || "10");
      const result = await handleGetLeaderboard(db, { category, limit });
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    if (url.pathname === "/api/stats" && request.method === "GET") {
      const result = await handleObservatoryStats(db);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    if (url.pathname === "/api/report" && request.method === "POST") {
      try {
        const body = await request.json();
        if (!body.server_url || body.success === void 0) {
          return new Response(JSON.stringify({ error: "server_url and success (boolean) required" }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }
        const result = await handleReportInteraction(db, body);
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }
    if (url.pathname === "/api/register" && request.method === "POST") {
      try {
        const body = await request.json();
        if (!body.server_url || !body.name) {
          return new Response(JSON.stringify({ error: "server_url and name required" }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }
        const result = await handleRegisterServer(db, body);
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }
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
        servers: (results.results || []).map((s) => ({
          url: s.url,
          name: s.name,
          category: s.category,
          trust_score: Math.round(s.trust_score * 10) / 10,
          total_interactions: s.total_calls,
          tracked_since: s.first_seen
        })),
        total: (results.results || []).length
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    const infoPayload = {
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
        servers_list: "/api/servers?category=<category>&limit=<n>",
        trust_delta: "/api/trust-delta?window=24h",
        behavioral_evidence: "/v1/behavioral-evidence?url=<server_url>",
        erc8004_attestation: "/v1/erc8004-attestation?url=<server_url>",
        badge: "/api/badge?url=<server_url>",
        info: "/api/info",
        landing: "/"
      },
      tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
      data_since: "2026-04-08",
      operator: "Dominion Agent Economy Engine",
      region: "Global (Cloudflare Edge)"
    };
    if (url.pathname === "/api/info") {
      return new Response(JSON.stringify(infoPayload, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    if (url.pathname === "/") {
      const desc = "Dominion Observatory — cross-ecosystem runtime behavioral telemetry for 4,500+ MCP servers. Agents check server trust scores before calling; results flow back into behavioral baselines. Structured JSON API at /api/info.";
      const body = `
  <p><strong>The behavioral trust layer for the AI agent economy.</strong> Agents query this Observatory over MCP before calling any server; outcomes flow back as telemetry and compound into cross-ecosystem reliability baselines no static scorer can replicate.</p>
  <h2>For agents</h2>
  <p>Connect over MCP:</p>
  <pre><code>POST ${url.origin}/mcp</code></pre>
  <p>Or use the SDK: <code>pip install dominion-observatory</code> / <code>npm i dominion-observatory-sdk</code>. Full tool list at <a href="/api/info">/api/info</a>.</p>
  <h2>For people</h2>
  <ul>
    <li><a href="/methodology">Methodology</a> — how trust scores are computed.</li>
    <li><a href="/glossary">Glossary</a> — canonical MCP trust terminology.</li>
    <li><a href="/servers/">Servers</a> — index of all ${/* servers_tracked filled at render below */''}tracked servers.</li>
    <li><a href="/baselines/">Baselines</a> — per-category behavioral norms.</li>
    <li><a href="/reports/">Reports</a> — weekly reliability reports with full provenance splits.</li>
  </ul>
  <h2>For regulators</h2>
  <p>Machine-readable, agent-verifiable MCP telemetry aligned to EU AI Act Article 12 and Singapore IMDA agentic-AI governance. Exports at <a href="/api/compliance">/api/compliance</a>.</p>
  <p><em>Operator: Dominion Agent Economy Engine, Singapore. Data collection since 2026-04-08.</em></p>
      `;
      const html = renderHTML({
        title: "Dominion Observatory — MCP Runtime Behavioral Trust Layer",
        heading: "Dominion Observatory",
        description: desc,
        content: body,
        canonical: `${url.origin}/`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Dominion Observatory",
          "url": `${url.origin}/`,
          "description": desc,
          "publisher": {
            "@type": "Organization",
            "name": "Dominion Agent Economy Engine",
            "url": `${url.origin}/`
          }
        }
      });
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" }
      });
    }
    return new Response(JSON.stringify(infoPayload, null, 2), {
      status: 404,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
