import { Github } from "@/components/icons";

export interface Project {
  title: string;
  description: string;
  url: string;
  tags: string[];
  imageUrl?: string;
  language?: string;
  /** Optional override for the placeholder-tile monogram (image-less cards). */
  monogram?: string;
}

export const projects: Project[] = [
  {
    title: "Scrum Poker",
    description:
      "Serverless, peer-to-peer Scrum Poker that runs entirely in the browser over WebRTC.",
    url: "https://lab.howar31.com/scrum-poker/",
    tags: ["Web App", "Dev Tools"],
    imageUrl: "/scrum-poker.png",
    language: "TypeScript",
  },
  {
    title: "Codec Craft",
    description:
      "In-browser codec workbench for WebM, GIF, and APNG cross-conversion — runs fully offline via ffmpeg.wasm.",
    url: "https://lab.howar31.com/codecraft/",
    tags: ["Web App"],
    imageUrl: "/codecraft.png",
    language: "JavaScript",
  },
  {
    title: "Hype Sign",
    description:
      "An offline LED-sign PWA with multi-color gradients and a marquee mode.",
    url: "https://lab.howar31.com/hype-sign/",
    tags: ["Web App"],
    imageUrl: "/hype-sign.png",
    language: "TypeScript",
  },
  {
    title: "MAGI Workflow",
    description:
      "A multi-model workflow plugin for Claude Code with MAGI-style weighted voting.",
    url: "https://github.com/howar31/magi-workflow",
    tags: ["AI", "Claude", "Dev Tools", "CLI"],
    imageUrl: "",
    language: "Shell",
  },
  {
    title: "Claude Statusline",
    description: "A custom 8-line colored status line for Claude Code.",
    url: "https://github.com/howar31/claude-statusline",
    tags: ["AI", "Claude", "Dev Tools", "CLI"],
    imageUrl: "",
    language: "Shell",
  },
  {
    title: "Claude Memory",
    description:
      "A cross-directory memory index and /memorize skill for Claude Code's auto-memory.",
    url: "https://github.com/howar31/claude-memory",
    tags: ["AI", "Claude", "Dev Tools", "CLI"],
    imageUrl: "",
    language: "Shell",
  },
  {
    title: "Claude Backup",
    description:
      "Three-layer backup for a Claude Code config tree, run as background macOS jobs.",
    url: "https://github.com/howar31/claude-backup",
    tags: ["AI", "Claude", "Dev Tools", "CLI"],
    imageUrl: "",
    language: "Shell",
  },
  {
    title: "Monokai Color Scheme",
    description:
      "A faithful Monokai color scheme for Ghostty, Neovim, and Vim.",
    url: "https://github.com/howar31/monokai-sublimetext",
    tags: ["Design", "Dev Tools"],
    imageUrl: "",
    language: "Lua",
  },
  {
    title: "Oh-My-Zsh Powerline Theme",
    description: "A modified Powerline style theme for Oh My Zsh.",
    url: "https://github.com/howar31/oh-my-zsh-powerline-theme",
    tags: ["Design", "Dev Tools", "CLI"],
    imageUrl: "",
    language: "Shell",
  },
  {
    title: "GW2 Timer",
    description: "Guild Wars 2 World Boss Event Timer.",
    url: "https://gw2timer.howar31.com/",
    tags: ["Web App", "Gaming"],
    imageUrl: "/gw2timer.png",
    language: "JavaScript",
  },
  {
    title: "Trove Auto Fishing",
    description: "AutoHotKey script for auto fishing in Trove.",
    url: "https://github.com/howar31/Trove-AHK-AutoFish",
    tags: ["Gaming"],
    imageUrl: "",
    language: "AutoHotkey",
  },
  {
    title: "PTT 推樂透",
    description: "Lottery tool for PTT (Taiwanese BBS).",
    url: "https://pttlottery.howar31.com/",
    tags: ["Web App"],
    imageUrl: "/pttlottery.png",
    language: "JavaScript",
  },
  {
    title: "Star Citizen 中文社群網",
    description: "Traditional Chinese community website for Star Citizen.",
    url: "https://starcitizen.howar31.com/",
    tags: ["Gaming", "Community", "Website"],
    imageUrl: "/starcitizen.jpg",
  },
  {
    title: "Discord Bot Usagi",
    description: "Custom Discord bot for private server management.",
    url: "#",
    tags: ["Gaming", "Community"],
    imageUrl: "",
    language: "JavaScript",
  },
  {
    title: "Warhammer 40K: Rogue Trader 正體中文化",
    description:
      "Traditional Chinese localization project for Warhammer 40,000: Rogue Trader.",
    url: "https://github.com/howar31/WH4KRT-TradChinese",
    tags: ["Gaming", "Localization"],
    imageUrl: "/wh4krt.jpg",
  },
  {
    title: "Prison Architect 正體中文化",
    description: "Traditional Chinese localization mod for Prison Architect.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=473471025",
    tags: ["Gaming", "Localization"],
    imageUrl: "/prison-architect.jpg",
  },
  {
    title: "Banished 正體中文化",
    description: "Traditional Chinese localization mod for Banished.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=338554849",
    tags: ["Gaming", "Localization"],
    imageUrl: "/banished.jpg",
  },
  {
    title: "Stockfeel 股感知識庫",
    description: "Financial knowledge platform.",
    url: "https://www.stockfeel.com.tw/",
    tags: ["Client Work", "Website"],
    imageUrl: "",
  },
  {
    title: "中華民國外交部駐外單位網站",
    description: "Portal of Diplomatic Missions of ROC (Taiwan).",
    url: "http://www.roc-taiwan.org/portalOfDiplomaticMission_tc.html",
    tags: ["Client Work", "Website"],
    imageUrl: "",
  },
  {
    title: "國立臺北大學 鄭愁予數位文學館",
    description: "Digital literature museum for Zheng Chouyu.",
    url: "http://www.digitalpoetry-zcy.ntpu.edu.tw/",
    tags: ["Client Work", "Website"],
    imageUrl: "/digitalpoetry-zcy.jpg",
  },
];

export const moreProjects = {
  text: "more on GitHub",
  url: "https://github.com/howar31",
  icon: Github,
};
