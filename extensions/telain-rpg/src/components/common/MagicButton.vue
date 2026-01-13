<template>
  <button
    class="magic-button"
    :class="[variant, { disabled: disabled, loading: loading }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="button-loading">
      <span class="loading-spinner"></span>
    </span>
    <span class="button-content">
      <slot></slot>
    </span>
    <span class="button-glow"></span>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'primary', 'battle', 'small', 'ghost'].includes(v)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (e) => {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>

<style lang="scss" scoped>
.magic-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: var(--font-ui);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-bg-card);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  overflow: hidden;
  transition: var(--transition-normal);

  &:hover:not(.disabled) {
    border-color: var(--color-accent);
    transform: translateY(-2px);

    .button-glow {
      opacity: 0.3;
    }
  }

  &:active:not(.disabled) {
    transform: translateY(0);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Variants
  &.primary {
    background: var(--gradient-gold);
    border-color: var(--color-accent-dark);
    color: var(--color-bg-primary);
    font-weight: bold;

    &:hover:not(.disabled) {
      box-shadow: var(--shadow-glow);
    }
  }

  &.battle {
    background: linear-gradient(180deg, #8B0000 0%, #5C0000 100%);
    border-color: #FF4444;
    color: #FFFFFF;
    font-weight: bold;
    animation: pulse-glow 2s infinite;

    &:hover:not(.disabled) {
      animation: none;
      box-shadow: 0 0 30px var(--color-danger);
    }

    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 10px var(--color-danger);
      }
      50% {
        box-shadow: 0 0 25px var(--color-danger);
      }
    }
  }

  &.small {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-sm);
  }

  &.ghost {
    background: transparent;
    border-color: transparent;

    &:hover:not(.disabled) {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }
  }
}

.button-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.button-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    var(--color-accent) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
}

.button-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: inherit;

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-text-muted);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
}

.loading .button-content {
  opacity: 0;
}
</style>
