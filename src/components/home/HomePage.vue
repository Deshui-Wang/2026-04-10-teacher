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

    <!-- 重要事件提醒 -->
    <div class="events-section">
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
      </div>
    </div>

    <!-- 今日工作内容 -->
    <div class="work-section">
      <h2 class="section-title">今日主要工作：</h2>
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

    <!-- 内容区域 -->
    <div class="content-area">
      <Dashboard />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Dashboard from './Dashboard.vue'

// 当前日期信息
const currentDate = ref('')
const currentWeekday = ref('')
const weatherInfo = ref('☀️ 晴')

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

onMounted(() => {
  getCurrentDateInfo()
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
  background: rgba(255, 255, 255, 0.8);
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

/* 重要事件提醒 */
.events-section {
  padding: 10px 24px 0px 24px;
  background: rgba(255, 255, 255, 0.6);
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

.event-icon {
  font-size: 24px;
}

.event-content {
  flex: 1;
}

.event-name {
  font-size: 16px;
  color: #374151;
  font-weight: 500;
}

/* 今日工作内容 */
.work-section {
  padding: 24px;
  background: rgba(255, 255, 255, 0.6);
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

/* 内容区域样式 */
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* 响应式设计 */
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
  
  .work-categories {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .content-area {
    padding: 16px;
  }
}
</style>
