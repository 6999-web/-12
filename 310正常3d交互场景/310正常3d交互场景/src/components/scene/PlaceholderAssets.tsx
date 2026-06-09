import { Edges, Text } from "@react-three/drei";
import { materials, ROOM } from "./constants";
import type { Vec3 } from "./types";

type SelectableMeta = {
  name: string;
  type: string;
  description: string;
  status?: string;
};

function getSelectableUserData(meta: SelectableMeta) {
  return {
    selectable: true,
    name: meta.name,
    type: meta.type,
    status: meta.status ?? "在线",
    description: meta.description,
  };
}

function GlowBox({ name, size, position }: { name: string; size: Vec3; position: Vec3 }) {
  return (
    <mesh name={name} position={position}>
      <boxGeometry args={size} />
      <primitive object={materials.Wall_Light_Edge} attach="material" />
    </mesh>
  );
}

function Label({ text, position, rotationY = 0 }: { text: string; position: Vec3; rotationY?: number }) {
  return (
    <Text position={position} rotation={[0, rotationY, 0]} fontSize={0.22} color="#E8FAFF" anchorX="center" anchorY="middle">
      {text}
    </Text>
  );
}

function EquipmentBlock({
  name,
  label,
  position,
  size,
  rotationY = 0,
  meta,
}: {
  name: string;
  label: string;
  position: Vec3;
  size: Vec3;
  rotationY?: number;
  meta: SelectableMeta;
}) {
  return (
    <group name={name} position={position} rotation-y={rotationY} userData={getSelectableUserData(meta)}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <primitive object={materials.Device} attach="material" />
        <Edges color="#8CDEFF" />
      </mesh>
      <GlowBox name={`${name}_Glow_Base`} size={[size[0] + 0.08, 0.035, 0.045]} position={[0, -size[1] / 2 + 0.05, size[2] / 2 + 0.03]} />
      <Label text={label} position={[0, size[1] / 2 + 0.28, 0]} />
    </group>
  );
}

function TopAchievementShelf() {
  return (
    <group name="DisplayWall_01_Trophy_Strip">
      {Array.from({ length: 12 }, (_, index) => (
        <mesh key={index} name={`DisplayWall_01_Trophy_${index + 1}`} position={[-5.55 + index * 0.78, 0.72, -4.16]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.22, 12]} />
          <meshStandardMaterial color="#F0D07B" metalness={0.45} roughness={0.28} emissive="#4FC3FF" emissiveIntensity={0.018} />
        </mesh>
      ))}
    </group>
  );
}

export function PlaceholderAssets() {
  const halfW = ROOM.width / 2;

  return (
    <group name="PlaceholderAssets_NonReplaced">
      <TopAchievementShelf />
      <EquipmentBlock
        name="Network_Device"
        label="网络设备"
        position={[-11.25, 0.75, -3.95]}
        size={[0.82, 1.0, 0.72]}
        meta={{
          name: "网络设备",
          type: "network-equipment",
          description: "左上角网络设备区域，预留交换、路由与边缘计算设备展示位置。",
        }}
      />
      <EquipmentBlock
        name="AirConditioner_01"
        label="空调1"
        position={[-11.0, 0.62, 3.82]}
        size={[0.95, 0.78, 0.75]}
        meta={{
          name: "空调1",
          type: "air-conditioner",
          description: "左下角环境设备占位，用于后续展示温控与能耗状态。",
        }}
      />
      <EquipmentBlock
        name="AirConditioner_02"
        label="空调2"
        position={[11.12, 1.1, -3.88]}
        size={[0.78, 0.56, 0.58]}
        meta={{
          name: "空调2",
          type: "air-conditioner",
          description: "右上侧环境设备占位，用于后续展示温控与能耗状态。",
        }}
      />
      <EquipmentBlock
        name="Water_Dispenser"
        label="饮水机"
        position={[halfW - 0.48, 0.82, -0.92]}
        size={[0.42, 0.95, 0.52]}
        rotationY={Math.PI / 2}
        meta={{
          name: "饮水机",
          type: "water-dispenser",
          description: "右侧墙生活设备占位，保持与平面图一致的设备区域布局。",
        }}
      />
      <EquipmentBlock
        name="Printer_RightWall"
        label="打印机"
        position={[halfW - 0.48, 0.82, 0.95]}
        size={[0.5, 0.95, 0.55]}
        rotationY={Math.PI / 2}
        meta={{
          name: "打印机",
          type: "printer",
          description: "右侧墙打印设备占位，用于后续接入打印状态与资产信息。",
        }}
      />
      <Label text="人员展示墙" position={[-11.7, 1.45, -0.95]} rotationY={Math.PI / 2} />
      <Label text="成果展示墙1" position={[-1.7, 2.42, -4.26]} />
      <Label text="成果展示墙2" position={[5.02, 1.62, -0.45]} rotationY={Math.PI / 2} />
      <Label text="门口1" position={[-9.25, 2.58, -4.35]} />
      <Label text="门口2" position={[8.5, 2.58, -4.35]} />
    </group>
  );
}
