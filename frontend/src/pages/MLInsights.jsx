import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Plotly from 'plotly.js-dist-min';
import factory from 'react-plotly.js/factory';
const Plot = (factory.default ? factory.default(Plotly) : factory(Plotly));
import axios from 'axios';
import { Layers, Network, ScatterChart as ScatterChartIcon } from 'lucide-react';

const MLInsights = () => {
    const [pcaData, setPcaData] = useState([]);
    
    useEffect(() => {
        // Mock PCA Data (3D Scatter) representing different stocks
        const mockPca = Array.from({ length: 50 }).map((_, i) => ({
            symbol: `STK${i}`,
            pc1: Math.random() * 10 - 5,
            pc2: Math.random() * 10 - 5,
            pc3: Math.random() * 10 - 5,
            cluster: Math.floor(Math.random() * 3)
        }));
        setPcaData(mockPca);
    }, []);

    const colors = ['#3b82f6', '#10b981', '#f43f5e'];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
                <Network className="mr-2 text-pink-500" /> Multivariate Analysis
            </h2>
            
            <p className="text-slate-400">Discover hidden relationships between assets using dimensionality reduction and clustering.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <h3 className="mb-4 font-semibold text-lg flex items-center">
                        <Layers className="mr-2 text-emerald-400"/> Principal Component Analysis (3D)
                    </h3>
                    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner bg-slate-900/50 flex justify-center items-center">
                        <Plot
                            data={[
                                {
                                    x: pcaData.map(d => d.pc1),
                                    y: pcaData.map(d => d.pc2),
                                    z: pcaData.map(d => d.pc3),
                                    text: pcaData.map(d => d.symbol),
                                    mode: 'markers',
                                    marker: {
                                        size: 6,
                                        line: { color: 'rgba(255, 255, 255, 0.2)', width: 0.5 },
                                        color: pcaData.map(d => colors[d.cluster]),
                                        opacity: 0.8
                                    },
                                    type: 'scatter3d'
                                }
                            ]}
                            layout={{
                                autosize: true,
                                margin: { l: 0, r: 0, b: 0, t: 0 },
                                paper_bgcolor: 'rgba(0,0,0,0)',
                                plot_bgcolor: 'rgba(0,0,0,0)',
                                scene: {
                                    xaxis: { title: 'Component 1', gridcolor: '#334155', zerolinecolor: '#334155', color: '#94a3b8' },
                                    yaxis: { title: 'Component 2', gridcolor: '#334155', zerolinecolor: '#334155', color: '#94a3b8' },
                                    zaxis: { title: 'Component 3', gridcolor: '#334155', zerolinecolor: '#334155', color: '#94a3b8' },
                                    bgcolor: 'rgba(0,0,0,0)'
                                },
                                font: { color: '#fff' }
                            }}
                            config={{ displayModeBar: false, responsive: true }}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl flex flex-col">
                    <h3 className="mb-4 font-semibold text-lg flex items-center">
                        <ScatterChartIcon className="mr-2 text-blue-400"/> Correlation Heatmap
                    </h3>
                    <div className="flex-1 rounded-xl overflow-hidden shadow-inner bg-slate-900/50 flex justify-center items-center">
                         <Plot
                            data={[{
                                z: [
                                    [1, 0.8, 0.3, -0.4, 0.1],
                                    [0.8, 1, 0.5, -0.2, 0.2],
                                    [0.3, 0.5, 1, 0.1, -0.6],
                                    [-0.4, -0.2, 0.1, 1, 0.7],
                                    [0.1, 0.2, -0.6, 0.7, 1]
                                ],
                                x: ['AAPL', 'MSFT', 'GOOG', 'TSLA', 'AMZN'],
                                y: ['AAPL', 'MSFT', 'GOOG', 'TSLA', 'AMZN'],
                                type: 'heatmap',
                                colorscale: 'Viridis',
                                showscale: false
                            }]}
                            layout={{
                                autosize: true,
                                margin: { l: 50, r: 20, b: 50, t: 30 },
                                paper_bgcolor: 'rgba(0,0,0,0)',
                                plot_bgcolor: 'rgba(0,0,0,0)',
                                font: { color: '#94a3b8' },
                                xaxis: { tickangle: -45 }
                            }}
                            config={{ displayModeBar: false, responsive: true }}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default MLInsights;
