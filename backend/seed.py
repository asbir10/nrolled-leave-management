import bcrypt
from database import SessionLocal, engine, Base
from models import User

Base.metadata.create_all(bind=engine)

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def seed_database():
    db = SessionLocal()
    try:
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Already seeded")
            return

        admin = User(
            name="Admin User",
            email="admin@nrolled.com",
            password=hash_password("admin123"),
            role="admin",
            leave_balance=15,
        )
        employee1 = User(
            name="Alice Thomas",
            email="alice@nrolled.com",
            password=hash_password("emp123"),
            role="employee",
            leave_balance=15,
        )
        employee2 = User(
            name="Bob Mathew",
            email="bob@nrolled.com",
            password=hash_password("emp123"),
            role="employee",
            leave_balance=15,
        )

        db.add(admin)
        db.add(employee1)
        db.add(employee2)
        db.commit()
        print("Seeded successfully")
    finally:
        db.close()

seed_database()