import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useNavigate } from 'react-router';
import { Plane, Calendar, ChevronRight } from 'lucide-react';
import { useUser } from '../../context/AppContext';

export const MyTripsPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [trips, setTrips] = useState<any[]>([]);

    useEffect(() => {

        // Load simulated trips from local storage
        const activeTrips = JSON.parse(localStorage.getItem('minders_fly_active_trips') || '[]');
        setTrips(activeTrips.reverse());
    }, []);

    const handleSelectTrip = (trip: any) => {
        trackEvent('Trip Selected For Management', { pnr: trip.pnr, status: trip.status });
        navigate(`/my-trips/detail/${trip.pnr}`);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2">Mis Viajes</h1>
            <p className="text-slate-500 mb-8">Administra tus reservas, cambia vuelos o realiza Check-In.</p>

            {trips.length === 0 ? (
                <div className="bg-slate-50 p-12 text-center rounded-2xl border border-slate-200">
                    <Plane size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No tienes viajes activos</h3>
                    <p className="text-slate-500 mb-6">Parece que aún no tienes reservas asociadas a esta sesión.</p>
                    <button 
                        onClick={() => navigate('/flights/search')}
                        className="bg-[#ED1650] text-white px-8 py-3 rounded-full font-bold hover:bg-rose-700 transition"
                    >
                        Buscar un vuelo
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {trips.map(trip => (
                        <div 
                            key={trip.id} 
                            onClick={() => handleSelectTrip(trip)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-[#00A3E0] transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                                    <Plane className="text-[#00A3E0]" size={24} />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-[#1B0088] mb-1">
                                        {trip.origin} <span className="text-slate-400">→</span> {trip.destination}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1"><Calendar size={14} /> {trip.departureDate || 'Próximamente'}</div>
                                        <div className="font-mono bg-slate-100 px-2 rounded text-slate-600 font-bold">{trip.pnr}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                                <span className="px-3 py-1 bg-[#17A673]/10 text-[#17A673] text-xs font-bold uppercase rounded-full tracking-wide">
                                    {trip.status === 'confirmed' ? 'Confirmado' : trip.status}
                                </span>
                                <ChevronRight className="text-slate-400 group-hover:text-[#00A3E0] transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
