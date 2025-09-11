<template>
  <div class="behavior-data-page">
    <div class="page-header">
      <h1 class="page-title">校内行为数据</h1>
      <p class="page-subtitle">学生校内活动、消费行为、社交网络等数据分析</p>
    </div>

    <!-- 数据概览卡片 -->
    <div class="overview-cards">
      <div class="overview-card" v-for="(item, index) in overviewData" :key="index">
        <div class="card-icon" :class="item.iconClass">{{ item.icon }}</div>
        <div class="card-content">
          <div class="card-value">{{ item.value }}</div>
          <div class="card-label">{{ item.label }}</div>
        </div>
        <div class="card-trend" :class="item.trend">
          {{ item.trend === 'up' ? '↑' : '↓' }} {{ item.percentage }}%
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-grid">
        <!-- 活动参与统计 -->
        <div class="content-card">
          <div class="card-header">
            <h3>活动参与统计</h3>
            <div class="card-actions">
              <button class="action-btn">导出</button>
              <button class="action-btn">刷新</button>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-placeholder">
              <div class="chart-icon">🎉</div>
              <p>校园活动参与度图表</p>
            </div>
          </div>
        </div>

        <!-- 消费行为分析 -->
        <div class="content-card">
          <div class="card-header">
            <h3>消费行为分析</h3>
            <div class="card-actions">
              <button class="action-btn">导出</button>
              <button class="action-btn">刷新</button>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-placeholder">
              <div class="chart-icon">💰</div>
              <p>消费模式分析图表</p>
            </div>
          </div>
        </div>

        <!-- 社交网络分析 -->
        <div class="content-card">
          <div class="card-header">
            <h3>社交网络分析</h3>
            <div class="card-actions">
              <button class="action-btn">导出</button>
              <button class="action-btn">刷新</button>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-placeholder">
              <div class="chart-icon">🌐</div>
              <p>社交关系网络图</p>
            </div>
          </div>
        </div>

        <!-- 行为轨迹分析 -->
        <div class="content-card">
          <div class="card-header">
            <h3>行为轨迹分析</h3>
            <div class="card-actions">
              <button class="action-btn">导出</button>
              <button class="action-btn">刷新</button>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-placeholder">
              <div class="chart-icon">📍</div>
              <p>活动轨迹热力图</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const overviewData = ref([
  {
    icon: '🎉',
    iconClass: 'icon-activities',
    value: '2,456',
    label: '活动参与次数',
    trend: 'up',
    percentage: 15
  },
  {
    icon: '💰',
    iconClass: 'icon-consumption',
    value: '1,234',
    label: '日均消费金额',
    trend: 'up',
    percentage: 8
  },
  {
    icon: '🌐',
    iconClass: 'icon-social',
    value: '156',
    label: '平均社交圈',
    trend: 'up',
    percentage: 12
  },
  {
    icon: '📍',
    iconClass: 'icon-location',
    value: '8.5',
    label: '活动场所数',
    trend: 'up',
    percentage: 6
  }
])
</script>

<style scoped>
.behavior-data-page {
  padding: 24px;
  min-height: calc(100vh - 200px);
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

/* 概览卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.icon-activities {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.icon-consumption {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

.icon-social {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
}

.icon-location {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
}

.card-label {
  font-size: 14px;
  color: #718096;
}

.card-trend {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.card-trend.up {
  background: #f0fff4;
  color: #38a169;
}

.card-trend.down {
  background: #fff5f5;
  color: #e53e3e;
}

/* 主要内容区域 */
.main-content {
  margin-top: 32px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7fafc;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #cbd5e0;
  background: white;
  color: #4a5568;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #edf2f7;
  border-color: #a0aec0;
}

.card-body {
  padding: 24px;
  min-height: 200px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #a0aec0;
  text-align: center;
}

.chart-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.chart-placeholder p {
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .behavior-data-page {
    padding: 16px;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style> 