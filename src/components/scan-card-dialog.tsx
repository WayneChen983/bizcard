
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { scanCardDetails, ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';
import { Loader2, Camera as CameraIcon, X, Zap, ZapOff, Image as ImageIcon, Check, ArrowLeft } from 'lucide-react';
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
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const setupCamera = async () => {
    setImage(null);
    stopCamera();
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
  };
  
  useEffect(() => {
    if (open) {
      setImage(null);
      setIsFlashOn(false);
      setupCamera();
    } else {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleScan = (cardImageDataUri: string) => {
    if (!cardImageDataUri) return;

    // Close the dialog immediately
    onOpenChange(false);
    
    toast({
        title: t('scanning_toast_title'),
        description: t('scanning_toast_desc'),
    });

    // Run scan in the background
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

  const confirmAndScan = () => {
    if (image) {
      handleScan(image);
       // Save image to device
       const link = document.createElement('a');
       link.href = image;
       link.download = `bizcard-${new Date().toISOString()}.png`;
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
    }
  }

  const takePicture = () => {
    if (videoRef.current && canvasRef.current && hasCameraPermission) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
  
        const sx = videoWidth * 0.05;
        const sy = videoHeight * 0.25;
        const sWidth = videoWidth * 0.9;
        const sHeight = videoHeight * 0.5;
  
        canvasRef.current.width = sWidth;
        canvasRef.current.height = sHeight;
  
        context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
        
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setImage(dataUrl);
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
        handleScan(result);
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full h-screen flex flex-col p-0 gap-0 bg-black text-white">
        <DialogHeader className="p-4 flex flex-row items-center justify-between border-b border-gray-700 z-10 bg-black">
          <DialogTitle className='font-headline text-white'>{t('scan_card_dialog_title')}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-6 w-6 text-white" />
          </Button>
        </DialogHeader>

        <div className="flex-1 bg-black flex items-center justify-center relative">
          {image ? (
            <Image src={image} alt="Captured business card" layout="fill" objectFit="contain" />
          ) : (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" playsInline autoPlay muted />
              {hasCameraPermission ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-[90%] h-[50%] border-4 border-white/80 rounded-2xl shadow-lg bg-black/20" />
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
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-4 border-t border-gray-700 flex-row justify-between items-center bg-black z-10 flex">
          {image ? (
            <>
              <Button variant="outline" onClick={setupCamera} className="text-white border-white">
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t('retake_button')}
              </Button>
              <Button onClick={confirmAndScan} className="bg-primary text-primary-foreground">
                <Check className="mr-2 h-5 w-5" />
                {t('use_photo_button')}
              </Button>
            </>
          ) : (
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
