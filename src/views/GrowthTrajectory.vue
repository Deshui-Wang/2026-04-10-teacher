<template>
  <div class="growth-trajectory-page">
    <div class="chart-card semester-progress-card">
      <h3>成长轨迹线路图 <span class="achievement-time">达成当前职称用时：3.8年</span></h3>
      <div class="growth-timeline">
        <div class="growth-track">
          <div
            v-for="(stage, idx) in growthStages"
            :key="stage"
            class="growth-node"
            :class="{ active: idx === currentStageIndex, passed: idx < currentStageIndex }"
            :style="{ left: (idx / (growthStages.length - 1)) * 100 + '%' }"
          >
            <div class="node-dot"></div>
            <div class="node-label">{{ stage }}</div>
            <div v-if="idx === currentStageIndex" class="current-title">
              当前职称：{{ currentTitle }}
            </div>
          </div>
          <div
            class="growth-fill"
            :style="{ width: (currentStageIndex / (growthStages.length - 1)) * 100 + '%' }"
          ></div>
          <!-- 突破期到成熟期的成长线段 -->
          <div
            class="growth-segment"
            :style="{
              left: (currentStageIndex / (growthStages.length - 1)) * 100 + '%',
              width: (1 / (growthStages.length - 1)) * 100 + '%'
            }"
          ></div>
          <!-- 成熟期到传承期的灰色线段 -->
          <div
            class="growth-segment-gray"
            :style="{
              left: (4 / (growthStages.length - 1)) * 100 + '%',
              width: (3 / (growthStages.length - 1)) * 100 + '%'
            }"
          ></div>
          <!-- 成长缓慢气泡 -->
          <div
            class="growth-bubble"
            :style="{ left: (currentStageIndex / (growthStages.length - 1)) * 100 + 5 + '%' }"
          >
            现阶段成长缓慢,请加快步伐
          </div>
        </div>
      </div>
      
      <!-- 突破期详情 -->
      <div class="breakthrough-card">
        <h3>{{ breakthroughDetails.title }}</h3>
        <p class="breakthrough-description">{{ breakthroughDetails.description }}</p>
        <div class="milestones">
          <div v-for="milestone in breakthroughDetails.milestones" :key="milestone.title" class="milestone">
            <div class="milestone-title">{{ milestone.title }}</div>
            <div class="milestone-description">{{ milestone.description }}</div>
            <div class="milestone-status" :class="`status-${milestone.status}`">{{ milestone.status }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <!-- AI个性化成长建议 -->
      <div class="chart-card suggestions-card">
        <div class="card-header">
          <h3>AI个性化成长建议</h3>
          <div class="info-icon">i</div>
        </div>
        
        <div class="suggestions-section">
          <h4>短期目标 (1-3个月)</h4>
          <ul>
            <li v-for="suggestion in shortTermSuggestions" :key="suggestion.title">
              <div class="suggestion-icon">{{ suggestion.icon }}</div>
              <div class="suggestion-content">
                <h5>{{ suggestion.title }}</h5>
                <p>{{ suggestion.description }}</p>
              </div>
              <button class="btn btn-add">添加目标</button>
            </li>
          </ul>
        </div>

        <div class="suggestions-section">
          <h4>中期目标 (3-12个月)</h4>
          <ul>
            <li v-for="suggestion in midTermSuggestions" :key="suggestion.title">
              <div class="suggestion-icon">{{ suggestion.icon }}</div>
              <div class="suggestion-content">
                <h5>{{ suggestion.title }}</h5>
                <p>{{ suggestion.description }}</p>
              </div>
              <button class="btn btn-add">添加目标</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- 我的成长目标 -->
      <div class="chart-card goals-card">
        <div class="card-header">
          <h3>成长任务与目标</h3>
          <button class="btn btn-add" @click="goToEvaluationCenter">添加考评</button>
        </div>
        <ul>
          <li v-for="goal in myGoals" :key="goal.title" class="goal-item">
            <div class="goal-info">
              <span class="goal-title">{{ goal.title }}</span>
              <span class="goal-deadline">截止：{{ goal.deadline }}</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: goal.progress + '%' }" :class="{ completed: goal.progress === 100 }"></div>
              <span class="progress-text" v-if="goal.progress < 100">{{ goal.progress }}%</span>
              <div class="progress-check" v-else>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>
            <div class="goal-actions">
              <button class="btn btn-update">更新进度</button>
              <button class="btn btn-delete">删除</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToEvaluationCenter = () => {
  router.push('/ai');
};

// 成长轨迹数据
const growthStages = [
  '起步期', '立足期', '发展期', '突破期', '成熟期', '引领期', '卓越期', '传承期'
];
const currentStageIndex = 3; // 突破期
const currentTitle = '副教授';

const breakthroughDetails = ref({
  title: '突破期（当前）',
  description: '您正处于青年教师发展的黄金时期, 也是压力最大的阶段。在“非升即走”的背景下, 教师需要在教学和科研上都取得显著成果, 形成自己的特色。关注成长目标，定向有节奏的提升',
  milestones: [
    { title: '形成稳定的课程体系', description: '能够承担多门课程的教学任务, 并开始参与课程建设、教材编写或教学改革项目, 形成相对成熟和有个人特色的教学风格。', status: '已达标' },
    { title: '主持省部级以上项目', description: '在完成青年项目的基础上, 成功获批更高层次的科研项目, 如国家自然科学基金面上项目、国家社会科学基金一般项目或其他省部级重点项目。', status: '进行中' },
    { title: '至少2名硕士生导师', description: '获得硕士研究生招生资格, 开始独立指导研究生。这标志着教师开始组建自己的小型科研团队, 从“单打独斗”转向“团队作战”。', status: '重点关注' },
    { title: '获得教学或科研奖项', description: '在校级或以上的教学竞赛中获奖, 或科研成果获得省部级奖励。这是对其专业能力和学术水平的重要认可。', status: '进行中' },
    { title: '副教授破“五唯”综评', description: '通过学校职称晋升评审, 获得副高级职称。评审标准日益综合化, 考察论文和项目数量(破“五唯”), 注重代表性成果的质量、教学水平、社会服务贡献以及“师德师风”表现。', status: '已达标' },
  ]
});

const shortTermSuggestions = ref([
  { icon: '📖', title: '开发数学思维训练教案集', description: '根据您的教学风格和优势, 建议您系统化开发一套数学思维训练教案, 形成个人特色教学资源。' },
  { icon: '📊', title: '提升教研组织能力', description: '作为教研组长, 建议您参加"教研团队建设与管理"培训, 提升团队协作效率。' },
  { icon: '💬', title: '学习新型互动教学法', description: '您的学生互动维度有提升空间, 建议学习"思维导图"等新型互动教学方法。' },
]);

const midTermSuggestions = ref([
  { icon: '📝', title: '申报市级教研课题', description: '基于您在数学思维培养方面的研究基础, 建议申报市级教研课题, 扩大研究影响力。' },
  { icon: '🔄', title: '组织跨学科教研活动', description: '尝试组织数学与物理、信息技术等学科的跨学科教研活动, 开发综合性学习任务。' },
]);

const myGoals = ref([
  { title: '完成"数学思维培养"校本课程开发', deadline: '2024-12-30', progress: 70 },
  { title: '申报市级优质课比赛', deadline: '2024-10-15', progress: 40 },
  { title: '发表教学论文2篇', deadline: '2025-06-30', progress: 25 },
  { title: '指导硕士研究生1名', deadline: '2025-2-31', progress: 50 },
  { title: '指导青年教师3名', deadline: '2025-1-31', progress: 100 },
]);

</script>

<style scoped>
.growth-trajectory-page {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  min-height: 100vh;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.semester-progress-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95));
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
  border: 1px solid rgba(255,255,255,0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  max-width: 1400px;
  margin: 0 auto;
}

.semester-progress-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #5856d6, #7e7eff, #34c759, #ff9500);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

.semester-progress-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
}

.semester-progress-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.achievement-time {
  font-size: 14px;
  font-weight: 500;
  color: #ff6b6b;
}

/* 成长轨迹样式 */
.growth-timeline {
  margin: 24px 0 0 0;
  position: relative;
  height: 86px;
}
.growth-track {
  position: relative;
  height: 66px;
  background: #e2ecfb;
  border-radius: 6px;
}
.growth-fill {
  position: absolute;
  top: 19px;
  left: 0;
  height: 6px;
  background: linear-gradient(90deg, #5856d6, #34c759);
  border-radius: 6px;
  z-index: 1;
}
.growth-node {
  position: absolute;
  top: 13px;
  transform: translateX(-50%);
  text-align: center;
  z-index: 2;
}
.growth-node .node-dot {
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #d1d5db;
  margin: 0 auto 4px auto;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(88,86,214,0.08);
  transition: background 0.3s;
}
.growth-node.active .node-dot {
  background: #fff;
  border-color: #34c759;
  box-shadow: 0 0 0 4px #34c75933;
}

.growth-node.active .node-dot::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34c759;
}

.growth-node.passed .node-dot {
  background: #34c759;
}
.growth-node .node-label {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  white-space: nowrap;
}
.growth-node.active .node-label {
  color: #5856d6;
  font-weight: 600;
}
.current-title {
  margin-top: 22px;
  font-size: 12px;
  color: #fff;
  background: #5856d6;
  border-radius: 3px;
  padding: 2px 10px;
  display: inline-block;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(88,86,214,0.08);
}

/* 成长线段样式 */
.growth-segment {
  position: absolute;
  top: 19px;
  height: 6px;
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  background-size: 100% 200%;
  border-radius: 6px;
  z-index: 1;
  animation: radiateGlow 3s ease-in-out infinite;
}

/* 成熟期到传承期的灰色线段样式 */
.growth-segment-gray {
  position: absolute;
  top: 19px;
  height: 6px;
  background: #d1d5db;
  border-radius: 6px;
  z-index: 1;
}

/* 成长缓慢气泡样式 */
.growth-bubble {
  position: absolute;
  top: -20px;
  transform: translateX(-50%);
  background: #fff;
  color: #ff6b6b;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  animation: bubbleFloat 3s ease-in-out infinite;
}

.growth-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #fff;
}

@keyframes radiateGlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes bubbleFloat {
  0% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -5px); }
  100% { transform: translate(-50%, 0); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Breakthrough Card */
.breakthrough-card {
  margin-top: 24px;
  background: rgba(248, 249, 255, 0.8);
  border-radius: 12px;
  padding: 24px;
}
.breakthrough-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #5856d6;
  margin-bottom: 8px;
  text-align: left;
}
.breakthrough-card .breakthrough-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eef2ff;
  text-align: left;
}
.milestones {
  display: block;
}
.milestone {
  display: grid;
  grid-template-columns: 150px 1fr auto;
  align-items: center;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid #eef2ff;
}
.milestone:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.milestone-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  text-align: left;
}
.milestone-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  text-align: left;
}

.milestone-status {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-已达标 {
  background-color: #e6f7f1;
  color: #26a872;
}
.status-进行中 {
  background-color: #eaf2ff;
  color: #5856d6;
}
.status-重点关注 {
  background-color: #fff4e6;
  color: #fa8c16;
}

/* Content Grid Layout */
.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  align-items: start;
  margin-top: 20px;
}

/* General Card adjustments */
.chart-card {
  height: 100%;
}

.content-grid .chart-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
}

/* Suggestions & Goals Cards */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-align: left;
}
.info-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #eef2ff;
  color: #5856d6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #dbe4ff;
}

.suggestions-section {
  margin-bottom: 24px;
}
.suggestions-section:last-child {
  margin-bottom: 0;
}
.suggestions-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  text-align: left;
}
.suggestions-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 16px;
}
.suggestions-card li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: #f8f9ff;
  padding: 12px;
  border-radius: 12px;
}
.suggestion-icon {
  font-size: 20px;
  width: 36px;
  height: 36px;
  background-color: #eef2ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.suggestion-content {
  flex-grow: 1;
}
.suggestion-content h5 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  text-align: left;
}
.suggestion-content p {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0;
  text-align: left;
}
.btn {
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.btn-add {
  background-color: #5856d6;
  color: white;
  margin-left: auto;
  align-self: center;
}
.btn-add:hover {
  background-color: #4c4ac2;
  box-shadow: 0 4px 12px rgba(88, 86, 214, 0.2);
}

/* Goals Card */
.goals-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 20px;
}
.goal-item {
  border-bottom: 1px solid #f0f2f5;
  padding-bottom: 16px;
}
.goal-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.goal-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.goal-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}
.goal-deadline {
  font-size: 12px;
  color: #999;
}
.progress-bar-container {
  width: 92%;
  height: 8px;
  background-color: #f0f2f5;
  border-radius: 4px;
  position: relative;
  margin-bottom: 12px;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #8280ff, #5856d6);
  border-radius: 4px;
  transition: width 0.5s ease;
}
.progress-bar.completed {
  background: #34c759;
}
.progress-text {
  position: absolute;
  right: -35px;
  top: -6px;
  font-size: 12px;
  font-weight: 500;
  color: #666;
}
.progress-check {
  position: absolute;
  right: -38px;
  top: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #34c759;
  display: flex;
  align-items: center;
  justify-content: center;
}
.goal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.btn-update {
  background-color: #eef2ff;
  color: #5856d6;
}
.btn-update:hover {
  background-color: #dbe4ff;
}
.btn-delete {
  background-color: #fff0f0;
  color: #ff6b6b;
}
.btn-delete:hover {
  background-color: #ffdddd;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style> 