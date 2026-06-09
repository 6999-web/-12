import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { useModelEditorState, type EditableModelId } from "./modelEditorStore";
import type { Vec3 } from "./types";

const colliderMaterial = new THREE.MeshBasicMaterial({
  color: "#4FC3FF",
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

type ModelLayerProps = {
  name: string;
  editorId: EditableModelId;
  url: string;
  targetCenter: Vec3;
  targetSize: [number, number];
  fallbackColliders?: GeneratedColliderSpec[];
  rootYOverride?: number;
};

type GeneratedColliderSpec = {
  rootName: string;
  colliderName: string;
  displayName: string;
  type: string;
  status?: string;
  description: string;
};

const workstationFallback: GeneratedColliderSpec[] = [];

const meetingFallback: GeneratedColliderSpec[] = [
  {
    rootName: "meeting_table_root",
    colliderName: "meeting_table_collider",
    displayName: "会议桌",
    type: "meeting_table",
    status: "可用",
    description: "会议讨论、项目评审和团队协作区域。",
  },
  {
    rootName: "meeting_screen_root",
    colliderName: "meeting_screen_collider",
    displayName: "会议大屏",
    type: "meeting_screen",
    status: "在线",
    description: "用于展示实验室数据、项目看板和会议内容。",
  },
];

const hardwareFallback: GeneratedColliderSpec[] = [
  {
    rootName: "hardware_workbench_root",
    colliderName: "hardware_workbench_collider",
    displayName: "硬件工作台",
    type: "hardware_workbench",
    status: "使用中",
    description: "硬件调试、机器人装配和实验操作区域。",
  },
  {
    rootName: "printer_3d_01_root",
    colliderName: "printer_3d_01_collider",
    displayName: "3D 打印机 1",
    type: "printer_3d",
    status: "在线",
    description: "用于模型打印、结构件加工和快速原型制作。",
  },
  {
    rootName: "printer_3d_02_root",
    colliderName: "printer_3d_02_collider",
    displayName: "3D 打印机 2",
    type: "printer_3d",
    status: "在线",
    description: "用于模型打印、结构件加工和快速原型制作。",
  },
  {
    rootName: "printer_3d_03_root",
    colliderName: "printer_3d_03_collider",
    displayName: "3D 打印机 3",
    type: "printer_3d",
    status: "在线",
    description: "用于模型打印、结构件加工和快速原型制作。",
  },
];

export function ModelAssets() {
  return (
    <group name="ModelAssets">
      <ModelLayer
        name="WorkstationModelLayer"
        editorId="workstation"
        url="/model/workstation_area.glb"
        targetCenter={[-3.5, 0, 0.48]}
        targetSize={[15.9, 6.15]}
        fallbackColliders={workstationFallback}
        rootYOverride={0}
      />
      <ModelLayer
        name="MeetingModelLayer"
        editorId="meeting"
        url="/model/meeting_area.glb"
        targetCenter={[8.1, 0, -0.35]}
        targetSize={[3.45, 4.45]}
        fallbackColliders={meetingFallback}
      />
      <ModelLayer
        name="HardwareModelLayer"
        editorId="hardware"
        url="/model/hardware_area.glb"
        targetCenter={[7.4, 0, 3.55]}
        targetSize={[5.65, 1.55]}
        fallbackColliders={hardwareFallback}
      />
    </group>
  );
}

function ModelLayer({ name, editorId, url, targetCenter, targetSize, fallbackColliders = [], rootYOverride }: ModelLayerProps) {
  const { scene } = useGLTF(url);
  const editorState = useModelEditorState();
  const editorTransform = editorState[editorId];

  useEffect(() => {
    scene.name = name;
    scene.position.set(0, 0, 0);
    scene.scale.setScalar(1);
    scene.updateWorldMatrix(true, true);

    prepareMeshes(scene);
    createFallbackColliders(scene, fallbackColliders);
    prepareExistingColliders(scene);

    const bounds = getUsableBounds(scene);
    if (!bounds) return;

    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = Math.min(targetSize[0] / Math.max(size.x, 0.001), targetSize[1] / Math.max(size.z, 0.001)) * editorTransform.scale;

    scene.scale.setScalar(scale);
    scene.rotation.y = THREE.MathUtils.degToRad(editorTransform.rotationY);
    scene.updateWorldMatrix(true, true);

    scene.position.set(
      editorTransform.center[0] - center.x * scale,
      rootYOverride !== undefined ? rootYOverride + editorTransform.center[1] : editorTransform.center[1] - bounds.min.y * scale,
      editorTransform.center[2] - center.z * scale,
    );
    scene.updateWorldMatrix(true, true);
  }, [editorTransform, fallbackColliders, name, rootYOverride, scene, targetSize]);

  return <primitive object={scene} />;
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

function createFallbackColliders(scene: THREE.Object3D, specs: GeneratedColliderSpec[]) {
  specs.forEach((spec) => {
    if (scene.getObjectByName(spec.colliderName)) return;
    const root = scene.getObjectByName(spec.rootName);
    if (!root) return;

    const box = new THREE.Box3().setFromObject(root);
    if (box.isEmpty()) return;

    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const geometry = new THREE.BoxGeometry(Math.max(size.x, 0.1), Math.max(size.y, 0.1), Math.max(size.z, 0.1));
    const collider = new THREE.Mesh(geometry, colliderMaterial);
    collider.name = spec.colliderName;
    collider.position.copy(center);
    collider.userData.generatedCollider = true;
    collider.userData.selectionRoot = root;
    applyColliderMeta(collider, spec);
    scene.add(collider);
  });
}

function prepareExistingColliders(scene: THREE.Object3D) {
  scene.traverse((object) => {
    if (!object.name.endsWith("_collider") || !(object instanceof THREE.Mesh)) return;

    const meta = getColliderMeta(object.name);
    if (!meta && object.userData.generatedCollider !== true) return;

    object.visible = true;
    object.userData.__isCollider = true;
    object.userData.selectable = true;
    object.userData.selectionRoot = object.userData.selectionRoot ?? getRootForCollider(scene, object) ?? object.parent ?? object;

    if (meta) applyColliderMeta(object, meta);

    if (object instanceof THREE.Mesh) {
      object.material = colliderMaterial;
      object.castShadow = false;
      object.receiveShadow = false;
      object.renderOrder = -1;
    }
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

  return [...meetingFallback, ...hardwareFallback].find((item) => item.colliderName === name) ?? null;
}

function getUsableBounds(scene: THREE.Object3D) {
  const colliderBox = new THREE.Box3();
  let hasCollider = false;

  scene.traverse((object) => {
    if (object.userData.__isCollider !== true || !object.visible) return;
    colliderBox.union(new THREE.Box3().setFromObject(object));
    hasCollider = true;
  });

  if (hasCollider) return colliderBox;

  const visualBox = new THREE.Box3();
  let hasVisual = false;
  scene.traverse((object) => {
    if (!object.visible || shouldHideArtifact(object.name)) return;
    if (!(object instanceof THREE.Mesh)) return;
    visualBox.union(new THREE.Box3().setFromObject(object));
    hasVisual = true;
  });

  return hasVisual ? visualBox : null;
}

useGLTF.preload("/model/workstation_area.glb");
useGLTF.preload("/model/meeting_area.glb");
useGLTF.preload("/model/hardware_area.glb");
