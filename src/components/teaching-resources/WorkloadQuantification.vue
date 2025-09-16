<template>
  <div class="workload-quantification">
    <h3 class="module-title">本周平均工作量：8.9（💛偏大，注意调整）</h3>
    <!-- 页面标题 -->
    <div class="page-header">
    </div>

    <!-- 筛选行 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>课程：</label>
          <el-select 
            v-model="selectedCourse" 
            placeholder="全部课程" 
            clearable 
            @change="handleFilterChange"
            class="course-select"
          >
            <el-option label="全部课程" value="" />
            <el-option v-for="course in courseOptions" :key="course.value" :label="course.label" :value="course.value" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>类型：</label>
          <el-select 
            v-model="selectedType" 
            placeholder="全部类型" 
            clearable 
            @change="handleFilterChange"
            class="type-select"
          >
            <el-option label="全部类型" value="" />
            <el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>学期：</label>
          <el-select 
            v-model="selectedSemester" 
            placeholder="全部学期" 
            clearable 
            @change="handleFilterChange"
            class="semester-select"
          >
            <el-option label="全部学期" value="" />
            <el-option v-for="semester in semesterOptions" :key="semester.value" :label="semester.label" :value="semester.value" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <el-button 
            type="primary" 
            @click="exportData"
            class="export-btn"
          >
            导出数据
          </el-button>
        </div>
      </div>
    </div>

    <!-- 课程类型工作量占比图表 -->
    <div class="chart-section">
      <div class="chart-container">
        <div class="chart-header">
          <h3>工作量占比</h3>
          <div class="chart-stats">
            <span class="stat-item">筛选结果: {{ filteredWorkload }} 小时</span>
          </div>
        </div>
        <div ref="pieChart" class="chart-content"></div>
      </div>
    </div>

    <!-- 近5年各学期工作量变化趋势图表 -->
    <div class="chart-section">
      <div class="chart-container">
        <div class="chart-header">
          <h3>各学期工作量变化趋势</h3>
          <div class="chart-stats">
            <span class="stat-item">平均工作量: {{ averageWorkload }} 小时/学期</span>
            <span class="stat-item">最高工作量: {{ maxWorkload }} 小时</span>
          </div>
        </div>
        <div ref="barChart" class="chart-content"></div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

// 响应式数据
const selectedCourse = ref('')
const selectedType = ref('')
const selectedSemester = ref('')

// 筛选选项
const courseOptions = ref([
  { value: 'math', label: '高等数学' },
  { value: 'physics', label: '大学物理' },
  { value: 'chemistry', label: '有机化学' },
  { value: 'computer', label: '计算机基础' },
  { value: 'english', label: '大学英语' },
  { value: 'biology', label: '生物化学' },
  { value: 'statistics', label: '统计学' }
])

const typeOptions = ref([
  { value: 'theory', label: '理论课' },
  { value: 'practice', label: '实践课' },
  { value: 'experiment', label: '实验课' }
])

const semesterOptions = ref([
  { value: '2024-1', label: '2024春季' },
  { value: '2023-2', label: '2023秋季' },
  { value: '2023-1', label: '2023春季' },
  { value: '2022-2', label: '2022秋季' },
  { value: '2022-1', label: '2022春季' }
])

// 图表相关
const pieChart = ref(null)
const barChart = ref(null)
let pieChartInstance = null
let barChartInstance = null

// 统计数据
const totalWorkload = ref(1000)
const filteredWorkload = ref(1000)
const averageWorkload = ref(140)
const maxWorkload = ref(160)

// 日历相关
const currentDate = ref(new Date())
const currentMonthText = computed(() => {
  return currentDate.value.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long' 
  })
})

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 模拟课程数据
const mockClassData = ref({
  '2024-01-15': [
    { id: 1, time: '08:00', name: '高等数学', type: 'theory', typeText: '理论课' },
    { id: 2, time: '14:00', name: '物理实验', type: 'experiment', typeText: '实验课' }
  ],
  '2024-01-16': [
    { id: 3, time: '10:00', name: '计算机基础', type: 'practice', typeText: '实践课' }
  ],
  '2024-01-17': [
    { id: 4, time: '09:00', name: '有机化学', type: 'theory', typeText: '理论课' },
    { id: 5, time: '15:00', name: '英语口语', type: 'practice', typeText: '实践课' }
  ],
  '2024-01-18': [
    { id: 6, time: '11:00', name: '数学实验', type: 'experiment', typeText: '实验课' }
  ],
  '2024-01-19': [
    { id: 7, time: '13:00', name: '物理理论', type: 'theory', typeText: '理论课' }
  ]
})

// 计算日历数据
const calendarWeeks = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7 // 转换为周一开始
  const daysInMonth = lastDay.getDate()
  
  const weeks = []
  let currentWeek = []
  
  // 添加上个月的日期
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(year, month, -i)
    currentWeek.push({
      day: day.getDate(),
      isCurrentMonth: false,
      isToday: false,
      hasClass: false,
      classes: [],
      date: day
    })
  }
  
  // 添加当前月的日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateStr = date.toISOString().split('T')[0]
    const hasClass = mockClassData.value[dateStr] && mockClassData.value[dateStr].length > 0
    const isToday = date.toDateString() === new Date().toDateString()
    
    currentWeek.push({
      day,
      isCurrentMonth: true,
      isToday,
      hasClass,
      classes: hasClass ? mockClassData.value[dateStr] : [],
      date
    })
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  
  // 添加下个月的日期
  const remainingDays = 7 - currentWeek.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    currentWeek.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      hasClass: false,
      classes: [],
      date
    })
  }
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }
  
  return weeks
})

// 筛选功能
const handleFilterChange = () => {
  console.log('筛选条件变化:', { 
    course: selectedCourse.value, 
    type: selectedType.value, 
    semester: selectedSemester.value 
  })
  
  // 模拟筛选后的数据变化
  updateFilteredData()
  initCharts()
}

const updateFilteredData = () => {
  // 根据筛选条件模拟数据变化
  let baseWorkload = 1000
  let multiplier = 1
  
  if (selectedCourse.value) {
    multiplier *= 0.8 // 选择特定课程时工作量减少
  }
  
  if (selectedType.value) {
    multiplier *= 0.6 // 选择特定类型时工作量减少
  }
  
  if (selectedSemester.value) {
    multiplier *= 0.4 // 选择特定学期时工作量减少
  }
  
  filteredWorkload.value = Math.round(baseWorkload * multiplier)
  averageWorkload.value = Math.round(140 * multiplier)
  maxWorkload.value = Math.round(160 * multiplier)
}

const exportData = () => {
  console.log('导出数据')
  // 这里可以添加导出功能
}

// 日历功能
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectDay = (day) => {
  console.log('选择日期:', day)
  // 这里可以添加日期选择后的逻辑
}

// 初始化图表
const initCharts = () => {
  initPieChart()
  initBarChart()
}

const initPieChart = () => {
  if (!pieChart.value) return
  
  if (pieChartInstance) {
    pieChartInstance.dispose()
  }
  
  pieChartInstance = echarts.init(pieChart.value)
  
  // 根据筛选条件调整数据
  let data = [
    { value: 45, name: '理论课', itemStyle: { color: '#5470c6' } },
    { value: 30, name: '实践课', itemStyle: { color: '#91cc75' } },
    { value: 25, name: '实验课', itemStyle: { color: '#fac858' } }
  ]
  
  // 根据筛选条件调整数据
  if (selectedType.value) {
    data = data.map(item => {
      if (item.name === getTypeLabel(selectedType.value)) {
        return { ...item, value: 100 }
      } else {
        return { ...item, value: 0 }
      }
    })
  }
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      textStyle: { color: '#666' }
    },
    series: [
      {
        name: '课程类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: data,
        itemStyle: {
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#fff',
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 12,
          color: '#333'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        }
      }
    ]
  }
  
  pieChartInstance.setOption(option)
}

const initBarChart = () => {
  if (!barChart.value) return
  
  if (barChartInstance) {
    barChartInstance.dispose()
  }
  
  barChartInstance = echarts.init(barChart.value)
  
  // 根据筛选条件调整数据
  let data = [
    { name: '2019春', value: 120 },
    { name: '2019秋', value: 135 },
    { name: '2020春', value: 98 },
    { name: '2020秋', value: 110 },
    { name: '2021春', value: 125 },
    { name: '2021秋', value: 140 },
    { name: '2022春', value: 115 },
    { name: '2022秋', value: 130 },
    { name: '2023春', value: 145 },
    { name: '2023秋', value: 160 }
  ]
  
  // 根据学期筛选调整数据
  if (selectedSemester.value) {
    data = data.map(item => {
      if (item.name === getSemesterLabel(selectedSemester.value)) {
        return { ...item, value: item.value }
      } else {
        return { ...item, value: 0 }
      }
    })
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLine: { lineStyle: { color: '#e0e6f1' } },
      axisTick: { show: false },
      axisLabel: { color: '#666', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#666', fontSize: 12 },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: '工作量',
        type: 'bar',
        data: data.map(item => item.value),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#5470c6' },
            { offset: 1, color: '#91cc75' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(84, 112, 198, 0.3)'
          }
        }
      }
    ]
  }
  
  barChartInstance.setOption(option)
}

// 辅助函数
const getTypeLabel = (value) => {
  const type = typeOptions.value.find(t => t.value === value)
  return type ? type.label : ''
}

const getSemesterLabel = (value) => {
  const semester = semesterOptions.value.find(s => s.value === value)
  return semester ? semester.label : ''
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initCharts()
  })
})

onUnmounted(() => {
  if (pieChartInstance) {
    pieChartInstance.dispose()
  }
  if (barChartInstance) {
    barChartInstance.dispose()
  }
})

// 监听筛选条件变化
watch([selectedCourse, selectedType, selectedSemester], () => {
  handleFilterChange()
}, { deep: true })
</script>

<style scoped>
.workload-quantification {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
  width: 100%;
}

.page-header {
  margin-bottom: 0px;
  text-align: center;
}

.page-header h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
}

.page-header p {
  color: #7f8c8d;
  font-size: 16px;
}

.module-title {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #5856d6;
  font-weight: 600;
  padding-bottom: 8px;
  display: flex;
}
/* 筛选区域 */
.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #333;
  min-width: 60px;
}

/* 自定义下拉框和按钮样式 */
.course-select {
  width: 200px !important;
  min-width: 200px !important;
}

.course-select .el-input__inner {
  width: 100% !important;
}

.type-select {
  width: 180px !important;
  min-width: 180px !important;
}

.type-select .el-input__inner {
  width: 100% !important;
}

.semester-select {
  width: 180px !important;
  min-width: 180px !important;
}

.semester-select .el-input__inner {
  width: 100% !important;
}

.export-btn {
  background: #409eff !important;
  border-color: #409eff !important;
  padding: 8px 20px !important;
  font-weight: 500 !important;
}

.export-btn:hover {
  background: #66b1ff !important;
  border-color: #66b1ff !important;
}

/* 图表区域 */
.chart-section {
  margin-bottom: 20px;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.chart-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  background: #f8f9fa;
  padding: 4px 12px;
  border-radius: 4px;
}

.chart-content {
  height: 400px;
}

/* 日历区域 */
.calendar-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.current-month {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  min-width: 120px;
  text-align: center;
}

.calendar-container {
  border: 1px solid #e0e6f1;
  border-radius: 8px;
  overflow: hidden;
}

.calendar-grid {
  width: 100%;
}

.calendar-header-row {
  display: flex;
  background: #f8f9fa;
}

.calendar-body {
  display: flex;
  flex-direction: column;
}

.calendar-week {
  display: flex;
  border-bottom: 1px solid #e0e6f1;
}

.calendar-week:last-child {
  border-bottom: none;
}

.calendar-cell {
  flex: 1;
  min-height: 120px;
  padding: 8px;
  border-right: 1px solid #e0e6f1;
  position: relative;
}

.calendar-cell:last-child {
  border-right: none;
}

.header-cell {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  font-size: 14px;
}

.day-cell {
  cursor: pointer;
  transition: background-color 0.2s;
}

.day-cell:hover {
  background-color: #f8f9fa;
}

.day-cell.current-month {
  background: white;
}

.day-cell:not(.current-month) {
  background: #f8f9fa;
  color: #bdc3c7;
}

.day-cell.today {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
}

.day-cell.has-class {
  background: #f3e5f5;
  border-left: 4px solid #9c27b0;
}

.day-number {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.class-info {
  font-size: 11px;
}

.class-item {
  background: white;
  border-radius: 4px;
  padding: 2px 6px;
  margin-bottom: 2px;
  border-left: 3px solid #9c27b0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.class-time {
  font-weight: 600;
  color: #9c27b0;
  margin-right: 4px;
}

.class-name {
  color: #2c3e50;
  margin-right: 4px;
}

.class-type {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  color: white;
}

.class-type.theory {
  background: #5470c6;
}

.class-type.practice {
  background: #91cc75;
}

.class-type.experiment {
  background: #fac858;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .chart-stats {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .workload-quantification {
    padding: 10px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .calendar-controls {
    flex-direction: column;
    gap: 10px;
  }
  
  .calendar-cell {
    min-height: 80px;
  }
  
  .class-item {
    font-size: 10px;
    padding: 1px 4px;
  }
  
  .chart-content {
    height: 300px;
  }
}
</style>
