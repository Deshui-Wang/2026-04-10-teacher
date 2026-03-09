<template>
  <div class="workload-quantification">
    <!-- 标题和按钮行 -->
    <div class="title-section">
      <h3 class="module-title">本周平均工作量：8.9小时/周（ 💛 工作量偏大，注意休息）</h3>
      <el-button type="primary" plain class="calendar-btn" @click="openDrawerCalendar">
        <el-icon><Calendar /></el-icon> 日历
      </el-button>
    </div>
    
    <!-- 第一部分：日历和当日课程 -->
    <div class="calendar-section">
      <div class="calendar-container">
        <div class="calendar-header">
          <div class="calendar-title">
            <h3>{{ currentWeekFormatted }}</h3>
            <div class="week-nav">
              <button @click="previousWeek" class="nav-btn" title="上一周">‹</button>
              <button @click="nextWeek" class="nav-btn" title="下一周">›</button>
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
              v-for="day in weekDays" 
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
            <div class="no-courses-icon"></div>
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

    <!-- 筛选行 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>课程：</label>
          <el-select 
            v-model="selectedCourse" 
            placeholder="全部课程" 
            clearable 
            @change="handleFilterChange"
            class="course-select"
          >
            <el-option label="全部课程" value="" />
            <el-option v-for="course in courseOptions" :key="course.value" :label="course.label" :value="course.value" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>类型：</label>
          <el-select 
            v-model="selectedType" 
            placeholder="全部类型" 
            clearable 
            @change="handleFilterChange"
            class="type-select"
          >
            <el-option label="全部类型" value="" />
            <el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>学期：</label>
          <el-select 
            v-model="selectedSemester" 
            placeholder="全部学期" 
            clearable 
            @change="handleFilterChange"
            class="semester-select"
          >
            <el-option label="全部学期" value="" />
            <el-option v-for="semester in semesterOptions" :key="semester.value" :label="semester.label" :value="semester.value" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 图表区域 - 左右布局 -->
    <div class="charts-container">
      <!-- 课程类型工作量占比图表 - 左侧 1/3 -->
      <div class="chart-section chart-left">
        <div class="chart-container">
          <div class="chart-header">
            <h3>工作量占比</h3>
            <div class="chart-stats">
              <span class="stat-item">筛选结果: {{ filteredWorkload }} 小时</span>
            </div>
          </div>
          <div ref="pieChart" class="chart-content"></div>
        </div>
      </div>

      <!-- 近5年各学期工作量变化趋势图表 - 右侧 2/3 -->
      <div class="chart-section chart-right">
        <div class="chart-container">
          <div class="chart-header">
            <h3>各学期工作量变化趋势</h3>
            <div class="chart-stats">
              <span class="stat-item">平均工作量: {{ averageWorkload }} 小时/学期</span>
              <span class="stat-item">最高工作量: {{ maxWorkload }} 小时</span>
            </div>
          </div>
          <div ref="barChart" class="chart-content"></div>
        </div>
      </div>
    </div>

    <!-- 完整日历侧滑抽屉 -->
    <el-drawer
      v-model="showFullDrawer"
      title="月度工作日历"
      size="1200px"
      class="full-calendar-drawer"
    >
      <div class="drawer-content">
        <div class="calendar-wrapper">
          <el-calendar v-model="drawerCalendarDate">
            <template #date-cell="{ data }">
              <div class="calendar-cell" @click="handleDateSelect(data.day)">
                <div class="cell-date" :class="{ 'is-selected-day': data.day === selectedDrawerDate }">
                  {{ data.day.split('-')[2] }}
                </div>
                <div class="cell-events" v-if="getMonthlyEvents(data.day).length > 0">
                  <div 
                    v-for="(event, index) in getMonthlyEvents(data.day).slice(0, 3)" 
                    :key="index"
                    class="event-item"
                    :class="event.type"
                    :title="event.title"
                  >
                    {{ event.title }}
                  </div>
                  <div v-if="getMonthlyEvents(data.day).length > 3" class="event-more">
                    +{{ getMonthlyEvents(data.day).length - 3 }} 更多
                  </div>
                </div>
              </div>
            </template>
          </el-calendar>
        </div>
        
        <!-- 选中日期的详情页 -->
        <div class="selected-date-details" v-if="selectedDrawerDate">
          <div class="details-header">
            <h4>{{ formatDrawerDateHeader(selectedDrawerDate) }} 工作安排</h4>
            <span class="event-count-badge" v-if="selectedDrawerEvents.length > 0">
              共 {{ selectedDrawerEvents.length }} 项安排
            </span>
          </div>
          
          <div class="details-list" v-if="selectedDrawerEvents.length > 0">
            <div 
              v-for="(event, index) in selectedDrawerEvents" 
              :key="index"
              class="detail-item"
              :class="event.type"
            >
              <div class="detail-icon">
                <div class="icon-dot"></div>
              </div>
              <div class="detail-content">
                <div class="detail-title">{{ event.title }}</div>
                <div class="detail-type-tag">{{ getEventTypeLabel(event.type) }}</div>
              </div>
            </div>
          </div>
          <div v-else class="no-events-detail">
            暂无工作安排，注意休息哦 💛
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { ArrowLeft, ArrowRight, Upload, Calendar } from '@element-plus/icons-vue'

// Local date helpers to avoid UTC shift when using ISO strings
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseLocalDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  // 直接计算星期几，避免时区问题
  const date = new Date(year, month - 1, day)
  // 确保使用本地时间
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// 日历相关数据
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
  const [year, month, day] = dateStr.split('-').map(Number)
  // 直接计算星期几，避免时区问题
  const date = new Date(year, month - 1, day)
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

// 侧滑日历相关数据与方法
const showFullDrawer = ref(false)
const drawerCalendarDate = ref(new Date())
const selectedDrawerDate = ref('')

const openDrawerCalendar = () => {
  const today = new Date()
  showFullDrawer.value = true
  drawerCalendarDate.value = new Date(today)
  selectedDrawerDate.value = formatDate(today)
}

// 讲座、会议、培训数据模板
const otherEvents = [
  { type: 'lecture', title: '学术讲座' },
  { type: 'meeting', title: '教研室常规会议' },
  { type: 'training', title: '新教师技能培训' },
  { type: 'lecture', title: '特邀专家报告' },
  { type: 'meeting', title: '学院教职工大会' },
  { type: 'training', title: '教学管理系统培训' },
  { type: 'meeting', title: '学生工作总结会' }
]

const eventCache = new Map() // 用于缓存每月生成的事件

const getMonthlyEvents = (dateStr) => {
  if (eventCache.has(dateStr)) {
    return eventCache.get(dateStr)
  }
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const dayOfWeek = date.getDay()
  
  const events = []
  
  // 参考原来的上课数据
  const courses = generateCoursesForDate(dateStr)
  courses.forEach(c => {
    // 课程加上时间
    const title = `${c.timeSlot.split('-')[0]} ${c.name}`
    events.push({ type: 'course', title: title })
  })
  
  // 随机添加一些其他事件 (讲座会议)
  const seed = date.getTime()
  const random = (seedValue) => {
    const x = Math.sin(seedValue) * 10000
    return x - Math.floor(x)
  }
  
  // 每天约30%的概率有其他事件
  if (random(seed + 1000) > 0.7) {
    const eventIndex = Math.floor(random(seed + 2000) * otherEvents.length)
    events.push(otherEvents[eventIndex])
    
    // 极小概率有两个附加事件
    if (random(seed + 2500) > 0.8) {
      const eventIndex2 = Math.floor(random(seed + 2600) * otherEvents.length)
      events.push(otherEvents[eventIndex2])
    }
  }
  
  // 周末可能少一点工作，加点特殊培训
  if ((dayOfWeek === 0 || dayOfWeek === 6) && random(seed + 3000) > 0.85) {
    events.push({ type: 'training', title: '周末进阶师资培训' })
  }
  
  eventCache.set(dateStr, events)
  return events
}

// 点击抽屉日历格子
const handleDateSelect = (dateStr) => {
  selectedDrawerDate.value = dateStr
}

// 获取选中日期的事件
const selectedDrawerEvents = computed(() => {
  if (!selectedDrawerDate.value) return []
  return getMonthlyEvents(selectedDrawerDate.value)
})

// 格式化抽屉详情日期标题
const formatDrawerDateHeader = (dateStr) => {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${y}年${Number(m)}月${Number(d)}日`
}

const getEventTypeLabel = (type) => {
  switch (type) {
    case 'course': return '上课'
    case 'lecture': return '讲座'
    case 'meeting': return '会议'
    case 'training': return '培训'
    default: return '工作'
  }
}

// 监听日历改变（如翻月），如果有需要可以把选中日期设为该月1号或者保持为空
watch(drawerCalendarDate, (newVal) => {
  // 当日历翻页时，可以保持原有的选择，如果觉得不合理可以清除：
  // selectedDrawerDate.value = ''
})

// 计算当前年份
const currentYear = computed(() => currentDate.value.getFullYear())

// 可用年份列表
const availableYears = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  for (let year = currentYear - 2; year <= currentYear + 2; year++) {
    years.push(year)
  }
  return years
})

// 获取一周的开始日期（周一）
const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay() // 0=周日, 1=周一, ..., 6=周六
  // 修复逻辑：周日(0)需要回到本周一，其他天正常计算
  const diff = day === 0 ? d.getDate() - 6 : d.getDate() - day + 1
  const weekStart = new Date(d)
  weekStart.setDate(diff)
  return weekStart
}

// 计算当前周的天数（周视图）
const weekDays = computed(() => {
  const weekStart = getWeekStart(currentDate.value)
  const days = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    const dateStr = formatDate(date)
    const today = new Date()
    const isToday = dateStr === formatDate(today)
    const isCurrentMonth = date.getMonth() === currentDate.value.getMonth()
    
    days.push({
      day: date.getDate(),
      date: dateStr,
      isCurrentMonth,
      isToday,
      courseCount: getCourseCountForDate(dateStr)
    })
  }
  
  return days
})

// 格式化当前周显示
const currentWeekFormatted = computed(() => {
  const weekStart = getWeekStart(currentDate.value)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  
  const startMonth = weekStart.getMonth() + 1
  const startDay = weekStart.getDate()
  const endMonth = weekEnd.getMonth() + 1
  const endDay = weekEnd.getDate()
  const year = weekStart.getFullYear()
  
  if (startMonth === endMonth) {
    return `${year}年${startMonth}月${startDay}-${endDay}日`
  } else {
    return `${year}年${startMonth}月${startDay}日-${endMonth}月${endDay}日`
  }
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

// 年份选择
const selectYear = (year) => {
  currentDate.value = new Date(year, currentDate.value.getMonth(), currentDate.value.getDate())
  showYearPicker.value = false
}

// 周导航
const previousWeek = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() - 7)
  currentDate.value = newDate
}

const nextWeek = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + 7)
  currentDate.value = newDate
}

// 回到今天
const goToToday = () => {
  const today = new Date()
  currentDate.value = new Date(today) // 确保创建新的Date对象
  selectedDate.value = formatDate(today)
}

// 原有的工作量量化相关数据
const selectedCourse = ref('')
const selectedType = ref('')
const selectedSemester = ref('')

// 筛选选项
const courseOptions = ref([
  { value: 'math', label: '高等数学' },
  { value: 'physics', label: '大学物理' },
  { value: 'chemistry', label: '有机化学' },
  { value: 'computer', label: '计算机基础' },
  { value: 'english', label: '大学英语' },
  { value: 'biology', label: '生物化学' },
  { value: 'statistics', label: '统计学' }
])

const typeOptions = ref([
  { value: 'theory', label: '理论课' },
  { value: 'practice', label: '实践课' },
  { value: 'experiment', label: '实验课' }
])

const semesterOptions = ref([
  { value: '2024-1', label: '2024春季' },
  { value: '2023-2', label: '2023秋季' },
  { value: '2023-1', label: '2023春季' },
  { value: '2022-2', label: '2022秋季' },
  { value: '2022-1', label: '2022春季' }
])

// 图表相关
const pieChart = ref(null)
const barChart = ref(null)
let pieChartInstance = null
let barChartInstance = null

// 统计数据
const totalWorkload = ref(1000)
const filteredWorkload = ref(1000)
const averageWorkload = ref(140)
const maxWorkload = ref(160)

// 筛选功能
const handleFilterChange = () => {
  console.log('筛选条件变化:', { 
    course: selectedCourse.value, 
    type: selectedType.value, 
    semester: selectedSemester.value 
  })
  
  // 模拟筛选后的数据变化
  updateFilteredData()
  initCharts()
}

const updateFilteredData = () => {
  // 根据筛选条件模拟数据变化
  let baseWorkload = 1000
  let multiplier = 1
  
  if (selectedCourse.value) {
    multiplier *= 0.8 // 选择特定课程时工作量减少
  }
  
  if (selectedType.value) {
    multiplier *= 0.6 // 选择特定类型时工作量减少
  }
  
  if (selectedSemester.value) {
    multiplier *= 0.4 // 选择特定学期时工作量减少
  }
  
  filteredWorkload.value = Math.round(baseWorkload * multiplier)
  averageWorkload.value = Math.round(140 * multiplier)
  maxWorkload.value = Math.round(160 * multiplier)
}

// 添加上传排课表功能
const uploadSchedule = () => {
  console.log('上传排课表')
  // 这里可以添加上传排课表的逻辑
  // 可以打开文件选择对话框或上传组件
}

// 初始化图表
const initCharts = () => {
  initPieChart()
  initBarChart()
}

const initPieChart = () => {
  if (!pieChart.value) return
  
  if (pieChartInstance) {
    pieChartInstance.dispose()
  }
  
  pieChartInstance = echarts.init(pieChart.value)
  
  // 根据筛选条件调整数据
  let data = [
    { value: 45, name: '理论课', itemStyle: { color: '#5470c6' } },
    { value: 30, name: '实践课', itemStyle: { color: '#91cc75' } },
    { value: 25, name: '实验课', itemStyle: { color: '#fac858' } }
  ]
  
  // 根据筛选条件调整数据
  if (selectedType.value) {
    data = data.map(item => {
      if (item.name === getTypeLabel(selectedType.value)) {
        return { ...item, value: 100 }
      } else {
        return { ...item, value: 0 }
      }
    })
  }
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      textStyle: { color: '#666' }
    },
    series: [
      {
        name: '课程类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: data,
        itemStyle: {
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#fff',
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 12,
          color: '#333'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        }
      }
    ]
  }
  
  pieChartInstance.setOption(option)
}

const initBarChart = () => {
  if (!barChart.value) return
  
  if (barChartInstance) {
    barChartInstance.dispose()
  }
  
  barChartInstance = echarts.init(barChart.value)
  
  // 根据筛选条件调整数据
  let data = [
    { name: '2019春', value: 120 },
    { name: '2019秋', value: 135 },
    { name: '2020春', value: 98 },
    { name: '2020秋', value: 110 },
    { name: '2021春', value: 125 },
    { name: '2021秋', value: 140 },
    { name: '2022春', value: 115 },
    { name: '2022秋', value: 130 },
    { name: '2023春', value: 145 },
    { name: '2023秋', value: 160 }
  ]
  
  // 根据学期筛选调整数据
  if (selectedSemester.value) {
    data = data.map(item => {
      if (item.name === getSemesterLabel(selectedSemester.value)) {
        return { ...item, value: item.value }
      } else {
        return { ...item, value: 0 }
      }
    })
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLine: { lineStyle: { color: '#e0e6f1' } },
      axisTick: { show: false },
      axisLabel: { color: '#666', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#666', fontSize: 12 },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: '工作量',
        type: 'bar',
        data: data.map(item => item.value),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#5470c6' },
            { offset: 1, color: '#91cc75' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(84, 112, 198, 0.3)'
          }
        }
      }
    ]
  }
  
  barChartInstance.setOption(option)
}

// 辅助函数
const getTypeLabel = (value) => {
  const type = typeOptions.value.find(t => t.value === value)
  return type ? type.label : ''
}

const getSemesterLabel = (value) => {
  const semester = semesterOptions.value.find(s => s.value === value)
  return semester ? semester.label : ''
}

// 生命周期
onMounted(() => {
  // 初始化时选中今天
  selectedDate.value = formatDate(new Date())
  nextTick(() => {
    initCharts()
  })
})

onUnmounted(() => {
  if (pieChartInstance) {
    pieChartInstance.dispose()
  }
  if (barChartInstance) {
    barChartInstance.dispose()
  }
})

// 监听筛选条件变化
watch([selectedCourse, selectedType, selectedSemester], () => {
  handleFilterChange()
}, { deep: true })
</script>

<style scoped>
.workload-quantification {
  padding: 20px;
  background: #f8f9fa;
  min-height: auto;
  width: 100%;
}

/* 第一部分：日历和当日课程 */
.calendar-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.calendar-container {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  position: relative;
}

.calendar-title {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.calendar-title h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.week-nav {
  display: flex;
  gap: 6px;
}

.nav-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.nav-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
  background: #f0f8ff;
}

.quick-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.today-btn {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  transition: all 0.2s;
}

.today-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
  background: #f0f8ff;
}

.year-picker-btn {
  padding: 4px 8px;
  border: 1px solid #1677ff;
  background: #1677ff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
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
  min-width: 180px;
  margin-top: 8px;
}

.year-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.year-list {
  max-height: 150px;
  overflow-y: auto;
  padding: 6px 0;
}

.year-item {
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
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
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  padding: 6px;
  font-weight: 500;
  color: #666;
  font-size: 12px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
  min-height: 32px;
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
  font-size: 14px;
}

.course-count {
  position: absolute;
  top: 1px;
  right: 1px;
  background: #ff4d4f;
  color: white;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.daily-courses {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.daily-courses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.daily-courses-header h3 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.course-count-badge {
  background: #1677ff;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
}

.courses-list {
  max-height: 300px;
  overflow-y: auto;
}

.no-courses {
  text-align: center;
  color: #999;
  padding: 20px 0;
}

.no-courses-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.no-courses p {
  margin: 0;
  font-size: 12px;
}

.course-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  border: 1px solid #f0f0f0; 
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.2s;
  background: #f8f9fa;
}

.course-item:hover {
  border-color: #1677ff;
  box-shadow: 0 1px 4px rgba(22, 119, 255, 0.15);
}

.course-item:last-child {
  margin-bottom: 0;
}

.course-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 6px;
  background: #fff;
  border-radius: 6px;
}

.time-slot {
  font-size: 14px;
  color: #1677ff;
  font-weight: 600;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-top {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 6px;
}

.title-line {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}

.course-name {
  font-weight: 600;
  color: #333;
  font-size: 12px;
}

.course-code {
  font-size: 11px;
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
  font-size: 11px;
}

.classroom {
  color: #52c41a;
  font-weight: 500;
  font-size: 11px;
}

.course-type-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 10px;
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

/* 标题和按钮行样式 */
.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0;
}

.module-title {
  margin: 0;
  font-size: 16px;
  color: #5856d6;
  font-weight: 600;
  padding-bottom: 8px;
  display: flex;
  align-items: center;
}

.upload-btn {
  background: #5856d6 !important;
  border-color: #5856d6 !important;
  padding: 8px 10px !important;
  font-weight: 500 !important;
  border-radius: 6px !important;
}

.upload-btn:hover {
  background: #7e7eff !important;
  border-color: #7e7eff !important;
}

.upload-btn:focus {
  background: #5856d6 !important;
  border-color: #5856d6 !important;
}

/* 筛选区域 */
.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #333;
  min-width: 60px;
}

/* 自定义下拉框和按钮样式 */
.course-select {
  width: 200px !important;
  min-width: 200px !important;
}

.course-select .el-input__inner {
  width: 100% !important;
}

.type-select {
  width: 180px !important;
  min-width: 180px !important;
}

.type-select .el-input__inner {
  width: 100% !important;
}

.semester-select {
  width: 180px !important;
  min-width: 180px !important;
}

.semester-select .el-input__inner {
  width: 100% !important;
}

/* 图表容器 - 左右布局 */
.charts-container {
  display: flex;
  gap: 20px;
  margin-bottom: 0;
}

.chart-section {
  flex: 1;
}

.chart-left {
  flex: 1;
}

.chart-right {
  flex: 2;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.chart-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  background: #f8f9fa;
  padding: 4px 12px;
  border-radius: 4px;
}

.chart-content {
  height: 400px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
.calendar-section {
    grid-template-columns: 1fr;
}

  .charts-container {
    flex-direction: column;
  }
  
  .chart-left,
  .chart-right {
    flex: 1;
  }
  
  .chart-stats {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .workload-quantification {
    padding: 10px;
  }
  
  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .chart-content {
    height: 300px;
  }
}

/* 完整日历侧滑抽屉样式 */
:deep(.full-calendar-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}
:deep(.full-calendar-drawer .el-drawer__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f7fa;
}

.drawer-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.calendar-wrapper {
  background: white;
  padding: 12px 20px;
}

/* 修改原来的日历高宽以适合侧滑 */
:deep(.full-calendar-drawer .el-calendar__body) {
  padding: 12px 0 0 0;
}
:deep(.el-calendar-table thead th) {
  padding: 10px 0;
  font-size: 16px;
}
:deep(.el-calendar-day) {
  height: 110px !important;
  min-height: 110px;
  padding: 6px;
}

.calendar-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}
.calendar-cell:hover {
  background: rgba(22, 119, 255, 0.04);
}

.cell-date {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  text-align: left;
  padding-left: 6px;
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
}
.cell-date.is-selected-day {
  background: #1677ff;
  color: white;
}

.cell-events {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
/* 隐藏滚动条 */
.cell-events::-webkit-scrollbar {
  display: none;
}
.event-item {
  font-size: 14px;
  padding: 4px 6px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  font-weight: 500;
}
.event-item.course {
  background: #e6f7ff;
  color: #1677ff;
  border-left: 4px solid #1677ff;
}
.event-item.lecture {
  background: #fff0f6;
  color: #eb2f96;
  border-left: 4px solid #eb2f96;
}
.event-item.meeting {
  background: #f6ffed;
  color: #52c41a;
  border-left: 4px solid #52c41a;
}
.event-item.training {
  background: #fff7e6;
  color: #fa8c16;
  border-left: 4px solid #fa8c16;
}
.event-more {
  font-size: 13px;
  color: #999;
  text-align: center;
  margin-top: 2px;
  font-weight: 500;
}

/* 选中日期详情区域 */
.selected-date-details {
  margin: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
}
.details-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.details-header h4 {
  margin: 0;
  font-size: 18px;
  color: #333;
}
.event-count-badge {
  background: #e6f7ff;
  color: #1677ff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s;
}
.detail-item:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.detail-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
/* detail 列表不同颜色的徽标标记 */
.detail-item.course .detail-icon { background: #e6f7ff; }
.detail-item.course .icon-dot { background: #1677ff; }
.detail-item.course:hover { border-color: #91caff; }

.detail-item.lecture .detail-icon { background: #fff0f6; }
.detail-item.lecture .icon-dot { background: #eb2f96; }
.detail-item.lecture:hover { border-color: #ffadd2; }

.detail-item.meeting .detail-icon { background: #f6ffed; }
.detail-item.meeting .icon-dot { background: #52c41a; }
.detail-item.meeting:hover { border-color: #b7eb8f; }

.detail-item.training .detail-icon { background: #fff7e6; }
.detail-item.training .icon-dot { background: #fa8c16; }
.detail-item.training:hover { border-color: #ffd591; }

.detail-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.detail-title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}
.detail-type-tag {
  font-size: 14px;
  padding: 4px 10px;
  border-radius: 4px;
  background: #f0f0f0;
  color: #666;
}

.no-events-detail {
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.calendar-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
