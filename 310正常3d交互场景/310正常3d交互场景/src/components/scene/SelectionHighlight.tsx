import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { ObjectInfoCard } from "../ui/ObjectInfoCard";
import { SelectionBeam } from "./SelectionBeam";
import { SelectionPulse } from "./SelectionPulse";
import { SelectionScanRing } from "./SelectionScanRing";

export type SelectionMeta = {
  name: string;
  type: string;
  status?: string;
  description: string;
};

type SelectionHighlightProps = {
  object: THREE.Object3D | null;
  meta: SelectionMeta | null;
  selectionId: number;
  isExiting?: boolean;
};

export function SelectionHighlight({ object, meta, selectionId, isExiting = false }: SelectionHighlightProps) {
  const outlineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const bounds = useMemo(() => getObjectBounds(object), [object]);
  const edgeGeometry = useMemo(() => {
    if (!bounds) return null;
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(bounds.size.x + 0.08, bounds.size.y + 0.08, bounds.size.z + 0.08), 24);
  }, [bounds]);

  useFrame(({ clock }) => {
    if (!outlineMaterialRef.current) return;
    const breathe = (Math.sin(clock.elapsedTime * 2.4) + 1) / 2;
    outlineMaterialRef.current.opacity = THREE.MathUtils.lerp(0.4, 1.0, breathe);
  });

  if (!object || !meta || !bounds || !edgeGeometry) return null;

  const scanRadius = Math.max(0.48, Math.max(bounds.size.x, bounds.size.z) * 0.62);

  return (
    <group name="Selection_Highlight_Root" userData={{ selectionHelper: true }}>
      <SelectionBeam center={bounds.center} size={bounds.size} />
      <lineSegments name="Selection_Blue_Outline" position={bounds.center} geometry={edgeGeometry} renderOrder={22}>
        <lineBasicMaterial ref={outlineMaterialRef} color="#4FC3FF" transparent opacity={0.72} depthTest={false} />
      </lineSegments>
      <SelectionScanRing center={bounds.center} radius={scanRadius} />
      <SelectionPulse center={bounds.center} radius={scanRadius} selectionId={selectionId} />
      <Html position={[bounds.center.x + bounds.size.x / 2 + 0.45, bounds.center.y + bounds.size.y / 2 + 0.34, bounds.center.z]} distanceFactor={9} zIndexRange={[10, 0]}>
        <ObjectInfoCard name={meta.name} type={meta.type} status={meta.status} description={meta.description} isExiting={isExiting} />
      </Html>
    </group>
  );
}

function getObjectBounds(object: THREE.Object3D | null) {
  if (!object) return null;
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return null;

  return {
    center: box.getCenter(new THREE.Vector3()),
    size: box.getSize(new THREE.Vector3()),
  };
}
