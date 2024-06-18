fetch('dados.json')
    .then(response => response.json())
    .then(data => {
        const rankingBody = document.getElementById('ranking-body');
        data.jogadores.forEach(jogador => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${jogador.posicao}</td>
                <td>${jogador.nome}</td>
                <td>${jogador.pontos}</td>
            `;
            rankingBody.appendChild(row);
        });
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));
