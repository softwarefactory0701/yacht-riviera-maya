import "server-only";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Destination, PublicCategory } from "@/lib/public-types";
import {
  getDestinationCatalog,
  getPublicDestination,
  publicCategoryLabels,
} from "@/mock/public";
import { PublicCategoryPage } from "./category-page";
import { ServiceDetailPage } from "./service-detail-page";

const categories = Object.keys(publicCategoryLabels) as PublicCategory[];
const resolve = (destinationId: string, category: string) => {
  const destination = getPublicDestination(destinationId);
  if (!destination || !categories.includes(category as PublicCategory))
    notFound();
  const typedCategory = category as PublicCategory;
  const items =
    getDestinationCatalog(destinationId)?.items.filter(
      (item) => item.category === typedCategory,
    ) ?? [];
  return { destination, category: typedCategory, items } as {
    destination: Destination;
    category: PublicCategory;
    items: typeof items;
  };
};

export async function categoryMetadata(
  destinationId: string,
  category: string,
): Promise<Metadata> {
  const { destination, category: validCategory } = resolve(
    destinationId,
    category,
  );
  const label = publicCategoryLabels[validCategory];
  const title =
    validCategory === "yachts"
      ? `Yachts in ${destination.name} | Yacht RM`
      : `${label} in ${destination.name} | Yacht RM`;
  return {
    title,
    description: `${label}, concierge y experiencias privadas en ${destination.name}, disponibles bajo confirmación.`,
  };
}

export function CategoryRoutePage({
  destinationId,
  category,
}: {
  destinationId: string;
  category: string;
}) {
  const {
    destination,
    category: validCategory,
    items,
  } = resolve(destinationId, category);
  return (
    <PublicCategoryPage
      destination={destination}
      categoryLabel={publicCategoryLabels[validCategory]}
      items={items}
    />
  );
}

export async function detailMetadata(
  destinationId: string,
  category: string,
  slug: string,
): Promise<Metadata> {
  const { destination, items } = resolve(destinationId, category);
  const item = items.find((candidate) => candidate.slug === slug);
  if (!item) notFound();
  return {
    title: `${item.name} | ${destination.name} | Yacht RM`,
    description: `${item.name} en ${destination.name}. ${item.shortDescription} Disponibilidad bajo confirmación.`,
  };
}

export function DetailRoutePage({
  destinationId,
  category,
  slug,
}: {
  destinationId: string;
  category: string;
  slug: string;
}) {
  const { destination, items } = resolve(destinationId, category);
  const item = items.find((candidate) => candidate.slug === slug);
  if (!item) notFound();
  const allItems = getDestinationCatalog(destinationId)!.items;
  const priorities: PublicCategory[] =
    item.category === "yachts"
      ? ["experiences", "mobility", "dining", "nightlife"]
      : ["dining", "mobility", "wellness", "yachts"];
  const crossSell = priorities
    .map((target) =>
      allItems.find((candidate) => candidate.category === target),
    )
    .filter((candidate): candidate is NonNullable<typeof candidate> =>
      Boolean(candidate),
    );
  return (
    <ServiceDetailPage
      destination={destination}
      item={item}
      crossSell={crossSell}
    />
  );
}
