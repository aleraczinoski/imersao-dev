document.addEventListener("DOMContentLoaded", () => {
  const pistasContainer = document.getElementById("pistas-container");
  const buscaInput = document.getElementById("busca-pistas");
  const buscaBotao = document.getElementById("botao-busca-pistas");
  let todasAsPistas = [];

  // Função para buscar e carregar os dados das pistas do arquivo JSON
  async function carregarPistas() {
    try {
      const response = await fetch("pistas.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      todasAsPistas = await response.json();
      renderizarPistas(todasAsPistas);
    } catch (error) {
      console.error("Erro ao carregar os dados das pistas:", error);
      pistasContainer.innerHTML =
        '<p class="no-results">Não foi possível carregar as pistas. Tente novamente mais tarde.</p>';
    }
  }

  // Função para renderizar os cards das pistas na tela
  function renderizarPistas(pistas) {
    pistasContainer.innerHTML = ""; // Limpa o container antes de adicionar novos cards

    if (pistas.length === 0) {
      pistasContainer.innerHTML =
        '<p class="no-results">Nenhuma pista encontrada.</p>';
      return;
    }

    pistas.forEach((pista) => {
      const card = document.createElement("div");
      card.className = "pista-card";
      card.innerHTML = `
        <a href="${pista.link}" target="_blank">
          <img src="${pista.imagem}" alt="Traçado da pista de ${pista.nome}" class="pista-card-image">
          <div class="pista-card-content">
            <h2>${pista.nome}</h2>
            <ul>
              <li>${pista.local}</li>
              <li>${pista.circuito}</li>
              <li>${pista.data}</li>
            </ul>
          </div>
        </a>
      `;
      pistasContainer.appendChild(card);
    });
  }

  // Função para filtrar as pistas com base no termo de busca
  function filtrarPistas() {
    const termoBusca = buscaInput.value.toLowerCase().trim();
    const pistasFiltradas = todasAsPistas.filter(
      (pista) =>
        pista.nome.toLowerCase().includes(termoBusca) ||
        pista.local.toLowerCase().includes(termoBusca)
    );
    renderizarPistas(pistasFiltradas);
  }

  // Adiciona o event listener para o clique no botão de busca
  buscaBotao.addEventListener("click", filtrarPistas);

  // Adiciona o event listener para a tecla "Enter" no input de busca
  buscaInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      filtrarPistas();
    }
  });

  // Carrega as pistas assim que a página é carregada
  carregarPistas();
});
