import {
  DetailRoutePage,
  detailMetadata,
} from "@/components/public/public-route-pages";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const value = await params;
  return detailMetadata("riviera-maya", value.category, value.slug);
}
export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const value = await params;
  return (
    <DetailRoutePage
      destinationId="riviera-maya"
      category={value.category}
      slug={value.slug}
    />
  );
}
