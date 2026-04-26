import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, LineChart, User } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuth }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const url = isLogin 
                ? `${baseUrl}/api/auth/login` 
                : `${baseUrl}/api/auth/signup`;
                
            const payload = isLogin 
                ? { email, password } 
                : { username, email, password };

            const res = await axios.post(url, payload);
            
            // Save token and authenticate
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('username', isLogin ? email.split('@')[0] : username);
            setAuth(true);
        } catch (err) {
            setError(err.response?.data?.detail || "Authentication Failed! Check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full h-[calc(100vh-theme(spacing.20))] items-center justify-center p-6">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md glass p-10 rounded-3xl shadow-2xl relative overflow-hidden text-white"
            >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg mb-6">
                        <LineChart size={32} className="text-white" />
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-2">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-slate-400 mb-6 text-center text-sm">
                        Unlock powerful multivariate relationships in stock data using state-of-the-art AI.
                    </p>

                    {error && (
                        <div className="mb-4 w-full p-3 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username" 
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        )}
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address" 
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password" 
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
                            {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18}/>}
                        </button>
                    </form>

                    <div className="mt-6 text-slate-400 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-400 hover:text-blue-300 font-medium">
                            {isLogin ? "Sign Up" : "Log In"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
