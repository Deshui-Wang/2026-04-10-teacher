<template>
  <div class="group-portrait la-container">
    <div class="page-title">
    </div>

    <div class="stats">
      <div class="stat danger">
        <div class="stat-title">异常停课</div>
        <div class="stat-value">37人</div>
        <div class="stat-desc">近一月内缺勤达3次</div>
      </div>
      <div class="stat warn">
        <div class="stat-title">成绩波动</div>
        <div class="stat-value">128人</div>
        <div class="stat-desc">近一月成绩波动超过标准差</div>
      </div>
      <div class="stat success">
        <div class="stat-title">显著提升</div>
        <div class="stat-value">52人</div>
        <div class="stat-desc">近一月自我提升环比↑≥10%</div>
      </div>
    </div>

    <div class="grid">
      <section class="card">
        <div class="card-head">
          <h3>成绩趋势</h3>
        </div>
        <div ref="trendChartRef" class="echart-container"></div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>作业完成</h3>
        </div>
        <div ref="homeworkChartRef" class="echart-container"></div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>出勤率</h3>
        </div>
        <div ref="attendanceChartRef" class="echart-container"></div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>课堂互动情绪</h3>
        </div>
        <div ref="sentimentChartRef" class="echart-container small"></div>
      </section>

      <section class="card card-span-2">
        <div class="card-head">
          <h3>科研项目</h3>
        </div>
        <div class="project-list">
          <div class="project-item" v-for="project in projectsWithProgress" :key="project.name">
            <div class="project-info">
              <div class="project-name">{{ project.name }}</div>
              <div class="project-meta">
                <span>{{ project.leader }} · {{ project.type }}</span>
                <span v-if="project.status === '在研' && project.daysFromStart !== undefined" class="project-progress">
                  · 已进行 {{ project.daysFromStart }} 天
                </span>
              </div>
              <div class="project-students" v-if="project.students && project.students.length > 0">
                <span class="students-label">参与学生：</span>
                <span class="students-names">{{ project.students.join('、') }}</span>
              </div>
            </div>
            <span class="project-status" :class="project.statusClass">{{ project.status }}</span>
          </div>
        </div>
      </section>

      <section class="card card-span-2">
        <div class="card-head">
          <h3>专业匹配度</h3>
          <span class="major-tag">人工智能专业</span>
        </div>
        <div class="major-match-container">
          <div class="major-match-overview">
            <div class="overview-score">
              <div class="score-value">88%</div>
              <div class="score-label">整体匹配度</div>
            </div>
            <div class="overview-desc">
              <p>学生整体能力与人工智能专业培养目标匹配度良好，在核心课程和项目实践方面表现突出。</p>
            </div>
          </div>
          <div class="major-match-indicators">
            <div class="match-indicator" v-for="indicator in majorMatchIndicators" :key="indicator.name">
              <div class="indicator-header">
                <span class="indicator-name">{{ indicator.name }}</span>
                <span class="indicator-value">{{ indicator.value }}%</span>
              </div>
              <div class="indicator-progress">
                <div class="progress-bar" :style="{ width: indicator.value + '%', backgroundColor: indicator.color }"></div>
              </div>
              <div class="indicator-desc">{{ indicator.description }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>课外兴趣</h3>
        </div>
        <div ref="interestWordCloudRef" class="echart-container"></div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>智能能力</h3>
        </div>
        <div ref="intelligentAbilityChartRef" class="echart-container"></div>
      </section>
    </div>
  </div>
  
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordcloud'

const trendChartRef = ref(null)
const sentimentChartRef = ref(null)
const homeworkChartRef = ref(null)
const attendanceChartRef = ref(null)
const interestWordCloudRef = ref(null)
const intelligentAbilityChartRef = ref(null)

let trendChart, sentimentChart, homeworkChart, attendanceChart, interestWordCloudChart, intelligentAbilityChart

// 计算开始时间到现在的天数
const getDaysFromStart = (startDate) => {
  const start = new Date(startDate)
  const now = new Date()
  const diffTime = Math.abs(now - start)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// 科研项目列表
const projectList = ref([
  { 
    name: '基于深度学习的智能教学辅助系统研究', 
    leader: '张教授', 
    type: '国家级项目',
    status: '在研',
    statusClass: 'status-active',
    startDate: '2024-01-15',
    students: ['李明', '王芳', '张伟', '刘洋']
  },
  { 
    name: '人工智能驱动的个性化学习路径推荐', 
    leader: '李教授', 
    type: '省部级项目',
    status: '在研',
    statusClass: 'status-active',
    startDate: '2024-03-20',
    students: ['陈静', '赵强', '孙丽']
  },
  { 
    name: '教育大数据挖掘与分析平台构建', 
    leader: '王教授', 
    type: '校级重点项目',
    status: '在研',
    statusClass: 'status-active',
    startDate: '2024-02-10',
    students: ['周明', '吴涛', '徐静', '马超', '黄磊']
  },
  { 
    name: '在线教育质量评估与优化方法研究', 
    leader: '刘教授', 
    type: '省部级项目',
    status: '在研',
    statusClass: 'status-active',
    startDate: '2024-04-05',
    students: ['林晓', '郑华', '何健']
  },
  { 
    name: '多模态学习行为分析与预测', 
    leader: '陈教授', 
    type: '国家级项目',
    status: '在研',
    statusClass: 'status-active',
    startDate: '2024-01-28',
    students: ['杨帆', '朱敏', '许强', '冯杰']
  },
  { 
    name: '虚拟现实技术在实验教学中的应用', 
    leader: '赵教授', 
    type: '校级项目',
    status: '结题',
    statusClass: 'status-completed',
    startDate: '2023-06-01',
    students: ['罗斌', '唐亮', '韩雪']
  },
  { 
    name: '知识图谱驱动的智能答疑系统', 
    leader: '孙教授', 
    type: '省部级项目',
    status: '结题',
    statusClass: 'status-completed',
    startDate: '2023-09-15',
    students: ['谢峰', '邓琳', '曹阳', '彭丽']
  },
  { 
    name: '基于大数据的课程教学质量评价体系', 
    leader: '周教授', 
    type: '校级项目',
    status: '结题',
    statusClass: 'status-completed',
    startDate: '2023-08-20',
    students: ['田静', '范伟']
  }
])

// 计算每个项目的进度天数
const projectsWithProgress = computed(() => {
  return projectList.value.map(project => {
    if (project.status === '在研') {
      return {
        ...project,
        daysFromStart: getDaysFromStart(project.startDate)
      }
    }
    return project
  })
})

// 智能工具数据
const intelligentTools = ref([
  {
    name: '数字人',
    usageCount: 156,
    developmentCount: 12,
    icon: '👤',
    color: '#e0f2fe',
    trend: {
      type: 'up',
      text: '较上月增长15%'
    }
  },
  {
    name: '智能体',
    usageCount: 203,
    developmentCount: 18,
    icon: '🤖',
    color: '#f0fdf4',
    trend: {
      type: 'up',
      text: '较上月增长22%'
    }
  },
  {
    name: '工作流',
    usageCount: 178,
    developmentCount: 15,
    icon: '⚙️',
    color: '#fef3c7',
    trend: {
      type: 'up',
      text: '较上月增长8%'
    }
  },
  {
    name: '知识库',
    usageCount: 245,
    developmentCount: 28,
    icon: '📚',
    color: '#ede9fe',
    trend: {
      type: 'up',
      text: '较上月增长31%'
    }
  },
  {
    name: '视频',
    usageCount: 192,
    developmentCount: 22,
    icon: '🎥',
    color: '#fce7f3',
    trend: {
      type: 'up',
      text: '较上月增长12%'
    }
  },
  {
    name: '生成式分析',
    usageCount: 167,
    developmentCount: 14,
    icon: '📊',
    color: '#dbeafe',
    trend: {
      type: 'up',
      text: '较上月增长19%'
    }
  },
  {
    name: '智能生图',
    usageCount: 189,
    developmentCount: 25,
    icon: '🎨',
    color: '#f0f9ff',
    trend: {
      type: 'up',
      text: '较上月增长26%'
    }
  }
])

// 专业匹配度指标（人工智能专业）
const majorMatchIndicators = ref([
  {
    name: '核心课程匹配度',
    value: 92,
    color: '#22c55e',
    description: '机器学习(95分)、深度学习(90分)、神经网络(88分)等核心课程成绩优秀'
  },
  {
    name: '编程能力匹配度',
    value: 85,
    color: '#3b82f6',
    description: 'Python熟练度85%、TensorFlow使用经验丰富、PyTorch基础扎实'
  },
  {
    name: '数学基础匹配度',
    value: 88,
    color: '#8b5cf6',
    description: '线性代数(90分)、概率论(87分)、高等数学(88分)基础扎实'
  },
  {
    name: '项目实践匹配度',
    value: 91,
    color: '#f59e0b',
    description: '参与AI相关项目5个，包括图像识别、NLP、推荐系统等方向'
  },
  {
    name: '行业技能匹配度',
    value: 83,
    color: '#ec4899',
    description: '熟悉主流AI框架，具备算法优化和模型部署的实践经验'
  }
])

const initCharts = () => {
  // 成绩趋势
  if (trendChart) trendChart.dispose()
  trendChart = echarts.init(trendChartRef.value)
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, bottom: 30, top: 20 },
    xAxis: { type: 'category', data: ['第1周','第2周','第3周','第4周','第5周','第6周','第7周','第8周'] },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [{
      name: '平均分', type: 'line', smooth: true,
      data: [72, 75, 78, 74, 80, 82, 85, 84],
      itemStyle: { color: '#5352ed' },
      lineStyle: { width: 3 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(83,82,237,.35)'},{offset:1,color:'rgba(83,82,237,.08)'}]) }
    }]
  })

  // 课堂情绪
  if (sentimentChart) sentimentChart.dispose()
  sentimentChart = echarts.init(sentimentChartRef.value)
  const sentimentData = [
    { value: 12, name: '沉闷沮丧', itemStyle: { color: '#ef4444' } },
    { value: 18, name: '消极疑惑', itemStyle: { color: '#f59e0b' } },
    { value: 52, name: '热情积极', itemStyle: { color: '#22c55e' } },
    { value: 18, name: '走神', itemStyle: { color: '#94a3b8' } }
  ]
  sentimentChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}人 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 12 },
      formatter: function(name) {
        const item = sentimentData.find(d => d.name === name)
        return item ? name + '  ' + item.value + '人' : name
      }
    },
    series: [
      {
        name: '课堂互动情绪',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 11,
          fontWeight: 'normal'
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 8
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold'
          }
        },
        data: sentimentData
      }
    ]
  })

  // 作业完成对比
  if (homeworkChart) homeworkChart.dispose()
  homeworkChart = echarts.init(homeworkChartRef.value)
  homeworkChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        let result = params[0].name + '<br/>'
        params.forEach(param => {
          result += param.seriesName + ': ' + param.value + '%<br/>'
        })
        return result
      }
    },
    legend: {
      data: ['全学院', '我的学生'],
      top: 10,
      right: 20,
      textStyle: { fontSize: 12 }
    },
    grid: { left: 60, right: 30, bottom: 30, top: 50 },
    xAxis: {
      type: 'category',
      data: ['完成率', '正确率', '按时提交率', '优秀率'],
      axisLabel: { fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: { 
        formatter: '{value}%',
        fontSize: 11
      },
      splitLine: {
        lineStyle: { color: '#f1f5f9', type: 'dashed' }
      }
    },
    series: [
      {
        name: '全学院',
        type: 'bar',
        data: [85, 78, 82, 35],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#94a3b8' },
            { offset: 1, color: '#64748b' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: 20,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          fontSize: 11,
          color: '#64748b'
        }
      },
      {
        name: '我的学生',
        type: 'bar',
        data: [89, 83, 88, 42],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#5352ed' },
            { offset: 1, color: '#4338ca' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: 20,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          fontSize: 11,
          color: '#4338ca'
        }
      }
    ]
  })

  // 出勤率饼状图
  if (attendanceChart) attendanceChart.dispose()
  attendanceChart = echarts.init(attendanceChartRef.value)
  const attendanceData = [
    { value: 520, name: '全勤', itemStyle: { color: '#10b981' } },
    { value: 35, name: '迟到', itemStyle: { color: '#f59e0b' } },
    { value: 18, name: '早退', itemStyle: { color: '#f97316' } },
    { value: 12, name: '缺勤', itemStyle: { color: '#ef4444' } },
    { value: 25, name: '请假', itemStyle: { color: '#6366f1' } }
  ]
  attendanceChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}次 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 12 },
      formatter: function(name) {
        const item = attendanceData.find(d => d.name === name)
        return item ? name + '  ' + item.value + '次' : name
      }
    },
    series: [
      {
        name: '出勤情况',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 11,
          fontWeight: 'normal'
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 8
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold'
          }
        },
        data: attendanceData
      }
    ]
  })

  // 课外兴趣词云图
  if (interestWordCloudChart) interestWordCloudChart.dispose()
  interestWordCloudChart = echarts.init(interestWordCloudRef.value)
  
  const colors = [
    '#3b82f6', // 蓝色
    '#10b981', // 绿色
    '#f59e0b', // 橙色
    '#ef4444', // 红色
    '#8b5cf6', // 紫色
    '#06b6d4', // 青色
    '#84cc16', // 黄绿色
    '#f97316', // 橙红色
    '#ec4899', // 粉色
    '#6366f1', // 靛蓝色
    '#14b8a6', // 蓝绿色
    '#06b6d4', // 青色
    '#f59e0b', // 琥珀色
    '#3b82f6', // 蓝色
    '#10b981'  // 绿色
  ]
  
  const interestData = [
    { name: '编程竞赛', value: 85, textStyle: { color: colors[0] } },
    { name: '羽毛球', value: 72, textStyle: { color: colors[1] } },
    { name: '开源贡献', value: 68, textStyle: { color: colors[2] } },
    { name: '摄影', value: 65, textStyle: { color: colors[3] } },
    { name: '篮球', value: 58, textStyle: { color: colors[4] } },
    { name: '书法', value: 52, textStyle: { color: colors[5] } },
    { name: '音乐', value: 48, textStyle: { color: colors[6] } },
    { name: '绘画', value: 45, textStyle: { color: colors[7] } },
    { name: '阅读', value: 42, textStyle: { color: colors[8] } },
    { name: '游泳', value: 38, textStyle: { color: colors[9] } },
    { name: '跑步', value: 35, textStyle: { color: colors[10] } },
    { name: '舞蹈', value: 32, textStyle: { color: colors[11] } },
    { name: '旅游', value: 28, textStyle: { color: colors[12] } },
    { name: '电影', value: 25, textStyle: { color: colors[13] } },
    { name: '美食', value: 22, textStyle: { color: colors[14] } }
  ]
  
  interestWordCloudChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return params.name + ': ' + params.value + '人'
      }
    },
    series: [{
      type: 'wordCloud',
      gridSize: 8,
      sizeRange: [14, 32],
      rotationRange: [-45, 45],
      rotationStep: 5,
      shape: 'circle',
      width: '100%',
      height: '100%',
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold'
      },
      emphasis: {
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: interestData
    }]
  })

  // 智能能力柱状图
  if (intelligentAbilityChart) intelligentAbilityChart.dispose()
  intelligentAbilityChart = echarts.init(intelligentAbilityChartRef.value)
  
  const toolNames = intelligentTools.value.map(tool => tool.name)
  const usageCounts = intelligentTools.value.map(tool => tool.usageCount)
  const developmentCounts = intelligentTools.value.map(tool => tool.developmentCount)
  
  intelligentAbilityChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        let result = params[0].name + '<br/>'
        params.forEach(param => {
          result += param.seriesName + ': ' + param.value + '<br/>'
        })
        return result
      }
    },
    legend: {
      data: ['使用次数', '设计开发'],
      top: 10,
      right: 20,
      textStyle: { fontSize: 12 }
    },
    grid: {
      left: 60,
      right: 30,
      bottom: 60,
      top: 50,
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: toolNames,
      axisLabel: {
        fontSize: 11,
        rotate: 15,
        interval: 0,
        color: '#0f172a'
      },
      axisLine: {
        lineStyle: { color: '#e2e8f0' }
      }
    },
    yAxis: {
      type: 'value',
      name: '次数',
      nameTextStyle: { 
        fontSize: 12,
        color: '#0f172a'
      },
      axisLabel: { 
        fontSize: 11,
        color: '#0f172a'
      },
      axisLine: {
        lineStyle: { color: '#e2e8f0' }
      },
      splitLine: {
        lineStyle: { color: '#f1f5f9', type: 'dashed' }
      }
    },
    series: [
      {
        name: '使用次数',
        type: 'bar',
        data: usageCounts,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#60a5fa' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2563eb' },
              { offset: 1, color: '#3b82f6' }
            ])
          }
        }
      },
      {
        name: '设计开发',
        type: 'bar',
        data: developmentCounts,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#8b5cf6' },
            { offset: 1, color: '#a78bfa' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#7c3aed' },
              { offset: 1, color: '#8b5cf6' }
            ])
          }
        }
      }
    ]
  })
}

const resize = () => {
  trendChart && trendChart.resize()
  sentimentChart && sentimentChart.resize()
  homeworkChart && homeworkChart.resize()
  attendanceChart && attendanceChart.resize()
  interestWordCloudChart && interestWordCloudChart.resize()
  intelligentAbilityChart && intelligentAbilityChart.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  trendChart && trendChart.dispose()
  sentimentChart && sentimentChart.dispose()
  homeworkChart && homeworkChart.dispose()
  attendanceChart && attendanceChart.dispose()
  interestWordCloudChart && interestWordCloudChart.dispose()
  intelligentAbilityChart && intelligentAbilityChart.dispose()
})
</script>

<style scoped>
.group-portrait {
  padding: 8px 0;
}

.la-container {
  max-width: 1480px;
  margin: 0 auto;
  padding: 24px 38px;
}

.page-title h2 {
  margin: 0;
  font-size: 20px;
  color: #0f172a;
}

.page-title p {
  margin: 4px 0 12px;
  color: #64748b;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.stat {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, .04);
}

.stat .stat-title {
  color: #64748b;
  font-size: 12px;
}

.stat .stat-value {
  font-size: 22px;
  font-weight: 700;
  margin: 6px 0;
}

.stat .stat-desc {
  color: #64748b;
  font-size: 12px;
}

.stat.danger {
  background: #fff1f2;
  border-color: #fecdd3;
}

.stat.warn {
  background: #fff7ed;
  border-color: #fed7aa;
}

.stat.success {
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.card-span-2 {
  grid-column: span 2;
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, .04);
  transition: box-shadow .2s ease, transform .2s ease;
}

.card:hover {
  box-shadow: 0 6px 18px rgba(16, 24, 40, .08);
  transform: translateY(-2px);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-head h3 {
  margin: 0;
  font-size: 15px;
  color: #0f172a;
  letter-spacing: .2px;
  display: flex;
  align-items: center;
}

.placeholder {
  height: 160px;
  background: linear-gradient(180deg, #f8fafc, #eef2f7);
  border-radius: 8px;
  border: 1px dashed #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.echart-container {
  height: 260px;
  width: 100%;
}

.echart-container.small {
  height: 220px;
}

.row {
  display: flex;
  gap: 16px;
}

.metric {
  flex: 1;
  text-align: center;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  background: #f8fafc;
}

.metric.b {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.metric.g {
  background: #ecfdf5;
  border-color: #bbf7d0;
}

.metric.y {
  background: #fff7ed;
  border-color: #fed7aa;
}

.metric.c {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.metric-large {
  padding: 16px 0;
}

.metric-value {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.metric-label {
  color: #64748b;
  font-size: 12px;
}

.list {
  margin: 0;
  padding-left: 18px;
  color: #334155;
}

.list li {
  margin: 6px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
}

.dot.red {
  background: #ef4444;
}

.dot.amber {
  background: #f59e0b;
}

.dot.green {
  background: #22c55e;
}

.dot.gray {
  background: #94a3b8;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #f8fafc;
  color: #0f172a;
  font-size: 12px;
  border-radius: 999px;
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 1px 0 #ffffff;
}

.project-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  height: auto;
  overflow: visible;
  padding-bottom: 0;
  padding-right: 0;
}

.project-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 145px;
  box-sizing: border-box;
}

.project-item:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05);
}

.project-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.project-name {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-meta {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 6px;
}

.project-progress {
  color: #3b82f6;
  font-weight: 600;
}

.project-students {
  font-size: 11px;
  color: #475569;
  margin-top: auto; /* 置底展示 */
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.students-label {
  color: #64748b;
  margin-right: 4px;
}

.students-names {
  color: #1e293b;
  font-weight: 500;
}

.project-status {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 10px;
  white-space: nowrap;
  align-self: flex-start;
  margin-top: 6px;
}

.project-status.status-active {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.project-status.status-completed {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

/* 专业匹配度模块样式 */
.major-tag {
  display: inline-block;
  font-size: 11px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 12px;
  font-weight: 500;
  margin-left: 8px;
}

.major-match-container {
  display: flex;
  gap: 24px;
  padding: 12px 0 4px 0;
  height: auto;
  overflow: visible;
}

.major-match-overview {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  padding: 24px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  border: 1px solid #bae6fd;
  margin-bottom: 0;
  box-sizing: border-box;
}

.overview-score {
  flex-shrink: 0;
  text-align: left;
}

.score-value {
  font-size: 42px;
  font-weight: 800;
  color: #0ea5e9;
  line-height: 1;
  margin-bottom: 8px;
}

.score-label {
  font-size: 13px;
  color: #0369a1;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.overview-desc {
  flex: 1;
  display: flex;
  align-items: center;
}

.overview-desc p {
  margin: 0;
  font-size: 13px;
  color: #0c4a6e;
  line-height: 1.6;
}

.major-match-indicators {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  align-items: stretch;
}

.match-indicator {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 14px;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.match-indicator:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.indicator-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  width: 100%;
}

.indicator-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.indicator-value {
  font-size: 14px;
  font-weight: 800;
  color: #334155;
}

.indicator-progress {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.indicator-desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.5;
  white-space: normal;
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .card-span-2 {
    grid-column: span 1;
  }

  .stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .project-list {
    grid-template-columns: repeat(2, 1fr); /* 中屏下科研项目两列展示 */
  }

  .major-match-container {
    flex-direction: column;
    height: auto;
  }

  .major-match-overview {
    width: 100%;
    text-align: center;
  }

  .overview-score {
    text-align: center;
  }

  .major-match-indicators {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .stats {
    grid-template-columns: 1fr;
  }

  .project-list {
    grid-template-columns: 1fr; /* 小屏下科研项目单列展示 */
  }

  .major-match-indicators {
    grid-template-columns: 1fr;
  }
}
</style>


