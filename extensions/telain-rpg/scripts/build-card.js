/**
 * 特莱恩大陆 - 角色卡构建脚本 v8
 * 使用与哥布林巢穴完全相同的结构：
 * - 顶层字段 + data嵌套字段（v2/v3兼容）
 * - regex_scripts在data.extensions中
 * - TavernHelper_scripts自动注册全局regex（绕过角色regex白名单）
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

// ==================== 生成全局Regex注册脚本 ====================
function generateRegexLoaderScript() {
  // 这个脚本会在角色激活时自动注册全局regex，绕过角色regex白名单限制
  return `$(() => {
  const UI_URL = '${CDN_BASE}/dist/index.html';

  // 使用TavernHelper API注册全局regex
  updateTavernRegexesWith((regexes) => {
    // 移除旧的同名regex
    const filtered = regexes.filter(r => r.script_name !== 'TelainRPG-UI-Display' && r.script_name !== 'TelainRPG-UI-Prompt');

    // 添加 Prompt 清除规则
    filtered.push({
      id: 'telain-rpg-prompt-' + Date.now(),
      script_name: 'TelainRPG-UI-Prompt',
      enabled: true,
      run_on_edit: true,
      scope: 'global',
      find_regex: '<TelainUI>[\\\\s\\\\S]*?<\\\\/TelainUI>',
      replace_string: '',
      source: {
        user_input: false,
        ai_output: true,
        slash_command: false,
        world_info: false,
      },
      destination: {
        display: false,
        prompt: true,
      },
      min_depth: null,
      max_depth: null,
    });

    // 添加 Display 渲染规则
    filtered.push({
      id: 'telain-rpg-display-' + Date.now(),
      script_name: 'TelainRPG-UI-Display',
      enabled: true,
      run_on_edit: false,
      scope: 'global',
      find_regex: '<TelainUI>[\\\\s\\\\S]*?<\\\\/TelainUI>',
      replace_string: '\`\`\`\\n<body>\\n<script>\\n$("body").load("' + UI_URL + '");\\n</script>\\n</body>\\n\`\`\`',
      source: {
        user_input: false,
        ai_output: true,
        slash_command: false,
        world_info: false,
      },
      destination: {
        display: true,
        prompt: false,
      },
      min_depth: null,
      max_depth: null,
    });

    return filtered;
  }, { scope: 'global' });

  console.log('[Telain RPG] Global regex registered successfully');
});`
}

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
        regex_scripts: regexScripts,
        // TavernHelper脚本 - 自动注册全局regex
        TavernHelper_scripts: [
          {
            id: randomUUID(),
            name: 'TelainRPG-RegexLoader',
            enabled: true,
            content: generateRegexLoaderScript(),
            button: {
              enabled: false,
              buttons: []
            }
          }
        ]
      }
    }
  }
}

// ==================== 主函数 ====================
function main() {
  console.log('Building Telain RPG character card v8...')
  console.log('Strategy: TavernHelper_scripts for auto global regex registration')
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
