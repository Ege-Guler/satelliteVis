import torch
import cv2

from app.utils.image_processing import pre_process_image, decode_segmentation, colorize_mask, class_colors
from app.models.model_loader import load_model


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def predict_image(model_path, classes, image):

    im = pre_process_image(image)

    model = load_model(model_path=model_path, classes=classes)
    with torch.no_grad():
        output = model(im)
        predicted_mask = decode_segmentation(output.squeeze(0))
    
    colored_mask = colorize_mask(predicted_mask, class_colors)
    
    colored_mask = cv2.cvtColor(colored_mask, cv2.COLOR_RGB2BGR)
    cv2.imwrite("output.jpg", colored_mask)


