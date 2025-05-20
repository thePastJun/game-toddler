// 统一导出所有store模块
import { useUserStore } from './modules/user'
import { useGameStore } from './modules/game'
import { useWordStore } from './modules/word'
import { useAchievementStore } from './modules/achievement'

export {
  useUserStore,
  useGameStore,
  useWordStore,
  useAchievementStore
}