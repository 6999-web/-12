import * as THREE from "three";

export const ROOM = {
  width: 24,
  depth: 9,
  wallHeight: 2.9,
  wallThickness: 0.18,
  tileSize: 0.6,
};

export const COLORS = {
  floor: "#C9D4DB",
  floorGroove: "#B7BCC6",
  wall: "#D5E3EF",
  wallTrim: "#91A8BD",
  metal: "#AAB5C4",
  cyan: "#4FC3FF",
  cyanDeep: "#1677FF",
  display: "#1A6EFF",
  device: "#637A95",
  workstation: "#F6F8FB",
  chair: "#CCD4DF",
  hardware: "#E9EDF2",
};

export const materials = {
  Floor_Tile_Base: new THREE.MeshStandardMaterial({
    color: COLORS.floor,
    roughness: 0.82,
    metalness: 0.02,
    emissive: COLORS.floor,
    emissiveIntensity: 0.012,
  }),
  Floor_HUD_Path: new THREE.MeshBasicMaterial({
    color: COLORS.cyan,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  }),
  Wall_Basic: new THREE.MeshStandardMaterial({
    color: COLORS.wall,
    roughness: 0.68,
    metalness: 0.06,
  }),
  Wall_Trim: new THREE.MeshStandardMaterial({
    color: COLORS.wallTrim,
    roughness: 0.52,
    metalness: 0.22,
  }),
  Wall_Light_Edge: new THREE.MeshBasicMaterial({
    color: COLORS.cyan,
    transparent: true,
    opacity: 0.72,
  }),
  Zone_Fill: new THREE.MeshBasicMaterial({
    color: COLORS.cyanDeep,
    transparent: true,
    opacity: 0.045,
    side: THREE.DoubleSide,
    depthWrite: false,
  }),
  Display_Glass: new THREE.MeshBasicMaterial({
    color: COLORS.display,
    transparent: true,
    opacity: 0.35,
  }),
  Workstation: new THREE.MeshStandardMaterial({
    color: COLORS.workstation,
    roughness: 0.58,
    metalness: 0.08,
    emissive: "#A8DFFF",
    emissiveIntensity: 0.035,
  }),
  Furniture: new THREE.MeshStandardMaterial({
    color: COLORS.hardware,
    roughness: 0.62,
    metalness: 0.1,
  }),
  Chair: new THREE.MeshStandardMaterial({
    color: COLORS.chair,
    roughness: 0.62,
    metalness: 0.06,
  }),
  Device: new THREE.MeshStandardMaterial({
    color: COLORS.device,
    roughness: 0.48,
    metalness: 0.28,
    emissive: COLORS.cyanDeep,
    emissiveIntensity: 0.055,
  }),
};

export const wallPanelLines = {
  horizontal: [0.85, 1.75, 2.55],
  verticalSpacing: 1.2,
};
