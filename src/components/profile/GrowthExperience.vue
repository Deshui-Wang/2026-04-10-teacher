<template>
  <div class="growth-container">
    <div class="growth-header">
      <h3>成长时光轴</h3>
      <div class="filter-options">
        <label class="filter-checkbox">
          <input type="checkbox" v-model="filterTypes.education" />
          <span>教育经历</span>
        </label>
        <label class="filter-checkbox">
          <input type="checkbox" v-model="filterTypes.work" />
          <span>工作经历</span>
        </label>
        <label class="filter-checkbox">
          <input type="checkbox" v-model="filterTypes.promotion" />
          <span>晋升经历</span>
        </label>
      </div>
    </div>
    
    <div class="timeline-wrapper" ref="timelineWrapper">
      <!-- 时间轴主线 -->
      <div class="timeline-axis"></div>
      
      <!-- 时间节点和内容 -->
      <div class="timeline-items">
        <div
          v-for="(item, idx) in sortedTimelineItems"
          :key="idx"
          class="timeline-item"
          :class="{ 'left-side': idx % 2 === 0, 'right-side': idx % 2 === 1 }"
          :style="{ '--item-color': item.color }"
        >
          <!-- 节点圆点 -->
          <div class="timeline-node" :style="{ backgroundColor: item.color }"></div>
          
          <!-- 水平连接线 -->
          <div class="timeline-connector" :style="{ backgroundColor: item.color }"></div>
          
          <!-- 内容区域 -->
          <div class="timeline-content">
            <!-- 日期范围标签 -->
            <div class="date-label" :style="{ backgroundColor: item.color }">
              {{ item.dateRange }}
            </div>
            
            <!-- 描述卡片 -->
            <div class="content-card">
              <div class="card-title">{{ item.title }}</div>
              <div class="card-description">{{ item.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// 筛选类型状态
const filterTypes = ref({
  education: true,
  work: true,
  promotion: true
})

// 教育经历数据
const educationData = [
  {
    type: 'education',
    startYear: 2005,
    startMonth: 7,
    endYear: 2009,
    endMonth: 9,
    title: '北京理工大学',
    description: '计算机软件工程专业，获得学士学位，系统学习计算机科学基础理论和软件工程实践技能。',
    color: '#ec4899' // 紫红色
  },
  {
    type: 'education',
    startYear: 2009,
    startMonth: 7,
    endYear: 2012,
    endMonth: 9,
    title: '北京理工大学',
    description: '人工智能专业，获得硕士学位，深入研究机器学习、深度学习等前沿技术。',
    color: '#8b5cf6' // 紫色
  },
  {
    type: 'education',
    startYear: 2011,
    startMonth: 7,
    endYear: 2011,
    endMonth: 7,
    title: '北京大学',
    description: '访问学者，机器人应用技术方向，拓展研究视野和学术交流。',
    color: '#3b82f6' // 蓝色
  }
]

// 工作经历数据
const workData = [
  {
    type: 'work',
    startYear: 2016,
    startMonth: 7,
    endYear: 2019,
    endMonth: 1,
    title: '信息工程学院',
    description: '担任助教，参与本科教学与课程助教工作，协助建设课程实验资源。',
    color: '#10b981' // 绿色
  },
  {
    type: 'work',
    startYear: 2019,
    startMonth: 1,
    endYear: 2021,
    endMonth: 3,
    title: '信息工程学院',
    description: '担任讲师，独立承担核心课程教学，开展科研工作，主持教改项目。',
    color: '#84cc16' // 亮绿色
  },
  {
    type: 'work',
    startYear: 2021,
    startMonth: 3,
    endYear: 2025,
    endMonth: 5,
    title: '信息工程学院',
    description: '担任副教授，形成稳定研究方向，指导研究生，获得多项科研成果。',
    color: '#eab308' // 黄色
  }
]

// 职称晋升数据
const promotionData = [
  {
    type: 'promotion',
    startYear: 2016,
    startMonth: 7,
    endYear: 2016,
    endMonth: 7,
    title: '助教',
    description: '入职，参与本科教学与课程助教工作，参与《程序设计基础》重构。',
    color: '#ef4444' // 红色
  },
  {
    type: 'promotion',
    startYear: 2019,
    startMonth: 1,
    endYear: 2019,
    endMonth: 1,
    title: '讲师',
    description: '独立承担核心课程教学，开展科研，主持教改项目1项，发表教学论文2篇。',
    color: '#f97316' // 橙色
  },
  {
    type: 'promotion',
    startYear: 2021,
    startMonth: 3,
    endYear: 2021,
    endMonth: 3,
    title: '副教授',
    description: '形成稳定研究方向并指导研究生，省部级课题立项，指导研究生获得竞赛奖励。',
    color: '#ec4899' // 紫红色
  },
  {
    type: 'promotion',
    startYear: 2025,
    startMonth: 5,
    endYear: 2025,
    endMonth: 5,
    title: '教授',
    description: '团队建设与学科发展，行业影响力提升，主持国家级项目，产学研合作落地。',
    color: '#8b5cf6' // 紫色
  }
]

// 合并所有经历（根据筛选条件）
const allTimelineItems = computed(() => {
  const all = []
  
  if (filterTypes.value.education) {
    all.push(...educationData)
  }
  if (filterTypes.value.work) {
    all.push(...workData)
  }
  if (filterTypes.value.promotion) {
    all.push(...promotionData)
  }
  
  // 格式化日期范围
  return all.map(item => ({
    ...item,
    dateRange: item.startYear === item.endYear && item.startMonth === item.endMonth
      ? `${item.startYear}`
      : `${item.startYear}-${item.endYear}`
  }))
})

// 按时间排序（从晚到早，倒序）
const sortedTimelineItems = computed(() => {
  return [...allTimelineItems.value].sort((a, b) => {
    if (a.startYear !== b.startYear) return b.startYear - a.startYear
    return b.startMonth - a.startMonth
  })
})

// 获取图标
const getIcon = (type) => {
  const icons = {
    education: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>',
    work: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
    promotion: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
  }
  return icons[type] || icons.education
}

const timelineWrapper = ref(null)
</script>

<style scoped>
.growth-container {
  padding: 24px;
  min-height: 100vh;
  background: #f9fafb;
}

.growth-header {
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.growth-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1677ff;
  text-align: left;
}

.filter-options {
  display: flex;
  gap: 24px;
  align-items: center;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  user-select: none;
  transition: color 0.2s ease;
}

.filter-checkbox:hover {
  color: #111827;
}

.filter-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.filter-checkbox span {
  font-weight: 500;
}

.growth-subtitle {
  margin: 0;
  font-size: 16px;
  color: #6b7280;
}

.timeline-wrapper {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0;
}

/* 时间轴主线 - 垂直直线 */
.timeline-axis {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
  transform: translateX(-50%);
  z-index: 1;
}

.timeline-items {
  position: relative;
  z-index: 2;
}

.timeline-item {
  position: relative;
  margin-bottom: -30px;
  display: flex;
  align-items: center;
}

/* 节点圆点 */
.timeline-node {
  position: absolute;
  left: 50%;
  top: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 3;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 水平连接线 */
.timeline-connector {
  position: absolute;
  top: 7px;
  height: 2px;
  z-index: 2;
  background-color: var(--item-color);
}

.timeline-item.left-side .timeline-connector {
  right: 50%;
  width: calc(50% - 200px);
  max-width: 200px;
}

.timeline-item.right-side .timeline-connector {
  left: 50%;
  width: calc(50% - 200px);
  max-width: 200px;
}

/* 内容区域 */
.timeline-content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 400px;
  flex-shrink: 0;
}

.timeline-item.left-side .timeline-content {
  margin-right: auto;
  padding-right: 20px;
  align-items: flex-end;
  text-align: right;
  gap: 10px;
}

.timeline-item.right-side .timeline-content {
  margin-left: auto;
  padding-left: 20px;
  align-items: flex-start;
  text-align: left;
}

/* 日期范围标签 */
.date-label {
  padding: 6px 16px;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 内容区域内的连接短线 */
.content-connector {
  width: 2px;
  height: 20px;
  flex-shrink: 0;
  align-self: center;
}

.timeline-item.left-side .content-connector {
  align-self: center;
}

.timeline-item.right-side .content-connector {
  align-self: center;
}

/* 图标圆圈 */
.icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.icon-circle:hover {
  transform: scale(1.1);
}

.icon-inner {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-inner svg {
  width: 100%;
  height: 100%;
}

/* 描述卡片 */
.content-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  max-width: 100%;
}

.content-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.card-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .growth-container {
    padding: 16px;
  }
  
  .growth-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-options {
    width: 100%;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .timeline-axis {
    left: 30px;
  }
  
  .timeline-node {
    left: 30px;
  }
  
  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
    padding-left: 60px;
  }
  
  .timeline-item.left-side,
  .timeline-item.right-side {
    padding-left: 60px;
  }
  
  .timeline-item.left-side .timeline-content,
  .timeline-item.right-side .timeline-content {
    width: 100%;
    max-width: calc(100vw - 80px);
    margin: 0;
    padding: 0;
    align-items: flex-start;
  }
  
  .timeline-connector {
    display: none;
  }
  
  .timeline-content {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .growth-header h3 {
    font-size: 24px;
  }
  
  .content-card {
    padding: 16px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .card-description {
    font-size: 13px;
  }
  
  .icon-circle {
    width: 56px;
    height: 56px;
  }
  
  .icon-inner {
    width: 28px;
    height: 28px;
  }
}
</style>