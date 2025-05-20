import { defineStore } from 'pinia'
import { ref } from 'vue'

// 游戏关卡类型定义
export interface Level {
  id: number
  name: string
  difficulty: 'easy' | 'medium' | 'hard'
  wordsRequired: number
  timeLimit: number
  isUnlocked: boolean
  isCompleted: boolean
  stars: number // 0-3星评价
}

// 游戏进度状态管理
export const useGameStore = defineStore('game', () => {
  // 状态
  const currentLevel = ref<number>(1)
  const levels = ref<Level[]>([])
  const highestScore = ref<number>(0)
  
  // 初始化游戏关卡
  const initLevels = () => {
    // 从本地存储获取关卡信息
    const storedLevels = localStorage.getItem('gameLevels')
    if (storedLevels) {
      levels.value = JSON.parse(storedLevels)
    } else {
      // 初始化默认关卡
      levels.value = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `第${i + 1}关`,
        difficulty: i < 5 ? 'easy' : i < 15 ? 'medium' : 'hard',
        wordsRequired: 5 + Math.floor(i / 3) * 2,
        timeLimit: 60 + i * 5,
        isUnlocked: i === 0, // 只有第一关默认解锁
        isCompleted: false,
        stars: 0
      })) as Level[]
      
      // 保存到本地存储
      localStorage.setItem('gameLevels', JSON.stringify(levels.value))
    }
    
    // 获取当前关卡
    const storedCurrentLevel = localStorage.getItem('currentLevel')
    if (storedCurrentLevel) {
      currentLevel.value = parseInt(storedCurrentLevel)
    }
    
    // 获取最高分
    const storedHighestScore = localStorage.getItem('highestScore')
    if (storedHighestScore) {
      highestScore.value = parseInt(storedHighestScore)
    }
  }
  
  // 设置当前关卡
  const setCurrentLevel = (levelId: number) => {
    currentLevel.value = levelId
    localStorage.setItem('currentLevel', levelId.toString())
  }
  
  // 完成关卡
  const completeLevel = (levelId: number, stars: number, score: number) => {
    const level = levels.value.find(l => l.id === levelId)
    if (level) {
      level.isCompleted = true
      level.stars = Math.max(level.stars, stars) // 保留最高星级
      
      // 解锁下一关
      if (levelId < levels.value.length) {
        const nextLevel = levels.value.find(l => l.id === levelId + 1)
        if (nextLevel) {
          nextLevel.isUnlocked = true
        }
      }
      
      // 更新最高分
      if (score > highestScore.value) {
        highestScore.value = score
        localStorage.setItem('highestScore', score.toString())
      }
      
      // 保存到本地存储
      localStorage.setItem('gameLevels', JSON.stringify(levels.value))
    }
  }
  
  // 重置游戏进度
  const resetProgress = () => {
    levels.value = levels.value.map((level, index) => ({
      ...level,
      isUnlocked: index === 0,
      isCompleted: false,
      stars: 0
    }))
    currentLevel.value = 1
    highestScore.value = 0
    
    // 保存到本地存储
    localStorage.setItem('gameLevels', JSON.stringify(levels.value))
    localStorage.setItem('currentLevel', '1')
    localStorage.setItem('highestScore', '0')
  }
  
  return {
    currentLevel,
    levels,
    highestScore,
    initLevels,
    setCurrentLevel,
    completeLevel,
    resetProgress
  }
})