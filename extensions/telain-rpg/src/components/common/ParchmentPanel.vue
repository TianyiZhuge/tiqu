<template>
  <div class="parchment-panel" :class="{ 'with-border': withBorder }">
    <div class="panel-background"></div>
    <div class="panel-content">
      <slot></slot>
    </div>
    <div v-if="withBorder" class="panel-corners">
      <span class="corner top-left"></span>
      <span class="corner top-right"></span>
      <span class="corner bottom-left"></span>
      <span class="corner bottom-right"></span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  withBorder: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.parchment-panel {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.panel-background {
  position: absolute;
  inset: 0;
  background: var(--gradient-parchment);
  border: 1px solid var(--color-border);
  border-radius: inherit;
}

.panel-content {
  position: relative;
  z-index: 1;
}

.with-border {
  .panel-background {
    border-width: 2px;
    border-color: var(--color-border-gold);
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
  }
}

.panel-corners {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .corner {
    position: absolute;
    width: 20px;
    height: 20px;

    &::before {
      content: '⚜️';
      position: absolute;
      font-size: 12px;
      color: var(--color-accent);
      opacity: 0.6;
    }

    &.top-left {
      top: 4px;
      left: 4px;
    }

    &.top-right {
      top: 4px;
      right: 4px;
      &::before {
        right: 0;
      }
    }

    &.bottom-left {
      bottom: 4px;
      left: 4px;
    }

    &.bottom-right {
      bottom: 4px;
      right: 4px;
      &::before {
        right: 0;
      }
    }
  }
}
</style>
