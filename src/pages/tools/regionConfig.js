/**
 * regionConfig.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared region / locale configuration for Aslisite document tools.
 *
 * India mode  → preserves all existing GST 2.0 logic, CGST/SGST/IGST, ₹,
 *               GSTIN, HSN/SAC, Place of Supply, amount-in-words (Rupees).
 *               This file adds ZERO changes to the India-mode code paths.
 *
 * Global mode → currency selector, flexible tax (None / VAT / Sales Tax /
 *               Custom), generic Tax ID field, IBAN/SWIFT bank details.
 *               ₹ and all GST-specific labels are replaced with locale-aware
 *               equivalents.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ── Currencies ─────────────────────────────────────────────── */
export const CURRENCIES = [
  { code: 'USD', symbol: '$',  name: 'US Dollar',         locale: 'en-US' },
  { code: 'EUR', symbol: '€',  name: 'Euro',               locale: 'de-DE' },
  { code: 'GBP', symbol: '£',  name: 'British Pound',      locale: 'en-GB' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham',        locale: 'ar-AE' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar',   locale: 'en-SG' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar',  locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar',    locale: 'en-CA' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal',       locale: 'ar-SA' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit',  locale: 'ms-MY' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen',       locale: 'ja-JP' },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan',       locale: 'zh-CN' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc',       locale: 'de-CH' },
  { code: 'OTHER', symbol: '', name: 'Other / Custom',     locale: 'en-US' },
];

/* ── Tax modes ──────────────────────────────────────────────── */
export const TAX_MODES = [
  { value: 'none',   label: 'No Tax' },
  { value: 'vat',    label: 'VAT' },
  { value: 'sales',  label: 'Sales Tax' },
  { value: 'custom', label: 'Custom Tax' },
];

/* ── Default global tax config ──────────────────────────────── */
export const DEFAULT_GLOBAL_TAX = {
  mode: 'vat',      // TAX_MODES value
  rate: '20',       // string so it can be empty in the field
  label: 'VAT',     // what prints on the document
};

/* ── Global payment methods ─────────────────────────────────── */
export const GLOBAL_PAYMENT_METHODS = [
  'Bank Transfer',
  'Wire Transfer',
  'Credit Card',
  'Debit Card',
  'PayPal',
  'Stripe',
  'Cheque',
  'Cash',
  'ACH Transfer',
  'SEPA Transfer',
  'Other',
];

/* ── India payment methods (kept as-is for India mode) ─────── */
export const INDIA_PAYMENT_METHODS = [
  'Cash', 'UPI', 'Bank Transfer (NEFT/RTGS)', 'IMPS',
  'Cheque', 'Credit Card', 'Debit Card', 'Other',
];

/* ── Helpers ────────────────────────────────────────────────── */

/**
 * Format a number as currency.
 * India mode: en-IN locale with minimumFractionDigits 2
 * Global mode: browser Intl with the chosen currency
 */
export const fmtAmount = (n, currencyCode = 'INR', isIndia = true) => {
  if (!Number.isFinite(n)) return '0.00';
  if (isIndia) {
    return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  // For currencies like JPY that have no decimals
  const noDecimals = ['JPY'];
  const decimals = noDecimals.includes(currencyCode) ? 0 : 2;
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

/**
 * Return the currency symbol/code prefix to show before an amount.
 * India → '₹ '
 * Global → symbol from CURRENCIES list, fallback to code + ' '
 */
export const currencyPrefix = (currencyCode = 'INR', customSymbol = '') => {
  if (currencyCode === 'INR') return '₹ ';
  if (currencyCode === 'OTHER') return customSymbol ? customSymbol + ' ' : '';
  const found = CURRENCIES.find((c) => c.code === currencyCode);
  return found ? found.symbol + ' ' : currencyCode + ' ';
};

/**
 * Build a complete formatted string: e.g. "₹ 1,00,000.00" or "$ 1,000.00"
 */
export const fmtCurrency = (n, currencyCode = 'INR', customSymbol = '', isIndia = true) => {
  return currencyPrefix(currencyCode, customSymbol) + fmtAmount(n, currencyCode, isIndia);
};

/**
 * Given a global tax config { mode, rate, label }, compute the tax amount on a base.
 * Returns 0 if mode === 'none'.
 */
export const calcGlobalTax = (base, taxConfig) => {
  if (taxConfig.mode === 'none') return 0;
  const rate = parseFloat(taxConfig.rate) || 0;
  return (base * rate) / 100;
};

/**
 * Get a human-readable tax line label for a document.
 * e.g. "VAT (20%)", "Sales Tax (8.5%)", "Custom Tax (15%)", "No Tax"
 */
export const taxLineLabel = (taxConfig) => {
  if (taxConfig.mode === 'none') return 'No Tax';
  const rate = taxConfig.rate ? ` (${taxConfig.rate}%)` : '';
  if (taxConfig.mode === 'vat')    return `VAT${rate}`;
  if (taxConfig.mode === 'sales')  return `Sales Tax${rate}`;
  if (taxConfig.mode === 'custom') return taxConfig.label ? `${taxConfig.label}${rate}` : `Tax${rate}`;
  return `Tax${rate}`;
};

/**
 * Default global bank fields (replaces India IFSC/UPI with IBAN/SWIFT)
 */
export const defaultGlobalBank = () => ({
  name: '', account: '', iban: '', swift: '', routing: '',
});

/**
 * Default India bank fields (preserved as-is)
 */
export const defaultIndiaBank = () => ({
  name: '', account: '', ifsc: '', branch: '', upi: '',
});

/* ── RegionSelector UI props helper ─────────────────────────── */
export const REGION_OPTIONS = [
  { value: 'india',  label: '🇮🇳 India (GST)',   description: 'GST 2.0, CGST/SGST/IGST, ₹, GSTIN' },
  { value: 'global', label: '🌐 Global',          description: 'Multi-currency, VAT / Sales Tax' },
];

/**
 * Detect whether the user is likely in India based on browser locale.
 * Returns 'india' if any preferred language starts with 'hi' or ends with '-IN'.
 * Returns 'global' for everyone else.
 * Falls back to 'global' in SSR / non-browser environments.
 */
export const detectRegion = () => {
  if (typeof navigator === 'undefined') return 'global';
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
  const isIndia = langs.some((l) => l.startsWith('hi') || l.toLowerCase().endsWith('-in'));
  return isIndia ? 'india' : 'global';
};
