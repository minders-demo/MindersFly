import { useState, type FormEvent, type MouseEvent } from 'react';
import { trackEvent } from '../lib/amplitude';
import { useUser, useMarket } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router';
import { createFakeUserFromEmail } from '../lib/userIdentity';
import { validators } from '../lib/validators';

export const LoginPage = () => {
    const { loginUser } = useUser();
    const { market } = useMarket();
    const navigate = useNavigate();
    const location = useLocation();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const doLogin = async (email: string, password: string) => {
        if (!validators.validateEmail(email)) {
            alert('Por favor, ingresa un correo válido.');
            return;
        }

        if (!password || password.trim().length < 3) {
            alert('Por favor, ingresa una contraseña (mínimo 3 caracteres).');
            return;
        }

        const fakeUser = await createFakeUserFromEmail(email, {
            countryCode: market.country === 'Colombia' ? '+57' : (market.country === 'Chile' ? '+56' : '+52'),
        });

        const userToLogin = {
            ...fakeUser,
            tier: 'none',
            miles_balance: Math.floor(Math.random() * 5000),
            preferred_airport: market.market === 'CL' ? 'SCL' : 'BOG',
            customer_type: 'leisure',
            country: market.country,
            market: market.market,
            language: market.language,
            user_tier: 'regular'
        };

        loginUser(userToLogin as any, 'email');

        trackEvent('User Logged In', {
            method: 'email',
            success: true,
            user_tier: 'regular',
            market: market.market
        });

        const returnUrl = new URLSearchParams(location.search).get('returnUrl');
        if (returnUrl) {
            navigate(returnUrl);
        } else {
            navigate('/account');
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        doLogin(credentials.email, credentials.password);
    };

    const handleQuickLogin = (e: MouseEvent) => {
        e.preventDefault();
        const demoCreds = { email: 'demo@mail.com', password: 'password123' };
        setCredentials(demoCreds);
        doLogin(demoCreds.email, demoCreds.password);
    };

    return (
        <div className="max-w-md mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-6 text-center">Iniciar Sesión</h1>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <p className="text-slate-600 mb-6 text-center text-sm">Para efectos de la demo, ingresa cualquier correo o dale a "Login Simulado Rápido". Se mantendrá tu identidad.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00A3E0]"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            onBlur={() => trackEvent('Form Field Completed', { field_name: 'email', form_name: 'Login Form' })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00A3E0]"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                            minLength={3}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#1B0088] text-white py-3 rounded-full font-bold hover:bg-indigo-900 transition-colors"
                    >
                        Ingresar
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100">
                    <button
                        onClick={handleQuickLogin}
                        className="w-full bg-slate-100 text-slate-800 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors text-sm mb-2"
                    >
                        Login Simulado Rápido
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full text-[#00A3E0] hover:underline text-sm font-medium"
                    >
                        ¿No tienes cuenta? Regístrate
                    </button>
                </div>
            </div>
        </div>
    );
};
