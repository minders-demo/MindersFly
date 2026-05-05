import { Market } from '../types/market';

export const MARKETS: Market[] = [
  {
    country: "Colombia",
    market: "CO",
    language: "es-CO",
    currency: "USD",
    payment_methods: ["credit_card", "debit_card", "latam_wallet", "pse_safetypay"],
    local_payment_label: "PSE"
  },
  {
    country: "Chile",
    market: "CL",
    language: "es-CL",
    currency: "USD",
    payment_methods: ["credit_card", "debit_card", "latam_wallet", "debit_safetypay"],
    local_payment_label: "Pago débito"
  },
  {
    country: "Brasil",
    market: "BR",
    language: "pt-BR",
    currency: "USD",
    payment_methods: ["credit_card", "debit_card", "latam_wallet", "pix", "hipercard", "elo"],
    local_payment_label: "PIX"
  },
  {
    country: "Perú",
    market: "PE",
    language: "es-PE",
    currency: "USD",
    payment_methods: ["credit_card", "debit_card", "latam_wallet", "online_banking_safetypay"],
    local_payment_label: "Banca por internet"
  },
  {
    country: "Ecuador",
    market: "EC",
    language: "es-EC",
    currency: "USD",
    payment_methods: ["credit_card", "debit_card", "latam_wallet", "bank_transfer_safetypay"],
    local_payment_label: "Transferencia bancaria"
  },
  {
    country: "Argentina",
    market: "AR",
    language: "es-AR",
    currency: "USD",
    payment_methods: ["credit_card", "debit_card", "latam_wallet"],
    local_payment_label: "Tarjeta / Wallet"
  },
  {
    country: "Paraguay",
    market: "PY",
    language: "es-PY",
    currency: "USD",
    payment_methods: ["credit_card", "debit_card", "latam_wallet"],
    local_payment_label: "Tarjeta / Wallet"
  },
  {
    country: "Uruguay",
    market: "UY",
    language: "es-UY",
    currency: "USD",
    payment_methods: ["credit_card", "debit_card", "latam_wallet"],
    local_payment_label: "Tarjeta / Wallet"
  }
];

export const DEFAULT_MARKET = MARKETS[0];
