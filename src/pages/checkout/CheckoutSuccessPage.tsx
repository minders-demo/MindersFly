import { useEffect, useRef } from 'react';
import { trackEvent, trackRevenue } from '../../lib/amplitude';
import { accumulateMiles, getMilesForCategory } from '../../lib/miles';
import { useMarket, useUser } from '../../context/AppContext';
import { useBooking } from '../../context/BookingContext';
import { useNavigate } from 'react-router';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const CheckoutSuccessPage = () => {
    const { booking, clearBooking } = useBooking();
    const { market } = useMarket();
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const pnr = `MF${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const transactionId = `TXN-${Date.now()}`;

    // Guard: evita doble acumulación con React 18 Strict Mode (double-invoke effects)
    const accruedRef = useRef(false);

    useEffect(() => {
        trackRevenue({
            productId: booking.outboundFlight?.flightNumber || 'unknown',
            price: booking.totalAmount || 100,
            quantity: 1,
            currency: booking.currency || market.currency,
            eventProperties: {
                pnr,
                passengers: booking.passengers.length || 1,
                market: market.market,
                route: `${booking.searchConfig?.origin}-${booking.searchConfig?.destination}`,
            },
        });

        const productCategory = booking.productCategory || 'flight';

        trackEvent('Checkout Completed', {
            transaction_id: transactionId,
            pnr,
            total_passengers: booking.passengers.length || 1,
            currency: booking.currency || market.currency,
            revenue: booking.totalAmount || 100,
            price: booking.totalAmount || 100,
            quantity: 1,
            productId: booking.outboundFlight?.flightNumber || 'unknown',
            product_category: productCategory,
        });

        // Acumulación automática de millas — una sola vez por confirmación
        if (!accruedRef.current) {
            accruedRef.current = true;
            const milesAmount = getMilesForCategory(productCategory);
            if (milesAmount > 0) {
                const result = accumulateMiles({
                    miles_amount: milesAmount,
                    partner_origin: 'minders_fly',
                    product_type: productCategory,
                    product_category: productCategory,
                    transaction_id: transactionId,
                    partner_transaction_date: new Date().toISOString(),
                    currency: booking.currency || market.currency,
                    amount_paid: booking.totalAmount || 100,
                    market: market.market,
                });

                // Reflejar el nuevo balance en el estado de React también
                if (user && result.newBalance !== null) {
                    setUser({ ...user, miles_balance: result.newBalance });
                }
            }
        }

        // Persistir el viaje en mock data para "Mis Viajes"
        const newTrip = {
            id: `TRP-${Date.now()}`,
            pnr: pnr,
            origin: booking.searchConfig?.origin,
            destination: booking.searchConfig?.destination,
            status: 'confirmed',
            departureDate: booking.searchConfig?.departureDate,
            passengers: booking.passengers.length || 1,
        };
        const activeTrips = JSON.parse(localStorage.getItem('minders_fly_active_trips') || '[]');
        activeTrips.push(newTrip);
        localStorage.setItem('minders_fly_active_trips', JSON.stringify(activeTrips));

        return () => clearBooking();
    }, []);

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-[#17A673]" size={48} />
            </div>

            <h1 className="text-3xl font-bold text-[#1B0088] mb-2">¡Tu viaje está confirmado!</h1>
            <p className="text-slate-600 mb-8">Te hemos enviado un correo con todos los detalles a tu email registrado.</p>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 text-left">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-6 mb-6">
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Código de Reserva (PNR)</div>
                        <div className="text-4xl font-bold text-slate-800 tracking-wider">{pnr}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Origen</div>
                        <div className="text-lg font-bold text-[#1B0088]">{booking.searchConfig?.origin || 'BOG'}</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Destino</div>
                        <div className="text-lg font-bold text-[#1B0088]">{booking.searchConfig?.destination || 'SCL'}</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Fecha</div>
                        <div className="text-slate-800 font-medium">{booking.searchConfig?.departureDate || 'Pronto'}</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pasajeros</div>
                        <div className="text-slate-800 font-medium">{booking.passengers.length || 1}</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={() => navigate('/my-trips')}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-[#1B0088] text-white rounded-full font-bold hover:bg-indigo-900 transition-colors"
                >
                    Ir a Mis Viajes
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};
