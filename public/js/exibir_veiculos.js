document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("lista-veiculos");

    // [MODIFICAÇÃO] Tornamos a página PÚBLICA (Vitrine)
    // Removemos a verificação que expulsa o usuário se não tiver token.
    // O token é opcional aqui (apenas se quisermos personalizar algo no futuro).
    const token = localStorage.getItem("token");

    async function carregarVeiculos() {
        try {
            // Configuração dos Headers
            // Se tiver token, enviamos (bom para auditoria), mas não é obrigatório
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // [FIX] Fetch na rota pública
            const res = await fetch("/usuarios/veiculos", {
                method: "GET",
                headers: headers
            });

            // Se der 401 aqui, é erro de configuração no Backend (rota não está pública)
            if (res.status === 401) {
                console.warn("A rota /usuarios/veiculos ainda está protegida no backend.");
                // Não redirecionamos mais, apenas logamos ou mostramos erro
            }

            const veiculos = await res.json();

            // Validação de Resposta
            if (!Array.isArray(veiculos)) {
                container.innerHTML = "<p style='text-align:center; padding:20px'>Erro ao carregar lista de veículos.</p>";
                console.error("Resposta da API inválida:", veiculos);
                return;
            }

            if (veiculos.length === 0) {
                container.innerHTML = "<p style='text-align:center; padding:20px'>Nenhum veículo disponível no momento.</p>";
                return;
            }

            container.innerHTML = "";

            veiculos.forEach(v => {
                // Lógica de Imagem com Fallback
                const nomeArquivo = v.foto_principal; 
                const imagemSrc = nomeArquivo ? `/uploads/${nomeArquivo}` : "/img/sem-foto.jpg";

                // Formatação de Preço
                const preco = Number(v.valor).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });

                // Tratamento de segurança para campos vazios
                const modelo = v.modelo || "Modelo não informado";
                const marca = v.marca || "";

                // Link para contato (WhatsApp)
                // Se o usuário não estiver logado, o link continua funcionando pois é externo
                const linkZap = v.telefone ? `https://wa.me/55${v.telefone}` : "#";

                container.innerHTML += `
                <div class="card">
                    <div class="card-image-container">
                        <img src="${imagemSrc}" alt="${modelo}" onerror="this.onerror=null;this.src='/img/sem-foto.jpg';">
                    </div>
                    <div class="card-content">
                        <h3>${modelo} <small>(${marca})</small></h3>
                        
                        <div class="card-details">
                            <p><span>Placa:</span> ${v.placa ? '***' + v.placa.slice(-2) : '***'}</p> <!-- Ocultar placa parcial em vitrine pública é boa prática -->
                            <p><span>Ano:</span> ${v.ano || '---'}</p>
                            <p><span>KM:</span> ${v.quilometragem} km</p>
                            <p><span>Local:</span> ${v.localizacao || '---'}</p>
                        </div>
                        
                        <p class="price">${preco}</p>
                        
                        <a href="${linkZap}" target="_blank" class="btn-whatsapp">
                            Tenho Interesse
                        </a>
                    </div>
                </div>
                `;
            });

        } catch (err) {
            console.error("Erro fatal:", err);
            container.innerHTML = "<p style='text-align:center; color:red'>Falha de conexão com o servidor.</p>";
        }
    }

    carregarVeiculos();
});