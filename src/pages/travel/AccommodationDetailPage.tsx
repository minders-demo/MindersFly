import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/amplitude';
import { useMarket } from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router';
import { mockData } from '../../data/generators';
import { Star, MapPin, Check, Wifi, Coffee, Dumbbell, Car, ArrowLeft, ArrowRight } from 'lucide-react';

export const AccommodationDetailPage = () => {
    const { market } = useMarket();
    const navigate = useNavigate();
    const { hotelId } = useParams();

    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        setTimeout(() => {
             const h = mockData.hotels.find(x => x.id === hotelId) || mockData.hotels[0];
             setHotel(h);
             setLoading(false);
             
             trackEvent('Accommodation Detail Viewed', {
                 item_id: h.id,
                 name: h.name,
                 category: h.type
             });
        }, 800);
    }, [hotelId]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-24 text-center">
                <div className="w-12 h-12 border-4 border-[#00A3E0] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-bold text-[#1B0088]">Cargando detalles...</h2>
            </div>
        );
    }

    if (!hotel) return <div>Hotel no encontrado</div>;

    const nights = 3;
    const total = hotel.pricePerNightUSD * nights;

    const handleConfirm = () => {
        trackEvent('Accommodation Confirmed', {
            item_id: hotel.id,
            name: hotel.name,
            total_price_usd: total
        });
        navigate('/checkout/payment');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#00A3E0] font-bold mb-6 hover:underline">
                 <ArrowLeft size={18} /> Volver a resultados
            </button>

            <div className="flex justify-between items-start mb-6">
                <div>
                     <div className="flex gap-1 mb-2 text-yellow-400">
                         {Array(Math.floor(hotel.stars || 4)).fill(0).map((_, i) => (
                             <Star key={i} size={18} fill="currentColor" />
                         ))}
                     </div>
                     <h1 className="text-3xl font-bold text-[#1B0088] mb-2">{hotel.name}</h1>
                     <div className="flex items-center gap-2 text-slate-600">
                         <MapPin size={18} />
                         <span>{hotel.city}, {hotel.country}</span>
                         <span className="text-[#00A3E0] font-medium">• A {hotel.distanceFromCenterKm} km del centro</span>
                     </div>
                </div>
                {hotel.reviewScore && (
                     <div className="flex items-center gap-3 bg-slate-50 p-2 border border-slate-200 rounded-xl px-4">
                         <div className="text-right">
                             <div className="text-sm font-bold text-[#1B0088]">{hotel.reviewLabel}</div>
                             <div className="text-xs text-slate-500">{hotel.reviewsCount} comentarios</div>
                         </div>
                         <div className="bg-[#1B0088] text-white font-bold p-3 text-lg rounded-xl rounded-tr-none">
                             {hotel.reviewScore}
                         </div>
                     </div>
                )}
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] mb-8 rounded-2xl overflow-hidden">
                 <div className="col-span-2 row-span-2">
                     <img src={hotel.image} className="w-full h-full object-cover" />
                 </div>
                 <div className="col-span-1 row-span-1">
                     <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2340&auto=format&fit=crop" className="w-full h-full object-cover" />
                 </div>
                 <div className="col-span-1 row-span-1">
                     <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2340&auto=format&fit=crop" className="w-full h-full object-cover" />
                 </div>
                 <div className="col-span-1 row-span-1">
                     <img src="https://images.unsplash.com/photo-1584132967334-10e028b12255?q=80&w=2340&auto=format&fit=crop" className="w-full h-full object-cover" />
                 </div>
                 <div className="col-span-1 row-span-1 relative">
                     <img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2340&auto=format&fit=crop" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/40 transition">
                          <span className="text-white font-bold">+15 fotos</span>
                     </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                 {/* Details */}
                 <div className="md:col-span-2 space-y-8">
                      <div>
                           <p className="text-slate-700 leading-relaxed text-lg">
                               {hotel.description}
                           </p>
                      </div>
                      
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                           <h2 className="text-xl font-bold text-[#1B0088] mb-4">Servicios más populares</h2>
                           <div className="grid grid-cols-2 gap-4">
                               {hotel.amenities?.map((am: string, i: number) => (
                                   <div key={i} className="flex items-center gap-2 text-slate-700">
                                       <Check size={18} className="text-emerald-500" />
                                       <span>{am}</span>
                                   </div>
                               )) || (
                                   <>
                                   <div className="flex items-center gap-2 text-slate-700"><Check size={18} className="text-emerald-500" /> WiFi Gratis</div>
                                   <div className="flex items-center gap-2 text-slate-700"><Check size={18} className="text-emerald-500" /> Recepción 24h</div>
                                   </>
                               )}
                           </div>
                      </div>
                      
                      <div>
                           <h2 className="text-xl font-bold text-[#1B0088] mb-4">Tamaño y Espacios</h2>
                           <div className="flex gap-4">
                                <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex-1 text-center">
                                     <div className="text-slate-500 text-sm mb-1">Superficie</div>
                                     <div className="font-bold text-lg text-slate-800">{hotel.sizeM2 || 45} m²</div>
                                </div>
                                <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex-1 text-center">
                                     <div className="text-slate-500 text-sm mb-1">Tipo</div>
                                     <div className="font-bold text-lg text-slate-800">{hotel.type}</div>
                                </div>
                           </div>
                      </div>
                 </div>

                 {/* Price Card */}
                 <div className="md:col-span-1">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sticky top-24">
                           <h3 className="font-bold text-lg text-slate-800 mb-4">Resumen de reserva</h3>
                           
                           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-sm text-slate-600">
                                <div className="flex justify-between mb-2">
                                     <span>Ingreso:</span>
                                     <span className="font-bold">12 Abr 2026</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                     <span>Salida:</span>
                                     <span className="font-bold">15 Abr 2026</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                                     <span>Duración:</span>
                                     <span className="font-bold">{nights} Noches</span>
                                </div>
                           </div>

                           <div className="flex justify-between text-slate-600 mb-2">
                                <span>USD {hotel.pricePerNightUSD} x {nights} noches</span>
                                <span>USD {hotel.pricePerNightUSD * nights}</span>
                           </div>
                           <div className="flex justify-between text-slate-600 mb-4">
                                <span>Impuestos y tasas</span>
                                <span>USD 0</span>
                           </div>
                           
                           <div className="border-t border-slate-200 pt-4 flex justify-between items-end mb-6">
                                <span className="font-bold text-slate-800">Total</span>
                                <span className="text-2xl font-bold text-[#ED1650]">USD {total}</span>
                           </div>

                           <button onClick={handleConfirm} className="w-full bg-[#1B0088] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-indigo-900 transition flex items-center justify-center gap-2">
                                Seleccionar alojamiento <ArrowRight size={18} />
                           </button>
                      </div>
                 </div>
            </div>
        </div>
    );
};
