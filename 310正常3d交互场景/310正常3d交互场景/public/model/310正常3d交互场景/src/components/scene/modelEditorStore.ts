import { useSyncExternalStore } from "react";
import type { Vec3 } from "./types";

export type EditableModelId = "workstation" | "meeting" | "hardware";

export type EditableModelTransform = {
  center: Vec3;
  rotationY: number;
  scale: number;
};

export type EditableModelConfig = {
  id: EditableModelId;
  label: string;
  defaultTransform: EditableModelTransform;
};

export const editableModelConfigs: EditableModelConfig[] = [
  {
    id: "workstation",
    label: "工位区",
    defaultTransform: {
      center: [-3.5, 0, 0.48],
      rotationY: 0,
      scale: 1,
    },
  },
  {
    id: "meeting",
    label: "会议区",
    defaultTransform: {
      center: [8.1, 0, -0.35],
      rotationY: 0,
      scale: 1,
    },
  },
  {
    id: "hardware",
    label: "硬件区",
    defaultTransform: {
      center: [7.4, 0, 3.55],
      rotationY: 0,
      scale: 1,
    },
  },
];

export type ModelEditorState = Record<EditableModelId, EditableModelTransform>;

const STORAGE_KEY = "lab310:model-editor:v1";

const listeners = new Set<() => void>();

let state = loadState();

function cloneTransform(transform: EditableModelTransform): EditableModelTransform {
  return {
    center: [...transform.center] as Vec3,
    rotationY: transform.rotationY,
    scale: transform.scale,
  };
}

function createDefaultState(): ModelEditorState {
  return editableModelConfigs.reduce((result, config) => {
    result[config.id] = cloneTransform(config.defaultTransform);
    return result;
  }, {} as ModelEditorState);
}

function loadState(): ModelEditorState {
  if (typeof window === "undefined") return createDefaultState();

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<ModelEditorState> | null;
    const defaults = createDefaultState();
    if (!parsed) return defaults;

    editableModelConfigs.forEach((config) => {
      const saved = parsed[config.id];
      if (!saved) return;
      defaults[config.id] = {
        center: [
          Number.isFinite(saved.center?.[0]) ? Number(saved.center[0]) : defaults[config.id].center[0],
          Number.isFinite(saved.center?.[1]) ? Number(saved.center[1]) : defaults[config.id].center[1],
          Number.isFinite(saved.center?.[2]) ? Number(saved.center[2]) : defaults[config.id].center[2],
        ],
        rotationY: Number.isFinite(saved.rotationY) ? Number(saved.rotationY) : defaults[config.id].rotationY,
        scale: Number.isFinite(saved.scale) ? Math.max(0.1, Number(saved.scale)) : defaults[config.id].scale,
      };
    });

    return defaults;
  } catch {
    return createDefaultState();
  }
}

function saveState(nextState: ModelEditorState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function emit() {
  saveState(state);
  listeners.forEach((listener) => listener());
}

export function getModelEditorSnapshot() {
  return state;
}

export function subscribeModelEditor(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateModelTransform(id: EditableModelId, updater: (transform: EditableModelTransform) => EditableModelTransform) {
  state = {
    ...state,
    [id]: updater(cloneTransform(state[id])),
  };
  emit();
}

export function resetModelTransform(id: EditableModelId) {
  const config = editableModelConfigs.find((item) => item.id === id);
  if (!config) return;
  state = {
    ...state,
    [id]: cloneTransform(config.defaultTransform),
  };
  emit();
}

export function resetAllModelTransforms() {
  state = createDefaultState();
  emit();
}

export function useModelEditorState() {
  return useSyncExternalStore(subscribeModelEditor, getModelEditorSnapshot, getModelEditorSnapshot);
}
