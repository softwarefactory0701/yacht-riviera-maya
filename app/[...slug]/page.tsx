import { Dashboard } from "@/components/dashboard";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const allowed = new Set([
    "overview",
    "messages",
    "operations",
    "leads",
    "quotes",
    "bookings",
    "clients",
    "assets",
    "fleet",
    "suppliers",
    "talent",
    "finance",
    "team",
    "settings",
  ]);
  if (!slug.length || !allowed.has(slug[0])) notFound();
  return <Dashboard path={`/${slug.join("/")}`} />;
}
