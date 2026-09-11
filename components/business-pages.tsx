"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock,
  CalendarDays,
  Download,
  Mail,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";
import { Bars, Filters, Header, Modal, Page, StatusBadge, Toast } from "./ui";
import { MessagesPage } from "./messages-page";
import {
  calculateMargin,
  Lead,
  LeadStage,
  QuoteItem,
  TalentProfile,
} from "@/lib/types";
import {
  catalog,
  demoOperations,
  initialQuoteItems,
  leads as seedLeads,
  suppliers,
  talent as seedTalent,
} from "@/mock/business";
import { bookings } from "@/mock/bookings";
import { clients } from "@/mock/clients";
import { team } from "@/mock/team";
import {
  destinationForIndex,
  destinationName,
  filterForBranch,
  OperationalDestinationId,
  operationalDestinationIds,
  useDestination,
} from "@/lib/destination-context";

const usd = (n: number) => `USD ${Math.round(n).toLocaleString("en-US")}`;
function Section({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <span>{aside}</span>
    </div>
  );
}
function Metric({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: string;
  note?: string;
  accent?: boolean;
}) {
  return (
    <div className={accent ? "metric accent" : "metric"}>
      <span>{label}</span>
      <b>{value}</b>
      {note && <small>{note}</small>}
    </div>
  );
}
function useFeedback() {
  const [message, setMessage] = useState("");
  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2400);
  };
  return { message, notify };
}
export function BusinessPage(path: string) {
  if (path === "/messages") return <MessagesPage />;
  if (path === "/overview") return <Home />;
  if (path === "/operations") return <Operations />;
  if (path === "/leads") return <Leads />;
  if (path === "/assets" || path === "/fleet") return <Catalog />;
  if (path.startsWith("/fleet/"))
    return <ServiceDetail serviceId={path.split("/").pop() ?? "azimut-55"} />;
  if (path === "/suppliers" || path.startsWith("/suppliers/"))
    return <Suppliers supplierId={path.split("/")[2]} />;
  if (path === "/talent") return <Talent />;
  if (path === "/quotes") return <Quotes />;
  if (path === "/bookings") return <Bookings />;
  if (path.startsWith("/bookings/")) return <OperationDetail />;
  if (path === "/clients") return <Clients />;
  if (path.startsWith("/clients/")) return <ClientDetail />;
  if (path === "/finance") return <Finance />;
  if (path === "/team") return <Team />;
  return null;
}
const branchPerformance = {
  "riviera-maya": {
    sales: 184000,
    margin: 63000,
    operations: 42,
    leads: 27,
    quotes: 12,
    collections: 24600,
  },
  miami: {
    sales: 156000,
    margin: 48000,
    operations: 31,
    leads: 22,
    quotes: 10,
    collections: 19800,
  },
  "los-cabos": {
    sales: 88000,
    margin: 26000,
    operations: 21,
    leads: 14,
    quotes: 6,
    collections: 11200,
  },
};

function Home() {
  const { activeId, activeBranch, setActiveId } = useDestination();
  if (activeId === "global")
    return (
      <Page>
        <Header
          eyebrow="CENTRO DE OPERACIONES"
          title="Yacht RM Global"
          action={
            <Link className="btn" href="/quotes">
              <Plus />
              Nueva cotización
            </Link>
          }
        />
        <p className="lede">Una sola empresa. Tres destinos operativos.</p>
        <section className="hero-metrics global-kpis">
          <div className="primary">
            <small>VENTAS</small>
            <strong>USD 428K</strong>
            <em>consolidado</em>
          </div>
          <div>
            <small>MARGEN</small>
            <strong>USD 137K</strong>
            <em>32% global</em>
          </div>
          <div>
            <small>OPERACIONES</small>
            <strong>94</strong>
            <em>este mes</em>
          </div>
          <div>
            <small>LEADS ACTIVOS</small>
            <strong>63</strong>
            <em>28 cotizaciones abiertas</em>
          </div>
        </section>
        <Section title="Performance by destination" aside="SEPTIEMBRE 2026" />
        <div className="branch-performance">
          {operationalDestinationIds.map((id) => {
            const value = branchPerformance[id];
            return (
              <article key={id}>
                <span>{destinationName(id)}</span>
                <Metric label="Sales" value={usd(value.sales)} />
                <Metric label="Margin" value={usd(value.margin)} accent />
                <Metric label="Operations" value={String(value.operations)} />
                <button onClick={() => setActiveId(id)}>
                  Ver sucursal <ChevronRight />
                </button>
              </article>
            );
          })}
        </div>
        <div className="global-analytics">
          <section className="panel">
            <Section title="Sales by destination" />
            <Bars values={[92, 78, 44]} />
            <div className="chart-legend">
              <span>Riviera Maya · USD 184K</span>
              <span>Miami · USD 156K</span>
              <span>Los Cabos · USD 88K</span>
            </div>
          </section>
          <section className="panel">
            <Section title="Revenue trend" aside="ÚLTIMOS 6 MESES" />
            <Bars values={[42, 55, 49, 68, 74, 92]} />
            <div className="chart-legend">
              <span>Margen global · USD 137K</span>
              <span>94 operaciones · 63 leads</span>
            </div>
          </section>
        </div>
        <InboxWidget />
      </Page>
    );
  const value = branchPerformance[activeId];
  return (
    <Page>
      <Header
        eyebrow={activeBranch.country?.toUpperCase()}
        title={activeBranch.name}
        action={
          <Link className="btn" href="/quotes">
            <Plus />
            Nueva cotización
          </Link>
        }
      />
      <p className="lede">
        Operations Overview · información filtrada para {activeBranch.name}.
      </p>
      <section className="hero-metrics branch-kpis">
        <div className="primary">
          <small>VENTAS {activeBranch.shortName.toUpperCase()}</small>
          <strong>{usd(value.sales)}</strong>
        </div>
        <div>
          <small>MARGEN</small>
          <strong>{usd(value.margin)}</strong>
        </div>
        <div>
          <small>OPERACIONES ACTIVAS</small>
          <strong>{Math.ceil(value.operations / 3)}</strong>
        </div>
        <div>
          <small>LEADS / COTIZACIONES</small>
          <strong>
            {value.leads} / {value.quotes}
          </strong>
          <em>{usd(value.collections)} por cobrar</em>
        </div>
      </section>
      <div className="two-col">
        <section className="panel">
          <Section title={`Today in ${activeBranch.name}`} />
          <div className="doc">
            <span>
              {activeId === "miami"
                ? "VanDutch 55 · James Miller"
                : activeId === "los-cabos"
                  ? "Sunseeker 65 · Sofia Turner"
                  : "Azimut 55 · Roberto Hernández"}
            </span>
            <StatusBadge>Confirmado</StatusBadge>
            <ChevronRight />
          </div>
          <div className="doc">
            <span>Upcoming Operations · 4 servicios</span>
            <StatusBadge>En seguimiento</StatusBadge>
            <ChevronRight />
          </div>
        </section>
        <section className="panel">
          <Section title={`${activeBranch.name} Team`} />
          <Metric
            label="Equipo asignado"
            value={
              activeId === "miami"
                ? "Sofía · Concierge"
                : activeId === "los-cabos"
                  ? "Carlos · Operations"
                  : "Andrea · Operations"
            }
          />
          <Metric label="Provider Alerts" value="2 pendientes" />
          <Metric label="Recent Leads" value={String(value.leads)} />
        </section>
      </div>
      <InboxWidget />
    </Page>
  );
}

function InboxWidget() {
  return (
    <section className="inbox-widget">
      <div><span className="eyebrow">INBOX</span><h2>Conversaciones que requieren atención</h2></div>
      <dl><div><dt>Sin responder</dt><dd>12</dd></div><div><dt>Sin asignar</dt><dd>5</dd></div><div><dt>Nuevo hoy</dt><dd>18</dd></div></dl>
      <div className="inbox-widget-channels"><span>WhatsApp</span><span>Instagram</span><span>Facebook</span></div>
      <Link className="btn secondary" href="/messages">Ver mensajes <ChevronRight /></Link>
    </section>
  );
}

export function LegacyHome() {
  return (
    <Page>
      <Header
        eyebrow="CENTRO DE OPERACIONES"
        title="Inicio"
        action={
          <Link className="btn" href="/quotes">
            <Plus />
            Nueva cotización
          </Link>
        }
      />
      <p className="lede">
        Experiencias premium de terceros, coordinadas desde un solo lugar.
      </p>
      <section className="hero-metrics broker-kpis">
        <div className="primary">
          <small>OPERACIONES HOY</small>
          <b>6</b>
          <span>
            <i className="live" />2 en curso
          </span>
        </div>
        <div>
          <small>VENTAS HOY</small>
          <strong>USD 18,400</strong>
          <em>ventas confirmadas</em>
        </div>
        <div>
          <small>MARGEN HOY</small>
          <strong>USD 6,250</strong>
          <em>34% de margen</em>
        </div>
        <div className="attention">
          <small>REQUIEREN ATENCIÓN</small>
          <strong>2</strong>
          <em>confirmaciones pendientes</em>
        </div>
      </section>
      <div className="broker-home">
        <section>
          <Section title="Operaciones de hoy" aside="EN TIEMPO REAL" />
          <Link href="/bookings/YRM-3094" className="broker-operation">
            <div className="operation-time">
              <time>14:00</time>
              <StatusBadge>En operación</StatusBadge>
            </div>
            <div>
              <small>#YRM-3094 · ROBERTO HERNÁNDEZ</small>
              <h2>Azimut 55</h2>
              <p>Chef privado · DJ · Sprinter VIP · 4 Staff & Talent</p>
            </div>
            <div className="confirm-grid">
              <span>
                <Check />
                Yate confirmado
              </span>
              <span>
                <Check />
                Chef confirmado
              </span>
              <span>
                <Check />
                DJ confirmado
              </span>
              <span className="warning">3/4 Staff confirmados</span>
              <span>
                <Check />
                Transporte confirmado
              </span>
              <span className="warning">Cliente · 80% pagado</span>
            </div>
            <ChevronRight />
          </Link>
          <Section title="Alertas" />
          <div className="alerts">
            <p>
              <AlertTriangle />
              Falta confirmar 1 Staff en <b>#YRM-3094</b>
            </p>
            <p>
              <Clock />
              Cotización <b>#YRM-Q4021</b> sin respuesta hace 48 h
            </p>
            <p>
              <AlertTriangle />
              Tarifa Azimut 55 vence el 30 sep
            </p>
          </div>
        </section>
        <aside>
          <div className="panel commercial">
            <Section title="Comercial" />
            <Metric label="Leads nuevos" value="14" />
            <Metric label="Cotizaciones abiertas" value="8" />
            <Metric label="Esperando respuesta" value="4" />
            <Metric label="Tasa de cierre" value="31%" accent />
          </div>
          <div className="panel money-panel">
            <Section title="Dinero · septiembre" />
            <Metric label="Ventas del mes" value="USD 184,500" />
            <Metric label="Costo proveedores" value="USD 121,300" />
            <Metric label="Margen YRM" value="USD 63,200" accent />
            <Metric label="Pendiente de cobrar" value="USD 24,600" />
            <Metric label="Pendiente a proveedores" value="USD 18,400" />
          </div>
        </aside>
      </div>
    </Page>
  );
}
function Operations() {
  const [view, setView] = useState("Hoy");
  const { activeId } = useDestination();
  const timedRows =
    view === "Hoy"
      ? demoOperations.slice(0, 3)
      : view === "Mañana"
        ? demoOperations.slice(3, 6)
        : view === "Semana"
          ? demoOperations.slice(0, 7)
          : demoOperations;
  const operationRows = timedRows
    .map((operation, index) => ({
      ...operation,
      destinationId: destinationForIndex(index),
    }))
    .filter(
      (operation) =>
        activeId === "global" || operation.destinationId === activeId,
    );
  return (
    <Page>
      <Header
        eyebrow="COORDINACIÓN"
        title="Operaciones"
        action={
          <button className="btn secondary">
            <Search />
            Buscar operación
          </button>
        }
      />
      <Filters
        items={["Hoy", "Mañana", "Semana", "Todas"]}
        active={view}
        onChange={setView}
      />
      <div className="operation-board">
        <div className="operation-day">
          <b>
            {view === "Mañana"
              ? "MAÑANA · 7 DE SEPTIEMBRE"
              : view === "Hoy"
                ? "HOY · 6 DE SEPTIEMBRE"
                : "PRÓXIMAS OPERACIONES"}
          </b>
          <span>
            {operationRows.length} operaciones · confirmaciones en seguimiento
          </span>
        </div>
        {operationRows.map((o, i) => (
          <Link
            href={`/bookings/${o.id}`}
            className="operation-line"
            key={o.id}
          >
            <time>
              {
                ["14:00", "16:00", "18:30", "10:00", "12:30", "15:00", "17:00"][
                  i % 7
                ]
              }
            </time>
            <div>
              <small>#{o.id}</small>
              <strong>{o.client}</strong>
              <span className="destination-badge">
                {destinationName(o.destinationId)}
              </span>
            </div>
            <div>
              <small>SERVICIOS</small>
              <strong>{o.services}</strong>
            </div>
            <div>
              <StatusBadge>{o.status}</StatusBadge>
              <span className={i === 0 ? "warning" : ""}>
                {i === 0
                  ? "Staff 3/4 · Cliente 80%"
                  : "Proveedores confirmados"}
              </span>
            </div>
            <span className="view-operation">Ver operación</span>
          </Link>
        ))}
      </div>
      <div className="two-col">
        <section className="panel">
          <Section title="Confirmaciones pendientes" />
          <div className="doc">
            <span>Hostess · #YRM-3094</span>
            <StatusBadge>Por confirmar</StatusBadge>
            <ChevronRight />
          </div>
          <div className="doc">
            <span>Saldo cliente · #YRM-3104</span>
            <StatusBadge>Pendiente</StatusBadge>
            <ChevronRight />
          </div>
        </section>
        <section className="panel">
          <Section title="Pagos próximos" />
          <Metric label="Riviera Luxury Charters · hoy" value="USD 2,600" />
          <Metric label="Tulum Villas Collection · mañana" value="USD 1,900" />
        </section>
      </div>
    </Page>
  );
}
function Leads() {
  const { activeId } = useDestination();
  const [stage, setStage] = useState("Todos"),
    [data, setData] = useState<Lead[]>([
      ...seedLeads,
      {
        id: "L-WEB-3018",
        name: "James Miller",
        country: "Estados Unidos",
        phone: "+1 305 555 0188",
        date: "12–16 nov",
        guests: 8,
        stay: "Miami",
        budget: 18000,
        interest: "Plan Your Stay",
        source: "Web",
        owner: "Matías",
        lastContact: "Hace 12 min",
        nextAction: "Revisar solicitud web",
        stage: "Nuevo",
        notes: "Yacht · Dining · Nightlife · Transport · Luxury Weekend",
      },
    ]),
    [selected, setSelected] = useState<string | null>(null);
  const feedback = useFeedback();
  const stages = [
    "Todos",
    "Nuevo",
    "Contactado",
    "Armando propuesta",
    "Cotización enviada",
    "Negociación",
    "Confirmado",
    "Perdido",
  ];
  const enrichedLeads = data.map((lead, index) => ({
    ...lead,
    destinationId:
      lead.id === "L-WEB-3018"
        ? ("miami" as const)
        : destinationForIndex(index),
  }));
  const visible = enrichedLeads.filter(
    (lead) =>
      (stage === "Todos" || lead.stage === stage) &&
      (activeId === "global" || lead.destinationId === activeId),
  );
  const selectedLead = enrichedLeads.find((lead) => lead.id === selected);
  const change = (id: string) => {
    setData((a) =>
      a.map((l) => (l.id === id ? { ...l, stage: nextStage(l.stage) } : l)),
    );
    feedback.notify("Estado actualizado");
  };
  return (
    <Page>
      <Header
        eyebrow="PIPELINE COMERCIAL"
        title="Leads"
        action={
          <button className="btn">
            <Plus />
            Nuevo lead
          </button>
        }
      />
      <Filters items={stages} active={stage} onChange={setStage} />
      <div className="lead-summary">
        <Metric label="Leads abiertos" value="14" />
        <Metric label="Cotizaciones por enviar" value="3" />
        <Metric label="Valor potencial" value="USD 68,400" />
        <Metric label="Tasa de cierre" value="31%" accent />
      </div>
      <div className="lead-grid">
        {visible.map((l) => (
          <article className="lead-card" key={l.id}>
            <div>
              <StatusBadge>{l.stage}</StatusBadge>
              <small>
                {l.id} · {l.source}
              </small>
              <span className="destination-badge">
                {destinationName(l.destinationId)}
              </span>
            </div>
            <h2>{l.name}</h2>
            <p>
              {l.country} · {l.stay}
            </p>
            <div className="lead-facts">
              <Metric label="Busca" value={l.interest} />
              <Metric label="Fecha" value={l.date} />
              <Metric label="Personas" value={String(l.guests)} />
              <Metric label="Presupuesto" value={usd(l.budget)} />
            </div>
            <p className="next-action">
              Próxima acción · <b>{l.nextAction}</b>
              <br />
              <span>Último contacto {l.lastContact.toLowerCase()}</span>
            </p>
            <div className="card-actions">
              <button onClick={() => setSelected(l.id)}>Ver detalle</button>
              <Link href="/quotes">Crear cotización</Link>
              <button onClick={() => setSelected(l.id)}>Agregar nota</button>
              <button onClick={() => change(l.id)}>Cambiar estado</button>
              <button
                onClick={() => feedback.notify("Conversación lista para abrir")}
              >
                <MessageCircle />
                Contactar
              </button>
            </div>
          </article>
        ))}
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selectedLead && (
          <div className="web-lead-detail">
            <span className="eyebrow">
              {selectedLead.source === "Web"
                ? "WEB · PLAN YOUR STAY"
                : "DETALLE DEL LEAD"}
            </span>
            <h2>{selectedLead.name}</h2>
            <div className="lead-detail-grid">
              <Metric label="Source" value={selectedLead.source} />
              <Metric
                label="Destination"
                value={destinationName(selectedLead.destinationId)}
              />
              <Metric label="Request" value={selectedLead.interest} />
              <Metric label="Dates" value={selectedLead.date} />
              <Metric label="Guests" value={String(selectedLead.guests)} />
              <Metric label="Hotel" value="TBD" />
              <Metric
                label="Style"
                value={
                  selectedLead.id === "L-WEB-3018"
                    ? "Luxury Weekend"
                    : "A definir"
                }
              />
              <Metric label="Budget" value={usd(selectedLead.budget)} />
            </div>
            <Section title="Interests" />
            <div className="interest-tags">
              {selectedLead.notes.split(" · ").map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="web-lead-actions">
              <Link className="btn" href="/quotes">
                Create Quote
              </Link>
              <button onClick={() => feedback.notify("Nota agregada")}>
                Add Note
              </button>
              <button onClick={() => change(selectedLead.id)}>
                Change Status
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Toast message={feedback.message} />
    </Page>
  );
}
function nextStage(s: LeadStage): LeadStage {
  const p: LeadStage[] = [
    "Nuevo",
    "Contactado",
    "Armando propuesta",
    "Cotización enviada",
    "Negociación",
    "Confirmado",
    "Perdido",
  ];
  return p[Math.min(p.indexOf(s) + 1, p.length - 1)];
}
function Catalog() {
  const [f, setF] = useState("Todos");
  const { activeId } = useDestination();
  const categories = [
    "Todos",
    "Yates",
    "Villas",
    "Autos",
    "Jets privados",
    "Transportación",
    "Experiencias",
    "Real Estate",
    "Gastronomía",
    "Wellness",
    "Seguridad",
    "Staff & Talent",
    "Otros",
  ];
  const visibleCatalog = catalog
    .map((item, index) => ({
      ...item,
      destinationId: destinationForIndex(index),
    }))
    .filter(
      (item) =>
        (f === "Todos" || item.category === f) &&
        (activeId === "global" || item.destinationId === activeId),
    );
  return (
    <Page>
      <Header
        eyebrow="SERVICIOS DE TERCEROS"
        title="Catálogo"
        action={
          <button className="btn secondary">
            <Plus />
            Agregar servicio
          </button>
        }
      />
      <p className="lede">
        Todo lo que Yacht Riviera Maya puede cotizar y coordinar.
      </p>
      <Filters items={categories} active={f} onChange={setF} />
      <div className="catalog-grid">
        {visibleCatalog.map((c) => {
          const r = c.rates[0],
            supplier = suppliers.find((s) => s.id === c.supplierId);
          return (
            <article className="catalog-card" key={c.id}>
              <div className="catalog-photo">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
                <div className="shade" />
                <StatusBadge>{c.status}</StatusBadge>
                <span>{c.category}</span>
                <b className="destination-badge">
                  {destinationName(c.destinationId)}
                </b>
              </div>
              <div className="catalog-copy">
                <h2>{c.name}</h2>
                <p>
                  <MapPin />
                  {c.location} · {c.capacity}
                </p>
                <Metric
                  label="Proveedor"
                  value={supplier?.name ?? "Proveedor asociado"}
                />
                <div className="rate-strip">
                  <Metric label="Costo desde" value={usd(r.supplierCost)} />
                  <Metric label="Venta sugerida" value={usd(r.salePrice)} />
                  <Metric
                    label="Margen desde"
                    value={usd(r.salePrice - r.supplierCost)}
                    accent
                  />
                </div>
                <div className="card-actions">
                  <Link href="/quotes">Cotizar</Link>
                  <Link href={`/fleet/${c.id}`}>Ver tarifas</Link>
                  <Link href="/suppliers">Ver proveedor</Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {!visibleCatalog.length && (
        <div className="empty-state">
          <Search />
          <h2>No encontramos opciones con estos filtros.</h2>
          <p>Prueba otra categoría o consulta disponibilidad bajo solicitud.</p>
          <button className="btn secondary" onClick={() => setF("Todos")}>
            Limpiar filtros
          </button>
        </div>
      )}
    </Page>
  );
}
function ServiceDetail({ serviceId }: { serviceId: string }) {
  const c = catalog.find((item) => item.id === serviceId) ?? catalog[0],
    s =
      suppliers.find((supplier) => supplier.id === c.supplierId) ??
      suppliers[0];
  return (
    <Page>
      <div className="service-hero">
        <Image src={c.image} alt={c.name} fill priority sizes="100vw" />
        <div className="shade" />
        <Link href="/assets">← Catálogo</Link>
        <div>
          <StatusBadge>{c.status}</StatusBadge>
          <h1>AZIMUT 55</h1>
          <p>Servicio operado por {s.name}</p>
        </div>
      </div>
      <section className="detail-metrics">
        <Metric label="Ventas este mes" value="USD 42,000" />
        <Metric label="Costo proveedores" value="USD 29,400" />
        <Metric label="Margen generado" value="USD 12,600" accent />
        <Metric label="Operaciones" value="7" />
      </section>
      <div className="two-col">
        <section className="panel">
          <Section title="Información del servicio" />
          <Metric label="Proveedor" value={s.name} />
          <Metric label="Puerto" value={c.location} />
          <Metric label="Capacidad" value={c.capacity} />
          <Metric
            label="Salidas"
            value={c.departures?.join(" · ") ?? "Bajo solicitud"}
          />
          <Metric label="Duraciones" value="4 h · 6 h · 8 h" />
          <Metric label="Anticipo proveedor" value="50%" />
          <p className="panel-note">{c.conditions}</p>
        </section>
        <section className="panel">
          <Section title="Condiciones comerciales" />
          <p>
            Cancelación sin cargo hasta 7 días antes. Cambios sujetos a
            disponibilidad del proveedor.
          </p>
          <Metric label="Vigencia de tarifa" value="30 sep 2026" />
          <Metric label="Tiempo de respuesta" value="Excelente" />
        </section>
      </div>
      <Section title="Tarifas y temporadas" aside="USD" />
      <div className="rate-table">
        <div>
          <b>TEMPORADA</b>
          <b>DURACIÓN</b>
          <b>COSTO PROVEEDOR</b>
          <b>VENTA SUGERIDA</b>
          <b>MARGEN</b>
        </div>
        {c.rates.map((r, i) => (
          <div key={i}>
            <span>
              {r.season}
              {r.adjustment && <small>+{r.adjustment}%</small>}
            </span>
            <strong>{r.duration}</strong>
            <span>{usd(r.supplierCost)}</span>
            <span>{usd(r.salePrice)}</span>
            <b>{usd(r.salePrice - r.supplierCost)}</b>
          </div>
        ))}
      </div>
    </Page>
  );
}
function Suppliers({ supplierId }: { supplierId?: string }) {
  const [tab, setTab] = useState("Resumen");
  const { activeId } = useDestination();
  const supplierRows = suppliers.map((supplier, index) => ({
    ...supplier,
    destinations:
      index === 2
        ? (["riviera-maya", "miami"] as const)
        : index === 1
          ? (["riviera-maya", "los-cabos"] as const)
          : ([destinationForIndex(index)] as const),
  }));
  const visibleSuppliers = filterForBranch(
    supplierRows,
    activeId,
    (supplier) => [...supplier.destinations],
  );
  const selectedSupplier =
    suppliers.find((supplier) => supplier.id === supplierId) ?? suppliers[0];
  const tabRows: Record<string, string[]> = {
    Servicios: selectedSupplier.services,
    Tarifas: [
      selectedSupplier.terms,
      "Margen variable por servicio",
      "Vigencia revisada 30 sep 2026",
    ],
    Operaciones: [
      `${selectedSupplier.operations} operaciones realizadas`,
      "Última operación · hace 2 días",
      "Siguiente operación · 18 sep",
    ],
    Pagos: [
      `Monto comprado · ${usd(selectedSupplier.purchased)}`,
      `Pendiente · ${usd(Math.round(selectedSupplier.purchased * 0.08))}`,
      "Próximo pago · 18 sep",
    ],
    Notas: [selectedSupplier.notes, "Última actualización · hace 3 días"],
  };
  return (
    <Page>
      <Header
        eyebrow="RED DE PROVEEDORES"
        title="Proveedores"
        action={
          <button className="btn">
            <Plus />
            Nuevo proveedor
          </button>
        }
      />
      <div className="supplier-grid">
        {visibleSuppliers.map((s, i) => (
          <article
            className={
              i === 0 ? "supplier-card featured-supplier" : "supplier-card"
            }
            key={s.id}
          >
            <div>
              <StatusBadge>{s.response}</StatusBadge>
              <span>{s.category}</span>
            </div>
            <h2>{s.name}</h2>
            <p>
              {s.contact} · {s.zone}
            </p>
            <div className="destination-tags">
              {s.destinations.map((id) => (
                <span className="destination-badge" key={id}>
                  {destinationName(id)}
                </span>
              ))}
            </div>
            <div className="supplier-stats">
              <Metric label="Operaciones" value={String(s.operations)} />
              <Metric label="Monto comprado" value={usd(s.purchased)} />
              <Metric label="Rating interno" value={`${s.rating}/5`} accent />
            </div>
            <p>{s.services.join(" · ")}</p>
            <Link href={`/suppliers/${s.id}`} className="link-button">
              Ver ficha <ArrowUpRight />
            </Link>
          </article>
        ))}
      </div>
      <section className="panel supplier-detail">
        <Header eyebrow="FICHA DE PROVEEDOR" title={selectedSupplier.name} />
        <Filters
          items={[
            "Resumen",
            "Servicios",
            "Tarifas",
            "Operaciones",
            "Pagos",
            "Notas",
          ]}
          active={tab}
          onChange={setTab}
        />
        {tab !== "Resumen" && (
          <div className="supplier-tab-list">
            {tabRows[tab]?.map((row) => (
              <div className="doc" key={row}>
                <span>{row}</span>
                <StatusBadge>Confirmado</StatusBadge>
                <ChevronRight />
              </div>
            ))}
          </div>
        )}
        {tab === "Resumen" && (
          <div className="two-col">
            <div>
              <Metric label="Contacto" value={selectedSupplier.contact} />
              <Metric label="WhatsApp" value={selectedSupplier.phone} />
              <Metric label="Email" value={selectedSupplier.email} />
              <Metric label="Zona" value={selectedSupplier.zone} />
            </div>
            <div>
              <Metric label="Condiciones" value={selectedSupplier.terms} />
              <Metric label="Margen" value="Variable por embarcación" />
              <Metric
                label="Tiempo de respuesta"
                value={selectedSupplier.response}
              />
              <Metric
                label="Operaciones"
                value={String(selectedSupplier.operations)}
              />
              <Metric
                label="Pagos pendientes"
                value={usd(Math.round(selectedSupplier.purchased * 0.08))}
              />
              <Metric
                label="Rating interno"
                value={`${selectedSupplier.rating}/5`}
              />
              <p className="panel-note">
                {selectedSupplier.notes} Aquí se concentran condiciones, tarifas
                y seguimiento que antes vivían entre chats.
              </p>
            </div>
          </div>
        )}
      </section>
    </Page>
  );
}
function TalentDrawer({
  profile,
  onClose,
  onSelect,
  onRequest,
  onContact,
}: {
  profile: TalentProfile | null;
  onClose: () => void;
  onSelect: (profile: TalentProfile) => void;
  onRequest: (id: string) => void;
  onContact: (message: string) => void;
}) {
  useEffect(() => {
    if (!profile) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [profile, onClose]);

  return (
    <AnimatePresence>
      {profile && (
        <div className="talent-drawer-layer">
          <motion.button
            className="talent-drawer-overlay"
            aria-label="Cerrar perfil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="talent-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`Perfil de ${profile.name}`}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="talent-drawer-scroll">
              <header className="talent-profile-hero">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  sizes="620px"
                />
                <div className="talent-profile-shade" />
                <button
                  className="talent-drawer-close"
                  onClick={onClose}
                  aria-label="Cerrar"
                >
                  <X />
                </button>
                <div className="talent-profile-title">
                  <StatusBadge>{profile.availability}</StatusBadge>
                  <h2>{profile.name}</h2>
                  <p>
                    {profile.category} · {profile.zone}
                  </p>
                  <span>{profile.languages.join(" · ")}</span>
                </div>
              </header>

              <div className="talent-profile-body">
                <div className="talent-quick-metrics">
                  <Metric
                    label="Operaciones"
                    value={String(profile.operations)}
                  />
                  <Metric
                    label="Rating interno"
                    value={profile.rating.toFixed(1)}
                  />
                  <Metric label="Respuesta" value={profile.responseTime} />
                </div>

                <section className="talent-profile-section">
                  <Section title="Perfil profesional" />
                  <dl className="talent-detail-list">
                    <div>
                      <dt>Categoría</dt>
                      <dd>{profile.category}</dd>
                    </div>
                    <div>
                      <dt>Zona</dt>
                      <dd>{profile.zone} / Riviera Maya</dd>
                    </div>
                    <div>
                      <dt>Idiomas</dt>
                      <dd>{profile.languages.join(" · ")}</dd>
                    </div>
                    <div>
                      <dt>Experiencia</dt>
                      <dd>{profile.experience}</dd>
                    </div>
                    <div className="wide">
                      <dt>Especialidad</dt>
                      <dd>{profile.specialty}</dd>
                    </div>
                    <div>
                      <dt>Disponibilidad actual</dt>
                      <dd>{profile.availability}</dd>
                    </div>
                    <div>
                      <dt>Proveedor / Agencia</dt>
                      <dd>{profile.agency ?? profile.contact}</dd>
                    </div>
                  </dl>
                </section>

                <section className="talent-profile-section talent-contact-card">
                  <Section title="Contacto" aside="INFORMACIÓN INTERNA" />
                  <dl className="talent-detail-list">
                    <div>
                      <dt>Teléfono / WhatsApp</dt>
                      <dd>{profile.phone}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{profile.email}</dd>
                    </div>
                    <div className="wide">
                      <dt>Ubicación</dt>
                      <dd>{profile.location}</dd>
                    </div>
                  </dl>
                  <div className="talent-inline-actions">
                    <button
                      onClick={() => onContact("Mensaje de WhatsApp preparado")}
                    >
                      <MessageCircle /> WhatsApp
                    </button>
                    <button onClick={() => onContact("Contacto preparado")}>
                      <Mail /> Contactar
                    </button>
                  </div>
                </section>

                <section className="talent-profile-section">
                  <Section title="Tarifas" aside="USO INTERNO" />
                  <div className="talent-rates">
                    <Metric label="Costo proveedor" value={usd(profile.cost)} />
                    <Metric
                      label="Venta sugerida"
                      value={usd(profile.salePrice)}
                    />
                    <Metric
                      label="Margen YRM"
                      value={usd(profile.salePrice - profile.cost)}
                    />
                    <Metric
                      label="Margen %"
                      value={`${(((profile.salePrice - profile.cost) / profile.salePrice) * 100).toFixed(1)}%`}
                    />
                  </div>
                </section>

                <section className="talent-profile-section">
                  <Section title="Disponibilidad" />
                  <div className="talent-availability-list">
                    {profile.availabilitySchedule.map((item) => (
                      <div key={item.date}>
                        <b>{item.date}</b>
                        <StatusBadge>{item.status}</StatusBadge>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="talent-profile-section">
                  <Section
                    title="Notas internas"
                    aside="NO VISIBLE PARA CLIENTES"
                  />
                  <p className="talent-notes">
                    {profile.notes} Inglés fluido. Preferencia por servicios con
                    confirmación mínima de 24 h.
                  </p>
                </section>

                <section className="talent-profile-section">
                  <Section title="Últimas operaciones" />
                  <div className="talent-history">
                    {profile.history.map((item) => (
                      <div key={item.id}>
                        <b>{item.id}</b>
                        <span>
                          {item.service} · {item.date}
                        </span>
                        <StatusBadge>{item.status}</StatusBadge>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
            <footer className="talent-drawer-actions">
              <button className="btn" onClick={() => onSelect(profile)}>
                Seleccionar para cotización
              </button>
              <button
                className="btn secondary"
                disabled={profile.availability === "Solicitud enviada"}
                onClick={() => onRequest(profile.id)}
              >
                {profile.availability === "Solicitud enviada"
                  ? "Solicitud enviada"
                  : "Solicitar disponibilidad"}
              </button>
            </footer>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function Talent() {
  const { activeId } = useDestination();
  const [cat, setCat] = useState("Hostess"),
    [availability, setAvailability] = useState("Todos"),
    [data, setData] = useState(seedTalent),
    [openProfileId, setOpenProfileId] = useState<string | null>(null),
    [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const feedback = useFeedback();
  const talentRows = data.map((profile, index) => {
    const baseDestination = destinationForIndex(index);
    const availableDestinations =
      index % 4 === 0
        ? [baseDestination, operationalDestinationIds[(index + 1) % 3]]
        : [baseDestination];
    return { ...profile, baseDestination, availableDestinations };
  });
  const openProfile =
    data.find((profile) => profile.id === openProfileId) ?? null;
  const request = (id: string) => {
    setData((a) =>
      a.map((t) =>
        t.id === id ? { ...t, availability: "Solicitud enviada" } : t,
      ),
    );
    feedback.notify("Solicitud enviada");
  };
  return (
    <Page>
      <Header eyebrow="CATÁLOGO INTERNO" title="Staff & Talent" />
      <div className="talent-filters">
        <label>
          Fecha
          <input value="18 sep" readOnly />
        </label>
        <label>
          Disponibilidad
          <select
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
          >
            <option>Todos</option>
            <option>Disponible</option>
            <option>Por confirmar</option>
            <option>No disponible</option>
            <option>Asignada</option>
          </select>
        </label>
        <label>
          Zona
          <select defaultValue="Cancún">
            <option>Cancún</option>
            <option>Tulum</option>
            <option>Riviera Maya</option>
          </select>
        </label>
        <Filters
          items={["Todos", "Hostess", "DJ", "Chef", "Fotógrafo", "Seguridad"]}
          active={cat}
          onChange={setCat}
        />
      </div>
      <Toast message={feedback.message} />
      <TalentDrawer
        profile={openProfile}
        onClose={() => setOpenProfileId(null)}
        onRequest={request}
        onContact={feedback.notify}
        onSelect={(profile) => {
          setSelectedProfileId(profile.id);
          feedback.notify("Perfil seleccionado");
        }}
      />
      {cat === "Hostess" && availability === "Todos" && (
        <p className="talent-result-summary">
          <b>10 perfiles encontrados</b> · 6 disponibles · 2 por confirmar · 2
          no disponibles
        </p>
      )}
      <div className="talent-grid">
        {talentRows
          .filter((t) => cat === "Todos" || t.category === cat)
          .filter(
            (t) => availability === "Todos" || t.availability === availability,
          )
          .filter(
            (t) =>
              activeId === "global" ||
              t.availableDestinations.includes(activeId),
          )
          .map((t) => (
            <article className="talent-card" key={t.id}>
              <Image
                src={t.image}
                alt={t.name}
                width={520}
                height={460}
                sizes="(max-width: 760px) 100vw, 25vw"
              />
              <div>
                <StatusBadge>{t.availability}</StatusBadge>
                <small>
                  {t.category} · {t.zone}
                </small>
                <h2>{t.name}</h2>
                <p>{t.languages.join(" · ")}</p>
                <p className="talent-destinations">
                  Base: {destinationName(t.baseDestination)} · Disponible en{" "}
                  {t.availableDestinations.map(destinationName).join(" / ")}
                </p>
                <div className="rate-strip">
                  <Metric label="Costo" value={usd(t.cost)} />
                  <Metric label="Venta sugerida" value={usd(t.salePrice)} />
                </div>
                <p>{t.notes}</p>
                <div className="talent-actions">
                  <button onClick={() => setOpenProfileId(t.id)}>
                    Ver perfil
                  </button>
                  <button
                    aria-pressed={selectedProfileId === t.id}
                    onClick={() => {
                      setSelectedProfileId(t.id);
                      feedback.notify("Perfil seleccionado");
                    }}
                  >
                    {selectedProfileId === t.id
                      ? "Seleccionado"
                      : "Seleccionar"}
                  </button>
                  <button
                    className="btn secondary"
                    disabled={t.availability === "Solicitud enviada"}
                    onClick={() => request(t.id)}
                  >
                    {t.availability === "Solicitud enviada"
                      ? "Solicitud enviada"
                      : "Solicitar disponibilidad"}
                  </button>
                </div>
              </div>
            </article>
          ))}
      </div>
      {!talentRows.filter(
        (t) =>
          (cat === "Todos" || t.category === cat) &&
          (availability === "Todos" || t.availability === availability) &&
          (activeId === "global" || t.availableDestinations.includes(activeId)),
      ).length && (
        <div className="empty-state">
          <Search />
          <h2>No encontramos opciones con estos filtros.</h2>
          <button
            className="btn secondary"
            onClick={() => {
              setCat("Todos");
              setAvailability("Todos");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </Page>
  );
}
function Quotes() {
  const { activeId } = useDestination();
  const [quoteDestination, setQuoteDestination] = useState(
    activeId === "global" ? "riviera-maya" : activeId,
  );
  const [items, setItems] = useState<QuoteItem[]>(initialQuoteItems),
    [preview, setPreview] = useState(false);
  const feedback = useFeedback();
  const summary = useMemo(() => calculateMargin(items), [items]);
  const update = (id: string, value: number) =>
    setItems((a) =>
      a.map((i) => (i.id === id ? { ...i, salePrice: value } : i)),
    );
  const changeQuantity = (id: string, delta: number) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  const removeItem = (id: string) =>
    setItems((current) => current.filter((item) => item.id !== id));
  const addService = () => {
    const option = catalog.find(
      (item) =>
        !items.some((selected) => selected.service.startsWith(item.name)),
    );
    if (!option) return;
    const rate = option.rates[0];
    setItems((current) => [
      ...current,
      {
        id: `service-${Date.now()}`,
        service: option.name,
        supplier:
          suppliers.find((s) => s.id === option.supplierId)?.name ??
          "Proveedor asociado",
        quantity: 1,
        cost: rate.supplierCost,
        salePrice: rate.salePrice,
      },
    ]);
    feedback.notify("Servicio agregado");
  };
  return (
    <Page>
      <Header eyebrow="COTIZACIÓN · #YRM-Q4028" title="Crear experiencia" />
      <div className="quote-workspace">
        <section>
          <div className="quote-client">
            <div>
              <small>CLIENTE</small>
              <select
                className="inline-select"
                defaultValue="Roberto Hernández"
              >
                {clients.map((client) => (
                  <option key={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <small>DESTINO</small>
              <select
                className="inline-select"
                value={quoteDestination}
                onChange={(event) =>
                  setQuoteDestination(
                    event.target.value as typeof quoteDestination,
                  )
                }
              >
                {operationalDestinationIds.map((id) => (
                  <option value={id} key={id}>
                    {destinationName(id)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <small>FECHA</small>
              <strong>18 de septiembre</strong>
            </div>
            <div>
              <small>PERSONAS</small>
              <strong>8</strong>
            </div>
            <button className="btn secondary" onClick={addService}>
              <Plus />
              Agregar servicio
            </button>
          </div>
          <Section
            title="Servicios seleccionados"
            aside="LOS COSTOS SON INTERNOS"
          />
          <div className="quote-lines">
            <div className="quote-line head">
              <span>SERVICIO / PROVEEDOR</span>
              <span>CANT.</span>
              <span>COSTO</span>
              <span>VENTA</span>
              <span>MARGEN</span>
            </div>
            {items.map((i) => (
              <div className="quote-line" key={i.id}>
                <div>
                  <strong>{i.service}</strong>
                  <small>{i.supplier}</small>
                  <button
                    className="remove-line"
                    onClick={() => removeItem(i.id)}
                  >
                    Quitar
                  </button>
                </div>
                <span className="quantity-control">
                  <button onClick={() => changeQuantity(i.id, -1)}>−</button>
                  {i.quantity}
                  <button onClick={() => changeQuantity(i.id, 1)}>+</button>
                </span>
                <span>{usd(i.cost * i.quantity)}</span>
                <label>
                  <span className="currency-prefix">USD</span>
                  <input
                    aria-label={`Precio de venta de ${i.service}`}
                    type="number"
                    value={i.salePrice}
                    onChange={(e) => update(i.id, Number(e.target.value))}
                  />
                </label>
                <b>{usd((i.salePrice - i.cost) * i.quantity)}</b>
              </div>
            ))}
          </div>
          <div className="cross-sell">
            <Section title="También podría necesitar" />
            <div>
              {["Villa privada", "Seguridad", "Fotógrafo", "Beach club"].map(
                (x) => (
                  <button key={x} onClick={addService}>
                    <Plus />
                    {x}
                  </button>
                ),
              )}
            </div>
          </div>
        </section>
        <aside className="quote-financial">
          <span>RESUMEN INTERNO</span>
          <h2>Rentabilidad</h2>
          <Metric label="Costo proveedores" value={usd(summary.supplierCost)} />
          <Metric label="Precio cliente" value={usd(summary.totalSale)} />
          <Metric label="Margen YRM" value={usd(summary.margin)} accent />
          <div className="margin-ring">
            <b>{summary.marginPercent.toFixed(1)}%</b>
            <span>MARGEN</span>
          </div>
          <p>
            El precio de venta puede editarse por servicio. El margen se
            recalcula automáticamente.
          </p>
          <button className="btn wide" onClick={() => setPreview(true)}>
            Generar propuesta <Send />
          </button>
        </aside>
      </div>
      <Modal open={preview} onClose={() => setPreview(false)}>
        <div className="proposal">
          <div className="proposal-cover">
            <Image
              src={catalog[0].image}
              alt="Azimut 55"
              fill
              priority
              sizes="(max-width: 800px) 96vw, 1080px"
            />
            <div className="shade" />
            <div className="proposal-brand">
              <small>YACHT RIVIERA MAYA</small>
              <span>
                PROPUESTA #YRM-4021
                <br />
                12 DE SEPTIEMBRE 2026
              </span>
            </div>
            <div className="proposal-heading">
              <span>EXPERIENCIA PRIVADA PARA ROBERTO</span>
              <h1>AZIMUT 55</h1>
              <p>
                Charter privado · 6 horas
                <br />
                Cancún → Isla Mujeres
              </p>
            </div>
          </div>
          <div className="proposal-body">
            <div className="proposal-facts">
              <div>
                <CalendarDays />
                <span>
                  FECHA<strong>18 de septiembre</strong>
                </span>
              </div>
              <div>
                <Users />
                <span>
                  PERSONAS<strong>8 personas</strong>
                </span>
              </div>
              <div>
                <MapPin />
                <span>
                  RUTA<strong>Cancún → Isla Mujeres</strong>
                </span>
              </div>
              <div>
                <Clock />
                <span>
                  HORARIO<strong>10:00 → 16:00</strong>
                </span>
              </div>
            </div>
            <section className="proposal-services">
              <h2>Servicios incluidos</h2>
              <div>
                {items.map((item, index) => (
                  <article key={item.id}>
                    <Image
                      src={catalog[index]?.image ?? catalog[0].image}
                      alt=""
                      width={140}
                      height={116}
                    />
                    <div>
                      <strong>{item.service.replace(" · incluido", "")}</strong>
                      <span>
                        {
                          [
                            "Charter privado · 6 horas",
                            "Sprinter privado",
                            "Menú personalizado",
                            "Ambientación premium",
                            "4 hostess para experiencia",
                          ][index]
                        }
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <div className="proposal-lower">
              <section className="experience-details">
                <h2>Detalles de la experiencia</h2>
                <div>
                  {[
                    "Salida desde Puerto Cancún",
                    "Ruta Cancún → Isla Mujeres",
                    "8 personas",
                    "Duración 6 horas",
                    "Chef privado a bordo",
                    "DJ y ambientación",
                    "Staff & Talent incluido",
                    "Transporte VIP",
                  ].map((detail) => (
                    <span key={detail}>
                      <Check />
                      {detail}
                    </span>
                  ))}
                </div>
              </section>
              <aside className="client-total">
                <span>TOTAL DE LA EXPERIENCIA</span>
                <b>USD {summary.totalSale.toLocaleString("en-US")}</b>
                <div>
                  <span>
                    Anticipo 50%
                    <strong>
                      USD {(summary.totalSale / 2).toLocaleString("en-US")}
                    </strong>
                  </span>
                  <span>
                    Saldo
                    <strong>
                      USD {(summary.totalSale / 2).toLocaleString("en-US")}
                    </strong>
                  </span>
                </div>
                <small>
                  Política de cancelación · <u>Ver términos</u>
                </small>
                <button className="btn wide">RESERVAR EXPERIENCIA</button>
                <div className="proposal-actions">
                  <button
                    onClick={() => feedback.notify("Propuesta preparada")}
                  >
                    <Download />
                    Descargar propuesta
                  </button>
                  <button
                    onClick={() => feedback.notify("Email listo para enviar")}
                  >
                    <Mail />
                    Enviar por email
                  </button>
                  <button
                    onClick={() =>
                      feedback.notify("Mensaje de WhatsApp preparado")
                    }
                  >
                    <MessageCircle />
                    Enviar por WhatsApp
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </Modal>
      <Toast message={feedback.message} />
    </Page>
  );
}
function Bookings() {
  const { activeId } = useDestination();
  const [filter, setFilter] = useState("Todas");
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, string>
  >({});
  const feedback = useFeedback();
  const rows = [
    {
      id: "YRM-3094",
      client: "Roberto Hernández",
      services: "Azimut 55 + 4 servicios",
      date: "18 sep",
      sale: 8200,
      collected: 6560,
      cost: 5430,
      status: "En operación",
    },
    {
      id: "YRM-3098",
      client: "Sofía Laurent",
      services: "Villa Ocean + Chef",
      date: "21–25 sep",
      sale: 12400,
      collected: 6200,
      cost: 7800,
      status: "En preparación",
    },
    {
      id: "YRM-3101",
      client: "Daniel Ross",
      services: "Sunset charter + Fotógrafo",
      date: "24 sep",
      sale: 3800,
      collected: 1900,
      cost: 2450,
      status: "Confirmada",
    },
    {
      id: "YRM-3104",
      client: "Grupo Alba",
      services: "Sprinter VIP + Seguridad",
      date: "2 oct",
      sale: 2900,
      collected: 0,
      cost: 1700,
      status: "Confirmada",
    },
  ];
  rows.push(
    ...demoOperations.slice(4).map((operation, index) => ({
      ...operation,
      collected: Math.round(operation.sale * (index % 3 === 0 ? 1 : 0.5)),
    })),
  );
  const destinationRows = rows
    .map((row, index) => ({
      ...row,
      destinationId: destinationForIndex(index),
    }))
    .filter((row) => activeId === "global" || row.destinationId === activeId);
  return (
    <Page>
      <Header
        eyebrow="EXPERIENCIAS CONFIRMADAS"
        title="Reservas"
        action={
          <Link href="/quotes" className="btn">
            <Plus />
            Nueva cotización
          </Link>
        }
      />
      <Filters
        items={[
          "Todas",
          "Confirmada",
          "En preparación",
          "En operación",
          "Finalizada",
          "Cancelada",
        ]}
        active={filter}
        onChange={setFilter}
      />
      <div className="broker-bookings">
        <div className="booking-business head">
          <span>RESERVA / CLIENTE</span>
          <span>SERVICIOS</span>
          <span>FECHA</span>
          <span>VENTA / COBRADO</span>
          <span>COSTO / MARGEN</span>
          <span>OPERACIÓN</span>
        </div>
        {destinationRows
          .filter(
            (r) =>
              filter === "Todas" ||
              (statusOverrides[r.id] ?? r.status) === filter,
          )
          .map((r) => (
            <Link
              href={`/bookings/${r.id}`}
              className="booking-business"
              key={r.id}
            >
              <div>
                <small>#{r.id}</small>
                <strong>{r.client}</strong>
                <span className="destination-badge">
                  {destinationName(r.destinationId)}
                </span>
              </div>
              <strong>{r.services}</strong>
              <span>{r.date}</span>
              <div>
                <b>{usd(r.sale)}</b>
                <small>Cobrado {usd(r.collected)}</small>
              </div>
              <div>
                <span>{usd(r.cost)}</span>
                <small className="positive">
                  Margen {usd(r.sale - r.cost)}
                </small>
              </div>
              <button
                className="status-button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const next =
                    (statusOverrides[r.id] ?? r.status) === "Confirmada"
                      ? "En preparación"
                      : "En operación";
                  setStatusOverrides((current) => ({
                    ...current,
                    [r.id]: next,
                  }));
                  feedback.notify("Estado de reserva actualizado");
                }}
              >
                <StatusBadge>{statusOverrides[r.id] ?? r.status}</StatusBadge>
              </button>
            </Link>
          ))}
      </div>
      {!destinationRows.some(
        (r) =>
          filter === "Todas" || (statusOverrides[r.id] ?? r.status) === filter,
      ) && (
        <div className="empty-state">
          <Search />
          <h2>No encontramos opciones con estos filtros.</h2>
          <button className="btn secondary" onClick={() => setFilter("Todas")}>
            Limpiar filtros
          </button>
        </div>
      )}
      <Toast message={feedback.message} />
    </Page>
  );
}
function OperationDetail() {
  const lines = initialQuoteItems;
  const m = calculateMargin(lines);
  const [confirmed, setConfirmed] = useState([0, 1, 2, 4]);
  return (
    <Page>
      <Header
        eyebrow="OPERACIÓN · #YRM-3094"
        title="Roberto Hernández"
        action={<StatusBadge>En operación</StatusBadge>}
      />
      <div className="operation-detail">
        <section>
          <div className="experience-header">
            <div>
              <small>18 DE SEPTIEMBRE · 14:00–20:00</small>
              <h2>Experiencia Azimut 55</h2>
              <p>8 personas · Hotel SLS Cancún · Cancún → Isla Mujeres</p>
            </div>
            <Metric label="Cliente" value="80% pagado" />
            <Metric label="Ejecutivo" value="Alejandro Ruiz" />
          </div>
          <section className="panel">
            <Section
              title="Servicios y confirmaciones"
              aside={`${confirmed.length}/${lines.length} CONFIRMADOS`}
            />
            {lines.map((i, n) => (
              <button
                className="confirmation-line"
                key={i.id}
                onClick={() =>
                  setConfirmed((a) =>
                    a.includes(n) ? a.filter((x) => x !== n) : [...a, n],
                  )
                }
              >
                <i className={confirmed.includes(n) ? "done" : ""}>
                  {confirmed.includes(n) && <Check />}
                </i>
                <div>
                  <strong>{i.service}</strong>
                  <small>{i.supplier}</small>
                </div>
                <StatusBadge>
                  {confirmed.includes(n) ? "Confirmado" : "Por confirmar"}
                </StatusBadge>
              </button>
            ))}
          </section>
          <section className="panel">
            <Section title="Itinerario" />
            <div className="timeline">
              <time>13:30</time>
              <i />
              <span>Transporte recoge al cliente en SLS Cancún</span>
            </div>
            <div className="timeline">
              <time>14:00</time>
              <i />
              <span>Recepción y salida desde Puerto Cancún</span>
            </div>
            <div className="timeline">
              <time>16:00</time>
              <i />
              <span>Playa Norte · servicio de chef y DJ</span>
            </div>
            <div className="timeline">
              <time>20:00</time>
              <i />
              <span>Regreso a marina</span>
            </div>
          </section>
          <section className="panel">
            <Section title="Notas de operación" />
            <p className="panel-note">
              Cliente prefiere embarque ágil. Confirmar Don Julio 1942, hielo
              extra y llegada del transporte 30 minutos antes.
            </p>
          </section>
        </section>
        <aside className="panel operation-money">
          <Section title="Control financiero" />
          <Metric label="Venta total" value={usd(m.totalSale)} />
          <Metric label="Cobrado" value={usd(m.totalSale * 0.8)} />
          <Metric label="Saldo cliente" value={usd(m.totalSale * 0.2)} />
          <Metric label="Pagos a proveedores" value={usd(4100)} />
          <Metric
            label="Pendiente a proveedores"
            value={usd(m.supplierCost - 4100)}
          />
          <div className="total">
            <span>MARGEN YRM</span>
            <b>{usd(m.margin)}</b>
          </div>
          <p>Margen {m.marginPercent.toFixed(1)}%</p>
        </aside>
      </div>
    </Page>
  );
}
function Clients() {
  return (
    <Page>
      <Header
        eyebrow="CRM & OPORTUNIDADES"
        title="Clientes"
        action={
          <button className="btn">
            <Plus />
            Nuevo cliente
          </button>
        }
      />
      <div className="client-grid broker-clients">
        {clients.map((c, index) => (
          <Link href={`/clients/${c.id}`} className="client-card" key={c.id}>
            <div className="avatar">
              {c.name
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)}
            </div>
            <StatusBadge>{c.type}</StatusBadge>
            <h2>{c.name}</h2>
            <p>{c.location} · Origen: Instagram</p>
            <div className="destination-tags">
              <span className="destination-badge">
                Último · {destinationName(destinationForIndex(index))}
              </span>
              <span className="destination-badge">CRM Global</span>
            </div>
            <Metric
              label="Total comprado"
              value={usd(Math.round(c.ltv / 10))}
            />
            <Metric
              label="Margen generado"
              value={usd(Math.round(c.ltv / 32))}
            />
            <div>
              <span>{c.bookings} reservas</span>
              <span>Próxima oportunidad · Yate</span>
            </div>
            <ChevronRight />
          </Link>
        ))}
      </div>
    </Page>
  );
}
function ClientDetail() {
  return (
    <Page>
      <Header
        eyebrow="CLIENTE VIP · CRM COMERCIAL"
        title="Roberto Hernández"
        action={
          <div className="action-row">
            <button className="btn secondary">Contactar</button>
            <button className="btn secondary">Nueva reserva</button>
            <Link className="btn" href="/quotes">
              Crear cotización
            </Link>
          </div>
        }
      />
      <section className="detail-metrics">
        <Metric label="Total comprado" value="USD 42,800" />
        <Metric label="Margen generado" value="USD 13,400" accent />
        <Metric label="Reservas" value="9" />
        <Metric label="Último contacto" value="Hace 3 días" />
        <Metric label="Tasa de cierre" value="64%" />
      </section>
      <div className="two-col">
        <section className="panel">
          <Section title="Perfil comercial" />
          <Metric label="Origen" value="Instagram" />
          <Metric label="WhatsApp" value="+52 55 4108 2930" />
          <Metric label="Email" value="roberto.h@email.com" />
          <Metric
            label="Hotel habitual / zona"
            value="SLS Cancún · Puerto Cancún"
          />
          <Metric label="Cotizaciones" value="14 enviadas · 9 confirmadas" />
          <Metric
            label="Servicios favoritos"
            value="Yates · Transporte · Villas"
          />
          <Metric label="Grupo habitual" value="8–12 personas" />
          <Metric label="Próxima oportunidad" value="Villa privada · octubre" />
          <Section title="Notas internas" />
          <p className="panel-note">
            Reserva con poca anticipación. Prefiere salidas por la tarde y
            transporte SUV.
          </p>
        </section>
        <section className="panel">
          <Section title="Venta cruzada sugerida" />
          <div className="recommendations">
            {[
              "Transporte VIP",
              "Chef privado",
              "DJ",
              "Villa",
              "Staff & Talent",
              "Seguridad",
            ].map((x) => (
              <div key={x}>
                <span>{x}</span>
                <Plus />
              </div>
            ))}
          </div>
        </section>
      </div>
      <Section title="Historial" />
      <section className="panel client-journey">
        <Section title="Yacht RM Journey" aside="HISTORIAL GLOBAL" />
        <div>
          <article>
            <b>SEP 2026</b>
            <span>Riviera Maya</span>
            <strong>Azimut 55 + Chef</strong>
            <em>USD 8,200</em>
          </article>
          <article>
            <b>DEC 2026</b>
            <span>Miami</span>
            <strong>Villa + Transport</strong>
            <em>USD 14,400</em>
          </article>
          <article>
            <b>FEB 2027</b>
            <span>Los Cabos</span>
            <strong>Yacht Experience</strong>
            <em>USD 7,900</em>
          </article>
        </div>
      </section>
      <div className="rate-table">
        <div>
          <b>FECHA</b>
          <b>EXPERIENCIA</b>
          <b>VENTA</b>
          <b>MARGEN</b>
          <b>ESTADO</b>
        </div>
        {bookings.slice(0, 3).map((b, i) => (
          <div key={b.id}>
            <span>{b.date}</span>
            <strong>{b.asset}</strong>
            <span>{usd(b.value / 10)}</span>
            <b>{usd(b.value / 32)}</b>
            <StatusBadge>{i ? "Finalizada" : "Confirmada"}</StatusBadge>
          </div>
        ))}
      </div>
    </Page>
  );
}
function Finance() {
  const { activeId, activeBranch } = useDestination();
  const financeValue =
    activeId === "global"
      ? {
          sales: 428000,
          margin: 137000,
          cost: 291000,
          collect: 55600,
          pay: 41400,
        }
      : {
          sales: branchPerformance[activeId].sales,
          margin: branchPerformance[activeId].margin,
          cost:
            branchPerformance[activeId].sales -
            branchPerformance[activeId].margin,
          collect: branchPerformance[activeId].collections,
          pay: Math.round(branchPerformance[activeId].collections * 0.72),
        };
  const cats = [
    ["Yates", 108000, 71200],
    ["Villas", 34200, 23800],
    ["Transportación", 18400, 11200],
    ["Experiencias", 12800, 7900],
    ["Staff & Talent", 7800, 5200],
    ["Otros", 3300, 2000],
  ];
  return (
    <Page>
      <Header
        eyebrow="SEPTIEMBRE 2026"
        title={
          activeId === "global"
            ? "Finanzas Globales"
            : `Finanzas · ${activeBranch.name}`
        }
        action={<button className="btn secondary">Exportar reporte</button>}
      />
      <section className="finance-hero broker-finance">
        <div>
          <span>MARGEN YRM</span>
          <b>{usd(financeValue.margin)}</b>
          <em>
            USD ·{" "}
            {((financeValue.margin / financeValue.sales) * 100).toFixed(1)}%
            sobre ventas
          </em>
        </div>
        <div>
          <Metric label="Ventas" value={usd(financeValue.sales)} />
          <Metric label="Costo proveedores" value={usd(financeValue.cost)} />
          <Metric
            label="Pendiente de cobrar"
            value={usd(financeValue.collect)}
          />
          <Metric label="Pendiente de pagar" value={usd(financeValue.pay)} />
          <Metric label="Comisiones ejecutivos" value="USD 6,320" />
        </div>
      </section>
      {activeId === "global" && (
        <>
          <Section title="Margin by destination" aside="CONSOLIDADO USD" />
          <div className="finance-destinations">
            {operationalDestinationIds.map((id) => (
              <article key={id}>
                <span>{destinationName(id)}</span>
                <b>{usd(branchPerformance[id].margin)}</b>
                <small>Ventas {usd(branchPerformance[id].sales)}</small>
              </article>
            ))}
          </div>
        </>
      )}
      <div className="two-col">
        <section className="panel">
          <Section title="Ventas vs costo proveedores" aside="ENE — SEP" />
          <Bars
            values={[
              42, 29, 48, 33, 52, 35, 58, 40, 63, 42, 70, 47, 76, 51, 81, 55,
              92, 61,
            ]}
          />
          <div className="legend">
            <i />
            Ventas <i />
            Costo proveedores
          </div>
        </section>
        <section className="panel">
          <Section title="Margen generado por mes" />
          <Bars values={[28, 31, 29, 34, 32, 35, 36, 33, 39]} />
          <Metric label="Promedio mensual" value="USD 48,900" />
        </section>
      </div>
      <Section title="Resultados por categoría" aside="USD" />
      <div className="category-finance">
        <div>
          <b>CATEGORÍA</b>
          <b>VENTAS</b>
          <b>COSTO</b>
          <b>MARGEN</b>
          <b>MARGEN %</b>
        </div>
        {cats.map(([n, s, c]) => (
          <div key={String(n)}>
            <strong>{n}</strong>
            <span>{usd(Number(s))}</span>
            <span>{usd(Number(c))}</span>
            <b>{usd(Number(s) - Number(c))}</b>
            <em>{(((Number(s) - Number(c)) / Number(s)) * 100).toFixed(1)}%</em>
          </div>
        ))}
      </div>
      <div className="two-col">
        <section>
          <Section title="Top servicios por margen" />
          {[
            ["Azimut 55", 12600],
            ["Villa Ocean", 10400],
            ["Sprinter VIP", 7200],
            ["Chef privado", 5800],
          ].map(([n, v], i) => (
            <div className="rank" key={String(n)}>
              <span>0{i + 1}</span>
              <strong>{n}</strong>
              <b>{usd(Number(v))}</b>
            </div>
          ))}
        </section>
        <section>
          <Section title="Proveedores por volumen" />
          {suppliers.map((s, i) => (
            <div className="rank" key={s.id}>
              <span>0{i + 1}</span>
              <strong>{s.name}</strong>
              <b>{usd(s.purchased)}</b>
            </div>
          ))}
        </section>
      </div>
      <Section
        title="Resultados por ejecutivo"
        aside="VENTAS · COSTO · MARGEN"
      />
      <div className="rate-table">
        <div>
          <b>EJECUTIVO</b>
          <b>VENTAS</b>
          <b>COSTO</b>
          <b>MARGEN</b>
          <b>CONVERSIÓN</b>
        </div>
        {[
          ["Alejandro Ruiz", 38400, 25800, 12600, 38],
          ["Santiago Mena", 26800, 17900, 8900, 32],
          ["Andrea Solís", 19400, 13400, 6000, 29],
        ].map(([name, sale, cost, margin, conversion]) => (
          <div key={String(name)}>
            <strong>{name}</strong>
            <span>{usd(Number(sale))}</span>
            <span>{usd(Number(cost))}</span>
            <b>{usd(Number(margin))}</b>
            <em>{conversion}%</em>
          </div>
        ))}
      </div>
    </Page>
  );
}
function Team() {
  const { activeId } = useDestination();
  const performance = [
    {
      name: "Alejandro Ruiz",
      role: "Ventas",
      leads: 24,
      quotes: 18,
      bookings: 9,
      sales: 38400,
      margin: 12600,
      commission: 1890,
      conversion: 38,
    },
    {
      name: "Santiago Mena",
      role: "Ventas",
      leads: 19,
      quotes: 14,
      bookings: 6,
      sales: 26800,
      margin: 8900,
      commission: 1335,
      conversion: 32,
    },
  ];
  return (
    <Page>
      <Header
        eyebrow="EQUIPO & RENDIMIENTO"
        title="Equipo"
        action={
          <button className="btn">
            <Plus />
            Agregar persona
          </button>
        }
      />
      <div className="team-performance">
        {performance
          .map((p, index) => ({
            ...p,
            destinations:
              index < 2
                ? operationalDestinationIds
                : [destinationForIndex(index)],
          }))
          .filter(
            (p) => activeId === "global" || p.destinations.includes(activeId),
          )
          .map((p) => (
            <article className="performance-card" key={p.name}>
              <div className="avatar">
                {p.name
                  .split(" ")
                  .map((x) => x[0])
                  .slice(0, 2)}
              </div>
              <StatusBadge>Activo</StatusBadge>
              <h2>{p.name}</h2>
              <p>{p.role}</p>
              <div className="destination-tags">
                {p.destinations.map((id) => (
                  <span className="destination-badge" key={id}>
                    {destinationName(id)}
                    {p.destinations.length === 3 ? " · Global" : ""}
                  </span>
                ))}
              </div>
              <div className="performance-grid">
                <Metric label="Leads atendidos" value={String(p.leads)} />
                <Metric label="Cotizaciones" value={String(p.quotes)} />
                <Metric label="Reservas" value={String(p.bookings)} />
                <Metric label="Tasa de cierre" value={`${p.conversion}%`} />
                <Metric label="Ventas" value={usd(p.sales)} />
                <Metric label="Margen generado" value={usd(p.margin)} accent />
              </div>
              <Metric label="Comisión" value={usd(p.commission)} />
            </article>
          ))}
      </div>
      <Section title="Operaciones & Concierge" />
      <div className="team-grid">
        {team
          .slice(2)
          .map((t, index) => ({
            ...t,
            destinations:
              index === 0
                ? (["riviera-maya"] as const)
                : index === 1
                  ? (["los-cabos"] as const)
                  : index === 2
                    ? (["miami"] as const)
                    : operationalDestinationIds,
          }))
          .filter(
            (t) =>
              activeId === "global" ||
              (t.destinations as readonly OperationalDestinationId[]).includes(
                activeId,
              ),
          )
          .map((t) => (
            <article className="team-card" key={t.name}>
              <div className="avatar">
                {t.name
                  .split(" ")
                  .map((x) => x[0])
                  .slice(0, 2)}
              </div>
              <StatusBadge>{t.status}</StatusBadge>
              <h2>{t.name}</h2>
              <p>{t.role}</p>
              <div className="destination-tags">
                {t.destinations.map((id) => (
                  <span className="destination-badge" key={id}>
                    {destinationName(id)}
                  </span>
                ))}
              </div>
              <span className="muted">
                Disponible para coordinación y seguimiento
              </span>
            </article>
          ))}
      </div>
    </Page>
  );
}
