// ======================================
// REFERÊNCIA AO CORPO DA TABELA
// ======================================

const corpoTabelaClientes = document.getElementById('tabela-clientes-corpo');

// ======================================
// RENDERIZAR CLIENTES
// ======================================

function renderizarClientes(clientes) {
  corpoTabelaClientes.innerHTML = '';

  clientes.forEach((cliente) => {
    const linha = document.createElement('tr');

    // ==========================
    // NOME
    // ==========================

    const tdNome = document.createElement('td');

    tdNome.innerText = cliente.nome;

    // ==========================
    // CPF
    // ==========================

    const tdCpf = document.createElement('td');

    tdCpf.innerText = cliente.cpf;

    // ==========================
    // EMAIL
    // ==========================

    const tdEmail = document.createElement('td');

    tdEmail.innerText = cliente.email;

    // ==========================
    // AÇÕES
    // ==========================

    const tdAcoes = document.createElement('td');

    // ==========================
    // BOTÃO EDITAR
    // ==========================

    const botaoEditar = document.createElement('button');

    botaoEditar.type = 'button';

    botaoEditar.innerText = 'Editar';

    botaoEditar.dataset.acao = 'editar';

    botaoEditar.dataset.id = cliente.id;

    botaoEditar.className = 'btn-acao btn-editar';

    // ==========================
    // BOTÃO EXCLUIR
    // ==========================

    const botaoExcluir = document.createElement('button');

    botaoExcluir.type = 'button';

    botaoExcluir.innerText = 'Excluir';

    botaoExcluir.dataset.acao = 'deletar';

    botaoExcluir.dataset.id = cliente.id;

    botaoExcluir.className = 'btn-acao btn-excluir';

    // ==========================
    // MONTAGEM
    // ==========================

    tdAcoes.append(botaoEditar, botaoExcluir);

    linha.append(tdNome, tdCpf, tdEmail, tdAcoes);

    corpoTabelaClientes.appendChild(linha);
  });
}
