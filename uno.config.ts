// uno.config.js
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons()
  ],
  // 自定义规则
  rules: [
    // 添加响应式设计的自定义规则
    ['mobile-container', { 'max-width': '100%', 'padding': '0.5rem', 'margin': '0 auto' }],
    ['mobile-text', { 'font-size': 'clamp(0.875rem, 4vw, 1rem)' }],
    ['mobile-heading', { 'font-size': 'clamp(1.5rem, 6vw, 2.5rem)' }]
  ],
  // 响应式断点
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'grid-center': 'grid place-items-center',
  },
  theme: {
    breakpoints: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
    }
  }
})