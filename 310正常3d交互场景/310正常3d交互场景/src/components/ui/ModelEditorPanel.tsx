import { RotateCcw, Settings2, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  editableModelConfigs,
  resetAllModelTransforms,
  resetModelTransform,
  updateModelTransform,
  useModelEditorState,
  type EditableModelId,
  type EditableModelTransform,
} from "../scene/modelEditorStore";

type Axis = 0 | 1 | 2;

const positionStep = 0.1;
const rotationStep = 5;
const scaleStep = 0.05;

export function ModelEditorPanel() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<EditableModelId>("workstation");
  const editorState = useModelEditorState();
  const activeConfig = useMemo(() => editableModelConfigs.find((item) => item.id === activeId) ?? editableModelConfigs[0], [activeId]);
  const activeTransform = editorState[activeConfig.id];

  return (
    <div className="fixed bottom-5 right-5 z-20 text-cyan-50">
      {!open ? (
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded border border-cyan-300/45 bg-slate-900/60 px-3 text-xs font-medium shadow-[0_0_22px_rgba(79,195,255,0.18)] backdrop-blur transition hover:border-cyan-200 hover:bg-slate-800/70"
          onClick={() => setOpen(true)}
        >
          <Settings2 className="h-4 w-4 text-cyan-200" />
          编辑
        </button>
      ) : (
        <section className="w-72 rounded border border-cyan-300/40 bg-slate-950/70 p-3 text-xs shadow-[0_0_26px_rgba(79,195,255,0.2)] backdrop-blur-md">
          <header className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-cyan-50">Model Edit</div>
              <div className="text-[11px] text-cyan-100/65">位置 / 方向 / 大小</div>
            </div>
            <button type="button" className="rounded p-1 text-cyan-100/70 transition hover:bg-cyan-200/10 hover:text-cyan-50" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="mb-3 grid grid-cols-3 gap-1">
            {editableModelConfigs.map((config) => (
              <button
                key={config.id}
                type="button"
                className={`rounded border px-2 py-1 text-[11px] transition ${
                  activeId === config.id ? "border-cyan-200 bg-cyan-300/15 text-cyan-50" : "border-cyan-300/20 bg-slate-900/40 text-cyan-100/70 hover:bg-cyan-300/10"
                }`}
                onClick={() => setActiveId(config.id)}
              >
                {config.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <AxisControl label="X" axis={0} transform={activeTransform} modelId={activeConfig.id} />
            <AxisControl label="Y" axis={1} transform={activeTransform} modelId={activeConfig.id} />
            <AxisControl label="Z" axis={2} transform={activeTransform} modelId={activeConfig.id} />
            <ScalarControl
              label="Y轴旋转"
              value={activeTransform.rotationY}
              step={rotationStep}
              precision={0}
              onChange={(value) =>
                updateModelTransform(activeConfig.id, (transform) => ({
                  ...transform,
                  rotationY: value,
                }))
              }
            />
            <ScalarControl
              label="大小"
              value={activeTransform.scale}
              step={scaleStep}
              precision={2}
              min={0.1}
              onChange={(value) =>
                updateModelTransform(activeConfig.id, (transform) => ({
                  ...transform,
                  scale: Math.max(0.1, value),
                }))
              }
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1 rounded border border-cyan-300/25 bg-cyan-300/10 py-1.5 text-[11px] text-cyan-50 transition hover:bg-cyan-300/15"
              onClick={() => resetModelTransform(activeConfig.id)}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              重置当前
            </button>
            <button
              type="button"
              className="flex-1 rounded border border-cyan-300/20 bg-slate-900/50 py-1.5 text-[11px] text-cyan-100/80 transition hover:bg-cyan-300/10"
              onClick={resetAllModelTransforms}
            >
              全部重置
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function AxisControl({ label, axis, transform, modelId }: { label: string; axis: Axis; transform: EditableModelTransform; modelId: EditableModelId }) {
  return (
    <ScalarControl
      label={label}
      value={transform.center[axis]}
      step={positionStep}
      precision={2}
      onChange={(value) =>
        updateModelTransform(modelId, (current) => {
          const center = [...current.center] as EditableModelTransform["center"];
          center[axis] = value;
          return {
            ...current,
            center,
          };
        })
      }
    />
  );
}

function ScalarControl({
  label,
  value,
  step,
  precision,
  min,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  precision: number;
  min?: number;
  onChange: (value: number) => void;
}) {
  const nextValue = (delta: number) => {
    const raw = value + delta;
    onChange(Number((min === undefined ? raw : Math.max(min, raw)).toFixed(precision)));
  };

  return (
    <div className="grid grid-cols-[68px_28px_1fr_28px] items-center gap-1">
      <span className="text-[11px] text-cyan-100/70">{label}</span>
      <button type="button" className="editor-step-button" onClick={() => nextValue(-step)}>
        -
      </button>
      <input
        className="h-7 rounded border border-cyan-300/20 bg-slate-900/55 px-2 text-center text-[11px] text-cyan-50 outline-none transition focus:border-cyan-200/70"
        type="number"
        step={step}
        value={Number(value.toFixed(precision))}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onChange(min === undefined ? next : Math.max(min, next));
        }}
      />
      <button type="button" className="editor-step-button" onClick={() => nextValue(step)}>
        +
      </button>
    </div>
  );
}
