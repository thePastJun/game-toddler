<template>
  <div class="home-container">
    <div class="game-title">
      <h1>单词通关游戏</h1>
      <p>专为幼儿园小朋友设计的英语单词学习游戏</p>
    </div>
    
    <div class="menu-container">
      <van-button 
        type="primary" 
        block 
        round 
        size="large" 
        class="menu-button"
        @click="router.push('/game')"
      >
        <van-icon name="play-circle-o" /> 开始游戏
      </van-button>
      
      <van-button 
        type="success" 
        block 
        round 
        size="large" 
        class="menu-button"
        @click="router.push('/words')"
      >
        <van-icon name="bookmark-o" /> 单词学习
      </van-button>
      
      <van-button 
        type="info" 
        block 
        round 
        size="large" 
        class="menu-button"
        @click="router.push('/profile')"
      >
        <van-icon name="user-o" /> 个人中心
      </van-button>
    </div>
    
    <div class="progress-overview">
      <h3>学习进度</h3>
      <ProgressBar 
        :current-value="masteredCount" 
        :max-value="totalWords" 
        label="已掌握单词"
        show-percentage
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWordStore } from '../stores'
import ProgressBar from '../components/ProgressBar.vue'
import { showToast } from 'vant'

// 路由实例
const router = useRouter()

// 单词状态
const wordStore = useWordStore()

// 计算属性
const totalWords = computed(() => wordStore.words.length)
const masteredCount = computed(() => wordStore.masteredWords.length)

// 生命周期钩子
onMounted(() => {
  // 初始化单词数据
  wordStore.initWords()
  
  // 欢迎提示
  showToast({
    message: '欢迎来到单词通关游戏！',
    position: 'top',
  })
})
</script>

<style scoped>
.home-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f8f8;
}

.game-title {
  text-align: center;
  margin-bottom: 40px;
  animation: bounce 1s ease-in-out;
}

.game-title h1 {
  color: #4caf50;
  font-size: 28px;
  margin-bottom: 8px;
}

.game-title p {
  color: #666;
  font-size: 14px;
}

.menu-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.menu-button {
  height: 54px;
  font-size: 18px;
  transition: transform 0.2s;
}

.menu-button:active {
  transform: scale(0.98);
}

.progress-overview {
  margin-top: auto;
  padding-top: 20px;
}

.progress-overview h3 {
  margin-bottom: 12px;
  color: #333;
}

@keyframes bounce {
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
</style>