<template>
  <div class="industry-practice-page">
    <div class="page-header">
      <h2>行业实践</h2>
    </div>
    
    <!-- 统计概览卡片 -->
    <div class="stats-overview">
      <div class="stat-card main-stat">
        <div class="stat-icon">⏰</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalHours }}</div>
          <div class="stat-label">近半年兼职总时长（小时）</div>
          <div class="stat-trend" :class="trendClass">
            <span class="trend-icon">{{ trendIcon }}</span>
            <span class="trend-text">{{ trendText }}</span>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🏢</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalCompanies }}</div>
          <div class="stat-label">合作企业数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-number">{{ activePositions }}</div>
          <div class="stat-label">当前职位数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <div class="stat-number">{{ averageHoursPerMonth }}</div>
          <div class="stat-label">月均兼职时长</div>
        </div>
      </div>
    </div>

    <!-- 时间筛选 -->
    <div class="filter-section">
      <div class="time-filter">
        <h3>时间筛选</h3>
        <div class="filter-options">
          <button 
            v-for="period in timePeriods" 
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="['filter-btn', { active: selectedPeriod === period.value }]"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
      
      <div class="view-toggle">
        <button 
          @click="viewMode = 'timeline'"
          :class="['toggle-btn', { active: viewMode === 'timeline' }]"
        >
          <span class="toggle-icon">📅</span>
          时间轴视图
        </button>
        <button 
          @click="viewMode = 'list'"
          :class="['toggle-btn', { active: viewMode === 'list' }]"
        >
          <span class="toggle-icon">📋</span>
          列表视图
        </button>
      </div>
    </div>

    <!-- 兼职经历展示 -->
    <div class="practice-section">
      <div class="section-header">
        <h3>兼职经历</h3>
        <div class="add-practice-btn">
          <button class="btn btn-primary" @click="addPractice">
            <span class="btn-icon">+</span>
            添加兼职经历
          </button>
        </div>
      </div>

      <!-- 时间轴视图 -->
      <div v-if="viewMode === 'timeline'" class="timeline-view">
        <div class="timeline-container">
          <div 
            v-for="(practice, index) in filteredPractices" 
            :key="practice.id"
            class="timeline-item"
            :class="{ 'current': practice.isCurrent, 'completed': practice.isCompleted }"
          >
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-line" v-if="index < filteredPractices.length - 1"></div>
            </div>
            
            <div class="timeline-content">
              <div class="practice-card">
                <div class="practice-header">
                  <div class="company-info">
                    <h4 class="company-name">{{ practice.companyName }}</h4>
                    <span class="position-title">{{ practice.position }}</span>
                  </div>
                  <div class="practice-status" :class="practice.status">
                    {{ practice.statusText }}
                  </div>
                </div>
                
                <div class="practice-details">
                  <div class="detail-row">
                    <span class="detail-label">任职时间：</span>
                    <span class="detail-value">{{ practice.startDate }} - {{ practice.endDate || '至今' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">总时长：</span>
                    <span class="detail-value">{{ practice.totalHours }} 小时</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">月均时长：</span>
                    <span class="detail-value">{{ practice.monthlyHours }} 小时/月</span>
                  </div>
                </div>
                
                <div class="work-description">
                  <h5>主要工作内容：</h5>
                  <p>{{ practice.workDescription }}</p>
                </div>
                
                <div class="practice-actions">
                  <button class="btn btn-outline" @click="editPractice(practice)">编辑</button>
                  <button class="btn btn-danger" @click="deletePractice(practice.id)">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="list-view">
        <div class="practices-grid">
          <div 
            v-for="practice in filteredPractices" 
            :key="practice.id"
            class="practice-card-list"
            :class="{ 'current': practice.isCurrent, 'completed': practice.isCompleted }"
          >
            <div class="card-header">
              <div class="company-logo">
                <span class="logo-text">{{ practice.companyName.charAt(0) }}</span>
              </div>
              <div class="company-info">
                <h4 class="company-name">{{ practice.companyName }}</h4>
                <p class="position-title">{{ practice.position }}</p>
              </div>
              <div class="practice-status" :class="practice.status">
                {{ practice.statusText }}
              </div>
            </div>
            
            <div class="card-body">
              <div class="work-description">
                <h5>主要工作内容：</h5>
                <p>{{ practice.workDescription }}</p>
              </div>
              
              <div class="practice-metrics">
                <div class="metric-item">
                  <span class="metric-label">任职时间</span>
                  <span class="metric-value">{{ practice.startDate }} - {{ practice.endDate || '至今' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">总时长</span>
                  <span class="metric-value">{{ practice.totalHours }} 小时</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">月均时长</span>
                  <span class="metric-value">{{ practice.monthlyHours }} 小时/月</span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <button class="btn btn-outline" @click="editPractice(practice)">编辑</button>
              <button class="btn btn-danger" @click="deletePractice(practice.id)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑兼职经历弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑兼职经历' : '添加兼职经历' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="savePractice" class="practice-form">
            <div class="form-group">
              <label for="companyName">企业名称 *</label>
              <input 
                type="text" 
                id="companyName" 
                v-model="formData.companyName" 
                required
                placeholder="请输入企业名称"
              >
            </div>
            
            <div class="form-group">
              <label for="position">所任职位 *</label>
              <input 
                type="text" 
                id="position" 
                v-model="formData.position" 
                required
                placeholder="请输入职位名称"
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="startDate">开始时间 *</label>
                <input 
                  type="date" 
                  id="startDate" 
                  v-model="formData.startDate" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="endDate">结束时间</label>
                <input 
                  type="date" 
                  id="endDate" 
                  v-model="formData.endDate"
                  :disabled="formData.isCurrent"
                >
              </div>
            </div>
            
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="formData.isCurrent"
                  @change="handleCurrentChange"
                >
                <span class="checkbox-text">当前仍在职</span>
              </label>
            </div>
            
            <div class="form-group">
              <label for="workDescription">主要工作内容 *</label>
              <textarea 
                id="workDescription" 
                v-model="formData.workDescription" 
                required
                placeholder="请详细描述您在该企业的主要工作内容和职责"
                rows="4"
              ></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="monthlyHours">月均兼职时长（小时）*</label>
                <input 
                  type="number" 
                  id="monthlyHours" 
                  v-model="formData.monthlyHours" 
                  required
                  min="1"
                  placeholder="请输入月均兼职时长"
                >
              </div>
              
              <div class="form-group">
                <label for="totalHours">总兼职时长（小时）</label>
                <input 
                  type="number" 
                  id="totalHours" 
                  v-model="formData.totalHours" 
                  readonly
                  placeholder="自动计算"
                >
              </div>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
          <button type="submit" class="btn btn-primary" @click="savePractice">
            {{ isEditing ? '更新' : '添加' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// 时间筛选选项
const timePeriods = [
  { label: '近半年', value: '6months' },
  { label: '近一年', value: '1year' },
  { label: '近两年', value: '2years' },
  { label: '全部', value: 'all' }
]

const selectedPeriod = ref('6months')
const viewMode = ref('timeline')

// 弹窗状态
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// 表单数据
const formData = ref({
  companyName: '',
  position: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  workDescription: '',
  monthlyHours: 0,
  totalHours: 0
})

// 模拟兼职经历数据 - 7条数据
const practices = ref([
  {
    id: 1,
    companyName: '北京智学教育科技有限公司',
    position: '数学课程顾问',
    startDate: '2025-08-01',
    endDate: '2026-01-31',
    isCurrent: false,
    isCompleted: true,
    status: 'completed',
    statusText: '进行中',
    workDescription: '负责高中数学在线课程的研发和优化，参与课程体系设计，制定教学标准，指导教研团队进行课程内容开发。协助产品团队进行用户需求调研，优化课程体验，提升用户满意度。',
    monthlyHours: 40,
    totalHours: 240
  },
  {
    id: 2,
    companyName: '上海数学思维研究院',
    position: '高级研究员',
    startDate: '2025-04-01',
    endDate: null,
    isCurrent: true,
    isCompleted: false,
    status: 'current',
    statusText: '进行中',
    workDescription: '负责数学思维培养相关研究项目，包括理论框架构建、实践案例收集、教学效果评估等。参与制定行业标准，为教育机构提供专业咨询服务，推动数学教育创新发展。',
    monthlyHours: 30,
    totalHours: 150
  },
  {
    id: 3,
    companyName: '深圳创新教育集团',
    position: '教学总监',
    startDate: '2025-06-01',
    endDate: '2026-11-30',
    isCurrent: false,
    isCompleted: true,
    status: 'completed',
    statusText: '进行中',
    workDescription: '负责集团数学教学体系的整体规划和实施，建立教学质量监控体系，培训教师团队，提升整体教学水平。参与制定教学大纲和评价标准，推动教学改革和创新。',
    monthlyHours: 50,
    totalHours: 300
  },
  {
    id: 4,
    companyName: '广州智慧教育科技有限公司',
    position: '技术顾问',
    startDate: '2025-01-15',
    endDate: '2025-08-15',
    isCurrent: true,
    isCompleted: false,
    status: 'current',
    statusText: '已结束',
    workDescription: '为教育科技产品提供数学教学专业指导，参与AI教学系统的算法优化，设计个性化学习路径，提升系统智能化水平。协助产品团队进行功能设计和用户体验优化。',
    monthlyHours: 25,
    totalHours: 75
  },
  {
    id: 5,
    companyName: '杭州数学竞赛培训中心',
    position: '竞赛指导专家',
    startDate: '2025-03-01',
    endDate: '2025-12-31',
    isCurrent: false,
    isCompleted: true,
    status: 'completed',
    statusText: '进行中',
    workDescription: '负责高中数学竞赛培训课程的设计与实施，指导学生参加各类数学竞赛。开发竞赛培训教材，建立分层教学体系，培养学生在数学竞赛中的解题思维和应试技巧。',
    monthlyHours: 35,
    totalHours: 350
  },
  {
    id: 6,
    companyName: '成都教育科技研究院',
    position: '教研专家',
    startDate: '2025-05-01',
    endDate: null,
    isCurrent: true,
    isCompleted: false,
    status: 'current',
    statusText: '进行中',
    workDescription: '参与数学教育信息化项目研究，开发数字化教学资源，设计在线学习平台。负责教师培训课程开发，提升教师信息化教学能力，推动教育数字化转型。',
    monthlyHours: 20,
    totalHours: 60
  },
  {
    id: 7,
    companyName: '南京师范大学出版社',
    position: '教材编写顾问',
    startDate: '2025-09-01',
    endDate: '2026-06-30',
    isCurrent: false,
    isCompleted: true,
    status: 'completed',
    statusText: '进行中',
    workDescription: '参与高中数学教材的编写和修订工作，负责数学概念体系构建和习题设计。与编辑团队协作，确保教材内容的科学性、系统性和实用性，为全国高中数学教学提供优质资源。',
    monthlyHours: 45,
    totalHours: 405
  }
])

// 计算属性
const totalHours = computed(() => {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  return practices.value
    .filter(practice => {
      const startDate = new Date(practice.startDate)
      return startDate >= sixMonthsAgo
    })
    .reduce((total, practice) => total + practice.totalHours, 0)
})

const totalCompanies = computed(() => {
  return new Set(practices.value.map(p => p.companyName)).size
})

const activePositions = computed(() => {
  return practices.value.filter(p => p.isCurrent).length
})

const averageHoursPerMonth = computed(() => {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  
  const currentMonthPractices = practices.value.filter(practice => {
    const startDate = new Date(practice.startDate)
    const endDate = practice.endDate ? new Date(practice.endDate) : new Date()
    
    return startDate.getMonth() + 1 <= currentMonth && 
           startDate.getFullYear() <= currentYear &&
           (endDate.getMonth() + 1 >= currentMonth || practice.isCurrent)
  })
  
  return currentMonthPractices.reduce((total, practice) => total + practice.monthlyHours, 0)
})

const trendClass = computed(() => {
  // 模拟趋势计算
  return 'trend-up'
})

const trendIcon = computed(() => {
  return '📈'
})

const trendText = computed(() => {
  return '较上月增长 12%'
})

const filteredPractices = computed(() => {
  let filtered = practices.value
  
  // 按时间筛选
  const now = new Date()
  let cutoffDate
  
  switch (selectedPeriod.value) {
    case '6months':
      cutoffDate = new Date()
      cutoffDate.setMonth(cutoffDate.getMonth() - 6)
      break
    case '1year':
      cutoffDate = new Date()
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1)
      break
    case '2years':
      cutoffDate = new Date()
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 2)
      break
    case 'all':
    default:
      return filtered
  }
  
  filtered = filtered.filter(practice => {
    const startDate = new Date(practice.startDate)
    return startDate >= cutoffDate
  })
  
  // 按开始时间排序（最新的在前）
  return filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
})

// 监听月均时长变化，自动计算总时长
watch([formData.value.monthlyHours, formData.value.startDate, formData.value.endDate], () => {
  if (formData.value.monthlyHours && formData.value.startDate) {
    const startDate = new Date(formData.value.startDate)
    const endDate = formData.value.endDate ? new Date(formData.value.endDate) : new Date()
    
    const diffTime = Math.abs(endDate - startDate)
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    
    formData.value.totalHours = formData.value.monthlyHours * diffMonths
  }
})

// 方法
const addPractice = () => {
  isEditing.value = false
  editingId.value = null
  resetForm()
  showModal.value = true
}

const editPractice = (practice) => {
  isEditing.value = true
  editingId.value = practice.id
  formData.value = { ...practice }
  showModal.value = true
}

const deletePractice = (id) => {
  if (confirm('确定要删除这条兼职经历吗？')) {
    const index = practices.value.findIndex(p => p.id === id)
    if (index > -1) {
      practices.value.splice(index, 1)
    }
  }
}

const savePractice = () => {
  if (isEditing.value) {
    // 更新现有记录
    const index = practices.value.findIndex(p => p.id === editingId.value)
    if (index > -1) {
      practices.value[index] = {
        ...formData.value,
        id: editingId.value,
        isCompleted: !formData.value.isCurrent,
        status: formData.value.isCurrent ? 'current' : 'completed',
        statusText: formData.value.isCurrent ? '进行中' : '已结束'
      }
    }
  } else {
    // 添加新记录
    const newId = Math.max(...practices.value.map(p => p.id)) + 1
    practices.value.push({
      ...formData.value,
      id: newId,
      isCompleted: !formData.value.isCurrent,
      status: formData.value.isCurrent ? 'current' : 'completed',
      statusText: formData.value.isCurrent ? '进行中' : '已结束'
    })
  }
  
  closeModal()
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    companyName: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    workDescription: '',
    monthlyHours: 0,
    totalHours: 0
  }
}

const handleCurrentChange = () => {
  if (formData.value.isCurrent) {
    formData.value.endDate = ''
  }
}
</script>

<style scoped>
.industry-practice-page {
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

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
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

.main-stat {
  background: linear-gradient(135deg, #5856d6, #7e7eff);
  color: white;
}

.main-stat .stat-icon {
  background: rgba(255,255,255,0.2);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #34c759, #30d158);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.main-stat .stat-number {
  color: white;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.main-stat .stat-label {
  color: rgba(255,255,255,0.9);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
}

.trend-up {
  color: #34c759;
}

.trend-down {
  color: #ff3b30;
}

.trend-icon {
  font-size: 14px;
}

/* 筛选区域 */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
}

.time-filter h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.filter-options {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #5856d6;
  color: #5856d6;
}

.filter-btn.active {
  background: #5856d6;
  color: white;
  border-color: #5856d6;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-btn:hover {
  border-color: #5856d6;
  color: #5856d6;
}

.toggle-btn.active {
  background: #5856d6;
  color: white;
  border-color: #5856d6;
}

.toggle-icon {
  font-size: 16px;
}

/* 兼职经历区域 */
.practice-section {
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

.add-practice-btn .btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  font-size: 16px;
}

/* 时间轴视图 */
.timeline-view {
  position: relative;
}

.timeline-container {
  position: relative;
  padding-left: 30px;
}

.timeline-item {
  position: relative;
  margin-bottom: 32px;
}

.timeline-marker {
  position: absolute;
  left: -30px;
  top: 0;
  width: 20px;
  height: 20px;
}

.marker-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e0e0e0;
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: relative;
  z-index: 2;
}

.timeline-item.current .marker-dot {
  background: #34c759;
  box-shadow: 0 0 0 4px rgba(52,199,89,0.2);
}

.timeline-item.completed .marker-dot {
  background: #5856d6;
}

.marker-line {
  position: absolute;
  top: 20px;
  left: 8px;
  width: 4px;
  height: 40px;
  background: #e0e0e0;
  z-index: 1;
}

.timeline-content {
  margin-left: 20px;
}

.practice-card {
  background: #f8f9ff;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.timeline-item.current .practice-card {
  border-color: #34c759;
  background: linear-gradient(135deg, #f0fff4, #e6f7f1);
}

.timeline-item.completed .practice-card {
  border-color: #5856d6;
  background: linear-gradient(135deg, #f0f4ff, #eef2ff);
}

.practice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.position-title {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.practice-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.practice-status.current {
  background: #e6f7f1;
  color: #26a872;
}

.practice-status.completed {
  background: #eef2ff;
  color: #5856d6;
}

.practice-details {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-row {
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

.work-description h5 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.work-description p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.practice-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 列表视图 */
.list-view {
  margin-top: 20px;
}

.practices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.practice-card-list {
  background: #f8f9ff;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.practice-card-list.current {
  border-color: #34c759;
  background: linear-gradient(135deg, #f0fff4, #e6f7f1);
}

.practice-card-list.completed {
  border-color: #5856d6;
  background: linear-gradient(135deg, #f0f4ff, #eef2ff);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.company-logo {
  width: 48px;
  height: 48px;
  background: #5856d6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.position-title {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.card-body {
  margin-bottom: 16px;
}

.practice-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.metric-item {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.metric-value {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.card-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #5856d6;
  color: white;
}

.btn-primary:hover {
  background: #4c4ac2;
}

.btn-outline {
  background: transparent;
  color: #5856d6;
  border: 1px solid #5856d6;
}

.btn-outline:hover {
  background: #f0f4ff;
}

.btn-danger {
  background: #ff3b30;
  color: white;
}

.btn-danger:hover {
  background: #d70015;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
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
  max-width: 600px;
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

.practice-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #5856d6;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 14px;
  color: #333;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .filter-section {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .practices-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .practice-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
