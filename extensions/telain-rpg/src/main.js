import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles/base.scss'
import './assets/styles/animations.scss'

// 酒馆助手入口 - 使用jQuery ready包装
$(() => {
  try {
    console.log('[Telain RPG] Initializing...')
    console.log('[Telain RPG] Vue:', typeof Vue !== 'undefined' ? 'available' : 'missing')
    console.log('[Telain RPG] Pinia:', typeof Pinia !== 'undefined' ? 'available' : 'missing')

    // Create Vue app
    const app = createApp(App)
    console.log('[Telain RPG] Vue app created')

    // Use Pinia for state management
    const pinia = createPinia()
    app.use(pinia)
    console.log('[Telain RPG] Pinia added')

    // Mount to #app
    const mountEl = document.getElementById('app')
    console.log('[Telain RPG] Mount element:', mountEl ? 'found' : 'missing')

    app.mount('#app')
    console.log('[Telain RPG] App mounted successfully')
  } catch (err) {
    console.error('[Telain RPG] Error:', err)
    document.body.innerHTML = '<div style="color:red;padding:20px;">Error: ' + err.message + '</div>'
  }
})
