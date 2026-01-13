<template>
  <div class="battle-log">
    <div class="log-header">
      <OrnamentDivider type="simple" />
      <span class="log-title">战斗日志</span>
      <OrnamentDivider type="simple" />
    </div>

    <div ref="logContainer" class="log-content">
      <TransitionGroup name="log-item">
        <div
          v-for="log in logs"
          :key="log.id"
          class="log-entry"
          :class="log.type"
        >
          <span class="log-prefix">&gt;</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import OrnamentDivider from '@/components/common/OrnamentDivider.vue'

const props = defineProps({
  logs: {
    type: Array,
    default: () => []
  }
})

const logContainer = ref(null)

// Auto scroll to bottom when new logs are added
watch(() => props.logs.length, () => {
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
})
</script>

<style lang="scss" scoped>
.battle-log {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.log-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);

  .log-title {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  .ornament-divider {
    flex: 1;
  }
}

.log-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm);
  font-family: var(--font-ui);
  font-size: var(--font-size-sm);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 3px;
  }
}

.log-entry {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
  line-height: 1.4;

  .log-prefix {
    color: var(--color-accent);
    flex-shrink: 0;
  }

  .log-message {
    color: var(--color-text-primary);
  }

  &.system {
    .log-message {
      color: var(--color-info);
      font-style: italic;
    }
  }

  &.combat {
    .log-message {
      color: var(--color-text-primary);
    }
  }

  &.damage {
    .log-message {
      color: var(--color-danger);
    }
  }

  &.heal {
    .log-message {
      color: var(--color-success);
    }
  }

  &.dialogue {
    .log-message {
      color: var(--color-accent-light);
    }
  }
}

// Log item transitions
.log-item-enter-active {
  transition: all 0.3s ease;
}

.log-item-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.log-item-move {
  transition: transform 0.3s ease;
}
</style>
