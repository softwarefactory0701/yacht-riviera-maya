import { DiningPage } from "@/components/public/dining-page";
import { getPublicDestination, publicDining } from "@/mock/public";
export const metadata = { title: "Miami Dining & Private Tables | Yacht RM" };
export default function Page() {
  return (
    <DiningPage
      destination={getPublicDestination("miami")!}
      experiences={publicDining.filter(
        (item) => item.destinationId === "miami",
      )}
    />
  );
}
