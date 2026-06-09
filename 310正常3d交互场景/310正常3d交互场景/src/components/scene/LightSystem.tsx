import { ROOM } from "./constants";

function LinearLight({ name, position, size }: { name: string; position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh name={name} position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial color="#C8F3FF" transparent opacity={0.78} />
    </mesh>
  );
}

export function LightSystem() {
  return (
    <group name="LightSystem">
      <ambientLight name="Ambient_CoolWhite" intensity={1.25} color="#F4FBFF" />
      <hemisphereLight name="Hemisphere_Lab_Fill" intensity={1.1} color="#FFFFFF" groundColor="#9FB6CE" />
      <directionalLight name="Main_Soft_Key" position={[4.5, 8, 6]} intensity={2.15} color="#FFFFFF" castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight name="Edge_Blue_Left" position={[-ROOM.width / 2 + 0.4, 2.4, 0]} intensity={1.4} color="#4FC3FF" distance={8} />
      <pointLight name="Edge_Blue_Right" position={[ROOM.width / 2 - 0.4, 2.4, 0]} intensity={1.4} color="#4FC3FF" distance={8} />
      <pointLight name="DisplayWall_01_Blue_Rim" position={[-1.7, 2.1, -4.1]} intensity={1.65} color="#4FC3FF" distance={7} />
      <pointLight name="DisplayWall_02_Blue_Rim" position={[5.15, 1.9, -0.45]} intensity={1.25} color="#4FC3FF" distance={5} />
      <pointLight name="Workstation_Even_Light" position={[-3.9, 5.2, 0]} intensity={1.25} color="#F7FCFF" distance={12} />
      <pointLight name="Meeting_Focus_Light" position={[8.1, 4.5, -0.35]} intensity={1.45} color="#FFFFFF" distance={7} />
      <pointLight name="Hardware_White_Blue_Light" position={[7.4, 3.2, 3.5]} intensity={1.2} color="#EAF9FF" distance={6} />

      <LinearLight name="Ceiling_Linear_Light_Workstation_01" position={[-6.5, 2.95, -0.6]} size={[4.8, 0.035, 0.055]} />
      <LinearLight name="Ceiling_Linear_Light_Workstation_02" position={[-0.2, 2.95, -0.6]} size={[4.8, 0.035, 0.055]} />
      <LinearLight name="Ceiling_Linear_Light_Meeting" position={[8.1, 2.95, -0.35]} size={[2.7, 0.035, 0.055]} />
      <LinearLight name="Ceiling_Linear_Light_Hardware" position={[7.4, 2.5, 3.4]} size={[4.8, 0.035, 0.055]} />
    </group>
  );
}
