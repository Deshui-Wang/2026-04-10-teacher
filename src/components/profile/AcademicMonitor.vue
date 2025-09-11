<template>
  <div class="academic-monitor">
    <div class="page-title">
      <div class="title-section">
        <h1>学生学业检测中心</h1>
          <div class="selector-header">
            <div class="current-student" @click="openClassSelector">
              <div class="no-student">
                <div class="add-icon">+</div>
                <span>选择班级</span>
              </div>
              <div class="arrow-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            <div class="current-student" @click="openStudentSelector">
              <div class="no-student">
                <div class="add-icon">+</div>
                <span>选择学员</span>
              </div>
              <div class="arrow-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
      </div>
    </div>
    
    <div class="dashboard">
      <!-- 统计指标卡片 -->
      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-icon warning">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 19h20L12 2z"></path>
              <path d="M12 16v-5"></path>
              <path d="M12 19v.01"></path>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">23</div>
            <div class="stat-label">学业预警学生</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20V10"></path>
              <path d="M18 14l-6-6-6 6"></path>
              <path d="M4 4h16"></path>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">3.42</div>
            <div class="stat-label">平均GPA</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">89%</div>
            <div class="stat-label">平均出勤率</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon info">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
              <path d="M16 13H8"></path>
              <path d="M16 17H8"></path>
              <path d="M10 9H8"></path>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">92%</div>
            <div class="stat-label">作业提交率</div>
          </div>
        </div>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 成绩趋势分析 -->
        <div class="content-section">
          <h2 class="section-title">成绩趋势分析</h2>
          <div ref="gradeTrendChart" class="chart-container"></div>
        </div>
        
        <!-- 行为数据监测 -->
        <div class="content-section">
          <h2 class="section-title">行为数据监测</h2>
          <div class="behavior-metrics">
            <div class="metric-card">
              <h3 class="metric-title">出勤率</h3>
              <div class="progress-container">
                <div class="progress-bar" style="width: 89%"></div>
                <div class="progress-label">89%</div>
              </div>
              <div class="metric-detail">
                <div class="detail-item">
                  <span class="detail-label">已出勤</span>
                  <span class="detail-value">356</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">缺勤</span>
                  <span class="detail-value">44</span>
                </div>
              </div>
            </div>
            
            <div class="metric-card">
              <h3 class="metric-title">作业提交情况</h3>
              <div class="progress-container">
                <div class="progress-bar" style="width: 92%"></div>
                <div class="progress-label">92%</div>
              </div>
              <div class="metric-detail">
                <div class="detail-item">
                  <span class="detail-label">已提交</span>
                  <span class="detail-value">138</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">未提交</span>
                  <span class="detail-value">12</span>
                </div>
              </div>
            </div>
            
            <div class="metric-card">
              <h3 class="metric-title">课堂互动</h3>
              <div class="progress-container">
                <div class="progress-bar" style="width: 76%"></div>
                <div class="progress-label">76%</div>
              </div>
              <div class="metric-detail">
                <div class="detail-item">
                  <span class="detail-label">参与次数</span>
                  <span class="detail-value">68</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">平均水平</span>
                  <span class="detail-value">42</span>
                </div>
              </div>
            </div>

            <div class="metric-card">
              <h3 class="metric-title">实习就业</h3>
              <div class="progress-container">
                <div class="progress-bar" style="width: 86.7%"></div>
                <div class="progress-label">86.7%</div>
              </div>
              <div class="metric-detail">
                <div class="detail-item">
                  <span class="detail-label">实习占比</span>
                  <span class="detail-value">68.98%</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">就业占比</span>
                  <span class="detail-value">82.37%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <!-- 智能预警机制 -->
        <div class="content-section">
          <h2 class="section-title">智能预警机制</h2>
          <div class="warning-list">
            <div class="warning-header">
              <div class="col">学号</div>
              <div class="col">姓名</div>
              <div class="col">预警类型</div>
              <div class="col">预警等级</div>
              <div class="col">预警原因</div>
              <div class="col">操作</div>
            </div>
            
            <div class="warning-item">
              <div class="col">20210001</div>
              <div class="col">张三</div>
              <div class="col">成绩预警</div>
              <div class="col"><span class="tag danger">高风险</span></div>
              <div class="col">连续两门专业课不及格</div>
              <div class="col">
                <button @click="lookView" class="btn-view">查看详情</button>
              </div>
            </div>
            
            <div class="warning-item">
              <div class="col">20210015</div>
              <div class="col">李四</div>
              <div class="col">出勤预警</div>
              <div class="col"><span class="tag warning">中风险</span></div>
              <div class="col">两周内多次缺勤</div>
              <div class="col">
                <button @click="lookView"  class="btn-view">查看详情</button>
              </div>
            </div>
            
            <div class="warning-item">
              <div class="col">20210042</div>
              <div class="col">王五</div>
              <div class="col">综合预警</div>
              <div class="col"><span class="tag warning">中风险</span></div>
              <div class="col">作业提交率低，课堂参与度下降</div>
              <div class="col">
                <button @click="lookView"  class="btn-view">查看详情</button>
              </div>
            </div>
            
            <div class="warning-item">
              <div class="col">20210078</div>
              <div class="col">赵六</div>
              <div class="col">成绩预警</div>
              <div class="col"><span class="tag info">低风险</span></div>
              <div class="col">期中考试成绩下滑</div>
              <div class="col">
                <button @click="lookView"  class="btn-view">查看详情</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 个性化学业建议 -->
        <div class="content-section">
          <h2 class="section-title">个性化教学建议</h2>
          <div class="advice-cards">
            <div class="advice-card">
              <div class="advice-header">
                <h3>课程建议</h3>
                <span class="advice-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </span>
              </div>
              <div class="advice-content">
                <p>根据毕业生专业方向，建议选修以下课程：</p>
                <ul>
                  <li>高级数据结构（提升算法能力）</li>
                  <li>机器学习基础（扩展AI知识）</li>
                  <li>软件工程实践（增强项目经验）</li>
                </ul>
              </div>
            </div>
            
            <div class="advice-card">
              <div class="advice-header">
                <h3>教学方法建议</h3>
                <span class="advice-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </span>
              </div>
              <div class="advice-content">
                <p>基于毕业生整体学习数据分析，我们建议：</p>
                <ul>
                  <li>增加小组学习时间，提高协作能力</li>
                  <li>采用番茄工作法提高专注度</li>
                  <li>利用周末时间进行知识点复习和整合</li>
                </ul>
              </div>
            </div>

            <div class="advice-card">
              <div class="advice-header">
                <h3>实习指导建议</h3>
                <span class="advice-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </span>
              </div>
              <div class="advice-content">
                <p>根据毕业生实习就业数据分析，我们建议：</p>
                <ul>
                  <li>增强实训练习，提高团队合作意识</li>
                  <li>校企合作项目，提高就业竞争力</li>
                  <li>鼓励毕业生适当兼职</li>
                </ul>
              </div>
            </div>
            
            <div class="advice-card">
              <div class="advice-header">
                <h3> 就业辅导合作</h3>
                <span class="advice-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
              </div>
              <div class="advice-content">
                <p>根据已就业学生反馈增加校企合作辅导资源：</p>
                <ul>
                  <li>高薪企业进校实训辅导</li>
                  <li>仿真项目组队参与企业直接选人</li>
                  <li>企业真实项目真实选人</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 学生选择弹窗 -->
  <div class="modal-overlay" v-if="showStudentModal" @click="closeStudentModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>选择学员</h3>
        <button class="close-btn" @click="closeStudentModal">×</button>
      </div>
      <div class="modal-body">
        <div class="search-box">
          <input 
            type="text" 
            v-model="studentSearchKeyword" 
            placeholder="搜索学号、姓名..." 
          />
          <button class="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        
        <div class="student-list">
          <div class="student-list-header">
            <div class="col">学号</div>
            <div class="col">姓名</div>
            <div class="col">学院</div>
            <div class="col">专业</div>
          </div>
          <div class="student-list-body">
            <div 
              v-for="(student, index) in filteredStudents" 
              :key="index"
              class="student-list-item"
              @click="selectStudent(student)"
            >
              <div class="col">{{ student.studentId }}</div>
              <div class="col">{{ student.name }}</div>
              <div class="col">{{ student.college }}</div>
              <div class="col">{{ student.major }}</div>
            </div>
            <div v-if="filteredStudents.length === 0" class="no-data">
              没有找到匹配的学生
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 班级选择弹窗 -->
  <div class="modal-overlay" v-if="showClassModal" @click="closeClassModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>选择班级</h3>
        <button class="close-btn" @click="closeClassModal">×</button>
      </div>
      <div class="modal-body">
        <div class="search-box">
          <input 
            type="text" 
            v-model="classSearchKeyword" 
            placeholder="搜索班级编号、名称、学院、专业..." 
          />
          <button class="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        
        <div class="student-list">
          <div class="student-list-header">
            <div class="col">班级编号</div>
            <div class="col">班级名称</div>
            <div class="col">学院</div>
            <div class="col">专业</div>
          </div>
          <div class="student-list-body">
            <div 
              v-for="(clazz, index) in filteredClasses" 
              :key="index"
              class="student-list-item"
              @click="selectClass(clazz)"
            >
              <div class="col">{{ clazz.classId }}</div>
              <div class="col">{{ clazz.className }}</div>
              <div class="col">{{ clazz.college }}</div>
              <div class="col">{{ clazz.major }}</div>
            </div>
            <div v-if="filteredClasses.length === 0" class="no-data">
              没有找到匹配的班级
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 学生详细学业检测信息 -->
  <div class="student-detail-modal" v-if="selectedStudent && showStudentDetail">
    <div class="modal-content modal-lg" @click.stop>
      <div class="modal-header">
        <h3>{{ selectedStudent.name }} 的学业检测详情</h3>
        <button class="close-btn" @click="closeStudentDetail">×</button>
      </div>
      <div class="modal-body">
        <div class="tabs-container">
          <div class="tabs-header">
            <div 
              v-for="(tab, idx) in ['考试成绩', '出勤情况', '作业提交', '课堂互动', '学分情况', '课程建议', '辅导建议', '消费情况', '专业匹配', '就业建议']" 
              :key="idx"
              :class="['tab-item', { active: activeDetailTab === idx }]"
              @click="activeDetailTab = idx"
            >
              {{ tab }}
            </div>
          </div>
          <div class="tabs-content">
            <!-- 考试成绩选项卡内容 -->
            <div v-if="activeDetailTab === 0" class="tab-content">
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
            <div v-else-if="activeDetailTab === 1" class="tab-content">
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
            <div v-else-if="activeDetailTab === 2" class="tab-content">
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
            
            <!-- 课堂互动行为记录选项卡内容 -->
            <div v-else-if="activeDetailTab === 3" class="tab-content">
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
            <div v-else-if="activeDetailTab === 4" class="tab-content">
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
            <div v-else-if="activeDetailTab === 5" class="tab-content">
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
            </div>
            
            <!-- 辅导建议选项卡内容 -->
            <div v-else-if="activeDetailTab === 6" class="tab-content">
              <div class="tutorial-recommendations">
                <div class="tutorial-card" v-for="(tutorial, idx) in academicAdvice.tutorialSuggestions" :key="idx">
                  <div class="tutorial-type">{{ tutorial.type }}</div>
                  <div class="tutorial-subject">{{ tutorial.subject }}</div>
                  <div class="tutorial-reason">{{ tutorial.reason }}</div>
                  <div class="tutorial-info">
                    <div class="info-item">
                      <div class="info-label">时间安排:</div>
                      <div class="info-value">{{ tutorial.schedule }}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">辅导老师:</div>
                      <div class="info-value">{{ tutorial.tutor }}</div>
                    </div>
                  </div>
                </div>
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
            
            <!-- 校内消费情况选项卡内容 -->
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
            
            <!-- 实习方向建议选项卡内容 -->
            <div v-else-if="activeDetailTab === 10" class="tab-content">
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
            
            <!-- 就业建议选项卡内容 -->
            <div v-else class="tab-content">
              <div class="placeholder-content">
                该功能正在开发中，敬请期待...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { localeContextKey } from 'element-plus'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts';

// 初始化图表
const gradeTrendChart = ref(null);

const initGradeTrendChart = () => {
  if (gradeTrendChart.value) {
    const chartInstance = echarts.init(gradeTrendChart.value);
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(22, 22, 22, 0.8)',
        borderColor: '#555',
        borderWidth: 1,
        textStyle: {
          color: '#fff'
        },
        formatter: function (params) {
          let res = params[0].name + '<br/>';
          params.forEach(item => {
            res += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>${item.seriesName}: ${item.value}<br/>`;
          });
          return res;
        }
      },
      legend: {
        data: ['班级平均GPA', '院系平均GPA', '挂科率'],
        textStyle: {
          color: '#888'
        },
        top: 'top',
        right: '10px'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['第一学期', '第二学期', '第三学期', '第四学期'],
        axisLine: {
          lineStyle: {
            color: '#444'
          }
        },
        axisLabel: {
          color: '#888'
        }
      },
      yAxis: [{
        type: 'value',
        name: 'GPA',
        min: 0,
        max: 4,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#444'
          }
        },
        axisLabel: {
          formatter: '{value}',
          color: '#888'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#333'
          }
        }
      }, {
        type: 'value',
        name: '挂科率 (%)',
        min: 0,
        max: 20,
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#444'
          }
        },
        axisLabel: {
          formatter: '{value}%',
          color: '#888'
        },
        splitLine: { show: false }
      }],
      series: [
        {
          name: '班级平均GPA',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          showSymbol: true,
          lineStyle: {
            width: 2,
            color: '#1677ff'
          },
          itemStyle: {
            color: '#1677ff',
            borderColor: '#fff',
            borderWidth: 1
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(22, 119, 255, 0.6)'
            }, {
              offset: 1,
              color: 'rgba(22, 119, 255, 0)'
            }])
          },
          data: [2.8, 3.1, 3.3, 3.5]
        },
        {
          name: '院系平均GPA',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          showSymbol: true,
          lineStyle: {
            width: 2,
            color: '#52c41a'
          },
          itemStyle: {
            color: '#52c41a',
            borderColor: '#fff',
            borderWidth: 1
          },
           areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(82, 196, 26, 0.5)'
            }, {
              offset: 1,
              color: 'rgba(82, 196, 26, 0)'
            }])
          },
          data: [3.2, 3.4, 3.5, 3.6]
        },
        {
          name: '挂科率',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          showSymbol: true,
          lineStyle: {
            width: 2,
            color: '#fa8c16'
          },
          itemStyle: {
            color: '#fa8c16',
            borderColor: '#fff',
            borderWidth: 1
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(250, 140, 22, 0.4)'
            }, {
              offset: 1,
              color: 'rgba(250, 140, 22, 0)'
            }])
          },
          data: [15, 12, 10, 8]
        }
      ]
    };
    chartInstance.setOption(option);
  }
};

// 初始化路由器
const router = useRouter()

// 学生选择相关
const showStudentModal = ref(false)
const studentSearchKeyword = ref('')
const selectedStudent = ref(null)
const activeDetailTab = ref(0)

// 班级选择相关
const showClassModal = ref(false)
const classSearchKeyword = ref('')
const selectedClass = ref(null)

// 学生数据
const students = ref([
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
    department: '软件工程系',
    major: '软件工程',
    className: '软工2101班',
    enrollmentDate: '2021-09-01'
  },
  {
    studentId: '20210042',
    name: '王五',
    gender: '男',
    age: 20,
    college: '信息学院',
    department: '通信工程系',
    major: '通信工程',
    className: '通信2102班',
    enrollmentDate: '2021-09-01'
  },
  {
    studentId: '20210078',
    name: '赵六',
    gender: '女',
    age: 19,
    college: '经济管理学院',
    department: '工商管理系',
    major: '工商管理',
    className: '工管2103班',
    enrollmentDate: '2021-09-01'
  },
  {
    studentId: '20210103',
    name: '钱七',
    gender: '女',
    age: 20,
    college: '人文学院',
    department: '外语系',
    major: '英语',
    className: '英语2101班',
    enrollmentDate: '2021-09-01'
  }
])

// 班级数据
const classes = ref([
  { classId: 'JC2101', className: '计科2101班', college: '计算机学院', major: '计算机科学与技术', year: 2021 },
  { classId: 'SE2101', className: '软工2101班', college: '计算机学院', major: '软件工程', year: 2021 },
  { classId: 'TX2102', className: '通信2102班', college: '信息学院', major: '通信工程', year: 2021 },
  { classId: 'GM2103', className: '工管2103班', college: '经济管理学院', major: '工商管理', year: 2021 },
  { classId: 'EN2101', className: '英语2101班', college: '人文学院', major: '英语', year: 2021 }
])

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

//智能预警机制
const lookView = () => {
  router.push('/student-academic/${student.studentId}')
}

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
  tutorialSuggestions: [
    {
      type: '一对一辅导',
      subject: '操作系统',
      reason: '针对上学期挂科情况，加强理论理解和实践能力',
      schedule: '每周二晚上18:00-20:00',
      tutor: '李教授'
    },
    {
      type: '小组学习',
      subject: '算法设计与分析',
      reason: '通过团队协作提高解决复杂问题的能力',
      schedule: '每周四下午15:00-17:00',
      tutor: '张助教'
    },
    {
      type: '在线课程',
      subject: '计算机网络',
      reason: '弥补课堂上注意力不集中导致的知识缺口',
      schedule: '自主安排',
      tutor: 'Coursera平台'
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
  expenseBreakdown: {
    food: 650,
    books: 200,
    utilities: 150,
    entertainment: 100,
    others: 250
  },
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

// 根据搜索关键词过滤学生
const filteredStudents = computed(() => {
  if (!studentSearchKeyword.value) {
    return students.value
  }
  
  const keyword = studentSearchKeyword.value.toLowerCase()
  return students.value.filter(student => 
    student.studentId.toLowerCase().includes(keyword) || 
    student.name.toLowerCase().includes(keyword) ||
    student.college.toLowerCase().includes(keyword) ||
    student.major.toLowerCase().includes(keyword)
  )
})

// 根据搜索关键词过滤班级
const filteredClasses = computed(() => {
  if (!classSearchKeyword.value) {
    return classes.value
  }
  const keyword = classSearchKeyword.value.toLowerCase()
  return classes.value.filter(clazz =>
    clazz.classId.toLowerCase().includes(keyword) ||
    clazz.className.toLowerCase().includes(keyword) ||
    clazz.college.toLowerCase().includes(keyword) ||
    clazz.major.toLowerCase().includes(keyword)
  )
})

// 打开学生选择器
const openStudentSelector = () => {
  showStudentModal.value = true
}

// 打开班级选择器
const openClassSelector = () => {
  showClassModal.value = true
}

// 关闭学生选择器
const closeStudentModal = () => {
  showStudentModal.value = false
  studentSearchKeyword.value = ''
}

// 关闭班级选择器
const closeClassModal = () => {
  showClassModal.value = false
  classSearchKeyword.value = ''
}

// 选择学生
const selectStudent = (student) => {
  // 导航到学生详情页面
  router.push(`/student-academic/${student.studentId}`)
  showStudentModal.value = false
  studentSearchKeyword.value = ''
}

// 选择班级（占位实现：仅记录选择并关闭弹窗，可根据需要改为路由或筛选）
const selectClass = (clazz) => {
  selectedClass.value = clazz
  showClassModal.value = false
  classSearchKeyword.value = ''
}

// 关闭学生详情 - 现在使用独立页面，此方法不再使用
const closeStudentDetail = () => {
  // 不再需要
}

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

onMounted(() => {
  console.log('学业检测中心页面已加载');
  initGradeTrendChart();
})
</script>

<style scoped>
.academic-monitor {
  width: 100%;
  max-width: 1440px;
  padding: 30px;
  margin: 0 auto;
  box-sizing: border-box;
}

.page-title {
  padding: 2px 8px;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.page-title h1 {
  font-size: 28px;
  font-weight: bold;
  color: #4b9cff;
  margin: 0;
}
.page-title p{
  font-size: 16px;
  color: #7a7a7a;
  padding-bottom: 24px;
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 学生选择区域样式 */
.overview-mode{
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.overview-mode svg{
  color: #8b5cf6;
}


/* 统计卡片样式 */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

.stat-icon.primary {
  background-color: #e6f4ff;
  color: #1677ff;
}

.stat-icon.success {
  background-color: #e6fff0;
  color: #52c41a;
}

.stat-icon.warning {
  background-color: #fff7e6;
  color: #fa8c16;
}

.stat-icon.info {
  background-color: #e6fffb;
  color: #13c2c2;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 主要内容区域样式 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.content-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2c3e50;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

/* 图表样式 */
.chart-container {
  width: 100%;
  height: 350px; /* 增加高度以容纳更复杂的图表 */
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 16px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
}

.color-dot.primary {
  background-color: #1677ff;
}

.color-dot.success {
  background-color: #52c41a;
}

.color-dot.warning {
  background-color: #fa8c16;
}

/* 模拟图表 */
.mock-chart {
  display: flex;
  height: calc(100% - 40px);
  position: relative;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  flex: 1;
  height: 100%;
  padding-bottom: 30px;
}

.chart-period {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
}

.period-label {
  position: absolute;
  bottom: 0;
  font-size: 12px;
  color: #666;
}

.bar-group {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  gap: 4px;
}

.bar {
  width: 20px;
  border-radius: 4px 4px 0 0;
}

.bar.primary {
  background-color: #1677ff;
}

.bar.success {
  background-color: #52c41a;
}

.bar.warning {
  background-color: #fa8c16;
}

.chart-axis {
  position: absolute;
  left: 0;
  top: 0;
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.y-axis {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.y-label {
  font-size: 12px;
  color: #999;
  transform: translateY(50%);
}

/* 行为数据监测样式 */
.behavior-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.metric-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.metric-title {
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 16px;
}

.progress-container {
  height: 24px;
  background-color: #e9ecef;
  border-radius: 4px;
  margin-bottom: 16px;
  position: relative;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  background-color: #1677ff;
}

.progress-label {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.metric-detail {
  display: flex;
  justify-content: space-between;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 12px;
  color: #666;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
}

/* 预警列表样式 */
.warning-list {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.warning-header, .warning-item {
  display: grid;
  grid-template-columns: 0.8fr 0.8fr 1fr 0.8fr 2fr 0.8fr;
  align-items: center;
  padding: 12px 16px;
}

.warning-header {
  background-color: #f5f5f5;
  font-weight: 600;
  font-size: 14px;
}

.warning-item {
  border-top: 1px solid #eee;
}

.warning-item:hover {
  background-color: #f9f9f9;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.tag.danger {
  background-color: #fff1f0;
  color: #f5222d;
}

.tag.warning {
  background-color: #fff7e6;
  color: #fa8c16;
}

.tag.info {
  background-color: #e6f7ff;
  color: #1677ff;
}

.btn-view {
  padding: 4px 12px;
  background-color: #1677ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-view:hover {
  background-color: #0958d9;
}

/* 个性化建议样式 */
.advice-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.advice-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.advice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.advice-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.advice-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1677ff;
}

.advice-icon svg {
  width: 20px;
  height: 20px;
}

.advice-content p {
  margin-top: 0;
  margin-bottom: 12px;
  color: #666;
}

.advice-content ul {
  margin: 0;
  padding-left: 20px;
}

.advice-content li {
  margin-bottom: 8px;
  color: #333;
}

/* 学生选择器样式 */
.student-selector {
  background: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.current-student {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.student-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #1677ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  margin-right: 12px;
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.student-meta {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.no-student {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 14px;
}

.add-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px dashed #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 6px;
  color: #fff;
}

.arrow-icon {
  margin-left: 8px;
  color: #fff;
}

/* 学生选择弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-content.modal-lg {
  max-width: 900px;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f8fa;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(90vh - 60px);
}

.search-box {
  display: flex;
  margin-bottom: 16px;
}

.search-box input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  outline: none;
}

.search-box input:focus {
  border-color: #1677ff;
}

.search-btn {
  background: #1677ff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 学生列表样式 */
.student-list {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.student-list-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  background-color: #f5f5f5;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
}

.student-list-body {
  max-height: 400px;
  overflow-y: auto;
}

.student-list-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 12px 16px;
  border-top: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;
}

.student-list-item:hover {
  background-color: #f0f7ff;
}

.student-list-item .col {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-data {
  padding: 40px;
  text-align: center;
  color: #999;
}

/* 学生详情弹窗样式 */
.student-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 选项卡样式 */
.tabs-container {
  margin-top: 16px;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
  overflow-x: auto;
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
  min-height: 200px;
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

/* 占位内容样式 */
.placeholder-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  font-size: 16px;
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
}

.course-career {
  font-size: 14px;
}

.career-label {
  color: #666;
  margin-bottom: 4px;
}

.career-value {
  color: #333;
  font-weight: 500;
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

/* 辅导建议样式 */
.tutorial-recommendations {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.tutorial-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #52c41a;
}

.tutorial-type {
  display: inline-block;
  padding: 4px 8px;
  background-color: #e6f7ff;
  color: #1677ff;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
}

.tutorial-subject {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.tutorial-reason {
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.5;
}

.tutorial-info {
  font-size: 14px;
}

.info-item {
  margin-bottom: 8px;
}

.info-label {
  color: #666;
  margin-bottom: 4px;
}

.info-value {
  color: #333;
  font-weight: 500;
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
}

.achievements-content, .requirements-content, .benefits-content {
  color: #333;
  line-height: 1.5;
}

.project-supervisor {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.project-deadline {
  font-size: 14px;
  color: #ff4d4f;
  margin-top: 12px;
}

.recommended-projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* 校内消费情况样式 */
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
}

.internship-position {
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

@media (max-width: 768px) {
  .academic-monitor {
    padding: 92px 16px 16px;
  }
  
  .warning-header, .warning-item {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .warning-header .col, .warning-item .col {
    padding: 4px 0;
  }
  
  .student-list-header, .student-list-item {
    grid-template-columns: 1fr 1fr;
  }
  
  .attendance-summary {
    flex-direction: column;
  }
  
  .attendance-stats {
    padding-left: 0;
    margin-top: 24px;
  }
  
  .tabs-header {
    overflow-x: auto;
  }
}
</style> 