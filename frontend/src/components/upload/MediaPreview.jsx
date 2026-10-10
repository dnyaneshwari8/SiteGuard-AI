import React from 'react';
import { Trash2, ScanSearch, FileVideo, FileImage, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatFileSize } from '../../utils/formatters';

export function MediaPreview({
  file,
  previewUrl,
  zone,
  onZoneChange,
  camera,
  onCameraChange,
  onRemove,
  onAnalyze,
  analyzing,
  progress,
}) {
  if (!file || !previewUrl) return null;

  const isVideo =
    file.type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(file.name);

  return (
    <div className="space-y-5">
      {/* File Metadata Header Bar */}
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
            {isVideo ? (
              <FileVideo className="w-5 h-5" />
            ) : (
              <FileImage className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900 truncate font-mono">
                {file.name}
              </p>
              <Badge variant="info">{isVideo ? 'Video Clip' : 'Static Frame'}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Size: {formatFileSize(file.size)} • Type: {file.type || 'media/file'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Trash2}
          disabled={analyzing}
          onClick={onRemove}
        >
          Remove File
        </Button>
      </div>

      {/* Main Media Preview Canvas & Metadata Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[440px]">
          {isVideo ? (
            <video
              src={previewUrl}
              controls
              className="w-full h-full max-h-[420px] object-contain"
            />
          ) : (
            <img
              src={previewUrl}
              alt={`Preview of ${file.name}`}
              className="w-full h-full max-h-[420px] object-contain"
            />
          )}
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Inspection Metadata
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Tag the site zone and source before staging for YOLOv8 analysis.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Site Zone / Sector
              </label>
              <select
                value={zone}
                onChange={(e) => onZoneChange(e.target.value)}
                disabled={analyzing}
                className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
              >
                <option value="Zone A — Structural Steel Bay 4">
                  Zone A — Structural Steel Bay 4
                </option>
                <option value="Zone B — West Loading & Material Staging">
                  Zone B — West Loading & Material Staging
                </option>
                <option value="Zone C — Foundation Rebar Deck">
                  Zone C — Foundation Rebar Deck
                </option>
                <option value="Zone D — Exterior Scaffolding L3">
                  Zone D — Exterior Scaffolding L3
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Camera / Source Identifier
              </label>
              <input
                type="text"
                value={camera}
                onChange={(e) => onCameraChange(e.target.value)}
                disabled={analyzing}
                placeholder="e.g. CAM-04 or Drone Inspection"
                className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
              />
            </div>

            <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Local Preview Ready</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Target model: <code className="font-mono">model/best.pt</code> (11 PPE classes). In Phase 2, clicking Analyze validates the upload and opens the Detection Results workspace.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            {analyzing && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-blue-700 font-medium">
                    Staging media & checking API...
                  </span>
                  <span className="text-slate-700">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              icon={ScanSearch}
              loading={analyzing}
              onClick={onAnalyze}
              className="w-full"
            >
              {analyzing ? 'Processing Media...' : 'Analyze Media'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
