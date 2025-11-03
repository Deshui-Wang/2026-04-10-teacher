<template>
  <div class="todo-list-component">
    <!-- 当前目标模块 -->
    <div class="current-target-section">
      <div class="target-header">
        <h3 class="target-section-title">进行中的目标</h3>
        <button class="set-target-btn" @click="openTargetSetting">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          设置目标
        </button>
      </div>
      
      <div class="target-list">
        <div 
          v-for="target in targets" 
          :key="target.id"
          class="target-item"
          :class="{ active: currentTargetId === target.id }"
          @click="switchTarget(target.id)"
        >
          <div class="target-info">
            <div class="target-name">{{ target.name }}</div>
            <div class="target-meta">
              <span v-if="target.type" class="target-type">{{ getTargetTypeLabel(target.type) }}</span>
              <span class="target-date">
                {{ target.deadline ? formatDate(target.deadline) : (target.startDate ? `${formatDate(target.startDate)} - ${formatDate(target.endDate)}` : '') }}
              </span>
            </div>
          </div>
          <div class="target-actions">
            <button 
              class="edit-target-btn" 
              @click.stop="editTarget(target)"
              title="编辑目标"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="target-indicator">
              <div class="indicator-circle" :class="{ active: currentTargetId === target.id }"></div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="targets.length === 0" class="empty-target">
          <p class="empty-text">暂无目标，点击右上角"设置目标"开始规划</p>
        </div>
      </div>
    </div>

    <div class="todo-header">
      <div class="progress-summary">
        <span class="progress-text">已完成 {{ completedCount }}/{{ totalCount }} 项任务</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="todo-container">
      <div v-if="tasks.length === 0" class="empty-tasks">
        <p class="empty-tasks-text">该目标暂无任务，请先添加任务</p>
      </div>
      <div v-else class="task-chain">
        <div 
          v-for="(task, index) in tasks" 
          :key="task.id"
          class="task-item"
          :class="{ 'last-task': index === tasks.length - 1 }"
        >
          
          <!-- 任务节点 -->
          <div class="task-node">
            <div class="node-circle" :class="{ completed: task.completed }">
              <span v-if="task.completed" class="checkmark">✓</span>
            </div>
            <div class="node-label">{{ task.title }}</div>
          </div>

          <!-- 子任务列表 -->
          <div class="subtasks-container">
            <div 
              v-for="subtask in task.subtasks" 
              :key="subtask.id"
              class="subtask-item"
            >
              <div class="subtask-circle" :class="{ completed: subtask.completed }">
                <span v-if="subtask.completed" class="checkmark">✓</span>
              </div>
              <div class="subtask-content">
                <span class="subtask-title">{{ subtask.title }}</span>
                <span class="subtask-status" :class="{ completed: subtask.completed }">
                  {{ subtask.completed ? '已完成' : '进行中' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置目标弹层 -->
    <TargetSetting 
      v-model:visible="showTargetSetting"
      :target="editingTarget"
      @confirm="handleTargetConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TargetSetting from './TargetSetting.vue'

// 目标管理（每个目标都有自己的任务列表）
const targets = ref([
  {
    id: 1,
    name: '成为优秀教师',
    description: '全面提升教学能力和专业素养',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    priority: 'high',
    tasks: [
      {
        id: 1,
        title: '基础能力提升',
        completed: true,
        subtasks: [
          { id: 11, title: '完成教学基础培训', completed: true },
          { id: 12, title: '通过教学能力测试', completed: true },
          { id: 13, title: '参与教学研讨会', completed: true },
          { id: 14, title: '提交教学反思报告', completed: false }
        ]
      },
      {
        id: 2,
        title: '专业技能发展',
        completed: true,
        subtasks: [
          { id: 21, title: '学习新技术工具', completed: true },
          { id: 22, title: '完成专业认证', completed: true },
          { id: 23, title: '参与行业交流', completed: false },
          { id: 24, title: '发表专业论文', completed: false }
        ]
      },
      {
        id: 3,
        title: '科研能力建设',
        completed: false,
        subtasks: [
          { id: 31, title: '申请科研项目', completed: false },
          { id: 32, title: '开展科研实验', completed: false },
          { id: 33, title: '撰写科研报告', completed: false },
          { id: 34, title: '申请专利或软著', completed: false }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'AI教学能力提升',
    description: '掌握AI教学工具，提升教学效率',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    priority: 'medium',
    tasks: [
      {
        id: 1,
        title: 'AI智能胜任力',
        completed: false,
        subtasks: [
          { id: 31, title: '掌握AI教学工具', completed: true },
          { id: 32, title: '完成智能教学设计', completed: false },
          { id: 33, title: '参与AI教学实践', completed: false },
          { id: 34, title: '通过AI能力评估', completed: false }
        ]
      }
    ]
  }
])

const currentTargetId = ref(targets.value.length > 0 ? targets.value[0].id : null)
const showTargetSetting = ref(false)
const editingTarget = ref(null)

// 当前目标信息
const currentTarget = computed(() => {
  if (!currentTargetId.value) return null
  return targets.value.find(t => t.id === currentTargetId.value) || null
})

const currentTargetName = computed(() => {
  return currentTarget.value ? currentTarget.value.name : '未设置目标'
})

// 打开设置目标弹层（新建模式）
const openTargetSetting = () => {
  editingTarget.value = null
  showTargetSetting.value = true
}

// 编辑目标
const editTarget = (target) => {
  editingTarget.value = { ...target }
  showTargetSetting.value = true
}

// 切换目标
const switchTarget = (targetId) => {
  currentTargetId.value = targetId
  // 这里可以根据不同的目标加载不同的任务数据
  // 目前使用固定的任务数据，后续可以扩展
}

// 将里程碑转换为任务节点和子任务
const convertMilestonesToTasks = (milestones, targetData) => {
  if (!milestones || milestones.length === 0) {
    return []
  }

  const baseId = Date.now()
  return milestones.map((milestone, index) => {
    // 为每个里程碑生成对应的子任务
    const subtasks = generateSubtasksForMilestone(milestone, targetData, index, baseId)
    
    return {
      id: baseId + index * 1000,
      title: milestone.name || `任务节点 ${index + 1}`,
      completed: false,
      subtasks: subtasks
    }
  })
}

// 为每个里程碑生成子任务
const generateSubtasksForMilestone = (milestone, targetData, index, baseId) => {
  const milestoneName = milestone.name || `里程碑 ${index + 1}`
  const targetName = targetData.name || '目标'
  const targetType = targetData.type || 'other'
  
  // 根据目标类型和里程碑名称生成不同的子任务模板
  const subtaskTemplates = getSubtaskTemplates(targetType, milestoneName, targetName)
  
  // 根据里程碑的进度阶段确定子任务数量
  let subtaskCount = 3
  const totalMilestones = targetData.milestones?.length || 1
  if (index === totalMilestones - 1) {
    // 最后一个里程碑，可能需要更多子任务（最终验收相关）
    subtaskCount = 4
  }
  
  return subtaskTemplates.slice(0, subtaskCount).map((template, subIndex) => ({
    id: baseId + index * 1000 + subIndex * 100,
    title: template,
    completed: false
  }))
}

// 根据目标类型获取子任务模板
const getSubtaskTemplates = (targetType, milestoneName, targetName) => {
  const commonTemplates = [
    `完成${milestoneName}的准备工作`,
    `执行${milestoneName}的核心任务`,
    `完成${milestoneName}的验收与检查`
  ]
  
  const templates = {
    'exam_score': [
      `学习${milestoneName}相关知识点`,
      `完成${milestoneName}的练习题`,
      `通过${milestoneName}的测试`,
      `巩固${milestoneName}的薄弱环节`
    ],
    'course_completion': [
      `完成${milestoneName}的视频学习`,
      `完成${milestoneName}的作业`,
      `通过${milestoneName}的考核`,
      `整理${milestoneName}的学习笔记`
    ],
    'skill_level': [
      `学习${milestoneName}的理论知识`,
      `完成${milestoneName}的实践练习`,
      `通过${milestoneName}的技能测试`,
      `总结${milestoneName}的经验心得`
    ],
    'project_completion': [
      `完成${milestoneName}的需求分析`,
      `完成${milestoneName}的开发工作`,
      `完成${milestoneName}的测试验证`,
      `完成${milestoneName}的文档整理`
    ],
    'certification': [
      `准备${milestoneName}的报名材料`,
      `完成${milestoneName}的学习计划`,
      `通过${milestoneName}的模拟考试`,
      `准备${milestoneName}的正式考试`
    ],
    'other': [
      `准备${milestoneName}相关工作`,
      `执行${milestoneName}的核心步骤`,
      `完成${milestoneName}的检查评估`,
      `整理${milestoneName}的成果材料`
    ]
  }
  
  return templates[targetType] || commonTemplates
}

// 处理目标确认
const handleTargetConfirm = (targetData) => {
  if (editingTarget.value) {
    // 编辑模式：保留原有的 tasks，只更新其他信息
    const index = targets.value.findIndex(t => t.id === editingTarget.value.id)
    if (index !== -1) {
      const existingTarget = targets.value[index]
      targets.value[index] = {
        ...existingTarget,
        ...targetData,
        // 保留原有的 tasks
        tasks: existingTarget.tasks || []
      }
    }
    editingTarget.value = null
  } else {
    // 新建模式：将里程碑转换为任务节点
    const tasks = convertMilestonesToTasks(targetData.milestones, targetData)
    const newTarget = {
      id: Date.now(),
      ...targetData,
      tasks: tasks
    }
    targets.value.push(newTarget)
    currentTargetId.value = newTarget.id
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

// 获取优先级标签
const getPriorityLabel = (priority) => {
  const labels = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return labels[priority] || '中'
}

// 获取目标类型标签
const getTargetTypeLabel = (type) => {
  const labels = {
    exam_score: '考试成绩',
    course_completion: '课程完成',
    skill_level: '技能等级',
    project_completion: '项目完成',
    certification: '证书获取',
    other: '其他'
  }
  return labels[type] || type
}

// 当前目标的任务列表（根据当前目标动态获取）
const tasks = computed(() => {
  if (!currentTarget.value) return []
  return currentTarget.value.tasks || []
})

// 计算完成进度
const completedCount = computed(() => {
  return tasks.value.reduce((count, task) => {
    return count + task.subtasks.filter(subtask => subtask.completed).length
  }, 0)
})

const totalCount = computed(() => {
  return tasks.value.reduce((count, task) => {
    return count + task.subtasks.length
  }, 0)
})

const progressPercentage = computed(() => {
  return totalCount.value > 0 ? Math.round((completedCount.value / totalCount.value) * 100) : 0
})
</script>

<style scoped>
.todo-list-component {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.todo-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 43px;
}

/* 当前目标模块 */
.current-target-section {
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.target-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.target-section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.set-target-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.set-target-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.set-target-btn svg {
  width: 16px;
  height: 16px;
}

.target-list {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.target-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.target-item:hover {
  border-color: #8b5cf6;
  background: #f9fafb;
  transform: translateX(4px);
}

.target-item.active {
  border-color: #6f74fb;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05));
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}

.target-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.target-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  text-align: left;
}

.target-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.target-type {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 11px;
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.target-date {
  color: #6b7280;
}

.target-priority {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 11px;
}

.priority-high {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.priority-medium {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.priority-low {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.target-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-target-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.1);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #8b5cf6;
  flex-shrink: 0;
}

.edit-target-btn:hover {
  background: rgba(139, 92, 246, 0.2);
  transform: scale(1.1);
}

.edit-target-btn svg {
  width: 14px;
  height: 14px;
}

.target-indicator {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.indicator-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e5e7eb;
  transition: all 0.3s ease;
}

.indicator-circle.active {
  background: #8b5cf6;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
}

.empty-target {
  padding: 24px;
  text-align: center;
}

.empty-text {
  color: #9ca3af;
  font-size: 14px;
  margin: 0;
}

.todo-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.progress-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-text {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.progress-bar {
  width: 80vh;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.todo-container {
  overflow-x: auto;
  padding-bottom: 16px;
}

.empty-tasks {
  padding: 60px 20px;
  text-align: center;
}

.empty-tasks-text {
  color: #9ca3af;
  font-size: 16px;
  margin: 0;
}

.task-chain {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  width: 100%;
  padding: 20px 20px;
}

.task-item {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  gap: 24px;
}

.task-item.last-task {
  padding-bottom: 0;
}

.task-line {
  position: absolute;
  top: 100%;
  left: 47px;
  width: 2px;
  height: 40px;
  background: linear-gradient(180deg, #8b5cf6, #e5e7eb);
  z-index: 1;
}

.task-node {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  flex-shrink: 0;
  z-index: 2;
  position: relative;
  gap: 12px;
}

.node-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
  transition: all 0.3s ease;
  margin-bottom: 12px;
}

.node-circle.completed {
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  border-color: linear-gradient(135deg, #26b2fd, #6f74fb);
}

.checkmark {
  font-size: 14px;
  font-weight: 500;
}

.node-label {
  font-size: 16px;
  font-weight: 500;
  color: #666;
  text-align: center;
  line-height: 1.4;
}

.subtasks-container {
  display: flex;
  flex-direction: row;
  gap: 12px;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
}

.subtask-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-width: fit-content;
}

.subtask-item:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.subtask-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.subtask-circle.completed {
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  border-color: linear-gradient(135deg, #26b2fd, #6f74fb);
}

.subtask-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.subtask-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  line-height: 1.4;
}

.subtask-status {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
  text-align: right;
}

.subtask-status.completed {
  color: #10b981;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .task-chain {
    gap: 30px;
  }
  
  .task-item {
    min-width: 180px;
  }
}

@media (max-width: 768px) {
  .target-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .set-target-btn {
    width: 100%;
    justify-content: center;
  }

  .target-item {
    padding: 12px;
  }

  .target-name {
    font-size: 14px;
  }

  .todo-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .progress-summary {
    width: 100%;
    justify-content: space-between;
  }
  
  .progress-bar {
    width: 150px;
  }
  
  .task-chain {
    gap: 20px;
  }
  
  .task-item {
    min-width: 160px;
  }
  
  .node-label {
    font-size: 14px;
  }
  
  .subtask-item {
    padding: 10px 12px;
  }
  
  .subtask-title {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .todo-list-component {
    padding: 16px;
  }
  
  .task-chain {
    gap: 16px;
  }
  
  .task-item {
    min-width: 140px;
  }
  
  .node-circle {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  
  .checkmark {
    font-size: 16px;
  }
  
  .node-label {
    font-size: 13px;
  }
}
</style>
