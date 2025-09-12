<template>
  <div class="growth-trajectory-layout">
    <aside class="side-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/growth-trajectory/route" active-class="active" class="nav-link">
            <span>成长线路</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/growth-trajectory/professional-ability" active-class="active" class="nav-link">
            <span>专业能力</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/growth-trajectory/teaching-achievements" active-class="active" class="nav-link">
            <span>教学成果</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/growth-trajectory/industry-practice" active-class="active" class="nav-link">
            <span>行业实践</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/growth-trajectory/ability-certification" active-class="active" class="nav-link">
            <span>能力认证</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/growth-trajectory/research-innovation" active-class="active" class="nav-link">
            <span>科研创新</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/growth-trajectory/international-ability" active-class="active" class="nav-link">
            <span>国际能力</span>
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
.growth-trajectory-layout {
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
  width: 100%;
  padding: 16px 24px 24px 0;
  overflow: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .growth-trajectory-layout {
    grid-template-columns: 1fr;
  }
  
  .side-nav {
    display: none;
  }
}
</style>
