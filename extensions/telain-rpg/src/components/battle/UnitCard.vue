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
    <!-- Card Border -->
    <div class="card-border" :class="frameClass">
      <!-- Corner Ornaments -->
      <div class="corner-ornament top-left">⚜️</div>
      <div class="corner-ornament top-right">⚜️</div>
      <div class="corner-ornament bottom-left">⚜️</div>
      <div class="corner-ornament bottom-right">⚜️</div>
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <!-- Portrait Area -->
      <div class="portrait-area">
        <div
          class="portrait"
          :style="{ backgroundImage: unit.portrait ? `url(${unit.portrait})` : 'none' }"
        >
          <!-- Unit Icon (when no portrait) -->
          <span v-if="!unit.portrait" class="unit-icon">{{ unitIcon }}</span>
        </div>

        <!-- Defeated Overlay -->
        <div v-if="unit.isDefeated" class="defeated-overlay">
          <span>击败</span>
        </div>

        <!-- Defending Badge -->
        <div v-if="unit.isDefending" class="defending-badge">
          <span>🛡️</span>
        </div>
      </div>

      <!-- Info Area -->
      <div class="info-area">
        <!-- Name -->
        <div class="unit-name">{{ unit.name }}</div>

        <!-- Stats -->
        <div class="unit-stats">
          <span class="stat atk">攻{{ unit.unit.atk }}</span>
          <span class="stat def">防{{ unit.unit.def }}</span>
          <span class="stat spd">速{{ unit.unit.spd }}</span>
        </div>

        <!-- Unit Type and Count -->
        <div class="unit-type">
          [{{ unit.unit.type }}×{{ unit.unit.currentCount }}]
        </div>

        <!-- HP Bar -->
        <div class="hp-bar">
          <div
            class="hp-fill"
            :class="hpClass"
            :style="{ width: `${hpPercent}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Current Turn Indicator -->
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

// Unit icon mapping
const unitIconMap = {
  '剑士': '⚔️',
  '弓箭手': '🏹',
  '骑兵': '🐴',
  '法师': '🔮',
  '牧师': '✨',
  '哥布林': '👹',
  '座狼': '🐺',
  '兽人': '👺',
  '骷髅兵': '💀',
  '暗影刺客': '🗡️'
}

const unitIcon = computed(() => unitIconMap[props.unit.unit?.type] || '👤')

// Frame class (could be based on rarity or commander level)
const frameClass = computed(() => {
  return 'frame-normal'
})

// HP percentage
const hpPercent = computed(() => {
  const { currentCount, maxCount } = props.unit.unit || {}
  if (!currentCount || !maxCount) return 100
  return Math.round((currentCount / maxCount) * 100)
})

// HP bar color class
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
  width: 100px;
  cursor: default;
  transition: var(--transition-normal);

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
    pointer-events: none;
  }
}

.card-border {
  position: relative;
  background: var(--gradient-panel);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
  transition: var(--transition-normal);

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
  font-size: 8px;
  color: var(--color-border-gold);
  opacity: 0.5;

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
  width: 60px;
  height: 60px;
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
      font-size: 28px;
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
    font-size: var(--font-size-sm);
  }

  .defending-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 14px;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  }
}

.info-area {
  text-align: center;

  .unit-name {
    font-size: var(--font-size-xs);
    font-weight: bold;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .unit-stats {
    display: flex;
    justify-content: center;
    gap: 2px;
    font-size: 9px;
    color: var(--color-text-secondary);

    .stat {
      background: var(--color-bg-primary);
      padding: 1px 3px;
      border-radius: 2px;
    }
  }

  .unit-type {
    font-size: 10px;
    color: var(--color-text-secondary);
    margin-top: 2px;
  }
}

.hp-bar {
  height: 4px;
  background: var(--color-bg-primary);
  border-radius: 2px;
  overflow: hidden;
  margin-top: var(--spacing-xs);

  .hp-fill {
    height: 100%;
    transition: width 0.3s ease;
    border-radius: 2px;

    &.healthy {
      background: linear-gradient(90deg, #4A7C59, #6B8E23);
    }

    &.warning {
      background: linear-gradient(90deg, #CC7722, #DAA520);
    }

    &.critical {
      background: linear-gradient(90deg, #8B0000, #CD5C5C);
      animation: critical-pulse 1s infinite;
    }
  }
}

.turn-indicator {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-accent);

  .indicator-arrow {
    font-size: 10px;
    animation: bounce 1s infinite;
  }

  .indicator-text {
    font-size: 9px;
  }
}

// Animations
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
    transform: translateY(-3px);
  }
}

@keyframes critical-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

// Turn indicator transition
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
