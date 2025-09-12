<template>
  <div class="teaching-resources-layout">
    <aside class="side-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/teaching-resources/workload" active-class="active" class="nav-link">
            <span>工作量化</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/teaching-resources/resume" active-class="active" class="nav-link">
            <span>教学简历</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/teaching-resources/semester-plan" active-class="active" class="nav-link">
            <span>学期计划</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/teaching-resources/teacher-ethics" active-class="active" class="nav-link">
            <span>师德师风</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/teaching-resources/student-grades" active-class="active" class="nav-link">
            <span>学生成绩</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/teaching-resources/classroom-data" active-class="active" class="nav-link">
            <span>课堂数据</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/teaching-resources/courseware" active-class="active" class="nav-link">
            <span>课件教案</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/teaching-resources/teaching-activities" active-class="active" class="nav-link">
            <span>教学经验</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/teaching-resources/student-assignments" active-class="active" class="nav-link">
            <span>学生作业</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/teaching-resources/student-academic" active-class="active" class="nav-link">
            <span>我的学生</span>
          </router-link>
        </li>
      </ul>
    </aside>

    <main class="main-area">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.teaching-resources-layout {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 30px;
  min-height: 100vh;
  max-width: 1440px;
  margin: auto;
  background: #f5f7fa;
  width: 100%;
}

.side-nav {
  background: white;
  border-right: 1px solid #e8ecf3;
  padding: 20px 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 16px 24px 24px 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: block;
  padding: 12px 20px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: #f0f9ff;
  color: #1677ff;
}

.nav-link.active {
  background: #e6f7ff;
  color: #1677ff;
  border-left-color: #1677ff;
  font-weight: 600;
}

.main-area {
  /* max-width: calc(1440px - 180px); */
  width: 100%;
  padding: 16px 24px 24px 0;
  overflow: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .teaching-resources-layout {
    grid-template-columns: 1fr;
  }
  
  .side-nav {
    display: none;
  }
}
</style>
