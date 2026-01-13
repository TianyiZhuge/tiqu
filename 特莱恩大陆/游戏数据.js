/*
 * 特莱恩大陆 - 游戏数据定义
 * 包含：兵种模板、技能数据、敌人模板、默认卡面素材
 */

/* ========== 兵种模板 ========== */
const UNIT_TEMPLATES = {
  /* === 我方兵种 === */
  "剑士": {
    hp: 15,
    atk: 10,
    def: 8,
    spd: 5,
    skills: ["盾墙"],
    description: "攻守平衡的近战步兵，擅长正面交锋",
    recruitCost: { gold: 10, supplies: 1 },
  },
  "长枪兵": {
    hp: 12,
    atk: 12,
    def: 5,
    spd: 6,
    skills: ["枪阵"],
    description: "高攻击的步兵，对骑兵有额外伤害",
    recruitCost: { gold: 12, supplies: 1 },
  },
  "弓箭手": {
    hp: 10,
    atk: 14,
    def: 3,
    spd: 7,
    skills: ["齐射"],
    description: "远程攻击单位，优先攻击后排",
    recruitCost: { gold: 15, supplies: 1 },
  },
  "骑兵": {
    hp: 18,
    atk: 12,
    def: 6,
    spd: 12,
    skills: ["冲锋"],
    description: "高机动性单位，首回合攻击加成",
    recruitCost: { gold: 25, supplies: 2 },
  },
  "法师": {
    hp: 8,
    atk: 16,
    def: 2,
    spd: 4,
    skills: ["火球术"],
    description: "魔法攻击单位，无视部分防御",
    recruitCost: { gold: 30, supplies: 2 },
  },
  "牧师": {
    hp: 10,
    atk: 4,
    def: 4,
    spd: 3,
    skills: ["治愈之光"],
    description: "治疗单位，可恢复我方部队兵员",
    recruitCost: { gold: 28, supplies: 2 },
  },

  /* === 敌方兵种 === */
  "哥布林": {
    hp: 8,
    atk: 6,
    def: 2,
    spd: 8,
    skills: ["群攻"],
    description: "弱小但数量众多的杂兵",
  },
  "哥布林弓手": {
    hp: 6,
    atk: 8,
    def: 1,
    spd: 7,
    skills: ["毒箭"],
    description: "使用毒箭的哥布林远程单位",
  },
  "座狼": {
    hp: 12,
    atk: 10,
    def: 4,
    spd: 14,
    skills: ["撕咬"],
    description: "快速的野兽，擅长突袭",
  },
  "兽人": {
    hp: 20,
    atk: 14,
    def: 6,
    spd: 5,
    skills: ["狂暴"],
    description: "强壮的兽人战士",
  },
  "骷髅兵": {
    hp: 10,
    atk: 8,
    def: 4,
    spd: 4,
    skills: ["不死"],
    description: "亡灵士兵，免疫毒素和流血",
  },
  "暗影刺客": {
    hp: 10,
    atk: 18,
    def: 2,
    spd: 15,
    skills: ["暗杀"],
    description: "高伤害的刺客，优先攻击低HP目标",
  },
};

/* ========== 技能数据 ========== */
const SKILL_TEMPLATES = {
  /* === 部队技能 === */
  "盾墙": {
    type: "unit",
    category: "defense",
    description: "本回合防御+50%",
    effect: { defBonus: 0.5, duration: 1 },
    cooldown: 2,
  },
  "枪阵": {
    type: "unit",
    category: "passive",
    description: "对骑兵类单位伤害+50%",
    effect: { damageBonus: 0.5, targetType: "cavalry" },
  },
  "齐射": {
    type: "unit",
    category: "attack",
    description: "对所有敌人造成50%攻击力的伤害",
    effect: { damageMultiplier: 0.5, aoe: true },
    cooldown: 3,
  },
  "冲锋": {
    type: "unit",
    category: "passive",
    description: "战斗首回合攻击+30%",
    effect: { atkBonus: 0.3, condition: "firstTurn" },
  },
  "火球术": {
    type: "unit",
    category: "attack",
    description: "造成120%魔法伤害，无视30%防御",
    effect: { damageMultiplier: 1.2, ignoreDefense: 0.3 },
    cooldown: 2,
  },
  "治愈之光": {
    type: "unit",
    category: "heal",
    description: "恢复目标部队20%最大兵员",
    effect: { healPercent: 0.2 },
    cooldown: 3,
  },
  "群攻": {
    type: "unit",
    category: "passive",
    description: "数量越多攻击越高（每10人+5%攻击）",
    effect: { atkBonusPerUnit: 0.005, perUnitCount: 10 },
  },
  "毒箭": {
    type: "unit",
    category: "debuff",
    description: "使目标中毒，每回合损失5%兵员，持续2回合",
    effect: { dot: 0.05, duration: 2 },
    cooldown: 3,
  },
  "撕咬": {
    type: "unit",
    category: "attack",
    description: "造成130%伤害",
    effect: { damageMultiplier: 1.3 },
    cooldown: 2,
  },
  "狂暴": {
    type: "unit",
    category: "buff",
    description: "攻击+50%，防御-30%，持续2回合",
    effect: { atkBonus: 0.5, defPenalty: -0.3, duration: 2 },
    cooldown: 4,
  },
  "不死": {
    type: "unit",
    category: "passive",
    description: "免疫毒素和流血效果",
    effect: { immunities: ["poison", "bleed"] },
  },
  "暗杀": {
    type: "unit",
    category: "attack",
    description: "对HP低于30%的目标造成200%伤害",
    effect: { damageMultiplier: 2.0, condition: "targetHpBelow30" },
    cooldown: 3,
  },

  /* === 将领技能 === */
  "鼓舞": {
    type: "commander",
    category: "buff",
    description: "我方全体攻击+20%，持续2回合",
    effect: { atkBonus: 0.2, duration: 2, target: "allAllies" },
    cooldown: 4,
  },
  "冲锋指令": {
    type: "commander",
    category: "buff",
    description: "指定部队本回合速度+100%，优先行动",
    effect: { spdBonus: 1.0, duration: 1, target: "single" },
    cooldown: 3,
  },
  "战术撤退": {
    type: "commander",
    category: "utility",
    description: "指定部队退出战斗，保留剩余兵员",
    effect: { retreatUnit: true, target: "single" },
    cooldown: 5,
  },
  "集中火力": {
    type: "commander",
    category: "buff",
    description: "指定敌方目标，我方全体对其伤害+30%，持续2回合",
    effect: { markTarget: true, damageBonus: 0.3, duration: 2 },
    cooldown: 4,
  },
  "治疗术": {
    type: "commander",
    category: "heal",
    description: "恢复指定部队30%兵员",
    effect: { healPercent: 0.3, target: "single" },
    cooldown: 4,
  },
  "火焰风暴": {
    type: "commander",
    category: "attack",
    description: "对所有敌人造成将领智谋×2的伤害",
    effect: { damageFormula: "tactics * 2", aoe: true },
    cooldown: 5,
  },
};

/* ========== 敌方将领模板 ========== */
const ENEMY_COMMANDER_TEMPLATES = {
  "哥布林头目": {
    attributes: { leadership: 5, tactics: 2, bravery: 3 },
    skills: ["鼓舞"],
    defaultUnit: "哥布林",
    description: "统领哥布林的小头目",
  },
  "狼骑士": {
    attributes: { leadership: 8, tactics: 5, bravery: 7 },
    skills: ["冲锋指令"],
    defaultUnit: "座狼",
    description: "骑乘座狼的精锐骑兵",
  },
  "兽人队长": {
    attributes: { leadership: 10, tactics: 4, bravery: 12 },
    skills: ["鼓舞", "集中火力"],
    defaultUnit: "兽人",
    description: "兽人部落的战斗队长",
  },
  "亡灵法师": {
    attributes: { leadership: 6, tactics: 15, bravery: 2 },
    skills: ["火焰风暴"],
    defaultUnit: "骷髅兵",
    description: "操纵亡灵的黑暗法师",
  },
  "暗影领主": {
    attributes: { leadership: 12, tactics: 10, bravery: 8 },
    skills: ["集中火力", "战术撤退"],
    defaultUnit: "暗影刺客",
    description: "神秘的暗影组织首领",
  },
};

/* ========== 默认卡面素材 ========== */
const DEFAULT_CARD_ASSETS = {
  /* 卡框样式 */
  frames: {
    normal: {
      borderColor: "#8B7355",
      glowColor: "rgba(139, 115, 85, 0.5)",
    },
    elite: {
      borderColor: "#4169E1",
      glowColor: "rgba(65, 105, 225, 0.6)",
    },
    legendary: {
      borderColor: "#FFD700",
      glowColor: "rgba(255, 215, 0, 0.7)",
    },
  },

  /* 默认兵种图标（使用emoji作为占位符，实际可替换为URL） */
  unitIcons: {
    "剑士": "https://placehold.co/80x80/4a5568/ffffff?text=剑",
    "长枪兵": "https://placehold.co/80x80/4a5568/ffffff?text=枪",
    "弓箭手": "https://placehold.co/80x80/4a5568/ffffff?text=弓",
    "骑兵": "https://placehold.co/80x80/4a5568/ffffff?text=骑",
    "法师": "https://placehold.co/80x80/4a5568/ffffff?text=法",
    "牧师": "https://placehold.co/80x80/4a5568/ffffff?text=牧",
    "哥布林": "https://placehold.co/80x80/2d5a27/ffffff?text=哥",
    "哥布林弓手": "https://placehold.co/80x80/2d5a27/ffffff?text=弓",
    "座狼": "https://placehold.co/80x80/5a4a3a/ffffff?text=狼",
    "兽人": "https://placehold.co/80x80/5a3a2a/ffffff?text=兽",
    "骷髅兵": "https://placehold.co/80x80/3a3a3a/ffffff?text=骷",
    "暗影刺客": "https://placehold.co/80x80/1a1a2a/ffffff?text=影",
  },

  /* 默认敌方将领头像 */
  enemyPortraits: {
    "哥布林头目": "https://placehold.co/100x100/2d5a27/ffffff?text=头目",
    "狼骑士": "https://placehold.co/100x100/5a4a3a/ffffff?text=狼骑",
    "兽人队长": "https://placehold.co/100x100/5a3a2a/ffffff?text=兽人",
    "亡灵法师": "https://placehold.co/100x100/3a3a3a/ffffff?text=亡灵",
    "暗影领主": "https://placehold.co/100x100/1a1a2a/ffffff?text=暗影",
  },
};

/* ========== 战斗公式常量 ========== */
const BATTLE_CONSTANTS = {
  /* 伤害计算 */
  DEFENSE_FACTOR: 100,           /* 防御公式中的常数：damage = atk * (1 - def/(def+DEFENSE_FACTOR)) */
  DAMAGE_RANDOM_MIN: 0.9,        /* 伤害随机下限 */
  DAMAGE_RANDOM_MAX: 1.1,        /* 伤害随机上限 */

  /* 将领加成 */
  BRAVERY_ATK_BONUS: 0.02,       /* 每点武勇增加2%攻击 */
  TACTICS_SKILL_BONUS: 0.03,     /* 每点智谋增加3%技能效果 */
  LEADERSHIP_COUNT_BONUS: 2,     /* 每点领导力增加2个兵员上限 */

  /* 经验和奖励 */
  BASE_EXP_PER_ENEMY: 10,        /* 每击杀一个敌人的基础经验 */
  BASE_GOLD_PER_ENEMY: 5,        /* 每击杀一个敌人的基础金币 */
};

/* ========== 导出（供战斗系统使用） ========== */
/*
 * 在HTML状态栏中，这些数据会被内联使用
 * 以下注释标记用于构建工具识别
 */
/* EXPORT: UNIT_TEMPLATES */
/* EXPORT: SKILL_TEMPLATES */
/* EXPORT: ENEMY_COMMANDER_TEMPLATES */
/* EXPORT: DEFAULT_CARD_ASSETS */
/* EXPORT: BATTLE_CONSTANTS */
