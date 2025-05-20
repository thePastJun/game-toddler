<template>
  <div class="words-container">
    <van-nav-bar
      title="单词学习"
      left-text="返回"
      left-arrow
      @click-left="router.push('/')"
    />
    
    <div class="filter-bar">
      <van-dropdown-menu>
        <van-dropdown-item v-model="filterType" :options="filterOptions" />
        <van-dropdown-item v-model="sortType" :options="sortOptions" />
      </van-dropdown-menu>
      
      <van-search
        v-model="searchText"
        placeholder="搜索单词"
        shape="round"
      />
    </div>
    
    <div class="words-stats">
      <div class="stat-box">
        <div class="stat-value">{{ totalWords }}</div>
        <div class="stat-label">总单词</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">{{ learnedCount }}</div>
        <div class="stat-label">已学习</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">{{ masteredCount }}</div>
        <div class="stat-label">已掌握</div>
      </div>
    </div>
    
    <div class="progress-section">
      <ProgressBar 
        :current-value="masteredCount" 
        :max-value="totalWords" 
        label="掌握进度"
        show-percentage
      />
    </div>
    
    <div class="learning-tip">
      <van-icon name="volume-o" /> 点击单词卡片可以听发音哦！
    </div>
    
    <div class="words-list">
      <div v-if="filteredWords.length === 0" class="empty-state">
        <van-empty description="没有找到匹配的单词" />
      </div>
      
      <WordCard 
        v-for="word in filteredWords" 
        :key="word.id"
        :word="word"
        show-chinese
        show-actions
        show-image
        @learn="learnWord"
        @master="masterWord"
      />
    </div>
    
    <van-back-top right="16" bottom="16" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWordStore } from '../stores'
import WordCard from '../components/WordCard.vue'
import ProgressBar from '../components/ProgressBar.vue'
import { showToast, showNotify } from 'vant'

// 路由实例
const router = useRouter()

// 单词状态
const wordStore = useWordStore()

// 本地状态
const searchText = ref('')
const filterType = ref('all')
const sortType = ref('default')

// 筛选和排序选项
const filterOptions = [
  { text: '全部单词', value: 'all' },
  { text: '已学习', value: 'learned' },
  { text: '已掌握', value: 'mastered' },
  { text: '未掌握', value: 'not-mastered' },
]

const sortOptions = [
  { text: '默认排序', value: 'default' },
  { text: '字母顺序', value: 'alphabet' },
  { text: '难度排序', value: 'difficulty' },
]

// 计算属性
const totalWords = computed(() => wordStore.words.length)
const learnedCount = computed(() => wordStore.learnedWords.length)
const masteredCount = computed(() => wordStore.masteredWords.length)

const filteredWords = computed(() => {
  let result = [...wordStore.words]
  
  // 应用搜索过滤
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase()
    result = result.filter(word => 
      word.english.toLowerCase().includes(searchLower) || 
      word.chinese.includes(searchText.value)
    )
  }
  
  // 应用类型过滤
  switch (filterType.value) {
    case 'learned':
      result = result.filter(word => wordStore.learnedWords.includes(word.id))
      break
    case 'mastered':
      result = result.filter(word => wordStore.masteredWords.includes(word.id))
      break
    case 'not-mastered':
      result = result.filter(word => !wordStore.masteredWords.includes(word.id))
      break
  }
  
  // 应用排序
  switch (sortType.value) {
    case 'alphabet':
      result.sort((a, b) => a.english.localeCompare(b.english))
      break
    case 'difficulty':
      const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 }
      result.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
      break
  }
  
  return result
})

// 生命周期钩子
onMounted(() => {
  // 初始化单词数据
  wordStore.initWords()
  
  // 显示提示
  showNotify({
    type: 'primary',
    message: '点击单词卡片可以查看详细信息',
    duration: 3000,
  })
})

// 方法
const learnWord = (wordId: number) => {
  const isLearned = wordStore.learnedWords.includes(wordId)
  wordStore.learnWord(wordId)
  showToast(isLearned ? '已取消学习标记' : '已标记为学习')
}

const masterWord = (wordId: number) => {
  const word = wordStore.words.find(w => w.id === wordId)
  const isMastered = word?.isMastered || false
  
  wordStore.masterWord(wordId)
  showToast(isMastered ? '已取消掌握标记' : '已标记为掌握')
  
  // 检查是否所有单词都已掌握
  if (!isMastered && masteredCount.value === totalWords.value) {
    showNotify({
      type: 'success',
      message: '恭喜你！已掌握所有单词！',
      duration: 3000,
    })
  }
}
</script>

<style scoped>
.words-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 20px;
}

.filter-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
}

.words-stats {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background-color: #fff;
  margin: 12px 0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.learning-tip {
  background-color: #e3f2fd;
  border-radius: 12px;
  padding: 12px 16px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #1976d2;
  animation: fadeIn 0.5s ease-in-out;
}

.learning-tip .van-icon {
  font-size: 20px;
  margin-right: 8px;
  color: #2196f3;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-box {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.progress-section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.words-list {
  padding: 0 16px;
}

.empty-state {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

/* 动画效果 */
.words-list > * {
  animation: fade-in 0.3s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>