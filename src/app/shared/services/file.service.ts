import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private renderer2: Renderer2;

  constructor(private renderer2Factory: RendererFactory2) {
    this.renderer2 = renderer2Factory.createRenderer(null, null);
  }

  download(data: Blob, filename: string): void {
    const link = this.renderer2.createElement('a');
    link.setAttribute('href', URL.createObjectURL(data));
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    this.renderer2.appendChild(document.body, link);
    link.click();
    this.renderer2.removeChild(document.body, link);
  }

  base64ToBlob(b64Data: string, type: string, sliceSize = 512): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type });
  }

  async fileToBlob(file: File): Promise<Blob> {
    return new Blob([await file.arrayBuffer()], { type: file.type });
  }

  fileToBase64(file: File, onlyMetaData = false): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onload = () => resolve(!onlyMetaData ? reader.result : (reader.result as string).split('base64,')[1]);
      reader.onerror = error => reject(error);
    });
  }
}
