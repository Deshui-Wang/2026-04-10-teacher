<template>
  <div class="growth-engine">
    <div class="page-header">
      <h1>学生成长引擎</h1>
      <p>基于多维度数据，构建学生全方位画像，预测发展路径，提供个性化成长建议。</p>
    </div>

    <div class="profile-grid">
      <!-- 学业画像 -->
      <div class="profile-card">
        <h2 class="card-title">学业画像</h2>
        <div class="card-content">
          <div ref="academicChart" class="radar-chart"></div>
          <div class="academic-stats">
            <div class="stat-item"><span>GPA</span><strong>3.85</strong></div>
            <div class="stat-item"><span>专业排名</span><strong>5/120</strong></div>
            <div class="stat-item"><span>核心课程平均分</span><strong>92</strong></div>
          </div>
        </div>
      </div>

      <!-- 性格画像 -->
      <div class="profile-card">
        <h2 class="card-title">性格画像</h2>
        <div class="card-content">
          <div class="mbti-tag">INTJ</div>
          <p class="mbti-desc">独立、理性、善于规划的战略家</p>
          <div class="trait-tags">
            <span class="trait">#分析能力强</span>
            <span class="trait">#创新思维</span>
            <span class="trait">#目标导向</span>
            <span class="trait">#不畏挑战</span>
            <span class="trait">#逻辑性强</span>
          </div>
        </div>
      </div>

      <!-- 行为画像 -->
      <div class="profile-card">
        <h2 class="card-title">行为画像</h2>
        <div class="card-content">
          <ul class="behavior-list">
            <li><span class="behavior-label">作息规律:</span> <span>规律，平均入睡时间 23:30</span></li>
            <li><span class="behavior-label">校园活动:</span> <span>活跃，频繁参与技术类讲座与社团</span></li>
            <li><span class="behavior-label">图书馆常客:</span> <span>是，借阅TOP 5%，偏爱计算机与哲学</span></li>
            <li><span class="behavior-label">出勤率:</span> <span class="text-success">99.8%</span></li>
          </ul>
        </div>
      </div>

      <!-- 兴趣画像 -->
      <div class="profile-card">
        <h2 class="card-title">兴趣画像</h2>
        <div class="card-content">
          <div ref="interestChart" class="word-cloud-chart"></div>
        </div>
      </div>

      <!-- 经济画像 -->
      <div class="profile-card">
        <h2 class="card-title">经济画像</h2>
        <div class="card-content">
          <div class="economic-summary">
            <div class="summary-item">消费水平: <span class="text-primary">中等</span></div>
            <div class="summary-item">主要支出: <span class="text-primary">餐饮、书籍</span></div>
            <div class="summary-item">助学金: <span class="text-success">已获国家一等奖学金</span></div>
          </div>
        </div>
      </div>

      <!-- 发展路径推荐 -->
      <div class="profile-card large-card">
        <h2 class="card-title">发展路径推荐</h2>
        <div class="card-content">
          <ul class="timeline">
            <li class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h3>大三上学期</h3>
                <p><strong>课程建议:</strong> 深入学习《机器学习》、《计算机视觉》，挑战更高难度的算法课程。</p>
                <p><strong>实践建议:</strong> 参与“AI创新实验室”，启动一个小型个人项目，将理论付诸实践。</p>
                <p><strong>辅修建议:</strong> 建议辅修“应用心理学”，以增强产品设计中的用户同理心。</p>
                <p><strong>社团推荐:</strong> 加入“人工智能协会”或“开源社区”，与同好交流，参与项目实践。</p>
                <p><strong>心理成长:</strong> 注意平衡学业与个人兴趣，保持积极心态，可参与学校心理中心的正念工作坊。</p>
              </div>
            </li>
            <li class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h3>大三下学期</h3>
                <p><strong>实习建议:</strong> 寻找大型科技公司的算法或研发岗实习机会，积累行业经验。</p>
                <p><strong>竞赛建议:</strong> 组队参加ACM或“挑战杯”等高水平竞赛，提升解决复杂问题的能力。</p>
                <p><strong>第二学位推荐:</strong> 可考虑申请“数据科学”第二学位，构建T型知识体系，增强核心竞争力。</p>
                <p><strong>实践基地推荐:</strong> 推荐前往学校合作的“AI未来科技园”进行项目实践，接触前沿技术。</p>
              </div>
            </li>
             <li class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h3>大四</h3>
                <p><strong>深造建议:</strong> 准备国内外顶尖院校的研究生申请，重点提升科研背景和论文质量。</p>
                <p><strong>就业建议:</strong> 重点关注头部科技公司的“算法工程师”、“数据科学家”岗位，同步准备选调生考试，拓宽职业路径。</p>
                <p><strong>心理成长:</strong> 积极应对毕业季的求职/升学压力，主动与导师、辅导员沟通，保持健康生活节奏。</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 学生反馈跟踪 -->
      <div class="profile-card large-card">
        <h2 class="card-title">学生反馈跟踪</h2>
        <div class="card-content">
          <table class="feedback-table">
            <thead>
              <tr>
                <th>反馈日期</th>
                <th>反馈类型</th>
                <th>内容摘要</th>
                <th>状态</th>
                <th>处理人</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2023-10-15</td>
                <td>课程建议</td>
                <td>希望增加更多关于深度学习实践的课程...</td>
                <td><span class="status-tag completed">已采纳</span></td>
                <td>教务处</td>
              </tr>
              <tr>
                <td>2023-09-28</td>
                <td>生活服务</td>
                <td>建议延长图书馆夜间开放时间...</td>
                <td><span class="status-tag in-progress">处理中</span></td>
                <td>后勤部</td>
              </tr>
              <tr>
                <td>2023-09-10</td>
                <td>系统BUG</td>
                <td>选课系统在高峰期出现卡顿...</td>
                <td><span class="status-tag completed">已解决</span></td>
                <td>信息中心</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import 'echarts-wordcloud';

const academicChart = ref(null);
const interestChart = ref(null);

onMounted(() => {
  nextTick(() => {
    // 学业画像雷达图
    const academicChartInstance = echarts.init(academicChart.value);
    academicChartInstance.setOption({
      tooltip: { trigger: 'item' },
      radar: {
        indicator: [
          { name: '数理基础', max: 100 },
          { name: '编程能力', max: 100 },
          { name: '逻辑思维', max: 100 },
          { name: '创新实践', max: 100 },
          { name: '团队协作', max: 100 },
          { name: '沟通表达', max: 100 },
        ],
        shape: 'circle',
        splitNumber: 5,
        name: { textStyle: { color: '#666' } },
      },
      series: [{
        type: 'radar',
        data: [{
          value: [90, 95, 92, 88, 85, 80],
          name: '学业能力',
        }],
        areaStyle: {
          color: 'rgba(75, 156, 255, 0.4)',
        },
        itemStyle: { color: '#4b9cff' },
        lineStyle: { color: '#4b9cff' },
      }],
    });

    // 兴趣画像词云图
    const interestChartInstance = echarts.init(interestChart.value);
    interestChartInstance.setOption({
       tooltip: { show: true },
       series: [{
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 'center',
          width: '100%',
          height: '100%',
          sizeRange: [14, 40],
          rotationRange: [-45, 45],
          textStyle: {
             fontFamily: 'sans-serif',
             fontWeight: 'bold',
             color: () => `rgb(${[
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
             ].join(',')})`
          },
          emphasis: {
             focus: 'self',
             textStyle: {
                shadowBlur: 10,
                shadowColor: '#333'
             }
          },
          data: [
             { name: 'Python', value: 95 }, { name: '机器学习', value: 90 }, { name: '数据结构', value: 85 },
             { name: '算法', value: 80 }, { name: '摇滚乐', value: 75 }, { name: '科幻电影', value: 70 },
             { name: '黑客文化', value: 65 }, { name: '开源社区', value: 60 }, { name: '哲学思辨', value: 55 },
             { name: '篮球', value: 50 }, { name: '效率工具', value: 45 }, { name: '独立游戏', value: 40 },
          ]
       }]
    });
    
    window.addEventListener('resize', () => {
      academicChartInstance.resize();
      interestChartInstance.resize();
    });
  });
});
</script>

<style scoped>
.growth-engine {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 48px 48px 48px;
  background-color: #f7f8fa;
  min-height: 100vh;
}
.page-header {
  padding: 32px 2px;
}
.page-header h1 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #4b9cff;
}
.page-header p {
  font-size: 16px;
  color: #666;
}
.profile-grid {
  display: grid;

  gap: 24px;
}
.profile-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}
.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
.large-card {

}
.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}
.card-content {
  color: #333;
}
.radar-chart {
  width: 100%;
  height: 220px;
}
.academic-stats {
  margin-top: 16px;
  display: flex;
  justify-content: space-around;
}
.stat-item {
  text-align: center;
}
.stat-item span {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 4px;
}
.stat-item strong {
  font-size: 18px;
  color: #333;
}
.mbti-tag {
  background-color: #4b9cff;
  color: white;
  font-size: 24px;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 12px;
}
.mbti-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}
.trait-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.trait {
  background-color: #f0f5ff;
  color: #4b9cff;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
}
.behavior-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.behavior-list li {
  margin-bottom: 12px;
  font-size: 14px;
}
.behavior-label {
  font-weight: 500;
  color: #555;
  margin-right: 8px;
}
.word-cloud-chart {
  width: 100%;
  height: 250px;
}
.text-success { color: #52c41a; }
.text-primary { color: #4b9cff; }
.economic-summary {
  font-size: 15px;
  line-height: 2;
}
.timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e0e0e0;
}
.timeline-item {
  position: relative;
  padding-left: 30px;
  margin-bottom: 24px;
}
.timeline-marker {
  position: absolute;
  left: 0;
  top: 5px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #4b9cff;
  border: 2px solid #fff;
}
.timeline-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
}
.timeline-content p {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px;
  line-height: 1.6;
}
.feedback-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.feedback-table th, .feedback-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.feedback-table th {
  background-color: #f7f8fa;
  font-weight: 500;
}
.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.status-tag.completed { background-color: #e6fff0; color: #52c41a; }
.status-tag.in-progress { background-color: #e6f4ff; color: #1677ff; }

@media (max-width: 1200px) {
  .large-card {
    grid-column: span 1;
  }
}
</style>
