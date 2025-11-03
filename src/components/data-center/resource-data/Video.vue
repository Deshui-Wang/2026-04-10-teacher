<template>
  <div class="video-page">
    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索视频名称" 
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
            <el-option label="制作中" value="processing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已发布" value="published" />
            <el-option label="失败" value="failed" />
          </el-select>
        </div>
        <el-button @click="resetFilters" size="small">重置</el-button>
      </div>
    </div>

    <!-- 视频列表 -->
    <div class="content-section">
      <div class="section-header">
        <h2>视频总数：{{ filteredData.length }}</h2>
        <el-button type="primary" @click="createVideo">
          <el-icon><Plus /></el-icon>
          制作视频
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
          <el-table-column label="封面" width="120" align="center">
            <template #default="{ row }">
              <div class="cover-cell">
                <el-image 
                  :src="row.cover" 
                  :preview-src-list="[row.cover]"
                  fit="cover"
                  class="cover-image"
                  :lazy="true"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="name" label="名称" min-width="200">
            <template #default="{ row }">
              <div class="name-cell">
                <div class="name">{{ row.name }}</div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
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
                  @click="editVideo(row)"
                >
                  编辑
                </el-button>
                <el-button 
                  type="danger" 
                  link 
                  size="small" 
                  @click="deleteVideo(row)"
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
        <div class="empty-icon">🎬</div>
        <div class="empty-text">暂无视频数据</div>
        <div class="empty-desc">请检查筛选条件或制作新的视频</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Search, Plus, Picture } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// learning 文件夹下的图片列表
const learningImages = [
  '/pic/learning/0f0.jpeg',
  '/pic/learning/20.jpeg',
  '/pic/learning/212.jpg',
  '/pic/learning/24.png',
  '/pic/learning/42.jpeg',
  '/pic/learning/68.jpg',
  '/pic/learning/808.jpg',
  '/pic/learning/814.jpg',
  '/pic/learning/84.png',
  '/pic/learning/97.png',
  '/pic/learning/banner1.png',
  '/pic/learning/banner2.png',
  '/pic/learning/banner3.jpeg'
]

// 随机获取图片
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * learningImages.length)
  return learningImages[randomIndex]
}

// 示例数据
const videos = reactive([
  {
    id: 'video-001',
    name: '教学课件讲解视频 - 第一章',
    cover: getRandomImage(),
    status: 'completed',
    createTime: '2025-01-15 14:30:00',
    duration: 1200,
    size: 52428800
  },
  {
    id: 'video-002',
    name: '数学课程录制 - 函数基础',
    cover: getRandomImage(),
    status: 'published',
    createTime: '2025-01-14 10:20:00',
    duration: 2400,
    size: 104857600
  },
  {
    id: 'video-003',
    name: '英语口语练习视频',
    cover: getRandomImage(),
    status: 'processing',
    createTime: '2025-01-13 16:45:00',
    duration: 1800,
    size: 78643200
  },
  {
    id: 'video-004',
    name: '物理实验演示视频',
    cover: getRandomImage(),
    status: 'completed',
    createTime: '2025-01-12 09:15:00',
    duration: 3000,
    size: 157286400
  },
  {
    id: 'video-005',
    name: '化学实验操作指南',
    cover: getRandomImage(),
    status: 'failed',
    createTime: '2025-01-11 11:30:00',
    duration: 0,
    size: 0
  },
  {
    id: 'video-006',
    name: '历史课程讲解 - 古代文明',
    cover: getRandomImage(),
    status: 'published',
    createTime: '2025-01-10 15:20:00',
    duration: 2700,
    size: 131072000
  },
  {
    id: 'video-007',
    name: '生物课程 - 细胞结构',
    cover: getRandomImage(),
    status: 'completed',
    createTime: '2025-01-09 13:10:00',
    duration: 2100,
    size: 94371840
  },
  {
    id: 'video-008',
    name: '地理课程 - 气候变化',
    cover: getRandomImage(),
    status: 'processing',
    createTime: '2025-01-08 10:05:00',
    duration: 1500,
    size: 62914560
  },
  {
    id: 'video-009',
    name: '语文诗词赏析视频',
    cover: getRandomImage(),
    status: 'completed',
    createTime: '2025-01-07 14:50:00',
    duration: 1800,
    size: 78643200
  },
  {
    id: 'video-010',
    name: '编程基础课程 - Python入门',
    cover: getRandomImage(),
    status: 'published',
    createTime: '2025-01-06 16:30:00',
    duration: 3600,
    size: 209715200
  }
])

// 筛选条件
const filters = reactive({
  keyword: '',
  status: ''
})

// 筛选后的数据
const filteredData = computed(() => {
  let result = videos
  
  // 关键词筛选
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(v => 
      v.name.toLowerCase().includes(keyword)
    )
  }
  
  // 状态筛选
  if (filters.status) {
    result = result.filter(v => v.status === filters.status)
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
    'published': 'success',
    'failed': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status) => {
  const statusMap = {
    'processing': '制作中',
    'completed': '已完成',
    'published': '已发布',
    'failed': '失败'
  }
  return statusMap[status] || status
}

// 制作视频
const createVideo = () => {
  ElMessage.info('制作视频功能待实现')
  // TODO: 实现制作视频逻辑
}

// 编辑视频
const editVideo = (video) => {
  ElMessage.info(`编辑视频: ${video.name}`)
  // TODO: 实现编辑视频逻辑
}

// 删除视频
const deleteVideo = (video) => {
  ElMessageBox.confirm(
    `确定要删除视频 "${video.name}" 吗？此操作不可恢复！`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    const index = videos.findIndex(v => v.id === video.id)
    if (index > -1) {
      videos.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
/* 页面容器样式 */
.video-page {
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

.cover-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-image {
  width: 160px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.cover-image:hover {
  transform: scale(1.05);
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
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
  .video-page {
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
  
  .cover-image {
    width: 120px;
    height: 68px;
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

:deep(.el-image) {
  border-radius: 8px;
}
</style>

