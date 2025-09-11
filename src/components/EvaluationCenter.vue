<template>
  <div class="evaluation-center">
    
    <!-- 当前考评进度显示区 -->
    <div class="current-progress-section">
      <div class="progress-info">
        <h2 class="progress-title">正在参评</h2>
        <p class="progress-subtitle">您于2025年9月1日提交了【高级教师职称】的晋升申请</p>
        <p class="progress-task-summary">1个通用晋升考评任务 · 1个职称申请专用任务 · 3个技能辅助考评任务</p>
      </div>
      <div class="progress-card-wrapper">
        <div class="progress-card">
          <div class="progress-card-icon-container">
            <div class="progress-card-icon">
              <div class="document-icon">
                <div class="document-icon-lines"></div>
                <div class="task-badge">任务</div>
              </div>
            </div>
          </div>
          <p class="progress-percentage">已完成 2%</p>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: 2%"></div>
          </div>
          <button class="refresh-button">
            <span class="refresh-icon">🔄</span>
            <span>刷新进度</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 顶部统计信息区域 -->
    <div class="stats-header">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-icon">
            <img src="/pic/zhineng.svg" alt="统计图标" />
          </div>
          <div class="stat-content">
            <div class="stat-title">全校100%的教师正在积极参加考评</div>
            <div class="stat-subtitle">全年通用考评、晋升有力依据</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <img src="/pic/jineng.svg" alt="统计图标" />
          </div>
          <div class="stat-content">
            <div class="stat-title">超过76.9%的教师正在申请职称评选</div>
            <div class="stat-subtitle">助力学校发展,赋能个人成长</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <img src="/pic/new.svg" alt="统计图标" />
          </div>
          <div class="stat-content">
            <div class="stat-title">专业技能提升,职业规划策略工具</div>
            <div class="stat-subtitle">伴随教师个人成长</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和过滤区域 -->
    <div class="search-filter-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="搜索考评工具..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
      
      <div class="filter-nav">
        <div class="filter-container">
          <button 
            v-for="filter in filterOptions" 
            :key="filter.key"
            class="filter-btn"
            :class="{ active: activeFilter === filter.key }"
            @click="activeFilter = filter.key"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 考评工具卡片区域 -->
    <div class="evaluation-cards">
      <div v-if="filteredTools.length > 0" class="cards-container">
        <div 
          v-for="(tool, index) in filteredTools" 
          :key="tool.id"
          class="evaluation-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="card-header">
            <h3 class="card-title">{{ tool.title }}</h3>
            <span class="card-badge" :class="tool.badgeClass">{{ tool.badgeText }}</span>
          </div>
          
          <div class="card-tabs">
            <span 
              v-for="tab in tool.tabs" 
              :key="tab"
              class="tab-item"
            >
              {{ tab }}
            </span>
          </div>
          
          <div class="card-description">
            {{ tool.description }}
          </div>
          
          <div class="card-participants">
            <div class="participant-avatars">
              <div 
                v-for="(avatar, index) in teacherAvatars" 
                :key="index"
                class="avatar"
                :style="{ backgroundImage: `url(${avatar})` }"
              ></div>
            </div>
            <span class="participant-count">{{ tool.participantCount }}名教师正在参与考核</span>
          </div>
          
          <div class="card-action">
            <button 
              class="action-btn" 
              :class="tool.actionClass"
              @click="handleActionClick(tool)"
            >
              {{ tool.actionText }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">未找到相关考评工具</h3>
        <p class="empty-description">请尝试调整搜索条件或选择其他分类</p>
        <button class="reset-btn" @click="resetFilters">重置筛选条件</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 过滤器选项
const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'general', label: '通用考评' },
  { key: 'title', label: '职称评选' },
  { key: 'competency', label: '智能胜任力考评' },
  { key: 'subject', label: '学科技能考评' },
  { key: 'other', label: '其他考评' }
]

const activeFilter = ref('all')
const searchQuery = ref('')

// 教师头像列表
const teacherAvatars = [
  '/pic/teacher/66.jpg',
  '/pic/teacher/28.png',
  '/pic/teacher/083.png',
  '/pic/teacher/7b.jpeg',
  '/pic/teacher/85.jpeg'
]

// 考评工具数据
const evaluationTools = [
  {
    id: 1,
    title: '教学工作量基本考核',
    badgeText: '通用考评',
    badgeClass: 'badge-general',
    tabs: ['课程数', '课时数', '学生考试通过率'],
    description: '综合年度考核以及聘期内考核整体教学工作可量化考察内容的评定,适用于全体教师,不分级别和年限',
    participantCount: '98725',
    actionText: '正在参考考核',
    actionClass: 'btn-participating',
    category: 'general'
  },
  {
    id: 2,
    title: '科研任务完成情况',
    badgeText: '通用考评',
    badgeClass: 'badge-general',
    tabs: ['论文发表', '项目参与', '经费使用', '专利软著'],
    description: '综合年度考核以及聘期内考核整体教学工作可量化考察内容的评定,适用于全体教师,不分级别和年限',
    participantCount: '98725',
    actionText: '添加目标',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 3,
    title: '社会服务考评',
    badgeText: '通用考评',
    badgeClass: 'badge-general',
    tabs: ['学术兼职', '横向课题', '服务地方', '成果转化'],
    description: '社会服务考评,考察成果转化效。支撑学校社会服务成果的在线对外展示与宣传)促进社会服务成果在专业教学改革和相关企业中的转化应用。',
    participantCount: '98725',
    actionText: '添加目标',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 4,
    title: '人工智能教学胜任力考评',
    badgeText: '智能胜任',
    badgeClass: 'badge-competency',
    tabs: ['工具使用', '设计开发', '分享传播', '新技术发现'],
    description: '依托国家职业教育大数据中心,结合多平台多终端的教师教学及学习行为的归集,构建教师人工智能教学胜任力能力考评机制',
    participantCount: '98725',
    actionText: '添加目标',
    actionClass: 'btn-join',
    category: 'competency'
  },
  {
    id: 5,
    title: '科研任务完成情况',
    badgeText: '通用考评',
    badgeClass: 'badge-general',
    tabs: ['论文发表', '项目参与', '经费使用', '专利软著'],
    description: '综合年度考核以及聘期内考核整体教学工作可量化考察内容的评定,适用于全体教师,不分级别和年限',
    participantCount: '98725',
    actionText: '添加目标',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 6,
    title: '社会服务考评',
    badgeText: '通用考评',
    badgeClass: 'badge-general',
    tabs: ['学术兼职', '横向课题', '服务地方', '成果转化'],
    description: '社会服务考评,考察成果转化效。支撑学校社会服务成果的在线对外展示与宣传)促进社会服务成果在专业教学改革和相关企业中的转化应用。',
    participantCount: '98725',
    actionText: '添加目标',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 7,
    title: '社会服务考评',
    badgeText: '通用考评',
    badgeClass: 'badge-general',
    tabs: ['学术兼职', '横向课题', '服务地方', '成果转化'],
    description: '社会服务考评,考察成果转化效。支撑学校社会服务成果的在线对外展示与宣传)促进社会服务成果在专业教学改革和相关企业中的转化应用。',
    participantCount: '98725',
    actionText: '添加目标',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 8,
    title: '社会服务考评',
    badgeText: '通用考评',
    badgeClass: 'badge-general',
    tabs: ['学术兼职', '横向课题', '服务地方', '成果转化'],
    description: '社会服务考评,考察成果转化效。支撑学校社会服务成果的在线对外展示与宣传)促进社会服务成果在专业教学改革和相关企业中的转化应用。',
    participantCount: '98725',
    actionText: '添加目标',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 9,
    title: '社会服务考评',
    badgeText: '通用考评',
    badgeClass: 'badge-general',
    tabs: ['学术兼职', '横向课题', '服务地方', '成果转化'],
    description: '社会服务考评,考察成果转化效。支撑学校社会服务成果的在线对外展示与宣传)促进社会服务成果在专业教学改革和相关企业中的转化应用。',
    participantCount: '98725',
    actionText: '添加目标',
    actionClass: 'btn-join',
    category: 'general'
  }
  
]

// 根据过滤器和搜索查询筛选工具
const filteredTools = computed(() => {
  let filtered = evaluationTools
  
  // 按类别过滤
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(tool => tool.category === activeFilter.value)
  }
  
  // 按搜索查询过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tool => 
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tabs.some(tab => tab.toLowerCase().includes(query))
    )
  }
  
  return filtered
})

// 处理按钮点击事件
const handleActionClick = (tool) => {
  if (tool.actionText === '正在参考考核') {
    alert('您正在参与该考核，请继续完成相关任务。')
  } else {
    alert(`您已成功报名参加"${tool.title}"考核，请及时关注考核进度。`)
  }
}

// 重置筛选条件
const resetFilters = () => {
  activeFilter.value = 'all'
  searchQuery.value = ''
}
</script>

<style scoped>
.evaluation-center {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 当前考评进度显示区 */
.current-progress-section {
  background-color: #1976d2;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 25px 25px;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.progress-info {
  flex: 1;
  z-index: 1;
  text-align: left;
}

.progress-title {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.progress-subtitle {
  font-size: 16px;
  margin: 0 0 8px 0;
  opacity: 0.9;
}

.progress-task-summary {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

.progress-card-wrapper {
  flex-shrink: 0;
  margin-left: 40px;
  z-index: 1;
}

.progress-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 260px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  text-align: center;
  color: #1f2937;
  position: relative;
  padding-top: 50px;
}

.progress-card-icon-container {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.progress-card-icon {
  width: 100%;
  height: 100%;
  background-color: #d32f2f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.document-icon {
  width: 28px;
  height: 36px;
  background-color: #64b5f6;
  border-radius: 4px;
  position: relative;
}

.document-icon-lines {
  position: absolute;
  top: 8px;
  left: 5px;
  right: 5px;
  height: 2px;
  background-color: white;
  box-shadow: 0 5px 0 0 white, 0 10px 0 0 white, 0 15px 0 0 white;
}

.task-badge {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  color: #333;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  border: 1px solid #ddd;
}

.progress-percentage {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.progress-bar-container {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-bar {
  height: 100%;
  background: #1976d2;
  border-radius: 3px;
  transition: width 0.5s ease-in-out;
}

.refresh-button {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.refresh-button:hover {
  background-color: #e3f2fd;
}

.refresh-icon {
  font-size: 16px;
  transition: transform 0.5s ease;
}

.refresh-button:hover .refresh-icon {
  transform: rotate(180deg);
}

/* 页面标题样式 */
.page-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 20px 0;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* 顶部统计信息样式 */
.stats-header {
  background: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: 24px;
  box-shadow: none;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  gap: 32px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: #1976d2;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.stat-content {
  flex: 1;
}

.stat-title {
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.4;
}

.stat-subtitle {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.4;
}

/* 搜索和过滤区域样式 */
.search-filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
}

.search-box {
  position: relative;
  flex: 0 0 300px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
}

/* 导航过滤器样式 */
.filter-nav {
  flex: 1;
}

.filter-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 22px;
  border: 1px solid #1976d2;
  background: white;
  color: #1976d2;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #f0f5ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}

.filter-btn.active {
  background: #1976d2;
  color: white;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
}

/* 考评工具卡片样式 */
.evaluation-cards {
  margin-bottom: 32px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.evaluation-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.1);
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.evaluation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.card-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.badge-general {
  background: #fef3c7;
  color: #d97706;
}

.badge-competency {
  background: #dbeafe;
  color: #2563eb;
}

.card-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-item {
  padding: 4px 12px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.card-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-participants {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.participant-avatars {
  display: flex;
  align-items: center;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 2px solid white;
  margin-left: -8px;
}

.avatar:first-child {
  margin-left: 0;
}

.participant-count {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.card-action {
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-participating {
  background: #f3f4f6;
  color: #a0a3a7;
}

.btn-participating:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-join {
  background: #1976d2;
  color: white;
}

.btn-join:hover {
  background: #66a0d9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 32px 0;
}

.reset-btn {
  padding: 12px 24px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #7c3aed;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .search-filter-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-box {
    flex: none;
  }
  
  .cards-container {
    grid-template-columns: 1fr;
  }
  
  .filter-container {
    justify-content: center;
  }
  
  .evaluation-center {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .stat-item {
    flex-direction: column;
    text-align: center;
  }
  
  .card-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .card-badge {
    align-self: flex-start;
  }
}
</style> 