import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SelectionHighlight, type SelectionMeta } from "./SelectionHighlight";

type SelectedState = {
  object: THREE.Object3D;
  meta: SelectionMeta;
  id: number;
};

export function SelectionSystem() {
  const { camera, gl, scene } = useThree();
  const [selected, setSelected] = useState<SelectedState | null>(null);
  const [displaySelected, setDisplaySelected] = useState<SelectedState | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const pointerDown = useRef<{ x: number; y: number } | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const selectionCounter = useRef(0);
  const exitTimer = useRef<number | null>(null);

  useEffect(() => {
    if (exitTimer.current) {
      window.clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }

    if (selected) {
      setIsExiting(false);
      setDisplaySelected(selected);
      return;
    }

    setIsExiting(true);
    exitTimer.current = window.setTimeout(() => {
      setDisplaySelected(null);
      setIsExiting(false);
      exitTimer.current = null;
    }, 200);

    return () => {
      if (exitTimer.current) {
        window.clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }
    };
  }, [selected]);

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (event: PointerEvent) => {
      pointerDown.current = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!pointerDown.current) return;
      const dx = Math.abs(event.clientX - pointerDown.current.x);
      const dy = Math.abs(event.clientY - pointerDown.current.y);
      pointerDown.current = null;

      if (dx > 5 || dy > 5) return;

      const selectable = pickSelectable(event, canvas, camera, scene, raycaster.current, pointer.current);
      setSelected(selectable ? { ...selectable, id: selectionCounter.current++ } : null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") setSelected(null);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [camera, gl, scene]);

  return <SelectionHighlight object={displaySelected?.object ?? null} meta={displaySelected?.meta ?? null} selectionId={displaySelected?.id ?? 0} isExiting={isExiting} />;
}

function pickSelectable(
  event: PointerEvent,
  canvas: HTMLCanvasElement,
  camera: THREE.Camera,
  scene: THREE.Scene,
  raycaster: THREE.Raycaster,
  pointer: THREE.Vector2,
) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const selectableObjects = getSelectableColliders(scene);
  const hits = raycaster.intersectObjects(selectableObjects, false);

  const hit = hits[0]?.object;
  if (!hit) return null;
  const selectionRoot = getSelectionRoot(hit, scene);

  return {
    object: selectionRoot,
    meta: {
      name: hit.userData.display_name ?? hit.userData.name ?? hit.name.replace("_collider", ""),
      type: hit.userData.type ?? "object",
      status: hit.userData.status,
      description: hit.userData.description ?? "可交互对象。",
    },
  };
}

function getSelectableColliders(scene: THREE.Scene) {
  const colliders: THREE.Mesh[] = [];

  scene.traverse((object) => {
    if (object instanceof THREE.Mesh && object.name.endsWith("_collider") && object.userData.__isCollider === true && object.userData.selectable === true && object.visible) {
      colliders.push(object);
    }
  });

  return colliders;
}

function getSelectionRoot(collider: THREE.Object3D, scene: THREE.Scene) {
  const id = collider.name.replace(/_collider$/, "");
  const namedRoot = scene.getObjectByName(`${id}_root`);
  if (namedRoot) return namedRoot;

  const root = collider.userData.selectionRoot;
  return root instanceof THREE.Object3D ? root : collider.parent ?? collider;
}
