<template>
  <div class="placeholder-view development-view">
    <ParchmentPanel class="placeholder-panel" :with-border="true">
      <div class="placeholder-content">
        <span class="placeholder-icon">📈</span>
        <h2>发展</h2>
        <p>资源管理、建筑升级、科技树</p>
        <p class="coming-soon">开发中...</p>
      </div>
    </ParchmentPanel>
  </div>
</template>

<script setup>
import ParchmentPanel from '@/components/common/ParchmentPanel.vue'
</script>

<style lang="scss" scoped>
.placeholder-view {
  height: 100%;
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;

  .placeholder-panel {
    width: 100%;
    max-width: 400px;
  }

  .placeholder-content {
    padding: var(--spacing-xl);
    text-align: center;

    .placeholder-icon {
      font-size: 64px;
      display: block;
      margin-bottom: var(--spacing-md);
    }

    h2 {
      color: var(--color-accent);
      margin-bottom: var(--spacing-sm);
    }

    p {
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-sm);
    }

    .coming-soon {
      color: var(--color-text-muted);
      font-style: italic;
      margin-top: var(--spacing-lg);
    }
  }
}
</style>
