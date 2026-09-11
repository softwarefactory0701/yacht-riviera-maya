"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  MapPin,
  MessageCircle,
  Send,
  Users,
} from "lucide-react";
import { jamesActivities, jamesCase } from "@/lib/demo-case";
import { Header, Modal, Page, StatusBadge, Toast } from "./ui";

const usd = (value: number) => `USD ${value.toLocaleString("en-US")}`;
export function ActivityTimeline({
  events = jamesActivities,
  limit,
}: {
  events?: typeof jamesActivities;
  limit?: number;
}) {
  return (
    <div className="activity-timeline">
      {events.slice(0, limit).map((event, index) => (
        <div key={`${event.label}-${index}`}>
          <i>{index < events.length - 1 && <span />}</i>
          <p>
            <strong>{event.label}</strong>
            <small>{event.meta}</small>
          </p>
        </div>
      ))}
    </div>
  );
}
function Crumb({
  parent,
  href,
  current,
}: {
  parent: string;
  href: string;
  current: string;
}) {
  return (
    <nav className="entity-crumb">
      <Link href={href}>{parent}</Link>
      <ChevronRight />
      <span>{current}</span>
    </nav>
  );
}
function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={accent ? "metric accent" : "metric"}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
function Actions({ children }: { children: ReactNode }) {
  return <div className="action-row">{children}</div>;
}

export function JamesLeadDetail() {
  const [note, setNote] = useState(false);
  const [toast, setToast] = useState("");
  return (
    <Page>
      <Crumb
        parent="Leads"
        href="/leads"
        current={`${jamesCase.leadId} · James Miller`}
      />
      <Header
        eyebrow={`${jamesCase.leadId} · ${jamesCase.source.toUpperCase()}`}
        title={jamesCase.name}
        action={
          <Actions>
            <Link className="btn" href={`/quotes/${jamesCase.quoteId}`}>
              Crear cotización
            </Link>
            <button
              className="btn secondary"
              onClick={() => setToast("Conversación de Instagram abierta")}
            >
              Contactar
            </button>
          </Actions>
        }
      />
      <div className="golden-layout">
        <section>
          <div className="lead-hero-card">
            <div>
              <span className="destination-badge">MIAMI</span>
              <StatusBadge>Contactado</StatusBadge>
              <h2>Plan Your Stay</h2>
              <p>
                {jamesCase.dates} · {jamesCase.guests} personas ·{" "}
                {jamesCase.style}
              </p>
            </div>
            <Metric label="Budget" value={jamesCase.budget} />
          </div>
          <section className="panel">
            <h2>Interests</h2>
            <div className="interest-tags">
              {jamesCase.interests.map((interest) => (
                <span key={interest}>{interest}</span>
              ))}
            </div>
            <div className="lead-detail-grid">
              <Metric label="Source" value="Instagram" />
              <Metric label="Destination" value="Miami" />
              <Metric label="Owner" value="Sofía" />
              <Metric label="Status" value="Contacted" />
            </div>
            <Actions>
              <button onClick={() => setToast("Lead status updated")}>
                Cambiar estado
              </button>
              <button onClick={() => setNote(true)}>Agregar nota</button>
            </Actions>
            {note && (
              <div className="inline-note">
                <textarea defaultValue="Confirmar duración del yacht y presupuesto final." />
                <button
                  className="btn"
                  onClick={() => {
                    setNote(false);
                    setToast("Internal note added");
                  }}
                >
                  Guardar nota
                </button>
              </div>
            )}
          </section>
        </section>
        <aside className="panel">
          <h2>Commercial timeline</h2>
          <ActivityTimeline limit={6} />
          <Link
            className="related-link"
            href={`/messages?conversation=${jamesCase.conversationId}`}
          >
            Ver conversación <ChevronRight />
          </Link>
          <Link className="related-link" href={`/quotes/${jamesCase.quoteId}`}>
            Ver cotización <ChevronRight />
          </Link>
        </aside>
      </div>
      <Toast message={toast} />
    </Page>
  );
}

export function JamesQuote() {
  const [services, setServices] = useState(jamesCase.services);
  const [proposal, setProposal] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const total = services.reduce((sum, item) => sum + item.sale, 0);
  const cost = services.reduce((sum, item) => sum + item.cost, 0);
  const margin = total - cost;
  const update = (id: string, field: "cost" | "sale", value: number) =>
    setServices((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  return (
    <Page>
      <Crumb parent="Quotes" href="/quotes" current={jamesCase.quoteId} />
      <Header
        eyebrow={`${jamesCase.quoteId} · DRAFT`}
        title="Miami Private Weekend"
        action={
          <button className="btn" onClick={() => setProposal(true)}>
            Generar propuesta <Send />
          </button>
        }
      />
      <div className="quote-client golden-quote-client">
        <div>
          <small>CLIENT</small>
          <strong>James Miller</strong>
        </div>
        <div>
          <small>DESTINATION</small>
          <strong>Miami</strong>
        </div>
        <div>
          <small>DATES</small>
          <strong>{jamesCase.dates}</strong>
        </div>
        <div>
          <small>GUESTS</small>
          <strong>8</strong>
        </div>
      </div>
      <div className="quote-workspace">
        <section>
          <h2>Servicios sugeridos</h2>
          <div className="quote-lines">
            <div className="quote-line head">
              <span>SERVICIO / PROVEEDOR</span>
              <span>CANT.</span>
              <span>COSTO</span>
              <span>VENTA</span>
              <span>MARGEN</span>
            </div>
            {services.map((item) => (
              <div className="quote-line" key={item.id}>
                <div>
                  <strong>{item.service}</strong>
                  <small>{item.supplier}</small>
                </div>
                <span>1</span>
                <label>
                  <span className="currency-prefix">USD</span>
                  <input
                    type="number"
                    value={item.cost}
                    onChange={(e) => update(item.id, "cost", +e.target.value)}
                  />
                </label>
                <label>
                  <span className="currency-prefix">USD</span>
                  <input
                    type="number"
                    value={item.sale}
                    onChange={(e) => update(item.id, "sale", +e.target.value)}
                  />
                </label>
                <b>
                  {usd(item.sale - item.cost)}
                  <small>
                    {(((item.sale - item.cost) / item.sale) * 100).toFixed(1)}%
                  </small>
                </b>
              </div>
            ))}
          </div>
        </section>
        <aside className="quote-financial">
          <span>RESUMEN INTERNO</span>
          <h2>Rentabilidad</h2>
          <Metric label="Supplier Costs" value={usd(cost)} />
          <Metric label="Client Total" value={usd(total)} />
          <Metric label="YRM Margin" value={usd(margin)} accent />
          <Metric
            label="Margin %"
            value={`${((margin / total) * 100).toFixed(1)}%`}
          />
          <button className="btn wide" onClick={() => setProposal(true)}>
            Generar propuesta
          </button>
        </aside>
      </div>
      <Modal open={proposal} onClose={() => setProposal(false)}>
        <div className="proposal golden-proposal">
          <div className="proposal-cover">
            <Image
              src="/demo/yacht-main.jpg"
              alt="Miami Private Weekend"
              fill
              sizes="(max-width:800px) 96vw,1080px"
            />
            <div className="shade" />
            <div className="proposal-brand">
              <small>YACHT RIVIERA MAYA</small>
              <span>
                PROPOSAL {jamesCase.quoteId}
                <br />
                PRIVATE CLIENT
              </span>
            </div>
            <div className="proposal-heading">
              <span>CURATED FOR JAMES MILLER</span>
              <h1>MIAMI PRIVATE WEEKEND</h1>
              <p>{jamesCase.dates} · 8 guests · Miami</p>
            </div>
          </div>
          <div className="proposal-body">
            <div className="proposal-facts">
              <div>
                <CalendarDays />
                <span>
                  DATES<strong>{jamesCase.dates}</strong>
                </span>
              </div>
              <div>
                <Users />
                <span>
                  GUESTS<strong>8 guests</strong>
                </span>
              </div>
              <div>
                <MapPin />
                <span>
                  DESTINATION<strong>Miami</strong>
                </span>
              </div>
            </div>
            <section className="proposal-services">
              <h2>Your private itinerary</h2>
              <div>
                {services.map((item) => (
                  <article key={item.id}>
                    <div>
                      <strong>{item.publicName}</strong>
                      <span>Personally coordinated by Yacht RM concierge</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <aside className="client-total">
              <span>CLIENT TOTAL</span>
              <b>{usd(jamesCase.total)}</b>
              <div>
                <span>
                  Deposit<strong>{usd(jamesCase.deposit)}</strong>
                </span>
                <span>
                  Balance<strong>{usd(jamesCase.deposit)}</strong>
                </span>
              </div>
              {accepted ? (
                <div className="booking-created">
                  <Check />
                  <span>BOOKING CREATED</span>
                  <b>{jamesCase.bookingId}</b>
                  <p>James Miller · Miami · {usd(jamesCase.total)}</p>
                  <Link
                    className="btn"
                    href={`/bookings/${jamesCase.bookingId}`}
                  >
                    Ver reserva
                  </Link>
                </div>
              ) : (
                <button
                  className="btn wide"
                  onClick={() => {
                    sessionStorage.setItem("yrm-james-booking", "confirmed");
                    setAccepted(true);
                  }}
                >
                  Confirmar propuesta
                </button>
              )}
            </aside>
          </div>
        </div>
      </Modal>
    </Page>
  );
}

export function JamesBooking() {
  return (
    <Page>
      <Crumb parent="Bookings" href="/bookings" current={jamesCase.bookingId} />
      <Header
        eyebrow={`${jamesCase.bookingId} · BOOKING`}
        title="James Miller"
        action={<StatusBadge>Confirmed</StatusBadge>}
      />
      <section className="detail-metrics">
        <Metric label="Destination" value="Miami" />
        <Metric label="Dates" value={jamesCase.dates} />
        <Metric label="Guests" value="8" />
        <Metric label="Total" value={usd(jamesCase.total)} accent />
        <Metric label="Deposit" value={`${usd(jamesCase.deposit)} · Paid`} />
        <Metric label="Balance" value={`${usd(jamesCase.deposit)} · Pending`} />
      </section>
      <div className="golden-layout">
        <section className="panel">
          <h2>Miami Private Weekend</h2>
          {jamesCase.services.map((item) => (
            <div className="doc" key={item.id}>
              <span>{item.publicName}</span>
              <StatusBadge>Confirmed</StatusBadge>
            </div>
          ))}
          <Link className="btn" href={`/operations/${jamesCase.operationId}`}>
            Create operation
          </Link>
        </section>
        <aside className="panel">
          <h2>Booking timeline</h2>
          <ActivityTimeline />
          <Link
            className="related-link"
            href={`/operations/${jamesCase.operationId}`}
          >
            View operation <ChevronRight />
          </Link>
        </aside>
      </div>
    </Page>
  );
}

export function JamesOperation() {
  const [status, setStatus] = useState("Preparing");
  const [providers, setProviders] = useState([true, true, true, false]);
  const [toast, setToast] = useState("");
  const itinerary = [
    ["13:00", "Hotel pickup"],
    ["14:00", "Marina arrival"],
    ["14:30", "Yacht departure"],
    ["19:30", "Return"],
    ["20:15", "Transfer to dinner"],
    ["22:00", "Nightlife"],
  ];
  return (
    <Page>
      <Crumb
        parent="Operations"
        href="/operations"
        current={jamesCase.operationId}
      />
      <Header
        eyebrow={`${jamesCase.operationId} · MIAMI`}
        title="James Miller"
        action={
          <select
            className="entity-status-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setToast("Operation updated");
            }}
          >
            {["Preparing", "Ready", "In Operation", "Completed", "Issue"].map(
              (s) => (
                <option key={s}>{s}</option>
              ),
            )}
          </select>
        }
      />
      <p className="lede">Nov 14 · 8 guests · Miami Private Weekend</p>
      <div className="operation-detail">
        <section>
          <section className="panel">
            <h2>Run of show</h2>
            {itinerary.map(([time, label]) => (
              <div className="timeline" key={time}>
                <time>{time}</time>
                <i />
                <span>{label}</span>
              </div>
            ))}
          </section>
          <section className="panel">
            <h2>Provider confirmations</h2>
            {jamesCase.services.map((item, index) => (
              <button
                className="confirmation-line"
                key={item.id}
                onClick={() =>
                  setProviders((current) =>
                    current.map((value, i) => (i === index ? !value : value)),
                  )
                }
              >
                <i className={providers[index] ? "done" : ""}>
                  {providers[index] && <Check />}
                </i>
                <div>
                  <strong>{item.supplier}</strong>
                  <small>{item.service}</small>
                </div>
                <StatusBadge>
                  {providers[index] ? "Confirmed" : "Pending"}
                </StatusBadge>
              </button>
            ))}
          </section>
        </section>
        <aside>
          <section className="panel operation-money">
            <h2>Payments</h2>
            <Metric
              label="Deposit"
              value={`${usd(jamesCase.deposit)} · Paid`}
            />
            <Metric
              label="Balance"
              value={`${usd(jamesCase.deposit)} · Pending`}
            />
            <Metric label="Supplier cost" value={usd(jamesCase.supplierCost)} />
            <Metric label="YRM Margin" value={usd(jamesCase.margin)} accent />
          </section>
          <section className="panel">
            <h2>Activity</h2>
            <ActivityTimeline />
            <Link
              className="related-link"
              href={`/clients/${jamesCase.clientId}`}
            >
              View client <ChevronRight />
            </Link>
          </section>
        </aside>
      </div>
      <Toast message={toast} />
    </Page>
  );
}

export function JamesClient() {
  return (
    <Page>
      <Crumb parent="Clients" href="/clients" current="James Miller" />
      <Header
        eyebrow="CLIENT · CRM GLOBAL"
        title="James Miller"
        action={
          <Actions>
            <button className="btn secondary">
              <MessageCircle /> Contactar
            </button>
            <Link className="btn" href={`/quotes/${jamesCase.quoteId}`}>
              Nueva cotización
            </Link>
          </Actions>
        }
      />
      <section className="detail-metrics">
        <Metric label="Total purchased" value={usd(jamesCase.total)} />
        <Metric label="Margin generated" value={usd(jamesCase.margin)} accent />
        <Metric label="Bookings" value="1" />
        <Metric label="Last contact" value="Sep 12 · Instagram" />
        <Metric label="Destinations" value="Miami" />
      </section>
      <div className="golden-layout">
        <section className="panel">
          <h2>Travel history</h2>
          <div className="travel-history">
            <span>NOV 2026</span>
            <strong>Miami · Private Weekend</strong>
            <b>{usd(jamesCase.total)}</b>
            <StatusBadge>Confirmed</StatusBadge>
          </div>
          <h2>Commercial profile</h2>
          <Metric label="Source" value="Instagram" />
          <Metric label="Style" value="Luxury Weekend" />
          <Metric label="Group" value="8 guests" />
          <Metric label="Interests" value={jamesCase.interests.join(" · ")} />
        </section>
        <aside className="panel">
          <h2>Global timeline</h2>
          <ActivityTimeline />
        </aside>
      </div>
    </Page>
  );
}
