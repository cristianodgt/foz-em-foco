#!/bin/bash
set -e

echo "🚀 Iniciando deploy Foz em Foco..."

git pull origin main

echo "📦 Instalando dependências..."
npm ci --production=false

echo "🗄️  Aplicando migrations..."
npx prisma migrate deploy

echo "🔨 Build..."
npm run build

echo "🔄 Reiniciando PM2..."
pm2 restart foz-em-foco || pm2 start ecosystem.config.js --env production

echo "✅ Deploy concluído!"
pm2 status foz-em-foco
