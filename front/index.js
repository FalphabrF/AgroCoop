const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletAddressP = document.getElementById("walletAddress");

connectWalletBtn.addEventListener("click", async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      walletAddressP.textContent = `Carteira conectada: ${address}`;
    } catch (error) {
      walletAddressP.textContent = `Erro ao conectar: ${error.message}`;
    }
  } else {
    alert("MetaMask não encontrada! Instale a extensão e tente novamente.");
  }
});
