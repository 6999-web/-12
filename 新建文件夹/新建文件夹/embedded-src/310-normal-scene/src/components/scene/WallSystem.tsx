import * as THREE from "three";
import { useEffect } from "react";
import { useTexture } from "@react-three/drei";
import { materials, ROOM } from "./constants";
import type { Vec3 } from "./types";

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

  return (
    <group name="WallSystem">
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
