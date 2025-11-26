import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  // 环境信息
  当前时间: z.string(),
  当前地点: z.string(),
  
  // 关系指标 (0-100)
  融洽度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
  
  // 角色状态: 天音光
  天音光: z.object({
    内心活动: z.string(),
    当前服装: z.string(),
    当前姿势: z.string(),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100))
  }),

  // 角色状态: 魔宫红
  魔宫红: z.object({
    内心活动: z.string(),
    当前服装: z.string(),
    当前姿势: z.string(),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100))
  })
});

$(() => {
  registerMvuSchema(Schema);
})
