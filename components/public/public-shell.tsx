"use client";

import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { PublicHeader } from "./public-header";
import Link from "next/link";

export function PublicPageShell({
  children,
  destination,
}: {
  children: ReactNode;
  destination: string;
}) {
  const [concierge, setConcierge] = useState(false);
  useEffect(() => {
    if (!concierge) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [concierge]);
  return (
    <main className="public-site">
      <PublicHeader onConcierge={() => setConcierge(true)} />
      {children}
      <button
        className="public-floating-concierge"
        onClick={() => setConcierge(true)}
      >
        <MessageCircle />
        <span>Hablar con concierge · {destination}</span>
      </button>
      <AnimatePresence>
        {concierge && (
          <div className="public-concierge-modal">
            <motion.button
              aria-label="Cerrar"
              onClick={() => setConcierge(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <button onClick={() => setConcierge(false)} aria-label="Cerrar">
                <X />
              </button>
              <span>PRIVATE CONCIERGE · {destination.toUpperCase()}</span>
              <h2>Concierge disponible</h2>
              <p>
                Compartinos la experiencia que imaginás. Este acceso es
                demostrativo y no envía información todavía.
              </p>
              <Link className="public-primary" href="/plan-your-stay">
                Diseñar mi viaje
              </Link>
              <small>Interacción de demostración · Sin envío de datos</small>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
