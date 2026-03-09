<template>
  <div class="content-section">
    <div class="content-tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'self-assessment' }"
        @click="$emit('sub-tab-change', 'self-assessment')"
      >
        ★自我评估
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'digital-literacy' }"
        @click="$emit('sub-tab-change', 'digital-literacy')"
      >
        ★数字素养
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'student' }"
        @click="$emit('sub-tab-change', 'student')"
      >
        学生评教
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'supervisor' }"
        @click="$emit('sub-tab-change', 'supervisor')"
      >
        督导评价
      </div>
    </div>
    
    <!-- 内容展示区域 -->
    <div class="content-area">
      <!-- 自我评估页面 -->
      <SelfAssessment v-if="activeSubTab === 'self-assessment'" />
      
      <!-- 数字素养页面 -->
      <DigitalLiteracy 
        v-if="activeSubTab === 'digital-literacy'" 
        @open-ai="payload => $emit('open-ai', payload)"
      />
      
      <!-- 学生评教页面 -->
      <StudentEvaluation v-if="activeSubTab === 'student'" />
      
      <!-- 督导评价页面 -->
      <SupervisorEvaluation v-if="activeSubTab === 'supervisor'" />
    </div>
  </div>
</template>

<script setup>
import SelfAssessment from '@/components/data-center/evaluation/SelfAssessment.vue'
import DigitalLiteracy from '@/components/data-center/evaluation/DigitalLiteracy.vue'
import StudentEvaluation from '@/components/data-center/evaluation/StudentEvaluation.vue'
import SupervisorEvaluation from '@/components/data-center/evaluation/SupervisorEvaluation.vue'

defineProps({
  activeSubTab: {
    type: String,
    default: 'self-assessment'
  }
})

defineEmits(['sub-tab-change', 'open-ai'])
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

.placeholder-content {
  text-align: center;
  color: #6b7280;
  padding: 40px;
}

.placeholder-content h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #374151;
}

.placeholder-content p {
  font-size: 16px;
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
  
  .content-area {
    padding: 0;
  }
}
</style>
