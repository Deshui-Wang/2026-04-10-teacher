<template>
  <div class="chart-module">
    <div class="chart-container">
      <canvas ref="chartCanvas" :width="chartWidth" :height="chartHeight"></canvas>
    </div>
    <div class="chart-legend" v-if="customSettings.showLegend">
      <div 
        v-for="(dataset, index) in chartData.datasets" 
        :key="index"
        class="legend-item"
      >
        <div 
          class="legend-color" 
          :style="{ backgroundColor: dataset.backgroundColor }"
        ></div>
        <span class="legend-label">{{ dataset.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  moduleData: Object,
  customSettings: Object
})

const emit = defineEmits(['update-settings'])

const chartCanvas = ref(null)
const chartWidth = ref(400)
const chartHeight = ref(300)

// 模拟图表数据
const chartData = ref({
  labels: ['2021', '2022', '2023', '2024'],
  datasets: [{
    label: '数据',
    data: [12, 19, 3, 5],
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1
  }]
})

// 绘制简单图表
const drawChart = () => {
  if (!chartCanvas.value) return
  
  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const data = chartData.value
  const dataset = data.datasets[0]
  const labels = data.labels
  
  // 设置图表区域
  const padding = 40
  const chartWidth = canvas.width - padding * 2
  const chartHeight = canvas.height - padding * 2
  const barWidth = chartWidth / labels.length * 0.8
  const barSpacing = chartWidth / labels.length * 0.2
  
  // 找到最大值用于缩放
  const maxValue = Math.max(...dataset.data)
  
  // 绘制坐标轴
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  
  // X轴
  ctx.beginPath()
  ctx.moveTo(padding, canvas.height - padding)
  ctx.lineTo(canvas.width - padding, canvas.height - padding)
  ctx.stroke()
  
  // Y轴
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, canvas.height - padding)
  ctx.stroke()
  
  // 绘制柱状图
  dataset.data.forEach((value, index) => {
    const x = padding + index * (barWidth + barSpacing) + barSpacing / 2
    const barHeight = (value / maxValue) * chartHeight
    const y = canvas.height - padding - barHeight
    
    // 绘制柱子
    ctx.fillStyle = dataset.backgroundColor
    ctx.fillRect(x, y, barWidth, barHeight)
    
    // 绘制边框
    ctx.strokeStyle = dataset.borderColor
    ctx.lineWidth = dataset.borderWidth
    ctx.strokeRect(x, y, barWidth, barHeight)
    
    // 绘制标签
    if (props.customSettings.showLabels) {
      ctx.fillStyle = '#374151'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(labels[index], x + barWidth / 2, canvas.height - padding + 20)
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
    }
  })
}

// 监听设置变化
watch(() => props.customSettings, () => {
  nextTick(() => {
    drawChart()
  })
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    drawChart()
  })
})
</script>

<style scoped>
.chart-module {
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.chart-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.legend-label {
  font-size: 14px;
  color: #374151;
}
</style>
