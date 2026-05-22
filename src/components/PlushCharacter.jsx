import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, animated, config } from '@react-spring/three'
import * as THREE from 'three'
import { useCharacterStore } from '../hooks/useCharacterStore'
import { FurMaterial } from './ShapeRenderer'
import { SpeechBubble3D } from './SpeechBubble'

// 形状几何体
function ShapeGeometry({ shape }) {
  switch (shape) {
    case 'sphere': return <sphereGeometry args={[0.5, 32, 32]} />
    case 'capsule': return <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
    case 'box': return <boxGeometry args={[1, 1, 1]} />
    case 'cylinder': return <cylinderGeometry args={[0.4, 0.4, 1, 16]} />
    case 'cone': return <coneGeometry args={[0.5, 1, 16]} />
    case 'torus': return <torusGeometry args={[0.35, 0.15, 16, 32]} />
    case 'dodecahedron': return <dodecahedronGeometry args={[0.4, 0]} />
    case 'icosahedron': return <icosahedronGeometry args={[0.45, 0]} />
    case 'octahedron': return <octahedronGeometry args={[0.5, 0]} />
    case 'tetrahedron': return <tetrahedronGeometry args={[0.6, 0]} />
    case 'torusKnot': return <torusKnotGeometry args={[0.2, 0.08, 64, 8]} />
    default: return <sphereGeometry args={[0.5, 32, 32]} />
  }
}

// 身体部位 - 支持骨骼动画
function BodyPart({ shape, scale = [1, 1, 1], color, roughness = 0.9 }) {
  return (
    <mesh scale={scale}>
      <ShapeGeometry shape={shape} />
      <FurMaterial color={color} roughness={roughness} />
    </mesh>
  )
}

// 眼睛
function Eye({ scale = 1, isBlinking }) {
  return (
    <group>
      <mesh scale={[1, isBlinking ? 0.1 : 1, 1]}>
        <sphereGeometry args={[0.18 * scale, 32, 32]} />
        <meshPhysicalMaterial color="#1a1a2e" roughness={0.1} metalness={0.3} clearcoat={1} />
      </mesh>
      <mesh position={[0.06 * scale, 0.08 * scale, 0.14 * scale]}>
        <sphereGeometry args={[0.06 * scale, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.05 * scale, -0.05 * scale, 0.15 * scale]}>
        <sphereGeometry args={[0.03 * scale, 16, 16]} />
        <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
      </mesh>
    </group>
  )
}

// 腮红
function Blush({ intensity }) {
  return (
    <mesh scale={[1.3, 0.8, 0.5]}>
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
  const bodyRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const tailRef = useRef()

  const [isJumping, setIsJumping] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const { mouse } = useThree()

  const appearance = useCharacterStore(state => state.appearance)
  const isWalking = useCharacterStore(state => state.isWalking)
  const isPlaying = useCharacterStore(state => state.isPlaying)
  const { shapes, colors, scales, deform, joints, eyeSize, eyeSpacing, blushIntensity, glowIntensity, furRoughness } = appearance

  // 跳跃动画
  const { jumpY, jumpScale } = useSpring({
    jumpY: isJumping ? 1.5 : 0,
    jumpScale: isJumping ? 1.2 : 1,
    config: config.wobbly,
    onRest: () => setIsJumping(false)
  })

  // 头部跟随鼠标
  useFrame((state) => {
    if (headRef.current) {
      const targetX = mouse.x * 0.8
      const targetY = mouse.y * 0.5
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.08)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetY, 0.08)
    }

    if (groupRef.current && !isJumping && !isWalking) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.3, 0.03)
    }
  })

  // 行走动画
  useFrame((state) => {
    if (!isWalking) return

    const t = state.clock.elapsedTime * 5
    const walkCycle = Math.sin(t)

    // 身体上下起伏
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.abs(Math.sin(t * 2)) * 0.1
    }

    // 腿部摆动
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = walkCycle * 0.4
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = -walkCycle * 0.4
    }

    // 手臂摆动
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = -walkCycle * 0.3
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = walkCycle * 0.3
    }

    // 整体前进
    if (groupRef.current) {
      groupRef.current.position.z += Math.cos(t) * 0.01
    }
  })

  // 打闹/玩耍动画
  useFrame((state) => {
    if (!isPlaying) return

    const t = state.clock.elapsedTime * 3

    // 快速旋转
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.05
    }

    // 手臂挥舞
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(t) * 0.8
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = Math.cos(t) * 0.8
    }

    // 跳跃
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.abs(Math.sin(t * 2)) * 0.3
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
    if (!isJumping && !isWalking) setIsJumping(true)
  }

  // 获取尺寸
  const headScale = scales.head || { x: 1.2, y: 1.0, z: 1.1 }
  const bodyScale = scales.body || { x: 1.3, y: 1.0, z: 1.2 }
  const armScale = scales.leftArm || { x: 0.6, y: 1.0, z: 0.6 }
  const legScale = scales.leftLeg || { x: 0.7, y: 0.9, z: 0.7 }
  const earScale = scales.leftEar || { x: 0.8, y: 0.8, z: 0.5 }
  const tailScale = scales.tail || { x: 0.5, y: 0.5, z: 0.5 }

  // 连接点计算 - 从表面开始
  const headJoint = joints.head || { anchor: [0, 0.85, 0], offset: [0, -0.5, 0] }
  const leftArmJoint = joints.leftArm || { anchor: [-0.8, 0.3, 0], offset: [0, 0.5, 0] }
  const rightArmJoint = joints.rightArm || { anchor: [0.8, 0.3, 0], offset: [0, 0.5, 0] }
  const leftLegJoint = joints.leftLeg || { anchor: [-0.4, -0.8, 0], offset: [0, 0.5, 0] }
  const rightLegJoint = joints.rightLeg || { anchor: [0.4, -0.8, 0], offset: [0, 0.5, 0] }
  const leftEarJoint = joints.leftEar || { anchor: [-0.6, 0.7, 0], offset: [0, -0.3, 0] }
  const rightEarJoint = joints.rightEar || { anchor: [0.6, 0.7, 0], offset: [0, -0.3, 0] }
  const tailJoint = joints.tail || { anchor: [0, -0.5, -0.8], offset: [0, 0, 0.3] }

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
      {/* 身体 */}
      <group ref={bodyRef}>
        <BodyPart
          shape={shapes.body}
          scale={[bodyScale.x * 2, bodyScale.y * 2.3, bodyScale.z * 1.8]}
          color={hovered ? '#ffc0cb' : colors.body}
          roughness={furRoughness}
        />

        {/* 腹部发光 */}
        <mesh position={[0, -0.8, 0.1]} scale={[bodyScale.x, 0.5 * bodyScale.y, 0.8 * bodyScale.z]}>
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

        {/* 头部 - 连接点从身体表面开始 */}
        <group 
          ref={headRef} 
          position={[
            headJoint.anchor[0] + headJoint.offset[0],
            headJoint.anchor[1] + headJoint.offset[1],
            headJoint.anchor[2] + headJoint.offset[2]
          ]}
        >
          <BodyPart
            shape={shapes.head}
            scale={[headScale.x * 1.7, headScale.y * 1.7, headScale.z * 1.7]}
            color={colors.head}
            roughness={furRoughness}
          />

          {/* 左耳 */}
          <group position={[
            leftEarJoint.anchor[0] + leftEarJoint.offset[0],
            leftEarJoint.anchor[1] + leftEarJoint.offset[1],
            leftEarJoint.anchor[2] + leftEarJoint.offset[2]
          ]}>
            <BodyPart
              shape={shapes.leftEar}
              scale={[earScale.x * 0.5, earScale.y * 0.5, earScale.z * 0.5]}
              color={colors.leftEar}
              roughness={furRoughness}
            />
          </group>

          {/* 右耳 */}
          <group position={[
            rightEarJoint.anchor[0] + rightEarJoint.offset[0],
            rightEarJoint.anchor[1] + rightEarJoint.offset[1],
            rightEarJoint.anchor[2] + rightEarJoint.offset[2]
          ]}>
            <BodyPart
              shape={shapes.rightEar}
              scale={[earScale.x * 0.5, earScale.y * 0.5, earScale.z * 0.5]}
              color={colors.rightEar}
              roughness={furRoughness}
            />
          </group>

          {/* 眼睛 */}
          <group position={[-0.28 * eyeSpacing * headScale.x, 0.05, 0.72 * headScale.z]}>
            <Eye scale={eyeSize} isBlinking={isBlinking} />
          </group>
          <group position={[0.28 * eyeSpacing * headScale.x, 0.05, 0.72 * headScale.z]}>
            <Eye scale={eyeSize} isBlinking={isBlinking} />
          </group>

          {/* 腮红 */}
          <group position={[-0.45 * headScale.x, -0.15, 0.65 * headScale.z]}>
            <Blush intensity={blushIntensity} />
          </group>
          <group position={[0.45 * headScale.x, -0.15, 0.65 * headScale.z]}>
            <Blush intensity={blushIntensity} />
          </group>

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

          {/* 对话气泡 */}
          <SpeechBubble3D />
        </group>

        {/* 左臂 */}
        <group 
          ref={leftArmRef}
          position={[
            leftArmJoint.anchor[0] + leftArmJoint.offset[0],
            leftArmJoint.anchor[1] + leftArmJoint.offset[1],
            leftArmJoint.anchor[2] + leftArmJoint.offset[2]
          ]}
        >
          <BodyPart
            shape={shapes.leftArm}
            scale={[armScale.x * 0.7, armScale.y * 1.4, armScale.z * 0.8]}
            color={colors.leftArm}
            roughness={furRoughness}
          />
        </group>

        {/* 右臂 */}
        <group 
          ref={rightArmRef}
          position={[
            rightArmJoint.anchor[0] + rightArmJoint.offset[0],
            rightArmJoint.anchor[1] + rightArmJoint.offset[1],
            rightArmJoint.anchor[2] + rightArmJoint.offset[2]
          ]}
        >
          <BodyPart
            shape={shapes.rightArm}
            scale={[armScale.x * 0.7, armScale.y * 1.4, armScale.z * 0.8]}
            color={colors.rightArm}
            roughness={furRoughness}
          />
        </group>

        {/* 左腿 */}
        <group 
          ref={leftLegRef}
          position={[
            leftLegJoint.anchor[0] + leftLegJoint.offset[0],
            leftLegJoint.anchor[1] + leftLegJoint.offset[1],
            leftLegJoint.anchor[2] + leftLegJoint.offset[2]
          ]}
        >
          <BodyPart
            shape={shapes.leftLeg}
            scale={[legScale.x * 0.6, legScale.y * 1.2, legScale.z * 0.9]}
            color={colors.leftLeg}
            roughness={furRoughness}
          />
        </group>

        {/* 右腿 */}
        <group 
          ref={rightLegRef}
          position={[
            rightLegJoint.anchor[0] + rightLegJoint.offset[0],
            rightLegJoint.anchor[1] + rightLegJoint.offset[1],
            rightLegJoint.anchor[2] + rightLegJoint.offset[2]
          ]}
        >
          <BodyPart
            shape={shapes.rightLeg}
            scale={[legScale.x * 0.6, legScale.y * 1.2, legScale.z * 0.9]}
            color={colors.rightLeg}
            roughness={furRoughness}
          />
        </group>

        {/* 尾巴 */}
        <group 
          ref={tailRef}
          position={[
            tailJoint.anchor[0] + tailJoint.offset[0],
            tailJoint.anchor[1] + tailJoint.offset[1],
            tailJoint.anchor[2] + tailJoint.offset[2]
          ]}
        >
          <BodyPart
            shape={shapes.tail}
            scale={[tailScale.x * 0.5, tailScale.y * 0.6, tailScale.z * 0.4]}
            color={colors.tail}
            roughness={furRoughness}
          />
        </group>
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
