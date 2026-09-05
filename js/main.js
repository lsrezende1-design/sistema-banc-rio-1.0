document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("usuarioLogado")) {
    return;
  }

  iniciar();
});

let clienteEmEdicao = null;

const formCliente = document.getElementById("form-cliente");

const areaMensagens = document.getElementById("area-mensagens");

const erroCliente = document.getElementById("erro-cliente");

// ======================================
// INICIAR
// ======================================

async function iniciar() {
  try {
    const clientes = await buscarClientes();

    renderizarClientes(clientes);

    atualizarQuantidadeClientes(clientes);
  } catch (erro) {
    areaMensagens.textContent = "Erro ao carregar clientes.";
  }
}
//======================================
// FILTRO POR NOME (VIA API)
// ======================================

const filtroClienteNome = document.getElementById("filtro-cliente-nome");

filtroClienteNome.addEventListener("input", async () => {
  const termo = filtroClienteNome.value.toLowerCase();
  const clientes = await buscarClientes();

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(termo),
  );

  renderizarClientes(clientesFiltrados);
});
// ======================================
// CONTADOR
// ======================================

function atualizarQuantidadeClientes(clientes) {
  const contador = document.getElementById("quantidade-clientes");

  if (!contador) {
    return;
  }

  contador.textContent = `Total de clientes na carteira: ${clientes.length}`;
}

// ======================================
// SALVAR CLIENTE
// ======================================

formCliente.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  areaMensagens.textContent = "";
  erroCliente.textContent = "";

  const cliente = {
    nome: document.getElementById("cliente-nome").value.trim(),

    cpf: document.getElementById("cliente-cpf").value.trim(),

    email: document.getElementById("cliente-email").value.trim().toLowerCase(),
  };

  const erros = validarCliente(cliente);

  if (Object.keys(erros).length > 0) {
    erroCliente.textContent = Object.values(erros).join(" ");

    return;
  }

  try {
    const clientes = await buscarClientes();

    // ======================
    // CPF DUPLICADO
    // ======================

    const cpfExiste = clientes.some(
      (item) => item.cpf === cliente.cpf && item.id !== clienteEmEdicao,
    );

    if (cpfExiste) {
      erroCliente.textContent = "CPF já cadastrado.";

      return;
    }

    // ======================
    // EMAIL DUPLICADO
    // ======================

    const emailExiste = clientes.some(
      (item) => item.email === cliente.email && item.id !== clienteEmEdicao,
    );

    if (emailExiste) {
      erroCliente.textContent = "Email já cadastrado.";

      return;
    }

    // ======================
    // ATUALIZAR
    // ======================

    if (clienteEmEdicao !== null) {
      await atualizarCliente(clienteEmEdicao, cliente);

      areaMensagens.textContent = "Cliente atualizado com sucesso.";
    }

    // ======================
    // CRIAR
    // ======================
    else {
      await criarCliente(cliente);

      areaMensagens.textContent = "Cliente criado com sucesso.";
    }

    formCliente.reset();

    clienteEmEdicao = null;

    const clientesAtualizados = await buscarClientes();

    renderizarClientes(clientesAtualizados);

    atualizarQuantidadeClientes(clientesAtualizados);
  } catch (erro) {
    areaMensagens.textContent = "Erro ao salvar cliente.";
  }
});

// ======================================
// EDITAR E DELETAR
// ======================================

corpoTabelaClientes.addEventListener("click", async (evento) => {
  const alvo = evento.target;

  if (!alvo.dataset.acao) {
    return;
  }

  const id = Number(alvo.dataset.id);

  // ------------------------------
  // EDITAR
  // ------------------------------

  if (alvo.dataset.acao === "editar") {
    try {
      const cliente = await buscarClientePorId(id);

      if (!cliente) {
        return;
      }

      clienteEmEdicao = cliente.id;

      btnCancelar.style.display = "inline-block";

      document.getElementById("cliente-nome").value = cliente.nome;

      document.getElementById("cliente-cpf").value = cliente.cpf;

      document.getElementById("cliente-email").value = cliente.email;

      areaMensagens.textContent = `Editando cliente: ${cliente.nome}`;

      erroCliente.textContent = "";
    } catch (erro) {
      areaMensagens.textContent = "Erro ao carregar cliente.";
    }
  }

  // ------------------------------
  // DELETAR
  // ------------------------------

  if (alvo.dataset.acao === "deletar") {
    const confirmou = confirm("Tem certeza que deseja deletar este cliente?");

    if (!confirmou) {
      return;
    }

    try {
      await deletarCliente(id);

      areaMensagens.textContent = "Cliente deletado com sucesso.";

      erroCliente.textContent = "";

      if (clienteEmEdicao === id) {
        clienteEmEdicao = null;

        formCliente.reset();

        clienteEmEdicao = null;

        btnCancelar.style.display = "none";
      }

      const clientesAtualizados = await buscarClientes();

      renderizarClientes(clientesAtualizados);

      atualizarQuantidadeClientes(clientesAtualizados);
    } catch (erro) {
      areaMensagens.textContent = "Erro ao deletar cliente.";
    }
  }
});

// ======================================
// CANCELAR EDIÇÃO
// ======================================

const btnCancelar = document.getElementById("btn-cancelar");
btnCancelar.style.display = "none";

if (btnCancelar) {
  btnCancelar.addEventListener("click", () => {
    clienteEmEdicao = null;
    formCliente.reset();
    erroCliente.textContent = "";

    areaMensagens.textContent = "Edição cancelada.";
  });
}

// ---------------------------------
//          ALTERNAR TEMA
// ---------------------------------

// 1. Aplica o tema salvo imediatamente
const temaSalvo = localStorage.getItem("tema");
if (temaSalvo === "dark") {
  document.body.classList.add("dark");
}

// 2. Aguarda a montagem completa da página HTML
document.addEventListener("DOMContentLoaded", () => {
  const btnTema = document.getElementById("btn-tema");

  if (btnTema) {
    btnTema.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const temaAtual = document.body.classList.contains("dark")
        ? "dark"
        : "light";
      localStorage.setItem("tema", temaAtual);
    });
  }
});
