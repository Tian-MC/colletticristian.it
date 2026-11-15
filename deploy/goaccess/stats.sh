#!/usr/bin/env bash
# Statistiche con GoAccess, lanciato ogni ora dal cron.
# Gli IP vengono accorciati prima: anonymize-ip vale solo per il rapporto, il database salva quelli completi.
set -euo pipefail
umask 077

here="$(cd "$(dirname "$0")" && pwd)"
log="${STATS_LOG:-/var/log/nginx/colletticristian.it.access.log}"
db="${STATS_DB:-${XDG_DATA_HOME:-$HOME/.local/share}/goaccess/colletticristian}"
out_dir="${STATS_DIR:-$HOME/statistiche}"
report="$out_dir/colletticristian.html"
state="$db/ultima-riga-importata"

mkdir -p "$db" "$out_dir"
work="$(mktemp -d "$db/.lavoro.XXXXXX")"
trap 'rm -rf "$work"' EXIT

export LANGUAGE=it
[[ "${LANG:-C}" == C* || "${LANG:-C}" == POSIX ]] && export LANG=en_US.UTF-8

goaccess=(goaccess --no-global-config --config-file="$here/goaccess.conf" --db-path="$db")

filter() {
	local after="$1" newest_file="$2"
	shift 2
	zcat -f -- "$@" | awk -v after="$after" -v newest_file="$newest_file" '
		BEGIN {
			split("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec", names, " ")
			for (i = 1; i <= 12; i++) month[names[i]] = sprintf("%02d", i)
		}
		{
			if (!match($0, /\[[0-9]+\/[A-Za-z]+\/[0-9]+:[0-9]+:[0-9]+:[0-9]+/)) next
			split(substr($0, RSTART + 1, RLENGTH - 1), p, /[\/:]/)
			ts = p[3] month[p[2]] p[1] p[4] p[5] p[6]
			if (ts <= after) next
			if (ts > newest) newest = ts

			ip = $1
			if (ip ~ /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/) {
				sub(/\.[0-9]+$/, ".0", ip)
			} else if (index(ip, ":")) {
				split(ip, g, ":")
				ip = g[1] == "" ? "::" : (g[2] == "" ? g[1] "::" : g[1] ":" g[2] "::")
			}
			print ip substr($0, length($1) + 1)
		}
		END { if (newest_file != "" && newest != "") print newest > newest_file }'
}

last="$(cat "$state" 2>/dev/null || echo 0)"

rotated=()
while IFS= read -r file; do rotated+=("$file"); done < <(ls -1v "$log".*.gz 2>/dev/null | tac)
[[ -r "$log.1" ]] && rotated+=("$log.1")

if ((${#rotated[@]})); then
	filter "$last" "$work/newest" "${rotated[@]}" >"$work/chiusi.log"
	if [[ -s "$work/chiusi.log" ]]; then
		"${goaccess[@]}" - --restore --persist --process-and-exit <"$work/chiusi.log"
		mv "$work/newest" "$state"
		last="$(cat "$state")"
	fi
fi

filter "$last" "" "$log" >"$work/oggi.log"
"${goaccess[@]}" - --restore --output="$work/rapporto.html" <"$work/oggi.log"
mv "$work/rapporto.html" "$report"
