<template>
  <div class="home-page-container">
    <!-- 标签导航 -->
    <div class="tab-navigation">
      <div class="tab-container">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab-button', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key">
          <!-- <span class="tab-icon">{{ tab.icon }}</span> -->
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
import { ref, computed } from 'vue'
import Dashboard from './Dashboard.vue'
import Profile from './Profile.vue'

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

/* 标签导航样式 */
.tab-navigation {
  padding-top: 20px;
}

.tab-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px; /* 减小间距 */
  padding: 8px 20px; /* 参考 filter-tab */
  background: #fff; /* 参考 filter-tab */
  border: 1px solid #e0e6f1; /* 参考 filter-tab */
  border-radius: 20px; /* 参考 filter-tab */
  cursor: pointer;
  transition: all 0.3s ease; /* 参考 filter-tab */
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #666; /* 参考 filter-tab */
  font-size: 14px; /* 参考 filter-tab */
  justify-content: center;
}

.tab-button:hover {
  background: #f0f5ff; /* 参考 filter-tab:hover */
  color: #5856d6; /* 参考 filter-tab:hover */
  border-color: #5856d6; /* 参考 filter-tab:hover */
}

.tab-button.active {
  background: #5856d6; /* 参考 filter-tab.active */
  color: #fff; /* 参考 filter-tab.active */
  border-color: #5856d6; /* 参考 filter-tab.active */
  transform: translateY(0); /* 移除之前的动画 */
  box-shadow: none; /* 移除之前的阴影 */
}

.tab-icon {
  font-size: 18px; /* 调整图标大小 */
  z-index: 1;
}

.tab-label {
  font-size: 14px; /* 调整字体大小 */
  font-weight: 500; /* 调整字重 */
  z-index: 1;
}

/* 内容区域样式 */
.content-area {
  flex: 1;
  padding: 20px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tab-container {
    padding: 0 10px;
    gap: 4px;
  }
  
  .tab-button {
    padding: 12px 16px;
    min-width: 120px;
    gap: 8px;
  }
  
  .tab-icon {
    font-size: 18px;
  }
  
  .tab-label {
    font-size: 14px;
  }
  
  .content-area {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .tab-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .tab-button {
    min-width: auto;
    width: 100%;
  }
}
</style> 