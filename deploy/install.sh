#!/usr/bin/env bash
# Uso: sudo ./deploy/install.sh (si puo' rilanciare)
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
	echo "va lanciato con sudo" >&2
	exit 1
fi

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$DEPLOY_DIR")"
SITE=colletticristian.it
WEBROOT=/var/www/$SITE
CERT=/etc/ssl/cloudflare/colletticristian
ENV_FILE=/etc/colletticristian/contact.env
SERVICE=colletticristian-contact
OWNER="${SUDO_USER:-tian}"

if [[ ! -f $CERT.pem || ! -f $CERT.key ]]; then
	echo "mancano $CERT.pem e/o $CERT.key: crea il certificato di origine su Cloudflare" >&2
	echo "(SSL/TLS -> Origin Server) per $SITE e *.$SITE" >&2
	exit 1
fi

if [[ ! -f $ENV_FILE ]]; then
	install -d -m 755 "$(dirname "$ENV_FILE")"
	install -m 600 "$DEPLOY_DIR/contact.env.example" "$ENV_FILE"
	echo "creato $ENV_FILE: scrivi token e chat del bot (sudo nano $ENV_FILE) e rilancia" >&2
	exit 1
fi
if ! grep -qE '^TELEGRAM_BOT_TOKEN=.+' "$ENV_FILE" || ! grep -qE '^TELEGRAM_CHAT_ID=.+' "$ENV_FILE"; then
	echo "in $ENV_FILE mancano TELEGRAM_BOT_TOKEN e/o TELEGRAM_CHAT_ID (sudo nano $ENV_FILE)" >&2
	exit 1
fi

chmod 600 "$CERT.key" "$ENV_FILE"

echo ">> cartella servita $WEBROOT (di proprieta' di $OWNER, per pubblicare senza sudo)"
install -d -m 755 -o "$OWNER" -g "$OWNER" "$WEBROOT"

echo ">> servizio del form ($SERVICE)"
install -d -m 755 /opt/$SERVICE
install -m 644 "$PROJECT_DIR/server/contact.mjs" /opt/$SERVICE/contact.mjs
install -m 644 "$DEPLOY_DIR/$SERVICE.service" /etc/systemd/system/$SERVICE.service
systemctl daemon-reload
systemctl enable $SERVICE
systemctl restart $SERVICE

echo ">> configurazione di Nginx"
install -m 644 "$DEPLOY_DIR/nginx/$SITE.conf" "/etc/nginx/sites-available/$SITE.conf"
ln -sf "/etc/nginx/sites-available/$SITE.conf" "/etc/nginx/sites-enabled/$SITE.conf"
nginx -t
systemctl reload nginx

sleep 1
systemctl --no-pager --lines=3 status $SERVICE

echo ">> fatto. Pubblica il sito con:"
echo "   npm run build && rsync -a --delete out/ $WEBROOT/"
