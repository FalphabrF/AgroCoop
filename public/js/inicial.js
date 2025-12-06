// Lógica do Menu (Mantida)
function closeAllSubmenus() {
    document.querySelectorAll('.submenu.active')
        .forEach(ul => ul.classList.remove('active'));
}

function handleTriggerClick(e) {
    e.preventDefault(); 
    const trigger = e.currentTarget;
    const submenu = trigger.nextElementSibling;
    if (!submenu) return;

    const willOpen = !submenu.classList.contains('active');
    closeAllSubmenus();
    if (willOpen) submenu.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup dos Menus
    document.querySelectorAll('.menu-item > a.menu-trigger')
        .forEach(a => a.addEventListener('click', handleTriggerClick));

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu')) closeAllSubmenus();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllSubmenus();
    });

    // 2. [NOVO] Lógica de Sessão Persistente
    checkLoginState();
});

function checkLoginState() {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    // Se tiver token válido, altera a interface para "Modo Logado"
    if (token && userName) {
        console.log("Usuário logado na Home:", userName);

        // A. Altera a Navbar Superior
        const navUl = document.querySelector(".navbar nav ul");
        if (navUl) {
            // Substitui "Cadastro/Entrar" por "Painel/Perfil"
            navUl.innerHTML = `
                <li><a href="/perfil.html">Olá, ${userName.split(' ')[0]}</a></li>
            `;
        }

        // B. Altera o Botão Principal (Hero)
        const heroBtn = document.querySelector(".hero .btn");
        if (heroBtn) {
            heroBtn.innerText = "Acessar Meu Painel";
            heroBtn.href = "/dashboard.html";
            heroBtn.style.backgroundColor = "#2e7d32"; // Reforço visual
        }
    }
}