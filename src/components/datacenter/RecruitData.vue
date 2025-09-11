<template>
  <div class="data-page">
    <div class="page-header">
      <h1>数据中心 - 企业招聘</h1>
      <p>面向毕业生的企业招聘，正通过AI智能化深度赋能高校，精准构建起驱动学生个性化成长与职业发展路径的智慧引擎。</p>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon graduates">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">5,280</div>
          <div class="stat-label">应届生</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon companies">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">860</div>
          <div class="stat-label">招聘企业</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon positions">
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M10 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">2,150</div>
          <div class="stat-label">招聘岗位</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon match-rate">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6.1 6.1 9 1.6 4.5C.5 6.9.9 9.9 2.9 11.8c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.4-2.4c.4-.4.4-1 0-1.4z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">85%</div>
          <div class="stat-label">校专业匹配度</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon hired">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">1,230</div>
          <div class="stat-label">已聘用</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon no-offer">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">856</div>
          <div class="stat-label">暂无Offer</div>
        </div>
      </div>
    </div>

    <div class="data-content">
      <!-- 搜索区域 -->
      <div class="search-area">
        <div class="search-box">
          <input 
            class="search-input"
            type="text" 
            v-model="keyword" 
            placeholder="搜索岗位名称、企业名称..." 
            @input="filterData"
          />
          <button class="search-btn">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
        <button class="reset-btn" @click="resetFilters">重置筛选</button>
      </div>
      
    <table class="data-table">
      <thead>
        <tr>
            <th>岗位名称</th>
            <th>岗位描述</th>
            <th>薪资范围</th>
          <th>企业名称</th>
            <th>所需人数</th>
            <th>相关专业</th>
            <th>急切程度</th>
            <th>联系人</th>
        </tr>
      </thead>
      <tbody>
          <tr v-for="job in paginatedData" :key="job.id">
            <td>{{ job.positionName }}</td>
            <td><button class="link-btn" @click="showModal('岗位描述', job.description)">查看</button></td>
            <td>{{ job.salaryRange }}</td>
            <td>{{ job.companyName }}</td>
            <td>{{ job.headcount }}</td>
            <td>{{ job.relatedMajors.join(', ') }}</td>
            <td><span :class="getUrgencyClass(job.urgency)">{{ job.urgency }}</span></td>
            <td>{{ job.contactPerson }}</td>
        </tr>
      </tbody>
    </table>

      <!-- 分页控件 -->
      <div class="pagination" v-if="totalPages > 1">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage = 1">首页</button>
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
        <div class="page-numbers">
          <span v-for="page in displayedPages" :key="page" 
                :class="['page-number', { active: page === currentPage }]"
                @click="currentPage = page">{{ page }}</span>
        </div>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages">末页</button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }} 页</span>
      </div>
    </div>

    <!-- 弹窗 -->
    <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ modalContent }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const generateRecruitData = (count) => {
  const data = [];
  const positions = ['前端开发工程师', '后端开发工程师', '产品经理', 'UI设计师', '数据分析师', '算法工程师', '测试工程师'];
  const companies = ['科技A公司', '互联网B巨头', '金融C集团', '初创D公司', '外企E公司'];
  const majors = ['计算机科学与技术', '软件工程', '信息管理', '视觉传达', '统计学', '数学'];
  const urgencies = ['紧急', '一般', '暂缓'];
  const contacts = ['张经理', '李HR', '王总监', '赵主管'];

  for (let i = 1; i <= count; i++) {
    data.push({
      id: `JOB${2024 + i}`,
      positionName: positions[Math.floor(Math.random() * positions.length)],
      description: '岗位职责：\n1. 负责产品模块的设计和开发。\n2. 与团队协作，保证项目进度和质量。\n任职要求：\n1. 熟练掌握相关技术栈。\n2. 具备良好的沟通和学习能力。',
      salaryRange: `${10 + Math.floor(Math.random() * 15)}k - ${25 + Math.floor(Math.random() * 10)}k`,
      companyName: companies[Math.floor(Math.random() * companies.length)],
      headcount: Math.floor(Math.random() * 10) + 1,
      relatedMajors: [majors[Math.floor(Math.random() * majors.length)], majors[Math.floor(Math.random() * majors.length)]].filter((v, i, a) => a.indexOf(v) === i),
      urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
      contactPerson: `${contacts[Math.floor(Math.random() * contacts.length)]} (hr@example.com)`,
    });
  }
  return data;
};

const allRecruitData = ref(generateRecruitData(50));
const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
  if (!keyword.value) return allRecruitData.value;
  const search = keyword.value.toLowerCase();
  return allRecruitData.value.filter(job => 
    job.positionName.toLowerCase().includes(search) ||
    job.companyName.toLowerCase().includes(search)
  );
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize.value));
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredData.value.slice(start, end);
});
const displayedPages = computed(() => {
  const pages = [];
  const maxDisplayed = 5;
  if (totalPages.value <= maxDisplayed) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  } else {
    let start = Math.max(currentPage.value - 2, 1);
    let end = Math.min(start + maxDisplayed - 1, totalPages.value);
    if (end === totalPages.value) start = Math.max(end - maxDisplayed + 1, 1);
    for (let i = start; i <= end; i++) pages.push(i);
  }
  return pages;
});

watch(keyword, () => { currentPage.value = 1; });

const filterData = () => { currentPage.value = 1; };
const resetFilters = () => { keyword.value = ''; };

const isModalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const showModal = (title, content) => {
  modalTitle.value = title;
  modalContent.value = content;
  isModalVisible.value = true;
};
const closeModal = () => { isModalVisible.value = false; };

const getUrgencyClass = (urgency) => {
  if (urgency === '紧急') return 'urgency-badge urgency-high';
  if (urgency === '一般') return 'urgency-badge urgency-medium';
  if (urgency === '暂缓') return 'urgency-badge urgency-low';
  return '';
};
</script>

<style scoped>
.data-page {
  width: 100vw;
  max-width: 1440px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f7f8fa;
  box-sizing: border-box;
  padding-top: 2px;
}
.page-header {
  padding: 2px 48px 48px;
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
.stats-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 48px 0;
}
.stat-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 16px;
  min-width: 160px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.graduates { background-color: #4b9cff; }
.companies { background-color: #f0a742; }
.positions { background-color: #6dbc49; }
.match-rate { background-color: #9254de; }
.hired { background-color: #27ae60; }
.no-offer { background-color: #c0392b; }
.stat-content {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}
.stat-label {
  font-size: 14px;
  color: #888;
  margin-top: 4px;
}
.data-content {
  padding: 24px 48px 48px;
}
.search-area {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  gap: 16px;
  align-items: center;
}
.search-box {
  display: flex;
  flex: 1;
  min-width: 250px;
}
.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  outline: none;
}
.search-btn {
  background: #1677ff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.reset-btn {
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.data-table th, .data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.data-table th {
  background-color: #f7f8fa;
  font-weight: bold;
  color: #333;
}
.link-btn {
  background: none;
  border: none;
  color: #1677ff;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
}
.link-btn:hover {
  text-decoration: underline;
}
.urgency-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  color: white;
  font-weight: 500;
}
.urgency-high { background-color: #c0392b; }
.urgency-medium { background-color: #f39c12; }
.urgency-low { background-color: #27ae60; }
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
.modal-body {
  padding: 24px;
  white-space: pre-wrap;
  line-height: 1.6;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  gap: 8px;
}
.page-btn {
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
}
.page-btn:hover:not(:disabled) {
  color: #1677ff;
  border-color: #1677ff;
}
.page-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}
.page-numbers {
  display: flex;
  gap: 4px;
}
.page-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
}
.page-number:hover {
  background: #f0f5ff;
  color: #1677ff;
}
.page-number.active {
  background: #1677ff;
  color: #fff;
  font-weight: bold;
}
.page-info {
  margin-left: 12px;
  color: #666;
  font-size: 14px;
}
</style> 