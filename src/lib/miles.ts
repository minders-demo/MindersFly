import * as amplitude from '@amplitude/analytics-browser';
import { trackEvent } from './amplitude';
import { generateId } from './ids';

const API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;
const isAmplitudeEnabled = !!API_KEY && API_KEY !== 'YOUR_AMPLITUDE_API_KEY';

// ============================================================================
// MILES ACCRUAL RULES — Single source of truth.
// Cambiá los números acá y todo el flujo los toma automáticamente.
// ============================================================================
export const MILES_RULES: Record<string, number> = {
    flight: 890,
    hotel: 500,
    package: 1200,
    car: 200,
    assistance: 0, // no hay regla definida; queda en 0
};

export const getMilesForCategory = (category?: string | null): number => {
    if (!category) return 0;
    return MILES_RULES[category] ?? 0;
};

// ============================================================================
// Local user-cache: mantiene miles_balance en localStorage en sincronía
// para que la UI muestre el saldo nuevo sin esperar al backend.
// ============================================================================
const LS_USER_KEY = 'minders_fly_user';

const incrementLocalUserMiles = (delta: number): number | null => {
    const raw = localStorage.getItem(LS_USER_KEY);
    if (!raw) return null;
    try {
        const u = JSON.parse(raw);
        const current = typeof u.miles_balance === 'number' ? u.miles_balance : 0;
        u.miles_balance = current + delta;
        localStorage.setItem(LS_USER_KEY, JSON.stringify(u));
        return u.miles_balance;
    } catch {
        return null;
    }
};

// ============================================================================
// Public API: accumulateMiles
// ----------------------------------------------------------------------------
// 1) Manda el evento "Miles Accumulated" (Object/Action, alineado al resto
//    del tracking plan).
// 2) Incrementa `miles_balance` y `miles_lifetime_earned` como user properties
//    usando Identify.add() — la forma canónica de Amplitude para counters
//    atómicos (https://amplitude.com/docs/sdks/analytics/browser/browser-sdk-2).
// 3) Sincroniza el cache local del usuario.
// ============================================================================
export interface AccumulateMilesParams {
    miles_amount: number;
    partner_origin: string;            // 'minders_fly' para compras internas
    product_type: string;              // 'flight' | 'hotel' | 'package' | 'car' | 'ride' | ...
    transaction_id: string;
    partner_transaction_date?: string; // ISO string
    product_category?: string;
    currency?: string;
    amount_paid?: number;
    market?: string;
}

export interface AccumulateMilesResult {
    newBalance: number | null;
    milesAdded: number;
}

export const accumulateMiles = (params: AccumulateMilesParams): AccumulateMilesResult => {
    const milesAdded = params.miles_amount;
    if (milesAdded <= 0) {
        return { newBalance: null, milesAdded: 0 };
    }

    const ts = params.partner_transaction_date || new Date().toISOString();

    // 1) Evento
    trackEvent('Miles Accumulated', {
        accrual_id: generateId(),
        miles_amount: milesAdded,
        partner_origin: params.partner_origin,
        product_type: params.product_type,
        product_category: params.product_category,
        transaction_id: params.transaction_id,
        partner_transaction_date: ts,
        currency: params.currency,
        amount_paid: params.amount_paid,
        market: params.market,
    });

    // 2) User properties — increment atómico en Amplitude
    if (isAmplitudeEnabled) {
        const id = new amplitude.Identify();
        id.add('miles_balance', milesAdded);
        id.add('miles_lifetime_earned', milesAdded);
        id.set('last_miles_accumulated_at', ts);
        id.set('last_miles_partner_origin', params.partner_origin);
        amplitude.identify(id);
    }

    // 3) Cache local
    const newBalance = incrementLocalUserMiles(milesAdded);

    return { newBalance, milesAdded };
};
