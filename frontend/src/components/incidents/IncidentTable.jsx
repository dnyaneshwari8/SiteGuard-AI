import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight, FileSearch } from 'lucide-react';
import { SeverityBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { formatDateTime, formatConfidence } from '../../utils/formatters';

export function IncidentTable({
  incidents,
  currentPage,
  pageSize,
  onPageChange,
  onResetFilters,
}) {
  const totalItems = incidents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = incidents.slice(startIndex, startIndex + pageSize);

  if (totalItems === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <EmptyState
          icon={FileSearch}
          title="No matching safety incidents found"
          description="No demo incident records match your active search query or filter criteria."
          actions={
            <Button variant="outline" size="sm" onClick={onResetFilters}>
              Clear Filters
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Incident ID</th>
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Violation Category</th>
              <th className="py-3.5 px-4">Severity</th>
              <th className="py-3.5 px-4">Source File / Zone</th>
              <th className="py-3.5 px-4">Confidence</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginated.map((incident) => (
              <tr
                key={incident.id}
                className="hover:bg-slate-50/90 transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                  <Link
                    to={`/incidents/${incident.id}`}
                    className="hover:text-blue-600"
                  >
                    {incident.id}
                  </Link>
                </td>
                <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                  {formatDateTime(incident.timestamp)}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900">
                    {incident.category}
                  </div>
                  <span className="inline-block mt-0.5 font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                    class: {incident.modelClass}
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <SeverityBadge severity={incident.severity} />
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-800">
                    {incident.zone}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    {incident.source}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 whitespace-nowrap">
                  {formatConfidence(incident.confidence)}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={incident.status} />
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <Link
                    to={`/incidents/${incident.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium shadow-sm transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-900">{startIndex + 1}</span>{' '}
          to{' '}
          <span className="font-semibold text-slate-900">
            {Math.min(startIndex + pageSize, totalItems)}
          </span>{' '}
          of <span className="font-semibold text-slate-900">{totalItems}</span>{' '}
          demo incident records
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            icon={ChevronLeft}
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="px-2.5 py-1 font-mono text-xs text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            icon={ChevronRight}
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
