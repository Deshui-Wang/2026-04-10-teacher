<template>
  <div v-if="visible" class="target-setting-overlay" @click="handleOverlayClick">
    <div class="target-setting-modal" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">设置目标</h3>
        <button class="close-btn" @click="handleClose">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- 目标设定部分 -->
        <div class="form-group">
          <label class="form-label">目标名称</label>
          <input 
            v-model="formData.name"
            type="text" 
            placeholder="请输入目标名称"
            class="form-input"
            maxlength="50"
          />
          <span class="char-count">{{ formData.name.length }}/50</span>
        </div>

        <!-- 目标类型 -->
        <div class="form-group">
          <label class="form-label">目标类型</label>
          <select v-model="formData.type" class="form-select">
            <option value="">请选择目标类型</option>
            <option v-for="type in targetTypeOptions" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <!-- 截止日期 -->
        <div class="form-group">
          <label class="form-label">截止日期</label>
          <input 
            v-model="formData.deadline"
            type="date" 
            class="form-input"
          />
        </div>

        <!-- 每周投入 -->
        <div class="form-group">
          <label class="form-label">每周投入</label>
          <select v-model="formData.weeklyInput" class="form-select">
            <option v-for="hours in weeklyInputOptions" :key="hours" :value="hours">
              {{ hours }}小时
            </option>
          </select>
        </div>

        <!-- 学习方式 -->
        <div class="form-group">
          <label class="form-label">学习方式</label>
          <div class="checkbox-group">
            <label 
              v-for="method in learningMethodOptions"
              :key="method.value"
              class="checkbox-label"
            >
              <input 
                type="checkbox"
                :value="method.value"
                v-model="formData.learningMethods"
                class="checkbox-input"
              />
              <span class="checkbox-text">{{ method.label }}</span>
            </label>
          </div>
        </div>

        <!-- 关键里程碑 -->
        <div class="form-group">
          <div class="milestone-header">
            <label class="form-label">关键里程碑</label>
            <button 
              class="ai-generate-btn" 
              @click="generateMilestonesWithAI"
              :disabled="isGenerating"
            >
              <svg v-if="!isGenerating" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else class="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                  <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
                  <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
                </circle>
              </svg>
              <span>{{ isGenerating ? '生成中...' : 'AI智能里程碑生成器' }}</span>
            </button>
          </div>
          <div class="milestone-list">
            <div 
              v-for="(milestone, index) in formData.milestones"
              :key="index"
              class="milestone-item"
            >
              <input 
                v-model="milestone.name"
                type="text"
                placeholder="里程碑名称"
                class="form-input milestone-input"
              />
              <input 
                v-model="milestone.date"
                type="date"
                class="form-input milestone-date"
              />
              <button 
                class="milestone-delete-btn"
                @click="removeMilestone(index)"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <button class="add-milestone-btn" @click="addMilestone">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              添加里程碑
            </button>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button class="confirm-btn" @click="handleConfirm">确认设置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  target: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'close'])

// 目标类型选项
const targetTypeOptions = [
  { value: 'exam_score', label: '课件设计' },
  { value: 'course_completion', label: '课程完成' },
  { value: 'skill_level', label: '技能等级' },
  { value: 'project_completion', label: '项目完成' },
  { value: 'certification', label: '证书获取' },
  { value: 'other', label: '职称晋升' }
]

// 每周投入选项
const weeklyInputOptions = [2, 4, 6, 8, 10, 12, 15, 20, 25, 30]

// 学习方式选项
const learningMethodOptions = [
  { value: 'video', label: '视频课程' },
  { value: 'offline', label: '线下讲座' },
  { value: 'book', label: '书籍/讲义' },
  { value: 'practice', label: '题目/实操' },
  { value: 'project', label: ' 参与项目' }
]

// 表单数据
const formData = ref({
  name: '',
  type: '',
  deadline: '',
  weeklyInput: 6,
  learningMethods: [],
  milestones: []
})

// 初始化表单
const initForm = () => {
  if (props.target) {
    formData.value = {
      name: props.target.name || '',
      type: props.target.type || '',
      deadline: props.target.deadline || props.target.endDate || '',
      weeklyInput: props.target.weeklyInput || 6,
      learningMethods: props.target.learningMethods || [],
      milestones: props.target.milestones ? [...props.target.milestones] : []
    }
  } else {
    formData.value = {
      name: '',
      type: '',
      deadline: '',
      weeklyInput: 6,
      learningMethods: [],
      milestones: []
    }
  }
}

// 添加里程碑
const addMilestone = () => {
  formData.value.milestones.push({
    name: '',
    date: ''
  })
}

// 删除里程碑
const removeMilestone = (index) => {
  formData.value.milestones.splice(index, 1)
}

// AI生成状态
const isGenerating = ref(false)

// AI智能生成里程碑
const generateMilestonesWithAI = () => {
  // 验证必要信息
  if (!formData.value.name.trim()) {
    alert('请先填写目标名称')
    return
  }

  if (!formData.value.deadline) {
    alert('请先选择截止日期')
    return
  }

  isGenerating.value = true

  // 清空现有里程碑
  formData.value.milestones = []

  // 根据目标信息生成里程碑
  const milestones = generateMilestones()

  // 逐个显示里程碑
  let currentIndex = 0
  const interval = setInterval(() => {
    if (currentIndex < milestones.length) {
      formData.value.milestones.push(milestones[currentIndex])
      currentIndex++
    } else {
      clearInterval(interval)
      isGenerating.value = false
    }
  }, 800) // 每800ms显示一个里程碑
}

// 生成里程碑的逻辑
const generateMilestones = () => {
  const targetName = formData.value.name.trim()
  const deadline = new Date(formData.value.deadline)
  const today = new Date()
  const totalDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
  
  let milestones = []

  // 根据目标类型生成不同的里程碑
  const type = formData.value.type
  const weeklyInput = formData.value.weeklyInput || 6

  if (totalDays <= 0) {
    return [
      { name: `完成${targetName}的最终验收`, date: formatDate(deadline) }
    ]
  }

  // 根据总天数确定里程碑数量
  let milestoneCount = 3
  if (totalDays >= 90) milestoneCount = 4
  else if (totalDays >= 60) milestoneCount = 4
  else if (totalDays >= 30) milestoneCount = 3
  else milestoneCount = 2

  // 计算每个里程碑的时间间隔
  const interval = Math.floor(totalDays / (milestoneCount + 1))

  // 生成里程碑名称模板
  const milestoneTemplates = getMilestoneTemplates(type, targetName)

  for (let i = 0; i < milestoneCount; i++) {
    const daysOffset = interval * (i + 1)
    const milestoneDate = new Date(today)
    milestoneDate.setDate(today.getDate() + daysOffset)

    // 确保里程碑日期不超过截止日期
    if (milestoneDate > deadline) {
      milestoneDate.setTime(deadline.getTime())
    }

    let milestoneName = ''
    if (milestoneTemplates.length > i) {
      milestoneName = milestoneTemplates[i]
    } else {
      // 默认里程碑名称
      const progressPercent = Math.round(((i + 1) / (milestoneCount + 1)) * 100)
      milestoneName = `${targetName} - 第${i + 1}阶段完成（${progressPercent}%）`
    }

    milestones.push({
      name: milestoneName,
      date: formatDate(milestoneDate)
    })
  }

  // 添加最终里程碑
  milestones.push({
    name: `${targetName} - 最终完成`,
    date: formatDate(deadline)
  })

  return milestones
}

// 根据目标类型获取里程碑模板
const getMilestoneTemplates = (type, targetName) => {
  const templates = {
    'exam_score': [
      `${targetName} - 完成基础知识学习`,
      `${targetName} - 完成习题练习`,
      `${targetName} - 完成模拟测试`,
      `${targetName} - 达到目标分数`
    ],
    'course_completion': [
      `${targetName} - 完成课程学习（25%）`,
      `${targetName} - 完成课程学习（50%）`,
      `${targetName} - 完成课程学习（75%）`,
      `${targetName} - 完成课程学习（100%）`
    ],
    'skill_level': [
      `${targetName} - 掌握基础知识`,
      `${targetName} - 完成实践项目`,
      `${targetName} - 通过技能认证`,
      `${targetName} - 达到目标等级`
    ],
    'project_completion': [
      `${targetName} - 完成需求分析`,
      `${targetName} - 完成设计与开发`,
      `${targetName} - 完成测试与优化`,
      `${targetName} - 项目交付`
    ],
    'certification': [
      `${targetName} - 完成报名与准备`,
      `${targetName} - 完成学习计划`,
      `${targetName} - 通过模拟考试`,
      `${targetName} - 获得认证证书`
    ],
    'other': [
      `${targetName} - 完成准备工作`,
      `${targetName} - 完成中期评估`,
      `${targetName} - 完成最终评审`,
      `${targetName} - 达成目标`
    ]
  }

  return templates[type] || templates['other']
}

// 格式化日期为 YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 监听visible变化，初始化表单
watch(() => props.visible, (newVal) => {
  if (newVal) {
    initForm()
  }
}, { immediate: true })

// 处理遮罩层点击
const handleOverlayClick = () => {
  handleClose()
}

// 处理关闭
const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

// 处理确认
const handleConfirm = () => {
  // 验证表单
  if (!formData.value.name.trim()) {
    alert('请输入目标名称')
    return
  }

  if (!formData.value.type) {
    alert('请选择目标类型')
    return
  }

  if (!formData.value.deadline) {
    alert('请选择截止日期')
    return
  }

  // 验证里程碑
  const invalidMilestones = formData.value.milestones.filter(
    m => !m.name.trim() || !m.date
  )
  if (invalidMilestones.length > 0) {
    alert('请完善所有里程碑的名称和日期')
    return
  }

  emit('confirm', { ...formData.value })
  handleClose()
}
</script>

<style scoped>
.target-setting-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
}

.target-setting-modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.section-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 24px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group-half {
  flex: 1;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  text-align: left;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.char-count {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: white;
}

.checkbox-label:hover {
  border-color: #8b5cf6;
  background: #f9fafb;
}

.checkbox-input {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #8b5cf6;
}

.checkbox-label:has(.checkbox-input:checked) {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.checkbox-text {
  font-size: 14px;
  color: #374151;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ai-generate-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #8b5cf6;
  border-radius: 8px;
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-generate-btn:hover:not(:disabled) {
  background: #8b5cf6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.ai-generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-generate-btn svg {
  width: 16px;
  height: 16px;
}

.ai-generate-btn .spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.milestone-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.milestone-input {
  flex: 1;
}

.milestone-date {
  width: 180px;
  flex-shrink: 0;
}

.milestone-delete-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fee2e2;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #dc2626;
  flex-shrink: 0;
}

.milestone-delete-btn:hover {
  background: #fecaca;
  transform: scale(1.1);
}

.milestone-delete-btn svg {
  width: 16px;
  height: 16px;
}

.add-milestone-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-milestone-btn:hover {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.05);
  color: #8b5cf6;
}

.add-milestone-btn svg {
  width: 18px;
  height: 18px;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn, .confirm-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.cancel-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.confirm-btn {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: white;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .target-setting-modal {
    width: 95%;
    max-height: 95vh;
  }

  .modal-body {
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
  }

  .milestone-item {
    flex-direction: column;
    align-items: stretch;
  }

  .milestone-date {
    width: 100%;
  }

  .checkbox-group {
    flex-direction: column;
  }

  .milestone-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .ai-generate-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

