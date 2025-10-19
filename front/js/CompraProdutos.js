document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("produtos-tbody");

    // Function to fetch products from the database
    const fetchProdutos = async () => {
        // Placeholder for fetching data from an API
        // Replace the URL with your actual API endpoint
        const response = await fetch('https://your-api-endpoint.com/produtos');
        const produtos = await response.json();

        produtos.forEach(produto => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${produto.codigo}</td>
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>${produto.preco}</td>
                <td><button class="btn-acao">Comprar</button></td>
            `;
            tbody.appendChild(row);
        });
    };

    // Call the fetch function
    fetchProdutos();

    // Event delegation for action buttons
    tbody.addEventListener("click", (event) => {
        if (event.target.classList.contains("btn-acao")) {
            const row = event.target.closest("tr");
            const nomeProduto = row.cells[1].innerText;
            alert(`Você comprou: ${nomeProduto}`);
        }
    });
});