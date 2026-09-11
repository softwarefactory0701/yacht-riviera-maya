import type { Metadata } from "next";
import { DestinationPage } from "@/components/public/destination-page";
import { destinations } from "@/mock/public";

export const metadata: Metadata = {
  title: "Los Cabos | Yacht RM Private Concierge",
};
export default function Page() {
  return (
    <DestinationPage
      destination={destinations.find((item) => item.id === "los-cabos")!}
    />
  );
}
