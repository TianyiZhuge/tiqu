import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // ========== 当前标签页 ==========
  const currentTab = ref('main')

  // ========== 加载状态 ==========
  const isLoading = ref(false)
  const loadingMessage = ref('')

  // ========== 遮罩层状态 ==========
  const overlays = ref([])

  // ========== 通知 ==========
  const notifications = ref([])

  // ========== 设置 ==========
  const settings = ref({
    enableSound: true,
    enableVibration: true,
    textSpeed: 'normal', // slow, normal, fast
    autoScroll: true
  })

  // ========== 计算属性 ==========
  const hasActiveOverlay = computed(() => overlays.value.length > 0)

  const topOverlay = computed(() => {
    return overlays.value.length > 0
      ? overlays.value[overlays.value.length - 1]
      : null
  })

  // ========== 方法 ==========
  const setTab = (tab) => {
    currentTab.value = tab
  }

  const setLoading = (loading, message = '') => {
    isLoading.value = loading
    loadingMessage.value = message
  }

  const pushOverlay = (overlay) => {
    overlays.value.push({
      id: Date.now(),
      ...overlay
    })
  }

  const popOverlay = () => {
    overlays.value.pop()
  }

  const clearOverlays = () => {
    overlays.value = []
  }

  const addNotification = (notification) => {
    const id = Date.now()
    notifications.value.push({
      id,
      type: 'info',
      duration: 3000,
      ...notification
    })

    // 自动移除
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 3000)
    }

    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const updateSettings = (newSettings) => {
    settings.value = { ...settings.value, ...newSettings }
    saveSettings()
  }

  const saveSettings = () => {
    try {
      localStorage.setItem('telain-rpg-settings', JSON.stringify(settings.value))
    } catch (e) {
      console.warn('[TelainRPG] Failed to save settings:', e)
    }
  }

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('telain-rpg-settings')
      if (saved) {
        settings.value = { ...settings.value, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.warn('[TelainRPG] Failed to load settings:', e)
    }
  }

  // 初始化时加载设置
  loadSettings()

  return {
    // State
    currentTab,
    isLoading,
    loadingMessage,
    overlays,
    notifications,
    settings,
    // Computed
    hasActiveOverlay,
    topOverlay,
    // Methods
    setTab,
    setLoading,
    pushOverlay,
    popOverlay,
    clearOverlays,
    addNotification,
    removeNotification,
    updateSettings,
    saveSettings,
    loadSettings
  }
})
