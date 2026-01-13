/*
 * 特莱恩大陆 - 变量结构定义
 * 使用 Zod 4.x Schema 定义所有游戏数据结构
 */

const statSchema = z.object({
  /* ========== 军队系统 ========== */
  army: z.object({
    /* 将领列表 */
    commanders: z.array(z.object({
      /* 将领基础信息 */
      id: z.string(),                          /* 唯一标识 */
      name: z.string(),                        /* 将领名称 */
      title: z.string().optional(),            /* 称号（可选） */
      profession: z.string(),                  /* 职业 */
      level: z.coerce.number().default(1),     /* 等级 */

      /* 将领属性 */
      attributes: z.object({
        leadership: z.coerce.number().default(10),  /* 领导力 - 影响部队士气和数量上限 */
        tactics: z.coerce.number().default(10),     /* 智谋 - 影响技能效果 */
        bravery: z.coerce.number().default(10),     /* 武勇 - 影响部队攻击加成 */
      }),

      /* 将领技能 */
      skills: z.array(z.string()).default([]),

      /* 部队信息 */
      unit: z.object({
        type: z.string(),                           /* 兵种名称 */
        currentCount: z.coerce.number(),            /* 当前兵员数 */
        maxCount: z.coerce.number(),                /* 最大兵员数 */
        frontRowHp: z.coerce.number().optional(),   /* 最前排士兵剩余HP（用于精确伤亡计算） */
      }),

      /* 卡面自定义（可选） */
      cardCustomization: z.object({
        portrait: z.string().optional(),            /* 卡面图片URL */
        frame: z.enum(["normal", "elite", "legendary"]).default("normal"),
        theme: z.string().optional(),               /* 主题色 */
      }).optional(),
    })),
  }),

  /* ========== 资源系统 ========== */
  resources: z.object({
    gold: z.coerce.number().default(0),             /* 金币 */
    supplies: z.coerce.number().default(0),         /* 补给品（用于补兵） */
  }),

  /* ========== 战斗配置（由LLM设定） ========== */
  battle_config: z.object({
    /* 敌方将领+部队列表 */
    enemies: z.array(z.object({
      id: z.string(),
      name: z.string(),
      unit: z.object({
        type: z.string(),
        count: z.coerce.number(),
      }),
      skills: z.array(z.string()).default([]),
      /* 敌方卡面（可选，匹配预设或使用默认） */
      cardCustomization: z.object({
        portrait: z.string().optional(),
        frame: z.enum(["normal", "elite", "legendary"]).default("normal"),
      }).optional(),
    })).default([]),

    /* 胜利条件 */
    winCondition: z.string().default("击败所有敌人"),

    /* 特殊规则 */
    specialRules: z.string().optional(),

    /* 预设对话 */
    dialogues: z.array(z.object({
      trigger: z.string(),                          /* 触发条件 */
      speaker: z.string(),                          /* 说话者 */
      text: z.string(),                             /* 对话内容 */
      responder: z.string().optional(),             /* 回应者（可选） */
      response: z.string().optional(),              /* 回应内容（可选） */
    })).default([]),
  }),

  /* ========== 战斗状态 ========== */
  battle_state: z.object({
    inBattle: z.boolean().default(false),           /* 是否在战斗中 */
    currentTurn: z.coerce.number().default(0),      /* 当前回合数 */

    /* 战斗结果（战斗结束后填充） */
    result: z.enum(["none", "victory", "defeat", "retreat"]).default("none"),

    /* 我方伤亡记录 */
    ourCasualties: z.record(z.string(), z.object({
      unit: z.string(),
      initial: z.coerce.number(),
      remaining: z.coerce.number(),
      lost: z.coerce.number(),
    })).default({}),

    /* 敌方伤亡记录 */
    enemyCasualties: z.record(z.string(), z.object({
      unit: z.string(),
      initial: z.coerce.number(),
      remaining: z.coerce.number(),
      lost: z.coerce.number(),
    })).default({}),

    /* 获得奖励 */
    rewards: z.object({
      exp: z.coerce.number().default(0),
      gold: z.coerce.number().default(0),
      items: z.array(z.string()).default([]),
    }),
  }),

  /* ========== 卡面自定义配置 ========== */
  card_customization: z.object({
    /* 我方将领卡面 */
    ally_commanders: z.record(z.string(), z.object({
      portrait: z.string().optional(),
      frame: z.enum(["normal", "elite", "legendary"]).default("normal"),
      theme: z.string().optional(),
    })).default({}),

    /* 敌方将领/兵种卡面预设 */
    enemy_portraits: z.record(z.string(), z.object({
      portrait: z.string().optional(),
      frame: z.enum(["normal", "elite", "legendary"]).default("normal"),
    })).default({}),

    /* 兵种图标 */
    unit_icons: z.record(z.string(), z.string()).default({}),
  }),

  /* ========== 游戏进度 ========== */
  progress: z.object({
    chapter: z.coerce.number().default(1),          /* 当前章节 */
    totalBattles: z.coerce.number().default(0),     /* 总战斗次数 */
    victories: z.coerce.number().default(0),        /* 胜利次数 */
  }),
});
