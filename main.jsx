import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// 隐藏加载动画
window.addEventListener('load', () => {
  setTimeout(() => {
    const loading = document.getElementById('loading')
    if (loading) loading.classList.add('hidden')
  }, 1500)
})
