# Sistema Bancário #1727

Projeto desenvolvido para a disciplina de Desenvolvimento Web.

## Funcionalidades

### Autenticação

- Login
- Logout
- Proteção de páginas
- Sessão com localStorage

### Clientes

- Listar clientes
- Cadastrar clientes
- Editar clientes
- Excluir clientes
- Filtrar clientes por nome

### Gestão de Contas Bancárias (`contas.html`)
- **Abertura de Contas**:
  - Associação de contas aos clientes cadastrados.
  - Suporte a múltiplos tipos de conta (**Corrente** e **Poupança**).
  - **Regra de Negócio**: Impedimento de criação de contas duplicadas do mesmo tipo para um único cliente.
- **Geração Automática de Número de Conta**:
  - Separação por operação (`001` para Conta Corrente e `013` para Poupança).
  - Sequencial automático (ex: `1001`, `1002`).
  - **Dígito Verificador (DV) via Módulo 11**: Cálculo dinâmico bancário baseado no prefixo e no número da conta (Formato final: `PPP-NNNN-D`).
- **Encerramento de Contas**:
  - **Regra de Negócio**: Botão de encerramento habilitado **apenas se o saldo for exatamente R$ 0,00**, evitando fechamento com saldo pendente ou devedor.
- **Filtro Duplo de Contas**:
  - Filtragem combinada em tempo real por **Nome do Cliente** e/ou **Número da Conta**.

### Transações e Movimentações (`transacoes.html`)
- **Seleção Dinâmica de Conta**:
  - Seleção por lista suspensa (`<select>`) ou por digitação manual combinada (Operação, Número e Dígito).
- **Operações Bancárias**:
  - Depósito e Saque.
  - **Validação de Saldo para Saque**: Bloqueio de retiradas com valor superior ao saldo atual disponível.
- **Máscara Monetária Dinâmica**: Formatação automática `R$ 0,00` no campo de valor durante a digitação.
- **Histórico de Transações e Paginação**:
  - Tabela com histórico detalhado (Data/Hora, Tipo, Valor e Saldo Resultante).
  - Formatação monetária padronizada para padrão brasileiro (`BRL`).
  - **Paginação de Transações**: Paginação de 5 itens por página com controle dinâmico dos botões "Anterior" e "Próxima".

### Extras

- Tema claro/escuro
- Contador de clientes
- Validação de CPF
- Bloqueio de CPF duplicado
- Bloqueio de e-mail duplicado

## Tecnologias

- HTML
- CSS
- JavaScript
- JSON Server

## Execução

Instalar e executar o JSON Server:

```bash
npx json-server --watch db.json --port 3001
```

Abrir:

```text
index.html
```

## Estrutura do Projeto

```text
banco-frontend/
├── index.html            # Tela de Login e acesso ao sistema
├── clientes.html         # Painel de gestão de clientes (CRUD)
├── contas.html           # Painel de abertura e consulta de contas bancárias
├── transacoes.html       # Painel de depósitos, saques e extrato de movimentações
├── styles/
│   └── style.css         # Estilização global, temas e layout
├── js/
│   ├── api.js            # Módulo de requisições à API (HTTP Client / fetch)
│   ├── auth.js           # Lógica de autenticação e controle de acesso
│   ├── contas.js         # Lógica do módulo de contas e regras de negócio
│   ├── main.js           # Inicialização global, eventos centrais e alternância de tema
│   ├── transacoes.js     # Lógica de operações bancárias, depósitos, saques e paginação
│   ├── ui.js             # Funções de renderização no DOM e formatação visual (BRL, CPF)
│   └── validacao.js      # Funções de validação de dados (CPF, e-mails, campos)
└── db.json               # Banco de dados simulado para o JSON Server
```

## Funcionalidades Extras Implementadas

- Filtro de clientes por nome
- Contador de clientes
- Modo claro/escuro
- Login e logout
- Controle de sessão com localStorage
- Cancelamento de edição
- Validação de CPF e e-mail duplicados

## Autores

Fabyo Kock
Lilian Siqueira Rezende
Wagner Rogério Cruz
Werlleyn Douglas

---

# Sistema Bancário #1727

Aplicação web completa para gestão bancária e operacional, desenvolvida como projeto da disciplina FRONT END DINÂMICO (JS DOM) - Módulo #01 da Formação Continuada DEV Front End I - CAIXAVERSO - Turma nº 1727 ADA Tech.

O sistema permite que funcionários gerenciem clientes, abram e administrem contas bancárias e realizem operações financeiras de movimentação (saques e depósitos) com atualização em tempo real.

---

## Funcionalidades

### 1. Gestão de Clientes

- **CRUD Completo:** Listagem, cadastro, edição e exclusão de clientes.
- **Filtro em Tempo Real:** Busca rápida de clientes por nome.
- **Validações Avançadas:** Checagem de campos obrigatórios, formato de e-mail e validação algorítmica de CPF.
- **Regras de Duplicidade:** Bloqueio de cadastro para CPF ou e-mail já existentes no sistema.

### 2. Gestão de Contas Bancárias

- **Abertura de Contas:** Vinculação de cliente, seleção do tipo (Corrente ou Poupança) e saldo inicial zerado.
- **Geração de Número e Dígito Verificador:** Algoritmo de cálculo de DV via Módulo 11.
- **Controle de Status:** Alternância entre conta "Ativa" e "Inativa".
- **Trava de Segurança:** Impedimento de exclusão de contas com saldo positivo acumulado.

### 3. Gestão de Transações Financeiras

- **Operações Bancárias:** Módulo para registro de depósitos e saques com atualização automática do saldo da conta.
- **Validação de Saldo:** Impeditivo para saques de valores superiores ao saldo disponível em conta.
- **Histórico e Paginação:** Tabela de extrato detalhada (Data, Tipo, Valor e Novo Saldo) com navegação paginada.
- **Máscara Monetária:** Exibição de valores formatados no padrão brasileiro (`R$`).

### 4. Autenticação e Controle de Acesso

- **Controle de Sessão:** Login e logout de usuários com persistência em `localStorage`.
- **Proteção de Rotas:** Redirecionamento automático caso o usuário tente acessar páginas restritas sem autenticação.
- **Perfis de Usuário:** Níveis de permissão diferenciados para Administrador e Caixa.

### 5. Interface e Experiência do Usuário (UX)

- **Tema Claro / Escuro:** Alternância dinâmica de cores com preferência salva no navegador.
- **Design Responsivo:** Layout adaptável para dispositivos móveis e desktops via CSS Grid e Flexbox.
- **Contadores de Dashboard:** Exibição de métricas e totais cadastrados no painel principal.

---

## Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+ / Async/Await).
- **Backend Mock:** JSON Server (API RESTful).
- **Armazenamento Local:** Web Storage (`localStorage`).

---

## Estrutura do Projeto

```text
sistema-banc-rio-1.0/
├── index.html                # Tela de login e dashboard inicial
├── clientes.html             # Interface de gestão e cadastro de clientes
├── contas.html               # Interface de gestão e abertura de contas
├── transacoes.html           # Interface para saques, depósitos e histórico
├── css/
│   └── style.css             # Estilização global, temas e layout responsivo
├── js/
│   ├── api.js                # Comunicação assíncrona com a API (Fetch)
│   ├── auth.js               # Gestão de sessão, login/logout e proteção de rotas
│   ├── main.js               # Lógica de controle e eventos da tela de clientes
│   ├── contas.js             # Lógica do módulo de contas e cálculo de Módulo 11
│   ├── transacoes.js         # Lógica de saques, depósitos, regras de saldo e paginação
│   ├── ui.js                 # Manipulação do DOM e renderização visual
│   ├── validacao.js          # Validadores de CPF, e-mail e dados de formulário
│   └── alternarTema.js       # Controle do modo claro/escuro
├── db.json                   # Banco de dados mock (clientes, contas, transações e usuários)
└── README.md                 # Documentação do projeto

```

## Como Executar o Projeto

### Pré-requisitos

Ter o [Node.js](https://nodejs.org/) instalado em seu computador.

### 1. Iniciar o servidor backend (JSON Server)

Navegue até a pasta raiz do projeto pelo terminal e execute:

npx json-server --watch db.json --port 3001

> **Nota:** A API estará acessível em `http://localhost:3001`.

### 2. Abrir o Frontend

Abra o arquivo `index.html` em qualquer navegador web moderno ou utilize uma extensão de servidor local (como a _Live Server_ do VS Code).

## Critérios de Bônus Atendidos

- [x] **Filtro de clientes por nome:** Busca dinâmica na tabela de clientes.
- [x] **`localStorage` com preferências:** Persistência do tema visual (claro/escuro) e da sessão ativa.
- [x] **Responsividade mobile:** Interface ajustada com CSS Grid e Media Queries para aparelhos móveis.
- [x] **Histórico com paginação:** Navegação por páginas no extrato de transações.

## Autores

- Fabyo Luiz Crizóstomo Kock
- Lilian Siqueira Rezende
- Wagner Rogério Cruz
- Werlleyn Douglas

```

```
