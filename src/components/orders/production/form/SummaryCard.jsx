export default function SummaryCard({ title, value, icon }){
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <div className="mt-2 flex items-baseline gap-2">

            <span className="text-2xl font-bold text-slate-900">
              {value?.toFixed(2)}
            </span>

            <span className="text-xs font-medium text-slate-400">
              horas
            </span>

          </div>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          {icon}
        </div>

      </div>

    </div>
  );
}