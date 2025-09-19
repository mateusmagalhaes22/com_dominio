# Configuração de Variáveis de Ambiente na Vercel

Este guia explica como configurar corretamente as variáveis de ambiente para o deploy na Vercel.

## ⚠️ Problema Atual

**Erro:** `POST https://com-dominio.vercel.app/pages/undefinedlogin 405`

**Causa:** A variável `NEXT_PUBLIC_API_URL` não está configurada na Vercel, resultando em `undefined` na URL.

## 🔧 Solução

### 1. Configurar Variável na Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto `com-dominio`
3. Vá em **Settings** → **Environment Variables**
4. Adicione a variável:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** URL do seu backend (ex: `https://api.seudominio.com/`)
   - **Environments:** Production, Preview, Development

### 2. Opções de Backend para Produção

**Opção A: Backend na Vercel**
```
NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app/
```

**Opção B: Backend em Railway**
```
NEXT_PUBLIC_API_URL=https://seu-app.up.railway.app/
```

**Opção C: Backend em Render**
```
NEXT_PUBLIC_API_URL=https://seu-app.onrender.com/
```

**Opção D: Backend próprio**
```
NEXT_PUBLIC_API_URL=https://api.seudominio.com/
```

### 3. Usando Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Adicionar variável
vercel env add NEXT_PUBLIC_API_URL

# Ou importar do arquivo .env
vercel env pull .env.production
```

### 4. Arquivo .env.production (Local)

Crie um arquivo `.env.production` para testar localmente:

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://sua-api-producao.com/
```

## 🚀 Deploy e Teste

1. **Configure a variável na Vercel**
2. **Redeploy o projeto:**
   ```bash
   git push origin main
   # ou
   vercel --prod
   ```
3. **Teste o login** em: https://com-dominio.vercel.app/pages/login

## 🔍 Verificação

Para verificar se a variável foi carregada corretamente, adicione temporariamente no código:

```typescript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

## 📋 Checklist de Deploy

- [ ] Variável `NEXT_PUBLIC_API_URL` configurada na Vercel
- [ ] Backend rodando e acessível
- [ ] CORS configurado para aceitar `https://com-dominio.vercel.app`
- [ ] SSL/HTTPS habilitado no backend
- [ ] Redeploy realizado após configurar variáveis

## ❗ Importante

- Variáveis que começam com `NEXT_PUBLIC_` são expostas no cliente
- Nunca coloque secrets/senhas em variáveis `NEXT_PUBLIC_`
- A URL deve terminar com `/` (barra final)
- Redeploy é necessário após alterar variáveis de ambiente