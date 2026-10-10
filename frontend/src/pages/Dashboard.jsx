import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  ClipboardCheck,
  UploadCloud,
  ClipboardList,
  Calendar,
  Info,
} from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { StatCard } from '../components/dashboard/StatCard';
import { ViolationTrendChart } from '../components/dashboard/ViolationTrendChart';
import { ViolationCategoryChart } from '../components/dashboard/ViolationCategoryChart';
import { RecentIncidentsTable } from '../components/dashboard/RecentIncidentsTable';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user,
    dashboardSummary,
    violationTrends,
    violationCategories,
    incidents,
    activityLog,
  } = useAppState();

  const currentDateDisplay = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Demo Data Separation Banner */}
      <div className="p-3.5 rounded-lg bg-amber-50/90 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Sample Telemetry Notice:</strong> Dashboard statistics, charts, and incident logs below display structured <strong>demo data</strong> aligned with <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">model/best.pt</code>. Real-time AI results will populate once the Python backend is connected.
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/analyze')}
          className="font-semibold text-amber-900 underline hover:text-amber-700 shrink-0"
        >
          Go to Media Upload →
        </button>
      </div>

      {/* Welcome Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDateDisplay}</span>
            <span>•</span>
            <span>{user?.site || 'Metro Tower Sector 4 — North Site'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Welcome back, {user?.name || 'Marcus Vance'}
          </h1>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={ClipboardList}
            onClick={() => navigate('/incidents')}
          >
            View Incidents ({dashboardSummary.incidentsRequiringReview} Open)
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={UploadCloud}
            onClick={() => navigate('/analyze')}
          >
            Upload Image / Video
          </Button>
        </div>
      </div>

      {/* 4 KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Detections (Demo)"
          value={dashboardSummary.totalDetections.toLocaleString()}
          subtitle={dashboardSummary.totalDetectionsDelta}
          badgeText="7-Day Sample"
          icon={ScanSearch}
          accent="blue"
        />
        <StatCard
          title="Safety Violations"
          value={dashboardSummary.safetyViolations}
          subtitle={dashboardSummary.safetyViolationsDelta}
          badgeText={`${dashboardSummary.criticalOpenCount} Critical Open`}
          icon={ShieldAlert}
          accent="red"
        />
        <StatCard
          title="Safe Detections"
          value={dashboardSummary.safeDetections.toLocaleString()}
          subtitle="Workers with verified PPE"
          badgeText={`${dashboardSummary.complianceRate} Compliant`}
          icon={ShieldCheck}
          accent="green"
        />
        <StatCard
          title="Incidents Requiring Review"
          value={dashboardSummary.incidentsRequiringReview}
          subtitle="New & Under Review status"
          badgeText="Action Needed"
          icon={ClipboardCheck}
          accent="amber"
        />
      </div>

      {/* Charts Row: Violation Trend + Violation Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ViolationTrendChart data={violationTrends} />
        </div>
        <div className="lg:col-span-5">
          <ViolationCategoryChart data={violationCategories} />
        </div>
      </div>

      {/* Bottom Row: Recent Incidents Table + Latest Monitoring Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RecentIncidentsTable incidents={incidents} />
        </div>
        <div className="lg:col-span-4">
          <ActivityFeed activities={activityLog} />
        </div>
      </div>
    </div>
  );
}
