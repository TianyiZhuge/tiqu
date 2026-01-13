/**
 * 特莱恩大陆 - 角色卡构建脚本 v7
 * 使用与哥布林巢穴完全相同的结构：
 * - 顶层字段 + data嵌套字段（v2/v3兼容）
 * - regex_scripts在data.extensions中
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.resolve(ROOT_DIR, 'dist')

// ==================== CDN配置 ====================
const CDN_BASE = 'https://testingcf.jsdelivr.net/gh/TianyiZhuge/tiqu@master/extensions/telain-rpg'

// ==================== 生成角色卡 ====================
function generateCharacterCard() {
  // first_mes使用占位符标签（与哥布林巢穴相同使用\r\n）
  const firstMes = '<TelainUI>\r\n游戏界面加载中...\r\n</TelainUI>'

  // 与哥布林巢穴完全相同的regex_scripts配置
  const regexScripts = [
    {
      id: randomUUID(),
      scriptName: '删除UI标签-Prompt',
      findRegex: '<TelainUI>[\\s\\S]*?<\\/TelainUI>',
      replaceString: '',
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: false,
      promptOnly: true,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null
    },
    {
      id: randomUUID(),
      scriptName: '渲染游戏UI-Display',
      findRegex: '<TelainUI>[\\s\\S]*?<\\/TelainUI>',
      replaceString: '```\n<body>\n<script>\n$("body").load("' + CDN_BASE + '/dist/index.html");\n</script>\n</body>\n```',
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: true,
      promptOnly: false,
      runOnEdit: false,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null
    }
  ]

  // 与哥布林巢穴完全相同的结构
  return {
    // ===== 顶层字段（v2兼容）=====
    name: '特莱恩大陆',
    description: '',
    personality: '',
    scenario: '',
    first_mes: firstMes,
    mes_example: '',
    creatorcomment: '',
    avatar: 'none',
    talkativeness: '0.5',
    fav: false,
    tags: [],

    // ===== v3规范 =====
    spec: 'chara_card_v3',
    spec_version: '3.0',

    // ===== data嵌套（v3格式）=====
    data: {
      name: '特莱恩大陆',
      description: '',
      personality: '',
      scenario: '',
      first_mes: firstMes,
      mes_example: '',
      creator_notes: '',
      system_prompt: '',
      post_history_instructions: '',
      tags: [],
      creator: '',
      character_version: '',
      alternate_greetings: [],
      extensions: {
        talkativeness: '0.5',
        fav: false,
        world: '',
        depth_prompt: {
          prompt: '',
          depth: 4,
          role: 'system'
        },
        regex_scripts: regexScripts
      }
    }
  }
}

// ==================== 主函数 ====================
function main() {
  console.log('Building Telain RPG character card v7...')
  console.log('Strategy: Exact same structure as GoblinGame')
  console.log('')

  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true })
  }

  const card = generateCharacterCard()

  const outputPath = path.join(DIST_DIR, '特莱恩大陆.json')
  fs.writeFileSync(outputPath, JSON.stringify(card, null, 2), 'utf-8')

  const rootOutputPath = path.resolve(ROOT_DIR, '..', '..', '特莱恩大陆.json')
  fs.writeFileSync(rootOutputPath, JSON.stringify(card, null, 2), 'utf-8')

  console.log('Output files:')
  console.log(`  ${outputPath}`)
  console.log(`  ${rootOutputPath}`)
  console.log('')
  console.log('Done!')
}

main()
