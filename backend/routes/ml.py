from fastapi import APIRouter, HTTPException
from models.schemas import MLAnalysisRequest, MLPredictRequest
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression

router = APIRouter()

def fetch_data_for_symbols(symbols: list, start_date: str, end_date: str) -> pd.DataFrame:
    df_list = []
    for sym in symbols:
        stock = yf.Ticker(sym)
        hist = stock.history(start=start_date, end=end_date)
        if not hist.empty:
            hist['Symbol'] = sym
            df_list.append(hist[['Close']])
            
    if not df_list:
        raise HTTPException(status_code=404, detail="No data found for given symbols")
        
    # Merge on date
    df_merged = pd.concat(df_list, axis=1)
    df_merged.columns = symbols
    df_merged.dropna(inplace=True)
    return df_merged

@router.post("/correlation")
async def get_correlation(request: MLAnalysisRequest):
    df = fetch_data_for_symbols(request.symbols, request.start_date, request.end_date)
    # Calculate daily returns
    returns = df.pct_change().dropna()
    corr_matrix = returns.corr()
    
    # Format for heatmap
    z = corr_matrix.values.tolist()
    x = corr_matrix.columns.tolist()
    y = corr_matrix.index.tolist()
    
    return {"x": x, "y": y, "z": z}

@router.post("/pca")
async def perform_pca(request: MLAnalysisRequest):
    df = fetch_data_for_symbols(request.symbols, request.start_date, request.end_date)
    returns = df.pct_change().dropna()
    
    pca = PCA(n_components=3) # Force 3 components for 3D scatter
    components = pca.fit_transform(returns.T) # We transpose to cluster stocks, not days
    
    explained_variance = pca.explained_variance_ratio_.tolist()
    
    result = []
    for idx, sym in enumerate(request.symbols):
        if idx < len(components):
            result.append({
                "symbol": sym,
                "pc1": components[idx][0],
                "pc2": components[idx][1],
                "pc3": components[idx][2]
            })
            
    return {"data": result, "explained_variance": explained_variance}

@router.post("/clustering")
async def perform_clustering(request: MLAnalysisRequest, k: int = 3):
    df = fetch_data_for_symbols(request.symbols, request.start_date, request.end_date)
    returns = df.pct_change().dropna()
    
    # Simple feature extraction for stocks: Mean Return and Volatility
    mean_returns = returns.mean() * 252 # Annualized
    volatility = returns.std() * np.sqrt(252) # Annualized
    
    features = pd.DataFrame({'Return': mean_returns, 'Volatility': volatility})
    
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(features)
    
    features['Cluster'] = kmeans.labels_
    
    result = []
    for idx, row in features.iterrows():
        result.append({
            "symbol": idx,
            "return": row['Return'],
            "volatility": row['Volatility'],
            "cluster": int(row['Cluster'])
        })
        
    return {"data": result}
    
@router.post("/predict")
async def predict_trend(request: MLPredictRequest):
    stock = yf.Ticker(request.symbol)
    hist = stock.history(start=request.start_date, end=request.end_date)
    if hist.empty:
         raise HTTPException(status_code=404, detail="No data found")
         
    hist.reset_index(inplace=True)
    hist['Days'] = (hist['Date'] - hist['Date'].min()).dt.days
    
    X = hist[['Days']].values
    y = hist['Close'].values
    
    model = LinearRegression()
    model.fit(X, y)
    
    last_day = hist['Days'].max()
    future_days = np.array([[last_day + i] for i in range(1, request.days_to_predict + 1)])
    predictions = model.predict(future_days)
    
    # Calculate simple confidence intervals (Standard Error of the Estimate)
    predictions_hist = model.predict(X)
    see = np.sqrt(np.sum((y - predictions_hist)**2) / (len(y) - 2))
    
    future_dates = [hist['Date'].max() + pd.Timedelta(days=i) for i in range(1, request.days_to_predict + 1)]
    
    result = []
    for idx, val in enumerate(predictions):
        result.append({
            "date": future_dates[idx].strftime('%Y-%m-%d'),
            "predicted_close": val,
            "upper_bound": val + 1.96 * see,
            "lower_bound": val - 1.96 * see
        })
        
    return {"symbol": request.symbol, "predictions": result}
