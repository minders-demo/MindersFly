export interface User {
  id: string;
  amplitudeUserId?: string;
  first_name: string;
  firstName?: string;
  last_name: string;
  lastName?: string;
  email: string;
  tier: 'silver' | 'gold' | 'platinum' | 'black' | 'none';
  miles_balance: number;
  loyalty_id: string;
  loyaltyId?: string;
  preferred_airport: string;
  customer_type: 'leisure' | 'business';
  country?: string;
  market?: string;
  language?: string;
  user_tier?: string;
  countryCode?: string;
  phone?: string;
  isDemoUser?: boolean;
}
