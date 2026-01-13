<template>
  <div class="main-view">
    <!-- Story Display Section -->
    <section class="story-section">
      <div class="story-panel glass-panel">
        <!-- Top decoration -->
        <div class="panel-decoration top">
          <div class="decoration-line"></div>
          <Icon name="diamond" size="sm" class="decoration-icon" />
          <div class="decoration-line"></div>
        </div>

        <!-- Story Content -->
        <div ref="storyContainer" class="story-content" @scroll="onScroll">
          <!-- Messages -->
          <TransitionGroup name="message" tag="div" class="messages-container">
            <div
              v-for="(message, index) in storyMessages"
              :key="message.id || index"
              class="story-message"
              :class="message.type"
            >
              <!-- Narration -->
              <div v-if="message.type === 'narration'" class="narration-block">
                <span class="narration-text" v-html="formatText(message.content)"></span>
              </div>

              <!-- Dialogue -->
              <div v-else-if="message.type === 'dialogue'" class="dialogue-block">
                <div class="speaker-avatar" v-if="message.avatar">
                  <img :src="message.avatar" :alt="message.speaker" />
                </div>
                <div class="dialogue-content">
                  <span class="speaker-name">{{ message.speaker }}</span>
                  <span class="dialogue-text">"{{ message.content }}"</span>
                </div>
              </div>

              <!-- System Message -->
              <div v-else-if="message.type === 'system'" class="system-message">
                <Icon name="info" size="sm" class="system-icon" />
                <span class="system-text">{{ message.content }}</span>
              </div>
            </div>
          </TransitionGroup>

          <!-- Loading Indicator -->
          <Transition name="fade">
            <div v-if="isLoading" class="loading-indicator">
              <div class="loading-spinner">
                <Icon name="loader" size="lg" class="animate-spin" />
              </div>
              <span class="loading-text">正在思考...</span>
            </div>
          </Transition>
        </div>

        <!-- Bottom decoration -->
        <div class="panel-decoration bottom">
          <div class="decoration-line"></div>
          <Icon name="diamond" size="sm" class="decoration-icon" />
          <div class="decoration-line"></div>
        </div>
      </div>
    </section>

    <!-- Action Section -->
    <section class="action-section">
      <div class="action-panel">
        <!-- Action Options -->
        <div class="action-options" v-if="actionOptions.length > 0">
          <button
            v-for="(option, index) in actionOptions"
            :key="index"
            class="action-btn"
            :disabled="isLoading"
            @click="selectAction(option)"
          >
            <Icon name="chevronRight" size="sm" class="action-icon" />
            <span class="action-label">{{ option.label }}</span>
          </button>
        </div>

        <!-- Battle Trigger Button -->
        <Transition name="battle-btn">
          <button
            v-if="showBattleButton"
            class="battle-trigger-btn"
            @click="openBattle"
          >
            <Icon name="swords" size="md" class="battle-icon left" />
            <span class="battle-text">开始战斗</span>
            <Icon name="swords" size="md" class="battle-icon right" />
          </button>
        </Transition>

        <!-- Custom Input -->
        <div class="custom-input-area">
          <div class="input-wrapper">
            <input
              v-model="customInput"
              type="text"
              class="custom-input"
              placeholder="输入自定义行动..."
              :disabled="isLoading"
              @keyup.enter="submitCustomAction"
            />
            <button
              class="send-btn"
              :disabled="!customInput.trim() || isLoading"
              @click="submitCustomAction"
            >
              <Icon name="send" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Battle Panel Overlay -->
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
import { Icon } from '@/components/icons'
import BattlePanel from '@/components/battle/BattlePanel.vue'

// Stores
import { useGameStore } from '@/stores/gameStore'
import { useBattleStore } from '@/stores/battleStore'
import { useUIStore } from '@/stores/uiStore'

// Services
import { generateOnly, parseOptions, parseBattleConfig } from '@/services/MessageService'

// Store refs
const gameStore = useGameStore()
const battleStore = useBattleStore()
const uiStore = useUIStore()

const { storyMessages, actionOptions, currentBattleConfig } = storeToRefs(gameStore)
const { isBattleActive } = storeToRefs(battleStore)
const { isLoading } = storeToRefs(uiStore)

// Local state
const storyContainer = ref(null)
const customInput = ref('')

// Computed
const showBattleButton = computed(() => {
  return currentBattleConfig.value !== null && !isBattleActive.value
})

// Methods
const formatText = (text) => {
  if (!text) return ''
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

// 点击选项 -> 填充到输入框
const selectAction = (option) => {
  customInput.value = option.action || option.label
}

// 提交自定义行动
const submitCustomAction = async () => {
  if (!customInput.value.trim() || isLoading.value) return

  const action = customInput.value.trim()
  customInput.value = ''

  // 在 UI 内显示用户行动
  gameStore.addNarration(`*你决定${action}。*`)
  scrollToBottom()

  uiStore.setLoading(true, '正在生成...')

  try {
    // 仅获取 AI 生成，不创建外部消息
    const response = await generateOnly(action)

    // 处理AI回复（显示在 UI 内）
    processResponse(response)

  } catch (error) {
    console.error('[MainView] 生成失败:', error)
    // 显示错误提示
    gameStore.addSystemMessage('生成失败，请重试')
    uiStore.addNotification({
      type: 'error',
      message: '生成失败: ' + (error.message || '未知错误')
    })
  } finally {
    uiStore.setLoading(false)
    scrollToBottom()
  }
}

// 处理AI回复
const processResponse = (response) => {
  if (!response) return

  // 添加叙事内容到故事面板
  gameStore.addNarration(response)

  // 解析选项
  const newOptions = parseOptions(response)
  if (newOptions.length > 0) {
    gameStore.setActionOptions(newOptions)
  }

  // 检查是否有战斗配置
  const battleConfig = parseBattleConfig(response)
  if (battleConfig) {
    gameStore.setBattleConfig(battleConfig)
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (storyContainer.value) {
      storyContainer.value.scrollTop = storyContainer.value.scrollHeight
    }
  })
}

const onScroll = () => {
  // Can add scroll-related logic here
}

const openBattle = () => {
  battleStore.startBattle(currentBattleConfig.value)
}

const closeBattle = () => {
  battleStore.pauseBattle()
}

const onBattleComplete = (result) => {
  battleStore.endBattle(result)

  if (result.victory) {
    gameStore.addNarration('*战斗胜利！敌人被击退了。*')
    uiStore.addNotification({
      type: 'success',
      message: '战斗胜利！'
    })
  } else {
    gameStore.addNarration('*战斗失败...你的部队被迫撤退。*')
    uiStore.addNotification({
      type: 'error',
      message: '战斗失败'
    })
  }

  gameStore.clearBattleConfig()
  scrollToBottom()
}

// Watch for new messages
watch(storyMessages, () => {
  scrollToBottom()
}, { deep: true })

// Initialize
onMounted(() => {
  scrollToBottom()

  // Demo: Set up a test battle config
  gameStore.setBattleConfig({
    enemies: [
      {
        name: '哥布林头目',
        portrait: null,
        unit: {
          type: '哥布林',
          currentCount: 20,
          maxCount: 20,
          atk: 8,
          def: 4,
          spd: 6,
          hp: 10
        }
      },
      {
        name: '狼骑士',
        portrait: null,
        unit: {
          type: '座狼',
          currentCount: 8,
          maxCount: 8,
          atk: 12,
          def: 6,
          spd: 14,
          hp: 18
        }
      }
    ],
    allies: [
      {
        name: '{{user}}',
        portrait: null,
        unit: {
          type: '剑士',
          currentCount: 20,
          maxCount: 30,
          atk: 10,
          def: 8,
          spd: 5,
          hp: 15
        }
      },
      {
        name: '弓手长',
        portrait: null,
        unit: {
          type: '弓箭手',
          currentCount: 25,
          maxCount: 25,
          atk: 14,
          def: 3,
          spd: 7,
          hp: 12
        }
      }
    ],
    victoryCondition: '击败所有敌人'
  })
})
</script>

<style lang="scss" scoped>
.main-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--space-md);
  padding: var(--space-md);
}

// ═══════════════════════════════════════════
// Story Section
// ═══════════════════════════════════════════
.story-section {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.story-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: var(--space-sm);
}

.panel-decoration {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-md);
  flex-shrink: 0;

  .decoration-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--gold-dark) 30%,
      var(--gold-primary) 50%,
      var(--gold-dark) 70%,
      transparent
    );
  }

  .decoration-icon {
    color: var(--gold-primary);
    opacity: 0.7;
  }

  &.top {
    .decoration-line {
      background: linear-gradient(
        90deg,
        transparent,
        var(--gold-dark)
      );

      &:last-of-type {
        background: linear-gradient(
          90deg,
          var(--gold-dark),
          transparent
        );
      }
    }
  }

  &.bottom {
    .decoration-line {
      background: linear-gradient(
        90deg,
        transparent,
        var(--gold-dark)
      );

      &:last-of-type {
        background: linear-gradient(
          90deg,
          var(--gold-dark),
          transparent
        );
      }
    }
  }
}

.story-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
  padding-right: var(--space-sm);
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

// ═══════════════════════════════════════════
// Story Messages
// ═══════════════════════════════════════════
.story-message {
  animation: fade-in-up 0.3s ease-out;

  // Narration style
  &.narration {
    .narration-block {
      padding: var(--space-sm) 0;
    }

    .narration-text {
      font-family: var(--font-body);
      color: var(--text-primary);
      line-height: var(--leading-relaxed);

      :deep(em) {
        color: var(--gold-bright);
        font-style: italic;
      }

      :deep(strong) {
        color: var(--text-brightest);
        font-weight: 600;
      }
    }
  }

  // Dialogue style
  &.dialogue {
    .dialogue-block {
      display: flex;
      gap: var(--space-sm);
      padding: var(--space-sm);
      padding-left: var(--space-md);
      border-left: 3px solid var(--gold-primary);
      background: rgba(var(--gold-primary-rgb), 0.05);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
    }

    .speaker-avatar {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      overflow: hidden;
      border: 2px solid var(--gold-dark);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .dialogue-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .speaker-name {
      font-family: var(--font-ui);
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--gold-primary);
    }

    .dialogue-text {
      font-family: var(--font-body);
      color: var(--text-primary);
      line-height: var(--leading-relaxed);
    }
  }

  // System message style
  &.system {
    .system-message {
      display: flex;
      align-items: flex-start;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      background: rgba(var(--info-rgb), 0.1);
      border: 1px solid rgba(var(--info-rgb), 0.3);
      border-radius: var(--radius-md);
    }

    .system-icon {
      flex-shrink: 0;
      color: var(--info);
      margin-top: 2px;
    }

    .system-text {
      font-family: var(--font-ui);
      font-size: var(--text-sm);
      color: var(--info-light);
      line-height: var(--leading-normal);
    }
  }
}

// Message transitions
.message-enter-active {
  transition: all 0.4s ease-out;
}

.message-leave-active {
  transition: all 0.2s ease-in;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// ═══════════════════════════════════════════
// Loading Indicator
// ═══════════════════════════════════════════
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg);

  .loading-spinner {
    color: var(--gold-primary);
  }

  .loading-text {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
}

// Fade transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// ═══════════════════════════════════════════
// Action Section
// ═══════════════════════════════════════════
.action-section {
  flex-shrink: 0;
}

.action-panel {
  padding: var(--space-md);
  background: var(--gradient-glass);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
}

// Action Options
.action-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  color: var(--text-primary);
  background: rgba(var(--bg-card-rgb), 0.8);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-normal);

  .action-icon {
    color: var(--gold-primary);
    transition: var(--transition-normal);
  }

  &:hover:not(:disabled) {
    border-color: var(--gold-primary);
    background: rgba(var(--gold-primary-rgb), 0.1);

    .action-icon {
      transform: translateX(2px);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Battle Trigger Button
.battle-trigger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  width: 100%;
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-brightest);
  background: var(--gradient-battle);
  border: 1px solid var(--danger);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-md);

  .battle-icon {
    color: var(--text-brightest);
    transition: var(--transition-normal);

    &.left {
      transform: scaleX(-1);
    }
  }

  .battle-text {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg), var(--shadow-glow-danger);

    .battle-icon.left {
      transform: scaleX(-1) translateX(-4px);
    }

    .battle-icon.right {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
}

// Custom Input Area
.custom-input-area {
  .input-wrapper {
    display: flex;
    gap: var(--space-sm);
  }
}

.custom-input {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-primary);
  background: rgba(var(--bg-dark-rgb), 0.6);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 3px rgba(var(--gold-primary-rgb), 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--bg-deepest);
  background: var(--gradient-gold);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-sm);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md), var(--shadow-glow-gold);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// ═══════════════════════════════════════════
// Animations
// ═══════════════════════════════════════════
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Battle button transition
.battle-btn-enter-active,
.battle-btn-leave-active {
  transition: all 0.3s var(--ease-bounce);
}

.battle-btn-enter-from,
.battle-btn-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

// Battle panel transition
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

// Spin animation for loading
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
