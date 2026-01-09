<template>
  <div class="teacher-dashboard-container">
    <div class="teacher-dashboard">
      <!-- Left Column -->
      <div class="dashboard-column left-column">
        <!-- Student Stats Card -->
        <div class="info-card student-stats-card">
          <h4 class="card-title">学生统计</h4>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-label">学生好评率</span>
              <span class="stat-value">98%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">督导好评率</span>
              <span class="stat-value">95%</span>
            </div>
          </div>
          <div class="gender-distribution">
            <div class="gender-item">
              <div ref="ageChart" class="gender-chart"></div>
              <div class="gender-label">38岁</div>
            </div>
            <div class="gender-item">
              <div ref="experienceChart" class="gender-chart"></div>
              <div class="gender-label">教龄14年</div>
            </div>
          </div>
        </div>

        <!-- Class Distribution Card -->
        <div class="info-card class-distribution-card">
          <h4 class="card-title">教学产出</h4>
          <div class="distribution-summary">
            <div class="summary-item">
              <span class="summary-value">25 <span class="summary-unit">项</span></span>
              <span class="summary-label">科研成果</span>
            </div>
            <div class="summary-item">
              <span class="summary-value">58 <span class="summary-unit">个</span></span>
              <span class="summary-label">课件开发</span>
            </div>
          </div>
          <div ref="outputChart" class="distribution-chart"></div>
        </div>
      </div>

      <!-- Center Column -->
      <div class="dashboard-column center-column">
        <div class="teacher-portrait">
          <h2 class="teacher-name">张婉婷 老师</h2>
          <div class="teacher-info">
            <span>工号: 20230034</span>
            <span>职位: 讲师</span>
            <span>部门: 机电工程学院</span>
          </div>
          <div class="teacher-avatar-container">
            <img src="/pic/teacher/66.jpg" alt="李深 老师" class="teacher-avatar" />
            <div class="avatar-ring"></div>
          </div>
          <div class="identity-switch">
            <span class="identity-tag">普通教职工</span>
            <span class="identity-tag">心理辅导员</span>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="dashboard-column right-column">
        <!-- Awards Card -->
        <div class="info-card awards-card">
          <h4 class="card-title">获奖荣誉</h4>
          <div class="awards-summary">
            <div class="summary-highlight primary">
              <div class="highlight-label">优秀评比总数</div>
              <div class="highlight-value">12 <span class="summary-unit">次</span></div>
            </div>
            <div class="summary-highlight secondary">
              <div class="highlight-label">获奖最多班级</div>
              <div class="highlight-value">智造22_1</div>
            </div>
          </div>
          <div ref="awardsChart" class="awards-chart"></div>
        </div>

        <!-- Student Care Card -->
        <div class="info-card student-care-card">
          <h4 class="card-title">学生影响</h4>
          <div class="care-summary">
            <div class="care-item">
              <div class="care-value">96%</div>
              <div class="care-label">学生毕业率</div>
            </div>
            <div class="care-item">
              <div class="care-value">92%</div>
              <div class="care-label">学生就业率</div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

// Chart refs
const ageChart = ref(null);
const experienceChart = ref(null);
const outputChart = ref(null);
const awardsChart = ref(null);


// Chart instances
let ageChartInstance = null;
let experienceChartInstance = null;
let outputChartInstance = null;
let awardsChartInstance = null;


const initCharts = () => {
  // Age Chart
  if (ageChart.value) {
    ageChartInstance = echarts.init(ageChart.value);
    ageChartInstance.setOption({
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: { show: false },
          progress: { show: true, overlap: false, roundCap: true, clip: false, itemStyle: { color: '#FF69B4' } },
          axisLine: { lineStyle: { width: 10, color: [[1, '#E6EBF8']] } },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          data: [{ value: 52, name: '女性占比' }],
          title: { show: false },
          detail: { show: false },
        },
      ],
    });
  }

  // Experience Chart
  if (experienceChart.value) {
    experienceChartInstance = echarts.init(experienceChart.value);
    experienceChartInstance.setOption({
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: { show: false },
          progress: { show: true, overlap: false, roundCap: true, clip: false, itemStyle: { color: '#4169E1' } },
          axisLine: { lineStyle: { width: 10, color: [[1, '#E6EBF8']] } },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          data: [{ value: 48, name: '男性占比' }],
          title: { show: false },
          detail: { show: false },
        },
      ],
    });
  }

  // Output Chart
  if (outputChart.value) {
    outputChartInstance = echarts.init(outputChart.value);
    outputChartInstance.setOption({
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value', show: false },
      yAxis: { type: 'category', data: ['科研成果', '课件开发'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#666' } },
      series: [
        {
          name: '产出',
          type: 'bar',
          data: [25, 58],
          barWidth: 15,
          itemStyle: { color: '#3b82f6', borderRadius: 10 },
          label: { show: true, position: 'right', color: '#333' },
        },
      ],
    });
  }

  // Awards Chart
  if (awardsChart.value) {
    awardsChartInstance = echarts.init(awardsChart.value);
    awardsChartInstance.setOption({
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['国家奖金', '省级奖金', '校级奖金'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#999' } },
      yAxis: { type: 'value', show: false },
      series: [
        {
          name: '获奖级别',
          type: 'bar',
          data: [8, 12, 26],
          barWidth: 20,
          itemStyle: { color: '#8b5cf6', borderRadius: [10, 10, 0, 0] },
        },
      ],
    });
  }

  
};

const disposeCharts = () => {
  [ageChartInstance, experienceChartInstance, outputChartInstance, awardsChartInstance].forEach(chart => {
    if (chart) {
      try {
        chart.dispose();
      } catch (e) {
        console.error(e);
      }
    }
  });
};

const handleResize = () => {
  [ageChartInstance, experienceChartInstance, outputChartInstance, awardsChartInstance].forEach(chart => {
    if (chart) {
      try {
        chart.resize();
      } catch (e) {
        console.error(e);
      }
    }
  });
};

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  disposeCharts();
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.teacher-dashboard-container {
  padding: 24px;
  background-color: #EDF2FD;
}

.teacher-dashboard {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

.dashboard-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

/* Left Column */
.student-stats-card .stats-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.student-stats-card .stat-item {
  text-align: center;
}

.student-stats-card .stat-label {
  font-size: 14px;
  color: #666;
}

.student-stats-card .stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.gender-distribution {
  display: flex;
  justify-content: space-around;
}

.gender-item {
  text-align: center;
}

.gender-chart {
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
}

.gender-label {
  font-size: 14px;
  color: #333;
}

.class-distribution-card .distribution-summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.class-distribution-card .summary-item {
  text-align: center;
}

.class-distribution-card .summary-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.class-distribution-card .summary-unit {
  font-size: 14px;
  color: #666;
}

.class-distribution-card .summary-label {
  font-size: 14px;
  color: #666;
}

.distribution-chart {
  height: 120px;
}

/* Center Column */
.center-column {
  justify-content: center;
}

.teacher-portrait {
  text-align: center;
  position: relative;
}

.teacher-name {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
}

.teacher-info {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.teacher-info span {
  margin: 0 10px;
}

.teacher-avatar-container {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto 20px;
}

.teacher-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.avatar-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  border: 2px dashed #3b82f6;
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.identity-switch {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.identity-tag {
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  border-radius: 20px;
  background: #fff;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
}

/* Right Column */
.awards-card .awards-summary {
  display: flex;
  gap: 20px;
}

.awards-card .summary-highlight {
  flex: 1;
  padding: 15px;
  border-radius: 12px;
  color: #fff;
}

.awards-card .summary-highlight.primary {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.awards-card .summary-highlight.secondary {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.awards-card .highlight-label {
  font-size: 14px;
  margin-bottom: 5px;
}

.awards-card .highlight-value {
  font-size: 24px;
  font-weight: 700;
}

.awards-chart {
  height: 150px;
}

.student-care-card .care-summary {
  display: flex;
  justify-content: space-around;
}

.student-care-card .care-item {
  text-align: center;
}

.student-care-card .care-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.student-care-card .care-label {
  font-size: 14px;
  color: #666;
}

/* Radar Chart Section */
.radar-section {
  grid-column: 1 / -1;
}

.radar-chart {
  height: 400px;
}

@media (max-width: 1200px) {
  .teacher-dashboard {
    grid-template-columns: 1fr;
  }
}
</style>