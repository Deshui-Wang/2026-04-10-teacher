<template>
  <div class="data-page">
    <div class="page-header">
      <h1>数据中心 - 实习数据</h1>
      <p>AI赋能实习管理，精准匹配人岗，动态追踪过程，智能评估成效，构建服务学生职业发展的智慧生态。</p>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon intern-count">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">850</div>
          <div class="stat-label">实习生总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon graduate-ratio">
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4-1h-2v-4h2v4z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">65%</div>
          <div class="stat-label">应届占比</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon avg-salary">
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥8,500</div>
          <div class="stat-label">平均薪资</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon intern-rate">
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">92%</div>
          <div class="stat-label">应届实习率</div>
        </div>
      </div>
       <div class="stat-card">
        <div class="stat-icon high-salary-co">
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">互联网B巨头</div>
          <div class="stat-label">高薪企业</div>
        </div>
      </div>
    </div>

  <div class="data-content">
      <!-- 搜索区域 -->
      <div class="search-area">
        <div class="search-box">
          <input class="search-input" type="text" v-model="keyword" placeholder="搜索学号、姓名、专业、实习单位..."/>
          <button class="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
        <button class="reset-btn" @click="resetFilters">重置筛选</button>
      </div>
      
      <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
              <th class="sticky-col sticky-col-1">学号</th>
              <th class="sticky-col sticky-col-2">姓名</th>
              <th>性别</th>
              <th>专业</th>
              <th>班级</th>
              <th>院系</th>
              <th>入学年份</th>
          <th>实习单位</th>
          <th>岗位</th>
              <th>薪资</th>
              <th>实习协议</th>
          <th>起止时间</th>
              <th>时长(天)</th>
              <th>实习报告</th>
              <th>实习结果</th>
        </tr>
      </thead>
      <tbody>
            <tr v-for="intern in paginatedData" :key="intern.studentId">
              <td class="sticky-col sticky-col-1">{{ intern.studentId }}</td>
              <td class="sticky-col sticky-col-2">{{ intern.name }}</td>
              <td>{{ intern.gender }}</td>
              <td>{{ intern.major }}</td>
              <td>{{ intern.className }}</td>
              <td>{{ intern.department }}</td>
              <td>{{ intern.enrollmentYear }}</td>
              <td><button class="link-btn" @click="showModal('unit', intern.unitDetails)">详情</button></td>
              <td>{{ intern.position }}</td>
              <td>{{ intern.salary }}</td>
              <td><button class="link-btn" @click="showModal('agreement', intern.agreementContent)">查看</button></td>
              <td>{{ intern.startDate }} 至 {{ intern.endDate }}</td>
              <td>{{ intern.duration }}</td>
              <td><button class="link-btn" @click="showModal('report', intern.reportDetails)">详情</button></td>
              <td><span :class="getResultClass(intern.result)">{{ intern.result }}</span></td>
        </tr>
      </tbody>
    </table>
      </div>

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
          <div v-if="modalType === 'unit'">
            <p><strong>企业名称:</strong> {{ modalContent.name }}</p>
            <p><strong>所属行业:</strong> {{ modalContent.industry }}</p>
            <p><strong>公司地址:</strong> {{ modalContent.address }}</p>
            <p><strong>联系人:</strong> {{ modalContent.contactPerson }}</p>
          </div>
          <div v-if="modalType === 'report'">
            <p><strong>企业评价:</strong> {{ modalContent.companyFeedback }}</p>
            <p><strong>指导教师评价:</strong> {{ modalContent.teacherFeedback }}</p>
            <p><strong>实习总结:</strong> {{ modalContent.summary }}</p>
          </div>
          <div v-if="modalType === 'agreement'">
            <p>{{ modalContent }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const generateInternData = (count) => {
  const data = [];
  const names = ['张伟', '李娜', '王芳', '刘洋', '陈静', '杨勇'];
  const majors = ['计算机科学', '软件工程', '工商管理', '市场营销'];
  const departments = ['信息技术学院', '商学院'];
  const companies = [
    { name: '科技A公司', industry: '互联网', address: '北京市海淀区中关村软件园', contact: '张经理' },
    { name: '互联网B巨头', industry: '电子商务', address: '浙江省杭州市余杭区文一西路', contact: '李HR' },
    { name: '金融C集团', industry: '金融科技', address: '上海市浦东新区陆家嘴', contact: '王总监' },
  ];
  const positions = ['前端开发', '产品助理', '市场专员', '后端开发'];
  const results = ['优秀', '良好', '合格', '不合格'];
  const agreementTemplates = [
    "实习协议\n\n甲方（实习单位）：[公司名称]\n乙方（实习学生）：[学生姓名]\n\n根据相关法律法规，甲乙双方本着平等自愿的原则，达成以下实习协议：\n\n一、实习岗位：[岗位]\n二、实习期限：自 [开始日期] 至 [结束日期]。\n三、实习内容：协助完成相关业务模块的开发与测试。\n四、双方权利与义务：甲方提供必要的实习指导，乙方需遵守甲方的规章制度。\n\n甲方（盖章）：\n乙方（签字）：",
    "保密与知识产权协议\n\n甲方：[公司名称]\n乙方：[学生姓名]\n\n乙方在实习期间，可能接触到甲方的商业秘密及知识产权。为保护甲方的合法权益，双方约定如下：\n1. 乙方不得向任何第三方泄露在实习期间获知的任何非公开信息。\n2. 乙方在实习期间产生的所有工作成果，其知识产权归甲方所有。\n\n本协议自双方签字/盖章之日起生效。"
  ];

  for (let i = 1; i <= count; i++) {
    const startDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const duration = Math.floor(Math.random() * 60) + 30;
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);

    const company = companies[i % companies.length];
    const studentName = names[i % names.length];
    const position = positions[i % positions.length];
    const agreementText = agreementTemplates[Math.floor(Math.random() * agreementTemplates.length)]
      .replace('[公司名称]', company.name)
      .replace('[学生姓名]', studentName)
      .replace('[岗位]', position)
      .replace('[开始日期]', startDate.toISOString().split('T')[0])
      .replace('[结束日期]', endDate.toISOString().split('T')[0]);

    data.push({
      studentId: `2020${String(i).padStart(4, '0')}`,
      name: names[i % names.length],
      gender: i % 2 === 0 ? '女' : '男',
      major: majors[i % majors.length],
      className: `${majors[i % majors.length]}${2001 + (i % 2)}班`,
      department: departments[i % departments.length],
      enrollmentYear: 2020,
      unitDetails: companies[i % companies.length],
      position: positions[i % positions.length],
      salary: `¥${(Math.random() * 4000 + 4000).toFixed(0)}`,
      agreementContent: agreementText,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      duration: duration,
      reportDetails: {
        companyFeedback: '表现出色，学习能力强，能快速融入团队。',
        teacherFeedback: '实习态度端正，能将理论与实践结合，进步明显。',
        summary: '本次实习收获颇丰，对行业有了更深入的了解，明确了未来的职业方向。'
      },
      result: results[i % results.length]
    });
  }
  return data;
};

const allInternData = ref(generateInternData(50));
const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
  if (!keyword.value) return allInternData.value;
  const search = keyword.value.toLowerCase();
  return allInternData.value.filter(intern =>
    intern.studentId.includes(search) ||
    intern.name.toLowerCase().includes(search) ||
    intern.major.toLowerCase().includes(search) ||
    intern.unitDetails.name.toLowerCase().includes(search)
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

const resetFilters = () => { keyword.value = ''; };

const isModalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref(null);
const modalType = ref('');

const showModal = (type, content) => {
  modalType.value = type;
  if (type === 'unit') {
    modalTitle.value = '实习单位详情';
  } else if (type === 'report') {
    modalTitle.value = '实习报告详情';
  } else if (type === 'agreement') {
    modalTitle.value = '实习协议详情';
  }
  modalContent.value = content;
  isModalVisible.value = true;
};
const closeModal = () => { isModalVisible.value = false; };

const getResultClass = (result) => {
  if (result === '优秀') return 'result-badge result-excellent';
  if (result === '良好') return 'result-badge result-good';
  if (result === '合格') return 'result-badge result-qualified';
  if (result === '不合格') return 'result-badge result-unqualified';
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
.intern-count { background-color: #4b9cff; }
.graduate-ratio { background-color: #f0a742; }
.avg-salary { background-color: #6dbc49; }
.intern-rate { background-color: #9254de; }
.high-salary-co { background-color: #27ae60; }
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
.table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #eee;
  border-radius: 8px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0;
  min-width: 1800px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.data-table th, .data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
}
.data-table th {
  background-color: #f7f8fa;
  font-weight: bold;
  color: #333;
}
.sticky-col {
  position: -webkit-sticky; /* for Safari */
  position: sticky;
  z-index: 2;
  background-color: #fff;
}
.sticky-col-1 {
  left: 0;
  width: 120px;
  min-width: 120px;
  max-width: 120px;
}
.sticky-col-2 {
  left: 120px;
  width: 100px;
  min-width: 100px;
  max-width: 100px;
}
.data-table th.sticky-col {
  z-index: 3;
  background-color: #f7f8fa;
}
.data-table td.sticky-col {
  background-color: #fff;
}
.data-table tr:hover td.sticky-col {
  background-color: #f5f7fa;
}
.link-btn {
  background: none;
  border: none;
  color: #1677ff;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
}
.result-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  color: white;
  font-weight: 500;
}
.result-excellent { background-color: #27ae60; }
.result-good { background-color: #3498db; }
.result-qualified { background-color: #f39c12; }
.result-unqualified { background-color: #c0392b; }
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}
.modal-body {
  padding: 24px;
  line-height: 1.8;
  white-space: pre-wrap;
}
.modal-body p {
  margin: 0 0 12px;
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