import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { trackEvent } from '../../lib/amplitude';
import { useMarket } from '../../context/AppContext';
import { MapPin, Settings2, BaggageClaim, RefreshCw, QrCode, ArrowUpCircle, Plane } from 'lucide-react';

export const TripDetailPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<any>(null);

    useEffect(() => {

        const activeTrips = JSON.parse(localStorage.getItem('minders_fly_active_trips') || '[]');
        const found = activeTrips.find((t: any) => t.pnr === bookingId);
        if (found) {
            setTrip(found);
            trackEvent('Trip Detail Viewed', { pnr: found.pnr, origin: found.origin, destination: found.destination });
        }
    }, [bookingId]);

    if (!trip) return <div className="p-12 text-center">Cargando reserva...</div>;

    const managementOptions = [
        { id: 'checkin', name: 'Hacer Check-In', icon: QrCode, route: `/check-in/${trip.pnr}`, color: 'bg-[#17A673] text-white', highlight: true },
        { id: 'upgrade', name: 'Postula a Upgrade', icon: ArrowUpCircle, route: `/my-trips/upgrade/${trip.pnr}`, color: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
        { id: 'add_bags', name: 'Agregar Equipaje', icon: BaggageClaim, route: `/my-trips/add-bags/${trip.pnr}`, color: 'bg-white text-slate-700 border border-slate-200' },
        { id: 'change_flight', name: 'Cambiar Vuelo', icon: RefreshCw, route: `/my-trips/change-flight/${trip.pnr}`, color: 'bg-white text-slate-700 border border-slate-200' },
    ];

    const handleOptionClick = (opt: any) => {
        trackEvent('Manage Trip Option Clicked', { pnr: trip.pnr, option_name: opt.id });
        navigate(opt.route);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button onClick={() => navigate('/my-trips')} className="text-[#00A3E0] font-medium text-sm mb-6 hover:underline flex items-center gap-1">← Volver a Mis Viajes</button>
            
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1B0088] mb-2 flex items-center gap-3">
                        Vuelo a {trip.destination}
                        <span className="text-xs bg-[#17A673]/10 text-[#17A673] px-2 py-1 rounded-full uppercase tracking-wider align-middle">Confirmado</span>
                    </h1>
                    <p className="text-slate-500 font-mono">PNR: {trip.pnr}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="font-bold text-slate-700">{trip.departureDate}</div>
                        <div className="text-sm font-bold bg-[#1B0088] text-white px-3 py-1 rounded">Vuelo MF-101</div>
                    </div>
                    <div className="p-8">
                        <div className="flex items-center gap-6">
                            <div className="text-center w-24">
                                <div className="text-3xl font-bold text-[#1B0088]">10:00</div>
                                <div className="text-slate-500 font-bold">{trip.origin}</div>
                            </div>
                            <div className="flex-1 flex flex-col items-center">
                                <div className="text-xs text-slate-400 mb-2">Duración: 2h 45m</div>
                                <div className="w-full relative h-px bg-slate-300">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300">
                                        <Plane size={24} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center w-24">
                                <div className="text-3xl font-bold text-[#1B0088]">12:45</div>
                                <div className="text-slate-500 font-bold">{trip.destination}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {managementOptions.map(opt => (
                        <button 
                            key={opt.id}
                            onClick={() => handleOptionClick(opt)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl font-bold transition-all ${opt.color} hover:-translate-y-0.5 hover:shadow-md`}
                        >
                            <span className="flex items-center gap-3"><opt.icon size={20} /> {opt.name}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><MapPin size={20} className="text-[#ED1650]"/> Recomendaciones en tu destino</h3>
                <p className="text-slate-600 text-sm mb-4">¿Ya tienes todo listo para tu llegada a {trip.destination}? Descubre opciones de traslados, hoteles y actividades.</p>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/travel/hotels/search')} className="text-sm font-bold text-[#00A3E0]">Ver Hoteles</button>
                    <button onClick={() => navigate('/travel/cars/search')} className="text-sm font-bold text-[#00A3E0]">Ver Autos</button>
                </div>
            </div>
        </div>
    );
};
