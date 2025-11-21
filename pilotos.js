let cardContainer = document.querySelector("main.card-container");
let searchInput = document.querySelector("#busca"); // CORRIGIDO: Usando o ID correto do seu HTML
let searchButton = document.querySelector("#botao-busca");

let dados = [];

async function iniciarBusca() {
  try {
    let resposta = await fetch("pilotos.json");
    dados = await resposta.json();
    renderizarCards(dados);
    searchButton.addEventListener("click", filtrarPilotos);
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        filtrarPilotos();
      }
    });
  } catch (error) {
    console.error("Erro ao buscar os dados dos pilotos:", error);
  }
}

function filtrarPilotos() {
  const termoBusca = searchInput.value.toLowerCase();
  const pilotosFiltrados = dados.filter(
    (piloto) =>
      piloto.nome.toLowerCase().includes(termoBusca) ||
      piloto.equipe.toLowerCase().includes(termoBusca) ||
      piloto.descricao.toLowerCase().includes(termoBusca)
  );
  renderizarCards(pilotosFiltrados);
}

/**
 * Converte o nome de uma equipe em um nome de classe CSS seguro.
 * Ex: "Scuderia Ferrari" -> "scuderia-ferrari"
  @param {string} teamName O nome da equipe.
 * @returns {string} O nome da classe CSS.
 */
function getTeamClass(teamName) {
  return teamName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function renderizarCards(dados) {
  cardContainer.innerHTML = "";

  if (dados.length === 0) {
    cardContainer.innerHTML = `<p class="no-results">Nenhum piloto encontrado. Tente um termo de busca diferente.</p>`;
    return;
  }

  for (let dado of dados) {
    let article = document.createElement("article");
    article.classList.add("card");
    article.classList.add(getTeamClass(dado.equipe));

    // Cria a lista de títulos
    const titulosHtml = `
      <ul class="titulos-lista">
        ${dado.titulos.map((titulo) => `<li>${titulo}</li>`).join("")}
      </ul>
    `;

    article.innerHTML = `
      <div class="card-image-container">
        <img class="card-image" src="${dado.imagem}" alt="Foto de ${dado.nome}">
      </div>
      <div class="card-content">
        <h2>${dado.nome}</h2>
        <p><strong>Equipe:</strong> ${dado.equipe}</p>
        <p>${dado.descricao}</p>
        ${dado.titulos.length > 0 ? titulosHtml : ""}
      </div>
    `;
    // Abre o link do piloto em uma nova aba ao clicar
    article.addEventListener("click", () => {
      window.open(dado.link, "_blank");
    });

    cardContainer.appendChild(article);
  }
}

iniciarBusca();
