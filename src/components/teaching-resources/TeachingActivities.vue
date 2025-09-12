<template>
  <div class="teaching-activities">
    <!-- 筛选行 -->
    <div class="filter-section">
      <div class="filter-row">
        <!-- 时间筛选 -->
        <div class="filter-group">
          <label class="filter-label">时间筛选：</label>
          <select v-model="selectedTimeFilter" class="filter-select" @change="applyFilters">
            <option value="all">全部时间</option>
            <option value="2024">2024年</option>
            <option value="2023">2023年</option>
            <option value="2022">2022年</option>
            <option value="2021">2021年</option>
          </select>
        </div>

        <!-- 课程筛选 -->
        <div class="filter-group">
          <label class="filter-label">课程筛选：</label>
          <select v-model="selectedCourseFilter" class="filter-select" @change="applyFilters">
            <option value="all">全部课程</option>
            <option value="数据结构">数据结构</option>
            <option value="算法设计">算法设计</option>
            <option value="数据库">数据库</option>
            <option value="软件工程">软件工程</option>
            <option value="Web开发">Web开发</option>
            <option value="人工智能">人工智能</option>
            <option value="计算机网络">计算机网络</option>
            <option value="操作系统">操作系统</option>
            <option value="编译原理">编译原理</option>
            <option value="机器学习">机器学习</option>
            <option value="软件测试">软件测试</option>
            <option value="计算机图形学">计算机图形学</option>
            <option value="分布式系统">分布式系统</option>
            <option value="信息安全">信息安全</option>
            <option value="移动应用开发">移动应用开发</option>
            <option value="大数据技术">大数据技术</option>
            <option value="云计算">云计算</option>
            <option value="区块链技术">区块链技术</option>
          </select>
        </div>

        <!-- 清除筛选按钮 -->
        <button class="clear-filters-btn" @click="clearFilters">
          <span class="clear-icon">×</span>
          清除筛选
        </button>
      </div>
    </div>

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
        </div>
      </div>
      <button class="add-btn" @click="addActivity">
        <span class="add-icon">+</span>
        添加
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载教学经验...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="paginatedActivities.length === 0" class="empty-state">
      <div class="empty-icon">🎯</div>
      <p>暂无教学经验</p>
      <small>点击"添加教学经验"开始记录您的教学实践</small>
    </div>

    <!-- 活动卡片网格 -->
    <div v-else class="activities-grid">
      <div 
        v-for="(activity, index) in paginatedActivities" 
        :key="index"
        class="activity-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="card-header">
          <div class="title">{{ activity.title }}</div>
          <div :class="['type-tag', `type-${activity.type}`]">
            {{ activity.typeText }}
          </div>
        </div>
        
        <div class="card-content">
          <!-- 活动总结 -->
          <div class="summary-section">
            <div class="summary-text">
              {{ activity.summary }}
            </div>
          </div>
          
          <!-- 附件区域 -->
          <div v-if="activity.attachments && activity.attachments.length > 0" class="attachments-section">
            <h4 class="attachments-title">相关文档</h4>
            <div class="attachments-grid">
              <!-- 文档附件 -->
              <div 
                v-for="(attachment, idx) in activity.attachments.slice(0, 2)" 
                :key="`doc-${idx}`"
                class="attachment-item document-attachment"
                @click="downloadDocument(attachment)"
              >
                <div class="document-icon">
                  <span class="file-type">{{ getFileExtension(attachment.name) }}</span>
                </div>
                <div class="attachment-info">
                  <span class="attachment-name">{{ attachment.name }}</span>
                  <span class="attachment-size">{{ formatFileSize(attachment.size) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="meta-info">
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="pagination-btn prev-btn" 
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        上一页
      </button>
      
      <div class="pagination-pages">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          :class="['pagination-btn page-btn', { active: page === currentPage }]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="pagination-btn next-btn" 
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 导航标签数据
const tabs = [
  { id: 'all', name: '全部' },
  { id: 'preparation', name: '课前准备' },
  { id: 'implementation', name: '课堂实施' },
  { id: 'reflection', name: '课后反思' }
]

const activeTab = ref('all')
const loading = ref(true)
const currentPage = ref(1)
const pageSize = 6 // 每页显示6个卡片

// 筛选条件
const selectedTimeFilter = ref('all')
const selectedCourseFilter = ref('all')

// 教学活动数据
const activities = [
  {
    title: '数据结构课程课前准备',
    type: 'preparation',
    typeText: '课前准备',
    time: '2024-09',
    course: '数据结构',
    summary: '为数据结构课程精心准备教学材料，包括课件制作、实验环境搭建、案例设计等。通过深入分析学生基础，制定了分层教学策略，确保每个学生都能跟上课程进度。',
    attachments: [
      { type: 'document', name: '教学大纲.pdf', size: 2048576 },
      { type: 'document', name: '实验指导书.docx', size: 1536000 }
    ]
  },
  {
    title: '算法设计课堂实施',
    type: 'implementation',
    typeText: '课堂实施',
    time: '2024-10',
    course: '算法设计',
    summary: '在算法设计课程中采用项目驱动式教学，通过实际案例引导学生理解算法原理。课堂互动活跃，学生参与度高，通过小组讨论和代码演示，有效提升了学生的编程能力。',
    attachments: [
      { type: 'document', name: '课堂记录.docx', size: 1024000 },
      { type: 'document', name: '学生作品.zip', size: 5242880 }
    ]
  },
  {
    title: '数据库课程课后反思',
    type: 'reflection',
    typeText: '课后反思',
    time: '2024-11',
    course: '数据库',
    summary: '对数据库课程教学进行深入反思，总结了教学中的成功经验和不足之处。通过学生反馈和成绩分析，发现需要加强实践环节，并制定了改进方案。',
    attachments: [
      { type: 'document', name: '教学反思报告.pdf', size: 3072000 },
      { type: 'document', name: '学生反馈汇总.xlsx', size: 512000 }
    ]
  },
  {
    title: '软件工程课前准备',
    type: 'preparation',
    typeText: '课前准备',
    time: '2024-08',
    course: '软件工程',
    summary: '为软件工程课程准备企业级项目案例，联系合作企业获取真实项目需求，设计符合行业标准的教学项目，确保教学内容与市场需求紧密结合。',
    attachments: [
      { type: 'document', name: '项目需求文档.pdf', size: 4096000 },
      { type: 'document', name: '教学计划.docx', size: 768000 }
    ]
  },
  {
    title: 'Web开发课堂实施',
    type: 'implementation',
    typeText: '课堂实施',
    time: '2024-09',
    course: 'Web开发',
    summary: '在Web开发课程中采用翻转课堂模式，学生课前预习，课堂重点进行实践操作和问题解答。通过实时编码演示和在线协作，提升了教学效果。',
    attachments: [
      { type: 'document', name: '课堂实录.mp4', size: 104857600 },
      { type: 'document', name: '学生作品集.zip', size: 20971520 }
    ]
  },
  {
    title: '人工智能课程课后反思',
    type: 'reflection',
    typeText: '课后反思',
    time: '2024-10',
    course: '人工智能',
    summary: '对人工智能课程进行全面反思，分析了课程内容的深度和广度是否合适，教学方法是否有效，以及如何更好地激发学生的学习兴趣和创新思维。',
    attachments: [
      { type: 'document', name: '教学效果分析.pdf', size: 2048000 },
      { type: 'document', name: '改进方案.docx', size: 1024000 }
    ]
  },
  {
    title: '计算机网络课前准备',
    type: 'preparation',
    typeText: '课前准备',
    time: '2024-07',
    course: '计算机网络',
    summary: '为计算机网络课程准备实验环境和教学案例，搭建了完整的网络实验平台，设计了从基础到高级的系列实验，帮助学生更好地理解网络协议和通信原理。',
    attachments: [
      { type: 'document', name: '实验环境配置.pdf', size: 1536000 },
      { type: 'document', name: '实验指导手册.docx', size: 2048000 }
    ]
  },
  {
    title: '操作系统课堂实施',
    type: 'implementation',
    typeText: '课堂实施',
    time: '2024-08',
    course: '操作系统',
    summary: '在操作系统课程中采用理论与实践相结合的教学方式，通过Linux内核源码分析和系统调用实验，让学生深入理解操作系统的核心机制。',
    attachments: [
      { type: 'document', name: '内核源码分析.pdf', size: 8192000 },
      { type: 'document', name: '实验报告模板.docx', size: 512000 }
    ]
  },
  {
    title: '编译原理课后反思',
    type: 'reflection',
    typeText: '课后反思',
    time: '2024-09',
    course: '编译原理',
    summary: '对编译原理课程进行深度反思，发现学生在语法分析和语义分析环节存在困难，需要增加更多实践案例和可视化工具来辅助教学。',
    attachments: [
      { type: 'document', name: '课程反思总结.pdf', size: 2560000 },
      { type: 'document', name: '教学改进计划.docx', size: 1024000 }
    ]
  },
  {
    title: '机器学习课前准备',
    type: 'preparation',
    typeText: '课前准备',
    time: '2024-06',
    course: '机器学习',
    summary: '为机器学习课程准备数据集和实验环境，收集了多个真实数据集，搭建了GPU计算环境，设计了从监督学习到深度学习的完整实验体系。',
    attachments: [
      { type: 'document', name: '数据集说明.pdf', size: 5120000 },
      { type: 'document', name: '实验环境指南.docx', size: 1536000 }
    ]
  },
  {
    title: '软件测试课堂实施',
    type: 'implementation',
    typeText: '课堂实施',
    time: '2024-07',
    course: '软件测试',
    summary: '在软件测试课程中引入自动化测试工具和持续集成理念，通过实际项目让学生体验完整的测试流程，提升了学生的工程实践能力。',
    attachments: [
      { type: 'document', name: '测试工具使用手册.pdf', size: 3072000 },
      { type: 'document', name: '项目测试报告.docx', size: 2048000 }
    ]
  },
  {
    title: '计算机图形学课后反思',
    type: 'reflection',
    typeText: '课后反思',
    time: '2024-08',
    course: '计算机图形学',
    summary: '对计算机图形学课程进行反思，发现需要加强数学基础的教学，同时引入更多现代图形学技术，如光线追踪和实时渲染等。',
    attachments: [
      { type: 'document', name: '课程评估报告.pdf', size: 4096000 },
      { type: 'document', name: '教学改进建议.docx', size: 1280000 }
    ]
  },
  {
    title: '分布式系统课前准备',
    type: 'preparation',
    typeText: '课前准备',
    time: '2024-05',
    course: '分布式系统',
    summary: '为分布式系统课程准备云平台环境和微服务案例，设计了从单机到分布式的渐进式实验，帮助学生理解分布式系统的核心概念。',
    attachments: [
      { type: 'document', name: '云平台配置指南.pdf', size: 2048000 },
      { type: 'document', name: '微服务案例集.docx', size: 3072000 }
    ]
  },
  {
    title: '信息安全课堂实施',
    type: 'implementation',
    typeText: '课堂实施',
    time: '2024-06',
    course: '信息安全',
    summary: '在信息安全课程中采用攻防对抗的教学模式，通过模拟攻击和防护实验，让学生深入理解安全威胁和防护措施。',
    attachments: [
      { type: 'document', name: '安全实验手册.pdf', size: 6144000 },
      { type: 'document', name: '攻防案例集.docx', size: 2560000 }
    ]
  },
  {
    title: '移动应用开发课后反思',
    type: 'reflection',
    typeText: '课后反思',
    time: '2024-07',
    course: '移动应用开发',
    summary: '对移动应用开发课程进行反思，发现需要更新技术栈，引入更多跨平台开发框架，同时加强用户体验设计方面的教学。',
    attachments: [
      { type: 'document', name: '技术栈更新计划.pdf', size: 1536000 },
      { type: 'document', name: '课程大纲修订.docx', size: 1024000 }
    ]
  },
  {
    title: '大数据技术课前准备',
    type: 'preparation',
    typeText: '课前准备',
    time: '2024-04',
    course: '大数据技术',
    summary: '为大数据技术课程准备Hadoop和Spark集群环境，收集了多个真实的大数据集，设计了从数据采集到分析可视化的完整实验流程。',
    attachments: [
      { type: 'document', name: '集群搭建指南.pdf', size: 8192000 },
      { type: 'document', name: '数据集说明.docx', size: 2048000 }
    ]
  },
  {
    title: '云计算课堂实施',
    type: 'implementation',
    typeText: '课堂实施',
    time: '2024-05',
    course: '云计算',
    summary: '在云计算课程中采用项目驱动的教学方式，通过AWS和阿里云平台让学生体验真实的云服务，完成了多个云原生应用的开发部署。',
    attachments: [
      { type: 'document', name: '云平台使用手册.pdf', size: 5120000 },
      { type: 'document', name: '项目部署指南.docx', size: 3072000 }
    ]
  },
  {
    title: '区块链技术课后反思',
    type: 'reflection',
    typeText: '课后反思',
    time: '2024-06',
    course: '区块链技术',
    summary: '对区块链技术课程进行反思，发现需要加强密码学基础的教学，同时引入更多实际应用案例，帮助学生理解区块链技术的实际价值。',
    attachments: [
      { type: 'document', name: '课程总结报告.pdf', size: 4096000 },
      { type: 'document', name: '应用案例集.docx', size: 2560000 }
    ]
  }
]

// 统计信息计算
const totalActivities = computed(() => activities.length)
const preparationCount = computed(() => activities.filter(a => a.type === 'preparation').length)
const implementationCount = computed(() => activities.filter(a => a.type === 'implementation').length)
const reflectionCount = computed(() => activities.filter(a => a.type === 'reflection').length)

// 根据选中的标签和筛选条件过滤活动
const filteredActivities = computed(() => {
  let result = activities

  // 按类型过滤
  if (activeTab.value !== 'all') {
    result = result.filter(a => a.type === activeTab.value)
  }

  // 按时间过滤
  if (selectedTimeFilter.value !== 'all') {
    result = result.filter(a => a.time.startsWith(selectedTimeFilter.value))
  }

  // 按课程过滤
  if (selectedCourseFilter.value !== 'all') {
    result = result.filter(a => a.course === selectedCourseFilter.value)
  }

  return result
})

// 分页相关计算
const totalPages = computed(() => Math.ceil(filteredActivities.value.length / pageSize))

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredActivities.value.slice(start, end)
})

// 可见页码
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 获取标签对应的活动数量
const getTabCount = (tabId) => {
  if (tabId === 'all') return 0
  return activities.filter(a => a.type === tabId).length
}

// 切换标签
const switchTab = (tabId) => {
  activeTab.value = tabId
  currentPage.value = 1 // 切换标签时重置到第一页
}

// 应用筛选
const applyFilters = () => {
  currentPage.value = 1 // 应用筛选时重置到第一页
}

// 清除筛选
const clearFilters = () => {
  selectedTimeFilter.value = 'all'
  selectedCourseFilter.value = 'all'
  currentPage.value = 1
}

// 分页导航
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 添加教学活动
const addActivity = () => {
  console.log('打开添加教学经验')
}

// 下载文档
const downloadDocument = (attachment) => {
  console.log('下载文档:', attachment.name)
  // 这里可以实现实际的下载逻辑
}

// 获取文件扩展名
const getFileExtension = (filename) => {
  return filename.split('.').pop().toUpperCase()
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
.teaching-activities {
  padding: 24px;
  min-height: 100vh;
  width: 100%;
}

/* 筛选区域样式 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-group {
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
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.filter-select:hover {
  border-color: #8b5cf6;
}

.filter-select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
}

.clear-filters-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.clear-icon {
  font-size: 16px;
  font-weight: bold;
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
  white-space: nowrap;
  min-width: 100px;
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
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
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

/* 活动卡片网格 */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(370px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.activity-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.activity-card:hover {
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

.type-preparation {
  background-color: #059669;
}

.type-implementation {
  background-color: #dc2626;
}

.type-reflection {
  background-color: #2563eb;
}

/* 卡片内容 */
.card-content {
  margin-bottom: 16px;
}

/* 活动总结区域 */
.summary-section {
  margin-bottom: 20px;
}

.summary-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.summary-text {
  font-size: 14px;
  line-height: 1.6;
  color: #353535;
  text-align: justify;
}

/* 附件区域 */
.attachments-section {
  margin-top: 16px;
}

.attachments-title {
  font-size: 14px;
  color: #626262;
  margin: 0 0 12px 0;
  display: flex;
  flex-direction: row;
}

.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.attachment-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.attachment-item:hover {
  transform: translateY(-2px);
}

/* 文档附件 */
.document-attachment {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  height: 120px;
  justify-content: center;
}

.document-icon {
  width: 40px;
  height: 40px;
  background: #8b5cf6;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
}

.attachment-info {
  text-align: center;
  width: 100%;
}

.attachment-info .attachment-name {
  display: block;
  font-size: 11px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attachment-size {
  font-size: 10px;
  color: #666;
}

/* 卡片底部 */
.card-footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.activity-time {
  color: #666;
  font-weight: 500;
}

/* 分页器样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  padding: 20px 0;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 40px;
  text-align: center;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

.pagination-pages {
  display: flex;
  gap: 4px;
}

.page-btn {
  min-width: 40px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .activities-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .activities-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .filter-select {
    min-width: auto;
  }
  
  .clear-filters-btn {
    margin-left: 0;
    justify-content: center;
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
  
  .attachments-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .pagination-btn {
    padding: 6px 12px;
    font-size: 12px;
    min-width: 32px;
  }
}
</style> 