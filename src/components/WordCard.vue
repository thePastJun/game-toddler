<template>
  <div class="word-card" :class="{ mastered: word.isMastered }" @click="handleCardClick">
    <div class="word-card-content">
      <div class="word-english">{{ word.english }}</div>
      <div class="word-phonetic">
        {{ word.phonetic }}
        <van-icon name="volume-o" class="sound-icon" @click.stop="speakWord" />
      </div>
      <div class="word-chinese" v-if="showChinese">{{ word.chinese }}</div>
      <div class="word-image" v-if="showImage">
        <img :src="`/images/words/${word.english.toLowerCase()}.svg`" :alt="word.english" class="word-illustration" />
      </div>
      <div class="word-actions" v-if="showActions">
        <van-button 
          size="small" 
          :type="isLearned ? 'warning' : 'primary'" 
          @click.stop="$emit('learn', word.id)">
          {{ isLearned ? '取消学习' : '学习' }}
        </van-button>
        <van-button 
          size="small" 
          :type="word.isMastered ? 'warning' : 'success'" 
          @click.stop="$emit('master', word.id)">
          {{ word.isMastered ? '取消掌握' : '掌握' }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, withDefaults, computed } from 'vue'
import { Word } from '../stores/modules/word'
import { playWordSound, playSound } from '../utils/sound'
import { addAnimation } from '../utils/animation'
import { useWordStore } from '../stores'

interface Props {
  word: Word
  showChinese?: boolean
  showActions?: boolean
  showImage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showChinese: false,
  showActions: false,
  showImage: false
})

// 获取单词状态
const wordStore = useWordStore()

// 计算属性：判断单词是否已学习
const isLearned = computed(() => {
  return wordStore.learnedWords.includes(props.word.id)
})

defineEmits<{
  (e: 'learn', wordId: number): void
  (e: 'master', wordId: number): void
  (e: 'click', word: Word): void
}>()

// 播放单词发音
const speakWord = () => {
  playWordSound(props.word.english)
  playSound('click')
  
  // 获取单词元素并添加动画
  const wordElement = document.querySelector('.word-english') as HTMLElement
  if (wordElement) {
    addAnimation(wordElement, 'pulse', 500)
  }
}

// 处理卡片点击
const handleCardClick = () => {
  // 发出点击事件
  speakWord()
}
</script>

<style scoped>
.word-card {
  width: 100%;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border: 2px solid #e0e0e0;
  cursor: pointer;
}

.word-card:active {
  transform: scale(0.98);
}

.word-card.mastered {
  border-left: 6px solid #4caf50;
  background-color: #f9fff9;
}

.word-english {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #2196f3;
}

.word-phonetic {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.sound-icon {
  margin-left: 8px;
  color: #ff9800;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.sound-icon:active {
  transform: scale(1.2);
}

.word-chinese {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
}

.word-image {
  margin: 10px 0;
  display: flex;
  justify-content: center;
}

.word-illustration {
  max-width: 100%;
  max-height: 120px;
  object-fit: contain;
  border-radius: 8px;
}

.word-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

@keyframes pulse {
  from { transform: scale3d(1, 1, 1); }
  50% { transform: scale3d(1.1, 1.1, 1.1); }
  to { transform: scale3d(1, 1, 1); }
}

.pulse {
  animation-name: pulse;
}
</style>