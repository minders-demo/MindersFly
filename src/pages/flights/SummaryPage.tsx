import { useEffect } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useBooking } from '../../context/BookingContext';
import { useMarket } from '../../context/AppContext';
import { useNavigate } from 'react-router';
import { CheckCircle2, CreditCard } from 'lucide-react';

export const SummaryPage = () => {
    const { booking, updateBooking } = useBooking();
    const { market } = useMarket();
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    // Calculate totals naively for demo
    const basePrice = booking.outboundFlight?.basePriceUSD || 100;
    const paxCount = booking.passengers.length || 1;
    let multiplier = 1;
    if (booking.outboundFare === 'Light') multiplier = 1.3;
    if (booking.outboundFare === 'Plus') multiplier = 1.8;
    if (booking.outboundFare === 'Top') multiplier = 2.5;

    const subtotal = basePrice * multiplier * paxCount;
    const bagsTotal = (booking.bags?.length || 0) * 45;
    const fees = subtotal * 0.15;
    const total = subtotal + bagsTotal + fees;

    const handleCheckout = () => {
        updateBooking({
            totalAmount: total,
            subtotal,
            fees,
            bagsTotal,
            currency: market.currency
        });

        trackEvent('Checkout Started', { total_amount: total, currency: market.currency });
        navigate('/checkout/payment');
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-8">Revisa y confirma tu viaje</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Flight summary */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Vuelo de Ida</h2>
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                            <div className="flex-1 text-center sm:text-left w-full">
                                <div className="text-2xl font-bold text-[#1B0088]">{booking.searchConfig?.origin}</div>
                                <div className="text-sm text-slate-500">Origen</div>
                            </div>
                            <div className="flex shrink-0 w-full sm:w-auto items-center justify-center">
                                <div className="h-px bg-slate-300 w-16"></div>
                                <div className="px-3 bg-slate-100 text-xs font-bold text-slate-500 rounded-full py-1">Directo</div>
                                <div className="h-px bg-slate-300 w-16"></div>
                            </div>
                            <div className="flex-1 text-center sm:text-right w-full">
                                <div className="text-2xl font-bold text-[#1B0088]">{booking.searchConfig?.destination}</div>
                                <div className="text-sm text-slate-500">Destino</div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-sm text-slate-600">
                            <div><span className="font-bold text-slate-800">Fecha:</span> {booking.searchConfig?.departureDate}</div>
                            <div><span className="font-bold text-slate-800">Vuelo:</span> {booking.outboundFlight?.flightNumber}</div>
                            <div><span className="font-bold text-slate-800">Tarifa:</span> {booking.outboundFare}</div>
                        </div>
                    </div>

                    {/* Passenger summary */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Pasajeros</h2>
                        <div className="space-y-3">
                            {booking.passengers.map((p, i) => (
                                <div key={p.id} className="flex justify-between items-center text-sm">
                                    <div>
                                        <span className="font-bold text-slate-700">{p.first_name} {p.last_name}</span>
                                        <span className="text-slate-500 text-xs block">{p.document_type.toUpperCase()}: {p.document_number}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-slate-700">Asiento: {booking.seats.find(s => s.paxId === p.id)?.seat || 'No asignado'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Price Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 sticky top-24">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Detalle de pago</h2>
                        
                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Vuelos ({paxCount} adulto{paxCount>1?'s':''})</span>
                                <span className="font-bold text-slate-800">{market.currency} {subtotal.toFixed(2)}</span>
                            </div>
                            {bagsTotal > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Equipaje extra ({booking.bags.length})</span>
                                    <span className="font-bold text-slate-800">{market.currency} {bagsTotal.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-slate-600">Tasas e impuestos</span>
                                <span className="font-bold text-slate-800">{market.currency} {fees.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-4 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-slate-800 text-lg">Total Final</span>
                                <span className="text-3xl font-bold text-[#1B0088]">{market.currency} {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            className="w-full flex items-center justify-center gap-2 bg-[#17A673] text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
                        >
                            <CreditCard size={20} />
                            Ir a Pagar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
