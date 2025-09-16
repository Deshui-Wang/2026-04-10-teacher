<template>
  <div class="student-assignments">
    <!-- 页面标题 -->
    <div class="page-header">
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>班级：</label>
          <el-select 
            v-model="selectedClass" 
            placeholder="全部班级" 
            clearable 
            @change="handleSearch"
            class="class-select"
          >
            <el-option label="全部班级" value="" />
            <el-option
              v-for="classItem in classList"
              :key="classItem.id"
              :label="classItem.name"
              :value="classItem.id"
            />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>作业名称：</label>
          <el-input
            v-model="assignmentSearch"
            placeholder="输入作业名称"
            clearable
            @input="handleSearch"
            class="assignment-input"
          />
        </div>
        
        <div class="filter-group">
          <label>学生姓名：</label>
          <el-input
            v-model="studentSearch"
            placeholder="输入学生姓名"
            clearable
            @input="handleSearch"
            class="student-input"
          />
        </div>
        
        <div class="filter-group">
          <el-button 
            type="primary" 
            @click="handleSearch"
            class="search-btn"
          >
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ totalAssignments }}</div>
          <div class="stat-label">总作业数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-content">
          <div class="stat-value">{{ submissionRate }}%</div>
          <div class="stat-label">平均提交率</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ accuracyRate }}%</div>
          <div class="stat-label">平均正确率</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">{{ totalStudents }}</div>
          <div class="stat-label">参与学生数</div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 提交率统计 -->
      <div class="content-section">
        <div class="section-header">
          <h3 class="section-title">提交率统计</h3>
          <div class="submission-rate">{{ submissionRate }}%</div>
        </div>
        <div class="submission-details">
          <div class="submitted-students">
            <h4 class="subsection-title">已提交学生</h4>
            <div class="student-list">
              <div v-for="student in submittedStudents" :key="student.id" class="student-item">
                <img :src="student.avatar" :alt="student.name" class="student-avatar" />
                <div class="student-info">
                  <div class="student-name">{{ student.name }}</div>
                  <div class="student-class">{{ student.className }}</div>
                </div>
                <div class="submission-time">{{ student.submissionTime }}</div>
              </div>
            </div>
          </div>
          <div class="unsubmitted-students">
            <h4 class="subsection-title">未提交学生</h4>
            <div class="student-list">
              <div v-for="student in unsubmittedStudents" :key="student.id" class="student-item unsubmitted">
                <img :src="student.avatar" :alt="student.name" class="student-avatar" />
                <div class="student-info">
                  <div class="student-name">{{ student.name }}</div>
                  <div class="student-class">{{ student.className }}</div>
                </div>
                <div class="unsubmitted-badge">未提交</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 正确率统计 -->
      <div class="content-section">
        <div class="section-header">
          <h3 class="section-title">正确率统计</h3>
          <div class="accuracy-rate">{{ accuracyRate }}%</div>
        </div>
        <div class="accuracy-details">
          <div class="excellent-students">
            <h4 class="subsection-title">优秀学生 (90分以上)</h4>
            <div class="student-list">
              <div v-for="student in excellentStudents" :key="student.id" class="student-item excellent">
                <img :src="student.avatar" :alt="student.name" class="student-avatar" />
                <div class="student-info">
                  <div class="student-name">{{ student.name }}</div>
                  <div class="student-class">{{ student.className }}</div>
                </div>
                <div class="score">{{ student.score }}分</div>
              </div>
            </div>
          </div>
          <div class="poor-students">
            <h4 class="subsection-title">需要关注 (60分以下)</h4>
            <div class="student-list">
              <div v-for="student in poorStudents" :key="student.id" class="student-item poor">
                <img :src="student.avatar" :alt="student.name" class="student-avatar" />
                <div class="student-info">
                  <div class="student-name">{{ student.name }}</div>
                  <div class="student-class">{{ student.className }}</div>
                </div>
                <div class="score">{{ student.score }}分</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 知识点分布 -->
      <div class="content-section">
        <div class="section-header">
          <h3 class="section-title">知识点分布</h3>
        </div>
        <div class="knowledge-distribution">
          <div class="difficulty-level">
            <div class="level-header">
              <h4 class="level-title">简单</h4>
              <div class="level-count">{{ easyCount }}题</div>
            </div>
            <div class="level-progress">
              <div class="progress-bar easy" :style="{ width: easyPercentage + '%' }"></div>
            </div>
            <div class="level-percentage">{{ easyPercentage }}%</div>
          </div>
          <div class="difficulty-level">
            <div class="level-header">
              <h4 class="level-title">正常</h4>
              <div class="level-count">{{ normalCount }}题</div>
            </div>
            <div class="level-progress">
              <div class="progress-bar normal" :style="{ width: normalPercentage + '%' }"></div>
            </div>
            <div class="level-percentage">{{ normalPercentage }}%</div>
          </div>
          <div class="difficulty-level">
            <div class="level-header">
              <h4 class="level-title">较难</h4>
              <div class="level-count">{{ hardCount }}题</div>
            </div>
            <div class="level-progress">
              <div class="progress-bar hard" :style="{ width: hardPercentage + '%' }"></div>
            </div>
            <div class="level-percentage">{{ hardPercentage }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 筛选条件
const selectedClass = ref('')
const assignmentSearch = ref('')
const studentSearch = ref('')

// 班级列表
const classList = ref([
  { id: '1', name: '计算机科学与技术2021-1班' },
  { id: '2', name: '计算机科学与技术2021-2班' },
  { id: '3', name: '软件工程2021-1班' },
  { id: '4', name: '软件工程2021-2班' },
  { id: '5', name: '人工智能2021-1班' }
])

// 统计数据
const totalAssignments = ref(12)
const submissionRate = ref(85)
const accuracyRate = ref(78)
const totalStudents = ref(120)

// 已提交学生
const submittedStudents = ref([
  {
    id: 1,
    name: '张三',
    className: '计算机科学与技术2021-1班',
    avatar: '/pic/student01.png',
    submissionTime: '2024-01-15 14:30'
  },
  {
    id: 2,
    name: '李四',
    className: '计算机科学与技术2021-1班',
    avatar: '/pic/student02.png',
    submissionTime: '2024-01-15 16:45'
  },
  {
    id: 3,
    name: '王五',
    className: '软件工程2021-1班',
    avatar: '/pic/student03.png',
    submissionTime: '2024-01-15 18:20'
  },
  {
    id: 4,
    name: '赵六',
    className: '软件工程2021-1班',
    avatar: '/pic/student04.png',
    submissionTime: '2024-01-16 09:15'
  }
])

// 未提交学生
const unsubmittedStudents = ref([
  {
    id: 5,
    name: '钱七',
    className: '计算机科学与技术2021-1班',
    avatar: '/pic/student05.png'
  },
  {
    id: 6,
    name: '孙八',
    className: '计算机科学与技术2021-2班',
    avatar: '/pic/student01.png'
  },
  {
    id: 7,
    name: '周九',
    className: '人工智能2021-1班',
    avatar: '/pic/student02.png'
  }
])

// 优秀学生
const excellentStudents = ref([
  {
    id: 1,
    name: '张三',
    className: '计算机科学与技术2021-1班',
    avatar: '/pic/student01.png',
    score: 95
  },
  {
    id: 2,
    name: '李四',
    className: '计算机科学与技术2021-1班',
    avatar: '/pic/student02.png',
    score: 92
  },
  {
    id: 8,
    name: '吴十',
    className: '软件工程2021-1班',
    avatar: '/pic/student03.png',
    score: 98
  }
])

// 需要关注的学生
const poorStudents = ref([
  {
    id: 9,
    name: '郑十一',
    className: '计算机科学与技术2021-2班',
    avatar: '/pic/student04.png',
    score: 45
  },
  {
    id: 10,
    name: '王十二',
    className: '人工智能2021-1班',
    avatar: '/pic/student05.png',
    score: 38
  }
])

// 知识点分布数据
const easyCount = ref(8)
const normalCount = ref(15)
const hardCount = ref(7)
const totalQuestions = computed(() => easyCount.value + normalCount.value + hardCount.value)

const easyPercentage = computed(() => Math.round((easyCount.value / totalQuestions.value) * 100))
const normalPercentage = computed(() => Math.round((normalCount.value / totalQuestions.value) * 100))
const hardPercentage = computed(() => Math.round((hardCount.value / totalQuestions.value) * 100))

// 搜索处理
const handleSearch = () => {
  console.log('搜索条件:', {
    class: selectedClass.value,
    assignment: assignmentSearch.value,
    student: studentSearch.value
  })
  // 这里可以添加实际的搜索逻辑
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.student-assignments {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
  width: 100%;
}

/* 页面标题 */
.page-header {
  margin-bottom: 20px;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
  font-weight: 700;
}

.page-subtitle {
  margin: 0;
  color: #666;
  font-size: 16px;
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

/* 自定义下拉框和输入框样式 */
.class-select {
  width: 180px !important;
  min-width: 180px !important;
}

.class-select .el-input__inner {
  width: 100% !important;
}

.assignment-input {
  width: 200px !important;
}

.student-input {
  width: 200px !important;
}

.search-btn {
  background: #409eff !important;
  border-color: #409eff !important;
  padding: 8px 20px !important;
  font-weight: 500 !important;
}

.search-btn:hover {
  background: #66b1ff !important;
  border-color: #66b1ff !important;
}

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 22px;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f0f0f0 100%);
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1677ff;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 主要内容区域 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e8ecf3;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.submission-rate,
.accuracy-rate {
  font-size: 24px;
  font-weight: 700;
  color: #1677ff;
}

/* 提交详情 */
.submission-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 20px;
}

.subsection-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s;
}

.student-item:hover {
  background: #e6f7ff;
}

.student-item.unsubmitted {
  background: #fff2e8;
}

.student-item.excellent {
  background: #f6ffed;
}

.student-item.poor {
  background: #fff1f0;
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 14px;
  color: #333;
  font-weight: 600;
  margin-bottom: 2px;
}

.student-class {
  font-size: 12px;
  color: #666;
}

.submission-time {
  font-size: 12px;
  color: #52c41a;
  font-weight: 500;
}

.unsubmitted-badge {
  font-size: 12px;
  color: #ff4d4f;
  font-weight: 500;
  background: #ffccc7;
  padding: 2px 8px;
  border-radius: 4px;
}

.score {
  font-size: 16px;
  font-weight: 700;
  color: #1677ff;
}

/* 正确率详情 */
.accuracy-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 20px;
}

/* 知识点分布 */
.knowledge-distribution {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.difficulty-level {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e8ecf3;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.level-title {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.level-count {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.level-progress {
  height: 8px;
  background: #e8ecf3;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.progress-bar.easy {
  background: linear-gradient(90deg, #52c41a, #73d13d);
}

.progress-bar.normal {
  background: linear-gradient(90deg, #1677ff, #4096ff);
}

.progress-bar.hard {
  background: linear-gradient(90deg, #ff4d4f, #ff7875);
}

.level-percentage {
  font-size: 14px;
  color: #1677ff;
  font-weight: 600;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .class-select,
  .assignment-input,
  .student-input {
    width: 100% !important;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .submission-details,
  .accuracy-details {
    grid-template-columns: 1fr;
  }
  
  .student-assignments {
    padding: 16px;
  }
}
</style>
