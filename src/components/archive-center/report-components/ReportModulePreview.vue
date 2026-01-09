<template>
  <div class="module-preview-chart">
    <div class="chart-container" ref="chartContainer"></div>
    <div v-if="!hasChart" class="no-chart-placeholder">
      <div class="placeholder-icon">📊</div>
      <div class="placeholder-text">暂无图表</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  moduleType: {
    type: String,
    required: true
  },
  chartType: {
    type: String,
    default: 'bar'
  },
  colorScheme: {
    type: String,
    default: '经典蓝'
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  showLabels: {
    type: Boolean,
    default: true
  }
})

const chartContainer = ref(null)
let chartInstance = null

// 配色方案映射
const colorSchemes = {
  '经典蓝': ['#667eea', '#764ba2'],
  '活力橙': ['#f093fb', '#f5576c'],
  '自然绿': ['#4facfe', '#00f2fe'],
  '温暖黄': ['#43e97b', '#38f9d7'],
  '优雅紫': ['#fa709a', '#fee140'],
  '商务灰': ['#a8edea', '#fed6e3']
}

// 模块类型数据生成器
const moduleDataGenerators = {
  'assets': () => ({
    title: '资产统计',
    data: [
      { name: '教学设备', value: 85, color: '#007aff' },
      { name: '办公用品', value: 62, color: '#34c759' },
      { name: '图书资料', value: 78, color: '#ff9500' },
      { name: '软件授权', value: 45, color: '#5856d6' },
      { name: '其他资产', value: 33, color: '#ff3b30' }
    ]
  }),
  'achievements': () => ({
    title: '成果奖励',
    data: [
      { name: '教学成果', value: 92, color: '#007aff' },
      { name: '科研成果', value: 78, color: '#34c759' },
      { name: '荣誉称号', value: 65, color: '#ff9500' },
      { name: '竞赛指导', value: 88, color: '#5856d6' },
      { name: '其他奖励', value: 56, color: '#ff3b30' }
    ]
  }),
  'digital-literacy': () => ({
    title: '数字素养',
    data: [
      { name: '在线教学', value: 4.2, color: '#007aff' },
      { name: '数字工具', value: 3.8, color: '#34c759' },
      { name: '数据分析', value: 3.5, color: '#ff9500' },
      { name: '创新应用', value: 4.0, color: '#5856d6' },
      { name: '持续学习', value: 3.7, color: '#ff3b30' }
    ]
  }),
  'workload-stats': () => ({
    title: '工作量统计',
    data: [
      { name: '2021', value: 320, color: '#007aff' },
      { name: '2022', value: 380, color: '#34c759' },
      { name: '2023', value: 420, color: '#ff9500' },
      { name: '2024', value: 450, color: '#5856d6' }
    ]
  }),
  'ethics': () => ({
    title: '师德师风',
    data: [
      { name: '学生评价', value: 4.6, color: '#007aff' },
      { name: '同事评价', value: 4.4, color: '#34c759' },
      { name: '领导评价', value: 4.5, color: '#ff9500' },
      { name: '自我评价', value: 4.3, color: '#5856d6' }
    ]
  }),
  'student-data': () => ({
    title: '学生数据',
    data: [
      { name: '优秀率', value: 85, color: '#007aff' },
      { name: '及格率', value: 95, color: '#34c759' },
      { name: '出勤率', value: 92, color: '#ff9500' },
      { name: '满意度', value: 88, color: '#5856d6' }
    ]
  }),
  'courseware-research': () => ({
    title: '课件研发',
    data: [
      { name: '课件数量', value: 45, color: '#007aff' },
      { name: '教案数量', value: 38, color: '#34c759' },
      { name: '视频资源', value: 25, color: '#ff9500' },
      { name: '互动内容', value: 32, color: '#5856d6' }
    ]
  }),
  'teaching-experience': () => ({
    title: '教学经验',
    data: [
      { name: '课程思政', value: 4.1, color: '#007aff' },
      { name: '教学理念', value: 3.9, color: '#34c759' },
      { name: '教学反思', value: 4.0, color: '#ff9500' },
      { name: '实践应用', value: 3.8, color: '#5856d6' }
    ]
  }),
  // 新增档案模块类型映射
  'personal-info': () => ({
    title: '综合能力画像',
    data: [
      { name: '教学能力', value: 95 },
      { name: '科研产出', value: 88 },
      { name: '行业实践', value: 82 },
      { name: '学生管理', value: 90 },
      { name: '数智素养', value: 94 }
    ]
  }),
  'teaching-basic': () => ({
    title: '资质能力',
    data: [
      { name: '核心课程', value: 85 },
      { name: '教学时数', value: 92 },
      { name: '证书数量', value: 78 },
      { name: '考核评定', value: 95 }
    ]
  }),
  'teaching-implementation': () => ({
    title: '教学实施',
    data: [
      { name: '计划执行', value: 100 },
      { name: '方法革新', value: 85 },
      { name: '课堂活跃', value: 78 },
      { name: '评分优良', value: 92 }
    ]
  }),
  'teaching-reform': () => ({
    title: '教改成果',
    data: [
      { name: '课题主持', value: 65 },
      { name: '论文发表', value: 88 },
      { name: '评价改革', value: 75 },
      { name: '数字化转', value: 90 }
    ]
  }),
  'teaching-practice': () => ({
    title: '实践教学',
    data: [
      { name: '实训指导', value: 95 },
      { name: '基地建设', value: 70 },
      { name: '企业满意', value: 88 },
      { name: '就业相关', value: 82 }
    ]
  }),
  'student-development': () => ({
    title: '学生发展',
    data: [
      { name: '及格率', value: 100 },
      { name: '优秀率', value: 35 },
      { name: '竞赛获奖', value: 78 },
      { name: '就业率', value: 96 }
    ]
  }),
  'growth-practice': () => ({
    title: '企业实践',
    data: [
      { name: '实践时长', value: 80 },
      { name: '技术收获', value: 92 },
      { name: '案例转化', value: 75 },
      { name: '反馈评价', value: 88 }
    ]
  }),
  'growth-competition': () => ({
    title: '竞赛奖励',
    data: [
      { name: '国家级', value: 20 },
      { name: '省级奖', value: 45 },
      { name: '市级奖', value: 35 },
      { name: '校级奖', value: 60 }
    ]
  }),
  'growth-guidance': () => ({
    title: '指导学生',
    data: [
      { name: '社团指导', value: 85 },
      { name: '竞赛战绩', value: 92 },
      { name: '梯队建设', value: 78 },
      { name: '学生满意', value: 95 }
    ]
  }),
  'growth-research': () => ({
    title: '教科研成果',
    data: [
      { name: '纵向课题', value: 70 },
      { name: '核心期刊', value: 65 },
      { name: '专利获批', value: 80 },
      { name: '软著登记', value: 92 }
    ]
  }),
  'training-online': () => ({
    title: '线上培训',
    data: [
      { name: '资源设计', value: 88 },
      { name: '教学评估', value: 75 },
      { name: 'AI备课', value: 92 },
      { name: '测试成绩', value: 98 }
    ]
  }),
  'training-offline': () => ({
    title: '线下研修',
    data: [
      { name: '现场交流', value: 95 },
      { name: '方案路演', value: 82 },
      { name: '实地考察', value: 90 },
      { name: '结业评分', value: 96 }
    ]
  }),
  'custom': () => ({
    title: '自定义数据',
    data: [
      { name: '指标 A', value: 65 },
      { name: '指标 B', value: 78 },
      { name: '指标 C', value: 92 },
      { name: '指标 D', value: 85 }
    ]
  })
}

const hasChart = ref(false)

// 生成图表配置
const generateChartOption = () => {
  // 获取数据：如果类型不存在，则显示自定义兜底数据，确保演示效果
  const generator = moduleDataGenerators[props.moduleType] || moduleDataGenerators['custom']
  const moduleData = generator()

  const colors = colorSchemes[props.colorScheme] || colorSchemes['经典蓝']
  const data = moduleData.data

  let option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      show: props.showLegend,
      orient: 'horizontal',
      bottom: '5%',
      textStyle: {
        fontSize: 12
      }
    },
    series: []
  }

  switch (props.chartType) {
    case 'bar':
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: { 
          left: '3%', 
          right: '4%', 
          bottom: '15%', 
          top: '10%',
          containLabel: true 
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { 
            color: '#666', 
            fontSize: 11,
            rotate: data.length > 4 ? 45 : 0
          }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f0f2f5' } },
          axisLabel: { color: '#666', fontSize: 11 }
        },
        series: [{
          name: moduleData.title,
          type: 'bar',
          data: data.map((item, idx) => ({
            value: item.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors[0] },
                { offset: 1, color: colors[1] }
              ]),
              borderRadius: [4, 4, 0, 0],
              shadowBlur: 8,
              shadowColor: colors[0] + '40'
            }
          })),
          barWidth: '60%',
          label: {
            show: props.showLabels,
            position: 'top',
            fontSize: 10,
            color: '#666'
          }
        }]
      }
      break

    case 'line':
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        grid: { 
          left: '3%', 
          right: '4%', 
          bottom: '15%', 
          top: '10%',
          containLabel: true 
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { 
            color: '#666', 
            fontSize: 11,
            rotate: data.length > 4 ? 45 : 0
          }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f0f2f5' } },
          axisLabel: { color: '#666', fontSize: 11 }
        },
        series: [{
          name: moduleData.title,
          type: 'line',
          data: data.map(item => item.value),
          smooth: true,
          lineStyle: {
            color: colors[0],
            width: 3
          },
          itemStyle: {
            color: colors[0],
            borderWidth: 2,
            borderColor: '#fff'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors[0] + '30' },
              { offset: 1, color: colors[0] + '05' }
            ])
          },
          label: {
            show: props.showLabels,
            position: 'top',
            fontSize: 10,
            color: '#666'
          }
        }]
      }
      break

    case 'pie':
      option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          show: props.showLegend,
          orient: 'vertical',
          right: '5%',
          top: 'center',
          textStyle: { fontSize: 11 }
        },
        series: [{
          name: moduleData.title,
          type: 'pie',
          radius: '60%',
          center: ['40%', '50%'],
          data: data.map((item, idx) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: colors[0] },
                { offset: 1, color: colors[1] }
              ]),
              shadowBlur: 10,
              shadowColor: colors[0] + '40'
            }
          })),
          label: {
            show: props.showLabels,
            formatter: '{b}: {c}',
            fontSize: 10
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      break

    case 'doughnut':
      option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          show: props.showLegend,
          orient: 'vertical',
          right: '5%',
          top: 'center',
          textStyle: { fontSize: 11 }
        },
        series: [{
          name: moduleData.title,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          data: data.map((item, idx) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: colors[0] },
                { offset: 1, color: colors[1] }
              ]),
              shadowBlur: 10,
              shadowColor: colors[0] + '40'
            }
          })),
          label: {
            show: props.showLabels,
            formatter: '{b}: {c}',
            fontSize: 10
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      break

    case 'radar':
      option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: props.showLegend,
          bottom: '5%',
          textStyle: { fontSize: 11 }
        },
        radar: {
          indicator: data.map(item => ({
            name: item.name,
            max: Math.max(...data.map(d => d.value)) * 1.2
          })),
          radius: '70%',
          axisName: {
            fontSize: 11,
            color: '#666'
          }
        },
        series: [{
          name: moduleData.title,
          type: 'radar',
          data: [{
            value: data.map(item => item.value),
            name: moduleData.title,
            itemStyle: {
              color: colors[0] + '60'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors[0] + '40' },
                { offset: 1, color: colors[0] + '10' }
              ])
            },
            lineStyle: {
              color: colors[0],
              width: 2
            }
          }]
        }]
      }
      break

    default:
      return null
  }

  return option
}

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  const option = generateChartOption()
  if (!option) {
    hasChart.value = false
    return
  }

  hasChart.value = true
  chartInstance = echarts.init(chartContainer.value)
  chartInstance.setOption(option)

  // 响应式调整
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
}

// 监听属性变化
watch([() => props.moduleType, () => props.chartType, () => props.colorScheme, () => props.showLegend, () => props.showLabels], () => {
  nextTick(() => {
    initChart()
  })
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})
</script>

<style scoped>
.module-preview-chart {
  width: 100%;
  height: 200px;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.no-chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
}

.placeholder-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.placeholder-text {
  font-size: 14px;
  font-weight: 500;
}
</style>
