document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("servicos-tbody");

    // Function to fetch services from the database
    const fetchServicos = async () => {
        // Placeholder for fetching data from an API
        // Replace the URL with your actual API endpoint
        const response = await fetch('https://your-api-endpoint.com/servicos');
        const servicos = await response.json();

        servicos.forEach(servico => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${servico.codigo}</td>
                <td>${servico.nome}</td>
                <td>${servico.descricao}</td>
                <td>${servico.preco}</td>
                <td><button class="btn-acao">Contratar</button></td>
            `;
            tbody.appendChild(row);
        });
    };

    // Call the fetch function
    fetchServicos();

    // Event delegation for action buttons
    tbody.addEventListener("click", (event) => {
        if (event.target.classList.contains("btn-acao")) {
            const row = event.target.closest("tr");
            const nomeServico = row.cells[1].innerText;
            alert(`Você contratou: ${nomeServico}`);
        }
    });
});