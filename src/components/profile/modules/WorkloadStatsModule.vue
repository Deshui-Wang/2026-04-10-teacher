<template>
  <div class="workload-stats-module">
    <div class="module-header">
      <h3>工作量统计</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <div class="stat-value">120</div>
            <div class="stat-label">教学课时</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔬</div>
          <div class="stat-info">
            <div class="stat-value">8</div>
            <div class="stat-label">科研项目</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <div class="stat-value">45</div>
            <div class="stat-label">指导学生</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <div class="stat-value">12</div>
            <div class="stat-label">发表论文</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-container">
      <div class="chart-placeholder">
        <div class="chart-icon">📊</div>
        <p>工作量统计图表</p>
        <small>图表类型：{{ customSettings.chartType }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  moduleData: Object,
  customSettings: Object
})

defineEmits(['update-settings'])
</script>

<style scoped>
.workload-stats-module {
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.module-header {
  margin-bottom: 20px;
}

.module-header h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.stat-icon {
  font-size: 24px;
  margin-right: 12px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #8b5cf6;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.chart-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.chart-placeholder {
  text-align: center;
  color: #666;
}

.chart-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.chart-placeholder p {
  margin: 0 0 4px 0;
  font-weight: 500;
}

.chart-placeholder small {
  color: #999;
}
</style>
