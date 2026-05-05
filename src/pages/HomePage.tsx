import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plane, Tag, Hotel, Car, Shield, Settings, Bug, UserCircle, ChevronRight } from 'lucide-react';
import { } from '../lib/amplitude';
import { FlightSearchWidget } from '../components/flights/FlightSearchWidget';
import { mockData } from '../data/generators';
import { useMarket } from '../context/AppContext';

export const HomePage = () => {
    const { market } = useMarket();
    const navigate = useNavigate();
    const [destinationFilter, setDestinationFilter] = useState('Destinos playeros');
    const [showAllDest, setShowAllDest] = useState(false);

    useEffect(() => {

    }, []);

    const tabs = [
        { name: 'Vuelos', icon: Plane, path: '/' }, 
        { name: 'Paquetes', icon: Tag, path: '/travel/packages/search' },
        { name: 'Alojamientos', icon: Hotel, path: '/travel/hotels/search' },
        { name: 'Autos', icon: Car, path: '/travel/cars/search' },
        { name: 'Asistencia', icon: Shield, path: '/travel/assistance/search' },
    ];

    const formatUSD = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount) + ' USD';
    };

    const getCityCode = (name: string) => {
        const map: Record<string, string> = {
            'Cartagena': 'CTG', 'Miami': 'MIA', 'Madrid': 'MAD', 'Lima': 'LIM',
            'Ciudad de México': 'MEX', 'Buenos Aires': 'EZE', 'Santiago': 'SCL',
            'Río de Janeiro': 'GIG', 'San Andrés': 'ADZ', 'Cancún': 'CUN',
            'Punta Cana': 'PUJ', 'Medellín': 'MDE', 'Bogotá': 'BOG',
            'Quito': 'UIO', 'Guayaquil': 'GYE', 'Montevideo': 'MVD',
            'Asunción': 'ASU', 'La Paz': 'LPB', 'Santa Cruz': 'VVI',
            'Panamá City': 'PTY', 'San José': 'SJO', 'San Salvador': 'SAL',
            'Guatemala City': 'GUA', 'Santo Domingo': 'SDQ', 'San Juan': 'SJU',
            'La Habana': 'HAV'
        };
        return map[name] || 'MIA';
    };

    const destinationTypes = ['Destinos playeros', 'Aventuras urbanas', 'Vida nocturna', 'Joyas arquitectónicas de LATAM', 'Naturaleza'];
    let filteredDestinations = mockData.destinations.filter(d => d.type === destinationFilter);
    if (!showAllDest) {
        filteredDestinations = filteredDestinations.slice(0, 4);
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero Section & Search */}
            <div className="bg-[#1B0088] pt-12 pb-40 px-4 relative">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 text-center md:text-left">
                        ¿A dónde quieres volar hoy?
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10">
                <div className="bg-white rounded-t-2xl flex overflow-x-auto border-b border-slate-200">
                    {tabs.map((tab, idx) => (
                        <Link 
                            key={tab.name} 
                            to={tab.path}
                            className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition-colors whitespace-nowrap font-bold ${idx === 0 ? 'text-[#ED1650] border-b-4 border-[#ED1650]' : 'text-slate-600 hover:text-[#ED1650]'}`}
                        >
                            <tab.icon size={20} />
                            <span>{tab.name}</span>
                        </Link>
                    ))}
                </div>
                <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-xl">
                        <FlightSearchWidget compact={false} />
                </div>
            </div>

            {/* Descubre tu próximo viaje */}
            <div className="max-w-6xl mx-auto px-4 mt-20">
                <h2 className="text-3xl font-bold text-[#1B0088] mb-6">Descubre tu próximo viaje</h2>
                
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {destinationTypes.map(type => (
                        <button 
                            key={type}
                            onClick={() => setDestinationFilter(type)}
                            className={`px-5 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-all border-2 ${destinationFilter === type ? 'bg-[#1B0088] text-white border-[#1B0088]' : 'bg-transparent text-slate-600 border-slate-300 hover:border-[#1B0088]'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {filteredDestinations.map(dest => (
                        <div key={dest.id} onClick={() => navigate(`/flights/results?origin=SCL&destination=${getCityCode(dest.name)}&tripType=round_trip`)} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer">
                            <div className="h-48 overflow-hidden relative">
                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {dest.recommended && (
                                    <div className="absolute top-3 left-3 bg-[#ED1650] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Recomendado
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{dest.flightType}</div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4">{dest.name}</h3>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-xs text-slate-500 font-medium">Precio final desde</div>
                                        <div className="text-2xl font-bold text-[#ED1650]">{formatUSD(dest.priceUSD)}</div>
                                    </div>
                                    <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B0088] group-hover:bg-[#1B0088] group-hover:text-white transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    {!showAllDest && (
                        <button onClick={() => setShowAllDest(true)} className="font-bold text-[#1B0088] bg-transparent border-2 border-[#1B0088] rounded-full px-8 py-3 hover:bg-[#1B0088] hover:text-white transition-colors">
                            Ver más destinos
                        </button>
                    )}
                </div>
            </div>

            {/* No te lo pierdas (Promos) */}
            <div className="max-w-6xl mx-auto px-4 mt-24">
                <h2 className="text-3xl font-bold text-[#1B0088] mb-8">No te lo pierdas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div onClick={() => navigate('/travel/packages/search')} className="bg-[#1B0088] rounded-2xl p-8 text-white relative overflow-hidden group cursor-pointer group-hover:-translate-y-1 transition-all shadow-md">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-3">Arma tu paquete a medida</h3>
                                <p className="text-white/80 mb-8 font-medium">Vuelo + Hotel con descuentos exclusivos pagando con millas.</p>
                            </div>
                            <div>
                                <button className="bg-white text-[#1B0088] px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-100 transition-colors">Ver paquetes</button>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 opacity-20 w-48 h-48 bg-white rounded-full blur-3xl transform group-hover:scale-110 transition-transform"></div>
                    </div>
                    
                    <div onClick={() => navigate('/travel/assistance/search')} className="bg-[#00A3E0] rounded-2xl p-8 text-white relative overflow-hidden group cursor-pointer group-hover:-translate-y-1 transition-all shadow-md">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-3">Tu viaje siempre protegido</h3>
                                <p className="text-white/80 mb-8 font-medium">Agrega asistencia en viaje y viaja con total tranquilidad.</p>
                            </div>
                            <div>
                                <button className="bg-white text-[#00A3E0] px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-100 transition-colors">Cotizar asistencia</button>
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 opacity-20 w-48 h-48 bg-white rounded-full blur-3xl transform group-hover:scale-110 transition-transform"></div>
                    </div>
                    
                    <div onClick={() => navigate('/travel/cars/search')} className="bg-[#ED1650] rounded-2xl p-8 text-white relative overflow-hidden group cursor-pointer group-hover:-translate-y-1 transition-all shadow-md">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-3">Muévete a tu ritmo</h3>
                                <p className="text-white/80 mb-8 font-medium">Alquila un auto con hasta 20% de descuento y acumula millas.</p>
                            </div>
                            <div>
                                <button className="bg-[#1B0088] text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-opacity-90 transition-colors">Buscar autos</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Paquetes */}
            <div className="bg-white mt-24 py-20 border-y border-slate-200">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[#1B0088] mb-2">Elige un paquete ideal para tus vacaciones</h2>
                    <p className="text-slate-500 font-medium mb-8">Vuelo + Hotel con descuentos exclusivos</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockData.packages.slice(0, 8).map(pkg => (
                            <div key={pkg.id} onClick={() => navigate(`/travel/packages/detail/${pkg.id}`)} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group cursor-pointer hover:shadow-lg transition-all flex flex-col justify-between">
                                <div>
                                    <div className="h-44 overflow-hidden relative">
                                        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[#1B0088] text-xs font-bold px-2 py-1 rounded">⭐ {pkg.rating}</div>
                                    </div>
                                    <div className="p-5 pb-0">
                                        <h3 className="font-bold text-lg text-slate-800 line-clamp-2 leading-tight mb-2">{pkg.name}</h3>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">{pkg.nights} noches • Vuelo + Hotel</div>
                                    </div>
                                </div>
                                <div className="p-5 pt-2 flex items-end justify-between">
                                    <div>
                                        <div className="text-xs font-medium text-slate-500">Precio final por persona</div>
                                        <div className="text-2xl font-bold text-[#1B0088]">{formatUSD(pkg.priceUSD)}</div>
                                    </div>
                                    <button className="text-[#ED1650] font-bold text-sm hover:underline">Ver más</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 text-center">
                        <button onClick={() => navigate('/travel/packages/search')} className="font-bold text-[#1B0088] border-2 border-[#1B0088] rounded-full px-12 py-3 hover:bg-[#1B0088] hover:text-white transition-colors">
                            Ver más paquetes
                        </button>
                    </div>
                </div>
            </div>

            {/* Alojamientos */}
            <div className="max-w-6xl mx-auto px-4 mt-24">
                <h2 className="text-3xl font-bold text-[#1B0088] mb-8">Reserva tu alojamiento</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockData.hotels.slice(0, 8).map(hotel => (
                        <div key={hotel.id} onClick={() => navigate(`/travel/hotels/detail/${hotel.id}`)} className="relative rounded-2xl overflow-hidden group cursor-pointer h-64 md:h-72">
                            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1B0088]/90 via-[#1B0088]/30 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-5 w-full">
                                <div className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-1">{hotel.city}</div>
                                <h3 className="text-white font-bold text-xl leading-tight mb-2 line-clamp-2">{hotel.name}</h3>
                                <div className="text-white font-bold mb-1">{formatUSD(hotel.pricePerNightUSD)} <span className="text-white/70 text-sm font-normal">/ noche</span></div>
                                <div className="text-xs text-white/80">⭐ {hotel.rating}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-10 text-center">
                    <button onClick={() => navigate('/travel/packages/search')} className="font-bold text-[#1B0088] border-2 border-[#1B0088] rounded-full px-12 py-3 hover:bg-[#1B0088] hover:text-white transition-colors">
                        Ver más opciones de hospedaje
                    </button>
                </div>
            </div>

            {/* Más opciones para tu viaje */}
            <div className="max-w-6xl mx-auto px-4 mt-24">
                <h2 className="text-3xl font-bold text-[#1B0088] mb-8">Más opciones para tu viaje</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div onClick={() => navigate('/travel/hotels/search')} className="bg-white border text-left border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                         <div className="w-12 h-12 rounded-full bg-[#1B0088]/10 text-[#1B0088] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Hotel size={24} />
                         </div>
                         <h3 className="font-bold text-lg text-slate-800 mb-2">Hoteles</h3>
                         <p className="text-sm text-slate-600 mb-4 h-10">Acumula Millas en todas tus reservas de alojamiento.</p>
                         <button className="text-[#ED1650] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Buscar <ChevronRight size={16} /></button>
                    </div>
                    <div onClick={() => navigate('/travel/cars/search')} className="bg-white border text-left border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                         <div className="w-12 h-12 rounded-full bg-[#ED1650]/10 text-[#ED1650] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Car size={24} />
                         </div>
                         <h3 className="font-bold text-lg text-slate-800 mb-2">Autos</h3>
                         <p className="text-sm text-slate-600 mb-4 h-10">Descuentos exclusivos y acumulación de Millas.</p>
                         <button className="text-[#ED1650] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Buscar <ChevronRight size={16} /></button>
                    </div>
                    <div onClick={() => navigate('/travel/assistance/search')} className="bg-white border text-left border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                         <div className="w-12 h-12 rounded-full bg-[#00A3E0]/10 text-[#00A3E0] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Shield size={24} />
                         </div>
                         <h3 className="font-bold text-lg text-slate-800 mb-2">Asistencia</h3>
                         <p className="text-sm text-slate-600 mb-4 h-10">Viaja protegido ante cualquier imprevisto de salud.</p>
                         <button className="text-[#ED1650] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Cotizar <ChevronRight size={16} /></button>
                    </div>
                    <div onClick={() => navigate('/travel/packages/search')} className="bg-white border text-left border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                         <div className="w-12 h-12 rounded-full bg-[#17A673]/10 text-[#17A673] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Tag size={24} />
                         </div>
                         <h3 className="font-bold text-lg text-slate-800 mb-2">Paquetes</h3>
                         <p className="text-sm text-slate-600 mb-4 h-10">Ahorra personalizando tu vuelo + hotel en un solo lugar.</p>
                         <button className="text-[#ED1650] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Ver Más <ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Destinos mas buscados */}
            <div className="max-w-6xl mx-auto px-4 mt-24 mb-16">
                <h2 className="text-3xl font-bold text-[#1B0088] mb-10 text-center">Destinos más buscados</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
                    {mockData.destinations.slice(0, 8).map((dest, i) => (
                        <div key={dest.id} onClick={() => navigate(`/flights/results?origin=SCL&destination=${getCityCode(dest.name)}&tripType=round_trip`)} className="text-center group cursor-pointer flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md group-hover:border-[#00A3E0] group-hover:shadow-lg transition-all relative group-hover:-translate-y-1">
                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                                <div className="absolute top-0 right-0 bg-[#ED1650] text-white w-7 h-7 flex items-center justify-center font-bold text-sm rounded-full -mt-1 -mr-1 shadow-md border-2 border-white">{i + 1}</div>
                            </div>
                            <div className="font-bold text-sm text-slate-700 group-hover:text-[#1B0088] transition-colors">{dest.name}</div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};
