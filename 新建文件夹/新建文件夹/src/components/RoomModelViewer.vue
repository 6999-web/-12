<template>
  <div ref="containerRef" class="room-model-viewer" :data-space-id="spaceId">
    <div v-if="selectedPerson" class="person-info-card font-num" :style="selectedPersonCardStyle">
      <div class="person-info-header">
        <span>成员信息</span>
        <button type="button" aria-label="关闭成员信息" @click.stop="clearPersonSelection">x</button>
      </div>
      <strong>{{ selectedPerson.name }}</strong>
      <p>{{ selectedPerson.studentId }}</p>
      <dl>
        <div>
          <dt>部门</dt>
          <dd>{{ selectedPerson.department }}</dd>
        </div>
        <div>
          <dt>区队</dt>
          <dd>{{ selectedPerson.squad }}</dd>
        </div>
        <div>
          <dt>工位</dt>
          <dd>{{ selectedPerson.seat }}</dd>
        </div>
        <div>
          <dt>状态</dt>
          <dd><span class="person-status">{{ selectedPerson.status }}</span></dd>
        </div>
      </dl>
    </div>
    <div v-if="loading" class="room-model-loading font-num">
      <span>{{ loadingText }}</span>
    </div>
    <div v-if="loadError" class="room-model-error font-num">
      <strong>模型加载失败</strong>
      <span>{{ loadError }}</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getRoomConfig, loadRoomModelAsset } from './roomModelAssets';

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: true
  }
});

const containerRef = ref(null);
const loading = ref(true);
const loadError = ref('');
const loadProgress = ref(0);
const selectedPerson = ref(null);
const selectedPersonCardStyle = ref({ left: '24px', top: '92px' });

const loadingText = '加载教室模型中';

const setLoadProgress = (value) => {
  const nextValue = Math.max(loadProgress.value, Math.min(100, value));
  loadProgress.value = Number.isFinite(nextValue) ? nextValue : loadProgress.value;
};

let renderer;
let scene;
let camera;
let controls;
let resizeObserver;
let frameId = 0;
let roomRoot;
let disposed = false;
let bootId = 0;
let raycaster;
let pointer;
let pointerDownPoint = { x: 0, y: 0 };
let selectedPersonAnchor = null;
let personSelectionHelper;
let activeSpaceId = '';
const loadedSpaceStates = new Map();

const CAT_MODEL_URL = '/model/kiki.glb?v=20260612-full-white-2';
const MEMBER_CAT_HEIGHT = 0.74;
const CAT_WHITE_COLOR = new THREE.Color('#fffdf9');

const catOccupants = [
  {
    id: 'member_seat_cat_01',
    name: '李秉泽',
    studentId: '25104070216',
    department: '教育科技BU、具身智能BU',
    squad: '25数据警务技术专业二区',
    seat: 'A03 工位',
    status: '在岗'
  },
  {
    id: 'member_seat_cat_02',
    name: '陈俊宏',
    studentId: '25104070222',
    department: '教育科技BU',
    squad: '25数据警务技术专业二区',
    seat: 'A06 工位',
    status: '在岗'
  },
  {
    id: 'member_seat_cat_03',
    name: '朱为',
    studentId: '25104070149',
    department: '具身智能BU',
    squad: '25数据警务技术专业一区',
    seat: 'B02 工位',
    status: '在岗'
  },
  {
    id: 'member_seat_cat_04',
    name: '庞力豪',
    studentId: '25104070242',
    department: '教育科技BU',
    squad: '25数据警务技术专业二区',
    seat: 'B05 工位',
    status: '在岗'
  }
];

const roomCatPlacements = {
  class401: [
    { position: [16.64, 0.33, -2.8], rotationY: 0, seat: '401 工位 A03', catHeight: 0.92, colliderHeight: 1.02 },
    { position: [12.47, 0.33, -2.83], rotationY: 0, seat: '401 工位 A06', catHeight: 0.92, colliderHeight: 1.02 },
    { position: [18.01, 0.33, -4.79], rotationY: 0, seat: '401 工位 B02', catHeight: 0.92, colliderHeight: 1.02 },
    { position: [13.85, 0.33, -4.79], rotationY: 0, seat: '401 工位 B05', catHeight: 0.92, colliderHeight: 1.02 }
  ],
  meeting913: [
    { position: [-8.21, -0.47, 3.1], rotationY: Math.PI, seat: '913 会议席 A03', catWidth: 1.18, colliderHeight: 1.62 },
    { position: [-5.96, -0.47, 3.1], rotationY: Math.PI, seat: '913 会议席 A06', catWidth: 1.18, colliderHeight: 1.62 },
    { position: [-8.18, -0.47, -3.1], rotationY: 0, seat: '913 会议席 B02', catWidth: 1.18, colliderHeight: 1.62 },
    { position: [-5.93, -0.47, -3.1], rotationY: 0, seat: '913 会议席 B05', catWidth: 1.18, colliderHeight: 1.62 }
  ]
};

const initScene = () => {
  const container = containerRef.value;
  if (!container) return;

  const config = getRoomConfig(props.spaceId);
  scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.Fog('#061528', 18, 46);

  camera = new THREE.PerspectiveCamera(48, 1, 0.1, 180);
  camera.position.set(0, 14, 12);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.className = 'room-model-canvas';
  container.appendChild(renderer.domElement);
  renderer.domElement.addEventListener('pointerdown', handlePointerDown);
  renderer.domElement.addEventListener('pointerup', handlePointerUp);

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...config.cameraTarget);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.panSpeed = 0.82;
  controls.rotateSpeed = 0.52;
  controls.zoomSpeed = 0.9;
  controls.minDistance = config.minDistance;
  controls.maxDistance = config.maxDistance;
  controls.maxPolarAngle = Math.PI / 2.05;

  resizeObserver = new ResizeObserver(resizeRenderer);
  resizeObserver.observe(container);
  resizeRenderer();
};

const createRoomShell = (config, bounds) => {
  const { room } = config;
  const margin = room.margin ?? 1.1;
  const wallThickness = room.wallThickness ?? 0.16;
  const minX = bounds.min.x - margin;
  const maxX = bounds.max.x + margin;
  const minZ = bounds.min.z - margin;
  const maxZ = bounds.max.z + margin;
  const width = Math.max(maxX - minX, 1);
  const depth = Math.max(maxZ - minZ, 1);
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;
  const floorY = Math.min(bounds.min.y, 0) - 0.06;
  const height = room.wallHeight ?? Math.max(room.minHeight ?? 4.5, bounds.max.y - floorY + (room.ceilingClearance ?? 0.6));
  const wallY = floorY + height / 2;
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: config.floorColor,
    roughness: 0.76,
    metalness: 0.16,
    emissive: '#0f7ed8',
    emissiveIntensity: 0.035
  });
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: '#d5e3ef',
    roughness: 0.62,
    metalness: 0.08,
    emissive: '#0b315f',
    emissiveIntensity: 0.015,
    transparent: true,
    opacity: 0.72
  });

  addBox(`${props.spaceId}_Floor`, [width, 0.08, depth], [centerX, floorY - 0.02, centerZ], floorMaterial);
  const grid = new THREE.GridHelper(Math.max(width, depth), room.gridDivisions, '#38bdf8', '#1d4ed8');
  grid.name = `${props.spaceId}_Floor_Grid`;
  grid.position.set(centerX, floorY + 0.04, centerZ);
  if (grid.material) {
    grid.material.transparent = true;
    grid.material.opacity = 0.18;
  }
  roomRoot.add(grid);

  addBox(`${activeSpaceId}_BackWall`, [width, height, wallThickness], [centerX, wallY, minZ - wallThickness / 2], wallMaterial);
  addBox(`${activeSpaceId}_FrontWall`, [width, height, wallThickness], [centerX, wallY, maxZ + wallThickness / 2], wallMaterial);
  addBox(`${activeSpaceId}_LeftWall`, [wallThickness, height, depth], [minX - wallThickness / 2, wallY, centerZ], wallMaterial);
  addBox(`${activeSpaceId}_RightWall`, [wallThickness, height, depth], [maxX + wallThickness / 2, wallY, centerZ], wallMaterial);

  const shellBounds = {
    minX: Number(minX.toFixed(3)),
    maxX: Number(maxX.toFixed(3)),
    minZ: Number(minZ.toFixed(3)),
    maxZ: Number(maxZ.toFixed(3)),
    floorY: Number(floorY.toFixed(3)),
    height: Number(height.toFixed(3))
  };

  if (containerRef.value) {
    containerRef.value.dataset.roomShellBounds = JSON.stringify(shellBounds);
  }

  return shellBounds;
};

const addBox = (name, size, position, material) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material.clone ? material.clone() : material);
  mesh.name = name;
  mesh.position.set(...position);
  roomRoot.add(mesh);
  return mesh;
};

const createLights = (config, bounds) => {
  roomRoot.add(new THREE.AmbientLight('#7db6ff', 0.76));
  roomRoot.add(new THREE.HemisphereLight('#bfeaff', '#061528', 0.88));

  const center = bounds.getCenter(new THREE.Vector3()).applyMatrix4(roomRoot.matrixWorld);
  const size = bounds.getSize(new THREE.Vector3());
  const radius = Math.max(size.x, size.z, size.y * 2, 8);

  const key = new THREE.DirectionalLight('#dff7ff', 1.85);
  key.position.set(center.x + radius * 0.45, center.y + radius * 0.68, center.z + radius * 0.56);
  roomRoot.add(key);

  [
    [center.x, center.y + radius * 0.35, center.z, '#bfeaff', 1.35, radius * 1.9],
    [center.x - radius * 0.32, center.y + radius * 0.18, center.z - radius * 0.28, '#4fc3ff', 1.1, radius * 1.15],
    [center.x + radius * 0.32, center.y + radius * 0.18, center.z + radius * 0.28, '#dff7ff', 1.1, radius * 1.15]
  ].forEach(([x, y, z, color, intensity, distance]) => {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(x, y, z);
    roomRoot.add(light);
  });
};

const materialNameIncludes = (child, keyword) => {
  const materials = Array.isArray(child.material) ? child.material : [child.material];
  return materials.some((material) => material?.name?.toLowerCase().includes(keyword));
};

const isColliderMesh = (child) => {
  const name = child.name?.toLowerCase?.() || '';
  return name.includes('collider') || materialNameIncludes(child, 'collider');
};

const getLocalMeshBox = (mesh) => {
  if (!mesh.geometry) return null;
  if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
  if (!mesh.geometry.boundingBox) return null;

  roomRoot.updateMatrixWorld(true);
  mesh.updateWorldMatrix(true, false);
  const toRoomLocal = new THREE.Matrix4().copy(roomRoot.matrixWorld).invert().multiply(mesh.matrixWorld);
  const box = mesh.geometry.boundingBox.clone().applyMatrix4(toRoomLocal);
  const size = box.getSize(new THREE.Vector3());
  if (![box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z].every(Number.isFinite)) return null;
  if (size.lengthSq() <= 0.000001) return null;
  return box;
};

const collectVisualMeshEntries = (objects) => {
  const entries = [];
  objects.forEach((object) => {
    object.traverse((child) => {
      if (!child.isMesh || !child.visible || isColliderMesh(child)) return;
      const box = getLocalMeshBox(child);
      if (!box) return;
      entries.push({
        mesh: child,
        box,
        center: box.getCenter(new THREE.Vector3())
      });
    });
  });
  return entries;
};

const getMedian = (values) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const hideOutlierMeshes = (models, config) => {
  const entries = collectVisualMeshEntries(models);
  if (entries.length < 4) return 0;

  const centerX = getMedian(entries.map((entry) => entry.center.x));
  const centerZ = getMedian(entries.map((entry) => entry.center.z));
  const outlierRadius = config.room.outlierRadius ?? Infinity;
  let hidden = 0;

  entries.forEach((entry) => {
    const distance = Math.hypot(entry.center.x - centerX, entry.center.z - centerZ);
    if (distance > outlierRadius) {
      entry.mesh.visible = false;
      entry.mesh.userData.hiddenAsRoomOutlier = true;
      hidden += 1;
    }
  });

  return hidden;
};

const getVisualBounds = (models) => {
  const entries = collectVisualMeshEntries(models);
  const box = new THREE.Box3();
  entries.forEach((entry) => box.union(entry.box));
  return {
    bounds: box.isEmpty() ? null : box,
    meshCount: entries.length
  };
};

const frameCameraToBounds = (config, bounds) => {
  const center = bounds.getCenter(new THREE.Vector3()).applyMatrix4(roomRoot.matrixWorld);
  const localSize = bounds.getSize(new THREE.Vector3());
  const radius = Math.max(localSize.x, localSize.z, localSize.y * 2, 8);
  const target = center.clone();
  target.y = center.y + Math.max(localSize.y * 0.18, 0.8);

  camera.position.set(
    center.x + radius * 0.55,
    center.y + radius * 0.72,
    center.z + radius * 0.72
  );
  camera.near = 0.1;
  camera.far = Math.max(180, radius * 8);
  camera.updateProjectionMatrix();

  controls.target.copy(target);
  controls.minDistance = Math.max(config.minDistance, radius * 0.16);
  controls.maxDistance = Math.max(config.maxDistance, radius * 3.2);
  controls.update();

  scene.fog = new THREE.Fog('#061528', Math.max(18, radius * 1.25), Math.max(46, radius * 4.2));
};

const markCachedClone = (object) => {
  object.traverse((child) => {
    child.userData.preserveCachedAsset = true;
  });
};

const getObjectBounds = (object) => {
  const bounds = new THREE.Box3();
  let hasVisual = false;
  object.updateMatrixWorld(true);
  object.traverse((child) => {
    if (!child.isMesh || !child.visible || isColliderMesh(child)) return;
    const childBounds = new THREE.Box3().setFromObject(child);
    if (childBounds.isEmpty()) return;
    bounds.union(childBounds);
    hasVisual = true;
  });
  return hasVisual ? bounds : null;
};

const createCatOccupant = (catScene, person, placement) => {
  const root = new THREE.Group();
  root.name = `${person.id}_${activeSpaceId}_root`;
  root.position.set(...placement.position);
  root.rotation.y = placement.rotationY;
  root.userData.personInfo = {
    ...person,
    seat: placement.seat
  };

  const model = catScene.clone(true);
  model.name = `${person.id}_${activeSpaceId}_model`;
  prepareModel(model);
  applyCatMaterial(model);

  const bounds = getObjectBounds(model) || new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const targetWidth = placement.catWidth;
  const targetHeight = placement.catHeight || MEMBER_CAT_HEIGHT;
  const scale = targetWidth
    ? targetWidth / Math.max(size.x, size.z, 0.001)
    : targetHeight / Math.max(size.y, 0.001);
  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
  root.add(model);

  const collider = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, placement.colliderHeight || 1, 1.18),
    new THREE.MeshBasicMaterial({
      color: '#7de9ff',
      transparent: true,
      opacity: 0,
      depthWrite: false
    })
  );
  collider.name = `${person.id}_${activeSpaceId}_collider`;
  collider.position.set(0, (placement.colliderHeight || 1) / 2, 0);
  collider.userData.personInfo = root.userData.personInfo;
  root.add(collider);
  markCachedClone(root);
  return root;
};

const applyCatMaterial = (object) => {
  object.traverse((child) => {
    if (!child.isMesh) return;
    child.material = new THREE.MeshStandardMaterial({
      color: CAT_WHITE_COLOR,
      roughness: 0.72,
      metalness: 0,
      emissive: new THREE.Color('#dbeafe'),
      emissiveIntensity: 0.08
    });
  });
};

const loadPersonnelPlaceholders = async (currentBootId, config) => {
  const gltf = await loadRoomModelAsset({ url: CAT_MODEL_URL, name: 'CatMemberModel' });
  if (currentBootId !== bootId || disposed) return null;

  const group = new THREE.Group();
  group.name = `${activeSpaceId}_PersonnelCatPlaceholders`;
  const placements = roomCatPlacements[activeSpaceId] || [];
  catOccupants.forEach((person, index) => {
    const placement = placements[index];
    if (!placement) return;
    group.add(createCatOccupant(gltf.scene, person, placement));
  });
  markCachedClone(group);
  roomRoot.add(group);
  return group;
};

const countVisibleMeshes = (object) => {
  let count = 0;
  object.traverse((child) => {
    if (child.isMesh && child.visible && !isColliderMesh(child)) count += 1;
  });
  return count;
};

const countHiddenOutlierMeshes = (object) => {
  let count = 0;
  object.traverse((child) => {
    if (child.userData?.hiddenAsRoomOutlier) count += 1;
  });
  return count;
};

const getPersonnelBounds = (personnelGroup) => {
  if (!personnelGroup) return [];
  personnelGroup.updateMatrixWorld(true);
  return personnelGroup.children.map((root) => {
    const box = getObjectBounds(root) || new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    return {
      name: root.userData.personInfo?.name || root.name,
      seat: root.userData.personInfo?.seat || '',
      footY: Number(box.min.y.toFixed(3)),
      topY: Number(box.max.y.toFixed(3)),
      height: Number(size.y.toFixed(3)),
      width: Number(Math.max(size.x, size.z).toFixed(3)),
      center: box.getCenter(new THREE.Vector3()).toArray().map((value) => Number(value.toFixed(3)))
    };
  });
};

const updatePersonnelScreenPositions = () => {
  const state = loadedSpaceStates.get(activeSpaceId);
  if (!props.visible || !state?.personnelRoots?.length || !containerRef.value || !camera) return;

  const containerRect = containerRef.value.getBoundingClientRect();
  const positions = state.personnelRoots.map((root) => {
    const box = getObjectBounds(root) || new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    center.y = box.max.y * 0.62 + box.min.y * 0.38;
    center.project(camera);
    return {
      name: root.userData.personInfo?.name || root.name,
      seat: root.userData.personInfo?.seat || '',
      x: Math.round((center.x * 0.5 + 0.5) * containerRect.width + containerRect.left),
      y: Math.round((-center.y * 0.5 + 0.5) * containerRect.height + containerRect.top)
    };
  });

  containerRef.value.dataset.personnelScreenPositions = JSON.stringify(positions);
};

const applyStateDataset = (state) => {
  if (!containerRef.value) return;
  containerRef.value.dataset.loadedModels = state.loadedModels.join(',');
  containerRef.value.dataset.loadedModelCount = String(state.loadedModels.length);
  containerRef.value.dataset.visualMeshCount = String(state.meshCount);
  containerRef.value.dataset.hiddenOutlierCount = String(state.hiddenOutlierCount);
  containerRef.value.dataset.personnelCount = String(state.personnelCount);
  containerRef.value.dataset.personnelBounds = JSON.stringify(state.personnelBounds || []);
  containerRef.value.dataset.roomShellBounds = JSON.stringify(state.shellBounds || {});
  containerRef.value.dataset.visualBounds = JSON.stringify({
    min: state.bounds.min.toArray().map((value) => Number(value.toFixed(3))),
    max: state.bounds.max.toArray().map((value) => Number(value.toFixed(3)))
  });
};

const activateSpaceState = (state) => {
  loadedSpaceStates.forEach((spaceState) => {
    spaceState.root.visible = spaceState.spaceId === state.spaceId;
  });
  activeSpaceId = state.spaceId;
  roomRoot = state.root;
  clearPersonSelection();
  const config = getRoomConfig(state.spaceId);
  frameCameraToBounds(config, state.bounds);
  applyStateDataset(state);
};

const prepareModel = (object, config = null) => {
  object.traverse((child) => {
    if (child.isMesh && isColliderMesh(child)) {
      child.visible = false;
      return;
    }

    if (child.isMesh) {
      if (config?.rootName === 'Classroom_401_DigitalTwin_Base' && materialNameIncludes(child, 'cafe_hand_drawn_doodle_banner')) {
        child.visible = false;
        child.userData.hiddenAsRoomOutlier = true;
        return;
      }
      child.castShadow = false;
      child.receiveShadow = false;
      child.frustumCulled = true;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material.map) material.map.colorSpace = THREE.SRGBColorSpace;
        material.needsUpdate = true;
      });
    }
  });
};

const loadModels = async (currentBootId) => {
  const cachedState = loadedSpaceStates.get(props.spaceId);
  if (cachedState) {
    activateSpaceState(cachedState);
    loading.value = false;
    loadProgress.value = 100;
    return true;
  }

  const config = getRoomConfig(props.spaceId);
  activeSpaceId = props.spaceId;
  roomRoot = new THREE.Group();
  roomRoot.name = config.rootName;
  roomRoot.rotation.y = config.rootRotationY;
  roomRoot.visible = false;
  scene.add(roomRoot);

  let completed = 0;
  const modelProgress = new Array(config.models.length).fill(0);

  try {
    const models = await Promise.all(config.models.map((modelConfig, index) => {
      return loadRoomModelAsset(modelConfig, (event) => {
        if (event.lengthComputable) {
          modelProgress[index] = Math.max(modelProgress[index], event.loaded / event.total);
          const totalProgress = modelProgress.reduce((sum, value) => sum + value, 0) / config.models.length;
          setLoadProgress(Math.min(99, totalProgress * 100));
        }
      }).then((gltf) => {
        completed += 1;
        modelProgress[index] = 1;
        setLoadProgress(Math.min(99, (completed / config.models.length) * 100));
        const model = gltf.scene.clone(true);
        model.name = modelConfig.name;
        prepareModel(model, config);
        const wrapper = new THREE.Group();
        wrapper.name = `${modelConfig.name}_Placement`;
        wrapper.scale.setScalar(modelConfig.scale || 1);
        wrapper.add(model);
        markCachedClone(wrapper);
        return wrapper;
      });
    }));

    if (currentBootId !== bootId || disposed) return false;

    models.forEach((model) => roomRoot.add(model));
    const personnelGroup = await loadPersonnelPlaceholders(currentBootId, config);
    if (currentBootId !== bootId || disposed) return false;

    roomRoot.updateMatrixWorld(true);
    const hiddenOutlierCount = config.visualBounds ? countHiddenOutlierMeshes(roomRoot) : hideOutlierMeshes(models, config);
    if (!config.visualBounds) roomRoot.updateMatrixWorld(true);
    const visual = config.visualBounds
      ? {
          bounds: new THREE.Box3(
            new THREE.Vector3(...config.visualBounds.min),
            new THREE.Vector3(...config.visualBounds.max)
          ),
          meshCount: countVisibleMeshes(roomRoot)
        }
      : getVisualBounds(models);
    const { bounds, meshCount } = visual;
    if (!bounds) throw new Error('未找到可用于生成围栏的可视模型。');
    const shellBounds = createRoomShell(config, bounds);
    createLights(config, bounds);
    frameCameraToBounds(config, bounds);

    const state = {
      spaceId: props.spaceId,
      root: roomRoot,
      bounds: bounds.clone(),
      loadedModels: models.map((model) => model.name),
      meshCount,
      hiddenOutlierCount,
      personnelCount: personnelGroup?.children.length || 0,
      personnelRoots: personnelGroup?.children || [],
      personnelBounds: getPersonnelBounds(personnelGroup),
      shellBounds
    };
    loadedSpaceStates.set(props.spaceId, state);
    activateSpaceState(state);

    if (containerRef.value) {
      containerRef.value.dataset.loadedModels = models.map((model) => model.name).join(',');
      containerRef.value.dataset.loadedModelCount = String(models.length);
      containerRef.value.dataset.visualMeshCount = String(meshCount);
      containerRef.value.dataset.hiddenOutlierCount = String(hiddenOutlierCount);
      containerRef.value.dataset.personnelCount = String(state.personnelCount);
      containerRef.value.dataset.personnelBounds = JSON.stringify(state.personnelBounds);
      containerRef.value.dataset.roomShellBounds = JSON.stringify(state.shellBounds);
      containerRef.value.dataset.visualBounds = JSON.stringify({
        min: bounds.min.toArray().map((value) => Number(value.toFixed(3))),
        max: bounds.max.toArray().map((value) => Number(value.toFixed(3)))
      });
    }
    loading.value = false;
    loadProgress.value = 100;
    return true;
  } catch (error) {
    if (currentBootId !== bootId) return false;
    loading.value = false;
    loadError.value = error instanceof Error ? error.message : '请检查模型文件是否存在。';
    return false;
  }
};

const resizeRenderer = () => {
  if (!containerRef.value || !renderer || !camera) return;
  const { width, height } = containerRef.value.getBoundingClientRect();
  const nextWidth = Math.max(1, Math.floor(width));
  const nextHeight = Math.max(1, Math.floor(height));
  camera.aspect = nextWidth / nextHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.setSize(nextWidth, nextHeight, false);
  updateSelectedPersonCardPosition();
};

const handlePointerDown = (event) => {
  pointerDownPoint = { x: event.clientX, y: event.clientY };
};

const handlePointerUp = (event) => {
  const moved = Math.abs(event.clientX - pointerDownPoint.x) + Math.abs(event.clientY - pointerDownPoint.y);
  if (moved > 6) return;
  pickPerson(event);
};

const pickPerson = (event) => {
  if (!renderer || !camera || !roomRoot || !raycaster || !pointer) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const intersections = raycaster.intersectObjects(roomRoot.children, true);
  const personObject = intersections.map((hit) => findPersonObject(hit.object)).find(Boolean);
  if (!personObject) {
    clearPersonSelection();
    return;
  }

  showPersonInfo(personObject);
};

const findPersonObject = (object) => {
  let current = object;
  while (current && current !== roomRoot && current !== scene) {
    if (current.userData?.personInfo) return current;
    current = current.parent;
  }
  return null;
};

const showPersonInfo = (personObject) => {
  const person = personObject.userData.personInfo;
  if (!person) return;

  selectedPersonAnchor = personObject;
  selectedPerson.value = {
    name: person.name,
    studentId: person.studentId,
    department: person.department,
    squad: person.squad,
    seat: person.seat,
    status: person.status
  };
  updateSelectedPersonCardPosition();
  showPersonHighlight(personObject);

  if (containerRef.value) {
    containerRef.value.dataset.selectedPerson = person.name;
  }
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateSelectedPersonCardPosition = () => {
  if (!selectedPersonAnchor || !containerRef.value || !camera) return;

  const containerRect = containerRef.value.getBoundingClientRect();
  const box = new THREE.Box3().setFromObject(selectedPersonAnchor);
  const anchor = box.getCenter(new THREE.Vector3());
  anchor.y = box.max.y * 0.88 + box.min.y * 0.12;
  anchor.project(camera);

  const x = (anchor.x * 0.5 + 0.5) * containerRect.width;
  const y = (-anchor.y * 0.5 + 0.5) * containerRect.height;
  const cardWidth = 286;
  const cardHeight = 218;
  const left = clamp(x + 26, 16, Math.max(16, containerRect.width - cardWidth - 16));
  const top = clamp(y - 70, 16, Math.max(16, containerRect.height - cardHeight - 16));

  selectedPersonCardStyle.value = {
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`
  };
};

const showPersonHighlight = (object) => {
  clearPersonHighlight();
  const box = new THREE.Box3().setFromObject(object);
  personSelectionHelper = new THREE.Box3Helper(box, '#fbbf24');
  personSelectionHelper.name = `${activeSpaceId}_Person_Cat_Highlight`;
  personSelectionHelper.material.transparent = true;
  personSelectionHelper.material.opacity = 0.95;
  scene.add(personSelectionHelper);
};

const clearPersonHighlight = () => {
  if (!personSelectionHelper) return;
  scene?.remove(personSelectionHelper);
  personSelectionHelper.geometry?.dispose?.();
  personSelectionHelper.material?.dispose?.();
  personSelectionHelper = null;
};

const clearPersonSelection = () => {
  selectedPerson.value = null;
  selectedPersonAnchor = null;
  if (containerRef.value) {
    delete containerRef.value.dataset.selectedPerson;
  }
  clearPersonHighlight();
};

const stopAnimation = () => {
  if (!frameId) return;
  window.cancelAnimationFrame(frameId);
  frameId = 0;
};

const animate = () => {
  if (disposed) return;
  frameId = window.requestAnimationFrame(animate);
  if (!props.visible) return;
  controls?.update();
  updateSelectedPersonCardPosition();
  updatePersonnelScreenPositions();
  renderer?.render(scene, camera);
};

const disposeObject = (object) => {
  object.traverse((child) => {
    if (child.userData?.preserveCachedAsset) return;
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

const teardown = () => {
  bootId += 1;
  disposed = true;
  stopAnimation();
  resizeObserver?.disconnect();
  renderer?.domElement?.removeEventListener('pointerdown', handlePointerDown);
  renderer?.domElement?.removeEventListener('pointerup', handlePointerUp);
  controls?.dispose();
  clearPersonSelection();
  if (scene) disposeObject(scene);
  renderer?.dispose();
  renderer?.domElement?.remove();
  loadedSpaceStates.clear();
  scene = null;
  roomRoot = null;
};

const boot = async () => {
  const currentBootId = ++bootId;
  disposed = false;
  loading.value = true;
  loadError.value = '';
  loadProgress.value = 0;
  if (!scene) initScene();
  const loaded = await loadModels(currentBootId);
  if (currentBootId !== bootId) return;
  if (!loaded) return;
  if (props.visible && !frameId) animate();
};

watch(() => props.spaceId, async () => {
  await boot();
});

watch(() => props.visible, (visible) => {
  if (!visible) {
    stopAnimation();
    clearPersonSelection();
    if (containerRef.value) delete containerRef.value.dataset.personnelScreenPositions;
    return;
  }
  resizeRenderer();
  updateSelectedPersonCardPosition();
  updatePersonnelScreenPositions();
  if (!frameId) animate();
});

onMounted(boot);
onUnmounted(teardown);
</script>

<style scoped>
.room-model-viewer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: transparent;
}

.room-model-viewer :deep(.room-model-canvas) {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
}

.room-model-viewer :deep(.room-model-canvas:active) {
  cursor: grabbing;
}

.person-info-card {
  position: absolute;
  top: 92px;
  left: 24px;
  z-index: 4;
  width: 286px;
  padding: 13px 15px 14px;
  border: 1px solid rgba(251, 191, 36, 0.36);
  border-radius: 6px;
  background: rgba(8, 24, 45, 0.88);
  color: #f8fdff;
  box-shadow: 0 14px 34px rgba(0, 7, 18, 0.36), inset 0 0 20px rgba(251, 191, 36, 0.08);
  backdrop-filter: blur(8px);
  pointer-events: auto;
}

.person-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #fbbf24;
  font-size: 12px;
}

.person-info-header button {
  width: 22px;
  height: 22px;
  border: 1px solid rgba(251, 191, 36, 0.32);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff7d6;
  line-height: 18px;
  cursor: pointer;
}

.person-info-card strong {
  display: block;
  color: #fff;
  font-size: 18px;
  line-height: 1.2;
}

.person-info-card p {
  margin: 5px 0 11px;
  color: rgba(255, 247, 214, 0.74);
  font-size: 12px;
}

.person-info-card dl {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.person-info-card dl div {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  font-size: 12px;
}

.person-info-card dt {
  color: rgba(255, 247, 214, 0.58);
}

.person-info-card dd {
  margin: 0;
  color: #fff;
  line-height: 1.45;
}

.person-status {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 3px;
  background: rgba(16, 185, 129, 0.16);
  color: #86efac;
}

.room-model-loading,
.room-model-error {
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

.room-model-error {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-color: rgba(248, 113, 113, 0.42);
  color: #fecaca;
}

.room-model-error span {
  font-size: 11px;
  color: #fca5a5;
}
</style>
