<template>
  <div class="teaching-evaluations">
    <!-- 顶部导航标签和添加按钮 -->
    <div class="nav-section">
      <div class="nav-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['nav-tab', { active: activeTab === tab.id }]"
          @click="switchTab(tab.id)"
        >
          {{ tab.name }}
          <span class="tab-count" v-if="tab.id !== 'all'">
            {{ getTabCount(tab.id) }}
          </span>
        </div>
      </div>
      <button class="add-btn" @click="addSelfEvaluation">
        <span class="add-icon">+</span>
        添加自我评估
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载评价数据...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredEvaluations.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <p>暂无评价数据</p>
      <small>选择其他标签查看不同类型的评价</small>
    </div>

    <!-- 评价卡片网格 -->
    <div v-else class="evaluations-grid">
      <div 
        v-for="(evaluation, index) in filteredEvaluations" 
        :key="index"
        class="evaluation-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="card-header">
          <div class="profile-info">
            <img 
              :src="evaluation.avatar" 
              :alt="evaluation.name" 
              class="avatar"
              @error="handleImageError"
            />
            <div class="name">{{ evaluation.name }}</div>
          </div>
          <div :class="['reviewer-type', `type-${evaluation.type}`]">
            {{ evaluation.typeText }}
          </div>
        </div>
        
        <div class="card-content">
          <div class="review-subject">
            {{ evaluation.subject }}
          </div>
          <div :class="['subject-box', `box-${evaluation.type}`]">
            {{ evaluation.subjectTitle }}
          </div>
          <div class="review-text">
            {{ evaluation.reviewText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 导航标签数据
const tabs = [
  { id: 'all', name: '全部评价' },
  { id: 'course', name: '课程评价' },
  { id: 'experience', name: '经验活动评价' },
  { id: 'work', name: '工作评价' },
  { id: 'self', name: '自我评估' }
]

const activeTab = ref('all')
const loading = ref(true)

// 评价数据
const evaluations = [
  {
    name: '张巡',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    type: 'student',
    typeText: '学生',
    subject: '评论了您的课程',
    subjectTitle: '《计算机应用基础》',
    reviewText: '受益匪浅的一门课,一开始的懵到后来的兴致勃勃,感谢张老师的兴趣教育,以及每一次提问后举一反三的引导,让我们有了自己独立思考,和在应用的能力,谢谢张老师!'
  },
  {
    name: '李艳',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    type: 'colleague',
    typeText: '同事',
    subject: '评论了您的课程',
    subjectTitle: '#人工智能在教学场景下的趣味应用',
    reviewText: '受益匪浅的一门课,一开始的懵到后来的兴致勃勃,感谢张老师的兴趣教育,以及每一次提问后举一反三的引导,让我们有了自己独立思考,和在应用的能力,谢谢张老师!'
  },
  {
    name: '赵川',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    type: 'supervisor',
    typeText: '督导',
    subject: '评论了您的工作汇报',
    subjectTitle: '2025上半年教学计划',
    reviewText: '计划非常完整,希望继续保持!可以适当把亮点工作和亮点活动做线下分享会。'
  },
  {
    name: '王小明',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    type: 'student',
    typeText: '学生',
    subject: '评论了您的课程',
    subjectTitle: '《数据结构与算法》',
    reviewText: '老师讲解非常清晰，算法思路分析得很透彻，让我对编程有了更深的理解。'
  },
  {
    name: '陈老师',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    type: 'colleague',
    typeText: '同事',
    subject: '评论了您的教学经验',
    subjectTitle: '教学创新分享会',
    reviewText: '您的教学方法很有启发性，特别是在项目化教学方面的实践值得推广。'
  },
  {
    name: '刘主任',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    type: 'supervisor',
    typeText: '督导',
    subject: '评论了您的工作总结',
    subjectTitle: '2024年度工作总结',
    reviewText: '工作态度认真负责，教学效果显著，学生反馈良好，继续保持！'
  }
]

// 统计信息计算
const totalEvaluations = computed(() => evaluations.length)
const studentCount = computed(() => evaluations.filter(e => e.type === 'student').length)
const colleagueCount = computed(() => evaluations.filter(e => e.type === 'colleague').length)
const supervisorCount = computed(() => evaluations.filter(e => e.type === 'supervisor').length)

// 根据选中的标签过滤评价
const filteredEvaluations = computed(() => {
  if (activeTab.value === 'all') {
    return evaluations
  } else if (activeTab.value === 'course') {
    return evaluations.filter(e => e.subject.includes('课程'))
  } else if (activeTab.value === 'experience') {
    return evaluations.filter(e => e.subject.includes('教学经验') || e.subject.includes('分享会'))
  } else if (activeTab.value === 'work') {
    return evaluations.filter(e => e.subject.includes('工作'))
  } else if (activeTab.value === 'self') {
    // 自我评估可以显示一个特殊的卡片
    return [{
      name: '自我评估',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      type: 'self',
      typeText: '个人',
      subject: '个人教学反思',
      subjectTitle: '2024年教学总结',
      reviewText: '本年度在教学创新方面有所突破，学生参与度明显提升。后续将继续优化课程设计，增加实践环节，提升学生动手能力。'
    }]
  }
  return evaluations
})

// 获取标签对应的评价数量
const getTabCount = (tabId) => {
  if (tabId === 'course') {
    return evaluations.filter(e => e.subject.includes('课程')).length
  } else if (tabId === 'experience') {
    return evaluations.filter(e => e.subject.includes('教学经验') || e.subject.includes('分享会')).length
  } else if (tabId === 'work') {
    return evaluations.filter(e => e.subject.includes('工作')).length
  } else if (tabId === 'self') {
    return 1
  }
  return 0
}

// 切换标签
const switchTab = (tabId) => {
  activeTab.value = tabId
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
}

// 添加自我评估
const addSelfEvaluation = () => {
  console.log('打开添加自我评估')
  // 这里可以实现实际的添加逻辑
}

// 模拟加载数据
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.teaching-evaluations {
  padding: 20px;
  min-height: 100vh;
}

/* 统计信息样式 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #8b5cf6;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 导航区域样式 */
.nav-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
}

.nav-tabs {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  overflow-x: auto;
  overflow-y: visible;
}

.nav-tab {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  margin: 4px;
}

.nav-tab:hover {
  background-color: #f0f0f0;
}

.nav-tab.active {
  background-color: #8b5cf6;
  color: white;
}

.tab-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  padding: 4px;
  border-radius: 50%;
  min-width: 16px;
  height: 16px;
  text-align: center;
  line-height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

/* 添加按钮样式 */
.add-btn {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  white-space: nowrap;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.add-icon {
  font-size: 18px;
  font-weight: bold;
}

/* 加载状态样式 */
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
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #666;
  font-weight: 500;
}

.empty-state small {
  color: #999;
  font-size: 14px;
}

/* 评价卡片网格 */
.evaluations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.evaluation-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.evaluation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

/* 评价者类型标签 */
.reviewer-type {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.type-student {
  background-color: #10b981;
}

.type-colleague {
  background-color: #3b82f6;
}

.type-supervisor {
  background-color: #d97706;
}

.type-self {
  background-color: #8b5cf6;
}

/* 卡片内容 */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-subject {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.subject-box {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.box-student {
  background-color: #dcfce7;
  color: #166534;
}

.box-colleague {
  background-color: #dbeafe;
  color: #1e40af;
}

.box-supervisor {
  background-color: #fef3c7;
  color: #92400e;
}

.box-self {
  background-color: #ede9fe;
  color: #5b21b6;
}

.review-text {
  font-size: 14px;
  line-height: 1.6;
  color: #444;
  margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .evaluations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .evaluations-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .nav-tabs {
    flex-direction: column;
  }
  
  .nav-tab {
    text-align: left;
  }
  
  .add-btn {
    width: 100%;
    justify-content: center;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
}
</style> 