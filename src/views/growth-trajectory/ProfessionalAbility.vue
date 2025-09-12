<template>
  <div class="professional-ability-page">
    <div class="page-header">
      <h2>专业能力证书持有情况</h2>
    </div>
    
    <!-- 证书统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">📜</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalCertificates }}</div>
          <div class="stat-label">证书总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-number">{{ validCertificates }}</div>
          <div class="stat-label">有效证书</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚠️</div>
        <div class="stat-content">
          <div class="stat-number">{{ expiringCertificates }}</div>
          <div class="stat-label">即将过期</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-content">
          <div class="stat-number">{{ highLevelCertificates }}</div>
          <div class="stat-label">高级证书</div>
        </div>
      </div>
    </div>

    <!-- 证书列表 -->
    <div class="certificates-section">
      <div class="section-header">
        <h3>专业能力证书</h3>
        <div class="filter-tabs">
          <button 
            v-for="status in statusFilters" 
            :key="status.value"
            @click="activeFilter = status.value"
            :class="['filter-tab', { active: activeFilter === status.value }]"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <div class="certificates-grid">
        <div 
          v-for="certificate in filteredCertificates" 
          :key="certificate.id"
          class="certificate-card"
          :class="[`status-${certificate.status}`]"
        >
          <div class="certificate-header">
            <div class="certificate-icon">
              <span>{{ getCertificateIcon(certificate.type) }}</span>
            </div>
            <div class="certificate-status" :class="`status-${certificate.status}`">
              {{ getStatusText(certificate.status) }}
            </div>
          </div>
          
          <div class="certificate-content">
            <h4 class="certificate-name">{{ certificate.name }}</h4>
            <p class="certificate-issuer">{{ certificate.issuer }}</p>
            
            <div class="certificate-details">
              <div class="detail-item">
                <span class="detail-label">证书编号：</span>
                <span class="detail-value">{{ certificate.certificateNumber }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">发证日期：</span>
                <span class="detail-value">{{ certificate.issueDate }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">有效期至：</span>
                <span class="detail-value" :class="{ 'expiring': isExpiringSoon(certificate.expiryDate) }">
                  {{ certificate.expiryDate }}
                </span>
              </div>
            </div>
          </div>

          <div class="certificate-actions">
            <button class="btn btn-view" @click="viewCertificate(certificate)">
              查看详情
            </button>
            <button class="btn btn-download" @click="downloadCertificate(certificate)">
              下载
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 证书详情弹窗 -->
    <div v-if="selectedCertificate" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedCertificate.name }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="certificate-detail-grid">
            <div class="detail-row">
              <span class="detail-label">证书编号：</span>
              <span class="detail-value">{{ selectedCertificate.certificateNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">证书名称：</span>
              <span class="detail-value">{{ selectedCertificate.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">发证机构：</span>
              <span class="detail-value">{{ selectedCertificate.issuer }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">发证日期：</span>
              <span class="detail-value">{{ selectedCertificate.issueDate }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">有效期至：</span>
              <span class="detail-value">{{ selectedCertificate.expiryDate }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">证书状态：</span>
              <span class="detail-value status-badge" :class="`status-${selectedCertificate.status}`">
                {{ getStatusText(selectedCertificate.status) }}
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">关闭</button>
          <button class="btn btn-primary" @click="downloadCertificate(selectedCertificate)">下载证书</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 证书状态筛选
const statusFilters = [
  { label: '全部', value: 'all' },
  { label: '有效', value: 'valid' },
  { label: '即将过期', value: 'expiring' },
  { label: '已过期', value: 'expired' }
]

const activeFilter = ref('all')

// 模拟证书数据
const certificates = ref([
  {
    id: 1,
    name: '高级中学教师资格证',
    certificateNumber: 'JSZ2024001234',
    issuer: '教育部',
    issueDate: '2024-03-15',
    expiryDate: '2029-03-15',
    status: 'valid',
    type: 'teaching'
  },
  {
    id: 2,
    name: '数学学科专业能力证书',
    certificateNumber: 'MATH2023005678',
    issuer: '中国数学会',
    issueDate: '2023-08-20',
    expiryDate: '2026-08-20',
    status: 'valid',
    type: 'subject'
  },
  {
    id: 3,
    name: '教育技术能力证书',
    certificateNumber: 'ETC2022009012',
    issuer: '中央电化教育馆',
    issueDate: '2022-11-10',
    expiryDate: '2024-12-31',
    status: 'expiring',
    type: 'technology'
  },
  {
    id: 4,
    name: '心理咨询师证书',
    certificateNumber: 'PSY2021003456',
    issuer: '中国心理学会',
    issueDate: '2021-06-15',
    expiryDate: '2023-06-15',
    status: 'expired',
    type: 'psychology'
  },
  {
    id: 5,
    name: '教育管理高级证书',
    certificateNumber: 'EMG2024007890',
    issuer: '中国教育学会',
    issueDate: '2024-01-20',
    expiryDate: '2027-01-20',
    status: 'valid',
    type: 'management'
  },
  {
    id: 6,
    name: '国际教育交流证书',
    certificateNumber: 'IEC2023002345',
    issuer: '教育部国际合作与交流司',
    issueDate: '2023-09-05',
    expiryDate: '2025-09-05',
    status: 'valid',
    type: 'international'
  }
])

const selectedCertificate = ref(null)

// 计算属性
const totalCertificates = computed(() => certificates.value.length)

const validCertificates = computed(() => 
  certificates.value.filter(cert => cert.status === 'valid').length
)

const expiringCertificates = computed(() => 
  certificates.value.filter(cert => cert.status === 'expiring').length
)

const highLevelCertificates = computed(() => 
  certificates.value.filter(cert => 
    cert.name.includes('高级') || cert.name.includes('国际') || cert.name.includes('管理')
  ).length
)

const filteredCertificates = computed(() => {
  if (activeFilter.value === 'all') {
    return certificates.value
  }
  return certificates.value.filter(cert => cert.status === activeFilter.value)
})

// 方法
const getCertificateIcon = (type) => {
  const icons = {
    teaching: '👨‍🏫',
    subject: '📚',
    technology: '💻',
    psychology: '🧠',
    management: '👔',
    international: '🌍'
  }
  return icons[type] || '📜'
}

const getStatusText = (status) => {
  const statusMap = {
    valid: '有效',
    expiring: '即将过期',
    expired: '已过期'
  }
  return statusMap[status] || '未知'
}

const isExpiringSoon = (expiryDate) => {
  const expiry = new Date(expiryDate)
  const now = new Date()
  const diffTime = expiry - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 90 && diffDays > 0
}

const viewCertificate = (certificate) => {
  selectedCertificate.value = certificate
}

const closeModal = () => {
  selectedCertificate.value = null
}

const downloadCertificate = (certificate) => {
  // 模拟下载功能
  console.log('下载证书:', certificate.name)
  alert(`正在下载证书：${certificate.name}`)
}
</script>

<style scoped>
.professional-ability-page {
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

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.1);
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
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 证书区域 */
.certificates-section {
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

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
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

.filter-tab:hover {
  border-color: #5856d6;
  color: #5856d6;
}

.filter-tab.active {
  background: #5856d6;
  border-color: #5856d6;
  color: white;
}

/* 证书网格 */
.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.certificate-card {
  background: #f8f9ff;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.certificate-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.1);
}

.certificate-card.status-valid {
  border-color: #34c759;
  background: linear-gradient(135deg, #f0fff4, #e6f7f1);
}

.certificate-card.status-expiring {
  border-color: #ff9500;
  background: linear-gradient(135deg, #fff7e6, #fff4e6);
}

.certificate-card.status-expired {
  border-color: #ff6b6b;
  background: linear-gradient(135deg, #fff0f0, #ffdddd);
}

.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.certificate-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.certificate-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.certificate-status.status-valid {
  background: #e6f7f1;
  color: #26a872;
}

.certificate-status.status-expiring {
  background: #fff4e6;
  color: #fa8c16;
}

.certificate-status.status-expired {
  background: #ffdddd;
  color: #ff6b6b;
}

.certificate-content {
  margin-bottom: 16px;
}

.certificate-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.certificate-issuer {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
}

.certificate-details {
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

.detail-value.expiring {
  color: #ff9500;
  font-weight: 600;
}

.certificate-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view {
  background: #eef2ff;
  color: #5856d6;
}

.btn-view:hover {
  background: #dbe4ff;
}

.btn-download {
  background: #5856d6;
  color: white;
}

.btn-download:hover {
  background: #4c4ac2;
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

.certificate-detail-grid {
  display: grid;
  gap: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .detail-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.detail-row .detail-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: 24px;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-primary {
  background: #5856d6;
  color: white;
}

.btn-primary:hover {
  background: #4c4ac2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .certificates-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .filter-tabs {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-tab {
    flex: 1;
    text-align: center;
  }
}
</style>
