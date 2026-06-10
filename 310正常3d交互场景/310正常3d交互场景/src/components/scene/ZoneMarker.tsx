import { Edges, Text } from "@react-three/drei";
import { materials } from "./constants";
import type { Vec3 } from "./types";

type ZoneMarkerProps = {
  name: string;
  label?: string;
  position: Vec3;
  size: [number, number];
};

export function ZoneMarker({ name, label, position, size }: ZoneMarkerProps) {
  return (
    <group name={name} position={position}>
      <mesh name={`${name}_HUD_Fill`} rotation-x={-Math.PI / 2}>
        <planeGeometry args={size} />
        <primitive object={materials.Zone_Fill} attach="material" />
        <Edges color="#8CDEFF" />
      </mesh>
      {label ? (
        <Text
          name={`${name}_Label`}
          position={[0, 0.035, -size[1] / 2 + 0.26]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.22}
          color="#DDF7FF"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      ) : null}
    </group>
  );
}
