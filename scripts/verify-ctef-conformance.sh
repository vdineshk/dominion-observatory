#!/usr/bin/env bash
# CTEF v0.3.2 Conformance Verifier — re-runnable self-proof harness.
# CC0-1.0. Authored 2026-05-18 by Dominion Observatory.
#
# Usage: bash scripts/verify-ctef-conformance.sh [origin]
#   origin defaults to https://dominion-observatory.sgdata.workers.dev
#
# Exit codes:
#   0 = all conformance vectors PASS
#   1 = at least one vector FAILED (status mismatch, missing field, or field leakage)
#   2 = handler unreachable / unparseable
#
# This script is the reference harness for CTEF §4.5.3 self-attestation
# operators. Any operator publishing a .well-known/ctef-conformance handler
# can adapt this script to validate their own vectors.

set -uo pipefail

ORIGIN="${1:-https://dominion-observatory.sgdata.workers.dev}"
HANDLER_URL="${ORIGIN}/.well-known/ctef-conformance"

red()   { printf '\033[31m%s\033[0m' "$1"; }
green() { printf '\033[32m%s\033[0m' "$1"; }
yellow(){ printf '\033[33m%s\033[0m' "$1"; }

echo "CTEF v0.3.2 conformance verifier"
echo "Origin: $ORIGIN"
echo "Handler: $HANDLER_URL"
echo "Run at: $(date -u +%FT%TZ)"
echo

HANDLER=$(curl -sf "$HANDLER_URL") || {
  echo "$(red FAIL): handler unreachable"; exit 2;
}

CTEF_VERSION=$(echo "$HANDLER" | python3 -c "import json,sys;print(json.load(sys.stdin).get('ctef_version','?'))")
echo "Handler reports ctef_version=$CTEF_VERSION"
echo

FAILS=0
TOTAL=0

# Vector loop — parse handler, exercise each vector
VECTORS_JSON=$(echo "$HANDLER" | python3 -c "import json,sys;print(json.dumps(json.load(sys.stdin).get('conformance_vectors',[])))")
COUNT=$(echo "$VECTORS_JSON" | python3 -c "import json,sys;print(len(json.load(sys.stdin)))")

for i in $(seq 0 $((COUNT-1))); do
  TOTAL=$((TOTAL+1))
  V=$(echo "$VECTORS_JSON" | python3 -c "import json,sys;print(json.dumps(json.load(sys.stdin)[$i]))")
  LABEL=$(echo "$V" | python3 -c "import json,sys;print(json.load(sys.stdin).get('label','?'))")
  URI=$(echo "$V" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d.get('uri') or d.get('uri_pattern',''))")
  EXP_STATUS=$(echo "$V" | python3 -c "import json,sys;print(json.load(sys.stdin).get('expected_status',''))")
  EXP_FIELDS=$(echo "$V" | python3 -c "import json,sys;print(','.join(json.load(sys.stdin).get('expected_fields',[])))")
  EXP_ERR=$(echo "$V" | python3 -c "import json,sys;print(json.load(sys.stdin).get('expected_error_code',''))")
  LEAK=$(echo "$V" | python3 -c "import json,sys;print(','.join(json.load(sys.stdin).get('leakage_check',[])))")

  # uri_pattern with {silver_tier_subject} — substitute a canonical tracked subject
  if echo "$URI" | grep -q "{silver_tier_subject}"; then
    URI=$(echo "$URI" | sed "s|{silver_tier_subject}|https://sg-cpf-calculator-mcp.sgdata.workers.dev/mcp|")
  fi

  printf "[%d/%d] %s → %s\n" "$TOTAL" "$COUNT" "$LABEL" "$URI"

  RESP=$(curl -s -w "\n%{http_code}" "$URI") || { echo "  $(red FAIL): unreachable"; FAILS=$((FAILS+1)); continue; }
  ACTUAL_STATUS=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | head -n -1)

  if [ "$ACTUAL_STATUS" = "$EXP_STATUS" ]; then
    echo "  status: $ACTUAL_STATUS = $EXP_STATUS  $(green OK)"
  else
    echo "  status: $ACTUAL_STATUS != $EXP_STATUS  $(red FAIL)"
    FAILS=$((FAILS+1)); continue
  fi

  if [ -n "$EXP_FIELDS" ]; then
    MISSING=""
    for f in ${EXP_FIELDS//,/ }; do
      if ! echo "$BODY" | python3 -c "import json,sys;sys.exit(0 if '$f' in json.load(sys.stdin) else 1)" 2>/dev/null; then
        MISSING="$MISSING $f"
      fi
    done
    if [ -z "$MISSING" ]; then
      echo "  fields: all present ($EXP_FIELDS)  $(green OK)"
    else
      echo "  fields missing:$MISSING  $(red FAIL)"; FAILS=$((FAILS+1)); continue
    fi
  fi

  if [ -n "$EXP_ERR" ]; then
    ACTUAL_ERR=$(echo "$BODY" | python3 -c "import json,sys;print(json.load(sys.stdin).get('error_code',''))" 2>/dev/null)
    if [ "$ACTUAL_ERR" = "$EXP_ERR" ]; then
      echo "  error_code: $ACTUAL_ERR  $(green OK)"
    else
      echo "  error_code: '$ACTUAL_ERR' != '$EXP_ERR'  $(red FAIL)"; FAILS=$((FAILS+1)); continue
    fi
  fi

  if [ -n "$LEAK" ]; then
    LEAKED=""
    for check in ${LEAK//,/ }; do
      field="${check%_must_not_leak}"
      if echo "$BODY" | python3 -c "import json,sys;sys.exit(0 if '$field' in json.load(sys.stdin) else 1)" 2>/dev/null; then
        LEAKED="$LEAKED $field"
      fi
    done
    if [ -z "$LEAKED" ]; then
      echo "  leakage: none ($LEAK)  $(green OK)"
    else
      echo "  leakage: LEAKED$LEAKED  $(red FAIL)"; FAILS=$((FAILS+1)); continue
    fi
  fi

  echo "  vector $(green PASS)"
done

echo
if [ $FAILS -eq 0 ]; then
  echo "$(green ALL PASS): $TOTAL/$TOTAL conformance vectors verified."
  exit 0
else
  echo "$(red FAIL): $FAILS/$TOTAL vectors failed."
  exit 1
fi
