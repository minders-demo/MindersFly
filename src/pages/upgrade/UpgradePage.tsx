import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useMarket, useUser } from '../../context/AppContext';
import { useNavigate } from 'react-router';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { errorSimulator } from '../../lib/errorSimulator';

export const UpgradePage = () => {
    const { market } = useMarket();
    const { user } = useUser();
    const navigate = useNavigate();

    const [pnr, setPnr] = useState('');
    const [lastName, setLastName] = useState('');
    const [bidAmount, setBidAmount] = useState<number>(100);

    const [step, setStep] = useState(0); // 0: search, 1: offer, 2: success

    useEffect(() => {

    }, []);

    const handleSearch = (e: any) => {
        e.preventDefault();
        
        // Simular error en la validación
        const err = errorSimulator.shouldTriggerError({
            step: 'upgrade'
        });

        if (err) {
             alert('Error simulado: Tu pasaje no aplica para Upgrade en este momento.');
             return;
        }

        trackEvent('Upgrade Eligibility Checked', { pnr, eligibility_status: 'eligible' });
        setStep(1);
    };

    const handleSubmitOffer = () => {
        trackEvent('Upgrade Offer Submitted', { pnr, offer_amount: bidAmount, currency: market.currency });
        setStep(2);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            
            {step === 0 && (
                <div className="text-center">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ArrowUpRight className="text-[#1B0088]" size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-[#1B0088] mb-4">Postula a un Upgrade de Cabina</h1>
                    <p className="text-slate-600 mb-8 max-w-lg mx-auto">Viaja en Premium Economy o Business Class haciendo una oferta. Averigua si tu vuelo califica.</p>

                    <form onSubmit={handleSearch} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 max-w-md mx-auto text-left">
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Código de Reserva (PNR)</label>
                                <input 
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#1B0088]"
                                    placeholder="Ej: ABCD12"
                                    value={pnr}
                                    onChange={e => setPnr(e.target.value.toUpperCase())}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Apellido</label>
                                <input 
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#1B0088]"
                                    placeholder="Apellido del pasajero"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-[#ED1650] text-white px-6 py-3 rounded-full font-bold hover:bg-rose-700 transition">
                            Revisar Elegibilidad
                        </button>
                    </form>
                </div>
            )}

            {step === 1 && (
                <div>
                     <h1 className="text-3xl font-bold text-[#1B0088] mb-2 text-center">Haz tu oferta</h1>
                     <p className="text-slate-600 mb-8 text-center">¡Tu vuelo {pnr} califica para un Upgrade a Cabina Premium!</p>

                     <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 max-w-xl mx-auto">
                        <h3 className="font-bold text-slate-800 mb-4">¿Cuánto estás dispuesto a pagar por tramo?</h3>
                        
                        <div className="text-center py-8">
                            <div className="text-5xl font-bold text-[#1B0088] mb-2">{market.currency} {bidAmount}</div>
                            <div className="text-sm text-slate-500 mb-8">Pago mediante tarjeta de crédito solo si tu oferta es aceptada.</div>

                            <input 
                                type="range" 
                                min={50} max={500} step={10} 
                                value={bidAmount}
                                onChange={(e) => setBidAmount(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ED1650]"
                            />
                            <div className="flex justify-between text-xs font-bold text-slate-400 mt-2">
                                <span>Mínimo: {market.currency} 50</span>
                                <span>Excelente: {market.currency} 300+</span>
                            </div>
                        </div>

                        <ul className="text-sm text-slate-600 space-y-2 mb-8 bg-slate-50 p-4 rounded-xl">
                            <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#17A673] shrink-0" /> Asiento más amplio y reclinable</li>
                            <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#17A673] shrink-0" /> Trato preferencial en aeropuerto</li>
                            <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#17A673] shrink-0" /> Comida y bebida premium</li>
                        </ul>

                        <button onClick={handleSubmitOffer} className="w-full bg-[#1B0088] text-white px-6 py-4 rounded-full font-bold hover:bg-indigo-900 transition shadow-md text-lg">
                            Confirmar Oferta
                        </button>
                     </div>
                </div>
            )}

            {step === 2 && (
                 <div className="text-center max-w-lg mx-auto py-12">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-[#17A673]" size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-[#1B0088] mb-4">¡Oferta recibida!</h1>
                    <p className="text-slate-600 mb-8">Analizaremos la disponibilidad de la cabina y te informaremos por correo electrónico entre 2 y 12 horas antes de tu vuelo si tu oferta de <strong>{market.currency} {bidAmount}</strong> ha sido aceptada.</p>
                    
                    <button onClick={() => navigate('/my-trips')} className="bg-[#1B0088] text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-900 transition">
                        Volver a Mis Viajes
                    </button>
                 </div>
            )}

        </div>
    );
};
