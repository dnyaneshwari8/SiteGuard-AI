import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import { Card } from '../ui/Card';
import { SeverityBadge, StatusBadge } from '../ui/Badge';
import { formatDateTime, formatConfidence } from '../../utils/formatters';

export function RecentIncidentsTable({ incidents }) {
  const recent = incidents.slice(0, 5);

  return (
    <Card
      title="Recent Safety Incidents (Demo Records)"
      subtitle="Latest flagged non-compliance events requiring supervisor verification"
      noPadding
      action={
        <Link
          to="/incidents"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          <span>View All ({incidents.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Incident ID</th>
              <th className="py-3 px-4">Violation Category</th>
              <th className="py-3 px-4">Zone / Source</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {recent.map((incident) => (
              <tr
                key={incident.id}
                className="hover:bg-slate-50/90 transition-colors"
              >
                <td className="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                  <Link
                    to={`/incidents/${incident.id}`}
                    className="hover:text-blue-600"
                  >
                    {incident.id}
                  </Link>
                  <div className="text-[11px] font-sans font-normal text-slate-400">
                    {formatDateTime(incident.timestamp)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-900">
                    {incident.category}
                  </div>
                  <span className="inline-block mt-0.5 font-mono text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                    {incident.modelClass}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  <div className="font-medium text-slate-800 truncate max-w-[200px]">
                    {incident.zone}
                  </div>
                  <div className="font-mono text-[11px] text-slate-400 truncate max-w-[200px]">
                    {incident.source}
                  </div>
                </td>
                <td className="py-3 px-4 font-mono font-medium text-slate-800">
                  {formatConfidence(incident.confidence)}
                </td>
                <td className="py-3 px-4">
                  <SeverityBadge severity={incident.severity} />
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={incident.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    to={`/incidents/${incident.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
