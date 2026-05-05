import { useEffect, useState, useMemo } from 'react';
import { trackEvent, trackError } from '../../lib/amplitude';
import { useMarket, useUser } from '../../context/AppContext';
import { useBooking } from '../../context/BookingContext';
import { useNavigate, useLocation } from 'react-router';
import { mockData } from '../../data/generators';
import { errorSimulator } from '../../lib/errorSimulator';
import { FlightSearchWidget } from '../../components/flights/FlightSearchWidget';
import { ChevronLeft } from 'lucide-react';

export const FlightResultsPage = () => {
    const { user } = useUser();
    const { booking, updateBooking } = useBooking();
    const navigate = useNavigate();
    const location = useLocation();

    const isReturnPage = location.pathname.includes('select-return');
    const [allFlights, setAllFlights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [filterDirect, setFilterDirect] = useState(false);
    const [filterWithStops, setFilterWithStops] = useState(false);
    
    // Pagination
    const [visibleCount, setVisibleCount] = useState(20);

    const activeOrigin = isReturnPage ? booking.searchConfig?.destination : booking.searchConfig?.origin;
    const activeDestination = isReturnPage ? booking.searchConfig?.origin : booking.searchConfig?.destination;
    const activeDate = isReturnPage ? booking.searchConfig?.returnDate : booking.searchConfig?.departureDate;

    const performSearch = (searchOrigin: string, searchDest: string) => {
        setLoading(true);
        setTimeout(() => {
            const err = errorSimulator.shouldTriggerError({
                step: 'search',
                userTier: user?.user_tier || user?.tier,
                paymentMethod: ''
            });

            if (err) {
                trackError({
                    error_type: err.id,
                    error_code: err.code,
                    error_message: err.msg,
                    error_category: 'search',
                    transaction_step: 'flight_search',
                    journey_name: 'Flight Booking',
                    journey_step: isReturnPage ? 'select_return' : 'select_outbound',
                    route: location.pathname
                });
                navigate('/demo/error-lab');
                return;
            }

            let results = mockData.flights.filter(f => 
                f.origin === searchOrigin &&
                f.destination === searchDest
            );

            if (results.length === 0) {
                results = mockData.flights.slice(0, 30); // fallback
            }

            setAllFlights(results);
            setVisibleCount(20);
            setLoading(false);

            trackEvent('Search Results Viewed', {
                result_count: results.length,
                origin: searchOrigin,
                destination: searchDest,
                journey_name: 'Flight Booking',
                journey_step: isReturnPage ? 'select_return' : 'select_outbound',
                step_order: isReturnPage ? 3 : 2,
                booking_flow_id: booking.bookingFlowId
            });
        }, 1500);
    };

    useEffect(() => {

        if (activeOrigin && activeDestination) {
            performSearch(activeOrigin, activeDestination);
        } else {
            // Avoid empty state during dev
            performSearch('BOG', 'SCL');
        }
    }, [activeOrigin, activeDestination, isReturnPage, user, navigate, location.pathname, booking.bookingFlowId]);

    const handleSelectFlight = (flight: any) => {
        trackEvent('Flight Selected', {
            flight_id: flight.id,
            flight_number: flight.flightNumber,
            origin: flight.origin,
            destination: flight.destination,
            price: flight.basePriceUSD,
            cabin: flight.cabin,
            leg_type: isReturnPage ? 'return' : 'outbound',
            journey_name: 'Flight Booking',
            journey_step: isReturnPage ? 'select_return' : 'select_outbound',
            step_order: isReturnPage ? 3 : 2,
            booking_flow_id: booking.bookingFlowId
        });

        if (isReturnPage) {
            updateBooking({ returnFlight: flight });
            navigate('/flights/fares');
        } else {
            updateBooking({ outboundFlight: flight });
            if (booking.searchConfig?.returnDate) {
                navigate('/flights/select-return');
            } else {
                navigate('/flights/fares');
            }
        }
    };

    const handleSearchModify = (form: any) => {
        // Automatically handled by FlightSearchWidget calling updateBooking
        // The component will re-render due to activeOrigin/activeDestination changes
    };
    
    // Filtered and paginated logic
    const filteredFlights = useMemo(() => {
        return allFlights.filter(f => {
            if (filterDirect && !filterWithStops) {
                return f.direct === true;
            }
            if (filterWithStops && !filterDirect) {
                return f.direct === false;
            }
            return true;
        });
    }, [allFlights, filterDirect, filterWithStops]);

    const visibleFlights = filteredFlights.slice(0, visibleCount);

    const formatUSD = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount) + ' USD';
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-16">
            <div className="bg-[#1B0088] pt-6 pb-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <button 
                        onClick={() => navigate('/')} 
                        className="text-white flex items-center gap-2 mb-6 hover:text-white/80 transition-colors font-medium"
                    >
                        <ChevronLeft size={20} /> Volver al inicio
                    </button>
                    {!isReturnPage && (
                        <div className="relative z-10 w-full mb-8">
                            <FlightSearchWidget 
                                compact={true} 
                                initialValues={{
                                    tripType: booking.searchConfig?.returnDate ? 'round_trip' : 'one_way',
                                    origin: booking.searchConfig?.origin || 'BOG',
                                    destination: booking.searchConfig?.destination || 'SCL',
                                    departureDate: booking.searchConfig?.departureDate || new Date().toISOString().split('T')[0],
                                    returnDate: booking.searchConfig?.returnDate || '',
                                    passengers: booking.searchConfig?.passengers || 1,
                                    cabin: booking.searchConfig?.cabin || 'Economy',
                                    useMiles: false
                                }}
                                onSearch={handleSearchModify}
                            />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {isReturnPage ? 'Elige tu vuelo de regreso' : 'Elige tu vuelo de ida'}
                    </h1>
                    <p className="text-[#00A3E0] font-medium text-lg">
                        {activeOrigin} → {activeDestination} 
                        <span className="mx-2 text-white">•</span> 
                        <span className="text-white">{new Date(activeDate || '').toLocaleDateString('es-ES')}</span>
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-10">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Filters sidebar */}
                    <div className="w-full md:w-64 shrink-0 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Escalas</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
                                    <input type="checkbox" checked={filterDirect} onChange={(e) => setFilterDirect(e.target.checked)} className="rounded text-[#ED1650] focus:ring-[#ED1650] w-5 h-5 border-slate-300" /> 
                                    Directo
                                </label>
                                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
                                    <input type="checkbox" checked={filterWithStops} onChange={(e) => setFilterWithStops(e.target.checked)} className="rounded text-[#ED1650] focus:ring-[#ED1650] w-5 h-5 border-slate-300" /> 
                                    1 Escala o más
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Results list */}
                    <div className="flex-1 space-y-4">
                        {loading ? (
                            <div className="bg-white p-12 rounded-2xl shadow-md border border-slate-200 text-center">
                                <div className="w-16 h-16 border-4 border-[#00A3E0] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                                <h2 className="text-2xl font-bold text-[#1B0088] mb-2">Buscando los mejores vuelos...</h2>
                                <p className="text-slate-500">Analizando más opciones para tu viaje.</p>
                            </div>
                        ) : (
                            <>
                                {visibleFlights.map(f => (
                                    <div key={f.id} className="bg-white border text-left border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all hover:border-[#00A3E0]/50 flex flex-col xl:flex-row justify-between gap-6 cursor-default">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                                <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-md text-sm border border-slate-200">Vuelo {f.flightNumber}</span>
                                                {f.direct ? (
                                                    <span className="text-xs font-bold text-[#17A673] bg-[#17A673]/10 px-2 py-1 rounded-md uppercase tracking-wide">Directo</span>
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wide">{f.stops} Escala{f.stops > 1 ? 's' : ''}</span>
                                                )}
                                                <span className="text-xs font-bold text-slate-500 px-2 py-1 bg-slate-50 rounded-md border border-slate-100">{f.cabin}</span>
                                            </div>
                                            <div className="flex items-center justify-between xl:justify-start xl:gap-14 text-[#1B0088]">
                                                <div>
                                                    <div className="text-3xl font-bold">{new Date(f.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                                    <div className="text-sm font-medium text-slate-500 mt-1">{f.origin}</div>
                                                </div>
                                                <div className="flex flex-col items-center flex-1 sm:flex-none px-4">
                                                    <div className="text-xs font-medium text-slate-400 mb-2 bg-[#F3F4F6] px-3 py-1 rounded-full">{Math.floor(f.durationMinutes/60)}h {f.durationMinutes%60}m</div>
                                                    <div className="w-full sm:w-32 border-t-2 border-slate-200 relative flex items-center justify-center">
                                                        <div className="w-2 h-2 rounded-full bg-[#00A3E0]"></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-3xl font-bold text-slate-800">
                                                        {new Date(new Date(f.departureTime).getTime() + f.durationMinutes*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </div>
                                                    <div className="text-sm font-medium text-slate-500 text-right mt-1">{f.destination}</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="border-t xl:border-t-0 xl:border-l border-slate-100 pt-6 xl:pt-0 xl:pl-8 flex flex-col justify-center w-full xl:w-64">
                                            <div className="text-sm font-medium text-slate-500 mb-1">Precio por adulto desde</div>
                                            <div className="text-3xl font-bold text-[#ED1650] mb-1">
                                                {formatUSD(f.basePriceUSD)}
                                            </div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-4 h-4 bg-[#1B0088] rounded-full flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                </div>
                                                <span className="text-xs font-bold text-[#1B0088]">+ {f.milesAccumulated.toLocaleString()} Millas</span>
                                            </div>
                                            <button 
                                                onClick={() => handleSelectFlight(f)}
                                                className="w-full bg-[#ED1650] text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                            >
                                                Seleccionar
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {filteredFlights.length === 0 && (
                                     <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                                         <p className="text-slate-500 font-medium">No se encontraron vuelos que coincidan con tus filtros.</p>
                                     </div>
                                )}

                                {visibleCount < filteredFlights.length && (
                                    <div className="pt-6 pb-12 flex justify-center">
                                        <button 
                                            onClick={() => setVisibleCount(vc => vc + 20)}
                                            className="bg-white border-2 border-[#1B0088] text-[#1B0088] font-bold px-8 py-3 rounded-full hover:bg-[#1B0088] hover:text-white transition-colors"
                                        >
                                            Ver más vuelos
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
