#!/bin/sh
set -e

# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma db push

# Execute command
exec "$@"