import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls as DreiOrbitControls } from '@react-three/drei'

export default function CameraControls() {
  const controlsRef = useRef()
  const { camera } = useThree()

  // 初始位置
  React.useEffect(() => {
    camera.position.set(0, 2, 6)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <DreiOrbitControls
      ref={controlsRef}
      args={[camera]}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={15}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 1.5}
      autoRotate={false}
      autoRotateSpeed={0.5}
      target={[0, 0, 0]}
    />
  )
}
