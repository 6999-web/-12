import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

const colliderMaterial = new THREE.MeshBasicMaterial({
  color: "#4FC3FF",
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

type GeneratedColliderSpec = {
  rootName: string;
  colliderName: string;
  displayName: string;
  type: string;
  status?: string;
  description: string;
};

const fixedModelUrls = [
  { url: "/model/310_fixed/workstations_fixed.glb?v=20260624-fixed", name: "Fixed310_Workstations" },
  { url: "/model/310_fixed/meeting_screen_table_fixed.glb?v=20260624-fixed", name: "Fixed310_MeetingArea" },
  { url: "/model/310_fixed/hardware_workstations_fixed.glb?v=20260624-fixed", name: "Fixed310_HardwareArea" },
  { url: "/model/310_fixed/air_conditioner_01_fixed.glb?v=20260624-fixed", name: "Fixed310_AirConditioner01" },
  { url: "/model/310_fixed/air_conditioner_02_fixed.glb?v=20260624-fixed", name: "Fixed310_AirConditioner02" },
  { url: "/model/310_fixed/water_printer_fixed.glb?v=20260624-fixed", name: "Fixed310_WaterPrinter" },
  { url: "/model/310_fixed/front_door_fixed.glb?v=20260624-fixed", name: "Fixed310_FrontDoor" },
  { url: "/model/310_fixed/back_door_fixed.glb?v=20260624-fixed", name: "Fixed310_BackDoor" },
] as const;

export const FIXED_310_SOURCE_CENTER = new THREE.Vector3(18.1935, 0, -8.6885);
export const FIXED_310_SOURCE_SCALE = 0.65;

const deviceMeta: GeneratedColliderSpec[] = [
  {
    rootName: "room_310_meeting_table_root",
    colliderName: "room_310_meeting_table_collider",
    displayName: "会议桌",
    type: "meeting_table",
    status: "可用",
    description: "会议讨论、项目评审和团队协作区域。",
  },
  {
    rootName: "room_310_meeting_screen_root",
    colliderName: "room_310_meeting_screen_collider",
    displayName: "会议大屏",
    type: "meeting_screen",
    status: "在线",
    description: "用于展示实验室数据、项目看板和会议内容。",
  },
  {
    rootName: "room_310_hardware_workbench_root",
    colliderName: "room_310_hardware_workbench_collider",
    displayName: "硬件工作台",
    type: "hardware_workbench",
    status: "使用中",
    description: "硬件调试、机器人装配和实验操作区域。",
  },
  {
    rootName: "room_310_printer_3d_01_root",
    colliderName: "room_310_printer_3d_01_collider",
    displayName: "3D 打印机 1",
    type: "printer_3d",
    status: "在线",
    description: "用于模型打印、结构件加工和快速原型制作。",
  },
  {
    rootName: "room_310_printer_3d_02_root",
    colliderName: "room_310_printer_3d_02_collider",
    displayName: "3D 打印机 2",
    type: "printer_3d",
    status: "在线",
    description: "用于模型打印、结构件加工和快速原型制作。",
  },
  {
    rootName: "room_310_printer_3d_03_root",
    colliderName: "room_310_printer_3d_03_collider",
    displayName: "3D 打印机 3",
    type: "printer_3d",
    status: "在线",
    description: "用于模型打印、结构件加工和快速原型制作。",
  },
  {
    rootName: "room_310_print_machine_01_root",
    colliderName: "room_310_print_machine_01_collider",
    displayName: "普通打印机",
    type: "print_machine",
    status: "在线",
    description: "用于文档、项目材料和成果附件打印。",
  },
  {
    rootName: "room_310_water_dispenser_01_root",
    colliderName: "room_310_water_dispenser_01_collider",
    displayName: "饮水机",
    type: "water_dispenser",
    status: "可用",
    description: "实验室公共饮水设备。",
  },
  {
    rootName: "room_310_air_conditioner_01_root",
    colliderName: "room_310_air_conditioner_01_collider",
    displayName: "空调 1",
    type: "air_conditioner",
    status: "在线",
    description: "实验室环境温控设备。",
  },
  {
    rootName: "room_310_air_conditioner_02_root",
    colliderName: "room_310_air_conditioner_02_collider",
    displayName: "空调 2",
    type: "air_conditioner",
    status: "在线",
    description: "实验室环境温控设备。",
  },
];

export function ModelAssets() {
  const gltfs = fixedModelUrls.map((asset) => useGLTF(asset.url));

  useEffect(() => {
    gltfs.forEach(({ scene }) => {
      prepareMeshes(scene);
      prepareExistingColliders(scene);
    });
  }, [gltfs]);

  return (
    <group
      name="ModelAssets"
      scale={FIXED_310_SOURCE_SCALE}
      position={[
        -FIXED_310_SOURCE_CENTER.x * FIXED_310_SOURCE_SCALE,
        0,
        -FIXED_310_SOURCE_CENTER.z * FIXED_310_SOURCE_SCALE,
      ]}
    >
      {gltfs.map((gltf, index) => (
        <primitive
          key={fixedModelUrls[index].url}
          object={gltf.scene}
          name={fixedModelUrls[index].name}
        />
      ))}
    </group>
  );
}

function prepareMeshes(scene: THREE.Object3D) {
  scene.traverse((object) => {
    if (shouldHideArtifact(object.name)) {
      object.visible = false;
      object.userData.selectionHelper = true;
      return;
    }

    if (object instanceof THREE.Mesh) {
      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = true;
    }
  });
}

function shouldHideArtifact(name: string) {
  return name.startsWith("zz_old_") || name.includes("_disabled") || ["Object_1652", "Object_1653", "Object_1805", "Object_1808"].includes(name);
}

function prepareExistingColliders(scene: THREE.Object3D) {
  scene.traverse((object) => {
    if (!object.name.endsWith("_collider") || !(object instanceof THREE.Mesh)) return;

    const meta = getColliderMeta(object.name) ?? createGenericColliderMeta(object.name);
    object.visible = true;
    object.userData.__isCollider = true;
    object.userData.selectable = true;
    object.userData.selectionRoot = object.userData.selectionRoot ?? getRootForCollider(scene, object) ?? object.parent ?? object;
    applyColliderMeta(object, meta);
    object.material = colliderMaterial;
    object.castShadow = false;
    object.receiveShadow = false;
    object.renderOrder = -1;
  });
}

function getRootForCollider(scene: THREE.Object3D, collider: THREE.Object3D) {
  if (!collider.name.endsWith("_collider")) return null;
  const id = collider.name.replace(/_collider$/, "");
  return scene.getObjectByName(`${id}_root`) ?? null;
}

function applyColliderMeta(object: THREE.Object3D, meta: GeneratedColliderSpec) {
  object.userData.__isCollider = true;
  object.userData.selectable = true;
  object.userData.object_id = meta.colliderName.replace(/_collider$/, "");
  object.userData.display_name = meta.displayName;
  object.userData.name = meta.displayName;
  object.userData.type = meta.type;
  object.userData.status = meta.status ?? "在线";
  object.userData.description = meta.description;
}

function getColliderMeta(name: string): GeneratedColliderSpec | null {
  const seatMatch = name.match(/^seat_r(\d{2})_c(\d{2})_collider$/);
  if (seatMatch) {
    const row = Number(seatMatch[1]);
    const col = Number(seatMatch[2]);

    return {
      rootName: name.replace("_collider", "_root"),
      colliderName: name,
      displayName: `工位 ${row}-${col}`,
      type: "workstation",
      status: "在线",
      description: `第 ${row} 行第 ${col} 列工位，可后续绑定成员、项目和设备状态。`,
    };
  }

  return deviceMeta.find((item) => item.colliderName === name) ?? null;
}

function createGenericColliderMeta(name: string): GeneratedColliderSpec {
  const id = name.replace(/_collider$/, "");
  return {
    rootName: `${id}_root`,
    colliderName: name,
    displayName: id.replace(/^room_310_/, "").replace(/_/g, " "),
    type: "object",
    status: "在线",
    description: "可交互对象。",
  };
}

fixedModelUrls.forEach((asset) => useGLTF.preload(asset.url));
