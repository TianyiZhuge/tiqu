import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles/base.scss'
import './assets/styles/animations.scss'

// 酒馆助手入口 - 使用jQuery ready包装
$(() => {
  console.log('[Telain RPG] Initializing in Tavern Helper...')

  // Create Vue app
  const app = createApp(App)

  // Use Pinia for state management
  const pinia = createPinia()
  app.use(pinia)

  // Mount to #app
  app.mount('#app')

  console.log('[Telain RPG] App mounted successfully')
})
