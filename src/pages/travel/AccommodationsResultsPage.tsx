import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useMarket } from '../../context/AppContext';
import { useNavigate } from 'react-router';
import { mockData } from '../../data/generators';
import { Hotel, Filter, MapPin, Calendar, Star, Users, Search } from 'lucide-react';

export const AccommodationsResultsPage = () => {
    const { market } = useMarket();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [hotels, setHotels] = useState<any[]>([]);
    
    // Filters
    const [filterCategory, setFilterCategory] = useState<string>('all');
    
    // Search 
    const [destination, setDestination] = useState('Cartagena');
    
    // Mock search params
    const days = 3;

    useEffect(() => {

        setTimeout(() => {
             // Mock loading
             let data = mockData.hotels;
             if (data.length === 0) {
                 data = mockData.hotels.slice(0, 15);
             }
             setHotels(data);
             setLoading(false);
        }, 1000);
    }, []);

    const filtered = hotels.filter(c => filterCategory === 'all' || c.type === filterCategory).slice(0, 10);

    const handleSelect = (item: any) => {
        trackEvent('Accommodation Selected', {
          item_id: item.id,
          name: item.name,
          category: item.type,
          price_per_night: item.pricePerNightUSD,
          days: days,
          market: market.market,
          currency: market.currency
        });
        navigate(`/travel/hotels/detail/${item.id}`);
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-24 text-center">
                <Hotel size={40} className="text-[#00A3E0] mx-auto mb-6 animate-pulse" />
                <h2 className="text-xl font-bold text-[#1B0088]">Buscando los mejores alojamientos...</h2>
                <p className="text-slate-500 mt-2">Encuentra tu lugar ideal</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2">Alojamientos</h1>
            <p className="text-slate-500 mb-6">Encuentra hoteles, casas, hostales y suma millas y Puntos Calificables</p>

            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-slate-200 mb-8 w-full">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                     <div className="md:col-span-1">
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Destino</label>
                         <div className="relative">
                             <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                             <input type="text" value={destination} onChange={e=>setDestination(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:border-[#00A3E0] outline-none" />
                         </div>
                     </div>
                     <div className="md:col-span-1">
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Fechas</label>
                         <div className="relative">
                             <Calendar size={18} className="absolute left-3 top-3 text-slate-400" />
                             <input type="text" value="3 Noches" readOnly className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-none text-slate-600" />
                         </div>
                     </div>
                     <div className="md:col-span-1">
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Huéspedes</label>
                         <div className="relative">
                             <Users size={18} className="absolute left-3 top-3 text-slate-400" />
                             <input type="text" value="2 Adultos" readOnly className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-none text-slate-600" />
                         </div>
                     </div>
                     <div className="md:col-span-1">
                         <button className="w-full bg-[#1B0088] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-900 transition-colors">
                             <Search size={18} /> Buscar
                         </button>
                     </div>
                 </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                        <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
                            <Filter size={18} /> Filtrar por Tipo
                        </div>
                        
                        <div className="mb-6">
                            <div className="space-y-2">
                                {['all', 'Hotel', 'Apartamento', 'Resort', 'Villa', 'Hostal', 'Casa'].map(cat => (
                                    <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="category" 
                                            checked={filterCategory === cat} 
                                            onChange={() => setFilterCategory(cat)}
                                            className="text-[#00A3E0] focus:ring-[#00A3E0]"
                                        />
                                        <span className="capitalize">{cat === 'all' ? 'Todos' : cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 space-y-6">
                    {filtered.map(hotel => (
                        <div key={hotel.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                            <div className="w-full sm:w-64 h-48 shrink-0 flex flex-col items-center justify-center relative overflow-hidden rounded-xl">
                                <img 
                                    src={hotel.image} 
                                    alt={hotel.name} 
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                                />
                                {hotel.type === 'Resort' && <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] uppercase font-bold py-1 px-2 rounded">Recomendado</div>}
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex gap-1 mb-1 text-slate-400">
                                                {Array(hotel.stars).fill(0).map((_, i) => (
                                                    <Star key={i} size={14} fill="currentColor" />
                                                ))}
                                            </div>
                                            <h3 className="text-xl font-bold text-[#1B0088] mb-1">{hotel.name}</h3>
                                            <div className="text-sm text-slate-500 flex items-center gap-1">
                                                <span>{hotel.city}, {hotel.country}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>A {hotel.distanceFromCenterKm} km del centro</span>
                                            </div>
                                        </div>
                                        {hotel.reviewScore && <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-[#1B0088]">{hotel.reviewLabel}</div>
                                                <div className="text-[10px] text-slate-500">{hotel.reviewsCount} comentarios</div>
                                            </div>
                                            <div className="bg-[#1B0088] text-white font-bold p-2 text-sm rounded-lg rounded-tr-none">
                                                {hotel.reviewScore}
                                            </div>
                                        </div>}
                                    </div>
                                    
                                    <div className="mt-4 flex flex-wrap gap-1">
                                         {hotel.amenities?.slice(0, 4).map((am: string, i: number) => (
                                             <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                                 {am}
                                             </span>
                                         ))}
                                         {hotel.amenities?.length > 4 && <span className="text-xs text-slate-500 px-2 py-1">+{hotel.amenities.length - 4}</span>}
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
                                    <div>
                                        <div className="text-sm text-slate-500">Precio desde</div>
                                        <div className="text-2xl font-bold text-[#ED1650]">USD {hotel.pricePerNightUSD}</div>
                                        <div className="text-xs text-slate-400">por noche, impuestos incluídos</div>
                                    </div>
                                    <button 
                                        onClick={() => handleSelect(hotel)}
                                        className="bg-[#ED1650] text-white px-8 py-2.5 rounded-full font-bold hover:bg-rose-700 transition"
                                    >
                                        Ver alojamiento
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {filtered.length === 0 && (
                        <div className="text-center p-12 bg-slate-50 rounded-2xl border border-slate-200">
                            <Hotel size={32} className="text-slate-400 mx-auto mb-4" />
                            <h3 className="font-bold text-slate-700 mb-2">No hay alojamientos con estos filtros</h3>
                            <button onClick={() => setFilterCategory('all')} className="text-[#00A3E0] font-bold">Ver todos</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Additional Sections */}
            <div className="mt-16 pt-8 border-t border-slate-200">
                 <h2 className="text-2xl font-bold text-[#1B0088] mb-6">Casas que encantan a los clientes</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {hotels.filter(h => h.type === 'Casa' || h.type === 'Villa').slice(0,4).map(h => (
                           <div key={h.id} className="group cursor-pointer" onClick={() => handleSelect(h)}>
                                <div className="h-48 rounded-xl overflow-hidden mb-3">
                                     <img src={h.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <h3 className="font-bold text-slate-800 line-clamp-1">{h.name}</h3>
                                <p className="text-sm text-slate-500">{h.city}</p>
                                <div className="flex items-center gap-2 mt-1">
                                     <span className="bg-[#1B0088] text-white text-xs px-1.5 py-0.5 rounded font-bold">{h.reviewScore}</span>
                                     <span className="text-xs text-slate-500">{h.reviewLabel}</span>
                                </div>
                                <div className="mt-2 font-bold text-sm text-[#ED1650]">USD {h.pricePerNightUSD}</div>
                           </div>
                      ))}
                 </div>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200 mb-20">
                 <h2 className="text-2xl font-bold text-[#1B0088] mb-6">Busca por tipo de alojamiento</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      {['Hoteles', 'Apartamentos', 'Resorts', 'Villas', 'Hostales', 'Casas'].map((tipo, idx) => (
                           <div key={idx} className="group cursor-pointer text-center" onClick={() => {
                               let mapped = tipo;
                               if(tipo === 'Hoteles') mapped = 'Hotel';
                               if(tipo === 'Apartamentos') mapped = 'Apartamento';
                               if(tipo === 'Resorts') mapped = 'Resort';
                               if(tipo === 'Villas') mapped = 'Villa';
                               if(tipo === 'Hostales') mapped = 'Hostal';
                               if(tipo === 'Casas') mapped = 'Casa';
                               setFilterCategory(mapped);
                               // window.scrollTo
                               window.scrollTo({ top: 0, behavior: 'smooth' });
                           }}>
                                <div className="h-24 md:h-32 rounded-xl overflow-hidden mb-3 border border-slate-200 shadow-sm">
                                     <img src={`https://images.unsplash.com/photo-${[
                                         '1566073771259-6a8506099945',
                                         '1522708323590-d24dbb6b0267',
                                         '1582719508461-905c673771fd',
                                         '1600596542815-ffad4c1539a9',
                                         '1555854877-bab0e564b8d5',
                                         '1512917774080-9991f1c4c750'
                                     ][idx]}?q=80&w=600&auto=format&fit=crop`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                                <h3 className="font-bold text-sm text-slate-800">{tipo}</h3>
                           </div>
                      ))}
                 </div>
            </div>
        </div>
    );
};
