<template>
  <div class="home-page-container">
    <!-- 用户信息栏 -->
    <div class="user-info-bar">
      <div class="user-welcome">
        <span class="welcome-text">欢迎回来，</span>
        <span class="username">{{ displayName }}</span>
      </div>
    </div>
    
    <!-- 标签导航 -->
    <div class="tab-navigation">
      <div class="tab-container">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab-button', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key">
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <transition name="fade" mode="out-in">
        <component :is="currentComponent" :key="activeTab" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import Dashboard from './Dashboard.vue'
import Profile from '../home/Profile.vue'

const router = useRouter()

// 注入全局状态
const currentUser = inject('currentUser', ref(''))

// 计算显示的用户名
const displayName = computed(() => {
  if (currentUser.value && typeof currentUser.value === 'object') {
    return currentUser.value.username || '用户'
  }
  return currentUser.value || '张婉婷'
})

// 标签配置
const tabs = ref([
  { key: 'dashboard', label: '我的看板', component: Dashboard },
  { key: 'profile', label: '我的画像', component: Profile }
])

const activeTab = ref('dashboard')

// 当前显示的组件
const currentComponent = computed(() => {
  const tab = tabs.value.find(t => t.key === activeTab.value)
  return tab ? tab.component : Dashboard
})

// 页面加载时获取用户信息
onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    try {
      currentUser.value = JSON.parse(user)
    } catch (e) {
      currentUser.value = user
    }
  }
})
</script>

<style scoped>
.home-page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 用户信息栏样式 */
.user-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.user-welcome {
  display: flex;
  align-items: center;
  gap: 8px;
}

.welcome-text {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.username {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

/* 标签导航样式 */
.tab-navigation {
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-container {
  display: flex;
  gap: 0;
}

.tab-button {
  padding: 16px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: #666;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.05);
}

.tab-button.active {
  color: #8b5cf6;
  border-bottom-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  font-weight: 600;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 内容区域样式 */
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-info-bar {
    padding: 16px;
  }
  
  .tab-navigation {
    padding: 0 16px;
  }
  
  .tab-button {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .content-area {
    padding: 16px;
  }
}
</style>
