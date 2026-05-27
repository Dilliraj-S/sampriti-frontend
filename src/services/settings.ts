import { api } from "./api.client";

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const res = await api.get<Record<string, string>>("/settings");
    if (res.status && res.data) return res.data;
  } catch {
    // fall through to default
  }
  return { currency: 'INR', store_name: 'Sampriti Botanicals', exchange_rate: '85' };
}

export function formatPrice(amount: number, currency?: string, exchangeRate?: number): string {
  const c = currency || 'INR';
  const rate = exchangeRate || 85;
  if (c === 'USD') return '$' + amount.toLocaleString('en-US');
  if (c === 'INR') return '\u20B9' + Math.round(amount * rate).toLocaleString('en-IN');
  return c + ' ' + amount;
}

export function getCurrencySymbol(currency?: string): string {
  if (currency === 'USD') return '$';
  if (currency === 'INR') return '\u20B9';
  return '\u20B9';
}