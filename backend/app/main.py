# Add these new imports
from pydantic import BaseModel
from app.models import User, FoodLog
from app.auth import get_password_hash, verify_password, create_access_token
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm




# Add these new imports
from sqlmodel import Session, select
from app.models import engine, FoodItem
from app.planner_engine import generate_weekly_plan
from pydantic import BaseModel





from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.vision_engine import predict_food
import shutil
import os

app = FastAPI()
class PlanRequest(BaseModel):
    target_calories: int
# --- SECURITY CONFIGURATION ---
# This allows your Next.js frontend (running on a different port) to talk to this backend.
origins = [
    "http://localhost:3000",  # Your Frontend
    "http://127.0.0.1:3000",
]




class UserRegister(BaseModel):
    username: str
    password: str
    calorie_goal: int = 2000

class Token(BaseModel):
    access_token: str
    token_type: str




app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (POST, GET, etc.)
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "message": "Smart Meal Planner AI is Ready"}

@app.post("/analyze-food")
async def analyze_food_endpoint(file: UploadFile = File(...)):
    """
    1. Receives image.
    2. AI Identifies it (e.g., "hamburger").
    3. DB looks up nutrition for "hamburger".
    """
    temp_filename = f"temp_{file.filename}"
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 1. AI Prediction
        ai_result = predict_food(temp_filename)
        
        if ai_result.get("status") == "failed":
            raise HTTPException(status_code=500, detail=ai_result.get("error"))

        food_name = ai_result["food_name"]

        # 2. Database Lookup
        # We replace underscores with spaces for better searching if needed, 
        # but the seed data uses exact AI labels (snake_case).
        with Session(engine) as session:
            statement = select(FoodItem).where(FoodItem.name == food_name)
            food_item = session.exec(statement).first()

        # 3. Construct Response
        if food_item:
            nutrition = {
                "calories": food_item.calories,
                "protein": f"{food_item.protein}g",
                "carbs": f"{food_item.carbs}g",
                "fat": f"{food_item.fat}g"
            }
        else:
            # Fallback if the AI finds a food we haven't added to the DB yet
            nutrition = {
                "calories": "Unknown",
                "protein": "?",
                "carbs": "?",
                "fat": "?"
            }

        return {
            "success": True,
            "food_detected": food_name,
            "nutrition_data": nutrition
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)


@app.post("/generate-plan")
def create_plan(request: PlanRequest):
    plan = generate_weekly_plan(request.target_calories)
    return {"status": "success", "plan": plan}




# --- AUTHENTICATION ENDPOINTS ---

@app.post("/register")
def register(user: UserRegister):
    with Session(engine) as session:
        # Check if user exists
        existing = session.exec(select(User).where(User.username == user.username)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        
        # Create new user
        hashed_pw = get_password_hash(user.password)
        new_user = User(username=user.username, password_hash=hashed_pw, calorie_goal=user.calorie_goal)
        session.add(new_user)
        session.commit()
        return {"status": "created", "username": user.username}

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == form_data.username)).first()
        
        if not user or not verify_password(form_data.password, user.password_hash):
            raise HTTPException(status_code=400, detail="Incorrect username or password")
        
        # Generate Token
        access_token = create_access_token(data={"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer"}