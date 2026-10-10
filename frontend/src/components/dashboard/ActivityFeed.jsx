import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  UploadCloud,
  Cpu,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const ICON_MAP = {
  violation: {
    icon: ShieldAlert,
    bg: 'bg-red-50 text-red-600 border-red-200',
  },
  resolved: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  safe: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  upload: {
    icon: UploadCloud,
    bg: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  system: {
    icon: Cpu,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

export function ActivityFeed({ activities }) {
  return (
    <Card
      title="Latest Monitoring Activity"
      subtitle="System events & safety review log"
      action={<Badge variant="demo">Demo Log</Badge>}
    >
      <div className="space-y-4">
        {activities.map((item) => {
          const cfg = ICON_MAP[item.type] || ICON_MAP.system;
          const Icon = cfg.icon;

          return (
            <div key={item.id} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {item.title}
                  </p>
                  <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
