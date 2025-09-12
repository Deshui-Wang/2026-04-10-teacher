// 定义可用的模块
const availableModules = [
  {
    id: 'assets',
    name: '资产',
    description: '个人资产状况、投资情况、财务状况等',
    icon: '💰',
    component: 'AssetsModule'
  },
  {
    id: 'achievements',
    name: '成果奖励',
    description: '获奖情况、学术成果、荣誉证书等',
    icon: '🏆',
    component: 'AchievementsModule'
  },
  {
    id: 'digital-literacy',
    name: '数字素养',
    description: '数字化技能、技术能力、信息化水平等',
    icon: '💻',
    component: 'DigitalLiteracyModule'
  },
  {
    id: 'workload-stats',
    name: '工作量统计',
    description: '教学工作量、科研工作量、服务工作量等',
    icon: '📊',
    component: 'WorkloadStatsModule'
  },
  {
    id: 'ethics',
    name: '师德师风',
    description: '师德表现、教学态度、学生评价等',
    icon: '🌟',
    component: 'EthicsModule'
  },
  {
    id: 'student-data',
    name: '学生数据',
    description: '学生信息、成绩统计、指导情况等',
    icon: '👥',
    component: 'StudentDataModule'
  },
  {
    id: 'courseware-research',
    name: '课件教案研发数据',
    description: '课件开发、教案设计、教学资源等',
    icon: '📚',
    component: 'CoursewareResearchModule'
  },
  {
    id: 'teaching-experience',
    name: '教学经验数据',
    description: '教学经验、教学方法、教学效果等',
    icon: '🎯',
    component: 'TeachingExperienceModule'
  }
]
