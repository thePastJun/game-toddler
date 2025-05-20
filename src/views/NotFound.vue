<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <van-icon name="warning-o" size="64" color="#ff9800" />
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <van-button 
        type="primary" 
        round 
        size="large" 
        class="back-button"
        @click="router.push('/')"
      >
        返回首页
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

// 路由实例
const router = useRouter()
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  padding: 20px;
}

.not-found-content {
  text-align: center;
  background-color: #fff;
  border-radius: 12px;
  padding: 40px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  animation: fade-in 0.5s ease-in-out;
}

.not-found-content h2 {
  font-size: 24px;
  margin: 16px 0;
  color: #333;
}

.not-found-content p {
  color: #666;
  margin-bottom: 24px;
}

.back-button {
  margin-top: 16px;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>