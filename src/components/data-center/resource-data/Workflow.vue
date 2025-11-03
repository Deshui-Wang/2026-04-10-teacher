<template>
  <div class="workflow-page">
    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索工作流名称" 
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
            v-model="filters.type" 
            placeholder="全部类型" 
            clearable
            @change="handleFilterChange"
            class="filter-select"
          >
            <el-option label="全部类型" value="" />
            <el-option label="审批流程" value="approval" />
            <el-option label="业务流程" value="business" />
            <el-option label="数据处理" value="data" />
            <el-option label="通知流程" value="notification" />
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
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
          </el-select>
        </div>
        <el-button @click="resetFilters" size="small">重置</el-button>
      </div>
    </div>

    <!-- 工作流列表 -->
    <div class="content-section">
      <div class="section-header">
        <h2>工作流总数：{{ filteredData.length }}</h2>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrap">
        <el-table 
          :data="filteredData" 
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#f5f7ff', color: '#445066', fontWeight: '600' }"
        >
          <el-table-column label="头像" width="80" align="center">
            <template #default="{ row }">
              <div class="avatar-cell">
                <el-avatar :size="40" :src="row.avatar">
                  <img v-if="!row.avatar" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                  <span v-else>{{ row.name.charAt(0) }}</span>
                </el-avatar>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="name" label="名称" min-width="150">
            <template #default="{ row }">
              <div class="name-cell">
                <div class="name">{{ row.name }}</div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="desc-cell">{{ row.description }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="type" label="类型" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="getTypeTagType(row.type)" size="small">
                {{ getTypeLabel(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
                {{ row.status === 'published' ? '已发布' : '草稿' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="updateTime" label="更新时间" width="180" align="center">
            <template #default="{ row }">
              <div class="time-cell">{{ formatTime(row.updateTime) }}</div>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="280" align="center" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button 
                  type="primary" 
                  link 
                  size="small" 
                  @click="editWorkflow(row)"
                >
                  编辑
                </el-button>
                <el-button 
                  v-if="row.status === 'draft'"
                  type="success" 
                  link 
                  size="small" 
                  @click="publishWorkflow(row)"
                >
                  发布
                </el-button>
                <el-button 
                  type="warning" 
                  link 
                  size="small" 
                  @click="duplicateWorkflow(row)"
                >
                  创建副本
                </el-button>
                <el-button 
                  type="danger" 
                  link 
                  size="small" 
                  @click="deleteWorkflow(row)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredData.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">暂无工作流数据</div>
        <div class="empty-desc">请检查筛选条件或创建新的工作流</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 示例数据
const workflows = reactive([
  {
    id: 'wf-001',
    name: '课程审批流程',
    description: '用于新课程创建和修改的审批流程，包含多级审批节点和审批意见记录',
    type: 'approval',
    status: 'published',
    updateTime: '2025-01-15 14:30:00',
    avatar: '',
    creator: '张老师'
  },
  {
    id: 'wf-002',
    name: '教学成果申报流程',
    description: '教师教学成果申报、审核和发布的完整业务流程，支持批量处理和批量导出',
    type: 'business',
    status: 'published',
    updateTime: '2025-01-14 10:20:00',
    avatar: '',
    creator: '李老师'
  },
  {
    id: 'wf-003',
    name: '学生成绩数据处理',
    description: '自动化处理学生成绩数据，包括成绩计算、统计分析、成绩单生成等功能',
    type: 'data',
    status: 'draft',
    updateTime: '2025-01-13 16:45:00',
    avatar: '',
    creator: '王老师'
  },
  {
    id: 'wf-004',
    name: '考试通知流程',
    description: '自动发送考试通知给学生，包括考试时间、地点、注意事项等信息的推送',
    type: 'notification',
    status: 'published',
    updateTime: '2025-01-12 09:15:00',
    avatar: '',
    creator: '赵老师'
  },
  {
    id: 'wf-005',
    name: '课件审核流程',
    description: '课件上传后的审核流程，确保课件质量和规范性，支持多级审核和驳回重审',
    type: 'approval',
    status: 'draft',
    updateTime: '2025-01-11 11:30:00',
    avatar: '',
    creator: '孙老师'
  },
  {
    id: 'wf-006',
    name: '教学资源归档流程',
    description: '将教学资源进行分类归档，自动整理和标记，便于后续检索和管理',
    type: 'business',
    status: 'published',
    updateTime: '2025-01-10 15:20:00',
    avatar: '',
    creator: '周老师'
  },
  {
    id: 'wf-007',
    name: '考勤数据处理',
    description: '处理学生考勤数据，自动统计出勤率、缺勤情况，并生成考勤报表',
    type: 'data',
    status: 'published',
    updateTime: '2025-01-09 13:10:00',
    avatar: '',
    creator: '吴老师'
  },
  {
    id: 'wf-008',
    name: '课程变更通知',
    description: '当课程信息发生变更时，自动通知相关学生和教师，包括时间、地点等变更信息',
    type: 'notification',
    status: 'draft',
    updateTime: '2025-01-08 10:05:00',
    avatar: '',
    creator: '郑老师'
  },
  {
    id: 'wf-009',
    name: '教材申请审批',
    description: '教师申请教材的审批流程，包括预算审核、采购审批、到货确认等环节',
    type: 'approval',
    status: 'published',
    updateTime: '2025-01-07 14:50:00',
    avatar: '',
    creator: '陈老师'
  },
  {
    id: 'wf-010',
    name: '教学评价统计',
    description: '自动统计和汇总教学评价数据，生成评价报告和趋势分析图表',
    type: 'data',
    status: 'published',
    updateTime: '2025-01-06 16:30:00',
    avatar: '',
    creator: '刘老师'
  }
])

// 筛选条件
const filters = reactive({
  keyword: '',
  type: '',
  status: ''
})

// 筛选后的数据
const filteredData = computed(() => {
  let result = workflows
  
  // 关键词筛选
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(w => 
      w.name.toLowerCase().includes(keyword) || 
      w.description.toLowerCase().includes(keyword)
    )
  }
  
  // 类型筛选
  if (filters.type) {
    result = result.filter(w => w.type === filters.type)
  }
  
  // 状态筛选
  if (filters.status) {
    result = result.filter(w => w.status === filters.status)
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
  filters.type = ''
  filters.status = ''
}

// 获取类型标签类型
const getTypeTagType = (type) => {
  const typeMap = {
    'approval': 'primary',
    'business': 'success',
    'data': 'warning',
    'notification': 'info'
  }
  return typeMap[type] || 'info'
}

// 获取类型标签文本
const getTypeLabel = (type) => {
  const typeMap = {
    'approval': '审批流程',
    'business': '业务流程',
    'data': '数据处理',
    'notification': '通知流程'
  }
  return typeMap[type] || type
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return '—'
  const date = new Date(timeStr)
  if (isNaN(date.getTime())) return '—'
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 创建工作流
const createWorkflow = () => {
  ElMessage.info('创建工作流功能待实现')
  // TODO: 实现创建工作流逻辑
}

// 编辑工作流
const editWorkflow = (workflow) => {
  ElMessage.info(`编辑工作流: ${workflow.name}`)
  // TODO: 实现编辑工作流逻辑
}

// 发布工作流
const publishWorkflow = (workflow) => {
  ElMessageBox.confirm(
    `确定要发布工作流 "${workflow.name}" 吗？`,
    '确认发布',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    workflow.status = 'published'
    workflow.updateTime = new Date().toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-').replace(',', '')
    ElMessage.success('发布成功')
  }).catch(() => {
    // 取消操作
  })
}

// 创建副本
const duplicateWorkflow = (workflow) => {
  ElMessageBox.confirm(
    `确定要创建工作流 "${workflow.name}" 的副本吗？`,
    '确认创建副本',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    const newWorkflow = {
      ...workflow,
      id: `wf-${String(workflows.length + 1).padStart(3, '0')}`,
      name: `${workflow.name} (副本)`,
      status: 'draft',
      updateTime: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-').replace(',', '')
    }
    workflows.push(newWorkflow)
    ElMessage.success('创建副本成功')
  }).catch(() => {
    // 取消操作
  })
}

// 删除工作流
const deleteWorkflow = (workflow) => {
  ElMessageBox.confirm(
    `确定要删除工作流 "${workflow.name}" 吗？此操作不可恢复！`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    const index = workflows.findIndex(w => w.id === workflow.id)
    if (index > -1) {
      workflows.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
/* 页面容器样式 */
.workflow-page {
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
  width: 150px;
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

.avatar-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.name-cell {
  display: flex;
  align-items: center;
}

.name-cell .name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.desc-cell {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.time-cell {
  color: #667085;
  font-size: 13px;
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
  .workflow-page {
    padding: 16px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group,
  .filter-select {
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
