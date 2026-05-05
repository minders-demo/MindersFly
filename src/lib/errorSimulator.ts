export const errorConfig = [
  { id: 'insufficient_funds', code: 'PAY_402_INSUFFICIENT_FUNDS', msg: 'Fondos insuficientes para completar el pago simulado.', category: 'payment' },
  { id: 'payment_declined', code: 'PAY_DECLINED', msg: 'El pago fue rechazado por la entidad financiera simulada.', category: 'payment' },
  { id: 'wallet_balance_insufficient', code: 'WALLET_402_LOW_BALANCE', msg: 'El saldo de Wallet no alcanza para cubrir esta compra.', category: 'payment' },
  { id: 'internal_error', code: 'APP_500_INTERNAL_ERROR', msg: 'Ocurrió un error interno procesando la solicitud.', category: 'general' },
  { id: 'server_error', code: 'SERVER_503_UNAVAILABLE', msg: 'El servidor simulado no está disponible. Intenta de nuevo.', category: 'general' },
  { id: 'not_found', code: 'APP_404_NOT_FOUND', msg: 'No encontramos la reserva, vuelo o recurso solicitado.', category: 'search' },
  { id: 'reservation_timeout', code: 'BOOKING_408_TIMEOUT', msg: 'La reserva expiró antes de confirmar el pago.', category: 'checkout' },
  { id: 'seat_unavailable', code: 'SEAT_409_UNAVAILABLE', msg: 'El asiento seleccionado ya no está disponible.', category: 'seat_selection' },
  { id: 'baggage_pricing_error', code: 'BAG_502_PRICING_ERROR', msg: 'No pudimos calcular el precio del equipaje adicional.', category: 'baggage' },
  { id: 'upgrade_not_eligible', code: 'UPG_403_NOT_ELIGIBLE', msg: 'Este pasajero no es elegible para upgrade en este vuelo.', category: 'upgrade' },
  { id: 'partner_redirect_error', code: 'PARTNER_502_REDIRECT_FAILED', msg: 'No pudimos abrir el proveedor simulado.', category: 'partner' },
  { id: 'duplicate_booking', code: 'BOOKING_409_DUPLICATE', msg: 'Detectamos una posible reserva duplicada.', category: 'booking' }
];

export const errorSimulator = {
  shouldTriggerError: (
      context: { 
          step: string; 
          userTier?: string; 
          paymentMethod?: string;
          walletBalance?: number;
          amountStr?: number;
      }
  ): any | null => {
    // 1. Check Forced Errors first - strictly bound to the category
    const forcedErrors = errorSimulator.getForcedErrors();
    const forcedMatch = errorConfig.find(e => forcedErrors.includes(e.id));
    
    // Only return forced error if it matches the current step or is a 'general' error.
    if (forcedMatch && (forcedMatch.category === context.step || forcedMatch.category === 'general')) {
         return forcedMatch;
    }

    // Always succeed unless forced
    return null;
  },

  forceError: (errorType: string) => {
    localStorage.setItem(`force_error_${errorType}`, 'true');
    window.dispatchEvent(new Event('demo_errors_updated'));
  },

  clearForcedError: (errorType: string) => {
    localStorage.removeItem(`force_error_${errorType}`);
    window.dispatchEvent(new Event('demo_errors_updated'));
  },

  getForcedErrors: (): string[] => {
    const forced: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('force_error_')) {
            forced.push(key.replace('force_error_', ''));
        }
    }
    return forced;
  }
};
