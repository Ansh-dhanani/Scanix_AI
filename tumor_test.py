import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Transform (must match training on ResNet18/224 RGB)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# Label map (matches Hugging Face dataset)
label_map = {
    0: "glioma",
    1: "meningioma",
    2: "no_tumor",
    3: "pituitary"
}

# ResNet18 model (final layer for 4 classes)
model = models.resnet18(weights=None)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 4)
model = model.to(device)
model.load_state_dict(torch.load("brain_tumor_resnet18.pth", map_location=device))
model.eval()

# Predict function
def predict_image(image_path):
    img = Image.open(image_path).convert('RGB')
    img = transform(img).unsqueeze(0).to(device)  # batch size 1
    with torch.no_grad():
        outputs = model(img)
        _, pred_idx = torch.max(outputs, 1)
        pred_label = label_map[pred_idx.item()]
    print(f"Prediction: {pred_label}")

# Example usage:
predict_image("img3.png")  # Replace with your image
