<template>
  <div class="ability-chart-card">
    <h4>{{ chartData.title }}</h4>
    <div ref="chartContainer" class="chart-container"></div>
    <div class="evidence-section">
      <h5>能力分解说明</h5>
      <div class="evidence-grid">
        <div v-for="ability in chartData.abilities" :key="ability.dimension" class="evidence-item">
          <strong>{{ ability.dimension }}</strong>
          <ul>
            <li v-for="(item, index) in ability.evidence" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register necessary ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer
]);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({ title: '', abilities: [] })
  }
});

const chartContainer = ref(null);
let chartInstance = null;

const setupChart = () => {
  if (!chartInstance && chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value);
  }

  const indicator = props.chartData.abilities.map(a => ({
    name: a.dimension,
    max: 100 
  }));

  const data = [{
    value: props.chartData.abilities.map(a => a.score),
    name: '能力得分'
  }];
  
  const evidenceMap = props.chartData.abilities.reduce((acc, ability) => {
    acc[ability.dimension] = ability.evidence;
    return acc;
  }, {});

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        let simplerTooltip = `<strong>能力分布</strong><br/>`;
        params.value.forEach((score, index) => {
            const dimension = indicator[index].name;
            simplerTooltip += `${dimension}: ${score}<br/>`;
        });
        return simplerTooltip;
      }
    },
    radar: {
      indicator: indicator,
      radius: '65%',
      axisName: {
          color: '#333',
          fontSize: 14,
          fontWeight: 'bold',
          padding: [3, 5]
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(114, 172, 209, 0.2)', 'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)', 'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'].reverse(),
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 10
        }
      },
    },
    series: [
      {
        type: 'radar',
        data: data,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#5694f2',
        },
        lineStyle: {
          width: 3,
          color: '#5694f2'
        },
        areaStyle: {
          color: 'rgba(86, 148, 242, 0.4)'
        }
      }
    ]
  };

  chartInstance.setOption(option);
};

const resizeHandler = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

onMounted(() => {
  setupChart();
  window.addEventListener('resize', resizeHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});

watch(() => props.chartData, setupChart, { deep: true });
</script>

<style scoped>
.ability-chart-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  margin-top: 15px; /* Add margin to separate from cards above */
}

.ability-chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.ability-chart-card h4 {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.chart-container {
  width: 100%;
  height: 300px;
}

.evidence-section {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.evidence-section h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  text-align: center;
  border-bottom: none;
}

.evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.evidence-item {
  font-size: 0.85rem;
  padding: 15px;
  background: rgba(245, 247, 250, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.evidence-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.evidence-item strong {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
}

.evidence-item ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  color: #555;
}

.evidence-item li {
  margin-bottom: 5px;
  line-height: 1.6;
  position: relative;
  padding-left: 18px;
  text-align: left;
}

.evidence-item li::before {
    content: '▶';
    position: absolute;
    left: 0;
    top: 0;
    font-size: 10px;
    color: #667eea;
}
</style> 