import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MLInsights from './pages/MLInsights';
import Predictions from './pages/Predictions';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="flex h-screen bg-slate-900 overflow-hidden relative">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: "url('/bg.png')" }}
        ></div>

        {isAuthenticated && <Sidebar onLogout={handleLogout} />}
        <div className="flex flex-col flex-1 z-10 w-full overflow-y-auto">
          {isAuthenticated && <Navbar onSearch={setSelectedSymbol} />}
          <main className={isAuthenticated ? "p-6 flex-1 text-white" : "flex-1 text-white"}>
            <Routes>
              <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />
              <Route path="/" element={isAuthenticated ? <Dashboard symbol={selectedSymbol} /> : <Navigate to="/login" />} />
              <Route path="/ml-insights" element={isAuthenticated ? <MLInsights /> : <Navigate to="/login" />} />
              <Route path="/predictions" element={isAuthenticated ? <Predictions symbol={selectedSymbol} /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
