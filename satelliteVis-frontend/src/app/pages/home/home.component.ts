import { Component, ViewChild, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UploadFormComponent } from '../../upload-form/upload-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UploadFormComponent, MatButtonModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild('upload') uploadComponent !: UploadFormComponent;

  imagePreviewUrl = signal<string>("")
  
  error_message: string = "";

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  onPredict() {

    if(this.uploadComponent.imageFile() === null){
      this.error_message = "No Input";
      this.errorDialog();
    }
    const file = this.uploadComponent.selectedFile;
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post('/api/upload', formData, { responseType: 'blob' }).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      this.imagePreviewUrl.set(url);
    });

  }

  errorDialog(){
    const ref: MatDialogRef<ErrorDialogComponent> = this.dialog.open(
      ErrorDialogComponent,
      {
        width: '440px',
        height: '210px',
        data: {
          message: this.error_message
        },
        hasBackdrop: true
      }
    )
  }

}


