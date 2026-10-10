import {
  DEMO_DASHBOARD_SUMMARY,
  DEMO_MONITORING_ACTIVITY,
  DEMO_VIOLATION_CATEGORIES,
  DEMO_VIOLATION_TRENDS,
  INITIAL_DEMO_INCIDENTS,
  YOLO_MODEL_INFO,
} from './mockData';

/**
 * SiteGuard AI — Frontend API Service Layer
 *
 * Uses environment variables (`VITE_API_BASE_URL` and `VITE_ENABLE_LIVE_API`)
 * to prepare a clean contract for Phase 3 Python backend connectivity.
 *
 * IMPORTANT: When `VITE_ENABLE_LIVE_API` is not `"true"`, all methods return
 * clearly labeled demo/sample responses or local preview state without pretending
 * that real YOLOv8 inference or backend authentication is running.
 */

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  enableLiveApi: import.meta.env.VITE_ENABLE_LIVE_API === 'true',
};

async function requestJson(endpoint, options = {}) {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown API error');
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

export const siteGuardApi = {
  /**
   * Checks whether the Python AI backend is configured and reachable.
   */
  async getBackendStatus() {
    if (!API_CONFIG.enableLiveApi) {
      return {
        connected: false,
        mode: 'DEMO_FRONTEND_ONLY',
        modelInfo: YOLO_MODEL_INFO,
        message: 'Phase 2 Frontend Mode — Backend inference API not yet connected.',
      };
    }

    try {
      const data = await requestJson('/health');
      return {
        connected: true,
        mode: 'LIVE_BACKEND',
        modelInfo: data.model || YOLO_MODEL_INFO,
        message: 'Connected to SiteGuard AI Python Inference Server.',
      };
    } catch (error) {
      return {
        connected: false,
        mode: 'BACKEND_UNREACHABLE',
        modelInfo: YOLO_MODEL_INFO,
        message: error.message || 'Unable to reach Python backend; using demo data layer.',
      };
    }
  },

  /**
   * Demo login flow for Phase 2 UI development.
   */
  async login({ email, password }) {
    await new Promise((resolve) => setTimeout(resolve, 650));

    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid corporate email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    if (API_CONFIG.enableLiveApi) {
      return requestJson('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    }

    return {
      isDemoAuth: true,
      user: {
        name: 'Marcus Vance',
        role: 'Lead HSE Safety Engineer',
        email,
        site: 'Metro Tower Sector 4 — North Site',
        avatarInitials: 'MV',
      },
      token: 'demo-phase2-session-token',
    };
  },

  /**
   * Fetch dashboard overview metrics, trends, and activity logs.
   */
  async getDashboardOverview() {
    if (API_CONFIG.enableLiveApi) {
      return requestJson('/dashboard/summary');
    }

    return {
      isDemoData: true,
      summary: DEMO_DASHBOARD_SUMMARY,
      trends: DEMO_VIOLATION_TRENDS,
      categories: DEMO_VIOLATION_CATEGORIES,
      activity: DEMO_MONITORING_ACTIVITY,
    };
  },

  /**
   * Fetch incident history records.
   */
  async getIncidents() {
    if (API_CONFIG.enableLiveApi) {
      return requestJson('/incidents');
    }

    return {
      isDemoData: true,
      incidents: INITIAL_DEMO_INCIDENTS,
    };
  },

  /**
   * Prepare uploaded media for inspection.
   *
   * Note: In Phase 2 (when live backend is disabled), this method validates and stages
   * the local file preview honestly without fabricating YOLO predictions on user files.
   */
  async analyzeMediaFile(file, options = {}, onProgress) {
    const steps = [20, 45, 75, 100];
    for (const pct of steps) {
      await new Promise((resolve) => setTimeout(resolve, 260));
      if (onProgress) onProgress(pct);
    }

    if (API_CONFIG.enableLiveApi) {
      const formData = new FormData();
      formData.append('file', file);
      if (options.zone) formData.append('zone', options.zone);

      const response = await fetch(`${API_CONFIG.baseUrl}/detect`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend inference failed (${response.status})`);
      }
      return response.json();
    }

    // Honest Phase 2 frontend response: preserves local file preview, clearly states
    // that live YOLOv8 inference (`model/best.pt`) will execute once the Phase 3 backend is connected.
    const localPreviewUrl = URL.createObjectURL(file);
    return {
      id: `LOCAL-${Date.now().toString().slice(-5)}`,
      isDemoData: false,
      inferenceStatus: 'BACKEND_PENDING',
      timestamp: new Date().toISOString(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      isVideo: file.type.startsWith('video/'),
      zone: options.zone || 'Zone A — Structural Steel Bay 4',
      camera: options.camera || 'Manual Media Upload',
      originalPreviewUrl: localPreviewUrl,
      annotatedPreviewUrl: null,
      detections: [],
      message:
        'Media staged locally and validated. Live YOLOv8 (`model/best.pt`) inference is not yet connected in Phase 2 — connect the Python backend API to generate real bounding box predictions for uploaded files, or load a labeled Demo Inspection below to preview the Detection Results interface.',
    };
  },
};
