<template>
  <div class="light-dashboard-container">

      <div class="overview-grid">
        <!-- 教师总数与分布 -->
        <div class="chart-card">
          <h3>AI智能胜任力 <span class="score-badge">{{ aiScore }}</span></h3>
          <div ref="aiChart" class="chart-container"></div>
          <div class="ai-indicators">
            <div class="indicator-item">
              <span class="indicator-label">工具使用</span>
              <span class="indicator-value">17</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">数据建模</span>
              <span class="indicator-value">5</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">智能工时</span>
              <span class="indicator-value">72%</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">教学应用</span>
              <span class="indicator-value">9</span>
            </div>
          </div>
        </div>

        <!-- 教学能力 -->
        <div class="chart-card">
          <h3>基本教学能力 <span class="score-badge">{{ teachingScore }}</span></h3>
          <div ref="teachingChart" class="chart-container"></div>
          <div class="teaching-indicators">
            <div class="indicator-item">
              <span class="indicator-label">专业核心值</span>
              <span class="indicator-value">6.4</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">课程总数</span>
              <span class="indicator-value">11</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">班级总数</span>
              <span class="indicator-value">7</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">学生总数</span>
              <span class="indicator-value">349</span>
            </div>
          </div>
        </div>

        <!-- 社会服务 -->
        <div class="chart-card">
          <h3>社会服务能力 <span class="score-badge">{{ serviceScore }}</span></h3>
          <div ref="serviceChart" class="chart-container"></div>
          <div class="service-indicators">
            <div class="indicator-item">
              <span class="indicator-label">企业培训</span>
              <span class="indicator-value">11</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">项目参与</span>
              <span class="indicator-value">7</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">案例开发</span>
              <span class="indicator-value">14</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">校招直送</span>
              <span class="indicator-value">218</span>
            </div>
          </div>
        </div>

        <!-- Care U 模块 -->
        <div class="chart-card">
          <h3>Care About You <span class="score-badge">{{ careUScore }}</span></h3>
                      <div class="care-u-dashboard">
              <div class="happy-image-container">
                <img src="/pic/sad.svg" alt="Happy" class="happy-image" />
                <div class="care-message">
                  今日工作量有点大，效率不高，容易产生负面情绪，请适当休息或调整工作方式
                </div>
              </div>
              <div class="care-u-metrics">
              <div class="metric-item">
                <div class="metric-content">
                  <span class="metric-value">11h</span>
                  <span class="metric-label">工作时长</span>
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-content">
                  <span class="metric-value">3h</span>
                  <span class="metric-label">连续工作</span>
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-content">
                  <span class="metric-value">4节</span>
                  <span class="metric-label">上课</span>
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-content">
                  <span class="metric-value">32879</span>
                  <span class="metric-label">文字录入</span>
                </div>
              </div>
            </div>
          </div>
        </div>



        <!-- 科研与成果 -->
        <div class="chart-card">
          <h3>科研成本消耗与成果奖励 <span class="score-badge">{{ researchScore }}</span></h3>
          <div ref="researchChart" class="chart-container"></div>
          <div class="research-metrics">
            <div class="metric-item">
              <div class="metric-content">
                <span class="metric-value">{{ researchProjects }}</span>
                <span class="metric-label">在研项目</span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-content">
                <span class="metric-value">{{ researchFunding }}万</span>
                <span class="metric-label">科研经费</span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-content">
                <span class="metric-value">{{ researchAwards }}</span>
                <span class="metric-label">成果奖励</span>
              </div>
              <div class="metric-content">
                <span class="metric-value">≈128万</span>
                <span class="metric-label">专利价值</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 教学质量指数 -->
        <div class="chart-card">
          <h3>综合教学质量 <span class="score-badge">{{ qualityScore }}</span></h3>
          <div ref="qualityChart" class="chart-container"></div>
          <div class="quality-indicators">
            <div class="indicator-item">
              <span class="indicator-label">平均评教</span>
              <span class="indicator-value">4.6</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">学生好评</span>
              <span class="indicator-value">{{ excellentTeacherRatio }}%</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">课程氛围</span>
              <span class="indicator-value">活跃</span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">课程达成</span>
              <span class="indicator-value">{{ courseAchievement }}%</span>
            </div>
          </div>
        </div>
      

      
      </div>

      <!-- 目标完成情况独立行 -->
      <div class="targets-progress-row">
        <div class="chart-card targets-progress-card">
          <div class="targets-header">
            <h3>年度目标完成</h3>
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
              <h3>历年晋升趋势</h3>
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
import { getCourseProgress } from '../services/semester.service'

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

// 三个模块的分值（6-9.5分之间随机）
const aiScore = ref((Math.random() * 3.5 + 6).toFixed(1))
const teachingScore = ref((Math.random() * 3.5 + 6).toFixed(1))
const serviceScore = ref((Math.random() * 3.5 + 6).toFixed(1))

// AI智能胜任力核心指标分值
const aiHumanCentered = ref((Math.random() * 1.5 + 1.5).toFixed(1))
const aiSocialResponsibility = ref((Math.random() * 1.5 + 1.5).toFixed(1))
const aiKnowledgeSkill = ref((Math.random() * 1.5 + 1.5).toFixed(1))

// 基本教学能力核心指标分值
const teachingIdeology = ref((Math.random() * 1.5 + 1.5).toFixed(1))
const teachingImplementation = ref((Math.random() * 1.5 + 1.5).toFixed(1))
const teachingFollowUp = ref((Math.random() * 1.5 + 1.5).toFixed(1))

// 社会服务能力核心指标分值
const serviceTraining = ref((Math.random() * 1.5 + 1.5).toFixed(1))
const serviceProject = ref((Math.random() * 1.5 + 1.5).toFixed(1))
const serviceCase = ref((Math.random() * 1.5 + 1.5).toFixed(1))

// 新增三个模块的分值
const careUScore = ref((Math.random() * 3.5 + 6).toFixed(1))
const researchScore = ref((Math.random() * 3.5 + 6).toFixed(1))
const qualityScore = ref((Math.random() * 3.5 + 6).toFixed(1))

const researchProjects = ref(89)
const researchFunding = ref(2340)
const researchAwards = ref(45)
const averageRating = ref(4.6)
const excellentTeacherRatio = ref(68)
const courseAchievement = ref(92)

// 分布图表相关
const aiChart = ref(null)
const teachingChart = ref(null)
const serviceChart = ref(null)

const researchChart = ref(null)
const qualityChart = ref(null)

// 图表实例
let aiChartInstance = null
let teachingChartInstance = null
let serviceChartInstance = null

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
function generateAIData() {
  return [
    { name: '以人为本', value: 2.1, color: '#ff6b6b' },
    { name: '社会责任', value: 1.9, color: '#4ecdc4' },
    { name: '知识与技能', value: 2.3, color: '#45b7d1' },
    { name: '教学与应用', value: 1.8, color: '#96ceb4' },
    { name: '职业能力', value: 1.9, color: '#feca57' },
    { name: '助力专业发展', value: 2.0, color: '#a8e6cf' }
  ]
}

function generateTeachingData() {
  return [
    { name: '思政教学', value: 2.4, color: '#ff9ff3' },
    { name: '课堂实施', value: 2.1, color: '#54a0ff' },
    { name: '课后跟踪', value: 1.8, color: '#5f27cd' },
    { name: '教学经验发表', value: 1.9, color: '#00d2d3' },
    { name: '行业证书', value: 1.8, color: '#ff9f43' }
  ]
}

function generateServiceData() {
  return [
    { name: '企业培训指导', value: 1.9, color: '#ff6b6b' },
    { name: '企业项目', value: 1.8, color: '#4ecdc4' },
    { name: '技能竞赛指导', value: 1.7, color: '#45b7d1' },
    { name: '企业人才培养', value: 1.6, color: '#96ceb4' },
    { name: '案例开发', value: 3.0, color: '#feca57' }
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
    { name: '学生出勤', value: 2.4, color: '#ff6b6b' },
    { name: '课堂互动', value: 2.1, color: '#4ecdc4' },
    { name: '考试通过', value: 2.3, color: '#45b7d1' },
    { name: '竞赛指导', value: 1.8, color: '#96ceb4' },
    { name: '其他教师评价', value: 1.9, color: '#feca57' },
    { name: '学生评价', value: 2.0, color: '#a8e6cf' }
  ]
}
 
 const quickSections = ref([
   { title: '教学经验', items: ['课程思政', '教学理念', '教学反思'] },
   { title: '教学活动', items: ['实践进修', '教学比赛', '学生指导', '公共服务', '专家讲座', '其他活动'] },
   { title: '成果奖励', items: ['论文案例', '荣誉称号', '指导学生获', '教学比赛获奖', '出版教材'] }
 ]);
 
 // 成长轨迹数据
const growthStages = [
  '起步期', '立足期', '发展期', '突破期', '成熟期', '引领期', '卓越期', '传承期'
]
const currentStageIndex = 3 // 突破期
const currentTitle = '高级讲师'
 
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
       { name: '冲刺', type: 'scatter', data: dataSprint, symbolSize: 8, itemStyle: { color: '#ff9500' } },
       { 
         name: '我', 
         type: 'scatter', 
         data: [[1.8, 80]], 
         symbolSize: 12, 
         symbol: 'star',
         itemStyle: { 
           color: '#5856d6',
           borderColor: '#fff',
           borderWidth: 2,
           shadowBlur: 10,
           shadowColor: 'rgba(88,86,214,0.5)'
         },
         label: {
           show: true,
           position: 'top',
           formatter: '我',
           color: '#5856d6',
           fontSize: 14,
           fontWeight: 'bold',
           backgroundColor: 'rgba(255,255,255,0.9)',
           padding: [4, 8],
           borderRadius: 4,
           borderColor: '#5856d6',
           borderWidth: 1
         }
       }
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
function initAIChart() {
  if (!aiChart.value) return
  if (aiChartInstance) { try { aiChartInstance.dispose() } catch {} }
  
  aiChartInstance = echarts.init(aiChart.value)
  const data = generateAIData()
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}分',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: { show: false },
    radar: {
      indicator: data.map(item => ({ name: item.name, max: 3 })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      splitLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      axisLabel: { 
        color: '#666',
        fontSize: 12,
        formatter: function(value) {
          // 根据指标名称长度进行换行处理
          if (value.length > 5) {
            return value.split('').join('\n');
          }
          return value;
        }
      }
    },
    series: [
      {
        name: 'AI智能胜任力',
        type: 'radar',
        data: [{
          value: data.map(item => item.value),
          name: '胜任力指数',
          itemStyle: {
            color: '#34c759',
            borderColor: '#34c759',
            borderWidth: 2
          },
          areaStyle: {
            color: 'rgba(52, 199, 89, 0.2)'
          },
          lineStyle: {
            width: 2,
            color: '#34c759'
          }
        }],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  aiChartInstance.setOption(option)
}

function initTeachingChart() {
  if (!teachingChart.value) return
  if (teachingChartInstance) { try { teachingChartInstance.dispose() } catch {} }
  
  teachingChartInstance = echarts.init(teachingChart.value)
  const data = generateTeachingData()
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}分',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: { show: false },
    radar: {
      indicator: data.map(item => ({ name: item.name, max: 3 })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      splitLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      axisLabel: { 
        color: '#666',
        fontSize: 12,
        formatter: function(value) {
          // 根据指标名称长度进行换行处理
          if (value.length > 5) {
            return value.split('').join('\n');
          }
          return value;
        }
      }
    },
    series: [
      {
        name: '基本教学能力',
        type: 'radar',
        data: [{
          value: data.map(item => item.value),
          name: '教学能力指数',
          itemStyle: {
            color: '#ff9500',
            borderColor: '#ff9500',
            borderWidth: 2
          },
          areaStyle: {
            color: 'rgba(255, 149, 0, 0.2)'
          },
          lineStyle: {
            width: 2,
            color: '#ff9500'
          }
        }],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  teachingChartInstance.setOption(option)
}

function initServiceChart() {
  if (!serviceChart.value) return
  if (serviceChartInstance) { try { serviceChartInstance.dispose() } catch {} }
  
  serviceChartInstance = echarts.init(serviceChart.value)
  const data = generateServiceData()
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}分',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: { show: false },
    radar: {
      indicator: data.map(item => ({ name: item.name, max: 3 })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      splitLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      axisLabel: { 
        color: '#666',
        fontSize: 12,
        formatter: function(value) {
          // 根据指标名称长度进行换行处理
          if (value.length > 5) {
            return value.split('').join('\n');
          }
          return value;
        }
      }
    },
    series: [
      {
        name: '社会服务能力',
        type: 'radar',
        data: [{
          value: data.map(item => item.value),
          name: '服务能力指数',
          itemStyle: {
            color: '#4ecdc4',
            borderColor: '#4ecdc4',
            borderWidth: 2
          },
          areaStyle: {
            color: 'rgba(78, 205, 196, 0.2)'
          },
          lineStyle: {
            width: 2,
            color: '#4ecdc4'
          }
        }],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  serviceChartInstance.setOption(option)
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
      formatter: '{a} <br/>{b}: {c}分',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: { show: false },
    radar: {
      indicator: data.map(item => ({ name: item.name, max: 3 })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      splitLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      axisLabel: { 
        color: '#666',
        fontSize: 12,
        formatter: function(value) {
          // 根据指标名称长度进行换行处理
          if (value.length > 5) {
            return value.split('').join('\n');
          }
          return value;
        }
      }
    },
    series: [
      {
        name: '综合教学质量',
        type: 'radar',
        data: [{
          value: data.map(item => item.value),
          name: '质量指数',
          itemStyle: {
            color: '#5856d6',
            borderColor: '#5856d6',
            borderWidth: 2
          },
          areaStyle: {
            color: 'rgba(88, 86, 214, 0.2)'
          },
          lineStyle: {
            width: 2,
            color: '#5856d6'
          }
        }],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  qualityChartInstance.setOption(option)
}

// 初始化所有新增图表
function initOverviewCharts() {
  nextTick(() => {
    initAIChart()
    initTeachingChart()
    initServiceChart()
  
    initResearchChart()
    initQualityChart()
  })
}

// 销毁所有新增图表
function disposeOverviewCharts() {
  [aiChartInstance, teachingChartInstance, serviceChartInstance, researchChartInstance, qualityChartInstance].forEach(chart => {
    if (chart) {
      try { chart.dispose() } catch {}
    }
  })
  aiChartInstance = null
  teachingChartInstance = null
  serviceChartInstance = null
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
  // 生成新的随机分值
  aiScore.value = (Math.random() * 3.5 + 6).toFixed(1)
  teachingScore.value = (Math.random() * 3.5 + 6).toFixed(1)
  serviceScore.value = (Math.random() * 3.5 + 6).toFixed(1)
  
  // 生成AI智能胜任力核心指标分值
  aiHumanCentered.value = (Math.random() * 1.5 + 1.5).toFixed(1)
  aiSocialResponsibility.value = (Math.random() * 1.5 + 1.5).toFixed(1)
  aiKnowledgeSkill.value = (Math.random() * 1.5 + 1.5).toFixed(1)
  
  // 生成基本教学能力核心指标分值
  teachingIdeology.value = (Math.random() * 1.5 + 1.5).toFixed(1)
  teachingImplementation.value = (Math.random() * 1.5 + 1.5).toFixed(1)
  teachingFollowUp.value = (Math.random() * 1.5 + 1.5).toFixed(1)
  
  // 生成社会服务能力核心指标分值
  serviceTraining.value = (Math.random() * 1.5 + 1.5).toFixed(1)
  serviceProject.value = (Math.random() * 1.5 + 1.5).toFixed(1)
  serviceCase.value = (Math.random() * 1.5 + 1.5).toFixed(1)
  
  // 生成新增三个模块的随机分值
  careUScore.value = (Math.random() * 3.5 + 6).toFixed(1)
  researchScore.value = (Math.random() * 3.5 + 6).toFixed(1)
  qualityScore.value = (Math.random() * 3.5 + 6).toFixed(1)
  
  initEmploymentChart()
  // 加载服务端课程进度（已移除学期进度）
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
  [aiChartInstance, teachingChartInstance, serviceChartInstance, researchChartInstance, qualityChartInstance].forEach(chart => {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.achievement-time {
  background: linear-gradient(135deg, #ff6b6b, #ff9ff3);
  -webkit-background-clip: text;
  -webkit-background-fill-color: transparent;
  background-clip: text;
  font-size: 14px;
  font-weight: 600;
  color: transparent;
}

/* 成长轨迹样式 */
.growth-timeline {
  margin: 24px 0 0 0;
  position: relative;
  height: 86px;
}
.growth-track {
  position: relative;
  height: 66px;
  background: #f0f2f5;
  border-radius: 6px;
}
.growth-fill {
  position: absolute;
  top: 19px;
  left: 0;
  height: 6px;
  background: linear-gradient(90deg, #5856d6, #34c759);
  border-radius: 6px;
  z-index: 1;
}
.growth-node {
  position: absolute;
  top: 13px;
  transform: translateX(-50%);
  text-align: center;
  z-index: 2;
}
.growth-node .node-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #d1d5db;
  margin: 0 auto 4px auto;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(88,86,214,0.08);
  transition: background 0.3s;
}
.growth-node.active .node-dot {
  background: #5856d6;
  border-color: #34c759;
  box-shadow: 0 0 0 4px #34c75933;
}
.growth-node.passed .node-dot {
  background: #34c759;
}
.growth-node .node-label {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  white-space: nowrap;
}
.growth-node.active .node-label {
  color: #5856d6;
  font-weight: 600;
}
.current-title {
  margin-top: 22px;
  font-size: 12px;
  color: #fff;
  background: #5856d6;
  border-radius: 3px;
  padding: 2px 10px;
  display: inline-block;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(88,86,214,0.08);
}

/* 成长线段样式 */
.growth-segment {
  position: absolute;
  top: 19px;
  height: 6px;
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  background-size: 100% 200%;
  border-radius: 6px;
  z-index: 1;
  animation: radiateGlow 3s ease-in-out infinite;
}

/* 成熟期到传承期的灰色线段样式 */
.growth-segment-gray {
  position: absolute;
  top: 19px;
  height: 6px;
  background: #d1d5db;
  border-radius: 6px;
  z-index: 1;
}

/* 成长缓慢气泡样式 */
.growth-bubble {
  position: absolute;
  top: -20px;
  transform: translateX(-50%);
  background: #fff;
  color: #ff6b6b;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  animation: bubbleFloat 3s ease-in-out infinite;
}

.growth-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #fff;
}

@keyframes radiateGlow {
  0% {
    background-position: 0% 50%;
    transform: scaleY(1);
  }
  25% {
    background-position: 50% 50%;
    transform: scaleY(1.2);
  }
  50% {
    background-position: 100% 50%;
    transform: scaleY(1.2);
  }
  75% {
    background-position: 150% 50%;
    transform: scaleY(1.2);
  }
  100% {
    background-position: 200% 50%;
    transform: scaleY(1);
  }
}

@keyframes bubbleFloat {
  0%, 100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-3px);
  }
}

/* 新增：全校教师发展与考核关键数据可视化图表样式 */
.dashboard-overview-charts {
  margin: 3px 4px;
  background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.95));
  border-radius: 20px;
  /*padding: 32px;
  /*box-shadow: 0 20px 40px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.3);*/
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
  margin: 2px 0px 24px 0px;
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
  font-weight: 500;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.score-badge {
  background: linear-gradient(135deg, #ff6b6b, #ff9ff3);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  /*border: 1px solid rgba(255, 255, 255, 0.8);*/
  animation: scoreGlow 2s ease-in-out infinite alternate;
}

@keyframes scoreGlow {
  from {
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
    transform: scale(1);
  }
  to {
    box-shadow: 0 4px 16px rgba(255, 107, 107, 0.5);
    transform: scale(1.05);
  }
}



.chart-container {
  width: 100%;
  height: 280px;
  margin-bottom: 16px;
}

/* Care U 模块样式 */
.care-u-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.happy-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
}

.happy-image {
  width: 190px;
  height: 190px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.happy-image:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 35px rgba(255, 107, 107, 0.3);
}

.care-message {
  text-align: center;
  color: #8f908f;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 16px;
  padding: 12px 16px;
  background: rgb(238, 239, 238);
  border-radius: 12px;
  border: 1px solid rgb(238, 240, 239);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.happy-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.star {
  font-size: 20px;
  animation: starTwinkle 2s ease-in-out infinite;
}

.mood-text {
  background: linear-gradient(135deg, #ff6b6b, #ff9ff3, #48dbfb);
  -webkit-background-clip: text;
  -webkit-background-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.care-u-metrics {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  gap: 16px;
}

.care-u-metrics .metric-item {
  flex: 1;
  text-align: center;
  padding: 12px 8px;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.3);
}

.care-u-metrics .metric-content {
  display: flex;
  flex-direction: column-reverse;
  gap: 4px;
}

.care-u-metrics .metric-value {
  font-size: 16px;
  font-weight: 700;
  color: #5856d6;
}

.care-u-metrics .metric-label {
  font-size: 12px;
  color: #666;
}

@keyframes starTwinkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
}





.research-metrics {
  display: flex;
  flex-direction: row;
  justify-content: center;
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
  flex-direction: column-reverse;
  gap: 4px;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #5856d6;
}

.metric-label {
  font-size: 12px;
  color: #666;
}

.quality-indicators,
.ai-indicators,
.teaching-indicators,
.service-indicators {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 3px;
  margin-top: 16px;
}

.indicator-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.3);
  gap: 4px;
}

.indicator-label {
  font-size: 12px;
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
  
  .dashboard-overview-charts {
    margin: 24px 24px;
    padding: 24px;
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
  
  .semester-progress-row {
    margin: 16px 24px 24px 24px;
  }
  
  .semester-progress-card {
    padding: 20px;
  }
  
  .semester-progress-card h3 {
    font-size: 16px;
    flex-direction: column;
    gap: 8px;
  }
  
  .achievement-time {
    font-size: 12px;
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
  
  .chart-card h3 {
    flex-direction: column;
    gap: 8px;
  }
  
  .score-badge {
    font-size: 12px;
    padding: 3px 10px;
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
    "semester semester semester"
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