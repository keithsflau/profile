import type { CardDefinition } from "../types";

export const opportunityCards: CardDefinition[] = [
  {
    id: 1,
    title: "朗誦比賽奪冠",
    description: "朗誦指定古詩兩句，成功獲得 200 語文資源。",
    actions: [{ kind: "resource", amount: 200 }],
  },
  {
    id: 2,
    title: "修正錯別字",
    description: "幫同學修改作業，前進兩格並領取 50 資源。",
    actions: [
      { kind: "resource", amount: 50 },
      { kind: "move", steps: 2 },
    ],
  },
  {
    id: 3,
    title: "突擊測驗滿分",
    description: "展示語文技巧，免費升級一間字屋。",
    actions: [{ kind: "grantUpgrade" }],
  },
  {
    id: 4,
    title: "詩詞接龍贏掌聲",
    description: "成功完成接龍，本回合可免一次租金。",
    actions: [{ kind: "grantShield" }],
  },
  {
    id: 5,
    title: "書法展開幕",
    description: "所有玩家各付你 25 語文資源。",
    actions: [{ kind: "chargeOthers", amount: 25 }],
  },
  {
    id: 6,
    title: "語文列車旅行",
    description: "前往最近的語文列車格並依規則處理。",
    actions: [{ kind: "moveToNearest", target: "railroad" }],
  },
  {
    id: 7,
    title: "語文小博士獎",
    description: "校長頒獎，獲得 150 語文資源。",
    actions: [{ kind: "resource", amount: 150 }],
  },
  {
    id: 8,
    title: "成語故事流利",
    description: "流暢說出成語典故，立即抽一張命運卡。",
    actions: [{ kind: "draw", deck: "fate" }],
  },
  {
    id: 9,
    title: "忘帶課本",
    description: "支付 30 資源向圖書室借用。",
    actions: [{ kind: "resource", amount: -30 }],
  },
  {
    id: 10,
    title: "語文工作坊",
    description: "支付 100 資源參與課程，並再抽一張機會卡。",
    actions: [
      { kind: "resource", amount: -100 },
      { kind: "draw", deck: "opportunity" },
    ],
  },
];

export const fateCards: CardDefinition[] = [
  {
    id: 1,
    title: "作業放錯",
    description: "把老師作業放錯班級，退回三格重新遞交。",
    actions: [{ kind: "move", steps: -3 }],
  },
  {
    id: 2,
    title: "冷笑話失誤",
    description: "在班上講冷笑話被罰，支付 20 資源作補課基金。",
    actions: [{ kind: "resource", amount: -20 }],
  },
  {
    id: 3,
    title: "教授點名",
    description: "被語文教授點名，直接進入語文修養室。",
    actions: [
      { kind: "teleport", targetSpaceId: 20, awardOnPass: false },
      { kind: "enterJail" },
    ],
  },
  {
    id: 4,
    title: "成語配對失利",
    description: "成語配對失敗，支付 50 資源重新練習。",
    actions: [{ kind: "resource", amount: -50 }],
  },
  {
    id: 5,
    title: "校外文化展",
    description: "參展獲好評，領取 100 資源。",
    actions: [{ kind: "resource", amount: 100 }],
  },
  {
    id: 6,
    title: "整理筆記",
    description: "協助同學整理筆記，向每位玩家收 25 資源。",
    actions: [{ kind: "chargeOthers", amount: 25 }],
  },
  {
    id: 7,
    title: "書法作品入選",
    description: "優秀書法被張貼，領取 75 資源。",
    actions: [{ kind: "resource", amount: 75 }],
  },
  {
    id: 8,
    title: "忘交閱讀報告",
    description: "忘記交閱讀報告，停留一回合反省。",
    actions: [{ kind: "skipTurn" }],
  },
  {
    id: 9,
    title: "志工合作",
    description: "與圖書館志工合作，前進至免費圖書室。",
    actions: [{ kind: "teleport", targetSpaceId: 17 }],
  },
  {
    id: 10,
    title: "語文列車檢修",
    description: "語文列車大檢修，所有玩家各向銀行支付 40 資源。",
    actions: [{ kind: "allPay", amount: 40 }],
  },
];

