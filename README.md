# 🥗 Smart Meal AI - Intelligent Nutrition Architect

**Smart Meal AI** is a full-stack application that leverages **Computer Vision** and **Mathematical Optimization** to revolutionize personal nutrition. It allows users to scan food using their camera for instant nutritional analysis and generates mathematically perfect weekly meal plans based on calorie goals.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Stack](https://img.shields.io/badge/Stack-Next.js%20|%20FastAPI%20|%20Python-blue)

## 🚀 Key Features

* **👁️ AI Food Vision:** Instantly identify food and retrieve nutrition data using a Vision Transformer (ViT) model (Fine-tuned on Food-101).
* **🧠 Algorithmic Meal Planning:** A greedy optimization engine that constructs 7-day meal plans matching your exact calorie targets.
* **🔐 Secure Authentication:** Full JWT-based Login/Register system with hashed passwords.
* **🎨 Cyberpunk UI:** A stunning, "abnormal" dark-mode interface built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

### **Frontend (The Face)**
* **Framework:** Next.js 14 (React)
* **Styling:** Tailwind CSS, Framer Motion (Animations)
* **HTTP:** Axios

### **Backend (The Brain)**
* **API:** FastAPI (Python)
* **AI Model:** HuggingFace Transformers (ViT)
* **Database:** SQLite + SQLModel (ORM)
* **Security:** OAuth2 + JWT Tokens

## ⚡ Quick Start

### 1. Clone & Setup
```bash
git clone [https://github.com/YOUR_USERNAME/mealplanML.git](https://github.com/YOUR_USERNAME/mealplanML.git)
cd mealplanML
```
### 2. backend setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\Activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python -m app.seed  # Initialize Database
uvicorn app.main:app --reload
```

### 3. frontend setup
```bash
cd frontend/mealpro
npm install
npm run dev
```
