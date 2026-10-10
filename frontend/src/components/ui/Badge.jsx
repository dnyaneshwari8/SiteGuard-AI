import React from 'react';

const VARIANT_CLASSES = {
  safe: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  demo: 'bg-amber-50/90 text-amber-800 border-amber-300 font-mono',
};

export function Badge({
  children,
  variant = 'neutral',
  dot = false,
  className = '',
}) {
  const styles = VARIANT_CLASSES[variant] || VARIANT_CLASSES.neutral;

  const dotColor = {
    safe: 'bg-emerald-600',
    critical: 'bg-red-600',
    warning: 'bg-amber-500',
    info: 'bg-blue-600',
    neutral: 'bg-slate-500',
    demo: 'bg-amber-500',
  }[variant] || 'bg-slate-500';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  if (severity === 'Critical') {
    return (
      <Badge variant="critical" dot>
        Critical
      </Badge>
    );
  }
  if (severity === 'Warning') {
    return (
      <Badge variant="warning" dot>
        Warning
      </Badge>
    );
  }
  return (
    <Badge variant="neutral" dot>
      {severity || 'Standard'}
    </Badge>
  );
}

export function StatusBadge({ status }) {
  if (status === 'Resolved') {
    return (
      <Badge variant="safe" dot>
        Resolved
      </Badge>
    );
  }
  if (status === 'Under Review') {
    return (
      <Badge variant="warning" dot>
        Under Review
      </Badge>
    );
  }
  return (
    <Badge variant="critical" dot>
      {status || 'New'}
    </Badge>
  );
}
