// ======================================
// LOGIN
// ======================================

async function login(usuario, senha) {
  try {
    const resposta = await fetch(
      `${API_URL}/usuarios?usuario=${usuario}&senha=${senha}`
    );

    const usuarios = await resposta.json();

    if (usuarios.length === 0) {
      return false;
    }

    localStorage.setItem('usuarioLogado', JSON.stringify(usuarios[0]));

    return true;
  } catch (erro) {
    console.error('Erro ao realizar login:', erro);

    return false;
  }
}

// ======================================
// ENTRAR
// ======================================

async function entrar(evento) {
  if (evento) {
    evento.preventDefault();
  }

  const usuario = document.getElementById('usuario')?.value;

  const senha = document.getElementById('senha')?.value;

  const mensagem = document.getElementById('mensagem');

  const sucesso = await login(usuario, senha);

  if (sucesso) {
    if (mensagem) {
      mensagem.textContent = 'Login realizado com sucesso!';

      mensagem.style.color = 'green';
    }

    setTimeout(() => {
      location.reload();
    }, 500);
  } else {
    if (mensagem) {
      mensagem.textContent = 'Usuário ou senha inválidos.';

      mensagem.style.color = 'red';
    }
  }
}

// ======================================
// LOGOUT
// ======================================

function logout() {
  localStorage.removeItem('usuarioLogado');

  location.href = 'index.html';
}

// ======================================
// USUÁRIO LOGADO
// ======================================

function getUsuarioLogado() {
  const usuario = localStorage.getItem('usuarioLogado');

  if (!usuario) {
    return null;
  }

  return JSON.parse(usuario);
}

// ======================================
// VERIFICA LOGIN
// ======================================

function estaLogado() {
  return getUsuarioLogado() !== null;
}

// ======================================
// PROTEÇÃO DAS PÁGINAS
// ======================================

function protegerPagina() {
  const paginaAtual = window.location.href;

  const estaNaIndex =
    paginaAtual.includes('index.html') || paginaAtual.endsWith('/');

  if (!estaNaIndex && !estaLogado()) {
    alert('Você precisa realizar login para acessar esta página.');

    location.href = 'index.html';
  }
}

// ======================================
// BOAS-VINDAS
// ======================================

function carregarBoasVindas() {
  const usuario = getUsuarioLogado();

  const boasVindas = document.getElementById('boasVindas');

  if (!boasVindas) {
    return;
  }

  if (usuario) {
    boasVindas.textContent = `Seja bem-vindo, ${usuario.nome}`;
  } else {
    boasVindas.textContent = 'Faça login para acessar o sistema';
  }
}

// ======================================
// ATUALIZA INTERFACE
// ======================================

function atualizarInterface() {
  const usuario = getUsuarioLogado();

  const loginForm = document.getElementById('loginForm');

  const logoutBtn = document.getElementById('logout');

  const usuarioLogado = document.getElementById('usuarioLogado');

  const boasVindas = document.getElementById('boasVindas');

  const botoesMenu = document.querySelectorAll('#sidebar .btn');

  if (usuario) {
    // LOGIN EFETUADO

    if (loginForm) {
      loginForm.style.display = 'none';
    }

    if (logoutBtn) {
      logoutBtn.style.display = 'block';
    }

    if (usuarioLogado) {
      usuarioLogado.textContent = 'Painel de Clientes';
    }

    if (boasVindas) {
      boasVindas.textContent = `Seja bem-vindo, ${usuario.nome}`;
    }

    botoesMenu.forEach((botao) => {
      botao.disabled = false;

      botao.style.opacity = '1';

      botao.style.cursor = 'pointer';
    });
  } else {
    // NÃO LOGADO

    if (loginForm) {
      loginForm.style.display = 'block';
    }

    if (logoutBtn) {
      logoutBtn.style.display = 'none';
    }

    if (usuarioLogado) {
      usuarioLogado.textContent = 'Painel de Clientes';
    }

    if (boasVindas) {
      boasVindas.textContent = 'Faça login para acessar o sistema';
    }

    botoesMenu.forEach((botao) => {
      botao.disabled = true;

      botao.style.opacity = '0.5';

      botao.style.cursor = 'not-allowed';
    });
  }
}

// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener('DOMContentLoaded', () => {
  atualizarInterface();

  carregarBoasVindas();

  const logoutBtn = document.getElementById('logout');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});
