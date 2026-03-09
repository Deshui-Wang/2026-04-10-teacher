<template>
  <div class="grade-management">
    <!-- 顶部状态栏及筛选区域 -->
    <div class="filter-section">
      <!-- 左侧统计数值 -->
      <div class="stats-overview">
        <div class="stat-item">
          <span class="stat-label">考试人次：</span>
          <span class="stat-value">{{ filteredGrades.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">平均成绩：</span>
          <span class="stat-value">{{ Math.round(averageScore) || 0 }}分</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">及格率：</span>
          <span class="stat-value">{{ Math.round(passRate) || 0 }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">挂科率：</span>
          <span class="stat-value">{{ Math.round(failRate) || 0 }}%</span>
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
          <label>班级：</label>
          <el-select 
            v-model="filters.class" 
            placeholder="全部班级" 
            clearable 
            @change="handleFilterChange"
            class="class-select"
          >
            <el-option label="全部班级" value="" />
            <el-option v-for="cls in classList" :key="cls" :label="cls" :value="cls" />
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

    <!-- 详细成绩表格 -->
    <div class="table-section">
      
      <el-table 
        :data="paginatedGrades" 
        style="width: 100%"
        :default-sort="{ prop: 'score', order: 'descending' }"
        :header-cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        :cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        border
        stripe
      >
        <el-table-column prop="studentName" label="学生姓名" align="center" />
        <el-table-column prop="studentId" label="学号" align="center" />
        <el-table-column prop="class" label="班级" align="center" />
        <el-table-column prop="course" label="课程" align="center" />
        <el-table-column prop="score" label="成绩" width="100" sortable align="center">
          <template #default="{ row }">
            <span :class="getScoreClass(row.score)">{{ row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="examDate" label="考试日期" align="center" />
        <el-table-column label="成绩趋势" align="center" width="150" >
          <template #default="{ row }">
            <div class="trend-chart">
              <svg width="80" height="40" viewBox="0 0 80 40">
                <defs>
                  <linearGradient :id="`trendGradient-${row.id}`" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" :style="`stop-color:${row.score > row.previousScore ? '#52c41a' : row.score < row.previousScore ? '#ff4d4f' : '#666'};stop-opacity:1`" />
                    <stop offset="100%" :style="`stop-color:${row.score > row.previousScore ? '#52c41a' : row.score < row.previousScore ? '#ff4d4f' : '#666'};stop-opacity:0.3`" />
                  </linearGradient>
                </defs>
                <path 
                  :d="getTrendPath(row)" 
                  :stroke="`url(#trendGradient-${row.id})`" 
                  stroke-width="2" 
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle 
                  cx="10" 
                  cy="30" 
                  r="2" 
                  :fill="row.score > row.previousScore ? '#52c41a' : row.score < row.previousScore ? '#ff4d4f' : '#666'"
                />
                <circle 
                  cx="70" 
                  cy="10" 
                  r="2" 
                  :fill="row.score > row.previousScore ? '#52c41a' : row.score < row.previousScore ? '#ff4d4f' : '#666'"
                />
              </svg>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small" 
              @click="viewStudentDetail(row)"
              link
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 15, 20, 50, 100]"
          :total="filteredGrades.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 学生成绩详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`${currentStudent.studentName}的成绩详情`"
      width="900px"
      :close-on-click-modal="false"
    >
      <div v-if="currentStudent.studentName" class="student-detail">
        <!-- 学生基本信息 -->
        <div class="detail-header">
          <div class="student-avatar-large">
            <img :src="currentStudent.avatar" :alt="currentStudent.studentName" />
          </div>
          <div class="student-basic-info">
            <h3>{{ currentStudent.studentName }}</h3>
            <p><span class="label">学号：</span>{{ currentStudent.studentId }}</p>
            <p><span class="label">班级：</span>{{ currentStudent.class }}</p>
            <p><span class="label">当前课程：</span>{{ currentStudent.course }}</p>
          </div>
          <div class="student-stats">
            <div class="stat-item">
              <div class="stat-value">{{ currentStudent.averageScore }}</div>
              <div class="stat-label">平均分</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ currentStudent.rank }}</div>
              <div class="stat-label">班级排名</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ currentStudent.totalCourses }}</div>
              <div class="stat-label">修读课程</div>
            </div>
          </div>
        </div>

        <!-- 成绩趋势图表 -->
        <div class="detail-chart-section">
          <h4>成绩趋势</h4>
          <div ref="studentTrendChart" class="student-trend-chart"></div>
        </div>

        <!-- 各科成绩列表 -->
        <div class="detail-table-section">
          <h4>各科成绩明细</h4>
          <el-table 
            :data="currentStudent.courseGrades" 
            style="width: 100%"
            border
            stripe
          >
            <el-table-column prop="course" label="课程名称" align="center" />
            <el-table-column prop="score" label="当前成绩" align="center" width="100">
              <template #default="{ row }">
                <span :class="getScoreClass(row.score)">{{ row.score }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="previousScore" label="上次成绩" align="center" width="100" />
            <el-table-column label="变化" align="center" width="100">
              <template #default="{ row }">
                <span :class="row.change >= 0 ? 'score-up' : 'score-down'">
                  {{ row.change > 0 ? '+' : '' }}{{ row.change }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="examDate" label="考试日期" align="center" />
            <el-table-column prop="status" label="状态" align="center" width="100">
              <template #default="{ row }">
                <el-tag 
                  :type="row.score >= 60 ? 'success' : 'danger'"
                  size="small"
                >
                  {{ row.score >= 60 ? '及格' : '不及格' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 成绩分析 -->
        <div class="detail-analysis">
          <h4>成绩分析</h4>
          <div class="analysis-content">
            <div class="analysis-item">
              <span class="analysis-label">优势科目：</span>
              <span class="analysis-value">{{ currentStudent.bestCourse }}</span>
            </div>
            <div class="analysis-item">
              <span class="analysis-label">薄弱科目：</span>
              <span class="analysis-value">{{ currentStudent.weakCourse }}</span>
            </div>
            <div class="analysis-item">
              <span class="analysis-label">进步最大：</span>
              <span class="analysis-value">{{ currentStudent.mostImproved }}</span>
            </div>
            <div class="analysis-item">
              <span class="analysis-label">学习建议：</span>
              <span class="analysis-value">{{ currentStudent.suggestion }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

// 响应式数据
const filters = ref({
  course: '',
  class: '',
  studentName: ''
})

const trendType = ref('course')
const anomalyType = ref('improvement')
const currentPage = ref(1)
const pageSize = ref(15)

// 学生详情对话框
const detailDialogVisible = ref(false)
const currentStudent = ref({
  studentName: '',
  studentId: '',
  class: '',
  course: '',
  avatar: '',
  averageScore: 0,
  rank: 0,
  totalCourses: 0,
  courseGrades: [],
  bestCourse: '',
  weakCourse: '',
  mostImproved: '',
  suggestion: '',
  trendData: []
})

// 图表实例
const scoreDistributionChart = ref(null)
const trendChart = ref(null)
const studentTrendChart = ref(null)
let scoreChart = null
let trendChartInstance = null
let studentTrendChartInstance = null

// 模拟数据
const courseList = ['高等数学', '线性代数', '大学物理', '程序设计', '数据结构', '操作系统']
const classList = ['计算机1班', '计算机2班', '计算机3班', '软件1班', '软件2班', '网络1班']

// 生成模拟成绩数据
const generateGradeData = () => {
  const data = []
  // 更真实的中文姓名列表
  const studentNames = [
    '王小明', '李小红', '张伟', '刘敏', '陈强', '杨丽', '赵磊', '黄娟', '周杰', '吴雪',
    '徐涛', '孙静', '马超', '朱琳', '胡军', '郭芳', '何勇', '罗娜', '高飞', '梁燕',
    '宋波', '唐丽', '韩磊', '冯雪', '邓强', '曹敏', '彭丽', '蒋涛', '薛静', '方超',
    '石琳', '姜军', '戴芳', '夏勇', '钟娜', '汪飞', '田燕', '任波', '白丽', '崔磊',
    '史雪', '龙强', '段敏', '侯丽', '江涛', '钱静', '汤超', '尹琳', '黎军', '易芳',
    '常勇', '武娜', '乔飞', '贺燕', '赖波', '龚丽', '文磊', '庞雪', '樊强', '兰敏',
    '殷丽', '施涛', '陶静', '洪超', '石琳', '葛军', '奚芳', '范勇', '彭娜', '郎飞',
    '鲁燕', '韦波', '昌丽', '马磊', '苗雪', '凤强', '花敏', '方丽', '俞涛', '任静',
    '袁超', '柳琳', '鲍军', '史芳', '唐勇', '费娜', '廉飞', '岑燕', '薛波', '雷丽',
    '贺磊', '倪雪', '汤强', '滕敏', '殷丽', '罗涛', '毕静', '郝超', '邬琳', '安军'
  ]
  
  let id = 1
  courseList.forEach(course => {
    classList.forEach(cls => {
      // 每个班级随机选择10-15个学生
      const studentCount = Math.floor(Math.random() * 6) + 10
      const selectedStudents = [...studentNames].sort(() => 0.5 - Math.random()).slice(0, studentCount)
      
      selectedStudents.forEach((name, index) => {
        const baseScore = Math.random() * 40 + 50 // 50-90基础分
        const variation = (Math.random() - 0.5) * 20 // ±10分变动
        const score = Math.max(0, Math.min(100, Math.round(baseScore + variation)))
        
        data.push({
          id: id++,
          studentName: name,
          studentId: `2024${String(id).padStart(4, '0')}`,
          class: cls,
          course: course,
          score: score,
          rank: index + 1,
          examDate: `2024-${String(Math.floor(Math.random() * 6) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          previousScore: Math.max(0, Math.min(100, score + (Math.random() - 0.5) * 30))
        })
      })
    })
  })
  
  return data
}

const allGrades = ref(generateGradeData())

// 计算属性
const filteredGrades = computed(() => {
  let filtered = allGrades.value
  
  if (filters.value.course) {
    filtered = filtered.filter(grade => grade.course === filters.value.course)
  }
  
  if (filters.value.class) {
    filtered = filtered.filter(grade => grade.class === filters.value.class)
  }
  
  if (filters.value.studentName) {
    filtered = filtered.filter(grade => 
      grade.studentName.includes(filters.value.studentName)
    )
  }
  
  return filtered
})

// 分页后的数据
const paginatedGrades = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredGrades.value.slice(start, end)
})

const totalStudents = computed(() => {
  const uniqueStudents = new Set(filteredGrades.value.map(g => g.studentId))
  return uniqueStudents.size
})

const totalCourses = computed(() => {
  const uniqueCourses = new Set(filteredGrades.value.map(g => g.course))
  return uniqueCourses.size
})

const averageScore = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  const sum = filteredGrades.value.reduce((acc, grade) => acc + grade.score, 0)
  return sum / filteredGrades.value.length
})

const passRate = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  const passCount = filteredGrades.value.filter(grade => grade.score >= 60).length
  return (passCount / filteredGrades.value.length) * 100
})

const failRate = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  const failCount = filteredGrades.value.filter(grade => grade.score < 60).length
  return (failCount / filteredGrades.value.length) * 100
})

const anomalyStudents = computed(() => {
  const students = filteredGrades.value.map(grade => {
    const change = grade.score - grade.previousScore
    // 从 student01.png 到 student05.png 中随机选择
    const studentImageIndex = (grade.id % 5) + 1
    return {
      ...grade,
      change: Math.round(change),
      currentScore: Math.round(grade.score),
      previousScore: Math.round(grade.previousScore),
      avatar: `/pic/student${String(studentImageIndex).padStart(2, '0')}.png`
    }
  })
  
  if (anomalyType.value === 'improvement') {
    return students.filter(s => s.change > 10).sort((a, b) => b.change - a.change).slice(0, 10)
  } else {
    return students.filter(s => s.change < -10).sort((a, b) => a.change - b.change).slice(0, 10)
  }
})

// 方法
const handleFilterChange = () => {
  currentPage.value = 1
  nextTick(() => {
    updateCharts()
  })
}

const getTrendPath = (row) => {
  const scoreDiff = row.score - row.previousScore
  const maxDiff = 30 // 假设最大变化为30分
  
  // 计算起点和终点的Y坐标（Y轴向上为正）
  const startY = 30 // 起点Y坐标
  const endY = 10   // 终点Y坐标
  
  if (scoreDiff > 0) {
    // 上升趋势：从右下到左上
    return `M 10,${startY} Q 40,${startY - 10} 70,${endY}`
  } else if (scoreDiff < 0) {
    // 下降趋势：从右上到左下
    return `M 10,${endY} Q 40,${endY + 10} 70,${startY}`
  } else {
    // 持平：水平线
    return `M 10,20 Q 40,20 70,20`
  }
}

const changeTrendType = (type) => {
  trendType.value = type
  updateTrendChart()
}

const changeAnomalyType = (type) => {
  anomalyType.value = type
}

const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 70) return 'score-fair'
  if (score >= 60) return 'score-pass'
  return 'score-fail'
}

const viewStudentDetail = (row) => {
  // 生成该学生的详细成绩数据
  const studentImageIndex = (row.id % 5) + 1
  
  // 获取该学生的所有课程成绩
  const studentAllGrades = allGrades.value.filter(g => g.studentId === row.studentId)
  
  // 生成各科成绩明细
  const courseGrades = courseList.map((course, index) => {
    const existingGrade = studentAllGrades.find(g => g.course === course)
    if (existingGrade) {
      return {
        course: existingGrade.course,
        score: existingGrade.score,
        previousScore: Math.round(existingGrade.previousScore),
        change: Math.round(existingGrade.score - existingGrade.previousScore),
        examDate: existingGrade.examDate
      }
    } else {
      // 如果该学生没有这门课程，生成一个模拟数据
      const score = Math.round(Math.random() * 40 + 50)
      const previousScore = Math.round(Math.random() * 40 + 50)
      return {
        course: course,
        score: score,
        previousScore: previousScore,
        change: score - previousScore,
        examDate: `2024-${String(Math.floor(Math.random() * 6) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      }
    }
  })
  
  // 计算平均分
  const avgScore = Math.round(courseGrades.reduce((sum, g) => sum + g.score, 0) / courseGrades.length)
  
  // 找出优势科目（分数最高）
  const bestGrade = courseGrades.reduce((max, g) => g.score > max.score ? g : max)
  
  // 找出薄弱科目（分数最低）
  const weakGrade = courseGrades.reduce((min, g) => g.score < min.score ? g : min)
  
  // 找出进步最大的科目
  const mostImprovedGrade = courseGrades.reduce((max, g) => g.change > max.change ? g : max)
  
  // 生成学习建议
  let suggestion = ''
  if (avgScore >= 85) {
    suggestion = '成绩优秀，继续保持！可以尝试更具挑战性的学习内容。'
  } else if (avgScore >= 75) {
    suggestion = '成绩良好，建议加强薄弱科目的学习，争取更大进步。'
  } else if (avgScore >= 60) {
    suggestion = `需要重点关注${weakGrade.course}，建议增加学习时间，寻求老师或同学帮助。`
  } else {
    suggestion = `成绩需要提高，建议制定详细的学习计划，重点攻克${weakGrade.course}等薄弱科目。`
  }
  
  // 生成成绩趋势数据（近6次考试）
  const trendData = []
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  let currentScore = avgScore
  for (let i = 0; i < 6; i++) {
    const variation = (Math.random() - 0.5) * 10
    currentScore = Math.max(50, Math.min(100, currentScore + variation))
    trendData.push({
      month: months[i],
      score: Math.round(currentScore)
    })
  }
  
  // 计算班级排名（模拟）
  const classStudents = allGrades.value.filter(g => g.class === row.class)
  const uniqueStudents = [...new Set(classStudents.map(g => g.studentId))]
  const studentAvgScores = uniqueStudents.map(studentId => {
    const grades = classStudents.filter(g => g.studentId === studentId)
    const avg = grades.reduce((sum, g) => sum + g.score, 0) / grades.length
    return { studentId, avg }
  })
  studentAvgScores.sort((a, b) => b.avg - a.avg)
  const rank = studentAvgScores.findIndex(s => s.studentId === row.studentId) + 1
  
  currentStudent.value = {
    studentName: row.studentName,
    studentId: row.studentId,
    class: row.class,
    course: row.course,
    avatar: `/pic/student${String(studentImageIndex).padStart(2, '0')}.png`,
    averageScore: avgScore,
    rank: rank,
    totalCourses: courseGrades.length,
    courseGrades: courseGrades,
    bestCourse: `${bestGrade.course} (${bestGrade.score}分)`,
    weakCourse: `${weakGrade.course} (${weakGrade.score}分)`,
    mostImproved: `${mostImprovedGrade.course} (${mostImprovedGrade.change > 0 ? '+' : ''}${mostImprovedGrade.change}分)`,
    suggestion: suggestion,
    trendData: trendData
  }
  
  detailDialogVisible.value = true
  
  // 等待对话框渲染后初始化图表
  nextTick(() => {
    initStudentTrendChart()
  })
}

const editScore = (row) => {
  // 编辑成绩逻辑
  console.log('编辑成绩:', row)
}

const exportData = () => {
  // 导出数据逻辑
  console.log('导出数据')
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 初始化分数分布图表
const initScoreDistributionChart = () => {
  if (scoreChart) {
    scoreChart.dispose()
  }
  
  scoreChart = echarts.init(scoreDistributionChart.value)
  updateScoreDistributionChart()
}

// 更新分数分布图表
const updateScoreDistributionChart = () => {
  if (!scoreChart) return
  
  const scoreRanges = [
    { name: '60分以下', min: 0, max: 59, color: '#ff4757' },
    { name: '60-70分', min: 60, max: 70, color: '#ffa502' },
    { name: '70-80分', min: 71, max: 80, color: '#ffdd59' },
    { name: '80-90分', min: 81, max: 90, color: '#7bed9f' },
    { name: '90-99分', min: 91, max: 99, color: '#5352ed' },
    { name: '满分', min: 100, max: 100, color: '#ff6b81' }
  ]
  
  const data = scoreRanges.map(range => {
    const count = filteredGrades.value.filter(grade => 
      grade.score >= range.min && grade.score <= range.max
    ).length
    
    return {
      name: range.name,
      value: count,
      itemStyle: { color: range.color }
    }
  })
  
  const option = {
    title: {
      text: '分数段分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: '分数段',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          formatter: '{b}: {c}'
        }
      }
    ]
  }
  
  scoreChart.setOption(option)
}

// 初始化趋势图表
const initTrendChart = () => {
  if (trendChartInstance) {
    trendChartInstance.dispose()
  }
  
  trendChartInstance = echarts.init(trendChart.value)
  updateTrendChart()
}

// 更新趋势图表
const updateTrendChart = () => {
  if (!trendChartInstance) return
  
  let categories = []
  let seriesData = []
  
  if (trendType.value === 'course') {
    categories = courseList
    seriesData = categories.map(course => {
      const courseGrades = filteredGrades.value.filter(g => g.course === course)
      return courseGrades.length > 0 
        ? courseGrades.reduce((sum, g) => sum + g.score, 0) / courseGrades.length 
        : 0
    })
  } else {
    categories = classList
    seriesData = categories.map(cls => {
      const classGrades = filteredGrades.value.filter(g => g.class === cls)
      return classGrades.length > 0 
        ? classGrades.reduce((sum, g) => sum + g.score, 0) / classGrades.length 
        : 0
    })
  }
  
  const option = {
    title: {
      text: `${trendType.value === 'course' ? '课程' : '班级'}平均分趋势`,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      name: '平均分'
    },
    series: [
      {
        name: '平均分',
        type: 'line',
        data: seriesData,
        smooth: true,
        lineStyle: {
          color: '#5352ed',
          width: 3
        },
        itemStyle: {
          color: '#5352ed'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(83, 82, 237, 0.3)' },
            { offset: 1, color: 'rgba(83, 82, 237, 0.1)' }
          ])
        }
      }
    ]
  }
  
  trendChartInstance.setOption(option)
}

// 更新所有图表
const updateCharts = () => {
  updateScoreDistributionChart()
  updateTrendChart()
}

// 初始化学生趋势图表
const initStudentTrendChart = () => {
  if (!studentTrendChart.value) return
  
  if (studentTrendChartInstance) {
    studentTrendChartInstance.dispose()
  }
  
  studentTrendChartInstance = echarts.init(studentTrendChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      left: '50',
      right: '30',
      bottom: '30',
      top: '30'
    },
    xAxis: {
      type: 'category',
      data: currentStudent.value.trendData.map(d => d.month),
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      name: '成绩',
      nameTextStyle: {
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '平均分',
        type: 'line',
        data: currentStudent.value.trendData.map(d => d.score),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#5352ed',
          width: 3
        },
        itemStyle: {
          color: '#5352ed',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(83, 82, 237, 0.4)' },
            { offset: 1, color: 'rgba(83, 82, 237, 0.1)' }
          ])
        }
      }
    ]
  }
  
  studentTrendChartInstance.setOption(option)
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initScoreDistributionChart()
    initTrendChart()
  })
})

// 监听筛选条件变化
watch(() => filteredGrades.value, () => {
  updateCharts()
}, { deep: true })
</script>

<style scoped>
.grade-management {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

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
  align-items: center;
  gap: 16px;
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

.class-select {
  width: 180px !important;
  min-width: 180px !important;
}

.class-select .el-input__inner {
  width: 100% !important;
}

.student-input {
  width: 200px !important;
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

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 22px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f0f0f0 100%);
  border-radius: 15%;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #1677ff;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 图表区域 */
.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-header {
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.chart-container {
  height: 400px;
  width: 100%;
}

/* 标签页 */
.trend-tabs, .anomaly-tabs {
  display: flex;
  gap: 8px;
}

.tab-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f5f5f5;
}

.tab-btn.active {
  background: #5352ed;
  color: white;
  border-color: #5352ed;
}

/* 异常学生区域 */
.anomaly-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.anomaly-list {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  align-content: stretch;
  justify-content: space-around;
}

.anomaly-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.anomaly-item:hover {
  border-color: #5352ed;
  box-shadow: 0 2px 8px rgba(83, 82, 237, 0.1);
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
}

.student-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-info {
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: baseline;
}

.student-name {
  font-weight: 500;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  margin-right: 10px;
}

.student-details {
  font-size: 16px;
  color: #666;
}

.score-change {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-from, .score-to {
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

.arrow {
  font-size: 20px;
  font-weight: bold;
}

.arrow.improvement {
  color: #52c41a;
}

.arrow.decline {
  color: #ff4d4f;
}

.change-value {
  font-size: 16px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
}

.change-value.improvement {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.change-value.decline {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

/* 表格区域 */
.table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.table-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.el-table__header-wrapper) {
  display: flex;
  justify-content: center;
}

:deep(.el-table th) {
  background-color: #fafafa;
  font-weight: 600;
  color: #333;
  text-align: center !important;
  padding: 12px 8px !important;
}

:deep(.el-table td) {
  text-align: center !important;
  padding: 12px 8px !important;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table--border) {
  border: 1px solid #ebeef5;
}

:deep(.el-table--border th),
:deep(.el-table--border td) {
  border-right: 1px solid #ebeef5;
}

:deep(.el-table--border th:last-child),
:deep(.el-table--border td:last-child) {
  border-right: none;
}

/* 成绩趋势图表 */
.trend-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}

.trend-chart svg {
  display: block;
}

/* 成绩样式 */
.score-excellent {
  color: #52c41a;
  font-weight: bold;
}

.score-good {
  color: #1890ff;
  font-weight: bold;
}

.score-fair {
  color: #faad14;
  font-weight: bold;
}

.score-pass {
  color: #13c2c2;
  font-weight: bold;
}

.score-fail {
  color: #ff4d4f;
  font-weight: bold;
}

/* 分页 */
.pagination-wrapper {
  padding: 20px;
  display: flex;
  justify-content: center;
}

/* 学生详情对话框 */
.student-detail {
  padding: 10px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 24px;
  color: white;
}

.student-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.student-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-basic-info {
  flex: 1;
}

.student-basic-info h3 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: bold;
}

.student-basic-info p {
  margin: 6px 0;
  font-size: 14px;
  opacity: 0.95;
}

.student-basic-info .label {
  font-weight: 500;
  opacity: 0.85;
}

.student-stats {
  display: flex;
  gap: 24px;
}

.student-stats .stat-item {
  text-align: center;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.student-stats .stat-value {
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 6px;
}

.student-stats .stat-label {
  font-size: 13px;
  opacity: 0.9;
}

.detail-chart-section {
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.detail-chart-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.student-trend-chart {
  height: 300px;
  width: 100%;
}

.detail-table-section {
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.detail-table-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.score-up {
  color: #52c41a;
  font-weight: bold;
}

.score-down {
  color: #ff4d4f;
  font-weight: bold;
}

.detail-analysis {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.detail-analysis h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.analysis-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.analysis-item {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.analysis-label {
  font-weight: 500;
  color: #666;
  white-space: nowrap;
}

.analysis-value {
  color: #333;
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

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
  
  .course-select,
  .class-select,
  .student-input {
    flex: 1;
    width: auto;
  }
  
  .export-btn {
    width: 100%;
  }
}
</style>
```
