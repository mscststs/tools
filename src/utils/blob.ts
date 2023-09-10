export function download(link: string, filename: string) {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.className = "hidden";
  a.href = link;
  a.download = filename;
  a.click();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  download(url, filename);
  window.URL.revokeObjectURL(url);
}

export function downloadAsIframe(link: string) {
  const iframe = document.createElement("iframe");
  iframe.hidden = true;
  iframe.className = "hidden";
  iframe.src = link;
  document.body.appendChild(iframe);
  return () => {
    document.body.removeChild(iframe);
  };
}
