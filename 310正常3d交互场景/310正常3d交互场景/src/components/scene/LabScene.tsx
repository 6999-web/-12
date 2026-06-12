import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, GizmoHelper, GizmoViewport, OrbitControls, PerspectiveCamera, Sky } from "@react-three/drei";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { FloorSystem } from "./FloorSystem";
import { WallSystem } from "./WallSystem";
import { LightSystem } from "./LightSystem";
import { PlaceholderAssets } from "./PlaceholderAssets";
import { ModelAssets } from "./ModelAssets";
import { PersonnelPlaceholders } from "./PersonnelPlaceholders";
import { FlyKeyboardControls } from "./FlyKeyboardControls";
import { SelectionSystem } from "./SelectionSystem";

function SceneContent() {
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <>
      <PerspectiveCamera makeDefault position={[2.6, 10.5, 3.35]} fov={38} />
      <OrbitControls
        ref={orbitControlsRef}
        target={[0, 0.55, 0]}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={5}
        maxDistance={26}
      />
      <FlyKeyboardControls orbitControlsRef={orbitControlsRef} />
      <SelectionSystem />
      <GizmoHelper alignment="top-right" margin={[80, 80]}>
        <GizmoViewport axisColors={["#ef4444", "#22c55e", "#3b82f6"]} labelColor="#ffffff" />
      </GizmoHelper>
      <Sky distance={450000} sunPosition={[1, 0.55, 0.8]} inclination={0.52} azimuth={0.22} />
      <fog attach="fog" args={["#DDEBFA", 18, 42]} />
      <group name="Lab_310_DigitalTwin_Base" rotation-y={-0.035}>
        <FloorSystem />
        <WallSystem />
        <ModelAssets />
        <PersonnelPlaceholders />
        <PlaceholderAssets />
        <LightSystem />
        <ContactShadows position={[0, 0.05, 0]} opacity={0.28} scale={25} blur={2.6} far={7} />
      </group>
    </>
  );
}

export function LabScene() {
  return (
    <Canvas
      className="h-full w-full"
      shadows
      gl={{
        antialias: true,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.22;
      }}
    >
      <color attach="background" args={["#BFD4EA"]} />
      <SceneContent />
    </Canvas>
  );
}
