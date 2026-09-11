import type { Metadata } from "next";
import { PublicHome } from "@/components/public/public-home";
import { destinations, publicCategories, publicYachts } from "@/mock/public";

export const metadata: Metadata = {
  title: "Yacht Riviera Maya | Private Concierge & Experiences",
  description:
    "Yates, villas, movilidad, dining y experiencias privadas en Riviera Maya, Miami y Los Cabos.",
};

export default function Home() {
  return (
    <PublicHome
      destinations={destinations}
      publicCategories={publicCategories}
      publicYachts={publicYachts}
    />
  );
}
