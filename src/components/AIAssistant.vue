<template>
  <div>
    <!-- 悬浮球 -->
    <div v-if="!isPanelVisible" class="floating-ball" @click="togglePanel">
      <img src="/pic/ai icon.png" alt="AI Assistant" />
    </div>

    <!-- AI助手操作面板 -->
    <div v-if="isPanelVisible" class="assistant-drawer-custom">
      <div class="assistant-header">
        <div class="header-title-container">
          <img src="/pic/image 1.png" alt="AI Assistant Icon" class="header-icon" />
          <span class="title">小智人</span>
        </div>
        <button @click="togglePanel" class="close-btn">&times;</button>
      </div>
      <div class="assistant-panel">
        <!-- 2. & 3. Collapsible sections -->
        <div class="quick-access">
          <div class="access-item" @click="showTaskList = !showTaskList">
            <img src="/pic/todo.png" alt="进行中的任务" class="access-icon" />
            <span>任务 (3)</span>
          </div>
          <div class="access-item" @click="showPocketList = !showPocketList">
            <img src="/pic/koudai.png" alt="临时知识口袋" class="access-icon" />
            <span>临时口袋 (2)</span>
          </div>
          <div class="access-item" @click="openIntelligentCenter">
            <img src="/pic/image 1.png" alt="智能中心" class="access-icon" />
            <span>智能中心</span>
          </div>
        </div>

        <div v-if="showTaskList" class="collapsible-content">
          <div class="task-list">
            <el-button type="primary" link class="task-item">撰写《高等数学》期末教学反思</el-button>
            <el-button type="primary" link class="task-item">更新“人工智能基础”课程课件</el-button>
            <el-button type="primary" link class="task-item">处理“计算机网络”课程学生邮件</el-button>
          </div>
        </div>

        <div v-if="showPocketList" class="collapsible-content">
          <div class="pocket-list">
            <el-button type="primary" link class="pocket-item">关于“深度学习”的最新论文笔记</el-button>
            <el-button type="primary" link class="pocket-item">备课资料：下周“计算机体系结构”的引言</el-button>
          </div>
        </div>
        <div class="pre-suggestions">
          <el-button type="primary" link class="pocket-item">帮我总结一下当前页面内容</el-button>
        </div>
        <div class="suggestion-list">
        </div>
        <div class="chat-history">
          <div v-for="message in messages" :key="message.id" class="chat-message" :class="`message-${message.sender}`">
            <div class="message-content">
              <img src="/pic/ai icon.png" alt="AI Icon" class="avatar" v-if="message.sender === 'ai'">
              <div class="message-bubble-wrapper">
                <div class="message-bubble">{{ message.text }}</div>
                <div v-if="message.suggestions" class="suggestion-list-under-bubble">
                  <el-button
                    v-for="(suggestion, index) in message.suggestions"
                    :key="index"
                    type="primary"
                    link
                    class="suggestion-item"
                    @click="handleSuggestionClick(suggestion, message.type)"
                  >
                    {{ suggestion }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <!-- 4. 大模型对话框 -->
      <div class="chat-area-wrapper">
        <div class="quick-actions">
          <el-button :icon="Scissor" size="small">截图</el-button>
          <el-button size="small">翻译</el-button>
          <el-button :icon="EditPen" size="small">画图</el-button>
          <el-button :icon="Document" size="small">文档</el-button>
        </div>
        <div class="chat-input-area">
          <el-input
            v-model="chatInput"
            type="textarea"
            :rows="4"
            placeholder="请输入您的问题...@提及课程或活动"
            class="chat-input"
          />
          <div class="chat-actions">
            <el-button :icon="Upload" circle></el-button>
            <el-button>@</el-button>
            <el-button type="primary">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElCard, ElButton, ElInput } from 'element-plus';
import { Upload, Scissor, EditPen, Document } from '@element-plus/icons-vue';

const showTaskList = ref(false);
const showPocketList = ref(false);

// 控制面板显示
const isPanelVisible = ref(false);

const router = useRouter();

const togglePanel = () => {
  isPanelVisible.value = !isPanelVisible.value;
};

const handleSuggestionClick = (suggestion, messageType) => {
  if (messageType === 'student-scholarship-prompt' && suggestion === '查看该学生主页') {
    router.push('/student-academic/1');
  }
};

const openIntelligentCenter = () => {
  window.open('https://agentuat.lhrj.cn/', '_blank');
};

// Collapse state for tasks and prompts

// 对话框输入
const chatInput = ref('');

const messages = ref([]);
const route = useRoute();

watch(() => route.path, (newPath) => {
  // “考评中心”的路由是 /ai
  if (newPath === '/ai') {
    isPanelVisible.value = true;
    
    const messageExists = messages.value.some(m => m.type === 'evaluation-prompt');

    if (!messageExists) {
        messages.value.push({
            id: Date.now(),
            sender: 'ai',
            text: '您好，您有一个新的考评任务请尽快完成！',
            type: 'evaluation-prompt'
        });
    }
  } else if (newPath.startsWith('/growth-trajectory')) {
    isPanelVisible.value = true;
    
    const messageExists = messages.value.some(m => m.type === 'growth-trajectory-prompt');

    if (!messageExists) {
        messages.value.push({
            id: Date.now(),
            sender: 'ai',
            text: '现阶段您正处于事业黄金上升期，虽然感觉上升缓慢，但是请一定不要气馁，我为你量身定制了几个小捷径，试试看吧～',
            type: 'growth-trajectory-prompt',
            suggestions: [
              '应聘伊利春才招聘会主席',
              '张志明智能体使用数据异常请关注',
              '数字人小优智能体可开始二次优化',
            ]
        });
    }
  } else if (newPath === '/profile/student-academic') {
    isPanelVisible.value = true;
    
    const messageExists = messages.value.some(m => m.type === 'student-scholarship-prompt');

    if (!messageExists) {
        messages.value.push({
            id: Date.now(),
            sender: 'ai',
            text: '您有1名学生正在申请奖学金请关注',
            type: 'student-scholarship-prompt',
            suggestions: ['查看该学生主页']
        });
    }
  }
}, { immediate: true });
</script>

<style scoped>
.floating-ball {
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #409eff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  z-index: 2000; /* Ensure it's above the panel */
  animation: breathing 2.5s ease-in-out infinite;
}

@keyframes breathing {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
  }
}

.floating-ball:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  animation-play-state: paused; /* 悬停时暂停呼吸动画 */
}

.floating-ball img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.assistant-drawer-custom {
  position: fixed;
  top: 80px;
  right: 20px;
  bottom: 20px;
  width: 450px;
  background-color: #f7f9fc;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 1999; /* Below the floating ball but above everything else */
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.assistant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #edf2fa;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.header-title-container {
  display: flex;
  align-items: center;
}

.header-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.assistant-header .title {
  font-size: 18px;
  font-weight: bold;
  color: #6549cb;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #909399;
}

.close-btn:hover {
  color: #6549cb;
}

.assistant-panel {
  padding: 20px 20px 0;
  overflow-y: auto;
  flex-grow: 1;
  background: #fff;
}

.chat-history {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.chat-message {
  display: flex;
}

.message-ai {
  justify-content: flex-start;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 18px;
  background-color: #e9eef6;
  color: #303133;
  max-width: 100%;
  line-height: 1.5;
}

.message-bubble-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.suggestion-list-under-bubble {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: baseline;
}

.quick-access {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  background-color: #edf2fa5c;
  border-radius: 50px;
  padding: 20px 10px;
}

.access-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  text-align: center;
  width: 120px;
}

.access-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  margin-bottom: 8px;
  object-fit: contain;
}

.access-item span {
  font-size: 14px;
}

.collapsible-content {
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: var(--el-box-shadow-light);
}

.quick-actions {
  display: flex;
  gap: 1px;
  margin-bottom: 10px;
}

.quick-actions .el-button {
  border-radius: 20px;
}

.chat-area-wrapper {
  padding: 20px;
  /* border-top: 1px solid #ebeef5; */
  background-color: #fff;
}

.chart-container {
  width: 100%;
  height: 200px;
}

.task-list {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}

.task-item {
  margin-bottom: 8px;
  justify-content: flex-start;
}

.prompt-list .prompt-item {
  margin-bottom: 15px;
}
.prompt-list .prompt-item:last-child {
  margin-bottom: 0;
}

.prompt-list .prompt-item p {
    margin: 0 0 10px 0;
    line-height: 1.5;
}

.pocket-list {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}

.pocket-item {
  margin-bottom: 8px;
  justify-content: flex-start;
}

/* .suggestion-list {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
} */

.suggestion-item {
  margin: 0 0 8px 0;
  justify-content: flex-start;
  height: auto;
  line-height: 1.4;
  white-space: normal;
  text-align: left;
  padding-left: 0;
}

.pre-suggestions {
  margin: 15px;
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
.subtitle {
  font-size: 14px;
  color: #5984d8;
  margin: 3px;
  line-height: 1.5;
  display: flex;
}
.subtitle:hover {
  font-size: 14px;
  color: #195ce0;
  margin: 3px;
  line-height: 1.5;
  display: flex;
}

.chat-input-area {
  border: 1px solid #8b5cf6;
  border-radius: 8px;
  padding: 10px;
}

.chat-input-area .chat-input {
  margin-bottom: 10px;
}

.chat-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.chat-actions .el-button {
  margin-left: 10px;
}

</style> 