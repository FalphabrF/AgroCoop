document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
   /* if (!userId) {
        window.location.href = "../public/login.html"; // redireciona se não estiver logado
        return;
    }
    */
    const buscarVendaInput = document.getElementById("buscar-venda");
    const btnAtualizar = document.getElementById("btn-atualizar");
    const vendasTbody = document.getElementById("vendas-tbody");
    const detalhesVendaSection = document.getElementById("detalhes-venda");
    const vendaItensDiv = document.getElementById("venda-itens");
    const btnVoltar = document.getElementById("btn-voltar");

    const fetchVendas = async () => {
        try {
            const res = await fetch(`/api/vendas/${userId}`);
            const vendasData = await res.json();
            renderVendas(vendasData);
        } catch (err) {
            console.error("Erro ao carregar vendas:", err);
        }
    };

    const renderVendas = (vendas) => {
        vendasTbody.innerHTML = "";
        vendas.forEach(venda => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${venda.id}</td>
                <td>${new Date(venda.data).toLocaleDateString('pt-BR')}</td>
                <td>${venda.itens.join(", ")}</td>
                <td>R$ ${venda.total.toFixed(2)}</td>
            `;
            tr.addEventListener("click", () => showDetalhesVenda(venda));
            vendasTbody.appendChild(tr);
        });
    };

    const showDetalhesVenda = (venda) => {
        detalhesVendaSection.hidden = false;
        vendaItensDiv.innerHTML = venda.itens.map(item => `<p>${item}</p>`).join("");
    };

    btnVoltar.addEventListener("click", () => {
        detalhesVendaSection.hidden = true;
    });

    btnAtualizar.addEventListener("click", fetchVendas);

    buscarVendaInput.addEventListener("input", () => {
        const filter = buscarVendaInput.value.toLowerCase();
        const rows = vendasTbody.querySelectorAll("tr");
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            const match = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(filter));
            row.style.display = match ? "" : "none";
        });
    });

    fetchVendas(); // Carrega as vendas ao iniciar
});