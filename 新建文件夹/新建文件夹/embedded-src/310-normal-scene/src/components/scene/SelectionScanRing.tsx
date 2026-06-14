import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const TECH_BLUE = "#4FC3FF";
const LIGHT_BLUE = "#9BE8FF";
const SCAN_DURATION = 1.5;

type SelectionScanRingProps = {
  center: THREE.Vector3;
  radius: number;
};

export function SelectionScanRing({ center, radius }: SelectionScanRingProps) {
  const waveRef = useRef<THREE.Mesh>(null);
  const baseGeometry = useMemo(() => new THREE.RingGeometry(radius * 0.82, radius, 96), [radius]);
  const waveGeometry = useMemo(() => new THREE.RingGeometry(radius * 0.9, radius, 96), [radius]);

  useFrame(({ clock }) => {
    if (!waveRef.current) return;
    const phase = (clock.elapsedTime % SCAN_DURATION) / SCAN_DURATION;
    const scale = THREE.MathUtils.lerp(0.16, 1.28, phase);
    waveRef.current.scale.setScalar(scale);

    const material = waveRef.current.material;
    if (material instanceof THREE.MeshBasicMaterial) {
      material.opacity = 0.45 * (1 - phase);
    }
  });

  return (
    <group name="Selection_HUD_Radar_Ring" position={[center.x, 0.075, center.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh name="Selection_HUD_Base_Range" geometry={baseGeometry} renderOrder={18}>
        <meshBasicMaterial color={LIGHT_BLUE} transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={waveRef} name="Selection_HUD_Expanding_Wave" geometry={waveGeometry} renderOrder={19}>
        <meshBasicMaterial color={TECH_BLUE} transparent opacity={0.45} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
