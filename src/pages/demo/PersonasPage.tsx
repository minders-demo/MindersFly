import { useEffect, useState } from 'react';
import { useUser, useMarket } from '../../context/AppContext';
import { MARKETS } from '../../data/markets';
import { mockData } from '../../data/generators';
import { identifyUser, trackEvent } from '../../lib/amplitude';
import { UserCircle, Check } from 'lucide-react';
import { User } from '../../types/user';

export const PersonasPage = () => {
    const { user, loginUser, logout } = useUser();
    const { setMarket } = useMarket();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelectPersona = (p: User) => {
        loginUser(p, 'demo_persona_switch');
        
        // Match market
        const market = MARKETS.find(m => m.market === p.market);
        if (market) {
            setMarket(market);
        }

        trackEvent('Persona Changed', {
            new_persona_tier: p.user_tier || p.tier,
            new_persona_country: p.country,
            new_persona_email: p.email
        });
        
        // Show success briefly (could use a toast in a real app)
        alert(`Cambiado a ${p.first_name} ${p.last_name} (${p.user_tier || p.tier})`);
    };

    const handleClearPersona = () => {
        logout();
        trackEvent('Persona Cleared');
        alert('Sesión cerrada. Ahora eres un usuario anónimo.');
    };

    const filteredUsers = mockData.users.filter(u => 
        u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.user_tier || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.country || '').toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 50); // Show up to 50

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <UserCircle className="text-[#17A673]" size={32} />
                <h1 className="text-3xl font-bold text-[#1B0088]">Personas Demo</h1>
            </div>
            
            <p className="text-slate-600 mb-8 max-w-3xl">
                Cambia de perfil rápidamente para ver cómo cambian las probabilidades de error, el mercado, y los datos enviados a Amplitude.
            </p>

            <div className="flex gap-4 mb-8">
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, país, o tier..." 
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00A3E0]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                    onClick={handleClearPersona}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-bold mix-blend-multiply"
                >
                    Anónimo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((u: any) => {
                    const isSelected = user?.email === u.email;
                    return (
                        <div key={u.id} className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${isSelected ? 'border-[#17A673] bg-[#17A673]/5 ring-1 ring-[#17A673]' : 'border-slate-200 bg-white hover:border-[#00A3E0]'}`}>
                            <div className="mb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">{u.first_name} {u.last_name}</h3>
                                    {isSelected && <Check size={20} className="text-[#17A673]" />}
                                </div>
                                <div className="text-sm text-slate-500 mb-1">{u.email}</div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="px-2 py-1 text-xs font-bold uppercase rounded bg-slate-100 text-slate-700">{u.country}</span>
                                    <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${
                                        u.user_tier === 'top_tier' || u.tier === 'black' ? 'bg-slate-800 text-white' : 
                                        u.user_tier === 'premium' || u.tier === 'platinum' ? 'bg-[#ED1650] text-white' : 
                                        'bg-blue-100 text-[#1B0088]'
                                    }`}>
                                        {u.user_tier || u.tier}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleSelectPersona(u)}
                                className={`w-full py-2 rounded-lg font-bold text-sm ${isSelected ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-[#1B0088] text-white hover:bg-indigo-900'}`}
                                disabled={isSelected}
                            >
                                {isSelected ? 'Persona Actual' : 'Usar Persona'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
