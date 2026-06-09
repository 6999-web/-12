import * as THREE from "three";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Edges, useTexture } from "@react-three/drei";
import { materials, ROOM, wallPanelLines } from "./constants";
import type { Vec3 } from "./types";

type BoxProps = {
  name: string;
  size: Vec3;
  position: Vec3;
  material: THREE.Material;
};

type DisplayWallMeta = {
  name: string;
  type: string;
  description: string;
};

type DisplayWallProps = {
  name: string;
  position: Vec3;
  size: Vec3;
  texturePath: string;
  rotationY?: number;
  meta: DisplayWallMeta;
};

function WallBox({ name, size, position, material }: BoxProps) {
  return (
    <mesh name={name} position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <primitive object={material} attach="material" />
      <Edges color="#D7E7F4" threshold={24} />
    </mesh>
  );
}

function LightEdge({ name, size, position }: Omit<BoxProps, "material">) {
  return <WallBox name={name} size={size} position={position} material={materials.Wall_Light_Edge} />;
}

function WallPanelLines({ name, side }: { name: string; side: "top" | "left" | "right" | "bottom" }) {
  const lines: ReactNode[] = [];
  const halfW = ROOM.width / 2;
  const halfD = ROOM.depth / 2;
  const yStart = 0.35;

  if (side === "top" || side === "bottom") {
    const z = side === "top" ? -halfD + 0.105 : halfD - 0.105;
    for (let x = -halfW + wallPanelLines.verticalSpacing; x < halfW; x += wallPanelLines.verticalSpacing) {
      lines.push(<LightEdge key={`${side}-v-${x}`} name={`${name}_Vertical_${x.toFixed(1)}`} size={[0.018, 2.2, 0.028]} position={[x, 1.52, z]} />);
    }
    wallPanelLines.horizontal.forEach((y) => {
      lines.push(<LightEdge key={`${side}-h-${y}`} name={`${name}_Horizontal_${y}`} size={[ROOM.width - 0.8, 0.016, 0.03]} position={[0, yStart + y, z]} />);
    });
  } else {
    const x = side === "left" ? -halfW + 0.105 : halfW - 0.105;
    for (let z = -halfD + wallPanelLines.verticalSpacing; z < halfD; z += wallPanelLines.verticalSpacing) {
      lines.push(<LightEdge key={`${side}-v-${z}`} name={`${name}_Vertical_${z.toFixed(1)}`} size={[0.028, 2.2, 0.018]} position={[x, 1.52, z]} />);
    }
    wallPanelLines.horizontal.forEach((y) => {
      lines.push(<LightEdge key={`${side}-h-${y}`} name={`${name}_Horizontal_${y}`} size={[0.03, 0.016, ROOM.depth - 0.8]} position={[x, yStart + y, 0]} />);
    });
  }

  return <group name={name}>{lines}</group>;
}

function DisplayWall({ name, position, size, texturePath, rotationY = 0, meta }: DisplayWallProps) {
  const texture = useTexture(texturePath);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <group
      name={name}
      position={position}
      rotation-y={rotationY}
      userData={{
        selectable: true,
        name: meta.name,
        type: meta.type,
        status: "在线",
        description: meta.description,
      }}
    >
      <mesh name={`${name}_Glass_Backplate`} position={[0, 1.35, 0]}>
        <boxGeometry args={size} />
        <primitive object={materials.Display_Glass} attach="material" />
      </mesh>
      <mesh name={`${name}_Texture_Panel`} position={[0, 1.35, size[2] / 2 + 0.012]} renderOrder={4}>
        <planeGeometry args={[size[0], size[1]]} />
        <meshBasicMaterial map={texture} transparent opacity={0.94} toneMapped={false} />
      </mesh>
      <LightEdge name={`${name}_Glow_Top`} size={[size[0] + 0.12, 0.04, 0.05]} position={[0, 2.28, 0.02]} />
      <LightEdge name={`${name}_Glow_Bottom`} size={[size[0] + 0.12, 0.04, 0.05]} position={[0, 0.44, 0.02]} />
      <LightEdge name={`${name}_Glow_Left`} size={[0.05, 1.9, 0.05]} position={[-size[0] / 2 - 0.04, 1.35, 0.02]} />
      <LightEdge name={`${name}_Glow_Right`} size={[0.05, 1.9, 0.05]} position={[size[0] / 2 + 0.04, 1.35, 0.02]} />
    </group>
  );
}

export function WallSystem() {
  const halfW = ROOM.width / 2;
  const halfD = ROOM.depth / 2;
  const h = ROOM.wallHeight;
  const t = ROOM.wallThickness;
  const y = h / 2;

  return (
    <group name="WallSystem">
      <WallBox name="Wall_Basic_Left" size={[t, h, ROOM.depth]} position={[-halfW, y, 0]} material={materials.Wall_Basic} />
      <WallBox name="Wall_Basic_Right" size={[t, h, ROOM.depth]} position={[halfW, y, 0]} material={materials.Wall_Basic} />
      <WallBox name="Wall_Basic_Bottom" size={[ROOM.width, h * 0.55, t]} position={[0, h * 0.275, halfD]} material={materials.Wall_Basic} />
      <WallBox name="Wall_Top_Left_Of_Door1" size={[2.0, h, t]} position={[-10.95, y, -halfD]} material={materials.Wall_Basic} />
      <WallBox name="Wall_Top_Between_Door1_And_Display" size={[1.8, h, t]} position={[-7.8, y, -halfD]} material={materials.Wall_Basic} />
      <WallBox name="Wall_Top_Display_Back" size={[8.7, h, t]} position={[-1.7, y, -halfD]} material={materials.Wall_Basic} />
      <WallBox name="Wall_Top_Between_Display_And_Door2" size={[2.15, h, t]} position={[5.95, y, -halfD]} material={materials.Wall_Basic} />
      <WallBox name="Wall_Top_Right_Of_Door2" size={[2.15, h, t]} position={[10.95, y, -halfD]} material={materials.Wall_Basic} />

      <WallBox name="Wall_Top_Structure_Beam" size={[ROOM.width + 0.3, 0.18, 0.18]} position={[0, h + 0.16, -halfD]} material={materials.Wall_Trim} />
      <WallBox name="Wall_Left_Structure_Beam" size={[0.18, 0.18, ROOM.depth]} position={[-halfW, h + 0.16, 0]} material={materials.Wall_Trim} />
      <WallBox name="Wall_Right_Structure_Beam" size={[0.18, 0.18, ROOM.depth]} position={[halfW, h + 0.16, 0]} material={materials.Wall_Trim} />
      <WallBox name="Wall_Bottom_Structure_Beam" size={[ROOM.width + 0.3, 0.18, 0.18]} position={[0, h + 0.16, halfD]} material={materials.Wall_Trim} />

      <LightEdge name="Wall_Light_Edge_Left_Corner" size={[0.05, h + 0.3, 0.05]} position={[-halfW + 0.08, 1.48, -halfD + 0.08]} />
      <LightEdge name="Wall_Light_Edge_Right_Corner" size={[0.05, h + 0.3, 0.05]} position={[halfW - 0.08, 1.48, -halfD + 0.08]} />
      <LightEdge name="Wall_Light_Edge_Bottom_Left" size={[0.05, h * 0.55, 0.05]} position={[-halfW + 0.08, 0.86, halfD - 0.08]} />
      <LightEdge name="Wall_Light_Edge_Bottom_Right" size={[0.05, h * 0.55, 0.05]} position={[halfW - 0.08, 0.86, halfD - 0.08]} />

      <LightEdge name="Door_01_Glow_Header" size={[1.35, 0.05, 0.07]} position={[-9.25, 2.25, -halfD + 0.08]} />
      <LightEdge name="Door_02_Glow_Header" size={[1.35, 0.05, 0.07]} position={[8.5, 2.25, -halfD + 0.08]} />

      <WallPanelLines name="Wall_Panel_Lines_Top" side="top" />
      <WallPanelLines name="Wall_Panel_Lines_Left" side="left" />
      <WallPanelLines name="Wall_Panel_Lines_Right" side="right" />

      <DisplayWall
        name="Zone_DisplayWall_01"
        position={[-1.7, 0, -halfD + 0.18]}
        size={[8.4, 1.55, 0.08]}
        texturePath="/textures/display_wall_01.jpg"
        meta={{
          name: "成果展示墙1",
          type: "achievement-display-wall",
          description: "展示实验室项目、论文、专利和竞赛成果的顶部主展示墙。",
        }}
      />
      <DisplayWall
        name="Zone_DisplayWall_02"
        position={[5.15, 0, -0.45]}
        size={[4.3, 1.65, 0.08]}
        texturePath="/textures/display_wall_02.jpg"
        rotationY={Math.PI / 2}
        meta={{
          name: "成果展示墙2",
          type: "achievement-display-wall",
          description: "工位右侧的成果展示墙，用于补充展示团队成果与荣誉信息。",
        }}
      />
      <DisplayWall
        name="Zone_PeopleWall"
        position={[-halfW + 0.18, 0, -0.95]}
        size={[3.8, 1.65, 0.08]}
        texturePath="/textures/people_wall.png.jpg"
        rotationY={Math.PI / 2}
        meta={{
          name: "人员展示墙",
          type: "member-display-wall",
          description: "左侧人员展示墙，用于展示实验室成员、角色与团队信息。",
        }}
      />
    </group>
  );
}
