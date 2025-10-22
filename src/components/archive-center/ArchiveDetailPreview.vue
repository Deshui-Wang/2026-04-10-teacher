<template>
  <div class="archive-detail-preview-overlay" @click.self="closePreview">
    <div class="preview-container">
      <!-- 预览头部 -->
      <div class="preview-header">
        <div class="header-left">
          <h2 class="report-title">{{ reportData.name }}</h2>
          <div class="report-meta">
            <span class="meta-item">
              <span class="meta-icon">📅</span>
              创建时间：{{ reportData.createTime }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">📊</span>
              共 {{ reportData.modules.length }} 个模块
            </span>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn print-btn" @click="printReport">
            <span class="btn-icon">🖨️</span>
            打印
          </button>
          <button class="action-btn download-btn" @click="downloadReport">
            <span class="btn-icon">⬇️</span>
            下载
          </button>
          <button class="close-btn" @click="closePreview">×</button>
        </div>
      </div>

      <!-- 预览内容 -->
      <div class="preview-content">
        <!-- 报告模块列表 -->
        <div class="modules-section">
          <div 
            v-for="(module, index) in reportData.modules" 
            :key="index"
            class="module-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <!-- 模块头部 -->
            <div class="module-header">
              <div class="module-title-section">
                <span class="module-icon">{{ module.icon }}</span>
                <h3 class="module-title">{{ module.name }}</h3>
              </div>
              <div class="module-badge">模块 {{ index + 1 }}</div>
            </div>

            <!-- 模块内容 -->
            <div class="module-body">
              <!-- 模块图表 -->
              <div class="chart-section">
                <div class="chart-container">
                  <div class="chart-header">
                    <h4 class="chart-title">{{ module.chartTitle }}</h4>
                    <span class="chart-type-badge">{{ module.chartType }}</span>
                  </div>
                  <div class="chart-canvas">
                    <!-- 这里是图表占位符，可以集成真实的图表库 -->
                    <div class="chart-placeholder">
                      <div class="chart-visual">
                        <div 
                          v-for="(bar, barIndex) in module.chartData" 
                          :key="barIndex"
                          class="chart-bar"
                          :style="{ 
                            height: bar.value + '%',
                            backgroundColor: getChartColor(barIndex),
                            animationDelay: `${barIndex * 0.1}s`
                          }"
                        >
                          <div class="bar-label">{{ bar.label }}</div>
                          <div class="bar-value">{{ bar.value }}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 模块总结说明 -->
              <div class="summary-section">
                <div class="summary-header">
                  <span class="summary-icon">📝</span>
                  <h4 class="summary-title">模块总结</h4>
                </div>
                <div class="summary-content">
                  <p>{{ module.summary }}</p>
                  
                  <!-- 关键指标 -->
                  <div class="key-metrics">
                    <div 
                      v-for="(metric, metricIndex) in module.metrics" 
                      :key="metricIndex"
                      class="metric-item"
                    >
                      <div class="metric-label">{{ metric.label }}</div>
                      <div class="metric-value">{{ metric.value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 报告总体总结 -->
        <div class="overall-summary">
          <div class="overall-summary-header">
            <div class="summary-header-content">
              <span class="summary-header-icon">📋</span>
              <h3 class="summary-header-title">报告总体总结</h3>
            </div>
            <div class="summary-meta">
              <span class="meta-date">{{ reportData.createTime }}</span>
            </div>
          </div>
          
          <div class="overall-summary-content">
            <div class="summary-intro">
              <h4 class="intro-title">概述</h4>
              <p class="intro-text">{{ reportData.overallSummary.overview }}</p>
            </div>

            <div class="summary-highlights">
              <h4 class="highlights-title">关键亮点</h4>
              <ul class="highlights-list">
                <li 
                  v-for="(highlight, index) in reportData.overallSummary.highlights" 
                  :key="index"
                  class="highlight-item"
                >
                  <span class="highlight-icon">✓</span>
                  <span class="highlight-text">{{ highlight }}</span>
                </li>
              </ul>
            </div>

            <div class="summary-recommendations">
              <h4 class="recommendations-title">改进建议</h4>
              <ul class="recommendations-list">
                <li 
                  v-for="(recommendation, index) in reportData.overallSummary.recommendations" 
                  :key="index"
                  class="recommendation-item"
                >
                  <span class="recommendation-number">{{ index + 1 }}</span>
                  <span class="recommendation-text">{{ recommendation }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 预览底部 -->
      <div class="preview-footer">
        <div class="footer-info">
          <span>AI教师档案管理系统</span>
          <span class="separator">•</span>
          <span>报告生成时间：{{ new Date().toLocaleString('zh-CN') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  reportData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// 图表颜色方案
const chartColors = [
  '#3b82f6', // 蓝色
  '#10b981', // 绿色
  '#f59e0b', // 橙色
  '#ef4444', // 红色
  '#8b5cf6', // 紫色
  '#ec4899', // 粉色
]

const getChartColor = (index) => {
  return chartColors[index % chartColors.length]
}

const closePreview = () => {
  emit('close')
}

const printReport = () => {
  window.print()
}

const downloadReport = () => {
  // 下载功能实现
  console.log('下载报告:', props.reportData.name)
  // 这里可以添加实际的下载逻辑
  alert('报告下载功能开发中...')
}
</script>

<style scoped>
.archive-detail-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.preview-container {
  background: #f8fafc;
  border-radius: 20px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 预览头部 */
.preview-header {
  background: linear-gradient(135deg, #1976d2 0%, #1890ff 100%);
  color: white;
  padding: 28px 36px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-left {
  flex: 1;
}

.report-title {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.report-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: 0.95;
}

.meta-icon {
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 16px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 32px;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  line-height: 1;
  padding: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* 预览内容 */
.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

/* 模块列表 */
.modules-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.module-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: slideIn 0.5s ease forwards;
  opacity: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.module-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e2e8f0;
}

.module-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-icon {
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.module-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
}

.module-badge {
  padding: 6px 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.module-body {
  padding: 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}

/* 图表区域 */
.chart-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.chart-type-badge {
  padding: 4px 10px;
  background: white;
  border: 1px solid #cbd5e1;
  color: #64748b;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.chart-canvas {
  background: white;
  border-radius: 8px;
  padding: 24px;
  min-height: 260px;
  display: flex;
  align-items: flex-end;
  border: 1px solid #e2e8f0;
}

.chart-visual {
  width: 100%;
  height: 220px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 12px;
  position: relative;
}

.chart-bar {
  flex: 1;
  border-radius: 8px 8px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px 4px 8px;
  transition: all 0.3s ease;
  animation: growBar 0.8s ease forwards;
  transform-origin: bottom;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

@keyframes growBar {
  from {
    height: 0 !important;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.chart-bar:hover {
  transform: scale(1.05);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
}

.bar-value {
  color: white;
  font-weight: 700;
  font-size: 16px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.bar-label {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

/* 总结区域 */
.summary-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.summary-icon {
  font-size: 24px;
}

.summary-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.summary-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.summary-content p {
  margin: 0 0 20px 0;
  line-height: 1.8;
  color: #475569;
  font-size: 14px;
}

.key-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.metric-item {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.metric-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 500;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
}

/* 总体总结 */
.overall-summary {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.overall-summary-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-header-icon {
  font-size: 32px;
}

.summary-header-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.summary-meta {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.overall-summary-content {
  padding: 32px;
}

.summary-intro,
.summary-highlights,
.summary-recommendations {
  margin-bottom: 28px;
}

.summary-intro:last-child,
.summary-highlights:last-child,
.summary-recommendations:last-child {
  margin-bottom: 0;
}

.intro-title,
.highlights-title,
.recommendations-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.intro-text {
  margin: 0;
  line-height: 1.8;
  color: #475569;
  font-size: 15px;
  text-align: justify;
}

.highlights-list,
.recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.highlight-icon {
  font-size: 18px;
  color: #10b981;
  font-weight: 700;
  flex-shrink: 0;
}

.highlight-text {
  flex: 1;
  color: #064e3b;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.recommendation-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #f59e0b;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.recommendation-text {
  flex: 1;
  color: #78350f;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
}

/* 预览底部 */
.preview-footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 20px 36px;
  text-align: center;
}

.footer-info {
  color: #64748b;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.separator {
  opacity: 0.5;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .module-body {
    grid-template-columns: 1fr;
  }
  
  .key-metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .report-title {
    font-size: 22px;
  }
  
  .preview-content {
    padding: 20px;
  }
  
  .module-body {
    padding: 20px;
  }
  
  .overall-summary-content {
    padding: 24px;
  }
}

/* 打印样式 */
@media print {
  .archive-detail-preview-overlay {
    background: white;
    position: static;
  }
  
  .preview-container {
    box-shadow: none;
    max-height: none;
  }
  
  .preview-header {
    background: white;
    color: black;
    box-shadow: none;
  }
  
  .header-actions {
    display: none;
  }
  
  .module-card {
    page-break-inside: avoid;
  }
}
</style>

