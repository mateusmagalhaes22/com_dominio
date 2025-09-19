# 🚀 Guia de Deploy - Como Colocar seu Projeto Online

## 📋 Preparação Antes do Deploy

### 1. **Commit e Push para GitHub**
```bash
git add .
git commit -m "Preparando para deploy em produção"
git push origin main
```

---

## 🌟 OPÇÃO 1: Railway (RECOMENDADO - Mais Fácil)

### **Por que Railway?**
- ✅ Deploy automático via GitHub
- ✅ PostgreSQL incluso
- ✅ Suporte nativo a Docker
- ✅ HTTPS automático
- ✅ Plano gratuito disponível

### **Passo a Passo:**

1. **Acesse:** https://railway.app
2. **Cadastre-se** com sua conta GitHub
3. **Novo Projeto:**
   - Click em "New Project"
   - Escolha "Deploy from GitHub repo"
   - Selecione seu repositório `com_dominio`

4. **Configure o Backend:**
   - Railway detectará automaticamente o `railway.toml`
   - Vá em "Variables" e adicione:
   ```
   POSTGRES_PASSWORD=SuaSenhaSegura123!
   POSTGRES_USER=postgres
   POSTGRES_DB=com_dominio
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=SuaSenhaSegura123!
   DB_DATABASE=com_dominio
   JWT_SECRET=seuJwtSecretSeguroAqui32caracteres
   JWT_EXPIRES_IN=7d
   PORT=8080
   ADMIN_USER=admin@exemplo.com
   ADMIN_PASSWORD=SuaSenhaAdmin123!
   ```

5. **Adicione PostgreSQL:**
   - Click em "Add Service"
   - Escolha "Database" → "PostgreSQL"
   - Railway conectará automaticamente

6. **Deploy:**
   - O deploy acontece automaticamente
   - Em alguns minutos seu projeto estará online!

### **📱 URL da sua aplicação:** 
Railway fornecerá uma URL como: `https://seu-projeto-production.up.railway.app`

---

## 🎨 OPÇÃO 2: Render

### **Passo a Passo:**

1. **Acesse:** https://render.com
2. **Cadastre-se** com GitHub
3. **Novo Web Service:**
   - Click "New" → "Web Service"
   - Conecte seu repo GitHub
   - Selecione `com_dominio`

4. **Configurações:**
   - **Name:** com-dominio-backend
   - **Environment:** Docker
   - **Region:** Oregon (US West)
   - **Branch:** main
   - **Docker Command:** Deixe em branco (usará o Dockerfile)

5. **Variáveis de Ambiente:** (mesmo do Railway acima)

6. **PostgreSQL:**
   - Vá em "Database" → "New PostgreSQL"
   - Conecte com seu backend

### **💰 Custos:**
- **Railway:** Gratuito até $5/mês uso, depois $20/mês
- **Render:** $7/mês por serviço (backend + database = $14/mês)

---

## 🐋 OPÇÃO 3: DigitalOcean App Platform

### **Para projetos mais robustos:**

1. **Acesse:** https://cloud.digitalocean.com
2. **Apps** → "Create App"
3. **Conecte GitHub** e selecione o repo
4. **Configure:**
   - Detectará automaticamente o Docker
   - Adicione banco PostgreSQL
   - Configure variáveis de ambiente

### **💰 Custo:** A partir de $12/mês

---

## 🏠 OPÇÃO 4: VPS (Mais Controle)

### **Para desenvolvedores experientes:**

```bash
# 1. Compre um VPS (DigitalOcean, Linode, Vultr)
# 2. Configure Docker e Docker Compose
# 3. Clone o repo
git clone https://github.com/mateusmagalhaes22/com_dominio.git
cd com_dominio

# 4. Configure .env
cp .env.example .env
# Edite o .env com suas configurações

# 5. Execute
docker-compose up -d

# 6. Configure Nginx como proxy reverso
# 7. Configure SSL com Let's Encrypt
```

---

## ⚡ Deploy Rápido - Next.js Frontend

### **Vercel (Recomendado para Next.js):**

1. **Acesse:** https://vercel.com
2. **Import Project** do GitHub
3. **Selecione** a pasta `comdominio`
4. **Configure variáveis:**
   ```
   NEXT_PUBLIC_API_URL=https://sua-api-url-do-railway.railway.app
   ```
5. **Deploy automático!**

---

## 🔒 Checklist de Segurança

- [ ] ✅ Senhas fortes em todas as variáveis
- [ ] ✅ JWT_SECRET único e seguro (32+ caracteres)
- [ ] ✅ ADMIN_PASSWORD forte
- [ ] ✅ Não expor dados sensíveis no código
- [ ] ✅ HTTPS habilitado (automático no Railway/Render)

---

## 🆘 Problemas Comuns

### **Build falha:**
- Verifique se todas as variáveis de ambiente estão configuradas
- Confira os logs da plataforma

### **Banco não conecta:**
- Verifique se DB_HOST está correto
- Confirme se o PostgreSQL está rodando

### **500 Error:**
- Veja os logs da aplicação
- Verifique JWT_SECRET configurado

---

## 📞 Precisa de Ajuda?

**Me diga qual opção você escolheu e posso te ajudar com os passos específicos!**

**Recomendo começar com Railway - é o mais simples e funciona bem para este projeto.**