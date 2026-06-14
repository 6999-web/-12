import { ROOM } from "./constants";

export function LightSystem() {
  return (
    <group name="LightSystem">
      <ambientLight name="Ambient_CoolWhite" intensity={1.25} color="#F4FBFF" />
      <hemisphereLight name="Hemisphere_Lab_Fill" intensity={1.1} color="#FFFFFF" groundColor="#9FB6CE" />
      <directionalLight name="Main_Soft_Key" position={[4.5, 8, 6]} intensity={2.15} color="#FFFFFF" />
      <pointLight name="Edge_Blue_Left" position={[-ROOM.width / 2 + 0.4, 2.4, 0]} intensity={1.4} color="#4FC3FF" distance={8} />
      <pointLight name="Edge_Blue_Right" position={[ROOM.width / 2 - 0.4, 2.4, 0]} intensity={1.4} color="#4FC3FF" distance={8} />
      <pointLight name="DisplayWall_01_Blue_Rim" position={[-1.7, 2.1, -4.1]} intensity={1.65} color="#4FC3FF" distance={7} />
      <pointLight name="DisplayWall_02_Blue_Rim" position={[5.15, 1.9, -0.45]} intensity={1.25} color="#4FC3FF" distance={5} />
      <pointLight name="Workstation_Even_Light" position={[-3.9, 5.2, 0]} intensity={1.25} color="#F7FCFF" distance={12} />
      <pointLight name="Meeting_Focus_Light" position={[8.1, 4.5, -0.35]} intensity={1.45} color="#FFFFFF" distance={7} />
      <pointLight name="Hardware_White_Blue_Light" position={[7.4, 3.2, 3.5]} intensity={1.2} color="#EAF9FF" distance={6} />
    </group>
  );
}
