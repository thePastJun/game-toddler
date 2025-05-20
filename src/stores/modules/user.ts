import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户信息类型定义
export interface UserInfo {
  id: string
  username: string
  avatar: string
  level: number
  exp: number
  coins: number
}

// 用户状态管理
export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo>({
    id: '',
    username: '游客',
    avatar: '',
    level: 1,
    exp: 0,
    coins: 0
  })
  const isLogin = ref<boolean>(false)
  
  // 获取用户信息
  const getUserInfo = () => {
    // 从本地存储获取用户信息
    const storedInfo = localStorage.getItem('userInfo')
    if (storedInfo) {
      userInfo.value = JSON.parse(storedInfo)
      isLogin.value = true
    }
  }
  
  // 更新用户信息
  const updateUserInfo = (info: Partial<UserInfo>) => {
    userInfo.value = { ...userInfo.value, ...info }
    // 保存到本地存储
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }
  
  // 增加经验值
  const addExp = (exp: number) => {
    userInfo.value.exp += exp
    // 检查是否升级
    checkLevelUp()
    // 保存到本地存储
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }
  
  // 增加金币
  const addCoins = (coins: number) => {
    userInfo.value.coins += coins
    // 保存到本地存储
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }
  
  // 检查是否升级
  const checkLevelUp = () => {
    const { level, exp } = userInfo.value
    // 简单的升级规则：每100经验升1级
    const nextLevelExp = level * 100
    if (exp >= nextLevelExp) {
      userInfo.value.level += 1
      userInfo.value.exp -= nextLevelExp
    }
  }
  
  // 登出
  const logout = () => {
    userInfo.value = {
      id: '',
      username: '游客',
      avatar: '',
      level: 1,
      exp: 0,
      coins: 0
    }
    isLogin.value = false
    localStorage.removeItem('userInfo')
  }
  
  return {
    userInfo,
    isLogin,
    getUserInfo,
    updateUserInfo,
    addExp,
    addCoins,
    logout
  }
})