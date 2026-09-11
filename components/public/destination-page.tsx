"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type {
  Destination,
  PublicDestinationCatalogItem,
} from "@/lib/public-types";
import { PublicPageShell } from "./public-shell";

const categories = [
  ["Todo", ""],
  ["Yates", "yachts"],
  ["Villas", "villas"],
  ["Movilidad", "mobility"],
  ["Dining", "dining"],
  ["Experiencias", "experiences"],
  ["Wellness", "wellness"],
  ["Nightlife", "nightlife"],
];

export function DestinationPage({
  destination,
  items,
}: {
  destination: Destination;
  items: PublicDestinationCatalogItem[];
}) {
  const featured = items
    .filter((item) =>
      ["yachts", "villas", "experiences", "dining"].includes(item.category),
    )
    .slice(0, 8);
  return (
    <PublicPageShell destination={destination.name}>
      <section className={`destination-hero destination-${destination.id}`}>
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          priority
          sizes="100vw"
        />
        <div className="public-hero-shade" />
        <div>
          <span>{destination.country} · PRIVATE CONCIERGE</span>
          <h1>{destination.name}</h1>
          <h2>
            {destination.id === "miami"
              ? "Miami a tu manera."
              : destination.id === "los-cabos"
                ? "Donde el desierto encuentra el océano."
                : "El Caribe, diseñado alrededor de vos."}
          </h2>
          <p>
            Yates, villas, movilidad, dining y experiencias privadas coordinadas
            por nuestro concierge.
          </p>
          <div className="destination-hero-actions">
            <Link className="public-primary" href="#catalogo">
              Explorar {destination.name}
            </Link>
            <Link className="public-secondary" href="#destination-contact">
              Hablar con concierge
            </Link>
          </div>
        </div>
      </section>
      <nav
        className="destination-nav"
        aria-label={`Explorar ${destination.name}`}
      >
        {categories.map(([label, slug]) => (
          <Link
            key={label}
            href={slug ? `/${destination.id}/${slug}` : "#catalogo"}
          >
            {label}
          </Link>
        ))}
      </nav>
      <section className="destination-intro">
        <span>WELCOME TO {destination.name.toUpperCase()}</span>
        <h2>
          Un destino.
          <br />
          Infinitas maneras de vivirlo.
        </h2>
        <p>
          {destination.description} Todo coordinado desde una sola conversación.
        </p>
      </section>
      <section className="destination-catalog" id="catalogo">
        <div className="destination-section-head">
          <span>CURATED FOR YOU</span>
          <h2>Experiencias en {destination.name}</h2>
        </div>
        <div className="destination-featured-grid">
          {featured.map((item, index) => (
            <article
              key={`${item.category}-${item.slug}`}
              className={index === 0 || index === 5 ? "wide" : ""}
            >
              <Image
                src={item.images[0]}
                alt={item.name}
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
              />
              <div className="public-card-shade" />
              <div>
                <span>
                  {item.categoryLabel} · {item.location}
                </span>
                <h3>{item.name}</h3>
                <p>{item.shortDescription}</p>
                <Link href={`/${destination.id}/${item.category}/${item.slug}`}>
                  Ver experiencia <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="destination-category-links">
        {categories.slice(1).map(([label, slug]) => {
          const count = items.filter((item) => item.category === slug).length;
          return (
            <Link key={slug} href={`/${destination.id}/${slug}`}>
              <span>{String(count).padStart(2, "0")} experiencias</span>
              <h3>{label}</h3>
              <ArrowRight />
            </Link>
          );
        })}
      </section>
      <section className="destination-contact" id="destination-contact">
        <Image
          src="/demo/experience.jpg"
          alt="Experiencia privada"
          fill
          sizes="100vw"
        />
        <div className="public-card-shade" />
        <div>
          <span>PRIVATE CONCIERGE</span>
          <h2>{destination.name}, a tu manera.</h2>
          <p>Elegí el punto de partida. Nosotros conectamos cada detalle.</p>
          <Link
            className="public-primary"
            href={`/${destination.id}/experiences`}
          >
            Comenzar a explorar
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
