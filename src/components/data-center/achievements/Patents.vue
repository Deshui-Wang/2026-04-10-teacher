<template>
  <div class="patents-container">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索专利名称、专利号或申请人..."
            class="search-input"
          >
          <i class="search-icon">🔍</i>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <div class="section-header">
        <h2>专利：{{ filteredPatents.length }}</h2>
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
            <div class="col-patent-number">专利号</div>
            <div class="col-application-number">申请号</div>
            <div class="col-name">专利名称</div>
            <div class="col-field">技术领域</div>
            <div class="col-patentee">专利权人</div>
            <div class="col-applicant">申请人</div>
            <div class="col-inventor">发明/设计人</div>
            <div class="col-status">状态</div>
            <div class="col-protection">保护期限</div>
            <div class="col-agent">代理信息</div>
            <div class="col-docs">资料附件</div>
            <div class="col-upload">上传</div>
            <div class="col-action">操作</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="patent in filteredPatents" 
              :key="patent.id" 
              class="table-row"
            >
              <div class="col-patent-number">{{ patent.patentNumber }}</div>
              <div class="col-application-number">{{ patent.applicationNumber }}</div>
              <div class="col-name">{{ patent.name }}</div>
              <div class="col-field">{{ patent.technicalField }}</div>
              <div class="col-patentee">{{ patent.patentee }}</div>
              <div class="col-applicant">{{ patent.applicant }}</div>
              <div class="col-inventor">{{ patent.inventor }}</div>
              <div class="col-status">
                <span 
                  class="status-badge" 
                  :class="getStatusBadgeClass(patent.status)"
                >
                  {{ getStatusName(patent.status) }}
                </span>
              </div>
              <div class="col-protection">{{ patent.protectionPeriod }}</div>
              <div class="col-agent">{{ patent.agentInfo }}</div>
              <div class="col-docs">
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in patent.documents" 
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
                  @click="uploadDocument(patent)"
                >
                  上传
                </button>
              </div>
              <div class="col-action">
                <button 
                  class="view-btn-small" 
                  @click="viewPatent(patent)"
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
            v-for="patent in filteredPatents" 
            :key="patent.id" 
            class="patent-card"
          >
            <div class="card-header">
              <h3 class="patent-name">{{ patent.name }}</h3>
              <span 
                class="status-badge" 
                :class="getStatusBadgeClass(patent.status)"
              >
                {{ getStatusName(patent.status) }}
              </span>
            </div>
            
            <div class="card-content">
              <div class="info-row">
                <span class="label">专利号：</span>
                <span class="value">{{ patent.patentNumber }}</span>
              </div>
              <div class="info-row">
                <span class="label">申请号：</span>
                <span class="value">{{ patent.applicationNumber }}</span>
              </div>
              <div class="info-row">
                <span class="label">技术领域：</span>
                <span class="value">{{ patent.technicalField }}</span>
              </div>
              <div class="info-row">
                <span class="label">专利权人：</span>
                <span class="value">{{ patent.patentee }}</span>
              </div>
              <div class="info-row">
                <span class="label">申请人：</span>
                <span class="value">{{ patent.applicant }}</span>
              </div>
              <div class="info-row">
                <span class="label">发明/设计人：</span>
                <span class="value">{{ patent.inventor }}</span>
              </div>
              <div class="info-row">
                <span class="label">保护期限：</span>
                <span class="value">{{ patent.protectionPeriod }}</span>
              </div>
              <div class="info-row">
                <span class="label">代理信息：</span>
                <span class="value">{{ patent.agentInfo }}</span>
              </div>
              <div class="info-row">
                <span class="label">资料附件：</span>
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in patent.documents" 
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
                @click="uploadDocument(patent)"
              >
                上传资料
              </button>
              <button 
                class="view-btn-primary" 
                @click="viewPatent(patent)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredPatents.length === 0" class="empty-state">
          <div class="empty-icon">💡</div>
          <h3>暂无专利记录</h3>
          <p>您还没有添加任何专利信息</p>
        </div>
      </div>
    </div>

    <!-- 专利详情弹窗 -->
    <div v-if="showPatentModal" class="modal-overlay" @click="closePatentModal">
      <div class="modal-content patent-reader" @click.stop>
        <div class="modal-header">
          <div class="patent-header-info">
            <h3>{{ selectedPatent?.name }}</h3>
            <div class="patent-meta">
              <span class="meta-item">专利号：{{ selectedPatent?.patentNumber }}</span>
              <span class="meta-divider">|</span>
              <span class="meta-item">发明人：{{ selectedPatent?.inventor }}</span>
              <span class="meta-divider">|</span>
              <span class="meta-item">技术领域：{{ selectedPatent?.technicalField }}</span>
              <span class="meta-divider">|</span>
              <span 
                class="status-badge" 
                :class="getStatusBadgeClass(selectedPatent?.status)"
              >
                {{ getStatusName(selectedPatent?.status) }}
              </span>
            </div>
          </div>
          <button class="close-btn" @click="closePatentModal">×</button>
        </div>
        <div class="modal-body">
          <div class="patent-content">
            <!-- 摘要部分 -->
            <div class="patent-section">
              <h4 class="section-title">摘要</h4>
              <p class="section-content">{{ selectedPatent?.content?.abstract }}</p>
            </div>

            <!-- 技术问题 -->
            <div class="patent-section">
              <h4 class="section-title">技术问题</h4>
              <p class="section-content">{{ selectedPatent?.content?.technicalProblem }}</p>
            </div>

            <!-- 技术方案 -->
            <div class="patent-section">
              <h4 class="section-title">技术方案</h4>
              <p class="section-content">{{ selectedPatent?.content?.technicalSolution }}</p>
            </div>

            <!-- 有益效果 -->
            <div class="patent-section">
              <h4 class="section-title">有益效果</h4>
              <p class="section-content">{{ selectedPatent?.content?.beneficialEffects }}</p>
            </div>

            <!-- 权利要求 -->
            <div class="patent-section">
              <h4 class="section-title">权利要求</h4>
              <p class="section-content claims-content">{{ selectedPatent?.content?.claims }}</p>
            </div>

            <!-- 专利信息 -->
            <div class="patent-metadata">
              <div class="metadata-grid">
                <div class="metadata-item">
                  <span class="metadata-label">申请号：</span>
                  <span class="metadata-value">{{ selectedPatent?.applicationNumber }}</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">专利权人：</span>
                  <span class="metadata-value">{{ selectedPatent?.patentee }}</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">申请人：</span>
                  <span class="metadata-value">{{ selectedPatent?.applicant }}</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">保护期限：</span>
                  <span class="metadata-value">{{ selectedPatent?.protectionPeriod }}</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">代理信息：</span>
                  <span class="metadata-value">{{ selectedPatent?.agentInfo }}</span>
                </div>
              </div>
              
              <div class="patent-documents" v-if="selectedPatent?.documents?.length > 0">
                <strong>相关附件：</strong>
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in selectedPatent?.documents" 
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
          <h3>上传专利资料</h3>
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
const showPatentModal = ref(false)
const showDocumentModal = ref(false)
const showUploadModal = ref(false)
const selectedPatent = ref(null)
const selectedDocument = ref(null)
const selectedFiles = ref([])
const fileInput = ref(null)

// 专利状态映射
const statusMap = {
  'applied': '已申请',
  'under-review': '审查中',
  'granted': '已授权',
  'rejected': '已驳回',
  'expired': '已过期',
  'abandoned': '已放弃'
}

// 模拟专利数据
const patents = ref([
  {
    id: 1,
    patentNumber: 'ZL202410001234.5',
    applicationNumber: '202410001234.5',
    name: '一种基于人工智能的智能教学系统',
    technicalField: '人工智能',
    patentee: '某某大学',
    applicant: '某某大学',
    inventor: '张三, 李四, 王五',
    status: 'granted',
    protectionPeriod: '2024-01-15 至 2044-01-14',
    agentInfo: '北京某某专利代理事务所',
    description: '本发明公开了一种基于人工智能的智能教学系统，通过机器学习算法分析学生学习行为，提供个性化教学方案，提高教学效果。',
    image: '/pic/data.png',
    content: {
      abstract: '本发明涉及教育技术领域，特别是涉及一种基于人工智能的智能教学系统。该系统通过深度学习技术对学生的学习行为、作业完成情况、课堂互动数据等进行全面分析，建立学生个性化学习模型。系统能够自动识别学生的知识薄弱点，推荐适合的学习资源和练习题目，并根据学生学习进度动态调整教学难度。该系统还具备智能答疑功能，能够及时解答学生疑问，提供针对性的学习建议。本发明有效提高了教学效率和学习效果，促进了个性化教育的发展。',
      technicalProblem: '现有的教学系统大多采用统一的教学方案，无法满足不同学生的个性化学习需求。传统教学模式难以实时跟踪学生的学习状态，教师无法及时发现学生的知识薄弱环节。此外，大规模班级教学使得教师难以为每个学生提供个性化指导，导致学习效率低下。\n\n同时，现有的在线教育平台虽然提供了丰富的学习资源，但缺乏智能化的学习路径规划和个性化推荐功能。学生在海量的学习资源中难以找到最适合自己的内容，学习效果参差不齐。因此，迫切需要一种能够智能分析学生学习行为、提供个性化教学方案的智能教学系统。',
      technicalSolution: '本发明提供的智能教学系统包括数据采集模块、行为分析模块、个性化推荐模块和智能答疑模块。\n\n数据采集模块负责收集学生的学习行为数据，包括课堂出勤、作业完成情况、测验成绩、视频学习时长、互动次数等多维度数据。行为分析模块采用深度神经网络对收集的数据进行分析，建立学生知识图谱和学习能力模型。\n\n个性化推荐模块基于学生的学习模型，运用协同过滤算法和内容推荐算法，为每个学生推荐最适合的学习资源、练习题目和学习路径。系统会根据学生的实时学习反馈动态调整推荐策略，确保推荐内容始终符合学生当前的学习需求。\n\n智能答疑模块集成了自然语言处理技术，能够理解学生提出的问题，并从知识库中检索相关答案。对于复杂问题，系统会将问题转发给教师，并记录教师的解答以丰富知识库。',
      beneficialEffects: '本发明具有以下有益效果：\n\n1. 实现了真正的个性化教学，系统能够为每个学生量身定制学习方案，显著提高学习效率。通过智能分析，系统可以准确识别学生的知识薄弱点，有针对性地推荐学习内容。\n\n2. 减轻了教师的工作负担，系统自动完成大量的数据分析和个性化推荐工作，让教师有更多时间专注于教学内容设计和学生互动。\n\n3. 提升了学生的学习主动性，个性化的学习内容和及时的学习反馈增强了学生的学习兴趣和自信心。\n\n4. 系统采用模块化设计，易于扩展和维护。可以方便地添加新的功能模块或接入第三方教育资源平台。\n\n5. 通过大数据分析，系统能够发现教学过程中的普遍性问题，为教学改革提供数据支持。',
      claims: '1. 一种基于人工智能的智能教学系统，其特征在于，包括：数据采集模块、行为分析模块、个性化推荐模块和智能答疑模块；\n\n2. 根据权利要求1所述的智能教学系统，其特征在于，所述数据采集模块用于收集学生的多维度学习行为数据；\n\n3. 根据权利要求1所述的智能教学系统，其特征在于，所述行为分析模块采用深度学习技术建立学生个性化学习模型；\n\n4. 根据权利要求1所述的智能教学系统，其特征在于，所述个性化推荐模块基于学生学习模型提供定制化学习资源推荐；\n\n5. 根据权利要求1所述的智能教学系统，其特征在于，所述智能答疑模块集成自然语言处理技术实现智能问答。'
    },
    documents: [
      { name: '专利证书.pdf', size: '1.2MB', uploadTime: '2024-01-10' },
      { name: '专利申请文件.pdf', size: '2.1MB', uploadTime: '2024-01-12' }
    ]
  },
  {
    id: 2,
    patentNumber: 'ZL202310002345.6',
    applicationNumber: '202310002345.6',
    name: '一种虚拟现实教学设备',
    technicalField: '虚拟现实',
    patentee: '某某大学',
    applicant: '某某大学',
    inventor: '赵六, 孙七',
    status: 'under-review',
    protectionPeriod: '2023-06-20 至 2043-06-19',
    agentInfo: '上海某某知识产权代理有限公司',
    description: '本实用新型涉及一种虚拟现实教学设备，通过VR技术为学生提供沉浸式学习体验，适用于各种教学场景。',
    image: '/pic/data.png',
    content: {
      abstract: '本实用新型公开了一种虚拟现实教学设备，属于教育技术装备领域。该设备包括VR显示头盔、手势识别控制器、三维声场系统和中央处理单元。VR显示头盔采用高分辨率OLED屏幕，提供120度视场角的沉浸式视觉体验。手势识别控制器能够精确捕捉用户的手部动作，实现自然的人机交互。三维声场系统模拟真实的空间音效，增强沉浸感。中央处理单元负责渲染三维场景、处理交互逻辑。本实用新型可广泛应用于物理实验、化学演示、历史场景重现等多种教学场景，极大提升了教学的直观性和趣味性。',
      technicalProblem: '传统教学方式在演示抽象概念、危险实验、历史场景等内容时存在诸多局限。例如，物理和化学实验受限于实验室条件和安全因素，学生无法亲身体验某些高危实验。历史、地理等学科难以让学生身临其境地感受特定时代和场景。\n\n现有的多媒体教学设备虽然能够播放视频和图片，但缺乏交互性和沉浸感，学生仍然是被动接受信息。部分学校虽然引入了VR设备，但由于设备笨重、操作复杂、内容单一等问题，难以在日常教学中推广使用。因此，需要开发一种轻便易用、功能全面的虚拟现实教学设备。',
      technicalSolution: '本实用新型提供的虚拟现实教学设备包括以下组成部分：\n\nVR显示头盔采用轻量化设计，重量仅为300克，长时间佩戴不会产生疲劳感。内置双OLED屏幕，单眼分辨率达到2K，刷新率90Hz，有效减少眩晕感。头盔配备瞳距自动调节功能，适应不同用户。\n\n手势识别控制器采用红外光学追踪技术，能够精确捕捉手部六自由度运动。控制器表面设有触觉反馈装置，当用户在虚拟场景中触碰物体时能够感受到振动反馈，增强真实感。\n\n三维声场系统采用HRTF（头相关传递函数）技术，根据声源位置实时计算音频参数，让用户能够准确判断声音来源方向。系统内置降噪麦克风，支持语音交互功能。\n\n中央处理单元采用高性能GPU，能够流畅渲染复杂的三维场景。设备支持无线传输，摆脱数据线束缚。内置大容量电池，续航时间达到4小时。',
      beneficialEffects: '本实用新型具有以下有益效果：\n\n1. 提供沉浸式学习体验，学生可以在虚拟环境中亲身体验各种教学场景，显著提高学习兴趣和知识记忆效果。\n\n2. 突破了传统实验教学的限制，可以模拟高危险、高成本的实验，让学生在安全的环境中学习实验操作。\n\n3. 设备轻便易用，教师无需复杂培训即可上手操作。设备支持多人协同，可以实现班级集体VR教学。\n\n4. 支持丰富的教学内容，涵盖物理、化学、生物、历史、地理等多个学科。系统开放内容开发接口，教师可以根据教学需求定制VR教学内容。\n\n5. 采用人体工学设计，长时间使用不会造成不适。设备具有良好的兼容性，可以与现有的教学管理系统无缝对接。',
      claims: '1. 一种虚拟现实教学设备，其特征在于，包括：VR显示头盔、手势识别控制器、三维声场系统和中央处理单元；\n\n2. 根据权利要求1所述的虚拟现实教学设备，其特征在于，所述VR显示头盔采用双OLED屏幕，单眼分辨率2K，刷新率90Hz；\n\n3. 根据权利要求1所述的虚拟现实教学设备，其特征在于，所述手势识别控制器采用红外光学追踪技术，支持六自由度运动捕捉；\n\n4. 根据权利要求1所述的虚拟现实教学设备，其特征在于，所述三维声场系统采用HRTF技术实现空间音频效果；\n\n5. 根据权利要求1所述的虚拟现实教学设备，其特征在于，设备重量轻便，支持无线传输，续航时间不少于4小时。'
    },
    documents: [
      { name: '专利申请文件.pdf', size: '1.8MB', uploadTime: '2023-06-18' },
      { name: '技术交底书.docx', size: '1.5MB', uploadTime: '2023-06-22' }
    ]
  },
  {
    id: 3,
    patentNumber: 'ZL202210003456.7',
    applicationNumber: '202210003456.7',
    name: '一种在线教育平台的数据处理方法',
    technicalField: '计算机软件',
    patentee: '某某大学',
    applicant: '某某大学',
    inventor: '周八, 吴九, 郑十',
    status: 'granted',
    protectionPeriod: '2022-12-10 至 2042-12-09',
    agentInfo: '广州某某专利代理有限公司',
    description: '本发明公开了一种在线教育平台的数据处理方法，通过优化数据处理算法，提高平台运行效率，改善用户体验。',
    image: '/pic/data.png',
    content: {
      abstract: '本发明涉及在线教育平台技术领域，特别涉及一种在线教育平台的数据处理方法。该方法通过建立分布式数据处理架构，采用流式计算技术实时处理海量用户行为数据。系统引入智能缓存机制，根据数据访问频率和重要性动态调整缓存策略。针对用户查询请求，采用索引优化和查询重写技术，显著降低响应时间。该方法还集成了数据预处理模块，能够自动清洗异常数据、填补缺失值。本发明有效提升了在线教育平台的数据处理能力和响应速度，改善了用户体验，支持更大规模的并发访问。',
      technicalProblem: '随着在线教育的快速发展，教育平台的用户规模和数据量呈爆炸式增长。传统的数据处理方法面临诸多挑战：一是数据处理效率低下，用户访问高峰期系统响应缓慢，影响用户体验；二是数据存储和查询成本高昂，海量数据的存储和检索消耗大量计算资源；三是数据质量参差不齐，存在大量冗余、错误和缺失数据，影响数据分析的准确性。\n\n现有的在线教育平台多采用传统的关系数据库进行数据管理，在处理高并发请求时容易出现性能瓶颈。部分平台虽然引入了大数据技术，但缺乏针对教育场景的优化，无法充分发挥技术优势。因此，急需开发一种高效、可靠的在线教育平台数据处理方法。',
      technicalSolution: '本发明提供的数据处理方法包括以下关键技术：\n\n首先，构建分布式数据处理架构。采用微服务架构设计，将数据处理功能拆分为多个独立服务模块，包括数据采集服务、数据清洗服务、数据存储服务、数据查询服务等。各服务模块之间通过消息队列进行异步通信，实现松耦合。\n\n其次，引入流式计算引擎处理实时数据。用户行为数据（如视频观看记录、练习提交、互动评论等）通过Kafka消息队列实时传输到流式计算引擎。引擎采用滑动窗口技术对数据进行聚合计算，生成实时统计指标。\n\n第三，实现智能缓存策略。系统根据数据的访问频率、时效性、重要性等维度计算缓存优先级。热点数据自动加载到Redis缓存中，设置合理的过期时间。对于用户个性化数据，采用分布式缓存确保数据一致性。\n\n第四，优化数据库查询性能。建立多级索引结构，针对常用查询条件创建组合索引。采用查询重写技术，将复杂查询转换为多个简单查询的组合。对于分析类查询，采用列式存储和预聚合技术加速计算。',
      beneficialEffects: '本发明具有以下有益效果：\n\n1. 显著提升数据处理效率，系统能够支持百万级并发用户访问，用户请求响应时间从秒级降低到毫秒级。\n\n2. 降低了运营成本，通过智能缓存和查询优化，减少了数据库访问次数，降低了服务器负载和能耗。\n\n3. 提高了数据质量，自动化的数据清洗和校验机制确保了数据的准确性和完整性，为数据分析和决策提供可靠基础。\n\n4. 增强了系统的可扩展性，微服务架构使得系统能够灵活扩容，快速适应业务增长需求。\n\n5. 改善了用户体验，快速的系统响应和流畅的交互体验提升了用户满意度和平台粘性。',
      claims: '1. 一种在线教育平台的数据处理方法，其特征在于，包括：构建分布式数据处理架构、引入流式计算引擎、实现智能缓存策略、优化数据库查询性能；\n\n2. 根据权利要求1所述的数据处理方法，其特征在于，采用微服务架构设计，将数据处理功能拆分为独立服务模块；\n\n3. 根据权利要求1所述的数据处理方法，其特征在于，采用流式计算技术实时处理用户行为数据；\n\n4. 根据权利要求1所述的数据处理方法，其特征在于，根据数据访问频率和重要性动态调整缓存策略；\n\n5. 根据权利要求1所述的数据处理方法，其特征在于，通过索引优化和查询重写技术提升查询性能。'
    },
    documents: [
      { name: '专利证书.pdf', size: '1.5MB', uploadTime: '2022-12-08' }
    ]
  },
  {
    id: 4,
    patentNumber: 'ZL202410004567.8',
    applicationNumber: '202410004567.8',
    name: '一种智能批改系统',
    technicalField: '教育技术',
    patentee: '某某大学',
    applicant: '某某大学',
    inventor: '钱十一, 孙十二',
    status: 'applied',
    protectionPeriod: '2024-03-05 至 2044-03-04',
    agentInfo: '深圳某某知识产权代理事务所',
    description: '本实用新型涉及一种智能批改系统，通过OCR技术和自然语言处理，实现作业自动批改，减轻教师工作负担。',
    image: '/pic/data.png',
    content: {
      abstract: '本实用新型公开了一种智能批改系统，包括图像采集模块、OCR识别模块、答案分析模块和反馈生成模块。图像采集模块支持多种输入方式，可以拍照上传或扫描作业。OCR识别模块采用深度学习算法，能够准确识别手写文字、数学公式、图表等多种内容。答案分析模块集成了自然语言处理和知识图谱技术，能够理解学生答案的语义，进行智能评判。反馈生成模块不仅给出对错判断，还能分析错误原因，提供改进建议。系统支持语文、数学、英语等多个学科的作业批改，准确率达到95%以上。本实用新型大幅减轻了教师的批改工作量，让教师有更多时间关注学生的个性化辅导。',
      technicalProblem: '传统的作业批改方式完全依赖教师人工完成，存在诸多问题。首先，批改工作耗时费力，一个班级的作业批改往往需要数小时，占用教师大量时间。其次，人工批改容易出现疲劳导致的误判，特别是在批改大量作业时。第三，批改反馈不够及时，学生通常要等待一两天才能收到批改结果，影响学习进度。\n\n市面上虽然出现了一些自动批改工具，但功能较为单一，通常只能处理选择题等客观题型，对于主观题的批改能力有限。部分系统虽然引入了OCR技术，但识别准确率不高，特别是对手写文字和数学公式的识别效果不理想。因此，需要开发一种准确、高效、智能的作业批改系统。',
      technicalSolution: '本实用新型的智能批改系统包括以下技术方案：\n\n图像采集模块支持手机拍照、平板扫描、专用扫描仪等多种输入方式。模块内置图像预处理功能，能够自动矫正倾斜、去除噪声、增强对比度，提高后续识别准确率。\n\nOCR识别模块采用基于深度卷积神经网络的识别算法。针对印刷体文字，识别准确率达到99%；针对手写文字，通过训练包含数百万样本的模型，识别准确率达到95%。模块特别针对数学公式进行优化，能够识别分数、根号、积分等复杂符号，并转换为LaTeX格式。\n\n答案分析模块是系统的核心。对于客观题，系统直接与标准答案进行匹配。对于主观题，系统采用自然语言处理技术分析答案的语义。例如，在语文阅读理解题中，系统提取答案中的关键词和论述逻辑，与参考答案进行语义相似度计算。系统还集成了学科知识图谱，能够判断答案中的知识点是否正确。\n\n反馈生成模块根据分析结果生成详细的批改反馈。除了标注对错外，系统还会指出错误的具体位置，分析可能的错误原因，并提供改进建议和相关知识点链接。',
      beneficialEffects: '本实用新型具有以下有益效果：\n\n1. 大幅提升批改效率，系统能够在数秒内完成一份作业的批改，相比人工批改节省90%以上的时间。\n\n2. 确保批改的准确性和一致性，避免了人工批改中的主观偏差和疲劳误判，对所有学生采用统一的评判标准。\n\n3. 提供即时反馈，学生提交作业后可以立即获得批改结果，及时了解自己的学习情况，提高学习效率。\n\n4. 生成详细的学习分析报告，系统能够统计学生的知识点掌握情况、常见错误类型等，为教师的教学调整提供数据支持。\n\n5. 支持多学科应用，系统可以处理语文、数学、英语、物理、化学等多个学科的作业，具有广泛的适用性。',
      claims: '1. 一种智能批改系统，其特征在于，包括：图像采集模块、OCR识别模块、答案分析模块和反馈生成模块；\n\n2. 根据权利要求1所述的智能批改系统，其特征在于，所述OCR识别模块采用深度学习算法，支持手写文字和数学公式识别；\n\n3. 根据权利要求1所述的智能批改系统，其特征在于，所述答案分析模块集成自然语言处理和知识图谱技术；\n\n4. 根据权利要求1所述的智能批改系统，其特征在于，所述反馈生成模块提供错误分析和改进建议；\n\n5. 根据权利要求1所述的智能批改系统，其特征在于，系统支持多学科作业批改，准确率达到95%以上。'
    },
    documents: [
      { name: '专利申请文件.pdf', size: '2.3MB', uploadTime: '2024-03-01' },
      { name: '技术方案.docx', size: '1.1MB', uploadTime: '2024-03-03' }
    ]
  },
  {
    id: 5,
    patentNumber: 'ZL202110005678.9',
    applicationNumber: '202110005678.9',
    name: '一种多媒体教学设备',
    technicalField: '教育设备',
    patentee: '某某大学',
    applicant: '某某大学',
    inventor: '李十三, 王十四',
    status: 'expired',
    protectionPeriod: '2021-08-15 至 2024-08-14',
    agentInfo: '成都某某专利代理事务所',
    description: '本实用新型公开了一种多媒体教学设备，集成了投影、音响、交互等功能，为现代化教学提供便利。',
    image: '/pic/data.png',
    content: {
      abstract: '本实用新型公开了一种多媒体教学设备，包括投影显示单元、音频播放单元、交互输入单元和中央控制单元。投影显示单元采用激光投影技术，亮度达到5000流明，支持4K分辨率显示。音频播放单元配备立体声扬声器和无线麦克风系统，提供清晰的音频效果。交互输入单元支持触控笔书写、手势操作和语音控制多种交互方式。中央控制单元集成了Windows和Android双系统，兼容各种教学软件。设备采用一体化设计，安装简便，操作直观。本实用新型为现代化教学提供了功能齐全、性能优越的多媒体解决方案。',
      technicalProblem: '传统的多媒体教学设备存在诸多不足。首先，设备功能单一，需要配置多个独立设备（投影仪、音响、电子白板等），安装复杂，占用空间大。其次，不同设备之间的兼容性差，经常出现连接问题，影响教学进度。第三，操作复杂，教师需要学习多个设备的使用方法，增加了教学准备时间。\n\n市面上的多媒体教学设备虽然在逐步改进，但仍存在一些问题。部分一体机产品虽然集成了多种功能，但性能不够强大，无法流畅运行复杂的教学软件。一些高端产品虽然性能优越，但价格昂贵，普通学校难以承受。因此，需要开发一种功能全面、性能优越、价格合理的多媒体教学设备。',
      technicalSolution: '本实用新型提供的多媒体教学设备采用以下技术方案：\n\n投影显示单元采用激光光源，相比传统灯泡光源，亮度更高、色彩更鲜艳、寿命更长（可达20000小时）。投影镜头支持电动对焦和梯形校正，能够快速调整画面。设备支持短焦投影，在1米距离即可投射100寸画面，适合小教室使用。\n\n音频播放单元配备40W立体声扬声器，采用DSP音频处理技术，确保教室每个角落都能听到清晰的声音。设备内置无线麦克风接收器，支持4支麦克风同时使用，满足多人教学需求。音频单元还具有降噪和回声消除功能，提高语音清晰度。\n\n交互输入单元在投影表面覆盖红外触控框，支持20点触控，多人可以同时操作。配备专用触控笔，支持压感识别，书写流畅自然。设备还集成了摄像头和麦克风阵列，支持手势识别和语音控制功能。\n\n中央控制单元采用Intel酷睿i5处理器，配备8GB内存和256GB固态硬盘，运行流畅。系统预装了常用的教学软件，并支持安装第三方应用。设备提供丰富的接口，包括HDMI、USB、网络接口等，方便连接各种外部设备。',
      beneficialEffects: '本实用新型具有以下有益效果：\n\n1. 集成化设计简化了安装和使用，一台设备即可满足多媒体教学的所有需求，节省了教室空间和设备采购成本。\n\n2. 性能优越，激光投影技术提供明亮清晰的画面，即使在光线充足的教室也能正常使用。强大的处理器确保教学软件流畅运行。\n\n3. 交互功能丰富，支持触控、手写、手势、语音等多种交互方式，增强了课堂互动性，提升了教学效果。\n\n4. 操作简便，界面直观，教师无需专业培训即可上手使用。设备支持一键开关机，快速进入教学状态。\n\n5. 兼容性好，支持主流的教学软件和文件格式，可以方便地接入现有的教学资源库和管理系统。',
      claims: '1. 一种多媒体教学设备，其特征在于，包括：投影显示单元、音频播放单元、交互输入单元和中央控制单元；\n\n2. 根据权利要求1所述的多媒体教学设备，其特征在于，所述投影显示单元采用激光光源，亮度达到5000流明；\n\n3. 根据权利要求1所述的多媒体教学设备，其特征在于，所述音频播放单元配备立体声扬声器和无线麦克风系统；\n\n4. 根据权利要求1所述的多媒体教学设备，其特征在于，所述交互输入单元支持多点触控、手写和语音控制；\n\n5. 根据权利要求1所述的多媒体教学设备，其特征在于，所述中央控制单元集成双系统，兼容各种教学软件。'
    },
    documents: [
      { name: '专利证书.pdf', size: '1.8MB', uploadTime: '2021-08-10' }
    ]
  }
])

// 计算属性 - 过滤后的专利列表
const filteredPatents = computed(() => {
  let filtered = patents.value

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(patent => 
      patent.name.toLowerCase().includes(keyword) ||
      patent.patentNumber.toLowerCase().includes(keyword) ||
      patent.applicationNumber.toLowerCase().includes(keyword) ||
      patent.applicant.toLowerCase().includes(keyword) ||
      patent.inventor.toLowerCase().includes(keyword) ||
      patent.technicalField.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 方法
const getStatusName = (status) => {
  return statusMap[status] || '未知状态'
}

const getStatusBadgeClass = (status) => {
  const statusClassMap = {
    'applied': 'status-applied',
    'under-review': 'status-under-review',
    'granted': 'status-granted',
    'rejected': 'status-rejected',
    'expired': 'status-expired',
    'abandoned': 'status-abandoned'
  }
  return statusClassMap[status] || 'status-unknown'
}

const viewPatent = (patent) => {
  selectedPatent.value = patent
  showPatentModal.value = true
}

const closePatentModal = () => {
  showPatentModal.value = false
  selectedPatent.value = null
}

const viewDocument = (doc) => {
  selectedDocument.value = doc
  showDocumentModal.value = true
}

const closeDocumentModal = () => {
  showDocumentModal.value = false
  selectedDocument.value = null
}

const uploadDocument = (patent) => {
  selectedPatent.value = patent
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFiles.value = []
  selectedPatent.value = null
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
.patents-container {
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
  grid-template-columns: 1.5fr 1.5fr 2fr 1.2fr 1.5fr 1.5fr 1.5fr 1fr 1.5fr 1.5fr 2fr 0.8fr 0.8fr;
  gap: 12px;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
  font-size: 12px;
  min-width: 1800px;
}

.table-body {
  min-height: 200px;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 2fr 1.2fr 1.5fr 1.5fr 1.5fr 1fr 1.5fr 1.5fr 2fr 0.8fr 0.8fr;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background-color 0.2s ease;
  min-width: 1800px;
}

.table-row:hover {
  background: #f8fafc;
}

.col-patent-number,
.col-application-number {
  color: #6b7280;
  font-family: monospace;
  font-size: 11px;
}

.col-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 13px;
}

.col-field,
.col-patentee,
.col-applicant,
.col-inventor,
.col-protection,
.col-agent {
  color: #4b5563;
  font-size: 12px;
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
  font-size: 11px;
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
  font-size: 11px;
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

/* 状态标签样式 */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-applied {
  background: #dbeafe;
  color: #1e40af;
}

.status-under-review {
  background: #fef3c7;
  color: #92400e;
}

.status-granted {
  background: #dcfce7;
  color: #166534;
}

.status-rejected {
  background: #fee2e2;
  color: #dc2626;
}

.status-expired {
  background: #f3f4f6;
  color: #6b7280;
}

.status-abandoned {
  background: #f3f4f6;
  color: #6b7280;
}

.status-unknown {
  background: #f3f4f6;
  color: #6b7280;
}

/* 卡片视图 */
.card-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  padding: 24px;
}

.patent-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.patent-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.patent-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 12px;
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

.patent-reader {
  max-width: 1000px;
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

.patent-header-info {
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

.patent-meta {
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

.patent-content {
  padding: 32px 40px;
  background: white;
}

.patent-section {
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

.claims-content {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #0ea5e9;
}

.patent-metadata {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-top: 32px;
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

.patent-documents {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.patent-documents strong {
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
  .patents-container {
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
  
  .col-patent-number,
  .col-application-number,
  .col-field,
  .col-patentee,
  .col-applicant,
  .col-inventor,
  .col-protection,
  .col-agent {
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .col-status {
    margin-bottom: 8px;
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

  .patent-reader {
    width: calc(100vw - 40px);
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-header h3 {
    font-size: 18px;
  }

  .patent-meta {
    font-size: 12px;
  }

  .patent-content {
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

  .claims-content {
    padding: 16px;
  }
}
</style>
