import { useEffect } from 'react';
import { trackEvent } from '../lib/amplitude';
import { useMarket } from '../context/AppContext';
import { MARKETS } from '../data/markets';
import { useNavigate } from 'react-router';
import { Market } from '../types/market';

export const MarketSelectorPage = () => {
    const { market, setMarket } = useMarket();
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    const handleSelectMarket = (m: Market) => {
        setMarket(m);
        localStorage.setItem('minders_fly_market', JSON.stringify(m));
        trackEvent('Market Changed', {
            new_country: m.country,
            new_market: m.market,
            new_language: m.language,
            previous_market: market.market
        });
        navigate(-1);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2 text-center">Selecciona tu ubicación</h1>
            <p className="text-slate-500 mb-8 text-center">Esto simulará la experiencia para el mercado seleccionado.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MARKETS.map((m) => (
                    <button 
                        key={m.market}
                        onClick={() => handleSelectMarket(m)}
                        className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                            market.market === m.market 
                                ? 'border-[#00A3E0] bg-[#00A3E0]/10 ring-1 ring-[#00A3E0]' 
                                : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                        <div>
                            <div className="font-bold text-slate-800">{m.country}</div>
                            <div className="text-sm text-slate-500">{m.language} · {m.currency}</div>
                        </div>
                        {market.market === m.market && (
                            <div className="w-3 h-3 rounded-full bg-[#00A3E0]"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
