<template>
  <div class="profile-layout">
    <aside class="side-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/profile/basic" active-class="active" class="nav-link">
            <span>基本信息</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile/education" active-class="active" class="nav-link">
            <span>教育经历</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile/work" active-class="active" class="nav-link">
            <span>工作经历</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile/growth-experience" active-class="active" class="nav-link">
            <span>成长经历</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile/my-assets" active-class="active" class="nav-link">
            <span>我的资产</span>
          </router-link>
        </li>
        
        <!-- 教学经验菜单项已移除 -->
        
        <!-- 教学活动菜单项已移除：迁移至教学管理下 -->
        <li class="nav-item">
          <router-link to="/profile/achievements" active-class="active" class="nav-link">
            <span>成果奖励</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile/teaching-evaluations" active-class="active" class="nav-link">
            <span>评价反思</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile/archive-management" active-class="active" class="nav-link">
            <span>报告管理</span>
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
.profile-layout {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 30px;
  min-height: calc(100vh - 72px);
  margin: auto;
  max-width: 1440px;
  width: 100%;
}

.side-nav {
  background: #fff;
  border-right: 1px solid #e8ecf3;
  padding: 16px 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item { }

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 20px;
  color: #445066;
  text-decoration: none;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: #f5f8ff;
}

.nav-link.active {
  background: #eef4ff;
  color: #1677ff;
  border-left-color: #1677ff;
  font-weight: 600;
}

.icon { width: 20px; text-align: center; }

.main-area {
  padding: 16px 24px 24px 0;
}

/* 让主区卡片宽度与整体一致 */
.main-area :deep(.section-card) {
  background: #fff;
  border-radius: 12px;
}
</style> 