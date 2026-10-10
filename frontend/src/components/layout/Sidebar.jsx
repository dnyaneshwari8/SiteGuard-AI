import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  UploadCloud,
  ScanSearch,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cpu,
  X,
} from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Analyze Media',
    to: '/analyze',
    icon: UploadCloud,
  },
  {
    name: 'Detection Results',
    to: '/results',
    icon: ScanSearch,
  },
  {
    name: 'Incident History',
    to: '/incidents',
    icon: ClipboardList,
    badgeKey: 'openIncidents',
  },
];

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) {
  const { logoutUser, dashboardSummary } = useAppState();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy-900 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white truncate">
                  SiteGuard AI
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                  v0.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Construction Safety AI
              </p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close navigation menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-2.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Operations
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const badgeValue =
            item.badgeKey === 'openIncidents'
              ? dashboardSummary.incidentsRequiringReview
              : null;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                `group flex items-center justify-between gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </div>

              {!collapsed && badgeValue > 0 && (
                <span className="px-1.5 py-0.5 text-[11px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {badgeValue}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Model Readiness Status Card (when expanded) */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-lg bg-navy-800/90 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-medium">
            <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">YOLOv8 Model Preserved</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 font-mono truncate">
            model/best.pt (11 classes)
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Phase 2 UI Prototype</span>
          </div>
        </div>
      )}

      {/* Footer: Collapse Toggle & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-1 shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-red-500/15 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs text-slate-400 hover:bg-navy-800 hover:text-slate-200 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 border-r border-slate-800 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-[1px]"
            onClick={onCloseMobile}
          />
          <aside className="relative w-64 max-w-[80vw] h-full z-10 shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
