document.addEventListener("DOMContentLoaded", () => {
    // Tenta pegar pelo ID específico primeiro, depois fallback para tag genérica
    const form = document.getElementById("formVeiculo") || document.querySelector("form");

    // Validação de segurança: se o script rodar numa página sem form, não quebra o site com erro no console
    if (!form) {
        console.warn("Script veiculo.js carregado, mas nenhum <form> foi encontrado.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Feedback visual e travamento do botão para evitar duplo envio (impaciência do usuário)
        const btn = form.querySelector("button[type='submit']");
        const textoOriginal = btn ? btn.innerText : "Enviar";
        
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Enviando dados...";
        }

        const formData = new FormData(form);

        try {
            // [FIX] Caminho relativo para a API.
            // Removemos 'http://localhost:3000' para evitar problemas de CORS/Porta.
            const res = await fetch("/usuarios/veiculos", {
                method: "POST",
                body: formData
            });

            // Tenta parsear JSON, mas se falhar (ex: erro 500 html do servidor), trata como texto para debug
            let data;
            const text = await res.text();
            try {
                data = JSON.parse(text);
            } catch {
                data = { detalhes: text };
            }

            if (!res.ok) {
                // Lança erro com a mensagem que veio do servidor
                throw new Error(data.erro || data.detalhes || "Erro desconhecido ao cadastrar");
            }

            alert("✅ Veículo cadastrado com sucesso!");
            form.reset();
            
            // [FIX] Redirecionamento correto.
            // Certifique-se que o arquivo existe em 'public/pages/exibir-veiculos.html'
            window.location.href = "/dashboard.html";

        } catch (err) {
            console.error("Erro no envio:", err);
            alert("❌ Falha: " + err.message);
        } finally {
            // Restaura o botão independente de sucesso ou erro (bloco finally)
            if (btn) {
                btn.disabled = false;
                btn.innerText = textoOriginal;
            }
        }
    });
});