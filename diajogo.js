const pointsMap = {
    1: 1200,
    2: 950,
    3: 800,
    4: 700,
    5: 600,
    6: 500,
    7: 400,
    8: 300,
    9: 200,
    10: 100
};

let selectedPositions = {};

fetch('dados.json')
    .then(response => response.json())
    .then(data => {
        const playersDiv = document.getElementById('players');
        data.jogadores.forEach((jogador, index) => {
            const playerSelect = document.createElement('div');
            playerSelect.classList.add('player-select');
            playerSelect.innerHTML = `
                <label for="player-${index}">${jogador.nome}</label>
                <select id="player-${index}" class="position-select" data-name="${jogador.nome}" onchange="handleSelectChange(event)">
                    <option value="">Posição</option>
                    ${Object.keys(pointsMap).map(pos => `<option value="${pos}">${pos}</option>`).join('')}
                </select>
            `;
            playersDiv.appendChild(playerSelect);
        });
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));

function handleSelectChange(event) {
    const select = event.target;
    const selectedValue = select.value;
    const playerName = select.getAttribute('data-name');

    if (selectedPositions[playerName]) {
        delete selectedPositions[selectedPositions[playerName]];
    }

    if (selectedValue) {
        selectedPositions[selectedValue] = playerName;
    }

    updateSelectOptions();
}

function updateSelectOptions() {
    const selects = document.querySelectorAll('select.position-select');
    selects.forEach(select => {
        const currentValue = select.value;
        select.querySelectorAll('option').forEach(option => {
            if (option.value === "" || option.value === currentValue) {
                option.disabled = false;
            } else {
                option.disabled = !!selectedPositions[option.value];
            }
        });
    });
}

function updateScores() {
    fetch('dados.json')
        .then(response => response.json())
        .then(data => {
            const selects = document.querySelectorAll('select.position-select');
            selects.forEach(select => {
                const position = select.value;
                if (position) {
                    const playerName = select.getAttribute('data-name');
                    const player = data.jogadores.find(j => j.nome === playerName);
                    if (player) {
                        player.pontos += pointsMap[position];
                        player.jogos += 1;
                    }
                }
            });
            // Atualizar os dados na página
            displayUpdatedData(data.jogadores);
        })
        .catch(error => console.error('Erro ao atualizar os dados:', error));
}

function displayUpdatedData(jogadores) {
    const playersDiv = document.getElementById('players');
    playersDiv.innerHTML = '';
    jogadores.forEach((jogador, index) => {
        const playerSelect = document.createElement('div');
        playerSelect.classList.add('player-select');
        playerSelect.innerHTML = `
            <label for="player-${index}">${jogador.nome}</label>
            <span>Pontos: ${jogador.pontos} | Jogos: ${jogador.jogos}</span>
            <select id="player-${index}" class="position-select" data-name="${jogador.nome}" onchange="handleSelectChange(event)">
                <option value="">Posição</option>
                ${Object.keys(pointsMap).map(pos => `<option value="${pos}">${pos}</option>`).join('')}
            </select>
        `;
        playersDiv.appendChild(playerSelect);
    });
    updateSelectOptions();
}
