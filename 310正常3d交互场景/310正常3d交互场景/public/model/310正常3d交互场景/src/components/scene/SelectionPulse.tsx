import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const TECH_BLUE = "#4FC3FF";
const PULSE_DURATION = 0.35;

type SelectionPulseProps = {
  center: THREE.Vector3;
  radius: number;
  selectionId: number;
};

export function SelectionPulse({ center, radius, selectionId }: SelectionPulseProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(0);
  const geometry = useMemo(() => new THREE.RingGeometry(radius * 0.78, radius, 96), [radius]);

  useEffect(() => {
    startTime.current = performance.now() / 1000;
    if (pulseRef.current) pulseRef.current.visible = true;
  }, [selectionId]);

  useFrame(() => {
    if (!pulseRef.current) return;
    const elapsed = performance.now() / 1000 - startTime.current;
    const phase = THREE.MathUtils.clamp(elapsed / PULSE_DURATION, 0, 1);
    pulseRef.current.scale.setScalar(THREE.MathUtils.lerp(0.22, 1.25, phase));
    pulseRef.current.visible = phase < 1;

    const material = pulseRef.current.material;
    if (material instanceof THREE.MeshBasicMaterial) {
      material.opacity = 0.36 * (1 - phase);
    }
  });

  return (
    <mesh
      ref={pulseRef}
      name="Selection_Click_Energy_Pulse"
      position={[center.x, 0.09, center.z]}
      rotation={[-Math.PI / 2, 0, 0]}
      geometry={geometry}
      renderOrder={21}
    >
      <meshBasicMaterial color={TECH_BLUE} transparent opacity={0.28} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}
