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
    document.querySelectorAll('.menu-item > a.menu-trigger')
        .forEach(a => a.addEventListener('click', handleTriggerClick));

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu')) closeAllSubmenus();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllSubmenus();
    });
});
