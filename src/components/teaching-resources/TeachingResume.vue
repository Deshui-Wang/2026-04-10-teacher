<template>
  <div class="teaching-resume">
    <!-- 任教年限信息 -->
    <div class="module-container">
      <h3 class="module-title">任教信息概览</h3>
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
                <div class="course-title-group">
                  <h4 class="course-name">{{ course.name }}</h4>
                  <div class="course-meta-info">
                    <span class="course-credits">{{ course.credits }}学分</span>
                    <span class="course-semester">{{ course.semester }}</span>
                    <span class="course-students">{{ course.studentCount }}人</span>
                  </div>
                </div>
                <div class="course-stats">
                  <div class="stat-item">
                    <span class="stat-label">满意度</span>
                    <span class="stat-value">{{ course.effectiveness.satisfaction }}%</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">通过率</span>
                    <span class="stat-value">{{ course.effectiveness.passRate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 课程内容 - 优化布局 -->
            <div class="course-content">
              <!-- 课程简介区域 -->
              <div class="course-intro-section">
                <h5 class="section-subtitle">课程简介</h5>
                <p class="course-description">{{ course.description }}</p>
              </div>

              <!-- 课程核心信息网格 -->
              <div class="course-info-grid">
                <!-- 课程内容 -->
                <div class="info-block">
                  <h5 class="section-subtitle">课程内容</h5>
                  <div class="content-list">
                    <div v-for="(content, index) in course.content" :key="index" class="content-item">
                      <span class="content-number">{{ index + 1 }}</span>
                      <span class="content-text">{{ content }}</span>
                    </div>
                  </div>
                </div>

                <!-- 教学目标 -->
                <div class="info-block">
                  <h5 class="section-subtitle">教学目标</h5>
                  <div class="objectives-list">
                    <div v-for="(objective, index) in course.objectives" :key="index" class="objective-item">
                      <div class="objective-icon">✓</div>
                      <span class="objective-text">{{ objective }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 教学能力展示区域 -->
              <div class="teaching-ability-section">
                <h5 class="section-subtitle">教学能力描述</h5>
                <div class="ability-description">
                  <div class="ability-highlights">
                    <div class="highlight-item">
                      <span class="highlight-icon">🎯</span>
                      <span class="highlight-text">理论与实践结合</span>
                    </div>
                    <div class="highlight-item">
                      <span class="highlight-icon">🚀</span>
                      <span class="highlight-text">案例驱动教学</span>
                    </div>
                    <div class="highlight-item">
                      <span class="highlight-icon">👥</span>
                      <span class="highlight-text">互动式课堂</span>
                    </div>
                  </div>
                  <p class="ability-text">{{ course.teachingAbility }}</p>
                </div>
              </div>

              <!-- 综合能力评估 -->
              <div class="assessment-section">
                <h5 class="section-subtitle">综合能力评估</h5>
                <div class="assessment-grid">
                  <div class="assessment-item">
                    <div class="assessment-header">
                      <span class="assessment-label">课程设计</span>
                      <span class="assessment-score">{{ course.assessment.courseDesign }}%</span>
                    </div>
                    <div class="assessment-bar">
                      <div class="assessment-fill" :style="{ width: course.assessment.courseDesign + '%' }"></div>
                    </div>
                  </div>
                  <div class="assessment-item">
                    <div class="assessment-header">
                      <span class="assessment-label">教学方法</span>
                      <span class="assessment-score">{{ course.assessment.teachingMethod }}%</span>
                    </div>
                    <div class="assessment-bar">
                      <div class="assessment-fill" :style="{ width: course.assessment.teachingMethod + '%' }"></div>
                    </div>
                  </div>
                  <div class="assessment-item">
                    <div class="assessment-header">
                      <span class="assessment-label">学生互动</span>
                      <span class="assessment-score">{{ course.assessment.studentInteraction }}%</span>
                    </div>
                    <div class="assessment-bar">
                      <div class="assessment-fill" :style="{ width: course.assessment.studentInteraction + '%' }"></div>
                    </div>
                  </div>
                  <div class="assessment-item">
                    <div class="assessment-header">
                      <span class="assessment-label">知识传授</span>
                      <span class="assessment-score">{{ course.assessment.knowledgeTransfer }}%</span>
                    </div>
                    <div class="assessment-bar">
                      <div class="assessment-fill" :style="{ width: course.assessment.knowledgeTransfer + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
</script>

<style scoped>
.teaching-resume {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
  width: 100%;
}

/* 模块容器 */
.module-container {
  margin-bottom: 40px;
}

.module-title {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #5856d6;
  font-weight: 600;
  padding-bottom: 8px;
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

/* 详细课程样式 - 优化布局 */
.courses-detailed {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.course-detailed-card {
  border: 1px solid #e8ecf3;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  background: white;
}

.course-detailed-card:hover {
  border-color: #1677ff;
  box-shadow: 0 12px 32px rgba(22, 119, 255, 0.15);
  transform: translateY(-2px);
}

/* 课程头部优化 */
.course-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
  border-bottom: 1px solid #e8ecf3;
}

.course-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.course-title-group {
  flex: 1;
}

.course-name {
  margin: 0 0 12px 0;
  font-size: 22px;
  color: #333;
  font-weight: 700;
  line-height: 1.3;
  display: flex;
}

.course-meta-info {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.course-credits {
  background: #e6f7ff;
  color: #1677ff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #bae7ff;
}

.course-semester {
  color: #666;
  font-size: 13px;
  background: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.course-students {
  color: #52c41a;
  font-size: 13px;
  background: #f6ffed;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #b7eb8f;
  font-weight: 500;
}

.course-stats {
  display: flex;
  gap: 20px;
  align-items: center;
}

.stat-item {
  text-align: center;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 80px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #1677ff;
}

/* 课程内容区域 */
.course-content {
  padding: 0;
}

/* 课程简介区域 */
.course-intro-section {
  padding: 24px;
  background: #fafbfc;
  border-bottom: 1px solid #f0f0f0;
}

.section-subtitle {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-subtitle::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #1677ff;
  border-radius: 2px;
}

.course-description {
  margin: 0;
  color: #555;
  line-height: 1.7;
  font-size: 15px;
}

/* 课程信息网格 */
.course-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
  background: white;
}

.info-block {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e8ecf3;
}

/* 课程内容列表 */
.content-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}

.content-number {
  background: #1677ff;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.content-text {
  color: #555;
  line-height: 1.5;
  font-size: 14px;
}

/* 教学目标列表 */
.objectives-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.objective-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}

.objective-icon {
  background: #52c41a;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.objective-text {
  color: #555;
  line-height: 1.5;
  font-size: 14px;
}

/* 教学能力展示区域 */
.teaching-ability-section {
  padding: 24px;
  background: #f8f9fa;
  border-top: 1px solid #f0f0f0;
}

.ability-description {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e8ecf3;
}

.ability-highlights {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e6f7ff;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 13px;
  color: #1677ff;
  font-weight: 500;
}

.highlight-icon {
  font-size: 14px;
}

.ability-text {
  margin: 0;
  color: #555;
  line-height: 1.6;
  font-size: 14px;
}

/* 综合能力评估 */
.assessment-section {
  padding: 24px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.assessment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.assessment-item {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e8ecf3;
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.assessment-label {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.assessment-score {
  font-size: 16px;
  color: #1677ff;
  font-weight: 700;
}

.assessment-bar {
  height: 8px;
  background: #e8ecf3;
  border-radius: 4px;
  overflow: hidden;
}

.assessment-fill {
  height: 100%;
  background: linear-gradient(90deg, #1677ff, #4096ff);
  border-radius: 4px;
  transition: width 0.6s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .teaching-info-grid {
    grid-template-columns: 1fr;
  }
  
  .course-title-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .course-stats {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  
  .course-info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .assessment-grid {
    grid-template-columns: 1fr;
  }
  
  .ability-highlights {
    flex-direction: column;
    gap: 8px;
  }
  
  .courses-tags {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .course-content {
    padding: 0;
  }
  
  .course-header {
    padding: 16px;
  }
  
  .course-intro-section,
  .teaching-ability-section,
  .assessment-section {
    padding: 16px;
  }
  
  .course-info-grid {
    padding: 16px;
  }
}
</style> 