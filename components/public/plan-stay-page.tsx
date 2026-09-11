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
} from "lucide-react";
import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CuratedExperience, Destination } from "@/lib/public-types";
import { PublicPageShell } from "./public-shell";

const interestsList = [
  "Yacht",
  "Villa",
  "Dining",
  "Nightlife",
  "Private Chef",
  "Transport",
  "Luxury Car",
  "Wellness",
  "Shopping",
  "Golf",
  "Fishing",
  "Tours",
  "Beach Club",
  "Private Aviation",
  "Security",
  "Staff & Talent",
  "Other",
];
const styles = [
  "Relax",
  "Celebration",
  "Party",
  "Romantic",
  "Family",
  "Business",
  "Luxury Weekend",
  "Full Concierge",
];
const budgets = [
  "< USD 5K",
  "USD 5K–10K",
  "USD 10K–25K",
  "USD 25K–50K",
  "USD 50K+",
];

export function PlanStayPage({
  destinations,
  curated,
  preset,
}: {
  destinations: Destination[];
  curated: CuratedExperience[];
  preset?: CuratedExperience | Destination;
}) {
  const presetExperience = preset && "interests" in preset ? preset : undefined;
  const presetDestination = presetExperience
    ? destinations.find((item) => item.id === presetExperience.destinationId)
    : preset && "country" in preset
      ? preset
      : destinations[0];
  const [step, setStep] = useState(1),
    [destination, setDestination] = useState(presetDestination),
    [arrival, setArrival] = useState("2026-11-12"),
    [departure, setDeparture] = useState("2026-11-16"),
    [guests, setGuests] = useState(8),
    [stayType, setStayType] = useState("Todavía no sé"),
    [hotel, setHotel] = useState(""),
    [interests, setInterests] = useState<string[]>(
      presetExperience?.interests ?? [],
    ),
    [style, setStyle] = useState(presetExperience?.style ?? ""),
    [budget, setBudget] = useState(""),
    [firstName, setFirstName] = useState(""),
    [lastName, setLastName] = useState(""),
    [whatsapp, setWhatsapp] = useState(""),
    [email, setEmail] = useState(""),
    [country, setCountry] = useState(""),
    [method, setMethod] = useState("WhatsApp"),
    [notes, setNotes] = useState(""),
    [consent, setConsent] = useState(false),
    [done, setDone] = useState(false);
  const toggle = (value: string) =>
    setInterests((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!destination) return;
    const trip = {
      source: "public-plan-your-stay",
      client: {
        firstName,
        lastName,
        whatsapp,
        email,
        country,
        preferredContact: method,
        consent,
      },
      destinationId: destination.id,
      destination: destination.name,
      arrivalDate: arrival,
      departureDate: departure,
      guests,
      accommodation: { type: stayType, nameOrZone: hotel },
      interests,
      style,
      budgetRange: budget,
      notes,
      assignedExecutive: null,
      status: "New",
    };
    sessionStorage.setItem("yrm-trip-request", JSON.stringify(trip));
    setDone(true);
  };
  return (
    <PublicPageShell destination={destination?.name ?? "Multi-destino"}>
      <section className="plan-hero">
        <Image
          src="/demo/jet.jpg"
          alt="Plan Your Stay"
          fill
          priority
          sizes="100vw"
        />
        <div className="public-hero-shade" />
        <div>
          <span>PLAN YOUR STAY</span>
          <h1>
            Contanos el viaje.
            <br />
            Nosotros diseñamos el resto.
          </h1>
          <p>
            Yates, dining, movilidad, villas, nightlife y experiencias
            coordinadas en un solo itinerario.
          </p>
          <a className="public-primary" href="#trip-planner">
            Empezar <ArrowRight />
          </a>
        </div>
      </section>
      <section className="trip-planner" id="trip-planner">
        <div className="trip-planner-intro">
          <span>YOUR TRIP · STEP {String(step).padStart(2, "0")}</span>
          <h2>
            {done
              ? "Estamos diseñando tu experiencia."
              : [
                  "Elegí el destino",
                  "Contanos sobre tu viaje",
                  "¿Qué querés vivir?",
                  "Definí tu estilo",
                  "¿Cómo te contactamos?",
                ][step - 1]}
          </h2>
          <div className="trip-progress">
            {[1, 2, 3, 4, 5].map((value) => (
              <i key={value} className={value <= step ? "active" : ""} />
            ))}
          </div>
        </div>
        {done ? (
          <div className="trip-success">
            <span>
              <Check />
            </span>
            <small>ESTAMOS DISEÑANDO TU EXPERIENCIA</small>
            <h3>{destination?.name}</h3>
            <p>
              {arrival} — {departure} · {guests} personas
            </p>
            <div>
              {interests.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <b>{style}</b>
            <strong>#YRM-TRIP-3018</strong>
            <p>
              Nuestro concierge revisará tu solicitud y preparará una propuesta
              personalizada.
            </p>
            <Link className="public-primary" href={`/${destination?.id}`}>
              Explorar {destination?.name}
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <AnimatePresence mode="wait">
              <motion.div
                className="trip-step"
                key={step}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                {step === 1 && (
                  <div className="trip-destinations">
                    {destinations.map((item) => (
                      <button
                        type="button"
                        className={destination?.id === item.id ? "active" : ""}
                        key={item.id}
                        onClick={() => setDestination(item)}
                      >
                        <Image
                          src={item.heroImage}
                          alt=""
                          fill
                          sizes="(max-width:700px) 100vw, 30vw"
                        />
                        <div className="public-card-shade" />
                        <span>{item.country}</span>
                        <b>{item.name}</b>
                        {destination?.id === item.id && (
                          <i>
                            <Check />
                          </i>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <div className="trip-fields">
                    <label>
                      Fecha de llegada
                      <input
                        type="date"
                        value={arrival}
                        onChange={(e) => setArrival(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Fecha de salida
                      <input
                        type="date"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        required
                      />
                    </label>
                    <label>
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
                    <fieldset>
                      <legend>¿Dónde te alojás?</legend>
                      <div className="trip-options">
                        {["Hotel", "Villa", "Todavía no sé"].map((value) => (
                          <button
                            type="button"
                            className={stayType === value ? "active" : ""}
                            key={value}
                            onClick={() => setStayType(value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <label className="wide">
                      Hotel / Zona (opcional)
                      <input
                        value={hotel}
                        onChange={(e) => setHotel(e.target.value)}
                      />
                    </label>
                  </div>
                )}
                {step === 3 && (
                  <div className="trip-choice-grid">
                    {interestsList.map((value) => (
                      <button
                        type="button"
                        className={interests.includes(value) ? "active" : ""}
                        key={value}
                        onClick={() => toggle(value)}
                      >
                        {interests.includes(value) && <Check />}
                        {value}
                      </button>
                    ))}
                  </div>
                )}
                {step === 4 && (
                  <>
                    <span className="trip-question">
                      ¿Qué tipo de experiencia estás buscando?
                    </span>
                    <div className="trip-style-grid">
                      {styles.map((value) => (
                        <button
                          type="button"
                          className={style === value ? "active" : ""}
                          key={value}
                          onClick={() => setStyle(value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <span className="trip-question">
                      Presupuesto aproximado (opcional)
                    </span>
                    <div className="trip-options">
                      {budgets.map((value) => (
                        <button
                          type="button"
                          className={budget === value ? "active" : ""}
                          key={value}
                          onClick={() => setBudget(value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {step === 5 && (
                  <div className="trip-fields">
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
                    <label>
                      País
                      <input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                      />
                    </label>
                    <fieldset>
                      <legend>Preferred contact</legend>
                      <div className="trip-options">
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
                    <label className="wide">
                      ¿Hay algo que quieras que sepamos?
                      <textarea
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </label>
                    <label className="trip-consent wide">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        required
                      />
                      Acepto ser contactado por Yacht RM respecto a este viaje.
                    </label>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <footer>
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)}>
                  <ChevronLeft /> Atrás
                </button>
              )}
              <button
                type={step === 5 ? "submit" : "button"}
                className="public-primary"
                disabled={
                  (step === 1 && !destination) || (step === 5 && !consent)
                }
                onClick={() => step < 5 && setStep(step + 1)}
              >
                {step === 5 ? "Enviar mi viaje" : "Continuar"}
                <ChevronRight />
              </button>
            </footer>
          </form>
        )}
      </section>
      <section className="curated-trips">
        <div>
          <span>CURATED EXPERIENCES</span>
          <h2>
            Un punto de partida.
            <br />
            Siempre personalizado.
          </h2>
        </div>
        <div>
          {curated.map((experience) => (
            <article key={experience.id}>
              <div>
                <Image
                  src={experience.image}
                  alt={experience.name}
                  fill
                  sizes="(max-width:700px) 100vw, 33vw"
                />
                <div className="public-card-shade" />
                <span>{experience.destination}</span>
                <h3>{experience.name}</h3>
              </div>
              <div>
                {experience.days.map((day) => (
                  <p key={day.day}>
                    <b>DAY {day.day}</b>
                    {day.activities.join(" · ")}
                  </p>
                ))}
                <Link href={`/plan-your-stay?experience=${experience.id}`}>
                  Personalizar esta experiencia <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
