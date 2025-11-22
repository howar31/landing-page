import { Github } from "lucide-react";

export interface Project {
  title: string;
  description: string;
  url: string;
  tags: string[];
  imageUrl?: string;
}

export const projects: Project[] = [
  {
    title: "Landing Page",
    description:
      "A minimalist, performance-focused personal landing page built with Next.js. (a.k.a this website)",
    url: "https://github.com/howar31/landing-page",
    tags: ["Website"],
    imageUrl: "",
  },
  {
    title: "Star Citizen 中文社群網",
    description: "Traditional Chinese community website for Star Citizen.",
    url: "http://starcitizen.howar31.com/",
    tags: ["Community", "Website", "Game"],
    imageUrl: "starcitizen.jpg",
  },
  {
    title: "GW2 Timer",
    description: "Guild Wars 2 World Boss Event Timer.",
    url: "https://gw2timer.howar31.com/",
    tags: ["Tool", "Game"],
    imageUrl:
      "https://github.com/howar31/GW2Timer/raw/gh-pages/GW2Timer_Preview_en.png",
  },
  {
    title: "PTT 推樂透",
    description: "Lottery tool for PTT (Taiwanese BBS).",
    url: "https://pttlottery.howar31.com/",
    tags: ["Tool"],
    imageUrl: "https://github.com/howar31/PTTLottery/raw/gh-pages/preview.png",
  },
  {
    title: "Countdown",
    description: "A pure JavaScript countdown timer.",
    url: "https://countdown.howar31.com/",
    tags: ["Tool"],
    imageUrl: "https://github.com/howar31/countdown/raw/gh-pages/preview2.png",
  },
  {
    title: "假的 信用卡安全掃描系統",
    description:
      "A prank web app simulating credit card scanning to raise security awareness.",
    url: "https://howar31.github.io/prank_credit_card_scan/",
    tags: ["Website", "Tool"],
    imageUrl: "",
  },
  {
    title: "早餐計算機",
    description:
      "A simple breakfast calculator to choose the best meal items within the company’s subsidy amount.",
    url: "https://howar31.github.io/breakfast/",
    tags: ["Tool", "Website"],
    imageUrl: "",
  },
  {
    title: "NeoPlurkCSS3",
    description: "Modern CSS3 theme for Plurk.",
    url: "https://github.com/howar31/NeoPlurkCSS3",
    tags: ["Design"],
    imageUrl:
      "https://camo.githubusercontent.com/234ab2d21c889aa2e587ded3510ed0b8505b9e5cca2c077f3f472cc44105599e/687474703a2f2f332e62702e626c6f6773706f742e636f6d2f2d30744471616f6251386e6b2f55555a57626657645a5f492f41414141414141414a35512f6c66766b6a4f772d4348592f73313630302f312e6e6f6c6f67696e2e706e67",
  },
  {
    title: "EzTwitch",
    description:
      "A lightweight Chrome extension for Twitch TV notification and popout.",
    url: "https://chrome.google.com/webstore/detail/eztwitch/pnapgjocmoacccjajhomkikgggcepobk/",
    tags: ["Tool"],
    imageUrl:
      "https://github.com/howar31/EzTwitch/blob/master/deploy/images/icon.png?raw=true",
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
    imageUrl: "digitalpoetry-zcy.jpg",
  },
  {
    title: "Warhammer 40,000: Rogue Trader 繁體中文化",
    description:
      "Traditional Chinese localization project for Warhammer 40,000: Rogue Trader.",
    url: "https://github.com/howar31/WH4KRT-TradChinese",
    tags: ["Game", "Translation"],
    imageUrl:
      "https://github.com/howar31/WH4KRT-TradChinese/raw/main/screenshots/20241110231725_1.jpg",
  },
  {
    title: "Prison Architect 繁體中文化",
    description: "Traditional Chinese localization mod for Prison Architect.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=473471025",
    tags: ["Game", "Translation"],
    imageUrl:
      "https://images.steamusercontent.com/ugc/441732331243214089/AC1E70D832FC116B983627C30FEAF9D86D4467FC/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
  },
  {
    title: "Banished 繁體中文化",
    description: "Traditional Chinese localization mod for Banished.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=338554849",
    tags: ["Game", "Translation"],
    imageUrl:
      "https://cdn.steamusercontent.com/ugc/38606361443126458/DAA04D6C5A22D5ABC8772972C77D6326D5E60FB9/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
  },
  {
    title: "Trove Auto Fishing",
    description: "AutoHotKey script for auto fishing in Trove.",
    url: "https://github.com/howar31/Trove-AHK-AutoFish",
    tags: ["Tool", "Game"],
    imageUrl: "",
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
    // url: "http://gw2.howar31.com/",
    url: "#",
    tags: ["Community", "Game"],
    imageUrl: "",
  },
  {
    title: "Oh-My-Zsh Powerline Theme",
    description: "A modified Powerline style theme for Oh My Zsh.",
    url: "https://github.com/howar31/oh-my-zsh-powerline-theme",
    tags: ["Tool", "Design"],
    imageUrl: "",
  },
];

export const socialLinks = [
  {
    title: "GitHub",
    url: "https://github.com/howar31/howar31-web",
    icon: Github,
  },
];

export const moreProjects = {
  text: "More on GitHub",
  url: "https://github.com/howar31",
  icon: Github,
};
