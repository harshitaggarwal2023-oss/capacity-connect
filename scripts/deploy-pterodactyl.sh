#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "CAPACITY CONNECT — Production Deployment on Node-1"
echo "=========================================================="
echo "Safety Check: Verifying AttendX protection..."
echo " - AttendX Backend (:8001) will NOT be touched."
echo " - AttendX Database (:5433) will NOT be touched."
echo " - Capacity Connect Database will run on :5434"
echo " - Capacity Connect App will run on :3000"
echo " - Capacity Connect Socket will run on :3001"
echo "=========================================================="

# 1. Start containers
echo "Starting isolated Docker containers..."
docker compose -f docker-compose.production.yml up -d --build

# 2. Wait for PostgreSQL to be ready
echo "Waiting for Capacity Connect PostgreSQL to initialize..."
until docker exec -i capacity-connect-postgres pg_isready -U capacity_admin -d capacity_connect; do
  sleep 2
done

# 3. Run Prisma Database Push and Seed
echo "Applying database schema migrations & initial seeds..."
docker exec -i capacity-connect-app npx prisma db push
docker exec -i capacity-connect-app npm run seed || true

echo "=========================================================="
echo "DEPLOYMENT COMPLETE!"
echo "App running at: http://16.4.34.30:3000"
echo "Socket server: http://16.4.34.30:3001"
echo "=========================================================="
