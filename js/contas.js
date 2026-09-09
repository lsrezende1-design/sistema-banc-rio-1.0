// ============================================================================
// INICIALIZAÇÃO DO MÓDULO DE CONTAS
// ============================================================================

// Garante que o script rode após o carregamento completo do DOM da página
document.addEventListener('DOMContentLoaded', () => {
  // Guarda de Segurança: Se não houver usuário logado no localStorage, interrompe a execução
  if (!localStorage.getItem('usuarioLogado')) return;

  // Executa o módulo apenas se o formulário de cadastro de contas existir no HTML da página atual
  if (document.getElementById('form-conta')) {
    iniciarContas();
  }
});

// Captura de elementos da interface
const formConta = document.getElementById('form-conta');
const erroConta = document.getElementById('erro-conta');
const areaMensagens = document.getElementById('area-mensagens');

/**
 * Função inicial para carregar dados da API e renderizar a tela
 */
async function iniciarContas() {
  try {
    // Busca clientes e contas simultaneamente em paralelo para otimizar o tempo de carregamento
    const [clientes, contas] = await Promise.all([
      buscarClientes(),
      buscarContas(),
    ]);

    // Preenche as opções do select de clientes e desenha a tabela na tela
    preencherSelectClientes(clientes);
    renderizarContas(contas, clientes);
  } catch (erro) {
    if (areaMensagens) areaMensagens.textContent = 'Erro ao carregar módulo de contas.';
  }
}

// ============================================================================
// CÁLCULO DO DÍGITO VERIFICADOR (ALGORITMO MÓDULO 11 BANCÁRIO)
// ============================================================================

/**
 * Calcula o Dígito Verificador (DV) baseado no algoritmo oficial de Módulo 11
 * @param {string} operacao - Código da operação ('001' ou '013')
 * @param {string} numeroConta - Número sequencial da conta (ex: '1001')
 * @returns {number} Dígito verificador resultante (0 a 9)
 */
function calcularDigitoVerificador(operacao, numeroConta) {
  // Une a operação (3 dígitos) e a conta (4 dígitos) em uma string de 7 caracteres (ex: "0011001")
  const base = `${operacao}${numeroConta}`;
  
  // Vetor de pesos regressivos aplicados da esquerda para a direita
  const pesos = [8, 7, 6, 5, 4, 3, 2];
  let soma = 0;

  // Multiplica cada dígito da base pelo seu peso correspondente e acumula na soma
  for (let i = 0; i < base.length; i++) {
    soma += parseInt(base[i]) * pesos[i];
  }

  // Obtém o resto da divisão por 11
  const resto = soma % 11;
  
  // O DV é a diferença entre 11 e o resto
  let dv = 11 - resto;

  // Regra padrão do Sistema Financeiro: Se a diferença for 10 ou 11, o dígito passa a ser 0
  if (dv >= 10) {
    dv = 0;
  }

  return dv;
}

// ============================================================================
// GERADOR DE NÚMERO DE CONTA POR OPERAÇÃO
// ============================================================================

/**
 * Gera um novo número de conta formatado de acordo com a operação e contas cadastradas
 * @param {Array} contasExistentes - Array contendo todas as contas atuais do banco de dados
 * @param {string} tipoConta - 'Corrente' ou 'Poupança'
 * @returns {string} Número formatado (ex: "001-1001-4")
 */
function gerarNumeroConta(contasExistentes, tipoConta) {
  // Associa a operação ao tipo de conta: '001' para Corrente, '013' para Poupança
  const operacao = tipoConta === 'Corrente' ? '001' : '013';

  // Filtra apenas as contas do mesmo tipo/operação para gerar o próximo sequencial correto
  const contasDoTipo = contasExistentes.filter((c) => {
    return c.numeroConta && c.numeroConta.startsWith(`${operacao}-`);
  });

  // Valor inicial padrão para o sequencial da primeira conta
  let proximoNumero = 1001;

  // Se já houverem contas deste tipo cadastradas
  if (contasDoTipo.length > 0) {
    // Extrai e converte o número sequencial do meio (ex: de "001-1001-9" obtém 1001)
    const numeros = contasDoTipo.map((c) => {
      const partes = c.numeroConta.split('-');
      return parseInt(partes[1], 10);
    });

    // Encontra o maior sequencial existente e soma +1 para o próximo
    proximoNumero = Math.max(...numeros) + 1;
  }

  // Gera o dígito verificador através do algoritmo do Módulo 11
  const dv = calcularDigitoVerificador(operacao, proximoNumero.toString());

  // Retorna a string final no padrão bancário: "001-1001-4"
  return `${operacao}-${proximoNumero}-${dv}`;
}

// ============================================================================
// EVENTOS E EVENT LISTENERS
// ============================================================================

// EVENTO: Submissão do Formulário para Abertura de Conta
if (formConta) {
  formConta.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // Impede o recarregamento padrão da página
    if (erroConta) erroConta.textContent = '';
    if (areaMensagens) areaMensagens.textContent = '';

    const clienteId = document.getElementById('conta-cliente').value;
    const tipo = document.getElementById('conta-tipo').value;

    // Validação básica do formulário
    if (!clienteId) {
      if (erroConta) erroConta.textContent = 'Por favor, selecione um cliente.';
      return;
    }

    try {
      const contas = await buscarContas();

      // Regra de Negócio: O mesmo cliente não pode possuir duas contas do mesmo tipo
      const jaPossuiTipo = contas.some(
        (c) => String(c.clienteId) === String(clienteId) && c.tipo === tipo
      );

      if (jaPossuiTipo) {
        if (erroConta) erroConta.textContent = `Este cliente já possui uma Conta ${tipo}.`;
        return;
      }

      // Constrói o novo objeto de conta
      const novaConta = {
        clienteId: Number(clienteId),
        numeroConta: gerarNumeroConta(contas, tipo),
        tipo: tipo,
        saldo: 0.0,
        status: 'Ativa',
      };

      // Grava no backend
      await criarConta(novaConta);

      if (areaMensagens) areaMensagens.textContent = 'Conta aberta com sucesso!';
      formConta.reset();

      // Rebusca os dados atualizados para recarregar a tabela em tela
      const [clientesAtualizados, contasAtualizadas] = await Promise.all([
        buscarClientes(),
        buscarContas(),
      ]);

      renderizarContas(contasAtualizadas, clientesAtualizados);
    } catch (erro) {
      if (areaMensagens) areaMensagens.textContent = 'Erro ao criar conta.';
    }
  });
}

// EVENTO: Exclusão / Encerramento de Conta via Delegação de Eventos na Tabela
const tabelaContasCorpo = document.getElementById('tabela-contas-corpo');
if (tabelaContasCorpo) {
  tabelaContasCorpo.addEventListener('click', async (evento) => {
    const alvo = evento.target;
    // Verifica se o clique ocorreu em um botão de ação "deletar-conta"
    if (alvo.dataset.acao === 'deletar-conta') {
      const id = Number(alvo.dataset.id);

      if (confirm('Tem certeza que deseja encerrar/deletar esta conta?')) {
        try {
          await deletarConta(id);
          if (areaMensagens) areaMensagens.textContent = 'Conta removida com sucesso.';

          // Recarrega os dados após a exclusão
          const [clientes, contas] = await Promise.all([
            buscarClientes(),
            buscarContas(),
          ]);

          renderizarContas(contas, clientes);
        } catch (erro) {
          if (areaMensagens) areaMensagens.textContent = 'Erro ao deletar conta.';
        }
      }
    }
  });
}

// ============================================================================
// SISTEMA DE FILTRAGEM DINÂMICA
// ============================================================================

const filtroContaNome = document.getElementById("filtro-conta-nome");
const filtroContaNumero = document.getElementById("filtro-conta-numero");

/**
 * Filtra a exibição das contas com base nos campos de busca por Nome e/ou Número
 */
async function aplicarFiltroContas() {
  try {
    const termoNome = filtroContaNome ? filtroContaNome.value.toLowerCase().trim() : "";
    const termoNumero = filtroContaNumero ? filtroContaNumero.value.toLowerCase().trim() : "";

    // Obtém dados limpos e atualizados da API
    const [contas, clientes] = await Promise.all([buscarContas(), buscarClientes()]);

    // Aplica o filtro combinando os dois critérios
    const contasFiltradas = contas.filter((conta) => {
      const cliente = clientes.find((c) => String(c.id) === String(conta.clienteId));
      const nomeCliente = cliente ? cliente.nome.toLowerCase() : "";
      const numeroConta = String(conta.numeroConta).toLowerCase();

      const atendeNome = nomeCliente.includes(termoNome);
      const atendeNumero = numeroConta.includes(termoNumero);

      return atendeNome && atendeNumero;
    });

    // Renderiza a tabela filtrada
    renderizarContas(contasFiltradas, clientes);
  } catch (erro) {
    console.error("Erro ao aplicar filtro nas contas:", erro);
  }
}

// Adiciona eventos de input em tempo real nos campos de pesquisa
if (filtroContaNome) filtroContaNome.addEventListener("input", aplicarFiltroContas);
if (filtroContaNumero) filtroContaNumero.addEventListener("input", aplicarFiltroContas);