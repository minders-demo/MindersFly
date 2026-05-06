import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Flight } from '../types/flight';

export interface SearchConfig {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string | null;
    passengers: number;
    cabin: string;
}

export interface BookingState {
    bookingFlowId?: string;
    searchId?: string;
    checkoutId?: string;
    searchConfig: SearchConfig | null;
    outboundFlight: Flight | null;
    returnFlight: Flight | null;
    outboundFare: string | null;
    returnFare: string | null;
    passengers: any[];
    contact?: any;
    seats: any[];
    bags: any[];
    assistance: any | null;
    selectedAncillaries?: any[];
    extras: any[];
    totalAmount?: number;
    currency?: string;
    subtotal?: number;
    fees?: number;
    bagsTotal?: number;
    productCategory?: 'flight' | 'hotel' | 'package' | 'car' | 'assistance' | string;
}

interface BookingContextType {
    booking: BookingState;
    updateBooking: (updates: Partial<BookingState>) => void;
    clearBooking: () => void;
}

const defaultBooking: BookingState = {
    searchConfig: null,
    outboundFlight: null,
    returnFlight: null,
    outboundFare: null,
    returnFare: null,
    passengers: [],
    seats: [],
    bags: [],
    assistance: null,
    extras: [],
    selectedAncillaries: [],
    totalAmount: 0,
    currency: 'USD',
    subtotal: 0,
    fees: 0,
    bagsTotal: 0,
};

export const BookingContext = createContext<BookingContextType>({
    booking: defaultBooking,
    updateBooking: () => {},
    clearBooking: () => {},
});

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [booking, setBookingState] = useState<BookingState>(defaultBooking);

    useEffect(() => {
        const stored = localStorage.getItem('minders_fly_booking');
        if (stored) {
            try {
                setBookingState(JSON.parse(stored));
            } catch (e) {}
        }
    }, []);

    const updateBooking = (updates: Partial<BookingState>) => {
        setBookingState(prev => {
            const next = { ...prev, ...updates };
            localStorage.setItem('minders_fly_booking', JSON.stringify(next));
            return next;
        });
    };

    const clearBooking = () => {
        setBookingState(defaultBooking);
        localStorage.removeItem('minders_fly_booking');
    };

    return (
        <BookingContext.Provider value={{ booking, updateBooking, clearBooking }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
