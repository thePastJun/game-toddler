import { defineStore } from 'pinia'
import { ref } from 'vue'
import { wordsList } from '../../data/words'

// 单词类型定义
export interface Word {
  id: number
  english: string
  chinese: string
  phonetic: string
  difficulty: 'easy' | 'medium' | 'hard'
  isMastered: boolean
  reviewCount: number
  lastReviewTime: number
}

// 单词状态管理
export const useWordStore = defineStore('word', () => {
  // 状态
  const words = ref<Word[]>([])
  const learnedWords = ref<number[]>([]) // 已学习的单词ID
  const masteredWords = ref<number[]>([]) // 已掌握的单词ID
  
  // 初始化单词数据
  const initWords = () => {
    // 从本地存储获取单词数据
    const storedWords = localStorage.getItem('words')
    if (storedWords) {
      words.value = JSON.parse(storedWords)
    } else {
      // 使用预定义的单词数据
      words.value = wordsList
      
      // 保存到本地存储
      localStorage.setItem('words', JSON.stringify(words.value))
    }
    
    // 获取已学习和已掌握的单词
    const storedLearnedWords = localStorage.getItem('learnedWords')
    if (storedLearnedWords) {
      learnedWords.value = JSON.parse(storedLearnedWords)
    }
    
    const storedMasteredWords = localStorage.getItem('masteredWords')
    if (storedMasteredWords) {
      masteredWords.value = JSON.parse(storedMasteredWords)
    }
  }
  
  // 获取指定难度的单词
  const getWordsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    return words.value.filter(word => word.difficulty === difficulty)
  }
  
  // 获取随机单词（用于游戏）
  const getRandomWords = (count: number, difficulty?: 'easy' | 'medium' | 'hard') => {
    let wordPool = difficulty 
      ? words.value.filter(word => word.difficulty === difficulty)
      : words.value
    
    // 随机打乱并获取指定数量
    return [...wordPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
  }
  
  // 标记或取消标记单词为已学习
  const learnWord = (wordId: number) => {
    const index = learnedWords.value.indexOf(wordId)
    if (index === -1) {
      // 标记为已学习
      learnedWords.value.push(wordId)
    } else {
      // 取消标记
      learnedWords.value.splice(index, 1)
    }
    localStorage.setItem('learnedWords', JSON.stringify(learnedWords.value))
  }
  
  // 标记或取消标记单词为已掌握
  const masterWord = (wordId: number) => {
    // 更新单词状态
    const word = words.value.find(w => w.id === wordId)
    if (word) {
      // 切换掌握状态
      word.isMastered = !word.isMastered
      
      if (word.isMastered) {
        word.reviewCount += 1
        word.lastReviewTime = Date.now()
        
        // 更新已掌握单词列表
        if (!masteredWords.value.includes(wordId)) {
          masteredWords.value.push(wordId)
        }
      } else {
        // 从已掌握列表中移除
        const index = masteredWords.value.indexOf(wordId)
        if (index !== -1) {
          masteredWords.value.splice(index, 1)
        }
      }
      
      // 保存到本地存储
      localStorage.setItem('words', JSON.stringify(words.value))
      localStorage.setItem('masteredWords', JSON.stringify(masteredWords.value))
    }
  }
  
  // 获取学习进度
  const getLearningProgress = () => {
    const total = words.value.length
    const learned = learnedWords.value.length
    const mastered = masteredWords.value.length
    
    return {
      total,
      learned,
      mastered,
      learnedPercent: total > 0 ? (learned / total) * 100 : 0,
      masteredPercent: total > 0 ? (mastered / total) * 100 : 0
    }
  }
  
  // 重置进度
  const resetProgress = () => {
    // 重置单词掌握状态
    words.value.forEach(word => {
      word.isMastered = false
      word.reviewCount = 0
      word.lastReviewTime = 0
    })
    
    // 清空已学习和已掌握的单词列表
    learnedWords.value = []
    masteredWords.value = []
    
    // 保存到本地存储
    localStorage.setItem('words', JSON.stringify(words.value))
    localStorage.setItem('learnedWords', JSON.stringify(learnedWords.value))
    localStorage.setItem('masteredWords', JSON.stringify(masteredWords.value))
  }
  
  return {
    words,
    learnedWords,
    masteredWords,
    initWords,
    getWordsByDifficulty,
    getRandomWords,
    learnWord,
    masterWord,
    getLearningProgress,
    resetProgress
  }
})