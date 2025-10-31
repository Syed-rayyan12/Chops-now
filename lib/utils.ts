import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Determine if a restaurant has completed the required setup fields
export function isRestaurantSetupComplete(r: any): boolean {
  if (!r) {
    console.log("❌ Setup check: No restaurant data")
    return false;
  }
  
  const nonEmpty = (v: any) => typeof v === "string" && v.trim().length > 0;
  const isNum = (v: any) => typeof v === "number" && !Number.isNaN(v);
  const isRealImage = (v: any) => nonEmpty(v) && !v.includes("placeholder");

  const checks = {
    name: nonEmpty(r.name),
    description: nonEmpty(r.description),
    image: isRealImage(r.image),
    coverImage: isRealImage(r.coverImage),
    cuisineType: nonEmpty(r.cuisineType),
    priceRange: nonEmpty(r.priceRange),
    openingHours: nonEmpty(r.openingHours),
    minimumOrder: isNum(r.minimumOrder) && r.minimumOrder > 0,
    deliveryFee: isNum(r.deliveryFee) && r.deliveryFee >= 0,
    serviceFee: isNum(r.serviceFee) && r.serviceFee >= 0,
    deliveryTime: nonEmpty(r.deliveryTime),
    phone: nonEmpty(r.phone),
    address: nonEmpty(r.address),
  };

  const missing = Object.entries(checks)
    .filter(([_, valid]) => !valid)
    .map(([field]) => field);

  const isComplete = missing.length === 0;

  console.log("🔍 Setup completeness check:", {
    isComplete,
    missing,
    data: {
      name: r.name,
      description: r.description?.substring(0, 50) + "...",
      image: r.image,
      coverImage: r.coverImage,
      cuisineType: r.cuisineType,
      priceRange: r.priceRange,
      openingHours: r.openingHours,
      minimumOrder: r.minimumOrder,
      deliveryFee: r.deliveryFee,
      serviceFee: r.serviceFee,
      deliveryTime: r.deliveryTime,
      phone: r.phone,
      address: r.address,
    },
  });

  return isComplete;
}
