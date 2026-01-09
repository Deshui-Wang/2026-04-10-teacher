<template>
  <footer class="dashboard-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>教师发展智能档案中心</h3>
        <p>一站式管理教师教学、学术与职业档案，为晋升评定提供权威数据支撑。</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 页脚组件，无需额外逻辑
</script>

<style scoped>
.dashboard-footer {
  margin-top: 48px;
  background: #fff;
  border-top: 1px solid #e0e6f1;
  padding: 48px 0 24px;
}

.footer-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
}

.footer-section h3 {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.footer-section h4 {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.footer-section p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 36px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #5856d6;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  border: 1px solid #e0e6f1;
  border-radius: 20px;
  transition: all 0.3s;
}

.social-link:hover {
  color: #5856d6;
  border-color: #5856d6;
  background: #f8f9ff;
}

.footer-bottom {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 48px 0;
  border-top: 1px solid #e0e6f1;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #999;
  font-size: 12px;
}

.footer-info a {
  color: #999;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-info a:hover {
  color: #5856d6;
}
</style> 