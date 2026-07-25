export interface RuntimeRatesConfig {
  monthlyRate: number;
  amountMin: number;
  amountMax: number;
  termOptions: number[];
}

type FetchLike = typeof fetch;

export function parseRatesConfig(payload: unknown): RuntimeRatesConfig | null {
  if (typeof payload !== "object" || payload === null) return null;

  const record = payload as Record<string, unknown>;
  const monthlyRate = Number(record.monthly_interest_rate);
  const amountMin = Number(record.min_amount);
  const amountMax = Number(record.max_amount);
  const termOptions = Array.isArray(record.term_options_months)
    ? record.term_options_months.map(Number)
    : [];

  if (
    !Number.isFinite(monthlyRate) ||
    monthlyRate <= 0 ||
    !Number.isFinite(amountMin) ||
    amountMin <= 0 ||
    !Number.isFinite(amountMax) ||
    amountMax <= amountMin ||
    termOptions.length === 0 ||
    termOptions.some((term) => !Number.isInteger(term) || term <= 0)
  ) {
    return null;
  }

  return {
    monthlyRate,
    amountMin,
    amountMax,
    termOptions: [...new Set(termOptions)].sort((a, b) => a - b),
  };
}

export async function loadRatesConfig(
  endpoint: string,
  fetchImpl: FetchLike = fetch,
): Promise<RuntimeRatesConfig | null> {
  try {
    const response = await fetchImpl(endpoint, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) return null;
    return parseRatesConfig(await response.json());
  } catch {
    return null;
  }
}
