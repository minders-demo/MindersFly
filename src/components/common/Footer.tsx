import { Link } from 'react-router';
import { Plane } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-[#10004F] text-white pt-16 pb-8 border-t-4 border-[#ED1650]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-white p-2 rounded-lg text-[#1B0088]">
                                <Plane size={24} className="transform -rotate-45" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Minders Fly</span>
                        </div>
                        <p className="text-white/60 text-sm mb-6 leading-relaxed">
                            Una experiencia de demostración de Minders.io para entender cómo el análisis de comportamiento y la experimentación digital pueden transformar la industria de viajes.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-wide">Acerca de Minders Fly</h4>
                        <ul className="space-y-4">
                            <li><Link to="/demo/event-debugger" className="text-white/70 hover:text-white transition-colors text-sm hover:underline">Información Corporativa</Link></li>
                            <li><Link to="/demo/event-debugger" className="text-white/70 hover:text-white transition-colors text-sm hover:underline">Prensa</Link></li>
                            <li><Link to="/demo/event-debugger" className="text-white/70 hover:text-white transition-colors text-sm hover:underline">Sostenibilidad</Link></li>
                            <li><Link to="/demo/event-debugger" className="text-white/70 hover:text-white transition-colors text-sm hover:underline">Trabaja con nosotros</Link></li>
                            <li><Link to="/demo/event-debugger" className="text-white/70 hover:text-white transition-colors text-sm hover:underline">Relación con inversionistas</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-wide">Sitios Relacionados</h4>
                        <ul className="space-y-4">
                            <li><Link to="/demo/event-debugger" className="text-white/70 hover:text-white transition-colors text-sm hover:underline">Centro de Ayuda</Link></li>
                            <li><Link to="/demo/event-debugger" className="text-white/70 hover:text-white transition-colors text-sm hover:underline">Ventas corporativas y agencias</Link></li>
                            <li><Link to="/demo/event-debugger" className="text-white/70 hover:text-white transition-colors text-sm hover:underline">Mente Maestra - Blog</Link></li>
                            <li><Link to="/demo/event-debugger" className="text-white/70 hover:text-white transition-colors text-sm hover:underline">Minders Pass</Link></li>
                            <li><Link to="/demo/event-debugger" className="text-white/70 hover:text-white transition-colors text-sm hover:underline">Minders Cargo</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-wide">Oficinas Minders</h4>
                        <ul className="space-y-4 text-sm text-white/70">
                            <li>
                                <strong className="text-white block mb-1">Buenos Aires, Argentina</strong>
                                Av. Sta. Fe 2755 Piso 12, C1425
                            </li>
                            <li>
                                <strong className="text-white block mb-1">Bogotá, Colombia</strong>
                                Av. Cra 19 #100-45, Usaquén
                            </li>
                            <li>
                                <strong className="text-white block mb-1">São Paulo, Brasil</strong>
                                Alameda Rio Claro 241, Bela Vista
                            </li>
                            <li>
                                <strong className="text-white block mb-1">CDMX, México</strong>
                                Av. Insurgentes Sur 601, Nápoles
                            </li>
                            <li>
                                <strong className="text-white block mb-1">Madrid, España</strong>
                                Eloy Gonzalo 27. Chamberí
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <span className="text-white/70 text-sm">Síguenos:</span>
                        <a href="https://www.linkedin.com/company/mindersio/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#00A3E0] transition-colors">
                            in
                        </a>
                        <a href="https://www.youtube.com/@minders.latam" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ED1650] transition-colors">
                            yt
                        </a>
                        <a href="https://www.instagram.com/accounts/login/?next=%2Fminders.latam%2F" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 transition-colors">
                            ig
                        </a>
                        <a href="https://minders.io/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1B0088] transition-colors">
                            w
                        </a>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-white/50">
                        <Link to="/" className="hover:text-white transition-colors">Términos de uso</Link>
                        <span>|</span>
                        <Link to="/" className="hover:text-white transition-colors">Política de privacidad</Link>
                        <span>|</span>
                        <span>© 2026 Minders.io - Demo Experience.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
