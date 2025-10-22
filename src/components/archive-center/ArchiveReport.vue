<template>
  <div class="archive-report">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-label">时间范围：</label>
          <select v-model="timeFilter" class="filter-select">
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
            <option value="year">本年</option>
            <option value="custom">自定义</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-label">搜索：</label>
          <div class="search-input-wrapper">
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="搜索报告名称..."
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
        </div>
        <button class="create-btn" @click="createReport">
          <span class="create-icon">+</span>
          创建
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载报告数据...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredReports.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <p>暂无报告</p>
      <small>点击"创建"按钮开始创建您的报告</small>
    </div>

    <!-- 报告卡片网格 -->
    <div v-else class="reports-grid">
      <div 
        v-for="(report, index) in filteredReports" 
        :key="index"
        class="report-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="card-header">
          <div class="title">{{ report.name }}</div>
          <div :class="['type-tag', `type-${report.format}`]">
            {{ report.formatText }}
          </div>
        </div>
        
        <div class="card-content">
          <!-- 报告缩略图 -->
          <div class="thumbnail-section">
            <div class="thumbnail-container">
              <img 
                v-if="report.thumbnail" 
                :src="report.thumbnail" 
                :alt="report.name"
                class="report-thumbnail"
                @error="handleImageError"
              />
              <div v-else class="thumbnail-placeholder">
                <span class="format-icon">{{ getFormatIcon(report.format) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 报告简介 -->
          <div class="description-section">
            <div class="description-text">
              {{ report.description }}
            </div>
          </div>
          
          <!-- 报告信息 -->
          <div class="report-info">
            <div class="info-item">
              <span class="info-label">报告格式：</span>
              <span class="info-value">{{ report.formatText }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">文件大小：</span>
              <span class="info-value">{{ formatFileSize(report.size) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">创建时间：</span>
              <span class="info-value">{{ report.createTime }}</span>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="meta-info">
            <span class="report-time">{{ report.createTime }}</span>
            <span class="report-size">{{ formatFileSize(report.size) }}</span>
          </div>
          <div class="action-buttons">
            <button class="action-btn preview-btn" @click="previewReport(report)">
              预览
            </button>
            <button class="action-btn download-btn" @click="downloadReport(report)">
              下载
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 报告详细预览组件 -->
    <ArchiveDetailPreview 
      v-if="previewReportData" 
      :reportData="previewReportData"
      @close="closeReportPreview" 
    />

    <!-- 报告创建模态框 -->
    <ReportCreationModal 
      v-if="showReportModal" 
      @close="closeReportModal" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ReportCreationModal from "./report-components/ReportCreationModal.vue"
import ArchiveDetailPreview from "./ArchiveDetailPreview.vue"

// 筛选条件
const timeFilter = ref('all')
const searchKeyword = ref('')
const loading = ref(true)
const previewReportData = ref(null)
const showReportModal = ref(false)

// 可用的图片列表
const availableImages = [
  '/pic/learning/0f0.jpeg',
  '/pic/learning/68.jpg',
  '/pic/learning/814.jpg',
  '/pic/learning/84.png',
  '/pic/learning/42.jpeg',
  '/pic/learning/808.jpg',
  '/pic/learning/212.jpg',
  '/pic/learning/20.jpeg',
  '/pic/learning/97.png',
  '/pic/learning/24.png',
  '/pic/learning/banner3.jpeg',
  '/pic/learning/banner1.png',
  '/pic/learning/banner2.png'
]

// 随机获取图片
const getRandomImage = () => {
  return availableImages[Math.floor(Math.random() * availableImages.length)]
}

// 报告数据
const reports = [
  {
    name: '2025下学期教学工作计划',
    format: 'word',
    formatText: 'Word',
    description: '数据结构课程的教学大纲，包含课程目标、教学内容、考核方式等详细信息，为教学提供指导性文件。',
    thumbnail: getRandomImage(),
    size: 2048576,
    createTime: '2024-01-15'
  },
  {
    name: '2025上学期教学工作报告',
    format: 'pdf',
    formatText: 'PDF',
    description: '算法设计课程的实验报告，详细记录了各种算法的实现过程、性能分析和优化方案。',
    thumbnail: getRandomImage(),
    size: 4096000,
    createTime: '2024-02-20'
  },
  {
    name: '2024-2025教学工作计划',
    format: 'ppt',
    formatText: 'PPT',
    description: '软件工程课程的完整PPT课件，包含软件生命周期、需求分析、系统设计等核心内容。',
    thumbnail: getRandomImage(),
    size: 15360000,
    createTime: '2024-03-10'
  },
  {
    name: '2024学生人工智能作品集',
    format: 'pdf',
    formatText: 'PDF',
    description: '学生优秀作品集，展示了学生在课程学习中的创新思维和实践能力。',
    thumbnail: getRandomImage(),
    size: 6144000,
    createTime: '2024-06-15'
  },
  {
    name: '2024-2025教学工作总结',
    format: 'word',
    formatText: 'Word',
    description: '教学过程中的反思笔记，记录了教学方法的改进、学生反馈的总结和教学效果的评估。',
    thumbnail: null,
    size: 1024000,
    createTime: '2024-07-01'
  }
]

// 根据筛选条件过滤报告
const filteredReports = computed(() => {
  let filtered = reports

  // 按时间筛选
  if (timeFilter.value !== 'all') {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    filtered = filtered.filter(report => {
      const reportDate = new Date(report.createTime)
      
      switch (timeFilter.value) {
        case 'today':
          return reportDate >= today
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return reportDate >= weekAgo
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          return reportDate >= monthAgo
        case 'quarter':
          const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
          return reportDate >= quarterAgo
        case 'year':
          const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
          return reportDate >= yearAgo
        default:
          return true
      }
    })
  }

  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(report => 
      report.name.toLowerCase().includes(keyword) ||
      report.description.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 创建报告
const createReport = () => {
  showReportModal.value = true
}

// 关闭报告创建模态框
const closeReportModal = () => {
  showReportModal.value = false
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// 获取格式图标
const getFormatIcon = (format) => {
  const icons = {
    word: '📄',
    pdf: '📕',
    ppt: '📊',
    image: '🖼️',
    video: '🎥',
    webpage: '🌐'
  }
  return icons[format] || '📁'
}

// 预览报告 - 生成完整的报告数据
const previewReport = (report) => {
  // 根据截图中的模块类型生成三个模块
  const moduleTypes = [
    {
      name: '成果奖励',
      icon: '🏆',
      chartTitle: '成果奖励统计',
      chartType: '柱状图',
      chartData: [
        { label: '论文', value: 85 },
        { label: '专利', value: 65 },
        { label: '证书', value: 90 },
        { label: '项目', value: 75 }
      ],
      summary: '本学期在成果奖励方面表现突出，共获得各类奖项12项，其中国家级奖项2项，省级奖项5项，市级奖项5项。发表学术论文8篇，其中核心期刊论文3篇。申请专利3项，已授权2项。这些成果充分体现了教学与科研工作的高质量发展。',
      metrics: [
        { label: '总计奖项', value: '12项' },
        { label: '核心论文', value: '3篇' },
        { label: '授权专利', value: '2项' },
        { label: '完成度', value: '85%' }
      ]
    },
    {
      name: '工作量统计',
      icon: '📊',
      chartTitle: '工作量分布',
      chartType: '柱状图',
      chartData: [
        { label: '教学', value: 78 },
        { label: '科研', value: 82 },
        { label: '管理', value: 68 },
        { label: '服务', value: 72 }
      ],
      summary: '本学期工作量饱满，教学工作时长累计368学时，超额完成教学任务20%。科研工作投入时间占比28%，主持科研项目2项，参与项目3项。承担班主任工作和教研室管理工作，服务学生和教师群体。整体工作量分布合理，各项工作均衡发展。',
      metrics: [
        { label: '教学学时', value: '368时' },
        { label: '科研项目', value: '5项' },
        { label: '管理工作', value: '2项' },
        { label: '超额完成', value: '20%' }
      ]
    },
    {
      name: '数字素养',
      icon: '💻',
      chartTitle: '数字素养能力',
      chartType: '柱状图',
      chartData: [
        { label: '信息技术', value: 88 },
        { label: '数据分析', value: 92 },
        { label: '工具应用', value: 85 },
        { label: '创新能力', value: 80 }
      ],
      summary: '在数字化教学方面表现优秀，熟练运用各类教学软件和在线教学平台，积极探索智慧课堂建设。完成教育技术能力培训并获得高级证书，在数据分析和可视化方面具有较强能力。开发教学辅助工具3个，提升了教学效率和学生学习体验。',
      metrics: [
        { label: '掌握工具', value: '15种' },
        { label: '开发应用', value: '3个' },
        { label: '培训证书', value: '高级' },
        { label: '综合评分', value: '88分' }
      ]
    }
  ]

  // 构建完整的预览数据
  previewReportData.value = {
    name: report.name,
    createTime: report.createTime,
    modules: moduleTypes,
    overallSummary: {
      overview: `${report.name}全面展示了教师在本学期的工作成果和专业发展情况。通过对成果奖励、工作量统计和数字素养三个核心维度的系统分析，可以看出教师在教学、科研和专业能力提升方面均取得了显著成绩。各项指标数据真实反映了教师的工作投入和成长轨迹，为后续的职业发展规划提供了重要参考依据。`,
      highlights: [
        '成果奖励丰硕，获得国家级、省级、市级奖项共12项，体现了较高的专业水平',
        '工作量饱满且分布合理，教学学时超额完成20%，科研项目推进顺利',
        '数字素养能力突出，掌握现代教育技术工具，积极推动智慧教学创新',
        '论文发表质量高，核心期刊论文3篇，学术影响力持续提升',
        '专利申请与授权进展良好，科研成果转化能力强'
      ],
      recommendations: [
        '继续保持科研工作的高投入，力争在核心期刊发表更多高质量论文',
        '加强跨学科交流与合作，拓展研究视野和研究领域',
        '进一步提升数字化教学创新能力，开发更多教学辅助工具',
        '注重工作与生活平衡，合理分配时间和精力，保持可持续发展',
        '积极参与学术会议和专业培训，及时了解学科前沿动态'
      ]
    }
  }
}

// 关闭报告预览
const closeReportPreview = () => {
  previewReportData.value = null
}

// 下载报告
const downloadReport = (report) => {
  console.log('下载报告:', report.name)
  // 这里可以实现实际的下载逻辑
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 模拟加载数据
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.archive-report {
  padding: 24px;
  min-height: 100vh;
}

/* 筛选区域样式 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 8px 12px 8px 36px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 250px;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  font-size: 14px;
}

.create-btn {
  background: linear-gradient(135deg, #1976d2, #1890ff);
  color: white;
  border: none;
  padding: 10px 20px;
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
  margin-left: auto;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.create-icon {
  font-size: 16px;
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

/* 报告卡片网格 */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(370px, 1fr));
  gap: 20px;
}

.report-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.report-card:hover {
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
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
}

.title {
  font-weight: 600;
  color: #333;
  font-size: 16px;
  line-height: 1.4;
  flex: 1;
}

/* 类型标签 */
.type-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
}

.type-word {
  background-color: #2563eb;
}

.type-pdf {
  background-color: #dc2626;
}

.type-ppt {
  background-color: #ea580c;
}

.type-image {
  background-color: #059669;
}

.type-video {
  background-color: #7c3aed;
}

.type-webpage {
  background-color: #0891b2;
}

/* 卡片内容 */
.card-content {
  margin-bottom: 16px;
}

/* 缩略图区域 */
.thumbnail-section {
  margin-bottom: 16px;
}

.thumbnail-container {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.report-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.format-icon {
  font-size: 48px;
  opacity: 0.6;
}

/* 描述区域 */
.description-section {
  margin-bottom: 16px;
}

.description-text {
  font-size: 14px;
  line-height: 1.6;
  color: #353535;
  text-align: justify;
}

/* 报告信息 */
.report-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 600;
}

/* 卡片底部 */
.card-footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.report-time {
  color: #666;
  font-weight: 500;
}

.report-size {
  color: #666;
  font-weight: 500;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-btn {
  background: #8b5cf6;
  color: white;
}

.preview-btn:hover {
  background: #7c3aed;
}

.download-btn {
  background: #059669;
  color: white;
}

.download-btn:hover {
  background: #047857;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .reports-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .create-btn {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
  
  .card-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: center;
  }
}
</style>
