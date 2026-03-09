<template>
  <div class="homework-management">
    <!-- 顶部状态栏及筛选区域 -->
    <div class="filter-section">
      <!-- 左侧统计数值 -->
      <div class="stats-overview">
        <div class="stat-item">
          <span class="stat-label">作业总数：</span>
          <span class="stat-value">{{ filteredHomeworkList.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">完成率：</span>
          <span class="stat-value">{{ summaryStats.avgCompletion }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">正确率：</span>
          <span class="stat-value">{{ summaryStats.avgAccuracy }}%</span>
        </div>
      </div>

      <!-- 右侧筛选选项 -->
      <div class="filter-controls">
        <div class="filter-item">
          <label>班级：</label>
          <el-select v-model="selectedClass" placeholder="请选择班级" clearable @change="handleFilterChange" style="width: 160px">
            <el-option label="全部班级" value="" />
            <el-option 
              v-for="classItem in classOptions" 
              :key="classItem.value" 
              :label="classItem.label" 
              :value="classItem.value" 
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label>课程：</label>
          <el-select v-model="selectedCourse" placeholder="请选择课程" clearable @change="handleFilterChange" style="width: 160px">
            <el-option label="全部课程" value="" />
            <el-option 
              v-for="course in courseOptions" 
              :key="course.value" 
              :label="course.label" 
              :value="course.value" 
            />
          </el-select>
        </div>
        <div class="filter-item">
          <el-button type="primary" plain @click="resetFilters">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="table-section">
      <el-table 
        :data="paginatedHomeworkList" 
        stripe 
        style="width: 100%"
        :loading="loading"
      >
        <el-table-column prop="homeworkName" label="作业名称" min-width="150" />
        <el-table-column prop="courseName" label="课程名称" min-width="120" />
        <el-table-column prop="className" label="班级名称" min-width="100" />
        <el-table-column prop="studentCount" label="学员数" width="80" align="center" />
        <el-table-column prop="completedCount" label="完成数" width="80" align="center" />
        <el-table-column prop="completionRate" label="完成率" width="100" align="center">
          <template #default="scope">
            <el-progress 
              :percentage="scope.row.completionRate" 
              :color="getProgressColor(scope.row.completionRate)"
              :show-text="false"
              style="width: 80px"
            />
            <span style="margin-left: 8px">{{ scope.row.completionRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="accuracyRate" label="正确率" width="100" align="center">
          <template #default="scope">
            <el-progress 
              :percentage="scope.row.accuracyRate" 
              :color="getProgressColor(scope.row.accuracyRate)"
              :show-text="false"
              style="width: 80px"
            />
            <span style="margin-left: 8px">{{ scope.row.accuracyRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small" 
              @click="viewHomework(scope.row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 作业详情弹窗 -->
    <el-dialog
      v-model="homeworkDetailVisible"
      :title="currentHomework.homeworkName"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="homework-detail">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="作业名称">{{ currentHomework.homeworkName }}</el-descriptions-item>
            <el-descriptions-item label="课程名称">{{ currentHomework.courseName }}</el-descriptions-item>
            <el-descriptions-item label="班级名称">{{ currentHomework.className }}</el-descriptions-item>
            <el-descriptions-item label="发布时间">{{ currentHomework.publishTime }}</el-descriptions-item>
            <el-descriptions-item label="截止时间">{{ currentHomework.deadline }}</el-descriptions-item>
            <el-descriptions-item label="作业状态">
              <el-tag :type="currentHomework.status === '进行中' ? 'success' : 'info'">
                {{ currentHomework.status }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 作业内容 -->
        <div class="detail-section">
          <h3 class="section-title">作业内容</h3>
          <div class="content-box">
            <div v-html="currentHomework.content"></div>
          </div>
        </div>

        <!-- 作业要求 -->
        <div class="detail-section">
          <h3 class="section-title">作业要求</h3>
          <div class="content-box">
            <ul class="requirement-list">
              <li v-for="(req, index) in currentHomework.requirements" :key="index">{{ req }}</li>
            </ul>
          </div>
        </div>

        <!-- 提交统计 -->
        <div class="detail-section">
          <h3 class="section-title">提交统计</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">总学员数</div>
              <div class="stat-value">{{ currentHomework.studentCount }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">已完成</div>
              <div class="stat-value completed">{{ currentHomework.completedCount }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">未完成</div>
              <div class="stat-value pending">{{ currentHomework.studentCount - currentHomework.completedCount }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">完成率</div>
              <div class="stat-value">{{ currentHomework.completionRate }}%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">正确率</div>
              <div class="stat-value">{{ currentHomework.accuracyRate }}%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">平均分</div>
              <div class="stat-value">{{ currentHomework.averageScore }}</div>
            </div>
          </div>
        </div>

        <!-- 附件 -->
        <div class="detail-section" v-if="currentHomework.attachments && currentHomework.attachments.length > 0">
          <h3 class="section-title">作业附件</h3>
          <div class="attachment-list">
            <div v-for="(file, index) in currentHomework.attachments" :key="index" class="attachment-item">
              <i class="el-icon-document"></i>
              <span>{{ file }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="homeworkDetailVisible = false">关闭</el-button>
          <el-button type="primary" @click="exportHomeworkData">导出数据</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const selectedClass = ref('')
const selectedCourse = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const homeworkDetailVisible = ref(false)
const currentHomework = ref({})

// 筛选选项
const classOptions = ref([
  { value: 'class1', label: '计算机科学与技术1班' },
  { value: 'class2', label: '计算机科学与技术2班' },
  { value: 'class3', label: '软件工程1班' },
  { value: 'class4', label: '软件工程2班' },
  { value: 'class5', label: '网络工程1班' }
])

const courseOptions = ref([
  { value: 'course1', label: '数据结构与算法' },
  { value: 'course2', label: '软件工程实践' },
  { value: 'course3', label: '计算机网络实验' },
  { value: 'course4', label: '数据库原理' },
  { value: 'course5', label: '操作系统原理' }
])

// 作业列表数据
const homeworkList = ref([
  {
    id: 1,
    homeworkName: '链表基本操作实现',
    courseName: '数据结构与算法',
    courseCode: 'course1',
    className: '计算机科学与技术1班',
    classCode: 'class1',
    studentCount: 45,
    completedCount: 42,
    completionRate: 93,
    accuracyRate: 87
  },
  {
    id: 2,
    homeworkName: '快速排序算法设计',
    courseName: '数据结构与算法',
    courseCode: 'course1',
    className: '计算机科学与技术2班',
    classCode: 'class2',
    studentCount: 48,
    completedCount: 45,
    completionRate: 94,
    accuracyRate: 92
  },
  {
    id: 3,
    homeworkName: '软件需求分析文档',
    courseName: '软件工程实践',
    courseCode: 'course2',
    className: '软件工程1班',
    classCode: 'class3',
    studentCount: 40,
    completedCount: 38,
    completionRate: 95,
    accuracyRate: 89
  },
  {
    id: 4,
    homeworkName: '网络协议分析实验',
    courseName: '计算机网络实验',
    courseCode: 'course3',
    className: '网络工程1班',
    classCode: 'class5',
    studentCount: 35,
    completedCount: 32,
    completionRate: 91,
    accuracyRate: 85
  },
  {
    id: 5,
    homeworkName: '数据库设计实践',
    courseName: '数据库原理',
    courseCode: 'course4',
    className: '计算机科学与技术1班',
    classCode: 'class1',
    studentCount: 45,
    completedCount: 41,
    completionRate: 91,
    accuracyRate: 88
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 7,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  },
  {
    id: 6,
    homeworkName: '进程调度算法实现',
    courseName: '操作系统原理',
    courseCode: 'course5',
    className: '软件工程2班',
    classCode: 'class4',
    studentCount: 42,
    completedCount: 39,
    completionRate: 93,
    accuracyRate: 90
  }
])

// 计算属性 - 过滤后的数据
const filteredHomeworkList = computed(() => {
  let filtered = homeworkList.value

  // 按班级筛选
  if (selectedClass.value) {
    filtered = filtered.filter(item => item.classCode === selectedClass.value)
  }

  // 按课程筛选
  if (selectedCourse.value) {
    filtered = filtered.filter(item => item.courseCode === selectedCourse.value)
  }

  return filtered
})

// 计算页面的整体统计数值
const summaryStats = computed(() => {
  const list = filteredHomeworkList.value
  if (list.length === 0) return { avgCompletion: 0, avgAccuracy: 0 }
  
  let totalCompletion = 0
  let totalAccuracy = 0
  
  list.forEach(item => {
    totalCompletion += item.completionRate || 0
    totalAccuracy += item.accuracyRate || 0
  })
  
  return {
    avgCompletion: Math.round(totalCompletion / list.length),
    avgAccuracy: Math.round(totalAccuracy / list.length)
  }
})

// 应用分页后的数据
const paginatedHomeworkList = computed(() => {
  const filtered = filteredHomeworkList.value
  // 更新总数给翻页器
  totalCount.value = filtered.length

  // 分页切断
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 方法
const handleFilterChange = () => {
  currentPage.value = 1 // 重置到第一页
}

const resetFilters = () => {
  selectedClass.value = ''
  selectedCourse.value = ''
  currentPage.value = 1
}

const getProgressColor = (percentage) => {
  if (percentage >= 90) return '#67c23a'
  if (percentage >= 70) return '#e6a23c'
  return '#f56c6c'
}

// 生成作业详细内容的函数
const generateHomeworkDetail = (homework) => {
  const homeworkDetails = {
    '链表基本操作实现': {
      content: `
        <p><strong>作业目标：</strong>通过本次作业，掌握链表的基本操作和实现方法。</p>
        <p><strong>作业描述：</strong></p>
        <p>实现一个单链表数据结构，包含以下基本操作：</p>
        <ul>
          <li>创建链表</li>
          <li>插入节点（头插、尾插、指定位置插入）</li>
          <li>删除节点（按值删除、按位置删除）</li>
          <li>查找节点</li>
          <li>遍历链表</li>
          <li>获取链表长度</li>
        </ul>
        <p>请使用C++或Java语言实现，并编写测试用例验证功能的正确性。</p>
      `,
      requirements: [
        '使用面向对象的方式实现链表类',
        '每个方法需要添加详细的注释说明',
        '编写至少5个测试用例，覆盖各种边界情况',
        '代码需要符合良好的编程规范',
        '提交完整的源代码文件和测试报告',
        '截止日期前完成提交，逾期将扣分'
      ],
      attachments: ['链表操作参考文档.pdf', '测试用例模板.docx']
    },
    '快速排序算法设计': {
      content: `
        <p><strong>作业目标：</strong>深入理解快速排序算法的原理和实现。</p>
        <p><strong>作业描述：</strong></p>
        <p>实现快速排序算法，并进行性能分析：</p>
        <ul>
          <li>实现标准快速排序算法</li>
          <li>实现三数取中优化版本</li>
          <li>实现随机化快速排序</li>
          <li>对不同规模的数据进行测试（100、1000、10000、100000个元素）</li>
          <li>分析不同版本的时间复杂度和空间复杂度</li>
          <li>绘制性能对比图表</li>
        </ul>
      `,
      requirements: [
        '实现至少两种快速排序的变体',
        '使用随机数据、有序数据、逆序数据进行测试',
        '记录并分析各种情况下的运行时间',
        '撰写详细的算法分析报告',
        '代码需要有良好的可读性和注释',
        '提交源代码、测试数据和分析报告'
      ],
      attachments: ['算法分析报告模板.docx', '性能测试工具.zip']
    },
    '软件需求分析文档': {
      content: `
        <p><strong>作业目标：</strong>掌握软件需求分析的方法和文档编写规范。</p>
        <p><strong>作业描述：</strong></p>
        <p>为一个在线图书管理系统编写完整的需求分析文档，包括：</p>
        <ul>
          <li>项目背景和目标</li>
          <li>功能需求分析（用例图、用例描述）</li>
          <li>非功能需求分析（性能、安全、可用性等）</li>
          <li>数据需求分析（ER图、数据字典）</li>
          <li>界面原型设计</li>
          <li>系统架构设计</li>
        </ul>
        <p>文档需要符合IEEE 830标准。</p>
      `,
      requirements: [
        '文档结构完整，符合IEEE 830标准',
        '用例图使用UML规范绘制',
        '界面原型需要清晰美观',
        '数据字典要详细准确',
        '需求描述要清晰、无歧义',
        '提交Word文档和配图源文件'
      ],
      attachments: ['需求分析文档模板.docx', 'UML工具使用指南.pdf', '项目背景说明.pdf']
    },
    '网络协议分析实验': {
      content: `
        <p><strong>作业目标：</strong>通过抓包分析深入理解网络协议的工作原理。</p>
        <p><strong>作业描述：</strong></p>
        <p>使用Wireshark工具进行网络协议分析实验：</p>
        <ul>
          <li>捕获HTTP协议数据包，分析请求和响应过程</li>
          <li>捕获DNS协议数据包，分析域名解析过程</li>
          <li>捕获TCP三次握手和四次挥手过程</li>
          <li>分析ARP协议的工作原理</li>
          <li>捕获并分析ICMP协议（ping命令）</li>
        </ul>
        <p>针对每个协议，需要截图并详细说明各字段的含义。</p>
      `,
      requirements: [
        '使用Wireshark进行抓包，保存pcap文件',
        '对每个协议至少捕获3个数据包',
        '详细分析协议头部各字段的含义和值',
        '绘制协议交互的时序图',
        '撰写实验报告，包含截图和分析说明',
        '提交实验报告和pcap文件'
      ],
      attachments: ['Wireshark使用教程.pdf', '协议分析参考资料.pdf', '实验报告模板.docx']
    },
    '数据库设计实践': {
      content: `
        <p><strong>作业目标：</strong>掌握数据库设计的完整流程和规范化理论。</p>
        <p><strong>作业描述：</strong></p>
        <p>为学生选课系统设计数据库：</p>
        <ul>
          <li>进行需求分析，确定系统实体和关系</li>
          <li>绘制ER图（实体-关系图）</li>
          <li>将ER图转换为关系模式</li>
          <li>进行规范化设计（至少达到3NF）</li>
          <li>使用MySQL实现数据库，创建所有表结构</li>
          <li>插入测试数据</li>
          <li>编写10个以上的查询SQL语句</li>
        </ul>
      `,
      requirements: [
        'ER图需要使用专业工具绘制（如PowerDesigner）',
        '数据库设计要符合规范化要求',
        '表结构要合理，字段类型选择恰当',
        '必须包含主键、外键约束',
         'SQL语句要包含多表连接、子查询、聚合函数等',
        '提交设计文档、SQL脚本和测试结果'
      ],
      attachments: ['ER图绘制工具.zip', '数据库设计规范.pdf', '测试数据.sql']
    },
    '进程调度算法实现': {
      content: `
        <p><strong>作业目标：</strong>理解操作系统中的进程调度算法原理。</p>
        <p><strong>作业描述：</strong></p>
        <p>实现并比较以下进程调度算法：</p>
        <ul>
          <li>先来先服务（FCFS）</li>
          <li>最短作业优先（SJF）</li>
          <li>优先级调度算法</li>
          <li>时间片轮转（RR）</li>
          <li>多级反馈队列调度</li>
        </ul>
        <p>对每种算法：</p>
        <ul>
          <li>编写模拟程序</li>
          <li>计算平均等待时间和平均周转时间</li>
          <li>分析算法的优缺点</li>
          <li>绘制甘特图展示调度过程</li>
        </ul>
      `,
      requirements: [
        '使用C/C++或Python实现调度算法',
        '程序能够接受自定义的进程参数输入',
        '输出要包含详细的调度过程和统计数据',
        '绘制甘特图展示调度时序',
        '撰写实验报告，比较各算法的性能',
        '提交源代码、测试用例和实验报告'
      ],
      attachments: ['进程调度算法原理.pdf', '实验指导书.pdf', '代码框架.zip']
    }
  }

  const detail = homeworkDetails[homework.homeworkName] || {
    content: `
      <p><strong>作业目标：</strong>完成${homework.homeworkName}相关的学习和实践。</p>
      <p><strong>作业描述：</strong></p>
      <p>这是一个关于${homework.courseName}课程的作业，请认真完成。</p>
    `,
    requirements: [
      '认真阅读作业要求',
      '按时完成并提交作业',
      '保证作业质量',
      '遵守学术诚信原则'
    ],
    attachments: []
  }

  // 生成时间
  const now = new Date()
  const publishDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 7天前
  const deadlineDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7天后

  return {
    ...homework,
    ...detail,
    publishTime: publishDate.toLocaleDateString('zh-CN') + ' ' + publishDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    deadline: deadlineDate.toLocaleDateString('zh-CN') + ' 23:59',
    status: '进行中',
    averageScore: Math.floor(75 + Math.random() * 20) // 75-95分
  }
}

const viewHomework = (row) => {
  currentHomework.value = generateHomeworkDetail(row)
  homeworkDetailVisible.value = true
}

const exportHomeworkData = () => {
  ElMessage.success('数据导出功能开发中...')
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 初始化
onMounted(() => {
  totalCount.value = homeworkList.value.length
})
</script>

<style scoped>
.homework-management {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.filter-section {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

/* 统计数据区域 */
.stats-overview {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  color: #1677ff;
  font-weight: 600;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.table-section {
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.pagination-section {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-item {
    width: 100%;
    justify-content: flex-start;
  }
  
  .homework-management {
    padding: 10px;
  }
}

/* 表格样式优化 */
:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: #fafafa;
  color: #333;
  font-weight: 600;
}

:deep(.el-table td) {
  padding: 12px 0;
}

:deep(.el-progress-bar__outer) {
  background-color: #f0f0f0;
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
}

/* 作业详情弹窗样式 */
.homework-detail {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.content-box {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 6px;
  line-height: 1.8;
}

.content-box p {
  margin: 8px 0;
  color: #666;
}

.content-box strong {
  color: #333;
  font-weight: 600;
}

.content-box ul {
  margin: 12px 0;
  padding-left: 24px;
}

.content-box li {
  margin: 6px 0;
  color: #666;
}

.requirement-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirement-list li {
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-left: 3px solid #409eff;
  border-radius: 4px;
  color: #666;
  transition: all 0.3s;
}

.requirement-list li:hover {
  background: #f0f7ff;
  transform: translateX(4px);
}

.requirement-list li::before {
  content: "✓";
  color: #409eff;
  font-weight: bold;
  margin-right: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-card {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  text-align: center;
  color: white;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card:nth-child(4) {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-card:nth-child(5) {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-card:nth-child(6) {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
}

.stat-value.completed {
  font-size: 28px;
}

.stat-value.pending {
  font-size: 28px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
  cursor: pointer;
}

.attachment-item:hover {
  background: #ecf5ff;
  border-color: #409eff;
}

.attachment-item i {
  color: #409eff;
  font-size: 18px;
}

.attachment-item span {
  color: #606266;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 描述列表样式优化 */
:deep(.el-descriptions) {
  border-radius: 6px;
  overflow: hidden;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
  background-color: #fafafa;
}

:deep(.el-descriptions__content) {
  color: #666;
}

/* 滚动条样式 */
.homework-detail::-webkit-scrollbar {
  width: 6px;
}

.homework-detail::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.homework-detail::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.homework-detail::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 弹窗标题样式 */
:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

:deep(.el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.el-dialog__close) {
  color: white;
}

:deep(.el-dialog__close:hover) {
  color: #f0f0f0;
}
</style>
