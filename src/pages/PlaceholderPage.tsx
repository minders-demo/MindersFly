import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { } from '../lib/amplitude';

interface PlaceholderProps {
    title: string;
    description: string;
}

export const PlaceholderPage = ({ title, description }: PlaceholderProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

    }, [location.pathname, title]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-4">{title}</h1>
            <p className="text-lg text-slate-600 mb-8">{description}</p>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 max-w-md mx-auto text-left">
                <p className="text-sm text-slate-500 mb-2">Current Route:</p>
                <code className="bg-slate-100 px-3 py-2 rounded-md block w-full overflow-x-auto text-[#ED1650] font-mono text-sm">
                    {location.pathname}
                </code>
            </div>

            <button 
                onClick={() => navigate(-1)} 
                className="px-6 py-2 border-2 border-[#1B0088] text-[#1B0088] rounded-full font-bold hover:bg-[#1B0088] hover:text-white transition-colors"
            >
                Volver
            </button>
        </div>
    );
};
