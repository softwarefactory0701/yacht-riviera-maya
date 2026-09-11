import {
  DiningDetailRoute,
  diningDetailMetadata,
} from "@/components/public/dining-detail-route";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return diningDetailMetadata("riviera-maya", (await params).slug);
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <DiningDetailRoute
      destinationId="riviera-maya"
      slug={(await params).slug}
    />
  );
}
