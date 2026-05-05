import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useMarket } from '../../context/AppContext';
import { useNavigate } from 'react-router';
import { mockData } from '../../data/generators';
import { Star } from 'lucide-react';

interface Props {
    type: 'hotels' | 'cars' | 'assistance';
}

export const TravelGenericResultsPage = ({ type }: Props) => {
    const { market } = useMarket();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {

        setTimeout(() => {
             const allItems = mockData[type] || [];
             let data = allItems.filter((item: any) => !item.market || item.market === market.market);
             if (data.length === 0) {
               data = allItems.slice(0, 12);
             }
             setItems(data);
             setLoading(false);
        }, 800);
    }, [market.market, type]);

    const getItemPrice = (item: any) => {
      if (type === 'hotels') return item.pricePerNightUSD;
      if (type === 'cars') return item.pricePerDayUSD;
      if (type === 'assistance') return item.priceUSD;
      return item.priceUSD || 0;
    };

    const handleSelect = (item: any) => {
        const eventName =
          type === 'hotels' ? 'Hotel Selected' :
          type === 'cars' ? 'Car Selected' :
          'Assistance Plan Selected';

        trackEvent(eventName, {
          product_type: type,
          item_id: item.id,
          name: item.name || item.model,
          price: getItemPrice(item),
          market: market.market,
          currency: market.currency,
          journey_name: 'Ancillaries',
          journey_step: `${type}_selected`
        });
        navigate(`/travel/${type}/checkout`);
    };

    if (loading) {
        return <div className="p-24 text-center">Cargando opciones...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2 text-capitalize">
                {type === 'hotels' ? 'Hoteles relacionados' : 
                 type === 'cars' ? 'Arriendo de autos' : 'Asistencia de viaje'}
            </h1>
            <p className="text-slate-500 mb-8">Encuentra opciones en tu destino preferido.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.slice(0, 12).map(item => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group">
                        <div className="h-40 bg-slate-200 relative overflow-hidden">
                            <img 
                                src={`https://picsum.photos/seed/${item.id}/300/200`} 
                                alt={item.name || item.model} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                        </div>
                        <div className="p-4 flex flex-col justify-between h-[180px]">
                            <div>
                                <h3 className="font-bold text-slate-800 line-clamp-1 mb-1">{item.name || item.model}</h3>
                                {type === 'hotels' && (
                                    <div className="flex items-center gap-1 text-orange-400 mb-2">
                                        {Array(Math.floor(item.rating || 0)).fill(0).map((_, i) => <Star key={i} size={12} className="fill-current" />)}
                                    </div>
                                )}
                                {type === 'hotels' && <div className="text-xs text-slate-500 line-clamp-2">{item.city}</div>}
                                {type === 'cars' && <div className="text-xs text-slate-500 line-clamp-2">{item.category} • {item.passengers} pas. • {item.transmission}</div>}
                                {type === 'assistance' && <div className="text-xs text-slate-500 line-clamp-2">{item.coverage}</div>}
                            </div>
                            
                            <div className="flex justify-between items-end mt-2">
                                <div>
                                    <div className="text-lg font-bold text-[#1B0088]">{market.currency} {Number(getItemPrice(item)).toFixed(0)}</div>
                                    <div className="text-[10px] text-slate-400 uppercase">
                                       {type === 'hotels' ? 'por noche' : type === 'cars' ? 'por día' : 'por plan'}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleSelect(item)}
                                    className="bg-[#ED1650] text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-rose-700 transition"
                                >
                                    Ver
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
