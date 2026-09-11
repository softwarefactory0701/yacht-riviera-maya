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

export type PublicCategory =
  | "yachts"
  | "villas"
  | "mobility"
  | "dining"
  | "experiences"
  | "wellness"
  | "nightlife";

export interface PublicDestinationCatalogItem {
  slug: string;
  name: string;
  destinationId: Destination["id"];
  destination: string;
  category: PublicCategory;
  categoryLabel: string;
  images: string[];
  shortDescription: string;
  capacity: string;
  location: string;
  durations: string[];
  priceFrom: number;
  currency: "USD";
  highlights: string[];
  publicAvailabilityLabel: "Disponibilidad bajo confirmación";
}

export interface PublicDestinationCatalog {
  destinationId: Destination["id"];
  items: PublicDestinationCatalogItem[];
}

export interface PublicDiningExperience {
  slug: string;
  name: string;
  destinationId: Destination["id"];
  destination: string;
  type:
    | "Restaurant"
    | "Private Dining"
    | "Chef"
    | "Beach Club"
    | "Rooftop"
    | "Nightlife Dinner";
  moments: ("Lunch" | "Dinner" | "Sunset" | "Late Night")[];
  zone: string;
  group: "Couple" | "Small group" | "Large group";
  image: string;
  description: string;
  dressCode?: string;
  priceIndication?: string;
  includes: string[];
}

export interface CuratedExperience {
  id: string;
  name: string;
  destinationId: Destination["id"];
  destination: string;
  image: string;
  style: string;
  interests: string[];
  days: { day: string; activities: string[] }[];
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
