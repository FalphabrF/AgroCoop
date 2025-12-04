const container = document.getElementById("lista-veiculos")

async function carregarVeiculos() {
  try {
    // [FIX] Caminho relativo para a API (mais seguro que http://localhost:3000)
    const res = await fetch("/usuarios/veiculos")
    const veiculos = await res.json()

    // Validação robusta de resposta
    if (!Array.isArray(veiculos)) {
      container.innerHTML = "<p>Erro ao carregar lista de veículos.</p>"
      console.error("Resposta da API não é um array:", veiculos)
      return
    }

    if (veiculos.length === 0) {
      container.innerHTML = "<p>Nenhum veículo cadastrado no momento.</p>"
      return
    }

    container.innerHTML = ""

    veiculos.forEach(v => {
      // [DIAGNÓSTICO EXPERT - CRUCIAL] 
      // Abra o console do navegador (F12) e verifique este objeto 'v'.
      // Se 'foto_principal' (ou o campo que você usa) estiver null/undefined,
      // o problema NÃO é aqui, é no seu Controller (backend) que não salvou o nome da imagem no banco.
      console.log("Veículo carregado:", v);

      // Lógica de recuperação da imagem:
      // 1. Tenta pegar de 'foto_principal'
      // 2. Se não tiver, tenta 'foto' (caso o nome da coluna tenha mudado)
      // 3. Se for um array 'fotos', pega a primeira
      const nomeArquivoImagem = v.foto_principal || v.foto || (v.fotos ? v.fotos[0] : null);

      // Monta o caminho absoluto. Se não tiver nome de arquivo, usa o placeholder.
      const imagem = nomeArquivoImagem 
        ? `/uploads/${nomeArquivoImagem}` 
        : "/img/sem-foto.jpg"

      // Formatação de moeda segura (R$)
      const preco = v.valor 
        ? Number(v.valor).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' }) 
        : 'R$ 0,00';

      // Tratamento de segurança para o HTML
      const modelo = v.modelo || "Modelo não informado";
      const marca = v.marca || "";

      container.innerHTML += `
      <div class="card">
        <div class="card-image-container">
            <!-- onerror: Se a imagem falhar (ex: 404), substitui pelo placeholder automaticamente -->
            <img src="${imagem}" alt="${modelo}" onerror="this.onerror=null;this.src='/img/sem-foto.jpg';">
        </div>
        <div class="card-content">
            <h3>${modelo} <small>(${marca})</small></h3>
            
            <div class="card-details">
                <p><span>Placa:</span> ${v.placa || '---'}</p>
                <p><span>Ano:</span> ${v.ano || '---'}</p>
                <p><span>KM:</span> ${v.quilometragem} km</p>
                <p><span>Local:</span> ${v.localizacao || '---'}</p>
            </div>
            
            <p class="price">${preco}</p>
            
            <a href="https://wa.me/55${v.telefone}" target="_blank" class="btn-whatsapp">
                Entrar em contato
            </a>
        </div>
      </div>
      `
    })

  } catch (err) {
    console.error("Erro fatal ao processar veículos:", err)
    container.innerHTML = "<p>Falha de conexão com o servidor.</p>"
  }
}

// Inicia o carregamento assim que o script roda
carregarVeiculos()