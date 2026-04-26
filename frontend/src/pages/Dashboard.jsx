import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Plotly from 'plotly.js-dist-min';
import factory from 'react-plotly.js/factory';
const Plot = (factory.default ? factory.default(Plotly) : factory(Plotly));
import { TrendingUp, Activity, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import axios from 'axios';

const Dashboard = ({ symbol = 'AAPL' }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [latestPrice, setLatestPrice] = useState('$0.00');

    useEffect(() => {
        setLoading(true);
        setErrorMsg('');
        
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        axios.get(`${baseUrl}/api/data/stock/${symbol}?period=6mo`)
            .then(res => {
                setData(res.data.data);
                if (res.data.data.length > 0) {
                    setLatestPrice(`$${res.data.data[res.data.data.length - 1].Close.toFixed(2)}`);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Backend failed, using mock data for", symbol);
                // Fallback to purely mocked data generator for the requested symbol
                const mockData = Array.from({ length: 30 }).map((_, i) => ({
                    Date: `2026-04-${(i + 1).toString().padStart(2, '0')}`,
                    Close: (150 + Math.random() * 20 + (i * 0.5)) * (symbol === 'TSLA' ? 1.5 : 1)
                }));
                setData(mockData);
                setLatestPrice(`$${mockData[mockData.length - 1].Close.toFixed(2)}`);
                setLoading(false);
            });
    }, [symbol]);

    const stats = [
        { title: `${symbol} Current`, value: latestPrice, change: "+2.4%", isPositive: true, icon: <DollarSign size={20}/> },
        { title: `${symbol} Volatility`, value: "Medium", change: "-0.5%", isPositive: false, icon: <Activity size={20}/> },
        { title: "Predicted Trend", value: "Bullish", change: "+5.1%", isPositive: true, icon: <TrendingUp size={20}/> },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-2xl font-bold">Market Overview: {symbol}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="glass p-6 rounded-2xl flex items-center justify-between"
                    >
                        <div>
                            <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <div className={`p-2 rounded-lg ${stat.isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {stat.icon}
                            </div>
                            <span className={`text-sm flex items-center ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {stat.isPositive ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
                                {stat.change}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="glass p-6 rounded-2xl h-[400px]">
                <h3 className="mb-4 font-semibold text-lg flex items-center">
                    <Activity className="mr-2 text-blue-400"/> {symbol} Price History (6 Months)
                </h3>
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <Plot
                        data={[
                            {
                                x: data.map(d => d.Date),
                                y: data.map(d => d.Close),
                                type: 'scatter',
                                mode: 'lines',
                                fill: 'tozeroy',
                                marker: { color: '#3b82f6' },
                                line: { shape: 'spline' }
                            }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { l: 40, r: 20, b: 40, t: 20 },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            font: { color: '#94a3b8' },
                            xaxis: { gridcolor: '#ffffff10' },
                            yaxis: { gridcolor: '#ffffff10' }
                        }}
                        config={{ displayModeBar: false, responsive: true }}
                        style={{ width: "100%", height: "90%" }}
                    />
                )}
            </div>
        </motion.div>
    );
};

export default Dashboard;
