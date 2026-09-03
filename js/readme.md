# Sistema Bancário #1727

Projeto desenvolvido para a disciplina de Desenvolvimento Web.

## Funcionalidades

### Clientes

- Listar clientes
- Cadastrar clientes
- Editar clientes
- Excluir clientes
- Filtrar clientes por nome

### Autenticação

- Login
- Logout
- Proteção de páginas
- Sessão com localStorage

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
├── index.html
├── clientes.html
├── contas.html
├── transacoes.html
├── styles/
│   └── style.css
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── main.js
│   ├── ui.js
│   └── validacao.js
└── db.json
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
