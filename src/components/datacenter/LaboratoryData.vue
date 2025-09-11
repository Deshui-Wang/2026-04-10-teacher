<template>
  <div class="data-page">
    <div class="page-header">
      <h1>数据中心 - 实验室数据</h1>
      <p>AI智能化重塑高校实验室管理，构建精准、高效的智慧育人平台，驱动学生创新实践能力培养与个性化发展路径的引擎。</p>
    </div>
    
    <!-- 统计卡片区域 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon lab-total">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M4 10v11h16V10l-8-5-8 5zm8-3.69L17.31 10H6.69L12 6.31zM6 12h2v7H6v-7zm4 0h2v7h-2v-7zm4 0h2v7h-2v-7z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ labStats.total }}</div>
          <div class="stat-label">实验室总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon lab-ai">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2a10 10 0 00-2.2.32A1 1 0 009 3.26V4.4a8 8 0 018 8h1.14a1 1 0 00.94-.74A10 10 0 0012 2zm-1.5 5.5A1.5 1.5 0 119 9a1.5 1.5 0 011.5-1.5zm6 0A1.5 1.5 0 1115 9a1.5 1.5 0 011.5-1.5zM12 15c-2 0-3 1.2-3.5 2.5C8 18.8 6.8 19 6.5 19h-.3c-1.2 0-2.2 1-2.2 2.2V22h16v-.8c0-1.2-1-2.2-2.2-2.2h-.3c-.3 0-1.5-.2-2-1.5C15 16.2 14 15 12 15z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ labStats.ai }}</div>
          <div class="stat-label">AI智能</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon lab-cs">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ labStats.cs }}</div>
          <div class="stat-label">计算机</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon lab-business">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M6 20h12V10H6v10zm2-8h2v6H8v-6zm4 0h2v6h-2v-6zm-8-6h2v12H2V6zm18 4h2v8h-2v-8zM14 6h2v12h-2V6z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ labStats.business }}</div>
          <div class="stat-label">商贸专用</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon lab-physics">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zM12 9a3 3 0 100 6 3 3 0 000-6z" opacity=".8"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" opacity=".3"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ labStats.physics }}</div>
          <div class="stat-label">物理实验室</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon lab-chem">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M7 2L3 7v13a2 2 0 002 2h14a2 2 0 002-2V7L17 2H7zm2 2h6v2H9V4z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ labStats.chemistry }}</div>
          <div class="stat-label">化学实验室</div>
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
            placeholder="搜索实验室名称、负责人..." 
            @input="filterData"
          />
          <button class="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        
        <select v-model="filters.status" @change="filterData" class="filter-select">
          <option value="">全部使用状态</option>
          <option value="使用中">使用中</option>
          <option value="空闲">空闲</option>
          <option value="维护中">维护中</option>
        </select>
        <button class="reset-btn" @click="resetFilters">重置筛选</button>
      </div>
      
    <table class="data-table">
      <thead>
        <tr>
            <th>实验室名称</th>
            <th>用途</th>
            <th>使用次数</th>
            <th>成立时间</th>
            <th>负责人</th>
            <th>当前项目</th>
            <th>注意事项</th>
            <th>资料</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
          <tr v-for="lab in paginatedData" :key="lab.id">
            <td>{{ lab.name }}</td>
            <td>{{ lab.purpose }}</td>
            <td>{{ lab.usageCount }}</td>
            <td>{{ lab.establishedDate }}</td>
            <td>{{ lab.manager }}</td>
            <td>{{ lab.currentProject }}</td>
            <td><button class="link-btn" @click="showModal('注意事项', lab.notes)">查看</button></td>
            <td><button class="link-btn" @click="showModal('电子资料', lab.docsContent)">查看</button></td>
            <td>
              <span :class="getStatusClass(lab.status)">{{ lab.status }}</span>
            </td>
        </tr>
      </tbody>
    </table>

      <!-- 分页控件 -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1" 
          @click="currentPage = 1"
        >首页</button>
        
        <button 
          class="page-btn" 
          :disabled="currentPage === 1" 
          @click="currentPage--"
        >上一页</button>
        
        <div class="page-numbers">
          <span v-for="page in displayedPages" :key="page" 
                :class="['page-number', { active: page === currentPage }]"
                @click="currentPage = page">
            {{ page }}
          </span>
        </div>
        
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages" 
          @click="currentPage++"
        >下一页</button>
        
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages" 
          @click="currentPage = totalPages"
        >末页</button>
        
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
import { ref, computed, reactive, watch } from 'vue';

// --- 数据生成 ---
const generateLabData = (count) => {
  const data = [];
  const purposes = ['教学', '科研', '竞赛培训', '开放实践'];
  const labTypes = ['AI智能', '计算机', '商贸专用', '物理实验室', '化学实验室'];
  const statuses = ['使用中', '空闲', '维护中'];
  const teachers = ['王教授', '李博士', '张老师', '刘研究员', '陈工程师'];
  const projects = ['人脸识别算法优化', '电商大数据分析平台', '量子点制备与性能研究', '高能粒子碰撞模拟', '无机纳米材料合成', '无'];
  const docTemplates = [
    "实验安全手册 v1.2\n\n1. 总则\n   - 所有进入实验室的人员必须遵守本手册规定。\n   - 实验前需进行安全培训并通过考核。\n\n2. 操作规程\n   - 严禁在实验室内饮食、吸烟。\n   - 穿戴好个人防护装备（实验服、护目镜）。",
    "AI服务器使用指南\n\n- 账户申请流程：\n  1. 填写《服务器资源使用申请表》。\n  2. 导师签字后提交至实验室管理员。\n\n- 环境配置：\n  - 预装环境：Python 3.8, CUDA 11.2, PyTorch, TensorFlow。\n  - 使用`conda`创建个人虚拟环境进行开发。",
    "物理实验数据处理规范\n\n- 数据记录：\n  - 原始数据应记录在实验记录本上，清晰、准确。\n  - 电子数据应及时备份，文件名规范：'项目名_日期_版本号.csv'。\n\n- 不确定度分析：\n  - 所有测量结果必须包含不确定度评估。\n  - A类不确定度通过多次测量计算，B类不确定度根据仪器规格评定。"
  ];

  for (let i = 1; i <= count; i++) {
    const type = labTypes[i % labTypes.length];
    data.push({
      id: `LAB${1000 + i}`,
      name: `${type} #${i}`,
      purpose: purposes[Math.floor(Math.random() * purposes.length)],
      usageCount: Math.floor(Math.random() * 500) + 50,
      establishedDate: `${2010 + Math.floor(Math.random() * 13)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`,
      manager: teachers[Math.floor(Math.random() * teachers.length)],
      currentProject: projects[Math.floor(Math.random() * projects.length)],
      notes: '1. 请保持安静。\n2. 实验结束后请清理设备。\n3. 禁止携带食物和饮料。',
      docsContent: docTemplates[Math.floor(Math.random() * docTemplates.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: type,
    });
  }
  return data;
};

const allLabData = ref(generateLabData(50));

// 筛选和分页
const keyword = ref('');
const filters = reactive({
  status: '',
});
const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
  let data = allLabData.value;

  if (keyword.value) {
    const search = keyword.value.toLowerCase();
    data = data.filter(lab => 
      lab.name.toLowerCase().includes(search) ||
      lab.manager.toLowerCase().includes(search)
    );
  }

  if (filters.status) {
    data = data.filter(lab => lab.status === filters.status);
  }

  return data;
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
    if (end === totalPages.value) {
      start = Math.max(end - maxDisplayed + 1, 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
  }
  return pages;
});

watch([keyword, filters], () => {
  currentPage.value = 1;
});

const filterData = () => {
  currentPage.value = 1;
};

const resetFilters = () => {
  keyword.value = '';
  filters.status = '';
};


const labStats = computed(() => {
  const stats = { total: allLabData.value.length, ai: 0, cs: 0, business: 0, physics: 0, chemistry: 0 };
  allLabData.value.forEach(lab => {
    if (lab.type === 'AI智能') stats.ai++;
    if (lab.type === '计算机') stats.cs++;
    if (lab.type === '商贸专用') stats.business++;
    if (lab.type === '物理实验室') stats.physics++;
    if (lab.type === '化学实验室') stats.chemistry++;
  });
  return stats;
});

// Modal 逻辑
const isModalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');

const showModal = (title, content) => {
  modalTitle.value = title;
  modalContent.value = content;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const getStatusClass = (status) => {
  if (status === '使用中') return 'status-badge status-active';
  if (status === '空闲') return 'status-badge status-idle';
  if (status === '维护中') return 'status-badge status-maintenance';
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

/* 统计卡片样式 */
.stats-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0px 48px 0;
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
.lab-total { background-color: #4b9cff; }
.lab-ai { background-color: #9254de; }
.lab-cs { background-color: #f0a742; }
.lab-business { background-color: #f978a6; }
.lab-physics { background-color: #6dbc49; }
.lab-chem { background-color: #3498db; }
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

/* 数据内容区域样式 */
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
  transition: background-color 0.2s;
}
.search-btn:hover {
  background: #409eff;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  min-width: 180px;
  cursor: pointer;
  white-space: nowrap;
}

.reset-btn {
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
}

/* 表格样式 */
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
.data-table tr:last-child td {
  border-bottom: none;
}
.data-table tr:hover {
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
.link-btn:hover {
  text-decoration: underline;
}
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  color: white;
  font-weight: 500;
  white-space: nowrap;
}
.status-active { background-color: #27ae60; }
.status-idle { background-color: #3498db; }
.status-maintenance { background-color: #f39c12; }

/* Modal样式 */
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
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 16px 20px;
}
.modal-header h3 {
  margin: 0;
  font-size: 18px;
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
}
.modal-body {
  padding: 24px;
  white-space: pre-wrap;
  line-height: 1.6;
}

/* 分页控件 */
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
  transition: all 0.2s;
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
  transition: all 0.2s;
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