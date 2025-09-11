<template>
  <div class="profile-content">
    <div class="avatar-section">
      <div class="avatar-container">
        <img :src="currentAvatar" alt="数字分身形象" class="avatar-image" />
        <div class="avatar-glow"></div>
      </div>
      <div class="avatar-info">
        <h3>
          数字分身
          <img 
            src="/pic/24gl.svg" 
            alt="切换图标" 
            class="switch-icon" 
            @click="openAvatarSelector"
          />
        </h3>
        <p>您的专属AI数字形象</p>
      </div>
    </div>

    <div class="right-panel">
      <div class="word-cloud-container">
        <div class="word-cloud-content">
          <span v-for="tag in wordCloudInfo.tags" :key="tag.text" class="word-cloud-tag" :style="{ '--tag-bg-color': tag.color }">
            {{ tag.text }}
          </span>
        </div>
      </div>
      <div class="info-cards-wrapper">
        <div class="info-card">
          <h4>{{ teacherInfo.title }}</h4>
          <ul>
            <li v-for="item in teacherInfo.details" :key="item.label">
              <span class="label">{{ item.label }}</span>
              <span class="value">{{ item.value }}</span>
            </li>
          </ul>
        </div>
        <div class="info-card activity-card">
          <h4>{{ teachingDevInfo.title }}</h4>
          <ul>
            <li v-for="(item, index) in teachingDevInfo.details" :key="index">
              <p>
                <span v-for="(part, partIndex) in item" :key="partIndex" :class="part.highlight ? `tag tag-${part.highlight}` : ''">
                  {{ part.text }}
                </span>
              </p>
            </li>
          </ul>
        </div>
        <div class="info-card activity-card">
          <h4>{{ aiCompetencyInfo.title }}</h4>
          <ul>
            <li v-for="(item, index) in aiCompetencyInfo.details" :key="index">
              <p>
                <span v-for="(part, partIndex) in item" :key="partIndex" :class="part.highlight ? `tag tag-${part.highlight}` : ''">
                  {{ part.text }}
                </span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <AbilityChart :chart-data="abilityChartData" />
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import AbilityChart from './AbilityChart.vue'

// 注入事件总线
const eventBus = inject('eventBus')

// 响应式数据
const currentAvatar = ref('/pic/body.png')
const teacherInfo = ref({
  title: '基础信息',
  details: [
    { label: '姓名', value: '张婉婷' },
    { label: '性别', value: '女' },
    { label: '年龄', value: '38岁' },
    { label: '星座', value: '巨蟹座' },
    { label: 'MBTI', value: 'ENFJ' },
    { label: '学历', value: '人工智能技术应用 - 硕士' },
    { label: '政治面貌', value: '党员' },
    { label: '职称', value: '副教授' },
    { label: '教龄', value: '10年+' }
  ]
})

const teachingDevInfo = ref({
  title: '教学发展活跃度',
  details: [
    [
      { text: '积极参加 '},
      { text: '党建活动 ', highlight: 'positive'  },
      { text: '7场'}
    ],
    [
      { text: '参加 '},
      { text: '学术培训', highlight: 'participate'},
      { text: '11场'}
    ],
    [
      { text: '受邀参与 '},
      { text: '校企合作项目 ' , highlight: 'count' },
      { text: ' 7个'},
    ],
    [
      { text: '组织参加 ' },
      { text: '企业实践项目', highlight: 'organize-participate' },
      { text: ' 3个' }
    ],
    [
      { text: '发表教学经验', highlight: 'publish' },
      { text: ' 超过17篇' }
    ],
    [
      { text: '收获 ' },
      { text: '教学评价 179', highlight: 'evaluation' },
      { text: '个，' },
      { text: '点赞 293', highlight: 'like' },
      { text: '个' }
    ],
    [
      { text: '带队 2场 ' },
      { text: '职业大赛', highlight: 'event' },
      { text: '，4名 ' },
      { text: '学员获奖', highlight: 'award' }
    ]
  ]
})

const aiCompetencyInfo = ref({
  title: '人工智能胜任力',
  details: [
    [
      { text: '年度使用智能工具种类 ' },
      { text: '超过7个', highlight: 'tool-count' },
      { text: '，平均 ' },
      { text: '71次/日', highlight: 'usage-frequency' },
      { text: '，其中针对智能结果 ' },
      { text: '再加工占比78%', highlight: 'reprocessing-rate' }
    ],
    [
      { text: '自主开发设计智能工具 ' },
      { text: '3个', highlight: 'dev-count' },
      { text: '，个人 ' },
      { text: '工效提升超过38%', highlight: 'efficiency-gain' },
      { text: '，' },
      { text: '用于教学并推行学生使用', highlight: 'teaching-application' }
    ],
    [
      { text: '上传 ' },
      { text: '教学元数据超过7万条', highlight: 'metadata-upload' },
      { text: '，并 ' },
      { text: '建模分析', highlight: 'modeling-analysis' },
      { text: ' 用于智能工具 ' },
      { text: '知识库复用', highlight: 'kb-reuse' }
    ]
  ]
})

const abilityChartData = ref({
  title: 'AI教学能力图谱',
  abilities: [
    {
      dimension: 'AI技术应用',
      score: 91,
      evidence: [
        '熟练应用超7种AI工具，日均使用71次',
        '自主研发3款教学智能体，提升个人工效38%',
        '将自研工具应用于教学，并推广给学生使用'
      ]
    },
    {
      dimension: '学生指导培养',
      score: 86,
      evidence: [
        '带队参加2场职业技能大赛，4名学生获奖',
        '累计收到179个学生教学评价和293个点赞',
        '深受学生好评，内部口碑高'
      ]
    },
    {
      dimension: '产学研合作',
      score: 72,
      evidence: [
        '深度参与7个校企合作项目',
        '组织学生参与3个企业一线实践项目',
        '紧跟行业发展，将前沿案例融入教学'
      ]
    },
    {
      dimension: '教学创新实践',
      score: 88,
      evidence: [
        '发表教学相关经验文章超过17篇',
        '积极参与11场学术培训，不断更新教学理念',
        '将数据建模分析成果复用于知识库，丰富教学资源'
      ]
    },
    {
      dimension: '数据素养与分析',
      score: 75,
      evidence: [
        '上传并管理超7万条个人教学元数据',
        '对教学数据进行建模与分析，驱动决策',
        '具备较强的数据资产保护意识'
      ]
    }
  ]
});

const wordCloudInfo = ref({
  tags: [
    { text: '业务骨干' },
    { text: '中坚力量' },
    { text: '学历有上升空间' },
    { text: '校内核心专业' },
    { text: '党政活动响应积极' },
    { text: '校企合作紧密' },
    { text: '个人经验发表较为频繁' },
    { text: '好评率4.9' },
    { text: '学生内口碑较高' },
    { text: '坚持人工智能以人为本原则' },
    { text: '熟练使用常见智能工具' },
    { text: '智能体狂热开发爱好者' },
    { text: '数据资产保护意识强' }
  ]
})

// Define a color palette for the word cloud tags
const colorPalette = [
  'rgba(169, 204, 227, 0.7)', // light blue
  'rgba(163, 228, 215, 0.7)', // mint
  'rgba(250, 215, 160, 0.7)', // light orange
  'rgba(215, 189, 226, 0.7)', // light purple
  'rgba(249, 231, 159, 0.7)', // light yellow
  'rgba(162, 217, 206, 0.7)', // light teal
  'rgba(245, 183, 177, 0.7)', // light pink
  'rgba(169, 223, 191, 0.7)', // light green
  'rgba(230, 176, 170, 0.7)'  // another light pink/red
];

// Function to get a random color from the palette
const getRandomColor = () => colorPalette[Math.floor(Math.random() * colorPalette.length)];

// Assign a random color to each tag
wordCloudInfo.value.tags = wordCloudInfo.value.tags.map(tag => ({
  ...tag,
  color: getRandomColor()
}));

// 头像选项
const avatarOptions = ref([
  { id: 'avatar1', name: '商务形象', src: '/pic/avatar1.jpeg' },
  { id: 'avatar2', name: '学术形象', src: '/pic/avatar2.jpeg' },
  { id: 'avatar3', name: '休闲形象', src: '/pic/avatar3.png' },
  { id: 'avatar4', name: '专业形象', src: '/pic/avatar4.jpg' },
  { id: 'avatar5', name: '创意形象', src: '/pic/avatar5.jpg' },
  { id: 'avatar6', name: '科技形象', src: '/pic/avatar6.png' }
])

// 打开头像选择弹层
const openAvatarSelector = () => {
  if (eventBus) {
    eventBus.emit('openAvatarSelector', {
      currentAvatar: currentAvatar.value,
      avatarOptions: avatarOptions.value
    })
  }
}

// 监听头像选择结果
if (eventBus) {
  eventBus.on('avatarSelected', (selectedAvatar) => {
    currentAvatar.value = selectedAvatar.src
  })
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 1440px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.profile-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0;
  font-weight: 400;
  padding: 20px;
}

.profile-content {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: nowrap;
  min-height: 400px;
  padding: 20px;
}

.avatar-section {
  position: sticky;
  top: 20px;
  align-self: flex-start;
  /*max-width: 1440px;*/
  /*margin: 0 auto;*/
  /*width: 100%;*/
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  /*background: rgba(255, 255, 255, 0.8);*/
  border-radius: 20px;
  /*box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);*/
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.info-cards-wrapper {
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 77%;
}

.word-cloud-container {
  /* This container is for structure and has no visual styles */
}

.word-cloud-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}

.word-cloud-tag {
  background-color: var(--tag-bg-color);
  padding: 5px 12px;
  border-radius: 15px;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.word-cloud-tag:hover {
  transform: scale(1.05);
  filter: brightness(95%);
  cursor: default;
}

.avatar-container {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  /*border: 5px solid rgba(255, 255, 255, 0.5);*/
  /*box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);*/
  transition: all 0.3s ease;
  animation: float 3s ease-in-out infinite;
}

.avatar-container:hover {
  transform: scale(1.05);
  box-shadow: 0 0 50px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.avatar-container:hover .avatar-image {
  transform: scale(1.1);
}

.avatar-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
  opacity: 0.8;
  pointer-events: none;
  z-index: -1;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.avatar-info {
  text-align: center;
}

.avatar-info h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 18px;
  justify-content: space-between;
}

.switch-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.switch-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

.avatar-info p {
  font-size: 1rem;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.6;
}

.info-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 340px;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.info-card h4 {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.info-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 5px;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}

.info-card li:not(:last-child) {
    border-bottom: 1px solid rgba(44, 62, 80, 0.08);
}

.info-card li:hover {
    background-color: rgba(255, 255, 255, 0.5);
}

.info-card .label {
  font-weight: 500;
  color: #34495e;
}

.info-card .value {
  font-weight: 400;
  color: #555;
  background: rgba(102, 126, 234, 0.1);
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.activity-card li {
  display: block;
  justify-content: flex-start;
  padding: 10px 5px;
  font-size: 0.9rem;
}

.activity-card li p {
    margin: 5px;
    line-height: 1.6;
}

.tag {
  padding: 3px 8px;
  border-radius: 12px;
  color: #515151;
  font-weight: 500;
  margin: 0 2px;
  font-size: 0.85rem;
  display: inline-block;
}

.tag-positive { background-color: #58d68c70; }
.tag-participate { background-color: #af7ac56a; }
.tag-count { background-color: #f5b04169; }
.tag-organize-participate { background-color: #ec716368; }
.tag-publish { background-color: #48c9af6f; }
.tag-evaluation { background-color: #5dade256; }
.tag-like { background-color: #f0b17a54; }
.tag-event { background-color: #dc77334e; }
.tag-award { background-color: #f4d03f53; color: #333; }

.tag-tool-count { background-color: #a9cce364; color: #333; }
.tag-usage-frequency { background-color: #a3e4d753; color: #333; }
.tag-reprocessing-rate { background-color: #fad7a059; color: #333; }
.tag-dev-count { background-color: #d7bde256; color: #333; }
.tag-efficiency-gain { background-color: #f9e79f54; color: #333; }
.tag-teaching-application { background-color: #a2d9ce59; color: #333; }
.tag-metadata-upload { background-color: #f5b7b155; color: #333; }
.tag-modeling-analysis { background-color: #a9dfbf4a; color: #333; }
.tag-kb-reuse { background-color: #e6b0aa4e; color: #333; }

@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }
  
  .profile-header {
    padding: 30px 15px;
    margin-bottom: 20px;
  }
  
  .profile-header h1 {
    font-size: 2rem;
  }
  
  .profile-subtitle {
    font-size: 1rem;
  }
  
  .avatar-section {
    padding: 30px;
  }

  .avatar-container {
    width: 150px;
    height: 150px;
  }

  .avatar-info h3 {
    font-size: 1.3rem;
  }

  .value {
    font-size: 0.9rem; /* Adjust font size for smaller screens */
  }

  .profile-content {
    flex-direction: column;
    gap: 20px;
  }
}
</style> 