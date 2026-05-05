import React, { useState } from 'react';
import { Plane, Calendar, Users, MapPin } from 'lucide-react';
import { useMarket } from '../../context/AppContext';
import { useBooking } from '../../context/BookingContext';
import { useNavigate } from 'react-router';
import { trackEvent } from '../../lib/amplitude';
import { generateId } from '../../lib/ids';
import { useFeatureFlag } from '../../lib/experiment';

interface FlightSearchWidgetProps {
    compact?: boolean;
    initialValues?: any;
    onSearch?: (form: any) => void;
}

export const FlightSearchWidget: React.FC<FlightSearchWidgetProps> = ({ compact = false, initialValues, onSearch }) => {
    const { market } = useMarket();
    const { updateBooking } = useBooking();
    const navigate = useNavigate();
    const ctaVariant = useFeatureFlag('homepage_cta_color', 'control');

    const [form, setForm] = useState(initialValues || {
        tripType: 'round_trip',
        origin: 'BOG',
        destination: 'SCL',
        departureDate: new Date().toISOString().split('T')[0],
        returnDate: '',
        passengers: 1,
        cabin: 'Economy',
        useMiles: false
    });

    const handleChange = (e: any) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setForm((prev: any) => ({ ...prev, [name]: val }));
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
            trip_type: form.tripType,
            origin: form.origin,
            destination: form.destination,
            departure_date: form.departureDate,
            return_date: form.tripType === 'round_trip' ? form.returnDate : null,
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

        // Trigger parent callback if needed (e.g. results page re-search)
        if (onSearch) {
             onSearch(form);
        }

        updateBooking({ 
            bookingFlowId,
            searchId,
            searchConfig: {
                origin: form.origin,
                destination: form.destination,
                departureDate: form.departureDate,
                returnDate: form.tripType === 'round_trip' ? form.returnDate : null,
                passengers: Number(form.passengers),
                cabin: form.cabin
            },
            currency: market.currency
        });

        if (!onSearch) {
             navigate('/flights/results');
        }
    };

    const isRoundTrip = form.tripType === 'round_trip';

    return (
        <div className={`bg-white rounded-2xl shadow-xl border border-slate-100 ${compact ? 'p-4' : 'p-6'}`}>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                        <input type="radio" name="tripType" value="round_trip" checked={form.tripType === 'round_trip'} onChange={handleChange} className="text-[#ED1650] focus:ring-[#ED1650]" />
                        Ida y vuelta
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                        <input type="radio" name="tripType" value="one_way" checked={form.tripType === 'one_way'} onChange={handleChange} className="text-[#ED1650] focus:ring-[#ED1650]" />
                        Solo ida
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                        <input type="radio" name="tripType" value="multi_city" checked={form.tripType === 'multi_city'} onChange={handleChange} className="text-[#ED1650] focus:ring-[#ED1650]" />
                        Multidestino
                    </label>
                </div>

                <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-5' : 'md:grid-cols-2 lg:grid-cols-4'} gap-4 mb-4`}>
                    {/* Origin */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Origen</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                            <select name="origin" value={form.origin} onChange={handleChange} className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#00A3E0] focus:ring-1 focus:ring-[#00A3E0] outline-none font-medium appearance-none">
                                <option value="BOG">Bogotá (BOG)</option>
                                <option value="MEX">Ciudad de México (MEX)</option>
                                <option value="LIM">Lima (LIM)</option>
                                <option value="SCL">Santiago (SCL)</option>
                                <option value="EZE">Buenos Aires (EZE)</option>
                                <option value="GRU">São Paulo (GRU)</option>
                                <option value="GIG">Río de Janeiro (GIG)</option>
                                <option value="MIA">Miami (MIA)</option>
                                <option value="JFK">Nueva York (JFK)</option>
                                <option value="MAD">Madrid (MAD)</option>
                                <option value="CUN">Cancún (CUN)</option>
                                <option value="PUJ">Punta Cana (PUJ)</option>
                                <option value="CUZ">Cusco (CUZ)</option>
                                <option value="ADZ">San Andrés (ADZ)</option>
                                <option value="CTG">Cartagena (CTG)</option>
                                <option value="MDE">Medellín (MDE)</option>
                                <option value="UIO">Quito (UIO)</option>
                                <option value="GYE">Guayaquil (GYE)</option>
                                <option value="MVD">Montevideo (MVD)</option>
                                <option value="ASU">Asunción (ASU)</option>
                                <option value="LPB">La Paz (LPB)</option>
                                <option value="VVI">Santa Cruz (VVI)</option>
                                <option value="PTY">Panamá City (PTY)</option>
                                <option value="SJO">San José (SJO)</option>
                                <option value="SAL">San Salvador (SAL)</option>
                                <option value="GUA">Guatemala City (GUA)</option>
                                <option value="SDQ">Santo Domingo (SDQ)</option>
                                <option value="SJU">San Juan (SJU)</option>
                                <option value="HAV">La Habana (HAV)</option>
                            </select>
                        </div>
                    </div>
                    {/* Destination */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Destino</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                            <select name="destination" value={form.destination} onChange={handleChange} className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#00A3E0] focus:ring-1 focus:ring-[#00A3E0] outline-none font-medium appearance-none">
                                <option value="SCL">Santiago (SCL)</option>
                                <option value="BOG">Bogotá (BOG)</option>
                                <option value="MEX">Ciudad de México (MEX)</option>
                                <option value="LIM">Lima (LIM)</option>
                                <option value="EZE">Buenos Aires (EZE)</option>
                                <option value="GRU">São Paulo (GRU)</option>
                                <option value="GIG">Río de Janeiro (GIG)</option>
                                <option value="MIA">Miami (MIA)</option>
                                <option value="JFK">Nueva York (JFK)</option>
                                <option value="MAD">Madrid (MAD)</option>
                                <option value="CUN">Cancún (CUN)</option>
                                <option value="PUJ">Punta Cana (PUJ)</option>
                                <option value="CUZ">Cusco (CUZ)</option>
                                <option value="ADZ">San Andrés (ADZ)</option>
                                <option value="CTG">Cartagena (CTG)</option>
                                <option value="MDE">Medellín (MDE)</option>
                                <option value="UIO">Quito (UIO)</option>
                                <option value="GYE">Guayaquil (GYE)</option>
                                <option value="MVD">Montevideo (MVD)</option>
                                <option value="ASU">Asunción (ASU)</option>
                                <option value="LPB">La Paz (LPB)</option>
                                <option value="VVI">Santa Cruz (VVI)</option>
                                <option value="PTY">Panamá City (PTY)</option>
                                <option value="SJO">San José (SJO)</option>
                                <option value="SAL">San Salvador (SAL)</option>
                                <option value="GUA">Guatemala City (GUA)</option>
                                <option value="SDQ">Santo Domingo (SDQ)</option>
                                <option value="SJU">San Juan (SJU)</option>
                                <option value="HAV">La Habana (HAV)</option>
                            </select>
                        </div>
                    </div>
                    {/* Dates */}
                    <div className={`relative ${compact ? 'md:col-span-2' : 'lg:col-span-2'} flex gap-2`}>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ida</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input name="departureDate" type="date" value={form.departureDate} onChange={handleChange} className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#00A3E0] outline-none font-medium text-slate-700" required />
                            </div>
                        </div>
                        {isRoundTrip && (
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Vuelta</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <input name="returnDate" type="date" value={form.returnDate} onChange={handleChange} className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#00A3E0] outline-none font-medium text-slate-700" required={isRoundTrip} />
                                </div>
                            </div>
                        )}
                    </div>
                    {compact && (
                         <div className="pt-5 hidden md:block">
                            <button type="submit" className="w-full h-12 bg-[#ED1650] text-white rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                                Buscar
                            </button>
                         </div>
                    )}
                </div>

                <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-4' : 'sm:grid-cols-3'} gap-4 ${compact ? 'mb-2' : 'mb-6'}`}>
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
                                 <div className={`w-10 h-6 rounded-full transition-colors ${form.useMiles ? 'bg-[#1B0088]' : 'bg-slate-300'}`}></div>
                                 <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${form.useMiles ? 'translate-x-5' : 'translate-x-1'}`}></div>
                             </div>
                             <span className="font-bold text-sm text-slate-700 group-hover:text-[#1B0088] transition-colors">Usar Millas</span>
                         </label>
                    </div>
                    {compact && (
                         <div className="pt-5 md:hidden">
                            <button type="submit" className="w-full h-12 bg-[#ED1650] text-white rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                                Buscar
                            </button>
                         </div>
                    )}
                </div>

                {!compact && (
                    <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
                        <button 
                            type="submit" 
                            className={`flex items-center gap-2 text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                                ctaVariant === 'treatment_orange' 
                                    ? 'bg-orange-500 hover:bg-orange-600'
                                    : 'bg-[#ED1650] hover:bg-rose-700'
                            }`}
                        >
                            <Plane size={24} />
                            Buscar Vuelos
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};
