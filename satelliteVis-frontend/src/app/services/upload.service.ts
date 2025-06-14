import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UploadService {
  imageFile = signal<File | null>(null);
  imageUrl = signal<string | null>(null);

  setImage(file: File) {
    this.imageFile.set(file);
    this.imageUrl.set(URL.createObjectURL(file));
  }

  clearImage() {
    this.imageFile.set(null);
    this.imageUrl.set(null);
  }
}
