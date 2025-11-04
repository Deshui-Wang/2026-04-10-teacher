<template>
  <div class="learning-analysis">
    <div class="toolbar">
      <div class="tabs">
      </div>

      <div class="cascade-selector">
        <div class="filter-group">
          <label>学院：</label>
          <select v-model="selectedCollege" @change="onCollegeChange">
            <option value="">全部</option>
            <option v-for="college in colleges" :key="college" :value="college">{{ college }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>专业：</label>
          <select v-model="selectedMajor" @change="onMajorChange" :disabled="!selectedCollege">
            <option value="">全部</option>
            <option v-for="major in availableMajors" :key="major" :value="major">{{ major }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>班级：</label>
          <select v-model="selectedClass" @change="onClassChange" :disabled="!selectedMajor">
            <option value="">全部</option>
            <option v-for="classItem in availableClasses" :key="classItem" :value="classItem">{{ classItem }}</option>
          </select>
        </div>

        <div class="filter-group search-group">
          <label>姓名：</label>
          <div class="search-wrapper">
            <input 
              type="text" 
              v-model="searchName" 
              placeholder="输入姓名搜索..."
              class="search-input"
              @input="onSearchInput"
              @keyup.enter="onSearch"
            />
            <button class="search-btn" @click="onSearch">搜索</button>
          </div>
        </div>

        <div class="filter-group">
          <button class="generate-report-btn" @click="generateReport">生成报告</button>
        </div>

      </div>
    </div>

    <router-view />
  </div>
  
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 学生数据（包含学院、专业、班级信息）
const students = ref([
  { id: '1001', name: '张三', college: '计算机学院', major: '计算机科学与技术', class: '计科2021-1' },
  { id: '1002', name: '李四', college: '计算机学院', major: '计算机科学与技术', class: '计科2021-2' },
  { id: '1003', name: '王五', college: '计算机学院', major: '软件工程', class: '软工2021-1' },
  { id: '1004', name: '赵六', college: '计算机学院', major: '软件工程', class: '软工2021-2' },
  { id: '1005', name: '钱七', college: '电子工程学院', major: '电子信息工程', class: '电信2021-1' },
  { id: '1006', name: '孙八', college: '电子工程学院', major: '通信工程', class: '通信2021-1' },
  { id: '1007', name: '周九', college: '数学学院', major: '数学与应用数学', class: '数学2021-1' }
])

// 筛选条件
const selectedCollege = ref('')
const selectedMajor = ref('')
const selectedClass = ref('')
const searchName = ref('')
const selectedId = ref('')

// 计算所有学院列表
const colleges = computed(() => {
  const collegeSet = new Set(students.value.map(s => s.college))
  return Array.from(collegeSet).sort()
})

// 计算可用的专业列表（基于选中的学院）
const availableMajors = computed(() => {
  if (!selectedCollege.value) return []
  const majorSet = new Set(
    students.value
      .filter(s => s.college === selectedCollege.value)
      .map(s => s.major)
  )
  return Array.from(majorSet).sort()
})

// 计算可用的班级列表（基于选中的学院和专业）
const availableClasses = computed(() => {
  if (!selectedMajor.value) return []
  const classSet = new Set(
    students.value
      .filter(s => s.college === selectedCollege.value && s.major === selectedMajor.value)
      .map(s => s.class)
  )
  return Array.from(classSet).sort()
})

// 过滤后的学生列表（基于所有筛选条件）
const filteredStudents = computed(() => {
  let result = students.value

  // 按学院筛选
  if (selectedCollege.value) {
    result = result.filter(s => s.college === selectedCollege.value)
  }

  // 按专业筛选
  if (selectedMajor.value) {
    result = result.filter(s => s.major === selectedMajor.value)
  }

  // 按班级筛选
  if (selectedClass.value) {
    result = result.filter(s => s.class === selectedClass.value)
  }

  // 按姓名搜索
  if (searchName.value.trim()) {
    const keyword = searchName.value.trim().toLowerCase()
    result = result.filter(s => s.name.toLowerCase().includes(keyword))
  }

  return result
})

// 级联筛选事件处理
const onCollegeChange = () => {
  // 清空下级选择
  selectedMajor.value = ''
  selectedClass.value = ''
}

const onMajorChange = () => {
  // 清空下级选择
  selectedClass.value = ''
}

const onClassChange = () => {
  // 可以在这里添加逻辑
}

const onSearchInput = () => {
  // 搜索输入时的处理逻辑已在 computed 中实现
}

const onSearch = () => {
  // 获取输入的学生姓名
  const name = searchName.value.trim()
  
  if (!name) {
    // 如果输入为空，可以选择提示用户或不做任何操作
    return
  }
  
  // 生成一个基于姓名的ID（使用简单的哈希函数）
  const generateIdFromName = (name) => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    // 返回正数的ID，格式为字符串
    return String(Math.abs(hash))
  }
  
  // 直接使用输入的姓名，生成ID并跳转
  const studentId = generateIdFromName(name)
  router.push({
    name: 'LearningStudentPortrait',
    params: { id: studentId },
    query: { name: name }
  })
}

// 跳转到学生画像页面
const goStudent = () => {
  if (!selectedId.value) return
  const current = students.value.find(s => s.id === selectedId.value)
  if (current) {
    router.push({ 
      name: 'LearningStudentPortrait', 
      params: { id: selectedId.value }, 
      query: { name: current.name } 
    })
  }
}

// 生成报告
const generateReport = () => {
  // 传递筛选条件到报告页面
  router.push({
    name: 'LearningReport',
    query: {
      college: selectedCollege.value,
      major: selectedMajor.value,
      class: selectedClass.value,
      searchName: searchName.value
    }
  })
}

const isActive = (prefix) => route.path.startsWith(prefix)
</script>

<style scoped>
.learning-analysis {
    padding: 24px 38px;
    min-height: 90vh;
    background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

h1 {
    margin: 0 0 16px;
    font-size: 24px;
    color: #0f172a;
    letter-spacing: 0.2px;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(180deg, #ffffff, #fafcff);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 12px;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
}

.tabs {
    display: flex;
    gap: 8px;
}

.tab {
    position: relative;
    padding: 8px 14px;
    text-decoration: none;
    font-size: 14px;
    background: #ffffff;
    transition: all .2s ease;
}

.tab:hover {
    box-shadow: 0 1px 2px rgba(16, 24, 40, .08);
    transform: translateY(-1px);
}

.tab.active {
    color: #7c3aed;
}

.cascade-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    flex: 1;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 6px;
}

.filter-group label {
    font-size: 14px;
    color: #475569;
    white-space: nowrap;
    font-weight: 500;
}

.filter-group select {
    appearance: none;
    padding: 6px 28px 6px 10px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>') no-repeat right 8px center/16px;
    background-color: #ffffff;
    color: #0f172a;
    font-size: 14px;
    min-width: 120px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.filter-group select:hover:not(:disabled) {
    border-color: #cbd5e1;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-group select:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.filter-group select:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>');
}

.search-group {
    flex: 1;
    min-width: 200px;
}

.search-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.search-input {
    flex: 1;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background-color: #ffffff;
    color: #0f172a;
    font-size: 14px;
    transition: all 0.2s ease;
    max-width: 150px;
}

.search-input:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.search-input::placeholder {
    color: #94a3b8;
}

.search-btn {
    padding: 6px 20px;
    border-radius: 8px;
    border: 1px solid #7c3aed00;
    background: linear-gradient(135deg, #26b2fd, #6f74fb);
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.search-btn:hover {
    background-color: #6d28d9;
    box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2);
}

.search-btn:active {
    background-color: #5b21b6;
    border-color: #5b21b6;
    transform: translateY(1px);
}

.generate-report-btn {
    padding: 6px 20px;
    border-radius: 8px;
    border: 1px solid #10b981;
    background-color: #ccf0e4;
    color: #10b981;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.generate-report-btn:hover {
    background-color: #059669;
    border-color: #059669;
    color: #ffffff;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.generate-report-btn:active {
    background-color: #047857;
    border-color: #047857;
    transform: translateY(1px);
}

@media (max-width: 720px) {
    .toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .tabs {
        justify-content: space-between;
    }

    .cascade-selector {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .filter-group {
        width: 100%;
    }

    .filter-group select {
        width: 100%;
        min-width: unset;
    }

    .search-wrapper {
        width: 100%;
    }

    .search-input {
        flex: 1;
        min-width: unset;
    }

    .search-btn {
        flex-shrink: 0;
    }

    .search-group {
        min-width: unset;
    }
}
</style>


