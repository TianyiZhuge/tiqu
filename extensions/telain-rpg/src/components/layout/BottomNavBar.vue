<template>
  <nav class="bottom-nav-bar">
    <!-- Glass background -->
    <div class="bar-glass"></div>

    <!-- Decorative top border -->
    <div class="bar-decoration">
      <svg viewBox="0 0 200 12" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gold-gradient-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:transparent" />
            <stop offset="20%" style="stop-color:#8B6914" />
            <stop offset="50%" style="stop-color:#D4AF37" />
            <stop offset="80%" style="stop-color:#8B6914" />
            <stop offset="100%" style="stop-color:transparent" />
          </linearGradient>
        </defs>
        <path
          d="M0,12 L80,12 Q90,12 95,2 L100,0 L105,2 Q110,12 120,12 L200,12"
          fill="none"
          stroke="url(#gold-gradient-bottom)"
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

    <!-- Navigation items -->
    <div class="nav-items">
      <button
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: modelValue === item.id }"
        @click="selectTab(item.id)"
      >
        <!-- Icon container with glow effect -->
        <span class="nav-icon-wrapper">
          <span class="nav-icon-glow" v-if="modelValue === item.id"></span>
          <Icon :name="item.icon" size="lg" class="nav-icon" />
        </span>

        <!-- Label -->
        <span class="nav-label">{{ item.label }}</span>

        <!-- Active indicator -->
        <Transition name="indicator">
          <div v-if="modelValue === item.id" class="active-indicator">
            <div class="indicator-line"></div>
          </div>
        </Transition>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@/components/icons'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'main'
  }
})

const emit = defineEmits(['update:modelValue'])

const navItems = ref([
  { id: 'main', icon: 'scroll', label: '主界面' },
  { id: 'training', icon: 'sparkles', label: '调教' },
  { id: 'conquest', icon: 'swords', label: '征服' },
  { id: 'formation', icon: 'castle', label: '编制' },
  { id: 'development', icon: 'trendingUp', label: '发展' }
])

const selectTab = (id) => {
  emit('update:modelValue', id)
}
</script>

<style lang="scss" scoped>
.bottom-nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  height: var(--bottom-bar-height);
  padding: 0 var(--space-sm);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.bar-glass {
  position: absolute;
  inset: 0;
  background: var(--gradient-bottom-bar);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
}

.bar-decoration {
  position: absolute;
  top: 0;
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

.nav-items {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  height: 100%;
  padding-top: var(--space-md);
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-xs) var(--space-sm);
  background: none;
  border: none;
  cursor: pointer;
  transition: var(--transition-normal);
  -webkit-tap-highlight-color: transparent;

  .nav-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }

  .nav-icon-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle,
      rgba(var(--gold-primary-rgb), 0.3) 0%,
      transparent 70%
    );
    border-radius: 50%;
    animation: glow-pulse 2s ease-in-out infinite;
  }

  .nav-icon {
    position: relative;
    z-index: 1;
    color: var(--text-muted);
    transition: all var(--transition-normal);
  }

  .nav-label {
    font-family: var(--font-ui);
    font-size: var(--text-xs);
    color: var(--text-muted);
    transition: all var(--transition-normal);
    white-space: nowrap;
  }

  // Hover state
  &:hover:not(.active) {
    .nav-icon {
      color: var(--text-secondary);
      transform: translateY(-2px);
    }

    .nav-label {
      color: var(--text-secondary);
    }
  }

  // Active press state
  &:active {
    .nav-icon {
      transform: scale(0.9);
    }
  }

  // Active/selected state
  &.active {
    .nav-icon-wrapper {
      transform: translateY(-4px);
    }

    .nav-icon {
      color: var(--gold-primary);
      filter: drop-shadow(0 0 8px rgba(var(--gold-primary-rgb), 0.6));
    }

    .nav-label {
      color: var(--gold-primary);
      font-weight: 600;
      text-shadow: 0 0 8px rgba(var(--gold-primary-rgb), 0.4);
    }
  }
}

.active-indicator {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;

  .indicator-line {
    width: 100%;
    height: 100%;
    background: var(--gradient-gold);
    border-radius: var(--radius-full);
    box-shadow:
      0 0 8px rgba(var(--gold-primary-rgb), 0.8),
      0 0 16px rgba(var(--gold-primary-rgb), 0.4);
  }
}

// Indicator transition
.indicator-enter-active,
.indicator-leave-active {
  transition: all var(--transition-normal);
}

.indicator-enter-from,
.indicator-leave-to {
  opacity: 0;
  transform: translateX(-50%) scaleX(0);
}

.indicator-enter-to,
.indicator-leave-from {
  opacity: 1;
  transform: translateX(-50%) scaleX(1);
}

// Animations
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

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
