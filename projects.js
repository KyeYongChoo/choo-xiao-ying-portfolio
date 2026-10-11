/*
  FILMOGRAPHY DATA
  ----------------
  Each project becomes one card on the site. To add or edit a project, copy a block and change it.

  title     – project name
  type      – shown on the slate (e.g. "Short Film")
  year      – shown on the slate
  role      – your credit
  tasks     – what you did, shown under the role
  category  – one or more of: "film", "commercial", "post"  (drives the filter buttons)
  still     – path to an image in assets/stills/  (leave "" to show a "still needed" placeholder)
  youtube   – YouTube video ID (the bit after youtu.be/) → plays in a pop-up on the site
  link      – any other link (Instagram, TikTok, Drive) → opens in a new tab
*/
const PROJECTS = [
  {
    title: "The Mission",
    type: "Short Film",
    year: "2026",
    role: "Producer",
    tasks: "Crew & cast management, budget management, call sheets, end credits",
    category: ["film"],
    still: "assets/stills/mission-alley.jpg",
    youtube: "8JRZq8SoJQY",
  },
  {
    title: "Chiral",
    type: "Short Film",
    year: "2025",
    role: "Production Designer",
    tasks: "Blocking, staging, props, wardrobe",
    category: ["film"],
    still: "assets/stills/chiral-wardrobe.jpg",
    youtube: "YNdux-HfOyg",
  },
  {
    title: "Satu Pinggan Harapan",
    type: "Documentary",
    year: "2025",
    role: "Director of Photography · Scriptwriter · AD",
    tasks: "Cinematography, scriptwriting, subtitling, end credits",
    category: ["film"],
    still: "assets/stills/satu-balcony.jpg",
    youtube: "zVWGCxHDsTU",
  },
  {
    title: "The Writer",
    type: "Short Film",
    year: "2025",
    role: "Producer",
    tasks: "Location management, budget management, logistics, production design",
    category: ["film"],
    still: "assets/stills/writer-desk.jpg",
    youtube: "IQJarOrTnEg",
  },
  {
    title: "JS Solar",
    type: "Corporate Video",
    year: "2026",
    role: "Production Assistant + Editor",
    tasks: "Audio edit, basic colour correction, video stabilisation, media organisation",
    category: ["commercial", "post"],
    still: "",
    link: "https://www.instagram.com/reel/DbUbhxADUgT/",
  },
  {
    title: "Rahsiah Dalam Darah",
    type: "Malay Micro Short Drama",
    year: "2026",
    role: "Production Assistant",
    tasks: "Casting prep, location decks, F&B budgeting, production base PA",
    category: ["film"],
    still: "",
    link: "https://www.tiktok.com/@my.suka.drama",
  },
  {
    title: "Chicken & Beer",
    type: "Social Media Ad",
    year: "2026",
    role: "Production Assistant",
    tasks: "Call sheets, F&B, talent management",
    category: ["commercial"],
    still: "",
    link: "",
  },
  {
    title: "Love, Sheryl",
    type: "Short Film",
    year: "2026",
    role: "Production Assistant",
    tasks: "",
    category: ["film"],
    still: "",
    link: "",
  },
  {
    title: "Animation",
    type: "2D Animation",
    year: "",
    role: "Animator",
    tasks: "Adobe Animate",
    category: ["post"],
    still: "assets/stills/animation.jpg",
    youtube: "g-00ZIbpJOU",
  },
  {
    title: "Lyric Video",
    type: "Motion Graphics",
    year: "",
    role: "Editor / Motion Designer",
    tasks: "",
    category: ["post"],
    still: "",
    link: "https://drive.google.com/file/d/11DHMX36UkGKPFmQuVcl711ytf5kEt3ZH/view",
  },
];
