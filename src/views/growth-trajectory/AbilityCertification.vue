<template>
  <div class="ability-certification-page">
    <div class="page-header">
      <h2>能力认证</h2>
    </div>
    
    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="stat-card main-stat">
        <div class="stat-icon">🏆</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalCertifications }}</div>
          <div class="stat-label">获得认证总数</div>
          <div class="stat-trend">
            <span class="trend-icon">📈</span>
            <span class="trend-text">持续提升中</span>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <div class="stat-number">{{ activeCertifications }}</div>
          <div class="stat-label">有效认证数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🏢</div>
        <div class="stat-content">
          <div class="stat-number">{{ certificationTypes }}</div>
          <div class="stat-label">认证类型数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-number">{{ recentCertifications }}</div>
          <div class="stat-label">近一年获得</div>
        </div>
      </div>
    </div>

    <!-- 筛选和视图切换 -->
    <div class="filter-section">
      <div class="certification-filter">
        <h3>认证类型筛选</h3>
        <div class="filter-options">
          <button 
            v-for="type in certificationTypesList" 
            :key="type.value"
            @click="selectedType = type.value"
            :class="['filter-btn', { active: selectedType === type.value }]"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
      
      <div class="view-toggle">
        <button 
          @click="viewMode = 'grid'"
          :class="['toggle-btn', { active: viewMode === 'grid' }]"
        >
          <span class="toggle-icon">⊞</span>
          网格视图
        </button>
        <button 
          @click="viewMode = 'list'"
          :class="['toggle-btn', { active: viewMode === 'list' }]"
        >
          <span class="toggle-icon">☰</span>
          列表视图
        </button>
      </div>
    </div>

    <!-- 认证展示区域 -->
    <div class="certification-section">
      <div class="section-header">
        <h3>我的认证</h3>
        <div class="add-certification-btn">
          <button class="btn btn-primary" @click="addCertification">
            <span class="btn-icon">+</span>
            添加认证
          </button>
        </div>
      </div>

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="grid-view">
        <div class="certifications-grid">
          <div 
            v-for="cert in filteredCertifications" 
            :key="cert.id"
            class="certification-card"
            :class="{ 'expired': cert.isExpired, 'expiring': cert.isExpiring }"
          >
            <div class="card-header" style="justify-content: flex-end;">
              <div class="certification-icon" style="display: none;">
                <span class="icon">{{ cert.icon }}</span>
              </div>
              <div class="certification-status" :class="cert.status">
                {{ cert.statusText }}
              </div>
            </div>
            
            <div class="card-body">
              <div class="certification-name-row">
                <h4 class="certification-name">{{ cert.certificationName }}</h4>
                <span class="certification-validity">{{ cert.validityPeriod }}</span>
              </div>
              <p class="certification-unit">{{ cert.certificationUnit }}</p>
              
              <div class="certification-details">
                <div class="detail-item">
                  <span class="detail-label">认证编号：</span>
                  <span class="detail-value">{{ cert.certificationNumber }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">认证时间：</span>
                  <span class="detail-value">{{ cert.certificationDate }}</span>
              </div>
                </div>            </div>
            
            <div class="card-footer">
              <button class="btn btn-outline" @click="editCertification(cert)">编辑</button>
              <button class="btn btn-danger" @click="deleteCertification(cert.id)">删除</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="list-view">
        <div class="certifications-list">
          <div 
            v-for="cert in filteredCertifications" 
            :key="cert.id"
            class="certification-item"
            :class="{ 'expired': cert.isExpired, 'expiring': cert.isExpiring }"
          >
            <div class="item-icon" style="display: none;">
              <span class="icon">{{ cert.icon }}</span>
            </div>
            
            <div class="item-content">
              <div class="item-header">
                <div class="certification-name-row">
                <h4 class="certification-name">{{ cert.certificationName }}</h4>
                <span class="certification-validity">{{ cert.validityPeriod }}</span>
              </div>
                <div class="certification-status" :class="cert.status">
                  {{ cert.statusText }}
                </div>
              </div>
              
              <div class="item-details">
                <div class="detail-row">
                  <div class="detail-item">
                    <span class="detail-label">认证编号：</span>
                    <span class="detail-value">{{ cert.certificationNumber }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">认证单位：</span>
                    <span class="detail-value">{{ cert.certificationUnit }}</span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-item">
                    <span class="detail-label">认证时间：</span>
                    <span class="detail-value">{{ cert.certificationDate }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">认证时效：</span>
                    <span class="detail-value">{{ cert.validityPeriod }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="item-actions">
              <button class="btn btn-outline" @click="editCertification(cert)">编辑</button>
              <button class="btn btn-danger" @click="deleteCertification(cert.id)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑认证弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑认证信息' : '添加认证信息' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveCertification" class="certification-form">
            <div class="form-group">
              <label for="certificationName">认证名称 *</label>
              <select 
                id="certificationName" 
                v-model="formData.certificationName" 
                required
                @change="handleCertificationTypeChange"
              >
                <option value="">请选择认证类型</option>
                <option value="评审专家">评审专家</option>
                <option value="教学名师">教学名师</option>
                <option value="企业导师">企业导师</option>
                <option value="校企合作顾问">校企合作顾问</option>
                <option value="双师认证">双师认证</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="certificationNumber">认证编号 *</label>
              <input 
                type="text" 
                id="certificationNumber" 
                v-model="formData.certificationNumber" 
                required
                placeholder="请输入认证编号"
              >
            </div>
            
            <div class="form-group">
              <label for="certificationUnit">认证单位 *</label>
              <input 
                type="text" 
                id="certificationUnit" 
                v-model="formData.certificationUnit" 
                required
                placeholder="请输入认证单位"
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="certificationDate">认证时间 *</label>
                <input 
                  type="date" 
                  id="certificationDate" 
                  v-model="formData.certificationDate" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="validityPeriod">认证时效 *</label>
                <select 
                  id="validityPeriod" 
                  v-model="formData.validityPeriod" 
                  required
                >
                  <option value="">请选择认证时效</option>
                  <option value="1年">1年</option>
                  <option value="2年">2年</option>
                  <option value="3年">3年</option>
                  <option value="5年">5年</option>
                  <option value="长期有效">长期有效</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
          <button type="submit" class="btn btn-primary" @click="saveCertification">
            {{ isEditing ? '更新' : '添加' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 认证类型筛选选项
const certificationTypesList = [
  { label: '全部', value: 'all' },
  { label: '评审专家', value: '评审专家' },
  { label: '教学名师', value: '教学名师' },
  { label: '企业导师', value: '企业导师' },
  { label: '校企合作顾问', value: '校企合作顾问' },
  { label: '双师认证', value: '双师认证' }
]

const selectedType = ref('all')
const viewMode = ref('grid')

// 弹窗状态
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// 表单数据
const formData = ref({
  certificationName: '',
  certificationNumber: '',
  certificationUnit: '',
  certificationDate: '',
  validityPeriod: ''
})

// 模拟认证数据
const certifications = ref([
  {
    id: 1,
    certificationName: '评审专家',
    certificationNumber: 'PS2024001',
    certificationUnit: '教育部高等教育司',
    certificationDate: '2024-01-15',
    validityPeriod: '3年',
    icon: '👨‍💼',
    status: 'active',
    statusText: '有效',
    isExpired: false,
    isExpiring: false
  },
  {
    id: 2,
    certificationName: '教学名师',
    certificationNumber: 'TM2024002',
    certificationUnit: '中国教育学会',
    certificationDate: '2024-02-20',
    validityPeriod: '5年',
    icon: '👩‍🏫',
    status: 'active',
    statusText: '有效',
    isExpired: false,
    isExpiring: false
  },
  {
    id: 3,
    certificationName: '企业导师',
    certificationNumber: 'EM2024003',
    certificationUnit: '北京智学教育科技有限公司',
    certificationDate: '2024-03-10',
    validityPeriod: '2年',
    icon: '🏢',
    status: 'active',
    statusText: '有效',
    isExpired: false,
    isExpiring: false
  },
  {
    id: 4,
    certificationName: '校企合作顾问',
    certificationNumber: 'SC2024004',
    certificationUnit: '上海数学思维研究院',
    certificationDate: '2024-01-25',
    validityPeriod: '3年',
    icon: '🤝',
    status: 'active',
    statusText: '有效',
    isExpired: false,
    isExpiring: false
  },
  {
    id: 5,
    certificationName: '双师认证',
    certificationNumber: 'DT2024005',
    certificationUnit: '深圳创新教育集团',
    certificationDate: '2024-04-05',
    validityPeriod: '2年',
    icon: '👨‍🏫',
    status: 'active',
    statusText: '有效',
    isExpired: false,
    isExpiring: false
  },
  {
    id: 6,
    certificationName: '评审专家',
    certificationNumber: 'PS2023001',
    certificationUnit: '省教育厅',
    certificationDate: '2023-06-15',
    validityPeriod: '1年',
    icon: '👨‍💼',
    status: 'expired',
    statusText: '已过期',
    isExpired: true,
    isExpiring: false
  },
  {
    id: 7,
    certificationName: '教学名师',
    certificationNumber: 'TM2022001',
    certificationUnit: '市教育委员会',
    certificationDate: '2022-09-10',
    validityPeriod: '2年',
    icon: '👩‍🏫',
    status: 'expired',
    statusText: '已过期',
    isExpired: true,
    isExpiring: false
  }
])

// 计算属性
const totalCertifications = computed(() => {
  return certifications.value.length
})

const activeCertifications = computed(() => {
  return certifications.value.filter(cert => cert.status === 'active').length
})

const certificationTypes = computed(() => {
  return new Set(certifications.value.map(cert => cert.certificationName)).size
})

const recentCertifications = computed(() => {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  
  return certifications.value.filter(cert => {
    const certDate = new Date(cert.certificationDate)
    return certDate >= oneYearAgo
  }).length
})

const filteredCertifications = computed(() => {
  let filtered = certifications.value
  
  if (selectedType.value !== 'all') {
    filtered = filtered.filter(cert => cert.certificationName === selectedType.value)
  }
  
  // 按认证时间排序（最新的在前）
  return filtered.sort((a, b) => new Date(b.certificationDate) - new Date(a.certificationDate))
})

// 方法
const addCertification = () => {
  isEditing.value = false
  editingId.value = null
  resetForm()
  showModal.value = true
}

const editCertification = (cert) => {
  isEditing.value = true
  editingId.value = cert.id
  formData.value = { ...cert }
  showModal.value = true
}

const deleteCertification = (id) => {
  if (confirm('确定要删除这条认证信息吗？')) {
    const index = certifications.value.findIndex(c => c.id === id)
    if (index > -1) {
      certifications.value.splice(index, 1)
    }
  }
}

const saveCertification = () => {
  if (isEditing.value) {
    // 更新现有记录
    const index = certifications.value.findIndex(c => c.id === editingId.value)
    if (index > -1) {
      certifications.value[index] = {
        ...formData.value,
        id: editingId.value,
        icon: getCertificationIcon(formData.value.certificationName),
        status: 'active',
        statusText: '有效',
        isExpired: false,
        isExpiring: false
      }
    }
  } else {
    // 添加新记录
    const newId = Math.max(...certifications.value.map(c => c.id)) + 1
    certifications.value.push({
      ...formData.value,
      id: newId,
      icon: getCertificationIcon(formData.value.certificationName),
      status: 'active',
      statusText: '有效',
      isExpired: false,
      isExpiring: false
    })
  }
  
  closeModal()
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    certificationName: '',
    certificationNumber: '',
    certificationUnit: '',
    certificationDate: '',
    validityPeriod: ''
  }
}

const handleCertificationTypeChange = () => {
  // 根据认证类型自动生成认证编号
  if (formData.value.certificationName) {
    const prefix = getCertificationPrefix(formData.value.certificationName)
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    formData.value.certificationNumber = `${prefix}${year}${random}`
  }
}

const getCertificationIcon = (type) => {
  const iconMap = {
    '评审专家': '👨‍💼',
    '教学名师': '👩‍🏫',
    '企业导师': '🏢',
    '校企合作顾问': '🤝',
    '双师认证': '👨‍🏫'
  }
  return iconMap[type] || '📜'
}

const getCertificationPrefix = (type) => {
  const prefixMap = {
    '评审专家': 'PS',
    '教学名师': 'TM',
    '企业导师': 'EM',
    '校企合作顾问': 'SC',
    '双师认证': 'DT'
  }
  return prefixMap[type] || 'CT'
}
</script>

<style scoped>
.ability-certification-page {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  min-height: 100vh;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #5856d6;
  margin: 0 0 8px 0;
  display: flex;
}

.page-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
  border: 1px solid rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  gap: 0px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.1);
}

.main-stat {
  background: linear-gradient(135deg, #5856d6, #7e7eff);
  color: white;
}

.main-stat .stat-icon {
  background: rgba(255,255,255,0.2);
}

.stat-icon {
  font-size: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #d9d9d9, #f5f5f5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.main-stat .stat-number {
  color: white;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.main-stat .stat-label {
  color: rgba(255,255,255,0.9);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #34c759;
}

.trend-icon {
  font-size: 14px;
}

/* 筛选区域 */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
}

.certification-filter h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.filter-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #5856d6;
  color: #5856d6;
}

.filter-btn.active {
  background: #5856d6;
  color: white;
  border-color: #5856d6;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-btn:hover {
  border-color: #5856d6;
  color: #5856d6;
}

.toggle-btn.active {
  background: #5856d6;
  color: white;
  border-color: #5856d6;
}

.toggle-icon {
  font-size: 16px;
}

/* 认证展示区域 */
.certification-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
  border: 1px solid rgba(255,255,255,0.4);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.add-certification-btn .btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  font-size: 16px;
}

/* 网格视图 */
.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.certification-card {
  background: #f8f9ff;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.certification-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.1);
}

.certification-card.expired {
  border-color: #ff3b30;
  background: linear-gradient(135deg, #fff0f0, #ffdddd);
}

.certification-card.expiring {
  border-color: #ff9500;
  background: linear-gradient(135deg, #fff4e6, #ffe4b5);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.certification-icon {
  width: 48px;
  height: 48px;
  background: #5856d6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.certification-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.certification-status.active {
  background: #e6f7f1;
  color: #26a872;
}

.certification-status.expired {
  background: #ffdddd;
  color: #ff3b30;
}

.certification-status.expiring {
  background: #ffe4b5;
  color: #ff9500;
}

.card-body {
  margin-bottom: 16px;
}

.certification-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.certification-unit {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
}

.certification-details {
  display: grid;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.detail-value {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.card-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 列表视图 */
.certifications-list {
  display: grid;
  gap: 0px;
}

.certification-item {
  display: flex;
  align-items: center;
  gap: 0px;
  background: #f8f9ff;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.certification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.certification-item.expired {
  border-color: #ff3b30;
  background: linear-gradient(135deg, #fff0f0, #ffdddd);
}

.certification-item.expiring {
  border-color: #ff9500;
  background: linear-gradient(135deg, #fff4e6, #ffe4b5);
}

.item-icon {
  width: 48px;
  height: 48px;
  background: #5856d6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.certification-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.item-details {
  display: grid;
  gap: 8px;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
  white-space: nowrap;
}

.detail-value {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.item-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #5856d6;
  color: white;
}

.btn-primary:hover {
  background: #4c4ac2;
}

.btn-outline {
  background: transparent;
  color: #5856d6;
  border: 1px solid #5856d6;
}

.btn-outline:hover {
  background: #f0f4ff;
}

.btn-danger {
  background: #ff3b30;
  color: white;
}

.btn-danger:hover {
  background: #d70015;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 0 24px;
}

.certification-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #5856d6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .filter-section {
    flex-direction: column;
    gap: 0px;
    align-items: flex-start;
  }
  
  .certifications-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .detail-row {
    grid-template-columns: 1fr;
  }
  
  .certification-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .item-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

/* 隐藏认证图标和色块 */
.certification-icon {
  display: none !important;
}

.item-icon {
  display: none !important;
}

.certification-item {
  gap: 0px !important;
}

.certification-item .item-content {
  margin-left: 0 !important;
}

.card-header {
  justify-content: flex-end !important;
}

/* 认证名称和时效同行样式 */
.certification-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.certification-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.certification-validity {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  background: #f0f4ff;
  padding: 4px 8px;
  border-radius: 6px;
}
