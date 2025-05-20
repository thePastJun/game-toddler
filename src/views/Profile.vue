<template>
  <div class="profile-container">
    <van-nav-bar
      title="个人中心"
      left-text="返回"
      left-arrow
      @click-left="router.push('/')"
    />
    
    <div class="user-info">
      <div class="avatar">
        <van-icon name="contact" size="60" />
      </div>
      <h2 class="username">小朋友</h2>
      <div class="user-level">
        <van-tag type="primary" size="medium">Level {{ userLevel }}</van-tag>
      </div>
    </div>
    
    <div class="stats-section">
      <div class="section-title">学习统计</div>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ masteredCount }}</div>
          <div class="stat-label">已掌握单词</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ completedLevels }}</div>
          <div class="stat-label">已完成关卡</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ totalStars }}</div>
          <div class="stat-label">获得星星</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ unlockedAchievements }}</div>
          <div class="stat-label">解锁成就</div>
        </div>
      </div>
    </div>
    
    <div class="progress-section">
      <div class="section-title">学习进度</div>
      <ProgressBar 
        :current-value="masteredCount" 
        :max-value="totalWords" 
        label="单词掌握"
        show-percentage
      />
      <ProgressBar 
        :current-value="completedLevels" 
        :max-value="totalLevels" 
        label="关卡完成"
        show-percentage
        color="#2196f3"
      />
    </div>
    
    <div class="settings-section">
      <div class="section-title">设置</div>
      <van-cell-group inset>
        <van-cell 
          title="我的成就" 
          is-link 
          to="/achievements"
          icon="medal-o"
        >
          <template #right-icon>
            <van-badge :content="newAchievements" v-if="newAchievements > 0" />
            <van-icon name="arrow" v-else />
          </template>
        </van-cell>
        <van-cell title="音效" center>
          <template #right-icon>
            <van-switch v-model="settings.soundEnabled" size="24" />
          </template>
        </van-cell>
        <van-cell title="背景音乐" center>
          <template #right-icon>
            <van-switch v-model="settings.musicEnabled" size="24" />
          </template>
        </van-cell>
        <van-cell title="提示" center>
          <template #right-icon>
            <van-switch v-model="settings.hintsEnabled" size="24" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    
    <div class="actions-section">
      <van-button 
        type="danger" 
        block 
        @click="confirmReset"
      >
        重置游戏进度
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore, useWordStore, useAchievementStore } from '../stores'
import ProgressBar from '../components/ProgressBar.vue'
import { showDialog, showToast } from 'vant'

// 路由实例
const router = useRouter()

// 状态管理
const gameStore = useGameStore()
const wordStore = useWordStore()
const achievementStore = useAchievementStore()

// 用户设置
const settings = reactive({
  soundEnabled: true,
  musicEnabled: true,
  hintsEnabled: true
})

// 从本地存储加载设置
const loadSettings = () => {
  const storedSettings = localStorage.getItem('gameSettings')
  if (storedSettings) {
    const parsedSettings = JSON.parse(storedSettings)
    settings.soundEnabled = parsedSettings.soundEnabled ?? true
    settings.musicEnabled = parsedSettings.musicEnabled ?? true
    settings.hintsEnabled = parsedSettings.hintsEnabled ?? true
  }
}

// 保存设置到本地存储
const saveSettings = () => {
  localStorage.setItem('gameSettings', JSON.stringify(settings))
}

// 监听设置变化并保存
watch(settings, () => {
  saveSettings()
}, { deep: true })

// 计算属性
const totalWords = computed(() => wordStore.words.length)
const masteredCount = computed(() => wordStore.masteredWords.length)
const totalLevels = computed(() => gameStore.levels.length)
const completedLevels = computed(() => gameStore.levels.filter(level => level.isCompleted).length)
const totalStars = computed(() => gameStore.levels.reduce((sum, level) => sum + level.stars, 0))
const unlockedAchievements = computed(() => achievementStore.achievements.filter(a => a.unlocked).length)
const newAchievements = computed(() => achievementStore.achievements.filter(a => a.unlocked && a.isNew).length)

// 用户等级 - 根据已完成关卡和掌握单词计算
const userLevel = computed(() => {
  const levelProgress = completedLevels.value / totalLevels.value
  const wordProgress = masteredCount.value / totalWords.value
  
  // 综合进度，权重各占50%
  const overallProgress = (levelProgress * 0.5) + (wordProgress * 0.5)
  
  // 根据综合进度计算等级，最高10级
  return Math.max(1, Math.min(10, Math.ceil(overallProgress * 10)))
})

// 生命周期钩子
onMounted(() => {
  // 初始化游戏关卡
  gameStore.initLevels()
  // 初始化单词数据
  wordStore.initWords()
  // 初始化成就数据
  achievementStore.initAchievements()
  achievementStore.updateAchievements()
  // 加载设置
  loadSettings()
})

// 方法
const confirmReset = () => {
  showDialog({
    title: '确认重置',
    message: '这将清除所有游戏进度，包括已完成的关卡和掌握的单词。此操作不可撤销，确定要继续吗？',
    confirmButtonText: '确认重置',
    confirmButtonColor: '#ee0a24',
    cancelButtonText: '取消',
  }).then(() => {
    // 重置游戏进度
    gameStore.resetProgress()
    wordStore.resetProgress()
    // 重置并更新成就数据
    achievementStore.initAchievements()
    achievementStore.updateAchievements()
    
    showToast({
      message: '游戏进度已重置',
      type: 'success',
      position: 'bottom',
    })
  }).catch(() => {
    // 用户取消操作
  })
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 30px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  background-color: #fff;
  margin-bottom: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.username {
  font-size: 20px;
  font-weight: bold;
  margin: 8px 0;
  color: #333;
}

.user-level {
  margin-top: 4px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  padding-left: 16px;
}

.stats-section,
.progress-section,
.settings-section,
.actions-section {
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
}

.stat-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.progress-section {
  padding: 0 16px;
}

.actions-section {
  padding: 0 16px;
  margin-top: 30px;
}

/* 动画效果 */
.avatar {
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0% { transform: translateY(-10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.stats-grid > * {
  animation: fade-in 0.5s ease-in-out;
  animation-fill-mode: both;
}

.stats-grid > *:nth-child(1) { animation-delay: 0.1s; }
.stats-grid > *:nth-child(2) { animation-delay: 0.2s; }
.stats-grid > *:nth-child(3) { animation-delay: 0.3s; }
.stats-grid > *:nth-child(4) { animation-delay: 0.4s; }

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>