<template>
  <div class="courses-page">
    <!-- 课程列表 -->
    <div class="content-section">
      <div class="section-header">
        <div class="stats-overview">
          <div class="stat-item">
            <span class="stat-label">课程总数：</span>
            <span class="stat-value">{{ filteredData.length }}</span>
          </div>
        </div>
        
        <div class="header-controls">
          <el-input 
            v-model="filters.courseName" 
            placeholder="搜索课程名称" 
            clearable
            @input="handleFilterChange"
            class="header-search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
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
      <div v-if="viewMode === 'grid'" class="courses-grid">
        <div 
          v-for="course in filteredData" 
          :key="course.id" 
          class="course-card"
        >
          <div class="card-header">
            <div class="course-title">{{ course.name }}</div>
            <div class="completion-badge" :class="getCompletionClass(course.completion)">
              {{ course.completion }}%
            </div>
          </div>
          
          <div class="card-content">
            <div class="course-info">
              <div class="info-item">
                <span class="info-label">包含课件</span>
                <span class="info-value" @click="showCourseware(course)">
                  {{ course.coursewareCount }}个
                  <el-icon class="clickable-icon"><View /></el-icon>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">教学经验</span>
                <span class="info-value" @click="showExperience(course)">
                  查看详情
                  <el-icon class="clickable-icon"><View /></el-icon>
                </span>
              </div>
            </div>
            
            <div class="completion-bar">
              <div class="completion-label">完成度</div>
              <el-progress 
                :percentage="course.completion" 
                :color="getProgressColor(course.completion)"
                :show-text="false"
              />
              <div class="completion-text">{{ course.completion }}%</div>
            </div>
            
            <div class="rating-section">
              <div class="rating-item" @click="showStudentRatings(course)">
                <span class="rating-label">学生评价</span>
                <div class="rating-value">
                  <el-rate 
                    v-model="course.studentRating" 
                    disabled 
                    size="small"
                  />
                  <span class="rating-text">{{ course.studentRating }}分</span>
                </div>
              </div>
              <div class="rating-item" @click="showSupervisorRatings(course)">
                <span class="rating-label">督导评价</span>
                <div class="rating-value">
                  <el-rate 
                    v-model="course.supervisorRating" 
                    disabled 
                    size="small"
                  />
                  <span class="rating-text">{{ course.supervisorRating }}分</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-actions">
            <el-button type="primary" size="small" @click="viewCourse(course)">
              查看详情
            </el-button>
            <el-button size="small" @click="editCourse(course)">
              编辑
            </el-button>
            <el-button size="small" @click="manageCourse(course)">
              管理
            </el-button>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="courses-list">
        <div class="list-header">
          <div class="header-cell">课程名称</div>
          <div class="header-cell">包含课件</div>
          <div class="header-cell">教学经验</div>
          <div class="header-cell">完成度</div>
          <div class="header-cell">学生评价</div>
          <div class="header-cell">督导评价</div>
          <div class="header-cell">操作</div>
        </div>
        
        <div 
          v-for="course in filteredData" 
          :key="course.id" 
          class="list-item"
        >
          <div class="item-cell">
            <div class="course-name">{{ course.name }}</div>
          </div>
          <div class="item-cell">
            <span class="clickable-text" @click="showCourseware(course)">
              {{ course.coursewareCount }}个
              <el-icon class="clickable-icon"><View /></el-icon>
            </span>
          </div>
          <div class="item-cell">
            <span class="clickable-text" @click="showExperience(course)">
              查看详情
              <el-icon class="clickable-icon"><View /></el-icon>
            </span>
          </div>
          <div class="item-cell">
            <div class="completion-display">
              <el-progress 
                :percentage="course.completion" 
                :color="getProgressColor(course.completion)"
                :show-text="false"
                :stroke-width="6"
              />
              <span class="completion-text">{{ course.completion }}%</span>
            </div>
          </div>
          <div class="item-cell">
            <div class="rating-display-simple">
              <span class="rating-score">{{ course.studentRating }}分</span>
              <span class="rating-link" @click="showStudentRatings(course)">查看</span>
            </div>
          </div>
          <div class="item-cell">
            <div class="rating-display-simple">
              <span class="rating-score">{{ course.supervisorRating }}分</span>
              <span class="rating-link" @click="showSupervisorRatings(course)">查看</span>
            </div>
          </div>
          <div class="item-cell">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="viewCourse(course)">
                查看
              </el-button>
              <el-button size="small" @click="editCourse(course)">
                编辑
              </el-button>
              <el-button size="small" @click="manageCourse(course)">
                管理
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredData.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <div class="empty-text">暂无课程数据</div>
        <div class="empty-desc">请检查筛选条件或联系管理员</div>
      </div>
    </div>

    <!-- 课件详情弹窗 -->
    <el-dialog
      v-model="coursewareDialogVisible"
      title="课程课件"
      width="800px"
      :before-close="handleClose"
    >
      <div class="courseware-dialog-content">
        <h4>{{ currentCourse?.name }} - 关联课件</h4>
        <div class="courseware-list">
          <div 
            v-for="courseware in currentCourse?.coursewareList" 
            :key="courseware.id"
            class="courseware-item"
          >
            <div class="courseware-info">
              <div class="courseware-name">{{ courseware.name }}</div>
              <div class="courseware-desc">{{ courseware.description }}</div>
            </div>
            <div class="courseware-actions">
              <el-button size="small" @click="viewCourseware(courseware)">查看</el-button>
              <el-button size="small" @click="downloadCourseware(courseware)">下载</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 教学经验弹窗 -->
    <el-dialog
      v-model="experienceDialogVisible"
      title="教学经验"
      width="800px"
      :before-close="handleClose"
    >
      <div class="experience-dialog-content">
        <h4>{{ currentCourse?.name }} - 教学经验</h4>
        <div class="experience-list">
          <div 
            v-for="experience in currentCourse?.experienceList" 
            :key="experience.id"
            class="experience-item"
          >
            <div class="experience-title">{{ experience.title }}</div>
            <div class="experience-content">{{ experience.content }}</div>
            <div class="experience-meta">
              <span class="experience-date">{{ experience.date }}</span>
              <span class="experience-type">{{ experience.type }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 学生评价弹窗 -->
    <el-dialog
      v-model="studentRatingDialogVisible"
      title="学生评价"
      width="800px"
      :before-close="handleClose"
    >
      <div class="rating-dialog-content">
        <h4>{{ currentCourse?.name }} - 学生评价</h4>
        <div class="rating-summary">
          <div class="rating-overview">
            <div class="rating-score">{{ currentCourse?.studentRating }}</div>
            <div class="rating-label">平均评分</div>
          </div>
          <div class="rating-count">共 {{ currentCourse?.studentRatingCount }} 条评价</div>
        </div>
        <div class="rating-list">
          <div 
            v-for="rating in currentCourse?.studentRatings" 
            :key="rating.id"
            class="rating-item"
          >
            <div class="rating-header">
              <span class="student-name">{{ rating.studentName }}</span>
              <el-rate v-model="rating.score" disabled size="small" />
            </div>
            <div class="rating-comment">{{ rating.comment }}</div>
            <div class="rating-date">{{ rating.date }}</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 督导评价弹窗 -->
    <el-dialog
      v-model="supervisorRatingDialogVisible"
      title="督导评价"
      width="800px"
      :before-close="handleClose"
    >
      <div class="rating-dialog-content">
        <h4>{{ currentCourse?.name }} - 督导评价</h4>
        <div class="rating-summary">
          <div class="rating-overview">
            <div class="rating-score">{{ currentCourse?.supervisorRating }}</div>
            <div class="rating-label">平均评分</div>
          </div>
          <div class="rating-count">共 {{ currentCourse?.supervisorRatingCount }} 条评价</div>
        </div>
        <div class="rating-list">
          <div 
            v-for="rating in currentCourse?.supervisorRatings" 
            :key="rating.id"
            class="rating-item"
          >
            <div class="rating-header">
              <span class="supervisor-name">{{ rating.supervisorName }}</span>
              <el-rate v-model="rating.score" disabled size="small" />
            </div>
            <div class="rating-comment">{{ rating.comment }}</div>
            <div class="rating-date">{{ rating.date }}</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 课程详情弹窗 -->
    <el-dialog
      v-model="courseDetailDialogVisible"
      :title="currentCourse?.name + ' - 课程详情'"
      width="900px"
      :before-close="handleClose"
    >
      <div class="course-detail-content">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <div class="basic-info-grid">
            <div class="info-row">
              <span class="label">课程代码：</span>
              <span class="value">{{ currentCourse?.detail?.courseCode }}</span>
            </div>
            <div class="info-row">
              <span class="label">学分：</span>
              <span class="value">{{ currentCourse?.detail?.credits }} 学分</span>
            </div>
            <div class="info-row">
              <span class="label">学时：</span>
              <span class="value">{{ currentCourse?.detail?.hours }} 学时</span>
            </div>
            <div class="info-row">
              <span class="label">开课学期：</span>
              <span class="value">{{ currentCourse?.detail?.semester }}</span>
            </div>
          </div>
        </div>

        <!-- 课程简介 -->
        <div class="detail-section">
          <h3 class="section-title">课程简介</h3>
          <p class="description-text">{{ currentCourse?.detail?.description }}</p>
        </div>

        <!-- 教学目标 -->
        <div class="detail-section">
          <h3 class="section-title">教学目标</h3>
          <ul class="objectives-list">
            <li v-for="(objective, index) in currentCourse?.detail?.objectives" :key="index">
              {{ objective }}
            </li>
          </ul>
        </div>

        <!-- 课程章节 -->
        <div class="detail-section">
          <h3 class="section-title">课程章节</h3>
          <div class="chapters-list">
            <div 
              v-for="(chapter, index) in currentCourse?.detail?.chapters" 
              :key="index"
              class="chapter-item"
            >
              <div class="chapter-title">{{ chapter.title }}</div>
              <div class="chapter-topics">
                <span 
                  v-for="(topic, tIndex) in chapter.topics" 
                  :key="tIndex"
                  class="topic-tag"
                >
                  {{ topic }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 教学方法 -->
        <div class="detail-section">
          <h3 class="section-title">教学方法</h3>
          <p class="description-text">{{ currentCourse?.detail?.teachingMethod }}</p>
        </div>

        <!-- 考核方式 -->
        <div class="detail-section">
          <h3 class="section-title">考核方式</h3>
          <p class="description-text">{{ currentCourse?.detail?.assessment }}</p>
        </div>

        <!-- 题库 -->
        <div class="detail-section" v-if="currentCourse?.detail?.questions">
          <h3 class="section-title">题库</h3>
          <el-table :data="currentCourse?.detail?.questions" stripe style="width: 100%">
            <el-table-column prop="type" label="题型" width="100" />
            <el-table-column prop="difficulty" label="难度" width="100">
              <template #default="{ row }">
                <el-tag :type="getDifficultyType(row.difficulty)" size="small">{{ row.difficulty }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="题目内容" />
            <el-table-column prop="answer" label="参考答案" width="150" />
          </el-table>
        </div>

        <!-- 实训任务 -->
        <div class="detail-section" v-if="currentCourse?.detail?.practicalTasks">
          <h3 class="section-title">实训任务</h3>
          <el-table :data="currentCourse?.detail?.practicalTasks" stripe style="width: 100%">
            <el-table-column prop="name" label="任务名称" width="150" />
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="duration" label="时长" width="100" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="difficulty" label="难度" width="100">
              <template #default="{ row }">
                <el-tag :type="getDifficultyType(row.difficulty)" size="small">{{ row.difficulty }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 教案 -->
        <div class="detail-section" v-if="currentCourse?.detail?.lessonPlans">
          <h3 class="section-title">教案</h3>
          <div class="lesson-plans-list">
            <div 
              v-for="(plan, index) in currentCourse?.detail?.lessonPlans" 
              :key="index"
              class="lesson-plan-item"
            >
              <div class="plan-header">
                <span class="plan-title">{{ plan.title }}</span>
                <el-tag type="info" size="small">{{ plan.week }}</el-tag>
              </div>
              <p class="plan-content">{{ plan.content }}</p>
              <div class="plan-keypoints">
                <strong>重点：</strong>
                <span 
                  v-for="(point, pIndex) in plan.keyPoints" 
                  :key="pIndex"
                  class="keypoint-tag"
                >
                  {{ point }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 知识图谱 -->
        <div class="detail-section" v-if="currentCourse?.detail?.knowledgeGraph">
          <h3 class="section-title">知识图谱</h3>
          <div class="graph-content">
            <div class="graph-nodes">
              <strong>知识节点：</strong>
              <el-tag 
                v-for="(node, index) in currentCourse?.detail?.knowledgeGraph.nodes" 
                :key="index"
                type="primary"
                size="small"
                style="margin: 4px"
              >
                {{ node }}
              </el-tag>
            </div>
            <div class="graph-relations" style="margin-top: 12px">
              <strong>知识关系：</strong>
              <div 
                v-for="(relation, index) in currentCourse?.detail?.knowledgeGraph.relations" 
                :key="index"
                class="relation-item"
              >
                <el-tag size="small">{{ relation.from }}</el-tag>
                <span style="margin: 0 8px">—— {{ relation.type }} ——</span>
                <el-tag size="small">{{ relation.to }}</el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 能力图谱 -->
        <div class="detail-section" v-if="currentCourse?.detail?.abilityGraph">
          <h3 class="section-title">能力图谱</h3>
          <div class="ability-chart">
            <div 
              v-for="(dimension, index) in currentCourse?.detail?.abilityGraph.dimensions" 
              :key="index"
              class="ability-item"
            >
              <span class="ability-name">{{ dimension }}</span>
              <el-progress 
                :percentage="currentCourse?.detail?.abilityGraph.scores[index]"
                :color="getProgressColor(currentCourse?.detail?.abilityGraph.scores[index])"
              />
            </div>
          </div>
        </div>

        <!-- 课程关联图谱 -->
        <div class="detail-section" v-if="currentCourse?.detail?.relationGraph">
          <h3 class="section-title">课程关联图谱</h3>
          <div class="relation-graph">
            <div class="relation-row">
              <strong>前置课程：</strong>
              <el-tag 
                v-for="(course, index) in currentCourse?.detail?.relationGraph.prerequisite" 
                :key="index"
                type="warning"
                size="small"
                style="margin: 4px"
              >
                {{ course }}
              </el-tag>
            </div>
            <div class="relation-row">
              <strong>后续课程：</strong>
              <el-tag 
                v-for="(course, index) in currentCourse?.detail?.relationGraph.follow" 
                :key="index"
                type="success"
                size="small"
                style="margin: 4px"
              >
                {{ course }}
              </el-tag>
            </div>
            <div class="relation-row">
              <strong>相关课程：</strong>
              <el-tag 
                v-for="(course, index) in currentCourse?.detail?.relationGraph.related" 
                :key="index"
                type="info"
                size="small"
                style="margin: 4px"
              >
                {{ course }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 素质图谱 -->
        <div class="detail-section" v-if="currentCourse?.detail?.qualityGraph">
          <h3 class="section-title">素质图谱</h3>
          <div class="quality-chart">
            <div 
              v-for="(quality, index) in currentCourse?.detail?.qualityGraph.qualities" 
              :key="index"
              class="quality-item"
            >
              <span class="quality-name">{{ quality }}</span>
              <el-progress 
                :percentage="currentCourse?.detail?.qualityGraph.levels[index]"
                :color="getProgressColor(currentCourse?.detail?.qualityGraph.levels[index])"
              />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, View } from '@element-plus/icons-vue'

// 响应式数据
const viewMode = ref('grid')
const filters = ref({
  courseName: ''
})

// 弹窗控制
const coursewareDialogVisible = ref(false)
const experienceDialogVisible = ref(false)
const studentRatingDialogVisible = ref(false)
const supervisorRatingDialogVisible = ref(false)
const courseDetailDialogVisible = ref(false)
const currentCourse = ref(null)

// 模拟数据
const coursesData = ref([
  {
    id: 1,
    name: '数据结构与算法',
    completion: 85,
    studentRating: 4.5,
    supervisorRating: 4.2,
    coursewareCount: 12,
    coursewareList: [
      { id: 1, name: '线性表基础', description: '线性表的基本概念和操作' },
      { id: 2, name: '栈和队列', description: '栈和队列的实现与应用' },
      { id: 3, name: '树结构', description: '二叉树和平衡树' }
    ],
    experienceList: [
      { id: 1, title: '算法教学心得', content: '通过实例讲解算法思想，学生理解更深入', date: '2024-12-01', type: '教学反思' },
      { id: 2, title: '数据结构实践', content: '结合编程实践，提高学生动手能力', date: '2024-11-15', type: '教学方法' }
    ],
    studentRatingCount: 45,
    studentRatings: [
      { id: 1, studentName: '张三', score: 5, comment: '老师讲解很清晰，课程内容很实用', date: '2024-12-10' },
      { id: 2, studentName: '李四', score: 4, comment: '课程难度适中，收获很大', date: '2024-12-08' }
    ],
    supervisorRatingCount: 3,
    supervisorRatings: [
      { id: 1, supervisorName: '王教授', score: 4, comment: '教学方法新颖，学生参与度高', date: '2024-12-05' },
      { id: 2, supervisorName: '李教授', score: 5, comment: '课程设计合理，效果良好', date: '2024-11-28' }
    ],
    detail: {
      courseCode: 'CS201',
      credits: 4,
      hours: 64,
      semester: '2024年春季',
      description: '本课程系统介绍数据结构的基本概念、算法设计与分析方法。课程内容包括线性表、栈、队列、树、图等基本数据结构，以及排序、查找等常用算法。通过本课程的学习，使学生掌握数据结构的基本理论和算法设计方法，培养学生分析问题和解决问题的能力。',
      objectives: [
        '掌握常用数据结构的逻辑结构、存储结构及基本操作',
        '理解算法设计的基本思想和分析方法',
        '能够针对实际问题选择合适的数据结构和算法',
        '培养良好的编程习惯和代码规范意识'
      ],
      chapters: [
        { title: '第1章 绪论', topics: ['数据结构的基本概念', '算法与算法分析', '抽象数据类型'] },
        { title: '第2章 线性表', topics: ['顺序表', '链表', '栈', '队列'] },
        { title: '第3章 串、数组和广义表', topics: ['串的模式匹配', '数组的表示', '特殊矩阵'] },
        { title: '第4章 树和二叉树', topics: ['二叉树的遍历', '线索二叉树', '树和森林'] },
        { title: '第5章 图', topics: ['图的存储结构', '图的遍历', '最短路径', '拓扑排序'] },
        { title: '第6章 查找', topics: ['线性表查找', '树表查找', '散列表'] },
        { title: '第7章 排序', topics: ['插入排序', '交换排序', '选择排序', '归并排序'] }
      ],
      teachingMethod: '采用理论讲授与实践编程相结合的教学方式，通过大量实例和编程练习帮助学生理解和掌握数据结构与算法的核心内容。',
      assessment: '平时成绩30%（作业+考勤）+ 实验成绩20% + 期末考试50%',
      questions: [
        { id: 1, type: '选择题', difficulty: '中等', content: '在一个长度为n的顺序表中插入一个元素，最坏情况下需要移动多少个元素？', answer: 'n个元素' },
        { id: 2, type: '编程题', difficulty: '困难', content: '实现二叉树的三种遍历算法（前序、中序、后序）', answer: '见参考代码' },
        { id: 3, type: '简答题', difficulty: '简单', content: '简述栈和队列的区别', answer: '栈是后进先出(LIFO)，队列是先进先出(FIFO)' },
        { id: 4, type: '算法题', difficulty: '困难', content: '设计一个时间复杂度为O(nlogn)的排序算法', answer: '快速排序/归并排序' },
        { id: 5, type: '分析题', difficulty: '中等', content: '分析冒泡排序和快速排序的时间复杂度', answer: '冒泡O(n²)，快排平均O(nlogn)' }
      ],
      practicalTasks: [
        { id: 1, name: '链表基本操作实现', type: '编程实训', duration: '4学时', description: '实现单链表的创建、插入、删除、查找等基本操作', difficulty: '中等' },
        { id: 2, name: '栈与队列应用', type: '综合实训', duration: '6学时', description: '使用栈实现表达式求值，使用队列模拟银行排队系统', difficulty: '中等' },
        { id: 3, name: '二叉树遍历与应用', type: '编程实训', duration: '4学时', description: '实现二叉树的递归和非递归遍历算法', difficulty: '困难' },
        { id: 4, name: '图的遍历算法', type: '综合实训', duration: '6学时', description: '实现DFS和BFS算法，并应用于实际问题', difficulty: '困难' },
        { id: 5, name: '排序算法性能比较', type: '研究性实训', duration: '8学时', description: '实现多种排序算法并进行性能测试和比较分析', difficulty: '中等' }
      ],
      lessonPlans: [
        { id: 1, title: '线性表教案', week: '第3-4周', content: '讲解顺序表和链表的存储结构，通过动画演示帮助学生理解', keyPoints: ['存储结构对比', '时间复杂度分析'] },
        { id: 2, title: '树结构教案', week: '第7-9周', content: '从二叉树入手，逐步扩展到一般树和森林', keyPoints: ['递归思想', '遍历算法'] },
        { id: 3, title: '图论基础教案', week: '第10-12周', content: '介绍图的存储和遍历，结合实际案例讲解应用', keyPoints: ['邻接矩阵与邻接表', '最短路径问题'] }
      ],
      knowledgeGraph: {
        nodes: ['数据结构', '线性表', '树', '图', '栈', '队列', '排序', '查找'],
        relations: [
          { from: '数据结构', to: '线性表', type: '包含' },
          { from: '数据结构', to: '树', type: '包含' },
          { from: '数据结构', to: '图', type: '包含' },
          { from: '线性表', to: '栈', type: '派生' },
          { from: '线性表', to: '队列', type: '派生' }
        ]
      },
      abilityGraph: {
        dimensions: ['编程能力', '算法设计', '问题分析', '代码优化', '数据建模'],
        scores: [85, 78, 82, 75, 88]
      },
      relationGraph: {
        prerequisite: ['程序设计基础', 'C语言程序设计'],
        follow: ['算法设计与分析', '操作系统'],
        related: ['数据库系统', '编译原理']
      },
      qualityGraph: {
        qualities: ['逻辑思维', '创新能力', '工程素养', '团队协作', '学习能力'],
        levels: [90, 75, 80, 70, 85]
      }
    }
  },
  {
    id: 2,
    name: '软件工程导论',
    completion: 92,
    studentRating: 4.3,
    supervisorRating: 4.5,
    coursewareCount: 8,
    coursewareList: [
      { id: 4, name: '软件开发生命周期', description: 'SDLC各阶段详解' },
      { id: 5, name: '需求分析', description: '需求获取和分析方法' }
    ],
    experienceList: [
      { id: 3, title: '项目驱动教学', content: '通过实际项目案例，提高学生实践能力', date: '2024-11-20', type: '教学方法' }
    ],
    studentRatingCount: 38,
    studentRatings: [
      { id: 3, studentName: '王五', score: 4, comment: '课程内容丰富，老师很负责', date: '2024-12-12' }
    ],
    supervisorRatingCount: 2,
    supervisorRatings: [
      { id: 3, supervisorName: '赵教授', score: 4, comment: '课程体系完整，教学效果佳', date: '2024-12-01' }
    ],
    detail: {
      courseCode: 'SE301',
      credits: 3,
      hours: 48,
      semester: '2024年春季',
      description: '软件工程是研究和应用如何以系统化、规范化、可度量的方法来开发、运行和维护软件的工程学科。本课程介绍软件工程的基本概念、原理、方法和工具，涵盖软件生命周期各个阶段的技术和管理。',
      objectives: [
        '理解软件工程的基本概念和原理',
        '掌握软件开发生命周期各阶段的方法和技术',
        '学会使用UML进行软件建模',
        '了解软件项目管理和质量保证的基本知识'
      ],
      chapters: [
        { title: '第1章 软件工程概述', topics: ['软件危机', '软件工程的发展', '软件过程模型'] },
        { title: '第2章 需求工程', topics: ['需求获取', '需求分析', '需求规格说明', '需求验证'] },
        { title: '第3章 软件设计', topics: ['概要设计', '详细设计', '设计模式', 'UML建模'] },
        { title: '第4章 编码与测试', topics: ['编码规范', '单元测试', '集成测试', '系统测试'] },
        { title: '第5章 软件维护', topics: ['维护类型', '维护过程', '软件重构'] },
        { title: '第6章 项目管理', topics: ['项目计划', '风险管理', '成本估算', '进度控制'] }
      ],
      teachingMethod: '采用案例教学法，通过分析实际软件项目案例，让学生理解软件工程的理论和实践。结合小组项目，培养学生的团队协作能力。',
      assessment: '平时成绩30%（作业+课堂参与）+ 项目成绩30% + 期末考试40%',
      questions: [
        { id: 1, type: '简答题', difficulty: '简单', content: '什么是软件危机？它产生的主要原因有哪些？', answer: '软件危机是指在软件开发过程中遇到的一系列严重问题' },
        { id: 2, type: '论述题', difficulty: '中等', content: '比较瀑布模型和敏捷开发的优缺点', answer: '瀑布模型适合需求明确的项目，敏捷开发适合需求变化频繁的项目' },
        { id: 3, type: '设计题', difficulty: '困难', content: '为在线购物系统设计用例图和类图', answer: '见UML建模示例' },
        { id: 4, type: '分析题', difficulty: '中等', content: '分析软件测试的V模型', answer: 'V模型体现了测试与开发阶段的对应关系' }
      ],
      practicalTasks: [
        { id: 1, name: '需求分析文档编写', type: '文档实训', duration: '6学时', description: '为给定的项目编写完整的需求规格说明书', difficulty: '中等' },
        { id: 2, name: 'UML建模实践', type: '设计实训', duration: '8学时', description: '使用UML工具绘制系统的用例图、类图、时序图', difficulty: '中等' },
        { id: 3, name: '软件项目开发', type: '综合实训', duration: '32学时', description: '团队协作完成一个完整的软件项目，经历全部开发阶段', difficulty: '困难' },
        { id: 4, name: '代码审查与重构', type: '编程实训', duration: '4学时', description: '学习代码审查方法，对遗留代码进行重构', difficulty: '中等' }
      ],
      lessonPlans: [
        { id: 1, title: '需求工程教案', week: '第3-5周', content: '介绍需求获取的各种方法，重点讲解用户故事和用例分析', keyPoints: ['需求获取技术', '需求建模'] },
        { id: 2, title: 'UML建模教案', week: '第6-8周', content: '系统讲解UML各种图的使用场景和绘制方法', keyPoints: ['用例图', '类图', '时序图'] },
        { id: 3, title: '敏捷开发教案', week: '第12周', content: '介绍Scrum和XP等敏捷方法论', keyPoints: ['迭代开发', '持续集成'] }
      ],
      knowledgeGraph: {
        nodes: ['软件工程', '需求工程', '软件设计', '软件测试', '项目管理', 'UML', '敏捷开发', '设计模式'],
        relations: [
          { from: '软件工程', to: '需求工程', type: '包含' },
          { from: '软件工程', to: '软件设计', type: '包含' },
          { from: '软件设计', to: 'UML', type: '使用' },
          { from: '软件设计', to: '设计模式', type: '应用' },
          { from: '软件工程', to: '敏捷开发', type: '实践方法' }
        ]
      },
      abilityGraph: {
        dimensions: ['需求分析', '系统设计', '项目管理', '文档编写', '团队协作'],
        scores: [88, 82, 75, 85, 90]
      },
      relationGraph: {
        prerequisite: ['程序设计基础', '数据结构'],
        follow: ['软件项目管理', '软件测试'],
        related: ['数据库系统', '人机交互']
      },
      qualityGraph: {
        qualities: ['系统思维', '沟通能力', '质量意识', '团队精神', '文档能力'],
        levels: [85, 90, 88, 92, 80]
      }
    }
  },
  {
    id: 3,
    name: '机器学习基础',
    completion: 78,
    studentRating: 4.7,
    supervisorRating: 4.3,
    coursewareCount: 15,
    coursewareList: [
      { id: 6, name: '监督学习', description: '分类和回归算法' },
      { id: 7, name: '无监督学习', description: '聚类和降维算法' }
    ],
    experienceList: [
      { id: 4, title: 'AI教学探索', content: '结合最新AI技术，更新教学内容', date: '2024-10-15', type: '教学创新' }
    ],
    studentRatingCount: 52,
    studentRatings: [
      { id: 4, studentName: '赵六', score: 5, comment: '前沿技术，老师讲解很生动', date: '2024-12-15' }
    ],
    supervisorRatingCount: 4,
    supervisorRatings: [
      { id: 4, supervisorName: '陈教授', score: 4, comment: '课程紧跟技术前沿，值得推广', date: '2024-11-30' }
    ],
    detail: {
      courseCode: 'AI401',
      credits: 4,
      hours: 64,
      semester: '2024年秋季',
      description: '机器学习是人工智能的核心技术之一。本课程系统介绍机器学习的基本概念、主要算法和应用方法。涵盖监督学习、无监督学习、强化学习等核心内容，结合Python编程实践，培养学生解决实际问题的能力。',
      objectives: [
        '理解机器学习的基本原理和核心算法',
        '掌握常用机器学习模型的实现和应用',
        '学会使用Python和常用机器学习库（如scikit-learn）',
        '能够针对实际问题设计和实现机器学习解决方案'
      ],
      chapters: [
        { title: '第1章 机器学习概述', topics: ['机器学习定义', '学习类型', '应用场景'] },
        { title: '第2章 监督学习', topics: ['线性回归', '逻辑回归', '决策树', 'SVM', '神经网络'] },
        { title: '第3章 无监督学习', topics: ['K-means聚类', '层次聚类', 'PCA降维', '异常检测'] },
        { title: '第4章 集成学习', topics: ['Bagging', 'Boosting', '随机森林', 'XGBoost'] },
        { title: '第5章 深度学习入门', topics: ['神经网络基础', 'CNN', 'RNN', 'Transfer Learning'] },
        { title: '第6章 模型评估与优化', topics: ['交叉验证', '超参数调优', '模型选择', '特征工程'] }
      ],
      teachingMethod: '理论讲授结合Python编程实践，通过Kaggle竞赛和实际项目案例，提升学生的机器学习应用能力。鼓励学生参与开源项目和学术交流。',
      assessment: '平时成绩20%（作业+课堂）+ 编程实验30% + 项目报告20% + 期末考试30%',
      questions: [
        { id: 1, type: '计算题', difficulty: '中等', content: '计算线性回归模型的梯度下降更新公式', answer: 'θ := θ - α∇J(θ)' },
        { id: 2, type: '编程题', difficulty: '困难', content: '使用Python实现K-means聚类算法', answer: '见示例代码' },
        { id: 3, type: '分析题', difficulty: '中等', content: '比较决策树和随机森林的异同', answer: '随机森林是决策树的集成，具有更好的泛化能力' },
        { id: 4, type: '应用题', difficulty: '困难', content: '设计一个图像分类的深度学习模型', answer: '使用CNN架构，见详细设计' },
        { id: 5, type: '简答题', difficulty: '简单', content: '解释过拟合现象及其解决方法', answer: '增加数据、正则化、交叉验证等' }
      ],
      practicalTasks: [
        { id: 1, name: '线性回归实现', type: '编程实训', duration: '4学时', description: '从零实现线性回归算法，包括梯度下降优化', difficulty: '中等' },
        { id: 2, name: 'Iris数据集分类', type: '综合实训', duration: '6学时', description: '使用多种分类算法对Iris数据集进行分类比较', difficulty: '中等' },
        { id: 3, name: '聚类分析项目', type: '项目实训', duration: '8学时', description: '对真实数据集进行聚类分析和可视化', difficulty: '中等' },
        { id: 4, name: '神经网络实践', type: '编程实训', duration: '8学时', description: '使用TensorFlow/PyTorch构建简单神经网络', difficulty: '困难' },
        { id: 5, name: 'Kaggle竞赛', type: '竞赛实训', duration: '16学时', description: '参与Kaggle入门级竞赛，完整体验建模流程', difficulty: '困难' }
      ],
      lessonPlans: [
        { id: 1, title: '监督学习基础教案', week: '第2-5周', content: '从线性回归开始，循序渐进介绍各种监督学习算法', keyPoints: ['损失函数', '优化算法', '模型评估'] },
        { id: 2, title: '深度学习入门教案', week: '第10-12周', content: '介绍神经网络原理和反向传播算法', keyPoints: ['神经元模型', 'BP算法', 'CNN基础'] },
        { id: 3, title: '特征工程教案', week: '第8周', content: '讲解特征选择、特征构造和特征转换方法', keyPoints: ['特征重要性', '降维技术', '特征归一化'] }
      ],
      knowledgeGraph: {
        nodes: ['机器学习', '监督学习', '无监督学习', '深度学习', '回归', '分类', '聚类', '神经网络', '集成学习'],
        relations: [
          { from: '机器学习', to: '监督学习', type: '分类' },
          { from: '机器学习', to: '无监督学习', type: '分类' },
          { from: '监督学习', to: '回归', type: '包含' },
          { from: '监督学习', to: '分类', type: '包含' },
          { from: '深度学习', to: '神经网络', type: '基于' }
        ]
      },
      abilityGraph: {
        dimensions: ['数学基础', '编程能力', '模型理解', '调参优化', '问题建模'],
        scores: [82, 90, 85, 78, 88]
      },
      relationGraph: {
        prerequisite: ['高等数学', '线性代数', 'Python编程'],
        follow: ['深度学习', '自然语言处理', '计算机视觉'],
        related: ['数据挖掘', '模式识别', '统计学习']
      },
      qualityGraph: {
        qualities: ['数学思维', '编程实践', '创新能力', '数据敏感', '持续学习'],
        levels: [85, 92, 80, 88, 90]
      }
    }
  },
  {
    id: 4,
    name: '数据库系统原理',
    completion: 88,
    studentRating: 4.1,
    supervisorRating: 4.0,
    coursewareCount: 10,
    coursewareList: [
      { id: 8, name: '关系数据库', description: '关系模型和SQL语言' },
      { id: 9, name: '数据库设计', description: 'ER模型和范式理论' }
    ],
    experienceList: [
      { id: 5, title: '实践教学经验', content: '通过数据库设计项目，提高学生实践能力', date: '2024-09-20', type: '实践教学' }
    ],
    studentRatingCount: 41,
    studentRatings: [
      { id: 5, studentName: '孙七', score: 4, comment: '理论结合实践，收获很大', date: '2024-12-08' }
    ],
    supervisorRatingCount: 3,
    supervisorRatings: [
      { id: 5, supervisorName: '周教授', score: 4, comment: '课程设计合理，学生反馈良好', date: '2024-11-25' }
    ],
    detail: {
      courseCode: 'DB302',
      credits: 3,
      hours: 48,
      semester: '2024年春季',
      description: '数据库系统是信息系统的核心。本课程系统介绍数据库系统的基本原理、设计方法和实现技术。重点讲解关系数据库理论、SQL语言、数据库设计、事务管理和并发控制等内容。',
      objectives: [
        '掌握关系数据库的基本理论和SQL语言',
        '学会数据库设计的方法和技巧',
        '理解事务管理和并发控制机制',
        '能够设计和实现实际的数据库应用系统'
      ],
      chapters: [
        { title: '第1章 数据库系统概述', topics: ['数据库基本概念', '数据模型', '数据库系统结构'] },
        { title: '第2章 关系数据库', topics: ['关系模型', '关系代数', 'SQL语言'] },
        { title: '第3章 数据库设计', topics: ['ER模型', '范式理论', '数据库设计过程'] },
        { title: '第4章 查询优化', topics: ['查询处理', '查询优化策略', '索引技术'] },
        { title: '第5章 事务管理', topics: ['事务概念', 'ACID特性', '并发控制', '故障恢复'] },
        { title: '第6章 数据库应用', topics: ['存储过程', '触发器', 'NoSQL数据库'] }
      ],
      teachingMethod: '理论教学与SQL编程实践相结合，通过数据库设计项目，让学生掌握完整的数据库开发流程。使用MySQL等主流数据库系统进行实践。',
      assessment: '平时成绩25%（作业+考勤）+ 实验成绩25% + 课程设计20% + 期末考试30%',
      questions: [
        { id: 1, type: '选择题', difficulty: '简单', content: 'SQL语言中，DELETE语句的作用是什么？', answer: '删除表中的记录' },
        { id: 2, type: '设计题', difficulty: '困难', content: '设计一个学生选课系统的数据库ER模型', answer: '见ER图设计' },
        { id: 3, type: '简答题', difficulty: '中等', content: '解释数据库的ACID特性', answer: '原子性、一致性、隔离性、持久性' },
        { id: 4, type: '编程题', difficulty: '中等', content: '编写SQL查询语句实现多表联合查询', answer: '使用JOIN操作' },
        { id: 5, type: '分析题', difficulty: '困难', content: '分析并优化一个慢查询语句', answer: '添加索引、优化查询条件等' }
      ],
      practicalTasks: [
        { id: 1, name: 'MySQL安装与配置', type: '基础实训', duration: '2学时', description: '安装MySQL数据库，配置环境，熟悉基本操作', difficulty: '简单' },
        { id: 2, name: 'SQL语句实践', type: '编程实训', duration: '4学时', description: '练习各种SQL语句，包括增删改查和复杂查询', difficulty: '中等' },
        { id: 3, name: '数据库设计项目', type: '项目实训', duration: '12学时', description: '完成一个完整的数据库设计项目，从需求分析到实现', difficulty: '困难' },
        { id: 4, name: '存储过程与触发器', type: '编程实训', duration: '4学时', description: '编写存储过程和触发器实现业务逻辑', difficulty: '中等' },
        { id: 5, name: '性能优化实战', type: '综合实训', duration: '6学时', description: '分析查询性能，进行索引优化和查询优化', difficulty: '困难' }
      ],
      lessonPlans: [
        { id: 1, title: 'SQL基础教案', week: '第3-5周', content: '系统讲解SQL的DDL、DML、DQL和DCL语句', keyPoints: ['SELECT查询', 'JOIN操作', '子查询'] },
        { id: 2, title: '数据库设计教案', week: '第6-8周', content: '从ER建模到关系模式设计的完整流程', keyPoints: ['ER图', '规范化理论', '完整性约束'] },
        { id: 3, title: '事务与并发教案', week: '第12-13周', content: '讲解事务处理和并发控制机制', keyPoints: ['ACID特性', '锁机制', '隔离级别'] }
      ],
      knowledgeGraph: {
        nodes: ['数据库系统', 'SQL语言', '数据模型', '关系代数', '事务处理', '并发控制', '恢复技术', '查询优化', '索引'],
        relations: [
          { from: '数据库系统', to: 'SQL语言', type: '操作语言' },
          { from: '数据库系统', to: '数据模型', type: '基于' },
          { from: '数据模型', to: '关系代数', type: '理论基础' },
          { from: '事务处理', to: '并发控制', type: '包含' },
          { from: '查询优化', to: '索引', type: '依赖' }
        ]
      },
      abilityGraph: {
        dimensions: ['SQL编程', '数据建模', '性能优化', '系统管理', '问题分析'],
        scores: [88, 85, 75, 80, 82]
      },
      relationGraph: {
        prerequisite: ['数据结构', '离散数学'],
        follow: ['数据仓库', '大数据技术', 'NoSQL数据库'],
        related: ['软件工程', 'Web开发', '信息系统']
      },
      qualityGraph: {
        qualities: ['逻辑思维', '系统设计', '细节把控', '性能意识', '实践能力'],
        levels: [88, 85, 90, 78, 86]
      }
    }
  },
  {
    id: 5,
    name: 'Web开发技术',
    completion: 95,
    studentRating: 4.6,
    supervisorRating: 4.4,
    coursewareCount: 18,
    coursewareList: [
      { id: 10, name: 'HTML5基础', description: 'HTML5新特性和语义化标签' },
      { id: 11, name: 'CSS3样式', description: 'CSS3动画和响应式设计' },
      { id: 12, name: 'JavaScript进阶', description: 'ES6+语法和异步编程' }
    ],
    experienceList: [
      { id: 6, title: '前端技术更新', content: '及时更新前端技术栈，保持课程先进性', date: '2024-08-15', type: '技术更新' }
    ],
    studentRatingCount: 48,
    studentRatings: [
      { id: 6, studentName: '周八', score: 5, comment: '课程很实用，老师技术很牛', date: '2024-12-14' }
    ],
    supervisorRatingCount: 2,
    supervisorRatings: [
      { id: 6, supervisorName: '吴教授', score: 4, comment: '技术前沿，教学效果好', date: '2024-11-20' }
    ],
    detail: {
      courseCode: 'WEB501',
      credits: 4,
      hours: 64,
      semester: '2024年秋季',
      description: '随着互联网的快速发展，Web开发技术日新月异。本课程全面介绍现代Web开发的核心技术，包括HTML5、CSS3、JavaScript、前端框架（Vue/React）、后端开发（Node.js）和全栈开发实践。',
      objectives: [
        '掌握HTML5、CSS3和JavaScript的核心技术',
        '学会使用主流前端框架（Vue.js/React）',
        '了解后端开发和RESTful API设计',
        '能够独立开发完整的Web应用项目'
      ],
      chapters: [
        { title: '第1章 Web基础', topics: ['HTTP协议', 'HTML5语义化', 'CSS3新特性'] },
        { title: '第2章 JavaScript进阶', topics: ['ES6+语法', '异步编程', 'Promise/Async'] },
        { title: '第3章 前端框架', topics: ['Vue.js基础', '组件开发', '状态管理', '路由管理'] },
        { title: '第4章 前端工程化', topics: ['Webpack', 'Vite', 'npm/yarn', '代码规范'] },
        { title: '第5章 后端开发', topics: ['Node.js', 'Express', 'RESTful API', '数据库集成'] },
        { title: '第6章 全栈项目', topics: ['项目架构', '前后端分离', '部署上线', '性能优化'] }
      ],
      teachingMethod: '项目驱动教学，从简单的静态页面到复杂的全栈应用，逐步提升学生的Web开发能力。鼓励学生参与开源项目，培养实际工程能力。',
      assessment: '平时成绩20%（作业+课堂）+ 阶段项目40%（3个项目）+ 期末大作业40%',
      questions: [
        { id: 1, type: '编程题', difficulty: '简单', content: '使用HTML5和CSS3创建一个响应式导航栏', answer: '见代码实现' },
        { id: 2, type: '简答题', difficulty: '中等', content: '解释Vue.js中的响应式原理', answer: '基于Object.defineProperty或Proxy实现数据劫持' },
        { id: 3, type: '设计题', difficulty: '困难', content: '设计一个电商网站的前端架构', answer: '见架构设计文档' },
        { id: 4, type: '编程题', difficulty: '困难', content: '实现一个RESTful API服务端', answer: '使用Express框架，见代码' },
        { id: 5, type: '分析题', difficulty: '中等', content: '分析并优化网页加载性能', answer: '代码分割、懒加载、CDN等' }
      ],
      practicalTasks: [
        { id: 1, name: '个人博客网站', type: '项目实训', duration: '12学时', description: '开发一个具有发布、评论功能的个人博客', difficulty: '中等' },
        { id: 2, name: 'Vue组件库', type: '编程实训', duration: '8学时', description: '开发常用的Vue组件（按钮、表单、对话框等）', difficulty: '中等' },
        { id: 3, name: 'Todo List应用', type: '综合实训', duration: '6学时', description: '实现一个全栈Todo List应用，前后端分离', difficulty: '简单' },
        { id: 4, name: '在线商城项目', type: '项目实训', duration: '20学时', description: '开发完整的在线商城系统（前端+后端+数据库）', difficulty: '困难' },
        { id: 5, name: 'WebSocket聊天室', type: '编程实训', duration: '8学时', description: '实现实时聊天功能，支持多人在线', difficulty: '中等' }
      ],
      lessonPlans: [
        { id: 1, title: 'Vue.js实战教案', week: '第5-8周', content: '从Vue基础到组件化开发，构建完整应用', keyPoints: ['组件通信', '状态管理', '路由配置'] },
        { id: 2, title: '前端工程化教案', week: '第9-10周', content: '讲解现代前端工程化工具和流程', keyPoints: ['模块化', '构建工具', '代码规范'] },
        { id: 3, title: '全栈开发教案', week: '第13-16周', content: '前后端分离开发模式和RESTful API设计', keyPoints: ['API设计', '前后端联调', '部署上线'] }
      ],
      knowledgeGraph: {
        nodes: ['Web开发', 'HTML5', 'CSS3', 'JavaScript', 'Vue.js', 'Node.js', 'HTTP', 'RESTful', '前端工程化', '响应式设计'],
        relations: [
          { from: 'Web开发', to: 'HTML5', type: '基础' },
          { from: 'Web开发', to: 'CSS3', type: '基础' },
          { from: 'Web开发', to: 'JavaScript', type: '核心' },
          { from: 'Vue.js', to: 'JavaScript', type: '基于' },
          { from: 'Node.js', to: 'JavaScript', type: '运行时' },
          { from: 'RESTful', to: 'HTTP', type: '基于' }
        ]
      },
      abilityGraph: {
        dimensions: ['HTML/CSS', 'JavaScript', '框架应用', '后端开发', '全栈能力'],
        scores: [95, 92, 88, 82, 85]
      },
      relationGraph: {
        prerequisite: ['计算机网络', 'JavaScript基础'],
        follow: ['移动应用开发', '微信小程序', '云计算'],
        related: ['软件工程', '数据库', 'UI/UX设计']
      },
      qualityGraph: {
        qualities: ['编程能力', '审美能力', '用户思维', '工程思维', '创新能力'],
        levels: [92, 85, 88, 90, 87]
      }
    }
  },
  {
    id: 6,
    name: '操作系统原理',
    completion: 82,
    studentRating: 4.2,
    supervisorRating: 4.1,
    coursewareCount: 14,
    coursewareList: [
      { id: 13, name: '进程管理', description: '进程调度和同步机制' },
      { id: 14, name: '内存管理', description: '虚拟内存和页面置换' }
    ],
    experienceList: [
      { id: 7, title: '系统编程教学', content: '通过系统调用编程，加深对操作系统的理解', date: '2024-07-10', type: '编程实践' }
    ],
    studentRatingCount: 36,
    studentRatings: [
      { id: 7, studentName: '郑九', score: 4, comment: '课程难度大但收获多', date: '2024-12-06' }
    ],
    supervisorRatingCount: 3,
    supervisorRatings: [
      { id: 7, supervisorName: '刘教授', score: 4, comment: '课程内容扎实，学生基础得到提升', date: '2024-11-15' }
    ],
    detail: {
      courseCode: 'OS303',
      credits: 4,
      hours: 64,
      semester: '2024年春季',
      description: '操作系统是计算机系统中最重要的系统软件。本课程系统介绍操作系统的基本原理、设计方法和实现技术。涵盖进程管理、内存管理、文件系统、I/O管理等核心内容，结合Linux系统编程实践。',
      objectives: [
        '理解操作系统的基本概念和工作原理',
        '掌握进程、内存、文件系统等核心机制',
        '学会Linux系统编程和Shell脚本',
        '培养系统级编程和问题分析能力'
      ],
      chapters: [
        { title: '第1章 操作系统概述', topics: ['操作系统定义', '发展历史', '系统结构'] },
        { title: '第2章 进程管理', topics: ['进程概念', '进程调度', '进程同步', '死锁'] },
        { title: '第3章 内存管理', topics: ['内存分配', '虚拟内存', '页面置换算法'] },
        { title: '第4章 文件系统', topics: ['文件概念', '目录结构', '文件存储', '磁盘管理'] },
        { title: '第5章 I/O管理', topics: ['I/O系统', '设备驱动', '磁盘调度'] },
        { title: '第6章 Linux编程', topics: ['系统调用', '进程编程', '线程编程', 'Shell脚本'] }
      ],
      teachingMethod: '理论讲授与Linux系统编程相结合，通过编写系统级程序（如Shell、简易文件系统），深入理解操作系统原理。推荐阅读Linux内核源码。',
      assessment: '平时成绩25%（作业+考勤）+ 编程实验30% + 课程设计15% + 期末考试30%',
      questions: [
        { id: 1, type: '简答题', difficulty: '简单', content: '什么是进程？进程和程序的区别是什么？', answer: '进程是程序的执行实例，具有动态性' },
        { id: 2, type: '计算题', difficulty: '中等', content: '给定页面访问序列，使用LRU算法计算缺页次数', answer: '见计算过程' },
        { id: 3, type: '分析题', difficulty: '困难', content: '分析并解决一个死锁问题', answer: '使用银行家算法或资源分配图' },
        { id: 4, type: '编程题', difficulty: '困难', content: '使用Linux系统调用实现进程间通信（管道）', answer: '见代码实现' },
        { id: 5, type: '简答题', difficulty: '中等', content: '解释虚拟内存的工作原理', answer: '通过页表映射虚拟地址到物理地址' }
      ],
      practicalTasks: [
        { id: 1, name: 'Linux环境搭建', type: '基础实训', duration: '2学时', description: '安装Linux虚拟机，熟悉基本命令', difficulty: '简单' },
        { id: 2, name: '进程管理实验', type: '编程实训', duration: '6学时', description: '使用fork、exec等系统调用创建和管理进程', difficulty: '中等' },
        { id: 3, name: '多线程编程', type: '编程实训', duration: '6学时', description: '使用pthread库实现多线程程序，解决同步问题', difficulty: '中等' },
        { id: 4, name: '简易Shell实现', type: '项目实训', duration: '12学时', description: '开发一个支持基本命令和管道的Shell程序', difficulty: '困难' },
        { id: 5, name: '文件系统设计', type: '课程设计', duration: '16学时', description: '设计并实现一个简单的文件系统', difficulty: '困难' }
      ],
      lessonPlans: [
        { id: 1, title: '进程管理教案', week: '第3-6周', content: '从进程概念到进程调度、同步和死锁的完整讲解', keyPoints: ['进程状态', '调度算法', '信号量', '死锁预防'] },
        { id: 2, title: '内存管理教案', week: '第7-10周', content: '讲解物理内存和虚拟内存管理技术', keyPoints: ['分页机制', '页面置换', 'TLB'] },
        { id: 3, title: 'Linux编程教案', week: '第13-15周', content: '系统调用和Linux编程实践', keyPoints: ['系统调用', 'IPC机制', '信号处理'] }
      ],
      knowledgeGraph: {
        nodes: ['操作系统', '进程管理', '内存管理', '文件系统', 'I/O管理', '进程调度', '虚拟内存', '死锁', '同步互斥'],
        relations: [
          { from: '操作系统', to: '进程管理', type: '核心功能' },
          { from: '操作系统', to: '内存管理', type: '核心功能' },
          { from: '操作系统', to: '文件系统', type: '核心功能' },
          { from: '进程管理', to: '进程调度', type: '包含' },
          { from: '进程管理', to: '死锁', type: '涉及' },
          { from: '内存管理', to: '虚拟内存', type: '包含' }
        ]
      },
      abilityGraph: {
        dimensions: ['理论理解', '系统编程', '问题分析', '算法设计', '调试能力'],
        scores: [85, 80, 88, 82, 78]
      },
      relationGraph: {
        prerequisite: ['数据结构', '计算机组成原理', 'C语言'],
        follow: ['编译原理', '分布式系统', '云计算'],
        related: ['计算机网络', '数据库系统', '嵌入式系统']
      },
      qualityGraph: {
        qualities: ['抽象思维', '系统思维', '编程能力', '耐心细致', '问题解决'],
        levels: [88, 90, 82, 85, 87]
      }
    }
  }
])

// 计算属性
const filteredData = computed(() => {
  let filtered = coursesData.value

  // 课程名称搜索
  if (filters.value.courseName) {
    const keyword = filters.value.courseName.toLowerCase()
    filtered = filtered.filter(course => 
      course.name.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

const totalCourses = computed(() => {
  return coursesData.value.length
})

const averageCompletion = computed(() => {
  const total = coursesData.value.reduce((sum, course) => sum + course.completion, 0)
  return Math.round(total / coursesData.value.length)
})

const averageRating = computed(() => {
  const total = coursesData.value.reduce((sum, course) => sum + course.studentRating, 0)
  return (total / coursesData.value.length).toFixed(1)
})

const totalCourseware = computed(() => {
  return coursesData.value.reduce((sum, course) => sum + course.coursewareCount, 0)
})

// 方法
const handleFilterChange = () => {
  // 筛选逻辑已在计算属性中处理
}

const getCompletionClass = (completion) => {
  if (completion >= 90) return 'excellent'
  if (completion >= 70) return 'good'
  if (completion >= 50) return 'average'
  return 'poor'
}

const getProgressColor = (completion) => {
  if (completion >= 90) return '#67c23a'
  if (completion >= 70) return '#e6a23c'
  if (completion >= 50) return '#f56c6c'
  return '#909399'
}

const getDifficultyType = (difficulty) => {
  if (difficulty === '简单') return 'success'
  if (difficulty === '中等') return 'warning'
  if (difficulty === '困难') return 'danger'
  return 'info'
}

const showCourseware = (course) => {
  currentCourse.value = course
  coursewareDialogVisible.value = true
}

const showExperience = (course) => {
  currentCourse.value = course
  experienceDialogVisible.value = true
}

const showStudentRatings = (course) => {
  currentCourse.value = course
  studentRatingDialogVisible.value = true
}

const showSupervisorRatings = (course) => {
  currentCourse.value = course
  supervisorRatingDialogVisible.value = true
}

const viewCourse = (course) => {
  currentCourse.value = course
  courseDetailDialogVisible.value = true
}

const editCourse = (course) => {
  console.log('编辑课程:', course)
}

const manageCourse = (course) => {
  console.log('管理课程:', course)
}

const viewCourseware = (courseware) => {
  console.log('查看课件:', courseware)
}

const downloadCourseware = (courseware) => {
  console.log('下载课件:', courseware)
}

const handleClose = () => {
  coursewareDialogVisible.value = false
  experienceDialogVisible.value = false
  studentRatingDialogVisible.value = false
  supervisorRatingDialogVisible.value = false
  courseDetailDialogVisible.value = false
  currentCourse.value = null
}

onMounted(() => {
  // 组件挂载时的初始化逻辑
})
</script>

<style scoped>
.courses-page {
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

.search-input {
  width: 300px;
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
  background: white;
  border-radius: 8px;
  min-height: calc(100vh - 84px);
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

/* 网格视图样式 */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 24px;
}

.course-card {
  background: #fff;
  border: 1px solid #e0e6f1;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9ff;
  border-bottom: 1px solid #e0e6f1;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.completion-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.completion-badge.excellent {
  background: #ecfdf5;
  color: #10b981;
}

.completion-badge.good {
  background: #fef3c7;
  color: #f59e0b;
}

.completion-badge.average {
  background: #fef2f2;
  color: #ef4444;
}

.completion-badge.poor {
  background: #f3f4f6;
  color: #6b7280;
}

.card-content {
  padding: 20px;
}

.course-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 10px;
}

.info-label {
  font-size: 12px;
  color: #666666;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #0057ff;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.info-value:hover {
  color: #3b82f6;
}

.clickable-icon {
  font-size: 12px;
  color: #3b82f6;
}

.completion-bar {
  margin-bottom: 20px;
}

.completion-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.completion-text {
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: 4px;
}

.rating-section {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 12px;
}

.rating-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 8px;
  border-radius: 6px;
}

.rating-item:hover {
  background: #f8f9ff;
}

.rating-label {
  font-size: 14px;
  color: #0057ff;
  font-weight: 500;
}

.rating-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-text {
  font-size: 12px;
  color: #333;
  font-weight: 600;
}

.card-actions {
  padding: 16px 20px;
  background: #f8f9ff;
  border-top: 1px solid #e0e6f1;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 列表视图样式 */
.courses-list {
  padding: 0;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1.5fr 2fr;
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
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1.5fr 2fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background-color 0.2s ease;
}

.list-item:hover {
  background: #f8f9ff;
}

.item-cell {
  font-size: 14px;
  color: #333;
}

.course-name {
  font-weight: 600;
}

.clickable-text {
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: color 0.2s ease;
}

.clickable-text:hover {
  color: #2563eb;
}

.completion-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.rating-display {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;
  padding: 4px;
  border-radius: 4px;
}

.rating-display:hover {
  background: #f8f9ff;
}

/* 新增：简化的评价显示样式 */
.rating-display-simple {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.rating-score {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.rating-link {
  color: #3b82f6;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.rating-link:hover {
  color: #2563eb;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

/* 弹窗样式 */
.courseware-dialog-content,
.experience-dialog-content,
.rating-dialog-content {
  max-height: 500px;
  overflow-y: auto;
}

.courseware-list,
.experience-list,
.rating-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.courseware-item,
.experience-item,
.rating-item {
  padding: 12px;
  border: 1px solid #e0e6f1;
  border-radius: 8px;
  background: #f8f9ff;
}

.courseware-info {
  margin-bottom: 8px;
}

.courseware-name,
.experience-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.courseware-desc,
.experience-content,
.rating-comment {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.courseware-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.experience-meta {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.rating-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9ff;
  border-radius: 8px;
}

.rating-overview {
  text-align: center;
}

.rating-score {
  font-size: 14px;
  font-weight: 600;
  color: #3b82f6;
}

.rating-count {
  font-size: 14px;
  color: #666;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.student-name,
.supervisor-name {
  font-weight: 600;
  color: #333;
}

.rating-date {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
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

/* 课程详情弹窗样式 */
.course-detail-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;
}

.detail-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e6f1;
}

.detail-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #0057ff;
  display: inline-block;
}

.basic-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9ff;
  border-radius: 8px;
}

.info-row .label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  min-width: 100px;
}

.info-row .value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.description-text {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  text-align: justify;
  margin: 0;
  padding: 12px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #0057ff;
}

.objectives-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.objectives-list li {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #f8f9ff;
  border-radius: 6px;
  position: relative;
  padding-left: 32px;
}

.objectives-list li::before {
  content: '✓';
  position: absolute;
  left: 12px;
  color: #0057ff;
  font-weight: bold;
  font-size: 16px;
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chapter-item {
  padding: 16px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #0057ff;
}

.chapter-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.chapter-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #fff;
  border: 1px solid #d0d7e6;
  border-radius: 16px;
  font-size: 13px;
  color: #666;
  transition: all 0.2s ease;
}

.topic-tag:hover {
  background: #0057ff;
  color: #fff;
  border-color: #0057ff;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .list-header,
  .list-item {
    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1.5fr 2fr;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .courses-page {
    padding: 16px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .list-header,
  .list-item {
    display: none;
  }
  
  .courses-list {
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

  .basic-info-grid {
    grid-template-columns: 1fr;
  }
}

/* 教案样式 */
.lesson-plans-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lesson-plan-item {
  padding: 16px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.plan-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.plan-content {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.6;
}

.plan-keypoints {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.keypoint-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 4px;
  font-size: 13px;
}

/* 图谱样式 */
.graph-content {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.graph-nodes,
.graph-relations {
  margin-bottom: 12px;
}

.relation-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.relation-item:last-child {
  border-bottom: none;
}

/* 能力图谱样式 */
.ability-chart,
.quality-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ability-item,
.quality-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ability-name,
.quality-name {
  min-width: 100px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* 关联图谱样式 */
.relation-graph {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.relation-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.relation-row strong {
  min-width: 80px;
  color: #333;
}
</style>
