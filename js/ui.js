// ======================================
// REFERÊNCIA AO CORPO DA TABELA
// ======================================

const corpoTabelaClientes = document.getElementById("tabela-clientes-corpo");

// ======================================
// RENDERIZAR CLIENTES
// ======================================

// Aplicar a máscara 000.000.000-00
function formatarCPF(cpf) {
  if (!cpf || cpf.length !== 11) return cpf;
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function renderizarClientes(clientes) {
  corpoTabelaClientes.innerHTML = "";

  clientes.forEach((cliente) => {
    const linha = document.createElement("tr");

    // ==========================
    // NOME
    // ==========================

    const tdNome = document.createElement("td");

    tdNome.innerText = cliente.nome;

    // ==========================
    // CPF
    // ==========================

    const tdCpf = document.createElement("td");

    tdCpf.innerText = formatarCPF(cliente.cpf);

    // ==========================
    // EMAIL
    // ==========================

    const tdEmail = document.createElement("td");

    tdEmail.innerText = cliente.email;

    // ==========================
    // AÇÕES
    // ==========================

    const tdAcoes = document.createElement("td");

    // ==========================
    // BOTÃO EDITAR
    // ==========================

    const botaoEditar = document.createElement("button");

    botaoEditar.type = "button";

    botaoEditar.innerText = "Editar";

    botaoEditar.dataset.acao = "editar";

    botaoEditar.dataset.id = cliente.id;

    botaoEditar.className = "btn-acao btn-editar";

    // ==========================
    // BOTÃO EXCLUIR
    // ==========================

    const botaoExcluir = document.createElement("button");

    botaoExcluir.type = "button";

    botaoExcluir.innerText = "Excluir";

    botaoExcluir.dataset.acao = "deletar";

    botaoExcluir.dataset.id = cliente.id;

    botaoExcluir.className = "btn-acao btn-excluir";

    // ==========================
    // MONTAGEM
    // ==========================

    tdAcoes.append(botaoEditar, botaoExcluir);

    linha.append(tdNome, tdCpf, tdEmail, tdAcoes);

    corpoTabelaClientes.appendChild(linha);
  });
}

// ======================================
// PREENCHER SELECT DE CLIENTES EM CONTAS
// ======================================
function preencherSelectClientes(clientes) {
  const selectCliente = document.getElementById('conta-cliente');
  if (!selectCliente) return;

  selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';

  clientes.forEach((cliente) => {
    const option = document.createElement('option');
    option.value = cliente.id;
    option.textContent = `${cliente.nome} (CPF: ${cliente.cpf})`;
    selectCliente.appendChild(option);
  });
}

// ======================================
// RENDERIZAR TABELA DE CONTAS
// ======================================
function renderizarContas(contas, clientes) {
  const corpoTabelaContas = document.getElementById('tabela-contas-corpo');
  if (!corpoTabelaContas) return;

  corpoTabelaContas.innerHTML = '';

  contas.forEach((conta) => {
    const linha = document.createElement('tr');

    // Busca o nome do cliente associado ao clienteId da conta
    const cliente = clientes.find((c) => String(c.id) === String(conta.clienteId));
    const nomeCliente = cliente ? cliente.nome : 'Cliente Não Encontrado';

    linha.innerHTML = `
      <td>${conta.numeroConta}</td>
      <td>${nomeCliente}</td>
      <td>${conta.tipo}</td>
      <td>R$ ${Number(conta.saldo).toFixed(2).replace('.', ',')}</td>
      <td><span style="color: green; font-weight: bold;">${conta.status || 'Ativa'}</span></td>
      <td>
        <button type="button" class="btn-acao btn-excluir" data-acao="deletar-conta" data-id="${conta.id}">
          Excluir
        </button>
      </td>
    `;

    corpoTabelaContas.appendChild(linha);
  });
}