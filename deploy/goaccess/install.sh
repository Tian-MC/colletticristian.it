#!/usr/bin/env bash
# Uso: sudo apt install goaccess && ./deploy/goaccess/install.sh (si puo' rilanciare)
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
log="/var/log/nginx/colletticristian.it.access.log"

command -v goaccess >/dev/null || { echo "Manca GoAccess: installalo con  sudo apt install goaccess" >&2; exit 1; }
command -v crontab >/dev/null || { echo "Manca cron: installalo con  sudo apt install cron" >&2; exit 1; }
[[ -r "$log" ]] || { echo "Non riesco a leggere $log: l'utente deve essere nel gruppo adm." >&2; exit 1; }

echo "Importo i log degli ultimi giorni e creo il rapporto..."
"$here/stats.sh"

mkdir -p "$HOME/statistiche"
job="7 * * * * $here/stats.sh >/dev/null 2>>$HOME/statistiche/errori.log"
(crontab -l 2>/dev/null | grep -vF "$here/stats.sh" || true; echo "$job") | crontab -

echo "Fatto: le statistiche si aggiornano da sole ogni ora (al minuto 7)."
echo "Aprile nel browser: file://$HOME/statistiche/colletticristian.html"
