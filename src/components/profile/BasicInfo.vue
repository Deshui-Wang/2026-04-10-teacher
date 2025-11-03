<template>
  <div class="stack">
    <div class="page-header">
      <div class="section-header">个人信息</div>
      <button class="edit-btn">申请编辑</button>
    </div>
    
    <div class="section-card">
      <div class="summary-card">
        <div class="avatar-wrap">
          <img class="avatar-img" src="/pic/teacher/66.jpg" alt="教师头像" />
        </div>
        <div class="summary-info">
          <div class="name">张婉婷（id: 1356789012）</div>
          <div class="meta">
            <span>女</span>
            <span>汉族</span>
            <span>1988.07.07（ 110106198807070001 ）</span>
          </div>
          <div class="meta">
            <span>中国大陆</span>
            <span>北京-朝阳区</span>
          </div>
          <div class="meta">
            <span>北京理工大学</span>
            <span>人工智能</span>
            <span>博士</span>
          </div>
        </div>
      </div>
    </div>

    <div class="two-col">
      <div class="col-left">
        <div class="section-header">在职信息</div>
        <div class="section-card">
          <h2 class="section-title">信息工程学院</h2>
          <p class="desc">2019年转入「信息工程学院」，任教学组长职位，后2022年提升为系副主任；2024年度优秀创新教师。</p>
          <div class="divider"></div>
          <div class="block">
            <div class="block-title">任职职位</div>
            <div class="chips">
              <span class="chip">2019— 教学组长</span>
              <span class="chip">2020— 教研组长</span>
              <span class="chip">2022— 系副主任（当前）</span>
            </div>
          </div>
          <div class="divider"></div>
          <div class="block">
            <div class="block-title">职称</div>
            <div class="chips">
              <span class="chip">2019— 讲师</span>
              <span class="chip">2021— 高级讲师</span>              
              <span class="chip">2025— 副教授（当前）</span>  
            </div>
          </div>
        </div>

        <div class="section-card">
          <h2 class="section-title">教学方向</h2>
          <div class="chips">
            <span class="chip type-1">人工智能</span>
            <span class="chip type-2">软件工程</span>
            <span class="chip type-3">AI大模型</span>
            <span class="chip type-4">智能体开发</span>
          </div>
        </div>
      </div>

      <div class="col-right">
      </div>
    </div>
    <div class="two-col">
      <div class="col-left">
        <div class="section-header">健康情况</div>
        <div class="section-card">
          <h2 class="section-title">体检报告</h2>
          <div class="chips">
            <span class="chip type-2">2019— 体检报告（健康）</span>
            <span class="chip type-2">2020— 体检报告（健康）</span>
            <span class="chip type-2">2021— 体检报告（健康）</span>
            <span class="chip type-4">2022— 体检报告（健康）</span>
            <span class="chip type-5">2023— 体检报告（健康）</span>
            <span class="chip type-6">2024— 体检报告（健康）</span>
            <span class="chip type-3">2025— 心理健康报告（健康）</span>
          </div>
        </div>
      </div>

      <div class="col-right">
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.stack { 
  display: grid; gap: 16px; 
  color: #333;
  padding: 24px;
  font-family: 'Poppins', sans-serif;
  margin: auto;
  width: 100%;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* 章节标题 */
.section-header {
  font-size: 24px;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 0;
  text-align: left;
}

/* 编辑按钮 */
.edit-btn {
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
}

.edit-btn:hover {
  background: #0958d9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
}

.edit-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(22, 119, 255, 0.3);
}

/* 框样式 */
.section-card { 
  background: #fff; 
  padding: 24px; 
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 顶部概要卡片 */
.summary-card {
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: start;
  gap: 30px;
  background: transparent;
  border-radius: 12px;
  padding: 0px;
}
.avatar-wrap { width: 160px; height: 160px; border-radius: 50%; overflow: hidden; background: #f5f7fb; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.summary-info .name { font-size: 32px; font-weight: 700; color: #333; display: flex;}
.summary-info .meta { display: flex; gap: 18px; margin-top: 20px; color: #667085; font-size: 14px; }
.title-badge { color: #1677ff; font-weight: 600; }

/* 两列主体 */
.two-col { display: grid; grid-template-columns: 1fr 0fr; gap: 16px; }
.col-left, .col-right { display: grid; gap: 16px; }

.section-title { margin: 0 0 20px 0; font-size: 16px; color: #333; font-weight: 600; display: flex;}
.desc { margin: 0; color: #555; line-height: 1.8; display: flex;}
.divider { height: 0px; background: #eef0f5; margin: 34px 0; }
.block { }
.block-title { color: #333; font-weight: 600; margin-bottom: 20px;  display: flex;}
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chip { background: #f5f7ff; color: #475569; border: 1px solid #e3e8f4; padding: 6px 12px; border-radius: 3px; font-size: 13px; }
.chip.type-1 { background: #eef6ff; border-color: #d6e6ff; }
.chip.type-2 { background: #eefaf4; border-color: #d3f0e0; }
.chip.type-3 { background: #f6efff; border-color: #eadcff; }
.chip.type-4 { background: #eef6ff; border-color: #d6e6ff; }

@media (max-width: 1100px) {
  .two-col { grid-template-columns: 1fr; }
}
</style> 