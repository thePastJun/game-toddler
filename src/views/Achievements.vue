<template>
  <div class="achievements-container">
    <van-nav-bar
      title="我的成就"
      left-text="返回"
      left-arrow
      @click-left="router.push('/profile')"
    />
    
    <div class="achievements-stats">
      <div class="stat-box">
        <div class="stat-value">{{ unlockedCount }}</div>
        <div class="stat-label">已解锁</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">{{ totalAchievements }}</div>
        <div class="stat-label">总成就</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">{{ completionPercentage }}%</div>
        <div class="stat-label">完成度</div>
      </div>
    </div>
    
    <div class="progress-section">
      <ProgressBar 
        :current-value="unlockedCount" 
        :max-value="totalAchievements" 
        label="成就进度"
        show-percentage
      />
    </div>
    
    <div class="filter-bar">
      <van-tabs v-model:active="activeTab" animated swipeable>
        <!-- <van-tab title="全部">
          <div class="achievements-list">
            <div v-if="achievementStore.achievements.length === 0" class="empty-state">
              <van-empty description="暂无成就" />
            </div>
            <template v-else>
              <AchievementCard 
                v-for="achievement in achievementStore.achievements" 
                :key="achievement.id"
                :achievement="achievement"
                :is-new="achievement.isNew"
                @click="markAsRead(achievement.id)"
              />
            </template>
          </div>
        </van-tab> -->
        <van-tab title="已解锁">
          <div class="achievements-list">
            <div v-if="unlockedAchievements.length === 0" class="empty-state">
              <van-empty description="暂无已解锁成就" />
            </div>
            <template v-else>
              <AchievementCard 
                v-for="achievement in unlockedAchievements" 
                :key="achievement.id"
                :achievement="achievement"
                :is-new="achievement.isNew"
                @click="markAsRead(achievement.id)"
              />
            </template>
          </div>
        </van-tab>
        <van-tab title="未解锁">
          <div class="achievements-list">
            <div v-if="lockedAchievements.length === 0" class="empty-state">
              <van-empty description="暂无未解锁成就" />
            </div>
            <template v-else>
              <AchievementCard 
                v-for="achievement in lockedAchievements" 
                :key="achievement.id"
                :achievement="achievement"
              />
            </template>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAchievementStore } from '../stores'
import ProgressBar from '../components/ProgressBar.vue'
import AchievementCard from '../components/AchievementCard.vue'

const router = useRouter()
const achievementStore = useAchievementStore()
const activeTab = ref(0)

// 初始化成就数据
onMounted(() => {
  achievementStore.initAchievements()
  achievementStore.updateAchievements()
})

// 计算属性
const totalAchievements = computed(() => achievementStore.achievements.length)
const unlockedAchievements = computed(() => achievementStore.achievements.filter(a => a.unlocked))
const lockedAchievements = computed(() => achievementStore.achievements.filter(a => !a.unlocked))
const unlockedCount = computed(() => unlockedAchievements.value.length)
const completionPercentage = computed(() => {
  if (totalAchievements.value === 0) return 0
  return Math.round((unlockedCount.value / totalAchievements.value) * 100)
})

// 不再需要filteredAchievements计算属性，直接在模板中使用对应的数据源

// 标记成就为已读
const markAsRead = (achievementId: number) => {
  achievementStore.markAchievementAsRead(achievementId)
}
</script>

<style scoped>
.achievements-container {
  padding: 16px;
  padding-bottom: 80px;
}

.achievements-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  margin-top: 16px;
}

.stat-box {
  text-align: center;
  background-color: var(--card-color);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 30%;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  font-size: 14px;
  color: var(--text-color-light);
}

.progress-section {
  margin-bottom: 20px;
}

.filter-bar {
  margin-bottom: 16px;
}

.achievements-list {
  padding-top: 16px;
}

.empty-state {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}

@media (max-width: 480px) {
  .achievements-container {
    padding: 12px;
  }
  
  .stat-box {
    padding: 8px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .stat-label {
    font-size: 12px;
  }
}
</style>