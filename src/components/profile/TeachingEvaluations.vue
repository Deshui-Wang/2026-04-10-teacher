<template>
  <div class="teaching-evaluations">
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
          <span class="tab-count" v-if="tab.id !== 'all'">
            {{ getTabCount(tab.id) }}
          </span>
        </div>
      </div>
      <button class="add-btn" @click="addSelfEvaluation">
        <span class="add-icon">+</span>
        添加自我评估
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载评价数据...</p>
    </div>

    <!-- 数字素养内容 -->
    <div v-else-if="activeTab === 'digital'" class="digital-literacy-content">
      <!-- 数字能力雷达图 -->
      <div class="digital-ability-chart">
        <h3>综合数字能力</h3>
        <div ref="digitalRadarChart" class="chart-container"></div>
        <div class="evidence-section">
          <h5>能力分解说明</h5>
          <div class="evidence-grid">
            <div v-for="ability in digitalAbilityData.abilities" :key="ability.dimension" class="evidence-item">
              <strong>{{ ability.dimension }}</strong>
              <ul>
                <li v-for="(item, index) in ability.evidence" :key="index">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <!-- AI教学能力图谱 -->
      <div class="ai-ability-chart">
        <h3>AI教学能力图谱</h3>
        <div ref="aiAbilityChart" class="chart-container"></div>
        <div class="evidence-section">
          <h5>能力分解说明</h5>
          <div class="evidence-grid">
            <div v-for="ability in aiAbilityData.abilities" :key="ability.dimension" class="evidence-item">
              <strong>{{ ability.dimension }}</strong>
              <ul>
                <li v-for="(item, index) in ability.evidence" :key="index">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 非数字素养标签的内容 -->
    <div v-else>
      <!-- 词云展示区域 -->
      <div v-if="filteredEvaluations.length > 0" class="word-cloud-section">
        <h3 class="word-cloud-title">评价关键词云</h3>
        <div class="word-cloud-container">
          <div 
            v-for="(word, index) in currentWordCloud" 
            :key="index"
            :class="['word-cloud-item', `size-${word.size}`]"
            :style="{ 
              animationDelay: `${index * 0.1}s`,
              color: word.color 
            }"
          >
            {{ word.text }}
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredEvaluations.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <p>暂无评价数据</p>
        <small>选择其他标签查看不同类型的评价</small>
      </div>

      <!-- 评价卡片网格 -->
      <div v-if="filteredEvaluations.length > 0" class="evaluations-grid">
        <div 
          v-for="(evaluation, index) in filteredEvaluations" 
          :key="index"
          class="evaluation-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="card-header">
            <div class="profile-info">
              <img 
                :src="evaluation.avatar" 
                :alt="evaluation.name" 
                class="avatar"
                @error="handleImageError"
              />
              <div class="name">{{ evaluation.name }}</div>
            </div>
            <div :class="['reviewer-type', `type-${evaluation.type}`]">
              {{ evaluation.typeText }}
            </div>
          </div>
          
          <div class="card-content">
            <div class="review-subject">
              {{ evaluation.subject }}
            </div>
            <div :class="['subject-box', `box-${evaluation.type}`]">
              {{ evaluation.subjectTitle }}
            </div>
            <div class="review-text">
              {{ evaluation.reviewText }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加自我评估弹层 -->
    <div v-if="showSelfEvaluationModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>添加自我评估</h3>
          <button class="close-btn" @click="closeModal">
            <span>×</span>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="submitSelfEvaluation">
            <!-- 课程选择 -->
            <div class="form-group">
              <label for="course-select">选择课程 *</label>
              <select 
                id="course-select" 
                v-model="selfEvaluationForm.courseId" 
                class="form-select"
                required
              >
                <option value="">请选择课程</option>
                <option 
                  v-for="course in availableCourses" 
                  :key="course.id" 
                  :value="course.id"
                >
                  {{ course.name }}
                </option>
              </select>
            </div>

            <!-- 总结与反思 -->
            <div class="form-group">
              <label for="reflection">总结与反思 *</label>
              <textarea 
                id="reflection"
                v-model="selfEvaluationForm.reflection"
                class="form-textarea"
                placeholder="请详细描述您对本课程的教学总结与反思..."
                rows="6"
                required
              ></textarea>
              <div class="char-count">{{ selfEvaluationForm.reflection.length }}/1000</div>
            </div>

            <!-- 未来规划 -->
            <div class="form-group">
              <label for="future-plan">未来规划 *</label>
              <textarea 
                id="future-plan"
                v-model="selfEvaluationForm.futurePlan"
                class="form-textarea"
                placeholder="请描述您对未来教学的规划和改进方向..."
                rows="6"
                required
              ></textarea>
              <div class="char-count">{{ selfEvaluationForm.futurePlan.length }}/1000</div>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="closeModal">
            取消
          </button>
          <button 
            type="button" 
            class="btn-submit" 
            @click="submitSelfEvaluation"
            :disabled="!isFormValid"
          >
            提交评估
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// Register ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer
])

// 导航标签数据
const tabs = [
  { id: 'all', name: '全部评价' },
  { id: 'course', name: '学生评教' },
  { id: 'experience', name: '同行评价' },
  { id: 'work', name: '督导评价' },
  { id: 'self', name: '自我评估' },
  { id: 'digital', name: '数字素养' }
]

const activeTab = ref('all')

// 弹层相关状态
const showSelfEvaluationModal = ref(false)

// 自我评估表单数据
const selfEvaluationForm = ref({
  courseId: '',
  reflection: '',
  futurePlan: ''
})

// 可用课程列表
const availableCourses = ref([
  { id: '1', name: '《计算机应用基础》' },
  { id: '2', name: '《数据结构与算法》' },
  { id: '3', name: '《人工智能在教学场景下的趣味应用》' },
  { id: '4', name: '《Web前端开发》' },
  { id: '5', name: '《数据库原理与应用》' },
  { id: '6', name: '《软件工程》' }
])

// 表单验证
const isFormValid = computed(() => {
  return selfEvaluationForm.value.courseId && 
         selfEvaluationForm.value.reflection.trim().length >= 10 &&
         selfEvaluationForm.value.futurePlan.trim().length >= 10
})

// 数字素养相关数据
const digitalRadarChart = ref(null)
const aiAbilityChart = ref(null)
let digitalChartInstance = null
let aiChartInstance = null

// 数字能力雷达图数据
const digitalAbilityData = {
  indicators: [
    { name: '数字意识', max: 100 },
    { name: '计算思维', max: 100 },
    { name: '数字安全', max: 100 },
    { name: '数字技能', max: 100 },
    { name: '数字伦理', max: 100 }
  ],
  data: [{
    value: [85, 78, 92, 88, 90],
    name: '数字能力得分'
  }],
  abilities: [
    {
      dimension: '数字意识',
      score: 85,
      evidence: [
        '具备敏锐的数字技术敏感度，能快速识别和把握数字化机遇',
        '主动关注新兴技术趋势，持续学习数字工具和平台应用',
        '理解数字化转型对教育行业的深远影响和变革意义',
        '能够将数字思维融入日常教学和管理工作中'
      ]
    },
    {
      dimension: '计算思维',
      score: 78,
      evidence: [
        '掌握问题分解、模式识别、抽象化等核心计算思维方法',
        '能够运用算法思维解决复杂的教学和科研问题',
        '具备数据驱动的决策分析能力，善于从数据中提取洞察',
        '能够指导学生培养逻辑思维和问题解决能力'
      ]
    },
    {
      dimension: '数字安全',
      score: 92,
      evidence: [
        '严格遵守数据保护法规，建立完善的信息安全管理制度',
        '具备网络安全意识，能够识别和防范各类网络威胁',
        '妥善保护学生隐私信息，建立安全的数据存储和传输机制',
        '定期进行安全培训，提升团队整体数字安全素养'
      ]
    },
    {
      dimension: '数字技能',
      score: 88,
      evidence: [
        '熟练使用各类办公软件、教学平台和数字工具',
        '掌握多媒体制作技术，能够制作高质量的教学资源',
        '具备基础编程能力，能够开发简单的教学辅助工具',
        '能够指导学生使用数字工具进行学习和创作'
      ]
    },
    {
      dimension: '数字伦理',
      score: 90,
      evidence: [
        '坚持数字技术使用的道德准则，倡导负责任的数字行为',
        '关注数字鸿沟问题，致力于促进数字教育的公平性',
        '尊重知识产权，合理使用和分享数字资源',
        '培养学生正确的数字价值观和网络道德意识'
      ]
    }
  ]
}

// AI教学能力图谱数据
const aiAbilityData = {
  abilities: [
    {
      dimension: 'AI技术应用',
      score: 91,
      evidence: [
        '熟练应用超7种AI工具，日均使用71次',
        '自主研发3款教学智能体，提升个人工效38%',
        '将自研工具应用于教学，并推广给学生使用'
      ]
    },
    {
      dimension: '学生指导培养',
      score: 86,
      evidence: [
        '带队参加2场职业技能大赛，4名学生获奖',
        '累计收到179个学生教学评价和293个点赞',
        '深受学生好评，内部口碑高'
      ]
    },
    {
      dimension: '产学研合作',
      score: 72,
      evidence: [
        '深度参与7个校企合作项目',
        '组织学生参与3个企业一线实践项目',
        '紧跟行业发展，将前沿案例融入教学'
      ]
    },
    {
      dimension: '教学创新实践',
      score: 88,
      evidence: [
        '发表教学相关经验文章超过17篇',
        '积极参与11场学术培训，不断更新教学理念',
        '将数据建模分析成果复用于知识库，丰富教学资源'
      ]
    },
    {
      dimension: '数据素养与分析',
      score: 75,
      evidence: [
        '上传并管理超7万条个人教学元数据',
        '对教学数据进行建模与分析，驱动决策',
        '具备较强的数据资产保护意识'
      ]
    }
  ]
}

const loading = ref(true)

// 评价数据
const evaluations = [
  {
    name: '张巡',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    type: 'student',
    typeText: '学生',
    subject: '评论了您的课程',
    subjectTitle: '《计算机应用基础》',
    reviewText: '受益匪浅的一门课,一开始的懵到后来的兴致勃勃,感谢张老师的兴趣教育,以及每一次提问后举一反三的引导,让我们有了自己独立思考,和在应用的能力,谢谢张老师!',
    keywords: ['受益匪浅', '兴趣教育', '举一反三', '独立思考', '应用能力', '引导', '感谢']
  },
  {
    name: '李艳',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    type: 'colleague',
    typeText: '同事',
    subject: '评论了您的课程',
    subjectTitle: '#人工智能在教学场景下的趣味应用',
    reviewText: '受益匪浅的一门课,一开始的懵到后来的兴致勃勃,感谢张老师的兴趣教育,以及每一次提问后举一反三的引导,让我们有了自己独立思考,和在应用的能力,谢谢张老师!',
    keywords: ['人工智能', '教学场景', '趣味应用', '受益匪浅', '兴趣教育', '举一反三', '独立思考']
  },
  {
    name: '赵川',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    type: 'supervisor',
    typeText: '督导',
    subject: '评论了您的工作汇报',
    subjectTitle: '2025上半年教学计划',
    reviewText: '计划非常完整,希望继续保持!可以适当把亮点工作和亮点活动做线下分享会。',
    keywords: ['计划完整', '继续保持', '亮点工作', '亮点活动', '线下分享会', '教学计划']
  },
  {
    name: '王小明',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    type: 'student',
    typeText: '学生',
    subject: '评论了您的课程',
    subjectTitle: '《数据结构与算法》',
    reviewText: '老师讲解非常清晰，算法思路分析得很透彻，让我对编程有了更深的理解。',
    keywords: ['讲解清晰', '算法思路', '透彻', '编程理解', '数据结构', '算法']
  },
  {
    name: '陈老师',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    type: 'colleague',
    typeText: '同事',
    subject: '评论了您的教学经验',
    subjectTitle: '教学创新分享会',
    reviewText: '您的教学方法很有启发性，特别是在项目化教学方面的实践值得推广。',
    keywords: ['教学方法', '启发性', '项目化教学', '实践', '推广', '教学创新', '分享会']
  },
  {
    name: '刘主任',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    type: 'supervisor',
    typeText: '督导',
    subject: '评论了您的工作总结',
    subjectTitle: '2024年度工作总结',
    reviewText: '工作态度认真负责，教学效果显著，学生反馈良好，继续保持！',
    keywords: ['工作态度', '认真负责', '教学效果', '显著', '学生反馈', '良好', '继续保持']
  }
]

// 词云数据配置
const wordCloudData = {
  student: [
    { text: '受益匪浅', size: 'large', color: '#10b981' },
    { text: '兴趣教育', size: 'medium', color: '#059669' },
    { text: '举一反三', size: 'large', color: '#10b981' },
    { text: '独立思考', size: 'medium', color: '#059669' },
    { text: '应用能力', size: 'medium', color: '#10b981' },
    { text: '讲解清晰', size: 'large', color: '#10b981' },
    { text: '算法思路', size: 'medium', color: '#059669' },
    { text: '编程理解', size: 'medium', color: '#10b981' },
    { text: '引导', size: 'small', color: '#34d399' },
    { text: '感谢', size: 'small', color: '#34d399' },
    { text: '透彻', size: 'small', color: '#34d399' },
    { text: '数据结构', size: 'small', color: '#34d399' }
  ],
  colleague: [
    { text: '教学方法', size: 'large', color: '#3b82f6' },
    { text: '启发性', size: 'medium', color: '#2563eb' },
    { text: '项目化教学', size: 'large', color: '#3b82f6' },
    { text: '实践', size: 'medium', color: '#2563eb' },
    { text: '推广', size: 'medium', color: '#3b82f6' },
    { text: '人工智能', size: 'large', color: '#3b82f6' },
    { text: '教学场景', size: 'medium', color: '#2563eb' },
    { text: '趣味应用', size: 'medium', color: '#3b82f6' },
    { text: '教学创新', size: 'medium', color: '#2563eb' },
    { text: '分享会', size: 'small', color: '#60a5fa' },
    { text: '受益匪浅', size: 'small', color: '#60a5fa' },
    { text: '兴趣教育', size: 'small', color: '#60a5fa' }
  ],
  supervisor: [
    { text: '计划完整', size: 'large', color: '#d97706' },
    { text: '继续保持', size: 'medium', color: '#b45309' },
    { text: '亮点工作', size: 'large', color: '#d97706' },
    { text: '亮点活动', size: 'medium', color: '#b45309' },
    { text: '工作态度', size: 'large', color: '#d97706' },
    { text: '认真负责', size: 'medium', color: '#b45309' },
    { text: '教学效果', size: 'large', color: '#d97706' },
    { text: '显著', size: 'medium', color: '#b45309' },
    { text: '学生反馈', size: 'medium', color: '#d97706' },
    { text: '良好', size: 'small', color: '#f59e0b' },
    { text: '线下分享会', size: 'small', color: '#f59e0b' },
    { text: '教学计划', size: 'small', color: '#f59e0b' }
  ],
  self: [
    { text: '教学反思', size: 'large', color: '#8b5cf6' },
    { text: '教学创新', size: 'large', color: '#7c3aed' },
    { text: '学生参与度', size: 'medium', color: '#8b5cf6' },
    { text: '课程设计', size: 'medium', color: '#7c3aed' },
    { text: '实践环节', size: 'medium', color: '#8b5cf6' },
    { text: '动手能力', size: 'medium', color: '#7c3aed' },
    { text: '优化', size: 'small', color: '#a78bfa' },
    { text: '提升', size: 'small', color: '#a78bfa' },
    { text: '突破', size: 'small', color: '#a78bfa' },
    { text: '总结', size: 'small', color: '#a78bfa' }
  ],
  all: [
    { text: '受益匪浅', size: 'large', color: '#8b5cf6' },
    { text: '教学方法', size: 'large', color: '#3b82f6' },
    { text: '计划完整', size: 'large', color: '#d97706' },
    { text: '教学创新', size: 'large', color: '#8b5cf6' },
    { text: '兴趣教育', size: 'medium', color: '#10b981' },
    { text: '举一反三', size: 'medium', color: '#10b981' },
    { text: '独立思考', size: 'medium', color: '#10b981' },
    { text: '项目化教学', size: 'medium', color: '#3b82f6' },
    { text: '工作态度', size: 'medium', color: '#d97706' },
    { text: '教学效果', size: 'medium', color: '#d97706' },
    { text: '启发性', size: 'small', color: '#3b82f6' },
    { text: '实践', size: 'small', color: '#3b82f6' },
    { text: '推广', size: 'small', color: '#3b82f6' },
    { text: '继续保持', size: 'small', color: '#d97706' },
    { text: '亮点工作', size: 'small', color: '#d97706' },
    { text: '认真负责', size: 'small', color: '#d97706' }
  ]
}

// 统计信息计算
const totalEvaluations = computed(() => evaluations.length)
const studentCount = computed(() => evaluations.filter(e => e.type === 'student').length)
const colleagueCount = computed(() => evaluations.filter(e => e.type === 'colleague').length)
const supervisorCount = computed(() => evaluations.filter(e => e.type === 'supervisor').length)

// 根据选中的标签过滤评价
const filteredEvaluations = computed(() => {
  if (activeTab.value === 'all') {
    return evaluations
  } else if (activeTab.value === 'course') {
    return evaluations.filter(e => e.subject.includes('课程'))
  } else if (activeTab.value === 'experience') {
    return evaluations.filter(e => e.subject.includes('教学经验') || e.subject.includes('分享会'))
  } else if (activeTab.value === 'work') {
    return evaluations.filter(e => e.subject.includes('工作'))
  } else if (activeTab.value === 'self') {
    // 自我评估可以显示一个特殊的卡片
    return [{
      name: '自我评估',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      type: 'self',
      typeText: '个人',
      subject: '个人教学反思',
      subjectTitle: '2024年教学总结',
      reviewText: '本年度在教学创新方面有所突破，学生参与度明显提升。后续将继续优化课程设计，增加实践环节，提升学生动手能力。',
      keywords: ['教学反思', '教学创新', '学生参与度', '课程设计', '实践环节', '动手能力', '优化', '提升', '突破', '总结']
    }]
  } else if (activeTab.value === 'digital') {
    return [] // 数字素养标签不显示评价
  }
  return evaluations
})

// 当前词云数据
const currentWordCloud = computed(() => {
  if (activeTab.value === 'digital') return []
  
  let tabType = activeTab.value
  if (activeTab.value === 'course') tabType = 'student'
  if (activeTab.value === 'experience') tabType = 'colleague'
  if (activeTab.value === 'work') tabType = 'supervisor'
  
  return wordCloudData[tabType] || []
})

// 获取标签对应的评价数量
const getTabCount = (tabId) => {
  if (tabId === 'course') {
    return evaluations.filter(e => e.subject.includes('课程')).length
  } else if (tabId === 'experience') {
    return evaluations.filter(e => e.subject.includes('教学经验') || e.subject.includes('分享会')).length
  } else if (tabId === 'work') {
    return evaluations.filter(e => e.subject.includes('工作')).length
  } else if (tabId === 'self') {
    return 1
  } else if (tabId === 'digital') {
    return 0 // 数字素养标签不显示数量
  }
  return 0
}

// 切换标签
// 初始化数字能力雷达图
const initDigitalRadarChart = () => {
  if (!digitalChartInstance && digitalRadarChart.value) {
    digitalChartInstance = echarts.init(digitalRadarChart.value)
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          let tooltip = `<strong>数字能力分布</strong><br/>`
          params.value.forEach((score, index) => {
            const dimension = digitalAbilityData.indicators[index].name
            tooltip += `${dimension}: ${score}<br/>`
          })
          return tooltip
        }
      },
      radar: {
        indicator: digitalAbilityData.indicators,
        radius: '65%',
        axisName: {
          color: '#333',
          fontSize: 14,
          fontWeight: 'bold',
          padding: [3, 5]
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.4)', 'rgba(139, 92, 246, 0.6)', 'rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 1)'].reverse(),
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10
          }
        },
      },
      series: [{
        type: 'radar',
        data: digitalAbilityData.data,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#8b5cf6',
        },
        lineStyle: {
          width: 3,
          color: '#8b5cf6'
        },
        areaStyle: {
          color: 'rgba(139, 92, 246, 0.4)'
        }
      }]
    }
    
    digitalChartInstance.setOption(option)
  }
}

// 初始化AI教学能力图谱
const initAiAbilityChart = () => {
  if (!aiChartInstance && aiAbilityChart.value) {
    aiChartInstance = echarts.init(aiAbilityChart.value)
    
    const indicator = aiAbilityData.abilities.map(a => ({
      name: a.dimension,
      max: 100
    }))
    
    const data = [{
      value: aiAbilityData.abilities.map(a => a.score),
      name: '能力得分'
    }]
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          let tooltip = `<strong>AI教学能力分布</strong><br/>`
          params.value.forEach((score, index) => {
            const dimension = indicator[index].name
            tooltip += `${dimension}: ${score}<br/>`
          })
          return tooltip
        }
      },
      radar: {
        indicator: indicator,
        radius: '65%',
        axisName: {
          color: '#333',
          fontSize: 14,
          fontWeight: 'bold',
          padding: [3, 5]
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(86, 148, 242, 0.2)', 'rgba(86, 148, 242, 0.4)', 'rgba(86, 148, 242, 0.6)', 'rgba(86, 148, 242, 0.8)', 'rgba(86, 148, 242, 1)'].reverse(),
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10
          }
        },
      },
      series: [{
        type: 'radar',
        data: data,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#5694f2',
        },
        lineStyle: {
          width: 3,
          color: '#5694f2'
        },
        areaStyle: {
          color: 'rgba(86, 148, 242, 0.4)'
        }
      }]
    }
    
    aiChartInstance.setOption(option)
  }
}

// 切换标签
const switchTab = (tabId) => {
  activeTab.value = tabId
  if (tabId === 'digital') {
    nextTick(() => {
      initDigitalRadarChart()
      initAiAbilityChart()
    })
  }
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
}

// 添加自我评估
const addSelfEvaluation = () => {
  showSelfEvaluationModal.value = true
  // 重置表单
  selfEvaluationForm.value = {
    courseId: '',
    reflection: '',
    futurePlan: ''
  }
}

// 关闭弹层
const closeModal = () => {
  showSelfEvaluationModal.value = false
}

// 提交自我评估
const submitSelfEvaluation = () => {
  if (!isFormValid.value) {
    alert('请填写完整的评估信息')
    return
  }

  // 获取选中的课程信息
  const selectedCourse = availableCourses.value.find(c => c.id === selfEvaluationForm.value.courseId)
  
  // 创建新的自我评估数据
  const newEvaluation = {
    name: '自我评估',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    type: 'self',
    typeText: '个人',
    subject: '个人教学反思',
    subjectTitle: selectedCourse.name,
    reviewText: `总结与反思：${selfEvaluationForm.value.reflection}\n\n未来规划：${selfEvaluationForm.value.futurePlan}`,
    keywords: ['教学反思', '教学创新', '学生参与度', '课程设计', '实践环节', '动手能力', '优化', '提升', '突破', '总结']
  }

  // 添加到评价列表
  evaluations.push(newEvaluation)
  
  // 关闭弹层
  closeModal()
  
  // 切换到自我评估标签
  activeTab.value = 'self'
  
  console.log('自我评估已提交', newEvaluation)
}

// 模拟加载数据
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
/* 词云样式 */
.word-cloud-section {
  margin-bottom: 30px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.word-cloud-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
}

.word-cloud-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  min-height: 120px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.word-cloud-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.word-cloud-item {
  display: inline-block;
  padding: 8px 16px;
  margin: 4px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: wordFloat 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  position: relative;
  z-index: 1;
}

.word-cloud-item:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.word-cloud-item.size-large {
  font-size: 18px;
  font-weight: 700;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid currentColor;
}

.word-cloud-item.size-medium {
  font-size: 16px;
  font-weight: 600;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid currentColor;
}

.word-cloud-item.size-small {
  font-size: 14px;
  font-weight: 500;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid currentColor;
}

@keyframes wordFloat {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 数字素养内容样式 */
.digital-literacy-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px 0;
}

.digital-ability-chart,
.ai-ability-chart {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.digital-ability-chart:hover,
.ai-ability-chart:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.digital-ability-chart h3,
.ai-ability-chart h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
  padding-bottom: 12px;
  display: flex;
}

.chart-container {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
}

.evidence-section {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.evidence-section h5 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  text-align: center;
  border-bottom: none;
}

.evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.evidence-item {
  font-size: 14px;
  padding: 15px;
  background: rgba(245, 247, 250, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.evidence-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.evidence-item strong {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
}

.evidence-item ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  color: #555;
}

.evidence-item li {
  margin-bottom: 5px;
  line-height: 1.6;
  position: relative;
  padding-left: 18px;
  text-align: left;
}

.evidence-item li::before {
  content: '▶';
  position: absolute;
  left: 0;
  top: 0;
  font-size: 10px;
  color: #667eea;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .digital-literacy-content {
    gap: 20px;
  }
  
  .digital-ability-chart,
  .ai-ability-chart {
    padding: 16px;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .evidence-grid {
    grid-template-columns: 1fr;
  }

  .word-cloud-container {
    padding: 15px;
    gap: 8px;
  }

  .word-cloud-item.size-large {
    font-size: 16px;
    padding: 10px 16px;
  }

  .word-cloud-item.size-medium {
    font-size: 14px;
    padding: 8px 14px;
  }

  .word-cloud-item.size-small {
    font-size: 12px;
    padding: 6px 12px;
  }
}

.teaching-evaluations {
  padding: 20px;
  min-height: 100vh;
}

/* 统计信息样式 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #8b5cf6;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
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
  overflow: visible;
  margin: 4px;
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
  padding: 4px;
  border-radius: 50%;
  min-width: 16px;
  height: 16px;
  text-align: center;
  line-height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
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

/* 评价卡片网格 */
.evaluations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.evaluation-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.evaluation-card:hover {
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
  align-items: center;
  margin-bottom: 16px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

/* 评价者类型标签 */
.reviewer-type {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.type-student {
  background-color: #10b981;
}

.type-colleague {
  background-color: #3b82f6;
}

.type-supervisor {
  background-color: #d97706;
}

.type-self {
  background-color: #8b5cf6;
}

/* 卡片内容 */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-subject {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.subject-box {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.box-student {
  background-color: #dcfce7;
  color: #166534;
}

.box-colleague {
  background-color: #dbeafe;
  color: #1e40af;
}

.box-supervisor {
  background-color: #fef3c7;
  color: #92400e;
}

.box-self {
  background-color: #ede9fe;
  color: #5b21b6;
}

.review-text {
  font-size: 14px;
  line-height: 1.6;
  color: #444;
  margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .evaluations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .evaluations-grid {
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
  
  .stats-section {
    grid-template-columns: 1fr;
  }
}

/* 弹层样式 */
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
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn-cancel {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-submit {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-container {
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style> 