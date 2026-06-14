import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
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
      <fog attach="fog" args={["#061528", 18, 42]} />
      <group name="Lab_310_DigitalTwin_Base" rotation-y={-0.035}>
        <FloorSystem />
        <WallSystem />
        <ModelAssets />
        <PersonnelPlaceholders />
        <PlaceholderAssets />
        <LightSystem />
      </group>
    </>
  );
}

export function LabScene() {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.25]}
      frameloop="always"
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <SceneContent />
    </Canvas>
  );
}
