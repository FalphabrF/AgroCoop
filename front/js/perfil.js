document.addEventListener("DOMContentLoaded", async () => {
  try {
    const cooperadoId = localStorage.getItem("userId"); // ID do cooperado logado

    const res = await fetch(`/api/perfil/${cooperadoId}`);
    const data = await res.json();

    // Dados básicos
    document.getElementById("nome-cooperado").textContent = data.nome || "Nenhum dado";
    document.getElementById("id-cooperado").textContent = data.id || "N/A";
    document.getElementById("data-entrada").textContent = data.data_entrada || "N/A";
    document.getElementById("status").textContent = data.status || "Inativo";

    if (data.foto) document.getElementById("foto-cooperado").src = data.foto;

    // Produtos
    const listaProdutos = document.getElementById("lista-produtos");
    listaProdutos.innerHTML = "";
    if (data.produtos && data.produtos.length > 0) {
      data.produtos.forEach(prod => {
        const li = document.createElement("li");
        li.textContent = prod;
        listaProdutos.appendChild(li);
      });
    } else {
      listaProdutos.innerHTML = "<li>Nenhum dado</li>";
    }

    // Serviços
    const listaServicos = document.getElementById("lista-servicos");
    listaServicos.innerHTML = "";
    if (data.servicos && data.servicos.length > 0) {
      data.servicos.forEach(serv => {
        const li = document.createElement("li");
        li.textContent = serv;
        listaServicos.appendChild(li);
      });
    } else {
      listaServicos.innerHTML = "<li>Nenhum dado</li>";
    }

  } catch (err) {
    console.error("Erro ao carregar perfil:", err);
  }
});
