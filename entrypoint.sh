#!/bin/sh
set -eu

echo "🚀 Starting LavaMusic container..."

echo "🔄 Synchronizing database schema..."

bun run db:migrate

echo "✅ Database is ready"

echo "🎵 Starting Lavamusic..."

exec "$@"
