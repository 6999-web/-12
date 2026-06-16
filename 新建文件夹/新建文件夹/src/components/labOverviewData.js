export const LAB_SPACES = [
  {
    id: 'lab310',
    shortName: '310',
    title: '310 智慧实验室',
    label: '310 实验室',
    slogan: '实 验 · 创 新 · 协 同 · 发 展',
    statusText: '使用中',
    statusClass: 'green',
    people: 6,
    devices: 18,
    meetings: 0,
    capacity: 24,
    environment: ['温度 23.8℃', '湿度 52%', '空气质量 优'],
    personnel: [
      { name: '李秉泽', role: '教育科技BU、具身智能BU', status: '在岗', seat: 'A03 工位' },
      { name: '陈俊宏', role: '教育科技BU', status: '在岗', seat: 'A06 工位' },
      { name: '朱为', role: '具身智能BU', status: '在岗', seat: 'B02 工位' },
      { name: '庞力豪', role: '教育科技BU', status: '在岗', seat: 'B05 工位' }
    ],
    equipment: [
      { name: '机械臂', type: '实验设备', statusText: '在线', statusClass: 'online' },
      { name: '高清摄像头', type: '监控设备', statusText: '在线', statusClass: 'online' },
      { name: 'AI训练服务器', type: '算力设备', statusText: '在线', statusClass: 'online' }
    ]
  },
  {
    id: 'class401',
    shortName: '401',
    title: '401 会议室',
    label: '401 会议室',
    slogan: '教 学 · 研 讨 · 协 作 · 展 示',
    statusText: '空闲',
    statusClass: 'blue',
    people: 0,
    devices: 12,
    meetings: 2,
    capacity: 20,
    environment: ['温度 20℃', '湿度 45%', '空气质量 优'],
    personnel: [
      { name: '智能算法团队', role: '14:00 项目评审会', status: '待进入', seat: '会议席' },
      { name: '课题组成员', role: '15:40 研讨预约', status: '待进入', seat: '会议席' }
    ],
    equipment: [
      { name: '会议大屏', type: '显示设备', statusText: '空闲', statusClass: 'online' },
      { name: '视频会议终端', type: '会议设备', statusText: '在线', statusClass: 'online' },
      { name: '高清摄像头', type: '监控设备', statusText: '在线', statusClass: 'online' }
    ]
  },
  {
    id: 'meeting913',
    shortName: '913',
    title: '913 会议室',
    label: '913 会议室',
    slogan: '会 议 · 汇 报 · 决 策 · 联 动',
    statusText: '使用中',
    statusClass: 'green',
    people: 8,
    devices: 10,
    meetings: 1,
    capacity: 18,
    environment: ['温度 21℃', '湿度 46%', '空气质量 优'],
    personnel: [
      { name: '产品需求讨论组', role: '跨团队需求会', status: '会议中', seat: '主会议席' },
      { name: '项目负责人', role: '项目汇报', status: '会议中', seat: '汇报席' },
      { name: '评审成员', role: '方案评审', status: '会议中', seat: '评审席' }
    ],
    equipment: [
      { name: '会议屏', type: '显示设备', statusText: '使用中', statusClass: 'busy' },
      { name: '拾音麦克风', type: '会议设备', statusText: '在线', statusClass: 'online' },
      { name: '高清摄像头', type: '监控设备', statusText: '在线', statusClass: 'online' }
    ]
  }
];

export const STATIC_DEVICE_ROWS = [
  { id: 'robot-arm-310', name: '机械臂', location: '310实验室', type: '实验设备', icon: '机械臂', kind: 'device', statusText: '在线', statusClass: 'online' },
  { id: 'camera-310', name: '高清摄像头', location: '310实验室', type: '监控设备', icon: '摄像头', kind: 'device', statusText: '在线', statusClass: 'online' },
  { id: 'display-310', name: '大屏显示系统', location: '310实验室', type: '显示设备', icon: '大屏', kind: 'device', statusText: '在线', statusClass: 'online' },
  { id: 'ai-server-310', name: 'AI训练服务器', location: '310实验室', type: '算力设备', icon: '服务器', kind: 'device', statusText: '在线', statusClass: 'online' },
  { id: 'screen-401', name: '会议大屏', location: '401会议室', type: '显示设备', icon: '大屏', kind: 'device', statusText: '空闲', statusClass: 'online' },
  { id: 'conference-401', name: '视频会议终端', location: '401会议室', type: '会议设备', icon: '会议终端', kind: 'device', statusText: '在线', statusClass: 'online' },
  { id: 'camera-401', name: '401监控摄像头', location: '401会议室', type: '监控设备', icon: '摄像头', kind: 'device', statusText: '在线', statusClass: 'online' },
  { id: 'screen-913', name: '913会议屏', location: '913会议室', type: '显示设备', icon: '会议屏', kind: 'device', statusText: '使用中', statusClass: 'busy' },
  { id: 'mic-913', name: '拾音麦克风', location: '913会议室', type: '会议设备', icon: '麦克风', kind: 'device', statusText: '在线', statusClass: 'online' },
  { id: 'camera-913', name: '913监控摄像头', location: '913会议室', type: '监控设备', icon: '摄像头', kind: 'device', statusText: '在线', statusClass: 'online' }
];
