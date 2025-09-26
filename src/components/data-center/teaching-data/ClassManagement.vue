<template>
  <div class="class-management">
    <!-- 切换按钮和列表 -->
    <div class="courses-section">
      <!-- 切换按钮 -->
      <div class="toggle-buttons">
        <button 
          :class="['toggle-btn', { 'active': viewMode === 'course' }]"
          @click="switchView('course')"
        >
          按课程
        </button>
        <button 
          :class="['toggle-btn', { 'active': viewMode === 'class' }]"
          @click="switchView('class')"
        >
          按班级
        </button>
      </div>

      <!-- 课程视图 - 按课程分组，每个课程下的班级单独显示 -->
      <div v-if="viewMode === 'course'" class="courses-table">
        <div class="table-header">
          <div class="header-cell">课程编码</div>
          <div class="header-cell">课程名称</div>
          <div class="header-cell">课程类型</div>
          <div class="header-cell">班级名称</div>
          <div class="header-cell">总学时</div>
          <div class="header-cell">总学分</div>
          <div class="header-cell">本学期进度</div>
          <div class="header-cell">操作</div>
        </div>
        <div class="table-body">
          <template v-for="course in coursesList" :key="course.id">
            <div v-for="className in course.classes" :key="`${course.id}-${className}`" class="table-row">
              <div class="table-cell">{{ course.code }}</div>
              <div class="table-cell">{{ course.name }}</div>
              <div class="table-cell">
                <span :class="['course-type', course.type.toLowerCase()]">{{ course.type }}</span>
              </div>
              <div class="table-cell class-name-cell">{{ className }}</div>
              <div class="table-cell">{{ course.totalHours }}</div>
              <div class="table-cell">{{ course.totalCredits }}</div>
              <div class="table-cell">
                <div class="progress-container">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: course.progress + '%' }"
                      :class="getProgressClass(course.progress)"
                    ></div>
                  </div>
                  <span class="progress-text">{{ course.progress }}%</span>
                </div>
              </div>
              <div class="table-cell">
                <div class="action-buttons">
                  <button 
                    class="action-btn homework-btn" 
                    @click="openSubMenu('homework', { ...course, className })"
                    title="作业管理"
                  >
                    作业
                  </button>
                  <button 
                    class="action-btn grade-btn" 
                    @click="openSubMenu('grade', { ...course, className })"
                    title="成绩管理"
                  >
                    成绩
                  </button>
                  <button 
                    class="action-btn attendance-btn" 
                    @click="openSubMenu('attendance', { ...course, className })"
                    title="出勤管理"
                  >
                    出勤
                  </button>
                  <button 
                    class="action-btn interaction-btn" 
                    @click="openSubMenu('interaction', { ...course, className })"
                    title="课堂互动"
                  >
                    互动
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
        
      <!-- 班级视图 -->
      <div v-else class="classes-table">
        <div class="table-header">
          <div class="header-cell">班级名称</div>
          <div class="header-cell">课程编码</div>
          <div class="header-cell">课程名称</div>
          <div class="header-cell">课程类型</div>
          <div class="header-cell">总学时</div>
          <div class="header-cell">总学分</div>
          <div class="header-cell">本学期进度</div>
          <div class="header-cell">操作</div>
        </div>
        <div class="table-body">
          <div v-for="classItem in classesList" :key="`${classItem.className}-${classItem.code}`" class="table-row">
            <div class="table-cell class-name-cell">{{ classItem.className }}</div>
            <div class="table-cell">{{ classItem.code }}</div>
            <div class="table-cell">{{ classItem.name }}</div>
            <div class="table-cell">
              <span :class="['course-type', classItem.type.toLowerCase()]">{{ classItem.type }}</span>
            </div>
            <div class="table-cell">{{ classItem.totalHours }}</div>
            <div class="table-cell">{{ classItem.totalCredits }}</div>
            <div class="table-cell">
              <div class="progress-container">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: classItem.progress + '%' }"
                    :class="getProgressClass(classItem.progress)"
                  ></div>
                </div>
                <span class="progress-text">{{ classItem.progress }}%</span>
              </div>
            </div>
            <div class="table-cell">
              <div class="action-buttons">
                <button 
                  class="action-btn homework-btn" 
                  @click="openSubMenu('homework', classItem)"
                  title="作业管理"
                >
                  作业
                </button>
                <button 
                  class="action-btn grade-btn" 
                  @click="openSubMenu('grade', classItem)"
                  title="成绩管理"
                >
                  成绩
                </button>
                <button 
                  class="action-btn attendance-btn" 
                  @click="openSubMenu('attendance', classItem)"
                  title="出勤管理"
                >
                  出勤
                </button>
                <button 
                  class="action-btn interaction-btn" 
                  @click="openSubMenu('interaction', classItem)"
                  title="课堂互动"
                >
                  互动
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 二级菜单弹窗 -->
    <div v-if="showSubMenu" class="submenu-overlay" @click="closeSubMenu">
      <div class="submenu-content" @click.stop>
        <div class="submenu-header">
          <h3>{{ subMenuTitle }}</h3>
          <button class="close-btn" @click="closeSubMenu">×</button>
        </div>
        <div class="submenu-body">
          <!-- 作业管理 -->
          <div v-if="currentSubMenu === 'homework'" class="submenu-section">
            <div class="section-title">作业管理 - {{ currentItem.name }} ({{ currentItem.className || '全部班级' }})</div>
            <div class="homework-content">
              <div class="homework-stats">
                <div class="stat-card">
                  <div class="stat-number">{{ homeworkStats.total }}</div>
                  <div class="stat-label">总作业数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ homeworkStats.submitted }}</div>
                  <div class="stat-label">已提交</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ homeworkStats.graded }}</div>
                  <div class="stat-label">已批改</div>
                </div>
              </div>
              <div class="homework-list">
                <div v-for="homework in homeworkList" :key="homework.id" class="homework-item">
                  <div class="homework-info">
                    <h4>{{ homework.title }}</h4>
                    <p>{{ homework.description }}</p>
                    <div class="homework-meta">
                      <span>截止时间：{{ homework.deadline }}</span>
                      <span>提交率：{{ homework.submitRate }}%</span>
                    </div>
                  </div>
                  <div class="homework-actions">
                    <button class="btn-primary">查看详情</button>
                    <button class="btn-secondary">批改作业</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 成绩管理 -->
          <div v-if="currentSubMenu === 'grade'" class="submenu-section">
            <div class="section-title">成绩管理 - {{ currentItem.name }} ({{ currentItem.className || '全部班级' }})</div>
            <div class="grade-content">
              <div class="grade-stats">
                <div class="stat-card">
                  <div class="stat-number">{{ gradeStats.average }}</div>
                  <div class="stat-label">平均分</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ gradeStats.highest }}</div>
                  <div class="stat-label">最高分</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ gradeStats.passRate }}</div>
                  <div class="stat-label">及格率</div>
                </div>
              </div>
              <div class="grade-chart">
                <div class="chart-placeholder">成绩分布图表</div>
              </div>
            </div>
          </div>
          
          <!-- 出勤管理 -->
          <div v-if="currentSubMenu === 'attendance'" class="submenu-section">
            <div class="section-title">出勤管理 - {{ currentItem.name }} ({{ currentItem.className || '全部班级' }})</div>
            <div class="attendance-content">
              <div class="attendance-stats">
                <div class="stat-card">
                  <div class="stat-number">{{ attendanceStats.total }}</div>
                  <div class="stat-label">总课时</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ attendanceStats.attended }}</div>
                  <div class="stat-label">已上课</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ attendanceStats.rate }}</div>
                  <div class="stat-label">出勤率</div>
                </div>
              </div>
              <div class="attendance-calendar">
                <div class="calendar-placeholder">出勤日历</div>
              </div>
            </div>
          </div>
          
          <!-- 课堂互动 -->
          <div v-if="currentSubMenu === 'interaction'" class="submenu-section">
            <div class="section-title">课堂互动 - {{ currentItem.name }} ({{ currentItem.className || '全部班级' }})</div>
            <div class="interaction-content">
              <div class="interaction-stats">
                <div class="stat-card">
                  <div class="stat-number">{{ interactionStats.questions }}</div>
                  <div class="stat-label">提问次数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ interactionStats.answers }}</div>
                  <div class="stat-label">回答次数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ interactionStats.participation }}</div>
                  <div class="stat-label">参与率</div>
                </div>
              </div>
              <div class="interaction-list">
                <div v-for="interaction in interactionList" :key="interaction.id" class="interaction-item">
                  <div class="interaction-info">
                    <h4>{{ interaction.title }}</h4>
                    <p>{{ interaction.content }}</p>
                    <div class="interaction-meta">
                      <span>时间：{{ interaction.time }}</span>
                      <span>参与人数：{{ interaction.participants }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 视图模式
const viewMode = ref('course')

// 二级菜单相关状态
const showSubMenu = ref(false)
const currentSubMenu = ref('')
const currentItem = ref({})

// 基础课程模板
const baseCourses = [
  {
    id: 1,
    code: 'CS101',
    name: '数据结构与算法',
    type: '理论课',
    classes: ['计算机21-1班', '计算机21-2班'],
    totalHours: 64,
    totalCredits: 4,
    progress: 75
  },
  {
    id: 2,
    code: 'CS102',
    name: '软件工程实践',
    type: '实践课',
    classes: ['计算机21-1班'],
    totalHours: 48,
    totalCredits: 3,
    progress: 60
  },
  {
    id: 3,
    code: 'CS103',
    name: '计算机网络实验',
    type: '实验课',
    classes: ['计算机21-2班', '计算机21-3班'],
    totalHours: 32,
    totalCredits: 2,
    progress: 45
  },
  {
    id: 4,
    code: 'CS104',
    name: '数据库原理',
    type: '理论课',
    classes: ['计算机21-1班', '计算机21-2班', '计算机21-3班'],
    totalHours: 48,
    totalCredits: 3,
    progress: 60
  },
  {
    id: 5,
    code: 'CS105',
    name: '操作系统原理',
    type: '理论课',
    classes: ['计算机21-1班', '计算机21-2班'],
    totalHours: 48,
    totalCredits: 3,
    progress: 60
  },
  {
    id: 6,
    code: 'CS106',
    name: '编译原理',
    type: '理论课',
    classes: ['计算机21-3班'],
    totalHours: 48,
    totalCredits: 3,
    progress: 60
  },
  {
    id: 7,
    code: 'CS107',
    name: '人工智能导论',
    type: '理论课',
    classes: ['计算机21-1班', '计算机21-2班', '计算机21-3班'],
    totalHours: 32,
    totalCredits: 2,
    progress: 45
  },
  {
    id: 8,
    code: 'CS108',
    name: '机器学习',
    type: '理论课',
    classes: ['计算机21-1班'],
    totalHours: 48,
    totalCredits: 3,
    progress: 60
  }
]

// 课程列表
const coursesList = computed(() => {
  return baseCourses
})

// 班级列表 - 将课程按班级展开
const classesList = computed(() => {
  const classItems = []
  
  baseCourses.forEach(course => {
    course.classes.forEach(className => {
      classItems.push({
        className: className,
        code: course.code,
        name: course.name,
        type: course.type,
        totalHours: course.totalHours,
        totalCredits: course.totalCredits,
        progress: course.progress
      })
    })
  })
  
  // 按班级名称排序
  return classItems.sort((a, b) => a.className.localeCompare(b.className))
})

// 二级菜单标题
const subMenuTitle = computed(() => {
  const titles = {
    homework: '作业管理',
    grade: '成绩管理',
    attendance: '出勤管理',
    interaction: '课堂互动'
  }
  return titles[currentSubMenu.value] || ''
})

// 模拟数据
const homeworkStats = ref({
  total: 12,
  submitted: 10,
  graded: 8
})

const homeworkList = ref([
  {
    id: 1,
    title: '数据结构作业1',
    description: '实现链表的基本操作',
    deadline: '2024-01-15',
    submitRate: 85
  },
  {
    id: 2,
    title: '算法设计作业',
    description: '设计排序算法',
    deadline: '2024-01-20',
    submitRate: 92
  }
])

const gradeStats = ref({
  average: 85.6,
  highest: 98,
  passRate: 92
})

const attendanceStats = ref({
  total: 32,
  attended: 28,
  rate: 87.5
})

const interactionStats = ref({
  questions: 45,
  answers: 38,
  participation: 84.4
})

const interactionList = ref([
  {
    id: 1,
    title: '课堂讨论：算法复杂度',
    content: '讨论不同排序算法的时间复杂度',
    time: '2024-01-10 14:00',
    participants: 25
  },
  {
    id: 2,
    title: '小组活动：数据结构设计',
    content: '设计一个高效的数据结构',
    time: '2024-01-12 16:00',
    participants: 30
  }
])

// 切换视图模式
const switchView = (mode) => {
  viewMode.value = mode
}

// 打开二级菜单
const openSubMenu = (menuType, item) => {
  currentSubMenu.value = menuType
  currentItem.value = item
  showSubMenu.value = true
}

// 关闭二级菜单
const closeSubMenu = () => {
  showSubMenu.value = false
  currentSubMenu.value = ''
  currentItem.value = {}
}

// 获取进度条样式类
const getProgressClass = (progress) => {
  if (progress >= 80) return "progress-high"
  if (progress >= 60) return "progress-medium"
  if (progress >= 40) return "progress-low"
  return "progress-very-low"
}
</script>

<style scoped>
.class-management {
  padding: 20px;
  background: #f5f7fa;
  width: 100%;
}

/* 切换按钮和列表 */
.courses-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 切换按钮样式 */
.toggle-buttons {
  display: flex;
  flex-direction: row-reverse;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.toggle-btn {
  padding: 4px 10px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.toggle-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
  background: #f0f8ff;
}

.toggle-btn.active {
  background: #1677ff;
  border-color: #1677ff;
  color: white;
}

.toggle-btn.active:hover {
  background: #4096ff;
  border-color: #4096ff;
}

.courses-table,
.classes-table {
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 100px 1fr 100px 100px 100px 100px 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 2px solid #f0f0f0;
  font-weight: 600;
  color: #333;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 100px 1fr 100px 100px 100px 100px 1fr 1fr;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-cell {
  font-size: 14px;
  color: #333;
}

.class-name-cell {
  font-weight: 600;
  color: #1677ff;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
  white-space: nowrap;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.homework-btn:hover {
  border-color: #52c41a;
  color: #52c41a;
  background: #f6ffed;
}

.grade-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
  background: #e6f7ff;
}

.attendance-btn:hover {
  border-color: #fa8c16;
  color: #fa8c16;
  background: #fff7e6;
}

.interaction-btn:hover {
  border-color: #722ed1;
  color: #722ed1;
  background: #f9f0ff;
}

.course-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.course-type.理论课 {
  background: #e6f7ff;
  color: #1677ff;
}

.course-type.实践课 {
  background: #fff7e6;
  color: #fa8c16;
}

.course-type.实验课 {
  background: #f6ffed;
  color: #52c41a;
}

.class-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.class-tag {
  background: #f0f0f0;
  color: #666;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

/* 进度条样式 */
.progress-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.progress-high {
  background: #52c41a;
}

.progress-fill.progress-medium {
  background: #1677ff;
}

.progress-fill.progress-low {
  background: #fa8c16;
}

.progress-fill.progress-very-low {
  background: #ff4d4f;
}

.progress-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  min-width: 35px;
}

/* 二级菜单弹窗样式 */
.submenu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.submenu-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.submenu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.submenu-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #666;
}

.submenu-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1677ff;
}

/* 统计卡片样式 */
.homework-stats,
.grade-stats,
.attendance-stats,
.interaction-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

/* 内容区域样式 */
.homework-list,
.interaction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.homework-item,
.interaction-item {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.homework-info h4,
.interaction-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.homework-info p,
.interaction-info p {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #666;
}

.homework-meta,
.interaction-meta {
  display: flex;
  gap: 16px;
  font-size: 11px;
  color: #999;
}

.homework-actions {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-secondary {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.btn-primary {
  background: #1677ff;
  color: white;
  border-color: #1677ff;
}

.btn-primary:hover {
  background: #4096ff;
  border-color: #4096ff;
}

.btn-secondary {
  background: white;
  color: #666;
}

.btn-secondary:hover {
  border-color: #1677ff;
  color: #1677ff;
}

.grade-chart,
.attendance-calendar {
  background: #f8f9fa;
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  color: #666;
  border: 1px solid #e9ecef;
}

.chart-placeholder,
.calendar-placeholder {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toggle-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .toggle-btn {
    width: 100%;
    text-align: center;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 100px 1fr 80px 100px 60px 60px 120px 150px;
    gap: 8px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 2px;
  }
  
  .action-btn {
    font-size: 10px;
    padding: 2px 6px;
  }
  
  .submenu-content {
    width: 95%;
    margin: 10px;
  }
  
  .homework-stats,
  .grade-stats,
  .attendance-stats,
  .interaction-stats {
    grid-template-columns: 1fr;
  }
  
  .homework-item,
  .interaction-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .homework-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
