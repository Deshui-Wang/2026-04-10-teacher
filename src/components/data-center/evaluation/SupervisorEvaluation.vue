<template>
  <div class="supervisor-evaluation">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>班级：</label>
          <select v-model="filters.class" @change="handleFilterChange">
            <option value="">全部班级</option>
            <option v-for="cls in classOptions" :key="cls.value" :value="cls.value">
              {{ cls.label }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label>课程：</label>
          <select v-model="filters.course" @change="handleFilterChange">
            <option value="">全部课程</option>
            <option v-for="course in courseOptions" :key="course.value" :value="course.value">
              {{ course.label }}
            </option>
          </select>
        </div>
        <div class="filter-item search-item">
          <label>搜索：</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="搜索课程名称或班级名称"
            @input="handleSearchInput"
          />
        </div>
      </div>
    </div>

    <!-- 词云标签区域 -->
    <div class="word-cloud-section">
      <h3>高频评价词汇</h3>
      <div class="word-cloud">
        <span 
          v-for="word in wordCloudData" 
          :key="word.text" 
          class="word-tag"
          :style="{ fontSize: word.size + 'px', color: word.color }"
        >
          {{ word.text }}
        </span>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="data-table-section">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>课程名称</th>
              <th>班级名称</th>
              <th>听课类型</th>
              <th>教学态度</th>
              <th>备课情况</th>
              <th>教学熟练度</th>
              <th>教学纪律</th>
              <th>教学内容</th>
              <th>教学方法</th>
              <th>课堂情况</th>
              <th>教学效果</th>
              <th>针对性指导</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredData" :key="item.id">
              <td>{{ item.courseName }}</td>
              <td>{{ item.className }}</td>
              <td>
                <span class="listening-type" :class="item.listeningType">
                  {{ item.listeningType === 'random' ? '随机听课' : '教学检查' }}
                </span>
              </td>
              <td>
                <div class="score-simple">
                  <span class="score-value">{{ item.teachingAttitude }}</span>
                </div>
              </td>
              <td>
                <div class="score-simple">
                  <span class="score-value">{{ item.preparation }}</span>
                </div>
              </td>
              <td>
                <div class="score-simple">
                  <span class="score-value">{{ item.teachingProficiency }}</span>
                </div>
              </td>
              <td>
                <div class="score-simple">
                  <span class="score-value">{{ item.teachingDiscipline }}</span>
                </div>
              </td>
              <td>
                <div class="content-tags">
                  <span v-for="content in item.teachingContent" :key="content" class="content-tag">
                    {{ content }}
                  </span>
                </div>
              </td>
              <td>
                <div class="method-tags">
                  <span v-for="method in item.teachingMethod" :key="method" class="method-tag">
                    {{ method }}
                  </span>
                </div>
              </td>
              <td>
                <div class="classroom-info">
                  <div class="participation">参与度: {{ item.studentParticipation }}%</div>
                  <div class="discipline" :class="{ good: item.classroomDiscipline }">
                    {{ item.classroomDiscipline ? '✓' : '✗' }} 纪律良好
                  </div>
                  <div class="effect" :class="{ good: item.learningEffect }">
                    {{ item.learningEffect ? '✓' : '✗' }} 效果明显
                  </div>
                </div>
              </td>
              <td>
                <div class="effect-info">
                  <div class="target-achievement">目标达成: {{ item.targetAchievement }}%</div>
                  <div class="understanding">理解掌握: {{ item.studentUnderstanding }}%</div>
                </div>
              </td>
              <td>
                <div class="guidance-preview">
                  {{ item.targetedGuidance.length > 20 ? item.targetedGuidance.substring(0, 20) + '...' : item.targetedGuidance }}
                </div>
              </td>
              <td>
                <button class="detail-btn" @click="showDetail(item)">查看详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 督导评价详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedItem?.courseName }} - {{ selectedItem?.className }} 督导评价详情</h3>
          <button class="close-btn" @click="closeDetailModal">×</button>
        </div>
        <div class="modal-body">
          <!-- 基本信息 -->
          <div class="detail-section">
            <h4>基本信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">课程名称：</span>
                <span class="value">{{ selectedItem?.courseName }}</span>
              </div>
              <div class="info-item">
                <span class="label">班级名称：</span>
                <span class="value">{{ selectedItem?.className }}</span>
              </div>
              <div class="info-item">
                <span class="label">听课类型：</span>
                <span class="value">{{ selectedItem?.listeningType === 'random' ? '随机听课' : '教学检查' }}</span>
              </div>
              <div class="info-item">
                <span class="label">评价时间：</span>
                <span class="value">{{ selectedItem?.evaluationDate }}</span>
              </div>
            </div>
          </div>

          <!-- 评分详情 -->
          <div class="detail-section">
            <h4>评分详情</h4>
            <div class="score-grid">
              <div class="score-item">
                <span class="score-label">教学态度</span>
                <div class="score-simple-large">
                  <span class="score-value">{{ selectedItem?.teachingAttitude }}</span>
                </div>
              </div>
              <div class="score-item">
                <span class="score-label">备课情况</span>
                <div class="score-simple-large">
                  <span class="score-value">{{ selectedItem?.preparation }}</span>
                </div>
              </div>
              <div class="score-item">
                <span class="score-label">教学熟练度</span>
                <div class="score-simple-large">
                  <span class="score-value">{{ selectedItem?.teachingProficiency }}</span>
                </div>
              </div>
              <div class="score-item">
                <span class="score-label">教学纪律</span>
                <div class="score-simple-large">
                  <span class="score-value">{{ selectedItem?.teachingDiscipline }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 教学内容和方法 -->
          <div class="detail-section">
            <h4>教学内容</h4>
            <div class="content-details">
              <span v-for="content in selectedItem?.teachingContent" :key="content" class="content-tag-large">
                {{ content }}
              </span>
            </div>
          </div>

          <div class="detail-section">
            <h4>教学方法</h4>
            <div class="method-details">
              <span v-for="method in selectedItem?.teachingMethod" :key="method" class="method-tag-large">
                {{ method }}
              </span>
            </div>
          </div>

          <!-- 课堂情况 -->
          <div class="detail-section">
            <h4>课堂情况</h4>
            <div class="classroom-details">
              <div class="classroom-item">
                <span class="label">学生参与度：</span>
                <span class="value">{{ selectedItem?.studentParticipation }}%</span>
              </div>
              <div class="classroom-item">
                <span class="label">课堂纪律：</span>
                <span class="value" :class="{ good: selectedItem?.classroomDiscipline }">
                  {{ selectedItem?.classroomDiscipline ? '良好' : '需改进' }}
                </span>
              </div>
              <div class="classroom-item">
                <span class="label">学习效果：</span>
                <span class="value" :class="{ good: selectedItem?.learningEffect }">
                  {{ selectedItem?.learningEffect ? '明显' : '一般' }}
                </span>
              </div>
            </div>
          </div>

          <!-- 教学效果 -->
          <div class="detail-section">
            <h4>教学效果</h4>
            <div class="effect-details">
              <div class="effect-item">
                <span class="label">目标达成度：</span>
                <span class="value">{{ selectedItem?.targetAchievement }}%</span>
              </div>
              <div class="effect-item">
                <span class="label">学生理解掌握度：</span>
                <span class="value">{{ selectedItem?.studentUnderstanding }}%</span>
              </div>
            </div>
          </div>

          <!-- 针对性指导 -->
          <div class="detail-section">
            <h4>针对性指导</h4>
            <div class="guidance-content">
              {{ selectedItem?.targetedGuidance }}
            </div>
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
  class: '',
  course: '',
  search: ''
})

// 班级选项
const classOptions = ref([
  { value: 'class1', label: '计算机科学与技术2021-1班' },
  { value: 'class2', label: '软件工程2021-1班' },
  { value: 'class3', label: '数据科学与大数据技术2021-1班' },
  { value: 'class4', label: '人工智能2021-1班' },
  { value: 'class5', label: '网络工程2021-1班' }
])

// 课程选项
const courseOptions = ref([
  { value: 'course1', label: '数据结构与算法' },
  { value: 'course2', label: '操作系统原理' },
  { value: 'course3', label: '数据库系统原理' },
  { value: 'course4', label: '计算机网络' },
  { value: 'course5', label: '软件工程' }
])

// 词云数据
const wordCloudData = ref([
  { text: '教学认真', size: 24, color: '#3b82f6' },
  { text: '内容充实', size: 20, color: '#10b981' },
  { text: '方法得当', size: 18, color: '#f59e0b' },
  { text: '互动良好', size: 16, color: '#ef4444' },
  { text: '逻辑清晰', size: 14, color: '#8b5cf6' },
  { text: '重点突出', size: 12, color: '#06b6d4' },
  { text: '启发思维', size: 10, color: '#84cc16' },
  { text: '技术运用', size: 8, color: '#f97316' }
])

// 模拟数据
const evaluationData = ref([
  {
    id: 1,
    courseName: '数据结构与算法',
    className: '计算机科学与技术2021-1班',
    listeningType: 'random',
    teachingAttitude: 9.2,
    preparation: 8.8,
    teachingProficiency: 9.0,
    teachingDiscipline: 9.5,
    teachingContent: ['符合大纲', '重点突出', '信息量适中'],
    teachingMethod: ['启发互动', '逻辑清晰', '语言表达'],
    studentParticipation: 85,
    classroomDiscipline: true,
    learningEffect: true,
    targetAchievement: 88,
    studentUnderstanding: 82,
    targetedGuidance: '建议在算法复杂度分析部分增加更多实例讲解，帮助学生更好理解时间复杂度概念。',
    evaluationDate: '2024-01-15'
  },
  {
    id: 2,
    courseName: '操作系统原理',
    className: '软件工程2021-1班',
    listeningType: 'inspection',
    teachingAttitude: 8.5,
    preparation: 9.1,
    teachingProficiency: 8.7,
    teachingDiscipline: 9.0,
    teachingContent: ['符合大纲', '反映前沿'],
    teachingMethod: ['技术运用', '语言表达'],
    studentParticipation: 78,
    classroomDiscipline: true,
    learningEffect: false,
    targetAchievement: 82,
    studentUnderstanding: 75,
    targetedGuidance: '课堂互动可以更加活跃，建议增加小组讨论环节，提高学生参与度。',
    evaluationDate: '2024-01-20'
  },
  {
    id: 3,
    courseName: '数据库系统原理',
    className: '数据科学与大数据技术2021-1班',
    listeningType: 'random',
    teachingAttitude: 9.0,
    preparation: 8.9,
    teachingProficiency: 9.3,
    teachingDiscipline: 9.2,
    teachingContent: ['符合大纲', '重点突出', '信息量适中', '反映前沿'],
    teachingMethod: ['启发互动', '逻辑清晰', '技术运用'],
    studentParticipation: 92,
    classroomDiscipline: true,
    learningEffect: true,
    targetAchievement: 91,
    studentUnderstanding: 88,
    targetedGuidance: '教学效果很好，建议继续保持当前的教学风格，可以适当增加一些实际案例的讲解。',
    evaluationDate: '2024-01-25'
  }
])

// 弹窗状态
const showDetailModal = ref(false)
const selectedItem = ref(null)

// 筛选后的数据
const filteredData = computed(() => {
  let result = evaluationData.value

  if (filters.value.class) {
    result = result.filter(item => item.className.includes(filters.value.class))
  }

  if (filters.value.course) {
    result = result.filter(item => item.courseName.includes(filters.value.course))
  }

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    result = result.filter(item => 
      item.courseName.toLowerCase().includes(searchTerm) ||
      item.className.toLowerCase().includes(searchTerm)
    )
  }

  return result
})

// 筛选变化处理
const handleFilterChange = () => {
  // 筛选逻辑已在computed中处理
}

// 搜索输入处理
const handleSearchInput = () => {
  // 搜索逻辑已在computed中处理
}

// 显示详情
const showDetail = (item) => {
  selectedItem.value = item
  showDetailModal.value = true
}

// 关闭详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedItem.value = null
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.supervisor-evaluation {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 筛选区域 */
.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.filter-item select,
.filter-item input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
}

.search-item {
  flex: 1;
  min-width: 200px;
}

.search-item input {
  width: 100%;
}

/* 词云区域 */
.word-cloud-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.word-cloud-section h3 {
  margin: 0 0 15px 0;
  color: #374151;
  font-size: 18px;
}

.word-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.word-tag {
  padding: 6px 12px;
  background: #f3f4f6;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.word-tag:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* 数据表格 */
.data-table-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  background: #f8fafc;
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.data-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.data-table tr:hover {
  background: #f9fafb;
}

/* 听课类型 */
.listening-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.listening-type.random {
  background: #dbeafe;
  color: #1d4ed8;
}

.listening-type.inspection {
  background: #dcfce7;
  color: #166534;
}

/* 分数显示 */
.score-display {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 80px;
}

.score-value {
  font-weight: 600;
  color: #374151;
  min-width: 30px;
}

.score-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
  transition: width 0.3s ease;
}

/* 标签样式 */
.content-tags,
.method-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.content-tag,
.method-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.content-tag {
  background: #dbeafe;
  color: #1d4ed8;
}

.method-tag {
  background: #dcfce7;
  color: #166534;
}

/* 课堂情况 */
.classroom-info {
  font-size: 12px;
  line-height: 1.4;
}

.participation {
  color: #374151;
  font-weight: 500;
}

.discipline,
.effect {
  color: #6b7280;
}

.discipline.good,
.effect.good {
  color: #10b981;
}

/* 教学效果 */
.effect-info {
  font-size: 12px;
  line-height: 1.4;
}

.target-achievement,
.understanding {
  color: #374151;
  font-weight: 500;
}

/* 指导预览 */
.guidance-preview {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  max-width: 150px;
}

/* 详情按钮 */
.detail-btn {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.detail-btn:hover {
  background: #2563eb;
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
  border-radius: 8px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #374151;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.close-btn:hover {
  color: #374151;
}

.modal-body {
  padding: 20px;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #374151;
  font-size: 16px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item .label {
  font-weight: 500;
  color: #6b7280;
  margin-right: 8px;
}

.info-item .value {
  color: #374151;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.score-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-label {
  font-weight: 500;
  color: #374151;
}

.score-display-large {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-value {
  font-weight: 600;
  color: #374151;
  font-size: 16px;
  min-width: 40px;
}

.score-bar-large {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.content-details,
.method-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.content-tag-large,
.method-tag-large {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.content-tag-large {
  background: #dbeafe;
  color: #1d4ed8;
}

.method-tag-large {
  background: #dcfce7;
  color: #166534;
}

.classroom-details,
.effect-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.classroom-item,
.effect-item {
  display: flex;
  align-items: center;
}

.classroom-item .label,
.effect-item .label {
  font-weight: 500;
  color: #6b7280;
  margin-right: 8px;
}

.classroom-item .value,
.effect-item .value {
  color: #374151;
}

.classroom-item .value.good,
.effect-item .value.good {
  color: #10b981;
  font-weight: 500;
}

.guidance-content {
  background: #f8fafc;
  padding: 15px;
  border-radius: 6px;
  line-height: 1.6;
  color: #374151;
  border-left: 4px solid #3b82f6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item select,
  .filter-item input {
    min-width: auto;
  }
  
  .data-table {
    font-size: 12px;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 4px;
  }
  
  .modal-content {
    margin: 10px;
    max-height: 95vh;
  }
}

/* 简化分数显示 */
.score-simple {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.score-simple-large {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
}

.score-simple .score-value,
.score-simple-large .score-value {
  font-weight: 600;
  color: #374151;
  font-size: 16px;
}

.score-simple-large .score-value {
  font-size: 18px;
}

</style>
