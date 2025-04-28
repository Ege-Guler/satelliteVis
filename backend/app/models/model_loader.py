import torch
import segmentation_models_pytorch as smp
import os

def load_model(model_path, classes):
    print(f"loading the model: {os.path.basename(model_path)}")
    model = smp.DeepLabV3Plus(encoder_name="resnet101", classes=classes, activation=None).cpu()
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

