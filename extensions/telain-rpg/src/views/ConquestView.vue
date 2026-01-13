<template>
  <div class="modal-view conquest-view">
    <div class="modal-panel glass-panel-strong">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-decoration left">
          <div class="decoration-line"></div>
        </div>
        <div class="header-title">
          <Icon name="swords" size="lg" class="title-icon" />
          <h2>征服</h2>
          <span class="subtitle">领地扩张</span>
        </div>
        <div class="header-decoration right">
          <div class="decoration-line"></div>
        </div>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Map Preview -->
        <div class="section map-section">
          <h3 class="section-title">
            <Icon name="map" size="sm" />
            <span>战役地图</span>
          </h3>
          <div class="map-preview">
            <div class="map-placeholder">
              <Icon name="compass" size="xl" class="map-icon" />
              <span>地图加载中...</span>
            </div>
          </div>
        </div>

        <!-- Territory List -->
        <div class="section territory-section">
          <h3 class="section-title">
            <Icon name="flag" size="sm" />
            <span>可征服区域</span>
          </h3>
          <div class="territory-list">
            <div class="territory-item">
              <div class="territory-info">
                <span class="territory-name">北方森林</span>
                <span class="territory-difficulty badge-warning">中等难度</span>
              </div>
              <button class="attack-btn">
                <Icon name="swords" size="sm" />
              </button>
            </div>
            <div class="territory-item">
              <div class="territory-info">
                <span class="territory-name">古堡遗迹</span>
                <span class="territory-difficulty badge-danger">高难度</span>
              </div>
              <button class="attack-btn">
                <Icon name="swords" size="sm" />
              </button>
            </div>
            <div class="territory-item locked">
              <div class="territory-info">
                <span class="territory-name">魔王城</span>
                <span class="territory-difficulty badge-magic">???</span>
              </div>
              <button class="attack-btn" disabled>
                <Icon name="x" size="sm" />
              </button>
            </div>
          </div>
        </div>

        <!-- Coming Soon Notice -->
        <div class="coming-soon-notice">
          <Icon name="info" size="sm" />
          <span>更多区域开发中...</span>
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
        var(--danger-dark)
      );
    }

    &.right .decoration-line {
      background: linear-gradient(
        90deg,
        var(--danger-dark),
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
      color: var(--danger);
      animation: pulse-scale 2s ease-in-out infinite;
    }

    h2 {
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      color: var(--danger);
      margin: 0;
      text-shadow: 0 2px 10px rgba(var(--danger-rgb), 0.3);
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
    color: var(--danger);
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--border-subtle);
  }
}

// Map
.map-preview {
  aspect-ratio: 16 / 9;
  background: rgba(var(--bg-dark-rgb), 0.5);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  color: var(--text-muted);

  .map-icon {
    opacity: 0.3;
    animation: spin 10s linear infinite;
  }

  span {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
  }
}

// Territory List
.territory-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.territory-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  background: rgba(var(--bg-card-rgb), 0.5);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);

  .territory-info {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .territory-name {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--text-primary);
  }

  .territory-difficulty {
    font-family: var(--font-ui);
    font-size: var(--text-xs);
    padding: 2px var(--space-sm);
    border-radius: var(--radius-full);

    &.badge-warning {
      background: rgba(var(--warning-rgb), 0.2);
      color: var(--warning-light);
      border: 1px solid var(--warning-dark);
    }

    &.badge-danger {
      background: rgba(var(--danger-rgb), 0.2);
      color: var(--danger-light);
      border: 1px solid var(--danger-dark);
    }

    &.badge-magic {
      background: rgba(var(--magic-rgb), 0.2);
      color: var(--magic-light);
      border: 1px solid var(--magic-dark);
    }
  }

  .attack-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gradient-battle);
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-brightest);
    cursor: pointer;
    transition: var(--transition-normal);

    &:hover:not(:disabled) {
      transform: scale(1.1);
      box-shadow: var(--shadow-glow-danger);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &.locked {
    opacity: 0.5;

    .territory-name {
      color: var(--text-muted);
    }
  }

  &:hover:not(.locked) {
    border-color: var(--danger-dark);
    background: rgba(var(--danger-rgb), 0.05);
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

@keyframes pulse-scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
