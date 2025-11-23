export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
}

export const chineseQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "「水」字屬於哪一種造字法？",
    options: ["象形", "指事", "會意", "形聲"],
    correctIndex: 0,
    category: "字詞入門",
  },
  {
    id: 2,
    question: "下列哪個詞語是「高興」的反義詞？",
    options: ["快樂", "悲傷", "興奮", "愉快"],
    correctIndex: 1,
    category: "詞語辨析",
  },
  {
    id: 3,
    question: "「春眠不覺曉，處處聞啼鳥」出自哪首詩？",
    options: ["《靜夜思》", "《春曉》", "《詠鵝》", "《登鸛雀樓》"],
    correctIndex: 1,
    category: "詩詞",
  },
  {
    id: 4,
    question: "「一心一意」中的「意」字部首是什麼？",
    options: ["音", "心", "立", "曰"],
    correctIndex: 1,
    category: "部首",
  },
  {
    id: 5,
    question: "「小明跑得很快」中的「得」是什麼詞性？",
    options: ["動詞", "名詞", "助詞", "形容詞"],
    correctIndex: 2,
    category: "語法",
  },
  {
    id: 6,
    question: "「胸有成竹」是什麼修辭手法？",
    options: ["比喻", "擬人", "誇張", "借代"],
    correctIndex: 0,
    category: "修辭",
  },
  {
    id: 7,
    question: "「我、你、他」屬於什麼詞類？",
    options: ["名詞", "代詞", "形容詞", "動詞"],
    correctIndex: 1,
    category: "語法",
  },
  {
    id: 8,
    question: "「太陽」的「陽」字有幾個筆畫？",
    options: ["10", "11", "12", "13"],
    correctIndex: 2,
    category: "字詞入門",
  },
  {
    id: 9,
    question: "下列哪個成語與「守株待兔」的意思相近？",
    options: ["刻舟求劍", "畫蛇添足", "掩耳盜鈴", "自相矛盾"],
    correctIndex: 0,
    category: "成語",
  },
  {
    id: 10,
    question: "「小明正在讀書」中的「正在」是什麼詞？",
    options: ["名詞", "動詞", "副詞", "形容詞"],
    correctIndex: 2,
    category: "語法",
  },
  {
    id: 11,
    question: "「花」字在「花朵」中是第幾聲？",
    options: ["第一聲", "第二聲", "第三聲", "第四聲"],
    correctIndex: 0,
    category: "字音",
  },
  {
    id: 12,
    question: "「筆直」中的「筆」是什麼意思？",
    options: ["寫字的工具", "像筆一樣", "記錄", "書寫"],
    correctIndex: 1,
    category: "詞語理解",
  },
  {
    id: 13,
    question: "「三心二意」的反義詞是什麼？",
    options: ["一心一意", "五顏六色", "七上八下", "十全十美"],
    correctIndex: 0,
    category: "成語",
  },
  {
    id: 14,
    question: "「老師」的「師」字部首是什麼？",
    options: ["巾", "彳", "人", "口"],
    correctIndex: 0,
    category: "部首",
  },
  {
    id: 15,
    question: "「美麗的花朵」中的「的」是什麼詞性？",
    options: ["動詞", "名詞", "助詞", "形容詞"],
    correctIndex: 2,
    category: "語法",
  },
  {
    id: 16,
    question: "「守株待兔」出自哪個寓言故事？",
    options: ["《伊索寓言》", "《韓非子》", "《莊子》", "《孟子》"],
    correctIndex: 1,
    category: "寓言",
  },
  {
    id: 17,
    question: "「山」字屬於哪一種造字法？",
    options: ["象形", "指事", "會意", "形聲"],
    correctIndex: 0,
    category: "字詞入門",
  },
  {
    id: 18,
    question: "「飛快」的「快」字是什麼意思？",
    options: ["速度", "快樂", "敏捷", "迅速"],
    correctIndex: 3,
    category: "詞語理解",
  },
  {
    id: 19,
    question: "「畫龍點睛」比喻什麼？",
    options: ["添加關鍵部分", "畫得很像", "畫蛇添足", "多此一舉"],
    correctIndex: 0,
    category: "成語",
  },
  {
    id: 20,
    question: "「小明和小華是好朋友」中的「和」是什麼詞性？",
    options: ["動詞", "介詞", "連詞", "名詞"],
    correctIndex: 2,
    category: "語法",
  },
  {
    id: 21,
    question: "「高興」的「興」字讀音是什麼？",
    options: ["xīng", "xìng", "xíng", "xǐng"],
    correctIndex: 1,
    category: "字音",
  },
  {
    id: 22,
    question: "「大海」的「海」字有幾個筆畫？",
    options: ["8", "9", "10", "11"],
    correctIndex: 2,
    category: "字詞入門",
  },
  {
    id: 23,
    question: "「一心一意」中的「心」是什麼意思？",
    options: ["器官", "思想", "專注", "情感"],
    correctIndex: 2,
    category: "詞語理解",
  },
  {
    id: 24,
    question: "「老師教我識字」是什麼句型？",
    options: ["主謂賓", "主謂", "主謂補", "主謂定"],
    correctIndex: 0,
    category: "語法",
  },
  {
    id: 25,
    question: "「風聲」中的「聲」字部首是什麼？",
    options: ["耳", "士", "尸", "貝"],
    correctIndex: 0,
    category: "部首",
  },
  {
    id: 26,
    question: "「鳥語花香」形容什麼季節？",
    options: ["春天", "夏天", "秋天", "冬天"],
    correctIndex: 0,
    category: "成語",
  },
  {
    id: 27,
    question: "「讀書」的「讀」字是什麼部首？",
    options: ["言", "賣", "貝", "頁"],
    correctIndex: 0,
    category: "部首",
  },
  {
    id: 28,
    question: "「小明跑得很快」中「很快」修飾什麼？",
    options: ["小明", "跑", "得", "很"],
    correctIndex: 1,
    category: "語法",
  },
  {
    id: 29,
    question: "「畫蛇添足」比喻什麼？",
    options: ["多此一舉", "畫得很像", "添加關鍵部分", "很認真"],
    correctIndex: 0,
    category: "成語",
  },
  {
    id: 30,
    question: "「美麗的花朵」是什麼短語類型？",
    options: ["主謂短語", "偏正短語", "動賓短語", "並列短語"],
    correctIndex: 1,
    category: "語法",
  },
];

export const getRandomQuestion = (): QuizQuestion => {
  const index = Math.floor(Math.random() * chineseQuestions.length);
  return chineseQuestions[index];
};

