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
  { key: 'head', name: '头部' },
  { key: 'body', name: '身体' },
  { key: 'leftArm', name: '左臂' },
  { key: 'rightArm', name: '右臂' },
  { key: 'leftLeg', name: '左腿' },
  { key: 'rightLeg', name: '右腿' },
  { key: 'leftEar', name: '左耳' },
  { key: 'rightEar', name: '右耳' },
  { key: 'tail', name: '尾巴' },
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
    <div style={{ marginBottom: '10px' }}>
      <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>{label}</label>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ width: '32px', height: '32px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }} />
        <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255, 105, 180, 0.3)', background: 'rgba(0, 0, 0, 0.5)', color: 'white', fontSize: '12px', outline: 'none' }} />
      </div>
    </div>
  )
}

function Slider({ label, value, min, max, step, onChange }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{label}</label>
        <span style={{ color: '#ff69b4', fontSize: '11px' }}>{value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', height: '5px', borderRadius: '3px', outline: 'none', cursor: 'pointer', appearance: 'none',
          background: `linear-gradient(to right, #ff69b4 0%, #ff69b4 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)` }} />
    </div>
  )
}

export default function CharacterCreator() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('shapes')
  const [selectedPart, setSelectedPart] = React.useState('head')
  const { name, setName, appearance, setAppearance, setDeform, resetAppearance } = useCharacterStore()

  const setPartShape = (part, shape) => setAppearance('shapes', { ...appearance.shapes, [part]: shape })
  const setPartColor = (part, color) => setAppearance('colors', { ...appearance.colors, [part]: color })
  const setPartScale = (part, axis, value) => {
    const current = appearance.scales[part] || { x: 1, y: 1, z: 1 }
    setAppearance('scales', { ...appearance.scales, [part]: { ...current, [axis]: value } })
  }

  const applyBearPreset = (preset) => {
    const newColors = { ...appearance.colors }
    Object.keys(newColors).forEach(key => { if (key !== 'eye' && key !== 'blush') newColors[key] = preset.body })
    newColors.tail = preset.belly || preset.body
    newColors.nose = preset.nose
    if (preset.eye) newColors.eye = preset.eye
    setAppearance('colors', newColors)
  }

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        position: 'fixed', bottom: '80px', left: '20px', width: '56px', height: '56px',
        borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #00bfff, #9370db)',
        color: 'white', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0, 191, 255, 0.4)',
        zIndex: 100, transition: 'transform 0.2s',
      }} onMouseEnter={e => e.target.style.transform = 'scale(1.1)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
        🎨
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '150px', left: '20px', width: '380px',
          maxHeight: '75vh', background: 'rgba(10, 10, 30, 0.95)', borderRadius: '20px',
          border: '1px solid rgba(0, 191, 255, 0.3)', backdropFilter: 'blur(20px)',
          zIndex: 100, overflowY: 'auto', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}>
          {/* 标题 */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#00bfff', fontWeight: 'bold', fontSize: '15px' }}>✨ 玩偶工坊</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>橡皮泥捏制 {name}</div>
            </div>
            <button onClick={resetAppearance} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', cursor: 'pointer' }}>重置</button>
          </div>

          {/* 名字 */}
          <div style={{ padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="起个名字..."
              style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(0, 191, 255, 0.3)', background: 'rgba(0, 0, 0, 0.5)', color: 'white', fontSize: '13px', outline: 'none', fontWeight: 'bold' }} />
          </div>

          {/* Tab */}
          <div style={{ display: 'flex', padding: '10px 18px 0', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { id: 'shapes', label: '🔷 形状' },
              { id: 'clay', label: '🧱 橡皮泥' },
              { id: 'colors', label: '🎨 颜色' },
              { id: 'presets', label: '🐻 预设' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #00bfff, #9370db)' : 'rgba(255,255,255,0.05)',
                  color: 'white', fontSize: '11px', cursor: 'pointer', fontWeight: activeTab === tab.id ? 'bold' : 'normal' }}>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '14px 18px 18px' }}>
            {/* 部位选择器 */}
            {activeTab !== 'presets' && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: '6px' }}>选择部位</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {BODY_PARTS.map(part => (
                    <button key={part.key} onClick={() => setSelectedPart(part.key)}
                      style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid',
                        borderColor: selectedPart === part.key ? '#00bfff' : 'rgba(255,255,255,0.15)',
                        background: selectedPart === part.key ? 'rgba(0, 191, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                        color: 'white', fontSize: '11px', cursor: 'pointer' }}>
                      {part.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 形状 Tab */}
            {activeTab === 'shapes' && (
              <div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
                  {BODY_PARTS.find(p => p.key === selectedPart)?.name} 形状
                </div>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {SHAPES.map(shape => (
                    <button key={shape.id} onClick={() => setPartShape(selectedPart, shape.id)}
                      style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid',
                        borderColor: appearance.shapes[selectedPart] === shape.id ? '#00bfff' : 'rgba(255,255,255,0.15)',
                        background: appearance.shapes[selectedPart] === shape.id ? 'rgba(0, 191, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                        color: 'white', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {shape.icon} {shape.name}
                    </button>
                  ))}
                </div>

                {/* 尺寸 */}
                <div style={{ marginTop: '14px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>尺寸缩放</div>
                  {['x', 'y', 'z'].map(axis => (
                    <Slider key={axis} label={`${axis.toUpperCase()} 轴`}
                      value={(appearance.scales[selectedPart] || { x: 1, y: 1, z: 1 })[axis]}
                      min={0.2} max={3} step={0.05}
                      onChange={v => setPartScale(selectedPart, axis, v)} />
                  ))}
                </div>
              </div>
            )}

            {/* 橡皮泥 Tab */}
            {activeTab === 'clay' && (
              <div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
                  🧱 {BODY_PARTS.find(p => p.key === selectedPart)?.name} 橡皮泥变形
                </div>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                  <Slider label="膨胀 (Bulge)" value={appearance.deform[selectedPart]?.bulge || 0}
                    min={-1} max={1} step={0.05} onChange={v => setDeform(selectedPart, 'bulge', v)} />
                  <Slider label="挤压 (Pinch)" value={appearance.deform[selectedPart]?.pinch || 0}
                    min={-1} max={1} step={0.05} onChange={v => setDeform(selectedPart, 'pinch', v)} />
                  <Slider label="扭转 (Twist)" value={appearance.deform[selectedPart]?.twist || 0}
                    min={-1} max={1} step={0.05} onChange={v => setDeform(selectedPart, 'twist', v)} />
                </div>
                <div style={{ marginTop: '10px', color: 'rgba(255,255,255,0.4)', fontSize: '10px', lineHeight: '1.5' }}>
                  💡 膨胀: 让部位鼓起或凹陷<br/>
                  💡 挤压: 让部位变瘦或变胖<br/>
                  💡 扭转: 让部位螺旋变形
                </div>
              </div>
            )}

            {/* 颜色 Tab */}
            {activeTab === 'colors' && (
              <div>
                <ColorPicker label={BODY_PARTS.find(p => p.key === selectedPart)?.name + ' 颜色'}
                  value={appearance.colors[selectedPart] || '#8B6914'}
                  onChange={v => setPartColor(selectedPart, v)} />
              </div>
            )}

            {/* 预设 Tab */}
            {activeTab === 'presets' && (
              <div>
                <div style={{ color: '#00bfff', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>🐻 小熊配色</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                  {BEAR_PRESETS.map(preset => (
                    <button key={preset.name} onClick={() => applyBearPreset(preset)}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(0, 0, 0, 0.3)', color: 'white', fontSize: '11px', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${preset.body}, ${preset.belly || preset.body})`,
                        border: '2px solid rgba(255,255,255,0.3)' }} />
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
