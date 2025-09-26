<template>
  <div class="personal-growth-archive">
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
              placeholder="搜索成长档案名称..."
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载成长档案数据...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredArchives.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <p>暂无成长档案</p>
      <small>点击"创建档案"按钮开始创建您的成长档案</small>
    </div>

    <!-- 成长档案列表表格 -->
    <div v-else class="archive-table-container">
      <table class="archive-table">
        <thead>
          <tr>
            <th class="col-name">档案名称</th>
            <th class="col-format">档案格式</th>
            <th class="col-purpose">用途</th>
            <th class="col-attachment">资料附件</th>
            <th class="col-time">创建时间</th>
            <th class="col-views">已阅人次</th>
            <th class="col-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(archive, index) in filteredArchives" 
            :key="archive.id"
            class="archive-row"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <!-- 档案名称 -->
            <td class="col-name">
              <div class="name-cell">
                <div class="name-icon">
                  <span class="format-icon">{{ getFormatIcon(archive.format) }}</span>
                </div>
                <div class="name-content">
                  <div class="name-title">{{ archive.name }}</div>
                  <div class="name-desc">{{ archive.description }}</div>
                </div>
              </div>
            </td>
            
            <!-- 档案格式 -->
            <td class="col-format">
              <span :class="['format-tag', `format-${archive.format}`]">
                {{ archive.formatText }}
              </span>
            </td>
            
            <!-- 用途 -->
            <td class="col-purpose">
              <span :class="['purpose-tag', `purpose-${archive.purpose}`]">
                {{ archive.purposeText }}
              </span>
            </td>
            
            <!-- 资料附件 -->
            <td class="col-attachment">
              <div class="attachment-info">
                <div class="attachment-count">{{ archive.attachmentCount }} 个文件</div>
                <div class="attachment-size">{{ formatFileSize(archive.totalSize) }}</div>
              </div>
            </td>
            
            <!-- 创建时间 -->
            <td class="col-time">
              <div class="time-info">
                <div class="create-time">{{ formatDate(archive.createTime) }}</div>
                <div class="update-time">更新：{{ formatDate(archive.updateTime) }}</div>
              </div>
            </td>
            
            <!-- 已阅人次 -->
            <td class="col-views">
              <div class="views-info">
                <span class="views-count">{{ archive.viewCount }}</span>
                <span class="views-label">次</span>
              </div>
            </td>
            
            <!-- 操作 -->
            <td class="col-actions">
              <div class="action-buttons">
                <button 
                  class="action-btn preview-btn" 
                  @click="previewArchive(archive)"
                  title="预览"
                >
                  <span class="btn-icon">预览</span>
                </button>
                <button 
                  class="action-btn download-btn" 
                  @click="downloadArchive(archive)"
                  title="下载"
                >
                  <span class="btn-icon">下载</span>
                </button>
                <button 
                  class="action-btn edit-btn" 
                  @click="editArchive(archive)"
                  title="编辑"
                >
                  <span class="btn-icon">编辑</span>
                </button>
                <button 
                  class="action-btn delete-btn" 
                  @click="deleteArchive(archive)"
                  title="删除"
                >
                  <span class="btn-icon">删除</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div v-if="filteredArchives.length > 0" class="pagination-container">
      <div class="pagination-info">
        共 {{ totalCount }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
      </div>
      <div class="pagination-controls">
        <button 
          class="page-btn" 
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
        >
          上一页
        </button>
        <span class="page-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            :class="['page-btn', { active: page === currentPage }]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </span>
        <button 
          class="page-btn" 
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const loading = ref(false)
const timeFilter = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟成长档案数据
const archives = ref([
  {
    id: 1,
    name: '2024年度个人成长总结',
    description: '包含专业技能提升、教学能力发展、学习成果等内容',
    format: 'pdf',
    formatText: 'PDF',
    purpose: 'promotion',
    purposeText: '晋升',
    attachmentCount: 4,
    totalSize: 3072000,
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-20 14:25:00',
    viewCount: 18
  },
  {
    id: 2,
    name: '教学技能提升记录',
    description: '教学方法创新、课堂管理技巧、学生互动策略等',
    format: 'docx',
    formatText: 'Word',
    purpose: 'award',
    purposeText: '评优',
    attachmentCount: 6,
    totalSize: 2048000,
    createTime: '2024-01-10 09:15:00',
    updateTime: '2024-01-18 16:40:00',
    viewCount: 12
  },
  {
    id: 3,
    name: '专业发展计划',
    description: '未来职业规划、学习目标、能力提升路径',
    format: 'pptx',
    formatText: 'PPT',
    purpose: 'other',
    purposeText: '其他',
    attachmentCount: 3,
    totalSize: 1536000,
    createTime: '2024-01-08 14:20:00',
    updateTime: '2024-01-12 11:30:00',
    viewCount: 8
  },
  {
    id: 4,
    name: '学习成果展示',
    description: '培训证书、学习笔记、实践案例等',
    format: 'zip',
    formatText: '压缩包',
    purpose: 'other',
    purposeText: '其他',
    attachmentCount: 10,
    totalSize: 8192000,
    createTime: '2024-01-05 16:45:00',
    updateTime: '2024-01-15 13:20:00',
    viewCount: 22
  },
  {
    id: 5,
    name: '教学反思与改进',
    description: '课堂反思、教学方法优化、学生反馈分析',
    format: 'pdf',
    formatText: 'PDF',
    purpose: 'promotion',
    purposeText: '晋升',
    attachmentCount: 2,
    totalSize: 1536000,
    createTime: '2024-01-03 11:10:00',
    updateTime: '2024-01-10 09:45:00',
    viewCount: 15
  }
])

// 计算属性
const filteredArchives = computed(() => {
  let filtered = archives.value

  // 时间筛选
  if (timeFilter.value !== 'all') {
    const now = new Date()
    const filterDate = getFilterDate(now, timeFilter.value)
    filtered = filtered.filter(archive => 
      new Date(archive.createTime) >= filterDate
    )
  }

  // 搜索筛选
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(archive => 
      archive.name.toLowerCase().includes(keyword) ||
      archive.description.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

const totalCount = computed(() => filteredArchives.value.length)
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 方法
const getFilterDate = (now, filter) => {
  const date = new Date(now)
  switch (filter) {
    case 'today':
      date.setHours(0, 0, 0, 0)
      return date
    case 'week':
      date.setDate(date.getDate() - 7)
      return date
    case 'month':
      date.setMonth(date.getMonth() - 1)
      return date
    case 'quarter':
      date.setMonth(date.getMonth() - 3)
      return date
    case 'year':
      date.setFullYear(date.getFullYear() - 1)
      return date
    default:
      return new Date(0)
  }
}

const getFormatIcon = (format) => {
  const icons = {
    pdf: '📄',
    docx: '📝',
    pptx: '📊',
    xlsx: '��',
    zip: '📦',
    jpg: '🖼️',
    png: '🖼️',
    mp4: '🎥'
  }
  return icons[format] || '📄'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const createArchive = () => {
  console.log('创建成长档案')
  // 这里可以打开创建档案的弹窗或跳转到创建页面
}

const previewArchive = (archive) => {
  console.log('预览成长档案:', archive.name)
  // 这里可以打开预览弹窗或跳转到预览页面
}

const downloadArchive = (archive) => {
  console.log('下载成长档案:', archive.name)
  // 这里可以触发下载
}

const editArchive = (archive) => {
  console.log('编辑成长档案:', archive.name)
  // 这里可以打开编辑弹窗或跳转到编辑页面
}

const deleteArchive = (archive) => {
  if (confirm(`确定要删除成长档案"${archive.name}"吗？`)) {
    const index = archives.value.findIndex(a => a.id === archive.id)
    if (index > -1) {
      archives.value.splice(index, 1)
    }
  }
}

// 生命周期
onMounted(() => {
  // 模拟加载
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.personal-growth-archive {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* 筛选区域 */
.filter-section {
  background: #f8fafc;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
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
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  min-width: 120px;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  font-size: 14px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 表格容器 */
.archive-table-container {
  overflow-x: auto;
}

.archive-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.archive-table th {
  background: #f8fafc;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
  text-align: center;
}

.archive-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.archive-row {
  transition: all 0.2s ease;
  animation: fadeInUp 0.3s ease forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.archive-row:hover {
  background: #f8fafc;
}

/* 列样式 */
.col-name {
  min-width: 200px;
}

.name-cell {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.name-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.format-icon {
  font-size: 16px;
}

.name-content {
  flex: 1;
  min-width: 0;
}

.name-title {
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
  word-break: break-word;
}

.name-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  word-break: break-word;
}

.col-format {
  min-width: 80px;
}

.format-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.format-pdf {
  background: #fef2f2;
  color: #dc2626;
}

.format-docx {
  background: #eff6ff;
  color: #2563eb;
}

.format-pptx {
  background: #f0fdf4;
  color: #16a34a;
}

.format-zip {
  background: #fefce8;
  color: #ca8a04;
}

.col-purpose {
  min-width: 80px;
}

.purpose-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.purpose-promotion {
  background: #fef3c7;
  color: #d97706;
}

.purpose-award {
  background: #dbeafe;
  color: #2563eb;
}

.purpose-other {
  background: #f3f4f6;
  color: #6b7280;
}

.col-attachment {
  min-width: 100px;
}

.attachment-info {
  text-align: center;
}

.attachment-count {
  font-weight: 500;
  color: #111827;
  margin-bottom: 2px;
}

.attachment-size {
  font-size: 12px;
  color: #6b7280;
}

.col-time {
  min-width: 120px;
}

.time-info {
  text-align: center;
}

.create-time {
  font-weight: 500;
  color: #111827;
  margin-bottom: 2px;
}

.update-time {
  font-size: 12px;
  color: #6b7280;
}

.col-views {
  min-width: 80px;
  text-align: center;
}

.views-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.views-count {
  font-weight: 600;
  color: #111827;
  font-size: 16px;
}

.views-label {
  font-size: 12px;
  color: #6b7280;
}

.col-actions {
  min-width: 120px;
}

.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.action-btn {
  width: 50px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.preview-btn {
  background: #f0f9ff;
  color: #0284c7;
}

.preview-btn:hover {
  background: #e0f2fe;
  transform: scale(1.1);
}

.download-btn {
  background: #f0fdf4;
  color: #16a34a;
}

.download-btn:hover {
  background: #dcfce7;
  transform: scale(1.1);
}

.edit-btn {
  background: #fefce8;
  color: #ca8a04;
}

.edit-btn:hover {
  background: #fef3c7;
  transform: scale(1.1);
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fee2e2;
  transform: scale(1.1);
}

.btn-icon {
  font-size: 12px;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .filter-item {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .archive-table {
    font-size: 12px;
  }
  
  .archive-table th,
  .archive-table td {
    padding: 8px 6px;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
