<template>
  <div class="agent-page">
    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索智能体名称" 
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
            <el-option label="流程性" value="workflow" />
            <el-option label="角色性" value="role" />
            <el-option label="基础性" value="basic" />
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
            <el-option label="审核中" value="reviewing" />
          </el-select>
        </div>
        <el-button @click="resetFilters" size="small">重置</el-button>
      </div>
    </div>

    <!-- 智能体列表 -->
    <div class="content-section">
      <div class="section-header">
        <h2>智能体总数：{{ filteredData.length }}</h2>
        <el-button type="primary" @click="createAgent">
          <el-icon><Plus /></el-icon>
          创建智能体
        </el-button>
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
                  <template #default v-if="!row.avatar">
                    <span>{{ row.name.charAt(0) }}</span>
                  </template>
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
              <el-tag :type="getStatusTagType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
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
                  @click="editAgent(row)"
                >
                  编辑
                </el-button>
                <el-button 
                  v-if="row.status === 'draft'"
                  type="success" 
                  link 
                  size="small" 
                  @click="publishAgent(row)"
                >
                  发布
                </el-button>
                <el-button 
                  v-if="row.status === 'reviewing'"
                  type="warning" 
                  link 
                  size="small" 
                  @click="viewReviewStatus(row)"
                >
                  查看审核
                </el-button>
                <el-button 
                  type="danger" 
                  link 
                  size="small" 
                  @click="deleteAgent(row)"
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
        <div class="empty-icon">🤖</div>
        <div class="empty-text">暂无智能体数据</div>
        <div class="empty-desc">请检查筛选条件或创建新的智能体</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 示例图片列表（用于示例数据）
const avatarImages = [
  '/pic/teacher/7b.jpeg',
  '/pic/teacher/28.png',
  '/pic/teacher/66.jpg',
  '/pic/teacher/083.png',
  '/pic/teacher/85.jpeg',
  '/pic/teacher/c5.png',
  '/pic/teacher/cc.png',
  '/pic/teacher/person/bjlg.png',
  '/pic/teacher/person/bjhangtian.png',
  '/pic/teacher/person/bjdx.png',
  '/pic/teacher/person/ai zhishiku.png'
]

// 示例数据
const agents = reactive([
  {
    id: 'agent-001',
    name: '课程教学助手',
    description: '智能化的课程教学辅助智能体，能够协助教师进行课程设计、教学计划制定和学生学习情况分析',
    type: 'workflow',
    status: 'published',
    updateTime: '2025-01-15 14:30:00',
    avatar: avatarImages[0]
  },
  {
    id: 'agent-002',
    name: '学生辅导员',
    description: '专业的角色性智能体，模拟真实的学生辅导员角色，能够提供学习指导、心理辅导和生涯规划建议',
    type: 'role',
    status: 'published',
    updateTime: '2025-01-14 10:20:00',
    avatar: avatarImages[1]
  },
  {
    id: 'agent-003',
    name: '知识库管理',
    description: '基础性智能体，用于管理和维护教学知识库，支持知识分类、检索和更新功能',
    type: 'basic',
    status: 'draft',
    updateTime: '2025-01-13 16:45:00',
    avatar: avatarImages[2]
  },
  {
    id: 'agent-004',
    name: '作业批改流程',
    description: '流程性智能体，自动化处理作业批改流程，包括作业收集、评分、反馈生成等环节',
    type: 'workflow',
    status: 'reviewing',
    updateTime: '2025-01-12 09:15:00',
    avatar: avatarImages[3]
  },
  {
    id: 'agent-005',
    name: 'AI教师角色',
    description: '角色性智能体，模拟资深教师的教学风格和教学方法，能够进行个性化教学和答疑解惑',
    type: 'role',
    status: 'published',
    updateTime: '2025-01-11 11:30:00',
    avatar: avatarImages[4]
  },
  {
    id: 'agent-006',
    name: '数据分析引擎',
    description: '基础性智能体，专门用于教学数据的收集、分析和可视化展示，支持多维度数据挖掘',
    type: 'basic',
    status: 'draft',
    updateTime: '2025-01-10 15:20:00',
    avatar: avatarImages[5]
  },
  {
    id: 'agent-007',
    name: '考试安排助手',
    description: '流程性智能体，自动化处理考试安排流程，包括时间规划、场地分配、监考安排等功能',
    type: 'workflow',
    status: 'published',
    updateTime: '2025-01-09 13:10:00',
    avatar: avatarImages[6]
  },
  {
    id: 'agent-008',
    name: '科研导师',
    description: '角色性智能体，扮演科研导师角色，协助学生进行科研项目规划、论文写作指导和学术交流',
    type: 'role',
    status: 'reviewing',
    updateTime: '2025-01-08 10:05:00',
    avatar: avatarImages[7]
  },
  {
    id: 'agent-009',
    name: '文件管理系统',
    description: '基础性智能体，提供教学文件的存储、分类、检索和版本管理功能，支持多种文件格式',
    type: 'basic',
    status: 'published',
    updateTime: '2025-01-07 14:50:00',
    avatar: avatarImages[8]
  },
  {
    id: 'agent-010',
    name: '课程评估流程',
    description: '流程性智能体，自动化处理课程评估流程，包括评估表生成、数据收集、结果分析和报告生成',
    type: 'workflow',
    status: 'published',
    updateTime: '2025-01-06 16:30:00',
    avatar: avatarImages[9]
  },
  {
    id: 'agent-011',
    name: '学习伙伴',
    description: '角色性智能体，作为学生的学习伙伴，提供陪伴式学习、学习计划制定和学习方法指导',
    type: 'role',
    status: 'draft',
    updateTime: '2025-01-05 12:15:00',
    avatar: avatarImages[10]
  },
  {
    id: 'agent-012',
    name: 'API接口服务',
    description: '基础性智能体，提供标准化的API接口服务，支持与其他教学系统的集成和数据交换',
    type: 'basic',
    status: 'published',
    updateTime: '2025-01-04 14:20:00',
    avatar: avatarImages[0]
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
  let result = agents
  
  // 关键词筛选
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(a => 
      a.name.toLowerCase().includes(keyword) || 
      a.description.toLowerCase().includes(keyword)
    )
  }
  
  // 类型筛选
  if (filters.type) {
    result = result.filter(a => a.type === filters.type)
  }
  
  // 状态筛选
  if (filters.status) {
    result = result.filter(a => a.status === filters.status)
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
    'workflow': 'primary',
    'role': 'success',
    'basic': 'info'
  }
  return typeMap[type] || 'info'
}

// 获取类型标签文本
const getTypeLabel = (type) => {
  const typeMap = {
    'workflow': '流程性',
    'role': '角色性',
    'basic': '基础性'
  }
  return typeMap[type] || type
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const statusMap = {
    'draft': 'info',
    'published': 'success',
    'reviewing': 'warning'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status) => {
  const statusMap = {
    'draft': '草稿',
    'published': '已发布',
    'reviewing': '审核中'
  }
  return statusMap[status] || status
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

// 创建智能体
const createAgent = () => {
  ElMessage.info('创建智能体功能待实现')
  // TODO: 实现创建智能体逻辑
}

// 编辑智能体
const editAgent = (agent) => {
  ElMessage.info(`编辑智能体: ${agent.name}`)
  // TODO: 实现编辑智能体逻辑
}

// 发布智能体
const publishAgent = (agent) => {
  ElMessageBox.confirm(
    `确定要发布智能体 "${agent.name}" 吗？发布后将会进入审核流程。`,
    '确认发布',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    agent.status = 'reviewing'
    agent.updateTime = new Date().toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-').replace(',', '')
    ElMessage.success('提交审核成功，等待审核中')
  }).catch(() => {
    // 取消操作
  })
}

// 查看审核状态
const viewReviewStatus = (agent) => {
  ElMessage.info(`智能体 "${agent.name}" 正在审核中，请稍候`)
  // TODO: 实现查看审核状态逻辑
}

// 删除智能体
const deleteAgent = (agent) => {
  ElMessageBox.confirm(
    `确定要删除智能体 "${agent.name}" 吗？此操作不可恢复！`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    const index = agents.findIndex(a => a.id === agent.id)
    if (index > -1) {
      agents.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
/* 页面容器样式 */
.agent-page {
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
  .agent-page {
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

