document.addEventListener("DOMContentLoaded", () => {
  // [DEBUG] Este log prova que você está usando a versão nova do script.
  console.log("Script de cadastro carregado! Versão atualizada: Fix 404");
  
  const form = document.getElementById("formCadastro");

  if (!form) {
    console.error("ERRO CRÍTICO: Formulário com id 'formCadastro' não encontrado no HTML.");
    // Remover este alert em produção, útil apenas para você debuggar agora
    alert("ERRO: O JavaScript não encontrou o formulário. Verifique se a tag <form> tem id='formCadastro'");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Enviando formulário...");

    const btn = form.querySelector("button[type='submit']");
    if (btn) btn.disabled = true;

    try {
      const formData = new FormData(form);

      // Usando caminho relativo para evitar erros de domínio
      const res = await fetch("/usuarios/cadastro", {
        method: "POST",
        body: formData
      });

      const text = await res.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch {
        data = { msg: text };
      }

      if (res.ok) {
        console.log("Sucesso! Preparando redirecionamento...");
        alert("✅ Cooperado cadastrado com sucesso! Clique OK para ir ao login.");
        
        // [CORREÇÃO FINAL - ERRO 404]
        // Se o seu erro dizia '/public/login.html', é porque o código antigo estava rodando.
        // Na nova estrutura do servidor, a pasta 'pages' é servida na raiz.
        // O endereço correto é '/login.html'.
        window.location.href = "/login.html"; 
        
      } else {
        console.error("Erro do servidor:", data);
        alert(data?.erro || data?.msg || "Erro ao cadastrar. Verifique o console (F12).");
      }

    } catch (err) {
      console.error("Falha na requisição:", err);
      alert("Erro de conexão com o servidor.");
    } finally {
      if (btn) btn.disabled = false;
    }
  });
});