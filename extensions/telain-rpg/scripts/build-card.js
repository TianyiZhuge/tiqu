/**
 * 特莱恩大陆 - 角色卡构建脚本 v6
 * 使用与哥布林巢穴相同的regex_scripts方案：
 * 1. first_mes中使用<TelainUI>占位符
 * 2. regex_scripts在显示时替换为代码块包装的HTML
 * 3. 代码块触发酒馆助手的前端渲染
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

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

## 世界观
特莱恩大陆是日式异世界奇幻设定。玩家是穿越者，拥有指挥军队的能力。`

// ==================== CDN配置 ====================
const CDN_BASE = 'https://testingcf.jsdelivr.net/gh/TianyiZhuge/tiqu@master/extensions/telain-rpg'

// ==================== 生成角色卡 ====================
function generateCharacterCard() {
  // first_mes使用占位符标签
  const firstMes = '<TelainUI>\n游戏界面加载中...\n</TelainUI>'

  // 与哥布林巢穴相同的regex_scripts配置
  const regexScripts = [
    {
      // 从prompt中删除<TelainUI>标签（发送给AI时不包含）
      id: randomUUID(),
      scriptName: '删除UI标签-Prompt',
      findRegex: '<TelainUI>[\\s\\S]*?<\\/TelainUI>',
      replaceString: '',
      trimStrings: [],
      placement: [2], // AI_OUTPUT for prompt
      disabled: false,
      markdownOnly: false,
      promptOnly: true,  // 只影响prompt
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null
    },
    {
      // 在显示时替换为代码块包装的HTML（触发酒馆助手渲染）
      id: randomUUID(),
      scriptName: '渲染游戏UI-Display',
      findRegex: '<TelainUI>[\\s\\S]*?<\\/TelainUI>',
      replaceString: '```\n<body>\n<script>\n$("body").load("' + CDN_BASE + '/dist/index.html");\n</script>\n</body>\n```',
      trimStrings: [],
      placement: [2], // AI_OUTPUT for display
      disabled: false,
      markdownOnly: true,  // 只影响显示
      promptOnly: false,
      runOnEdit: false,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null
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
      character_version: '6.0.0',
      alternate_greetings: [],
      extensions: {
        talkativeness: '0.5',
        fav: false,
        world: '',
        depth_prompt: { prompt: '', depth: 4, role: 'system' },
        // 关键：使用与哥布林巢穴相同的regex_scripts字段
        regex_scripts: regexScripts
      }
    }
  }
}

// ==================== 主函数 ====================
function main() {
  console.log('Building Telain RPG character card v6...')
  console.log('Strategy: regex_scripts (same as GoblinGame)')
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

  console.log('regex_scripts configured:')
  console.log('  1. 删除UI标签-Prompt: removes <TelainUI> from prompt')
  console.log('  2. 渲染游戏UI-Display: replaces with code block for rendering')
  console.log('')
  console.log('Output files:')
  console.log(`  ${outputPath}`)
  console.log(`  ${rootOutputPath}`)
  console.log('')
  console.log('UI HTML URL:')
  console.log(`  ${CDN_BASE}/dist/index.html`)
  console.log('')
  console.log('Done! Import the JSON file into SillyTavern with Tavern Helper installed.')
}

main()
