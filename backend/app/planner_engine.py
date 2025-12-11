from sqlmodel import Session, select
from app.models import engine, FoodItem
import random

def generate_weekly_plan(target_calories: int):
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    weekly_plan = {}
    
    with Session(engine) as session:
        breakfasts = session.exec(select(FoodItem).where(FoodItem.category == "breakfast")).all()
        lunches = session.exec(select(FoodItem).where(FoodItem.category == "lunch")).all()
        dinners = session.exec(select(FoodItem).where(FoodItem.category == "dinner")).all()
        # Fetch snacks too
        snacks = session.exec(select(FoodItem).where(FoodItem.category == "snack")).all()

        if not breakfasts or not lunches or not dinners:
            return {"error": "Not enough data"}

        for day in days:
            # 1. Start with the "Core" 3 meals
            b = random.choice(breakfasts)
            l = random.choice(lunches)
            d = random.choice(dinners)
            
            daily_snacks = []
            current_calories = b.calories + l.calories + d.calories
            
            # 2. The "Filler" Loop
            # While we are under the target (minus a small buffer), keep adding snacks
            attempts = 0
            while current_calories < (target_calories - 100) and attempts < 10:
                if snacks:
                    snack = random.choice(snacks)
                    daily_snacks.append(snack)
                    current_calories += snack.calories
                attempts += 1
            
            # 3. Final Output Structure
            weekly_plan[day] = {
                "breakfast": b,
                "lunch": l,
                "dinner": d,
                "snacks": daily_snacks,  # New List
                "total_calories": current_calories
            }

    return weekly_plan