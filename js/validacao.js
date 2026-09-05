// ======================================
// VALIDAÇÃO DE CLIENTE
// ======================================

function validarCliente(cliente) {
  const erros = {};

  // ==========================
  // NOME
  // ==========================

  const nome = cliente.nome.trim();

  if (!nome) {
    erros.nome = "Nome é obrigatório.";
  } else if (nome.length < 3) {
    erros.nome = "Nome deve possuir pelo menos 3 caracteres.";
  } else {
    const regexLetras = /^[A-Za-zÀ-ÖØ-öø-ÿ'\s]+$/;

    if (!regexLetras.test(nome)) {
      erros.nome = "Nome deve conter apenas letras.";
    }
  }

  // ==========================
  // CPF
  // ==========================

  const cpf = cliente.cpf.trim();

  if (!cpf) {
    erros.cpf = "CPF é obrigatório.";
  } else if (!/^\d+$/.test(cpf)) {
    erros.cpf = "CPF deve conter apenas números.";
  } else if (cpf.length !== 11) {
    erros.cpf = "CPF deve possuir 11 dígitos.";
  } else {
    const cpfSomenteNumerosIguais = cpf
      .split("")
      .every((caractere) => caractere === cpf[0]);
    if (cpfSomenteNumerosIguais) {
      erros.cpf = "CPF inválido (não pode ter todos os números iguais).";
    }
  }

  // ==========================
  // EMAIL
  // ==========================

  const email = cliente.email.trim();

  if (!email) {
    erros.email = "Email é obrigatório.";
  } else if (!email.includes("@")) {
    erros.email = "Email deve conter @.";
  } else {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {
      erros.email = `O formato do Email deve ser: usuario@dominio.com ou usuario@dominio.com.br`;
    }
  }
  return erros;
}
