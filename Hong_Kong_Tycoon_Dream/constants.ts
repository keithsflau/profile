import { BoardSpace, ColorGroup, SpaceType } from './types';

export const INITIAL_MONEY = 15000;
export const GO_MONEY = 2000;
export const JAIL_FINE = 500; // Adjusted to HK scale $500 instead of $50 for balance with $2000 salary

export const BOARD_DATA: BoardSpace[] = [
  // Bottom Row (Right to Left)
  { id: 0, name: '起點 (GO)', type: SpaceType.START, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 1, name: '長洲', type: SpaceType.PROPERTY, price: 600, rent: [20, 100, 300, 900, 1600, 2500], houseCost: 500, group: ColorGroup.BROWN, houses: 0, isMortgaged: false },
  { id: 2, name: '獅子山精神', type: SpaceType.COMMUNITY, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 3, name: '南丫島', type: SpaceType.PROPERTY, price: 600, rent: [40, 200, 600, 1800, 3200, 4500], houseCost: 500, group: ColorGroup.BROWN, houses: 0, isMortgaged: false },
  { id: 4, name: '薪俸稅', type: SpaceType.TAX, price: 2000, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 5, name: '中環碼頭', type: SpaceType.STATION, price: 2000, rent: [250, 500, 1000, 2000], group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 6, name: '深水埗', type: SpaceType.PROPERTY, price: 1000, rent: [60, 300, 900, 2700, 4000, 5500], houseCost: 500, group: ColorGroup.LIGHT_BLUE, houses: 0, isMortgaged: false },
  { id: 7, name: '時運高低', type: SpaceType.CHANCE, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 8, name: '葵涌', type: SpaceType.PROPERTY, price: 1000, rent: [60, 300, 900, 2700, 4000, 5500], houseCost: 500, group: ColorGroup.LIGHT_BLUE, houses: 0, isMortgaged: false },
  { id: 9, name: '觀塘', type: SpaceType.PROPERTY, price: 1200, rent: [80, 400, 1000, 3000, 4500, 6000], houseCost: 500, group: ColorGroup.LIGHT_BLUE, houses: 0, isMortgaged: false },
  
  // Left Column (Bottom to Top)
  { id: 10, name: '赤柱監獄', type: SpaceType.JAIL, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 11, name: '屯門', type: SpaceType.PROPERTY, price: 1400, rent: [100, 500, 1500, 4500, 6250, 7500], houseCost: 1000, group: ColorGroup.PINK, houses: 0, isMortgaged: false },
  { id: 12, name: '中電', type: SpaceType.UTILITY, price: 1500, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 13, name: '沙田', type: SpaceType.PROPERTY, price: 1400, rent: [100, 500, 1500, 4500, 6250, 7500], houseCost: 1000, group: ColorGroup.PINK, houses: 0, isMortgaged: false },
  { id: 14, name: '將軍澳', type: SpaceType.PROPERTY, price: 1600, rent: [120, 600, 1800, 5000, 7000, 9000], houseCost: 1000, group: ColorGroup.PINK, houses: 0, isMortgaged: false },
  { id: 15, name: '紅磡站', type: SpaceType.STATION, price: 2000, rent: [250, 500, 1000, 2000], group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 16, name: '西環', type: SpaceType.PROPERTY, price: 1800, rent: [140, 700, 2000, 5500, 7500, 9500], houseCost: 1000, group: ColorGroup.ORANGE, houses: 0, isMortgaged: false },
  { id: 17, name: '獅子山精神', type: SpaceType.COMMUNITY, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 18, name: '北角', type: SpaceType.PROPERTY, price: 1800, rent: [140, 700, 2000, 5500, 7500, 9500], houseCost: 1000, group: ColorGroup.ORANGE, houses: 0, isMortgaged: false },
  { id: 19, name: '灣仔', type: SpaceType.PROPERTY, price: 2000, rent: [160, 800, 2200, 6000, 8000, 10000], houseCost: 1000, group: ColorGroup.ORANGE, houses: 0, isMortgaged: false },

  // Top Row (Left to Right)
  { id: 20, name: '免費泊車', type: SpaceType.FREE_PARKING, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 21, name: '旺角', type: SpaceType.PROPERTY, price: 2200, rent: [180, 900, 2500, 7000, 8750, 10500], houseCost: 1500, group: ColorGroup.RED, houses: 0, isMortgaged: false },
  { id: 22, name: '時運高低', type: SpaceType.CHANCE, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 23, name: '尖沙咀', type: SpaceType.PROPERTY, price: 2200, rent: [180, 900, 2500, 7000, 8750, 10500], houseCost: 1500, group: ColorGroup.RED, houses: 0, isMortgaged: false },
  { id: 24, name: '銅鑼灣', type: SpaceType.PROPERTY, price: 2400, rent: [200, 1000, 3000, 7500, 9250, 11000], houseCost: 1500, group: ColorGroup.RED, houses: 0, isMortgaged: false },
  { id: 25, name: '機場快線', type: SpaceType.STATION, price: 2000, rent: [250, 500, 1000, 2000], group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 26, name: '跑馬地', type: SpaceType.PROPERTY, price: 2600, rent: [220, 1100, 3300, 8000, 9750, 11500], houseCost: 1500, group: ColorGroup.YELLOW, houses: 0, isMortgaged: false },
  { id: 27, name: '何文田', type: SpaceType.PROPERTY, price: 2600, rent: [220, 1100, 3300, 8000, 9750, 11500], houseCost: 1500, group: ColorGroup.YELLOW, houses: 0, isMortgaged: false },
  { id: 28, name: '煤氣公司', type: SpaceType.UTILITY, price: 1500, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 29, name: '九龍塘', type: SpaceType.PROPERTY, price: 2800, rent: [240, 1200, 3600, 8500, 10250, 12000], houseCost: 1500, group: ColorGroup.YELLOW, houses: 0, isMortgaged: false },

  // Right Column (Top to Bottom)
  { id: 30, name: '入獄', type: SpaceType.GO_TO_JAIL, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 31, name: '金鐘', type: SpaceType.PROPERTY, price: 3000, rent: [260, 1300, 3900, 9000, 11000, 12750], houseCost: 2000, group: ColorGroup.GREEN, houses: 0, isMortgaged: false },
  { id: 32, name: '啟德', type: SpaceType.PROPERTY, price: 3000, rent: [260, 1300, 3900, 9000, 11000, 12750], houseCost: 2000, group: ColorGroup.GREEN, houses: 0, isMortgaged: false },
  { id: 33, name: '獅子山精神', type: SpaceType.COMMUNITY, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 34, name: '中環', type: SpaceType.PROPERTY, price: 3200, rent: [280, 1500, 4500, 10000, 12000, 14000], houseCost: 2000, group: ColorGroup.GREEN, houses: 0, isMortgaged: false },
  { id: 35, name: '港珠澳大橋', type: SpaceType.STATION, price: 2000, rent: [250, 500, 1000, 2000], group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 36, name: '時運高低', type: SpaceType.CHANCE, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 37, name: '半山區', type: SpaceType.PROPERTY, price: 3500, rent: [350, 1750, 5000, 11000, 13000, 15000], houseCost: 2000, group: ColorGroup.DARK_BLUE, houses: 0, isMortgaged: false },
  { id: 38, name: '差餉地租', type: SpaceType.TAX, price: 1000, group: ColorGroup.NONE, houses: 0, isMortgaged: false },
  { id: 39, name: '太平山頂', type: SpaceType.PROPERTY, price: 4000, rent: [500, 2000, 6000, 14000, 17000, 20000], houseCost: 2000, group: ColorGroup.DARK_BLUE, houses: 0, isMortgaged: false },
];