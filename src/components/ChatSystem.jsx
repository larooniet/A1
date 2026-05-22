import React, { useState, useRef, useEffect } from 'react'
import { useLlmChat } from '../hooks/useLlmChat'
import { useCharacterStore } from '../hooks/useCharacterStore'

export default function ChatSystem() {
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const messagesEndRef = useRef(null)
  const { isLoading, models, config, scanModels, sendMessage, updateConfig } = useLlmChat()
  const { name, setName, chatHistory, addChatMessage, personality, setPersonality, showChatPanel, toggleChatPanel } = useCharacterStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg = input.trim()
    setInput('')
    addChatMessage('user', userMsg)
    const reply = await sendMessage(userMsg, personality, chatHistory, name)
    addChatMessage('assistant', reply.content)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* 切换侧栏按钮 */}
      <button
        onClick={toggleChatPanel}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          background: showChatPanel ? 'linear-gradient(135deg, #ff69b4, #ff1493)' : 'rgba(255,255,255,0.1)',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          zIndex: 100,
        }}
        title={showChatPanel ? '隐藏对话面板' : '显示对话面板'}
      >
        {showChatPanel ? '✕' : '💬'}
      </button>

      {showChatPanel && (
        <>
          {/* 悬浮对话按钮 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              position: 'fixed', bottom: '80px', right: '20px',
              width: '56px', height: '56px', borderRadius: '50%', border: 'none',
              background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
              color: 'white', fontSize: '24px', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255, 105, 180, 0.4)',
              zIndex: 100, transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.1)'; e.target.style.boxShadow = '0 6px 30px rgba(255, 105, 180, 0.6)'; }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 20px rgba(255, 105, 180, 0.4)'; }}
          >
            💬
          </button>

          {isOpen && (
            <div style={{
              position: 'fixed', bottom: '150px', right: '20px', width: '340px',
              maxHeight: '450px', background: 'rgba(10, 10, 30, 0.95)',
              borderRadius: '20px', border: '1px solid rgba(255, 105, 180, 0.3)',
              backdropFilter: 'blur(20px)', zIndex: 100,
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}>
              {/* 头部 */}
              <div style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(255, 105, 180, 0.2)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>🧸</span>
                  <div>
                    <div style={{ color: '#ff69b4', fontWeight: 'bold', fontSize: '14px' }}>{name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                      {isLoading ? '思考中...' : '在线'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '18px', padding: '4px' }}
                >
                  ⚙️
                </button>
              </div>

              {/* 配置面板 */}
              {showConfig && (
                <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255, 105, 180, 0.2)', background: 'rgba(0, 0, 0, 0.3)' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>名字</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      style={{
                        width: '100%', padding: '6px 10px', borderRadius: '8px',
                        border: '1px solid rgba(255, 105, 180, 0.3)',
                        background: 'rgba(0, 0, 0, 0.5)', color: 'white',
                        fontSize: '12px', outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>性格</label>
                    <select
                      value={personality}
                      onChange={e => setPersonality(e.target.value)}
                      style={{
                        width: '100%', padding: '6px 10px', borderRadius: '8px',
                        border: '1px solid rgba(255, 105, 180, 0.3)',
                        background: 'rgba(0, 0, 0, 0.5)', color: 'white',
                        fontSize: '12px', outline: 'none',
                      }}
                    >
                      <option value="friendly">温柔友善 🌸</option>
                      <option value="tsundere">傲娇系 💢</option>
                      <option value="philosopher">哲学家 🤔</option>
                      <option value="comedian">搞笑担当 😂</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="API URL"
                      value={config.baseUrl}
                      onChange={e => updateConfig({ baseUrl: e.target.value })}
                      style={{
                        flex: 1, padding: '6px 10px', borderRadius: '8px',
                        border: '1px solid rgba(255, 105, 180, 0.3)',
                        background: 'rgba(0, 0, 0, 0.5)', color: 'white',
                        fontSize: '11px', outline: 'none',
                      }}
                    />
                    <button
                      onClick={async () => {
                        const result = await scanModels()
                        if (result.usedFallback) {
                          addChatMessage('assistant', `${name}启动了本地量子雷达！`)
                        } else {
                          addChatMessage('assistant', `${name}成功扫描到云端模型！`)
                        }
                      }}
                      style={{
                        padding: '6px 12px', borderRadius: '8px', border: 'none',
                        background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
                        color: 'white', fontSize: '11px', cursor: 'pointer',
                      }}
                    >
                      🔍
                    </button>
                  </div>
                </div>
              )}

              {/* 消息列表 */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '14px 18px',
                display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px',
              }}>
                {chatHistory.length === 0 && (
                  <div style={{
                    textAlign: 'center', color: 'rgba(255,255,255,0.4)',
                    padding: '30px 15px', fontSize: '12px', lineHeight: '1.6',
                  }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>✨</div>
                    嗨~ 我是{name}！<br/>
                    点击设置配置 API<br/>
                    或直接和我聊天~
                  </div>
                )}

                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%', padding: '8px 12px',
                      borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, #ff69b4, #ff1493)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'white', fontSize: '12px', lineHeight: '1.5', wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </div>
                ))}

                {isLoading && (
                  <div style={{
                    alignSelf: 'flex-start', padding: '8px 12px',
                    borderRadius: '14px 14px 14px 4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255,255,255,0.6)', fontSize: '12px',
                  }}>
                    {name}正在思考...
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* 输入框 */}
              <div style={{
                padding: '10px 18px 14px',
                borderTop: '1px solid rgba(255, 105, 180, 0.2)',
                display: 'flex', gap: '6px',
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`和${name}说...`}
                  style={{
                    flex: 1, padding: '8px 14px', borderRadius: '18px',
                    border: '1px solid rgba(255, 105, 180, 0.3)',
                    background: 'rgba(0, 0, 0, 0.5)', color: 'white',
                    fontSize: '13px', outline: 'none',
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  style={{
                    padding: '8px 16px', borderRadius: '18px', border: 'none',
                    background: input.trim() && !isLoading 
                      ? 'linear-gradient(135deg, #ff69b4, #ff1493)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white', fontSize: '13px',
                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  }}
                >
                  发送
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
