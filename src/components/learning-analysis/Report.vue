<template>
  <div class="learning-report">
    <!-- 报告头部 -->
    <div class="report-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="report-title">AI智能学情分析报告</h1>
          <div class="report-meta">
            <span class="meta-item">生成时间：{{ reportTime }}</span>
            <span class="meta-item" v-if="filterInfo">筛选条件：{{ filterInfo }}</span>
          </div>
        </div>
        <button class="back-btn" @click="goBack">返回</button>
        <button class="back-btn">下载</button>
      </div>
    </div>

    <!-- 报告内容 -->
    <div class="report-body" v-if="!isLoading">
      <!-- 基本信息统计 -->
      <div class="report-section">
        <h2 class="section-title">一、基本信息统计</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">学院数</div>
            <div class="stat-value">{{ statsData.collegeCount }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">专业数</div>
            <div class="stat-value">{{ statsData.majorCount }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">班级数</div>
            <div class="stat-value">{{ statsData.classCount }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">学生总数</div>
            <div class="stat-value">{{ statsData.studentCount }}</div>
          </div>
        </div>
        <div class="content-text typing-text" :ref="el => basicInfoTextRef = el"></div>
      </div>

      <!-- 成绩趋势分析 -->
      <div class="report-section">
        <h2 class="section-title">二、成绩趋势分析</h2>
        <div class="content-text typing-text" :ref="el => gradeTrendTextRef = el"></div>
        <div class="chart-container" ref="gradeChartRef"></div>
      </div>

      <!-- 作业完成情况 -->
      <div class="report-section">
        <h2 class="section-title">三、作业完成情况</h2>
        <div class="content-text typing-text" :ref="el => homeworkTextRef = el"></div>
        <div class="chart-container" ref="homeworkChartRef"></div>
      </div>

      <!-- 出勤情况 -->
      <div class="report-section">
        <h2 class="section-title">四、出勤情况分析</h2>
        <div class="content-text typing-text" :ref="el => attendanceTextRef = el"></div>
        <div class="chart-container" ref="attendanceChartRef"></div>
      </div>

      <!-- 课堂互动情况 -->
      <div class="report-section">
        <h2 class="section-title">五、课堂互动情况</h2>
        <div class="content-text typing-text" :ref="el => interactionTextRef = el"></div>
        <div class="chart-container" ref="interactionChartRef"></div>
      </div>

      <!-- 科研项目研究情况 -->
      <div class="report-section">
        <h2 class="section-title">六、科研项目研究情况</h2>
        <div class="content-text typing-text" :ref="el => researchTextRef = el"></div>
        <div class="project-list">
          <div class="project-item" v-for="project in projectData" :key="project.name">
            <div class="project-info">
              <div class="project-name">{{ project.name }}</div>
              <div class="project-meta">
                <span>{{ project.leader }} · {{ project.type }}</span>
                <span class="project-status" :class="project.statusClass">{{ project.status }}</span>
              </div>
              <div class="project-students" v-if="project.students && project.students.length > 0">
                <span class="students-label">参与学生：</span>
                <span class="students-names">{{ project.students.join('、') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 专业匹配度情况 -->
      <div class="report-section">
        <h2 class="section-title">七、专业匹配度分析</h2>
        <div class="content-text typing-text" :ref="el => majorMatchTextRef = el"></div>
        <div class="match-indicators">
          <div class="match-indicator" v-for="indicator in majorMatchData" :key="indicator.name">
            <div class="indicator-header">
              <span class="indicator-name">{{ indicator.name }}</span>
              <span class="indicator-value">{{ indicator.value }}%</span>
            </div>
            <div class="indicator-progress">
              <div class="progress-bar" :style="{ width: indicator.value + '%', backgroundColor: indicator.color }"></div>
            </div>
            <div class="indicator-desc">{{ indicator.description }}</div>
          </div>
        </div>
      </div>

      <!-- 学生课外兴趣情况 -->
      <div class="report-section">
        <h2 class="section-title">八、学生课外兴趣情况</h2>
        <div class="content-text typing-text" :ref="el => interestTextRef = el"></div>
        <div class="interest-tags">
          <span class="interest-tag" v-for="interest in interestData" :key="interest">
            {{ interest }}
          </span>
        </div>
      </div>

      <!-- 学生智能能力情况 -->
      <div class="report-section">
        <h2 class="section-title">九、学生智能能力情况</h2>
        <div class="content-text typing-text" :ref="el => abilityTextRef = el"></div>
        <div class="ability-grid">
          <div class="ability-card" v-for="tool in abilityData" :key="tool.name">
            <div class="ability-icon">{{ tool.icon }}</div>
            <div class="ability-info">
              <div class="ability-name">{{ tool.name }}</div>
              <div class="ability-stats">
                <span>使用次数：{{ tool.usageCount }}</span>
                <span>开发数量：{{ tool.developmentCount }}</span>
              </div>
              <div class="ability-trend" :class="tool.trend.type">
                {{ tool.trend.text }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 总结与建议 -->
      <div class="report-section">
        <h2 class="section-title">十、总结与建议</h2>
        <div class="summary-content">
          <div class="summary-item">
            <h3 class="summary-title">综合分析</h3>
            <div class="summary-text typing-text" :ref="el => summaryTextRef = el"></div>
          </div>
          <div class="summary-item">
            <h3 class="summary-title">改进建议</h3>
            <div class="suggestions-text typing-text" :ref="el => suggestionsTextRef = el"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-container" v-if="isLoading">
      <div class="loading-spinner"></div>
      <div class="loading-text">AI正在生成报告，请稍候...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()

// 加载状态
const isLoading = ref(true)
const isTypingActive = ref(true)
const activeTimers = ref([])

// 报告时间
const reportTime = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// 筛选信息
const filterInfo = computed(() => {
  const filters = []
  if (route.query.college) filters.push(`学院：${route.query.college}`)
  if (route.query.major) filters.push(`专业：${route.query.major}`)
  if (route.query.class) filters.push(`班级：${route.query.class}`)
  if (route.query.searchName) filters.push(`姓名：${route.query.searchName}`)
  return filters.length > 0 ? filters.join('，') : '全部'
})

// 统计数据
const statsData = ref({
  collegeCount: 3,
  majorCount: 5,
  classCount: 7,
  studentCount: 217
})

// 文本引用
const basicInfoTextRef = ref(null)
const gradeTrendTextRef = ref(null)
const homeworkTextRef = ref(null)
const attendanceTextRef = ref(null)
const interactionTextRef = ref(null)
const researchTextRef = ref(null)
const majorMatchTextRef = ref(null)
const interestTextRef = ref(null)
const abilityTextRef = ref(null)
const summaryTextRef = ref(null)
const suggestionsTextRef = ref(null)

// 图表引用
const gradeChartRef = ref(null)
const homeworkChartRef = ref(null)
const attendanceChartRef = ref(null)
const interactionChartRef = ref(null)

// 报告内容
const reportContents = {
  basicInfo: '根据筛选条件，本次分析涵盖了3个学院、5个专业、7个班级，共计217名学生。整体来看，学生分布较为均衡，计算机学院和电子工程学院为主要生源，数学学院学生相对较少。',
  gradeTrend: '近一学期以来，学生整体成绩呈现稳步上升趋势。平均分从学期初的78.5分提升至期末的82.3分，提升幅度为4.8%。其中，优秀率（90分以上）从12.3%提升至18.7%，及格率保持在95%以上。需要关注的是，仍有约15%的学生成绩波动较大，建议加强个性化辅导。',
  homework: '作业完成情况整体良好，平均完成率达到92.5%。其中，按时提交率为88.3%，延迟提交率为4.2%。主要问题集中在实践类作业上，部分学生对于编程和项目实践类作业的完成质量有待提高。建议加强实践指导和作业反馈机制。',
  attendance: '出勤情况总体稳定，平均出勤率为94.2%。其中，全勤学生占比为68.5%，缺勤1-2次的学生占比为22.3%，缺勤3次以上的学生占比为9.2%。值得注意的是，缺勤3次以上的学生中，有37人存在异常停课情况，需要重点关注和及时干预。',
  interaction: '课堂互动积极性较高，平均互动参与度为76.8%。情绪分析显示，积极情绪占比为68.5%，中性情绪为25.3%，消极情绪为6.2%。学生在课堂提问、讨论和小组合作方面表现活跃，但仍有部分学生在课堂参与度上需要进一步提升。',
  research: '科研项目参与情况良好，共有15个在研项目和8个已结题项目。参与科研的学生人数达到89人，占比41%。项目类型涵盖国家级、省部级和校级项目，研究方向包括人工智能、大数据分析、知识图谱等前沿领域。学生通过参与科研项目，在实践能力和创新能力方面得到了显著提升。',
  majorMatch: '专业匹配度分析显示，学生整体能力与专业培养目标匹配度良好，平均匹配度为86.5%。其中，核心课程匹配度达到90%以上，编程能力和项目实践匹配度在85%左右，数学基础匹配度达到88%。但行业技能匹配度相对较低，为78%，建议加强行业实践和技能培训。',
  interest: '学生课外兴趣广泛，主要集中在科技创新、学术研究、社会实践和文体活动四个方面。其中，对AI技术、编程开发、数据科学等科技创新类活动兴趣最为浓厚，占比达到45.3%。此外，学术竞赛、科研项目参与度也较高，体现了学生较强的学习主动性和探索精神。',
  ability: '学生智能能力发展迅速，在数字人、智能体、工作流、知识库等智能工具的使用和开发方面表现突出。整体使用次数较上月增长20.3%，开发数量增长18.7%。其中，知识库使用增长最为显著，达到31%，体现了学生对知识管理和学习辅助工具的重视。',
  summary: '综合分析显示，学生整体学习状态良好，成绩稳步提升，作业完成率和出勤率保持在较高水平。课堂互动积极，科研参与度较高，专业匹配度良好。但在实践能力、行业技能和部分学生的学习稳定性方面仍有提升空间。',
  suggestions: '1. 加强实践教学，提高学生动手能力和项目实践能力；2. 建立个性化辅导机制，关注成绩波动较大的学生；3. 增加行业实践机会，提升学生行业技能匹配度；4. 完善课堂互动机制，提升全体学生的参与积极性；5. 继续鼓励学生参与科研项目，培养创新思维和实践能力。'
}

// 项目数据
const projectData = ref([
  { 
    name: '基于深度学习的智能教学系统', 
    leader: '李教授', 
    type: '国家级项目',
    status: '在研',
    statusClass: 'status-in-progress',
    students: ['张三', '李四', '王五']
  },
  { 
    name: '知识图谱驱动的智能答疑系统', 
    leader: '孙教授', 
    type: '省部级项目',
    status: '在研',
    statusClass: 'status-in-progress',
    students: ['赵六', '钱七', '孙八']
  },
  { 
    name: '基于大数据的课程教学质量评价体系', 
    leader: '周教授', 
    type: '校级项目',
    status: '结题',
    statusClass: 'status-completed',
    students: ['周九', '吴十']
  }
])

// 专业匹配度数据
const majorMatchData = ref([
  {
    name: '核心课程匹配度',
    value: 92,
    color: '#22c55e',
    description: '机器学习、深度学习、神经网络等核心课程成绩优秀'
  },
  {
    name: '编程能力匹配度',
    value: 85,
    color: '#3b82f6',
    description: 'Python熟练度85%、TensorFlow使用经验丰富'
  },
  {
    name: '数学基础匹配度',
    value: 88,
    color: '#8b5cf6',
    description: '线性代数、概率论、高等数学基础扎实'
  },
  {
    name: '项目实践匹配度',
    value: 91,
    color: '#f59e0b',
    description: '参与AI相关项目5个，包括图像识别、NLP等方向'
  },
  {
    name: '行业技能匹配度',
    value: 78,
    color: '#ec4899',
    description: '熟悉主流AI框架，具备算法优化实践经验'
  }
])

// 兴趣数据
const interestData = ref([
  '人工智能技术', '机器学习', '深度学习', '数据科学', '编程开发',
  '学术竞赛', '科研项目', '创新创业', '社会实践', '文体活动'
])

// 智能能力数据
const abilityData = ref([
  {
    name: '数字人',
    usageCount: 156,
    developmentCount: 12,
    icon: '👤',
    trend: { type: 'up', text: '较上月增长15%' }
  },
  {
    name: '智能体',
    usageCount: 203,
    developmentCount: 18,
    icon: '🤖',
    trend: { type: 'up', text: '较上月增长22%' }
  },
  {
    name: '工作流',
    usageCount: 178,
    developmentCount: 15,
    icon: '⚙️',
    trend: { type: 'up', text: '较上月增长8%' }
  },
  {
    name: '知识库',
    usageCount: 245,
    developmentCount: 28,
    icon: '📚',
    trend: { type: 'up', text: '较上月增长31%' }
  },
  {
    name: '视频',
    usageCount: 192,
    developmentCount: 22,
    icon: '🎥',
    trend: { type: 'up', text: '较上月增长12%' }
  },
  {
    name: '生成式分析',
    usageCount: 167,
    developmentCount: 14,
    icon: '📊',
    trend: { type: 'up', text: '较上月增长19%' }
  }
])

// 初始化图表
const initCharts = () => {
  // 成绩趋势图
  if (gradeChartRef.value) {
    const gradeChart = echarts.init(gradeChartRef.value)
    gradeChart.setOption({
      title: { text: '成绩趋势', left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周', '第9周', '第10周', '第11周', '第12周']
      },
      yAxis: { type: 'value', name: '平均分' },
      series: [{
        data: [78.5, 79.2, 79.8, 80.1, 80.5, 80.9, 81.2, 81.5, 81.8, 82.0, 82.2, 82.3],
        type: 'line',
        smooth: true,
        itemStyle: { color: '#7c3aed' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(124, 58, 237, 0.3)' }, { offset: 1, color: 'rgba(124, 58, 237, 0.1)' }] } }
      }]
    })
  }

  // 作业完成情况图
  if (homeworkChartRef.value) {
    const homeworkChart = echarts.init(homeworkChartRef.value)
    homeworkChart.setOption({
      title: { text: '作业完成情况', left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '60%',
        data: [
          { value: 88.3, name: '按时提交' },
          { value: 4.2, name: '延迟提交' },
          { value: 7.5, name: '未完成' }
        ],
        itemStyle: {
          color: (params) => {
            const colors = ['#22c55e', '#f59e0b', '#ef4444']
            return colors[params.dataIndex]
          }
        }
      }]
    })
  }

  // 出勤情况图
  if (attendanceChartRef.value) {
    const attendanceChart = echarts.init(attendanceChartRef.value)
    attendanceChart.setOption({
      title: { text: '出勤情况分布', left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '60%',
        data: [
          { value: 68.5, name: '全勤' },
          { value: 22.3, name: '缺勤1-2次' },
          { value: 9.2, name: '缺勤3次以上' }
        ],
        itemStyle: {
          color: (params) => {
            const colors = ['#22c55e', '#f59e0b', '#ef4444']
            return colors[params.dataIndex]
          }
        }
      }]
    })
  }

  // 课堂互动情况图
  if (interactionChartRef.value) {
    const interactionChart = echarts.init(interactionChartRef.value)
    interactionChart.setOption({
      title: { text: '课堂互动情绪分析', left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '60%',
        data: [
          { value: 68.5, name: '积极情绪' },
          { value: 25.3, name: '中性情绪' },
          { value: 6.2, name: '消极情绪' }
        ],
        itemStyle: {
          color: (params) => {
            const colors = ['#22c55e', '#94a3b8', '#ef4444']
            return colors[params.dataIndex]
          }
        }
      }]
    })
  }
}

// 打字机效果
const typeWriter = (element, text, speed = 30) => {
  if (!element || !text) return Promise.resolve()
  
  return new Promise((resolve) => {
    let currentIndex = 0
    element.textContent = ''
    
    const timer = setInterval(() => {
      if (currentIndex < text.length && isTypingActive.value) {
        element.textContent += text[currentIndex]
        currentIndex++
      } else {
        clearInterval(timer)
        const index = activeTimers.value.indexOf(timer)
        if (index > -1) {
          activeTimers.value.splice(index, 1)
        }
        resolve()
      }
    }, speed)
    
    activeTimers.value.push(timer)
  })
}

// 清空所有定时器
const clearAllTimers = () => {
  activeTimers.value.forEach(timer => clearInterval(timer))
  activeTimers.value = []
  isTypingActive.value = false
}

// 生成报告内容
const generateReport = async () => {
  isLoading.value = true
  
  // 模拟AI生成延迟
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  isLoading.value = false
  isTypingActive.value = true
  
  await nextTick()
  
  try {
    // 初始化图表
    await nextTick()
    initCharts()
    
    // 逐步显示内容（打字机效果）
    if (basicInfoTextRef.value) {
      await typeWriter(basicInfoTextRef.value, reportContents.basicInfo)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (gradeTrendTextRef.value) {
      await typeWriter(gradeTrendTextRef.value, reportContents.gradeTrend)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (homeworkTextRef.value) {
      await typeWriter(homeworkTextRef.value, reportContents.homework)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (attendanceTextRef.value) {
      await typeWriter(attendanceTextRef.value, reportContents.attendance)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (interactionTextRef.value) {
      await typeWriter(interactionTextRef.value, reportContents.interaction)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (researchTextRef.value) {
      await typeWriter(researchTextRef.value, reportContents.research)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (majorMatchTextRef.value) {
      await typeWriter(majorMatchTextRef.value, reportContents.majorMatch)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (interestTextRef.value) {
      await typeWriter(interestTextRef.value, reportContents.interest)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (abilityTextRef.value) {
      await typeWriter(abilityTextRef.value, reportContents.ability)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (summaryTextRef.value) {
      await typeWriter(summaryTextRef.value, reportContents.summary)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (suggestionsTextRef.value) {
      await typeWriter(suggestionsTextRef.value, reportContents.suggestions)
    }
  } catch (error) {
    console.log('Typing animation cancelled')
  }
}

// 返回
const goBack = () => {
  router.push({ name: 'LearningGroupPortrait' })
}

onMounted(() => {
  generateReport()
})

onBeforeUnmount(() => {
  clearAllTimers()
})
</script>

<style scoped>
.learning-report {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.report-header {
  border-bottom: 1px solid #6b7280;
  padding: 20px 38px;
  margin-top: 24px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
}

.header-left {
  flex: 1;
}

.report-title {
  margin: 0 0 8px;
  font-size: 24px;
  color: #0f172a;
  font-weight: 600;
}

.report-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #64748b;
}

.meta-item {
  display: flex;
  align-items: center;
}

.back-btn {
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid #10b981;
  background-color: #f1f8f6;
  color: #10b981;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.report-body {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 38px;
}

.report-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
}

.section-title {
  margin: 0 0 20px;
  font-size: 20px;
  color: #0f172a;
  font-weight: 600;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #d6eefb45 0%, #a3a5d640 100%);
  border-radius: 8px;
  padding: 20px;
  color: #374151;
  text-align: center;
  border: 1px solid #d1d5db;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
}

.content-text {
  line-height: 1.8;
  color: #475569;
  font-size: 15px;
  margin-bottom: 20px;
}

.typing-text {
  min-height: 24px;
}

.chart-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}

.project-list {
  margin-top: 20px;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  margin-bottom: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #7c3aed;
}

.project-info {
  flex: 1;
}

.project-name {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.project-meta {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.project-status {
  margin-left: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-in-progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.project-students {
  font-size: 13px;
  color: #64748b;
}

.students-label {
  font-weight: 500;
}

.students-names {
  color: #475569;
}

.match-indicators {
  margin-top: 20px;
}

.match-indicator {
  margin-bottom: 20px;
}

.indicator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.indicator-name {
  font-size: 15px;
  color: #0f172a;
  font-weight: 500;
}

.indicator-value {
  font-size: 18px;
  font-weight: 700;
  color: #7c3aed;
}

.indicator-progress {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.indicator-desc {
  font-size: 13px;
  color: #64748b;
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.interest-tag {
  padding: 8px 16px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 14px;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.ability-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.ability-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.ability-icon {
  font-size: 32px;
  margin-right: 16px;
}

.ability-info {
  flex: 1;
}

.ability-name {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.ability-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.ability-trend {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.ability-trend.up {
  background: #d1fae5;
  color: #065f46;
}

.summary-content {
  margin-top: 20px;
}

.summary-item {
  margin-bottom: 24px;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

.summary-text,
.suggestions-text {
  line-height: 1.8;
  color: #475569;
  font-size: 15px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: #64748b;
}

@media (max-width: 768px) {
  .report-header {
    padding: 16px 20px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .report-body {
    padding: 16px 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ability-grid {
    grid-template-columns: 1fr;
  }
}
</style>
