import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export function IncidentFilters({
  search,
  onSearchChange,
  severity,
  onSeverityChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  dateFilter,
  onDateFilterChange,
  onReset,
}) {
  const hasActiveFilters =
    search ||
    severity !== 'All' ||
    category !== 'All' ||
    status !== 'All' ||
    dateFilter !== 'All';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Incident ID, zone, file, or class..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
          />
        </div>

        {/* Date Filter */}
        <div>
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            aria-label="Filter by date"
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
          >
            <option value="All">All Dates</option>
            <option value="2026-10-10">Oct 10, 2026</option>
            <option value="2026-10-09">Oct 09, 2026</option>
            <option value="2026-10-08">Oct 08, 2026</option>
            <option value="2026-10-07">Oct 07, 2026</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <select
            value={severity}
            onChange={(e) => onSeverityChange(e.target.value)}
            aria-label="Filter by severity"
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="Warning">Warning</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by violation category"
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
          >
            <option value="All">All Categories</option>
            <option value="Missing Hard Hat">Missing Hard Hat (no_helmet)</option>
            <option value="Missing Safety Vest">Missing Safety Vest (none)</option>
            <option value="Missing Safety Boots">Missing Safety Boots (no_boots)</option>
            <option value="Missing Safety Goggles">Missing Safety Goggles (no_goggle)</option>
            <option value="Missing Protective Gloves">Missing Protective Gloves (no_gloves)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by status"
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
          </select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={onReset}
              title="Reset all filters"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
