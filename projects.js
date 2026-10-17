/*
  FILMOGRAPHY DATA
  ----------------
  Each project becomes one card on the site. To add or edit a project, copy a block and change it.

  title     – project name
  type      – shown on the slate (e.g. "Short Film")
  lang      – language(s), shown on the slate
  year      – shown on the slate
  role      – your credit
  about     – one or two lines on the project. Write [link text](https://…) to add a link
  tasks     – what you did, shown under the role
  group     – which row the card sits in:
                "films"  → wide 16:9 cards (YouTube)
                "social" → reels: tall videos that autoplay silently, captions over the picture
                "client" → wide cards with the story beside the picture, for corporate / client work
                "early"  → earlier work, shown last
  still     – path to an image in assets/stills/  (leave "" to show a "still needed" placeholder)
  stillBg   – optional background colour behind the still; set it to show a logo whole instead of cropped

  How the card plays (use one):
  youtube   – YouTube video ID (the bit after youtu.be/) → plays in a pop-up on the site
  instagram – Instagram post path, e.g. "reel/DbUbhxADUgT" or "p/DaZ9Pz1uV8u" → plays in a pop-up on the site
  loop      – a short silent .mp4 in assets/video/ → loops inside the card while it's on screen
              (clicking still plays or opens whatever the card links to)
  tiktok    – TikTok video link (or just the number at the end of it) → loops silently inside the card
  link      – any other link (TikTok account, Instagram account, Drive) → opens in a new tab
              (with tiktok, this is where clicking the card goes)
*/
const PROJECTS = [
  {
    title: "The Mission",
    type: "Short Film",
    lang: "English",
    year: "2026",
    role: "Producer",
    about: "An assassin tasked with killing his own mentor, while mentoring a former janitor who turned to assassination to fund her mother's cancer treatments.",
    tasks: "Crew & cast management, budget management, call sheets, end credits",
    group: "films",
    still: "assets/stills/mission-target.jpg",
    youtube: "8JRZq8SoJQY",
  },
  {
    title: "Chiral",
    type: "Short Film",
    lang: "English",
    year: "2025",
    role: "Production Designer",
    about: "A perspective on an abusive relationship, and a study in how sound, music and lighting work together to build a character beyond their words.",
    tasks: "Blocking, staging, props, wardrobe",
    group: "films",
    still: "assets/stills/chiral-gaze.jpg",
    youtube: "YNdux-HfOyg",
  },
  {
    title: "Satu Pinggan Harapan",
    type: "Documentary",
    lang: "English / Malay",
    year: "2025",
    role: "Director of Photography · Scriptwriter · AD",
    about: "The daily life of Mohana, a mother in a low-income household working to give her children a brighter future.",
    tasks: "Cinematography, scriptwriting, subtitling, end credits",
    group: "films",
    still: "assets/stills/satu-balcony.jpg",
    youtube: "zVWGCxHDsTU",
  },
  {
    title: "The Writer",
    type: "Short Film",
    lang: "Mandarin",
    year: "2025",
    role: "Producer",
    about: "A psychological horror seen through the eyes of a drunk author who can no longer tell the real world from his fiction.",
    tasks: "Location management, budget management, logistics, production design",
    group: "films",
    still: "assets/stills/writer-wrench.jpg",
    youtube: "IQJarOrTnEg",
  },
  {
    title: "Rahsia Dalam Darah",
    type: "TikTok Miniseries",
    lang: "Malay",
    year: "2026",
    role: "Production Assistant",
    about: "A 48-part thriller told in two-minute episodes, with over 137K views. A family fights over an inheritance as ugly truths about its past come to light.",
    tasks: "Casting prep, location decks, F&B budgeting, production base PA",
    group: "social",
    still: "assets/stills/rahsia-dalam-darah.jpg",
    tiktok: "https://www.tiktok.com/@my.suka.drama/video/7680862483531271445",
    link: "https://www.tiktok.com/@my.suka.drama",
  },
  {
    title: "Love, Sheryl",
    type: "Short Film",
    lang: "English",
    year: "2026",
    role: "Production Assistant",
    about: "A psychological thriller about a singer who sabotages a rival's career after being betrayed by her producer. I supported the junior crew behind the scenes. Taylor's policy keeps the full film offline, so here's the teaser and the [official account](https://www.instagram.com/LOVE_SHERYL.OFFICIAL/).",
    tasks: "",
    group: "social",
    still: "assets/stills/love-sheryl.jpg",
    instagram: "p/DaZ9Pz1uV8u",
    loop: "assets/teaser/love-sheryl-teaser.mp4",
  },
  {
    title: "JS Solar",
    type: "Advert / Documentary",
    lang: "Mandarin",
    year: "2026",
    role: "Production Assistant + Editor",
    about: "The story of JS Solar, a solar installation company. Made during my internship, when our firm was subcontracted by Sin Chew Daily, Malaysia's largest Mandarin newspaper. Soon after, JS Solar was [awarded a contract worth over RM18 million](https://www.nst.com.my/business/corporate/2026/08/1513254/js-solar-secured-rm18-mil-contract-tnbs-gsparx) by TNB's GSparx.",
    tasks: "Audio edit, colour correction, video stabilisation, media organisation",
    group: "client",
    still: "assets/stills/js-solar.jpg",
    // Instagram won't play this reel inside other sites, so the card loops a short b-roll cut and links out to the full video
    loop: "assets/video/js-solar-loop.mp4",
    link: "https://www.instagram.com/reel/DbUbhxADUgT/",
  },
  {
    title: "Chicken & Beer",
    type: "Social Media Ads",
    lang: "English",
    year: "2026",
    role: "Production Assistant",
    about: "A series of social ads for the Chicken & Beer restaurant, made during my internship.",
    tasks: "Call sheets, F&B, talent management",
    group: "client",
    still: "assets/stills/chicken-and-beer.jpg",
    stillBg: "#fe9900",
    link: "https://www.instagram.com/chickenandbeer.my/",
  },
  {
    title: "Animation",
    type: "2D Animation",
    lang: "",
    year: "",
    role: "Animator",
    about: "A proof of concept in Adobe Animate for very short ads, with floating text turning around the background. Made early in my university studies.",
    tasks: "Adobe Animate",
    group: "early",
    still: "assets/stills/animation.jpg",
    youtube: "g-00ZIbpJOU",
  },
  {
    title: "Lyric Video",
    type: "Motion Graphics",
    lang: "",
    year: "",
    role: "Editor / Motion Designer",
    about: "",
    tasks: "",
    group: "early",
    still: "assets/stills/lyric-video.jpg",
    link: "https://drive.google.com/file/d/11DHMX36UkGKPFmQuVcl711ytf5kEt3ZH/view",
  },
];
