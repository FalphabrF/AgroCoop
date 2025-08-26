// dashboard.js - Lógica da Dashboard AGROCOOP TECH

// Dados simulados para os cards
const dadosDashboard = {
    producao: 1200,
    vendas: 350000,
    estoque: 800,
    entregas: 5
};

// Função para atualizar os cards do dashboard
function atualizarDashboard() {
    document.getElementById('card-producao').textContent = `${dadosDashboard.producao} t`;
    document.getElementById('card-vendas').textContent = `R$ ${dadosDashboard.vendas.toLocaleString()}`;
    document.getElementById('card-estoque').textContent = `${dadosDashboard.estoque} t`;
    document.getElementById('card-entregas').textContent = `${dadosDashboard.entregas} entregas agendadas`;
}

// Atalhos rápidos
document.getElementById('atalho-votacoes').onclick = () => window.location.href = 'votacoes.html';
document.getElementById('atalho-compras').onclick = () => window.location.href = 'compras.html';
document.getElementById('atalho-notificacoes').onclick = () => window.location.href = 'perfil.html#notificacoes';

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarDashboard();
});
