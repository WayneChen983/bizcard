'use client';

import { FirebaseApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

/**
 * Uploads a Data URL image to Firebase Storage and returns a public download URL.
 * The upload is awaited to ensure we persist only the resulting URL in Firestore
 * instead of a large base64 string, keeping documents well below Firestore limits.
 */
export async function uploadDataUrlAndGetDownloadUrl(
  firebaseApp: FirebaseApp,
  pathInBucket: string,
  dataUrl: string
): Promise<string> {
  const storage = getStorage(firebaseApp);
  const objectRef = ref(storage, pathInBucket);
  // Upload the Data URL as-is; Firebase infers contentType from the Data URL header
  await uploadString(objectRef, dataUrl, 'data_url');
  return await getDownloadURL(objectRef);
}

/**
 * Downscales a Data URL image on the client and returns a new JPEG Data URL.
 * targetMaxSizePx controls the longest edge.
 */
export async function downscaleDataUrl(
  dataUrl: string,
  targetMaxSizePx: number,
  quality: number = 0.8
): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

  const { width, height } = img;
  const scale = Math.min(1, targetMaxSizePx / Math.max(width, height));
  const newW = Math.round(width * scale);
  const newH = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = newW;
  canvas.height = newH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, newW, newH);
  return canvas.toDataURL('image/jpeg', quality);
}


