<template>
  <div class="portal-home-page">
    <div class="portal-main-grid">
      <!-- 左一：个人信息＋日历今日课程 -->
      <div class="portal-profile-col">
        <!-- 个人信息区块 -->
        <div class="portal-card profile-info-card">
          <div class="profile-header">
            <img src="/pic/teacher/66.jpg" class="profile-avatar" alt="avatar">
            <div class="profile-info-main">
              <div class="profile-welcome">婉婷老师，您辛苦了！</div>
              <div class="profile-date-weather">{{ currentDate }}（{{ currentWeekday }}） · {{ weatherInfo }}</div>
            </div>
          </div>
          <div class="profile-honor-list">
            <span class="honor-chip">🏆 优秀教师</span>
            <span class="honor-chip">💼 学科负责人</span>
            <span class="honor-chip">🎉 跨校教研组长</span>
            <span class="honor-chip">📚 杰出教研贡献</span>
          </div>
        </div>
        <!-- 日历+今日课程卡片 -->
        <div class="portal-card profile-calendar-card">
          <div class="calendar-head-row">
            <div class="calendar-title">本周课程</div>
          </div>
          <div class="calendar-week-row">
            <!-- 星期标题行：一一对应7天，与下方日期对齐 -->
            <div class="calendar-weekdays-row">
              <div v-for="(_, idx) in weekDays" :key="'wk'+idx" class="calendar-weekday-portal">
                {{ ['一','二','三','四','五','六','日'][idx] }}
              </div>
            </div>
            <!-- 日期行：7个日期，与上面星期一一对齐 -->
            <div class="calendar-days-row">
              <div v-for="(day,idx) in weekDays" :key="day.date" class="calendar-day-portal" :class="{selected: calendarSelectedDate===day.date, today: day.isToday}" @click="calendarSelectedDate=day.date">
                <span class="day-main">{{ day.day }}</span>
                <span v-if="day.courseCount>0" class="day-dot">{{ day.courseCount }}</span>
              </div>
            </div>
          </div>
          <div class="today-course-list-block">
            <div class="course-count-label">共 {{ dailyCourses.length }} 节课</div>
            <div v-if="!dailyCourses.length" class="no-course-note">本日无课程</div>
            <div v-for="c in dailyCourses" :key="c.id" class="today-course-item">
              <span class="tc-time">{{c.timeSlot}}</span>
              <span class="tc-name">{{c.name}}</span>
              <span class="tc-class">{{c.className}}</span>
              <span class="tc-room" v-if="c.classroom">{{c.classroom}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 左二：我的待办 + 年度办理 -->
      <div class="portal-card portal-todo-card">
        <div class="portal-card-header">
          <span>我的待办</span>
        </div>
        <div class="portal-todo-list">
          <div v-for="item in todosData[todoTab]" :key="item.id" class="portal-todo-item">
            <div class="todo-dot"></div>
            <div class="todo-main">
              <div class="todo-title"><span v-if="item.badge" class="todo-badge">{{item.badge}}</span>{{item.title}}
              </div>
              <div class="todo-info">{{item.time}} </div>
            </div>
          </div>
        </div>
        <!-- 年度办理统计调整至这里 -->
        <div class="portal-stat-blocks">
          <div class="stat-block stat-a">
            <div class="stat-number">127</div>
            <div class="stat-label">课程总数</div>
          </div>
          <div class="stat-block stat-b">
            <div class="stat-number">71</div>
            <div class="stat-label">教学成果</div>
          </div>
          <div class="stat-block stat-c">
            <div class="stat-number">89</div>
            <div class="stat-label">教学评价</div>
          </div>
        </div>
      </div>
      <!-- 右一：我的应用（九宫格）区块 -->
      <div class="portal-card portal-apps-card">
        <div class="portal-card-header">
          <span>我的应用</span>
        </div>
        <div class="portal-apps-grid">
          <div v-for="app in portalApps" :key="app.label" class="portal-app-item">
            <div class="portal-app-icon" :style="`background:${app.bg}`">{{app.icon}}</div>
            <div class="portal-app-label">{{app.label}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 人文关怀模块 -->
    <div class="portal-card portal-care-card">
      <div class="portal-card-header">
        <span>人文关怀</span>
      </div>
      <div class="care-content-grid">
        <!-- 教师生日 -->
        <div class="care-item-card care-teacher-birthday">
          <div class="care-item-header">
            <div class="care-item-icon">🎂</div>
            <div class="care-item-title">教师生日</div>
          </div>
          <div class="care-item-list">
            <div v-if="teacherBirthdays.length === 0" class="care-empty">本月无教师生日</div>
            <div v-for="item in teacherBirthdays" :key="item.id" class="care-item-row">
              <div class="care-avatar-wrapper">
                <img :src="item.avatar || '/pic/avatar1.jpeg'" class="care-avatar" :alt="item.name">
              </div>
              <div class="care-item-info">
                <div class="care-name">{{ item.name }}</div>
                <div class="care-date">{{ item.date }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 学生生日 -->
        <div class="care-item-card care-student-birthday">
          <div class="care-item-header">
            <div class="care-item-icon">🎈</div>
            <div class="care-item-title">学生生日</div>
          </div>
          <div class="care-item-list">
            <div v-if="studentBirthdays.length === 0" class="care-empty">本周无学生生日</div>
            <div v-for="item in studentBirthdays" :key="item.id" class="care-item-row">
              <div class="care-avatar-wrapper">
                <img :src="item.avatar || '/pic/student01.png'" class="care-avatar" :alt="item.name">
              </div>
              <div class="care-item-info">
                <div class="care-name">{{ item.name }}</div>
                <div class="care-class">{{ item.className }}</div>
                <div class="care-date">{{ item.date }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 学生获奖 -->
        <div class="care-item-card care-student-award">
          <div class="care-item-header">
            <div class="care-item-icon">🏆</div>
            <div class="care-item-title">学生获奖</div>
          </div>
          <div class="care-item-list">
            <div v-if="studentAwards.length === 0" class="care-empty">暂无获奖信息</div>
            <div v-for="item in studentAwards" :key="item.id" class="care-award-item">
              <div class="care-award-name">{{ item.name }}</div>
              <div class="care-award-title">{{ item.awardTitle }}</div>
              <div class="care-award-date">{{ item.date }}</div>
            </div>
          </div>
        </div>
        <!-- 团队获奖 -->
        <div class="care-item-card care-team-award">
          <div class="care-item-header">
            <div class="care-item-icon">🎉</div>
            <div class="care-item-title">团队获奖</div>
          </div>
          <div class="care-item-list">
            <div v-if="teamAwards.length === 0" class="care-empty">暂无团队获奖</div>
            <div v-for="item in teamAwards" :key="item.id" class="care-award-item">
              <div class="care-award-name">{{ item.teamName }}</div>
              <div class="care-award-title">{{ item.awardTitle }}</div>
              <div class="care-award-date">{{ item.date }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 校园新闻、评选章程、评教规则模块 -->
    <div class="portal-info-grid">
      <!-- 校园新闻 -->
      <div class="portal-card portal-news-card">
        <div class="portal-card-header">
          <span>校园新闻</span>
        </div>
        <div class="news-list">
          <div v-for="item in campusNews" :key="item.id" class="news-item" @click="handleNewsClick(item)">
            <div class="news-title">{{ item.title }}</div>
            <div class="news-date">{{ item.date }}</div>
          </div>
          <div v-if="campusNews.length === 0" class="news-empty">暂无新闻</div>
        </div>
      </div>
      <!-- 评选章程 -->
      <div class="portal-card portal-rules-card">
        <div class="portal-card-header">
          <span>评选章程</span>
        </div>
        <div class="rules-list">
          <div v-for="item in evaluationRules" :key="item.id" class="rules-item" @click="handleRulesClick(item)">
            <div class="rules-icon">{{ item.icon }}</div>
            <div class="rules-content">
              <div class="rules-title">{{ item.title }}</div>
              <div class="rules-desc">{{ item.description }}</div>
            </div>
          </div>
          <div v-if="evaluationRules.length === 0" class="rules-empty">暂无章程</div>
        </div>
      </div>
      <!-- 评教规则 -->
      <div class="portal-card portal-evaluation-card">
        <div class="portal-card-header">
          <span>评教规则</span>
        </div>
        <div class="evaluation-list">
          <div v-for="item in teachingEvaluationRules" :key="item.id" class="evaluation-item" @click="handleEvaluationClick(item)">
            <div class="evaluation-badge">{{ item.badge }}</div>
            <div class="evaluation-content">
              <div class="evaluation-title">{{ item.title }}</div>
              <div class="evaluation-date">{{ item.updateDate }}</div>
            </div>
          </div>
          <div v-if="teachingEvaluationRules.length === 0" class="evaluation-empty">暂无规则</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
// 原数据和方法
const portalApps = [
  { icon: '📄', label: '工作任务', bg: '#e9e8fe' },
  { icon: '✉️', label: '邮件通知', bg: '#fdf2df' },
  { icon: '📁', label: '共享文件', bg: '#e7f0fe' },
  { icon: '🌐', label: '网络硬盘', bg: '#e8f7e9' },
  { icon: '📊', label: '数据中心', bg: '#f3f3fd' },
  { icon: '🧪', label: '实验室使用', bg: '#e5fbe1' },
  { icon: '📋', label: '智能PPT', bg: '#ecf3fd' },
  { icon: '💻', label: '智能建课', bg: '#faecf2' },
  { icon: '📈', label: '智能报表', bg: '#efe5fd' },
  { icon: '🗂️', label: '资源库', bg: '#e6fcf5' },      // 新增应用1
  { icon: '🔔', label: '消息中心', bg: '#fef7e0' },    // 新增应用2
  { icon: '🚀', label: '创新活动', bg: '#eaeaff' },    // 新增应用3
];
const todoTab = ref('all');
const todosData = {
  all: [
    { id: 1, title: '请签字《信息中心》张寻提交的流程单', time: '2025-10-30', badge: '特办公文', link: '#', linkTitle: '待办公文' },
    { id: 2, title: '人工智能实验室使用申请单', time: '2025-10-30', badge: '待分发', link: '#', linkTitle: '待分发' },
    { id: 3, title: '系统推送：请及时上报12月财经论坛活动方案', time: '2025-10-29', badge: '', link: '', linkTitle: '' },
    { id: 4, title: '关于内部网站域名空间费用申报申请', time: '2025-10-28', badge: '需审批', link: '#', linkTitle: '查看详情' },
    { id: 5, title: '请签字《创新实验室》技术部三提交的流程单', time: '2025-10-28', badge: '', link: '#', linkTitle: '流程公文' }
  ],
  file: [
    { id: 1, title: '请签字《信息中心》张三提交的流程单', time: '2025-10-30', badge: '特办公文', link: '#', linkTitle: '待办公文' },
    { id: 5, title: '请签字《创新实验室》技术部三提交的流程单', time: '2025-10-28', badge: '', link: '#', linkTitle: '流程公文' },
  ],
  hr: [
    { id: 4, title: '关于内部网站域名空间费用申报申请', time: '2025-10-28', badge: '需审批', link: '#', linkTitle: '查看详情' }
  ]
};
// 获取当前日期的函数
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${year}年${month}月${day}日`;
};

// 获取当前星期的函数
const getCurrentWeekday = () => {
  const now = new Date();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return weekdays[now.getDay()];
};

// 获取天气信息（可以根据需要扩展为真实API调用）
const getWeatherInfo = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // 使用日期作为种子生成稳定的天气（同一天显示相同天气）
  const seed = month * 31 + day;
  
  // 常见的天气类型
  const weatherTypes = [
    { icon: '☀️', type: '晴', tempRange: [15, 28] },
    { icon: '⛅', type: '多云', tempRange: [12, 25] },
    { icon: '☁️', type: '阴', tempRange: [10, 22] },
    { icon: '🌦️', type: '小雨', tempRange: [8, 20] },
    { icon: '🌧️', type: '中雨', tempRange: [6, 18] },
    { icon: '⛈️', type: '雷阵雨', tempRange: [10, 22] },
    { icon: '🌨️', type: '雪', tempRange: [-5, 5] },
    { icon: '❄️', type: '小雪', tempRange: [-3, 3] },
    { icon: '🌫️', type: '雾', tempRange: [5, 15] },
    { icon: '💨', type: '大风', tempRange: [8, 20] }
  ];
  
  // 根据季节和日期选择天气
  let selectedWeather;
  const weatherIndex = seed % weatherTypes.length;
  selectedWeather = weatherTypes[weatherIndex];
  
  // 根据季节调整温度和天气类型
  if (month >= 3 && month <= 5) {
    // 春季：多为晴、多云、小雨
    const springWeathers = weatherTypes.filter(w => 
      ['晴', '多云', '阴', '小雨', '雾'].includes(w.type)
    );
    selectedWeather = springWeathers[seed % springWeathers.length];
    selectedWeather.tempRange = [12, 22];
  } else if (month >= 6 && month <= 8) {
    // 夏季：多为晴、多云、雷阵雨
    const summerWeathers = weatherTypes.filter(w => 
      ['晴', '多云', '雷阵雨', '中雨'].includes(w.type)
    );
    selectedWeather = summerWeathers[seed % summerWeathers.length];
    selectedWeather.tempRange = [22, 32];
  } else if (month >= 9 && month <= 11) {
    // 秋季：多为晴、多云、阴
    const autumnWeathers = weatherTypes.filter(w => 
      ['晴', '多云', '阴', '小雨', '雾'].includes(w.type)
    );
    selectedWeather = autumnWeathers[seed % autumnWeathers.length];
    selectedWeather.tempRange = [10, 20];
  } else {
    // 冬季：多为阴、雪、雾
    const winterWeathers = weatherTypes.filter(w => 
      ['阴', '雪', '小雪', '雾', '晴'].includes(w.type)
    );
    selectedWeather = winterWeathers[seed % winterWeathers.length];
    selectedWeather.tempRange = [-5, 10];
  }
  
  // 生成温度（在范围内随机，基于日期确保同一天相同）
  const tempSeed = (seed * 7) % 100;
  const tempRange = selectedWeather.tempRange;
  const temperature = tempRange[0] + Math.floor((tempRange[1] - tempRange[0]) * tempSeed / 100);
  
  return `${selectedWeather.icon} ${selectedWeather.type} ${temperature}°C`;
};

// 右侧个人区/日历/课程用简化示例数据
const currentDate = ref(getCurrentDate());
const currentWeekday = ref(getCurrentWeekday());
const weatherInfo = ref(getWeatherInfo());
const calendarSelectedDate = ref(new Date().toISOString().split('T')[0]);
const weekDays = computed(()=>[{day:27,date:'2025-10-27',isToday:false,courseCount:1},{day:28,date:'2025-10-28',isToday:false,courseCount:2},{day:29,date:'2025-10-29',isToday:false,courseCount:2},{day:30,date:'2025-10-30',isToday:true,courseCount:3},{day:31,date:'2025-10-31',isToday:false,courseCount:0},{day:1,date:'2025-11-01',isToday:false,courseCount:1},{day:2,date:'2025-11-02',isToday:false,courseCount:0}]);
const calendarRange = '2025.10.27 ~ 2025.10.31';
const selectedDateFormatted = computed(()=>{
  if (!calendarSelectedDate.value) return '';
  const d = calendarSelectedDate.value.split('-');
  return `${d[0]}年${d[1]}月${d[2]}日`;
});
const dailyCourses = computed(() => {
  const day = weekDays.value.find(d => d.date === calendarSelectedDate.value);
  if (!day || !day.courseCount) return [];
  // mock fake data
  return Array.from({ length: day.courseCount }).map((_, idx) => ({
    id: idx + 1,
    timeSlot: '08:00-09:40',
    name: `课程${idx + 1}`,
    className: 'XX班',
    classroom: '主楼101',
  }));
});

// 人文关怀数据
const teacherBirthdays = ref([
  { id: 1, name: '李圆圆', date: '10月28日', avatar: '/pic/avatar2.jpeg' },
  { id: 2, name: '王秋', date: '11月05日', avatar: '/pic/avatar3.png' },
  { id: 3, name: '张帅哲', date: '11月12日', avatar: '/pic/avatar4.jpg' },
]);

const studentBirthdays = ref([
  { id: 1, name: '李小明', className: '计算机一班', date: '10月31日', avatar: '/pic/student01.png' },
  { id: 2, name: '吕红', className: '软件一班', date: '11月01日', avatar: '/pic/student02.png' },
  { id: 3, name: '吴佩华', className: '计算机一班', date: '11月03日', avatar: '/pic/student03.png' },
]);

const studentAwards = ref([
  { id: 1, name: '张小亮', awardTitle: '数学竞赛一等奖', date: '2025-10-25' },
  { id: 2, name: '李小花', awardTitle: '作文比赛特等奖', date: '2025-10-20' },
  { id: 3, name: '王小强', awardTitle: '科技创新大赛金奖', date: '2025-10-18' },
  { id: 4, name: '王鹏', awardTitle: '科技创新大赛金奖', date: '2025-10-18' },
]);

const teamAwards = ref([
  { id: 1, teamName: '数学教研组', awardTitle: '优秀教学团队', date: '2025-10-28' },
  { id: 2, teamName: '科技创新小组', awardTitle: '创新成果奖', date: '2025-10-22' },
  { id: 3, teamName: '数学教研组', awardTitle: '优秀教学团队', date: '2025-10-28' },
  { id: 4, teamName: '科技创新小组', awardTitle: '创新成果奖', date: '2025-10-22' },
]);

// 校园新闻数据
const campusNews = ref([
  { id: 1, title: '我校举办2025年度优秀教师表彰大会', date: '2025-10-29' },
  { id: 2, title: '科技创新活动圆满落幕，作品广泛好评', date: '2025-10-27' },
  { id: 3, title: '学校与知名企业达成校企合作意向', date: '2025-10-25' },
  { id: 4, title: '秋季运动会将于本周末举行', date: '2025-10-23' },
  { id: 5, title: '学校图书馆新增电子资源，欢迎师生使用', date: '2025-10-21' },
]);

// 评选章程数据
const evaluationRules = ref([
  { id: 1, icon: '📋', title: '优秀教师评选章程', description: '详细规定优秀教师的评选标准、流程和奖励办法' },
  { id: 2, icon: '🏆', title: '教学成果奖评选办法', description: '明确教学成果奖的申报条件和评审程序' },
  { id: 3, icon: '⭐', title: '年度考核评定规则', description: '规定教师年度考核的各项指标和评定标准' },
  { id: 4, icon: '🏆', title: '教学成果奖评选办法', description: '明确教学成果奖的申报条件和评审程序' },
]);

// 评教规则数据
const teachingEvaluationRules = ref([
  { id: 1, badge: '评教', title: '学生评教实施办法', updateDate: '2025-10-15' },
  { id: 2, badge: '评教', title: '同行评教管理规定', updateDate: '2025-10-10' },
  { id: 3, badge: '教学', title: '教学质量评价标准', updateDate: '2025-10-05' },
  { id: 4, badge: '反馈', title: '评教结果反馈机制', updateDate: '2025-10-01' },
  { id: 5, badge: '成果', title: '教师教学教研成果评比', updateDate: '2025-10-01' },
]);

// 点击处理方法
const handleNewsClick = (item) => {
  console.log('点击新闻:', item);
  // 这里可以添加跳转逻辑
};

const handleRulesClick = (item) => {
  console.log('点击章程:', item);
  // 这里可以添加跳转逻辑
};

const handleEvaluationClick = (item) => {
  console.log('点击评教规则:', item);
  // 这里可以添加跳转逻辑
};

// 组件挂载时初始化并设置定时更新
onMounted(() => {
  // 更新日期、星期和天气信息
  const updateDateTime = () => {
    currentDate.value = getCurrentDate();
    currentWeekday.value = getCurrentWeekday();
    weatherInfo.value = getWeatherInfo();
  };
  
  // 立即更新一次
  updateDateTime();
  
  // 每天凌晨更新一次（确保日期和星期在跨日时自动更新）
  // 计算到下一个凌晨的毫秒数
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  
  // 在下一个凌晨执行更新
  setTimeout(() => {
    updateDateTime();
    // 之后每天更新一次
    setInterval(updateDateTime, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
});
</script>

<style scoped>
.portal-home-page {
  min-height: 100vh;
  background: #f6f8fb;
  padding: 44px 38px 24px 38px;
  max-width: 1480px;
  margin: 0 auto;
  display: flex; 
  flex-direction: column; 
  gap: 12px;
}
@media (max-width: 840px) {
  .portal-home-page {
    padding-left: 6vw;
    padding-right: 6vw;
  }
}
.portal-main-grid {
  display: grid; grid-template-columns: 1.6fr 2fr 1.3fr; 
  gap: 14px 12px;
  align-items: stretch;
}
.portal-card {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 4px 32px 0 #466cf033;
  padding: 30px 32px 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.portal-card-header {
  font-size: 21px;
  font-weight: 700;
  color: #263661;
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 17px;
}
.portal-more-btn {
  background: none; 
  border: none; 
  color: #6592e6; 
  font-size: 15px; 
  cursor: pointer; 
  padding: 0 7px; 
  border-radius: 11px; 
  transition: .14s;
}
.portal-more-btn:hover {background: #f4f6fb;}
.portal-apps-card {grid-column: 3 / span 1;}
.portal-apps-grid {
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 19px 18px; 
  padding: 10px 0 7px 0;
}
.portal-app-item {
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 7px;
  cursor: pointer; 
  border-radius: 14px; 
  transition: .13s; 
  padding: 5px 2px;
}
.portal-app-item:hover {background: #f6f7fc;}
.portal-app-icon {
  width: 50px; 
  height: 50px; 
  border-radius: 50%; 
  background: #eef2fb; 
  color: #4d71ca; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  font-size: 27px; 
  margin-bottom: 2px; 
  box-shadow: 0 2px 7px #aacff81a;
}
.portal-app-label {
  font-size: 15px;
  color: #2d437a;
  font-weight: 500;
}

.portal-todo-card {
  grid-column: 2 / span 1;
  min-width: 280px;
}

.portal-todo-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  margin-top: 2px;
}

.portal-todo-tabs span {
  font-size: 15px;
  color: #97a3be;
  cursor: pointer;
  border-radius: 8px;
  padding: 4px 13px;
  transition: .16s;
  font-weight: 500;
}

.portal-todo-tabs span.active {
  background: #eef4fd;
  color: #4381de;
}

.portal-todo-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 2px;
}

.portal-todo-item {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  background: #f9fbfe;
  border-radius: 10px;
  padding: 7px 13px 7px 10px;
  position: relative;
}

.todo-dot {
  width: 9px;
  height: 9px;
  background: #f0474c;
  border-radius: 50%;
  margin-top: 9px;
  margin-right: 2px;
}

.todo-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.todo-title {
  font-size: 15px;
  color: #2d437a;
  font-weight: 600;
}

.todo-badge {
  font-size: 11px;
  background: #edf1fa;
  color: #4381de;
  border-radius: 7px;
  padding: 1px 6px;
  margin-left: 7px;
  font-weight: 500;
  margin-top: -2px;
}

.todo-info {
  font-size: 12px;
  color: #b4bcd3;
  margin-top: 1px;
}

.todo-link {
  color: #4381de;
  text-decoration: underline;
  font-size: 12px;
  margin-left: 3px;
}

.portal-stat-blocks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px 8px;
  margin-top: 20px;
}

.stat-block {
  border-radius: 16px;
  padding: 19px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
}

.stat-a {
  background: #fef8f0;
}

.stat-b {
  background: #f0f8f4;
}

.stat-c {
  background: #f0f6fb;
}

.stat-number {
  font-size: 27px;
  font-weight: 800;
  color: #364b6d;
}

.stat-label {
  font-size: 14px;
  color: #9bacc9;
}

.portal-profile-col {
  grid-column: 1 / span 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: stretch;
}
.profile-info-card {
  padding-bottom: 19px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 17px;
}

.profile-avatar {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 1px 7px #dde3ff;
}

.profile-info-main {
  display: flex;
  flex-direction: column;
}

.profile-welcome {
  font-size: 20px;
  font-weight: 700;
  color: #2850a2;
  margin-bottom: 6px;
  text-align: left;
}

.profile-date-weather {
  font-size: 14.5px;
  color: #7aa2e6;
  text-align: left;
}

.profile-honor-list {
  margin-top: 10px;
  display: flex;
  gap: 11px;
  flex-wrap: wrap;
}

.honor-chip {
  background: #f0f7ff;
  font-size: 13px;
  color: #3b7eca;
  padding: 2px 13px;
  border-radius: 12px;
  font-weight: 500;
}

.calendar-head-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 9px;
}

.calendar-title {
  font-size: 18px;
  font-weight: 600;
  color: #263661;
}

.calendar-date-info {
  font-size: 14px;
  color: #9bacc9;
}

.calendar-week-row {
  display: flex;
  flex-direction: column;
  gap: 5px 9px;
  margin-bottom: 10px;
  margin-left: 3px;
}

.calendar-weekdays-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.calendar-days-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.calendar-weekday-portal {
  width: 41px; /* 和.calendar-day-portal保持一致，避免错位 */
  color: #98b0cb;
  font-size: 14px;
  text-align: center;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 3px;
}

.calendar-day-portal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 12px;
  width: 41px;
  height: 45px;
  cursor: pointer;
  transition: .15s;
  background: #f8faff;
  border: 1.1px solid #f4f6fa;
  color: #4476c2;
  font-size: 18px;
  font-weight: 600;
}

.calendar-day-portal.selected {
  background: #4a90e2;
  color: #fff;
  border: 1.6px solid #4a90e2;
}

.calendar-day-portal.today:not(.selected) {
  border: 1.2px solid #fcba05;
  background: #fffbe9;
  color: #cf7e08;
}

.day-main {
  font-size: 17.5px;
  font-weight: 700;
  margin: 0;
}

.day-dot {
  position: absolute;
  top: 5px;
  right: 8px;
  background: #f0474c;
  color: #fff;
  border-radius: 13px;
  font-size: 11.5px;
  line-height: 1.3;
  width: 15px;
  height: 15px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 7px #fc1d1d13;
  z-index: 2;
}

.today-course-list-block {
  margin-top: 9px;
  min-height: 170px; /* 固定最小高度，防跳变 */
}

.course-date-title {
  font-size: 15.5px;
  font-weight: 700;
  color: #23305b;
}

.course-count-label {
  background: #eef2fa;
  color: #98b0cb;
  border-radius: 10px;
  padding: 2px 10px;
  font-size: 13px;
  margin: 7px 0;
  display: inline-block;
}

.no-course-note {
  background: none;
  color: #b6bdd3;
  text-align: left;
  border-radius: 8px;
  padding: 12px 0;
}

.today-course-item {
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 14px;
  color: #3a50b0;
  font-weight: 500;
  margin-bottom: 4px;
  background: #f6f8fe;
  border-radius: 9px;
  padding: 4px 9px;
}

.tc-time {
  color: #5196df;
  font-size: 14px;
  width: 90px;
  font-weight: 700;
}

.tc-name {
  font-size: 15px;
  color: #223254;
  font-weight: 700;
}

.tc-class {
  color: #7e96be;
  font-size: 13.5px;
}

.tc-room {
  color: #36b047;
  font-weight: 700;
  font-size: 13px;
}

/* 人文关怀模块样式 */
.portal-care-card {
  margin-top: 0;
}

.care-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding-top: 8px;
}

.care-item-card {
  background: #f8f9fc;
  border-radius: 16px;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.2s;
}

.care-item-card:hover {
  background: #f0f3f8;
  box-shadow: 0 2px 12px rgba(70, 108, 240, 0.08);
}

.care-teacher-birthday {
  border-left: 4px solid #ff9a9e;
}

.care-student-birthday {
  border-left: 4px solid #fecfef;
}

.care-student-award {
  border-left: 4px solid #ffeaa7;
}

.care-team-award {
  border-left: 4px solid #81ecec;
}

.care-item-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.care-item-icon {
  font-size: 24px;
}

.care-item-title {
  font-size: 17px;
  font-weight: 700;
  color: #263661;
}

.care-item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 280px;
  overflow-y: auto;
}

.care-empty {
  font-size: 14px;
  color: #9bacc9;
  text-align: center;
  padding: 20px 0;
}

.care-item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  transition: all 0.15s;
}

.care-item-row:hover {
  box-shadow: 0 2px 8px rgba(64, 82, 109, 0.1);
  transform: translateY(-1px);
}

.care-avatar-wrapper {
  flex-shrink: 0;
}

.care-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eef2fb;
  box-shadow: 0 1px 4px rgba(64, 82, 109, 0.1);
}

.care-item-info {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.care-name {
  font-size: 15px;
  font-weight: 600;
  color: #2d437a;
}

.care-class {
  font-size: 12px;
  color: #7e96be;
}

.care-date {
  font-size: 12px;
  color: #9bacc9;
}

.care-award-item {
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.care-award-item:hover {
  box-shadow: 0 2px 8px rgba(64, 82, 109, 0.1);
  transform: translateY(-1px);
}

.care-award-name {
  font-size: 15px;
  font-weight: 600;
  color: #2d437a;
}

.care-award-title {
  font-size: 13px;
  color: #4d71ca;
  font-weight: 500;
  line-height: 1.4;
}

.care-award-date {
  font-size: 12px;
  color: #9bacc9;
  margin-top: 2px;
}

/* 校园新闻、评选章程、评教规则模块样式 */
.portal-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.portal-news-card,
.portal-rules-card,
.portal-evaluation-card {
  min-height: 400px;
}

/* 校园新闻样式 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
}

.news-item {
  background: #f8f9fc;
  border-radius: 14px;
  padding: 16px 18px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid #4a90e2;
  display: flex;
  justify-content: space-between;
}

.news-item:hover {
  background: #f0f3f8;
  box-shadow: 0 2px 12px rgba(70, 108, 240, 0.08);
  transform: translateX(4px);
}

.news-title {
  font-size: 15px;
  font-weight: 600;
  color: #2d437a;
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-date {
  font-size: 12px;
  color: #9bacc9;
}

.news-empty {
  font-size: 14px;
  color: #9bacc9;
  text-align: center;
  padding: 40px 0;
}

/* 评选章程样式 */
.rules-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 8px;
}

.rules-item {
  background: #f8f9fc;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid #f39c12;
}

.rules-item:hover {
  background: #f0f3f8;
  box-shadow: 0 2px 12px rgba(243, 156, 18, 0.12);
  transform: translateX(4px);
}

.rules-icon {
  font-size: 28px;
  flex-shrink: 0;
  margin-top: 2px;
}

.rules-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rules-title {
  font-size: 15px;
  font-weight: 600;
  color: #2d437a;
  line-height: 1.4;
}

.rules-desc {
  font-size: 13px;
  color: #7e96be;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rules-empty {
  font-size: 14px;
  color: #9bacc9;
  text-align: center;
  padding: 40px 0;
}

/* 评教规则样式 */
.evaluation-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
}

.evaluation-item {
  background: #f8f9fc;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid #27ae60;
}

.evaluation-item:hover {
  background: #f0f3f8;
  box-shadow: 0 2px 12px rgba(39, 174, 96, 0.12);
  transform: translateX(4px);
}

.evaluation-badge {
  background: #27ae6033;
  color: #10b981;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  flex-shrink: 0;
  white-space: nowrap;
}

.evaluation-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.evaluation-title {
  font-size: 15px;
  font-weight: 600;
  color: #2d437a;
  line-height: 1.4;
}

.evaluation-date {
  font-size: 12px;
  color: #9bacc9;
}

.evaluation-empty {
  font-size: 14px;
  color: #9bacc9;
  text-align: center;
  padding: 40px 0;
}

@media (max-width: 1400px) {
  .care-content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .portal-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .care-content-grid {
    grid-template-columns: 1fr;
  }
  
  .portal-info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width:1200px) {
  .portal-main-grid {
    grid-template-columns: 1fr 1fr
  }

  .portal-profile-col {
    grid-column: 1/-1;
    max-width: 600px
  }

  .profile-calendar-card {
    margin-bottom: 28px
  }
}

@media (max-width:900px) {
  .portal-main-grid {
    grid-template-columns: 1fr
  }

  .portal-todo-card,
  .portal-apps-card,
  .portal-profile-col {
    max-width: none;
    grid-column: 1/-1;
  }
}
</style>
