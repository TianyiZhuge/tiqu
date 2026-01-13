/**
 * 特莱恩大陆 - 角色卡构建脚本 v5
 * 使用TavernRegex方案：
 * 1. first_mes中使用<TelainUI>占位符
 * 2. TavernHelper_scripts加载loader注册regex
 * 3. regex将<TelainUI>替换为iframe
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.resolve(ROOT_DIR, 'dist')

// ==================== 系统提示词 ====================
const SYSTEM_PROMPT = `你是「特莱恩大陆」的游戏主持人(GM)。

## 你的职责
1. 叙述故事，描述场景和NPC行为
2. 扮演NPC进行对话
3. 根据玩家行动推进剧情
4. 在遭遇敌人时提供战斗配置

## 输出格式

### 叙事文本
- 使用*斜体*描述环境、氛围、内心活动
- 使用**粗体**强调重要信息
- NPC对话格式：「角色名」"对话内容"

### 行动选项
在叙事末尾提供2-4个行动选项：
[选项]
- 选项1描述
- 选项2描述
- 选项3描述
[/选项]

### 战斗配置（遭遇敌人时）
\`\`\`json
{
  "type": "battle",
  "enemies": [
    {"name": "敌人名", "type": "兵种", "count": 10, "atk": 5, "def": 3}
  ]
}
\`\`\`

### 状态变化（获得/失去资源时）
[状态变化]
gold: +50
supplies: -2
[/状态变化]

## 世界观
特莱恩大陆是日式异世界奇幻设定。玩家是穿越者，拥有指挥军队的能力。`

// ==================== CDN配置 ====================
const CDN_BASE = 'https://testingcf.jsdelivr.net/gh/TianyiZhuge/tiqu@master/extensions/telain-rpg'

// ==================== 生成角色卡 ====================
function generateCharacterCard() {
  // first_mes使用占位符标签，由TavernRegex替换为iframe
  const firstMes = '<TelainUI />'

  // TavernHelper_scripts配置
  const tavernHelperScripts = [
    {
      type: 'script',
      value: {
        id: 'telain-rpg-loader',
        name: '特莱恩大陆RPG',
        content: `import '${CDN_BASE}/src/loader.js'`,
        enabled: true
      }
    }
  ]

  return {
    spec: 'chara_card_v3',
    spec_version: '3.0',
    data: {
      name: '特莱恩大陆',
      description: '{{char}}是特莱恩大陆的游戏主持人，负责叙述故事、扮演NPC、生成战斗配置。',
      personality: '沉稳、公正、富有想象力',
      scenario: '玩家穿越到特莱恩大陆，开始冒险之旅。',
      first_mes: firstMes,
      mes_example: '',
      creator_notes: '日式异世界RPG游戏角色卡\n\n需要安装酒馆助手(JS-Slash-Runner)扩展\n导入后开始对话即可游玩',
      system_prompt: SYSTEM_PROMPT,
      post_history_instructions: '',
      tags: ['game', 'rpg', 'isekai', 'interactive', 'tavern-helper'],
      creator: 'nova-creator',
      character_version: '5.0.0',
      extensions: {
        talkativeness: '0.5',
        fav: false,
        world: '',
        depth_prompt: { prompt: '', depth: 4 },
        TavernHelper_scripts: tavernHelperScripts
      }
    }
  }
}

// ==================== 主函数 ====================
function main() {
  console.log('Building Telain RPG character card v5...')
  console.log('Strategy: TavernRegex placeholder replacement')
  console.log('')

  // 确保dist目录存在
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true })
  }

  const card = generateCharacterCard()

  // 输出到dist目录
  const outputPath = path.join(DIST_DIR, '特莱恩大陆.json')
  fs.writeFileSync(outputPath, JSON.stringify(card, null, 2), 'utf-8')

  // 也复制一份到项目根目录
  const rootOutputPath = path.resolve(ROOT_DIR, '..', '..', '特莱恩大陆.json')
  fs.writeFileSync(rootOutputPath, JSON.stringify(card, null, 2), 'utf-8')

  console.log('Output files:')
  console.log(`  ${outputPath}`)
  console.log(`  ${rootOutputPath}`)
  console.log('')
  console.log('Loader script URL:')
  console.log(`  ${CDN_BASE}/src/loader.js`)
  console.log('')
  console.log('UI HTML URL:')
  console.log(`  ${CDN_BASE}/dist/index.html`)
  console.log('')
  console.log('Done! Import the JSON file into SillyTavern with Tavern Helper installed.')
}

main()
