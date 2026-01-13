<template>
  <div class="main-view">
    <!-- Story Display Section -->
    <section class="story-section">
      <ParchmentPanel class="story-panel" :with-border="true">
        <OrnamentDivider type="top" />

        <!-- Story Content -->
        <div ref="storyContainer" class="story-content" @scroll="onScroll">
          <!-- Messages -->
          <div
            v-for="(message, index) in storyMessages"
            :key="index"
            class="story-message"
            :class="message.type"
          >
            <!-- Narration -->
            <div v-if="message.type === 'narration'" class="narration-text">
              <span v-html="formatText(message.content)"></span>
            </div>

            <!-- Dialogue -->
            <div v-else-if="message.type === 'dialogue'" class="dialogue-block">
              <span class="speaker-name">{{ message.speaker }}</span>
              <span class="dialogue-text">"{{ message.content }}"</span>
            </div>

            <!-- System Message -->
            <div v-else-if="message.type === 'system'" class="system-message">
              <span class="system-icon">ℹ️</span>
              <span>{{ message.content }}</span>
            </div>
          </div>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="loading-indicator">
            <LoadingMagicCircle size="medium" />
            <span>正在思考...</span>
          </div>
        </div>

        <OrnamentDivider type="bottom" />
      </ParchmentPanel>
    </section>

    <!-- Action Section -->
    <section class="action-section">
      <GoldBorder class="action-panel">
        <!-- Action Options -->
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

        <!-- Battle Trigger Button -->
        <Transition name="battle-btn">
          <MagicButton
            v-if="showBattleButton"
            variant="battle"
            class="battle-trigger-btn"
            @click="openBattle"
          >
            <span>⚔️</span>
            开始战斗
            <span>⚔️</span>
          </MagicButton>
        </Transition>

        <!-- Custom Input -->
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
import ParchmentPanel from '@/components/common/ParchmentPanel.vue'
import GoldBorder from '@/components/common/GoldBorder.vue'
import OrnamentDivider from '@/components/common/OrnamentDivider.vue'
import MagicButton from '@/components/common/MagicButton.vue'
import LoadingMagicCircle from '@/components/common/LoadingMagicCircle.vue'
import BattlePanel from '@/components/battle/BattlePanel.vue'

// Stores
import { useGameStore } from '@/stores/gameStore'
import { useBattleStore } from '@/stores/battleStore'
import { useUIStore } from '@/stores/uiStore'

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

const selectAction = async (option) => {
  uiStore.setLoading(true, '正在生成...')

  // Simulate LLM response (placeholder)
  await new Promise(resolve => setTimeout(resolve, 1500))

  gameStore.addNarration(`你选择了"${option.label}"。\n\n*这是一个模拟的叙事响应。在实际游戏中，这里会显示LLM生成的内容。*`)

  uiStore.setLoading(false)
  scrollToBottom()
}

const submitCustomAction = async () => {
  if (!customInput.value.trim() || isLoading.value) return

  const action = customInput.value.trim()
  customInput.value = ''

  uiStore.setLoading(true, '正在生成...')

  // Simulate LLM response (placeholder)
  await new Promise(resolve => setTimeout(resolve, 1500))

  gameStore.addNarration(`你决定${action}。\n\n*这是一个模拟的叙事响应。*`)

  uiStore.setLoading(false)
  scrollToBottom()
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
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

// Story Section
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

// Story Messages
.story-message {
  margin-bottom: var(--spacing-md);
  line-height: 1.8;
  animation: fade-in 0.3s ease-out;

  &.narration {
    .narration-text {
      color: var(--color-text-primary);

      :deep(em) {
        color: var(--color-accent-light);
        font-style: italic;
      }

      :deep(strong) {
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
      background: rgba(70, 130, 180, 0.1);
      border-radius: var(--radius-sm);
      color: var(--color-info);
      font-size: var(--font-size-sm);

      .system-icon {
        font-size: 16px;
      }
    }
  }
}

// Loading Indicator
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
}

// Action Section
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

    .option-icon {
      color: var(--color-accent);
    }
  }

  .battle-trigger-btn {
    width: 100%;
    margin-bottom: var(--spacing-md);
  }

  .custom-input-area {
    .input-wrapper {
      display: flex;
      gap: var(--spacing-sm);

      input {
        flex: 1;
      }
    }
  }
}

// Animations
@keyframes fade-in {
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
  transition: all 0.3s ease;
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
</style>
