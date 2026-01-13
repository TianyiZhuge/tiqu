<template>
  <div class="modal-view training-view">
    <div class="modal-panel glass-panel-strong">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-decoration left">
          <div class="decoration-line"></div>
        </div>
        <div class="header-title">
          <Icon name="sparkles" size="lg" class="title-icon" />
          <h2>调教</h2>
          <span class="subtitle">角色培养</span>
        </div>
        <div class="header-decoration right">
          <div class="decoration-line"></div>
        </div>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Character List Section -->
        <div class="section character-list">
          <h3 class="section-title">
            <Icon name="users" size="sm" />
            <span>将领列表</span>
          </h3>
          <div class="character-grid">
            <div
              v-for="i in 6"
              :key="i"
              class="character-slot"
              :class="{ empty: i > 2 }"
            >
              <div v-if="i <= 2" class="character-avatar">
                <Icon name="user" size="lg" />
              </div>
              <div v-else class="empty-slot">
                <Icon name="plus" size="md" />
              </div>
              <span v-if="i <= 2" class="character-name">将领 {{ i }}</span>
            </div>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="section stats-section">
          <h3 class="section-title">
            <Icon name="trendingUp" size="sm" />
            <span>属性培养</span>
          </h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">力量</span>
              <div class="stat-bar">
                <div class="stat-fill" style="width: 65%"></div>
              </div>
              <span class="stat-value">65</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">敏捷</span>
              <div class="stat-bar">
                <div class="stat-fill" style="width: 45%"></div>
              </div>
              <span class="stat-value">45</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">智力</span>
              <div class="stat-bar">
                <div class="stat-fill" style="width: 80%"></div>
              </div>
              <span class="stat-value">80</span>
            </div>
          </div>
        </div>

        <!-- Coming Soon Notice -->
        <div class="coming-soon-notice">
          <Icon name="info" size="sm" />
          <span>更多功能开发中...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@/components/icons'
</script>

<style lang="scss" scoped>
.modal-view {
  height: 100%;
  padding: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-panel {
  width: 100%;
  max-width: 600px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  animation: scale-in 0.3s ease-out;
}

// Header
.modal-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);

  .header-decoration {
    flex: 1;

    .decoration-line {
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--gold-dark)
      );
    }

    &.right .decoration-line {
      background: linear-gradient(
        90deg,
        var(--gold-dark),
        transparent
      );
    }
  }

  .header-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);

    .title-icon {
      color: var(--gold-bright);
      animation: float-gentle 3s ease-in-out infinite;
    }

    h2 {
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      color: var(--gold-primary);
      margin: 0;
      text-shadow: 0 2px 10px rgba(var(--gold-primary-rgb), 0.3);
    }

    .subtitle {
      font-family: var(--font-ui);
      font-size: var(--text-xs);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }
}

// Content
.modal-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

// Sections
.section {
  .section-title {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--gold-primary);
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--border-subtle);
  }
}

// Character Grid
.character-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
}

.character-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: rgba(var(--bg-card-rgb), 0.5);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  cursor: pointer;

  .character-avatar {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gradient-gold);
    border-radius: var(--radius-full);
    color: var(--bg-deepest);
  }

  .character-name {
    font-family: var(--font-ui);
    font-size: var(--text-xs);
    color: var(--text-primary);
  }

  &.empty {
    border-style: dashed;
    opacity: 0.5;

    .empty-slot {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }
  }

  &:hover:not(.empty) {
    border-color: var(--gold-primary);
    background: rgba(var(--gold-primary-rgb), 0.1);
  }
}

// Stats
.stats-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  .stat-label {
    width: 48px;
    font-family: var(--font-ui);
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }

  .stat-bar {
    flex: 1;
    height: 8px;
    background: var(--bg-dark);
    border-radius: var(--radius-full);
    overflow: hidden;

    .stat-fill {
      height: 100%;
      background: var(--gradient-gold);
      border-radius: var(--radius-full);
      transition: width 0.5s ease-out;
    }
  }

  .stat-value {
    width: 32px;
    font-family: var(--font-ui);
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--gold-primary);
    text-align: right;
  }
}

// Coming Soon
.coming-soon-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: rgba(var(--info-rgb), 0.1);
  border: 1px solid rgba(var(--info-rgb), 0.3);
  border-radius: var(--radius-md);
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  color: var(--info-light);
}

// Animations
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
