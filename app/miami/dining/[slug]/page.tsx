import {
  DiningDetailRoute,
  diningDetailMetadata,
} from "@/components/public/dining-detail-route";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return diningDetailMetadata("miami", (await params).slug);
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <DiningDetailRoute destinationId="miami" slug={(await params).slug} />;
}
