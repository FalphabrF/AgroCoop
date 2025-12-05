document.addEventListener("DOMContentLoaded", () => {
    // Tenta pegar pelo ID específico primeiro, depois fallback para tag genérica
    const form = document.getElementById("formVeiculo") || document.querySelector("form");

    // Validação de Sessão (Crítica para o Backend aceitar a requisição)
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado para cadastrar veículos.");
        window.location.href = "/login.html";
        return;
    }

    // Validação de segurança do elemento
    if (!form) {
        console.warn("Script veiculo.js carregado, mas nenhum <form> foi encontrado.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = form.querySelector("button[type='submit']");
        const textoOriginal = btn ? btn.innerText : "Enviar";
        
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Enviando dados...";
        }

        const formData = new FormData(form);

        try {
            const res = await fetch("/usuarios/veiculos", {
                method: "POST",
                headers: {
                    // [SEGURANÇA] Mantive o Token aqui. Sem isso, o backend recusa (401).
                    // Não definimos Content-Type pois o navegador define multipart/form-data automaticamente com o boundary.
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            // Tenta parsear JSON, mas se falhar trata como texto
            let data;
            const text = await res.text();
            try {
                data = JSON.parse(text);
            } catch {
                data = { detalhes: text };
            }

            if (!res.ok) {
                if (res.status === 401) {
                    alert("Sessão expirada. Faça login novamente.");
                    window.location.href = "/login.html";
                    return;
                }
                throw new Error(data.erro || data.detalhes || "Erro desconhecido ao cadastrar");
            }

            alert("✅ Veículo cadastrado com sucesso!");
            form.reset();
            
            // [ATUALIZAÇÃO] Redirecionamento para o Dashboard conforme solicitado
            window.location.href = "/dashboard.html";

        } catch (err) {
            console.error("Erro no envio:", err);
            alert("❌ Falha: " + err.message);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerText = textoOriginal;
            }
        }
    });
});