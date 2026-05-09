const players = [
    { name: "ShadowFiend", game: "Valorant", role: "Duelist", rank: "Radiant", location: "NA West", kd: "1.46", winRate: "59%", avatarLetter: "S", lft: true, isVerified: true, connectionState: "none", about: "Top Radiant Duelist in NA. Former T2 player looking for a structured team environment with dedicated scrims." },
    { name: "FakerWannabe", game: "MLBB", role: "Mid Laner", rank: "Mythical Glory", location: "SEA", kd: "3.20", winRate: "62%", avatarLetter: "F", lft: false, isVerified: false, connectionState: "none", about: "Dedicated MLBB mid laner. I main mages and assassins. 3+ years competitive experience in the Philippine regional circuit." },
    { name: "AwpGod", game: "CS:GO", role: "Sniper / IGL", rank: "Global Elite", location: "NA East", kd: "1.15", winRate: "54%", avatarLetter: "A", lft: true, isVerified: true, connectionState: "none", about: "Entry-level IGL with strong AWP mechanics. Available for T3 rosters and online leagues. Faceit Level 10." },
    { name: "MiracleFan", game: "Dota 2", role: "Hard Carry", rank: "Immortal", location: "EU West", kd: "4.50", winRate: "68%", avatarLetter: "M", lft: false, isVerified: false, connectionState: "none", about: "EU Immortal hard carry. Strong in the late game and farming patterns. Available for team practice sessions on weekends." },
    { name: "TenzFanboy", game: "Valorant", role: "Initiator", rank: "Immortal 3", location: "NA Central", kd: "1.08", winRate: "51%", avatarLetter: "T", lft: true, isVerified: false, connectionState: "none", about: "Initiator specialist — Skye, Breach, Fade main. Strong communication and ability timing. Peaked Top 500 Immortal." },
    { name: "JungleDiff", game: "Honor of Kings", role: "Jungler", rank: "Grandmaster", location: "CN", kd: "2.80", winRate: "56%", avatarLetter: "J", lft: true, isVerified: false, connectionState: "none", about: "Experienced HoK jungler from China's competitive scene. Strong objective control and cross-map pressure." }
];

const teams = [
    { name: "Evos Academy", game: "MLBB", rosterSize: "5/5", lookingFor: "Substitutes", region: "SEA", winRate: "71%", avatarLetter: "E", isVerified: true, hasApplied: false, requirements: ["Mythical Glory 100+ Stars", "Available 6pm-10pm EST", "Previous tournament experience"], about: "Evos Esports Academy is the development wing of Evos Esports, one of SEA's most successful esports organizations, dedicated to building the next generation of professional players." },
    { name: "Neon Strikers", game: "Valorant", rosterSize: "4/5", lookingFor: "Initiator", region: "EU", winRate: "58%", avatarLetter: "N", isVerified: false, hasApplied: false, requirements: ["Immortal 3+", "VOD submission required"], about: "A rising EU Valorant squad competing in open qualifiers. We are a serious, committed team looking to make our mark on the European competitive scene." },
    { name: "Frag Gods", game: "CS:GO", rosterSize: "3/5", lookingFor: "IGL, Entry", region: "CIS", winRate: "64%", avatarLetter: "F", isVerified: true, hasApplied: false, requirements: ["Faceit Level 10", "Fluent Russian/English"], about: "Frag Gods is a CIS-based CS:GO squad with a strong tournament history in the ESL Open circuit. We practice 5 days a week and maintain a professional environment." },
    { name: "Titans Esports", game: "Dota 2", rosterSize: "4/5", lookingFor: "Pos 4 Support", region: "NA East", winRate: "60%", avatarLetter: "T", isVerified: false, hasApplied: false, requirements: ["7k+ MMR", "Willing to relocate"], about: "Titans Esports is an NA Dota 2 organization with a salaried roster. We compete in regional leagues and are preparing for the next DPC season qualifiers." }
];

const posts = [
    { 
        id: 1,
        name: "Cloud9 Esports", 
        avatar: '<img src="assets/org_logo.png" style="width: 100%; height: 100%; object-fit: cover;">',
        avatarBg: '#0f172a',
        isOrg: true, 
        time: "2h • 🌎", 
        followers: "124,500 followers",
        content: "We are thrilled to announce a new partnership with E-Link to streamline our recruitment process for the 2024 season. Looking for scouts and data analysts! 🚀 #Esports #Recruitment #Cloud9", 
        isVerified: true,
        image: "assets/hero_bg.png",
        likes: 842,
        comments: 42,
        shares: 12,
        hasLiked: false
    },
    { 
        id: 2,
        name: "Sarah Jenkins", 
        avatar: '<img src="assets/sarah_avatar.png" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">',
        avatarBg: 'transparent',
        isOrg: false, 
        time: "5h • 🌎", 
        followers: "Recruiter at G2 Esports",
        badge: "• 2nd",
        content: "G2 is currently scouting for a Lead Coach for our Rocket League roster. Must have previous Tier-1 experience and a track record of player development. 🏎️🔥 DM for details!", 
        isVerified: true,
        likes: 315,
        comments: 18,
        shares: 5,
        hasLiked: false,
        isFollowing: false,
        jobCard: {
            title: "Head Coach - Rocket League",
            company: "G2 Esports • remote/Berlin",
            icon: "🚀"
        }
    }
];

let currentUser = {
    name: "Marcus Zenith",
    game: "MLBB",
    role: "Mid Laner",
    avatar: "assets/marcus_avatar.png",
    avatarLetter: "M",
    email: "gamer@elink.gg",
    accountType: "player",
    lft: false,
    isVerified: true,
    postCount: 0,
    achievements: [],
    requirements: [],
    notifications: [],
    // Editable profile fields
    bio: "Dedicated Mid Laner looking to break into competitive play. Wide champion pool, strong communication, available for scrims 5 days a week.",
    rank: "Mythical Glory",
    location: "Southeast Asia",
    bannerColor: "#005f86",
    connections: 1245
};

const roleOptions = {
    'Valorant': ['Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flex'],
    'MLBB': ['Mid Laner', 'Gold Laner', 'EXP Laner', 'Jungler', 'Roamer'],
    'CS:GO': ['Entry Fragger', 'Sniper / IGL', 'Support', 'Lurker', 'Coach / Analyst'],
    'Dota 2': ['Hard Carry', 'Mid', 'Offlaner', 'Pos 4 Support', 'Hard Support'],
    'Honor of Kings': ['Clash Lane', 'Farm Lane', 'Mid Lane', 'Jungler', 'Roaming']
};
