<template>
  <div class="teaching-resume">
    <!-- 任教年限信息 -->
    <div class="module-container">
      <h3 class="module-title">任教年限</h3>
      <div class="section">
        <div class="teaching-info-grid">
          <div class="info-card">
            <div class="info-icon">📅</div>
            <div class="info-content">
              <h4>累计任教年限</h4>
              <p class="info-value">{{ totalTeachingYears }}年</p>
              <p class="info-detail">持续教学</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">🚀</div>
            <div class="info-content">
              <h4>开始授课时间</h4>
              <p class="info-value">{{ teachingStartDate }}</p>
              <p class="info-detail">首次授课</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">👥</div>
            <div class="info-content">
              <h4>所授课程总数</h4>
              <p class="info-value">{{ totalCourses }}</p>
              <p class="info-detail">门课程</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">👥</div>
            <div class="info-content">
              <h4>累计授课学生</h4>
              <p class="info-value">{{ totalStudents }}</p>
              <p class="info-detail">名学生</p>
            </div>
          </div>
        </div>
        
        <!-- 所授课程名称列表 -->
        <div class="courses-summary">
          <h4 class="courses-summary-title">所授课程名称</h4>
          <div class="courses-tags">
            <span v-for="course in taughtCourses" :key="course.id" class="course-tag">
              {{ course.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 曾任教课程 -->
    <div class="module-container">
      <h3 class="module-title">曾任教课程</h3>
      <div class="section">
        <div class="courses-detailed">
          <div v-for="course in taughtCourses" :key="course.id" class="course-detailed-card">
            <!-- 课程头部信息 -->
            <div class="course-header">
              <div class="course-title-section">
                <h4 class="course-name">{{ course.name }}</h4>
                <div class="course-badges">
                  <span class="course-credits">{{ course.credits }}学分</span>
                  <span class="course-semester">{{ course.semester }}</span>
                  <span class="course-students">{{ course.studentCount }}人</span>
                </div>
              </div>
            </div>
            
            <!-- 课程内容 - 紧凑布局 -->
            <div class="course-content">
              <!-- 第一行：课程简介和教学成效 -->
              <div class="course-row">
                <div class="course-col course-col-2">
                  <h5 class="section-subtitle">课程简介</h5>
                  <p class="course-description">{{ course.description }}</p>
                </div>
                <div class="course-col course-col-1">
                  <h5 class="section-subtitle">教学成效</h5>
                  <div class="teaching-effectiveness-compact">
                    <div class="effectiveness-item-compact">
                      <span class="effectiveness-label">满意度</span>
                      <span class="effectiveness-value">{{ course.effectiveness.satisfaction }}%</span>
                    </div>
                    <div class="effectiveness-item-compact">
                      <span class="effectiveness-label">通过率</span>
                      <span class="effectiveness-value">{{ course.effectiveness.passRate }}%</span>
                    </div>
                    <div class="effectiveness-item-compact">
                      <span class="effectiveness-label">优秀率</span>
                      <span class="effectiveness-value">{{ course.effectiveness.excellentRate }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 第二行：课程内容和教学目标 -->
              <div class="course-row">
                <div class="course-col course-col-1">
                  <h5 class="section-subtitle">课程内容</h5>
                  <ul class="course-content-list-compact">
                    <li v-for="content in course.content" :key="content">{{ content }}</li>
                  </ul>
                </div>
                <div class="course-col course-col-1">
                  <h5 class="section-subtitle">教学目标</h5>
                  <ul class="course-objectives-compact">
                    <li v-for="objective in course.objectives" :key="objective">{{ objective }}</li>
                  </ul>
                </div>
              </div>

              <!-- 第三行：教学能力描述和综合能力评估 -->
              <div class="course-row">
                <div class="course-col course-col-2">
                  <h5 class="section-subtitle">教学能力描述</h5>
                  <p class="teaching-ability-compact">{{ course.teachingAbility }}</p>
                </div>
                <div class="course-col course-col-1">
                  <h5 class="section-subtitle">综合能力评估</h5>
                  <div class="ability-assessment-compact">
                    <div class="ability-item-compact">
                      <span class="ability-label">课程设计</span>
                      <div class="ability-bar-compact">
                        <div class="ability-fill" :style="{ width: course.assessment.courseDesign + '%' }"></div>
                      </div>
                      <span class="ability-score">{{ course.assessment.courseDesign }}%</span>
                    </div>
                    <div class="ability-item-compact">
                      <span class="ability-label">教学方法</span>
                      <div class="ability-bar-compact">
                        <div class="ability-fill" :style="{ width: course.assessment.teachingMethod + '%' }"></div>
                      </div>
                      <span class="ability-score">{{ course.assessment.teachingMethod }}%</span>
                    </div>
                    <div class="ability-item-compact">
                      <span class="ability-label">学生互动</span>
                      <div class="ability-bar-compact">
                        <div class="ability-fill" :style="{ width: course.assessment.studentInteraction + '%' }"></div>
                      </div>
                      <span class="ability-score">{{ course.assessment.studentInteraction }}%</span>
                    </div>
                    <div class="ability-item-compact">
                      <span class="ability-label">知识传授</span>
                      <div class="ability-bar-compact">
                        <div class="ability-fill" :style="{ width: course.assessment.knowledgeTransfer + '%' }"></div>
                      </div>
                      <span class="ability-score">{{ course.assessment.knowledgeTransfer }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 教学理念 -->
    <div class="module-container">
      <h3 class="module-title">教学理念</h3>
      <div class="section">
        <div class="philosophy-content">
          <p class="philosophy-text">{{ teachingPhilosophy }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 计算累计任教年限
const totalTeachingYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const startYear = 2008 // 从讲师开始的时间
  return currentYear - startYear
})

// 开始授课时间
const teachingStartDate = ref('2008年9月')

// 计算总课程数
const totalCourses = computed(() => {
  return taughtCourses.value.length
})

// 计算累计授课学生数
const totalStudents = computed(() => {
  return taughtCourses.value.reduce((total, course) => {
    return total + (course.studentCount || 0)
  }, 0)
})

// 曾任教课程详细数据
const taughtCourses = ref([
  {
    id: 1,
    name: '数据结构与算法',
    credits: 4,
    semester: '2023-2024学年',
    studentCount: 120,
    description: '系统介绍数据结构的基本概念、算法设计与分析方法，培养学生编程思维和问题解决能力。通过理论学习和实践编程，使学生掌握常用数据结构的实现和应用。',
    content: [
      '线性表、栈、队列的基本概念和实现',
      '树和二叉树的结构与遍历算法',
      '图的基本概念和常用算法',
      '排序和查找算法',
      '动态规划和贪心算法',
      '算法复杂度分析'
    ],
    objectives: [
      '掌握基本数据结构的实现原理',
      '培养算法设计和分析能力',
      '提高编程实践技能',
      '建立计算思维模式'
    ],
    effectiveness: {
      satisfaction: 95,
      passRate: 92,
      excellentRate: 35
    },
    teachingAbility: '采用理论与实践相结合的教学方法，通过案例分析和编程实践，帮助学生深入理解算法原理。注重培养学生的逻辑思维和编程能力，课堂互动活跃，学生参与度高。',
    assessment: {
      courseDesign: 95,
      teachingMethod: 90,
      studentInteraction: 88,
      knowledgeTransfer: 92
    }
  },
  {
    id: 2,
    name: '软件工程',
    credits: 3,
    semester: '2023-2024学年',
    studentCount: 95,
    description: '全面讲解软件开发生命周期，包括需求分析、设计、实现、测试和维护等各个阶段。通过项目实践，培养学生团队协作和工程实践能力。',
    content: [
      '软件工程概述和生命周期模型',
      '需求工程和需求分析技术',
      '软件设计原理和设计模式',
      '软件测试策略和方法',
      '软件项目管理',
      '软件质量保证'
    ],
    objectives: [
      '理解软件工程的基本概念和方法',
      '掌握软件开发生命周期各阶段',
      '培养团队协作和项目管理能力',
      '提高软件质量意识'
    ],
    effectiveness: {
      satisfaction: 92,
      passRate: 89,
      excellentRate: 28
    },
    teachingAbility: '通过项目驱动的教学方式，组织学生进行团队项目开发，在实践中学习软件工程理论。注重培养学生的工程思维和团队协作能力。',
    assessment: {
      courseDesign: 88,
      teachingMethod: 85,
      studentInteraction: 90,
      knowledgeTransfer: 87
    }
  },
  {
    id: 3,
    name: '人工智能导论',
    credits: 3,
    semester: '2022-2023学年',
    studentCount: 110,
    description: '介绍人工智能的基本概念、主要技术和应用领域，为后续专业课程奠定基础。通过案例分析和实验，激发学生对AI技术的兴趣。',
    content: [
      '人工智能发展历史和基本概念',
      '搜索算法和问题求解',
      '机器学习基础',
      '神经网络和深度学习',
      '自然语言处理',
      '计算机视觉应用'
    ],
    objectives: [
      '了解人工智能的基本概念和发展',
      '掌握AI技术的基本原理',
      '培养对前沿技术的敏感度',
      '激发创新思维'
    ],
    effectiveness: {
      satisfaction: 94,
      passRate: 91,
      excellentRate: 32
    },
    teachingAbility: '采用案例教学和实验结合的方式，通过生动的实例和动手实践，帮助学生理解AI技术的应用。课堂氛围活跃，学生兴趣浓厚。',
    assessment: {
      courseDesign: 92,
      teachingMethod: 88,
      studentInteraction: 95,
      knowledgeTransfer: 90
    }
  },
  {
    id: 4,
    name: '机器学习',
    credits: 3,
    semester: '2022-2023学年',
    studentCount: 85,
    description: '深入学习机器学习的核心算法和理论，包括监督学习、无监督学习和强化学习。通过编程实践，掌握机器学习工具的使用。',
    content: [
      '机器学习基础理论',
      '监督学习算法（线性回归、决策树、SVM等）',
      '无监督学习算法（聚类、降维）',
      '神经网络和深度学习',
      '模型评估和选择',
      '实际应用案例分析'
    ],
    objectives: [
      '掌握机器学习的基本算法',
      '理解模型评估和选择方法',
      '培养数据分析和建模能力',
      '提高编程实践技能'
    ],
    effectiveness: {
      satisfaction: 90,
      passRate: 88,
      excellentRate: 25
    },
    teachingAbility: '注重理论与实践结合，通过大量编程实验和项目实践，帮助学生深入理解机器学习算法。提供丰富的学习资源和案例。',
    assessment: {
      courseDesign: 90,
      teachingMethod: 87,
      studentInteraction: 85,
      knowledgeTransfer: 89
    }
  }
])

// 教学理念
const teachingPhilosophy = ref('以学生为中心，注重理论与实践相结合，培养学生的创新思维和实践能力。通过启发式教学和项目驱动的方式，激发学生的学习兴趣，提高教学质量。同时，关注学生的个性化发展，因材施教，为每个学生提供适合的学习路径。')
</script>

<style scoped>
.teaching-resume {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* 模块容器 */
.module-container {
  margin-bottom: 40px;
}

.module-title {
  margin: 0 0 6px 0;
  font-size: 24px;
  color:#5856d6;
  font-weight: 600;
  padding-bottom: 8px;
  display: inline-block;
  display: flex;
}

/* 通用section样式 */
.section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 任教年限信息网格 */
.teaching-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s;
  border: 1px solid #e8ecf3;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.1);
  border-color: #1677ff;
}

.info-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.info-value {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1677ff;
  line-height: 1;
}

.info-detail {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 课程名称标签 */
.courses-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e8ecf3;
}

.courses-summary-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.courses-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.course-tag {
  background: #e6f7ff;
  color: #1677ff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #bae7ff;
  transition: all 0.2s;
}

.course-tag:hover {
  background: #1677ff;
  color: white;
  transform: translateY(-1px);
}

/* 详细课程样式 - 紧凑布局 */
.courses-detailed {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.course-detailed-card {
  border: 1px solid #e8ecf3;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.course-detailed-card:hover {
  border-color: #1677ff;
  box-shadow: 0 8px 24px rgba(22, 119, 255, 0.1);
}

.course-header {
  background: #f8f9fa;
  padding: 16px 20px;
  border-bottom: 1px solid #e8ecf3;
}

.course-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-name {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.course-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.course-credits {
  background: #e6f7ff;
  color: #1677ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.course-semester {
  color: #666;
  font-size: 12px;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
}

.course-students {
  color: #52c41a;
  font-size: 12px;
  background: #f6ffed;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #b7eb8f;
}

.course-content {
  padding: 20px;
}

/* 紧凑布局的行和列 */
.course-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.course-row:last-child {
  margin-bottom: 0;
}

.course-col {
  flex: 1;
}

.course-col-1 {
  flex: 1;
}

.course-col-2 {
  flex: 2;
}

.section-subtitle {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
  font-weight: 600;
  border-left: 2px solid #1677ff;
  padding-left: 6px;
}

.course-description {
  margin: 0;
  color: #666;
  line-height: 1.5;
  font-size: 13px;
}

/* 紧凑的列表样式 */
.course-content-list-compact,
.course-objectives-compact {
  margin: 0;
  padding-left: 16px;
  color: #666;
  line-height: 1.4;
  font-size: 13px;
}

.course-content-list-compact li,
.course-objectives-compact li {
  margin-bottom: 4px;
}

/* 紧凑的教学成效 */
.teaching-effectiveness-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.effectiveness-item-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
}

.effectiveness-label {
  color: #666;
}

.effectiveness-value {
  color: #1677ff;
  font-weight: 600;
}

/* 紧凑的教学能力描述 */
.teaching-ability-compact {
  margin: 0;
  color: #666;
  line-height: 1.5;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  border-left: 2px solid #1677ff;
  font-size: 13px;
}

/* 紧凑的能力评估 */
.ability-assessment-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ability-item-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.ability-label {
  min-width: 60px;
  color: #666;
  font-size: 11px;
}

.ability-bar-compact {
  flex: 1;
  height: 6px;
  background: #e8ecf3;
  border-radius: 3px;
  overflow: hidden;
}

.ability-fill {
  height: 100%;
  background: linear-gradient(90deg, #1677ff, #4096ff);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.ability-score {
  min-width: 30px;
  color: #1677ff;
  font-weight: 600;
  font-size: 11px;
  text-align: right;
}

/* 教学理念 */
.philosophy-content {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 8px;
  border-left: 4px solid #1677ff;
}

.philosophy-text {
  margin: 0;
  color: #333;
  line-height: 1.8;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .teaching-info-grid {
    grid-template-columns: 1fr;
  }
  
  .course-title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .course-badges {
    flex-wrap: wrap;
  }
  
  .course-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .teaching-effectiveness-compact {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .effectiveness-item-compact {
    flex: 1;
    min-width: 100px;
  }
  
  .courses-tags {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .course-content {
    padding: 16px;
  }
  
  .course-row {
    gap: 12px;
  }
  
  .teaching-effectiveness-compact {
    flex-direction: column;
  }
  
  .effectiveness-item-compact {
    min-width: auto;
  }
}
</style> 