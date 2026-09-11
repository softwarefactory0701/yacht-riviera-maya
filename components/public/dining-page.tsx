"use client";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Destination, PublicDiningExperience } from "@/lib/public-types";
import { PublicPageShell } from "./public-shell";

export function DiningPage({
  experiences,
  destination,
}: {
  experiences: PublicDiningExperience[];
  destination?: Destination;
}) {
  const [type, setType] = useState("Todos"),
    [moment, setMoment] = useState("Todos"),
    [zone, setZone] = useState("Todas"),
    [group, setGroup] = useState("Todos"),
    [selected, setSelected] = useState<PublicDiningExperience | null>(null);
  const destinationName = destination?.name ?? "Multi-destino";
  const visible = useMemo(
    () =>
      experiences.filter(
        (item) =>
          (type === "Todos" || item.type === type) &&
          (moment === "Todos" ||
            item.moments.includes(
              moment as PublicDiningExperience["moments"][number],
            )) &&
          (zone === "Todas" || item.zone === zone) &&
          (group === "Todos" || item.group === group),
      ),
    [experiences, type, moment, zone, group],
  );
  const zones = [...new Set(experiences.map((item) => item.zone))];
  return (
    <PublicPageShell destination={destinationName}>
      <section className="dining-hero">
        <Image
          src="/demo/experience.jpg"
          alt="Experiencia gastronómica privada"
          fill
          priority
          sizes="100vw"
        />
        <div className="public-hero-shade" />
        <div>
          <span>
            {destination
              ? `${destination.name.toUpperCase()} · DINING`
              : "DINING"}
          </span>
          <h1>La mesa también forma parte de la experiencia.</h1>
          <p>
            Restaurantes, private dining, chefs y experiencias gastronómicas
            coordinadas por Yacht RM.
          </p>
          <div>
            <a className="public-primary" href="#dining-catalog">
              Explorar Dining
            </a>
            <button
              className="public-secondary"
              onClick={() => setSelected(experiences[0])}
            >
              Solicitar reserva
            </button>
          </div>
        </div>
      </section>
      {!destination && (
        <section className="dining-destinations">
          <span>DINING BY DESTINATION</span>
          <h2>Elegí dónde será la próxima mesa.</h2>
          <div>
            {[
              ["Riviera Maya", "/riviera-maya/dining", "/demo/yacht-main.jpg"],
              ["Miami", "/miami/dining", "/demo/villa-alt.jpg"],
              ["Los Cabos", "/los-cabos/dining", "/demo/yacht-alt.jpg"],
            ].map(([name, href, image]) => (
              <Link key={name} href={href}>
                <Image src={image} alt="" fill sizes="33vw" />
                <div className="public-card-shade" />
                <h3>{name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="dining-content" id="dining-catalog">
        <div className="dining-heading">
          <span>AVAILABLE FOR CONCIERGE REQUEST</span>
          <h2>
            {destination
              ? `Dining en ${destination.name}`
              : "Experiencias alrededor de la mesa."}
          </h2>
          <p>
            Las solicitudes están sujetas a confirmación. No representan
            disponibilidad en tiempo real ni una relación comercial con
            establecimientos.
          </p>
        </div>
        <div className="dining-filters">
          <label>
            Tipo
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>Todos</option>
              {[...new Set(experiences.map((item) => item.type))].map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Momento
            <select value={moment} onChange={(e) => setMoment(e.target.value)}>
              <option>Todos</option>
              {["Lunch", "Dinner", "Sunset", "Late Night"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Zona
            <select value={zone} onChange={(e) => setZone(e.target.value)}>
              <option>Todas</option>
              {zones.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Grupo
            <select value={group} onChange={(e) => setGroup(e.target.value)}>
              <option>Todos</option>
              {["Couple", "Small group", "Large group"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="dining-grid">
          {visible.map((item) => (
            <article key={`${item.destinationId}-${item.slug}`}>
              <div>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width:700px) 100vw, 33vw"
                />
                <span>RESERVA BAJO CONFIRMACIÓN</span>
              </div>
              <div>
                <span>
                  {item.type} · {item.zone}
                </span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <dl>
                  <div>
                    <dt>Momento</dt>
                    <dd>{item.moments.join(" · ")}</dd>
                  </div>
                  <div>
                    <dt>Ideal para</dt>
                    <dd>{item.group}</dd>
                  </div>
                  {item.dressCode && (
                    <div>
                      <dt>Dress code</dt>
                      <dd>{item.dressCode}</dd>
                    </div>
                  )}
                </dl>
                <div className="dining-card-actions">
                  <Link href={`/${item.destinationId}/dining/${item.slug}`}>
                    Ver experiencia
                  </Link>
                  <button onClick={() => setSelected(item)}>
                    Solicitar mesa
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="dining-private">
        <div>
          <span>PRIVATE DINING</span>
          <h2>
            Tu mesa.
            <br />
            Tu lugar.
            <br />
            Tu momento.
          </h2>
        </div>
        <div>
          {[
            "Private Chef at Villa",
            "Sunset Dinner",
            "Dinner on Board",
            "Private Mixology Experience",
            "Chef + Bartender Experience",
            "Villa Celebration Dinner",
          ].map((name) => (
            <button
              key={name}
              onClick={() =>
                setSelected(
                  experiences.find((item) => item.name === name) ??
                    experiences[0],
                )
              }
            >
              {name}
              <Plus />
            </button>
          ))}
        </div>
      </section>
      <DiningRequest experience={selected} onClose={() => setSelected(null)} />
    </PublicPageShell>
  );
}

export function DiningRequest({
  experience,
  onClose,
}: {
  experience: PublicDiningExperience | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1),
    [date, setDate] = useState("2026-11-12"),
    [time, setTime] = useState("20:00"),
    [guests, setGuests] = useState(4),
    [name, setName] = useState(""),
    [whatsapp, setWhatsapp] = useState(""),
    [email, setEmail] = useState(""),
    [hotel, setHotel] = useState(""),
    [celebration, setCelebration] = useState("Ninguna"),
    [notes, setNotes] = useState(""),
    [done, setDone] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!experience) return;
    sessionStorage.setItem(
      "yrm-dining-request",
      JSON.stringify({
        source: "public-dining",
        destinationId: experience.destinationId,
        category: "dining",
        venueOrRequest: experience.name,
        date,
        time,
        guests,
        client: { name, whatsapp, email, hotel },
        celebration,
        notes,
      }),
    );
    setDone(true);
  };
  useEffect(() => {
    if (!experience) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", close);
    };
  }, [experience, onClose]);
  return (
    <AnimatePresence>
      {experience && (
        <div className="dining-request-layer">
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
                <small>SOLICITUD ENVIADA</small>
                <h2>Estamos coordinando tu mesa.</h2>
                <p>
                  Nuestro concierge confirmará disponibilidad con el
                  establecimiento o equipo gastronómico.
                </p>
                <strong>#YRM-DIN-2034</strong>
                <div>
                  <b>{experience.name}</b>
                  <span>{experience.destination}</span>
                  <span>
                    {date} · {time}
                  </span>
                  <span>{guests} personas</span>
                </div>
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
                  <span>PASO 0{step} DE 02</span>
                  <h2>{step === 1 ? "Tu experiencia" : "Tus datos"}</h2>
                  <div>
                    {[1, 2].map((value) => (
                      <i
                        className={value <= step ? "active" : ""}
                        key={value}
                      />
                    ))}
                  </div>
                </header>
                <div className="request-body">
                  {step === 1 ? (
                    <>
                      <div className="request-selected">
                        <Image
                          src={experience.image}
                          alt=""
                          width={110}
                          height={90}
                        />
                        <div>
                          <span>{experience.destination}</span>
                          <b>{experience.name}</b>
                        </div>
                      </div>
                      <div className="request-fields dining-request-fields">
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
                          Hora preferida
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                          />
                        </label>
                        <label className="wide">
                          Personas
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
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="request-fields">
                      <label>
                        Nombre
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                      <label>
                        Hotel / Villa
                        <input
                          value={hotel}
                          onChange={(e) => setHotel(e.target.value)}
                        />
                      </label>
                      <label className="wide">
                        Celebración
                        <select
                          value={celebration}
                          onChange={(e) => setCelebration(e.target.value)}
                        >
                          {[
                            "Ninguna",
                            "Cumpleaños",
                            "Aniversario",
                            "Bachelor/Bachelorette",
                            "Business",
                            "Otra",
                          ].map((value) => (
                            <option key={value}>{value}</option>
                          ))}
                        </select>
                      </label>
                      <label className="wide">
                        Notas especiales
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={4}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <footer>
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(1)}>
                      <ChevronLeft /> Atrás
                    </button>
                  )}
                  <button
                    className="public-primary"
                    type={step === 2 ? "submit" : "button"}
                    onClick={() => step === 1 && setStep(2)}
                  >
                    {step === 2 ? "Enviar solicitud" : "Continuar"}
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

export function DiningDetailPage({
  experience,
  destination,
  recommendations,
}: {
  experience: PublicDiningExperience;
  destination: Destination;
  recommendations: PublicDiningExperience[];
}) {
  const [selected, setSelected] = useState<PublicDiningExperience | null>(null);
  return (
    <PublicPageShell destination={destination.name}>
      <section className="dining-detail-hero">
        <Image
          src={experience.image}
          alt={experience.name}
          fill
          priority
          sizes="100vw"
        />
        <div className="public-hero-shade" />
        <div>
          <nav className="public-breadcrumb">
            <Link href={`/${destination.id}`}>{destination.name}</Link>
            <span>/</span>
            <Link href={`/${destination.id}/dining`}>Dining</Link>
            <span>/</span>
            <b>{experience.name}</b>
          </nav>
          <span>{experience.type.toUpperCase()}</span>
          <h1>{experience.name}</h1>
          <p>
            {experience.zone} · {destination.name}
          </p>
          <button
            className="public-primary"
            onClick={() => setSelected(experience)}
          >
            Solicitar experiencia
          </button>
        </div>
      </section>
      <section className="dining-detail-info">
        <div>
          <span>LA EXPERIENCIA</span>
          <h2>Una mesa diseñada alrededor de tu momento.</h2>
          <p>{experience.description}</p>
        </div>
        <div>
          <span>IDEAL PARA</span>
          <strong>{experience.group}</strong>
          <span>MOMENTO</span>
          <strong>{experience.moments.join(" · ")}</strong>
          <span>DRESS CODE</span>
          <strong>{experience.dressCode ?? "Según experiencia"}</strong>
        </div>
        <div>
          <span>INCLUYE</span>
          {experience.includes.map((item) => (
            <p key={item}>
              <Check />
              {item}
            </p>
          ))}
        </div>
      </section>
      <section className="dining-recommendations">
        <span>COMPLETÁ LA NOCHE</span>
        <h2>¿Necesitás algo más?</h2>
        <div>
          {recommendations.map((item) => (
            <button key={item.slug} onClick={() => setSelected(item)}>
              <Image src={item.image} alt="" fill sizes="30vw" />
              <div className="public-card-shade" />
              <b>{item.name}</b>
              <small>Agregar a la solicitud</small>
            </button>
          ))}
        </div>
      </section>
      <DiningRequest experience={selected} onClose={() => setSelected(null)} />
    </PublicPageShell>
  );
}
