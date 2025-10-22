import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEther(wei: bigint | string | number): string {
  const weiNum =
    typeof wei === "string"
      ? BigInt(wei)
      : typeof wei === "number"
      ? BigInt(wei)
      : wei;
  const etherNum = Number(weiNum) / 1e18;
  return etherNum.toFixed(4);
}

export function parseEther(ether: string): bigint {
  const [whole, decimal] = ether.split(".");
  const decimalPlaces = decimal?.length ?? 0;
  const paddedDecimal = (decimal ?? "0").padEnd(18, "0");
  return BigInt(whole + paddedDecimal);
}

export function parseBigInt(price: bigint) {
  return Number(price) / 1e18;
}
