import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Aperture } from 'lucide-react';

interface CameraCaptureProps {
  onImageCapture: (base64: string, mimeType: string) => void;
  onClear: () => void;
  capturedImage: string | null;
}

export function CameraCapture({ onImageCapture, onClear, capturedImage }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      alert('دسترسی به دوربین امکان‌پذیر نیست. لطفاً از گالری استفاده کنید.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg', 0.9);
    onImageCapture(base64, 'image/jpeg');
    stopCamera();
  }, [onImageCapture, stopCamera]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onImageCapture(result, file.type);
    };
    reader.readAsDataURL(file);
  }, [onImageCapture]);

  if (capturedImage) {
    return (
      <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
        <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
        <button onClick={onClear}
          className="absolute top-3 left-3 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all active:scale-95">
          <X size={20} />
        </button>
      </div>
    );
  }

  if (isCameraOpen) {
    return (
      <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-lg">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-4">
          <button onClick={capturePhoto}
            className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-transform">
            <Aperture size={20} /> ثبت عکس
          </button>
          <button onClick={stopCamera}
            className="bg-red-500/90 text-white px-4 py-3 rounded-full shadow-lg active:scale-95 transition-transform">
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-4 shadow-inner">
      <div className="bg-blue-100 p-4 rounded-full"><Camera size={32} className="text-blue-600" /></div>
      <p className="text-slate-600 font-medium">تصویر قطعه را ثبت کنید</p>
      <div className="flex gap-3">
        <button onClick={startCamera}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md active:scale-95 transition-all">
          <Camera size={18} /> دوربین
        </button>
        <button onClick={() => fileInputRef.current?.click()}
          className="bg-white hover:bg-gray-50 text-slate-700 border border-slate-300 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm active:scale-95 transition-all">
          <Upload size={18} /> گالری
        </button>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
    </div>
  );
}
