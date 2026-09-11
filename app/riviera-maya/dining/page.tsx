import { DiningPage } from "@/components/public/dining-page";
import { getPublicDestination, publicDining } from "@/mock/public";
export const metadata = {
  title: "Riviera Maya Dining & Private Tables | Yacht RM",
};
export default function Page() {
  return (
    <DiningPage
      destination={getPublicDestination("riviera-maya")!}
      experiences={publicDining.filter(
        (item) => item.destinationId === "riviera-maya",
      )}
    />
  );
}
