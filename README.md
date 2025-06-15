# SatImPredictor

SatImPredictor is a web-based tool for semantic segmentation of satellite imagery. It allows users to upload satellite images, select between trained models, and view pixel-wise land cover classifications. The project aims to offer fast model switching and high-performance inference with a clean and responsive frontend.

## Model Architectures

### DeepLabV3+ with ResNet-101
The primary model used is DeepLabV3+, a state-of-the-art architecture for semantic segmentation. It utilizes:
- Atrous Spatial Pyramid Pooling (ASPP) for multiscale context
- A ResNet-101 encoder backbone


![DeepLabV3+ Architecture](/images/deeplab.jpeg)

## Project Structure

```
.
├── backend/                  # FastAPI backend (model serving, inference)
├── satelliteVis-frontend/   # Angular 16+ frontend (standalone components)
├── utils/                   # Visualization utilities, preprocessing tools
├── notebooks/               # Jupyter notebooks (experiments, training logs)
├── .gitignore
└── README.md
```

## Running the Project

### Frontend Setup (Angular 16+)

```bash
cd satelliteVis-frontend
npm install
ng serve
```

- Opens at http://localhost:4200
- Use the UI to upload an image and select a model

### Backend Setup (FastAPI + Docker)

The backend exposes two endpoints:
- POST /upload – Upload image for segmentation
- POST /select_model – Choose between 15_val, 20_val, etc.

#### Run with Docker:
```bash
cd backend
docker build -t satimpredictor-backend .
docker run -p 8000:8000 satimpredictor-backend
```

If needed, you can override CMD like:
```bash
docker run -p 8000:8000 satimpredictor-backend uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

| Endpoint            | Method | Description                    |
|---------------------|--------|--------------------------------|
| /upload             | POST   | Upload image and receive mask |
| /select_model       | POST   | Choose one of the 4 models |

Example model selection payload:

```json
{ "model_name": "20_val" }
```

## Model Variants and Metrics

Trained on the DeepGlobe Land Cover Classification Dataset, each model uses a different validation split:

| Model   | IoU (macro) | F1 Score | Precision | Water IoU |
|---------|-------------|----------|-----------|-----------|
| 15_val  | 0.8160      | 0.8953   | 0.9030    | 0.8817    |
| 20_val  | 0.8131      | 0.8929   | 0.8926    | 0.8956    |
| 25_val  | 0.8112      | 0.8920   | 0.8936    | 0.8985    |
| 30_val  | 0.8039      | 0.8872   | 0.8872    | 0.8789    |

## Observations

- 15_val consistently outperformed others in macro IoU and F1 metrics.
- 25_val and 20_val showed balanced performance and stable convergence.
- 30_val had strong early learning but slightly lower performance overall.
- Water class was segmented accurately across all models, showing the model's strength on high-contrast features.

## Tech Stack

| Layer       | Tech                                |
|-------------|-------------------------------------|
| Frontend    | Angular 16+, Angular Material, Signals API |
| Backend     | FastAPI, Uvicorn, Pydantic          |
| Models      | DeepLabV3+, ResNet-101 (PyTorch)    |
| Deployment  | Docker, Google Colab (for training) |
| Dataset     | DeepGlobe Land Cover Challenge      |

## Example Output

<p float="left">
  <img src="/images/example_raw_image.jpeg" width="45%" />
  <img src="/images/example_output.jpeg" width="45%" />
</p>


## Author

Developed by Ege Güler  
GitHub Repo: https://github.com/Ege-Guler/satelliteVis

## License

This project is for academic use. Please contact the author for reuse or extension.
