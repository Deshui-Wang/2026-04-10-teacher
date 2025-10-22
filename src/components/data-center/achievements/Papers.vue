<template>
  <div class="papers-container">
    <!-- 隐藏原来的筛选区域，因为现在由父组件统一管理 -->
    <!-- <div class="filter-section">
      <div class="filter-row">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索论文名称、作者或关键词..."
            class="search-input"
          >
          <i class="search-icon">🔍</i>
        </div>
      </div>
    </div> -->

    <!-- 内容区域 -->
    <div class="content-section">
      <div class="section-header">
        <h2>论文：{{ filteredPapers.length }}</h2>
        <div class="view-toggle">
          <el-button-group>
            <el-button 
              :type="viewMode === 'list' ? 'primary' : ''" 
              @click="viewMode = 'list'"
              size="small"
            >
              列表视图
            </el-button>
            <el-button 
              :type="viewMode === 'card' ? 'primary' : ''" 
              @click="viewMode = 'card'"
              size="small"
            >
              卡片视图
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 数据列表/卡片 -->
      <div class="content-area">
        <!-- 列表视图 -->
        <div v-if="viewMode === 'list'" class="list-view">
          <div class="table-header">
            <div class="col-name">论文名称</div>
            <div class="col-authors">作者</div>
            <div class="col-year">发表年份</div>
            <div class="col-publication">来源出版物</div>
            <div class="col-article-id">文章编号</div>
            <div class="col-docs">资料附件</div>
            <div class="col-upload">上传</div>
            <div class="col-action">操作</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="paper in filteredPapers" 
              :key="paper.id" 
              class="table-row"
            >
              <div class="col-name">{{ paper.title }}</div>
              <div class="col-authors">{{ paper.authors.join(', ') }}</div>
              <div class="col-year">{{ paper.publishYear }}</div>
              <div class="col-publication">{{ paper.publication }}</div>
              <div class="col-article-id">{{ paper.articleId }}</div>
              <div class="col-docs">
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in paper.documents" 
                    :key="index"
                    class="doc-item"
                    @click="viewDocument(doc)"
                  >
                    📄 {{ doc.name }}
                  </span>
                </div>
              </div>
              <div class="col-upload">
                <button 
                  class="upload-btn-small" 
                  @click="uploadDocument(paper)"
                >
                  上传
                </button>
              </div>
              <div class="col-action">
                <button 
                  class="view-btn-small" 
                  @click="viewPaper(paper)"
                >
                  查看
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片视图 -->
        <div v-if="viewMode === 'card'" class="card-view">
          <div 
            v-for="paper in filteredPapers" 
            :key="paper.id" 
            class="paper-card"
          >
            <div class="card-header">
              <h3 class="paper-title">{{ paper.title }}</h3>
              <span class="publish-year">{{ paper.publishYear }}</span>
            </div>
            
            <div class="card-content">
              <div class="info-row">
                <span class="label">作者：</span>
                <span class="value">{{ paper.authors.join(', ') }}</span>
              </div>
              <div class="info-row">
                <span class="label">来源出版物：</span>
                <span class="value">{{ paper.publication }}</span>
              </div>
              <div class="info-row">
                <span class="label">文章编号：</span>
                <span class="value">{{ paper.articleId }}</span>
              </div>
              <div class="info-row">
                <span class="label">资料附件：</span>
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in paper.documents" 
                    :key="index"
                    class="doc-item"
                    @click="viewDocument(doc)"
                  >
                    📄 {{ doc.name }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <button 
                class="upload-btn-primary" 
                @click="uploadDocument(paper)"
              >
                上传资料
              </button>
              <button 
                class="view-btn-primary" 
                @click="viewPaper(paper)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredPapers.length === 0" class="empty-state">
          <div class="empty-icon">📚</div>
          <h3>暂无论文记录</h3>
          <p>您还没有添加任何论文信息</p>
        </div>
      </div>
    </div>

    <!-- 论文详情弹窗 -->
    <div v-if="showPaperModal" class="modal-overlay" @click="closePaperModal">
      <div class="modal-content paper-reader" @click.stop>
        <div class="modal-header">
          <div class="paper-header-info">
            <h3>{{ selectedPaper?.title }}</h3>
            <div class="paper-meta">
              <span class="meta-item">{{ selectedPaper?.authors.join(', ') }}</span>
              <span class="meta-divider">|</span>
              <span class="meta-item">{{ selectedPaper?.publication }}</span>
              <span class="meta-divider">|</span>
              <span class="meta-item">{{ selectedPaper?.publishYear }}</span>
            </div>
          </div>
          <button class="close-btn" @click="closePaperModal">×</button>
        </div>
        <div class="modal-body">
          <div class="paper-content">
            <!-- 摘要部分 -->
            <div class="paper-section">
              <h4 class="section-title">摘要</h4>
              <p class="section-content">{{ selectedPaper?.abstract }}</p>
              <div class="keywords">
                <strong>关键词：</strong>
                <span 
                  v-for="(keyword, index) in selectedPaper?.keywords" 
                  :key="index"
                  class="keyword-tag"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>

            <!-- 引言部分 -->
            <div class="paper-section">
              <h4 class="section-title">1. 引言</h4>
              <p class="section-content">{{ selectedPaper?.content?.introduction }}</p>
            </div>

            <!-- 研究方法部分 -->
            <div class="paper-section">
              <h4 class="section-title">2. 研究方法</h4>
              <p class="section-content">{{ selectedPaper?.content?.methodology }}</p>
            </div>

            <!-- 研究结果部分 -->
            <div class="paper-section">
              <h4 class="section-title">3. 研究结果与分析</h4>
              <p class="section-content">{{ selectedPaper?.content?.results }}</p>
            </div>

            <!-- 结论部分 -->
            <div class="paper-section">
              <h4 class="section-title">4. 结论与展望</h4>
              <p class="section-content">{{ selectedPaper?.content?.conclusion }}</p>
            </div>

            <!-- 论文信息 -->
            <div class="paper-section paper-metadata">
              <h4 class="section-title">论文信息</h4>
              <div class="metadata-grid">
                <div class="metadata-item">
                  <span class="metadata-label">DOI：</span>
                  <span class="metadata-value">{{ selectedPaper?.doi }}</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">文章编号：</span>
                  <span class="metadata-value">{{ selectedPaper?.articleId }}</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">卷期信息：</span>
                  <span class="metadata-value">第{{ selectedPaper?.volume }}卷 第{{ selectedPaper?.issue }}期</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">页码：</span>
                  <span class="metadata-value">{{ selectedPaper?.pages }}</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">ISBN/ISSN：</span>
                  <span class="metadata-value">{{ selectedPaper?.isbnIssn }}</span>
                </div>
              </div>
              
              <!-- 附件下载 -->
              <div v-if="selectedPaper?.documents.length > 0" class="paper-documents">
                <strong>相关附件：</strong>
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in selectedPaper?.documents" 
                    :key="index"
                    class="doc-item"
                    @click="viewDocument(doc)"
                  >
                    📄 {{ doc.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文档查看弹窗 -->
    <div v-if="showDocumentModal" class="modal-overlay" @click="closeDocumentModal">
      <div class="modal-content document-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedDocument?.name }}</h3>
          <button class="close-btn" @click="closeDocumentModal">×</button>
        </div>
        <div class="modal-body">
          <div class="document-viewer">
            <div class="document-info">
              <p><strong>文件名：</strong>{{ selectedDocument?.name }}</p>
              <p><strong>文件大小：</strong>{{ selectedDocument?.size }}</p>
              <p><strong>上传时间：</strong>{{ selectedDocument?.uploadTime }}</p>
            </div>
            <div class="document-preview">
              <div class="preview-placeholder">
                <div class="preview-icon">📄</div>
                <p>{{ selectedDocument?.name }}</p>
                <button class="download-btn" @click="downloadDocument(selectedDocument)">
                  下载文档
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传弹窗 -->
    <div v-if="showUploadModal" class="modal-overlay" @click="closeUploadModal">
      <div class="modal-content upload-modal" @click.stop>
        <div class="modal-header">
          <h3>上传论文资料</h3>
          <button class="close-btn" @click="closeUploadModal">×</button>
        </div>
        <div class="modal-body">
          <div class="upload-area">
            <div class="upload-zone" @click="triggerFileInput">
              <div class="upload-icon">📁</div>
              <p>点击选择文件或拖拽文件到此处</p>
              <p class="upload-hint">支持 PDF、DOC、DOCX、JPG、PNG 格式</p>
            </div>
            <input 
              ref="fileInput" 
              type="file" 
              multiple 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              @change="handleFileSelect"
              style="display: none"
            >
          </div>
          <div class="uploaded-files" v-if="selectedFiles.length > 0">
            <h4>已选择文件：</h4>
            <div class="file-list">
              <div 
                v-for="(file, index) in selectedFiles" 
                :key="index"
                class="file-item"
              >
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <button class="remove-file-btn" @click="removeFile(index)">×</button>
              </div>
            </div>
          </div>
          <div class="upload-actions">
            <button class="cancel-btn" @click="closeUploadModal">取消</button>
            <button class="confirm-btn" @click="confirmUpload" :disabled="selectedFiles.length === 0">
              确认上传
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const searchKeyword = ref('')
const viewMode = ref('list')
const showPaperModal = ref(false)
const showDocumentModal = ref(false)
const showUploadModal = ref(false)
const selectedPaper = ref(null)
const selectedDocument = ref(null)
const selectedFiles = ref([])
const fileInput = ref(null)

// 模拟论文数据
const papers = ref([
  {
    id: 1,
    title: '基于深度学习的智能教学系统设计与实现',
    authors: ['张三', '李四', '王五'],
    publishYear: '2024',
    publication: '计算机教育',
    volume: '15',
    issue: '3',
    pages: '45-52',
    articleId: 'CE202403001',
    doi: '10.3969/j.issn.1672-5913.2024.03.001',
    isbnIssn: 'ISSN 1672-5913',
    abstract: '本文提出了一种基于深度学习的智能教学系统，通过分析学生学习行为数据，提供个性化学习建议，有效提升了教学效果和学习体验。',
    keywords: ['深度学习', '智能教学', '个性化学习', '教育技术'],
    image: '/pic/data.png',
    documents: [
      { name: '论文全文.pdf', size: '2.1MB', uploadTime: '2024-03-10' },
      { name: '实验数据.xlsx', size: '1.5MB', uploadTime: '2024-03-12' }
    ],
    content: {
      introduction: '随着人工智能技术的快速发展，深度学习在教育领域的应用越来越广泛。传统的教学系统往往采用"一刀切"的方式，难以满足不同学生的个性化学习需求。本研究旨在设计并实现一种基于深度学习的智能教学系统，通过分析学生的学习行为数据，为每位学生提供个性化的学习路径和资源推荐，从而提高教学效果和学习体验。\n\n本文的主要贡献包括：（1）提出了一种融合多模态学习数据的深度学习模型；（2）设计了个性化学习路径推荐算法；（3）开发了完整的智能教学系统原型；（4）通过实验验证了系统的有效性。',
      methodology: '本研究采用深度神经网络技术，构建了一个多层次的学生学习行为分析模型。首先，我们收集学生在学习过程中的各类数据，包括课程浏览记录、作业完成情况、测试成绩、学习时长等。然后，通过数据预处理和特征工程，提取关键的学习特征。\n\n我们设计了一个基于LSTM（长短期记忆网络）的序列模型来捕捉学生的学习轨迹和知识掌握程度的动态变化。同时，引入注意力机制来识别对学习效果影响最大的关键因素。在此基础上，我们构建了个性化推荐模块，能够根据学生当前的知识状态和学习偏好，推荐最适合的学习资源和练习题目。\n\n系统架构采用前后端分离的设计，前端使用Vue.js框架开发用户界面，后端基于Python Flask框架搭建API服务，深度学习模型使用TensorFlow框架实现。',
      results: '为了验证系统的有效性，我们在某高校的计算机专业课程中进行了为期一学期的实验。实验组（使用智能教学系统）包含120名学生，对照组（使用传统教学方式）包含115名学生。\n\n实验结果显示，使用智能教学系统的学生在期末考试中的平均成绩比对照组高出8.5分（p<0.01），且学习投入度和满意度也显著提高。具体而言，实验组学生的课程完成率达到92%，而对照组仅为78%。在学习效率方面，实验组学生平均学习时长减少了15%，但知识掌握程度更高。\n\n问卷调查结果显示，87%的学生认为个性化推荐功能对他们的学习有帮助，82%的学生表示愿意继续使用该系统。教师反馈也表明，系统提供的学习分析报告帮助他们更好地了解学生的学习状况，从而调整教学策略。',
      conclusion: '本研究成功设计并实现了一种基于深度学习的智能教学系统，通过个性化学习路径推荐和智能资源匹配，有效提升了教学效果和学习体验。实验结果证明了该系统的实用性和有效性。\n\n然而，本研究仍存在一些局限性。首先，当前系统主要针对计算机专业课程进行了优化，在其他学科领域的适用性还需进一步验证。其次，深度学习模型的训练需要大量的历史数据，对于新开设的课程可能面临冷启动问题。未来工作将致力于提高系统的通用性和适应性，并探索小样本学习等技术来解决数据不足的问题。\n\n总的来说，人工智能技术为教育创新提供了新的可能性，智能教学系统的发展将为实现真正的个性化教育铺平道路。'
    }
  },
  {
    id: 2,
    title: '虚拟现实技术在工程教育中的应用研究',
    authors: ['赵六', '孙七', '周八'],
    publishYear: '2023',
    publication: '高等工程教育研究',
    volume: '8',
    issue: '2',
    pages: '78-85',
    articleId: 'HEER202302001',
    doi: '10.3969/j.issn.1001-4233.2023.02.001',
    isbnIssn: 'ISSN 1001-4233',
    abstract: '本研究探讨了虚拟现实技术在工程教育中的应用，通过构建VR教学环境，显著提高了学生的实践能力和学习兴趣。',
    keywords: ['虚拟现实', '工程教育', '实践教学', 'VR技术'],
    image: '/pic/data.png',
    documents: [
      { name: '论文全文.pdf', size: '1.8MB', uploadTime: '2023-02-15' },
      { name: 'VR演示视频.mp4', size: '15.2MB', uploadTime: '2023-02-18' }
    ],
    content: {
      introduction: '工程教育强调实践能力的培养，但传统的实验教学往往受到设备、场地、安全等因素的限制。虚拟现实（VR）技术的出现为工程教育带来了新的可能性。通过VR技术，学生可以在虚拟环境中进行各种工程实践操作，既保证了安全性，又降低了成本。\n\n本研究聚焦于VR技术在机械工程、土木工程等专业教学中的应用，探索如何通过沉浸式学习体验提升学生的实践能力和学习兴趣。我们开发了一套完整的VR工程教学系统，并在实际教学中进行了应用验证。',
      methodology: '我们采用Unity3D引擎开发VR教学场景，使用HTC Vive和Oculus Quest等VR设备作为交互终端。系统包含三个核心模块：（1）虚拟实验室模块，提供各类工程设备的虚拟操作环境；（2）工程案例模拟模块，重现真实工程项目的施工过程；（3）协作学习模块，支持多人在虚拟空间中协同完成工程任务。\n\n在教学设计上，我们遵循"认知-实践-反思"的学习循环。学生首先通过VR场景了解工程原理，然后在虚拟环境中进行操作练习，最后通过系统记录的操作数据进行反思和改进。教师可以通过管理端实时监控学生的学习进度和操作表现，及时给予指导。',
      results: '我们在三所工科院校的6个专业班级中开展了为期两年的教学实践。使用VR教学系统的班级在实验操作技能考核中的平均得分比传统教学班级高出12.3分。更重要的是，学生对工程知识的理解深度和应用能力显著提升。\n\n问卷调查显示，93%的学生认为VR教学方式更加生动有趣，88%的学生表示通过VR实践更容易理解抽象的工程概念。在安全教育方面，VR模拟的事故场景让学生深刻认识到安全操作的重要性，事故隐患识别准确率提高了40%。\n\n此外，VR教学系统大幅降低了实验成本。传统的机械加工实验需要消耗大量原材料，而VR系统可以让学生无限次练习而无需任何材料成本。据统计，使用VR系统后，实验教学成本降低了约60%。',
      conclusion: '本研究证明了虚拟现实技术在工程教育中的巨大潜力。VR技术不仅能够提供安全、经济的实践环境，还能通过沉浸式体验增强学生的学习动机和效果。实验结果表明，VR教学在提升学生实践能力、降低教学成本、保障实验安全等方面具有显著优势。\n\n未来，我们将继续扩展VR教学内容库，涵盖更多工程领域和专业方向。同时，将探索VR与人工智能的结合，开发智能化的虚拟教学助手，为学生提供更加个性化的指导。随着VR设备的普及和5G网络的发展，虚拟现实必将在工程教育中发挥越来越重要的作用。'
    }
  },
  {
    id: 3,
    title: '人工智能驱动的个性化学习路径推荐算法',
    authors: ['吴九', '郑十', '钱十一'],
    publishYear: '2024',
    publication: '现代教育技术',
    volume: '34',
    issue: '1',
    pages: '23-30',
    articleId: 'MET202401001',
    doi: '10.3969/j.issn.1009-8097.2024.01.001',
    isbnIssn: 'ISSN 1009-8097',
    abstract: '本文提出了一种基于人工智能的个性化学习路径推荐算法，通过分析学习者的知识状态和学习偏好，为其推荐最优的学习路径。',
    keywords: ['人工智能', '个性化学习', '推荐算法', '学习路径'],
    image: '/pic/data.png',
    documents: [
      { name: '论文全文.pdf', size: '2.3MB', uploadTime: '2024-01-08' },
      { name: '算法实现代码.zip', size: '3.1MB', uploadTime: '2024-01-10' }
    ],
    content: {
      introduction: '在线学习平台的快速发展为学习者提供了海量的学习资源，但也带来了"选择困难"的问题。不同学习者的知识背景、学习能力和学习目标各不相同，如何为每个学习者规划最适合的学习路径成为一个重要挑战。\n\n本文提出了一种基于人工智能的个性化学习路径推荐算法（AI-PLPR），该算法综合考虑学习者的当前知识状态、学习风格、认知能力和学习目标，利用深度学习和强化学习技术，动态生成最优的学习序列。通过在真实在线学习平台上的实验验证，该算法显著提升了学习效率和学习效果。',
      methodology: '算法设计包含四个核心组件：（1）知识图谱构建模块，将课程内容组织为知识点网络，明确知识点之间的先修关系；（2）学习者建模模块，通过多维度数据分析刻画学习者画像；（3）路径生成模块，基于深度强化学习算法生成个性化学习序列；（4）动态调整模块，根据学习者的实时反馈持续优化推荐策略。\n\n我们采用知识追踪技术（Knowledge Tracing）来实时评估学习者对各知识点的掌握程度。推荐算法的核心是一个深度Q网络（DQN），将学习路径规划建模为马尔可夫决策过程。状态空间包含学习者的知识状态和学习历史，动作空间为可推荐的下一个学习资源，奖励函数设计综合考虑学习效果和学习效率。\n\n为了处理冷启动问题，我们引入了迁移学习机制，利用相似学习者的历史数据进行预训练。算法实现基于PyTorch框架，并在分布式环境下进行训练以处理大规模用户数据。',
      results: '我们在某大型在线教育平台上进行了为期三个月的A/B测试，实验组用户使用AI-PLPR算法推荐的学习路径，对照组用户使用平台的默认推荐算法。实验涉及超过10,000名学习者，涵盖编程、数学、外语等多个学科领域。\n\n结果显示，实验组用户的课程完成率提高了27%，学习时长缩短了18%，但测试成绩平均提高了11.5分。这表明AI-PLPR算法不仅提高了学习效率，还改善了学习效果。用户满意度调查显示，78%的实验组用户认为推荐的学习路径"非常符合个人需求"，显著高于对照组的45%。\n\n进一步的分析发现，算法对基础较弱的学习者帮助更大。对于知识掌握度在前30%的学习者，学习效率提升约15%；而对于后30%的学习者，学习效率提升达到35%。这说明个性化推荐在帮助"学困生"方面具有特殊价值。',
      conclusion: '本文提出的AI-PLPR算法成功实现了大规模个性化学习路径推荐，在真实应用场景中取得了显著效果。相比传统推荐方法，该算法能够更精准地把握学习者的个性化需求，提供更加科学合理的学习序列。\n\n研究的主要贡献在于：（1）建立了完整的学习路径推荐框架，融合了知识图谱、学习者建模和强化学习等多项技术；（2）提出了动态调整机制，使推荐系统能够持续学习和优化；（3）通过大规模实验验证了算法的有效性和实用性。\n\n未来工作将在以下几个方向展开：第一，引入更多维度的学习者特征，如情感状态、学习动机等；第二，探索多目标优化方法，在学习效果、学习效率和学习体验之间寻求更好的平衡；第三，研究群体学习场景下的协同路径推荐。随着人工智能技术的不断发展，个性化教育将真正走进现实。'
    }
  },
  {
    id: 4,
    title: '基于大数据的在线教育质量评估体系构建',
    authors: ['孙十二', '李十三'],
    publishYear: '2023',
    publication: '电化教育研究',
    volume: '44',
    issue: '6',
    pages: '67-74',
    articleId: 'EER202306001',
    doi: '10.3969/j.issn.1003-1553.2023.06.001',
    isbnIssn: 'ISSN 1003-1553',
    abstract: '本研究构建了基于大数据的在线教育质量评估体系，通过多维度数据分析，为在线教育平台提供科学的质量评估方法。',
    keywords: ['大数据', '在线教育', '质量评估', '教育评价'],
    image: '/pic/data.png',
    documents: [
      { name: '论文全文.pdf', size: '1.9MB', uploadTime: '2023-06-12' },
      { name: '评估指标体系.xlsx', size: '856KB', uploadTime: '2023-06-15' }
    ],
    content: {
      introduction: '在线教育的蓬勃发展为教育普及和教育公平带来了机遇，但质量参差不齐的问题也日益凸显。传统的教育质量评估方法主要依赖问卷调查和专家评审，难以全面、客观地反映在线教育的实际质量。大数据技术的应用为教育质量评估提供了新的视角和手段。\n\n本研究旨在构建一个基于大数据的在线教育质量评估体系，通过收集和分析学习行为数据、教学交互数据、学习成果数据等多维度信息，建立科学的质量评价模型。该体系不仅能够为教育管理者提供决策支持，还能帮助教师改进教学，指导学习者选择优质课程。',
      methodology: '评估体系包含五个维度：（1）课程内容质量，评估知识体系的完整性、内容的准确性和更新频率；（2）教学设计质量，考察课程结构、教学方法和学习活动的合理性；（3）平台技术质量，评价系统稳定性、交互体验和功能完善度；（4）学习支持服务，包括答疑响应、学习资源和技术支持；（5）学习成效，通过完成率、掌握度和应用能力综合评估。\n\n我们采用多源数据融合方法，从在线学习平台采集了包括用户注册信息、课程浏览记录、视频观看数据、作业提交情况、讨论区互动、测试成绩等在内的海量数据。利用大数据分析技术，包括关联规则挖掘、聚类分析、时间序列分析等方法，提取关键质量指标。\n\n在评价模型构建上，我们采用层次分析法（AHP）确定各指标权重，结合模糊综合评价方法处理定性指标，最终建立了包含32个一级指标、78个二级指标的评估体系。开发了自动化评估系统，能够实时监测和定期生成质量评估报告。',
      results: '我们与三家大型在线教育平台合作，对超过5000门课程进行了质量评估。评估结果显示，高质量课程（评分80分以上）占比约35%，中等质量课程（60-80分）占比45%，低质量课程（60分以下）占比20%。\n\n通过对比分析发现，高质量课程具有以下特征：视频时长控制在10-15分钟，知识点讲解清晰；课程设置了多样化的学习活动，包括测验、讨论、项目等；教师响应时间平均在2小时以内；学习资源丰富，包括讲义、代码、案例等。\n\n评估体系的应用产生了积极效果。某平台根据评估结果对低质量课程进行了改进，三个月后重新评估，课程质量平均提升了12分。学习者完成率从58%提高到73%，满意度评分从3.2提升到4.1（满分5分）。平台管理者表示，评估体系帮助他们科学识别问题课程，有针对性地进行改进。',
      conclusion: '本研究构建的基于大数据的在线教育质量评估体系，为在线教育质量监控和改进提供了科学、客观、可操作的方法。相比传统评估方式，该体系具有数据驱动、全面客观、实时动态等优势。\n\n研究创新点包括：（1）建立了多维度、多层次的质量评估指标体系；（2）提出了基于学习行为数据的质量评价方法；（3）开发了自动化评估系统，实现了质量监测的常态化。\n\n当然，本研究也存在一些局限。首先，某些教育质量的深层次问题，如批判性思维的培养、创新能力的提升等，难以通过量化指标全面反映。其次，不同学科领域的课程特点差异较大，统一的评估标准可能不够精准。\n\n未来研究将致力于完善评估体系，引入更多质性评价方法，开发学科专用的评估模型。同时，将探索利用人工智能技术进行智能化质量诊断，不仅识别质量问题，还能自动推荐改进方案。随着大数据和人工智能技术的深入应用，在线教育质量必将得到持续提升。'
    }
  },
  {
    id: 5,
    title: '混合式教学模式在计算机专业课程中的应用实践',
    authors: ['王十四', '张十五', '刘十六', '陈十七'],
    publishYear: '2024',
    publication: '计算机应用与软件',
    volume: '41',
    issue: '4',
    pages: '89-96',
    articleId: 'CAS202404001',
    doi: '10.3969/j.issn.1000-386X.2024.04.001',
    isbnIssn: 'ISSN 1000-386X',
    abstract: '本文探讨了混合式教学模式在计算机专业课程中的应用，通过线上线下相结合的方式，有效提升了教学效果和学生参与度。',
    keywords: ['混合式教学', '计算机专业', '教学模式', '教学实践'],
    image: '/pic/data.png',
    documents: [
      { name: '论文全文.pdf', size: '2.0MB', uploadTime: '2024-04-05' },
      { name: '教学案例集.docx', size: '1.2MB', uploadTime: '2024-04-08' }
    ],
    content: {
      introduction: '计算机专业课程具有理论性强、实践性强、知识更新快等特点，传统的课堂教学模式难以满足人才培养的需求。混合式教学（Blended Learning）融合了在线学习和面对面教学的优势，为计算机教育提供了新的解决方案。\n\n本文基于某高校计算机学院三年的教学改革实践，系统探讨了混合式教学模式的设计与实施。我们以"数据结构"、"操作系统"、"Web开发"等核心课程为例，构建了"线上自主学习+线下深度研讨+项目实践"的教学体系，通过实证研究验证了混合式教学在提升教学效果、培养实践能力、增强学习主动性等方面的显著优势。',
      methodology: '我们设计的混合式教学模式包含三个阶段：课前自主学习、课中深度学习、课后拓展实践。\n\n课前阶段，学生通过在线平台学习基础知识，包括观看微课视频、阅读电子教材、完成基础练习。教师通过学习数据分析了解学生的预习情况，识别共性问题和个性化需求，为课堂教学做准备。\n\n课中阶段，采用翻转课堂模式，将课堂时间用于深度学习活动。教师首先针对课前学习中的共性问题进行重点讲解，然后组织小组讨论、案例分析、协作编程等活动。例如，在"算法设计"课程中，学生分组讨论不同算法的优缺点，通过peer instruction提升理解深度。\n\n课后阶段，学生完成综合性项目任务，将所学知识应用于实际问题解决。教师提供在线答疑和代码审查服务。我们建立了项目库，包含从简单到复杂、从个人到团队的多层次项目任务。\n\n技术支撑方面，我们使用Moodle作为在线学习平台，GitHub管理代码项目，使用钉钉/腾讯会议进行在线讨论。开发了学习分析仪表板，帮助师生实时掌握学习进度和效果。',
      results: '三年的教学实践涉及15门课程、超过2000名学生。我们从多个维度评估了混合式教学的效果。\n\n学习成绩方面，使用混合式教学的班级期末考试平均成绩比传统教学班级高6.8分，且成绩分布更加集中，说明混合式教学有助于减小学生之间的差距。在编程实践能力测试中，混合式教学班级的优秀率（85分以上）达到42%，而传统教学班级仅为28%。\n\n学习参与度显著提升。在线学习平台数据显示，学生平均每周登录平台5.2次，视频完成率达到89%，讨论区互动次数是传统模式下的3倍以上。课堂观察记录显示，学生的课堂提问和讨论参与度明显提高。\n\n问卷调查结果显示，83%的学生认为混合式教学模式"更有利于知识理解和能力提升"，76%的学生表示"更喜欢这种教学方式"。学生特别认可的方面包括：学习时间更加灵活、可以按照自己的节奏学习、获得更多的实践机会、与老师和同学的互动更多。\n\n教师反馈也非常积极。多位教师表示，混合式教学让他们从"知识讲授者"转变为"学习促进者"，课堂教学更加有针对性，与学生的互动更加深入，教学成就感更强。',
      conclusion: '本研究通过三年的教学实践，证明了混合式教学模式在计算机专业课程中的有效性和可行性。该模式充分发挥了在线学习的灵活性和面对面教学的互动性，显著提升了教学效果和学生能力。\n\n成功经验总结如下：（1）精心设计线上线下学习活动，确保两者有机融合而非简单叠加；（2）重视学习数据分析，基于数据进行精准教学；（3）强化实践环节，通过项目驱动促进知识应用；（4）建立多元化评价体系，注重学习过程评价。\n\n实施混合式教学也面临一些挑战。首先是教师工作量增加，需要投入更多时间进行课程设计和学生指导。其次是优质在线资源的开发需要时间和经费支持。第三是部分学生的自主学习能力不足，需要更多的引导和监督。\n\n未来，我们将继续优化混合式教学模式，重点探索以下方向：（1）利用人工智能技术提供更加智能化的学习支持；（2）开发跨校共享的优质在线课程资源；（3）研究混合式教学在研究生教育中的应用；（4）建立混合式教学质量保障机制。混合式教学代表了高等教育教学改革的重要方向，必将在人才培养中发挥越来越重要的作用。'
    }
  }
])

// 计算属性 - 过滤后的论文列表
const filteredPapers = computed(() => {
  let filtered = papers.value

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(paper => 
      paper.title.toLowerCase().includes(keyword) ||
      paper.authors.some(author => author.toLowerCase().includes(keyword)) ||
      paper.publication.toLowerCase().includes(keyword) ||
      paper.keywords.some(kw => kw.toLowerCase().includes(keyword)) ||
      paper.abstract.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 方法
const viewPaper = (paper) => {
  selectedPaper.value = paper
  showPaperModal.value = true
}

const closePaperModal = () => {
  showPaperModal.value = false
  selectedPaper.value = null
}

const viewDocument = (doc) => {
  selectedDocument.value = doc
  showDocumentModal.value = true
}

const closeDocumentModal = () => {
  showDocumentModal.value = false
  selectedDocument.value = null
}

const uploadDocument = (paper) => {
  selectedPaper.value = paper
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFiles.value = []
  selectedPaper.value = null
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const confirmUpload = () => {
  // 这里可以添加上传逻辑
  console.log('上传文件:', selectedFiles.value)
  alert('文件上传成功！')
  closeUploadModal()
}

const downloadDocument = (doc) => {
  // 这里可以添加下载逻辑
  console.log('下载文档:', doc.name)
  alert(`正在下载 ${doc.name}`)
}

const handleImageError = (event) => {
  event.target.src = '/pic/data.png'
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.papers-container {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.search-box {
  position: relative;
  min-width: 400px;
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

/* 内容区域 */
.content-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e6f1;
  background: #f8f9ff;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.view-toggle {
  display: flex;
  gap: 4px;
}

/* 列表视图 */
.list-view {
  width: 100%;
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 3fr 2fr 0.8fr 1.8fr 1.2fr 2fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  min-width: 1200px;
}

.table-body {
  min-height: 200px;
}

.table-row {
  display: grid;
  grid-template-columns: 3fr 2fr 0.8fr 1.8fr 1.2fr 2fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background-color 0.2s ease;
  min-width: 1200px;
}

.table-row:hover {
  background: #f8fafc;
}

.col-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
}

.col-authors {
  color: #4b5563;
  font-size: 13px;
}

.col-year {
  color: #6b7280;
  font-size: 13px;
  text-align: center;
}

.col-publication {
  color: #4b5563;
  font-size: 13px;
}

.col-article-id {
  color: #4b5563;
  font-size: 12px;
  font-family: monospace;
}

/* 文档列表样式 */
.docs-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-item {
  display: inline-block;
  padding: 2px 6px;
  background: #e0f2fe;
  color: #0277bd;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-right: 4px;
  margin-bottom: 2px;
}

.doc-item:hover {
  background: #b3e5fc;
}

/* 按钮样式 */
.upload-btn-small {
  padding: 4px 8px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.upload-btn-small:hover {
  background: #059669;
}

.upload-btn-primary {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
  margin-right: 8px;
}

.upload-btn-primary:hover {
  background: #059669;
}

.view-btn-small {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.view-btn-small:hover {
  background: #2563eb;
}

.view-btn-primary {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.view-btn-primary:hover {
  background: #2563eb;
}

/* 卡片视图 */
.card-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  padding: 24px;
}

.paper-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.paper-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.paper-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 12px;
  line-height: 1.4;
}

.publish-year {
  background: #e0f2fe;
  color: #0277bd;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.card-content {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.label {
  color: #6b7280;
  min-width: 100px;
  margin-right: 8px;
}

.value {
  color: #374151;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #374151;
}

.empty-state p {
  font-size: 14px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.paper-reader {
  max-width: 1000px;
  width: 90vw;
}

.document-modal {
  max-width: 600px;
}

.upload-modal {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 32px;
  border-bottom: 2px solid #e2e8f0;
  background: linear-gradient(to bottom, #f8f9ff, #ffffff);
}

.paper-header-info {
  flex: 1;
  margin-right: 20px;
}

.modal-header h3 {
  margin: 0 0 12px 0;
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.paper-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.meta-item {
  color: #4b5563;
}

.meta-divider {
  color: #d1d5db;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;
}

.paper-content {
  padding: 32px 40px;
  background: white;
}

.paper-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0f2fe;
}

.section-content {
  font-size: 15px;
  line-height: 1.8;
  color: #374151;
  text-align: justify;
  white-space: pre-wrap;
  margin: 0;
}

.keywords {
  margin-top: 16px;
  padding: 12px 16px;
  background: #f0f9ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.keywords strong {
  color: #1f2937;
  font-size: 14px;
}

.keyword-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #0ea5e9;
  color: white;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.paper-metadata {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.metadata-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.metadata-label {
  font-weight: 500;
  color: #6b7280;
  min-width: 100px;
}

.metadata-value {
  color: #374151;
}

.paper-documents {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.paper-documents strong {
  color: #1f2937;
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
}

/* 文档查看器样式 */
.document-viewer {
  text-align: center;
}

.document-info {
  text-align: left;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.document-info p {
  margin: 8px 0;
  color: #374151;
}

.document-preview {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px;
  background: #f9fafb;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.preview-icon {
  font-size: 48px;
}

.download-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.download-btn:hover {
  background: #2563eb;
}

/* 文件上传区域样式 */
.upload-area {
  margin-bottom: 20px;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background: #f9fafb;
}

.upload-zone:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-hint {
  color: #6b7280;
  font-size: 12px;
  margin-top: 8px;
}

.uploaded-files {
  margin-bottom: 20px;
}

.uploaded-files h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.file-name {
  flex: 1;
  color: #374151;
  font-size: 14px;
}

.file-size {
  color: #6b7280;
  font-size: 12px;
  margin-right: 8px;
}

.remove-file-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file-btn:hover {
  background: #dc2626;
}

.upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-btn {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.confirm-btn:hover:not(:disabled) {
  background: #059669;
}

.confirm-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .papers-container {
    padding: 16px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
    max-width: none;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .view-toggle {
    justify-content: center;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
    min-width: auto;
  }
  
  .table-header {
    display: none;
  }
  
  .table-row {
    display: block;
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  .col-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .col-authors,
  .col-year,
  .col-publication,
  .col-article-id {
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .col-docs {
    margin-bottom: 8px;
  }
  
  .col-upload,
  .col-action {
    margin-bottom: 12px;
  }
  
  .card-view {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .card-footer {
    flex-direction: column;
    gap: 8px;
  }
  
  .modal-content {
    margin: 20px;
    max-width: calc(100vw - 40px);
  }

  .paper-reader {
    width: calc(100vw - 40px);
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-header h3 {
    font-size: 18px;
  }

  .paper-meta {
    font-size: 12px;
  }

  .paper-content {
    padding: 20px 16px;
  }

  .section-title {
    font-size: 16px;
  }

  .section-content {
    font-size: 14px;
    line-height: 1.7;
  }

  .metadata-grid {
    grid-template-columns: 1fr;
  }

  .keyword-tag {
    font-size: 12px;
    padding: 3px 10px;
  }
}
</style>
