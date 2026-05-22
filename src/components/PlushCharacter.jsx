import React, { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, animated, config } from '@react-spring/three'
import * as THREE from 'three'
import { useCharacterStore } from '../hooks/useCharacterStore'
import { FurMaterial } from './ShapeRenderer'

// 身体部位渲染器
function BodyPart({ shape, position, rotation = [0, 0, 0], scale = [1, 1, 1], color, roughness = 0.9, children }) {
  const meshRef = useRef()

  const geometry = useMemo(() => {
    const s = scale
    switch (shape) {
      case 'sphere':
        return <sphereGeometry args={[Math.max(...s) * 0.5, 32, 32]} />
      case 'capsule':
        return <capsuleGeometry args={[s[0] * 0.3, s[1] * 0.7, 8, 16]} />
      case 'box':
        return <boxGeometry args={[s[0], s[1], s[2]]} />
      case 'cylinder':
        return <cylinderGeometry args={[s[0] * 0.4, s[0] * 0.4, s[1], 16]} />
      case 'cone':
        return <coneGeometry args={[s[0] * 0.5, s[1], 16]} />
      case 'torus':
        return <torusGeometry args={[s[0] * 0.4, s[0] * 0.15, 16, 32]} />
      default:
        return <sphereGeometry args={[0.5, 32, 32]} />
    }
  }, [shape, scale])

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef}>
        {geometry}
        <FurMaterial color={color} roughness={roughness} />
      </mesh>
      {children}
    </group>
  )
}

// 眼睛
function Eye({ position, scale = 1, isBlinking, color }) {
  return (
    <group position={position}>
      <mesh scale={[1, isBlinking ? 0.1 : 1, 1]}>
        <sphereGeometry args={[0.18 * scale, 32, 32]} />
        <meshPhysicalMaterial color="#1a1a2e" roughness={0.1} metalness={0.3} clearcoat={1} />
      </mesh>
      <mesh position={[0.06 * scale, 0.08 * scale, 0.14]}>
        <sphereGeometry args={[0.06 * scale, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.05 * scale, -0.05 * scale, 0.15]}>
        <sphereGeometry args={[0.03 * scale, 16, 16]} />
        <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
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

  // 鼠标追踪
  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouse.x * 0.5, 0.05)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, mouse.y * 0.3, 0.05)
    }
    if (groupRef.current && !isJumping) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.2, 0.02)
    }
  })

  // 随机眨眼
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    if (!isJumping) setIsJumping(true)
  }

  const headScale = scales.head || { x: 1.1, y: 0.95, z: 1 }
  const bodyScale = scales.body || { x: 1, y: 1.15, z: 0.9 }
  const armScale = scales.leftArm || { x: 0.7, y: 1.2, z: 0.8 }
  const legScale = scales.leftLeg || { x: 0.8, y: 1.1, z: 0.9 }
  const earScale = scales.leftEar || { x: 1, y: 1.3, z: 0.6 }
  const tailScale = scales.tail || { x: 1, y: 1.2, z: 0.8 }

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
      {/* 头部组 */}
      <group ref={headRef} position={[0, 0.6, 0]}>
        <BodyPart
          shape={shapes.head}
          scale={[headScale.x * 1.7, headScale.y * 1.7, headScale.z * 1.7]}
          color={hovered ? '#ffc0cb' : colors.head}
          roughness={furRoughness}
        />

        {/* 耳朵 */}
        <BodyPart
          shape={shapes.leftEar}
          position={[-0.5, 0.5, 0]}
          rotation={[0, 0, -0.3]}
          scale={[earScale.x * 0.5, earScale.y * 0.5, earScale.z * 0.5]}
          color={colors.leftEar}
          roughness={furRoughness}
        />
        <BodyPart
          shape={shapes.rightEar}
          position={[0.5, 0.5, 0]}
          rotation={[0, 0, 0.3]}
          scale={[earScale.x * 0.5, earScale.y * 0.5, earScale.z * 0.5]}
          color={colors.rightEar}
          roughness={furRoughness}
        />

        {/* 眼睛 */}
        <Eye position={[-0.28 * eyeSpacing, 0.05, 0.72]} scale={eyeSize} isBlinking={isBlinking} />
        <Eye position={[0.28 * eyeSpacing, 0.05, 0.72]} scale={eyeSize} isBlinking={isBlinking} />

        {/* 腮红 */}
        <Blush position={[-0.45, -0.15, 0.65]} intensity={blushIntensity} />
        <Blush position={[0.45, -0.15, 0.65]} intensity={blushIntensity} />

        {/* 鼻子 */}
        <mesh position={[0, -0.08, 0.78]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshPhysicalMaterial color={colors.nose} roughness={0.3} clearcoat={0.5} />
        </mesh>

        {/* 嘴巴 */}
        <mesh position={[0, -0.18, 0.75]} scale={[1.5, 0.5, 0.5]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshPhysicalMaterial color="#ff69b4" roughness={0.8} />
        </mesh>
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
      <mesh position={[0, -0.8, 0.1]} scale={[1, 0.5, 0.8]}>
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
        position={[-0.7, -0.2, 0.2]}
        rotation={[0, 0, 0.4]}
        scale={[armScale.x * 0.7, armScale.y * 1.4, armScale.z * 0.8]}
        color={colors.leftArm}
        roughness={furRoughness}
      />

      {/* 右臂 */}
      <BodyPart
        shape={shapes.rightArm}
        position={[0.7, -0.2, 0.2]}
        rotation={[0, 0, -0.4]}
        scale={[armScale.x * 0.7, armScale.y * 1.4, armScale.z * 0.8]}
        color={colors.rightArm}
        roughness={furRoughness}
      />

      {/* 左腿 */}
      <BodyPart
        shape={shapes.leftLeg}
        position={[-0.4, -1.1, 0.2]}
        scale={[legScale.x * 0.6, legScale.y * 1.2, legScale.z * 0.9]}
        color={colors.leftLeg}
        roughness={furRoughness}
      />

      {/* 右腿 */}
      <BodyPart
        shape={shapes.rightLeg}
        position={[0.4, -1.1, 0.2]}
        scale={[legScale.x * 0.6, legScale.y * 1.2, legScale.z * 0.9]}
        color={colors.rightLeg}
        roughness={furRoughness}
      />

      {/* 尾巴 */}
      <group position={[0, -0.6, -0.6]}>
        <BodyPart
          shape={shapes.tail}
          scale={[tailScale.x * 0.5, tailScale.y * 0.6, tailScale.z * 0.4]}
          color={colors.tail}
          roughness={furRoughness}
        />
      </group>

      {/* 环绕光晕 */}
      <pointLight position={[0, 0, 1]} intensity={glowIntensity * 2} color={colors.body} distance={3} />
    </animated.group>
  )
}
