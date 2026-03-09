<template>
  <div class="ai-analysis-page">
    <div class="intro-section">
      <div class="intro-header">
        <el-icon :size="28" color="#1677ff"><DataAnalysis /></el-icon>
        <h2>AI数据分析</h2>
      </div>
      <p class="intro-desc">实时分析教学动态、课堂活跃度和学习效果，为教师提供数据支持以优化教学活动，帮助教师了解学生参与度和知识掌握情况，及时进行总结反思从而优化教学策略并提升课程教育质量。</p>
    </div>
    
    
    <!-- AI数据分析仪表盘 -->
    <div class="dashboard-grid">
      <!-- 核心指标卡片 -->
      <div class="kpi-cards">
        <div class="kpi-card" v-for="(kpi, index) in kpiData" :key="index">
          <div class="kpi-icon" :style="{ background: kpi.bgColor, color: kpi.color }">
            <el-icon><component :is="kpi.icon" /></el-icon>
          </div>
          <div class="kpi-info">
            <div class="kpi-title">{{ kpi.title }}</div>
            <div class="kpi-value">
              {{ kpi.value }}
              <span class="kpi-unit" v-if="kpi.unit">{{ kpi.unit }}</span>
            </div>
            <div class="kpi-trend" :class="kpi.trend >= 0 ? 'up' : 'down'">
              <el-icon><Top v-if="kpi.trend >= 0" /><Bottom v-else /></el-icon>
              {{ Math.abs(kpi.trend) }}%
              <span class="trend-text">较上周</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-container">
        <!-- 教学动态与活跃度折线图 -->
        <div class="chart-card wide">
          <div class="chart-header">
            <h3>课堂活跃度趋势预测模型</h3>
            <el-tag size="small" type="success" effect="light">AI 预测引擎</el-tag>
          </div>
          <div class="chart-body">
            <v-chart class="chart" :option="activityChartOption" autoresize />
          </div>
        </div>

        <!-- 学习效果掌握情况饼图 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>知识点掌握情况分布</h3>
          </div>
          <div class="chart-body">
            <v-chart class="chart" :option="masteryChartOption" autoresize />
          </div>
        </div>

        <!-- 参与度分析雷达/柱状图 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>班级学情综合画像</h3>
          </div>
          <div class="chart-body">
            <v-chart class="chart" :option="participationChartOption" autoresize />
          </div>
        </div>

        <!-- AI智能诊断建议 -->
        <div class="chart-card wide">
          <div class="chart-header">
            <h3>AI智能教学策略建议</h3>
            <el-button type="primary" link>生成新报告</el-button>
          </div>
          <div class="advise-list">
            <div class="advise-item warning">
              <div class="advise-icon"><el-icon><WarningFilled /></el-icon></div>
              <div class="advise-content">
                <h4>预警：《数据结构》三班出勤率出现下降趋势</h4>
                <p>系统检测到该班级近两周出勤率从 95% 降至 86%，建议在下次课前通过系统发送提醒，或增加课堂互动环节以提升参与意愿。</p>
              </div>
            </div>
            <div class="advise-item success">
              <div class="advise-icon"><el-icon><SuccessFilled /></el-icon></div>
              <div class="advise-content">
                <h4>总结：微积分阶段测试表现优异</h4>
                <p>AI分析显示，在引入“图形化案例”教学后，学生对于“多重积分”考点的正确率提升了 22%。建议将此教学方法推广至其他理科班级。</p>
              </div>
            </div>
            <div class="advise-item info">
              <div class="advise-icon"><el-icon><InfoFilled /></el-icon></div>
              <div class="advise-content">
                <h4>洞察：晚间作业提交高峰时间偏移</h4>
                <p>经过统计，学生上交作业的高峰期从原本的 20:00 延后到了 22:30，表明近期课外负担可能加重。系统建议适度下调下周课后习题量。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DataAnalysis, DataLine, UserFilled, TrendCharts, CircleCheckFilled, Top, Bottom, WarningFilled, SuccessFilled, InfoFilled } from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart, RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
])

// KPI 数据
const kpiData = ref([
  {
    title: '教学健康度指数',
    value: '92.5',
    icon: 'DataLine',
    trend: 3.2,
    bgColor: '#f0f5ff',
    color: '#1677ff'
  },
  {
    title: '课堂活跃度均分',
    value: '8.4',
    unit: '/ 10',
    icon: 'TrendCharts',
    trend: 1.5,
    bgColor: '#f6ffed',
    color: '#52c41a'
  },
  {
    title: '知识点掌握率',
    value: '88.6',
    unit: '%',
    icon: 'CircleCheckFilled',
    trend: -0.8,
    bgColor: '#fff0f6',
    color: '#eb2f96'
  },
  {
    title: '高潜关注学生',
    value: '12',
    unit: '人',
    icon: 'UserFilled',
    trend: -15.0,
    bgColor: '#fff1f0',
    color: '#f5222d'
  }
])

// 活跃度折线图配置
const activityChartOption = computed(() => {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['历史实际活跃度', 'AI预测活跃度'], top: 0 },
    grid: { left: '3%', right: '4%', bottom: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '下周一', '下周二', '下周三']
    },
    yAxis: { type: 'value', max: 100 },
    series: [
      {
        name: '历史实际活跃度',
        type: 'line',
        data: [72, 85, 91, 88, 76, 65, 50, null, null, null],
        smooth: true,
        itemStyle: { color: '#1677ff' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(22,119,255,0.3)' }, { offset: 1, color: 'rgba(22,119,255,0.05)' }]
          }
        }
      },
      {
        name: 'AI预测活跃度',
        type: 'line',
        data: [null, null, null, null, null, null, 50, 78, 86, 92],
        smooth: true,
        lineStyle: { type: 'dashed' },
        itemStyle: { color: '#52c41a' }
      }
    ]
  }
})

// 掌握情况饼图配置
const masteryChartOption = computed(() => {
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}人 ({d}%)' },
    legend: { orient: 'vertical', left: 'left', top: 'middle' },
    series: [
      {
        name: '掌握情况',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['65%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        data: [
          { value: 125, name: '完全掌握', itemStyle: { color: '#52c41a' } },
          { value: 85, name: '基本理解', itemStyle: { color: '#1677ff' } },
          { value: 32, name: '部分遗漏', itemStyle: { color: '#faad14' } },
          { value: 16, name: '挂科风险', itemStyle: { color: '#ff4d4f' } }
        ]
      }
    ]
  }
})

// 班级雷达图配置
const participationChartOption = computed(() => {
  return {
    tooltip: {},
    legend: {
      data: ['尖子班', '普通班'],
      bottom: 0
    },
    radar: {
      indicator: [
        { name: '作业完成', max: 100 },
        { name: '出勤状况', max: 100 },
        { name: '课堂发言', max: 100 },
        { name: '考试成绩', max: 100 },
        { name: '实践操作', max: 100 }
      ],
      radius: '65%'
    },
    series: [{
      name: '班级能力画像',
      type: 'radar',
      data: [
        {
          value: [95, 98, 85, 92, 88],
          name: '尖子班',
          itemStyle: { color: '#1677ff' },
          areaStyle: { color: 'rgba(22,119,255,0.2)' }
        },
        {
          value: [80, 85, 60, 75, 78],
          name: '普通班',
          itemStyle: { color: '#722ed1' },
          areaStyle: { color: 'rgba(114,46,209,0.2)' }
        }
      ]
    }]
  }
})
</script>

<style scoped>
.ai-analysis-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.intro-section {
  display: flex;
  flex-direction: column;
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.intro-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.intro-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
  font-weight: 600;
}

.intro-desc {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  text-align: left;
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.kpi-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.kpi-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.kpi-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.kpi-title {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 12px;
}

.kpi-unit {
  font-size: 14px;
  font-weight: normal;
  color: #6b7280;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}

.kpi-trend.up { color: #f5222d; }
.kpi-trend.down { color: #52c41a; }

.trend-text {
  color: #9ca3af;
  font-weight: normal;
  margin-left: 4px;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.chart-card.wide {
  grid-column: span 2;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.chart-body {
  flex: 1;
  min-height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}

.advise-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.advise-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #f9fafb;
  border-left: 4px solid transparent;
}

.advise-item.warning {
  background: #fffbe6;
  border-left-color: #faad14;
}
.advise-item.warning .advise-icon { color: #faad14; }

.advise-item.success {
  background: #f6ffed;
  border-left-color: #52c41a;
}
.advise-item.success .advise-icon { color: #52c41a; }

.advise-item.info {
  background: #e6f4ff;
  border-left-color: #1677ff;
}
.advise-item.info .advise-icon { color: #1677ff; }

.advise-icon {
  font-size: 24px;
  padding-top: 2px;
}

.advise-content h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #1f2937;
}

.advise-content p {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .charts-container, .kpi-cards {
    grid-template-columns: 1fr;
  }
  .chart-card.wide {
    grid-column: span 1;
  }
}
</style>
