<template>
  <div class="ai-assistant">
    <!-- 悬浮球 -->
    <div v-if="!isPanelVisible" class="floating-ball" @click="togglePanel">
      <div class="ball-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
    </div>

    <!-- 聊天面板 -->
    <div v-if="isPanelVisible" class="chat-panel">
      <div class="panel-header">
        <div class="header-left">
          <div class="ai-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div class="header-info">
            <h3>AI助手</h3>
            <span class="status">在线</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn" @click="openIntelligentCenter">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15,3 21,3 21,9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
          <button class="action-btn close-btn" @click="togglePanel">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="panel-content">
        <!-- 消息列表 -->
        <div class="messages-container">
          <div v-for="message in messages" :key="message.id" class="message" :class="message.sender">
            <div class="message-avatar" v-if="message.sender === 'ai'">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.text }}</div>
              <div v-if="message.suggestions && message.suggestions.length > 0" class="message-suggestions">
                <button 
                  v-for="(suggestion, index) in message.suggestions" 
                  :key="index"
                  class="suggestion-btn"
                  @click="handleSuggestionClick(suggestion, message.type)"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-container">
            <input 
              v-model="chatInput" 
              type="text" 
              placeholder="输入您的问题..."
              @keyup.enter="sendMessage"
              class="chat-input"
            />
            <button @click="sendMessage" class="send-btn" :disabled="!chatInput.trim()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 响应式数据
const isPanelVisible = ref(false)

const router = useRouter();

const togglePanel = () => {
  isPanelVisible.value = !isPanelVisible.value;
};

const handleSuggestionClick = (suggestion, messageType) => {
  // 处理建议点击，可以根据需要添加具体逻辑
  console.log('点击建议:', suggestion, messageType);
};

const openIntelligentCenter = () => {
  window.open('https://agentuat.lhrj.cn/', '_blank');
};

// 对话框输入
const chatInput = ref('');

const messages = ref([]);
const route = useRoute();

watch(() => route.path, (newPath) => {
  // 修复成长中心的路由匹配
  if (newPath === '/EvaluationCenter') {
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
  } else {
    // 在其他页面时，确保面板关闭，悬浮球显示
    isPanelVisible.value = false;
  }
}, { immediate: true });

// 发送消息
const sendMessage = () => {
  if (!chatInput.value.trim()) return;
  
  // 添加用户消息
  messages.value.push({
    id: Date.now(),
    sender: 'user',
    text: chatInput.value
  });
  
  // 模拟AI回复
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      sender: 'ai',
      text: '感谢您的提问，我正在为您处理中...'
    });
  }, 1000);
  
  chatInput.value = '';
};
</script>

<style scoped>
.floating-ball {
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;
}

.floating-ball:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}

.ball-icon {
  color: white;
  font-size: 24px;
}

.chat-panel {
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.status {
  font-size: 12px;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-btn:hover {
  background: rgba(255, 0, 0, 0.3);
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message.ai .message-avatar {
  background: #f0f2f5;
  color: #667eea;
}

.message.user .message-avatar {
  background: #667eea;
  color: white;
}

.message-content {
  max-width: 80%;
}

.message-text {
  background: #f0f2f5;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.user .message-text {
  background: #667eea;
  color: white;
}

.message-suggestions {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-btn {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-btn:hover {
  background: #bbdefb;
  color: #0d47a1;
}

.input-area {
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.chat-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.send-btn {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-ball {
    right: 20px;
    bottom: 20px;
    width: 50px;
    height: 50px;
  }
  
  .chat-panel {
    right: 20px;
    bottom: 20px;
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    max-height: 600px;
  }
}
</style>
