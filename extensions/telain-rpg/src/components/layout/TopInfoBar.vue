<template>
  <header class="top-info-bar">
    <div class="info-bar-content">
      <!-- Location -->
      <div class="info-item location">
        <span class="info-icon">📍</span>
        <span class="info-text">{{ currentLocation }}</span>
      </div>

      <!-- Spacer -->
      <div class="info-spacer"></div>

      <!-- Resources -->
      <div class="info-item gold">
        <span class="info-icon">💰</span>
        <span class="info-value">{{ gold }}</span>
      </div>

      <div class="info-item supplies">
        <span class="info-icon">📦</span>
        <span class="info-value">{{ supplies }}</span>
      </div>

      <!-- Chapter -->
      <div class="info-item chapter">
        <span class="info-text">Ch.{{ chapter }}</span>
      </div>
    </div>

    <!-- Decorative border -->
    <div class="bar-decoration">
      <svg viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M0,0 L40,0 L50,10 L60,0 L100,0" fill="none" stroke="currentColor" stroke-width="1"/>
      </svg>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const { currentLocation, gold, supplies, chapter } = storeToRefs(gameStore)
</script>

<style lang="scss" scoped>
.top-info-bar {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(
    180deg,
    var(--color-bg-primary) 0%,
    var(--color-bg-secondary) 100%
  );
  border-bottom: 1px solid var(--color-border);
}

.info-bar-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  .info-icon {
    font-size: 16px;
  }

  .info-text {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .info-value {
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    font-weight: bold;
  }

  &.location {
    .info-text {
      color: var(--color-accent);
    }
  }

  &.chapter {
    .info-text {
      color: var(--color-text-muted);
      font-style: italic;
    }
  }
}

.info-spacer {
  flex: 1;
}

.bar-decoration {
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 10px;
  color: var(--color-border-gold);
  opacity: 0.5;

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
