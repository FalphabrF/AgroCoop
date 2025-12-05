document.addEventListener("DOMContentLoaded", async () => {
    // 1. Verificação de Segurança
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "/login.html";
        return;
    }

    // 2. Carregar Dados Pessoais
    try {
        const res = await fetch('/usuarios/meu-perfil', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
            localStorage.clear();
            window.location.href = "/login.html";
            return;
        }

        if (!res.ok) throw new Error("Erro ao carregar dados");

        const user = await res.json();

        // Preencher Campos (Agora funciona para Texto e Input)
        preencherCampo("nome_completo", user.nome_completo || user.nome);
        preencherCampo("email", user.email);
        preencherCampo("cpf", user.cpf);
        preencherCampo("telefone", user.telefone);
        preencherCampo("endereco", user.endereco);
        preencherCampo("cidade", user.cidade);
        preencherCampo("estado", user.estado);
        preencherCampo("cep", user.cep);
        preencherCampo("numero_registro", user.numero_registro);
        
        // Data de Entrada (Formatada)
        if (user.createdAt) {
            const dataEntrada = new Date(user.createdAt).toLocaleDateString('pt-BR');
            preencherCampo("data-entrada", dataEntrada);
        }
        
        // Foto de Perfil
        if (user.foto) {
            const imgPreview = document.getElementById("foto-cooperado");
            if (imgPreview) imgPreview.src = `/uploads/${user.foto}`;
        }

        // 3. Carregar Veículos do Usuário
        carregarMeusVeiculos(token);

    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar seu perfil.");
    }
});

// [FIX] Função Inteligente: Preenche tanto INPUTs quanto TEXTOs (span, h2, p)
function preencherCampo(id, valor) {
    const el = document.getElementById(id);
    if (el) {
        // Se for input/textarea/select, usa value. Se não, usa innerText.
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) {
            el.value = valor || "";
        } else {
            el.innerText = valor || "---";
        }
    }
}

// Função para buscar e renderizar os veículos
async function carregarMeusVeiculos(token) {
    const container = document.getElementById("meus-veiculos-list");
    if (!container) return; 

    try {
        const res = await fetch('/usuarios/meus-veiculos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const veiculos = await res.json();

        if (veiculos.length === 0) {
            container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #777;'>Você ainda não cadastrou nenhum veículo.</p>";
            return;
        }

        container.innerHTML = ""; 

        veiculos.forEach(v => {
            const nomeArquivo = v.foto_principal; 
            const imagemSrc = nomeArquivo ? `/uploads/${nomeArquivo}` : "/img/sem-foto.jpg";
            const preco = Number(v.valor).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });

            container.innerHTML += `
            <div class="card" style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="height: 180px; overflow: hidden; position: relative;">
                    <img src="${imagemSrc}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/img/sem-foto.jpg'">
                </div>
                <div style="padding: 15px;">
                    <h3 style="margin: 0 0 10px; color: #2e7d32; font-size: 1.1rem;">${v.modelo}</h3>
                    <p style="margin: 5px 0; color: #666; font-size: 0.9rem;">Placa: <strong>${v.placa}</strong></p>
                    <p style="font-weight: bold; font-size: 1.2rem; margin: 10px 0; color: #333;">${preco}</p>
                    
                    <button onclick="deletarVeiculo('${v.id}')" style="width: 100%; padding: 10px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px;">
                        Excluir Anúncio
                    </button>
                </div>
            </div>
            `;
        });

    } catch (error) {
        console.error("Erro ao carregar veículos:", error);
        container.innerHTML = "<p style='color: red;'>Erro ao carregar seus anúncios.</p>";
    }
}

window.deletarVeiculo = async (id) => {
    if(!confirm("Tem certeza que deseja excluir este anúncio permanentemente?")) return;

    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/usuarios/veiculos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(res.ok) {
            alert("Veículo excluído com sucesso!");
            window.location.reload();
        } else {
            alert("Erro ao excluir. Tente novamente.");
        }
    } catch (e) {
        console.error(e);
        alert("Erro de conexão.");
    }
};