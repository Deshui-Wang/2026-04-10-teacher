<template>
  <div class="homework-management">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-controls">
        <div class="filter-item">
          <label>班级筛选：</label>
          <el-select v-model="selectedClass" placeholder="请选择班级" clearable @change="handleFilterChange">
            <el-option label="全部班级" value="" />
            <el-option 
              v-for="classItem in classOptions" 
              :key="classItem.value" 
              :label="classItem.label" 
              :value="classItem.value" 
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label>课程筛选：</label>
          <el-select v-model="selectedCourse" placeholder="请选择课程" clearable @change="handleFilterChange">
            <el-option label="全部课程" value="" />
            <el-option 
              v-for="course in courseOptions" 
              :key="course.value" 
              :label="course.label" 
              :value="course.value" 
            />
          </el-select>
        </div>
        <div class="filter-item">
          <el-button type="primary" @click="resetFilters">重置筛选</el-button>
        </div>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="table-section">
      <el-table 
        :data="filteredHomeworkList" 
        stripe 
        style="width: 100%"
        :loading="loading"
      >
        <el-table-column prop="homeworkName" label="作业名称" min-width="150" />
        <el-table-column prop="courseName" label="课程名称" min-width="120" />
        <el-table-column prop="className" label="班级名称" min-width="100" />
        <el-table-column prop="studentCount" label="学员数" width="80" align="center" />
        <el-table-column prop="completedCount" label="完成数" width="80" align="center" />
        <el-table-column prop="completionRate" label="完成率" width="100" align="center">
          <template #default="scope">
            <el-progress 
              :percentage="scope.row.completionRate" 
              :color="getProgressColor(scope.row.completionRate)"
              :show-text="false"
              style="width: 80px"
            />
            <span style="margin-left: 8px">{{ scope.row.completionRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="accuracyRate" label="正确率" width="100" align="center">
          <template #default="scope">
            <el-progress 
              :percentage="scope.row.accuracyRate" 
              :color="getProgressColor(scope.row.accuracyRate)"
              :show-text="false"
              style="width: 80px"
            />
            <span style="margin-left: 8px">{{ scope.row.accuracyRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small" 
              @click="viewHomework(scope.row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const selectedClass = ref('')
const selectedCourse = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)

// 筛选选项
const classOptions = ref([
  { value: 'class1', label: '计算机科学与技术1班' },
  { value: 'class2', label: '计算机科学与技术2班' },
  { value: 'class3', label: '软件工程1班' },
  { value: 'class4', label: '软件工程2班' },
  { value: 'class5', label: '网络工程1班' }
])

const courseOptions = ref([
  { value: 'course1', label: '数据结构与算法' },
  { value: 'course2', label: '软件工程实践' },
  { value: 'course3', label: '计算机网络实验' },
  { value: 'course4', label: '数据库原理' },
  { value: 'course5', label: '操作系统原理' }
])

// 作业列表数据
const homeworkList = ref([
  {
    id: 1,
    homeworkName: '链表基本操作实现',
    courseName: '数据结构与算法',
    courseCode: 'course1',
    className: '计算机科学与技术1班',
    classCode: 'class1',
    studentCount: 45,
    completedCount: 42,
    completionRate: 93,
    accuracyRate: 87
  },
  {
    id: 2,
    homeworkName: '快速排序算法设计',
    courseName: '数据结构与算法',
    courseCode: 'course1',
    className: '计算机科学与技术2班',
    classCode: 'class2',
    studentCount: 48,
    completedCount: 45,
    completionRate: 94,
    accuracyRate: 92
  },
  {
    id: 3,
    homeworkName: '软件需求分析文档',
    courseName: '软件工程实践',
    courseCode: 'course2',
    className: '软件工程1班',
    classCode: 'class3',
    studentCount: 40,
    completedCount: 38,
    completionRate: 95,
    accuracyRate: 89
  },
  {
    id: 4,
    homeworkName: '网络协议分析实验',
    courseName: '计算机网络实验',
    courseCode: 'course3',
    className: '网络工程1班',
    classCode: 'class5',
    studentCount: 35,
    completedCount: 32,
    completionRate: 91,
    accuracyRate: 85
  },
  {
    id: 5,
    homeworkName: '数据库设计实践',
    courseName: '数据库原理',
    courseCode: 'course4',
    className: '计算机科学与技术1班',
    classCode: 'class1',
    studentCount: 45,
    completedCount: 41,
    completionRate: 91,
    accuracyRate: 88
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 7,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  }
])

// 计算属性 - 过滤后的数据
const filteredHomeworkList = computed(() => {
  let filtered = homeworkList.value

  // 按班级筛选
  if (selectedClass.value) {
    filtered = filtered.filter(item => item.classCode === selectedClass.value)
  }

  // 按课程筛选
  if (selectedCourse.value) {
    filtered = filtered.filter(item => item.courseCode === selectedCourse.value)
  }

  // 更新总数
  totalCount.value = filtered.length

  // 分页处理
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 方法
const handleFilterChange = () => {
  currentPage.value = 1 // 重置到第一页
}

const resetFilters = () => {
  selectedClass.value = ''
  selectedCourse.value = ''
  currentPage.value = 1
}

const getProgressColor = (percentage) => {
  if (percentage >= 90) return '#67c23a'
  if (percentage >= 70) return '#e6a23c'
  return '#f56c6c'
}

const viewHomework = (row) => {
  console.log('查看作业详情:', row)
  // 这里可以跳转到作业详情页面或打开详情弹窗
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 初始化
onMounted(() => {
  totalCount.value = homeworkList.value.length
})
</script>

<style scoped>
.homework-management {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.filter-section {
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.table-section {
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.pagination-section {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-item {
    width: 100%;
    justify-content: space-between;
  }
  
  .homework-management {
    padding: 10px;
  }
}

/* 表格样式优化 */
:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: #fafafa;
  color: #333;
  font-weight: 600;
}

:deep(.el-table td) {
  padding: 12px 0;
}

:deep(.el-progress-bar__outer) {
  background-color: #f0f0f0;
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
}
</style>
