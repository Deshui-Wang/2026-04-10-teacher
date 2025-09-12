<template>
  <div class="teaching-achievements-page">
    <div class="page-header">
      <h2>教学成果</h2>
    </div>
    
    <!-- 成果统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">♾️</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalAchievements }}</div>
          <div class="stat-label">成果总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔬</div>
        <div class="stat-content">
          <div class="stat-number">{{ teachingReformProjects }}</div>
          <div class="stat-label">教改项目</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-content">
          <div class="stat-number">{{ teachingCompetitions }}</div>
          <div class="stat-label">教学比赛</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <div class="stat-number">{{ textbookWriting }}</div>
          <div class="stat-label">教材撰写</div>
        </div>
      </div>
    </div>

    <!-- 成果类型筛选 -->
    <div class="filter-section">
      <div class="filter-tabs">
        <button 
          v-for="type in achievementTypes" 
          :key="type.value"
          @click="activeFilter = type.value"
          :class="['filter-tab', { active: activeFilter === type.value }]"
        >
          <span class="filter-icon">{{ type.icon }}</span>
          {{ type.label }}
        </button>
      </div>
    </div>

    <!-- 成果列表 -->
    <div class="achievements-section">
      <div class="section-header">
        <h3>教学成果列表</h3>
        <div class="sort-options">
          <select v-model="sortBy" class="sort-select">
            <option value="date">按时间排序</option>
            <option value="name">按名称排序</option>
            <option value="type">按类型排序</option>
          </select>
        </div>
      </div>

      <div class="achievements-grid">
        <div 
          v-for="achievement in filteredAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="`type-${achievement.type}`"
        >
          <div class="achievement-header">
            <div class="achievement-icon">
              <span>{{ getAchievementIcon(achievement.type) }}</span>
            </div>
            <div class="achievement-type-badge" :class="`type-${achievement.type}`">
              {{ getTypeLabel(achievement.type) }}
            </div>
          </div>
          
          <div class="achievement-content">
            <h4 class="achievement-name">{{ achievement.name }}</h4>
            <p class="achievement-description">{{ achievement.description }}</p>
            
            <div class="achievement-details">
              <div class="detail-item">
                <span class="detail-label">开展时间：</span>
                <span class="detail-value">{{ achievement.startTime }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">完成时间：</span>
                <span class="detail-value">{{ achievement.endTime }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">成果级别：</span>
                <span class="detail-value level-badge" :class="`level-${achievement.level}`">
                  {{ achievement.level }}
                </span>
              </div>
            </div>
          </div>

          <div class="achievement-attachments">
            <div class="attachments-header">
              <span class="attachments-label">相关资料：</span>
              <span class="attachments-count">{{ achievement.attachments.length }} 个文件</span>
            </div>
            <div class="attachments-list">
              <div 
                v-for="(attachment, index) in achievement.attachments" 
                :key="index"
                class="attachment-item"
                @click="downloadAttachment(attachment)"
              >
                <span class="attachment-icon">{{ getFileIcon(attachment.type) }}</span>
                <span class="attachment-name">{{ attachment.name }}</span>
                <span class="attachment-size">{{ attachment.size }}</span>
              </div>
            </div>
          </div>

          <div class="achievement-actions">
            <button class="btn btn-view" @click="viewAchievement(achievement)">
              查看详情
            </button>
            <button class="btn btn-download" @click="downloadAllAttachments(achievement)">
              下载全部
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 成果详情弹窗 -->
    <div v-if="selectedAchievement" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedAchievement.name }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="achievement-detail-grid">
            <div class="detail-row">
              <span class="detail-label">成果类型：</span>
              <span class="detail-value type-badge" :class="`type-${selectedAchievement.type}`">
                {{ getTypeLabel(selectedAchievement.type) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">成果名称：</span>
              <span class="detail-value">{{ selectedAchievement.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">开展时间：</span>
              <span class="detail-value">{{ selectedAchievement.startTime }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">完成时间：</span>
              <span class="detail-value">{{ selectedAchievement.endTime }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">成果级别：</span>
              <span class="detail-value level-badge" :class="`level-${selectedAchievement.level}`">
                {{ selectedAchievement.level }}
              </span>
            </div>
            <div class="detail-row full-width">
              <span class="detail-label">成果描述：</span>
              <p class="detail-description">{{ selectedAchievement.description }}</p>
            </div>
          </div>
          
          <div class="attachments-section">
            <h4>相关资料附件</h4>
            <div class="attachments-grid">
              <div 
                v-for="(attachment, index) in selectedAchievement.attachments" 
                :key="index"
                class="attachment-card"
                @click="downloadAttachment(attachment)"
              >
                <div class="attachment-icon-large">{{ getFileIcon(attachment.type) }}</div>
                <div class="attachment-info">
                  <div class="attachment-name">{{ attachment.name }}</div>
                  <div class="attachment-meta">
                    <span class="attachment-size">{{ attachment.size }}</span>
                    <span class="attachment-date">{{ attachment.uploadDate }}</span>
                  </div>
                </div>
                <button class="download-btn">下载</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">关闭</button>
          <button class="btn btn-primary" @click="downloadAllAttachments(selectedAchievement)">下载全部附件</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 成果类型筛选
const achievementTypes = [
  { label: '全部', value: 'all', icon: '♾️' },
  { label: '教改项目', value: 'reform', icon: '🔬' },
  { label: '教学比赛', value: 'competition', icon: '🏆' },
  { label: '教材撰写', value: 'textbook', icon: '📚' }
]

const activeFilter = ref('all')
const sortBy = ref('date')

// 模拟教学成果数据
const achievements = ref([
  {
    id: 1,
    name: '基于数学思维培养的课堂教学改革研究',
    type: 'reform',
    startTime: '2023-03-01',
    endTime: '2024-02-28',
    level: '省级',
    description: '针对高中数学教学中学生数学思维培养不足的问题，通过创新教学方法、优化课程设计、建立评价体系等方式，全面提升学生的数学思维能力和创新意识。项目成果显著，学生数学成绩平均提升15%，思维活跃度明显增强。',
    attachments: [
      { name: '项目申请书.pdf', type: 'pdf', size: '2.3MB', uploadDate: '2023-03-01' },
      { name: '中期检查报告.docx', type: 'doc', size: '1.8MB', uploadDate: '2023-09-15' },
      { name: '结题报告.pdf', type: 'pdf', size: '3.2MB', uploadDate: '2024-02-28' },
      { name: '教学案例集.pdf', type: 'pdf', size: '4.1MB', uploadDate: '2024-02-20' }
    ]
  },
  {
    id: 2,
    name: '全国高中数学优质课竞赛',
    type: 'competition',
    startTime: '2023-10-15',
    endTime: '2023-10-20',
    level: '国家级',
    description: '参加全国高中数学优质课竞赛，以《函数与方程》为主题，运用多媒体技术和互动教学法，获得全国一等奖。课程设计注重学生主体地位，通过问题导向和探究式学习，有效提升学生的数学素养。',
    attachments: [
      { name: '教学设计方案.docx', type: 'doc', size: '1.2MB', uploadDate: '2023-10-10' },
      { name: '教学课件.pptx', type: 'ppt', size: '15.6MB', uploadDate: '2023-10-12' },
      { name: '课堂实录视频.mp4', type: 'video', size: '256MB', uploadDate: '2023-10-20' },
      { name: '获奖证书.jpg', type: 'image', size: '2.1MB', uploadDate: '2023-11-01' }
    ]
  },
  {
    id: 3,
    name: '《高中数学思维训练》教材编写',
    type: 'textbook',
    startTime: '2022-06-01',
    endTime: '2024-05-31',
    level: '国家级',
    description: '作为主编参与编写《高中数学思维训练》教材，该教材以培养学生数学思维能力为核心，通过系统化的训练内容和多样化的练习形式，帮助学生建立数学思维模式，提升数学学习效果。教材已在全国多所重点中学试用，反响良好。',
    attachments: [
      { name: '教材编写大纲.docx', type: 'doc', size: '0.8MB', uploadDate: '2022-06-01' },
      { name: '第一章样章.pdf', type: 'pdf', size: '3.5MB', uploadDate: '2022-12-15' },
      { name: '完整教材初稿.pdf', type: 'pdf', size: '45.2MB', uploadDate: '2024-03-20' },
      { name: '专家评审意见.pdf', type: 'pdf', size: '1.2MB', uploadDate: '2024-04-10' },
      { name: '出版合同.pdf', type: 'pdf', size: '0.9MB', uploadDate: '2024-05-31' }
    ]
  },
  {
    id: 4,
    name: '市级青年教师教学基本功大赛',
    type: 'competition',
    startTime: '2023-05-10',
    endTime: '2023-05-12',
    level: '市级',
    description: '参加市级青年教师教学基本功大赛，在教学设计、课堂教学、教学反思三个环节中表现优异，获得市级一等奖。比赛过程中充分展示了扎实的教学基本功和创新的教学理念。',
    attachments: [
      { name: '教学设计.pdf', type: 'pdf', size: '1.5MB', uploadDate: '2023-05-08' },
      { name: '教学反思.docx', type: 'doc', size: '0.6MB', uploadDate: '2023-05-12' },
      { name: '获奖证书.jpg', type: 'image', size: '1.8MB', uploadDate: '2023-05-20' }
    ]
  },
  {
    id: 5,
    name: '基于信息技术的数学教学模式创新研究',
    type: 'reform',
    startTime: '2022-09-01',
    endTime: '2023-08-31',
    level: '校级',
    description: '探索信息技术与数学教学深度融合的新模式，通过开发数字化教学资源、建设在线学习平台、实施混合式教学等方式，提升教学效果和学生学习体验。项目成果包括数字化教学资源库和在线学习平台。',
    attachments: [
      { name: '项目申报书.pdf', type: 'pdf', size: '1.8MB', uploadDate: '2022-08-25' },
      { name: '数字化资源库.zip', type: 'zip', size: '128MB', uploadDate: '2023-06-15' },
      { name: '在线平台演示.mp4', type: 'video', size: '89MB', uploadDate: '2023-07-20' },
      { name: '项目结题报告.pdf', type: 'pdf', size: '2.7MB', uploadDate: '2023-08-31' }
    ]
  },
  {
    id: 6,
    name: '《数学建模与实际问题解决》教材编写',
    type: 'textbook',
    startTime: '2023-01-01',
    endTime: '2024-12-31',
    level: '省级',
    description: '参与编写《数学建模与实际问题解决》教材，该教材面向高中生，通过真实案例和建模过程，培养学生的数学应用能力和创新思维。教材内容贴近生活实际，具有很强的实用性和可操作性。',
    attachments: [
      { name: '编写计划.docx', type: 'doc', size: '0.5MB', uploadDate: '2023-01-01' },
      { name: '样章示例.pdf', type: 'pdf', size: '2.8MB', uploadDate: '2023-06-30' },
      { name: '编写进度报告.docx', type: 'doc', size: '0.7MB', uploadDate: '2023-12-31' }
    ]
  }
])

const selectedAchievement = ref(null)

// 计算属性
const totalAchievements = computed(() => achievements.value.length)

const teachingReformProjects = computed(() => 
  achievements.value.filter(achievement => achievement.type === 'reform').length
)

const teachingCompetitions = computed(() => 
  achievements.value.filter(achievement => achievement.type === 'competition').length
)

const textbookWriting = computed(() => 
  achievements.value.filter(achievement => achievement.type === 'textbook').length
)

const filteredAchievements = computed(() => {
  let filtered = achievements.value
  
  // 按类型筛选
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(achievement => achievement.type === activeFilter.value)
  }
  
  // 排序
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'type':
        return a.type.localeCompare(b.type)
      case 'date':
      default:
        return new Date(b.startTime) - new Date(a.startTime)
    }
  })
  
  return filtered
})

// 方法
const getAchievementIcon = (type) => {
  const icons = {
    reform: '🔬',
    competition: '🏆',
    textbook: '📖'
  }
  return icons[type] || '📋'
}

const getTypeLabel = (type) => {
  const labels = {
    reform: '教改项目',
    competition: '教学比赛',
    textbook: '教材撰写'
  }
  return labels[type] || '未知'
}

const getFileIcon = (type) => {
  const icons = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    ppt: '📊',
    pptx: '📊',
    image: '🖼️',
    video: '��',
    zip: '📦'
  }
  return icons[type] || '📎'
}

const viewAchievement = (achievement) => {
  selectedAchievement.value = achievement
}

const closeModal = () => {
  selectedAchievement.value = null
}

const downloadAttachment = (attachment) => {
  // 模拟下载功能
  console.log('下载附件:', attachment.name)
  alert(`正在下载附件：${attachment.name}`)
}

const downloadAllAttachments = (achievement) => {
  // 模拟批量下载功能
  console.log('下载全部附件:', achievement.name)
  alert(`正在下载 ${achievement.name} 的全部附件`)
}
</script>

<style scoped>
.teaching-achievements-page {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  min-height: 100vh;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #5856d6;
  margin: 0 0 8px 0;
  display: flex;
}

.page-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
  border: 1px solid rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #d9d9d9, #f5f5f5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 24px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.filter-tab {
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-tab:hover {
  background: #f8f9ff;
  color: #5856d6;
}

.filter-tab.active {
  background: #5856d6;
  color: white;
  box-shadow: 0 4px 12px rgba(88,86,214,0.2);
}

.filter-icon {
  font-size: 16px;
}

/* 成果区域 */
.achievements-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
  border: 1px solid rgba(255,255,255,0.4);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

/* 成果网格 */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.achievement-card {
  background: #f8f9ff;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.1);
}

.achievement-card.type-reform {
  border-color: #34c759;
  background: linear-gradient(135deg, #f0fff4, #e6f7f1);
}

.achievement-card.type-competition {
  border-color: #ff9500;
  background: linear-gradient(135deg, #fff7e6, #fff4e6);
}

.achievement-card.type-textbook {
  border-color: #5856d6;
  background: linear-gradient(135deg, #f0f4ff, #eef2ff);
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.achievement-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.achievement-type-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.achievement-type-badge.type-reform {
  background: #e6f7f1;
  color: #26a872;
}

.achievement-type-badge.type-competition {
  background: #fff4e6;
  color: #fa8c16;
}

.achievement-type-badge.type-textbook {
  background: #eef2ff;
  color: #5856d6;
}

.achievement-content {
  margin-bottom: 20px;
}

.achievement-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.achievement-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.achievement-details {
  display: grid;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.detail-value {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.level-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.level-badge.level-国家级 {
  background: #fff0f0;
  color: #ff4d4f;
}

.level-badge.level-省级 {
  background: #fff4e6;
  color: #fa8c16;
}

.level-badge.level-市级 {
  background: #e6f7ff;
  color: #1890ff;
}

.level-badge.level-校级 {
  background: #f6ffed;
  color: #52c41a;
}

/* 附件区域 */
.achievement-attachments {
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(255,255,255,0.7);
  border-radius: 12px;
}

.attachments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.attachments-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.attachments-count {
  font-size: 12px;
  color: #666;
}

.attachments-list {
  display: grid;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.attachment-item:hover {
  border-color: #5856d6;
  background: #f8f9ff;
}

.attachment-icon {
  font-size: 16px;
}

.attachment-name {
  flex: 1;
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.attachment-size {
  font-size: 11px;
  color: #999;
}

.achievement-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view {
  background: #eef2ff;
  color: #5856d6;
}

.btn-view:hover {
  background: #dbe4ff;
}

.btn-download {
  background: #5856d6;
  color: white;
}

.btn-download:hover {
  background: #4c4ac2;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 0 24px;
}

.achievement-detail-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row.full-width {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.detail-row .detail-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.detail-row .detail-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.detail-description {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.attachments-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.attachments-grid {
  display: grid;
  gap: 12px;
}

.attachment-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9ff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.attachment-card:hover {
  border-color: #5856d6;
  background: #f0f4ff;
}

.attachment-icon-large {
  font-size: 24px;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.attachment-info {
  flex: 1;
}

.attachment-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.attachment-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.download-btn {
  padding: 6px 12px;
  background: #5856d6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background: #4c4ac2;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: 24px;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-primary {
  background: #5856d6;
  color: white;
}

.btn-primary:hover {
  background: #4c4ac2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .filter-tabs {
    flex-wrap: wrap;
  }
  
  .filter-tab {
    flex: 1;
    min-width: 120px;
    text-align: center;
  }
}
</style>
