<template>
  <div class="law-planning-page animate__animated animate__fadeIn">
    <!-- 头部：策划案主题 -->
    <div class="planning-header">
      <div class="header-content">
        <el-tag type="warning" effect="dark" class="planning-badge">精品课程策划案</el-tag>
        <h1 class="planning-title">《法律基础与AI法治实务》</h1>
        <p class="planning-subtitle">面向未来的跨学科法律教育创新方案</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" icon="el-icon-download">导出PDF</el-button>
        <el-button type="success" icon="el-icon-share">分享方案</el-button>
      </div>
    </div>

    <div class="planning-body">
      <!-- 侧边导航 -->
      <div class="side-nav">
        <div 
          v-for="nav in navItems" 
          :key="nav.id" 
          class="nav-item" 
          :class="{ active: activeNav === nav.id }"
          @click="activeNav = nav.id"
        >
          {{ nav.name }}
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-container">
        <!-- 1. 课程概述 -->
        <section v-if="activeNav === 'overview'" class="content-card">
          <h2 class="section-title">课程概述</h2>
          <div class="overview-grid">
            <div class="overview-info">
              <p>本课程旨在突破传统法律教育的“背诵模式”，结合AI时代背景，重点培养学生的法治思维及在数字化环境下的法律应用能力。</p>
              <div class="meta-tags">
                <span class="meta-tag">理论+实务</span>
                <span class="meta-tag">AI驱动</span>
                <span class="meta-tag">4.0学分</span>
              </div>
            </div>
            <div class="overview-stats">
              <div class="stat-box">
                <div class="stat-num">32</div>
                <div class="stat-label">理论学时</div>
              </div>
              <div class="stat-box">
                <div class="stat-num">16</div>
                <div class="stat-label">实训学时</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. 教学目标 -->
        <section v-if="activeNav === 'goals'" class="content-card">
          <h2 class="section-title">教学目标（三维模型）</h2>
          <div class="goals-grid">
            <div class="goal-item success">
              <h3>知识目标</h3>
              <p>掌握宪法、民法典等核心法律条文及AI法律监管前沿知识。</p>
            </div>
            <div class="goal-item primary">
              <h3>能力目标</h3>
              <p>能够熟练使用法律数据库，并能利用AI工具辅助起草法律文书。</p>
            </div>
            <div class="goal-item warning">
              <h3>素养目标</h3>
              <p>树立程序正义观念，培养严谨的法治精神与职业道德。</p>
            </div>
          </div>
        </section>

        <!-- 5. 法考专栏 (全景图还原) -->
        <section v-if="activeNav === 'exam-prep'" class="content-card exam-panorama">
          <h2 class="section-title">法考备考全景图</h2>
          
          <!-- 第一层：考试形式 -->
          <div class="exam-format-row">
            <div class="format-box objective">
              <h3>客观题（两卷）</h3>
              <p>试卷一：150分  试卷二：150分</p>
              <p>各卷时长 3 小时  机考单选/多选</p>
              <div class="pass-line">通过分数线约 108 分（每卷）</div>
            </div>
            <div class="arrow-connector">先通过 <i class="el-icon-right"></i></div>
            <div class="format-box subjective">
              <h3>主观题（一卷）</h3>
              <p>180分  时长 4 小时</p>
              <p>案例分析 + 法律文书</p>
              <div class="pass-line">通过分数线约 108 分</div>
            </div>
          </div>

          <!-- 第二层：核心学科 -->
          <h3 class="sub-section-title">核心学科分布（按难度与分值）</h3>
          <div class="subjects-grid">
            <div v-for="sub in examPrepData.subjects" :key="sub.name" class="subject-card" :style="{ background: sub.color }">
              <div class="sub-name">{{ sub.name }}</div>
              <div class="sub-meta">{{ sub.desc }} · {{ sub.weight }}</div>
            </div>
          </div>

          <!-- 第三层：四阶段路线 -->
          <h3 class="sub-section-title">备考四阶段路线</h3>
          <div class="roadmap-row">
            <div v-for="(stage, index) in examPrepData.stages" :key="index" class="roadmap-step-wrapper">
              <div class="roadmap-step" :style="{ background: stage.color, color: stage.textColor }">
                <div class="step-title">{{ stage.title }}</div>
                <div class="step-desc">{{ stage.desc }}</div>
                <div class="step-time">约 {{ stage.time }}</div>
              </div>
              <i v-if="index < 3" class="el-icon-right step-arrow"></i>
            </div>
          </div>

          <!-- 底部说明 -->
          <div class="prep-footer-info">
            <div class="info-line">参加资格：本科及以上学历（法学或非法学均可报考）</div>
            <div class="info-line">考试时间：客观题通常9月，主观题通常10月  总备考周期建议 10-18个月</div>
          </div>
          
          <div class="summary-tips">
            <div class="tip-box warning">全国通过率约 10-15%，属高难度资格考试</div>
            <div class="tip-box success">系统备考 + 正确方法 可大幅提升通过率</div>
          </div>
        </section>

        <!-- 6. 执行手册 (SOP) -->
        <section v-if="activeNav === 'manual'" class="content-card execution-manual">
          <h2 class="section-title">非法本考生备考执行手册</h2>
          
          <div class="manual-sub-title">1. 核心名师推荐包</div>
          <div class="teacher-matrix">
            <div v-for="t in manualData.teachers" :key="t.sub" class="teacher-card">
              <div class="teacher-sub">{{ t.sub }}</div>
              <div class="teacher-name">{{ t.name }}</div>
              <div class="teacher-tip">{{ t.tip }}</div>
            </div>
          </div>

          <div class="manual-sub-title">2. 三轮复习路线图</div>
          <div class="rounds-container">
            <div v-for="(round, index) in manualData.rounds" :key="index" class="round-item">
              <div class="round-header">
                <span class="round-tag">ROUND {{ index + 1 }}</span>
                <span class="round-days">{{ round.days }}</span>
              </div>
              <div class="round-content">
                <div class="round-title">{{ round.title }}</div>
                <div class="round-goal">目标：{{ round.goal }}</div>
                <ul class="round-tasks">
                  <li v-for="task in round.tasks" :key="task">{{ task }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="manual-sub-title">3. 给考生的最后叮嘱</div>
          <div class="final-tips">
            <div class="tip-card">
              <i class="el-icon-warning"></i>
              <div class="tip-text">第一遍听不懂是天经地义的，尤其是刑法因果和民法担保。别停，往下滚。</div>
            </div>
            <div class="tip-card">
              <i class="el-icon-edit"></i>
              <div class="tip-text">做题是检验听懂的唯一标准。把做题量提上去，量变引起质变。</div>
            </div>
            <div class="tip-card">
              <i class="el-icon-scissors"></i>
              <div class="tip-text">放弃的艺术：法制史、票据法等犄角旮旯知识性价比极低，可以直接放弃。</div>
            </div>
          </div>
        </section>

        <!-- 3. AI数字人方案 -->
        <section v-if="activeNav === 'ai-plan'" class="content-card ai-highlight">
          <h2 class="section-title">AI数字人集成方案</h2>
          <div class="ai-feature">
            <div class="ai-text">
              <h3>虚拟法官：智能交互实训</h3>
              <p>引入高保真数字人“大法官”，在模拟法庭环节与学生进行实时控辩互动。数字人能自动识别学生论点逻辑，并给出即时法律质询。</p>
              <ul class="feature-list">
                <li><i class="el-icon-check"></i> 7*24小时法律咨询服务</li>
                <li><i class="el-icon-check"></i> 沉浸式模拟法庭场景切换</li>
                <li><i class="el-icon-check"></i> 自动生成控辩能力报告</li>
              </ul>
            </div>
            <div class="ai-visual">
              <div class="placeholder-img">
                <i class="el-icon-user-solid"></i>
                <span>AI 数字讲师演示</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. 考核标准 -->
        <section v-if="activeNav === 'exam'" class="content-card">
          <h2 class="section-title">考核评价标准</h2>
          <el-table :data="examData" style="width: 100%">
            <el-table-column prop="item" label="考核项目" width="180"></el-table-column>
            <el-table-column prop="weight" label="权重" width="100"></el-table-column>
            <el-table-column prop="method" label="考核方式"></el-table-column>
          </el-table>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeNav = ref('overview')

const navItems = [
  { id: 'overview', name: '课程概述' },
  { id: 'goals', name: '教学目标' },
  { id: 'exam-prep', name: '法考全景' },
  { id: 'manual', name: '执行手册' },
  { id: 'ai-plan', name: 'AI数字人方案' },
  { id: 'exam', name: '考核标准' }
]

const manualData = {
  teachers: [
    { sub: '民法', name: '孟献贵/李建伟', tip: '体系感强，适合零基础' },
    { sub: '刑法', name: '柏浪涛', tip: '逻辑极强，案例模型经典' },
    { sub: '行政法', name: '李佳', tip: '通俗易懂，富有激情' },
    { sub: '民诉法', name: '戴鹏', tip: '流程图化解程序难点' },
    { sub: '刑诉法', name: '向高甲', tip: '口诀大王，记忆利器' },
    { sub: '商经知', name: '刘安琪', tip: '商业逻辑讲公司法' },
    { sub: '理论法', name: '马峰', tip: '总结深刻，减轻负担' },
    { sub: '三国法', name: '杨帆', tip: '考点精准，提分极快' }
  ],
  rounds: [
    { title: '第一轮：系统建构', days: '第1-70天', goal: '构建“知识图谱”，听完强化课', tasks: ['1.2倍速听课', '读教材复盘', '课后基础真题'] },
    { title: '第二轮：强化突破', days: '第71-130天', goal: '攻克重难点，向背诵科目倾斜', tasks: ['刷分科真题', '总结考法陷阱', '启动小三门背诵'] },
    { title: '第三轮：模拟冲刺', days: '第131-180天', goal: '全真机考模拟，疯狂背诵精华', tasks: ['全天模拟考', '错题本扫描', '考前三页纸'] }
  ]
}

const examPrepData = {
  stages: [
    { title: '阶段一：打基础', desc: '理论法 + 法律逻辑', time: '1-2个月', color: '#eef2ff', textColor: '#6366f1' },
    { title: '阶段二：攻核心', desc: '民法 + 刑法精讲', time: '3-4个月', color: '#fff1f2', textColor: '#f43f5e' },
    { title: '阶段三：扫其余', desc: '诉讼+行政+商法', time: '2-3个月', color: '#f0fdf4', textColor: '#22c55e' },
    { title: '阶段四：刷题冲刺', desc: '真题+模拟+主观', time: '1-2个月', color: '#fffbeb', textColor: '#f59e0b' }
  ],
  subjects: [
    { name: '民法', weight: '约20%分值', desc: '最重', color: '#5579ff' },
    { name: '刑法', weight: '约15%', desc: '难度最高', color: '#b91c1c' },
    { name: '行政法', weight: '约10%', desc: '实务热考', color: '#0369a1' },
    { name: '民诉法', weight: '约10%', desc: '程序重点', color: '#047857' },
    { name: '刑诉法', weight: '约10%', desc: '程序重点', color: '#92400e' },
    { name: '商法', weight: '约8%', desc: '公司/票据等', color: '#818cf8' },
    { name: '理论法学', weight: '法理/宪法', desc: '法制史', color: '#78716c' },
    { name: '经济法', weight: '约8%', desc: '劳动/税法等', color: '#4d7c0f' }
  ]
}

const examData = [
  { item: '平时作业', weight: '20%', method: 'AI知识库自动批改+互评' },
  { item: '模拟法庭', weight: '30%', method: '数字人法官实时评分' },
  { item: '法律文书', weight: '20%', method: 'AI逻辑合规性检测' },
  { item: '期末笔试', weight: '30%', method: '综合性案例分析' }
]
</script>

<style scoped>
.law-planning-page {
  padding: 30px;
  background: #fdfdfd;
  min-height: 100%;
}

.planning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #5579ff;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.planning-title {
  font-size: 32px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 10px 0;
}

.planning-subtitle {
  color: #64748b;
  font-size: 16px;
}

.planning-badge {
  letter-spacing: 1px;
  font-weight: 600;
}

.planning-body {
  display: flex;
  gap: 30px;
}

.side-nav {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  padding: 15px 20px;
  border-radius: 10px;
  cursor: pointer;
  color: #64748b;
  font-weight: 600;
  transition: all 0.3s;
  background: #f1f5f9;
}

.nav-item:hover, .nav-item.active {
  background: #5579ff;
  color: white;
  transform: translateX(5px);
}

.content-container {
  flex: 1;
}

.content-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  margin-bottom: 20px;
  border-left: 5px solid #5579ff;
  padding-left: 15px;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 40px;
}

.meta-tags {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.meta-tag {
  background: #eef2ff;
  color: #5579ff;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.overview-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-box {
  background: #f8fafc;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
}

.stat-num {
  font-size: 24px;
  font-weight: 800;
  color: #5579ff;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.goal-item {
  padding: 20px;
  border-radius: 15px;
  color: white;
}

.goal-item.success { background: linear-gradient(135deg, #10b981, #059669); }
.goal-item.primary { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.goal-item.warning { background: linear-gradient(135deg, #f59e0b, #d97706); }

.goal-item h3 { margin-top: 0; font-size: 16px; margin-bottom: 10px; }
.goal-item p { font-size: 13px; margin: 0; line-height: 1.5; opacity: 0.9; }

.ai-highlight {
  border: 2px solid #5579ff;
  background: #f8faff;
}

.ai-feature {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.feature-list li {
  margin-bottom: 10px;
  font-size: 14px;
  color: #475569;
}

.feature-list i {
  color: #10b981;
  margin-right: 10px;
  font-weight: bold;
}

.ai-visual {
  background: #e2e8f0;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #94a3b8;
  gap: 10px;
}

.placeholder-img i { font-size: 40px; }
/* 法考全景图样式 */
.exam-panorama {
  background: #fff;
}

.sub-section-title {
  text-align: center;
  font-size: 18px;
  color: #1e293b;
  margin: 40px 0 20px;
  font-weight: 800;
}

.exam-format-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.format-box {
  flex: 1;
  max-width: 380px;
  padding: 25px;
  border-radius: 16px;
  text-align: center;
}

.format-box.objective {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.format-box.subjective {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.format-box h3 {
  margin-top: 0;
  font-size: 20px;
  margin-bottom: 15px;
}

.format-box p {
  font-size: 14px;
  margin: 5px 0;
  opacity: 0.8;
}

.pass-line {
  margin-top: 15px;
  font-weight: 700;
  font-size: 14px;
}

.arrow-connector {
  color: #94a3b8;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 40px;
}

.subject-card {
  padding: 15px;
  border-radius: 12px;
  color: white;
  text-align: center;
}

.sub-name {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 4px;
}

.sub-meta {
  font-size: 11px;
  opacity: 0.9;
}

.roadmap-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 30px;
}

.roadmap-step-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
}

.roadmap-step {
  flex: 1;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
}

.step-title {
  font-weight: 800;
  font-size: 15px;
  margin-bottom: 8px;
}

.step-desc {
  font-size: 12px;
  margin-bottom: 5px;
}

.step-time {
  font-size: 11px;
  font-weight: 600;
}

.step-arrow {
  margin: 0 10px;
  color: #cbd5e1;
}

.prep-footer-info {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
  margin-bottom: 20px;
}

.info-line {
  margin: 5px 0;
}

.summary-tips {
  display: flex;
  gap: 20px;
}

.tip-box {
  flex: 1;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}

.tip-box.warning { background: #fff7ed; color: #9a3412; }
.tip-box.success { background: #f0fdf4; color: #15803d; }
/* 执行手册样式 */
.manual-sub-title {
  font-size: 18px;
  font-weight: 700;
  color: #334155;
  margin: 30px 0 20px;
  display: flex;
  align-items: center;
}

.manual-sub-title::before {
  content: '';
  width: 4px;
  height: 18px;
  background: #5579ff;
  margin-right: 10px;
  border-radius: 2px;
}

.teacher-matrix {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.teacher-card {
  background: #f8fafc;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: all 0.3s;
}

.teacher-card:hover {
  border-color: #5579ff;
  box-shadow: 0 4px 12px rgba(85, 121, 255, 0.1);
  transform: translateY(-3px);
}

.teacher-sub {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 5px;
}

.teacher-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.teacher-tip {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.4;
}

.rounds-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.round-item {
  display: flex;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

.round-header {
  width: 120px;
  background: #5579ff;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.round-tag {
  font-size: 12px;
  font-weight: 800;
  opacity: 0.8;
}

.round-days {
  font-size: 14px;
  font-weight: 700;
}

.round-content {
  padding: 20px 30px;
  flex: 1;
}

.round-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.round-goal {
  font-size: 14px;
  color: #5579ff;
  margin-bottom: 12px;
  font-weight: 600;
}

.round-tasks {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  gap: 20px;
}

.round-tasks li {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
}

.round-tasks li::before {
  content: '✓';
  color: #10b981;
  margin-right: 6px;
  font-weight: bold;
}

.final-tips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.tip-card {
  background: #fdf2f2;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.tip-card i {
  font-size: 20px;
  color: #ef4444;
}

.tip-text {
  font-size: 13px;
  color: #991b1b;
  line-height: 1.6;
}
</style>
