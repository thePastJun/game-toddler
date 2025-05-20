<template>
  <div class="level-select-container">
    <div class="levels-grid">
      <div 
        v-for="level in levels" 
        :key="level.id"
        class="level-item"
        :class="{
          'level-locked': !level.isUnlocked,
          'level-completed': level.isCompleted,
          'pulse-animation': level.id === currentLevel && level.isUnlocked
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
            :class="{'bounce-animation': star <= level.stars && level.isCompleted}"
          />
        </div>
        <div class="level-difficulty" :class="`difficulty-${level.difficulty}`">
          {{ getDifficultyText(level.difficulty) }}
        </div>
        <van-icon 
          v-if="!level.isUnlocked" 
          name="lock" 
          class="level-lock-icon"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import { Level } from '../stores/modules/game'

interface Props {
  levels: Level[]
  currentLevel: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', level: Level): void
}>()

// 选择关卡
const selectLevel = (level: Level) => {
  if (level.isUnlocked) {
    emit('select', level)
  } else {
    // 播放锁定音效或提示
    playLockedSound()
  }
}

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return '简单'
    case 'medium':
      return '中等'
    case 'hard':
      return '困难'
    default:
      return ''
  }
}

// 播放锁定音效
const playLockedSound = () => {
  // 这里可以调用声音工具播放锁定音效
  console.log('播放锁定音效')
}
</script>

<style scoped>
.level-select-container {
  width: 100%;
  padding: 16px;
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.level-item {
  position: relative;
  background-color: var(--card-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.level-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.level-locked {
  opacity: 0.7;
  background-color: #f0f0f0;
}

.level-completed {
  border: 2px solid var(--success-color);
}

.level-number {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--primary-color);
}

.level-stars {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.level-difficulty {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 8px;
}

.difficulty-easy {
  background-color: #e8f5e9;
  color: var(--primary-color);
}

.difficulty-medium {
  background-color: #fff8e1;
  color: var(--warning-color);
}

.difficulty-hard {
  background-color: #ffebee;
  color: var(--error-color);
}

.level-lock-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .levels-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .level-number {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .levels-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .level-item {
    padding: 12px;
  }
  
  .level-number {
    font-size: 20px;
  }
}
</style>