import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendMessage, parseOptions, parseBattleConfig } from '../services/messageService.js'

export const useGameStore = defineStore('game', () => {
  // ========== 加载状态 ==========
  const isLoading = ref(false)

  // ========== 故事消息 ==========
  const storyMessages = ref([
    {
      type: 'narration',
      content: '*意识逐渐恢复，刺眼的阳光透过眼皮照射进来。*\n\n你躺在一片草地上，四周是郁郁葱葱的森林。远处，一座中世纪风格的城镇若隐若现。'
    },
    {
      type: 'dialogue',
      speaker: '???',
      content: '你醒了？'
    },
    {
      type: 'narration',
      content: '一个年轻女性的声音从旁边传来。你转头望去，看到一位身穿银色盔甲的女骑士正蹲在你身边，神情中带着关切和好奇。'
    }
  ])

  // ========== 行动选项 ==========
  const actionOptions = ref([
    { label: '与她对话', action: '向她询问这是哪里' },
    { label: '检查周围', action: '观察四周环境' },
    { label: '尝试站起来', action: '尝试从地上站起来' }
  ])

  // ========== 当前战斗配置 ==========
  const currentBattleConfig = ref(null)

  // ========== 游戏状态 ==========
  const gameState = ref({
    player: {
      name: '冒险者',
      level: 1,
      exp: 0
    },
    resources: {
      gold: 100,
      supplies: 10
    },
    progress: {
      chapter: 1,
      location: '未知草地',
      mainQuest: '调查自己的处境'
    }
  })

  // ========== 军队 ==========
  const army = ref({
    commanders: [
      {
        id: 'player',
        name: '{{user}}',
        portrait: null,
        attributes: {
          leadership: 10,
          tactics: 5,
          bravery: 8
        },
        skills: [],
        unit: {
          type: '剑士',
          currentCount: 20,
          maxCount: 30,
          atk: 10,
          def: 8,
          spd: 5,
          hp: 15
        }
      }
    ]
  })

  // ========== 计算属性 ==========
  const playerName = computed(() => gameState.value.player.name)
  const currentLocation = computed(() => gameState.value.progress.location)
  const gold = computed(() => gameState.value.resources.gold)
  const supplies = computed(() => gameState.value.resources.supplies)
  const chapter = computed(() => gameState.value.progress.chapter)

  // ========== 方法 ==========
  const addMessage = (message) => {
    storyMessages.value.push(message)
  }

  const addNarration = (content) => {
    addMessage({ type: 'narration', content })
  }

  const addDialogue = (speaker, content) => {
    addMessage({ type: 'dialogue', speaker, content })
  }

  const addSystemMessage = (content) => {
    addMessage({ type: 'system', content })
  }

  const setActionOptions = (options) => {
    actionOptions.value = options
  }

  const clearActionOptions = () => {
    actionOptions.value = []
  }

  const setBattleConfig = (config) => {
    currentBattleConfig.value = config
  }

  const clearBattleConfig = () => {
    currentBattleConfig.value = null
  }

  const updateResources = (changes) => {
    if (changes.gold !== undefined) {
      gameState.value.resources.gold += changes.gold
    }
    if (changes.supplies !== undefined) {
      gameState.value.resources.supplies += changes.supplies
    }
  }

  const updateLocation = (location) => {
    gameState.value.progress.location = location
  }

  const updateChapter = (chapter) => {
    gameState.value.progress.chapter = chapter
  }

  // ========== 执行行动 ==========
  const executeAction = async (action) => {
    if (isLoading.value) return

    isLoading.value = true
    clearActionOptions()

    // 添加玩家行动到消息
    addMessage({ type: 'action', content: action })

    try {
      // 发送到LLM并获取回复
      const response = await sendMessage(action)

      // 解析回复内容
      addNarration(response)

      // 解析选项
      const options = parseOptions(response)
      if (options.length > 0) {
        setActionOptions(options)
      }

      // 检查是否触发战斗
      const battleConfig = parseBattleConfig(response)
      if (battleConfig) {
        setBattleConfig(battleConfig)
      }

      // 保存状态
      saveToST()
    } catch (error) {
      console.error('[TelainRPG] 执行行动失败:', error)
      addSystemMessage('操作失败，请稍后重试')
    } finally {
      isLoading.value = false
    }
  }

  // ========== 发送自定义输入 ==========
  const sendCustomInput = async (input) => {
    if (isLoading.value || !input.trim()) return
    await executeAction(input.trim())
  }

  // ========== 持久化 ==========
  const saveToST = () => {
    try {
      const context = window.SillyTavern?.getContext?.()
      if (context?.chatMetadata) {
        context.chatMetadata.telainGameState = {
          storyMessages: storyMessages.value,
          gameState: gameState.value,
          army: army.value
        }
        context.saveMetadata?.()
      }
    } catch (e) {
      console.warn('[TelainRPG] Failed to save to ST:', e)
    }
  }

  const loadFromST = () => {
    try {
      const context = window.SillyTavern?.getContext?.()
      const saved = context?.chatMetadata?.telainGameState
      if (saved) {
        if (saved.storyMessages) storyMessages.value = saved.storyMessages
        if (saved.gameState) gameState.value = saved.gameState
        if (saved.army) army.value = saved.army
        return true
      }
    } catch (e) {
      console.warn('[TelainRPG] Failed to load from ST:', e)
    }
    return false
  }

  return {
    // State
    storyMessages,
    actionOptions,
    currentBattleConfig,
    gameState,
    army,
    isLoading,
    // Computed
    playerName,
    currentLocation,
    gold,
    supplies,
    chapter,
    // Methods
    addMessage,
    addNarration,
    addDialogue,
    addSystemMessage,
    setActionOptions,
    clearActionOptions,
    setBattleConfig,
    clearBattleConfig,
    updateResources,
    updateLocation,
    updateChapter,
    executeAction,
    sendCustomInput,
    saveToST,
    loadFromST
  }
})
