import torch

from io import BytesIO
from PIL import Image

from fastapi.responses import StreamingResponse

from app.utils.image_processing import pre_process_image, decode_segmentation, colorize_mask, class_colors



def predict_image(model, image):

    im = pre_process_image(image)

    with torch.no_grad():
        output = model(im)
        predicted_mask = decode_segmentation(output.squeeze(0))
    
    colored_mask = colorize_mask(predicted_mask, class_colors)
        
    colored_mask = Image.fromarray(colored_mask, mode='RGB')

    image_buffer = BytesIO()
    colored_mask.save(image_buffer, format="JPEG")
    image_buffer.seek(0)

    return StreamingResponse(image_buffer, media_type="image/jpeg")


