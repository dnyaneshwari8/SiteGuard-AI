import React from 'react';

const ACCENT_STYLES = {
  blue: {
    border: 'border-t-2 border-t-blue-600',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  red: {
    border: 'border-t-2 border-t-red-600',
    iconBg: 'bg-red-50 text-red-600 border-red-100',
  },
  green: {
    border: 'border-t-2 border-t-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  amber: {
    border: 'border-t-2 border-t-amber-500',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'blue',
  badgeText,
}) {
  const style = ACCENT_STYLES[accent] || ACCENT_STYLES.blue;

  return (
    <div
      className={`bg-white border border-slate-200 ${style.border} rounded-lg p-5 shadow-sm flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5 font-mono tracking-tight">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${style.iconBg}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <span className="text-slate-600 truncate">{subtitle}</span>
        {badgeText && (
          <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
