import { useEffect, useState } from 'react';
import { errorSimulator, errorConfig } from '../../lib/errorSimulator';
import { trackError } from '../../lib/amplitude';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useUser, useMarket } from '../../context/AppContext';

export const ErrorLabPage = () => {
    const [activeErrors, setActiveErrors] = useState<string[]>([]);
    const { user } = useUser();
    const { market } = useMarket();

    const loadErrors = () => {
        setActiveErrors(errorSimulator.getForcedErrors());
    };

    useEffect(() => {
        loadErrors();
        window.addEventListener('demo_errors_updated', loadErrors);
        return () => window.removeEventListener('demo_errors_updated', loadErrors);
    }, []);

    const toggleError = (id: string, active: boolean) => {
        if (active) {
            errorSimulator.clearForcedError(id);
        } else {
            errorSimulator.forceError(id);
        }
    };

    const handleTestError = (err: any) => {
        trackError({
            error_type: err.id,
            error_code: err.code,
            error_message: err.msg,
            payment_method: market.payment_methods[0], // fallback
            transaction_step: 'test_lab',
            user_tier: user?.tier || user?.user_tier || 'regular',
            country: market.country,
            market: market.market,
            language: market.language,
            journey_name: 'Error Lab Test',
            journey_step: 'manual_trigger',
            route: '/demo/error-lab',
            amount: 99.99,
            currency: market.currency,
            retry_available: true,
            recoverable: false,
        });
        alert(`Error de prueba enviado a Amplitude: ${err.code}`);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-8">
                <AlertTriangle className="text-[#FFB020]" size={32} />
                <h1 className="text-3xl font-bold text-[#1B0088]">Error Simulator Lab</h1>
            </div>
            
            <p className="text-slate-600 mb-8">
                Activa errores específicos para verificar que la aplicación está capturándolos y enviándolos correctamente a Amplitude.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {errorConfig.map(err => {
                    const isActive = activeErrors.includes(err.id);
                    return (
                        <div 
                            key={err.id} 
                            className={`p-6 rounded-xl border flex flex-col justify-between transition-all ${
                                isActive ? 'border-[#ED1650] bg-[#ED1650]/5 ring-1 ring-[#ED1650]' : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                        >
                            <div className="mb-4">
                                <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-[#ED1650]' : 'text-slate-800'}`}>
                                    {err.id}
                                </h3>
                                <p className="text-slate-500 text-sm mb-2 font-mono text-xs">{err.code}</p>
                                <p className="text-slate-600 text-sm">{err.msg}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleError(err.id, isActive)}
                                    className={`flex-1 px-4 py-2 text-sm font-bold rounded-lg ${
                                        isActive 
                                            ? 'bg-[#ED1650] text-white hover:bg-rose-700' 
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {isActive ? 'Desactivar Error' : 'Forzar Error'}
                                </button>
                                <button
                                    onClick={() => handleTestError(err)}
                                    className="px-4 py-2 text-sm font-bold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                    Probar Evento
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {activeErrors.length > 0 && (
                <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
                    <span className="text-orange-800 font-medium text-sm">
                        Hay simulaciones de error activas. Recuerda desactivarlas para flujos normales.
                    </span>
                    <button 
                        onClick={() => activeErrors.forEach(id => errorSimulator.clearForcedError(id))}
                        className="text-orange-800 hover:underline text-sm font-bold flex items-center gap-1"
                    >
                        <Trash2 size={16} /> Limpiar todos
                    </button>
                </div>
            )}
        </div>
    );
};
