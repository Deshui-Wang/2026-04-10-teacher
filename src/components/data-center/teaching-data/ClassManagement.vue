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
      <div 
        v-if="viewMode === 'course'" 
        class="courses-table"
        :class="{ 'dragging': isDragging }"
        @mousedown="handleMouseDown"
      >
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
            <div 
              v-for="className in course.classes" 
              :key="`${course.id}-${className}`" 
              class="table-row"
              draggable="true"
              @dragstart="handleDragStart({ ...course, className }, $event)"
              @dragend="handleDragEnd"
            >
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
                    class="action-btn student-btn" 
                    @click="navigateToStudent({ ...course, className })"
                    title="跳转到学生管理"
                  >
                    学生
                  </button>
                  <button 
                    class="action-btn homework-btn" 
                    @click="navigateToHomework({ ...course, className })"
                    title="跳转到作业管理"
                  >
                    作业
                  </button>
                  <button 
                    class="action-btn grade-btn" 
                    @click="navigateToGrade({ ...course, className })"
                    title="跳转到成绩管理"
                  >
                    成绩
                  </button>
                  <button 
                    class="action-btn attendance-btn" 
                    @click="navigateToAttendance({ ...course, className })"
                    title="跳转到出勤管理"
                  >
                    出勤
                  </button>
                  <button 
                    class="action-btn interaction-btn" 
                    @click="navigateToInteraction({ ...course, className })"
                    title="跳转到课堂互动"
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
      <div 
        v-else 
        class="classes-table"
        :class="{ 'dragging': isDragging }"
        @mousedown="handleMouseDown"
      >
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
          <div 
            v-for="classItem in classesList" 
            :key="`${classItem.className}-${classItem.code}`" 
            class="table-row"
            draggable="true"
            @dragstart="handleDragStart(classItem, $event)"
            @dragend="handleDragEnd"
          >
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
                  class="action-btn student-btn" 
                  @click="navigateToStudent(classItem)"
                  title="跳转到学生管理"
                >
                  学生
                </button>
                <button 
                  class="action-btn homework-btn" 
                  @click="navigateToHomework(classItem)"
                  title="跳转到作业管理"
                >
                  作业
                </button>
                <button 
                  class="action-btn grade-btn" 
                  @click="navigateToGrade(classItem)"
                  title="跳转到成绩管理"
                >
                  成绩
                </button>
                <button 
                  class="action-btn attendance-btn" 
                  @click="navigateToAttendance(classItem)"
                  title="跳转到出勤管理"
                >
                  出勤
                </button>
                <button 
                  class="action-btn interaction-btn" 
                  @click="navigateToInteraction(classItem)"
                  title="跳转到课堂互动"
                >
                  互动
                </button>
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

// 定义 emits
const emit = defineEmits([
  'navigate-to-student',
  'navigate-to-homework',
  'navigate-to-grade', 
  'navigate-to-attendance',
  'navigate-to-interaction'
])

// 拖拽相关状态
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const scrollStartX = ref(0)
const scrollStartY = ref(0)

// 视图模式
const viewMode = ref('course')

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

// 切换视图模式
const switchView = (mode) => {
  viewMode.value = mode
}

// 跳转到学生管理页面
const navigateToStudent = (item) => {
  emit('navigate-to-student', {
    courseCode: item.code,
    courseName: item.name,
    className: item.className,
    courseType: item.type
  })
}

// 跳转到作业管理页面
const navigateToHomework = (item) => {
  emit('navigate-to-homework', {
    courseCode: item.code,
    courseName: item.name,
    className: item.className,
    courseType: item.type
  })
}

// 跳转到成绩管理页面
const navigateToGrade = (item) => {
  emit('navigate-to-grade', {
    courseCode: item.code,
    courseName: item.name,
    className: item.className,
    courseType: item.type
  })
}

// 跳转到出勤管理页面
const navigateToAttendance = (item) => {
  emit('navigate-to-attendance', {
    courseCode: item.code,
    courseName: item.name,
    className: item.className,
    courseType: item.type
  })
}

// 跳转到课堂互动页面
const navigateToInteraction = (item) => {
  emit('navigate-to-interaction', {
    courseCode: item.code,
    courseName: item.name,
    className: item.className,
    courseType: item.type
  })
}

// 获取进度条样式类
const getProgressClass = (progress) => {
  if (progress >= 80) return "progress-high"
  if (progress >= 60) return "progress-medium"
  if (progress >= 40) return "progress-low"
  return "progress-very-low"
}

// HTML5 拖拽到小智人对话框的方法
const handleDragStart = (item, event) => {
  console.log('开始拖拽班课:', item.name, item.className)
  
  // 设置拖拽数据
  const dragData = {
    type: 'class',
    id: item.id,
    code: item.code,
    name: item.name,
    className: item.className,
    courseType: item.type,
    totalHours: item.totalHours,
    totalCredits: item.totalCredits,
    progress: item.progress
  }
  
  event.dataTransfer.setData('application/json', JSON.stringify(dragData))
  event.dataTransfer.effectAllowed = 'copy'
  
  // 设置拖拽时的样式
  event.target.style.opacity = '0.5'
}

const handleDragEnd = (event) => {
  // 恢复样式
  event.target.style.opacity = '1'
  console.log('拖拽结束')
}

// 鼠标拖拽滚动相关方法
const handleMouseDown = (e) => {
  // 检查是否点击在可拖拽的行上 - 如果是，不启用滚动拖拽
  const target = e.target
  const row = target.closest('.table-row')
  if (row) {
    // 点击在行上，不启用滚动拖拽，让 HTML5 draggable 接管
    return
  }
  
  // 检查是否点击在可交互元素上
  if (target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.tagName === 'INPUT' ||
      target.closest('input') ||
      target.classList.contains('action-buttons') ||
      target.closest('.action-buttons')) {
    return
  }

  const container = e.currentTarget
  console.log('Mouse down on container:', container.className)
  console.log('Container scroll:', container.scrollLeft, container.scrollTop)
  
  isDragging.value = true
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  scrollStartX.value = container.scrollLeft
  scrollStartY.value = container.scrollTop
  
  // 添加全局鼠标移动和释放监听器
  document.addEventListener('mousemove', handleMouseMove, { passive: false })
  document.addEventListener('mouseup', handleMouseUp)
  
  // 防止文本选择和默认行为
  e.preventDefault()
  e.stopPropagation()
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  
  const deltaX = dragStartX.value - e.clientX
  const deltaY = dragStartY.value - e.clientY
  
  console.log('Moving:', deltaX, deltaY)
  
  // 获取当前激活的容器元素
  const container = viewMode.value === 'course' 
    ? document.querySelector('.courses-table') 
    : document.querySelector('.classes-table')
  
  if (!container) {
    console.log('Container not found!')
    return
  }
  
  // 更新滚动位置
  const newScrollLeft = scrollStartX.value + deltaX
  const newScrollTop = scrollStartY.value + deltaY
  
  console.log('Setting scroll to:', newScrollLeft, newScrollTop)
  
  container.scrollLeft = newScrollLeft
  container.scrollTop = newScrollTop
  
  // 防止默认行为
  e.preventDefault()
}

const handleMouseUp = () => {
  console.log('Mouse up')
  isDragging.value = false
  
  // 移除全局监听器
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
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
  overflow-y: auto;
  max-height: 600px;
  cursor: grab;
  user-select: none;
  transition: cursor 0.2s;
}

.courses-table.dragging,
.classes-table.dragging {
  cursor: grabbing;
}

.table-header {
  display: grid;
  grid-template-columns: 100px 200px 100px 150px 100px 100px 200px 350px;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 2px solid #f0f0f0;
  font-weight: 600;
  color: #333;
  min-width: 1200px;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 100px 200px 100px 150px 100px 100px 200px 350px;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  min-width: 1200px;
  cursor: grab;
  transition: all 0.2s;
}

.table-row:active {
  cursor: grabbing;
}

.table-row:hover {
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

.student-btn:hover {
  border-color: #13c2c2;
  color: #13c2c2;
  background: #e6fffb;
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
}
</style>
