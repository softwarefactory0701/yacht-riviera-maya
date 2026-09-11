import { DiningPage } from "@/components/public/dining-page";
import { getPublicDestination, publicDining } from "@/mock/public";
export const metadata = {
  title: "Los Cabos Dining & Private Tables | Yacht RM",
};
export default function Page() {
  return (
    <DiningPage
      destination={getPublicDestination("los-cabos")!}
      experiences={publicDining.filter(
        (item) => item.destinationId === "los-cabos",
      )}
    />
  );
}
