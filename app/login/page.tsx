import type { Metadata } from "next";
import { LoginScreen } from "@/components/login-screen";

export const metadata: Metadata = {
  title: "Yacht Riviera Maya — Acceso",
  description: "Acceso privado a Yacht Riviera Maya Concierge OS.",
};

export default function LoginPage() {
  return <LoginScreen />;
}
