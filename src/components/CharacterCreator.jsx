import React from 'react'
import { useCharacterStore } from '../hooks/useCharacterStore'

function ColorPicker({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: '12px', 
        display: 'block', 
        marginBottom: '6px' 
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            background: 'none',
          }}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 105, 180, 0.3)',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            fontSize: '13px',
            outline: 'none',
          }}
        />
      </div>
    </div>
  )
}

function Slider({ label, value, min, max, step, onChange, description }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
          {label}
        </label>
        <span style={{ color: '#ff69b4', fontSize: '12px', fontWeight: 'bold' }}>
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          background: `linear-gradient(to right, #ff69b4 0%, #ff69b4 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
      {description && (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>
          {description}
        </div>
      )}
    </div>
  )
}

export default function CharacterCreator() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { appearance, setAppearance, resetAppearance } = useCharacterStore()

  return (
    <>
      {/* 捏制按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #00bfff, #9370db)',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 191, 255, 0.4)',
          zIndex: 100,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.target.style.transform = 'scale(1.1)'
          e.target.style.boxShadow = '0 6px 30px rgba(0, 191, 255, 0.6)'
        }}
        onMouseLeave={e => {
          e.target.style.transform = 'scale(1)'
          e.target.style.boxShadow = '0 4px 20px rgba(0, 191, 255, 0.4)'
        }}
      >
        🎨
      </button>

      {/* 捏制面板 */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '150px',
          left: '20px',
          width: '320px',
          maxHeight: '70vh',
          background: 'rgba(10, 10, 30, 0.95)',
          borderRadius: '20px',
          border: '1px solid rgba(0, 191, 255, 0.3)',
          backdropFilter: 'blur(20px)',
          zIndex: 100,
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          padding: '20px',
        }}>
          {/* 标题 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>✨</span>
              <div>
                <div style={{ color: '#00bfff', fontWeight: 'bold', fontSize: '16px' }}>
                  玩偶工坊
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                  打造你的专属绒绒
                </div>
              </div>
            </div>
            <button
              onClick={resetAppearance}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.6)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              重置
            </button>
          </div>

          {/* 颜色设置 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ color: '#00bfff', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>
              🎨 颜色
            </div>
            <ColorPicker
              label="主体颜色"
              value={appearance.bodyColor}
              onChange={v => setAppearance('bodyColor', v)}
            />
            <ColorPicker
              label="腹部/发光色"
              value={appearance.bellyColor}
              onChange={v => setAppearance('bellyColor', v)}
            />
          </div>

          {/* 体型设置 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ color: '#00bfff', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>
              📐 体型
            </div>
            <Slider
              label="眼睛大小"
              value={appearance.eyeSize}
              min={0.5}
              max={1.5}
              step={0.05}
              onChange={v => setAppearance('eyeSize', v)}
              description="调整眼睛的比例"
            />
            <Slider
              label="眼睛间距"
              value={appearance.eyeSpacing}
              min={0.5}
              max={1.5}
              step={0.05}
              onChange={v => setAppearance('eyeSpacing', v)}
              description="调整双眼之间的距离"
            />
            <Slider
              label="耳朵大小"
              value={appearance.earSize}
              min={0.5}
              max={1.5}
              step={0.05}
              onChange={v => setAppearance('earSize', v)}
            />
            <Slider
              label="耳朵角度"
              value={appearance.earAngle}
              min={0}
              max={0.8}
              step={0.05}
              onChange={v => setAppearance('earAngle', v)}
              description="耳朵向外展开的角度"
            />
            <Slider
              label="身体圆润度"
              value={appearance.bodyRoundness}
              min={0.8}
              max={1.5}
              step={0.05}
              onChange={v => setAppearance('bodyRoundness', v)}
            />
          </div>

          {/* 质感设置 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ color: '#00bfff', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>
              ✨ 质感
            </div>
            <Slider
              label="腮红浓度"
              value={appearance.blushIntensity}
              min={0}
              max={1}
              step={0.05}
              onChange={v => setAppearance('blushIntensity', v)}
            />
            <Slider
              label="发光强度"
              value={appearance.glowIntensity}
              min={0}
              max={1}
              step={0.05}
              onChange={v => setAppearance('glowIntensity', v)}
              description="身体边缘的梦幻光晕"
            />
            <Slider
              label="毛绒粗糙度"
              value={appearance.furRoughness}
              min={0.3}
              max={1}
              step={0.05}
              onChange={v => setAppearance('furRoughness', v)}
              description="数值越高越像长毛，越低越光滑"
            />
          </div>

          {/* 预设配色 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{ color: '#00bfff', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>
              🎭 快速预设
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { name: '樱花粉', body: '#ffb6c1', belly: '#ff69b4' },
                { name: '天空蓝', body: '#87ceeb', belly: '#00bfff' },
                { name: '薰衣草', body: '#e6e6fa', belly: '#9370db' },
                { name: '薄荷绿', body: '#98fb98', belly: '#00fa9a' },
                { name: '蜜桃橙', body: '#ffdab9', belly: '#ff8c00' },
                { name: '星空紫', body: '#b19cd9', belly: '#663399' },
              ].map(preset => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setAppearance('bodyColor', preset.body)
                    setAppearance('bellyColor', preset.belly)
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: preset.body,
                    display: 'inline-block',
                  }} />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
