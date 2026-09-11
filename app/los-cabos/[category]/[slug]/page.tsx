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
  return detailMetadata("los-cabos", value.category, value.slug);
}
export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const value = await params;
  return (
    <DetailRoutePage
      destinationId="los-cabos"
      category={value.category}
      slug={value.slug}
    />
  );
}
