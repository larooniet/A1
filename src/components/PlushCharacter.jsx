import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, animated, config } from '@react-spring/three'
import * as THREE from 'three'
import { useCharacterStore } from '../hooks/useCharacterStore'
import { FurMaterial } from './ShapeRenderer'

// 形状几何体生成器
function ShapeGeometry({ shape, scale = [1, 1, 1] }) {
  const s = scale
  switch (shape) {
    case 'sphere':
      return <sphereGeometry args={[0.5, 32, 32]} />
    case 'capsule':
      return <capsuleGeometry args={[s[0] * 0.3, s[1] * 0.5, 8, 16]} />
    case 'box':
      return <boxGeometry args={[s[0], s[1], s[2]]} />
    case 'cylinder':
      return <cylinderGeometry args={[s[0] * 0.4, s[0] * 0.4, s[1], 16]} />
    case 'cone':
      return <coneGeometry args={[s[0] * 0.5, s[1], 16]} />
    case 'torus':
      return <torusGeometry args={[s[0] * 0.35, s[0] * 0.15, 16, 32]} />
    case 'dodecahedron':
      return <dodecahedronGeometry args={[Math.max(...s) * 0.4, 0]} />
    case 'icosahedron':
      return <icosahedronGeometry args={[Math.max(...s) * 0.45, 0]} />
    case 'octahedron':
      return <octahedronGeometry args={[Math.max(...s) * 0.5, 0]} />
    case 'tetrahedron':
      return <tetrahedronGeometry args={[Math.max(...s) * 0.6, 0]} />
    case 'torusKnot':
      return <torusKnotGeometry args={[s[0] * 0.2, s[0] * 0.08, 64, 8]} />
    default:
      return <sphereGeometry args={[0.5, 32, 32]} />
  }
}

// 身体部位渲染器 - 修复尺寸控制
function BodyPart({ shape, position, rotation = [0, 0, 0], scale = [1, 1, 1], color, roughness = 0.9, children }) {
  const meshRef = useRef()

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={meshRef}>
        <ShapeGeometry shape={shape} scale={[1, 1, 1]} />
        <FurMaterial color={color} roughness={roughness} />
      </mesh>
      {children}
    </group>
  )
}

// 眼睛 - 修复跟随问题，使用独立组
function Eye({ position, scale = 1, isBlinking }) {
  const eyeGroupRef = useRef()

  return (
    <group ref={eyeGroupRef} position={position}>
      {/* 眼球 */}
      <mesh scale={[1, isBlinking ? 0.1 : 1, 1]}>
        <sphereGeometry args={[0.18 * scale, 32, 32]} />
        <meshPhysicalMaterial
          color="#1a1a2e"
          roughness={0.1}
          metalness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* 主高光 */}
      <mesh position={[0.06 * scale, 0.08 * scale, 0.14 * scale]}>
        <sphereGeometry args={[0.06 * scale, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* 次高光 */}
      <mesh position={[-0.05 * scale, -0.05 * scale, 0.15 * scale]}>
        <sphereGeometry args={[0.03 * scale, 16, 16]} />
        <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
      </mesh>
      {/* 底部反光 */}
      <mesh position={[0, -0.08 * scale, 0.12 * scale]}>
        <sphereGeometry args={[0.1 * scale, 16, 16]} />
        <meshBasicMaterial color="#ffb6c1" opacity={0.3} transparent />
      </mesh>
    </group>
  )
}

// 腮红
function Blush({ position, intensity }) {
  return (
    <mesh position={position} scale={[1.3, 0.8, 0.5]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshPhysicalMaterial
        color="#ff69b4"
        transparent
        opacity={intensity}
        roughness={1}
        emissive="#ff1493"
        emissiveIntensity={intensity * 0.5}
      />
    </mesh>
  )
}

export default function PlushCharacter({ position = [0, 0, 0] }) {
  const groupRef = useRef()
  const headRef = useRef()
  const [isJumping, setIsJumping] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const { mouse } = useThree()

  const appearance = useCharacterStore(state => state.appearance)
  const { shapes, colors, scales, eyeSize, eyeSpacing, blushIntensity, glowIntensity, furRoughness } = appearance

  // 跳跃动画
  const { jumpY, jumpScale } = useSpring({
    jumpY: isJumping ? 1.5 : 0,
    jumpScale: isJumping ? 1.2 : 1,
    config: config.wobbly,
    onRest: () => setIsJumping(false)
  })

  // 修复：头部跟随鼠标 - 使用 useFrame 持续更新
  useFrame((state) => {
    if (headRef.current) {
      // 平滑插值到鼠标位置
      const targetX = mouse.x * 0.8
      const targetY = mouse.y * 0.5

      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.08)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetY, 0.08)
    }

    if (groupRef.current && !isJumping) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.3, 0.03)
    }
  })

  // 随机眨眼
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    if (!isJumping) setIsJumping(true)
  }

  // 获取各部位尺寸 - 修复：从 scales 读取
  const headScale = scales.head || { x: 1.2, y: 1.0, z: 1.1 }
  const bodyScale = scales.body || { x: 1.3, y: 1.0, z: 1.2 }
  const armScale = scales.leftArm || { x: 0.6, y: 1.0, z: 0.6 }
  const legScale = scales.leftLeg || { x: 0.7, y: 0.9, z: 0.7 }
  const earScale = scales.leftEar || { x: 0.8, y: 0.8, z: 0.5 }
  const tailScale = scales.tail || { x: 0.5, y: 0.5, z: 0.5 }

  return (
    <animated.group 
      ref={groupRef} 
      position={position}
      position-y={jumpY}
      scale={jumpScale}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 头部组 - 关键修复：ref 放在这里，眼睛作为子元素 */}
      <group ref={headRef} position={[0, 0.6, 0]}>
        {/* 主头部 */}
        <BodyPart
          shape={shapes.head}
          scale={[headScale.x * 1.7, headScale.y * 1.7, headScale.z * 1.7]}
          color={hovered ? '#ffc0cb' : colors.head}
          roughness={furRoughness}
        />

        {/* 耳朵 */}
        <BodyPart
          shape={shapes.leftEar}
          position={[-0.5 * headScale.x, 0.5 * headScale.y, 0]}
          rotation={[0, 0, -0.3]}
          scale={[earScale.x * 0.5, earScale.y * 0.5, earScale.z * 0.5]}
          color={colors.leftEar}
          roughness={furRoughness}
        />
        <BodyPart
          shape={shapes.rightEar}
          position={[0.5 * headScale.x, 0.5 * headScale.y, 0]}
          rotation={[0, 0, 0.3]}
          scale={[earScale.x * 0.5, earScale.y * 0.5, earScale.z * 0.5]}
          color={colors.rightEar}
          roughness={furRoughness}
        />

        {/* 眼睛 - 修复：作为 headRef 的子元素，会随头部旋转 */}
        <Eye 
          position={[-0.28 * eyeSpacing * headScale.x, 0.05, 0.72 * headScale.z]} 
          scale={eyeSize} 
          isBlinking={isBlinking} 
        />
        <Eye 
          position={[0.28 * eyeSpacing * headScale.x, 0.05, 0.72 * headScale.z]} 
          scale={eyeSize} 
          isBlinking={isBlinking} 
        />

        {/* 腮红 */}
        <Blush position={[-0.45 * headScale.x, -0.15, 0.65 * headScale.z]} intensity={blushIntensity} />
        <Blush position={[0.45 * headScale.x, -0.15, 0.65 * headScale.z]} intensity={blushIntensity} />

        {/* 鼻子 */}
        <mesh position={[0, -0.08 * headScale.y, 0.78 * headScale.z]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshPhysicalMaterial color={colors.nose} roughness={0.3} clearcoat={0.5} />
        </mesh>

        {/* 嘴巴 */}
        <mesh position={[0, -0.18 * headScale.y, 0.75 * headScale.z]} scale={[1.5, 0.5, 0.5]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshPhysicalMaterial color="#ff69b4" roughness={0.8} />
        </mesh>

        {/* 头顶绒毛 */}
        <BodyPart
          shape="sphere"
          position={[0, 0.85 * headScale.y, 0]}
          scale={[0.15, 0.15, 0.15]}
          color="#ffc0cb"
          roughness={furRoughness}
        />
      </group>

      {/* 身体 */}
      <BodyPart
        shape={shapes.body}
        position={[0, -0.3, 0]}
        scale={[bodyScale.x * 2, bodyScale.y * 2.3, bodyScale.z * 1.8]}
        color={colors.body}
        roughness={furRoughness}
      />

      {/* 腹部发光 */}
      <mesh position={[0, -0.8 * bodyScale.y, 0.1]} scale={[bodyScale.x, 0.5 * bodyScale.y, 0.8 * bodyScale.z]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshPhysicalMaterial
          color={colors.body}
          emissive={colors.body}
          emissiveIntensity={glowIntensity}
          transparent
          opacity={0.6}
          roughness={0.9}
        />
      </mesh>

      {/* 左臂 */}
      <BodyPart
        shape={shapes.leftArm}
        position={[-0.7 * bodyScale.x, -0.2, 0.2]}
        rotation={[0, 0, 0.4]}
        scale={[armScale.x * 0.7, armScale.y * 1.4, armScale.z * 0.8]}
        color={colors.leftArm}
        roughness={furRoughness}
      />

      {/* 右臂 */}
      <BodyPart
        shape={shapes.rightArm}
        position={[0.7 * bodyScale.x, -0.2, 0.2]}
        rotation={[0, 0, -0.4]}
        scale={[armScale.x * 0.7, armScale.y * 1.4, armScale.z * 0.8]}
        color={colors.rightArm}
        roughness={furRoughness}
      />

      {/* 左腿 */}
      <BodyPart
        shape={shapes.leftLeg}
        position={[-0.4 * bodyScale.x, -1.1 * bodyScale.y, 0.2]}
        scale={[legScale.x * 0.6, legScale.y * 1.2, legScale.z * 0.9]}
        color={colors.leftLeg}
        roughness={furRoughness}
      />

      {/* 右腿 */}
      <BodyPart
        shape={shapes.rightLeg}
        position={[0.4 * bodyScale.x, -1.1 * bodyScale.y, 0.2]}
        scale={[legScale.x * 0.6, legScale.y * 1.2, legScale.z * 0.9]}
        color={colors.rightLeg}
        roughness={furRoughness}
      />

      {/* 尾巴 */}
      <group position={[0, -0.6 * bodyScale.y, -0.6 * bodyScale.z]}>
        <BodyPart
          shape={shapes.tail}
          scale={[tailScale.x * 0.5, tailScale.y * 0.6, tailScale.z * 0.4]}
          color={colors.tail}
          roughness={furRoughness}
        />
      </group>

      {/* 环绕光晕 */}
      <pointLight 
        position={[0, 0, 1]} 
        intensity={glowIntensity * 2} 
        color={colors.body}
        distance={3}
      />
    </animated.group>
  )
}
