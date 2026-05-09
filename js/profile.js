// ============================================================
// PROFILE.JS — Phase 3: Profile Rendering & Editing
// ============================================================

// ── Mini-Profile Sidebar ──────────────────────────────────────
function populateMiniProfile() {
    const avatar = document.getElementById('mini-avatar');
    if (avatar) {
        if (currentUser.avatar) {
            avatar.innerHTML = `<img src="${currentUser.avatar}" style="width:100%;height:100%;border-radius:inherit;object-fit:cover;">`;
            avatar.style.background = 'white';
        } else {
            avatar.textContent = currentUser.avatarLetter;
            avatar.style.background = 'var(--text-dark)';
        }
    }

    const name = document.getElementById('mini-name');
    if (name) name.innerHTML = `${currentUser.name} ${currentUser.isVerified
        ? `<svg class="verified-badge" width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
        : ''}`;

    const sub = document.getElementById('mini-sub');
    if (sub) sub.textContent = currentUser.accountType === 'org' ? 'Recruiting' : currentUser.role;

    const game = document.getElementById('mini-game');
    if (game) game.textContent = currentUser.game;

    const searchAvatarP = document.getElementById('search-avatar-p');
    if (searchAvatarP) {
        if (currentUser.avatar) {
            searchAvatarP.innerHTML = `<img src="${currentUser.avatar}" style="width:100%;height:100%;border-radius:inherit;object-fit:cover;">`;
        } else {
            searchAvatarP.textContent = currentUser.avatarLetter;
        }
    }
}

// ── Main Profile View ─────────────────────────────────────────
function populateProfile() {
    // Hero section
    const heroAvatar = document.getElementById('dyn-prof-avatar');
    if (heroAvatar) {
        if (currentUser.avatar) {
            heroAvatar.innerHTML = `<img src="${currentUser.avatar}" style="width:100%;height:100%;border-radius:inherit;object-fit:cover;">`;
            heroAvatar.style.background = 'white';
        } else {
            heroAvatar.textContent = currentUser.avatarLetter;
            heroAvatar.style.background = 'var(--text-dark)';
        }
    }

    const heroName = document.getElementById('dyn-prof-name');
    if (heroName) heroName.innerHTML = `${currentUser.name} ${currentUser.isVerified
        ? `<svg class="verified-badge profile-badge" width="24" height="24" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
        : ''}`;

    // Banner color — scope to own profile only, not read-only views
    const banner = document.querySelector('#view-profile .profile-hero-banner');
    if (banner) banner.style.background = currentUser.bannerColor || '#005f86';

    const premBtn = document.getElementById('upgrade-btn');
    if (premBtn) premBtn.style.display = currentUser.isVerified ? 'none' : 'inline-flex';

    const profTag = document.getElementById('dyn-prof-tag');
    if (profTag) profTag.textContent = currentUser.isVerified ? 'PRO' : 'NEW';

    const profSub = document.getElementById('dyn-prof-sub');
    if (profSub) {
        if (currentUser.accountType === 'org') profSub.textContent = 'Recruiting Multiple Roles';
        else if (currentUser.accountType === 'coach') profSub.textContent = `Strategic Head Coach | Looking for T1 Team`;
        else profSub.textContent = `${currentUser.role} | ${currentUser.game} Player`;
    }

    // About / Bio
    const aboutEl = document.getElementById('dyn-prof-about');
    if (aboutEl) aboutEl.textContent = currentUser.bio ||
        `Hi, I am ${currentUser.name}. I am a dedicated ${currentUser.role} specializing in ${currentUser.game}.`;

    // Location & connections
    const locationEl = document.getElementById('dyn-prof-location');
    if (locationEl) locationEl.textContent = `${currentUser.location || 'Global'} • ${currentUser.connections || 0} connections`;

    // Rank badge in hero
    const rankEl = document.getElementById('dyn-prof-rank');
    if (rankEl && currentUser.rank) rankEl.textContent = `🏆 ${currentUser.rank}`;

    // Achievements
    renderAchievements('own-achievements', currentUser.achievements || []);

    // Show/hide sections by account type
    const sections = {
        lftBtn: document.getElementById('lft-btn'),
        endorsements: document.getElementById('endorsements-section'),
        orgPipeline: document.getElementById('org-pipeline-section'),
        orgReqs: document.getElementById('org-requirements-section'),
        riotBtn: document.getElementById('link-riot-btn'),
        apiBadge: document.getElementById('dyn-prof-api'),
        coachExp: document.getElementById('coach-experience-section'),
        coachServ: document.getElementById('coach-services-section'),
        coachEndorse: document.getElementById('coach-endorsements-section'),
        achievements: document.getElementById('achievements-section'),
        aboutTitle: document.getElementById('about-title'),
    };

    // Hide all conditional sections first
    Object.values(sections).forEach(el => { if (el) el.style.display = 'none'; });
    if (sections.achievements) sections.achievements.style.display = 'block';
    if (sections.aboutTitle) sections.aboutTitle.textContent = 'About';

    const lftStyle = (on) => {
        if (!sections.lftBtn) return;
        sections.lftBtn.style.display = 'block';
        sections.lftBtn.textContent = on ? 'Open to work: ON' : 'Open to work: OFF';
        sections.lftBtn.style.background = on ? '#10b981' : 'var(--accent)';
        sections.lftBtn.style.boxShadow = on
            ? '0 4px 6px -1px rgba(16,185,129,0.3)'
            : '0 4px 6px -1px rgba(0,229,255,0.3)';
    };

    if (currentUser.accountType === 'org') {
        if (sections.orgPipeline) sections.orgPipeline.style.display = 'block';
        if (sections.orgReqs) {
            sections.orgReqs.style.display = 'block';
            renderOwnRequirements();
        }
    } else if (currentUser.accountType === 'coach') {
        lftStyle(currentUser.lft);
        if (sections.coachExp) sections.coachExp.style.display = 'block';
        if (sections.coachServ) sections.coachServ.style.display = 'block';
        if (sections.coachEndorse) sections.coachEndorse.style.display = 'block';
        if (sections.achievements) sections.achievements.style.display = 'none';
        if (sections.aboutTitle) sections.aboutTitle.textContent = 'Coaching Philosophy';
        if (sections.apiBadge) {
            sections.apiBadge.style.display = 'inline-block';
            sections.apiBadge.innerHTML = '🛡️ Verified Coach: T2 Experience';
            sections.apiBadge.style.background = 'linear-gradient(90deg, #10b981, #064e3b)';
        }
    } else {
        // Player
        lftStyle(currentUser.lft);
        if (sections.endorsements) sections.endorsements.style.display = 'block';
        if (sections.riotBtn) sections.riotBtn.style.display = 'inline-block';
        if (sections.apiBadge) {
            sections.apiBadge.style.display = 'inline-block';
            sections.apiBadge.innerHTML = '🛡️ Riot Verified: Immortal 3';
            sections.apiBadge.style.background = 'linear-gradient(90deg, #ff4655, #0f1923)';
        }
    }

    updateProfileStrength();
}

// ── Profile Strength ──────────────────────────────────────────
function updateProfileStrength() {
    const fields = [
        currentUser.name && currentUser.name.trim() !== '',
        currentUser.bio && currentUser.bio.trim() !== '',
        currentUser.rank && currentUser.rank.trim() !== '',
        currentUser.location && currentUser.location.trim() !== '',
        currentUser.achievements && currentUser.achievements.length > 0
    ];
    const score = fields.filter(Boolean).length;
    const pct = (score / fields.length) * 100;

    const bar = document.getElementById('prof-strength-bar');
    const label = document.getElementById('prof-strength-label');
    const container = document.getElementById('prof-strength-container');

    if (!bar || !label) return;
    if (container) container.style.display = 'block';

    bar.style.width = pct + '%';

    let level, color;
    if (score <= 1)      { level = 'Beginner'; color = '#ef4444'; }
    else if (score === 2) { level = 'Basic';    color = '#f97316'; }
    else if (score === 3) { level = 'Good';     color = '#eab308'; }
    else if (score === 4) { level = 'Strong';   color = '#10b981'; }
    else                  { level = 'All-Star ⭐'; color = 'var(--accent)'; }

    bar.style.background = color;
    label.innerHTML = `Profile Strength: <strong style="color:${color}">${level} (${score}/5)</strong>`;
}

// ── Edit Profile Modal ────────────────────────────────────────
function openEditModal() {
    // Pre-fill form fields
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };

    set('edit-name', currentUser.name);
    set('edit-bio', currentUser.bio);
    set('edit-game', currentUser.game);
    set('edit-role', currentUser.role);
    set('edit-rank', currentUser.rank);
    set('edit-location', currentUser.location);

    // Populate role options for current game
    _populateEditRoles(currentUser.game);

    // Mark active banner color swatch
    document.querySelectorAll('.color-swatch').forEach(sw => {
        sw.classList.toggle('swatch-active', sw.dataset.color === currentUser.bannerColor);
    });

    // Update bio counter
    _updateBioCounter();

    // Show modal
    const modal = document.getElementById('edit-profile-modal');
    if (modal) modal.style.display = 'flex';
}

function closeEditModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) modal.style.display = 'none';
}

function saveProfile() {
    const get = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

    const newName = get('edit-name') || currentUser.name;
    currentUser.name = newName;
    currentUser.avatarLetter = newName.charAt(0).toUpperCase();
    currentUser.bio = get('edit-bio');
    currentUser.game = get('edit-game') || currentUser.game;
    currentUser.role = get('edit-role') || currentUser.role;
    currentUser.rank = get('edit-rank');
    currentUser.location = get('edit-location');

    // Read selected banner color
    const activeSwatch = document.querySelector('.color-swatch.swatch-active');
    if (activeSwatch) currentUser.bannerColor = activeSwatch.dataset.color;

    closeEditModal();
    populateProfile();
    populateMiniProfile();
}

function selectBannerColor(el) {
    document.querySelectorAll('.color-swatch').forEach(sw => sw.classList.remove('swatch-active'));
    el.classList.add('swatch-active');
}

function _populateEditRoles(game) {
    const roleSelect = document.getElementById('edit-role');
    if (!roleSelect) return;
    roleSelect.innerHTML = '';
    const roles = roleOptions[game] || [];
    roles.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        if (r === currentUser.role) opt.selected = true;
        roleSelect.appendChild(opt);
    });
}

function onEditGameChange() {
    const gameEl = document.getElementById('edit-game');
    if (gameEl) _populateEditRoles(gameEl.value);
}

function _updateBioCounter() {
    const bio = document.getElementById('edit-bio');
    const counter = document.getElementById('bio-char-count');
    if (bio && counter) counter.textContent = `${bio.value.length} / 280`;
}

// ── LFT Toggle ───────────────────────────────────────────────
function toggleLFT() {
    currentUser.lft = !currentUser.lft;
    const btn = document.getElementById('lft-btn');
    if (btn) {
        btn.textContent = currentUser.lft ? 'Open to work: ON' : 'Open to work: OFF';
        btn.style.background = currentUser.lft ? '#10b981' : 'var(--accent)';
        btn.style.boxShadow = currentUser.lft
            ? '0 4px 6px -1px rgba(16,185,129,0.3)'
            : '0 4px 6px -1px rgba(0,229,255,0.3)';
    }
}

// ── Org Requirements ─────────────────────────────────────────
function renderOwnRequirements() {
    const list = document.getElementById('org-req-list');
    if (!list) return;
    list.innerHTML = '';
    if (!currentUser.requirements || currentUser.requirements.length === 0) {
        list.innerHTML = '<li style="list-style:none;color:var(--text-muted);">No requirements added yet.</li>';
        return;
    }
    currentUser.requirements.forEach((req, index) => {
        const li = document.createElement('li');
        li.style.marginBottom = '8px';
        li.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span>${req}</span>
                <button onclick="removeRequirement(${index})" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:12px;font-weight:600;">Remove</button>
            </div>`;
        list.appendChild(li);
    });
}

function addRequirement() {
    const input = document.getElementById('new-req-input');
    const val = input?.value.trim();
    if (!val) return;
    if (!currentUser.requirements) currentUser.requirements = [];
    currentUser.requirements.push(val);
    input.value = '';
    renderOwnRequirements();
}

function removeRequirement(index) {
    if (!currentUser.requirements) return;
    currentUser.requirements.splice(index, 1);
    renderOwnRequirements();
}

// ── Achievement Upload ────────────────────────────────────────
function handleAchievementUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const urlInput = document.getElementById('tracker-url');
    const trackerLink = urlInput ? urlInput.value.trim() : '';

    const reader = new FileReader();
    reader.onload = function(e) {
        if (!currentUser.achievements) currentUser.achievements = [];
        currentUser.achievements.unshift({ image: e.target.result, link: trackerLink });
        if (urlInput) urlInput.value = '';
        renderAchievements('own-achievements', currentUser.achievements);
        updateProfileStrength();
    };
    reader.readAsDataURL(file);
}

function renderAchievements(containerId, achievementsArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!achievementsArray || achievementsArray.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:14px;text-align:center;padding:20px;width:100%;">No uploaded achievements yet.</p>';
        return;
    }

    achievementsArray.forEach(ach => {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        let footerHtml = '';
        if (ach.link) {
            const hrefUrl = ach.link.startsWith('http') ? ach.link : 'https://' + ach.link;
            footerHtml = `
            <div class="achievement-footer">
                <a href="${hrefUrl}" target="_blank" class="verify-link-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Verify Proof Link
                </a>
            </div>`;
        }
        card.innerHTML = `<img src="${ach.image}" class="achievement-img" onclick="window.open('${ach.image}','_blank')" alt="Achievement">${footerHtml}`;
        container.appendChild(card);
    });
}
