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
      <p class="subtitle">{{ subtitleText }}</p>
    </div>

    <div class="header-right">
      <div class="metric-item">
        <span class="metric-icon">🌡️</span>
        <span class="metric-label">室内</span>
        <span class="metric-val font-num">24℃</span>
      </div>
      <div class="metric-item">
        <span class="metric-icon">💧</span>
        <span class="metric-label">湿度</span>
        <span class="metric-val font-num">58%</span>
      </div>
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
      
      <button 
        class="nav-item hidden-mobile"
        :class="{ active: modelValue === 'ai-assistant' }"
        @click="selectTab('ai-assistant')"
      >
        <span class="nav-icon">🤖</span>
        <span class="nav-label">AI助手</span>
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
  if (props.modelValue === 'devices') {
    return '空间孪生 · 成果赋能 · 设备高效 · AI驱动';
  }
  return '空间管控 · 成果赋能 · 设备态势 · AI驱动';
});

const selectTab = (tabName) => {
  emit('update:modelValue', tabName);
};
</script>

<style scoped>
.dashboard-header {
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: linear-gradient(180deg, rgba(6, 18, 45, 0.9) 0%, rgba(3, 8, 22, 0.4) 100%);
  border-bottom: 1px solid rgba(0, 168, 255, 0.2);
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
  color: var(--color-text-secondary);
  font-size: 14px;
}

.status-block {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
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
  top: 6px;
}

.header-center h1 {
  font-size: 24px;
  margin: 0;
  background: linear-gradient(180deg, #ffffff 30%, #a5d8ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 11px;
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
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.03);
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.metric-label {
  opacity: 0.8;
}

.metric-val {
  color: #fff;
  font-weight: 600;
}

.metric-val.highlight {
  color: #38bdf8;
  text-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
}

.metric-tag.green {
  color: var(--status-online);
  font-weight: bold;
}

/* Navigation bar */
.navigation-bar {
  width: 100%;
  background: rgba(2, 6, 20, 0.7);
  border-bottom: 1px solid rgba(0, 168, 255, 0.15);
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 9;
}

.nav-container {
  display: flex;
  gap: 20px;
  padding: 8px 0;
}

.nav-item {
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-text-secondary);
  padding: 8px 24px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover:not(.disabled) {
  color: #fff;
  background: rgba(0, 168, 255, 0.1);
  border-color: rgba(0, 168, 255, 0.25);
  text-shadow: 0 0 10px rgba(0, 168, 255, 0.4);
}

.nav-item.active {
  color: #fff;
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.4) 0%, rgba(0, 168, 255, 0.1) 100%);
  border: 1px solid rgba(0, 168, 255, 0.6);
  box-shadow: 
    0 0 15px rgba(0, 168, 255, 0.25),
    inset 0 0 8px rgba(0, 168, 255, 0.15);
  text-shadow: 0 0 10px rgba(0, 168, 255, 0.4);
}

.nav-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hidden-mobile {
  @media (max-width: 1024px) {
    display: none;
  }
}
</style>
