<template>
  <div class="knowledge-graph-page">
    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索知识图谱名称" 
            clearable
            @input="handleFilterChange"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <el-button @click="resetFilters" size="small">重置</el-button>
      </div>
    </div>

    <!-- 知识图谱列表 -->
    <div class="content-section">
      <div class="section-header">
        <h2>知识图谱总数：{{ filteredData.length }}</h2>
        <el-button type="primary" @click="createKnowledgeGraph">
          <el-icon><Plus /></el-icon>
          制作知识图谱
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
          
          <el-table-column prop="description" label="简介" min-width="250" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="description-cell">{{ row.description || '—' }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="nodeCount" label="节点数" width="120" align="center">
            <template #default="{ row }">
              <div class="count-cell">{{ formatCount(row.nodeCount) }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="relationCount" label="关系数" width="120" align="center">
            <template #default="{ row }">
              <div class="count-cell">{{ formatCount(row.relationCount) }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="createTime" label="制作时间" width="180" align="center">
            <template #default="{ row }">
              <div class="time-cell">{{ formatTime(row.createTime) }}</div>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button 
                  type="primary" 
                  link 
                  size="small" 
                  @click="editKnowledgeGraph(row)"
                >
                  编辑
                </el-button>
                <el-button 
                  type="danger" 
                  link 
                  size="small" 
                  @click="deleteKnowledgeGraph(row)"
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
        <div class="empty-icon">🕸️</div>
        <div class="empty-text">暂无知识图谱数据</div>
        <div class="empty-desc">请检查筛选条件或制作新的知识图谱</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 示例数据
const knowledgeGraphs = reactive([
  {
    id: 'kg-001',
    name: '数学知识图谱',
    description: '涵盖小学数学到高中数学的核心概念、公式和定理，包含数与代数、几何、概率统计等主要领域',
    nodeCount: 156,
    relationCount: 342,
    createTime: '2025-01-15 14:30:00'
  },
  {
    id: 'kg-002',
    name: '物理知识图谱',
    description: '包含力学、热学、电磁学、光学、原子物理等各个分支的核心知识点和相互关系',
    nodeCount: 234,
    relationCount: 512,
    createTime: '2025-01-14 10:20:00'
  },
  {
    id: 'kg-003',
    name: '化学知识图谱',
    description: '涵盖有机化学、无机化学、物理化学的基础概念、反应机理和物质关系',
    nodeCount: 189,
    relationCount: 428,
    createTime: '2025-01-13 16:45:00'
  },
  {
    id: 'kg-004',
    name: '生物知识图谱',
    description: '包含细胞生物学、遗传学、生态学、进化论等生命科学领域的关键概念',
    nodeCount: 278,
    relationCount: 645,
    createTime: '2025-01-12 09:15:00'
  },
  {
    id: 'kg-005',
    name: '历史知识图谱',
    description: '中国古代史、世界史的时间线、重要事件、人物关系和文化传承脉络',
    nodeCount: 312,
    relationCount: 789,
    createTime: '2025-01-11 11:30:00'
  },
  {
    id: 'kg-006',
    name: '地理知识图谱',
    description: '自然地理和人文地理的核心概念，包括地形、气候、人口、经济等内容',
    nodeCount: 198,
    relationCount: 456,
    createTime: '2025-01-10 15:20:00'
  },
  {
    id: 'kg-007',
    name: '语文知识图谱',
    description: '古诗词、文言文、现代文学的知识体系，包括作者、作品、文学流派等关系',
    nodeCount: 267,
    relationCount: 623,
    createTime: '2025-01-09 13:10:00'
  },
  {
    id: 'kg-008',
    name: '英语知识图谱',
    description: '语法体系、词汇网络、语言技能等英语学习的知识结构和关联关系',
    nodeCount: 445,
    relationCount: 1023,
    createTime: '2025-01-08 10:05:00'
  },
  {
    id: 'kg-009',
    name: '编程知识图谱',
    description: '编程语言、算法、数据结构、设计模式等计算机科学的核心知识体系',
    nodeCount: 356,
    relationCount: 892,
    createTime: '2025-01-07 14:50:00'
  },
  {
    id: 'kg-010',
    name: '综合学科知识图谱',
    description: '跨学科知识整合，包含STEM教育的核心概念和学科间的关联关系',
    nodeCount: 523,
    relationCount: 1245,
    createTime: '2025-01-06 16:30:00'
  }
])

// 筛选条件
const filters = reactive({
  keyword: ''
})

// 筛选后的数据
const filteredData = computed(() => {
  let result = knowledgeGraphs
  
  // 关键词筛选
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(kg => 
      kg.name.toLowerCase().includes(keyword) ||
      (kg.description && kg.description.toLowerCase().includes(keyword))
    )
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
}

// 格式化数量
const formatCount = (count) => {
  if (!count && count !== 0) return '0'
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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

// 制作知识图谱
const createKnowledgeGraph = () => {
  ElMessage.info('制作知识图谱功能待实现')
  // TODO: 实现制作知识图谱逻辑
}

// 编辑知识图谱
const editKnowledgeGraph = (knowledgeGraph) => {
  ElMessage.info(`编辑知识图谱: ${knowledgeGraph.name}`)
  // TODO: 实现编辑知识图谱逻辑
}

// 删除知识图谱
const deleteKnowledgeGraph = (knowledgeGraph) => {
  ElMessageBox.confirm(
    `确定要删除知识图谱 "${knowledgeGraph.name}" 吗？此操作不可恢复！`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    const index = knowledgeGraphs.findIndex(kg => kg.id === knowledgeGraph.id)
    if (index > -1) {
      knowledgeGraphs.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
/* 页面容器样式 */
.knowledge-graph-page {
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

.description-cell {
  color: #667085;
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.count-cell {
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
  .knowledge-graph-page {
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
