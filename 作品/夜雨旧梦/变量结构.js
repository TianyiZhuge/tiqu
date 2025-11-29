import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  世界: z.object({
    时间: z.string(),
    地点: z.string()
  }),

  沈梦雨: z.object({
    状态: z.string(),
    穿着: z.string(),
    好感度: z.coerce.number()
      .transform(v => _.clamp(v, 0, 100))
  }),

  主角: z.object({
    重要道具列表: z.record(
      z.string().describe('道具名'),
      z.string()
    ).prefault({}),

    通讯录列表: z.record(
      z.string().describe('联系人名'),
      z.string()
    ).prefault({})
  }),

  主线: z.object({
    标题: z.string(),
    描述: z.string(),
    剧情开关: z.coerce.number()
      .transform(v => _.clamp(v, 0, 4))
  })
});

$(() => {
  registerMvuSchema(Schema);
})
