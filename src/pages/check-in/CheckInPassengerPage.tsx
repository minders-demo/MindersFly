import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { trackEvent, trackError } from '../../lib/amplitude';
import { QrCode, FileCheck2, Search } from 'lucide-react';
import { errorSimulator } from '../../lib/errorSimulator';
import { mockData } from '../../data/generators';

export const CheckInPassengerPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [pnr, setPnr] = useState(bookingId || '');
    const [lastName, setLastName] = useState('');
    const [hasSearched, setHasSearched] = useState(!!bookingId);

    useEffect(() => {

    }, [hasSearched]);

    const handleSearch = (e: any) => {
        e.preventDefault();
        trackEvent('Check-In Searched', { pnr });

        const err = errorSimulator.shouldTriggerError({
            step: 'lookup'
        });

        if (err || pnr.length < 5) {
             trackError({
                error_type: err?.id || 'invalid_pnr',
                error_code: err?.code || 'CHECK_400_INVALID',
                error_message: err?.msg || 'PNR ingresado es inválido para la búsqueda.',
                transaction_step: 'checkin_search',
                route: '/check-in',
                journey_name: 'Check-In',
                journey_step: 'search'
            });
            alert(err?.msg || 'PNR inválido o no encontrado. Intenta con uno generado.');
            // Allow demo override
            if (mockData.trips.length > 0) {
                 setPnr(mockData.trips[0].id);
                 setHasSearched(true);
            }
            return;
        }

        setHasSearched(true);
    };

    const handleConfirm = () => {
        // error sim
        const err = errorSimulator.shouldTriggerError({
            step: 'checkin'
        });

        if (err) {
             trackError({
                error_type: err.id,
                error_code: err.code,
                error_message: err.msg,
                transaction_step: 'checkin_confirm',
                route: '/check-in/passenger',
                journey_name: 'Check-In',
                journey_step: 'passenger_confirmation'
            });
            alert('Error en check-in: ' + err.msg);
            return;
        }

        trackEvent('Check-In Passenger Confirmed', { 
             pnr: pnr, 
             journey_name: 'Check-In', 
             journey_step: 'passenger_confirmation' 
        });
        navigate(`/check-in/boarding-pass?pnr=${pnr}`);
    };

    if (!hasSearched) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-[#00A3E0]" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-[#1B0088] mb-4">Haz tu check-in</h1>
                <p className="text-slate-600 mb-8">Ingresa tu código de reserva (PNR) y apellido para comenzar.</p>
                
                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            placeholder="Código de Reserva (Ej: X9H7K2)"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00A3E0]"
                            value={pnr}
                            onChange={(e) => setPnr(e.target.value.toUpperCase())}
                            required
                        />
                    </div>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Apellido del pasajero"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00A3E0]"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-[#ED1650] text-white py-3 rounded-full font-bold hover:bg-rose-700 transition-colors"
                    >
                        Buscar Viaje
                    </button>
                    
                    <button 
                        type="button"
                        onClick={(e) => {
                            if(mockData.trips.length > 0) {
                                setPnr(mockData.trips[0].id);
                                setLastName(mockData.trips[0].destination);
                            }
                            setTimeout(() => handleSearch(e), 200);
                        }}
                        className="w-full mt-4 bg-slate-100 text-slate-800 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors text-sm"
                    >
                        Rellenar Auto (Demo)
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FileCheck2 className="text-[#1B0088]" size={40} />
            </div>
            
            <h1 className="text-3xl font-bold text-[#1B0088] mb-4">Confirmación de Check-in</h1>
            <p className="text-slate-600 mb-8">Estamos listos para generar el pase de abordar para la reserva <strong>{pnr}</strong>. Verifica que no lleves artículos prohibidos.</p>

            <div className="bg-white p-6 border border-slate-200 rounded-xl mb-8 text-left text-sm text-slate-700">
                <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <span>Declaro que he leído y comprendido la lista de artículos peligrosos prohibidos en el equipaje de mano y bodega.</span>
                </label>
            </div>

            <button 
                onClick={handleConfirm}
                className="w-full bg-[#1B0088] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-900 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
                <QrCode size={24} />
                Generar Boarding Pass
            </button>
        </div>
    );
};
