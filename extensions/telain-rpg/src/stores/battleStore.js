import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBattleStore = defineStore('battle', () => {
  // ========== 战斗状态 ==========
  const isBattleActive = ref(false)
  const currentTurn = ref(0)
  const battlePhase = ref('idle') // idle, player_turn, enemy_turn, battle_end

  // ========== 阵营 ==========
  const allies = ref([])
  const enemies = ref([])

  // ========== 当前行动单位 ==========
  const currentUnitIndex = ref(0)
  const turnOrder = ref([])

  // ========== 战斗日志 ==========
  const battleLogs = ref([])

  // ========== 战斗配置 ==========
  const battleConfig = ref(null)

  // ========== 计算属性 ==========
  const currentUnit = computed(() => {
    if (turnOrder.value.length === 0) return null
    return turnOrder.value[currentUnitIndex.value]
  })

  const isPlayerTurn = computed(() => {
    if (!currentUnit.value) return false
    return !currentUnit.value.isEnemy
  })

  const isBattleOver = computed(() => {
    const aliveAllies = allies.value.filter(u => !u.isDefeated)
    const aliveEnemies = enemies.value.filter(u => !u.isDefeated)
    return aliveAllies.length === 0 || aliveEnemies.length === 0
  })

  const isVictory = computed(() => {
    if (!isBattleOver.value) return null
    const aliveEnemies = enemies.value.filter(u => !u.isDefeated)
    return aliveEnemies.length === 0
  })

  // ========== 方法 ==========
  const initBattle = (config) => {
    battleConfig.value = config
    currentTurn.value = 1
    battlePhase.value = 'player_turn'
    battleLogs.value = []

    // 初始化我方单位
    allies.value = (config.allies || []).map((unit, index) => ({
      ...unit,
      id: `ally_${index}`,
      isEnemy: false,
      isDefeated: false,
      isDefending: false
    }))

    // 初始化敌方单位
    enemies.value = (config.enemies || []).map((unit, index) => ({
      ...unit,
      id: `enemy_${index}`,
      isEnemy: true,
      isDefeated: false,
      isDefending: false
    }))

    // 计算回合顺序（按速度排序）
    calculateTurnOrder()

    // 添加战斗开始日志
    addLog('system', `战斗开始！回合 ${currentTurn.value}`)

    isBattleActive.value = true
  }

  const calculateTurnOrder = () => {
    const allUnits = [
      ...allies.value.filter(u => !u.isDefeated),
      ...enemies.value.filter(u => !u.isDefeated)
    ]
    turnOrder.value = allUnits.sort((a, b) => b.unit.spd - a.unit.spd)
    currentUnitIndex.value = 0
  }

  const nextTurn = () => {
    currentUnitIndex.value++

    if (currentUnitIndex.value >= turnOrder.value.length) {
      // 新回合
      currentTurn.value++
      currentUnitIndex.value = 0
      calculateTurnOrder()
      addLog('system', `回合 ${currentTurn.value} 开始`)
    }

    // 更新战斗阶段
    if (currentUnit.value) {
      battlePhase.value = currentUnit.value.isEnemy ? 'enemy_turn' : 'player_turn'
    }

    // 检查战斗结束
    if (isBattleOver.value) {
      battlePhase.value = 'battle_end'
    }
  }

  const executeAttack = (attacker, defender) => {
    if (!attacker || !defender) return

    const damage = calculateDamage(attacker, defender)
    const casualties = applyCasualties(defender, damage)

    addLog('combat',
      `${attacker.name}【${attacker.unit.type}×${attacker.unit.currentCount}】` +
      `攻击${defender.name}【${defender.unit.type}】，` +
      `造成 ${damage} 伤害，击杀 ${casualties} 人`
    )

    // 检查是否击败
    if (defender.unit.currentCount <= 0) {
      defender.isDefeated = true
      addLog('system', `${defender.name} 被击败！`)
    }

    // 下一个单位行动
    nextTurn()
  }

  const executeDefend = (unit) => {
    if (!unit) return
    unit.isDefending = true
    addLog('combat', `${unit.name} 选择防御，防御力提升50%`)
    nextTurn()
  }

  const calculateDamage = (attacker, defender) => {
    const baseAtk = attacker.unit.atk * attacker.unit.currentCount
    let baseDef = defender.unit.def

    // 防御状态下防御力提升50%
    if (defender.isDefending) {
      baseDef = Math.floor(baseDef * 1.5)
    }

    const damage = Math.max(1, baseAtk - baseDef * 2)

    // 添加随机浮动（±10%）
    const variance = damage * 0.1
    return Math.floor(damage + (Math.random() * variance * 2 - variance))
  }

  const applyCasualties = (unit, damage) => {
    const hpPerUnit = unit.unit.hp || 15
    const casualties = Math.ceil(damage / hpPerUnit)
    const actualCasualties = Math.min(casualties, unit.unit.currentCount)
    unit.unit.currentCount -= actualCasualties
    return actualCasualties
  }

  const addLog = (type, message) => {
    battleLogs.value.push({
      id: Date.now(),
      type,
      message,
      turn: currentTurn.value
    })
  }

  const startBattle = (config) => {
    initBattle(config)
  }

  const pauseBattle = () => {
    // 不结束战斗，只是隐藏面板
  }

  const endBattle = (result) => {
    isBattleActive.value = false
    battlePhase.value = 'idle'
  }

  const getBattleResult = () => {
    return {
      victory: isVictory.value,
      turns: currentTurn.value,
      allySurvivors: allies.value.filter(u => !u.isDefeated).map(u => ({
        name: u.name,
        remaining: u.unit.currentCount
      })),
      enemiesDefeated: enemies.value.filter(u => u.isDefeated).map(u => u.name),
      logs: battleLogs.value
    }
  }

  const resetBattle = () => {
    isBattleActive.value = false
    currentTurn.value = 0
    battlePhase.value = 'idle'
    allies.value = []
    enemies.value = []
    turnOrder.value = []
    battleLogs.value = []
    battleConfig.value = null
  }

  return {
    // State
    isBattleActive,
    currentTurn,
    battlePhase,
    allies,
    enemies,
    turnOrder,
    battleLogs,
    battleConfig,
    // Computed
    currentUnit,
    isPlayerTurn,
    isBattleOver,
    isVictory,
    // Methods
    initBattle,
    startBattle,
    pauseBattle,
    endBattle,
    executeAttack,
    executeDefend,
    nextTurn,
    addLog,
    getBattleResult,
    resetBattle
  }
})
