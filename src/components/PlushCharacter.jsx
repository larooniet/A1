import React, { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, animated, config } from '@react-spring/three'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useCharacterStore } from '../hooks/useCharacterStore'

// 毛绒材质 - 接入捏制参数
function FurMaterial({ color = '#ffb6c1', roughness = 0.9, ...props }) {
  const materialRef = useRef()

  const furNormalMap = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    const imageData = ctx.createImageData(512, 512)
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = Math.random() * 255
      imageData.data[i] = noise
      imageData.data[i + 1] = noise
      imageData.data[i + 2] = noise
      imageData.data[i + 3] = 255
    }
    ctx.putImageData(imageData, 0, 0)
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
    return texture
  }, [])

  return (
    <meshPhysicalMaterial
      ref={materialRef}
      color={color}
      roughness={roughness}
      metalness={0.05}
      normalMap={furNormalMap}
      normalScale={[0.3, 0.3]}
      sheen={1}
      sheenRoughness={0.5}
      sheenColor="#ffffff"
      clearcoat={0.1}
      clearcoatRoughness={0.8}
      emissive={color}
      emissiveIntensity={0.05}
      {...props}
    />
  )
}

// 眼睛组件 - 接入大小和间距参数
function Eye({ position, scale = 1, isBlinking }) {
  const eyeRef = useRef()

  return (
    <group position={position}>
      <Sphere args={[0.18 * scale, 32, 32]} ref={eyeRef} scale={[1, isBlinking ? 0.1 : 1, 1]}>
        <meshPhysicalMaterial
          color="#1a1a2e"
          roughness={0.1}
          metalness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>
      <Sphere args={[0.06 * scale, 16, 16]} position={[0.06 * scale, 0.08 * scale, 0.14]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
      <Sphere args={[0.03 * scale, 16, 16]} position={[-0.05 * scale, -0.05 * scale, 0.15]}>
        <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
      </Sphere>
      <Sphere args={[0.1 * scale, 16, 16]} position={[0, -0.08 * scale, 0.12]}>
        <meshBasicMaterial color="#ffb6c1" opacity={0.3} transparent />
      </Sphere>
    </group>
  )
}

// 耳朵组件 - 接入大小和角度参数
function Ear({ position, rotation, scale = 1, color }) {
  return (
    <group position={position} rotation={rotation}>
      <Sphere args={[0.25 * scale, 32, 32]} scale={[1, 1.3, 0.6]}>
        <FurMaterial color={color} />
      </Sphere>
      <Sphere args={[0.15 * scale, 32, 32]} position={[0, 0, 0.08]} scale={[0.8, 1.1, 0.5]}>
        <meshPhysicalMaterial
          color="#ff69b4"
          roughness={0.8}
          emissive="#ff1493"
          emissiveIntensity={0.1}
        />
      </Sphere>
    </group>
  )
}

// 腮红 - 接入强度参数
function Blush({ position, intensity = 0.4 }) {
  return (
    <Sphere args={[0.12, 16, 16]} position={position} scale={[1.3, 0.8, 0.5]}>
      <meshPhysicalMaterial
        color="#ff69b4"
        transparent
        opacity={intensity}
        roughness={1}
        emissive="#ff1493"
        emissiveIntensity={intensity * 0.5}
      />
    </Sphere>
  )
}

// 身体主体 - 接入圆润度参数
function Body({ roundness, color, bellyColor, glowIntensity, isJumping }) {
  const bodyRef = useRef()

  useFrame((state) => {
    if (bodyRef.current && !isJumping) {
      const t = state.clock.elapsedTime
      bodyRef.current.scale.y = 1 + Math.sin(t * 2) * 0.02
      bodyRef.current.scale.x = 1 + Math.sin(t * 2 + Math.PI) * 0.01
      bodyRef.current.scale.z = 1 + Math.sin(t * 2 + Math.PI) * 0.01
    }
  })

  return (
    <group ref={bodyRef}>
      <Sphere args={[1, 64, 64]} scale={[1, roundness, 0.9]} position={[0, -0.3, 0]}>
        <FurMaterial color={color} />
      </Sphere>
      <Sphere args={[0.9, 32, 32]} position={[0, -0.8, 0.1]} scale={[1, 0.5, 0.8]}>
        <meshPhysicalMaterial
          color={bellyColor}
          emissive={bellyColor}
          emissiveIntensity={glowIntensity}
          transparent
          opacity={0.6}
          roughness={0.9}
        />
      </Sphere>
    </group>
  )
}

// 手臂
function Arm({ position, rotation, side, color }) {
  const armRef = useRef()

  useFrame((state) => {
    if (armRef.current) {
      const t = state.clock.elapsedTime
      armRef.current.rotation.z = rotation[2] + Math.sin(t * 1.5 + (side === 'left' ? 0 : Math.PI)) * 0.1
    }
  })

  return (
    <group ref={armRef} position={position} rotation={rotation}>
      <Sphere args={[0.35, 32, 32]} scale={[0.7, 1.2, 0.8]}>
        <FurMaterial color={color} />
      </Sphere>
      <Sphere args={[0.25, 32, 32]} position={[0, -0.4, 0]}>
        <FurMaterial color="#ff69b4" />
      </Sphere>
    </group>
  )
}

// 腿部
function Leg({ position, side, color }) {
  const legRef = useRef()

  useFrame((state) => {
    if (legRef.current) {
      const t = state.clock.elapsedTime
      legRef.current.position.y = position[1] + Math.sin(t * 2 + (side === 'left' ? 0 : Math.PI)) * 0.03
    }
  })

  return (
    <group ref={legRef} position={position}>
      <Sphere args={[0.3, 32, 32]} scale={[0.8, 1.1, 0.9]}>
        <FurMaterial color={color} />
      </Sphere>
      <Sphere args={[0.22, 32, 32]} position={[0, -0.35, 0.05]} scale={[1, 0.6, 1.2]}>
        <FurMaterial color="#ff69b4" />
      </Sphere>
    </group>
  )
}

// 主组件
export default function PlushCharacter({ position = [0, 0, 0] }) {
  const groupRef = useRef()
  const headRef = useRef()
  const [isJumping, setIsJumping] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const { mouse } = useThree()

  // 从 store 读取捏制参数
  const appearance = useCharacterStore(state => state.appearance)
  const { 
    bodyColor, bellyColor, eyeSize, eyeSpacing, 
    earSize, earAngle, bodyRoundness, 
    blushIntensity, glowIntensity, furRoughness 
  } = appearance

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
      const targetX = mouse.x * 0.5
      const targetY = mouse.y * 0.3
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.05)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetY, 0.05)
    }
    if (groupRef.current && !isJumping) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.2, 0.02)
    }
  })

  // 随机眨眼
  useState(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(blinkInterval)
  })

  const handleClick = () => {
    if (!isJumping) {
      setIsJumping(true)
    }
  }

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
        <Sphere args={[0.85, 64, 64]} scale={[1.1, 0.95, 1]}>
          <FurMaterial color={hovered ? '#ffc0cb' : bodyColor} roughness={furRoughness} />
        </Sphere>

        {/* 耳朵 - 接入大小和角度参数 */}
        <Ear 
          position={[-0.5, 0.5, 0]} 
          rotation={[0, 0, -earAngle]} 
          scale={earSize} 
          color={bodyColor}
        />
        <Ear 
          position={[0.5, 0.5, 0]} 
          rotation={[0, 0, earAngle]} 
          scale={earSize} 
          color={bodyColor}
        />

        {/* 眼睛 - 接入大小和间距参数 */}
        <Eye 
          position={[-0.28 * eyeSpacing, 0.05, 0.72]} 
          scale={eyeSize} 
          isBlinking={isBlinking}
        />
        <Eye 
          position={[0.28 * eyeSpacing, 0.05, 0.72]} 
          scale={eyeSize} 
          isBlinking={isBlinking}
        />

        {/* 腮红 - 接入强度参数 */}
        <Blush position={[-0.45, -0.15, 0.65]} intensity={blushIntensity} />
        <Blush position={[0.45, -0.15, 0.65]} intensity={blushIntensity} />

        {/* 鼻子 */}
        <Sphere args={[0.06, 16, 16]} position={[0, -0.08, 0.78]}>
          <meshPhysicalMaterial
            color="#ff1493"
            roughness={0.3}
            metalness={0.1}
            clearcoat={0.5}
          />
        </Sphere>

        {/* 嘴巴 */}
        <Sphere args={[0.04, 16, 16]} position={[0, -0.18, 0.75]} scale={[1.5, 0.5, 0.5]}>
          <meshPhysicalMaterial color="#ff69b4" roughness={0.8} />
        </Sphere>

        {/* 头顶绒毛 */}
        <Sphere args={[0.08, 16, 16]} position={[0, 0.85, 0]}>
          <FurMaterial color="#ffc0cb" roughness={furRoughness} />
        </Sphere>
      </group>

      {/* 身体 - 接入圆润度和颜色参数 */}
      <Body 
        roundness={bodyRoundness} 
        color={bodyColor}
        bellyColor={bellyColor}
        glowIntensity={glowIntensity}
        isJumping={isJumping}
      />

      {/* 手臂 */}
      <Arm position={[-0.7, -0.2, 0.2]} rotation={[0, 0, 0.4]} side="left" color={bodyColor} />
      <Arm position={[0.7, -0.2, 0.2]} rotation={[0, 0, -0.4]} side="right" color={bodyColor} />

      {/* 腿部 */}
      <Leg position={[-0.4, -1.1, 0.2]} side="left" color={bodyColor} />
      <Leg position={[0.4, -1.1, 0.2]} side="right" color={bodyColor} />

      {/* 尾巴 */}
      <group position={[0, -0.6, -0.6]}>
        <Sphere args={[0.25, 32, 32]} scale={[1, 1.2, 0.8]}>
          <FurMaterial color="#ff69b4" roughness={furRoughness} />
        </Sphere>
        <Sphere args={[0.15, 32, 32]} position={[0, -0.25, -0.1]}>
          <FurMaterial color="#ff1493" roughness={furRoughness} />
        </Sphere>
      </group>

      {/* 环绕光晕 */}
      <pointLight 
        position={[0, 0, 1]} 
        intensity={glowIntensity * 2} 
        color={bellyColor}
        distance={3}
      />
    </animated.group>
  )
}
