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
        </div>
        <div class="section-body space-cards">
          <div
            v-for="space in spaces"
            :key="space.id"
            class="room-card usage font-num clickable"
            :class="{ selected: activeSpace === space.id }"
            @click="openSpaceDetail(space.id)"
          >
            <div class="card-header-row">
              <h4>{{ space.label }}</h4>
              <span class="badge" :class="space.statusClass">{{ space.statusText }}</span>
            </div>
            <div class="card-stats">
              <div>在线: <strong>{{ space.people }}人</strong></div>
              <div>设备: <strong>{{ space.devices }}台</strong></div>
              <div>预约: <strong>{{ space.meetings }}场</strong></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. 设备状态 -->
      <section class="sidebar-section glass-panel">
        <div class="section-header">
          <h3>设备状态</h3>
          <span class="more-link clickable" @click="openDetailView('device-list')">查看更多 &gt;</span>
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
              <tr
                v-for="printer in printerDeviceRows"
                :key="printer.id"
                class="clickable"
                @click="openDeviceDetail(printer.id)"
              >
                <td>🖨️ {{ printer.name }}</td>
                <td>{{ printer.location }}</td>
                <td><span class="status-dot" :class="printer.statusClass"></span> {{ printer.statusText }}</td>
              </tr>
              <tr
                v-for="device in overviewDeviceRows"
                :key="device.id"
                class="clickable"
                @click="openDeviceDetail(device.id)"
              >
                <td>{{ device.name }}</td>
                <td>{{ device.location }}</td>
                <td><span class="status-dot" :class="device.statusClass"></span> {{ device.statusText }}</td>
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

    <div v-if="activeDetailView !== 'none'" class="home-detail-layer" @click.self="closeDetailView">
      <section class="home-detail-panel glass-panel font-num">
        <div class="home-detail-header">
          <div>
            <span class="detail-kicker">{{ detailTitle.kicker }}</span>
            <h3>{{ detailTitle.title }}</h3>
          </div>
          <button type="button" class="detail-close" aria-label="关闭详情" @click="closeDetailView">×</button>
        </div>

        <div v-if="activeDetailView === 'space-list'" class="detail-space-grid">
          <article
            v-for="space in spaces"
            :key="space.id"
            class="detail-space-card"
            @click.stop="openSpaceDetail(space.id)"
          >
            <div class="detail-card-top">
              <h4>{{ space.label }}</h4>
              <span class="badge" :class="space.statusClass">{{ space.statusText }}</span>
            </div>
            <div class="detail-metrics">
              <div><span>在线人员</span><strong>{{ space.people }}人</strong></div>
              <div><span>设备数量</span><strong>{{ space.devices }}台</strong></div>
              <div><span>今日预约</span><strong>{{ space.meetings }}场</strong></div>
            </div>
            <p>{{ space.slogan }}</p>
          </article>
        </div>

        <div v-else-if="activeDetailView === 'space-detail'" class="space-detail-page">
          <div class="space-detail-dashboard">
            <section class="space-detail-hero-grid">
              <img :src="selectedSpaceDetailMeta.image" :alt="selectedDetailSpace.label" class="space-detail-cover" />
              <div class="space-detail-title-block">
                <div class="space-title-row">
                  <h4>{{ selectedDetailSpace.label }}</h4>
                  <span class="badge" :class="selectedDetailSpace.statusClass">{{ selectedDetailSpace.statusText }}</span>
                </div>
                <div class="space-hero-stats">
                  <div><span>容纳人数</span><strong>{{ selectedDetailSpace.capacity }}</strong><em>人</em></div>
                  <div><span>设备数量</span><strong>{{ selectedDetailSpace.devices }}</strong><em>台</em></div>
                  <div><span>今日预约数</span><strong>{{ selectedDetailSpace.meetings }}</strong><em>场</em></div>
                </div>
              </div>
              <div class="space-state-card">
                <div class="space-state-row">
                  <span>当前状态</span>
                  <strong><span class="status-dot" :class="selectedSpaceDetailMeta.stateClass"></span>{{ selectedDetailSpace.statusText }}</strong>
                </div>
                <div class="space-state-row">
                  <span>在线人数</span>
                  <strong>{{ selectedDetailSpace.people }} 人</strong>
                </div>
                <div class="space-avatar-row">
                  <span v-for="person in selectedDetailSpace.personnel.slice(0, 5)" :key="person.name">{{ person.name.slice(0, 1) }}</span>
                  <em v-if="selectedDetailSpace.people > 5">+{{ selectedDetailSpace.people - 5 }}</em>
                </div>
              </div>
              <div class="space-meeting-card">
                <h5>当前会议</h5>
                <p>{{ selectedSpaceDetailMeta.currentMeeting.title }}</p>
                <span>{{ selectedSpaceDetailMeta.currentMeeting.time }}</span>
                <h5>下一场会议</h5>
                <p>{{ selectedSpaceDetailMeta.nextMeeting.title }}</p>
                <span>{{ selectedSpaceDetailMeta.nextMeeting.time }}</span>
              </div>
            </section>

            <section class="space-intro-card">
              <h5>空间简介</h5>
              <p>{{ selectedSpaceDetailMeta.description }}</p>
            </section>

            <section class="space-visual-grid">
              <div class="space-plan-card">
                <h5>空间平面图</h5>
                <div class="space-blueprint">
                  <div class="blueprint-room">
                    <span class="blueprint-table"></span>
                    <span v-for="index in 12" :key="index" class="blueprint-seat"></span>
                  </div>
                </div>
              </div>
              <div class="space-monitor-card">
                <h5>监控预览</h5>
                <div class="monitor-preview-strip">
                  <article v-for="camera in selectedSpaceCameras" :key="camera.name">
                    <img :src="camera.image" :alt="camera.name" />
                    <span>{{ camera.name }}</span>
                  </article>
                </div>
              </div>
            </section>

            <section class="space-bottom-dashboard">
              <div class="space-info-panel">
                <h5>今日安排</h5>
                <ul class="space-schedule-list">
                  <li v-for="item in selectedSpaceSchedules" :key="item.time">
                    <span>{{ item.time }}</span>
                    <strong>{{ item.title }}</strong>
                    <em :class="item.className">{{ item.status }}</em>
                  </li>
                </ul>
              </div>
              <div class="space-info-panel">
                <h5>空间设备概况</h5>
                <div class="space-device-overview">
                  <div class="mini-donut"></div>
                  <ul>
                    <li v-for="item in selectedSpaceDeviceOverview" :key="item.label">
                      <span :class="item.className"></span>{{ item.label }} <strong>{{ item.count }} 台</strong>
                    </li>
                  </ul>
                </div>
                <div class="space-device-total">总计 <strong>{{ selectedDetailSpace.devices }}</strong> 台</div>
              </div>
              <div class="space-info-panel">
                <h5>可用设备</h5>
                <ul class="available-device-list">
                  <li v-for="device in selectedSpaceAvailableDevices" :key="device.name">
                    <span>{{ device.name }}</span>
                    <strong>{{ device.statusText }}</strong>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        <div v-else-if="activeDetailView === 'device-list'" class="device-detail-page">
          <table class="device-status-table detail-device-table">
            <thead>
              <tr>
                <th>设备名称</th>
                <th>类型</th>
                <th>位置</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="device in allDeviceRows"
                :key="device.id"
                class="clickable"
                @click="openDeviceDetail(device.id)"
              >
                <td>{{ device.name }}</td>
                <td>{{ device.type }}</td>
                <td>{{ device.location }}</td>
                <td><span class="status-dot" :class="device.statusClass"></span> {{ device.statusText }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="activeDetailView === 'device-detail'" class="device-single-page">
          <button type="button" class="detail-back" @click="openDetailView('device-list')">&lt; 返回设备列表</button>

          <div v-if="selectedDevice" class="device-single-layout">
            <section class="device-hero-card">
              <div class="device-visual">
                <span>{{ selectedDevice.icon || '设备' }}</span>
              </div>
              <div class="device-hero-info">
                <span class="detail-kicker">{{ selectedDevice.type }}</span>
                <h4>{{ selectedDevice.name }}</h4>
                <p>{{ selectedDevice.location }}</p>
                <div class="device-status-line">
                  <span class="status-dot" :class="selectedDevice.statusClass"></span>
                  <strong>{{ selectedDevice.statusText }}</strong>
                </div>
              </div>
            </section>

            <template v-if="selectedDevice.kind === 'printer'">
              <section class="printer-real-grid">
                <div class="summary-card">
                  <span>累计打印</span>
                  <strong>{{ selectedDevice.prints }} 次</strong>
                </div>
                <div class="summary-card">
                  <span>时间准确率</span>
                  <strong>{{ selectedDevice.accuracy }}%</strong>
                </div>
                <div class="summary-card">
                  <span>打印占比</span>
                  <strong>{{ selectedDevice.share }}%</strong>
                </div>
                <div class="summary-card">
                  <span>总打印时长</span>
                  <strong>{{ printerSummary.totalHours }}h</strong>
                </div>
              </section>

              <section class="device-info-grid">
                <div>
                  <h5>真实打印机状态</h5>
                  <dl>
                    <div><dt>设备编号</dt><dd>{{ selectedDevice.id }}</dd></div>
                    <div><dt>品牌型号</dt><dd>{{ selectedDevice.model }}</dd></div>
                    <div><dt>当前状态</dt><dd>{{ selectedDevice.statusText }}</dd></div>
                    <div><dt>总打印次数</dt><dd>{{ printerSummary.totalPrints }} 次</dd></div>
                    <div><dt>成功 / 失败</dt><dd>{{ printerSummary.successful }} / {{ printerSummary.failed }}</dd></div>
                    <div><dt>耗材 / 成本</dt><dd>{{ printerSummary.totalFilament }}g / ¥{{ printerSummary.totalCost }}</dd></div>
                  </dl>
                </div>
                <div>
                  <h5>耗材类型统计</h5>
                  <div class="filament-grid compact">
                    <div v-for="item in filamentStats" :key="item.name" class="filament-pill">
                      <span>{{ item.name }}</span>
                      <strong>{{ item.count }}</strong>
                    </div>
                    <div v-if="!filamentStats.length" class="filament-pill">
                      <span>暂无耗材数据</span>
                      <strong>--</strong>
                    </div>
                  </div>
                </div>
              </section>
            </template>

            <section v-else class="device-info-grid">
              <div>
                <h5>基础信息</h5>
                <dl>
                  <div><dt>设备编号</dt><dd>{{ selectedDevice.id }}</dd></div>
                  <div><dt>设备类型</dt><dd>{{ selectedDevice.type }}</dd></div>
                  <div><dt>所属空间</dt><dd>{{ selectedDevice.location }}</dd></div>
                  <div><dt>当前状态</dt><dd>{{ selectedDevice.statusText }}</dd></div>
                </dl>
              </div>
              <div>
                <h5>运行情况</h5>
                <dl>
                  <div><dt>网络状态</dt><dd>正常</dd></div>
                  <div><dt>巡检结果</dt><dd>无异常</dd></div>
                  <div><dt>最近同步</dt><dd>实时采集</dd></div>
                  <div><dt>维护状态</dt><dd>按计划运行</dd></div>
                </dl>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import Lab310EmbeddedViewer from './Lab310EmbeddedViewer.vue';
import RoomModelViewer from './RoomModelViewer.vue';
import { LAB_SPACES, STATIC_DEVICE_ROWS } from './labOverviewData';
import { fetchPrinterDashboard, getPrinterCards } from './printerDashboard';
import { preloadRoomModels } from './roomModelAssets';

const emit = defineEmits(['open-modal', 'toggle-online-users', 'navigate-tab']);

const activeLayer = ref('panorama');
const activeSpace = ref('lab310');
const hasOpenedRoomModel = ref(false);
const activeRoomSpace = ref('class401');
const activeDetailView = ref('none');
const selectedDetailSpaceId = ref('lab310');
const selectedDeviceId = ref('');
const printerDashboard = ref(null);
const printerLoading = ref(true);
const printerError = ref('');
let preloadTimer = 0;
let preloadIdleId = 0;

const spaces = LAB_SPACES;

const currentSpace = computed(() => spaces.find((space) => space.id === activeSpace.value) || spaces[0]);
const roomViewerSpace = computed(() => activeRoomSpace.value);
const selectedDetailSpace = computed(() => spaces.find((space) => space.id === selectedDetailSpaceId.value) || spaces[0]);

const layers = [
  { id: 'panorama', icon: '👁️', label: '全景漫游' },
  { id: 'devices', icon: '💻', label: '设备图层' },
  { id: 'data', icon: '📊', label: '数据图层' },
  { id: 'alarms', icon: '⚠️', label: '告警图层' }
];

const SPACE_DETAIL_META = {
  lab310: {
    image: '/assets/image1.png',
    description: '310 实验室面向智能制造、AI 训练与项目协作，支持实验演示、设备联调、数据看板展示以及团队日常研发。',
    currentMeeting: { title: '智能算法团队例会', time: '10:00 - 11:30' },
    nextMeeting: { title: '设备联调与巡检', time: '14:00 - 15:30' },
    schedules: [
      { time: '10:00 - 11:30', title: '智能算法团队例会', status: '进行中', className: 'green' },
      { time: '14:00 - 15:30', title: '设备联调与巡检', status: '待开始', className: 'blue' },
      { time: '16:00 - 17:30', title: '成果汇报会', status: '待开始', className: 'blue' }
    ],
    cameras: [
      { name: '主视角', image: '/assets/image1.png' },
      { name: '工位区', image: '/assets/image6.png' },
      { name: '设备区', image: '/assets/image8.png' },
      { name: '会议角', image: '/assets/image2.png' }
    ],
    deviceOverview: [
      { label: '在线', count: 16, className: 'online' },
      { label: '离线', count: 1, className: 'offline' },
      { label: '维护中', count: 1, className: 'busy' }
    ]
  },
  class401: {
    image: '/assets/image3.png',
    description: '401 会议室配备专业会议设备，支持多媒体演示、远程视频会议以及小组讨论，适用于课题汇报、项目评审、学术交流等多种场景。',
    currentMeeting: { title: '项目周例会', time: '09:30 - 11:30' },
    nextMeeting: { title: '课题组讨论会', time: '14:00 - 15:30' },
    schedules: [
      { time: '09:30 - 11:30', title: '项目周例会', status: '进行中', className: 'green' },
      { time: '14:00 - 15:30', title: '课题组讨论会', status: '待开始', className: 'blue' },
      { time: '16:00 - 17:30', title: '成果汇报会', status: '待开始', className: 'blue' }
    ],
    cameras: [
      { name: '主视角', image: '/assets/image3.png' },
      { name: '左侧视角', image: '/assets/image6.png' },
      { name: '右侧视角', image: '/assets/image2.png' },
      { name: '后方视角', image: '/assets/image7.png' }
    ],
    deviceOverview: [
      { label: '在线', count: 10, className: 'online' },
      { label: '离线', count: 1, className: 'offline' },
      { label: '维护中', count: 1, className: 'busy' }
    ]
  },
  meeting913: {
    image: '/assets/image6.png',
    description: '913 会议室用于项目汇报、需求讨论和跨团队决策，支持会议屏展示、远程协作、摄像头监控与音视频联动。',
    currentMeeting: { title: '产品需求讨论会', time: '10:00 - 11:30' },
    nextMeeting: { title: '项目评审准备会', time: '16:00 - 17:30' },
    schedules: [
      { time: '10:00 - 11:30', title: '产品需求讨论会', status: '进行中', className: 'green' },
      { time: '14:00 - 15:30', title: '项目评审准备会', status: '待开始', className: 'blue' },
      { time: '16:00 - 17:30', title: '跨团队同步会', status: '待开始', className: 'blue' }
    ],
    cameras: [
      { name: '主视角', image: '/assets/image6.png' },
      { name: '会议桌', image: '/assets/image7.png' },
      { name: '屏幕视角', image: '/assets/image3.png' },
      { name: '入口视角', image: '/assets/image2.png' }
    ],
    deviceOverview: [
      { label: '在线', count: 8, className: 'online' },
      { label: '离线', count: 1, className: 'offline' },
      { label: '维护中', count: 1, className: 'busy' }
    ]
  }
};

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

const openDetailView = (viewName) => {
  activeDetailView.value = viewName;
};

const closeDetailView = () => {
  activeDetailView.value = 'none';
};

const openSpaceDetail = (spaceId) => {
  selectedDetailSpaceId.value = spaceId;
  activeDetailView.value = 'space-detail';
};

const openDeviceDetail = (deviceId) => {
  selectedDeviceId.value = deviceId;
  activeDetailView.value = 'device-detail';
};

const loadPrinterDashboard = async () => {
  printerLoading.value = true;
  printerError.value = '';
  try {
    printerDashboard.value = await fetchPrinterDashboard();
  } catch (error) {
    printerError.value = error instanceof Error ? error.message : '打印机状态同步失败';
  } finally {
    printerLoading.value = false;
  }
};

const printerDeviceRows = computed(() => {
  if (printerLoading.value) {
    return [{ id: 'printer-loading', name: '3D打印机同步中', type: '增材制造设备', location: '310实验室', statusText: '同步中', statusClass: 'busy' }];
  }
  if (printerError.value) {
    return [{ id: 'printer-error', name: '3D打印机', type: '增材制造设备', location: '310实验室', statusText: '同步失败', statusClass: 'offline' }];
  }
  const cards = getPrinterCards(printerDashboard.value);
  if (!cards.length) {
    return [{ id: 'printer-empty', name: '3D打印机', type: '增材制造设备', location: '310实验室', statusText: '暂无数据', statusClass: 'offline' }];
  }
  return cards.map((printer) => ({
    id: printer.id,
    name: `3D打印机 ${printer.name}`,
    type: '增材制造设备',
    icon: '3D打印机',
    kind: 'printer',
    model: printer.model,
    prints: printer.prints,
    accuracy: printer.accuracy,
    share: printer.share,
    location: printer.location,
    statusText: printer.status,
    statusClass: 'online'
  }));
});

const overviewDeviceRows = computed(() => STATIC_DEVICE_ROWS.slice(0, 3));
const allDeviceRows = computed(() => [...printerDeviceRows.value, ...STATIC_DEVICE_ROWS]);
const selectedDevice = computed(() => allDeviceRows.value.find((device) => device.id === selectedDeviceId.value) || allDeviceRows.value[0]);

const selectedSpaceDevices = computed(() => {
  const baseDevices = selectedDetailSpace.value.equipment;
  if (selectedDetailSpace.value.id !== 'lab310') return baseDevices;
  return [...printerDeviceRows.value, ...baseDevices];
});

const selectedSpaceDetailMeta = computed(() => SPACE_DETAIL_META[selectedDetailSpace.value.id] || SPACE_DETAIL_META.lab310);
const selectedSpaceSchedules = computed(() => selectedSpaceDetailMeta.value.schedules);
const selectedSpaceCameras = computed(() => selectedSpaceDetailMeta.value.cameras);
const selectedSpaceDeviceOverview = computed(() => selectedSpaceDetailMeta.value.deviceOverview);
const selectedSpaceAvailableDevices = computed(() => selectedSpaceDevices.value.slice(0, 4));

const detailTitle = computed(() => {
  if (activeDetailView.value === 'space-list') return { kicker: '实验空间', title: '全部空间状态' };
  if (activeDetailView.value === 'space-detail') return { kicker: '空间详情', title: selectedDetailSpace.value.label };
  if (activeDetailView.value === 'device-detail') return { kicker: '设备详情', title: selectedDevice.value?.name || '设备详情' };
  return { kicker: '设备状态', title: '全部设备列表' };
});

const formatPrinterValue = (value, digits = 0) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return '--';
  return number.toLocaleString('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
};

const printerSummary = computed(() => ({
  totalPrints: formatPrinterValue(printerDashboard.value?.total_prints),
  successful: formatPrinterValue(printerDashboard.value?.successful_prints),
  failed: formatPrinterValue(printerDashboard.value?.failed_prints),
  totalHours: formatPrinterValue(printerDashboard.value?.total_print_time_hours, 1),
  totalFilament: formatPrinterValue(printerDashboard.value?.total_filament_grams, 0),
  totalCost: formatPrinterValue(printerDashboard.value?.total_cost, 2)
}));

const filamentStats = computed(() => {
  const stats = printerDashboard.value?.prints_by_filament_type || {};
  return Object.entries(stats).map(([name, count]) => ({ name, count }));
});

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
  loadPrinterDashboard();
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
  background:
    radial-gradient(circle at 50% 42%, rgba(84, 135, 190, 0.78), rgba(49, 96, 156, 0.76) 44%, rgba(25, 67, 128, 0.82) 72%, rgba(11, 39, 90, 0.9) 100%);
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
  background:
    radial-gradient(circle at 50% 48%, rgba(96, 149, 204, 0.3), rgba(45, 93, 154, 0.2) 60%, transparent 78%);
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

.badge.orange {
  background: rgba(245, 158, 11, 0.15);
  color: var(--status-busy);
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

.home-detail-layer {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: rgba(1, 8, 19, 0.62);
  backdrop-filter: blur(8px);
}

.home-detail-panel {
  width: min(1120px, calc(100vw - 56px));
  max-height: min(760px, calc(100vh - 140px));
  padding: 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.home-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(67, 183, 255, 0.22);
}

.detail-kicker {
  display: block;
  margin-bottom: 4px;
  color: #72e7ff;
  font-size: 12px;
}

.home-detail-header h3 {
  color: #fff;
  font-size: 22px;
}

.detail-close {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(114, 231, 255, 0.4);
  border-radius: 4px;
  background: rgba(3, 18, 42, 0.78);
  color: #eaf8ff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.detail-space-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  overflow-y: auto;
}

.detail-space-card,
.space-detail-columns section {
  border: 1px solid rgba(67, 183, 255, 0.22);
  border-radius: 6px;
  background: rgba(2, 12, 30, 0.54);
}

.detail-space-card {
  min-height: 210px;
  padding: 18px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}

.detail-space-card:hover {
  transform: translateY(-2px);
  border-color: rgba(114, 231, 255, 0.62);
  background: rgba(7, 38, 79, 0.7);
}

.detail-card-top,
.space-detail-summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.detail-card-top h4,
.space-detail-summary h4 {
  color: #fff;
  font-size: 20px;
}

.detail-space-card p,
.space-detail-summary p {
  margin-top: 12px;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.detail-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.detail-metrics.compact {
  min-width: 360px;
  margin-top: 0;
}

.detail-metrics div {
  padding: 12px;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 4px;
  background: rgba(67, 183, 255, 0.05);
}

.detail-metrics span {
  display: block;
  margin-bottom: 4px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.detail-metrics strong {
  color: #fff;
  font-size: 20px;
}

.space-detail-page,
.device-detail-page {
  min-height: 0;
  overflow-y: auto;
}

.detail-back {
  margin-bottom: 14px;
  border: 1px solid rgba(67, 183, 255, 0.32);
  border-radius: 4px;
  background: rgba(5, 44, 103, 0.52);
  color: #cbeeff;
  padding: 7px 12px;
  cursor: pointer;
}

.space-detail-dashboard {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.space-detail-hero-grid {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr) 170px 210px;
  gap: 14px;
  align-items: stretch;
}

.space-detail-cover,
.space-state-card,
.space-meeting-card,
.space-intro-card,
.space-plan-card,
.space-monitor-card,
.space-info-panel {
  border: 1px solid rgba(67, 183, 255, 0.22);
  border-radius: 6px;
  background: rgba(2, 12, 30, 0.54);
  box-shadow: inset 0 0 18px rgba(24, 122, 255, 0.05);
}

.space-detail-cover {
  width: 100%;
  height: 132px;
  object-fit: cover;
}

.space-detail-title-block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  padding: 8px 0;
}

.space-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.space-title-row h4 {
  color: #fff;
  font-size: 26px;
  line-height: 1.15;
}

.space-hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.space-hero-stats div {
  min-width: 0;
}

.space-hero-stats span,
.space-state-card span,
.space-meeting-card span {
  display: block;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.space-hero-stats strong {
  color: #fff;
  font-size: 24px;
  line-height: 1;
}

.space-hero-stats em {
  margin-left: 4px;
  color: #cbeeff;
  font-size: 12px;
  font-style: normal;
}

.space-state-card,
.space-meeting-card {
  padding: 14px;
}

.space-state-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.space-state-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.space-state-row strong {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #fff;
  font-size: 14px;
}

.space-avatar-row {
  display: flex;
  align-items: center;
  gap: 3px;
}

.space-avatar-row span,
.space-avatar-row em {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(114, 231, 255, 0.28);
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(223, 247, 255, 0.95), rgba(116, 179, 226, 0.88));
  color: #0a2b4f;
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
}

.space-meeting-card {
  display: grid;
  gap: 4px;
}

.space-meeting-card h5,
.space-intro-card h5,
.space-plan-card h5,
.space-monitor-card h5,
.space-info-panel h5 {
  color: #72e7ff;
  font-size: 14px;
}

.space-meeting-card p {
  color: #fff;
  font-size: 13px;
  line-height: 1.35;
}

.space-intro-card {
  padding: 12px 14px;
}

.space-intro-card p {
  margin-top: 6px;
  color: #d8efff;
  font-size: 13px;
  line-height: 1.65;
}

.space-visual-grid {
  display: grid;
  grid-template-columns: 310px minmax(0, 1fr);
  gap: 10px;
}

.space-plan-card,
.space-monitor-card {
  min-height: 136px;
  padding: 12px 14px;
}

.space-blueprint {
  height: 96px;
  margin-top: 8px;
  border: 1px solid rgba(114, 231, 255, 0.28);
  border-radius: 4px;
  background:
    linear-gradient(rgba(88, 178, 255, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(88, 178, 255, 0.09) 1px, transparent 1px),
    rgba(4, 23, 52, 0.76);
  background-size: 18px 18px;
  padding: 14px;
}

.blueprint-room {
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(178, 224, 255, 0.74);
}

.blueprint-table {
  position: absolute;
  left: 26%;
  top: 32%;
  width: 48%;
  height: 32%;
  border: 1px solid rgba(220, 244, 255, 0.86);
  border-radius: 3px;
}

.blueprint-seat {
  position: absolute;
  width: 10px;
  height: 8px;
  border: 1px solid rgba(220, 244, 255, 0.72);
  border-radius: 3px;
}

.blueprint-seat:nth-child(2) { left: 25%; top: 18%; }
.blueprint-seat:nth-child(3) { left: 36%; top: 18%; }
.blueprint-seat:nth-child(4) { left: 47%; top: 18%; }
.blueprint-seat:nth-child(5) { left: 58%; top: 18%; }
.blueprint-seat:nth-child(6) { left: 69%; top: 18%; }
.blueprint-seat:nth-child(7) { left: 25%; bottom: 18%; }
.blueprint-seat:nth-child(8) { left: 36%; bottom: 18%; }
.blueprint-seat:nth-child(9) { left: 47%; bottom: 18%; }
.blueprint-seat:nth-child(10) { left: 58%; bottom: 18%; }
.blueprint-seat:nth-child(11) { left: 69%; bottom: 18%; }
.blueprint-seat:nth-child(12) { left: 15%; top: 45%; }
.blueprint-seat:nth-child(13) { right: 15%; top: 45%; }

.monitor-preview-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.monitor-preview-strip article {
  min-width: 0;
}

.monitor-preview-strip img {
  width: 100%;
  height: 76px;
  object-fit: cover;
  border: 1px solid rgba(67, 183, 255, 0.26);
  border-radius: 4px;
}

.monitor-preview-strip span {
  display: block;
  margin-top: 6px;
  color: var(--color-text-secondary);
  font-size: 12px;
  text-align: center;
}

.space-bottom-dashboard {
  display: grid;
  grid-template-columns: 1.15fr 1fr 0.95fr;
  gap: 10px;
}

.space-info-panel {
  min-height: 164px;
  padding: 12px 14px;
}

.space-schedule-list,
.available-device-list,
.space-device-overview ul {
  margin-top: 10px;
  list-style: none;
}

.space-schedule-list li,
.available-device-list li {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr) 58px;
  gap: 10px;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.06);
}

.space-schedule-list span,
.space-schedule-list strong,
.available-device-list span {
  min-width: 0;
  color: #d8efff;
  font-size: 12px;
}

.space-schedule-list strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.space-schedule-list em {
  justify-self: end;
  font-size: 12px;
  font-style: normal;
}

.space-schedule-list em.green,
.available-device-list strong {
  color: #67e889;
}

.space-schedule-list em.blue {
  color: #a9c8ff;
}

.space-device-overview {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  margin-top: 12px;
}

.mini-donut {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: conic-gradient(#2f7dff 0 82%, #64748b 82% 90%, #f59e0b 90% 100%);
  position: relative;
}

.mini-donut::after {
  content: "";
  position: absolute;
  inset: 22px;
  border-radius: 50%;
  background: #071a36;
}

.space-device-overview li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  color: #d8efff;
  font-size: 12px;
}

.space-device-overview li > span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.space-device-overview .online {
  background: #2f7dff;
}

.space-device-overview .offline {
  background: #64748b;
}

.space-device-overview .busy {
  background: #f59e0b;
}

.space-device-total {
  margin-top: 8px;
  text-align: right;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.space-device-total strong {
  color: #fff;
}

.available-device-list li {
  grid-template-columns: minmax(0, 1fr) 52px;
}

.available-device-list strong {
  justify-self: end;
  font-size: 12px;
}

.space-detail-summary {
  margin-bottom: 18px;
  padding: 18px;
  border: 1px solid rgba(67, 183, 255, 0.2);
  border-radius: 6px;
  background: rgba(67, 183, 255, 0.045);
}

.space-detail-columns {
  display: grid;
  grid-template-columns: 1.1fr 1.1fr 0.9fr;
  gap: 16px;
}

.space-detail-columns section {
  min-height: 260px;
  padding: 16px;
}

.space-detail-columns h5 {
  margin-bottom: 12px;
  color: #72e7ff;
  font-size: 15px;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
}

.detail-list li {
  padding: 11px 12px;
  border: 1px solid rgba(255, 255, 255, 0.055);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.022);
}

.detail-list strong,
.detail-list span,
.detail-list em {
  display: block;
}

.detail-list strong {
  color: #fff;
  font-size: 14px;
}

.detail-list span {
  margin-top: 3px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.detail-list em {
  margin-top: 6px;
  color: #dff7ff;
  font-size: 12px;
  font-style: normal;
}

.compact-list li {
  min-height: 64px;
}

.detail-device-table {
  min-width: 760px;
}

.device-single-page {
  min-height: 0;
  overflow-y: auto;
}

.device-single-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.device-hero-card {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 22px;
  padding: 18px;
  border: 1px solid rgba(67, 183, 255, 0.22);
  border-radius: 6px;
  background: rgba(2, 12, 30, 0.54);
}

.device-visual {
  min-height: 168px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(103, 214, 255, 0.28);
  border-radius: 6px;
  background:
    radial-gradient(circle at 50% 40%, rgba(103, 214, 255, 0.22), transparent 62%),
    linear-gradient(180deg, rgba(6, 28, 55, 0.72), rgba(2, 10, 24, 0.82));
}

.device-visual span {
  padding: 8px 14px;
  border: 1px solid rgba(103, 214, 255, 0.36);
  border-radius: 4px;
  color: #72e7ff;
  font-weight: 800;
}

.device-hero-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.device-hero-info h4 {
  color: #fff;
  font-size: 28px;
  line-height: 1.2;
}

.device-hero-info p {
  margin-top: 8px;
  color: var(--color-text-secondary);
}

.device-status-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.device-status-line strong {
  color: #eaf8ff;
  font-size: 16px;
}

.printer-real-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  min-height: 92px;
  padding: 14px;
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 6px;
  background: rgba(67, 183, 255, 0.045);
}

.summary-card span {
  display: block;
  margin-bottom: 8px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.summary-card strong {
  color: #fff;
  font-size: 22px;
  line-height: 1.15;
}

.device-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.device-info-grid > div {
  padding: 16px;
  border: 1px solid rgba(67, 183, 255, 0.2);
  border-radius: 6px;
  background: rgba(2, 12, 30, 0.48);
}

.device-info-grid h5 {
  margin-bottom: 12px;
  color: #72e7ff;
  font-size: 15px;
}

.device-info-grid dl {
  display: grid;
  gap: 9px;
  margin: 0;
}

.device-info-grid dl div {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 12px;
  padding-bottom: 9px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.055);
}

.device-info-grid dl div:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.device-info-grid dt {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.device-info-grid dd {
  margin: 0;
  color: #fff;
  font-size: 13px;
}

.filament-grid.compact {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filament-pill {
  min-width: 112px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 8px 10px;
  border: 1px solid rgba(56, 189, 248, 0.16);
  border-radius: 4px;
  background: rgba(56, 189, 248, 0.05);
}

.filament-pill span {
  color: var(--color-text-secondary);
}

.filament-pill strong {
  color: #fff;
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
