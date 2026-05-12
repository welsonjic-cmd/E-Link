// ============================================================
// NETWORK.JS — Phase 2: Connections & Search
// ============================================================

// ── Filter State ─────────────────────────────────────────────
let showLFTOnly = false;

// ── Render Players ────────────────────────────────────────────
function renderPlayers(playersToRender) {
    const container = document.getElementById('playersContainer');
    if (!container) return;
    container.innerHTML = '';

    if (playersToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <p>No players found matching your search.</p>
                <span>Try adjusting your filters.</span>
            </div>`;
        return;
    }

    // Verified players always float to the top
    const sorted = [...playersToRender].sort((a, b) =>
        (a.isVerified === b.isVerified) ? 0 : a.isVerified ? -1 : 1
    );

    sorted.forEach(player => {
        const verifiedIcon = player.isVerified
            ? `<svg class="verified-badge" width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
            : '';

        const lftBadge = player.lft
            ? `<span class="badge badge-lft">LFT</span>`
            : '';

        const connectBtn = buildConnectButton(player);

        const card = document.createElement('div');
        card.className = `horiz-card ${player.isVerified ? 'highlight-card' : ''}`;
        card.dataset.playerName = player.name;
        const avatarContent = player.avatar ? `<img src="${player.avatar}" style="width:100%;height:100%;border-radius:inherit;object-fit:cover;">` : player.avatarLetter;
        
        card.innerHTML = `
            <div class="hc-avatar">${avatarContent}</div>
            <div class="hc-content">
                <div class="hc-header">
                    <div>
                        <h3 class="hc-title">
                            ${player.name} ${verifiedIcon}
                            <span class="badge">${player.game}</span>
                            ${lftBadge}
                        </h3>
                        <p class="hc-subtitle">${player.role} • ${player.rank}</p>
                        <p class="hc-meta">${player.location}</p>
                    </div>
                </div>
                <div class="hc-stats">
                    <div class="hc-stat">K/D: <span class="hl">${player.kd}</span></div>
                    <div class="hc-stat">Win Rate: <span class="hl highlight">${player.winRate}</span></div>
                </div>
            </div>
            <div class="hc-actions">
                <button class="btn btn-outline btn-sm" style="width:100%;" onclick="viewPlayerProfile('${player.name}')">Profile</button>
                ${connectBtn}
            </div>
        `;
        container.appendChild(card);
    });

    renderSuggestions();
}

// ── Build Connect Button ──────────────────────────────────────
function buildConnectButton(player) {
    if (player.connectionState === 'connected') {
        return `<button class="btn btn-connected btn-sm" style="width:100%;" onclick="openChat('${player.name}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Message
        </button>`;
    } else if (player.connectionState === 'pending') {
        return `<button class="btn btn-pending btn-sm" style="width:100%;" onclick="cancelConnect('${player.name}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Pending
        </button>`;
    } else {
        return `<button class="btn btn-primary btn-sm" style="width:100%;" onclick="sendConnect('${player.name}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Connect
        </button>`;
    }
}

// ── Connection Actions ────────────────────────────────────────
function sendConnect(playerName) {
    const player = players.find(p => p.name === playerName);
    if (!player) return;

    player.connectionState = 'pending';

    // Push a notification
    pushNotification(
        player.avatar || player.avatarLetter,
        `<strong>Connection request sent</strong> to ${player.name}.`,
        'Just now'
    );

    // Re-render the specific card without full list re-render (smooth UX)
    _refreshPlayerCard(player);
    renderSuggestions();
}

function cancelConnect(playerName) {
    const player = players.find(p => p.name === playerName);
    if (!player) return;
    player.connectionState = 'none';
    _refreshPlayerCard(player);
    renderSuggestions();
}

// Surgically update only the changed card's action buttons
function _refreshPlayerCard(player) {
    const card = document.querySelector(`[data-player-name="${player.name}"]`);
    if (!card) return;

    const actionsDiv = card.querySelector('.hc-actions');
    if (!actionsDiv) return;

    // Replace only the connect button (second button)
    const oldBtn = actionsDiv.querySelectorAll('button')[1];
    if (oldBtn) {
        const temp = document.createElement('div');
        temp.innerHTML = buildConnectButton(player);
        const newBtn = temp.firstElementChild;
        newBtn.style.width = '100%';
        actionsDiv.replaceChild(newBtn, oldBtn);

        // Animate the state change
        newBtn.style.transform = 'scale(0.9)';
        setTimeout(() => { newBtn.style.transform = 'scale(1)'; }, 150);
    }
}

// ── Render Teams ──────────────────────────────────────────────
function renderTeams(teamsToRender) {
    const container = document.getElementById('teamsContainer');
    if (!container) return;
    container.innerHTML = '';

    if (teamsToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <p>No teams found matching your search.</p>
                <span>Try a different search term.</span>
            </div>`;
        return;
    }

    const sorted = [...teamsToRender].sort((a, b) =>
        (a.isVerified === b.isVerified) ? 0 : a.isVerified ? -1 : 1
    );

    sorted.forEach(team => {
        const verifiedIcon = team.isVerified
            ? `<svg class="verified-badge" width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
            : '';

        const applyBtn = team.hasApplied
            ? `<button class="btn btn-pending btn-sm" style="width:100%;" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Applied
               </button>`
            : `<button class="btn btn-primary btn-sm" style="width:100%;" onclick="applyToTeam('${team.name}')">Apply</button>`;

        const card = document.createElement('div');
        card.className = `horiz-card ${team.isVerified ? 'highlight-card' : ''}`;
        card.dataset.teamName = team.name;
        const avatarContent = team.avatar ? `<img src="${team.avatar}" style="width:100%;height:100%;border-radius:inherit;object-fit:cover;">` : team.avatarLetter;

        card.innerHTML = `
            <div class="hc-avatar square">${avatarContent}</div>
            <div class="hc-content">
                <div class="hc-header">
                    <div>
                        <h3 class="hc-title">
                            ${team.name} ${verifiedIcon}
                            <span class="badge">${team.game}</span>
                        </h3>
                        <p class="hc-subtitle">Looking for <span style="color:var(--accent-text);font-weight:600;">${team.lookingFor}</span></p>
                        <p class="hc-meta">${team.region} • Roster: ${team.rosterSize}</p>
                    </div>
                </div>
                <div class="hc-stats">
                    <div class="hc-stat">Team Win Rate: <span class="hl highlight">${team.winRate}</span></div>
                </div>
            </div>
            <div class="hc-actions">
                <button class="btn btn-outline btn-sm" style="width:100%;" onclick="viewTeamProfile('${team.name}')">Details</button>
                ${applyBtn}
            </div>
        `;
        container.appendChild(card);
    });
}

// ── Team Apply Action ─────────────────────────────────────────
function applyToTeam(teamName) {
    const team = teams.find(t => t.name === teamName);
    if (!team) return;

    team.hasApplied = true;

    pushNotification(
        team.avatar || team.avatarLetter,
        `<strong>Application submitted</strong> to ${team.name}. They'll review your profile soon!`,
        'Just now'
    );

    // Surgically update the apply button
    const card = document.querySelector(`[data-team-name="${teamName}"]`);
    if (card) {
        const actionsDiv = card.querySelector('.hc-actions');
        const applyBtn = actionsDiv && actionsDiv.querySelectorAll('button')[1];
        if (applyBtn) {
            applyBtn.outerHTML = `<button class="btn btn-pending btn-sm" style="width:100%;" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Applied
            </button>`;
        }
    }
}

// ── Navigate to Player Profile ────────────────────────────────
function viewPlayerProfile(playerName) {
    const player = players.find(p => p.name === playerName);
    if (!player) return;

    // Populate the read-only view
    const verifiedIcon = player.isVerified
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#00E5FF" stroke="white" stroke-width="2" style="margin-left:6px;"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`
        : '';

    const lftTag = player.lft
        ? `<span class="badge badge-lft" style="font-size:14px;">LFT</span>`
        : `<span class="badge" style="font-size:14px;">Player</span>`;

    const avatarEl = document.getElementById('view-prof-avatar');
    if (avatarEl) {
        if (player.avatar) {
            avatarEl.innerHTML = `<img src="${player.avatar}" style="width:100%;height:100%;border-radius:inherit;object-fit:cover;">`;
        } else {
            avatarEl.textContent = player.avatarLetter;
        }
    }
    document.getElementById('view-prof-name').innerHTML =
        `${player.name} <span class="badge" style="font-size:14px;">${player.game}</span>${verifiedIcon}`;
    document.getElementById('view-prof-sub').textContent = `${player.role} • ${player.rank}`;
    document.getElementById('view-prof-region').textContent = `${player.location}`;
    document.getElementById('view-prof-about').textContent = player.about || 'No bio yet.';

    // Update the Connect/Message button on the read-only profile
    const connectArea = document.getElementById('view-prof-connect-area');
    if (connectArea) {
        if (player.connectionState === 'connected') {
            connectArea.innerHTML = `
                <button class="btn btn-primary" onclick="openChat('${player.name}')">Message</button>
                <button class="btn btn-secondary" disabled style="opacity:0.7;">Connected ✓</button>`;
        } else if (player.connectionState === 'pending') {
            connectArea.innerHTML = `
                <button class="btn btn-pending" onclick="cancelConnect('${player.name}'); viewPlayerProfile('${player.name}')">Pending ✓ (Cancel)</button>`;
        } else {
            connectArea.innerHTML = `
                <button class="btn btn-primary" onclick="sendConnect('${player.name}'); viewPlayerProfile('${player.name}')">Connect</button>
                <button class="btn btn-secondary" onclick="openChat('${player.name}')">Message</button>`;
        }
    }

    // Update stats
    const statsArea = document.getElementById('view-prof-stats');
    if (statsArea) {
        statsArea.innerHTML = `
            <div class="stat-box-flat">
                <span class="stat-label">K/D Ratio</span>
                <span class="stat-value highlight">${player.kd}</span>
            </div>
            <div class="stat-box-flat">
                <span class="stat-label">Win Rate</span>
                <span class="stat-value highlight">${player.winRate}</span>
            </div>
            <div class="stat-box-flat">
                <span class="stat-label">Rank</span>
                <span class="stat-value">${player.rank}</span>
            </div>
            <div class="stat-box-flat">
                <span class="stat-label">Region</span>
                <span class="stat-value">${player.location}</span>
            </div>
        `;
    }

    switchTab('player');
}

// ── Navigate to Team Profile ──────────────────────────────────
function viewTeamProfile(teamName) {
    const team = teams.find(t => t.name === teamName);
    if (!team) return;

    const verifiedIcon = team.isVerified
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#00E5FF" stroke="white" stroke-width="2" style="margin-left:6px;"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`
        : '';

    const avatarEl = document.getElementById('view-team-avatar');
    if (avatarEl) {
        if (team.avatar) {
            avatarEl.innerHTML = `<img src="${team.avatar}" style="width:100%;height:100%;border-radius:inherit;object-fit:cover;">`;
        } else {
            avatarEl.textContent = team.avatarLetter;
        }
    }
    document.getElementById('view-team-name').innerHTML = `${team.name}${verifiedIcon}`;
    document.getElementById('view-team-tag').textContent = team.game;
    document.getElementById('view-team-sub').textContent = `Looking For: ${team.lookingFor}`;
    document.getElementById('view-team-region').textContent = `${team.region} • Roster: ${team.rosterSize}`;
    document.getElementById('view-team-about').textContent = team.about || 'No description yet.';
    document.getElementById('view-team-winrate').textContent = team.winRate;
    document.getElementById('view-team-roster').textContent = team.rosterSize;

    // Requirements list
    const reqList = document.getElementById('view-team-requirements');
    if (reqList) {
        reqList.innerHTML = team.requirements.map(r => `<li>${r}</li>`).join('');
    }

    // ── Primary row: Apply + Scrim ──
    const primaryRow = document.querySelector('.team-actions-primary');
    if (primaryRow) {
        if (team.hasApplied) {
            primaryRow.innerHTML = `
                <button class="btn btn-pending team-action-main" disabled>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Applied ✓
                </button>
                <button class="btn team-action-scrim" onclick="alert('Scrim proposed!')">⚔️ Challenge to Scrim</button>`;
        } else {
            primaryRow.innerHTML = `
                <button class="btn btn-primary team-action-main" onclick="applyToTeam('${team.name}'); viewTeamProfile('${team.name}')">Apply Now</button>
                <button class="btn team-action-scrim" onclick="alert('Scrim proposed!')">⚔️ Challenge to Scrim</button>`;
        }
    }

    // ── Secondary row: Follow ──
    const applyArea = document.getElementById('view-team-apply-area');
    if (applyArea) {
        applyArea.innerHTML = `<button class="btn btn-outline team-action-sm" onclick="alert('Followed Team!')">+ Follow</button>`;
    }

    // ── Subscribe area ──
    const subscribeArea = document.getElementById('view-team-subscribe-area');
    if (subscribeArea) {
        if (team.isSubscribed) {
            subscribeArea.innerHTML = `
                <button class="btn btn-connected btn-sm" style="display:inline-flex;align-items:center;gap:6px;cursor:default;" disabled>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                    Subscribed
                </button>
                <span style="display:inline-flex;align-items:center;gap:5px;font-size:13px;color:var(--accent);font-weight:700;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#00E5FF" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                    Verified Subscriber
                </span>`;
        } else {
            subscribeArea.innerHTML = `
                <button class="btn btn-primary btn-sm" style="display:inline-flex;align-items:center;gap:6px;"
                    onclick="subscribeToTeam('${team.name}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    Subscribe
                </button>`;
        }
    }

    switchTab('teamdetail');
}

// ── Subscribe to Organization ─────────────────────────────
function subscribeToTeam(teamName) {
    const team = teams.find(t => t.name === teamName);
    if (!team) return;

    team.isSubscribed = true;

    pushNotification(
        team.avatar || team.avatarLetter,
        `<strong>Subscribed to ${team.name}!</strong> You'll get notified of roster openings and updates.`,
        'Just now'
    );

    // Re-render the subscribe area in place (no full page reload)
    const subscribeArea = document.getElementById('view-team-subscribe-area');
    if (subscribeArea) {
        subscribeArea.innerHTML = `
            <button class="btn btn-connected btn-sm" style="display:inline-flex;align-items:center;gap:6px;cursor:default;" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                Subscribed
            </button>
            <span class="org-verified-subscriber" style="display:inline-flex;align-items:center;gap:5px;font-size:13px;color:var(--accent);font-weight:700;animation:verifiedPop 0.4s ease;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#00E5FF" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                Verified Subscriber
            </span>`;
    }
}


function openChat(targetName) {
    const chatWidget  = document.getElementById('chat-widget');
    const chatTitle   = document.getElementById('chat-name');    // was: 'chat-widget-title'
    const chatInput   = document.getElementById('chat-input');   // was: 'chat-message-input'
    const messagesDiv = document.getElementById('chat-body');    // was: 'chat-messages'

    if (!chatWidget) return;
    chatWidget.style.display = 'flex';

    if (chatTitle) chatTitle.textContent = targetName;

    const chatAvatar = document.getElementById('chat-avatar');
    if (chatAvatar) chatAvatar.textContent = targetName.charAt(0).toUpperCase();

    // Add opening line only if body has no real messages yet
    if (messagesDiv && messagesDiv.querySelectorAll('.chat-msg').length === 0) {
        const intro = document.createElement('div');
        intro.style.cssText = 'text-align:center;font-size:12px;color:var(--text-muted);padding:10px 0 6px;';
        intro.innerHTML = `You connected with <strong>${targetName}</strong>. Say hi! 👋`;
        messagesDiv.insertBefore(intro, messagesDiv.firstChild);
    }

    if (chatInput) chatInput.focus();
}

function closeChat() {
    const chatWidget = document.getElementById('chat-widget');
    if (chatWidget) chatWidget.style.display = 'none';
}

function sendChat() {
    const input    = document.getElementById('chat-input');
    const body     = document.getElementById('chat-body');
    if (!input || !body) return;

    const text = input.value.trim();
    if (!text) return;

    const msg = document.createElement('p');
    msg.className = 'chat-msg sent';
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
    input.value = '';

    // Simulate a reply after a short delay
    setTimeout(() => {
        const reply = document.createElement('p');
        reply.className = 'chat-msg received';
        reply.textContent = 'Thanks for reaching out! We\'ll review your profile and get back to you soon. 🎮';
        body.appendChild(reply);
        body.scrollTop = body.scrollHeight;
    }, 1200);
}


// ── People You May Know (Sidebar) ─────────────────────────────
function renderSuggestions() {
    const container = document.getElementById('suggested-connections');
    if (!container) return;

    // Show only players not yet connected / not pending, pick up to 3
    const eligible = players.filter(p => p.connectionState === 'none').slice(0, 3);

    if (eligible.length === 0) {
        container.innerHTML = `<p style="font-size:13px;color:var(--text-muted);text-align:center;padding:10px 0;">You've connected with everyone!</p>`;
        return;
    }

    container.innerHTML = eligible.map(p => {
        const verifiedIcon = p.isVerified
            ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
            : '';
        const avatarContent = p.avatar ? `<img src="${p.avatar}" style="width:100%;height:100%;border-radius:inherit;object-fit:cover;">` : p.avatarLetter;
        return `
            <div class="suggestion-item">
                <div class="suggestion-avatar">${avatarContent}</div>
                <div class="suggestion-info">
                    <span class="suggestion-name">${p.name} ${verifiedIcon}</span>
                    <span class="suggestion-meta">${p.role} • ${p.game}</span>
                </div>
                <button class="btn btn-outline btn-sm suggestion-connect-btn"
                    onclick="sendConnect('${p.name}')"
                    id="sug-btn-${p.name.replace(/\s+/g,'_')}">
                    + Connect
                </button>
            </div>`;
    }).join('');
}

// ── Filters ───────────────────────────────────────────────────
let playerSearchTimeout;
function filterPlayers() {
    clearTimeout(playerSearchTimeout);

    const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const filterValue = (document.getElementById('gameFilter')?.value || 'all').toLowerCase();
    const regionValue = (document.getElementById('regionFilter')?.value || 'all').toLowerCase();

    playerSearchTimeout = setTimeout(() => {
        let filtered = players;

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.role.toLowerCase().includes(searchTerm) ||
                p.rank.toLowerCase().includes(searchTerm)
            );
        }

        const gameMap = { valorant: 'Valorant', mlbb: 'MLBB', csgo: 'CS:GO', dota2: 'Dota 2', hok: 'Honor of Kings' };
        if (filterValue !== 'all') {
            filtered = filtered.filter(p => p.game === gameMap[filterValue]);
        }

        const regionMap = {
            na: ['NA West', 'NA East', 'NA Central', 'North America'],
            sea: ['SEA'],
            eu: ['EU West', 'EU'],
            cn: ['CN'],
            cis: ['CIS']
        };
        if (regionValue !== 'all') {
            const matchRegions = regionMap[regionValue] || [];
            filtered = filtered.filter(p => matchRegions.some(r => p.location.includes(r)));
        }

        if (showLFTOnly) {
            filtered = filtered.filter(p => p.lft);
        }

        renderPlayers(filtered);
    }, 300);
}

function toggleLFTFilter() {
    showLFTOnly = !showLFTOnly;
    const btn = document.getElementById('lft-toggle-btn');
    if (btn) {
        btn.classList.toggle('filter-pill-active', showLFTOnly);
        btn.textContent = showLFTOnly ? '✓ LFT Only' : 'LFT Only';
    }
    filterPlayers();
}

let teamSearchTimeout;
function filterTeams() {
    clearTimeout(teamSearchTimeout);
    const searchTerm = (document.getElementById('teamSearchInput')?.value || '').toLowerCase();

    teamSearchTimeout = setTimeout(() => {
        let filtered = teams;
        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(searchTerm) ||
                t.game.toLowerCase().includes(searchTerm) ||
                t.lookingFor.toLowerCase().includes(searchTerm) ||
                t.region.toLowerCase().includes(searchTerm)
            );
        }
        renderTeams(filtered);
    }, 300);
}
