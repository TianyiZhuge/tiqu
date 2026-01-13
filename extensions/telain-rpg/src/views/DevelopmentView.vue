<template>
  <div class="modal-view development-view">
    <div class="modal-panel glass-panel-strong">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-decoration left">
          <div class="decoration-line"></div>
        </div>
        <div class="header-title">
          <Icon name="trendingUp" size="lg" class="title-icon" />
          <h2>发展</h2>
          <span class="subtitle">资源建设</span>
        </div>
        <div class="header-decoration right">
          <div class="decoration-line"></div>
        </div>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Resources Overview -->
        <div class="section resources-section">
          <h3 class="section-title">
            <Icon name="coins" size="sm" />
            <span>资源概览</span>
          </h3>
          <div class="resources-grid">
            <div class="resource-card gold">
              <Icon name="coins" size="md" class="resource-icon" />
              <div class="resource-info">
                <span class="resource-value">1,250</span>
                <span class="resource-label">金币</span>
              </div>
              <span class="resource-rate">+50/回合</span>
            </div>
            <div class="resource-card supplies">
              <Icon name="box" size="md" class="resource-icon" />
              <div class="resource-info">
                <span class="resource-value">480</span>
                <span class="resource-label">补给</span>
              </div>
              <span class="resource-rate">+20/回合</span>
            </div>
            <div class="resource-card population">
              <Icon name="users" size="md" class="resource-icon" />
              <div class="resource-info">
                <span class="resource-value">320</span>
                <span class="resource-label">人口</span>
              </div>
              <span class="resource-rate">上限: 500</span>
            </div>
          </div>
        </div>

        <!-- Buildings -->
        <div class="section buildings-section">
          <h3 class="section-title">
            <Icon name="castle" size="sm" />
            <span>建筑列表</span>
          </h3>
          <div class="buildings-list">
            <div class="building-item">
              <div class="building-icon">
                <Icon name="castle" size="md" />
              </div>
              <div class="building-info">
                <span class="building-name">城堡</span>
                <span class="building-level">Lv.2</span>
              </div>
              <button class="upgrade-btn">
                <Icon name="arrowUp" size="sm" />
                <span>升级</span>
              </button>
            </div>
            <div class="building-item">
              <div class="building-icon market">
                <Icon name="coins" size="md" />
              </div>
              <div class="building-info">
                <span class="building-name">市场</span>
                <span class="building-level">Lv.1</span>
              </div>
              <button class="upgrade-btn">
                <Icon name="arrowUp" size="sm" />
                <span>升级</span>
              </button>
            </div>
            <div class="building-item locked">
              <div class="building-icon">
                <Icon name="zap" size="md" />
              </div>
              <div class="building-info">
                <span class="building-name">魔法塔</span>
                <span class="building-level">未解锁</span>
              </div>
              <button class="upgrade-btn" disabled>
                <Icon name="x" size="sm" />
              </button>
            </div>
          </div>
        </div>

        <!-- Coming Soon Notice -->
        <div class="coming-soon-notice">
          <Icon name="info" size="sm" />
          <span>科技树系统开发中...</span>
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
        var(--success-dark)
      );
    }

    &.right .decoration-line {
      background: linear-gradient(
        90deg,
        var(--success-dark),
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
      color: var(--success);
      animation: bounce-slow 2s ease-in-out infinite;
    }

    h2 {
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      color: var(--success);
      margin: 0;
      text-shadow: 0 2px 10px rgba(var(--success-rgb), 0.3);
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
    color: var(--success);
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--border-subtle);
  }
}

// Resources Grid
.resources-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
}

.resource-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: rgba(var(--bg-card-rgb), 0.5);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);

  .resource-icon {
    color: var(--gold-primary);
  }

  .resource-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .resource-value {
    font-family: var(--font-ui);
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .resource-label {
    font-family: var(--font-ui);
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .resource-rate {
    font-family: var(--font-ui);
    font-size: var(--text-xs);
    color: var(--success);
  }

  &.gold {
    .resource-icon {
      color: var(--gold-bright);
    }
  }

  &.supplies {
    .resource-icon {
      color: var(--warning);
    }
  }

  &.population {
    .resource-icon {
      color: var(--info);
    }
    .resource-rate {
      color: var(--text-muted);
    }
  }

  &:hover {
    border-color: var(--success-dark);
    background: rgba(var(--success-rgb), 0.05);
  }
}

// Buildings List
.buildings-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.building-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: rgba(var(--bg-card-rgb), 0.5);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);

  .building-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gradient-gold);
    border-radius: var(--radius-md);
    color: var(--bg-deepest);

    &.market {
      background: var(--gradient-magic);
    }
  }

  .building-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .building-name {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--text-primary);
  }

  .building-level {
    font-family: var(--font-ui);
    font-size: var(--text-xs);
    color: var(--gold-primary);
  }

  .upgrade-btn {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    font-family: var(--font-ui);
    font-size: var(--text-xs);
    color: var(--bg-deepest);
    background: var(--success);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition-normal);

    &:hover:not(:disabled) {
      background: var(--success-light);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      background: var(--text-muted);
    }
  }

  &.locked {
    opacity: 0.5;

    .building-icon {
      background: var(--bg-light);
    }

    .building-level {
      color: var(--text-muted);
    }
  }

  &:hover:not(.locked) {
    border-color: var(--success-dark);
    background: rgba(var(--success-rgb), 0.05);
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

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
