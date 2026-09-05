// ======================================
// ESTADO E ELEMENTOS DO MÓDULO TRANSAÇÕES
// ======================================

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

let listaContas = [];
let listaClientes = [];
let historicoTransacoes = [];
let contaSelecionada = null;

let paginaAtual = 1;
const itensPorPagina = 5;

// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener("DOMContentLoaded", async () => {
  await carregarDadosIniciais();
  configurarMascaraMoeda();
  configurarEventosSelecao();
});

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

// ======================================
// SELEÇÃO INTEGRADA DE CONTA (SELECT OU TIPO+NUMERO+DÍGITO)
// ======================================

function configurarEventosSelecao() {
  // Quando escolhe pelo select
  selectConta.addEventListener("change", () => {
    const id = selectConta.value;
    if (id) {
      contaSelecionada = listaContas.find((c) => String(c.id) === String(id));
      if (contaSelecionada) {
        // Separa número e dígito se existir formato "12345-6"
        const partes = String(contaSelecionada.numeroConta).split("-");
        inputTipoConta.value = contaSelecionada.tipo || "";
        inputNumeroConta.value = partes[0] || "";
        inputDigitoConta.value = partes[1] || "0";
      }
    } else {
      limparSelecaoManual();
    }
    carregarHistorico();
  });

  // Quando digita nos campos manuais
  const inputsManuais = [inputTipoConta, inputNumeroConta, inputDigitoConta];
  inputsManuais.forEach((el) => {
    el.addEventListener("input", buscarContaPorCamposManuais);
  });
}

function buscarContaPorCamposManuais() {
  const tipo = inputTipoConta.value.trim().toLowerCase();
  const num = inputNumeroConta.value.trim();
  const digito = inputDigitoConta.value.trim();

  // Se o usuário ainda não digitou o número, reseta a seleção
  if (!num) {
    selectConta.value = "";
    contaSelecionada = null;
    carregarHistorico();
    return;
  }

  const contaEncontrada = listaContas.find((c) => {
    const numeroNoBanco = String(c.numeroConta).trim(); // Ex: "001-1001-9"
    const tipoNoBanco = String(c.tipo || "").trim().toLowerCase();

    // 1. Validação do Tipo (se selecionado no dropdown manual)
    const mesmoTipo = !tipo || tipoNoBanco === tipo;

    // 2. Validação do Número e Dígito flexível:
    // Verifica se o número informado está contido na string do banco
    const contemNumero = numeroNoBanco.includes(num);
    
    // Se o dígito foi informado, verifica se o número do banco termina exatamente com "-digito"
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

// ======================================
// MÁSCARA AUTOMÁTICA DE MOEDA (R$)
// ======================================

function configurarMascaraMoeda() {
  inputValorTransacao.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value) {
      e.target.value = "";
      return;
    }
    value = (Number(value) / 100).toFixed(2);
    e.target.value = `R$ ${value.replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  });
}

function obterValorNumerico() {
  const texto = inputValorTransacao.value;
  const limpo = texto.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
  return parseFloat(limpo) || 0;
}


// ======================================
// REGISTRO DE TRANSAÇÃO E REGRA DE SAQUE
// ======================================

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

  // Validação do Saldo para Saque
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
    // 1. Atualiza o saldo da conta na API
    await atualizarSaldoConta(contaSelecionada.id, novoSaldo);
    
    // 2. Grava a transação no histórico
    const novaTransacao = {
      contaId: contaSelecionada.id,
      tipo: tipoOperacao,
      valor: valor,
      saldoResultante: novoSaldo,
      data: new Date().toLocaleString("pt-BR")
    };
    await criarTransacao(novaTransacao);

    // 3. Atualiza estado local
    contaSelecionada.saldo = novoSaldo;
    inputValorTransacao.value = "";
    alert("Operação realizada com sucesso!");

    await carregarHistorico();
  } catch (erro) {
    exibirErro("Erro ao processar a operação na API.");
  }
});

// ======================================
// HISTÓRICO E PAGINAÇÃO
// ======================================

// Substitua as chamadas do historico por:
async function carregarHistorico() {
  if (!contaSelecionada) {
    historicoTransacoes = [];
    renderizarTabelaHistorico(historicoTransacoes, paginaAtual, itensPorPagina);
    return;
  }

  try {
    historicoTransacoes = await buscarTransacoesPorConta(contaSelecionada.id);
    paginaAtual = 1;
    renderizarTabelaHistorico(historicoTransacoes, paginaAtual, itensPorPagina);
  } catch (erro) {
    console.error("Erro ao carregar histórico:", erro);
  }
}

btnAnterior.addEventListener("click", () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderizarTabelaHistorico(historicoTransacoes, paginaAtual, itensPorPagina);
  }
});

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