document.addEventListener("DOMContentLoaded", async () => {
    const produtosGrid = document.getElementById("produtos-grid");
    const produtosTbody = document.getElementById("produtos-tbody");
    const carrinhoList = document.getElementById("carrinho-list");
    const carrinhoQuant = document.getElementById("carrinho-quant");
    const carrinhoTotal = document.getElementById("carrinho-total");
    const btnFinalizar = document.getElementById("btn-finalizar");
    const templateCard = document.getElementById("template-card").content;
    const templateCarrinhoItem = document.getElementById("template-carrinho-item").content;

    let carrinho = [];

    // Função para carregar produtos
    async function loadProdutos() {
        try {
            const response = await fetch("/api/produtos");
            const produtos = await response.json();

            if (produtos.length === 0) {
                produtosGrid.innerHTML = "<p>Nenhum produto encontrado.</p>";
                return;
            }

            produtos.forEach(produto => {
                const card = templateCard.cloneNode(true);
                card.querySelector("img").src = produto.imagem;
                card.querySelector(".nome").textContent = produto.nome;
                card.querySelector(".categoria").textContent = produto.categoria;
                card.querySelector(".preco").textContent = `R$ ${produto.preco.toFixed(2)}`;
                card.querySelector(".estoque").textContent = `Estoque: ${produto.estoque}`;
                card.querySelector(".btn-add").dataset.id = produto.id;
                card.querySelector(".btn-add").addEventListener("click", () => addToCarrinho(produto));
                produtosGrid.appendChild(card);
            });
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            produtosGrid.innerHTML = "<p>Erro ao carregar produtos.</p>";
        }
    }

    // Função para adicionar produto ao carrinho
    function addToCarrinho(produto) {
        const itemCarrinho = carrinho.find(item => item.id === produto.id);
        if (itemCarrinho) {
            itemCarrinho.quantidade++;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }
        updateCarrinho();
    }

    // Função para atualizar o carrinho
    function updateCarrinho() {
        carrinhoList.innerHTML = "";
        let total = 0;

        carrinho.forEach(item => {
            const carrinhoItem = templateCarrinhoItem.cloneNode(true);
            carrinhoItem.querySelector(".nome").textContent = item.nome;
            carrinhoItem.querySelector(".qtde").textContent = `${item.quantidade}x`;
            const subtotal = item.preco * item.quantidade;
            carrinhoItem.querySelector(".subtotal").textContent = `R$ ${subtotal.toFixed(2)}`;
            total += subtotal;

            carrinhoItem.querySelector(".menos").addEventListener("click", () => {
                item.quantidade--;
                if (item.quantidade === 0) {
                    carrinho = carrinho.filter(i => i.id !== item.id);
                }
                updateCarrinho();
            });

            carrinhoItem.querySelector(".mais").addEventListener("click", () => {
                item.quantidade++;
                updateCarrinho();
            });

            carrinhoItem.querySelector(".remover").addEventListener("click", () => {
                carrinho = carrinho.filter(i => i.id !== item.id);
                updateCarrinho();
            });

            carrinhoList.appendChild(carrinhoItem);
        });

        carrinhoQuant.textContent = carrinho.length;
        carrinhoTotal.textContent = `R$ ${total.toFixed(2)}`;
        btnFinalizar.disabled = carrinho.length === 0;
    }

    // Carregar produtos ao iniciar
    loadProdutos();
});