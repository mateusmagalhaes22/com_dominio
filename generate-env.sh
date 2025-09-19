#!/bin/bash

# 🔐 Script para Gerar Variáveis Seguras para Produção
# Execute: chmod +x generate-env.sh && ./generate-env.sh

echo "🔐 Gerando variáveis seguras para produção..."
echo ""

# Gerar JWT Secret seguro (32 caracteres base64)
JWT_SECRET=$(openssl rand -base64 32 | tr -d '=' | head -c 32)

# Gerar senhas seguras
POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '=' | head -c 20)
ADMIN_PASSWORD=$(openssl rand -base64 16 | tr -d '=' | head -c 12)

echo "📋 COPIE ESTAS VARIÁVEIS PARA SUA PLATAFORMA DE DEPLOY:"
echo "=================================================="
echo ""
echo "# Database Configuration"
echo "POSTGRES_DB=com_dominio"
echo "POSTGRES_USER=postgres"
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
echo ""
echo "# Application Configuration"
echo "DB_HOST=localhost"
echo "DB_PORT=5432"
echo "DB_USERNAME=postgres"
echo "DB_PASSWORD=$POSTGRES_PASSWORD"
echo "DB_DATABASE=com_dominio"
echo ""
echo "# JWT Configuration"
echo "JWT_SECRET=$JWT_SECRET"
echo "JWT_EXPIRES_IN=7d"
echo ""
echo "# Server Configuration"
echo "PORT=8080"
echo ""
echo "# Admin User"
echo "ADMIN_USER=admin@exemplo.com"
echo "ADMIN_PASSWORD=$ADMIN_PASSWORD"
echo ""
echo "=================================================="
echo "🚨 IMPORTANTE: Guarde essas senhas em local seguro!"
echo "💾 Salve em um arquivo .env.production para referência"

# Criar arquivo .env.production (opcional)
cat > .env.production << EOF
# 🔐 Variáveis de Produção Geradas Automaticamente
# ATENÇÃO: NÃO FAÇA COMMIT DESTE ARQUIVO!

POSTGRES_DB=com_dominio
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$POSTGRES_PASSWORD

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=$POSTGRES_PASSWORD
DB_DATABASE=com_dominio

JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

PORT=8080

ADMIN_USER=admin@exemplo.com
ADMIN_PASSWORD=$ADMIN_PASSWORD
EOF

echo ""
echo "✅ Arquivo .env.production criado localmente (não faça commit!)"