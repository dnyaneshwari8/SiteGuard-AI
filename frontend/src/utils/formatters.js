/**
 * Utility functions for formatting dates, file sizes, confidence scores,
 * and generating deterministic SVG construction site evidence visuals for demo records.
 */

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatConfidence(score) {
  if (typeof score !== 'number') return '—';
  return `${(score * 100).toFixed(1)}%`;
}

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateOnly(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * Generates an inline SVG data URI depicting an architectural/construction camera frame
 * so demo incidents and sample media previews work 100% offline with zero broken links.
 */
export function createSiteSceneSvg({
  zone = 'Zone A - Structural Steel Bay 4',
  camera = 'CAM-04 (North Crane)',
  timestamp = '2026-10-10 09:42:18',
  workers = [],
  annotated = false,
}) {
  const workerPaths = workers
    .map((w, idx) => {
      const cx = w.cx || 260 + idx * 210;
      const cy = w.cy || 245;
      const hasHelmet = w.hasHelmet !== false;
      const hasVest = w.hasVest !== false;
      const hasGoggles = w.hasGoggles !== false;
      const hasGloves = w.hasGloves !== false;
      const hasBoots = w.hasBoots !== false;

      return `
        <g transform="translate(${cx}, ${cy})">
          <!-- Ground shadow -->
          <ellipse cx="40" cy="182" rx="34" ry="8" fill="#0f172a" opacity="0.32" />
          <!-- Legs -->
          <rect x="22" y="112" width="14" height="54" rx="4" fill="#1e293b" />
          <rect x="44" y="112" width="14" height="54" rx="4" fill="#1e293b" />
          <!-- Boots -->
          <rect x="18" y="162" width="20" height="14" rx="3" fill="${hasBoots ? '#d97706' : '#475569'}" />
          <rect x="42" y="162" width="20" height="14" rx="3" fill="${hasBoots ? '#d97706' : '#475569'}" />
          <!-- Torso / Safety Vest -->
          <rect x="16" y="46" width="48" height="68" rx="8" fill="${hasVest ? '#eab308' : '#334155'}" />
          ${
            hasVest
              ? `<rect x="16" y="64" width="48" height="6" fill="#fef08a" />
                 <rect x="16" y="88" width="48" height="6" fill="#fef08a" />
                 <rect x="26" y="46" width="5" height="68" fill="#fef08a" />
                 <rect x="49" y="46" width="5" height="68" fill="#fef08a" />`
              : ''
          }
          <!-- Arms -->
          <rect x="2" y="50" width="13" height="52" rx="5" fill="#475569" />
          <rect x="65" y="50" width="13" height="52" rx="5" fill="#475569" />
          <!-- Hands / Gloves -->
          <circle cx="8.5" cy="106" r="7" fill="${hasGloves ? '#2563eb' : '#e2e8f0'}" />
          <circle cx="71.5" cy="106" r="7" fill="${hasGloves ? '#2563eb' : '#e2e8f0'}" />
          <!-- Head -->
          <circle cx="40" cy="24" r="16" fill="#cbd5e1" />
          <!-- Goggles -->
          ${
            hasGoggles
              ? `<rect x="28" y="18" width="24" height="8" rx="3" fill="#0284c7" stroke="#e0f2fe" stroke-width="1.5" />`
              : `<circle cx="34" cy="22" r="2" fill="#334155" /><circle cx="46" cy="22" r="2" fill="#334155" />`
          }
          <!-- Hard Hat / Helmet -->
          ${
            hasHelmet
              ? `<path d="M21 19 C21 4, 59 4, 59 19 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" />
                 <rect x="17" y="17" width="46" height="4" rx="2" fill="#d97706" />`
              : `<path d="M25 18 C25 9, 55 9, 55 18 Z" fill="#1e293b" />`
          }
        </g>
      `;
    })
    .join('');

  const annotationBoxes = annotated
    ? workers
        .flatMap((w) => w.boxes || [])
        .map((b) => {
          const stroke = b.isViolation ? '#dc2626' : '#16a34a';
          const bg = b.isViolation ? '#dc2626' : '#16a34a';
          const labelWidth = Math.max(115, b.label.length * 7.8 + 46);
          return `
            <g>
              <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="${stroke}" fill-opacity="0.08" stroke="${stroke}" stroke-width="2.5" rx="3" />
              <rect x="${b.x}" y="${Math.max(4, b.y - 24)}" width="${labelWidth}" height="22" rx="3" fill="${bg}" />
              <text x="${b.x + 7}" y="${Math.max(19, b.y - 9)}" fill="#ffffff" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600">
                ${b.label} ${(b.confidence * 100).toFixed(0)}%
              </text>
            </g>
          `;
        })
        .join('')
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460" width="800" height="460">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="65%" stop-color="#334155" />
        <stop offset="100%" stop-color="#475569" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" stroke-width="0.5" stroke-opacity="0.25"/>
      </pattern>
    </defs>

    <!-- Background Sky & Structural Grid -->
    <rect width="800" height="460" fill="url(#sky)" />
    <rect width="800" height="330" fill="url(#grid)" />

    <!-- Scaffolding & Steel Beams -->
    <g stroke="#475569" stroke-width="4" opacity="0.65">
      <line x1="90" y1="40" x2="90" y2="330" />
      <line x1="250" y1="40" x2="250" y2="330" />
      <line x1="560" y1="40" x2="560" y2="330" />
      <line x1="710" y1="40" x2="710" y2="330" />
      <line x1="60" y1="110" x2="740" y2="110" />
      <line x1="60" y1="210" x2="740" y2="210" />
      <line x1="90" y1="110" x2="250" y2="210" stroke-width="2" />
      <line x1="560" y1="110" x2="710" y2="210" stroke-width="2" />
    </g>

    <!-- Concrete Slab Ground -->
    <rect x="0" y="330" width="800" height="130" fill="#334155" />
    <line x1="0" y1="330" x2="800" y2="330" stroke="#94a3b8" stroke-width="2" />

    <!-- Safety Barrier Strip -->
    <rect x="0" y="314" width="800" height="8" fill="#f59e0b" opacity="0.75" />

    <!-- Workers -->
    ${workerPaths}

    <!-- Bounding Box Overlays (when annotated=true) -->
    ${annotationBoxes}

    <!-- Camera OSD Telemetry Header -->
    <rect x="14" y="14" width="772" height="32" rx="4" fill="#0f172a" fill-opacity="0.78" />
    <circle cx="30" cy="30" r="5" fill="#22c55e" />
    <text x="44" y="34" fill="#f8fafc" font-family="JetBrains Mono, monospace" font-size="12" font-weight="600">${camera} — ${zone}</text>
    <text x="585" y="34" fill="#cbd5e1" font-family="JetBrains Mono, monospace" font-size="12">${timestamp}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
