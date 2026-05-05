import { BrowserRouter, Routes, Route } from 'react-router';
import { MainLayout } from '../layouts/MainLayout';
import { RouteTracker } from '../components/RouteTracker';

// Base Pages
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { MarketSelectorPage } from '../pages/MarketSelectorPage';

// Flights
import { FlightSearchPage } from '../pages/flights/FlightSearchPage';
import { FlightResultsPage } from '../pages/flights/FlightResultsPage';
import { FaresPage } from '../pages/flights/FaresPage';
import { PassengersPage } from '../pages/flights/PassengersPage';
import { ContactPage } from '../pages/flights/ContactPage';
import { SeatsPage } from '../pages/flights/SeatsPage';
import { BaggagePage } from '../pages/flights/BaggagePage';
import { SummaryPage } from '../pages/flights/SummaryPage';

// Checkout
import { CheckoutPaymentPage } from '../pages/checkout/CheckoutPaymentPage';
import { CheckoutProcessingPage } from '../pages/checkout/CheckoutProcessingPage';
import { CheckoutSuccessPage } from '../pages/checkout/CheckoutSuccessPage';
import { CheckoutErrorPage } from '../pages/checkout/CheckoutErrorPage';

// My Trips
import { MyTripsPage } from '../pages/my-trips/MyTripsPage';
import { TripDetailPage } from '../pages/my-trips/TripDetailPage';

// Check In
import { CheckInPassengerPage } from '../pages/check-in/CheckInPassengerPage';
import { BoardingPassPage } from '../pages/check-in/BoardingPassPage';

// Travel Hub
import { TravelHubPage } from '../pages/travel/TravelHubPage';
import { PackageResultsPage } from '../pages/travel/PackageResultsPage';
import { PackageDetailPage } from '../pages/travel/PackageDetailPage';
import { TravelGenericResultsPage } from '../pages/travel/TravelGenericResultsPage';
import { CarsResultsPage } from '../pages/travel/CarsResultsPage';
import { AccommodationsResultsPage } from '../pages/travel/AccommodationsResultsPage';
import { AccommodationDetailPage } from '../pages/travel/AccommodationDetailPage';

// Upgrade
import { UpgradePage } from '../pages/upgrade/UpgradePage';

// Demo Pages
import { EventDebuggerPage } from '../pages/demo/EventDebuggerPage';
import { ErrorLabPage } from '../pages/demo/ErrorLabPage';
import { PersonasPage } from '../pages/demo/PersonasPage';

// Placeholder Pages
import { AccountPage } from '../pages/account/AccountPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <RouteTracker />
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/loyalty" element={<PlaceholderPage title="Loyalty" description="Millas y beneficios" />} />
                    <Route path="/help-center" element={<PlaceholderPage title="Centro de Ayuda" description="Soporte y FAQs" />} />
                    <Route path="/flight-status" element={<PlaceholderPage title="Estado de Vuelo" description="Consulta de estado de vuelos" />} />
                    <Route path="/market-selector" element={<MarketSelectorPage />} />

                    {/* Flights */}
                    <Route path="/flights/search" element={<FlightSearchPage />} />
                    <Route path="/flights/results" element={<FlightResultsPage />} />
                    <Route path="/flights/select-outbound" element={<FlightResultsPage />} />
                    <Route path="/flights/select-return" element={<FlightResultsPage />} />
                    <Route path="/flights/fares" element={<FaresPage />} />
                    <Route path="/flights/passengers" element={<PassengersPage />} />
                    <Route path="/flights/contact" element={<ContactPage />} />
                    <Route path="/flights/extras" element={<PlaceholderPage title="Extras" description="Venta cruzada de servicios" />} />
                    <Route path="/flights/seats" element={<SeatsPage />} />
                    <Route path="/flights/bags" element={<BaggagePage />} />
                    <Route path="/flights/assistance" element={<PlaceholderPage title="Asistencia Especial" description="Requerimientos genéricos para demo rápida" />} />
                    <Route path="/flights/summary" element={<SummaryPage />} />

                    {/* Checkout */}
                    <Route path="/checkout/payment" element={<CheckoutPaymentPage />} />
                    <Route path="/checkout/review" element={<CheckoutPaymentPage />} />
                    <Route path="/checkout/processing" element={<CheckoutProcessingPage />} />
                    <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                    <Route path="/checkout/error" element={<CheckoutErrorPage />} />

                    {/* My Trips */}
                    <Route path="/my-trips" element={<MyTripsPage />} />
                    <Route path="/my-trips/search" element={<PlaceholderPage title="Buscar Reserva" description="Búsqueda por PNR" />} />
                    <Route path="/my-trips/detail/:bookingId" element={<TripDetailPage />} />
                    <Route path="/my-trips/change-flight/:bookingId" element={<PlaceholderPage title="Cambiar Vuelo" description="Flujo de cambio" />} />
                    <Route path="/my-trips/refund/:bookingId" element={<PlaceholderPage title="Devolución" description="Flujo de reembolso" />} />
                    <Route path="/my-trips/add-bags/:bookingId" element={<PlaceholderPage title="Agregar Maletas" description="Compra de equipaje en post-venta" />} />
                    <Route path="/my-trips/select-seats/:bookingId" element={<PlaceholderPage title="Seleccionar Asientos" description="Compra de asientos en post-venta" />} />
                    <Route path="/my-trips/upgrade/:bookingId" element={<UpgradePage />} />

                    {/* Check In */}
                    <Route path="/check-in" element={<CheckInPassengerPage />} /> {/* simplified directly to Pax */}
                    <Route path="/check-in/:bookingId" element={<CheckInPassengerPage />} /> {/* Route from trips */}
                    <Route path="/check-in/passenger" element={<CheckInPassengerPage />} />
                    <Route path="/check-in/seats" element={<PlaceholderPage title="Check In: Asientos" description="Confirmación o cambio de asientos en check in" />} />
                    <Route path="/check-in/boarding-pass" element={<BoardingPassPage />} />
                    <Route path="/boarding-pass/:bookingId" element={<BoardingPassPage />} />

                    {/* Travel */}
                    <Route path="/travel" element={<TravelHubPage />} />
                    <Route path="/travel/packages/search" element={<PackageResultsPage />} />
                    <Route path="/travel/packages/results" element={<PackageResultsPage />} />
                    <Route path="/travel/packages/detail/:packageId" element={<PackageDetailPage />} />
                    <Route path="/travel/packages/checkout" element={<CheckoutPaymentPage />} />
                    
                    <Route path="/travel/hotels/search" element={<AccommodationsResultsPage />} />
                    <Route path="/travel/hotels/results" element={<AccommodationsResultsPage />} />
                    <Route path="/travel/hotels/detail/:hotelId" element={<AccommodationDetailPage />} />
                    <Route path="/travel/hotels/checkout" element={<CheckoutPaymentPage />} />
                    
                    <Route path="/travel/cars/search" element={<CarsResultsPage />} />
                    <Route path="/travel/cars/results" element={<CarsResultsPage />} />
                    <Route path="/travel/cars/detail/:carId" element={<CarsResultsPage />} />
                    <Route path="/travel/cars/checkout" element={<CheckoutPaymentPage />} />
                    
                    <Route path="/travel/assistance/search" element={<TravelGenericResultsPage type="assistance" />} />
                    <Route path="/travel/assistance/plans" element={<TravelGenericResultsPage type="assistance" />} />
                    <Route path="/travel/assistance/checkout" element={<CheckoutPaymentPage />} />
                    
                    <Route path="/travel/esim" element={<PlaceholderPage title="eSIM" description="Compra de eSIM" />} />
                    <Route path="/travel/transfers" element={<PlaceholderPage title="Transfers" description="Reserva de traslados" />} />
                    <Route path="/travel/activities" element={<PlaceholderPage title="Actividades" description="Reserva de tours" />} />

                    {/* Upgrade */}
                    <Route path="/upgrade" element={<UpgradePage />} />
                    <Route path="/upgrade/search" element={<UpgradePage />} />
                    <Route path="/upgrade/eligibility" element={<PlaceholderPage title="Elegibilidad" description="Verificando si la tarifa y ruta aplican" />} />
                    <Route path="/upgrade/offer" element={<PlaceholderPage title="Oferta Upgrade" description="Pujando por un upgrade" />} />
                    <Route path="/upgrade/confirmation" element={<PlaceholderPage title="Confirmación Upgrade" description="Oferta recibida" />} />

                    {/* Demo Tools */}
                    <Route path="/demo/error-lab" element={<ErrorLabPage />} />
                    <Route path="/demo/event-debugger" element={<EventDebuggerPage />} />
                    <Route path="/demo/personas" element={<PersonasPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
