<template>
  <div class="content-section">
    <div class="content-tabs">
      <div 
        :class="['tab-item', { active: activeSubTab === 'archive' }]"
        @click="$emit('sub-tab-change', 'archive')"
      >
        个人数据报告
      </div>
      <div 
        :class="['tab-item', { active: activeSubTab === 'growth' }]"
        @click="$emit('sub-tab-change', 'growth')"
      >
        个人成长档案
      </div>
      <div 
        :class="['tab-item', { active: activeSubTab === 'resume' }]"
        @click="$emit('sub-tab-change', 'resume')"
      >
        教学履历
      </div>
    </div>
    
    <!-- 内容展示区域 -->
    <div class="content-area">
      <ArchiveList v-if="activeSubTab === 'archive'" />
      <PersonalGrowthArchive v-if="activeSubTab === 'growth'" />
      <TeachingResume v-if="activeSubTab === 'resume'" />
    </div>
  </div>
</template>

<script setup>
import ArchiveList from '../report-data/ArchiveList.vue'
import PersonalGrowthArchive from '../report-data/PersonalGrowthArchive.vue'
import TeachingResume from '../teaching-data/TeachingResume.vue'

defineProps({
  activeSubTab: {
    type: String,
    default: 'archive'
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
