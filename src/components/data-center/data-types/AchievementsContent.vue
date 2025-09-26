<template>
  <div class="content-section">
    <div class="content-tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'papers' }"
        @click="$emit('sub-tab-change', 'papers')"
      >
        论文
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'certificates' }"
        @click="$emit('sub-tab-change', 'certificates')"
      >
        证书
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'ability-certification' }"
        @click="$emit('sub-tab-change', 'ability-certification')"
      >
        ★能力认证
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'international-ability' }"
        @click="$emit('sub-tab-change', 'international-ability')"
      >
        ★国际能力
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'teaching-achievements' }"
        @click="$emit('sub-tab-change', 'teaching-achievements')"
      >
        教学成果
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'patents' }"
        @click="$emit('sub-tab-change', 'patents')"
      >
        专利
      </div>
    </div>
    
    <!-- 内容展示区域 -->
    <div class="content-area">
      <!-- 成果数据-论文页面 -->
      <Papers v-if="activeSubTab === 'papers'" />
      
      <!-- 成果数据-证书页面 -->
      <Certificates v-if="activeSubTab === 'certificates'" />
      
      <!-- 成果数据-能力认证页面 -->
      <AbilityCertifications v-if="activeSubTab === 'ability-certification'" />
      
      <!-- 成果数据-国际能力页面 -->
      <InternationalAbility v-if="activeSubTab === 'international-ability'" />
      
      <!-- 成果数据-教学成果页面 -->
      <TeachingAchievements v-if="activeSubTab === 'teaching-achievements'" />
      
      <!-- 成果数据-专利页面 -->
      <Patents v-if="activeSubTab === 'patents'" />
    </div>
  </div>
</template>

<script setup>
import Papers from '@/components/data-center/achievements/Papers.vue'
import Certificates from '@/components/data-center/achievements/Certificates.vue'
import AbilityCertifications from '@/components/data-center/achievements/AbilityCertifications.vue'
import InternationalAbility from '@/components/data-center/achievements/InternationalAbility.vue'
import TeachingAchievements from '@/components/data-center/achievements/TeachingAchievements.vue'
import Patents from '@/components/data-center/achievements/Patents.vue'

defineProps({
  activeSubTab: {
    type: String,
    default: 'papers'
  }
})

defineEmits(['sub-tab-change'])
</script>

<style scoped>
/* 内容区域 */
.content-section {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.content-tabs {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
}

.tab-item {
  padding: 16px 24px;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
}

.tab-item:hover {
  color: #3b82f6;
  background: #f1f5f9;
}

.tab-item.active {
  color: #3b82f6;
  background: white;
  border-bottom-color: #3b82f6;
}

.content-area {
  min-height: 600px;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-tabs {
    flex-wrap: wrap;
  }
  
  .tab-item {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
