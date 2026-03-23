<template>
  <div class="courseware-page">
    <!-- 课件教案列表 -->
    <div class="content-section">
      <div class="section-header">
        <div class="stats-overview">
          <div class="stat-item">
            <span class="stat-label">课件总数：</span>
            <span class="stat-value">{{ filteredData.length }}</span>
          </div>
        </div>
        
        <div class="header-controls">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索课件名称..." 
            clearable
            :prefix-icon="'Search'"
            @input="handleFilterChange"
            class="header-search-input"
          />
          <div class="view-toggle">
            <el-button-group>
              <el-button 
                :type="viewMode === 'grid' ? 'primary' : ''" 
                @click="viewMode = 'grid'"
                size="small"
              >
                网格
              </el-button>
              <el-button 
                :type="viewMode === 'list' ? 'primary' : ''" 
                @click="viewMode = 'list'"
                size="small"
              >
                列表
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="courseware-grid">
        <div 
          v-for="item in filteredData" 
          :key="item.id" 
          class="courseware-card"
          :class="`card-${item.type}`"
          draggable="true"
          @dragstart="handleDragStart(item, $event)"
          @dragend="handleDragEnd"
        >
          <div class="card-header">
            <div class="type-badge" :class="`badge-${item.type}`">
              {{ item.type === 'courseware' ? '课件' : '教案' }}
            </div>
          </div>
          
          <div class="card-content">
            <h3 class="item-title">{{ item.name }}</h3>
            <p class="item-description">{{ item.description }}</p>

            <div class="courseware-stats">
              <div class="stat-cell full-width">
                <el-icon><User /></el-icon>
                <span>{{ item.targetAudience }}</span>
              </div>
              <div class="stat-cell">
                <el-icon><Timer /></el-icon>
                <span>{{ item.readTime }} 小时阅读</span>
              </div>
              <div class="stat-cell">
                <el-icon><DataLine /></el-icon>
                <span>{{ item.usageCount }} 次使用</span>
              </div>
            </div>
          </div>
          
          <div class="card-actions">
            <el-button type="warning" :icon="Cpu" size="small" @click="analyzeItem(item)">
              AI智能分析
            </el-button>
            <el-button type="primary" size="small" @click="viewItem(item)">
              详情
            </el-button>
            <el-button size="small" @click="downloadItem(item)">
              下载
            </el-button>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="courseware-list">
        <div class="list-header">
          <div class="header-cell">名称</div>
          <div class="header-cell">课件说明</div>
          <div class="header-cell">类型</div>
          <div class="header-cell">操作</div>
        </div>
        
        <div 
          v-for="item in filteredData" 
          :key="item.id" 
          class="list-item"
          draggable="true"
          @dragstart="handleDragStart(item, $event)"
          @dragend="handleDragEnd"
        >
          <div class="item-cell">
            <div class="item-name">{{ item.name }}</div>
          </div>
          <div class="item-cell">
            <div class="item-desc">{{ item.description }}</div>
          </div>
          <div class="item-cell">
            <span class="type-tag" :class="`tag-${item.type}`">
              {{ item.type === 'courseware' ? '课件' : '教案' }}
            </span>
          </div>
          <div class="item-cell">
            <div class="action-buttons">
              <el-button type="warning" :icon="Cpu" size="small" @click="analyzeItem(item)">
                AI分析
              </el-button>
              <el-button type="primary" size="small" @click="viewItem(item)">
                查看
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredData.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <div class="empty-text">暂无课件教案数据</div>
        <div class="empty-desc">请检查筛选条件或联系管理员</div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      :title="currentItem?.name"
      width="80%"
      class="detail-dialog"
    >
      <div v-if="currentItem" class="detail-content">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h3 class="section-title">📋 基本信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">课件类型</span>
              <span class="info-value">{{ currentItem.type === 'courseware' ? '课件' : '教案' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">使用课程</span>
              <span class="info-value">{{ currentItem.courseName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">学年学期</span>
              <span class="info-value">{{ currentItem.academicYear }} {{ getSemesterName(currentItem.semester) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">授课对象</span>
              <span class="info-value">{{ currentItem.targetAudience }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">总学时</span>
              <span class="info-value">{{ currentItem.totalHours }} 学时</span>
            </div>
            <div class="info-item">
              <span class="info-label">学分</span>
              <span class="info-value">{{ currentItem.credits }} 学分</span>
            </div>
            <div class="info-item">
              <span class="info-label">班级数量</span>
              <span class="info-value">{{ currentItem.classCount }} 个班级</span>
            </div>
            <div class="info-item">
              <span class="info-label">学生数量</span>
              <span class="info-value">{{ currentItem.studentCount }} 人</span>
            </div>
          </div>
        </div>

        <!-- 课程描述 -->
        <div class="detail-section">
          <h3 class="section-title">📝 课程描述</h3>
          <p class="description-text">{{ currentItem.description }}</p>
        </div>

        <!-- 教学目标 -->
        <div class="detail-section">
          <h3 class="section-title">🎯 教学目标</h3>
          <ul class="objectives-list">
            <li v-for="(objective, index) in generatedContent.objectives" :key="index">
              {{ objective }}
            </li>
          </ul>
        </div>

        <!-- 课程大纲 -->
        <div class="detail-section">
          <h3 class="section-title">📚 课程大纲</h3>
          <div class="outline-container">
            <div 
              v-for="(chapter, index) in generatedContent.outline" 
              :key="index"
              class="chapter-item"
            >
              <div class="chapter-header">
                <span class="chapter-number">第{{ index + 1 }}章</span>
                <span class="chapter-title">{{ chapter.title }}</span>
                <span class="chapter-hours">{{ chapter.hours }}学时</span>
              </div>
              <ul class="topics-list">
                <li v-for="(topic, tIndex) in chapter.topics" :key="tIndex">
                  {{ topic }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 考核方式 -->
        <div class="detail-section">
          <h3 class="section-title">✅ 考核方式</h3>
          <div class="assessment-grid">
            <div 
              v-for="(assessment, index) in generatedContent.assessments" 
              :key="index"
              class="assessment-item"
            >
              <div class="assessment-name">{{ assessment.name }}</div>
              <div class="assessment-weight">占比 {{ assessment.weight }}%</div>
            </div>
          </div>
        </div>

        <!-- 参考资料 -->
        <div class="detail-section">
          <h3 class="section-title">📖 参考资料</h3>
          <ul class="references-list">
            <li v-for="(reference, index) in generatedContent.references" :key="index">
              {{ reference }}
            </li>
          </ul>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="downloadItem(currentItem)">下载课件</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { User, Timer, DataLine, Cpu } from '@element-plus/icons-vue'

// 注入全局事件总线
const eventBus = inject('eventBus')

// 响应式数据
const viewMode = ref('grid')
const filters = ref({
  academicYear: '',
  semester: '',
  type: '',
  keyword: ''
})

// 详情弹窗相关
const detailDialogVisible = ref(false)
const currentItem = ref(null)
const generatedContent = ref({
  objectives: [],
  outline: [],
  assessments: [],
  references: []
})

// 模拟数据
const coursewareData = ref([
  {
    id: 1,
    name: '数据结构与算法基础',
    description: '涵盖线性表、栈、队列、树、图等基础数据结构',
    type: 'courseware',
    academicYear: '2025-2026',
    semester: 'spring',
    targetAudience: '计算机科学2201',
    totalHours: 64,
    credits: 4,
    courseName: '数据结构与算法',
    classCount: 3,
    studentCount: 156,
    readTime: 125,
    usageCount: 846,
    createTime: '2025-01-15',
    updateTime: '2025-01-20'
  },
  {
    id: 2,
    name: '软件工程导论教案',
    description: '软件开发生命周期、需求分析、系统设计等核心概念',
    type: 'lesson-plan',
    academicYear: '2025-2026',
    semester: 'spring',
    targetAudience: '软件工程2201',
    totalHours: 48,
    credits: 3,
    courseName: '软件工程导论',
    classCount: 2,
    studentCount: 98,
    readTime: 86,
    usageCount: 523,
    createTime: '2025-01-10',
    updateTime: '2025-01-18'
  },
  {
    id: 3,
    name: '机器学习基础课件',
    description: '监督学习、无监督学习、深度学习基础理论',
    type: 'courseware',
    academicYear: '2024-2025',
    semester: 'autumn',
    targetAudience: '人工智能2201',
    totalHours: 72,
    credits: 4,
    courseName: '机器学习基础',
    classCount: 2,
    studentCount: 84,
    readTime: 310,
    usageCount: 1102,
    createTime: '2024-09-01',
    updateTime: '2024-12-15'
  },
  {
    id: 4,
    name: '数据库系统原理教案',
    description: '关系数据库、SQL语言、数据库设计理论',
    type: 'lesson-plan',
    academicYear: '2024-2025',
    semester: 'autumn',
    targetAudience: '计算机科学2101',
    totalHours: 56,
    credits: 3.5,
    courseName: '数据库系统原理',
    classCount: 4,
    studentCount: 192,
    readTime: 142,
    usageCount: 955,
    createTime: '2024-08-20',
    updateTime: '2024-11-30'
  },
  {
    id: 5,
    name: 'Web开发技术课件',
    description: 'HTML5、CSS3、JavaScript、Vue.js前端开发技术',
    type: 'courseware',
    academicYear: '2023-2024',
    semester: 'spring',
    targetAudience: '软件工程2102',
    totalHours: 64,
    credits: 4,
    courseName: 'Web开发技术',
    classCount: 3,
    studentCount: 135,
    readTime: 215,
    usageCount: 1420,
    createTime: '2024-02-01',
    updateTime: '2024-05-20'
  },
  {
    id: 6,
    name: '操作系统原理教案',
    description: '进程管理、内存管理、文件系统、设备管理',
    type: 'lesson-plan',
    academicYear: '2023-2024',
    semester: 'spring',
    targetAudience: '计算机科学2001',
    totalHours: 72,
    credits: 4,
    courseName: '操作系统原理',
    classCount: 2,
    studentCount: 96,
    readTime: 188,
    usageCount: 890,
    createTime: '2024-01-15',
    updateTime: '2024-06-10'
  }
])

// 计算属性
const filteredData = computed(() => {
  let filtered = coursewareData.value

  // 学年筛选
  if (filters.value.academicYear) {
    filtered = filtered.filter(item => item.academicYear === filters.value.academicYear)
  }

  // 学期筛选
  if (filters.value.semester) {
    filtered = filtered.filter(item => item.semester === filters.value.semester)
  }

  // 类型筛选
  if (filters.value.type) {
    filtered = filtered.filter(item => item.type === filters.value.type)
  }

  // 关键词搜索
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      item.courseName.toLowerCase().includes(keyword) ||
      item.targetAudience.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

const totalCourseware = computed(() => {
  return coursewareData.value.filter(item => item.type === 'courseware').length
})

const totalLessonPlans = computed(() => {
  return coursewareData.value.filter(item => item.type === 'lesson-plan').length
})

const totalStudents = computed(() => {
  return coursewareData.value.reduce((sum, item) => sum + item.studentCount, 0)
})

const totalClasses = computed(() => {
  return coursewareData.value.reduce((sum, item) => sum + item.classCount, 0)
})

// 方法
const handleFilterChange = () => {
  // 筛选逻辑已在计算属性中处理
}

const getSemesterName = (semester) => {
  const semesterMap = {
    'spring': '春季学期',
    'autumn': '秋季学期',
    'summer': '夏季学期'
  }
  return semesterMap[semester] || semester
}

const generateCourseContent = (item) => {
  // 根据课件名称生成对应的详细内容
  const contentMap = {
    '数据结构与算法基础': {
      objectives: [
        '掌握线性表、栈、队列、树、图等基本数据结构的概念、特性和应用场景',
        '理解各种数据结构的存储方式和基本操作的实现原理',
        '能够根据实际问题选择合适的数据结构进行建模和求解',
        '培养算法设计与分析的能力，提升程序设计的效率和质量'
      ],
      outline: [
        {
          title: '绪论与算法基础',
          hours: 6,
          topics: [
            '数据结构的基本概念和术语',
            '算法的特性与评价标准',
            '时间复杂度与空间复杂度分析'
          ]
        },
        {
          title: '线性表',
          hours: 8,
          topics: [
            '线性表的逻辑结构和存储结构',
            '顺序表的实现与操作',
            '链表的实现与应用'
          ]
        },
        {
          title: '栈和队列',
          hours: 8,
          topics: [
            '栈的定义及基本操作',
            '队列的定义及基本操作',
            '栈和队列的应用实例'
          ]
        },
        {
          title: '树与二叉树',
          hours: 12,
          topics: [
            '树的基本概念和性质',
            '二叉树的遍历算法',
            '二叉搜索树和平衡树'
          ]
        },
        {
          title: '图',
          hours: 12,
          topics: [
            '图的基本概念和存储结构',
            '图的遍历算法（DFS和BFS）',
            '最短路径和最小生成树算法'
          ]
        },
        {
          title: '查找与排序',
          hours: 10,
          topics: [
            '顺序查找、二分查找、哈希查找',
            '冒泡、选择、插入、快速排序',
            '归并排序和堆排序'
          ]
        },
        {
          title: '综合实践与案例分析',
          hours: 8,
          topics: [
            '数据结构在实际项目中的应用',
            '算法优化与性能分析',
            '课程设计与项目实践'
          ]
        }
      ],
      assessments: [
        { name: '平时作业', weight: 20 },
        { name: '实验项目', weight: 30 },
        { name: '期中考试', weight: 20 },
        { name: '期末考试', weight: 30 }
      ],
      references: [
        '《数据结构》（C语言版）- 严蔚敏，吴伟民 著',
        '《算法导论》- Thomas H. Cormen 等 著',
        '《数据结构与算法分析》- Mark Allen Weiss 著',
        '在线资源：LeetCode 算法练习平台'
      ]
    },
    '软件工程导论教案': {
      objectives: [
        '理解软件工程的基本概念、原理和方法',
        '掌握软件开发生命周期各阶段的主要任务和技术',
        '能够应用软件工程方法进行需求分析、系统设计和项目管理',
        '培养团队协作能力和软件项目管理意识'
      ],
      outline: [
        {
          title: '软件工程概述',
          hours: 6,
          topics: [
            '软件工程的产生与发展',
            '软件危机与软件工程',
            '软件过程模型'
          ]
        },
        {
          title: '需求工程',
          hours: 8,
          topics: [
            '需求获取的方法与技术',
            '需求分析与建模',
            '需求规格说明书编写'
          ]
        },
        {
          title: '系统设计',
          hours: 10,
          topics: [
            '概要设计与详细设计',
            '面向对象设计方法',
            '设计模式与架构设计'
          ]
        },
        {
          title: '软件实现与测试',
          hours: 10,
          topics: [
            '编码规范与代码质量',
            '软件测试策略与方法',
            '单元测试与集成测试'
          ]
        },
        {
          title: '软件项目管理',
          hours: 8,
          topics: [
            '项目计划与进度控制',
            '成本估算与风险管理',
            '配置管理与版本控制'
          ]
        },
        {
          title: '软件维护与演化',
          hours: 6,
          topics: [
            '软件维护的类型与过程',
            '软件重构与逆向工程',
            '遗留系统的演化'
          ]
        }
      ],
      assessments: [
        { name: '课堂参与', weight: 10 },
        { name: '作业与实验', weight: 30 },
        { name: '小组项目', weight: 30 },
        { name: '期末考试', weight: 30 }
      ],
      references: [
        '《软件工程导论》- 张海藩 著',
        '《软件工程：实践者的研究方法》- Roger S. Pressman 著',
        '《人月神话》- Frederick P. Brooks Jr. 著',
        '敏捷开发相关书籍和在线资源'
      ]
    },
    '机器学习基础课件': {
      objectives: [
        '理解机器学习的基本概念、分类和应用场景',
        '掌握监督学习、无监督学习的核心算法',
        '能够使用Python和相关库实现常见的机器学习模型',
        '培养数据分析和模型评估的能力'
      ],
      outline: [
        {
          title: '机器学习概述',
          hours: 6,
          topics: [
            '机器学习的定义与发展历程',
            '机器学习的分类：监督、无监督、强化学习',
            '机器学习的应用领域'
          ]
        },
        {
          title: '线性模型',
          hours: 10,
          topics: [
            '线性回归与最小二乘法',
            '逻辑回归与分类问题',
            '正则化方法：L1和L2正则化'
          ]
        },
        {
          title: '决策树与集成学习',
          hours: 12,
          topics: [
            '决策树的构建与剪枝',
            '随机森林算法',
            'Boosting算法（AdaBoost、GBDT、XGBoost）'
          ]
        },
        {
          title: '支持向量机',
          hours: 8,
          topics: [
            'SVM的基本原理',
            '核函数与核技巧',
            'SVM的应用与参数调优'
          ]
        },
        {
          title: '神经网络与深度学习',
          hours: 14,
          topics: [
            '神经网络的基本结构',
            '反向传播算法',
            '卷积神经网络（CNN）',
            '循环神经网络（RNN）'
          ]
        },
        {
          title: '无监督学习',
          hours: 10,
          topics: [
            '聚类算法：K-means、层次聚类',
            '降维技术：PCA、t-SNE',
            '关联规则学习'
          ]
        },
        {
          title: '模型评估与优化',
          hours: 8,
          topics: [
            '交叉验证与过拟合',
            '性能指标：准确率、召回率、F1分数',
            '超参数调优方法'
          ]
        },
        {
          title: '实践项目',
          hours: 4,
          topics: [
            '真实数据集的处理与分析',
            '端到端机器学习项目实践',
            '模型部署与应用'
          ]
        }
      ],
      assessments: [
        { name: '编程作业', weight: 25 },
        { name: '实验报告', weight: 25 },
        { name: '期中项目', weight: 20 },
        { name: '期末考试', weight: 30 }
      ],
      references: [
        '《机器学习》- 周志华 著',
        '《统计学习方法》- 李航 著',
        '《深度学习》- Ian Goodfellow 等 著',
        'Scikit-learn和TensorFlow官方文档'
      ]
    },
    '数据库系统原理教案': {
      objectives: [
        '掌握数据库系统的基本概念和体系结构',
        '熟练运用SQL语言进行数据库操作',
        '理解关系数据库设计理论和规范化方法',
        '能够进行数据库设计和优化'
      ],
      outline: [
        {
          title: '数据库系统概论',
          hours: 6,
          topics: [
            '数据库的基本概念',
            '数据模型与数据库系统结构',
            '数据库管理系统的功能'
          ]
        },
        {
          title: '关系数据库',
          hours: 8,
          topics: [
            '关系模型的基本概念',
            '关系代数与关系演算',
            '关系的完整性约束'
          ]
        },
        {
          title: 'SQL语言',
          hours: 12,
          topics: [
            'SQL的数据定义功能',
            'SQL的数据查询功能',
            'SQL的数据更新功能',
            '视图、索引和存储过程'
          ]
        },
        {
          title: '数据库设计',
          hours: 10,
          topics: [
            '数据库设计的步骤与方法',
            'E-R模型与概念设计',
            '关系模式的规范化理论'
          ]
        },
        {
          title: '数据库保护',
          hours: 8,
          topics: [
            '事务管理与并发控制',
            '数据库恢复技术',
            '数据库安全性与完整性'
          ]
        },
        {
          title: '数据库优化',
          hours: 8,
          topics: [
            '查询优化技术',
            '索引设计与优化',
            '数据库性能调优'
          ]
        },
        {
          title: '新型数据库技术',
          hours: 4,
          topics: [
            'NoSQL数据库简介',
            '分布式数据库',
            '大数据与数据库'
          ]
        }
      ],
      assessments: [
        { name: '平时作业', weight: 20 },
        { name: '实验操作', weight: 30 },
        { name: '课程设计', weight: 20 },
        { name: '期末考试', weight: 30 }
      ],
      references: [
        '《数据库系统概论》- 王珊、萨师煊 著',
        '《数据库系统实现》- Hector Garcia-Molina 等 著',
        '《高性能MySQL》- Baron Schwartz 等 著',
        'MySQL和PostgreSQL官方文档'
      ]
    },
    'Web开发技术课件': {
      objectives: [
        '掌握HTML5、CSS3、JavaScript等前端核心技术',
        '熟悉Vue.js等现代前端框架的使用',
        '理解Web应用的开发流程和最佳实践',
        '能够独立开发响应式Web应用'
      ],
      outline: [
        {
          title: 'Web开发基础',
          hours: 6,
          topics: [
            'Web技术发展历程',
            'HTTP协议与Web工作原理',
            '开发环境搭建'
          ]
        },
        {
          title: 'HTML5与CSS3',
          hours: 12,
          topics: [
            'HTML5新特性与语义化标签',
            'CSS3选择器与盒模型',
            'Flexbox与Grid布局',
            '响应式设计与媒体查询'
          ]
        },
        {
          title: 'JavaScript基础',
          hours: 10,
          topics: [
            'JavaScript语法与数据类型',
            '函数、闭包与作用域',
            '面向对象与原型链',
            'ES6+新特性'
          ]
        },
        {
          title: 'DOM与BOM',
          hours: 8,
          topics: [
            'DOM操作与事件处理',
            'BOM对象与浏览器API',
            'Ajax与异步编程'
          ]
        },
        {
          title: 'Vue.js框架',
          hours: 14,
          topics: [
            'Vue.js基础与核心概念',
            '组件化开发',
            'Vue Router与状态管理',
            'Vue CLI与项目实战'
          ]
        },
        {
          title: 'Web安全与性能优化',
          hours: 8,
          topics: [
            'XSS与CSRF攻击防护',
            '前端性能优化技巧',
            '浏览器缓存与CDN'
          ]
        },
        {
          title: '综合项目实战',
          hours: 6,
          topics: [
            '完整Web应用开发',
            '前后端交互与接口设计',
            '项目部署与上线'
          ]
        }
      ],
      assessments: [
        { name: '课堂练习', weight: 15 },
        { name: '阶段作业', weight: 25 },
        { name: '项目实战', weight: 35 },
        { name: '期末考试', weight: 25 }
      ],
      references: [
        '《JavaScript高级程序设计》- Nicholas C. Zakas 著',
        '《CSS权威指南》- Eric A. Meyer 著',
        '《Vue.js设计与实现》- 霍春阳 著',
        'MDN Web Docs 和 Vue.js官方文档'
      ]
    },
    '操作系统原理教案': {
      objectives: [
        '理解操作系统的基本概念、功能和设计原理',
        '掌握进程管理、内存管理、文件系统等核心内容',
        '了解操作系统的实现技术和机制',
        '培养系统级编程和问题分析能力'
      ],
      outline: [
        {
          title: '操作系统概述',
          hours: 6,
          topics: [
            '操作系统的定义、功能与分类',
            '操作系统的发展历史',
            '操作系统的体系结构'
          ]
        },
        {
          title: '进程管理',
          hours: 14,
          topics: [
            '进程的概念与状态',
            '进程调度算法',
            '进程同步与互斥',
            '死锁的预防与处理'
          ]
        },
        {
          title: '内存管理',
          hours: 12,
          topics: [
            '内存管理的基本概念',
            '分页与分段机制',
            '虚拟内存技术',
            '页面置换算法'
          ]
        },
        {
          title: '文件系统',
          hours: 12,
          topics: [
            '文件系统的基本概念',
            '文件的逻辑结构与物理结构',
            '目录管理',
            '磁盘管理与优化'
          ]
        },
        {
          title: '输入输出系统',
          hours: 8,
          topics: [
            'I/O设备管理',
            'I/O控制方式',
            '缓冲技术',
            '设备驱动程序'
          ]
        },
        {
          title: '现代操作系统专题',
          hours: 12,
          topics: [
            'Linux操作系统分析',
            '分布式操作系统',
            '实时操作系统',
            '操作系统安全'
          ]
        },
        {
          title: '实验与实践',
          hours: 8,
          topics: [
            '操作系统实验环境搭建',
            '进程与线程编程实验',
            '文件系统操作实验'
          ]
        }
      ],
      assessments: [
        { name: '平时作业', weight: 20 },
        { name: '实验报告', weight: 30 },
        { name: '期中考试', weight: 20 },
        { name: '期末考试', weight: 30 }
      ],
      references: [
        '《操作系统概念》- Abraham Silberschatz 等 著',
        '《现代操作系统》- Andrew S. Tanenbaum 著',
        '《深入理解计算机系统》- Randal E. Bryant 著',
        'Linux内核源码与相关技术文档'
      ]
    }
  }

  // 如果找到匹配的内容则返回，否则返回通用内容
  return contentMap[item.name] || {
    objectives: [
      '掌握本课程的核心知识点和基本技能',
      '理解相关理论知识并能够应用到实际问题中',
      '培养独立思考和问题解决能力',
      '提升专业素养和综合能力'
    ],
    outline: [
      {
        title: '课程导论',
        hours: 6,
        topics: [
          '课程介绍与学习方法',
          '基本概念与理论框架',
          '发展历程与应用前景'
        ]
      },
      {
        title: '基础理论',
        hours: 12,
        topics: [
          '核心概念与原理',
          '基本方法与技术',
          '理论分析与推导'
        ]
      },
      {
        title: '实践应用',
        hours: 12,
        topics: [
          '实际案例分析',
          '应用技巧与方法',
          '项目实践'
        ]
      },
      {
        title: '综合提升',
        hours: 8,
        topics: [
          '高级技术与方法',
          '综合案例研究',
          '课程总结与展望'
        ]
      }
    ],
    assessments: [
      { name: '平时成绩', weight: 20 },
      { name: '作业与实验', weight: 30 },
      { name: '期末考试', weight: 50 }
    ],
    references: [
      '相关教材与参考书',
      '学术论文与期刊',
      '在线学习资源',
      '实践项目文档'
    ]
  }
}

const analyzeItem = (item) => {
  if (eventBus) {
    const typeLabel = item.type === 'courseware' ? '课件' : '教案'
    // 触发 AI 动作
    eventBus.emit('triggerAIAction', {
      prompt: `请帮我分析《${item.name}》这个${typeLabel}。所属项目是"${item.courseName}"，主要面向${item.targetAudience}，课件描述为：${item.description}`
    })
  }
}

const viewItem = (item) => {
  currentItem.value = item
  generatedContent.value = generateCourseContent(item)
  detailDialogVisible.value = true
}

const editItem = (item) => {
  console.log('编辑:', item)
  // 这里可以打开编辑弹窗或跳转到编辑页面
}

const downloadItem = (item) => {
  console.log('下载:', item)
  // 这里可以触发下载逻辑
}

// 拖拽相关方法
const handleDragStart = (item, event) => {
  console.log('开始拖拽课件:', item.name)
  
  // 设置拖拽数据
  const dragData = {
    type: 'courseware',
    id: item.id,
    name: item.name,
    description: item.description,
    courseName: item.courseName,
    coursewareType: item.type === 'courseware' ? '课件' : '教案'
  }
  
  event.dataTransfer.setData('application/json', JSON.stringify(dragData))
  event.dataTransfer.effectAllowed = 'copy'
  
  // 添加拖拽样式
  event.target.style.opacity = '0.5'
  event.target.style.cursor = 'grabbing'
}

const handleDragEnd = (event) => {
  // 恢复样式
  event.target.style.opacity = '1'
  event.target.style.cursor = 'grab'
  console.log('拖拽结束')
}

onMounted(() => {
  // 组件挂载时的初始化逻辑
})
</script>

<style scoped>
.courseware-page {
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.year-select,
.semester-select,
.type-select {
  width: 150px;
}

.search-input {
  width: 250px;
}

/* 统计概览样式 */
.stats-section {
  margin-bottom: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 22px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f0f0f0 100%);
  border-radius: 12px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 内容区域样式 */
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
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: white;
  border-radius: 8px 8px 0 0;
}

/* 统计数据区域 (同教学数据样式) */
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

.header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-search-input {
  width: 240px;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

/* 网格视图样式 - 固定3列 */
.courseware-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 24px;
}

.courseware-card {
  background: #fff;
  border: 1px solid #e0e6f1;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: grab;
}

.courseware-card:active {
  cursor: grabbing;
}

.courseware-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-courseware {
  border-left: 4px solid #8b5cf6;
}

.card-lesson-plan {
  border-left: 4px solid #10b981;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9ff;
  border-bottom: 1px solid #e0e6f1;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-courseware {
  background: #eef6ff;
  color: #8b5cf6;
}

.badge-lesson-plan {
  background: #ecfdf5;
  color: #10b981;
}

.academic-info {
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
  align-content: stretch;
  justify-content: center;
  align-items: center;
}

.academic-year {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.semester {
  font-size: 12px;
  color: #666;
}

.card-content {
  padding: 20px;
}

.item-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.item-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #888;
  font-weight: 500;
}

.stat-value {
  font-size: 14px;
  color: #1677ff;
  font-weight: 600;
}

.course-info {
  background: #f8f9ff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.course-item {
  margin-bottom: 8px;
}

.course-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.course-name {
  font-size: 14px;
  color: #333;
  font-weight: 600;
  margin-left: 8px;
}

.coverage-info {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.coverage-item {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.coverage-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.coverage-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.card-actions {
  padding: 16px 20px;
  background: #f8f9ff;
  border-top: 1px solid #e0e6f1;
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* 列表视图样式 */
.courseware-list {
  padding: 0;
}

.list-header {
  display: grid;
  grid-template-columns: 3fr 4fr 1fr 1fr;
  gap: 16px;
  padding: 16px 24px;
  background: #f8f9ff;
  border-bottom: 1px solid #e0e6f1;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.list-item {
  display: grid;
  grid-template-columns: 3fr 4fr 1fr 1fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background-color 0.2s ease;
  cursor: grab;
}

.list-item:active {
  cursor: grabbing;
}

.list-item:hover {
  background: #f8f9ff;
}

.item-cell {
  font-size: 14px;
  color: #333;
}

.item-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.item-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
}

.type-tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.tag-courseware {
  background: #eef6ff;
  color: #8b5cf6;
}

.tag-lesson-plan {
  background: #ecfdf5;
  color: #10b981;
}

.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.empty-desc {
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .courseware-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .list-header,
  .list-item {
    grid-template-columns: 2fr 2fr 1fr 1.5fr 2fr;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .courseware-page {
    padding: 16px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .year-select,
  .semester-select,
  .type-select,
  .search-input {
    width: 100%;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .courseware-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .list-header,
  .list-item {
    display: none;
  }
  
  .courseware-list {
    display: block;
  }
  
  .list-item {
    display: block;
    margin-bottom: 16px;
    padding: 16px;
    border: 1px solid #e0e6f1;
    border-radius: 8px;
  }
  
  .item-cell {
    margin-bottom: 8px;
  }
  
  .action-buttons {
    justify-content: center;
    margin-top: 12px;
  }
}

/* 详情弹窗样式 */
.detail-dialog :deep(.el-dialog__body) {
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;
}

.detail-content {
  padding: 24px;
}

.detail-section {
  margin-bottom: 32px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #8b5cf6;
  display: inline-block;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  background: #f8f9ff;
  padding: 20px;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.courseware-stats {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #e5e7eb;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #f1f5f9;
}

.stat-cell.full-width {
  grid-column: span 2;
}

.stat-cell .el-icon {
  color: #1677ff;
  font-size: 16px;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.description-text {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  margin: 0;
  padding: 16px;
  background: #f8f9ff;
  border-radius: 8px;
}

.objectives-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.objectives-list li {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #8b5cf6;
  position: relative;
}

.objectives-list li::before {
  content: '✓';
  color: #8b5cf6;
  font-weight: bold;
  margin-right: 8px;
}

.outline-container {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.chapter-item {
  background: #f8f9ff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e0e6f1;
}

.chapter-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e6f1;
  flex-direction: column;
}

.chapter-number {
  background: #8b5cf6;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.chapter-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.chapter-hours {
  font-size: 12px;
  color: #666;
  background: #fff;
  padding: 4px 12px;
  border-radius: 20px;
}

.topics-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.topics-list li {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  padding: 6px 0 6px 20px;
  position: relative;
}

.topics-list li::before {
  content: '•';
  color: #8b5cf6;
  font-weight: bold;
  position: absolute;
  left: 8px;
}

.assessment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.assessment-item {
  background: #f8f9ff;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #e0e6f1;
  transition: all 0.3s ease;
}

.assessment-item:hover {
  border-color: #8b5cf6;
  transform: translateY(-2px);
}

.assessment-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.assessment-weight {
  font-size: 20px;
  font-weight: 700;
  color: #8b5cf6;
}

.references-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.references-list li {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.references-list li::before {
  content: '📚';
  margin-right: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
