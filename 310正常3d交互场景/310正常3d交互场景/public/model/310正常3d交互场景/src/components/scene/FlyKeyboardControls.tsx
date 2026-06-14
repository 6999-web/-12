import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ROOM } from "./constants";

const NORMAL_SPEED = 5;
const SPRINT_SPEED = 10;
const VERTICAL_SPEED = 4;
const MIN_HEIGHT = 1.5;
const MAX_HEIGHT = 18;

const ROOM_PADDING = 0.65;
const MIN_X = -ROOM.width / 2 + ROOM_PADDING;
const MAX_X = ROOM.width / 2 - ROOM_PADDING;
const MIN_Z = -ROOM.depth / 2 + ROOM_PADDING;
const MAX_Z = ROOM.depth / 2 - ROOM_PADDING;

type OrbitTargetRef = RefObject<{
  target: THREE.Vector3;
  update?: () => void;
}>;

type FlyKeyboardControlsProps = {
  orbitControlsRef?: OrbitTargetRef;
};

const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const movement = new THREE.Vector3();
const horizontalMovement = new THREE.Vector3();
const previousCameraPosition = new THREE.Vector3();
const appliedMovement = new THREE.Vector3();

export function FlyKeyboardControls({ orbitControlsRef }: FlyKeyboardControlsProps) {
  const { camera } = useThree();
  const keys = useRef(new Set<string>());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isMovementKey(event.code)) {
        event.preventDefault();
        keys.current.add(event.code);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.code);
    };

    const clearPressedKeys = () => {
      keys.current.clear();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearPressedKeys);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearPressedKeys);
    };
  }, []);

  useFrame((_, delta) => {
    if (keys.current.size === 0) return;

    const frameDelta = Math.min(delta, 0.05);
    previousCameraPosition.copy(camera.position);
    movement.set(0, 0, 0);
    horizontalMovement.set(0, 0, 0);

    camera.getWorldDirection(forward);
    forward.y = 0;

    if (forward.lengthSq() > 0) {
      forward.normalize();
      right.crossVectors(forward, camera.up).normalize();

      const horizontalSpeed = getIsSprinting(keys.current) ? SPRINT_SPEED : NORMAL_SPEED;

      if (keys.current.has("KeyW")) horizontalMovement.add(forward);
      if (keys.current.has("KeyS")) horizontalMovement.sub(forward);
      if (keys.current.has("KeyA")) horizontalMovement.sub(right);
      if (keys.current.has("KeyD")) horizontalMovement.add(right);

      if (horizontalMovement.lengthSq() > 0) {
        horizontalMovement.normalize().multiplyScalar(horizontalSpeed * frameDelta);
        movement.add(horizontalMovement);
      }
    }

    if (keys.current.has("KeyE")) movement.y += VERTICAL_SPEED * frameDelta;
    if (keys.current.has("KeyQ")) movement.y -= VERTICAL_SPEED * frameDelta;

    camera.position.add(movement);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, MIN_X, MAX_X);
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, MIN_HEIGHT, MAX_HEIGHT);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, MIN_Z, MAX_Z);

    appliedMovement.copy(camera.position).sub(previousCameraPosition);
    const controls = orbitControlsRef?.current;

    if (controls) {
      controls.target.add(appliedMovement);
      controls.target.x = THREE.MathUtils.clamp(controls.target.x, MIN_X, MAX_X);
      controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0.25, MAX_HEIGHT - 0.5);
      controls.target.z = THREE.MathUtils.clamp(controls.target.z, MIN_Z, MAX_Z);
      controls.update?.();
    }
  });

  return null;
}

function isMovementKey(code: string) {
  return ["KeyW", "KeyA", "KeyS", "KeyD", "KeyE", "KeyQ", "ShiftLeft", "ShiftRight"].includes(code);
}

function getIsSprinting(keys: Set<string>) {
  return keys.has("ShiftLeft") || keys.has("ShiftRight");
}
