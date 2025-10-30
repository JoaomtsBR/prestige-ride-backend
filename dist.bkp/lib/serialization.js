"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDecimalsToNumbers = convertDecimalsToNumbers;
const client_1 = require("@prisma/client");
function convertDecimalsToNumbers(input) {
    // 1) Preserve Date objects (ou serialize explicitamente)
    if (input instanceof Date)
        return input.toISOString();
    // 2) Prisma Decimal -> number
    if (typeof (client_1.Prisma === null || client_1.Prisma === void 0 ? void 0 : client_1.Prisma.Decimal) !== "undefined" &&
        input instanceof client_1.Prisma.Decimal) {
        return input.toNumber();
    }
    // 3) Arrays
    if (Array.isArray(input))
        return input.map(convertDecimalsToNumbers);
    // 4) Objetos (evita transformar Date/Decimal em {})
    if (input && typeof input === "object") {
        const out = {};
        for (const [k, v] of Object.entries(input)) {
            out[k] = convertDecimalsToNumbers(v);
        }
        return out;
    }
    return input;
}
