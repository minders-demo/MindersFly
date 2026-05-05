import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useBooking } from '../../context/BookingContext';
import { useUser } from '../../context/AppContext';
import { useNavigate } from 'react-router';
import { User as UserIcon } from 'lucide-react';
import { validators } from '../../lib/validators';
import { useFormStarted } from '../../lib/useFormStarted';

export const PassengersPage = () => {
    useFormStarted('Passenger Info', 'passengers');
    const { booking, updateBooking } = useBooking();
    const { user } = useUser();
    const navigate = useNavigate();

    const numPassengers = booking.searchConfig?.passengers || 1;
    
    // Initialize with mostly empty fields, but prefill first passenger if logged in
    const [passengers, setPassengers] = useState(
        Array.from({ length: numPassengers }).map((_, i) => ({
            id: `pax_${i}`,
            first_name: i === 0 && user ? user.first_name : '',
            last_name: i === 0 && user ? user.last_name : '',
            document_type: i === 0 && user ? user.document_type || 'pasaporte' : 'pasaporte',
            document_number: i === 0 && user ? user.document_number || '' : '',
            birth_date: '1990-01-01',
            frequent_flyer_program: i === 0 && user ? 'Minders Pass' : 'Ninguno',
            frequent_flyer_number: i === 0 && user ? user.loyalty_id || '' : ''
        }))
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (index: number, field: string, value: string) => {
        const newPax = [...passengers];
        newPax[index] = { ...newPax[index], [field]: value };
        setPassengers(newPax);
    };

    const handleBlur = (field: string) => {
        trackEvent('Form Field Completed', { field_name: field, form_name: 'Passenger Info' });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        passengers.forEach((p, i) => {
            if (!validators.validateName(p.first_name)) {
                newErrors[`${i}_first_name`] = 'Nombre inválido';
                isValid = false;
            }
            if (!validators.validateName(p.last_name)) {
                newErrors[`${i}_last_name`] = 'Apellido inválido';
                isValid = false;
            }
            if (!validators.validateRequired(p.document_number)) {
                newErrors[`${i}_document_number`] = 'Requerido';
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        if (!validate()) {
            trackEvent('Form Validation Failed', { 
                form_name: 'Passenger Info',
                error_fields: Object.keys(errors)
            });
            return;
        }

        trackEvent('Form Submitted', { form_name: 'Passenger Info' });
        
        updateBooking({ passengers });
        navigate('/flights/contact');
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2">Ingresa los datos de los pasajeros</h1>
            <p className="text-slate-500 mb-8">Deben coincidir exactamente con el documento de identidad.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {passengers.map((p, i) => (
                    <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                            <UserIcon className="text-[#00A3E0]" size={24} />
                            <h2 className="text-xl font-bold text-slate-800">Pasajero {i + 1}</h2>
                            {i === 0 && <span className="ml-2 text-xs font-bold uppercase tracking-wide bg-slate-100 px-2 py-1 rounded text-slate-500">Pasajero Principal</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nombre(s)</label>
                                <input 
                                    className={`w-full p-3 border rounded-xl focus:outline-none ${errors[`${i}_first_name`] ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`}
                                    value={p.first_name || ''}
                                    onChange={(e) => handleChange(i, 'first_name', e.target.value)}
                                    onBlur={() => handleBlur('first_name')}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Apellido(s)</label>
                                <input 
                                    className={`w-full p-3 border rounded-xl focus:outline-none ${errors[`${i}_last_name`] ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`}
                                    value={p.last_name || ''}
                                    onChange={(e) => handleChange(i, 'last_name', e.target.value)}
                                    onBlur={() => handleBlur('last_name')}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Tipo Identificación</label>
                                <select 
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A3E0] bg-white"
                                    value={p.document_type || ''}
                                    onChange={(e) => handleChange(i, 'document_type', e.target.value)}
                                >
                                    <option value="pasaporte">Pasaporte</option>
                                    <option value="rut">RUT/DNI/Cédula</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Número de Documento</label>
                                <input 
                                    className={`w-full p-3 border rounded-xl focus:outline-none ${errors[`${i}_document_number`] ? 'border-[#ED1650]' : 'border-slate-300 focus:border-[#00A3E0]'}`}
                                    value={p.document_number || ''}
                                    onChange={(e) => handleChange(i, 'document_number', e.target.value)}
                                    onBlur={() => handleBlur('document_number')}
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Fecha de Nacimiento</label>
                                <input 
                                    type="date"
                                    max="2024-01-01"
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A3E0]"
                                    value={p.birth_date || ''}
                                    onChange={(e) => handleChange(i, 'birth_date', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Programa Viajero Frecuente (Opcional)</label>
                                <div className="flex gap-2">
                                     <select 
                                        className="w-1/3 p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A3E0] bg-white"
                                        value={p.frequent_flyer_program || ''}
                                        onChange={(e) => handleChange(i, 'frequent_flyer_program', e.target.value)}
                                    >
                                        <option value="Ninguno">Ninguno</option>
                                        <option value="Minders Pass">Minders Pass</option>
                                    </select>
                                    <input 
                                        placeholder="Número de socio"
                                        className="w-2/3 p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A3E0]"
                                        value={p.frequent_flyer_number || ''}
                                        onChange={(e) => handleChange(i, 'frequent_flyer_number', e.target.value)}
                                        disabled={p.frequent_flyer_program === 'Ninguno'}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                ))}

                <div className="flex justify-between items-center pt-8 border-t border-slate-200">
                    <button type="button" onClick={() => navigate(-1)} className="text-[#1B0088] font-bold px-6 py-2 hover:bg-slate-100 rounded-full transition-colors">
                        Volver
                    </button>
                    <button type="submit" className="bg-[#ED1650] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-rose-700 transition-shadow shadow-md">
                        Continuar
                    </button>
                </div>
            </form>
        </div>
    );
};
