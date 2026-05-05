import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { trackEvent } from '../../lib/amplitude';
import { motion } from 'motion/react';
import { Plane, CheckCircle, XCircle } from 'lucide-react';

export const CheckoutProcessingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status') || 'success';
    const code = searchParams.get('code');
    
    const [phase, setPhase] = useState(0); // 0 = validating, 1 = bank, 2 = confirming

    useEffect(() => {

        const timers = [
            setTimeout(() => setPhase(1), 1500),
            setTimeout(() => setPhase(2), 3000),
            setTimeout(() => {
                if (status === 'success') {
                    navigate('/checkout/success');
                } else {
                    navigate(`/checkout/error?code=${code}`);
                }
            }, 4500)
        ];

        return () => timers.forEach(clearTimeout);
    }, [navigate, status, code]);

    return (
        <div className="max-w-lg mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col justify-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
                <motion.div 
                    className="absolute inset-0 border-4 border-slate-100 rounded-full"
                />
                <motion.div 
                    className="absolute inset-0 border-4 border-[#1B0088] rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Plane className="text-[#00A3E0]" size={32} />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-[#1B0088] mb-6">Procesando tu reserva</h2>
            
            <div className="space-y-4 max-w-xs mx-auto text-left">
                <div className="flex items-center gap-3 text-slate-600">
                    {phase > 0 ? <CheckCircle size={20} className="text-[#17A673]" /> : <div className="w-5 h-5 border-2 border-slate-300 rounded-full"></div>}
                    <span className={phase > 0 ? 'font-medium text-slate-800' : ''}>Validando información</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                     {phase > 1 ? <CheckCircle size={20} className="text-[#17A673]" /> : <div className="w-5 h-5 border-2 border-slate-300 rounded-full"></div>}
                    <span className={phase > 1 ? 'font-medium text-slate-800' : ''}>Comprobando con la entidad financiera</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 border-2 border-slate-300 rounded-full"></div>
                    <span>Confirmando disponibilidad</span>
                </div>
            </div>
        </div>
    );
};
