import type { Metadata } from "next";
import { DiningPage } from "@/components/public/dining-page";
import { publicDining } from "@/mock/public";
export const metadata: Metadata = {
  title: "Dining & Private Experiences | Yacht RM",
  description:
    "Restaurantes, private dining y experiencias gastronómicas coordinadas en Riviera Maya, Miami y Los Cabos.",
};
export default function Page() {
  return <DiningPage experiences={publicDining} />;
}
