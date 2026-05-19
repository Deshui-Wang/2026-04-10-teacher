<template>
  <div class="data-center-container">
    <el-container class="main-layout">
      <!-- 左侧导航栏 -->
      <el-aside width="260px" class="sidebar-aside">
        <div class="sidebar-header">
          <h2 class="sidebar-title">教学中心</h2>
        </div>
        <el-menu
          :default-active="activeSubTab"
          class="data-menu"
          @select="handleMenuSelect"
          unique-opened
        >
          <!-- 教学数据组 -->
          <el-sub-menu index="teaching">
            <template #title>
              <i class="el-icon-monitor"></i>
              <span>教学数据</span>
            </template>
            <el-menu-item index="workload">课表</el-menu-item>
            <el-menu-item index="teaching-task">教学任务</el-menu-item>
            <el-menu-item index="teaching-course">我的授课</el-menu-item>
            <el-menu-item index="aidata">AI数据分析</el-menu-item>
          </el-sub-menu>

          <!-- 资源数据组 -->
          <el-sub-menu index="resources">
            <template #title>
              <i class="el-icon-folder-opened"></i>
              <span>资源数据</span>
            </template>
            <el-menu-item index="teaching-resources">教学资源</el-menu-item>
            <el-menu-item index="my-assets">我的资产</el-menu-item>
            <el-menu-item index="intelligent-resources">智能资源</el-menu-item>
            <el-menu-item index="digital-resources">数字资源</el-menu-item>
            <el-menu-item index="graph-resources">图谱资源</el-menu-item>
          </el-sub-menu>

          <!-- 成果数据组 -->
          <el-sub-menu index="achievements">
            <template #title>
              <i class="el-icon-medal"></i>
              <span>成果数据</span>
            </template>
            <el-menu-item index="papers">科研成果</el-menu-item>
            <el-menu-item index="certificates">证书</el-menu-item>
            <el-menu-item index="ability-certification">能力认证</el-menu-item>
            <el-menu-item index="international-ability">国际能力</el-menu-item>
            <el-menu-item index="teaching-achievements">教学成果</el-menu-item>
            <el-menu-item index="enterprise-cooperation">企业合作成果</el-menu-item>
          </el-sub-menu>

          <!-- 评价数据组 -->
          <el-sub-menu index="evaluation">
            <template #title>
              <i class="el-icon-document-checked"></i>
              <span>评价数据</span>
            </template>
            <el-menu-item index="self-assessment">自我评估</el-menu-item>
            <el-menu-item index="digital-literacy">数字素养</el-menu-item>
            <el-menu-item index="student">学生评教</el-menu-item>
            <el-menu-item index="supervisor">督导评价</el-menu-item>
          </el-sub-menu>

          <!-- 档案报告组 -->
          <el-sub-menu index="reports">
            <template #title>
              <i class="el-icon-pie-chart"></i>
              <span>档案报告</span>
            </template>
            <el-menu-item index="archive">个人数据报告</el-menu-item>
            <el-menu-item index="growth">个人成长档案</el-menu-item>
            <el-menu-item index="resume">教学履历</el-menu-item>
          </el-sub-menu>

          <!-- 学情分析组 -->
          <el-sub-menu index="analysis">
            <template #title>
              <i class="el-icon-data-analysis"></i>
              <span>学情分析</span>
            </template>
            <el-menu-item index="learning-group">群体画像</el-menu-item>
            <el-menu-item index="learning-student">学生画像</el-menu-item>
            <el-menu-item index="learning-report">学情报告</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容区 -->
      <el-main class="content-main">
        <div class="content-wrapper">
          <!-- 教学数据 -->
          <TeachingContent 
            v-if="activeTab === 'teaching'"
            :active-sub-tab="activeSubTab"
            @sub-tab-change="setActiveSubTab"
          />
          
          <!-- 资源数据 -->
          <ResourcesContent 
            v-if="activeTab === 'resources'"
            :active-sub-tab="activeSubTab"
            @sub-tab-change="setActiveSubTab"
          />
          
          <!-- 成果数据 -->
          <AchievementsContent 
            v-if="activeTab === 'achievements'"
            :active-sub-tab="activeSubTab"
            @sub-tab-change="setActiveSubTab"
            @open-ai="payload => $emit('open-ai', payload)"
          />
          
          <!-- 评价数据 -->
          <EvaluationContent 
            v-if="activeTab === 'evaluation'"
            :active-sub-tab="activeSubTab"
            @sub-tab-change="setActiveSubTab"
            @open-ai="payload => $emit('open-ai', payload)"
          />
          
          <!-- 报告数据 -->
          <ReportsContent 
            v-if="activeTab === 'reports'"
            :active-sub-tab="activeSubTab"
            @sub-tab-change="setActiveSubTab"
          />

          <!-- 学情分析 -->
          <LearningAnalysisContent
            v-if="activeTab === 'analysis'"
            :active-sub-tab="activeSubTab"
            @sub-tab-change="setActiveSubTab"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TeachingContent from '@/components/data-center/data-types/TeachingContent.vue'
import ResourcesContent from '@/components/data-center/data-types/ResourcesContent.vue'
import AchievementsContent from '@/components/data-center/data-types/AchievementsContent.vue'
import EvaluationContent from '@/components/data-center/data-types/EvaluationContent.vue'
import ReportsContent from '@/components/data-center/data-types/ReportsContent.vue'
import LearningAnalysisContent from '@/components/data-center/data-types/LearningAnalysisContent.vue'

// 当前激活的主菜单
const activeTab = ref('teaching')
// 当前激活的子菜单
const activeSubTab = ref('workload')
const menuGroupMap = {
  'workload': 'teaching',
  'teaching-task': 'teaching',
  'teaching-course': 'teaching',
  'aidata': 'teaching',
  'teaching-resources': 'resources',
  'courseware': 'resources',
  'courses': 'resources',
  'my-assets': 'resources',
  'intelligent-resources': 'resources',
  'workflow': 'resources',
  'knowledge-base': 'resources',
  'digital-resources': 'resources',
  'graph-resources': 'resources',
  'video': 'resources',
  'voice-over': 'resources',
  'knowledge-graph': 'resources',
  'ability-graph': 'resources',
  'digital-human': 'resources',
  'agent': 'resources',
  'papers': 'achievements',
  'certificates': 'achievements',
  'ability-certification': 'achievements',
  'international-ability': 'achievements',
  'teaching-achievements': 'achievements',
  'enterprise-cooperation': 'achievements',
  'self-assessment': 'evaluation',
  'digital-literacy': 'evaluation',
  'student': 'evaluation',
  'supervisor': 'evaluation',
  'archive': 'reports',
  'growth': 'reports',
  'resume': 'reports',
  'learning-group': 'analysis',
  'learning-student': 'analysis',
  'learning-report': 'analysis'
}

// 处理菜单选择
const handleMenuSelect = (index) => {
  activeSubTab.value = index
  activeTab.value = menuGroupMap[index]
}

// 设置激活的子菜单 (兼容原有子组件内部切换)
const setActiveSubTab = (subTab) => {
  activeSubTab.value = subTab
  activeTab.value = menuGroupMap[subTab]
}

defineEmits(['open-ai'])
</script>

<style scoped>
.data-center-container {
  height: calc(100vh - 64px); /* 减去顶部导航高度 */
  background: #f8fafc;
}

.main-layout {
  height: 100%;
}

.sidebar-aside {
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.02);
  z-index: 10;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.data-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-sub-menu__title) {
  font-weight: 600;
  color: #1e293b;
}

:deep(.el-menu-item) {
  color: #64748b;
  height: 44px;
  line-height: 44px;
  margin: 4px 12px;
  border-radius: 8px;
}

:deep(.el-menu-item.is-active) {
  background: #eff6ff !important;
  color: #3b82f6 !important;
  font-weight: 600;
}

:deep(.el-menu-item:hover) {
  background: #f8fafc;
  color: #3b82f6;
}

.content-main {
  padding: 0;
  background: #f8fafc;
  overflow-y: auto;
}

.content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
}

/* 隐藏原有子组件内的顶部 Tab（因为已经移到了左侧） */
:deep(.content-tabs) {
  display: none !important;
}

/* 覆盖子组件的阴影，让右侧看起来更像一个整体 */
:deep(.content-section) {
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
}

:deep(.el-icon) {
  margin-right: 8px;
  font-size: 18px;
  vertical-align: middle;
}
</style>
