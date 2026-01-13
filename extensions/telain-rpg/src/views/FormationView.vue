<template>
  <div class="modal-view formation-view">
    <div class="modal-panel glass-panel-strong">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-decoration left">
          <div class="decoration-line"></div>
        </div>
        <div class="header-title">
          <Icon name="castle" size="lg" class="title-icon" />
          <h2>编制</h2>
          <span class="subtitle">军队管理</span>
        </div>
        <div class="header-decoration right">
          <div class="decoration-line"></div>
        </div>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Unit Slots -->
        <div class="section units-section">
          <h3 class="section-title">
            <Icon name="users" size="sm" />
            <span>部队编成</span>
          </h3>
          <div class="unit-slots">
            <div class="unit-slot filled">
              <div class="unit-icon">
                <Icon name="sword" size="md" />
              </div>
              <div class="unit-info">
                <span class="unit-type">剑士</span>
                <span class="unit-count">20/30</span>
              </div>
            </div>
            <div class="unit-slot filled">
              <div class="unit-icon archer">
                <Icon name="star" size="md" />
              </div>
              <div class="unit-info">
                <span class="unit-type">弓箭手</span>
                <span class="unit-count">25/25</span>
              </div>
            </div>
            <div class="unit-slot empty">
              <Icon name="plus" size="lg" class="add-icon" />
              <span class="add-text">添加部队</span>
            </div>
          </div>
        </div>

        <!-- Formation Grid -->
        <div class="section formation-section">
          <h3 class="section-title">
            <Icon name="map" size="sm" />
            <span>阵型布置</span>
          </h3>
          <div class="formation-grid">
            <div class="grid-row">
              <div class="grid-cell"></div>
              <div class="grid-cell occupied front">前</div>
              <div class="grid-cell"></div>
            </div>
            <div class="grid-row">
              <div class="grid-cell occupied left">左</div>
              <div class="grid-cell center">
                <Icon name="flag" size="sm" />
              </div>
              <div class="grid-cell occupied right">右</div>
            </div>
            <div class="grid-row">
              <div class="grid-cell"></div>
              <div class="grid-cell occupied back">后</div>
              <div class="grid-cell"></div>
            </div>
          </div>
        </div>

        <!-- Coming Soon Notice -->
        <div class="coming-soon-notice">
          <Icon name="info" size="sm" />
          <span>拖拽编辑功能开发中...</span>
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
  max-height: 80vh;
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
        var(--info-dark)
      );
    }

    &.right .decoration-line {
      background: linear-gradient(
        90deg,
        var(--info-dark),
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
      color: var(--info);
      animation: float-gentle 3s ease-in-out infinite;
    }

    h2 {
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      color: var(--info);
      margin: 0;
      text-shadow: 0 2px 10px rgba(var(--info-rgb), 0.3);
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
    color: var(--info);
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--border-subtle);
  }
}

// Unit Slots
.unit-slots {
  display: flex;
  gap: var(--space-md);
}

.unit-slot {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: rgba(var(--bg-card-rgb), 0.5);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  cursor: pointer;

  .unit-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gradient-gold);
    border-radius: var(--radius-md);
    color: var(--bg-deepest);

    &.archer {
      background: var(--gradient-magic);
    }
  }

  .unit-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .unit-type {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--text-primary);
  }

  .unit-count {
    font-family: var(--font-ui);
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  &.empty {
    border-style: dashed;
    opacity: 0.5;

    .add-icon {
      color: var(--text-muted);
    }

    .add-text {
      font-family: var(--font-ui);
      font-size: var(--text-xs);
      color: var(--text-muted);
    }

    &:hover {
      opacity: 0.8;
      border-color: var(--info);
    }
  }

  &.filled:hover {
    border-color: var(--info);
    background: rgba(var(--info-rgb), 0.1);
  }
}

// Formation Grid
.formation-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  align-items: center;
}

.grid-row {
  display: flex;
  gap: var(--space-xs);
}

.grid-cell {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--bg-dark-rgb), 0.3);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  color: var(--text-muted);
  transition: var(--transition-normal);

  &.occupied {
    background: rgba(var(--info-rgb), 0.2);
    border-color: var(--info-dark);
    color: var(--info-light);
  }

  &.center {
    background: rgba(var(--gold-primary-rgb), 0.2);
    border-color: var(--gold-dark);
    color: var(--gold-primary);
  }

  &:hover:not(.center) {
    border-color: var(--info);
    background: rgba(var(--info-rgb), 0.1);
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
