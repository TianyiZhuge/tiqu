<template>
  <div class="loading-magic-circle" :class="size">
    <div class="circle-outer">
      <div class="rune rune-1">✧</div>
      <div class="rune rune-2">✦</div>
      <div class="rune rune-3">✧</div>
      <div class="rune rune-4">✦</div>
    </div>
    <div class="circle-inner">
      <div class="core-glow"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large'].includes(v)
  }
})
</script>

<style lang="scss" scoped>
.loading-magic-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &.small {
    width: 30px;
    height: 30px;
    .circle-outer { width: 30px; height: 30px; }
    .circle-inner { width: 15px; height: 15px; }
    .rune { font-size: 8px; }
  }

  &.medium {
    width: 50px;
    height: 50px;
    .circle-outer { width: 50px; height: 50px; }
    .circle-inner { width: 25px; height: 25px; }
    .rune { font-size: 10px; }
  }

  &.large {
    width: 80px;
    height: 80px;
    .circle-outer { width: 80px; height: 80px; }
    .circle-inner { width: 40px; height: 40px; }
    .rune { font-size: 14px; }
  }
}

.circle-outer {
  position: absolute;
  border: 2px solid var(--color-accent);
  border-radius: 50%;
  animation: magic-spin 3s linear infinite;
  opacity: 0.8;

  .rune {
    position: absolute;
    color: var(--color-accent);

    &.rune-1 { top: -8px; left: 50%; transform: translateX(-50%); }
    &.rune-2 { right: -8px; top: 50%; transform: translateY(-50%); }
    &.rune-3 { bottom: -8px; left: 50%; transform: translateX(-50%); }
    &.rune-4 { left: -8px; top: 50%; transform: translateY(-50%); }
  }
}

.circle-inner {
  position: absolute;
  border: 1px solid var(--color-accent-light);
  border-radius: 50%;
  animation: magic-spin 2s linear infinite reverse;
  opacity: 0.6;
}

.core-glow {
  position: absolute;
  inset: 30%;
  background: var(--color-accent);
  border-radius: 50%;
  filter: blur(3px);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes magic-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
</style>
