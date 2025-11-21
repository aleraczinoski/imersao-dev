document.addEventListener("DOMContentLoaded", async () => {
  const teamContainer = document.querySelector(".team-grid-container");
  const searchInput = document.querySelector("#busca-equipes");
  const searchButton = document.querySelector("#botao-busca-equipes");

  let allTeamsData = {}; // Armazena todos os dados das equipes para filtragem
  let allPilotsData = []; // Armazena todos os dados dos pilotos
  let teamInfoMap = {}; // Armazena os dados extras das equipes (imagem, link)

  /**
   * Converte o nome de uma equipe em um nome de classe CSS seguro.
   * @param {string} teamName O nome da equipe.
   * @returns {string} O nome da classe CSS.
   */
  function getTeamClass(teamName) {
    return teamName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  try {
    // Carrega os dados dos pilotos e das equipes em paralelo
    const [pilotsResponse, teamsResponse] = await Promise.all([
      fetch("pilotos.json"),
      fetch("equipes.json"),
    ]);

    allPilotsData = await pilotsResponse.json();
    const teamInfoArray = await teamsResponse.json();

    // Mapeia os dados das equipes pelo nome para acesso rápido
    teamInfoMap = teamInfoArray.reduce((acc, team) => {
      acc[team.nome] = team;
      return acc;
    }, {});

    // Agrupa pilotos por equipe
    allTeamsData = allPilotsData.reduce((acc, piloto) => {
      const equipe = piloto.equipe;
      (acc[equipe] = acc[equipe] || []).push(piloto);
      return acc;
    }, {});

    renderTeams(allTeamsData); // Renderiza todos os times inicialmente

    // Adiciona os eventos de busca
    searchButton.addEventListener("click", filterTeams);
    // searchInput.addEventListener("input", filterTeams); // REMOVIDO: Não filtra mais em tempo real
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        filterTeams();
      }
    });
  } catch (error) {
    console.error("Erro ao carregar dados das equipes:", error);
    teamContainer.innerHTML = `<p class="no-results">Não foi possível carregar as equipes.</p>`;
  }

  function filterTeams() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTeams = {};

    for (const teamName in allTeamsData) {
      const pilots = allTeamsData[teamName];
      const teamNameLower = teamName.toLowerCase();

      // Verifica se o nome da equipe ou o nome de algum piloto corresponde ao termo de busca
      const teamMatches = teamNameLower.includes(searchTerm);
      const pilotMatches = pilots.some((piloto) =>
        piloto.nome.toLowerCase().includes(searchTerm)
      );

      if (teamMatches || pilotMatches) {
        filteredTeams[teamName] = pilots;
      }
    }
    renderTeams(filteredTeams);
  }

  function renderTeams(equipes) {
    teamContainer.innerHTML = "";

    if (Object.keys(equipes).length === 0) {
      teamContainer.innerHTML = `<p class="no-results">Nenhuma equipe encontrada.</p>`;
      return;
    }

    for (const nomeEquipe in equipes) {
      const pilotosDaEquipe = equipes[nomeEquipe];
      const teamClass = getTeamClass(nomeEquipe);
      const equipeInfo = teamInfoMap[nomeEquipe] || {};
      const carImage = equipeInfo.carImage || "";
      const teamLink = equipeInfo.link || "#";

      const linkWrapper = document.createElement("a");
      linkWrapper.href = teamLink;
      linkWrapper.target = "_blank";
      linkWrapper.className = `team-card ${teamClass}`;

      const pilotosHtml = pilotosDaEquipe
        .map(
          (piloto) => `
          <div class="team-driver">
            <img src="${piloto.imagem}" alt="${piloto.nome}" class="team-driver-image">
            <span class="team-driver-name">${piloto.nome}</span>
          </div>`
        )
        .join("");

      linkWrapper.innerHTML = `
          <div class="team-card-car-image-container">
            <img src="${carImage}" alt="Carro da ${nomeEquipe}" class="team-card-car-image">
            <h3>${nomeEquipe}</h3>
          </div>
          <div class="team-card-drivers">${pilotosHtml}</div>`;

      teamContainer.appendChild(linkWrapper);
    }
  }
});
