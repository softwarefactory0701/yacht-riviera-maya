export type Status =
  | "Available"
  | "Reserved"
  | "Operating"
  | "Maintenance"
  | "Occupied"
  | "Confirmed"
  | "Pending"
  | "Completed";
export interface Yacht {
  id: string;
  name: string;
  feet: number;
  guests: number;
  location: string;
  status: Status;
  revenue: number;
  bookings: number;
  image: string;
}
export interface Client {
  id: string;
  name: string;
  type: "VIP" | "Returning" | "New" | "Corporate" | "Partner";
  location: string;
  ltv: number;
  bookings: number;
  last: string;
  preferred: string;
}
export interface Booking {
  id: string;
  client: string;
  asset: string;
  date: string;
  time: string;
  value: number;
  payment: string;
  status: string;
}
export interface Service {
  name: string;
  available: boolean;
  provider: string;
  cost: number;
  price: number;
}
export interface TeamMember {
  name: string;
  role: string;
  bookings?: number;
  sales?: number;
  commission?: number;
  status?: string;
}
export type LeadStage =
  | "Nuevo"
  | "Contactado"
  | "Armando propuesta"
  | "Cotización enviada"
  | "Negociación"
  | "Confirmado"
  | "Perdido";
export interface Lead {
  id: string;
  name: string;
  country: string;
  phone: string;
  date: string;
  guests: number;
  stay: string;
  budget: number;
  interest: string;
  source: string;
  owner: string;
  lastContact: string;
  nextAction: string;
  stage: LeadStage;
  notes: string;
}
export interface RatePlan {
  duration: string;
  supplierCost: number;
  salePrice: number;
  season: "Regular" | "Alta" | "Semana Santa";
  adjustment?: number;
  validUntil: string;
}
export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  supplierId: string;
  capacity: string;
  location: string;
  status: string;
  image: string;
  rates: RatePlan[];
  departures?: string[];
  conditions: string;
}
export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
  zone: string;
  services: string[];
  terms: string;
  response: string;
  operations: number;
  purchased: number;
  rating: number;
  notes: string;
}
export interface TalentProfile {
  id: string;
  name: string;
  category: string;
  languages: string[];
  zone: string;
  cost: number;
  salePrice: number;
  contact: string;
  agency?: string;
  availability: string;
  image: string;
  notes: string;
}
export interface QuoteItem {
  id: string;
  service: string;
  supplier: string;
  quantity: number;
  cost: number;
  salePrice: number;
}
export interface MarginSummary {
  totalSale: number;
  supplierCost: number;
  otherCosts: number;
  margin: number;
  marginPercent: number;
}
export const calculateMargin = (
  items: QuoteItem[],
  otherCosts = 0,
): MarginSummary => {
  const totalSale = items.reduce((s, i) => s + i.salePrice * i.quantity, 0);
  const supplierCost = items.reduce((s, i) => s + i.cost * i.quantity, 0);
  const margin = totalSale - supplierCost - otherCosts;
  return {
    totalSale,
    supplierCost,
    otherCosts,
    margin,
    marginPercent: totalSale ? (margin / totalSale) * 100 : 0,
  };
};
