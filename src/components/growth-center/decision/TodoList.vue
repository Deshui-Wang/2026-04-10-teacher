<template>
  <div class="todo-list-component">
    <!-- 成长曲线区域 -->
    <div class="growth-curve-section">
      <!-- 顶部三栏信息 -->
      <div class="curve-top-row">
        <!-- 左侧：成长称号卡片 -->
        <div class="title-card">
          <div class="title-card-header">
            <div class="title-info">
              <h4 class="title-name">双师型教师</h4>
              <p class="title-desc">即将达成成长目标！</p>
            </div>
            <div class="title-icon">🏆</div>
          </div>
          <div class="title-progress">
            <div class="title-progress-bar">
              <div class="title-progress-fill" style="width: 71%"></div>
            </div>
            <span class="title-progress-label">成长进度 71%</span>
          </div>
        </div>

        <!-- 中间：本周活动 -->
        <div class="activity-card">
          <div class="activity-header">
            <span class="activity-label">本周活动</span>
            <span class="activity-trend up">↑ +12%</span>
          </div>
          <div class="activity-count">
            <span class="count-num">6</span>
            <span class="count-unit">项活动</span>
          </div>
          <div class="activity-dots">
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="activity-completion">完成度 60%</div>
        </div>

        <!-- 右侧：智能回顾 -->
        <div class="ai-review-card">
          <div class="ai-review-header">
            <span class="ai-icon">🤖</span>
            <span class="ai-title">智能回顾</span>
          </div>
          <p class="ai-content">
            基于你最近一周的表现，AI为你生成了如下建议：
            <span class="highlight">📊 本周表现分析：</span>
            <span class="suggestion">❶ 开始一个微型项目来巩固知识</span>
            <span class="suggestion">❷ 尝试学习新的技术栈</span>
          </p>
        </div>
      </div>

      <!-- 成长轨迹曲线 -->
      <div class="curve-chart-area">
        <h4 class="curve-chart-title">成长轨迹</h4>
        <div class="curve-chart-wrapper">
          <!-- SVG 曲线 -->
          <svg class="curve-svg" viewBox="0 0 1000 220" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#8b5cf6"/>
                <stop offset="40%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#22c55e"/>
              </linearGradient>
            </defs>
            <path 
              d="M 30 180 Q 100 175 180 160 T 350 140 T 500 115 T 650 85 T 800 55 T 970 30" 
              fill="none" 
              stroke="url(#curveGradient)" 
              stroke-width="6"
              stroke-linecap="round"
            />
          </svg>

          <!-- 成长节点标记 -->
          <div class="milestone-nodes">
            <!-- 节点1：学习起步 -->
            <div class="milestone-node" style="left: 10%; top: 63%;">
              <div class="node-circle purple">01</div>
              <div class="node-label above">
                <span class="node-title">学习起步</span>
                <span class="node-desc">课程学习，建立知识体系</span>
              </div>
            </div>

            <!-- 节点2：技能提升 -->
            <div class="milestone-node" style="left: 28%; top: 64%;">
              <div class="node-circle blue">02</div>
              <div class="node-label below">
                <span class="node-title">技能提升</span>
                <span class="node-desc">掌握核心技能，开始实践应用</span>
              </div>
            </div>

            <!-- 节点3：项目实践 -->
            <div class="milestone-node" style="left: 44%; top: 46%;">
              <div class="node-circle blue">03</div>
              <div class="node-label above">
                <span class="node-title">项目实践</span>
                <span class="node-desc">参与实际项目，积累经验</span>
              </div>
            </div>

            <!-- 节点4：能力突破 -->
            <div class="milestone-node" style="left: 60%; top: 42%;">
              <div class="node-circle teal">04</div>
              <div class="node-label below">
                <span class="node-title">能力突破</span>
                <span class="node-desc">突破瓶颈，实现能力跃升</span>
              </div>
            </div>

            <!-- 节点5：专业发展 -->
            <div class="milestone-node" style="left: 72%; top: 22%;">
              <div class="node-circle teal">05</div>
              <div class="node-label above">
                <span class="node-title">专业发展</span>
                <span class="node-desc">建立专业优势，成为领域专家</span>
              </div>
            </div>

            <!-- 节点6：成就达成 -->
            <div class="milestone-node" style="left: 89%; top: 9%;">
              <div class="node-circle green">06</div>
              <div class="node-label above">
                <span class="node-title">成就达成</span>
                <span class="node-desc">实现个人目标，获得认可</span>
              </div>
            </div>
          </div>

          <!-- 城市剪影背景 -->
          <div class="city-silhouette"></div>
        </div>
      </div>
    </div>


    <!-- 纵向排列的目标列表 -->
    <div class="vertical-targets-container">
      <div class="section-header">
        <h3 class="section-title">成长目标</h3>
        <button class="add-goal-btn" @click="openTargetSetting">
          <span class="plus-icon">+</span> 设置新目标
        </button>
      </div>

      <div 
        v-for="target in targets" 
        :key="target.id"
        class="target-milestone-card"
      >
        <!-- 目标信息头部 -->
        <div class="card-header-v">
          <div class="header-main">
            <div class="target-badge" :class="'badge-' + target.priority">
              {{ getTargetTypeLabel(target.type || 'other') }}
            </div>
            <h4 class="target-title-v">{{ target.name }}</h4>
            <div class="target-period">{{ formatDate(target.startDate) }} - {{ formatDate(target.endDate) }}</div>
          </div>
          <div class="header-actions">
            <button class="edit-btn-v" @click="editTarget(target)">编辑</button>
          </div>
        </div>

        <!-- 进度条展示 -->
        <div class="progress-section-v">
          <div class="progress-meta">
            <span class="percent-text">{{ calculateProgress(target) }}%</span>
            <span class="count-text">已完成 {{ calculateCompleted(target) }}/{{ calculateTotal(target) }} 项任务</span>
          </div>
          <div class="progress-track-v">
            <div class="progress-thumb-v" :style="{ width: calculateProgress(target) + '%' }"></div>
          </div>
        </div>

        <!-- 当前目标的任务链路 -->
        <div class="task-chain-v">
          <div 
            v-for="(task, index) in target.tasks" 
            :key="task.id"
            class="chain-item"
          >
            <!-- 任务节点 -->
            <div class="chain-node">
              <div class="node-bullet" :class="{ done: task.completed }">
                <span v-if="task.completed">✓</span>
              </div>
              <div class="node-content">
                <div class="node-title">{{ task.title }}</div>
                <!-- 子任务水平流 -->
                <div class="subtask-flow">
                  <div 
                    v-for="sub in task.subtasks" 
                    :key="sub.id" 
                    class="sub-pill"
                    :class="{ done: sub.completed }"
                  >
                    {{ sub.title }}
                  </div>
                </div>
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

// 计算完成进度辅助函数
const calculateCompleted = (target) => {
  if (!target.tasks) return 0
  return target.tasks.reduce((count, task) => {
    return count + (task.subtasks ? task.subtasks.filter(sub => sub.completed).length : 0)
  }, 0)
}

const calculateTotal = (target) => {
  if (!target.tasks) return 0
  return target.tasks.reduce((count, task) => {
    return count + (task.subtasks ? task.subtasks.length : 0)
  }, 0)
}

const calculateProgress = (target) => {
  const total = calculateTotal(target)
  return total > 0 ? Math.round((calculateCompleted(target) / total) * 100) : 0
}
</script>

<style scoped>


.todo-list-component {
  background: transparent;
  padding: 0;
  margin-bottom: 32px;
  box-shadow: none;
  border: none;
}

.vertical-targets-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.add-goal-btn {
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  border: 1px solid #e2e8f0;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.add-goal-btn:hover {
  background: #f8faff;
  border-color: #6366f1;
}

/* 目标里程碑卡片 */
.target-milestone-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: transform 0.3s;
}

.card-header-v {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-main {
  display: flex;
  flex-direction:  row;
  gap: 12px;
  text-align: left;
  align-items: baseline;
}

.target-badge {
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.badge-high { background: #fee2e2; color: #ef4444; }
.badge-medium { background: #fef3c7; color: #f59e0b; }
.badge-low { background: #dcfce7; color: #22c55e; }

.target-title-v {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.target-period {
  font-size: 13px;
  color: #94a3b8;
}

.edit-btn-v {
  font-size: 13px;
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.edit-btn-v:hover { 
  color: #6366f1;
  background: #f0f4ff;
}

/* 进度条样式 */
.progress-section-v {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.percent-text {
  font-size: 24px;
  font-weight: 800;
  color: #6366f1;
}

.count-text {
  font-size: 13px;
  color: #64748b;
}

.progress-track-v {
  height: 10px;
  background: #e2e8f0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-thumb-v {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  border-radius: 5px;
  transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 垂直任务链 */
.task-chain-v {
  position: relative;
  padding-left: 20px;
}

.chain-item {
  position: relative;
  margin-bottom: 32px;
}

.chain-item:last-child {
  margin-bottom: 0;
}

.chain-node {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.node-bullet {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  color: white;
  font-size: 12px;
  flex-shrink: 0;
  margin-left: 8px;
  transition: all 0.3s;
}

.node-bullet.done {
  background: #6366f1;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.node-content {
  flex: 1;
  text-align: left;
}

.node-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.subtask-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sub-pill {
  padding: 5px 14px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 12px;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sub-pill:hover {
  transform: translateY(-1px);
  border-color: #cbd5e1;
}

.sub-pill.done {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .target-milestone-card {
    padding: 16px;
  }
  .task-chain-v::before {
    left: 23px;
  }
  .node-bullet {
    margin-left: 0;
  }
  .curve-top-row {
    flex-direction: column;
  }
  .title-card, .activity-card, .ai-review-card {
    flex: none;
    width: 100%;
  }
}

/* ========== 成长曲线区域样式 ========== */
.growth-curve-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.curve-top-row {
  display: flex;
  gap: 20px;
  margin-bottom: 18px;
}

/* 左侧称号卡片 */
.title-card {
  flex: 0 0 260px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f8f9ff 100%);
  border-radius: 12px;
  padding: 20px;
}

.title-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 57px;
}

.title-info {
  text-align: left;
}

.title-name {
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
  margin: 0 0 4px 0;
}

.title-desc {
  font-size: 12px;
  color: #3b82f6;
  margin: 0;
}

.title-icon {
  font-size: 32px;
}

.title-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title-progress-bar {
  height: 8px;
  background: #cdd7f6;
  border-radius: 4px;
  overflow: hidden;
}

.title-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #72a4f4);
  border-radius: 4px;
}

.title-progress-label {
  font-size: 12px;
  color: #3b82f6;
  font-weight: 600;
}

/* 中间活动卡片 */
.activity-card {
  flex: 0 0 330px;
  background: #f8f9ff;
  border-radius: 12px;
  padding: 20px;
  text-align: left;
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.activity-icon {
  font-size: 16px;
}

.activity-label {
  font-size: 14px;
  color: #3b82f6;
  font-weight: 700;
}

.activity-trend {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.activity-trend.up {
  background: #e3e9f6;
  color: #3b82f6;
}

.activity-count {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 18px;
}

.count-num {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
}

.count-unit {
  font-size: 14px;
  color: #64748b;
}

.activity-dots {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e2e8f0;
}

.dot.active {
  background: #3b82f6;
}

.activity-completion {
  font-size: 12px;
  color: #94a3b8;
}

/* 右侧AI回顾卡片 */
.ai-review-card {
  flex: 1;
  background: linear-gradient(135deg, #f8f9ff 0%, #f8f9ff 100%);
  border-radius: 12px;
  padding: 20px;
}

.ai-review-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.ai-icon {
  font-size: 18px;
}

.ai-title {
  font-size: 14px;
  font-weight: 700;
  color: #1d4ed8;
}

.ai-content {
  font-size: 13px;
  line-height: 1.7;
  color: #1e40af;
  margin: 0;
  text-align: left;
}

.ai-content .highlight {
  display: block;
  font-weight: 600;
  color: #1d4ed8;
  margin: 8px 0 4px 0;
}

.ai-content .suggestion {
  display: block;
  padding-left: 8px;
  color: #3b82f6;
}

/* 成长轨迹区域 */
.curve-chart-area {
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.curve-chart-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  text-align: left  ;
}

.curve-chart-wrapper {
  position: relative;
  height: 180px;
}

.curve-svg {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}

.city-silhouette {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: 
    linear-gradient(180deg, transparent 0%, rgba(148, 163, 184, 0.1) 100%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 120'%3E%3Cpath d='M0 120 L0 80 L30 80 L30 60 L50 60 L50 80 L80 80 L80 40 L100 40 L100 80 L130 80 L130 50 L160 50 L160 80 L200 80 L200 30 L230 30 L230 80 L260 80 L260 60 L290 60 L290 80 L320 80 L320 45 L350 45 L350 80 L380 80 L380 55 L410 55 L410 80 L440 80 L440 35 L470 35 L470 80 L500 80 L500 50 L530 50 L530 80 L560 80 L560 40 L590 40 L590 80 L620 80 L620 55 L650 55 L650 80 L680 80 L680 45 L710 45 L710 80 L740 80 L740 60 L770 60 L770 80 L800 80 L800 120 Z' fill='%2394a3b8' opacity='0.15'/%3E%3C/svg%3E") no-repeat bottom center;
  background-size: cover;
  z-index: 1;
}

/* 里程碑节点样式 */
.milestone-nodes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
}

.milestone-node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.node-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 3px solid white;
  z-index: 2;
}

.node-circle.purple {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.node-circle.blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.node-circle.teal {
  background: linear-gradient(135deg, #14b8a6, #0d9488);
}

.node-circle.green {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.node-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #fefefe82;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #667eea7a;
  white-space: nowrap;
  z-index: 1;
}

.node-label.below {
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.node-label.above {
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.node-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2px;
}

.node-desc {
  font-size: 11px;
  color: #64748b;
}

/* 调整曲线容器高度以容纳标签 */
.curve-chart-wrapper {
  position: relative;
  height: 280px;
}

.curve-svg {
  width: 100%;
  height: 220px;
  position: absolute;
  top: 30px;
  left: 0;
  z-index: 2;
}

/* 响应式：小屏隐藏描述 */
@media (max-width: 1024px) {
  .node-desc {
    display: none;
  }
  .node-label {
    padding: 6px 10px;
  }
  .curve-chart-wrapper {
    height: 240px;
  }
}
</style>

