import "server-only";
import { catalog } from "@/mock/business";
import {
  Destination,
  PublicCatalogItem,
  toPublicCatalogItem,
} from "@/lib/public-types";

export const destinations: Destination[] = [
  {
    id: "riviera-maya",
    name: "Riviera Maya",
    country: "México",
    heroImage: "/demo/yacht-main.jpg",
    description:
      "Mar turquesa, hospitalidad privada y días diseñados a tu ritmo.",
    active: true,
  },
  {
    id: "los-cabos",
    name: "Los Cabos",
    country: "México",
    heroImage: "/demo/yacht-alt.jpg",
    description:
      "El desierto se encuentra con el Pacífico en una escapada excepcional.",
    active: true,
  },
  {
    id: "miami",
    name: "Miami",
    country: "Estados Unidos",
    heroImage: "/demo/villa-alt.jpg",
    description:
      "Agua, arquitectura y energía para vivir la ciudad de otra manera.",
    active: true,
  },
];

const azimut = catalog.find((item) => item.id === "azimut-55");
if (!azimut) throw new Error("Public catalog requires Azimut 55");

export const publicYachts: PublicCatalogItem[] = [
  toPublicCatalogItem(azimut, "Riviera Maya"),
  {
    id: "sea-ray-48",
    name: "Sea Ray 48",
    destination: "Riviera Maya",
    capacity: "Hasta 12 personas",
    durations: ["4 h", "6 h", "8 h"],
    priceFrom: 4800,
    image: "/demo/yacht-alt.jpg",
  },
  {
    id: "sunseeker-60",
    name: "Sunseeker 60",
    destination: "Miami",
    capacity: "Hasta 13 personas",
    durations: ["4 h", "6 h", "8 h"],
    priceFrom: 7200,
    image: "/demo/yacht-main.jpg",
  },
  {
    id: "lagoon-42",
    name: "Lagoon 42",
    destination: "Los Cabos",
    capacity: "Hasta 15 personas",
    durations: ["4 h", "6 h"],
    priceFrom: 5600,
    image: "/demo/yacht-alt.jpg",
  },
];

export const publicCategories = [
  ["Yates", "/demo/yacht-alt.jpg", "large"],
  ["Villas", "/demo/villa.jpg", "large"],
  ["Movilidad", "/demo/mobility.jpg", "small"],
  ["Private Aviation", "/demo/jet.jpg", "small"],
  ["Dining", "/demo/experience.jpg", "small"],
  ["Nightlife", "/demo/villa-alt.jpg", "small"],
  ["Experiencias", "/demo/yacht-main.jpg", "large"],
  ["Wellness", "/demo/villa-alt.jpg", "small"],
  ["Seguridad", "/demo/mobility.jpg", "small"],
  ["Staff & Talent", "/demo/talent-woman-1.jpg", "small"],
  ["Real Estate", "/demo/villa.jpg", "small"],
  ["Transportación", "/demo/mobility.jpg", "small"],
] as const;
