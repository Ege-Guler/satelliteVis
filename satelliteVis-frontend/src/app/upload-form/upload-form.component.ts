import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.scss'
})
export class UploadFormComponent {

  imageFile = signal<File | null>(null);
  imageUrl = signal<string | null>(null);
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
    this.imageFile.set(file);
    this.imageUrl.set(URL.createObjectURL(file));
  }

  removeImage() {
    this.imageFile.set(null);
    this.imageUrl.set(null);
  }


  get selectedFile(): File | null {
    return this.imageFile();
  }

  get previewUrl(): string | null {
    return this.imageUrl();
  }

}
