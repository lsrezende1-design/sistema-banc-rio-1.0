// ======================================
// CONFIGURAÇÃO DA API
// ======================================

// Executar o json-server:
//
// npx json-server@0.17.4 --watch db.json --port 3001

const API_URL = 'http://localhost:3001';

// ======================================
// BUSCAR TODOS OS CLIENTES
// GET /clientes
// ======================================

async function buscarClientes() {
  const resposta = await fetch(`${API_URL}/clientes`);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar clientes');
  }

  return await resposta.json();
}

// ======================================
// BUSCAR CLIENTE POR ID
// GET /clientes/:id
// ======================================

async function buscarClientePorId(id) {
  const resposta = await fetch(`${API_URL}/clientes/${id}`);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar cliente');
  }

  return await resposta.json();
}

// ======================================
// CRIAR CLIENTE
// POST /clientes
// ======================================

async function criarCliente(cliente) {
  const resposta = await fetch(`${API_URL}/clientes`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(cliente),
  });

  if (!resposta.ok) {
    throw new Error('Erro ao criar cliente');
  }

  return await resposta.json();
}

// ======================================
// ATUALIZAR CLIENTE
// PUT /clientes/:id
// ======================================

async function atualizarCliente(id, cliente) {
  const resposta = await fetch(`${API_URL}/clientes/${id}`, {
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(cliente),
  });

  if (!resposta.ok) {
    throw new Error('Erro ao atualizar cliente');
  }

  return await resposta.json();
}

// ======================================
// DELETAR CLIENTE
// DELETE /clientes/:id
// ======================================

async function deletarCliente(id) {
  const resposta = await fetch(`${API_URL}/clientes/${id}`, {
    method: 'DELETE',
  });

  if (!resposta.ok) {
    throw new Error('Erro ao deletar cliente');
  }

  return true;
}

// ======================================
// CONTAS - API
// ======================================

// ======================================
// BUSCAR TODAS AS CONTAS
// GET /contas
// ======================================

async function buscarContas() {
  const resposta = await fetch(`${API_URL}/contas`);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar contas');
  }

  return await resposta.json();
}

// ======================================
// CRIAR CONTAS
// POST /contas
// ======================================

async function criarConta(conta) {
  const resposta = await fetch(`${API_URL}/contas`, {
    method: 'POST',

    headers: { 'Content-Type': 'application/json' },
    
    body: JSON.stringify(conta),
  });

  if (!resposta.ok) {
    throw new Error('Erro ao criar conta');
  }

  return await resposta.json();
}

// ======================================
// DELETAR CONTAS
// DELETE /contas/:id
// ======================================

async function deletarConta(id) {
  const resposta = await fetch(`${API_URL}/contas/${id}`, {
    method: 'DELETE',
  });

  if (!resposta.ok) {
    throw new Error('Erro ao deletar conta');
  }

  return true;
}