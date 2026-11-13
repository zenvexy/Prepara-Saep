# Prepara SAEP — Gerenciador de Tarefas

Aplicação Kanban simples para cadastrar usuários e tarefas e acompanhar tarefas nos status **A fazer**, **Fazendo** e **Pronto**. A interface usa HTML, CSS e JavaScript; a API usa Node.js, Express, Prisma e MySQL/MariaDB.

> Detalhe! O link do pages é apenas para visualização imediata, sem dados reais.

## Funcionalidades

- Cadastro de usuários com nome e e-mail.
- Cadastro e edição de tarefas com descrição, setor, usuário, prioridade e status.
- Visualização das tarefas em colunas por status.
- Busca, edição e exclusão de tarefas.

## Pré-requisitos

- Node.js e npm.
- MySQL ou MariaDB em execução.

## Preview Web

![Screenshot](./Assets/screenshot.png)

## Documentos

- O Driagrama de Entidade e Relacionamento [DER](./docs/DER.jpg) está em conjunto ao Diagrama de Casos de Uso `(UML)` do usuário.
- O `pdf` da atividade realizada está em [Prepara-Saep](./docs/Prepara-Saep.pdf).

## Testar localmente

1. Crie `api/.env` com os dados de conexão do seu banco:

   ```env
   PORT=3000
   DATABASE_URL="mysql://root:sua_senha@localhost:3306/prepara_saep"
   ```

   Ajuste usuário, senha e nome do banco conforme sua instalação.

2. No terminal, entre na pasta da API e instale as dependências:

   ```bash
   cd api
   npm install
   ```

3. Crie ou atualize as tabelas, gere o cliente Prisma e insira os dados de exemplo:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```

   **Atenção:** o seed apaga os usuários e as tarefas existentes antes de inserir os exemplos.

4. Inicie a API:

   ```bash
   npm run dev
   ```

5. Abra `web/home.html` (ou `index.html` na pasta principal) no navegador. A API fica em `http://localhost:3000`.

## Páginas

- `web/home.html` — quadro de gerenciamento das tarefas.
- `web/tarefas.html` — cadastro e edição de tarefas.
- `web/usuarios.html` — cadastro de usuários.

## Principais rotas da API

| Método | Rota | Ação |
|---|---|---|
| GET | `/tarefa/listar` | Lista tarefas |
| POST | `/tarefa/cadastrar` | Cadastra uma tarefa |
| PUT | `/tarefa/atualizar/:id` | Atualiza uma tarefa |
| DELETE | `/tarefa/excluir/:id` | Exclui uma tarefa |
| GET | `/usuario/listar` | Lista usuários |
| POST | `/usuario/cadastrar` | Cadastra um usuário |
| GET | `/status/listar` | Lista os status disponíveis |
| GET | `/prioridade/listar` | Lista as prioridades disponíveis |
