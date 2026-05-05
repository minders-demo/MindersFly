import { useEffect, useState } from 'react';
import { trackEvent, trackError } from '../../lib/amplitude';
import { useMarket } from '../../context/AppContext';
import { useNavigate } from 'react-router';
import { mockData } from '../../data/generators';
import { Car, Users, Briefcase, Settings2, Gauge, Filter, MapPin, Calendar, Search } from 'lucide-react';
import { LATAM_CITIES } from '../../data/latamCities';
import { getCarImageByCategory } from '../../lib/carImages';

export const CarsResultsPage = () => {
    const { market } = useMarket();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [cars, setCars] = useState<any[]>([]);
    
    // Filters
    const [filterCategory, setFilterCategory] = useState<string>('all');
    
    // Search 
    const [pickup, setPickup] = useState('SCL');
    const [dropoff, setDropoff] = useState('SCL');
    
    // Mock search params
    const days = 3;

    useEffect(() => {

        setTimeout(() => {
             // Mock filter for destination using airport code
             const originObj = LATAM_CITIES.find(c => c.airportCode === pickup) || LATAM_CITIES[0];
             let data = mockData.cars.filter((item: any) => item.pickupCity === originObj.city);
             if (data.length === 0) {
                 data = mockData.cars.slice(0, 15);
             }
             setCars(data);
             setLoading(false);
        }, 800);
    }, [pickup, dropoff]);

    const filtered = cars.filter(c => filterCategory === 'all' || c.category === filterCategory).slice(0, 10);

    const handleSelect = (item: any) => {
        trackEvent('Car Selected', {
          item_id: item.id,
          name: item.model,
          category: item.category,
          price_per_day: item.pricePerDayUSD,
          provider: item.provider,
          days: days,
          market: market.market,
          currency: market.currency
        });
        navigate(`/travel/cars/checkout`);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-24 text-center">
                <Car size={40} className="text-[#00A3E0] mx-auto mb-6 animate-pulse" />
                <h2 className="text-xl font-bold text-[#1B0088]">Buscando los mejores vehículos...</h2>
                <p className="text-slate-500 mt-2">Cotizando con Hertz, Avis, Localiza y más</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2">Arriendo de autos</h1>
            <p className="text-slate-500 mb-6">Encuentra o devuelve tu vehículo con flexibilidad.</p>

            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-slate-200 mb-8 w-full">
                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                     <div className="md:col-span-1 border border-slate-300 rounded-xl relative focus-within:border-[#00A3E0] bg-white group hover:border-[#1B0088] transition-colors">
                         <MapPin size={24} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-[#00A3E0]" />
                         <label className="absolute left-10 top-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Retiro</label>
                         <select
                             value={pickup}
                             onChange={(e) => setPickup(e.target.value)}
                             className="w-full h-[52px] pl-10 pr-3 pt-4 pb-1 bg-transparent border-none focus:ring-0 outline-none font-medium text-slate-700 appearance-none cursor-pointer"
                         >
                             {LATAM_CITIES.map(c => (
                                 <option key={c.id} value={c.airportCode}>{c.city} ({c.airportCode})</option>
                             ))}
                         </select>
                     </div>
                     <div className="md:col-span-1 border border-slate-300 rounded-xl relative focus-within:border-[#00A3E0] bg-white group hover:border-[#1B0088] transition-colors">
                         <MapPin size={24} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-[#00A3E0]" />
                         <label className="absolute left-10 top-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Devolución</label>
                         <select
                             value={dropoff}
                             onChange={(e) => setDropoff(e.target.value)}
                             className="w-full h-[52px] pl-10 pr-3 pt-4 pb-1 bg-transparent border-none focus:ring-0 outline-none font-medium text-slate-700 appearance-none cursor-pointer"
                         >
                             {LATAM_CITIES.map(c => (
                                 <option key={c.id} value={c.airportCode}>{c.city} ({c.airportCode})</option>
                             ))}
                         </select>
                     </div>
                     <div className="md:col-span-1 border border-slate-300 rounded-xl relative bg-slate-50 cursor-not-allowed">
                         <Calendar size={24} className="absolute left-3 top-3.5 text-slate-400" />
                         <label className="absolute left-10 top-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Fechas</label>
                         <input type="text" value="3 Días" readOnly className="w-full h-[52px] pl-10 pr-3 pt-4 pb-1 bg-transparent border-none outline-none text-slate-600 font-medium cursor-not-allowed" />
                     </div>
                     <div className="md:col-span-1 border border-slate-300 rounded-xl relative bg-slate-50 cursor-not-allowed">
                         <Users size={24} className="absolute left-3 top-3.5 text-slate-400" />
                         <label className="absolute left-10 top-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Conductor</label>
                         <input type="text" value="30-65 años" readOnly className="w-full h-[52px] pl-10 pr-3 pt-4 pb-1 bg-transparent border-none outline-none text-slate-600 font-medium cursor-not-allowed" />
                     </div>
                     <div className="md:col-span-1 h-[52px]">
                         <button className="w-full h-full bg-[#1B0088] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-900 transition-colors shadow-sm">
                             <Search size={20} /> Buscar
                         </button>
                     </div>
                 </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                        <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
                            <Filter size={18} /> Filtrar
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Categoría</label>
                            <div className="space-y-2">
                                {['all', 'Compacto', 'Sedán', 'SUV', 'Premium', 'Van'].map(cat => (
                                    <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="category" 
                                            checked={filterCategory === cat} 
                                            onChange={() => setFilterCategory(cat)}
                                            className="text-[#00A3E0] focus:ring-[#00A3E0]"
                                        />
                                        <span className="capitalize">{cat === 'all' ? 'Todas' : cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 space-y-6">
                    {filtered.map(car => (
                        <div key={car.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                            <div className="w-full sm:w-56 shrink-0 flex flex-col items-center justify-center">
                                <img 
                                    src={car.image || getCarImageByCategory(car.category)} 
                                    onError={(e) => { e.currentTarget.src = getCarImageByCategory(car.category); }}
                                    alt={car.model} 
                                    className="w-full h-32 object-cover rounded-xl mb-4" 
                                />
                                {car.providerLogo ? (
                                    <img 
                                        src={car.providerLogo} 
                                        alt={car.provider} 
                                        onError={(e) => { e.currentTarget.outerHTML = `<span class="font-bold text-slate-500">${car.provider}</span>`; }}
                                        className="h-8 object-contain opacity-80" 
                                    />
                                ) : (
                                    <span className="font-bold text-slate-500">{car.provider}</span>
                                )}
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">{car.category}</div>
                                    <h3 className="text-xl font-bold text-[#1B0088] mb-1">{car.brand} {car.model} o similar</h3>
                                    <div className="text-sm text-slate-500 mb-4">{car.pickupCity}</div>
                                    
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-1.5" title="Pasajeros"><Users size={16} className="text-slate-400" /> {car.passengers} pas.</div>
                                        <div className="flex items-center gap-1.5" title="Maletas"><Briefcase size={16} className="text-slate-400" /> {car.suitcases} maletas</div>
                                        <div className="flex items-center gap-1.5" title="Transmisión"><Settings2 size={16} className="text-slate-400" /> {car.transmission}</div>
                                        {car.unlimitedMileage && (
                                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold" title="Kilometraje"><Gauge size={16} /> Ilimitado</div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
                                    <div>
                                        <div className="text-sm text-slate-500">Precio por {days} días</div>
                                        <div className="text-2xl font-bold text-[#ED1650]">USD {car.pricePerDayUSD * days}</div>
                                        <div className="text-xs text-slate-400 font-medium">(USD {car.pricePerDayUSD} / día)</div>
                                    </div>
                                    <button 
                                        onClick={() => handleSelect(car)}
                                        className="bg-[#ED1650] text-white px-8 py-2.5 rounded-full font-bold hover:bg-rose-700 transition shadow-md hover:shadow-lg"
                                    >
                                        Elegir auto
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {filtered.length === 0 && (
                        <div className="text-center p-12 bg-slate-50 rounded-2xl border border-slate-200">
                            <Car size={32} className="text-slate-400 mx-auto mb-4" />
                            <h3 className="font-bold text-slate-700 mb-2">No hay vehículos con estos filtros</h3>
                            <button onClick={() => setFilterCategory('all')} className="text-[#00A3E0] font-bold">Ver todos</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
