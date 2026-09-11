"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Destination, PublicCatalogItem } from "@/lib/public-types";
import { PublicHeader, PublicLogo } from "./public-header";

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.65 },
};
const usd = (value: number) => `USD ${value.toLocaleString("en-US")}`;

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
}) {
  return (
    <motion.div className="public-section-heading" {...reveal}>
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </motion.div>
  );
}

type PublicCategory = readonly [string, string, "large" | "small"];

export function PublicHome({
  destinations,
  publicCategories,
  publicYachts,
}: {
  destinations: Destination[];
  publicCategories: readonly PublicCategory[];
  publicYachts: PublicCatalogItem[];
}) {
  const [concierge, setConcierge] = useState(false);
  return (
    <main className="public-site">
      <PublicHeader onConcierge={() => setConcierge(true)} />

      <section className="public-hero">
        <Image
          src="/demo/yacht-main.jpg"
          alt="Yate privado navegando en el Caribe"
          fill
          priority
          sizes="100vw"
        />
        <div className="public-hero-shade" />
        <motion.div
          className="public-hero-copy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <span>PRIVATE CONCIERGE</span>
          <h1>
            Tu experiencia comienza
            <br />
            con el destino.
          </h1>
          <p>
            Yates, villas, movilidad, gastronomía y experiencias privadas en los
            destinos más exclusivos.
          </p>
          <div>
            <Link className="public-primary" href="#destinos">
              Explorar destinos <ArrowRight />
            </Link>
            <button
              className="public-secondary"
              onClick={() => setConcierge(true)}
            >
              Hablar con concierge
            </button>
          </div>
        </motion.div>
        <span className="public-scroll-mark">
          DESCUBRIR <i />
        </span>
      </section>

      <section className="public-section public-destinations" id="destinos">
        <SectionHeading
          eyebrow="DESTINOS"
          title="¿Dónde querés vivir tu próxima experiencia?"
        />
        <div className="public-destination-grid">
          {destinations.map((destination, index) => (
            <motion.article
              key={destination.id}
              {...reveal}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <Image
                src={destination.heroImage}
                alt={destination.name}
                fill
                sizes="(max-width: 760px) 100vw, 34vw"
              />
              <div className="public-card-shade" />
              <div>
                <span>{destination.country}</span>
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
                <Link href={`/${destination.id}`}>
                  Explorar destino <ArrowRight />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="public-section public-experiences" id="experiencias">
        <SectionHeading
          eyebrow="CURATED EXPERIENCES"
          title="Experiencias diseñadas alrededor de vos."
        />
        <div className="public-experience-grid">
          {[
            [
              "Sunset on the water",
              "Yacht + Chef + DJ",
              "Desde USD 8,200",
              "/demo/yacht-alt.jpg",
            ],
            [
              "Miami weekend",
              "Villa + SUV + Yacht + Dining",
              "Diseñado a medida",
              "/demo/villa-alt.jpg",
            ],
            [
              "Cabos private escape",
              "Yacht + Sunset + Private Chef",
              "Diseñado a medida",
              "/demo/yacht-main.jpg",
            ],
            [
              "Riviera after dark",
              "Transport + Dining + Nightlife",
              "Diseñado a medida",
              "/demo/mobility.jpg",
            ],
          ].map(([name, description, price, image], index) => (
            <motion.article
              key={name}
              {...reveal}
              transition={{ duration: 0.6, delay: index * 0.06 }}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
              <div className="public-card-shade" />
              <div>
                <h3>{name}</h3>
                <p>{description}</p>
                <span>{price}</span>
              </div>
            </motion.article>
          ))}
        </div>
        <button className="public-text-link" onClick={() => setConcierge(true)}>
          Ver experiencias <ArrowRight />
        </button>
      </section>

      <section className="public-section public-categories">
        <SectionHeading
          eyebrow="TODO, COORDINADO"
          title="Todo lo que necesitás, en un solo lugar."
        />
        <div className="public-category-grid">
          {publicCategories.map(([name, image, size]) => (
            <article key={name} className={size}>
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 760px) 50vw, 25vw"
              />
              <div className="public-card-shade" />
              <h3>{name}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section public-yachts">
        <SectionHeading
          eyebrow="ON THE WATER"
          title="Yates seleccionados para días memorables."
        />
        <div className="public-yacht-grid">
          {publicYachts.map((yacht) => (
            <article key={yacht.id}>
              <div className="public-yacht-image">
                <Image
                  src={yacht.image}
                  alt={yacht.name}
                  fill
                  sizes="(max-width: 760px) 100vw, 25vw"
                />
              </div>
              <div className="public-yacht-copy">
                <span>{yacht.destination}</span>
                <h3>{yacht.name}</h3>
                <p>
                  {yacht.capacity}
                  <br />
                  {yacht.durations.join(" / ")}
                </p>
                <strong>Desde {usd(yacht.priceFrom)}</strong>
                <button onClick={() => setConcierge(true)}>
                  Ver experiencia <ArrowRight />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="public-concierge" id="concierge">
        <div className="public-concierge-image">
          <Image
            src="/demo/villa.jpg"
            alt="Villa privada frente al mar"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        </div>
        <motion.div {...reveal}>
          <span>PRIVATE CONCIERGE</span>
          <h2>
            No reservamos servicios.
            <br />
            Diseñamos tu estadía.
          </h2>
          <p>
            Desde el momento en que llegás hasta tu última noche, Yacht RM
            coordina cada detalle alrededor de tu viaje.
          </p>
          <div className="public-service-list">
            {[
              "Airport pickup",
              "Private yacht",
              "Dining",
              "Villa",
              "Nightlife",
              "Chef",
              "Security",
              "Wellness",
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <Link className="public-primary" href="/plan-your-stay">
            Diseñar mi experiencia
          </Link>
        </motion.div>
      </section>

      <section className="public-section public-stay">
        <div>
          <SectionHeading
            eyebrow="PLAN YOUR STAY"
            title="Tres días. Una experiencia continua."
          />
          <span className="public-itinerary-label">3 DAYS IN MIAMI</span>
          {[
            ["01", "Airport Pickup · Villa Check-in · Private Dinner"],
            ["02", "Yacht Experience · Sunset · Nightlife"],
            ["03", "Beach Club · Wellness · Chauffeur"],
          ].map(([day, plan]) => (
            <div className="public-day" key={day}>
              <b>DAY {day}</b>
              <p>{plan}</p>
            </div>
          ))}
          <Link className="public-text-link" href="/plan-your-stay">
            Planear mi viaje <ArrowRight />
          </Link>
        </div>
        <div className="public-stay-image">
          <Image
            src="/demo/mobility.jpg"
            alt="Experiencia privada coordinada"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="public-section public-dining" id="dining">
        <SectionHeading
          eyebrow="DINING"
          title="Reservations worth remembering."
          copy="Mesas extraordinarias y experiencias privadas, siempre bajo solicitud."
        />
        <div>
          {[
            ["Caribbean Table", "Riviera Maya", "/demo/experience.jpg"],
            ["Ocean Room", "Miami", "/demo/villa-alt.jpg"],
            ["Desert & Sea", "Los Cabos", "/demo/yacht-alt.jpg"],
          ].map(([name, place, image]) => (
            <article key={name}>
              <div>
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </div>
              <span>{place}</span>
              <h3>{name}</h3>
              <Link href="/dining">Solicitar mesa</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section public-how">
        <SectionHeading
          eyebrow="CÓMO FUNCIONA"
          title="Simple para vos. Coordinado por nosotros."
        />
        <div>
          {[
            ["01", "Elegí tu destino"],
            ["02", "Contanos qué querés vivir"],
            ["03", "Nuestro concierge lo coordina"],
            ["04", "Disfrutá la experiencia"],
          ].map(([n, text]) => (
            <article key={n}>
              <span>{n}</span>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section public-testimonials">
        <span>PRIVATE NOTES · CONTENIDO DEMO</span>
        <blockquote>
          “From the airport pickup to the yacht, everything was handled
          perfectly.”<cite>Private Client · Miami</cite>
        </blockquote>
        <blockquote>
          “Yacht RM organized our entire weekend without us having to coordinate
          multiple providers.”<cite>Private Client · Riviera Maya</cite>
        </blockquote>
      </section>

      <section className="public-final-cta">
        <Image
          src="/demo/yacht-main.jpg"
          alt="Costa del Caribe"
          fill
          sizes="100vw"
        />
        <div className="public-card-shade" />
        <motion.div {...reveal}>
          <h2>
            Decinos dónde.
            <br />
            Nosotros nos ocupamos del resto.
          </h2>
          <div>
            <Link className="public-primary" href="#destinos">
              Explorar destinos
            </Link>
            <button
              className="public-secondary"
              onClick={() => setConcierge(true)}
            >
              Hablar con concierge
            </button>
          </div>
        </motion.div>
      </section>

      <PublicFooter
        destinations={destinations}
        onConcierge={() => setConcierge(true)}
      />
      <button
        className="public-floating-concierge"
        onClick={() => setConcierge(true)}
      >
        <MessageCircle />
        <span>Hablar con concierge</span>
      </button>
      <ConciergeModal open={concierge} onClose={() => setConcierge(false)} />
    </main>
  );
}

function ConciergeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="public-concierge-modal">
          <motion.button
            aria-label="Cerrar"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <button onClick={onClose} aria-label="Cerrar">
              <X />
            </button>
            <span>PRIVATE CONCIERGE</span>
            <h2>Concierge disponible</h2>
            <p>
              Contanos el destino y la experiencia que imaginás. En la próxima
              fase conectaremos este acceso con el equipo Yacht RM.
            </p>
            <Link className="public-primary" href="/plan-your-stay">
              Diseñar mi viaje
            </Link>
            <small>Interacción de demostración · Sin envío de datos</small>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function PublicFooter({
  destinations,
  onConcierge,
}: {
  destinations: Destination[];
  onConcierge: () => void;
}) {
  return (
    <footer className="public-footer">
      <div>
        <PublicLogo />
        <p>Private experiences, designed around you.</p>
      </div>
      <div>
        <b>Destinos</b>
        {destinations.map((item) => (
          <Link key={item.id} href={`/${item.id}`}>
            {item.name}
          </Link>
        ))}
      </div>
      <div>
        <b>Servicios</b>
        {[
          "Yachts",
          "Villas",
          "Dining",
          "Mobility",
          "Experiences",
          "Concierge",
        ].map((item) => (
          <button key={item} onClick={onConcierge}>
            {item}
          </button>
        ))}
      </div>
      <div>
        <b>Company</b>
        <Link href="#concierge">About</Link>
        <button onClick={onConcierge}>Contact</button>
        <Link href="/login">Private Access</Link>
      </div>
      <div>
        <b>Social</b>
        <button onClick={onConcierge}>Instagram</button>
        <button onClick={onConcierge}>Facebook</button>
        <button onClick={onConcierge}>WhatsApp</button>
      </div>
      <small>© 2026 Yacht Riviera Maya. Private Concierge.</small>
    </footer>
  );
}
