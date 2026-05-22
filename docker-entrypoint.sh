#!/bin/sh
set -e
cd /app

echo "[ecoride-react] Synchronisation des dépendances npm…"
npm install --no-audit --no-fund

if [ ! -f node_modules/sonner/package.json ]; then
  echo "[ecoride-react] sonner manquant dans node_modules, installation forcée…"
  npm install sonner@^2.0.7 --no-audit --no-fund
fi

exec npm run dev -- --host 0.0.0.0 --port 5173
