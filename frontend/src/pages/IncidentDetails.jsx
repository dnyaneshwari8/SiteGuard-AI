import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquarePlus,
  Layers,
  ScanSearch,
  MapPin,
  FileImage,
  UserCheck,
} from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { Card } from '../components/ui/Card';
import { Badge, SeverityBadge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatConfidence, formatDateTime } from '../utils/formatters';

export default function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    incidents,
    updateIncidentStatus,
    addIncidentNote,
    setCurrentAnalysis,
  } = useAppState();

  const incident = incidents.find((item) => item.id === id);

  const [showAnnotated, setShowAnnotated] = useState(true);
  const [noteInput, setNoteInput] = useState('');
  const [statusFeedback, setStatusFeedback] = useState('');

  if (!incident) {
    return (
      <Card>
        <EmptyState
          icon={AlertTriangle}
          title={`Incident "${id}" Not Found`}
          description="The requested incident record could not be located in the current session."
          actions={
            <Button
              variant="primary"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate('/incidents')}
            >
              Back to Incident History
            </Button>
          }
        />
      </Card>
    );
  }

  const handleStatusUpdate = (nextStatus) => {
    updateIncidentStatus(incident.id, nextStatus);
    setStatusFeedback(
      `Incident ${incident.id} status updated to "${nextStatus}" (saved in local frontend session).`
    );
    setTimeout(() => setStatusFeedback(''), 4000);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addIncidentNote(incident.id, noteInput);
    setNoteInput('');
  };

  const handleOpenInDetectionResults = () => {
    setCurrentAnalysis({
      id: incident.id,
      isDemoData: true,
      inferenceStatus: 'DEMO_SAMPLE_RESULT',
      timestamp: incident.timestamp,
      fileName: incident.source,
      fileSize: 2458624,
      fileType: 'image/jpeg',
      isVideo: false,
      zone: incident.zone,
      camera: incident.source,
      originalPreviewUrl: incident.originalImage,
      annotatedPreviewUrl: incident.annotatedImage,
      detections: incident.detections,
      incidentId: incident.id,
      severity: incident.severity,
      confidence: incident.confidence,
    });
    navigate('/results');
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigate('/incidents')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Incident History</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {incident.id}
            </h1>
            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
            <Badge variant="demo">Demo Record</Badge>
          </div>
          <p className="text-xs text-slate-500">
            Logged on {formatDateTime(incident.timestamp)} • {incident.zone}
          </p>
        </div>

        {/* Review Status Workflow Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={ScanSearch}
            onClick={handleOpenInDetectionResults}
          >
            Open in Detection Results
          </Button>

          <Button
            variant={incident.status === 'Under Review' ? 'secondary' : 'outline'}
            size="sm"
            icon={Clock}
            disabled={incident.status === 'Under Review'}
            onClick={() => handleStatusUpdate('Under Review')}
          >
            Mark Under Review
          </Button>

          <Button
            variant="success"
            size="sm"
            icon={CheckCircle2}
            disabled={incident.status === 'Resolved'}
            onClick={() => handleStatusUpdate('Resolved')}
          >
            Mark Resolved
          </Button>
        </div>
      </div>

      {statusFeedback && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Evidence Image & Detection Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <Card
            title="Incident Visual Evidence (Demo)"
            subtitle={`Source File: ${incident.source}`}
            action={
              <button
                type="button"
                onClick={() => setShowAnnotated((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {showAnnotated
                    ? 'Viewing Annotated Evidence'
                    : 'Viewing Original Frame'}
                </span>
              </button>
            }
          >
            <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
              <img
                src={
                  showAnnotated ? incident.annotatedImage : incident.originalImage
                }
                alt={`Evidence for ${incident.id}`}
                className="w-full max-h-[420px] object-contain"
              />
            </div>
          </Card>

          <Card
            title="Detected Objects in Evidence Frame"
            subtitle="Bounding box coordinates and YOLOv8 class confidence"
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Label</th>
                    <th className="py-3 px-4">Coordinates</th>
                    <th className="py-3 px-4">Confidence</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {incident.detections.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {d.className}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {d.label}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {d.bbox}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {formatConfidence(d.confidence)}
                      </td>
                      <td className="py-3 px-4">
                        {d.status === 'Violation' ? (
                          <Badge variant="critical" dot>
                            Violation
                          </Badge>
                        ) : d.status === 'Safe' ? (
                          <Badge variant="safe" dot>
                            Safe PPE
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
          </Card>
        </div>

        {/* Right 5 Columns: Violation Metadata & Supervisor Notes */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            title="Violation Summary & Telemetry"
            subtitle="Structured metadata for HSE compliance audit"
          >
            <dl className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500">Incident ID</dt>
                <dd className="font-mono font-semibold text-slate-900">
                  {incident.id}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500">Primary Violation</dt>
                <dd className="font-semibold text-red-700">
                  {incident.category} ({incident.modelClass})
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500">Detection Confidence</dt>
                <dd className="font-mono font-bold text-slate-900">
                  {formatConfidence(incident.confidence)}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500">Review Status</dt>
                <dd>
                  <StatusBadge status={incident.status} />
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Site Zone</span>
                </dt>
                <dd className="font-medium text-slate-800 text-right">
                  {incident.zone}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500 flex items-center gap-1.5">
                  <FileImage className="w-3.5 h-3.5 text-slate-400" />
                  <span>Source Media</span>
                </dt>
                <dd className="font-mono text-slate-700 text-right">
                  {incident.source}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assigned Officer</span>
                </dt>
                <dd className="font-medium text-slate-800 text-right">
                  {incident.assignedTo}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Supervisor Notes & Activity Log */}
          <Card
            title="Investigation Notes"
            subtitle="Local session notes for supervisor follow-up"
          >
            <div className="space-y-4">
              {(!incident.notes || incident.notes.length === 0) ? (
                <div className="p-4 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                  No investigation notes recorded yet for {incident.id}.
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {incident.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-900">
                          {note.author}
                        </span>
                        <span className="font-mono text-slate-400">
                          {formatDateTime(note.timestamp)}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleAddNote} className="space-y-2.5 pt-2 border-t border-slate-100">
                <label
                  htmlFor="incident-note"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Add Supervisor Note
                </label>
                <textarea
                  id="incident-note"
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Document corrective action taken, worker briefing, or zone clearance..."
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={MessageSquarePlus}
                    disabled={!noteInput.trim()}
                  >
                    Save Note (Local)
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
