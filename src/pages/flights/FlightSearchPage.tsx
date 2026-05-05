import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useMarket } from '../../context/AppContext';
import { useBooking } from '../../context/BookingContext';
import { useNavigate } from 'react-router';
import { Plane, Calendar, Users, MapPin } from 'lucide-react';
import { generateId } from '../../lib/ids';

export const FlightSearchPage = () => {
    const { market } = useMarket();
    const { updateBooking, clearBooking } = useBooking();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        origin: 'BOG',
        destination: 'SCL',
        departureDate: new Date().toISOString().split('T')[0],
        returnDate: '',
        passengers: 1,
        cabin: 'Economy',
        useMiles: false
    });

    useEffect(() => {

        clearBooking(); // Reset booking state
    }, []);

    const handleChange = (e: any) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setForm(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        if (form.origin === form.destination) {
            trackEvent('Form Validation Failed', { 
                form_name: 'Flight Search',
                error_field: 'destination',
                error_message: 'Origin and destination cannot be the same'
            });
            alert('El origen y destino no pueden ser iguales.');
            return;
        }

        const bookingFlowId = generateId();
        const searchId = generateId();

        trackEvent('Search Started', {
            search_type: 'flight',
            origin: form.origin,
            destination: form.destination,
            departure_date: form.departureDate,
            return_date: form.returnDate,
            passengers: form.passengers,
            cabin: form.cabin,
            use_miles: form.useMiles,
            booking_flow_id: bookingFlowId,
            search_id: searchId,
            journey_name: 'Flight Booking',
            journey_step: 'search',
            step_order: 1,
            market: market.market,
            currency: market.currency
        });

        updateBooking({ 
            bookingFlowId,
            searchId,
            searchConfig: {
                origin: form.origin,
                destination: form.destination,
                departureDate: form.departureDate,
                returnDate: form.returnDate || null,
                passengers: Number(form.passengers),
                cabin: form.cabin
            },
            currency: market.currency
        });
        navigate('/flights/results');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-[#1B0088] mb-2">Busca tu próximo vuelo</h1>
            <p className="text-slate-600 mb-8">Elige tu origen y destino para comenzar la simulación.</p>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Origin */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Origen</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                            <select name="origin" value={form.origin} onChange={handleChange} className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#00A3E0] focus:ring-1 focus:ring-[#00A3E0] outline-none font-medium appearance-none">
                                <option value="BOG">Bogotá (BOG)</option>
                                <option value="SCL">Santiago (SCL)</option>
                                <option value="LIM">Lima (LIM)</option>
                                <option value="GRU">São Paulo (GRU)</option>
                                <option value="EZE">Buenos Aires (EZE)</option>
                                <option value="MIA">Miami (MIA)</option>
                            </select>
                        </div>
                    </div>
                    {/* Destination */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Destino</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                            <select name="destination" value={form.destination} onChange={handleChange} className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#00A3E0] focus:ring-1 focus:ring-[#00A3E0] outline-none font-medium appearance-none">
                                <option value="BOG">Bogotá (BOG)</option>
                                <option value="SCL">Santiago (SCL)</option>
                                <option value="LIM">Lima (LIM)</option>
                                <option value="GRU">São Paulo (GRU)</option>
                                <option value="EZE">Buenos Aires (EZE)</option>
                                <option value="MIA">Miami (MIA)</option>
                            </select>
                        </div>
                    </div>
                    {/* Dates */}
                    <div className="relative lg:col-span-2 flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ida</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input name="departureDate" type="date" value={form.departureDate} onChange={handleChange} className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#00A3E0] outline-none font-medium text-slate-700" required />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Vuelta</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input name="returnDate" type="date" value={form.returnDate} onChange={handleChange} className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#00A3E0] outline-none font-medium text-slate-700" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pasajeros</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-3 text-slate-400" size={20} />
                            <select name="passengers" value={form.passengers} onChange={handleChange} className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium appearance-none">
                                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Pasajero{n>1?'s':''}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Cabina</label>
                        <select name="cabin" value={form.cabin} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium appearance-none">
                            <option value="Economy">Economy</option>
                            <option value="Premium Economy">Premium Economy</option>
                            <option value="Business">Premium Business</option>
                        </select>
                    </div>
                    <div className="flex items-center pt-5 pl-2">
                         <label className="flex items-center gap-2 cursor-pointer group">
                             <div className="relative">
                                 <input type="checkbox" name="useMiles" checked={form.useMiles} onChange={handleChange} className="sr-only" />
                                 <div className={`w-10 h-6 rounded-full transition-colors ${form.useMiles ? 'bg-[#ED1650]' : 'bg-slate-300'}`}></div>
                                 <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${form.useMiles ? 'translate-x-5' : 'translate-x-1'}`}></div>
                             </div>
                             <span className="font-bold text-sm text-slate-700 group-hover:text-[#1B0088] transition-colors">Usar Millas + Dinero</span>
                         </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button type="submit" className="flex items-center gap-2 bg-[#ED1650] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-rose-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        <Plane size={24} />
                        Buscar Vuelos
                    </button>
                </div>
            </form>
        </div>
    );
};
