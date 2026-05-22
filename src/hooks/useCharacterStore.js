import { create } from 'zustand'

// 默认小熊形象
const DEFAULT_SHAPES = {
  head: 'sphere',
  body: 'capsule',
  leftArm: 'capsule',
  rightArm: 'capsule',
  leftLeg: 'capsule',
  rightLeg: 'capsule',
  leftEar: 'sphere',
  rightEar: 'sphere',
  tail: 'sphere',
}

const DEFAULT_COLORS = {
  head: '#8B6914',      // 深棕色
  body: '#8B6914',
  leftArm: '#8B6914',
  rightArm: '#8B6914',
  leftLeg: '#8B6914',
  rightLeg: '#8B6914',
  leftEar: '#8B6914',
  rightEar: '#8B6914',
  tail: '#654321',      // 更深棕色
  eye: '#1a1a2e',
  blush: '#D2691E',
  nose: '#2F1810',
}

const DEFAULT_SCALES = {
  head: { x: 1.2, y: 1.0, z: 1.1 },
  body: { x: 1.3, y: 1.0, z: 1.2 },
  leftArm: { x: 0.6, y: 1.0, z: 0.6 },
  rightArm: { x: 0.6, y: 1.0, z: 0.6 },
  leftLeg: { x: 0.7, y: 0.9, z: 0.7 },
  rightLeg: { x: 0.7, y: 0.9, z: 0.7 },
  leftEar: { x: 0.8, y: 0.8, z: 0.5 },
  rightEar: { x: 0.8, y: 0.8, z: 0.5 },
  tail: { x: 0.5, y: 0.5, z: 0.5 },
}

export const useCharacterStore = create((set, get) => ({
  name: '小熊',  // 可自定义名字
  appearance: {
    shapes: { ...DEFAULT_SHAPES },
    colors: { ...DEFAULT_COLORS },
    scales: { ...DEFAULT_SCALES },
    eyeSize: 1,
    eyeSpacing: 1,
    blushIntensity: 0.3,
    glowIntensity: 0.1,
    furRoughness: 0.85,
  },

  expression: 'happy',
  isJumping: false,
  chatHistory: [],
  personality: 'friendly',

  setName: (name) => set({ name }),

  setAppearance: (key, value) => set(state => ({
    appearance: { ...state.appearance, [key]: value }
  })),

  setExpression: (expression) => set({ expression }),

  addChatMessage: (role, content) => set(state => ({
    chatHistory: [...state.chatHistory, { role, content, timestamp: Date.now() }]
  })),

  setPersonality: (personality) => set({ personality }),

  resetAppearance: () => set({
    name: '小熊',
    appearance: {
      shapes: { ...DEFAULT_SHAPES },
      colors: { ...DEFAULT_COLORS },
      scales: { ...DEFAULT_SCALES },
      eyeSize: 1,
      eyeSpacing: 1,
      blushIntensity: 0.3,
      glowIntensity: 0.1,
      furRoughness: 0.85,
    }
  })
}))
