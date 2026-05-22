import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Jellyfish({ position = [0, 0, 0], scale = 1, color = '#ff69b4' }) {
  const groupRef = useRef()
  const tentaclesRef = useRef([])

  const tentacles = useMemo(() => {
    const items = []
    for (let i = 0; i < 6; i++) {
      items.push({
        angle: (i / 6) * Math.PI * 2,
        length: 1 + Math.random() * 0.5,
        speed: 1 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2
      })
    }
    return items
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      // 漂浮运动
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.3
      groupRef.current.position.x = position[0] + Math.cos(t * 0.5) * 0.2
      groupRef.current.rotation.y = t * 0.2
    }

    // 触手摆动
    tentaclesRef.current.forEach((tentacle, i) => {
      if (tentacle) {
        const data = tentacles[i]
        tentacle.rotation.z = Math.sin(t * data.speed + data.offset) * 0.3
        tentacle.rotation.x = Math.cos(t * data.speed * 0.7 + data.offset) * 0.2
      }
    })
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* 水母头部 - 半透明发光 */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.5}
          roughness={0.2}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
          transmission={0.3}
          thickness={1}
        />
      </mesh>

      {/* 内部发光核心 */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 触手 */}
      {tentacles.map((tentacle, i) => (
        <group
          key={i}
          ref={(el) => { if (el) tentaclesRef.current[i] = el }}
          position={[
            Math.cos(tentacle.angle) * 0.25,
            -0.1,
            Math.sin(tentacle.angle) * 0.25
          ]}
        >
          <mesh>
            <cylinderGeometry args={[0.02, 0.01, tentacle.length, 8]} />
            <meshPhysicalMaterial
              color={color}
              transparent
              opacity={0.6}
              emissive={color}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* 中心光源 */}
      <pointLight
        position={[0, 0, 0]}
        intensity={1}
        color={color}
        distance={3}
      />
    </group>
  )
}
