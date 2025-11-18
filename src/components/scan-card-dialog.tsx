
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
import { Camera as CameraIcon, X, Zap, ZapOff, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/context/language-context';

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
  const [step, setStep] = useState<'camera' | 'confirm'>('camera');
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImage(dataUrl);
        setStep('confirm');
        stopCamera();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setStep('confirm');
        stopCamera();
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

  const confirmAndScan = () => {
    if (image) {
      handleScan(image);
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
            {step === 'camera' ? t('scan_card_dialog_title') : t('use_photo_button')}
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

          {step === 'confirm' && image && (
            <div className="w-full h-full relative">
                <img src={image} alt="Captured business card" className="w-full h-full object-contain" />
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
                {t('use_photo_button')}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
