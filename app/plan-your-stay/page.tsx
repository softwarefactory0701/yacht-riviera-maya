import type { Metadata } from "next";
import { PlanStayPage } from "@/components/public/plan-stay-page";
import { curatedExperiences, destinations } from "@/mock/public";

export const metadata: Metadata = {
  title: "Plan Your Stay | Yacht RM Private Concierge",
  description:
    "Contanos tu viaje y diseñamos una experiencia completa en Riviera Maya, Miami o Los Cabos.",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ experience?: string; destination?: string }>;
}) {
  const query = await searchParams;
  const preset =
    curatedExperiences.find((item) => item.id === query.experience) ??
    destinations.find((item) => item.id === query.destination);
  return (
    <PlanStayPage
      destinations={destinations}
      curated={curatedExperiences}
      preset={preset}
    />
  );
}
