<template>
  <div ref="containerRef" class="lab-model-viewer">
    <div v-if="selectedDesk" class="desk-location-card font-num">
      <div class="desk-location-header">
        <span>工位位置</span>
        <button type="button" aria-label="关闭工位位置" @click.stop="clearDeskSelection">×</button>
      </div>
      <strong>{{ selectedDesk.label }}</strong>
      <p>{{ selectedDesk.area }}</p>
      <div class="desk-location-grid">
        <span>行列</span>
        <b>第 {{ selectedDesk.row }} 行 · 第 {{ selectedDesk.col }} 列</b>
        <span>坐标</span>
        <b>X {{ selectedDesk.x }} · Y {{ selectedDesk.y }} · Z {{ selectedDesk.z }}</b>
      </div>
    </div>
    <div v-if="loading" class="model-loading font-num">
      <span>{{ loadingText }}</span>
    </div>
    <div v-if="loadError" class="model-error font-num">
      <strong>3D模型加载失败</strong>
      <span>{{ loadError }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const props = defineProps({
  activeLayer: {
    type: String,
    default: 'panorama'
  }
});

const containerRef = ref(null);
const loading = ref(true);
const loadError = ref('');
const loadProgress = ref(0);
const selectedDesk = ref(null);

const loadingText = computed(() => {
  if (loadProgress.value <= 0) return '加载3D场景中';
  return `加载3D场景 ${Math.round(loadProgress.value)}%`;
});

let renderer;
let scene;
let camera;
let controls;
let frameId = 0;
let resizeObserver;
let labRoot;
let dataGrid;
let alarmPulse;
let disposed = false;
let loadedModelStatus = [];
let raycaster;
let pointer;
let deskSelectionHelper;
let pointerDownPoint = { x: 0, y: 0 };

const ROOM = {
  width: 24,
  depth: 9,
  wallHeight: 2.9,
  wallThickness: 0.18,
  tileSize: 0.6
};

const modelLayers = [
  {
    url: '/model/workstation_area.glb',
    name: 'WorkstationModelLayer',
    targetCenter: [-3.5, 0, 0.48],
    targetSize: [15.9, 6.15],
    rootYOverride: 0
  },
  {
    url: '/model/meeting_area.glb',
    name: 'MeetingModelLayer',
    targetCenter: [8.1, 0, -0.35],
    targetSize: [3.45, 4.45]
  },
  {
    url: '/model/hardware_area.glb',
    name: 'HardwareModelLayer',
    targetCenter: [7.4, 0, 3.55],
    targetSize: [5.65, 1.55]
  }
];

const initScene = () => {
  const container = containerRef.value;
  if (!container) return;

  scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.Fog('#dff6ff', 28, 58);

  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
  camera.position.set(5.8, 17.2, 10.6);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.shadowMap.enabled = false;
  renderer.domElement.className = 'lab-model-canvas';
  container.appendChild(renderer.domElement);
  renderer.domElement.addEventListener('pointerdown', handlePointerDown);
  renderer.domElement.addEventListener('pointerup', handlePointerUp);

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.45, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.panSpeed = 0.82;
  controls.rotateSpeed = 0.52;
  controls.zoomSpeed = 0.9;
  controls.minDistance = 9;
  controls.maxDistance = 34;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
  };
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };

  labRoot = new THREE.Group();
  labRoot.name = 'Lab_310_DigitalTwin_Base';
  labRoot.rotation.y = -0.035;
  scene.add(labRoot);

  createRoomShell();
  createLights();
  createLayerVisuals();
  updateLayerVisuals();

  resizeObserver = new ResizeObserver(resizeRenderer);
  resizeObserver.observe(container);
  resizeRenderer();
};

const createRoomShell = () => {
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#d9dde3',
    roughness: 0.82,
    metalness: 0.02,
    emissive: '#6aafff',
    emissiveIntensity: 0.025
  });
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: '#f5f7fa',
    roughness: 0.68,
    metalness: 0.06
  });
  const blueLineMaterial = new THREE.MeshBasicMaterial({
    color: '#4fc3ff',
    transparent: true,
    opacity: 0.74
  });
  const zoneMaterial = new THREE.MeshBasicMaterial({
    color: '#1677ff',
    transparent: true,
    opacity: 0.045,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const halfW = ROOM.width / 2;
  const halfD = ROOM.depth / 2;
  const h = ROOM.wallHeight;
  const t = ROOM.wallThickness;
  const wallY = h / 2;

  const floor = new THREE.Mesh(new THREE.BoxGeometry(ROOM.width, 0.08, ROOM.depth), floorMaterial);
  floor.name = '310_Lab_Floor';
  labRoot.add(floor);

  createFloorGrid(halfW, halfD);
  createZonePlate('Zone_Workstations', [-3.9, 0.052, 0.08], [13.7, 6.8], zoneMaterial);
  createZonePlate('Zone_Meeting', [8.15, 0.054, -0.35], [4.65, 5.9], zoneMaterial);
  createZonePlate('Zone_Hardware', [7.4, 0.056, 3.55], [6.2, 1.55], zoneMaterial);

  addBox('Wall_Basic_Left', [t, h, ROOM.depth], [-halfW, wallY, 0], wallMaterial);
  addBox('Wall_Basic_Right', [t, h, ROOM.depth], [halfW, wallY, 0], wallMaterial);
  addBox('Wall_Basic_Bottom', [ROOM.width, h * 0.55, t], [0, h * 0.275, halfD], wallMaterial);
  addBox('Wall_Top_Left_Of_Door1', [2.0, h, t], [-10.95, wallY, -halfD], wallMaterial);
  addBox('Wall_Top_Between_Door1_And_Display', [1.8, h, t], [-7.8, wallY, -halfD], wallMaterial);
  addBox('Wall_Top_Display_Back', [8.7, h, t], [-1.7, wallY, -halfD], wallMaterial);
  addBox('Wall_Top_Between_Display_And_Door2', [2.15, h, t], [5.95, wallY, -halfD], wallMaterial);
  addBox('Wall_Top_Right_Of_Door2', [2.15, h, t], [10.95, wallY, -halfD], wallMaterial);

  addLightEdge('Door_01_Glow_Header', [1.35, 0.05, 0.07], [-9.25, 2.25, -halfD + 0.08], blueLineMaterial);
  addLightEdge('Door_02_Glow_Header', [1.35, 0.05, 0.07], [8.5, 2.25, -halfD + 0.08], blueLineMaterial);
  createWallPanelLines(halfW, halfD, blueLineMaterial);

  const textureLoader = new THREE.TextureLoader();
  addDisplayWall(textureLoader, 'Zone_DisplayWall_01', [-1.7, 0, -halfD + 0.18], [8.4, 1.55, 0.08], '/textures/display_wall_01.jpg', 0, blueLineMaterial);
  addDisplayWall(textureLoader, 'Zone_DisplayWall_02', [5.15, 0, -0.45], [4.3, 1.65, 0.08], '/textures/display_wall_02.jpg', Math.PI / 2, blueLineMaterial);
  addDisplayWall(textureLoader, 'Zone_PeopleWall', [-halfW + 0.18, 0, -0.95], [3.8, 1.65, 0.08], '/textures/people_wall.png.jpg', Math.PI / 2, blueLineMaterial);
  addPlaceholderAssets(halfW, blueLineMaterial);
};

const addBox = (name, size, position, material, rotationY = 0) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material.clone ? material.clone() : material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.y = rotationY;
  labRoot.add(mesh);
  return mesh;
};

const addLightEdge = (name, size, position, material) => addBox(name, size, position, material);

const createFloorGrid = (halfW, halfD) => {
  const gridMaterial = new THREE.LineBasicMaterial({
    color: '#b7bcc6',
    transparent: true,
    opacity: 0.28
  });
  const points = [];
  for (let x = -halfW; x <= halfW + 0.001; x += ROOM.tileSize) {
    points.push(new THREE.Vector3(x, 0.052, -halfD), new THREE.Vector3(x, 0.052, halfD));
  }
  for (let z = -halfD; z <= halfD + 0.001; z += ROOM.tileSize) {
    points.push(new THREE.Vector3(-halfW, 0.052, z), new THREE.Vector3(halfW, 0.052, z));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const lines = new THREE.LineSegments(geometry, gridMaterial);
  lines.name = 'Floor_Tile_600mm_Grid';
  labRoot.add(lines);

  const hudMaterial = new THREE.LineBasicMaterial({
    color: '#4fc3ff',
    transparent: true,
    opacity: 0.62
  });
  [
    [[-10.85, 3.65], [-8.7, 3.65], [-8.1, 2.9], [3.8, 2.9], [4.75, 2.1], [5.55, 2.1], [6.1, 3.62], [10.65, 3.62]],
    [[-10.7, -3.78], [-7.5, -3.78], [-7.2, -3.38], [4.4, -3.38], [4.9, -2.6]]
  ].forEach((path, index) => {
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(path.map(([x, z]) => new THREE.Vector3(x, 0.07, z)));
    const line = new THREE.Line(pathGeometry, hudMaterial.clone());
    line.name = `Floor_HUD_Path_${index + 1}`;
    labRoot.add(line);
  });
};

const createZonePlate = (name, position, size, material) => {
  const zone = new THREE.Mesh(new THREE.PlaneGeometry(size[0], size[1]), material.clone());
  zone.name = name;
  zone.rotation.x = -Math.PI / 2;
  zone.position.set(...position);
  labRoot.add(zone);
};

const createWallPanelLines = (halfW, halfD, material) => {
  const horizontal = [0.85, 1.75, 2.55];
  const yStart = 0.35;
  const spacing = 1.2;

  for (let x = -halfW + spacing; x < halfW; x += spacing) {
    addLightEdge(`Wall_Panel_Lines_Top_Vertical_${x.toFixed(1)}`, [0.018, 2.2, 0.028], [x, 1.52, -halfD + 0.105], material);
  }
  horizontal.forEach((y) => {
    addLightEdge(`Wall_Panel_Lines_Top_Horizontal_${y}`, [ROOM.width - 0.8, 0.016, 0.03], [0, yStart + y, -halfD + 0.105], material);
  });
  [-halfW + 0.105, halfW - 0.105].forEach((x, sideIndex) => {
    for (let z = -halfD + spacing; z < halfD; z += spacing) {
      addLightEdge(`Wall_Panel_Lines_Side_${sideIndex}_Vertical_${z.toFixed(1)}`, [0.028, 2.2, 0.018], [x, 1.52, z], material);
    }
    horizontal.forEach((y) => {
      addLightEdge(`Wall_Panel_Lines_Side_${sideIndex}_Horizontal_${y}`, [0.03, 0.016, ROOM.depth - 0.8], [x, yStart + y, 0], material);
    });
  });
};

const addDisplayWall = (textureLoader, name, position, size, texturePath, rotationY, edgeMaterial) => {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(...position);
  group.rotation.y = rotationY;

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(...size),
    new THREE.MeshBasicMaterial({ color: '#1a6eff', transparent: true, opacity: 0.35 })
  );
  glass.name = `${name}_Glass_Backplate`;
  glass.position.y = 1.35;
  group.add(glass);

  const texture = textureLoader.load(texturePath);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(size[0], size[1]),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.94, toneMapped: false })
  );
  panel.name = `${name}_Texture_Panel`;
  panel.position.set(0, 1.35, size[2] / 2 + 0.014);
  group.add(panel);

  [
    [`${name}_Glow_Top`, [size[0] + 0.12, 0.04, 0.05], [0, 2.28, 0.02]],
    [`${name}_Glow_Bottom`, [size[0] + 0.12, 0.04, 0.05], [0, 0.44, 0.02]],
    [`${name}_Glow_Left`, [0.05, 1.9, 0.05], [-size[0] / 2 - 0.04, 1.35, 0.02]],
    [`${name}_Glow_Right`, [0.05, 1.9, 0.05], [size[0] / 2 + 0.04, 1.35, 0.02]]
  ].forEach(([edgeName, edgeSize, edgePosition]) => {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(...edgeSize), edgeMaterial.clone());
    edge.name = edgeName;
    edge.position.set(...edgePosition);
    group.add(edge);
  });

  labRoot.add(group);
};

const addPlaceholderAssets = (halfW, edgeMaterial) => {
  const deviceMaterial = new THREE.MeshStandardMaterial({
    color: '#637a95',
    roughness: 0.48,
    metalness: 0.28,
    emissive: '#1677ff',
    emissiveIntensity: 0.055
  });
  const trophyMaterial = new THREE.MeshStandardMaterial({
    color: '#f0d07b',
    metalness: 0.45,
    roughness: 0.28,
    emissive: '#4fc3ff',
    emissiveIntensity: 0.018
  });

  for (let index = 0; index < 12; index += 1) {
    const trophy = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.22, 12), trophyMaterial.clone());
    trophy.name = `DisplayWall_01_Trophy_${index + 1}`;
    trophy.position.set(-5.55 + index * 0.78, 0.72, -4.16);
    labRoot.add(trophy);
  }

  [
    ['Network_Device', [-11.25, 0.75, -3.95], [0.82, 1.0, 0.72], 0],
    ['AirConditioner_01', [-11.0, 0.62, 3.82], [0.95, 0.78, 0.75], 0],
    ['AirConditioner_02', [11.12, 1.1, -3.88], [0.78, 0.56, 0.58], 0],
    ['Water_Dispenser', [halfW - 0.48, 0.82, -0.92], [0.42, 0.95, 0.52], Math.PI / 2],
    ['Printer_RightWall', [halfW - 0.48, 0.82, 0.95], [0.5, 0.95, 0.55], Math.PI / 2]
  ].forEach(([name, position, size, rotationY]) => {
    const block = addBox(name, size, position, deviceMaterial, rotationY);
    const glow = new THREE.Mesh(new THREE.BoxGeometry(size[0] + 0.08, 0.035, 0.045), edgeMaterial.clone());
    glow.name = `${name}_Glow_Base`;
    glow.position.set(0, -size[1] / 2 + 0.05, size[2] / 2 + 0.03);
    block.add(glow);
  });
};

const createLights = () => {
  scene.add(new THREE.AmbientLight('#f4fbff', 1.25));
  scene.add(new THREE.HemisphereLight('#ffffff', '#9fb6ce', 1.1));

  const key = new THREE.DirectionalLight('#ffffff', 2.15);
  key.position.set(4.5, 8, 6);
  scene.add(key);

  [
    [-9.1, 2.4, 0, '#4fc3ff', 1.4, 8],
    [9.1, 2.4, 0, '#4fc3ff', 1.4, 8],
    [-1.7, 2.1, -4.1, '#4fc3ff', 1.65, 7],
    [5.15, 1.9, -0.45, '#4fc3ff', 1.25, 5],
    [-3.9, 5.2, 0, '#f7fcff', 1.25, 12],
    [8.1, 4.5, -0.35, '#ffffff', 1.45, 7],
    [7.4, 3.2, 3.5, '#eaf9ff', 1.2, 6]
  ].forEach(([x, y, z, color, intensity, distance]) => {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(x, y, z);
    scene.add(light);
  });
};

const createLayerVisuals = () => {
  const grid = new THREE.GridHelper(19, 24, '#38bdf8', '#1d4ed8');
  grid.name = 'DataLayerGrid';
  grid.position.y = 0.035;
  grid.material.transparent = true;
  grid.material.opacity = 0.18;
  dataGrid = grid;
  labRoot.add(dataGrid);

  const alarmGeometry = new THREE.RingGeometry(0.52, 0.72, 64);
  const alarmMaterial = new THREE.MeshBasicMaterial({
    color: '#f59e0b',
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });
  alarmPulse = new THREE.Mesh(alarmGeometry, alarmMaterial);
  alarmPulse.name = 'AlarmLayerPulse';
  alarmPulse.rotation.x = -Math.PI / 2;
  alarmPulse.position.set(7.4, 0.06, 3.55);
  labRoot.add(alarmPulse);
};

const updateLayerVisuals = () => {
  if (!dataGrid || !alarmPulse) return;
  dataGrid.visible = props.activeLayer === 'data';
  alarmPulse.visible = props.activeLayer === 'alarms';
};

const prepareMeshes = (object) => {
  object.traverse((child) => {
    if (shouldHideArtifact(child.name)) {
      child.visible = false;
      return;
    }

    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
      child.frustumCulled = true;
      if (child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          material.needsUpdate = true;
          if (material.map) material.map.colorSpace = THREE.SRGBColorSpace;
        });
      }
    }
  });
};

const shouldHideArtifact = (name) => {
  return name.startsWith('zz_old_') || name.includes('_disabled') || ['Object_1652', 'Object_1653', 'Object_1805', 'Object_1808'].includes(name);
};

const fitModelLayer = (object, layer) => {
  object.name = layer.name;
  object.position.set(0, 0, 0);
  object.scale.setScalar(1);
  object.rotation.set(0, 0, 0);
  object.updateWorldMatrix(true, true);

  prepareMeshes(object);

  const bounds = getUsableBounds(object);
  if (!bounds) return;

  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = Math.min(
    layer.targetSize[0] / Math.max(size.x, 0.001),
    layer.targetSize[1] / Math.max(size.z, 0.001)
  );

  object.scale.setScalar(scale);
  object.updateWorldMatrix(true, true);
  object.position.set(
    layer.targetCenter[0] - center.x * scale,
    layer.rootYOverride ?? layer.targetCenter[1] - bounds.min.y * scale,
    layer.targetCenter[2] - center.z * scale
  );
};

const getUsableBounds = (object) => {
  const bounds = new THREE.Box3();
  let hasVisual = false;

  object.updateWorldMatrix(true, true);
  object.traverse((child) => {
    if (!child.visible || shouldHideArtifact(child.name) || !child.isMesh) return;
    bounds.union(new THREE.Box3().setFromObject(child));
    hasVisual = true;
  });

  return hasVisual ? bounds : null;
};

const loadModels = async () => {
  const loader = new GLTFLoader();
  let completed = 0;
  loadedModelStatus = [];

  try {
    const models = await Promise.all(modelLayers.map((layer) => {
      return loader.loadAsync(layer.url, (event) => {
        if (event.lengthComputable) {
          const current = completed / modelLayers.length;
          const partial = (event.loaded / event.total) / modelLayers.length;
          loadProgress.value = Math.min(99, (current + partial) * 100);
        }
      }).then((gltf) => {
        completed += 1;
        loadProgress.value = Math.min(99, (completed / modelLayers.length) * 100);
        fitModelLayer(gltf.scene, layer);
        const bounds = getUsableBounds(gltf.scene) || new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        loadedModelStatus.push({
          name: layer.name,
          url: layer.url,
          children: gltf.scene.children.length,
          center: center.toArray().map((value) => Number(value.toFixed(3))),
          size: size.toArray().map((value) => Number(value.toFixed(3)))
        });
        return gltf.scene;
      });
    }));

    models.forEach((model) => labRoot.add(model));
    if (containerRef.value) {
      containerRef.value.dataset.loadedModels = loadedModelStatus.map((item) => item.name).join(',');
      containerRef.value.dataset.loadedModelCount = String(loadedModelStatus.length);
      containerRef.value.dataset.sceneChildren = labRoot.children.map((child) => child.name).filter(Boolean).join(',');
    }
    if (typeof window !== 'undefined') {
      window.__labModelStatus = {
        loadedModels: loadedModelStatus,
        rootChildren: labRoot.children.map((child) => child.name).filter(Boolean),
        totalRootChildren: labRoot.children.length
      };
    }
    loading.value = false;
    loadProgress.value = 100;
  } catch (error) {
    loading.value = false;
    loadError.value = error instanceof Error ? error.message : '请检查模型文件是否存在。';
  }
};

const handlePointerDown = (event) => {
  pointerDownPoint = { x: event.clientX, y: event.clientY };
};

const handlePointerUp = (event) => {
  const moved = Math.abs(event.clientX - pointerDownPoint.x) + Math.abs(event.clientY - pointerDownPoint.y);
  if (moved > 6) return;
  pickDesk(event);
};

const pickDesk = (event) => {
  if (!renderer || !camera || !labRoot) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const intersections = raycaster.intersectObjects(labRoot.children, true);
  const deskObject = intersections.map((hit) => findDeskObject(hit.object)).find(Boolean);

  if (!deskObject) {
    clearDeskSelection();
    return;
  }

  showDeskLocation(deskObject);
};

const findDeskObject = (object) => {
  let current = object;
  while (current && current !== labRoot && current !== scene) {
    if (getDeskPosition(current.name)) return current;
    current = current.parent;
  }
  return null;
};

const getDeskPosition = (name) => {
  const match = name.match(/seat_r(\d{2})_c(\d{2})/);
  if (!match || name.startsWith('zz_old_')) return null;
  return {
    row: Number(match[1]),
    col: Number(match[2])
  };
};

const showDeskLocation = (deskObject) => {
  const position = getDeskPosition(deskObject.name);
  if (!position) return;

  const box = new THREE.Box3().setFromObject(deskObject);
  const center = box.getCenter(new THREE.Vector3());

  selectedDesk.value = {
    label: `工位 ${position.row}-${position.col}`,
    area: getDeskArea(position),
    row: position.row,
    col: position.col,
    x: center.x.toFixed(2),
    y: center.y.toFixed(2),
    z: center.z.toFixed(2)
  };
  if (containerRef.value) {
    containerRef.value.dataset.selectedDesk = selectedDesk.value.label;
  }

  showDeskHighlight(box);
};

const getDeskArea = ({ row, col }) => {
  if (col >= 13) return '右侧工位区';
  if (row <= 2) return '前排工位区';
  if (row >= 4) return '后排工位区';
  return '中部工位区';
};

const showDeskHighlight = (box) => {
  clearDeskHighlight();
  deskSelectionHelper = new THREE.Box3Helper(box, '#7de9ff');
  deskSelectionHelper.name = 'Desk_Location_Highlight';
  deskSelectionHelper.material.transparent = true;
  deskSelectionHelper.material.opacity = 0.95;
  scene.add(deskSelectionHelper);
};

const clearDeskHighlight = () => {
  if (!deskSelectionHelper) return;
  scene?.remove(deskSelectionHelper);
  deskSelectionHelper.geometry?.dispose?.();
  deskSelectionHelper.material?.dispose?.();
  deskSelectionHelper = null;
};

const clearDeskSelection = () => {
  selectedDesk.value = null;
  if (containerRef.value) {
    delete containerRef.value.dataset.selectedDesk;
  }
  clearDeskHighlight();
};

const resizeRenderer = () => {
  if (!containerRef.value || !renderer || !camera) return;
  const { width, height } = containerRef.value.getBoundingClientRect();
  const nextWidth = Math.max(1, Math.floor(width));
  const nextHeight = Math.max(1, Math.floor(height));
  camera.aspect = nextWidth / nextHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(nextWidth, nextHeight, false);
};

const animate = () => {
  if (disposed) return;
  frameId = window.requestAnimationFrame(animate);
  controls?.update();

  if (alarmPulse?.visible) {
    const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.16;
    alarmPulse.scale.setScalar(pulse);
    alarmPulse.material.opacity = 0.38 + Math.sin(Date.now() * 0.004) * 0.16;
  }

  renderer?.render(scene, camera);
};

const disposeObject = (object) => {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value && value.isTexture) value.dispose();
        });
        material.dispose();
      });
    }
  });
};

watch(() => props.activeLayer, updateLayerVisuals);

onMounted(async () => {
  initScene();
  await loadModels();
  animate();
});

onUnmounted(() => {
  disposed = true;
  if (frameId) window.cancelAnimationFrame(frameId);
  resizeObserver?.disconnect();
  renderer?.domElement?.removeEventListener('pointerdown', handlePointerDown);
  renderer?.domElement?.removeEventListener('pointerup', handlePointerUp);
  controls?.dispose();
  clearDeskHighlight();
  if (scene) disposeObject(scene);
  renderer?.dispose();
  renderer?.domElement?.remove();
});
</script>

<style scoped>
.lab-model-viewer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: transparent;
}

.lab-model-viewer :deep(.lab-model-canvas) {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
}

.lab-model-viewer :deep(.lab-model-canvas:active) {
  cursor: grabbing;
}

.desk-location-card {
  position: absolute;
  top: 92px;
  left: 24px;
  z-index: 4;
  width: 250px;
  padding: 12px 14px;
  border: 1px solid rgba(125, 233, 255, 0.34);
  border-radius: 6px;
  background: rgba(5, 20, 42, 0.84);
  color: #e8f7ff;
  box-shadow: 0 14px 34px rgba(0, 7, 18, 0.36), inset 0 0 20px rgba(56, 189, 248, 0.08);
  backdrop-filter: blur(8px);
}

.desk-location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #7de9ff;
  font-size: 12px;
}

.desk-location-header button {
  width: 22px;
  height: 22px;
  border: 1px solid rgba(125, 233, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  color: #dff7ff;
  line-height: 18px;
  cursor: pointer;
}

.desk-location-card strong {
  display: block;
  color: #fff;
  font-size: 18px;
  line-height: 1.2;
}

.desk-location-card p {
  margin: 5px 0 10px;
  color: rgba(226, 241, 255, 0.72);
  font-size: 12px;
}

.desk-location-grid {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 7px 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 11px;
}

.desk-location-grid span {
  color: rgba(226, 241, 255, 0.62);
}

.desk-location-grid b {
  color: #f8fdff;
  font-weight: 700;
}

.model-loading,
.model-error {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
  min-width: 190px;
  padding: 12px 16px;
  border: 1px solid rgba(56, 189, 248, 0.28);
  border-radius: 6px;
  background: rgba(2, 8, 24, 0.78);
  color: #dff7ff;
  text-align: center;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.18);
}

.model-error {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-color: rgba(248, 113, 113, 0.42);
  color: #fecaca;
}

.model-error span {
  font-size: 11px;
  color: #fca5a5;
}
</style>
