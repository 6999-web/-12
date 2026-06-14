import * as THREE from "three";
import { useEffect } from "react";
import { useTexture } from "@react-three/drei";
import { materials, ROOM } from "./constants";
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
    <mesh name={name} position={position}>
      <boxGeometry args={size} />
      <primitive object={material} attach="material" />
    </mesh>
  );
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

      <DisplayWall
        name="Zone_DisplayWall_01"
        position={[-1.7, 0, -halfD + 0.18]}
        size={[8.4, 1.55, 0.08]}
        texturePath="/model/310正常3d交互场景/textures/display_wall_01.jpg"
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
        texturePath="/model/310正常3d交互场景/textures/display_wall_02.jpg"
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
        texturePath="/model/310正常3d交互场景/textures/people_wall.png.jpg"
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
