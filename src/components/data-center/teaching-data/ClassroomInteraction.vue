<template>
  <div class="classroom-interaction-page">
    <!-- 顶部状态栏及筛选区域 -->
    <div class="filter-section">
      <!-- 左侧统计数值 -->
      <div class="stats-overview">
        <div class="stat-item">
          <span class="stat-label">响应率：</span>
          <span class="stat-value">{{ Math.round(avgResponseRate) || 0 }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">热情人次：</span>
          <span class="stat-value">{{ emotionStats['整体热情'] || 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">沉闷人次：</span>
          <span class="stat-value">{{ emotionStats['个别沉闷'] || 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">消极人次：</span>
          <span class="stat-value">{{ emotionStats['个别消极'] || 0 }}</span>
        </div>
      </div>

      <!-- 右侧筛选选项 -->
      <div class="filter-controls">
        <div class="filter-group">
          <label>课程：</label>
          <el-select 
            v-model="filters.course" 
            placeholder="全部课程" 
            clearable 
            @change="handleFilterChange"
            class="course-select"
          >
            <el-option label="全部课程" value="" />
            <el-option v-for="course in courseList" :key="course" :label="course" :value="course" />
          </el-select>
        </div>
        <div class="filter-group">
          <label>学生姓名：</label>
          <el-input 
            v-model="filters.studentName" 
            placeholder="输入学生姓名" 
            clearable
            @input="handleFilterChange"
            class="student-input"
          />
        </div>

        <div class="filter-group">
          <el-button-group>
            <el-button 
              :type="viewMode === 'list' ? 'primary' : 'default'" 
              @click="viewMode = 'list'"
            >
              列表
            </el-button>
            <el-button 
              :type="viewMode === 'chart' ? 'primary' : 'default'" 
              @click="viewMode = 'chart'"
            >
              视图
            </el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <!-- 数据列表视图 -->
    <div class="table-section" v-show="viewMode === 'list'">
      <el-table 
        :data="paginatedInteraction" 
        style="width: 100%"
        :default-sort="{ prop: 'time', order: 'descending' }"
        :header-cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        :cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        border
        stripe
      >
        <el-table-column prop="class" label="班级" align="center" />
        <el-table-column prop="course" label="课程" align="center" />
        <el-table-column prop="courseType" label="课程类型" align="center">
          <template #default="{ row }">
            <el-tag :type="getCourseTypeTag(row.courseType)">
              {{ row.courseType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" align="center" />
        <el-table-column prop="totalStudents" label="学生总数" align="center" />
        <el-table-column prop="questionResponseRate" label="提问响应率" align="center">
          <template #default="{ row }">
            <span :class="getResponseRateClass(row.questionResponseRate)">
              {{ row.questionResponseRate }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="studentQuestions" label="学生提问" align="center">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              link 
              @click="showQuestionList(row)"
              :disabled="row.studentQuestions === 0"
            >
              {{ row.studentQuestions }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="studentPresentations" label="学生演示" align="center">
          <template #default="{ row }">
            <el-button 
              type="success" 
              link 
              @click="showPresentationList(row)"
              :disabled="row.studentPresentations === 0"
            >
              {{ row.studentPresentations }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="emotionCapture" label="情绪捕捉" align="center">
          <template #default="{ row }">
            <el-button 
              type="warning" 
              link 
              @click="showEmotionDetails(row)"
            >
              {{ row.emotionCapture }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredInteraction.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 可视化视图 -->
    <div class="chart-section" v-show="viewMode === 'chart'">
      <div class="chart-container">
        <v-chart class="chart" :option="chartOption" autoresize />
      </div>
    </div>

    <!-- 学生提问详情弹窗 -->
    <el-dialog
      v-model="showQuestionDialog"
      title="学生提问详情"
      width="600px"
      :before-close="closeQuestionDialog"
    >
      <div class="question-list">
        <div v-for="(question, index) in currentQuestionList" :key="index" class="question-item">
          <div class="question-content">
            <strong>{{ question.studentName }}：</strong>
            {{ question.question }}
          </div>
          <div class="question-time">{{ question.time }}</div>
        </div>
        <div v-if="currentQuestionList.length === 0" class="no-data">
          暂无提问记录
        </div>
      </div>
    </el-dialog>

    <!-- 学生演示详情弹窗 -->
    <el-dialog
      v-model="showPresentationDialog"
      title="学生演示详情"
      width="600px"
      :before-close="closePresentationDialog"
    >
      <div class="presentation-list">
        <div v-for="(presentation, index) in currentPresentationList" :key="index" class="presentation-item">
          <div class="presentation-content">
            <strong>{{ presentation.studentName }}：</strong>
            {{ presentation.topic }}
          </div>
          <div class="presentation-time">{{ presentation.time }}</div>
        </div>
        <div v-if="currentPresentationList.length === 0" class="no-data">
          暂无演示记录
        </div>
      </div>
    </el-dialog>

    <!-- 情绪捕捉详情弹窗 -->
    <el-dialog
      v-model="showEmotionDialog"
      title="情绪捕捉详情"
      width="600px"
      :before-close="closeEmotionDialog"
    >
      <div class="emotion-details">
        <div class="emotion-overview">
          <h4>整体情绪状态：{{ currentEmotionData.overall }}</h4>
        </div>
        <div v-if="currentEmotionData.negativeStudents && currentEmotionData.negativeStudents.length > 0" class="negative-students">
          <h4>个别沉闷学生：</h4>
          <div class="student-list">
            <el-tag 
              v-for="student in currentEmotionData.negativeStudents" 
              :key="student"
              type="warning"
              class="student-tag"
            >
              {{ student }}
            </el-tag>
          </div>
        </div>
        <div v-if="currentEmotionData.passiveStudents && currentEmotionData.passiveStudents.length > 0" class="passive-students">
          <h4>个别消极学生：</h4>
          <div class="student-list">
            <el-tag 
              v-for="student in currentEmotionData.passiveStudents" 
              :key="student"
              type="danger"
              class="student-tag"
            >
              {{ student }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
])

// 视图模式
const viewMode = ref('list') // 'list' | 'chart'

// 筛选条件
const filters = ref({
  course: '',
  studentName: ''
})

// 课程列表
const courseList = ref([
  '高等数学',
  '线性代数',
  '概率论与数理统计',
  '数据结构',
  '算法设计',
  '计算机组成原理',
  '操作系统',
  '数据库原理',
  '软件工程',
  '计算机网络'
])

// 班级列表
const classList = ref([
  '计算机科学与技术2021-1班',
  '计算机科学与技术2021-2班',
  '软件工程2021-1班',
  '软件工程2021-2班',
  '数据科学与大数据技术2021-1班',
  '人工智能2021-1班',
  '网络工程2021-1班',
  '信息安全2021-1班'
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 弹窗状态
const showQuestionDialog = ref(false)
const showPresentationDialog = ref(false)
const showEmotionDialog = ref(false)

// 当前数据
const currentQuestionList = ref([])
const currentPresentationList = ref([])
const currentEmotionData = ref({})

// 生成模拟数据
const generateInteractionData = () => {
  const data = []
  const courseTypes = ['直播课', '录播课', '线下课']
  const emotions = ['整体热情', '个别沉闷', '个别消极']
  
  for (let i = 0; i < 50; i++) {
    const courseType = courseTypes[Math.floor(Math.random() * courseTypes.length)]
    const emotion = emotions[Math.floor(Math.random() * emotions.length)]
    
    data.push({
      id: i + 1,
      class: classList.value[Math.floor(Math.random() * classList.value.length)],
      course: courseList.value[Math.floor(Math.random() * courseList.value.length)],
      courseType: courseType,
      time: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      totalStudents: Math.floor(Math.random() * 30) + 20,
      questionResponseRate: Math.floor(Math.random() * 40) + 60,
      studentQuestions: Math.floor(Math.random() * 15),
      studentPresentations: Math.floor(Math.random() * 8),
      emotionCapture: emotion,
      // 详细数据
      questionList: generateQuestionList(),
      presentationList: generatePresentationList(),
      emotionData: generateEmotionData(emotion)
    })
  }
  
  return data
}

// 生成提问列表
const generateQuestionList = () => {
  const questions = []
  const questionCount = Math.floor(Math.random() * 15)
  const studentNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  
  for (let i = 0; i < questionCount; i++) {
    questions.push({
      studentName: studentNames[Math.floor(Math.random() * studentNames.length)],
      question: `问题内容${i + 1}：关于课程内容的疑问`,
      time: `${Math.floor(Math.random() * 60)}分钟前`
    })
  }
  
  return questions
}

// 生成演示列表
const generatePresentationList = () => {
  const presentations = []
  const presentationCount = Math.floor(Math.random() * 8)
  const studentNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const topics = ['算法设计', '数据结构应用', '系统架构', '数据库设计', '网络协议', '软件测试']
  
  for (let i = 0; i < presentationCount; i++) {
    presentations.push({
      studentName: studentNames[Math.floor(Math.random() * studentNames.length)],
      topic: topics[Math.floor(Math.random() * topics.length)],
      time: `${Math.floor(Math.random() * 60)}分钟前`
    })
  }
  
  return presentations
}

// 生成情绪数据
const generateEmotionData = (emotion) => {
  const studentNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二']
  
  if (emotion === '整体热情') {
    return {
      overall: '整体热情',
      negativeStudents: [],
      passiveStudents: []
    }
  } else if (emotion === '个别沉闷') {
    const negativeCount = Math.floor(Math.random() * 3) + 1
    return {
      overall: '个别沉闷',
      negativeStudents: studentNames.slice(0, negativeCount),
      passiveStudents: []
    }
  } else {
    const passiveCount = Math.floor(Math.random() * 3) + 1
    return {
      overall: '个别消极',
      negativeStudents: [],
      passiveStudents: studentNames.slice(0, passiveCount)
    }
  }
}

// 原始数据
const interactionData = ref(generateInteractionData())

// 筛选后的数据
const filteredInteraction = computed(() => {
  let result = interactionData.value

  // 按课程筛选
  if (filters.value.course) {
    result = result.filter(item => item.course === filters.value.course)
  }

  // 按学生姓名筛选（在提问和演示中查找）
  if (filters.value.studentName) {
    result = result.filter(item => 
      item.questionList.some(q => q.studentName.includes(filters.value.studentName)) ||
      item.presentationList.some(p => p.studentName.includes(filters.value.studentName))
    )
  }

  return result
})

// 计算页面的整体统计数值
const avgResponseRate = computed(() => {
  const list = filteredInteraction.value
  if (list.length === 0) return 0
  
  let totalRate = 0
  list.forEach(item => {
    totalRate += item.questionResponseRate || 0
  })
  
  return totalRate / list.length
})

const emotionStats = computed(() => {
  const list = filteredInteraction.value
  const stats = { '整体热情': 0, '个别沉闷': 0, '个别消极': 0 }
  list.forEach(item => {
    if (item.emotionCapture) {
      stats[item.emotionCapture] = (stats[item.emotionCapture] || 0) + 1
    }
  })
  return stats
})

// 图表配置选项
const chartOption = computed(() => {
  const data = [...filteredInteraction.value].sort((a, b) => new Date(a.time) - new Date(b.time)).slice(-20) // 获取最近20次上课数据
  
  const xAxisData = data.map(item => item.time.split(' ')[0] + '\\n' + item.course)
  const responseRates = data.map(item => item.questionResponseRate)
  const questionsCount = data.map(item => item.studentQuestions)
  const presentationsCount = data.map(item => item.studentPresentations)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['提问响应率(%)', '学生提问数', '学生演示数'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ],
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        rotate: 30,
        fontSize: 10
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '响应率',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value} %'
        }
      },
      {
        type: 'value',
        name: '互动次数',
        min: 0,
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '提问响应率(%)',
        type: 'line',
        smooth: true,
        data: responseRates,
        itemStyle: { color: '#3b82f6' },
        lineStyle: { width: 3 }
      },
      {
        name: '学生提问数',
        type: 'bar',
        yAxisIndex: 1,
        data: questionsCount,
        itemStyle: { color: '#10b981' },
         barWidth: '20%'
      },
      {
        name: '学生演示数',
        type: 'bar',
        yAxisIndex: 1,
        data: presentationsCount,
        itemStyle: { color: '#f59e0b' },
        barWidth: '20%'
      }
    ]
  }
})

// 分页后的数据
const paginatedInteraction = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredInteraction.value.slice(start, end)
})

// 方法
const handleFilterChange = () => {
  currentPage.value = 1
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const showQuestionList = (row) => {
  currentQuestionList.value = row.questionList
  showQuestionDialog.value = true
}

const closeQuestionDialog = () => {
  showQuestionDialog.value = false
  currentQuestionList.value = []
}

const showPresentationList = (row) => {
  currentPresentationList.value = row.presentationList
  showPresentationDialog.value = true
}

const closePresentationDialog = () => {
  showPresentationDialog.value = false
  currentPresentationList.value = []
}

const showEmotionDetails = (row) => {
  currentEmotionData.value = row.emotionData
  showEmotionDialog.value = true
}

const closeEmotionDialog = () => {
  showEmotionDialog.value = false
  currentEmotionData.value = {}
}

const getCourseTypeTag = (type) => {
  switch (type) {
    case '直播课': return 'success'
    case '录播课': return 'info'
    case '线下课': return 'warning'
    default: return ''
  }
}

const getResponseRateClass = (rate) => {
  if (rate >= 90) return 'rate-excellent'
  if (rate >= 80) return 'rate-good'
  if (rate >= 70) return 'rate-average'
  return 'rate-poor'
}
</script>

<style scoped>
.classroom-interaction-page {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 筛选区域样式 */
.filter-section {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

/* 统计数据区域 */
.stats-overview {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  color: #1677ff;
  font-weight: 600;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.course-select,
.class-select,
.student-input {
  width: 140px;
}

/* 表格及图表区域样式 */
.table-section,
.chart-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-section {
  padding: 24px;
}

.chart-container {
  width: 100%;
  height: 600px;
}

.chart {
  width: 100%;
  height: 100%;
}

.pagination-section {
  padding: 20px;
  display: flex;
  justify-content: center;
}

/* 响应率样式 */
.rate-excellent {
  color: #10b981;
  font-weight: 600;
}

.rate-good {
  color: #3b82f6;
  font-weight: 600;
}

.rate-average {
  color: #f59e0b;
  font-weight: 600;
}

.rate-poor {
  color: #ef4444;
  font-weight: 600;
}

/* 弹窗内容样式 */
.question-list,
.presentation-list {
  max-height: 400px;
  overflow-y: auto;
}

.question-item,
.presentation-item {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 8px;
  background: #f9fafb;
}

.question-content,
.presentation-content {
  margin-bottom: 4px;
  line-height: 1.5;
}

.question-time,
.presentation-time {
  font-size: 12px;
  color: #6b7280;
}

.no-data {
  text-align: center;
  color: #9ca3af;
  padding: 40px;
}

.emotion-details h4 {
  margin: 16px 0 8px 0;
  color: #374151;
}

.student-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.student-tag {
  margin: 2px;
}

.emotion-overview {
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

.negative-students,
.passive-students {
  margin-top: 16px;
  padding: 12px;
  background: #fef3f2;
  border-radius: 6px;
  border-left: 4px solid #ef4444;
}

.passive-students {
  background: #fef2f2;
  border-left-color: #dc2626;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
    margin-bottom: 12px;
  }
  
    .student-input {
      width: 100%;
    }
  }
</style>
