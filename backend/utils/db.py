import motor.motor_asyncio
from pymongo import MongoClient
import os

MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://localhost:27017")
USE_MOCK = os.getenv("USE_MOCK_DB", "True").lower() in ["true", "1", "yes"]

class MockDB:
    def __init__(self):
        self.users = {}
        self.analyses = []

    def get_user_by_email(self, email):
        return self.users.get(email)

    def create_user(self, email, target_user):
        self.users[email] = target_user
        return True

    def save_analysis(self, analysis):
        self.analyses.append(analysis)
        return True

    def get_analyses(self):
        return self.analyses

db_client = None
if USE_MOCK:
    print("Using Mock Database for local development.")
    db_client = MockDB()
else:
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS, serverSelectionTimeoutMS=2000)
        db_client = client.stock_ml
        print("Connected to MongoDB.")
    except Exception as e:
        print("Failed to connect to MongoDB, falling back to Mock Database.")
        db_client = MockDB()

def get_db():
    return db_client
