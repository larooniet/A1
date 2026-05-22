import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 梦幻光带 - 流动的光线
export function DreamLightRibbons({ count = 5 }) {
  const groupRef = useRef()

  const ribbons = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      points: Array.from({ length: 50 }, () => new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20
      )),
      color: ['#ff69b4', '#00bfff', '#9370db', '#ffd700', '#ff1493'][i % 5],
      speed: 0.5 + Math.random() * 1.5,
    }))
  }, [count])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const t = state.clock.elapsedTime * ribbons[i].speed
        const positions = child.geometry.attributes.position.array

        for (let j = 0; j < positions.length; j += 3) {
          const idx = j / 3
          positions[j] += Math.sin(t + idx * 0.1) * 0.02
          positions[j + 1] += Math.cos(t + idx * 0.15) * 0.02
          positions[j + 2] += Math.sin(t + idx * 0.2) * 0.01
        }

        child.geometry.attributes.position.needsUpdate = true
        child.material.opacity = 0.3 + Math.sin(t) * 0.2
      })
    }
  })

  return (
    <group ref={groupRef}>
      {ribbons.map((ribbon) => (
        <line key={ribbon.id}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={ribbon.points.length}
              array={new Float32Array(ribbon.points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={ribbon.color}
            transparent
            opacity={0.5}
            linewidth={2}
          />
        </line>
      ))}
    </group>
  )
}

// 漂浮的光球 - 带有拖尾
export function FloatingOrbs({ count = 15 }) {
  const orbsRef = useRef()

  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        Math.random() * 8 - 2,
        (Math.random() - 0.5) * 15
      ],
      color: ['#ff69b4', '#00bfff', '#9370db', '#ffd700', '#ff1493', '#00fa9a'][i % 6],
      size: 0.1 + Math.random() * 0.3,
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [count])

  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.children.forEach((child, i) => {
        const t = state.clock.elapsedTime * orbs[i].speed + orbs[i].phase
        child.position.y = orbs[i].position[1] + Math.sin(t) * 1.5
        child.position.x = orbs[i].position[0] + Math.cos(t * 0.7) * 0.5
        child.material.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.3
      })
    }
  })

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.8}
          />
          <pointLight
            color={orb.color}
            intensity={1}
            distance={3}
          />
        </mesh>
      ))}
    </group>
  )
}

// 地面发光网格
export function GlowingGround() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime
      meshRef.current.material.emissiveIntensity = 0.2 + Math.sin(t * 0.5) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[30, 30, 30, 30]} />
      <meshPhysicalMaterial
        color="#1a0a2e"
        emissive="#4a2a6a"
        emissiveIntensity={0.2}
        roughness={0.9}
        metalness={0.1}
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

// 旋转的星环
export function StarRing({ position = [0, 0, 0], radius = 3, color = '#ff69b4' }) {
  const ringRef = useRef()

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3
      ringRef.current.rotation.y += 0.005
      ringRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.15) * 0.2
    }
  })

  return (
    <group ref={ringRef} position={position}>
      <mesh>
        <torusGeometry args={[radius, 0.05, 8, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* 星点 */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * 0.2,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        )
      })}
    </group>
  )
}

// 雾气效果 - 体积光
export function VolumetricFog() {
  const fogRef = useRef()

  useFrame((state) => {
    if (fogRef.current) {
      fogRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <group ref={fogRef}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 0.8) * 5,
            Math.cos(i * 0.6) * 3,
            Math.cos(i * 0.8) * 5
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
        >
          <planeGeometry args={[4, 8]} />
          <meshBasicMaterial
            color={['#ff69b4', '#00bfff', '#9370db'][i % 3]}
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}
