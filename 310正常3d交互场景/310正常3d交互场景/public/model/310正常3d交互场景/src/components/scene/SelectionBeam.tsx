import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const TECH_BLUE = "#4FC3FF";

type SelectionBeamProps = {
  center: THREE.Vector3;
  size: THREE.Vector3;
};

export function SelectionBeam({ center, size }: SelectionBeamProps) {
  const scanRef = useRef<THREE.Mesh>(null);
  const beamGeometry = useMemo(() => new THREE.BoxGeometry(size.x + 0.12, 0.035, size.z + 0.12), [size]);
  const shellGeometry = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(size.x + 0.16, size.y + 0.18, size.z + 0.16), 24), [size]);

  useFrame(({ clock }) => {
    if (!scanRef.current) return;
    const phase = (clock.elapsedTime * 0.38) % 1;
    scanRef.current.position.y = center.y - size.y / 2 + phase * size.y;

    const material = scanRef.current.material;
    if (material instanceof THREE.MeshBasicMaterial) {
      material.opacity = 0.08 + Math.sin(phase * Math.PI) * 0.12;
    }
  });

  return (
    <group name="Selection_Data_Scan_Beam">
      <lineSegments name="Selection_Data_Scan_Shell" position={center} geometry={shellGeometry} renderOrder={17}>
        <lineBasicMaterial color={TECH_BLUE} transparent opacity={0.14} depthTest={false} />
      </lineSegments>
      <mesh ref={scanRef} name="Selection_Vertical_Scan_Line" position={[center.x, center.y - size.y / 2, center.z]} geometry={beamGeometry} renderOrder={18}>
        <meshBasicMaterial color={TECH_BLUE} transparent opacity={0.12} depthWrite={false} depthTest={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
