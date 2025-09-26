<template>
  <div class="attendance-page">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
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
          <label>时间：</label>
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleFilterChange"
            class="date-picker"
          />
        </div>
        
        <div class="filter-group">
        </div>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="table-section">
      <el-table 
        :data="paginatedAttendance" 
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        :header-cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        :cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        border
        stripe
      >
        <el-table-column prop="class" label="班级" align="center" />
        <el-table-column prop="course" label="课程" align="center" />
        <el-table-column prop="date" label="日期" align="center" />
        <el-table-column prop="totalStudents" label="学生总数" align="center" />
        <el-table-column prop="abnormalCount" label="异常人数" align="center">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              link 
              @click="showAbnormalList(row)"
              :disabled="row.abnormalCount === 0"
            >
              {{ row.abnormalCount }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="attendanceRate" label="出勤率" align="center">
          <template #default="{ row }">
            <span :class="getAttendanceRateClass(row.attendanceRate)">
              {{ row.attendanceRate }}%
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 15, 20, 50, 100]"
          :total="filteredAttendance.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 异常人员名单弹窗 -->
    <el-dialog
      v-model="showAbnormalDialog"
      title="异常人员名单"
      width="600px"
      :before-close="closeAbnormalDialog"
    >
      <el-table 
        :data="currentAbnormalList" 
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        :cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        border
      >
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="reason" label="异常缘由" align="center">
          <template #default="{ row }">
            <el-tag :type="getReasonType(row.reason)">
              {{ row.reason }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAbnormalDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// 响应式数据
const filters = ref({
  course: '',
  class: '',
  studentName: '',
  dateRange: null
})

const currentPage = ref(1)
const pageSize = ref(15)
const showAbnormalDialog = ref(false)
const currentAbnormalList = ref([])

// 模拟数据
const courseList = ['高等数学', '线性代数']
const classList = ['计算机1班', '计算机2班', '计算机3班', '软件1班', '软件2班']

// 生成模拟出勤数据
const generateAttendanceData = () => {
  const data = []
  const studentNames = [
    '王小明', '李小红', '张伟', '刘敏', '陈强', '杨丽', '赵磊', '黄娟', '周杰', '吴雪',
    '徐涛', '孙静', '马超', '朱琳', '胡军', '郭芳', '何勇', '罗娜', '高飞', '梁燕',
    '宋波', '唐丽', '韩磊', '冯雪', '邓强', '曹敏', '彭丽', '蒋涛', '薛静', '方超',
    '石琳', '姜军', '戴芳', '夏勇', '钟娜', '汪飞', '田燕', '任波', '白丽', '崔磊',
    '史雪', '龙强', '段敏', '侯丽', '江涛', '钱静', '汤超', '尹琳', '黎军', '易芳'
  ]
  
  const reasons = ['迟到', '早退', '请假']
  
  let id = 1
  const startDate = new Date('2024-01-01')
  const endDate = new Date('2024-12-31')
  
  // 生成30天的数据
  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i * 7) // 每周生成一条数据
    
    courseList.forEach(course => {
      classList.forEach(cls => {
        // 每个班级40-45人
        const totalStudents = Math.floor(Math.random() * 6) + 40
        // 异常人数0-5个
        const abnormalCount = Math.floor(Math.random() * 6)
        
        // 生成异常人员名单
        const abnormalList = []
        if (abnormalCount > 0) {
          const selectedStudents = [...studentNames].sort(() => 0.5 - Math.random()).slice(0, abnormalCount)
          selectedStudents.forEach(name => {
            abnormalList.push({
              name: name,
              reason: reasons[Math.floor(Math.random() * reasons.length)]
            })
          })
        }
        
        const attendanceRate = Math.round(((totalStudents - abnormalCount) / totalStudents) * 100)
        
        data.push({
          id: id++,
          class: cls,
          course: course,
          date: currentDate.toISOString().split('T')[0],
          totalStudents: totalStudents,
          abnormalCount: abnormalCount,
          attendanceRate: attendanceRate,
          abnormalList: abnormalList
        })
      })
    })
  }
  
  return data.sort((a, b) => new Date(b.date) - new Date(a.date))
}

const attendanceData = ref(generateAttendanceData())

// 筛选后的数据
const filteredAttendance = computed(() => {
  let result = attendanceData.value

  // 按课程筛选
  if (filters.value.course) {
    result = result.filter(item => item.course === filters.value.course)
  }

  // 按班级筛选
  if (filters.value.class) {
    result = result.filter(item => item.class === filters.value.class)
  }

  // 按学生姓名筛选（在异常人员中查找）
  if (filters.value.studentName) {
    result = result.filter(item => 
      item.abnormalList.some(abnormal => 
        abnormal.name.includes(filters.value.studentName)
      )
    )
  }

  // 按时间范围筛选
  if (filters.value.dateRange && filters.value.dateRange.length === 2) {
    const [startDate, endDate] = filters.value.dateRange
    result = result.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
    })
  }

  return result
})

// 分页后的数据
const paginatedAttendance = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAttendance.value.slice(start, end)
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

const showAbnormalList = (row) => {
  currentAbnormalList.value = row.abnormalList
  showAbnormalDialog.value = true
}

const closeAbnormalDialog = () => {
  showAbnormalDialog.value = false
  currentAbnormalList.value = []
}

const getAttendanceRateClass = (rate) => {
  if (rate >= 95) return 'rate-excellent'
  if (rate >= 90) return 'rate-good'
  if (rate >= 80) return 'rate-average'
  return 'rate-poor'
}

const getReasonType = (reason) => {
  switch (reason) {
    case '迟到': return 'warning'
    case '早退': return 'danger'
    case '请假': return 'info'
    default: return ''
  }
}

const exportData = () => {
  // 导出功能实现
  console.log('导出出勤数据')
}

onMounted(() => {
  // 组件挂载后的初始化
})
</script>

<style scoped>
.attendance-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.course-select,
.class-select,
.student-input,
.date-picker {
  width: 180px;
}

.export-btn {
  margin-left: 10px;
}

.table-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 出勤率样式 */
.rate-excellent {
  color: #52c41a;
  font-weight: bold;
}

.rate-good {
  color: #1890ff;
  font-weight: bold;
}

.rate-average {
  color: #faad14;
  font-weight: bold;
}

.rate-poor {
  color: #ff4d4f;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    width: 100%;
    justify-content: space-between;
  }
  
  .course-select,
  .class-select,
  .student-input,
  .date-picker {
    width: 200px;
  }
}
</style>
