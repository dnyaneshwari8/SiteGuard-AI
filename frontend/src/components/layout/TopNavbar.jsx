import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  Database,
  LogOut,
  User,
  ShieldAlert,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { API_CONFIG } from '../../services/api';

const ROUTE_LABELS = {
  dashboard: 'Safety Command Dashboard',
  analyze: 'Analyze Site Media',
  results: 'AI Detection Results',
  incidents: 'Incident History',
};

export function TopNavbar({ onOpenMobileMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    logoutUser,
    notifications,
    markAllNotificationsRead,
    backendStatus,
  } = useAppState();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modelModalOpen, setModelModalOpen] = useState(false);

  const pathParts = location.pathname.split('/').filter(Boolean);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    setProfileOpen(false);
    logoutUser();
    navigate('/login');
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 shrink-0 sticky top-0 z-30">
        {/* Left: Hamburger + Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
            <Link
              to="/dashboard"
              className="text-slate-500 hover:text-slate-800 font-medium hidden sm:inline"
            >
              SiteGuard AI
            </Link>
            {pathParts.map((part, idx) => {
              const label = ROUTE_LABELS[part] || part;
              const isLast = idx === pathParts.length - 1;
              const href = `/${pathParts.slice(0, idx + 1).join('/')}`;

              return (
                <React.Fragment key={href}>
                  <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:inline shrink-0" />
                  {isLast ? (
                    <span className="font-semibold text-slate-900 truncate">
                      {label}
                    </span>
                  ) : (
                    <Link
                      to={href}
                      className="text-slate-500 hover:text-slate-800 font-medium truncate"
                    >
                      {label}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Right: System Mode Indicator, Notifications, User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Demo Mode / Model Readiness Pill */}
          <button
            type="button"
            onClick={() => setModelModalOpen(true)}
            className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100/80 transition-colors"
            title="Click to inspect YOLOv8 model and Phase 3 API integration readiness"
          >
            <Database className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="hidden md:inline">Demo Data Mode</span>
            <span className="md:hidden">Demo</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotifOpen((prev) => !prev);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-lg z-40 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Safety Alerts (Demo)
                  </span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifOpen(false);
                        if (n.incidentId) navigate(`/incidents/${n.incidentId}`);
                      }}
                      className={`px-4 py-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                        n.unread ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900">{n.title}</p>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-navy-900 text-white text-xs font-semibold flex items-center justify-center">
                {user?.avatarInitials || 'MV'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-none">
                  {user?.name || 'Marcus Vance'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-none">
                  {user?.role || 'HSE Safety Lead'}
                </p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-40 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                  <p className="text-xs font-semibold text-slate-900">
                    {user?.name || 'Marcus Vance'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user?.email || 'm.vance@siteguard-ai.demo'}
                  </p>
                  <div className="mt-2">
                    <Badge variant="demo">Demo Session</Badge>
                  </div>
                </div>

                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      setModelModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md"
                  >
                    <Cpu className="w-4 h-4 text-slate-500" />
                    <span>Model & API Configuration</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Demo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Model & Backend Integration Readiness Modal */}
      <Modal
        open={modelModalOpen}
        onClose={() => setModelModalOpen(false)}
        title="YOLOv8 Model & Phase 3 Backend Readiness"
        subtitle="System architecture status and preserved AI artifacts"
        footer={
          <Button variant="primary" size="sm" onClick={() => setModelModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Trained Model Artifact
              </span>
              <Badge variant="safe" dot>
                Preserved & Intact
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-800">
              {backendStatus.modelInfo?.modelPath} ({backendStatus.modelInfo?.architecture})
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Trained Classes in best.pt (11 Classes)
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {Object.entries(backendStatus.modelInfo?.classes || {}).map(
                ([id, cls]) => (
                  <div
                    key={id}
                    className="px-2.5 py-1.5 rounded border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <span className="font-mono text-[11px] text-slate-700">
                      [{id}] {cls.key}
                    </span>
                    {cls.type === 'violation' ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-semibold">Phase 2 Frontend Prototype Notice</p>
            <p className="leading-relaxed">
              Configured API Base URL:{' '}
              <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200">
                {API_CONFIG.baseUrl}
              </code>
            </p>
            <p className="leading-relaxed">
              Live backend inference is currently disabled (
              <code className="font-mono">VITE_ENABLE_LIVE_API=false</code>). All
              dashboard metrics and incident records are clearly labeled sample data.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
