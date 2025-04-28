import albumentations as A
from albumentations.pytorch import ToTensorV2

mean = (0.485, 0.456, 0.406)
std = (0.229, 0.224, 0.225)

def get_augmentations():
    return A.Compose([
        A.Normalize(mean=mean, std=std),
        ToTensorV2()
    ])

def get_augmentations_padded(h, w):
        return A.Compose([
              
        A.PadIfNeeded(
            min_height=h,
            min_width=w,
            fill=(0,0,0),          # black mask
            fill_mask=6            # ignored class
        ),
        A.Normalize(mean=mean, std=std),
        ToTensorV2()
    ])