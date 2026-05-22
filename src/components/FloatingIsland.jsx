import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function GlowingMushroom({ position, scale, color }) {
  const capRef = useRef()

  useFrame((state) => {
    if (capRef.current) {
      capRef.current.material.emissiveIntensity = 
        0.3 + Math.sin(state.clock.elapsedTime * 3 + position[0]) * 0.2
    }
  })

  return (
    <group position={position} scale={scale}>
      {/* 蘑菇柄 */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.6, 8]} />
        <meshPhysicalMaterial
          color="#f5f5dc"
          roughness={0.9}
        />
      </mesh>
      {/* 蘑菇帽 */}
      <mesh ref={capRef} position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.6}
          emissive={color}
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 光点 */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={0.5}
        color={color}
        distance={2}
      />
    </group>
  )
}

export default function FloatingIsland({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const islandRef = useRef()

  const islandShape = useMemo(() => {
    const geo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
    const positions = geo.attributes.position.array

    // 压扁并添加不规则性
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] *= 1.5 + Math.random() * 0.3      // x 拉伸
      positions[i + 1] *= 0.3                          // y 压扁
      positions[i + 2] *= 1.2 + Math.random() * 0.3   // z 拉伸
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.rotation.y += 0.002
    }
  })

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.15} floatingRange={[-0.2, 0.2]}>
      <group ref={islandRef} position={position} scale={scale} rotation={rotation}>
        {/* 岛屿主体 */}
        <mesh geometry={islandShape} position={[0, -0.5, 0]}>
          <meshPhysicalMaterial
            color="#2a1a4a"
            roughness={0.9}
            metalness={0.1}
            emissive="#1a0a2a"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* 表面发光层 */}
        <mesh geometry={islandShape} position={[0, -0.48, 0]} scale={[0.98, 0.98, 0.98]}>
          <meshPhysicalMaterial
            color="#4a2a6a"
            transparent
            opacity={0.3}
            roughness={1}
            emissive="#ff69b4"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* 发光蘑菇 */}
        <GlowingMushroom position={[-0.5, 0, 0.3]} scale={0.8} color="#ff69b4" />
        <GlowingMushroom position={[0.6, 0, -0.2]} scale={0.6} color="#00bfff" />
        <GlowingMushroom position={[0, 0, 0.5]} scale={0.5} color="#ff1493" />
        <GlowingMushroom position={[-0.3, 0, -0.4]} scale={0.7} color="#9370db" />

        {/* 小水晶 */}
        <mesh position={[0.8, 0.2, 0.4]} rotation={[0.5, 0, 0]}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshPhysicalMaterial
            color="#00bfff"
            transparent
            opacity={0.8}
            emissive="#00bfff"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* 岛屿光晕 */}
        <pointLight
          position={[0, 1, 0]}
          intensity={0.8}
          color="#9370db"
          distance={6}
        />
      </group>
    </Float>
  )
}
