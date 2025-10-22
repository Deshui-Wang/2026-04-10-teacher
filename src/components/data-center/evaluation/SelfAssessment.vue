<template>
  <div class="self-assessment-page">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>课程</label>
          <select v-model="filters.course" class="filter-select">
            <option value="">全部课程</option>
            <option value="math">高等数学</option>
            <option value="physics">大学物理</option>
            <option value="chemistry">有机化学</option>
            <option value="english">大学英语</option>
            <option value="computer">计算机基础</option>
          </select>
        </div>
        
        <div class="filter-item">
          <label>班级</label>
          <select v-model="filters.class" class="filter-select">
            <option value="">全部班级</option>
            <option value="class1">计算机21-1班</option>
            <option value="class2">计算机21-2班</option>
            <option value="class3">软件21-1班</option>
            <option value="class4">软件21-2班</option>
          </select>
        </div>
        
        <div class="filter-item">
          <label>时间</label>
          <select v-model="filters.timeRange" class="filter-select">
            <option value="">全部时间</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
            <option value="year">本年</option>
          </select>
        </div>
        
        <div class="filter-item">
          <button class="add-btn" @click="showAddModal = true">
            <i class="icon-plus"></i>
            添加自我评估
          </button>
        </div>
      </div>
    </div>

    <!-- 词云标签区域 -->
    <div class="word-cloud-section">
      <div class="section-title">常用标签</div>
      <div class="word-cloud">
        <span 
          v-for="tag in wordCloudTags" 
          :key="tag.word"
          class="word-tag"
          :class="{ active: selectedTag === tag.word }"
          @click="selectTag(tag.word)"
        >
          {{ tag.word }}
          <span class="count">({{ tag.count }})</span>
        </span>
      </div>
    </div>

    <!-- 数据列表区域 -->
    <div class="data-section">
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>标题</th>
              <th>课程名称</th>
              <th>班级名称</th>
              <th>标签</th>
              <th>总结与反思</th>
              <th>未来规划</th>
              <th>录入时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredData" :key="item.id">
              <td class="title-cell">{{ item.title }}</td>
              <td>{{ item.courseName }}</td>
              <td>{{ item.className }}</td>
              <td class="tags-cell">
                <span 
                  v-for="tag in item.tags" 
                  :key="tag" 
                  class="tag"
                >
                  {{ tag }}
                </span>
              </td>
              <td class="content-cell">{{ item.summary }}</td>
              <td class="content-cell">{{ item.planning }}</td>
              <td>{{ item.createTime }}</td>
              <td class="action-cell">
                <button class="view-btn" @click="viewItem(item)">查看</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 添加自我评估弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>添加自我评估</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>标题 *</label>
            <input 
              v-model="newAssessment.title" 
              type="text" 
              placeholder="请输入评估标题"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>选择课程 *</label>
            <select v-model="newAssessment.course" class="form-select">
              <option value="">请选择课程</option>
              <option value="math">高等数学</option>
              <option value="physics">大学物理</option>
              <option value="chemistry">有机化学</option>
              <option value="english">大学英语</option>
              <option value="computer">计算机基础</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>选择班级 *</label>
            <select v-model="newAssessment.class" class="form-select">
              <option value="">请选择班级</option>
              <option value="class1">计算机21-1班</option>
              <option value="class2">计算机21-2班</option>
              <option value="class3">软件21-1班</option>
              <option value="class4">软件21-2班</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>标签</label>
            <div class="tags-input">
              <div class="selected-tags">
                <span 
                  v-for="tag in newAssessment.tags" 
                  :key="tag" 
                  class="selected-tag"
                >
                  {{ tag }}
                  <span class="remove-tag" @click="removeTag(tag)">&times;</span>
                </span>
              </div>
              <div class="tag-suggestions">
                <span 
                  v-for="tag in defaultTags" 
                  :key="tag"
                  class="suggestion-tag"
                  @click="addTag(tag)"
                >
                  {{ tag }}
                </span>
              </div>
              <input 
                v-model="newTag"
                @keyup.enter="addCustomTag"
                placeholder="输入自定义标签后按回车"
                class="tag-input"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>总结与反思 *</label>
            <div class="textarea-group">
              <textarea 
                v-model="newAssessment.summary" 
                placeholder="请输入总结与反思内容"
                class="form-textarea"
                rows="4"
              ></textarea>
              <button class="ai-btn" @click="generateSummary">AI智能撰写</button>
            </div>
          </div>
          
          <div class="form-group">
            <label>未来规划 *</label>
            <div class="textarea-group">
              <textarea 
                v-model="newAssessment.planning" 
                placeholder="请输入未来规划内容"
                class="form-textarea"
                rows="4"
              ></textarea>
              <button class="ai-btn" @click="generatePlanning">AI智能撰写</button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="submit-btn" @click="submitAssessment">提交</button>
        </div>
      </div>
    </div>

    <!-- 查看详情弹窗 -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content view-modal" @click.stop>
        <div class="modal-header">
          <h3>自我评估详情</h3>
          <button class="close-btn" @click="closeViewModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="detail-item">
            <label>标题：</label>
            <span>{{ selectedItem.title }}</span>
          </div>
          <div class="detail-item">
            <label>课程：</label>
            <span>{{ selectedItem.courseName }}</span>
          </div>
          <div class="detail-item">
            <label>班级：</label>
            <span>{{ selectedItem.className }}</span>
          </div>
          <div class="detail-item">
            <label>标签：</label>
            <div class="tags-display">
              <span 
                v-for="tag in selectedItem.tags" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="detail-item">
            <label>总结与反思：</label>
            <div class="content-display">{{ selectedItem.summary }}</div>
          </div>
          <div class="detail-item">
            <label>未来规划：</label>
            <div class="content-display">{{ selectedItem.planning }}</div>
          </div>
          <div class="detail-item">
            <label>录入时间：</label>
            <span>{{ selectedItem.createTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 筛选条件
const filters = ref({
  course: '',
  class: '',
  timeRange: ''
})

// 词云标签数据
const wordCloudTags = ref([
  { word: '教学效果', count: 15 },
  { word: '学生反馈', count: 12 },
  { word: '课程改进', count: 10 },
  { word: '教学方法', count: 8 },
  { word: '课堂互动', count: 7 },
  { word: '知识掌握', count: 6 },
  { word: '学习兴趣', count: 5 },
  { word: '作业质量', count: 4 }
])

const selectedTag = ref('')

// 模拟数据
const assessmentData = ref([
  {
    id: 1,
    title: '高等数学第一单元教学反思',
    courseName: '高等数学',
    className: '计算机21-1班',
    tags: ['教学效果', '学生反馈', '课程改进'],
    summary: '本次教学过程中，学生对极限概念的理解存在一定困难，需要加强直观教学和实例讲解。',
    planning: '下节课将增加更多图形化演示，并准备相关练习题帮助学生巩固理解。',
    createTime: '2024-01-15 14:30'
  },
  {
    id: 2,
    title: '大学物理实验课总结',
    courseName: '大学物理',
    className: '软件21-1班',
    tags: ['教学方法', '课堂互动', '学习兴趣'],
    summary: '实验课中学生参与度较高，但部分学生操作不够规范，需要加强指导。',
    planning: '计划制作操作视频，并在课前进行安全教育和操作规范培训。',
    createTime: '2024-01-14 16:20'
  },
  {
    id: 3,
    title: '英语口语课教学评估',
    courseName: '大学英语',
    className: '计算机21-2班',
    tags: ['学生反馈', '知识掌握', '作业质量'],
    summary: '学生口语表达能力有所提升，但词汇量仍需加强，语法错误较多。',
    planning: '将增加词汇练习环节，并组织更多口语对话练习。',
    createTime: '2024-01-13 10:15'
  }
])

// 弹窗状态
const showAddModal = ref(false)
const showViewModal = ref(false)
const selectedItem = ref({})

// 新评估表单
const newAssessment = ref({
  title: '',
  course: '',
  class: '',
  tags: [],
  summary: '',
  planning: ''
})

const newTag = ref('')

// 默认标签
const defaultTags = ref([
  '教学效果', '学生反馈', '课程改进', '教学方法', 
  '课堂互动', '知识掌握', '学习兴趣', '作业质量',
  '课堂管理', '教学创新', '学生参与', '教学反思'
])

// 筛选后的数据
const filteredData = computed(() => {
  let data = assessmentData.value

  if (filters.value.course) {
    data = data.filter(item => item.courseName === getCourseName(filters.value.course))
  }

  if (filters.value.class) {
    data = data.filter(item => item.className === getClassName(filters.value.class))
  }

  if (selectedTag.value) {
    data = data.filter(item => item.tags.includes(selectedTag.value))
  }

  return data
})

// 获取课程名称
const getCourseName = (courseId) => {
  const courseMap = {
    math: '高等数学',
    physics: '大学物理',
    chemistry: '有机化学',
    english: '大学英语',
    computer: '计算机基础'
  }
  return courseMap[courseId] || ''
}

// 获取班级名称
const getClassName = (classId) => {
  const classMap = {
    class1: '计算机21-1班',
    class2: '计算机21-2班',
    class3: '软件21-1班',
    class4: '软件21-2班'
  }
  return classMap[classId] || ''
}

// 选择标签
const selectTag = (tag) => {
  selectedTag.value = selectedTag.value === tag ? '' : tag
}

// 添加标签
const addTag = (tag) => {
  if (!newAssessment.value.tags.includes(tag)) {
    newAssessment.value.tags.push(tag)
  }
}

// 移除标签
const removeTag = (tag) => {
  const index = newAssessment.value.tags.indexOf(tag)
  if (index > -1) {
    newAssessment.value.tags.splice(index, 1)
  }
}

// 添加自定义标签
const addCustomTag = () => {
  if (newTag.value.trim() && !newAssessment.value.tags.includes(newTag.value.trim())) {
    newAssessment.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

// AI智能撰写总结
const generateSummary = () => {
  newAssessment.value.summary = '基于本次教学观察，学生在课堂参与度方面表现良好，但在知识点的深度理解上还需要进一步加强。建议在今后的教学中增加更多互动环节，帮助学生更好地掌握核心概念。'
}

// AI智能撰写规划
const generatePlanning = () => {
  newAssessment.value.planning = '1. 优化教学方法和手段，提高课堂效率\n2. 加强与学生的互动交流，及时了解学习情况\n3. 完善课程内容设计，注重理论与实践结合\n4. 定期进行教学反思，持续改进教学质量'
}

// 提交评估
const submitAssessment = () => {
  if (!newAssessment.value.title || !newAssessment.value.course || !newAssessment.value.class || 
      !newAssessment.value.summary || !newAssessment.value.planning) {
    alert('请填写所有必填项')
    return
  }

  const newItem = {
    id: Date.now(),
    title: newAssessment.value.title,
    courseName: getCourseName(newAssessment.value.course),
    className: getClassName(newAssessment.value.class),
    tags: [...newAssessment.value.tags],
    summary: newAssessment.value.summary,
    planning: newAssessment.value.planning,
    createTime: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-')
  }

  assessmentData.value.unshift(newItem)
  closeModal()
  resetForm()
}

// 查看详情
const viewItem = (item) => {
  selectedItem.value = item
  showViewModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showAddModal.value = false
  resetForm()
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedItem.value = {}
}

// 重置表单
const resetForm = () => {
  newAssessment.value = {
    title: '',
    course: '',
    class: '',
    tags: [],
    summary: '',
    planning: ''
  }
  newTag.value = ''
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.self-assessment-page {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: end;
  flex-wrap: wrap;
  justify-content: space-between;
}

.filter-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  min-width: 150px;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.icon-plus::before {
  content: '+';
  font-size: 16px;
  font-weight: bold;
}

/* 词云标签区域 */
.word-cloud-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.word-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 40px;
}

.word-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.word-tag:hover {
  background: #e5e7eb;
  color: #374151;
}

.word-tag.active {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #3b82f6;
}

.count {
  font-size: 11px;
  opacity: 0.7;
}

/* 数据列表区域 */
.data-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.data-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

td {
  font-size: 13px;
  color: #6b7280;
}

.title-cell {
  font-weight: 500;
  color: #1f2937;
  max-width: 200px;
}

.tags-cell {
  max-width: 150px;
}

.content-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  background: #e0f2fe;
  color: #0277bd;
  border-radius: 12px;
  font-size: 11px;
  margin-right: 4px;
  margin-bottom: 4px;
}

.action-cell {
  white-space: nowrap;
}

.view-btn {
  padding: 6px 12px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.tags-input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px;
  min-height: 60px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 16px;
  font-size: 12px;
}

.remove-tag {
  cursor: pointer;
  font-weight: bold;
  color: #6b7280;
}

.remove-tag:hover {
  color: #dc2626;
}

.tag-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.suggestion-tag {
  padding: 4px 8px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-tag:hover {
  background: #e5e7eb;
  color: #374151;
}

.tag-input {
  border: none;
  outline: none;
  width: 100%;
  padding: 4px 0;
  font-size: 14px;
}

.textarea-group {
  position: relative;
}

.ai-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-btn:hover {
  background: #059669;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn, .submit-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.submit-btn:hover {
  background: #2563eb;
}

/* 查看详情弹窗 */
.view-modal {
  max-width: 700px;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-item label {
  font-weight: 500;
  color: #374151;
  margin-right: 8px;
}

.content-display {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
  white-space: pre-wrap;
  line-height: 1.6;
}

.tags-display {
  margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item {
    width: 100%;
  }
  
  .filter-select {
    min-width: auto;
  }
  
  .word-cloud {
    justify-content: center;
  }
  
  .data-table {
    font-size: 12px;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-body {
    padding: 16px;
  }
}
</style>
