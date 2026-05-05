import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useUser } from '../../context/AppContext';
import { useNavigate } from 'react-router';
import { Mail, Phone } from 'lucide-react';
import { validators } from '../../lib/validators';
import { useFormStarted } from '../../lib/useFormStarted';

export const ContactPage = () => {
    useFormStarted('Contact Info', 'contact');
    const { user } = useUser();
    const navigate = useNavigate();

    const [contact, setContact] = useState({
        email: user?.email || '',
        phone: user?.phone || '',
        emergency_contact_name: '',
        emergency_contact_phone: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: any) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const handleBlur = (field: string) => {
        trackEvent('Form Field Completed', { field_name: field, form_name: 'Contact Info' });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!validators.validateEmail(contact.email)) newErrors.email = 'Email inválido';
        if (!validators.validatePhone(contact.phone)) newErrors.phone = 'Teléfono inválido';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        if (!validate()) {
            trackEvent('Form Validation Failed', { 
                form_name: 'Contact Info',
                error_fields: Object.keys(errors)
            });
            return;
        }

        trackEvent('Form Submitted', { form_name: 'Contact Info' });
        
        // Storing in local storage or context if needed, but for demo we can just proceed
        // to next step. Seats is next.
        navigate('/flights/seats');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2">Información de contacto</h1>
            <p className="text-slate-500 mb-8">Enviaremos la confirmación de la reserva y actualizaciones de tu vuelo.</p>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Correo Electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input 
                            name="email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            className={`w-full pl-10 p-3 border rounded-xl focus:outline-none ${errors.email ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`}
                            value={contact.email || ''}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                        />
                    </div>
                    {errors.email && <span className="text-xs text-[#ED1650] mt-1 block">{errors.email}</span>}
                </div>

                <div className="mb-10">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Teléfono Móvil</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input 
                            name="phone"
                            type="tel"
                            placeholder="+56 9 1234 5678"
                            className={`w-full pl-10 p-3 border rounded-xl focus:outline-none ${errors.phone ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`}
                            value={contact.phone || ''}
                            onChange={handleChange}
                            onBlur={() => handleBlur('phone')}
                        />
                    </div>
                    {errors.phone && <span className="text-xs text-[#ED1650] mt-1 block">{errors.phone}</span>}
                </div>

                <div className="border-t border-slate-100 pt-8 mb-8">
                    <h3 className="font-bold text-slate-800 mb-4">Contacto de Emergencia (Opcional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nombre</label>
                            <input 
                                name="emergency_contact_name"
                                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A3E0]"
                                value={contact.emergency_contact_name || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Teléfono</label>
                            <input 
                                name="emergency_contact_phone"
                                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A3E0]"
                                value={contact.emergency_contact_phone || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-slate-200">
                    <button type="button" onClick={() => navigate(-1)} className="text-[#1B0088] font-bold px-6 py-2 hover:bg-slate-100 rounded-full transition-colors">
                        Volver
                    </button>
                    <button type="submit" className="bg-[#ED1650] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-rose-700 transition-shadow shadow-md">
                        Continuar a Asientos
                    </button>
                </div>
            </form>
        </div>
    );
};
