import React from 'react';

export function EmptyState({ icon: Icon, title, description, actions }) {
  return (
    <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-3.5">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      {description && (
        <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
          {description}
        </p>
      )}
      {actions && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {actions}
        </div>
      )}
    </div>
  );
}
