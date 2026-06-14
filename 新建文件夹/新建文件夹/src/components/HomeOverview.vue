<template>
  <div class="home-overview-container">
    <!-- Main Left Panel: 3D Lab Simulation -->
    <div class="main-3d-panel">
      
      <!-- Top Left Room Slogan -->
      <div class="room-slogan font-num">
        <h2>{{ currentSpace.title }}</h2>
        <p>{{ currentSpace.slogan }}</p>
      </div>

      <div class="space-switcher glass-panel font-num" aria-label="选择三维空间">
        <button
          v-for="space in spaces"
          :key="space.id"
          type="button"
          class="space-switch-item"
          :class="{ active: activeSpace === space.id }"
          @click="selectSpace(space.id)"
        >
          {{ space.shortName }}
        </button>
      </div>

      <!-- Bottom Control Layer Bar -->
      <div v-if="activeSpace === 'lab310'" class="bottom-control-bar glass-panel font-num">
        <button 
          v-for="layer in layers" 
          :key="layer.id"
          class="control-item"
          :class="{ active: activeLayer === layer.id }"
          @click="toggleLayer(layer.id)"
        >
          <span class="icon">{{ layer.icon }}</span>
          <span class="label">{{ layer.label }}</span>
        </button>
        <div class="cube-icon">🧊</div>
      </div>

      <!-- Online Personnel Widget -->
      <div v-if="activeSpace === 'lab310'" class="online-widget clickable" @click.stop="toggleOnlineUsers">
        <span class="lbl font-num">👥 在线人员</span>
        <span class="val font-num">6 <small>人</small></span>
        <div class="avatars">
          <span class="av">👥</span>
          <span class="av">👥</span>
          <span class="av">👥</span>
        </div>
      </div>

      <!-- Main Background Simulation (The Isometric Image) -->
      <div class="simulation-bg-wrapper">
        <Lab310EmbeddedViewer
          v-show="activeSpace === 'lab310'"
        />
        <RoomModelViewer
          v-if="hasOpenedRoomModel"
          v-show="activeSpace !== 'lab310'"
          :space-id="roomViewerSpace"
          :visible="activeSpace !== 'lab310'"
        />
      </div>
    </div>

    <!-- Right Sidebar Widgets -->
    <aside class="right-sidebar">
      
      <!-- 1. 实验空间 -->
      <section class="sidebar-section glass-panel">
        <div class="section-header">
          <h3>实验空间</h3>
          <span class="more-link clickable" @click="triggerModal('meeting-calendar')">查看全部 &gt;</span>
        </div>
        <div class="section-body space-cards">
          <!-- Card 1: 310 实验室 -->
          <div
            class="room-card usage font-num clickable"
            :class="{ selected: activeSpace === 'lab310' }"
            @click="navigateToDevices"
          >
            <div class="card-header-row">
              <h4>310 实验室</h4>
              <span class="badge green">使用中</span>
            </div>
            <div class="card-stats">
              <div>在线: <strong>6人</strong></div>
              <div>设备: <strong>18台</strong></div>
              <div>预约: <strong>0场</strong></div>
            </div>
          </div>

          <!-- Card 2: 401 会议室 -->
          <div
            class="room-card idle font-num clickable"
            :class="{ selected: activeSpace === 'class401' }"
            @click="selectSpace('class401')"
          >
            <div class="card-header-row">
              <h4>401 会议室</h4>
              <span class="badge blue">空间中</span>
            </div>
            <div class="card-stats">
              <div>在线: <strong>0人</strong></div>
              <div>设备: <strong>12台</strong></div>
              <div>预约: <strong>2场</strong></div>
            </div>
          </div>

          <!-- Card 3: 913 会议室 -->
          <div
            class="room-card usage font-num clickable"
            :class="{ selected: activeSpace === 'meeting913' }"
            @click="selectSpace('meeting913')"
          >
            <div class="card-header-row">
              <h4>913 会议室</h4>
              <span class="badge green">使用中</span>
            </div>
            <div class="card-stats">
              <div>在线: <strong>8人</strong></div>
              <div>设备: <strong>10台</strong></div>
              <div>预约: <strong>1场</strong></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. 设备状态 -->
      <section class="sidebar-section glass-panel">
        <div class="section-header">
          <h3>设备状态</h3>
          <span class="more-link clickable" @click="navigateToDevices">查看更多 &gt;</span>
        </div>
        <div class="section-body device-table-wrapper">
          <table class="device-status-table font-num">
            <thead>
              <tr>
                <th>设备名称</th>
                <th>位置</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr class="clickable" @click="triggerModal('device-quick-status')">
                <td>🖨️ 3D 打印机</td>
                <td>310实验室</td>
                <td><span class="status-dot busy"></span> 使用中</td>
              </tr>
              <tr>
                <td>🦾 机械臂</td>
                <td>310实验室</td>
                <td><span class="status-dot online"></span> 在线</td>
              </tr>
              <tr>
                <td>📷 高清摄像头</td>
                <td>310实验室</td>
                <td><span class="status-dot online"></span> 在线</td>
              </tr>
              <tr>
                <td>🖥️ 大屏显示系统</td>
                <td>310实验室</td>
                <td><span class="status-dot online"></span> 在线</td>
              </tr>
              <tr>
                <td>🔌 AI训练服务器</td>
                <td>310实验室</td>
                <td><span class="status-dot online"></span> 在线</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 3. 运行事件流 -->
      <section class="sidebar-section glass-panel scroll-y">
        <div class="section-header">
          <h3>实验室运行事件流</h3>
          <span class="more-link clickable" @click="triggerModal('event-logs')">查看更多 &gt;</span>
        </div>
        <div class="section-body event-list-wrapper">
          <div class="timeline-simple font-num">
            <div class="timeline-item">
              <span class="time">09:39:21</span>
              <span class="dot blue"></span>
              <span class="title">设备事件</span>
              <span class="desc text-truncate">AI训练服务器集群 - 训练任务调度启动，GPU利用率 66%</span>
              <span class="tag blue">在线</span>
            </div>
            <div class="timeline-item">
              <span class="time">09:25:14</span>
              <span class="dot green"></span>
              <span class="title">项目事件</span>
              <span class="desc text-truncate">智慧农业监测识别项目 - 完成深度模型配准与训练</span>
              <span class="tag green">进行中</span>
            </div>
            <div class="timeline-item">
              <span class="time">09:12:07</span>
              <span class="dot orange"></span>
              <span class="title">成果事件</span>
              <span class="desc text-truncate">多模态感知融合算法 - 论文被 IEEE T-ASE 接收</span>
              <span class="tag orange">已收录</span>
            </div>
            <div class="timeline-item">
              <span class="time">08:58:43</span>
              <span class="dot purple"></span>
              <span class="title">活动事件</span>
              <span class="desc text-truncate">RoboMaster 友谊培训 - 新增 12 名成员报名参与培训</span>
              <span class="tag purple">报名中</span>
            </div>
          </div>
        </div>
      </section>

    </aside>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import Lab310EmbeddedViewer from './Lab310EmbeddedViewer.vue';
import RoomModelViewer from './RoomModelViewer.vue';
import { preloadRoomModels } from './roomModelAssets';

const emit = defineEmits(['open-modal', 'toggle-online-users', 'navigate-tab']);

const activeLayer = ref('panorama');
const activeSpace = ref('lab310');
const hasOpenedRoomModel = ref(false);
const activeRoomSpace = ref('class401');
let preloadTimer = 0;
let preloadIdleId = 0;

const spaces = [
  {
    id: 'lab310',
    shortName: '310',
    title: '310 智慧实验室',
    slogan: '实 验 · 创 新 · 协 同 · 发 展'
  },
  {
    id: 'class401',
    shortName: '401',
    title: '401 会议室',
    slogan: '教 学 · 研 讨 · 协 作 · 展 示'
  },
  {
    id: 'meeting913',
    shortName: '913',
    title: '913 会议室',
    slogan: '会 议 · 汇 报 · 决 策 · 联 动'
  }
];

const currentSpace = computed(() => spaces.find((space) => space.id === activeSpace.value) || spaces[0]);
const roomViewerSpace = computed(() => activeRoomSpace.value);

const layers = [
  { id: 'panorama', icon: '👁️', label: '全景漫游' },
  { id: 'devices', icon: '💻', label: '设备图层' },
  { id: 'data', icon: '📊', label: '数据图层' },
  { id: 'alarms', icon: '⚠️', label: '告警图层' }
];

const toggleLayer = (layerId) => {
  activeLayer.value = layerId;
};

const selectSpace = (spaceId) => {
  if (spaceId !== 'lab310') {
    hasOpenedRoomModel.value = true;
    activeRoomSpace.value = spaceId;
  }
  activeSpace.value = spaceId;
};

const toggleOnlineUsers = () => {
  emit('toggle-online-users');
};

const triggerModal = (modalName) => {
  emit('open-modal', modalName);
};

const navigateToDevices = () => {
  emit('navigate-tab', 'devices');
};

const startRoomPreload = () => {
  const run = () => {
    preloadRoomModels(['class401', 'meeting913']);
  };

  if ('requestIdleCallback' in window) {
    preloadIdleId = window.requestIdleCallback(run, { timeout: 3000 });
    return;
  }

  preloadTimer = window.setTimeout(run, 1800);
};

onMounted(() => {
  preloadTimer = window.setTimeout(startRoomPreload, 1200);
});

onUnmounted(() => {
  if (preloadTimer) window.clearTimeout(preloadTimer);
  if (preloadIdleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(preloadIdleId);
});
</script>

<style scoped>
.home-overview-container {
  display: flex;
  gap: 18px;
  padding: 8px 18px 16px;
  height: calc(100vh - 106px);
  width: 100%;
}

.main-3d-panel {
  flex: 1;
  position: relative;
  background: transparent;
  border: 0 !important;
  border-radius: 0;
  box-shadow: none !important;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.room-slogan {
  position: absolute;
  top: 28px;
  left: 28px;
  z-index: 5;
}

.room-slogan h2 {
  font-size: 30px;
  color: #fff;
  font-weight: 800;
  text-shadow: 0 0 14px rgba(120, 211, 255, 0.82), 0 2px 8px rgba(0, 20, 60, 0.24);
}

.room-slogan p {
  font-size: 13px;
  color: #fff;
  letter-spacing: 6px;
  margin-top: 4px;
  text-shadow: 0 0 10px rgba(120, 211, 255, 0.62);
}

.space-switcher {
  position: absolute;
  top: 104px;
  left: 28px;
  z-index: 6;
  display: flex;
  gap: 6px;
  padding: 5px;
  border-radius: 6px;
  background: rgba(5, 44, 103, 0.64);
}

.space-switch-item {
  min-width: 54px;
  height: 30px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: rgba(226, 246, 255, 0.72);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.space-switch-item:hover {
  color: #fff;
  background: rgba(56, 189, 248, 0.12);
}

.space-switch-item.active {
  color: #fff;
  border-color: rgba(56, 189, 248, 0.72);
  background: rgba(0, 168, 255, 0.24);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.24);
}

.online-widget {
  position: absolute;
  top: 26px;
  right: 28px;
  background: rgba(17, 97, 170, 0.36);
  border: 1px solid rgba(25, 112, 190, 0.5);
  padding: 8px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 5;
  box-shadow: inset 0 0 10px rgba(0, 102, 190, 0.16), 0 8px 20px rgba(10, 69, 130, 0.12);
  transition: all 0.2s;
}

.online-widget:hover {
  background: rgba(17, 97, 170, 0.46);
  border-color: var(--color-border-active);
}

.online-widget .lbl {
  font-size: 15px;
  color: #fff;
  text-shadow: 0 0 8px rgba(120, 211, 255, 0.52);
}

.online-widget .val {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 10px rgba(120, 211, 255, 0.64);
}

.online-widget .val small {
  font-size: 11px;
  font-weight: normal;
  color: #fff;
}

.online-widget .avatars {
  display: flex;
  gap: 2px;
  color: #fff;
}

.simulation-bg-wrapper {
  position: absolute;
  inset: -18px 0 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Control Layer Bar */
.bottom-control-bar {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  padding: 6px;
  border-radius: 6px;
  z-index: 5;
  background: rgba(5, 44, 103, 0.72);
}

.control-item {
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-text-secondary);
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  transition: all 0.2s;
}

.control-item:hover {
  background: rgba(0, 168, 255, 0.1);
  color: #fff;
}

.control-item.active {
  background: rgba(0, 168, 255, 0.25);
  border-color: var(--color-border-active);
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.2);
}

.cube-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  font-size: 16px;
  cursor: pointer;
}

/* Mascot */
.mascot-platform-wrapper {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 15%;
  height: 18%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.glowing-platform {
  position: absolute;
  bottom: 0;
  width: 70%;
  height: 15%;
  background: radial-gradient(ellipse at center, rgba(56, 189, 248, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse-glow 2s infinite;
}

.mascot-img {
  width: 80%;
  height: auto;
  transform: translateY(-8px);
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(0, 168, 255, 0.5));
}

@keyframes float {
  0%, 100% { transform: translateY(-8px); }
  50% { transform: translateY(-16px); }
}

/* Sidebar Styling */
.right-sidebar {
  width: 405px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.sidebar-section {
  padding: 18px;
  display: flex;
  flex-direction: column;
}

.sidebar-section.scroll-y {
  flex-grow: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  font-size: 17px;
  color: #fff;
  font-weight: bold;
  letter-spacing: 1px;
}

.more-link {
  font-size: 13px;
  color: #38bdf8;
}

.space-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.room-card {
  padding: 14px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
  background: rgba(255,255,255,0.01);
}

.room-card.clickable:hover {
  border-color: var(--color-border-active);
  background: rgba(0, 168, 255, 0.04);
}

.room-card.selected {
  border-color: rgba(56, 189, 248, 0.78);
  background: rgba(0, 168, 255, 0.1);
  box-shadow: inset 0 0 18px rgba(56, 189, 248, 0.08), 0 0 14px rgba(56, 189, 248, 0.1);
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-header-row h4 {
  font-size: 16px;
  color: #fff;
}

.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
}

.badge.green {
  background: rgba(16, 185, 129, 0.15);
  color: var(--status-online);
}

.badge.blue {
  background: rgba(59, 130, 246, 0.15);
  color: var(--status-info);
}

.card-stats {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.card-stats strong {
  color: #fff;
}

/* Device table styles */
.device-table-wrapper {
  overflow-x: auto;
}

.device-status-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: left;
}

.device-status-table th {
  padding: 8px 8px;
  color: var(--color-text-secondary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-weight: normal;
}

.device-status-table td {
  padding: 11px 8px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.03);
  color: #fff;
}

.device-status-table tr.clickable:hover {
  background: rgba(0, 168, 255, 0.05);
}

/* Event log stream styles */
.event-list-wrapper {
  flex-grow: 1;
}

.timeline-simple {
  position: relative;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding-left: 15px;
  margin-left: 5px;
}

.timeline-item {
  position: relative;
  margin-bottom: 18px;
  font-size: 12px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-item .dot {
  position: absolute;
  left: -20px;
  top: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--bg-dark);
}

.timeline-item .dot.blue { background-color: var(--status-info); }
.timeline-item .dot.green { background-color: var(--status-online); }
.timeline-item .dot.orange { background-color: var(--status-busy); }
.timeline-item .dot.purple { background-color: var(--status-purple); }

.timeline-item .time {
  color: var(--color-text-secondary);
  font-size: 11px;
  display: block;
}

.timeline-item .title {
  color: #fff;
  font-weight: bold;
  display: inline-block;
  margin-right: 6px;
}

.timeline-item .desc {
  color: var(--color-text-secondary);
}

.timeline-item .tag {
  float: right;
  font-size: 10px;
  padding: 0 4px;
  border-radius: 2px;
}

.timeline-item .tag.blue { background: rgba(59,130,246,0.15); color: #60a5fa; }
.timeline-item .tag.green { background: rgba(16,185,129,0.15); color: #34d399; }
.timeline-item .tag.orange { background: rgba(245,158,11,0.15); color: #fbbf24; }
.timeline-item .tag.purple { background: rgba(139,92,246,0.15); color: #a78bfa; }

.text-truncate {
  display: inline-block;
  max-width: 210px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}

@media (max-width: 900px) {
  .home-overview-container {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 106px);
    overflow-y: auto;
  }

  .main-3d-panel {
    flex: none;
    width: 100%;
    min-height: 560px;
  }

  .simulation-bg-wrapper {
    inset: -8px 0 0;
  }

  .room-slogan {
    top: 22px;
    left: 18px;
  }

  .room-slogan h2 {
    font-size: 24px;
  }

  .room-slogan p {
    font-size: 12px;
    letter-spacing: 3px;
  }

  .space-switcher {
    top: 92px;
    left: 18px;
  }

  .online-widget {
    top: 148px;
    left: 18px;
    right: auto;
  }

  .bottom-control-bar {
    width: calc(100% - 36px);
    justify-content: center;
    flex-wrap: wrap;
  }

  .right-sidebar {
    width: 100%;
    overflow-y: visible;
  }

  .text-truncate {
    max-width: 180px;
  }
}
</style>
