import { useEffect } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useMarket } from '../../context/AppContext';
import { useBooking } from '../../context/BookingContext';
import { useNavigate } from 'react-router';
import { Check, Info } from 'lucide-react';

export const FaresPage = () => {
    const { market } = useMarket();
    const { booking, updateBooking } = useBooking();
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    const handleSelectFare = (fareName: string, priceMult: number) => {
        trackEvent('Fare Selected', {
            fare_name: fareName,
            journey_step: 'fares',
            flight_id: booking.outboundFlight?.id
        });

        updateBooking({ 
            outboundFare: fareName,
             // Hack for demo: just store total base price internally
        });
        
        navigate('/flights/passengers');
    };

    const fares = [
        { name: 'Basic', mult: 1, color: 'border-slate-200', text: 'text-slate-800', desc: 'Vuela ligero, ideal si llevas poco.', features: ['1 Bolso pequeño (bajo asiento)', '❌ Equipaje de mano', '❌ Equipaje de bodega', '❌ Selección de asiento'] },
        { name: 'Light', mult: 1.3, color: 'border-blue-200 bg-blue-50/30', text: 'text-[#1B0088]', desc: 'Lo esencial para tu viaje.', features: ['1 Bolso pequeño', '1 Maleta de mano 10kg', '❌ Equipaje de bodega', 'Asiento aleatorio'] },
        { name: 'Plus', mult: 1.8, color: 'border-[#00A3E0] ring-2 ring-[#00A3E0]/20 bg-[#00A3E0]/5', text: 'text-[#00A3E0]', recommended: true, desc: 'Más comodidad y equipaje.', features: ['1 Bolso pequeño', '1 Maleta de mano 10kg', '1 Maleta bodega 23kg', 'Selección de asiento estándar', 'Cambios con penalidad'] },
        { name: 'Top', mult: 2.5, color: 'border-purple-200 bg-purple-50/50', text: 'text-purple-800', desc: 'Flexibilidad total.', features: ['1 Bolso pequeño', '1 Maleta de mano 10kg', '2 Maletas bodega 23kg', 'Asiento Extra Legroom', 'Cambios y devo gratis', 'Opción Upgrade'] }
    ];

    const basePrice = booking.outboundFlight?.basePriceUSD || 100;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2 text-center">Selecciona tu tarifa</h1>
            <p className="text-slate-500 mb-8 text-center">Elige los beneficios que mejor se adapten a tu viaje.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {fares.map(fare => (
                    <div key={fare.name} className={`relative flex flex-col p-6 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${fare.color}`}>
                        {fare.recommended && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ED1650] text-white text-xs font-bold uppercase tracking-wide py-1 px-3 rounded-full">
                                Recomendada
                            </div>
                        )}
                        <h3 className={`text-2xl font-bold mb-1 ${fare.text}`}>{fare.name}</h3>
                        <p className="text-slate-500 text-sm h-10 mb-6">{fare.desc}</p>
                        
                        <div className="text-3xl font-bold text-slate-800 mb-6">
                            <span className="text-sm font-normal text-slate-500 ">{market.currency} </span>
                            {Math.floor(basePrice * fare.mult)}
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            {fare.features.map(f => (
                                <div key={f} className="flex items-start gap-2 text-sm text-slate-700">
                                    {f.includes('❌') ? '' : <Check size={16} className="text-[#17A673] shrink-0 mt-0.5" />}
                                    <span className={f.includes('❌') ? 'opacity-50' : ''}>{f.replace('❌ ', '')}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => handleSelectFare(fare.name, fare.mult)}
                            className="w-full py-3 rounded-xl font-bold text-slate-800 bg-white border-2 border-slate-200 hover:border-[#1B0088] hover:text-[#1B0088] transition-colors"
                        >
                            Elegir {fare.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
