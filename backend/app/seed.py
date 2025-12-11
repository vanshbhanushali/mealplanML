from sqlmodel import Session, select
# Import 'sqlite_file_name' so we delete the exact same file we create
from app.models import create_db_and_tables, engine, FoodItem, sqlite_file_name
import os

def seed_data():
    # Delete the old DB using the absolute path
    if os.path.exists(sqlite_file_name):
        try:
            os.remove(sqlite_file_name)
            print(f"Deleted old database at: {sqlite_file_name}")
        except PermissionError:
            print("Could not delete file (it might be open). Skipping deletion...")
        
    create_db_and_tables()
    
    foods = [
        # BREAKFAST
        FoodItem(name="oatmeal", calories=150, protein=5.0, carbs=27.0, fat=3.0, category="breakfast"),
        FoodItem(name="pancakes", calories=227, protein=6.0, carbs=28.0, fat=10.0, category="breakfast"),
        FoodItem(name="scrambled_eggs", calories=148, protein=10.0, carbs=1.0, fat=11.0, category="breakfast"),
        FoodItem(name="waffles", calories=291, protein=8.0, carbs=33.0, fat=14.0, category="breakfast"),
        FoodItem(name="yogurt_parfait", calories=250, protein=10.0, carbs=30.0, fat=5.0, category="breakfast"),

        # LUNCH
        FoodItem(name="caesar_salad", calories=470, protein=15.0, carbs=12.0, fat=40.0, category="lunch"),
        FoodItem(name="grilled_cheese_sandwich", calories=370, protein=12.0, carbs=35.0, fat=18.0, category="lunch"),
        FoodItem(name="chicken_wrap", calories=400, protein=25.0, carbs=30.0, fat=12.0, category="lunch"),
        FoodItem(name="sushi", calories=350, protein=15.0, carbs=60.0, fat=5.0, category="lunch"),
        FoodItem(name="club_sandwich", calories=550, protein=25.0, carbs=45.0, fat=25.0, category="lunch"),
        
        # DINNER
        FoodItem(name="hamburger", calories=550, protein=30.0, carbs=45.0, fat=25.0, category="dinner"),
        FoodItem(name="steak", calories=600, protein=50.0, carbs=0.0, fat=40.0, category="dinner"),
        FoodItem(name="spaghetti_carbonara", calories=750, protein=25.0, carbs=80.0, fat=35.0, category="dinner"),
        FoodItem(name="grilled_salmon", calories=450, protein=35.0, carbs=0.0, fat=30.0, category="dinner"),
        FoodItem(name="pizza", calories=800, protein=35.0, carbs=90.0, fat=30.0, category="dinner"),
        FoodItem(name="fried_rice", calories=400, protein=10.0, carbs=60.0, fat=15.0, category="dinner"),
        
        # SNACKS / AI DETECTED
        FoodItem(name="onion_rings", calories=400, protein=4.0, carbs=45.0, fat=22.0, category="snack"),
        FoodItem(name="french_fries", calories=312, protein=3.0, carbs=41.0, fat=15.0, category="snack"),
        FoodItem(name="chips", calories=536, protein=7.0, carbs=53.0, fat=35.0, category="snack"),
    ]

    with Session(engine) as session:
        print("Seeding Database with Categorized Foods...")
        for food in foods:
            session.add(food)
        session.commit()
        print("Database Upgrade Complete!")

if __name__ == "__main__":
    seed_data()