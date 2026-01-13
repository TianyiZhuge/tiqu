<template>
  <nav class="bottom-nav-bar">
    <!-- Decorative top border -->
    <div class="nav-decoration">
      <svg viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M0,10 L40,10 L50,0 L60,10 L100,10" fill="none" stroke="currentColor" stroke-width="1"/>
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
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>

        <!-- Active indicator -->
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
  padding-bottom: calc(var(--spacing-sm) + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(
    180deg,
    var(--color-bg-secondary) 0%,
    var(--color-bg-primary) 100%
  );
  border-top: 1px solid var(--color-border);
}

.nav-decoration {
  position: absolute;
  top: -5px;
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

.nav-items {
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
  transition: var(--transition-normal);
  -webkit-tap-highlight-color: transparent;

  .nav-icon {
    font-size: 24px;
    transition: transform var(--transition-normal);
  }

  .nav-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    transition: color var(--transition-normal);
  }

  &:hover {
    .nav-icon {
      transform: scale(1.1);
    }

    .nav-label {
      color: var(--color-text-primary);
    }
  }

  &:active {
    .nav-icon {
      transform: scale(0.95);
    }
  }

  &.active {
    .nav-icon {
      transform: scale(1.15);
    }

    .nav-label {
      color: var(--color-accent);
      font-weight: bold;
    }
  }
}

.active-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;

  .indicator-glow {
    width: 100%;
    height: 100%;
    background: var(--color-accent);
    border-radius: 2px;
    box-shadow: 0 0 10px var(--color-accent);
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
</style>
