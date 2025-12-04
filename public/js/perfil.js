document.addEventListener("DOMContentLoaded", async () => {
    // 1. Verificação de Segurança
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "/login.html";
        return;
    }

    // 2. Carregar Dados do Perfil
    try {
        const res = await fetch('/usuarios/meu-perfil', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // [CRÍTICO] A chave mestra
            }
        });

        if (res.status === 401) {
            localStorage.clear();
            window.location.href = "/login.html";
            return;
        }

        if (!res.ok) throw new Error("Erro ao carregar dados");

        const user = await res.json();

        document.getElementById("nome-cooperado").textContent = user.nome_completo;
        document.getElementById("id-cooperado").textContent = user.id;
        document.getElementById("data-entrada").textContent = user.data_entrada || "N/A";
        document.getElementById("status").textContent = user.ativo ? "Ativo" : "Inativo";

        if (user.foto) {
            document.getElementById("foto-cooperado").src = `http://localhost:3000/uploads/${user.foto}`;
        }

    } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        alert("Erro ao carregar perfil. Faça login novamente.");
        localStorage.removeItem("userId"); // limpa login inválido
        window.location.href = "/login.html";
    }
});

function preencherCampo(id, valor) {
    const el = document.getElementById(id);
    if (el) {
        el.value = valor || "";
    }
}