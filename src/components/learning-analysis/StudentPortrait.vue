<template>
  <div class="student-portrait-container">
    <!-- 1. 学生列表页面 (List View) -->
    <div v-if="!selectedStudentId" class="student-list-view animate__animated animate__fadeIn">
      <div class="list-header">
        <h2 class="view-title">学生画像概览 <span>共 {{ studentsList.length }} 位学生</span></h2>
        <div class="list-filters">
          <el-radio-group v-model="filterSort" size="small">
            <el-radio-button label="score">按综合分数</el-radio-button>
            <el-radio-button label="match">按专业匹配度</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="student-list">
        <div 
          v-for="(student, index) in sortedStudents" 
          :key="student.id" 
          class="student-item-bar animate__animated animate__fadeInUp"
          :style="{ '--delay': index * 0.05 + 's' }"
          @click="viewDetail(student)"
        >
          <div class="item-left">
            <div class="avatar-wrapper">
              <img :src="student.avatar" :alt="student.name" class="avatar-circle" />
              <div class="status-indicator" :class="student.status"></div>
            </div>
            <div class="basic-info">
              <div class="name-row">
                <span class="student-name">{{ student.name }}</span>
                <span class="gender-tag" :class="student.gender">{{ student.gender === 'male' ? '♂' : '♀' }}</span>
              </div>
              <div class="sub-info">
                <span>{{ student.age }}岁</span>
                <span class="divider">|</span>
                <span>{{ student.major }}</span>
                <span class="divider">|</span>
                <span>{{ student.class }}</span>
              </div>
            </div>
          </div>

          <div class="item-center">
            <div class="dimension-dots">
              <div v-for="dim in student.dimensions" :key="dim.name" class="dim-dot-wrapper">
                <div 
                  class="dim-dot" 
                  :style="{ 
                    width: (Math.pow(dim.value / 100, 2.5) * 32 + 6) + 'px', 
                    height: (Math.pow(dim.value / 100, 2.5) * 32 + 6) + 'px',
                    background: dim.color 
                  }"
                ></div>
                <span class="dim-name">{{ dim.name }}</span>
              </div>
            </div>
          </div>

          <div class="item-right">
            <div class="score-box">
              <div class="score-label">综合分数</div>
              <div class="score-value" :style="{ color: getScoreColor(student.score) }">{{ student.score }}</div>
            </div>
            <div class="match-box">
              <div class="match-label">专业匹配度</div>
              <div class="match-badge" :style="{ background: getMatchColor(student.matchRate) }">
                {{ student.matchRate }}%
              </div>
            </div>
            <!-- SVG Arrow Icon -->
            <svg viewBox="0 0 24 24" fill="none" class="arrow-icon" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 学生个体详情页面 (Detail View) -->
    <div v-else class="student-detail-view animate__animated animate__fadeIn">
      <div class="detail-header">
        <el-button circle @click="goBack" class="back-btn">
          <svg viewBox="0 0 24 24" fill="none" class="back-icon" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </el-button>
        <span class="back-text" @click="goBack">返回学生列表</span>
      </div>
      
      <div class="portrait-detail-content">
        <!-- 顶栏基础信息大卡片 -->
        <div class="student-info-card glass-card">
          <div class="student-info-header">
            <div class="avatar-large-wrapper">
              <img :src="selectedStudent.avatar" class="avatar-large" />
              <div class="status-indicator-large" :class="selectedStudent.status"></div>
            </div>
            <div class="student-basic-info">
              <div class="student-name-row">
                <h3 class="student-name">{{ selectedStudent.name }}</h3>
                <span class="status-pill">在读</span>
                <span class="major-pill">{{ selectedStudent.major }}</span>
              </div>
              <div class="student-meta-grid">
                <div class="meta-item"><span class="meta-label">学号</span><span class="meta-value">{{ selectedStudentId }}</span></div>
                <div class="meta-item"><span class="meta-label">班级</span><span class="meta-value">{{ selectedStudent.class }}</span></div>
                <div class="meta-item"><span class="meta-label">绩点(GPA)</span><span class="meta-value score-high">{{ selectedStudent.vocationalData.gpa }}</span></div>
                <div class="meta-item"><span class="meta-label">综合得分</span><span class="meta-value" :style="{ color: getScoreColor(selectedStudent.score) }">{{ selectedStudent.score }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 核心重构：多维度信息 Tab 页 -->
        <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="detail-tabs">
          
          <!-- 📊 Tab 1: 在校表现大盘 -->
          <el-tab-pane label="📊 在校表现大盘" name="campus">
            <!-- 1. 在校日常数字足迹 (卡片) -->
            <div class="footprint-grid animate__animated animate__fadeInUp">
              <div class="footprint-card glass-card">
                <div class="card-icon blue-bg">📚</div>
                <div class="card-stat">
                  <div class="stat-value">{{ selectedStudent.footprint.libraryDays }} 天</div>
                  <div class="stat-label">图书馆借阅打卡</div>
                </div>
              </div>
              <div class="footprint-card glass-card">
                <div class="card-icon purple-bg">💻</div>
                <div class="card-stat">
                  <div class="stat-value">{{ selectedStudent.footprint.labHours }} 小时</div>
                  <div class="stat-label">实训机房自习时长</div>
                </div>
              </div>
              <div class="footprint-card glass-card">
                <div class="card-icon green-bg">✅</div>
                <div class="card-stat">
                  <div class="stat-value">{{ selectedStudent.footprint.absenceCount === 0 ? '全勤' : selectedStudent.footprint.absenceCount + ' 次缺勤' }}</div>
                  <div class="stat-label">日常考勤状态</div>
                </div>
              </div>
            </div>

            <!-- 2. 图表联动区域 -->
            <div class="detail-grid">
               <section class="card glass-card">
                 <div class="card-head"><h3>学习表现趋势</h3></div>
                 <div ref="personalTrendRef" class="echart-container"></div>
               </section>
               <section class="card glass-card">
                 <div class="card-head"><h3>五维能力评估</h3></div>
                 <div ref="abilityRadarRef" class="echart-container"></div>
               </section>
            </div>

            <!-- 3. 核心实训与技能考证墙 -->
            <div class="skills-showcase-grid animate__animated animate__fadeInUp">
               <section class="card glass-card">
                 <div class="card-head"><h3>🛠 核心实训与项目实操</h3></div>
                 <div class="practice-list">
                   <div v-for="(proj, pIdx) in selectedStudent.vocationalData.trainingProjects" :key="pIdx" class="practice-item">
                     <div class="item-head">
                       <span class="proj-name">{{ proj.name }}</span>
                       <el-tag size="small" type="success" effect="dark">{{ proj.score }}分</el-tag>
                     </div>
                     <p class="proj-result"><strong>实训成果：</strong>{{ proj.result }}</p>
                   </div>
                 </div>
               </section>
               <section class="card glass-card">
                 <div class="card-head"><h3>🏆 技能证书与第二课堂竞赛</h3></div>
                 <div class="badge-walls">
                   <div class="wall-section">
                     <h4>获得资格证书</h4>
                     <div class="badge-container">
                       <div v-for="(cert, cIdx) in selectedStudent.vocationalData.certificates" :key="cIdx" class="badge-item">
                         <span class="badge-icon">🎖</span>
                         <span class="badge-name">{{ cert }}</span>
                       </div>
                     </div>
                   </div>
                   <div class="wall-section" v-if="selectedStudent.vocationalData.competitions.length">
                     <h4>竞赛荣誉记录</h4>
                     <div class="badge-container">
                       <div v-for="(comp, coIdx) in selectedStudent.vocationalData.competitions" :key="coIdx" class="badge-item gold">
                         <span class="badge-icon">🏆</span>
                         <span class="badge-name">{{ comp }}</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </section>
            </div>
          </el-tab-pane>

          <!-- 🚀 Tab 2: 就业匹配与能力补充 -->
          <el-tab-pane label="🚀 就业匹配与能力补充" name="career">
            <div class="career-prediction-view animate__animated animate__fadeIn">
              <!-- 1. 岗位匹配指数 -->
              <section class="card glass-card">
                <div class="card-head"><h3>🎯 推荐岗位匹配指数预测</h3></div>
                <div class="job-match-grid">
                  <div v-for="(job, jIdx) in selectedStudent.careerPrediction.jobMatchList" :key="jIdx" class="job-match-card">
                    <div class="job-meta">
                      <span class="job-name">{{ job.name }}</span>
                      <span class="job-rate" :style="{ color: getScoreColor(job.matchRate) }">{{ job.matchRate }}% 匹配度</span>
                    </div>
                    <el-progress 
                      :percentage="job.matchRate" 
                      :stroke-width="12" 
                      :color="getMatchProgressColor(job.matchRate)"
                      :show-text="false"
                    />
                    <p class="job-demand"><strong>岗位核心要求：</strong>{{ job.demand }}</p>
                  </div>
                </div>
              </section>

              <!-- 2. 短板与精准提升路线图 -->
              <div class="upgrade-roadmap-grid">
                <section class="card glass-card error-border">
                  <div class="card-head"><h3 class="danger-title">⚠️ 核心短板与知识盲区诊断</h3></div>
                  <div class="gap-analysis-list">
                    <div v-for="(gap, gIdx) in selectedStudent.careerPrediction.abilitiesGap.filter(g => g.type === '核心短板')" :key="gIdx" class="gap-item">
                      <p class="gap-content">{{ gap.content }}</p>
                    </div>
                  </div>
                </section>

                <section class="card glass-card success-border">
                  <div class="card-head"><h3 class="success-title">💡 学习补充与技能倍增路径</h3></div>
                  <div class="roadmap-timeline">
                    <!-- 课程建议 -->
                    <div class="roadmap-step">
                      <div class="step-num">01</div>
                      <div class="step-content">
                        <h5>建议修读的拓展课程</h5>
                        <p class="step-detail">
                          {{ selectedStudent.careerPrediction.abilitiesGap.find(g => g.type === '补充课程推荐').content }}
                        </p>
                      </div>
                    </div>
                    <!-- 证书建议 -->
                    <div class="roadmap-step">
                      <div class="step-num">02</div>
                      <div class="step-content">
                        <h5>建议考取的进阶行业证书</h5>
                        <p class="step-detail">
                          {{ selectedStudent.careerPrediction.abilitiesGap.find(g => g.type === '建议考取证书').content }}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </el-tab-pane>

          <!-- 🍃 Tab 3: 生活行为与社会适应度 -->
          <el-tab-pane label="🍃 生活行为与社会适应性" name="life">
            <div class="life-adaptability-view animate__animated animate__fadeIn">
              <!-- 1. 生活数字痕迹 -->
              <div class="life-stat-grid">
                <div class="life-card glass-card">
                  <div class="card-icon orange-bg">🍚</div>
                  <div class="card-stat">
                    <div class="stat-value">¥{{ selectedStudent.lifeData.canteenExpense }}/月</div>
                    <div class="stat-label">食堂月均消费</div>
                    <div class="stat-sub">理性节俭度高，饮食规律健康</div>
                  </div>
                </div>
                <div class="life-card glass-card">
                  <div class="card-icon blue-bg">💤</div>
                  <div class="card-stat">
                    <div class="stat-value">作息{{ selectedStudent.lifeData.sleepQuality }}</div>
                    <div class="stat-label">宿舍作息规律评分</div>
                    <div class="stat-sub">早睡早起，无晚归门禁记录</div>
                  </div>
                </div>
                <div class="life-card glass-card">
                  <div class="card-icon purple-bg">🤝</div>
                  <div class="card-stat">
                    <div class="stat-value">社交活跃度 {{ selectedStudent.lifeData.socialActive }}</div>
                    <div class="stat-label">第二课堂与人际互助</div>
                    <div class="stat-sub">社团积极成员，团队归属感强</div>
                  </div>
                </div>
              </div>

              <!-- 2. 性格特质与社会适应力评估 -->
              <div class="adaptability-assessment-grid">
                <!-- 性格与软实力评定 -->
                <section class="card glass-card">
                  <div class="card-head"><h3>性格特征标签与职场抗压推测</h3></div>
                  <div class="personality-tags-box">
                    <span v-for="(tag, tIdx) in selectedStudent.lifeData.personalityTags" :key="tIdx" class="personality-tag">
                      ✨ {{ tag }}
                    </span>
                  </div>
                  <div class="social-eval-box">
                    <h4>💡 AI 职场行为与抗压分析评语</h4>
                    <p class="social-eval-text">{{ selectedStudent.lifeData.socialEvaluation }}</p>
                  </div>
                </section>

                <!-- 社会适应性仪表盘 -->
                <section class="card glass-card">
                  <div class="card-head"><h3>🌟 未来社会与职场适应度指数</h3></div>
                  <div class="gauge-chart-container">
                    <div ref="socialGaugeRef" class="echart-gauge"></div>
                  </div>
                </section>
              </div>
            </div>
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

// 当前激活的 Tab 页，默认为 'campus' (在校大盘)
const activeTab = ref('campus')

// 模拟扩展的 6 名学生的全部维度在校数据、就业预测和生活微数据
const studentsList = ref([
  { 
    id: '2021001', name: '林静宜', gender: 'female', age: 20, major: '人工智能', class: 'AI21-01', score: 94, matchRate: 98, avatar: '/pic/student01.png', status: 'online', 
    dimensions: [
      { name: '出勤', value: 98, color: '#3b82f6' },
      { name: '互动', value: 85, color: '#8b5cf6' },
      { name: '课后', value: 92, color: '#10b981' },
      { name: '学习力', value: 95, color: '#f59e0b' },
      { name: '课外', value: 75, color: '#6366f1' }
    ],
    recentTrend: [60, 75, 70, 85, 90, 88, 92, 94],
    vocationalData: {
      gpa: "3.85",
      practiceScore: 96,
      trainingProjects: [
        { name: "基于 Vue3 + Element Plus 的教师 AI 智能档案袋系统开发实训", score: 98, result: "完成度100%，项目组长，主导核心架构与状态管理开发" },
        { name: "基于 Python + TensorFlow 的深度神经网络花卉图像分类实训", score: 95, result: "准确率达94.2%，完成完整的训练曲线与工程化部署报告" }
      ],
      certificates: ["1+X Web前端开发职业技能等级证书（中级）", "百度飞桨百校 AI 人才认证证书", "大学英语六级 (CET-6)"],
      competitions: ["2025年全国职业院校技能大赛（软件测试赛项）一等奖", "第十六届蓝桥杯软件设计大赛省一等奖"]
    },
    footprint: {
      libraryDays: 142,
      labHours: 320,
      absenceCount: 0
    },
    careerPrediction: {
      jobMatchList: [
        { name: "AI 算法开发助理", matchRate: 98, demand: "熟练掌握神经网络算法、Python 及 PyTorch 框架" },
        { name: "Web 前端开发工程师", matchRate: 92, demand: "熟练掌握 Vue3、TypeScript 与主流组件库生态" },
        { name: "智能数据治理专员", matchRate: 85, demand: "具备基础的数据清理、分类及 ETL 处理能力" }
      ],
      abilitiesGap: [
        { type: "核心短板", content: "缺乏分布式计算（Hadoop/Spark）及超海量数据并发处理的实战经验。" },
        { type: "补充课程推荐", content: "《分布式计算与海量数据处理训练》、《高并发高性能Web系统设计》" },
        { type: "建议考取证书", content: "《工信部人工智能算法工程师（高级）职业技能证书》" }
      ]
    },
    lifeData: {
      canteenExpense: 680,
      sleepQuality: "极佳",
      socialActive: "高",
      personalityTags: ["严谨自律", "极富创造力", "沉稳务实", "团队核心"],
      socialAdaptability: 96,
      socialEvaluation: "该生日常生活作息规律性极高，消费观理性健康。在团队项目中作为队长展现出极强的沟通协调与抗压决策能力，情绪稳定性优异，预估未来进入职场后能够极快适应企业团队协作环境。"
    }
  },
  { 
    id: '2021002', name: '周泽楷', gender: 'male', age: 21, major: '人工智能', class: 'AI21-01', score: 88, matchRate: 92, avatar: '/pic/student02.png', status: 'online',
    dimensions: [
      { name: '出勤', value: 100, color: '#3b82f6' },
      { name: '互动', value: 75, color: '#8b5cf6' },
      { name: '课后', value: 80, color: '#10b981' },
      { name: '学习力', value: 92, color: '#f59e0b' },
      { name: '课外', value: 88, color: '#6366f1' }
    ],
    recentTrend: [70, 72, 75, 80, 82, 85, 87, 88],
    vocationalData: {
      gpa: "3.52",
      practiceScore: 92,
      trainingProjects: [
        { name: "自然语言处理 (NLP) 智能客服问答实训", score: 94, result: "完成文本分词、TF-IDF 特征提取与模型部署" },
        { name: "工控机边缘计算与机器视觉应用实战", score: 90, result: "基于 OpenCV 实现缺陷产品检测，检出率达98%" }
      ],
      certificates: ["1+X 智能应用开发职业技能证书（中级）", "阿里云云计算助理工程师认证 (ACA)"],
      competitions: ["“挑战杯”大学生课外学术科技竞赛省级二等奖"]
    },
    footprint: {
      libraryDays: 98,
      labHours: 280,
      absenceCount: 0
    },
    careerPrediction: {
      jobMatchList: [
        { name: "智能系统测试工程师", matchRate: 94, demand: "精通自动化测试框架及脚本编写，有 AI 测评经验优先" },
        { name: "Python 后端开发助理", matchRate: 88, demand: "熟练掌握 Django/FastAPI，理解数据库设计和 SQL 优化" },
        { name: "机器视觉应用工程师", matchRate: 85, demand: "掌握 OpenCV 与基础的图像检测与识别算法" }
      ],
      abilitiesGap: [
        { type: "核心短板", content: "课堂公开演讲与互动表达的主动性偏弱，公共展示能力有待提升。" },
        { type: "补充课程推荐", content: "《职场沟通与项目路演演练》、《高等软件工程学》" },
        { type: "建议考取证书", content: "《软件设计师职业水平证书（中级）》" }
      ]
    },
    lifeData: {
      canteenExpense: 820,
      sleepQuality: "良好",
      socialActive: "中等",
      personalityTags: ["低调内敛", "专注技术", "踏实肯干", "执行力极强"],
      socialAdaptability: 88,
      socialEvaluation: "该生日常专注于实训与技术研发，人际交往稳健。虽然言语较少，但技术方案交付极其精准，属于“默默耕耘型”的核心技术人员。未来在以结果导向为特征的研发团队中生存指数极高。"
    }
  },
  { 
    id: '2021003', name: '苏沐橙', gender: 'female', age: 20, major: '计算机科学', class: 'CS21-03', score: 91, matchRate: 85, avatar: '/pic/student03.png', status: 'away',
    dimensions: [
      { name: '出勤', value: 100, color: '#3b82f6' },
      { name: '互动', value: 95, color: '#8b5cf6' },
      { name: '课后', value: 95, color: '#10b981' },
      { name: '学习力', value: 95, color: '#f59e0b' },
      { name: '课外', value: 95, color: '#6366f1' }
    ],
    recentTrend: [85, 86, 84, 88, 89, 90, 91, 91],
    vocationalData: {
      gpa: "3.78",
      practiceScore: 95,
      trainingProjects: [
        { name: "计算机网络与多局域网互联规划综合实训", score: 96, result: "完成企业园区网拓扑设计、VLAN划分及安全路由配置" },
        { name: "基于 Node.js 的多人在线协同文档管理系统", score: 94, result: "实现了实时 WebSocket 协同，代码规范极高" }
      ],
      certificates: ["1+X Web前端开发职业技能证书（中级）", "华为认证网络工程师 (HCIA)"],
      competitions: ["全国“互联网+”大学生创新创业大赛银奖", "校级三好学生标兵"]
    },
    footprint: {
      libraryDays: 160,
      labHours: 240,
      absenceCount: 0
    },
    careerPrediction: {
      jobMatchList: [
        { name: "全栈开发助理工程师", matchRate: 90, demand: "精通 HTML5/CSS3/JS，熟悉 Vue + Node 体系" },
        { name: "企业网络配置管理员", matchRate: 85, demand: "熟练掌握主流交换机、路由器配置与综合布线设计" },
        { name: "产品经理助理/技术支持", matchRate: 82, demand: "优秀的技术理解力、卓越的书面汇报与宣讲表达能力" }
      ],
      abilitiesGap: [
        { type: "核心短板", content: "底层的系统级底层原理及C/C++编译优化基础略薄弱。" },
        { type: "补充课程推荐", content: "《计算机组成原理与系统调优》、《C++高级程序设计》" },
        { type: "建议考取证书", content: "《全国计算机技术与软件资格水平证书（网络工程师）》" }
      ]
    },
    lifeData: {
      canteenExpense: 590,
      sleepQuality: "优秀",
      socialActive: "高",
      personalityTags: ["亲和力强", "心思细腻", "多才多艺", "极佳沟通者"],
      socialAdaptability: 95,
      socialEvaluation: "该生日常沟通极其亲和，深受师生喜爱。在数字足迹中表现出高强度的图书馆打卡和稳定的宿舍作息。其人际沟通、双语表达和同理心均极强，是极佳的项目接口与技术复合型管理储备人才。"
    }
  },
  { 
    id: '2021004', name: '黄少天', gender: 'male', age: 20, major: '软件工程', class: 'SE21-02', score: 76, matchRate: 72, avatar: '/pic/student04.png', status: 'online',
    dimensions: [
      { name: '出勤', value: 65, color: '#3b82f6' },
      { name: '互动', value: 98, color: '#8b5cf6' },
      { name: '课后', value: 55, color: '#10b981' },
      { name: '学习力', value: 72, color: '#f59e0b' },
      { name: '课外', value: 92, color: '#6366f1' }
    ],
    recentTrend: [60, 65, 62, 68, 70, 72, 75, 76],
    vocationalData: {
      gpa: "2.80",
      practiceScore: 88,
      trainingProjects: [
        { name: "高频秒杀架构与 Redis 缓存优化实训", score: 94, result: "完成高并发分布式锁设计，单机QPS从800优化至4500" },
        { name: "软件项目快速敏捷开发迭代实战", score: 85, result: "担任技术敏捷教练，极快完成功能冲刺，开发速度极快" }
      ],
      certificates: ["高级程序员资格证书", "红帽Linux认证系统管理员 (RHCSA)"],
      competitions: ["中国大学生程序设计竞赛 (CCPC) 优胜奖", "校内黑客马拉松一等奖"]
    },
    footprint: {
      libraryDays: 32,
      labHours: 410,
      absenceCount: 3
    },
    careerPrediction: {
      jobMatchList: [
        { name: "高并发系统运维 / SRE 助理", matchRate: 85, demand: "精通 Linux 命令、Docker 容器与高并发性能调优" },
        { name: "前端/客户端开发快速实现员", matchRate: 82, demand: "编码速度极快，能够对原型需求进行极速输出" },
        { name: "软件技术顾问 / 售后研发", matchRate: 80, demand: "具备敏捷的逻辑反应能力与高强度的技术沟通能力" }
      ],
      abilitiesGap: [
        { type: "核心短板", content: "出勤率不稳定，在理论规范和系统性文档编写方面缺乏耐心。" },
        { type: "补充课程推荐", content: "《软件开发文档与工程规范》、《大学软件架构模式》" },
        { type: "建议考取证书", content: "《系统集成项目管理工程师证书》" }
      ]
    },
    lifeData: {
      canteenExpense: 920,
      sleepQuality: "紊乱",
      socialActive: "极高",
      personalityTags: ["活泼敏捷", "动手极快", "抗挫折强", "脑洞大开"],
      socialAdaptability: 82,
      socialEvaluation: "该生日常极其活跃，思维奔放，具备极强的代码快速交付和即兴开发能力（黑客马拉松获奖）。但作息呈现夜猫子特征，缺勤率偏高。建议重点培养规则意识，其灵活度和外向性格使其在高度扁平化、灵活创业型团队中如鱼得水。"
    }
  },
  { 
    id: '2021005', name: '喻文州', gender: 'male', age: 21, major: '数据科学', class: 'DS21-01', score: 85, matchRate: 95, avatar: '/pic/student05.png', status: 'offline',
    dimensions: [
      { name: '出勤', value: 98, color: '#3b82f6' },
      { name: '互动', value: 78, color: '#8b5cf6' },
      { name: '课后', value: 90, color: '#10b981' },
      { name: '学习力', value: 95, color: '#f59e0b' },
      { name: '课外', value: 80, color: '#6366f1' }
    ],
    recentTrend: [80, 81, 82, 83, 84, 85, 85, 85],
    vocationalData: {
      gpa: "3.68",
      practiceScore: 86,
      trainingProjects: [
        { name: "商业智能 (BI) 与大数据分析可视化大屏实训", score: 92, result: "完成多维度销售额预测，主导了超复杂的报表算法编写" },
        { name: "基于 Spark 的全国气象历史数据聚类分析", score: 84, result: "完成完整的数据管道清洗，并输出高水平分析综述" }
      ],
      certificates: ["1+X 大数据应用开发职业技能证书（高级）", "SAS 认证数据分析师认证"],
      competitions: ["全国大学生数学建模大赛省级一等奖", "优秀学生干部称号"]
    },
    footprint: {
      libraryDays: 180,
      labHours: 200,
      absenceCount: 0
    },
    careerPrediction: {
      jobMatchList: [
        { name: "商业数据分析师 (BI)", matchRate: 95, demand: "精通 SQL、PowerBI 与数据清洗建模理论" },
        { name: "初级数据架构师 / ETL 开发", matchRate: 88, demand: "深刻理解数据库底层原理、数据总线及规范建模" },
        { name: "技术规划总监储备 / 咨询顾问", matchRate: 85, demand: "大局观极佳，擅长从海量杂乱数据中提炼底层规律" }
      ],
      abilitiesGap: [
        { type: "核心短板", content: "纯手工手写硬核高性能C/Rust极速并发底层开发速度中等。" },
        { type: "补充课程推荐", content: "《Linux高性能服务器编程》、《Rust编程语言核心训练》" },
        { type: "建议考取证书", content: "《系统架构设计师职业资格（高级）》" }
      ]
    },
    lifeData: {
      canteenExpense: 620,
      sleepQuality: "极佳",
      socialActive: "高",
      personalityTags: ["大局观强", "温和沉稳", "逻辑大师", "战略家"],
      socialAdaptability: 97,
      socialEvaluation: "该生日常极其稳重，拥有超凡的逻辑框架感和组织协调能力（数学建模获一等奖，班干经历）。作息常年规律，消费适度。虽动手爆码速度并非最快，但其分析眼光长远、容人度极高，是一位天生的统帅与规划性骨干人才。"
    }
  },
  { 
    id: '2021006', name: '叶修', gender: 'male', age: 22, major: '人工智能', class: 'AI21-01', score: 98, matchRate: 100, avatar: '/pic/student01.png', status: 'online',
    dimensions: [
      { name: '出勤', value: 100, color: '#3b82f6' },
      { name: '互动', value: 100, color: '#8b5cf6' },
      { name: '课后', value: 100, color: '#10b981' },
      { name: '学习力', value: 100, color: '#f59e0b' },
      { name: '课外', value: 100, color: '#6366f1' }
    ],
    recentTrend: [90, 92, 94, 96, 97, 98, 98, 98],
    vocationalData: {
      gpa: "4.00",
      practiceScore: 99,
      trainingProjects: [
        { name: "全自主智能无人机室外激光 SLAM 导航系统实训", score: 100, result: "完成高精度实时建图与避障算法优化，代码作为校级标杆封存" },
        { name: "企业级高并发混合云 AI 模型部署与服务中台", score: 98, result: "实现毫秒级推理吞吐，成功解决多卡调度瓶颈" }
      ],
      certificates: ["1+X Web前端开发职业技能证书（高级）", "工信部人工智能算法工程师（高级）证书", "AWS Certified Solutions Architect - Professional"],
      competitions: ["2024年全国职业院校技能大赛（区块链技术赛项）特等奖", "中国软件杯全国软件设计大赛一等奖"]
    },
    footprint: {
      libraryDays: 195,
      labHours: 520,
      absenceCount: 0
    },
    careerPrediction: {
      jobMatchList: [
        { name: "AI 平台架构设计师", matchRate: 100, demand: "精通深度学习、大模型推理架构、K8s 容器云平台" },
        { name: "资深全栈研发工程师", matchRate: 98, demand: "熟悉前后端完整体系，精通底层并发调优与云原生" },
        { name: "技能大师工作室核心人员", matchRate: 95, demand: "拥有全国性大赛一等奖或行业突出成果背景" }
      ],
      abilitiesGap: [
        { type: "核心短板", content: "各维度能力已趋近天花板，在跨专业学科融通上仍有探索空间。" },
        { type: "补充课程推荐", content: "《多模态情感计算交叉研究》、《区块链与零知识证明前沿》" },
        { type: "建议考取证书", content: "《系统分析师资格证书（高级）》" }
      ]
    },
    lifeData: {
      canteenExpense: 550,
      sleepQuality: "良好",
      socialActive: "高",
      personalityTags: ["战术大师", "遇事冷静", "核心支柱", "深不可测"],
      socialAdaptability: 98,
      socialEvaluation: "该生综合能力处于无可挑剔的绝对顶尖水平，绩点满分，技能证书与特等奖竞赛荣誉大满贯。极其沉着冷静，日常抗压指数达顶级。无论遇到多严峻的业务瓶颈或复杂人际环境，均能以战略级眼光迅速化解，是全功能型领袖人才。"
    }
  },
])

const filterSort = ref('score')
const selectedStudentId = ref(null)
const selectedStudent = ref(null)

const sortedStudents = computed(() => {
  return [...studentsList.value].sort((a, b) => {
    if (filterSort.value === 'score') return b.score - a.score
    return b.matchRate - a.matchRate
  })
})

const getScoreColor = (score) => {
  if (score >= 90) return '#10b981'
  if (score >= 80) return '#3b82f6'
  return '#f59e0b'
}

const getMatchColor = (rate) => {
  if (rate >= 90) return 'linear-gradient(90deg, #10b981, #34d399)'
  if (rate >= 80) return 'linear-gradient(90deg, #3b82f6, #60a5fa)'
  return 'linear-gradient(90deg, #f59e0b, #fbbf24)'
}

const getMatchProgressColor = (rate) => {
  if (rate >= 90) return '#10b981'
  if (rate >= 80) return '#3b82f6'
  return '#f59e0b'
}

const viewDetail = (student) => {
  selectedStudent.value = student
  selectedStudentId.value = student.id
  activeTab.value = 'campus' // 默认重置 Tab
  nextTick(() => {
    initCampusCharts()
  })
}

const goBack = () => {
  selectedStudentId.value = null
  activeTab.value = 'campus'
  destroyCharts()
}

// 详情页图表 Ref
const personalTrendRef = ref(null)
const abilityRadarRef = ref(null)
const socialGaugeRef = ref(null)

let trendChart = null
let radarChart = null
let gaugeChart = null

// 1. 初始化「在校表现」Tab 的图表（折线图、雷达图）
const initCampusCharts = () => {
  if (!selectedStudent.value) return

  // 折线图：学习表现趋势
  if (personalTrendRef.value) {
    if (trendChart) trendChart.dispose()
    trendChart = echarts.init(personalTrendRef.value)
    trendChart.setOption({
      tooltip: { 
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 0,
        textStyle: { color: '#1e293b' },
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      },
      grid: { left: '4%', right: '4%', bottom: '5%', top: '10%', containLabel: true },
      xAxis: { 
        type: 'category', 
        data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'], 
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#64748b' }
      },
      yAxis: { 
        type: 'value', 
        splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } },
        axisLabel: { color: '#64748b' }
      },
      series: [{
        data: selectedStudent.value.recentTrend,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 4, color: '#3b82f6' },
        itemStyle: { color: '#3b82f6', borderWidth: 2, borderColor: '#fff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.25)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' }
          ])
        }
      }]
    })
  }

  // 雷达图：五维能力评估
  if (abilityRadarRef.value) {
    if (radarChart) radarChart.dispose()
    radarChart = echarts.init(abilityRadarRef.value)
    
    // 从 dimensions 中抓取数据
    const radarData = selectedStudent.value.dimensions.map(d => d.value)
    const radarIndicator = selectedStudent.value.dimensions.map(d => ({ name: d.name, max: 100 }))

    radarChart.setOption({
      tooltip: { trigger: 'item' },
      radar: {
        indicator: radarIndicator,
        radius: '68%',
        splitArea: { show: false },
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
        name: {
          textStyle: {
            color: '#64748b',
            fontSize: 12,
            fontWeight: 500,
            borderRadius: 3,
            padding: [3, 5]
          }
        }
      },
      series: [{
        type: 'radar',
        data: [{
          value: radarData,
          name: '硬核能力指数',
          areaStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: 'rgba(139, 92, 246, 0.4)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
            ])
          },
          lineStyle: { color: '#8b5cf6', width: 3 },
          itemStyle: { color: '#8b5cf6' }
        }]
      }]
    })
  }
}

// 2. 初始化「生活与社会适应度」Tab 的图表（社会适应度仪表盘）
const initLifeCharts = () => {
  if (!selectedStudent.value) return

  if (socialGaugeRef.value) {
    if (gaugeChart) gaugeChart.dispose()
    gaugeChart = echarts.init(socialGaugeRef.value)

    const socialVal = selectedStudent.value.lifeData.socialAdaptability

    gaugeChart.setOption({
      series: [
        // 1. 外层极其微弱的科技装饰细光环 (2px)
        {
          type: 'gauge',
          startAngle: 220,
          endAngle: -40,
          min: 0,
          max: 100,
          radius: '100%',
          center: ['50%', '52%'],
          axisLine: {
            lineStyle: {
              width: 2,
              color: [[1, 'rgba(99, 102, 241, 0.15)']]
            }
          },
          pointer: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false }
        },
        // 2. 内层主能量进度轨道
        {
          type: 'gauge',
          startAngle: 220,
          endAngle: -40,
          min: 0,
          max: 100,
          radius: '90%',
          center: ['50%', '52%'],
          pointer: {
            show: false
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            width: 18,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#8b5cf6' }, // 紫罗兰
                { offset: 0.5, color: '#6366f1' }, // 科幻蓝
                { offset: 1, color: '#06b6d4' } // 极光青
              ])
            }
          },
          axisLine: {
            roundCap: true,
            lineStyle: { 
              width: 18, 
              color: [[1, 'rgba(226, 232, 240, 0.4)']] // 优雅淡色底轨
            }
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          data: [{
            value: socialVal,
            name: '未来社会与职场适应度'
          }],
          title: {
            offsetCenter: [0, '40%'],
            fontSize: 13,
            color: '#94a3b8',
            fontWeight: 600
          },
          detail: {
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: '{value}%',
            fontSize: 42,
            color: '#1e293b',
            fontWeight: 900
          }
        }
      ]
    })
  }
}

// 3. 统一注销和销毁图表
const destroyCharts = () => {
  trendChart?.dispose()
  radarChart?.dispose()
  gaugeChart?.dispose()
  trendChart = null
  radarChart = null
  gaugeChart = null
}

// 4. Tab 切换核心联动处理
const handleTabClick = (tab) => {
  destroyCharts()
  nextTick(() => {
    if (tab.props.name === 'campus') {
      initCampusCharts()
    } else if (tab.props.name === 'life') {
      initLifeCharts()
    }
  })
}

// 监听当前激活的学生变动，强制重绘
watch(selectedStudentId, () => {
  destroyCharts()
})

onUnmounted(() => {
  destroyCharts()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

.student-portrait-container {
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1e293b;
}

/* 玻璃拟态卡片公共样式 */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  padding: 28px;
}

/* 列表页样式 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.view-title {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.view-title span {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 400;
  margin-left: 12px;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.student-item-bar {
  background: white;
  border-radius: 20px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation-delay: var(--delay);
}

.student-item-bar:hover {
  transform: scale(1.008) translateX(6px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.06);
  border-color: #3b82f6;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 300px;
}

.avatar-wrapper {
  position: relative;
}

.avatar-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f8fafc;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online { background: #10b981; }
.status-indicator.away { background: #f59e0b; }
.status-indicator.offline { background: #94a3b8; }

.basic-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.student-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.gender-tag {
  font-size: 12px;
  margin-left: 8px;
}

.gender-tag.male { color: #3b82f6; }
.gender-tag.female { color: #ec4899; }

.sub-info {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.divider {
  opacity: 0.3;
}

.item-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40px;
}

.dimension-dots {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
}

.dim-dot-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 60px;
}

.dim-dot {
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.student-item-bar:hover .dim-dot {
  transform: scale(1.15);
}

.dim-name {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 40px;
  width: 320px;
  justify-content: flex-end;
}

.score-box, .match-box {
  text-align: right;
}

.score-label, .match-label {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.score-value {
  font-size: 24px;
  font-weight: 800;
}

.match-badge {
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: #cbd5e1;
  transition: transform 0.3s;
}

.student-item-bar:hover .arrow-icon {
  transform: translateX(4px);
  color: #3b82f6;
}

/* 详情页样式 */
.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.back-btn {
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
  transition: all 0.3s;
}

.back-btn:hover {
  border-color: #3b82f6;
  background-color: #f0f6ff;
  transform: scale(1.05);
}

.back-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
}

.back-btn:hover .back-icon {
  color: #3b82f6;
}

.back-text {
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.3s;
}

.back-text:hover {
  color: #3b82f6;
}

/* 顶部学生基本信息大卡片 */
.student-info-card {
  padding: 32px;
  margin-bottom: 24px;
}

.student-info-header {
  display: flex;
  gap: 32px;
  align-items: center;
}

.avatar-large-wrapper {
  position: relative;
}

.avatar-large {
  width: 110px;
  height: 110px;
  border-radius: 24px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}

.status-indicator-large {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 4px solid white;
}

.status-indicator-large.online { background: #10b981; }
.status-indicator-large.away { background: #f59e0b; }
.status-indicator-large.offline { background: #94a3b8; }

.student-basic-info {
  text-align: left;
  flex: 1;
}

.student-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.student-name-row h3 {
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  color: #1e293b;
}

.status-pill {
  font-size: 12px;
  background: #e2fbf0;
  color: #10b981;
  padding: 3px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.major-pill {
  font-size: 12px;
  background: #f0f6ff;
  color: #3b82f6;
  padding: 3px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.student-meta-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.meta-label {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 6px;
  font-weight: 500;
}

.meta-value {
  font-size: 16px;
  font-weight: 700;
  color: #334155;
}

.score-high {
  color: #8b5cf6;
}

/* El-Tabs 样式深度优化，使其更具科技质感 */
.detail-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: transparent;
}

.detail-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 700;
  color: #94a3b8;
  height: 50px;
  line-height: 50px;
  transition: all 0.3s;
}

.detail-tabs :deep(.el-tabs__item.is-active) {
  color: #3b82f6;
}

.detail-tabs :deep(.el-tabs__active-bar) {
  background-color: #3b82f6;
  height: 3px;
  border-radius: 2px;
}

.detail-tabs :deep(.el-tab-pane) {
  padding: 24px 8px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Tab 1: 在校大盘样式 */
.footprint-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.footprint-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.blue-bg { background-color: rgba(59, 130, 246, 0.08); }
.purple-bg { background-color: rgba(139, 92, 246, 0.08); }
.green-bg { background-color: rgba(16, 185, 129, 0.08); }
.orange-bg { background-color: rgba(245, 158, 11, 0.08); }

.card-stat {
  text-align: left;
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
}

.stat-label {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
  font-weight: 500;
}

.stat-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
}

/* 图表网格布局 */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.card {
  text-align: left;
}

.card-head h3 {
  margin: 0 0 20px 0;
  font-size: 17px;
  font-weight: 800;
  color: #1e293b;
  border-left: 4px solid #3b82f6;
  padding-left: 10px;
}

.echart-container {
  height: 300px;
}

/* 核心实训与技能墙 */
.skills-showcase-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  margin-bottom: 24px;
}

.practice-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.practice-item {
  background: rgba(248, 250, 252, 0.6);
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 16px 20px;
}

.item-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.proj-name {
  font-weight: 700;
  font-size: 15px;
  color: #1e293b;
}

.proj-result {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* 技能与竞赛证书墙 */
.badge-walls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wall-section h4 {
  font-size: 14px;
  color: #475569;
  margin: 0 0 12px 0;
  font-weight: 700;
}

.badge-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  transition: all 0.3s;
}

.badge-item:hover {
  background: #e2e8f0;
  transform: scale(1.02);
}

.badge-item.gold {
  background: #fef3c7;
  border-color: #fde68a;
  color: #d97706;
}

.badge-item.gold:hover {
  background: #fde68a;
}

.badge-icon {
  font-size: 14px;
}

/* Tab 2: 就业匹配与能力补充样式 */
.career-prediction-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.job-match-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.job-match-card {
  background: rgba(248, 250, 252, 0.6);
  border: 1px solid #f1f5f9;
  border-radius: 20px;
  padding: 20px;
  text-align: left;
  transition: all 0.3s;
}

.job-match-card:hover {
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 8px 20px rgba(59,130,246,0.04);
}

.job-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.job-name {
  font-weight: 800;
  font-size: 15px;
  color: #1e293b;
}

.job-rate {
  font-weight: 800;
  font-size: 14px;
}

.job-match-card :deep(.el-progress) {
  margin-bottom: 16px;
}

.job-demand {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.upgrade-roadmap-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.error-border {
  border-color: rgba(239, 68, 68, 0.2);
}

.success-border {
  border-color: rgba(16, 185, 129, 0.2);
}

.danger-title {
  border-left-color: #ef4444 !important;
  color: #b91c1c !important;
}

.success-title {
  border-left-color: #10b981 !important;
  color: #047857 !important;
}

.gap-analysis-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gap-item {
  background: rgba(254, 242, 242, 0.6);
  border: 1px solid rgba(252, 165, 165, 0.3);
  padding: 14px 18px;
  border-radius: 14px;
}

.gap-content {
  font-size: 13px;
  color: #b91c1c;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
}

.roadmap-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.roadmap-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.step-num {
  width: 32px;
  height: 32px;
  background: #ecfdf5;
  border: 2px solid #059669;
  color: #059669;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
}

.step-content {
  flex: 1;
  text-align: left;
}

.step-content h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 700;
  color: #059669;
}

.step-detail {
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

/* Tab 3: 生活与社会适应度 */
.life-adaptability-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.life-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.life-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.adaptability-assessment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.personality-tags-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.personality-tag {
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
  color: #6d28d9;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.social-eval-box h4 {
  font-size: 14px;
  color: #1e293b;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.social-eval-text {
  font-size: 13.5px;
  color: #475569;
  line-height: 1.7;
  background: #f8fafc;
  padding: 16px 20px;
  border-radius: 16px;
  margin: 0;
  border-left: 4px solid #6366f1;
}

.gauge-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
}

.echart-gauge {
  width: 100%;
  height: 100%;
}
</style>
