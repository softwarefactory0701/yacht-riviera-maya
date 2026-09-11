import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Destination } from "@/lib/public-types";

export function DestinationPage({ destination }: { destination: Destination }) {
  return (
    <main className="public-site destination-page">
      <section className="destination-hero">
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          priority
          sizes="100vw"
        />
        <div className="public-hero-shade" />
        <Link className="destination-back" href="/">
          <ArrowLeft /> Yacht RM
        </Link>
        <div>
          <span>{destination.country} · PRIVATE CONCIERGE</span>
          <h1>{destination.name}</h1>
          <p>{destination.description}</p>
          <Link className="public-primary" href="/#concierge">
            Diseñar mi experiencia <ArrowRight />
          </Link>
        </div>
      </section>
      <section className="destination-preview">
        <span>PRÓXIMAMENTE</span>
        <h2>
          Un destino.
          <br />
          Todas las posibilidades.
        </h2>
        <p>
          Yates, villas, dining, movilidad y experiencias coordinadas por un
          solo concierge.
        </p>
        <div>
          {["Yates", "Villas", "Dining", "Experiencias"].map((item) => (
            <article key={item}>
              <b>{item}</b>
              <span>Bajo solicitud</span>
            </article>
          ))}
        </div>
        <Link className="public-text-link" href="/">
          Volver a destinos <ArrowRight />
        </Link>
      </section>
    </main>
  );
}
