# API Fisioterapia

Esta API REST foi desenvolvida para gerenciar autenticação, usuários, pacientes, consultas, horários e indisponibilidades no sistema de fisioterapia. O projeto utiliza controle de acesso por perfil (RBAC) com autenticação JWT e persistência em banco MySQL via Prisma.

## Repositório Git

O código-fonte deste projeto está hospedado no GitHub: [https://github.com/Lads-iesgo/api-fisioterapia.git](https://github.com/Lads-iesgo/api-fisioterapia.git)

## Tecnologias Utilizadas

- **Node.js**: runtime da aplicação.
- **TypeScript**: tipagem estática no backend.
- **Express 5**: roteamento e middleware HTTP.
- **Prisma ORM** e **@prisma/client**: acesso ao banco de dados.
- **MySQL**: banco de dados relacional.
- **jsonwebtoken**: autenticação baseada em token JWT.
- **bcrypt**: hash e verificação de senha.
- **cors**: política de acesso entre origens.
- **multer**: upload de arquivos no fluxo de cadastro.
- **express-validator**: validação de payloads em endpoints.
- **dotenv**: gerenciamento de variáveis de ambiente.
- **tsx**: execução do projeto em desenvolvimento com watch.

## Pré-requisitos

- **Node.js 20+** (recomendado)
- **npm 10+**
- **MySQL** com banco criado para a aplicação
- **Git**

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com, no mínimo:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/seu_banco"
JWT_SECRET="sua_chave_secreta"
PORT=3333
```

Observações:

- `DATABASE_URL` e `JWT_SECRET` são obrigatórias para a API iniciar.
- `PORT` é opcional (quando ausente, a aplicação usa a porta definida no código).

## Configuração do Projeto

Clone o repositório:

```sh
git clone https://github.com/Lads-iesgo/api-fisioterapia.git
cd api-fisioterapia
```

Instale as dependências:

```sh
npm install
```

Inicie o servidor de desenvolvimento:

```sh
npm run dev
```

O servidor será iniciado em http://localhost:3333 (ou na porta definida na variável de ambiente `PORT`).

## Estrutura do Projeto

```
📦 api-fisioterapia
┣ 📂 prisma/
┃ ┗ 📜 schema.prisma           # Modelagem do banco (MySQL)
┣ 📂 src/
┃ ┣ 📂 config/
┃ ┃ ┗ 📜 prisma.ts             # Cliente Prisma
┃ ┣ 📂 controller/             # Regras de negócio por recurso
┃ ┣ 📂 middleware/             # auth e RBAC
┃ ┣ 📂 routes/                 # Rotas públicas e protegidas
┃ ┣ 📂 interfaces/             # Tipagens de entrada/saída
┃ ┗ 📜 server.ts               # Bootstrap da aplicação
┣ 📂 uploads/                  # Arquivos enviados no cadastro
┣ 📜 RBAC_IMPLEMENTATION.md    # Resumo da política de acesso
┣ 📜 RBAC_API.md               # Documentação detalhada de RBAC
┣ 📜 package.json
┣ 📜 tsconfig.json
┗ 📜 README.md
```

## Rotas Disponíveis

### Health Check

- `GET /` — Verifica se a API está ativa.

### Públicas

### Autenticação (`/auth`)

- `POST /auth/login` — Realiza login e retorna token JWT.

### Registro (`/register`)

- `POST /register/register` — Cadastro público de usuário (com upload opcional).

### Protegidas (JWT + regras RBAC)

### Usuários (`/usuario`)

- `GET /usuario` — Lista todos os usuários
- `GET /usuario/:id` — Busca usuário por ID
- `POST /usuario` — Cria um novo usuário
- `PUT /usuario/:id` — Atualiza um usuário existente
- `GET /usuario/fisioterapeutas` — Lista usuários dos perfis aluno/fisioterapeuta

### Pacientes (`/paciente`)

- `GET /paciente` — Lista todos os pacientes
- `GET /paciente/:id` — Busca paciente por ID
- `POST /paciente` — Cria um novo paciente
- `PUT /paciente/:id` — Atualiza um paciente existente

### Perfis (`/perfil`)

- `GET /perfil` — Lista todos os perfis
- `GET /perfil/:id` — Busca perfil por ID
- `POST /perfil` — Cria um novo perfil
- `PUT /perfil/:id` — Atualiza um perfil existente

### Consultas (`/consulta`)

- `GET /consulta` — Lista todas as consultas
- `GET /consulta/:id` — Busca consulta por ID
- `POST /consulta` — Cria uma nova consulta
- `PUT /consulta/:id` — Atualiza uma consulta existente
- `DELETE /consulta/:id` — Remove uma consulta

### Horários de Agendamento (`/horario`)

- `GET /horario` — Lista todos os horários de agendamento
- `GET /horario/:id` — Busca horário de agendamento por ID
- `POST /horario` — Cria um novo horário de agendamento
- `PUT /horario/:id` — Atualiza um horário de agendamento existente

### Indisponibilidade (`/indisponibilidade`)

- `GET /indisponibilidade` — Lista dias/intervalos indisponíveis
- `GET /indisponibilidade/:id` — Busca indisponibilidade por ID
- `POST /indisponibilidade` — Cria indisponibilidade
- `PUT /indisponibilidade/:id` — Atualiza indisponibilidade
- `DELETE /indisponibilidade/:id` — Remove indisponibilidade

## Segurança e Permissões

- Rotas privadas exigem token JWT no header `Authorization`.
- Controle de acesso por perfil é aplicado via middleware.
- Perfis de leitura têm bloqueio de operações de escrita.
- Em consultas, há isolamento de dados por usuário para perfis restritos.
- Regras completas estão descritas em `RBAC_API.md` e `RBAC_IMPLEMENTATION.md`.

## Scripts Disponíveis

- `npm run dev` — executa API em desenvolvimento com recarga automática.
- `npm run build` — compila o projeto TypeScript.
- `npm run test` — script placeholder (não há suíte configurada no momento).

## Branches

- **main**: Branch principal para versões estáveis.
- **develop**: Branch para desenvolvimento em andamento.

## Contribuindo

Para contribuir com o projeto, siga estes passos:

1. Crie uma nova branch a partir da develop:

   ```sh
   git checkout develop
   git checkout -b sua-nova-branch
   ```

2. Faça suas alterações e commits:

   ```sh
   git add .
   git commit -m "Descrição das suas alterações"
   ```

3. Envie suas alterações para o GitHub:

   ```sh
   git push origin sua-nova-branch
   ```

4. Crie um Pull Request (PR) para a branch develop.

## Próximos Passos

- Certifique-se de que suas alterações estejam completas e funcionando corretamente.
- Use `git status` para verificar as alterações pendentes e `git diff` para revisar as modificações.
- Crie o Pull Request no GitHub, selecione sua branch como origem e `develop` como destino.
- Aguarde a revisão do seu PR por outros colaboradores.

## Dicas adicionais

- Escreva mensagens de commit claras e concisas.
- Mantenha o PR o menor e mais focado possível.
- Comunique-se de forma eficaz com os revisores.

## Contato

lads@iesgo.edu.br
