<template>
  <div class="courses-page">
    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <el-input 
            v-model="filters.courseName" 
            placeholder="搜索课程名称" 
            clearable
            @input="handleFilterChange"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="content-section">
      <div class="section-header">
        <h2>课程总数：6</h2>
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
      <div v-if="viewMode === 'grid'" class="courses-grid">
        <div 
          v-for="course in filteredData" 
          :key="course.id" 
          class="course-card"
        >
          <div class="card-header">
            <div class="course-title">{{ course.name }}</div>
            <div class="completion-badge" :class="getCompletionClass(course.completion)">
              {{ course.completion }}%
            </div>
          </div>
          
          <div class="card-content">
            <div class="course-info">
              <div class="info-item">
                <span class="info-label">包含课件</span>
                <span class="info-value" @click="showCourseware(course)">
                  {{ course.coursewareCount }}个
                  <el-icon class="clickable-icon"><View /></el-icon>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">教学经验</span>
                <span class="info-value" @click="showExperience(course)">
                  查看详情
                  <el-icon class="clickable-icon"><View /></el-icon>
                </span>
              </div>
            </div>
            
            <div class="completion-bar">
              <div class="completion-label">完成度</div>
              <el-progress 
                :percentage="course.completion" 
                :color="getProgressColor(course.completion)"
                :show-text="false"
              />
              <div class="completion-text">{{ course.completion }}%</div>
            </div>
            
            <div class="rating-section">
              <div class="rating-item" @click="showStudentRatings(course)">
                <span class="rating-label">学生评价</span>
                <div class="rating-value">
                  <el-rate 
                    v-model="course.studentRating" 
                    disabled 
                    size="small"
                  />
                  <span class="rating-text">{{ course.studentRating }}分</span>
                </div>
              </div>
              <div class="rating-item" @click="showSupervisorRatings(course)">
                <span class="rating-label">督导评价</span>
                <div class="rating-value">
                  <el-rate 
                    v-model="course.supervisorRating" 
                    disabled 
                    size="small"
                  />
                  <span class="rating-text">{{ course.supervisorRating }}分</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-actions">
            <el-button type="primary" size="small" @click="viewCourse(course)">
              查看详情
            </el-button>
            <el-button size="small" @click="editCourse(course)">
              编辑
            </el-button>
            <el-button size="small" @click="manageCourse(course)">
              管理
            </el-button>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="courses-list">
        <div class="list-header">
          <div class="header-cell">课程名称</div>
          <div class="header-cell">包含课件</div>
          <div class="header-cell">教学经验</div>
          <div class="header-cell">完成度</div>
          <div class="header-cell">学生评价</div>
          <div class="header-cell">督导评价</div>
          <div class="header-cell">操作</div>
        </div>
        
        <div 
          v-for="course in filteredData" 
          :key="course.id" 
          class="list-item"
        >
          <div class="item-cell">
            <div class="course-name">{{ course.name }}</div>
          </div>
          <div class="item-cell">
            <span class="clickable-text" @click="showCourseware(course)">
              {{ course.coursewareCount }}个
              <el-icon class="clickable-icon"><View /></el-icon>
            </span>
          </div>
          <div class="item-cell">
            <span class="clickable-text" @click="showExperience(course)">
              查看详情
              <el-icon class="clickable-icon"><View /></el-icon>
            </span>
          </div>
          <div class="item-cell">
            <div class="completion-display">
              <el-progress 
                :percentage="course.completion" 
                :color="getProgressColor(course.completion)"
                :show-text="false"
                :stroke-width="6"
              />
              <span class="completion-text">{{ course.completion }}%</span>
            </div>
          </div>
          <div class="item-cell">
            <div class="rating-display-simple">
              <span class="rating-score">{{ course.studentRating }}分</span>
              <span class="rating-link" @click="showStudentRatings(course)">查看</span>
            </div>
          </div>
          <div class="item-cell">
            <div class="rating-display-simple">
              <span class="rating-score">{{ course.supervisorRating }}分</span>
              <span class="rating-link" @click="showSupervisorRatings(course)">查看</span>
            </div>
          </div>
          <div class="item-cell">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="viewCourse(course)">
                查看
              </el-button>
              <el-button size="small" @click="editCourse(course)">
                编辑
              </el-button>
              <el-button size="small" @click="manageCourse(course)">
                管理
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredData.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <div class="empty-text">暂无课程数据</div>
        <div class="empty-desc">请检查筛选条件或联系管理员</div>
      </div>
    </div>

    <!-- 课件详情弹窗 -->
    <el-dialog
      v-model="coursewareDialogVisible"
      title="课程课件"
      width="800px"
      :before-close="handleClose"
    >
      <div class="courseware-dialog-content">
        <h4>{{ currentCourse?.name }} - 关联课件</h4>
        <div class="courseware-list">
          <div 
            v-for="courseware in currentCourse?.coursewareList" 
            :key="courseware.id"
            class="courseware-item"
          >
            <div class="courseware-info">
              <div class="courseware-name">{{ courseware.name }}</div>
              <div class="courseware-desc">{{ courseware.description }}</div>
            </div>
            <div class="courseware-actions">
              <el-button size="small" @click="viewCourseware(courseware)">查看</el-button>
              <el-button size="small" @click="downloadCourseware(courseware)">下载</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 教学经验弹窗 -->
    <el-dialog
      v-model="experienceDialogVisible"
      title="教学经验"
      width="800px"
      :before-close="handleClose"
    >
      <div class="experience-dialog-content">
        <h4>{{ currentCourse?.name }} - 教学经验</h4>
        <div class="experience-list">
          <div 
            v-for="experience in currentCourse?.experienceList" 
            :key="experience.id"
            class="experience-item"
          >
            <div class="experience-title">{{ experience.title }}</div>
            <div class="experience-content">{{ experience.content }}</div>
            <div class="experience-meta">
              <span class="experience-date">{{ experience.date }}</span>
              <span class="experience-type">{{ experience.type }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 学生评价弹窗 -->
    <el-dialog
      v-model="studentRatingDialogVisible"
      title="学生评价"
      width="800px"
      :before-close="handleClose"
    >
      <div class="rating-dialog-content">
        <h4>{{ currentCourse?.name }} - 学生评价</h4>
        <div class="rating-summary">
          <div class="rating-overview">
            <div class="rating-score">{{ currentCourse?.studentRating }}</div>
            <div class="rating-label">平均评分</div>
          </div>
          <div class="rating-count">共 {{ currentCourse?.studentRatingCount }} 条评价</div>
        </div>
        <div class="rating-list">
          <div 
            v-for="rating in currentCourse?.studentRatings" 
            :key="rating.id"
            class="rating-item"
          >
            <div class="rating-header">
              <span class="student-name">{{ rating.studentName }}</span>
              <el-rate v-model="rating.score" disabled size="small" />
            </div>
            <div class="rating-comment">{{ rating.comment }}</div>
            <div class="rating-date">{{ rating.date }}</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 督导评价弹窗 -->
    <el-dialog
      v-model="supervisorRatingDialogVisible"
      title="督导评价"
      width="800px"
      :before-close="handleClose"
    >
      <div class="rating-dialog-content">
        <h4>{{ currentCourse?.name }} - 督导评价</h4>
        <div class="rating-summary">
          <div class="rating-overview">
            <div class="rating-score">{{ currentCourse?.supervisorRating }}</div>
            <div class="rating-label">平均评分</div>
          </div>
          <div class="rating-count">共 {{ currentCourse?.supervisorRatingCount }} 条评价</div>
        </div>
        <div class="rating-list">
          <div 
            v-for="rating in currentCourse?.supervisorRatings" 
            :key="rating.id"
            class="rating-item"
          >
            <div class="rating-header">
              <span class="supervisor-name">{{ rating.supervisorName }}</span>
              <el-rate v-model="rating.score" disabled size="small" />
            </div>
            <div class="rating-comment">{{ rating.comment }}</div>
            <div class="rating-date">{{ rating.date }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, View } from '@element-plus/icons-vue'

// 响应式数据
const viewMode = ref('grid')
const filters = ref({
  courseName: ''
})

// 弹窗控制
const coursewareDialogVisible = ref(false)
const experienceDialogVisible = ref(false)
const studentRatingDialogVisible = ref(false)
const supervisorRatingDialogVisible = ref(false)
const currentCourse = ref(null)

// 模拟数据
const coursesData = ref([
  {
    id: 1,
    name: '数据结构与算法',
    completion: 85,
    studentRating: 4.5,
    supervisorRating: 4.2,
    coursewareCount: 12,
    coursewareList: [
      { id: 1, name: '线性表基础', description: '线性表的基本概念和操作' },
      { id: 2, name: '栈和队列', description: '栈和队列的实现与应用' },
      { id: 3, name: '树结构', description: '二叉树和平衡树' }
    ],
    experienceList: [
      { id: 1, title: '算法教学心得', content: '通过实例讲解算法思想，学生理解更深入', date: '2024-12-01', type: '教学反思' },
      { id: 2, title: '数据结构实践', content: '结合编程实践，提高学生动手能力', date: '2024-11-15', type: '教学方法' }
    ],
    studentRatingCount: 45,
    studentRatings: [
      { id: 1, studentName: '张三', score: 5, comment: '老师讲解很清晰，课程内容很实用', date: '2024-12-10' },
      { id: 2, studentName: '李四', score: 4, comment: '课程难度适中，收获很大', date: '2024-12-08' }
    ],
    supervisorRatingCount: 3,
    supervisorRatings: [
      { id: 1, supervisorName: '王教授', score: 4, comment: '教学方法新颖，学生参与度高', date: '2024-12-05' },
      { id: 2, supervisorName: '李教授', score: 5, comment: '课程设计合理，效果良好', date: '2024-11-28' }
    ]
  },
  {
    id: 2,
    name: '软件工程导论',
    completion: 92,
    studentRating: 4.3,
    supervisorRating: 4.5,
    coursewareCount: 8,
    coursewareList: [
      { id: 4, name: '软件开发生命周期', description: 'SDLC各阶段详解' },
      { id: 5, name: '需求分析', description: '需求获取和分析方法' }
    ],
    experienceList: [
      { id: 3, title: '项目驱动教学', content: '通过实际项目案例，提高学生实践能力', date: '2024-11-20', type: '教学方法' }
    ],
    studentRatingCount: 38,
    studentRatings: [
      { id: 3, studentName: '王五', score: 4, comment: '课程内容丰富，老师很负责', date: '2024-12-12' }
    ],
    supervisorRatingCount: 2,
    supervisorRatings: [
      { id: 3, supervisorName: '赵教授', score: 4, comment: '课程体系完整，教学效果佳', date: '2024-12-01' }
    ]
  },
  {
    id: 3,
    name: '机器学习基础',
    completion: 78,
    studentRating: 4.7,
    supervisorRating: 4.3,
    coursewareCount: 15,
    coursewareList: [
      { id: 6, name: '监督学习', description: '分类和回归算法' },
      { id: 7, name: '无监督学习', description: '聚类和降维算法' }
    ],
    experienceList: [
      { id: 4, title: 'AI教学探索', content: '结合最新AI技术，更新教学内容', date: '2024-10-15', type: '教学创新' }
    ],
    studentRatingCount: 52,
    studentRatings: [
      { id: 4, studentName: '赵六', score: 5, comment: '前沿技术，老师讲解很生动', date: '2024-12-15' }
    ],
    supervisorRatingCount: 4,
    supervisorRatings: [
      { id: 4, supervisorName: '陈教授', score: 4, comment: '课程紧跟技术前沿，值得推广', date: '2024-11-30' }
    ]
  },
  {
    id: 4,
    name: '数据库系统原理',
    completion: 88,
    studentRating: 4.1,
    supervisorRating: 4.0,
    coursewareCount: 10,
    coursewareList: [
      { id: 8, name: '关系数据库', description: '关系模型和SQL语言' },
      { id: 9, name: '数据库设计', description: 'ER模型和范式理论' }
    ],
    experienceList: [
      { id: 5, title: '实践教学经验', content: '通过数据库设计项目，提高学生实践能力', date: '2024-09-20', type: '实践教学' }
    ],
    studentRatingCount: 41,
    studentRatings: [
      { id: 5, studentName: '孙七', score: 4, comment: '理论结合实践，收获很大', date: '2024-12-08' }
    ],
    supervisorRatingCount: 3,
    supervisorRatings: [
      { id: 5, supervisorName: '周教授', score: 4, comment: '课程设计合理，学生反馈良好', date: '2024-11-25' }
    ]
  },
  {
    id: 5,
    name: 'Web开发技术',
    completion: 95,
    studentRating: 4.6,
    supervisorRating: 4.4,
    coursewareCount: 18,
    coursewareList: [
      { id: 10, name: 'HTML5基础', description: 'HTML5新特性和语义化标签' },
      { id: 11, name: 'CSS3样式', description: 'CSS3动画和响应式设计' },
      { id: 12, name: 'JavaScript进阶', description: 'ES6+语法和异步编程' }
    ],
    experienceList: [
      { id: 6, title: '前端技术更新', content: '及时更新前端技术栈，保持课程先进性', date: '2024-08-15', type: '技术更新' }
    ],
    studentRatingCount: 48,
    studentRatings: [
      { id: 6, studentName: '周八', score: 5, comment: '课程很实用，老师技术很牛', date: '2024-12-14' }
    ],
    supervisorRatingCount: 2,
    supervisorRatings: [
      { id: 6, supervisorName: '吴教授', score: 4, comment: '技术前沿，教学效果好', date: '2024-11-20' }
    ]
  },
  {
    id: 6,
    name: '操作系统原理',
    completion: 82,
    studentRating: 4.2,
    supervisorRating: 4.1,
    coursewareCount: 14,
    coursewareList: [
      { id: 13, name: '进程管理', description: '进程调度和同步机制' },
      { id: 14, name: '内存管理', description: '虚拟内存和页面置换' }
    ],
    experienceList: [
      { id: 7, title: '系统编程教学', content: '通过系统调用编程，加深对操作系统的理解', date: '2024-07-10', type: '编程实践' }
    ],
    studentRatingCount: 36,
    studentRatings: [
      { id: 7, studentName: '郑九', score: 4, comment: '课程难度大但收获多', date: '2024-12-06' }
    ],
    supervisorRatingCount: 3,
    supervisorRatings: [
      { id: 7, supervisorName: '刘教授', score: 4, comment: '课程内容扎实，学生基础得到提升', date: '2024-11-15' }
    ]
  }
])

// 计算属性
const filteredData = computed(() => {
  let filtered = coursesData.value

  // 课程名称搜索
  if (filters.value.courseName) {
    const keyword = filters.value.courseName.toLowerCase()
    filtered = filtered.filter(course => 
      course.name.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

const totalCourses = computed(() => {
  return coursesData.value.length
})

const averageCompletion = computed(() => {
  const total = coursesData.value.reduce((sum, course) => sum + course.completion, 0)
  return Math.round(total / coursesData.value.length)
})

const averageRating = computed(() => {
  const total = coursesData.value.reduce((sum, course) => sum + course.studentRating, 0)
  return (total / coursesData.value.length).toFixed(1)
})

const totalCourseware = computed(() => {
  return coursesData.value.reduce((sum, course) => sum + course.coursewareCount, 0)
})

// 方法
const handleFilterChange = () => {
  // 筛选逻辑已在计算属性中处理
}

const getCompletionClass = (completion) => {
  if (completion >= 90) return 'excellent'
  if (completion >= 70) return 'good'
  if (completion >= 50) return 'average'
  return 'poor'
}

const getProgressColor = (completion) => {
  if (completion >= 90) return '#67c23a'
  if (completion >= 70) return '#e6a23c'
  if (completion >= 50) return '#f56c6c'
  return '#909399'
}

const showCourseware = (course) => {
  currentCourse.value = course
  coursewareDialogVisible.value = true
}

const showExperience = (course) => {
  currentCourse.value = course
  experienceDialogVisible.value = true
}

const showStudentRatings = (course) => {
  currentCourse.value = course
  studentRatingDialogVisible.value = true
}

const showSupervisorRatings = (course) => {
  currentCourse.value = course
  supervisorRatingDialogVisible.value = true
}

const viewCourse = (course) => {
  console.log('查看课程详情:', course)
}

const editCourse = (course) => {
  console.log('编辑课程:', course)
}

const manageCourse = (course) => {
  console.log('管理课程:', course)
}

const viewCourseware = (courseware) => {
  console.log('查看课件:', courseware)
}

const downloadCourseware = (courseware) => {
  console.log('下载课件:', courseware)
}

const handleClose = () => {
  coursewareDialogVisible.value = false
  experienceDialogVisible.value = false
  studentRatingDialogVisible.value = false
  supervisorRatingDialogVisible.value = false
  currentCourse.value = null
}

onMounted(() => {
  // 组件挂载时的初始化逻辑
})
</script>

<style scoped>
.courses-page {
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

.search-input {
  width: 300px;
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
  font-size: 22px;
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
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 24px;
}

.course-card {
  background: #fff;
  border: 1px solid #e0e6f1;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9ff;
  border-bottom: 1px solid #e0e6f1;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.completion-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.completion-badge.excellent {
  background: #ecfdf5;
  color: #10b981;
}

.completion-badge.good {
  background: #fef3c7;
  color: #f59e0b;
}

.completion-badge.average {
  background: #fef2f2;
  color: #ef4444;
}

.completion-badge.poor {
  background: #f3f4f6;
  color: #6b7280;
}

.card-content {
  padding: 20px;
}

.course-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 10px;
}

.info-label {
  font-size: 12px;
  color: #666666;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #0057ff;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.info-value:hover {
  color: #3b82f6;
}

.clickable-icon {
  font-size: 12px;
  color: #3b82f6;
}

.completion-bar {
  margin-bottom: 20px;
}

.completion-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.completion-text {
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: 4px;
}

.rating-section {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 12px;
}

.rating-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 8px;
  border-radius: 6px;
}

.rating-item:hover {
  background: #f8f9ff;
}

.rating-label {
  font-size: 14px;
  color: #0057ff;
  font-weight: 500;
}

.rating-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-text {
  font-size: 12px;
  color: #333;
  font-weight: 600;
}

.card-actions {
  padding: 16px 20px;
  background: #f8f9ff;
  border-top: 1px solid #e0e6f1;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 列表视图样式 */
.courses-list {
  padding: 0;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1.5fr 2fr;
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
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1.5fr 2fr;
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

.course-name {
  font-weight: 600;
}

.clickable-text {
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: color 0.2s ease;
}

.clickable-text:hover {
  color: #2563eb;
}

.completion-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.rating-display {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;
  padding: 4px;
  border-radius: 4px;
}

.rating-display:hover {
  background: #f8f9ff;
}

/* 新增：简化的评价显示样式 */
.rating-display-simple {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.rating-score {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.rating-link {
  color: #3b82f6;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.rating-link:hover {
  color: #2563eb;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

/* 弹窗样式 */
.courseware-dialog-content,
.experience-dialog-content,
.rating-dialog-content {
  max-height: 500px;
  overflow-y: auto;
}

.courseware-list,
.experience-list,
.rating-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.courseware-item,
.experience-item,
.rating-item {
  padding: 12px;
  border: 1px solid #e0e6f1;
  border-radius: 8px;
  background: #f8f9ff;
}

.courseware-info {
  margin-bottom: 8px;
}

.courseware-name,
.experience-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.courseware-desc,
.experience-content,
.rating-comment {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.courseware-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.experience-meta {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.rating-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9ff;
  border-radius: 8px;
}

.rating-overview {
  text-align: center;
}

.rating-score {
  font-size: 14px;
  font-weight: 600;
  color: #3b82f6;
}

.rating-count {
  font-size: 14px;
  color: #666;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.student-name,
.supervisor-name {
  font-weight: 600;
  color: #333;
}

.rating-date {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
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
  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .list-header,
  .list-item {
    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1.5fr 2fr;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .courses-page {
    padding: 16px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .list-header,
  .list-item {
    display: none;
  }
  
  .courses-list {
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
