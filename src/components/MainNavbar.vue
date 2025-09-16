<template>
  <div class="main-navbar">
    <div class="nav-left">
      <img src="/pic/logo.ico" class="logo" alt="logo" />
      <span class="system-title">教师教学档案袋</span>
    </div>
    <ul class="nav-menu">
      <li class="nav-item" :class="{active: currentPath.startsWith('/Home')}" @click="goNav('/Home')">首页</li>      
      <li class="nav-item evaluation-center-item" :class="{active: currentPath.startsWith('/EvaluationCenter')}" @click="goNav('/EvaluationCenter')">
        考评中心
        <div class="notification-dot" v-if="hasNewNotifications"></div>
      </li>
      <li class="nav-item" :class="{active: currentPath.startsWith('/teaching-resources')}" @click="goNav('/teaching-resources')">教学管理</li>
      <li class="nav-item" :class="{active: currentPath.startsWith('/growth-trajectory')}" @click="goNav('/growth-trajectory')">发展轨迹</li>
      <li class="nav-item" :class="{active: currentPath.startsWith('/learning-square')}" @click="goNav('/learning-square')">协作空间</li>
      <li class="nav-item tch-ai-item" :class="{active: currentPath.startsWith('/tch-ai')}" @click="goNav('/tch-ai')">
        <span class="tch-ai-text">超智人</span>
        <div class="tch-ai-glow"></div>
      </li>
      <li class="nav-item" :class="{active: currentPath.startsWith('/profile')}" @click="goNav('/profile')">个人中心</li>
    </ul>
    <div class="nav-user">
      <img src="/pic/teacher/66.jpg" class="user-avatar" alt="用户头像" />
      <span class="user-name">张婉婷</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed, ref } from 'vue'

const router = useRouter()
const route = useRoute()
const currentPath = computed(() => route.path)

// 新消息提醒状态
const hasNewNotifications = ref(true) // 这里可以根据实际业务逻辑来控制

// 下拉菜单状态
const showDropdown = ref(false)
let hideTimer = null

// 导航函数
const goNav = (path) => {
  if (route.path !== path) {
    router.push(path)
    // 点击考评中心后清除提醒
    if (path === '/ai') {
      hasNewNotifications.value = false
    }
  }
}

// 下拉菜单控制函数
const startHideTimer = () => {
  hideTimer = setTimeout(() => {
    showDropdown.value = false
  }, 300) // 300ms延迟，给用户足够时间移动到子菜单
}

const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}
</script>

<style scoped>
.main-navbar {
  width: 100%;
  height: 72px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 0 20px;
  margin-bottom: 16px;
}
.nav-left {
  display: flex;
  align-items: center;
}
.logo {
  width: 48px;
  height: 48px;
  margin-right: 6px;
}
.system-title {
  font-size: 20px;
  font-weight: bold;
  color: #8b5cf6;
}
.nav-menu {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 36px;
}
.nav-item {
  font-size: 16px;
  color: #333;
  cursor: pointer;
  padding: 8px 18px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  position: relative;
}
.nav-item.active, .nav-item:hover {
  background: #f0f5ff;
  color: #8b5cf6;
  font-weight: 600;
}

/* Tch AI+ 特殊样式 */
.tch-ai-item {
  position: relative;
  overflow: hidden;
  background: transparent;
  border: 2px solid transparent;
  box-shadow: none;
}

.tch-ai-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.tch-ai-item:hover::before {
  left: 100%;
}

.tch-ai-text {
  position: relative;
  z-index: 2;
  color: #1e293b;
  font-weight: 900;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #8b5cf6, #a855f7, #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.tch-ai-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.tch-ai-item:hover .tch-ai-glow {
  opacity: 1;
  animation: pulse 2s infinite;
}

.tch-ai-item.active {
  background: transparent;
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
  transform: translateY(-2px);
}

.tch-ai-item.active .tch-ai-text {
  background: linear-gradient(45deg, #fff, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
}

/* 添加弥撒效果 */
.tch-ai-item::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #667eea, #764ba2, #8b5cf6, #a855f7, #667eea);
  background-size: 400% 400%;
  border-radius: 8px;
  z-index: -1;
  animation: borderGlow 3s ease-in-out infinite;
}

@keyframes borderGlow {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
.dropdown {
  position: relative;
}
.dropdown-content {
  position: absolute;
  background-color: #fff;
  min-width: 180px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border-radius: 6px;
  padding: 8px 0;
  z-index: 101;
  top: 100%;
  left: 0;
  margin-top: 8px;
}
.dropdown-content::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  height: 20px;
  background: transparent;
}
.dropdown-item {
  color: #333;
  padding: 10px 16px;
  text-decoration: none;
  display: block;
  font-size: 16px;
  transition: all 0.2s;
}
.dropdown-item:hover {
  background-color: #f0f5ff;
  color: #1677ff;
}
.nav-user {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.user-name {
  font-size: 16px;
  color: #333;
}

/* 考评中心菜单项样式 */
.evaluation-center-item {
  position: relative;
}

/* 新消息提醒红点样式 */
.notification-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  /* border: 2px solid #fff; */
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.3);
  animation: notificationPulse 2s infinite, notificationShake 3s infinite;
  z-index: 10;
}

/* 红点脉冲动画 */
@keyframes notificationPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.8;
  }
}

/* 红点抖动动画 */
@keyframes notificationShake {
  0%, 90%, 100% {
    transform: translateX(0);
  }
  5%, 15% {
    transform: translateX(-1px);
  }
  10%, 20% {
    transform: translateX(1px);
  }
}

/* 鼠标悬停时红点效果 */
.evaluation-center-item:hover .notification-dot {
  animation: notificationPulse 0.5s infinite, notificationShake 1s infinite;
  transform: scale(1.2);
}

/* 考评中心菜单项激活状态下的红点样式 */
.evaluation-center-item.active .notification-dot {
  background: #dc2626;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.4);
}

@media (max-width: 900px) {
  .main-navbar { flex-direction: column; height: auto; padding: 0 8px; }
  .nav-menu { gap: 12px; }
}
</style> 