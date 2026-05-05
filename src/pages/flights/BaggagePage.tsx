import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useMarket } from '../../context/AppContext';
import { useBooking } from '../../context/BookingContext';
import { useNavigate } from 'react-router';
import { Briefcase, Info } from 'lucide-react';

export const BaggagePage = () => {
    const { market } = useMarket();
    const { booking, updateBooking } = useBooking();
    const navigate = useNavigate();

    const [bags, setBags] = useState<number>(0);
    const unitPrice = 45.00;

    useEffect(() => {

        trackEvent('Baggage Step Viewed', { 
            journey_name: 'Flight Booking',
            journey_step: 'baggage',
            step_order: 8,
            booking_flow_id: booking.bookingFlowId
        });
    }, [booking.bookingFlowId]);

    const handleContinue = () => {
        if (bags > 0) {
            trackEvent('Baggage Selected', { 
                quantity: bags,
                unit_price: unitPrice,
                total_baggage_amount: bags * unitPrice,
                currency: market.currency,
                journey_name: 'Flight Booking',
                journey_step: 'baggage',
                step_order: 8,
                booking_flow_id: booking.bookingFlowId
            });
            updateBooking({ bags: Array(bags).fill(1) });
        } else {
            trackEvent('Ancillary Skipped', {
                journey_name: 'Flight Booking',
                journey_step: 'baggage',
                step_order: 8,
                booking_flow_id: booking.bookingFlowId
            });
        }
        
        navigate('/flights/summary');
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2 text-center">Mejora tu equipaje</h1>
            <p className="text-slate-500 mb-8 text-center max-w-lg mx-auto">Tu tarifa {booking.outboundFare} ya incluye ciertos beneficios, pero puedes agregar más aquí si lo necesitas.</p>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                        <Briefcase size={40} className="text-[#00A3E0]" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Maleta de Bodega 23kg</h3>
                        <p className="text-slate-600 text-sm mb-4">Lleva todo lo que necesites sin preocuparte por el espacio. Entrégala en el counter antes de tu vuelo.</p>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <Info size={16} className="text-slate-400" />
                            <span className="text-xs text-slate-500">Máximo 158cm lineales (alto + ancho + largo)</span>
                        </div>
                    </div>
                    <div className="shrink-0 text-center md:text-right border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 w-full md:w-auto">
                        <div className="text-2xl font-bold text-[#1B0088] mb-1">{market.currency} {unitPrice.toFixed(2)}</div>
                        <div className="text-xs text-slate-500 mb-4">por maleta / tramo</div>
                        
                        <div className="flex items-center justify-center gap-4">
                            <button 
                                onClick={() => setBags(Math.max(0, bags - 1))}
                                className="w-10 h-10 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 flex items-center justify-center transition-colors"
                            >-</button>
                            <span className="text-xl font-bold text-slate-800 w-4 text-center">{bags}</span>
                            <button 
                                onClick={() => setBags(bags + 1)}
                                className="w-10 h-10 rounded-full bg-[#1B0088] text-white font-bold hover:bg-indigo-900 flex items-center justify-center transition-colors"
                            >+</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-4 border-t border-slate-200 gap-4">
                <button type="button" onClick={() => navigate(-1)} className="text-[#1B0088] font-bold px-6 py-2 hover:bg-slate-100 rounded-full transition-colors w-full sm:w-auto">
                    Volver
                </button>
                <button onClick={handleContinue} className="bg-[#ED1650] w-full sm:w-auto text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-rose-700 transition-shadow shadow-md">
                    {bags > 0 ? `Agregar y Continuar` : 'Continuar sin agregar'}
                </button>
            </div>
        </div>
    );
};
