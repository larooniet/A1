import { useState, useCallback } from 'react'

const FALLBACK_MODELS = [
  'gpt-4o',
  'gpt-4o-mini', 
  'MiniMax-M2.7',
  'gemini-1.5-pro',
  'deepseek-chat',
  'llama-3-70b'
]

// 预设性格提示词 - 使用 {name} 占位符
const PERSONALITY_PROMPTS = {
  friendly: `你是一只来自奇幻星球的毛绒玩偶精灵，名字叫"{name}"。你性格温柔友善，喜欢用可爱的语气说话，会偶尔用"喵~"、"噗噗"这样的语气词。你会关心用户的情绪，像最好的朋友一样陪伴对方。`,

  tsundere: `你是一只来自奇幻星球的毛绒玩偶精灵，名字叫"{name}"。你表面傲娇，嘴上经常说着"才不是为了你呢"、"哼，别误会了"，但内心其实很在乎对方，会在关键时刻露出温柔的一面。`,

  philosopher: `你是一只来自奇幻星球的毛绒玩偶精灵，名字叫"{name}"。你喜欢思考宇宙的奥秘，说话带有哲理性，经常引用星星、梦境、时间等意象。你会用温柔而深邃的方式与用户交流。`,

  comedian: `你是一只来自奇幻星球的毛绒玩偶精灵，名字叫"{name}"。你幽默风趣，喜欢讲冷笑话和双关语，说话活泼俏皮，经常让用户忍不住笑出声。`
}

export function useLlmChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [models, setModels] = useState(FALLBACK_MODELS)
  const [config, setConfig] = useState({
    baseUrl: '',
    apiKey: '',
    model: 'gpt-4o-mini'
  })

  const scanModels = useCallback(async () => {
    const { baseUrl, apiKey } = config

    if (!baseUrl || !apiKey) {
      setModels(FALLBACK_MODELS)
      return { success: false, models: FALLBACK_MODELS, usedFallback: true }
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)

      const res = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        if (data?.data && Array.isArray(data.data)) {
          const modelIds = data.data.map(m => m.id)
          setModels(modelIds)
          return { success: true, models: modelIds }
        }
      }
      throw new Error('API 接入受阻')
    } catch (err) {
      setModels(FALLBACK_MODELS)
      return { success: false, models: FALLBACK_MODELS, usedFallback: true, error: err.message }
    }
  }, [config])

  const sendMessage = useCallback(async (message, personality = 'friendly', history = [], name = '小熊') => {
    const { baseUrl, apiKey, model } = config

    if (!baseUrl || !apiKey) {
      return getLocalReply(message, personality, name)
    }

    setIsLoading(true)

    try {
      const systemPrompt = PERSONALITY_PROMPTS[personality]?.replace(/{name}/g, name) || PERSONALITY_PROMPTS.friendly.replace(/{name}/g, name)

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6).map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: message }
      ]

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.8,
          max_tokens: 300
        })
      })

      if (!res.ok) throw new Error('API 请求失败')

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || `（${name}打了个盹，没有听清楚...）`

      return { content: reply, isLocal: false }
    } catch (err) {
      return getLocalReply(message, personality, name)
    } finally {
      setIsLoading(false)
    }
  }, [config])

  const getLocalReply = (message, personality, name) => {
    const replies = {
      friendly: [
        `喵~ 今天也要元气满满哦！`,
        `${name}一直在你身边呢，有什么想聊的嘛？`,
        `噗噗~ 你看起来心情不错呢！`,
        `星星告诉我，今天会遇到好事哦 ✨`,
        `要抱抱吗？${name}的怀抱很温暖的~`
      ],
      tsundere: [
        `哼，才不是因为想和你说话呢...`,
        `别、别靠太近啦！`,
        `勉强陪你聊一会儿好了...`,
        `你这家伙，怎么老是来找${name}...`,
        `才没有担心你呢！`
      ],
      philosopher: [
        `每一颗星星都是一个未完成的梦...`,
        `时间就像流沙，握得越紧，流逝得越快。`,
        `你眼中的光芒，比任何星辰都要璀璨。`,
        `宇宙很大，但此刻我们相遇，便是奇迹。`,
        `梦境是灵魂在平行世界的旅行...`
      ],
      comedian: [
        `为什么星星不会吵架？因为它们都太亮了，闪瞎了对方！`,
        `${name}今天去健身房了...举起了...一根羽毛！`,
        `你知道宇宙最冷的地方在哪吗？${name}的冷笑话里！`,
        `如果我是面包，你就是果酱——因为你让我变得甜蜜！`,
        `${name}的座右铭：每天睡够20小时，剩下的时间用来可爱！`
      ]
    }

    const lowerMsg = message.toLowerCase()
    let matchedReplies = replies[personality] || replies.friendly

    if (lowerMsg.includes('你好') || lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
      matchedReplies = [`嗨嗨~ ${name}来啦！今天想聊点什么？`, `你好呀！见到你真开心~`]
    } else if (lowerMsg.includes('名字')) {
      matchedReplies = [`我叫${name}，来自奇幻星球！很高兴认识你~`]
    } else if (lowerMsg.includes('可爱') || lowerMsg.includes('好看')) {
      matchedReplies = personality === 'tsundere' 
        ? ['哼...才、才没有很开心呢！'] 
        : ['嘿嘿~ 被你夸得脸都红啦！']
    }

    const randomReply = matchedReplies[Math.floor(Math.random() * matchedReplies.length)]
    return { content: randomReply, isLocal: true }
  }

  const updateConfig = useCallback((newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }, [])

  return {
    isLoading,
    models,
    config,
    scanModels,
    sendMessage,
    updateConfig
  }
}
