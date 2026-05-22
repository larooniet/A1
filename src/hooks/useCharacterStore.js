import { create } from 'zustand'

export const useCharacterStore = create((set, get) => ({
  // 外观参数
  appearance: {
    bodyColor: '#ffb6c1',
    bellyColor: '#ff69b4',
    eyeSize: 1,
    eyeSpacing: 1,
    earSize: 1,
    earAngle: 0.3,
    bodyRoundness: 1.15,
    blushIntensity: 0.4,
    glowIntensity: 0.3,
    furRoughness: 0.9,
  },

  // 表情状态
  expression: 'happy', // happy, surprised, sleepy, excited, curious

  // 动画状态
  isJumping: false,
  isWaving: false,

  // 对话历史
  chatHistory: [],

  // 预设性格
  personality: 'friendly', // friendly, tsundere, philosopher, comedian

  // 动作
  setAppearance: (key, value) => set(state => ({
    appearance: { ...state.appearance, [key]: value }
  })),

  setExpression: (expression) => set({ expression }),

  addChatMessage: (role, content) => set(state => ({
    chatHistory: [...state.chatHistory, { role, content, timestamp: Date.now() }]
  })),

  setPersonality: (personality) => set({ personality }),

  resetAppearance: () => set({
    appearance: {
      bodyColor: '#ffb6c1',
      bellyColor: '#ff69b4',
      eyeSize: 1,
      eyeSpacing: 1,
      earSize: 1,
      earAngle: 0.3,
      bodyRoundness: 1.15,
      blushIntensity: 0.4,
      glowIntensity: 0.3,
      furRoughness: 0.9,
    }
  })
}))
