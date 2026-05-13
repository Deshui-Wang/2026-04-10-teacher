<template>
  <div class="course-dashboard animate__animated animate__fadeIn">
    <!-- 顶部课程页签 -->
    <div class="course-tabs-container">
      <el-tabs v-model="activeCourseId" class="custom-course-tabs">
        <el-tab-pane 
          v-for="course in courses" 
          :key="course.id" 
          :label="course.name" 
          :name="course.id"
        >
          <template #label>
            <div class="tab-label-wrapper">
              <span class="course-name-text">{{ course.name }}</span>
              <el-tag size="small" effect="plain" round class="course-code-tag">{{ course.code }}</el-tag>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 班级列表 -->
    <div class="class-list-container">
      <div class="section-header">
        <h3 class="class-title">{{ activeCourseName }} - 授课班级 <span>({{ currentClasses.length }})</span></h3>
        <div class="view-actions">
          <el-button type="primary" size="small" plain icon="el-icon-refresh">同步数据</el-button>
        </div>
      </div>

      <div class="class-cards">
        <div 
          v-for="(cls, index) in currentClasses" 
          :key="cls.id" 
          class="class-item-bar animate__animated animate__fadeInUp"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <div class="class-info-main">
            <div class="class-icon">
              <i class="el-icon-school"></i>
            </div>
            <div class="class-meta">
              <div class="class-name">{{ cls.name }}</div>
              <div class="class-stats-brief">
                <span class="stat-tag"><i class="el-icon-user"></i> {{ cls.studentCount }} 人</span>
              </div>
            </div>
          </div>

          <div class="metrics-grid">
            <!-- 作业完成率 -->
            <div class="metric-item">
              <div class="metric-label">作业完成率</div>
              <div class="metric-progress">
                <el-progress :percentage="cls.homeworkRate" :color="getMetricColor(cls.homeworkRate)" :stroke-width="8" />
              </div>
            </div>

            <!-- 平均成绩 -->
            <div class="metric-item">
              <div class="metric-label">平均成绩</div>
              <div class="metric-value-box">
                <span class="value-num">{{ cls.avgScore }}</span>
                <span class="value-unit">分</span>
              </div>
            </div>

            <!-- 出勤率 -->
            <div class="metric-item">
              <div class="metric-label">出勤率</div>
              <div class="metric-value-box">
                <span class="value-num">{{ cls.attendanceRate }}</span>
                <span class="value-unit">%</span>
              </div>
            </div>

            <!-- 课堂互动率 -->
            <div class="metric-item">
              <div class="metric-label">课堂互动率</div>
              <div class="metric-progress">
                <el-progress :percentage="cls.interactionRate" :color="getMetricColor(cls.interactionRate)" :stroke-width="8" />
              </div>
            </div>
          </div>

          <div class="item-actions">
            <el-button type="primary" size="small" plain @click="openStudentList(cls.name)">班级管理</el-button>
            <el-button type="warning" size="small" icon="el-icon-data-analysis" circle title="查看分析"></el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 班级管理侧滑抽屉 -->
    <el-drawer
      v-model="studentDrawerVisible"
      :title="'班级管理 - ' + selectedClassName"
      size="85%"
      direction="rtl"
      custom-class="class-manage-drawer"
      :destroy-on-close="true"
    >
      <div class="drawer-content-wrapper">
        <StudentManagement />
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StudentManagement from './StudentManagement.vue'

const activeCourseId = ref('1')
const studentDrawerVisible = ref(false)
const selectedClassName = ref('')

const openStudentList = (className) => {
  selectedClassName.value = className
  studentDrawerVisible.value = true
}

const courses = ref([
  { id: '1', name: '法律基础与AI法治', code: 'LAW101' },
  { id: '2', name: '人工智能导论', code: 'AI-INTRO' },
  { id: '3', name: '数据结构与算法', code: 'CS201' }
])

const classData = ref({
  '1': [
    { id: 'c1-1', name: '法律21级01班', studentCount: 45, homeworkRate: 92, avgScore: 88.5, attendanceRate: 98, interactionRate: 85 },
    { id: 'c1-2', name: '法律21级02班', studentCount: 42, homeworkRate: 85, avgScore: 82.3, attendanceRate: 95, interactionRate: 78 },
    { id: 'c1-3', name: '法律22级(双学位)班', studentCount: 38, homeworkRate: 95, avgScore: 91.0, attendanceRate: 99, interactionRate: 92 }
  ],
  '2': [
    { id: 'c2-1', name: '计科22级人工智能班', studentCount: 50, homeworkRate: 88, avgScore: 84.5, attendanceRate: 94, interactionRate: 80 },
    { id: 'c2-2', name: '软工22级A班', studentCount: 48, homeworkRate: 76, avgScore: 78.2, attendanceRate: 90, interactionRate: 65 }
  ],
  '3': [
    { id: 'c3-1', name: '计科23级强化班', studentCount: 35, homeworkRate: 98, avgScore: 94.2, attendanceRate: 100, interactionRate: 95 },
    { id: 'c3-2', name: '全校公选03班', studentCount: 120, homeworkRate: 65, avgScore: 72.5, attendanceRate: 82, interactionRate: 40 }
  ]
})

const activeCourseName = computed(() => {
  return courses.value.find(c => c.id === activeCourseId.value)?.name || ''
})

const currentClasses = computed(() => {
  return classData.value[activeCourseId.value] || []
})

const getMetricColor = (val) => {
  if (val >= 90) return '#10b981'
  if (val >= 75) return '#3b82f6'
  if (val >= 60) return '#f59e0b'
  return '#ef4444'
}
</script>

<style scoped>
.course-dashboard {
  padding: 0;
}

.course-tabs-container {
  background: white;
  padding: 0 24px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  margin-bottom: 24px;
}

.tab-label-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.course-name-text {
  font-weight: 700;
  font-size: 15px;
}

.course-code-tag {
  font-size: 11px;
  border-color: #e2e8f0;
}

.class-list-container {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  min-height: 500px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f1f5f9;
}

.class-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.class-title span {
  color: #94a3b8;
  font-size: 14px;
  font-weight: 400;
  margin-left: 8px;
}

.class-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.class-item-bar {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation-delay: var(--delay);
}

.class-item-bar:hover {
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.08);
  transform: translateX(8px);
}

.class-info-main {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 200px;
}

.class-icon {
  width: 44px;
  height: 44px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.class-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.class-stats-brief {
  font-size: 12px;
  color: #94a3b8;
}

.metrics-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 180px 100px 100px 180px;
  gap: 40px;
  padding: 0 40px;
  align-items: center;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-label {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value-box {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.value-num {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
}

.value-unit {
  font-size: 11px;
  color: #94a3b8;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 覆盖 Element Tabs 样式使其更精致 */
:deep(.el-tabs__nav-wrap::after) {
  display: none;
}
:deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
}
:deep(.el-tabs__item) {
  height: 60px;
  display: flex;
  align-items: center;
}
</style>
