import {
  CategoryRoutePage,
  categoryMetadata,
} from "@/components/public/public-route-pages";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return categoryMetadata("riviera-maya", (await params).category);
}
export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return (
    <CategoryRoutePage
      destinationId="riviera-maya"
      category={(await params).category}
    />
  );
}
