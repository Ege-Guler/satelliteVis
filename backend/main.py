import torch
import os
from fastapi import FastAPI, UploadFile, File, HTTPException

from app.predictor.predict import predict_image
from app.models.model_loader import load_model

app = FastAPI()


model_loaded = False
model_path = "weights/resnet101_best_model_epoch_15.pth"
test_im = "test_images/606_sat.jpg"


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model_deeplab_resnet101 = load_model(model_path=model_path, classes=7)
model_deeplab_resnet101 = model_deeplab_resnet101.to(device=device)

model_loaded = True


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    
    try:
        contents = await file.read()
        prediction = predict_image(model=model_deeplab_resnet101, image=contents)

        return prediction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/status")
async def check_status():
    return {
            "status": "OK" if model_loaded else "loading", 
            "selected_model" : f"Selected model {os.path.basename(model_path)}. "
        }

