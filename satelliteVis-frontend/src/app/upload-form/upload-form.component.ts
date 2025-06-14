import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.scss'
})
export class UploadFormComponent {

  constructor(public uploadService: UploadService) {}


  isDragOver = signal<boolean>(false);

  onFileInput(event: Event | DragEvent) {

    if (event instanceof DragEvent) event.preventDefault();
    let file: File | undefined;

    if ('dataTransfer' in event) {
      file = event.dataTransfer?.files?.[0];
      this.isDragOver.set(false);

    } else {
      const input = event.target as HTMLInputElement;
      file = input.files?.[0];
    }
    if (!file) return;

    this.processFile(file);
  }


  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave() {
    this.isDragOver.set(false);
  }


  processFile(file: File): void {
    this.uploadService.setImage(file);
  }

  removeImage() {
    this.uploadService.clearImage();
  }


  get selectedFile(): File | null {
    return this.uploadService.imageFile();
  }

  get previewUrl(): string | null {
    return this.uploadService.imageUrl();
  }

}
