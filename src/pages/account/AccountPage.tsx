import { useEffect } from 'react';
import { } from '../../lib/amplitude';
import { useUser } from '../../context/AppContext';
import { useNavigate } from 'react-router';
import { User, LogOut, ArrowLeft, Shield } from 'lucide-react';

export const AccountPage = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    useEffect(() => {

        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#00A3E0] font-bold mb-6 hover:underline">
                 <ArrowLeft size={18} /> Volver
            </button>
            <h1 className="text-3xl font-bold text-[#1B0088] mb-8">Mi Cuenta</h1>
            
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#1B0088] to-indigo-700 p-8 text-white flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0 border-2 border-white/40">
                         <User size={40} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{user.firstName || user.first_name} {user.lastName || user.last_name}</h2>
                        <p className="text-indigo-200">{user.email}</p>
                        {user.isDemoUser && (
                             <div className="mt-2 inline-flex items-center gap-1.5 bg-rose-500/80 text-white text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm border border-rose-400">
                                 <Shield size={12} /> Cuenta Demo Integrada
                             </div>
                        )}
                    </div>
                </div>

                <div className="p-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Información del Perfil</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre</label>
                            <div className="text-slate-800 font-medium">{user.firstName || user.first_name}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Apellido</label>
                            <div className="text-slate-800 font-medium">{user.lastName || user.last_name}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                            <div className="text-slate-800 font-medium">{user.email}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Minders Loyalty ID</label>
                            <div className="text-[#00A3E0] font-bold">{user.loyaltyId || user.loyalty_id || 'N/A'}</div>
                        </div>
                        <div className="sm:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
                             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Amplitude User ID</label>
                             <code className="text-sm text-slate-700 bg-white p-2 rounded border border-slate-200 block break-all font-mono">{user.amplitudeUserId || user.id}</code>
                             <p className="text-xs text-slate-500 mt-1">Este ID se usa para unificar tu comportamiento en Amplitude de forma persistente.</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-rose-600 font-bold hover:bg-rose-50 px-6 py-3 rounded-xl transition-colors border border-rose-200"
                    >
                        <LogOut size={20} /> Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};
