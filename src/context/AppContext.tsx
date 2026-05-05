import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/user';
import { Market } from '../types/market';
import { MARKETS, DEFAULT_MARKET } from '../data/markets';
import { BookingProvider } from './BookingContext';
import { identifyUser, resetAmplitudeUser, trackEvent } from '../lib/amplitude';

// Core Application Contexts

// Theme / App Context
interface AppContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}
export const AppContext = createContext<AppContextType>({ theme: 'light', toggleTheme: () => {} });

// User Context
interface UserContextType {
    user: User | null;
    setUser: (u: User | null) => void;
    loginUser: (u: User, method?: string) => void;
    logout: () => void;
}
export const UserContext = createContext<UserContextType>({ 
    user: null, 
    setUser: () => {},
    loginUser: () => {},
    logout: () => {}
});

// Market Context
interface MarketContextType {
    market: Market;
    setMarket: (m: Market) => void;
}
export const MarketContext = createContext<MarketContextType>({ market: DEFAULT_MARKET, setMarket: () => {} });

// Providers Component
export const AppProviders = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [market, setMarketState] = useState<Market>(DEFAULT_MARKET);
    const [theme, setTheme] = useState<'light'|'dark'>('light');

    // Hydration
    useEffect(() => {
        const storedMarket = localStorage.getItem('minders_fly_market');
        if (storedMarket) {
            try {
                setMarketState(JSON.parse(storedMarket));
            } catch(e) {}
        }

        const storedUser = localStorage.getItem('minders_fly_user');
        if (storedUser) {
            try {
                const u = JSON.parse(storedUser);
                setUserState(u);
                identifyUser(u, "hydrated_session");
            } catch(e) {}
        }
    }, []);

    const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

    const setUser = (u: User | null) => {
        setUserState(u);
        if (u) {
            localStorage.setItem('minders_fly_user', JSON.stringify(u));
        } else {
            localStorage.removeItem('minders_fly_user');
        }
    };

    const loginUser = (u: User, method: string = 'email') => {
        setUser(u);
        identifyUser(u, method);
    };

    const logout = () => {
        setUser(null);
        resetAmplitudeUser();
        trackEvent('User Logged Out', { method: 'click' });
    };

    const setMarket = (m: Market) => {
        setMarketState(m);
        localStorage.setItem('minders_fly_market', JSON.stringify(m));
    };

    return (
        <AppContext.Provider value={{ theme, toggleTheme }}>
            <UserContext.Provider value={{ user, setUser, loginUser, logout }}>
                <MarketContext.Provider value={{ market, setMarket }}>
                    <BookingProvider>
                        {children}
                    </BookingProvider>
                </MarketContext.Provider>
            </UserContext.Provider>
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
export const useUser = () => useContext(UserContext);
export const useMarket = () => useContext(MarketContext);
