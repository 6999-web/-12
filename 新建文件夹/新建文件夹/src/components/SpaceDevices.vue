<template>
  <div class="space-devices-container">
    
    <!-- Left Sidebar -->
    <aside class="left-sidebar">
      <!-- 空间选择 -->
      <section class="sidebar-section glass-panel">
        <div class="section-header">
          <h3>空间选择</h3>
        </div>
        <div class="section-body space-list">
          <div 
            v-for="space in spaces" 
            :key="space.name" 
            class="space-select-card font-num"
            :class="{ active: selectedSpace === space.name }"
            @click="selectedSpace = space.name"
          >
            <div class="header-row">
              <h4>{{ space.name }}</h4>
              <span class="status-lbl" :class="space.statusClass">{{ space.statusText }}</span>
            </div>
            <div class="stats-row">
              <span>👤 在线: <strong>{{ space.people }}</strong></span>
              <span>💻 设备: <strong>{{ space.devices }}</strong></span>
              <span>📅 预约: <strong>{{ space.meetings }}</strong></span>
            </div>
          </div>
        </div>
      </section>

      <!-- 会议室状态 -->
      <section class="sidebar-section glass-panel">
        <div class="section-header">
          <h3>会议室状态</h3>
        </div>
        <div class="section-body meeting-room-status-list">
          <!-- 401 -->
          <div class="meeting-room-card font-num">
            <div class="room-title">
              <h4>401 会议室</h4>
              <span class="status-dot online"></span>
              <span class="status-lbl green">空闲</span>
            </div>
            <div class="metrics">
              <span>🌡️ 20℃</span>
              <span>💧 45%</span>
              <span>🍃 优 32</span>
            </div>
            <button class="btn-detail" @click="triggerModal('space-details')">查看详情</button>
          </div>
          <!-- 913 -->
          <div class="meeting-room-card font-num">
            <div class="room-title">
              <h4>913 会议室</h4>
              <span class="status-dot busy"></span>
              <span class="status-lbl orange">待使用</span>
            </div>
            <div class="metrics">
              <span>🌡️ 21℃</span>
              <span>💧 46%</span>
              <span>🍃 优 35</span>
            </div>
            <button class="btn-detail" @click="triggerModal('space-details')">查看详情</button>
          </div>
        </div>
      </section>
    </aside>

    <!-- Center Section: 9 Cameras -->
    <main class="center-surveillance glass-panel">
      <div class="panel-header">
        <h3>实时监控画面</h3>
        <span class="subtext">点击画面可查看详情</span>
      </div>
      <div class="surveillance-grid">
        <div 
          v-for="cam in cameras" 
          :key="cam.id" 
          class="camera-card clickable"
          @click="triggerModal('space-details')"
        >
          <!-- Camera Feed simulated using image asset or CSS overlay -->
          <div class="camera-feed-box">
            <img src="/assets/image6.png" alt="监控图" class="camera-img" style="opacity: 0.15; object-fit: cover; background-color: #0d1f4d;" />
            <div class="feed-overlay-noise"></div>
            
            <div class="cam-header font-num">
              <span class="status-dot" :class="cam.statusClass"></span>
              <span class="name">{{ cam.name }}</span>
              <span class="status font-num">{{ cam.status }}</span>
            </div>
            
            <div class="cam-footer font-num">
              <span>点击查看</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Right Sidebar -->
    <aside class="right-sidebar">
      <!-- 设备状态摘要 -->
      <section class="sidebar-section glass-panel">
        <div class="section-header">
          <h3>设备状态摘要</h3>
        </div>
        <div class="section-body donut-chart-container font-num">
          <div class="donut-chart-wrapper">
            <div class="donut-chart">
              <div class="center-txt">
                <span class="num">96</span>
                <span class="lbl">总设备</span>
              </div>
            </div>
            <div class="donut-legend">
              <div class="legend-item"><span class="bullet green"></span> 在线: 68 <small>(70.8%)</small></div>
              <div class="legend-item"><span class="bullet orange"></span> 使用中: 14 <small>(14.6%)</small></div>
              <div class="legend-item"><span class="bullet blue"></span> 空闲: 10 <small>(10.4%)</small></div>
              <div class="legend-item"><span class="bullet red"></span> 异常: 4 <small>(4.2%)</small></div>
            </div>
          </div>
          <div class="link-row" style="text-align: right; margin-top:10px;">
            <span class="more-link clickable" @click="triggerModal('device-full-details')">查看全部设备 &gt;</span>
          </div>
        </div>
      </section>

      <!-- 今日会议安排 -->
      <section class="sidebar-section glass-panel">
        <div class="section-header">
          <h3>今日会议安排</h3>
          <button class="btn-calendar" @click="triggerModal('meeting-calendar')">📅 点击查看日历</button>
        </div>
        <div class="section-body schedule-list font-num">
          <div class="schedule-item current">
            <div class="time">10:00 - 11:30</div>
            <div class="title">智能算法团队例会</div>
            <div class="location">📍 310实验室</div>
            <span class="tag green">进行中</span>
          </div>
          <div class="schedule-item">
            <div class="time">14:00 - 15:30</div>
            <div class="title">项目评审会</div>
            <div class="location">📍 401会议室</div>
            <span class="tag blue">已预约</span>
          </div>
          <div class="schedule-item">
            <div class="time">16:00 - 17:30</div>
            <div class="title">产品需求讨论会</div>
            <div class="location">📍 913会议室</div>
            <span class="tag orange">待开始</span>
          </div>
          <div class="link-row" style="text-align: right; margin-top:10px;">
            <span class="more-link clickable" @click="triggerModal('meeting-calendar')">查看全部会议 &gt;</span>
          </div>
        </div>
      </section>

      <!-- 空间告警中心 -->
      <section class="sidebar-section glass-panel alarm-section">
        <div class="section-header">
          <h3>空间告警中心</h3>
          <span class="more-link">更多告警 &gt;</span>
        </div>
        <div class="section-body alarm-body font-num">
          <!-- Alarm Stats icons -->
          <div class="alarm-stats">
            <div class="stat-icon-box yellow">
              <span>📹 离线</span>
              <strong>1</strong>
            </div>
            <div class="stat-icon-box red">
              <span>🔧 故障</span>
              <strong>2</strong>
            </div>
            <div class="stat-icon-box orange">
              <span>🌡️ 异常</span>
              <strong>3</strong>
            </div>
            <div class="stat-icon-box yellow">
              <span>📅 冲突</span>
              <strong>1</strong>
            </div>
            <div class="stat-icon-box blue">
              <span>📝 待办</span>
              <strong>5</strong>
            </div>
          </div>
          
          <!-- Alarm List -->
          <ul class="alarm-list">
            <li>
              <span class="time">10:28</span>
              <span class="name text-highlight">摄像头-06 离线</span>
              <span class="loc">1楼 设备间</span>
            </li>
            <li>
              <span class="time">10:15</span>
              <span class="name text-highlight">实验设备-17 温度异常</span>
              <span class="loc">310实验室</span>
            </li>
            <li>
              <span class="time">09:56</span>
              <span class="name text-highlight">401 会议室时间冲突</span>
              <span class="loc">401会议室</span>
            </li>
          </ul>
          
          <div class="link-row" style="text-align: right; margin-top:10px;">
            <span class="more-link">查看全部告警 &gt;</span>
          </div>
        </div>
      </section>
    </aside>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['open-modal']);

const selectedSpace = ref('310实验室');

const triggerModal = (modalName) => {
  emit('open-modal', modalName);
};

const spaces = [
  { name: '310实验室', statusText: '使用中', statusClass: 'green', people: 12, devices: 28, meetings: 5 },
  { name: '401会议室', statusText: '空闲', statusClass: 'blue', people: 0, devices: 6, meetings: 3 },
  { name: '913会议室', statusText: '待使用', statusClass: 'orange', people: 0, devices: 5, meetings: 2 },
  { name: '全部空间', statusText: '总览', statusClass: 'gray', people: 26, devices: 96, meetings: 15 }
];

const cameras = [
  { id: 1, name: '摄像头-01', status: '在线', statusClass: 'online' },
  { id: 2, name: '摄像头-02', status: '在线', statusClass: 'online' },
  { id: 3, name: '摄像头-03', status: '使用中', statusClass: 'busy' },
  { id: 4, name: '摄像头-04', status: '在线', statusClass: 'online' },
  { id: 5, name: '摄像头-05', status: '在线', statusClass: 'online' },
  { id: 6, name: '摄像头-06', status: '离线', statusClass: 'offline' },
  { id: 7, name: '摄像头-07', status: '在线', statusClass: 'online' },
  { id: 8, name: '摄像头-08', status: '使用中', statusClass: 'busy' },
  { id: 9, name: '摄像头-09', status: '在线', statusClass: 'online' }
];
</script>

<style scoped>
.space-devices-container {
  display: flex;
  gap: 16px;
  padding: 16px;
  height: calc(100vh - 110px);
  width: 100%;
}

.left-sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-sidebar {
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.center-surveillance {
  flex: 1;
  background: var(--bg-panel);
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.sidebar-section {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  font-size: 14px;
  color: #fff;
  font-weight: bold;
}

.more-link {
  font-size: 11px;
  color: #38bdf8;
  cursor: pointer;
}

.space-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.space-select-card {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255,255,255,0.01);
  cursor: pointer;
  transition: all 0.2s;
}

.space-select-card:hover {
  border-color: rgba(0, 168, 255, 0.2);
  background: rgba(0, 168, 255, 0.02);
}

.space-select-card.active {
  border-color: var(--color-border-active);
  background: rgba(0, 168, 255, 0.06);
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.1);
}

.space-select-card .header-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.space-select-card h4 {
  font-size: 13px;
  color: #fff;
}

.status-lbl {
  font-size: 10px;
  padding: 0 4px;
  border-radius: 2px;
}

.status-lbl.green { background: rgba(16, 185, 129, 0.15); color: var(--status-online); }
.status-lbl.blue { background: rgba(59, 130, 246, 0.15); color: var(--status-info); }
.status-lbl.orange { background: rgba(245, 158, 11, 0.15); color: var(--status-busy); }
.status-lbl.gray { background: rgba(255,255,255,0.1); color: var(--color-text-secondary); }

.space-select-card .stats-row {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-text-secondary);
}

.space-select-card .stats-row strong {
  color: #fff;
}

/* Meeting room card */
.meeting-room-status-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meeting-room-card {
  padding: 10px;
  border-radius: 6px;
  background: rgba(255,255,255,0.01);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.meeting-room-card .room-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.meeting-room-card h4 {
  font-size: 13px;
  color: #fff;
}

.meeting-room-card .status-lbl {
  margin-left: auto;
}

.meeting-room-card .metrics {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--color-text-secondary);
  margin: 6px 0;
}

.btn-detail {
  width: 100%;
  background: rgba(0, 168, 255, 0.05);
  border: 1px solid var(--color-border);
  color: #fff;
  padding: 4px 0;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-detail:hover {
  background: rgba(0, 168, 255, 0.15);
  border-color: var(--color-border-active);
}

/* Surveillance camera grid */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 15px;
}

.panel-header h3 {
  font-size: 16px;
  color: #fff;
}

.panel-header .subtext {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.surveillance-grid {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 12px;
}

.camera-card {
  border: 1px solid rgba(0, 168, 255, 0.15);
  border-radius: 6px;
  background: #020617;
  overflow: hidden;
  position: relative;
}

.camera-card:hover {
  border-color: var(--color-border-active);
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.2);
}

.camera-feed-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.camera-img {
  width: 100%;
  height: 100%;
}

.feed-overlay-noise {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  background-size: 100% 4px, 6px 100%;
  pointer-events: none;
}

.cam-header {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
}

.cam-header .name {
  color: #fff;
  font-weight: 500;
}

.cam-header .status {
  margin-left: auto;
  font-size: 10px;
}

.cam-header .status-dot.online { color: var(--status-online); background: var(--status-online); }
.cam-header .status-dot.busy { color: var(--status-busy); background: var(--status-busy); }
.cam-header .status-dot.offline { color: var(--status-offline); background: var(--status-offline); }

.cam-footer {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 9px;
  background: rgba(0,0,0,0.6);
  padding: 1px 6px;
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.camera-card:hover .cam-footer {
  opacity: 1;
}

/* Donut container */
.donut-chart-container {
  display: flex;
  flex-direction: column;
}

.donut-chart-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
}

.donut-chart {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: conic-gradient(
    var(--status-online) 0% 70.8%,
    var(--status-busy) 70.8% 85.4%,
    var(--status-info) 85.4% 95.8%,
    var(--status-alert) 95.8% 100%
  );
  position: relative;
}

.donut-chart::before {
  content: '';
  position: absolute;
  top: 8px; left: 8px; right: 8px; bottom: 8px;
  border-radius: 50%;
  background: var(--bg-modal);
}

.center-txt {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.center-txt .num { font-size: 18px; font-weight: bold; color:#fff;}
.center-txt .lbl { font-size: 9px; color: var(--color-text-secondary); }

.donut-legend {
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.donut-legend .legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
}

.donut-legend .bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.donut-legend .bullet.green { background: var(--status-online); }
.donut-legend .bullet.orange { background: var(--status-busy); }
.donut-legend .bullet.blue { background: var(--status-info); }
.donut-legend .bullet.red { background: var(--status-alert); }

.donut-legend small {
  margin-left: auto;
  opacity: 0.7;
}

/* Today schedule */
.btn-calendar {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid var(--color-border);
  color: #38bdf8;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-calendar:hover {
  background: rgba(56, 189, 248, 0.2);
  border-color: var(--color-border-active);
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.schedule-item {
  background: rgba(255,255,255,0.01);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 3px solid rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 2px 4px 4px 2px;
  position: relative;
  font-size: 11px;
}

.schedule-item.current {
  border-left-color: var(--status-online);
  background: rgba(16, 185, 129, 0.02);
}

.schedule-item .time {
  color: var(--color-text-secondary);
  font-size: 9px;
}

.schedule-item .title {
  font-weight: bold;
  color: #fff;
  margin: 2px 0;
}

.schedule-item .location {
  color: var(--color-text-secondary);
}

.schedule-item .tag {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 9px;
}

.schedule-item .tag.green { background: rgba(16, 185, 129, 0.15); color: var(--status-online); }
.schedule-item .tag.blue { background: rgba(59, 130, 246, 0.15); color: var(--status-info); }
.schedule-item .tag.orange { background: rgba(245, 158, 11, 0.15); color: var(--status-busy); }

/* Alarm panel */
.alarm-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-icon-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255,255,255,0.01);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 4px;
  padding: 6px 0;
}

.stat-icon-box.yellow { border-color: rgba(245, 158, 11, 0.2); }
.stat-icon-box.red { border-color: rgba(239, 68, 68, 0.2); }
.stat-icon-box.orange { border-color: rgba(245, 158, 11, 0.2); }
.stat-icon-box.blue { border-color: rgba(59, 130, 246, 0.2); }

.stat-icon-box span { font-size: 8px; color: var(--color-text-secondary); }
.stat-icon-box strong { font-size: 13px; color: #fff; margin-top: 2px; }

.alarm-list {
  list-style: none;
  font-size: 10px;
}

.alarm-list li {
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
}

.alarm-list li:last-child {
  border-bottom: none;
}

.alarm-list .time {
  color: var(--color-text-secondary);
  width: 40px;
}

.alarm-list .name {
  color: #fff;
  flex-grow: 1;
}

.alarm-list .loc {
  color: var(--color-text-secondary);
  font-size: 9px;
}
</style>
