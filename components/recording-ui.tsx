'use client'

import { Loader2 } from 'lucide-react';

interface RecordingUIProps {
  isRecording: boolean;
  recordingTime: number;
  stopRecording: () => void;
}

export function RecordingUI({ isRecording, recordingTime, stopRecording }: RecordingUIProps) {
  if (isRecording) {
    return (
      <div className="absolute bottom-14 left-4 p-2 bg-red-100 dark:bg-red-900 rounded-lg shadow-lg mb-2 max-w-xs w-auto flex justify-between items-center">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{recordingTime}s</span>
        </div>
        <button
          onClick={stopRecording}
          className="text-sm text-red-600 dark:text-red-400 font-semibold"
        >
        </button>
      </div>
    );
  }

  return null;
}
