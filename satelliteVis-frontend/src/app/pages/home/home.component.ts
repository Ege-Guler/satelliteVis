import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UploadFormComponent } from '../../upload-form/upload-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UploadFormComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild('upload') uploadComponent !: UploadFormComponent;


  constructor(private http: HttpClient){}

  onUpload() {
    const file = this.uploadComponent.selectedFile;
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post('/api/predict', formData, { responseType: 'blob' }).subscribe((res) => {
      // handle prediction
    });
  }
  }


