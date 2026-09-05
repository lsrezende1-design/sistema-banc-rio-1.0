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
// UTILITÁRIO DE FORMATAÇÃO MONETÁRIA (Disponível Globalmente)
// ======================================
function formatarMoeda(valor) {
  const quantia = Number(valor) || 0;
  return quantia.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// ======================================
// RENDERIZAR TABELA DE CONTAS
// ======================================
function renderizarContas(contas, clientes) {
  const corpoTabelaContas = document.getElementById("tabela-contas-corpo");
  if (!corpoTabelaContas) return;

  corpoTabelaContas.innerHTML = "";

  contas.forEach((conta) => {
    const linha = document.createElement("tr");

    // Busca o nome do cliente associado ao clienteId da conta
    const cliente = clientes.find((c) => String(c.id) === String(conta.clienteId));
    const nomeCliente = cliente ? cliente.nome : "Cliente Não Encontrado";

    // NÚMERO DA CONTA
    const tdNumeroConta = document.createElement("td");
    tdNumeroConta.innerText = conta.numeroConta;

    // CLIENTE
    const tdCliente = document.createElement("td");
    tdCliente.innerText = nomeCliente;

    // TIPO
    const tdTipo = document.createElement("td");
    tdTipo.innerText = conta.tipo;

    // SALDO (Com formatação pt-BR incluindo milhar, ex: R$ 10.000,00)
    const tdSaldo = document.createElement("td");
    const valorSaldo = Number(conta.saldo) || 0;
    tdSaldo.innerText = formatarMoeda(valorSaldo);

    // STATUS
    const tdStatus = document.createElement("td");
    const spanStatus = document.createElement("span");
    spanStatus.style.color = "green";
    spanStatus.style.fontWeight = "bold";
    spanStatus.innerText = conta.status || "Ativa";
    tdStatus.appendChild(spanStatus);

    // AÇÕES
    const tdAcoes = document.createElement("td");

    // BOTÃO ENCERRAR CONTA
    const botaoEncerrar = document.createElement("button");
    botaoEncerrar.type = "button";
    botaoEncerrar.innerText = "Encerrar conta";
    botaoEncerrar.dataset.acao = "deletar-conta";
    botaoEncerrar.dataset.id = conta.id;
    botaoEncerrar.className = "btn-acao btn-excluir";

    // Regra de negócio: Ação de encerramento só é possível se o saldo for ZERO
    if (valorSaldo !== 0) {
      botaoEncerrar.disabled = true;
      botaoEncerrar.title = "A conta só pode ser encerrada se o saldo for R$ 0,00";
    }

    tdAcoes.appendChild(botaoEncerrar);

    linha.append(
      tdNumeroConta,
      tdCliente,
      tdTipo,
      tdSaldo,
      tdStatus,
      tdAcoes
    );

    corpoTabelaContas.appendChild(linha);
  });
}

// ======================================
// RENDERIZAR HISTÓRICO DE TRANSAÇÕES
// ======================================
function renderizarTabelaHistorico(transacoes = [], paginaAtual = 1, itensPorPagina = 5) {
  const tabelaHistorico = document.getElementById("tabela-transacoes-corpo");
  const infoPagina = document.getElementById("pagina-atual-info");
  const btnAnterior = document.getElementById("btn-pagina-anterior");
  const btnProxima = document.getElementById("btn-pagina-proxima");

  if (!tabelaHistorico) return;

  tabelaHistorico.innerHTML = "";

  if (transacoes.length === 0) {
    const linhaVazia = document.createElement("tr");
    const tdVazia = document.createElement("td");
    
    tdVazia.colSpan = 4;
    tdVazia.style.textAlign = "center";
    tdVazia.innerText = "Nenhuma transação registrada.";
    
    linhaVazia.appendChild(tdVazia);
    tabelaHistorico.appendChild(linhaVazia);

    if (infoPagina) infoPagina.innerText = "Página 1 de 1";
    if (btnAnterior) btnAnterior.disabled = true;
    if (btnProxima) btnProxima.disabled = true;
    return;
  }

  const totalPaginas = Math.ceil(transacoes.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const itensPagina = transacoes.slice(inicio, fim);

  itensPagina.forEach((transacao) => {
    const linha = document.createElement("tr");

    // DATA
    const tdData = document.createElement("td");
    tdData.innerText = transacao.data;

    // TIPO
    const tdTipo = document.createElement("td");
    tdTipo.innerText = transacao.tipo;

    // VALOR (com formatação de milhar)
    const tdValor = document.createElement("td");
    tdValor.innerText = formatarMoeda(transacao.valor);

    // SALDO NOVO (com formatação de milhar)
    const tdSaldoNovo = document.createElement("td");
    tdSaldoNovo.innerText = formatarMoeda(transacao.saldoResultante);

    // MONTAGEM
    linha.append(tdData, tdTipo, tdValor, tdSaldoNovo);
    tabelaHistorico.appendChild(linha);
  });

  if (infoPagina) infoPagina.innerText = `Página ${paginaAtual} de ${totalPaginas}`;
  if (btnAnterior) btnAnterior.disabled = paginaAtual === 1;
  if (btnProxima) btnProxima.disabled = paginaAtual === totalPaginas;
}