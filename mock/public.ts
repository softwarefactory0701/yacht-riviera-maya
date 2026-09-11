import "server-only";
import { catalog } from "@/mock/business";
import {
  Destination,
  PublicCatalogItem,
  PublicCategory,
  PublicDestinationCatalog,
  PublicDestinationCatalogItem,
  PublicDiningExperience,
  CuratedExperience,
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

export const publicCategoryLabels: Record<PublicCategory, string> = {
  yachts: "Yates",
  villas: "Villas",
  mobility: "Movilidad",
  dining: "Dining",
  experiences: "Experiencias",
  wellness: "Wellness",
  nightlife: "Nightlife",
};

const destinationInventory: Record<
  Destination["id"],
  Record<PublicCategory, string[]>
> = {
  "riviera-maya": {
    yachts: [
      "Azimut 55",
      "Sea Ray 48",
      "Sunseeker 60",
      "Lagoon 42",
      "Leopard 51",
    ],
    villas: ["Villa Ka'an", "Casa Mar Azul", "Villa Ocean", "Casa Cenote"],
    mobility: [
      "Mercedes Sprinter VIP",
      "Escalade",
      "Suburban High Country",
      "Mercedes V-Class",
    ],
    dining: ["Caribbean Table", "Jungle Private Dining", "Ocean Chef's Table"],
    experiences: [
      "Private Chef",
      "Private Cenote",
      "Sunset Experience",
      "Snorkeling",
      "Private Fishing",
      "Wellness at Villa",
    ],
    wellness: ["Villa Wellness Ritual", "Private Yoga", "Oceanfront Massage"],
    nightlife: [
      "Riviera After Dark",
      "Private Club Table",
      "Tulum Night Experience",
    ],
  },
  miami: {
    yachts: [
      "VanDutch 55",
      "Azimut 62",
      "Sunseeker 68",
      "Pershing 70",
      "Sea Ray 55",
    ],
    villas: [
      "Miami Beach Villa",
      "Venetian Islands Residence",
      "Key Biscayne Villa",
      "Waterfront Estate",
    ],
    mobility: [
      "Escalade",
      "Mercedes G63",
      "Mercedes Sprinter",
      "Lamborghini Urus",
      "Chauffeur",
    ],
    dining: [
      "South Beach Table",
      "Design District Dining",
      "Waterfront Private Dinner",
    ],
    experiences: [
      "Private Yacht",
      "Private Chef",
      "Nightlife",
      "Shopping Concierge",
      "Beach Day",
      "Wellness",
      "Private Driver",
    ],
    wellness: ["Private Wellness Suite", "Beach Yoga", "Recovery Ritual"],
    nightlife: ["Miami After Dark", "Private Table Request", "Rooftop Evening"],
  },
  "los-cabos": {
    yachts: ["Sunseeker 65", "Azimut 60", "Sea Ray 55", "Lagoon 46"],
    villas: [
      "Pedregal Villa",
      "Palmilla Residence",
      "Oceanfront Cabo Villa",
      "Private Estate",
    ],
    mobility: ["Escalade", "Suburban", "Sprinter VIP", "Private Driver"],
    dining: ["Pacific Table", "Desert Private Dining", "Cabo Chef's Table"],
    experiences: [
      "Sunset Yacht",
      "Private Chef",
      "ATV",
      "Golf",
      "Private Beach",
      "Wellness",
      "Fishing Experience",
    ],
    wellness: ["Desert Wellness Ritual", "Private Yoga", "Ocean Spa Day"],
    nightlife: ["Cabo After Dark", "Private Lounge", "Marina Evening"],
  },
};

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const imageFor = (category: PublicCategory, index: number) => {
  const images: Record<PublicCategory, string[]> = {
    yachts: ["/demo/yacht-main.jpg", "/demo/yacht-alt.jpg"],
    villas: ["/demo/villa.jpg", "/demo/villa-alt.jpg"],
    mobility: ["/demo/mobility.jpg", "/demo/jet.jpg"],
    dining: ["/demo/experience.jpg", "/demo/villa-alt.jpg"],
    experiences: ["/demo/yacht-alt.jpg", "/demo/experience.jpg"],
    wellness: ["/demo/villa-alt.jpg", "/demo/experience.jpg"],
    nightlife: ["/demo/mobility.jpg", "/demo/villa.jpg"],
  };
  return images[category][index % images[category].length];
};

const locations: Record<Destination["id"], string[]> = {
  "riviera-maya": ["Puerto Cancún", "Playa del Carmen", "Tulum"],
  miami: ["Miami Beach", "Biscayne Bay", "Key Biscayne"],
  "los-cabos": ["Cabo San Lucas", "Palmilla", "Puerto Los Cabos"],
};

export const destinationCatalogs: PublicDestinationCatalog[] = destinations.map(
  (destination, destinationIndex) => ({
    destinationId: destination.id,
    items: (
      Object.keys(destinationInventory[destination.id]) as PublicCategory[]
    ).flatMap((category) =>
      destinationInventory[destination.id][category].map(
        (name, index): PublicDestinationCatalogItem => {
          const image = imageFor(category, index);
          const isYacht = category === "yachts";
          return {
            slug: slugify(name),
            name,
            destinationId: destination.id,
            destination: destination.name,
            category,
            categoryLabel: publicCategoryLabels[category],
            images: [
              image,
              imageFor(category, index + 1),
              "/demo/experience.jpg",
            ],
            shortDescription: isYacht
              ? "Una experiencia privada en el agua, coordinada alrededor de tu grupo."
              : `${publicCategoryLabels[category]} seleccionado por Yacht RM para una estadía excepcional.`,
            capacity: isYacht
              ? `Hasta ${10 + index * 2} personas`
              : category === "villas"
                ? `Hasta ${8 + index * 2} huéspedes`
                : "Servicio privado",
            location:
              locations[destination.id][
                index % locations[destination.id].length
              ],
            durations: isYacht
              ? ["4 horas", "6 horas", "8 horas"]
              : ["Experiencia", "Medio día", "Día completo"],
            priceFrom: isYacht
              ? 4800 + destinationIndex * 500 + index * 750
              : 350 + destinationIndex * 100 + index * 180,
            currency: "USD",
            highlights: isYacht
              ? [
                  "Tripulación",
                  "Agua y hielo",
                  "Bluetooth",
                  "Snorkel",
                  "Toallas",
                ]
              : [
                  "Coordinación concierge",
                  "Experiencia privada",
                  "Atención personalizada",
                ],
            publicAvailabilityLabel: "Disponibilidad bajo confirmación",
          };
        },
      ),
    ),
  }),
);

export const getPublicDestination = (id: string) =>
  destinations.find((item) => item.id === id);
export const getDestinationCatalog = (id: string) =>
  destinationCatalogs.find((item) => item.destinationId === id);

const diningNames: Record<Destination["id"], string[]> = {
  "riviera-maya": [
    "Private Chef at Villa",
    "Sunset Dinner",
    "Dinner on Board",
    "Jungle Table",
    "Chef + Bartender Experience",
    "Villa Celebration Dinner",
  ],
  miami: [
    "Private Dinner at Your Villa",
    "South Beach Table",
    "Dinner on Board",
    "Design District Evening",
    "Rooftop Dinner",
    "Private Mixology Experience",
  ],
  "los-cabos": [
    "Pacific Sunset Dinner",
    "Private Chef at Villa",
    "Dinner on Board",
    "Palmilla Table",
    "Desert Chef Experience",
    "Villa Celebration Dinner",
  ],
};
const diningTypes: PublicDiningExperience["type"][] = [
  "Private Dining",
  "Restaurant",
  "Chef",
  "Beach Club",
  "Rooftop",
  "Nightlife Dinner",
];
const diningMoments: PublicDiningExperience["moments"][] = [
  ["Dinner"],
  ["Lunch", "Dinner"],
  ["Sunset", "Dinner"],
  ["Lunch", "Sunset"],
  ["Dinner", "Late Night"],
  ["Dinner"],
];
const diningGroups: PublicDiningExperience["group"][] = [
  "Small group",
  "Couple",
  "Large group",
];

export const publicDining: PublicDiningExperience[] = destinations.flatMap(
  (destination) =>
    diningNames[destination.id].map((name, index) => ({
      slug: slugify(name),
      name,
      destinationId: destination.id,
      destination: destination.name,
      type: diningTypes[index],
      moments: diningMoments[index],
      zone: locations[destination.id][index % locations[destination.id].length],
      group: diningGroups[index % diningGroups.length],
      image: index % 2 ? "/demo/villa-alt.jpg" : "/demo/experience.jpg",
      description:
        "Una experiencia gastronómica coordinada por Yacht RM y disponible para solicitud concierge.",
      dressCode: index % 2 ? "Smart elegant" : undefined,
      priceIndication:
        index % 3 === 0 ? "Experiencia personalizada" : "Según selección",
      includes: [
        "Coordinación concierge",
        "Solicitud y seguimiento",
        "Personalización de la experiencia",
      ],
    })),
);

export const curatedExperiences: CuratedExperience[] = [
  {
    id: "miami-weekend",
    name: "Miami Weekend",
    destinationId: "miami",
    destination: "Miami",
    image: "/demo/villa-alt.jpg",
    style: "Luxury Weekend",
    interests: ["Yacht", "Villa", "Dining", "Nightlife", "Transport"],
    days: [
      {
        day: "01",
        activities: ["Airport Pickup", "Villa Check-in", "Private Dinner"],
      },
      { day: "02", activities: ["Yacht", "Sunset", "Nightlife"] },
      { day: "03", activities: ["Beach Club", "Wellness", "Chauffeur"] },
    ],
  },
  {
    id: "riviera-private-escape",
    name: "Riviera Private Escape",
    destinationId: "riviera-maya",
    destination: "Riviera Maya",
    image: "/demo/yacht-main.jpg",
    style: "Relax",
    interests: [
      "Transport",
      "Villa",
      "Private Chef",
      "Yacht",
      "Dining",
      "Wellness",
    ],
    days: [
      { day: "01", activities: ["Transfer", "Villa", "Chef"] },
      { day: "02", activities: ["Yacht", "Snorkel", "Dinner"] },
      { day: "03", activities: ["Cenote", "Wellness"] },
    ],
  },
  {
    id: "cabos-celebration",
    name: "Cabos Celebration",
    destinationId: "los-cabos",
    destination: "Los Cabos",
    image: "/demo/yacht-alt.jpg",
    style: "Celebration",
    interests: ["Yacht", "Private Chef", "Villa", "Nightlife", "Transport"],
    days: [
      {
        day: "01",
        activities: ["Private Transfer", "Villa", "Welcome Dinner"],
      },
      { day: "02", activities: ["Yacht", "Private Chef", "Nightlife"] },
      { day: "03", activities: ["Beach", "Wellness"] },
    ],
  },
];
