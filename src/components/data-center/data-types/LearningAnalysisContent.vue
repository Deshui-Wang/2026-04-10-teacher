<template>
  <div class="learning-analysis-wrapper">
    <!-- 筛选工具栏 (从 LearningAnalysis 迁移并优化) -->
    <div class="toolbar animate__animated animate__fadeInDown">
      <div class="cascade-selector">
        <div class="filter-group">
          <label>学院：</label>
          <el-select v-model="selectedCollege" placeholder="全部学院" size="small" @change="onCollegeChange">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="college in colleges" :key="college" :label="college" :value="college"></el-option>
          </el-select>
        </div>

        <div class="filter-group">
          <label>专业：</label>
          <el-select v-model="selectedMajor" placeholder="全部专业" size="small" :disabled="!selectedCollege" @change="onMajorChange">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="major in availableMajors" :key="major" :label="major" :value="major"></el-option>
          </el-select>
        </div>

        <div class="filter-group">
          <label>班级：</label>
          <el-select v-model="selectedClass" placeholder="全部班级" size="small" :disabled="!selectedMajor">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="classItem in availableClasses" :key="classItem" :label="classItem" :value="classItem"></el-option>
          </el-select>
        </div>

        <div class="filter-group search-group">
          <el-input 
            v-model="searchName" 
            placeholder="姓名搜索..." 
            size="small"
            class="search-input"
            clearable
          >
            <template #append>
              <el-button @click="onSearch"><i class="el-icon-search"></i></el-button>
            </template>
          </el-input>
        </div>

        <div class="filter-group">
          <el-button type="success" size="small" icon="el-icon-document" @click="generateReport">生成报告</el-button>
        </div>
      </div>
    </div>

    <!-- 内容展示区域 -->
    <div class="analysis-content-area">
      <GroupPortrait v-if="activeSubTab === 'learning-group'" />
      <StudentPortrait v-if="activeSubTab === 'learning-student'" />
      <Report v-if="activeSubTab === 'learning-report'" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import GroupPortrait from '@/components/learning-analysis/GroupPortrait.vue'
import StudentPortrait from '@/components/learning-analysis/StudentPortrait.vue'
import Report from '@/components/learning-analysis/Report.vue'

const props = defineProps({
  activeSubTab: {
    type: String,
    default: 'learning-group'
  }
})

const emit = defineEmits(['sub-tab-change'])

// 模拟学生数据
const students = ref([
  { id: '1001', name: '张三', college: '计算机学院', major: '计算机科学与技术', class: '计科2021-1' },
  { id: '1002', name: '李四', college: '计算机学院', major: '计算机科学与技术', class: '计科2021-2' },
  { id: '1003', name: '王五', college: '计算机学院', major: '软件工程', class: '软工2021-1' },
  { id: '1004', name: '赵六', college: '计算机学院', major: '软件工程', class: '软工2021-2' },
  { id: '1005', name: '钱七', college: '电子工程学院', major: '电子信息工程', class: '电信2021-1' },
  { id: '1006', name: '孙八', college: '电子工程学院', major: '通信工程', class: '通信2021-1' }
])

const selectedCollege = ref('')
const selectedMajor = ref('')
const selectedClass = ref('')
const searchName = ref('')

const colleges = computed(() => Array.from(new Set(students.value.map(s => s.college))).sort())
const availableMajors = computed(() => {
  if (!selectedCollege.value) return []
  return Array.from(new Set(students.value.filter(s => s.college === selectedCollege.value).map(s => s.major))).sort()
})
const availableClasses = computed(() => {
  if (!selectedMajor.value) return []
  return Array.from(new Set(students.value.filter(s => s.major === selectedMajor.value).map(s => s.class))).sort()
})

const onCollegeChange = () => { selectedMajor.value = ''; selectedClass.value = '' }
const onMajorChange = () => { selectedClass.value = '' }

const onSearch = () => {
  if (searchName.value) {
    emit('sub-tab-change', 'learning-student')
  }
}

const generateReport = () => {
  emit('sub-tab-change', 'learning-report')
}
</script>

<style scoped>
.learning-analysis-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toolbar {
  background: white;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
}

.cascade-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 13px;
  color: #64748b;
  white-space: nowrap;
}

.search-group {
  flex: 1;
  max-width: 260px;
}

.analysis-content-area {
  min-height: 600px;
}

:deep(.el-input-group__append) {
  padding: 0 12px;
}
</style>
