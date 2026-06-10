<template>
  <header class="dashboard-header">
    <div class="header-left">
      <div class="time-block">
        <span class="icon-clock">📅</span>
        <span class="time-text font-num">{{ timeString }}</span>
      </div>
      <div class="status-block">
        <span class="status-dot online"></span>
        <span class="status-text">系统运行中</span>
      </div>
    </div>

    <div class="header-center">
      <h1 class="title-glow">智慧实验室数字中枢</h1>
      <p v-if="subtitleText" class="subtitle">{{ subtitleText }}</p>
    </div>

    <div class="header-right">
      <div class="metric-item">
        <span class="metric-icon">🍃</span>
        <span class="metric-tag green">空气优</span>
      </div>
      <div class="metric-item">
        <span class="metric-icon">📶</span>
        <span class="metric-val">网络正常</span>
      </div>
      <div class="metric-item">
        <span class="metric-icon">🖥️</span>
        <span class="metric-label">设备</span>
        <span class="metric-val font-num highlight">21/23 在线</span>
      </div>
    </div>
  </header>

  <!-- Navigation bar directly below -->
  <nav class="navigation-bar">
    <div class="nav-container">
      <button 
        class="nav-item" 
        :class="{ active: modelValue === 'overview' }"
        @click="selectTab('overview')"
      >
        <span class="nav-icon">🏠</span>
        <span class="nav-label">首页总览</span>
      </button>

      <button 
        class="nav-item"
        :class="{ active: modelValue === 'members' }"
        @click="selectTab('members')"
      >
        <span class="nav-icon">👥</span>
        <span class="nav-label">成员大厅</span>
      </button>

      <button 
        class="nav-item"
        :class="{ active: modelValue === 'achievements' }"
        @click="selectTab('achievements')"
      >
        <span class="nav-icon">🏆</span>
        <span class="nav-label">成果展示</span>
      </button>

      <button 
        class="nav-item"
        :class="{ active: modelValue === 'projects' }"
        @click="selectTab('projects')"
      >
        <span class="nav-icon">📁</span>
        <span class="nav-label">项目展厅</span>
      </button>

      <button 
        class="nav-item"
        :class="{ active: modelValue === 'activities' }"
        @click="selectTab('activities')"
      >
        <span class="nav-icon">⭐</span>
        <span class="nav-label">活动风采</span>
      </button>

      <button 
        class="nav-item" 
        :class="{ active: modelValue === 'devices' }"
        @click="selectTab('devices')"
      >
        <span class="nav-icon">⚙️</span>
        <span class="nav-label">空间设备</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const currentTime = ref(new Date());

const updateTime = () => {
  currentTime.value = new Date();
};

let timer = null;
onMounted(() => {
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const timeString = computed(() => {
  const dt = currentTime.value;
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const date = String(dt.getDate()).padStart(2, '0');
  const hours = String(dt.getHours()).padStart(2, '0');
  const minutes = String(dt.getMinutes()).padStart(2, '0');
  const seconds = String(dt.getSeconds()).padStart(2, '0');
  
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dayName = weekDays[dt.getDay()];
  
  return `${year}-${month}-${date} ${dayName} ${hours}:${minutes}:${seconds}`;
});

const subtitleText = computed(() => {
  return '';
});

const selectTab = (tabName) => {
  emit('update:modelValue', tabName);
};
</script>

<style scoped>
.dashboard-header {
  height: 64px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background:
    linear-gradient(90deg, rgba(3, 18, 42, 0.96), rgba(7, 38, 79, 0.98), rgba(3, 18, 42, 0.96));
  border-bottom: 1px solid rgba(67, 183, 255, 0.3);
  box-shadow: 0 4px 22px rgba(0, 8, 22, 0.45), inset 0 -1px 0 rgba(114, 231, 255, 0.12);
  position: relative;
  z-index: 10;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time-block {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8fb5d6;
  font-size: 14px;
}

.status-block {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(4, 27, 59, 0.72);
  border: 1px solid rgba(67, 183, 255, 0.24);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.status-text {
  color: var(--status-online);
}

.header-center {
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 4px;
}

.header-center h1 {
  font-size: 32px;
  margin: 0;
  min-width: 430px;
  padding: 5px 28px 7px;
  border-radius: 0 0 18px 18px;
  background:
    linear-gradient(180deg, rgba(16, 83, 154, 0.72), rgba(5, 31, 68, 0.92));
  border: 1px solid rgba(114, 231, 255, 0.58);
  box-shadow: 0 8px 28px rgba(0, 8, 22, 0.42), 0 0 24px rgba(67, 183, 255, 0.18), inset 0 0 18px rgba(67, 183, 255, 0.12);
  color: #fff !important;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.72), 0 0 22px rgba(67, 183, 255, 0.62), 0 2px 10px rgba(0, 7, 18, 0.8);
}

.subtitle {
  font-size: 12px;
  color: var(--color-text-secondary);
  letter-spacing: 4px;
  margin-top: 2px;
  text-transform: uppercase;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #8fb5d6;
  background: rgba(4, 27, 59, 0.72);
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(67, 183, 255, 0.24);
}

.metric-label {
  opacity: 0.8;
}

.metric-val {
  color: #cbeeff;
  font-weight: 600;
}

.metric-val.highlight {
  color: #72e7ff;
  text-shadow: 0 0 10px rgba(114, 231, 255, 0.36);
}

.metric-tag.green {
  color: var(--status-online);
  font-weight: bold;
}

/* Navigation bar */
.navigation-bar {
  width: 100%;
  background:
    linear-gradient(90deg, rgba(3, 16, 37, 0.78), rgba(6, 36, 75, 0.92), rgba(3, 16, 37, 0.78));
  border-bottom: 1px solid rgba(67, 183, 255, 0.24);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
  position: relative;
  z-index: 9;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  gap: 28px;
  width: min(1560px, calc(100vw - 92px));
  padding: 8px 0;
}

.nav-item {
  background: transparent;
  border: 1px solid transparent;
  color: #8fb5d6;
  min-width: 178px;
  justify-content: center;
  padding: 11px 30px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover:not(.disabled) {
  color: #eaf8ff;
  background: rgba(67, 183, 255, 0.1);
  border-color: rgba(67, 183, 255, 0.32);
  text-shadow: 0 0 10px rgba(67, 183, 255, 0.34);
}

.nav-item.active {
  color: #fff;
  background: linear-gradient(180deg, rgba(42, 162, 255, 0.78), rgba(8, 70, 142, 0.82));
  border: 1px solid rgba(118, 229, 255, 0.86);
  box-shadow: 
    0 0 16px rgba(67, 183, 255, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  text-shadow: 0 0 10px rgba(67, 183, 255, 0.34);
}

.nav-item .nav-icon,
.nav-item .nav-label {
  line-height: 1.2;
  white-space: nowrap;
}

.nav-item.active .nav-icon,
.nav-item.active .nav-label {
  color: #fff !important;
}

.nav-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1280px) {
  .nav-container {
    width: calc(100vw - 48px);
    gap: 12px;
  }

  .nav-item {
    min-width: 148px;
    font-size: 16px;
    padding-inline: 18px;
  }
}
</style>
