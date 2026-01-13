<template>
  <div class="ornament-divider" :class="type">
    <span class="divider-line left"></span>
    <span class="divider-ornament">{{ ornament }}</span>
    <span class="divider-line right"></span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'normal',
    validator: (v) => ['normal', 'top', 'bottom', 'simple'].includes(v)
  }
})

const ornament = computed(() => {
  const ornaments = {
    normal: '◆',
    top: '▼',
    bottom: '▲',
    simple: '●'
  }
  return ornaments[props.type]
})
</script>

<style lang="scss" scoped>
.ornament-divider {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
  opacity: 0.6;

  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--color-accent) 50%,
      transparent
    );

    &.left {
      background: linear-gradient(90deg, transparent, var(--color-accent));
    }

    &.right {
      background: linear-gradient(90deg, var(--color-accent), transparent);
    }
  }

  .divider-ornament {
    color: var(--color-accent);
    font-size: var(--font-size-xs);
  }

  &.top {
    .divider-ornament {
      font-size: 10px;
    }
  }

  &.bottom {
    .divider-ornament {
      font-size: 10px;
    }
  }

  &.simple {
    .divider-ornament {
      font-size: 8px;
    }
  }
}
</style>
