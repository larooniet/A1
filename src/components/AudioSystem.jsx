import React, { useRef, useState, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'
import * as THREE from 'three'

// 背景音乐管理器
export function BackgroundAudio() {
  const { camera } = useThree()
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const soundRef = useRef()
  const listenerRef = useRef()

  useEffect(() => {
    // 创建音频监听器并附加到相机
    const listener = new THREE.AudioListener()
    camera.add(listener)
    listenerRef.current = listener

    // 创建环境背景音乐（非位置依赖）
    const sound = new THREE.Audio(listener)
    soundRef.current = sound

    const audioLoader = new THREE.AudioLoader()

    // 尝试加载背景音乐 - 用户可以替换为自己的音频文件
    // 支持 .mp3, .ogg, .wav 格式
    const audioUrl = '/ambient-music.mp3'

    audioLoader.load(
      audioUrl,
      (buffer) => {
        sound.setBuffer(buffer)
        sound.setLoop(true)
        sound.setVolume(volume)
        console.log('🎵 背景音乐加载成功')
      },
      undefined,
      (err) => {
        console.log('⚠️ 未找到背景音乐文件，请放置音频到 public/ambient-music.mp3')
      }
    )

    return () => {
      if (sound.isPlaying) sound.stop()
      camera.remove(listener)
    }
  }, [camera])

  // 暴露控制方法到全局
  useEffect(() => {
    window.plushAudio = {
      play: () => {
        if (soundRef.current && !soundRef.current.isPlaying) {
          soundRef.current.play()
          setIsPlaying(true)
        }
      },
      pause: () => {
        if (soundRef.current && soundRef.current.isPlaying) {
          soundRef.current.pause()
          setIsPlaying(false)
        }
      },
      setVolume: (v) => {
        setVolume(v)
        if (soundRef.current) soundRef.current.setVolume(v)
      },
      isPlaying: () => isPlaying
    }
  }, [isPlaying])

  return null
}

// 空间音效组件 - 可以附加到任何3D对象
export function SpatialSound({ url, position, distance = 3, loop = true, autoplay = false }) {
  const audioRef = useRef()

  return (
    <group position={position}>
      <PositionalAudio
        ref={audioRef}
        url={url}
        distance={distance}
        loop={loop}
        autoplay={autoplay}
      />
    </group>
  )
}

// 音频可视化 - 将音频频率数据映射到视觉效果
export function AudioVisualizer({ audioRef, children }) {
  const [frequencyData, setFrequencyData] = useState(new Uint8Array(64))

  useEffect(() => {
    if (!audioRef.current) return

    const analyser = new THREE.AudioAnalyser(audioRef.current, 64)

    const update = () => {
      const data = analyser.getFrequencyData()
      setFrequencyData(data)
      requestAnimationFrame(update)
    }

    update()
  }, [audioRef])

  return children(frequencyData)
}
