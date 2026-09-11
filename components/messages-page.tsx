"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  Check,
  ChevronDown,
  CircleUserRound,
  FileText,
  Instagram,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Sparkles,
  StickyNote,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  Conversation,
  ConversationMessage,
  ConversationStatus,
  MessageChannel,
} from "@/lib/types";
import {
  conversations as seedConversations,
  replyTemplates,
} from "@/mock/messages";
import { destinationName, useDestination } from "@/lib/destination-context";
import { jamesCase } from "@/lib/demo-case";
import { Modal, StatusBadge, Toast } from "./ui";

const channelLabels: Record<MessageChannel, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  facebook: "Facebook",
};
const statuses: ConversationStatus[] = [
  "Nuevo",
  "En conversación",
  "Esperando cliente",
  "Seguimiento",
  "Cerrado",
];
const assignmentByDestination = {
  global: ["Matías", "Andrea", "Sofía", "Carlos"],
  miami: ["Sofía", "Matías"],
  "riviera-maya": ["Andrea", "Matías"],
  "los-cabos": ["Carlos", "Matías"],
};

function ChannelIcon({ channel }: { channel: MessageChannel }) {
  return channel === "instagram" ? (
    <Instagram />
  ) : channel === "facebook" ? (
    <MessageCircle />
  ) : (
    <MessageCircle />
  );
}

export function MessagesPage() {
  const router = useRouter();
  const { activeId } = useDestination();
  const [items, setItems] = useState<Conversation[]>(() => {
    if (typeof window === "undefined") return seedConversations;
    try {
      const saved = sessionStorage.getItem("yrm-inbox-state");
      if (!saved) return seedConversations;
      const parsed = JSON.parse(saved) as Conversation[];
      return parsed.map((conversation, index) => ({
        ...conversation,
        id:
          index === 0
            ? jamesCase.conversationId
            : conversation.id.replace("CONV-", "CV-1"),
      }));
    } catch {
      return seedConversations;
    }
  });
  const [selectedId, setSelectedId] = useState(jamesCase.conversationId);
  const [filter, setFilter] = useState("Todos");
  const [channel, setChannel] = useState<MessageChannel | "all">("all");
  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState("");
  const [crmOpen, setCrmOpen] = useState(false);
  const [mobileThread, setMobileThread] = useState(false);
  const [createLeadOpen, setCreateLeadOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [noteMode, setNoteMode] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined")
      sessionStorage.setItem("yrm-inbox-state", JSON.stringify(items));
  }, [items]);

  const scoped = useMemo(
    () =>
      items.filter(
        (item) =>
          (activeId === "global" || item.destinationId === activeId) &&
          (channel === "all" || item.channel === channel) &&
          (filter === "Todos" ||
            (filter === "Sin leer" && item.unread > 0) ||
            (filter === "Sin asignar" && !item.assignee) ||
            item.status === filter) &&
          `${item.name} ${item.lastMessage}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [items, activeId, channel, filter, query],
  );
  const effectiveId = scoped.some((item) => item.id === selectedId)
    ? selectedId
    : (scoped[0]?.id ?? selectedId);
  const selected = items.find((item) => item.id === effectiveId);

  const mutate = (fn: (item: Conversation) => Conversation) =>
    setItems((current) =>
      current.map((item) => (item.id === effectiveId ? fn(item) : item)),
    );
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };
  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();
    if (!composer.trim() || !selected) return;
    const message: ConversationMessage = {
      id: `msg-${Date.now()}`,
      author: noteMode ? "note" : "agent",
      body: composer.trim(),
      time: new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      authorName: "Andrea",
    };
    mutate((item) => ({
      ...item,
      messages: [...item.messages, message],
      lastMessage: composer.trim(),
      status: noteMode ? item.status : "Esperando cliente",
      unread: 0,
    }));
    setComposer("");
    setNoteMode(false);
    notify(
      message.author === "note"
        ? "Nota interna guardada"
        : "Mensaje agregado a la demo",
    );
  };
  const setStatus = (status: ConversationStatus) =>
    mutate((item) => ({ ...item, status }));
  const setAssignee = (assignee: string) =>
    mutate((item) => ({ ...item, assignee }));
  const linkClient = (clientId: string, name: string) => {
    mutate((item) => ({ ...item, clientId, name }));
    setLinkOpen(false);
    notify("Cliente vinculado manualmente");
  };
  const createLead = (event: FormEvent) => {
    event.preventDefault();
    mutate((item) => ({
      ...item,
      lead: {
        id:
          item.id === jamesCase.conversationId
            ? jamesCase.leadId
            : `LD-${Date.now().toString().slice(-4)}`,
        dates: "12–16 nov",
        guests: 8,
        interests: ["Yacht", "Dining", "Transport"],
        sourceChannel: item.channel,
        conversationId: item.id,
      },
    }));
    setCreateLeadOpen(false);
    notify("Lead creado desde la conversación");
    if (selected?.id === jamesCase.conversationId)
      router.push(`/leads/${jamesCase.clientId}`);
  };
  const createQuote = () => {
    if (!selected) return;
    sessionStorage.setItem(
      "yrm-inbox-quote-draft",
      JSON.stringify({
        conversationId: selected.id,
        client: selected.name,
        destinationId: selected.destinationId,
        date: selected.lead?.dates ?? "",
        guests: selected.lead?.guests ?? 8,
        interests: selected.lead?.interests ?? ["Yacht", "Dining", "Transport"],
      }),
    );
    router.push(`/quotes?conversation=${selected.id}`);
  };

  const counts = {
    unread: items.filter(
      (i) =>
        (activeId === "global" || i.destinationId === activeId) && i.unread,
    ).length,
    unassigned: items.filter(
      (i) =>
        (activeId === "global" || i.destinationId === activeId) && !i.assignee,
    ).length,
    today: items.filter(
      (i) => activeId === "global" || i.destinationId === activeId,
    ).length,
  };

  return (
    <main className="inbox-page">
      <section className="inbox-list">
        <header>
          <span className="eyebrow">CONCIERGE INBOX</span>
          <h1>Mensajes</h1>
          <div className="inbox-stats">
            <button onClick={() => setFilter("Sin leer")}>
              <b>{counts.unread}</b>
              <span>Sin leer</span>
            </button>
            <button onClick={() => setFilter("Sin asignar")}>
              <b>{counts.unassigned}</b>
              <span>Sin asignar</span>
            </button>
            <button>
              <b>{counts.today}</b>
              <span>Hoy</span>
            </button>
          </div>
        </header>
        <label className="inbox-search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cliente o conversación"
          />
        </label>
        <div className="inbox-filters">
          {["Todos", "Sin leer", "Sin asignar"].map((value) => (
            <button
              key={value}
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="channel-filters">
          <button
            className={channel === "all" ? "active" : ""}
            onClick={() => setChannel("all")}
          >
            Todos
          </button>
          {(["whatsapp", "instagram", "facebook"] as MessageChannel[]).map(
            (value) => (
              <button
                key={value}
                className={channel === value ? "active" : ""}
                onClick={() => setChannel(value)}
              >
                <ChannelIcon channel={value} />
                {channelLabels[value]}
              </button>
            ),
          )}
        </div>
        <select
          className="status-filter"
          value={statuses.includes(filter as ConversationStatus) ? filter : ""}
          onChange={(e) => setFilter(e.target.value || "Todos")}
        >
          <option value="">Todos los estados</option>
          {statuses.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <div className="conversation-list">
          {scoped.length ? (
            scoped.map((item) => (
              <button
                key={item.id}
                className={
                  effectiveId === item.id
                    ? "conversation-item active"
                    : "conversation-item"
                }
                onClick={() => {
                  setSelectedId(item.id);
                  setMobileThread(true);
                  setItems((current) =>
                    current.map((conversation) =>
                      conversation.id === item.id
                        ? { ...conversation, unread: 0 }
                        : conversation,
                    ),
                  );
                }}
              >
                <span className="conversation-avatar">
                  {item.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)}
                </span>
                <span className="conversation-copy">
                  <strong>{item.name}</strong>
                  <small>
                    <ChannelIcon channel={item.channel} />
                    {channelLabels[item.channel]} ·{" "}
                    {destinationName(item.destinationId)}
                  </small>
                  <p>{item.lastMessage}</p>
                  <em>{item.assignee ?? "Sin asignar"}</em>
                </span>
                <span className="conversation-meta">
                  <time>{item.time}</time>
                  {item.unread > 0 && <b>{item.unread}</b>}
                </span>
              </button>
            ))
          ) : (
            <div className="inbox-empty">
              <MessageCircle />
              <h3>Sin conversaciones</h3>
              <p>
                {query
                  ? "No encontramos resultados para tu búsqueda."
                  : activeId === "miami"
                    ? "No hay conversaciones en Miami con estos filtros."
                    : "Prueba con otro filtro o canal."}
              </p>
            </div>
          )}
        </div>
      </section>

      {selected && (
        <section
          className={
            mobileThread ? "message-thread mobile-active" : "message-thread"
          }
        >
          <header>
            <button
              className="thread-back"
              onClick={() => setMobileThread(false)}
            >
              <ArrowLeft />
            </button>
            <div className="conversation-avatar">
              {selected.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)}
            </div>
            <div>
              <h2>{selected.name}</h2>
              <p>
                <ChannelIcon channel={selected.channel} />
                {channelLabels[selected.channel]} ·{" "}
                {destinationName(selected.destinationId)}
              </p>
            </div>
            <div className="thread-actions">
              <label>
                <select
                  value={selected.assignee ?? ""}
                  onChange={(e) => setAssignee(e.target.value)}
                >
                  <option value="">Asignar</option>
                  {assignmentByDestination[activeId].map((person) => (
                    <option key={person}>{person}</option>
                  ))}
                </select>
                <ChevronDown />
              </label>
              <label>
                <select
                  value={selected.status}
                  onChange={(e) =>
                    setStatus(e.target.value as ConversationStatus)
                  }
                >
                  {statuses.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
                <ChevronDown />
              </label>
              <button onClick={() => setSummaryOpen(true)} title="Resumir">
                <Sparkles />
              </button>
              <button className="crm-mobile" onClick={() => setCrmOpen(true)}>
                <CircleUserRound />
              </button>
              <button title="Más">
                <MoreHorizontal />
              </button>
            </div>
          </header>
          <div className="thread-status">
            <span>{selected.status}</span>
            <span>{selected.assignee ?? "Sin asignar"}</span>
            <button onClick={() => setSummaryOpen(true)}>
              <Bot /> Resumir conversación
            </button>
          </div>
          <div className="message-scroll">
            <div className="thread-date">
              HOY · CONVERSACIÓN VÍA{" "}
              {channelLabels[selected.channel].toUpperCase()}
            </div>
            {selected.messages.map((message) => (
              <article key={message.id} className={`message ${message.author}`}>
                <small>
                  {message.author === "note"
                    ? `INTERNAL NOTE · ${message.authorName}`
                    : message.author === "agent"
                      ? message.authorName
                      : selected.name}
                </small>
                <p>{message.body}</p>
                <time>{message.time}</time>
              </article>
            ))}
          </div>
          <form
            className={noteMode ? "composer note" : "composer"}
            onSubmit={sendMessage}
          >
            <div className="composer-label">
              {noteMode ? (
                <>
                  <StickyNote /> NOTA INTERNA — no se enviará al cliente
                </>
              ) : (
                <>Responder vía {channelLabels[selected.channel]}</>
              )}
            </div>
            <textarea
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              placeholder={
                noteMode
                  ? "Escribí una nota para el equipo…"
                  : "Escribí un mensaje…"
              }
            />
            <div>
              <button
                type="button"
                title="Adjuntar (demo)"
                onClick={() => notify("Adjunto preparado en modo demo")}
              >
                <Paperclip />
              </button>
              <div className="template-menu">
                <button type="button">
                  <FileText /> Template
                </button>
                <div>
                  {replyTemplates.map((template) => (
                    <button
                      type="button"
                      key={template.name}
                      onClick={() =>
                        setComposer(
                          template.text.replace(
                            "{name}",
                            selected.name.split(" ")[0],
                          ),
                        )
                      }
                    >
                      <b>{template.name}</b>
                      <span>{template.text}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className={noteMode ? "active" : ""}
                onClick={() => setNoteMode((value) => !value)}
              >
                <StickyNote /> Nota
              </button>
              <button className="send-button" disabled={!composer.trim()}>
                {noteMode ? "Guardar nota" : "Enviar"}
                <Send />
              </button>
            </div>
          </form>
        </section>
      )}

      {selected && (
        <aside className={crmOpen ? "crm-context open" : "crm-context"}>
          <button className="crm-close" onClick={() => setCrmOpen(false)}>
            <X />
          </button>
          <span className="eyebrow">CLIENT CONTEXT</span>
          {selected.clientId ? (
            <ClientContext selected={selected} router={router} />
          ) : selected.lead ? (
            <LeadContext selected={selected} router={router} />
          ) : (
            <NewContact
              selected={selected}
              onCreate={() => setCreateLeadOpen(true)}
              onLink={() => setLinkOpen(true)}
            />
          )}
          <AssistantSuggestion
            selected={selected}
            onCreate={() => setCreateLeadOpen(true)}
          />
          <section className="quick-actions">
            <h3>Quick actions</h3>
            <button onClick={() => setCreateLeadOpen(true)}>
              <UserPlus /> Crear lead
            </button>
            <button onClick={createQuote}>
              <FileText /> Crear cotización
            </button>
            <button
              onClick={() => {
                setNoteMode(true);
                setCrmOpen(false);
              }}
            >
              <StickyNote /> Agregar nota
            </button>
            <button onClick={() => setStatus("Cerrado")}>
              <Check /> Cerrar conversación
            </button>
          </section>
        </aside>
      )}

      <Modal open={createLeadOpen} onClose={() => setCreateLeadOpen(false)}>
        <form className="inbox-modal" onSubmit={createLead}>
          <span className="eyebrow">NUEVO LEAD · DESDE INBOX</span>
          <h2>Crear lead</h2>
          <div className="field-grid">
            <label>
              Nombre
              <input defaultValue={selected?.name} />
            </label>
            <label>
              Origen
              <input
                value={selected ? channelLabels[selected.channel] : ""}
                readOnly
              />
            </label>
            <label>
              Destino
              <input
                value={selected ? destinationName(selected.destinationId) : ""}
                readOnly
              />
            </label>
            <label>
              Fecha
              <input defaultValue="12–16 nov" />
            </label>
            <label>
              Personas
              <input type="number" defaultValue="8" />
            </label>
            <label>
              Interés
              <input defaultValue="Yacht, Dining, Transport" />
            </label>
            <label>
              Hotel
              <input placeholder="Hotel o villa" />
            </label>
            <label>
              Presupuesto
              <input placeholder="USD" />
            </label>
          </div>
          <label>
            Último mensaje
            <textarea value={selected?.lastMessage ?? ""} readOnly />
          </label>
          <label>
            Notas
            <textarea placeholder="Contexto comercial relevante" />
          </label>
          <div className="modal-actions">
            <button type="button" onClick={() => setCreateLeadOpen(false)}>
              Cancelar
            </button>
            <button className="btn">Crear lead</button>
          </div>
        </form>
      </Modal>
      <Modal open={linkOpen} onClose={() => setLinkOpen(false)}>
        <div className="inbox-modal">
          <span className="eyebrow">VINCULACIÓN MANUAL</span>
          <h2>Vincular cliente</h2>
          <p>
            Selecciona un cliente existente. La demo no realiza matching
            automático entre canales.
          </p>
          <label className="inbox-search">
            <Search />
            <input placeholder="Buscar cliente" />
          </label>
          {[
            ["roberto-hernandez", "Roberto Hernández"],
            ["sofia-turner", "Sofia Turner"],
            ["emma-collins", "Emma Collins"],
          ].map(([id, name]) => (
            <button
              className="client-link-row"
              key={id}
              onClick={() => linkClient(id, name)}
            >
              <Users />
              <span>
                <b>{name}</b>
                <small>Cliente existente</small>
              </span>
              <Link2 />
            </button>
          ))}
        </div>
      </Modal>
      <Modal open={summaryOpen} onClose={() => setSummaryOpen(false)}>
        <div className="inbox-modal conversation-summary">
          <span className="eyebrow">RESUMEN MOCK</span>
          <h2>Conversation Summary</h2>
          <p>
            James travels to Miami with 8 people. Looking for a yacht Saturday
            afternoon. Interested in transport and dinner. Approx budget not
            specified.
          </p>
          <h3>Next action</h3>
          <p>Confirm yacht duration and budget.</p>
          <button className="btn" onClick={() => setSummaryOpen(false)}>
            Entendido
          </button>
        </div>
      </Modal>
      <Toast message={toast} />
    </main>
  );
}

function NewContact({
  selected,
  onCreate,
  onLink,
}: {
  selected: Conversation;
  onCreate: () => void;
  onLink: () => void;
}) {
  return (
    <section className="context-card">
      <span>NEW CONTACT</span>
      <div className="context-person">
        <div className="conversation-avatar">
          {selected.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)}
        </div>
        <div>
          <h2>{selected.name}</h2>
          <p>
            {channelLabels[selected.channel]} ·{" "}
            {destinationName(selected.destinationId)}
          </p>
        </div>
      </div>
      <button className="btn" onClick={onCreate}>
        Crear lead
      </button>
      <button className="btn secondary" onClick={onLink}>
        Vincular cliente
      </button>
      <small>La vinculación entre identidades es manual en esta demo.</small>
    </section>
  );
}
function LeadContext({
  selected,
  router,
}: {
  selected: Conversation;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <section className="context-card">
      <span>LEAD</span>
      <h2>{selected.name}</h2>
      <StatusBadge>Nuevo</StatusBadge>
      <dl>
        <dt>Destination</dt>
        <dd>{destinationName(selected.destinationId)}</dd>
        <dt>Dates</dt>
        <dd>{selected.lead?.dates}</dd>
        <dt>Guests</dt>
        <dd>{selected.lead?.guests}</dd>
        <dt>Interests</dt>
        <dd>{selected.lead?.interests.join(" · ")}</dd>
      </dl>
      <button className="btn" onClick={() => router.push("/leads")}>
        Ver lead
      </button>
      <button
        className="btn secondary"
        onClick={() => router.push(`/quotes?conversation=${selected.id}`)}
      >
        Crear cotización
      </button>
    </section>
  );
}
function ClientContext({
  selected,
  router,
}: {
  selected: Conversation;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <section className="context-card">
      <span>CLIENTE</span>
      <h2>{selected.name}</h2>
      <dl>
        <dt>Total comprado</dt>
        <dd>USD 42,800</dd>
        <dt>Reservas</dt>
        <dd>9</dd>
        <dt>Tasa de cierre</dt>
        <dd>64%</dd>
        <dt>Último destino</dt>
        <dd>{destinationName(selected.destinationId)}</dd>
      </dl>
      <button
        className="btn"
        onClick={() => router.push(`/clients/${selected.clientId}`)}
      >
        Ver cliente
      </button>
      <button
        className="btn secondary"
        onClick={() => router.push(`/quotes?client=${selected.clientId}`)}
      >
        Crear cotización
      </button>
      <button
        className="btn secondary"
        onClick={() => router.push("/bookings")}
      >
        Nueva reserva
      </button>
      <div className="contact-timeline">
        <h3>Contact timeline</h3>
        <p>
          Instagram Message <small>Sep 11 · 14:32</small>
        </p>
        <p>
          WhatsApp Conversation <small>Sep 12 · 09:15</small>
        </p>
        <p>
          Cotización enviada <small>Sep 12 · 11:40</small>
        </p>
      </div>
    </section>
  );
}
function AssistantSuggestion({
  selected,
  onCreate,
}: {
  selected: Conversation;
  onCreate: () => void;
}) {
  if (selected.id !== jamesCase.conversationId) return null;
  return (
    <section className="assistant-suggestion">
      <span>
        <Sparkles /> ASSISTANT SUGGESTION · DEMO
      </span>
      <dl>
        <dt>Destination</dt>
        <dd>Miami</dd>
        <dt>Guests</dt>
        <dd>8</dd>
        <dt>Interest</dt>
        <dd>Yacht</dd>
        <dt>Date</dt>
        <dd>Saturday</dd>
      </dl>
      <button onClick={onCreate}>
        Crear lead <Plus />
      </button>
    </section>
  );
}
