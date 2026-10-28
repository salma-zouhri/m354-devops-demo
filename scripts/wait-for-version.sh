#!/usr/bin/env sh
# Attend que l'URL publie le texte attendu (commit ou version) dans version.json.
# GitHub Pages passe par un CDN : la nouvelle version peut mettre une minute à apparaître.
# Usage : ./scripts/wait-for-version.sh <URL_DE_BASE> <TEXTE_ATTENDU>
set -eu
URL="${1%/}/version.json"
EXPECTED="$2"
for i in $(seq 1 30); do
  BODY="$(curl -fsS -H 'Cache-Control: no-cache' "$URL?t=$(date +%s)" || true)"
  if echo "$BODY" | grep -q "$EXPECTED"; then
    echo "OK, version en ligne : $BODY"
    exit 0
  fi
  echo "Tentative $i/30 : pas encore en ligne, nouvel essai dans 10 s"
  sleep 10
done
echo "ÉCHEC : $EXPECTED n'est pas en ligne sur $URL" >&2
exit 1
