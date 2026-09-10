/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Ship,
  BookOpen,
  Users,
  Boxes,
  ChartNoAxesCombined,
  Settings,
  Menu,
  X,
  Search,
  Plus,
  ChevronRight,
  Bell,
  MapPin,
  Check,
  Car,
  House,
  Utensils,
  ArrowUpRight,
  UserRoundSearch,
  Handshake,
  Sparkles,
  LogOut,
} from "lucide-react";
import { BusinessPage } from "./business-pages";
import { Page, Header, StatusBadge, Filters, Modal, Bars, money } from "./ui";
import { fleet } from "@/mock/fleet";
import { clients } from "@/mock/clients";
import { bookings } from "@/mock/bookings";
import { services } from "@/mock/services";
import { team } from "@/mock/team";
const serviceLabel: Record<string, string> = {
  "Private Chef": "Chef privado",
  "Premium Bar": "Barra premium",
  "Private Transportation": "Transporte privado",
  Decoration: "Decoración",
  Photographer: "Fotógrafo",
  Security: "Seguridad",
  Catering: "Catering",
  "Restaurant Booking": "Reserva de restaurante",
  "Beach Club": "Beach club",
  DJ: "DJ",
};
const roleLabel: Record<string, string> = {
  Sales: "Ventas",
  "Operations Manager": "Responsable de operaciones",
  Driver: "Chofer",
  Captain: "Capitán",
  Finance: "Finanzas",
};
const nav = [
  {
    label: "PRINCIPAL",
    items: [
      ["Inicio", "/overview", LayoutDashboard],
      ["Operaciones", "/operations", CalendarDays],
      ["Leads", "/leads", UserRoundSearch],
      ["Cotizaciones", "/quotes", BookOpen],
      ["Reservas", "/bookings", BookOpen],
      ["Clientes", "/clients", Users],
      ["Catálogo", "/assets", Boxes],
      ["Proveedores", "/suppliers", Handshake],
      ["Staff & Talent", "/talent", Sparkles],
      ["Finanzas", "/finance", ChartNoAxesCombined],
    ],
  },
  {
    label: "GESTIÓN",
    items: [
      ["Equipo", "/team", Users],
      ["Configuración", "/settings", Settings],
    ],
  },
] as const;
export function Dashboard({ path }: { path: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("yrm-demo-session") === "true")
      queueMicrotask(() => setSessionReady(true));
    else router.replace("/login");
  }, [router]);
  const logout = () => {
    sessionStorage.removeItem("yrm-demo-session");
    router.push("/login");
  };
  if (!sessionReady)
    return (
      <div className="session-loading">
        <i />
        <span>YACHT RIVIERA MAYA</span>
      </div>
    );
  return (
    <div className="shell">
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div>
            YACHT<strong>RIVIERA MAYA</strong>
          </div>
        </div>
        <button className="close" onClick={() => setOpen(false)}>
          <X />
        </button>
        {nav.map((g) => (
          <nav key={g.label}>
            <small>{g.label}</small>
            {g.items.map(([n, p, I]) => (
              <Link
                key={p}
                href={p}
                onClick={() => setOpen(false)}
                className={
                  pathname === p || pathname.startsWith(p + "/")
                    ? "current"
                    : ""
                }
              >
                <I size={17} />
                {n}
              </Link>
            ))}
          </nav>
        ))}
        <Link href="/quotes" className="new-quote">
          <Plus size={16} /> Crear cotización
        </Link>
        <button className="user" onClick={logout} title="Cerrar sesión">
          <span>AR</span>
          <div>
            Andrea Reyes<small>Operaciones</small>
          </div>
          <LogOut className="logout-icon" />
        </button>
      </aside>
      <section className="workspace">
        <div className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <span>Yacht Riviera Maya · Operaciones &amp; Concierge</span>
          <div>
            <button
              className="quick-search"
              aria-label="Buscar"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} />
            </button>
            <Bell size={18} />
            <i className="live" /> En línea
          </div>
        </div>
        {render(path)}
        <Modal open={searchOpen} onClose={() => setSearchOpen(false)}>
          <div className="search-dialog">
            <span className="eyebrow">ACCESO RÁPIDO</span>
            <h2>Buscar en Yacht RM</h2>
            <label>
              <Search />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cliente, cotización, reserva o proveedor"
              />
            </label>
            {query.trim() && (
              <div className="search-results">
                {[
                  {
                    label: "Roberto Hernández",
                    kind: "Cliente",
                    href: "/clients/roberto-hernandez",
                  },
                  {
                    label: "#YRM-3094",
                    kind: "Operación · Roberto Hernández",
                    href: "/bookings/YRM-3094",
                  },
                  {
                    label: "#YRM-Q4021",
                    kind: "Cotización · seguimiento pendiente",
                    href: "/quotes",
                  },
                  {
                    label: "Riviera Luxury Charters",
                    kind: "Proveedor",
                    href: "/suppliers",
                  },
                  {
                    label: "Azimut 55",
                    kind: "Servicio",
                    href: "/fleet/azimut-55",
                  },
                ]
                  .filter(
                    (item) =>
                      `${item.label} ${item.kind}`
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                      query.toLowerCase().includes("roberto"),
                  )
                  .map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setSearchOpen(false)}
                    >
                      <span>
                        {item.label}
                        <small>{item.kind}</small>
                      </span>
                      <ChevronRight />
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </Modal>
      </section>
    </div>
  );
}
function render(path: string) {
  const businessPage = BusinessPage(path);
  if (businessPage) return businessPage;
  if (path === "/overview") return <Overview />;
  if (path === "/operations") return <Operations />;
  if (path === "/fleet") return <Fleet />;
  if (path.startsWith("/fleet/")) return <YachtDetail />;
  if (path === "/bookings") return <Bookings />;
  if (path.startsWith("/bookings/")) return <BookingDetail />;
  if (path === "/clients") return <Clients />;
  if (path.startsWith("/clients/")) return <ClientDetail />;
  if (path === "/assets") return <Assets />;
  if (path === "/finance") return <Finance />;
  if (path === "/quotes") return <Quotes />;
  if (path === "/team") return <Team />;
  if (path === "/settings") return <SettingsPage />;
  return (
    <Page>
      <Header title="Página no encontrada" />
      <Link href="/overview">Volver al inicio</Link>
    </Page>
  );
}
function Overview() {
  return (
    <Page>
      <Header
        eyebrow="DOMINGO · 6 DE SEPTIEMBRE"
        title="Buenas tardes"
        action={
          <Link className="btn" href="/quotes">
            <Plus size={16} /> Crear cotización
          </Link>
        }
      />
      <p className="lede">Todo lo que está pasando hoy.</p>
      <section className="hero-metrics">
        <div className="primary">
          <small>OPERACIONES HOY</small>
          <b>7</b>
          <span>
            <i className="live" /> 3 en curso ahora
          </span>
        </div>
        <div>
          <small>INGRESOS HOY</small>
          <strong>$184,500</strong>
          <em>MXN</em>
        </div>
        <div>
          <small>ACTIVOS EN OPERACIÓN</small>
          <strong>4</strong>
          <em>de 12</em>
        </div>
        <div className="attention">
          <small>PENDIENTE DE COBRAR</small>
          <strong>$92,300</strong>
          <em>MXN</em>
        </div>
      </section>
      <div className="overview-grid">
        <section>
          <SectionTitle
            title="Operaciones en curso"
            aside="Estado en tiempo real"
          />
          <Operation
            icon={<Ship />}
            time="14:00 — 20:00"
            title="AZIMUT 55"
            status="CHARTER EN CURSO"
            meta="Cancún → Isla Mujeres · 12 personas"
            checks={["Capitán · Asignado", "Crew · Listo", "Pago · Completo"]}
          />
          <Operation
            icon={<House />}
            time="CHECK-IN 16:00"
            title="VILLA OCEAN"
            status="EN PREPARACIÓN"
            meta="Tulum · 8 huéspedes"
            checks={["Limpieza · Lista", "Concierge · Listo"]}
          />
          <Operation
            icon={<Car />}
            time="DELIVERY 18:30"
            title="MERCEDES G63"
            status="PROGRAMADO"
            meta="Aeropuerto de Cancún → Hotel"
            checks={["Chofer · Carlos M."]}
          />
        </section>
        <aside className="next">
          <SectionTitle title="Lo que sigue" />
          <Timeline time="14:00" label="Azimut 55" />
          <Timeline time="16:00" label="Villa Ocean" />
          <Timeline time="18:30" label="Mercedes G63" />
          <Timeline time="19:00" label="Sunset Charter" />
          <div className="month">
            <small>SEPTIEMBRE</small>
            <Metric label="Ingresos" value="$1,842,500" />
            <Metric label="Gastos operativos" value="$684,200" />
            <Metric label="Ganancia estimada" value="$975,900" accent />
          </div>
        </aside>
      </div>
    </Page>
  );
}
function SectionTitle({ title, aside }: { title: string; aside?: string }) {
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
function Timeline({ time, label }: { time: string; label: string }) {
  return (
    <div className="timeline">
      <time>{time}</time>
      <i />
      <span>{label}</span>
    </div>
  );
}
function Operation({
  icon,
  time,
  title,
  status,
  meta,
  checks,
}: {
  icon: React.ReactNode;
  time: string;
  title: string;
  status: string;
  meta: string;
  checks: string[];
}) {
  return (
    <div className="operation">
      <div className="op-icon">{icon}</div>
      <div>
        <time>{time}</time>
        <h3>{title}</h3>
        <span>{status}</span>
        <p>{meta}</p>
      </div>
      <div className="checks">
        {checks.map((x) => (
          <small key={x}>
            <Check /> {x}
          </small>
        ))}
      </div>
      <ChevronRight />
    </div>
  );
}
function Operations() {
  const [filter, setFilter] = useState("All"),
    [view, setView] = useState("Week"),
    [drawer, setDrawer] = useState(false);
  const assets = [
    "Azimut 55",
    "Sea Ray 48",
    "Sunseeker 60",
    "Villa Ocean",
    "Villa Serena",
    "Mercedes G63",
    "Sprinter VIP",
  ];
  return (
    <Page>
      <Header
        eyebrow="CALENDARIO OPERATIVO"
        title="Operaciones"
        action={
          <button className="btn" onClick={() => setDrawer(true)}>
            <Search size={16} /> Ver disponibilidad
          </button>
        }
      />
      <div className="toolbar">
        <Filters
          items={["All", "Marine", "Stays", "Mobility", "Concierge"]}
          active={filter}
          onChange={setFilter}
        />
        <Filters
          items={["Day", "Week", "Month", "Timeline"]}
          active={view}
          onChange={setView}
        />
      </div>
      <div className="calendar">
        <div className="cal-head">
          <span>SERVICIO</span>
          {[
            "LUN 7",
            "MAR 8",
            "MIÉ 9",
            "JUE 10",
            "VIE 11",
            "SÁB 12",
            "DOM 13",
          ].map((d) => (
            <b key={d}>{d}</b>
          ))}
        </div>
        {assets.map((a, i) => (
          <div className="cal-row" key={a}>
            <strong>{a}</strong>
            {[0, 1, 2, 3, 4, 5, 6].map((d) => (
              <div key={d}>
                {(i + d) % 4 === 0 && (
                  <span className={`block b${i % 3}`}>
                    <b>{i % 2 ? "16:00" : "14:00–20:00"}</b>
                    {i % 2 ? "Reservado" : "Roberto H. · Charter"}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Modal open={drawer} onClose={() => setDrawer(false)}>
        <div className="availability">
          <span className="eyebrow">DISPONIBILIDAD</span>
          <h2>Encuentra la mejor opción</h2>
          <div className="field-grid">
            <label>
              Fecha
              <input value="7 de septiembre" readOnly />
            </label>
            <label>
              Personas
              <input value="12" readOnly />
            </label>
            <label>
              Desde
              <input value="14:00" readOnly />
            </label>
            <label>
              Hasta
              <input value="20:00" readOnly />
            </label>
          </div>
          {fleet.slice(0, 3).map((y, i) => (
            <div className="availability-row" key={y.id}>
              <div>
                <strong>{y.name.toUpperCase()}</strong>
                <small>
                  {i === 2
                    ? "Reservado 13:00–21:00"
                    : `Hasta ${y.guests} personas · 6 h`}
                </small>
              </div>
              <StatusBadge>{i === 2 ? "Unavailable" : "Available"}</StatusBadge>
              {i < 2 && <Link href="/quotes">Cotizar</Link>}
            </div>
          ))}
        </div>
      </Modal>
    </Page>
  );
}
function Fleet() {
  const [f, setF] = useState("All");
  return (
    <Page>
      <Header
        eyebrow="SELECCIÓN MARINA"
        title="Nuestros yates"
        action={<button className="btn secondary">Agregar yate</button>}
      />
      <Filters
        items={["All", "Available", "Reserved", "Operating", "Maintenance"]}
        active={f}
        onChange={setF}
      />
      <div className="fleet-grid">
        {fleet
          .filter((y) => f === "All" || y.status === f)
          .map((y, i) => (
            <Link
              href={`/fleet/${y.id}`}
              className={i === 0 ? "yacht featured" : "yacht"}
              key={y.id}
            >
              <img src={y.image} alt={y.name} />
              <div className="shade" />
              <StatusBadge>{y.status}</StatusBadge>
              <div className="yacht-copy">
                <span>{y.location}</span>
                <h2>{y.name}</h2>
                <p>
                  {y.feet} FT · {y.guests} PERSONAS
                </p>
                <div>
                  <Metric label="Ingresos del mes" value={money(y.revenue)} />
                  <Metric label="Reservas" value={String(y.bookings)} />
                </div>
              </div>
              <ArrowUpRight className="arrow" />
            </Link>
          ))}
      </div>
    </Page>
  );
}
function YachtDetail() {
  const [tab, setTab] = useState("Overview");
  return (
    <Page>
      <div className="detail-hero">
        <img src={fleet[0].image} alt="Azimut 55" />
        <div className="shade" />
        <Link href="/fleet">← Flota</Link>
        <div>
          <StatusBadge>Available</StatusBadge>
          <h1>AZIMUT 55</h1>
          <p>
            <MapPin /> Puerto Cancún · 55 FT · 15 PERSONAS
          </p>
        </div>
      </div>
      <Filters
        items={["Overview", "Bookings", "Expenses", "Maintenance", "Documents"]}
        active={tab}
        onChange={setTab}
      />
      {tab === "Overview" ? (
        <>
          <section className="detail-metrics">
            <Metric label="Ingresos" value="$284,500" />
            <Metric label="Gastos operativos" value="$87,400" />
            <Metric label="Ganancia estimada" value="$197,100" accent />
            <Metric label="Ocupación" value="68%" />
            <Metric label="Reservas" value="11" />
            <Metric label="Ticket promedio" value="$25,864" />
          </section>
          <div className="two-col">
            <section className="panel">
              <SectionTitle
                title="Ingresos vs gastos"
                aside="ÚLTIMOS 6 MESES"
              />
              <Bars values={[48, 56, 44, 72, 61, 88, 34, 53, 45, 61, 38, 69]} />
            </section>
            <section className="panel">
              <SectionTitle title="Distribución de gastos" />
              <div className="costs">
                {[
                  ["Combustible", 31800],
                  ["Crew", 16500],
                  ["Limpieza", 6200],
                  ["Marina", 12000],
                  ["Mantenimiento", 8600],
                  ["Amenities", 4200],
                  ["Comisiones", 8100],
                ].map(([n, v]) => (
                  <Metric
                    key={String(n)}
                    label={String(n)}
                    value={money(Number(v))}
                  />
                ))}
              </div>
              <div className="margin">
                <span>MARGEN ESTIMADO</span>
                <b>69.3%</b>
              </div>
            </section>
          </div>
          <section className="maintenance">
            <SectionTitle title="Próximos mantenimientos" />
            <Metric label="Servicio de motor" value="76 horas restantes" />
            <Metric label="Renovación de seguro" value="92 días" />
            <Metric label="Revisión de equipo de seguridad" value="Completa" />
          </section>
        </>
      ) : (
        <GenericTab tab={tab} />
      )}
    </Page>
  );
}
function GenericTab({ tab }: { tab: string }) {
  const tabTitle: Record<string, string> = {
    Bookings: "Reservas",
    Expenses: "Gastos",
    Maintenance: "Mantenimiento",
    Documents: "Documentos",
  };
  return (
    <section className="panel tab-content">
      <SectionTitle title={tabTitle[tab] ?? tab} />
      <p>Todos los registros de Azimut 55 están organizados aquí.</p>
      {[
        "Seguro",
        "Registro",
        "Permisos",
        "Inspección",
        "Historial de mantenimiento",
      ].map((x) => (
        <div className="doc" key={x}>
          <span>{x}</span>
          <StatusBadge>Complete</StatusBadge>
          <ChevronRight />
        </div>
      ))}
    </section>
  );
}
function Bookings() {
  const [f, setF] = useState("All");
  return (
    <Page>
      <Header
        eyebrow="GESTIÓN DE RESERVAS"
        title="Reservas"
        action={
          <Link href="/quotes" className="btn">
            <Plus /> Nueva reserva
          </Link>
        }
      />
      <Filters
        items={[
          "All",
          "Confirmed",
          "Pending",
          "In Progress",
          "Completed",
          "Cancelled",
        ]}
        active={f}
        onChange={setF}
      />
      <div className="booking-list">
        <div className="list-head">
          <span>RESERVA / CLIENTE</span>
          <span>EXPERIENCIA</span>
          <span>FECHA</span>
          <span>TOTAL</span>
          <span>ESTADO / PAGO</span>
        </div>
        {bookings
          .filter((b) => f === "All" || b.status === f)
          .map((b) => (
            <Link href={`/bookings/${b.id}`} className="booking-row" key={b.id}>
              <div className="booking-client">
                <img
                  className="booking-thumb"
                  src={
                    fleet.find((y) => y.name === b.asset)?.image ??
                    "/demo/villa.jpg"
                  }
                  alt=""
                />
                <span>
                  <small>#{b.id}</small>
                  <strong>{b.client}</strong>
                </span>
              </div>
              <div>
                <strong>{b.asset}</strong>
                <small>{b.time}</small>
              </div>
              <div>{b.date}</div>
              <b>{money(b.value)} MXN</b>
              <div>
                <StatusBadge>{b.status}</StatusBadge>
                <small>{b.payment}</small>
              </div>
              <ChevronRight />
            </Link>
          ))}
      </div>
    </Page>
  );
}
function BookingDetail() {
  const [done, setDone] = useState([0, 1, 2, 4, 5]);
  const tasks = [
    "Pago confirmado",
    "Capitán asignado",
    "Crew asignado",
    "Combustible",
    "Hielo",
    "Bebidas",
    "Alimentos",
    "Toallas",
    "Equipo de snorkel",
    "Decoración",
    "Llegada del transporte",
  ];
  return (
    <Page>
      <Header
        eyebrow="RESERVA · #YRM-2941"
        title="Roberto Hernández"
        action={<StatusBadge>Confirmed</StatusBadge>}
      />
      <div className="booking-detail">
        <section>
          <div className="booking-intro">
            <div>
              <span>12 DE SEPTIEMBRE · 2026</span>
              <h2>AZIMUT 55</h2>
              <p>Cancún → Isla Mujeres → Playa Norte</p>
            </div>
            <div>
              <strong>14:00 → 20:00</strong>
              <span>12 personas · 6 horas</span>
            </div>
          </div>
          <section className="panel">
            <SectionTitle
              title="Antes de salir"
              aside={`${done.length}/${tasks.length} LISTOS`}
            />
            <div className="checklist">
              {tasks.map((t, i) => (
                <button
                  onClick={() =>
                    setDone((d) =>
                      d.includes(i) ? d.filter((x) => x !== i) : [...d, i],
                    )
                  }
                  className={done.includes(i) ? "done" : ""}
                  key={t}
                >
                  <i>{done.includes(i) && <Check />}</i>
                  {t}
                </button>
              ))}
            </div>
          </section>
          <section className="panel">
            <SectionTitle title="Rentabilidad interna" />
            <div className="costs">
              {[
                ["Combustible", -7400],
                ["Capitán / Crew", -4500],
                ["Alimentos y bebidas", -2100],
                ["Limpieza", -1200],
                ["Comisión de venta", -3880],
                ["Marina", -1000],
              ].map(([a, b]) => (
                <Metric
                  key={String(a)}
                  label={String(a)}
                  value={money(Number(b))}
                />
              ))}
            </div>
            <div className="margin">
              <span>GANANCIA · 46%</span>
              <b>$28,420</b>
            </div>
          </section>
        </section>
        <aside className="panel summary">
          <SectionTitle title="Experiencia" />
          <p>Charter privado de 6 horas</p>
          {[
            ["Charter", 38000],
            ["Chef privado", 6500],
            ["Barra premium", 4800],
            ["DJ", 5000],
            ["Transporte privado", 4000],
            ["Decoración", 3500],
          ].map(([a, b]) => (
            <Metric
              key={String(a)}
              label={String(a)}
              value={money(Number(b))}
            />
          ))}
          <div className="total">
            <span>TOTAL</span>
            <b>$61,800 MXN</b>
          </div>
          <Metric label="Anticipo · Pagado" value="$30,900 MXN" />
          <Metric label="Saldo · Vence 12 sep" value="$30,900 MXN" />
        </aside>
      </div>
    </Page>
  );
}
function Clients() {
  const [f, setF] = useState("All");
  return (
    <Page>
      <Header
        eyebrow="RELACIONES & CLIENTES"
        title="Clientes"
        action={
          <button className="btn">
            <Plus /> Nuevo cliente
          </button>
        }
      />
      <Filters
        items={["All", "VIP", "Returning", "New", "Corporate", "Partner"]}
        active={f}
        onChange={setF}
      />
      <div className="client-grid">
        {clients
          .filter((c) => f === "All" || c.type === f)
          .map((c) => (
            <Link href={`/clients/${c.id}`} className="client-card" key={c.id}>
              <div className="avatar">
                {c.name
                  .split(" ")
                  .map((x) => x[0])
                  .slice(0, 2)}
              </div>
              <StatusBadge>{c.type}</StatusBadge>
              <h2>{c.name}</h2>
              <p>
                {c.location} · {c.preferred}
              </p>
              <Metric label="Valor del cliente" value={money(c.ltv)} />
              <div>
                <span>{c.bookings} reservas</span>
                <span>{c.last}</span>
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
        eyebrow="CLIENTE VIP · CIUDAD DE MÉXICO"
        title="Roberto Hernández"
        action={
          <div className="action-row">
            <button className="btn secondary">Agregar nota</button>
            <button className="btn secondary">Nueva reserva</button>
            <Link className="btn" href="/quotes">
              Crear cotización
            </Link>
          </div>
        }
      />
      <section className="detail-metrics">
        <Metric label="Valor del cliente" value="$428,500" />
        <Metric label="Reservas" value="9" />
        <Metric label="Gasto promedio" value="$47,611" />
        <Metric label="Última reserva" value="Azimut 55 · 22 ago" />
      </section>
      <div className="two-col">
        <section className="panel">
          <SectionTitle title="Preferencias" />
          <div className="preferences">
            {[
              ["Destino preferido", "Isla Mujeres"],
              ["Yate preferido", "Yate a motor"],
              ["Bebida", "Don Julio 1942"],
              ["Música", "House / Electronic"],
              ["Transporte", "SUV"],
              ["Grupo habitual", "8–12 personas"],
            ].map(([a, b]) => (
              <Metric key={a} label={a} value={b} />
            ))}
          </div>
          <SectionTitle title="Notas internas" />
          <p>
            Suele reservar con 5–10 días de anticipación. Prefiere salidas por
            la tarde. También ha mostrado interés en villas.
          </p>
        </section>
        <section className="panel">
          <SectionTitle title="También podría interesarle" />
          <div className="recommendations">
            {[
              [House, "Villa privada"],
              [Car, "Traslado al aeropuerto"],
              [Car, "Vehículo premium"],
              [Utensils, "Chef privado"],
            ].map(([I, n]) => {
              const Icon = I as typeof House;
              return (
                <div key={String(n)}>
                  <Icon />
                  <span>{String(n)}</span>
                  <Plus />
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <section>
        <SectionTitle title="Historial de reservas" />
        <div className="booking-list">
          {bookings.slice(0, 3).map((b) => (
            <div className="booking-row" key={b.id}>
              <strong>#{b.id}</strong>
              <span>{b.asset}</span>
              <span>{b.date}</span>
              <b>{money(b.value)} MXN</b>
              <StatusBadge>{b.status}</StatusBadge>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}
function Assets() {
  const [tab, setTab] = useState("All");
  return (
    <Page>
      <Header eyebrow="CATÁLOGO & OPERACIÓN" title="Servicios" />
      <Filters
        items={["All", "Marine", "Stays", "Mobility", "Concierge"]}
        active={tab}
        onChange={setTab}
      />
      {(tab === "All" || tab === "Stays") && (
        <>
          <SectionTitle title="Villas" aside="2 PROPIEDADES" />
          <div className="asset-grid">
            <Asset
              name="Villa Ocean"
              info="Tulum · 6 habitaciones · 12 huéspedes"
              status="Occupied"
              stats={[
                ["Check-out", "11:00"],
                ["Próximo Check-in", "16:00"],
                ["Ingresos del mes", "$184,200"],
              ]}
              image="/demo/villa.jpg"
            />
            <Asset
              name="Villa Serena"
              info="Cancún · 5 habitaciones · 10 huéspedes"
              status="Available"
              stats={[
                ["Próxima llegada", "14 sep"],
                ["Noches reservadas", "18"],
                ["Ingresos del mes", "$148,000"],
              ]}
              image="/demo/villa-alt.jpg"
            />
          </div>
        </>
      )}
      {(tab === "All" || tab === "Mobility") && (
        <>
          <SectionTitle title="Vehículos" aside="3 VEHÍCULOS" />
          <div className="vehicle-grid">
            {[
              ["Mercedes G63", "Available", "34,281 km", "$264,000"],
              ["Lamborghini Urus", "Reserved", "18,932 km", "$318,400"],
              ["Sprinter VIP", "Operating", "48,201 km", "$184,500"],
            ].map((v) => (
              <div className="vehicle" key={v[0]}>
                <Car />
                <StatusBadge>{v[1]}</StatusBadge>
                <h2>{v[0]}</h2>
                <Metric label="Kilometraje" value={v[2]} />
                <Metric label="Ingresos" value={v[3]} />
                <p>Entrega · Devolución · Combustible · Revisión de daños</p>
              </div>
            ))}
          </div>
        </>
      )}
      {(tab === "All" || tab === "Concierge") && (
        <>
          <SectionTitle title="Concierge" />
          <div className="services">
            {services.map((s) => (
              <div key={s.name}>
                <div>
                  <strong>{serviceLabel[s.name] ?? s.name}</strong>
                  <small>{s.provider}</small>
                </div>
                <StatusBadge>
                  {s.available ? "Available" : "Reserved"}
                </StatusBadge>
                <span>Costo {money(s.cost)}</span>
                <b>{money(s.price)} MXN</b>
                <em>
                  {Math.round(((s.price - s.cost) / s.price) * 100)}% margen
                </em>
              </div>
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
function Asset({
  name,
  info,
  status,
  stats,
  image,
}: {
  name: string;
  info: string;
  status: string;
  stats: string[][];
  image: string;
}) {
  return (
    <div className="asset">
      <img src={image} alt={name} />
      <div>
        <StatusBadge>{status}</StatusBadge>
        <h2>{name}</h2>
        <p>{info}</p>
        <div>
          {stats.map(([a, b]) => (
            <Metric key={a} label={a} value={b} />
          ))}
        </div>
        <small>
          Preparación · Limpieza · Lavandería · Alberca · Amenities · Inspección
        </small>
      </div>
    </div>
  );
}
function Finance() {
  return (
    <Page>
      <Header
        eyebrow="SEPTIEMBRE 2026"
        title="Rendimiento del negocio"
        action={<button className="btn secondary">Exportar reporte</button>}
      />
      <section className="finance-hero">
        <div>
          <span>GANANCIA ESTIMADA</span>
          <b>$975,900</b>
          <em>Después de gastos y comisiones · +12.4% vs agosto</em>
        </div>
        <div>
          <Metric label="Ingresos" value="$1,842,500" />
          <Metric label="Cobrado" value="$1,526,000" />
          <Metric
            label="Pendiente de cobrar · Reservas aún no liquidadas"
            value="$316,500"
          />
          <Metric label="Gastos operativos" value="−$684,200" />
          <Metric label="Comisiones" value="−$182,400" />
        </div>
      </section>
      <div className="two-col finance-cols">
        <section className="panel">
          <SectionTitle title="Ingresos vs gastos" aside="ENE — SEP" />
          <Bars
            values={[
              34, 18, 42, 21, 48, 25, 56, 29, 52, 24, 65, 33, 72, 36, 69, 31,
              88, 38,
            ]}
          />
          <div className="legend">
            <i /> Ingresos <i /> Gastos
          </div>
        </section>
        <section className="panel">
          <SectionTitle title="Ingresos por categoría" />
          {[
            ["Yates", 58],
            ["Villas", 21],
            ["Vehículos", 12],
            ["Concierge", 9],
          ].map(([n, v]) => (
            <div className="progress" key={String(n)}>
              <span>{n}</span>
              <i>
                <b style={{ width: `${v}%` }} />
              </i>
              <strong>{v}%</strong>
            </div>
          ))}
        </section>
      </div>
      <div className="two-col">
        <section>
          <SectionTitle title="Mayor rentabilidad" />
          {[
            ["Azimut 55", 196400],
            ["Villa Ocean", 184200],
            ["Sunseeker 60", 151800],
            ["Mercedes G63", 96400],
          ].map(([n, v], i) => (
            <div className="rank" key={String(n)}>
              <span>0{i + 1}</span>
              <strong>{n}</strong>
              <b>{money(Number(v))} MXN</b>
            </div>
          ))}
        </section>
        <section>
          <SectionTitle
            title="Pagos pendientes"
            aside="RESERVAS CONFIRMADAS AÚN NO LIQUIDADAS"
          />
          {bookings.slice(0, 3).map((b) => (
            <div className="receivable" key={b.id}>
              <div>
                <strong>{b.client}</strong>
                <small>
                  #{b.id} · {b.date}
                </small>
              </div>
              <b>{money(Math.round(b.value / 2))} MXN</b>
              <StatusBadge>{b.payment}</StatusBadge>
            </div>
          ))}
        </section>
      </div>
      <section className="channels">
        <SectionTitle title="Canales de venta" />
        <div>
          {[
            ["Instagram", 384000],
            ["WhatsApp", 421500],
            ["Hotel Concierge", 296400],
            ["Referidos", 242100],
            ["Agencias", 198500],
            ["Clientes recurrentes", 186000],
            ["Venta directa", 114000],
          ].map(([n, v]) => (
            <Metric
              key={String(n)}
              label={String(n)}
              value={`${money(Number(v))} MXN`}
            />
          ))}
        </div>
      </section>
    </Page>
  );
}
function Quotes() {
  const [selected, setSelected] = useState(["Private Chef", "Premium Bar"]),
    [preview, setPreview] = useState(false);
  const opts = services.slice(0, 5);
  const total =
    38000 +
    opts
      .filter((x) => selected.includes(x.name))
      .reduce((a, b) => a + b.price, 0);
  return (
    <Page>
      <Header eyebrow="COTIZACIÓN" title="Crear experiencia" />
      <div className="quote-layout">
        <section>
          <div className="quote-step">
            <b>01</b>
            <div>
              <span>CLIENTE</span>
              <h3>Roberto Hernández</h3>
            </div>
            <div>
              <span>FECHA</span>
              <h3>12 de septiembre</h3>
            </div>
            <div>
              <span>PERSONAS</span>
              <h3>12</h3>
            </div>
          </div>
          <div className="quote-step">
            <b>02</b>
            <div className="experience-select">
              <img src={fleet[0].image} alt="Azimut 55" />
              <div>
                <span>EXPERIENCIA SELECCIONADA</span>
                <h2>AZIMUT 55</h2>
                <p>6 horas · Cancún → Isla Mujeres</p>
              </div>
              <Check />
            </div>
          </div>
          <div className="quote-step">
            <b>03</b>
            <div className="service-select">
              <span>AGREGAR SERVICIOS</span>
              {opts.map((s) => (
                <button
                  className={selected.includes(s.name) ? "selected" : ""}
                  onClick={() =>
                    setSelected((a) =>
                      a.includes(s.name)
                        ? a.filter((x) => x !== s.name)
                        : [...a, s.name],
                    )
                  }
                  key={s.name}
                >
                  <i>{selected.includes(s.name) && <Check />}</i>
                  <span>
                    {serviceLabel[s.name] ?? s.name}
                    <small>{s.provider}</small>
                  </span>
                  <b>{money(s.price)} MXN</b>
                </button>
              ))}
            </div>
          </div>
        </section>
        <aside className="quote-summary">
          <span>TU EXPERIENCIA</span>
          <h2>AZIMUT 55</h2>
          <p>12 de septiembre · 12 personas</p>
          <Metric label="Charter privado · 6 horas" value="$38,000 MXN" />
          {opts
            .filter((s) => selected.includes(s.name))
            .map((s) => (
              <Metric
                key={s.name}
                label={serviceLabel[s.name] ?? s.name}
                value={`${money(s.price)} MXN`}
              />
            ))}
          <div className="total">
            <span>TOTAL</span>
            <b>{money(total)} MXN</b>
          </div>
          <Metric label="Anticipo · 50%" value={`${money(total / 2)} MXN`} />
          <button onClick={() => setPreview(true)} className="btn wide">
            Generar propuesta <ArrowUpRight />
          </button>
        </aside>
      </div>
      <Modal open={preview} onClose={() => setPreview(false)}>
        <div className="proposal">
          <div className="proposal-cover">
            <img src={fleet[0].image} alt="Azimut 55 navegando en el Caribe" />
            <div className="shade" />
            <div className="proposal-brand">
              <small>YACHT RIVIERA MAYA</small>
            </div>
            <div className="proposal-heading">
              <span>UNA EXPERIENCIA DISEÑADA PARA TI</span>
              <h1>
                TU EXPERIENCIA
                <br />
                PRIVADA
              </h1>
            </div>
          </div>
          <div className="proposal-body">
            <p className="proposal-meta">
              12 DE SEPTIEMBRE · 12 PERSONAS
              <br />
              CHARTER PRIVADO · 6 HORAS
              <br />
              Cancún → Isla Mujeres
            </p>
            <span className="proposal-label">SERVICIOS INCLUIDOS</span>
            <div>
              {opts
                .filter((s) => selected.includes(s.name))
                .map((s) => (
                  <span key={s.name}>
                    <Check /> {serviceLabel[s.name] ?? s.name}
                  </span>
                ))}
            </div>
            <div className="total">
              <span>TOTAL</span>
              <b>{money(total)} MXN</b>
            </div>
            <p>Reserva con 50% · {money(total / 2)} MXN</p>
            <button className="btn wide">RESERVAR EXPERIENCIA</button>
          </div>
        </div>
      </Modal>
    </Page>
  );
}
function Team() {
  const [f, setF] = useState("All");
  return (
    <Page>
      <Header
        eyebrow="EQUIPO & RENDIMIENTO"
        title="Equipo"
        action={
          <button className="btn">
            <Plus /> Agregar persona
          </button>
        }
      />
      <Filters
        items={[
          "All",
          "Admin",
          "Operations",
          "Sales",
          "Captain",
          "Concierge",
          "Driver",
          "Finance",
        ]}
        active={f}
        onChange={setF}
      />
      <div className="team-grid">
        {team
          .filter((t) => f === "All" || t.role.includes(f))
          .map((t) => (
            <div className="team-card" key={t.name}>
              <div className="avatar">
                {t.name
                  .split(" ")
                  .map((x) => x[0])
                  .slice(0, 2)}
              </div>
              <StatusBadge>{t.status}</StatusBadge>
              <h2>{t.name}</h2>
              <p>{roleLabel[t.role] ?? t.role}</p>
              {t.sales ? (
                <>
                  <Metric label="Ventas" value={`${money(t.sales)} MXN`} />
                  <Metric
                    label={`${t.bookings} reservas · Comisión`}
                    value={`${money(t.commission || 0)} MXN`}
                  />
                </>
              ) : (
                <p className="muted">Disponible hoy</p>
              )}
            </div>
          ))}
      </div>
      <SectionTitle title="Estado de comisiones" />
      <div className="booking-list">
        {team
          .filter((t) => t.commission)
          .map((t) => (
            <div className="booking-row" key={t.name}>
              <strong>{t.name}</strong>
              <span>{t.bookings} reservas</span>
              <b>{money(t.commission || 0)} MXN</b>
              <StatusBadge>{t.status}</StatusBadge>
            </div>
          ))}
      </div>
    </Page>
  );
}
function SettingsPage() {
  const [notif, setNotif] = useState({ email: true, whatsapp: false });
  return (
    <Page>
      <Header eyebrow="PREFERENCIAS DEL SISTEMA" title="Configuración" />
      <div className="settings-grid">
        <section className="panel">
          <SectionTitle title="Empresa" />
          <label>
            Nombre de la empresa
            <input value="Yacht Riviera Maya" readOnly />
          </label>
          <div className="field-grid">
            <label>
              Moneda
              <select defaultValue="MXN">
                <option>MXN</option>
              </select>
            </label>
            <label>
              Zona horaria
              <select defaultValue="America/Cancun">
                <option>America/Cancun</option>
              </select>
            </label>
          </div>
        </section>
        <section className="panel">
          <SectionTitle title="Configuración de reservas" />
          <label>
            Anticipo predeterminado
            <select defaultValue="50%">
              <option>50%</option>
            </select>
          </label>
          <label>
            Política de cancelación
            <textarea defaultValue="Reembolso completo hasta 7 días antes de la experiencia." />
          </label>
        </section>
        <section className="panel">
          <SectionTitle title="Notificaciones" />
          <Toggle
            label="Resumen operativo por email"
            on={notif.email}
            click={() => setNotif((n) => ({ ...n, email: !n.email }))}
          />
          <Toggle
            label="Alertas por WhatsApp"
            on={notif.whatsapp}
            click={() => setNotif((n) => ({ ...n, whatsapp: !n.whatsapp }))}
          />
        </section>
        <section className="panel">
          <SectionTitle title="Categorías del negocio" />
          {["Marine", "Stays", "Mobility", "Concierge"].map((x) => (
            <Toggle
              key={x}
              label={
                {
                  Marine: "Yates",
                  Stays: "Villas",
                  Mobility: "Vehículos",
                  Concierge: "Concierge",
                }[x] ?? x
              }
              on
              click={() => {}}
            />
          ))}
        </section>
      </div>
    </Page>
  );
}
function Toggle({
  label,
  on,
  click,
}: {
  label: string;
  on: boolean;
  click: () => void;
}) {
  return (
    <button className="toggle-row" onClick={click}>
      <span>{label}</span>
      <i className={on ? "on" : ""}>
        <b />
      </i>
    </button>
  );
}
