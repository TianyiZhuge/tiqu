# 特莱恩大陆 - 主界面架构设计文档

## 1. 项目定位

### 1.1 本质
这是一个**SillyTavern角色卡**，通过状态栏HTML注入实现独立游戏前端。

### 1.2 技术路线
```
┌─────────────────────────────────────────────────────────────┐
│                    SillyTavern 角色卡                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐  │
│   │   预设      │   │  Lorebook   │   │   状态栏HTML    │  │
│   │  (Preset)   │   │  (世界书)    │   │  (游戏前端)     │  │
│   └─────────────┘   └─────────────┘   └─────────────────┘  │
│         │                 │                   │             │
│         ▼                 ▼                   ▼             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              SillyTavern 运行时环境                  │  │
│   │  • LLM API调用 (使用ST配置)                          │  │
│   │  • 聊天元数据存储 (chatMetadata)                     │  │
│   │  • DOM注入 (状态栏渲染)                              │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 核心约束
| 约束项 | 说明 |
|--------|------|
| 运行环境 | SillyTavern 状态栏区域 |
| LLM调用 | 使用ST现有配置，无需独立API |
| 状态存储 | ST chatMetadata (预留扩展接口) |
| 输出格式 | JSON角色卡 (可直接导入ST) |

---

## 2. 角色卡结构

### 2.1 JSON结构概览
```json
{
  "name": "特莱恩大陆",
  "description": "{{char}}是特莱恩大陆的游戏主持人...",
  "personality": "",
  "scenario": "",
  "first_mes": "【游戏初始化叙事】",
  "mes_example": "",
  "system_prompt": "【游戏规则和输出格式指令】",
  "post_history_instructions": "",
  "tags": ["game", "rpg", "telain"],
  "creator": "",
  "character_version": "1.0.0",

  "extensions": {
    "world": "特莱恩大陆世界书",
    "depth_prompt": {
      "prompt": "",
      "depth": 4
    }
  },

  "data": {
    "extensions": {
      "customCSS": "【游戏样式CSS】",
      "customJS": "【游戏逻辑JS - Vue应用】"
    }
  }
}
```

### 2.2 状态栏注入机制

ST状态栏通过特定的HTML标记渲染，游戏前端将注入到这个区域：

```
用户消息 → LLM响应 → 状态栏渲染
                         │
                         ▼
              ┌─────────────────────┐
              │  <div id="game-ui"> │  ← 游戏前端挂载点
              │    Vue App Mount   │
              └─────────────────────┘
```

---

## 3. 主界面模块架构

### 3.1 模块划分原则
- **单一职责**：每个模块只负责一个功能
- **松耦合**：模块间通过事件/状态通信
- **可替换**：任何模块可独立修改或替换
- **渐进增强**：核心功能优先，装饰性功能可选

### 3.2 主界面模块结构
```
┌─────────────────────────────────────────────────────────────┐
│                      MainView (主界面容器)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                 HeaderBar (顶部信息栏)                  │ │
│  │  • 游戏标题  • 当前位置  • 快捷资源显示                 │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                 StoryPanel (叙事面板)                   │ │
│  │  ┌─────────────────────────────────────────────────┐  │ │
│  │  │            StoryDisplay (叙事展示区)             │  │ │
│  │  │  • 历史消息列表                                  │  │ │
│  │  │  • 当前叙事 (打字机效果)                         │  │ │
│  │  │  • 对话气泡 (NPC对话)                           │  │ │
│  │  └─────────────────────────────────────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────────┐  │ │
│  │  │            ActionPanel (行动面板)               │  │ │
│  │  │  • 预设行动选项按钮                             │  │ │
│  │  │  • 自定义输入框                                 │  │ │
│  │  │  • 战斗入口按钮 (条件显示)                      │  │ │
│  │  └─────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                 BottomNav (底部导航栏)                  │ │
│  │  [主界面] [调教] [征服] [编制] [发展]                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              BattleOverlay (战斗覆盖层)                 │ │
│  │  • 条件渲染：当 battleState.isActive = true           │ │
│  │  • 独立战斗系统 (后续实现)                            │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 模块职责定义

| 模块 | 职责 | 输入 | 输出 |
|------|------|------|------|
| **MainView** | 容器，协调子模块 | 全局状态 | 渲染子组件 |
| **HeaderBar** | 显示游戏基本信息 | gameState | UI渲染 |
| **StoryPanel** | 叙事内容容器 | - | 包含子组件 |
| **StoryDisplay** | 渲染叙事文本 | storyMessages | 文本渲染 |
| **ActionPanel** | 用户交互入口 | actionOptions | 用户行动事件 |
| **BottomNav** | 页面切换导航 | currentTab | tab切换事件 |
| **BattleOverlay** | 战斗界面 | battleState | 战斗结果 |

---

## 4. 状态管理设计

### 4.1 状态分层
```
┌─────────────────────────────────────────────────────────────┐
│                       状态管理架构                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Layer 1: UI状态 (临时，不持久化)                          │
│   ┌─────────────────────────────────────────────────────┐  │
│   │ • currentTab: 当前标签页                             │  │
│   │ • isLoading: 加载状态                                │  │
│   │ • isTyping: 打字机动画状态                           │  │
│   │ • showBattleOverlay: 战斗面板显示                    │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   Layer 2: 游戏状态 (需持久化到chatMetadata)                │
│   ┌─────────────────────────────────────────────────────┐  │
│   │ • storyMessages: 叙事消息历史                        │  │
│   │ • actionOptions: 当前可选行动                        │  │
│   │ • gameProgress: 游戏进度 (章节、位置)                │  │
│   │ • resources: 资源数据 (金币、补给)                   │  │
│   │ • army: 军队数据 (将领、部队)                        │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   Layer 3: 战斗状态 (战斗期间临时状态)                      │
│   ┌─────────────────────────────────────────────────────┐  │
│   │ • battleConfig: 战斗配置 (来自LLM)                   │  │
│   │ • currentTurn: 当前回合                              │  │
│   │ • turnOrder: 行动顺序                                │  │
│   │ • battleLog: 战斗日志                                │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 状态接口定义

```typescript
// 类型定义 (供参考，实际用JS实现)

interface UIState {
  currentTab: 'main' | 'training' | 'conquest' | 'formation' | 'development';
  isLoading: boolean;
  isTyping: boolean;
  notifications: Notification[];
}

interface GameState {
  // 叙事
  storyMessages: StoryMessage[];
  actionOptions: ActionOption[];

  // 进度
  progress: {
    chapter: number;
    location: string;
    mainQuest: string;
  };

  // 资源
  resources: {
    gold: number;
    supplies: number;
  };

  // 军队 (简化版，详细版在编制模块)
  army: {
    totalUnits: number;
    commanders: CommanderSummary[];
  };
}

interface StoryMessage {
  id: string;
  type: 'narration' | 'dialogue' | 'system';
  content: string;
  speaker?: string;      // 对话时的说话者
  timestamp: number;
}

interface ActionOption {
  id: string;
  label: string;         // 按钮显示文本
  action: string;        // 发送给LLM的行动描述
  type?: 'normal' | 'battle' | 'important';
}

interface BattleState {
  isActive: boolean;
  config: BattleConfig | null;
  currentTurn: number;
  phase: 'prepare' | 'player_turn' | 'enemy_turn' | 'result';
  log: BattleLogEntry[];
}
```

### 4.3 状态存储适配器

为了预留扩展空间，状态存储通过适配器模式实现：

```
┌─────────────────────────────────────────────────────────────┐
│                     StateManager                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   save(state) ──────┬──────────────────────────────────────│
│                     │                                       │
│                     ▼                                       │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              StorageAdapter (接口)                   │  │
│   │  • save(key, data): void                            │  │
│   │  • load(key): data                                  │  │
│   │  • clear(key): void                                 │  │
│   └─────────────────────────────────────────────────────┘  │
│                     │                                       │
│        ┌────────────┼────────────┐                         │
│        ▼            ▼            ▼                         │
│   ┌─────────┐ ┌──────────┐ ┌──────────┐                   │
│   │ ST Meta │ │ Local    │ │ Export   │                   │
│   │ Adapter │ │ Storage  │ │ /Import  │                   │
│   │ (默认)  │ │ Adapter  │ │ Adapter  │                   │
│   └─────────┘ └──────────┘ └──────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. LLM通信协议

### 5.1 通信流程
```
用户行动 → 构建Prompt → ST发送 → LLM响应 → 解析响应 → 更新状态 → 渲染UI
   │                                              │
   │                                              │
   └────── ActionPanel ◄──────────────────────────┘
```

### 5.2 Prompt构建格式

游戏状态会被注入到发送给LLM的消息中：

```
[游戏状态]
位置: {{progress.location}}
金币: {{resources.gold}} | 补给: {{resources.supplies}}
军队: {{army.summary}}
当前任务: {{progress.mainQuest}}

[玩家行动]
{{userAction}}

---
请根据玩家行动继续叙事。
```

### 5.3 LLM响应格式规范

LLM需要按照特定格式输出，便于前端解析：

```markdown
【普通叙事响应】

*叙事文本内容...*

「NPC名字」"对话内容..."

[选项]
- 选项1文本
- 选项2文本
- 选项3文本
[/选项]

---

【战斗触发响应】

*叙事描述战斗开始的情景...*

[战斗配置]
敌方:
  - 将领: 敌将名称
    部队: 兵种名称
    数量: 20
    属性: {atk: 8, def: 4, spd: 6}
我方:
  - 使用玩家当前军队配置
背景: 战斗背景描述
胜利条件: 击败所有敌人
[/战斗配置]

[选项]
- ⚔️ 开始战斗
[/选项]

---

【状态变化响应】

*叙事文本...*

[状态变化]
gold: +50
supplies: -10
[/状态变化]

[选项]
- 继续前进
- 返回村庄
[/选项]
```

### 5.4 响应解析器

```javascript
// ResponseParser 模块职责
const ResponseParser = {
  parse(response) {
    return {
      narrative: this.extractNarrative(response),
      dialogues: this.extractDialogues(response),
      options: this.extractOptions(response),
      battleConfig: this.extractBattleConfig(response),
      stateChanges: this.extractStateChanges(response)
    };
  },

  extractNarrative(response) { /* ... */ },
  extractDialogues(response) { /* ... */ },
  extractOptions(response) { /* ... */ },
  extractBattleConfig(response) { /* ... */ },
  extractStateChanges(response) { /* ... */ }
};
```

---

## 6. 组件实现规范

### 6.1 组件文件结构
```
src/
├── components/
│   ├── MainView/
│   │   ├── index.vue           # 主容器
│   │   ├── HeaderBar.vue       # 顶部信息栏
│   │   ├── StoryPanel/
│   │   │   ├── index.vue       # 叙事面板容器
│   │   │   ├── StoryDisplay.vue    # 叙事展示
│   │   │   ├── StoryMessage.vue    # 单条消息组件
│   │   │   └── ActionPanel.vue     # 行动面板
│   │   └── BattleOverlay/
│   │       └── index.vue       # 战斗覆盖层 (预留)
│   │
│   ├── BottomNav/
│   │   └── index.vue           # 底部导航
│   │
│   └── common/                 # 通用组件
│       ├── GameButton.vue      # 游戏风格按钮
│       ├── GamePanel.vue       # 游戏风格面板
│       └── TypewriterText.vue  # 打字机效果
│
├── stores/
│   ├── uiStore.js              # UI状态
│   ├── gameStore.js            # 游戏状态
│   └── battleStore.js          # 战斗状态 (预留)
│
├── services/
│   ├── StateManager.js         # 状态管理器
│   ├── ResponseParser.js       # 响应解析器
│   └── STBridge.js             # ST通信桥接
│
└── utils/
    ├── constants.js            # 常量定义
    └── helpers.js              # 工具函数
```

### 6.2 组件通信规范

```
┌─────────────────────────────────────────────────────────────┐
│                      组件通信方式                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  父 → 子: Props                                             │
│  ┌─────────┐  props   ┌─────────┐                          │
│  │ Parent  │ ──────▶  │  Child  │                          │
│  └─────────┘          └─────────┘                          │
│                                                             │
│  子 → 父: Events                                            │
│  ┌─────────┐  $emit   ┌─────────┐                          │
│  │  Child  │ ──────▶  │ Parent  │                          │
│  └─────────┘          └─────────┘                          │
│                                                             │
│  跨组件: Pinia Store                                        │
│  ┌─────────┐          ┌─────────┐                          │
│  │ Comp A  │ ◀──────▶ │ Comp B  │                          │
│  └────┬────┘          └────┬────┘                          │
│       │    ┌─────────┐     │                               │
│       └───▶│  Store  │◀────┘                               │
│            └─────────┘                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. 样式设计规范

### 7.1 CSS变量定义
```css
:root {
  /* 配色 - 日式异世界风格 */
  --color-bg-primary: #1A0E08;      /* 深棕色背景 */
  --color-bg-secondary: #2C1810;    /* 次级背景 */
  --color-bg-panel: #3D261A;        /* 面板背景 */

  --color-accent: #D4AF37;          /* 金色强调 */
  --color-accent-light: #E8C860;    /* 浅金色 */

  --color-text-primary: #E8DCC4;    /* 主文字色 */
  --color-text-secondary: #A89880;  /* 次文字色 */

  --color-border: #5C4030;          /* 边框色 */
  --color-border-gold: #8B7355;     /* 金色边框 */

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* 字体 */
  --font-primary: 'Noto Serif SC', serif;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
}
```

### 7.2 组件样式隔离

每个组件使用 `scoped` 样式，避免污染全局：

```vue
<style scoped>
.story-panel {
  /* 组件内样式 */
}
</style>
```

---

## 8. 数据流图

### 8.1 用户行动数据流
```
┌─────────────────────────────────────────────────────────────┐
│                     用户行动数据流                           │
└─────────────────────────────────────────────────────────────┘

  ┌──────────────┐
  │ ActionPanel  │
  │  (用户点击)   │
  └──────┬───────┘
         │ emit('action', actionData)
         ▼
  ┌──────────────┐
  │  MainView    │
  │  (处理行动)   │
  └──────┬───────┘
         │ 1. 更新UI状态 (loading)
         │ 2. 构建Prompt
         ▼
  ┌──────────────┐
  │  STBridge    │
  │  (发送到ST)   │
  └──────┬───────┘
         │ ST内部处理，调用LLM
         ▼
  ┌──────────────┐
  │  LLM响应     │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ ResponseParser│
  │  (解析响应)   │
  └──────┬───────┘
         │ 解析出: narrative, options, battleConfig, stateChanges
         ▼
  ┌──────────────┐
  │  gameStore   │
  │  (更新状态)   │
  └──────┬───────┘
         │ 状态变化触发响应式更新
         ▼
  ┌──────────────┐
  │ StoryDisplay │
  │  (渲染叙事)   │
  └──────────────┘
```

### 8.2 战斗触发数据流
```
LLM响应包含[战斗配置]
         │
         ▼
  ResponseParser检测到battleConfig
         │
         ▼
  gameStore.setBattleConfig(config)
         │
         ▼
  ActionPanel显示"开始战斗"按钮
         │
         ▼
  用户点击"开始战斗"
         │
         ▼
  battleStore.startBattle(config)
         │
         ▼
  BattleOverlay显示 (isActive = true)
```

---

## 9. 错误处理

### 9.1 错误分类
| 错误类型 | 处理方式 |
|----------|----------|
| LLM响应解析失败 | 显示原始文本，记录日志 |
| ST通信失败 | 显示重试按钮 |
| 状态存储失败 | 显示警告，保留内存状态 |
| 组件渲染错误 | 错误边界捕获，显示回退UI |

### 9.2 错误边界
```vue
<!-- ErrorBoundary.vue -->
<template>
  <slot v-if="!error" />
  <div v-else class="error-fallback">
    <p>出现了一些问题</p>
    <button @click="retry">重试</button>
  </div>
</template>
```

---

## 10. 角色卡输出结构

### 10.1 最终JSON结构
```json
{
  "spec": "chara_card_v2",
  "spec_version": "2.0",
  "data": {
    "name": "特莱恩大陆",
    "description": "你是特莱恩大陆的游戏主持人，负责叙述故事、扮演NPC、生成战斗配置。",
    "personality": "",
    "scenario": "玩家穿越到特莱恩大陆，成为一名佣兵团长，拥有指挥军队的能力。",
    "first_mes": "{{gameInitHTML}}",
    "mes_example": "",
    "creator_notes": "日式异世界RPG游戏 - 将领+部队战斗系统",
    "system_prompt": "{{gameSystemPrompt}}",
    "post_history_instructions": "",
    "tags": ["game", "rpg", "battle", "isekai"],
    "creator": "nova-creator",
    "character_version": "1.0.0",
    "extensions": {
      "telain_game": {
        "version": "1.0.0",
        "styles": "{{compiledCSS}}",
        "scripts": "{{compiledJS}}",
        "initialState": {
          "progress": {
            "chapter": 1,
            "location": "边境村庄"
          },
          "resources": {
            "gold": 100,
            "supplies": 10
          }
        }
      }
    }
  }
}
```

### 10.2 构建流程
```
Vue源码 → Vite构建 → 单文件HTML/CSS/JS → 注入角色卡JSON → 输出.json文件
```

---

## 11. 测试验证

### 11.1 开发阶段测试
1. **独立运行测试**: `npm run dev` 在浏览器中测试UI
2. **组件单元测试**: 验证各组件独立功能
3. **状态管理测试**: 验证状态更新和持久化

### 11.2 集成测试
1. **构建角色卡**: `npm run build:card`
2. **导入ST**: 在SillyTavern中导入生成的JSON
3. **完整流程测试**: 验证LLM通信、叙事渲染、行动响应

### 11.3 验证清单
- [ ] 主界面正确渲染
- [ ] 叙事文本正常显示
- [ ] 行动选项可点击
- [ ] LLM响应正确解析
- [ ] 状态正确保存/加载
- [ ] 底部导航切换正常
- [ ] 战斗入口按钮条件显示

---

## 12. 后续扩展预留

### 12.1 模块扩展点
| 模块 | 扩展方式 |
|------|----------|
| 调教 | 新增 TrainingView 组件 |
| 征服 | 新增 ConquestView 组件 |
| 编制 | 新增 FormationView 组件 |
| 发展 | 新增 DevelopmentView 组件 |
| 战斗 | 完善 BattleOverlay 组件 |

### 12.2 存储扩展点
通过 StorageAdapter 接口，可扩展：
- localStorage 本地存储
- IndexedDB 大数据存储
- 云端存储 API
- 导入/导出文件

---

## 附录A: 文件清单

| 文件路径 | 职责 | 优先级 |
|----------|------|--------|
| `src/App.vue` | 应用根组件 | P0 |
| `src/main.js` | 应用入口 | P0 |
| `src/components/MainView/index.vue` | 主界面容器 | P0 |
| `src/components/MainView/StoryPanel/StoryDisplay.vue` | 叙事展示 | P0 |
| `src/components/MainView/StoryPanel/ActionPanel.vue` | 行动面板 | P0 |
| `src/components/BottomNav/index.vue` | 底部导航 | P0 |
| `src/stores/gameStore.js` | 游戏状态 | P0 |
| `src/stores/uiStore.js` | UI状态 | P0 |
| `src/services/ResponseParser.js` | 响应解析 | P0 |
| `src/services/STBridge.js` | ST通信 | P0 |
| `src/components/MainView/HeaderBar.vue` | 顶部信息栏 | P1 |
| `src/components/common/TypewriterText.vue` | 打字机效果 | P1 |
| `src/stores/battleStore.js` | 战斗状态 | P2 |
| `src/components/MainView/BattleOverlay/index.vue` | 战斗覆盖层 | P2 |
