"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type {
  Destination,
  PublicDestinationCatalogItem,
} from "@/lib/public-types";
import { PublicPageShell } from "./public-shell";

export function ServiceDetailPage({
  destination,
  item,
  crossSell,
}: {
  destination: Destination;
  item: PublicDestinationCatalogItem;
  crossSell: PublicDestinationCatalogItem[];
}) {
  const [gallery, setGallery] = useState(false);
  const [request, setRequest] = useState(false);
  const [initialExtra, setInitialExtra] = useState("");
  useEffect(() => {
    document.body.style.overflow = gallery || request ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gallery, request]);
  return (
    <PublicPageShell destination={destination.name}>
      <section className="service-gallery">
        <div className="service-main-image">
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            priority
            sizes="70vw"
          />
        </div>
        {item.images.slice(1, 3).map((image, index) => (
          <div key={`${image}-${index}`}>
            <Image
              src={image}
              alt={`${item.name} ${index + 2}`}
              fill
              sizes="30vw"
            />
          </div>
        ))}
        <button onClick={() => setGallery(true)}>Ver galería</button>
      </section>
      <section className="service-summary">
        <div>
          <nav className="public-breadcrumb">
            <Link href={`/${destination.id}`}>{destination.name}</Link>
            <span>/</span>
            <Link href={`/${destination.id}/${item.category}`}>
              {item.categoryLabel}
            </Link>
            <span>/</span>
            <b>{item.name}</b>
          </nav>
          <span>
            {item.category === "yachts"
              ? "PRIVATE YACHT"
              : item.categoryLabel.toUpperCase()}
          </span>
          <h1>{item.name}</h1>
          <p>
            {item.location} · {destination.name}
          </p>
          <div className="service-facts">
            <span>{item.capacity}</span>
            <span>{item.durations.join(" / ")}</span>
          </div>
        </div>
        <aside>
          <span>DESDE</span>
          <strong>
            {item.currency} {item.priceFrom.toLocaleString("en-US")}
          </strong>
          <small>{item.publicAvailabilityLabel}</small>
          <button className="public-primary" onClick={() => setRequest(true)}>
            Consultar disponibilidad
          </button>
          <button className="public-secondary" onClick={() => setRequest(true)}>
            Hablar con concierge
          </button>
        </aside>
      </section>
      <section className="service-information">
        <div>
          <span>LA EXPERIENCIA</span>
          <h2>Tu tiempo, diseñado alrededor de vos.</h2>
          <p>
            {item.shortDescription} Nuestro concierge coordina el ritmo, los
            detalles y cualquier servicio adicional.
          </p>
        </div>
        <div>
          <span>INCLUYE</span>
          <ul>
            {item.highlights.map((highlight) => (
              <li key={highlight}>
                <Check /> {highlight}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span>CARACTERÍSTICAS</span>
          <dl>
            <div>
              <dt>Ubicación</dt>
              <dd>{item.location}</dd>
            </div>
            <div>
              <dt>Capacidad</dt>
              <dd>{item.capacity}</dd>
            </div>
            <div>
              <dt>Duraciones</dt>
              <dd>{item.durations.join(" · ")}</dd>
            </div>
            <div>
              <dt>Confirmación</dt>
              <dd>Bajo solicitud</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="service-cross-sell">
        <div>
          <span>CURATED ADD-ONS</span>
          <h2>Completá tu experiencia.</h2>
        </div>
        <div>
          {crossSell.map((extra) => (
            <article key={`${extra.category}-${extra.slug}`}>
              <div>
                <Image
                  src={extra.images[0]}
                  alt={extra.name}
                  fill
                  sizes="(max-width: 700px) 70vw, 20vw"
                />
              </div>
              <span>{extra.categoryLabel}</span>
              <h3>{extra.name}</h3>
              <button
                onClick={() => {
                  setInitialExtra(extra.name);
                  setRequest(true);
                }}
              >
                Agregar a mi solicitud <Plus />
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="service-final-request">
        <span>{destination.name.toUpperCase()}</span>
        <h2>¿Listo para vivirlo?</h2>
        <p>
          Consultá disponibilidad sin compromiso. Nuestro concierge coordinará
          cada detalle.
        </p>
        <button className="public-primary" onClick={() => setRequest(true)}>
          Consultar disponibilidad <ArrowRight />
        </button>
      </section>
      <AnimatePresence>
        {gallery && (
          <div className="public-gallery-modal">
            <motion.button
              aria-label="Cerrar galería"
              onClick={() => setGallery(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <button onClick={() => setGallery(false)} aria-label="Cerrar">
                <X />
              </button>
              {item.images.map((image, index) => (
                <div key={`${image}-${index}`}>
                  <Image
                    src={image}
                    alt={`${item.name} — vista ${index + 1}`}
                    fill
                    sizes="90vw"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <RequestWizard
        open={request}
        onClose={() => {
          setRequest(false);
          setInitialExtra("");
        }}
        item={item}
        destination={destination}
        initialExtra={initialExtra}
      />
    </PublicPageShell>
  );
}

function RequestWizard({
  open,
  onClose,
  item,
  destination,
  initialExtra,
}: {
  open: boolean;
  onClose: () => void;
  item: PublicDestinationCatalogItem;
  destination: Destination;
  initialExtra: string;
}) {
  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState(item.durations[0]);
  const [guests, setGuests] = useState(8);
  const [extras, setExtras] = useState<string[]>(
    initialExtra ? [initialExtra] : [],
  );
  const [date, setDate] = useState("2026-09-18");
  const [time, setTime] = useState("10:00");
  const [zone, setZone] = useState("");
  const [notes, setNotes] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [method, setMethod] = useState("WhatsApp");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (open && initialExtra)
      queueMicrotask(() =>
        setExtras((current) =>
          current.includes(initialExtra) ? current : [...current, initialExtra],
        ),
      );
  }, [open, initialExtra]);
  const toggleExtra = (extra: string) =>
    setExtras((current) =>
      current.includes(extra)
        ? current.filter((value) => value !== extra)
        : [...current, extra],
    );
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const lead = {
      serviceSlug: item.slug,
      service: item.name,
      destinationId: destination.id,
      destination: destination.name,
      category: item.category,
      duration,
      guests,
      extras,
      date,
      preferredTime: time,
      stayLocation: zone,
      notes,
      contact: {
        firstName,
        lastName,
        whatsapp,
        email,
        country,
        preferredMethod: method,
        consent,
      },
      source: "public-website-demo",
      createdAt: new Date().toISOString(),
    };
    sessionStorage.setItem("yrm-public-request", JSON.stringify(lead));
    setSubmitted(true);
  };
  return (
    <AnimatePresence>
      {open && (
        <div className="request-wizard-layer">
          <motion.button
            aria-label="Cerrar solicitud"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.form
            onSubmit={submit}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              className="request-close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X />
            </button>
            {submitted ? (
              <div className="request-success">
                <span>
                  <Check />
                </span>
                <small>SOLICITUD RECIBIDA</small>
                <h2>Gracias{firstName ? `, ${firstName}` : ""}.</h2>
                <p>
                  Nuestro concierge coordinará la confirmación de tu experiencia
                  en {destination.name}.
                </p>
                <strong>#YRM-REQ-2026-0918</strong>
                <div>
                  <b>{item.name}</b>
                  <span>{destination.name}</span>
                  <span>{date}</span>
                  <span>
                    {guests} personas · {duration}
                  </span>
                </div>
                <Link className="public-primary" href={`/${destination.id}`}>
                  Seguir explorando {destination.name}
                </Link>
              </div>
            ) : (
              <>
                <header>
                  <span>PASO 0{step} DE 03</span>
                  <h2>
                    {step === 1
                      ? "Tu experiencia"
                      : step === 2
                        ? "Tu viaje"
                        : "Tus datos"}
                  </h2>
                  <div>
                    {[1, 2, 3].map((number) => (
                      <i
                        key={number}
                        className={number <= step ? "active" : ""}
                      />
                    ))}
                  </div>
                </header>
                <div className="request-body">
                  {step === 1 && (
                    <>
                      <div className="request-selected">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={110}
                          height={90}
                        />
                        <div>
                          <span>{destination.name}</span>
                          <b>{item.name}</b>
                        </div>
                      </div>
                      <fieldset>
                        <legend>Duración</legend>
                        <div className="request-options">
                          {item.durations.map((value) => (
                            <button
                              type="button"
                              className={duration === value ? "active" : ""}
                              key={value}
                              onClick={() => setDuration(value)}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend>Personas</legend>
                        <div className="request-counter">
                          <button
                            type="button"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                          >
                            <Minus />
                          </button>
                          <b>{guests}</b>
                          <button
                            type="button"
                            onClick={() => setGuests(guests + 1)}
                          >
                            <Plus />
                          </button>
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend>Extras opcionales</legend>
                        <div className="request-options">
                          {["Transport", "Chef", "DJ", "Dining", "Staff"].map(
                            (extra) => (
                              <button
                                type="button"
                                className={
                                  extras.includes(extra) ? "active" : ""
                                }
                                key={extra}
                                onClick={() => toggleExtra(extra)}
                              >
                                {extras.includes(extra) && <Check />} {extra}
                              </button>
                            ),
                          )}
                        </div>
                      </fieldset>
                    </>
                  )}
                  {step === 2 && (
                    <div className="request-fields">
                      <label>
                        Fecha
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        Horario preferido
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                        />
                      </label>
                      <label className="wide">
                        Hotel / Villa / Zona
                        <input
                          value={zone}
                          onChange={(e) => setZone(e.target.value)}
                          placeholder={`¿Dónde te hospedás en ${destination.name}?`}
                        />
                      </label>
                      <label className="wide">
                        ¿Hay algo más que debamos saber?
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={4}
                        />
                      </label>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="request-fields">
                      <label>
                        Nombre
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        Apellido
                        <input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        WhatsApp
                        <input
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        Email
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </label>
                      <label className="wide">
                        País
                        <input
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required
                        />
                      </label>
                      <fieldset className="wide">
                        <legend>Método preferido</legend>
                        <div className="request-options">
                          {["WhatsApp", "Email"].map((value) => (
                            <button
                              type="button"
                              className={method === value ? "active" : ""}
                              key={value}
                              onClick={() => setMethod(value)}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      <label className="request-consent wide">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          required
                        />
                        <span>
                          Acepto ser contactado por Yacht RM respecto a esta
                          solicitud.
                        </span>
                      </label>
                    </div>
                  )}
                </div>
                <footer>
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)}>
                      <ChevronLeft /> Atrás
                    </button>
                  )}
                  <button
                    type={step === 3 ? "submit" : "button"}
                    className="public-primary"
                    disabled={step === 3 && !consent}
                    onClick={() => {
                      if (step < 3) setStep(step + 1);
                    }}
                  >
                    {step === 3 ? "Enviar solicitud" : "Continuar"}{" "}
                    <ChevronRight />
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
