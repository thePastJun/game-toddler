<template>
  <div class="word-challenge-container">
    <div class="word-card-wrapper" @click="playWordSound">
      <WordCard 
        :word="word" 
        :show-chinese="showHint"
        :show-actions="false"
        class="challenge-word-card"
        :class="{'bounce-animation': isCorrect}"
      />
      <van-icon name="volume" class="sound-icon pulse-animation" />
    </div>
    
    <div class="answer-options">
      <van-button 
        v-for="option in options" 
        :key="option.id"
        size="large" 
        block 
        class="answer-option"
        :class="{
          'correct-answer': showResult && option.id === word.id,
          'wrong-answer': showResult && selectedOption === option.id && option.id !== word.id
        }"
        @click="checkAnswer(option.id)"
        :disabled="showResult"
      >
        {{ option.chinese }}
      </van-button>
    </div>
    
    <div class="challenge-actions">
      <van-button 
        type="primary" 
        plain 
        size="small"
        @click="toggleHint"
      >
        {{ showHint ? '隐藏提示' : '显示提示' }}
      </van-button>
      
      <van-button 
        type="warning" 
        plain 
        size="small"
        @click="$emit('skip')"
        :disabled="showResult"
      >
        跳过
      </van-button>
    </div>
    
    <div v-if="showResult" class="result-feedback">
      <div v-if="isCorrect" class="correct-feedback">
        <van-icon name="success" /> 回答正确！
      </div>
      <div v-else class="wrong-feedback">
        <van-icon name="cross" /> 正确答案: {{ word.chinese }}
      </div>
      
      <van-button 
        type="primary" 
        block 
        class="next-button"
        @click="$emit('next')"
      >
        继续
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import WordCard from './WordCard.vue'
import { Word } from '../stores/modules/word'
import { playWordSound as playSoundUtil } from '../utils/sound'

interface Props {
  word: Word
  options: Word[]
  showHint?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'correct'): void
  (e: 'wrong'): void
  (e: 'skip'): void
  (e: 'next'): void
  (e: 'hint-change', value: boolean): void
}>()

const showHint = ref(props.showHint || false)
const showResult = ref(false)
const selectedOption = ref<number | null>(null)
const isCorrect = computed(() => selectedOption.value === props.word.id)

// 切换提示显示
const toggleHint = () => {
  showHint.value = !showHint.value
  emit('hint-change', showHint.value)
}

// 播放单词发音
const playWordSound = () => {
  playSoundUtil(props.word.english)
}

// 检查答案
const checkAnswer = (optionId: number) => {
  selectedOption.value = optionId
  showResult.value = true
  
  if (optionId === props.word.id) {
    // 答对了
    emit('correct')
    playCorrectSound()
  } else {
    // 答错了
    emit('wrong')
    playWrongSound()
  }
}

// 播放正确音效
const playCorrectSound = () => {
  // 这里可以调用声音工具播放正确音效
  console.log('播放正确音效')
}

// 播放错误音效
const playWrongSound = () => {
  // 这里可以调用声音工具播放错误音效
  console.log('播放错误音效')
}
</script>

<style scoped>
.word-challenge-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.word-card-wrapper {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.challenge-word-card {
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: all 0.3s ease;
}

.sound-icon {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-size: 24px;
  color: var(--primary-color);
}

.answer-options {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.answer-option {
  border-radius: 12px;
  font-size: 16px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
  background-color: white;
  border: 2px solid #eee;
}

.answer-option:active {
  transform: scale(0.98);
}

.correct-answer {
  background-color: rgba(76, 175, 80, 0.2);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.wrong-answer {
  background-color: rgba(244, 67, 54, 0.2);
  border-color: var(--error-color);
  color: var(--error-color);
}

.challenge-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.result-feedback {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.correct-feedback {
  color: var(--primary-color);
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.wrong-feedback {
  color: var(--error-color);
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.next-button {
  margin-top: 16px;
}

@media (max-width: 480px) {
  .answer-options {
    grid-template-columns: 1fr;
  }
  
  .challenge-word-card {
    padding: 16px;
  }
  
  .answer-option {
    padding: 12px;
    font-size: 14px;
  }
}
</style>