<template>
  <div class="courseware-page">
    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>学年：</label>
          <el-select 
            v-model="filters.academicYear" 
            placeholder="选择学年" 
            clearable 
            @change="handleFilterChange"
            class="year-select"
          >
            <el-option label="全部学年" value="" />
            <el-option label="2025-2026" value="2025-2026" />
            <el-option label="2024-2025" value="2024-2025" />
            <el-option label="2023-2024" value="2023-2024" />
            <el-option label="2022-2023" value="2022-2023" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>学期：</label>
          <el-select 
            v-model="filters.semester" 
            placeholder="选择学期" 
            clearable 
            @change="handleFilterChange"
            class="semester-select"
          >
            <el-option label="全部学期" value="" />
            <el-option label="春季学期" value="spring" />
            <el-option label="秋季学期" value="autumn" />
            <el-option label="夏季学期" value="summer" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>类型：</label>
          <el-select 
            v-model="filters.type" 
            placeholder="选择类型" 
            clearable 
            @change="handleFilterChange"
            class="type-select"
          >
            <el-option label="全部类型" value="" />
            <el-option label="课件" value="courseware" />
            <el-option label="教案" value="lesson-plan" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索课件/教案名称" 
            clearable
            @input="handleFilterChange"
            class="search-input"
          />
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-section">
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalCourseware }}</div>
            <div class="stat-label">课件总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalLessonPlans }}</div>
            <div class="stat-label">教案总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalStudents }}</div>
            <div class="stat-label">覆盖学生数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏫</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalClasses }}</div>
            <div class="stat-label">覆盖班级数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 课件教案列表 -->
    <div class="content-section">
      <div class="section-header">
        <h2>我的课件教案</h2>
        <div class="view-toggle">
          <el-button-group>
            <el-button 
              :type="viewMode === 'grid' ? 'primary' : ''" 
              @click="viewMode = 'grid'"
              size="small"
            >
              网格视图
            </el-button>
            <el-button 
              :type="viewMode === 'list' ? 'primary' : ''" 
              @click="viewMode = 'list'"
              size="small"
            >
              列表视图
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="courseware-grid">
        <div 
          v-for="item in filteredData" 
          :key="item.id" 
          class="courseware-card"
          :class="`card-${item.type}`"
        >
          <div class="card-header">
            <div class="type-badge" :class="`badge-${item.type}`">
              {{ item.type === 'courseware' ? '课件' : '教案' }}
            </div>
            <div class="academic-info">
              <span class="academic-year">{{ item.academicYear }}</span>
              <span class="semester">{{ getSemesterName(item.semester) }}</span>
            </div>
          </div>
          
          <div class="card-content">
            <h3 class="item-title">{{ item.name }}</h3>
            <p class="item-description">{{ item.description }}</p>
            
            <div class="item-stats">
              <div class="stat-item">
                <span class="stat-label">授课对象</span>
                <span class="stat-value">{{ item.targetAudience }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">总课时</span>
                <span class="stat-value">{{ item.totalHours }}课时</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">学分</span>
                <span class="stat-value">{{ item.credits }}分</span>
              </div>
            </div>
            
            <div class="course-info">
              <div class="course-item">
                <span class="course-label">使用课程</span>
                <span class="course-name">{{ item.courseName }}</span>
              </div>
              <div class="coverage-info">
                <div class="coverage-item">
                  <span class="coverage-label">覆盖班级</span>
                  <span class="coverage-value">{{ item.classCount }}个</span>
                </div>
                <div class="coverage-item">
                  <span class="coverage-label">覆盖学生</span>
                  <span class="coverage-value">{{ item.studentCount }}人</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-actions">
            <el-button type="primary" size="small" @click="viewItem(item)">
              查看详情
            </el-button>
            <el-button size="small" @click="editItem(item)">
              编辑
            </el-button>
            <el-button size="small" @click="downloadItem(item)">
              下载
            </el-button>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="courseware-list">
        <div class="list-header">
          <div class="header-cell">名称</div>
          <div class="header-cell">类型</div>
          <div class="header-cell">授课对象</div>
          <div class="header-cell">总课时</div>
          <div class="header-cell">学分</div>
          <div class="header-cell">使用课程</div>
          <div class="header-cell">覆盖班级</div>
          <div class="header-cell">覆盖学生</div>
          <div class="header-cell">学年学期</div>
          <div class="header-cell">操作</div>
        </div>
        
        <div 
          v-for="item in filteredData" 
          :key="item.id" 
          class="list-item"
        >
          <div class="item-cell">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-desc">{{ item.description }}</div>
          </div>
          <div class="item-cell">
            <span class="type-tag" :class="`tag-${item.type}`">
              {{ item.type === 'courseware' ? '课件' : '教案' }}
            </span>
          </div>
          <div class="item-cell">{{ item.targetAudience }}</div>
          <div class="item-cell">{{ item.totalHours }}课时</div>
          <div class="item-cell">{{ item.credits }}分</div>
          <div class="item-cell">{{ item.courseName }}</div>
          <div class="item-cell">{{ item.classCount }}个</div>
          <div class="item-cell">{{ item.studentCount }}人</div>
          <div class="item-cell">
            <div class="academic-info">
              <span class="academic-year">{{ item.academicYear }}</span>
              <span class="semester">{{ getSemesterName(item.semester) }}</span>
            </div>
          </div>
          <div class="item-cell">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="viewItem(item)">
                查看
              </el-button>
              <el-button size="small" @click="editItem(item)">
                编辑
              </el-button>
              <el-button size="small" @click="downloadItem(item)">
                下载
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredData.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <div class="empty-text">暂无课件教案数据</div>
        <div class="empty-desc">请检查筛选条件或联系管理员</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const viewMode = ref('grid')
const filters = ref({
  academicYear: '',
  semester: '',
  type: '',
  keyword: ''
})

// 模拟数据
const coursewareData = ref([
  {
    id: 1,
    name: '数据结构与算法基础',
    description: '涵盖线性表、栈、队列、树、图等基础数据结构',
    type: 'courseware',
    academicYear: '2025-2026',
    semester: 'spring',
    targetAudience: '计算机科学2201',
    totalHours: 64,
    credits: 4,
    courseName: '数据结构与算法',
    classCount: 3,
    studentCount: 156,
    createTime: '2025-01-15',
    updateTime: '2025-01-20'
  },
  {
    id: 2,
    name: '软件工程导论教案',
    description: '软件开发生命周期、需求分析、系统设计等核心概念',
    type: 'lesson-plan',
    academicYear: '2025-2026',
    semester: 'spring',
    targetAudience: '软件工程2201',
    totalHours: 48,
    credits: 3,
    courseName: '软件工程导论',
    classCount: 2,
    studentCount: 98,
    createTime: '2025-01-10',
    updateTime: '2025-01-18'
  },
  {
    id: 3,
    name: '机器学习基础课件',
    description: '监督学习、无监督学习、深度学习基础理论',
    type: 'courseware',
    academicYear: '2024-2025',
    semester: 'autumn',
    targetAudience: '人工智能2201',
    totalHours: 72,
    credits: 4,
    courseName: '机器学习基础',
    classCount: 2,
    studentCount: 84,
    createTime: '2024-09-01',
    updateTime: '2024-12-15'
  },
  {
    id: 4,
    name: '数据库系统原理教案',
    description: '关系数据库、SQL语言、数据库设计理论',
    type: 'lesson-plan',
    academicYear: '2024-2025',
    semester: 'autumn',
    targetAudience: '计算机科学2101',
    totalHours: 56,
    credits: 3.5,
    courseName: '数据库系统原理',
    classCount: 4,
    studentCount: 192,
    createTime: '2024-08-20',
    updateTime: '2024-11-30'
  },
  {
    id: 5,
    name: 'Web开发技术课件',
    description: 'HTML5、CSS3、JavaScript、Vue.js前端开发技术',
    type: 'courseware',
    academicYear: '2023-2024',
    semester: 'spring',
    targetAudience: '软件工程2102',
    totalHours: 64,
    credits: 4,
    courseName: 'Web开发技术',
    classCount: 3,
    studentCount: 135,
    createTime: '2024-02-01',
    updateTime: '2024-05-20'
  },
  {
    id: 6,
    name: '操作系统原理教案',
    description: '进程管理、内存管理、文件系统、设备管理',
    type: 'lesson-plan',
    academicYear: '2023-2024',
    semester: 'spring',
    targetAudience: '计算机科学2001',
    totalHours: 72,
    credits: 4,
    courseName: '操作系统原理',
    classCount: 2,
    studentCount: 96,
    createTime: '2024-01-15',
    updateTime: '2024-06-10'
  }
])

// 计算属性
const filteredData = computed(() => {
  let filtered = coursewareData.value

  // 学年筛选
  if (filters.value.academicYear) {
    filtered = filtered.filter(item => item.academicYear === filters.value.academicYear)
  }

  // 学期筛选
  if (filters.value.semester) {
    filtered = filtered.filter(item => item.semester === filters.value.semester)
  }

  // 类型筛选
  if (filters.value.type) {
    filtered = filtered.filter(item => item.type === filters.value.type)
  }

  // 关键词搜索
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      item.courseName.toLowerCase().includes(keyword) ||
      item.targetAudience.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

const totalCourseware = computed(() => {
  return coursewareData.value.filter(item => item.type === 'courseware').length
})

const totalLessonPlans = computed(() => {
  return coursewareData.value.filter(item => item.type === 'lesson-plan').length
})

const totalStudents = computed(() => {
  return coursewareData.value.reduce((sum, item) => sum + item.studentCount, 0)
})

const totalClasses = computed(() => {
  return coursewareData.value.reduce((sum, item) => sum + item.classCount, 0)
})

// 方法
const handleFilterChange = () => {
  // 筛选逻辑已在计算属性中处理
}

const getSemesterName = (semester) => {
  const semesterMap = {
    'spring': '春季学期',
    'autumn': '秋季学期',
    'summer': '夏季学期'
  }
  return semesterMap[semester] || semester
}

const viewItem = (item) => {
  console.log('查看详情:', item)
  // 这里可以打开详情弹窗或跳转到详情页面
}

const editItem = (item) => {
  console.log('编辑:', item)
  // 这里可以打开编辑弹窗或跳转到编辑页面
}

const downloadItem = (item) => {
  console.log('下载:', item)
  // 这里可以触发下载逻辑
}

onMounted(() => {
  // 组件挂载时的初始化逻辑
})
</script>

<style scoped>
.courseware-page {
  padding: 24px;
  background: #f8f9ff;
  min-height: 100vh;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

/* 筛选区域样式 */
.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.year-select,
.semester-select,
.type-select {
  width: 150px;
}

.search-input {
  width: 250px;
}

/* 统计概览样式 */
.stats-section {
  margin-bottom: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f0f0f0 100%);
  border-radius: 12px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 内容区域样式 */
.content-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e6f1;
  background: #f8f9ff;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

/* 网格视图样式 */
.courseware-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 24px;
}

.courseware-card {
  background: #fff;
  border: 1px solid #e0e6f1;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.courseware-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-courseware {
  border-left: 4px solid #8b5cf6;
}

.card-lesson-plan {
  border-left: 4px solid #10b981;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9ff;
  border-bottom: 1px solid #e0e6f1;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-courseware {
  background: #eef6ff;
  color: #8b5cf6;
}

.badge-lesson-plan {
  background: #ecfdf5;
  color: #10b981;
}

.academic-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.academic-year {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.semester {
  font-size: 12px;
  color: #666;
}

.card-content {
  padding: 20px;
}

.item-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.item-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #888;
  font-weight: 500;
}

.stat-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.course-info {
  background: #f8f9ff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.course-item {
  margin-bottom: 8px;
}

.course-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.course-name {
  font-size: 14px;
  color: #333;
  font-weight: 600;
  margin-left: 8px;
}

.coverage-info {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.coverage-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.coverage-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.coverage-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.card-actions {
  padding: 16px 20px;
  background: #f8f9ff;
  border-top: 1px solid #e0e6f1;
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* 列表视图样式 */
.courseware-list {
  padding: 0;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1fr 1fr 1.5fr 2fr;
  gap: 16px;
  padding: 16px 24px;
  background: #f8f9ff;
  border-bottom: 1px solid #e0e6f1;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.list-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1fr 1fr 1.5fr 2fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background-color 0.2s ease;
}

.list-item:hover {
  background: #f8f9ff;
}

.item-cell {
  font-size: 14px;
  color: #333;
}

.item-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.item-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
}

.type-tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.tag-courseware {
  background: #eef6ff;
  color: #8b5cf6;
}

.tag-lesson-plan {
  background: #ecfdf5;
  color: #10b981;
}

.action-buttons {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.empty-desc {
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .courseware-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .list-header,
  .list-item {
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1fr 1fr 1.5fr 2fr;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .courseware-page {
    padding: 16px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .year-select,
  .semester-select,
  .type-select,
  .search-input {
    width: 100%;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .courseware-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .list-header,
  .list-item {
    display: none;
  }
  
  .courseware-list {
    display: block;
  }
  
  .list-item {
    display: block;
    margin-bottom: 16px;
    padding: 16px;
    border: 1px solid #e0e6f1;
    border-radius: 8px;
  }
  
  .item-cell {
    margin-bottom: 8px;
  }
  
  .action-buttons {
    justify-content: center;
    margin-top: 12px;
  }
}
</style>
