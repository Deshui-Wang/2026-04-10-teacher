<template>
  <div class="report-creation-modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- 模态框头部 -->
      <div class="modal-header">
        <h2>创建申报材料</h2>
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
              placeholder="张婉婷的报告"
              class="form-input"
            />
          </div>
        </div>

        <!-- 报告选择区域 -->
        <div class="form-section report-selection-section">
          <div class="section-header-with-desc">
            <div class="section-header-content">
              <h3>选择现有报告（可选）</h3>
              <p class="section-description">可以选择已有的AI分析报告，将其内容填充到申报材料中</p>
            </div>
          </div>
          <div class="report-selector">
            <select v-model="selectedReportIndex" class="form-select" @change="onReportSelected">
              <option value="">-- 不选择报告，从空白创建 --</option>
              <option 
                v-for="(report, index) in availableReports" 
                :key="report.originalIndex"
                :value="report.originalIndex"
                :disabled="report.status === 'generating'"
              >
                {{ report.date }} - {{ report.title }} 
                <span v-if="report.status === 'generating'">(生成中...)</span>
                <span v-else-if="report.status === 'completed'">✓</span>
              </option>
            </select>
            <button 
              v-if="selectedReportIndex !== ''" 
              class="load-report-btn" 
              @click="loadReportContent"
            >
              填充报告内容
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
            <h3>报告模块</h3>
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
              <!-- 模块头部 - 包含模块类型选择和操作按钮 -->
              <div class="module-header">
                <div class="module-type-selector">
                  <select v-model="module.type" class="form-select" @change="onModuleTypeChange(module)">
                    <option value="">选择模块类型</option>
                    <option 
                      v-for="moduleType in availableModuleTypes" 
                      :key="moduleType.id"
                      :value="moduleType.id"
                    >
                      {{ moduleType.name }}
                    </option>
                  </select>
                </div>
                <div class="module-actions">
                  <button class="edit-btn" @click="editModule(index)" :class="{ active: editingModuleIndex === index }">
                    {{ editingModuleIndex === index ? '完成编辑' : '编辑' }}
                  </button>
                  <button class="remove-btn" @click="removeModule(index)">删除</button>
                </div>
              </div>

              <!-- 模块编辑区域 -->
              <div v-if="editingModuleIndex === index" class="module-edit-area">
                <div class="edit-form">

                  <!-- 图表设置和预览区域 -->
                  <div class="chart-configuration">
                    <!-- 左侧：图表预览和设置 -->
                    <div class="chart-left-panel">
                      <div class="chart-preview-section">
                        <label>图表预览区</label>
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
                    <div class="chart-settings">
                        <div class="setting-row">
                          <div class="setting-item">
                            <label>图表类型</label>
                            <select v-model="module.chartType" class="form-select">
                              <option value="none">无图表</option>
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
                    <!-- 右侧：总结说明 -->
                    <div class="chart-right-panel">
                      <div class="form-group">
                        <label>针对本模块数据的总结说明</label>
                        <textarea 
                          v-model="module.summary" 
                          placeholder="请输入针对本模块数据的总结说明"
                          class="form-textarea summary-textarea"
                          rows="8"
                        ></textarea>
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
                  <p class="preview-description">{{ module.description || '暂无描述' }}</p>
                  <div v-if="module.summary" class="preview-summary">
                    <p class="summary-preview">{{ module.summary.substring(0, 150) }}{{ module.summary.length > 150 ? '...' : '' }}</p>
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
          class="preview-btn" 
          @click="previewReport" 
          :disabled="!canPreview"
        >
          预览报告
        </button>
        <button 
          class="save-btn" 
          @click="saveReport" 
          :disabled="!canSave"
        >
          保存报告
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import ReportModulePreview from './ReportModulePreview.vue'

// 格式化日期函数
const formatDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

// 从 Report.vue 中导入的报告数据
// 报告历史数据
const reportHistory = ref([
  {
    date: formatDate(),
    title: '教学能力综合评估',
    type: 'AI智能分析',
    status: 'generating'
  },
  {
    date: '2025-06-15',
    title: '学期教学总结报告',
    type: '定期评估',
    status: 'completed'
  },
  {
    date: '2025-03-20',
    title: '专业发展能力分析',
    type: '专项评估',
    status: 'completed'
  },
  {
    date: '2024-12-10',
    title: '课程建设成效评估',
    type: '项目评估',
    status: 'completed'
  },
  {
    date: '2024-09-01',
    title: '年度教学工作总结',
    type: '年度报告',
    status: 'completed'
  },
  {
    date: '2024-06-15',
    title: '学生满意度调研报告',
    type: '调研分析',
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

// 可用的报告列表（只显示已完成的报告，并保留原始索引）
const availableReports = computed(() => {
  return reportHistory.value
    .map((report, originalIndex) => ({ ...report, originalIndex }))
    .filter(report => report.status === 'completed' || !report.status)
})

// 定义可用的模块类型
const availableModuleTypes = [
  { id: 'assets', name: '资产' },
  { id: 'achievements', name: '成果奖励' },
  { id: 'digital-literacy', name: '数字素养' },
  { id: 'workload-stats', name: '工作量统计' },
  { id: 'ethics', name: '师德师风' },
  { id: 'student-data', name: '学生数据' },
  { id: 'courseware-research', name: '课件教案研发数据' },
  { id: 'teaching-experience', name: '教学经验数据' }
]

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

// 计算属性
const canSave = computed(() => {
  return reportForm.name.trim() && reportModules.value.length > 0 && 
         reportModules.value.every(module => module.type)
})

const canPreview = computed(() => {
  return reportForm.name.trim() && reportModules.value.length > 0
})

// 方法
const addNewModule = () => {
  const newModule = {
    id: `module_${Date.now()}`,
    name: `模块${reportModules.value.length + 1}`,
    type: '',
    description: '',
    summary: '', // 添加总结说明字段
    chartType: 'bar', // 默认柱状图
    colorScheme: '经典蓝',
    showLegend: true,
    showLabels: true
  }
  
  reportModules.value.push(newModule)
  editingModuleIndex.value = reportModules.value.length - 1
}

const editModule = (index) => {
  if (editingModuleIndex.value === index) {
    // 完成编辑
    editingModuleIndex.value = -1
  } else {
    // 开始编辑
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

const onModuleTypeChange = (module) => {
  // 当模块类型改变时，可以设置默认的图表类型
  if (module.type && !module.chartType) {
    module.chartType = 'bar'
  }
}

const getModuleTypeName = (typeId) => {
  const moduleType = availableModuleTypes.find(type => type.id === typeId)
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

// 当报告被选择时
const onReportSelected = () => {
  if (selectedReportIndex.value === '') {
    isReportLoaded.value = false
  }
}

// 加载报告内容并转换为模块
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
  
  // 将报告内容转换为模块
  const newModules = []
  
  // 1. 综合评价模块
  if (reportContent.evaluation) {
    newModules.push({
      id: `module_evaluation_${Date.now()}`,
      name: '综合评价',
      type: 'teaching-experience', // 默认类型
      description: '来自AI分析报告的综合评价',
      summary: reportContent.evaluation,
      chartType: 'none',
      colorScheme: '经典蓝',
      showLegend: true,
      showLabels: true,
      source: 'report',
      sourceType: 'evaluation'
    })
  }
  
  // 2. 详细分析模块（每个分析项一个模块）
  if (reportContent.analysis && Array.isArray(reportContent.analysis)) {
    reportContent.analysis.forEach((analysisItem, index) => {
      newModules.push({
        id: `module_analysis_${Date.now()}_${index}`,
        name: analysisItem.title || `分析项${index + 1}`,
        type: 'workload-stats', // 默认类型
        description: `来自AI分析报告的${analysisItem.title}`,
        summary: analysisItem.content,
        chartType: 'bar',
        colorScheme: colorSchemes[index % colorSchemes.length].name,
        showLegend: true,
        showLabels: true,
        source: 'report',
        sourceType: 'analysis',
        originalTitle: analysisItem.title
      })
    })
  }
  
  // 3. 总结模块
  if (reportContent.summary) {
    newModules.push({
      id: `module_summary_${Date.now()}`,
      name: '总结',
      type: 'teaching-experience',
      description: '来自AI分析报告的总结',
      summary: reportContent.summary,
      chartType: 'none',
      colorScheme: '经典蓝',
      showLegend: true,
      showLabels: true,
      source: 'report',
      sourceType: 'summary'
    })
  }
  
  // 4. 建议模块
  if (reportContent.suggestions) {
    newModules.push({
      id: `module_suggestions_${Date.now()}`,
      name: '发展建议',
      type: 'teaching-experience',
      description: '来自AI分析报告的发展建议',
      summary: reportContent.suggestions,
      chartType: 'none',
      colorScheme: '优雅紫',
      showLegend: true,
      showLabels: true,
      source: 'report',
      sourceType: 'suggestions'
    })
  }
  
  // 将新模块添加到现有模块列表中（不覆盖已有模块）
  reportModules.value.push(...newModules)
  
  // 标记报告已加载
  isReportLoaded.value = true
  
  // 自动展开第一个新添加的模块进行编辑
  if (newModules.length > 0) {
    const firstNewModuleIndex = reportModules.value.length - newModules.length
    editingModuleIndex.value = firstNewModuleIndex
  }
}

const previewReport = () => {
  if (!canPreview.value) return
  
  const reportData = {
    name: reportForm.name,
    modules: reportModules.value,
    createdAt: new Date().toISOString()
  }
  
  // 将报告数据存储到 localStorage 供预览页面使用
  localStorage.setItem('previewReportData', JSON.stringify(reportData))
  
  // 在新标签页打开预览页面
  const previewUrl = '/report-preview'
  window.open(previewUrl, '_blank')
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
  gap: 16px;
}

.module-item {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.module-item:hover {
  border-color: #d1d5db;
}

/* 更新模块头部样式 */
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
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

.summary-textarea {
  height: 200px;
  resize: vertical;
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
  margin-top: 8px;
}

.summary-preview {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  font-style: italic;
}

.preview-content {
  color: #6b7280;
  line-height: 1.6;
}

.preview-description {
  margin: 0 0 12px 0;
  font-style: italic;
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
  gap: 12px;
  align-items: center;
}

.report-selector .form-select {
  flex: 1;
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
</style>
