<template>
  <div class="content-section">
    <div class="content-tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'workload' }"
        @click="$emit('sub-tab-change', 'workload')"
      >
        工作安排
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'classes' }"
        @click="$emit('sub-tab-change', 'classes')"
      >
        班课
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'students' }"
        @click="$emit('sub-tab-change', 'students')"
      >
        学生
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'assignments' }"
        @click="$emit('sub-tab-change', 'assignments')"
      >
        作业
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'grades' }"
        @click="$emit('sub-tab-change', 'grades')"
      >
        成绩
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'attendance' }"
        @click="$emit('sub-tab-change', 'attendance')"
      >
        出勤
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'interaction' }"
        @click="$emit('sub-tab-change', 'interaction')"
      >
        课堂互动
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'resume' }"
        @click="$emit('sub-tab-change', 'resume')"
      >
        教学履历
      </div>
    </div>
    
    <!-- 内容展示区域 -->
    <div class="content-area">
      <!-- 教学数据-工作量页面 -->
      <WorkloadQuantification v-if="activeSubTab === 'workload'" />
      
      <!-- 教学数据-班级页面 -->
      <ClassManagement v-if="activeSubTab === 'classes'" />
      
      <!-- 教学数据-学生页面 -->
      <StudentManagement v-if="activeSubTab === 'students'" />
      
      <!-- 教学数据-作业页面 -->
      <HomeworkManagement v-if="activeSubTab === 'assignments'" />

      <!-- 教学数据-成绩页面 -->
      <GradeManagement v-if="activeSubTab === 'grades'" />
      
      <!-- 教学数据-出勤页面 -->
      <Attendance v-if="activeSubTab === 'attendance'" />
      
      <!-- 教学数据-课堂互动页面 -->
      <ClassroomInteraction v-if="activeSubTab === 'interaction'" />
      
      <!-- 教学数据-教学履历页面 -->
      <TeachingResume v-if="activeSubTab === 'resume'" />
    </div>
  </div>
</template>

<script setup>
import WorkloadQuantification from '@/components/data-center/teaching-data/WorkloadQuantification.vue'
import ClassManagement from '@/components/data-center/teaching-data/ClassManagement.vue'
import StudentManagement from '@/components/data-center/teaching-data/StudentManagement.vue'
import HomeworkManagement from '@/components/data-center/teaching-data/HomeworkManagement.vue'
import GradeManagement from '@/components/data-center/teaching-data/GradeManagement.vue'
import Attendance from '@/components/data-center/teaching-data/Attendance.vue'
import ClassroomInteraction from '@/components/data-center/teaching-data/ClassroomInteraction.vue'
import TeachingResume from '@/components/data-center/teaching-data/TeachingResume.vue'

defineProps({
  activeSubTab: {
    type: String,
    default: 'workload'
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
