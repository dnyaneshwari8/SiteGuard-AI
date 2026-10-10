import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { DropZone } from '../components/upload/DropZone';
import { MediaPreview } from '../components/upload/MediaPreview';
import { siteGuardApi } from '../services/api';
import { YOLO_MODEL_INFO } from '../services/mockData';
import { useAppState } from '../hooks/useAppState';

export default function AnalyzeMedia() {
  const navigate = useNavigate();
  const { setCurrentAnalysis, setActivityLog, incidents } = useAppState();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [zone, setZone] = useState('Zone A — Structural Steel Bay 4');
  const [camera, setCamera] = useState('CAM-04 (Manual Upload)');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setProgress(0);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setProgress(0);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setProgress(10);

    try {
      const result = await siteGuardApi.analyzeMediaFile(
        selectedFile,
        { zone, camera },
        (pct) => setProgress(pct)
      );

      setCurrentAnalysis(result);
      setActivityLog((prev) => [
        {
          id: `ACT-${Date.now().toString().slice(-4)}`,
          time: 'Just now',
          title: `Media staged for analysis: ${selectedFile.name}`,
          detail: `${zone} • Ready for Phase 3 YOLOv8 inference`,
          type: 'upload',
        },
        ...prev,
      ]);

      navigate('/results');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLoadSampleInspection = (incident) => {
    setCurrentAnalysis({
      id: incident.id,
      isDemoData: true,
      inferenceStatus: 'DEMO_SAMPLE_RESULT',
      timestamp: incident.timestamp,
      fileName: incident.source,
      fileSize: 2458624,
      fileType: incident.source.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
      isVideo: false,
      zone: incident.zone,
      camera: incident.source,
      originalPreviewUrl: incident.originalImage,
      annotatedPreviewUrl: incident.annotatedImage,
      detections: incident.detections,
      incidentId: incident.id,
      severity: incident.severity,
      confidence: incident.confidence,
      message:
        'Displaying pre-annotated Demo Inspection Record to preview the Detection Results UI.',
    });
    navigate('/results');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Analyze Site Media
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Upload construction site images or video clips for PPE compliance inspection.
          </p>
        </div>

        <Badge variant="demo">Phase 2 Local Preview + API Layer Ready</Badge>
      </div>

      {/* Phase 2 Honest Integration Notice */}
      <div className="p-4 rounded-lg bg-blue-50/80 border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">
            Frontend Media Staging & Local Preview Active
          </p>
          <p className="text-blue-800 leading-relaxed">
            Select any image (<code className="font-mono">.jpg, .png, .webp</code>) or video (<code className="font-mono">.mp4, .webm, .mov</code>) from your device to test drag-and-drop validation, instant local preview, and the API service workflow. In Phase 2, uploaded files are previewed locally without fabricating YOLO predictions. You can also load a labeled <strong>Demo Inspection Sample</strong> below to inspect bounding box rendering.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Columns: Upload DropZone or MediaPreview */}
        <div className="lg:col-span-8 space-y-6">
          <Card
            title={
              selectedFile
                ? 'Selected Media Preview & Inspection Settings'
                : 'Select Construction Site Image or Video'
            }
            subtitle={
              selectedFile
                ? 'Verify file preview and metadata before staging for Detection Results'
                : 'Drag and drop a file below or browse from your computer'
            }
          >
            {!selectedFile ? (
              <DropZone onFileSelect={handleFileSelect} />
            ) : (
              <MediaPreview
                file={selectedFile}
                previewUrl={previewUrl}
                zone={zone}
                onZoneChange={setZone}
                camera={camera}
                onCameraChange={setCamera}
                onRemove={handleRemoveFile}
                onAnalyze={handleAnalyze}
                analyzing={analyzing}
                progress={progress}
              />
            )}
          </Card>

          {/* Quick Demo Sample Selector for testing Detection Results */}
          <Card
            title="Or Preview Detection Results with Labeled Demo Samples"
            subtitle="Load a sample construction scene with pre-computed demo bounding boxes"
            action={<Badge variant="demo">Demo Samples</Badge>}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {incidents.slice(0, 3).map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <img
                      src={inc.annotatedImage}
                      alt={inc.category}
                      className="w-full h-24 object-cover rounded border border-slate-200 mb-2"
                    />
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[11px] font-semibold text-slate-800">
                        {inc.id}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                        {inc.modelClass}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-900 mt-1 truncate">
                      {inc.category}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {inc.source}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={ArrowRight}
                    onClick={() => handleLoadSampleInspection(inc)}
                    className="w-full"
                  >
                    Inspect Sample
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 4 Columns: YOLOv8 Model Specification & Guidelines */}
        <div className="lg:col-span-4 space-y-6">
          <Card
            title="Target AI Model Specification"
            subtitle="Preserved local weight artifact"
            action={<Cpu className="w-4 h-4 text-blue-600" />}
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Weight Path:</span>
                  <code className="font-mono font-semibold text-slate-900">
                    {YOLO_MODEL_INFO.modelPath}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Architecture:</span>
                  <span className="font-medium text-slate-800">YOLOv8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Classes:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    11 Classes
                  </span>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-700 mb-2">
                  Monitored PPE & Violation Classes:
                </p>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {Object.entries(YOLO_MODEL_INFO.classes).map(([idx, cls]) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1.5 rounded border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 w-4">
                          #{idx}
                        </span>
                        <span className="font-medium text-slate-800">
                          {cls.label}
                        </span>
                      </div>
                      {cls.type === 'violation' ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title="Upload Best Practices"
            subtitle="For optimal YOLOv8 detection accuracy"
            action={<FileCheck2 className="w-4 h-4 text-emerald-600" />}
          >
            <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
              <li>
                Use unobstructed camera angles where workers&apos; heads, torsos, hands, and footwear are visible.
              </li>
              <li>
                Minimum recommended resolution: <strong>1280 × 720 (720p)</strong> for elevated crane or perimeter cameras.
              </li>
              <li>
                Supported image formats: <strong>JPG, PNG, WEBP</strong>. Supported video formats: <strong>MP4, WEBM, MOV</strong>.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
