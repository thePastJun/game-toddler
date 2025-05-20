<template>
  <div class="achievement-card" :class="{ 'achievement-unlocked': achievement.unlocked }">
    <div class="achievement-icon">
      <van-icon :name="achievement.icon" :class="{ 'bounce-animation': achievement.unlocked && isNew }" />
    </div>
    <div class="achievement-content">
      <div class="achievement-title">{{ achievement.title }}</div>
      <div class="achievement-description">{{ achievement.description }}</div>
      <div class="achievement-progress" v-if="achievement.progressMax > 0">
        <ProgressBar 
          :current-value="achievement.progress" 
          :max-value="achievement.progressMax" 
          show-percentage
        />
      </div>
    </div>
    <div class="achievement-reward" v-if="achievement.unlocked">
      <van-icon name="gift-o" class="pulse-animation" />
      <span>{{ achievement.reward }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue'
import ProgressBar from './ProgressBar.vue'

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
}

interface Props {
  achievement: Achievement
  isNew?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isNew: false
})
</script>

<style scoped>
.achievement-card {
  width: 100%;
  border-radius: 12px;
  background-color: var(--card-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.achievement-unlocked {
  opacity: 1;
  border-left: 4px solid var(--success-color);
}

.achievement-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.achievement-icon .van-icon {
  font-size: 24px;
  color: var(--text-color-light);
}

.achievement-unlocked .achievement-icon .van-icon {
  color: var(--success-color);
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.achievement-description {
  font-size: 14px;
  color: var(--text-color-light);
  margin-bottom: 8px;
}

.achievement-progress {
  margin-top: 8px;
}

.achievement-reward {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--warning-color);
}

.achievement-reward .van-icon {
  margin-right: 4px;
}

@media (max-width: 480px) {
  .achievement-card {
    padding: 12px;
  }
  
  .achievement-icon {
    width: 40px;
    height: 40px;
  }
  
  .achievement-icon .van-icon {
    font-size: 20px;
  }
  
  .achievement-title {
    font-size: 16px;
  }
  
  .achievement-description {
    font-size: 12px;
  }
}
</style>