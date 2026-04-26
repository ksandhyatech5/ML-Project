import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BrainCircuit, LineChart, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ onLogout }) => {
    const location = useLocation();

    const links = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/ml-insights', label: 'ML Insights', icon: <BrainCircuit size={20} /> },
        { path: '/predictions', label: 'Predictions', icon: <LineChart size={20} /> },
    ];

    return (
        <motion.div 
            initial={{ x: -250 }} 
            animate={{ x: 0 }} 
            className="w-64 h-full glass border-r border-white/10 z-20 flex flex-col p-4 shadow-2xl"
        >
            <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <LineChart className="text-white" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                    NexusStock
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                            location.pathname === link.path 
                                ? 'bg-white/20 text-white shadow-inner font-medium' 
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            <button onClick={onLogout} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-pink-500/20 hover:text-pink-400 transition-all">
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </motion.div>
    );
};

export default Sidebar;
