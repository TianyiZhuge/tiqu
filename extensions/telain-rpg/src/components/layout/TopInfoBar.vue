<template>
  <header class="top-info-bar">
    <!-- Glass background -->
    <div class="bar-glass"></div>

    <div class="info-bar-content">
      <!-- Location -->
      <div class="info-item location">
        <Icon name="mapPin" size="sm" class="info-icon" />
        <span class="info-text">{{ currentLocation }}</span>
      </div>

      <!-- Chapter badge -->
      <div class="info-item chapter">
        <span class="chapter-badge">
          <Icon name="book" size="xs" class="chapter-icon" />
          <span>{{ chapter }}</span>
        </span>
      </div>

      <!-- Spacer -->
      <div class="info-spacer"></div>

      <!-- Resources -->
      <div class="info-resources">
        <div class="resource-item gold" :title="`金币: ${gold}`">
          <Icon name="coins" size="sm" class="resource-icon" />
          <span class="resource-value">{{ formatNumber(gold) }}</span>
        </div>

        <div class="resource-divider"></div>

        <div class="resource-item supplies" :title="`补给: ${supplies}`">
          <Icon name="box" size="sm" class="resource-icon" />
          <span class="resource-value">{{ formatNumber(supplies) }}</span>
        </div>
      </div>

      <!-- Settings button -->
      <button class="settings-btn" @click="$emit('openSettings')" title="设置">
        <Icon name="settings" size="sm" />
      </button>
    </div>

    <!-- Decorative bottom border -->
    <div class="bar-decoration">
      <svg viewBox="0 0 200 12" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:transparent" />
            <stop offset="20%" style="stop-color:#8B6914" />
            <stop offset="50%" style="stop-color:#D4AF37" />
            <stop offset="80%" style="stop-color:#8B6914" />
            <stop offset="100%" style="stop-color:transparent" />
          </linearGradient>
        </defs>
        <path
          d="M0,0 L80,0 Q90,0 95,10 L100,12 L105,10 Q110,0 120,0 L200,0"
          fill="none"
          stroke="url(#gold-gradient)"
          stroke-width="1.5"
        />
        <!-- Center diamond -->
        <path
          d="M96,6 L100,2 L104,6 L100,10 Z"
          fill="#D4AF37"
          class="center-diamond"
        />
      </svg>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { Icon } from '@/components/icons'

defineEmits(['openSettings'])

const gameStore = useGameStore()
const { currentLocation, gold, supplies, chapter } = storeToRefs(gameStore)

// 格式化数字（大数字显示为 K, M 等）
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>

<style lang="scss" scoped>
.top-info-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  height: var(--top-bar-height);
  padding: 0 var(--space-md);
  display: flex;
  align-items: center;
}

.bar-glass {
  position: absolute;
  inset: 0;
  background: var(--gradient-top-bar);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
}

.info-bar-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  width: 100%;
  padding: var(--space-sm) 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);

  .info-icon {
    color: var(--gold-primary);
    opacity: 0.8;
  }

  .info-text {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    transition: var(--transition-normal);
  }

  &.location {
    .info-icon {
      color: var(--gold-bright);
      animation: pulse-scale 3s ease-in-out infinite;
    }

    .info-text {
      color: var(--gold-primary);
      font-weight: 500;
    }

    &:hover .info-text {
      color: var(--gold-bright);
      text-shadow: 0 0 10px rgba(var(--gold-primary-rgb), 0.5);
    }
  }

  &.chapter {
    .chapter-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px var(--space-sm);
      background: rgba(var(--gold-primary-rgb), 0.15);
      border: 1px solid rgba(var(--gold-primary-rgb), 0.3);
      border-radius: var(--radius-full);
      font-family: var(--font-ui);
      font-size: var(--text-xs);
      color: var(--gold-primary);
      font-weight: 500;

      .chapter-icon {
        opacity: 0.7;
      }
    }
  }
}

.info-spacer {
  flex: 1;
}

.info-resources {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  background: rgba(var(--bg-card-rgb), 0.6);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(4px);
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: default;
  transition: var(--transition-normal);

  .resource-icon {
    color: var(--gold-primary);
  }

  .resource-value {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
    min-width: 32px;
  }

  &.gold {
    .resource-icon {
      color: var(--gold-bright);
    }

    &:hover {
      .resource-icon {
        animation: bounce 0.5s ease-in-out;
      }
    }
  }

  &.supplies {
    .resource-icon {
      color: var(--warning);
    }

    &:hover {
      .resource-icon {
        animation: bounce 0.5s ease-in-out;
      }
    }
  }
}

.resource-divider {
  width: 1px;
  height: 16px;
  background: var(--border-subtle);
}

.settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-normal);

  &:hover {
    color: var(--gold-primary);
    background: rgba(var(--gold-primary-rgb), 0.1);

    :deep(svg) {
      animation: spin 2s linear infinite;
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

.bar-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 12px;
  pointer-events: none;

  svg {
    width: 100%;
    height: 100%;
  }

  .center-diamond {
    filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.6));
    animation: pulse-scale 2s ease-in-out infinite;
  }
}

// 脉冲动画
@keyframes pulse-scale {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
