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

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onBeforeUnmount, onBeforeUpdate } from 'vue'
import * as echarts from 'echarts'
import { getCourseProgress } from '../../services/semester.service'

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
      indicator: data.map(item => ({ name: item.name, max: 3, nameTextStyle: { color: '#333' } })),
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
      indicator: data.map(item => ({ name: item.name, max: 3, nameTextStyle: { color: '#333' } })),
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
      indicator: data.map(item => ({ name: item.name, max: 3, nameTextStyle: { color: '#333' } })),
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
      indicator: data.map(item => ({ name: item.name, max: 3, nameTextStyle: { color: '#333' } })),
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

// 新增：监听窗口大小变化，重新渲染图表
function handleResize() {
  [aiChartInstance, teachingChartInstance, serviceChartInstance, researchChartInstance, qualityChartInstance].forEach(chart => {
    if (chart) {
      try { chart.resize() } catch {}
    }
  })
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
  
  await nextTick()
  initOverviewCharts() // 初始化所有新增图表
   
  // 监听窗口大小变化，重新渲染图表
  window.addEventListener('resize', handleResize)
});

onBeforeUnmount(() => { 
  disposeOverviewCharts()
  window.removeEventListener('resize', handleResize)
})
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
}
</style>
