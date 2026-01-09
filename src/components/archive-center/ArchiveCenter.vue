<template>
  <div class="archive-center-page">
    <!-- 当前档案进度显示区 -->
    <div class="current-progress-section">
      <div class="progress-info">
        <h2 class="progress-title">进行中的档案</h2>
        <p class="progress-subtitle">您正在设计和撰写2025年下半年的优秀教师评选报告</p>
        <!-- <p class="progress-task-summary">1个档案管理任务 · 1个报告生成任务 · 3个数据统计任务</p> -->
      </div>
      <div class="progress-card-wrapper">
        <div class="progress-card">
          <p class="progress-percentage">已完成 85%</p>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: 85%"></div>
          </div>
          <button class="refresh-button" @click="continueArchive">
            <span class="refresh-icon">📝</span>
            <span>去完成</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 档案报告内容 -->
    <div class="archive-content">
      <ArchiveReport />
    </div>

    <!-- 报告创建模态框（用于继续编辑进行中的档案） -->
    <ReportCreationModal 
      v-if="showContinueModal" 
      :initialData="continueArchiveData"
      @close="closeContinueModal" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ArchiveReport from '@/components/archive-center/ArchiveReport.vue'
import ReportCreationModal from '@/components/archive-center/report-components/ReportCreationModal.vue'

// 控制继续编辑模态框
const showContinueModal = ref(false)

// 预填充的档案数据（模拟已完成85%的进度）
const continueArchiveData = ref({
  name: '2025年下半年优秀教师评选档案',
  reportType: '成长档案',
  modules: [
    {
      id: 1,
      name: '个人基本资料',
      type: 'personal-info',
      summary: '张婉婷，女，1985年生，副教授，硕士生导师。2010年毕业于清华大学计算机科学与技术专业，获博士学位。现任计算机学院软件工程系副主任，主要从事人工智能、软件工程等方向的教学与科研工作。\n\n主要学术成果：\n• 主持国家自然科学基金项目2项，省部级项目3项\n• 发表SCI/EI论文20余篇，其中CCF A类期刊5篇\n• 获省级教学成果奖二等奖1项\n• 指导学生获全国软件设计大赛一等奖2项',
      chartType: 'none',
      isCustom: false
    },
    {
      id: 2,
      name: '教学工作成果',
      type: 'teaching',
      summary: '本学期承担《数据结构与算法》《软件工程》《人工智能导论》三门核心课程的教学工作，总计周课时16节，覆盖6个班级240名学生。\n\n教学特色与创新：\n1. 采用"项目驱动+翻转课堂"混合教学模式，学生动手能力显著提升\n2. 建立课程学习平台，上传教学视频62个，累计时长800分钟\n3. 开发智能编程评测系统，实现作业自动批改，效率提升60%\n\n教学成效：\n• 学生满意度评分：4.6/5.0（全院前5%）\n• 期末考试优秀率：78%，较上学期提升12%\n• 课程通过率：96%',
      chartType: 'bar',
      chartData: [
        { name: '数据结构', value: 92 },
        { name: '软件工程', value: 88 },
        { name: 'AI导论', value: 95 },
        { name: '实验课程', value: 90 }
      ],
      isCustom: false
    },
    {
      id: 3,
      name: '科研与学术成果',
      type: 'research',
      summary: '本年度科研工作取得重要进展，在人工智能与软件工程交叉领域持续深耕。\n\n科研项目：\n• 主持国家自然科学基金面上项目"基于深度学习的代码智能生成方法研究"（在研）\n• 参与科技部重点研发计划子课题1项\n\n学术论文：\n• 发表CCF A类期刊论文2篇（IEEE TSE, ACM TOSEM）\n• 发表CCF B类会议论文3篇\n• 指导研究生发表论文4篇\n\n知识产权：\n• 获批发明专利2项，申请中3项\n• 软件著作权登记4项',
      chartType: 'pie',
      chartData: [
        { name: '期刊论文', value: 5 },
        { name: '会议论文', value: 3 },
        { name: '发明专利', value: 2 },
        { name: '软著', value: 4 }
      ],
      isCustom: false
    },
    {
      id: 4,
      name: '学生指导与培养',
      type: 'mentoring',
      summary: '重视学生综合素质培养，在学业指导、竞赛辅导、就业帮扶等方面投入大量精力。\n\n研究生培养：\n• 在读硕士研究生8人，博士研究生2人\n• 本年度毕业硕士3人，其中2人就职于华为、腾讯\n• 1名研究生获国家奖学金\n\n本科生指导：\n• 指导毕业设计15人，其中3人获校级优秀毕业论文\n• 指导大创项目2项，均获省级立项\n\n竞赛指导：\n• 指导学生获全国软件设计大赛一等奖1项\n• 指导学生获"互联网+"创新创业大赛省级银奖2项',
      chartType: 'none',
      isCustom: false
    },
    {
      id: 5,
      name: '社会服务与影响力',
      type: 'service',
      summary: '（待补充完善）',
      chartType: 'none',
      isCustom: false
    }
  ]
})

// 继续编辑档案
const continueArchive = () => {
  showContinueModal.value = true
}

// 关闭模态框
const closeContinueModal = () => {
  showContinueModal.value = false
}
</script>


<style scoped>
.archive-center-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
}

/* 当前档案进度显示区 */
.current-progress-section {
  background-color: #1976d2;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 25px 25px;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
  margin: auto;
  max-width: 1400px;
}

.progress-info {
  flex: 1;
  z-index: 1;
  text-align: left;
}

.progress-title {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.progress-subtitle {
  font-size: 16px;
  margin: 0 0 8px 0;
  opacity: 0.9;
}

.progress-task-summary {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

.progress-card-wrapper {
  flex-shrink: 0;
  margin-left: 40px;
  z-index: 1;
}

.progress-card {
  background: #ffffff45;
  border-radius: 16px;
  padding: 12px 24px 12px 24px;
  width: 260px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  text-align: center;
  color: #1f2937;
  position: relative;
}

.progress-card-icon-container {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.progress-card-icon {
  width: 100%;
  height: 100%;
  background-color: #d32f2f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.document-icon {
  width: 28px;
  height: 36px;
  background-color: #64b5f6;
  border-radius: 4px;
  position: relative;
}

.document-icon-lines {
  position: absolute;
  top: 8px;
  left: 5px;
  right: 5px;
  height: 2px;
  background-color: white;
  box-shadow: 0 5px 0 0 white, 0 10px 0 0 white, 0 15px 0 0 white;
}

.task-badge {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  color: #333;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  border: 1px solid #ddd;
}

.progress-percentage {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px 0;
}

.progress-bar-container {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #26b2fd, #6f74fb);
  border-radius: 3px;
  transition: width 0.5s ease-in-out;
}

.refresh-button {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.refresh-button:hover {
  background-color: #e3f2fd;
}

.refresh-icon {
  font-size: 16px;
  transition: transform 0.5s ease;
}

.refresh-button:hover .refresh-icon {
  transform: rotate(180deg);
}

.archive-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .archive-center-page {
    padding: 16px;
  }
  
  .current-progress-section {
    flex-direction: column;
    text-align: center;
    padding: 32px 20px;
  }
  
  .progress-card-wrapper {
    margin-left: 0;
    margin-top: 20px;
  }
  
  .progress-title {
    font-size: 28px;
  }
  
  .progress-subtitle {
    font-size: 14px;
  }
  
  .progress-task-summary {
    font-size: 12px;
  }
}
</style>
