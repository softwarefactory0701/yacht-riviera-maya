"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const activeDestination = pathname.startsWith("/miami")
    ? "Miami"
    : pathname.startsWith("/los-cabos")
      ? "Los Cabos"
      : "Riviera Maya";
  const destinationOptions = [
    ["Riviera Maya", "/riviera-maya"],
    ["Miami", "/miami"],
    ["Los Cabos", "/los-cabos"],
  ];

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
    ["Concierge", "/concierge"],
    ["Dining", "/dining"],
    ["Plan Your Stay", "/plan-your-stay"],
  ];

  return (
    <>
      <header className={`public-header ${scrolled ? "is-scrolled" : ""}`}>
        <PublicLogo />
        <nav aria-label="Navegación principal">
          <div className="public-destination-select">
            <button
              onClick={() => setDestinationsOpen((value) => !value)}
              aria-expanded={destinationsOpen}
            >
              {activeDestination} <span>⌄</span>
            </button>
            <AnimatePresence>
              {destinationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  {destinationOptions.map(([label, href]) => (
                    <button
                      className={label === activeDestination ? "active" : ""}
                      key={href}
                      onClick={() => {
                        setDestinationsOpen(false);
                        router.push(href);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {navigation.map(([label, href]) => (
            <Link
              key={label}
              href={
                href.startsWith("/") || pathname === "/" ? href : `/${href}`
              }
            >
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
                <span className="public-mobile-destination">
                  DESTINO · {activeDestination}
                </span>
                <div className="public-mobile-destinations">
                  {destinationOptions.map(([label, href]) => (
                    <Link key={href} href={href} onClick={() => setOpen(false)}>
                      {label}
                    </Link>
                  ))}
                </div>
                {navigation.map(([label, href]) => (
                  <Link
                    key={label}
                    href={
                      href.startsWith("/") || pathname === "/"
                        ? href
                        : `/${href}`
                    }
                    onClick={() => setOpen(false)}
                  >
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
