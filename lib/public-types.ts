import type { CatalogItem } from "@/lib/types";

export interface Destination {
  id: "riviera-maya" | "miami" | "los-cabos";
  name: string;
  country: string;
  heroImage: string;
  description: string;
  active: boolean;
}

export interface PublicCatalogItem {
  id: string;
  name: string;
  destination: string;
  capacity: string;
  durations: string[];
  priceFrom: number;
  image: string;
}

export const toPublicCatalogItem = (
  item: CatalogItem,
  destination: string,
): PublicCatalogItem => ({
  id: item.id,
  name: item.name,
  destination,
  capacity: item.capacity,
  durations: item.rates.map((rate) => rate.duration),
  priceFrom: Math.min(...item.rates.map((rate) => rate.salePrice)),
  image: item.image,
});
