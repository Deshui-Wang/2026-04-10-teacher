<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">添加教育经历</h3>
        <button class="close-btn" @click="closeModal">
          <span class="close-icon">×</span>
        </button>
      </div>
      
      <div class="modal-body">
        <!-- 文件上传区域 -->
        <div class="upload-section">
          <div class="upload-area" 
               :class="{ 'drag-over': isDragOver }"
               @drop="handleFileDrop"
               @dragover="handleDragOver"
               @dragleave="handleDragLeave"
               @click="triggerFileInput">
            <input 
              ref="fileInput" 
              type="file" 
              accept=".jpg,.jpeg,.png,.pdf"
              @change="handleFileSelect"
              style="display: none"
            >
            <div class="upload-content">
              <div class="upload-icon">📄</div>
              <div class="upload-text">请上传您的毕业证书或学位证书</div>
              <div class="upload-hint">格式支持jpg、png、PDF</div>
              <div class="upload-btn">点击上传</div>
            </div>
          </div>
          <div v-if="selectedFile" class="file-preview">
            <div class="file-info">
              <span class="file-name">{{ selectedFile.name }}</span>
              <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
              <button class="remove-file" @click="removeFile">×</button>
            </div>
          </div>
        </div>

        <!-- 表单区域 -->
        <div class="form-section">
          <!-- 学校选择 -->
          <div class="form-group">
            <label class="form-label">学校名称 *</label>
            <div class="autocomplete-container">
              <input 
                v-model="formData.school"
                @input="handleSchoolInput"
                @focus="showSchoolOptions = true"
                class="form-input"
                placeholder="请输入学校名称"
                type="text"
              >
              <div v-if="showSchoolOptions && filteredSchools.length > 0" class="autocomplete-dropdown">
                <div 
                  v-for="school in filteredSchools" 
                  :key="school"
                  class="autocomplete-item"
                  @click="selectSchool(school)"
                >
                  {{ school }}
                </div>
              </div>
            </div>
          </div>

          <!-- 专业名称 -->
          <div class="form-group">
            <label class="form-label">专业名称 *</label>
            <input 
              v-model="formData.major"
              class="form-input"
              placeholder="请输入专业名称"
              type="text"
            >
          </div>

          <!-- 学历选择 -->
          <div class="form-group">
            <label class="form-label">学历 *</label>
            <select v-model="formData.degree" class="form-select">
              <option value="">请选择学历</option>
              <option value="专科">专科</option>
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
              <option value="博士后">博士后</option>
            </select>
          </div>

          <!-- 时间选择 -->
          <div class="form-group">
            <label class="form-label">入学时间 *</label>
            <input 
              v-model="formData.startDate"
              class="form-input"
              type="date"
            >
          </div>

          <div class="form-group">
            <label class="form-label">毕业时间 *</label>
            <input 
              v-model="formData.endDate"
              class="form-input"
              type="date"
            >
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-cancel" @click="closeModal">取消</button>
        <button class="btn btn-confirm" @click="handleSubmit" :disabled="!isFormValid">确认添加</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

// 表单数据
const formData = ref({
  school: '',
  major: '',
  degree: '',
  startDate: '',
  endDate: ''
})

// 文件上传相关
const fileInput = ref(null)
const selectedFile = ref(null)
const isDragOver = ref(false)

// 学校选择相关
const showSchoolOptions = ref(false)

// 全国高校数据（这里只列出一部分，实际项目中应该从API获取）
const universities = ref([
  '北京大学', '清华大学', '中国人民大学', '北京师范大学', '北京理工大学',
  '北京航空航天大学', '北京科技大学', '北京化工大学', '北京邮电大学',
  '中国农业大学', '北京林业大学', '首都医科大学', '北京中医药大学',
  '首都师范大学', '首都经济贸易大学', '北京外国语大学', '中国传媒大学',
  '中央财经大学', '对外经济贸易大学', '北京体育大学', '中央音乐学院',
  '中央美术学院', '中央戏剧学院', '中国政法大学', '华北电力大学',
  '复旦大学', '上海交通大学', '同济大学', '华东师范大学', '上海财经大学',
  '华东理工大学', '东华大学', '上海外国语大学', '上海大学', '上海理工大学',
  '上海师范大学', '上海海事大学', '上海海洋大学', '上海中医药大学',
  '南京大学', '东南大学', '南京航空航天大学', '南京理工大学', '苏州大学',
  '南京师范大学', '中国矿业大学', '河海大学', '江南大学', '南京农业大学',
  '中国药科大学', '南京医科大学', '南京中医药大学', '南京邮电大学',
  '浙江大学', '浙江工业大学', '浙江师范大学', '宁波大学', '杭州电子科技大学',
  '浙江理工大学', '浙江工商大学', '中国美术学院', '浙江农林大学',
  '中山大学', '华南理工大学', '暨南大学', '华南师范大学', '深圳大学',
  '广东工业大学', '南方医科大学', '广东外语外贸大学', '汕头大学',
  '武汉大学', '华中科技大学', '华中师范大学', '武汉理工大学', '中南财经政法大学',
  '中国地质大学', '华中农业大学', '湖北大学', '武汉科技大学', '中南民族大学',
  '四川大学', '电子科技大学', '西南交通大学', '西南财经大学', '四川农业大学',
  '成都理工大学', '西南石油大学', '四川师范大学', '成都中医药大学',
  '西安交通大学', '西北工业大学', '西安电子科技大学', '长安大学', '西北大学',
  '陕西师范大学', '西安理工大学', '西安建筑科技大学', '西安科技大学',
  '山东大学', '中国海洋大学', '中国石油大学', '青岛大学', '山东师范大学',
  '济南大学', '山东科技大学', '青岛科技大学', '曲阜师范大学',
  '天津大学', '南开大学', '天津医科大学', '天津师范大学', '天津工业大学',
  '天津科技大学', '天津理工大学', '天津财经大学', '天津商业大学',
  '重庆大学', '西南大学', '重庆邮电大学', '重庆交通大学', '重庆医科大学',
  '重庆师范大学', '重庆理工大学', '重庆工商大学', '四川外国语大学',
  '湖南大学', '中南大学', '湖南师范大学', '湘潭大学', '长沙理工大学',
  '湖南农业大学', '中南林业科技大学', '湖南科技大学', '南华大学',
  '吉林大学', '东北师范大学', '延边大学', '长春理工大学', '东北电力大学',
  '长春工业大学', '吉林农业大学', '长春中医药大学', '吉林师范大学',
  '辽宁大学', '大连理工大学', '东北大学', '大连海事大学', '辽宁师范大学',
  '沈阳工业大学', '沈阳航空航天大学', '大连交通大学', '大连工业大学',
  '黑龙江大学', '哈尔滨工业大学', '哈尔滨工程大学', '东北林业大学',
  '哈尔滨医科大学', '黑龙江中医药大学', '哈尔滨师范大学', '哈尔滨理工大学',
  '河北大学', '燕山大学', '河北工业大学', '河北师范大学', '河北农业大学',
  '河北医科大学', '河北科技大学', '石家庄铁道大学', '华北理工大学',
  '山西大学', '太原理工大学', '中北大学', '山西师范大学', '山西农业大学',
  '山西医科大学', '太原科技大学', '山西财经大学', '山西大同大学',
  '内蒙古大学', '内蒙古工业大学', '内蒙古农业大学', '内蒙古师范大学',
  '内蒙古科技大学', '内蒙古民族大学', '内蒙古医科大学', '内蒙古财经大学',
  '新疆大学', '石河子大学', '新疆农业大学', '新疆医科大学', '新疆师范大学',
  '新疆财经大学', '塔里木大学', '伊犁师范大学', '喀什大学',
  '西藏大学', '西藏民族大学', '西藏农牧学院', '西藏藏医药大学',
  '青海大学', '青海师范大学', '青海民族大学', '青海大学昆仑学院',
  '宁夏大学', '北方民族大学', '宁夏医科大学', '宁夏师范学院',
  '甘肃农业大学', '兰州大学', '西北师范大学', '兰州理工大学',
  '兰州交通大学', '甘肃中医药大学', '西北民族大学', '兰州财经大学',
  '云南大学', '昆明理工大学', '云南师范大学', '云南农业大学',
  '云南财经大学', '云南民族大学', '西南林业大学', '昆明医科大学',
  '贵州大学', '贵州师范大学', '贵州财经大学', '贵州民族大学',
  '贵州医科大学', '贵州中医药大学', '遵义医科大学', '贵州理工学院',
  '海南大学', '海南师范大学', '海南医学院', '海南热带海洋学院',
  '海南职业技术学院', '三亚学院', '海口经济学院', '琼台师范学院',
  '广西大学', '广西师范大学', '广西医科大学', '广西民族大学',
  '桂林理工大学', '桂林电子科技大学', '广西科技大学', '广西财经学院',
  '福建师范大学', '厦门大学', '福州大学', '华侨大学', '福建农林大学',
  '福建医科大学', '福建中医药大学', '集美大学', '闽南师范大学',
  '江西师范大学', '南昌大学', '江西财经大学', '江西理工大学',
  '江西农业大学', '江西中医药大学', '华东交通大学', '东华理工大学',
  '安徽大学', '中国科学技术大学', '合肥工业大学', '安徽师范大学',
  '安徽农业大学', '安徽医科大学', '安徽理工大学', '安徽工业大学',
  '安徽财经大学', '安徽工程大学', '安徽中医药大学', '淮北师范大学',
  '河南大学', '郑州大学', '河南师范大学', '河南理工大学', '河南农业大学',
  '河南科技大学', '河南工业大学', '华北水利水电大学', '河南财经政法大学',
  '河南中医药大学', '新乡医学院', '信阳师范学院', '洛阳师范学院'
])

// 过滤后的学校列表
const filteredSchools = computed(() => {
  if (!formData.value.school) return []
  return universities.value.filter(school => 
    school.toLowerCase().includes(formData.value.school.toLowerCase())
  ).slice(0, 10) // 限制显示数量
})

// 表单验证
const isFormValid = computed(() => {
  return formData.value.school && 
         formData.value.major && 
         formData.value.degree && 
         formData.value.startDate && 
         formData.value.endDate
})

// 文件上传处理
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const handleFileDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file && (file.type.includes('image') || file.type === 'application/pdf')) {
    selectedFile.value = file
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 学校选择处理
const handleSchoolInput = () => {
  showSchoolOptions.value = true
}

const selectSchool = (school) => {
  formData.value.school = school
  showSchoolOptions.value = false
}

// 关闭弹层
const closeModal = () => {
  emit('close')
  resetForm()
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// 提交表单
const handleSubmit = () => {
  if (!isFormValid.value) return
  
  const educationData = {
    ...formData.value,
    file: selectedFile.value,
    id: Date.now() // 临时ID
  }
  
  emit('submit', educationData)
  closeModal()
}

// 重置表单
const resetForm = () => {
  formData.value = {
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: ''
  }
  selectedFile.value = null
  showSchoolOptions.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 点击外部关闭下拉框
const handleClickOutside = (event) => {
  if (!event.target.closest('.autocomplete-container')) {
    showSchoolOptions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 0 24px;
}

.upload-section {
  margin-bottom: 32px;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.upload-hint {
  font-size: 14px;
  color: #6b7280;
}

.upload-btn {
  margin-top: 8px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.file-preview {
  margin-top: 16px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #bfdbfe;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.file-name {
  font-size: 14px;
  color: #1e40af;
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: #6b7280;
}

.remove-file {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  text-align: left;
}

.form-input,
.form-select {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.autocomplete-container {
  position: relative;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.autocomplete-item {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s;
}

.autocomplete-item:hover {
  background: #f3f4f6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
  margin-top: 24px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
}

.btn-cancel {
  background: white;
  color: #6b7280;
  border-color: #d1d5db;
}

.btn-cancel:hover {
  background: #f9fafb;
  color: #374151;
}

.btn-confirm {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-confirm:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-confirm:disabled {
  background: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-container {
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .upload-area {
    padding: 30px 15px;
  }
  
  .form-section {
    gap: 16px;
  }
}
</style>
