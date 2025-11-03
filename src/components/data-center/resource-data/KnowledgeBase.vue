<template>
  <div class="knowledge-base-page">
    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索知识库名称" 
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
            v-model="filters.status" 
            placeholder="全部状态" 
            clearable
            @change="handleFilterChange"
            class="filter-select"
          >
            <el-option label="全部状态" value="" />
            <el-option label="处理中" value="processing" />
            <el-option label="已完成" value="completed" />
            <el-option label="失败" value="failed" />
          </el-select>
        </div>
        <el-button @click="resetFilters" size="small">重置</el-button>
      </div>
    </div>

    <!-- 知识库列表 -->
    <div class="content-section">
      <div class="section-header">
        <h2>知识库总数：{{ filteredData.length }}</h2>
        <el-button type="primary" @click="uploadKnowledge">
          <el-icon><Plus /></el-icon>
          上传知识库
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
          <el-table-column prop="name" label="名称" min-width="200">
            <template #default="{ row }">
              <div class="name-cell">
                <div class="name">{{ row.name }}</div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="fileSize" label="文件大小" width="120" align="center">
            <template #default="{ row }">
              <div class="size-cell">{{ formatFileSize(row.fileSize) }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="charCount" label="字符数" width="120" align="center">
            <template #default="{ row }">
              <div class="char-cell">{{ formatCharCount(row.charCount) }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="uploadTime" label="上传时间" width="180" align="center">
            <template #default="{ row }">
              <div class="time-cell">{{ formatTime(row.uploadTime) }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="100" align="center">
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
                  @click="viewKnowledge(row)"
                >
                  查看
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredData.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <div class="empty-text">暂无知识库数据</div>
        <div class="empty-desc">请检查筛选条件或上传新的知识库</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 示例数据
const knowledgeBases = reactive([
  {
    id: 'kb-001',
    name: '教学管理规范手册',
    fileSize: 2458624, // 字节
    charCount: 125680,
    uploadTime: '2025-01-15 14:30:00',
    status: 'completed'
  },
  {
    id: 'kb-002',
    name: '课程设计标准文档',
    fileSize: 1832450,
    charCount: 96450,
    uploadTime: '2025-01-14 10:20:00',
    status: 'completed'
  },
  {
    id: 'kb-003',
    name: '教学评估体系资料',
    fileSize: 4567890,
    charCount: 234560,
    uploadTime: '2025-01-13 16:45:00',
    status: 'processing'
  },
  {
    id: 'kb-004',
    name: '学生管理制度汇编',
    fileSize: 3124567,
    charCount: 156890,
    uploadTime: '2025-01-12 09:15:00',
    status: 'completed'
  },
  {
    id: 'kb-005',
    name: '教师培训教材',
    fileSize: 6789123,
    charCount: 345670,
    uploadTime: '2025-01-11 11:30:00',
    status: 'failed'
  },
  {
    id: 'kb-006',
    name: '实验室管理规范',
    fileSize: 1987654,
    charCount: 98760,
    uploadTime: '2025-01-10 15:20:00',
    status: 'completed'
  },
  {
    id: 'kb-007',
    name: '教学质量评估报告',
    fileSize: 3456789,
    charCount: 178920,
    uploadTime: '2025-01-09 13:10:00',
    status: 'completed'
  },
  {
    id: 'kb-008',
    name: '课程改革方案',
    fileSize: 2567890,
    charCount: 134560,
    uploadTime: '2025-01-08 10:05:00',
    status: 'processing'
  },
  {
    id: 'kb-009',
    name: '学术论文写作指南',
    fileSize: 1892345,
    charCount: 98780,
    uploadTime: '2025-01-07 14:50:00',
    status: 'completed'
  },
  {
    id: 'kb-010',
    name: '教学资源整合方案',
    fileSize: 4234567,
    charCount: 212340,
    uploadTime: '2025-01-06 16:30:00',
    status: 'completed'
  }
])

// 筛选条件
const filters = reactive({
  keyword: '',
  status: ''
})

// 筛选后的数据
const filteredData = computed(() => {
  let result = knowledgeBases
  
  // 关键词筛选
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(kb => 
      kb.name.toLowerCase().includes(keyword)
    )
  }
  
  // 状态筛选
  if (filters.status) {
    result = result.filter(kb => kb.status === filters.status)
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
  filters.status = ''
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// 格式化字符数
const formatCharCount = (count) => {
  if (!count) return '0'
  if (count < 1000) return count.toString()
  if (count < 10000) return (count / 1000).toFixed(1) + 'K'
  if (count < 1000000) return (count / 10000).toFixed(1) + 'W'
  return (count / 1000000).toFixed(2) + 'M'
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

// 获取状态标签类型
const getStatusTagType = (status) => {
  const statusMap = {
    'processing': 'warning',
    'completed': 'success',
    'failed': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status) => {
  const statusMap = {
    'processing': '处理中',
    'completed': '已完成',
    'failed': '失败'
  }
  return statusMap[status] || status
}

// 上传知识库
const uploadKnowledge = () => {
  ElMessage.info('上传知识库功能待实现')
  // TODO: 实现上传知识库逻辑
}

// 查看知识库
const viewKnowledge = (knowledge) => {
  ElMessage.info(`查看知识库: ${knowledge.name}`)
  // TODO: 实现查看知识库逻辑
}
</script>

<style scoped>
/* 页面容器样式 */
.knowledge-base-page {
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

.name-cell {
  display: flex;
  align-items: center;
}

.name-cell .name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.size-cell {
  color: #667085;
  font-size: 13px;
  font-weight: 500;
}

.char-cell {
  color: #667085;
  font-size: 13px;
  font-weight: 500;
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
  .knowledge-base-page {
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

