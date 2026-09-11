"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  Destination,
  PublicDestinationCatalogItem,
} from "@/lib/public-types";
import { PublicPageShell } from "./public-shell";

export function PublicCategoryPage({
  destination,
  categoryLabel,
  items,
}: {
  destination: Destination;
  categoryLabel: string;
  items: PublicDestinationCatalogItem[];
}) {
  const [capacity, setCapacity] = useState("all");
  const [duration, setDuration] = useState("all");
  const [price, setPrice] = useState("all");
  const [location, setLocation] = useState("all");
  const locations = [...new Set(items.map((item) => item.location))];
  const visible = useMemo(
    () =>
      items.filter((item) => {
        const capacityNumber = Number(item.capacity.match(/\d+/)?.[0] ?? 0);
        return (
          (capacity === "all" || capacityNumber >= Number(capacity)) &&
          (duration === "all" ||
            item.durations.some((value) => value.startsWith(duration))) &&
          (price === "all" || item.priceFrom <= Number(price)) &&
          (location === "all" || item.location === location)
        );
      }),
    [items, capacity, duration, price, location],
  );
  const categorySlug = items[0]?.category ?? "experiences";
  return (
    <PublicPageShell destination={destination.name}>
      <section className="category-hero">
        <Image
          src={items[0]?.images[0] ?? destination.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="public-hero-shade" />
        <div>
          <nav className="public-breadcrumb">
            <Link href={`/${destination.id}`}>{destination.name}</Link>
            <span>/</span>
            <b>{categoryLabel}</b>
          </nav>
          <span>
            {categoryLabel.toUpperCase()} · {destination.name.toUpperCase()}
          </span>
          <h1>{categoryLabel}</h1>
          <p>
            {categorySlug === "yachts"
              ? "El destino se ve diferente desde el agua."
              : `Una selección privada de ${categoryLabel.toLowerCase()} en ${destination.name}.`}
          </p>
          <strong>
            {items.length} experiencias disponibles bajo confirmación
          </strong>
        </div>
      </section>
      <section className="category-content">
        <div className="category-filter-bar">
          <span>
            <SlidersHorizontal /> FILTRAR
          </span>
          <label>
            Capacidad
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="10">10+ personas</option>
              <option value="14">14+ personas</option>
            </select>
          </label>
          <label>
            Duración
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="4">4 horas</option>
              <option value="6">6 horas</option>
              <option value="8">8 horas</option>
            </select>
          </label>
          <label>
            Precio
            <select value={price} onChange={(e) => setPrice(e.target.value)}>
              <option value="all">Cualquier precio</option>
              <option value="5000">Hasta USD 5,000</option>
              <option value="7000">Hasta USD 7,000</option>
            </select>
          </label>
          <label>
            Ubicación
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="all">Todas</option>
              {locations.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="category-result">
          <span>{visible.length} RESULTADOS</span>
          <button
            onClick={() => {
              setCapacity("all");
              setDuration("all");
              setPrice("all");
              setLocation("all");
            }}
          >
            Limpiar filtros
          </button>
        </div>
        <div className="public-catalog-grid">
          {visible.map((item) => (
            <article key={item.slug}>
              <div>
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
                <span>{item.publicAvailabilityLabel}</span>
              </div>
              <div>
                <span>
                  {item.location} · {destination.name}
                </span>
                <h2>{item.name}</h2>
                <p>
                  {item.capacity}
                  <br />
                  {item.durations.join(" / ")}
                </p>
                <strong>
                  Desde {item.currency} {item.priceFrom.toLocaleString("en-US")}
                </strong>
                <Link href={`/${destination.id}/${item.category}/${item.slug}`}>
                  Ver experiencia <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {!visible.length && (
          <div className="public-empty">
            <h2>No encontramos opciones con estos filtros.</h2>
            <button
              className="public-text-link"
              onClick={() => {
                setCapacity("all");
                setDuration("all");
                setPrice("all");
                setLocation("all");
              }}
            >
              Ver todas
            </button>
          </div>
        )}
      </section>
    </PublicPageShell>
  );
}
