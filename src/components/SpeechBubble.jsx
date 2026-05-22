import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCharacterStore } from '../hooks/useCharacterStore'
import * as THREE from 'three'

export function SpeechBubble3D() {
  const groupRef = useRef()
  const { chatHistory, name } = useCharacterStore()

  // 获取最后一条消息
  const lastMessage = chatHistory.length > 0 
    ? chatHistory[chatHistory.length - 1] 
    : null

  useFrame((state) => {
    if (groupRef.current) {
      // 始终面向相机
      groupRef.current.lookAt(state.camera.position)

      // 上下浮动
      const t = state.clock.elapsedTime
      groupRef.current.position.y = 2.2 + Math.sin(t * 2) * 0.1
    }
  })

  if (!lastMessage || lastMessage.role !== 'assistant') return null

  // 截断长文本
  const text = lastMessage.content.length > 50 
    ? lastMessage.content.substring(0, 50) + '...' 
    : lastMessage.content

  return (
    <group ref={groupRef} position={[0, 2.2, 0]}>
      {/* 气泡背景 */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[2.5, 0.8]} />
        <meshBasicMaterial
          color="rgba(10, 10, 30, 0.9)"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 气泡边框 */}
      <mesh position={[0, 0, -0.04]}>
        <planeGeometry args={[2.52, 0.82]} />
        <meshBasicMaterial
          color="#ff69b4"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 小三角 */}
      <mesh position={[0, -0.5, -0.05]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.15, 0.3, 3]} />
        <meshBasicMaterial
          color="rgba(10, 10, 30, 0.9)"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 文字 - 使用 canvas texture */}
      <TextSprite text={`${name}: ${text}`} position={[0, 0, 0]} />
    </group>
  )
}

// 文字精灵
function TextSprite({ text, position }) {
  const spriteRef = useRef()

  const texture = React.useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')

    // 背景
    ctx.fillStyle = 'rgba(10, 10, 30, 0)'
    ctx.fillRect(0, 0, 512, 128)

    // 文字
    ctx.font = 'bold 24px Arial, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 自动换行
    const words = text.split('')
    let line = ''
    let lines = []
    const maxWidth = 480

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && i > 0) {
        lines.push(line)
        line = words[i]
      } else {
        line = testLine
      }
    }
    lines.push(line)

    const lineHeight = 30
    const startY = 64 - (lines.length - 1) * lineHeight / 2

    lines.forEach((line, i) => {
      ctx.fillText(line, 256, startY + i * lineHeight)
    })

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [text])

  return (
    <sprite ref={spriteRef} position={position} scale={[2.5, 0.625, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={1}
      />
    </sprite>
  )
}
