import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms
import torchvision.models as models
from datasets import load_dataset

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load dataset
ds = load_dataset("sartajbhuvaji/Brain-Tumor-Classification")
train_ds = ds["Training"]
test_ds = ds["Testing"]

# Data augmentation for training
train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])
# Simpler transform for testing
test_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Custom Dataset to wrap Hugging Face dataset for PyTorch usage
class HFToTorchDataset(Dataset):
    def __init__(self, hf_ds, transform=None):
        self.hf_ds = hf_ds
        self.transform = transform
    def __len__(self):
        return len(self.hf_ds)
    def __getitem__(self, idx):
        image = self.hf_ds[idx]["image"].convert("RGB")
        label = self.hf_ds[idx]["label"]
        if self.transform:
            image = self.transform(image)
        return image, label

torch_train = HFToTorchDataset(train_ds, train_transform)
torch_test = HFToTorchDataset(test_ds, test_transform)

train_loader = DataLoader(torch_train, batch_size=32, shuffle=True)
test_loader = DataLoader(torch_test, batch_size=32, shuffle=False)

# Load pretrained ResNet18 and adjust for 4 classes
model = models.resnet18(weights="IMAGENET1K_V1")
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 4)
model = model.to(device)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.0005)

# Train!
num_epochs = 10  # Increase for even better results
for epoch in range(num_epochs):
    model.train()
    running_loss = 0.0
    correct = total = 0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)
    epoch_loss = running_loss / total
    accuracy = correct / total
    print(f"Epoch {epoch+1}/{num_epochs}, Loss: {epoch_loss:.4f}, Accuracy: {accuracy:.4f}")

# Test accuracy
model.eval()
correct = total = 0
with torch.no_grad():
    for images, labels in test_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)
print(f"Test Accuracy: {correct / total:.4f} ({correct}/{total})")

torch.save(model.state_dict(), "brain_tumor_resnet18.pth")
print("Model weights saved to brain_tumor_resnet18.pth")
