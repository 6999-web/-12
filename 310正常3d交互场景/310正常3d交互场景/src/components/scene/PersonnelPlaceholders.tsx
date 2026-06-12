import { Clone, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import type { Vec3 } from "./types";

const CAT_MODEL_URL = "/model/felynepalico.glb";

const catColliderMaterial = new THREE.MeshBasicMaterial({
  color: "#4FC3FF",
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

type CatOccupantSpec = {
  id: string;
  name: string;
  position: Vec3;
  rotationY: number;
  status: string;
  description: string;
};

const occupants: CatOccupantSpec[] = [
  {
    id: "member_seat_a03",
    name: "成员 A03",
    position: [-8.25, 0.05, -1.42],
    rotationY: Math.PI * 0.08,
    status: "在岗",
    description: "AI 视觉小组成员，占位于左侧工位区，可后续绑定姓名、课题和签到状态。",
  },
  {
    id: "member_seat_a06",
    name: "成员 A06",
    position: [-5.72, 0.05, -1.48],
    rotationY: -Math.PI * 0.1,
    status: "专注中",
    description: "智能实验室成员状态占位，当前用于展示人员在岗与任务信息。",
  },
  {
    id: "member_seat_b02",
    name: "成员 B02",
    position: [-3.25, 0.05, 1.52],
    rotationY: Math.PI * 0.94,
    status: "调试中",
    description: "硬件联调方向成员，占位在中部工位，可接入设备调试与项目进度。",
  },
  {
    id: "member_seat_b05",
    name: "成员 B05",
    position: [-0.75, 0.05, 1.46],
    rotationY: Math.PI * 1.05,
    status: "在线",
    description: "软件开发方向成员，占位在右侧工位，可后续接入成员档案与在线状态。",
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

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.frustumCulled = true;
      }
    });
  }, [scene]);

  return (
    <group name={`${occupant.id}_root`} position={occupant.position} rotation-y={occupant.rotationY}>
      <group name={`${occupant.id}_model`} scale={0.34} rotation-y={Math.PI}>
        <Clone object={scene} />
      </group>
      <mesh
        name={`${occupant.id}_collider`}
        position={[0, 0.42, 0]}
        material={catColliderMaterial}
        userData={{
          __isCollider: true,
          selectable: true,
          object_id: occupant.id,
          display_name: occupant.name,
          name: occupant.name,
          type: "人员状态占位",
          status: occupant.status,
          description: occupant.description,
        }}
        renderOrder={-1}
      >
        <boxGeometry args={[0.58, 0.84, 0.58]} />
      </mesh>
    </group>
  );
}

useGLTF.preload(CAT_MODEL_URL);
