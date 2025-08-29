// ==========================
// Elementos do HTML
// ==========================
const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletAddressP = document.getElementById("walletAddress");
const cooperadoInfoDiv = document.getElementById("cooperadoInfo");
const actionsDiv = document.getElementById("actionsDiv");
const comprarBtn = document.getElementById("comprarBtn");
const votarBtn = document.getElementById("votarBtn");

// Dados do contrato
const contractAddress = "0xSeuContratoAqui"; // Substitua pelo seu
const AgroCoopAbi = [ /* ABI do seu contrato aqui */ ];

let provider;
let signer;
let contract;
let userAddress;

// ==========================
// Conectar MetaMask
// ==========================
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      userAddress = await signer.getAddress();
      walletAddressP.textContent = `Carteira conectada: ${userAddress}`;

      // Inicializa contrato
      contract = new ethers.Contract(contractAddress, AgroCoopAbi, signer);

      // Carrega informações do cooperado
      await loadCooperadoInfo();

    } catch (error) {
      walletAddressP.textContent = `Erro ao conectar: ${error.message}`;
    }
  } else {
    alert("MetaMask não encontrada! Instale a extensão e tente novamente.");
  }
}

// ==========================
// Carrega perfil do cooperado
// ==========================
async function loadCooperadoInfo() {
  try {
    const cooperado = await contract.verCooperado(userAddress);
    const nome = cooperado[0];
    const producao = cooperado[1];

    cooperadoInfoDiv.innerHTML = `
      <h2 class="text-xl font-bold mb-2">Perfil do Cooperado</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Produção:</strong> ${producao}</p>
    `;

    // Mostra as ações
    actionsDiv.classList.remove("hidden");

    // Adiciona eventos aos botões
    setupActionButtons();

  } catch (error) {
    cooperadoInfoDiv.innerHTML = `<p>Você ainda não está registrado.</p>
      <button id="registerBtn" class="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
        Registrar
      </button>`;
    
    document.getElementById("registerBtn").addEventListener("click", async () => {
      const nome = prompt("Digite seu nome:");
      const producao = parseInt(prompt("Digite sua produção inicial:"), 10);
      try {
        const tx = await contract.registrarCooperado(nome, producao);
        await tx.wait();
        alert("Cooperado registrado com sucesso!");
        await loadCooperadoInfo(); // Atualiza perfil
      } catch (err) {
        alert(`Erro ao registrar: ${err.message}`);
      }
    });
  }
}

// ==========================
// Configura eventos dos botões de ação
// ==========================
function setupActionButtons() {
  // Evita adicionar múltiplos eventos ao clicar várias vezes
  comprarBtn.onclick = async () => {
    const item = prompt("Qual insumo deseja comprar?");
    const quantidade = parseInt(prompt("Quantidade:"), 10);
    try {
      const tx = await contract.registrarCompra(item, quantidade);
      await tx.wait();
      alert(`Compra registrada: ${quantidade} de ${item}`);
    } catch (err) {
      alert(`Erro na compra: ${err.message}`);
    }
  };

  votarBtn.onclick = async () => {
    const decisao = prompt("Digite sua decisão (sim/não):");
    try {
      const tx = await contract.votar(decisao.toLowerCase() === "sim");
      await tx.wait();
      alert("Voto registrado com sucesso!");
    } catch (err) {
      alert(`Erro ao votar: ${err.message}`);
    }
  };
}

// ==========================
// Evento principal
// ==========================
connectWalletBtn.addEventListener("click", connectWallet);
