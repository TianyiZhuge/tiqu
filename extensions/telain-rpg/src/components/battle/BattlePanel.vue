<template>
  <div class="battle-panel-overlay">
    <div class="battle-panel">
      <!-- Battle Header -->
      <header class="battle-header">
        <GoldBorder class="header-content">
          <h2 class="battle-title">
            <span class="title-ornament">⚔️</span>
            战斗 - 回合 {{ currentTurn }}
            <span class="title-ornament">⚔️</span>
          </h2>
        </GoldBorder>
      </header>

      <!-- Battle Body -->
      <main class="battle-body">
        <!-- Enemy Section -->
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

        <!-- Battle Log -->
        <section class="battle-log-section">
          <BattleLog :logs="battleLogs" />
        </section>

        <!-- Ally Section -->
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

      <!-- Battle Footer -->
      <footer class="battle-footer">
        <ActionMenu
          v-if="isPlayerTurn && !isBattleOver"
          :current-unit="currentUnit"
          :is-selecting-target="isSelectingTarget"
          @attack="startTargetSelection"
          @defend="executeDefend"
          @skill="openSkillMenu"
          @retreat="confirmRetreat"
          @cancel="cancelTargetSelection"
        />

        <div v-else-if="isBattleOver" class="battle-result">
          <div v-if="isVictory" class="result-victory">
            <span class="result-icon">🏆</span>
            <span class="result-text">胜利！</span>
          </div>
          <div v-else class="result-defeat">
            <span class="result-icon">💀</span>
            <span class="result-text">败北...</span>
          </div>
          <MagicButton variant="primary" @click="finishBattle">
            继续
          </MagicButton>
        </div>

        <div v-else class="enemy-turn-indicator">
          <LoadingMagicCircle size="small" />
          <span>敌方回合...</span>
        </div>
      </footer>

      <!-- Collapse Button -->
      <button class="collapse-btn" @click="$emit('close')">
        <span>✕ 收起战斗面板</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import GoldBorder from '@/components/common/GoldBorder.vue'
import MagicButton from '@/components/common/MagicButton.vue'
import LoadingMagicCircle from '@/components/common/LoadingMagicCircle.vue'
import UnitCard from '@/components/battle/UnitCard.vue'
import BattleLog from '@/components/battle/BattleLog.vue'
import ActionMenu from '@/components/battle/ActionMenu.vue'

import { useBattleStore } from '@/stores/battleStore'

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
  isBattleOver,
  isVictory
} = storeToRefs(battleStore)

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
  battleStore.executeAttack(currentUnit.value, target)
  cancelTargetSelection()

  // If battle is not over, process enemy turn
  if (!isBattleOver.value && !isPlayerTurn.value) {
    processEnemyTurn()
  }
}

const executeDefend = () => {
  battleStore.executeDefend(currentUnit.value)

  if (!isBattleOver.value && !isPlayerTurn.value) {
    processEnemyTurn()
  }
}

const processEnemyTurn = async () => {
  // Simulate enemy thinking
  await new Promise(resolve => setTimeout(resolve, 800))

  while (!isPlayerTurn.value && !isBattleOver.value) {
    const enemy = currentUnit.value
    if (!enemy || enemy.isDefeated) {
      battleStore.nextTurn()
      continue
    }

    // Enemy AI: attack random alive ally
    const aliveAllies = allies.value.filter(a => !a.isDefeated)
    if (aliveAllies.length > 0) {
      const target = aliveAllies[Math.floor(Math.random() * aliveAllies.length)]
      await new Promise(resolve => setTimeout(resolve, 500))
      battleStore.executeAttack(enemy, target)
    } else {
      break
    }

    await new Promise(resolve => setTimeout(resolve, 300))
  }
}

const openSkillMenu = () => {
  // TODO: Implement skill menu
  console.log('Skill menu not yet implemented')
}

const confirmRetreat = () => {
  if (confirm('确定要撤退吗？')) {
    emit('complete', { victory: false, retreated: true })
  }
}

const finishBattle = () => {
  emit('complete', battleStore.getBattleResult())
}

// Initialize battle
onMounted(() => {
  battleStore.initBattle(props.battleConfig)
})

// Watch for battle end
watch(isBattleOver, (over) => {
  if (over) {
    battleStore.addLog('system', isVictory.value ? '战斗胜利！' : '战斗失败...')
  }
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
  position: relative;
}

.battle-header {
  padding: var(--spacing-md);
  flex-shrink: 0;

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
  flex-shrink: 0;
}

.enemy-turn-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.battle-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);

  .result-victory,
  .result-defeat {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-size-xl);
    font-family: var(--font-title);

    .result-icon {
      font-size: 32px;
    }
  }

  .result-victory {
    color: var(--color-success);
    .result-text {
      text-shadow: 0 0 10px var(--color-success);
    }
  }

  .result-defeat {
    color: var(--color-danger);
    .result-text {
      text-shadow: 0 0 10px var(--color-danger);
    }
  }
}

.collapse-btn {
  position: absolute;
  bottom: calc(var(--spacing-md) + 60px);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-normal);
  font-size: var(--font-size-sm);

  &:hover {
    color: var(--color-text-primary);
    border-color: var(--color-accent);
  }
}
</style>
