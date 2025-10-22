<template>
  <div class="home-page-container">
    <!-- 欢迎信息区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">辛苦了，婉婷老师～</h1>
        <div class="date-info">
          <span class="date">{{ currentDate }}</span>
          <span class="weekday">{{ currentWeekday }}</span>
          <span class="weather">{{ weatherInfo }}</span>
        </div>
      </div>
    </div>

    <!-- 通知条 -->
    <div class="notification-bar">
      <div class="notification-content">
        <div class="notification-icon">📢</div>
        <div class="notification-text">
          <span class="notification-title">重要通知：</span>
          <span class="notification-message">2025年优秀教师评选即将开始，请及时准备个人评选资料</span>
        </div>
      </div>
    </div>

    <!-- 轮播图和快捷方式区域 -->
    <div class="hero-section">
      <!-- 左侧轮播图区域 (1/3) -->
      <div class="carousel-section">
        <div class="carousel-container">
          <div class="carousel-wrapper" :style="{ transform: 'translateX(-' + (currentSlide * 100) + '%)' }">
            <div 
              v-for="(banner, index) in bannerImages" 
              :key="index" 
              class="carousel-slide"
            >
              <img :src="banner.src" :alt="banner.alt" class="banner-image" />
            </div>
          </div>

          <!-- 轮播指示器 -->
          <div class="carousel-indicators">
            <button 
              v-for="(banner, index) in bannerImages" 
              :key="index"
              :class="['indicator', { active: currentSlide === index }]"
              @click="goToSlide(index)"
            ></button>
          </div>
          
          <!-- 轮播控制按钮 -->
          <button class="carousel-btn prev" @click="prevSlide">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="carousel-btn next" @click="nextSlide">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- 右侧应用快捷方式区域 (2/3) -->
      <div class="quick-access-section">
        <div class="quick-apps">
          <div class="app-shortcut" v-for="app in quickApps" :key="app.id" @click="openApp(app)">
            <div class="app-icon" :style="{ backgroundColor: app.color }">
              <img v-if="app.image" :src="app.image" :alt="app.name" class="app-image" />
              <i v-else :class="app.icon"></i>
            </div>
            <span class="app-name">{{ app.name }}</span>
          </div>
          <div class="add-shortcut" @click="addShortcut">
            <div class="add-icon">
              <i class="fas fa-plus"></i>
            </div>
            <span class="add-text">添加常用</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 日历和当日课程区域 -->
    <div class="calendar-section-home">
      <div class="calendar-container-home">
        <div class="calendar-header-home">
          <div class="calendar-title-home">
            <h3>{{ currentWeekFormatted }}</h3>
            <div class="week-nav-home">
              <button @click="previousWeek" class="nav-btn-home" title="上一周">‹</button>
              <button @click="nextWeek" class="nav-btn-home" title="下一周">›</button>
            </div>
          </div>
          <div class="quick-actions-home">
            <button @click="goToToday" class="today-btn-home">今天</button>
            <button @click="showYearPicker = !showYearPicker" class="year-picker-btn-home">
              {{ currentYear }}年
            </button>
            <div v-if="showYearPicker" class="year-picker-home">
              <div class="year-picker-header-home">
                <span>选择年份</span>
                <button @click="showYearPicker = false" class="close-btn-home">×</button>
              </div>
              <div class="year-list-home">
                <div 
                  v-for="year in availableYears" 
                  :key="year"
                  :class="['year-item-home', { 'active': year === currentYear }]"
                  @click="selectYear(year)"
                >
                  {{ year }}年
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="calendar-grid-home">
          <div class="calendar-weekdays-home">
            <div v-for="day in weekdays" :key="day" class="weekday-home">{{ day }}</div>
          </div>
          <div class="calendar-days-home">
            <div 
              v-for="day in weekDays" 
              :key="day.date" 
              :class="['calendar-day-home', { 
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'selected': day.date === calendarSelectedDate,
                'has-courses': day.courseCount > 0
              }]"
              @click="selectCalendarDate(day.date)"
            >
              <span class="day-number-home">{{ day.day }}</span>
              <span v-if="day.courseCount > 0" class="course-count-home">{{ day.courseCount }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="daily-courses-home">
        <div class="daily-courses-header-home">
          <h3>{{ selectedDateFormatted }} 课程安排</h3>
          <div class="course-count-badge-home" v-if="dailyCourses.length > 0">
            共 {{ dailyCourses.length }} 节课
          </div>
        </div>
        <div class="courses-list-home">
          <div v-if="dailyCourses.length === 0" class="no-courses-home">
            <div class="no-courses-icon-home">📅</div>
            <p>暂无课程安排</p>
          </div>
          <div v-else>
            <div v-for="course in dailyCourses" :key="course.id" class="course-item-home">
              <div class="course-time-home">
                <div class="time-slot-home">{{ course.timeSlot }}</div>
              </div>
              <div class="course-info-home">
                <div class="info-top-home">
                  <div class="title-line-home">
                    <span class="course-name-home">{{ course.name }}</span>
                    <span class="course-code-home">（{{ course.code }}）</span>
                  </div>
                  <div class="type-badge-home">
                    <span class="course-type-badge-home" :class="course.type.toLowerCase()">{{ course.type }}</span>
                  </div>
                </div>
                <div class="info-bottom-home">
                  <span class="class-name-home">{{ course.className }}</span>
                  <span class="classroom-home">{{ course.classroom }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 重要事件提醒 -->
    <div class="events-section">
      <h2 class="section-title">今日人文关怀</h2>
      <div class="events-list">
        <div class="event-item birthday">
          <div class="event-icon">🎂</div>
          <div class="event-content">
            <span class="event-name">李明艳老师今日46岁生日</span>
          </div>
        </div>
        <div class="event-item birthday">
          <div class="event-icon">🎂</div>
          <div class="event-content">
            <span class="event-name">吴越同学今日19岁生日</span>
          </div>
        </div>
        <div class="event-item award">
          <div class="event-icon">🏆</div>
          <div class="event-content">
            <span class="event-name">张天宇同学荣获二等奖学金</span>
          </div>
        </div>
        <div class="event-item honor">
          <div class="event-icon">⭐</div>
          <div class="event-content">
            <span class="event-name">人工智能教研组评选优秀教研团队</span>
          </div>
        </div>
        <div class="event-item celebration">
          <div class="event-icon">🎓</div>
          <div class="event-content">
            <span class="event-name">王晓敏同学成功考取研究生</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日工作内容 -->
    <div class="work-section">
      <h2 class="section-title">近期重要工作</h2>
      <div class="work-categories">
        <!-- 课程 -->
        <div class="work-category">
          <h3 class="category-title">课程</h3>
          <div class="work-items">
            <div class="work-item" v-for="course in courses" :key="course.id">
              <div class="work-icon">📚</div>
              <span class="work-name">{{ course.name }}</span>
            </div>
          </div>
        </div>

        <!-- 教学活动 -->
        <div class="work-category">
          <h3 class="category-title">教学活动</h3>
          <div class="work-items">
            <div class="work-item" v-for="activity in activities" :key="activity.id">
              <div class="work-icon">🎯</div>
              <span class="work-name">{{ activity.name }}</span>
            </div>
          </div>
        </div>

        <!-- 协作项目 -->
        <div class="work-category">
          <h3 class="category-title">协作项目</h3>
          <div class="work-items">
            <div class="work-item" v-for="project in projects" :key="project.id">
              <div class="work-icon">🤝</div>
              <span class="work-name">{{ project.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全部应用区域 -->
    <div class="all-apps-section">
      <h2 class="section-title">热门应用</h2>
      <div class="apps-grid">
        <div 
          v-for="app in allApps" 
          :key="app.id" 
          class="app-card"
          @click="openApp(app)"
        >
          <div class="app-icon">
            <img v-if="app.image" :src="app.image" :alt="app.name" class="app-image" />
            <i v-else :class="app.icon"></i>
          </div>
          <span class="app-name">{{ app.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// 当前日期信息
const currentDate = ref('')
const currentWeekday = ref('')
const weatherInfo = ref('☀️ 晴')

// 日历相关数据
const calendarCurrentDate = ref(new Date())
const calendarSelectedDate = ref('')
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
  }
]

// 教室配置
const classrooms = ['主楼101', '主楼102', '实验楼103', '教学二楼104', '教学二楼201', '实验楼202']

// 日历工具函数
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseLocalDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// 生成指定日期的课程安排
const generateCoursesForDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const dayOfWeek = date.getDay()
  
  // 只安排周一到周五的课程
  if (dayOfWeek < 1 || dayOfWeek > 5) {
    return []
  }
  
  // 使用日期作为随机种子，确保同一天的数据一致
  const seed = date.getTime()
  
  const random = (seedValue) => {
    const x = Math.sin(seedValue) * 10000
    return x - Math.floor(x)
  }
  
  // 每天随机安排2-4节课
  const courseCount = Math.floor(random(seed) * 3) + 2 // 2-4节课
  const usedTimeSlots = new Set()
  const courses = []
  
  for (let i = 0; i < courseCount; i++) {
    let timeSlotIndex
    let attempts = 0
    do {
      timeSlotIndex = Math.floor(random(seed + i + attempts) * timeSlots.length)
      attempts++
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
      period: timeSlot.period
    })
  }
  
  return courses.sort((a, b) => a.period - b.period)
}

// 获取一周的开始日期（周一）
const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? d.getDate() - 6 : d.getDate() - day + 1
  const weekStart = new Date(d)
  weekStart.setDate(diff)
  return weekStart
}

// 获取指定日期的课程数量
const getCourseCountForDate = (date) => {
  const courses = generateCoursesForDate(date)
  return courses.length
}

// 计算属性
const currentYear = computed(() => calendarCurrentDate.value.getFullYear())

const availableYears = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  for (let year = currentYear - 2; year <= currentYear + 2; year++) {
    years.push(year)
  }
  return years
})

const weekDays = computed(() => {
  const weekStart = getWeekStart(calendarCurrentDate.value)
  const days = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    const dateStr = formatDate(date)
    const today = new Date()
    const isToday = dateStr === formatDate(today)
    const isCurrentMonth = date.getMonth() === calendarCurrentDate.value.getMonth()
    
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

const currentWeekFormatted = computed(() => {
  const weekStart = getWeekStart(calendarCurrentDate.value)
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

const selectedDateFormatted = computed(() => {
  if (!calendarSelectedDate.value) return ''
  const date = parseLocalDate(calendarSelectedDate.value)
  const weekdaysDisplay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdaysDisplay[date.getDay()]
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekday}`
})

const dailyCourses = computed(() => {
  if (!calendarSelectedDate.value) return []
  return generateCoursesForDate(calendarSelectedDate.value)
})

// 日历操作方法
const selectCalendarDate = (date) => {
  calendarSelectedDate.value = date
}

const selectYear = (year) => {
  calendarCurrentDate.value = new Date(year, calendarCurrentDate.value.getMonth(), calendarCurrentDate.value.getDate())
  showYearPicker.value = false
}

const previousWeek = () => {
  const newDate = new Date(calendarCurrentDate.value)
  newDate.setDate(newDate.getDate() - 7)
  calendarCurrentDate.value = newDate
}

const nextWeek = () => {
  const newDate = new Date(calendarCurrentDate.value)
  newDate.setDate(newDate.getDate() + 7)
  calendarCurrentDate.value = newDate
}

const goToToday = () => {
  const today = new Date()
  calendarCurrentDate.value = new Date(today)
  calendarSelectedDate.value = formatDate(today)
}

// 课程数据
const courses = ref([
  { id: 1, name: '高等数学基础课程' },
  { id: 2, name: '线性代数进阶' },
  { id: 3, name: '概率论与数理统计' }
])

// 教学活动数据
const activities = ref([
  { id: 1, name: '新教师培训会议' }
])

// 协作项目数据
const projects = ref([
  { id: 1, name: '多媒体课件设计工作' }
])

// 轮播图相关
const currentSlide = ref(0)
const autoPlayTimer = ref(null)

// 轮播图片数据
const bannerImages = ref([
  {
    src: '/pic/banner1200.jpeg',
    alt: '重要通知 - 稿定集团12月人事任命'
  },
  {
    src: '/pic/banner1300.jpeg', 
    alt: '缓解抑郁 - 消极情绪如何应对'
  },
  {
    src: '/pic/banner1500.png',
    alt: '直播回顾 - 鸿蒙全新发布会'
  }
])

// 快捷应用
const quickApps = ref([
  { id: 1, name: '晋升述职报告', icon: 'fas fa-table', color: '#8b5cf6', image: '/icons/promotion.png' },
  { id: 2, name: '个人档案完善', icon: 'fas fa-building', color: '#3b82f6', image: '/icons/profile.png' },
  { id: 3, name: '新建教学经验', icon: 'fas fa-bullseye', color: '#f59e0b', image: '/icons/teaching.png' },
  { id: 4, name: '未完成的课件', icon: 'fas fa-robot', color: '#10b981', image: '/icons/courseware.png' },
  { id: 5, name: '查看成长任务', icon: 'fas fa-question-circle', color: '#ef4444', image: '/icons/tasks.png' },
  { id: 6, name: '创建协作项目', icon: 'fas fa-project-diagram', color: '#6366f1', image: '/icons/collaboration.png' },
  { id: 7, name: '课程表查看', icon: 'fas fa-calendar-alt', color: '#ec4899', image: '/icons/schedule.png' }
])

// 所有应用数据
const allApps = ref([
  // 最近使用
  { id: 1, name: '智能体', icon: 'fas fa-chart-line', color: '#3b82f6', category: 'recent', image: '/icons/zhinengti.png' },
  { id: 2, name: '工作流', icon: 'fas fa-check-circle', color: '#f59e0b', category: 'recent', image: '/icons/gzl.png' },
  { id: 3, name: 'AI生图', icon: 'fas fa-money-bill-wave', color: '#3b82f6', category: 'recent', image: '/icons/duomotai.png' },
  { id: 4, name: 'AI生视频', icon: 'fas fa-user-clock', color: '#f59e0b', category: 'recent', image: '/icons/duomotai.png' },
  { id: 5, name: '图片处理', icon: 'fas fa-bullseye', color: '#f59e0b', category: 'recent', image: '/icons/duomotai.png' },
  { id: 6, name: 'AI文案', icon: 'fas fa-poll', color: '#3b82f6', category: 'recent', image: '/icons/4AA73219-1746610135832.png' },
  { id: 7, name: '学情分析', icon: 'fas fa-bell', color: '#3b82f6', category: 'recent', image: '/icons/6D25F8D1-1743681008477.png' },
  { id: 8, name: 'AI助教', icon: 'fas fa-robot', color: '#ec4899', category: 'recent', image: '/pic/ai icon.png' },
  { id: 9, name: '智能评测', icon: 'fas fa-tasks', color: '#10b981', category: 'recent', image: '/icons/80429EFB-1747106030110.png' },
  { id: 10, name: '生成式分析', icon: 'fas fa-bullhorn', color: '#f59e0b', category: 'recent', image: '/icons/scsfx.png' },
  { id: 12, name: '能力图谱', icon: 'fas fa-calendar-day', color: '#f59e0b', category: 'recent', image: '/icons/nltp.png' },
  { id: 13, name: '知识图谱', icon: 'fas fa-calendar-week', color: '#10b981', category: 'recent', image: '/icons/zstp.png' },
  { id: 14, name: 'AI智课', icon: 'fas fa-calendar-alt', color: '#8b5cf6', category: 'recent', image: '/icons/mjjys.png' },
  { id: 15, name: 'AI+ppt', icon: 'fas fa-cogs', color: '#3b82f6', category: 'recent', image: '/icons/ppt.png' },
  { id: 16, name: '数字人', icon: 'fas fa-star', color: '#3b82f6', category: 'recent', image: '/icons/szr.png' },
  { id: 17, name: '知识库', icon: 'fas fa-headset', color: '#3b82f6', category: 'recent', image: '/icons/zsk.png' },
])

// 获取当前日期信息
const getCurrentDateInfo = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  
  // 格式化日期
  currentDate.value = `${year}年${month}月${date}日`
  
  // 获取星期
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentWeekday.value = weekdays[now.getDay()]
  
  // 模拟天气信息（实际项目中可以从天气API获取）
  const weathers = ['☀️ 晴', '⛅ 多云', '🌧️ 小雨', '❄️ 雪']
  weatherInfo.value = weathers[Math.floor(Math.random() * weathers.length)]
}

// 轮播图控制函数
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % bannerImages.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? bannerImages.value.length - 1 : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// 自动播放
const startAutoPlay = () => {
  autoPlayTimer.value = setInterval(nextSlide, 4000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
    autoPlayTimer.value = null
  }
}

// 打开应用
const openApp = (app) => {
  console.log('打开应用:', app.name)
  // 这里可以添加路由跳转或其他逻辑
}

// 添加快捷方式
const addShortcut = () => {
  console.log('添加快捷方式')
  // 这里可以添加添加快捷方式的逻辑
}

onMounted(() => {
  getCurrentDateInfo()
  // 启动自动播放
  startAutoPlay()
  // 初始化日历选中今天
  calendarSelectedDate.value = formatDate(new Date())
})

onBeforeUnmount(() => { 
  // 清理定时器
  stopAutoPlay()
})
</script>

<style scoped>
.home-page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 欢迎信息区域 */
.welcome-section {
  padding: 24px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.welcome-content {
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.welcome-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.date-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  font-size: 18px;
  color: #666;
}

.date {
  font-weight: 600;
  color: #8b5cf6;
}

.weekday {
  font-weight: 500;
}

.weather {
  font-size: 20px;
}

/* 通知条样式 */
.notification-bar {
  background: linear-gradient(90deg, #fff7ed 0%, #ffedd5 100%);
  border-left: 4px solid #f97316;
  padding: 6px 24px;
  margin: 0;
  animation: slideDown 0.5s ease-out;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1400px;
  margin: 0 auto;
}

.notification-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.notification-text {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  font-size: 15px;
  line-height: 1.6;
}

.notification-title {
  font-weight: 600;
  color: #ea580c;
  flex-shrink: 0;
}

.notification-message {
  color: #7c2d12;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 重要事件提醒 */
.events-section {
  padding: 10px 24px 0px 24px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 16px 0;
  text-align: left;
}

.events-list {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #f59e0b;
}

.event-item.award {
  border-left-color: #10b981;
}

.event-item.honor {
  border-left-color: #8b5cf6;
}

.event-item.celebration {
  border-left-color: #3b82f6;
}

.event-icon {
  font-size: 24px;
}

.event-content {
  flex: 1;
}

.event-name {
  font-size: 15px;
  color: #374151;
  font-weight: 500;
}

/* 今日工作内容 */
.work-section {
  padding: 24px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.work-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.work-category {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #8b5cf6;
}

.work-items {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.work-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9ff;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.work-item:hover {
  background: #f0f4ff;
  transform: translateX(4px);
}

.work-icon {
  font-size: 20px;
}

.work-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}


/* 轮播图和快捷方式区域样式 */
.hero-section {
  display: flex;
  align-items: stretch;
  gap: 12px;
  margin: 24px;
  padding: 0;
}

/* 左侧轮播图区域 (1/3) */
.carousel-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* 轮播图样式 */
.carousel-container {
  width: 100%;
  height: 100%;
  min-height: 120px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.carousel-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel-btn:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.carousel-btn.prev {
  left: 8px;
}

.carousel-btn.next {
  right: 8px;
}

/* 右侧应用快捷方式区域 (2/3) */
.quick-access-section {
  flex: 2;
  display: flex;
  align-items: center;
}

.quick-apps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  width: 100%;
  height: 100%;
  min-height: 120px;
}

.app-shortcut, .add-shortcut {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 16px 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f3f4f6;
  height: 100%;
}

.app-shortcut:hover, .add-shortcut:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: #e5e7eb;
}

.app-icon, .add-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  position: relative;
  overflow: hidden;
}

.app-image {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.add-icon {
  background: #f3f4f6;
  color: #6b7280;
}

.app-name, .add-text {
  font-size: 13px;
  color: #374151;
  text-align: center;
  font-weight: 500;
  line-height: 1.3;
}

.add-text {
  color: #6b7280;
}

/* 全部应用区域 */
.all-apps-section {
  padding: 24px;
  backdrop-filter: blur(10px);
}

/* 应用网格 */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.app-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.app-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.app-card .app-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  font-size: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid #f6f7f9;
  background: transparent;
}

.app-card .app-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: none;
}

.app-card .app-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  line-height: 1.3;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    gap: 24px;
  }
  
  .carousel-section {
    flex: none;
    max-width: 100%;
  }
  
  .carousel-container {
    width: 100%;
    max-width: 500px;
    height: 200px;
  }
  
  .carousel-slide {
    width: 100%;
    height: 200px;
  }
  
  .quick-access-section {
    max-width: 100%;
  }
  
  .quick-apps {
    grid-template-columns: repeat(3, 1fr);
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .welcome-section,
  .events-section,
  .work-section {
    padding: 16px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .date-info {
    flex-direction: column;
    gap: 8px;
    font-size: 16px;
  }
  
  .notification-bar {
    padding: 12px 16px;
  }
  
  .notification-text {
    font-size: 14px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .notification-icon {
    font-size: 20px;
  }
  
  .work-categories {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .all-apps-section {
    padding: 16px;
  }
  
  .carousel-container {
    height: 150px;
  }
  
  .carousel-slide {
    height: 150px;
  }
  
  .quick-apps {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    min-height: auto;
  }
  
  .app-shortcut, .add-shortcut {
    padding: 14px 10px;
    height: auto;
  }
  
  .app-icon, .add-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .app-image {
    width: 20px;
    height: 20px;
  }
  
  .app-name, .add-text {
    font-size: 12px;
  }
  
  .apps-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .quick-apps {
    grid-template-columns: 1fr;
  }
  
  .carousel-container {
    height: 120px;
  }
  
  .carousel-slide {
    height: 120px;
  }
  
  .apps-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .app-card {
    padding: 16px 12px;
  }
  
  .app-card .app-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .app-card .app-image {
    width: 24px;
    height: 24px;
  }
  
  .app-card .app-name {
    font-size: 12px;
  }
}

/* 日历和当日课程区域样式 */
.calendar-section-home {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 0 24px 24px;
}

.calendar-container-home {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(88, 86, 214, 0.08);
}

.calendar-header-home {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
}

.calendar-title-home {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calendar-title-home h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.week-nav-home {
  display: flex;
  gap: 8px;
}

.nav-btn-home {
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
  transition: all 0.3s;
}

.nav-btn-home:hover {
  border-color: #5856d6;
  color: #5856d6;
  background: #f8f7ff;
}

.quick-actions-home {
  display: flex;
  gap: 8px;
  align-items: center;
}

.today-btn-home {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.3s;
}

.today-btn-home:hover {
  border-color: #5856d6;
  color: #5856d6;
  background: #f8f7ff;
}

.year-picker-btn-home {
  padding: 6px 12px;
  border: 1px solid #5856d6;
  background: #5856d6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.year-picker-btn-home:hover {
  background: #7e7eff;
  border-color: #7e7eff;
}

.year-picker-home {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  margin-top: 8px;
}

.year-picker-header-home {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.close-btn-home {
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn-home:hover {
  color: #666;
}

.year-list-home {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px 0;
}

.year-item-home {
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  color: #666;
}

.year-item-home:hover {
  background: #f8f7ff;
  color: #5856d6;
}

.year-item-home.active {
  background: #5856d6;
  color: white;
}

.calendar-grid-home {
  display: flex;
  flex-direction: column;
}

.calendar-weekdays-home {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
}

.weekday-home {
  text-align: center;
  padding: 8px;
  font-weight: 600;
  color: #666;
  font-size: 13px;
}

.calendar-days-home {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day-home {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  transition: all 0.2s;
  min-height: 40px;
}

.calendar-day-home:hover {
  background: #f0f0f0;
}

.calendar-day-home.other-month {
  color: #ccc;
}

.calendar-day-home.today {
  background: #e6f7ff;
  color: #1677ff;
  font-weight: 600;
}

.calendar-day-home.selected {
  background: #5856d6;
  color: white;
}

.calendar-day-home.has-courses {
  font-weight: 600;
}

.calendar-day-home.has-courses:not(.selected) {
  background: #fff7e6;
  color: #fa8c16;
}

.day-number-home {
  font-size: 14px;
}

.course-count-home {
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

.daily-courses-home {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(88, 86, 214, 0.08);
}

.daily-courses-header-home {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.daily-courses-header-home h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.course-count-badge-home {
  background: #5856d6;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.courses-list-home {
  max-height: 350px;
  overflow-y: auto;
}

.no-courses-home {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.no-courses-icon-home {
  font-size: 48px;
  margin-bottom: 12px;
}

.no-courses-home p {
  margin: 0;
  font-size: 14px;
}

.course-item-home {
  display: flex;
  gap: 20px;
  padding: 12px;
  border: 1px solid #f0f0f0; 
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s;
  background: #fafafa;
}

.course-item-home:hover {
  border-color: #5856d6;
  box-shadow: 0 2px 8px rgba(88, 86, 214, 0.15);
  transform: translateY(-1px);
}

.course-item-home:last-child {
  margin-bottom: 0;
}

.course-time-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  padding: 8px;
  background: #f5e5c8;
  border-radius: 8px;
}

.time-slot-home {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.course-info-home {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-top-home {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
}

.title-line-home {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}

.course-name-home {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.course-code-home {
  font-size: 12px;
  color: #9aa0a6;
}

.type-badge-home {
  justify-self: end;
}

.info-bottom-home {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.class-name-home {
  color: #5856d6;
  font-weight: 500;
  font-size: 12px;
}

.classroom-home {
  color: #52c41a;
  font-weight: 500;
  font-size: 12px;
}

.course-type-badge-home {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.course-type-badge-home.理论课 {
  background: #e6f2ff;
  color: #1677ff;
}

.course-type-badge-home.实践课 {
  background: #fff4e6;
  color: #fa8c16;
}

.course-type-badge-home.实验课 {
  background: #effbea;
  color: #52c41a;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .calendar-section-home {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .calendar-section-home {
    margin: 0 12px 12px;
  }
  
  .calendar-container-home,
  .daily-courses-home {
    padding: 16px;
  }
  
  .calendar-day-home {
    min-height: 32px;
  }
  
  .day-number-home {
    font-size: 12px;
  }
}
</style>
