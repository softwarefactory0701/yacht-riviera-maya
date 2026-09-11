import {
  CategoryRoutePage,
  categoryMetadata,
} from "@/components/public/public-route-pages";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return categoryMetadata("los-cabos", (await params).category);
}
export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return (
    <CategoryRoutePage
      destinationId="los-cabos"
      category={(await params).category}
    />
  );
}
