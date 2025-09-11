<template>
  <div class="archive-management">
    <!-- 顶部导航标签和创建档案按钮 -->
    <div class="nav-section">
      <div class="nav-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          class="nav-tab-wrapper"
        >
          <div 
            :class="['nav-tab', { active: activeTab === tab.id }]"
            @click="switchTab(tab.id)"
          >
            {{ tab.name }}
          </div>
          <span class="tab-count" v-if="tab.id !== 'all'">
            {{ getTabCount(tab.id) }}
          </span>
        </div>
      </div>
      <button class="add-btn" @click="createArchive">
        <span class="add-icon">+</span>
        创建档案
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载档案数据...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredArchives.length === 0" class="empty-state">
      <div class="empty-icon">📁</div>
      <p>暂无档案</p>
      <small>点击"创建档案"开始管理您的档案信息</small>
    </div>

    <!-- 档案卡片网格 -->
    <div v-else class="archives-grid">
      <div 
        v-for="(archive, index) in filteredArchives" 
        :key="index"
        class="archive-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="card-header">
          <div class="title">{{ archive.name }}</div>
          <div :class="['type-tag', `type-${archive.format}`]">
            {{ archive.formatText }}
          </div>
        </div>
        
        <div class="card-content">
          <!-- 档案缩略图 -->
          <div class="thumbnail-section">
            <div class="thumbnail-container">
              <img 
                v-if="archive.thumbnail" 
                :src="archive.thumbnail" 
                :alt="archive.name"
                class="archive-thumbnail"
                @error="handleImageError"
              />
              <div v-else class="thumbnail-placeholder">
                <span class="format-icon">{{ getFormatIcon(archive.format) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 档案简介 -->
          <div class="description-section">
            <div class="description-text">
              {{ archive.description }}
            </div>
          </div>
          
          <!-- 档案信息 -->
          <div class="archive-info">
            <div class="info-item">
              <span class="info-label">档案格式：</span>
              <span class="info-value">{{ archive.formatText }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">文件大小：</span>
              <span class="info-value">{{ formatFileSize(archive.size) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">生成时间：</span>
              <span class="info-value">{{ archive.createTime }}</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="meta-info">
            <span class="archive-time">{{ archive.createTime }}</span>
            <span class="archive-size">{{ formatFileSize(archive.size) }}</span>
          </div>
          <div class="action-buttons">
            <button class="action-btn preview-btn" @click="previewArchive(archive)">
              预览
            </button>
            <button class="action-btn download-btn" @click="downloadArchive(archive)">
              下载
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 档案预览模态框 -->
    <div v-if="previewArchiveData" class="archive-preview-modal" @click="closeArchivePreview">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ previewArchiveData.name }}</h3>
          <button class="close-btn" @click="closeArchivePreview">×</button>
        </div>
        <div class="modal-body">
          <img v-if="previewArchiveData.thumbnail" :src="previewArchiveData.thumbnail" alt="档案预览" />
          <div class="preview-info">
            <p><strong>档案格式：</strong>{{ previewArchiveData.formatText }}</p>
            <p><strong>文件大小：</strong>{{ formatFileSize(previewArchiveData.size) }}</p>
            <p><strong>生成时间：</strong>{{ previewArchiveData.createTime }}</p>
            <p><strong>档案简介：</strong>{{ previewArchiveData.description }}</p>
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
  { id: 'all', name: '全部' },
  { id: 'word', name: 'Word' },
  { id: 'pdf', name: 'PDF' },
  { id: 'ppt', name: 'PPT' },
  { id: 'image', name: '图片' },
  { id: 'video', name: '视频' },
  { id: 'webpage', name: '网页' }
]

const activeTab = ref('all')
const loading = ref(true)
const previewArchiveData = ref(null)

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

// 档案数据
const archives = [
  {
    name: '数据结构课程教学大纲',
    format: 'word',
    formatText: 'Word文档',
    description: '数据结构课程的教学大纲，包含课程目标、教学内容、考核方式等详细信息，为教学提供指导性文件。',
    thumbnail: getRandomImage(),
    size: 2048576,
    createTime: '2024-01-15'
  },
  {
    name: '算法设计实验报告',
    format: 'pdf',
    formatText: 'PDF文档',
    description: '算法设计课程的实验报告，详细记录了各种算法的实现过程、性能分析和优化方案。',
    thumbnail: getRandomImage(),
    size: 4096000,
    createTime: '2024-02-20'
  },
  {
    name: '软件工程课程PPT',
    format: 'ppt',
    formatText: 'PPT演示',
    description: '软件工程课程的完整PPT课件，包含软件生命周期、需求分析、系统设计等核心内容。',
    thumbnail: getRandomImage(),
    size: 15360000,
    createTime: '2024-03-10'
  },
  {
    name: '教学活动现场照片',
    format: 'image',
    formatText: '图片文件',
    description: '教学实践活动的现场照片集，记录了学生参与项目开发、团队协作的精彩瞬间。',
    thumbnail: getRandomImage(),
    size: 8192000,
    createTime: '2024-04-05'
  },
  {
    name: '课程教学视频',
    format: 'video',
    formatText: '视频文件',
    description: '数据结构课程的教学视频，详细讲解了链表、栈、队列等核心概念和实现方法。',
    thumbnail: getRandomImage(),
    size: 104857600,
    createTime: '2024-05-12'
  },
  {
    name: '在线学习资源链接',
    format: 'webpage',
    formatText: '网页链接',
    description: '收集整理的优质在线学习资源，包含MOOC平台、技术博客、开源项目等学习资料。',
    thumbnail: null,
    size: 0,
    createTime: '2024-06-01'
  },
  {
    name: '学生作品集',
    format: 'pdf',
    formatText: 'PDF文档',
    description: '学生优秀作品集，展示了学生在课程学习中的创新思维和实践能力。',
    thumbnail: getRandomImage(),
    size: 6144000,
    createTime: '2024-06-15'
  },
  {
    name: '教学反思笔记',
    format: 'word',
    formatText: 'Word文档',
    description: '教学过程中的反思笔记，记录了教学方法的改进、学生反馈的总结和教学效果的评估。',
    thumbnail: null,
    size: 1024000,
    createTime: '2024-07-01'
  }
]

// 根据选中的标签过滤档案
const filteredArchives = computed(() => {
  if (activeTab.value === 'all') {
    return archives
  }
  return archives.filter(a => a.format === activeTab.value)
})

// 获取标签对应的档案数量
const getTabCount = (tabId) => {
  if (tabId === 'all') return 0
  return archives.filter(a => a.format === tabId).length
}

// 切换标签
const switchTab = (tabId) => {
  activeTab.value = tabId
}

// 创建档案
const createArchive = () => {
  console.log('打开创建档案')
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

// 预览档案
const previewArchive = (archive) => {
  previewArchiveData.value = archive
}

// 关闭档案预览
const closeArchivePreview = () => {
  previewArchiveData.value = null
}

// 下载档案
const downloadArchive = (archive) => {
  console.log('下载档案:', archive.name)
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
.archive-management {
  padding: 24px;
  min-height: 100vh;
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

.nav-tab-wrapper {
  flex: 1;
  position: relative;
  min-width: 100px;
}

.nav-tab {
  width: 100%;
  padding: 12px 16px;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  white-space: nowrap;
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
  top: 0px;
  right: 25px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 50%;
  min-width: 16px;
  height: 16px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  z-index: 20;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

/* 档案卡片网格 */
.archives-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.archive-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.archive-card:hover {
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
  display: flex;
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
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.archive-thumbnail {
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

/* 档案信息 */
.archive-info {
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

.archive-time {
  color: #666;
  font-weight: 500;
}

.archive-size {
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

/* 档案预览模态框 */
.archive-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  cursor: default;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-body img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}

.preview-info p {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.preview-info strong {
  color: #666;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .archives-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .archives-grid {
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