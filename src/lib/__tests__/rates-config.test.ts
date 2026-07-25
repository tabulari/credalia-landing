import { describe, expect, it, vi } from "vitest";
import { loadRatesConfig, parseRatesConfig } from "../rates-config";

const validPayload = {
  monthly_interest_rate: "0.0320",
  min_amount: "60000.00",
  max_amount: "1200000.00",
  term_options_months: [12, 3, 6, 6],
};

describe("dynamic rates config", () => {
  it("normalizes Core decimals and terms", () => {
    expect(parseRatesConfig(validPayload)).toEqual({
      monthlyRate: 0.032,
      amountMin: 60000,
      amountMax: 1200000,
      termOptions: [3, 6, 12],
    });
  });

  it("rejects malformed or unsafe config", () => {
    expect(parseRatesConfig({ ...validPayload, monthly_interest_rate: "invalid" })).toBeNull();
    expect(parseRatesConfig({ ...validPayload, max_amount: "50000" })).toBeNull();
    expect(parseRatesConfig({ ...validPayload, term_options_months: [] })).toBeNull();
  });

  it("returns null when Core is down so the provider retains static defaults", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error("offline"));

    await expect(
      loadRatesConfig("https://core.example.com/api/v1/sessions/rates-config", fetchMock),
    ).resolves.toBeNull();
  });
});
