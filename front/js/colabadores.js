document.addEventListener("DOMContentLoaded", async () => {
  const rankingList = document.getElementById("ranking-list");

  try {
    // Faz a requisição para o backend Node.js
    const response = await fetch("/api/top-colaboradores");
    const data = await response.json();

    if (data.length === 0) {
      rankingList.innerHTML = "<p>Nenhum colaborador encontrado.</p>";
      return;
    }

    // Renderiza os 10 melhores colaboradores
    data.slice(0, 10).forEach((colab, index) => {
      const div = document.createElement("div");
      div.classList.add("colaborador");

      div.innerHTML = `
        <span class="posicao">#${index + 1}</span>
        <span class="nome">${colab.nome}</span>
        <span class="vendas">🛒 Vendas: ${colab.total_vendas}</span>
        <span class="compras">📦 Compras: ${colab.total_compras}</span>
      `;

      rankingList.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
    rankingList.innerHTML = "<p>Erro ao carregar dados.</p>";
  }
});
