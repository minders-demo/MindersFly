import { useEffect, useState } from 'react';
import { trackEvent, trackError } from '../../lib/amplitude';
import { useMarket, useUser } from '../../context/AppContext';
import { useBooking } from '../../context/BookingContext';
import { useNavigate } from 'react-router';
import { errorSimulator } from '../../lib/errorSimulator';
import { validators } from '../../lib/validators';
import { formatCardNumber, formatCardExpiry } from '../../lib/formatters';
import { useFormStarted } from '../../lib/useFormStarted';
import { useBooking } from '../../context/BookingContext';
import type { BookingState } from '../../context/BookingContext';

export const CheckoutPaymentPage = () => {
    useFormStarted('Payment Form', 'Checkout');
    const { market } = useMarket();
    const { user } = useUser();
    const { booking, updateBooking } = useBooking();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState(market.payment_methods[0] || 'credit_card');
    const [errorFields, setErrorFields] = useState<string[]>([]);
    
    // Simulate credit card details for form completeness
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });

    useEffect(() => {
        // Detectar la categoría de producto desde la ruta + datos del booking.
        // CheckoutPaymentPage se reusa para todos los flujos.
        const path = window.location.pathname;
        let productCategory: BookingState['productCategory'] = 'flight';
        if (path.includes('/cars/checkout')) productCategory = 'car';
        else if (path.includes('/packages/checkout')) productCategory = 'package';
        else if (path.includes('/assistance/checkout')) productCategory = 'assistance';
        else if (path.includes('/hotels/checkout')) productCategory = 'hotel';
        // Hoteles también navegan a '/checkout/payment'; si no hay vuelo, asumimos hotel
        else if (!booking.outboundFlight) productCategory = 'hotel';

        if (booking.productCategory !== productCategory) {
            updateBooking({ productCategory });
        }

        trackEvent('Checkout Payment Viewed', {
            journey_name: 'Checkout',
            journey_step: 'payment',
            step_order: 1,
            booking_flow_id: booking.bookingFlowId,
            checkout_id: booking.checkoutId,
            market: market.market,
            currency: market.currency,
            product_category: productCategory,
        });
    }, [booking.bookingFlowId, booking.checkoutId, market.market, market.currency]);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (paymentMethod === 'credit_card') {
             const error_fields = [];
             if (!validators.validateName(cardDetails.name)) error_fields.push('name');
             if (!validators.validateCreditCardNumber(cardDetails.number).valid) error_fields.push('number');
             if (!validators.validateCardExpiry(cardDetails.expiry)) error_fields.push('expiry');
             const brand = validators.validateCreditCardNumber(cardDetails.number).brand;
             if (!validators.validateCVV(cardDetails.cvc, brand as any)) error_fields.push('cvc');

             if (error_fields.length > 0) {
                 trackEvent('Form Validation Failed', {
                    form_name: 'Payment Form',
                    error_fields,
                    journey_name: 'Checkout',
                    journey_step: 'payment',
                    payment_method: paymentMethod
                 });
                 // In a real app we'd show the errors on screen, but here we just alert or trace.
                 // We will update the state to show the inline errors
                 setErrorFields(error_fields);
                 return;
             }
             setErrorFields([]);
        }

        // Error simulator check before doing logic
        const err = errorSimulator.shouldTriggerError({
            step: 'payment',
            userTier: user?.user_tier,
            paymentMethod: paymentMethod,
            walletBalance: user?.miles_balance || 0, // Using miles as proxy for wallet for the demo
            amountStr: 100 // Mock
        });

        trackEvent('Payment Information Submitted', {
            payment_method: paymentMethod,
            payment_gateway: 'minders_mock_gateway'
        });

        if (err) {
            // Simulated transaction error
            trackError({
                error_type: err.id,
                error_code: err.code,
                error_message: err.msg,
                payment_method: paymentMethod,
                transaction_step: 'payment_processing',
                route: '/checkout/payment'
            });
            // We pass the error code to the processing page to render correctly
            navigate(`/checkout/processing?status=error&code=${err.code}`);
        } else {
            // Proceed to processing and success
            navigate('/checkout/processing?status=success');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2">Ingresa tu medio de pago</h1>
            <p className="text-slate-500 mb-8">Estás realizando una reserva simulada. No hay cobros reales.</p>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Métodos disponibles en {market.country}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {market.payment_methods.map(method => (
                        <label key={method} className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === method ? 'border-[#00A3E0] bg-[#00A3E0]/5 ring-1 ring-[#00A3E0]' : 'border-slate-200 hover:border-slate-300'}`}>
                            <input 
                                type="radio" 
                                name="payment_method" 
                                value={method} 
                                checked={paymentMethod === method}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-5 h-5 text-[#00A3E0] bg-gray-100 border-gray-300 focus:ring-[#00A3E0]" 
                            />
                            <span className="ml-3 font-bold text-slate-700 capitalize break-words">{method.replace('_', ' ')}</span>
                            {method === 'latam_wallet' && user?.miles_balance && (
                                <span className="absolute right-4 text-xs font-bold text-slate-400">Saldo: {user.miles_balance}</span>
                            )}
                        </label>
                    ))}
                </div>

                {paymentMethod === 'credit_card' && (
                    <div className="space-y-4 mb-8 pt-6 border-t border-slate-100" data-private>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nombre en la tarjeta</label>
                            <input 
                                className={`w-full p-3 border rounded-xl focus:outline-none ${errorFields.includes('name') ? 'border-red-500' : 'border-slate-300 focus:border-[#00A3E0]'}`}
                                placeholder="Como aparece en la tarjeta"
                                value={cardDetails.name}
                                onChange={e => setCardDetails({...cardDetails, name: e.target.value})}
                                required
                            />
                            {errorFields.includes('name') && <p className="text-red-500 text-xs mt-1">Ingresa un nombre válido</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Número de tarjeta</label>
                            <input 
                                inputMode="numeric"
                                maxLength={19}
                                className={`w-full p-3 border rounded-xl focus:outline-none ${errorFields.includes('number') ? 'border-red-500' : 'border-slate-300 focus:border-[#00A3E0]'}`}
                                placeholder="0000 0000 0000 0000"
                                value={cardDetails.number}
                                onChange={e => setCardDetails({...cardDetails, number: formatCardNumber(e.target.value)})}
                                required
                            />
                            {errorFields.includes('number') && <p className="text-red-500 text-xs mt-1">Ingresa un número de tarjeta válido</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Vencimiento</label>
                                <input 
                                    inputMode="numeric"
                                    maxLength={5}
                                    className={`w-full p-3 border rounded-xl focus:outline-none ${errorFields.includes('expiry') ? 'border-red-500' : 'border-slate-300 focus:border-[#00A3E0]'}`}
                                    placeholder="MM/AA"
                                    value={cardDetails.expiry}
                                    onChange={e => setCardDetails({...cardDetails, expiry: formatCardExpiry(e.target.value)})}
                                    required
                                />
                                {errorFields.includes('expiry') && <p className="text-red-500 text-xs mt-1">Fecha de vencimiento inválida</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">CVV</label>
                                <input 
                                    className={`w-full p-3 border rounded-xl focus:outline-none ${errorFields.includes('cvc') ? 'border-red-500' : 'border-slate-300 focus:border-[#00A3E0]'}`}
                                    placeholder="123"
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={cardDetails.cvc}
                                    onChange={e => setCardDetails({...cardDetails, cvc: e.target.value.replace(/\D/g, '')})}
                                    required
                                />
                                {errorFields.includes('cvc') && <p className="text-red-500 text-xs mt-1">CVV inválido</p>}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button type="submit" className="bg-[#17A673] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-emerald-700 transition-shadow shadow-md">
                        Pagar Ahora (Simulado)
                    </button>
                </div>
            </form>
        </div>
    );
};
