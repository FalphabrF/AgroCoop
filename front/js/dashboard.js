// dashboard.js
/*
    if (!userId) {
      window.location.href = "../public/login.html"; // redireciona se não estiver logado
      return;
    }
*/
   document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userId = localStorage.getItem("userId");

    // Usuário
    const userRes = await fetch(`/api/user/${userId}`);
    const userData = await userRes.json();
    document.getElementById("welcome-msg").textContent = `Bem-vindo, ${userData.nome} 👋`;

    // Vendas
    const vendasRes = await fetch(`/api/vendas/${userId}`);
    const vendasData = await vendasRes.json();
    document.getElementById("total-vendas").textContent = vendasData.total;

    // Produtos
    const produtosRes = await fetch(`/api/produtos/${userId}`);
    const produtosData = await produtosRes.json();
    document.getElementById("total-produtos").textContent = produtosData.length;

    // Preencher tabela
    const tbody = document.querySelector("#produtosTable tbody");
    produtosData.forEach(prod => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.nome}</td>
        <td>${prod.categoria}</td>
        <td>R$ ${prod.preco.toFixed(2)}</td>
        <td>${prod.estoque}</td>
      `;
      tbody.appendChild(tr);
    });

    // Gráfico
    const ctx = document.getElementById("vendasChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: vendasData.meses,
        datasets: [{
          label: "Vendas",
          data: vendasData.valores,
          backgroundColor: "#388e3c"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Vendas Mensais",
            color: "#2e7d32",
            font: { size: 18 }
          }
        }
      }
    });

  } catch (err) {
    console.error("Erro ao carregar dashboard:", err);
  }
});
