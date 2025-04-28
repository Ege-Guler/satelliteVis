import cv2
import numpy as np
import torch

from app.utils.augmentations import get_augmentations

class_colors = {
    0: (0, 255, 255), 
    1: (255, 255, 0), 
    2: (255, 0, 255), 
    3: (0, 255, 0), 
    4: (0, 0, 255), 
    5: (255, 255, 255), 
    6: (0, 0, 0)
}


def pre_process_image(image:bytes):

    if image is None:
        raise ValueError("Failed to decode image.")
    
    file_bytes = np.fromstring(image, np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    transform = get_augmentations()
    augmented = transform(image=image)
    image_tensor = augmented["image"]

    if image_tensor.ndim == 3:
        image_tensor = image_tensor.unsqueeze(0)

    return image_tensor

def decode_segmentation(mask):
    return torch.argmax(mask, dim=0).cpu().numpy()

def colorize_mask(mask, class_colors):
    h, w = mask.shape
    color_mask = np.zeros((h, w, 3), dtype=np.uint8)

    for class_idx, color in class_colors.items():
        color_mask[mask == class_idx] = color

    return color_mask
