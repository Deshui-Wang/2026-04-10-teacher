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

    <!-- 重要事件提醒 -->
    <div class="events-section">
      <h2 class="section-title">今日人文关怀：</h2>
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

    <!-- 全部应用区域 -->
    <div class="content-area">
      <div class="workplace-container">
        <!-- 全部应用标题 -->
        <div class="all-apps-header">
          <h2>全部应用</h2>
        </div>

        <!-- 应用网格 -->
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

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
  { id: 6, name: '创建协作项目', icon: 'fas fa-project-diagram', color: '#6366f1', image: '/icons/collaboration.png' }
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

/* Dashboard 样式 */
.workplace-container {
  min-height: auto;
  background: #ffffff;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border-radius: 12px;
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

/* 全部应用标题 */
.all-apps-header {
  margin-bottom: 24px;
}

.all-apps-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

/* 应用网格 */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
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
  
  .work-categories {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .workplace-container {
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
</style>
