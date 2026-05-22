# com_dominio
gerenciamento de condominios tornado facil

## Variáveis de ambiente necessárias

O backend do projeto utiliza variáveis de ambiente para configuração em produção.

- `DB_HOST`: host do banco de dados PostgreSQL.
- `DB_PORT`: porta do PostgreSQL.
- `DB_USERNAME`: usuário do banco.
- `DB_PASSWORD`: senha do banco.
- `DB_DATABASE`: nome do banco de dados.
- `JWT_SECRET`: segredo usado para assinar tokens JWT.
- `JWT_EXPIRES_IN`: tempo de expiração dos tokens JWT (ex.: `1h`).
- `ADMIN_USER`: usuário administrador padrão.
- `ADMIN_PASSWORD`: senha do administrador padrão.
- `ADMIN_KEY`: chave de acesso usada pelo administrador para criar novas workspaces via requisições HTTP.
- `PORT`: porta em que o servidor backend irá escutar (padrão `8080`).
- `CORS_ORIGINS`: origens permitidas para CORS, separadas por vírgula.

### Observação sobre `ADMIN_KEY`

A variável `ADMIN_KEY` é uma chave de acesso para o administrador do sistema. Ela é verificada em requisições HTTP a endpoints administrativos, permitindo criar e acessar novas workspaces quando o valor enviado no cabeçalho `admin-key` estiver correto.

## Como executar o projeto

Siga esta ordem para rodar o projeto em um ambiente local ou de produção:

### 1. Rodar o banco de dados

1. Defina as variáveis de ambiente do PostgreSQL:
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DB`
2. A partir da raiz do projeto, execute:

```bash
docker compose up -d db
```

Isso iniciará o serviço `db` definido em `compose.yaml`.

### 2. Rodar o backend

1. Entre no diretório do backend:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Defina as variáveis de ambiente do backend (pelo menos):
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `DB_DATABASE`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `ADMIN_USER`
   - `ADMIN_PASSWORD`
   - `ADMIN_KEY`
   - `PORT`
   - `CORS_ORIGINS`

4. Execute o backend:

- Para desenvolvimento:

```bash
npm run start:dev
```

- Para produção:

```bash
npm run build
npm run start:prod
```

Se preferir iniciar o backend via Docker Compose após o banco estar pronto, use:

```bash
docker compose up -d backend
```

### 3. Rodar o frontend

1. Entre no diretório do frontend:

```bash
cd ../com_dominio_frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o frontend:

```bash
npm run dev
```

Se o frontend usar outra variável de ambiente para a URL da API, ajuste conforme necessário (por exemplo, `VITE_API_URL`, `REACT_APP_API_URL` ou equivalente).

> Observação: caso o diretório `com_dominio_frontend` esteja vazio ou sem arquivos do app frontend, copie ou crie o projeto frontend nesse diretório antes de rodar o comando acima.
