
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
import { Loader2, Camera as CameraIcon, X, Zap, ZapOff, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ScanCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanComplete: (data: Partial<ScanCardDetailsOutput>) => void;
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

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const setupCamera = async () => {
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
          title: "相機權限遭拒",
          description: "請在您的瀏覽器設定中允許相機權限以使用此功能。",
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
        title: '正在掃描名片...',
        description: '掃描完成後將會自動填入資訊。',
    });

    // Run scan in the background
    scanCardDetails({ cardImageDataUri })
      .then(result => {
        onScanComplete(result);
        toast({
          title: '掃描成功',
          description: '已填入聯絡人詳細資訊。',
        });
      })
      .catch(error => {
        console.error('Error scanning card:', error);
        toast({
          title: '掃描失敗',
          description: '無法從卡片中提取詳細資訊。請重試或手動輸入。',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setImage(null);
      });
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current && hasCameraPermission) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
  
        // Crop the image to the frame
        const sx = videoWidth * 0.05;
        const sy = videoHeight * 0.25;
        const sWidth = videoWidth * 0.9;
        const sHeight = videoHeight * 0.5;
  
        canvasRef.current.width = sWidth;
        canvasRef.current.height = sHeight;
  
        context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
        
        const dataUrl = canvasRef.current.toDataURL('image/png');
        handleScan(dataUrl);

        // Save image to device
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `bizcard-${new Date().toISOString()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
          toast({ variant: "destructive", title: "閃光燈錯誤", description: "無法控制閃光燈" });
        }
      } else {
        toast({ variant: "default", title: "不支援閃光燈", description: "您的裝置不支援閃光燈" });
      }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full h-screen flex flex-col p-0 gap-0 bg-black text-white">
        <DialogHeader className="p-4 flex flex-row items-center justify-between border-b border-gray-700 z-10 bg-black">
          <DialogTitle className='font-headline text-white'>掃描名片</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-6 w-6 text-white" />
          </Button>
        </DialogHeader>

        <div className="flex-1 bg-black flex items-center justify-center relative">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline autoPlay muted />
          {hasCameraPermission ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-[90%] h-[50%] border-4 border-white/80 rounded-2xl shadow-lg bg-black/20" />
              <p className="absolute top-1/4 left-1/2 -translate-x-1/2 text-white/90 bg-black/50 px-4 py-2 rounded-md text-center">
                將名片對準掃描框
              </p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-4">
               <Alert variant="destructive">
                <AlertTitle>需要相機權限</AlertTitle>
                <AlertDescription>
                  請在瀏覽器設定中啟用相機權限以掃描名片。
                </AlertDescription>
              </Alert>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-4 border-t border-gray-700 flex-row justify-between items-center bg-black z-10 flex">
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          <Button variant="ghost" onClick={() => fileInputRef.current?.click()} className="p-2">
            <ImageIcon className="h-8 w-8 text-white" />
          </Button>
          <Button onClick={takePicture} disabled={!hasCameraPermission} className="w-20 h-20 rounded-full bg-white hover:bg-gray-200 border-4 border-black disabled:bg-gray-400" />
          <Button variant="ghost" onClick={toggleFlash} className="p-2">
            {isFlashOn ? <Zap className="h-8 w-8 text-yellow-400" /> : <ZapOff className="h-8 w-8 text-white" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
