<template>
  <div class="gold-border-container">
    <div class="border-decoration top-left"></div>
    <div class="border-decoration top-right"></div>
    <div class="border-decoration bottom-left"></div>
    <div class="border-decoration bottom-right"></div>
    <div class="gold-border-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gold-border-container {
  position: relative;
  background: var(--color-bg-card);
  border: 2px solid var(--color-border-gold);
  border-radius: var(--radius-md);
  box-shadow:
    inset 0 0 20px rgba(212, 175, 55, 0.1),
    0 4px 10px rgba(0, 0, 0, 0.3);
}

.border-decoration {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-accent);
  pointer-events: none;

  &.top-left {
    top: -3px;
    left: -3px;
    border-right: none;
    border-bottom: none;
    border-top-left-radius: var(--radius-md);
  }

  &.top-right {
    top: -3px;
    right: -3px;
    border-left: none;
    border-bottom: none;
    border-top-right-radius: var(--radius-md);
  }

  &.bottom-left {
    bottom: -3px;
    left: -3px;
    border-right: none;
    border-top: none;
    border-bottom-left-radius: var(--radius-md);
  }

  &.bottom-right {
    bottom: -3px;
    right: -3px;
    border-left: none;
    border-top: none;
    border-bottom-right-radius: var(--radius-md);
  }
}

.gold-border-content {
  position: relative;
}
</style>
