// Dados de exemplo: Consumo em m3 para cada dia da semana
const dadosConsumo = {
    'chart-seg': 85,
    'chart-ter': 101, // Alto consumo
    'chart-qua': 95,
    'chart-qui': 70,
    'chart-sex': 100, // Alto consumo
    'chart-sab': 60,
    'chart-dom': 40
};

const LIMITE = 100;

// Plugin para transformar a barra em uma Pirâmide (Triângulo)
const pyramidPlugin = {
    id: 'pyramidPlugin',
    beforeDatasetsDraw(chart) {
        const { ctx, data, chartArea: { bottom }, scales: { x, y } } = chart;

        data.datasets.forEach((dataset, i) => {
            chart.getDatasetMeta(i).data.forEach((bar, index) => {
                const valor = dataset.data[index];
                const xPos = bar.x;
                const yPos = bar.y;
                const width = bar.width;

                ctx.save();
                // Define a cor: Vermelho se passar do limite, Azul se estiver ok
                ctx.fillStyle = valor > LIMITE ? '#ff5252' : '#3b6d9c';
                
                // Desenha o triângulo
                ctx.beginPath();
                ctx.moveTo(xPos - width / 2, bottom); // Base esquerda
                ctx.lineTo(xPos + width / 2, bottom); // Base direita
                ctx.lineTo(xPos, yPos);               // Topo
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            });
        });
    }
};

// Função para criar cada gráfico individual
function criarGrafico(id, valor, dia) {
    const ctx = document.getElementById(id).getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [dia],
            datasets: [{
                data: [valor],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 150, // Limite visual máximo do gráfico
                    display: false // Esconde os números laterais para ficar limpo
                },
                x: {
                    grid: { display: false }
                }
            }
        },
        plugins: [pyramidPlugin]
    });
}

// Inicializa a página
window.onload = () => {
    let alertaAtivo = false;

    // Criar os 7 gráficos
    const ids = Object.keys(dadosConsumo);
    const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    ids.forEach((id, index) => {
        const valor = dadosConsumo[id];
        criarGrafico(id, valor, dias[index]);

        // Verifica se algum valor ultrapassa o limite para exibir o alerta
        if (valor > LIMITE) alertaAtivo = true;
    });

    // Mostrar alerta se necessário
    if (alertaAtivo) {
        document.getElementById('alert-consumption').classList.remove('hidden');
    }
};