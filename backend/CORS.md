# Configurações de CORS

Este documento explica como as configurações de CORS estão implementadas no backend.

## Como Funciona

O backend está configurado para aceitar requisições apenas de URLs específicas definidas na variável de ambiente `CORS_ORIGINS`.

### Configuração no `main.ts`

```typescript
// Lê a variável de ambiente CORS_ORIGINS e converte em array
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000']; // Valor padrão

app.enableCors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
});
```

### Variável de Ambiente

**Formato:** URLs separadas por vírgula
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://meudominio.com
```

### Exemplos de Configuração

**Desenvolvimento:**
```env
CORS_ORIGINS=http://localhost:3000,http://192.168.0.18:3000
```

**Produção:**
```env
CORS_ORIGINS=https://meuapp.com,https://www.meuapp.com,https://admin.meuapp.com
```

**Múltiplos Ambientes:**
```env
CORS_ORIGINS=https://staging.meuapp.com,https://prod.meuapp.com,http://localhost:3000
```

## Configurações Incluídas

- ✅ **Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS
- ✅ **Headers:** Content-Type, Authorization, Accept
- ✅ **Credentials:** Habilitado (permite cookies/headers de autenticação)
- ✅ **Origins:** Configurável via ambiente

## Segurança

⚠️ **Importante:** 
- Nunca use `*` (wildcard) em produção
- Sempre especifique as URLs exatas que devem ter acesso
- Mantenha a lista de origins atualizada
- Remova URLs de desenvolvimento em produção

## Testando

Para testar se o CORS está funcionando:

```bash
# Teste com curl
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8080/api/login
```

A resposta deve incluir headers como:
- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS`