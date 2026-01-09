import ReportModulePreview from './report-components/ReportModulePreview.vue'

// 报告数据
const reportData = ref({
  name: '',
  type: '',
  modules: [],
  createdAt: ''
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

const getChartIcon = (chartType) => {
  const icons = {
    'bar': '📊',
    'line': '📈',
    'pie': '🥧',
    'doughnut': '🍩',
    'radar': '🕸️'
  }
  return icons[chartType] || '📊'
}

const handlePrint = () => {
  window.print()
}

const handleApply = () => {
  alert('已提交一键申报！')
}

const handleDownload = () => {
  alert('正在准备下载 PDF 文档...')
}

<template>
  <div class="archive-long-document">
    <!-- 辅助条：非打印时可见 -->
    <div class="no-print action-bar">
      <div class="container">
        <span class="doc-status">档案预览模式</span>
        <div class="btns">
          <button class="btn secondary" @click="handlePrint">🖨️ 打印档案</button>
          <button class="btn secondary" @click="handleDownload">📥 下载档案</button>
          <button class="btn primary" @click="handleApply">🚀 一键申报</button>
        </div>
      </div>
    </div>

    <div class="document-paper">
      <!-- 封面/标题 -->
      <header class="doc-header">
        <h1 class="doc-title">{{ reportData.name || '个人档案' }}</h1>
        <div class="doc-meta">
          <p>档案类型：{{ reportData.type || '未指定' }}</p>
          <p>生成日期：{{ formatDate(reportData.createdAt) }}</p>
        </div>
        <hr class="header-line" />
      </header>

      <!-- 目录 -->
      <nav class="doc-toc">
        <h3>目录</h3>
        <ul>
          <li v-for="(module, index) in reportData.modules" :key="'toc-'+index">
            <span class="toc-index">{{ index + 1 }}</span>
            <span class="toc-name">{{ module.name }}</span>
          </li>
        </ul>
      </nav>

      <!-- 文章正文 -->
      <main class="doc-body">
        <section v-for="(module, index) in reportData.modules" :key="module.id" class="module-block">
          <h2 class="module-title-doc">
            <span class="index-num">{{ index + 1 }}</span>
            {{ module.name }}
          </h2>
          
          <!-- 详细文字描述 -->
          <div class="module-summary-doc">
            <p v-for="(para, pIdx) in (module.summary || '').split('\n')" :key="pIdx" v-show="para.trim()">
              {{ para }}
            </p>
          </div>

          <!-- 培训特有信息 -->
          <div v-if="module.type && module.type.startsWith('training-')" class="training-info-doc">
            <div class="info-grid">
              <div class="info-item"><strong>培训学时：</strong>{{ module.trainingHours }}</div>
              <div class="info-item"><strong>考核结果：</strong>{{ module.trainingResult }}</div>
              <div v-if="module.trainingReport" class="info-item full"><strong>证明材料：</strong>{{ module.trainingReport }}</div>
            </div>
          </div>

          <!-- 图表展示 -->
          <div v-if="module.chartType && module.chartType !== 'none'" class="chart-box-doc">
            <div class="chart-container-doc">
               <ReportModulePreview
                  :module-type="module.type"
                  :chart-type="module.chartType"
                  :color-scheme="module.colorScheme"
                  :show-legend="module.showLegend"
                  :show-labels="module.showLabels"
                />
            </div>
            <p class="chart-caption">图表 {{ index + 1 }}-1: {{ module.name }}数据分析图</p>
          </div>
          
          <div class="page-break-hint"></div>
        </section>
      </main>

      <!-- 页脚 -->
      <footer class="doc-footer">
        <div class="footer-line"></div>
        <div class="footer-content">
          <p>© AI 教师档案智能化评估系统</p>
          <p>诚正 · 敏行 · 立德 · 树人</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ReportModulePreview from './report-components/ReportModulePreview.vue'

const reportData = ref({
  name: '',
  type: '',
  modules: [],
  createdAt: ''
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

onMounted(() => {
  const data = localStorage.getItem('previewReportData')
  if (data) {
    try {
      reportData.value = JSON.parse(data)
    } catch (e) {
      console.error('Failed to load archive data', e)
    }
  }
})

const handlePrint = () => {
  window.print()
}

const handleApply = () => {
  alert('已完成对接，档案正在提交至省教育厅申报系统...')
}
</script>

<style scoped>
.archive-long-document {
  background: #f0f2f5;
  min-height: 100vh;
  padding-bottom: 50px;
}

.action-bar {
  background: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.action-bar .container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.doc-status {
  font-size: 14px;
  color: #909399;
}

.btns {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn.primary {
  background: #409eff;
  color: #fff;
}

.btn.secondary {
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.document-paper {
  background: #fff;
  width: 210mm;
  min-height: 297mm;
  margin: 40px auto;
  padding: 30mm 25mm;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  color: #1a202c;
  line-height: 1.8;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "SimSun", serif;
  position: relative;
  transition: transform 0.3s ease;
  animation: paper-fade-in 0.8s ease-out;
}

@keyframes paper-fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.doc-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
}

.doc-title {
  font-size: 36px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 16px;
  letter-spacing: 4px;
}

.doc-meta {
  color: #718096;
  font-size: 15px;
  display: flex;
  justify-content: center;
  gap: 24px;
}

.header-line {
  border: none;
  border-top: 3px double #2d3748;
  margin-top: 24px;
  width: 100%;
}

.doc-toc {
  margin-bottom: 80px;
  padding: 40px;
  background: #fcfcfc;
  border: 1px dashed #e2e8f0;
}

.doc-toc h3 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
  color: #2d3748;
  letter-spacing: 10px;
}

.doc-toc ul {
  list-style: none;
  padding: 0;
}

.doc-toc li {
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
  color: #4a5568;
}

.toc-index {
  font-weight: 600;
  margin-right: 12px;
  min-width: 24px;
}

.toc-name {
  flex: 1;
  border-bottom: 1px dotted #cbd5e1;
  margin-right: 8px;
}

.doc-body {
  margin-bottom: 80px;
}

.module-block {
  margin-bottom: 60px;
  page-break-inside: avoid;
}

.module-title-doc {
  font-size: 22px;
  font-weight: 600;
  color: #1a202c;
  padding-bottom: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  border-left: 5px solid #2d3748;
  padding-left: 15px;
}

.index-num {
  font-size: 18px;
  color: #718096;
  margin-right: 10px;
  font-family: inherit;
}

.module-summary-doc {
  font-size: 17px;
  color: #2d3748;
  text-align: justify;
  line-height: 2;
}

.module-summary-doc p {
  text-indent: 2em;
  margin-bottom: 12px;
}

.training-info-doc {
  margin: 30px 0;
  padding: 24px;
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
  font-size: 15px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item strong {
  color: #475569;
  margin-right: 8px;
}

.info-item.full {
  grid-column: span 2;
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
  margin-top: 4px;
}

.chart-box-doc {
  margin: 40px 0;
  padding: 20px;
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
}

.chart-container-doc {
  height: 400px;
  margin-bottom: 16px;
}

.chart-caption {
  font-size: 14px;
  color: #94a3b8;
  font-style: italic;
  text-align: center;
}

.doc-footer {
  margin-top: 120px;
  text-align: center;
  color: #94a3b8;
}

.footer-line {
  border-top: 1px solid #e2e8f0;
  margin-bottom: 16px;
}

.footer-content {
  font-size: 13px;
  letter-spacing: 1px;
}

@media print {
  .no-print {
    display: none !important;
  }
  .archive-long-document {
    background: #fff;
    padding: 0;
  }
  .document-paper {
    box-shadow: none;
    margin: 0;
    width: 100%;
    padding: 20mm;
    transform: none !important;
    animation: none !important;
  }
}
</style>
