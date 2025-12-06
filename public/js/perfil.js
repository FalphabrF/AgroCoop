document.addEventListener("DOMContentLoaded", async () => {
    // 1. Verificação de Segurança
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "/login.html";
        return;
    }

    try {
        // 2. Carregar Dados Pessoais
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
        
        // Guardar usuário globalmente para usar no modal de edição
        window.currentUser = user;

        // Preencher Inputs (Visualização)
        preencherCampo("nome_completo", user.nome_completo || user.nome);
        preencherCampo("email", user.email);
        preencherCampo("cpf", user.cpf);
        preencherCampo("telefone", user.telefone);
        preencherCampo("endereco", user.endereco);
        preencherCampo("cidade", user.cidade);
        preencherCampo("estado", user.estado);
        preencherCampo("cep", user.cep);
        preencherCampo("numero_registro", user.numero_registro);
        
        if (user.createdAt) {
            const elData = document.getElementById("data-entrada");
            if (elData) elData.innerText = new Date(user.createdAt).toLocaleDateString('pt-BR');
        }
        
        if (user.foto) {
            const imgPreview = document.getElementById("foto-cooperado");
            if (imgPreview) imgPreview.src = `/uploads/${user.foto}`;
        }

        // 3. Inicializar Lógicas
        carregarMeusVeiculos(token);
        setupEditForm(token); // Edição de Veículo
        setupEditProfileForm(token); // [NOVO] Edição de Perfil

    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar seu perfil.");
    }
});

// Função auxiliar para preencher inputs ou textos
function preencherCampo(id, valor) {
    const el = document.getElementById(id);
    if (el) {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) el.value = valor || "";
        else el.innerText = valor || "---";
    }
}

// --- LÓGICA DE EDIÇÃO DO PERFIL ---

// Abrir Modal
window.abrirModalPerfil = () => {
    const user = window.currentUser;
    if(!user) return;

    // Preenche o formulário do modal com dados atuais
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if(el) el.value = val || "";
    };

    setVal("perf-nome", user.nome_completo || user.nome);
    setVal("perf-telefone", user.telefone);
    setVal("perf-cep", user.cep);
    setVal("perf-cidade", user.cidade);
    setVal("perf-estado", user.estado);
    setVal("perf-endereco", user.endereco);

    const modal = document.getElementById("modal-editar-perfil");
    if(modal) modal.classList.add("active");
};

window.fecharModalPerfil = () => {
    const modal = document.getElementById("modal-editar-perfil");
    if(modal) modal.classList.remove("active");
};

// Salvar Edição
function setupEditProfileForm(token) {
    const form = document.getElementById("form-editar-perfil");
    if(!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector("button[type='submit']");
        const originalText = btn.innerText;
        btn.innerText = "Salvando...";
        btn.disabled = true;

        const payload = {
            nome_completo: document.getElementById("perf-nome").value,
            telefone: document.getElementById("perf-telefone").value,
            cep: document.getElementById("perf-cep").value,
            cidade: document.getElementById("perf-cidade").value,
            estado: document.getElementById("perf-estado").value,
            endereco: document.getElementById("perf-endereco").value
        };

        try {
            const res = await fetch('/usuarios/meu-perfil', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if(res.ok) {
                alert("Dados atualizados com sucesso!");
                window.location.reload();
            } else {
                const err = await res.json();
                throw new Error(err.error || "Falha ao atualizar");
            }
        } catch (err) {
            alert("Erro: " + err.message);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

// Excluir Conta (Self-Destruct)
window.deletarConta = async () => {
    if(!confirm("⚠️ TEM CERTEZA?\n\nIsso apagará sua conta e todos os seus veículos permanentemente.\nEssa ação não pode ser desfeita.")) return;
    
    const token = localStorage.getItem("token");
    try {
        const res = await fetch('/usuarios/meu-perfil', { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(res.ok) {
            alert("Conta excluída com sucesso. Até logo!");
            localStorage.clear();
            window.location.href = "/inicial.html";
        } else {
            const data = await res.json();
            alert(data.error || "Erro ao excluir conta.");
        }
    } catch (e) {
        console.error(e);
        alert("Erro de conexão.");
    }
};

// --- LÓGICA DE VEÍCULOS ---

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
                    
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button onclick="abrirModalEdicao('${v.id}')" style="flex: 1; padding: 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Editar</button>
                        <button onclick="deletarVeiculo('${v.id}')" style="flex: 1; padding: 8px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Excluir</button>
                    </div>
                </div>
            </div>`;
        });

    } catch (error) {
        console.error("Erro ao carregar veículos:", error);
        container.innerHTML = "<p style='color: red;'>Erro ao carregar seus anúncios.</p>";
    }
}

// Funções Globais para Veículos (usadas no HTML string)
window.abrirModalEdicao = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`/usuarios/veiculos/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const v = await res.json();
        
        const setVal = (eid, val) => {
            const el = document.getElementById(eid);
            if(el) el.value = val || "";
        };

        setVal("edit-id", v.id);
        setVal("edit-modelo", v.modelo);
        setVal("edit-placa", v.placa);
        setVal("edit-valor", v.valor);
        setVal("edit-km", v.quilometragem);
        setVal("edit-local", v.localizacao);
        setVal("edit-telefone", v.telefone);

        const modal = document.getElementById("modal-editar-veiculo");
        if(modal) modal.classList.add("active");
    } catch (err) { alert("Erro ao buscar dados."); }
};

window.fecharModalEdicao = () => {
    const modal = document.getElementById("modal-editar-veiculo");
    if(modal) modal.classList.remove("active");
};

function setupEditForm(token) {
    const form = document.getElementById("form-editar-veiculo");
    if(!form) return;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit-id").value;
        const btn = form.querySelector("button[type='submit']");
        const payload = {
            modelo: document.getElementById("edit-modelo").value,
            placa: document.getElementById("edit-placa").value,
            valor: document.getElementById("edit-valor").value,
            quilometragem: document.getElementById("edit-km").value,
            localizacao: document.getElementById("edit-local").value,
            telefone: document.getElementById("edit-telefone").value
        };
        btn.innerText = "Salvando...";
        try {
            const res = await fetch(`/usuarios/veiculos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if(res.ok) { alert("Atualizado!"); window.location.reload(); }
            else throw new Error("Falha");
        } catch (err) { alert("Erro ao salvar."); btn.innerText = "Salvar Alterações"; }
    });
}

window.deletarVeiculo = async (id) => {
    if(!confirm("Excluir permanentemente?")) return;
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`/usuarios/veiculos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) { alert("Veículo excluído!"); window.location.reload(); }
        else alert("Erro ao excluir.");
    } catch (e) { alert("Erro de conexão."); }
};