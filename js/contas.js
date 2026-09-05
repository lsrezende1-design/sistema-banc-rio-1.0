document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('usuarioLogado')) return;

  // Executa apenas se estiver na página de contas
  if (document.getElementById('form-conta')) {
    iniciarContas();
  }
});

const formConta = document.getElementById('form-conta');
const erroConta = document.getElementById('erro-conta');
const areaMensagens = document.getElementById('area-mensagens');

async function iniciarContas() {
  try {
    const [clientes, contas] = await Promise.all([
      buscarClientes(),
      buscarContas(),
    ]);

    preencherSelectClientes(clientes);
    renderizarContas(contas, clientes);
  } catch (erro) {
    if (areaMensagens) areaMensagens.textContent = 'Erro ao carregar módulo de contas.';
  }
}

// Função para gerar número único de conta (ex: 1001, 1002...)
// ======================================
// CÁLCULO DO DÍGITO VERIFICADOR (MÓDULO 11)
// ======================================
function calcularDigitoVerificador(operacao, numeroConta) {
  // Une a operação e o número da conta em uma única string de 7 dígitos (ex: "0011001")
  const base = `${operacao}${numeroConta}`;
  
  // Pesos de 8 até 2 para os 7 dígitos
  const pesos = [8, 7, 6, 5, 4, 3, 2];
  let soma = 0;

  for (let i = 0; i < base.length; i++) {
    soma += parseInt(base[i]) * pesos[i];
  }

  const resto = soma % 11;
  let dv = 11 - resto;

  // Se o DV for 10 ou 11, o dígito padrão bancário torna-se 0
  if (dv >= 10) {
    dv = 0;
  }

  return dv;
}

// ======================================
// GERADOR DE NÚMERO DE CONTA POR OPERAÇÃO
// ======================================
function gerarNumeroConta(contasExistentes, tipoConta) {
  // Define o código da operação
  const operacao = tipoConta === 'Corrente' ? '001' : '013';

  // Filtra apenas as contas da mesma operação/tipo
  const contasDoTipo = contasExistentes.filter((c) => {
    // Verifica se a conta salva começa com a mesma operação
    return c.numeroConta && c.numeroConta.startsWith(`${operacao}-`);
  });

  let proximoNumero = 1001;

  if (contasDoTipo.length > 0) {
    // Extrai o número do meio (ex: de "001-1001-9" pega o "1001")
    const numeros = contasDoTipo.map((c) => {
      const partes = c.numeroConta.split('-');
      return parseInt(partes[1], 10);
    });

    proximoNumero = Math.max(...numeros) + 1;
  }

  // Calcula o DV dinâmico com base na operação + número gerado
  const dv = calcularDigitoVerificador(operacao, proximoNumero.toString());

  // Formato final: PPP-NNNN-D (ex: 001-1001-4)
  return `${operacao}-${proximoNumero}-${dv}`;
}

// EVENTO: Salvar Nova Conta
if (formConta) {
  formConta.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (erroConta) erroConta.textContent = '';
    if (areaMensagens) areaMensagens.textContent = '';

    const clienteId = document.getElementById('conta-cliente').value;
    const tipo = document.getElementById('conta-tipo').value;

    if (!clienteId) {
      if (erroConta) erroConta.textContent = 'Por favor, selecione um cliente.';
      return;
    }

    try {
      const contas = await buscarContas();

      // Regra de Negócio: Cliente não pode ter duas contas do mesmo tipo
      const jaPossuiTipo = contas.some(
        (c) => String(c.clienteId) === String(clienteId) && c.tipo === tipo
      );

      if (jaPossuiTipo) {
        if (erroConta) erroConta.textContent = `Este cliente já possui uma Conta ${tipo}.`;
        return;
      }

      const novaConta = {
        clienteId: Number(clienteId),
        numeroConta: gerarNumeroConta(contas, tipo), // <-- Passamos o 'tipo' selecionado no formulário
        tipo: tipo,
        saldo: 0.0,
        status: 'Ativa',
      };

      await criarConta(novaConta);

      if (areaMensagens) areaMensagens.textContent = 'Conta aberta com sucesso!';
      formConta.reset();

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

// EVENTO: Deletar Conta
const tabelaContasCorpo = document.getElementById('tabela-contas-corpo');
if (tabelaContasCorpo) {
  tabelaContasCorpo.addEventListener('click', async (evento) => {
    const alvo = evento.target;
    if (alvo.dataset.acao === 'deletar-conta') {
      const id = Number(alvo.dataset.id);

      if (confirm('Tem certeza que deseja encerrar/deletar esta conta?')) {
        try {
          await deletarConta(id);
          if (areaMensagens) areaMensagens.textContent = 'Conta removida com sucesso.';

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