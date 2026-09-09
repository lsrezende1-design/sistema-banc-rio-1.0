// ============================================================================
// Mapeamento de Elementos da Interface e Estado da Aplicação
// ============================================================================

const selectConta = document.getElementById("transacao-conta");
const inputTipoConta = document.getElementById("transacao-tipo-conta");
const inputNumeroConta = document.getElementById("transacao-numero-conta");
const inputDigitoConta = document.getElementById("transacao-digito-conta");

const selectTipoTransacao = document.getElementById("transacao-tipo");
const inputValorTransacao = document.getElementById("transacao-valor");
const formTransacao = document.getElementById("form-transacao");
const msgErro = document.getElementById("erro-transacao");

const tabelaHistorico = document.getElementById("tabela-transacoes-corpo");
const btnAnterior = document.getElementById("btn-pagina-anterior");
const btnProxima = document.getElementById("btn-pagina-proxima");
const infoPagina = document.getElementById("pagina-atual-info");

// Variáveis de Estado Global Local
let listaContas = [];
let listaClientes = [];
let historicoTransacoes = [];
let contaSelecionada = null;

// Controle de Paginação
let paginaAtual = 1;
const itensPorPagina = 5;

// ============================================================================
// INICIALIZAÇÃO DO MÓDULO
// ============================================================================

document.addEventListener("DOMContentLoaded", async () => {
  await carregarDadosIniciais();
  configurarMascaraMoeda();
  configurarEventosSelecao();
});

/**
 * Busca dados da API e popula o dropdown de seleção de contas
 */
async function carregarDadosIniciais() {
  try {
    const [contas, clientes] = await Promise.all([buscarContas(), buscarClientes()]);
    listaContas = contas;
    listaClientes = clientes;

    preencherSelectContasEmTransacoes(listaContas, listaClientes);
  } catch (erro) {
    exibirErro("Erro ao carregar dados do sistema.");
  }
}

/**
 * Popula as opções do elemento <select> com o número da conta e o nome do titular
 */
function preencherSelectContasEmTransacoes(contas, clientes) {
  if (!selectConta) return;
  selectConta.innerHTML = '<option value="">Selecione uma conta</option>';

  contas.forEach((conta) => {
    const cliente = clientes.find((c) => String(c.id) === String(conta.clienteId));
    const nomeCliente = cliente ? cliente.nome : "Cliente Indefinido";
    const option = document.createElement("option");
    option.value = conta.id;
    option.textContent = `Nº ${conta.numeroConta} - ${conta.tipo} (${nomeCliente})`;
    selectConta.appendChild(option);
  });
}

// ============================================================================
// LÓGICA DE SELEÇÃO INTEGRADA DE CONTAS
// ============================================================================

/**
 * Configura os ouvintes de eventos para selecionar conta por Dropdown ou por Digitação
 */
function configurarEventosSelecao() {
  // Quando o usuário escolhe pelo dropdown <select>
  selectConta.addEventListener("change", () => {
    const id = selectConta.value;
    if (id) {
      contaSelecionada = listaContas.find((c) => String(c.id) === String(id));
      if (contaSelecionada) {
        // Divide o número no formato "001-1001-4" para preencher os campos individuais
        const partes = String(contaSelecionada.numeroConta).split("-");
        inputTipoConta.value = contaSelecionada.tipo || "";
        inputNumeroConta.value = partes[1] || partes[0] || "";
        inputDigitoConta.value = partes[2] || "0";
      }
    } else {
      limparSelecaoManual();
    }
    carregarHistorico();
  });

  // Quando o usuário digita nos campos de texto individuais
  const inputsManuais = [inputTipoConta, inputNumeroConta, inputDigitoConta];
  inputsManuais.forEach((el) => {
    el.addEventListener("input", buscarContaPorCamposManuais);
  });
}

/**
 * Procura uma conta no array local conforme o usuário digita tipo/número/dígito
 */
function buscarContaPorCamposManuais() {
  const tipo = inputTipoConta.value.trim().toLowerCase();
  const num = inputNumeroConta.value.trim();
  const digito = inputDigitoConta.value.trim();

  if (!num) {
    selectConta.value = "";
    contaSelecionada = null;
    carregarHistorico();
    return;
  }

  // Busca uma conta que corresponda aos filtros preenchidos
  const contaEncontrada = listaContas.find((c) => {
    const numeroNoBanco = String(c.numeroConta).trim();
    const tipoNoBanco = String(c.tipo || "").trim().toLowerCase();

    const mesmoTipo = !tipo || tipoNoBanco === tipo;
    const contemNumero = numeroNoBanco.includes(num);
    const bateDigito = !digito || numeroNoBanco.endsWith(`-${digito}`);

    return mesmoTipo && contemNumero && bateDigito;
  });

  if (contaEncontrada) {
    selectConta.value = contaEncontrada.id;
    contaSelecionada = contaEncontrada;
  } else {
    selectConta.value = "";
    contaSelecionada = null;
  }
  
  carregarHistorico();
}

function limparSelecaoManual() {
  inputTipoConta.value = "";
  inputNumeroConta.value = "";
  inputDigitoConta.value = "";
  contaSelecionada = null;
}

// ============================================================================
// TRATAMENTO E MÁSCARA MONETÁRIA
// ============================================================================

/**
 * Aplica formatação automática em R$ no campo de valor durante a digitação
 */
function configurarMascaraMoeda() {
  inputValorTransacao.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove não dígitos
    if (!value) {
      e.target.value = "";
      return;
    }
    value = (Number(value) / 100).toFixed(2);
    e.target.value = `R$ ${value.replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  });
}

/**
 * Converte o texto formatado do campo em um número float utilizável (ex: "R$ 1.500,00" -> 1500.00)
 */
function obterValorNumerico() {
  const texto = inputValorTransacao.value;
  const limpo = texto.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
  return parseFloat(limpo) || 0;
}

// ============================================================================
// EXECUÇÃO DE TRANSAÇÃO (DEPÓSITO E SAQUE)
// ============================================================================

formTransacao.addEventListener("submit", async (e) => {
  e.preventDefault();
  msgErro.innerText = "";

  if (!contaSelecionada) {
    exibirErro("Selecione ou informe uma conta válida.");
    return;
  }

  const valor = obterValorNumerico();
  if (valor <= 0) {
    exibirErro("Informe um valor válido maior que R$ 0,00.");
    return;
  }

  const tipoOperacao = selectTipoTransacao.value;
  let saldoAtual = Number(contaSelecionada.saldo) || 0;
  let novoSaldo = saldoAtual;

  // Regra de Negócio: Validação de Saldo Insuficiente para Saque
  if (tipoOperacao === "Saque") {
    if (saldoAtual < valor) {
      alert(`Saldo Insuficiente!\nSaldo atual: R$ ${saldoAtual.toFixed(2).replace(".", ",")}\nValor solicitado: R$ ${valor.toFixed(2).replace(".", ",")}`);
      exibirErro("Transação não realizada: Saldo insuficiente.");
      return;
    }
    novoSaldo = saldoAtual - valor;
  } else {
    novoSaldo = saldoAtual + valor;
  }

  try {
    // 1. Atualiza o saldo da conta no backend via PATCH
    await atualizarSaldoConta(contaSelecionada.id, novoSaldo);
    
    // 2. Cria o registro de histórico no backend via POST
    const novaTransacao = {
      contaId: contaSelecionada.id,
      tipo: tipoOperacao,
      valor: valor,
      saldoResultante: novoSaldo,
      data: new Date().toLocaleString("pt-BR")
    };
    await criarTransacao(novaTransacao);

    // 3. Sincroniza estado local e limpa o formulário
    contaSelecionada.saldo = novoSaldo;
    inputValorTransacao.value = "";
    alert("Operação realizada com sucesso!");

    await carregarHistorico();
  } catch (erro) {
    exibirErro("Erro ao processar a operação na API.");
  }
});

// ============================================================================
// EXIBIÇÃO DE HISTÓRICO E NAVEGAÇÃO DE PAGINAÇÃO
// ============================================================================

/**
 * Rebusca o histórico de transações filtrado da API para a conta ativa
 */
async function carregarHistorico() {
  if (!contaSelecionada) {
    historicoTransacoes = [];
    renderizarTabelaHistorico(historicoTransacoes, paginaAtual, itensPorPagina);
    return;
  }

  try {
    // Traz apenas as transações daquela conta
    historicoTransacoes = await buscarTransacoesPorConta(contaSelecionada.id);
    paginaAtual = 1; // Reseta para a primeira página
    renderizarTabelaHistorico(historicoTransacoes, paginaAtual, itensPorPagina);
  } catch (erro) {
    console.error("Erro ao carregar histórico:", erro);
  }
}

// Controle do botão de Página Anterior
btnAnterior.addEventListener("click", () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderizarTabelaHistorico(historicoTransacoes, paginaAtual, itensPorPagina);
  }
});

// Controle do botão de Próxima Página
btnProxima.addEventListener("click", () => {
  const totalPaginas = Math.ceil(historicoTransacoes.length / itensPorPagina);
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    renderizarTabelaHistorico(historicoTransacoes, paginaAtual, itensPorPagina);
  }
});

function exibirErro(mensagem) {
  msgErro.style.color = "red";
  msgErro.innerText = mensagem;
}