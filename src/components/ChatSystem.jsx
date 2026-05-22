import React, { useState, useRef, useEffect } from 'react'
import { useLlmChat } from '../hooks/useLlmChat'
import { useCharacterStore } from '../hooks/useCharacterStore'

export default function ChatSystem() {
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const messagesEndRef = useRef(null)
  const { isLoading, models, config, scanModels, sendMessage, updateConfig } = useLlmChat()
  const { chatHistory, addChatMessage, personality, setPersonality } = useCharacterStore()

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')
    addChatMessage('user', userMsg)

    const reply = await sendMessage(userMsg, personality, chatHistory)
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
      {/* 对话气泡按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(255, 105, 180, 0.4)',
          zIndex: 100,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.target.style.transform = 'scale(1.1)'
          e.target.style.boxShadow = '0 6px 30px rgba(255, 105, 180, 0.6)'
        }}
        onMouseLeave={e => {
          e.target.style.transform = 'scale(1)'
          e.target.style.boxShadow = '0 4px 20px rgba(255, 105, 180, 0.4)'
        }}
      >
        💬
      </button>

      {/* 对话面板 */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '150px',
          right: '20px',
          width: '380px',
          maxHeight: '500px',
          background: 'rgba(10, 10, 30, 0.95)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 105, 180, 0.3)',
          backdropFilter: 'blur(20px)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}>
          {/* 头部 */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 105, 180, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🧸</span>
              <div>
                <div style={{ color: '#ff69b4', fontWeight: 'bold', fontSize: '14px' }}>绒绒</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                  {isLoading ? '思考中...' : '在线'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px',
              }}
            >
              ⚙️
            </button>
          </div>

          {/* 配置面板 */}
          {showConfig && (
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 105, 180, 0.2)',
              background: 'rgba(0, 0, 0, 0.3)',
            }}>
              {/* 性格选择 */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  性格设定
                </label>
                <select
                  value={personality}
                  onChange={e => setPersonality(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 105, 180, 0.3)',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  <option value="friendly">温柔友善 🌸</option>
                  <option value="tsundere">傲娇系 💢</option>
                  <option value="philosopher">哲学家 🤔</option>
                  <option value="comedian">搞笑担当 😂</option>
                </select>
              </div>

              {/* API 配置 */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  API Base URL
                </label>
                <input
                  type="text"
                  placeholder="https://api.openai.com/v1"
                  value={config.baseUrl}
                  onChange={e => updateConfig({ baseUrl: e.target.value })}
                  style={{
                    width: '100%',
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

              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={config.apiKey}
                  onChange={e => updateConfig({ apiKey: e.target.value })}
                  style={{
                    width: '100%',
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

              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={config.model}
                  onChange={e => updateConfig({ model: e.target.value })}
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
                >
                  {models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <button
                  onClick={async () => {
                    const result = await scanModels()
                    if (result.usedFallback) {
                      addChatMessage('assistant', '检测到网络连接超时或未填密钥，我已经启动了本地量子雷达，自动为你扫描并装载了当前的宇宙通用模型管线！')
                    } else {
                      addChatMessage('assistant', '（头顶绒毛激动地抖动）哇！成功扫描并捕获到云端全新模型接口！列表已经为你自动解锁更新啦！')
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🔍 扫描
                </button>
              </div>
            </div>
          )}

          {/* 消息列表 */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '300px',
          }}>
            {chatHistory.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.4)',
                padding: '40px 20px',
                fontSize: '13px',
                lineHeight: '1.6',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
                嗨~ 我是绒绒！<br/>
                点击右下角设置可以配置 LLM API<br/>
                不配置也能和我聊天哦~
              </div>
            )}

            {chatHistory.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' 
                    ? 'linear-gradient(135deg, #ff69b4, #ff1493)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                  animation: 'fadeIn 0.3s ease',
                }}
              >
                {msg.content}
              </div>
            ))}

            {isLoading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '10px 14px',
                borderRadius: '16px 16px 16px 4px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '13px',
              }}>
                <span style={{ animation: 'pulse 1s infinite' }}>绒绒正在思考</span>
                <span style={{ animation: 'pulse 1s infinite 0.2s' }}>.</span>
                <span style={{ animation: 'pulse 1s infinite 0.4s' }}>.</span>
                <span style={{ animation: 'pulse 1s infinite 0.6s' }}>.</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          <div style={{
            padding: '12px 20px 16px',
            borderTop: '1px solid rgba(255, 105, 180, 0.2)',
            display: 'flex',
            gap: '8px',
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="和绒绒说点什么..."
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 105, 180, 0.3)',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                background: input.trim() && !isLoading 
                  ? 'linear-gradient(135deg, #ff69b4, #ff1493)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              发送
            </button>
          </div>
        </div>
      )}

      <style>{\`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      \`}</style>
    </>
  )
}
