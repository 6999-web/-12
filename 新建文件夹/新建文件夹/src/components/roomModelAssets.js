import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const ROOM_CONFIGS = {
  class401: {
    rootName: 'Classroom_401_DigitalTwin_Base',
    room: {
      wallThickness: 0.18,
      gridDivisions: 30,
      margin: 1.35,
      wallHeight: 2.8,
      outlierRadius: 70
    },
    visualBounds: {
      min: [-0.522, -0.212, -21.129],
      max: [20.882, 6.586, 5.603]
    },
    cameraTarget: [0, 0.45, 0],
    minDistance: 6,
    maxDistance: 70,
    rootRotationY: -0.02,
    floorColor: '#eef1ee',
    models: [
      { url: '/model/401/workstations_fixed.glb?v=20260624-fixed', name: 'Classroom401_Workstations' },
      { url: '/model/401/air_conditioner_01_fixed.glb?v=20260624-fixed', name: 'Classroom401_AirConditioner01' },
      { url: '/model/401/air_conditioner_02_fixed.glb?v=20260624-fixed', name: 'Classroom401_AirConditioner02' },
      { url: '/model/401/air_conditioner_03_fixed.glb?v=20260624-fixed', name: 'Classroom401_AirConditioner03' },
      { url: '/model/401/large_meeting_table_fixed.glb?v=20260624-fixed', name: 'Classroom401_LargeMeetingTable' },
      { url: '/model/401/small_meeting_table_fixed.glb?v=20260624-fixed', name: 'Classroom401_SmallMeetingTable' },
      { url: '/model/401/meeting_screen_fixed.glb?v=20260624-fixed', name: 'Classroom401_MeetingScreen' },
      { url: '/model/401/whiteboard_fixed.glb?v=20260624-fixed', name: 'Classroom401_Whiteboard' },
      { url: '/model/401/podium_fixed.glb?v=20260624-fixed', name: 'Classroom401_Podium' }
    ]
  },
  meeting913: {
    rootName: 'Meeting_913_DigitalTwin_Base',
    room: {
      wallThickness: 0.16,
      gridDivisions: 18,
      margin: 1.05,
      wallHeight: 2.8,
      outlierRadius: 42
    },
    visualBounds: {
      min: [-11.55, -1.05, -3.903],
      max: [9.867, 3.383, 3.903]
    },
    cameraTarget: [0, 0.25, 0],
    minDistance: 3.2,
    maxDistance: 65,
    rootRotationY: -0.08,
    floorColor: '#eef1ee',
    models: [
      { url: '/model/913/meeting_table_fixed.glb?v=20260624-fixed', name: 'Meeting913_Table', scale: 0.1 },
      { url: '/model/913/meeting_screen_fixed.glb?v=20260624-fixed', name: 'Meeting913_Screen', scale: 0.1 },
      { url: '/model/913/chairs_fixed.glb?v=20260624-fixed', name: 'Meeting913_Chairs', scale: 0.1 }
    ]
  }
};

const loader = new GLTFLoader();
const modelPromises = new Map();

export const getRoomConfig = (spaceId) => ROOM_CONFIGS[spaceId] || ROOM_CONFIGS.class401;

export const loadRoomModelAsset = (modelConfig, onProgress) => {
  if (!modelPromises.has(modelConfig.url)) {
    modelPromises.set(modelConfig.url, loader.loadAsync(modelConfig.url, onProgress));
  }

  return modelPromises.get(modelConfig.url);
};

export const preloadRoomModels = (spaceIds = ['class401', 'meeting913']) => {
  spaceIds.forEach((spaceId) => {
    const config = getRoomConfig(spaceId);
    config.models.forEach((modelConfig) => {
      loadRoomModelAsset(modelConfig).catch(() => {
        modelPromises.delete(modelConfig.url);
      });
    });
  });

  loadRoomModelAsset({ url: '/model/kiki.glb?v=20260612-full-white-2', name: 'CatMemberModel' }).catch(() => {
    modelPromises.delete('/model/kiki.glb?v=20260612-full-white-2');
  });
};
