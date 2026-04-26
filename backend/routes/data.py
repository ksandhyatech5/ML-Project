from fastapi import APIRouter, HTTPException
import yfinance as yf
import pandas as pd
from typing import List

router = APIRouter()

@router.get("/stock/{symbol}")
async def get_stock_data(symbol: str, period: str = "1y"):
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period)
        if hist.empty:
            raise HTTPException(status_code=404, detail="Stock data not found")
        
        hist.reset_index(inplace=True)
        hist['Date'] = hist['Date'].dt.strftime('%Y-%m-%d')
        
        result = hist[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']].to_dict(orient="records")
        return {"symbol": symbol, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stocks/multiple")
async def get_multiple_stocks(symbols: str, period: str = "1y"):
    sym_list = symbols.split(",")
    data = {}
    try:
        for sym in sym_list:
            stock = yf.Ticker(sym)
            hist = stock.history(period=period)
            if not hist.empty:
                hist.reset_index(inplace=True)
                hist['Date'] = hist['Date'].dt.strftime('%Y-%m-%d')
                data[sym] = hist[['Date', 'Close']].to_dict(orient="records")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
