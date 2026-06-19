export function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    trialing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    lifetime: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    canceled: 'bg-red-500/10 text-red-400 border-red-500/20',
    past_due: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    paused: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    unpaid: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  const cls = cfg[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  return <span className={`text-[10px] px-1.5 py-0.5 rounded border ${cls}`}>{status}</span>;
}
