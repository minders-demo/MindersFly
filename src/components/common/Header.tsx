import { Link } from 'react-router';
import { PlaneTakeoff, Menu, UserCircle, LogOut } from 'lucide-react';
import { useMarket, useUser } from '../../context/AppContext';

export const Header = () => {
    const { market } = useMarket();
    const { user, logout } = useUser();

    return (
        <header className="fixed top-0 w-full bg-[#1B0088] text-white z-50 shadow-md h-16">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="md:hidden p-2 hover:bg-white/10 rounded-md">
                        <Menu size={24} />
                    </button>
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:text-[#00A3E0] transition-colors">
                        <PlaneTakeoff size={28} className="text-[#ED1650]" />
                        <span>Minders Fly</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6 font-medium text-sm">
                    <Link to="/flights/search" className="hover:text-[#00A3E0] transition-colors">Vuelos</Link>
                    <Link to="/travel/packages/search" className="hover:text-[#00A3E0] transition-colors">Paquetes</Link>
                    <Link to="/my-trips" className="hover:text-[#00A3E0] transition-colors">Mis viajes</Link>
                    <Link to="/check-in" className="hover:text-[#00A3E0] transition-colors">Check-in</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link to="/market-selector" className="hidden text-sm md:flex items-center hover:text-[#00A3E0] transition-colors">
                        {market.country}
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/account" className="flex items-center gap-2 hover:text-[#00A3E0] transition-colors text-sm font-medium">
                                <span className="hidden sm:inline">Hola, {user.firstName || user.first_name || 'Amigo'}</span>
                                <div className="w-8 h-8 rounded-full bg-[#ED1650] flex items-center justify-center font-bold text-white text-xs border border-rose-400 shadow-sm">
                                    {(user.firstName || user.first_name || 'A').charAt(0)}{(user.lastName || user.last_name || 'A').charAt(0)}
                                </div>
                            </Link>
                            <button onClick={logout} className="p-1 hover:text-[#ED1650] transition-colors" title="Cerrar sesión">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 hover:text-[#00A3E0] transition-colors text-sm font-medium">
                            <UserCircle size={24} />
                            <span className="hidden sm:inline">Ingresar</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};
