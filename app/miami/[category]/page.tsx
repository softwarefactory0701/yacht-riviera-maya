import {
  CategoryRoutePage,
  categoryMetadata,
} from "@/components/public/public-route-pages";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return categoryMetadata("miami", (await params).category);
}
export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return (
    <CategoryRoutePage
      destinationId="miami"
      category={(await params).category}
    />
  );
}
