<template>
  <div class="digital-literacy">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          返回评价反思
        </button>
        <h1 class="page-title">数字素养</h1>
        <p class="page-subtitle">数字化教学能力评估与反思</p>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载数字素养数据...</p>
    </div>

    <!-- 主要内容区域 -->
    <div v-else class="main-content">
      <!-- 数字素养概览卡片 -->
      <div class="overview-section">
        <div class="overview-card">
          <div class="card-header">
            <h2>数字素养概览</h2>
            <div class="last-updated">最后更新：{{ lastUpdated }}</div>
          </div>
          <div class="overview-stats">
            <div class="stat-item">
              <div class="stat-value">{{ digitalScore }}</div>
              <div class="stat-label">综合评分</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ completedModules }}</div>
              <div class="stat-label">已完成模块</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ totalModules }}</div>
              <div class="stat-label">总模块数</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数字素养能力维度 -->
      <div class="dimensions-section">
        <h2 class="section-title">能力维度评估</h2>
        <div class="dimensions-grid">
          <div 
            v-for="dimension in dimensions" 
            :key="dimension.id"
            class="dimension-card"
            :class="{ 'completed': dimension.completed }"
          >
            <div class="dimension-header">
              <div class="dimension-icon">{{ dimension.icon }}</div>
              <h3>{{ dimension.name }}</h3>
              <div class="completion-badge" v-if="dimension.completed">已完成</div>
            </div>
            <div class="dimension-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: dimension.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ dimension.progress }}%</span>
            </div>
            <p class="dimension-description">{{ dimension.description }}</p>
            <div class="dimension-actions">
              <button 
                class="action-btn primary" 
                @click="openDimension(dimension.id)"
              >
                {{ dimension.completed ? '查看详情' : '开始学习' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习记录 -->
      <div class="learning-records-section">
        <h2 class="section-title">学习记录</h2>
        <div class="records-timeline">
          <div 
            v-for="record in learningRecords" 
            :key="record.id"
            class="timeline-item"
          >
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="record-header">
                <h4>{{ record.title }}</h4>
                <span class="record-date">{{ record.date }}</span>
              </div>
              <p class="record-description">{{ record.description }}</p>
              <div class="record-tags">
                <span 
                  v-for="tag in record.tags" 
                  :key="tag"
                  class="record-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 反思与总结 -->
      <div class="reflection-section">
        <h2 class="section-title">反思与总结</h2>
        <div class="reflection-card">
          <div class="reflection-content">
            <h3>个人数字素养发展反思</h3>
            <div class="reflection-text">
              <p>在数字化教学转型过程中，我深刻认识到数字素养对现代教育的重要性。通过系统性的学习和实践，我在以下方面取得了显著进步：</p>
              <ul>
                <li>掌握了多种数字化教学工具的使用方法</li>
                <li>提升了在线课程设计和实施能力</li>
                <li>增强了数据分析和教学效果评估技能</li>
                <li>培养了数字化环境下的学生指导能力</li>
              </ul>
              <p>未来将继续深化数字素养建设，探索更多创新教学模式，为学生提供更优质的数字化学习体验。</p>
            </div>
            <div class="reflection-actions">
              <button class="action-btn primary" @click="editReflection">编辑反思</button>
              <button class="action-btn secondary" @click="exportReport">导出报告</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const loading = ref(true)
const lastUpdated = ref('2024-01-15')
const digitalScore = ref(85)
const completedModules = ref(6)
const totalModules = ref(8)

// 数字素养能力维度
const dimensions = ref([
  {
    id: 'digital-tools',
    name: '数字化工具应用',
    icon: '🛠️',
    description: '熟练使用各种数字化教学工具和平台',
    progress: 90,
    completed: true
  },
  {
    id: 'online-teaching',
    name: '在线教学能力',
    icon: '💻',
    description: '掌握在线课程设计和远程教学技能',
    progress: 85,
    completed: true
  },
  {
    id: 'data-analysis',
    name: '数据分析能力',
    icon: '📊',
    description: '运用数据分析优化教学效果',
    progress: 70,
    completed: false
  },
  {
    id: 'digital-content',
    name: '数字内容创作',
    icon: '🎨',
    description: '创建高质量的数字化教学资源',
    progress: 60,
    completed: false
  },
  {
    id: 'student-guidance',
    name: '数字化学习指导',
    icon: '👥',
    description: '指导学生进行数字化学习',
    progress: 80,
    completed: true
  },
  {
    id: 'innovation',
    name: '教学创新实践',
    icon: '💡',
    description: '探索数字化教学新模式',
    progress: 75,
    completed: false
  }
])

// 学习记录
const learningRecords = ref([
  {
    id: 1,
    title: '完成数字化教学工具培训',
    date: '2024-01-10',
    description: '系统学习了在线教学平台的使用方法，包括直播、录播、互动等功能',
    tags: ['培训', '工具使用', '在线教学']
  },
  {
    id: 2,
    title: '参与数字素养研讨会',
    date: '2024-01-08',
    description: '参加了学校组织的数字素养提升研讨会，与同事交流教学经验',
    tags: ['研讨会', '交流', '经验分享']
  },
  {
    id: 3,
    title: '完成数据分析课程',
    date: '2024-01-05',
    description: '学习了如何运用数据分析工具评估教学效果，优化课程设计',
    tags: ['数据分析', '课程优化', '效果评估']
  }
])

// 方法
const goBack = () => {
  window.history.back()
}

const openDimension = (dimensionId) => {
  console.log('打开维度详情:', dimensionId)
  // 这里可以实现打开具体维度详情的逻辑
}

const editReflection = () => {
  console.log('编辑反思内容')
  // 这里可以实现编辑反思的逻辑
}

const exportReport = () => {
  console.log('导出数字素养报告')
  // 这里可以实现导出报告的逻辑
}

// 模拟加载数据
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>

<style scoped>
.digital-literacy {
  padding: 20px;
  min-height: 100vh;
  background: #f8fafc;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background 0.3s ease;
  margin-bottom: 20px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.back-icon {
  font-size: 16px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

/* 主要内容 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 概览卡片 */
.overview-section {
  margin-bottom: 32px;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.last-updated {
  font-size: 14px;
  color: #666;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 能力维度 */
.dimensions-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.dimension-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dimension-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.dimension-card.completed {
  border-left: 4px solid #10b981;
}

.dimension-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.dimension-icon {
  font-size: 24px;
}

.dimension-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.completion-badge {
  background: #10b981;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.dimension-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.dimension-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
}

.dimension-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5a67d8;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #666;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
}

/* 学习记录 */
.learning-records-section {
  margin-bottom: 32px;
}

.records-timeline {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-item {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 32px;
  bottom: -24px;
  width: 2px;
  background: #e5e7eb;
}

.timeline-marker {
  width: 16px;
  height: 16px;
  background: #667eea;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.timeline-content {
  flex: 1;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.record-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.record-date {
  font-size: 14px;
  color: #666;
}

.record-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
}

.record-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.record-tag {
  background: #f0f9ff;
  color: #0369a1;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

/* 反思与总结 */
.reflection-section {
  margin-bottom: 32px;
}

.reflection-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.reflection-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.reflection-text {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
}

.reflection-text ul {
  margin: 12px 0;
  padding-left: 20px;
}

.reflection-text li {
  margin-bottom: 8px;
}

.reflection-actions {
  display: flex;
  gap: 12px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dimensions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .overview-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dimensions-grid {
    grid-template-columns: 1fr;
  }
  
  .overview-stats {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .reflection-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
