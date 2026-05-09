function login() {
    populateMiniProfile();
    switchTab('home');
}

function logout() {
    window.location.href = 'index.html';
}

function registerUser() {
    const accountTypeRadios = document.getElementsByName('accountType');
    let accountType = 'player';
    for (const radio of accountTypeRadios) {
        if (radio.checked) accountType = radio.value;
    }

    let profileName = "NewUser";
    let mainGame    = "Valorant";
    let mainRole    = "Flex";
    let mainBio     = "";
    let mainLocation = "Global";

    if (accountType === 'player') {
        const pName = document.getElementById('reg-gamertag')?.value;
        if (pName) profileName = pName;
        mainGame = document.getElementById('reg-game')?.value || 'Valorant';
        const roleSelect = document.getElementById('reg-role');
        if (roleSelect) mainRole = roleSelect.value;
        mainBio = `Hi, I'm ${profileName}. I'm a ${mainRole} player specializing in ${mainGame}.`;
        mainLocation = 'Global';
    } else {
        const oName = document.getElementById('reg-orgname')?.value;
        if (oName) profileName = oName;
        mainGame = "Multiple Games";
        mainRole = "Organization";
        mainBio = `${profileName} is a professional esports organization actively scouting talented players.`;
        mainLocation = document.getElementById('reg-region')?.value || 'Global';
    }

    // Build a complete currentUser object including all Phase 3 editable fields
    currentUser = {
        name: profileName,
        game: mainGame,
        role: mainRole,
        avatarLetter: profileName.charAt(0).toUpperCase(),
        email: document.getElementById('reg-email')?.value || 'user@elink.gg',
        accountType: accountType,
        lft: false,
        isVerified: false,
        postCount: 0,
        achievements: [],
        requirements: [],
        notifications: [],
        // Phase 3 editable fields
        bio: mainBio,
        rank: "",
        location: mainLocation,
        bannerColor: "#005f86",
        connections: 0
    };

    alert(`Registration successful, ${profileName}! Welcome to E-LINK.`);
    populateMiniProfile();
    switchTab('home');
}
