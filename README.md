# API Fisioterapia

Este projeto é uma API REST desenvolvida em Node.js e TypeScript, destinada a auxiliar o gerenciamento de pacientes e usuários para o curso de fisioterapia.

## Repositório Git

O código-fonte deste projeto está hospedado no GitHub: https://github.com/Lads-iesgo/api-fisioterapia.git

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para construção de APIs REST.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **dotenv**: Gerenciamento de variáveis de ambiente.
- **npm**: Gerenciador de pacotes JavaScript.
- **Git**: Sistema de controle de versão distribuído.

## Pré-requisitos

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/)

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
┣ 📂 src/
┃ ┣ 📂 controller/        # Lógica dos controladores (usuários, clientes)
┃ ┣ 📂 routes/            # Definição das rotas da API
┃ ┗ 📜 server.ts          # Inicialização do servidor Express
┣ 📜 dados.json           # Base de dados simulada (mock)
┣ 📜 package.json         # Dependências e scripts do projeto
┣ 📜 tsconfig.json        # Configuração do TypeScript
┗ 📜 README.md            # Documentação do projeto
```

## Rotas Disponíveis

- **Usuários**
  - `GET /usuarios` - Lista todos os usuários
  - `GET /usuarios/:id` - Busca usuário por ID
  - `POST /usuarios` - Cria um novo usuário
  - `PUT /usuarios/:id` - Atualiza um usuário existente

- **Clientes**
  - `GET /clientes` - Lista todos os clientes
  - `GET /clientes/:id` - Busca cliente por ID
  - `POST /clientes` - Cria um novo cliente
  - `PUT /clientes/:id` - Atualiza um cliente existente

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
