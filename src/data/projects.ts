export interface Project {
  title: string;
  description: string;
  url: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    title: "EzTwitch",
    description: "A lightweight Chrome extension for Twitch TV notification and popout.",
    url: "https://chrome.google.com/webstore/detail/eztwitch/pnapgjocmoacccjajhomkikgggcepobk/",
    tags: ["Tool"],
  },
  {
    title: "NeoPlurkCSS3",
    description: "Modern CSS3 theme for Plurk.",
    url: "https://github.com/howar31/NeoPlurkCSS3",
    tags: ["Design"],
  },
  {
    title: "GW2 Timer",
    description: "Guild Wars 2 World Boss Event Timer.",
    url: "https://gw2timer.howar31.com/",
    tags: ["Tool", "Game"],
  },
  {
    title: "PTT 推樂透",
    description: "Lottery tool for PTT (Taiwanese BBS).",
    url: "https://pttlottery.howar31.com/",
    tags: ["Tool"],
  },
  {
    title: "Star Citizen 中文社群網",
    description: "Traditional Chinese community website for Star Citizen.",
    url: "http://starcitizen.howar31.com/",
    tags: ["Community"],
  },
  {
    title: "Stockfeel 股感知識庫",
    description: "Financial knowledge platform.",
    url: "http://www.stockfeel.com.tw/",
    tags: ["Website"],
  },
  {
    title: "國立臺北大學 鄭愁予數位文學館",
    description: "Digital literature museum for Zheng Chouyu.",
    url: "http://www.digitalpoetry-zcy.ntpu.edu.tw/",
    tags: ["Website"],
  },
  {
    title: "中華民國外交部駐外單位網站",
    description: "Portal of Diplomatic Missions of ROC (Taiwan).",
    url: "http://www.roc-taiwan.org/portalOfDiplomaticMission_tc.html",
    tags: ["Website"],
  },
  {
    title: "GW2 PTT Netizens 公會網站",
    description: "Guild website for GW2 PTT players.",
    // url: "http://gw2.howar31.com/",
    url: "#",
    tags: ["Community", "Game"],
  },
  {
    title: "Howar31 Countdown",
    description: "A simple countdown timer.",
    // url: "http://countdown.howar31.com/",
    url: "#",
    tags: ["Tool"],
  },
  {
    title: "高雄氣爆資訊網",
    description: "Information aggregation for the Kaohsiung gas explosions.",
    // url: "http://howar31.com/KaohsiungExplosion/",
    url: "#",
    tags: ["Website"],
  },
  {
    title: "HX8 Chamber of Secret",
    description: "A secret project.",
    // url: "http://howar31.no-ip.biz:8080/hx8/",
    url: "#",
    tags: ["Website"],
  },
  {
    title: "發票對獎系統",
    description: "Taiwan receipt lottery checker.",
    url: "#",
    tags: ["Tool"],
  },
  {
    title: "HSNG Todo List",
    description: "Todo list application.",
    url: "#",
    tags: ["Tool"],
  },
];

export const socialLinks = [
  {
    title: "GitHub",
    url: "https://github.com/howar31",
  },
];
