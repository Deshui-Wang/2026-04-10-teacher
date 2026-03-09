<template>
  <div class="enterprise-cooperation-container">
    <div class="content-section">
      <!-- 统一在一行的筛选头部 -->
      <div class="section-header">
        <div class="stats-overview">
          <div 
            class="stat-item clickable-tab" 
            :class="{ 'tab-active': selectedTab === 'collaboration' }"
            @click="selectedTab = 'collaboration'"
          >
            <span class="stat-label">企业合作结果：</span>
            <span class="stat-value">{{ collaborationProjects.length }}</span>
          </div>
          <div 
            class="stat-item clickable-tab" 
            :class="{ 'tab-active': selectedTab === 'practice' }"
            @click="selectedTab = 'practice'"
          >
            <span class="stat-label">行业实践经历：</span>
            <span class="stat-value">{{ partTimeExperiences.length }}</span>
          </div>
          <div class="vertical-divider"></div>
          <div class="stat-item">
            <span class="stat-label">近半年兼职总时长：</span>
            <span class="stat-value highlight">{{ totalHoursLastSixMonths }} 小时</span>
          </div>
        </div>
        
        <div class="header-controls">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchKeyword" 
              :placeholder="selectedTab === 'collaboration' ? '搜索项目名称、企业或核心内容...' : '搜索企业名称、职位或工作内容...'"
              class="search-input"
            >
            <i class="search-icon">🔍</i>
          </div>
          <div class="view-toggle">
            <el-button-group>
              <el-button 
                :type="viewMode === 'list' ? 'primary' : ''" 
                @click="viewMode = 'list'"
                size="small"
              >
                列表
              </el-button>
              <el-button 
                :type="viewMode === 'card' ? 'primary' : ''" 
                @click="viewMode = 'card'"
                size="small"
              >
                卡片
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>

      <!-- 数据内容展示区域 -->
      <div class="content-area">
        <!-- 企业合作项目视图 -->
        <div v-show="selectedTab === 'collaboration'">
          <!-- 列表视图 -->
          <div v-if="viewMode === 'list'" class="list-view">
            <div class="table-header collaboration-grid">
              <div class="col-proj-name">项目名称</div>
              <div class="col-enterprise">合作企业</div>
              <div class="col-region">地区分布</div>
              <div class="col-core">核心内容</div>
              <div class="col-value">合作价值</div>
              <div class="col-action">操作</div>
            </div>
            
            <div class="table-body">
              <div 
                v-for="proj in filteredCollaborations" 
                :key="proj.id" 
                class="table-row collaboration-grid"
              >
                <div class="col-proj-name">{{ proj.name }}</div>
                <div class="col-enterprise">{{ proj.enterprise }}</div>
                <div class="col-region">{{ proj.region }}</div>
                <div class="col-core truncate" :title="proj.coreContent">{{ proj.coreContent }}</div>
                <div class="col-value truncate" :title="proj.value">{{ proj.value }}</div>
                <div class="col-action">
                  <button class="view-btn-small" @click="viewDetail(proj, 'collaboration')">查看</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 卡片视图 -->
          <div v-if="viewMode === 'card'" class="card-view">
            <div 
              v-for="proj in filteredCollaborations" 
              :key="proj.id" 
              class="data-card"
            >
              <div class="card-header">
                <h3 class="card-title">{{ proj.name }}</h3>
                <span class="region-badge">{{ proj.region }}</span>
              </div>
              <div class="card-content">
                <div class="info-row">
                  <span class="label">合作企业：</span>
                  <span class="value">{{ proj.enterprise }}</span>
                </div>
                <div class="info-row">
                  <span class="label">核心内容：</span>
                  <p class="summary-text">{{ proj.coreContent }}</p>
                </div>
                <div class="info-row">
                  <span class="label">取得成效：</span>
                  <p class="summary-text">{{ proj.achievements }}</p>
                </div>
              </div>
              <div class="card-footer">
                <button class="view-btn-primary" @click="viewDetail(proj, 'collaboration')">查看详情</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 行业实践经历视图 -->
        <div v-show="selectedTab === 'practice'">
          <!-- 列表视图 -->
          <div v-if="viewMode === 'list'" class="list-view">
            <div class="table-header practice-grid">
              <div class="col-enterprise">企业名称</div>
              <div class="col-position">所任职位</div>
              <div class="col-period">任职时间段</div>
              <div class="col-duration">经历时长</div>
              <div class="col-work">主要工作内容</div>
              <div class="col-action">操作</div>
            </div>
            
            <div class="table-body">
              <div 
                v-for="exp in filteredExperiences" 
                :key="exp.id" 
                class="table-row practice-grid"
              >
                <div class="col-enterprise">{{ exp.enterprise }}</div>
                <div class="col-position">{{ exp.position }}</div>
                <div class="col-period">{{ exp.period }}</div>
                <div class="col-duration">{{ exp.duration }} 小时</div>
                <div class="col-work truncate" :title="exp.workContent">{{ exp.workContent }}</div>
                <div class="col-action">
                  <button class="view-btn-small" @click="viewDetail(exp, 'practice')">查看</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 卡片视图 -->
          <div v-if="viewMode === 'card'" class="card-view">
            <div 
              v-for="exp in filteredExperiences" 
              :key="exp.id" 
              class="data-card"
            >
              <div class="card-header">
                <h3 class="card-title">{{ exp.enterprise }}</h3>
                <span class="position-badge">{{ exp.position }}</span>
              </div>
              <div class="card-content">
                <div class="info-row">
                  <span class="label">任职期间：</span>
                  <span class="value">{{ exp.period }}</span>
                </div>
                <div class="info-row">
                  <span class="label">兼职时长：</span>
                  <span class="value highlight">{{ exp.duration }} 小时</span>
                </div>
                <div class="info-row">
                  <span class="label">工作内容：</span>
                  <p class="summary-text">{{ exp.workContent }}</p>
                </div>
              </div>
              <div class="card-footer">
                <button class="view-btn-primary" @click="viewDetail(exp, 'practice')">查看详情</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="(selectedTab === 'collaboration' && filteredCollaborations.length === 0) || (selectedTab === 'practice' && filteredExperiences.length === 0)" class="empty-state">
          <div class="empty-icon">🤝</div>
          <h3>暂无相关记录</h3>
          <p>您还没有添加任何{{ selectedTab === 'collaboration' ? '企业合作项目' : '行业实践经历' }}信息</p>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="detailType === 'collaboration'" class="detail-container">
            <div class="detail-group">
              <label>合作企业</label>
              <div class="detail-value">{{ selectedDetail.enterprise }}</div>
            </div>
            <div class="detail-group">
              <label>地区分布</label>
              <div class="detail-value">{{ selectedDetail.region }}</div>
            </div>
            <div class="detail-group">
              <label>项目核心内容</label>
              <div class="detail-value rich-text">{{ selectedDetail.coreContent }}</div>
            </div>
            <div class="detail-group">
              <label>合作取得成效</label>
              <div class="detail-value rich-text">{{ selectedDetail.achievements }}</div>
            </div>
            <div class="detail-group">
              <label>实际价值与贡献</label>
              <div class="detail-value rich-text">{{ selectedDetail.value }}</div>
            </div>
          </div>

          <div v-else-if="detailType === 'practice'" class="detail-container">
            <div class="detail-group">
              <label>任职企业</label>
              <div class="detail-value">{{ selectedDetail.enterprise }}</div>
            </div>
            <div class="detail-group">
              <label>所任职位</label>
              <div class="detail-value">{{ selectedDetail.position }}</div>
            </div>
            <div class="detail-group">
              <label>任职时间段</label>
              <div class="detail-value">{{ selectedDetail.period }}</div>
            </div>
            <div class="detail-group">
              <label>总工时</label>
              <div class="detail-value">{{ selectedDetail.duration }} 小时</div>
            </div>
            <div class="detail-group">
              <label>主要工作内容</label>
              <div class="detail-value rich-text">{{ selectedDetail.workContent }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 基础状态
const selectedTab = ref('collaboration')
const searchKeyword = ref('')
const viewMode = ref('list')
const showDetailModal = ref(false)
const selectedDetail = ref(null)
const detailType = ref('')

// 模拟数据 - 企业合作项目
const collaborationProjects = ref([
  {
    id: 1,
    name: '“互联网+”现代农业智能监测系统产学研合作',
    enterprise: '广东海大集团股份有限公司',
    region: '华南地区（广东省）',
    coreContent: '利用机器视觉与传感器技术实现对水产养殖环境的实时监测与预警。',
    achievements: '项目成果获得省级农业创新奖，并已在12处养殖基地落地试行。',
    value: '为企业带来了30%的监测成本降低，为学校提供了5个校外实训岗位。'
  },
  {
    id: 2,
    name: '工业级机器人运动控制算法联合开发',
    enterprise: '深圳市大疆创新科技有限公司',
    region: '华南地区（深圳市）',
    coreContent: '针对复杂环境下多轴机械臂的轨迹规划与避障算法优化。',
    achievements: '成功申请发明专利2项，算法提升了机械臂抓取精度约15%。',
    value: '解决企业核心技术瓶颈，提升产品竞争力；学校获得专项科研经费200万元。'
  },
  {
    id: 3,
    name: '智慧城市交通流量预测模型咨询项目',
    enterprise: '北京百度网讯科技有限公司',
    region: '华北地区（北京市）',
    coreContent: '基于深度学习的大规模城市交通流时空演化模型构建。',
    achievements: '模型已集成至百度地图开放平台，预测准确率提升至92%。',
    value: '企业获得高质量决策支持；教师团队积累了大规模生产环境数据处理经验。'
  }
])

// 模拟数据 - 兼职经历
const partTimeExperiences = ref([
  {
    id: 1,
    enterprise: '腾讯科技（深圳）有限公司',
    position: '高级技术顾问',
    period: '2023-09-01 至 2024-02-28',
    duration: 480,
    workContent: '负责混合云架构下的数据安全体系评审与优化方案指导，协助解决海量请求下的安全防护性能瓶颈。'
  },
  {
    id: 2,
    enterprise: '上海商汤智能科技有限公司',
    position: '算法专家（兼职）',
    period: '2023-07-15 至 2023-12-31',
    duration: 320,
    workContent: '主导面向智慧医疗场景的医学图像标注算法研发，提升了标注软件的自动化水平和标注质量。'
  },
  {
    id: 3,
    enterprise: '科大讯飞股份有限公司',
    position: '语音合成研发顾问',
    period: '2024-01-10 至 至今',
    duration: 120,
    workContent: '参与多模态交互场景下的语音语调拟人化项目研发，提供最新的学术界情感识别模型框架参考。'
  }
])

// 统计逻辑
const totalHoursLastSixMonths = computed(() => {
  // 简单模拟统计逻辑，实际需根据当前日期筛选 period
  return 920 
})

// 搜索筛选逻辑 - 合作项目
const filteredCollaborations = computed(() => {
  if (!searchKeyword.value) return collaborationProjects.value
  const kw = searchKeyword.value.toLowerCase()
  return collaborationProjects.value.filter(p => 
    p.name.toLowerCase().includes(kw) || 
    p.enterprise.toLowerCase().includes(kw) ||
    p.coreContent.toLowerCase().includes(kw)
  )
})

// 搜索筛选逻辑 - 兼职经历
const filteredExperiences = computed(() => {
  if (!searchKeyword.value) return partTimeExperiences.value
  const kw = searchKeyword.value.toLowerCase()
  return partTimeExperiences.value.filter(e => 
    e.enterprise.toLowerCase().includes(kw) || 
    e.position.toLowerCase().includes(kw) ||
    e.workContent.toLowerCase().includes(kw)
  )
})

const modalTitle = computed(() => {
  if (detailType.value === 'collaboration') return '合作项目详情'
  return '实践经历详情'
})

// 方法
const viewDetail = (data, type) => {
  selectedDetail.value = data
  detailType.value = type
  showDetailModal.value = true
}

const closeModal = () => {
  showDetailModal.value = false
  selectedDetail.value = null
}
</script>

<style scoped>
.enterprise-cooperation-container {
  padding: 0;
}

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
  padding: 24px;
  border-bottom: 1px solid #e0e6f1;
  background: #f8f9ff;
}

.stats-overview {
  display: flex;
  align-items: center;
  gap: 24px;
}

.clickable-tab {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  border: 1px solid #e2e8f0;
}

.clickable-tab:hover {
  border-color: #3b82f6;
  background: #f0f7ff;
}

.tab-active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.tab-active .stat-label {
  color: rgba(255, 255, 255, 0.9);
}

.tab-active .stat-value {
  color: white;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.stat-value.highlight {
  color: #3b82f6;
}

.vertical-divider {
  width: 1px;
  height: 24px;
  background: #cbd5e1;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
  min-width: 320px;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

/* 列表视图布局 */
.collaboration-grid {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.2fr 1.8fr 1.5fr 80px;
  gap: 16px;
}

.practice-grid {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.8fr 1fr 2fr 80px;
  gap: 16px;
}

.table-header {
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.table-row {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 14px;
}

.table-row:hover {
  background: #f8fafc;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-anchor: middle;
  text-overflow: ellipsis;
}

/* 按钮样式 */
.view-btn-small {
  padding: 6px 12px;
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

/* 卡片视图 */
.card-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 24px;
}

.data-card {
  background: white;
  border: 1px solid #e1e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}

.region-badge, .position-badge {
  padding: 4px 10px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.summary-text {
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
  margin: 4px 0 0 0;
}

.card-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.view-btn-primary {
  width: 100%;
  padding: 10px;
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn-primary:hover {
  background: #3b82f6;
  color: white;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 600px;
  max-height: 85vh;
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  padding: 16px 24px;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.detail-group {
  margin-bottom: 20px;
}

.detail-group label {
  display: block;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.detail-value {
  color: #1e293b;
  font-size: 15px;
  line-height: 1.6;
}

.rich-text {
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
}

.empty-state {
  padding: 80px 0;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
</style>
