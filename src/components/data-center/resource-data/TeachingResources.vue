<template>
  <div class="teaching-resources-container">
    <!-- 头部区域，包含极具设计感的切换导航 -->
    <div class="resources-header">
      <div class="header-title-section">
        <h2 class="page-main-title">教学资源中心</h2>
        <p class="page-subtitle">高效管理您的课程体系、教学课件教案与数字知识库</p>
      </div>
      
      <!-- 极具科技感的胶囊药丸式切换导航 -->
      <div class="resource-switch-wrapper">
        <div class="resource-switch-nav">
          <!-- 激活背景滑块 -->
          <div class="active-indicator" :style="indicatorStyle"></div>
          
          <div 
            class="switch-nav-item" 
            :class="{ active: currentTab === 'courseware' }"
            @click="currentTab = 'courseware'"
          >
            <el-icon class="nav-icon"><Document /></el-icon>
            <span class="nav-text">课件教案</span>
          </div>
          
          <div 
            class="switch-nav-item" 
            :class="{ active: currentTab === 'courses' }"
            @click="currentTab = 'courses'"
          >
            <el-icon class="nav-icon"><Reading /></el-icon>
            <span class="nav-text">课程体系</span>
          </div>

          <div 
            class="switch-nav-item" 
            :class="{ active: currentTab === 'knowledge-base' }"
            @click="currentTab = 'knowledge-base'"
          >
            <el-icon class="nav-icon"><FolderOpened /></el-icon>
            <span class="nav-text">知识库</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 内容展示视图，结合精致优雅的过渡动画 -->
    <div class="resource-content-view">
      <transition name="fade-slide" mode="out-in">
        <Courseware v-if="currentTab === 'courseware'" />
        <Courses v-else-if="currentTab === 'courses'" />
        <KnowledgeBase v-else-if="currentTab === 'knowledge-base'" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Document, Reading, FolderOpened } from '@element-plus/icons-vue'
import Courseware from './Courseware.vue'
import Courses from './Courses.vue'
import KnowledgeBase from './KnowledgeBase.vue'

// 定义 Props 以便能从 ResourcesContent 接收状态触发自动切换
const props = defineProps({
  activeSubTab: {
    type: String,
    default: 'teaching-resources'
  }
})

// 当前选中的 Tab，默认为课件教案页
const currentTab = ref('courseware')

// 监听父组件的 activeSubTab 变化，同步子标签页
watch(() => props.activeSubTab, (newVal) => {
  if (newVal === 'courses') {
    currentTab.value = 'courses'
  } else if (newVal === 'knowledge-base') {
    currentTab.value = 'knowledge-base'
  } else if (newVal === 'courseware') {
    currentTab.value = 'courseware'
  }
}, { immediate: true })

// 计算背景激活指示器的滑块样式
const indicatorStyle = computed(() => {
  const indexMap = {
    'courseware': 0,
    'courses': 1,
    'knowledge-base': 2
  }
  const idx = indexMap[currentTab.value] || 0
  return {
    width: '33.333%',
    transform: `translateX(${idx * 100}%)`
  }
})
</script>

<style scoped>
.teaching-resources-container {
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
  width: 390px; /* 增加宽度至390px以容纳3个Tab */
  height: 38px;
  align-items: center;
}

/* 指示器滑块 */
.active-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 33.333%;
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
    width: 100%;
  }

  .resource-switch-nav {
    width: 100%;
  }
}
</style>
