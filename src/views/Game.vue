<template>
  <div class="game-container">
    <!-- 关卡选择页面 -->
    <div v-if="currentView === 'levels'" class="levels-container">
      <van-nav-bar
        title="选择关卡"
        left-text="返回"
        left-arrow
        @click-left="router.push('/')"
      />
      
      <div class="level-intro">
        <div class="level-intro-icon">
          <van-icon name="smile-o" size="24" color="#4caf50" />
        </div>
        <div class="level-intro-text">
          选择一个关卡开始挑战吧！每完成一关都会获得星星奖励哦！
        </div>
      </div>
      
      <div class="levels-grid">
        <div 
          v-for="level in gameLevels" 
          :key="level.id"
          class="level-item"
          :class="{
            'level-locked': !level.isUnlocked,
            'level-completed': level.isCompleted
          }"
          @click="selectLevel(level)"
        >
          <div class="level-number">{{ level.id }}</div>
          <div class="level-stars">
            <van-icon 
              v-for="star in 3" 
              :key="star"
              :name="star <= level.stars ? 'star' : 'star-o'"
              :color="star <= level.stars ? '#FFD700' : '#ccc'"
              class="star-icon"
            />
          </div>
          <van-icon 
            v-if="!level.isUnlocked" 
            name="lock" 
            class="level-lock-icon"
          />
          <div v-if="level.isCompleted" class="level-complete-badge">
            <van-icon name="success" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 游戏进行页面 -->
    <div v-else-if="currentView === 'playing'" class="gameplay-container">
      <van-nav-bar
        :title="`第${selectedLevel?.id}关`"
        left-text="退出"
        left-arrow
        @click-left="confirmExit"
      />
      
      <div class="game-info">
        <div class="game-timer">
          <van-icon name="clock-o" /> {{ formatTime(timeRemaining) }}
        </div>
        <ProgressBar 
          :current-value="correctAnswers" 
          :max-value="selectedLevel?.wordsRequired || 5"
          label="进度"
          show-percentage
        />
      </div>
      
      <div class="word-challenge">
        <WordCard 
          :word="currentWord" 
          :show-chinese="showHint"
          :show-actions="false"
        />
        
        <div class="answer-options">
          <van-button 
            v-for="option in answerOptions" 
            :key="option.id"
            size="large" 
            block 
            class="answer-option"
            @click="checkAnswer(option)"
          >
            {{ option.chinese }}
          </van-button>
        </div>
        
        <div class="game-actions">
          <van-button 
            type="primary" 
            plain 
            size="small"
            @click="showHint = !showHint"
          >
            {{ showHint ? '隐藏提示' : '显示提示' }}
          </van-button>
          
          <van-button 
            type="warning" 
            plain 
            size="small"
            @click="skipWord"
          >
            跳过
          </van-button>
        </div>
      </div>
    </div>
    
    <!-- 游戏结果页面 -->
    <div v-else-if="currentView === 'result'" class="result-container">
      <van-nav-bar
        title="关卡结果"
        left-text="返回"
        left-arrow
        @click-left="backToLevels"
      />
      
      <div class="result-content">
        <div class="result-header" :class="isLevelCompleted ? 'success' : 'failed'">
          <van-icon :name="isLevelCompleted ? 'success' : 'cross'" size="48" />
          <h2>{{ isLevelCompleted ? '恭喜通关！' : '再接再厉！' }}</h2>
        </div>
        
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-label">正确单词</span>
            <span class="stat-value">{{ correctAnswers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">用时</span>
            <span class="stat-value">{{ formatTime(selectedLevel?.timeLimit - timeRemaining) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">获得星星</span>
            <div class="stars-container">
              <van-icon 
                v-for="star in 3" 
                :key="star"
                :name="star <= earnedStars ? 'star' : 'star-o'"
                :color="star <= earnedStars ? '#FFD700' : '#ccc'"
                size="24"
              />
            </div>
          </div>
        </div>
        
        <div class="result-actions">
          <van-button 
            type="primary" 
            block 
            round 
            size="large"
            @click="replayLevel"
          >
            再玩一次
          </van-button>
          
          <van-button 
            v-if="isLevelCompleted && hasNextLevel"
            type="success" 
            block 
            round 
            size="large"
            @click="goToNextLevel"
          >
            下一关
          </van-button>
          
          <van-button 
            type="default" 
            block 
            round 
            size="large"
            @click="backToLevels"
          >
            返回关卡
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore, useWordStore } from '../stores'
import { showToast, showDialog, showNotify } from 'vant'
import WordCard from '../components/WordCard.vue'
import ProgressBar from '../components/ProgressBar.vue'
import type { Word } from '../stores/modules/word'
import type { Level } from '../stores/modules/game'
import { playSound, playWordSound } from '../utils/sound'
import { addAnimation } from '../utils/animation'

// 路由实例
const router = useRouter()

// 状态管理
const gameStore = useGameStore()
const wordStore = useWordStore()

// 本地状态
const currentView = ref<'levels' | 'playing' | 'result'>('levels')
const selectedLevel = ref<Level | null>(null)
const currentWord = ref<Word | null>(null)
const answerOptions = ref<Word[]>([])
const correctAnswers = ref(0)
const timeRemaining = ref(0)
const timerInterval = ref<number | null>(null)
const showHint = ref(false)
const earnedStars = ref(0)

// 计算属性
const gameLevels = computed(() => gameStore.levels)
const isLevelCompleted = computed(() => correctAnswers.value >= (selectedLevel.value?.wordsRequired || 0))
const hasNextLevel = computed(() => {
  if (!selectedLevel.value) return false
  const nextLevelId = selectedLevel.value.id + 1
  return gameLevels.value.some(level => level.id === nextLevelId)
})

// 生命周期钩子
onMounted(() => {
  // 初始化游戏关卡
  gameStore.initLevels()
  // 初始化单词数据
  wordStore.initWords()
})

onBeforeUnmount(() => {
  // 清除定时器
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

// 方法
const selectLevel = (level: Level) => {
  // 检查关卡是否解锁
  if (!level.isUnlocked) {
    showToast('这个关卡还没有解锁哦！')
    playSound('wrong')
    
    // 获取锁定的关卡元素并添加动画
    const levelElements = document.querySelectorAll('.level-item.level-locked')
    levelElements.forEach(el => {
      addAnimation(el as HTMLElement, 'shake', 500)
    })
    return
  }
  
  // 播放点击音效
  playSound('click')
  
  selectedLevel.value = level
  gameStore.setCurrentLevel(level.id)
  startLevel()
  
  // 显示关卡开始提示
  showNotify({
    type: 'primary',
    message: `第${level.id}关开始啦！加油！`,
    duration: 2000
  })
}

const startLevel = () => {
  if (!selectedLevel.value) return
  
  // 重置游戏状态
  correctAnswers.value = 0
  timeRemaining.value = selectedLevel.value.timeLimit
  showHint.value = false
  
  // 加载第一个单词
  loadNextWord()
  
  // 开始计时器
  startTimer()
  
  // 切换到游戏页面
  currentView.value = 'playing'
}

const loadNextWord = () => {
  // 从单词库中随机选择一个单词作为当前单词
  const availableWords = wordStore.words.filter(word => !wordStore.masteredWords.includes(word.id))
  
  if (availableWords.length === 0) {
    // 如果没有可用单词，使用所有单词
    currentWord.value = wordStore.words[Math.floor(Math.random() * wordStore.words.length)]
  } else {
    currentWord.value = availableWords[Math.floor(Math.random() * availableWords.length)]
  }
  
  // 生成答案选项（包括正确答案和干扰项）
  generateAnswerOptions()
}

const generateAnswerOptions = () => {
  if (!currentWord.value) return
  
  // 清空当前选项
  answerOptions.value = []
  
  // 添加正确答案
  answerOptions.value.push(currentWord.value)
  
  // 添加3个干扰项
  const otherWords = wordStore.words.filter(word => word.id !== currentWord.value?.id)
  const shuffled = [...otherWords].sort(() => 0.5 - Math.random())
  answerOptions.value.push(...shuffled.slice(0, 3))
  
  // 打乱选项顺序
  answerOptions.value = answerOptions.value.sort(() => 0.5 - Math.random())
}

const checkAnswer = (selectedOption: Word) => {
  console.log(selectedOption, 'selectedOption')
  if (!currentWord.value || !selectedLevel.value) return
  
  const isCorrect = selectedOption.id === currentWord.value.id
  
  if (isCorrect) {
    // 答对了
    correctAnswers.value++
    showToast({
      message: '回答正确！',
      icon: 'success',
      className: 'custom-toast'
    })

    // 播放正确音效
    playSound('correct')
    
    // 播放单词发音
    playWordSound(currentWord.value.english)
    
    // 添加动画效果
    const wordElement = document.querySelector('.word-card') as HTMLElement
    if (wordElement) {
      addAnimation(wordElement, 'tada', 800)
    }
    
    // 标记为已学习
    wordStore.learnWord(currentWord.value.id)
    
    // 检查是否达到通关条件
    if (correctAnswers.value >= selectedLevel.value.wordsRequired) {
      endGame(true)
      return
    }
  } else {
    // 答错了
    showToast({
      message: '再试一次！',
      icon: 'cross',
      className: 'custom-toast'
    })
    
    // 播放错误音效
    playSound('wrong')
    
    // 添加动画效果
    const optionElements = document.querySelectorAll('.answer-option')
    optionElements.forEach(el => {
      if (el.textContent?.trim() === selectedOption.chinese) {
        addAnimation(el as HTMLElement, 'shake', 500)
      }
    })
  }
  
  // 下一个单词
  loadNextWord()
}

const skipWord = () => {
  // 跳过当前单词
  loadNextWord()
  
  showToast({
    message: '已跳过',
    position: 'bottom'
  })
}

const startTimer = () => {
  // 清除可能存在的定时器
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  // 创建新的定时器
  timerInterval.value = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      // 时间到，结束游戏
      endGame(false)
    }
  }, 1000) as unknown as number
}

const endGame = (completed: boolean) => {
  // 清除定时器
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  if (!selectedLevel.value) return
  
  // 计算获得的星星
  calculateStars(completed)
  
  // 如果完成了关卡，更新游戏进度
  if (completed) {
    gameStore.completeLevel(
      selectedLevel.value.id,
      earnedStars.value,
      correctAnswers.value * 10 + timeRemaining.value
    )
    
    // 播放关卡完成音效
    playSound('levelComplete')
    
    // 显示祝贺消息
    showNotify({
      type: 'success',
      message: '太棒了！你完成了这个关卡！',
      duration: 3000
    })
  } else {
    // 播放失败音效
    playSound('wrong')
  }
  
  // 显示结果页面
  currentView.value = 'result'
  
  // 添加结果页面动画
  setTimeout(() => {
    const resultElement = document.querySelector('.result-content') as HTMLElement
    if (resultElement) {
      addAnimation(resultElement, 'bounce', 1000)
    }
  }, 100)
}

const calculateStars = (completed: boolean) => {
  if (!completed || !selectedLevel.value) {
    earnedStars.value = 0
    return
  }
  
  // 根据完成情况和剩余时间计算星星
  const timePercentage = timeRemaining.value / selectedLevel.value.timeLimit
  
  if (timePercentage > 0.7) {
    earnedStars.value = 3 // 3星：非常快
  } else if (timePercentage > 0.4) {
    earnedStars.value = 2 // 2星：较快
  } else {
    earnedStars.value = 1 // 1星：完成
  }
}

const replayLevel = () => {
  // 重新开始当前关卡
  startLevel()
}

const goToNextLevel = () => {
  if (!selectedLevel.value || !hasNextLevel.value) return
  
  // 查找下一关
  const nextLevel = gameLevels.value.find(level => level.id === selectedLevel.value!.id + 1)
  if (nextLevel) {
    selectedLevel.value = nextLevel
    gameStore.setCurrentLevel(nextLevel.id)
    startLevel()
  }
}

const backToLevels = () => {
  // 返回关卡选择页面
  currentView.value = 'levels'
}

const confirmExit = () => {
  showDialog({
    title: '确认退出',
    message: '游戏进度将不会保存，确定要退出吗？',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then(() => {
    // 用户点击确认，返回关卡选择
    currentView.value = 'levels'
  }).catch(() => {
    // 用户点击取消，继续游戏
  })
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;
}

/* 关卡介绍样式 */
.level-intro {
  background-color: #e8f5e9;
  border-radius: 16px;
  padding: 16px;
  margin: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.5s ease-out;
}

.level-intro-icon {
  background-color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.level-intro-text {
  font-size: 16px;
  color: #2e7d32;
  flex: 1;
}

/* 关卡网格样式 */
.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  padding: 16px;
}

.level-item {
  position: relative;
  background-color: #fff;
  border-radius: 16px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid #e0e0e0;
  overflow: hidden;
}

.level-item:active {
  transform: scale(0.95);
}

.level-item.level-completed {
  border-color: #4caf50;
  background-color: #f9fff9;
}

.level-item.level-locked {
  opacity: 0.7;
  background-color: #f5f5f5;
}

.level-number {
  font-size: 24px;
  font-weight: bold;
  color: #2196f3;
  margin-bottom: 8px;
}

.level-stars {
  display: flex;
  gap: 4px;
}

.star-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.level-item:hover .star-icon {
  transform: rotate(10deg) scale(1.1);
}

.level-lock-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  color: #9e9e9e;
}

.level-complete-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

/* 游戏进行中样式 */
.gameplay-container {
  padding: 16px;
}

.game-info {
  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-timer {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #f44336;
  margin-bottom: 12px;
}

.game-timer .van-icon {
  margin-right: 8px;
}

.word-challenge {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-out;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.answer-option {
  height: 54px;
  border-radius: 12px;
  font-size: 18px;
  transition: all 0.2s ease;
  background-color: #e3f2fd;
  color: #1976d2;
  border: none;
}

.answer-option:active {
  transform: scale(0.98);
  background-color: #bbdefb;
}

.game-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

/* 结果页面样式 */
.result-container {
  padding: 16px;
}

.result-content {
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.result-header.success {
  color: #4caf50;
}

.result-header.failed {
  color: #f44336;
}

.result-header h2 {
  margin-top: 12px;
  font-size: 24px;
}

.result-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.stars-container {
  display: flex;
  gap: 8px;
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 动画 */
@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes tada {
  0% { transform: scale(1); }
  10%, 20% { transform: scale(0.9) rotate(-3deg); }
  30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
  40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
  100% { transform: scale(1) rotate(0); }
}

/* 自定义Toast样式 */
:deep(.custom-toast) {
  border-radius: 16px;
  font-size: 16px;
  font-weight: bold;
}

/* 关卡选择样式 */
.levels-container {
  padding: 16px;
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.level-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.level-item:active {
  transform: scale(0.95);
}

.level-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.level-stars {
  margin-top: 8px;
}

.level-locked {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.level-completed {
  border: 2px solid #4caf50;
}

.level-lock-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: #999;
}

/* 游戏进行样式 */
.gameplay-container {
  padding: 16px;
}

.game-info {
  margin-bottom: 20px;
}

.game-timer {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #ff5722;
}

.word-challenge {
  margin-top: 20px;
}

.answer-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}

.answer-option {
  height: 50px;
  border-radius: 8px;
  font-size: 16px;
}

.game-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

/* 结果页面样式 */
.result-container {
  min-height: 100vh;
}

.result-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
}

.result-header.success {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.result-header.failed {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.result-header h2 {
  margin-top: 12px;
  font-size: 24px;
}

.result-stats {
  width: 100%;
  margin-bottom: 30px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.stat-label {
  color: #666;
  font-size: 16px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.stars-container {
  display: flex;
  gap: 4px;
}

.result-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

/* 动画效果 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.level-completed {
  animation: pulse 2s infinite;
}
</style>