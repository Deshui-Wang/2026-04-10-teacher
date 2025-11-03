<template>
  <div class="digital-human-page">
    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索数字人名称" 
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
            <el-option label="2D" value="2d" />
            <el-option label="3D" value="3d" />
          </el-select>
        </div>
        <el-button @click="resetFilters" size="small">重置</el-button>
      </div>
    </div>

    <!-- 数字人列表 -->
    <div class="content-section">
      <div class="section-header">
        <h2>数字人总数：{{ filteredData.length }}</h2>
        <el-button type="primary" @click="createDigitalHuman">
          <el-icon><Plus /></el-icon>
          创建数字人
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
          <el-table-column label="数字人形象" width="120" align="center">
            <template #default="{ row }">
              <div class="avatar-cell">
                <el-image 
                  :src="row.avatar" 
                  :preview-src-list="[row.avatar]"
                  fit="cover"
                  class="avatar-image"
                  :lazy="true"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Avatar /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="name" label="数字人名称" min-width="200">
            <template #default="{ row }">
              <div class="name-cell">
                <div class="name">{{ row.name }}</div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="type" label="类型" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.type === '2d' ? 'success' : 'primary'" size="small">
                {{ row.type === '2d' ? '2D' : '3D' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="createTime" label="创建时间" width="180" align="center">
            <template #default="{ row }">
              <div class="time-cell">{{ formatTime(row.createTime) }}</div>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button 
                  type="primary" 
                  link 
                  size="small" 
                  @click="chatWithDigitalHuman(row)"
                >
                  对话
                </el-button>
                <el-button 
                  type="primary" 
                  link 
                  size="small" 
                  @click="editDigitalHuman(row)"
                >
                  编辑
                </el-button>
                <el-button 
                  type="danger" 
                  link 
                  size="small" 
                  @click="deleteDigitalHuman(row)"
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
        <div class="empty-text">暂无数字人数据</div>
        <div class="empty-desc">请检查筛选条件或创建新的数字人</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Search, Plus, Avatar } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// learning 文件夹下的图片列表（用于示例数据）
const learningImages = [
  '/pic/teacher/7b.jpeg',
  '/pic/teacher/28.png',
  '/pic/teacher/66.jpg',
  '/pic/teacher/083.png',
  '/pic/teacher/85.jpeg',
  '/pic/teacher/c5.png',
  '/pic/teacher/cc.png',
  '/pic/teacher/7b.jpeg',
  '/pic/teacher/28.png',
  '/pic/teacher/66.jpg',
  '/pic/teacher/083.png',
  '/pic/teacher/85.jpeg',
]

// 示例数据
const digitalHumans = reactive([
  {
    id: 'dh-001',
    name: '小智老师',
    type: '2d',
    avatar: learningImages[0],
    createTime: '2025-01-15 14:30:00'
  },
  {
    id: 'dh-002',
    name: 'AI助教小慧',
    type: '3d',
    avatar: learningImages[1],
    createTime: '2025-01-14 10:20:00'
  },
  {
    id: 'dh-003',
    name: '教学助手小语',
    type: '2d',
    avatar: learningImages[2],
    createTime: '2025-01-13 16:45:00'
  },
  {
    id: 'dh-004',
    name: '虚拟讲师Alice',
    type: '3d',
    avatar: learningImages[3],
    createTime: '2025-01-12 09:15:00'
  },
  {
    id: 'dh-005',
    name: '智能导师Tom',
    type: '2d',
    avatar: learningImages[4],
    createTime: '2025-01-11 11:30:00'
  },
  {
    id: 'dh-006',
    name: '数字教师Emily',
    type: '3d',
    avatar: learningImages[5],
    createTime: '2025-01-10 15:20:00'
  },
  {
    id: 'dh-007',
    name: '虚拟助教Kevin',
    type: '2d',
    avatar: learningImages[6],
    createTime: '2025-01-09 13:10:00'
  },
  {
    id: 'dh-008',
    name: 'AI导师David',
    type: '3d',
    avatar: learningImages[7],
    createTime: '2025-01-08 10:05:00'
  },
  {
    id: 'dh-009',
    name: '教学机器人Lucy',
    type: '2d',
    avatar: learningImages[8],
    createTime: '2025-01-07 14:50:00'
  },
  {
    id: 'dh-010',
    name: '智能讲师Mike',
    type: '3d',
    avatar: learningImages[9],
    createTime: '2025-01-06 16:30:00'
  },
  {
    id: 'dh-011',
    name: '虚拟教师Sarah',
    type: '2d',
    avatar: learningImages[10],
    createTime: '2025-01-05 11:20:00'
  },
  {
    id: 'dh-012',
    name: 'AI助手John',
    type: '3d',
    avatar: learningImages[11],
    createTime: '2025-01-04 09:15:00'
  }
])

// 筛选条件
const filters = reactive({
  keyword: '',
  type: ''
})

// 筛选后的数据
const filteredData = computed(() => {
  let result = digitalHumans
  
  // 关键词筛选
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(dh => 
      dh.name.toLowerCase().includes(keyword)
    )
  }
  
  // 类型筛选
  if (filters.type) {
    result = result.filter(dh => dh.type === filters.type)
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

// 创建数字人
const createDigitalHuman = () => {
  ElMessage.info('创建数字人功能待实现')
  // TODO: 实现创建数字人逻辑
}

// 对话
const chatWithDigitalHuman = (digitalHuman) => {
  ElMessage.info(`与 ${digitalHuman.name} 对话功能待实现`)
  // TODO: 实现对话逻辑
}

// 编辑数字人
const editDigitalHuman = (digitalHuman) => {
  ElMessage.info(`编辑数字人: ${digitalHuman.name}`)
  // TODO: 实现编辑数字人逻辑
}

// 删除数字人
const deleteDigitalHuman = (digitalHuman) => {
  ElMessageBox.confirm(
    `确定要删除数字人 "${digitalHuman.name}" 吗？此操作不可恢复！`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    const index = digitalHumans.findIndex(dh => dh.id === digitalHuman.id)
    if (index > -1) {
      digitalHumans.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
/* 页面容器样式 */
.digital-human-page {
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

.avatar-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e0e6f1;
}

.image-slot {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7ff;
  border-radius: 8px;
  color: #999;
}

.image-slot .el-icon {
  font-size: 24px;
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
  .digital-human-page {
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

