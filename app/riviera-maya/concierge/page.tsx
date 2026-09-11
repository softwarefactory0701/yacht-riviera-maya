import { ConciergePage } from "@/components/public/concierge-page";
import { getPublicDestination } from "@/mock/public";
export const metadata = { title: "Riviera Maya Private Concierge | Yacht RM" };
export default function Page() {
  return <ConciergePage destination={getPublicDestination("riviera-maya")!} />;
}
