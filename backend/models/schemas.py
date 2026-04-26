from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(UserLogin):
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str

class MLAnalysisRequest(BaseModel):
    symbols: List[str]
    start_date: str
    end_date: str

class MLPredictRequest(BaseModel):
    symbol: str
    start_date: str
    end_date: str
    days_to_predict: int = 30
