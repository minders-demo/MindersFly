import { useEffect, useState } from 'react';
import { trackEvent, trackError } from '../../lib/amplitude';
import { useMarket, useUser } from '../../context/AppContext';
import { useNavigate } from 'react-router';
import { mockData } from '../../data/generators';
import { errorSimulator } from '../../lib/errorSimulator';
import { Briefcase, Plane, Hotel as HotelIcon, Star, Filter, MapPin, Calendar, Users, Search } from 'lucide-react';
import { LATAM_CITIES } from '../../data/latamCities';

export const PackageResultsPage = () => {
    const { market } = useMarket();
    const { user } = useUser();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [packages, setPackages] = useState<any[]>([]);
    
    // Search Params
    const [originSearch, setOriginSearch] = useState('SCL');
    const [destinationSearch, setDestinationSearch] = useState('CUN');
    
    // Naive filter
    const [filterStars, setFilterStars] = useState(0);

    useEffect(() => {

        const err = errorSimulator.shouldTriggerError({
            step: 'package_search',
            userTier: user?.user_tier || user?.tier
        });

        setTimeout(() => {
            if (err) {
                trackError({
                    error_type: err.id,
                    error_code: err.code,
                    error_message: err.msg,
                    error_category: 'search',
                    transaction_step: 'package_search',
                    route: '/travel/packages/results',
                    journey_name: 'Packages',
                    journey_step: 'package_search'
                });
                alert('No se pudieron cargar los paquetes: ' + err.msg);
                setPackages([]);
            } else {
                let pkgsForMarket = [...mockData.packages];
                let usedFallback = false;
                
                if (originSearch || destinationSearch) {
                     pkgsForMarket = pkgsForMarket.filter((p: any) => p.destinationCode === destinationSearch || p.destinationCity === destinationSearch);
                     
                     // If no exact match for destination, generate fallbacks
                     if (pkgsForMarket.length === 0) {
                          usedFallback = true;
                          const selectedDest = LATAM_CITIES.find(c => c.airportCode === destinationSearch) || { city: destinationSearch, country: 'Destino', airportCode: destinationSearch };
                          const selectedOrig = LATAM_CITIES.find(c => c.airportCode === originSearch) || { city: originSearch, country: 'Origen', airportCode: originSearch };
                          
                          pkgsForMarket = [
                              {
                                  id: `pkg-fallback-1-${Date.now()}`,
                                  originCode: selectedOrig.airportCode,
                                  originCity: selectedOrig.city,
                                  destinationCode: selectedDest.airportCode,
                                  destinationCity: selectedDest.city,
                                  destinationCountry: selectedDest.country,
                                  name: `Escapada a ${selectedDest.city}`,
                                  hotelName: `Hotel Plaza ${selectedDest.city}`,
                                  hotelRating: 4,
                                  nights: 3,
                                  priceUSD: 450 + Math.floor(Math.random() * 200),
                                  image: `https://picsum.photos/seed/${selectedDest.city.toLowerCase().replace(/ /g, '')}1/600/400`,
                                  description: `Disfruta de ${selectedDest.city} con este paquete especial que incluye vuelo directo y alojamiento céntrico con desayuno.`
                              },
                              {
                                  id: `pkg-fallback-2-${Date.now()}`,
                                  originCode: selectedOrig.airportCode,
                                  originCity: selectedOrig.city,
                                  destinationCode: selectedDest.airportCode,
                                  destinationCity: selectedDest.city,
                                  destinationCountry: selectedDest.country,
                                  name: `Semana en ${selectedDest.city}`,
                                  hotelName: `${selectedDest.city} Resort & Spa`,
                                  hotelRating: 5,
                                  nights: 7,
                                  priceUSD: 850 + Math.floor(Math.random() * 300),
                                  image: `https://picsum.photos/seed/${selectedDest.city.toLowerCase().replace(/ /g, '')}2/600/400`,
                                  description: `La mejor experiencia en ${selectedDest.city} con alojamiento todo incluido y vuelos directos en horarios preferenciales.`
                              }
                          ];
                          // Save fallbacks to session storage so detail page can load them
                          try {
                              const existingFallbackStr = sessionStorage.getItem('minders_fly_fallback_pkgs') || '[]';
                              const existingFallbacks = JSON.parse(existingFallbackStr);
                              const newFallbacks = [...existingFallbacks, ...pkgsForMarket].slice(-20); // Keep last 20
                              sessionStorage.setItem('minders_fly_fallback_pkgs', JSON.stringify(newFallbacks));
                          } catch(e) {}
                     }
                }
                
                // Extra tracking for the results
                trackEvent('Package Results Viewed', { 
                     origin: originSearch,
                     destination: destinationSearch,
                     results_count: pkgsForMarket.length,
                     fallback_results_used: usedFallback,
                     currency: "USD",
                     journey_name: "Packages",
                     journey_step: "results_viewed"
                });

                setPackages(pkgsForMarket);
            }
            setLoading(false);
        }, 1200);

    }, [market.market, user, originSearch, destinationSearch]);

    const filtered = packages.filter(p => filterStars === 0 || p.hotelRating >= filterStars).slice(0, 12); // slice for demo

    const handleSelect = (pkg: any) => {
        try {
            trackEvent('Package Selected', { 
                package_id: pkg.id, 
                price: pkg.priceUSD, 
                destination: pkg.destination,
                rating: pkg.rating,
                nights: pkg.nights,
                journey_name: 'Packages',
                journey_step: 'package_selected'
            });
            navigate(`/travel/packages/detail/${pkg.id}`);
        } catch (e: any) {
            console.error("Tracking Error on handleSelect", e);
            trackError({
                 error_type: 'tracking_failed',
                 error_code: '500',
                 error_message: e.message,
                 transaction_step: 'package_selected',
                 route: '/travel/packages/results'
            });
            navigate(`/travel/packages/detail/${pkg.id}`);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-24 text-center">
                <Briefcase size={40} className="text-[#00A3E0] mx-auto mb-6 animate-bounce" />
                <h2 className="text-xl font-bold text-[#1B0088]">Armando los mejores paquetes Vuelo + Hotel...</h2>
                <p className="text-slate-500 mt-2">Buscando las mejores opciones para ti</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2">Paquetes Vuelo + Hotel</h1>
            <p className="text-slate-500 mb-6">Descubre las mejores opciones con hasta 30% de dscto que hemos encontrado.</p>

            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-slate-200 mb-8 w-full">
                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                     <div className="md:col-span-1 border border-slate-300 rounded-xl relative focus-within:border-[#00A3E0] bg-white group hover:border-[#1B0088] transition-colors">
                         <MapPin size={24} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-[#00A3E0]" />
                         <label className="absolute left-10 top-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Origen</label>
                         <select
                             value={originSearch}
                             onChange={(e) => setOriginSearch(e.target.value)}
                             className="w-full h-[52px] pl-10 pr-3 pt-4 pb-1 bg-transparent border-none focus:ring-0 outline-none font-medium text-slate-700 appearance-none cursor-pointer"
                         >
                             {LATAM_CITIES.map(c => (
                                 <option key={c.id} value={c.airportCode}>{c.city} ({c.airportCode})</option>
                             ))}
                         </select>
                     </div>
                     <div className="md:col-span-1 border border-slate-300 rounded-xl relative focus-within:border-[#00A3E0] bg-white group hover:border-[#1B0088] transition-colors">
                         <MapPin size={24} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-[#00A3E0]" />
                         <label className="absolute left-10 top-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Destino</label>
                         <select
                             value={destinationSearch}
                             onChange={(e) => setDestinationSearch(e.target.value)}
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
                         <input type="text" value="3 Noches" readOnly className="w-full h-[52px] pl-10 pr-3 pt-4 pb-1 bg-transparent border-none outline-none text-slate-600 font-medium cursor-not-allowed" />
                     </div>
                     <div className="md:col-span-1 border border-slate-300 rounded-xl relative bg-slate-50 cursor-not-allowed">
                         <Users size={24} className="absolute left-3 top-3.5 text-slate-400" />
                         <label className="absolute left-10 top-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pasajeros</label>
                         <input type="text" value="2 Adultos, 1 Hab" readOnly className="w-full h-[52px] pl-10 pr-3 pt-4 pb-1 bg-transparent border-none outline-none text-slate-600 font-medium cursor-not-allowed" />
                     </div>
                     <div className="md:col-span-1 h-[52px]">
                         <button className="w-full h-full bg-[#1B0088] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-900 transition-colors shadow-sm">
                             <Search size={20} /> Buscar
                         </button>
                     </div>
                 </div>
                 
                 <div className="mt-4 flex items-center gap-2">
                     <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 rounded text-[#1B0088] border-slate-300 focus:ring-[#1B0088]" />
                          <span className="font-medium">Usar Millas Minders y pagar la diferencia</span>
                     </label>
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
                            <label className="block text-sm font-bold text-slate-700 mb-2">Categoría Hotel</label>
                            <div className="space-y-2">
                                {[0, 3, 4, 5].map(stars => (
                                    <label key={stars} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="stars" 
                                            checked={filterStars === stars} 
                                            onChange={() => setFilterStars(stars)}
                                            className="text-[#00A3E0] focus:ring-[#00A3E0]"
                                        />
                                        <span className="flex items-center gap-1">
                                            {stars === 0 ? 'Todas las estrellas' : (
                                                <>
                                                    {Array(stars).fill(0).map((_, i) => <Star key={i} size={14} className="fill-orange-400 text-orange-400" />)}
                                                    <span className="text-slate-500 ml-1">o más</span>
                                                </>
                                            )}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 space-y-6">
                    {filtered.map(pkg => (
                        <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow group">
                            <div className="w-full sm:w-64 h-48 sm:h-auto bg-slate-200 relative overflow-hidden shrink-0 flex items-center justify-center">
                                <img src={pkg.image} alt={pkg.destinationCity || pkg.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 left-2 bg-[#ED1650] text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                                    Paquete
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-[#1B0088] mb-1">{pkg.name}</h3>
                                        <div className="flex bg-slate-100 px-2 py-1 rounded-md text-xs font-bold text-slate-600 gap-1 items-center">
                                            {Array(Math.max(0, Math.floor(pkg.hotelRating || 3))).fill(0).map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                                        </div>
                                    </div>

                                    <div className="text-sm text-slate-500 mb-3 font-medium">Desde {pkg.originCity} hacia {pkg.destinationCity || pkg.destination}</div>

                                    <div className="flex gap-4 text-sm text-slate-600 mb-4 bg-slate-50 p-2 rounded-lg inline-flex border border-slate-100">
                                        <div className="flex items-center gap-1 font-medium"><Plane size={16} className="text-[#00A3E0]" /> Vuelo Directo</div>
                                        <div className="flex items-center gap-1 font-medium"><HotelIcon size={16} className="text-[#00A3E0]" /> {pkg.nights} Noches</div>
                                    </div>
                                    
                                    <p className="text-sm text-slate-500 line-clamp-2">{pkg.description}</p>
                                </div>
                                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
                                    <div>
                                        <div className="text-xs text-slate-400 line-through">USD {(pkg.priceUSD * 1.3).toFixed(0)}</div>
                                        <div className="text-2xl font-bold text-[#ED1650]">USD {pkg.priceUSD.toFixed(0)}</div>
                                        <div className="text-xs text-slate-500 font-medium">por persona</div>
                                    </div>
                                    <button 
                                        onClick={() => handleSelect(pkg)}
                                        className="bg-[#ED1650] text-white px-6 py-2.5 rounded-full font-bold hover:bg-rose-700 transition shadow-md hover:shadow-lg"
                                    >
                                        MÁS OPCIONES
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {filtered.length === 0 && (
                        <div className="text-center p-12 bg-slate-50 rounded-2xl border border-slate-200">
                            <Briefcase size={32} className="text-slate-400 mx-auto mb-4" />
                            <h3 className="font-bold text-slate-700 mb-2">No hay paquetes con estos filtros</h3>
                            <button onClick={() => setFilterStars(0)} className="text-[#00A3E0] font-bold">Borrar filtros</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
