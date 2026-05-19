<template>
  <div class="teaching-task-page">
    <!-- 顶部数据汇总指标 -->
    <div class="stats-container">
      <div class="stat-card stat-total">
        <div class="stat-icon-wrapper">
          <el-icon><Folder /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-label">任务总数</span>
          <span class="stat-value">{{ filteredTasks.length }}</span>
        </div>
        <div class="stat-decor"></div>
      </div>
      <div class="stat-card stat-progress">
        <div class="stat-icon-wrapper">
          <el-icon><Timer /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-label">进行中</span>
          <span class="stat-value">{{ tasksInProgressCount }}</span>
        </div>
        <div class="stat-decor"></div>
      </div>
      <div class="stat-card stat-pending">
        <div class="stat-icon-wrapper">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-label">未开始 / 待审核</span>
          <span class="stat-value">{{ tasksPendingCount }}</span>
        </div>
        <div class="stat-decor"></div>
      </div>
      <div class="stat-card stat-completed">
        <div class="stat-icon-wrapper">
          <el-icon><Checked /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-label">已完成</span>
          <span class="stat-value">{{ tasksCompletedCount }}</span>
        </div>
        <div class="stat-decor"></div>
      </div>
    </div>

    <!-- 筛选和操作面板 -->
    <div class="control-panel">
      <div class="filter-group">
        <el-input 
          v-model="filters.keyword" 
          placeholder="搜索任务名称/描述..." 
          clearable
          :prefix-icon="'Search'"
          class="search-input"
        />
        <el-select v-model="filters.type" placeholder="任务类型" clearable class="filter-select">
          <el-option label="理论教学" value="理论教学" />
          <el-option label="实训教学管理" value="实训教学管理" />
          <el-option label="技能大赛指导" value="技能大赛指导" />
          <el-option label="产教融合/校企合作" value="产教融合/校企合作" />
          <el-option label="班主任工作" value="班主任工作" />
          <el-option label="教学研究与教改" value="教学研究与教改" />
          <el-option label="1+X证书培训与考证" value="1+X证书培训与考证" />
          <el-option label="教师企业实践" value="教师企业实践" />
        </el-select>
        <el-select v-model="filters.nature" placeholder="任务性质" clearable class="filter-select">
          <el-option label="👤 个人任务" value="individual" />
          <el-option label="👥 项目团队任务" value="team" />
        </el-select>
        <el-select v-model="filters.status" placeholder="任务状态" clearable class="filter-select">
          <el-option label="未开始" value="pending" />
          <el-option label="进行中" value="in-progress" />
          <el-option label="已完成" value="completed" />
        </el-select>
        <el-button @click="resetFilters" :icon="'Refresh'" class="reset-btn">重置</el-button>
      </div>

      <el-button type="primary" class="create-task-btn" @click="openCreateDialog">
        <el-icon><Plus /></el-icon>
        <span>新建教学任务</span>
      </el-button>
    </div>

    <!-- 任务数据矩阵 -->
    <div v-if="filteredTasks.length > 0" class="task-grid-matrix">
      <div 
        v-for="task in filteredTasks" 
        :key="task.id" 
        class="task-matrix-card"
        :class="[`priority-${task.priorityLevel}`, { 'is-completed': task.status === 'completed' }]"
      >
        <!-- 卡片头部 -->
        <div class="card-top">
          <span class="type-badge" :class="`badge-${getTypeColorIndex(task.type)}`">
            {{ task.type }}
          </span>
          <div class="nature-indicator" :class="task.nature">
            {{ task.nature === 'team' ? '👥 团队' : '👤 个人' }}
          </div>
        </div>

        <!-- 任务主要信息 -->
        <div class="card-main">
          <h3 class="task-title" @click="viewTaskDetails(task)">{{ task.name }}</h3>
          <p class="task-desc">{{ task.description }}</p>
        </div>

        <!-- 项目成员展示 -->
        <div class="card-members">
          <div class="member-label">负责人/成员：</div>
          <div class="members-avatars">
            <template v-if="task.nature === 'team' && task.members && task.members.length > 0">
              <el-tooltip
                v-for="(member, idx) in task.members"
                :key="idx"
                :content="member"
                placement="top"
              >
                <div class="avatar-circle" :style="{ backgroundColor: getMemberBgColor(member) }">
                  {{ member.charAt(0) }}
                </div>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip content="本人专属任务" placement="top">
                <div class="avatar-circle individual-avatar">
                  我
                </div>
              </el-tooltip>
            </template>
          </div>
        </div>

        <!-- 进度与重要级 -->
        <div class="card-progress">
          <div class="progress-info">
            <span class="progress-lbl">完成进度</span>
            <span class="progress-val">{{ task.progress }}%</span>
          </div>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill" 
              :style="{ width: `${task.progress}%` }"
              :class="`fill-priority-${task.priorityLevel}`"
            ></div>
          </div>
        </div>

        <!-- 卡片页脚信息与操作 -->
        <div class="card-footer">
          <div class="footer-meta">
            <div class="deadline-meta" :class="{ 'is-overdue': isCloseToDeadline(task.deadline) && task.status !== 'completed' }">
              <el-icon><Calendar /></el-icon>
              <span>{{ task.deadline }}</span>
            </div>
            <div class="priority-flag" :class="`flag-${task.priorityLevel}`">
              {{ getPriorityLabel(task.priorityLevel) }}
            </div>
          </div>

          <div class="footer-actions">
            <el-tooltip content="标记为已完成" placement="top" v-if="task.status !== 'completed'">
              <el-button 
                type="success" 
                circle 
                size="small" 
                :icon="Check" 
                @click="completeTask(task)"
              />
            </el-tooltip>
            <el-button 
              type="primary" 
              link 
              size="small" 
              @click="viewTaskDetails(task)"
            >
              详情
            </el-button>
            <el-button 
              type="danger" 
              link 
              size="small" 
              @click="deleteTask(task)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📂</div>
      <div class="empty-text">未检索到符合条件的教学任务</div>
      <div class="empty-desc">您可以点击右上角“新建教学任务”来添加第一项工作任务</div>
    </div>

    <!-- 新建/编辑教学任务对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑教学任务' : '新建教学任务'"
      width="640px"
      class="task-create-dialog"
      destroy-on-close
    >
      <el-form :model="taskForm" :rules="formRules" ref="taskFormRef" label-position="top">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskForm.name" placeholder="请输入符合职业学校要求的任务名称（如：XX实训室排查、XX大纲编写）" />
        </el-form-item>

        <div class="form-row-2">
          <el-form-item label="任务类型" prop="type">
            <el-select v-model="taskForm.type" placeholder="请选择基本工作任务类型" class="w-100">
              <el-option label="理论教学 (教案设计/日常授课/教后反思)" value="理论教学" />
              <el-option label="实训教学管理 (设备排查/实训指导书/安全规程)" value="实训教学管理" />
              <el-option label="技能大赛指导 (省赛/国赛备赛与训练)" value="技能大赛指导" />
              <el-option label="产教融合/校企合作 (基地共建/订单班交流/研发)" value="产教融合/校企合作" />
              <el-option label="班主任工作 (班会开展/学生资助/辅导记录)" value="班主任工作" />
              <el-option label="教学研究与教改 (活页教材/课件教改/精品课建设)" value="教学研究与教改" />
              <el-option label="1+X证书培训与考证 (考前集训/软件部署/考考安排)" value="1+X证书培训与考证" />
              <el-option label="教师企业实践 (定期入企锻炼/前沿技术学习)" value="教师企业实践" />
            </el-select>
          </el-form-item>

          <el-form-item label="重要程度 / 优先级" prop="priorityLevel">
            <el-radio-group v-model="taskForm.priorityLevel">
              <el-radio-button label="high">紧急重要</el-radio-button>
              <el-radio-button label="medium">重要</el-radio-button>
              <el-radio-button label="low">普通</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>

        <el-form-item label="任务说明与要求" prop="description">
          <el-input 
            v-model="taskForm.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请详细阐述该教学任务的执行标准、交付成果（如：输出隐患台账、完成3次模拟演练等）..." 
          />
        </el-form-item>

        <div class="form-row-2">
          <el-form-item label="任务截止时间" prop="deadline">
            <el-date-picker
              v-model="taskForm.deadline"
              type="date"
              placeholder="选择截止日期"
              value-format="YYYY-MM-DD"
              class="w-100"
            />
          </el-form-item>

          <el-form-item label="任务性质" prop="nature">
            <el-radio-group v-model="taskForm.nature" @change="handleNatureChange">
              <el-radio label="individual">👤 个人任务</el-radio>
              <el-radio label="team">👥 项目团队任务</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 仅当选择“项目团队任务”时，显示项目成员选择器 -->
        <transition name="el-zoom-in-top">
          <div v-if="taskForm.nature === 'team'" class="member-select-section">
            <el-form-item label="选择项目团队成员（可多选）" prop="members">
              <el-select
                v-model="taskForm.members"
                multiple
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择参与本任务的协作教师"
                class="w-100"
              >
                <el-option
                  v-for="teacher in vocationalTeachers"
                  :key="teacher"
                  :label="teacher"
                  :value="teacher"
                />
              </el-select>
            </el-form-item>
          </div>
        </transition>

        <div class="form-row-2">
          <el-form-item label="初始进度 (%)" prop="progress">
            <el-slider v-model="taskForm.progress" :step="5" show-input />
          </el-form-item>
          <el-form-item label="预估工时 (小时)" prop="estimatedHours">
            <el-input-number v-model="taskForm.estimatedHours" :min="1" :max="200" class="w-100" />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" class="btn-primary-gradient" @click="submitTaskForm">
            {{ isEdit ? '保存修改' : '确认创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 任务详情抽屉（大宽屏交互） -->
    <el-drawer
      v-model="detailsVisible"
      size="560px"
      class="task-detail-drawer"
      direction="rtl"
      :with-header="false"
    >
      <div v-if="selectedTask" class="drawer-layout">
        <!-- 头部背景 banner -->
        <div class="drawer-banner" :class="`priority-banner-${selectedTask.priorityLevel}`">
          <div class="banner-overlay"></div>
          <div class="banner-content">
            <div class="banner-top">
              <span class="type-tag">{{ selectedTask.type }}</span>
              <span class="nature-tag" :class="selectedTask.nature">
                {{ selectedTask.nature === 'team' ? '👥 团队协同' : '👤 个人专属' }}
              </span>
            </div>
            <h2 class="banner-title">{{ selectedTask.name }}</h2>
            <div class="banner-meta">
              <span class="meta-item"><el-icon><Calendar /></el-icon>截止：{{ selectedTask.deadline }}</span>
              <span class="meta-item"><el-icon><Timer /></el-icon>估时：{{ selectedTask.estimatedHours }} 小时</span>
            </div>
          </div>
          <button class="close-btn" @click="detailsVisible = false">
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <!-- 抽屉详情体 -->
        <div class="drawer-body">
          <div class="info-block">
            <h4 class="block-title"><el-icon><Document /></el-icon>任务要求描述</h4>
            <p class="desc-text">{{ selectedTask.description }}</p>
          </div>

          <div class="info-block">
            <h4 class="block-title"><el-icon><User /></el-icon>人员分配</h4>
            <div class="members-detail-list">
              <template v-if="selectedTask.nature === 'team' && selectedTask.members && selectedTask.members.length > 0">
                <div v-for="member in selectedTask.members" :key="member" class="member-detail-card">
                  <div class="member-avatar" :style="{ backgroundColor: getMemberBgColor(member) }">
                    {{ member.charAt(0) }}
                  </div>
                  <div class="member-info">
                    <span class="m-name">{{ member }}</span>
                    <span class="m-role">协同协作教师</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="member-detail-card">
                  <div class="member-avatar self-avatar">我</div>
                  <div class="member-info">
                    <span class="m-name">当前教师 (本人)</span>
                    <span class="m-role">个人独立执行任务</span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="info-block">
            <h4 class="block-title"><el-icon><Checked /></el-icon>进度统计 & 优先级</h4>
            <div class="progress-details">
              <div class="progress-top">
                <span>完成状态</span>
                <span class="status-txt" :class="selectedTask.status">
                  {{ selectedTask.status === 'completed' ? '已完成' : (selectedTask.status === 'in-progress' ? '进行中' : '未开始') }}
                </span>
              </div>
              <el-progress 
                :percentage="selectedTask.progress" 
                :stroke-width="12" 
                :status="selectedTask.status === 'completed' ? 'success' : ''"
                striped 
                striped-flow 
              />
              
              <div class="detail-stats-grid">
                <div class="detail-stat-box">
                  <span class="lbl">重要程度</span>
                  <span class="val" :class="`priority-${selectedTask.priorityLevel}`">
                    {{ getPriorityLabel(selectedTask.priorityLevel) }}
                  </span>
                </div>
                <div class="detail-stat-box">
                  <span class="lbl">创建时间</span>
                  <span class="val text-secondary">{{ selectedTask.createTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 抽屉页脚 -->
        <div class="drawer-footer">
          <el-button @click="detailsVisible = false">关闭</el-button>
          <el-button type="warning" @click="editTask(selectedTask)">编辑任务</el-button>
          <el-button 
            v-if="selectedTask.status !== 'completed'"
            type="primary" 
            class="btn-primary-gradient" 
            @click="completeTask(selectedTask); detailsVisible = false"
          >
            标记为完成
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { 
  Folder, Timer, Clock, Checked, Plus, Calendar, Close, 
  Document, User, Aim, Check, Delete, Edit 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 职业学校教师候选协作名单
const vocationalTeachers = ref([
  '张明教授',
  '李丽老师',
  '王强讲师',
  '赵敏高级工程师',
  '孙健实训主任'
])

// 过滤器状态
const filters = reactive({
  keyword: '',
  type: '',
  nature: '',
  status: ''
})

// 默认的教学任务模拟数据 (高度契合职业院校教师核心工作)
const taskList = ref([
  {
    id: 1,
    name: '工业机器人装调实训室安全隐患排查',
    type: '实训教学管理',
    nature: 'team',
    members: ['王强讲师', '孙健实训主任'],
    priorityLevel: 'high',
    deadline: '2026-05-25',
    description: '对西门子机器人实训区及示教器进行安全与电气隐患全面盘点，并输出隐患台账与整改措施，保障期末技能实操考试安全进行。',
    progress: 40,
    status: 'in-progress',
    estimatedHours: 8,
    createTime: '2026-05-10'
  },
  {
    id: 2,
    name: '2026年全国职业院校技能大赛（软件测试赛项）指导',
    type: '技能大赛指导',
    nature: 'team',
    members: ['李丽老师', '赵敏高级工程师'],
    priorityLevel: 'high',
    deadline: '2026-06-10',
    description: '指导高职计算机2301班参赛队伍进行自动化测试脚本性能调优，组织每周两次的模拟赛练。',
    progress: 75,
    status: 'in-progress',
    estimatedHours: 40,
    createTime: '2026-05-01'
  },
  {
    id: 3,
    name: '《数控加工技术》活页式新教材大纲编写',
    type: '教学研究与教改',
    nature: 'individual',
    members: [],
    priorityLevel: 'medium',
    deadline: '2026-05-30',
    description: '根据国家最新的双高计划建设指南，对接企业岗位典型工作任务，编写活页式数控教材大纲及模块化课程目录。',
    progress: 20,
    status: 'in-progress',
    estimatedHours: 16,
    createTime: '2026-05-12'
  },
  {
    id: 4,
    name: '智能网联汽车校企产学研项目交流会议',
    type: '产教融合/校企合作',
    nature: 'team',
    members: ['张明教授', '赵敏高级工程师'],
    priorityLevel: 'medium',
    deadline: '2026-05-20',
    description: '与本地比亚迪售后技术中心对接校外实训基地建设方案，拟定订单班共同育人协议。',
    progress: 100,
    status: 'completed',
    estimatedHours: 6,
    createTime: '2026-05-15'
  },
  {
    id: 5,
    name: '高职软件2402班第二季度心理摸排与学生辅导',
    type: '班主任工作',
    nature: 'individual',
    members: [],
    priorityLevel: 'low',
    deadline: '2026-05-28',
    description: '对班级内个别心理亚健康或挂科警告的学生进行个别谈心，完成辅导记录建档并上传至学生事务平台。',
    progress: 90,
    status: 'in-progress',
    estimatedHours: 4,
    createTime: '2026-05-11'
  },
  {
    id: 6,
    name: '工业物联网“1+X”职业技能等级证书培训与考务安排',
    type: '1+X证书培训与考证',
    nature: 'team',
    members: ['张明教授', '王强讲师', '孙健实训主任'],
    priorityLevel: 'high',
    deadline: '2026-06-05',
    description: '落实物联网中级证书50名学生的考前模拟软件环境安装，以及理论/实操考场标准化巡查部署。',
    progress: 0,
    status: 'pending',
    estimatedHours: 24,
    createTime: '2026-05-18'
  }
])

// 过滤后的数据列表
const filteredTasks = computed(() => {
  return taskList.value.filter(task => {
    // 关键词过滤
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      const matchName = task.name.toLowerCase().includes(kw)
      const matchDesc = task.description.toLowerCase().includes(kw)
      if (!matchName && !matchDesc) return false
    }
    // 任务类型过滤
    if (filters.type && task.type !== filters.type) return false
    // 任务性质过滤
    if (filters.nature && task.nature !== filters.nature) return false
    // 任务状态过滤
    if (filters.status && task.status !== filters.status) return false

    return true
  })
})

// 数据看板指标计算
const tasksInProgressCount = computed(() => {
  return taskList.value.filter(task => task.status === 'in-progress').length
})
const tasksPendingCount = computed(() => {
  return taskList.value.filter(task => task.status === 'pending').length
})
const tasksCompletedCount = computed(() => {
  return taskList.value.filter(task => task.status === 'completed').length
})

// 重置过滤器
const resetFilters = () => {
  filters.keyword = ''
  filters.type = ''
  filters.nature = ''
  filters.status = ''
}

// 对话框表单相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentEditId = ref(null)
const taskFormRef = ref(null)

const taskForm = reactive({
  name: '',
  type: '理论教学',
  nature: 'individual',
  members: [],
  priorityLevel: 'medium',
  deadline: '',
  description: '',
  progress: 0,
  estimatedHours: 8
})

const formRules = {
  name: [
    { required: true, message: '请输入教学任务名称', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择任务类型', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入任务说明与交付物要求', trigger: 'blur' }
  ],
  deadline: [
    { required: true, message: '请选择截止时间', trigger: 'change' }
  ]
}

// 打开创建弹窗
const openCreateDialog = () => {
  isEdit.value = false
  currentEditId.value = null
  taskForm.name = ''
  taskForm.type = '理论教学'
  taskForm.nature = 'individual'
  taskForm.members = []
  taskForm.priorityLevel = 'medium'
  taskForm.deadline = ''
  taskForm.description = ''
  taskForm.progress = 0
  taskForm.estimatedHours = 8
  
  dialogVisible.value = true
}

// 处理性质改变清空团队成员
const handleNatureChange = (val) => {
  if (val === 'individual') {
    taskForm.members = []
  }
}

// 提交表单
const submitTaskForm = () => {
  if (!taskFormRef.value) return
  taskFormRef.value.validate((valid) => {
    if (valid) {
      // 确认状态
      let computedStatus = 'pending'
      if (taskForm.progress === 100) {
        computedStatus = 'completed'
      } else if (taskForm.progress > 0) {
        computedStatus = 'in-progress'
      }

      if (isEdit.value) {
        // 编辑模式
        const idx = taskList.value.findIndex(t => t.id === currentEditId.value)
        if (idx !== -1) {
          taskList.value[idx] = {
            ...taskList.value[idx],
            name: taskForm.name,
            type: taskForm.type,
            nature: taskForm.nature,
            members: [...taskForm.members],
            priorityLevel: taskForm.priorityLevel,
            deadline: taskForm.deadline,
            description: taskForm.description,
            progress: taskForm.progress,
            estimatedHours: taskForm.estimatedHours,
            status: computedStatus
          }
          ElMessage.success('教学任务更新成功')
        }
      } else {
        // 新增模式
        const newTask = {
          id: taskList.value.length ? Math.max(...taskList.value.map(t => t.id)) + 1 : 1,
          name: taskForm.name,
          type: taskForm.type,
          nature: taskForm.nature,
          members: [...taskForm.members],
          priorityLevel: taskForm.priorityLevel,
          deadline: taskForm.deadline,
          description: taskForm.description,
          progress: taskForm.progress,
          status: computedStatus,
          estimatedHours: taskForm.estimatedHours,
          createTime: new Date().toISOString().split('T')[0]
        }
        taskList.value.unshift(newTask)
        ElMessage.success('教学任务创建成功')
      }
      dialogVisible.value = false
    }
  })
}

// 快捷标记完成
const completeTask = (task) => {
  task.progress = 100
  task.status = 'completed'
  ElMessage({
    type: 'success',
    message: `恭喜您已顺利完成任务《${task.name}》！`
  })
}

// 删除任务
const deleteTask = (task) => {
  ElMessageBox.confirm(
    `确定要永久删除任务《${task.name}》吗？该操作无法恢复。`,
    '警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const idx = taskList.value.findIndex(t => t.id === task.id)
    if (idx !== -1) {
      taskList.value.splice(idx, 1)
      ElMessage.success('任务已成功删除')
    }
  }).catch(() => {})
}

// 编辑任务弹窗打开
const editTask = (task) => {
  detailsVisible.value = false
  isEdit.value = true
  currentEditId.value = task.id
  
  taskForm.name = task.name
  taskForm.type = task.type
  taskForm.nature = task.nature
  taskForm.members = [...(task.members || [])]
  taskForm.priorityLevel = task.priorityLevel
  taskForm.deadline = task.deadline
  taskForm.description = task.description
  taskForm.progress = task.progress
  taskForm.estimatedHours = task.estimatedHours
  
  dialogVisible.value = true
}

// 详情抽屉控制
const detailsVisible = ref(false)
const selectedTask = ref(null)

const viewTaskDetails = (task) => {
  selectedTask.value = task
  detailsVisible.value = true
}

// 辅助方法：状态及背景色彩映射
const getTypeColorIndex = (type) => {
  const types = [
    '理论教学',
    '实训教学管理',
    '技能大赛指导',
    '产教融合/校企合作',
    '班主任工作',
    '教学研究与教改',
    '1+X证书培训与考证',
    '教师企业实践'
  ]
  const idx = types.indexOf(type)
  return idx !== -1 ? idx : 0
}

const getMemberBgColor = (member) => {
  const hash = [...member].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4']
  return colors[hash % colors.length]
}

const getPriorityLabel = (priority) => {
  const map = {
    'high': '🔴 紧急重要',
    'medium': '🟡 重要',
    'low': '🔵 普通'
  }
  return map[priority] || '普通'
}

const isCloseToDeadline = (deadlineStr) => {
  const deadline = new Date(deadlineStr)
  const today = new Date()
  const diffTime = deadline - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 3
}
</script>

<style scoped>
.teaching-task-page {
  padding: 0;
  width: 100%;
}

/* 顶部指标卡片 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: white;
  z-index: 2;
}

.stat-total .stat-icon-wrapper { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
.stat-progress .stat-icon-wrapper { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.stat-pending .stat-icon-wrapper { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
.stat-completed .stat-icon-wrapper { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }

.stat-info {
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin-top: 4px;
}

.stat-decor {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.015);
  z-index: 1;
}

/* 控制操作栏 */
.control-panel {
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  width: 240px;
}

.filter-select {
  width: 160px;
}

.reset-btn {
  border-radius: 8px;
}

.create-task-btn {
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  transition: all 0.25s;
  font-weight: 600;
}

.create-task-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
}

/* 任务数据矩阵网格 */
.task-grid-matrix {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.task-matrix-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}

.task-matrix-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
}

/* 优先级左侧彩带指示 */
.task-matrix-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}
.priority-high::before { background: #ef4444; }
.priority-medium::before { background: #f59e0b; }
.priority-low::before { background: #3b82f6; }

.task-matrix-card.is-completed {
  opacity: 0.85;
}
.task-matrix-card.is-completed::before {
  background: #10b981;
}

/* 头部徽章 */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.type-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}
.badge-0 { background: #eff6ff; color: #1d4ed8; }
.badge-1 { background: #ecfdf5; color: #047857; }
.badge-2 { background: #fffbeb; color: #b45309; }
.badge-3 { background: #faf5ff; color: #6b21a8; }
.badge-4 { background: #fdf2f8; color: #be185d; }
.badge-5 { background: #fff1f2; color: #be123c; }
.badge-6 { background: #f0fdfa; color: #0f766e; }
.badge-7 { background: #f5f5f4; color: #44403c; }

.nature-indicator {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
}
.nature-indicator.team { background: #e0f2fe; color: #0369a1; }
.nature-indicator.individual { background: #f3f4f6; color: #4b5563; }

/* 任务内容 */
.card-main {
  flex: 1;
  margin-bottom: 16px;
}

.task-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  cursor: pointer;
  line-height: 1.4;
  transition: color 0.2s;
}

.task-title:hover {
  color: #2563eb;
}

.is-completed .task-title {
  text-decoration: line-through;
  color: #94a3b8;
}

.task-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 团队成员展示 */
.card-members {
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.member-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.members-avatars {
  display: flex;
  align-items: center;
  gap: -4px;
}

.avatar-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid white;
  margin-left: -6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.avatar-circle:first-child {
  margin-left: 0;
}

.individual-avatar {
  background: #3b82f6;
}

/* 进度条 */
.card-progress {
  margin-bottom: 16px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 6px;
}

.progress-bar-bg {
  height: 6px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s ease;
}
.fill-priority-high { background: linear-gradient(90deg, #ef4444, #f87171); }
.fill-priority-medium { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.fill-priority-low { background: linear-gradient(90deg, #3b82f6, #60a5fa); }

.is-completed .progress-bar-fill {
  background: linear-gradient(90deg, #10b981, #34d399);
}

/* 页脚 */
.card-footer {
  border-top: 1px dashed #f1f5f9;
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.deadline-meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
}

.deadline-meta.is-overdue {
  background: #fef2f2;
  color: #ef4444;
  font-weight: 600;
}

.priority-flag {
  font-size: 11px;
  font-weight: 600;
}
.flag-high { color: #ef4444; }
.flag-medium { color: #d97706; }
.flag-low { color: #2563eb; }

.footer-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 对话框与表单 */
.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.w-100 {
  width: 100% !important;
}

.member-select-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

/* 详情侧滑页 */
.task-detail-drawer :deep(.el-drawer) {
  background: #f8fafc !important;
}

.task-detail-drawer :deep(.el-drawer__body) {
  padding: 0 !important;
  overflow: hidden !important;
}

.drawer-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.drawer-banner {
  padding: 32px 24px;
  position: relative;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.priority-banner-high { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
.priority-banner-medium { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.priority-banner-low { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 10% 20%, rgba(255,255,255,0.06) 0%, transparent 90%);
  pointer-events: none;
}

.banner-content {
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.banner-top {
  display: flex;
  gap: 8px;
}

.banner-top .type-tag {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.banner-top .nature-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.15);
}

.banner-title {
  font-size: 18px;
  font-weight: 800;
  margin: 4px 0 0 0;
  line-height: 1.4;
}

.banner-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: rgba(255,255,255,0.85);
  margin-top: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.close-btn {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255,255,255,0.25);
  transform: rotate(90deg);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-block {
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.015);
}

.block-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
  border-left: 4px solid #3b82f6;
  padding-left: 10px;
}

.desc-text {
  font-size: 13px;
  color: #475569;
  line-height: 1.8;
  margin: 0;
}

.members-detail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member-detail-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px 14px;
  border: 1px solid #f1f5f9;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.self-avatar {
  background: #3b82f6;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.m-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.m-role {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.progress-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-top {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.status-txt {
  font-weight: 700;
}
.status-txt.completed { color: #10b981; }
.status-txt.in-progress { color: #f59e0b; }
.status-txt.pending { color: #64748b; }

.detail-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.detail-stat-box {
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px;
  border: 1px solid #f1f5f9;
  text-align: center;
}

.detail-stat-box .lbl {
  font-size: 11px;
  color: #64748b;
  display: block;
}

.detail-stat-box .val {
  font-size: 14px;
  font-weight: 700;
  display: block;
  margin-top: 4px;
}

.drawer-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: white;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 13px;
  color: #64748b;
}

.btn-primary-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%) !important;
  border: none !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.btn-primary-gradient:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}
</style>
