# 🧸 奇幻毛绒玩偶 - 3D 交互体验

基于 React Three Fiber 构建的梦幻 3D 交互场景，还原你上传的奇幻玩偶形象。

## ✨ 特性

- **程序化毛绒玩偶** - 无需外部模型文件，纯代码生成圆润可爱的玩偶
- **视线跟随** - 玩偶头部实时追踪鼠标移动
- **呼吸动画** - 自然的身体起伏效果
- **点击弹跳** - 点击玩偶触发弹跳动画
- **梦幻场景** - 星空、发光水晶、漂浮岛屿、发光水母、魔法粒子
- **后期效果** - 辉光(Bloom) + 色差(Chromatic Aberration)
- **响应式** - 自适应不同屏幕尺寸

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器访问 http://localhost:3000
```

## 📁 项目结构

```
fantasy-plush-web/
├── index.html              # HTML 入口
├── package.json            # 依赖配置
├── vite.config.js          # Vite 配置
└── src/
    ├── main.jsx            # React 入口
    ├── App.jsx             # 主场景组件
    ├── components/
    │   ├── PlushCharacter.jsx   # ⭐ 毛绒玩偶主体（核心）
    │   ├── StarField.jsx        # 星空背景
    │   ├── CrystalCluster.jsx   # 发光水晶簇
    │   ├── FloatingIsland.jsx   # 漂浮岛屿
    │   ├── Jellyfish.jsx        # 发光水母
    │   └── MagicDust.jsx        # 魔法粒子
    └── shaders/
        └── FurMaterial.jsx      # 毛绒材质
```

## 🎮 交互说明

| 操作 | 效果 |
|------|------|
| 移动鼠标 | 玩偶头部跟随转动，大眼睛注视你 |
| 点击玩偶 | 触发弹跳动画 + 星星粒子效果 |
| 悬停玩偶 | 身体泛光增强 |

## 🎨 毛绒质感实现

本项目使用 **程序化噪声法线贴图** + **Sheen 光泽层** 模拟毛绒效果：

- `roughness: 0.9` - 高粗糙度模拟绒毛漫反射
- `sheen: 1` + `sheenColor: white` - 边缘绒毛光泽
- `normalScale: [0.3, 0.3]` - 细微表面凹凸
- `emissiveIntensity: 0.05` - 微弱自发光营造梦幻感

## 🔧 自定义修改

### 修改玩偶颜色
编辑 `PlushCharacter.jsx` 中的 `FurMaterial` 组件：
```jsx
<FurMaterial color="#你的颜色" />
```

### 调整场景元素
编辑 `App.jsx` 中的位置参数：
```jsx
<CrystalCluster position={[-3, -1, -4]} />
<FloatingIsland position={[-4, 3, -8]} />
```

### 添加更多交互
在 `PlushCharacter.jsx` 的 `handleClick` 函数中扩展逻辑。

## 📦 技术栈

- React 19
- Three.js 0.170
- React Three Fiber 9
- React Three Drei 10
- React Three Postprocessing 3
- Vite 6

## 📝 注意事项

- 首次加载可能需要几秒钟编译着色器
- 移动端建议降低 `dpr` 和粒子数量以保证流畅
- 如需更高质量的毛绒效果，可考虑引入外部法线贴图

---

Made with 💖 and ✨
