import * as THREE from "three";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { materials, ROOM } from "./constants";
import { ZoneMarker } from "./ZoneMarker";

function LineSegment({ name, points, opacity = 0.34, color = "#B7BCC6" }: { name: string; points: THREE.Vector3[]; opacity?: number; color?: string }) {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line name={name} geometry={geometry}>
      <lineBasicMaterial attach="material" color={color} transparent opacity={opacity} />
    </line>
  );
}

function TileGrid() {
  const lines: ReactNode[] = [];
  const halfW = ROOM.width / 2;
  const halfD = ROOM.depth / 2;
  const y = 0.018;

  for (let x = -halfW; x <= halfW + 0.001; x += ROOM.tileSize) {
    lines.push(
      <group key={`tile-x-${x.toFixed(2)}`} position={[0, y, 0]}>
        <LineSegment
          name={`Floor_Tile_Grid_X_${x.toFixed(2)}`}
          points={[
            new THREE.Vector3(x, 0, -halfD),
            new THREE.Vector3(x, 0, halfD),
          ]}
        />
      </group>,
    );
  }

  for (let z = -halfD; z <= halfD + 0.001; z += ROOM.tileSize) {
    lines.push(
      <group key={`tile-z-${z.toFixed(2)}`} position={[0, y, 0]}>
        <LineSegment
          name={`Floor_Tile_Grid_Z_${z.toFixed(2)}`}
          points={[
            new THREE.Vector3(-halfW, 0, z),
            new THREE.Vector3(halfW, 0, z),
          ]}
        />
      </group>,
    );
  }

  return <group name="Floor_Tile_600mm_Grid">{lines}</group>;
}

function HudPath({ name, points }: { name: string; points: [number, number][] }) {
  const vectors = points.map(([x, z]) => new THREE.Vector3(x, 0.035, z));

  return <LineSegment name={name} points={vectors} color="#4FC3FF" opacity={0.62} />;
}

export function FloorSystem() {
  return (
    <group name="FloorSystem">
      <mesh name="Floor_Tile_Base" receiveShadow>
        <boxGeometry args={[ROOM.width, 0.08, ROOM.depth]} />
        <primitive object={materials.Floor_Tile_Base} attach="material" />
      </mesh>
      <TileGrid />
      <ZoneMarker name="Zone_Workstations" label="60 工位区" position={[-3.9, 0.052, 0.08]} size={[13.7, 6.8]} />
      <ZoneMarker name="Zone_Meeting" label="会议区 + 大屏" position={[8.15, 0.054, -0.35]} size={[4.65, 5.9]} />
      <ZoneMarker name="Zone_Hardware" label="硬件工位区" position={[7.4, 0.056, 3.55]} size={[6.2, 1.55]} />
      <HudPath
        name="Floor_HUD_Path_Main"
        points={[
          [-10.85, 3.65],
          [-8.7, 3.65],
          [-8.1, 2.9],
          [3.8, 2.9],
          [4.75, 2.1],
          [5.55, 2.1],
          [6.1, 3.62],
          [10.65, 3.62],
        ]}
      />
      <HudPath
        name="Floor_HUD_Path_Display"
        points={[
          [-10.7, -3.78],
          [-7.5, -3.78],
          [-7.2, -3.38],
          [4.4, -3.38],
          [4.9, -2.6],
        ]}
      />
    </group>
  );
}
