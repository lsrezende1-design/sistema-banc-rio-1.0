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
