import {
  DiningDetailRoute,
  diningDetailMetadata,
} from "@/components/public/dining-detail-route";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return diningDetailMetadata("los-cabos", (await params).slug);
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <DiningDetailRoute destinationId="los-cabos" slug={(await params).slug} />
  );
}
