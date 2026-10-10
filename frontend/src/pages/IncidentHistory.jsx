import React, { useMemo, useState } from 'react';
import { Download, Info } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { IncidentFilters } from '../components/incidents/IncidentFilters';
import { IncidentTable } from '../components/incidents/IncidentTable';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function IncidentHistory() {
  const { incidents } = useAppState();

  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        inc.id.toLowerCase().includes(q) ||
        inc.category.toLowerCase().includes(q) ||
        inc.modelClass.toLowerCase().includes(q) ||
        inc.source.toLowerCase().includes(q) ||
        inc.zone.toLowerCase().includes(q);

      const matchesSeverity = severity === 'All' || inc.severity === severity;
      const matchesCategory = category === 'All' || inc.category === category;
      const matchesStatus = status === 'All' || inc.status === status;
      const matchesDate =
        dateFilter === 'All' || inc.timestamp.startsWith(dateFilter);

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesCategory &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [incidents, search, severity, category, status, dateFilter]);

  const handleResetFilters = () => {
    setSearch('');
    setSeverity('All');
    setCategory('All');
    setStatus('All');
    setDateFilter('All');
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    const headers = [
      'Incident ID',
      'Timestamp',
      'Violation Category',
      'Model Class',
      'Severity',
      'Zone',
      'Source File',
      'Confidence',
      'Status',
    ];
    const rows = filteredIncidents.map((i) => [
      i.id,
      i.timestamp,
      `"${i.category}"`,
      i.modelClass,
      i.severity,
      `"${i.zone}"`,
      i.source,
      (i.confidence * 100).toFixed(1) + '%',
      i.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'siteguard-demo-incidents.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const counts = useMemo(() => {
    return {
      total: incidents.length,
      newCount: incidents.filter((i) => i.status === 'New').length,
      reviewCount: incidents.filter((i) => i.status === 'Under Review').length,
      resolvedCount: incidents.filter((i) => i.status === 'Resolved').length,
    };
  }, [incidents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Incident History
            </h1>
            <Badge variant="demo">Demo Records</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search, filter, and audit logged construction PPE safety violations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExportCsv}
          >
            Export Filtered CSV ({filteredIncidents.length})
          </Button>
        </div>
      </div>

      {/* Status Summary Filter Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => {
            setStatus('All');
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-lg border text-left transition-colors ${
            status === 'All'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <p className="text-[11px] uppercase tracking-wider opacity-75 font-semibold">
            All Demo Incidents
          </p>
          <p className="text-xl font-bold font-mono mt-1">{counts.total}</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus('New');
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-lg border text-left transition-colors ${
            status === 'New'
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-red-50/40'
          }`}
        >
          <p className="text-[11px] uppercase tracking-wider opacity-75 font-semibold">
            New (Unreviewed)
          </p>
          <p className="text-xl font-bold font-mono mt-1">{counts.newCount}</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus('Under Review');
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-lg border text-left transition-colors ${
            status === 'Under Review'
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-amber-50/40'
          }`}
        >
          <p className="text-[11px] uppercase tracking-wider opacity-75 font-semibold">
            Under Review
          </p>
          <p className="text-xl font-bold font-mono mt-1">{counts.reviewCount}</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus('Resolved');
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-lg border text-left transition-colors ${
            status === 'Resolved'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-emerald-50/40'
          }`}
        >
          <p className="text-[11px] uppercase tracking-wider opacity-75 font-semibold">
            Resolved
          </p>
          <p className="text-xl font-bold font-mono mt-1">
            {counts.resolvedCount}
          </p>
        </button>
      </div>

      {/* Search & Multi-Attribute Filters */}
      <IncidentFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        severity={severity}
        onSeverityChange={(val) => {
          setSeverity(val);
          setCurrentPage(1);
        }}
        category={category}
        onCategoryChange={(val) => {
          setCategory(val);
          setCurrentPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setCurrentPage(1);
        }}
        dateFilter={dateFilter}
        onDateFilterChange={(val) => {
          setDateFilter(val);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Paginated Incident Table */}
      <IncidentTable
        incidents={filteredIncidents}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onResetFilters={handleResetFilters}
      />

      {/* Footer Note */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          Status updates and investigation notes made during this session are stored locally in the frontend state until Phase 3 database persistence is connected.
        </span>
      </div>
    </div>
  );
}
