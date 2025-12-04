document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = form.querySelector("button[type='submit']");
        const originalText = btn.innerText;
        
        // Feedback visual imediato
        btn.disabled = true;
        btn.innerText = "Autenticando...";

        // [CORREÇÃO CRÍTICA] Garantia de pegar o .value
        const emailInput = document.getElementById("email");
        const senhaInput = document.getElementById("senha");

        const email = emailInput ? emailInput.value : "";
        const senha = senhaInput ? senhaInput.value : "";

        // Debug para garantir que o payload está saindo correto
        console.log("Enviando payload:", { email, senha: "***" });

        try {
            const res = await fetch("/usuarios/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Falha na autenticação");
            }

            // [SEGURANÇA] Sucesso no Login
            // Agora salvamos o TOKEN, que é a chave mestra para as rotas protegidas
            localStorage.setItem("token", data.token); 
            
            // Salvamos dados não sensíveis para exibição na UI
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("userName", data.user.nome);
            
            // Redireciona para o Painel Principal (Dashboard)
            window.location.href = "/dashboard.html"; 

        } catch (err) {
            console.error(err);
            alert("❌ Erro: " + err.message);
        } finally {
            // Restaura o botão se der erro
            if(btn) {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        }
    });
});