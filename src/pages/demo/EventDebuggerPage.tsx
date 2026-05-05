import { useEffect, useState } from 'react';
import { eventDebugger } from '../../lib/eventDebugger';
import { TrackedEvent } from '../../types/analytics';
import { Trash2 } from 'lucide-react';

export const EventDebuggerPage = () => {
    const [events, setEvents] = useState<TrackedEvent[]>([]);
    const apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY;
    const isLocalOnly = !apiKey || apiKey === 'YOUR_AMPLITUDE_API_KEY';

    useEffect(() => {
        setEvents(eventDebugger.getEvents());

        const handleNewEvent = (e: any) => {
            setEvents(prev => [e.detail, ...prev]);
        };
        const handleClear = () => {
            setEvents([]);
        };

        window.addEventListener('demo_event_logged', handleNewEvent);
        window.addEventListener('demo_events_cleared', handleClear);

        return () => {
            window.removeEventListener('demo_event_logged', handleNewEvent);
            window.removeEventListener('demo_events_cleared', handleClear);
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1B0088] mb-2">Event Debugger</h1>
                    <p className="text-slate-600">
                        Estado de Amplitude: {isLocalOnly 
                            ? <span className="text-[#FFB020] font-bold">Inactivo (Sólo Local)</span> 
                            : <span className="text-[#17A673] font-bold">Activo</span>}
                    </p>
                </div>
                <button 
                    onClick={() => eventDebugger.clearEvents()}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#ED1650] bg-[#ED1650]/10 rounded-md hover:bg-[#ED1650]/20 transition-colors"
                >
                    <Trash2 size={16} />
                    Limpiar
                </button>
            </div>

            <div className="bg-white border text-left border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto text-left">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#1B0088] text-white text-left">
                            <tr>
                                <th className="px-4 py-3 text-left">Time</th>
                                <th className="px-4 py-3 text-left">Event Name</th>
                                <th className="px-4 py-3 text-left">Journey</th>
                                <th className="px-4 py-3 text-left">Payload</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-left">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                        No hay eventos registrados. Navega por la app para generar eventos.
                                    </td>
                                </tr>
                            ) : (
                                events.map(e => (
                                    <tr key={e.id} className="hover:bg-slate-50 text-left relative group">
                                        <td className="px-4 py-3 align-top whitespace-nowrap text-slate-500 min-w-32">
                                            {new Date(e.timestamp).toLocaleTimeString()}
                                        </td>
                                        <td className="px-4 py-3 align-top font-bold text-slate-800 break-words min-w-40">
                                            {e.event_name}
                                        </td>
                                        <td className="px-4 py-3 align-top min-w-32">
                                            <div className="text-slate-800">{e.properties.journey_name || '-'}</div>
                                            <div className="text-slate-500 text-xs">{e.properties.journey_step || '-'}</div>
                                        </td>
                                        <td className="px-4 py-3 align-top w-full">
                                            <details className="cursor-pointer max-w-full">
                                                <summary className="text-[#00A3E0] font-medium hover:underline inline-block pb-1">Ver properties</summary>
                                                <pre className="mt-2 text-xs bg-slate-100 p-3 rounded-md overflow-x-auto border border-slate-200 font-mono text-slate-700 max-w-sm sm:max-w-md lg:max-w-2xl break-all whitespace-pre-wrap">
                                                    {JSON.stringify(e.properties, null, 2)}
                                                </pre>
                                            </details>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
