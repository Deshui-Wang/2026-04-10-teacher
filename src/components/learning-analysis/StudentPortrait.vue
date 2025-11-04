<template>
  <div class="student-portrait la-container">
    <div class="header">
      <div class="title-wrap">
        <h2>学生个体画像分析</h2>
      </div>
      <div class="actions">
        <router-link to="/learning-analysis">返回群体画像</router-link>
      </div>
    </div>

    <div class="student-info-card">
      <div class="student-info-header">
        <div class="avatar-large">{{ avatarInitial }}</div>
        <div class="student-basic-info">
          <div class="student-name-row">
            <h3 class="student-name">{{ studentName }}</h3>
            <span class="status-pill">在读</span>
          </div>
          <div class="student-meta-grid">
            <div class="meta-item">
              <span class="meta-label">学号</span>
              <span class="meta-value">{{ studentId }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">年级</span>
              <span class="meta-value">{{ studentGrade }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">院系</span>
              <span class="meta-value">{{ studentDepartment }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">班级</span>
              <span class="meta-value">{{ studentClass }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="student-indices">
        <div class="index-item">
          <div class="index-label">成绩综合指数</div>
          <div class="index-progress-wrapper">
            <div class="index-progress-bar">
              <div class="index-progress-fill" :style="{ width: scoreIndex + '%', backgroundColor: getIndexColor(scoreIndex) }"></div>
            </div>
            <span class="index-value">{{ scoreIndex }}</span>
          </div>
        </div>
        <div class="index-item">
          <div class="index-label">作业完成综合指数</div>
          <div class="index-progress-wrapper">
            <div class="index-progress-bar">
              <div class="index-progress-fill" :style="{ width: homeworkIndex + '%', backgroundColor: getIndexColor(homeworkIndex) }"></div>
            </div>
            <span class="index-value">{{ homeworkIndex }}</span>
          </div>
        </div>
        <div class="index-item">
          <div class="index-label">出勤指数</div>
          <div class="index-progress-wrapper">
            <div class="index-progress-bar">
              <div class="index-progress-fill" :style="{ width: attendanceIndex + '%', backgroundColor: getIndexColor(attendanceIndex) }"></div>
            </div>
            <span class="index-value">{{ attendanceIndex }}</span>
          </div>
        </div>
        <div class="index-item">
          <div class="index-label">课堂互动指数</div>
          <div class="index-progress-wrapper">
            <div class="index-progress-bar">
              <div class="index-progress-fill" :style="{ width: interactionIndex + '%', backgroundColor: getIndexColor(interactionIndex) }"></div>
            </div>
            <span class="index-value">{{ interactionIndex }}</span>
          </div>
        </div>
        <div class="index-item">
          <div class="index-label">科研项目参与指数</div>
          <div class="index-progress-wrapper">
            <div class="index-progress-bar">
              <div class="index-progress-fill" :style="{ width: researchIndex + '%', backgroundColor: getIndexColor(researchIndex) }"></div>
            </div>
            <span class="index-value">{{ researchIndex }}</span>
          </div>
        </div>
        <div class="index-item">
          <div class="index-label">专业匹配指数</div>
          <div class="index-progress-wrapper">
            <div class="index-progress-bar">
              <div class="index-progress-fill" :style="{ width: matchIndex + '%', backgroundColor: getIndexColor(matchIndex) }"></div>
            </div>
            <span class="index-value">{{ matchIndex }}</span>
          </div>
        </div>
        <div class="index-item">
          <div class="index-label">课外兴趣丰富度</div>
          <div class="index-progress-wrapper">
            <div class="index-progress-bar">
              <div class="index-progress-fill" :style="{ width: interestIndex + '%', backgroundColor: getIndexColor(interestIndex) }"></div>
            </div>
            <span class="index-value">{{ interestIndex }}</span>
          </div>
        </div>
        <div class="index-item">
          <div class="index-label">智能能力指数</div>
          <div class="index-progress-wrapper">
            <div class="index-progress-bar">
              <div class="index-progress-fill" :style="{ width: intelligentIndex + '%', backgroundColor: getIndexColor(intelligentIndex) }"></div>
            </div>
            <span class="index-value">{{ intelligentIndex }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="stat danger">
        <div class="stat-title">缺勤次数</div>
        <div class="stat-value">{{ absentCount }}次</div>
        <div class="stat-desc">近一月内缺勤次数</div>
      </div>
      <div class="stat warn">
        <div class="stat-title">成绩波动</div>
        <div class="stat-value">{{ scoreVariance }}</div>
        <div class="stat-desc">近一月成绩标准差</div>
      </div>
      <div class="stat success">
        <div class="stat-title">显著提升</div>
        <div class="stat-value">{{ improvement }}%</div>
        <div class="stat-desc">近一月成绩提升幅度</div>
      </div>
    </div>

    <div class="grid">
      <section class="card">
        <div class="card-head">
          <h3>成绩趋势</h3>
        </div>
        <div ref="personalTrendRef" class="echart-container"></div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>作业完成</h3>
        </div>
        <div ref="homeworkChartRef" class="echart-container"></div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>出勤率</h3>
        </div>
        <div ref="attendanceChartRef" class="echart-container"></div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>课堂互动情绪</h3>
        </div>
        <div ref="personalEmotionRef" class="echart-container small"></div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>科研项目</h3>
        </div>
        <div class="project-list">
          <div class="project-item" v-for="project in studentProjects" :key="project.name">
            <div class="project-info">
              <div class="project-name">{{ project.name }}</div>
              <div class="project-meta">
                <span>{{ project.leader }} · {{ project.type }}</span>
                <span v-if="project.status === '在研' && project.daysFromStart !== undefined" class="project-progress">
                  · 已进行 {{ project.daysFromStart }} 天
                </span>
              </div>
              <div class="project-desc" v-if="project.description">
                {{ project.description }}
              </div>
            </div>
            <span class="project-status" :class="project.statusClass">{{ project.status }}</span>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>专业匹配度</h3>
          <span class="major-tag">人工智能专业</span>
        </div>
        <div class="major-match-container">
          <div class="major-match-overview">
            <div class="overview-score">
              <div class="score-value">{{ matchRate }}%</div>
              <div class="score-label">整体匹配度</div>
            </div>
            <div class="overview-desc">
              <p>{{ matchDescription }}</p>
            </div>
          </div>
          <div class="major-match-indicators">
            <div class="match-indicator" v-for="indicator in majorMatchIndicators" :key="indicator.name">
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
      </section>

      <section class="card">
        <div class="card-head">
          <h3>课外兴趣</h3>
        </div>
        <div ref="interestWordCloudRef" class="echart-container"></div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>智能能力</h3>
        </div>
        <div ref="intelligentAbilityChartRef" class="echart-container"></div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import 'echarts-wordcloud'

const route = useRoute()
const studentId = computed(() => route.params.id)

// 从 query 参数获取学生姓名，如果没有则使用默认值
const studentName = computed(() => {
  if (route.query.name) {
    return route.query.name
  }
  return `学生${studentId.value}`
})

const avatarInitial = computed(() => `${String(studentName.value).slice(0,1)}`)

// 计算开始时间到现在的天数
const getDaysFromStart = (startDate) => {
  const start = new Date(startDate)
  const now = new Date()
  const diffTime = Math.abs(now - start)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// 根据指数值返回颜色
const getIndexColor = (value) => {
  if (value >= 90) return '#22c55e' // 优秀 - 绿色
  if (value >= 80) return '#3b82f6' // 良好 - 蓝色
  if (value >= 70) return '#f59e0b' // 中等 - 橙色
  if (value >= 60) return '#f97316' // 及格 - 橙红色
  return '#ef4444' // 待提升 - 红色
}

// 根据学生ID生成模拟数据（使用ID作为种子确保数据一致性）
const generateStudentData = (id) => {
  const seed = parseInt(id) % 7 || 1
  
  // 简单的确定性随机数生成器（基于种子）
  const simpleRandom = (seed, offset = 0) => {
    const x = Math.sin((seed + offset) * 12.9898) * 43758.5453
    return x - Math.floor(x)
  }
  
  // 学生基本信息
  const grades = ['2021级', '2022级', '2023级', '2024级']
  const departments = ['计算机科学与技术学院', '人工智能学院', '软件工程学院', '数据科学与大数据技术学院', '网络工程学院', '信息安全学院', '电子信息工程学院']
  const classes = ['1班', '2班', '3班', '4班', '5班']
  
  const studentGrade = grades[seed % grades.length]
  const studentDepartment = departments[seed % departments.length]
  const studentClass = classes[seed % classes.length]
  
  // 成绩趋势数据
  const scoreBase = 70 + (seed * 3)
  const scoreTrend = Array.from({ length: 8 }, (_, i) => {
    const variation = (Math.sin((i + seed) * 0.5) * 8) + (simpleRandom(seed, i) * 4 - 2)
    return Math.round(Math.max(60, Math.min(100, scoreBase + variation + i * 2)))
  })
  
  // 成绩综合指数（基于平均成绩和趋势）
  const avgScore = scoreTrend.reduce((sum, s) => sum + s, 0) / scoreTrend.length
  const scoreTrendUp = scoreTrend[scoreTrend.length - 1] > scoreTrend[0]
  const scoreIndex = Math.round(avgScore + (scoreTrendUp ? 5 : -3))
  
  // 统计卡片数据
  const absentCount = seed * 2
  const scoreVariance = (5 + simpleRandom(seed, 50) * 3).toFixed(1)
  const improvement = Math.round(8 + simpleRandom(seed, 60) * 7)
  
  // 作业完成率
  const completionRate = 85 + (seed * 2) + Math.floor(simpleRandom(seed, 10) * 5)
  const accuracyRate = completionRate - 8 + Math.floor(simpleRandom(seed, 20) * 6)
  const onTimeRate = completionRate - 3 + Math.floor(simpleRandom(seed, 30) * 4)
  const excellentRate = completionRate - 45 + Math.floor(simpleRandom(seed, 40) * 10)
  
  // 作业完成综合指数（综合完成率、正确率、按时提交率、优秀率）
  const homeworkIndex = Math.round((completionRate * 0.3 + accuracyRate * 0.3 + onTimeRate * 0.2 + excellentRate * 0.2))
  
  // 出勤数据
  const attendanceRate = 95 + (seed % 3)
  const totalClasses = 30
  const fullAttendance = Math.round(totalClasses * attendanceRate / 100)
  const lateCount = Math.round(totalClasses * 0.05)
  const earlyLeave = Math.round(totalClasses * 0.02)
  const absentCount2 = Math.round(totalClasses * (1 - attendanceRate / 100))
  const leaveCount = totalClasses - fullAttendance - lateCount - earlyLeave - absentCount2
  
  // 出勤指数（基于出勤率）
  const attendanceIndex = Math.round(attendanceRate)
  
  // 情绪分布
  const emotionData = [
    { value: 5 + seed, name: '沉闷沮丧', itemStyle: { color: '#ef4444' } },
    { value: 12 + (seed * 2), name: '消极疑惑', itemStyle: { color: '#f59e0b' } },
    { value: 55 + (seed * 2), name: '热情积极', itemStyle: { color: '#22c55e' } },
    { value: 28 - (seed * 2), name: '走神', itemStyle: { color: '#94a3b8' } }
  ]
  const totalEmotion = emotionData.reduce((sum, e) => sum + e.value, 0)
  emotionData.forEach(e => e.value = Math.round((e.value / totalEmotion) * 100))
  
  // 课堂互动指数（基于积极情绪占比）
  const positiveEmotion = emotionData.find(e => e.name === '热情积极')?.value || 0
  const interactionIndex = Math.round(positiveEmotion + (simpleRandom(seed, 200) * 10))
  
  // 兴趣词云数据（根据种子生成）
  const interestNames = ['编程竞赛', '摄影', '羽毛球', '篮球', '音乐', '阅读', '绘画', '书法', '围棋', '游泳', '跑步', '健身', '电影', '旅行', '美食']
  const interests = []
  interestNames.forEach((name, idx) => {
    if (simpleRandom(seed, idx * 10) > 0.4) {
      const value = Math.round(30 + simpleRandom(seed, idx * 20) * 70)
      interests.push({ name, value })
    }
  })
  
  // 课外兴趣丰富度（基于兴趣数量和活跃度）
  const interestCount = interests.length
  const avgInterestValue = interests.length > 0 ? interests.reduce((sum, i) => sum + i.value, 0) / interests.length : 0
  const interestIndex = Math.round(Math.min(100, (interestCount * 8) + (avgInterestValue * 0.3)))
  
  // 智能工具数据
  const intelligentTools = [
    { name: '数字人', usageCount: 10 + seed * 5, developmentCount: 1 + seed },
    { name: '智能体', usageCount: 15 + seed * 6, developmentCount: 2 + seed },
    { name: '工作流', usageCount: 12 + seed * 4, developmentCount: 1 + seed },
    { name: '知识库', usageCount: 18 + seed * 7, developmentCount: 2 + seed },
    { name: '视频', usageCount: 14 + seed * 5, developmentCount: 2 + seed },
    { name: '生成式分析', usageCount: 11 + seed * 4, developmentCount: 1 + seed },
    { name: '智能生图', usageCount: 13 + seed * 5, developmentCount: 1 + seed }
  ]
  
  // 智能能力指数（基于使用次数和开发次数）
  const totalUsage = intelligentTools.reduce((sum, t) => sum + t.usageCount, 0)
  const totalDevelopment = intelligentTools.reduce((sum, t) => sum + t.developmentCount, 0)
  const intelligentIndex = Math.round(Math.min(100, (totalUsage * 0.8) + (totalDevelopment * 15)))
  
  // 专业匹配度指标
  const matchRate = 85 + (seed * 2) + Math.floor(simpleRandom(seed, 30) * 5)
  const majorMatchIndicators = [
    {
      name: '核心课程匹配度',
      value: matchRate + Math.floor(simpleRandom(seed, 100) * 8) - 4,
      color: '#22c55e',
      description: '机器学习、深度学习、神经网络等核心课程成绩表现'
    },
    {
      name: '编程能力匹配度',
      value: matchRate + Math.floor(simpleRandom(seed, 110) * 8) - 6,
      color: '#3b82f6',
      description: 'Python、TensorFlow、PyTorch等编程技能掌握情况'
    },
    {
      name: '数学基础匹配度',
      value: matchRate + Math.floor(simpleRandom(seed, 120) * 6) - 3,
      color: '#8b5cf6',
      description: '线性代数、概率论、高等数学等基础学科能力'
    },
    {
      name: '项目实践匹配度',
      value: matchRate + Math.floor(simpleRandom(seed, 130) * 8) - 4,
      color: '#f59e0b',
      description: 'AI相关项目实践经验与能力表现'
    },
    {
      name: '行业技能匹配度',
      value: matchRate + Math.floor(simpleRandom(seed, 140) * 8) - 6,
      color: '#ec4899',
      description: '算法优化、模型部署等实际应用能力'
    }
  ]
  
  const matchDescription = `学生能力与人工智能专业培养目标匹配度${matchRate >= 90 ? '优秀' : matchRate >= 80 ? '良好' : '一般'}，在核心课程和项目实践方面${matchRate >= 85 ? '表现突出' : '有提升空间'}。`
  
  // 科研项目数据
  const projectTemplates = [
    { name: '基于深度学习的智能教学辅助系统研究', leader: '张教授', type: '国家级项目', startDate: '2024-01-15' },
    { name: '人工智能驱动的个性化学习路径推荐', leader: '李教授', type: '省部级项目', startDate: '2024-03-20' },
    { name: '教育大数据挖掘与分析平台构建', leader: '王教授', type: '校级重点项目', startDate: '2024-02-10' },
    { name: '在线教育质量评估与优化方法研究', leader: '刘教授', type: '省部级项目', startDate: '2024-04-05' },
    { name: '多模态学习行为分析与预测', leader: '陈教授', type: '国家级项目', startDate: '2024-01-28' },
    { name: '虚拟现实技术在实验教学中的应用', leader: '赵教授', type: '校级项目', startDate: '2023-06-01' },
    { name: '知识图谱驱动的智能答疑系统', leader: '孙教授', type: '省部级项目', startDate: '2023-09-15' }
  ]
  
  const studentProjects = projectTemplates
    .slice(seed, seed + 3)
    .map(project => ({
      ...project,
      status: new Date(project.startDate) < new Date('2024-06-01') ? '结题' : '在研',
      statusClass: new Date(project.startDate) < new Date('2024-06-01') ? 'status-completed' : 'status-active',
      description: `参与${project.type}，负责${['算法设计', '数据采集', '系统开发', '测试优化'][seed % 4]}相关工作`
    }))
    .map(project => {
      if (project.status === '在研') {
        return {
          ...project,
          daysFromStart: getDaysFromStart(project.startDate)
        }
      }
      return project
    })
  
  // 科研项目参与指数（基于项目数量和参与程度）
  const activeProjects = studentProjects.filter(p => p.status === '在研').length
  const completedProjects = studentProjects.filter(p => p.status === '结题').length
  const researchIndex = Math.round(Math.min(100, (activeProjects * 25) + (completedProjects * 20) + (simpleRandom(seed, 300) * 15)))
  
  return {
    // 学生基本信息
    studentGrade,
    studentDepartment,
    studentClass,
    // 综合指数
    scoreIndex: Math.min(100, Math.max(0, scoreIndex)),
    homeworkIndex: Math.min(100, Math.max(0, homeworkIndex)),
    attendanceIndex: Math.min(100, Math.max(0, attendanceIndex)),
    interactionIndex: Math.min(100, Math.max(0, interactionIndex)),
    researchIndex: Math.min(100, Math.max(0, researchIndex)),
    matchIndex: matchRate,
    interestIndex: Math.min(100, Math.max(0, interestIndex)),
    intelligentIndex: Math.min(100, Math.max(0, intelligentIndex)),
    // 其他数据
    scoreTrend,
    absentCount,
    scoreVariance,
    improvement,
    completionRate,
    accuracyRate,
    onTimeRate,
    excellentRate,
    attendanceRate,
    attendanceData: [
      { value: fullAttendance, name: '全勤' },
      { value: lateCount, name: '迟到' },
      { value: earlyLeave, name: '早退' },
      { value: absentCount2, name: '缺勤' },
      { value: leaveCount, name: '请假' }
    ],
    emotionData,
    interests,
    intelligentTools,
    matchRate,
    majorMatchIndicators,
    matchDescription,
    studentProjects
  }
}

// 根据学生ID生成数据
const studentData = computed(() => generateStudentData(studentId.value))

// 学生基本信息
const studentGrade = computed(() => studentData.value.studentGrade)
const studentDepartment = computed(() => studentData.value.studentDepartment)
const studentClass = computed(() => studentData.value.studentClass)

// 综合指数
const scoreIndex = computed(() => studentData.value.scoreIndex)
const homeworkIndex = computed(() => studentData.value.homeworkIndex)
const attendanceIndex = computed(() => studentData.value.attendanceIndex)
const interactionIndex = computed(() => studentData.value.interactionIndex)
const researchIndex = computed(() => studentData.value.researchIndex)
const matchIndex = computed(() => studentData.value.matchIndex)
const interestIndex = computed(() => studentData.value.interestIndex)
const intelligentIndex = computed(() => studentData.value.intelligentIndex)

// 统计数据
const absentCount = computed(() => studentData.value.absentCount)
const scoreVariance = computed(() => studentData.value.scoreVariance)
const improvement = computed(() => studentData.value.improvement)

// 其他数据
const completionRate = computed(() => studentData.value.completionRate)
const accuracyRate = computed(() => studentData.value.accuracyRate)
const matchRate = computed(() => studentData.value.matchRate)
const majorMatchIndicators = computed(() => studentData.value.majorMatchIndicators)
const matchDescription = computed(() => studentData.value.matchDescription)
const studentProjects = computed(() => studentData.value.studentProjects)

// charts refs
const personalTrendRef = ref(null)
const personalEmotionRef = ref(null)
const homeworkChartRef = ref(null)
const attendanceChartRef = ref(null)
const interestWordCloudRef = ref(null)
const intelligentAbilityChartRef = ref(null)

let personalTrendChart, personalEmotionChart, homeworkChart, attendanceChart, interestWordCloudChart, intelligentAbilityChart

const initCharts = () => {
  const data = studentData.value
  
  // 成绩趋势
  if (personalTrendChart) personalTrendChart.dispose()
  personalTrendChart = echarts.init(personalTrendRef.value)
  personalTrendChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, bottom: 30, top: 20 },
    xAxis: { type: 'category', data: ['第1周','第2周','第3周','第4周','第5周','第6周','第7周','第8周'] },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [{
      name: '个人成绩',
      type: 'line',
      smooth: true,
      data: data.scoreTrend,
      itemStyle: { color: '#5352ed' },
      lineStyle: { width: 3 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0,0,0,1,[
          {offset:0,color:'rgba(83,82,237,.35)'},
          {offset:1,color:'rgba(83,82,237,.08)'}
        ])
      }
    }]
  })

  // 作业完成对比
  if (homeworkChart) homeworkChart.dispose()
  homeworkChart = echarts.init(homeworkChartRef.value)
  homeworkChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        let result = params[0].name + '<br/>'
        params.forEach(param => {
          result += param.seriesName + ': ' + param.value + '%<br/>'
        })
        return result
      }
    },
    legend: {
      data: ['班级平均', '个人'],
      top: 10,
      right: 20,
      textStyle: { fontSize: 12 }
    },
    grid: { left: 60, right: 30, bottom: 30, top: 50 },
    xAxis: {
      type: 'category',
      data: ['完成率', '正确率', '按时提交率', '优秀率'],
      axisLabel: { fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        fontSize: 11
      },
      splitLine: {
        lineStyle: { color: '#f1f5f9', type: 'dashed' }
      }
    },
    series: [
      {
        name: '班级平均',
        type: 'bar',
        data: [85, 78, 82, 35],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#94a3b8' },
            { offset: 1, color: '#64748b' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: 20,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          fontSize: 11,
          color: '#64748b'
        }
      },
      {
        name: '个人',
        type: 'bar',
        data: [data.completionRate, data.accuracyRate, data.onTimeRate, data.excellentRate],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#5352ed' },
            { offset: 1, color: '#4338ca' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: 20,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          fontSize: 11,
          color: '#4338ca'
        }
      }
    ]
  })

  // 出勤率饼状图
  if (attendanceChart) attendanceChart.dispose()
  attendanceChart = echarts.init(attendanceChartRef.value)
  const attendanceData = data.attendanceData.map(item => ({
    ...item,
    itemStyle: {
      color: item.name === '全勤' ? '#10b981' :
             item.name === '迟到' ? '#f59e0b' :
             item.name === '早退' ? '#f97316' :
             item.name === '缺勤' ? '#ef4444' : '#6366f1'
    }
  }))
  attendanceChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}次 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 12 },
      formatter: function(name) {
        const item = attendanceData.find(d => d.name === name)
        return item ? name + '  ' + item.value + '次' : name
      }
    },
    series: [
      {
        name: '出勤情况',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 11,
          fontWeight: 'normal'
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 8
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold'
          }
        },
        data: attendanceData
      }
    ]
  })

  // 课堂情绪
  if (personalEmotionChart) personalEmotionChart.dispose()
  personalEmotionChart = echarts.init(personalEmotionRef.value)
  personalEmotionChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}% ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 12 },
      formatter: function(name) {
        const item = data.emotionData.find(d => d.name === name)
        return item ? name + '  ' + item.value + '%' : name
      }
    },
    series: [
      {
        name: '课堂互动情绪',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 11,
          fontWeight: 'normal'
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 8
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold'
          }
        },
        data: data.emotionData
      }
    ]
  })

  // 课外兴趣词云图
  if (interestWordCloudChart) interestWordCloudChart.dispose()
  interestWordCloudChart = echarts.init(interestWordCloudRef.value)
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ]
  const interestData = data.interests.map((item, idx) => ({
    ...item,
    textStyle: { color: colors[idx % colors.length] }
  }))
  interestWordCloudChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return params.name + ': ' + params.value
      }
    },
    series: [{
      type: 'wordCloud',
      gridSize: 8,
      sizeRange: [14, 32],
      rotationRange: [-45, 45],
      rotationStep: 5,
      shape: 'circle',
      width: '100%',
      height: '100%',
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold'
      },
      emphasis: {
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: interestData
    }]
  })

  // 智能能力柱状图
  if (intelligentAbilityChart) intelligentAbilityChart.dispose()
  intelligentAbilityChart = echarts.init(intelligentAbilityChartRef.value)
  const toolNames = data.intelligentTools.map(tool => tool.name)
  const usageCounts = data.intelligentTools.map(tool => tool.usageCount)
  const developmentCounts = data.intelligentTools.map(tool => tool.developmentCount)
  
  intelligentAbilityChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        let result = params[0].name + '<br/>'
        params.forEach(param => {
          result += param.seriesName + ': ' + param.value + '<br/>'
        })
        return result
      }
    },
    legend: {
      data: ['使用次数', '设计开发'],
      top: 10,
      right: 20,
      textStyle: { fontSize: 12 }
    },
    grid: {
      left: 60,
      right: 30,
      bottom: 60,
      top: 50,
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: toolNames,
      axisLabel: {
        fontSize: 11,
        rotate: 15,
        interval: 0,
        color: '#0f172a'
      },
      axisLine: {
        lineStyle: { color: '#e2e8f0' }
      }
    },
    yAxis: {
      type: 'value',
      name: '次数',
      nameTextStyle: {
        fontSize: 12,
        color: '#0f172a'
      },
      axisLabel: {
        fontSize: 11,
        color: '#0f172a'
      },
      axisLine: {
        lineStyle: { color: '#e2e8f0' }
      },
      splitLine: {
        lineStyle: { color: '#f1f5f9', type: 'dashed' }
      }
    },
    series: [
      {
        name: '使用次数',
        type: 'bar',
        data: usageCounts,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#60a5fa' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2563eb' },
              { offset: 1, color: '#3b82f6' }
            ])
          }
        }
      },
      {
        name: '设计开发',
        type: 'bar',
        data: developmentCounts,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#8b5cf6' },
            { offset: 1, color: '#a78bfa' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#7c3aed' },
              { offset: 1, color: '#8b5cf6' }
            ])
          }
        }
      }
    ]
  })
}

const resize = () => {
  personalTrendChart && personalTrendChart.resize()
  personalEmotionChart && personalEmotionChart.resize()
  homeworkChart && homeworkChart.resize()
  attendanceChart && attendanceChart.resize()
  interestWordCloudChart && interestWordCloudChart.resize()
  intelligentAbilityChart && intelligentAbilityChart.resize()
}

// 监听学生ID变化，重新初始化图表
watch(() => studentId.value, () => {
  if (personalTrendRef.value && personalEmotionRef.value) {
    setTimeout(() => {
      initCharts()
    }, 100)
  }
}, { immediate: false })

onMounted(() => {
  initCharts()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  personalTrendChart && personalTrendChart.dispose()
  personalEmotionChart && personalEmotionChart.dispose()
  homeworkChart && homeworkChart.dispose()
  attendanceChart && attendanceChart.dispose()
  interestWordCloudChart && interestWordCloudChart.dispose()
  intelligentAbilityChart && intelligentAbilityChart.dispose()
})
</script>

<style scoped>
.student-portrait {
  padding: 8px 0;
}

.la-container {
  max-width: 1480px;
  margin: 0 auto;
  padding: 24px 38px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;
}

.title-wrap h2 {
  margin: 0;
  font-size: 20px;
  color: #0f172a;
}

.title-wrap .sub {
  margin: 2px 0 0;
  color: #64748b;
  font-size: 13px;
}

.actions a {
  color: #2563eb;
  text-decoration: none;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  padding: 6px 10px;
  border-radius: 8px;
}

.actions a:hover {
  background: #dbeafe;
}

.student-info-card {
  background: linear-gradient(180deg, #ffffff, #fafcff);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(16, 24, 40, .06);
}

.student-info-header {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 32px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, .3);
}

.student-basic-info {
  flex: 1;
}

.student-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.student-name {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.status-pill {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
}

.student-meta-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
}

.meta-value {
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
}

.student-indices {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.index-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.index-label {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.index-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.index-progress-bar {
  flex: 1;
  height: 10px;
  background: #e2e8f0;
  border-radius: 5px;
  overflow: hidden;
}

.index-progress-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.6s ease, background-color 0.3s ease;
}

.index-value {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  min-width: 45px;
  text-align: right;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.stat {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, .04);
}

.stat .stat-title {
  color: #64748b;
  font-size: 12px;
}

.stat .stat-value {
  font-size: 22px;
  font-weight: 700;
  margin: 6px 0;
}

.stat .stat-desc {
  color: #64748b;
  font-size: 12px;
}

.stat.danger {
  background: #fff1f2;
  border-color: #fecdd3;
}

.stat.warn {
  background: #fff7ed;
  border-color: #fed7aa;
}

.stat.success {
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, .04);
  transition: box-shadow .2s ease, transform .2s ease;
}

.card:hover {
  box-shadow: 0 6px 18px rgba(16, 24, 40, .08);
  transform: translateY(-2px);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-head h3 {
  margin: 0;
  font-size: 15px;
  color: #0f172a;
  letter-spacing: .2px;
  display: flex;
  align-items: center;
}

.echart-container {
  height: 260px;
  width: 100%;
}

.echart-container.small {
  height: 220px;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 280px;
  overflow-y: auto;
  padding-right: 4px;
}

.project-list::-webkit-scrollbar {
  width: 6px;
}

.project-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.project-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.project-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.project-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  gap: 12px;
}

.project-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateX(2px);
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-name {
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-meta {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 6px;
}

.project-progress {
  color: #3b82f6;
  font-weight: 500;
}

.project-desc {
  font-size: 11px;
  color: #475569;
  margin-top: 4px;
  line-height: 1.4;
}

.project-status {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}

.project-status.status-active {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.project-status.status-completed {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.major-tag {
  display: inline-block;
  font-size: 11px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 12px;
  font-weight: 500;
  margin-left: 8px;
}

.major-match-container {
  padding: 16px 4px 16px 0;
  height: 280px;
  overflow-y: auto;
}

.major-match-container::-webkit-scrollbar {
  width: 6px;
}

.major-match-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.major-match-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.major-match-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.major-match-overview {
  display: flex;
  gap: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 1px solid #bae6fd;
  margin-bottom: 20px;
}

.overview-score {
  flex-shrink: 0;
  text-align: center;
  min-width: 100px;
}

.score-value {
  font-size: 36px;
  font-weight: 700;
  color: #0ea5e9;
  line-height: 1;
  margin-bottom: 6px;
}

.score-label {
  font-size: 12px;
  color: #0369a1;
  font-weight: 500;
}

.overview-desc {
  flex: 1;
  display: flex;
  align-items: center;
}

.overview-desc p {
  margin: 0;
  font-size: 13px;
  color: #0c4a6e;
  line-height: 1.6;
}

.major-match-indicators {
  display: flex;
  flex-direction: row;
  gap: 14px;
}

.match-indicator {
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.match-indicator:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateX(2px);
}

.indicator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  margin-bottom: 8px;
}

.indicator-name {
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
}

.indicator-value {
  font-size: 15px;
  font-weight: 600;
  color: #334155;
}

.indicator-progress {
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
  font-size: 11px;
  color: #64748b;
  line-height: 1.5;
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .student-meta-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .student-indices {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .student-info-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .student-name-row {
    justify-content: center;
  }

  .student-meta-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .student-indices {
    grid-template-columns: 1fr;
  }

  .avatar-large {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .student-name {
    font-size: 20px;
  }
}
</style>


