<template>
  <div class="progress-container">
    <div class="progress-label" v-if="showLabel">
      <span>{{ label }}</span>
      <span>{{ `${currentValue}/${maxValue}` }}</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${percentage}%`, backgroundColor: color }"
      ></div>
    </div>
    <div class="progress-percentage" v-if="showPercentage">
      {{ `${Math.round(percentage)}%` }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, withDefaults } from 'vue'

interface Props {
  currentValue: number
  maxValue: number
  label?: string
  showLabel?: boolean
  showPercentage?: boolean
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '进度',
  showLabel: true,
  showPercentage: false,
  color: '#4caf50'
})

// 计算百分比
const percentage = computed(() => {
  if (props.maxValue <= 0) return 0
  return (props.currentValue / props.maxValue) * 100
})
</script>

<style scoped>
.progress-container {
  width: 100%;
  margin: 12px 0;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-percentage {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>