<template>
  <div class="ability-graph-page">
    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索能力图谱名称、岗位或定位" 
            clearable
            @input="handleFilterChange"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="filter-group">
          <el-select 
            v-model="filters.category1" 
            placeholder="一级分类" 
            clearable
            @change="handleFilterChange"
            class="filter-select"
          >
            <el-option label="全部一级分类" value="" />
            <el-option 
              v-for="cat in category1List" 
              :key="cat" 
              :label="cat" 
              :value="cat" 
            />
          </el-select>
        </div>
        <div class="filter-group">
          <el-select 
            v-model="filters.status" 
            placeholder="全部状态" 
            clearable
            @change="handleFilterChange"
            class="filter-select"
          >
            <el-option label="全部状态" value="" />
            <el-option 
              v-for="status in statusList" 
              :key="status.value" 
              :label="status.label" 
              :value="status.value" 
            />
          </el-select>
        </div>
        <el-button @click="resetFilters" size="small">重置</el-button>
      </div>
    </div>

    <!-- 能力图谱列表 -->
    <div class="content-section">
      <div class="section-header">
        <h2>能力图谱总数：{{ filteredData.length }}</h2>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrap">
        <el-table 
          :data="filteredData" 
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#f5f7ff', color: '#445066', fontWeight: '600' }"
        >
          <el-table-column prop="category1" label="一级分类" width="140" align="center">
            <template #default="{ row }">
              <div class="category-cell">{{ row.category1 || '—' }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="category2" label="二级分类" width="140" align="center">
            <template #default="{ row }">
              <div class="category-cell">{{ row.category2 || '—' }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="position" label="岗位" min-width="150">
            <template #default="{ row }">
              <div class="position-cell">{{ row.position || '—' }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="location" label="定位" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="location-cell">{{ row.location || '—' }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button 
                  type="primary" 
                  link 
                  size="small" 
                  @click="enterAbilityGraph(row)"
                >
                  进入
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredData.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <div class="empty-text">暂无能力图谱数据</div>
        <div class="empty-desc">请检查筛选条件</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 示例数据
const abilityGraphs = reactive([
  {
    id: 'ag-001',
    category1: '教学能力',
    category2: '课程设计',
    position: '高中物理教师',
    location: '重点中学物理教学能力体系建设',
    status: 'active'
  },
  {
    id: 'ag-002',
    category1: '教学能力',
    category2: '教学方法',
    position: '小学数学教师',
    location: '小学低年级数学启蒙教学能力',
    status: 'active'
  },
  {
    id: 'ag-003',
    category1: '管理能力',
    category2: '班级管理',
    position: '初中班主任',
    location: '初中班级管理与学生发展指导',
    status: 'draft'
  },
  {
    id: 'ag-004',
    category1: '教学能力',
    category2: '课程设计',
    position: '高中化学教师',
    location: '高中化学实验教学能力提升',
    status: 'active'
  },
  {
    id: 'ag-005',
    category1: '科研能力',
    category2: '课题研究',
    position: '高校教师',
    location: '教育科研课题申报与研究能力',
    status: 'active'
  },
  {
    id: 'ag-006',
    category1: '管理能力',
    category2: '教学管理',
    position: '教务主任',
    location: '学校教务管理与教学质量监控',
    status: 'completed'
  },
  {
    id: 'ag-007',
    category1: '教学能力',
    category2: '教学方法',
    position: '高中英语教师',
    location: '高中英语听说教学能力培养',
    status: 'active'
  },
  {
    id: 'ag-008',
    category1: '技术能力',
    category2: '信息化教学',
    position: '信息技术教师',
    location: '教育信息化应用与创新能力',
    status: 'active'
  },
  {
    id: 'ag-009',
    category1: '管理能力',
    category2: '学生管理',
    position: '高校辅导员',
    location: '高校学生思想政治教育与日常管理',
    status: 'draft'
  },
  {
    id: 'ag-010',
    category1: '教学能力',
    category2: '课程设计',
    position: '初中语文教师',
    location: '初中语文阅读教学能力体系建设',
    status: 'active'
  },
  {
    id: 'ag-011',
    category1: '科研能力',
    category2: '论文撰写',
    position: '高校教师',
    location: '教育类学术论文写作与发表能力',
    status: 'active'
  },
  {
    id: 'ag-012',
    category1: '教学能力',
    category2: '教学方法',
    position: '高中生物教师',
    location: '高中生物实验教学与实践能力',
    status: 'completed'
  }
])

// 一级分类列表
const category1List = computed(() => {
  const categories = new Set(abilityGraphs.map(ag => ag.category1).filter(Boolean))
  return Array.from(categories).sort()
})

// 状态列表
const statusList = [
  { label: '进行中', value: 'active' },
  { label: '草稿', value: 'draft' },
  { label: '已完成', value: 'completed' },
  { label: '已暂停', value: 'paused' }
]

// 筛选条件
const filters = reactive({
  keyword: '',
  category1: '',
  status: ''
})

// 筛选后的数据
const filteredData = computed(() => {
  let result = abilityGraphs
  
  // 关键词筛选
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(ag => 
      (ag.position && ag.position.toLowerCase().includes(keyword)) ||
      (ag.location && ag.location.toLowerCase().includes(keyword)) ||
      (ag.category1 && ag.category1.toLowerCase().includes(keyword)) ||
      (ag.category2 && ag.category2.toLowerCase().includes(keyword))
    )
  }
  
  // 一级分类筛选
  if (filters.category1) {
    result = result.filter(ag => ag.category1 === filters.category1)
  }
  
  // 状态筛选
  if (filters.status) {
    result = result.filter(ag => ag.status === filters.status)
  }
  
  return result
})

// 处理筛选变化
const handleFilterChange = () => {
  // 筛选会自动通过 computed 更新
}

// 重置筛选
const resetFilters = () => {
  filters.keyword = ''
  filters.category1 = ''
  filters.status = ''
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const statusMap = {
    'active': 'success',
    'draft': 'info',
    'completed': 'success',
    'paused': 'warning'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status) => {
  const statusMap = {
    'active': '进行中',
    'draft': '草稿',
    'completed': '已完成',
    'paused': '已暂停'
  }
  return statusMap[status] || status
}

// 进入能力图谱
const enterAbilityGraph = (abilityGraph) => {
  ElMessage.info(`进入能力图谱: ${abilityGraph.position} - ${abilityGraph.location}`)
  // TODO: 实现进入能力图谱详情页面逻辑
  // 可以跳转到详情页面或打开详情弹窗
}
</script>

<style scoped>
/* 页面容器样式 */
.ability-graph-page {
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
  flex: 1 1 200px;
}

.search-input {
  width: 100%;
}

.filter-select {
  width: 100%;
}

/* 主内容区域样式 */
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

/* 表格样式 */
.table-wrap {
  padding: 24px;
}

.category-cell {
  color: #667085;
  font-size: 13px;
  font-weight: 500;
}

.position-cell {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.location-cell {
  color: #667085;
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  font-weight: 600;
  color: #667085;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ability-graph-page {
    padding: 16px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .action-buttons .el-button {
    width: 100%;
    margin: 0;
  }
}

/* Element Plus 表格样式覆盖 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background: #f5f7ff !important;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: #fafbff;
}

:deep(.el-table tbody tr:hover td) {
  background: #f0f4ff !important;
}
</style>

