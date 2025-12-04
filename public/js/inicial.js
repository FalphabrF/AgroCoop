function closeAllSubmenus() {
    document.querySelectorAll('.submenu.active')
        .forEach(ul => ul.classList.remove('active'));
}

function handleTriggerClick(e) {
    e.preventDefault(); // evita navegação do href="#"
    const trigger = e.currentTarget;
    const submenu = trigger.nextElementSibling;
    if (!submenu) return;

    // fecha outros antes de abrir este
    const willOpen = !submenu.classList.contains('active');
    closeAllSubmenus();
    if (willOpen) submenu.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // adiciona o clique aos triggers
    document.querySelectorAll('.menu-item > a.menu-trigger')
        .forEach(a => a.addEventListener('click', handleTriggerClick));

    // fecha se clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu')) closeAllSubmenus();
    });

    // fecha com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllSubmenus();
    });
});
