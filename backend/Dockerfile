# Build stage
FROM node:24.8.0-alpine3.22 AS builder

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar todas as dependências (incluindo dev dependencies para o build)
# Usar npm ci se package-lock.json existir, senão usar npm install
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM node:24.8.0-alpine3.22

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar apenas dependências de produção
# Usar npm ci se package-lock.json existir, senão usar npm install
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --legacy-peer-deps; else npm install --omit=dev --legacy-peer-deps; fi && npm cache clean --force

# Copiar os arquivos compilados do stage anterior
COPY --from=builder /app/dist ./dist

# Expor a porta
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]