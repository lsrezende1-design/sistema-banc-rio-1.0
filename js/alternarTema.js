// Aguarda o DOM carregar completamente
document.addEventListener("DOMContentLoaded", () => {
  const botaoAlternarTema = document.getElementById("btn-tema");
  const temaAtual = localStorage.getItem("tema");

  // Aplica o tema salvo ao carregar a página
  if (temaAtual === "dark") {
    document.body.classList.add("dark");
  }

  // Evento de clique para alternar o tema
  if (botaoAlternarTema) {
    botaoAlternarTema.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      // Salva a escolha no localStorage
      if (document.body.classList.contains("dark")) {
        localStorage.setItem("tema", "dark");
      } else {
        localStorage.setItem("tema", "light");
      }
    });
  }
});
