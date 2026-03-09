<template>
  <div class="teaching-resume-page">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <!-- 左侧统计数值 -->
      <div class="stats-overview">
        <div class="stat-item">
          <span class="stat-label">累计任教：</span>
          <span class="stat-value">9年</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">累计任教：</span>
          <span class="stat-value">7门课</span>
        </div>
      </div>
      
      <!-- 右侧筛选选项 -->
      <div class="filter-controls">
        <div class="filter-group">
          <label>时间：</label>
          <el-select 
            v-model="filters.timeRange" 
            placeholder="全部时间" 
            clearable 
            @change="handleFilterChange"
            class="time-select"
          >
            <el-option label="全部时间" value="" />
            <el-option label="2024年" value="2024" />
            <el-option label="2023年" value="2023" />
            <el-option label="2022年" value="2022" />
            <el-option label="2021年" value="2021" />
            <el-option label="2020年" value="2020" />
          </el-select>
        </div>
        
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
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="table-section">
      <el-table 
        :data="filteredData" 
        v-loading="loading"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#f8fafc', color: '#374151', fontWeight: '600' }"
      >
        <el-table-column prop="courseName" label="课程名称" min-width="100" />
        <el-table-column prop="classCount" label="班级数量" width="100" align="center" />
        <el-table-column prop="studentCount" label="学员总数" width="100" align="center" />
        <el-table-column prop="majors" label="覆盖专业" min-width="200">
          <template #default="{ row }">
            <el-tag 
              v-for="major in row.majors" 
              :key="major" 
              size="small" 
              class="major-tag"
            >
              {{ major }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="timeRange" label="时间年限" width="120" align="center" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small" 
              @click="showDetail(row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      width="900px"
      :before-close="closeDetailDialog"
      class="detail-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <h3 class="course-title">{{ currentDetail?.courseName }}</h3>
        </div>
      </template>
      
      <div class="detail-content" v-if="currentDetail">
        <!-- 课程基本信息 -->
        <div class="course-header">
          <div class="info-item">
            <span class="info-value">{{ currentDetail.credits || 4 }}学分</span>
          </div>
          <div class="info-item">
            <span class="info-value">{{ currentDetail.academicYear || '2023-2024学年' }}</span>
          </div>
          <div class="info-item">
            <span class="info-value green">{{ currentDetail.studentCount }}人</span>
          </div>
          <div class="info-item">
            <span class="stat-label">满意度</span>
            <span class="stat-value blue">{{ currentDetail.satisfaction || 95 }}%</span>
          </div>
          <div class="info-item">
            <span class="stat-label">通过率</span>
            <span class="stat-value blue">{{ currentDetail.passRate || 92 }}%</span>
          </div>
        </div>

        <!-- 课程简介 -->
        <div class="section">
          <div class="section-title">
            <div class="title-line"></div>
            <span>课程简介</span>
          </div>
          <p class="section-content">{{ currentDetail.courseIntro }}</p>
        </div>

        <!-- 课程内容和教学目标 - 并排显示 -->
        <div class="sections-row">
          <!-- 课程内容 -->
          <div class="section half-width">
            <div class="section-title">
              <div class="title-line content-line"></div>
              <span>课程内容</span>
            </div>
            <div class="content-list">
              <div 
                v-for="(item, index) in (currentDetail.courseContentList || getDefaultContentList(currentDetail.courseName))" 
                :key="index" 
                class="content-item"
              >
                <div class="item-number">{{ index + 1 }}</div>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- 教学目标 -->
          <div class="section half-width">
            <div class="section-title">
              <div class="title-line objective-line"></div>
              <span>教学目标</span>
            </div>
            <div class="objective-list">
              <div 
                v-for="(objective, index) in (currentDetail.teachingObjectivesList || getDefaultObjectivesList(currentDetail.courseName))" 
                :key="index" 
                class="objective-item"
              >
                <div class="check-icon">✓</div>
                <span>{{ objective }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 教学能力描述 -->
        <div class="section">
          <div class="section-title">
            <div class="title-line"></div>
            <span>教学能力描述</span>
          </div>
          <div class="ability-tags">
            <div class="tag-item">
              <div class="tag-icon">🎯</div>
              <span>理论与实践结合</span>
            </div>
            <div class="tag-item">
              <div class="tag-icon">📖</div>
              <span>案例驱动教学</span>
            </div>
            <div class="tag-item">
              <div class="tag-icon">👥</div>
              <span>互动式课堂</span>
            </div>
          </div>
          <p class="ability-description">
            采用理论与实践结合的教学方法，通过案例分析和编程实践，帮助学生深入理解课程内容，注重培养学生的逻辑思维能力和解决问题的能力，课堂互动性强，学生参与度高。
          </p>
        </div>

        <!-- 综合能力评估 -->
        <div class="section">
          <div class="section-title">
            <div class="title-line"></div>
            <span>综合能力评估</span>
          </div>
          <div class="ability-assessment">
            <div class="assessment-item">
              <div class="assessment-label">课程设计</div>
              <div class="assessment-bar">
                <div class="bar-bg">
                  <div class="bar-fill" :style="{ width: '95%' }"></div>
                </div>
                <span class="assessment-value">95%</span>
              </div>
            </div>
            <div class="assessment-item">
              <div class="assessment-label">教学方法</div>
              <div class="assessment-bar">
                <div class="bar-bg">
                  <div class="bar-fill" :style="{ width: '90%' }"></div>
                </div>
                <span class="assessment-value">90%</span>
              </div>
            </div>
            <div class="assessment-item">
              <div class="assessment-label">学生互动</div>
              <div class="assessment-bar">
                <div class="bar-bg">
                  <div class="bar-fill" :style="{ width: '88%' }"></div>
                </div>
                <span class="assessment-value">88%</span>
              </div>
            </div>
            <div class="assessment-item">
              <div class="assessment-label">知识传递</div>
              <div class="assessment-bar">
                <div class="bar-bg">
                  <div class="bar-fill" :style="{ width: '92%' }"></div>
                </div>
                <span class="assessment-value">92%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 响应式数据
const loading = ref(false)
const showDetailDialog = ref(false)
const currentDetail = ref(null)
const radarChartRef = ref(null)

// 筛选条件
const filters = ref({
  timeRange: '',
  course: ''
})

// 课程列表
const courseList = ref([
  '数据结构与算法',
  '计算机组成原理',
  '操作系统',
  '数据库系统',
  '软件工程',
  '计算机网络',
  '人工智能导论'
])

// 模拟数据
const tableData = ref([
  {
    id: 1,
    courseName: '数据结构与算法',
    classCount: 3,
    studentCount: 120,
    majors: ['计算机科学与技术', '软件工程', '数据科学与大数据技术'],
    timeRange: '2020-2024',
    credits: 4,
    academicYear: '2023-2024学年',
    satisfaction: 95,
    passRate: 92,
    courseIntro: '系统介绍数据结构的基本概念、算法设计与分析方法，培养学生理解和掌握数据结构的重要性，通过理论学习和实际编程，使学生掌握实用的数据结构及其应用。',
    abilityData: {
      teachingAbility: 90,
      studentSatisfaction: 88,
      courseDesign: 92,
      innovation: 85,
      communication: 87
    }
  },
  {
    id: 2,
    courseName: '计算机组成原理',
    classCount: 2,
    studentCount: 80,
    majors: ['计算机科学与技术', '网络工程'],
    timeRange: '2021-2024',
    credits: 3,
    academicYear: '2023-2024学年',
    satisfaction: 88,
    passRate: 90,
    courseIntro: '本课程介绍计算机硬件系统的基本组成和工作原理，包括处理器、存储器、输入输出设备等核心组件。',
    abilityData: {
      teachingAbility: 88,
      studentSatisfaction: 90,
      courseDesign: 89,
      innovation: 82,
      communication: 85
    }
  },
  {
    id: 3,
    courseName: '操作系统',
    classCount: 4,
    studentCount: 160,
    majors: ['计算机科学与技术', '软件工程', '信息安全', '网络工程'],
    timeRange: '2019-2024',
    credits: 4,
    academicYear: '2023-2024学年',
    satisfaction: 92,
    passRate: 95,
    courseIntro: '操作系统是计算机系统的核心软件，本课程介绍操作系统的基本概念、原理和实现技术。',
    abilityData: {
      teachingAbility: 92,
      studentSatisfaction: 89,
      courseDesign: 91,
      innovation: 88,
      communication: 90
    }
  },
  {
    id: 4,
    courseName: '数据库系统',
    classCount: 3,
    studentCount: 90,
    majors: ['计算机科学与技术', '软件工程', '信息管理与信息系统'],
    timeRange: '2020-2024',
    credits: 3,
    academicYear: '2023-2024学年',
    satisfaction: 89,
    passRate: 93,
    courseIntro: '数据库系统是现代信息系统的核心，本课程介绍数据库的基本理论、设计方法和应用技术。',
    abilityData: {
      teachingAbility: 89,
      studentSatisfaction: 87,
      courseDesign: 90,
      innovation: 84,
      communication: 86
    }
  },
  {
    id: 5,
    courseName: '软件工程',
    classCount: 2,
    studentCount: 80,
    majors: ['软件工程', '计算机科学与技术'],
    timeRange: '2021-2024',
    credits: 3,
    academicYear: '2023-2024学年',
    satisfaction: 94,
    passRate: 91,
    courseIntro: '软件工程是指导软件开发、维护和管理的工程学科，本课程介绍软件工程的基本原理和方法。',
    abilityData: {
      teachingAbility: 87,
      studentSatisfaction: 91,
      courseDesign: 88,
      innovation: 89,
      communication: 92
    }
  },
  {
    id: 5,
    courseName: '软件工程',
    classCount: 2,
    studentCount: 80,
    majors: ['软件工程', '计算机科学与技术'],
    timeRange: '2021-2024',
    credits: 3,
    academicYear: '2023-2024学年',
    satisfaction: 94,
    passRate: 91,
    courseIntro: '软件工程是指导软件开发、维护和管理的工程学科，本课程介绍软件工程的基本原理和方法。',
    abilityData: {
      teachingAbility: 87,
      studentSatisfaction: 91,
      courseDesign: 88,
      innovation: 89,
      communication: 92
    }
  },
  {
    id: 5,
    courseName: '软件工程',
    classCount: 2,
    studentCount: 80,
    majors: ['软件工程', '计算机科学与技术'],
    timeRange: '2021-2024',
    credits: 3,
    academicYear: '2023-2024学年',
    satisfaction: 94,
    passRate: 91,
    courseIntro: '软件工程是指导软件开发、维护和管理的工程学科，本课程介绍软件工程的基本原理和方法。',
    abilityData: {
      teachingAbility: 87,
      studentSatisfaction: 91,
      courseDesign: 88,
      innovation: 89,
      communication: 92
    }
  }
])

// 计算属性 - 过滤后的数据
const filteredData = computed(() => {
  let result = tableData.value
  
  if (filters.value.timeRange) {
    result = result.filter(item => item.timeRange.includes(filters.value.timeRange))
  }
  
  if (filters.value.course) {
    result = result.filter(item => item.courseName === filters.value.course)
  }
  
  return result
})

// 方法
const handleFilterChange = () => {
  // 筛选逻辑已在计算属性中处理
}

const showDetail = (row) => {
  currentDetail.value = row
  showDetailDialog.value = true
}

const closeDetailDialog = () => {
  showDetailDialog.value = false
  currentDetail.value = null
}

const getDefaultContentList = (courseName) => {
  const contentMap = {
    '数据结构与算法': [
      '线性表、栈、队列的基本概念和实现',
      '树和二叉树的结构与遍历方法',
      '图的存储结构和遍历算法',
      '排序和查找算法的设计与分析',
      '动态规划和贪心算法',
      '算法复杂度分析'
    ],
    '计算机组成原理': [
      '数字逻辑基础与逻辑电路设计',
      '指令系统与指令执行过程',
      'CPU的组成与工作原理',
      '存储器层次结构设计',
      '输入输出系统与接口技术'
    ],
    '操作系统': [
      '进程管理与进程调度',
      '内存管理与虚拟存储',
      '文件系统设计与实现',
      '设备管理与驱动程序',
      '并发控制与死锁处理'
    ],
    '数据库系统': [
      '关系数据模型与关系代数',
      'SQL语言与数据库查询',
      '数据库设计理论与方法',
      '事务处理与并发控制',
      '数据库安全与完整性'
    ],
    '软件工程': [
      '软件生命周期与开发模型',
      '需求分析与系统设计',
      '编码实现与测试技术',
      '软件维护与配置管理',
      '项目管理与团队协作'
    ]
  }
  return contentMap[courseName] || ['课程内容介绍']
}

const getDefaultObjectivesList = (courseName) => {
  const objectivesMap = {
    '数据结构与算法': [
      '掌握基本数据结构的特点及实现原理',
      '培养算法设计和分析能力',
      '建立抽象思维技能',
      '提升算法编程能力'
    ],
    '计算机组成原理': [
      '理解计算机硬件系统工作原理',
      '掌握计算机系统整体架构',
      '培养硬件设计思维',
      '建立系统级思考能力'
    ],
    '操作系统': [
      '深入理解操作系统原理',
      '掌握系统编程技能',
      '提高系统分析设计能力',
      '培养系统级编程思维'
    ],
    '数据库系统': [
      '掌握数据库基本概念和设计方法',
      '具备数据库应用开发能力',
      '理解数据库管理原理',
      '培养数据管理思维'
    ],
    '软件工程': [
      '培养软件工程思维',
      '掌握软件开发标准流程',
      '提高软件质量意识',
      '增强团队协作能力'
    ]
  }
  return objectivesMap[courseName] || ['培养专业技能']
}

onMounted(() => {
  // 组件挂载后的初始化
})
</script>

<style scoped>
.teaching-resume-page {
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

.time-select,
.course-select {
  width: 180px;
}

/* 表格区域样式 */
.table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.major-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}

/* 详情弹窗样式 */
.detail-dialog .el-dialog__header {
  padding: 20px 20px 0 20px;
}

.dialog-header {
  text-align: left;
}

.course-title {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
  padding: 0;
}

.detail-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px 0;
}

/* 课程内容和教学目标并排显示 */
.sections-row {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.section.half-width {
  flex: 1;
  margin-bottom: 0;
}

.section.half-width .section-title {
  margin-bottom: 16px;
}

/* 不同颜色的标题线条 */
.title-line.content-line {
  background: #3b82f6; /* 蓝色 - 课程内容 */
}

.title-line.objective-line {
  background: #10b981; /* 绿色 - 教学目标 */
}

.section {
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
}

.title-line {
  width: 4px;
  height: 16px;
  background: #2563eb;
  border-radius: 2px;
}

.section-title span {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.section-content {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  text-align: left;
}

.content-list, .objective-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-item, .objective-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.item-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #2563eb;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.check-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #22c55e;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  flex-shrink: 0;
}

.ability-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #475569;
}

.tag-icon {
  font-size: 16px;
}

.ability-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  text-align: left;
}

.ability-assessment {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assessment-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.assessment-label {
  min-width: 80px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.assessment-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-bg {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.assessment-value {
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
  min-width: 40px;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  gap: 20px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 80px;
}

.info-item .info-value {
  background: #e5e7eb;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
}

.info-value.green {
  background: #dcfce7;
  color: #166534;
}

.info-item .stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.info-item .stat-value.blue {
  font-size: 16px;
  font-weight: bold;
  color: #2563eb;
  background: #dbeafe;
  padding: 6px 12px;
  border-radius: 16px;
}

/* 移除不再需要的样式 */
.basic-info,
.performance-stats {
  display: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .stats-group {
    justify-content: center;
    gap: 30px;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .time-select,
  .course-select {
    width: 100%;
  }

  .course-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .info-item {
    min-width: auto;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .info-item .stat-label {
    margin-bottom: 0;
  }

  /* 响应式设计 - 移动端时恢复垂直布局 */
  .sections-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .section.half-width {
    flex: none;
  }
}
</style>
