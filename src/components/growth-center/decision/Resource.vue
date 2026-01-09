<template>
  <div class="resource-component">
    <!-- 统一筛选控制面板（仿画像页面设计） -->
    <div class="learning-filter-card">
      <!-- 上部：参与动态与搜索 -->
      <div class="filter-card-top">
        <div class="participant-status-group">
          <div class="participant-avatars-small">
            <div 
              v-for="(avatar, index) in teacherAvatars.slice(0, 3)" 
              :key="index"
              class="avatar-mini"
              :style="{ backgroundImage: `url(${avatar})` }"
            ></div>
            <div class="avatar-mini-more">+</div>
          </div>
          <span class="status-text">超过98235名教师已完成学习</span>
          <transition name="fade-up" mode="out-in">
            <div :key="currentLearner" class="dynamic-join-bubble">
              <span class="join-dot"></span>
              {{ currentLearner }} 刚刚加入
            </div>
          </transition>
        </div>

        <div class="search-wrapper">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="在5786个资源中搜索..."
            class="clean-search-input"
          />
          <span class="search-btn-icon">🔍</span>
        </div>
      </div>

      <!-- 下部：分类标签组 -->
      <div class="filter-tags-area">
        <div class="tags-container">
          <button 
            v-for="filter in filterOptions" 
            :key="filter.key"
            class="tag-btn"
            :class="{ active: activeFilter === filter.key }"
            @click="activeFilter = filter.key"
          >
            {{ filter.label }}<span v-if="filter.key === 'all'" class="count-hint"> (5786)</span>
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
            <span class="participant-count">{{ tool.participantCount }}名教师正在学习</span>
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
      
      <!-- 模拟分页符 -->
      <div v-if="filteredTools.length > 0" class="pagination-container">
        <div class="pagination-info">共 5786 条资源，当前第 1/48 页</div>
        <div class="pagination-main">
          <button class="page-arrow" disabled>
            <span class="arrow-icon">❮</span>
          </button>
          
          <div class="page-numbers">
            <span class="page-item active">1</span>
            <span class="page-item">2</span>
            <span class="page-item">3</span>
            <span class="page-item">4</span>
            <span class="page-dots">...</span>
            <span class="page-item">48</span>
          </div>

          <button class="page-arrow">
            <span class="arrow-icon">❯</span>
          </button>
        </div>
        
        <div class="pagination-jump">
          <span>前往</span>
          <input type="text" class="jump-input" placeholder="1" />
          <span>页</span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 动态学习者模拟
const learners = ['王老师', '李老师', '张老师', '陈老师', '赵老师', '孙老师', '钱老师', '周老师']
const currentLearner = ref(learners[0])
let learnerTimer = null

onMounted(() => {
  learnerTimer = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * learners.length)
    currentLearner.value = learners[randomIndex]
  }, 3000)
})

onUnmounted(() => {
  if (learnerTimer) clearInterval(learnerTimer)
})

// 过滤器选项
const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'thought', label: '习近平思想' },
  { key: 'conference', label: '全国教育大会' },
  { key: 'policy', label: '教育政策' },
  { key: 'psychology', label: '师生心理' },
  { key: 'career', label: '职业发展' },
  { key: 'teaching', label: '教学能力' },
  { key: 'competition', label: '能力比赛' },
  { key: 'ideology', label: '课程思政' },
  { key: 'digital', label: '数字化教学' },
  { key: 'reform', label: '教学改革' },
  { key: 'mixed', label: '混合式教学' },
  { key: 'quality', label: '质量评价' },
  { key: 'team', label: '教学团队' },
  { key: 'result', label: '教研成果' },
  { key: 'fund', label: '科研基金' },
  { key: 'writing', label: '论文写作' },
  { key: 'party', label: '党二十届四中全会精神' }
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
    title: '习近平关于教育的重要论述深度学习',
    badgeText: '政治素养',
    badgeClass: 'badge-general',
    tabs: ['思想精髓', '核心要义', '实践指南'],
    description: '深入学习习近平总书记关于教育的重要论述，坚持党对教育工作的全面领导，落实立德树人根本任务。',
    participantCount: '98725',
    actionText: '进行中的任务',
    actionClass: 'btn-participating',
    category: 'thought'
  },
  {
    id: 2,
    title: '2024年全国教育大会精神宣贯',
    badgeText: '政策响应',
    badgeClass: 'badge-general',
    tabs: ['教育强国', '教师队伍建设', '教育改革'],
    description: '全面贯彻全国教育大会精神，深刻领会教育强国的六大属性，为建设中国特色社会主义教育强国贡献力量。',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'conference'
  },
  {
    id: 3,
    title: '高校教师职业发展路径规划',
    badgeText: '职业发展',
    badgeClass: 'badge-general',
    tabs: ['职称评审', '访学计划', '教学成长', '科研起航'],
    description: '帮助高校教师理清职业发展瓶颈，量身定制专业化、个性化的成长路径方案。',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'career'
  },
  {
    id: 4,
    title: 'AIGC 辅助教学设计胜任力考评',
    badgeText: '数智素养',
    badgeClass: 'badge-competency',
    tabs: ['Prompt工程', '资源生成', '个性化评价', '伦理规范'],
    description: '依托大数据中心，结合多平台多终端的教学行为归集，构建教师人工智能教学胜任力能力考评机制。',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'digital'
  },
  {
    id: 5,
    title: '“大思政课”背景下的课程思政方案设计',
    badgeText: '课程思政',
    badgeClass: 'badge-general',
    tabs: ['育人目标', '素材挖掘', '考核融入', '案例展示'],
    description: '探索如何将思政元素有机融入专业课教学，实现知识传授、能力培养与价值塑造的结合。',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'ideology'
  },
  {
    id: 6,
    title: '青年教师教学能力提升工作坊',
    badgeText: '教学能力',
    badgeClass: 'badge-general',
    tabs: ['BOPPPS模型', '互动策略', '板书设计', '智慧手段'],
    description: '通过教学演示、评课磨课、案例分析等多维度训练，全方位提升青年教师课堂掌控力。',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'teaching'
  },
  {
    id: 7,
    title: '职业院校技能大赛（教学能力）研讨',
    badgeText: '能力比赛',
    badgeClass: 'badge-general',
    tabs: ['实施报告', '实况录像', '教案优化', '答辩技巧'],
    description: '针对教师教学能力比赛的各项要求进行深度复盘与针对性优化，助力教师在赛场上脱颖而出。',
    participantCount: '12450',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'competition'
  },
  {
    id: 8,
    title: '高质量教研成果转化评价体系',
    badgeText: '教研成果',
    badgeClass: 'badge-general',
    tabs: ['教材建设', '资源库开发', '教学标准', '推广效应'],
    description: '构建多维度的教研成果评价模型，鼓励教师将优秀教学经验总结转化为可复制、可推广的成果。',
    participantCount: '8760',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'result'
  },
  {
    id: 9,
    title: '党的二十届三中、四中全会精神进课堂',
    badgeText: '思想政治',
    badgeClass: 'badge-general',
    tabs: ['全会精神', '改革任务', '制度优势', '育人实践'],
    description: '将党的二十届三中、四中全会关于深化教育综合改革的战略部署融入课堂教学。',
    participantCount: '65400',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'party'
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
.resource-component {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  padding: 10px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 仿画像页面风格的统一筛选卡片 */
.learning-filter-card {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin: 0 0 32px 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.participant-status-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.participant-avatars-small {
  display: flex;
  align-items: center;
}

.avatar-mini {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-size: cover;
  border: 2px solid white;
  margin-left: -8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.avatar-mini:first-child {
  margin-left: 0;
}

.avatar-mini-more {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #94a3b8;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
  border: 2px solid white;
}

.status-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.dynamic-join-bubble {
  font-size: 13px;
  color: #6366f1;
  background: #f0f4ff;
  padding: 4px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.join-dot {
  width: 6px;
  height: 6px;
  background: #6366f1;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

.search-wrapper {
  position: relative;
  flex: 0 0 320px;
}

.clean-search-input {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: #f8fafc;
  transition: all 0.2s ease;
  color: #334155;
}

.clean-search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-btn-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 16px;
}

/* 分类标签区域 */
.filter-tags-area {
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.tags-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag-btn {
  padding: 6px 16px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  background: #f1f5f9;
  color: #3b82f6;
  border-color: #cbd5e1;
}

.tag-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
}

.count-hint {
  font-size: 11px;
  opacity: 0.8;
  margin-left: 2px;
}

/* 考评工具卡片样式 */
.evaluation-cards {
  margin-bottom: 32px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 固定一行三个 */
  gap: 20px;
}

.evaluation-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(111, 116, 251, 0.08);
  animation: fadeInUp 0.6s ease-out;
  display: flex;
  flex-direction: column;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.evaluation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(111, 116, 251, 0.12);
  border-color: rgba(111, 116, 251, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  min-height: 54px; /* 统一标题高度，保持对齐 */
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  line-height: 1.5;
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
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  color: white;
}

.btn-join:hover {
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
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
  .search-filter-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .task-plaza-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin: 24px 0;
  }
  
  .plaza-title {
    font-size: 24px;
  }
  
  .plaza-description {
    font-size: 14px;
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
  
  .resource-component {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .card-badge {
    align-self: flex-start;
  }
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
}

/* 动效动画 */
.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.5s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
/* 分页符样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.pagination-info {
  font-size: 13px;
  color: #9ca3af;
}

.pagination-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-arrow {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.page-arrow:hover:not(:disabled) {
  border-color: #6f74fb;
  color: #6f74fb;
  background: #f5f7ff;
}

.page-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f9fafb;
}

.arrow-icon {
  font-size: 12px;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-item {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.page-item:hover {
  background: #f3f4f6;
  color: #6f74fb;
}

.page-item.active {
  background: #6f74fb;
  color: white;
  box-shadow: 0 4px 10px rgba(111, 116, 251, 0.25);
}

.page-dots {
  color: #9ca3af;
  padding: 0 4px;
}

.pagination-jump {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
}

.jump-input {
  width: 40px;
  height: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  text-align: center;
  font-size: 13px;
  transition: all 0.2s;
}

.jump-input:focus {
  outline: none;
  border-color: #6f74fb;
  box-shadow: 0 0 0 2px rgba(111, 116, 251, 0.1);
}
</style>
