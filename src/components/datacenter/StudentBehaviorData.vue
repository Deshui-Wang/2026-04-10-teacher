<template>
  <div class="student-behavior-data">
    <div class="page-title">
    </div>

    <div class="student-view-container">
      <div class="student-detail-header">
        <div class="student-display">
          <h2 class="current-student-label">当前学生</h2>
          <div class="student-info-card">
            <img :src="selectedStudent.avatar" alt="avatar" class="student-avatar-display"/>
            <div class="student-details">
              <span class="student-name">{{ selectedStudent.name }}</span>
              <span class="student-id">{{ selectedStudent.id }}</span>
              <span class="student-class">{{ selectedStudent.className }}</span>
            </div>
            <button @click="showStudentSelector = true" class="switch-student-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              切换学生
            </button>
          </div>
        </div>
        <button @click="goBack" class="back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          返回
        </button>
      </div>
      
      <h2 class="section-title-header">异常行为</h2>
      <div class="abnormal-behavior-cards">
        <div class="ab-card absence">
          <div class="ab-title">频繁缺勤</div>
          <div class="ab-value">1</div>
          <div class="ab-desc">近一月缺勤次数</div>
        </div>
        <div class="ab-card late-active">
          <div class="ab-title">深夜活跃</div>
          <div class="ab-value">3</div>
          <div class="ab-desc">近一月晚于凌晨2点未熄灯/断网仍在活动</div>
        </div>
        <div class="ab-card consumption-drop">
          <div class="ab-title">消费情况</div>
          <div class="ab-value">骤减</div>
          <div class="ab-desc">近一月消费额度环比上升/下降超过60%</div>
        </div>
      </div>
      
      <h2 class="section-title-header">课后行为概览</h2>
      <div class="student-dashboard-grid">
        <div class="data-module">
          <div class="module-header"><h3>图书馆借阅</h3></div>
          <div ref="libraryChart" class="chart-container"></div>
        </div>
        <div class="data-module">
          <div class="module-header"><h3>宿舍出入</h3></div>
          <div ref="dormChart" class="chart-container"></div>
        </div>
        <div class="data-module">
          <div class="module-header"><h3>校园消费</h3></div>
          <div class="consumption-tags">
            <span class="tag-label">高消费商品</span>
            <span class="book-tag">蜜雪冰城</span><span class="book-tag">小炒黄牛肉</span><span class="book-tag">亲亲虾条</span><span class="book-tag">冰拿铁</span><span class="book-tag">理发</span><span class="book-tag project-tag">论文装订</span><span class="book-tag">裁剪</span><span class="book-tag">共享单车</span><span class="book-tag">健身房</span><span class="book-tag">珍珠奶茶</span><span class="book-tag project-tag">小鸡炖蘑菇</span>
          </div>
          <div ref="consumptionChart" class="chart-container"></div>
        </div>
        <div class="data-module">
          <div class="module-header"><h3>上网/用电</h3></div>
          <div ref="networkChart" class="chart-container"></div>
        </div>
        <div class="data-module">
          <div class="module-header"><h3>校内论坛</h3></div>
          <div class="consumption-tags">
            <span class="tag-label">参与话题</span>
            <span v-for="topic in forumTopics" :key="topic.text" class="book-tag" :style="{ backgroundColor: topic.color, color: 'white', borderColor: 'transparent' }">{{ topic.text }}</span>
          </div>
          <div ref="forumChart" class="chart-container"></div>
        </div>
        <div class="data-module">
          <div class="module-header"><h3>实验室使用</h3></div>
          <div class="consumption-tags">
            <span class="tag-label">参与项目</span>
            <span class="book-tag project-tag">人工智能赋能农耕业乡村振兴</span>
          </div>
          <div ref="labUsageChart" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as echarts from 'echarts';

const route = useRoute();
const router = useRouter();

const libraryChart = ref(null);
const dormChart = ref(null);
const consumptionChart = ref(null);
const networkChart = ref(null);
const forumChart = ref(null);
const labUsageChart = ref(null);

let libraryChartInstance, dormChartInstance, consumptionChartInstance, networkChartInstance, forumChartInstance, labUsageChartInstance;

const surnames = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨'];
const givenNames = ['伟', '芳', '娜', '敏', '静', '磊', '洋', '艳', '勇', '杰', '涛', '明', '强', '丽', '娟'];

const mockStudents = Array.from({ length: 50 }, (_, i) => {
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const givenName1 = givenNames[Math.floor(Math.random() * givenNames.length)];
  const givenName2 = Math.random() > 0.5 ? givenNames[Math.floor(Math.random() * givenNames.length)] : '';
  const isMale = i % 2 === 0;
  return {
    id: `21010${String(i).padStart(2, '0')}`,
    name: surname + givenName1 + givenName2,
    major: ['计算机科学', '软件工程', '人工智能'][i % 3],
    className: `计科210${(i % 3) + 1}班`,
    avatar: isMale ? '/pic/student01.png' : '/pic/student01.png',
  };
});

const forumTopics = ref([
  { text: '9月3日会停课吗？', color: '#f56c6c' },
  { text: '张馨月参加比赛的高清视频', color: '#67c23a' },
  { text: '高新产业人工智能论坛', color: '#e6a23c' },
  { text: 'BLACK', color: '#409eff' },
  { text: '校园歌手大赛', color: '#909399' },
  { text: '小鸡炖蘑菇', color: '#303133' },
  { text: 'MBTI', color: '#b8a2e6' },
]);

const selectedStudent = computed(() => {
  return mockStudents.find(s => s.id === route.params.id) || mockStudents[0];
});

const goBack = () => {
  router.push('/student-behavior');
};

const initCharts = () => {
  const chartInstances = [libraryChartInstance, dormChartInstance, consumptionChartInstance, networkChartInstance, forumChartInstance, labUsageChartInstance];
  chartInstances.forEach(instance => instance?.dispose());

  const chartContainers = [libraryChart, dormChart, consumptionChart, networkChart, forumChart, labUsageChart];
  if (chartContainers.some(c => !c.value)) return;
  
  libraryChartInstance = echarts.init(libraryChart.value);
  const libraryData = {
    total: 47,
    categories: [
      { value: 484, name: '理工类' }, { value: 300, name: '艺术类' }, { value: 580, name: '经管类' },
      { value: 590, name: '文学类' }, { value: 680, name: '电子商务类' }, { value: 880, name: '计算机类' }
    ]
  };
  libraryChartInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'right', top: 'center' },
    series: [{
      type: 'pie', radius: ['50%', '70%'], center: ['40%', '50%'], avoidLabelOverlap: false,
      label: { show: true, position: 'center', formatter: () => `总借阅\n${libraryData.total}本`, fontSize: 18, fontWeight: 'bold' },
      data: libraryData.categories, itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }
    }]
  });

  dormChartInstance = echarts.init(dormChart.value);
  dormChartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['出', '入'], top: '5%' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'] },
    yAxis: { type: 'value' },
    series: [
      { name: '出', type: 'line', smooth: true, data: [120, 132, 101, 134, 90, 230, 210], areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255, 77, 77, 0.5)' }, { offset: 1, color: 'rgba(255, 77, 77, 0)' }]) } },
      { name: '入', type: 'line', smooth: true, data: [220, 182, 191, 234, 290, 330, 310], areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(75, 156, 255, 0.5)' }, { offset: 1, color: 'rgba(75, 156, 255, 0)' }]) },
        markLine: { symbol: 'none', data: [ { name: '集中回宿', xAxis: '21:00', label: { formatter: '集中回宿 21:40' } }, { name: '熄灯', xAxis: '22:00', label: { formatter: '熄灯' } } ], lineStyle: { type: 'dashed' } }
      }
    ]
  });

  consumptionChartInstance = echarts.init(consumptionChart.value);
  const consumptionData = {
    total: 1220,
    categories: [ {value: 288, name: '食堂'}, {value: 68, name: '超市'}, {value: 59, name: '水吧'}, {value: 23, name: '理发'}, {value: 20, name: '其他'}, {value: 4, name: '打印'} ]
  };
  consumptionChartInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'right', top: 'center' },
    series: [{
      type: 'pie', radius: ['50%', '70%'], center: ['40%', '50%'], avoidLabelOverlap: false,
      label: { show: true, position: 'center', formatter: () => `月人均\n${consumptionData.total}元`, fontSize: 18, fontWeight: 'bold' },
      data: consumptionData.categories, itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }
    }]
  });

  networkChartInstance = echarts.init(networkChart.value);
  networkChartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['上网', '用电'], top: '5%' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['07:00', '10:00', '13:00', '16:00', '19:00', '22:00', '01:00', '04:00'] },
    yAxis: { type: 'value' },
    series: [
      { name: '上网', type: 'line', smooth: true, data: [300, 280, 250, 320, 450, 400, 200, 220], areaStyle: { opacity: 0.3 } },
      { name: '用电', type: 'line', smooth: true, data: [400, 420, 380, 480, 600, 550, 300, 320], areaStyle: { opacity: 0.3 } }
    ]
  });

  forumChartInstance = echarts.init(forumChart.value);
  const forumData = [ { value: 1048, name: '社会话题' }, { value: 735, name: '科学技术' }, { value: 580, name: '二次猿' }, { value: 484, name: '两性话题' }, { value: 300, name: '星座' }, { value: 300, name: '国际政治' } ];
  forumChartInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'right', top: 'center' },
    series: [{
      type: 'pie', radius: '50%', center: ['40%', '50%'], data: forumData,
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
    }]
  });

  labUsageChartInstance = echarts.init(labUsageChart.value);
  labUsageChartInstance.setOption({
    tooltip: { trigger: 'item' },
    xAxis: { type: 'category', name: '日期', data: Array.from({length: 30}, (_, i) => i + 1) },
    yAxis: { type: 'value', name: '停留时长' },
    series: [{
      symbolSize: 10,
      data: Array.from({length: 30}, () => [Math.floor(Math.random() * 30) + 1, (Math.random() * 8).toFixed(1)]),
      type: 'scatter'
    }]
  });

  window.addEventListener('resize', () => {
    chartInstances.forEach(instance => instance?.resize());
  });
};

onMounted(() => {
  nextTick(() => {
    initCharts();
  });
});

</script>

<style scoped>
.student-behavior-data {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 24px;
  background-color: #f7f8fa;
}
.page-title { padding-bottom: 24px; }
.page-title h1 { font-size: 24px; font-weight: 600; color: #333; margin-bottom: 8px; }
.page-title p { font-size: 14px; color: #666; }

.student-view-container { max-width: 1200px; margin: 0 auto; }
.student-detail-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
  background: #fdfdfd; padding: 20px; border-radius: 12px; border: 1px solid #f0f0f0;
}
.student-display { display: flex; align-items: center; gap: 16px; }
.current-student-label { font-size: 16px; color: #555; font-weight: 600; }
.student-info-card {
  display: flex; align-items: center; gap: 16px;
  background-color: #f0f5ff; padding: 12px 20px; border-radius: 12px;
}
.student-avatar-display { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
.student-details { display: flex; flex-direction: column; gap: 2px; width: 120px; }
.student-name { font-size: 18px; font-weight: 600; color: #333; }
.student-id, .student-class { font-size: 13px; color: #666; }
.switch-student-btn {
  background-color: #4b9cff; color: white; border: none; padding: 10px 18px; border-radius: 8px;
  font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px; margin-left: 24px;
  transition: background-color 0.3s;
}
.switch-student-btn:hover { background-color: #2a7be1; }
.back-btn {
  background-color: #f0f5ff; color: #4b9cff; border: 1px solid #d6e4ff; padding: 10px 20px;
  border-radius: 8px; font-size: 15px; cursor: pointer; display: flex; align-items: center; gap: 8px;
  transition: all 0.3s;
}
.back-btn:hover { background-color: #e6f0ff; border-color: #adc6ff; }
.section-title-header { font-size: 18px; font-weight: 600; color: #333; margin: 24px 0 16px;display: flex;}
.abnormal-behavior-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px; }
.ab-card { padding: 24px; border-radius: 12px; text-align: center; }
.ab-card.absence { background-color: #fff1f0; border: 1px solid #ffccc7; }
.ab-card.late-active { background-color: #fffbe6; border: 1px solid #ffe58f; }
.ab-card.consumption-drop { background-color: #f6ffed; border: 1px solid #d9f7be; }
.ab-title { font-size: 16px; color: #555; margin-bottom: 8px; }
.ab-value { font-size: 36px; font-weight: 700; margin-bottom: 8px; }
.ab-card.absence .ab-value { color: #f5222d; }
.ab-card.late-active .ab-value { color: #d48806; }
.ab-card.consumption-drop .ab-value { color: #389e0d; }
.ab-desc { font-size: 14px; color: #888; }
.student-dashboard-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.data-module {
  background: #fdfdfd; padding: 24px; border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: all 0.3s ease;
}
.data-module:hover { transform: translateY(-5px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0; }
.module-header h3 { font-size: 18px; font-weight: 600; color: #333; }
.chart-container { height: 300px; }
.consumption-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; align-items: center;}
.tag-label { font-size: 14px; color: #555; font-weight: 500; margin-right: 8px;}
.book-tag { border-radius: 20px; padding: 8px 16px; font-size: 14px; background-color: #f0f2f5; color: #555; }
</style> 