import { Component, ViewChild, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UploadFormComponent } from '../../upload-form/upload-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UploadFormComponent, MatButtonModule, MatDialogModule, FormsModule, MatSelectModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild('upload') uploadComponent !: UploadFormComponent;

  imagePreviewUrl = signal<string>("")

  error_message: string = "";

  selectedModel = signal<string | null>(null);
  models = ["15_val", "20_val", "25_val", "30_val"]


  constructor(private http: HttpClient, private dialog: MatDialog, private loadingService: LoadingService) { }

  onPredict() {
    this.loadingService.show();

    if(this.uploadComponent.imageFile() === null){
      this.error_message = "No Input";
      this.loadingService.hide();
      this.errorDialog();
      return;
    }
    const file = this.uploadComponent.selectedFile;
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post('/api/upload', formData, { responseType: 'blob' }).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      this.imagePreviewUrl.set(url);
      this.loadingService.hide();
    });

  }

  onSelectModel(model: string) {
    this.selectedModel.set(model);

    if(!this.selectedModel()) {
      this.error_message = "No Model Selected";
      this.errorDialog();
      return;
    }

    const payload = {
      model_name: this.selectedModel()
    };

    console.log("Selecting model:", payload);

    this.http.post('/api/select_model', payload).subscribe({
      next: (response) => {
        console.log("Model selected successfully:", response);
      }
      , error: (error) => {
        console.error("Error selecting model:", error);
        this.error_message = "Error selecting model";
        this.errorDialog();
      }
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


