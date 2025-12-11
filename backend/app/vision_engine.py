from PIL import Image
from transformers import ViTImageProcessor, ViTForImageClassification
import torch

# 1. Load the Pre-trained Model (Food-101)
# We load this globally so we don't reload it for every single request (Speed optimization)
print("Loading AI Model... this might take a minute...")
model_name = "nateraw/food"
processor = ViTImageProcessor.from_pretrained(model_name)
model = ViTForImageClassification.from_pretrained(model_name)
print("AI Model Loaded Successfully!")

def predict_food(image_path: str):
    """
    Takes an image path, runs it through the AI, and returns the top predicted food name.
    """
    try:
        # 2. Open Image and Preprocess
        image = Image.open(image_path)
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        inputs = processor(images=image, return_tensors="pt")

        # 3. Predict
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits

        # 4. Get the Class with Highest Probability
        predicted_class_idx = logits.argmax(-1).item()
        food_name = model.config.id2label[predicted_class_idx]
        
        return {"food_name": food_name, "status": "success"}

    except Exception as e:
        return {"error": str(e), "status": "failed"}

# Testing block (Only runs if you execute this file directly)
if __name__ == "__main__":
    # Create a dummy image to test if you don't have one
    # Or replace 'test.jpg' with a real path to a food image on your PC
    print("Test run complete. The model is ready.")