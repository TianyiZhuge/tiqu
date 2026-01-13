<template>
  <div class="action-menu">
    <div v-if="!isSelectingTarget" class="action-buttons">
      <MagicButton @click="$emit('attack')">
        <span class="action-icon">⚔️</span>
        攻击
      </MagicButton>

      <MagicButton @click="$emit('defend')">
        <span class="action-icon">🛡️</span>
        防御
      </MagicButton>

      <MagicButton @click="$emit('skill')" :disabled="!hasSkills">
        <span class="action-icon">✨</span>
        技能
      </MagicButton>

      <MagicButton variant="ghost" @click="$emit('retreat')">
        <span class="action-icon">🏃</span>
        撤退
      </MagicButton>
    </div>

    <div v-else class="target-selection">
      <div class="selection-prompt">
        <span class="prompt-icon">🎯</span>
        <span class="prompt-text">选择攻击目标</span>
      </div>

      <MagicButton variant="ghost" @click="$emit('cancel')">
        取消
      </MagicButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MagicButton from '@/components/common/MagicButton.vue'

const props = defineProps({
  currentUnit: {
    type: Object,
    default: null
  },
  isSelectingTarget: {
    type: Boolean,
    default: false
  }
})

defineEmits(['attack', 'defend', 'skill', 'retreat', 'cancel'])

const hasSkills = computed(() => {
  return props.currentUnit?.skills?.length > 0
})
</script>

<style lang="scss" scoped>
.action-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;

  .magic-button {
    min-width: 80px;
  }

  .action-icon {
    margin-right: var(--spacing-xs);
  }
}

.target-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-lg);

  .selection-prompt {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--color-accent);
    animation: pulse 1.5s infinite;

    .prompt-icon {
      font-size: 20px;
    }

    .prompt-text {
      font-size: var(--font-size-base);
      font-weight: bold;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
