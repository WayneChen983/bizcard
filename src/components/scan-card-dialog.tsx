
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { scanCardDetails, ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';
import { Loader2, Camera as CameraIcon, SwitchCamera, X } from 'lucide-react';

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
  const [isScanning, setIsScanning] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  const setupCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        toast({
          variant: "destructive",
          title: "相機錯誤",
          description: "無法訪問相機，請檢查權限。",
        });
      }
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setImage(dataUrl);
        handleScan(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleScan = async (cardImageDataUri: string) => {
    if (!cardImageDataUri) {
      return;
    }
    setIsScanning(true);
    try {
      const result = await scanCardDetails({ cardImageDataUri });
      onScanComplete(result);
      toast({
        title: '掃描成功',
        description: '已填入聯絡人詳細資訊。',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error scanning card:', error);
      toast({
        title: '掃描失敗',
        description: '無法從卡片中提取詳細資訊。請重試或手動輸入。',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
      setImage(null);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setImage(null);
      setupCamera();
    } else {
      stopCamera();
    }
    onOpenChange(isOpen);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        handleScan(result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-full h-screen flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 flex flex-row items-center justify-between border-b">
          <DialogTitle className='font-headline'>掃描名片</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => handleOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 bg-black flex items-center justify-center relative">
          {!image && <video ref={videoRef} className="w-full h-auto" playsInline />}
          <div className="absolute inset-0 border-[3rem] border-black/50 rounded-lg"></div>
           <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10rem] text-white/90 bg-black/50 px-4 py-2 rounded-md text-center">
            將名片對準掃描框並點擊拍照
          </p>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <DialogFooter className="p-4 border-t flex-row justify-between items-center bg-black">
          <input type="file" accept="image/*" id="file-upload" className="hidden" onChange={handleFileChange} />
          <label htmlFor="file-upload" className="cursor-pointer">
              <Image src="/gallery.png" alt="Gallery" width={40} height={40} />
          </label>
          <Button onClick={takePicture} disabled={isScanning} className="w-20 h-20 rounded-full bg-white hover:bg-gray-200 border-4 border-black absolute left-1/2 -translate-x-1/2 bottom-10" />
          <Button variant="ghost" className="p-2">
            <SwitchCamera className="h-8 w-8 text-white" />
          </Button>
        </DialogFooter>
        {isScanning && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
            <p className="text-white mt-4">掃描中...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


