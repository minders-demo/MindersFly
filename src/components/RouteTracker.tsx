import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { trackPageView } from '../lib/amplitude';
import { useBooking } from '../context/BookingContext';

const getJourneyInfo = (pathname: string): { journey_name: string, journey_step: string } => {
    if (pathname.includes('/flights')) return { journey_name: 'Flight Booking', journey_step: pathname.split('/').pop() || 'unknown' };
    if (pathname.includes('/checkout')) return { journey_name: 'Checkout', journey_step: pathname.split('/').pop() || 'unknown' };
    if (pathname.includes('/check-in')) return { journey_name: 'Check-In', journey_step: pathname.split('/').pop() || 'unknown' };
    if (pathname.includes('/travel/packages')) return { journey_name: 'Packages', journey_step: pathname.split('/').pop() || 'unknown' };
    if (pathname.includes('/travel/hotels')) return { journey_name: 'Hotels', journey_step: pathname.split('/').pop() || 'unknown' };
    if (pathname.includes('/travel/cars')) return { journey_name: 'Cars', journey_step: pathname.split('/').pop() || 'unknown' };
    if (pathname.includes('/travel/assistance')) return { journey_name: 'Assistance', journey_step: pathname.split('/').pop() || 'unknown' };
    if (pathname.includes('/my-trips')) return { journey_name: 'My Trips', journey_step: pathname.split('/').pop() || 'unknown' };
    return { journey_name: 'Core Navigation', journey_step: pathname === '/' ? 'Home' : pathname.replace('/', '') };
};

export const RouteTracker = () => {
    const location = useLocation();
    const { booking } = useBooking();

    useEffect(() => {
        const { journey_name, journey_step } = getJourneyInfo(location.pathname);
        
        // This is a global fallback page view.
        // We will pass the route explicitly.
        trackPageView(location.pathname, journey_name, journey_step, {
            booking_flow_id: booking.bookingFlowId,
            search: location.search
        });
    }, [location.pathname, location.search, booking.bookingFlowId]);

    return null;
};
