import { materials, ROOM } from "./constants";

export function FloorSystem() {
  return (
    <group name="FloorSystem">
      <mesh name="Floor_Tile_Base" receiveShadow>
        <boxGeometry args={[ROOM.width, 0.08, ROOM.depth]} />
        <primitive object={materials.Floor_Tile_Base} attach="material" />
      </mesh>
    </group>
  );
}
