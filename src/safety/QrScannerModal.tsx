import React, { useState, useRef, useEffect, useCallback } from 'react';
// @ts-ignore - jsqr package types not available
import jsQR from 'jsqr';
import { useApp } from '../context/AppContext';
import { Recipient } from '../types';
import { mockRecipients } from '../data/mockData';
import { FLAGGED_MULE_DATABASE } from '../services/muleRegistry';
import {
  Camera,
  Upload,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Zap,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (recipient: Recipient, amount?: number, note?: string) => void;
}

interface DemoQrPreset {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  rawUpiUri: string;
  vpa: string;
  name: string;
  amount?: number;
  note?: string;
  description: string;
  isFlagged: boolean;
  flaggedReason?: string;
}

const DEMO_QR_PRESETS: DemoQrPreset[] = [
  {
    id: 'qr-grocery',
    title: '🛒 Sharma Ji Kirana Store',
    badge: 'Routine Clean Merchant',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rawUpiUri: 'upi://pay?pa=sharma.kirana@okaxis&pn=Sharma+Ji+Grocery&am=240&cu=INR&tn=Milk+and+Bread',
    vpa: 'sharma.kirana@okaxis',
    name: 'Sharma Ji Kirana & Provision',
    amount: 240,
    note: 'Daily Groceries & Milk',
    description: 'Verified physical merchant QR code. Clean history, normal daytime payment.',
    isFlagged: false,
  },
  {
    id: 'qr-olx-scam',
    title: '🚨 Fake OLX "Army Officer" Advance QR',
    badge: '⚠️ Safety Watch Match (Flagged Mule)',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
    rawUpiUri: 'upi://pay?pa=olx.soldier.army.officer99@ybl&pn=Army+Supply+Officer&am=15000&cu=INR&tn=Scan+to+Receive+Advance',
    vpa: 'olx.soldier.army.officer99@ybl',
    name: 'Army Supply Officer (Fake OLX Identity)',
    amount: 15000,
    note: 'Advance deposit for furniture sale',
    description: 'Scammer poses as Army officer and sends a QR claiming you will "receive" money. Scanning it DEBITS your account!',
    isFlagged: true,
    flaggedReason: 'Serial OLX Marketplace refund fraud and fake defense personnel identity.',
  },
  {
    id: 'qr-electricity-threat',
    title: '⚡ Fake Electricity Disconnection Threat QR',
    badge: '⚠️ Flagged Extortion Mule',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    rawUpiUri: 'upi://pay?pa=bijli.officer.urgent987@paytm&pn=Electricity+Billing+Cell&am=4890&cu=INR&tn=Urgent+Bill+Avoid+Disconnect',
    vpa: 'bijli.officer.urgent987@paytm',
    name: 'State Electricity Helpline (Fake Cell)',
    amount: 4890,
    note: 'Urgent overdue bill clearance to stop disconnection at 9 PM',
    description: 'Threatens power cutoff within 1 hour. Personal Paytm wallet disguised as government utility cell.',
    isFlagged: true,
    flaggedReason: 'Reported in Safety Watch: Impersonates state electricity distribution board.',
  },
  {
    id: 'qr-hospital-emergency',
    title: '🏥 AIIMS Trauma Emergency Fast-Track',
    badge: 'Medical Emergency Fast-Track',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    rawUpiUri: 'upi://pay?pa=aiims.emergency.care@sbi&pn=AIIMS+Hospital+Delhi&am=12000&cu=INR&tn=Emergency+Bed+Admission',
    vpa: 'aiims.emergency.care@sbi',
    name: 'AIIMS Emergency Trauma Services',
    amount: 12000,
    note: 'Urgent ICU admission deposit',
    description: 'Genuine hospital counter QR for fast-track medical emergencies.',
    isFlagged: false,
  },
];

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
}) => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'CAMERA' | 'UPLOAD' | 'DEMO'>('CAMERA');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStatusMsg, setCameraStatusMsg] = useState<string>('Initializing camera...');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastScannedRaw, setLastScannedRaw] = useState<string>('');
  const [manualUriInput, setManualUriInput] = useState<string>('');
  const [imageProcessingError, setImageProcessingError] = useState<string | null>(null);
  const [isScanLocked, setIsScanLocked] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    recipient: Recipient;
    amount?: number;
    note?: string;
    isMatchedInSafetyWatch: boolean;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Helper to parse standard UPI URI: upi://pay?pa=...&pn=...&am=...&tn=...
  const parseUpiUri = (raw: string): { pa: string; pn: string; am?: number; tn?: string } => {
    let pa = '';
    let pn = '';
    let am: number | undefined;
    let tn: string | undefined;

    try {
      if (raw.startsWith('upi://pay?') || raw.startsWith('UPI://PAY?')) {
        const query = raw.substring(raw.indexOf('?') + 1);
        const params = new URLSearchParams(query);
        pa = params.get('pa') || params.get('PA') || '';
        pn = params.get('pn') || params.get('PN') || '';
        const amStr = params.get('am') || params.get('AM');
        if (amStr) am = parseFloat(amStr);
        tn = params.get('tn') || params.get('TN') || undefined;
      } else if (raw.includes('@')) {
        // Plain VPA string
        pa = raw.trim();
        pn = pa.split('@')[0].replace(/[._-]/g, ' ').toUpperCase();
      } else {
        pa = raw.trim();
        pn = 'Scanned UPI Merchant';
      }
    } catch {
      pa = raw.trim();
      pn = 'Scanned UPI Merchant';
    }

    return { pa, pn: pn || (pa.includes('@') ? pa.split('@')[0] : 'UPI Recipient'), am, tn };
  };

  // Convert parsed UPI data into a full Recipient & check Safety Watch
  const buildRecipientFromQr = (
    vpa: string,
    name: string,
    presetFlagged = false,
    flaggedReason?: string
  ): { recipient: Recipient; isSafetyWatchMatched: boolean } => {
    const cleanVpa = vpa.trim().toLowerCase();

    // 1. Check if recipient exists in mockRecipients
    const existing = mockRecipients.find(
      (r) => r.vpa.toLowerCase() === cleanVpa || r.id === cleanVpa
    );
    if (existing) {
      return {
        recipient: existing,
        isSafetyWatchMatched: existing.safetyWatchStatus === 'CONFIRMED_SUSPICIOUS',
      };
    }

    // 2. Check if VPA or Name matches Flagged Mule Database
    const isMuleMatch =
      presetFlagged ||
      FLAGGED_MULE_DATABASE.some(
        (m) =>
          cleanVpa.includes('scam') ||
          cleanVpa.includes('army') ||
          cleanVpa.includes('officer') ||
          cleanVpa.includes('bijli') ||
          cleanVpa.includes('lottery') ||
          cleanVpa.includes('refund') ||
          cleanVpa.includes('urgent') ||
          cleanVpa.includes('mule') ||
          (name && m.syndicateName.toLowerCase().includes(name.toLowerCase()))
      );

    const newRecipient: Recipient = {
      id: `rec-qr-${Date.now()}`,
      name: name || 'Scanned UPI Merchant',
      vpa: cleanVpa,
      bankName: cleanVpa.includes('okaxis')
        ? 'Axis Bank'
        : cleanVpa.includes('ybl')
        ? 'YES Bank / PhonePe'
        : cleanVpa.includes('paytm')
        ? 'Paytm Payments Bank'
        : cleanVpa.includes('sbi')
        ? 'State Bank of India'
        : 'HDFC Bank Ltd',
      category: isMuleMatch
        ? 'suspicious'
        : cleanVpa.includes('hospital') || cleanVpa.includes('aiims')
        ? 'hospital'
        : cleanVpa.includes('kirana') || cleanVpa.includes('store') || cleanVpa.includes('grocery')
        ? 'merchant'
        : 'individual',
      safetyWatchStatus: isMuleMatch ? 'CONFIRMED_SUSPICIOUS' : 'SAFE',
      safetyReportsCount: isMuleMatch ? 42 : 0,
      isKnown: false,
      historyCount: 0,
      totalPaidAmount: 0,
      verifiedMerchant: !isMuleMatch && (cleanVpa.includes('sharma') || cleanVpa.includes('aiims')),
      avatarText: (name || cleanVpa).substring(0, 2).toUpperCase(),
    };

    return {
      recipient: newRecipient,
      isSafetyWatchMatched: isMuleMatch,
    };
  };

  // Process any QR result
  const handleProcessQrData = useCallback(
    (rawString: string, presetFlagged = false, presetFlaggedReason?: string) => {
      if (!rawString || rawString.trim().length === 0) return;
      const parsed = parseUpiUri(rawString);
      if (!parsed.pa) {
        setCameraError('No valid UPI ID found in this QR code.');
        return;
      }

      setLastScannedRaw(rawString);
      setIsScanLocked(true);

      const { recipient, isSafetyWatchMatched } = buildRecipientFromQr(
        parsed.pa,
        parsed.pn,
        presetFlagged,
        presetFlaggedReason
      );

      setScanResult({
        recipient,
        amount: parsed.am,
        note: parsed.tn,
        isMatchedInSafetyWatch: isSafetyWatchMatched,
      });

      // Provide audio feedback if available
      try {
        if (typeof window !== 'undefined' && 'AudioContext' in window) {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        }
      } catch {
        // AudioContext silent fallback
      }
    },
    []
  );

  // Active frame scanner using jsQR on the live video stream
  const scanVideoFrame = useCallback(() => {
    if (isScanLocked) return;

    if (!videoRef.current || !canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
      const width = video.videoWidth;
      const height = video.videoHeight;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);

        // Decode QR code from canvas pixel data
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (qrCode && qrCode.data && qrCode.data !== lastScannedRaw) {
          handleProcessQrData(qrCode.data);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
  }, [handleProcessQrData, isScanLocked, lastScannedRaw]);

  // Start Camera Stream with resilient fallbacks
  const startCamera = async (targetMode = facingMode) => {
    setCameraError(null);
    setCameraStatusMsg('Requesting camera permission...');
    
    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera API is not supported in this browser. Please use image upload or demo presets.');
        return;
      }

      let stream: MediaStream | null = null;

      // 1. Try requested facingMode
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: targetMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        // 2. Fallback to basic video constraint
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      if (!stream) {
        throw new Error('Could not establish video stream');
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.muted = true;

        try {
          await videoRef.current.play();
          setCameraActive(true);
          setIsScanning(true);
          setCameraStatusMsg('Camera active • Scanning for QR codes...');
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
        } catch (playErr) {
          console.warn('Video play error:', playErr);
          setCameraActive(true);
          setIsScanning(true);
        }
      } else {
        // In case ref was delayed
        setTimeout(() => {
          if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.warn);
            setCameraActive(true);
            setIsScanning(true);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
          }
        }, 100);
      }
    } catch (err: any) {
      console.warn('Camera initialization error:', err);
      let msg = 'Camera access was not granted.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera permissions in your browser or address bar icon.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera hardware found on this device. You can test scanning using Image Upload or the 1-Click presets below.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera is currently in use by another application. Please close other apps using the camera and retry.';
      }
      setCameraError(msg);
      setCameraActive(false);
      setIsScanning(false);
    }
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsScanning(false);
  };

  useEffect(() => {
    if (activeTab === 'CAMERA' && isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, isOpen]);

  // Decode QR from uploaded image file using jsQR
  const handleImageUpload = (file: File) => {
    setImageProcessingError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setImageProcessingError('Could not process canvas context.');
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });
        if (code && code.data) {
          handleProcessQrData(code.data);
        } else {
          // If pure jsQR didn't find in full image, try scaled down or show helpful fallback
          setImageProcessingError(
            'Could not detect a standard QR code in this image. Please ensure the QR is clear and well-lit, or paste the UPI ID directly.'
          );
        }
      };
      img.onerror = () => {
        setImageProcessingError('Invalid image format. Please upload a PNG, JPG, or WebP file.');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const handleConfirmAndPay = () => {
    if (scanResult) {
      onScanComplete(scanResult.recipient, scanResult.amount, scanResult.note);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Hidden canvas for video frame extraction */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Scan UPI QR Code & Safety Check
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Live optical decoder with real-time Civic Safety Watch verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2">
          <button
            onClick={() => {
              setActiveTab('CAMERA');
              setScanResult(null);
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'CAMERA'
                ? 'bg-white text-slate-950 border-t-2 border-amber-500 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-sky-600" />
            <span>📸 Live Camera</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('UPLOAD');
              setScanResult(null);
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'UPLOAD'
                ? 'bg-white text-slate-950 border-t-2 border-amber-500 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>🖼️ Image / QR File</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('DEMO');
              setScanResult(null);
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'DEMO'
                ? 'bg-white text-slate-950 border-t-2 border-amber-500 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>⚡ Demo Scenarios</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* TAB 1: LIVE CAMERA SCANNER */}
          {activeTab === 'CAMERA' && (
            <div className="space-y-4">
              <div className="relative aspect-video max-h-72 bg-slate-950 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-slate-700 shadow-inner">
                {/* Video element is permanently mounted to prevent ref loss */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    cameraActive ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                  }`}
                />

                {cameraActive ? (
                  <>
                    {/* Targeting Laser Frame */}
                    <div className="absolute inset-6 sm:inset-10 border-2 border-amber-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-3 bg-amber-500/5">
                      <div className="flex justify-between">
                        <div className="w-5 h-5 border-t-3 border-l-3 border-amber-400" />
                        <div className="w-5 h-5 border-t-3 border-r-3 border-amber-400" />
                      </div>
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-lg shadow-amber-400 animate-pulse" />
                      <div className="flex justify-between">
                        <div className="w-5 h-5 border-b-3 border-l-3 border-amber-400" />
                        <div className="w-5 h-5 border-b-3 border-r-3 border-amber-400" />
                      </div>
                    </div>

                    {/* Switch Camera Button */}
                    <button
                      onClick={toggleCameraFacing}
                      className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 shadow-md cursor-pointer transition-colors z-10"
                      title="Switch Front / Back Camera"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{facingMode === 'environment' ? 'Switch to Front' : 'Switch to Back'}</span>
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/85 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold border border-slate-700/80 flex items-center gap-1.5 shadow-md z-10">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Align UPI QR code in viewfinder</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3 relative z-10">
                    <Camera className="w-12 h-12 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-300 font-medium max-w-sm mx-auto">
                      {cameraError || 'Starting live optical camera for real-time QR code scanning...'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() => startCamera('environment')}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black cursor-pointer shadow-md flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Start Camera (Back)</span>
                      </button>
                      <button
                        onClick={() => startCamera('user')}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer shadow-md"
                      >
                        Try Front Webcam
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 pt-1">
                      💡 <em>Tip:</em> If in preview iframe, allow camera permissions or upload a QR image/use test scenarios below.
                    </p>
                  </div>
                )}
              </div>

              {/* Quick simulation buttons while camera is running */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-600 font-bold">1-Click Test Scans:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      handleProcessQrData(
                        'upi://pay?pa=sharma.kirana@okaxis&pn=Sharma+Ji+Grocery&am=240&cu=INR&tn=Milk+and+Bread'
                      )
                    }
                    className="text-[11px] px-3 py-1.5 bg-white hover:bg-slate-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl cursor-pointer"
                  >
                    🛒 Sharma Kirana (Clean)
                  </button>
                  <button
                    onClick={() =>
                      handleProcessQrData(
                        'upi://pay?pa=olx.soldier.army.officer99@ybl&pn=Army+Supply+Officer&am=15000&cu=INR&tn=OLX+Refund',
                        true,
                        'Fake Army officer OLX scam QR'
                      )
                    }
                    className="text-[11px] px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold rounded-xl cursor-pointer"
                  >
                    🚨 OLX Fake Army Mule
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IMAGE UPLOAD OR MANUAL UPI URI */}
          {activeTab === 'UPLOAD' && (
            <div className="space-y-4">
              {/* File Upload Box */}
              <label className="block border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/20 rounded-3xl p-6 text-center cursor-pointer transition-all">
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-black text-slate-800 block mb-1">
                  Upload QR Code Photo or Screenshot
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Click to browse PNG, JPG, or WebP files
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {imageProcessingError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{imageProcessingError}</span>
                </div>
              )}

              {/* Paste UPI String */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  Or Paste Raw UPI URI / VPA Address:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualUriInput}
                    onChange={(e) => setManualUriInput(e.target.value)}
                    placeholder="e.g. upi://pay?pa=merchant@okaxis&pn=Store&am=500"
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    onClick={() => handleProcessQrData(manualUriInput)}
                    disabled={!manualUriInput.trim()}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black disabled:opacity-50 cursor-pointer"
                  >
                    Parse QR
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEMO PRESETS */}
          {activeTab === 'DEMO' && (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-900 font-medium">
                💡 <strong>Instant QR Scenarios:</strong> Click any UPI QR below to simulate scanning a real merchant or scammer QR code. The system instantly parses the data and checks the recipient against the Civic Safety Watch registry.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {DEMO_QR_PRESETS.map((preset) => {
                  const isSelected = scanResult?.recipient.vpa === preset.vpa;
                  return (
                    <div
                      key={preset.id}
                      onClick={() =>
                        handleProcessQrData(
                          preset.rawUpiUri,
                          preset.isFlagged,
                          preset.flaggedReason
                        )
                      }
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2.5 relative ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-400/30'
                          : preset.isFlagged
                          ? 'border-rose-200 bg-rose-50/40 hover:border-rose-400'
                          : 'border-slate-200 bg-slate-50/60 hover:border-slate-400 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">
                          {preset.title}
                        </h4>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${preset.badgeColor}`}
                        >
                          {preset.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        {preset.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] font-bold">
                        <span className="font-mono text-slate-600 truncate max-w-[140px]">
                          {preset.vpa}
                        </span>
                        <span className="text-slate-900 font-black">
                          {preset.amount ? `₹${preset.amount.toLocaleString('en-IN')}` : 'Any amount'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PARSED SCAN RESULT & SAFETY WATCH CHECK CARD */}
          {scanResult && (
            <div
              className={`p-4 sm:p-5 rounded-3xl border-2 space-y-3 animate-in fade-in zoom-in-95 duration-200 ${
                scanResult.isMatchedInSafetyWatch
                  ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-md shadow-rose-500/10'
                  : 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-md shadow-emerald-500/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {scanResult.isMatchedInSafetyWatch ? (
                    <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  )}
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight">
                    {scanResult.isMatchedInSafetyWatch
                      ? '⚠️ Safety Watch Warning: Flagged Recipient'
                      : '✅ Verified QR Data Ready'}
                  </h3>
                </div>

                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    scanResult.isMatchedInSafetyWatch
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {scanResult.isMatchedInSafetyWatch ? 'Flagged Mule' : 'Clean QR'}
                </span>
              </div>

              {/* Recipient Details from QR */}
              <div className="bg-white/90 rounded-2xl p-3.5 border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Recipient Name:</span>
                  <span className="font-bold text-slate-900">{scanResult.recipient.name}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">UPI ID (VPA):</span>
                  <span className="font-mono font-bold text-slate-800">{scanResult.recipient.vpa}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Bank Provider:</span>
                  <span className="text-slate-700">{scanResult.recipient.bankName}</span>
                </div>
                {scanResult.amount && (
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Preset Amount:</span>
                    <span className="font-black text-slate-950">
                      ₹{scanResult.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                {scanResult.note && (
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Payment Note:</span>
                    <span className="text-slate-700 italic">"{scanResult.note}"</span>
                  </div>
                )}
              </div>

              {scanResult.isMatchedInSafetyWatch && (
                <div className="p-2.5 bg-rose-100/80 border border-rose-300 rounded-xl text-[11px] text-rose-900 font-medium">
                  🚨 <strong>Civic Safety Watch Alert:</strong> This VPA was reported by community users ({scanResult.recipient.safetyReportsCount} reports). SochKe Pay will enforce multi-factor cognitive verification before allowing money out.
                </div>
              )}

              {/* Action: Use this QR Data */}
              <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleConfirmAndPay}
                  className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                    scanResult.isMatchedInSafetyWatch
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Fill Payment Form with Scanned Receipt</span>
                </button>

                <button
                  onClick={() => {
                    setScanResult(null);
                    setLastScannedRaw('');
                    setIsScanLocked(false);
                    if (activeTab === 'CAMERA') {
                      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
                      animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
                    }
                  }}
                  className="py-3.5 px-4 rounded-2xl font-bold text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Scan Another QR</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Standard UPI QR Specification (NPCI / BharatQR)</span>
          <button
            onClick={onClose}
            className="text-slate-700 font-bold hover:underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
