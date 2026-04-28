interface Props {
  title: string;
  sub?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, sub, children, className = "" }: Props) {
  return (
    <div className={`rounded-xl border p-5 border-slate-200 bg-white dark:border-[#1e2d45] dark:bg-[#0d1120] ${className}`}>
      <div className="mb-4">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}
