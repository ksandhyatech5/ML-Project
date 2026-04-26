import { Search, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const Navbar = ({ onSearch }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [username, setUsername] = useState('Alex Analyst');
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('username');
        if (storedName) {
            const formattedName = storedName.charAt(0).toUpperCase() + storedName.slice(1);
            setUsername(formattedName);
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim() && onSearch) {
            onSearch(searchInput.toUpperCase().trim());
        }
    };

    return (
        <motion.nav 
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="h-20 w-full glass border-b border-white/10 px-8 flex justify-between items-center z-50 shadow-lg sticky top-0"
        >
            <form onSubmit={handleSearch} className="flex items-center space-x-4 bg-slate-900/50 px-4 py-2 rounded-full border border-white/10 w-96 transition-all focus-within:ring-2 focus-within:ring-blue-500">
                <Search size={18} className="text-slate-400" />
                <input 
                    type="text" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search stock symbols (e.g. AAPL, TSLA) + Enter..." 
                    className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500 text-sm"
                />
            </form>

            <div className="flex items-center space-x-6">
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-full hover:bg-white/10 transition-all text-slate-300 hover:text-white relative cursor-pointer"
                    >
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
                    </button>
                    
                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-80 glass rounded-xl shadow-2xl border border-white/10 py-2 z-50 overflow-hidden"
                            >
                                <div className="px-4 py-2 border-b border-white/10">
                                    <h3 className="font-semibold text-white">Notifications</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    <div className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5">
                                        <p className="text-sm font-medium text-emerald-400">Welcome to NexusStock! 🎉</p>
                                        <p className="text-xs text-slate-400 mt-1">Hello {username}, your account is fully set up. Try exploring the ML Insights tab.</p>
                                    </div>
                                    <div className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors">
                                        <p className="text-sm font-medium text-blue-400">Market Alert: Model Ready</p>
                                        <p className="text-xs text-slate-400 mt-1">Global models synchronized to latest closing values successfully.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center cursor-pointer shadow-md">
                        <User size={20} className="text-white" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-white">{username}</p>
                        <p className="text-xs text-slate-400">Pro Member</p>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
