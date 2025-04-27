from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse

from app.predictor.predict import predict_image

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    
    try:
        contents = await file.read()
        predict_image(model_path=model_path, classes=7, image=contents)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")




model_path = "weights/resnet101_best_model_epoch_15.pth"
test_im = "test_images/606_sat.jpg"
