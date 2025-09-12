<template>
  <div class="report-demo">
    <div class="demo-header">
      <h1>报告管理系统演示</h1>
      <p>点击下方按钮体验报告创建功能</p>
    </div>
    
    <div class="demo-content">
      <button @click="showModal = true" class="demo-btn">
        <span class="btn-icon">📊</span>
        创建新报告
      </button>
      
      <div class="feature-list">
        <h3>功能特性</h3>
        <ul>
          <li>✅ 8个专业模块选择（资产、成果奖励、数字素养等）</li>
          <li>✅ 模块复制和删除功能</li>
          <li>✅ 实时数据预览</li>
          <li>✅ 图表自定义（类型、配色、透明度等）</li>
          <li>✅ 响应式设计</li>
          <li>✅ 现代化UI界面</li>
        </ul>
      </div>
    </div>
    
    <ReportCreationModal 
      v-if="showModal" 
      @close="showModal = false" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReportCreationModal from '../components/profile/ReportCreationModal.vue'

const showModal = ref(false)
</script>

<style scoped>
.report-demo {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.demo-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.demo-header h1 {
  font-size: 3rem;
  margin: 0 0 16px 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.demo-header p {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
}

.demo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  max-width: 800px;
  width: 100%;
}

.demo-btn {
  background: white;
  color: #8b5cf6;
  border: none;
  padding: 20px 40px;
  border-radius: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.demo-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.btn-icon {
  font-size: 1.5rem;
}

.feature-list {
  background: rgba(255, 255, 255, 0.95);
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.feature-list h3 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  text-align: center;
}

.feature-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 8px 0;
  font-size: 1rem;
  color: #555;
  border-bottom: 1px solid #f0f0f0;
}

.feature-list li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .demo-header p {
    font-size: 1rem;
  }
  
  .demo-btn {
    padding: 16px 32px;
    font-size: 1rem;
  }
  
  .feature-list {
    padding: 24px;
  }
}
</style>
