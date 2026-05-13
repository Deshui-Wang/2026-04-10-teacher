<template>
  <div class="student-portrait-container">
    <!-- 1. 学生列表页面 (List View) -->
    <div v-if="!selectedStudentId" class="student-list-view animate__animated animate__fadeIn">
      <div class="list-header">
        <h2 class="view-title">学生画像概览 <span>共 {{ studentsList.length }} 位学生</span></h2>
        <div class="list-filters">
          <el-radio-group v-model="filterSort" size="small">
            <el-radio-button label="score">按综合分数</el-radio-button>
            <el-radio-button label="match">按专业匹配度</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="student-list">
        <div 
          v-for="(student, index) in sortedStudents" 
          :key="student.id" 
          class="student-item-bar animate__animated animate__fadeInUp"
          :style="{ '--delay': index * 0.05 + 's' }"
          @click="viewDetail(student)"
        >
          <div class="item-left">
            <div class="avatar-wrapper">
              <img :src="student.avatar" :alt="student.name" class="avatar-circle" />
              <div class="status-indicator" :class="student.status"></div>
            </div>
            <div class="basic-info">
              <div class="name-row">
                <span class="student-name">{{ student.name }}</span>
                <span class="gender-tag" :class="student.gender">{{ student.gender === 'male' ? '♂' : '♀' }}</span>
              </div>
              <div class="sub-info">
                <span>{{ student.age }}岁</span>
                <span class="divider">|</span>
                <span>{{ student.major }}</span>
                <span class="divider">|</span>
                <span>{{ student.class }}</span>
              </div>
            </div>
          </div>

          <div class="item-center">
            <div class="dimension-dots">
              <div v-for="dim in student.dimensions" :key="dim.name" class="dim-dot-wrapper">
                <div 
                  class="dim-dot" 
                  :style="{ 
                    width: (Math.pow(dim.value / 100, 2.5) * 32 + 6) + 'px', 
                    height: (Math.pow(dim.value / 100, 2.5) * 32 + 6) + 'px',
                    background: dim.color 
                  }"
                ></div>
                <span class="dim-name">{{ dim.name }}</span>
              </div>
            </div>
          </div>

          <div class="item-right">
            <div class="score-box">
              <div class="score-label">综合分数</div>
              <div class="score-value" :style="{ color: getScoreColor(student.score) }">{{ student.score }}</div>
            </div>
            <div class="match-box">
              <div class="match-label">专业匹配度</div>
              <div class="match-badge" :style="{ background: getMatchColor(student.matchRate) }">
                {{ student.matchRate }}%
              </div>
            </div>
            <i class="el-icon-arrow-right arrow-icon"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 学生个体详情页面 (Detail View) -->
    <div v-else class="student-detail-view animate__animated animate__fadeIn">
      <div class="detail-header">
        <el-button icon="el-icon-back" circle @click="selectedStudentId = null"></el-button>
        <span class="back-text" @click="selectedStudentId = null">返回学生列表</span>
      </div>
      
      <div class="portrait-detail-content">
        <div class="header-main">
          <div class="title-wrap">
            <h2>{{ selectedStudent.name }} 个体画像分析</h2>
          </div>
        </div>

        <div class="student-info-card">
          <div class="student-info-header">
            <img :src="selectedStudent.avatar" class="avatar-large" />
            <div class="student-basic-info">
              <div class="student-name-row">
                <h3 class="student-name">{{ selectedStudent.name }}</h3>
                <span class="status-pill">在读</span>
              </div>
              <div class="student-meta-grid">
                <div class="meta-item"><span class="meta-label">学号</span><span class="meta-value">{{ selectedStudentId }}</span></div>
                <div class="meta-item"><span class="meta-label">专业</span><span class="meta-value">{{ selectedStudent.major }}</span></div>
                <div class="meta-item"><span class="meta-label">班级</span><span class="meta-value">{{ selectedStudent.class }}</span></div>
                <div class="meta-item"><span class="meta-label">综合得分</span><span class="meta-value">{{ selectedStudent.score }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-grid">
           <section class="card">
             <div class="card-head"><h3>学习表现趋势</h3></div>
             <div ref="personalTrendRef" class="echart-container"></div>
           </section>
           <section class="card">
             <div class="card-head"><h3>能力维度评估</h3></div>
             <div ref="abilityRadarRef" class="echart-container"></div>
           </section>
           <section class="card">
             <div class="card-head"><h3>专业契合度分析</h3></div>
             <div class="major-match-container">
                <div class="overview-score">
                  <div class="score-value" :style="{ color: getScoreColor(selectedStudent.matchRate) }">{{ selectedStudent.matchRate }}%</div>
                  <div class="score-label">匹配指数</div>
                </div>
                <p class="match-desc">该学生在{{ selectedStudent.major }}领域的专业契合度非常理想，各项核心指标均达到优秀水平，建议重点培养。</p>
             </div>
           </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 模拟学生列表数据
const studentsList = ref([
  { 
    id: '2021001', name: '林静宜', gender: 'female', age: 20, major: '人工智能', class: 'AI21-01', score: 94, matchRate: 98, avatar: '/pic/student01.png', status: 'online', 
    dimensions: [
      { name: '出勤', value: 98, color: '#3b82f6' },
      { name: '互动', value: 85, color: '#8b5cf6' },
      { name: '课后', value: 92, color: '#10b981' },
      { name: '学习力', value: 95, color: '#f59e0b' },
      { name: '课外', value: 45, color: '#6366f1' } // 故意拉低一项
    ],
    recentTrend: [60, 75, 70, 85, 90, 88, 92, 94]
  },
  { 
    id: '2021002', name: '周泽楷', gender: 'male', age: 21, major: '人工智能', class: 'AI21-01', score: 88, matchRate: 92, avatar: '/pic/student02.png', status: 'online',
    dimensions: [
      { name: '出勤', value: 100, color: '#3b82f6' },
      { name: '互动', value: 40, color: '#8b5cf6' }, // 显著低点
      { name: '课后', value: 50, color: '#10b981' }, // 显著低点
      { name: '学习力', value: 92, color: '#f59e0b' },
      { name: '课外', value: 98, color: '#6366f1' }
    ],
    recentTrend: [70, 72, 75, 80, 82, 85, 87, 88] 
  },
  { 
    id: '2021003', name: '苏沐橙', gender: 'female', age: 20, major: '计算机科学', class: 'CS21-03', score: 91, matchRate: 85, avatar: '/pic/student03.png', status: 'away',
    dimensions: [
      { name: '出勤', value: 100, color: '#3b82f6' },
      { name: '互动', value: 95, color: '#8b5cf6' },
      { name: '课后', value: 95, color: '#10b981' },
      { name: '学习力', value: 95, color: '#f59e0b' },
      { name: '课外', value: 95, color: '#6366f1' } // 全优典型
    ],
    recentTrend: [85, 86, 84, 88, 89, 90, 91, 91] 
  },
  { 
    id: '2021004', name: '黄少天', gender: 'male', age: 20, major: '软件工程', class: 'SE21-02', score: 76, matchRate: 72, avatar: '/pic/student04.png', status: 'online',
    dimensions: [
      { name: '出勤', value: 50, color: '#3b82f6' },
      { name: '互动', value: 98, color: '#8b5cf6' }, // 互动狂魔
      { name: '课后', value: 30, color: '#10b981' },
      { name: '学习力', value: 55, color: '#f59e0b' },
      { name: '课外', value: 92, color: '#6366f1' }
    ],
    recentTrend: [60, 65, 62, 68, 70, 72, 75, 76] 
  },
  { 
    id: '2021005', name: '喻文州', gender: 'male', age: 21, major: '数据科学', class: 'DS21-01', score: 85, matchRate: 95, avatar: '/pic/student05.png', status: 'offline',
    dimensions: [
      { name: '出勤', value: 98, color: '#3b82f6' },
      { name: '互动', value: 60, color: '#8b5cf6' },
      { name: '课后', value: 90, color: '#10b981' },
      { name: '学习力', value: 95, color: '#f59e0b' },
      { name: '课外', value: 40, color: '#6366f1' }
    ],
    recentTrend: [80, 81, 82, 83, 84, 85, 85, 85] 
  },
  { 
    id: '2021006', name: '叶修', gender: 'male', age: 22, major: '人工智能', class: 'AI21-01', score: 98, matchRate: 100, avatar: '/pic/student01.png', status: 'online',
    dimensions: [
      { name: '出勤', value: 100, color: '#3b82f6' },
      { name: '互动', value: 100, color: '#8b5cf6' },
      { name: '课后', value: 100, color: '#10b981' },
      { name: '学习力', value: 100, color: '#f59e0b' },
      { name: '课外', value: 100, color: '#6366f1' }
    ],
    recentTrend: [90, 92, 94, 96, 97, 98, 98, 98] 
  },
])

const filterSort = ref('score')
const selectedStudentId = ref(null)
const selectedStudent = ref(null)

const sortedStudents = computed(() => {
  return [...studentsList.value].sort((a, b) => {
    if (filterSort.value === 'score') return b.score - a.score
    return b.matchRate - a.matchRate
  })
})

const getScoreColor = (score) => {
  if (score >= 90) return '#10b981'
  if (score >= 80) return '#3b82f6'
  return '#f59e0b'
}

const getMatchColor = (rate) => {
  if (rate >= 90) return 'linear-gradient(90deg, #10b981, #34d399)'
  if (rate >= 80) return 'linear-gradient(90deg, #3b82f6, #60a5fa)'
  return 'linear-gradient(90deg, #f59e0b, #fbbf24)'
}

const viewDetail = (student) => {
  selectedStudent.value = student
  selectedStudentId.value = student.id
  nextTick(() => {
    initDetailCharts()
  })
}

// 详情页图表
const personalTrendRef = ref(null)
const abilityRadarRef = ref(null)
let trendChart = null
let radarChart = null

const initDetailCharts = () => {
  if (personalTrendRef.value) {
    if (trendChart) trendChart.dispose()
    trendChart = echarts.init(personalTrendRef.value)
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'], axisLine: { show: false } },
      yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
      series: [{
        data: selectedStudent.value.recentTrend,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 4, color: '#3b82f6' },
        itemStyle: { color: '#3b82f6', borderSize: 2, borderColor: '#fff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' }
          ])
        }
      }]
    })
  }

  if (abilityRadarRef.value) {
    if (radarChart) radarChart.dispose()
    radarChart = echarts.init(abilityRadarRef.value)
    radarChart.setOption({
      radar: {
        indicator: [
          { name: '理论知识', max: 100 },
          { name: '编程实践', max: 100 },
          { name: '创新能力', max: 100 },
          { name: '团队协作', max: 100 },
          { name: '学习态度', max: 100 }
        ],
        splitArea: { show: false },
        axisLine: { lineStyle: { color: '#e2e8f0' } }
      },
      series: [{
        type: 'radar',
        data: [{
          value: [95, 88, 92, 85, 90],
          name: '能力画像',
          areaStyle: { color: 'rgba(139, 92, 246, 0.2)' },
          lineStyle: { color: '#8b5cf6', width: 2 },
          itemStyle: { color: '#8b5cf6' }
        }]
      }]
    })
  }
}

onUnmounted(() => {
  trendChart?.dispose()
  radarChart?.dispose()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

.student-portrait-container {
  padding: 0;
}

/* 列表页样式 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.view-title {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.view-title span {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 400;
  margin-left: 12px;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.student-item-bar {
  background: white;
  border-radius: 20px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation-delay: var(--delay);
}

.student-item-bar:hover {
  transform: scale(1.01) translateX(5px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.08);
  border-color: #3b82f6;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 300px;
}

.avatar-wrapper {
  position: relative;
}

.avatar-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f8fafc;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online { background: #10b981; }
.status-indicator.away { background: #f59e0b; }
.status-indicator.offline { background: #94a3b8; }

.basic-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.student-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.gender-tag {
  font-size: 12px;
  margin-left: 8px;
}

.gender-tag.male { color: #3b82f6; }
.gender-tag.female { color: #ec4899; }

.sub-info {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.divider {
  opacity: 0.3;
}

.item-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40px;
}

.dimension-dots {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
}

.dim-dot-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 60px;
}

.dim-dot {
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.student-item-bar:hover .dim-dot {
  transform: scale(1.1);
}

.dim-name {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 40px;
  width: 280px;
  justify-content: flex-end;
}

.score-box, .match-box {
  text-align: right;
}

.score-label, .match-label {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.score-value {
  font-size: 24px;
  font-weight: 800;
}

.match-badge {
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}

.arrow-icon {
  color: #cbd5e1;
  font-size: 18px;
}

/* 详情页样式 */
.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.back-text {
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  font-weight: 500;
}

.back-text:hover {
  color: #3b82f6;
}

.student-info-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  display: flex;
  gap: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 24px;
  object-fit: cover;
}

.student-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-pill {
  font-size: 12px;
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 10px;
  border-radius: 20px;
}

.student-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 40px;
  margin-top: 16px;
  text-align: left;
}

.meta-label {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.meta-value {
  font-weight: 600;
  color: #1e293b;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.card-head h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
}

.echart-container {
  height: 280px;
}

.major-match-container {
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
}

.overview-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.score-value {
  font-size: 42px;
  font-weight: 800;
}

.match-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
}

.animate__animated {
  animation-delay: var(--delay, 0s);
}
</style>
