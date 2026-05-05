import { useEffect, useState } from 'react';
import { trackEvent } from '../lib/amplitude';
import { useUser, useMarket } from '../context/AppContext';
import { useNavigate } from 'react-router';
import { validators } from '../lib/validators';
import { createFakeUserFromEmail } from '../lib/userIdentity';

const LATAM_CODES = [
    { code: '+52', name: 'México' },
    { code: '+57', name: 'Colombia' },
    { code: '+54', name: 'Argentina' },
    { code: '+55', name: 'Brasil' },
    { code: '+56', name: 'Chile' },
    { code: '+51', name: 'Perú' },
    { code: '+593', name: 'Ecuador' },
    { code: '+598', name: 'Uruguay' },
    { code: '+595', name: 'Paraguay' },
    { code: '+591', name: 'Bolivia' },
    { code: '+58', name: 'Venezuela' },
    { code: '+507', name: 'Panamá' },
    { code: '+506', name: 'Costa Rica' },
    { code: '+502', name: 'Guatemala' },
    { code: '+503', name: 'El Salvador' },
    { code: '+504', name: 'Honduras' },
    { code: '+505', name: 'Nicaragua' },
    { code: '+1', name: 'Rep. Dominicana / PR' },
    { code: '+53', name: 'Cuba' },
    { code: '+509', name: 'Haití' },
];

export const RegisterPage = () => {
    const { loginUser } = useUser();
    const { market } = useMarket();
    const navigate = useNavigate();
    
    // Auto-select standard LATAM code based on market
    const defaultCode = market.country === 'Colombia' ? '+57' : (market.country === 'Chile' ? '+56' : '+52');

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        document_type: 'pasaporte',
        document_number: '',
        email: '',
        password: '',
        confirm_password: '',
        country_code: defaultCode,
        phone: '',
        terms: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: any) => {
        const { name, value, type } = e.target;
        
        let val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        
        if (name === 'phone') {
            // Numbers only
            val = val.replace(/[^0-9]/g, '');
        }

        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleBlur = (field: string) => {
        trackEvent('Form Field Completed', { field_name: field, form_name: 'Register Form' });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!validators.validateName(formData.first_name)) newErrors.first_name = 'Nombre inválido';
        if (!validators.validateName(formData.last_name)) newErrors.last_name = 'Apellido inválido';
        if (!formData.document_number.trim()) newErrors.document_number = 'Requerido';
        if (!validators.validateEmail(formData.email)) newErrors.email = 'Email inválido';
        
        if (!validators.validatePassword(formData.password)) newErrors.password = 'Mínimo 8 caracteres, una letra y un número';
        if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Las contraseñas no coinciden';
        
        if (!validators.validatePhone(formData.phone)) newErrors.phone = 'Teléfono inválido (7 a 15 dígitos)';
        if (!formData.terms) newErrors.terms = 'Debe aceptar los términos';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        if (!validate()) {
            trackEvent('Form Validation Failed', { 
                form_name: 'Register Form', 
                journey_name: 'Authentication',
                error_fields: Object.keys(errors)
            });
            return;
        }

        const fakeUser = await createFakeUserFromEmail(formData.email, {
            firstName: formData.first_name,
            lastName: formData.last_name,
            countryCode: formData.country_code,
            phone: formData.phone
        });

        const appUser = {
            ...fakeUser,
            tier: 'none',
            miles_balance: 0,
            preferred_airport: market.market === 'CL' ? 'SCL' : 'BOG',
            customer_type: 'leisure',
            country: market.country,
            market: market.market,
            language: market.language,
            user_tier: 'regular'
        };

        loginUser(appUser as any, 'email_signup');
        
        trackEvent('User Registered', {
            method: 'email',
            success: true
        });

        trackEvent('Form Submitted', { form_name: 'Register Form' });

        navigate('/account');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2 text-center">Únete a Minders Fly</h1>
            <p className="text-slate-600 mb-8 text-center text-sm">Crea una cuenta para interactuar en esta demo.</p>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nombre</label>
                        <input name="first_name" type="text" className={`w-full p-3 border rounded-lg focus:outline-none ${errors.first_name ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`} value={formData.first_name} onChange={handleChange} onBlur={() => handleBlur('first_name')} />
                        {errors.first_name && <span className="text-xs text-[#ED1650]">{errors.first_name}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Apellido</label>
                        <input name="last_name" type="text" className={`w-full p-3 border rounded-lg focus:outline-none ${errors.last_name ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`} value={formData.last_name} onChange={handleChange} onBlur={() => handleBlur('last_name')} />
                        {errors.last_name && <span className="text-xs text-[#ED1650]">{errors.last_name}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tipo Identificación</label>
                        <select name="document_type" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00A3E0]" value={formData.document_type} onChange={handleChange}>
                            <option value="pasaporte">Pasaporte</option>
                            <option value="rut">RUT/DNI/Cédula</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Número</label>
                        <input name="document_number" type="text" className={`w-full p-3 border rounded-lg focus:outline-none ${errors.document_number ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`} value={formData.document_number} onChange={handleChange} onBlur={() => handleBlur('document_number')} />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input name="email" type="email" className={`w-full p-3 border rounded-lg focus:outline-none ${errors.email ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`} value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} />
                    {errors.email && <span className="text-xs text-[#ED1650]">{errors.email}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
                        <input name="password" type="password" className={`w-full p-3 border rounded-lg focus:outline-none ${errors.password ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`} value={formData.password} onChange={handleChange} />
                        {errors.password && <span className="text-xs text-[#ED1650]">{errors.password}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Confirmar Contraseña</label>
                        <input name="confirm_password" type="password" className={`w-full p-3 border rounded-lg focus:outline-none ${errors.confirm_password ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`} value={formData.confirm_password} onChange={handleChange} />
                        {errors.confirm_password && <span className="text-xs text-[#ED1650]">{errors.confirm_password}</span>}
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono Móvil</label>
                    <div className="flex gap-2">
                         <select 
                             name="country_code" 
                             className="w-1/3 p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00A3E0] bg-white text-slate-700" 
                             value={formData.country_code} 
                             onChange={handleChange}
                         >
                             {LATAM_CODES.map(c => (
                                 <option key={c.code} value={c.code}>{c.code} {c.name}</option>
                             ))}
                         </select>
                         <input 
                              name="phone" 
                              type="tel" 
                              placeholder="Ej: 3001234567"
                              className={`w-2/3 p-3 border rounded-lg focus:outline-none ${errors.phone ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`} 
                              value={formData.phone} 
                              onChange={handleChange} 
                              onBlur={() => handleBlur('phone')} 
                         />
                    </div>
                    {errors.phone && <span className="text-xs text-[#ED1650]">{errors.phone}</span>}
                </div>

                <div className="mb-8">
                    <label className="flex items-start gap-3">
                        <input name="terms" type="checkbox" className="mt-1 w-4 h-4" checked={formData.terms} onChange={handleChange} />
                        <span className="text-sm text-slate-600">
                            Acepto que este sitio es una demo. Los datos ingresados son ficticios y no seré contactado. Acepto el tratamiento de datos simulado.
                        </span>
                    </label>
                    {errors.terms && <span className="text-xs text-[#ED1650] block mt-1">{errors.terms}</span>}
                </div>

                <button type="submit" className="w-full bg-[#ED1650] text-white py-3 rounded-full font-bold hover:bg-rose-700 transition-colors shadow-lg">
                    Crear Cuenta Ficticia
                </button>
            </form>
        </div>
    );
};
