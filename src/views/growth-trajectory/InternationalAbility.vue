<template>
  <div class="international-ability-page">
    <div class="page-header">
      <div class="header-content">
        <div>
          <h2>国际能力</h2>
        </div>
        <button class="btn btn-primary" @click="showAddModal = true">
          <i class="icon">+</i>
          添加项目
        </button>
      </div>
    </div>

    <!-- 项目类型统计 -->
    <div class="statistics-section">
      <h3 class="section-title">项目统计</h3>
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in projectStats" :key="stat.type">
          <div class="stat-icon" :style="{ backgroundColor: stat.color }">
            {{ stat.icon }}
          </div>
          <div class="stat-content">
            <h4 class="stat-number">{{ stat.count }}</h4>
            <p class="stat-label">{{ stat.type }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目筛选 -->
    <div class="filter-section">
      <div class="filter-controls">
        <select v-model="selectedType" class="filter-select">
          <option value="">全部类型</option>
          <option v-for="type in projectTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索项目名称..." 
          class="search-input"
        >
      </div>
    </div>

    <!-- 项目列表 -->
    <div class="projects-section">
      <h3 class="section-title">国际项目</h3>
      <div class="projects-grid">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card"
        >
          <div class="project-header">
            <div class="project-type-badge" :style="{ backgroundColor: getTypeColor(project.type) }">
              {{ project.type }}
            </div>
            <div class="project-actions">
              <button class="action-btn" @click="editProject(project)">编辑</button>
              <button class="action-btn delete" @click="deleteProject(project.id)">删除</button>
            </div>
          </div>
          
          <div class="project-content">
            <h4 class="project-name">{{ project.name }}</h4>
            <p class="project-description">{{ project.description }}</p>
            
            <div class="project-meta">
              <div class="meta-item">
                <span class="meta-label">项目时间：</span>
                <span class="meta-value">{{ project.startDate }} - {{ project.endDate }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">参与人数：</span>
                <span class="meta-value">{{ project.participantCount }}人</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">项目状态：</span>
                <span class="meta-value">{{ project.status }}</span>
              </div>
            </div>

            <div class="attachments" v-if="project.attachments && project.attachments.length > 0">
              <span class="attachments-label">成果附件：</span>
              <div class="attachments-list">
                <a 
                  v-for="(attachment, index) in project.attachments" 
                  :key="index"
                  :href="attachment.url" 
                  target="_blank"
                  class="attachment-item"
                >
                  <i class="attachment-icon">{{ getAttachmentIcon(attachment.type) }}</i>
                  <span class="attachment-name">{{ attachment.name }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredProjects.length === 0" class="empty-state">
        <div class="empty-icon">🌍</div>
        <h3>暂无国际项目</h3>
        <p>{{ searchKeyword || selectedType ? '没有找到匹配的项目' : '开始添加您的第一个国际项目' }}</p>
      </div>
    </div>

    <!-- 添加/编辑项目模态框 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '编辑项目' : '添加项目' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <form @submit.prevent="saveProject" class="project-form">
          <div class="form-group">
            <label>项目名称 *</label>
            <input 
              v-model="currentProject.name" 
              type="text" 
              required 
              placeholder="请输入项目名称"
            >
          </div>

          <div class="form-group">
            <label>项目类型 *</label>
            <select v-model="currentProject.type" required>
              <option value="">请选择类型</option>
              <option v-for="type in projectTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>项目描述 *</label>
            <textarea 
              v-model="currentProject.description" 
              required 
              placeholder="请输入项目简要描述"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>开始时间 *</label>
              <input v-model="currentProject.startDate" type="date" required>
            </div>
            <div class="form-group">
              <label>结束时间</label>
              <input v-model="currentProject.endDate" type="date">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>参与人数 *</label>
              <input 
                v-model.number="currentProject.participantCount" 
                type="number" 
                required 
                min="1"
                placeholder="请输入参与人数"
              >
            </div>
            <div class="form-group">
              <label>项目状态 *</label>
              <select v-model="currentProject.status" required>
                <option value="">请选择状态</option>
                <option value="进行中">进行中</option>
                <option value="已完成">已完成</option>
                <option value="暂停">暂停</option>
                <option value="规划中">规划中</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>成果附件</label>
            <div class="file-upload-area" @click="triggerFileUpload">
              <input 
                ref="fileInput" 
                type="file" 
                multiple 
                @change="handleFileUpload"
                style="display: none"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
              >
              <div class="upload-content">
                <i class="upload-icon">📎</i>
                <p>点击上传附件或拖拽文件到此处</p>
                <span class="upload-hint">支持 PDF, DOC, PPT, 图片等格式</span>
              </div>
            </div>
            
            <div class="attachments-preview" v-if="currentProject.attachments.length > 0">
              <div 
                v-for="(attachment, index) in currentProject.attachments" 
                :key="index"
                class="attachment-preview"
              >
                <i class="attachment-icon">{{ getAttachmentIcon(attachment.type) }}</i>
                <span class="attachment-name">{{ attachment.name }}</span>
                <button type="button" @click="removeAttachment(index)" class="remove-btn">×</button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
            <button type="submit" class="btn btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 数据定义
const projects = ref([
  {
    id: 1,
    name: '中美合作办学项目',
    type: '合作办学',
    description: '与美国斯坦福大学合作开展计算机科学双学位项目，培养具有国际视野的复合型人才',
    startDate: '2022-09-01',
    endDate: '2025-06-30',
    status: '进行中',
    participantCount: 45,
    attachments: [
      { name: '合作协议书.pdf', type: 'pdf', url: '#' },
      { name: '项目实施方案.docx', type: 'doc', url: '#' }
    ]
  },
  {
    id: 2,
    name: '国际教育技术大会',
    type: '国际会议',
    description: '参加在德国柏林举办的国际教育技术大会，发表关于AI在教育中应用的主题演讲',
    startDate: '2023-07-15',
    endDate: '2023-07-18',
    status: '已完成',
    participantCount: 8,
    attachments: [
      { name: '会议邀请函.pdf', type: 'pdf', url: '#' },
      { name: '演讲PPT.pptx', type: 'ppt', url: '#' },
      { name: '会议照片.jpg', type: 'image', url: '#' }
    ]
  },
  {
    id: 3,
    name: '英国剑桥大学访学交流',
    type: '访学交流',
    description: '在剑桥大学教育学院进行为期6个月的访学，研究英国高等教育体系与教学方法',
    startDate: '2023-02-01',
    endDate: '2023-07-31',
    status: '已完成',
    participantCount: 1,
    attachments: [
      { name: '访学邀请函.pdf', type: 'pdf', url: '#' },
      { name: '研究报告.docx', type: 'doc', url: '#' },
      { name: '访学证书.pdf', type: 'pdf', url: '#' }
    ]
  }
])

const projectTypes = ref([
  '合作办学',
  '国际会议',
  '访学交流'
])

// 模态框状态
const showAddModal = ref(false)
const showEditModal = ref(false)
const currentProject = ref({
  name: '',
  type: '',
  description: '',
  startDate: '',
  endDate: '',
  status: '',
  participantCount: 1,
  attachments: []
})
const fileInput = ref(null)

// 筛选状态
const selectedType = ref('')
const searchKeyword = ref('')

// 计算属性
const projectStats = computed(() => {
  const stats = {}
  const colors = {
    '合作办学': '#4F46E5',
    '国际会议': '#059669',
    '访学交流': '#DC2626'
  }
  const icons = {
    '合作办学': '🤝',
    '国际会议': '🏛️',
    '访学交流': '✈️'
  }
  
  projects.value.forEach(project => {
    if (!stats[project.type]) {
      stats[project.type] = {
        type: project.type,
        count: 0,
        color: colors[project.type] || '#6B7280',
        icon: icons[project.type] || '📊'
      }
    }
    stats[project.type].count++
  })
  
  return Object.values(stats)
})

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchesType = !selectedType.value || project.type === selectedType.value
    const matchesKeyword = !searchKeyword.value || 
      project.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    return matchesType && matchesKeyword
  })
})

// 方法
const getTypeColor = (type) => {
  const colors = {
    '合作办学': '#4F46E5',
    '国际会议': '#059669',
    '访学交流': '#DC2626'
  }
  return colors[type] || '#6B7280'
}

const getAttachmentIcon = (type) => {
  const icons = {
    'pdf': '📄',
    'doc': '',
    'docx': '',
    'ppt': '📊',
    'pptx': '📊',
    'image': '🖼️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️'
  }
  return icons[type] || '📎'
}

const editProject = (project) => {
  currentProject.value = { ...project }
  showEditModal.value = true
}

const deleteProject = (id) => {
  if (confirm('确定要删除这个项目吗？')) {
    const index = projects.value.findIndex(p => p.id === id)
    if (index > -1) {
      projects.value.splice(index, 1)
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetForm()
}

const resetForm = () => {
  currentProject.value = {
    name: '',
    type: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
    participantCount: 1,
    attachments: []
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    const attachment = {
      name: file.name,
      type: file.type.split('/')[1] || 'unknown',
      url: URL.createObjectURL(file)
    }
    currentProject.value.attachments.push(attachment)
  })
}

const removeAttachment = (index) => {
  currentProject.value.attachments.splice(index, 1)
}

const saveProject = () => {
  if (showEditModal.value) {
    const index = projects.value.findIndex(p => p.id === currentProject.value.id)
    if (index > -1) {
      projects.value[index] = { ...currentProject.value }
    }
  } else {
    const newProject = {
      ...currentProject.value,
      id: Date.now()
    }
    projects.value.push(newProject)
  }
  closeModal()
}
</script>

<style scoped>
.international-ability-page {
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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #4f46e5;
  margin: 0 0 8px 0;
  display: flex;
}

.page-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 统计卡片 */
.statistics-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid rgba(255,255,255,0.4);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 16px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 4px 0;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 30px;
}

.filter-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.filter-select,
.search-input {
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.filter-select {
  min-width: 150px;
}

.search-input {
  flex: 1;
  max-width: 300px;
}

/* 项目网格 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.project-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
  border: 1px solid rgba(255,255,255,0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.1);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.project-type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.project-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  background: #f8fafc;
  color: #64748b;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.action-btn.delete:hover {
  background: #fef2f2;
  color: #dc2626;
}

.project-content {
  padding: 20px;
}

.project-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.project-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.project-meta {
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 13px;
}

.meta-label {
  color: #64748b;
  min-width: 80px;
}

.meta-value {
  color: #333;
  font-weight: 500;
}

/* 附件样式 */
.attachments {
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.attachments-label {
  font-size: 13px;
  color: #64748b;
  display: block;
  margin-bottom: 8px;
}

.attachments-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-decoration: none;
  color: #475569;
  font-size: 12px;
  transition: all 0.2s ease;
}

.attachment-item:hover {
  background: #e2e8f0;
  color: #334155;
}

.attachment-icon {
  font-size: 14px;
}

.attachment-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-secondary {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f1f5f9;
}

/* 模态框 */
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
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
}

.project-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

/* 文件上传区域 */
.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafbfc;
}

.file-upload-area:hover {
  border-color: #4f46e5;
  background: #f8f9ff;
}

.upload-content {
  color: #6b7280;
}

.upload-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}

.upload-content p {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

.attachments-preview {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attachment-preview {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  font-size: 12px;
  color: #0369a1;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 14px;
  margin-left: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    max-width: none;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
