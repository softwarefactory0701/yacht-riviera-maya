import "server-only";
import { notFound } from "next/navigation";
import { DiningDetailPage } from "./dining-page";
import { getPublicDestination, publicDining } from "@/mock/public";

export function DiningDetailRoute({
  destinationId,
  slug,
}: {
  destinationId: string;
  slug: string;
}) {
  const destination = getPublicDestination(destinationId);
  const experience = publicDining.find(
    (item) => item.destinationId === destinationId && item.slug === slug,
  );
  if (!destination || !experience) notFound();
  const recommendations = publicDining
    .filter(
      (item) => item.destinationId === destinationId && item.slug !== slug,
    )
    .slice(0, 3);
  return (
    <DiningDetailPage
      destination={destination}
      experience={experience}
      recommendations={recommendations}
    />
  );
}
export function diningDetailMetadata(destinationId: string, slug: string) {
  const item = publicDining.find(
    (experience) =>
      experience.destinationId === destinationId && experience.slug === slug,
  );
  if (!item) notFound();
  return {
    title: `${item.name} | Dining ${item.destination} | Yacht RM`,
    description: `${item.description} Reserva bajo confirmación concierge.`,
  };
}
