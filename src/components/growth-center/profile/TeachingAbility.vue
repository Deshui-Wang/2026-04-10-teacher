<template>
  <div class="chart-card">
    <h3>基本教学能力 <span class="score-badge">{{ teachingScore }}</span></h3>
    <div class="teaching-content">
      <!-- 左侧雷达图 -->
      <div class="chart-section">
        <div ref="teachingChart" class="chart-container"></div>
      </div>
      
      <!-- 右侧指标描述 -->
      <div class="indicators-section">
        <div class="indicators-grid">
          <div v-for="(indicator, index) in teachingIndicators" :key="index" class="indicator-card">
            <div class="indicator-header">
              <div class="indicator-color" :style="{ backgroundColor: indicator.color }"></div>
              <span class="indicator-name">{{ indicator.name }}</span>
              <span class="indicator-score">{{ indicator.value }}分</span>
            </div>
            <div class="indicator-description">{{ indicator.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts'

// 图表 refs
const teachingChart = ref(null)

// 图表实例
let teachingChartInstance = null

// 基本教学能力分值（6-9.5分之间随机）
const teachingScore = ref((Math.random() * 3.5 + 6).toFixed(1))

// 图表数据生成函数
function generateTeachingData() {
  return [
    { name: '思政教学', value: 2.4, color: '#ff9ff3' },
    { name: '课堂实施', value: 2.1, color: '#54a0ff' },
    { name: '课后跟踪', value: 1.8, color: '#5f27cd' },
    { name: '教学经验发表', value: 1.9, color: '#00d2d3' },
    { name: '行业证书', value: 1.8, color: '#ff9f43' }
  ]
}

// 计算属性：生成指标描述数据
const teachingIndicators = computed(() => {
  const data = generateTeachingData()
  return data.map(item => ({
    ...item,
    description: getIndicatorDescription(item.name, item.value)
  }))
})

// 根据指标名称和分值生成描述
function getIndicatorDescription(name, value) {
  const descriptions = {
    '思政教学': value >= 2.2 ? 
      '在教学中能够有效融入思政元素，注重培养学生的价值观和道德品质，实现知识传授与价值引领的有机统一。' : 
      '需要加强思政教学能力建设，提升课程思政的设计和实施水平，更好地发挥育人功能。',
    '课堂实施': value >= 2.0 ? 
      '具备良好的课堂组织和管理能力，能够有效调动学生积极性，营造良好的学习氛围，确保教学效果。' : 
      '在课堂实施方面还有提升空间，建议加强教学技巧训练和课堂管理能力培养。',
    '课后跟踪': value >= 1.8 ? 
      '能够及时跟踪学生学习情况，提供个性化指导，建立有效的师生沟通机制，促进学习效果提升。' : 
      '需要建立更完善的课后跟踪机制，加强与学生的互动交流，提升教学反馈的及时性和有效性。',
    '教学经验发表': value >= 1.9 ? 
      '积极参与教学经验分享和学术交流，能够将教学实践转化为理论成果，推动教学改革和创新。' : 
      '建议多参与教学研讨活动，总结教学经验，通过发表论文或分享案例来提升教学影响力。',
    '行业证书': value >= 1.8 ? 
      '持有相关行业证书，具备扎实的专业技能和行业实践经验，能够将理论与实践相结合。' : 
      '建议考取相关行业证书，提升专业技能水平，增强实践教学能力和行业适应性。'
  }
  return descriptions[name] || '该指标需要进一步评估和改进。'
}

// 图表初始化方法
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

// 销毁图表
function disposeChart() {
  if (teachingChartInstance) {
    try { teachingChartInstance.dispose() } catch {}
    teachingChartInstance = null
  }
}

// 监听窗口大小变化，重新渲染图表
function handleResize() {
  if (teachingChartInstance) {
    try { teachingChartInstance.resize() } catch {}
  }
}

onMounted(() => {
  // 生成新的随机分值
  teachingScore.value = (Math.random() * 3.5 + 6).toFixed(1)
  initTeachingChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => { 
  disposeChart()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
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
}

.chart-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
}

.chart-card h3 {
  font-size: 20px;
  font-weight: 600;
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

/* 主要内容区域布局 */
.teaching-content {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

/* 左侧图表区域 */
.chart-section {
  flex: 0 0 350px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-container {
  width: 320px;
  height: 320px;
}

/* 右侧指标描述区域 */
.indicators-section {
  flex: 1;
  min-width: 0;
}

/* 指标网格布局 */
.indicators-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 100%;
}

/* 指标卡片样式 */
.indicator-card {
  background: linear-gradient(135deg, #fafafa, #f5f5f5);
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: fit-content;
}

.indicator-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--indicator-color, #ddd), transparent);
}

.indicator-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  border-color: #d0d0d0;
}

.indicator-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.indicator-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.indicator-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.indicator-score {
  font-size: 13px;
  font-weight: 700;
  color: #ff9500;
  background: linear-gradient(135deg, #ff9500, #ffb347);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

.indicator-description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  text-align: justify;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .teaching-content {
    gap: 24px;
  }
  
  .chart-section {
    flex: 0 0 300px;
  }
  
  .chart-container {
    width: 280px;
    height: 280px;
  }
}

@media (max-width: 1024px) {
  .teaching-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .chart-section {
    flex: none;
    width: 100%;
  }
  
  .chart-container {
    width: 100%;
    max-width: 350px;
    height: 300px;
    margin: 0 auto;
  }
  
  .indicators-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px !important;
  }
  
  .chart-card h3 {
    flex-direction: column;
    gap: 8px;
  }
  
  .score-badge {
    font-size: 12px;
    padding: 3px 10px;
  }
  
  .indicators-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .indicator-card {
    padding: 12px;
  }
  
  .indicator-description {
    font-size: 11px;
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 220px !important;
  }
  
  .indicator-header {
    gap: 8px;
  }
  
  .indicator-name {
    font-size: 12px;
  }
  
  .indicator-score {
    font-size: 12px;
  }
}
</style>
