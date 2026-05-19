<template>
  <div class="content-section">
    <div class="content-tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'teaching-resources' }"
        @click="$emit('sub-tab-change', 'teaching-resources')"
      >
        教学资源
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'my-assets' }"
        @click="$emit('sub-tab-change', 'my-assets')"
      >
        我的资产
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'intelligent-resources' }"
        @click="$emit('sub-tab-change', 'intelligent-resources')"
      >
        智能资源
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'digital-resources' }"
        @click="$emit('sub-tab-change', 'digital-resources')"
      >
        数字资源
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'graph-resources' }"
        @click="$emit('sub-tab-change', 'graph-resources')"
      >
        图谱资源
      </div>

    </div>
    
    <!-- 内容展示区域 -->
    <div class="content-area">
      <!-- 资源数据-教学资源页面（包含课件、课程与知识库三个页面切换） -->
      <TeachingResources 
        v-if="activeSubTab === 'teaching-resources' || activeSubTab === 'courseware' || activeSubTab === 'courses' || activeSubTab === 'knowledge-base'" 
        :active-sub-tab="activeSubTab"
      />
      
      <!-- 资源数据-我的资产页面 -->
      <MyAssets v-if="activeSubTab === 'my-assets'" />
      
      <!-- 资源数据-智能资源页面（包含工作流、数字人与智能体三个页面切换） -->
      <IntelligentResources 
        v-if="activeSubTab === 'intelligent-resources' || activeSubTab === 'workflow' || activeSubTab === 'digital-human' || activeSubTab === 'agent'" 
        :active-sub-tab="activeSubTab"
      />
      
      <!-- 资源数据-数字资源页面（包含视频与配音两个页面切换） -->
      <DigitalResources v-if="activeSubTab === 'digital-resources' || activeSubTab === 'video' || activeSubTab === 'voice-over'" />
      
      <!-- 资源数据-图谱资源页面（包含知识图谱与能力图谱两个页面切换） -->
      <GraphResources 
        v-if="activeSubTab === 'graph-resources' || activeSubTab === 'knowledge-graph' || activeSubTab === 'ability-graph'" 
        :active-sub-tab="activeSubTab"
      />
    </div>
  </div>
</template>

<script setup>
import TeachingResources from '@/components/data-center/resource-data/TeachingResources.vue'
import DigitalResources from '@/components/data-center/resource-data/DigitalResources.vue'
import IntelligentResources from '@/components/data-center/resource-data/IntelligentResources.vue'
import GraphResources from '@/components/data-center/resource-data/GraphResources.vue'
import MyAssets from '@/components/data-center/resource-data/MyAssets.vue'

defineProps({
  activeSubTab: {
    type: String,
    default: 'teaching-resources'
  }
})

defineEmits(['sub-tab-change'])
</script>

<style scoped>
/* 内容区域 */
.content-section {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.content-tabs {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
}

.tab-item {
  padding: 16px 24px;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
}

.tab-item:hover {
  color: #3b82f6;
  background: #f1f5f9;
}

.tab-item.active {
  color: #3b82f6;
  background: white;
  border-bottom-color: #3b82f6;
}

.content-area {
  min-height: 600px;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-tabs {
    flex-wrap: wrap;
  }
  
  .tab-item {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
