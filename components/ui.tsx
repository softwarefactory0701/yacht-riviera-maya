"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect } from "react";
export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace("MX$", "$");
const statusLabels: Record<string, string> = {
  Available: "Disponible",
  Unavailable: "No disponible",
  Reserved: "Reservado",
  Operating: "En operación",
  Maintenance: "Mantenimiento",
  Occupied: "Ocupada",
  Confirmed: "Confirmada",
  Pending: "Pendiente",
  "In Progress": "En curso",
  Completed: "Completada",
  Cancelled: "Cancelada",
  Approved: "Aprobado",
  Active: "Activo",
  "On operation": "En operación",
  "50% paid": "50% pagado",
  Paid: "Pagado",
  Complete: "Completo",
  Returning: "Recurrente",
  New: "Nuevo",
  Corporate: "Empresa",
  Partner: "Socio",
};
const filterLabels: Record<string, string> = {
  All: "Todo",
  Available: "Disponibles",
  Reserved: "Reservados",
  Operating: "En operación",
  Maintenance: "Mantenimiento",
  Marine: "Yates",
  Stays: "Villas",
  Mobility: "Vehículos",
  Concierge: "Concierge",
  Day: "Día",
  Week: "Semana",
  Month: "Mes",
  Timeline: "Cronología",
  Overview: "Resumen",
  Bookings: "Reservas",
  Expenses: "Gastos",
  Documents: "Documentos",
  Confirmed: "Confirmadas",
  Pending: "Pendientes",
  "In Progress": "En curso",
  Completed: "Completadas",
  Cancelled: "Canceladas",
  VIP: "VIP",
  Returning: "Recurrentes",
  New: "Nuevos",
  Corporate: "Empresas",
  Partner: "Socios",
  Admin: "Administración",
  Operations: "Operaciones",
  Sales: "Ventas",
  Captain: "Capitanes",
  Driver: "Choferes",
  Finance: "Finanzas",
};
export function StatusBadge({ children }: { children: ReactNode }) {
  const s = String(children).toLowerCase();
  return (
    <span className={`status ${s.replaceAll(" ", "-")}`}>
      {statusLabels[String(children)] ?? children}
    </span>
  );
}
export function Page({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="page"
    >
      {children}
    </motion.main>
  );
}
export function Header({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  );
}
export function Filters({
  items,
  active,
  onChange,
}: {
  items: string[];
  active: string;
  onChange: (v: string) => void;
}) {
  const allLabel = items.includes("Confirmed")
    ? "Todas"
    : items.some((item) => ["Available", "VIP", "Admin"].includes(item))
      ? "Todos"
      : "Todo";
  return (
    <div className="filters">
      {items.map((i) => (
        <button
          onClick={() => onChange(i)}
          className={active === i ? "active" : ""}
          key={i}
        >
          {i === "All" ? allLabel : (filterLabels[i] ?? i)}
        </button>
      ))}
    </div>
  );
}
export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div
            className="modal-layer"
            role="presentation"
            onMouseDown={onClose}
          >
            <motion.div
              className="modal"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 5 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {children}
              <button
                className="modal-close"
                aria-label="Cerrar"
                onClick={onClose}
              >
                ×
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
export function Bars({ values }: { values: number[] }) {
  return (
    <div className="bars">
      {values.map((v, i) => (
        <motion.i
          initial={{ height: 0 }}
          animate={{ height: `${v}%` }}
          transition={{ delay: i * 0.04 }}
          key={i}
        />
      ))}
    </div>
  );
}
export function Toast({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="demo-toast"
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
        >
          <span>✓</span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
