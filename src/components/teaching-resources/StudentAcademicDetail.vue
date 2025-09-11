<template>
  <div class="student-academic-detail">
    <div class="page-header">
      <div class="header-content">
        <h1>当前查看学生</h1>
        <div class="student-info" v-if="student">
          <div class="student-avatar">
            <img :src="studentPhoto" alt="学生照片" class="student-photo" />
          </div>
          <div class="student-meta">
            <div class="student-name">{{ student.name }}</div>
            <div class="student-id">{{ student.studentId }}</div>
            <div class="student-class">{{ student.className }}</div>
          </div>
          <div class="student-switcher">
            <button class="switcher-btn" @click="toggleStudentList">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              切换学生
            </button>
            <div class="student-dropdown" v-if="showStudentList">
              <div class="dropdown-header">选择学生</div>
              <div class="dropdown-search">
                <input type="text" placeholder="搜索学生姓名/学号" v-model="studentSearch">
              </div>
              <div class="dropdown-list">
                <div 
                  v-for="(item, idx) in filteredStudentList" 
                  :key="idx" 
                  class="dropdown-item"
                  :class="{ active: item.studentId === student.studentId }"
                  @click="switchStudent(item)"
                >
                  <div class="item-avatar">
                    <img :src="getRandomPhoto()" alt="学生照片" class="student-photo" />
                  </div>
                  <div class="item-info">
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-id">{{ item.studentId }} | {{ item.className }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="back-btn" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          返回
        </button>
      </div>
    </div>
    
    <div class="content-container">
      <div class="tabs-container">
        <div class="tabs-header">
          <div 
            v-for="(tab, idx) in ['学生画像', '考试成绩', '出勤情况', '作业提交', '课堂互动', '学分情况', '课程建议', '科研项目', '消费情况', '专业匹配', '就业建议']" 
            :key="idx"
            :class="['tab-item', { active: activeDetailTab === idx }]"
            @click="handleTabClick(idx)"
          >
            {{ tab }}
          </div>
        </div>
        <div class="tabs-content">
          <!-- 学生画像 -->
          <div v-if="activeDetailTab === 0" class="tab-content">
            <div class="profile-grid">
              <!-- 学业画像 -->
              <div class="profile-card">
                <h2 class="card-title">学业画像</h2>
                <div class="card-content">
                  <div ref="academicChart" class="radar-chart"></div>
                  <div class="academic-stats">
                    <div class="stat-item"><span>GPA 3.85</span></div>
                    <div class="stat-item"><span>专业排名 5/120</span></div>
                    <div class="stat-item"><span>核心课程平均分 92</span></div>
                  </div>
                </div>
              </div>

              <!-- 性格画像 -->
              <div class="profile-card">
                <h2 class="card-title">性格画像</h2>
                <div class="card-content personality-content">
                  <div class="personality-top">
                    <div class="mbti-tag enfj">ENFJ</div>
                    <div class="personality-image">
                      <img src="/pic/enfj.png" alt="ENFJ Avatar">
                    </div>
                  </div>
                  <p class="mbti-desc">富有魅力和感召力的领导者，天生的组织者，ENFJ是现实世界的「灵魂之火」——他们燃烧自己点亮他人前行的路，但需谨记：真正的改变始于接纳不完美，而非背负全世界。</p>
                  <div class="trait-tags">
                    <span class="trait">#同理心强</span>
                    <span class="trait">#善于交际</span>
                    <span class="trait">#乐于助人</span>
                    <span class="trait">#责任心强</span>
                  </div>
                </div>
              </div>


              <!-- 兴趣画像 -->
              <div class="profile-card">
                <h2 class="card-title">兴趣画像</h2>
                <div class="card-content">
                  <div ref="interestChart" class="word-cloud-chart"></div>
                </div>
              </div>

              <!-- 学力画像 -->
              <div class="profile-card">
                <h2 class="card-title">学力画像</h2>
                <div class="card-content">
                  <div ref="learningPowerChart" class="bar-chart"></div>
                </div>
              </div>

              <!-- 校内行为画像 -->
              <div class="profile-card">
                <h2 class="card-title">校内行为画像</h2>
                <div class="card-content">
                  <div ref="roseChart" class="rose-chart"></div>
                </div>
              </div>

              <!-- 社交画像 -->
              <div class="profile-card">
                <h2 class="card-title">社交画像</h2>
                <div class="card-content">
                  <div ref="socialChart" class="word-cloud-chart"></div>
                </div>
              </div>

              <!-- 图书馆借阅 -->
              <div class="profile-card">
                <h2 class="card-title">图书馆借阅</h2>
                <div class="card-content">
                  <div class="library-stats">
                  </div>
                  <div ref="libraryChart" class="library-chart"></div>

                </div>
              </div>

              <!-- 作息情况 -->
              <div class="profile-card">
                <h2 class="card-title">作息情况</h2>
                <div class="card-content">
                  <div class="schedule-overview">
                    <div class="overview-item">
                      <div class="overview-value">{{ scheduleData.avgSleepTime }}</div>
                      <div class="overview-label">平均睡眠时间(小时)</div>
                    </div>
                    <div class="overview-item">
                      <div class="overview-value">{{ scheduleData.earlyRiseRate }}%</div>
                      <div class="overview-label">早起频率</div>
                    </div>
                    <div class="overview-item">
                      <div class="overview-value">{{ scheduleData.lateReturnCount }}</div>
                      <div class="overview-label">晚归次数(本月)</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 校内论坛 -->
              <div class="profile-card">
                <h2 class="card-title">校内论坛</h2>
                <div class="card-content">
                  <div class="forum-stats">
                  </div>
                  <div ref="forumChart" class="forum-chart"></div>


                </div>
              </div>

            </div>
          </div>
          <!-- 考试成绩选项卡内容 -->
          <div v-if="activeDetailTab === 1" class="tab-content">
            <table class="detail-table">
              <thead>
                <tr>
                  <th>课程名称</th>
                  <th>考试类型</th>
                  <th>考试时间</th>
                  <th>成绩</th>
                  <th>学分</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(exam, idx) in studentExams" :key="idx">
                  <td>{{ exam.courseName }}</td>
                  <td>{{ exam.examType }}</td>
                  <td>{{ exam.examDate }}</td>
                  <td>{{ exam.score }}</td>
                  <td>{{ exam.credit }}</td>
                  <td>
                    <span :class="['status-tag', getExamStatusClass(exam.status)]">{{ exam.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="summary-section">
              <div class="summary-title">总结</div>
              <div class="summary-content">
                <div class="summary-item">
                  <div class="summary-label">总学分:</div>
                  <div class="summary-value">{{ studentCreditSummary.totalCredits }}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">已获学分:</div>
                  <div class="summary-value">{{ studentCreditSummary.earnedCredits }}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">平均分:</div>
                  <div class="summary-value">{{ studentCreditSummary.averageScore }}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">GPA:</div>
                  <div class="summary-value">{{ studentCreditSummary.gpa }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 出勤情况选项卡内容 -->
          <div v-else-if="activeDetailTab === 2" class="tab-content">
            <div class="attendance-summary">
              <div class="attendance-chart">
                <div class="chart-title">出勤率统计</div>
                <div class="progress-circle">
                  <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                      :stroke-dasharray="`${studentAttendance.attendanceRate}, 100`"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage">{{ studentAttendance.attendanceRate }}%</text>
                  </svg>
                </div>
              </div>
              <div class="attendance-stats">
                <div class="stat-item">
                  <div class="stat-label">总课时</div>
                  <div class="stat-value">{{ studentAttendance.totalClasses }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">出勤</div>
                  <div class="stat-value">{{ studentAttendance.attendedClasses }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">缺勤</div>
                  <div class="stat-value">{{ studentAttendance.missedClasses }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">请假</div>
                  <div class="stat-value">{{ studentAttendance.leavedClasses }}</div>
                </div>
              </div>
            </div>
            <table class="detail-table">
              <thead>
                <tr>
                  <th>课程名称</th>
                  <th>日期</th>
                  <th>时间</th>
                  <th>状态</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(record, idx) in studentAttendance.records" :key="idx">
                  <td>{{ record.courseName }}</td>
                  <td>{{ record.date }}</td>
                  <td>{{ record.time }}</td>
                  <td>
                    <span :class="['status-tag', getAttendanceStatusClass(record.status)]">{{ record.status }}</span>
                  </td>
                  <td>{{ record.remark }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 作业提交情况选项卡内容 -->
          <div v-else-if="activeDetailTab === 3" class="tab-content">
            <div class="homework-summary">
              <div class="chart-container">
                <div class="chart-title">作业提交情况统计</div>
                <div class="pie-chart">
                  <div class="pie-segment" style="--percentage: 92; --color: #52c41a;">
                    <span class="pie-label">按时提交 92%</span>
                  </div>
                  <div class="pie-segment" style="--percentage: 8; --color: #ff4d4f; --offset: 92;">
                    <span class="pie-label">未按时 8%</span>
                  </div>
                </div>
              </div>
              <div class="homework-stats">
                <div class="stat-item">
                  <div class="stat-label">总作业数</div>
                  <div class="stat-value">{{ homeworkData.totalAssignments }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">已提交</div>
                  <div class="stat-value">{{ homeworkData.submittedAssignments }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">逾期提交</div>
                  <div class="stat-value">{{ homeworkData.lateSubmissions }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">未提交</div>
                  <div class="stat-value">{{ homeworkData.missedAssignments }}</div>
                </div>
              </div>
            </div>
            <table class="detail-table">
              <thead>
                <tr>
                  <th>课程名称</th>
                  <th>作业标题</th>
                  <th>截止日期</th>
                  <th>提交时间</th>
                  <th>状态</th>
                  <th>分数</th>
                  <th>反馈</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(assignment, idx) in homeworkData.assignments" :key="idx">
                  <td>{{ assignment.courseName }}</td>
                  <td>{{ assignment.title }}</td>
                  <td>{{ assignment.deadline }}</td>
                  <td>{{ assignment.submitTime || '未提交' }}</td>
                  <td>
                    <span :class="['status-tag', getHomeworkStatusClass(assignment.status)]">{{ assignment.status }}</span>
                  </td>
                  <td>{{ assignment.score }}</td>
                  <td>{{ assignment.feedback }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 课堂互动选项卡内容 -->
          <div v-else-if="activeDetailTab === 4" class="tab-content">
            <div class="interaction-summary">
              <div class="interaction-score">
                <div class="score-title">互动评分</div>
                <div class="score-value">{{ classroomInteraction.interactionScore }}</div>
                <div class="score-scale">
                  <div class="scale-bar">
                    <div class="scale-fill" :style="{ width: classroomInteraction.interactionScore + '%' }"></div>
                  </div>
                  <div class="scale-labels">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
              <div class="interaction-stats">
                <div class="stat-item">
                  <div class="stat-label">总互动次数</div>
                  <div class="stat-value">{{ classroomInteraction.totalInteractions }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">积极互动</div>
                  <div class="stat-value positive">{{ classroomInteraction.positiveInteractions }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">中性互动</div>
                  <div class="stat-value neutral">{{ classroomInteraction.neutralInteractions }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">消极互动</div>
                  <div class="stat-value negative">{{ classroomInteraction.negativeInteractions }}</div>
                </div>
              </div>
            </div>
            
            <div class="section-title">课堂行为记录</div>
            <table class="detail-table">
              <thead>
                <tr>
                  <th>课程名称</th>
                  <th>日期</th>
                  <th>互动类型</th>
                  <th>详细描述</th>
                  <th>评价</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(record, idx) in classroomInteraction.records" :key="idx">
                  <td>{{ record.courseName }}</td>
                  <td>{{ record.date }}</td>
                  <td>{{ record.type }}</td>
                  <td>{{ record.description }}</td>
                  <td>
                    <span :class="['status-tag', getInteractionStatusClass(record.evaluation)]">{{ record.evaluation }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div class="section-title">课堂注意力分析</div>
            <div class="attention-analysis">
              <div class="attention-chart" v-for="(course, idx) in classroomInteraction.behaviorTracking" :key="idx">
                <div class="chart-header">{{ course.courseName }}</div>
                <div class="radar-chart">
                  <div class="radar-axis attention" :style="{ '--value': course.attentionRate + '%' }">
                    <div class="axis-label">注意力</div>
                    <div class="axis-value">{{ course.attentionRate }}%</div>
                  </div>
                  <div class="radar-axis participation" :style="{ '--value': course.participationRate + '%' }">
                    <div class="axis-label">参与度</div>
                    <div class="axis-value">{{ course.participationRate }}%</div>
                  </div>
                  <div class="radar-axis note" :style="{ '--value': course.noteRate + '%' }">
                    <div class="axis-label">笔记</div>
                    <div class="axis-value">{{ course.noteRate }}%</div>
                  </div>
                  <div class="radar-axis distraction" :style="{ '--value': course.distractionRate + '%' }">
                    <div class="axis-label">分心</div>
                    <div class="axis-value">{{ course.distractionRate }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- GPA和学分情况选项卡内容 -->
          <div v-else-if="activeDetailTab === 5" class="tab-content">
            <div class="gpa-summary">
              <div class="gpa-chart">
                <div class="chart-title">GPA趋势</div>
                <div class="line-chart">
                  <div class="chart-line">
                    <div v-for="(semester, idx) in academicPerformance.semesterPerformance" :key="idx" 
                        class="chart-point" 
                        :style="{ '--x': (idx / (academicPerformance.semesterPerformance.length - 1)) * 100 + '%', '--y': (1 - semester.gpa / 4) * 100 + '%' }">
                      <div class="point-tooltip">
                        <div>{{ semester.semester }}</div>
                        <div>GPA: {{ semester.gpa }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="chart-axis">
                    <div class="y-axis">
                      <div>4.0</div>
                      <div>3.0</div>
                      <div>2.0</div>
                      <div>1.0</div>
                      <div>0.0</div>
                    </div>
                    <div class="x-axis">
                      <div v-for="(semester, idx) in academicPerformance.semesterPerformance" :key="idx">
                        {{ semester.semester }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="gpa-stats">
                <div class="stat-item">
                  <div class="stat-label">当前GPA</div>
                  <div class="stat-value">{{ academicPerformance.gpa }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">总学分</div>
                  <div class="stat-value">{{ academicPerformance.totalCredits }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">已获学分</div>
                  <div class="stat-value">{{ academicPerformance.earnedCredits }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">挂科学分</div>
                  <div class="stat-value negative">{{ academicPerformance.failedCredits }}</div>
                </div>
              </div>
            </div>
            
            <div class="section-title">挂科课程</div>
            <table class="detail-table">
              <thead>
                <tr>
                  <th>课程名称</th>
                  <th>学分</th>
                  <th>成绩</th>
                  <th>学期</th>
                  <th>重修状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(course, idx) in academicPerformance.failedCourses" :key="idx">
                  <td>{{ course.courseName }}</td>
                  <td>{{ course.credit }}</td>
                  <td class="negative">{{ course.score }}</td>
                  <td>{{ course.semester }}</td>
                  <td>{{ course.retakeStatus }}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="section-title">学期表现</div>
            <table class="detail-table">
              <thead>
                <tr>
                  <th>学期</th>
                  <th>GPA</th>
                  <th>学分</th>
                  <th>排名</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(semester, idx) in academicPerformance.semesterPerformance" :key="idx">
                  <td>{{ semester.semester }}</td>
                  <td>{{ semester.gpa }}</td>
                  <td>{{ semester.credits }}</td>
                  <td>{{ semester.ranking }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 课程建议选项卡内容 -->
          <div v-else-if="activeDetailTab === 6" class="tab-content">
            <div class="section-title">推荐课程</div>
            <div class="course-recommendations">
              <div class="course-card" v-for="(course, idx) in academicAdvice.courseRecommendations" :key="idx">
                <div class="course-name">{{ course.courseName }}</div>
                <div class="course-meta">
                  <span class="meta-item">学分: {{ course.credit }}</span>
                  <span class="meta-item">难度: {{ course.difficulty }}</span>
                </div>
                <div class="course-reason">{{ course.reason }}</div>
                <div class="course-career">
                  <div class="career-label">相关职业方向:</div>
                  <div class="career-value">{{ course.career }}</div>
                </div>
              </div>
            </div>
            
            <div class="section-title">学习方法建议</div>
            <div class="learning-methods">
              <div class="method-item" v-for="(method, idx) in academicAdvice.learningMethodSuggestions" :key="idx">
                <div class="method-number">{{ idx + 1 }}</div>
                <div class="method-content">{{ method }}</div>
            </div>
          </div>
          
            <div class="section-title">发展路径推荐</div>
            <div class="card-content" style="background-color: #f9f9f9; border-radius: 8px; padding: 16px;">
              <ul class="timeline">
                <li class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <h3>大三上学期</h3>
                    <p><strong>课程建议:</strong> 深入学习《机器学习》、《计算机视觉》，挑战更高难度的算法课程。</p>
                    <p><strong>实践建议:</strong> 参与"AI创新实验室"，启动一个小型个人项目，将理论付诸实践。</p>
                    <p><strong>辅修建议:</strong> 建议辅修"应用心理学"，以增强产品设计中的用户同理心。</p>
                    <p><strong>社团推荐:</strong> 加入"人工智能协会"或"开源社区"，与同好交流，参与项目实践。</p>
                    <p><strong>心理成长:</strong> 注意平衡学业与个人兴趣，保持积极心态，可参与学校心理中心的正念工作坊。</p>
                  </div>
                </li>
                <li class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <h3>大三下学期</h3>
                    <p><strong>实习建议:</strong> 寻找大型科技公司的算法或研发岗实习机会，积累行业经验。</p>
                    <p><strong>竞赛建议:</strong> 组队参加ACM或"挑战杯"等高水平竞赛，提升解决复杂问题的能力。</p>
                    <p><strong>第二学位推荐:</strong> 可考虑申请"数据科学"第二学位，构建T型知识体系，增强核心竞争力。</p>
                    <p><strong>实践基地推荐:</strong> 推荐前往学校合作的"AI未来科技园"进行项目实践，接触前沿技术。</p>
                  </div>
                </li>
                  <li class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <h3>大四</h3>
                    <p><strong>深造建议:</strong> 准备国内外顶尖院校的研究生申请，重点提升科研背景和论文质量。</p>
                    <p><strong>就业建议:</strong> 重点关注头部科技公司的"算法工程师"、"数据科学家"岗位，同步准备选调生考试，拓宽职业路径。</p>
                    <p><strong>心理成长:</strong> 积极应对毕业季的求职/升学压力，主动与导师、辅导员沟通，保持健康生活节奏。</p>
                </div>
                </li>
              </ul>
            </div>
          </div>
          
          
          <!-- 科研项目选项卡内容 -->
          <div v-else-if="activeDetailTab === 7" class="tab-content">
            <div class="section-title">当前参与项目</div>
            <div class="project-cards">
              <div class="project-card" v-for="(project, idx) in researchProjects.currentProjects" :key="idx">
                <div class="project-name">{{ project.name }}</div>
                <div class="project-meta">
                  <span class="meta-item">角色: {{ project.role }}</span>
                  <span class="meta-item">指导教师: {{ project.supervisor }}</span>
                </div>
                <div class="project-period">{{ project.startDate }} ~ {{ project.endDate }}</div>
                <div class="project-description">{{ project.description }}</div>
                <div class="project-achievements">
                  <div class="achievements-label">阶段成果:</div>
                  <div class="achievements-content">{{ project.achievements }}</div>
                </div>
              </div>
              <div class="empty-state" v-if="researchProjects.currentProjects.length === 0">
                暂无参与项目
              </div>
            </div>
            
            <div class="section-title">历史项目</div>
            <table class="detail-table">
              <thead>
                <tr>
                  <th>项目名称</th>
                  <th>角色</th>
                  <th>指导教师</th>
                  <th>时间段</th>
                  <th>成果</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(project, idx) in researchProjects.pastProjects" :key="idx">
                  <td>{{ project.name }}</td>
                  <td>{{ project.role }}</td>
                  <td>{{ project.supervisor }}</td>
                  <td>{{ project.startDate }} ~ {{ project.endDate }}</td>
                  <td>{{ project.achievements }}</td>
                </tr>
              </tbody>
              <tbody v-if="researchProjects.pastProjects.length === 0">
                <tr>
                  <td colspan="5" class="empty-state">暂无历史项目</td>
                </tr>
              </tbody>
            </table>
            
            <div class="section-title">推荐项目</div>
            <div class="recommended-projects">
              <div class="project-card" v-for="(project, idx) in researchProjects.recommendedProjects" :key="idx">
                <div class="project-name">{{ project.name }}</div>
                <div class="project-supervisor">指导教师: {{ project.supervisor }}</div>
                <div class="project-requirements">
                  <div class="requirements-label">要求:</div>
                  <div class="requirements-content">{{ project.requirements }}</div>
                </div>
                <div class="project-benefits">
                  <div class="benefits-label">收益:</div>
                  <div class="benefits-content">{{ project.benefits }}</div>
                </div>
                <div class="project-deadline">申请截止: {{ project.applicationDeadline }}</div>
              </div>
            </div>
          </div>
          
          <!-- 消费情况选项卡内容 -->
          <div v-else-if="activeDetailTab === 8" class="tab-content">
            <div class="consumption-summary">
              <div class="consumption-chart">
                <div class="chart-title">消费构成</div>
                <div class="donut-chart">
                  <div class="donut-segment food" :style="{ '--percentage': (financialStatus.expenseBreakdown.food / financialStatus.lastMonthExpense) * 100 }">
                    <span class="segment-label">餐饮</span>
                  </div>
                  <div class="donut-segment books" :style="{ '--percentage': (financialStatus.expenseBreakdown.books / financialStatus.lastMonthExpense) * 100, '--offset': (financialStatus.expenseBreakdown.food / financialStatus.lastMonthExpense) * 100 }">
                    <span class="segment-label">书籍</span>
                  </div>
                  <div class="donut-segment utilities" :style="{ '--percentage': (financialStatus.expenseBreakdown.utilities / financialStatus.lastMonthExpense) * 100, '--offset': ((financialStatus.expenseBreakdown.food + financialStatus.expenseBreakdown.books) / financialStatus.lastMonthExpense) * 100 }">
                    <span class="segment-label">水电</span>
                  </div>
                  <div class="donut-segment entertainment" :style="{ '--percentage': (financialStatus.expenseBreakdown.entertainment / financialStatus.lastMonthExpense) * 100, '--offset': ((financialStatus.expenseBreakdown.food + financialStatus.expenseBreakdown.books + financialStatus.expenseBreakdown.utilities) / financialStatus.lastMonthExpense) * 100 }">
                    <span class="segment-label">娱乐</span>
                  </div>
                  <div class="donut-segment others" :style="{ '--percentage': (financialStatus.expenseBreakdown.others / financialStatus.lastMonthExpense) * 100, '--offset': ((financialStatus.expenseBreakdown.food + financialStatus.expenseBreakdown.books + financialStatus.expenseBreakdown.utilities + financialStatus.expenseBreakdown.entertainment) / financialStatus.lastMonthExpense) * 100 }">
                    <span class="segment-label">其他</span>
                  </div>
                  <div class="donut-center">
                    <div class="center-value">{{ financialStatus.lastMonthExpense }}元</div>
                    <div class="center-label">上月消费</div>
                  </div>
                </div>
              </div>
              <div class="consumption-stats">
                <div class="stat-item">
                  <div class="stat-label">月均消费</div>
                  <div class="stat-value">{{ financialStatus.monthlyAvgExpense }}元</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">餐饮</div>
                  <div class="stat-value">{{ financialStatus.expenseBreakdown.food }}元</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">书籍学习</div>
                  <div class="stat-value">{{ financialStatus.expenseBreakdown.books }}元</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">水电网费</div>
                  <div class="stat-value">{{ financialStatus.expenseBreakdown.utilities }}元</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">娱乐</div>
                  <div class="stat-value">{{ financialStatus.expenseBreakdown.entertainment }}元</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">其他</div>
                  <div class="stat-value">{{ financialStatus.expenseBreakdown.others }}元</div>
                </div>
              </div>
            </div>
            
            <div class="section-title">消费趋势分析</div>
            <div class="consumption-trend">
              <div class="trend-chart">
                <div class="chart-bars">
                  <div class="trend-bar" v-for="(month, idx) in financialStatus.monthlyTrend" :key="idx">
                    <div class="bar-value">{{ month.amount }}元</div>
                    <div class="bar-column" :style="{ height: (month.amount / financialStatus.maxMonthlyExpense) * 100 + '%' }"></div>
                    <div class="bar-label">{{ month.month }}</div>
                  </div>
                </div>
                <div class="trend-alert" v-if="financialStatus.showAlert">
                  <div class="alert-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div class="alert-message">{{ financialStatus.alertMessage }}</div>
                </div>
              </div>
            </div>
            
            <div class="section-title">近期消费记录</div>
            <table class="detail-table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>地点</th>
                  <th>金额</th>
                  <th>类型</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(record, idx) in financialStatus.consumptionRecords" :key="idx">
                  <td>{{ record.date }}</td>
                  <td>{{ record.location }}</td>
                  <td>{{ record.amount }}元</td>
                  <td>{{ record.type }}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="section-title">经济资助情况</div>
            <div class="financial-aid" v-if="financialStatus.financialAidStatus.needsAssistance">
              <div class="aid-status">
                <div class="aid-label">当前资助:</div>
                <div class="aid-value">{{ financialStatus.financialAidStatus.currentAid }}</div>
                <div class="aid-amount">{{ financialStatus.financialAidStatus.aidAmount }}元/年</div>
              </div>
              <div class="aid-opportunities">
                <div class="opportunities-label">可申请项目:</div>
                <div class="opportunities-list">
                  <div class="opportunity-item" v-for="(opportunity, idx) in financialStatus.financialAidStatus.eligibleFor" :key="idx">
                    {{ opportunity }}
                  </div>
                </div>
              </div>
              <div class="aid-deadline">申请截止日期: {{ financialStatus.financialAidStatus.applicationDeadline }}</div>
            </div>
            <div class="no-aid-needed" v-else>
              当前经济状况良好，无需经济资助。
            </div>
          </div>
          
          <!-- 专业匹配度选项卡内容 -->
          <div v-else-if="activeDetailTab === 9" class="tab-content">
            <div class="major-match">
              <div class="match-rate">
                <div class="rate-title">专业匹配度</div>
                <div class="rate-chart">
                  <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                      :stroke-dasharray="`${careerGuidance.majorMatchRate}, 100`"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage">{{ careerGuidance.majorMatchRate }}%</text>
                  </svg>
                </div>
              </div>
              <div class="match-analysis">
                <div class="strength-analysis">
                  <div class="analysis-title">优势分析</div>
                  <ul class="analysis-list">
                    <li v-for="(strength, idx) in careerGuidance.strengthAnalysis" :key="idx">{{ strength }}</li>
                  </ul>
                </div>
                <div class="weakness-analysis">
                  <div class="analysis-title">提升空间</div>
                  <ul class="analysis-list">
                    <li v-for="(weakness, idx) in careerGuidance.weaknessAnalysis" :key="idx">{{ weakness }}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="section-title">职业匹配分析</div>
            <div class="career-matches">
              <div class="career-card" v-for="(career, idx) in careerGuidance.careerSuggestions" :key="idx">
                <div class="career-position">{{ career.position }}</div>
                <div class="match-percentage">
                  <div class="percentage-bar">
                    <div class="percentage-fill" :style="{ width: career.matchRate + '%' }"></div>
                  </div>
                  <div class="percentage-value">{{ career.matchRate }}%</div>
                </div>
                <div class="required-skills">
                  <div class="skills-label">所需技能:</div>
                  <div class="skills-tags">
                    <span class="skill-tag" v-for="(skill, i) in career.requiredSkills" :key="i">{{ skill }}</span>
                  </div>
                </div>
                <div class="gap-analysis">{{ career.gapAnalysis }}</div>
              </div>
            </div>
            
            <div class="section-title">需要提升的能力</div>
            <div class="skills-to-improve">
              <div class="skill-item" v-for="(skill, idx) in careerGuidance.skillsToImprove" :key="idx">
                <div class="skill-number">{{ idx + 1 }}</div>
                <div class="skill-content">{{ skill }}</div>
              </div>
            </div>
          </div>
          
          <!-- 就业建议选项卡内容 -->
          <div v-else-if="activeDetailTab === 10" class="tab-content">
            <div class="employment-advice">
              <div class="advice-section">
                <div class="advice-title">实习方向建议</div>
            <div class="internship-recommendations">
              <div class="internship-card" v-for="(internship, idx) in careerGuidance.internshipSuggestions" :key="idx">
                <div class="internship-company">{{ internship.company }}</div>
                <div class="internship-position">{{ internship.position }}</div>
                <div class="internship-requirements">
                  <div class="requirements-label">要求:</div>
                  <div class="requirements-content">{{ internship.requirements }}</div>
                </div>
                <div class="internship-benefits">
                  <div class="benefits-label">收益:</div>
                  <div class="benefits-content">{{ internship.benefits }}</div>
                </div>
                <div class="internship-time">申请时间: {{ internship.applicationTime }}</div>
              </div>
            </div>
          </div>
              <div class="advice-section">
                <div class="advice-title">职业规划建议</div>
                <div class="advice-content">
                  <p>{{ employmentAdvice.careerPlanning.overview }}</p>
                  <ul>
                    <li v-for="(item, idx) in employmentAdvice.careerPlanning.details" :key="idx">{{ item }}</li>
                  </ul>
                </div>
              </div>
              <div class="advice-section">
                <div class="advice-title">简历优化建议</div>
                <div class="advice-content">
                  <p>{{ employmentAdvice.resumeAdvice.overview }}</p>
                  <ul>
                    <li v-for="(item, idx) in employmentAdvice.resumeAdvice.details" :key="idx">{{ item }}</li>
                  </ul>
                </div>
              </div>
              <div class="advice-section">
                <div class="advice-title">面试准备建议</div>
                <div class="advice-content">
                  <p>{{ employmentAdvice.interviewAdvice.overview }}</p>
                  <ul>
                    <li v-for="(item, idx) in employmentAdvice.interviewAdvice.details" :key="idx">{{ item }}</li>
                  </ul>
                </div>
              </div>
              <div class="advice-section">
                <div class="advice-title">推荐就业渠道</div>
                <div class="employment-channels">
                  <div class="channel-card" v-for="(channel, idx) in employmentAdvice.recommendedChannels" :key="idx">
                    <div class="channel-name">{{ channel.name }}</div>
                    <div class="channel-description">{{ channel.description }}</div>
                    <div class="channel-link" v-if="channel.link">
                      <a :href="channel.link" target="_blank">访问链接</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 其他选项卡内容 -->
          <div v-else class="tab-content">
            <!-- 内容区域 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as echarts from 'echarts';
import 'echarts-wordcloud';

const route = useRoute()
const router = useRouter()
const activeDetailTab = ref(0)

const academicChart = ref(null);
const interestChart = ref(null);
const learningPowerChart = ref(null);
const roseChart = ref(null);
const socialChart = ref(null);
const libraryChart = ref(null);
const scheduleChart = ref(null);
const scheduleOverviewChart = ref(null);
const forumChart = ref(null);

const initProfileCharts = () => {
  if (academicChart.value) {
    const academicChartInstance = echarts.init(academicChart.value);
    academicChartInstance.setOption({
      tooltip: { trigger: 'item' },
      radar: {
        indicator: [
          { name: '数理基础', max: 100 }, { name: '编程能力', max: 100 }, { name: '逻辑思维', max: 100 },
          { name: '创新实践', max: 100 }, { name: '团队协作', max: 100 }, { name: '沟通表达', max: 100 },
        ],
        shape: 'circle', splitNumber: 5, name: { textStyle: { color: '#666' } },
      },
      series: [{
        type: 'radar',
        data: [{ value: [90, 95, 92, 88, 85, 80], name: '学业能力' }],
        areaStyle: { color: 'rgba(75, 156, 255, 0.4)' },
        itemStyle: { color: '#4b9cff' },
        lineStyle: { color: '#4b9cff' },
      }],
    });
  }

  if (interestChart.value) {
    const interestChartInstance = echarts.init(interestChart.value);
    const interestData = [
      { name: 'Python', value: 100, color: '#3a2e7a' },
      { name: '机器学习', value: 85, color: '#008061' },
      { name: '开源社区', value: 80, color: '#0b757e' },
      { name: '算法', value: 75, color: '#333333' },
      { name: '数据结构', value: 60, color: '#565a4a' },
      { name: '摇滚乐', value: 65, color: '#9c282a' },
      { name: '黑客文化', value: 55, color: '#333333' },
      { name: '科幻电影', value: 50, color: '#6e7b34' },
      { name: '哲学思辨', value: 45, color: '#666666' },
      { name: '效率工具', value: 40, color: '#888888' },
      { name: '独立游戏', value: 35, color: '#dda333' },
      { name: '篮球', value: 30, color: '#5e37a0' },
    ];

    const interestChartOption = {
      tooltip: { show: true },
      series: [{
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: [14, 35],
        rotationRange: [0, 0],
        textStyle: {
          color: function (params) {
            const item = interestData.find(d => d.name === params.data.name);
            return item ? item.color : '#ccc';
          }
        },
        data: interestData.map(item => ({name: item.name, value: item.value}))
      }]
    };
    interestChartInstance.setOption(interestChartOption);
  }

  if (learningPowerChart.value) {
    const learningPowerChartInstance = echarts.init(learningPowerChart.value);
    const learningPowerData = [
      { name: '专注力', value: 4.5, itemStyle: { color: '#5470c6', borderRadius: [5, 5, 0, 0] } },
      { name: '作息规律', value: -2.5, itemStyle: { color: '#fac858', borderRadius: [0, 0, 5, 5] } },
      { name: '学习策略', value: 1.8, itemStyle: { color: '#91cc75', borderRadius: [5, 5, 0, 0] } },
      { name: '学习动机', value: 0.5, itemStyle: { color: '#ee6666', borderRadius: [5, 5, 0, 0] } },
      { name: '学习态度', value: 3.8, itemStyle: { color: '#91cc75', borderRadius: [5, 5, 0, 0] } },
      { name: '专业能力', value: -1.2, itemStyle: { color: '#ee6666', borderRadius: [0, 0, 5, 5] } },
      { name: '通用能力', value: 1.0, itemStyle: { color: '#73c0de', borderRadius: [5, 5, 0, 0] } },
      { name: '自我认知', value: 5.0, itemStyle: { color: '#dd4b4a', borderRadius: [5, 5, 0, 0] } }
    ];

    const learningPowerOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: learningPowerData.map(item => item.name),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: '#666',
          interval: 0
        }
      }],
      yAxis: [{
        type: 'value',
        min: -5,
        max: 5,
        splitNumber: 4,
        axisLabel: {
          formatter: function (value) {
            if (value === -2.5) return -2;
            if (value === 2.5) return 2;
            return value;
          },
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            type: 'solid',
            color: '#f0f0f0'
          }
        }
      }],
      series: [{
        name: '学力评估',
        type: 'bar',
        barWidth: '20px',
        data: learningPowerData
      }]
    };
    learningPowerChartInstance.setOption(learningPowerOption);
  }

  if (roseChart.value) {
    const roseChartInstance = echarts.init(roseChart.value);
    const behaviorData = [
      { value: 40, name: '体育' },
      { value: 85, name: '读书' },
      { value: 70, name: '社团' },
      { value: 55, name: '志愿者' },
      { value: 75, name: '交友' },
      { value: 25, name: '网游' },
      { value: 60, name: '影视' },
      { value: 50, name: '文艺' },
      { value: 90, name: '消费' },
      { value: 80, name: '人际' },
      { value: 15, name: '晚归' },
      { value: 10, name: '离校' },
    ];
    const roseChartOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: { show: false },
      series: [{
        name: '校内行为',
        type: 'pie',
        radius: ['15%', '80%'],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 7
        },
        label: {
          show: true,
          color: '#333'
        },
        data: behaviorData
      }]
    };
    roseChartInstance.setOption(roseChartOption);
  }

  if (socialChart.value) {
    const socialChartInstance = echarts.init(socialChart.value);
    const socialData = [
      { name: '社团骨干', value: 95 },
      { name: '宿舍中心', value: 90 },
      { name: '技术分享', value: 80 },
      { name: '班级活动组织者', value: 75 },
      { name: '志愿者', value: 70 },
      { name: '运动达人', value: 65 },
      { name: '联谊活动', value: 60 },
      { name: '线上社区版主', value: 55 },
    ];
    socialChartInstance.setOption({
      tooltip: { show: true },
      series: [{
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: [15, 50],
        rotationRange: [0, 0],
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: () => `rgb(${[
            Math.round(Math.random() * 160 + 50),
            Math.round(Math.random() * 160 + 50),
            Math.round(Math.random() * 160 + 50)
          ].join(',')})`
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        data: socialData
      }]
    });
  }

  // 图书馆借阅图表
  if (libraryChart.value) {
    const libraryChartInstance = echarts.init(libraryChart.value);
    const libraryChartData = [
      { value: 8, name: '理工类' },
      { value: 5, name: '艺术类' },
      { value: 7, name: '经管类' },
      { value: 6, name: '文学类' },
      { value: 9, name: '电子商务类' },
      { value: 12, name: '计算机类' }
    ];
    libraryChartInstance.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'right', top: 'center' },
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => `总借阅\n47本`,
          fontSize: 18,
          fontWeight: 'bold'
        },
        data: libraryChartData,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        }
      }]
    });
  }

  // 作息情况图表
  if (scheduleChart.value) {
    const scheduleChartInstance = echarts.init(scheduleChart.value);
    scheduleChartInstance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['出', '入'], top: '5%' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '出',
          type: 'line',
          smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 77, 77, 0.5)' },
              { offset: 1, color: 'rgba(255, 77, 77, 0)' }
            ])
          }
        },
        {
          name: '入',
          type: 'line',
          smooth: true,
          data: [220, 182, 191, 234, 290, 330, 310],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(75, 156, 255, 0.5)' },
              { offset: 1, color: 'rgba(75, 156, 255, 0)' }
            ])
          },
          markLine: {
            symbol: 'none',
            data: [
              { name: '集中回宿', xAxis: '21:00', label: { formatter: '集中回宿 21:40' } },
              { name: '熄灯', xAxis: '22:00', label: { formatter: '熄灯' } }
            ],
            lineStyle: { type: 'dashed' }
          }
        }
      ]
    });
  }

  // 作息概览图表
  if (scheduleOverviewChart.value) {
    const scheduleOverviewChartInstance = echarts.init(scheduleOverviewChart.value);
    scheduleOverviewChartInstance.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [
        {
          name: '作息情况',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: scheduleData.value.avgSleepTime,
              name: '平均睡眠时间',
              itemStyle: { color: '#91cc75' }
            },
            {
              value: scheduleData.value.earlyRiseRate,
              name: '早起频率',
              itemStyle: { color: '#5470c6' }
            },
            {
              value: scheduleData.value.lateReturnCount * 10, // 放大显示效果
              name: '晚归次数',
              itemStyle: { color: '#ee6666' }
            }
          ]
        }
      ]
    });
  }

  // 校内论坛图表
  if (forumChart.value) {
    const forumChartInstance = echarts.init(forumChart.value);
    const forumChartData = [
      { value: 1048, name: '社会话题' },
      { value: 735, name: '科学技术' },
      { value: 580, name: '二次猿' },
      { value: 484, name: '两性话题' },
      { value: 300, name: '星座' },
      { value: 300, name: '国际政治' }
    ];
    forumChartInstance.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'right', top: 'center' },
      series: [{
        type: 'pie',
        radius: '50%',
        center: ['40%', '50%'],
        data: forumChartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    });
  }
};

const handleTabClick = (index) => {
  activeDetailTab.value = index;
};

watch(activeDetailTab, (newIndex) => {
  if (newIndex === 0) {
    nextTick(() => {
      initProfileCharts();
    });
  }
}, { immediate: true });

// 学生照片数组
const studentPhotos = [
  '/pic/student01.png',
  '/pic/student02.png',
  '/pic/student03.png',
  '/pic/student04.png',
  '/pic/student05.png'
]

// 随机选择一张照片
const studentPhoto = ref('')

// 学生数据
const student = ref(null)
const showStudentList = ref(false)
const studentSearch = ref('')

// 学生列表数据（模拟数据）
const studentList = ref([
  {
    studentId: '20210001',
    name: '张三',
    gender: '男',
    age: 20,
    college: '计算机学院',
    department: '计算机科学系',
    major: '计算机科学与技术',
    className: '计科2101班',
    enrollmentDate: '2021-09-01'
  },
  {
    studentId: '20210015',
    name: '李四',
    gender: '男',
    age: 21,
    college: '计算机学院',
    department: '计算机科学系',
    major: '计算机科学与技术',
    className: '计科2101班',
    enrollmentDate: '2021-09-01'
  },
  {
    studentId: '20210023',
    name: '王五',
    gender: '男',
    age: 20,
    college: '计算机学院',
    department: '计算机科学系',
    major: '计算机科学与技术',
    className: '计科2102班',
    enrollmentDate: '2021-09-01'
  },
  {
    studentId: '20210042',
    name: '赵六',
    gender: '女',
    age: 19,
    college: '计算机学院',
    department: '计算机科学系',
    major: '计算机科学与技术',
    className: '计科2102班',
    enrollmentDate: '2021-09-01'
  },
  {
    studentId: '20210056',
    name: '钱七',
    gender: '女',
    age: 20,
    college: '计算机学院',
    department: '软件工程系',
    major: '软件工程',
    className: '软工2101班',
    enrollmentDate: '2021-09-01'
  }
])

// 过滤学生列表
const filteredStudentList = computed(() => {
  if (!studentSearch.value) {
    return studentList.value
  }
  const search = studentSearch.value.toLowerCase()
  return studentList.value.filter(item => 
    item.name.toLowerCase().includes(search) || 
    item.studentId.toLowerCase().includes(search) ||
    item.className.toLowerCase().includes(search)
  )
})

// 切换学生列表显示
const toggleStudentList = () => {
  showStudentList.value = !showStudentList.value
}

// 切换到其他学生
const switchStudent = (selectedStudent) => {
  student.value = selectedStudent
  showStudentList.value = false
  // 随机选择一张新照片
  const randomIndex = Math.floor(Math.random() * studentPhotos.length)
  studentPhoto.value = studentPhotos[randomIndex]
  // 实际应用中可能需要根据选中的学生ID重新加载数据
  // 这里仅做演示，实际项目中可能需要调用API获取数据
  // router.push({ name: 'studentDetail', params: { id: selectedStudent.studentId } })
}

// 点击外部关闭下拉列表
const closeDropdown = (event) => {
  if (showStudentList.value) {
    const dropdown = document.querySelector('.student-switcher')
    if (dropdown && !dropdown.contains(event.target)) {
      showStudentList.value = false
    }
  }
}

// 考试成绩数据
const studentExams = ref([
  {
    courseName: '高等数学',
    examType: '期末考试',
    examDate: '2023-01-10',
    score: 85,
    credit: 4,
    status: '通过'
  },
  {
    courseName: '大学物理',
    examType: '期末考试',
    examDate: '2023-01-15',
    score: 78,
    credit: 3,
    status: '通过'
  },
  {
    courseName: '数据结构',
    examType: '期末考试',
    examDate: '2023-01-18',
    score: 92,
    credit: 4,
    status: '通过'
  },
  {
    courseName: '计算机网络',
    examType: '期末考试',
    examDate: '2023-06-20',
    score: 65,
    credit: 3,
    status: '通过'
  },
  {
    courseName: '操作系统',
    examType: '期末考试',
    examDate: '2023-06-25',
    score: 59,
    credit: 4,
    status: '不通过'
  }
])

// 学分汇总
const studentCreditSummary = ref({
  totalCredits: 120,
  earnedCredits: 112,
  averageScore: 82.5,
  gpa: 3.42
})

// 出勤数据
const studentAttendance = ref({
  attendanceRate: 89,
  totalClasses: 160,
  attendedClasses: 142,
  missedClasses: 12,
  leavedClasses: 6,
  records: [
    {
      courseName: '高等数学',
      date: '2023-09-05',
      time: '08:00-09:40',
      status: '出勤',
      remark: ''
    },
    {
      courseName: '大学物理',
      date: '2023-09-06',
      time: '10:00-11:40',
      status: '出勤',
      remark: ''
    },
    {
      courseName: '数据结构',
      date: '2023-09-07',
      time: '14:00-15:40',
      status: '缺勤',
      remark: '无故缺勤'
    },
    {
      courseName: '计算机网络',
      date: '2023-09-08',
      time: '16:00-17:40',
      status: '请假',
      remark: '生病请假'
    }
  ]
})

// 作业提交情况
const homeworkData = ref({
  submissionRate: 92,
  totalAssignments: 50,
  submittedAssignments: 46,
  lateSubmissions: 4,
  missedAssignments: 4,
  assignments: [
    {
      courseName: '高等数学',
      title: '微积分作业一',
      deadline: '2023-09-10',
      submitTime: '2023-09-09',
      status: '按时提交',
      score: 95,
      feedback: '计算准确，推导清晰'
    },
    {
      courseName: '数据结构',
      title: '二叉树实验',
      deadline: '2023-09-15',
      submitTime: '2023-09-14',
      status: '按时提交',
      score: 88,
      feedback: '代码实现正确，但效率可以优化'
    },
    {
      courseName: '计算机网络',
      title: 'TCP/IP协议分析',
      deadline: '2023-09-20',
      submitTime: '2023-09-22',
      status: '逾期提交',
      score: 75,
      feedback: '内容基本正确，但逾期提交'
    },
    {
      courseName: '操作系统',
      title: '进程调度算法',
      deadline: '2023-09-25',
      submitTime: '',
      status: '未提交',
      score: 0,
      feedback: '未提交作业'
    }
  ]
})

// 课堂互动数据
const classroomInteraction = ref({
  interactionScore: 76,
  totalInteractions: 68,
  positiveInteractions: 52,
  neutralInteractions: 12,
  negativeInteractions: 4,
  records: [
    {
      courseName: '高等数学',
      date: '2023-09-05',
      type: '回答问题',
      description: '主动回答了函数极限的计算问题',
      evaluation: '积极参与'
    },
    {
      courseName: '数据结构',
      date: '2023-09-07',
      type: '小组讨论',
      description: '在讨论中提出了红黑树的优化方案',
      evaluation: '表现突出'
    },
    {
      courseName: '计算机网络',
      date: '2023-09-08',
      type: '课堂表现',
      description: '上课使用手机，注意力不集中',
      evaluation: '需要改进'
    },
    {
      courseName: '操作系统',
      date: '2023-09-12',
      type: '课堂提问',
      description: '就进程调度算法提出了疑问',
      evaluation: '积极思考'
    }
  ],
  behaviorTracking: [
    {
      courseName: '高等数学',
      attentionRate: 85,
      participationRate: 70,
      noteRate: 90,
      distractionRate: 15
    },
    {
      courseName: '数据结构',
      attentionRate: 90,
      participationRate: 85,
      noteRate: 75,
      distractionRate: 10
    },
    {
      courseName: '计算机网络',
      attentionRate: 65,
      participationRate: 50,
      noteRate: 60,
      distractionRate: 35
    },
    {
      courseName: '操作系统',
      attentionRate: 75,
      participationRate: 65,
      noteRate: 80,
      distractionRate: 25
    }
  ]
})

// GPA和学分情况
const academicPerformance = ref({
  gpa: 3.42,
  totalCredits: 120,
  earnedCredits: 112,
  failedCredits: 8,
  failedCourses: [
    {
      courseName: '操作系统',
      credit: 4,
      score: 59,
      semester: '2023春季',
      retakeStatus: '已报名重修'
    },
    {
      courseName: '高级算法',
      credit: 4,
      score: 55,
      semester: '2022秋季',
      retakeStatus: '已重修通过'
    }
  ],
  semesterPerformance: [
    {
      semester: '2021秋季',
      gpa: 3.2,
      credits: 26,
      ranking: '35/120'
    },
    {
      semester: '2022春季',
      gpa: 3.5,
      credits: 28,
      ranking: '20/118'
    },
    {
      semester: '2022秋季',
      gpa: 3.1,
      credits: 30,
      ranking: '42/115'
    },
    {
      semester: '2023春季',
      gpa: 3.6,
      credits: 28,
      ranking: '15/110'
    }
  ]
})

// 课程和辅导建议
const academicAdvice = ref({
  courseRecommendations: [
    {
      courseName: '高级数据结构',
      reason: '基于您在数据结构课程的优秀表现，建议进一步深入学习',
      credit: 4,
      difficulty: '中等',
      career: '软件开发、算法工程师'
    },
    {
      courseName: '机器学习基础',
      reason: '符合您的兴趣方向，且与您的专业发展匹配',
      credit: 3,
      difficulty: '较难',
      career: '数据科学家、AI工程师'
    },
    {
      courseName: '操作系统实践',
      reason: '弥补您在操作系统理论课程的不足，加强实践能力',
      credit: 4,
      difficulty: '中等',
      career: '系统工程师、后端开发'
    }
  ],
  learningMethodSuggestions: [
    '建议采用番茄工作法提高学习专注度',
    '增加小组学习时间，提高协作能力和知识巩固',
    '建立知识图谱，加强各科目间的知识联系',
    '提前预习，带着问题听课，提高课堂效率'
  ]
})

// 科研项目
const researchProjects = ref({
  currentProjects: [
    {
      name: '基于深度学习的图像识别系统',
      role: '研究助理',
      supervisor: '王教授',
      startDate: '2023-03-01',
      endDate: '2023-12-31',
      description: '参与开发基于卷积神经网络的图像识别算法，负责数据预处理和模型评估',
      achievements: '完成了初步模型训练，识别准确率达到85%'
    }
  ],
  pastProjects: [
    {
      name: '校园智能导航APP开发',
      role: '前端开发',
      supervisor: '李教授',
      startDate: '2022-09-01',
      endDate: '2023-01-31',
      description: '负责开发基于React Native的校园导航应用前端界面',
      achievements: '成功上线，日活跃用户超过2000人'
    }
  ],
  recommendedProjects: [
    {
      name: '智能推荐系统研究',
      supervisor: '张教授',
      requirements: '熟悉机器学习算法，有Python编程经验',
      benefits: '可获得研究生推荐信，有发表论文机会',
      applicationDeadline: '2023-10-30'
    },
    {
      name: '区块链技术在教育领域的应用',
      supervisor: '刘教授',
      requirements: '了解区块链基本原理，有Web开发经验',
      benefits: '提供研究补贴，可作为毕业设计题目',
      applicationDeadline: '2023-11-15'
    }
  ]
})

// 校内消费与经济状况
const financialStatus = ref({
  monthlyAvgExpense: 1200,
  lastMonthExpense: 1350,
  maxMonthlyExpense: 1500,
  expenseBreakdown: {
    food: 650,
    books: 200,
    utilities: 150,
    entertainment: 100,
    others: 250
  },
  monthlyTrend: [
    { month: '1月', amount: 1250 },
    { month: '2月', amount: 1180 },
    { month: '3月', amount: 1320 },
    { month: '4月', amount: 1280 },
    { month: '5月', amount: 1350 },
    { month: '6月', amount: 950 }
  ],
  showAlert: true,
  alertMessage: '6月消费金额明显下降，可能需要经济帮助，建议进行关注和沟通。',
  consumptionRecords: [
    {
      date: '2023-09-01',
      location: '第一食堂',
      amount: 15,
      type: '餐饮'
    },
    {
      date: '2023-09-02',
      location: '校内超市',
      amount: 45,
      type: '日用品'
    },
    {
      date: '2023-09-03',
      location: '图书馆',
      amount: 20,
      type: '打印费'
    },
    {
      date: '2023-09-05',
      location: '第二食堂',
      amount: 18,
      type: '餐饮'
    }
  ],
  financialAidStatus: {
    needsAssistance: true,
    currentAid: '国家助学金二等',
    aidAmount: 3000,
    eligibleFor: ['勤工俭学岗位', '学费减免申请'],
    applicationDeadline: '2023-10-15'
  }
})

// 专业匹配与就业建议
const careerGuidance = ref({
  majorMatchRate: 85,
  strengthAnalysis: [
    '算法设计与分析能力强',
    '编程实现能力扎实',
    '团队协作能力良好',
    '学习新技术积极主动'
  ],
  weaknessAnalysis: [
    '理论基础需要加强',
    '项目经验相对不足',
    '沟通表达能力有待提高'
  ],
  careerSuggestions: [
    {
      position: '软件开发工程师',
      matchRate: 90,
      requiredSkills: ['Java', 'Python', '数据结构', '算法设计'],
      gapAnalysis: '建议加强系统设计能力，参与更多实际项目开发'
    },
    {
      position: '算法工程师',
      matchRate: 85,
      requiredSkills: ['机器学习', '深度学习', '数学建模', 'Python'],
      gapAnalysis: '需要加强机器学习理论基础，积累更多算法实践经验'
    },
    {
      position: '数据分析师',
      matchRate: 80,
      requiredSkills: ['SQL', '数据可视化', '统计分析', 'Python/R'],
      gapAnalysis: '建议加强统计学知识，学习数据可视化工具'
    }
  ],
  internshipSuggestions: [
    {
      company: '腾讯',
      position: '后端开发实习生',
      requirements: '熟悉Java/Go，了解微服务架构',
      benefits: '有转正机会，技术氛围好',
      applicationTime: '2023-10月开始'
    },
    {
      company: '字节跳动',
      position: '算法实习生',
      requirements: '熟悉机器学习算法，有相关项目经验',
      benefits: '实习期有导师指导，薪资有竞争力',
      applicationTime: '2023-11月开始'
    },
    {
      company: '阿里巴巴',
      position: '数据分析实习生',
      requirements: '熟悉SQL，有数据分析经验',
      benefits: '接触实际业务场景，有全职转化机会',
      applicationTime: '长期有效'
    }
  ],
  skillsToImprove: [
    '系统设计能力',
    '项目管理经验',
    '英语口语和写作',
    '机器学习和人工智能相关知识'
  ]
})

// 就业建议
const employmentAdvice = ref({
  careerPlanning: {
    overview: '根据您的专业背景和能力特点，建议您在毕业后可以考虑以下职业发展路径：',
    details: [
      '先在大型互联网公司积累2-3年工作经验，掌握规范的开发流程和团队协作方式',
      '然后可以考虑转向专业领域更深入的技术岗位，如算法专家、架构师等',
      '或者转向管理岗位，如技术主管、项目经理等',
      '也可以考虑创业或加入创业团队，发挥自己的创新能力'
    ]
  },
  resumeAdvice: {
    overview: '针对您的简历，有以下优化建议：',
    details: [
      '突出您在科研项目中的具体贡献和成果',
      '强调您的算法设计能力和实际编程能力',
      '添加您参与的开源项目或个人作品集链接',
      '简历中加入量化的成果，如"提高了系统性能30%"等'
    ]
  },
  interviewAdvice: {
    overview: '面试准备建议：',
    details: [
      '重点准备数据结构与算法相关的编程题',
      '准备系统设计相关的问题，如如何设计一个高并发系统',
      '准备一些项目经验的具体案例，包括遇到的挑战和解决方案',
      '提前了解目标公司的业务和技术栈，有针对性地准备'
    ]
  },
  recommendedChannels: [
    {
      name: '校园招聘',
      description: '利用学校提供的校园招聘资源，参加校园招聘会和宣讲会',
      link: 'https://job.university.edu/campus'
    },
    {
      name: '实习转正',
      description: '通过实习期的优秀表现，争取在实习公司直接转正',
      link: ''
    },
    {
      name: '行业招聘网站',
      description: '在专业的IT行业招聘网站上投递简历，如拉勾、Boss直聘等',
      link: 'https://www.lagou.com'
    },
    {
      name: '猎头推荐',
      description: '联系行业猎头，获取更高质量的工作机会',
      link: ''
    }
  ]
})

// 图书馆借阅数据
const libraryData = ref({
  total: 47,
  monthly: 8,
  overdue: 2,
  recentBooks: [
    {
      title: '深度学习',
      author: 'Ian Goodfellow',
      category: '计算机科学',
      borrowDate: '2024-01-15'
    },
    {
      title: '算法导论',
      author: 'Thomas H. Cormen',
      category: '计算机科学',
      borrowDate: '2024-01-10'
    },
    {
      title: '数据结构与算法分析',
      author: 'Mark Allen Weiss',
      category: '计算机科学',
      borrowDate: '2024-01-05'
    }
  ]
})

// 作息情况数据
const scheduleData = ref({
  avgSleepTime: 7.5,
  earlyRiseRate: 85,
  lateReturnCount: 3,
  analysis: [
    {
      type: 'good',
      icon: '🌅',
      title: '作息规律',
      description: '您的作息时间相对规律，建议继续保持'
    },
    {
      type: 'warning',
      icon: '⏰',
      title: '需要调整',
      description: '建议提前半小时就寝，保证充足睡眠'
    }
  ]
})

// 校内论坛数据
const forumData = ref({
  postCount: 15,
  replyCount: 89,
  likeCount: 156,
  topics: [
    { text: '9月3日会停课吗？', color: '#f56c6c' },
    { text: '张馨月参加比赛的高清视频', color: '#67c23a' },
    { text: '高新产业人工智能论坛', color: '#e6a23c' },
    { text: 'BLACK', color: '#409eff' },
    { text: '校园歌手大赛', color: '#909399' },
    { text: '小鸡炖蘑菇', color: '#303133' },
    { text: 'MBTI', color: '#b8a2e6' }
  ],
  recentPosts: [
    {
      title: '关于数据结构课程的建议',
      content: '最近在学习数据结构，感觉链表部分比较难理解...',
      date: '2024-01-20',
      replies: 12,
      likes: 25,
      views: 156
    },
    {
      title: '推荐几本算法入门书籍',
      content: '想系统学习算法，大家有什么好的推荐吗？',
      date: '2024-01-18',
      replies: 8,
      likes: 18,
      views: 89
    }
  ]
})

// 获取考试状态样式类
const getExamStatusClass = (status) => {
  switch (status) {
    case '通过':
      return 'status-normal'
    case '不通过':
      return 'status-warning'
    case '缓考':
      return 'status-observe'
    default:
      return ''
  }
}

// 获取出勤状态样式类
const getAttendanceStatusClass = (status) => {
  switch (status) {
    case '出勤':
      return 'status-normal'
    case '缺勤':
      return 'status-warning'
    case '请假':
      return 'status-observe'
    default:
      return ''
  }
}

// 获取作业状态样式类
const getHomeworkStatusClass = (status) => {
  switch (status) {
    case '按时提交':
      return 'status-normal'
    case '逾期提交':
      return 'status-observe'
    case '未提交':
      return 'status-warning'
    default:
      return ''
  }
}

// 获取互动评价样式类
const getInteractionStatusClass = (evaluation) => {
  switch (evaluation) {
    case '积极参与':
    case '表现突出':
      return 'status-normal'
    case '需要改进':
      return 'status-warning'
    case '积极思考':
      return 'status-observe'
    default:
      return ''
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 根据路由参数加载学生数据
const loadStudentData = () => {
  const studentId = route.params.id
  // 这里应该从API获取学生数据
  // 暂时使用模拟数据
  const foundStudent = studentList.value.find(s => s.studentId === studentId) || studentList.value[0]
  student.value = foundStudent
  
  // 随机选择一张照片
  const randomIndex = Math.floor(Math.random() * studentPhotos.length)
  studentPhoto.value = studentPhotos[randomIndex]
}

onMounted(() => {
  loadStudentData()
  // 添加点击外部关闭下拉列表的事件监听
  document.addEventListener('click', closeDropdown)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// 添加获取随机照片的方法
const getRandomPhoto = () => {
  const randomIndex = Math.floor(Math.random() * studentPhotos.length)
  return studentPhotos[randomIndex]
}
</script>

<style scoped>
.student-academic-detail {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background-color: #fff;
  z-index: 100;
  padding: 16px 48px;
  /*box-shadow: 0 2px 8px rgba(0,0,0,0.05);*/
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.header-content {
  display: flex;
  align-items: center;
}

h1 {
  font-size: 18px;
  font-weight: bold;
  color: #1677ff;
  margin-right: 24px;
  margin-bottom: 0;
}

.student-info {
  display: flex;
  align-items: center;
  background-color: #f0f7ff;
  padding: 8px 16px;
  border-radius: 8px;
}

.student-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #1677ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin-right: 12px;
  overflow: hidden; /* 确保圆形裁剪生效 */
}

.student-photo {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持图片比例并填充容器 */
}

.student-meta {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.student-id, .student-class {
  font-size: 12px;
  color: #666;
}

.header-actions {
  display: flex;
}

.back-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #f0f7ff;
  color: #1677ff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.back-btn svg {
  margin-right: 4px;
}

.back-btn:hover {
  background-color: #e6f4ff;
}

.content-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 2px 2px 12px rgba(0,0,0,0.08);
  padding: 24px;
  flex: 1;
  height: 0;
}

/* 选项卡样式 */
.tabs-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
  overflow-x: auto;
  background-color: #fff;
  padding-bottom: 1px;
}

.tab-item {
  padding: 12px 24px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tab-item:hover {
  color: #1677ff;
}

.tab-item.active {
  color: #1677ff;
  border-bottom-color: #1677ff;
  font-weight: 500;
}

.tabs-content {
  flex: 1;
  height: 0;
  overflow: auto;
}

.tab-content {
  animation: fadeIn 0.3s;
}

/* 详情表格样式 */
.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table th, .detail-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.detail-table th {
  background-color: #f7f8fa;
  font-weight: 500;
  color: #333;
  position: sticky;
  z-index: 40;
}

.detail-table tr:last-child td {
  border-bottom: none;
}

.detail-table tr:hover {
  background-color: #f5f7fa;
}

/* 状态标签样式 */
.status-tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-normal {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.status-warning {
  background-color: #fff1f0;
  color: #f5222d;
  border: 1px solid #ffa39e;
}

.status-observe {
  background-color: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

/* 总结区域样式 */
.summary-section {
  margin-top: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  display: flex;
}

.summary-content {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.summary-item {
  display: flex;
  align-items: center;
}

.summary-label {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 出勤统计样式 */
.attendance-summary {
  display: flex;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.attendance-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.progress-circle {
  width: 120px;
  height: 120px;
}

.circular-chart {
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3;
}

.circle {
  fill: none;
  stroke: #1677ff;
  stroke-width: 3;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
}

.percentage {
  fill: #333;
  font-size: 0.5em;
  text-anchor: middle;
  font-weight: bold;
}

.attendance-stats {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding-left: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

/* 作业提交情况样式 */
.homework-summary {
  display: flex;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.chart-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pie-chart {
  width: 150px;
  height: 150px;
  position: relative;
  border-radius: 50%;
  background-color: #eee;
}

.pie-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip-path: polygon(50% 50%, 50% 0%, calc(50% + 50% * sin(var(--offset, 0) * 3.6deg)) calc(50% - 50% * cos(var(--offset, 0) * 3.6deg)), calc(50% + 50% * sin((var(--offset, 0) + var(--percentage, 0)) * 3.6deg)) calc(50% - 50% * cos((var(--offset, 0) + var(--percentage, 0)) * 3.6deg)));
  background-color: var(--color, #1677ff);
}

.pie-label {
  position: absolute;
  font-size: 12px;
  white-space: nowrap;
  transform: translate(-50%, -50%);
  color: #333;
  font-weight: 500;
}

.homework-stats {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding-left: 24px;
}

/* 课堂互动样式 */
.interaction-summary {
  display: flex;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.interaction-score {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.score-value {
  font-size: 36px;
  font-weight: 700;
  color: #1677ff;
  margin-bottom: 16px;
}

.score-scale {
  width: 100%;
  max-width: 200px;
}

.scale-bar {
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.scale-fill {
  height: 100%;
  background-color: #1677ff;
  border-radius: 4px;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}

.interaction-stats {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding-left: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 16px;
  color: #333;
  display: flex;
}

.attention-analysis {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.attention-chart {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.chart-header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  text-align: center;
}

.radar-chart {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.radar-axis {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(var(--value, 0) * 1px);
  height: 4px;
  transform-origin: left center;
  background-color: #1677ff;
}

.radar-axis.attention {
  transform: translateY(-50%) rotate(0deg);
}

.radar-axis.participation {
  transform: translateY(-50%) rotate(90deg);
}

.radar-axis.note {
  transform: translateY(-50%) rotate(180deg);
}

.radar-axis.distraction {
  transform: translateY(-50%) rotate(270deg);
}

.axis-label {
  position: absolute;
  top: -20px;
  right: -40px;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

.axis-value {
  position: absolute;
  top: -20px;
  right: 5px;
  font-size: 12px;
  font-weight: 500;
  color: #1677ff;
}

/* GPA和学分情况样式 */
.gpa-summary {
  display: flex;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.gpa-chart {
  flex: 2;
}

.line-chart {
  position: relative;
  height: 200px;
  margin-top: 20px;
}

.chart-line {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-point {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #1677ff;
  transform: translate(-50%, -50%);
  top: var(--y);
  left: var(--x);
  cursor: pointer;
}

.point-tooltip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  white-space: nowrap;
  display: none;
}

.chart-point:hover .point-tooltip {
  display: block;
}

.chart-axis {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.y-axis {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.x-axis {
  position: absolute;
  bottom: -30px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.gpa-stats {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding-left: 24px;
}

.negative {
  color: #ff4d4f;
}

.positive {
  color: #52c41a;
}

.neutral {
  color: #1677ff;
}

/* 课程建议样式 */
.course-recommendations {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.course-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #1677ff;
}

.course-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.course-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  font-size: 14px;
  color: #666;
}

.course-reason {
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.5;
  display: flex;
}

.course-career {
  font-size: 14px;
}

.career-label {
  color: #666;
  margin-bottom: 4px;
  display: flex;
}

.career-value {
  color: #333;
  font-weight: 500;
  display: flex;
}

.learning-methods {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.method-item {
  display: flex;
  align-items: flex-start;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.method-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #1677ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.method-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

/* 科研项目样式 */
.project-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.project-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: flex;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 8px;
}

.project-period {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  display: flex;
}

.project-description {
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.5;
}

.project-achievements, .project-requirements, .project-benefits {
  font-size: 14px;
  margin-bottom: 8px;
}

.achievements-label, .requirements-label, .benefits-label {
  color: #666;
  margin-bottom: 4px;
  display: flex;
}

.achievements-content, .requirements-content, .benefits-content {
  color: #333;
  line-height: 1.5;
  display: flex;
}

.project-supervisor {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  display: flex;
}

.project-deadline {
  font-size: 14px;
  color: #ff4d4f;
  margin-top: 12px;
  display: flex;
}

.recommended-projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* 消费情况样式 */
.consumption-summary {
  display: flex;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.consumption-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.donut-chart {
  width: 200px;
  height: 200px;
  position: relative;
  border-radius: 50%;
  background-color: #eee;
}

.donut-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip-path: polygon(50% 50%, 50% 0%, calc(50% + 50% * sin(var(--offset, 0) * 3.6deg)) calc(50% - 50% * cos(var(--offset, 0) * 3.6deg)), calc(50% + 50% * sin((var(--offset, 0) + var(--percentage, 0)) * 3.6deg)) calc(50% - 50% * cos((var(--offset, 0) + var(--percentage, 0)) * 3.6deg)));
}

.donut-segment.food {
  background-color: #1677ff;
}

.donut-segment.books {
  background-color: #52c41a;
}

.donut-segment.utilities {
  background-color: #fa8c16;
}

.donut-segment.entertainment {
  background-color: #722ed1;
}

.donut-segment.others {
  background-color: #f5222d;
}

.segment-label {
  position: absolute;
  font-size: 12px;
  white-space: nowrap;
  transform: translate(-50%, -50%);
  color: #333;
  font-weight: 500;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.center-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.center-label {
  font-size: 12px;
  color: #666;
}

.consumption-stats {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-left: 24px;
}

.consumption-trend {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.trend-chart {
  position: relative;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
}

.trend-bar {
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar-value {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.bar-column {
  width: 100%;
  background-color: #1677ff;
  border-radius: 4px 4px 0 0;
}

.bar-label {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.trend-alert {
  margin-top: 16px;
  padding: 12px;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.alert-icon {
  color: #ff4d4f;
  margin-right: 8px;
}

.alert-message {
  color: #333;
  font-size: 14px;
}

.financial-aid {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.aid-status {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.aid-label {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}

.aid-value {
  font-size: 16px;
  font-weight: 600;
  color: #1677ff;
  margin-right: 16px;
}

.aid-amount {
  font-size: 16px;
  color: #52c41a;
  font-weight: 500;
}

.aid-opportunities {
  margin-bottom: 16px;
}

.opportunities-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
}

.opportunities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.opportunity-item {
  padding: 4px 8px;
  background-color: #f0f5ff;
  color: #1677ff;
  border-radius: 4px;
  font-size: 12px;
}

.aid-deadline {
  font-size: 14px;
  color: #ff4d4f;
  display: flex;
}

.no-aid-needed {
  padding: 16px;
  background-color: #f6ffed;
  color: #52c41a;
  border-radius: 8px;
  text-align: center;
}

/* 专业匹配度样式 */
.major-match {
  display: flex;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.match-rate {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rate-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.rate-chart {
  width: 150px;
  height: 150px;
}

.match-analysis {
  flex: 2;
  display: flex;
  gap: 20px;
  padding-left: 24px;
}

.strength-analysis, .weakness-analysis {
  flex: 1;
}

.analysis-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.analysis-list {
  padding-left: 20px;
  margin: 0;
}

.analysis-list li {
  margin-bottom: 8px;
  color: #333;
}

.career-matches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.career-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.career-position {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.match-percentage {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.percentage-bar {
  flex: 1;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 8px;
}

.percentage-fill {
  height: 100%;
  background-color: #1677ff;
  border-radius: 4px;
}

.percentage-value {
  font-size: 14px;
  font-weight: 600;
  color: #1677ff;
  width: 40px;
}

.required-skills {
  margin-bottom: 12px;
}

.skills-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 4px 8px;
  background-color: #f0f5ff;
  color: #1677ff;
  border-radius: 4px;
  font-size: 12px;
}

.gap-analysis {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.skills-to-improve {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.skill-item {
  display: flex;
  align-items: flex-start;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.skill-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #1677ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.skill-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

/* 实习方向建议样式 */
.internship-recommendations {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.internship-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #1677ff;
}

.internship-company {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
  display: flex;
}

.internship-position {
  display: flex;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.internship-requirements, .internship-benefits {
  font-size: 14px;
  margin-bottom: 8px;
}

.internship-time {
  font-size: 14px;
  color: #ff4d4f;
  margin-top: 12px;
  display: flex;
}

/* 就业建议样式 */
.employment-advice {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.advice-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.advice-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  display: flex;
}

.advice-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.advice-content p {
  margin-bottom: 12px;
  padding-left: 20px;
  display: flex;
}

.advice-content ul {
  padding-left: 20px;
  margin-bottom: 0;
}

.advice-content li {
  margin-bottom: 8px;
  display: flex;
}

.employment-channels {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.channel-card {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
}

.channel-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.channel-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

.channel-link a {
  color: #1677ff;
  text-decoration: none;
}

.channel-link a:hover {
  text-decoration: underline;
}

.empty-state {
  padding: 16px;
  text-align: center;
  color: #999;
  font-style: italic;
}

/* 占位内容样式 */
.placeholder-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  font-size: 16px;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

/* 响应式样式 */
@media (max-width: 768px) {
  .student-academic-detail {
    padding-top: 140px;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    top: 60px; /* 移动端导航栏高度可能更小 */
  }
  
  .header-content {
    margin-bottom: 16px;
  }
  
  .detail-table th {
    top: 160px; /* 调整为移动端header + tabs的高度 */
  }
}

/* 学生切换器样式 */
.student-switcher {
  position: relative;
  margin-left: 16px;
}

.switcher-btn {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #1677ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.switcher-btn svg {
  margin-right: 4px;
}

.switcher-btn:hover {
  background-color: #4096ff;
}

.student-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  margin-top: 8px;
  z-index: 1000;
  overflow: hidden;
  animation: fadeIn 0.2s;
}

.dropdown-header {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
}

.dropdown-search {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.dropdown-search input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.dropdown-search input:focus {
  outline: none;
  border-color: #1677ff;
}

.dropdown-list {
  max-height: 320px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
}

.dropdown-item.active {
  background-color: #e6f7ff;
}

.item-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #1677ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  margin-right: 12px;
  overflow: hidden; /* 确保圆形裁剪生效 */
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.item-id {
  font-size: 12px;
  color: #666;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .student-info {
    flex-wrap: wrap;
  }
  
  .student-switcher {
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
  }
  
  .switcher-btn {
    width: 100%;
    justify-content: center;
  }
  
  .student-dropdown {
    width: 100%;
    left: 0;
    right: auto;
  }
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}
.profile-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}
.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
.large-card {
  grid-column: span 2;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}
.card-content {
  color: #333;
}
.radar-chart {
  width: 100%;
  height: 220px;
}
.academic-stats {
  margin-top: 16px;
  display: flex;
  justify-content: space-around;
}
.stat-item {
  text-align: center;
}
.stat-item span {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 4px;
}
.stat-item strong {
  font-size: 18px;
  color: #333;
}
.mbti-tag {
  background-color: #4b9cff;
  color: white;
  font-size: 24px;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 12px;
}
.mbti-tag.enfj {
  background-color: #52c41a; /* ENFJ 代表色，绿色 */
}
.mbti-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}
.trait-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.trait {
  background-color: #f0f5ff;
  color: #4b9cff;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
}
.behavior-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.behavior-list li {
  margin-bottom: 12px;
  font-size: 14px;
}
.behavior-label {
  font-weight: 500;
  color: #555;
  margin-right: 8px;
}
.word-cloud-chart {
  width: 100%;
  height: 250px;
}
.bar-chart {
  width: 100%;
  height: 250px;
}
.text-success { color: #52c41a; }
.text-primary { color: #4b9cff; }
.economic-summary {
  font-size: 15px;
  line-height: 2;
}
.timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e0e0e0;
}
.timeline-item {
  position: relative;
  padding-left: 30px;
  margin-bottom: 24px;
}
.timeline-marker {
  position: absolute;
  left: 0;
  top: 5px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #4b9cff;
  border: 2px solid #fff;
}
.timeline-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  display: flex;
}
.timeline-content p {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px;
  line-height: 1.6;
  display: flex;
}
.feedback-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.feedback-table th, .feedback-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.feedback-table th {
  background-color: #f7f8fa;
  font-weight: 500;
}
.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.status-tag.completed { background-color: #e6fff0; color: #52c41a; }
.status-tag.in-progress { background-color: #e6f4ff; color: #1677ff; }

@media (max-width: 1200px) {
  .large-card {
    grid-column: span 1;
  }
}

.personality-content {
  /* No longer a flex container, elements will stack vertically */
}

.personality-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.personality-text {
  flex: 1;
}

.personality-image {
  width: 100px;
  height: auto;
  flex-shrink: 0;
}

.personality-image img {
  width: 100%;
  height: auto;
  display: block;
}

.mbti-tag.enfj {
  background-color: #4CAF50; /* A green shade for ENFJ */
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 24px;
  display: inline-block;
}

.mbti-desc {
  margin-bottom: 16px;
  line-height: 1.7;
  color: #555;
  text-align: justify;
}

.trait-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trait {
  background-color: #f0f5ff;
  color: #4b9cff;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
}

.rose-chart {
  width: 100%;
  height: 280px;
}

/* 新增模块样式 */
.library-chart,
.schedule-chart,
.forum-chart {
  width: 100%;
  height: 280px;
}

.library-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.library-stat-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}

.library-stat-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.library-stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.schedule-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.schedule-stat-item {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}

.schedule-stat-number {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.schedule-stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.forum-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.forum-stat-item {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}

.forum-stat-number {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.forum-stat-label {
  font-size: 12px;
  opacity: 0.9;
}

/* 作息概览样式 */
.schedule-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.overview-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.overview-label {
  font-size: 12px;
  opacity: 0.9;
}

.schedule-overview-chart {
  width: 100%;
  height: 300px;
  margin-top: 20px;
}
</style> 