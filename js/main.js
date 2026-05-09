document.addEventListener('DOMContentLoaded', () => {
    populateMiniProfile();
    updateRoleOptions();

    renderPlayers(players);
    renderTeams(teams);
    renderPosts();
    renderSuggestions();

    // Sync the notification badge to match hardcoded items in #notif-list
    _syncNotifBadge();

    // Live Search & Filter Event Listeners — Players
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', () => filterPlayers());

    const gameFilter = document.getElementById('gameFilter');
    if (gameFilter) gameFilter.addEventListener('change', () => filterPlayers());

    const regionFilter = document.getElementById('regionFilter');
    if (regionFilter) regionFilter.addEventListener('change', () => filterPlayers());

    // Live Search — Teams
    const teamSearchInput = document.getElementById('teamSearchInput');
    if (teamSearchInput) teamSearchInput.addEventListener('input', () => filterTeams());

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        const notifDropdown = document.getElementById('notif-dropdown');
        const notifBtn = document.getElementById('nav-notif');
        if (notifDropdown && notifDropdown.style.display === 'flex') {
            if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
                notifDropdown.style.display = 'none';
            }
        }

        const viewDropdown = document.getElementById('view-dropdown');
        if (viewDropdown && viewDropdown.style.display === 'flex') {
            if (!viewDropdown.contains(e.target)) {
                viewDropdown.style.display = 'none';
            }
        }
    });

    // Handle incoming links from landing page (e.g., ?view=login)
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam && typeof switchTab === 'function') {
        switchTab(viewParam);
    }
});
