import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useNavigate } from 'react-router';
import { Search, Hotel, Car, Shield, Wifi, Plane } from 'lucide-react';

export const TravelHubPage = () => {
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    const services = [
        { id: 'packages', title: 'Vuelo + Hotel', description: 'Ahorra reservando tu paquete completo', icon: Plane, route: '/travel/packages/search', color: 'bg-emerald-50 text-emerald-600' },
        { id: 'hotels', title: 'Hoteles', description: 'Encuentra el alojamiento ideal', icon: Hotel, route: '/travel/hotels/search', color: 'bg-blue-50 text-blue-600' },
        { id: 'cars', title: 'Autos', description: 'Recorre tu destino a tu propio ritmo', icon: Car, route: '/travel/cars/search', color: 'bg-orange-50 text-orange-600' },
        { id: 'assistance', title: 'Asistencia de Viaje', description: 'Viaja protegido ante cualquier imprevisto', icon: Shield, route: '/travel/assistance/search', color: 'bg-rose-50 text-rose-600' },
        { id: 'esim', title: 'eSIM', description: 'Mantente conectado en todo el mundo', icon: Wifi, route: '/travel/esim', color: 'bg-indigo-50 text-indigo-600' },
    ];

    const handleServiceClick = (service: any) => {
        trackEvent('Travel Service Selected', { service_name: service.id });
        navigate(service.route);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
             <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-[#1B0088] mb-4">Añade más a tu viaje</h1>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg">Encuentra hoteles, autos, seguros y mucho más, todo en un solo lugar y con beneficios exclusivos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div 
                        key={service.id} 
                        onClick={() => handleServiceClick(service)}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-lg hover:border-[#00A3E0] transition-all group"
                    >
                        <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <service.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#00A3E0] transition-colors">{service.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-16 bg-[#1B0088] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#ED1650]/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-xl text-center md:text-left mb-8 md:mb-0">
                    <h3 className="text-3xl font-bold mb-4">¿Ya tienes una reserva?</h3>
                    <p className="text-blue-100 mb-6">Ingresa a Mis Viajes para agregar extras a tu vuelo como maletas o mejores asientos a un precio especial.</p>
                    <button onClick={() => navigate('/my-trips')} className="bg-white text-[#1B0088] px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition w-full sm:w-auto">
                        Ir a Mis Viajes
                    </button>
                </div>
                
                <div className="relative z-10">
                    <Hotel size={120} className="text-white/20" />
                </div>
            </div>
        </div>
    );
};
