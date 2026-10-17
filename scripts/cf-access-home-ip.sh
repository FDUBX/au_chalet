#!/bin/bash
# -----------------------------------------------------------------------------
# Met à jour l'Access Group Cloudflare « Maison » avec l'IP publique courante.
# Une policy Access « Bypass » sur ce groupe donne l'accès sans login à la maison.
#
# Déploiement : Unraid > User Scripts, planification */10 * * * *
# Token API : permission « Account → Access: Organizations, Identity Providers,
#             and Groups → Edit » uniquement. Ne jamais commiter les valeurs.
# -----------------------------------------------------------------------------
set -euo pipefail

: "${CF_ACCOUNT_ID:?CF_ACCOUNT_ID manquant}"
: "${CF_ACCESS_GROUP_ID:?CF_ACCESS_GROUP_ID manquant}"
: "${CF_API_TOKEN:?CF_API_TOKEN manquant}"
GROUP_NAME="${CF_ACCESS_GROUP_NAME:-Maison}"
STATE_FILE="${STATE_FILE:-/tmp/cf_home_ip}"

IP4=$(curl -s4 --max-time 10 https://api.ipify.org || true)
IP6=$(curl -s6 --max-time 10 https://api64.ipify.org || true)

if [[ ! "$IP4" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "IPv4 introuvable, abandon" >&2
  exit 1
fi

INCLUDE="[{\"ip\":{\"ip\":\"${IP4}/32\"}}"
# IPv6 : on autorise le préfixe /64 du foyer (les appareils changent de suffixe).
if [[ "$IP6" == *:* ]]; then
  PREFIX6=$(echo "$IP6" | cut -d: -f1-4)
  INCLUDE+=",{\"ip\":{\"ip\":\"${PREFIX6}::/64\"}}"
fi
INCLUDE+="]"

CURRENT="${IP4}|${IP6}"
if [[ -f "$STATE_FILE" && "$(cat "$STATE_FILE")" == "$CURRENT" ]]; then
  exit 0
fi

RESPONSE=$(curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/access/groups/${CF_ACCESS_GROUP_ID}" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data "{\"name\":\"${GROUP_NAME}\",\"include\":${INCLUDE}}")

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "$CURRENT" > "$STATE_FILE"
  echo "Access Group mis à jour : ${CURRENT}"
else
  echo "Échec de la mise à jour : $RESPONSE" >&2
  exit 1
fi
