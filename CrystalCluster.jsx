import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function Crystal({ position, rotation, scale, color }) {
  const meshRef = useRef()

  const geometry = useMemo(() => {
    // 创建水晶几何体 - 八面体变体
    const geo = new THREE.OctahedronGeometry(1, 0)
    const positions = geo.attributes.position.array

    // 随机扰动顶点，创造不规则水晶形状
    for (let i = 0; i < positions.length; i += 3) {
      const noise = 0.8 + Math.random() * 0.4
      positions[i] *= noise
      positions[i + 1] *= noise * 1.5  // 拉长
      positions[i + 2] *= noise
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.material.emissiveIntensity = 
        0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0.1}
        transmission={0.6}
        thickness={2}
        ior={1.5}
        emissive={color}
        emissiveIntensity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function CrystalCluster({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const clusterRef = useRef()

  const crystals = useMemo(() => {
    const items = []
    const colors = ['#00bfff', '#ff69b4', '#9370db', '#00ced1', '#ff1493']

    for (let i = 0; i < 8; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 2,
          Math.random() * 2,
          (Math.random() - 0.5) * 2
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ],
        scale: 0.3 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    return items
  }, [])

  useFrame((state) => {
    if (clusterRef.current) {
      clusterRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
      <group ref={clusterRef} position={position} scale={scale} rotation={rotation}>
        {/* 基座 */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.8, 1, 0.5, 6]} />
          <meshPhysicalMaterial
            color="#2a1a4a"
            roughness={0.8}
            metalness={0.2}
            emissive="#1a0a3a"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* 水晶 */}
        {crystals.map((crystal, i) => (
          <Crystal key={i} {...crystal} />
        ))}

        {/* 底部发光 */}
        <pointLight
          position={[0, -0.5, 0]}
          intensity={1}
          color="#9370db"
          distance={4}
        />
      </group>
    </Float>
  )
}
