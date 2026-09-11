"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type BranchId = "global" | "riviera-maya" | "miami" | "los-cabos";
export type OperationalDestinationId = Exclude<BranchId, "global">;
export interface Branch {
  id: BranchId;
  name: string;
  shortName: string;
  type: "global" | "branch";
  country?: string;
  currency: "USD";
  timezone: string;
}

export const branches: Branch[] = [
  {
    id: "global",
    name: "Yacht RM Global",
    shortName: "Global",
    type: "global",
    currency: "USD",
    timezone: "Global",
  },
  {
    id: "riviera-maya",
    name: "Riviera Maya",
    shortName: "Riviera Maya",
    type: "branch",
    country: "México",
    currency: "USD",
    timezone: "America/Cancun",
  },
  {
    id: "miami",
    name: "Miami",
    shortName: "Miami",
    type: "branch",
    country: "Estados Unidos",
    currency: "USD",
    timezone: "America/New_York",
  },
  {
    id: "los-cabos",
    name: "Los Cabos",
    shortName: "Los Cabos",
    type: "branch",
    country: "México",
    currency: "USD",
    timezone: "America/Mazatlan",
  },
];
export const operationalDestinationIds: OperationalDestinationId[] = [
  "riviera-maya",
  "miami",
  "los-cabos",
];
export const destinationForIndex = (index: number): OperationalDestinationId =>
  operationalDestinationIds[index % operationalDestinationIds.length];
export const destinationName = (id: OperationalDestinationId) =>
  branches.find((branch) => branch.id === id)!.shortName;
export const filterForBranch = <T,>(
  items: T[],
  active: BranchId,
  destinations: (item: T) => OperationalDestinationId[],
) =>
  active === "global"
    ? items
    : items.filter((item) => destinations(item).includes(active));

type DestinationContextValue = {
  activeId: BranchId;
  activeBranch: Branch;
  setActiveId: (id: BranchId) => void;
};
const DestinationContext = createContext<DestinationContextValue | null>(null);

export function DestinationProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveIdState] = useState<BranchId>("global");
  useEffect(() => {
    const stored = sessionStorage.getItem(
      "yrm-active-destination",
    ) as BranchId | null;
    if (stored && branches.some((branch) => branch.id === stored))
      queueMicrotask(() => setActiveIdState(stored));
  }, []);
  const setActiveId = (id: BranchId) => {
    setActiveIdState(id);
    sessionStorage.setItem("yrm-active-destination", id);
  };
  return (
    <DestinationContext.Provider
      value={{
        activeId,
        activeBranch: branches.find((branch) => branch.id === activeId)!,
        setActiveId,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
}
export function useDestination() {
  const value = useContext(DestinationContext);
  if (!value)
    throw new Error("useDestination must be used inside DestinationProvider");
  return value;
}
