<template>
  <div class="dubbing-page">
    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索配音名称" 
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

    <!-- 配音列表 -->
    <div class="content-section">
      <div class="section-header">
        <h2>配音总数：{{ filteredData.length }}</h2>
        <el-button type="primary" @click="createDubbing">
          <el-icon><Plus /></el-icon>
          制作配音
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
                  @click="editDubbing(row)"
                >
                  编辑
                </el-button>
                <el-button 
                  type="danger" 
                  link 
                  size="small" 
                  @click="deleteDubbing(row)"
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
        <div class="empty-icon">🎙️</div>
        <div class="empty-text">暂无配音数据</div>
        <div class="empty-desc">请检查筛选条件或制作新的配音</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 示例数据
const dubbings = reactive([
  {
    id: 'dubbing-001',
    name: '数学课程配音 - 第一章',
    createTime: '2025-01-15 14:30:00'
  },
  {
    id: 'dubbing-002',
    name: '英语口语教学配音',
    createTime: '2025-01-14 10:20:00'
  },
  {
    id: 'dubbing-003',
    name: '物理实验解说配音',
    createTime: '2025-01-13 16:45:00'
  },
  {
    id: 'dubbing-004',
    name: '化学课程讲解配音',
    createTime: '2025-01-12 09:15:00'
  },
  {
    id: 'dubbing-005',
    name: '历史课程旁白配音',
    createTime: '2025-01-11 11:30:00'
  },
  {
    id: 'dubbing-006',
    name: '生物课程配音 - 细胞结构',
    createTime: '2025-01-10 15:20:00'
  },
  {
    id: 'dubbing-007',
    name: '地理课程解说配音',
    createTime: '2025-01-09 13:10:00'
  },
  {
    id: 'dubbing-008',
    name: '语文诗词朗诵配音',
    createTime: '2025-01-08 10:05:00'
  },
  {
    id: 'dubbing-009',
    name: '编程基础课程配音',
    createTime: '2025-01-07 14:50:00'
  },
  {
    id: 'dubbing-010',
    name: '教学课件背景音乐配音',
    createTime: '2025-01-06 16:30:00'
  }
])

// 筛选条件
const filters = reactive({
  keyword: ''
})

// 筛选后的数据
const filteredData = computed(() => {
  let result = dubbings
  
  // 关键词筛选
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(d => 
      d.name.toLowerCase().includes(keyword)
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

// 制作配音
const createDubbing = () => {
  ElMessage.info('制作配音功能待实现')
  // TODO: 实现制作配音逻辑
}

// 编辑配音
const editDubbing = (dubbing) => {
  ElMessage.info(`编辑配音: ${dubbing.name}`)
  // TODO: 实现编辑配音逻辑
}

// 删除配音
const deleteDubbing = (dubbing) => {
  ElMessageBox.confirm(
    `确定要删除配音 "${dubbing.name}" 吗？此操作不可恢复！`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    const index = dubbings.findIndex(d => d.id === dubbing.id)
    if (index > -1) {
      dubbings.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
/* 页面容器样式 */
.dubbing-page {
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
  .dubbing-page {
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

