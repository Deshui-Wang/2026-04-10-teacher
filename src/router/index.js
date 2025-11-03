import { createRouter, createWebHashHistory } from 'vue-router'
import { ref } from 'vue'

// 导入所有页面组件
import Home from '../components/home/HomePage.vue'
import LearningSquare from '../components/collaboration-space/LearningSquare.vue'
import TchAI from '../components/AI-chaozhiren/TchAI.vue'
import AIThinking from '../components/AI-chaozhiren/AIThinking.vue'
import Agent from '../components/AI-chaozhiren/Agent.vue'
import AgentEditor from '../components/AI-chaozhiren/AgentEditor.vue'
import ReportPreview from '../components/archive-center/ReportPreview.vue'
import EvaluationCenter from '../components/growth-center/EvaluationCenter.vue'
import Login from '../components/login/Login.vue'
import LoginDemo from '../components/login/LoginDemo.vue'
import DataCenter from '../components/data-center/data-types/DataCenter.vue'
import ArchiveCenter from '../components/archive-center/ArchiveCenter.vue'

// 个人主页与子页面
import Profile from '../components/profile/Profile.vue'
import BasicInfo from '../components/profile/BasicInfo.vue'
import Education from '../components/profile/Education.vue'
import Work from '../components/profile/Work.vue'
import GrowthExperience from '../components/profile/GrowthExperience.vue'

// 教学管理页面 - 修复导入路径
import WorkloadQuantification from '../components/data-center/teaching-data/WorkloadQuantification.vue'
import TeachingResume from '../components/data-center/teaching-data/TeachingResume.vue'
import TeacherEthics from '../components/growth-center/TeacherEthics.vue'
import Courseware from '../components/data-center/resource-data/Courseware.vue'
import Video from '../components/data-center/resource-data/Video.vue'
import Dubbing from '../components/data-center/resource-data/Dubbing.vue'
import KnowledgeGraph from '../components/data-center/resource-data/KnowledgeGraph.vue'
import AbilityGraph from '../components/data-center/resource-data/AbilityGraph.vue'
import DigitalHuman from '../components/data-center/resource-data/DigitalHuman.vue'
import AgentList from '../components/data-center/resource-data/Agent.vue'
import Attendance from '../components/data-center/teaching-data/Attendance.vue'
import HomeworkManagement from '../components/data-center/teaching-data/HomeworkManagement.vue'

// 全局状态管理
const isLoggedIn = ref(false)
const currentUser = ref(null)

// 认证检查函数
const checkAuth = () => {
  // 检查多种认证状态
  const token = localStorage.getItem('token')
  const isLoggedInFlag = localStorage.getItem('isLoggedIn')
  const user = localStorage.getItem('user')
  
  if (token && isLoggedInFlag === 'true' && user) {
    isLoggedIn.value = true
    currentUser.value = JSON.parse(user)
    console.log('用户已登录:', currentUser.value)
  } else {
    isLoggedIn.value = false
    currentUser.value = null
    console.log('用户未登录')
  }
}

// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/login-demo',
    name: 'LoginDemo',
    component: LoginDemo
  },
  {
    path: '/learning-square',
    name: 'LearningSquare',
    component: LearningSquare
  },
  {
    path: '/tch-ai',
    name: 'TchAI',
    component: TchAI
  },
  {
    path: '/ai-thinking',
    name: 'AIThinking',
    component: AIThinking
  },
  {
    path: '/agent',
    name: 'Agent',
    component: Agent
  },
  {
    path: '/agent-editor',
    name: 'AgentEditor',
    component: AgentEditor
  },
  {
    path: '/report-preview',
    name: 'ReportPreview',
    component: ReportPreview
  },
  {
    path: '/EvaluationCenter',
    name: 'EvaluationCenter',
    component: EvaluationCenter
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    redirect: '/profile/basic-info',
    children: [
      {
        path: 'basic-info',
        name: 'BasicInfo',
        component: BasicInfo
      },
      {
        path: 'education',
        name: 'Education',
        component: Education
      },
      {
        path: 'work',
        name: 'Work',
        component: Work
      },
      {
        path: 'growth-experience',
        name: 'GrowthExperience',
        component: GrowthExperience
      },
      {
        path: 'my-archive',
        name: 'ArchiveCenter',
        component: ArchiveCenter
      }
    ]
  },
  {
    path: '/workload-quantification',
    name: 'WorkloadQuantification',
    component: WorkloadQuantification
  },
  {
    path: '/teaching-resume',
    name: 'TeachingResume',
    component: TeachingResume
  },
  {
    path: '/teacher-ethics',
    name: 'TeacherEthics',
    component: TeacherEthics
  },
  {
    path: '/courseware',
    name: 'Courseware',
    component: Courseware
  },
  {
    path: '/video',
    name: 'Video',
    component: Video
  },
  {
    path: '/dubbing',
    name: 'Dubbing',
    component: Dubbing
  },
  {
    path: '/knowledge-graph',
    name: 'KnowledgeGraph',
    component: KnowledgeGraph
  },
  {
    path: '/ability-graph',
    name: 'AbilityGraph',
    component: AbilityGraph
  },
  {
    path: '/digital-human',
    name: 'DigitalHuman',
    component: DigitalHuman
  },
  {
    path: '/agent-list',
    name: 'AgentList',
    component: AgentList
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: Attendance
  },
  {
    path: '/homework-management',
    name: 'HomeworkManagement',
    component: HomeworkManagement
  },
  {
    path: '/data-center',
    name: 'DataCenter',
    component: DataCenter
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  checkAuth()
  
  console.log('路由守卫检查:', {
    to: to.name,
    isLoggedIn: isLoggedIn.value,
    currentUser: currentUser.value
  })
  
  // 如果用户未登录且访问的不是登录页面，重定向到登录页
  if (!isLoggedIn.value && to.name !== 'Login' && to.name !== 'LoginDemo') {
    console.log('重定向到登录页')
    next({ name: 'Login' })
  } else {
    console.log('允许访问页面:', to.name)
    next()
  }
})

export default router
export { isLoggedIn, currentUser, checkAuth }
