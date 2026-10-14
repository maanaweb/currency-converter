const BASE_URL = 'https://api.frankfurter.dev/v1';

const CURRENCIES_PATH = '/currencies';
const LATEST_PATH = '/latest'

async function getData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return (await response.json()) as T;
}

interface CurrenciesResponse {
    [code: string]: string;
}

export async function fetchCurrencies(): Promise<CurrenciesResponse> {
    const data = await getData<CurrenciesResponse>(BASE_URL + CURRENCIES_PATH);

    return data;
}

interface LatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export async function fetchLatest(base: string, symbols: string): Promise<LatestResponse> {
    if(!base || !symbols) {
        throw new Error('base and symbols are required');
    }
    const query = `base=${base}&symbols=${symbols}`;

    const data = await getData<LatestResponse>(BASE_URL + LATEST_PATH + '?' + query);

    return data;
}

interface TimeSeriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  // '2026-08-10': {USD: 1.1555}
  rates: {[date: string]: {[code: string]: number}};
}

export async function fetchTimeSeries(base: string, symbols: string, from: string, to: string): Promise<TimeSeriesResponse> {
    if(!base || !symbols || !from || !to) {
        throw new Error('base, symbols, from, to are required');
    }  
    const path = `/${from}..${to}`
    const query = `base=${base}&symbols=${symbols}`;

    const data = await getData<TimeSeriesResponse>(BASE_URL + path + '?' + query);

    return data;
}