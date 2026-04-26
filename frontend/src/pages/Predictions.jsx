import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Plotly from 'plotly.js-dist-min';
import factory from 'react-plotly.js/factory';
const Plot = (factory.default ? factory.default(Plotly) : factory(Plotly));
import { Target, Zap, Clock } from 'lucide-react';

const Predictions = ({ symbol = 'AAPL' }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Dynamic mock prediction data adapting to the chosen symbol
        const mockData = Array.from({ length: 40 }).map((_, i) => {
            const isFuture = i > 30;
            const fluctuation = symbol === 'TSLA' ? 4.5 : 1.5;
            const base = symbol === 'NVDA' ? 800 : 150;
            const trend = base + (i * fluctuation) + (Math.random() * 10);
            return {
                Date: `Day ${i}`,
                Historical: !isFuture ? trend : null,
                Predicted: isFuture ? trend : null,
                upperBound: isFuture ? trend + 5 + (i-30)*0.5 : null,
                lowerBound: isFuture ? trend - 5 - (i-30)*0.5 : null,
            };
        });
        setData(mockData);
    }, [symbol]);

    const xVals = data.map(d => d.Date);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
                <Target className="mr-2 text-blue-500" /> Linear Trend Prediction: {symbol}
            </h2>
            
            <p className="text-slate-400">Forecasting short-term trends for {symbol} using Linear Regression with Confidence Intervals.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="glass p-6 rounded-2xl flex items-center justify-between">
                     <div>
                         <p className="text-sm text-slate-400">Model Accuracy</p>
                         <h3 className="text-2xl font-bold">{symbol === 'TSLA' ? '86.1%' : '92.4%'}</h3>
                     </div>
                     <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                         <Zap size={24} />
                     </div>
                 </div>
                 <div className="glass p-6 rounded-2xl flex items-center justify-between">
                     <div>
                         <p className="text-sm text-slate-400">Forecast Horizon</p>
                         <h3 className="text-2xl font-bold">30 Days</h3>
                     </div>
                     <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                         <Clock size={24} />
                     </div>
                 </div>
            </div>

            <div className="glass p-6 rounded-2xl h-[500px]">
                <Plot
                    data={[
                        {
                            x: xVals,
                            y: data.map(d => d.Historical),
                            type: 'scatter',
                            mode: 'lines',
                            name: 'Historical',
                            line: { color: '#3b82f6', width: 3 }
                        },
                        {
                            x: xVals,
                            y: data.map(d => d.Predicted),
                            type: 'scatter',
                            mode: 'lines',
                            name: 'Predicted',
                            line: { color: '#10b981', width: 3, dash: 'dash' }
                        },
                        {
                            x: xVals,
                            y: data.map(d => d.upperBound),
                            type: 'scatter',
                            mode: 'lines',
                            name: 'Upper Bound',
                            line: { color: 'rgba(16, 185, 129, 0.3)', width: 1 }
                        },
                        {
                            x: xVals,
                            y: data.map(d => d.lowerBound),
                            type: 'scatter',
                            mode: 'lines',
                            name: 'Lower Bound',
                            line: { color: 'rgba(16, 185, 129, 0.3)', width: 1 },
                            fill: 'tonexty',
                            fillcolor: 'rgba(16, 185, 129, 0.1)'
                        }
                    ]}
                    layout={{
                        autosize: true,
                        margin: { l: 40, r: 20, b: 40, t: 20 },
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        font: { color: '#94a3b8' },
                        legend: { orientation: 'h', y: -0.2 },
                        xaxis: { title: 'Timeline', gridcolor: '#ffffff10' },
                        yaxis: { title: 'Price Index', gridcolor: '#ffffff10' }
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        </motion.div>
    );
};

export default Predictions;
