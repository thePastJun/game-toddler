/**
 * 移动端适配工具
 * 提供响应式布局和屏幕适配功能
 */

// 设计稿宽度（像素）
const DESIGN_WIDTH = 375

// 最大适配宽度（像素）
const MAX_WIDTH = 750

// 设置根元素字体大小
export function setRootFontSize(): void {
  const html = document.documentElement
  const width = html.clientWidth
  
  // 限制最大宽度
  const actualWidth = Math.min(width, MAX_WIDTH)
  
  // 计算根元素字体大小（基于16px标准字体大小）
  const fontSize = (actualWidth / DESIGN_WIDTH) * 16
  
  // 设置根元素字体大小
  html.style.fontSize = `${fontSize}px`
}

// 将px转换为rem
export function pxToRem(px: number): string {
  return `${px / 16}rem`
}

// 获取视口宽度
export function getViewportWidth(): number {
  return document.documentElement.clientWidth
}

// 获取视口高度
export function getViewportHeight(): number {
  return document.documentElement.clientHeight
}

// 判断是否为移动设备
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 初始化移动端适配
export function initFlexible(): void {
  // 设置初始根元素字体大小
  setRootFontSize()
  
  // 监听窗口大小变化，重新设置根元素字体大小
  window.addEventListener('resize', setRootFontSize)
  
  // 监听屏幕方向变化，重新设置根元素字体大小
  window.addEventListener('orientationchange', setRootFontSize)
}

// 导出默认函数
export default {
  initFlexible,
  setRootFontSize,
  pxToRem,
  getViewportWidth,
  getViewportHeight,
  isMobileDevice
}