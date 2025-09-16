<template>
  <div class="semester-plan">
    <!-- 第一部分：日历和当日课程 -->
    <div class="calendar-section">
      <div class="calendar-container">
        <div class="calendar-header">
          <div class="calendar-title">
            <h3>{{ currentYear }}年{{ currentMonth }}月</h3>
            <div class="year-month-nav">
              <button @click="previousYear" class="nav-btn year-btn" title="上一年">‹‹</button>
              <button @click="previousMonth" class="nav-btn" title="上一月">‹</button>
              <button @click="nextMonth" class="nav-btn" title="下一月">›</button>
              <button @click="nextYear" class="nav-btn year-btn" title="下一年">››</button>
            </div>
          </div>
          <div class="quick-actions">
            <button @click="goToToday" class="today-btn">今天</button>
            <button @click="showYearPicker = !showYearPicker" class="year-picker-btn">
              {{ currentYear }}年
            </button>
            <div v-if="showYearPicker" class="year-picker">
              <div class="year-picker-header">
                <span>选择年份</span>
                <button @click="showYearPicker = false" class="close-btn">×</button>
              </div>
              <div class="year-list">
                <div 
                  v-for="year in availableYears" 
                  :key="year"
                  :class="['year-item', { 'active': year === currentYear }]"
                  @click="selectYear(year)"
                >
                  {{ year }}年
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="calendar-grid">
          <div class="calendar-weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
          </div>
          <div class="calendar-days">
            <div 
              v-for="day in calendarDays" 
              :key="day.date" 
              :class="['calendar-day', { 
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'selected': day.date === selectedDate,
                'has-courses': day.courseCount > 0
              }]"
              @click="selectDate(day.date)"
            >
              <span class="day-number">{{ day.day }}</span>
              <span v-if="day.courseCount > 0" class="course-count">{{ day.courseCount }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="daily-courses">
        <div class="daily-courses-header">
          <h3>{{ selectedDateFormatted }} 课程安排</h3>
          <div class="course-count-badge" v-if="dailyCourses.length > 0">
            共 {{ dailyCourses.length }} 节课
          </div>
        </div>
        <div class="courses-list">
          <div v-if="dailyCourses.length === 0" class="no-courses">
            <div class="no-courses-icon">📅</div>
            <p>暂无课程安排</p>
          </div>
          <div v-else>
            <div v-for="(course, index) in dailyCourses" :key="course.id" class="course-item">
              <div class="course-time">
                <div class="time-slot">{{ course.timeSlot }}</div>
              </div>
              <div class="course-info">
                <div class="info-top">
                  <div class="title-line">
                    <span class="course-name">{{ course.name }}</span>
                    <span class="course-code">（{{ course.code }}）</span>
                  </div>
                  <div class="type-badge">
                    <span class="course-type-badge" :class="course.type.toLowerCase()">{{ course.type }}</span>
                  </div>
                </div>
                <div class="info-bottom">
                  <span class="class-name">{{ course.className }}</span>
                  <span class="classroom">{{ course.classroom }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第二部分：课程统计和列表 -->
    <div class="courses-section">
      <div class="course-stats">
        <div class="stat-item">
          <div class="stat-number">{{ courseStats.total }}</div>
          <div class="stat-label">全部课程</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ courseStats.theory }}</div>
          <div class="stat-label">理论课</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ courseStats.practice }}</div>
          <div class="stat-label">实践课</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ courseStats.experiment }}</div>
          <div class="stat-label">实验课</div>
        </div>
      </div>

      <div class="courses-table">
        <div class="table-header">
          <div class="header-cell">课程编码</div>
          <div class="header-cell">课程名称</div>
          <div class="header-cell">课程类型</div>
          <div class="header-cell">授课班级</div>
          <div class="header-cell">总学时</div>
          <div class="header-cell">总学分</div>
          <div class="header-cell">本学期进度</div>
        </div>
        <div class="table-body">
          <div v-for="course in coursesList" :key="course.id" class="table-row">
            <div class="table-cell">{{ course.code }}</div>
            <div class="table-cell">{{ course.name }}</div>
            <div class="table-cell">
              <span :class="['course-type', course.type.toLowerCase()]">{{ course.type }}</span>
            </div>
            <div class="table-cell">
              <div class="class-tags">
                <span v-for="className in course.classes" :key="className" class="class-tag">
                  {{ className }}
                </span>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Local date helpers to avoid UTC shift when using ISO strings
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseLocalDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// 响应式数据
const currentDate = ref(new Date())
const selectedDate = ref(formatDate(new Date()))
const showYearPicker = ref(false)

// 星期数组
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 时间槽配置
const timeSlots = [
  { start: '08:00', end: '09:40', period: 1 },
  { start: '10:00', end: '11:40', period: 2 },
  { start: '14:00', end: '15:40', period: 3 },
  { start: '16:00', end: '17:40', period: 4 },
  { start: '19:00', end: '20:40', period: 5 }
]

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

// 教室配置
const classrooms = ['主楼101', '主楼102', '实验楼103', '教学二楼104', '教学二楼201', '实验楼202', '主楼203', '主楼301', '主楼302', '主楼303', '实验室401', '机房402']

// 生成指定日期的课程安排（轮询使用基础课程数据）
const generateCoursesForDate = (dateStr) => {
  const date = parseLocalDate(dateStr)
  const dayOfWeek = date.getDay()
  
  // 只安排周一到周五的课程
  if (dayOfWeek < 1 || dayOfWeek > 5) {
    return []
  }
  
  // 使用日期作为随机种子，确保同一天的数据一致
  const seed = date.getTime()
  
  // 修复随机数生成函数
  const random = (seedValue) => {
    const x = Math.sin(seedValue) * 10000
    return x - Math.floor(x)
  }
  
  // 每天随机安排2-5节课
  const courseCount = Math.floor(random(seed) * 4) + 2 // 2-5节课
  const usedTimeSlots = new Set()
  const courses = []
  
  for (let i = 0; i < courseCount; i++) {
    // 随机选择时间槽
    let timeSlotIndex
    let attempts = 0
    do {
      timeSlotIndex = Math.floor(random(seed + i + attempts) * timeSlots.length)
      attempts++
      // 防止无限循环
      if (attempts > 10) {
        timeSlotIndex = i % timeSlots.length
        break
      }
    } while (usedTimeSlots.has(timeSlotIndex))
    usedTimeSlots.add(timeSlotIndex)
    
    const timeSlot = timeSlots[timeSlotIndex]
    const courseIndex = Math.floor(random(seed + i + 100) * baseCourses.length)
    const course = baseCourses[courseIndex]
    const className = course.classes[Math.floor(random(seed + i + 200) * course.classes.length)]
    const classroom = classrooms[Math.floor(random(seed + i + 300) * classrooms.length)]
    
    courses.push({
      id: `${course.id}-${dateStr}-${i}`,
      name: course.name,
      code: course.code,
      type: course.type,
      className: className,
      classroom: classroom,
      timeSlot: `${timeSlot.start}-${timeSlot.end}`,
      period: timeSlot.period,
      totalHours: course.totalHours,
      totalCredits: course.totalCredits,
      classes: course.classes
    })
  }
  
  return courses.sort((a, b) => a.period - b.period)
}

// 模拟课程数据（使用轮询方式）
const mockCourses = ref([])

// 计算当前年份和月份
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)

// 可用年份列表
const availableYears = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  for (let year = currentYear - 2; year <= currentYear + 2; year++) {
    years.push(year)
  }
  return years
})

// 计算日历天数
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // 获取第一天是星期几
  const firstDayWeek = firstDay.getDay()
  
  // 获取上个月最后几天
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  const days = []
  
  // 添加上个月的末尾几天
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(year, month - 1, day)
    const dateStr = formatDate(date)
    days.push({
      day,
      date: dateStr,
      isCurrentMonth: false,
      isToday: false,
      courseCount: getCourseCountForDate(dateStr)
    })
  }
  
  // 添加当月的所有天
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    const dateStr = formatDate(date)
    const today = new Date()
    const isToday = dateStr === formatDate(today)
    
    days.push({
      day,
      date: dateStr,
      isCurrentMonth: true,
      isToday,
      courseCount: getCourseCountForDate(dateStr)
    })
  }
  
  // 添加下个月的前几天，使日历完整
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    const dateStr = formatDate(date)
    days.push({
      day,
      date: dateStr,
      isCurrentMonth: false,
      isToday: false,
      courseCount: getCourseCountForDate(dateStr)
    })
  }
  return days
})

// 获取指定日期的课程数量
const getCourseCountForDate = (date) => {
  const courses = generateCoursesForDate(date)
  return courses.length
}

// 选中日期
const selectDate = (date) => {
  selectedDate.value = date
}

// 格式化选中日期
const selectedDateFormatted = computed(() => {
  const date = parseLocalDate(selectedDate.value)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[date.getDay()]
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekday}`
})

// 获取选中日期的课程
const dailyCourses = computed(() => {
  return generateCoursesForDate(selectedDate.value)
})

// 课程统计
const courseStats = computed(() => {
  const stats = {
    total: baseCourses.length,
    theory: 0,
    practice: 0,
    experiment: 0
  }
  
  baseCourses.forEach(course => {
    switch (course.type) {
      case '理论课':
        stats.theory++
        break
      case '实践课':
        stats.practice++
        break
      case '实验课':
        stats.experiment++
        break
    }
  })
  
  return stats
})

// 课程列表
const coursesList = computed(() => {
  return baseCourses
})

// 获取进度条样式类
const getProgressClass = (progress) => {
  if (progress >= 80) return "progress-high"
  if (progress >= 60) return "progress-medium"
  if (progress >= 40) return "progress-low"
  return "progress-very-low"
}

// 年份选择
const selectYear = (year) => {
  currentDate.value = new Date(year, currentDate.value.getMonth(), 1)
  showYearPicker.value = false
}

// 月份导航
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

// 年份导航
const previousYear = () => {
  currentDate.value = new Date(currentDate.value.getFullYear() - 1, currentDate.value.getMonth(), 1)
}

const nextYear = () => {
  currentDate.value = new Date(currentDate.value.getFullYear() + 1, currentDate.value.getMonth(), 1)
}

// 回到今天
const goToToday = () => {
  const today = new Date()
  currentDate.value = new Date(today.getFullYear(), today.getMonth(), 1)
  selectedDate.value = formatDate(today)
}

onMounted(() => {
  // 初始化时选中今天
  selectedDate.value = formatDate(new Date())
})
</script>
<style scoped>
.semester-plan {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
  width: 100%;
}

/* 第一部分：日历和当日课程 */
.calendar-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.calendar-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
}

.calendar-title {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.calendar-title h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.year-month-nav {
  display: flex;
  gap: 8px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #666;
  transition: all 0.2s;
}

.nav-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
  background: #f0f8ff;
}

.year-btn {
  font-size: 14px;
  font-weight: 600;
}

.quick-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.today-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.today-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
  background: #f0f8ff;
}

.year-picker-btn {
  padding: 6px 12px;
  border: 1px solid #1677ff;
  background: #1677ff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.year-picker-btn:hover {
  background: #4096ff;
  border-color: #4096ff;
}

.year-picker {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  margin-top: 8px;
}

.year-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.year-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px 0;
}

.year-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #666;
}

.year-item:hover {
  background: #f0f8ff;
  color: #1677ff;
}

.year-item.active {
  background: #1677ff;
  color: white;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
}

.weekday {
  text-align: center;
  padding: 8px;
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  position: relative;
  transition: all 0.2s;
  min-height: 40px;
}

.calendar-day:hover {
  background: #f0f0f0;
}

.calendar-day.other-month {
  color: #ccc;
}

.calendar-day.today {
  background: #e6f7ff;
  color: #1677ff;
  font-weight: 600;
}

.calendar-day.selected {
  background: #1677ff;
  color: white;
}

.calendar-day.has-courses {
  font-weight: 600;
}

.calendar-day.has-courses:not(.selected) {
  background: #fff7e6;
  color: #fa8c16;
}

.day-number {
  font-size: 16px;
}

.course-count {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ff4d4f;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.daily-courses {
  background: white;
  border-radius: 12px;
  padding: 16px; /* 紧凑化 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.daily-courses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px; /* 紧凑化 */
}

.daily-courses-header h3 {
  margin: 0;
  font-size: 16px; /* 稍微缩小 */
  color: #333;
}

.course-count-badge {
  background: #1677ff;
  color: white;
  padding: 2px 8px; /* 紧凑化 */
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.courses-list {
  max-height: 500px;
  overflow-y: auto;
}

.no-courses {
  text-align: center;
  color: #999;
  padding: 32px 0; /* 紧凑化 */
}

.no-courses-icon {
  font-size: 40px; /* 紧凑化 */
  margin-bottom: 12px; /* 紧凑化 */
}

.no-courses p {
  margin: 0;
  font-size: 14px; /* 紧凑化 */
}

.course-item {
  display: flex;
  gap: 20px; /* 紧凑化 */
  padding: 12px; /* 紧凑化 */
  border: 1px solid #f0f0f0; 
  border-radius: 8px;
  margin-bottom: 12px; /* 紧凑化 */
  transition: all 0.2s;
  background: #f8f9fa;
}

.course-item:hover {
  border-color: #1677ff;
  box-shadow: 0 1px 4px rgba(22, 119, 255, 0.15); /* 更轻的悬浮效果 */
}

.course-item:last-child {
  margin-bottom: 0;
}

.course-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 110px; /* 左侧时间块更宽 */
  padding: 10px;
  background: #fff;
  border-radius: 8px;
}

.time-slot {
  font-size: 16px; /* 突出时间 */
  color: #1677ff;
  font-weight: 600;
}


.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-top {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
}

.title-line {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}

.course-name {
  font-weight: 600;
  color: #333;
  font-size: 14px; /* 紧凑化 */
}

.course-code {
  font-size: 13px;
  color: #9aa0a6;
}

.type-badge {
  justify-self: end;
}

.info-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.class-name {
  color: #1677ff;
  font-weight: 500;
}

.classroom {
  color: #52c41a;
  font-weight: 600;
}

.class-name {
  color: #1677ff;
  font-weight: 500;
}

.classroom {
  color: #52c41a;
  font-weight: 500;
}

.course-type-badge {
  display: inline-block;
  padding: 4px 10px; /* pill */
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.course-type-badge.理论课 {
  background: #e6f2ff;
  color: #1677ff;
}

.course-type-badge.实践课 {
  background: #fff4e6;
  color: #fa8c16;
}

.course-type-badge.实验课 {
  background: #effbea;
  color: #52c41a;
}

/* 第二部分：课程统计和列表 */
.courses-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 32px;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.courses-table {
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 120px 1fr 100px 150px 80px 80px 140px;
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
  grid-template-columns: 120px 1fr 100px 150px 80px 80px 140px;
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

.class-tag {
  background: #f0f0f0;
  color: #666;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .calendar-section {
    grid-template-columns: 1fr;
  }
  
  .calendar-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .quick-actions {
    justify-content: center;
  }
  
  .year-picker {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .course-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 100px 1fr 80px 120px 60px 60px 120px;
    gap: 8px;
  }
  
  .course-item {
    flex-direction: column;
    gap: 10px; /* 紧凑化 */
  }
  
  .course-time {
    flex-direction: row;
    justify-content: space-between;
    min-width: auto;
  }
}
</style> 