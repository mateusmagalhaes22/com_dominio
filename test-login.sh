#!/bin/bash

# Script de teste para verificar se o login frontend/backend está funcionando

echo "🔍 Testando conectividade do sistema..."
echo ""

echo "1. Testando Backend (porta 8080)..."
curl -f http://localhost:8080/ > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Backend está rodando"
else
    echo "   ❌ Backend não está acessível"
fi

echo ""
echo "2. Testando Frontend (porta 3000)..."
curl -f http://localhost:3000/ > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Frontend está rodando"
else
    echo "   ❌ Frontend não está acessível"
fi

echo ""
echo "3. Testando Login API..."
response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@admin.com","password":"Admin123!"}' \
    http://localhost:8080/login)

if echo "$response" | grep -q "access_token"; then
    echo "   ✅ Login funcionando - Token JWT retornado"
    echo "   🔑 Token: $(echo "$response" | jq -r '.access_token' 2>/dev/null | cut -c1-50)..."
else
    echo "   ❌ Login falhou"
    echo "   📄 Resposta: $response"
fi

echo ""
echo "4. Testando CORS..."
cors_response=$(curl -s -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -X OPTIONS \
    -I http://localhost:8080/login)

if echo "$cors_response" | grep -q "Access-Control-Allow-Origin: http://localhost:3000"; then
    echo "   ✅ CORS configurado corretamente"
else
    echo "   ❌ CORS pode ter problemas"
fi

echo ""
echo "🎯 Teste completo! Agora tente fazer login em:"
echo "   Frontend: http://localhost:3000/pages/login"
echo "   Credenciais: admin@admin.com / Admin123!"