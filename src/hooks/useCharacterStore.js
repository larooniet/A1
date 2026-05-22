import { create } from 'zustand'

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
  head: '#8B6914',
  body: '#8B6914',
  leftArm: '#8B6914',
  rightArm: '#8B6914',
  leftLeg: '#8B6914',
  rightLeg: '#8B6914',
  leftEar: '#8B6914',
  rightEar: '#8B6914',
  tail: '#654321',
  eye: '#1a1a2e',
  blush: '#D2691E',
  nose: '#2F1810',
}

// 顶点变形参数 - 橡皮泥效果
const DEFAULT_DEFORM = {
  head: { bulge: 0, pinch: 0, twist: 0 },
  body: { bulge: 0, pinch: 0, twist: 0 },
  leftArm: { bulge: 0, pinch: 0, twist: 0 },
  rightArm: { bulge: 0, pinch: 0, twist: 0 },
  leftLeg: { bulge: 0, pinch: 0, twist: 0 },
  rightLeg: { bulge: 0, pinch: 0, twist: 0 },
}

// 连接点配置 - 从表面开始
const DEFAULT_JOINTS = {
  head: { parent: 'body', anchor: [0, 0.85, 0], offset: [0, -0.5, 0] },
  leftArm: { parent: 'body', anchor: [-0.8, 0.3, 0], offset: [0, 0.5, 0] },
  rightArm: { parent: 'body', anchor: [0.8, 0.3, 0], offset: [0, 0.5, 0] },
  leftLeg: { parent: 'body', anchor: [-0.4, -0.8, 0], offset: [0, 0.5, 0] },
  rightLeg: { parent: 'body', anchor: [0.4, -0.8, 0], offset: [0, 0.5, 0] },
  leftEar: { parent: 'head', anchor: [-0.6, 0.7, 0], offset: [0, -0.3, 0] },
  rightEar: { parent: 'head', anchor: [0.6, 0.7, 0], offset: [0, -0.3, 0] },
  tail: { parent: 'body', anchor: [0, -0.5, -0.8], offset: [0, 0, 0.3] },
}

export const useCharacterStore = create((set, get) => ({
  name: '小熊',
  appearance: {
    shapes: { ...DEFAULT_SHAPES },
    colors: { ...DEFAULT_COLORS },
    scales: {},
    deform: { ...DEFAULT_DEFORM },
    joints: { ...DEFAULT_JOINTS },
    eyeSize: 1,
    eyeSpacing: 1,
    blushIntensity: 0.3,
    glowIntensity: 0.1,
    furRoughness: 0.85,
  },

  expression: 'happy',
  isJumping: false,
  isWalking: false,
  isPlaying: false,
  chatHistory: [],
  personality: 'friendly',
  showChatPanel: true,

  setName: (name) => set({ name }),

  setAppearance: (key, value) => set(state => ({
    appearance: { ...state.appearance, [key]: value }
  })),

  setDeform: (part, type, value) => set(state => ({
    appearance: {
      ...state.appearance,
      deform: {
        ...state.appearance.deform,
        [part]: { ...state.appearance.deform[part], [type]: value }
      }
    }
  })),

  setExpression: (expression) => set({ expression }),

  setWalking: (isWalking) => set({ isWalking }),
  setPlaying: (isPlaying) => set({ isPlaying }),

  toggleChatPanel: () => set(state => ({ showChatPanel: !state.showChatPanel })),

  addChatMessage: (role, content) => set(state => ({
    chatHistory: [...state.chatHistory, { role, content, timestamp: Date.now() }]
  })),

  setPersonality: (personality) => set({ personality }),

  resetAppearance: () => set({
    name: '小熊',
    appearance: {
      shapes: { ...DEFAULT_SHAPES },
      colors: { ...DEFAULT_COLORS },
      scales: {},
      deform: { ...DEFAULT_DEFORM },
      joints: { ...DEFAULT_JOINTS },
      eyeSize: 1,
      eyeSpacing: 1,
      blushIntensity: 0.3,
      glowIntensity: 0.1,
      furRoughness: 0.85,
    }
  })
}))
