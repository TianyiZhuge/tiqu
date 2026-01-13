# 主界面实现架构

## 概述

主界面是游戏的核心交互区域，负责：
1. **故事展示** - 显示LLM生成的叙事文本
2. **行动选择** - 提供玩家可选的行动选项
3. **战斗入口** - 条件性显示战斗按钮，展开战斗面板
4. **自定义输入** - 允许玩家输入自定义行动

---

## 目录结构

```
src/
├── App.vue                          # 应用根组件
├── main.js                          # 入口文件
│
├── assets/
│   ├── styles/
│   │   ├── variables.scss           # CSS变量定义
│   │   ├── mixins.scss              # SCSS混合
│   │   ├── base.scss                # 基础样式
│   │   ├── animations.scss          # 动画定义
│   │   └── components.scss          # 组件通用样式
│   │
│   ├── images/
│   │   ├── backgrounds/             # 背景图片
│   │   ├── borders/                 # 边框装饰SVG
│   │   ├── icons/                   # 图标
│   │   └── patterns/                # 纹理图案
│   │
│   └── fonts/                       # 字体文件
│
├── components/
│   ├── common/                      # 通用组件
│   │   ├── GoldBorder.vue
│   │   ├── ParchmentPanel.vue
│   │   ├── OrnamentDivider.vue
│   │   ├── MagicButton.vue
│   │   ├── StatusBar.vue
│   │   └── LoadingMagicCircle.vue
│   │
│   ├── layout/                      # 布局组件
│   │   ├── AppContainer.vue
│   │   ├── BottomNavBar.vue
│   │   └── TopInfoBar.vue
│   │
│   └── battle/                      # 战斗相关组件
│       ├── BattlePanel.vue
│       ├── UnitCard.vue
│       ├── BattleLog.vue
│       └── ActionMenu.vue
│
├── views/
│   ├── MainView.vue                 # 主界面
│   ├── TrainingView.vue             # 调教界面（预留）
│   ├── ConquestView.vue             # 征服界面（预留）
│   ├── FormationView.vue            # 编制界面（预留）
│   └── DevelopmentView.vue          # 发展界面（预留）
│
├── stores/                          # Pinia状态管理
│   ├── index.js
│   ├── gameStore.js                 # 游戏状态
│   ├── battleStore.js               # 战斗状态
│   └── uiStore.js                   # UI状态
│
├── composables/                     # 组合式函数
│   ├── useLLM.js                    # LLM通信
│   ├── useBattle.js                 # 战斗逻辑
│   ├── useTypewriter.js             # 打字机效果
│   └── useAudio.js                  # 音效控制
│
├── services/
│   ├── SillyTavernBridge.js         # ST通信桥接
│   └── GameDataService.js           # 游戏数据服务
│
└── utils/
    ├── constants.js                 # 常量定义
    ├── helpers.js                   # 工具函数
    └── validators.js                # 验证函数
```

---

## 核心组件详解

### 1. App.vue - 应用根组件

```vue
<template>
  <div id="telain-app" class="telain-container">
    <!-- 背景层 -->
    <div class="app-background">
      <div class="bg-overlay"></div>
      <div class="bg-particles"></div>
    </div>

    <!-- 主内容区 -->
    <div class="app-content">
      <!-- 顶部信息栏 -->
      <TopInfoBar />

      <!-- 页面内容（路由视图） -->
      <main class="main-content">
        <Transition name="page" mode="out-in">
          <component :is="currentView" />
        </Transition>
      </main>

      <!-- 底部导航栏 -->
      <BottomNavBar v-model="currentTab" />
    </div>

    <!-- 全局遮罩层（战斗、弹窗等） -->
    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="showOverlay" class="global-overlay">
          <slot name="overlay"></slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'

import TopInfoBar from '@/components/layout/TopInfoBar.vue'
import BottomNavBar from '@/components/layout/BottomNavBar.vue'

// Views
import MainView from '@/views/MainView.vue'
import TrainingView from '@/views/TrainingView.vue'
import ConquestView from '@/views/ConquestView.vue'
import FormationView from '@/views/FormationView.vue'
import DevelopmentView from '@/views/DevelopmentView.vue'

const gameStore = useGameStore()
const uiStore = useUIStore()

const currentTab = ref('main')

const viewMap = {
  main: MainView,
  training: TrainingView,
  conquest: ConquestView,
  formation: FormationView,
  development: DevelopmentView
}

const currentView = computed(() => viewMap[currentTab.value])
const showOverlay = computed(() => uiStore.hasActiveOverlay)

// 提供全局注入
provide('gameStore', gameStore)
provide('uiStore', uiStore)
</script>
```

---

### 2. MainView.vue - 主界面组件

```vue
<template>
  <div class="main-view">
    <!-- 故事展示区域 -->
    <section class="story-section">
      <ParchmentPanel class="story-panel">
        <OrnamentDivider type="top" />

        <!-- 故事内容滚动区 -->
        <div ref="storyContainer" class="story-content" @scroll="onScroll">
          <!-- 历史消息 -->
          <div
            v-for="(message, index) in storyMessages"
            :key="index"
            class="story-message"
            :class="message.type"
          >
            <div v-if="message.type === 'narration'" class="narration-text">
              <TypewriterText
                v-if="index === storyMessages.length - 1 && isTyping"
                :text="message.content"
                @complete="onTypeComplete"
              />
              <span v-else v-html="formatText(message.content)"></span>
            </div>

            <div v-else-if="message.type === 'dialogue'" class="dialogue-block">
              <span class="speaker-name">{{ message.speaker }}</span>
              <span class="dialogue-text">"{{ message.content }}"</span>
            </div>

            <div v-else-if="message.type === 'system'" class="system-message">
              <IconBadge icon="info" />
              <span>{{ message.content }}</span>
            </div>
          </div>

          <!-- 加载指示器 -->
          <div v-if="isLoading" class="loading-indicator">
            <LoadingMagicCircle />
            <span>正在思考...</span>
          </div>
        </div>

        <OrnamentDivider type="bottom" />
      </ParchmentPanel>
    </section>

    <!-- 行动选项区域 -->
    <section class="action-section">
      <GoldBorder class="action-panel">
        <!-- 预设行动选项 -->
        <div class="action-options" v-if="actionOptions.length > 0">
          <MagicButton
            v-for="(option, index) in actionOptions"
            :key="index"
            :disabled="isLoading"
            @click="selectAction(option)"
          >
            <span class="option-icon">◈</span>
            {{ option.label }}
          </MagicButton>
        </div>

        <!-- 战斗入口按钮 -->
        <Transition name="battle-btn">
          <MagicButton
            v-if="showBattleButton"
            variant="battle"
            class="battle-trigger-btn"
            @click="openBattle"
          >
            <span class="battle-icon">⚔️</span>
            开始战斗
            <span class="battle-icon">⚔️</span>
          </MagicButton>
        </Transition>

        <!-- 自定义输入 -->
        <div class="custom-input-area">
          <div class="input-wrapper">
            <input
              v-model="customInput"
              type="text"
              placeholder="输入自定义行动..."
              :disabled="isLoading"
              @keyup.enter="submitCustomAction"
            />
            <MagicButton
              variant="small"
              :disabled="!customInput.trim() || isLoading"
              @click="submitCustomAction"
            >
              发送
            </MagicButton>
          </div>
        </div>
      </GoldBorder>
    </section>

    <!-- 战斗面板（覆盖层） -->
    <Transition name="battle-panel">
      <BattlePanel
        v-if="isBattleActive"
        :battle-config="currentBattleConfig"
        @close="closeBattle"
        @complete="onBattleComplete"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

// Components
import ParchmentPanel from '@/components/common/ParchmentPanel.vue'
import GoldBorder from '@/components/common/GoldBorder.vue'
import OrnamentDivider from '@/components/common/OrnamentDivider.vue'
import MagicButton from '@/components/common/MagicButton.vue'
import IconBadge from '@/components/common/IconBadge.vue'
import LoadingMagicCircle from '@/components/common/LoadingMagicCircle.vue'
import TypewriterText from '@/components/common/TypewriterText.vue'
import BattlePanel from '@/components/battle/BattlePanel.vue'

// Stores
import { useGameStore } from '@/stores/gameStore'
import { useBattleStore } from '@/stores/battleStore'

// Composables
import { useLLM } from '@/composables/useLLM'
import { useTypewriter } from '@/composables/useTypewriter'

// Store refs
const gameStore = useGameStore()
const battleStore = useBattleStore()
const { storyMessages, actionOptions, currentBattleConfig } = storeToRefs(gameStore)
const { isBattleActive } = storeToRefs(battleStore)

// LLM composable
const { generateNarrative, isLoading } = useLLM()

// Local state
const storyContainer = ref(null)
const customInput = ref('')
const isTyping = ref(false)

// Computed
const showBattleButton = computed(() => {
  return currentBattleConfig.value !== null && !isBattleActive.value
})

// Methods
const formatText = (text) => {
  // 转换 *斜体* 和 **粗体**
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

const selectAction = async (option) => {
  isTyping.value = true
  await generateNarrative(option.action)
  scrollToBottom()
}

const submitCustomAction = async () => {
  if (!customInput.value.trim() || isLoading.value) return

  const action = customInput.value.trim()
  customInput.value = ''

  isTyping.value = true
  await generateNarrative(action)
  scrollToBottom()
}

const onTypeComplete = () => {
  isTyping.value = false
}

const scrollToBottom = () => {
  nextTick(() => {
    if (storyContainer.value) {
      storyContainer.value.scrollTop = storyContainer.value.scrollHeight
    }
  })
}

const onScroll = () => {
  // 可以添加滚动相关逻辑，如"显示返回底部"按钮
}

const openBattle = () => {
  battleStore.startBattle(currentBattleConfig.value)
}

const closeBattle = () => {
  battleStore.pauseBattle()
}

const onBattleComplete = (result) => {
  battleStore.endBattle(result)
  // 战斗结果会触发LLM继续叙事
  generateNarrative(`[战斗结果]\n${JSON.stringify(result)}`)
}

// 初始化
onMounted(() => {
  scrollToBottom()
})

// 监听新消息，自动滚动
watch(storyMessages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style lang="scss" scoped>
.main-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

.story-section {
  flex: 1;
  min-height: 0;
  overflow: hidden;

  .story-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .story-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);

    /* 自定义滚动条 */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: var(--color-bg-primary);
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-border-gold);
      border-radius: 4px;
    }
  }
}

.story-message {
  margin-bottom: var(--spacing-md);
  line-height: 1.8;

  &.narration {
    .narration-text {
      color: var(--color-text-primary);

      em {
        color: var(--color-accent-light);
        font-style: italic;
      }

      strong {
        color: var(--color-accent);
        font-weight: bold;
      }
    }
  }

  &.dialogue {
    .dialogue-block {
      padding-left: var(--spacing-md);
      border-left: 3px solid var(--color-accent);

      .speaker-name {
        color: var(--color-accent);
        font-weight: bold;
        margin-right: var(--spacing-sm);

        &::after {
          content: '：';
        }
      }

      .dialogue-text {
        color: var(--color-text-primary);
      }
    }
  }

  &.system {
    .system-message {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm);
      background: rgba(var(--color-info-rgb), 0.1);
      border-radius: var(--radius-sm);
      color: var(--color-info);
      font-size: var(--font-size-sm);
    }
  }
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.action-section {
  flex-shrink: 0;

  .action-panel {
    padding: var(--spacing-md);
  }

  .action-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .battle-trigger-btn {
    width: 100%;
    margin-bottom: var(--spacing-md);
    animation: pulse-glow 2s infinite;
  }

  .custom-input-area {
    .input-wrapper {
      display: flex;
      gap: var(--spacing-sm);

      input {
        flex: 1;
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--color-bg-primary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text-primary);
        font-size: var(--font-size-base);

        &::placeholder {
          color: var(--color-text-muted);
        }

        &:focus {
          outline: none;
          border-color: var(--color-accent);
        }

        &:disabled {
          opacity: 0.5;
        }
      }
    }
  }
}

/* 战斗按钮动画 */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 10px var(--color-danger);
  }
  50% {
    box-shadow: 0 0 25px var(--color-danger), 0 0 40px var(--color-danger);
  }
}

/* 过渡动画 */
.battle-btn-enter-active,
.battle-btn-leave-active {
  transition: all 0.3s ease;
}

.battle-btn-enter-from,
.battle-btn-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.battle-panel-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.battle-panel-leave-active {
  transition: all 0.3s ease;
}

.battle-panel-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.battle-panel-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
```

---

### 3. BottomNavBar.vue - 底部导航栏

```vue
<template>
  <nav class="bottom-nav-bar">
    <div class="nav-background">
      <!-- 装饰边框 -->
      <svg class="nav-border-top" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M0,10 L50,0 L100,10" fill="none" stroke="currentColor" stroke-width="2"/>
      </svg>
    </div>

    <div class="nav-items">
      <button
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: modelValue === item.id }"
        @click="selectTab(item.id)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>

        <!-- 选中指示器 -->
        <Transition name="indicator">
          <div v-if="modelValue === item.id" class="active-indicator">
            <div class="indicator-glow"></div>
          </div>
        </Transition>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'main'
  }
})

const emit = defineEmits(['update:modelValue'])

const navItems = ref([
  { id: 'main', icon: '📜', label: '主界面' },
  { id: 'training', icon: '💫', label: '调教' },
  { id: 'conquest', icon: '⚔️', label: '征服' },
  { id: 'formation', icon: '🏰', label: '编制' },
  { id: 'development', icon: '📈', label: '发展' }
])

const selectTab = (id) => {
  emit('update:modelValue', id)
}
</script>

<style lang="scss" scoped>
.bottom-nav-bar {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(
    180deg,
    var(--color-bg-secondary) 0%,
    var(--color-bg-primary) 100%
  );
}

.nav-background {
  position: absolute;
  inset: 0;
  overflow: hidden;

  .nav-border-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    color: var(--color-border-gold);
  }
}

.nav-items {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  .nav-icon {
    font-size: 24px;
    transition: transform 0.3s ease;
  }

  .nav-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    transition: color 0.3s ease;
  }

  &:hover {
    .nav-icon {
      transform: scale(1.1);
    }

    .nav-label {
      color: var(--color-text-primary);
    }
  }

  &.active {
    .nav-icon {
      transform: scale(1.2);
    }

    .nav-label {
      color: var(--color-accent);
      font-weight: bold;
    }
  }
}

.active-indicator {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;

  .indicator-glow {
    width: 100%;
    height: 100%;
    background: var(--color-accent);
    border-radius: 2px;
    box-shadow: 0 0 10px var(--color-accent);
  }
}

/* 指示器动画 */
.indicator-enter-active,
.indicator-leave-active {
  transition: all 0.3s ease;
}

.indicator-enter-from,
.indicator-leave-to {
  opacity: 0;
  transform: translateX(-50%) scaleX(0);
}
</style>
```

---

### 4. BattlePanel.vue - 战斗面板

```vue
<template>
  <div class="battle-panel-overlay">
    <div class="battle-panel">
      <!-- 战斗标题栏 -->
      <header class="battle-header">
        <GoldBorder class="header-content">
          <h2 class="battle-title">
            <span class="title-ornament">⚔️</span>
            战斗 - 回合 {{ currentTurn }}
            <span class="title-ornament">⚔️</span>
          </h2>
        </GoldBorder>
      </header>

      <!-- 战斗主体 -->
      <main class="battle-body">
        <!-- 敌方阵营 -->
        <section class="enemy-section">
          <div class="section-label">敌方阵营</div>
          <div class="units-row">
            <UnitCard
              v-for="enemy in enemies"
              :key="enemy.id"
              :unit="enemy"
              :is-enemy="true"
              :is-active="currentUnit?.id === enemy.id"
              :is-selectable="isSelectingTarget && !enemy.isDefeated"
              @click="selectTarget(enemy)"
            />
          </div>
        </section>

        <!-- 战斗日志 -->
        <section class="battle-log-section">
          <BattleLog :logs="battleLogs" />
        </section>

        <!-- 我方阵营 -->
        <section class="ally-section">
          <div class="section-label">我方阵营</div>
          <div class="units-row">
            <UnitCard
              v-for="ally in allies"
              :key="ally.id"
              :unit="ally"
              :is-enemy="false"
              :is-active="currentUnit?.id === ally.id"
              :is-current-turn="isPlayerTurn && currentUnit?.id === ally.id"
            />
          </div>
        </section>
      </main>

      <!-- 行动菜单 -->
      <footer class="battle-footer">
        <ActionMenu
          v-if="isPlayerTurn"
          :current-unit="currentUnit"
          :is-selecting-target="isSelectingTarget"
          @attack="startTargetSelection"
          @defend="executeDefend"
          @skill="openSkillMenu"
          @retreat="confirmRetreat"
          @cancel="cancelTargetSelection"
        />

        <div v-else class="enemy-turn-indicator">
          <LoadingMagicCircle size="small" />
          <span>敌方回合...</span>
        </div>
      </footer>

      <!-- 收起按钮 -->
      <button class="collapse-btn" @click="$emit('close')">
        <span>✕ 收起战斗面板</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'

import GoldBorder from '@/components/common/GoldBorder.vue'
import LoadingMagicCircle from '@/components/common/LoadingMagicCircle.vue'
import UnitCard from '@/components/battle/UnitCard.vue'
import BattleLog from '@/components/battle/BattleLog.vue'
import ActionMenu from '@/components/battle/ActionMenu.vue'

import { useBattleStore } from '@/stores/battleStore'
import { useBattle } from '@/composables/useBattle'

const props = defineProps({
  battleConfig: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'complete'])

const battleStore = useBattleStore()
const {
  enemies,
  allies,
  currentTurn,
  currentUnit,
  battleLogs,
  isPlayerTurn,
  isBattleOver
} = storeToRefs(battleStore)

const {
  initBattle,
  executeAttack,
  executeDefend,
  executeRetreat
} = useBattle()

// Local state
const isSelectingTarget = ref(false)
const selectedTarget = ref(null)

// Methods
const startTargetSelection = () => {
  isSelectingTarget.value = true
}

const cancelTargetSelection = () => {
  isSelectingTarget.value = false
  selectedTarget.value = null
}

const selectTarget = (target) => {
  if (!isSelectingTarget.value || target.isDefeated) return

  selectedTarget.value = target
  executeAttack(currentUnit.value, target)
  cancelTargetSelection()
}

const openSkillMenu = () => {
  // TODO: 技能菜单
}

const confirmRetreat = () => {
  if (confirm('确定要撤退吗？')) {
    executeRetreat()
  }
}

// 监听战斗结束
const checkBattleEnd = () => {
  if (isBattleOver.value) {
    emit('complete', battleStore.getBattleResult())
  }
}

// 初始化
onMounted(() => {
  initBattle(props.battleConfig)
})
</script>

<style lang="scss" scoped>
.battle-panel-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-overlay);
  backdrop-filter: blur(4px);
}

.battle-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: var(--spacing-md);
  background: var(--gradient-panel);
  border: 2px solid var(--color-border-gold);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.battle-header {
  padding: var(--spacing-md);

  .header-content {
    text-align: center;
    padding: var(--spacing-sm);
  }

  .battle-title {
    margin: 0;
    font-size: var(--font-size-xl);
    color: var(--color-accent);
    font-family: var(--font-title);

    .title-ornament {
      margin: 0 var(--spacing-sm);
    }
  }
}

.battle-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: var(--spacing-md);
  gap: var(--spacing-md);
}

.enemy-section,
.ally-section {
  .section-label {
    text-align: center;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-sm);
  }

  .units-row {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }
}

.battle-log-section {
  flex: 1;
  min-height: 100px;
  overflow: hidden;
}

.battle-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.enemy-turn-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.collapse-btn {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: var(--color-text-primary);
    border-color: var(--color-accent);
  }
}
</style>
```

---

### 5. UnitCard.vue - 单位卡牌

```vue
<template>
  <div
    class="unit-card"
    :class="{
      enemy: isEnemy,
      ally: !isEnemy,
      active: isActive,
      'current-turn': isCurrentTurn,
      defeated: unit.isDefeated,
      selectable: isSelectable
    }"
    @click="$emit('click')"
  >
    <!-- 卡牌边框装饰 -->
    <div class="card-border" :class="frameClass">
      <!-- 角落装饰 -->
      <div class="corner-ornament top-left">⚜️</div>
      <div class="corner-ornament top-right">⚜️</div>
      <div class="corner-ornament bottom-left">⚜️</div>
      <div class="corner-ornament bottom-right">⚜️</div>
    </div>

    <!-- 卡牌内容 -->
    <div class="card-content">
      <!-- 头像区域 -->
      <div class="portrait-area">
        <div
          class="portrait"
          :style="{ backgroundImage: `url(${unit.portrait || defaultPortrait})` }"
        >
          <!-- 兵种图标（无头像时显示） -->
          <span v-if="!unit.portrait" class="unit-icon">{{ unitIcon }}</span>
        </div>

        <!-- 击败遮罩 -->
        <div v-if="unit.isDefeated" class="defeated-overlay">
          <span>击败</span>
        </div>
      </div>

      <!-- 信息区域 -->
      <div class="info-area">
        <!-- 名称 -->
        <div class="unit-name">{{ unit.name }}</div>

        <!-- 属性 -->
        <div class="unit-stats">
          <span class="stat">攻{{ unit.unit.atk }}</span>
          <span class="stat">防{{ unit.unit.def }}</span>
          <span class="stat">速{{ unit.unit.spd }}</span>
        </div>

        <!-- 兵种和数量 -->
        <div class="unit-type">
          [{{ unit.unit.type }}×{{ unit.unit.currentCount }}]
        </div>

        <!-- HP条 -->
        <div class="hp-bar">
          <div
            class="hp-fill"
            :class="hpClass"
            :style="{ width: `${hpPercent}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 当前行动指示器 -->
    <Transition name="turn-indicator">
      <div v-if="isCurrentTurn" class="turn-indicator">
        <span class="indicator-arrow">▲</span>
        <span class="indicator-text">行动中</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  unit: {
    type: Object,
    required: true
  },
  isEnemy: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isCurrentTurn: {
    type: Boolean,
    default: false
  },
  isSelectable: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

// 默认头像
const defaultPortrait = '/images/portraits/default.png'

// 兵种图标映射
const unitIconMap = {
  '剑士': '⚔️',
  '弓箭手': '🏹',
  '骑兵': '🐴',
  '法师': '🔮',
  '牧师': '✨',
  '哥布林': '👹',
  '座狼': '🐺',
  '兽人': '👺',
  '骷髅兵': '💀'
}

const unitIcon = computed(() => unitIconMap[props.unit.unit.type] || '👤')

// 边框样式
const frameClass = computed(() => {
  const frame = props.unit.cardCustomization?.frame || 'normal'
  return `frame-${frame}`
})

// HP百分比
const hpPercent = computed(() => {
  const { currentCount, maxCount } = props.unit.unit
  return Math.round((currentCount / maxCount) * 100)
})

// HP条颜色
const hpClass = computed(() => {
  const percent = hpPercent.value
  if (percent <= 30) return 'critical'
  if (percent <= 60) return 'warning'
  return 'healthy'
})
</script>

<style lang="scss" scoped>
.unit-card {
  position: relative;
  width: 120px;
  cursor: default;
  transition: all 0.3s ease;

  &.selectable {
    cursor: pointer;

    &:hover {
      transform: scale(1.05);

      .card-border {
        border-color: var(--color-danger);
        box-shadow: 0 0 15px var(--color-danger);
      }
    }
  }

  &.active {
    .card-border {
      border-color: var(--color-accent);
    }
  }

  &.current-turn {
    transform: scale(1.05);

    .card-border {
      border-color: var(--color-accent);
      box-shadow: 0 0 20px var(--color-accent);
      animation: glow-pulse 2s infinite;
    }
  }

  &.defeated {
    opacity: 0.6;
    filter: grayscale(80%);
  }
}

.card-border {
  position: relative;
  background: var(--gradient-panel);
  border: 3px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  transition: all 0.3s ease;

  &.frame-normal {
    border-color: #8B7355;
  }

  &.frame-elite {
    border-color: #4169E1;
    box-shadow: 0 0 10px rgba(65, 105, 225, 0.3);
  }

  &.frame-legendary {
    border-color: #FFD700;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  }
}

.corner-ornament {
  position: absolute;
  font-size: 10px;
  color: var(--color-border-gold);
  opacity: 0.6;

  &.top-left { top: 2px; left: 2px; }
  &.top-right { top: 2px; right: 2px; }
  &.bottom-left { bottom: 2px; left: 2px; }
  &.bottom-right { bottom: 2px; right: 2px; }
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.portrait-area {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-bg-primary);

  .portrait {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .unit-icon {
      font-size: 32px;
    }
  }

  .defeated-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-danger);
    font-weight: bold;
  }
}

.info-area {
  text-align: center;

  .unit-name {
    font-size: var(--font-size-sm);
    font-weight: bold;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .unit-stats {
    display: flex;
    justify-content: center;
    gap: var(--spacing-xs);
    font-size: 10px;
    color: var(--color-text-secondary);

    .stat {
      background: var(--color-bg-primary);
      padding: 1px 4px;
      border-radius: 2px;
    }
  }

  .unit-type {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  }
}

.hp-bar {
  height: 6px;
  background: var(--color-bg-primary);
  border-radius: 3px;
  overflow: hidden;
  margin-top: var(--spacing-xs);

  .hp-fill {
    height: 100%;
    transition: width 0.3s ease;
    border-radius: 3px;

    &.healthy {
      background: linear-gradient(90deg, #4A7C59, #6B8E23);
    }

    &.warning {
      background: linear-gradient(90deg, #CC7722, #DAA520);
    }

    &.critical {
      background: linear-gradient(90deg, #8B0000, #CD5C5C);
    }
  }
}

.turn-indicator {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-accent);

  .indicator-arrow {
    font-size: 12px;
    animation: bounce 1s infinite;
  }

  .indicator-text {
    font-size: 10px;
  }
}

/* 动画 */
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 10px var(--color-accent);
  }
  50% {
    box-shadow: 0 0 25px var(--color-accent);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.turn-indicator-enter-active,
.turn-indicator-leave-active {
  transition: all 0.3s ease;
}

.turn-indicator-enter-from,
.turn-indicator-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
```

---

## 状态管理 (Pinia)

### gameStore.js

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // 故事消息
  const storyMessages = ref([
    {
      type: 'narration',
      content: '*意识逐渐恢复，刺眼的阳光透过眼皮照射进来。*\n\n你躺在一片草地上，四周是郁郁葱葱的森林。远处，一座中世纪风格的城镇若隐若现。'
    },
    {
      type: 'dialogue',
      speaker: '???',
      content: '你醒了？'
    }
  ])

  // 行动选项
  const actionOptions = ref([
    { label: '与她对话', action: '向她询问这是哪里' },
    { label: '检查周围', action: '观察四周环境' },
    { label: '尝试站起来', action: '尝试从地上站起来' }
  ])

  // 当前战斗配置（null表示无战斗）
  const currentBattleConfig = ref(null)

  // 游戏状态
  const gameState = ref({
    player: {
      name: '冒险者',
      level: 1
    },
    resources: {
      gold: 100,
      supplies: 10
    },
    progress: {
      chapter: 1,
      location: '未知草地'
    }
  })

  // 添加故事消息
  const addMessage = (message) => {
    storyMessages.value.push(message)
  }

  // 设置行动选项
  const setActionOptions = (options) => {
    actionOptions.value = options
  }

  // 设置战斗配置
  const setBattleConfig = (config) => {
    currentBattleConfig.value = config
  }

  // 清除战斗配置
  const clearBattleConfig = () => {
    currentBattleConfig.value = null
  }

  return {
    storyMessages,
    actionOptions,
    currentBattleConfig,
    gameState,
    addMessage,
    setActionOptions,
    setBattleConfig,
    clearBattleConfig
  }
})
```

---

## 项目初始化命令

```bash
# 创建Vue项目
npm create vite@latest telain-rpg -- --template vue

# 进入目录
cd telain-rpg

# 安装依赖
npm install

# 安装额外依赖
npm install pinia                    # 状态管理
npm install sass                     # SCSS支持
npm install @vueuse/core             # 实用组合式函数

# 开发运行
npm run dev

# 构建
npm run build
```

---

## 下一步

1. **Phase 1**: 搭建基础框架和布局组件
2. **Phase 2**: 实现主界面和故事展示
3. **Phase 3**: 实现战斗面板和卡牌组件
4. **Phase 4**: 集成SillyTavern API
5. **Phase 5**: 实现其他界面（调教/征服/编制/发展）
