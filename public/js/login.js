document.addEventListener("DOMContentLoaded", () => {
    
    // [NOVO] AUTO-REDIRECT: Se já está logado, vai direto pro Dashboard
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
        console.log("Sessão ativa encontrada. Redirecionando...");
        window.location.href = "/dashboard.html";
        return;
    }

    const form = document.getElementById("login-form");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = form.querySelector("button[type='submit']");
        const originalText = btn.innerText;
        
        btn.disabled = true;
        btn.innerText = "Autenticando...";

        const emailInput = document.getElementById("email");
        const senhaInput = document.getElementById("senha");

        const email = emailInput ? emailInput.value : "";
        const senha = senhaInput ? senhaInput.value : "";

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

            // [SEGURANÇA] Salva Token e Dados
            localStorage.setItem("token", data.token); 
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("userName", data.user.nome);
            
            // Redireciona
            window.location.href = "/dashboard.html"; 

        } catch (err) {
            console.error(err);
            alert("❌ Erro: " + err.message);
        } finally {
            if(btn) {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        }
    });
});