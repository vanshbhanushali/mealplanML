import os
from typing import Optional
from sqlmodel import Field, SQLModel, create_engine

# 1. The Database Model (Keep this as is)
class FoodItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    calories: int 
    protein: float
    carbs: float
    fat: float
    category: str = Field(default="any")

# ... (Keep existing imports and FoodItem class)

# 1. NEW: User Table
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str
    height: Optional[float] = None
    weight: Optional[float] = None
    calorie_goal: int = Field(default=2000)

# 2. NEW: History Table (What they scanned)
class FoodLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    food_name: str
    calories: int
    date: str # We'll store as "YYYY-MM-DD" string for simplicity

# ... (Keep the rest of the file same)

# 2. ROBUST DATABASE SETUP (The Fix)
# This gets the absolute path to your 'backend' folder dynamically
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

# Create the data folder if it doesn't exist (Fixes the error!)
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Define the absolute path to the DB file
sqlite_file_name = os.path.join(DATA_DIR, "database.db")
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)