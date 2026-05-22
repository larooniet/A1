import React, { useState, useEffect } from 'react'

export default function AudioControl() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(30)
  const [hasAudio, setHasAudio] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // 检测是否有音频文件
  useEffect(() => {
    fetch('/ambient-music.mp3', { method: 'HEAD' })
      .then(() => setHasAudio(true))
      .catch(() => setHasAudio(false))
  }, [])

  const togglePlay = () => {
    if (window.plushAudio) {
      if (isPlaying) {
        window.plushAudio.pause()
      } else {
        window.plushAudio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e) => {
    const v = parseInt(e.target.value)
    setVolume(v)
    if (window.plushAudio) {
      window.plushAudio.setVolume(v / 100)
    }
  }

  return (
    <>
      {/* 音频按钮 */}
      <button
        onClick={() => {
          if (!hasAudio && !isOpen) {
            setIsOpen(true)
            return
          }
          if (hasAudio) togglePlay()
        }}
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          background: isPlaying 
            ? 'linear-gradient(135deg, #ff69b4, #ff1493)' 
            : 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 100,
          transition: 'all 0.3s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={e => {
          e.target.style.transform = 'translateX(-50%) scale(1.1)'
          e.target.style.background = 'linear-gradient(135deg, #ff69b4, #ff1493)'
        }}
        onMouseLeave={e => {
          e.target.style.transform = 'translateX(-50%) scale(1)'
          if (!isPlaying) e.target.style.background = 'rgba(255, 255, 255, 0.1)'
        }}
      >
        {isPlaying ? '🔊' : hasAudio ? '🔇' : '❓'}
      </button>

      {/* 音频控制面板 */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '140px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          background: 'rgba(10, 10, 30, 0.95)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 105, 180, 0.3)',
          backdropFilter: 'blur(20px)',
          zIndex: 100,
          padding: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <div style={{ color: '#ff69b4', fontWeight: 'bold', fontSize: '14px' }}>
              🎵 背景音乐
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              ✕
            </button>
          </div>

          {!hasAudio ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎶</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.6' }}>
                未检测到音频文件<br/>
                请将 .mp3 文件放入 public 目录<br/>
                并命名为 ambient-music.mp3
              </div>
              <div style={{ 
                marginTop: '12px', 
                padding: '10px', 
                background: 'rgba(0,0,0,0.3)', 
                borderRadius: '8px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'monospace',
              }}>
                public/ambient-music.mp3
              </div>
            </div>
          ) : (
            <>
              {/* 播放/暂停 */}
              <button
                onClick={togglePlay}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isPlaying 
                    ? 'linear-gradient(135deg, #ff1493, #ff69b4)' 
                    : 'linear-gradient(135deg, #00bfff, #9370db)',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  fontWeight: 'bold',
                }}
              >
                {isPlaying ? '⏸ 暂停播放' : '▶ 开始播放'}
              </button>

              {/* 音量控制 */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '8px',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '12px',
                }}>
                  <span>🔉 音量</span>
                  <span>{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    background: `linear-gradient(to right, #ff69b4 0%, #ff69b4 ${volume}%, rgba(255,255,255,0.1) ${volume}%)`,
                  }}
                />
              </div>

              {/* 音频可视化条 */}
              {isPlaying && (
                <div style={{
                  display: 'flex',
                  gap: '3px',
                  alignItems: 'flex-end',
                  height: '40px',
                  justifyContent: 'center',
                  marginTop: '12px',
                }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '6px',
                        borderRadius: '3px',
                        background: 'linear-gradient(to top, #ff69b4, #00bfff)',
                        height: `${Math.random() * 30 + 10}px`,
                        animation: `audioBar ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          <div style={{
            marginTop: '16px',
            padding: '10px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: '1.5',
          }}>
            💡 支持格式: MP3, OGG, WAV<br/>
            空间音频: 靠近水晶和岛屿时音量会变化
          </div>
        </div>
      )}

      <style>{"
        @keyframes audioBar {
          0% { height: 10px; opacity: 0.5; }
          100% { height: 35px; opacity: 1; }
        }
      "}</style>
    </>
  )
}
