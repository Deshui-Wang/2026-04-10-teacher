<template>
  <div class="classroom-data">
    <!-- 数据概览 -->
    <div class="overview-section">
      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <h3>总学生数</h3>
            <p class="number">{{ overviewData.totalStudents }}</p>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <h3>平均出勤率</h3>
            <p class="number">{{ overviewData.attendanceRate }}%</p>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon">📝</div>
          <div class="card-content">
            <h3>作业完成率</h3>
            <p class="number">{{ overviewData.homeworkRate }}%</p>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon">💬</div>
          <div class="card-content">
            <h3>课堂互动次数</h3>
            <p class="number">{{ overviewData.interactions }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 出勤统计 -->
    <div class="attendance-section">
      <div class="section-header">
        <h3>出勤统计</h3>
        <div class="filter-controls">
          <el-select v-model="selectedClass" placeholder="选择班级" style="width: 150px">
            <el-option label="全部班级" value="" />
            <el-option v-for="cls in classes" :key="cls" :label="cls" :value="cls" />
          </el-select>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </div>
      </div>
      
      <div class="attendance-chart">
        <div class="chart-container">
          <canvas ref="attendanceChart" width="800" height="300"></canvas>
        </div>
      </div>
    </div>

    <!-- 课堂互动分析 -->
    <div class="interaction-section">
      <div class="section-header">
        <h3>课堂互动分析</h3>
      </div>
      
      <div class="interaction-grid">
        <div class="interaction-card">
          <h4>提问分布</h4>
          <div class="question-stats">
            <div v-for="stat in questionStats" :key="stat.type" class="stat-item">
              <span class="stat-label">{{ stat.type }}</span>
              <div class="stat-bar">
                <div class="stat-fill" :style="{ width: stat.percentage + '%' }"></div>
              </div>
              <span class="stat-value">{{ stat.count }}</span>
            </div>
          </div>
        </div>
        
        <div class="interaction-card">
          <h4>学生参与度</h4>
          <div class="participation-chart">
            <div v-for="student in participationData" :key="student.name" class="student-item">
              <span class="student-name">{{ student.name }}</span>
              <div class="participation-bar">
                <div class="participation-fill" :style="{ width: student.participation + '%' }"></div>
              </div>
              <span class="participation-value">{{ student.participation }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 作业完成情况 -->
    <div class="homework-section">
      <div class="section-header">
        <h3>作业完成情况</h3>
      </div>
      
      <div class="homework-table">
        <div class="table-header">
          <div class="header-cell">作业名称</div>
          <div class="header-cell">截止时间</div>
          <div class="header-cell">提交人数</div>
          <div class="header-cell">完成率</div>
          <div class="header-cell">平均分</div>
          <div class="header-cell">状态</div>
        </div>
        <div class="table-body">
          <div v-for="homework in homeworkData" :key="homework.id" class="table-row">
            <div class="table-cell">{{ homework.name }}</div>
            <div class="table-cell">{{ homework.deadline }}</div>
            <div class="table-cell">{{ homework.submitted }}/{{ homework.total }}</div>
            <div class="table-cell">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: homework.completionRate + '%' }"></div>
              </div>
              <span class="progress-text">{{ homework.completionRate }}%</span>
            </div>
            <div class="table-cell">{{ homework.averageScore }}</div>
            <div class="table-cell">
              <span :class="['status-badge', homework.status.toLowerCase()]">
                {{ homework.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 课堂表现评价 -->
    <div class="performance-section">
      <div class="section-header">
        <h3>课堂表现评价</h3>
      </div>
      
      <div class="performance-grid">
        <div class="performance-card">
          <h4>学习态度</h4>
          <div class="rating-stats">
            <div v-for="rating in attitudeRatings" :key="rating.level" class="rating-item">
              <span class="rating-label">{{ rating.level }}</span>
              <div class="rating-bar">
                <div class="rating-fill" :style="{ width: rating.percentage + '%' }"></div>
              </div>
              <span class="rating-count">{{ rating.count }}人</span>
            </div>
          </div>
        </div>
        
        <div class="performance-card">
          <h4>课堂纪律</h4>
          <div class="discipline-stats">
            <div class="discipline-item">
              <span class="discipline-label">迟到早退</span>
              <span class="discipline-value">{{ disciplineData.lateEarly }}次</span>
            </div>
            <div class="discipline-item">
              <span class="discipline-label">课堂违纪</span>
              <span class="discipline-value">{{ disciplineData.violations }}次</span>
            </div>
            <div class="discipline-item">
              <span class="discipline-label">手机使用</span>
              <span class="discipline-value">{{ disciplineData.phoneUse }}次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// 响应式数据
const selectedClass = ref('')
const dateRange = ref([])
const attendanceChart = ref(null)

// 概览数据
const overviewData = ref({
  totalStudents: 156,
  attendanceRate: 94.2,
  homeworkRate: 87.5,
  interactions: 342
})

// 班级列表
const classes = ref(['计算机21-1', '计算机21-2', '计算机21-3', '软件21-1', '软件21-2'])

// 提问统计
const questionStats = ref([
  { type: '概念理解', count: 45, percentage: 35 },
  { type: '算法设计', count: 38, percentage: 30 },
  { type: '代码实现', count: 28, percentage: 22 },
  { type: '其他问题', count: 17, percentage: 13 }
])

// 学生参与度数据
const participationData = ref([
  { name: '提问', participation: 35 },
  { name: '讨论', participation: 88 },
  { name: '演示', participation: 62 },
  { name: '其他', participation: 76 },
])

// 作业数据
const homeworkData = ref([
  {
    id: 1,
    name: '数据结构实验一',
    deadline: '2024-01-15',
    submitted: 45,
    total: 50,
    completionRate: 90,
    averageScore: 85.6,
    status: '已完成'
  },
  {
    id: 2,
    name: '算法设计作业',
    deadline: '2024-01-20',
    submitted: 42,
    total: 50,
    completionRate: 84,
    averageScore: 78.3,
    status: '进行中'
  },
  {
    id: 3,
    name: '编程实践项目',
    deadline: '2024-01-25',
    submitted: 38,
    total: 50,
    completionRate: 76,
    averageScore: 82.1,
    status: '进行中'
  }
])

// 学习态度评价
const attitudeRatings = ref([
  { level: '优秀', count: 25, percentage: 50 },
  { level: '良好', count: 15, percentage: 30 },
  { level: '一般', count: 8, percentage: 16 },
  { level: '需改进', count: 2, percentage: 4 }
])

// 课堂纪律数据
const disciplineData = ref({
  lateEarly: 12,
  violations: 3,
  phoneUse: 8
})

// 绘制出勤率图表
const drawAttendanceChart = () => {
  if (!attendanceChart.value) return
  
  const ctx = attendanceChart.value.getContext('2d')
  const canvas = attendanceChart.value
  const width = canvas.width
  const height = canvas.height
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 模拟出勤率数据
  const data = [92, 94, 88, 96, 90, 93, 95]
  const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  
  const maxValue = Math.max(...data)
  const barWidth = width / data.length * 0.6
  const barSpacing = width / data.length * 0.4
  
  // 绘制柱状图
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * (height - 40)
    const x = index * (barWidth + barSpacing) + barSpacing / 2
    const y = height - barHeight - 20
    
    // 绘制柱子
    ctx.fillStyle = '#1677ff'
    ctx.fillRect(x, y, barWidth, barHeight)
    
    // 绘制数值
    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(value + '%', x + barWidth / 2, y - 5)
    
    // 绘制标签
    ctx.fillText(labels[index], x + barWidth / 2, height - 5)
  })
}

onMounted(() => {
  nextTick(() => {
    drawAttendanceChart()
  })
})
</script>

<style scoped>
.classroom-data {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
  width: 100%;
}

/* 概览卡片 */
.overview-section {
  margin-bottom: 30px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 36px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 22px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f0f0f0 100%);
  border-radius: 12px;
}

.card-content h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.number {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1677ff;
}

/* 通用section样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

/* 出勤统计 */
.attendance-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

/* 课堂互动 */
.interaction-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.interaction-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.interaction-card {
  padding: 20px;
  border: 1px solid #e8ecf3;
  border-radius: 8px;
}

.interaction-card h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.question-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-label {
  min-width: 80px;
  font-size: 14px;
  color: #666;
}

.stat-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: #1677ff;
  border-radius: 4px;
  transition: width 0.3s;
}

.stat-value {
  min-width: 30px;
  text-align: right;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.participation-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-name {
  min-width: 60px;
  font-size: 14px;
  color: #333;
}

.participation-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.participation-fill {
  height: 100%;
  background: #52c41a;
  border-radius: 3px;
  transition: width 0.3s;
}

.participation-value {
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 作业完成情况 */
.homework-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.homework-table {
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 2px solid #f0f0f0;
  font-weight: 600;
  color: #333;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-cell {
  font-size: 14px;
  color: #333;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-fill {
  height: 6px;
  background: #1677ff;
  border-radius: 3px;
  min-width: 20px;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.已完成 {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.进行中 {
  background: #fff7e6;
  color: #fa8c16;
}

/* 课堂表现 */
.performance-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.performance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.performance-card {
  padding: 20px;
  border: 1px solid #e8ecf3;
  border-radius: 8px;
}

.performance-card h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.rating-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-label {
  min-width: 60px;
  font-size: 14px;
  color: #666;
}

.rating-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background: #52c41a;
  border-radius: 4px;
  transition: width 0.3s;
}

.rating-count {
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.discipline-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.discipline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.discipline-item:last-child {
  border-bottom: none;
}

.discipline-label {
  font-size: 14px;
  color: #666;
}

.discipline-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .interaction-grid,
  .performance-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .filter-controls {
    width: 100%;
    flex-direction: column;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style> 