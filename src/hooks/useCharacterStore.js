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
  tail: 'capsule',
}

const DEFAULT_COLORS = {
  head: '#ffb6c1',
  body: '#ffb6c1',
  leftArm: '#ffb6c1',
  rightArm: '#ffb6c1',
  leftLeg: '#ffb6c1',
  rightLeg: '#ffb6c1',
  leftEar: '#ffb6c1',
  rightEar: '#ffb6c1',
  tail: '#ff69b4',
  eye: '#1a1a2e',
  blush: '#ff69b4',
  nose: '#ff1493',
}

const DEFAULT_SCALES = {
  head: { x: 1.1, y: 0.95, z: 1 },
  body: { x: 1, y: 1.15, z: 0.9 },
  leftArm: { x: 0.7, y: 1.2, z: 0.8 },
  rightArm: { x: 0.7, y: 1.2, z: 0.8 },
  leftLeg: { x: 0.8, y: 1.1, z: 0.9 },
  rightLeg: { x: 0.8, y: 1.1, z: 0.9 },
  leftEar: { x: 1, y: 1.3, z: 0.6 },
  rightEar: { x: 1, y: 1.3, z: 0.6 },
  tail: { x: 1, y: 1.2, z: 0.8 },
}

export const useCharacterStore = create((set, get) => ({
  appearance: {
    shapes: { ...DEFAULT_SHAPES },
    colors: { ...DEFAULT_COLORS },
    scales: { ...DEFAULT_SCALES },
    eyeSize: 1,
    eyeSpacing: 1,
    blushIntensity: 0.4,
    glowIntensity: 0.3,
    furRoughness: 0.9,
  },

  expression: 'happy',
  isJumping: false,
  chatHistory: [],
  personality: 'friendly',

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
      shapes: { ...DEFAULT_SHAPES },
      colors: { ...DEFAULT_COLORS },
      scales: { ...DEFAULT_SCALES },
      eyeSize: 1,
      eyeSpacing: 1,
      blushIntensity: 0.4,
      glowIntensity: 0.3,
      furRoughness: 0.9,
    }
  })
}))
