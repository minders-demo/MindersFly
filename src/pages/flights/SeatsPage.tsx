import { useEffect, useState } from 'react';
import { trackEvent, trackError } from '../../lib/amplitude';
import { useMarket, useUser } from '../../context/AppContext';
import { useBooking } from '../../context/BookingContext';
import { useNavigate } from 'react-router';
import { errorSimulator } from '../../lib/errorSimulator';

export const SeatsPage = () => {
    const { market } = useMarket();
    const { user } = useUser();
    const { booking, updateBooking } = useBooking();
    const navigate = useNavigate();

    const [selectedSeats, setSelectedSeats] = useState<Record<string, string>>({}); // paxId -> seat

    // Dummy seat map generator
    const rows = 20;
    const cols = ['A', 'B', 'C', '', 'D', 'E', 'F'];

    useEffect(() => {

    }, []);

    const handleSeatSelect = (seatId: string) => {
        // error simulation on seat select
        const err = errorSimulator.shouldTriggerError({
            step: 'seat_selection',
            userTier: user?.user_tier
        });

        if (err) {
            trackError({
                error_type: err.id,
                error_code: err.code,
                error_message: err.msg,
                transaction_step: 'seat_selection',
                route: '/flights/seats'
            });
            alert('Ese asiento acaba de ser ocupado. Por favor selecciona otro.');
            return;
        }

        const paxKeys = booking.passengers.map(p => p.id);
        const paxWithoutSeat = paxKeys.find(k => !selectedSeats[k]);
        
        if (paxWithoutSeat) {
            setSelectedSeats(prev => ({ ...prev, [paxWithoutSeat]: seatId }));
            trackEvent('Seat Selected', { seat_number: seatId, passenger_id: paxWithoutSeat });
        }
    };

    const isSeatSelected = (seatId: string) => Object.values(selectedSeats).includes(seatId);

    const handleContinue = () => {
        // We will just store the seats and move on
        updateBooking({ seats: Object.entries(selectedSeats).map(([paxId, seat]) => ({ paxId, seat })) });
        
        // Add upsell generic logic, next is bags
        navigate('/flights/bags');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2 text-center">Elige tu asiento</h1>
            <p className="text-slate-500 mb-8 text-center">Viaja más cómodo seleccionando tu asiento favorito.</p>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Airplane fuselage */}
                <div className="bg-white rounded-[40px] border-4 border-slate-200 p-8 pt-20 shadow-xl overflow-x-auto mx-auto w-[340px] shrink-0 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-slate-200 rounded-b-full opacity-50"></div>
                    
                    <div className="space-y-4">
                        {Array.from({ length: rows }).map((_, r) => (
                            <div key={r} className="flex gap-2 justify-center">
                                <div className="w-6 text-center text-xs font-bold text-slate-400 self-center">{r + 1}</div>
                                {cols.map((c, i) => {
                                    if (c === '') return <div key={i} className="w-4"></div>;
                                    const seatId = `${r+1}${c}`;
                                    const isPremium = r < 5;
                                    const selected = isSeatSelected(seatId);
                                    
                                    return (
                                        <button 
                                            key={c}
                                            onClick={() => handleSeatSelect(seatId)}
                                            className={`w-10 h-10 rounded-t-lg rounded-b-sm font-bold text-xs flex flex-col items-center justify-center transition-colors shadow-sm
                                                ${selected ? 'bg-[#ED1650] text-white border-b-4 border-rose-800' : 
                                                  isPremium ? 'bg-blue-100 text-[#1B0088] hover:bg-blue-200 border-b-4 border-blue-300' : 
                                                  'bg-slate-100 text-slate-600 hover:bg-slate-200 border-b-4 border-slate-300'}
                                            `}
                                        >
                                            {c}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex-1 w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Tus Asientos</h3>
                    
                    <div className="space-y-3 mb-6">
                        {booking.passengers.map((p, i) => {
                            const seat = selectedSeats[p.id];
                            return (
                                <div key={p.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">{p.first_name} {p.last_name}</div>
                                        <div className="text-xs text-slate-500">Pasajero {i+1}</div>
                                    </div>
                                    {seat ? (
                                        <div className="bg-[#1B0088] text-white w-10 h-10 rounded-md flex items-center justify-center font-bold">
                                            {seat}
                                        </div>
                                    ) : (
                                        <div className="text-xs font-bold text-[#00A3E0] bg-blue-50 px-2 py-1 rounded">PENDIENTE</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-xs text-slate-500 mb-6">El precio final del asiento depende de tu tarifa y categoría de socio. En esta demo figurará como incluido o añadido genéricamente.</p>

                    <button 
                        onClick={handleContinue}
                        className="w-full bg-[#ED1650] text-white px-8 py-3 rounded-full font-bold hover:bg-rose-700 transition-colors"
                    >
                        Continuar
                    </button>
                    <button 
                        onClick={handleContinue}
                        className="w-full mt-3 text-[#1B0088] font-bold py-2 hover:bg-slate-50 rounded-full"
                    >
                        Omitir y asignar en el check-in
                    </button>
                </div>
            </div>
        </div>
    );
};
