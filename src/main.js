import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './components/HomePage.vue'
import IntelligentService from './components/IntelligentService.vue'
import EvaluationCenter from './components/EvaluationCenter.vue'
import Life from './components/Life.vue'
import AcademicMonitor from './components/profile/AcademicMonitor.vue'
import LearningSquare from './components/LearningSquare.vue'
import TchAI from './views/TchAI.vue'
import AIThinking from './views/AIThinking.vue'
import AIAssistant from './views/AIAssistant.vue'
import AgentEditor from './views/AgentEditor.vue'
import GrowthTrajectory from './views/GrowthTrajectory.vue'

import StudentBehaviorData from './components/datacenter/StudentBehaviorData.vue'

// 个人主页与子页面
import Profile from './components/profile/Profile.vue'
import BasicInfo from './components/profile/BasicInfo.vue'
import Education from './components/profile/Education.vue'
import Work from './components/profile/Work.vue'
import GrowthExperience from './components/profile/GrowthExperience.vue'
import MyAssets from './components/profile/MyAssets.vue'
// 教学活动已移动到教学管理
import TeachingActivities from './components/teaching-resources/TeachingActivities.vue'
import Achievements from './components/profile/Achievements.vue'
import TeachingEvaluations from './components/profile/TeachingEvaluations.vue'
import ArchiveManagement from './components/profile/ArchiveManagement.vue'

//教学管理页面
import TeachingResources from './components/teaching-resources/TeachingResources.vue'
import Courseware from './components/teaching-resources/Courseware.vue'
import LessonPlans from './components/teaching-resources/LessonPlans.vue'
import ExamQuestions from './components/teaching-resources/ExamQuestions.vue'
import ExamPapers from './components/teaching-resources/ExamPapers.vue'
import StudentAcademicDetail from './components/teaching-resources/StudentAcademicDetail.vue'
import WorkloadQuantification from './components/teaching-resources/WorkloadQuantification.vue'
import TeachingResume from './components/teaching-resources/TeachingResume.vue'
import SemesterPlan from './components/teaching-resources/SemesterPlan.vue'
import TeacherEthics from './components/teaching-resources/TeacherEthics.vue'
import StudentGrades from './components/teaching-resources/StudentGrades.vue'
import ClassroomData from './components/teaching-resources/ClassroomData.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const routes = [
  { path: '/', redirect: '/Home' },
  { path: '/Home', component: Home },
  { path: '/ai-thinking', component: AIThinking, meta: { hideFooter: true } },

  { path: '/academic-monitor', redirect: '/teaching-resources/student-academic' },
  { path: '/student-academic/:id', component: StudentAcademicDetail },
  { path: '/student-behavior', component: StudentBehaviorData },
  { path: '/life', component: Life },
  { path: '/ai', component: EvaluationCenter },
  { path: '/growth-trajectory', component: GrowthTrajectory },
  { path: '/ai-thinking', component: AIThinking, meta: { hideFooter: true } },
  { 
    path: '/tch-ai', 
    component: TchAI, 
    meta: { hideFooter: true },
    children: [
      { path: 'ai-thinking', component: AIThinking, meta: { hideFooter: true } }
    ]
  },
  { path: '/learning-square', component: LearningSquare, meta: { hideFooter: true } },
  { path: '/ai-assistant', component: AIAssistant, meta: { hideFooter: true } },
  { path: '/agent-editor', component: AgentEditor, meta: { hideFooter: true } },
  {
    path: '/teaching-resources',
    component: TeachingResources,
    children: [
      { path: '', redirect: '/teaching-resources/workload' },
      { path: 'workload', component: WorkloadQuantification },
      { path: 'resume', component: TeachingResume },
      { path: 'semester-plan', component: SemesterPlan },
      { path: 'teacher-ethics', component: TeacherEthics },
      { path: 'student-grades', component: StudentGrades },
      { path: 'classroom-data', component: ClassroomData },
      { path: 'courseware', component: Courseware },
      { path: 'lesson-plans', component: LessonPlans },
      { path: 'exam-questions', component: ExamQuestions },
      { path: 'exam-papers', component: ExamPapers },
      { path: 'student-academic', component: AcademicMonitor },
      { path: 'teaching-activities', component: TeachingActivities }
    ]
  },
  {
    path: '/profile',
    component: Profile,
    children: [
      { path: '', redirect: '/profile/basic' },
      { path: 'basic', component: BasicInfo },
      { path: 'education', component: Education },
      { path: 'work', component: Work },
      { path: 'growth-experience', component: GrowthExperience },
      { path: 'my-assets', component: MyAssets },
      { path: 'achievements', component: Achievements },
      { path: 'teaching-evaluations', component: TeachingEvaluations },
      { path: 'archive-management', component: ArchiveManagement },
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.mount('#app')
