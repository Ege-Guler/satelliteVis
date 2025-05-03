import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.scss'
})
export class UploadFormComponent {

  imageFile = signal<File | null>(null);
  imageUrl = signal<string | null>(null);
  isDragOver = signal<boolean>(false);


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if(file) this.processFile(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if(file) this.processFile(file);
  }

  onDragOver(event: DragEvent): void{
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(){
    this.isDragOver.set(false);
  }


  processFile(file: File): void{
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
