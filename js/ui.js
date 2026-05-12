function switchTab(tabId) {
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.remove('active');
    });

    document.getElementById('view-' + tabId).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    if (tabId === 'login' || tabId === 'register') {
        document.getElementById('login-layout-wrapper').style.display = 'block';
        document.getElementById('main-layout').style.display = 'none';
        document.getElementById('main-nav').style.display = 'none';
        
        const chatFab = document.getElementById('chat-fab');
        if (chatFab) chatFab.style.display = 'none';
        const chatWidget = document.getElementById('chat-widget');
        if (chatWidget) chatWidget.style.display = 'none';
    } else {
        document.getElementById('login-layout-wrapper').style.display = 'none';
        document.getElementById('main-layout').style.display = 'grid';
        document.getElementById('main-nav').style.display = 'flex';
        
        const chatFab = document.getElementById('chat-fab');
        if (chatFab) chatFab.style.display = 'flex';

        let navId = tabId;
        if (tabId === 'player') navId = 'players';
        else if (tabId === 'teamdetail') navId = 'teams';

        const activeNav = document.getElementById('nav-' + navId);
        if (activeNav) activeNav.classList.add('active');
    }

    if (tabId === 'profile') {
        populateProfile();
    }
}

function toggleRegFields() {
    const accountTypeRadios = document.getElementsByName('accountType');
    let accountType = 'player';
    for (const radio of accountTypeRadios) {
        if (radio.checked) accountType = radio.value;
    }

    const playerFields = document.getElementById('player-reg-fields');
    const orgFields = document.getElementById('org-reg-fields');
    const coachFields = document.getElementById('coach-reg-fields');

    // Hide all first
    if (playerFields) playerFields.style.display = 'none';
    if (orgFields) orgFields.style.display = 'none';
    if (coachFields) coachFields.style.display = 'none';

    // Show relevant section
    if (accountType === 'org') {
        if (orgFields) orgFields.style.display = 'grid';
    } else if (accountType === 'coach') {
        if (coachFields) coachFields.style.display = 'grid';
    } else {
        if (playerFields) playerFields.style.display = 'grid';
    }
}

function updateRoleOptions() {
    const game = document.getElementById('reg-game');
    const roleSelect = document.getElementById('reg-role');
    if (!game || !roleSelect) return;

    roleSelect.innerHTML = '';
    const selectedGame = game.value;

    if (roleOptions[selectedGame]) {
        roleOptions[selectedGame].forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            roleSelect.appendChild(option);
        });
    }
}

function toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    const meDropdown = document.getElementById('me-dropdown');
    if (!dropdown) return;

    if (meDropdown) meDropdown.style.display = 'none';

    const isOpening = dropdown.style.display === 'none';
    dropdown.style.display = isOpening ? 'flex' : 'none';

    if (isOpening) {
        // Mark all visible items as read and hide badge
        document.querySelectorAll('#notif-list .notif-item').forEach(item => {
            item.classList.remove('unread');
        });
        const badge = document.querySelector('.notif-badge');
        if (badge) badge.style.display = 'none';
    }
}

function toggleMeDropdown() {
    const dropdown = document.getElementById('me-dropdown');
    const notifDropdown = document.getElementById('notif-dropdown');
    if (dropdown) {
        if (notifDropdown) notifDropdown.style.display = 'none';
        dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
    }
}

function setAccountType(type) {
    if (type === 'org') {
        currentUser.accountType = 'org';
        currentUser.name = "Test Organization";
        currentUser.role = "Organization";
        currentUser.avatar = "assets/org_logo.png";
        currentUser.avatarLetter = "T";
        currentUser.game = "Multiple Games";
        currentUser.isVerified = false;
        currentUser.bio = "We are a professional esports organization actively scouting talented players for our 2025 roster.";
        currentUser.rank = "N/A";
        currentUser.location = "North America";
        currentUser.bannerColor = "#1e3a5f";
    } else if (type === 'coach') {
        currentUser.accountType = 'coach';
        currentUser.name = "Coach Kkoma";
        currentUser.role = "Head Coach";
        currentUser.avatar = "assets/coach_avatar.png";
        currentUser.avatarLetter = "K";
        currentUser.game = "League of Legends";
        currentUser.lft = true;
        currentUser.isVerified = false;
        currentUser.postCount = 5;
        currentUser.bio = "Experienced head coach specializing in drafting, VOD review, and mental coaching. T2 certified with 4 years of competitive team management.";
        currentUser.rank = "T2 Certified";
        currentUser.location = "Korea";
        currentUser.bannerColor = "#0f172a";
    } else {
        currentUser.accountType = 'player';
        currentUser.name = "Marcus Zenith";
        currentUser.role = "Mid Laner";
        currentUser.avatar = "assets/marcus_avatar.png";
        currentUser.avatarLetter = "M";
        currentUser.game = "MLBB";
        currentUser.lft = false;
        currentUser.isVerified = false;
        currentUser.postCount = 0;
        currentUser.bio = "Dedicated Mid Laner looking to break into competitive play. Wide champion pool, strong communication, available for scrims 5 days a week.";
        currentUser.rank = "Mythical Glory";
        currentUser.location = "Southeast Asia";
        currentUser.bannerColor = "#005f86";
    }
    
    const dropdown = document.getElementById('me-dropdown');
    if (dropdown) dropdown.style.display = 'none';

    // Update active state in mini-profile and profile view
    populateMiniProfile();
    if (document.getElementById('view-profile').classList.contains('active')) {
        populateProfile();
    }
    console.log("DEV: Switched account state to:", currentUser);
}

function showSubModal() {
    const modal = document.getElementById('sub-modal-wrapper');
    if (modal) modal.style.display = 'flex';
}

function closeSubModal() {
    const modal = document.getElementById('sub-modal-wrapper');
    if (modal) modal.style.display = 'none';
}

function upgradeToPremium() {
    currentUser.isVerified = true;
    closeSubModal();
    populateMiniProfile();
    renderPlayers(players);
    renderTeams(teams);
    renderPosts();
    if (document.getElementById('view-profile').classList.contains('active')) {
        populateProfile();
    }
    alert("Payment successful! You are now Verified on E-Link Pro.");
}

// ── Notification System ────────────────────────────────────
function pushNotification(iconLetter, htmlContent, timeStr) {
    const list = document.getElementById('notif-list');
    if (!list) return;

    // Increment the badge
    const badge = document.querySelector('.notif-badge');
    if (badge) {
        const current = parseInt(badge.textContent) || 0;
        badge.textContent = current + 1;
        badge.style.display = 'flex';
    }

    // Build notification item with dismiss button
    const item = document.createElement('div');
    item.className = 'notif-item unread';
    
    const iconContent = (iconLetter && (iconLetter.includes('/') || iconLetter.includes('assets')))
        ? `<img src="${iconLetter}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
        : iconLetter;

    item.innerHTML = `
        <div style="width:32px;height:32px;border-radius:50%;background:var(--text-dark);color:var(--accent);
                    display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">
            ${iconContent}
        </div>
        <div style="flex:1;">
            <p style="margin:0 0 2px 0;font-size:13px;line-height:1.4;">${htmlContent}</p>
            <span style="font-size:11px;color:var(--text-muted);">${timeStr}</span>
        </div>
        <button onclick="dismissNotification(this)" title="Dismiss"
            style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;line-height:1;padding:0 4px;flex-shrink:0;">&times;</button>`;

    // Prepend so newest is always on top
    list.insertBefore(item, list.firstChild);

    // Store in currentUser
    currentUser.notifications.unshift({ icon: iconLetter, html: htmlContent, time: timeStr });
}

function dismissNotification(btn) {
    const item = btn.closest('.notif-item');
    if (!item) return;
    item.remove();
    _syncNotifBadge();
}

function clearAllNotifications() {
    const list = document.getElementById('notif-list');
    if (list) list.innerHTML = `<p style="text-align:center;font-size:13px;color:var(--text-muted);padding:20px 0;">No notifications yet.</p>`;
    currentUser.notifications = [];
    _syncNotifBadge(true);
}

function _syncNotifBadge(forceZero = false) {
    const badge = document.querySelector('.notif-badge');
    if (!badge) return;
    const list = document.getElementById('notif-list');
    const count = list ? list.querySelectorAll('.notif-item').length : 0;
    if (forceZero || count === 0) {
        badge.textContent = '0';
        badge.style.display = 'none';
    } else {
        badge.textContent = count;
        badge.style.display = 'flex';
    }
}
