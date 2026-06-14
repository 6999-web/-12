type ObjectInfoCardProps = {
  name: string;
  type: string;
  status?: string;
  description: string;
  isExiting?: boolean;
};

export function ObjectInfoCard({ name, type, status = "在线", description, isExiting = false }: ObjectInfoCardProps) {
  return (
    <div className={`selection-info-card ${isExiting ? "is-exiting" : ""} w-64 rounded border border-cyan-200/45 bg-[#142D41]/70 px-4 py-3 text-left text-cyan-50 shadow-[0_0_24px_rgba(79,195,255,0.22)] backdrop-blur-md`}>
      <div className="mb-2 h-px w-full bg-gradient-to-r from-cyan-200/70 via-cyan-100/25 to-transparent" />
      <dl className="space-y-1.5 text-xs leading-relaxed">
        <div className="flex gap-2">
          <dt className="shrink-0 text-cyan-100/65">名称</dt>
          <dd className="font-medium text-white">{name}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-cyan-100/65">类型</dt>
          <dd>{type}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-cyan-100/65">状态</dt>
          <dd className="text-cyan-100">{status}</dd>
        </div>
        <div className="pt-1 text-cyan-50/78">{description}</div>
      </dl>
    </div>
  );
}
