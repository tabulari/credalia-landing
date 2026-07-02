import { createHash } from "crypto";

/**
 * Plain-text mirror of the consent copy rendered in Step3 (FormSteps.tsx).
 * Hashed and forwarded with every submission so Core can audit exactly which
 * consent-text version a user agreed to (Habeas Data traceability, IP-028 T8).
 *
 * Bump this string (and its hash changes automatically) whenever the
 * rendered consent copy changes materially.
 */
export const CONSENT_TEXT =
  "Autorizo el tratamiento de mis datos personales conforme a la Política de " +
  "Privacidad y la Ley 1581 de 2012 (Habeas Data).";

export const CONSENT_TEXT_SHA256 = createHash("sha256")
  .update(CONSENT_TEXT, "utf8")
  .digest("hex");
