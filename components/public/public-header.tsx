"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PublicLogo() {
  return (
    <Link className="public-logo" href="/" aria-label="Yacht RM — Inicio">
      <span>YACHT</span>
      <strong>RM</strong>
    </Link>
  );
}

export function PublicHeader({ onConcierge }: { onConcierge: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 28);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [open]);

  const navigation = [
    ["Destinos", "#destinos"],
    ["Experiencias", "#experiencias"],
    ["Concierge", "#concierge"],
    ["Dining", "#dining"],
  ];

  return (
    <>
      <header className={`public-header ${scrolled ? "is-scrolled" : ""}`}>
        <PublicLogo />
        <nav aria-label="Navegación principal">
          {navigation.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="public-header-actions">
          <button onClick={onConcierge}>Hablar con concierge</button>
          <Link href="/login">Acceso privado</Link>
        </div>
        <button
          className="public-menu-button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu />
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="public-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28 }}
            >
              <button
                className="public-menu-close"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
              >
                <X />
              </button>
              <PublicLogo />
              <nav>
                {navigation.map(([label, href]) => (
                  <Link key={label} href={href} onClick={() => setOpen(false)}>
                    {label}
                  </Link>
                ))}
              </nav>
              <button
                className="public-primary"
                onClick={() => {
                  setOpen(false);
                  onConcierge();
                }}
              >
                Hablar con concierge
              </button>
              <Link className="public-private-link" href="/login">
                Acceso privado
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
