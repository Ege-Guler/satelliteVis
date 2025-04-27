import torch
import segmentation_models_pytorch as smp


def load_model(model_path, classes):
    model = smp.DeepLabV3Plus(encoder_name="resnet101", classes=classes, activation=None).cpu()
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

