document.addEventListener("DOMContentLoaded", () => {
  const glossarioContainer = document.getElementById("glossario-container");
  const buscaInput = document.getElementById("busca-glossario");
  const buscaBotao = document.getElementById("botao-busca-glossario");
  let todosOsTermos = [];

  async function carregarGlossario() {
    try {
      const response = await fetch("glossario.json");
      if (!response.ok) {
        throw new Error("Erro na rede ao buscar o glossário");
      }
      todosOsTermos = await response.json();
      renderizarTermos(todosOsTermos);
    } catch (error) {
      console.error("Erro ao carregar os dados do glossário:", error);
      glossarioContainer.innerHTML =
        '<p class="no-results">Não foi possível carregar o glossário. Tente novamente mais tarde.</p>';
    }
  }

  function renderizarTermos(termos) {
    glossarioContainer.innerHTML = "";

    if (termos.length === 0) {
      glossarioContainer.innerHTML =
        '<p class="no-results">Nenhum termo encontrado.</p>';
      return;
    }

    termos.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card-glossario";
      card.innerHTML = `
        <h3>${item.termo}</h3>
        <p>${item.descricao}</p>
      `;
      glossarioContainer.appendChild(card);
    });
  }

  function filtrarTermos() {
    const termoBusca = buscaInput.value.toLowerCase().trim();
    const termosFiltrados = todosOsTermos.filter(
      (item) =>
        item.termo.toLowerCase().includes(termoBusca) ||
        item.descricao.toLowerCase().includes(termoBusca)
    );
    renderizarTermos(termosFiltrados);
  }

  buscaBotao.addEventListener("click", filtrarTermos);
  buscaInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") filtrarTermos();
  });

  carregarGlossario();
});
