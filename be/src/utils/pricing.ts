import { Prisma, type MembershipLevel, type ServiceType } from "@prisma/client";

const MEMBERSHIP_DISCOUNT: Record<MembershipLevel, number> = {
  BRONZE: 0,
  SILVER: 5,
  GOLD: 10,
  PLATINUM: 15,
};

interface PricingInput {
  serviceType: ServiceType;
  basePrice: number;
  pricePerKg?: number | null;
  expressPct?: number;
  weight?: number | null;
  itemCount?: number | null;
  membershipLevel?: MembershipLevel;
  isWeekend?: boolean;
}

export function calculateOrderTotal(input: PricingInput) {
  const {
    serviceType,
    basePrice,
    pricePerKg = 0,
    expressPct = 30,
    weight,
    itemCount,
    membershipLevel = "BRONZE",
    isWeekend = false,
  } = input;

  let subtotal = basePrice;

  if (serviceType === "KILOAN" && weight && pricePerKg) {
    subtotal = weight * pricePerKg;
    if (weight > 10) subtotal *= 0.95;
  } else if (serviceType === "SATUAN" && itemCount) {
    subtotal = basePrice * itemCount;
  }

  let surcharge = 0;
  if (serviceType === "EXPRESS") {
    surcharge = subtotal * (expressPct / 100);
  }
  if (isWeekend) {
    surcharge += subtotal * 0.1;
  }

  const discountPct = MEMBERSHIP_DISCOUNT[membershipLevel];
  const discount = subtotal * (discountPct / 100);
  const total = Math.max(0, subtotal + surcharge - discount);

  return {
    subtotal: round2(subtotal),
    surcharge: round2(surcharge),
    discount: round2(discount),
    total: round2(total),
    unitPrice: round2(basePrice),
  };
}

function round2(n: number) {
  return new Prisma.Decimal(n.toFixed(2));
}

export function estimateFinishDate(serviceType: ServiceType): Date {
  const hours: Record<ServiceType, number> = {
    REGULER: 48,
    EXPRESS: 12,
    SATUAN: 24,
    KILOAN: 36,
  };
  const d = new Date();
  d.setHours(d.getHours() + hours[serviceType]);
  return d;
}
