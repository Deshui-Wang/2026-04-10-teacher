<template>
  <div class="intelligent-service-container">
    <div class="particles-bg"></div>
    <header class="dashboard-header">
      <h1>可视化数据决策驾驶舱</h1>
      <p>教师档案袋数据大屏，集数据统计与诊断、智能预警与个性化干预于一体。</p>
    </header>

    <!-- 用户概览卡片区 -->
    <div class="overview-cards-futuristic">
      <div class="overview-card-futuristic" v-for="(item, idx) in overviewList" :key="idx">
        <div class="overview-title">{{ item.title }}</div>
        <div class="overview-value">{{ item.value }}</div>
        <div class="overview-footer">
          <span :class="item.trend === 'up' ? 'trend-up' : 'trend-down'">
            {{ item.trend === 'up' ? '▲' : '▼' }} {{ item.percent }}%
          </span>
        </div>
      </div>
    </div>

    <!-- 标签页导航 -->
    <div class="tabs-nav">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'academic' }" 
        @click="activeTab = 'academic'">
        学业概览
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'life' }" 
        @click="activeTab = 'life'">
        学生生活
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'development' }" 
        @click="activeTab = 'development'">
        发展概览
      </button>
    </div>

    <!-- 主体内容网格 -->
    <div class="dashboard-main-grid">
      <!-- 学业概览 -->
      <div class="grid-section" v-if="activeTab === 'academic'">
        <div class="charts-grid-futuristic">
          <div class="chart-card-futuristic"><div ref="courseScoreChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="warningChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="creditChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="rankChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="awardChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="futureChart" class="echart-futuristic"></div></div>
        </div>
      </div>
      <!-- 学生生活 -->
      <div class="grid-section" v-if="activeTab === 'life'">
        <div class="charts-grid-futuristic">
          <div class="chart-card-futuristic"><div ref="dormChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="canteenChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="activityChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="libraryChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="sportsChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="cardChart" class="echart-futuristic"></div></div>
        </div>
      </div>
      <!-- 发展概览 -->
      <div class="grid-section" v-if="activeTab === 'development'">
        <div class="charts-grid-futuristic">
          <div class="chart-card-futuristic"><div ref="furtherChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="jobChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="industryDevChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="regionChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="typeChart" class="echart-futuristic"></div></div>
          <div class="chart-card-futuristic"><div ref="salaryChart" class="echart-futuristic"></div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'

const activeTab = ref('academic');

const overviewList = [
  { title: '在校学生总数', value: '98,179', trend: 'up', percent: '2.54' },
  { title: '应届毕业生', value: '6,187', trend: 'up', percent: '1.29' },
  { title: '通过毕业', value: '6,079', trend: 'down', percent: '2.54' },
  { title: '实习中', value: '5,009', trend: 'up', percent: '2.54' },
  { title: '已就业', value: '1,229', trend: 'up', percent: '2.54' }
]

const courseScoreChart = ref()
const warningChart = ref()
const creditChart = ref()
const rankChart = ref()
const awardChart = ref()
const futureChart = ref()
const dormChart = ref()
const canteenChart = ref()
const activityChart = ref()
const libraryChart = ref()
const sportsChart = ref()
const cardChart = ref()
const furtherChart = ref()
const jobChart = ref()
const industryDevChart = ref()
const regionChart = ref()
const typeChart = ref()
const salaryChart = ref()

const axisLabelColor = 'rgba(255, 255, 255, 0.7)';
const splitLineColor = 'rgba(255, 255, 255, 0.15)';
const axisLineColor = 'rgba(255, 255, 255, 0.3)';
const tooltipBgColor = 'rgba(0, 10, 29, 0.85)';
const tooltipBorderColor = 'rgba(0, 234, 255, 0.5)';

const initCharts = () => {
  nextTick(() => {
    const commonTooltip = {
      trigger: 'axis',
      backgroundColor: tooltipBgColor,
      borderColor: tooltipBorderColor,
      borderWidth: 1,
      textStyle: { color: '#fff' },
      axisPointer: {
        type: 'cross',
        label: { backgroundColor: '#6a7985' }
      }
    };

    const commonXAxis = {
      type: 'category',
      axisLine: { lineStyle: { color: axisLineColor } },
      axisLabel: { color: axisLabelColor },
      axisTick: { show: false }
    };
    
    const commonYAxis = {
      type: 'value',
      axisLine: { show: true, lineStyle: { color: axisLineColor } },
      axisLabel: { color: axisLabelColor },
      splitLine: { lineStyle: { type: 'dashed', color: splitLineColor } }
    };

    // 课程成绩分布
    if (courseScoreChart.value) {
      echarts.init(courseScoreChart.value).setOption({
        title: { text: '课程成绩分布', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: commonTooltip,
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { ...commonXAxis, data: ['数学','英语','C语言','线性代数','大学物理'] },
        yAxis: commonYAxis,
        series: [{
          name: '平均分',
          data: [82, 78, 85, 76, 80],
          type: 'bar',
          barWidth: '50%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 234, 255, 1)' },
              { offset: 1, color: 'rgba(0, 91, 255, 0.5)' }
            ]),
            borderRadius: [4, 4, 0, 0]
          }
        }]
      });
    }

    // 学业预警分布
    if (warningChart.value) {
      echarts.init(warningChart.value).setOption({
        title: { text: '学业预警分布', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: commonTooltip,
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { ...commonYAxis, splitLine: { show: false } },
        yAxis: { ...commonXAxis, data: ['挂科','补考','学业预警'] },
        series: [{
          name: '人数',
          data: [120, 45, 30],
          type: 'bar',
          barWidth: '50%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(255, 87, 87, 0.5)' },
              { offset: 1, color: 'rgba(255, 87, 87, 1)' }
            ]),
            borderRadius: [0, 4, 4, 0]
          }
        }]
      });
    }

    // 学分修读进度
    if (creditChart.value) {
      echarts.init(creditChart.value).setOption({
        title: { text: '学分修读进度', left: 'center', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: { trigger: 'item', backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, textStyle: { color: '#fff' } },
        series: [{
          type: 'pie',
          radius: ['65%', '85%'],
          avoidLabelOverlap: false,
          label: { show: true, position: 'center', formatter: '71%', color: '#00eaff', fontSize: 28, fontWeight: 'bold' },
          emphasis: { label: { show: true, fontSize: 32 } },
          labelLine: { show: false },
          data: [
            { value: 85, name: '已修学分', itemStyle: { 
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#00eaff' }, { offset: 1, color: '#005bff' }]),
                shadowBlur: 10, shadowColor: 'rgba(0, 234, 255, 0.5)'
            }},
            { value: 35, name: '未修学分', itemStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
          ]
        }]
      });
    }

    // 获奖与竞赛 (玫瑰图)
    if (awardChart.value) {
      echarts.init(awardChart.value).setOption({
        title: { text: '获奖与竞赛', left: 'center', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: { trigger: 'item', backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, textStyle: { color: '#fff' } },
        series: [{
          type: 'pie',
          radius: ['20%', '70%'],
          center: ['50%', '55%'],
          roseType: 'area',
          itemStyle: { borderRadius: 5 },
          label: { color: axisLabelColor },
          data: [
            { value: 20, name: '奖学金' }, { value: 15, name: '竞赛获奖' }, { value: 70, name: '无获奖' }
          ],
          color: ['#00eaff', '#ffc700', 'rgba(255,255,255,0.1)']
        }]
      });
    }
    
    // 毕业去向 (玫瑰图)
    if (futureChart.value) {
      echarts.init(futureChart.value).setOption({
        title: { text: '毕业去向', left: 'center', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: { trigger: 'item', backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, textStyle: { color: '#fff' } },
        series: [{
          type: 'pie',
          radius: ['20%', '70%'],
          center: ['50%', '55%'],
          roseType: 'area',
          itemStyle: { borderRadius: 5 },
          label: { color: axisLabelColor },
          data: [
            { value: 40, name: '升学' }, { value: 50, name: '就业' }, { value: 5, name: '出国' }, { value: 5, name: '创业' }
          ],
          color: ['#00eaff', '#5470c6', '#91cc75', '#ffc700']
        }]
      });
    }

    // 图书馆借阅量
    if (libraryChart.value) {
      echarts.init(libraryChart.value).setOption({
        title: { text: '图书馆借阅量', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: commonTooltip,
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { ...commonXAxis, data: ['1月','2月','3月','4月','5月','6月'] },
        yAxis: commonYAxis,
        series: [{
          name: '借阅量',
          data: [320, 480, 600, 700, 650, 800],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { color: '#00eaff', width: 3, shadowBlur: 10, shadowColor: 'rgba(0, 234, 255, 0.5)' },
          itemStyle: { color: '#00eaff' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 234, 255, 0.4)' },
              { offset: 1, color: 'rgba(0, 234, 255, 0)' }
            ])
          }
        }]
      });
    }
    
    // 升学率趋势
    if (furtherChart.value) {
      echarts.init(furtherChart.value).setOption({
        title: { text: '升学率趋势', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: commonTooltip,
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { ...commonXAxis, data: ['2018','2019','2020','2021','2022','2023'] },
        yAxis: { ...commonYAxis, axisLabel: { formatter: '{value}%' } },
        series: [{
          name: '升学率',
          data: [38, 42, 45, 48, 50, 53],
          type: 'line',
          smooth: true,
          lineStyle: { color: '#91cc75', width: 3 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(145, 204, 117, 0.4)'}, {offset: 1, color: 'rgba(145, 204, 117, 0)'}])
          }
        }]
      });
    }

    // 就业率趋势
    if(jobChart.value){
      echarts.init(jobChart.value).setOption({
        title: { text: '就业率趋势', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: commonTooltip,
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { ...commonXAxis, data: ['2018','2019','2020','2021','2022','2023'] },
        yAxis: { ...commonYAxis, axisLabel: { formatter: '{value}%' } },
        series: [{
          name: '就业率',
          data: [55, 52, 50, 49, 48, 46],
          type: 'line',
          smooth: true,
          lineStyle: { color: '#ffc700', width: 3 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(255, 199, 0, 0.4)'}, {offset: 1, color: 'rgba(255, 199, 0, 0)'}])
          }
        }]
      });
    }
    
    // 毕业生行业分布 (玫瑰图)
    if(industryDevChart.value) {
      echarts.init(industryDevChart.value).setOption({
        title: { text: '毕业生行业分布', left: 'center', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: { trigger: 'item', backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, textStyle: { color: '#fff' } },
        series: [{
          type: 'pie',
          radius: ['20%', '70%'],
          center: ['50%', '55%'],
          roseType: 'area',
          itemStyle: { borderRadius: 5 },
          label: { color: axisLabelColor, formatter: '{b}\n{d}%' },
          data: [
            {value: 120, name: '互联网'}, {value: 98, name: '金融'}, {value: 110, name: '教育'},
            {value: 80, name: '制造业'}, {value: 60, name: '政府'}, {value: 40, name: '医疗'}, {value: 30, name: '其他'}
          ]
        }]
      });
    }
    
    // 宿舍入住率
    if (dormChart.value) {
      echarts.init(dormChart.value).setOption({
        title: { text: '宿舍入住率', left: 'center', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: { trigger: 'item', backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, textStyle: { color: '#fff' } },
        series: [{
          type: 'pie',
          radius: ['65%', '85%'],
          avoidLabelOverlap: false,
          label: { show: true, position: 'center', formatter: '92%', color: '#91cc75', fontSize: 28, fontWeight: 'bold' },
          data: [
            { value: 92, name: '已入住', itemStyle: { color: '#91cc75' } },
            { value: 8, name: '未入住', itemStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
          ]
        }]
      });
    }
    
    // 其余图表使用简化配置
    const simpleBarOption = (title, data, color) => ({
      title: { text: title, textStyle: { color: '#fff', fontSize: 16 } },
      tooltip: commonTooltip,
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { ...commonXAxis, data: data.map(i => i.name) },
      yAxis: commonYAxis,
      series: [{
        data: data.map(i => i.value), type: 'bar', barWidth: '50%',
        itemStyle: { color: color || '#5470c6', borderRadius: [4, 4, 0, 0] }
      }]
    });

    const simpleRoseOption = (title, data) => ({
        title: { text: title, left: 'center', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: { trigger: 'item', backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, textStyle: { color: '#fff' } },
        series: [{
          type: 'pie', radius: ['20%', '70%'], center: ['50%', '55%'], roseType: 'area', itemStyle: { borderRadius: 5 },
          label: { color: axisLabelColor, formatter: '{b}\n{d}%' },
          data: data
        }]
    });

    if (rankChart.value) {
      echarts.init(rankChart.value).setOption({
        title: { text: '学业排名分布', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: { trigger: 'item', axisPointer: { type: 'shadow' }, backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, textStyle: { color: '#fff' } },
        grid: { left: '10%', right: '10%', bottom: '15%' },
        xAxis: { ...commonXAxis, data: ['班级','年级','专业'] },
        yAxis: commonYAxis,
        series: [{
          name: '排名', type: 'boxplot',
          data: [ [60, 70, 80, 90, 100], [65, 75, 85, 95, 105], [70, 80, 90, 100, 110] ],
          itemStyle: { color: '#005bff', borderColor: '#00eaff' }
        }]
      });
    }

    if (canteenChart.value) {
      echarts.init(canteenChart.value).setOption(simpleBarOption('食堂消费分布',
        [{name: '早餐', value: 1200}, {name: '午餐', value: 3200}, {name: '晚餐', value: 2800}, {name: '夜宵', value: 600}], '#ffc700'));
    }
    
    if (activityChart.value) {
      echarts.init(activityChart.value).setOption(simpleRoseOption('校园活动参与率',
        [{value: 65, name: '参与'}, {value: 35, name: '未参与'}]));
    }

    if (sportsChart.value) {
      echarts.init(sportsChart.value).setOption({
        title: { text: '体育锻炼频率', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: commonTooltip, grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { ...commonYAxis, splitLine: { show: false } },
        yAxis: { ...commonXAxis, data: ['0次','1-2次','3-4次','5次+'] },
        series: [{ data: [120, 300, 450, 180], type: 'bar', barWidth: '50%', itemStyle: { color: '#91cc75', borderRadius: [0,4,4,0] } }]
      });
    }

    if (cardChart.value) {
      echarts.init(cardChart.value).setOption({
        title: { text: '校园卡消费结构', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, textStyle: { color: '#fff' } },
        legend: { data: ['食堂','超市','打印','洗衣'], textStyle: { color: axisLabelColor }, top: 'bottom' },
        grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: { ...commonXAxis, data: ['1月','2月','3月','4月','5月','6月'] },
        yAxis: commonYAxis,
        series: [
          { name: '食堂', type: 'bar', stack: '总量', data: [320, 332, 301, 334, 390, 330] },
          { name: '超市', type: 'bar', stack: '总量', data: [120, 132, 101, 134, 90, 230] },
          { name: '打印', type: 'bar', stack: '总量', data: [20, 18, 21, 14, 19, 20] },
          { name: '洗衣', type: 'bar', stack: '总量', data: [12, 15, 10, 13, 9, 11] }
        ],
        color: ['#00eaff', '#5470c6', '#91cc75', '#ffc700']
      });
    }

    if (regionChart.value) {
      echarts.init(regionChart.value).setOption(simpleBarOption('毕业生地域分布', 
        [{name:'北京', value:60}, {name:'上海', value:80}, {name:'广东', value:120}, {name:'浙江', value:70}, {name:'江苏', value:65}, {name:'四川', value:40}, {name:'其他', value:30}], '#5470c6'));
    }

    if (typeChart.value) {
      echarts.init(typeChart.value).setOption(simpleRoseOption('毕业生深造类型', 
        [{value: 40, name: '国内升学'}, {value: 10, name: '出国深造'}, {value: 30, name: '考研'}, {value: 20, name: '考公'}]));
    }
    
    if (salaryChart.value) {
      echarts.init(salaryChart.value).setOption({
        title: { text: '毕业生薪资分布', textStyle: { color: '#fff', fontSize: 16 } },
        tooltip: { trigger: 'item', axisPointer: { type: 'shadow' }, backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, textStyle: { color: '#fff' } },
        grid: { left: '10%', right: '10%', bottom: '15%' },
        xAxis: { ...commonXAxis, data: ['互联网','金融','教育','制造业','政府'] },
        yAxis: { ...commonYAxis, axisLabel: { formatter: '¥{value}' } },
        series: [{
          name: '薪资', type: 'boxplot',
          data: [ [6000, 8000, 12000, 15000, 20000], [5000, 7000, 10000, 13000, 18000], [4000, 6000, 9000, 11000, 15000],
                  [3500, 5000, 8000, 10000, 13000], [3000, 4000, 6000, 8000, 10000] ],
          itemStyle: { color: '#005bff', borderColor: '#00eaff' }
        }]
      });
    }
  });
};

watch(activeTab, () => {
  initCharts();
});

onMounted(() => {
  initCharts();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@300;400;600&display=swap');

.intelligent-service-container {
  background-color: #030424;
  color: #e0e0e0;
  min-height: 100vh;
  padding: 2px 48px 48px;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 20% 20%, rgba(0, 234, 255, 0.1) 0%, transparent 30%),
                    radial-gradient(circle at 80% 70%, rgba(0, 91, 255, 0.1) 0%, transparent 30%);
  z-index: 0;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.dashboard-header h1 {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.7), 0 0 20px rgba(0, 234, 255, 0.5);
  margin-bottom: 8px;
}

.dashboard-header p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 800px;
  margin: 0 auto;
}

.overview-cards-futuristic {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.overview-card-futuristic {
  background: rgba(0, 26, 77, 0.5);
  border: 1px solid rgba(0, 122, 255, 0.3);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  max-width: 220px;
  text-align: center;
  transition: all 0.3s ease;
}

.overview-card-futuristic:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(0, 234, 255, 0.3);
  border-color: rgba(0, 234, 255, 0.5);
}

.overview-card-futuristic .overview-title {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12px;
}

.overview-card-futuristic .overview-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  color: #00eaff;
  margin-bottom: 12px;
}

.overview-card-futuristic .overview-footer {
  font-size: 0.9rem;
}
.trend-up { color: #39ff14; }
.trend-down { color: #ff5a5a; }

.tabs-nav {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.tab-button {
  background-color: transparent;
  border: 1px solid rgba(0, 234, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  padding: 12px 24px;
  margin: 0 8px;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  background-color: rgba(0, 234, 255, 0.1);
  color: #fff;
  border-color: rgba(0, 234, 255, 0.7);
}

.tab-button.active {
  background-color: rgba(0, 234, 255, 0.2);
  color: #fff;
  border-color: rgba(0, 234, 255, 1);
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.5);
}

.dashboard-main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.grid-section .section-title-futuristic {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #00eaff;
}

.charts-grid-futuristic {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 300px);
  gap: 24px;
}

.chart-card-futuristic {
  background: rgba(0, 17, 51, 0.6);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.chart-card-futuristic:hover {
  background: rgba(0, 26, 77, 0.7);
  border-color: rgba(0, 234, 255, 0.4);
}

.echart-futuristic {
  width: 100%;
  height: 100%;
}

@media (max-width: 1440px) {
  .charts-grid-futuristic {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 300px);
  }
}

@media (max-width: 900px) {
  .charts-grid-futuristic {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 300px);
  }
  .overview-cards-futuristic {
    flex-direction: column;
    align-items: center;
  }
  .tabs-nav {
    flex-direction: column;
    gap: 10px;
  }
}
</style> 