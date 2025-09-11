<template>
  <div class="achievements">
    <!-- 可视化统计图表 -->
    <div v-if="!loading" class="charts-section">
      <!-- 奖励证书 -->
      <div class="chart-card">
        <div class="chart-title">奖励证书</div>
        <div class="chart-body">
          <div class="donut">
            <svg class="donut-svg" viewBox="0 0 100 100">
              <g transform="rotate(-90 50 50)">
                <circle class="donut-track" cx="50" cy="50" r="42"/>
                <circle 
                  v-for="seg in chartsDonut.rewardCertificates" 
                  :key="`rc-${seg.key}`"
                  class="donut-seg"
                  cx="50" cy="50" r="42"
                  :stroke="seg.color"
                  :stroke-dasharray="`${seg.dash} ${donutCirc - seg.dash}`"
                  :stroke-dashoffset="seg.offset"
                />
              </g>
            </svg>
            <div class="donut-center">
              <div class="donut-total">{{ chartsTotals.rewardCertificates }}</div>
              <div class="donut-sub">总计</div>
            </div>
          </div>
          <div class="legend">
            <div v-for="item in chartsData.rewardCertificates" :key="`legend-${item.key}`" class="legend-item">
              <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-pct">{{ formatPct(item.count, chartsTotals.rewardCertificates) }}</span>
              <span class="legend-count">({{ item.count }})</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 企业合作 -->
      <div class="chart-card">
        <div class="chart-title">企业合作</div>
        <div class="chart-body">
          <div class="donut">
            <svg class="donut-svg" viewBox="0 0 100 100">
              <g transform="rotate(-90 50 50)">
                <circle class="donut-track" cx="50" cy="50" r="42"/>
                <circle 
                  v-for="seg in chartsDonut.enterpriseCooperation" 
                  :key="`ec-${seg.key}`"
                  class="donut-seg"
                  cx="50" cy="50" r="42"
                  :stroke="seg.color"
                  :stroke-dasharray="`${seg.dash} ${donutCirc - seg.dash}`"
                  :stroke-dashoffset="seg.offset"
                />
              </g>
            </svg>
            <div class="donut-center">
              <div class="donut-total">{{ chartsTotals.enterpriseCooperation }}</div>
              <div class="donut-sub">总计</div>
            </div>
          </div>
          <div class="legend">
            <div v-for="item in chartsData.enterpriseCooperation" :key="`legend-${item.key}`" class="legend-item">
              <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-pct">{{ formatPct(item.count, chartsTotals.enterpriseCooperation) }}</span>
              <span class="legend-count">({{ item.count }})</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 学生成果 -->
      <div class="chart-card">
        <div class="chart-title">学生成果</div>
        <div class="chart-body">
          <div class="donut">
            <svg class="donut-svg" viewBox="0 0 100 100">
              <g transform="rotate(-90 50 50)">
                <circle class="donut-track" cx="50" cy="50" r="42"/>
                <circle 
                  v-for="seg in chartsDonut.studentAchievements" 
                  :key="`sa-${seg.key}`"
                  class="donut-seg"
                  cx="50" cy="50" r="42"
                  :stroke="seg.color"
                  :stroke-dasharray="`${seg.dash} ${donutCirc - seg.dash}`"
                  :stroke-dashoffset="seg.offset"
                />
              </g>
            </svg>
            <div class="donut-center">
              <div class="donut-total">{{ chartsTotals.studentAchievements }}</div>
              <div class="donut-sub">总计</div>
            </div>
          </div>
          <div class="legend">
            <div v-for="item in chartsData.studentAchievements" :key="`legend-${item.key}`" class="legend-item">
              <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-pct">{{ formatPct(item.count, chartsTotals.studentAchievements) }}</span>
              <span class="legend-count">({{ item.count }})</span>
            </div>
          </div>
        </div>
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
      <button class="add-btn" @click="addAchievement">
        <span class="add-icon">+</span>
        添加
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载成果奖励...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredAchievements.length === 0" class="empty-state">
      <div class="empty-icon">🏆</div>
      <p>暂无成果奖励</p>
      <small>点击"添加成果奖励"开始记录您的成就</small>
    </div>

    <!-- 成果卡片网格 -->
    <div v-else class="achievements-grid">
      <div 
        v-for="(achievement, index) in paginatedAchievements" 
        :key="index"
        class="achievement-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="card-header">
          <div class="title">{{ achievement.title }}</div>
          <div :class="['type-tag', `type-${achievement.type}`]">
            {{ achievement.typeText }}
          </div>
        </div>
        
        <!-- 获奖信息 -->
        <div class="meta-info">
          <span class="level" v-if="achievement.level">🏅 {{ achievement.level }}</span>
        </div>
        
        <div class="card-content">
          <!-- 获奖作品和成果描述 -->
          <div class="work-section">
            <div class="work-text">
              <div class="work-name">{{ achievement.work }}</div>
              <div class="card-description">{{ achievement.description }}</div>
            </div>
          </div>
          
          <!-- 附件区域 -->
          <div v-if="achievement.attachments && achievement.attachments.filter(a => a.type === 'document').length > 0" class="attachments-section">
            <h4 class="attachments-title">获奖作品与相关材料</h4>
            <div class="attachments-list">
              <!-- 文档附件 -->
              <div 
                v-for="(attachment, idx) in achievement.attachments.filter(a => a.type === 'document')" 
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
        
        <!-- 获得时间（显示在附件下方） -->
        <div class="obtained-time">获得时间：{{ getRandomDate(achievement) }}</div>
      </div>
    </div>

    <!-- 分页器 -->
    <div v-if="totalPages > 1" class="pagination-container">
      <button @click="toPage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-btn">上一页</button>
      <span class="page-info">第</span>
      <input
        class="page-input"
        type="number"
        min="1"
        :max="totalPages"
        v-model.number="currentPage"
        @change="toPage(currentPage)"
      />
      <span class="page-info">/ 共 {{ totalPages }} 页</span>
      <button @click="toPage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-btn">下一页</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// 导航标签数据
const tabs = [
  { id: 'all', name: '全部' },
  { id: 'award', name: '教学成果' },
  { id: 'innovation', name: '科研创新' },  
  { id: 'morality', name: '师德师风' },
  { id: 'service', name: '社会服务' },
  { id: 'patent', name: '专利' },
  { id: 'guidance', name: '实习就业' },
  { id: 'practice', name: '实践合作' },
  { id: 'competition', name: '学科竞赛' },
  { id: 'paper', name: '学术论文' },
  { id: 'project', name: '科研项目' },
  { id: 'skill', name: '技能竞赛' }
]

const activeTab = ref('all')
const loading = ref(true)




// 成果奖励数据
const achievements = [
  {
    title: '基于深度学习的教学行为分析',
    type: 'paper',
    typeText: '学术论文',
    time: '2024',
    level: '核心期刊',
    work: '《基于深度学习的教学行为分析》',
    description: '该论文研究深度学习在教育教学中的应用，通过分析教学行为模式，为个性化教学提供依据。',
    attachments: [
      { type: 'document', name: '论文全文.pdf', size: 2048576 }
    ]
  },
  {
    title: '跨模态学习在智慧教育中的应用综述',
    type: 'paper',
    typeText: '学术论文',
    time: '2023',
    level: 'EI 检索',
    work: '《跨模态学习在智慧教育中的应用综述》',
    description: '系统梳理跨模态学习技术在智慧教育的典型应用场景与关键挑战。',
    attachments: [
      { type: 'document', name: '综述稿件.pdf', size: 1548576 }
    ]
  },
  {
    title: '省级优秀教师',
    type: 'morality',
    typeText: '师德师风',
    time: '2023',
    level: '省级',
    work: '省级优秀教师荣誉称号',
    description: '在教书育人、为人师表方面表现突出，教学效果显著，体现良好师德师风。',
    attachments: [
      { type: 'document', name: '荣誉证书.pdf', size: 1024000 }
    ]
  },
  {
    title: '最受学生欢迎教师',
    type: 'morality',
    typeText: '师德师风',
    time: '2022',
    level: '校级',
    work: '年度“最受学生欢迎教师”',
    description: '坚持立德树人，注重课堂育人与学生成长支持，获得学生一致好评。',
    attachments: [
      { type: 'document', name: '学生评价汇总.pdf', size: 624000 }
    ]
  },
  {
    title: '互联网+创新创业大赛指导',
    type: 'guidance',
    typeText: '实习就业',
    time: '2023',
    level: '省赛银奖',
    work: '智能校园二手交易平台',
    description: '指导学生从需求分析到系统开发全流程，最终在省级比赛中获得银奖。',
    attachments: [
      { type: 'document', name: '项目计划书.pdf', size: 3072000 }
    ]
  },
  {
    title: '大学生创新训练计划指导',
    type: 'guidance',
    typeText: '实习就业',
    time: '2024',
    level: '国家级结题优秀',
    work: '面向边缘计算的课堂互动设备',
    description: '指导学生完成国家级大创课题，成果通过校内试点应用。',
    attachments: [
      { type: 'document', name: '结题报告.pdf', size: 1180000 }
    ]
  },
  {
    title: '教学创新大赛',
    type: 'competition',
    typeText: '学科竞赛',
    time: '2024',
    level: '二等奖',
    work: '基于项目驱动的数据结构课程改革',
    description: '以“项目驱动”改革数据结构课程，创新教学方法并取得良好教学成效。',
    attachments: [
      { type: 'document', name: '教学设计方案.docx', size: 1536000 }
    ]
  },
  {
    title: '信息化教学竞赛',
    type: 'competition',
    typeText: '学科竞赛',
    time: '2022',
    level: '省级三等奖',
    work: '智慧课堂互动方案',
    description: '提出信息化背景下的课堂互动与评价一体化方案，并完成教学实证。',
    attachments: [
      { type: 'document', name: '参赛作品.zip', size: 2650000 }
    ]
  },
  {
    title: '人工智能教学资源开发与应用',
    type: 'innovation',
    typeText: '科研创新',
    time: '2022',
    level: '校级重点',
    work: 'AI 教学资源库与配套习题',
    description: '组织开发人工智能课程教学资源与习题库，探索“教-学-评”一体化创新模式。',
    attachments: [
      { type: 'document', name: '资源目录.pdf', size: 512000 }
    ]
  },
  {
    title: '课堂多模态行为识别关键技术',
    type: 'innovation',
    typeText: '科研创新',
    time: '2024',
    level: '横向合作',
    work: '视频音频与传感融合识别',
    description: '联合企业共研课堂多模态识别算法，并完成小规模部署验证。',
    attachments: [
      { type: 'document', name: '阶段报告.pdf', size: 990000 }
    ]
  },
  // 新增：教学成果（award）
  {
    title: '教学成果奖：课程思政示范案例',
    type: 'award',
    typeText: '教学成果',
    time: '2024',
    level: '校级一等奖',
    work: '《数据结构课程思政示范案例》',
    description: '将课程思政元素融入专业教学，形成可推广的示范案例并在全校范围内共享。',
    attachments: [
      { type: 'document', name: '成果报告.pdf', size: 1880000 }
    ]
  },
  {
    title: '教学成果奖：混合式教学改革',
    type: 'award',
    typeText: '教学成果',
    time: '2023',
    level: '省级二等奖',
    work: '混合式教学与过程性评价体系',
    description: '基于线上线下融合课堂，建立“学练测评”闭环的过程性评价体系。',
    attachments: [
      { type: 'document', name: '改革案例.pdf', size: 1320000 }
    ]
  },
  // 新增：社会服务（service）
  {
    title: '服务地方：数字乡村培训项目',
    type: 'service',
    typeText: '社会服务',
    time: '2023',
    level: '市级项目',
    work: '基层信息化能力提升培训',
    description: '面向基层工作人员开展数字化技能培训，助力数字乡村与政务现代化。',
    attachments: [
      { type: 'document', name: '培训大纲.pdf', size: 860000 }
    ]
  },
  {
    title: '社区科普讲座系列',
    type: 'service',
    typeText: '社会服务',
    time: '2024',
    level: '社区合作',
    work: 'AI 素养与信息安全',
    description: '开展面向社区居民的 AI 基础素养与信息安全普及讲座。',
    attachments: [
      { type: 'document', name: '讲座日程.pdf', size: 420000 }
    ]
  },
  // 新增：专利（patent）
  {
    title: '基于图学习的课堂互动分析方法',
    type: 'patent',
    typeText: '专利',
    time: '2024',
    level: '实用新型',
    work: '课堂互动数据采集与分析装置',
    description: '提出利用图神经网络对课堂互动关系进行建模与分析的方法与装置。',
    attachments: [
      { type: 'document', name: '专利受理通知书.pdf', size: 980000 }
    ]
  },
  {
    title: '一种面向微课的教学内容标注系统',
    type: 'patent',
    typeText: '专利',
    time: '2022',
    level: '发明专利（公开）',
    work: '微课知识点标注与检索',
    description: '针对微课资源提出快速标注与检索方法与系统。',
    attachments: [
      { type: 'document', name: '专利公开文本.pdf', size: 1410000 }
    ]
  },
  // 新增：实践合作（practice）
  {
    title: '校企协同育人——智能制造实践基地',
    type: 'practice',
    typeText: '实践合作',
    time: '2022-2024',
    level: '省级示范',
    work: '与XX科技共建产教融合实践基地',
    description: '共建实践教学基地，联合制定实践课程方案，提升学生工程实践能力。',
    attachments: [
      { type: 'document', name: '合作协议.pdf', size: 1260000 }
    ]
  },
  {
    title: '联合实验室：智慧教育联合研究',
    type: 'practice',
    typeText: '实践合作',
    time: '2023-2025',
    level: '校企联合',
    work: '共建教学-科研-应用试验平台',
    description: '围绕课堂数据采集与教学优化开展联合研究与实训。',
    attachments: [
      { type: 'document', name: '建设方案.pdf', size: 1620000 }
    ]
  },
  // 新增：科研项目（project）
  {
    title: '面向课堂数据的学习分析平台',
    type: 'project',
    typeText: '科研项目',
    time: '2023-2025',
    level: '省自然基金',
    work: '课堂多模态数据采集与学习分析',
    description: '开展课堂多模态数据采集与学习分析关键技术研究，构建可落地的平台系统。',
    attachments: [
      { type: 'document', name: '项目立项书.pdf', size: 2100000 }
    ]
  },
  {
    title: '智慧课堂教学行为预测研究',
    type: 'project',
    typeText: '科研项目',
    time: '2022-2024',
    level: '校级重点',
    work: '时序建模与干预策略',
    description: '通过时序建模预测教学行为并给出干预建议。',
    attachments: [
      { type: 'document', name: '中期检查表.pdf', size: 860000 }
    ]
  },
  // 新增：技能竞赛（skill）
  {
    title: '教师教学基本功大赛',
    type: 'skill',
    typeText: '技能竞赛',
    time: '2024',
    level: '校级特等奖',
    work: '课堂教学展示与板书设计',
    description: '在教学基本功大赛中展示课堂组织、教学设计与板书规范等综合教学能力。',
    attachments: [
      { type: 'document', name: '比赛评分表.pdf', size: 740000 }
    ]
  },
  {
    title: '青年教师授课竞赛',
    type: 'skill',
    typeText: '技能竞赛',
    time: '2023',
    level: '学院一等奖',
    work: '教学演示与课堂互动',
    description: '突出课堂互动设计与教学目标达成度评价。',
    attachments: [
      { type: 'document', name: '获奖证书.jpg', size: 280000 }
    ]
  }
]

// 分页相关
const pageSize = ref(6)
const currentPage = ref(1)

// 统计信息计算（移除旧的、未使用的具体类型计数）
const totalAchievements = computed(() => achievements.length)

// 根据选中的标签过滤成果（需先于分页计算定义）
const filteredAchievements = computed(() => {
  if (activeTab.value === 'all') {
    return achievements
  }
  return achievements.filter(a => a.type === activeTab.value)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredAchievements.value.length / pageSize.value))
})

const paginatedAchievements = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAchievements.value.slice(start, end)
})

// 统计分组：奖励证书、企业合作、学生成果
const countByTypes = (types) => {
  return achievements.filter(a => types.includes(a.type)).reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1
    return acc
  }, {})
}

const chartsData = computed(() => {
  const rewardTypes = ['award', 'innovation', 'morality', 'service', 'patent']
  const enterpriseTypes = ['guidance', 'practice']
  const studentTypes = ['competition', 'paper', 'project', 'skill']

  const rewardCount = countByTypes(rewardTypes)
  const enterpriseCount = countByTypes(enterpriseTypes)
  const studentCount = countByTypes(studentTypes)

  return {
    rewardCertificates: [
      { key: 'award', label: '教学成果', count: rewardCount['award'] || 0, color: '#16a34a' },
      { key: 'innovation', label: '科研创新', count: rewardCount['innovation'] || 0, color: '#0ea5e9' },
      { key: 'morality', label: '师德师风', count: rewardCount['morality'] || 0, color: '#f59e0b' },
      { key: 'service', label: '社会服务', count: rewardCount['service'] || 0, color: '#06b6d4' },
      { key: 'patent', label: '专利', count: rewardCount['patent'] || 0, color: '#ef4444' }
    ],
    enterpriseCooperation: [
      { key: 'guidance', label: '实习就业', count: enterpriseCount['guidance'] || 0, color: '#2563eb' },
      { key: 'practice', label: '实践合作', count: enterpriseCount['practice'] || 0, color: '#10b981' }
    ],
    studentAchievements: [
      { key: 'competition', label: '学科竞赛', count: studentCount['competition'] || 0, color: '#7c3aed' },
      { key: 'paper', label: '学术论文', count: studentCount['paper'] || 0, color: '#059669' },
      { key: 'project', label: '科研项目', count: studentCount['project'] || 0, color: '#3b82f6' },
      { key: 'skill', label: '技能竞赛', count: studentCount['skill'] || 0, color: '#a855f7' }
    ]
  }
})

const chartsTotals = computed(() => {
  const sum = (arr) => arr.reduce((s, x) => s + x.count, 0)
  return {
    rewardCertificates: sum(chartsData.value.rewardCertificates),
    enterpriseCooperation: sum(chartsData.value.enterpriseCooperation),
    studentAchievements: sum(chartsData.value.studentAchievements)
  }
})

const computePct = (count, total) => {
  if (!total || total <= 0) return 0
  return Math.round((count / total) * 100)
}

const formatPct = (count, total) => {
  const pct = computePct(count, total)
  return total === 0 ? '0%' : `${pct}%`
}

// 环形图弧段数据
const donutRadius = 42
const donutCirc = Math.PI * 2 * donutRadius

const toDonutSegs = (items, total) => {
  let accOffset = 0
  return items.map((it) => {
    const pct = total > 0 ? it.count / total : 0
    const dash = pct * donutCirc
    const seg = {
      key: it.key,
      color: it.color,
      dash: Math.max(0, dash),
      offset: donutCirc - accOffset
    }
    accOffset += dash
    return seg
  })
}

const chartsDonut = computed(() => {
  return {
    rewardCertificates: toDonutSegs(chartsData.value.rewardCertificates, chartsTotals.value.rewardCertificates),
    enterpriseCooperation: toDonutSegs(chartsData.value.enterpriseCooperation, chartsTotals.value.enterpriseCooperation),
    studentAchievements: toDonutSegs(chartsData.value.studentAchievements, chartsTotals.value.studentAchievements)
  }
})

// 当切换标签时重置到第一页
watch(() => activeTab.value, () => {
  currentPage.value = 1
})

// 获取标签对应的成果数量
const getTabCount = (tabId) => {
  if (tabId === 'all') return 0
  return achievements.filter(a => a.type === tabId).length
}

// 切换标签
const switchTab = (tabId) => {
  activeTab.value = tabId
}

// 添加成果奖励
const addAchievement = () => {
  console.log('打开添加成果奖励')
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

// 生成并缓存随机日期（YYYY-MM-DD），确保每个成就卡片在会话期间保持一致
const randomDateCache = new WeakMap()
const getRandomDate = (achievement) => {
  if (randomDateCache.has(achievement)) return randomDateCache.get(achievement)
  const startTs = new Date(2021, 0, 1).getTime()
  const endTs = new Date(2025, 11, 31).getTime()
  const ts = Math.floor(Math.random() * (endTs - startTs + 1)) + startTs
  const d = new Date(ts)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const dateStr = `${yyyy}-${mm}-${dd}`
  randomDateCache.set(achievement, dateStr)
  return dateStr
}

// 模拟加载数据
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.achievements {
  padding: 24px;
  min-height: 100vh;
}

/* 顶部统计图表区域 */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
}

.chart-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 12px;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #555;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
}

.legend-pct {
  color: #333;
  font-weight: 600;
  margin-left: 2px;
}

/* 环形图 */
.donut {
  position: relative;
  width: 120px;
  height: 120px;
  align-self: center;
}

.donut-svg {
  width: 120px;
  height: 120px;
}

.donut-track {
  fill: none;
  stroke: #f3f4f6;
  stroke-width: 16;
}

.donut-seg {
  fill: none;
  stroke-width: 16;
  transition: stroke-dashoffset .4s ease;
}

.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.donut-total {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.donut-sub {
  font-size: 12px;
  color: #888;
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
}

.nav-tab:hover {
  background-color: #f0f0f0;
}

.nav-tab.active {
  background-color: #8b5cf6;
  color: white;
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

/* 成果卡片网格 */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.achievement-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.achievement-card:hover {
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
  margin-bottom: 8px;
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

.type-paper {
  background-color: #059669;
}

.type-honor {
  background-color: #dc2626;
}

.type-guidance {
  background-color: #2563eb;
}

.type-competition {
  background-color: #7c3aed;
}

.type-publication {
  background-color: #ea580c;
}

/* 新增：补充所有使用到的类型色块样式 */
.type-award {
  background-color: #16a34a; /* 绿色 - 教学成果 */
}

.type-innovation {
  background-color: #0ea5e9; /* 天蓝 - 科研创新 */
}

.type-morality {
  background-color: #f59e0b; /* 橙色 - 师德师风 */
}

.type-service {
  background-color: #06b6d4; /* 青色 - 社会服务 */
}

.type-patent {
  background-color: #ef4444; /* 红色 - 专利 */
}

.type-practice {
  background-color: #10b981; /* 翠绿 - 实践合作 */
}

.type-project {
  background-color: #3b82f6; /* 蓝色 - 科研项目 */
}

.type-skill {
  background-color: #a855f7; /* 紫色 - 技能竞赛 */
}

/* 卡片内容 */
.card-content {
  margin-top: 16px;
  display: flex;
  align-items: baseline;
  flex-direction: column;
  gap: 20px;
}

/* 获奖作品区域 */
.work-section {
  margin-bottom: 2px;
}

.work-title {
  font-size: 14px;
  color: #626262;
  margin: 0 0 8px 0;
  display: flex;
}

.work-text {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #8b5cf6;
}

.work-name {
  font-size: 14px;
  line-height: 1.6;
  color: #353535;
  font-weight: 500;
  margin-bottom: 12px;
}

.work-description {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  text-align: justify;
}

/* 附件区域 */
.attachments-section {
  margin-top: 1px;
}

.attachments-title {
  font-size: 14px;
  color: #626262;
  margin: 0 0 12px 0;
  display: flex;
  flex-direction: row;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
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



.attachment-name {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 文档附件 */
.document-attachment {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.document-attachment:hover {
  background: #e9ecef;
}

.document-icon {
  width: 32px;
  height: 32px;
  background: #8b5cf6;
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.attachment-info {
  flex: 1;
  min-width: 0;
}

.attachment-info .attachment-name {
  display: inline;
  font-size: 13px;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.attachment-size {
  display: inline;
  font-size: 11px;
  color: #666;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #999;
  margin-bottom: 16px;
}

.level {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #8b5cf6;
  font-weight: 500;
  font-size: 14px;
}

/* 卡片底部时间信息 */
.card-footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 16px;
}

.time-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.achievement-time {
  color: #666;
  font-weight: 500;
  font-size: 12px;
}

/* 获得时间显示 */
.obtained-time {
  margin-top: 14px;
  font-size: 14px;
  color: #666;
  display: flex;
}

/* 分页器样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 15px;
}

.pagination-btn {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.pagination-btn:hover:not(:disabled) {
  background: #7c3aed;
}

.pagination-btn:disabled {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.page-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  outline: none;
}

.page-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}


/* 响应式设计 */
@media (max-width: 1200px) {
  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-section {
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
  

}
</style> 