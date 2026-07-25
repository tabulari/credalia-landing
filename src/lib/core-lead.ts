import { createHash } from "node:crypto";
import type { ApplicationInput } from "./application-schema";
import { CONSENT_TEXT } from "./application-schema";

type FetchLike = typeof fetch;

export interface CoreLeadContext {
  applicationEndpoint: string;
  landingApiKey: string;
  clientIp: string;
  userAgent: string;
}

export interface CoreLeadResponse {
  radicado: string;
  application_id: string;
  customer_id: string;
  workspace_url: string | null;
}

export class CoreLeadError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

export function consentTextHash(): string {
  return createHash("sha256").update(CONSENT_TEXT, "utf8").digest("hex");
}

export function buildCoreLeadPayload(input: ApplicationInput, context: CoreLeadContext) {
  return {
    ...input,
    idNumber: input.idNumber.replace(/\D/g, ""),
    phone: input.phone.replace(/\D/g, ""),
    clientIp: context.clientIp,
    userAgent: context.userAgent,
    consentTextHash: consentTextHash(),
    terms: {
      amount: input.terms.amount,
      termMonths: input.terms.term,
      monthlyInterestRate: input.terms.monthlyRate,
      frequency: input.terms.frequency,
    },
  };
}

export async function forwardApplicationToCore(
  input: ApplicationInput,
  context: CoreLeadContext,
  fetchImpl: FetchLike = fetch,
): Promise<CoreLeadResponse> {
  const response = await fetchImpl(context.applicationEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Landing-Api-Key": context.landingApiKey,
    },
    body: JSON.stringify(buildCoreLeadPayload(input, context)),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new CoreLeadError("Core rejected the web lead", response.status);
  }

  const payload: unknown = await response.json();
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("radicado" in payload) ||
    typeof payload.radicado !== "string" ||
    !payload.radicado
  ) {
    throw new CoreLeadError("Core returned an invalid web-lead response");
  }

  return payload as CoreLeadResponse;
}
