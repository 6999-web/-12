import React from "react";
import ReactDOM from "react-dom/client";
import { Monitor } from "lucide-react";
import { LabScene } from "./components/scene/LabScene";
import { ModelEditorPanel } from "./components/ui/ModelEditorPanel";
import "./styles.css";

function App() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-lab-ink text-slate-100">
      <LabScene />
      <div className="pointer-events-none fixed left-5 top-5 z-10 flex items-center gap-3 rounded border border-cyan-300/35 bg-slate-950/55 px-4 py-3 shadow-[0_0_28px_rgba(79,195,255,0.18)] backdrop-blur">
        <Monitor className="h-5 w-5 text-cyan-200" />
        <div>
          <h1 className="text-sm font-semibold tracking-normal text-cyan-50">310 智能实验室数字孪生</h1>
          <p className="text-xs text-cyan-100/70">MVP 场景底座 · 开放式俯视浏览</p>
        </div>
      </div>
      <ModelEditorPanel />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
