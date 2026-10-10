import React, { useRef, useState } from 'react';
import { UploadCloud, Image, Film, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export function DropZone({ onFileSelect }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const validateAndSelect = (file) => {
    setError('');
    if (!file) return;

    const isAllowedMime =
      ALLOWED_TYPES.includes(file.type) ||
      /\.(jpg|jpeg|png|webp|mp4|webm|mov)$/i.test(file.name);

    if (!isAllowedMime) {
      setError(
        `Unsupported file format "${file.name}". Please upload a JPG, PNG, WEBP image or MP4, WEBM, MOV video.`
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(
        `File "${file.name}" exceeds the 100 MB size limit. Please select a smaller media file.`
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 sm:p-10 text-center transition-colors ${
          isDragging
            ? 'border-blue-600 bg-blue-50/60'
            : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/60 hover:border-slate-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.mp4,.webm,.mov,image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto text-blue-600">
          <UploadCloud className="w-6 h-6" />
        </div>

        <h4 className="mt-4 text-sm font-semibold text-slate-900">
          Drag and drop site image or video here, or click to browse
        </h4>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          Select construction site camera frames or drone/CCTV video clips for PPE safety inspection.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            Select File from Computer
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-slate-400" />
            Images: JPG, PNG, WEBP (up to 25 MB recommended)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-slate-400" />
            Videos: MP4, WEBM, MOV (up to 100 MB)
          </span>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">File Validation Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
