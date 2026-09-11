"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Destination } from "@/lib/public-types";
import { PublicPageShell } from "./public-shell";

const services = [
  ["Yachts", "/demo/yacht-main.jpg"],
  ["Villas", "/demo/villa.jpg"],
  ["Mobility", "/demo/mobility.jpg"],
  ["Dining", "/demo/experience.jpg"],
  ["Nightlife", "/demo/villa-alt.jpg"],
  ["Private Aviation", "/demo/jet.jpg"],
  ["Wellness", "/demo/villa-alt.jpg"],
  ["Security", "/demo/mobility.jpg"],
  ["Staff & Talent", "/demo/talent-woman-1.jpg"],
  ["Experiences", "/demo/yacht-alt.jpg"],
  ["Real Estate", "/demo/villa.jpg"],
  ["Special Requests", "/demo/experience.jpg"],
];

export function ConciergePage({ destination }: { destination?: Destination }) {
  const [request, setRequest] = useState(false);
  const destinationName = destination?.name ?? "Multi-destino";
  return (
    <PublicPageShell destination={destinationName}>
      <section className="concierge-hero">
        <Image
          src="/demo/yacht-alt.jpg"
          alt="Private Concierge Yacht RM"
          fill
          priority
          sizes="100vw"
        />
        <div className="public-hero-shade" />
        <div>
          <span>PRIVATE CONCIERGE</span>
          <h1>
            Un solo contacto.
            <br />
            Todo tu viaje.
          </h1>
          <p>
            Yacht RM coordina cada parte de tu estadía, desde tu llegada hasta
            tu última noche.
          </p>
          <Link
            className="public-primary"
            href={
              destination
                ? `/plan-your-stay?destination=${destination.id}`
                : "/plan-your-stay"
            }
          >
            Diseñar mi experiencia <ArrowRight />
          </Link>
        </div>
      </section>
      <section className="concierge-editorial">
        <span>ONE CONVERSATION</span>
        <h2>
          No elegís servicios.
          <br />
          Nos contás cómo querés vivir.
        </h2>
        <p>
          Conectamos cada momento para que tu viaje se sienta continuo, personal
          y extraordinariamente simple.
        </p>
      </section>
      <section className="concierge-services">
        {services.map(([name, image], index) => (
          <article
            className={index === 0 || index === 3 || index === 9 ? "large" : ""}
            key={name}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width:700px) 50vw, 25vw"
            />
            <div className="public-card-shade" />
            <h3>{name}</h3>
          </article>
        ))}
      </section>
      <section className="concierge-special">
        <div>
          <span>SPECIAL REQUESTS</span>
          <h2>
            ¿No lo ves en el catálogo?
            <br />
            Decinos qué necesitás.
          </h2>
          <p>
            Desde una celebración privada hasta un servicio especial, podemos
            coordinar solicitudes fuera del catálogo.
          </p>
          <button className="public-primary" onClick={() => setRequest(true)}>
            Hacer una solicitud
          </button>
        </div>
        <div>
          <Image
            src="/demo/experience.jpg"
            alt="Solicitud concierge especial"
            fill
            sizes="50vw"
          />
        </div>
      </section>
      <section className="concierge-plan">
        <span>PLAN YOUR STAY</span>
        <h2>
          Tu estadía completa,
          <br />
          diseñada como una sola experiencia.
        </h2>
        <Link
          className="public-primary"
          href={
            destination
              ? `/plan-your-stay?destination=${destination.id}`
              : "/plan-your-stay"
          }
        >
          Empezar a planear <ArrowRight />
        </Link>
      </section>
      <SpecialRequest
        open={request}
        onClose={() => setRequest(false)}
        presetDestination={destination?.name ?? ""}
      />
    </PublicPageShell>
  );
}

function SpecialRequest({
  open,
  onClose,
  presetDestination,
}: {
  open: boolean;
  onClose: () => void;
  presetDestination: string;
}) {
  const [done, setDone] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    sessionStorage.setItem(
      "yrm-special-request",
      JSON.stringify({ ...values, source: "public-concierge" }),
    );
    setDone(true);
  };
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", close);
    };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="special-request-layer">
          <motion.button
            aria-label="Cerrar"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.form
            onSubmit={submit}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <button
              type="button"
              className="request-close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X />
            </button>
            {done ? (
              <div className="request-success">
                <span>
                  <Check />
                </span>
                <small>SOLICITUD RECIBIDA</small>
                <h2>Vamos a hacerlo posible.</h2>
                <p>
                  Nuestro concierge revisará los detalles de tu solicitud
                  especial.
                </p>
                <strong>#YRM-SPECIAL-1042</strong>
                <button
                  type="button"
                  className="public-primary"
                  onClick={onClose}
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <header>
                  <span>SPECIAL REQUEST</span>
                  <h2>Contanos qué necesitás.</h2>
                </header>
                <div className="request-body request-fields">
                  <label>
                    Destino
                    <select
                      name="destination"
                      defaultValue={presetDestination || "Miami"}
                    >
                      {["Riviera Maya", "Miami", "Los Cabos"].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Fecha
                    <input name="date" type="date" required />
                  </label>
                  <label>
                    Personas
                    <input
                      name="guests"
                      type="number"
                      min="1"
                      defaultValue="2"
                      required
                    />
                  </label>
                  <label>
                    Presupuesto estimado
                    <input name="budget" placeholder="Opcional" />
                  </label>
                  <label className="wide">
                    ¿Qué necesitás?
                    <textarea name="request" rows={4} required />
                  </label>
                  <label>
                    Nombre
                    <input name="name" required />
                  </label>
                  <label>
                    WhatsApp
                    <input name="whatsapp" required />
                  </label>
                  <label className="wide">
                    Email
                    <input name="email" type="email" required />
                  </label>
                </div>
                <footer>
                  <button className="public-primary">
                    Enviar solicitud <ArrowRight />
                  </button>
                </footer>
              </>
            )}
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
}
