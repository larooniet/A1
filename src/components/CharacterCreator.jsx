import React from 'react'
import { useCharacterStore } from '../hooks/useCharacterStore'

const SHAPES = [
  { id: 'sphere', name: '球体', icon: '🔮' },
  { id: 'capsule', name: '胶囊', icon: '💊' },
  { id: 'box', name: '方体', icon: '📦' },
  { id: 'cylinder', name: '圆柱', icon: '🥫' },
  { id: 'cone', name: '圆锥', icon: '🔺' },
  { id: 'torus', name: '圆环', icon: '🍩' },
  { id: 'dodecahedron', name: '十二面体', icon: '⬡' },
  { id: 'icosahedron', name: '二十面体', icon: '🔯' },
  { id: 'octahedron', name: '八面体', icon: '💎' },
  { id: 'tetrahedron', name: '四面体', icon: '🔻' },
  { id: 'torusKnot', name: '扭结', icon: '🌀' },
]

const BODY_PARTS = [
  { key: 'head', name: '头部', defaultShape: 'sphere' },
  { key: 'body', name: '身体', defaultShape: 'capsule' },
  { key: 'leftArm', name: '左臂', defaultShape: 'capsule' },
  { key: 'rightArm', name: '右臂', defaultShape: 'capsule' },
  { key: 'leftLeg', name: '左腿', defaultShape: 'capsule' },
  { key: 'rightLeg', name: '右腿', defaultShape: 'capsule' },
  { key: 'leftEar', name: '左耳', defaultShape: 'sphere' },
  { key: 'rightEar', name: '右耳', defaultShape: 'sphere' },
  { key: 'tail', name: '尾巴', defaultShape: 'sphere' },
]

const BEAR_PRESETS = [
  { name: '棕熊', body: '#8B6914', belly: '#654321', nose: '#2F1810' },
  { name: '北极熊', body: '#F5F5DC', belly: '#FFF8DC', nose: '#2F1810' },
  { name: '熊猫', body: '#FFFFFF', belly: '#FFFFFF', nose: '#000000', eye: '#000000' },
  { name: '黑熊', body: '#2F1810', belly: '#3D2817', nose: '#1A0F0A' },
  { name: '粉熊', body: '#FFB6C1', belly: '#FF69B4', nose: '#FF1493' },
  { name: '蓝熊', body: '#87CEEB', belly: '#00BFFF', nose: '#1E90FF' },
]

function ColorPicker({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: '40px', height: '40px', border: 'none', borderRadius: '10px', cursor: 'pointer', background: 'none' }}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, padding: '8px 12px', borderRadius: '10px',
            border: '1px solid rgba(255, 105, 180, 0.3)',
            background: 'rgba(0, 0, 0, 0.5)', color: 'white', fontSize: '13px', outline: 'none'
          }}
        />
      </div>
    </div>
  )
}

function Slider({ label, value, min, max, step, onChange }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{label}</label>
        <span style={{ color: '#ff69b4', fontSize: '12px' }}>{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%', height: '6px', borderRadius: '3px', outline: 'none', cursor: 'pointer',
          appearance: 'none',
          background: `linear-gradient(to right, #ff69b4 0%, #ff69b4 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)`
        }}
      />
    </div>
  )
}

export default function CharacterCreator() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('shapes')
  const { name, setName, appearance, setAppearance, resetAppearance } = useCharacterStore()

  const setPartShape = (part, shape) => {
    setAppearance('shapes', { ...appearance.shapes, [part]: shape })
  }

  const setPartColor = (part, color) => {
    setAppearance('colors', { ...appearance.colors, [part]: color })
  }

  const setPartScale = (part, axis, value) => {
    const current = appearance.scales[part] || { x: 1, y: 1, z: 1 }
    setAppearance('scales', { ...appearance.scales, [part]: { ...current, [axis]: value } })
  }

  const applyBearPreset = (preset) => {
    const newColors = { ...appearance.colors }
    Object.keys(newColors).forEach(key => {
      if (key !== 'eye' && key !== 'blush') {
        newColors[key] = preset.body
      }
    })
    newColors.tail = preset.belly || preset.body
    newColors.nose = preset.nose
    if (preset.eye) newColors.eye = preset.eye
    setAppearance('colors', newColors)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '80px', left: '20px',
          width: '56px', height: '56px', borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, #00bfff, #9370db)',
          color: 'white', fontSize: '24px', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 191, 255, 0.4)',
          zIndex: 100, transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
      >
        🎨
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '150px', left: '20px', width: '360px',
          maxHeight: '70vh', background: 'rgba(10, 10, 30, 0.95)',
          borderRadius: '20px', border: '1px solid rgba(0, 191, 255, 0.3)',
          backdropFilter: 'blur(20px)', zIndex: 100, overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}>
          {/* 标题 */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#00bfff', fontWeight: 'bold', fontSize: '16px' }}>✨ 玩偶工坊</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>自定义{name}的外观</div>
            </div>
            <button onClick={resetAppearance} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer' }}>
              重置
            </button>
          </div>

          {/* 名字编辑 */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
              玩偶名字
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="起个名字..."
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '10px',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                background: 'rgba(0, 0, 0, 0.5)', color: 'white',
                fontSize: '14px', outline: 'none', fontWeight: 'bold',
              }}
            />
          </div>

          {/* Tab 切换 */}
          <div style={{ display: 'flex', padding: '12px 20px 0', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { id: 'shapes', label: '🔷 形状' },
              { id: 'colors', label: '🎨 颜色' },
              { id: 'size', label: '📐 尺寸' },
              { id: 'presets', label: '🐻 预设' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, padding: '8px', borderRadius: '10px', border: 'none',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #00bfff, #9370db)' : 'rgba(255,255,255,0.05)',
                  color: 'white', fontSize: '12px', cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '16px 20px 20px' }}>
            {/* 形状 Tab - 11种形状 */}
            {activeTab === 'shapes' && BODY_PARTS.map(part => (
              <div key={part.key} style={{ marginBottom: '16px' }}>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '8px', fontWeight: 'bold' }}>
                  {part.name}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {SHAPES.map(shape => (
                    <button
                      key={shape.id}
                      onClick={() => setPartShape(part.key, shape.id)}
                      style={{
                        padding: '6px 10px', borderRadius: '8px', border: '1px solid',
                        borderColor: appearance.shapes[part.key] === shape.id ? '#00bfff' : 'rgba(255,255,255,0.2)',
                        background: appearance.shapes[part.key] === shape.id ? 'rgba(0, 191, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                        color: 'white', fontSize: '11px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      {shape.icon} {shape.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* 颜色 Tab */}
            {activeTab === 'colors' && BODY_PARTS.map(part => (
              <ColorPicker
                key={part.key}
                label={part.name}
                value={appearance.colors[part.key] || '#8B6914'}
                onChange={v => setPartColor(part.key, v)}
              />
            ))}

            {/* 尺寸 Tab */}
            {activeTab === 'size' && BODY_PARTS.map(part => (
              <div key={part.key} style={{ marginBottom: '16px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '8px', fontWeight: 'bold' }}>
                  {part.name}
                </div>
                {['x', 'y', 'z'].map(axis => (
                  <Slider
                    key={axis}
                    label={`${axis.toUpperCase()} 轴缩放`}
                    value={(appearance.scales[part.key] || { x: 1, y: 1, z: 1 })[axis]}
                    min={0.2}
                    max={3}
                    step={0.05}
                    onChange={v => setPartScale(part.key, axis, v)}
                  />
                ))}
              </div>
            ))}

            {/* 预设 Tab */}
            {activeTab === 'presets' && (
              <div>
                <div style={{ color: '#00bfff', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>
                  🐻 小熊配色预设
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {BEAR_PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => applyBearPreset(preset)}
                      style={{
                        padding: '12px', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'white', fontSize: '13px', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      }}
                    >
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${preset.body}, ${preset.belly || preset.body})`,
                        border: '2px solid rgba(255,255,255,0.3)',
                      }} />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
