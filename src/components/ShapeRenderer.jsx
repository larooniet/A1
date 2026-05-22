import React, { useMemo } from 'react'
import * as THREE from 'three'

// 形状渲染器 - 根据形状ID返回对应的几何体
export function ShapeGeometry({ shape, args = [1, 1, 1], ...props }) {
  const geometry = useMemo(() => {
    switch (shape) {
      case 'sphere':
        return <sphereGeometry args={[Math.max(...args) * 0.5, 32, 32]} />
      case 'capsule':
        return <capsuleGeometry args={[args[0] * 0.3, args[1] * 0.7, 8, 16]} />
      case 'box':
        return <boxGeometry args={args} />
      case 'cylinder':
        return <cylinderGeometry args={[args[0] * 0.4, args[0] * 0.4, args[1], 16]} />
      case 'cone':
        return <coneGeometry args={[args[0] * 0.5, args[1], 16]} />
      case 'torus':
        return <torusGeometry args={[args[0] * 0.4, args[0] * 0.15, 16, 32]} />
      default:
        return <sphereGeometry args={[Math.max(...args) * 0.5, 32, 32]} />
    }
  }, [shape, args])

  return (
    <mesh {...props}>
      {geometry}
    </mesh>
  )
}

// 毛绒材质
export function FurMaterial({ color = '#ffb6c1', roughness = 0.9, emissiveIntensity = 0.05 }) {
  const furNormalMap = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    const imageData = ctx.createImageData(256, 256)
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
      emissiveIntensity={emissiveIntensity}
    />
  )
}
