<template>
  <div class="digital-resources-container">
    <!-- 头部区域，包含极具设计感的切换导航 -->
    <div class="resources-header">
      <div class="header-title-section">
        <h2 class="page-main-title">数字资源中心</h2>
        <p class="page-subtitle">高效管理您的课程讲解视频与背景音乐配音资源</p>
      </div>
      
      <!-- 极具科技感的胶囊药丸式切换导航 -->
      <div class="resource-switch-wrapper">
        <div class="resource-switch-nav">
          <!-- 激活背景滑块 -->
          <div class="active-indicator" :style="indicatorStyle"></div>
          
          <div 
            class="switch-nav-item" 
            :class="{ active: currentTab === 'video' }"
            @click="currentTab = 'video'"
          >
            <el-icon class="nav-icon"><VideoPlay /></el-icon>
            <span class="nav-text">讲解视频</span>
          </div>
          
          <div 
            class="switch-nav-item" 
            :class="{ active: currentTab === 'voice-over' }"
            @click="currentTab = 'voice-over'"
          >
            <el-icon class="nav-icon"><Microphone /></el-icon>
            <span class="nav-text">音频配音</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 内容展示视图，结合精致优雅的过渡动画 -->
    <div class="resource-content-view">
      <transition name="fade-slide" mode="out-in">
        <Video v-if="currentTab === 'video'" />
        <Dubbing v-else-if="currentTab === 'voice-over'" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { VideoPlay, Microphone } from '@element-plus/icons-vue'
import Video from './Video.vue'
import Dubbing from './Dubbing.vue'

// 当前选中的 Tab，默认为讲解视频页
const currentTab = ref('video')

// 计算背景激活指示器的滑块样式
const indicatorStyle = computed(() => {
  return {
    transform: currentTab.value === 'video' ? 'translateX(0)' : 'translateX(100%)'
  }
})
</script>

<style scoped>
.digital-resources-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

/* 头部样式：扁平高端设计 */
.resources-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  flex-wrap: wrap;
  gap: 16px;
}

.header-title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-main-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #1e293b;
  letter-spacing: 0.5px;
}

.page-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* 药丸式切换导航组件 */
.resource-switch-wrapper {
  background: #f1f5f9;
  padding: 4px;
  border-radius: 99px;
  border: 1px solid #e2e8f0;
  position: relative;
  display: inline-flex;
}

.resource-switch-nav {
  position: relative;
  display: flex;
  width: 260px;
  height: 38px;
  align-items: center;
}

/* 指示器滑块 */
.active-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 99px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 1;
}

/* 导航项 */
.switch-nav-item {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  user-select: none;
}

.nav-icon {
  font-size: 16px;
  color: #64748b;
  transition: color 0.3s ease;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  transition: color 0.3s ease;
}

/* 悬停与选中状态 */
.switch-nav-item:hover .nav-icon,
.switch-nav-item:hover .nav-text {
  color: #1e293b;
}

.switch-nav-item.active .nav-icon,
.switch-nav-item.active .nav-text {
  color: #ffffff;
  font-weight: 600;
}

/* 内容显示区样式 */
.resource-content-view {
  width: 100%;
}

/* 页面切换的精致过渡动画 (Fade Slide) */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .resources-header {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }
  
  .resource-switch-wrapper {
    align-self: center;
  }
}
</style>
