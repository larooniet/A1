import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import PlushCharacter from './components/PlushCharacter'
import StarField from './components/StarField'
import CrystalCluster from './components/CrystalCluster'
import FloatingIsland from './components/FloatingIsland'
import MagicDust from './components/MagicDust'
import Jellyfish from './components/Jellyfish'
import ChatSystem from './components/ChatSystem'
import CharacterCreator from './components/CharacterCreator'
import { BackgroundAudio } from './components/AudioSystem'
import AudioControl from './components/AudioControl'

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} color="#ff69b4" />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffb6c1" castShadow />
      <pointLight position={[-5, 5, -5]} intensity={2} color="#00bfff" />
      <pointLight position={[5, -2, 5]} intensity={1.5} color="#ff1493" />

      <Environment preset="night" />

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3} floatingRange={[-0.1, 0.1]}>
        <PlushCharacter position={[0, 0, 0]} />
      </Float>

      <StarField />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />

      <CrystalCluster position={[-3, -1, -4]} />
      <CrystalCluster position={[3.5, 1, -5]} scale={0.7} rotation={[0, 1, 0]} />
      <FloatingIsland position={[-4, 3, -8]} />
      <FloatingIsland position={[5, -2, -6]} scale={0.6} />

      <Jellyfish position={[-2, 2, -3]} color="#ff69b4" />
      <Jellyfish position={[3, -1, -4]} color="#00bfff" scale={0.7} />
      <Jellyfish position={[-1, -2, -2]} color="#ff1493" scale={0.5} />

      <MagicDust count={200} />

      {/* 背景音乐系统 */}
      <BackgroundAudio />

      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.002, 0.002]} />
      </EffectComposer>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a1a', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* UI 层 */}
      <ChatSystem />
      <CharacterCreator />
      <AudioControl />

      {/* 底部提示 */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.9rem',
        pointerEvents: 'none',
        textAlign: 'center',
        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        zIndex: 10,
      }}>
        <div>✨ 移动鼠标与玩偶对视 · 点击让它跳跃 ✨</div>
        <div style={{ fontSize: '0.8rem', marginTop: '4px', color: 'rgba(255,255,255,0.4)' }}>
          🎨 左下角捏制 · 💬 右下角对话 · 🎵 底部音乐
        </div>
      </div>
    </div>
  )
}
