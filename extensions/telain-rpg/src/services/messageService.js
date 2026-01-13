/**
 * 消息服务 - 封装TavernHelper API调用
 */

/**
 * 发送消息并获取AI回复
 * @param {string} userInput - 用户输入内容
 * @param {Object} options - 选项
 * @returns {Promise<string>} AI回复内容
 */
export async function sendMessage(userInput, options = {}) {
  const { onSuccess, onError } = options

  try {
    // 创建用户消息
    await window.TavernHelper.createChatMessages([
      {
        role: 'user',
        message: userInput
      }
    ])

    // 获取AI回复
    const response = await window.TavernHelper.generate({
      user_input: userInput
    })

    // 创建AI回复消息
    await window.TavernHelper.createChatMessages([
      {
        role: 'assistant',
        message: response
      }
    ])

    if (onSuccess) {
      onSuccess(response)
    }

    return response
  } catch (error) {
    console.error('[MessageService] 发送消息失败:', error)
    if (onError) {
      onError(error)
    }
    throw error
  }
}

/**
 * 仅获取AI生成，不创建消息
 * @param {string} userInput - 用户输入内容
 * @returns {Promise<string>} AI回复内容
 */
export async function generateOnly(userInput) {
  try {
    const response = await window.TavernHelper.generate({
      user_input: userInput
    })
    return response
  } catch (error) {
    console.error('[MessageService] 生成失败:', error)
    throw error
  }
}

/**
 * 带上下文的AI生成，不创建外部消息
 * @param {string} userInput - 用户输入内容
 * @param {Array} storyHistory - 故事历史消息数组
 * @returns {Promise<string>} AI回复内容
 */
export async function generateWithContext(userInput, storyHistory = []) {
  try {
    // 构建上下文提示词
    let contextPrompt = ''

    if (storyHistory.length > 0) {
      contextPrompt = '【当前剧情回顾】\n'

      // 只取最近的消息避免过长（最多10条）
      const recentMessages = storyHistory.slice(-10)

      recentMessages.forEach(msg => {
        if (msg.type === 'narration') {
          contextPrompt += msg.content + '\n\n'
        } else if (msg.type === 'dialogue') {
          contextPrompt += `${msg.speaker}："${msg.content}"\n\n`
        } else if (msg.type === 'action') {
          contextPrompt += `*玩家行动：${msg.content}*\n\n`
        } else if (msg.type === 'system') {
          contextPrompt += `[系统：${msg.content}]\n\n`
        }
      })

      contextPrompt += '【玩家当前行动】\n'
    }

    const fullPrompt = contextPrompt + userInput

    const response = await window.TavernHelper.generate({
      user_input: fullPrompt
    })
    return response
  } catch (error) {
    console.error('[MessageService] 带上下文生成失败:', error)
    throw error
  }
}

/**
 * 加载历史消息
 * @param {string} range - 消息范围，默认为全部
 * @returns {Promise<Array>} 消息列表
 */
export async function loadHistoryMessages(range = '0-{{lastMessageId}}') {
  try {
    const messages = await window.TavernHelper.getChatMessages(range)
    return messages
  } catch (error) {
    console.error('[MessageService] 加载历史消息失败:', error)
    return []
  }
}

/**
 * 解析AI回复中的选项
 * @param {string} response - AI回复内容
 * @returns {Array<{label: string, action: string}>} 选项列表
 */
export function parseOptions(response) {
  const options = []

  // 匹配格式: [选项: xxx] 或 【选项: xxx】
  const optionRegex = /[【\[](选项|选择|行动)[：:]\s*([^\]】]+)[】\]]/g
  let match

  while ((match = optionRegex.exec(response)) !== null) {
    options.push({
      label: match[2].trim(),
      action: match[2].trim()
    })
  }

  // 如果没有匹配到，尝试匹配数字列表格式
  if (options.length === 0) {
    const listRegex = /^\s*(\d+)[\.、)]\s*(.+)$/gm
    while ((match = listRegex.exec(response)) !== null) {
      const text = match[2].trim()
      // 排除太长的内容（可能是描述而非选项）
      if (text.length < 30) {
        options.push({
          label: text,
          action: text
        })
      }
    }
  }

  return options
}

/**
 * 解析AI回复中的战斗配置
 * @param {string} response - AI回复内容
 * @returns {Object|null} 战斗配置
 */
export function parseBattleConfig(response) {
  // 尝试匹配JSON格式的战斗配置
  const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonMatch) {
    try {
      const config = JSON.parse(jsonMatch[1])
      if (config.type === 'battle' || config.enemies) {
        return config
      }
    } catch (e) {
      console.warn('[MessageService] 解析战斗配置JSON失败:', e)
    }
  }

  // 检查是否包含战斗关键词
  if (response.includes('战斗开始') || response.includes('遭遇敌人')) {
    return {
      type: 'battle',
      trigger: 'encounter'
    }
  }

  return null
}

export default {
  sendMessage,
  generateOnly,
  generateWithContext,
  loadHistoryMessages,
  parseOptions,
  parseBattleConfig
}
