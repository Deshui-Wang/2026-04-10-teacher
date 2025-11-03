<template>
  <div class="report-component">
    <!-- 报告头部 -->
    <div class="report-header">
      <div class="header-content">
        <h1 class="report-title">AI智能分析报告</h1>
        <div class="report-meta">
        </div>
        <button class="suggestions-btn" @click="scrollToSuggestions">
          查看建议
        </button>
      </div>
    </div>

    <div class="report-layout">
      <!-- 左侧时间菜单 -->
      <div class="report-sidebar">
        <div class="sidebar-header">
          <h3>报告列表</h3>
        </div>
        <div class="report-timeline">
          <div 
            class="timeline-item" 
            :class="{ active: selectedReport === index, 'generating': report.status === 'generating', 'completed': report.status === 'completed' }"
            v-for="(report, index) in reportHistory" 
            :key="index"
            @click="selectReport(index)"
          >
            <div class="timeline-header">
              <div class="timeline-date">{{ report.date }}</div>
              <span class="generating-badge" v-if="report.status === 'generating'">正在生成中</span>
              <span class="completed-badge" v-if="report.status === 'completed'">生成完成</span>
            </div>
            <div class="timeline-title">{{ report.title }}</div>
            <div class="timeline-type">{{ report.type }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧报告内容 -->
      <div class="report-main">
        <div class="report-body" v-if="!isLoading">
          <!-- 教师基本信息 -->
          <div class="report-section">
            <h2 class="section-title">一、教师基本信息</h2>
            <div class="info-table">
              <div class="info-row">
                <div class="info-label">姓名</div>
                <div class="info-value">{{ teacherInfo.name }}</div>
                <div class="info-label">性别</div>
                <div class="info-value">{{ teacherInfo.gender }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">年龄</div>
                <div class="info-value">{{ teacherInfo.age }}岁</div>
                <div class="info-label">学历</div>
                <div class="info-value">{{ teacherInfo.education }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">职称</div>
                <div class="info-value">{{ teacherInfo.title }}</div>
                <div class="info-label">教龄</div>
                <div class="info-value">{{ teacherInfo.experience }}年</div>
              </div>
            </div>
          </div>

          <!-- 综合评价 -->
          <div class="report-section">
            <h2 class="section-title">二、综合评价</h2>
            <div class="content-text typing-text" :ref="el => evaluationTextRef = el"></div>
          </div>

          <!-- 详细分析 -->
          <div class="report-section">
            <h2 class="section-title">三、详细分析</h2>
            <div class="analysis-content">
              <div class="analysis-item" v-for="(item, index) in analysisItems" :key="index">
                <h3 class="analysis-title">{{ index + 1 }}. {{ item.title }}</h3>
                <div class="analysis-text typing-text" :ref="el => analysisTextRefs[index] = el"></div>
              </div>
            </div>
          </div>

          <!-- 总结与建议 -->
          <div class="report-section" ref="suggestionsSection">
            <h2 class="section-title">四、总结与建议</h2>
            <div class="summary-content">
              <div class="summary-item">
                <h3 class="summary-title">总结</h3>
                <div class="summary-text typing-text" :ref="el => summaryTextRef = el"></div>
              </div>
              <div class="summary-item">
                <h3 class="summary-title">发展建议</h3>
                <div class="suggestions-text typing-text" :ref="el => suggestionsTextRef = el"></div>
                
                <!-- 建议详情展开区域 -->
                <div class="suggestions-details" v-if="showSuggestionsDetails">
                  <!-- 建议1：优化班级管理 -->
                  <div class="suggestion-item">
                    <div class="suggestion-header">
                      <h4 class="suggestion-title">1. 优化班级管理</h4>
                      <button class="toggle-btn" @click="toggleSuggestion(0)">
                        {{ expandedSuggestions[0] ? '收起' : '展开' }}
                      </button>
                    </div>
                    <div class="suggestion-content" v-show="expandedSuggestions[0]">
                      <div class="learning-resources">
                        <h5 class="resources-title">学习资料：</h5>
                        <div class="resources-list">
                          <div class="resource-item" v-for="resource in suggestionResources[0].learning" :key="resource.id">
                            <div class="resource-icon">📚</div>
                            <div class="resource-info">
                              <div class="resource-name">{{ resource.name }}</div>
                              <div class="resource-desc">{{ resource.description }}</div>
                            </div>
                            <button class="resource-btn" @click="openResource(resource)">查看</button>
                          </div>
                        </div>
                      </div>
                      <div class="assist-tools">
                        <h5 class="tools-title">辅助工具：</h5>
                        <div class="tools-list">
                          <div class="tool-item" v-for="tool in suggestionResources[0].tools" :key="tool.id">
                            <div class="tool-icon">🛠️</div>
                            <div class="tool-info">
                              <div class="tool-name">{{ tool.name }}</div>
                              <div class="tool-desc">{{ tool.description }}</div>
                            </div>
                            <button class="tool-btn" @click="openTool(tool)">使用</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 建议2：拓展专业视野 -->
                  <div class="suggestion-item">
                    <div class="suggestion-header">
                      <h4 class="suggestion-title">2. 拓展专业视野</h4>
                      <button class="toggle-btn" @click="toggleSuggestion(1)">
                        {{ expandedSuggestions[1] ? '收起' : '展开' }}
                      </button>
                    </div>
                    <div class="suggestion-content" v-show="expandedSuggestions[1]">
                      <div class="learning-resources">
                        <h5 class="resources-title">学习资料：</h5>
                        <div class="resources-list">
                          <div class="resource-item" v-for="resource in suggestionResources[1].learning" :key="resource.id">
                            <div class="resource-icon">📚</div>
                            <div class="resource-info">
                              <div class="resource-name">{{ resource.name }}</div>
                              <div class="resource-desc">{{ resource.description }}</div>
                            </div>
                            <button class="resource-btn" @click="openResource(resource)">查看</button>
                          </div>
                        </div>
                      </div>
                      <div class="assist-tools">
                        <h5 class="tools-title">辅助工具：</h5>
                        <div class="tools-list">
                          <div class="tool-item" v-for="tool in suggestionResources[1].tools" :key="tool.id">
                            <div class="tool-icon">🛠️</div>
                            <div class="tool-info">
                              <div class="tool-name">{{ tool.name }}</div>
                              <div class="tool-desc">{{ tool.description }}</div>
                            </div>
                            <button class="tool-btn" @click="openTool(tool)">使用</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 建议3：推动技术创新 -->
                  <div class="suggestion-item">
                    <div class="suggestion-header">
                      <h4 class="suggestion-title">3. 推动技术创新</h4>
                      <button class="toggle-btn" @click="toggleSuggestion(2)">
                        {{ expandedSuggestions[2] ? '收起' : '展开' }}
                      </button>
                    </div>
                    <div class="suggestion-content" v-show="expandedSuggestions[2]">
                      <div class="learning-resources">
                        <h5 class="resources-title">学习资料：</h5>
                        <div class="resources-list">
                          <div class="resource-item" v-for="resource in suggestionResources[2].learning" :key="resource.id">
                            <div class="resource-icon">📚</div>
                            <div class="resource-info">
                              <div class="resource-name">{{ resource.name }}</div>
                              <div class="resource-desc">{{ resource.description }}</div>
                            </div>
                            <button class="resource-btn" @click="openResource(resource)">查看</button>
                          </div>
                        </div>
                      </div>
                      <div class="assist-tools">
                        <h5 class="tools-title">辅助工具：</h5>
                        <div class="tools-list">
                          <div class="tool-item" v-for="tool in suggestionResources[2].tools" :key="tool.id">
                            <div class="tool-icon">🛠️</div>
                            <div class="tool-info">
                              <div class="tool-name">{{ tool.name }}</div>
                              <div class="tool-desc">{{ tool.description }}</div>
                            </div>
                            <button class="tool-btn" @click="openTool(tool)">使用</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 生成ToDo任务链按钮 -->
                  <div class="todo-section">
                    <button class="todo-btn" @click="generateTodoChain">
                      <span class="todo-icon">📋</span>
                      生成目标任务链
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div class="report-loading" v-if="isLoading">
          <div class="loading-content">
            <div class="loading-icon">📊</div>
            <h3>报告生成中...</h3>
            <p>AI正在分析数据，生成个性化报告</p>
            <div class="loading-dots">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// 教师基本信息
const teacherInfo = ref({
  name: '张婉婷',
  gender: '女',
  age: 38,
  education: '硕士学位',
  title: '副教授',
  experience: 16
})

// 加载状态
const isLoading = ref(true)
const selectedReport = ref(0)

// 格式化当前日期
const formatDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

// 报告日期
const reportDate = ref(formatDate())

// 创建ref来存储文本元素的引用
const evaluationTextRef = ref(null)
const analysisTextRefs = ref([])
const summaryTextRef = ref(null)
const suggestionsTextRef = ref(null)
const suggestionsSection = ref(null)

// 建议详情展开状态
const showSuggestionsDetails = ref(false)
const expandedSuggestions = ref([false, false, false])

// 建议资源数据
const suggestionResources = ref([
  {
    learning: [
      {
        id: 1,
        name: '《班级管理艺术》',
        description: '系统介绍班级管理的方法和技巧',
        url: '#'
      },
      {
        id: 2,
        name: '《学生心理辅导指南》',
        description: '了解学生心理，提升沟通效果',
        url: '#'
      }
    ],
    tools: [
      {
        id: 1,
        name: '班级管理系统',
        description: '数字化班级管理工具',
        url: '#'
      },
      {
        id: 2,
        name: '学生档案管理',
        description: '学生信息跟踪和分析',
        url: '#'
      }
    ]
  },
  {
    learning: [
      {
        id: 3,
        name: '《教育前沿技术》',
        description: '了解最新教育技术发展趋势',
        url: '#'
      },
      {
        id: 4,
        name: '《产学研合作实践》',
        description: '校企合作模式与案例分析',
        url: '#'
      }
    ],
    tools: [
      {
        id: 3,
        name: '学术会议平台',
        description: '参与学术交流的在线平台',
        url: '#'
      },
      {
        id: 4,
        name: '企业合作对接',
        description: '校企合作项目对接工具',
        url: '#'
      }
    ]
  },
  {
    learning: [
      {
        id: 5,
        name: '《AI教育应用实践》',
        description: '人工智能在教育中的创新应用',
        url: '#'
      },
      {
        id: 6,
        name: '《教学工具开发指南》',
        description: '从使用者到创造者的转变',
        url: '#'
      }
    ],
    tools: [
      {
        id: 5,
        name: 'AI工具开发平台',
        description: '低代码AI工具开发环境',
        url: '#'
      },
      {
        id: 6,
        name: '知识分享平台',
        description: '教师经验分享和传播平台',
        url: '#'
      }
    ]
  }
])

// 报告内容数据映射
const reportContents = {
  0: {
    evaluation: '张老师作为一位拥有16年丰富教学经验的骨干教师，专业能力强，实践经验丰富，态度认真，在教学和教研工作中表现出良好的职业素养。其工作认真负责，踏实肯干，在课程建设方面投入较多，在团队中贡献突出，作用明显。同时，在个人发展方面还有提升空间，具备一定的发展潜力。',
    analysis: [
      {
        title: '教学能力与效果',
        content: '张老师承担了繁重的教学任务，本学期共承担了4门核心课程的教学工作，总计周课时16节，负责6个班级共180名学生的教学工作。日常投入度很高，展现了高度的责任心。在其指导下，所带班级学生学业成绩稳定，通过率达到89%，这反映了其教学的基础扎实，能够保证学生掌握和理解知识。\n\n具体教学工作量统计：\n• 主修课程：《数据结构与算法》- 4个班级，120名学生\n• 主修课程：《软件工程》- 2个班级，60名学生\n• 周课时安排：周一至周五，平均每天3.2课时\n• 学生指导：承担15名本科生的毕业设计指导工作\n• 教学评价：学生满意度评分4.2/5.0，同行评价优秀'
      },
      {
        title: '教学注重因材施教',
        content: '值得注意的是，分析中反映出班级内存在学业困难及学习态度欠佳的学生群体。建议张老师在后续教学中，进一步加强对这部分学生的个别关注和沟通，探索学习动机的成因，采取更有针对性的辅导策略，以实现全体学生的共同进步，进一步提升教学效果的全面性。'
      },
      {
        title: '专业发展与学习能力',
        content: '张老师具备扎实的专业理论基础，为适应人工智能技术的快速发展，持续进行实践性学习。例如，积极参与高水平学术会议、投入前沿技术研究项目，进行教学方法的实践探索。这将有助于接触新的行业动态和实际应用，拓展教师视野。'
      },
      {
        title: '技术应用与研究创新',
        content: '张老师在日常工作中积极运用各类AI功能工具，体现了在专业高度上的良好示范作用。本学期AI工具使用情况统计：\n\nAI工具使用情况：\n• 智能批改系统：累计批改作业1,200份，效率提升60%\n• 个性化学习推荐：为180名学生生成个性化学习路径\n• 智能答疑助手：处理学生问题450次，准确率92%\n• 课程内容生成：使用AI辅助生成教学案例15个\n\nAI工具开发成果：\n• 自主研发"智能编程评测系统"，已申请软件著作权\n• 开发"学生行为分析工具"，帮助识别学习困难学生\n• 参与校级AI教学平台建设，贡献核心算法模块\n\nAI应用分享情况：\n• 校内培训：组织AI工具使用培训3次，覆盖教师45人次\n• 学术交流：在"智能教育技术研讨会"做主题报告\n• 经验分享：撰写AI教学应用案例2篇，被同行引用\n\n学生AI工具使用情况：\n• 学生使用AI辅助编程工具：使用率85%，代码质量提升明显\n• 智能学习助手：学生平均每周使用12次，学习效率提升30%\n• AI作业辅导：学生满意度4.5/5.0，问题解决及时率95%'
      },
      {
        title: '课程研发与团队贡献',
        content: '张老师积极参与课程研发工作，表现突出，在团队中成功率高，效率高，对专业和课程建设做出了积极贡献。其研发能力是宝贵资源，应充分认可和发挥。'
      }
    ],
    summary: '张老师是一位教学经验丰富、认真负责的可靠教师，是教育团队中的中坚力量。',
    suggestions: '1. 优化班级管理：建立更有效的机制，关注和帮助困难学生，促进班级整体学业水平提升。\n\n2. 拓展专业视野：加强与高校、企业的实践合作，了解行业知识，提升教学。\n\n3. 推动技术创新：从工具使用者向"创造者"和"引领者"转变，增强个人技术实践成果的分享。\n\n希望张老师在未来的工作中，继续发挥优势，在专业深度和教学创新上不断探索，取得更多成就。'
  },
  1: {
    evaluation: '本学期的教学工作取得了显著成效，张老师在课程教学质量、学生指导、教学改革等方面表现突出。通过系统的教学实践和持续的自我提升，教学质量稳步提升，学生满意度进一步提高，教学成果丰硕。',
    analysis: [
      {
        title: '课程教学成果',
        content: '本学期共承担3门专业核心课程，总课时240学时，涵盖5个班级共150名学生。通过采用案例教学、项目驱动等多种教学方法，学生的学习积极性和实践能力得到显著提升。期末考试成绩优秀率达到75%，较上学期提升8个百分点。'
      },
      {
        title: '教学方法创新',
        content: '积极探索线上线下混合教学模式，建立课程学习平台，上传教学视频48个，总时长约600分钟。通过在线答疑、作业批改等功能，及时回应学生需求，提升了教学效率和互动性。学生在线学习活跃度达到95%以上。'
      },
      {
        title: '学生指导工作',
        content: '认真履行导师职责，指导12名本科生的毕业设计工作，其中3篇论文被评为优秀毕业论文。积极参与学生竞赛指导，指导的2支团队在省级竞赛中获得一等奖，展现了良好的指导能力。'
      },
      {
        title: '教学研究与改革',
        content: '参与校级教学改革项目2项，发表教学研究论文1篇。主持编写教材章节3章，为专业建设贡献力量。在教学方法、课程内容、评价体系等方面进行了有益的探索和实践。'
      }
    ],
    summary: '本学期教学工作圆满完成，教学质量和效果显著提升，为学生的成长和发展提供了有力支撑。',
    suggestions: '1. 继续深化教学改革，探索更多创新的教学方法。\n\n2. 加强与其他高校的交流合作，学习先进教学经验。\n\n3. 进一步提升科研能力，将研究成果更好地应用于教学实践。\n\n希望在新的学期里，继续发扬优良传统，取得更大成就。'
  },
  2: {
    evaluation: '张老师在专业发展方面展现出强烈的学习意愿和持续提升能力。通过参与培训、学术交流、实践项目等多种途径，不断拓展专业视野，提升专业素养，在学科前沿知识掌握、实践应用能力等方面都有显著进步。',
    analysis: [
      {
        title: '专业知识更新',
        content: '积极参与专业培训和学术会议，本年度参加高水平学术会议3次，包括"人工智能教育应用研讨会"、"计算机科学前沿论坛"等。通过学习前沿理论和技术，不断更新知识结构，跟上学科发展步伐。'
      },
      {
        title: '实践能力提升',
        content: '参与校企合作项目2项，与企业合作开发教学软件平台，积累了丰富的实践经验。通过实践项目的锻炼，提升了解决实际问题的能力，增强了理论联系实际的能力。'
      },
      {
        title: '技术应用探索',
        content: '积极探索新技术在教学中的应用，尝试使用VR/AR技术进行教学，开展了3次虚拟实验教学试点。通过技术手段的创新应用，提升了教学的趣味性和互动性，获得了学生的好评。'
      },
      {
        title: '专业发展规划',
        content: '制定了清晰的个人专业发展规划，明确了未来3-5年的发展目标和路径。计划进一步提升科研能力，申报更高层次的科研项目，在专业领域取得更大突破。'
      }
    ],
    summary: '专业发展能力不断提升，学习意愿强烈，发展方向明确，具备良好的发展潜力。',
    suggestions: '1. 加强理论研究，提升学术水平，争取在核心期刊发表更多高质量论文。\n\n2. 深化产学研合作，加强与企业的联系，获取更多实践机会。\n\n3. 建立专业学习社群，与同行交流学习，共同提升专业能力。\n\n相信通过持续的努力，一定能在专业发展上取得更大突破。'
  },
  3: {
    evaluation: '在课程建设方面，张老师表现出色，积极参与课程体系的优化和完善工作。通过课程内容更新、教学资源建设、评价体系改革等多方面工作，显著提升了课程质量和教学效果，为专业建设做出了重要贡献。',
    analysis: [
      {
        title: '课程内容建设',
        content: '负责2门核心课程的建设和优化，完成课程大纲修订，更新教学内容30%以上，引入前沿案例和项目实践。建立了完整的教学资源库，包括课件、视频、案例、习题等，为学生提供了丰富的学习资源。'
      },
      {
        title: '教学资源开发',
        content: '自主开发教学资源包，包括在线课程、实验指导书、项目案例集等。其中在线课程累计访问量超过5000人次，获得了广泛好评。制作教学视频36个，总时长超过800分钟，为学生自主学习提供了便利。'
      },
      {
        title: '评价体系改革',
        content: '探索多元化评价方式，建立了过程性评价与终结性评价相结合的评价体系。引入项目评价、同伴评价、自我评价等多种方式，更加全面客观地评价学生的学习效果，激发了学生的学习积极性。'
      },
      {
        title: '课程建设成效',
        content: '所负责的课程被评为校级精品课程，课程满意度达到4.5/5.0。课程建设成果获得学校教学成果奖二等奖，为专业的整体提升做出了贡献。'
      }
    ],
    summary: '课程建设成效显著，为提升专业教学质量和人才培养质量发挥了重要作用。',
    suggestions: '1. 继续完善课程资源，建立更加丰富的教学资源库。\n\n2. 加强与行业企业的联系，使课程内容更贴近实际需求。\n\n3. 探索课程建设的新模式，推动课程建设向更高层次发展。\n\n期待在课程建设上继续取得新突破。'
  },
  4: {
    evaluation: '本年度教学工作圆满完成，各项教学指标均达到预期目标。在教学任务完成、教学质量提升、学生培养、教学改革等方面都取得了显著成效。教学态度认真负责，教学方法不断创新，教学效果持续改善，获得了学生和同事的一致好评。',
    analysis: [
      {
        title: '年度教学工作回顾',
        content: '本年度共承担6门课程的教学工作，总课时480学时，覆盖8个班级共240名学生。教学质量稳步提升，学生成绩优秀率达到72%，较去年提升5个百分点。学生满意度评分4.3/5.0，处于较高水平。'
      },
      {
        title: '教学改革成果',
        content: '持续推进教学改革，开展了混合式教学、项目式教学等多种教学模式探索。建立了在线教学平台，积累了丰富的教学资源。参与教学改革项目3项，发表教学研究论文2篇，教学改革成果获得认可。'
      },
      {
        title: '学生培养成效',
        content: '认真履行育人职责，指导学生参加各类竞赛，获得省级奖项3项，校级奖项8项。指导本科生毕业设计20人，其中5人获得优秀毕业论文。所指导的学生在就业和升学方面表现良好，就业率达到95%。'
      },
      {
        title: '专业建设贡献',
        content: '积极参与专业建设工作，参与人才培养方案修订、课程体系建设、实践基地建设等工作。为专业的整体发展和提升贡献了力量，是专业建设的中坚力量。'
      }
    ],
    summary: '年度教学工作成果丰硕，教学质量和效果显著提升，为学校的教学事业发展做出了贡献。',
    suggestions: '1. 继续深化教学改革，探索更多创新的教学方法和模式。\n\n2. 加强教学研究，提升教学理论水平和实践能力。\n\n3. 关注学生全面发展，进一步提升育人质量和效果。\n\n期待在新的一年里，继续努力，取得更大成就。'
  },
  5: {
    evaluation: '根据学生满意度调研结果，张老师的教学工作得到了学生的广泛认可和好评。在教学态度、教学内容、教学方法、师生互动等方面，学生满意度均处于较高水平。这表明张老师的教学工作有效，能够满足学生的学习需求，促进了学生的成长和发展。',
    analysis: [
      {
        title: '总体满意度情况',
        content: '本次调研共收集有效问卷180份，总体满意度评分4.4/5.0，处于优秀水平。其中，教学态度满意度4.6/5.0，教学内容满意度4.3/5.0，教学方法满意度4.5/5.0，师生互动满意度4.4/5.0。各项指标均达到较高水平。'
      },
      {
        title: '学生评价亮点',
        content: '学生普遍认为张老师教学认真负责，备课充分，讲解清晰，能够深入浅出地解释复杂概念。课堂氛围活跃，互动充分，能够激发学生的学习兴趣。作业批改及时，反馈详细，有助于学生改进。'
      },
      {
        title: '学生意见建议',
        content: '学生提出了许多有价值的建议，主要包括：希望增加更多的实践案例、希望提供更多的学习资源、希望加强课后辅导、希望增加互动环节等。这些建议为改进教学工作提供了方向。'
      },
      {
        title: '改进方向',
        content: '根据学生反馈，将在以下方面进行改进：增加实践教学比重，提供更多学习资源，加强课后答疑和辅导，优化课堂互动设计。通过持续改进，进一步提升教学质量和学生满意度。'
      }
    ],
    summary: '学生满意度调研结果表明，教学工作得到了学生的高度认可，教学效果良好。',
    suggestions: '1. 继续关注学生反馈，及时调整和改进教学方法。\n\n2. 增加实践教学环节，提供更多学习资源和指导。\n\n3. 加强师生互动，建立更加融洽的师生关系。\n\n相信通过持续改进，一定能进一步提升教学质量和学生满意度。'
  }
}

// 历史报告数据
const reportHistory = ref([
  {
    date: formatDate(),
    title: '教学能力综合评估',
    type: 'AI智能分析',
    status: 'generating'  // 状态: 'generating' 正在生成中, 'completed' 生成完成
  },
  {
    date: '2025-06-15',
    title: '学期教学总结报告',
    type: '定期评估'
  },
  {
    date: '2025-03-20',
    title: '专业发展能力分析',
    type: '专项评估'
  },
  {
    date: '2024-12-10',
    title: '课程建设成效评估',
    type: '项目评估'
  },
  {
    date: '2024-09-01',
    title: '年度教学工作总结',
    type: '年度报告'
  },
  {
    date: '2024-06-15',
    title: '学生满意度调研报告',
    type: '调研分析'
  }
])

// 当前显示的内容数据
const currentEvaluation = ref('')
const currentSummary = ref('')
const currentSuggestions = ref('')
const analysisItems = ref([])

// 存储所有活跃的定时器，用于在切换报告时清除
const activeTimers = ref([])
const isTypingActive = ref(false)

// 清除所有活跃的定时器
const clearAllTimers = () => {
  activeTimers.value.forEach(timer => {
    if (timer) clearInterval(timer)
  })
  activeTimers.value = []
  isTypingActive.value = false
}

// 打字机效果函数
const typeWriter = (element, text, speed = 30) => {
  return new Promise((resolve, reject) => {
    let i = 0
    const timer = setInterval(() => {
      // 如果打字机效果被停止，清除定时器并拒绝 Promise
      if (!isTypingActive.value) {
        clearInterval(timer)
        const index = activeTimers.value.indexOf(timer)
        if (index > -1) {
          activeTimers.value.splice(index, 1)
        }
        reject(new Error('Typing cancelled'))
        return
      }
      
      if (i < text.length) {
        element.textContent += text.charAt(i)
        i++
      } else {
        clearInterval(timer)
        const index = activeTimers.value.indexOf(timer)
        if (index > -1) {
          activeTimers.value.splice(index, 1)
        }
        resolve()
      }
    }, speed)
    
    // 将定时器添加到活跃列表
    activeTimers.value.push(timer)
  })
}

// 加载报告内容
const loadReportContent = (index) => {
  const content = reportContents[index]
  if (!content) return
  
  // 清空当前内容
  currentEvaluation.value = ''
  currentSummary.value = ''
  currentSuggestions.value = ''
  analysisItems.value = []
  showSuggestionsDetails.value = false
  
  // 加载新内容
  currentEvaluation.value = content.evaluation
  currentSummary.value = content.summary
  currentSuggestions.value = content.suggestions
  analysisItems.value = content.analysis || []
}

// 清空文本元素内容
const clearTextElements = () => {
  // 清空所有打字机文本元素
  const typingElements = document.querySelectorAll('.typing-text')
  typingElements.forEach(el => {
    if (el) el.textContent = ''
  })
}

// 选择报告
const selectReport = async (index) => {
  if (selectedReport.value === index) return
  
  // 停止所有正在进行的打字机效果
  clearAllTimers()
  
  selectedReport.value = index
  
  // 加载报告内容
  loadReportContent(index)
  
  // 清空文本元素
  clearTextElements()
  
  // 滚动到顶部
  const reportMain = document.querySelector('.report-main')
  if (reportMain) {
    reportMain.scrollTop = 0
  }
  
  // 如果第一个报告正在生成中，不切换内容（保持原来的打字机效果）
  if (index === 0 && reportHistory.value[0]?.status === 'generating') {
    return
  }
  
  // 重新显示内容（不带加载动画，直接显示）
  await nextTick()
  await displayReportContent()
}

// 显示报告内容（用于切换报告时）
const displayReportContent = async () => {
  await nextTick()
  
  // 显示综合评价
  if (evaluationTextRef.value) {
    evaluationTextRef.value.textContent = currentEvaluation.value
  }
  
  // 等待一下确保 refs 已更新
  await nextTick()
  
  // 显示各项分析
  for (let i = 0; i < analysisItems.value.length; i++) {
    if (analysisTextRefs.value[i]) {
      analysisTextRefs.value[i].textContent = analysisItems.value[i]?.content || ''
    }
  }
  
  // 显示总结
  await nextTick()
  if (summaryTextRef.value) {
    summaryTextRef.value.textContent = currentSummary.value
  }
  
  // 显示建议
  if (suggestionsTextRef.value) {
    suggestionsTextRef.value.textContent = currentSuggestions.value
  }
  
  // 显示建议详情（对于已完成的报告）
  if (selectedReport.value > 0) {
    showSuggestionsDetails.value = true
  }
}

// 滚动到建议部分
const scrollToSuggestions = () => {
  if (suggestionsSection.value) {
    suggestionsSection.value.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 切换建议展开状态
const toggleSuggestion = (index) => {
  expandedSuggestions.value[index] = !expandedSuggestions.value[index]
}

// 打开学习资源
const openResource = (resource) => {
  console.log('打开学习资源:', resource.name)
  // 这里可以添加打开资源的逻辑
  window.open(resource.url, '_blank')
}

// 打开辅助工具
const openTool = (tool) => {
  console.log('打开辅助工具:', tool.name)
  // 这里可以添加打开工具的逻辑
  window.open(tool.url, '_blank')
}

// 生成ToDo任务链 - 触发切换到成长决策标签页
const generateTodoChain = () => {
  console.log('生成ToDo任务链 - 切换到成长决策')
  // 触发自定义事件，通知父组件切换到成长决策标签页
  window.dispatchEvent(new CustomEvent('switch-to-decision'))
}

// 逐步显示内容（打字机效果）
const showContent = async () => {
  // 启用打字机效果
  isTypingActive.value = true
  
  // 加载第一个报告的内容
  loadReportContent(0)
  
  // 等待加载完成
  await new Promise(resolve => setTimeout(resolve, 2000))
  isLoading.value = false
  
  await nextTick()
  
  try {
    // 显示综合评价
    if (evaluationTextRef.value) {
      await typeWriter(evaluationTextRef.value, currentEvaluation.value).catch(() => {})
    }
    
    // 显示各项分析
    for (let i = 0; i < analysisItems.value.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      if (analysisTextRefs.value[i] && isTypingActive.value) {
        await typeWriter(analysisTextRefs.value[i], analysisItems.value[i].content).catch(() => {})
      }
    }
    
    // 显示总结
    if (isTypingActive.value) {
      await new Promise(resolve => setTimeout(resolve, 800))
      if (summaryTextRef.value) {
        await typeWriter(summaryTextRef.value, currentSummary.value).catch(() => {})
      }
    }
    
    // 显示建议
    if (isTypingActive.value) {
      await new Promise(resolve => setTimeout(resolve, 800))
      if (suggestionsTextRef.value) {
        await typeWriter(suggestionsTextRef.value, currentSuggestions.value).catch(() => {})
      }
    }
    
    // 显示建议详情
    if (isTypingActive.value) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      showSuggestionsDetails.value = true
    }
    
    // 报告生成完成，更新状态
    if (reportHistory.value[0] && reportHistory.value[0].status === 'generating') {
      reportHistory.value[0].status = 'completed'
    }
  } catch (error) {
    // 如果打字机效果被取消，忽略错误
    console.log('Typing animation cancelled')
  } finally {
    // 确保清除所有定时器
    if (!isTypingActive.value) {
      clearAllTimers()
    }
  }
}

onMounted(() => {
  showContent()
})
</script>

<style scoped>
.report-component {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.report-header {
  background: #fff;
  border-bottom: 2px solid #e9ecef;
  padding: 30px 40px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: baseline;
  justify-content: center;
  position: relative;
}

.report-title {
  font-size: 28px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
}

.report-subtitle {
  font-size: 18px;
  color: #6c757d;
  margin: 0 0 15px 0;
  font-weight: 500;
}

.report-meta {
  display: flex;
  gap: 30px;
  font-size: 14px;
  color: #6c757d;
}

.suggestions-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

.suggestions-btn:hover {
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  transform: translateY(-50%) translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.suggestions-btn:active {
  transform: translateY(-50%) translateY(0);
}

.report-layout {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
}

.report-sidebar {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e9ecef;
  padding: 20px 0;
}

.sidebar-header {
  padding: 0 20px 15px;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.sidebar-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0;
  text-align: left;
}

.report-timeline {
  padding: 0 10px;
}

.timeline-item {
  padding: 15px 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  text-align: left;
}

.timeline-item:hover {
  background: #f8f9fa;
}

.timeline-item.active {
  background: #e3f2fd;
  border-left-color: #1976d2;
}

.timeline-item.generating {
  border-left-color: #8b5cf6;
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
}

.timeline-item.generating.active {
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(227, 242, 253, 0.5) 100%);
  border-left-color: #8b5cf6;
}

.timeline-item.completed {
  border-left-color: #10b981;
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
}

.timeline-item.completed.active {
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(227, 242, 253, 0.5) 100%);
  border-left-color: #10b981;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.timeline-date {
  font-size: 12px;
  color: #6c757d;
}

.generating-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 10px;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
}

.completed-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.timeline-title {
  font-size: 14px;
  font-weight: 500;
  color: #212529;
  margin-bottom: 2px;
  line-height: 1.4;
}

.timeline-type {
  font-size: 12px;
  color: #6c757d;
}

.report-main {
  flex: 1;
  background: #fff;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.report-body {
  padding: 40px;
}

.report-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
  text-align: left;
}

.info-table {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.info-row {
  display: flex;
  border-bottom: 1px solid #e9ecef;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  width: 120px;
  padding: 15px 20px;
  background: #f8f9fa;
  font-weight: 500;
  color: #495057;
  border-right: 1px solid #e9ecef;
  font-size: 14px;
}

.info-value {
  flex: 1;
  padding: 15px 20px;
  color: #212529;
  font-size: 14px;
}

.content-text, .analysis-text, .summary-text, .suggestions-text {
  line-height: 1.8;
  color: #495057;
  font-size: 15px;
  text-align: justify;
  min-height: 1.2em;
  white-space: pre-line;
}

.analysis-content {
  margin-top: 20px;
}

.analysis-item {
  margin-bottom: 30px;
}

.analysis-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 15px 0;
  padding-left: 15px;
  border-left: 4px solid #1976d2;
  text-align: left;
}

.summary-content {
  margin-top: 20px;
}

.summary-item {
  margin-bottom: 25px;
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 10px 0;
  text-align: left;
}

/* 建议详情样式 */
.suggestions-details {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.suggestion-item {
  margin-bottom: 24px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.suggestion-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.toggle-btn {
  padding: 6px 12px;
  background: #e3f2fd00;
  color: #1976d2;
  border: 0px solid #1976d2;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: #1976d2;
  color: white;
}

.suggestion-content {
  margin-top: 12px;
}

.learning-resources, .assist-tools {
  margin-bottom: 16px;
}

.resources-title, .tools-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 8px 0;
  text-align: left;
}

.resources-list, .tools-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 8px;
}

.resource-item, .tool-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
  gap: 10px;
}

.resource-item:hover, .tool-item:hover {
  background: #e3f2fd;
  border-color: #1976d2;
}

.resource-icon, .tool-icon {
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.resource-info, .tool-info {
  flex: 1;
  min-width: 0;
}

.resource-name, .tool-name {
  font-size: 14px;
  font-weight: 500;
  color: #212529;
  margin-bottom: 2px;
}

.resource-desc, .tool-desc {
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
}

.resource-btn, .tool-btn {
  padding: 6px 12px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.resource-btn:hover, .tool-btn:hover {
  background: #1565c0;
  transform: translateY(-1px);
}

/* ToDo任务链按钮样式 */
.todo-section {
  margin-top: 24px;
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid #e9ecef;
}

.todo-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.todo-btn:hover {
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.todo-icon {
  font-size: 18px;
}

.report-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.loading-content {
  text-align: center;
}

.loading-icon {
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.loading-content h3 {
  font-size: 18px;
  color: #495057;
  margin: 0 0 10px 0;
}

.loading-content p {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 20px 0;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #1976d2;
  border-radius: 50%;
  animation: loading 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .suggestions-btn {
    position: static;
    transform: none;
    margin-top: 15px;
    align-self: flex-end;
  }
  
  .report-layout {
    flex-direction: column;
  }
  
  .report-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }
  
  .report-main {
    margin: 10px;
  }
  
  .report-body {
    padding: 20px;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .info-label {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }
  
  .suggestion-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .resource-item, .tool-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .resource-btn, .tool-btn {
    align-self: flex-end;
  }
}
</style>
