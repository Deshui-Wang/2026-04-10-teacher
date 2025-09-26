<template>
  <div class="my-assets-page">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <input
          v-model.trim="filters.keyword"
          type="text"
          class="input"
          placeholder="按编号/名称/单位/位置搜索..."
        />
        <select v-model="filters.status" class="select">
          <option value="">全部状态</option>
          <option value="在用">在用</option>
          <option value="闲置">闲置</option>
          <option value="报废">报废</option>
          <option value="维修">维修</option>
        </select>
        <input
          v-model.trim="filters.unit"
          type="text"
          class="input"
          placeholder="所属单位"
        />
        <button class="btn" @click="resetFilters">重置</button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="content-section">
      <div class="section-header">
        <h2>我的资产</h2>
      </div>

      <!-- 汇总卡片 -->
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-title">资产数量</div>
          <div class="summary-value">{{ totalCount }}</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">总价值（元）</div>
          <div class="summary-value">{{ formatCurrency(totalValue) }}</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">在用 / 闲置</div>
          <div class="summary-value">{{ inUseCount }} / {{ idleCount }}</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">报废数量</div>
          <div class="summary-value">{{ retiredCount }}</div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 140px;">资产编号</th>
              <th>资产名称</th>
              <th>所属单位</th>
              <th>存放位置</th>
              <th style="width: 90px;">状态</th>
              <th style="width: 160px;">使用开始时间</th>
              <th style="width: 120px;">使用时长</th>
              <th style="width: 140px;">价值（元）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredAssets.length === 0">
              <td colspan="8" class="empty">暂无符合条件的数据</td>
            </tr>
            <tr v-for="asset in filteredAssets" :key="asset.id">
              <td>{{ asset.code }}</td>
              <td>
                <div class="name-cell">
                  <div class="name">{{ asset.name }}</div>
                  <div class="sub">编号：{{ asset.code }}</div>
                </div>
              </td>
              <td>{{ asset.unit }}</td>
              <td>{{ asset.location }}</td>
              <td>
                <span :class="['status', statusClass(asset.status)]">{{ asset.status }}</span>
              </td>
              <td>{{ formatDate(asset.usageStartAt) }}</td>
              <td>{{ formatDuration(asset.usageStartAt, asset.usageEndAt) }}</td>
              <td>{{ formatCurrency(asset.value) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

interface AssetItem {
  id: string
  code: string
  name: string
  unit: string
  location: string
  status: '在用' | '闲置' | '报废' | '维修'
  usageStartAt: string // ISO 日期字符串
  usageEndAt?: string | null // 若为空则表示仍在使用
  value: number // 单位：元
}

// 示例数据：后续可替换为接口返回
const assets = reactive<AssetItem[]>([
  {
    id: 'A-001',
    code: 'ZC-2023-0001',
    name: '高性能工作站',
    unit: '信息技术中心',
    location: '研发楼 3F-305',
    status: '在用',
    usageStartAt: '2023-01-12',
    usageEndAt: null,
    value: 25800,
  },
  {
    id: 'A-002',
    code: 'ZC-2022-0137',
    name: '教学投影仪',
    unit: '教务处',
    location: '教学楼 A-201',
    status: '闲置',
    usageStartAt: '2022-09-01',
    usageEndAt: '2024-06-30',
    value: 5600,
  },
  {
    id: 'A-003',
    code: 'ZC-2020-0458',
    name: '实验室服务器',
    unit: '实验中心',
    location: '机房 B-102',
    status: '在用',
    usageStartAt: '2021-03-20',
    usageEndAt: null,
    value: 76800,
  },
  {
    id: 'A-004',
    code: 'ZC-2018-0099',
    name: '旧台式机',
    unit: '信息技术中心',
    location: '仓库 C-07',
    status: '报废',
    usageStartAt: '2018-05-01',
    usageEndAt: '2022-05-01',
    value: 3000,
  },
  {
    id: 'A-005',
    code: 'ZC-2024-0220',
    name: '3D 打印机',
    unit: '实验中心',
    location: '创新实验室 D-01',
    status: '维修',
    usageStartAt: '2024-04-18',
    usageEndAt: null,
    value: 12800,
  },
])

const filters = reactive({
  keyword: '',
  status: '',
  unit: '',
})

const filteredAssets = computed(() => {
  const kw = filters.keyword.trim().toLowerCase()
  const st = filters.status
  const ut = filters.unit.trim().toLowerCase()
  return assets.filter((a) => {
    const hitKw = kw
      ? [a.code, a.name, a.unit, a.location].some((t) => t.toLowerCase().includes(kw))
      : true
    const hitSt = st ? a.status === st : true
    const hitUt = ut ? a.unit.toLowerCase().includes(ut) : true
    return hitKw && hitSt && hitUt
  })
})

const totalCount = computed(() => filteredAssets.value.length)
const totalValue = computed(() => filteredAssets.value.reduce((sum, a) => sum + (a.value || 0), 0))
const inUseCount = computed(() => filteredAssets.value.filter((a) => a.status === '在用').length)
const idleCount = computed(() => filteredAssets.value.filter((a) => a.status === '闲置').length)
const retiredCount = computed(() => filteredAssets.value.filter((a) => a.status === '报废').length)

function resetFilters() {
  filters.keyword = ''
  filters.status = ''
  filters.unit = ''
}

function statusClass(status: AssetItem['status']) {
  switch (status) {
    case '在用':
      return 'status-using'
    case '闲置':
      return 'status-idle'
    case '报废':
      return 'status-retired'
    case '维修':
      return 'status-repair'
    default:
      return ''
  }
}

function formatCurrency(value: number): string {
  if (Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('zh-CN', { style: 'decimal', maximumFractionDigits: 0 }).format(value)
}

function formatDate(dateLike?: string | null): string {
  if (!dateLike) return '—'
  const d = new Date(dateLike)
  if (Number.isNaN(d.getTime())) return '—'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const da = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${da}`
}

function formatDuration(start?: string | null, end?: string | null): string {
  if (!start) return '—'
  const s = new Date(start)
  const e = end ? new Date(end) : new Date()
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return '—'
  let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
  if (e.getDate() < s.getDate()) months -= 1
  if (months < 0) months = 0
  const years = Math.floor(months / 12)
  const remainMonths = months % 12
  if (years > 0 && remainMonths > 0) return `${years}年${remainMonths}个月`
  if (years > 0) return `${years}年`
  return `${remainMonths}个月`
}
</script>

<style scoped>
/* 页面容器样式 */
.my-assets-page {
  padding: 24px;
  background: #f8f9ff;
  min-height: 100vh;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

/* 筛选区域样式 */
.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

/* 主内容区域样式 */
.content-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e6f1;
  background: #f8f9ff;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.section-desc {
  margin: 0 0 16px 0;
  color: #667085;
  line-height: 1.7;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 24px;
  margin-bottom: 16px;
}

.summary-card {
  background: #f5f7ff;
  border: 1px solid #e0e6f1;
  border-radius: 12px;
  padding: 14px 16px;
}

.summary-title {
  color: #667085;
  font-size: 12px;
  margin-bottom: 6px;
}

.summary-value {
  color: #333;
  font-size: 20px;
  font-weight: 700;
}

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 8px 0 14px 0;
}

.input {
  flex: 1 1 240px;
  background: #fff;
  border: 1px solid #e0e6f1;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: #333;
}

.select {
  flex: 0 0 150px;
  background: #fff;
  border: 1px solid #e0e6f1;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: #333;
}

.btn {
  flex: 0 0 auto;
  background: #eef6ff;
  color: #1677ff;
  border: 1px solid #d6e6ff;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover { 
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.15); 
}

.table-wrap {
  background: #ffffff;
  border: 1px solid #e0e6f1;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 24px 24px 24px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table thead th {
  background: #f5f7ff;
  color: #445066;
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #e0e6f1;
  font-weight: 600;
  text-align: center;
}

.table tbody td {
  color: #333;
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6;
}

.table tbody tr:hover td { 
  background: #fafbff; 
}

.empty { 
  text-align: center; 
  color: #667085; 
  padding: 16px 0; 
}

.name-cell .name {
  font-weight: 600;
  color: #333;
}

.name-cell .sub {
  font-size: 12px;
  color: #667085;
}

.status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid transparent;
}

.status-using {
  color: #1677ff;
  background: #eef6ff;
  border-color: #d6e6ff;
}

.status-idle {
  color: #1e3a8a;
  background: #eff6ff;
  border-color: #bfdbfe;
}

.status-retired {
  color: #991b1b;
  background: #fef2f2;
  border-color: #fecaca;
}

.status-repair {
  color: #92400e;
  background: #fffbeb;
  border-color: #fde68a;
}

/* 响应式设计 */
@media (max-width: 1100px) {
  .summary-grid { 
    grid-template-columns: repeat(2, minmax(0, 1fr)); 
  }
}

@media (max-width: 768px) {
  .my-assets-page {
    padding: 16px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .input, .select {
    width: 100%;
  }
  
  .summary-grid { 
    grid-template-columns: 1fr; 
  }
  
  .table-wrap {
    margin: 0 16px 16px 16px;
  }
}
</style> 