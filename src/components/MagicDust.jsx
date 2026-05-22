import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function MagicDust({ count = 200 }) {
  const pointsRef = useRef()

  const [positions, colors, sizes, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const velocities = new Float32Array(count * 3)

    const colorPalette = [
      new THREE.Color('#ffd700'),
      new THREE.Color('#ff69b4'),
      new THREE.Color('#00bfff'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#ff1493')
    ]

    for (let i = 0; i < count; i++) {
      // 在玩偶周围分布
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 4
      const height = (Math.random() - 0.5) * 6

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = Math.random() * 2 + 0.5

      // 随机速度
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = Math.random() * 0.02 + 0.005
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
    }

    return [positions, colors, sizes, velocities]
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return

    const posArray = pointsRef.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // 更新位置
      posArray[i3] += velocities[i3] + Math.sin(t * 0.5 + i) * 0.002
      posArray[i3 + 1] += velocities[i3 + 1]
      posArray[i3 + 2] += velocities[i3 + 2] + Math.cos(t * 0.3 + i) * 0.002

      // 循环重置
      if (posArray[i3 + 1] > 5) {
        posArray[i3 + 1] = -3
        posArray[i3] = (Math.random() - 0.5) * 8
        posArray[i3 + 2] = (Math.random() - 0.5) * 8
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
