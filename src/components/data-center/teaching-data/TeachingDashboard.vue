<template>
  <div class="premium-dashboard">
    <!-- 顶部欢迎语与日期 -->
    <div class="dashboard-header animate__animated animate__fadeInDown">
      <div class="header-left">
        <h2 class="welcome-text">教学质量看板 <span>Data Insights</span></h2>
        <p class="subtitle">实时监控您的教学成效，用数据驱动卓越教学</p>
      </div>
      <div class="header-right">
        <div class="date-chip">
          <i class="el-icon-date"></i>
          <span>{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- 1. 核心规模统计 - 玻璃拟态卡片 -->
    <el-row :gutter="24" class="stat-grid">
      <el-col :span="8" v-for="(stat, index) in topStats" :key="index">
        <div class="glass-card stat-item animate__animated animate__zoomIn" :style="{ '--delay': index * 0.1 + 's' }">
          <div class="stat-icon-wrapper" :style="{ background: stat.color }">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-main">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-number-row">
              <span class="count-up">{{ stat.value }}</span>
              <span class="unit">{{ stat.unit }}</span>
            </div>
            <div class="stat-footer">
              <span class="trend-text" :class="stat.trend > 0 ? 'up' : 'down'">
                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% 
                <i :class="stat.trend > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
              </span>
              <span class="comparison">较上月同期</span>
            </div>
          </div>
          <div class="card-glow" :style="{ background: stat.color }"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 2. 数据可视化核心区 -->
    <el-row :gutter="24" class="chart-section">
      <el-col :span="14">
        <div class="glass-card chart-container animate__animated animate__fadeInLeft">
          <div class="card-title">
            <i class="el-icon-data-line"></i> 综合教学质量模型
          </div>
          <div class="chart-content">
            <div ref="radarChartRef" class="echart-box"></div>
            <div class="chart-legend">
              <div class="legend-item" v-for="m in metrics" :key="m.name">
                <div class="l-dot" :style="{ background: m.color }"></div>
                <span class="l-name">{{ m.name }}</span>
                <span class="l-val">{{ m.value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="glass-card chart-container animate__animated animate__fadeInRight">
          <div class="card-title">
            <i class="el-icon-chat-dot-round"></i> 互动活跃度趋势
          </div>
          <div class="chart-content">
            <div ref="lineChartRef" class="echart-box"></div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 3. 精致课程卡片 -->
    <div class="section-divider animate__animated animate__fadeIn">
      <span>我的教学班级明细</span>
    </div>

    <el-row :gutter="24" class="course-grid">
      <el-col :span="8" v-for="(course, idx) in courses" :key="course.id">
        <div class="course-glass-card animate__animated animate__fadeInUp" :style="{ '--delay': (idx * 0.1 + 0.5) + 's' }">
          <div class="course-banner" :style="{ background: course.gradient }">
            <div class="course-type-tag">{{ course.type }}</div>
            <h3>{{ course.name }}</h3>
          </div>
          <div class="course-content">
            <div class="class-entry" v-for="cls in course.classes" :key="cls.name">
              <div class="cls-header">
                <span class="cls-name">{{ cls.name }}</span>
                <el-tag size="small" effect="plain" type="info">{{ cls.students }}人</el-tag>
              </div>
              <div class="gpa-bar-wrapper">
                <div class="gpa-text">
                  <span>班级 GPA</span>
                  <span class="gpa-val" :style="{ color: getGpaColor(cls.gpa) }">{{ cls.gpa }}</span>
                </div>
                <div class="gpa-track">
                  <div class="gpa-progress" :style="{ width: (cls.gpa / 4.5 * 100) + '%', background: getGpaColor(cls.gpa) }"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="course-actions">
            <el-button type="text">查看详情 <i class="el-icon-right"></i></el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const currentDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

const topStats = ref([
  { label: '课程总数', value: '12', unit: '门', icon: 'el-icon-notebook-1', color: 'rgba(59, 130, 246, 0.2)', trend: 8.5 },
  { label: '在教学生', value: '1,248', unit: '人', icon: 'el-icon-user', color: 'rgba(139, 92, 246, 0.2)', trend: 12.3 },
  { label: '平均出勤', value: '96.8', unit: '%', icon: 'el-icon-finished', color: 'rgba(16, 185, 129, 0.2)', trend: 2.1 }
])

const metrics = ref([
  { name: '作业完成', value: 92, color: '#3b82f6' },
  { name: '考试正确', value: 78, color: '#8b5cf6' },
  { name: '互动活跃', value: 85, color: '#10b981' },
  { name: '考勤覆盖', value: 98, color: '#f59e0b' }
])

const courses = ref([
  {
    id: 1,
    name: '人工智能概论',
    type: '专业必修',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    classes: [
      { name: 'AI23-01班', students: 45, gpa: 4.1 },
      { name: 'AI23-02班', students: 42, gpa: 3.8 }
    ]
  },
  {
    id: 2,
    name: '高级语言程序设计',
    type: '核心课',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    classes: [
      { name: '计算机24-01', students: 38, gpa: 3.9 },
      { name: '软件工程24-03', students: 35, gpa: 3.5 }
    ]
  },
  {
    id: 3,
    name: '数据挖掘与建模',
    type: '选修课',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    classes: [
      { name: '大数据23-01', students: 40, gpa: 4.0 },
      { name: '数学统计23-02', students: 32, gpa: 3.2 }
    ]
  }
])

const radarChartRef = ref(null)
const lineChartRef = ref(null)
let radarChart = null
let lineChart = null

const getGpaColor = (gpa) => {
  if (gpa >= 4.0) return '#10b981'
  if (gpa >= 3.6) return '#3b82f6'
  return '#f59e0b'
}

onMounted(() => {
  // 雷达图初始化
  radarChart = echarts.init(radarChartRef.value)
  radarChart.setOption({
    radar: {
      indicator: [
        { name: '作业完成', max: 100 },
        { name: '考试质量', max: 100 },
        { name: '互动频率', max: 100 },
        { name: '出勤水平', max: 100 },
        { name: '进步空间', max: 100 }
      ],
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      splitArea: { show: false }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [92, 78, 85, 98, 70],
        name: '教学质量',
        areaStyle: { color: 'rgba(59, 130, 246, 0.2)' },
        lineStyle: { color: '#3b82f6', width: 3 },
        itemStyle: { color: '#3b82f6' }
      }]
    }]
  })

  // 折线图初始化
  lineChart = echarts.init(lineChartRef.value)
  lineChart.setOption({
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true, top: '10%' },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: 'rgba(148, 163, 184, 0.1)' } },
      axisLabel: { color: '#94a3b8' }
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 4, color: '#8b5cf6' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
          { offset: 1, color: 'rgba(139, 92, 246, 0)' }
        ])
      }
    }]
  })

  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  radarChart?.resize()
  lineChart?.resize()
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  radarChart?.dispose()
  lineChart?.dispose()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

.premium-dashboard {
  color: #1e293b;
}

/* Header Section */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.welcome-text {
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

.welcome-text span {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 400;
  text-transform: uppercase;
  margin-left: 10px;
  letter-spacing: 2px;
}

.subtitle {
  color: #64748b;
  margin: 4px 0 0 0;
  font-size: 15px;
}

.date-chip {
  background: white;
  padding: 8px 16px;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-size: 14px;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Glass Card Components */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.glass-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

/* Stat Grid */
.stat-item {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  height: 140px;
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #3b82f6;
  flex-shrink: 0;
}

.stat-main {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.stat-number-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin: 2px 0;
}

.count-up {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
}

.unit {
  font-size: 14px;
  color: #94a3b8;
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.trend-text.up { color: #10b981; }
.trend-text.down { color: #ef4444; }
.comparison { color: #94a3b8; }

.card-glow {
  position: absolute;
  width: 100px;
  height: 100px;
  filter: blur(50px);
  opacity: 0.1;
  top: -20px;
  right: -20px;
  pointer-events: none;
}

/* Chart Section */
.chart-section {
  margin-top: 32px;
}

.chart-container {
  padding: 24px;
  height: 400px;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-content {
  display: flex;
  height: calc(100% - 40px);
}

.echart-box {
  flex: 1;
  height: 100%;
}

.chart-legend {
  width: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding-left: 20px;
}

.legend-item {
  display: flex;
  flex-direction: column;
}

.l-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: 4px;
}

.l-name {
  font-size: 12px;
  color: #94a3b8;
}

.l-val {
  font-size: 16px;
  font-weight: 700;
}

/* Section Divider */
.section-divider {
  margin: 48px 0 24px;
  text-align: center;
  position: relative;
}

.section-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  z-index: 0;
}

.section-divider span {
  background: #f8fafc;
  padding: 0 24px;
  position: relative;
  z-index: 1;
  font-size: 14px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Course Grid */
.course-glass-card {
  background: white;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  margin-bottom: 32px;
  transition: all 0.4s ease;
  border: 1px solid #f1f5f9;
}

.course-glass-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

.course-banner {
  padding: 32px 24px;
  color: white;
}

.course-banner h3 {
  margin: 8px 0 0 0;
  font-size: 22px;
  font-weight: 800;
}

.course-type-tag {
  font-size: 11px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
  display: inline-block;
  backdrop-filter: blur(4px);
}

.course-content {
  padding: 24px;
}

.class-entry {
  margin-bottom: 24px;
}

.class-entry:last-child {
  margin-bottom: 0;
}

.cls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.cls-name {
  font-weight: 700;
  color: #334155;
  font-size: 15px;
}

.gpa-bar-wrapper {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
}

.gpa-text {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}

.gpa-val {
  font-weight: 800;
}

.gpa-track {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.gpa-progress {
  height: 100%;
  border-radius: 3px;
  transition: width 1.5s ease-out;
}

.course-actions {
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  text-align: right;
}

.animate__animated {
  animation-delay: var(--delay, 0s);
}
</style>
