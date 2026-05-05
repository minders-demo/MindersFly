import { useEffect } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useSearchParams } from 'react-router';
import { Plane, QrCode } from 'lucide-react';

export const BoardingPassPage = () => {
    const [searchParams] = useSearchParams();
    const pnr = searchParams.get('pnr') || 'MFXXXX';

    useEffect(() => {

        trackEvent('Boarding Pass Generated', { pnr });
    }, [pnr]);

    return (
        <div className="max-w-md mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-center text-[#1B0088] mb-8">Tu Tarjeta de Embarque</h1>

            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-32 bg-[#1B0088]"></div>
                
                <div className="relative p-8 pt-10 text-white flex justify-between items-center mb-4">
                    <div className="text-3xl font-bold">BOG</div>
                    <Plane size={24} className="text-[#00A3E0]" />
                    <div className="text-3xl font-bold">SCL</div>
                </div>

                <div className="relative p-8 pt-0 space-y-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase">Pasajero</div>
                                <div className="font-bold text-slate-800">Minders Demo</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-slate-400 uppercase">Vuelo</div>
                                <div className="font-bold text-[#ED1650]">MF 101</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase">Embarque</div>
                                <div className="text-xl font-bold text-slate-800">09:15</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-slate-400 uppercase">Puerta</div>
                                <div className="text-xl font-bold text-slate-800">A12</div>
                            </div>
                             <div className="text-right">
                                <div className="text-xs font-bold text-slate-400 uppercase">Asiento</div>
                                <div className="text-xl font-bold text-[#1B0088]">12B</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t-[3px] border-dashed border-slate-200 mx-6 my-2 relative">
                    <div className="absolute -left-10 -top-4 w-8 h-8 bg-[#F5F7FA] rounded-full"></div>
                    <div className="absolute -right-10 -top-4 w-8 h-8 bg-[#F5F7FA] rounded-full"></div>
                </div>

                <div className="p-8 text-center flex flex-col items-center">
                     <div className="text-xs font-bold text-slate-400 uppercase mb-2">Reserva</div>
                     <div className="font-mono text-2xl tracking-[0.25em] font-bold text-slate-800 mb-6">{pnr}</div>
                     <QrCode size={160} className="text-slate-800 border-4 border-slate-100 rounded-xl" />
                     <p className="mt-4 text-xs text-slate-500 tracking-wide">Presenta este código en la puerta</p>
                </div>
            </div>
        </div>
    );
};
