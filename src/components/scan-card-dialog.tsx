
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { scanCardDetails, ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';
import { Camera as CameraIcon, X, Zap, ZapOff, Image as ImageIcon, Check, ArrowLeft, Crop, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/context/language-context';

type Point = { x: number; y: number };

interface ScanCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanComplete: (data: Partial<ScanCardDetailsOutput> & { cardImageUrl?: string }) => void;
}

export function ScanCardDialog({
  open,
  onOpenChange,
  onScanComplete,
}: ScanCardDialogProps) {
  const [step, setStep] = useState<'camera' | 'crop'>('camera');
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(new Image());

  const [corners, setCorners] = useState<Point[]>([
    { x: 100, y: 100 },
    { x: 300, y: 100 },
    { x: 300, y: 200 },
    { x: 100, y: 200 },
  ]);
  const [draggingCorner, setDraggingCorner] = useState<number | null>(null);
  
  const { toast } = useToast();
  const { t } = useLanguage();

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const setupCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: t('camera_permission_denied_title'),
          description: t('camera_permission_denied_desc'),
        });
      }
    } else {
      setHasCameraPermission(false);
    }
  }, [t, toast]);
  
  const resetState = useCallback(() => {
    setImage(null);
    setIsFlashOn(false);
    setStep('camera');
    stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (open) {
      resetState();
      setupCamera();
    } else {
      stopCamera();
    }
  }, [open, resetState, setupCamera]);

  const handleScan = (cardImageDataUri: string) => {
    if (!cardImageDataUri) return;
    onOpenChange(false);
    toast({
        title: t('scanning_toast_title'),
        description: t('scanning_toast_desc'),
    });
    scanCardDetails({ cardImageDataUri })
      .then(result => {
        onScanComplete({ ...result, cardImageUrl: cardImageDataUri });
        toast({
          title: t('scan_success_toast_title'),
          description: t('scan_success_toast_desc'),
        });
      })
      .catch(error => {
        console.error('Error scanning card:', error);
        toast({
          title: t('scan_failed_toast_title'),
          description: t('scan_failed_toast_desc'),
          variant: 'destructive',
        });
      });
  };

  const takePicture = () => {
    if (videoRef.current && hasCameraPermission) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        imageRef.current.src = dataUrl;
        imageRef.current.onload = () => {
            setImage(dataUrl);
            setStep('crop');
            stopCamera();
            
            // Set initial corners based on image size
            const MARGIN = 0.15;
            const w = imageRef.current.width;
            const h = imageRef.current.height;
            setCorners([
              { x: w * MARGIN, y: h * MARGIN },
              { x: w * (1 - MARGIN), y: h * MARGIN },
              { x: w * (1 - MARGIN), y: h * (1 - MARGIN) },
              { x: w * MARGIN, y: h * (1 - MARGIN) },
            ]);
        }
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        imageRef.current.src = result;
        imageRef.current.onload = () => {
          setImage(result);
          setStep('crop');
          stopCamera();

          // Set initial corners based on image size
          const MARGIN = 0.1;
          const w = imageRef.current.width;
          const h = imageRef.current.height;
          setCorners([
            { x: w * MARGIN, y: h * MARGIN },
            { x: w * (1 - MARGIN), y: h * MARGIN },
            { x: w * (1 - MARGIN), y: h * (1 - MARGIN) },
            { x: w * MARGIN, y: h * (1 - MARGIN) },
          ]);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const toggleFlash = async () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();
      // @ts-ignore
      if (capabilities.torch) {
        try {
          await videoTrack.applyConstraints({
            advanced: [{ torch: !isFlashOn }],
          });
          setIsFlashOn(!isFlashOn);
        } catch (err) {
          console.error("Error toggling flash:", err);
          toast({ variant: "destructive", title: t('flash_error_title'), description: t('flash_error_desc') });
        }
      } else {
        toast({ variant: "default", title: t('flash_not_supported_title'), description: t('flash_not_supported_desc') });
      }
    }
  };

  // --- Cropping Logic ---

  useEffect(() => {
    if (step !== 'crop' || !cropCanvasRef.current || !image) return;

    const canvas = cropCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    if (!ctx || !img.src) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const scale = Math.min(rect.width / img.width, rect.height / img.height);
    const imgW = img.width * scale;
    const imgH = img.height * scale;
    const dx = (rect.width - imgW) / 2;
    const dy = (rect.height - imgH) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, dx, dy, imgW, imgH);
    
    // Draw polygon
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const scaledCorners = corners.map(p => ({ x: p.x * scale + dx, y: p.y * scale + dy }));
    ctx.moveTo(scaledCorners[0].x, scaledCorners[0].y);
    for (let i = 1; i < 4; i++) {
        ctx.lineTo(scaledCorners[i].x, scaledCorners[i].y);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw corner handles
    scaledCorners.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#4f46e5';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    });

  }, [corners, image, step]);

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = cropCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e);
    if (!point || !imageRef.current.src) return;

    const scale = Math.min(cropCanvasRef.current!.clientWidth / imageRef.current.width, cropCanvasRef.current!.clientHeight / imageRef.current.height);
    const dx = (cropCanvasRef.current!.clientWidth - imageRef.current.width * scale) / 2;
    const dy = (cropCanvasRef.current!.clientHeight - imageRef.current.height * scale) / 2;
    const scaledCorners = corners.map(p => ({ x: p.x * scale + dx, y: p.y * scale + dy }));

    for (let i = 0; i < 4; i++) {
        const corner = scaledCorners[i];
        const distance = Math.sqrt((point.x - corner.x) ** 2 + (point.y - corner.y) ** 2);
        if (distance < 15) {
            setDraggingCorner(i);
            return;
        }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingCorner === null) return;
    const point = getCanvasPoint(e);
    if (!point || !imageRef.current.src) return;

    const scale = Math.min(cropCanvasRef.current!.clientWidth / imageRef.current.width, cropCanvasRef.current!.clientHeight / imageRef.current.height);
    const dx = (cropCanvasRef.current!.clientWidth - imageRef.current.width * scale) / 2;
    const dy = (cropCanvasRef.current!.clientHeight - imageRef.current.height * scale) / 2;
    
    const newCorners = [...corners];
    newCorners[draggingCorner] = {
        x: (point.x - dx) / scale,
        y: (point.y - dy) / scale,
    };
    setCorners(newCorners);
  };
  
  const handleMouseUp = () => setDraggingCorner(null);

  const confirmAndScan = () => {
    if (!imageRef.current.src) return;
    
    const getTransformedImage = () => {
        const w = imageRef.current.width;
        const h = imageRef.current.height;

        // Sort corners: tl, tr, br, bl
        let sortedCorners = [...corners].sort((a, b) => a.y - b.y);
        let top = sortedCorners.slice(0, 2).sort((a, b) => a.x - b.x);
        let bottom = sortedCorners.slice(2, 4).sort((a, b) => a.x - b.x);
        const [tl, tr] = top;
        const [bl, br] = bottom;

        const widthA = Math.sqrt((br.x - bl.x) ** 2 + (br.y - bl.y) ** 2);
        const widthB = Math.sqrt((tr.x - tl.x) ** 2 + (tr.y - tl.y) ** 2);
        const maxWidth = Math.max(widthA, widthB);

        const heightA = Math.sqrt((tr.x - br.x) ** 2 + (tr.y - br.y) ** 2);
        const heightB = Math.sqrt((tl.x - bl.x) ** 2 + (tl.y - bl.y) ** 2);
        const maxHeight = Math.max(heightA, heightB);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = maxWidth;
        tempCanvas.height = maxHeight;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return null;
        
        // This is a simplified perspective transform. A full library would be better.
        // For a simple demo, we draw the quadrilateral to a new canvas.
        const srcPoints = [tl, tr, br, bl];
        const dstPoints = [
            { x: 0, y: 0 },
            { x: maxWidth, y: 0 },
            { x: maxWidth, y: maxHeight },
            { x: 0, y: maxHeight },
        ];
        
        // Naive warp - better with a library like opencv.js
        // This is a simplified version, drawing the source image and clipping.
        // For a true perspective warp, matrix math is needed.
        // Since we can't easily implement warpPerspective here, we'll crop to the bounding box.
        let minX = w, minY = h, maxX = 0, maxY = 0;
        corners.forEach(p => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        });

        const cropWidth = maxX - minX;
        const cropHeight = maxY - minY;
        
        ctx.canvas.width = cropWidth;
        ctx.canvas.height = cropHeight;
        ctx.drawImage(imageRef.current, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        
        return tempCanvas.toDataURL('image/jpeg');
    }
    
    const transformedImageDataUrl = getTransformedImage();
    if(transformedImageDataUrl) {
      handleScan(transformedImageDataUrl);
    } else {
       toast({
          title: t('scan_failed_toast_title'),
          description: 'Could not process the image.',
          variant: 'destructive',
       });
    }
  };

  const handleRetake = () => {
    resetState();
    setupCamera();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full h-screen flex flex-col p-0 gap-0 bg-black text-white">
        <DialogHeader className="p-4 flex flex-row items-center justify-between border-b border-gray-700 z-10 bg-black">
          <DialogTitle className='font-headline text-white'>
            {step === 'camera' ? t('scan_card_dialog_title') : t('crop_instruction')}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-6 w-6 text-white" />
          </Button>
        </DialogHeader>

        <div className="flex-1 bg-black flex items-center justify-center relative">
          {step === 'camera' && (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" playsInline autoPlay muted />
              {hasCameraPermission ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-[90%] h-[50%] border-4 border-dashed border-white/80 rounded-2xl shadow-lg bg-black/20" />
                  <p className="absolute top-1/4 left-1/2 -translate-x-1/2 text-white/90 bg-black/50 px-4 py-2 rounded-md text-center">
                    {t('scan_card_instruction')}
                  </p>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <Alert variant="destructive">
                    <AlertTitle>{t('camera_permission_denied_title')}</AlertTitle>
                    <AlertDescription>
                      {t('camera_permission_denied_instructions')}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </>
          )}

          {step === 'crop' && (
            <div className="w-full h-full relative">
                <canvas
                    ref={cropCanvasRef}
                    className="w-full h-full"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 justify-between items-center bg-black z-10 flex">
          {step === 'camera' ? (
            <>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <Button variant="ghost" onClick={() => fileInputRef.current?.click()} className="p-2">
                <ImageIcon className="h-8 w-8 text-white" />
              </Button>
              <Button onClick={takePicture} disabled={!hasCameraPermission} className="w-20 h-20 rounded-full bg-white hover:bg-gray-200 border-4 border-black disabled:bg-gray-400" />
              <Button variant="ghost" onClick={toggleFlash} className="p-2">
                {isFlashOn ? <Zap className="h-8 w-8 text-yellow-400" /> : <ZapOff className="h-8 w-8 text-white" />}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleRetake} className="gap-2 text-white border-white">
                <RefreshCw className="h-5 w-5" />
                {t('retake_button')}
              </Button>
              <Button onClick={confirmAndScan} className="bg-primary text-primary-foreground gap-2">
                <Check className="h-5 w-5" />
                {t('crop_and_use_button')}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
