import { Github } from "lucide-react";

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
    title: "Landing Page",
    description:
      "A minimalist, performance-focused personal landing page built with Next.js. (a.k.a this website)",
    url: "https://github.com/howar31/landing-page",
    tags: ["Design", "Website"],
    imageUrl: "",
    language: "TypeScript",
  },
  {
    title: "Star Citizen 中文社群網",
    description: "Traditional Chinese community website for Star Citizen.",
    url: "http://starcitizen.howar31.com/",
    tags: ["Community", "Game", "Website"],
    imageUrl: "/starcitizen.jpg",
  },
  {
    title: "GW2 Timer",
    description: "Guild Wars 2 World Boss Event Timer.",
    url: "https://gw2timer.howar31.com/",
    tags: ["Game", "Tool", "Website"],
    imageUrl: "/gw2timer.png",
    language: "JavaScript",
  },
  {
    title: "PTT 推樂透",
    description: "Lottery tool for PTT (Taiwanese BBS).",
    url: "https://pttlottery.howar31.com/",
    tags: ["Tool", "Website"],
    imageUrl: "/pttlottery.png",
    language: "JavaScript",
  },
  {
    title: "Countdown",
    description: "A pure JavaScript countdown timer.",
    url: "https://countdown.howar31.com/",
    tags: ["Tool", "Website"],
    imageUrl: "/countdown.png",
    language: "JavaScript",
  },
  {
    title: "假的 信用卡安全掃描系統",
    description:
      "A prank web app simulating credit card scanning to raise security awareness.",
    url: "https://howar31.github.io/prank_credit_card_scan/",
    tags: ["Tool", "Website"],
    imageUrl: "",
  },
  {
    title: "早餐計算機",
    description:
      "A simple breakfast calculator to choose the best meal items within the company’s subsidy amount.",
    url: "https://howar31.github.io/breakfast/",
    tags: ["Tool", "Website"],
    imageUrl: "",
    language: "JavaScript",
  },
  {
    title: "NeoPlurkCSS3",
    description: "Modern CSS3 theme for Plurk.",
    url: "https://github.com/howar31/NeoPlurkCSS3",
    tags: ["Design"],
    imageUrl: "/neoplurkcss3.png",
    language: "CSS",
  },
  {
    title: "EzTwitch",
    description:
      "A lightweight Chrome extension for Twitch TV notification and popout.",
    url: "https://chrome.google.com/webstore/detail/eztwitch/pnapgjocmoacccjajhomkikgggcepobk/",
    tags: ["Tool"],
    imageUrl: "/eztwitch.png",
    language: "JavaScript",
  },
  {
    title: "中華民國外交部駐外單位網站",
    description: "Portal of Diplomatic Missions of ROC (Taiwan).",
    url: "http://www.roc-taiwan.org/portalOfDiplomaticMission_tc.html",
    tags: ["Website"],
    imageUrl: "",
  },
  {
    title: "Stockfeel 股感知識庫",
    description: "Financial knowledge platform.",
    url: "http://www.stockfeel.com.tw/",
    tags: ["Website"],
    imageUrl: "",
  },
  {
    title: "國立臺北大學 鄭愁予數位文學館",
    description: "Digital literature museum for Zheng Chouyu.",
    url: "http://www.digitalpoetry-zcy.ntpu.edu.tw/",
    tags: ["Website"],
    imageUrl: "/digitalpoetry-zcy.jpg",
  },
  {
    title: "Warhammer 40,000: Rogue Trader 繁體中文化",
    description:
      "Traditional Chinese localization project for Warhammer 40,000: Rogue Trader.",
    url: "https://github.com/howar31/WH4KRT-TradChinese",
    tags: ["Game", "Translation"],
    imageUrl: "/wh4krt.jpg",
  },
  {
    title: "Prison Architect 繁體中文化",
    description: "Traditional Chinese localization mod for Prison Architect.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=473471025",
    tags: ["Game", "Translation"],
    imageUrl: "/prison-architect.jpg",
  },
  {
    title: "Banished 繁體中文化",
    description: "Traditional Chinese localization mod for Banished.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=338554849",
    tags: ["Game", "Translation"],
    imageUrl: "/banished.jpg",
  },
  {
    title: "Trove Auto Fishing",
    description: "AutoHotKey script for auto fishing in Trove.",
    url: "https://github.com/howar31/Trove-AHK-AutoFish",
    tags: ["Game", "Tool"],
    imageUrl: "",
    language: "AutoHotkey",
  },
  {
    title: "Discord Bot Usagi",
    description: "Custom Discord bot for private server management.",
    url: "#",
    tags: ["Community", "Tool"],
    imageUrl: "",
  },
  {
    title: "EVE Echoes IOP 鐵星軍團",
    description: "Guild website for EVE Echoes Iron Order Phalanx corporation.",
    url: "#",
    tags: ["Community", "Game"],
    imageUrl: "",
  },
  {
    title: "GW2 PTT Netizens 公會網站",
    description: "Guild website for GW2 PTT players.",
    url: "#",
    tags: ["Community", "Game"],
    imageUrl: "",
  },
  {
    title: "Oh-My-Zsh Powerline Theme",
    description: "A modified Powerline style theme for Oh My Zsh.",
    url: "https://github.com/howar31/oh-my-zsh-powerline-theme",
    tags: ["Design", "Tool"],
    imageUrl: "",
    language: "Shell",
  },
];

export const moreProjects = {
  text: "More on GitHub",
  url: "https://github.com/howar31",
  icon: Github,
};
