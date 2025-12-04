document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        const btn = form.querySelector("button[type='submit']");
        const originalText = btn.innerText;

        // UX: Feedback visual
        btn.disabled = true;
        btn.innerText = "Enviando...";

        // Captura os dados
        const formData = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            mensagem: document.getElementById("mensagem").value
        };

        try {
            const res = await fetch("/contato/enviar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" // Importante para o req.body ler JSON
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                // Sucesso: Avisa e redireciona
                alert("✅ Mensagem enviada com sucesso! Em breve responderemos.");
                form.reset();

                // [NOVO] Redirecionamento para a Tela Inicial
                // Como configuramos a pasta 'pages' na raiz, o caminho é direto:
                window.location.href = "/inicial.html";
            } else {
                throw new Error(data.error || "Erro ao enviar mensagem.");
            }

        } catch (error) {
            console.error(error);
            alert("❌ Erro: " + error.message);
        } finally {
            // Restaura o botão se der erro (se der sucesso, a página muda antes disso importar)
            if (btn) {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        }
    });
});