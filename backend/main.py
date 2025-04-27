# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# async def root():
#     return {"message": "Hello World"}
from app.predictor.predict import predict_image

model_path = "weights/resnet101_best_model_epoch_15.pth"
test_im = "test_images/606_sat.jpg"
predict_image(model_path=model_path, classes=7, im_path=test_im)
