import { Prisma } from "@prisma/client";

export function convertDecimalsToNumbers(input: any): any {
  // 1) Preserve Date objects (ou serialize explicitamente)
  if (input instanceof Date) return input.toISOString();

  // 2) Prisma Decimal -> number
  if (
    typeof Prisma?.Decimal !== "undefined" &&
    input instanceof Prisma.Decimal
  ) {
    return input.toNumber();
  }

  // 3) Arrays
  if (Array.isArray(input)) return input.map(convertDecimalsToNumbers);

  // 4) Objetos (evita transformar Date/Decimal em {})
  if (input && typeof input === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(input)) {
      out[k] = convertDecimalsToNumbers(v);
    }
    return out;
  }

  return input;
}
