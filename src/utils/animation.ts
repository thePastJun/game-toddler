// 动画工具模块

// 动画类型
export type AnimationType = 'bounce' | 'shake' | 'pulse' | 'tada' | 'flash'

/**
 * 为元素添加动画效果
 * @param element DOM元素
 * @param animationType 动画类型
 * @param duration 动画持续时间(毫秒)
 * @param callback 动画结束后的回调函数
 */
export const addAnimation = (
  element: HTMLElement,
  animationType: AnimationType,
  duration: number = 1000,
  callback?: () => void
) => {
  // 确保元素存在
  if (!element) return
  
  // 设置动画持续时间
  element.style.animationDuration = `${duration}ms`
  
  // 添加动画类
  element.classList.add('animated', animationType)
  
  // 动画结束后移除类
  const handleAnimationEnd = () => {
    element.classList.remove('animated', animationType)
    element.removeEventListener('animationend', handleAnimationEnd)
    
    // 执行回调
    if (callback) {
      callback()
    }
  }
  
  element.addEventListener('animationend', handleAnimationEnd)
}

/**
 * 创建CSS动画样式
 * 在应用初始化时调用此函数，将动画样式添加到文档中
 */
export const createAnimationStyles = () => {
  // 检查是否已经添加过样式
  if (document.getElementById('game-animations-style')) return
  
  // 创建样式元素
  const styleEl = document.createElement('style')
  styleEl.id = 'game-animations-style'
  
  // 定义动画样式
  styleEl.textContent = `
    /* 基础动画类 */
    .animated {
      animation-fill-mode: both;
    }
    
    /* 弹跳动画 */
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
      40% {transform: translateY(-30px);}
      60% {transform: translateY(-15px);}
    }
    .bounce {
      animation-name: bounce;
    }
    
    /* 抖动动画 */
    @keyframes shake {
      0%, 100% {transform: translateX(0);}
      10%, 30%, 50%, 70%, 90% {transform: translateX(-10px);}
      20%, 40%, 60%, 80% {transform: translateX(10px);}
    }
    .shake {
      animation-name: shake;
    }
    
    /* 脉冲动画 */
    @keyframes pulse {
      0% {transform: scale(1);}
      50% {transform: scale(1.1);}
      100% {transform: scale(1);}
    }
    .pulse {
      animation-name: pulse;
    }
    
    /* 欢呼动画 */
    @keyframes tada {
      0% {transform: scale(1);}
      10%, 20% {transform: scale(0.9) rotate(-3deg);}
      30%, 50%, 70%, 90% {transform: scale(1.1) rotate(3deg);}
      40%, 60%, 80% {transform: scale(1.1) rotate(-3deg);}
      100% {transform: scale(1) rotate(0);}
    }
    .tada {
      animation-name: tada;
    }
    
    /* 闪烁动画 */
    @keyframes flash {
      0%, 50%, 100% {opacity: 1;}
      25%, 75% {opacity: 0;}
    }
    .flash {
      animation-name: flash;
    }
  `
  
  // 添加到文档头部
  document.head.appendChild(styleEl)
}

// 在应用初始化时创建动画样式
export const initAnimations = () => {
  // 在DOM加载完成后初始化动画样式
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAnimationStyles)
  } else {
    createAnimationStyles()
  }
}