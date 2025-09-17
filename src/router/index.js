import { createRouter, createWebHashHistory } from 'vue-router'
import { ref } from 'vue'

// 导入所有页面组件
import Home from '../components/HomePage.vue'
import AcademicMonitor from '../components/profile/AcademicMonitor.vue'
import LearningSquare from '../components/LearningSquare.vue'
import TchAI from '../views/TchAI.vue'
import AIThinking from '../views/AIThinking.vue'
import AIAssistant from '../views/AIAssistant.vue'
import AgentEditor from '../views/AgentEditor.vue'
import ReportPreview from '../views/ReportPreview.vue'
import GrowthTrajectory from '../views/GrowthTrajectory.vue'
import EvaluationCenter from '../components/EvaluationCenter.vue'
import Login from '../views/Login.vue'
import LoginDemo from '../views/LoginDemo.vue'

// 发展轨迹布局和子页面
import GrowthTrajectoryLayout from '../components/growth-trajectory/GrowthTrajectoryLayout.vue'
import ProfessionalAbility from '../views/growth-trajectory/ProfessionalAbility.vue'
import TeachingAchievements from '../views/growth-trajectory/TeachingAchievements.vue'
import IndustryPractice from '../views/growth-trajectory/IndustryPractice.vue'
import AbilityCertification from '../views/growth-trajectory/AbilityCertification.vue'
import ResearchInnovation from '../views/growth-trajectory/ResearchInnovation.vue'
import InternationalAbility from '../views/growth-trajectory/InternationalAbility.vue'

// 个人主页与子页面
import Profile from '../components/profile/Profile.vue'
import BasicInfo from '../components/profile/BasicInfo.vue'
import Education from '../components/profile/Education.vue'
import Work from '../components/profile/Work.vue'
import GrowthExperience from '../components/profile/GrowthExperience.vue'
import MyAssets from '../components/profile/MyAssets.vue'
import TeachingActivities from '../components/teaching-resources/TeachingActivities.vue'
import Achievements from '../components/profile/Achievements.vue'
import TeachingEvaluations from '../components/profile/TeachingEvaluations.vue'
import DigitalLiteracy from '../components/profile/DigitalLiteracy.vue'
import ArchiveManagement from '../components/profile/ArchiveManagement.vue'

// 教学管理页面
import TeachingResources from '../components/teaching-resources/TeachingResources.vue'
import Courseware from '../components/teaching-resources/Courseware.vue'
import StudentAcademicDetail from '../components/teaching-resources/StudentAcademicDetail.vue'
import WorkloadQuantification from '../components/teaching-resources/WorkloadQuantification.vue'
import TeachingResume from '../components/teaching-resources/TeachingResume.vue'
import SemesterPlan from '../components/teaching-resources/SemesterPlan.vue'
import TeacherEthics from "../components/teaching-resources/TeacherEthics.vue"
import StudentGrades from "../components/teaching-resources/StudentGrades.vue"
import ClassroomData from "../components/teaching-resources/ClassroomData.vue"
import StudentAssignments from "../components/teaching-resources/StudentAssignments.vue"

// 创建全局状态管理
const isLoggedIn = ref(false)
const currentUser = ref('')

// 检查登录状态
const checkAuth = () => {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const username = localStorage.getItem('username') || ''
  isLoggedIn.value = loggedIn
  currentUser.value = username
  return loggedIn
}

// 初始化检查
checkAuth()

const routes = [
  { 
    path: '/login', 
    component: Login, 
    meta: { hideFooter: true, hideNavbar: true },
    beforeEnter: (to, from, next) => {
      // 如果已经登录，直接跳转到首页
      if (checkAuth()) {
        next('/Home')
      } else {
        next()
      }
    }
  },
  { path: '/login-demo', component: LoginDemo, meta: { hideFooter: true, hideNavbar: true } },
  { 
    path: '/', 
    redirect: '/login' 
  },
  { 
    path: '/Home', 
    component: Home,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      if (checkAuth()) {
        next()
      } else {
        next('/login')
      }
    }
  },
  { path: '/ai-thinking', component: AIThinking, meta: { hideFooter: true } },

  { path: '/academic-monitor', redirect: '/teaching-resources/student-academic' },
  { path: '/student-academic/:id', component: StudentAcademicDetail },
  { 
    path: '/growth-trajectory', 
    component: GrowthTrajectoryLayout,
    children: [
      { path: '', redirect: '/growth-trajectory/route' },
      { path: 'route', component: GrowthTrajectory },
      { path: 'professional-ability', component: ProfessionalAbility },
      { path: 'teaching-achievements', component: TeachingAchievements },
      { path: 'industry-practice', component: IndustryPractice },
      { path: 'ability-certification', component: AbilityCertification },
      { path: 'research-innovation', component: ResearchInnovation },
      { path: 'international-ability', component: InternationalAbility }
    ]
  },
  { path: '/ai-thinking', component: AIThinking, meta: { hideFooter: true } },
  { path: '/ai', redirect: '/EvaluationCenter' },
  { path: '/EvaluationCenter', component: EvaluationCenter, meta: { hideFooter: true } },
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
  { path: '/report-preview', component: ReportPreview, meta: { hideFooter: true } },
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
      { path: 'teaching-activities', component: TeachingActivities },
      { path: 'student-academic', component: AcademicMonitor },
      { path: 'student-assignments', component: StudentAssignments }
    ]
  },
  {
    path: '/profile',
    component: Profile,
    children: [
      { path: '', redirect: '/profile/basic' },
      { path: "basic", component: BasicInfo },
      { path: 'basic-info', component: BasicInfo },
      { path: 'education', component: Education },
      { path: 'work', component: Work },
      { path: 'growth-experience', component: GrowthExperience },
      { path: 'my-assets', component: MyAssets },
      { path: 'achievements', component: Achievements },
      { path: 'teaching-evaluations', component: TeachingEvaluations },
      { path: 'digital-literacy', component: DigitalLiteracy },
      { path: 'archive-management', component: ArchiveManagement }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要认证
  if (to.meta.requiresAuth && !checkAuth()) {
    next('/login')
    return
  }
  
  // 检查是否需要隐藏导航栏
  if (to.meta.hideNavbar) {
    // 登录页面隐藏导航栏
    next()
    return
  }
  
  next()
})

// 导出路由实例和认证相关函数
export default router
export { isLoggedIn, currentUser, checkAuth }
