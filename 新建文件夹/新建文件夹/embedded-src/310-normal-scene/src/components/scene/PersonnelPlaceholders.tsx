import { Clone, useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { Vec3 } from "./types";

const CAT_MODEL_URL = "/model/kiki.glb?v=20260612-full-white-2";
const MEMBER_CAT_HEIGHT = 0.74;
const CAT_WHITE_COLOR = new THREE.Color("#fffdf9");

const catColliderMaterial = new THREE.MeshBasicMaterial({
  color: "#4FC3FF",
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

type CatOccupantSpec = {
  id: string;
  name: string;
  studentId: string;
  department: string;
  squad: string;
  seat: string;
  position: Vec3;
  rotationY: number;
  status: string;
};

const occupants: CatOccupantSpec[] = [
  {
    id: "member_seat_cat_01",
    name: "李秉泽",
    studentId: "25104070216",
    department: "教育科技BU、具身智能BU",
    squad: "25数据警务技术专业二区",
    seat: "310 工位 A03",
    position: [-8.459, 0.05, -1.906],
    rotationY: 0,
    status: "在岗",
  },
  {
    id: "member_seat_cat_02",
    name: "陈俊宏",
    studentId: "25104070222",
    department: "教育科技BU",
    squad: "25数据警务技术专业二区",
    seat: "310 工位 A06",
    position: [-6.136, 0.05, -1.887],
    rotationY: 0,
    status: "在岗",
  },
  {
    id: "member_seat_cat_03",
    name: "朱为",
    studentId: "25104070149",
    department: "具身智能BU",
    squad: "25数据警务技术专业一区",
    seat: "310 工位 B02",
    position: [-2.764, 0.05, 1.731],
    rotationY: 0,
    status: "在岗",
  },
  {
    id: "member_seat_cat_04",
    name: "庞力豪",
    studentId: "25104070242",
    department: "教育科技BU",
    squad: "25数据警务技术专业二区",
    seat: "310 工位 B05",
    position: [-1.061, 0.05, 1.731],
    rotationY: 0,
    status: "在岗",
  },
];

export function PersonnelPlaceholders() {
  return (
    <group name="PersonnelPlaceholders">
      {occupants.map((occupant) => (
        <CatOccupant key={occupant.id} occupant={occupant} />
      ))}
    </group>
  );
}

function CatOccupant({ occupant }: { occupant: CatOccupantSpec }) {
  const { scene } = useGLTF(CAT_MODEL_URL);
  const modelTransform = useMemo(() => {
    scene.updateWorldMatrix(true, true);
    const bounds = new THREE.Box3().setFromObject(scene);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = MEMBER_CAT_HEIGHT / Math.max(size.y, 0.001);

    return {
      scale,
      position: [-center.x * scale, -bounds.min.y * scale, -center.z * scale] as Vec3,
    };
  }, [scene]);

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = true;

      const materials = Array.isArray(object.material) ? object.material : [object.material];
      const whiteMaterials = materials.map((material) => {
        const nextMaterial = material.clone();
        if ("color" in nextMaterial && nextMaterial.color instanceof THREE.Color) {
          nextMaterial.color.copy(CAT_WHITE_COLOR);
        }
        if ("metalness" in nextMaterial) nextMaterial.metalness = Math.min(nextMaterial.metalness, 0.12);
        if ("roughness" in nextMaterial) nextMaterial.roughness = Math.max(nextMaterial.roughness, 0.48);
        nextMaterial.needsUpdate = true;
        return nextMaterial;
      });

      object.material = Array.isArray(object.material) ? whiteMaterials : whiteMaterials[0];
    });
  }, [scene]);

  const description = [
    `学号：${occupant.studentId}`,
    `部门：${occupant.department}`,
    `区队：${occupant.squad}`,
    `座位：${occupant.seat}`,
  ].join("\n");

  return (
    <group name={`${occupant.id}_root`} position={occupant.position} rotation-y={occupant.rotationY}>
      <group name={`${occupant.id}_model`} position={modelTransform.position} scale={modelTransform.scale} rotation-y={Math.PI}>
        <Clone object={scene} />
      </group>
      <mesh
        name={`${occupant.id}_collider`}
        position={[0, MEMBER_CAT_HEIGHT / 2, 0]}
        material={catColliderMaterial}
        userData={{
          __isCollider: true,
          selectable: true,
          object_id: occupant.id,
          display_name: occupant.name,
          name: occupant.name,
          type: "人员状态占位",
          status: occupant.status,
          description,
        }}
        renderOrder={-1}
      >
        <boxGeometry args={[0.64, MEMBER_CAT_HEIGHT, 0.64]} />
      </mesh>
    </group>
  );
}

useGLTF.preload(CAT_MODEL_URL);
