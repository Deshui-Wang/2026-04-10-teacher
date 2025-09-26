<template>
  <div class="teaching-achievements-container">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-tabs">
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'all' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="all" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">全部</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'teaching-reform' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="teaching-reform" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">教改项目</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'teaching-competition' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="teaching-competition" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">教学比赛</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'industry-practice' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="industry-practice" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">行业实践</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'research-innovation' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="research-innovation" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">科研创新</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'textbook-writing' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="textbook-writing" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">教材编写</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'student-achievements' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="student-achievements" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">学生成果</span>
          </label>
        </div>
        
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索成果名称或编号..."
            class="search-input"
          >
          <i class="search-icon">🔍</i>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <div class="section-header">
        <h2>教学成果：{{ filteredAchievements.length }}</h2>
        <div class="view-toggle">
          <el-button-group>
            <el-button 
              :type="viewMode === 'list' ? 'primary' : ''" 
              @click="viewMode = 'list'"
              size="small"
            >
              列表视图
            </el-button>
            <el-button 
              :type="viewMode === 'card' ? 'primary' : ''" 
              @click="viewMode = 'card'"
              size="small"
            >
              卡片视图
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 数据列表/卡片 -->
      <div class="content-area">
        <!-- 列表视图 -->
        <div v-if="viewMode === 'list'" class="list-view">
          <div class="table-header">
            <div class="col-name">成果名称</div>
            <div class="col-number">成果编号</div>
            <div class="col-type">成果类型</div>
            <div class="col-publish">发布时间</div>
            <div class="col-docs">资料附件</div>
            <div class="col-upload">上传</div>
            <div class="col-action">操作</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="achievement in filteredAchievements" 
              :key="achievement.id" 
              class="table-row"
            >
              <div class="col-name">{{ achievement.name }}</div>
              <div class="col-number">{{ achievement.number }}</div>
              <div class="col-type">
                <span 
                  class="type-badge" 
                  :class="getTypeBadgeClass(achievement.type)"
                >
                  {{ getAchievementTypeName(achievement.type) }}
                </span>
              </div>
              <div class="col-publish">{{ achievement.publishDate }}</div>
              <div class="col-docs">
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in achievement.documents" 
                    :key="index"
                    class="doc-item"
                    @click="viewDocument(doc)"
                  >
                    📄 {{ doc.name }}
                  </span>
                </div>
              </div>
              <div class="col-upload">
                <button 
                  class="upload-btn-small" 
                  @click="uploadDocument(achievement)"
                >
                  上传
                </button>
              </div>
              <div class="col-action">
                <button 
                  class="view-btn-small" 
                  @click="viewAchievement(achievement)"
                >
                  查看
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片视图 -->
        <div v-if="viewMode === 'card'" class="card-view">
          <div 
            v-for="achievement in filteredAchievements" 
            :key="achievement.id" 
            class="achievement-card"
          >
            <div class="card-header">
              <h3 class="achievement-name">{{ achievement.name }}</h3>
              <span 
                class="type-badge" 
                :class="getTypeBadgeClass(achievement.type)"
              >
                {{ getAchievementTypeName(achievement.type) }}
              </span>
            </div>
            
            <div class="card-content">
              <div class="info-row">
                <span class="label">成果编号：</span>
                <span class="value">{{ achievement.number }}</span>
              </div>
              <div class="info-row">
                <span class="label">发布时间：</span>
                <span class="value">{{ achievement.publishDate }}</span>
              </div>
              <div class="info-row">
                <span class="label">资料附件：</span>
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in achievement.documents" 
                    :key="index"
                    class="doc-item"
                    @click="viewDocument(doc)"
                  >
                    �� {{ doc.name }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <button 
                class="upload-btn-primary" 
                @click="uploadDocument(achievement)"
              >
                上传资料
              </button>
              <button 
                class="view-btn-primary" 
                @click="viewAchievement(achievement)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredAchievements.length === 0" class="empty-state">
          <div class="empty-icon">🏆</div>
          <h3>暂无教学成果记录</h3>
          <p>您还没有添加任何教学成果信息</p>
        </div>
      </div>
    </div>

    <!-- 成果详情弹窗 -->
    <div v-if="showAchievementModal" class="modal-overlay" @click="closeAchievementModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedAchievement?.name }}</h3>
          <button class="close-btn" @click="closeAchievementModal">×</button>
        </div>
        <div class="modal-body">
          <div class="achievement-image">
            <img 
              :src="selectedAchievement?.image" 
              :alt="selectedAchievement?.name"
              @error="handleImageError"
            >
          </div>
          <div class="achievement-info">
            <div class="info-item">
              <span class="label">成果编号：</span>
              <span class="value">{{ selectedAchievement?.number }}</span>
            </div>
            <div class="info-item">
              <span class="label">成果类型：</span>
              <span class="value">
                <span 
                  class="type-badge" 
                  :class="getTypeBadgeClass(selectedAchievement?.type)"
                >
                  {{ getAchievementTypeName(selectedAchievement?.type) }}
                </span>
              </span>
            </div>
            <div class="info-item">
              <span class="label">发布时间：</span>
              <span class="value">{{ selectedAchievement?.publishDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">成果描述：</span>
              <span class="value">{{ selectedAchievement?.description }}</span>
            </div>
            <div class="info-item">
              <span class="label">资料附件：</span>
              <div class="docs-list">
                <span 
                  v-for="(doc, index) in selectedAchievement?.documents" 
                  :key="index"
                  class="doc-item"
                  @click="viewDocument(doc)"
                >
                  📄 {{ doc.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文档查看弹窗 -->
    <div v-if="showDocumentModal" class="modal-overlay" @click="closeDocumentModal">
      <div class="modal-content document-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedDocument?.name }}</h3>
          <button class="close-btn" @click="closeDocumentModal">×</button>
        </div>
        <div class="modal-body">
          <div class="document-viewer">
            <div class="document-info">
              <p><strong>文件名：</strong>{{ selectedDocument?.name }}</p>
              <p><strong>文件大小：</strong>{{ selectedDocument?.size }}</p>
              <p><strong>上传时间：</strong>{{ selectedDocument?.uploadTime }}</p>
            </div>
            <div class="document-preview">
              <div class="preview-placeholder">
                <div class="preview-icon">📄</div>
                <p>{{ selectedDocument?.name }}</p>
                <button class="download-btn" @click="downloadDocument(selectedDocument)">
                  下载文档
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传弹窗 -->
    <div v-if="showUploadModal" class="modal-overlay" @click="closeUploadModal">
      <div class="modal-content upload-modal" @click.stop>
        <div class="modal-header">
          <h3>上传资料附件</h3>
          <button class="close-btn" @click="closeUploadModal">×</button>
        </div>
        <div class="modal-body">
          <div class="upload-area">
            <div class="upload-zone" @click="triggerFileInput">
              <div class="upload-icon">📁</div>
              <p>点击选择文件或拖拽文件到此处</p>
              <p class="upload-hint">支持 PDF、DOC、DOCX、JPG、PNG 格式</p>
            </div>
            <input 
              ref="fileInput" 
              type="file" 
              multiple 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              @change="handleFileSelect"
              style="display: none"
            >
          </div>
          <div class="uploaded-files" v-if="selectedFiles.length > 0">
            <h4>已选择文件：</h4>
            <div class="file-list">
              <div 
                v-for="(file, index) in selectedFiles" 
                :key="index"
                class="file-item"
              >
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <button class="remove-file-btn" @click="removeFile(index)">×</button>
              </div>
            </div>
          </div>
          <div class="upload-actions">
            <button class="cancel-btn" @click="closeUploadModal">取消</button>
            <button class="confirm-btn" @click="confirmUpload" :disabled="selectedFiles.length === 0">
              确认上传
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const selectedFilter = ref('all')
const searchKeyword = ref('')
const viewMode = ref('list')
const showAchievementModal = ref(false)
const showDocumentModal = ref(false)
const showUploadModal = ref(false)
const selectedAchievement = ref(null)
const selectedDocument = ref(null)
const selectedFiles = ref([])
const fileInput = ref(null)

// 成果类型映射
const achievementTypeMap = {
  'teaching-reform': '教改项目',
  'teaching-competition': '教学比赛',
  'industry-practice': '行业实践',
  'research-innovation': '科研创新',
  'textbook-writing': '教材编写',
  'student-achievements': '学生成果'
}

// 模拟教学成果数据
const achievements = ref([
  {
    id: 1,
    name: '基于项目驱动的软件工程课程教学改革',
    number: 'TA2024001',
    publishDate: '2024-01-15',
    type: 'teaching-reform',
    description: '通过项目驱动的教学模式，提升学生的实践能力和创新思维，获得省级教学改革项目立项。',
    image: '/pic/data.png',
    documents: [
      { name: '教改项目申请书.pdf', size: '2.1MB', uploadTime: '2024-01-10' },
      { name: '项目实施方案.docx', size: '1.5MB', uploadTime: '2024-01-12' }
    ]
  },
  {
    id: 2,
    name: '全国高校青年教师教学竞赛一等奖',
    number: 'TA2024002',
    publishDate: '2023-11-20',
    type: 'teaching-competition',
    description: '在全国高校青年教师教学竞赛中获得工科组一等奖，展现了优秀的教学能力和创新教学方法。',
    image: '/pic/data.png',
    documents: [
      { name: '获奖证书.pdf', size: '1.8MB', uploadTime: '2023-11-25' },
      { name: '教学设计方案.docx', size: '2.3MB', uploadTime: '2023-11-18' }
    ]
  },
  {
    id: 3,
    name: '华为技术有限公司校企合作项目',
    number: 'TA2023003',
    publishDate: '2023-08-10',
    type: 'industry-practice',
    description: '与华为技术有限公司合作开展产学研项目，为学生提供企业实践机会，提升就业竞争力。',
    image: '/pic/data.png',
    documents: [
      { name: '合作协议书.pdf', size: '1.2MB', uploadTime: '2023-07-20' },
      { name: '项目总结报告.docx', size: '2.8MB', uploadTime: '2023-09-15' }
    ]
  },
  {
    id: 4,
    name: '基于人工智能的教育评价系统研究',
    number: 'TA2024004',
    publishDate: '2024-03-05',
    type: 'research-innovation',
    description: '开发基于人工智能技术的教育评价系统，为个性化教学提供数据支持，获得国家自然科学基金资助。',
    image: '/pic/data.png',
    documents: [
      { name: '研究论文.pdf', size: '3.2MB', uploadTime: '2024-03-01' },
      { name: '专利申请文件.pdf', size: '1.5MB', uploadTime: '2024-03-03' }
    ]
  },
  {
    id: 5,
    name: '《现代软件工程》教材编写',
    number: 'TA2024005',
    publishDate: '2024-02-20',
    type: 'textbook-writing',
    description: '主编《现代软件工程》教材，结合最新技术发展和教学实践，为软件工程专业提供优质教学资源。',
    image: '/pic/data.png',
    documents: [
      { name: '教材样章.pdf', size: '4.5MB', uploadTime: '2024-02-18' },
      { name: '编写大纲.docx', size: '892KB', uploadTime: '2024-02-15' }
    ]
  },
  {
    id: 6,
    name: '学生团队获得全国大学生软件设计大赛金奖',
    number: 'TA2024006',
    publishDate: '2024-01-30',
    type: 'student-achievements',
    description: '指导的学生团队在全国大学生软件设计大赛中获得金奖，体现了优秀的教学指导能力。',
    image: '/pic/data.png',
    documents: [
      { name: '获奖证书.pdf', size: '1.1MB', uploadTime: '2024-01-28' },
      { name: '作品展示视频.mp4', size: '15.2MB', uploadTime: '2024-01-29' }
    ]
  },
  {
    id: 7,
    name: '混合式教学模式创新实践',
    number: 'TA2024007',
    publishDate: '2024-04-10',
    type: 'teaching-reform',
    description: '探索线上线下混合式教学模式，提高教学效果和学生参与度，形成可推广的教学经验。',
    image: '/pic/data.png',
    documents: [
      { name: '教学模式研究报告.pdf', size: '2.6MB', uploadTime: '2024-04-08' },
      { name: '教学效果分析.xlsx', size: '1.3MB', uploadTime: '2024-04-09' }
    ]
  },
  {
    id: 8,
    name: '腾讯教育合作项目',
    number: 'TA2024008',
    publishDate: '2024-03-25',
    type: 'industry-practice',
    description: '与腾讯教育合作开展云计算技术人才培养项目，为学生提供前沿技术学习和实践机会。',
    image: '/pic/data.png',
    documents: [
      { name: '合作备忘录.pdf', size: '1.4MB', uploadTime: '2024-03-22' },
      { name: '培训计划.docx', size: '1.8MB', uploadTime: '2024-03-24' }
    ]
  }
])

// 计算属性 - 过滤后的成果列表
const filteredAchievements = computed(() => {
  let filtered = achievements.value

  // 按类型筛选
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(achievement => achievement.type === selectedFilter.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(achievement => 
      achievement.name.toLowerCase().includes(keyword) ||
      achievement.number.toLowerCase().includes(keyword) ||
      achievement.description.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 方法
const getAchievementTypeName = (type) => {
  return achievementTypeMap[type] || '未知类型'
}

const getTypeBadgeClass = (type) => {
  const typeClassMap = {
    'teaching-reform': 'type-teaching-reform',
    'teaching-competition': 'type-teaching-competition',
    'industry-practice': 'type-industry-practice',
    'research-innovation': 'type-research-innovation',
    'textbook-writing': 'type-textbook-writing',
    'student-achievements': 'type-student-achievements'
  }
  return typeClassMap[type] || 'type-unknown'
}

const viewAchievement = (achievement) => {
  selectedAchievement.value = achievement
  showAchievementModal.value = true
}

const closeAchievementModal = () => {
  showAchievementModal.value = false
  selectedAchievement.value = null
}

const viewDocument = (doc) => {
  selectedDocument.value = doc
  showDocumentModal.value = true
}

const closeDocumentModal = () => {
  showDocumentModal.value = false
  selectedDocument.value = null
}

const uploadDocument = (achievement) => {
  selectedAchievement.value = achievement
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFiles.value = []
  selectedAchievement.value = null
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const confirmUpload = () => {
  // 这里可以添加上传逻辑
  console.log('上传文件:', selectedFiles.value)
  alert('文件上传成功！')
  closeUploadModal()
}

const downloadDocument = (doc) => {
  // 这里可以添加下载逻辑
  console.log('下载文档:', doc.name)
  alert(`正在下载 ${doc.name}`)
}

const handleImageError = (event) => {
  event.target.src = '/pic/data.png'
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.teaching-achievements-container {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.filter-tabs {
  display: flex;
  gap: 16px;
  flex: 1;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  user-select: none;
  padding: 4px 0;
}

.filter-tab:hover {
  color: #3b82f6;
}

.filter-tab.active {
  color: #3b82f6;
}

.filter-checkbox {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
  accent-color: #3b82f6;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.search-box {
  position: relative;
  min-width: 300px;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

/* 内容区域 */
.content-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e6f1;
  background: #f8f9ff;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.view-toggle {
  display: flex;
  gap: 4px;
}

/* 列表视图 */
.list-view {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 2.5fr 1.5fr 1.5fr 1.2fr 2fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.table-body {
  min-height: 200px;
}

.table-row {
  display: grid;
  grid-template-columns: 2.5fr 1.5fr 1.5fr 1.2fr 2fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.col-name {
  font-weight: 500;
  color: #1f2937;
}

.col-number {
  color: #6b7280;
  font-family: monospace;
  font-size: 13px;
}

.col-type {
  color: #4b5563;
  font-size: 13px;
}

.col-publish {
  color: #6b7280;
  font-size: 13px;
}

/* 文档列表样式 */
.docs-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-item {
  display: inline-block;
  padding: 2px 6px;
  background: #e0f2fe;
  color: #0277bd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-right: 4px;
  margin-bottom: 2px;
}

.doc-item:hover {
  background: #b3e5fc;
}

/* 按钮样式 */
.upload-btn-small {
  padding: 4px 8px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.upload-btn-small:hover {
  background: #059669;
}

.upload-btn-primary {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
  margin-right: 8px;
}

.upload-btn-primary:hover {
  background: #059669;
}

.view-btn-small {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.view-btn-small:hover {
  background: #2563eb;
}

.view-btn-primary {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.view-btn-primary:hover {
  background: #2563eb;
}

/* 成果类型标签样式 */
.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.type-teaching-reform {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.type-teaching-competition {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.type-industry-practice {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.type-research-innovation {
  background: #f3e8ff;
  color: #7c3aed;
  border: 1px solid #e9d5ff;
}

.type-textbook-writing {
  background: #fce7f3;
  color: #be185d;
  border: 1px solid #fbcfe8;
}

.type-student-achievements {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #d1fae5;
}

.type-unknown {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

/* 卡片视图 */
.card-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 24px;
}

.achievement-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.achievement-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.achievement-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.card-content {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.label {
  color: #6b7280;
  min-width: 80px;
  margin-right: 8px;
}

.value {
  color: #374151;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #374151;
}

.empty-state p {
  font-size: 14px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.document-modal {
  max-width: 600px;
}

.upload-modal {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.achievement-image {
  text-align: center;
  margin-bottom: 20px;
}

.achievement-image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.achievement-info {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.info-item .label {
  font-weight: 500;
  color: #374151;
  min-width: 100px;
}

.info-item .value {
  color: #1f2937;
}

/* 文档查看器样式 */
.document-viewer {
  text-align: center;
}

.document-info {
  text-align: left;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.document-info p {
  margin: 8px 0;
  color: #374151;
}

.document-preview {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px;
  background: #f9fafb;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.preview-icon {
  font-size: 48px;
}

.download-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.download-btn:hover {
  background: #2563eb;
}

/* 文件上传区域样式 */
.upload-area {
  margin-bottom: 20px;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background: #f9fafb;
}

.upload-zone:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-hint {
  color: #6b7280;
  font-size: 12px;
  margin-top: 8px;
}

.uploaded-files {
  margin-bottom: 20px;
}

.uploaded-files h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.file-name {
  flex: 1;
  color: #374151;
  font-size: 14px;
}

.file-size {
  color: #6b7280;
  font-size: 12px;
  margin-right: 8px;
}

.remove-file-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file-btn:hover {
  background: #dc2626;
}

.upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-btn {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.confirm-btn:hover:not(:disabled) {
  background: #059669;
}

.confirm-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .teaching-achievements-container {
    padding: 16px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filter-tabs {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .search-box {
    min-width: auto;
    max-width: none;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .view-toggle {
    justify-content: center;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-header {
    display: none;
  }
  
  .table-row {
    display: block;
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  .col-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .col-number,
  .col-type,
  .col-publish {
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .col-docs {
    margin-bottom: 8px;
  }
  
  .col-upload,
  .col-action {
    margin-bottom: 12px;
  }
  
  .card-view {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .card-footer {
    flex-direction: column;
    gap: 8px;
  }
  
  .modal-content {
    margin: 20px;
    max-width: calc(100vw - 40px);
  }
}
</style>
