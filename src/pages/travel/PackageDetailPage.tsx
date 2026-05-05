import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { mockData } from '../../data/generators';
import { useMarket } from '../../context/AppContext';
import { Plane, Hotel, Check, Info, ArrowLeft, Star, MapPin } from 'lucide-react';
import { trackEvent } from '../../lib/amplitude';

export const PackageDetailPage = () => {
    const { packageId } = useParams();
    const { market } = useMarket();
    const navigate = useNavigate();
    
    const [pkg, setPkg] = useState<any>(null);
    const [selectedRoom, setSelectedRoom] = useState<string>('standard');
    
    useEffect(() => {
        let found = mockData.packages.find(p => p.id === packageId);
        
        if (!found) {
            try {
                const existingFallbackStr = sessionStorage.getItem('minders_fly_fallback_pkgs') || '[]';
                const existingFallbacks = JSON.parse(existingFallbackStr);
                found = existingFallbacks.find((p: any) => p.id === packageId);
            } catch(e) {}
        }
        
        if (found) {
            setPkg(found);

            trackEvent('Package Detail Viewed', {
                package_id: found.id,
                destination: found.destinationCity || found.destination
            });
        }
    }, [packageId]);

    if (!pkg) return <div className="p-12 text-center">Paquete no encontrado</div>;

    const handleContinue = () => {
        trackEvent('Package Room Selected', {
            package_id: pkg.id,
            room_type: selectedRoom
        });
        navigate('/travel/packages/checkout');
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#00A3E0] font-bold mb-6 hover:underline">
                 <ArrowLeft size={18} /> Volver a resultados
            </button>

            <h1 className="text-3xl font-bold text-[#1B0088] mb-2">{pkg.name}</h1>
            <p className="text-slate-500 mb-6 flex items-center gap-2">
                <MapPin size={16} /> Vuelo + Hotel • {pkg.nights} noches en {pkg.destinationCity}, {pkg.destinationCountry}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="relative h-72 rounded-2xl overflow-hidden shadow-sm">
                        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold text-slate-800 text-sm">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            {pkg.hotelRating} {pkg.hotelName}
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-[#1B0088] mb-4 flex items-center gap-2">
                            <Plane size={24} className="text-[#00A3E0]"/>
                            Vuelos Incluidos
                        </h2>
                        <div className="text-slate-600 space-y-2">
                            <p className="flex items-center gap-2 font-medium">Vuelo Directo: {pkg.originCity} ({pkg.originCode}) a {pkg.destinationCity} ({pkg.destinationCode})</p>
                            <p className="flex items-center gap-2"><Check size={16} className="text-emerald-500"/> Vuelo pre-seleccionado</p>
                            <p className="flex items-center gap-2"><Check size={16} className="text-emerald-500"/> Equipaje de mano incluido (10 kg)</p>
                            <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 mt-4 text-sm text-blue-800">
                                <Info size={16} className="mt-0.5 shrink-0" />
                                <p>Los vuelos para tu ciudad de origen han sido seleccionados automáticamente para coincidir con reservar tu alojamiento.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-[#1B0088] mb-4 flex items-center gap-2">
                            <Hotel size={24} className="text-[#00A3E0]" />
                            Hotel Seleccionado: {pkg.hotelName}
                        </h2>
                        <div className="space-y-4">
                            <label className={`block border p-4 rounded-xl cursor-pointer transition ${selectedRoom === 'standard' ? 'border-[#00A3E0] bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" checked={selectedRoom === 'standard'} onChange={() => setSelectedRoom('standard')} className="text-[#00A3E0] focus:ring-[#00A3E0]" />
                                        <div>
                                            <div className="font-bold text-slate-800">Habitación Estándar</div>
                                            <div className="text-sm text-slate-500">1 Cama doble o 2 individuales</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-slate-600">Incluido</div>
                                </div>
                            </label>

                            <label className={`block border p-4 rounded-xl cursor-pointer transition ${selectedRoom === 'deluxe' ? 'border-[#00A3E0] bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" checked={selectedRoom === 'deluxe'} onChange={() => setSelectedRoom('deluxe')} className="text-[#00A3E0] focus:ring-[#00A3E0]" />
                                        <div>
                                            <div className="font-bold text-slate-800">Habitación Deluxe con Vistas</div>
                                            <div className="text-sm text-slate-500">1 Cama King • Vistas a la ciudad/mar</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-emerald-600">+ USD 50 /noche</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-4 text-lg">Resumen del viaje</h3>
                        
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-sm text-slate-600">
                             <div className="flex justify-between mb-2">
                                  <span>Fechas:</span>
                                  <span className="font-bold">12 Abr - 15 Abr</span>
                             </div>
                             <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                                  <span>Duración:</span>
                                  <span className="font-bold">{pkg.nights} Noches</span>
                             </div>
                        </div>

                        <div className="space-y-2 mb-6 text-sm text-slate-600">
                            <div className="flex justify-between">
                                <span>Paquete (1 adulto)</span>
                                <span>USD {pkg.priceUSD}</span>
                            </div>
                            {selectedRoom === 'deluxe' && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Upgrade Habitación</span>
                                    <span>USD {50 * pkg.nights}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Impuestos y tasas</span>
                                <span>USD {Math.round(pkg.priceUSD * 0.15)}</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-200 mb-6">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-slate-800">Total a pagar</span>
                                <span className="text-3xl font-bold text-[#ED1650]">
                                    USD {pkg.priceUSD + (selectedRoom === 'deluxe' ? 50 * pkg.nights : 0) + Math.round(pkg.priceUSD * 0.15)}
                                </span>
                            </div>
                        </div>
                        <button onClick={handleContinue} className="w-full bg-[#1B0088] text-white py-3.5 rounded-xl font-bold hover:bg-indigo-900 shadow-md hover:shadow-xl transition text-lg">
                            Continuar al Pago
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
