import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useWordStore } from './word'
import { useGameStore } from './game'

// 成就类型定义
export interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  progressMax: number
  reward: string
  unlockTime?: number
  isNew?: boolean
}

// 成就系统状态管理
export const useAchievementStore = defineStore('achievement', () => {
  // 状态
  const achievements = ref<Achievement[]>([])
  const wordStore = useWordStore()
  const gameStore = useGameStore()
  
  // 初始化成就数据
  const initAchievements = () => {
    // 从本地存储获取成就数据
    const storedAchievements = localStorage.getItem('achievements')
    if (storedAchievements) {
      achievements.value = JSON.parse(storedAchievements)
    } else {
      // 初始化默认成就
      achievements.value = [
        {
          id: 1,
          title: '初次见面',
          description: '完成第一次单词学习',
          icon: 'smile-o',
          unlocked: false,
          progress: 0,
          progressMax: 1,
          reward: '获得一个小星星',
          isNew: false
        },
        {
          id: 2,
          title: '单词小能手',
          description: '掌握10个单词',
          icon: 'star-o',
          unlocked: false,
          progress: 0,
          progressMax: 10,
          reward: '解锁新主题',
          isNew: false
        },
        {
          id: 3,
          title: '单词大师',
          description: '掌握30个单词',
          icon: 'medal-o',
          unlocked: false,
          progress: 0,
          progressMax: 30,
          reward: '解锁特殊关卡',
          isNew: false
        },
        {
          id: 4,
          title: '连续学习',
          description: '连续3天学习单词',
          icon: 'fire-o',
          unlocked: false,
          progress: 0,
          progressMax: 3,
          reward: '获得额外生命值',
          isNew: false
        },
        {
          id: 5,
          title: '闯关小英雄',
          description: '完成5个关卡',
          icon: 'flag-o',
          unlocked: false,
          progress: 0,
          progressMax: 5,
          reward: '解锁新角色',
          isNew: false
        },
        {
          id: 6,
          title: '全三星通关',
          description: '获得3个关卡的三星评价',
          icon: 'gem-o',
          unlocked: false,
          progress: 0,
          progressMax: 3,
          reward: '获得特殊徽章',
          isNew: false
        },
        {
          id: 7,
          title: '动物专家',
          description: '掌握所有动物类单词',
          icon: 'cat-o',
          unlocked: false,
          progress: 0,
          progressMax: 10,
          reward: '解锁动物主题',
          isNew: false
        },
        {
          id: 8,
          title: '水果达人',
          description: '掌握所有水果类单词',
          icon: 'apple-o',
          unlocked: false,
          progress: 0,
          progressMax: 8,
          reward: '解锁水果主题',
          isNew: false
        }
      ]
      
      // 保存到本地存储
      localStorage.setItem('achievements', JSON.stringify(achievements.value))
    }
  }
  
  // 更新成就进度
  const updateAchievements = () => {
    const masteredCount = wordStore.masteredWords.length
    const completedLevels = gameStore.levels.filter(level => level.isCompleted).length
    const threeStarLevels = gameStore.levels.filter(level => level.stars === 3).length
    
    // 更新各项成就的进度
    achievements.value = achievements.value.map(achievement => {
      let updatedAchievement = { ...achievement }
      
      switch (achievement.id) {
        case 1: // 初次见面
          updatedAchievement.progress = wordStore.learnedWords.length > 0 ? 1 : 0
          break
        case 2: // 单词小能手
          updatedAchievement.progress = Math.min(masteredCount, 10)
          break
        case 3: // 单词大师
          updatedAchievement.progress = Math.min(masteredCount, 30)
          break
        case 4: // 连续学习 - 需要在用户登录时更新
          // 这里保持不变，由登录逻辑处理
          break
        case 5: // 闯关小英雄
          updatedAchievement.progress = Math.min(completedLevels, 5)
          break
        case 6: // 全三星通关
          updatedAchievement.progress = Math.min(threeStarLevels, 3)
          break
        case 7: // 动物专家 - 假设ID 1-10是动物类单词
          const masteredAnimals = wordStore.words
            .filter(word => word.id <= 10 && word.isMastered)
            .length
          updatedAchievement.progress = masteredAnimals
          break
        case 8: // 水果达人 - 假设ID 11-18是水果类单词
          const masteredFruits = wordStore.words
            .filter(word => word.id >= 11 && word.id <= 18 && word.isMastered)
            .length
          updatedAchievement.progress = masteredFruits
          break
      }
      
      // 检查是否解锁成就
      if (!updatedAchievement.unlocked && updatedAchievement.progress >= updatedAchievement.progressMax) {
        updatedAchievement.unlocked = true
        updatedAchievement.unlockTime = Date.now()
        updatedAchievement.isNew = true
        
        // 这里可以添加成就解锁的通知逻辑
        showAchievementNotification(updatedAchievement)
      }
      
      return updatedAchievement
    })
    
    // 保存到本地存储
    localStorage.setItem('achievements', JSON.stringify(achievements.value))
  }
  
  // 显示成就解锁通知
  const showAchievementNotification = (achievement: Achievement) => {
    // 这里可以实现通知逻辑，例如使用Toast组件
    console.log(`成就解锁: ${achievement.title}`)
  }
  
  // 标记成就为已读
  const markAchievementAsRead = (achievementId: number) => {
    const index = achievements.value.findIndex(a => a.id === achievementId)
    if (index !== -1) {
      achievements.value[index].isNew = false
      localStorage.setItem('achievements', JSON.stringify(achievements.value))
    }
  }
  
  // 获取新解锁的成就
  const getNewAchievements = () => {
    return achievements.value.filter(a => a.isNew)
  }
  
  return {
    achievements,
    initAchievements,
    updateAchievements,
    markAchievementAsRead,
    getNewAchievements
  }
})