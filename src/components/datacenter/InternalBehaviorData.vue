<template>
  <div class="behavior-data-page">
    <div class="page-header">
      <h1>数据中心 - 校内行为数据</h1>
      <p>利用AI深度分析涵盖学习、生活、社交等多维度的校内行为数据，学校得以在教学个性化、管理精细化、服务精准化及安全保障智能化方面获得强大赋能，显著提升教育质量和运营效能。</p>
    </div>

    <!-- 学生选择区域 -->
    <div class="student-selector-bar">
      <div v-if="!selectedStudent" class="overview-mode">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <span>当前为全校数据概览</span>
      </div>
      <div v-else class="student-info-mode">
        <div class="student-avatar">
          <span>{{ selectedStudent.name.charAt(0) }}</span>
        </div>
        <div class="student-details">
          <span class="student-name">{{ selectedStudent.name }}</span>
          <span class="student-id">{{ selectedStudent.id }} - {{ selectedStudent.major }}</span>
        </div>
        <button class="change-student-btn" @click="clearStudent">切换</button>
      </div>
      <button v-if="!selectedStudent" class="add-student-btn" @click="showStudentSelector = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>选择学生</span>
      </button>
    </div>

    <!-- 全校数据概览 -->
    <div v-if="!selectedStudent" class="data-content overview-grid">
      <!-- 异常行为 -->
      <div class="grid-section full-width">
         <h2 class="section-title">异常行为</h2>
         <div class="abnormal-cards-row">
           <div class="abnormal-card">
             <h4>频繁缺勤</h4>
             <p class="abnormal-value">37人</p>
             <span class="abnormal-desc">近一月缺勤超过5次</span>
           </div>
           <div class="abnormal-card">
             <h4>深夜活跃</h4>
             <p class="abnormal-value">128人</p>
             <span class="abnormal-desc">近一月超过5次在凌晨2点后有网络活动</span>
           </div>
           <div class="abnormal-card">
             <h4>消费骤减</h4>
             <p class="abnormal-value">52人</p>
             <span class="abnormal-desc">近一月消费额度环比下降超过60%</span>
           </div>
         </div>
       </div>
       
      <!-- 课后行为 -->
      <div class="grid-section full-width">
        <h2 class="section-title">课后行为概览</h2>
      </div>

      <!-- 1. 图书馆借阅 -->
      <div class="grid-card">
        <h3 class="card-title">图书馆借阅</h3>
        <div class="card-subtitle">
          <span>明星借阅人</span>
        </div>
        <div class="top-students-horizontal">
          <div class="student-item" v-for="student in topBorrowers" :key="student.name">
            <img :src="student.avatar" :alt="student.name" class="avatar-large">
            <div class="student-name">{{ student.name }}</div>
            <div class="borrow-count">{{ student.count }}本</div>
          </div>
        </div>
        <div class="card-subtitle">
          <span>明星书籍</span>
        </div>
        <div class="star-books">
          <span v-for="book in starBooks" :key="book" class="book-tag">{{ book }}</span>
        </div>
        <div class="library-stats-grid">
          <div class="chart-container" ref="bookCategoryChart"></div>
          <div class="custom-legend">
            <div class="legend-item" v-for="item in bookCategories" :key="item.name">
              <span class="legend-color-box" :style="{ backgroundColor: item.color }"></span>
              <span class="legend-name">{{ item.name }}</span>
              <span class="legend-value">{{ item.value }}本</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 宿舍出入 -->
      <div class="grid-card">
        <h3 class="card-title">宿舍出入</h3>
        <div class="dorm-lists-container">
          <div class="dorm-list-section">
            <div class="card-subtitle">
              <span>优秀宿舍</span>
            </div>
            <div class="dorm-tags">
              <span class="dorm-tag good">3栋-301 (女生)</span>
              <span class="dorm-tag good">5栋-211 (女生)</span>
            </div>
          </div>
          <div class="dorm-list-section">
            <div class="card-subtitle">
              <span>整改宿舍</span>
            </div>
            <div class="dorm-tags">
              <span class="dorm-tag bad">5栋-211 (女生)</span>
              <span class="dorm-tag bad">3栋-410 (男生)</span>
            </div>
          </div>
        </div>
        <div class="card-subtitle">
          <span>晚归黑名单</span>
        </div>
        <div class="top-students-horizontal">
           <div class="student-item" v-for="student in lateReturnBlacklist" :key="student.name">
            <img :src="student.avatar" :alt="student.name" class="avatar-large">
            <div class="student-name">{{ student.name }}</div>
            <div class="dorm-info">{{ student.dorm }}</div>
          </div>
        </div>
        <div class="chart-container" ref="dormAccessChart"></div>
      </div>

      <!-- 3. 校园消费 -->
      <div class="grid-card">
        <h3 class="card-title">校园消费</h3>
        <div class="card-subtitle">
          <span>高消费商品</span>
        </div>
        <div class="star-books consumption-tags">
          <span v-for="item in highConsumptionItems" :key="item.name" class="book-tag" :style="{ backgroundColor: item.color, color: item.textColor || '#333' }">{{ item.name }}</span>
        </div>
        <div class="library-stats-grid">
          <div class="chart-container" ref="consumptionChart"></div>
          <div class="custom-legend">
            <div class="legend-item" v-for="item in consumptionCategories" :key="item.name">
              <span class="legend-color-box" :style="{ backgroundColor: item.color }"></span>
              <span class="legend-name">{{ item.name }}</span>
              <span class="legend-value">{{ item.value }}元</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 4. 上网/用电 -->
      <div class="grid-card">
        <h3 class="card-title">上网/用电</h3>
        <div class="dorm-lists-container">
          <div class="dorm-list-section">
            <div class="card-subtitle">
              <span>用电量大</span>
            </div>
            <div class="dorm-tags">
              <span class="dorm-tag bad">3栋-301 (女生)</span>
              <span class="dorm-tag bad">5栋-211 (女生)</span>
            </div>
          </div>
          <div class="dorm-list-section">
            <div class="card-subtitle">
              <span>用电量小</span>
            </div>
            <div class="dorm-tags">
              <span class="dorm-tag good">5栋-211 (女生)</span>
              <span class="dorm-tag good">3栋-410 (男生)</span>
            </div>
          </div>
        </div>
        <div class="chart-container" ref="networkUsageChart"></div>
      </div>

      <!-- 5. 校内论坛 -->
      <div class="grid-card">
        <h3 class="card-title">校内论坛</h3>
        <div class="card-subtitle">热门话题</div>
        <div class="star-books consumption-tags">
          <span v-for="item in hotTopics" :key="item.name" class="book-tag" :style="{ backgroundColor: item.color, color: item.textColor || '#333' }">{{ item.name }}</span>
        </div>
        <div class="library-stats-grid">
          <div class="chart-container" ref="forumTopicChart"></div>
          <div class="custom-legend">
            <div class="legend-item" v-for="item in forumCategories" :key="item.name">
              <span class="legend-color-box" :style="{ backgroundColor: item.color }"></span>
              <span class="legend-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. 实验室使用 -->
      <div class="grid-card">
        <h3 class="card-title">实验室使用</h3>
        <div class="card-subtitle">科研项目</div>
        <div class="star-books consumption-tags">
          <span v-for="item in researchProjects" :key="item" class="book-tag project-tag">{{ item }}</span>
        </div>
        <div class="chart-container" ref="labUsageChart"></div>
      </div>
      

    </div>

    <!-- 学生个人数据 -->
    <div v-else class="data-content individual-grid">
      <div class="grid-section after-class-behavior">
        <h2 class="section-title">课后行为记录</h2>
        <div class="behavior-list">
          <div class="behavior-item"><strong>图书馆借阅:</strong> 过去一月借阅 <span>{{ studentData.library.count }}</span> 本，常借阅 <span>{{ studentData.library.category }}</span> 类书籍。</div>
          <div class="behavior-item"><strong>宿舍出入:</strong> 平均晚归时间 <span>{{ studentData.dorm.lateReturn }}</span>，周末不归次数 <span>{{ studentData.dorm.notReturn }}</span> 次。</div>
          <div class="behavior-item"><strong>校园消费:</strong> 月均消费 <span>{{ studentData.consumption.average }}</span> 元，主要用于 <span>{{ studentData.consumption.majorCategory }}</span>。</div>
          <div class.="behavior-item"><strong>网络登录:</strong> 日均上网时长 <span>{{ studentData.network.duration }}</span> 小时，活跃时段 <span>{{ studentData.network.activePeriod }}</span>。</div>
          <div class="behavior-item"><strong>校内论坛:</strong> 发帖 <span>{{ studentData.forum.posts }}</span> 次，回帖 <span>{{ studentData.forum.replies }}</span> 次。</div>
          <div class="behavior-item"><strong>体育馆/实验室:</strong> 上月进入体育馆 <span>{{ studentData.facilities.gym }}</span> 次，实验室 <span>{{ studentData.facilities.lab }}</span> 次。</div>
        </div>
      </div>
      <div class="grid-section abnormal-behavior">
        <h2 class="section-title">异常行为警示</h2>
         <div class="abnormal-list">
           <div :class="['abnormal-item', { 'is-warning': studentData.abnormal.frequentAbsence }]">
             <strong>频繁缺勤:</strong> {{ studentData.abnormal.frequentAbsence ? '是' : '否' }}
           </div>
           <div :class="['abnormal-item', { 'is-warning': studentData.abnormal.lateNightActivity }]">
             <strong>深夜活跃:</strong> {{ studentData.abnormal.lateNightActivity ? '是' : '否' }}
           </div>
           <div :class="['abnormal-item', { 'is-warning': studentData.abnormal.consumptionDrop }]">
             <strong>消费骤减:</strong> {{ studentData.abnormal.consumptionDrop ? '是' : '否' }}
           </div>
        </div>
      </div>
    </div>
    
    <!-- 学生选择弹窗 -->
    <div v-if="showStudentSelector" class="modal-overlay" @click="showStudentSelector = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>选择学生</h3>
          <button @click="showStudentSelector = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <input type="text" v-model="studentSearch" placeholder="搜索学号或姓名..." class="student-search-input"/>
          <ul class="student-list">
            <li v-for="student in filteredStudents" :key="student.id" @click="onStudentSelected(student)">
              {{ student.name }} ({{ student.id }}) - {{ student.major }}
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import * as echarts from 'echarts';

const router = useRouter();

const selectedStudent = ref(null);
const showStudentSelector = ref(false);
const studentSearch = ref('');

// --- Mock Data ---
const surnames = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨'];
const givenNames = ['伟', '芳', '娜', '敏', '静', '磊', '洋', '艳', '勇', '杰', '涛', '明', '强', '丽', '娟'];

const mockStudents = Array.from({ length: 50 }, (_, i) => {
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const givenName1 = givenNames[Math.floor(Math.random() * givenNames.length)];
  const givenName2 = Math.random() > 0.5 ? givenNames[Math.floor(Math.random() * givenNames.length)] : '';
  return {
    id: `21010${String(i).padStart(2, '0')}`,
    name: surname + givenName1 + givenName2,
    major: ['计算机科学', '软件工程', '人工智能'][i % 3],
  }
});

const topBorrowers = ref([
    { name: '张洋', count: 57, avatar: '/pic/student01.png' },
    { name: '李明亮', count: 39, avatar: '/pic/student02.png' },
    { name: '刘茹', count: 28, avatar: '/pic/student03.png' },
    { name: '王燕', count: 15, avatar: '/pic/student04.png' },
    { name: '吴晓月', count: 7, avatar: '/pic/student05.png' },
]);

const starBooks = ref(['薛少峰的经济学演绎', 'AI大脑应用技术', '电子商务智能化', '泥潭', '数字人应用技术']);

const highConsumptionItems = ref([
    { name: '蜜雪冰城', color: '#fff7e6' }, { name: '小炒黄牛肉', color: '#e6f7ff' },
    { name: '亲亲虾条', color: '#f6ffed' }, { name: '冰拿铁', color: '#fff7e6' },
    { name: '理发', color: '#fff1f0' }, { name: '论文装订', color: '#e6f7ff', textColor: '#1677ff' },
    { name: '裁剪', color: '#f6ffed' }, { name: '共享单车', color: '#f6ffed' },
    { name: '健身房', color: '#f6ffed' }, { name: '珍珠奶茶', color: '#fff7e6' },
    { name: '小鸡炖蘑菇', color: '#e6f7ff' },
]);

const hotTopics = ref([
    { name: '9月3日会停课吗？', color: '#f9c566'},
    { name: '张馨月参加比赛的高清视频', color: '#97d27f'},
    { name: '高新产业人工智能论坛', color: '#e47b77'},
    { name: 'BLACK', color: '#56b17c', textColor: '#fff'},
    { name: '校园歌手大赛', color: '#56b17c', textColor: '#fff'},
    { name: '小鸡炖蘑菇', color: '#5b6ac0', textColor: '#fff'},
    { name: 'MBTI', color: '#82cae1', textColor: '#fff'},
]);

const lateReturnBlacklist = ref([
    { name: '孙海', dorm: '3栋-301', avatar: '/pic/student01.png' },
    { name: '刘薇', dorm: '3栋-410', avatar: '/pic/student02.png' },
    { name: '刘茹', dorm: '3栋-301', avatar: '/pic/student03.png' },
    { name: '王美如', dorm: '3栋-410', avatar: '/pic/student04.png' },
    { name: '赵明伟', dorm: '3栋-410', avatar: '/pic/student05.png' },
]);

const bookCategories = ref([
    { name: '理工类', value: 484, color: '#82cae1' },
    { name: '艺术类', value: 300, color: '#56b17c' },
    { name: '经管理类', value: 580, color: '#e47b77' },
    { name: '文学类', value: 590, color: '#f9c566' },
    { name: '电子商务类', value: 680, color: '#97d27f' },
    { name: '计算机类', value: 880, color: '#5b6ac0' },
]);

const consumptionCategories = ref([
    { name: '打印', value: 4, color: '#82cae1' },
    { name: '其他', value: 20, color: '#56b17c' },
    { name: '理发', value: 23, color: '#e47b77' },
    { name: '水吧', value: 59, color: '#f9c566' },
    { name: '超市', value: 68, color: '#97d27f' },
    { name: '食堂', value: 288, color: '#5b6ac0' },
]);

const forumCategories = ref([
    { name: '社会话题', color: '#5b6ac0' },
    { name: '科学技术', color: '#97d27f' },
    { name: '二次元', color: '#f9c566' },
    { name: '两性话题', color: '#e47b77' },
    { name: '星座', color: '#82cae1' },
    { name: '国际政治', color: '#56b17c' },
]);

const researchProjects = ref(['人工智能赋能农耕业乡村振兴', '自动识别票据赋能企业成本控制']);

const studentData = ref({});

const filteredStudents = computed(() => {
  if (!studentSearch.value) return mockStudents;
  const search = studentSearch.value.toLowerCase();
  return mockStudents.filter(s => s.name.toLowerCase().includes(search) || s.id.toLowerCase().includes(search));
});

function onStudentSelected(student) {
  router.push({ path: '/student-behavior', query: { id: student.id } });
  showStudentSelector.value = false;
}

function clearStudent() {
  selectedStudent.value = null;
  nextTick(() => {
    initCharts();
  });
}

// ECharts
const bookCategoryChart = ref(null);
const dormAccessChart = ref(null);
const consumptionChart = ref(null);
const networkUsageChart = ref(null);
const forumTopicChart = ref(null);
const labUsageChart = ref(null);

function initCharts() {
  const colorPalette = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
  const textStyle = { color: '#666', fontFamily: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif' };
  const axisCommon = {
    axisLine: { lineStyle: { color: '#ccc' } },
    axisTick: { show: false },
    axisLabel: { color: '#666' },
    splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
  };
  const pieLabel = {
      show: true,
      fontSize: 12,
      formatter: '{b}\n{d}%',
      color: '#333'
  };

  // 1. Book Category Chart
  echarts.init(bookCategoryChart.value).setOption({
    color: bookCategories.value.map(c => c.color),
    tooltip: { trigger: 'item' },
    graphic: {
        type: 'text',
        left: 'center',
        top: '40%',
        style: {
            text: '总借阅',
            textAlign: 'center',
            fill: '#666',
            fontSize: 16
        }
    },
    series: [{
      name: '书籍类型', type: 'pie', radius: ['65%', '85%'], center: ['50%', '50%'], 
      data: bookCategories.value.map(c => ({value: c.value, name: c.name})),
      label: { show: false },
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 5 },
      emphasis: {
          scaleSize: 10
      }
    }]
  });

  // Re-add the total count text, because the previous one gets overwritten
  const chartInstance = echarts.getInstanceByDom(bookCategoryChart.value);
  chartInstance.setOption({
      graphic: [{
          id: 'totalText',
          type: 'text',
          left: 'center',
          top: '52%',
          style: {
              text: '3147本',
              textAlign: 'center',
              fill: '#333',
              fontSize: 24,
              fontWeight: 'bold'
          }
      }, {
        id: 'titleText',
        type: 'text',
        left: 'center',
        top: '40%',
        style: {
            text: '总借阅',
            textAlign: 'center',
            fill: '#666',
            fontSize: 16
        }
      }]
  });


  // 2. Dorm Access Chart
  echarts.init(dormAccessChart.value).setOption({
    color: ['#82cae1', '#e47b77'],
    tooltip: { trigger: 'axis' },
    legend: {
        data: ['男生', '女生'],
        top: 0,
        textStyle
    },
    xAxis: { ...axisCommon, type: 'category', data: ['18:00', '19:00', '20:00', '21:00', '22:00(熄灯)', '23:00', '24:00', '01:00'] },
    yAxis: { ...axisCommon, type: 'value' },
    series: [
        { 
            name: '女生', type: 'line', smooth: true, data: [120, 200, 150, 80, 70, 110, 130, 50],
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0, color: 'rgba(228, 123, 119, 0.5)'
                }, {
                offset: 1, color: 'rgba(228, 123, 119, 0)'
                }])
            }
        },
        { 
            name: '男生', type: 'line', smooth: true, data: [220, 182, 191, 234, 290, 330, 310, 150],
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0, color: 'rgba(130, 202, 225, 0.5)'
                }, {
                offset: 1, color: 'rgba(130, 202, 225, 0)'
                }])
            },
            markLine: {
                silent: true,
                symbol: 'none',
                data: [{
                    xAxis: '21:00',
                    label: {
                        formatter: '集中回寝 21:40',
                        position: 'insideStartTop',
                        color: '#666'
                    },
                    lineStyle: {
                        type: 'dashed'
                    }
                }]
            }
        }
    ],
    grid: { top: '15%', bottom: '15%', left: '10%', right: '5%' }
  });
  
  // 3. 校园消费
  echarts.init(consumptionChart.value).setOption({
    color: consumptionCategories.value.map(c => c.color),
    tooltip: { trigger: 'item' },
     graphic: {
        type: 'text',
        left: 'center',
        top: '40%',
        style: { text: '月人均', textAlign: 'center', fill: '#666', fontSize: 16 }
    },
    series: [{
      name: '消费类型', type: 'pie', radius: ['65%', '85%'], center: ['50%', '50%'],
      data: consumptionCategories.value.map(c => ({ value: c.value, name: c.name })),
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 5 },
      label: { show: false }
    }]
  });
  echarts.getInstanceByDom(consumptionChart.value).setOption({
      graphic: [{
          id: 'totalText', type: 'text', left: 'center', top: '52%',
          style: { text: '1220元', textAlign: 'center', fill: '#333', fontSize: 24, fontWeight: 'bold' }
      }, {
        id: 'titleText', type: 'text', left: 'center', top: '40%',
        style: { text: '月人均', textAlign: 'center', fill: '#666', fontSize: 16 }
      }]
  });


  // 4. 上网/用电
  echarts.init(networkUsageChart.value).setOption({
    color: ['#e47b77', '#82cae1'],
    tooltip: { trigger: 'axis' },
    legend: { data: ['上网', '用电'], top: 0, textStyle },
    xAxis: { ...axisCommon, type: 'category', data: ['07:00', '10:00', '13:00', '16:00', '19:00', '22:00', '01:00', '04:00'] },
    yAxis: { ...axisCommon, type: 'value', max: 700 },
    series: [{ 
      name: '上网', type: 'line', smooth: true, data: [280, 400, 250, 300, 450, 300, 200, 300],
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0, color: 'rgba(228, 123, 119, 0.5)'
        }, {
          offset: 1, color: 'rgba(228, 123, 119, 0)'
        }])
      }
    }, {
      name: '用电', type: 'line', smooth: true, data: [450, 500, 400, 550, 680, 450, 300, 200],
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0, color: 'rgba(130, 202, 225, 0.5)'
        }, {
          offset: 1, color: 'rgba(130, 202, 225, 0)'
        }])
      }
    }],
    grid: { top: '15%', bottom: '15%', left: '10%', right: '5%' }
  });

  // 5. 校内论坛
  echarts.init(forumTopicChart.value).setOption({
    color: forumCategories.value.map(c => c.color),
    tooltip: { trigger: 'item' },
    series: [{
        name: '话题占比', type: 'pie', radius: '80%', center: ['50%', '50%'],
        data: [
          {value: 450, name: '社会话题'}, {value: 310, name: '科学技术'},
          {value: 235, name: '二次元'}, {value: 180, name: '两性话题'},
          {value: 150, name: '星座'}, {value: 80, name: '国际政治'},
        ],
        itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
        label: { show: false }
    }]
  });

  // 6. 实验室使用
  const labUsageData = {
    labels: ['物理-01', '物理-02', '计算机-01', '电焊-02', '焊接-02', '焊接-02 '],
    values: [4.8, 5.8, 6.9, 2.3, 4.1, 1.8],
    colors: ['#5b6ac0', '#5b6ac0', '#f9c566', '#56b17c', '#e47b77', '#e47b77']
  };
  echarts.init(labUsageChart.value).setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { ...axisCommon, type: 'category', data: labUsageData.labels },
    yAxis: { ...axisCommon, type: 'value', max: 7, splitNumber: 4 },
    series: [{ 
      type: 'bar', 
      data: labUsageData.values.map((value, index) => ({
        value,
        itemStyle: { color: labUsageData.colors[index], borderRadius: [10, 10, 0, 0] }
      }))
    }],
    grid: { top: '10%', bottom: '15%', left: '10%', right: '5%' }
  });
  
}

onMounted(() => {
  if (!selectedStudent.value) {
    initCharts();
  }
});

</script>

<style scoped>
.behavior-data-page {
  padding: 2px 48px 48px;
  background-color: #f7f8fa;
  min-height: 100vh;
  width: 100vw;
  max-width: 1440px;
  margin: 0 auto;
}
.page-header {
  padding-top: 24px;
  padding-bottom: 30px;
}
.page-header h1 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #4b9cff;
}
.page-header p {
  font-size: 16px;
  color: #666;
}

/* Selector Bar */
.student-selector-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 24px;
}
.overview-mode, .student-info-mode {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}
.overview-mode svg {
  color: #1677ff;
}
.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1677ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.student-details {
  display: flex;
  flex-direction: column;
}
.student-name {
  font-weight: 600;
  color: #333;
}
.student-id {
  font-size: 13px;
  color: #888;
}
.add-student-btn, .change-student-btn {
  background: #1677ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.change-student-btn {
  background: #f0f0f0;
  color: #555;
}

/* Data Content */
.data-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}
.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

/* Overview Grid */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.grid-card {
  border: 1px solid #e8e8e8;
  padding: 24px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}
.grid-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}
.card-content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  align-items: center;
}
.chart-container {
  height: 250px;
}
.chart-container.small-chart {
  height: 200px;
}

.top-list, .info-list {
  align-self: flex-start;
  font-family: Inter, sans-serif;
}
.top-list h4, .info-list h4 {
  font-size: 15px;
  margin-bottom: 12px;
  color: #333;
  font-weight: 600;
}
.top-list ul, .info-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.top-list li, .info-list li {
  padding: 8px 12px;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 6px;
  background-color: #fafafa;
}
.top-list li .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}
.top-list li:last-child, .info-list li:last-child {
  border-bottom: none;
}
.top-value {
  font-weight: bold;
  color: #1677ff;
}

.top-students-horizontal {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-bottom: 24px;
}
.student-item .avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
  border: 2px solid #eee;
}
.student-item .student-name {
  font-size: 14px;
  font-weight: 500;
}
.student-item .borrow-count {
  font-size: 14px;
  color: #1677ff;
  font-weight: bold;
}
.student-item .dorm-info {
    font-size: 13px;
    color: #888;
}

.star-books {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}
.book-tag {
  background-color: #f7f7f7;

  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
  color: #555;
}

.consumption-tags .book-tag {
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
}
.consumption-tags .book-tag.project-tag {
  background-color: #f0f2f5;
  color: #555;
  font-weight: 500;
}

.library-stats-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  align-items: center;
}
.custom-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.legend-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.legend-color-box {
  width: 20px;
  height: 12px;
  border-radius: 3px;
  margin-right: 12px;
}
.legend-name {
  color: #555;
  width: 80px;
}
.legend-value {
  font-weight: 600;
  color: #333;
}

.dorm-lists-container {
    display: flex;
    gap: 24px;
    margin-bottom: 20px;
}
.dorm-list-section {
    flex: 1;
}
.dorm-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.dorm-tag {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 13px;

}
.dorm-tag.good {
    background-color: #f6ffed;
    border-color: #b7eb8f;
    color: #389e0d;
}
.dorm-tag.bad {
    background-color: #fff1f0;
    border-color: #ffa39e;
    color: #cf1322;
}

.grid-section.full-width {
  grid-column: 1 / -1;
}
.grid-section .section-title {
  border: none;
  margin-bottom: 0;
}

.abnormal-cards-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}
.abnormal-card {
  background-color: #fff1f0;
  border: 1px solid #ffccc7;
  color: #cf1322;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}
.abnormal-card:hover {
  transform: scale(1.05);
}
.abnormal-card:nth-child(2) {
  background-color: #fff7e6;
  border-color: #ffe7ba;
  color: #d46b08;
}
.abnormal-card:nth-child(3) {
  background-color: #f6ffed;
  border-color: #d9f7be;
  color: #389e0d;
}
.abnormal-value {
  font-size: 32px;
  font-weight: 700;
  margin: 8px 0;
}

/* Individual Grid */
.individual-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}
.behavior-list, .abnormal-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.behavior-item, .abnormal-item {
  font-size: 15px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
.behavior-item span {
  font-weight: 600;
  color: #1677ff;
}
.abnormal-item {
  font-weight: 500;
}
.abnormal-item.is-warning {
  background-color: #fff1f0;
  color: #cf1322;
  font-weight: 700;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  width: 600px;
  max-width: 90vw;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}
.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #888;
}
.modal-body {
  padding: 24px;
}
.student-search-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 16px;
  box-sizing: border-box;
}
.student-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 50vh;
  overflow-y: auto;
}
.student-list li {
  padding: 16px 8px;
  cursor: pointer;
  border-radius: 4px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  color: #333;
  transition: background-color 0.2s;
}
.student-list li:last-child {
  border-bottom: none;
}
.student-list li:hover {
  background-color: #f0f5ff;
}

</style> 