<template>
  <div class="ai-assistant">
    <!-- 悬浮球 -->
    <div v-show="!isPanelVisible" class="floating-ball" @click="openPanel">
      <!-- 背景光晕效果 -->
      <div class="glow-effect"></div>
      
      
      <!-- 主球体 -->
      <div class="ball-main">
        <div class="ball-icon">
          <img src="/pic/ai icon.png" alt="AI助手" class="ai-icon" />
        </div>
        
      </div>
      
      <!-- 悬浮提示 -->
      <div class="tooltip">
        <span>小智人AI助手</span>
        <div class="tooltip-arrow"></div>
      </div>
    </div>

    <!-- 聊天面板 -->
    <div v-show="isPanelVisible" class="chat-panel">
      <div class="panel-header">
        <div class="header-left">
          <div class="ai-avatar">
            <img src="/pic/ai icon.png" alt="AI助手" class="ai-avatar-icon" />
            <div class="avatar-status"></div>
          </div>
          <div class="header-info">
            <h3>小智人</h3>
            <div class="model-selector" @click="toggleModelDropdown">
              <span class="status">{{ selectedModel.name }}</span>
              <svg 
                class="dropdown-arrow" 
                :class="{ 'rotated': isModelDropdownOpen }"
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn close-btn" @click="closePanel" title="关闭">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- 模型选择下拉菜单 -->
        <div v-show="isModelDropdownOpen" class="model-dropdown" @click.stop>
          <div class="model-list">
            <div 
              v-for="model in availableModels" 
              :key="model.id"
              class="model-item"
              :class="{ 'selected': selectedModel.id === model.id }"
              @click="selectModel(model)"
            >
              <div class="model-icon">
                <img v-if="model.icon" :src="model.icon" :alt="model.name" />
                <div v-else class="model-icon-placeholder">{{ model.name.charAt(0) }}</div>
              </div>
              <div class="model-info">
                <div class="model-name">{{ model.name }}</div>
                <div class="model-desc">{{ model.description }}</div>
              </div>
              <div v-if="selectedModel.id === model.id" class="model-check">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        class="panel-content"
        :class="{ 'drag-over-panel': isDragOver }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <!-- 拖拽提示层 -->
        <div v-if="isDragOver" class="drag-hint-overlay">
          <div class="drag-hint-content">
            <div class="drag-hint-icon">📥</div>
            <div class="drag-hint-text">松开鼠标即可让小智人分析</div>
          </div>
        </div>

        <!-- 导航标签页容器 -->
        <div class="nav-container">
          <div class="nav-tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              class="nav-tab"
              :class="{ active: activeTab === tab.id }"
              @click="handleTabClick(tab.id)"
            >
              <div class="tab-icon">
                <img :src="tab.icon" :alt="tab.label" class="tab-icon-img" />
              </div>
              <div class="tab-text">
                <span class="tab-label">{{ tab.label }}</span>
                <span v-if="tab.count" class="tab-count">({{ tab.count }})</span>
              </div>
            </button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="content-area">
          <!-- 默认状态 - 显示聊天历史 -->
          <div v-if="!activeTab" class="tab-content">
            <div class="chat-messages-container">
              <!-- 欢迎消息 - 只在没有聊天记录时显示 -->
              <div v-if="chatMessages.length === 0" class="messages-content">
                <div class="message-item ai-message">
                  <div class="message-avatar">
                    <img src="/pic/ai icon.png" alt="AI助手" class="message-avatar-img" />
                  </div>
                  <div class="message-content">
                    <div class="message-header">
                      <span class="message-sender">小智人</span>
                      <span class="message-time">刚刚</span>
                    </div>
                    <div class="message-text">您好！我是小智人AI助手，有什么可以帮助您的吗？✨</div>
                  </div>
                </div>
              </div>

              <!-- 聊天历史 -->
              <div v-else class="messages-content">
                <div 
                  v-for="message in chatMessages" 
                  :key="message.id"
                  class="message-item"
                  :class="message.type === 'user' ? 'user-message' : 'ai-message'"
                >
                  <!-- AI消息 -->
                  <template v-if="message.type === 'ai'">
                    <div class="message-avatar">
                      <img src="/pic/ai icon.png" alt="AI助手" class="message-avatar-img" />
                    </div>
                    <div class="message-content">
                      <div class="message-header">
                        <span class="message-sender">小智人</span>
                        <span class="message-time">{{ message.timestamp }}</span>
                      </div>
                      <div class="message-text" v-html="formatMessage(message.content)"></div>
                      <div v-if="message.isTyping" class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </template>

                  <!-- 用户消息 -->
                  <template v-else>
                    <div class="message-content user-content">
                      <div class="message-header">
                        <span class="message-time">{{ message.timestamp }}</span>
                        <span class="message-sender">我</span>
                      </div>
                      <div class="message-text">{{ message.content }}</div>
                    </div>
                  </template>
                </div>

                <!-- AI正在输入的提示 -->
                <div v-if="isAITyping && chatMessages[chatMessages.length - 1]?.type !== 'ai'" class="message-item ai-message">
                  <div class="message-avatar">
                    <img src="/pic/ai icon.png" alt="AI助手" class="message-avatar-img" />
                  </div>
                  <div class="message-content">
                    <div class="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 消息标签页内容 -->
          <div v-if="activeTab === 'messages'" class="tab-content">
            <div class="messages-content">
              <div class="message-item">
                <div class="message-avatar">
                  <img src="/pic/ai icon.png" alt="AI助手" class="message-avatar-img" />
                </div>
                <div class="message-content">
                  <div class="message-header">
                    <span class="message-sender">小智人</span>
                    <span class="message-time">刚刚</span>
                  </div>
                  <div class="message-text">重要通知：<br>2025年优秀教师评选即将开始，请及时准备个人评选资料</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 任务标签页内容 -->
          <div v-if="activeTab === 'tasks'" class="tab-content">
            <div class="suggestions-box">
              <div class="suggestion-item" @click="handleSuggestion('撰写《高等数学》期末教学反思')">
                撰写《高等数学》期末教学反思
              </div>
              <div class="suggestion-item" @click="handleSuggestion('更新《人工智能基础》课程课件')">
                更新《人工智能基础》课程课件
              </div>
              <div class="suggestion-item" @click="handleSuggestion('处理《计算机网络》课程学生邮件')">
                处理《计算机网络》课程学生邮件
              </div>
            </div>
          </div>

          <!-- 临时口袋标签页内容 -->
          <div v-if="activeTab === 'pocket'" class="tab-content">
            <div class="empty-state">
              <div class="empty-icon">📁</div>
              <p>暂无临时内容</p>
            </div>
          </div>

          <!-- 智能中心标签页内容 -->
          <div v-if="activeTab === 'center'" class="tab-content">
            <div class="center-content">
              <div class="center-item" @click="openIntelligentCenter">
                <div class="center-icon">🧠</div>
                <div class="center-text">
                  <h4>智能中心</h4>
                  <p>访问更多AI功能</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 - 重新组织布局 -->
        <div class="input-area">
          <!-- 快捷功能按钮 - 移到输入框上方 -->
          <div class="quick-actions">
            <button class="quick-btn" @click="handleQuickAction('screenshot')" title="截图">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
              <span>截图</span>
            </button>
            <button class="quick-btn" @click="handleQuickAction('translate')" title="翻译">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>AI翻译</span>
            </button>
            <button class="quick-btn" @click="handleQuickAction('draw')" title="画图">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
              <span>智能生图</span>
            </button>
            <button class="quick-btn" @click="handleQuickAction('document')" title="文档">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              <span>智能文档</span>
            </button>
          </div>

          <!-- 输入框和操作按钮容器 - 添加细边框 -->
          <div class="input-container">
            <textarea 
              v-model="chatInput"
              @keydown.enter.prevent="handleEnterKey"
              class="chat-input" 
              placeholder="请输入您的问题...@提及课程或活动 | 或拖拽课件/班课数据到面板任意位置"
              ref="chatInputRef"
              rows="3"
            ></textarea>
            <div class="input-actions">
              <button class="action-btn-small" @click="handleAttachment" title="上传文件">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button class="action-btn-small" @click="handleMention" title="提及">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </button>
              <button 
                @click="sendMessage" 
                class="send-btn"
                :disabled="!chatInput.trim()"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 定义emit事件
const emit = defineEmits(['panel-state-change'])

// 响应式数据
const isPanelVisible = ref(false)
const activeTab = ref(null) // 默认为null，不显示任何内容
const chatInput = ref('')
const chatInputRef = ref(null)
const isDragOver = ref(false)
const route = useRoute()
const router = useRouter()

// 模型选择相关
const isModelDropdownOpen = ref(false)
const selectedModel = ref({
  id: 'super',
  name: '超智人',
  description: 'Your personal super assistant',
  icon: '/pic/image 1.png'
})

// 可用模型列表
const availableModels = ref([
  {
    id: 'super',
    name: '超智人',
    description: 'Your personal super assistant',
    icon: '/pic/image 1.png'
  },
  {
    id: 'tongyi',
    name: '通义千问',
    description: '通义千问大模型',
    icon: '/pic/mini AI/qianwen.png'
  },
  {
    id: 'zhipu',
    name: '智谱清言',
    description: '清华大学超高质量',
    icon: '/pic/mini AI/zhipu.png'
  },
  {
    id: 'deepseek-fast',
    name: 'DeepSeek | Fast',
    description: 'For quick chats',
    icon: '/pic/mini AI/DeepSeek.png'
  },
  {
    id: 'deepseek-thinking',
    name: 'DeepSeek | Thinking',
    description: 'For deep thoughts',
    icon: '/pic/mini AI/DeepSeek.png'
  },
  {
    id: 'gemini-fast',
    name: 'Gemini 2.5 | Fast',
    description: 'For quick chats',
    icon: '/pic/mini AI/gemini.png'
  },
  {
    id: 'grok-fast',
    name: 'Grok 4 | Fast',
    description: 'For quick chats',
    icon: '/pic/mini AI/grok.png'
  },
  {
    id: 'chatgpt5-fast',
    name: 'ChatGPT 5 | Fast',
    description: 'For quick chats',
    icon: '/pic/mini AI/gpt.png'
  },
  {
    id: 'chatgpt4o-fast',
    name: 'ChatGPT 4o | Fast',
    description: 'For quick chats',
    icon: '/pic/mini AI/gpt.png'
  }
])

// 聊天消息数据
const chatMessages = ref([])
const isAITyping = ref(false)
const currentDraggedClass = ref(null) // 保存当前拖拽的班课数据
const currentDraggedCourseware = ref(null) // 保存当前拖拽的课件数据

// 标签页配置 - 使用图片图标
const tabs = ref([
  {
    id: 'messages',
    label: '消息',
    count: 1,
    icon: '/pic/xiaoxi.png'
  },
  {
    id: 'tasks',
    label: '任务',
    count: 3,
    icon: '/pic/renwu.png'
  },
  {
    id: 'pocket',
    label: 'AI笔记',
    count: null,
    icon: '/pic/koudai.png'
  },
  {
    id: 'center',
    label: '智能中心',
    count: null,
    icon: '/pic/image 1.png'
  }
])

// 处理标签页点击
const handleTabClick = (tabId) => {
  if (tabId === 'center') {
    // 智能中心直接打开外链
    openIntelligentCenter()
  } else {
    // 其他标签页切换显示内容
    activeTab.value = activeTab.value === tabId ? null : tabId
  }
}

// 打开面板
const openPanel = () => {
  console.log('打开面板')
  isPanelVisible.value = true
  emit('panel-state-change', { isOpen: true })
  nextTick(() => {
    chatInputRef.value?.focus()
  })
}

// 关闭面板
const closePanel = () => {
  console.log('关闭面板')
  isPanelVisible.value = false
  activeTab.value = null // 关闭面板时重置标签页状态
  emit('panel-state-change', { isOpen: false })
}

// 处理建议点击
const handleSuggestion = (suggestion) => {
  console.log('点击建议:', suggestion)
  chatInput.value = suggestion
  nextTick(() => {
    chatInputRef.value?.focus()
  })
}

// 处理快捷功能
const handleQuickAction = (action) => {
  console.log('快捷功能:', action)
  // 这里可以添加具体的功能实现
}

// 处理附件上传
const handleAttachment = () => {
  console.log('上传附件')
  // 这里可以添加文件上传功能
}

// 处理提及功能
const handleMention = () => {
  console.log('提及功能')
  // 这里可以添加@提及功能
}

// 处理回车键
const handleEnterKey = (event) => {
  if (event.shiftKey) {
    // Shift + Enter 换行
    return
  } else {
    // Enter 发送消息
    event.preventDefault()
    sendMessage()
  }
}

// 打开智能中心
const openIntelligentCenter = () => {
  window.open('https://agent.lhrj.cn/', '_blank')
}

// 发送消息
const sendMessage = async () => {
  if (!chatInput.value.trim()) return
  
  const userMessage = chatInput.value.trim()
  
  // 添加用户消息
  chatMessages.value.push({
    id: Date.now(),
    type: 'user',
    content: userMessage,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })
  
  // 清空输入框
  chatInput.value = ''
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
  
  // 模拟AI思考和回复
  isAITyping.value = true
  
  // 延迟1秒后开始生成AI回复
  setTimeout(() => {
    generateAIResponse(userMessage)
  }, 1000)
}

// 滚动到消息底部
const scrollToBottom = () => {
  const chatContainer = document.querySelector('.chat-messages-container')
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
}

// 生成AI回复（模拟智能分析）
const generateAIResponse = (userMessage) => {
  let aiResponse = ''
  
  // 优先检查是否是课件数据拖拽触发的分析请求
  if (currentDraggedCourseware.value && userMessage.includes('课件描述')) {
    const coursewareData = currentDraggedCourseware.value
    const courseName = coursewareData.name
    const coursewareType = coursewareData.coursewareType
    const relatedCourse = coursewareData.courseName
    const description = coursewareData.description
    
    aiResponse = `好的，我来帮您深入分析《${courseName}》这个${coursewareType}。\n\n📊 **课件深度分析报告**\n\n**📚 基本信息**\n- **课件名称**：${courseName}\n- **课件类型**：${coursewareType}\n- **所属课程**：${relatedCourse}\n- **课件描述**：${description}\n\n**🎯 内容质量评估**\n\n1️⃣ **知识点覆盖**\n   - 课件内容与教学大纲匹配度高\n   - 知识点讲解深入浅出，逻辑清晰\n   - 建议增加2-3个实际应用案例，增强实用性\n\n2️⃣ **教学设计**\n   - 整体结构合理，符合学生认知规律\n   - 互动环节设计得当，能激发学生思考\n   - 建议在重点难点处增加可视化图表或动画\n\n3️⃣ **呈现方式**\n   - 排版清晰，视觉效果良好\n   - 字体大小适中，后排学生可见\n   - 建议统一配色方案，提升专业感\n\n**💡 优化建议**\n\n**内容优化：**\n- 补充最新行业案例，保持内容时效性\n- 增加习题和思考题，巩固学习效果\n- 添加拓展阅读材料，满足不同层次需求\n\n**技术优化：**\n- 优化PPT动画效果，提升课堂吸引力\n- 录制配套讲解视频，方便学生课后复习\n- 制作知识点导图，帮助学生建立知识体系\n\n**互动优化：**\n- 设计3-5个课堂讨论话题\n- 增加即时测验环节（如Kahoot、问卷星）\n- 引入小组协作任务，培养团队能力\n\n**📈 使用建议**\n\n**课前准备：**\n- 提前预习课件，标注重点难点\n- 准备相关案例和补充材料\n- 检查设备和教学工具是否正常\n\n**课中使用：**\n- 合理控制讲解节奏，留足互动时间\n- 根据学生反馈灵活调整教学重点\n- 及时记录学生提出的问题和建议\n\n**课后跟进：**\n- 分享课件给学生，方便复习\n- 布置相关作业，检验学习效果\n- 收集学生反馈，持续优化课件\n\n**📝 我还可以帮您：**\n- 生成本课件的详细教案\n- 设计配套的课堂活动方案\n- 制作学生学习指南\n- 创建课后练习题库\n- 优化课件的视觉设计\n\n请告诉我您需要哪方面的具体帮助！`
    
    // 清空课件数据
    currentDraggedCourseware.value = null
  } else if (currentDraggedClass.value && userMessage.includes('课程编码')) {
    const classData = currentDraggedClass.value
    const classInfo = classData.className ? `${classData.className} - ` : ''
    const courseName = classData.name
    const progress = classData.progress || 0
    const totalHours = classData.totalHours || 0
    const totalCredits = classData.totalCredits || 0
    
    // 根据进度给出不同的建议
    let progressStatus = ''
    let progressSuggestion = ''
    if (progress < 30) {
      progressStatus = '课程处于初期阶段'
      progressSuggestion = '- 建议重点关注学生基础知识的掌握情况\n- 及早发现并辅导学习困难的学生\n- 建立良好的课堂互动氛围'
    } else if (progress < 70) {
      progressStatus = '课程进度正常'
      progressSuggestion = '- 保持当前教学节奏，注意知识点的衔接\n- 适时进行阶段性测验，检验学习效果\n- 收集学生反馈，调整教学方法'
    } else {
      progressStatus = '课程已进入收尾阶段'
      progressSuggestion = '- 开始进行系统性复习和总结\n- 准备期末考核和评估方案\n- 引导学生建立完整的知识体系'
    }
    
    aiResponse = `好的，我来帮您分析${classInfo}《${courseName}》课程的整体情况。\n\n📊 **班课综合分析报告**\n\n**📚 基本信息**\n- **课程编码**：${classData.code}\n- **课程类型**：${classData.courseType}\n- **总学时**：${totalHours}学时\n- **总学分**：${totalCredits}学分\n- **当前进度**：${progress}% - ${progressStatus}\n\n**📈 教学进度分析**\n${progressSuggestion}\n\n**🎯 教学建议**\n1️⃣ **内容设计**\n   - 根据${totalHours}学时合理分配教学内容\n   - 理论与实践相结合，每${Math.floor(totalHours/10)}学时安排一次实践活动\n   - 设置阶段性考核点，及时了解学生掌握情况\n\n2️⃣ **课堂管理**\n   - 建立课堂互动机制，提升学生参与度\n   - 使用多元化教学方法（讨论、案例、实验等）\n   - 关注学生个体差异，实施分层教学\n\n3️⃣ **资源建设**\n   - 完善课程资源库（课件、视频、习题等）\n   - 建立在线学习平台，方便学生自主学习\n   - 收集整理优质教学案例和参考资料\n\n4️⃣ **评估方式**\n   - 采用多元化评价体系（平时成绩+期中+期末）\n   - 重视过程性评价，记录学生学习轨迹\n   - 及时反馈，帮助学生改进学习方法\n\n**💡 下一步行动建议**\n- 查看并分析学生的作业完成情况\n- 检查教学资源是否需要更新\n- 准备下阶段的教学内容和活动\n- 与学生沟通，了解学习需求和困难\n\n**📝 需要我帮您：**\n- 生成详细的教学计划？\n- 设计课堂活动方案？\n- 制定考核评价标准？\n- 分析学生学习数据？\n\n请告诉我您具体需要哪方面的帮助！`
    
    // 清空班课数据
    currentDraggedClass.value = null
  } else if (userMessage.includes('课件') || userMessage.includes('教案')) {
    // 分析是否包含课程名称
    const courseMatch = userMessage.match(/《(.+?)》/)
    const courseName = courseMatch ? courseMatch[1] : '该课件'
    
    if (userMessage.includes('分析')) {
      aiResponse = `好的，我来帮您分析《${courseName}》这个课件。\n\n📊 **课件分析报告**\n\n1️⃣ **内容结构评估**\n   - 课件逻辑清晰，知识点层次分明\n   - 建议增加更多实践案例，提升学生理解\n\n2️⃣ **教学设计建议**\n   - 可以在关键知识点处增加互动问答环节\n   - 建议补充相关的可视化图表，帮助学生直观理解\n\n3️⃣ **改进方向**\n   - 增加课后练习题，巩固所学知识\n   - 可以添加拓展阅读材料，满足不同层次学生需求\n\n4️⃣ **技术建议**\n   - 优化PPT排版，适当使用动画效果\n   - 建议录制配套讲解视频，方便学生课后复习\n\n💡 如果您需要我针对某个具体方面进行深入分析，请告诉我！`
    } else if (userMessage.includes('优化') || userMessage.includes('改进')) {
      aiResponse = `我为《${courseName}》课件提供以下优化建议：\n\n✨ **优化方案**\n\n**内容优化：**\n- 精简冗余文字，提炼核心要点\n- 增加图表、流程图等可视化元素\n- 补充实际应用案例，增强实用性\n\n**结构优化：**\n- 调整章节顺序，符合认知规律\n- 每个章节增加小结和思考题\n- 建立知识点之间的关联导图\n\n**互动优化：**\n- 设计课堂讨论话题\n- 增加即时测验环节\n- 引入小组协作任务\n\n**技术优化：**\n- 统一视觉风格和配色方案\n- 优化字体大小，确保后排可见\n- 添加页码和导航标识\n\n需要我帮您生成具体的优化文档吗？`
    } else {
      aiResponse = `您好！我注意到您提到了《${courseName}》课件。\n\n我可以帮您：\n📝 分析课件内容结构\n🎯 提供教学设计建议\n✏️ 优化课件排版和呈现\n💡 生成配套教学资源\n📊 评估教学效果\n\n请告诉我您具体需要哪方面的帮助？`
    }
  } else if (userMessage.includes('论文')) {
    aiResponse = `📄 **论文写作助手**\n\n我可以帮您：\n\n1. **选题指导** - 分析研究方向，提供选题建议\n2. **文献综述** - 梳理相关文献，总结研究现状\n3. **框架设计** - 规划论文结构，优化逻辑框架\n4. **内容润色** - 优化语言表达，提升学术规范性\n5. **格式调整** - 规范参考文献、图表等格式\n\n请告诉我您目前处于哪个阶段，需要什么帮助？`
  } else if (userMessage.includes('教学反思') || userMessage.includes('总结')) {
    aiResponse = `📝 **教学反思辅助**\n\n我来帮您撰写教学反思，建议包含以下要点：\n\n**一、教学目标达成情况**\n- 分析预设目标的完成度\n- 评估学生知识掌握情况\n\n**二、教学亮点**\n- 成功的教学策略和方法\n- 学生的积极反馈和表现\n\n**三、存在问题**\n- 教学环节的不足之处\n- 学生理解的困难点\n\n**四、改进措施**\n- 针对性的改进方案\n- 下次教学的调整计划\n\n**五、个人成长**\n- 本次教学的收获\n- 专业能力的提升方向\n\n需要我帮您生成详细的教学反思模板吗？`
  } else if (userMessage.includes('作业') || userMessage.includes('成绩')) {
    aiResponse = `📊 **作业与成绩管理**\n\n我可以协助您：\n\n✅ **作业设计**\n- 根据教学目标设计作业题\n- 分层设计不同难度的题目\n- 提供参考答案和评分标准\n\n📈 **成绩分析**\n- 统计班级整体表现\n- 分析知识点掌握情况\n- 识别学习困难学生\n\n💬 **反馈建议**\n- 生成个性化作业评语\n- 提供针对性改进建议\n- 制定辅导计划\n\n请告诉我您需要哪方面的具体帮助？`
  } else if (userMessage.includes('翻译')) {
    aiResponse = `🌐 **AI翻译助手**\n\n我支持多语言翻译服务：\n\n📖 **学术翻译**\n- 论文摘要翻译\n- 专业术语转换\n- 保持学术规范性\n\n📚 **教学材料翻译**\n- 课件内容翻译\n- 教材章节翻译\n- 双语对照制作\n\n✉️ **日常翻译**\n- 邮件翻译\n- 通知公告翻译\n- 对外交流材料\n\n请直接发送需要翻译的内容，并告诉我目标语言！`
  } else {
    // 通用智能回复
    aiResponse = `您好！我是小智人，您的AI教学助手。😊\n\n我可以帮您：\n\n📚 **教学资源**\n- 课件分析与优化\n- 教案设计建议\n- 教学素材生成\n\n📝 **学术写作**\n- 论文润色修改\n- 教学反思撰写\n- 科研材料准备\n\n📊 **数据分析**\n- 成绩统计分析\n- 教学效果评估\n- 学情报告生成\n\n🎯 **日常辅助**\n- 作业批改建议\n- 教学问题答疑\n- 行政事务处理\n\n请告诉我您需要什么帮助，我会竭诚为您服务！💪`
  }
  
  // 使用打字机效果显示AI回复
  typeWriterEffect(aiResponse)
}

// 打字机效果
const typeWriterEffect = (fullText) => {
  const aiMessageId = Date.now()
  
  // 添加AI消息占位
  chatMessages.value.push({
    id: aiMessageId,
    type: 'ai',
    content: '',
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isTyping: true
  })
  
  let currentIndex = 0
  const typingSpeed = 30 // 打字速度（毫秒）
  
  const typingInterval = setInterval(() => {
    if (currentIndex < fullText.length) {
      const currentMessage = chatMessages.value.find(msg => msg.id === aiMessageId)
      if (currentMessage) {
        currentMessage.content += fullText[currentIndex]
        currentIndex++
        
        // 滚动到底部
        nextTick(() => {
          scrollToBottom()
        })
      }
    } else {
      clearInterval(typingInterval)
      isAITyping.value = false
      const currentMessage = chatMessages.value.find(msg => msg.id === aiMessageId)
      if (currentMessage) {
        currentMessage.isTyping = false
      }
    }
  }, typingSpeed)
}

// 格式化消息内容（支持换行和markdown样式）
const formatMessage = (content) => {
  if (!content) return ''
  
  // 替换换行符为 <br>
  let formatted = content.replace(/\n/g, '<br>')
  
  // 支持粗体 **text**
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // 支持emoji
  return formatted
}

// 拖拽处理方法
const handleDragOver = (event) => {
  isDragOver.value = true
  event.dataTransfer.dropEffect = 'copy'
}

const handleDragLeave = (event) => {
  // 只在真正离开 panel-content 时才取消拖拽状态
  // 检查是否离开到外部元素
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
    isDragOver.value = false
  }
}

const handleDrop = (event) => {
  isDragOver.value = false
  
  try {
    const data = event.dataTransfer.getData('application/json')
    if (data) {
      const draggedData = JSON.parse(data)
      console.log('接收到拖拽数据:', draggedData)
      
      let promptText = ''
      let autoSend = false
      
      // 根据拖拽数据类型生成不同的提示文本
      if (draggedData.type === 'courseware') {
        // 课件数据 - 自动发送并获取AI分析
        promptText = `请帮我分析《${draggedData.name}》这个${draggedData.coursewareType}，它属于${draggedData.courseName}课程。课件描述：${draggedData.description}`
        autoSend = true
        // 保存课件数据，供AI回复时使用
        currentDraggedCourseware.value = draggedData
        console.log('✅ 课件已添加到对话框，准备自动发送')
      } else if (draggedData.type === 'class') {
        // 班课数据 - 自动发送并获取AI分析
        const classInfo = draggedData.className ? `${draggedData.className} - ` : ''
        promptText = `请帮我分析${classInfo}《${draggedData.name}》课程（课程编码：${draggedData.code}），课程类型：${draggedData.courseType}，总学时：${draggedData.totalHours}，总学分：${draggedData.totalCredits}，本学期进度：${draggedData.progress}%`
        autoSend = true
        // 保存班课数据，供AI回复时使用
        currentDraggedClass.value = draggedData
        console.log('✅ 班课数据已添加到对话框，准备自动发送')
      }
      
      // 将提示文本填入输入框
      if (promptText) {
        chatInput.value = promptText
        
        // 如果是班课数据，自动发送消息
        if (autoSend) {
          nextTick(() => {
            sendMessage()
          })
        } else {
          // 聚焦输入框
          nextTick(() => {
            chatInputRef.value?.focus()
          })
        }
      }
    }
  } catch (error) {
    console.error('处理拖拽数据失败:', error)
  }
}

// 切换模型下拉菜单
const toggleModelDropdown = () => {
  isModelDropdownOpen.value = !isModelDropdownOpen.value
}

// 关闭模型下拉菜单
const closeModelDropdown = () => {
  isModelDropdownOpen.value = false
}

// 选择模型
const selectModel = (model) => {
  selectedModel.value = model
  closeModelDropdown()
  console.log('切换到模型:', model.name)
}

// 键盘快捷键支持
const handleKeydown = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    if (isPanelVisible.value) {
      closePanel()
    } else {
      openPanel()
    }
  }
  
  if (event.key === 'Escape') {
    if (isModelDropdownOpen.value) {
      closeModelDropdown()
    } else if (isPanelVisible.value) {
      closePanel()
    }
  }
}

// 处理点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (isModelDropdownOpen.value) {
    const dropdown = document.querySelector('.model-dropdown')
    const selector = document.querySelector('.model-selector')
    if (dropdown && selector && !dropdown.contains(event.target) && !selector.contains(event.target)) {
      closeModelDropdown()
    }
  }
}

// 路由监听
watch(() => route.path, (newPath) => {
  console.log('路由变化:', newPath)
  
  const autoOpenPages = ['/EvaluationCenter', '/tch-ai', '/ai-thinking']
  
  if (autoOpenPages.includes(newPath) && !isPanelVisible.value) {
    console.log('自动打开面板')
    openPanel()
  }
}, { immediate: false })

// 组件挂载时的初始化
onMounted(() => {
  console.log('小智人AI助手已启动')
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.ai-assistant {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 悬浮球样式 - 紧贴右侧 */
.floating-ball {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 64px;
  height: 64px;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* 背景光晕效果 */
.glow-effect {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    transform: scale(1);
    opacity: 0.5;
  }
  to {
    transform: scale(1.2);
    opacity: 0.8;
  }
}





/* 主球体 */
.ball-main {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.4),
    0 4px 16px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  animation: breathe 3s ease-in-out infinite;
  overflow: hidden;
}

@keyframes breathe {
  0%, 100% { 
    transform: scale(1); 
  }
  25% { 
    transform: scale(1.05); 
  }
  50% { 
    transform: scale(1.05); 
  }
  75% { 
    transform: scale(1.05); 
  }
}

.ball-icon {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.ai-icon {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  transition: all 0.3s ease;
}

/* 悬浮提示 - 显示在左侧 */
.tooltip {
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.tooltip-arrow {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.9);
}

/* 悬浮球交互效果 */
.floating-ball:hover {
  transform: translateY(-50%) scale(1.05);
}

.floating-ball:hover .ball-main {
  transform: scale(1.1) translateY(-8px);
  box-shadow: 
    0 12px 48px rgba(102, 126, 234, 0.6),
    0 8px 24px rgba(102, 126, 234, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  animation-play-state: paused;
}

.floating-ball:hover .ai-icon {
  transform: scale(1.1);
}

.floating-ball:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(-8px);
}


.floating-ball:active .ball-main {
  transform: scale(0.95);
}

/* 聊天面板样式 - 紧贴右侧全屏 */
.chat-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 450px;
  height: 100vh;
  background: white;
  border-radius: 0;
  box-shadow: 
    -4px 0 24px rgba(0, 0, 0, 0.12),
    -2px 0 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  animation: panelSlideIn 0.3s ease-out;
}

@keyframes panelSlideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.panel-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 13px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: visible; /* 允许下拉菜单显示 */
  z-index: 10;
}

.panel-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  pointer-events: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.ai-avatar {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
}

.ai-avatar-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #4ade8000;
  border: 2px solid rgba(255, 255, 255, 0);
  border-radius: 50%;
}

.header-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  text-align: left;
}

.status {
  font-size: 13px;
  opacity: 0.9;
  margin-top: 2px;
}

.header-actions {
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.action-btn {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

/* 面板拖拽悬停状态 */
.panel-content.drag-over-panel {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
}

/* 拖拽提示层 */
.drag-hint-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
  backdrop-filter: blur(10px);
  pointer-events: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.drag-hint-content {
  text-align: center;
  color: white;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.drag-hint-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.drag-hint-text {
  font-size: 20px;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 导航标签页容器 - 整体浅色背景框 */
.nav-container {
  padding: 20px 24px; /* 增加内边距 */
}

.nav-tabs {
  display: flex;
  align-items: baseline;
  gap: 1px; /* 增加间距 */
  padding: 1px; /* 增加内边距 */
  background: #f3f4f6; /* 白色背景 */
  border-radius: 66px;
}

.nav-tab {
  display: flex;
  flex-direction: column; /* 改为垂直布局 */
  align-items: center;
  gap: 6px; /* 减少间距 */
  padding: 16px 12px; /* 增加内边距 */
  background: transparent;
  border: none;
  border-radius: 66px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #64748b;
  flex: 1;
  justify-content: center;
  min-height: 80px; /* 增加最小高度 */
}

.nav-tab:hover {
  background: #f1f5f9;
  color: #475569;
  transform: translateY(-2px); /* 添加悬停上移效果 */
}

.nav-tab.active {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
  transform: scale(0.95);
}

.nav-tab.active .tab-icon-img {
  filter: none;
  opacity: 1;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.tab-icon-img {
  width: 34px;
  height: 34px;
  object-fit: contain;
  transition: all 0.2s ease;
}

.nav-tab:hover .tab-icon-img {
  transform: scale(1.1);
}

.tab-text {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tab-label {
  font-weight: 500;
  font-size: 13px;
  text-align: center;
}

.tab-count {
  font-size: 11px;
  opacity: 0.8;
}

/* 内容区域 */
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.tab-content {
  height: 100%;
}

/* 默认状态 */
.default-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.welcome-content {
  text-align: center;
  color: #64748b;
}

.welcome-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.welcome-content p {
  margin: 0;
  font-size: 14px;
}

/* 建议框 */
.suggestions-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.suggestion-item {
  padding: 6px 0;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
}

.suggestion-item:last-of-type {
  border-bottom: none;
}

.suggestion-item:hover {
  color: #667eea;
  background: #f8fafc;
  margin: 0 -12px;
  padding: 12px;
  border-radius: 8px;
}

.suggestion-link {
  padding: 12px 0;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  text-decoration: underline;
}

.suggestion-link:hover {
  color: #5a6fd8;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 智能中心内容 */
.center-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.center-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.center-item:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.center-icon {
  font-size: 24px;
}

.center-text h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.center-text p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

/* 消息内容样式 */
.messages-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.message-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.message-sender {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.message-time {
  font-size: 12px;
  color: #64748b;
}

.message-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  text-align: left;
}

/* 聊天消息容器 */
.chat-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 用户消息样式 */
.user-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.user-message:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4290 100%);
  border: none;
}

.user-content {
  align-items: flex-end;
  width: 100%;
}

.user-message .message-sender {
  color: white;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.user-message .message-text {
  color: white;
  text-align: right;
}

/* AI消息样式 */
.ai-message {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.ai-message:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

/* 打字机效果指示器 */
.typing-indicator {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 8px 12px;
  margin-top: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 消息文本样式增强 */
.message-text strong {
  font-weight: 600;
  color: #1e293b;
}

.ai-message .message-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 输入区域 - 重新设计布局 */
.input-area {
  padding: 20px 24px;
  background: #fafbfc;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 快捷功能按钮 - 移到输入框上方，与输入框紧邻 */
.quick-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.quick-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 5px 11px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  color: #64748b;
  min-width: 60px;
}

.quick-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #667eea;
}

/* 输入框和操作按钮容器 - 添加细边框 */
.input-container {
  border: 1px solid #8b5cf6;
  border-radius: 12px;
  background: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease;
}

.chat-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background: #fafbfc;
  resize: none;
  font-family: inherit;
  line-height: 1.5;
}

.chat-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.action-btn-small {
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn-small:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #667eea;
}

.send-btn {
  padding: 8px 17px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.send-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
}

/* 模型选择器样式 */
.model-selector {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.model-selector:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-arrow {
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.model-dropdown {
  position: absolute;
  top: 70px;
  left: 24px;
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.15),
    0 6px 24px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  animation: dropdownFadeIn 0.25s ease;
  overflow: hidden;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.model-list {
  padding: 8px;
}

.model-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  margin-bottom: 4px;
}

.model-item:hover {
  background: #f8fafc;
}

.model-item.selected {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%);
  border-left: 3px solid #667eea;
  padding-left: 9px;
}

.model-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  background: #f1f5f9;
}

.model-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.model-icon-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.model-info {
  flex: 1;
  min-width: 0;
}

.model-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.model-desc {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.model-check {
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-ball {
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 56px;
    height: 56px;
  }
  
  .floating-ball:hover {
    transform: translateY(-50%) scale(1.05);
  }
  
  .ball-main {
    width: 48px;
    height: 48px;
  }
  
  .ball-icon {
    width: 40px;
    height: 40px;
  }
  
  .ai-icon {
    width: 24px;
    height: 24px;
  }
  
  .tooltip {
    display: none;
  }
  
  .chat-panel {
    right: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
  
  .nav-container {
    padding: 12px 16px;
  }
  
  .nav-tabs {
    padding: 12px;
    gap: 8px;
  }
  
  .nav-tab {
    padding: 12px 8px;
    font-size: 13px;
    min-height: 70px;
  }
  
  .tab-icon-img {
    width: 20px;
    height: 20px;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .input-area {
    padding: 16px;
  }
  
  .quick-actions {
    gap: 6px;
  }  
  .quick-btn {
    padding: 6px 8px;
    font-size: 11px;
    min-width: 50px;
  }

  .model-dropdown {
    left: 16px;
    right: 16px;
    width: auto;
    max-width: calc(100vw - 32px);
  }

  .model-item {
    padding: 12px 16px;
  }

  .model-icon {
    width: 36px;
    height: 36px;
  }
}
</style>
