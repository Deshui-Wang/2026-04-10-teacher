<template>
  <div class="teaching-experience">

    <!-- 顶部导航标签和添加按钮 -->
    <div class="nav-section">
      <div class="nav-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['nav-tab', { active: activeTab === tab.id }]"
          @click="switchTab(tab.id)"
        >
          {{ tab.name }}
          <span class="tab-count" v-if="tab.id !== 'all'">
            {{ getTabCount(tab.id) }}
          </span>
        </div>
      </div> 
      <button class="add-btn" @click="addExperience">
        <span class="add-icon">+</span>
        添加教学经验
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载教学经验...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredExperiences.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <p>暂无教学经验</p>
      <small>点击"添加教学经验"开始记录您的教学心得</small>
    </div>

    <!-- 经验卡片网格 -->
    <div v-else class="experiences-grid">
      <div 
        v-for="(experience, index) in filteredExperiences" 
        :key="index"
        class="experience-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="card-header">
          <div class="title">{{ experience.title }}</div>
          <div :class="['type-tag', `type-${experience.type}`]">
            {{ experience.typeText }}
          </div>
        </div>
        
        <div class="card-content">
          <div class="content-text">
            {{ experience.content }}
          </div>
          
          <div v-if="experience.image" class="content-image">
            <img 
              :src="experience.image" 
              :alt="experience.title"
              @error="handleImageError"
            />
          </div>
        </div>

        <div class="card-footer">
          <div class="meta-info">
            <span class="publish-time">{{ experience.publishTime }}</span>
            <span class="views">👁️ {{ experience.views }}</span>
            <span class="likes">❤️ {{ experience.likes }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 导航标签数据
const tabs = [
  { id: 'all', name: '全部' },
  { id: 'courseIdeology', name: '课程思政' },
  { id: 'teachingConcept', name: '教学理念' },
  { id: 'reflection', name: '教学反思' },
  { id: 'summary', name: '经验总结' }
]

const activeTab = ref('all')
const loading = ref(true)

// 可用的图片列表
const availableImages = [
  '/pic/learning/0f0.jpeg',
  '/pic/learning/68.jpg',
  '/pic/learning/814.jpg',
  '/pic/learning/84.png',
  '/pic/learning/42.jpeg',
  '/pic/learning/808.jpg',
  '/pic/learning/212.jpg',
  '/pic/learning/20.jpeg',
  '/pic/learning/97.png',
  '/pic/learning/24.png',
  '/pic/learning/banner3.jpeg',
  '/pic/learning/banner1.png',
  '/pic/learning/banner2.png'
]

// 随机获取图片
const getRandomImage = () => {
  const random = Math.random()
  // 70% 概率有图片，30% 概率没有图片
  return random > 0.3 ? availableImages[Math.floor(Math.random() * availableImages.length)] : null
}

// 教学经验数据
const experiences = [
  {
    title: '如何在《数据结构》课程中融入思政元素',
    type: 'courseIdeology',
    typeText: '课程思政',
    content: '在数据结构教学中，我尝试将中国传统文化中的"整体观念"与数据结构的设计思想相结合。通过讲解古代建筑中的榫卯结构，帮助学生理解链表、树等数据结构的连接关系。这种教学方式不仅让学生掌握了专业知识，还培养了他们的文化自信和民族自豪感。',
    image: getRandomImage(),
    publishTime: '2024-12-15',
    views: 156,
    likes: 23
  },
  {
    title: '以学生为中心的项目驱动教学法',
    type: 'teachingConcept',
    typeText: '教学理念',
    content: '我认为教学应该以学生为中心，通过真实的项目来驱动学习。在《软件工程》课程中，我让学生组成团队，开发一个完整的校园二手交易平台。从需求分析到系统部署，学生全程参与，不仅掌握了理论知识，还培养了团队协作和项目管理能力。',
    image: getRandomImage(),
    publishTime: '2024-12-10',
    views: 203,
    likes: 31
  },
  {
    title: '关于课堂互动的教学反思',
    type: 'reflection',
    typeText: '教学反思',
    content: '最近几节课发现学生参与度不高，经过反思，我发现问题在于提问方式过于封闭。于是我改变了策略，采用开放式问题，鼓励学生发表不同观点。效果明显改善，课堂氛围更加活跃，学生思维也更加发散。',
    image: getRandomImage(),
    publishTime: '2024-12-08',
    views: 98,
    likes: 15
  },
  {
    title: '线上线下混合式教学实践总结',
    type: 'summary',
    typeText: '经验总结',
    content: '经过一个学期的线上线下混合式教学实践，我总结出几点经验：线上预习要设计明确的学习目标，线下课堂要注重互动和讨论，课后要及时收集反馈并调整教学策略。这种模式既保证了教学效果，又培养了学生的自主学习能力。',
    image: getRandomImage(),
    publishTime: '2024-12-05',
    views: 178,
    likes: 28
  },
  {
    title: '算法思维在思政教育中的应用',
    type: 'courseIdeology',
    typeText: '课程思政',
    content: '在算法教学中，我引导学生思考算法设计中的"最优解"概念，并将其与人生选择相结合。通过讨论"贪心算法"在生活中的应用，帮助学生理解在追求目标时要有策略性思维，同时也要考虑长远利益。',
    image: getRandomImage(),
    publishTime: '2024-12-01',
    views: 134,
    likes: 19
  },
  {
    title: '过程性评价促进学生全面发展',
    type: 'teachingConcept',
    typeText: '教学理念',
    content: '我坚持采用过程性评价方式，不仅关注学生的最终成绩，更重视他们在学习过程中的表现。通过课堂参与度、作业完成质量、小组合作表现等多维度评价，帮助学生发现自己的优势和不足，促进全面发展。',
    image: getRandomImage(),
    publishTime: '2024-11-28',
    views: 167,
    likes: 25
  }
]

// 统计信息计算
const totalExperiences = computed(() => experiences.length)
const courseIdeologyCount = computed(() => experiences.filter(e => e.type === 'courseIdeology').length)
const teachingConceptCount = computed(() => experiences.filter(e => e.type === 'teachingConcept').length)
const reflectionCount = computed(() => experiences.filter(e => e.type === 'reflection').length)

// 根据选中的标签过滤经验
const filteredExperiences = computed(() => {
  if (activeTab.value === 'all') {
    return experiences
  }
  return experiences.filter(e => e.type === activeTab.value)
})

// 获取标签对应的经验数量
const getTabCount = (tabId) => {
  if (tabId === 'all') return 0
  return experiences.filter(e => e.type === tabId).length
}

// 切换标签
const switchTab = (tabId) => {
  activeTab.value = tabId
}

// 添加教学经验
const addExperience = () => {
  // 这里可以打开添加经验的模态框或跳转到添加页面
  console.log('打开添加教学经验')
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// 模拟加载数据
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.teaching-experience {
  padding: 24px;
  min-height: 100vh;
  width: 100%;
}

/* 统计信息样式 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #8b5cf6;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 导航区域样式 */
.nav-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
}

.nav-tabs {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  overflow-x: auto;
  overflow-y: visible;
}

.nav-tab {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  margin: 4px;
}

.nav-tab:hover {
  background-color: #f0f0f0;
}

.nav-tab.active {
  background-color: #8b5cf6;
  color: white;
}

.tab-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  padding: 4px;
  border-radius: 50%;
  min-width: 16px;
  height: 16px;
  text-align: center;
  line-height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

/* 添加按钮样式 */
.add-btn {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.add-icon {
  font-size: 18px;
  font-weight: bold;
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #666;
  font-weight: 500;
}

.empty-state small {
  color: #999;
  font-size: 14px;
}

/* 经验卡片网格 */
.experiences-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.experience-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.experience-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
}

.title {
  font-weight: 600;
  color: #333;
  font-size: 16px;
  line-height: 1.4;
  flex: 1;
}

/* 类型标签 */
.type-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
}

.type-courseIdeology {
  background-color: #dc2626;
}

.type-teachingConcept {
  background-color: #2563eb;
}

.type-reflection {
  background-color: #059669;
}

.type-summary {
  background-color: #7c3aed;
}

/* 卡片内容 */
.card-content {
  margin-bottom: 16px;
}

.content-text {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-image {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 12px;
}

.content-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.content-image:hover img {
  transform: scale(1.05);
}

/* 卡片底部 */
.card-footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.publish-time {
  color: #666;
}

.views, .likes {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .experiences-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .experiences-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .nav-tabs {
    flex-direction: column;
  }
  
  .nav-tab {
    text-align: left;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
  
  .add-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 