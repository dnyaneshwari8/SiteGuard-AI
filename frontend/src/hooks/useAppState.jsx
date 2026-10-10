import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEMO_DASHBOARD_SUMMARY,
  DEMO_MONITORING_ACTIVITY,
  DEMO_VIOLATION_CATEGORIES,
  DEMO_VIOLATION_TRENDS,
  INITIAL_DEMO_INCIDENTS,
  YOLO_MODEL_INFO,
} from '../services/mockData';
import { siteGuardApi } from '../services/api';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('siteguard_demo_user');
      return saved ? JSON.parse(saved) : {
        name: 'Marcus Vance',
        role: 'Lead HSE Safety Engineer',
        email: 'm.vance@siteguard-ai.demo',
        site: 'Metro Tower Sector 4 — North Site',
        avatarInitials: 'MV',
        isDemoAuth: true,
      };
    } catch {
      return null;
    }
  });

  const [incidents, setIncidents] = useState(INITIAL_DEMO_INCIDENTS);
  const [activityLog, setActivityLog] = useState(DEMO_MONITORING_ACTIVITY);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    mode: 'DEMO_FRONTEND_ONLY',
    modelInfo: YOLO_MODEL_INFO,
    message: 'Phase 2 Frontend Mode — Backend inference API not yet connected.',
  });

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Critical Violation (Demo): INC-2026-0108',
      description: 'Missing Hard Hat (no_helmet) in Zone A — Structural Steel Bay 4',
      time: '28m ago',
      unread: true,
      incidentId: 'INC-2026-0108',
    },
    {
      id: 'notif-2',
      title: 'Incident Pending Review: INC-2026-0107',
      description: 'Missing High-Vis Safety Vest at West Loading Dock',
      time: '1h ago',
      unread: true,
      incidentId: 'INC-2026-0107',
    },
    {
      id: 'notif-3',
      title: 'YOLOv8 Model Check',
      description: 'model/best.pt (11 safety classes) preserved for Phase 3 API integration',
      time: '4h ago',
      unread: false,
      incidentId: null,
    },
  ]);

  useEffect(() => {
    siteGuardApi.getBackendStatus().then(setBackendStatus);
  }, []);

  const loginUser = async ({ email, password, rememberMe }) => {
    const result = await siteGuardApi.login({ email, password, rememberMe });
    const nextUser = { ...result.user, isDemoAuth: result.isDemoAuth };
    setUser(nextUser);
    try {
      sessionStorage.setItem('siteguard_demo_user', JSON.stringify(nextUser));
    } catch {
      // Ignore storage errors
    }
    return nextUser;
  };

  const logoutUser = () => {
    setUser(null);
    try {
      sessionStorage.removeItem('siteguard_demo_user');
    } catch {
      // Ignore storage errors
    }
  };

  const updateIncidentStatus = (incidentId, nextStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status: nextStatus } : inc))
    );

    setActivityLog((prev) => [
      {
        id: `ACT-${Date.now().toString().slice(-4)}`,
        time: 'Just now',
        title: `Incident ${incidentId} marked ${nextStatus}`,
        detail: `Updated locally by ${user?.name || 'Safety Officer'} (Frontend Session)`,
        type: nextStatus === 'Resolved' ? 'resolved' : 'upload',
      },
      ...prev,
    ]);
  };

  const addIncidentNote = (incidentId, noteText) => {
    if (!noteText || !noteText.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      author: user?.name || 'Marcus Vance (HSE Lead)',
      timestamp: new Date().toISOString(),
      text: noteText.trim(),
    };

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? { ...inc, notes: [...(inc.notes || []), newNote] }
          : inc
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const dashboardSummary = useMemo(() => {
    const openOrReviewCount = incidents.filter((i) => i.status !== 'Resolved').length;
    const criticalOpen = incidents.filter(
      (i) => i.severity === 'Critical' && i.status !== 'Resolved'
    ).length;

    return {
      ...DEMO_DASHBOARD_SUMMARY,
      incidentsRequiringReview: openOrReviewCount,
      criticalOpenCount: criticalOpen,
    };
  }, [incidents]);

  const value = {
    user,
    loginUser,
    logoutUser,
    incidents,
    updateIncidentStatus,
    addIncidentNote,
    dashboardSummary,
    violationTrends: DEMO_VIOLATION_TRENDS,
    violationCategories: DEMO_VIOLATION_CATEGORIES,
    activityLog,
    setActivityLog,
    currentAnalysis,
    setCurrentAnalysis,
    backendStatus,
    notifications,
    markAllNotificationsRead,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
