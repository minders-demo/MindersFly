import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Bug, Settings, UserCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { trackEvent } from '../../lib/amplitude';

export const DemoToolsBar = () => {
    const [visible, setVisible] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const stored = localStorage.getItem('minders_fly_demo_tools_visible');
        if (stored === 'false') {
            setVisible(false);
        }
    }, []);

    useEffect(() => {
        if (visible) {
            trackEvent('Demo Tools Viewed', {
                route: location.pathname,
                journey_name: 'Demo Tools',
                is_demo: true
            });
        }
    }, [visible, location.pathname]);

    const toggleVisible = () => {
        const newState = !visible;
        setVisible(newState);
        localStorage.setItem('minders_fly_demo_tools_visible', newState ? 'true' : 'false');
        
        trackEvent(newState ? 'Demo Tools Shown' : 'Demo Tools Hidden', {
            route: location.pathname,
            journey_name: 'Demo Tools',
            is_demo: true
        });
    };

    const handleToolClick = (toolName: string) => {
        trackEvent('Demo Tool Clicked', {
            tool_name: toolName,
            route: location.pathname,
            journey_name: 'Demo Tools',
            journey_step: toolName,
            is_demo: true
        });
    };

    if (!visible) {
        return (
            <div className="w-full bg-slate-50 border-t border-slate-200 py-2 px-4 flex justify-end">
                <button 
                    onClick={toggleVisible}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                >
                    Mostrar demo tools <ChevronUp size={14} />
                </button>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-50 border-t border-slate-200 py-3 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 tracking-tight">Demo tools</span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link 
                        to="/demo/event-debugger" 
                        onClick={() => handleToolClick('Event Debugger')}
                        className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:border-[#00A3E0] hover:text-[#00A3E0] transition-colors"
                    >
                        <Bug size={14} />
                        Event Debugger
                    </Link>
                    <Link 
                        to="/demo/error-lab" 
                        onClick={() => handleToolClick('Error Simulator')}
                        className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:border-[#FFB020] hover:text-[#FFB020] transition-colors"
                    >
                        <Settings size={14} />
                        Error Simulator
                    </Link>
                    <Link 
                        to="/demo/personas" 
                        onClick={() => handleToolClick('Personas')}
                        className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:border-[#17A673] hover:text-[#17A673] transition-colors"
                    >
                        <UserCircle size={14} />
                        Personas
                    </Link>
                </div>

                <button 
                    onClick={toggleVisible}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                >
                    Ocultar demo tools <ChevronDown size={14} />
                </button>
            </div>
        </div>
    );
};
