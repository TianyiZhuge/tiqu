<template>
  <div id="telain-app" class="telain-container">
    <!-- Background Layer -->
    <div class="app-background">
      <div class="bg-overlay"></div>
      <div class="bg-particles"></div>
    </div>

    <!-- Main Content Area -->
    <div class="app-content">
      <!-- Top Info Bar -->
      <TopInfoBar />

      <!-- Page Content -->
      <main class="main-content">
        <Transition name="page" mode="out-in">
          <component :is="currentView" :key="currentTab" />
        </Transition>
      </main>

      <!-- Bottom Navigation Bar -->
      <BottomNavBar v-model="currentTab" />
    </div>

    <!-- Global Overlay Slot -->
    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="hasActiveOverlay" class="global-overlay">
          <!-- Overlays will be rendered here -->
        </div>
      </Transition>
    </Teleport>

    <!-- Notifications -->
    <div class="notifications-container">
      <TransitionGroup name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="notification.type"
        >
          <span class="notification-icon">{{ getNotificationIcon(notification.type) }}</span>
          <span class="notification-text">{{ notification.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'

// Layout Components
import TopInfoBar from '@/components/layout/TopInfoBar.vue'
import BottomNavBar from '@/components/layout/BottomNavBar.vue'

// Views
import MainView from '@/views/MainView.vue'
import TrainingView from '@/views/TrainingView.vue'
import ConquestView from '@/views/ConquestView.vue'
import FormationView from '@/views/FormationView.vue'
import DevelopmentView from '@/views/DevelopmentView.vue'

// Stores
const gameStore = useGameStore()
const uiStore = useUIStore()

const { hasActiveOverlay, notifications } = storeToRefs(uiStore)

// Current tab
const currentTab = ref('main')

// View mapping
const viewMap = {
  main: MainView,
  training: TrainingView,
  conquest: ConquestView,
  formation: FormationView,
  development: DevelopmentView
}

const currentView = computed(() => viewMap[currentTab.value])

// Notification icons
const getNotificationIcon = (type) => {
  const icons = {
    info: 'i',
    success: '✓',
    warning: '!',
    error: '✕'
  }
  return icons[type] || 'i'
}

// Provide stores to child components
provide('gameStore', gameStore)
provide('uiStore', uiStore)

// Load saved state on mount
onMounted(() => {
  gameStore.loadFromST()
})
</script>

<style lang="scss">
@import '@/assets/styles/variables.scss';

#telain-app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

// Notifications
.notifications-container {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  pointer-events: none;
}

.notification {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
  min-width: 200px;

  .notification-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: var(--font-size-sm);
    font-weight: bold;
  }

  .notification-text {
    flex: 1;
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
  }

  &.info {
    border-color: var(--color-info);
    .notification-icon {
      background: var(--color-info);
      color: white;
    }
  }

  &.success {
    border-color: var(--color-success);
    .notification-icon {
      background: var(--color-success);
      color: white;
    }
  }

  &.warning {
    border-color: var(--color-warning);
    .notification-icon {
      background: var(--color-warning);
      color: white;
    }
  }

  &.error {
    border-color: var(--color-danger);
    .notification-icon {
      background: var(--color-danger);
      color: white;
    }
  }
}

// Notification transitions
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
