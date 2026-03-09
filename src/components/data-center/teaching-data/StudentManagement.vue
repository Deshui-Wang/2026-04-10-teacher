<template>
  <div class="student-management">
    <!-- 筛选/统计区域 -->
    <div class="filter-section">
      <!-- 左侧统计数值 -->
      <div class="stats-overview">
        <div class="stat-item">
          <span class="stat-label">学生总数：</span>
          <span class="stat-value">{{ summaryStats.totalStudents }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">平均出勤率：</span>
          <span class="stat-value">{{ summaryStats.avgAttendance }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">平均互动：</span>
          <span class="stat-value">{{ summaryStats.avgInteraction }}分</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">平均作业完成：</span>
          <span class="stat-value">{{ summaryStats.avgHomework }}%</span>
        </div>
      </div>

      <!-- 右侧搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索学号或姓名"
          size="large"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="data-section">
      <el-table
        :data="paginatedStudents"
        stripe
        border
        style="width: 100%"
        max-height="600"
        v-loading="loading"
      >
        <el-table-column prop="studentId" label="学号" width="120" fixed="left" />
        <el-table-column prop="name" label="姓名" width="100" fixed="left" />
        <el-table-column prop="class" label="班级" width="120" />
        
        <el-table-column prop="attendanceRate" label="出勤率" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getAttendanceTagType(row.attendanceRate)">
              {{ row.attendanceRate }}%
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="classInteraction" label="课堂互动" width="100" align="center">
          <template #default="{ row }">
            <el-rate 
              v-model="row.classInteraction" 
              disabled 
              show-score 
              text-color="#ff9900"
              score-template="{value}分"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="homeworkCompletionRate" label="作业完成率" width="120" align="center">
          <template #default="{ row }">
            <div class="progress-wrapper">
              <el-progress 
                :percentage="row.homeworkCompletionRate" 
                :stroke-width="8"
                :format="format => format + '%'"
              />
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="homeworkAccuracyRate" label="作业正确率" width="120" align="center">
          <template #default="{ row }">
            <div class="progress-wrapper">
              <el-progress 
                :percentage="row.homeworkAccuracyRate" 
                :stroke-width="8"
                :color="getAccuracyColor(row.homeworkAccuracyRate)"
                :format="format => format + '%'"
              />
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="averageScore" label="平均成绩" width="100" align="center">
          <template #default="{ row }">
            <span :class="getScoreClass(row.averageScore)">
              {{ row.averageScore }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="gpa" label="GPA" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="getGpaTagType(row.gpa)">
              {{ row.gpa }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="mbti" label="MBTI" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="info" effect="plain">{{ row.mbti }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="interests" label="兴趣画像" width="200">
          <template #default="{ row }">
            <div class="interests-tags">
              <el-tag 
                v-for="interest in row.interests" 
                :key="interest"
                size="small"
                effect="light"
                style="margin: 2px;"
              >
                {{ interest }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="researchProject" label="科研项目" width="180">
          <template #default="{ row }">
            <span v-if="row.researchProject" class="research-project">
              {{ row.researchProject }}
            </span>
            <span v-else class="no-project">暂无</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="majorMatch" label="专业匹配度" width="120" align="center">
          <template #default="{ row }">
            <div class="match-score">
              <el-progress 
                type="circle" 
                :percentage="row.majorMatch" 
                :width="50"
                :stroke-width="6"
                :color="getMatchColor(row.majorMatch)"
              />
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="careerAdvice" label="就业建议" width="200" fixed="right">
          <template #default="{ row }">
            <div class="career-advice">
              {{ row.careerAdvice }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 响应式数据
const searchQuery = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 学生数据
const students = ref([
  {
    studentId: '2021001',
    name: '张三',
    class: '计算机科学1班',
    attendanceRate: 95,
    classInteraction: 4.5,
    homeworkCompletionRate: 98,
    homeworkAccuracyRate: 92,
    averageScore: 87.5,
    gpa: 3.8,
    mbti: 'INTJ',
    interests: ['编程', '算法', '机器学习', '数据分析'],
    researchProject: '基于深度学习的图像识别系统',
    majorMatch: 95,
    careerAdvice: '建议从事软件开发或AI相关工作，具有很强的技术潜力'
  },
  {
    studentId: '2021002',
    name: '李四',
    class: '计算机科学1班',
    attendanceRate: 88,
    classInteraction: 3.8,
    homeworkCompletionRate: 85,
    homeworkAccuracyRate: 78,
    averageScore: 79.2,
    gpa: 3.2,
    mbti: 'ESFP',
    interests: ['设计', '前端开发', '用户体验'],
    researchProject: '',
    majorMatch: 78,
    careerAdvice: '适合UI/UX设计或前端开发岗位，具有良好的审美能力'
  },
  {
    studentId: '2021003',
    name: '王五',
    class: '计算机科学2班',
    attendanceRate: 92,
    classInteraction: 4.2,
    homeworkCompletionRate: 94,
    homeworkAccuracyRate: 89,
    averageScore: 85.8,
    gpa: 3.6,
    mbti: 'ENFJ',
    interests: ['项目管理', '团队协作', '技术架构'],
    researchProject: '分布式系统性能优化研究',
    majorMatch: 88,
    careerAdvice: '建议担任技术团队负责人或项目经理，领导能力突出'
  },
  {
    studentId: '2021004',
    name: '赵六',
    class: '计算机科学2班',
    attendanceRate: 76,
    classInteraction: 2.8,
    homeworkCompletionRate: 72,
    homeworkAccuracyRate: 65,
    averageScore: 68.5,
    gpa: 2.5,
    mbti: 'ISFP',
    interests: ['游戏', '音乐', '创意设计'],
    researchProject: '',
    majorMatch: 55,
    careerAdvice: '建议加强基础学习，可考虑游戏开发或创意设计方向'
  },
  {
    studentId: '2021005',
    name: '钱七',
    class: '软件工程1班',
    attendanceRate: 98,
    classInteraction: 4.8,
    homeworkCompletionRate: 99,
    homeworkAccuracyRate: 96,
    averageScore: 92.3,
    gpa: 4.0,
    mbti: 'INTP',
    interests: ['算法研究', '系统架构', '开源项目'],
    researchProject: '高性能数据库存储引擎设计',
    majorMatch: 98,
    careerAdvice: '具备卓越的技术天赋，建议深造或从事核心技术研发'
  },
  {
    studentId: '2021006',
    name: '孙八',
    class: '软件工程1班',
    attendanceRate: 84,
    classInteraction: 3.5,
    homeworkCompletionRate: 88,
    homeworkAccuracyRate: 82,
    averageScore: 81.7,
    gpa: 3.3,
    mbti: 'ESTJ',
    interests: ['企业应用', '数据分析', '商业智能'],
    researchProject: '',
    majorMatch: 82,
    careerAdvice: '适合企业级应用开发或数据分析师岗位'
  },
  {
    studentId: '2021007',
    name: '周九',
    class: '网络工程1班',
    attendanceRate: 90,
    classInteraction: 4.0,
    homeworkCompletionRate: 91,
    homeworkAccuracyRate: 85,
    averageScore: 83.4,
    gpa: 3.4,
    mbti: 'ISTP',
    interests: ['网络安全', '系统运维', '云计算'],
    researchProject: '网络入侵检测系统研究',
    majorMatch: 91,
    careerAdvice: '建议从事网络安全或运维开发工作，技术基础扎实'
  },
  {
    studentId: '2021008',
    name: '吴十',
    class: '网络工程1班',
    attendanceRate: 87,
    classInteraction: 3.6,
    homeworkCompletionRate: 86,
    homeworkAccuracyRate: 79,
    averageScore: 77.9,
    gpa: 3.0,
    mbti: 'ENFP',
    interests: ['创新技术', '创业', '产品设计'],
    researchProject: '',
    majorMatch: 75,
    careerAdvice: '具有创新思维，适合产品经理或技术创业方向'
  }
])

// 生成更多 Mock 数据达到 258 人
const generateMockStudents = () => {
  const currentCount = students.value.length
  const targetCount = 258
  const baseClasses = ['计算机科学1班', '计算机科学2班', '软件工程1班', '软件工程2班', '网络工程1班']
  const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
  const interestsPool = ['编程', '算法', '设计', '游戏', '系统架构', '云原生', '数据分析', '安全', '产品', '项目管理', '测试', '前端']
  const advicePool = [
    '建议加强算法基础，适合从事后端开发',
    '具备优秀的逻辑维能力，建议深入研究架构设计',
    '对用户体验敏感，可考虑向全栈或前端方向发展',
    '具有团队协作天赋，适合往技术管理岗位侧重',
    '建议多参与开源项目以提升工程实践经验',
    '理论知识扎实，可继续深造攻读硕士学位',
    '实践动手能力强，有适合企业开发岗位的潜力'
  ]
  const lastNames = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张']
  const firstNames = ['伟', '芳', '娜', '敏', '静', '秀英', '丽', '强', '磊', '洋', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚']

  for (let i = currentCount; i < targetCount; i++) {
    const studentId = `2021${String(i + 1).padStart(3, '0')}`
    const name = lastNames[Math.floor(Math.random() * lastNames.length)] + firstNames[Math.floor(Math.random() * firstNames.length)]
    const randomClass = baseClasses[Math.floor(Math.random() * baseClasses.length)]
    
    // 随机生成合理的成绩和交互数据
    const baseRate = 70 + Math.random() * 30 // 70-100
    const attendanceRate = Math.min(100, Math.round(baseRate + (Math.random() * 10 - 5)))
    const homeworkCompletionRate = Math.min(100, Math.round(baseRate + (Math.random() * 10 - 5)))
    const homeworkAccuracyRate = Math.min(100, Math.round(baseRate - Math.random() * 15))
    const averageScore = Number((baseRate * 0.9 + Math.random() * 10).toFixed(1))
    
    const classInteraction = Number((3 + Math.random() * 2).toFixed(1))
    const gpa = Number((2.0 + (averageScore - 60) * 0.05).toFixed(1))
    const majorMatch = Math.min(100, Math.round(60 + Math.random() * 40))
    
    // 随机选择2-4个兴趣
    const shuffledInterests = [...interestsPool].sort(() => 0.5 - Math.random())
    const selectedInterests = shuffledInterests.slice(0, Math.floor(Math.random() * 3) + 2)
    
    students.value.push({
      studentId,
      name,
      class: randomClass,
      attendanceRate,
      classInteraction: Math.min(5, classInteraction),
      homeworkCompletionRate,
      homeworkAccuracyRate,
      averageScore,
      gpa: Math.min(4.0, gpa),
      mbti: mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)],
      interests: selectedInterests,
      researchProject: Math.random() > 0.7 ? '参与本科生科研训练计划' : '',
      majorMatch,
      careerAdvice: advicePool[Math.floor(Math.random() * advicePool.length)]
    })
  }
}

// 基于搜索结果应用分页
const paginatedStudents = computed(() => {
  if (!searchQuery.value.trim()) {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return students.value.slice(start, end)
  }
  
  const query = searchQuery.value.trim().toLowerCase()
  const filtered = students.value.filter(student => 
    student.studentId.toLowerCase().includes(query) ||
    student.name.toLowerCase().includes(query)
  )
  
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 根据搜索结果计算真实总数
const filteredTotal = computed(() => {
  if (!searchQuery.value.trim()) {
    return students.value.length
  }
  const query = searchQuery.value.trim().toLowerCase()
  return students.value.filter(student => 
    student.studentId.toLowerCase().includes(query) ||
    student.name.toLowerCase().includes(query)
  ).length
})

// 计算统计数值
const summaryStats = computed(() => {
  const list = students.value
  if (list.length === 0) return { totalStudents: 0, avgAttendance: 0, avgInteraction: 0, avgHomework: 0 }
  
  let totalAttendance = 0
  let totalInteraction = 0
  let totalHomework = 0
  
  list.forEach(item => {
    totalAttendance += item.attendanceRate || 0
    totalInteraction += item.classInteraction || 0
    totalHomework += item.homeworkCompletionRate || 0
  })
  
  return {
    totalStudents: list.length,
    avgAttendance: Math.round(totalAttendance / list.length),
    avgInteraction: (totalInteraction / list.length).toFixed(1),
    avgHomework: Math.round(totalHomework / list.length)
  }
})

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 监听搜索词并更新分页总数如果必要（el-pagination 自带了总数响应只要绑定对了）
watch(filteredTotal, (newTotal) => {
  total.value = newTotal
  // 确保在删减搜索词导致总页数变少时，不会停留在超出上限的页数里
  const maxPage = Math.ceil(newTotal / pageSize.value) || 1
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage
  }
})

// 出勤率标签类型
const getAttendanceTagType = (rate) => {
  if (rate >= 95) return 'success'
  if (rate >= 85) return 'warning'
  return 'danger'
}

// 正确率颜色
const getAccuracyColor = (rate) => {
  if (rate >= 90) return '#67c23a'
  if (rate >= 80) return '#e6a23c'
  if (rate >= 70) return '#f56c6c'
  return '#909399'
}

// 成绩样式类
const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 70) return 'score-average'
  return 'score-poor'
}

// GPA标签类型
const getGpaTagType = (gpa) => {
  if (gpa >= 3.7) return 'success'
  if (gpa >= 3.0) return 'warning'
  return 'danger'
}

// 匹配度颜色
const getMatchColor = (match) => {
  if (match >= 90) return '#67c23a'
  if (match >= 80) return '#409eff'
  if (match >= 70) return '#e6a23c'
  return '#f56c6c'
}

// 初始化
onMounted(() => {
  generateMockStudents()
  total.value = students.value.length
})
</script>

<style scoped>
.student-management {
  padding: 0;
  background: white;
}

.filter-section {
  padding: 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
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

.search-box {
  width: 280px;
  flex-shrink: 0;
}

.data-section {
  padding: 24px;
}

.progress-wrapper {
  padding: 0 8px;
}

.interests-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.research-project {
  color: #409eff;
  font-weight: 500;
}

.no-project {
  color: #909399;
  font-style: italic;
}

.match-score {
  display: flex;
  justify-content: center;
}

.career-advice {
  font-size: 13px;
  line-height: 1.4;
  color: #666;
}

.score-excellent {
  color: #67c23a;
  font-weight: bold;
}

.score-good {
  color: #409eff;
  font-weight: 500;
}

.score-average {
  color: #e6a23c;
}

.score-poor {
  color: #f56c6c;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-section {
    padding: 16px;
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-overview {
    gap: 12px;
  }
  
  .search-box {
    width: 100%;
  }

  .data-section {
    padding: 16px;
  }
}
</style>
