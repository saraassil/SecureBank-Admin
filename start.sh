#!/usr/bin/env bash
set -e

echo "=== SecureBank Admin — Démarrage ==="

# 1. Vérifier MySQL
if ! docker ps --format "{{.Names}}" | grep -q mysql-backend; then
  echo "[1/3] Démarrage MySQL..."
  docker start mysql-backend 2>/dev/null || docker run -d --name mysql-backend \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=flaskdb \
    -e MYSQL_USER=user2 \
    -e MYSQL_PASSWORD=1234 \
    -p 3306:3306 mysql:8
  sleep 5
else
  echo "[1/3] MySQL déjà lancé"
fi

# 2. Backend Flask (Socket.IO)
echo "[2/3] Démarrage backend (port 5000)..."
cd backend
if [ ! -d venv ]; then
  python3 -m venv venv
  venv/bin/pip install -r requirements.txt 2>/dev/null || echo "  (pas de requirements.txt, skipping)"
fi
fuser -k 5000/tcp 2>/dev/null || true
nohup venv/bin/python run.py > /tmp/flask.log 2>&1 &
BACKEND_PID=$!
echo "  PID=$BACKEND_PID — http://127.0.0.1:5000"
sleep 3

# 3. Frontend Vite
echo "[3/3] Démarrage frontend (port 5173)..."
cd ..
fuser -k 5173/tcp 2>/dev/null || true
nohup npx vite --host > /tmp/vite.log 2>&1 &
FRONTEND_PID=$!
echo "  PID=$FRONTEND_PID — http://localhost:5173"
sleep 3

echo ""
echo "=== Lancé ==="
echo "  Backend  : http://127.0.0.1:5000"
echo "  Frontend : http://localhost:5173"
echo "  Admin    : http://localhost:5173/loginadmin"
echo "              admin@test.com / 123456"
echo ""
echo "Pour arrêter : kill $BACKEND_PID $FRONTEND_PID"
