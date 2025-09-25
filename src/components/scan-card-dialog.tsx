
'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { scanCardDetails, ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';
import { Camera, Loader2 } from 'lucide-react';

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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleScan = async () => {
    if (!file || !preview) {
      toast({
        title: 'No file selected',
        description: 'Please select an image of a business card to scan.',
        variant: 'destructive',
      });
      return;
    }

    setIsScanning(true);
    try {
      const cardImageDataUri = preview;
      const result = await scanCardDetails({ cardImageDataUri });
      onScanComplete(result);
      toast({
        title: 'Scan Successful',
        description: 'Contact details have been populated.',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error scanning card:', error);
      toast({
        title: 'Scan Failed',
        description: 'Could not extract details from the card. Please try again or enter manually.',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='font-headline'>Scan Business Card</DialogTitle>
          <DialogDescription>
            Upload an image of a business card to automatically fill in the details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <div className="relative mt-2 h-48 w-full">
              <Image
                src={preview}
                alt="Business card preview"
                layout="fill"
                objectFit="contain"
                className="rounded-md"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isScanning}>
            Cancel
          </Button>
          <Button onClick={handleScan} disabled={isScanning || !file}>
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Scan Card
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
