import torch
import os

from pydantic import BaseModel

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.exceptions import RequestValidationError

from app.predictor.predict import predict_image
from app.models.model_loader import load_model
from app.exceptions.handlers import validation_exception_handler

app = FastAPI()

app.add_exception_handler(RequestValidationError, validation_exception_handler)

model_loaded = False


model_path_15_val = "weights/best_model_epoch_15_15val.pth" 
model_path_20_val = "weights/best_model_epoch_15_20val.pth"
model_path_25_val = "weights/best_model_epoch_14_25val.pth"
model_path_30_val = "weights/model_epoch_at_2025-05-04 19_54_40_15_30val.pth"


model_paths = {
    "15_val": model_path_15_val,
    "20_val": model_path_20_val,
    "25_val": model_path_25_val,
    "30_val": model_path_30_val
}

selected_model_name = "20_val" #default model to use
model_path = model_paths[selected_model_name]


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model_deeplab_resnet101 = load_model(model_path=model_path, classes=7)
model_deeplab_resnet101 = model_deeplab_resnet101.to(device=device)

model_loaded = True



class ModelSelectionRequest(BaseModel):
    model_name: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """Endpoint to upload an image and get a prediction.
    Args:
        file (UploadFile): The image file to be processed.
    Returns:
        dict: A dictionary containing the prediction result.
    Raises:
        HTTPException: If the file is not an image or if there is an error during processing.
    """
    try:
        contents = await file.read()
        prediction = predict_image(model=model_deeplab_resnet101, image=contents)

        return prediction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/select_model")
async def select_model(request: ModelSelectionRequest):
    """Endpoint to select a model for prediction.
    Args:
        request (ModelSelectionRequest): The request containing the model name.
    Returns:
        dict: A dictionary containing the status of the model selection.
    Raises:
        HTTPException: If the model name is invalid or if there is an error loading the model.
    """
    global model_path, model_deeplab_resnet101, model_loaded, selected_model_name

    model_name = request.model_name
    selected_model_name = model_name

    if model_name not in model_paths:
        raise HTTPException(status_code=400, detail="Invalid model name provided.")

    model_path = model_paths[model_name]
    print(f"loading the model: {os.path.basename(model_path)}")
    
    try:
        model_deeplab_resnet101 = load_model(model_path=model_path, classes=7)
        model_deeplab_resnet101 = model_deeplab_resnet101.to(device=device)
        model_loaded = True
        return {"message": f"Model {model_name} loaded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load the model: {str(e)}")

@app.get("/status")
async def check_status():
    """Endpoint to check the status of the model.
    Returns:
        dict: A dictionary containing the status of the model and the selected model name.
    """
    return {
            "status": "OK" if model_loaded else "loading", 
            "selected_model" : f"Selected model {selected_model_name}. "
        }

