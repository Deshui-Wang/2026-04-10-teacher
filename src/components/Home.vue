<template>
  <div class="light-dashboard-container">
      <!-- 学期进度独立行 -->
      <div class="semester-progress-row">
        <div class="chart-card semester-progress-card">
          <h3>2025上学期进度</h3>
          <div class="timeline">
            <div class="timeline-header">
              <span>第 {{ currentWeek }} 周 / 共 {{ semesterWeeks }} 周</span>
              <span class="percent">{{ semesterProgressPercent }}%</span>
            </div>
            <div class="timeline-track">
              <div class="timeline-fill" :style="{ width: semesterProgressPercent + '%' }"></div>
              <div class="timeline-ticks">
                <span v-for="w in semesterWeeks" :key="w" class="tick" :style="{ left: ((w - 1) / (semesterWeeks - 1)) * 100 + '%' }"></span>
              </div>
            </div>
            <div class="timeline-labels">
              <span>开学 {{ formatDate(semesterStart) }}</span>
              <span>结课 {{ formatDate(semesterEnd) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="overview-grid">

        <!-- 教师总数与分布 -->
        <div class="chart-card">
          <h3>教师总数与分布</h3>
          <div class="chart-tabs">
            <button 
              v-for="tab in distributionTabs" 
              :key="tab.key"
              :class="['tab-btn', { active: activeDistributionTab === tab.key }]"
              @click="activeDistributionTab = tab.key">
              {{ tab.label }}
            </button>
          </div>
          <div ref="distributionChart" class="chart-container"></div>
        </div>

        <!-- 年度考核进度 -->
        <div class="chart-card">
          <h3>年度考核进度</h3>
          <div ref="assessmentChart" class="chart-container"></div>
          <div class="assessment-legend">
            <div class="legend-item">
              <span class="legend-dot completed"></span>
              <span>已完成 ({{ completedAssessments }})</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot pending"></span>
              <span>待完成 ({{ pendingAssessments }})</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot reviewing"></span>
              <span>待审核 ({{ reviewingAssessments }})</span>
            </div>
          </div>
        </div>

        <!-- 职称申报情况 -->
        <div class="chart-card">
          <h3>职称申报情况</h3>
          <div ref="titleChart" class="chart-container" style="height: 280px;"></div>
          <div class="title-summary">
            <div class="summary-item">
              <span class="summary-number">{{ titleApplications }}</span>
              <span class="summary-label">申报总数</span>
            </div>
            <div class="summary-item">
              <span class="summary-number">{{ titlePassRate }}%</span>
              <span class="summary-label">通过率</span>
            </div>
            <div class="summary-item">
              <span class="summary-number">{{ Math.floor(titleApplications * titlePassRate / 100) }}</span>
              <span class="summary-label">已通过</span>
            </div>
          </div>
        </div>

        <!-- 科研与成果 -->
        <div class="chart-card">
          <h3>科研与成果</h3>
          <div ref="researchChart" class="chart-container"></div>
          <div class="research-metrics">
            <div class="metric-item">
              <div class="metric-icon">📊</div>
              <div class="metric-content">
                <span class="metric-value">{{ researchProjects }}</span>
                <span class="metric-label">在研项目</span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-icon">💰</div>
              <div class="metric-content">
                <span class="metric-value">{{ researchFunding }}万</span>
                <span class="metric-label">科研经费</span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-icon">🏆</div>
              <div class="metric-content">
                <span class="metric-value">{{ researchAwards }}</span>
                <span class="metric-label">成果奖励</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 教学质量指数 -->
        <div class="chart-card">
          <h3>教学质量指数</h3>
          <div ref="qualityChart" class="chart-container"></div>
          <div class="quality-indicators">
            <div class="indicator-item">
              <span class="indicator-label">平均评教分</span>
              <span class="indicator-value">{{ averageRating }}/5.0</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">优秀教师占比</span>
              <span class="indicator-value">{{ excellentTeacherRatio }}%</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">课程达成度</span>
              <span class="indicator-value">{{ courseAchievement }}%</span>
            </div>
          </div>
        </div>
      
        <div class="chart-card">
        <h3>学期平均分值</h3>
        <div class="score-content">
          <div class="score-main">
            <div class="score-value">79</div>
          </div>
          <div class="score-details">
            <div class="score-item">
              <div class="score-info">
                <span class="score-label">最高分</span>
                <strong class="score-number">97</strong>
              </div>
              <div class="teacher-info">
                <div class="teacher-avatar">
                  <img src="/pic/teacher/66.jpg" alt="张学文" class="avatar-img">
                </div>
                <div class="teacher-name">张学文</div>
              </div>
            </div>
            <div class="score-item">
              <div class="score-info">
                <span class="score-label">最低分</span>
                <strong class="score-number">46</strong>
              </div>
              <div class="teacher-info">
                <div class="teacher-avatar">
                  <img src="/pic/teacher/083.png" alt="李源" class="avatar-img">
                </div>
                <div class="teacher-name">李源</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      </div>

      <!-- 目标完成情况独立行 -->
      <div class="targets-progress-row">
        <div class="chart-card targets-progress-card">
          <div class="targets-header">
            <h3>目标完成情况</h3>
          </div>
          <div class="targets-grid rings">
            <div class="target-item" v-for="(t, idx) in targetGoals" :key="t.name">
              <div class="target-ring" :ref="el => setTargetRef(el, idx)"></div>
              <span class="target-name">{{ t.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 梯队分布独立行 -->
      <div class="ladder-progress-row">
        <div class="chart-card ladder-progress-card">
          <div class="ladder-header">
            <h3>梯队分布</h3>
          </div>
          <div ref="ladderChart" style="width: 100%; height: 240px;"></div>
                  <div class="ladder-legend">
          <span class="dot cat-0"></span> 达标
          <span class="dot cat-1"></span> 上升
          <span class="dot cat-2"></span> 冲刺
        </div>
        </div>
      </div>

      <!-- 晋升趋势独立行 -->
      <div class="trends-progress-row">
        <div class="chart-card trends-progress-card">
          <div class="trends-header">
              <h3>各院系晋升趋势</h3>
              <div class="title-selector">
                  <button 
                      v-for="title in titleOptions" 
                      :key="title" 
                      class="title-btn"
                      :class="{ active: activeTitle === title }"
                      @click="activeTitle = title">
                      {{ title }}
                  </button>
              </div>
          </div>
          <div ref="employmentChart" style="width: 100%; height: 300px;"></div>
        </div>
      </div>





  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onBeforeUnmount, onBeforeUpdate } from 'vue'
import * as echarts from 'echarts'
import { getSemesterMeta, getCourseProgress } from '../services/semester.service'

const employmentChart = ref(null)
const matchingChart = ref(null)
const riskChart = ref(null)
const notificationScroll = ref(null)
const activeTitle = ref('正高级教师')
const titleOptions = ['三级教师', '二级教师', '助教', '一级教师', '讲师', '高级教师', '副教授', '正高级教师', '教授']

// 通知条数据
const notifications = ref([
  { content: '📋 2025年职称晋升申报已开始，请符合条件的教师及时提交材料，截止日期：3月31日' },
  { content: '✅ 教学比赛报名审核结果已公布，请登录系统查看审核状态，如有疑问请联系教务处' },
  { content: '🎓 青年教师发展计划报名启动，包含教学技能培训、科研能力提升等课程，报名截止：4月15日' },
  { content: '📚 本学期教学观摩活动安排已发布，各院系可组织教师参与，提升教学水平' },
  { content: '🔬 科研项目申报指南更新，新增人工智能、绿色能源等前沿领域，申报截止：5月20日' },
  { content: '🏆 年度优秀教师评选活动即将开始，请各院系推荐候选人，材料提交截止：4月30日' }
])

// 新增：全校教师发展与考核关键数据
const totalTeachers = ref(1247)
const completedAssessments = ref(892)
const pendingAssessments = ref(298)
const reviewingAssessments = ref(57)
const titleApplications = ref(156)
const titlePassRate = ref(78)
const researchProjects = ref(89)
const researchFunding = ref(2340)
const researchAwards = ref(45)
const averageRating = ref(4.6)
const excellentTeacherRatio = ref(68)
const courseAchievement = ref(92)

// 分布图表相关
const distributionChart = ref(null)
const assessmentChart = ref(null)
const titleChart = ref(null)
const researchChart = ref(null)
const qualityChart = ref(null)
const activeDistributionTab = ref('title')

const distributionTabs = ref([
  { key: 'title', label: '职称分布' },
  { key: 'position', label: '岗位分布' },
  { key: 'department', label: '院系分布' }
])

// 图表实例
let distributionChartInstance = null
let assessmentChartInstance = null
let titleChartInstance = null
let researchChartInstance = null
let qualityChartInstance = null

// 教师工作年限与职称数据
const workYears = ref(10) // 当前登录账号教师工作年限
const titleLevels = {
  '初级': ['三级教师', '二级教师', '助教'],
  '中级': ['一级教师', '讲师'],
  '副高级': ['高级教师', '副教授'],
  '正高级': ['正高级教师', '教授']
}

// 生成晋升趋势数据（逐年递增）
const careerProgression = computed(() => {
  const data = []
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - workYears.value + 1
  
  for (let i = 0; i < workYears.value; i++) {
    const year = startYear + i
    // 模拟逐年递增的分值，从20分开始，每年递增6-12分
    const baseScore = 20 + i * 8 + Math.random() * 4
    const score = Math.min(100, Math.max(0, baseScore))
    
    // 根据分值确定职称级别
    let level, title
    if (score < 30) {
      level = '初级'
      title = titleLevels['初级'][Math.floor(Math.random() * titleLevels['初级'].length)]
    } else if (score < 50) {
      level = '初级'
      title = titleLevels['初级'][Math.floor(Math.random() * titleLevels['初级'].length)]
    } else if (score < 70) {
      level = '中级'
      title = titleLevels['中级'][Math.floor(Math.random() * titleLevels['中级'].length)]
    } else if (score < 85) {
      level = '副高级'
      title = titleLevels['副高级'][Math.floor(Math.random() * titleLevels['副高级'].length)]
    } else {
      level = '正高级'
      title = titleLevels['正高级'][Math.floor(Math.random() * titleLevels['正高级'].length)]
    }
    
    data.push({
      year,
      score: Math.round(score),
      level,
      title
    })
  }
  return data
})

// 新增：图表数据生成函数
function generateDistributionData(type) {
  switch (type) {
    case 'title':
      return [
        { name: '教授', value: 156, color: '#ff6b6b' },
        { name: '副教授', value: 234, color: '#4ecdc4' },
        { name: '讲师', value: 345, color: '#45b7d1' },
        { name: '助教', value: 234, color: '#96ceb4' },
        { name: '其他', value: 278, color: '#feca57' }
      ]
    case 'position':
      return [
        { name: '教学岗', value: 567, color: '#ff9ff3' },
        { name: '科研岗', value: 234, color: '#54a0ff' },
        { name: '管理岗', value: 189, color: '#5f27cd' },
        { name: '实验岗', value: 156, color: '#00d2d3' },
        { name: '其他', value: 101, color: '#ff9f43' }
      ]
    case 'department':
      return [
        { name: '计算机学院', value: 234, color: '#ff6b6b' },
        { name: '数学学院', value: 189, color: '#4ecdc4' },
        { name: '物理学院', value: 156, color: '#45b7d1' },
        { name: '化学学院', value: 145, color: '#96ceb4' },
        { name: '其他学院', value: 523, color: '#feca57' }
      ]
    default:
      return []
  }
}

function generateAssessmentData() {
  return [
    { name: '已完成', value: completedAssessments.value, color: '#34c759' },
    { name: '待完成', value: pendingAssessments.value, color: '#ff9500' },
    { name: '待审核', value: reviewingAssessments.value, color: '#5856d6' }
  ]
}

function generateTitleData() {
  const total = titleApplications.value
  const passed = Math.floor(total * titlePassRate.value / 100)
  const reviewing = Math.floor(total * 0.15) // 15% 在审核中
  const failed = total - passed - reviewing
  
  return [
    { name: '已通过', value: passed, color: '#34c759' },
    { name: '审核中', value: reviewing, color: '#ff9500' },
    { name: '未通过', value: Math.max(0, failed), color: '#ff3b30' }
  ]
}

function generateResearchData() {
  return [
    { name: '在研项目', value: researchProjects.value, color: '#007aff' },
    { name: '科研经费', value: researchFunding.value / 100, color: '#34c759' },
    { name: '成果奖励', value: researchAwards.value, color: '#ff9500' }
  ]
}

function generateQualityData() {
  return [
    { name: '平均评教分', value: averageRating.value * 20, color: '#ff6b6b' },
    { name: '优秀教师占比', value: excellentTeacherRatio.value, color: '#4ecdc4' },
    { name: '课程达成度', value: courseAchievement.value, color: '#45b7d1' }
  ]
}
 
 const topCompanies = ref([
   { name: '腾讯 - 人工智能体验师', location: '深圳', salary: '18K', logo: '/pic/tengxun.png' },
   { name: '华为 - UI设计师', location: '北京', salary: '12K', logo: '/pic/hw.png' },
   { name: '京东 - 电商运营', location: '北京', salary: '15K', logo: '/pic/jd.png' }
 ]);
 
 const quickSections = ref([
   { title: '教学经验', items: ['课程思政', '教学理念', '教学反思'] },
   { title: '教学活动', items: ['实践进修', '教学比赛', '学生指导', '公共服务', '专家讲座', '其他活动'] },
   { title: '成果奖励', items: ['论文案例', '荣誉称号', '指导学生获', '教学比赛获奖', '出版教材'] }
 ]);
 
 // 学期进度数据
 const semesterWeeks = ref(20)
 const semesterStart = ref(new Date('2025-03-01'))
 const semesterEnd = ref(new Date('2025-07-15'))
 
 const clamp = (n, min, max) => Math.max(min, Math.min(n, max))
 
 const currentWeek = computed(() => {
   const now = new Date()
   const start = semesterStart.value
   const end = semesterEnd.value
   const totalDays = Math.max(1, Math.round((end - start) / 86400000))
   const elapsedDays = clamp(Math.round((now - start) / 86400000), 0, totalDays)
   return clamp(Math.floor(elapsedDays / 7) + 1, 1, semesterWeeks.value)
 })
 
 const semesterProgressPercent = computed(() => {
   return Math.round(clamp(((currentWeek.value - 1) / semesterWeeks.value) * 100, 0, 100))
 })
 
 const courseProgress = ref([
   { name: '数据结构', percent: 35 },
   { name: '计算机网络', percent: 62 },
   { name: '教育学导论', percent: 48 },
   { name: 'UI设计基础', percent: 80 }
 ])
 
 // 目标完成情况（示例数据，可改为接口返回）
 const targetGoals = ref([
   { name: '师德思政', percent: 76 },
   { name: '学历', percent: 90 },
   { name: '教龄', percent: 65 },
   { name: '课时', percent: 58 },
   { name: '教学质量', percent: 88 },
   { name: '课程建设', percent: 70 },
   { name: '育人效果', percent: 74 },
   { name: '科研成果', percent: 41 },
   { name: '课题项目', percent: 55 },
   { name: '学术贡献', percent: 33 },
   { name: '社会服务', percent: 62 },
   { name: '荣誉奖励', percent: 48 }
 ])
 
 // 环形图 refs 与渲染
 const targetRefs = ref([])
 const targetCharts = []
 const targetColors = ['#7e7eff', '#34c759', '#ff9500', '#5856d6', '#5ac8fa', '#ff7eb9', '#00c2ff', '#a77bf3', '#00d4b3', '#ffcd3c', '#ff6b6b', '#4bc0c0']
 
 function setTargetRef(el, idx) {
   if (el) targetRefs.value[idx] = el
 }
 
 function shadeColor(hex, amount = 0.25) {
   const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
   if (!m) return hex
   const r = Math.min(255, Math.floor(parseInt(m[1], 16) + 255 * amount))
   const g = Math.min(255, Math.floor(parseInt(m[2], 16) + 255 * amount))
   const b = Math.min(255, Math.floor(parseInt(m[3], 16) + 255 * amount))
   const toHex = (v) => v.toString(16).padStart(2, '0')
   return `#${toHex(r)}${toHex(g)}${toHex(b)}`
 }
 
 function genRingOption(percent, baseColor) {
   return {
     series: [
       {
         type: 'gauge',
         startAngle: 90,
         endAngle: -270,
         min: 0,
         max: 100,
         progress: {
           show: true,
           width: 10,
           roundCap: true,
           itemStyle: {
             color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
               { offset: 0, color: baseColor },
               { offset: 1, color: shadeColor(baseColor, 0.15) }
             ]),
             shadowBlur: 10,
             shadowColor: `${baseColor}80`
           }
         },
         axisLine: {
           lineStyle: {
             width: 10,
             color: [[1, 'rgba(255,255,255,0.25)']]
           }
         },
         axisTick: { show: false },
         splitLine: { show: false },
         axisLabel: { show: false },
         pointer: { show: false },
         detail: {
           valueAnimation: true,
           formatter: '{value}%',
           color: '#1f2937',
           fontSize: 16,
           fontWeight: 600,
           offsetCenter: [0, '0%']
         },
         data: [{ value: Math.max(0, Math.min(100, Number(percent) || 0)) }]
       }
     ]
   }
 }
 
 function initTargetCharts() {
   disposeTargetCharts()
   targetRefs.value.forEach((el, idx) => {
     if (!el) return
     const chart = echarts.init(el)
     const color = targetColors[idx % targetColors.length]
     const val = targetGoals.value[idx]?.percent ?? 0
     chart.setOption(genRingOption(val, color))
     targetCharts.push(chart)
   })
 }
 
 function disposeTargetCharts() {
   while (targetCharts.length) {
     const c = targetCharts.pop()
     try { c?.dispose() } catch {}
   }
 }
 
 onBeforeUpdate(() => { targetRefs.value = [] })
 onBeforeUnmount(disposeTargetCharts)
 
 // 梯队分布
 const ladderChart = ref(null)
 let ladderChartInstance = null
 
 function rand(min, max) { return Math.round(Math.random() * (max - min) + min) }
 
 function initLadderChart() {
   if (!ladderChart.value) return
   if (ladderChartInstance) { try { ladderChartInstance.dispose() } catch {} }
   ladderChartInstance = echarts.init(ladderChart.value)
 
   const areas = [
     { name: '达标', x0: 0, x1: 1, color: 'rgba(145,163,255,0.18)' },
     { name: '上升', x0: 1, x1: 2, color: 'rgba(52,199,89,0.18)' },
     { name: '冲刺', x0: 2, x1: 3, color: 'rgba(255,149,0,0.18)' }
   ]
   const pad = 0.06
   const genPoints = (x0, x1, count, yMin, yMax) => Array.from({ length: count }, () => [
     +(Math.random() * (x1 - x0 - pad * 2) + x0 + pad).toFixed(3),
     rand(yMin, yMax)
   ])
 
   const dataStandard = genPoints(0, 1, 26, 15, 78)
   const dataRising = genPoints(1, 2, 26, 25, 95)
   const dataSprint = genPoints(2, 3, 26, 45, 100)
 
   const option = {
     grid: { left: 10, right: 10, top: 10, bottom: 20, containLabel: false },
     xAxis: {
       type: 'value', min: 0, max: 3, interval: 1,
       axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false }, splitLine: { show: false }
     },
     yAxis: {
       type: 'value', min: 0, max: 100,
       axisLine: { show: false }, axisTick: { show: false },
       splitLine: { lineStyle: { color: '#eef2ff' } }, axisLabel: { color: '#999' }
     },
     series: [
       {
         type: 'scatter', data: [],
         markArea: {
           silent: true,
           label: { show: true, color: '#666', fontWeight: 600, fontSize: 12 },
           itemStyle: { color: 'transparent' },
           data: areas.map(a => [
             { name: a.name, xAxis: a.x0, itemStyle: { color: a.color, borderColor: a.color } },
             { xAxis: a.x1 }
           ])
         }
       },
       { name: '达标', type: 'scatter', data: dataStandard, symbolSize: 8, itemStyle: { color: '#91a3ff' } },
       { name: '上升', type: 'scatter', data: dataRising, symbolSize: 8, itemStyle: { color: '#34c759' } },
       { name: '冲刺', type: 'scatter', data: dataSprint, symbolSize: 8, itemStyle: { color: '#ff9500' } }
     ],
     animationDuration: 500,
     animationEasing: 'cubicOut'
   }
   ladderChartInstance.setOption(option)
 }
 
 function disposeLadderChart() {
   if (ladderChartInstance) {
     try { ladderChartInstance.dispose() } catch {}
     ladderChartInstance = null
   }
 }

// 新增：图表初始化方法
function initDistributionChart() {
  if (!distributionChart.value) return
  if (distributionChartInstance) { try { distributionChartInstance.dispose() } catch {} }
  
  distributionChartInstance = echarts.init(distributionChart.value)
  const data = generateDistributionData(activeDistributionTab.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: { show: false },
    series: [
      {
        name: '教师分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: data,
        itemStyle: {
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#fff',
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c}人',
          fontSize: 12,
          color: '#333'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 30,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            transform: 'scale(1.1)'
          }
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200
        }
      }
    ]
  }
  
  distributionChartInstance.setOption(option)
}

function initAssessmentChart() {
  if (!assessmentChart.value) return
  if (assessmentChartInstance) { try { assessmentChartInstance.dispose() } catch {} }
  
  assessmentChartInstance = echarts.init(assessmentChart.value)
  const data = generateAssessmentData()
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '考核进度',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: data,
        itemStyle: {
          borderRadius: 6,
          borderWidth: 2,
          borderColor: '#fff',
          shadowBlur: 15,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 25,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        animationType: 'scale',
        animationEasing: 'backOut',
        animationDelay: function (idx) {
          return idx * 100
        }
      }
    ]
  }
  
  assessmentChartInstance.setOption(option)
}

function initTitleChart() {
  if (!titleChart.value) return
  if (titleChartInstance) { try { titleChartInstance.dispose() } catch {} }
  
  titleChartInstance = echarts.init(titleChart.value)
  const data = generateTitleData()
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const total = titleApplications.value
        const percentage = ((params.value / total) * 100).toFixed(1)
        return `<div style="padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${params.name}</div>
          <div style="color: #666;">人数: ${params.value}人</div>
          <div style="color: #666;">占比: ${percentage}%</div>
        </div>`
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 12, color: '#666' },
      itemGap: 20
    },
    series: [
      {
        name: '职称申报',
        type: 'doughnut',
        radius: ['45%', '75%'],
        center: ['50%', '45%'],
        data: data,
        itemStyle: {
          borderRadius: 6,
          borderWidth: 3,
          borderColor: '#fff',
          shadowBlur: 15,
          shadowColor: 'rgba(0, 0, 0, 0.15)'
        },
        label: {
          show: true,
          position: 'center',
          formatter: function() {
            const total = titleApplications.value
            const passed = Math.floor(total * titlePassRate.value / 100)
            return [
              `{total|申报总数}`,
              `{number|${total}人}`,
              `{rate|通过率 ${titlePassRate.value}%}`,
              `{passed|已通过 ${passed}人}`
            ].join('\n')
          },
          rich: {
            total: {
              fontSize: 14,
              color: '#666',
              fontWeight: 'normal'
            },
            number: {
              fontSize: 20,
              color: '#5856d6',
              fontWeight: 'bold',
              marginTop: 8
            },
            rate: {
              fontSize: 12,
              color: '#34c759',
              fontWeight: 'bold',
              marginTop: 4
            },
            passed: {
              fontSize: 12,
              color: '#666',
              marginTop: 4
            }
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 25,
            shadowColor: 'rgba(0, 0, 0, 0.25)',
            transform: 'scale(1.05)'
          }
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return idx * 150
        }
      }
    ]
  }
  
  titleChartInstance.setOption(option)
}

function initResearchChart() {
  if (!researchChart.value) return
  if (researchChartInstance) { try { researchChartInstance.dispose() } catch {} }
  
  researchChartInstance = echarts.init(researchChart.value)
  const data = generateResearchData()
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#666', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f2f5' } },
      axisLabel: { color: '#666' }
    },
    series: [
      {
        name: '科研数据',
        type: 'bar',
        data: data.map((item, idx) => ({
          value: item.value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: item.color },
              { offset: 1, color: item.color + '80' }
            ]),
            borderRadius: [4, 4, 0, 0],
            shadowBlur: 10,
            shadowColor: item.color + '40'
          }
        })),
        barWidth: '60%',
        animationDelay: function (idx) {
          return idx * 200
        },
        animationEasing: 'elasticOut'
      }
    ]
  }
  
  researchChartInstance.setOption(option)
}

function initQualityChart() {
  if (!qualityChart.value) return
  if (qualityChartInstance) { try { qualityChartInstance.dispose() } catch {} }
  
  qualityChartInstance = echarts.init(qualityChart.value)
  const data = generateQualityData()
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}'
    },
    radar: {
      indicator: data.map(item => ({ name: item.name, max: 100 })),
      radius: '65%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
        }
      },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: '#666' }
    },
    series: [
      {
        name: '教学质量',
        type: 'radar',
        data: [{
          value: data.map(item => item.value),
          name: '质量指数',
          itemStyle: {
            color: '#5856d6',
            shadowBlur: 20,
            shadowColor: 'rgba(88,86,214,0.3)'
          },
          areaStyle: {
            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
              { offset: 0, color: 'rgba(88,86,214,0.3)' },
              { offset: 1, color: 'rgba(88,86,214,0.1)' }
            ])
          },
          lineStyle: {
            width: 3,
            color: '#5856d6',
            shadowBlur: 10,
            shadowColor: 'rgba(88,86,214,0.5)'
          }
        }],
        animationDuration: 2000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  qualityChartInstance.setOption(option)
}

// 初始化所有新增图表
function initOverviewCharts() {
  nextTick(() => {
    initDistributionChart()
    initAssessmentChart()
    initTitleChart()
    initResearchChart()
    initQualityChart()
  })
}

// 销毁所有新增图表
function disposeOverviewCharts() {
  [distributionChartInstance, assessmentChartInstance, titleChartInstance, researchChartInstance, qualityChartInstance].forEach(chart => {
    if (chart) {
      try { chart.dispose() } catch {}
    }
  })
  distributionChartInstance = null
  assessmentChartInstance = null
  titleChartInstance = null
  researchChartInstance = null
  qualityChartInstance = null
}
 
 function formatDate(d) {
   const dt = d && d.value instanceof Date ? d.value : (d instanceof Date ? d : new Date(d))
   const m = dt.getMonth() + 1
   const day = dt.getDate()
   return `${m}/${day}`
 }
 
 onMounted(async () => {
  initEmploymentChart()
  // 加载服务端学期信息与课程进度（失败则使用本地默认）
  try {
    const meta = await getSemesterMeta()
    semesterWeeks.value = Number(meta.semesterWeeks) || semesterWeeks.value
    semesterStart.value = new Date(meta.semesterStart)
    semesterEnd.value = new Date(meta.semesterEnd)
  } catch {}
  try {
    const list = await getCourseProgress()
    if (Array.isArray(list)) {
      courseProgress.value = list.map(x => ({ name: String(x.name || ''), percent: Math.max(0, Math.min(100, Number(x.percent) || 0)) }))
    }
  } catch {}
  await nextTick()
  initTargetCharts()
  initLadderChart()
  initOverviewCharts() // 初始化所有新增图表
  startNotificationScroll() // 启动通知滚动
   
  // 监听窗口大小变化，重新渲染图表
  window.addEventListener('resize', handleResize)
 });
 
 onBeforeUnmount(() => { 
  disposeLadderChart()
  disposeOverviewCharts()
  stopNotificationScroll() // 停止通知滚动
  window.removeEventListener('resize', handleResize)
 })
 
 watch(targetGoals, async () => {
   await nextTick()
   initTargetCharts()
 }, { deep: true })
 
 // 新增：监听分布图表标签切换
 watch(activeDistributionTab, () => {
   nextTick(() => {
     initDistributionChart()
   })
 })
 
 // 通知滚动相关
let notificationScrollInterval = null
let currentNotificationIndex = 0

function startNotificationScroll() {
  if (notificationScrollInterval) return
  
  notificationScrollInterval = setInterval(() => {
    if (notificationScroll.value) {
      currentNotificationIndex = (currentNotificationIndex + 1) % notifications.value.length
      const scrollElement = notificationScroll.value
      const itemHeight = scrollElement.children[0]?.offsetHeight || 0
      scrollElement.style.transform = `translateY(-${currentNotificationIndex * itemHeight}px)`
    }
  }, 3000) // 每3秒切换一次
}

function stopNotificationScroll() {
  if (notificationScrollInterval) {
    clearInterval(notificationScrollInterval)
    notificationScrollInterval = null
  }
}

// 新增：监听窗口大小变化，重新渲染图表
function handleResize() {
  [distributionChartInstance, assessmentChartInstance, titleChartInstance, researchChartInstance, qualityChartInstance].forEach(chart => {
    if (chart) {
      try { chart.resize() } catch {}
    }
  })
}
 
 function initEmploymentChart() {
   const chart = echarts.init(employmentChart.value);
   const years = careerProgression.value.map(item => item.year)
   const scores = careerProgression.value.map(item => item.score)
   
   const option = {
     tooltip: {
       trigger: 'axis',
       formatter: (params) => {
         const item = params[0];
         const yearData = careerProgression.value[item.dataIndex]
         return `<strong>${item.name}年</strong><br/>分值: ${item.value}分<br/>职称: ${yearData.level} - ${yearData.title}`;
       }
     },
     xAxis: {
       type: 'category',
       data: years,
       axisLine: { show: false },
       axisTick: { show: false },
       axisLabel: { color: '#666', fontSize: 12 }
     },
     yAxis: {
       type: 'value',
       min: 0,
       max: 100,
       axisLabel: {
         formatter: '{value}分',
         color: '#666'
       },
       splitLine: {
         lineStyle: {
           color: '#e0e6f1'
         }
       }
     },
     grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
     series: [
       {
         name: '晋升趋势',
         type: 'line',
         smooth: true,
         data: scores,
         showSymbol: false,
         lineStyle: {
           color: '#34c759',
           width: 3
         },
         areaStyle: {
             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                 offset: 0,
                 color: 'rgba(52, 199, 89, 0.3)'
             }, {
                 offset: 1,
                 color: 'rgba(52, 199, 89, 0)'
             }])
         },
         markPoint: {
           data: [
             { 
               name: '当前',
               type: 'max',
               itemStyle: { color: '#34c759' },
               label: {
                 show: true,
                 position: 'top',
                 formatter: `当前分值${Math.max(...scores)}分;\n工作${workYears.value}年`,
                 backgroundColor: 'rgba(255, 255, 255, 0.9)',
                 padding: [8, 12],
                 borderRadius: 6,
                 color: '#333',
                 borderColor: '#e0e6f1',
                 borderWidth: 1
               }
             }
           ],
           symbol: 'circle',
           symbolSize: 10,
         }
       }
     ]
   };
   chart.setOption(option);
 }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

.light-dashboard-container {
  color: #333;
  padding: 10px 10px;
  font-family: 'Poppins', sans-serif;
  margin: auto;
  width: 100%;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
}

.dashboard-header-light p {
  font-size: 1rem;
  color: #3079ed;
  margin: 20px auto;
  text-align: center;
}



.semester-progress-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95));
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
  border: 1px solid rgba(255,255,255,0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.semester-progress-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #5856d6, #7e7eff, #34c759, #ff9500);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

.semester-progress-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
}

.semester-progress-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  text-align: center;
}

/* 通知条样式 */
.notification-bar {
  background: linear-gradient(135deg, rgba(88,86,214,0.1), rgba(126,126,255,0.1));
  /*border: 1px solid rgba(88,86,214,0.2);*/
  border-radius: 5px;
  padding: 6px 20px;
  margin: -15px 0px 16px 0px;
  display: flex;
  align-items: center;
  gap: 16px;
  /*box-shadow: 0 4px 15px rgba(88,86,214,0.1);*/
  backdrop-filter: blur(10px);
}

.notification-icon {
  font-size: 20px;
  color: #5856d6;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  overflow: hidden;
  height: 24px;
}

.notification-scroll {
  transition: transform 0.5s ease-in-out;
}

.notification-item {
  height: 24px;
  line-height: 24px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 学期进度独立行样式 */
.semester-progress-row {
  margin: 2px 0px 20px 0px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

/* 目标完成情况独立行样式 */
.targets-progress-row {
  margin: 32px 0px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

/* 梯队分布独立行样式 */
.ladder-progress-row {
  margin: 32px 0px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

/* 晋升趋势独立行样式 */
.trends-progress-row {
  margin: 32px 0px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(88,86,214,0.1);
}

.overview-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  background: linear-gradient(135deg, #5856d6, #7e7eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.overview-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #5856d6;
  text-shadow: 0 2px 8px rgba(88,86,214,0.3);
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.chart-card {
  background: rgba(255,255,255,0.9);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
  border: 1px solid rgba(255,255,255,0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.chart-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #5856d6, #7e7eff, #34c759, #ff9500);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

.chart-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
}

.chart-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  text-align: center;
}

.chart-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
}

.tab-btn {
  background: rgba(88,86,214,0.1);
  border: none;
  color: #666;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.tab-btn:hover {
  background: rgba(88,86,214,0.2);
  color: #5856d6;
}

.tab-btn.active {
  background: linear-gradient(135deg, #5856d6, #7e7eff);
  color: white;
  box-shadow: 0 4px 15px rgba(88,86,214,0.4);
  border-color: #5856d6;
}

.chart-container {
  width: 100%;
  height: 200px;
  margin-bottom: 16px;
}

.assessment-legend {
  display: flex;
  justify-content: space-around;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.legend-dot.completed { background: #34c759; }
.legend-dot.pending { background: #ff9500; }
.legend-dot.reviewing { background: #5856d6; }

.title-summary {
  display: flex;
  justify-content: space-around;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.summary-number {
  font-size: 24px;
  font-weight: 700;
  color: #5856d6;
}

.summary-label {
  font-size: 12px;
  color: #666;
}

.research-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.3);
}

.metric-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f2f5, #e4e7eb);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.metric-label {
  font-size: 12px;
  color: #666;
}

.quality-indicators {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.indicator-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.3);
}

.indicator-label {
  font-size: 14px;
  color: #666;
}

.indicator-value {
  font-size: 16px;
  font-weight: 600;
  color: #5856d6;
}

/* 动画效果 */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  50% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .overview-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .overview-stats {
    gap: 16px;
  }
  
  .notification-bar {
    margin: 16px 24px 12px 24px;
    padding: 12px 16px;
  }
  
  .notification-icon {
    font-size: 18px;
  }
  
  .notification-item {
    font-size: 13px;
  }
  
  .semester-progress-card {
    padding: 20px;
  }
  
  .semester-progress-card h3 {
    font-size: 16px;
  }
  
  .targets-progress-row,
  .ladder-progress-row,
  .trends-progress-row {
    margin: 16px 24px 24px 24px;
  }
  
  .targets-progress-card,
  .ladder-progress-card,
  .trends-progress-card {
    padding: 20px;
  }
  
  .targets-progress-card h3,
  .ladder-progress-card h3,
  .trends-progress-card h3 {
    font-size: 16px;
  }
  
  .chart-container {
    height: 220px !important;
  }
  
  .title-summary {
    gap: 12px;
  }
  
  .summary-item {
    min-width: 80px;
  }
  
  .score-details {
    gap: 12px;
  }
  
  .score-item {
    padding: 12px;
  }
  
  .teacher-avatar {
    width: 32px;
    height: 32px;
  }
  
  .teacher-name {
    font-size: 16px;
    max-width: 50px;
  }
}

.dashboard-main-grid-light {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto auto;
  gap: 24px;
  grid-template-areas:
    "quick quick quick"
    "semester semester score"
    "targets targets targets"
    "ladder ladder ladder"
    "trends trends trends";
  padding: 0 48px;
  flex: 1;
}

.card {
  background: #fff;
  border: 1px solid #e0e6f1;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
}

.quick-access {
  grid-area: quick;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.quick-section {
  background-color: #f7f8fa;
  border-radius: 10px;
  padding: 16px;
}

.quick-section h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.quick-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-item {
  background-color: #fff;
  border: 1px solid #e0e6f1;
  color: #333;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
}

.quick-item:hover {
  background-color: #5856d6;
  color: #fff;
  border-color: #5856d6;
}

.semester-progress { grid-area: semester; }
.timeline { display: flex; flex-direction: column; gap: 8px; }
.timeline-header { display: flex; justify-content: space-between; color: #333; }
.timeline-header .percent { font-weight: 600; color: #5856d6; }
.timeline-track { position: relative; height: 10px; background: #f0f2f5; border-radius: 6px; overflow: hidden; }
.timeline-fill { position: absolute; left: 0; top: 0; bottom: 0; background: linear-gradient(90deg, #5856d6, #7e7eff); border-radius: 6px; }
.timeline-ticks { position: absolute; left: 0; right: 0; top: 0; bottom: 0; }
.tick { position: absolute; top: -6px; width: 1px; height: 22px; background: #d9d9d9; }
.timeline-labels { display: flex; justify-content: space-between; font-size: 12px; color: #666; }

.courses { margin-top: 12px; display: flex; flex-direction: column; gap: 10px; }
.course-item { display: flex; align-items: center; gap: 12px; }
.course-name { width: 120px; color: #333; font-size: 14px; }
.course-progress { flex: 1; display: flex; align-items: center; gap: 10px; }
.course-bar { flex: 1; height: 10px; background: #f0f2f5; border-radius: 6px; overflow: hidden; }
.course-bar-inner { height: 100%; background: linear-gradient(90deg, #34c759, #5bd16e); border-radius: 6px; }
.course-percent { width: 40px; text-align: right; font-size: 12px; color: #666; }

.carousel {
  grid-area: carousel;
  padding: 0;
  border: none;
  box-shadow: none;
  background: transparent;
}

.slide-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
}

.slide-content {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 15px;
  border-radius: 8px;
}

.card h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.semester-score { grid-area: score; }
.score-content { display: flex; flex-direction: column; height: 100%; }
.score-main { background: linear-gradient(135deg, #8b5cf638, #fcfcfc); border-radius: 12px; padding: 20px; text-align: center; color: white; height: 150px; display: flex; flex-direction: column; justify-content: center; }
.score-label { font-size: 14px; color: #000; }
.score-value { font-size: 48px; font-weight: bold; line-height: 2; color: #5856d6; }
.score-details { display: flex; justify-content: space-between; margin-top: 20px; gap: 20px; }
.score-item { 
  background-color: #e2d9f738; 
  border-radius: 12px; 
  padding: 16px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  flex-grow: 1;
  transition: all 0.3s ease;
  flex-direction: column
}
.score-item:hover {
  background-color: #e2d9f750;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.score-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.score-label { font-size: 12px; color: #666; font-weight: 500; }
.score-number { font-size: 24px; font-weight: bold; color: #333; }
.teacher-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.teacher-avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  background: linear-gradient(135deg, #f0f2f5, #e4e7eb);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.teacher-name {
  font-size: 12px;
  color: #333;
  font-weight: 500;
  text-align: center;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.targets-overview { grid-area: targets; }
.targets-overview.glass {
  background: rgba(255,255,255,0.55);
  border: 1px solid rgba(255,255,255,0.35);
  box-shadow: 0 12px 30px rgba(88,86,214,0.08), inset 0 0 0 1px rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
}
.targets-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.targets-header .period { color: #666; font-size: 13px; }
.targets-grid.rings { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px 16px; }
.target-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.target-name { font-size: 13px; color: #333; text-align: center; }
.target-ring { width: 98px; height: 98px; }

.ladder-distribution { grid-area: ladder; }
.ladder-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.ladder-header .hint { color: #999; font-size: 12px; }
.ladder-legend { display: flex; gap: 14px; align-items: center; margin-top: 8px; color: #666; font-size: 12px; }
.ladder-legend .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }
.ladder-legend .cat-0 { background: #91a3ff; }
.ladder-legend .cat-1 { background: #34c759; }
.ladder-legend .cat-2 { background: #ff9500; }
.ladder-legend .me { margin-left: auto; color: #5856d6; font-weight: 600; }

.employment-trends {
  grid-area: trends;
}

.trends-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.title-selector {
    background-color: #f0f2f5;
    border-radius: 8px;
    display: flex;
    padding: 4px;
    flex-wrap: wrap;
    gap: 2px;
}

.title-btn {
    background-color: transparent;
    border: none;
    color: #666;
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.3s, color 0.3s;
    white-space: nowrap;
}

.title-btn.active {
    background-color: #5856d6;
    color: white;
    font-weight: bold;
}
</style> 