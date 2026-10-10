import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanSearch,
  UploadCloud,
  Download,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Eye,
  Layers,
  Cpu,
} from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { Card } from '../components/ui/Card';
import { Badge, SeverityBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import {
  formatConfidence,
  formatDateTime,
  formatFileSize,
} from '../utils/formatters';

export default function DetectionResults() {
  const navigate = useNavigate();
  const { currentAnalysis, setCurrentAnalysis, incidents } = useAppState();
  const [showOverlay, setShowOverlay] = useState(true);

  const handleLoadDemoSample = (inc) => {
    const sample = inc || incidents[0];
    if (!sample) return;
    setCurrentAnalysis({
      id: sample.id,
      isDemoData: true,
      inferenceStatus: 'DEMO_SAMPLE_RESULT',
      timestamp: sample.timestamp,
      fileName: sample.source,
      fileSize: 2458624,
      fileType: 'image/jpeg',
      isVideo: false,
      zone: sample.zone,
      camera: sample.source,
      originalPreviewUrl: sample.originalImage,
      annotatedPreviewUrl: sample.annotatedImage,
      detections: sample.detections,
      incidentId: sample.id,
      severity: sample.severity,
      confidence: sample.confidence,
      message:
        'Displaying labeled Demo Inspection Sample to demonstrate bounding box and class breakdown UI.',
    });
  };

  const handleDownloadAnnotated = () => {
    const targetUrl =
      currentAnalysis?.annotatedPreviewUrl || currentAnalysis?.originalPreviewUrl;
    if (!targetUrl) return;

    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = `siteguard-annotated-${currentAnalysis.fileName || 'result.svg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear Empty State when no media or sample has been selected yet
  if (!currentAnalysis) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            AI Detection Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Inspect original vs. annotated media, bounding boxes, and PPE class confidence scores.
          </p>
        </div>

        <Card>
          <EmptyState
            icon={ScanSearch}
            title="No Active Detection Result Selected"
            description="Upload a construction site image or video on the Analyze Media page, or load a clearly labeled Demo Detection Sample below to inspect the Detection Results interface."
            actions={
              <>
                <Button
                  variant="primary"
                  size="md"
                  icon={UploadCloud}
                  onClick={() => navigate('/analyze')}
                >
                  Upload Image or Video
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  icon={Eye}
                  onClick={() => handleLoadDemoSample(incidents[0])}
                >
                  Load Demo Detection Sample
                </Button>
              </>
            }
          />
        </Card>
      </div>
    );
  }

  const detections = currentAnalysis.detections || [];
  const violations = detections.filter((d) => d.status === 'Violation');
  const safeDetections = detections.filter((d) => d.status === 'Safe');
  const isBackendPending = currentAnalysis.inferenceStatus === 'BACKEND_PENDING';
  const hasViolations = violations.length > 0;

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              AI Detection Results
            </h1>
            {currentAnalysis.isDemoData ? (
              <Badge variant="demo">Demo Sample Data</Badge>
            ) : (
              <Badge variant="info">Local Media Staged</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Source: {currentAnalysis.fileName} ({formatFileSize(currentAnalysis.fileSize)}) •{' '}
            {currentAnalysis.zone} • {formatDateTime(currentAnalysis.timestamp)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={UploadCloud}
            onClick={() => navigate('/analyze')}
          >
            Analyze Another File
          </Button>

          {currentAnalysis.annotatedPreviewUrl && (
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleDownloadAnnotated}
            >
              Download Annotated Result
            </Button>
          )}

          {currentAnalysis.incidentId && (
            <Button
              variant="primary"
              size="sm"
              icon={ExternalLink}
              onClick={() => navigate(`/incidents/${currentAnalysis.incidentId}`)}
            >
              View Incident Details
            </Button>
          )}
        </div>
      </div>

      {/* Status / Mode Banner */}
      {isBackendPending ? (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-4 text-xs text-amber-900">
          <div className="flex items-start gap-3 max-w-3xl">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                Local File Preview Active — Live YOLOv8 Backend Not Connected (Phase 2)
              </p>
              <p className="mt-0.5 leading-relaxed text-amber-800">
                {currentAnalysis.message}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLoadDemoSample(incidents[0])}
          >
            Load Annotated Demo Sample
          </Button>
        </div>
      ) : (
        <div
          className={`p-4 rounded-lg border flex flex-wrap items-center justify-between gap-4 text-xs ${
            hasViolations
              ? 'bg-red-50/90 border-red-200 text-red-900'
              : 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {hasViolations ? (
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <div>
              <p className="font-semibold text-sm">
                {hasViolations
                  ? `Safety Status: Non-Compliant (${violations.length} PPE Violation${
                      violations.length > 1 ? 's' : ''
                    } Flagged — Demo Sample)`
                  : 'Safety Status: Compliant (All Required PPE Detected — Demo Sample)'}
              </p>
              <p className="text-xs opacity-90 mt-0.5">
                Total Detections: {detections.length} objects • Safe PPE:{' '}
                {safeDetections.length} • Violations: {violations.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Sample Switcher:</span>
            {incidents.slice(0, 3).map((inc) => (
              <button
                key={inc.id}
                type="button"
                onClick={() => handleLoadDemoSample(inc)}
                className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
                  currentAnalysis.id === inc.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {inc.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Original vs Annotated Media Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Media Card */}
        <Card
          title="1. Original Input Media"
          subtitle={`Raw source frame (${currentAnalysis.fileName})`}
          action={<Badge variant="neutral">Unmodified Input</Badge>}
        >
          <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[420px]">
            {currentAnalysis.isVideo ? (
              <video
                src={currentAnalysis.originalPreviewUrl}
                controls
                className="w-full h-full max-h-[400px] object-contain"
              />
            ) : (
              <img
                src={currentAnalysis.originalPreviewUrl}
                alt="Original input media"
                className="w-full h-full max-h-[400px] object-contain"
              />
            )}
          </div>
        </Card>

        {/* Annotated Output Card */}
        <Card
          title="2. YOLOv8 Annotated Detection Output"
          subtitle="Bounding boxes, class labels, and confidence telemetry"
          action={
            currentAnalysis.annotatedPreviewUrl ? (
              <button
                type="button"
                onClick={() => setShowOverlay((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>{showOverlay ? 'Hide Bounding Boxes' : 'Show Bounding Boxes'}</span>
              </button>
            ) : (
              <Badge variant="warning">Awaiting Backend Inference</Badge>
            )
          }
        >
          {currentAnalysis.annotatedPreviewUrl ? (
            <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[420px]">
              <img
                src={
                  showOverlay
                    ? currentAnalysis.annotatedPreviewUrl
                    : currentAnalysis.originalPreviewUrl
                }
                alt="Annotated AI detection output"
                className="w-full h-full max-h-[400px] object-contain"
              />
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 border border-dashed border-slate-300 min-h-[300px] p-6 flex flex-col items-center justify-center text-center">
              <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900">
                No Real-Time Model Prediction Executed Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                Your local file <strong>{currentAnalysis.fileName}</strong> is previewed on the left. Because Phase 2 does not run live Python backend inference, no bounding boxes are fabricated for custom uploads.
              </p>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoadDemoSample(incidents[0])}
                >
                  Preview Annotated Demo Scene
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Detection Summary & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Detected Violations Panel */}
        <div className="lg:col-span-5">
          <Card
            title="Detected Safety Violations"
            subtitle="Flagged non-compliance classes requiring attention"
            action={
              <Badge variant={violations.length > 0 ? 'critical' : 'safe'}>
                {violations.length} Flagged
              </Badge>
            }
          >
            {violations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                {isBackendPending
                  ? 'No violations computed yet — connect the Phase 3 Python backend to run best.pt inference on this file.'
                  : 'No PPE violations detected in this sample.'}
              </div>
            ) : (
              <div className="space-y-3">
                {violations.map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-lg bg-red-50/60 border border-red-200 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-900">
                          {v.label}
                        </span>
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                          {v.className}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-red-700 mt-1">
                        Bounding Box: {v.bbox}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-mono font-bold text-red-700">
                        {formatConfidence(v.confidence)}
                      </span>
                      <div className="mt-0.5">
                        <SeverityBadge severity="Critical" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Full Detected Objects Table */}
        <div className="lg:col-span-7">
          <Card
            title="All Detected Classes & Confidence Scores"
            subtitle="Complete object breakdown per frame"
            noPadding
            action={
              <span className="text-xs font-mono text-slate-500">
                Count: {detections.length}
              </span>
            }
          >
            {detections.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No bounding box detections to display for unanalyzed local media.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">Model Class</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Bounding Box [x1, y1, x2, y2]</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {detections.map((det) => (
                      <tr key={det.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                          {det.className}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {det.label}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {det.bbox}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                          {formatConfidence(det.confidence)}
                        </td>
                        <td className="py-3 px-4">
                          {det.status === 'Violation' ? (
                            <Badge variant="critical" dot>
                              Violation
                            </Badge>
                          ) : det.status === 'Safe' ? (
                            <Badge variant="safe" dot>
                              Compliant PPE
                            </Badge>
                          ) : (
                            <Badge variant="neutral">Worker</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
