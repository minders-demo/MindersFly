import { useEffect } from 'react';
import { } from '../../lib/amplitude';
import { useNavigate, useSearchParams } from 'react-router';
import { AlertCircle, ArrowLeft, Headphones } from 'lucide-react';
import { errorConfig } from '../../lib/errorSimulator';

export const CheckoutErrorPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get('code') || 'APP_500_INTERNAL_ERROR';

    const errDetail = errorConfig.find(e => e.code === code) || errorConfig[3];

    useEffect(() => {

        // Actual error event was fired in the step before
    }, []);

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="text-[#ED1650]" size={48} />
            </div>
            
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2">Lo sentimos, hubo un problema</h1>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">No pudimos procesar tu solicitud en este momento. Esto es una demo, así que puedes intentar de nuevo simulando otro método u limpiando errores.</p>

            <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl mb-8 text-left inline-block w-full max-w-lg mx-auto shadow-sm">
                <div className="mb-2">
                    <span className="text-xs font-bold text-orange-800 bg-orange-200 px-2 py-1 rounded inline-block mb-3">ERROR SIMULADO</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{errDetail.msg}</h3>
                <p className="text-sm font-mono text-slate-500">Code: {errDetail.code}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                    onClick={() => navigate('/checkout/payment')}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-[#1B0088] text-white rounded-full font-bold hover:bg-indigo-900 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Intentar pago nuevamente
                </button>
            </div>
        </div>
    );
};
