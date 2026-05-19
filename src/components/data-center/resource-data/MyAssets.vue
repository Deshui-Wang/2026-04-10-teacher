<template>
  <div class="my-assets-page">
    <!-- 头部横幅与介绍 -->
    <div class="assets-banner">
      <div class="banner-content">
        <h1 class="banner-title">资产与设备管理</h1>
        <p class="banner-subtitle">直观、实时地监管您名下的所有硬件设备及教学资产状态</p>
      </div>
      
      <!-- 视图切换控制 -->
      <div class="view-toggle-wrapper">
        <button 
          class="toggle-btn" 
          :class="{ active: currentView === 'grid' }"
          @click="currentView = 'grid'"
        >
          <el-icon><Grid /></el-icon>
          <span>卡片网格</span>
        </button>
        <button 
          class="toggle-btn" 
          :class="{ active: currentView === 'table' }"
          @click="currentView = 'table'"
        >
          <el-icon><List /></el-icon>
          <span>详细表格</span>
        </button>
      </div>
    </div>

    <!-- 筛选及搜索控制面板 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="search-input-wrapper">
          <el-icon class="search-icon"><Search /></el-icon>
          <input
            v-model.trim="filters.keyword"
            type="text"
            class="input search-input"
            placeholder="按编号 / 名称 / 单位 / 位置搜索资产..."
          />
        </div>
        
        <div class="select-wrapper">
          <select v-model="filters.status" class="select">
            <option value="">全部运行状态</option>
            <option value="在用">在用</option>
            <option value="闲置">闲置</option>
            <option value="报废">报废</option>
            <option value="维修">维修</option>
          </select>
        </div>
        
        <div class="search-input-wrapper unit-wrapper">
          <el-icon class="search-icon"><OfficeBuilding /></el-icon>
          <input
            v-model.trim="filters.unit"
            type="text"
            class="input unit-input"
            placeholder="所属单位/部门"
          />
        </div>
        
        <button class="btn btn-reset" @click="resetFilters">
          <el-icon><RefreshRight /></el-icon>
          <span>重置筛选</span>
        </button>
      </div>
    </div>

    <!-- 汇总核心看板卡片组 -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-icon-box count-box">
          <el-icon><Box /></el-icon>
        </div>
        <div class="summary-info">
          <div class="summary-title">资产总数</div>
          <div class="summary-value">{{ totalCount }}<span class="unit-text">台</span></div>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon-box value-box">
          <el-icon><Money /></el-icon>
        </div>
        <div class="summary-info">
          <div class="summary-title">总估值 (元)</div>
          <div class="summary-value">{{ formatCurrency(totalValue) }}</div>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon-box using-box">
          <el-icon><Cpu /></el-icon>
        </div>
        <div class="summary-info">
          <div class="summary-title">在用 / 闲置</div>
          <div class="summary-value">
            <span class="text-using">{{ inUseCount }}</span>
            <span class="divider">/</span>
            <span class="text-idle">{{ idleCount }}</span>
          </div>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon-box retired-box">
          <el-icon><Delete /></el-icon>
        </div>
        <div class="summary-info">
          <div class="summary-title">待报废资产</div>
          <div class="summary-value text-retired">{{ retiredCount }}<span class="unit-text">台</span></div>
        </div>
      </div>
    </div>

    <!-- 主展示区域 -->
    <div class="main-display-section">
      <!-- 视图1: 精美的卡片网格视图（前端虚拟硬件渲染） -->
      <transition name="fade-slide" mode="out-in">
        <div v-if="currentView === 'grid'" class="assets-cards-grid">
          <div v-if="filteredAssets.length === 0" class="no-data-card">
            <el-icon class="empty-icon"><Warning /></el-icon>
            <p>未找到符合筛选条件的资产设备</p>
          </div>
          
          <div 
            v-for="asset in filteredAssets" 
            :key="asset.id" 
            class="asset-glass-card"
            :class="`status-card-${statusClass(asset.status)}`"
          >
            <!-- 资产顶部：前端模拟的设备示意图 -->
            <div class="asset-visual-window">
              <!-- 状态标签悬浮在设备玻璃窗口右上角 -->
              <span :class="['status-badge', statusClass(asset.status)]">{{ asset.status }}</span>
              
              <!-- 模拟：高性能工作站 -->
              <div v-if="asset.id === 'A-001'" class="hardware-sim workstation-sim">
                <div class="monitor-wrapper">
                  <div class="monitor-screen">
                    <div class="screen-light"></div>
                    <div class="screen-inner">
                      <div class="grid-line"></div>
                      <div class="code-line line-1"></div>
                      <div class="code-line line-2"></div>
                      <div class="bar-chart">
                        <div class="bar bar-a"></div>
                        <div class="bar bar-b"></div>
                        <div class="bar bar-c"></div>
                      </div>
                    </div>
                  </div>
                  <div class="monitor-stand"></div>
                  <div class="monitor-base"></div>
                </div>
                
                <div class="pc-chassis">
                  <div class="chassis-vent"></div>
                  <div class="power-led blinking"></div>
                  <div class="fan fan-top rotating"></div>
                  <div class="fan fan-bottom rotating"></div>
                  <div class="glass-reflection"></div>
                </div>
              </div>

              <!-- 模拟：教学投影仪 -->
              <div v-else-if="asset.id === 'A-002'" class="hardware-sim projector-sim">
                <div class="projector-body">
                  <div class="proj-lens">
                    <div class="lens-glass"></div>
                  </div>
                  <div class="vent-stripes"></div>
                  <div class="vent-stripes v-right"></div>
                  <div class="proj-leds">
                    <div class="p-led led-1 blinking-green"></div>
                    <div class="p-led led-2"></div>
                  </div>
                </div>
                <!-- 投影发射的光束效果 -->
                <div class="projection-beam"></div>
              </div>

              <!-- 模拟：实验室服务器 -->
              <div v-else-if="asset.id === 'A-003'" class="hardware-sim server-sim">
                <div class="rack-cabinet">
                  <div class="rack-ear-left"></div>
                  <div class="rack-ear-right"></div>
                  
                  <div class="server-blade slot-1">
                    <div class="grid-pattern"></div>
                    <div class="blade-leds">
                      <div class="b-led green blinking-fast"></div>
                      <div class="b-led green"></div>
                      <div class="b-led blue blinking"></div>
                    </div>
                  </div>
                  
                  <div class="server-blade slot-2">
                    <div class="grid-pattern"></div>
                    <div class="blade-leds">
                      <div class="b-led green blinking"></div>
                      <div class="b-led green blinking-fast"></div>
                      <div class="b-led orange blinking-slow"></div>
                    </div>
                  </div>
                  
                  <div class="server-blade slot-3">
                    <div class="grid-pattern"></div>
                    <div class="blade-leds">
                      <div class="b-led blue blinking-slow"></div>
                      <div class="b-led green"></div>
                      <div class="b-led green blinking"></div>
                    </div>
                  </div>
                  
                  <div class="server-blade slot-4">
                    <div class="grid-pattern"></div>
                    <div class="blade-leds">
                      <div class="b-led red blinking-fast"></div>
                      <div class="b-led orange blinking"></div>
                      <div class="b-led green"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 模拟：旧台式机 -->
              <div v-else-if="asset.id === 'A-004'" class="hardware-sim oldpc-sim">
                <div class="crt-case">
                  <div class="crt-screen">
                    <div class="crt-dust"></div>
                    <div class="screen-no-signal">NO SIGNAL</div>
                  </div>
                  <div class="crt-buttons">
                    <div class="c-knob"></div>
                    <div class="c-knob"></div>
                    <div class="crt-power-led red-static"></div>
                  </div>
                </div>
                <div class="crt-neck"></div>
                <div class="old-desktop-chassis">
                  <div class="floppy-slot"></div>
                  <div class="power-button"></div>
                </div>
              </div>

              <!-- 模拟：3D 打印机 -->
              <div v-else-if="asset.id === 'A-005'" class="hardware-sim printer3d-sim">
                <div class="printer-frame">
                  <!-- 顶轴和线卷 -->
                  <div class="spool"></div>
                  
                  <!-- 打印喷头和导轨 -->
                  <div class="x-axis-rail">
                    <div class="extruder-nozzle printing-motion"></div>
                  </div>
                  
                  <!-- 半打印状态的对象 -->
                  <div class="printed-model-wrapper">
                    <div class="printed-base-grid"></div>
                    <div class="hologram-cube pulsating"></div>
                  </div>
                  
                  <!-- 打印底座板 -->
                  <div class="build-plate"></div>
                </div>
              </div>

              <!-- 兜底硬件设计（若新增其他资产） -->
              <div v-else class="hardware-sim default-sim">
                <div class="mystery-box">
                  <el-icon class="box-icon"><Cpu /></el-icon>
                  <div class="scanning-laser"></div>
                </div>
              </div>
            </div>

            <!-- 资产底部：详细信息卡片 -->
            <div class="asset-card-details">
              <div class="asset-card-header">
                <h3 class="asset-card-name">{{ asset.name }}</h3>
                <span class="asset-card-code">{{ asset.code }}</span>
              </div>
              
              <div class="info-divider"></div>
              
              <div class="details-metadata-grid">
                <div class="meta-item">
                  <el-icon class="meta-icon"><OfficeBuilding /></el-icon>
                  <div class="meta-label">归属单位</div>
                  <div class="meta-content">{{ asset.unit }}</div>
                </div>
                
                <div class="meta-item">
                  <el-icon class="meta-icon"><Location /></el-icon>
                  <div class="meta-label">存放位置</div>
                  <div class="meta-content">{{ asset.location }}</div>
                </div>
                
                <div class="meta-item">
                  <el-icon class="meta-icon"><Timer /></el-icon>
                  <div class="meta-label">开始使用</div>
                  <div class="meta-content">{{ formatDate(asset.usageStartAt) }}</div>
                </div>
                
                <div class="meta-item">
                  <el-icon class="meta-icon"><Calendar /></el-icon>
                  <div class="meta-label">已服役</div>
                  <div class="meta-content duration-text">{{ formatDuration(asset.usageStartAt, asset.usageEndAt) }}</div>
                </div>
              </div>
              
              <div class="info-divider"></div>
              
              <div class="asset-card-footer">
                <div class="value-label">资产价值</div>
                <div class="value-amount">¥{{ formatCurrency(asset.value) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 视图2: 精致详实的数据表格视图 -->
        <div v-else class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th style="width: 140px;">资产编号</th>
                <th>资产名称</th>
                <th>所属单位</th>
                <th>存放位置</th>
                <th style="width: 100px;">状态</th>
                <th style="width: 160px;">使用开始时间</th>
                <th style="width: 120px;">使用时长</th>
                <th style="width: 140px; text-align: right;">价值（元）</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredAssets.length === 0">
                <td colspan="8" class="empty">暂无符合条件的资产数据</td>
              </tr>
              <tr v-for="asset in filteredAssets" :key="asset.id">
                <td class="bold-code">{{ asset.code }}</td>
                <td>
                  <div class="name-cell">
                    <div class="name">{{ asset.name }}</div>
                    <div class="sub">ID: {{ asset.id }}</div>
                  </div>
                </td>
                <td>{{ asset.unit }}</td>
                <td>
                  <span class="location-badge">
                    <el-icon><Location /></el-icon>
                    {{ asset.location }}
                  </span>
                </td>
                <td>
                  <span :class="['status', statusClass(asset.status)]">{{ asset.status }}</span>
                </td>
                <td>{{ formatDate(asset.usageStartAt) }}</td>
                <td class="duration-highlight">{{ formatDuration(asset.usageStartAt, asset.usageEndAt) }}</td>
                <td class="value-highlight">¥{{ formatCurrency(asset.value) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { 
  Grid, List, Search, OfficeBuilding, RefreshRight, 
  Box, Money, Cpu, Delete, Warning, Location, Timer, Calendar 
} from '@element-plus/icons-vue'

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

// 视图切换，默认为网格卡片视图
const currentView = ref<'grid' | 'table'>('grid')

// 示例数据
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
      return 'using'
    case '闲置':
      return 'idle'
    case '报废':
      return 'retired'
    case '维修':
      return 'repair'
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
.my-assets-page {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
  width: 100%;
}

/* 顶部横幅 */
.assets-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 20px;
}

.banner-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.banner-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: 0.5px;
}

.banner-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 视图切换按钮组 */
.view-toggle-wrapper {
  display: flex;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
}

.toggle-btn:hover {
  color: #0f172a;
}

.toggle-btn.active {
  background: #ffffff;
  color: #2563eb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* 过滤区域样式 */
.filter-section {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input-wrapper {
  position: relative;
  flex: 1 1 260px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 16px;
}

.input {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px 10px 40px;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.25s ease;
}

.input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  outline: none;
}

.select-wrapper {
  flex: 0 0 180px;
}

.select {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.25s ease;
}

.select:focus {
  border-color: #3b82f6;
  outline: none;
}

.unit-wrapper {
  flex: 0 1 200px;
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-reset:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* 汇总面板样式 */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}

.summary-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.count-box { background: #eff6ff; color: #2563eb; }
.value-box { background: #f0fdf4; color: #16a34a; }
.using-box { background: #faf5ff; color: #9333ea; }
.retired-box { background: #fef2f2; color: #dc2626; }

.summary-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-title {
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.summary-value {
  color: #0f172a;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.unit-text {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
}

.divider {
  color: #cbd5e1;
  margin: 0 4px;
}

.text-using { color: #2563eb; }
.text-idle { color: #64748b; }
.text-retired { color: #dc2626; }

/* 网格视图大区域 */
.main-display-section {
  width: 100%;
}

.assets-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.no-data-card {
  grid-column: 1 / -1;
  background: #ffffff;
  border-radius: 16px;
  padding: 60px 20px;
  text-align: center;
  color: #94a3b8;
  border: 1px dashed #cbd5e1;
}

.empty-icon {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 12px;
}

/* 玻璃卡片精美特效 */
.asset-glass-card {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
}

.asset-glass-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

/* 设备示意视窗 - 科技风黑色背景 */
.asset-visual-window {
  height: 200px;
  background: linear-gradient(135deg, #0b0f19 0%, #1a2035 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid #1e293b;
}

/* 设备卡片顶部状态贴片 */
.status-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  z-index: 10;
}

.status-badge.using { background: rgba(37, 99, 235, 0.2); color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.4); }
.status-badge.idle { background: rgba(71, 85, 105, 0.2); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.4); }
.status-badge.retired { background: rgba(220, 38, 38, 0.2); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.4); }
.status-badge.repair { background: rgba(217, 119, 6, 0.2); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.4); }

/* --- 前端设备模拟渲染层 (Hardware Simulations) --- */
.hardware-sim {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 1. 高性能工作站模拟 */
.workstation-sim {
  gap: 20px;
}

.monitor-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.monitor-screen {
  width: 100px;
  height: 64px;
  background: #1e293b;
  border: 4px solid #475569;
  border-radius: 6px;
  position: relative;
  box-shadow: 0 6px 12px rgba(0,0,0,0.4);
  overflow: hidden;
}

.screen-light {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
}

.screen-inner {
  padding: 4px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.grid-line {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 8px 8px;
}

.code-line {
  height: 4px;
  border-radius: 2px;
  background: #10b981;
  opacity: 0.8;
}
.code-line.line-1 { width: 50%; background: #3b82f6; }
.code-line.line-2 { width: 35%; background: #10b981; }

.bar-chart {
  margin-top: auto;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 20px;
}

.bar {
  flex: 1;
  border-radius: 1px;
}
.bar-a { height: 60%; background: #ef4444; }
.bar-b { height: 85%; background: #3b82f6; }
.bar-c { height: 40%; background: #10b981; }

.monitor-stand {
  width: 8px;
  height: 14px;
  background: #334155;
}

.monitor-base {
  width: 40px;
  height: 4px;
  background: #475569;
  border-radius: 2px;
}

.pc-chassis {
  width: 32px;
  height: 74px;
  background: linear-gradient(to bottom, #334155, #0f172a);
  border: 2px solid #475569;
  border-radius: 4px;
  position: relative;
  box-shadow: 0 8px 16px rgba(0,0,0,0.5);
  padding: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.chassis-vent {
  height: 8px;
  background: rgba(255,255,255,0.05);
  border-radius: 1px;
}

.power-led {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #60a5fa;
  position: absolute;
  top: 8px;
  right: 8px;
  box-shadow: 0 0 6px #3b82f6;
}

.fan {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px dashed rgba(59, 130, 246, 0.4);
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 60%);
  margin: 0 auto;
}

.glass-reflection {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
  pointer-events: none;
}

/* 2. 教学投影仪模拟 */
.projector-sim {
  flex-direction: column;
}

.projector-body {
  width: 120px;
  height: 44px;
  background: linear-gradient(180deg, #f8fafc 0%, #cbd5e1 100%);
  border-radius: 8px;
  position: relative;
  box-shadow: 0 10px 20px rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
}

.proj-lens {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1e293b;
  border: 3px solid #64748b;
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lens-glass {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, #38bdf8 0%, #0369a1 70%);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.8);
}

.vent-stripes {
  width: 24px;
  height: 18px;
  background: repeating-linear-gradient(90deg, #475569, #475569 2px, transparent 2px, transparent 5px);
  position: absolute;
  right: 16px;
}

.proj-leds {
  position: absolute;
  top: 6px;
  right: 12px;
  display: flex;
  gap: 4px;
}

.p-led {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #475569;
}
.p-led.blinking-green {
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
  animation: blink 1.2s infinite alternate;
}

.projection-beam {
  position: absolute;
  left: 28px;
  top: 66px;
  width: 140px;
  height: 70px;
  background: linear-gradient(115deg, rgba(56, 189, 248, 0.25) 0%, transparent 60%);
  clip-path: polygon(0 30%, 100% 0, 100% 100%, 0 70%);
  pointer-events: none;
}

/* 3. 实验室服务器模拟 */
.server-sim {
  padding: 10px;
}

.rack-cabinet {
  width: 150px;
  height: 150px;
  background: #111827;
  border: 3px solid #374151;
  border-radius: 8px;
  position: relative;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.9), 0 10px 25px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  padding: 10px 4px;
  gap: 8px;
  justify-content: space-around;
}

.rack-ear-left, .rack-ear-right {
  width: 4px;
  height: 136px;
  background: #4b5563;
  position: absolute;
  top: 7px;
}
.rack-ear-left { left: -4px; border-radius: 2px 0 0 2px; }
.rack-ear-right { right: -4px; border-radius: 0 2px 2px 0; }

.server-blade {
  height: 24px;
  background: linear-gradient(90deg, #1f2937, #374151);
  border: 1px solid #4b5563;
  border-radius: 2px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  justify-content: space-between;
}

.grid-pattern {
  width: 60px;
  height: 10px;
  background: radial-gradient(rgba(255,255,255,0.15) 20%, transparent 20%);
  background-size: 3px 3px;
}

.blade-leds {
  display: flex;
  gap: 4px;
}

.b-led {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #1f2937;
}

.b-led.green { background: #10b981; box-shadow: 0 0 4px #10b981; }
.b-led.blue { background: #3b82f6; box-shadow: 0 0 4px #3b82f6; }
.b-led.orange { background: #f97316; box-shadow: 0 0 4px #f97316; }
.b-led.red { background: #ef4444; box-shadow: 0 0 4px #ef4444; }

/* 4. 旧台式机模拟 */
.oldpc-sim {
  flex-direction: column;
}

.crt-case {
  width: 90px;
  height: 80px;
  background: #e2e8f0;
  border: 5px solid #cbd5e1;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 6px;
  gap: 4px;
}

.crt-screen {
  flex: 1;
  background: #020617;
  border-radius: 6px;
  border: 2px solid #94a3b8;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.crt-dust {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 80%);
}

.screen-no-signal {
  font-family: monospace;
  font-size: 10px;
  color: #ef4444;
  letter-spacing: 0.5px;
  animation: blink 0.8s infinite alternate;
}

.crt-buttons {
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  padding-right: 4px;
}

.c-knob {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
}

.crt-power-led {
  width: 3px;
  height: 3px;
  border-radius: 50%;
}
.crt-power-led.red-static {
  background: #ef4444;
  box-shadow: 0 0 3px #ef4444;
}

.crt-neck {
  width: 30px;
  height: 12px;
  background: #cbd5e1;
  clip-path: polygon(15% 0, 85% 0, 100% 100%, 0 100%);
}

.old-desktop-chassis {
  width: 106px;
  height: 28px;
  background: #e2e8f0;
  border: 3px solid #cbd5e1;
  border-radius: 4px;
  box-shadow: 0 8px 12px rgba(0,0,0,0.3);
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 8px;
  justify-content: space-between;
}

.floppy-slot {
  width: 44px;
  height: 3px;
  background: #475569;
  border-radius: 1px;
}

.power-button {
  width: 10px;
  height: 10px;
  background: #ef4444;
  border: 1px solid #94a3b8;
  cursor: pointer;
}

/* 5. 3D打印机模拟 */
.printer3d-sim {
  padding: 10px;
}

.printer-frame {
  width: 110px;
  height: 120px;
  border: 3px solid #475569;
  border-radius: 6px;
  background: rgba(255,255,255,0.02);
  position: relative;
  box-shadow: inset 0 0 12px rgba(255,255,255,0.05), 0 10px 20px rgba(0,0,0,0.3);
}

.spool {
  width: 24px;
  height: 12px;
  background: #3b82f6;
  border-radius: 4px;
  position: absolute;
  top: -12px;
  left: 20px;
  border: 1px solid #64748b;
}

.x-axis-rail {
  width: 100%;
  height: 4px;
  background: #64748b;
  position: absolute;
  top: 36px;
}

.extruder-nozzle {
  width: 12px;
  height: 16px;
  background: #e2e8f0;
  border: 1px solid #475569;
  position: absolute;
  top: -6px;
  border-radius: 1px;
}
.extruder-nozzle::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 4px;
  width: 4px;
  height: 4px;
  background: #f97316;
  clip-path: polygon(50% 100%, 0 0, 100% 0);
  box-shadow: 0 0 4px #f97316;
}

.printed-model-wrapper {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hologram-cube {
  width: 32px;
  height: 32px;
  background: rgba(249, 115, 22, 0.4);
  border: 1.5px solid #f97316;
  transform: rotateX(45deg) rotateZ(45deg);
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.3);
}

.printed-base-grid {
  width: 48px;
  height: 4px;
  background: rgba(255,255,255,0.05);
  border-radius: 20%;
}

.build-plate {
  width: 80px;
  height: 6px;
  background: #1e293b;
  border-top: 2px solid #64748b;
  position: absolute;
  bottom: 8px;
  left: 12px;
  border-radius: 1px;
}

/* 兜底 */
.default-sim {
  background: rgba(255,255,255,0.01);
}
.mystery-box {
  width: 60px;
  height: 60px;
  border: 2px dashed #475569;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.box-icon {
  font-size: 28px;
  color: #475569;
}
.scanning-laser {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3b82f6;
  box-shadow: 0 0 8px #2563eb;
  animation: laser-scan 2s infinite ease-in-out;
}

/* --- 卡片详情信息展示层 --- */
.asset-card-details {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.asset-card-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.asset-card-name {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.asset-card-code {
  font-size: 12px;
  font-family: monospace;
  color: #94a3b8;
  font-weight: 600;
}

.info-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 14px 0;
}

.details-metadata-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-icon {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 2px;
}

.meta-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.meta-content {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.duration-text {
  color: #2563eb;
}

.asset-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.value-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.value-amount {
  font-size: 18px;
  font-weight: 800;
  color: #16a34a;
}

/* --- 传统数据表格样式优化 --- */
.table-wrap {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table thead th {
  background: #f8fafc;
  color: #475569;
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 700;
}

.table tbody td {
  color: #334155;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.table tbody tr:hover td {
  background: #f8fafc;
}

.bold-code {
  font-family: monospace;
  font-weight: 700;
  color: #64748b;
}

.name-cell .name {
  font-weight: 700;
  color: #0f172a;
}

.name-cell .sub {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.location-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.status.using { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }
.status.idle { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
.status.retired { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
.status.repair { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }

.duration-highlight {
  font-weight: 600;
  color: #2563eb;
}

.value-highlight {
  font-weight: 700;
  color: #16a34a;
  text-align: right;
}

/* --- 关键帧动画定义 --- */
@keyframes blink {
  0% { opacity: 0.2; }
  100% { opacity: 1; }
}

.blinking {
  animation: blink 1s infinite alternate;
}

.blinking-fast {
  animation: blink 0.5s infinite alternate;
}

.blinking-slow {
  animation: blink 1.8s infinite alternate;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.rotating {
  animation: rotate 3s linear infinite;
  transform-origin: center;
}

@keyframes laser-scan {
  0%, 100% { top: 0%; }
  50% { top: 100%; }
}

@keyframes print-slide {
  0% { left: 10px; }
  100% { left: 90px; }
}

.printing-motion {
  animation: print-slide 2.5s infinite ease-in-out alternate;
}

@keyframes pulse-glow {
  0%, 100% { transform: rotateX(45deg) rotateZ(45deg) scale(1); filter: brightness(1); }
  50% { transform: rotateX(45deg) rotateZ(45deg) scale(1.08); filter: brightness(1.2); }
}

.pulsating {
  animation: pulse-glow 2s infinite ease-in-out;
}

/* 页面切换的精致过渡动画 (Fade Slide) */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* 响应式适配 */
@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
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
  
  .search-input-wrapper, .select-wrapper, .unit-wrapper, .btn-reset {
    width: 100%;
    flex: 1 1 auto;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .assets-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>