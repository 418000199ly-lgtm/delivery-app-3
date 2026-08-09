/**
 * Binary-safe download helper for browser/iframe environments.
 * Uses fetch blob array buffer to prevent iframe text-encoding corruption.
 */
export async function downloadDeployZip(filename = 'daijia_deploy.zip'): Promise<void> {
  try {
    const url = `/${filename}?t=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const blob = await res.blob();
    
    // Ensure blob type is binary octet-stream/zip
    const binaryBlob = new Blob([blob], { type: filename.endsWith('.tar.gz') ? 'application/gzip' : 'application/zip' });
    const blobUrl = window.URL.createObjectURL(binaryBlob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    }, 1000);
  } catch (err) {
    console.warn('Blob download failed, fallback to direct anchor click:', err);
    const fallbackLink = document.createElement('a');
    fallbackLink.href = `/${filename}`;
    fallbackLink.download = filename;
    fallbackLink.target = '_blank';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    setTimeout(() => fallbackLink.remove(), 1000);
  }
}
