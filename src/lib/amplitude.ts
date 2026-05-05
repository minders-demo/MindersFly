import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';
import { BaseEventProperties, TrackedEvent } from '../types/analytics';
import { User } from '../types/user';
import { generateId, generateSessionId } from './ids';
import { getDeviceType, getViewportSize } from './device';
import { eventDebugger } from './eventDebugger';
import { generateStableUserIdSync } from './userIdentity';

const API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

// Keep track of session info for local events
let currentSessionId = sessionStorage.getItem('minders_fly_session_id');
if (!currentSessionId) {
    currentSessionId = generateSessionId();
    sessionStorage.setItem('minders_fly_session_id', currentSessionId);
}

let anonymousId = localStorage.getItem('minders_fly_anon_id');
if (!anonymousId) {
  anonymousId = generateId();
  localStorage.setItem('minders_fly_anon_id', anonymousId);
}

export const resolveUserId = (user: User | null | undefined): string | undefined => {
    if (!user) return undefined;
    return user.amplitudeUserId || user.id || (user.email ? generateStableUserIdSync(user.email) : undefined);
};

let currentUserId: string | undefined;

export const initAmplitude = () => {
    const userStr = localStorage.getItem('minders_fly_user');
    if (userStr) {
        try {
            const u = JSON.parse(userStr);
            currentUserId = resolveUserId(u);
        } catch(e) {}
    }

  if (API_KEY && API_KEY !== 'YOUR_AMPLITUDE_API_KEY') {
    amplitude.add(sessionReplayPlugin({
        sampleRate: 1.0,                    
        privacyConfig: {
          blockSelector: ['[data-private]', 'input[type="password"]', 'input[name="cvc"]', 'input[name="number"]'],
          maskSelector: ['input[name="email"]', 'input[name="phone"]'],
        },
    }));

    amplitude.init(API_KEY, currentUserId, {
      deviceId: anonymousId,
      defaultTracking: {
        pageViews: false,        // Manejado vía RouteTracker
        sessions: true,
        formInteractions: false,
        fileDownloads: true,
      },
      autocapture: {
        attribution: true,
        pageViews: false,
        sessions: true,
        formInteractions: true,
        fileDownloads: true,
        elementInteractions: true,
      },
      flushIntervalMillis: 1000,
      serverZone: import.meta.env.VITE_AMPLITUDE_SERVER_ZONE || 'US',
    });
  } else {
    console.warn('Amplitude API Key missing. Running in local debug mode only.');
  }
};

export const identifyUser = (user: User, method: string = 'email') => {
  currentUserId = resolveUserId(user);

  if (API_KEY && API_KEY !== 'YOUR_AMPLITUDE_API_KEY') {
    amplitude.setUserId(currentUserId);
    
    const identifyObj = new amplitude.Identify();
    // Use setOnce for stable demographics
    if (user.email) identifyObj.setOnce('email', user.email);
    if (user.firstName || user.first_name) identifyObj.setOnce('first_name', user.firstName || user.first_name);
    if (user.lastName || user.last_name) identifyObj.setOnce('last_name', user.lastName || user.last_name);
    if (user.countryCode) identifyObj.setOnce('country_code', user.countryCode);
    if (user.phone) identifyObj.setOnce('phone_number', user.phone);
    if (user.country) identifyObj.setOnce('country', user.country);
    if (user.market) identifyObj.setOnce('market', user.market);
    if (user.language) identifyObj.setOnce('language', user.language);
    identifyObj.setOnce('signup_method', method);
    if (user.loyaltyId || user.loyalty_id) identifyObj.setOnce('loyalty_id', user.loyaltyId || user.loyalty_id);
    
    identifyObj.setOnce('first_seen_at', new Date().toISOString());
    identifyObj.set('last_seen_at', new Date().toISOString());

    // Mutable state
    identifyObj.set('login_method', method);
    identifyObj.set('user_tier', user.user_tier || user.tier || 'none');
    if (user.miles_balance !== undefined) identifyObj.set('miles_balance', user.miles_balance);
    if (user.preferred_airport) identifyObj.set('preferred_airport', user.preferred_airport);
    if (user.customer_type) identifyObj.set('customer_type', user.customer_type);
    
    amplitude.identify(identifyObj);
  }
};

export const resetAmplitudeUser = () => {
  currentUserId = undefined;
  sessionStorage.removeItem('minders_fly_session_id'); // Regenerate session id
  currentSessionId = generateSessionId();
  sessionStorage.setItem('minders_fly_session_id', currentSessionId);

  if (API_KEY && API_KEY !== 'YOUR_AMPLITUDE_API_KEY') {
    amplitude.reset();
  }
};

const getBaseProperties = (): Partial<BaseEventProperties> => {
  const marketContextStr = localStorage.getItem('minders_fly_market');
  let marketData = { country: 'Unknown', market: 'Unknown', language: 'Unknown' };
  if (marketContextStr) {
    try {
      marketData = JSON.parse(marketContextStr);
    } catch(e) {}
  }

  const userContextStr = localStorage.getItem('minders_fly_user');
  let userTier = 'none';
  if (userContextStr) {
    try {
      const u = JSON.parse(userContextStr);
      userTier = u.user_tier || u.tier || 'none';
    } catch(e) {}
  }
  
  const width = window.innerWidth;
  const expType = width < 768 ? 'mobile_web' : 'desktop_web';
  
  return {
    client_event_id: generateId(),
    client_event_timestamp: Date.now(),
    session_id: currentSessionId!,
    anonymous_id: anonymousId!,
    user_id: currentUserId,
    country: marketData.country,
    market: marketData.market,
    language: marketData.language,
    user_tier: userTier,
    device_type: getDeviceType(),
    viewport_size: getViewportSize(),
    experience_type: expType as 'desktop_web' | 'mobile_web' | 'pwa',
    app_version: '1.0.0',
    environment: import.meta.env.PROD ? 'production' : 'development',
    is_logged_in: !!currentUserId
  };
};

export const trackEvent = (eventName: string, eventProperties: Record<string, any> = {}) => {
  const baseProperties = getBaseProperties();
  const properties = {
    ...baseProperties,
    ...eventProperties,
  } as BaseEventProperties;

  const event: TrackedEvent = {
    id: generateId(),
    timestamp: Date.now(),
    event_name: eventName,
    properties,
  };

  // Log locally always
  eventDebugger.logEvent(event);

  // Send to Amplitude if initialized
  if (API_KEY && API_KEY !== 'YOUR_AMPLITUDE_API_KEY') {
    amplitude.track(eventName, properties);
  }
};

export const trackPageView = (
  routeName: string,
  journeyName: string = 'Core Navigation',
  journeyStep: string = 'view',
  extraProperties: Record<string, any> = {}
) => {
  trackEvent('Page Viewed', {
    ...extraProperties,
    route: routeName,
    page_name: routeName,
    journey_name: journeyName,
    journey_step: journeyStep,
  });
};

export const trackError = (errorPayload: Record<string, any>) => {
  trackEvent('Transaction Error Occurred', { ...errorPayload });
};

export const trackRevenue = (props: {
    productId: string,
    price: number,
    quantity?: number,
    currency?: string,
    revenueType?: string,
    eventProperties?: Record<string, any>
}) => {
    if (API_KEY && API_KEY !== 'YOUR_AMPLITUDE_API_KEY') {
        const revenue = new amplitude.Revenue()
            .setProductId(props.productId)
            .setPrice(props.price)
            .setQuantity(props.quantity || 1)
            .setRevenueType(props.revenueType || 'purchase')
            .setEventProperties(props.eventProperties || {});
        amplitude.revenue(revenue);
    }
};
