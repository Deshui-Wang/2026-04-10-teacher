  <template>
    <div class="student-academic-detail">
      <div class="tabs-container">
        <div class="tabs-header">
          <div 
            v-for="(tab, idx) in ['学生画像', '考试成绩', '出勤情况', '作业提交', '课堂互动', '学分情况', '课程建议', '科研项目', '消费情况', '专业匹配', '实习方向', '就业建议']" 
            :key="idx"
            :class="['tab-item', { active: activeDetailTab === idx }]"
            @click="handleTabClick(idx)"
          >
            {{ tab }}
          </div>
        </div>
        <div class="tabs-content">
          <!-- 课程建议选项卡内容 -->
          <div v-if="activeDetailTab === 6" class="tab-content">
            <div class="section-title">课程建议</div>
            <div class="course-suggestions">
              <div class="suggestion-card" v-for="(suggestion, idx) in academicAdvice.courseSuggestions" :key="idx">
                <div class="suggestion-type">{{ suggestion.type }}</div>
                <div class="suggestion-course">{{ suggestion.course }}</div>
                <div class="suggestion-reason">{{ suggestion.reason }}</div>
              </div>
            </div>

            <div class="section-title">辅导建议</div>
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
                <div class="project-title">{{ project.title }}</div>
                <div class="project-description">{{ project.description }}</div>
                <div class="project-duration">{{ project.duration }}</div>
              </div>
            </div>
          </div>

          <!-- 消费情况选项卡内容 -->
          <div v-else-if="activeDetailTab === 8" class="tab-content">
            <div class="consumption-summary">
              <div class="consumption-chart">
                <div class="chart-title">消费构成</div>
                <!-- Chart component goes here -->
              </div>
            </div>
          </div>

          <!-- 专业匹配度选项卡内容 -->
          <div v-else-if="activeDetailTab === 9" class="tab-content">
            <div class="major-match">
              <div class="match-rate">
                <div class="rate-title">专业匹配度</div>
                <!-- Match rate component goes here -->
              </div>
            </div>
          </div>

          <!-- 实习方向建议选项卡内容 -->
          <div v-else-if="activeDetailTab === 10" class="tab-content">
            <div class="internship-recommendations">
              <div class="internship-card" v-for="(internship, idx) in careerGuidance.internshipSuggestions" :key="idx">
                <div class="internship-company">{{ internship.company }}</div>
                <div class="internship-position">{{ internship.position }}</div>
                <div class="internship-duration">{{ internship.duration }}</div>
              </div>
            </div>
          </div>

          <!-- 就业建议选项卡内容 -->
          <div v-else-if="activeDetailTab === 11" class="tab-content">
            <div class="employment-advice">
              <div class="advice-section">
                <div class="advice-title">职业规划建议</div>
                <div class="advice-content">{{ careerGuidance.careerPlanningAdvice }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        activeDetailTab: 0,
        academicAdvice: {
          courseSuggestions: [],
          tutorialSuggestions: []
        },
        researchProjects: {
          currentProjects: []
        },
        careerGuidance: {
          internshipSuggestions: [],
          careerPlanningAdvice: ''
        }
      };
    },
    methods: {
      handleTabClick(idx) {
        this.activeDetailTab = idx;
      }
    }
  };
  </script>

  <style scoped>
  /* Add your styles here */
  </style>