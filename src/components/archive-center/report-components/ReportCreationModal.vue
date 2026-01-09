<template>
  <div class="report-creation-modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- 模态框头部 -->
      <div class="modal-header">
        <h2>创建个人档案</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <!-- 模态框内容 -->
      <div class="modal-body">
        <!-- 基本信息表单 -->
        <div class="form-section">
          <div class="form-group">
            <input 
              type="text" 
              id="reportName" 
              v-model="reportForm.name" 
              placeholder="张婉婷的教学报告"
              class="form-input"
            />
          </div>
        </div>

        <!-- 报告选择区域 -->
        <div class="form-section report-selection-section">
          <div class="section-header-with-desc">
            <div class="section-header-content">
              <h3>选择档案类型及现有报告（可选）</h3>
              <p class="section-description">可以选择已有的AI分析报告，将其内容填充到申报材料中</p>
            </div>
          </div>
          <div class="report-selector">
            <div class="selector-field">
              <select v-model="selectedReportType" class="form-select" @change="onReportTypeChange">
                <option value="">选择档案类型</option>
                <option v-for="type in reportTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>
            <div class="selector-field">
              <select v-model="selectedReportIndex" class="form-select" @change="onReportSelected">
                <option value="">-- {{ selectedReportType ? `选择${archiveToReportMap[selectedReportType] || '报告'}` : '从空白创建' }} --</option>
                <option 
                  v-for="report in availableReports" 
                  :key="report.originalIndex"
                  :value="report.originalIndex"
                >
                  {{ report.date }} - {{ report.title }} 
                </option>
              </select>
            </div>
            <button 
              v-if="selectedReportIndex !== ''" 
              class="load-report-btn" 
              @click="loadReportContent"
            >
              填充内容
            </button>
          </div>
          <div v-if="selectedReportIndex !== '' && !isReportLoaded" class="report-info">
            <div class="info-badge">
              <span class="info-icon">ℹ️</span>
              <span>已选择报告，点击"填充报告内容"按钮将报告内容转换为模块</span>
            </div>
          </div>
          <div v-if="isReportLoaded" class="report-info success">
            <div class="info-badge">
              <span class="info-icon">✓</span>
              <span>报告内容已加载，可在下方模块中进行编辑和补充</span>
            </div>
          </div>
        </div>

        <!-- 模块编辑区域 -->
        <div class="modules-section">
          <div class="section-header">
            <h3>档案模块</h3>
            <button class="add-module-btn" @click="addNewModule" :disabled="!reportForm.name.trim()">
              + 添加模块
            </button>
          </div>

          <!-- 模块列表 -->
          <div v-if="reportModules.length > 0" class="modules-list">
            <div 
              v-for="(module, index) in reportModules" 
              :key="module.id"
              class="module-item"
            >
              <!-- 模块头部 - 展示模块名称和操作按钮 -->
              <div class="module-header">
                <div class="module-name-display">
                  <span class="module-icon">📄</span>
                  <input 
                    v-if="module.isCustom" 
                    v-model="module.name" 
                    class="name-edit-input" 
                    placeholder="请输入模块名称"
                  />
                  <h4 v-else>{{ module.name }}</h4>
                </div>
                <div class="module-actions">
                  <button class="edit-btn" @click="editModule(index)" :class="{ active: editingModuleIndex === index }">
                    {{ editingModuleIndex === index ? '完成编辑' : '编辑' }}
                  </button>
                </div>
              </div>

              <!-- 模块编辑区域 -->
              <div v-if="editingModuleIndex === index" class="module-edit-area">
                <div class="edit-form">

                  <!-- 文字内容编辑（始终显示） -->
                  <div class="form-group document-editor-container">
                    <label>本分类详细内容</label>
                    <div class="mock-editor-toolbar">
                      <div class="toolbar-group">
                        <span class="tool">B</span>
                        <span class="tool">I</span>
                        <span class="tool">U</span>
                        <span class="tool-divider"></span>
                        <span class="tool">H1</span>
                        <span class="tool">H2</span>
                        <span class="tool-divider"></span>
                        <span class="tool">List</span>
                        <span class="tool">Align</span>
                      </div>
                      <div class="toolbar-group">
                        <span class="tool-info">编辑器模式</span>
                      </div>
                    </div>
                    <textarea 
                      v-model="module.summary" 
                      placeholder="请输入详细描述内容"
                      class="form-textarea summary-textarea document-style-textarea"
                      rows="12"
                    ></textarea>
                  </div>

                  <!-- 图表控制按钮 -->
                  <div class="chart-toggle-bar">
                    <button 
                      v-if="module.chartType === 'none'" 
                      class="add-chart-btn"
                      @click="module.chartType = 'bar'"
                    >
                      + 添加可视化图表
                    </button>
                    <button 
                      v-else 
                      class="remove-chart-btn"
                      @click="module.chartType = 'none'"
                    >
                      移除可视化图表
                    </button>
                  </div>

                  <!-- 培训档案特有字段（位于图表之上，内容之下） -->
                  <div v-if="module.type === 'training-online' || module.type === 'training-offline'" class="training-fields active-edit-fields">
                    <div class="setting-row">
                      <div class="setting-item special-field">
                        <label>培训学时</label>
                        <input type="number" v-model="module.trainingHours" class="form-input" placeholder="请输入学时" />
                      </div>
                      <div class="setting-item special-field">
                        <label>培训结果</label>
                        <input type="text" v-model="module.trainingResult" class="form-input" placeholder="及格/优秀/结业等" />
                      </div>
                    </div>
                    <div class="form-group special-field">
                      <label>培训报告/相关证明</label>
                      <input type="text" v-model="module.trainingReport" class="form-input" placeholder="请输入或上传报告链接" />
                    </div>
                  </div>

                  <!-- 图表设置和预览区域（仅在开启图表时显示） -->
                  <div v-if="module.chartType !== 'none'" class="chart-configuration animated-fade-in">
                    <!-- 左侧：图表预览和设置 -->
                    <div class="chart-left-panel">
                      <div class="chart-preview-section">
                        <label>数据可视化预览</label>
                        <div class="chart-preview-container small-preview">
                          <ReportModulePreview
                            :module-type="module.type"
                            :chart-type="module.chartType"
                            :color-scheme="module.colorScheme"
                            :show-legend="module.showLegend"
                            :show-labels="module.showLabels"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="chart-settings">
                        <div class="setting-row">
                          <div class="setting-item">
                            <label>图表类型</label>
                            <select v-model="module.chartType" class="form-select">
                              <option value="bar">柱状图</option>
                              <option value="line">折线图</option>
                              <option value="pie">饼图</option>
                              <option value="doughnut">环形图</option>
                              <option value="radar">雷达图</option>
                            </select>
                          </div>
                          <div class="setting-item">
                            <select v-model="module.colorScheme" class="form-select">
                              <option 
                                v-for="scheme in colorSchemes" 
                                :key="scheme.name"
                                :value="scheme.name"
                              >
                                {{ scheme.name }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="setting-row">
                          <div class="setting-item">
                            <label>
                              <input type="checkbox" v-model="module.showLegend" />
                              显示图例
                            </label>
                          </div>
                          <div class="setting-item">
                            <label>
                              <input type="checkbox" v-model="module.showLabels" />
                              显示标签
                            </label>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 模块预览 -->
              <div v-else class="module-preview">
                <div class="preview-header">
                  <span class="preview-name">{{ module.name || '未命名模块' }}</span>
                  <span class="preview-type">{{ getModuleTypeName(module.type) }}</span>
                  <span v-if="module.source === 'report'" class="preview-badge report-badge">
                    📄 来自报告
                  </span>
                </div>
                <div class="preview-content">
                  <div v-if="module.summary" class="preview-summary">
                    <p class="summary-preview">{{ module.summary.substring(0, 300) }}{{ module.summary.length > 300 ? '...' : '' }}</p>
                  </div>
                  
                  <!-- 培训档案特有字段预览 -->
                  <div v-if="(module.type === 'training-online' || module.type === 'training-offline') && (module.trainingHours || module.trainingResult || module.trainingReport)" class="preview-special-info">
                    <div class="info-row">
                      <span v-if="module.trainingHours" class="info-tag">学时: {{ module.trainingHours }}</span>
                      <span v-if="module.trainingResult" class="info-tag">结果: {{ module.trainingResult }}</span>
                    </div>
                    <div v-if="module.trainingReport" class="info-row report-link">
                      <span>报告: {{ module.trainingReport }}</span>
                    </div>
                  </div>

                  <div v-if="module.chartType && module.chartType !== 'none'" class="preview-chart">
                    <div class="chart-preview-container">
                      <ReportModulePreview
                        :module-type="module.type"
                        :chart-type="module.chartType"
                        :color-scheme="module.colorScheme"
                        :show-legend="module.showLegend"
                        :show-labels="module.showLabels"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 模块底部操作区域（始终显示） -->
              <div class="module-item-footer">
                <button class="remove-btn-minimal" @click="removeModule(index)">
                  删除
                </button>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <div class="empty-icon">📝</div>
            <h4>还没有添加任何模块</h4>
            <p>点击"添加模块"按钮开始创建您的报告</p>
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeModal">取消</button>
        <button 
          class="preview-btn action-btn secondary" 
          @click="previewReport" 
          :disabled="!canPreview"
        >
          预览
        </button>
        <button 
          class="save-btn action-btn primary" 
          @click="saveReport" 
          :disabled="!canSave"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ReportModulePreview from './ReportModulePreview.vue'

// 定义 props
const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const router = useRouter()


// 格式化日期函数
const formatDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

// 报告类型选项
const reportTypes = ['教学档案', '成长档案', '培训档案']

// 档案类型到报告类型的映射
const archiveToReportMap = {
  '教学档案': '教学报告',
  '成长档案': '发展成果报告',
  '培训档案': '培训学习报告'
}

// 报告历史数据
const reportHistory = ref([
  {
    date: formatDate(),
    title: '2025年秋季学期教学能力综合评估',
    type: '教学报告',
    status: 'generating'
  },
  {
    date: '2025-06-15',
    title: '2025年春季学期教学总结报告',
    type: '教学报告',
    status: 'completed'
  },
  {
    date: '2025-03-20',
    title: '专业技术职务晋升发展成果分析',
    type: '发展成果报告',
    status: 'completed'
  },
  {
    date: '2024-12-10',
    title: '高校教师数字化教学能力培训总结',
    type: '培训学习报告',
    status: 'completed'
  },
  {
    date: '2024-09-01',
    title: '2023-2024学年度教学工作量核定报告',
    type: '教学报告',
    status: 'completed'
  },
  {
    date: '2024-06-15',
    title: '中青年骨干教师海外访学成果评估',
    type: '发展成果报告',
    status: 'completed'
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

// 选中的报告类型
const selectedReportType = ref('')

// 可用的报告列表（只显示已完成的报告，并保留原始索引，且根据选中的类型进行过滤）
const availableReports = computed(() => {
  const targetType = archiveToReportMap[selectedReportType.value] || ''
  return reportHistory.value
    .map((report, originalIndex) => ({ ...report, originalIndex }))
    .filter(report => {
      const isCompleted = report.status === 'completed' || !report.status
      const matchesType = !selectedReportType.value || report.type === targetType
      return isCompleted && matchesType
    })
})

// 定义每个档案类型的模块映射
const archiveModuleMap = {
  '教学档案': [
    { id: 'personal-info', name: '个人基本资料' },
    { id: 'teaching-basic', name: '基础资质材料' },
    { id: 'teaching-implementation', name: '教学实施材料' },
    { id: 'teaching-reform', name: '教学改革材料' },
    { id: 'teaching-practice', name: '实践教学材料' },
    { id: 'student-development', name: '学生发展材料' }
  ],
  '成长档案': [
    { id: 'personal-info', name: '个人基本资料' },
    { id: 'growth-practice', name: '企业实践' },
    { id: 'growth-competition', name: '技能竞赛' },
    { id: 'growth-guidance', name: '指导学生' },
    { id: 'growth-research', name: '教科研成果' }
  ],
  '培训档案': [
    { id: 'personal-info', name: '个人基本资料' },
    { id: 'training-online', name: '线上培训' },
    { id: 'training-offline', name: '线下培训' }
  ]
}

// Mock 内容映射
const mockContentMap = {
  'personal-info': '【个人基本资料】\n\n一、基础身份\n• 姓名：张婉婷\n• 性别：女\n• 年龄：36岁\n\n二、专业背景\n• 学历：博士研究生\n• 职称：副教授\n• 教龄：12年\n\n三、组织归属\n• 所属学院：计算机与软件学院\n• 所属教研组：人工智能教研组\n\n四、简要介绍\n深耕职教领域多年，致力于AI与专业课程的深度融合，多次获得省级教学能力大赛奖项，具有丰富的“双师型”教师实操经验。',
  'teaching-basic': '【基础资质概况】\n\n本年度已完成教师资格定期注册，持有“高级讲师”职称证书。年度岗位考核评定为“优秀”。\n\n• 核心课程：负责《软件工程》、《深入浅出Vue.js》等专业课。\n• 教学工作量：累计授课超过400学时，教学事故0记录。\n• 个人荣誉：荣获校级“优秀骨干教师”称号。',
  'teaching-implementation': '【教学实施总结报告】\n\n本学期教学进度完全符合大纲要求，教学计划执行率100%。\n\n1. 教学方法改革：全面推行项目驱动教学法（PBL），课堂活跃度提升40%。\n2. 资源建设：更新了全套教学课件，新增实战案例库12个。\n3. 达成度分析：学生课程平均分显著提升，期末优秀率由去年的15%增长至今年的22%。',
  'teaching-reform': '【教学改革与创新项目】\n\n主持校级重点教改课题《人工智能辅助编程教学模式的构建与实践》。\n\n• 成果产出：公开发表省级教改论文2篇。\n• 模式创新：构建了“产教融合-项目导入-AI纠错”的三位一体评价体系。\n• 数字化转型：成功引入AI助手辅助代码批改，反馈时效缩短了80%。',
  'teaching-practice': '【实践教学与校企合作】\n\n本年度校外实习实训工作开展顺利，实现了教学与就业的闭环。\n\n• 企业导师：聘请3位行业资深专家担任产业导师，开展专题讲座5场。\n• 基地建设：新增校外校企共建实习基地2处。\n• 实训成果：120名学生圆满完成企业顶岗实训，企业满意度评分达9.5/10。',
  'student-development': '【学生综合发展报告】\n\n本年度所带班级在学风建设与竞赛获奖方面表现优异。\n\n1. 竞赛获奖：指导学生在“蓝桥杯”总决赛中获得国家级二等奖。\n2. 升学情况：班级整体就业率达到96%，其中5人考入名企技术岗。\n3. 素养提升：组织开展技术沙龙12场，学生自主探究能力显著增强。',
  'growth-practice': '【年度企业实践纪要】\n\n暑期参加了华为云生态合作伙伴专项赋能培训及为期一个月的企业挂职实践。\n\n• 岗位职责：担任项目组架构设计助理，深度参与了OA系统数字化升级项目。\n• 技术收获：掌握了微服务架构下服务治理的真实落地场景。\n• 教学转化：将项目中3个典型的数据库死锁场景转化为教学微课。',
  'growth-competition': '【教师专业竞赛记录】\n\n参加了2025年全国职业院校教师教学能力大赛，展现了良好的数智化素养。\n\n• 获奖等级：荣获“国家级二等奖”。\n• 核心竞争力：通过备赛，系统掌握了VR课堂模拟手段，提升了复杂知识点的视觉化传达效率。',
  'growth-guidance': '【学生竞赛指导简报】\n\n致力于培养高素质技术技能人才，形成了“以赛促学”的长效机制。\n\n• 指导规模：常年指导算法社团成员30余名。\n• 关键战绩：指导学生获得全国大学生数学建模设计大赛一等奖1项。\n• 梯队建设：成功孵化了大二、大三竞赛阶梯队，确保了专业实力的持续性。',
  'growth-research': '【年度教科研工作综述】\n\n聚焦于“AI+教育”领域的前沿技术应用研究，取得了阶段性突破。\n\n• 纵向项目：主持市厅级科研项目《基于LLM的编程教学情感分析研究》。\n• 论文发表：在《电化教育研究》等核心刊物发表综述1篇。\n• 知识产权：获得实用新型专利1项，软件著作权2项。',
  'training-online': '【线上培训学习档案】\n\n参加了“职业院校教师素质提高计划”数字化教学能力专题培训。\n\n• 学习时长：累计学习48学时，在线测试成绩98分。\n• 核心模块：涵盖数字化资源设计、混合式教学评估、AI辅助备课等12个专题。\n• 获得证书：授予“数字化先锋教师”专项结业证书。',
  'training-offline': '【线下高级研修班纪要】\n\n赴杭州参加了为期一周的“新一代信息技术双师型骨干教师研修班”。\n\n• 研修形式：采取现场观摩、大咖讲座、分组探讨、方案路演等形式。\n• 研修亮点：实地考察了阿里总部数字化展厅，深刻理解了未来社区与职教场景的融合方案。\n• 产出成果：主笔完成了《数字化实训室建设方案》，已提交教务处审阅。'
}

// 扁平化所有模块类型供查找名称
const allModuleTypes = Object.values(archiveModuleMap).flat()

// 计算当前可选的模块类型
const availableModuleTypes = computed(() => {
  return archiveModuleMap[selectedReportType.value] || []
})

// 配色方案
const colorSchemes = [
  { name: '经典蓝', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: '活力橙', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: '自然绿', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: '温暖黄', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: '优雅紫', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: '商务灰', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
]

// 表单数据
const reportForm = reactive({
  name: ''
})

// 报告模块列表
const reportModules = ref([])

// 当前编辑的模块索引
const editingModuleIndex = ref(-1)

// 选中的报告索引
const selectedReportIndex = ref('')
// 报告是否已加载
const isReportLoaded = ref(false)

// 组件挂载时检查是否有初始数据
onMounted(() => {
  if (props.initialData) {
    // 填充报告名称
    if (props.initialData.name) {
      reportForm.name = props.initialData.name
    }
    
    // 填充报告类型
    if (props.initialData.reportType) {
      selectedReportType.value = props.initialData.reportType
    }
    
    // 填充模块列表
    if (props.initialData.modules && props.initialData.modules.length > 0) {
      reportModules.value = props.initialData.modules.map(module => ({
        ...module,
        id: module.id || Date.now() + Math.random()
      }))
      isReportLoaded.value = true
    }
  }
})


// 计算属性
const canSave = computed(() => {
  return reportForm.name.trim() && reportModules.value.length > 0
})

const canPreview = computed(() => {
  return reportForm.name.trim() && reportModules.value.length > 0
})

// 方法
const editModule = (index) => {
  if (editingModuleIndex.value === index) {
    editingModuleIndex.value = -1
  } else {
    editingModuleIndex.value = index
  }
}

const removeModule = (index) => {
  reportModules.value.splice(index, 1)
  if (editingModuleIndex.value === index) {
    editingModuleIndex.value = -1
  } else if (editingModuleIndex.value > index) {
    editingModuleIndex.value--
  }
}

const getModuleTypeName = (typeId) => {
  const moduleType = allModuleTypes.find(type => type.id === typeId)
  return moduleType ? moduleType.name : '未选择'
}

const getChartTypeName = (chartType) => {
  const chartTypes = {
    'bar': '柱状图',
    'line': '折线图',
    'pie': '饼图',
    'doughnut': '环形图',
    'radar': '雷达图'
  }
  return chartTypes[chartType] || chartType
}

// 当档案类型改变时
const onReportTypeChange = () => {
  selectedReportIndex.value = ''
  isReportLoaded.value = false
  
  // 根据选择的档案类型，自动初始化标准模块
  if (selectedReportType.value && archiveModuleMap[selectedReportType.value]) {
    reportModules.value = archiveModuleMap[selectedReportType.value].map(m => ({
      id: `module_${m.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: m.name,
      type: m.id,
      description: '',
      summary: '', // 切换类型时保持空白
      chartType: 'none',
      colorScheme: '经典蓝',
      showLegend: true,
      showLabels: true,
      trainingHours: 0,
      trainingResult: '',
      trainingReport: '',
      isCustom: false
    }))
  } else {
    reportModules.value = []
  }
}

// 当报告被选择时
const onReportSelected = () => {
  if (selectedReportIndex.value === '') {
    isReportLoaded.value = false
  }
}

// 加载报告内容并转换为模块 (现在改为辅助填充机制)
const loadReportContent = () => {
  if (selectedReportIndex.value === '') return
  
  const reportIndex = parseInt(selectedReportIndex.value)
  const reportContent = reportContents[reportIndex]
  const reportInfo = reportHistory.value[reportIndex]
  
  if (!reportContent || !reportInfo) return
  
  // 如果没有设置报告名称，使用选中报告的标题
  if (!reportForm.name.trim()) {
    reportForm.name = reportInfo.title
  }

  // 先为所有模块填充专业的 Mock 模板作为基础
  reportModules.value.forEach(module => {
    if (mockContentMap[module.type]) {
      module.summary = mockContentMap[module.type]
      
      // 针对培训模块填充默认 Mock 数据
      if (module.type.startsWith('training-')) {
        module.trainingHours = 40
        module.trainingResult = '优秀'
        module.trainingReport = 'http://example.com/certified_report'
      }
    }
  })

  // 辅助填充逻辑：尝试将报告内容填充到已有的对应模块中
  if (reportContent.evaluation) {
    // 找到合适的模块填充评价（跳过“个人基本资料”模块）
    const targetFillIndex = reportModules.value[0]?.type === 'personal-info' ? 1 : 0
    if (reportModules.value.length > targetFillIndex) {
      reportModules.value[targetFillIndex].summary = reportContent.evaluation
    }
  }

  // 如果有详细分析，尝试匹配标题填充
  if (reportContent.analysis && Array.isArray(reportContent.analysis)) {
    reportContent.analysis.forEach((analysisItem) => {
      const targetModule = reportModules.value.find(m => 
        analysisItem.title.includes(m.name) || m.name.includes(analysisItem.title)
      )
      if (targetModule) {
        targetModule.summary = analysisItem.content
      }
    })
  }
  
  // 标记报告已加载
  isReportLoaded.value = true
}

const addNewModule = () => {
  const newModule = {
    id: `module_custom_${Date.now()}`,
    name: '新自定义模块',
    type: 'custom',
    description: '',
    summary: '',
    chartType: 'none',
    colorScheme: '经典蓝',
    showLegend: true,
    showLabels: true,
    isCustom: true // 标记为自定义，允许编辑名称
  }
  
  reportModules.value.push(newModule)
  editingModuleIndex.value = reportModules.value.length - 1
}

const handlePrint = () => {
  alert('正在准备档案打印预览...')
  window.print()
}

const handleDownload = () => {
  alert('正在生成 PDF/Word 文档并准备下载...')
}

const handleApply = () => {
  alert('档案申报系统已对接，正在提交申报材料...')
}

const previewReport = () => {
  if (!canPreview.value) return
  
  const reportData = {
    name: reportForm.name,
    type: selectedReportType.value,
    modules: reportModules.value,
    createdAt: new Date().toISOString()
  }
  
  // 将报告数据存储到 localStorage 供预览页面使用
  localStorage.setItem('previewReportData', JSON.stringify(reportData))
  
  // 在新标签页打开预览页面（适配 Hash 模式）
  const routeData = router.resolve({ name: 'ReportPreview' })
  window.open(routeData.href, '_blank')
}

const saveReport = () => {
  if (!canSave.value) return
  
  const reportData = {
    name: reportForm.name,
    modules: reportModules.value,
    createdAt: new Date().toISOString()
  }
  
  console.log('保存报告:', reportData)
  // 这里应该调用API保存报告
  closeModal()
}

const closeModal = () => {
  // 重置表单
  reportForm.name = ''
  reportModules.value = []
  editingModuleIndex.value = -1
  selectedReportType.value = ''
  selectedReportIndex.value = ''
  isReportLoaded.value = false
  // 触发关闭事件
  emit('close')
}

// 定义事件
const emit = defineEmits(['close'])
</script>

<style scoped>
.report-creation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* 更新模态框头部样式 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, #1976d2 0%, #1890ff 100%);
  border-radius: 16px 16px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 500;
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #fff;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  display: flex;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modules-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.add-module-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-module-btn:hover:not(:disabled) {
  background: #7c3aed;
}

.add-module-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.module-item {
  border: none;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 30px;
  overflow: visible;
  transition: all 0.2s;
}

.module-item:last-child {
  border-bottom: none;
}

/* 更新模块头部样式 */
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  background: transparent;
  border-bottom: none;
}

.module-type-selector {
  flex: 1;
  margin-right: 16px;
  display: flex;
  align-items: center;
}

.module-type-selector .form-select {
  width: 100%;
  max-width: 200px;
}

.module-actions {
  display: flex;
  gap: 8px;
}

.edit-btn, .remove-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: #f3f4f6;
  color: #374151;
}

.edit-btn:hover {
  background: #e5e7eb;
}

.edit-btn.active {
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  color: white;
}

.remove-btn {
  background: #fef2f2;
  color: #dc2626;
}

.remove-btn:hover {
  background: #fee2e2;
}

.module-edit-area {
  padding: 20px;
  background: white;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 新增图表配置区域样式 */
.chart-configuration {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 24px;
  margin-top: 20px;
}

.chart-left-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-right-panel {
  display: grid;
  grid-column: 1/span 2;
  flex-direction: column;
}

.chart-preview-section {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.chart-preview-section label {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  display: flex;
}

.chart-preview-container {
  width: 100%;
  height: 200px;
  border-radius: 6px;
  overflow: hidden;
  background: white;
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.setting-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.document-editor-container {
  display: flex;
  flex-direction: column;
  background: #fdfdfd;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #eef1f6;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.mock-editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.tool:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.tool-divider {
  width: 1px;
  height: 16px;
  background: #cbd5e1;
}

.tool-info {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.document-style-textarea {
  border: 1px solid #e2e8f0 !important;
  border-radius: 0 0 6px 6px !important;
  background: #fff;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 16px;
  line-height: 1.8;
  padding: 30px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  color: #2c3e50;
  resize: none;
}

.document-style-textarea:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.08);
}

.module-preview {
  padding: 20px;
  background: white;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.preview-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.preview-type {
  padding: 2px 6px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.preview-badge {
  padding: 2px 8px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.report-badge {
  background: #ddd6fe;
  color: #5b21b6;
}

.preview-summary {
  margin-top: 4px;
}

.summary-preview {
  margin: 0;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 15px;
  color: #334155;
  line-height: 1.8;
  white-space: pre-wrap;
  text-align: left;
}

.preview-content {
  color: #334155;
  line-height: 1.8;
}

.preview-chart {
  margin-top: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 报告选择区域样式 */
.report-selection-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  margin-bottom: 32px;
}

.section-header-with-desc {
  margin-bottom: 16px;
}

.section-header-with-desc h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.section-header-content {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.section-description {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.report-selector {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.selector-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selector-field label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.report-selector .form-select {
  width: 100%;
}

.load-report-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.load-report-btn:hover {
  background: #7c3aed;
  transform: translateY(-1px);
}

.report-info {
  margin-top: 12px;
}

.report-info.success .info-badge {
  background: #d1fae5;
  border-color: #10b981;
  color: #065f46;
}

.info-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #dbeafe;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  font-size: 13px;
  color: #1e40af;
}

.info-icon {
  font-size: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 32px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.cancel-btn, .preview-btn, .save-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.preview-btn {
  background: #cbece1;
  color: #10b981;
}

.preview-btn:hover:not(:disabled) {
  background: #059669;
}

.preview-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.save-btn {
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #7c3aed;
}

.save-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}


/* 培训特有字段样式 */
.training-fields {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #eee;
}

.special-field label {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  display: block;
}

.special-field .form-input {
  background: #f8faff;
  border-color: #e1e8f5;
}

.preview-special-info {
  margin: 12px 0;
  padding: 10px;
  background: #f0f7ff;
  border-radius: 6px;
  font-size: 13px;
}

.preview-special-info .info-row {
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
}

.preview-special-info .info-tag {
  color: #1890ff;
  font-weight: 500;
}

.preview-special-info .report-link {
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .setting-row {
    grid-template-columns: 1fr;
  }
  
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .module-type-selector {
    width: 100%;
    margin-right: 0;
  }
  
  .module-type-selector .form-select {
    max-width: none;
  }
  
  .module-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .chart-configuration {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* 档案模块新样式 */
.module-name-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-name-display h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.name-edit-input {
  border: 1px solid #dcdfe6;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  background: #f0f7ff;
  outline: none;
  transition: all 0.2s;
}

.name-edit-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.module-item-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
}

.remove-btn-minimal {
  background: transparent;
  color: #94a3b8;
  border: none;
  padding: 4px 0;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.remove-btn-minimal:hover {
  color: #f5222d;
}

.btn-icon {
  font-size: 14px;
}
</style>
