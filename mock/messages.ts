import { Conversation } from "@/lib/types";

const seeds = [
  [
    "James Miller",
    "instagram",
    "miami",
    "We are 8 people going to Miami…",
    2,
    "2 min",
  ],
  [
    "Roberto Hernández",
    "whatsapp",
    "riviera-maya",
    "¿Podemos mover la salida a las 14:00?",
    1,
    "8 min",
  ],
  [
    "Sofia Turner",
    "facebook",
    "los-cabos",
    "We would love a sunset cruise.",
    3,
    "12 min",
  ],
  [
    "Emma Collins",
    "instagram",
    "miami",
    "Is dinner onboard possible?",
    0,
    "24 min",
  ],
  [
    "Daniel Ruiz",
    "whatsapp",
    "riviera-maya",
    "Somos 10, llegamos el viernes.",
    4,
    "31 min",
  ],
  [
    "Michael Grant",
    "instagram",
    "los-cabos",
    "Looking for a yacht next Tuesday.",
    1,
    "42 min",
  ],
  [
    "Camila Torres",
    "whatsapp",
    "riviera-maya",
    "Gracias, reviso la propuesta.",
    0,
    "1 h",
  ],
  [
    "Olivia Harris",
    "facebook",
    "miami",
    "Can you arrange airport transport?",
    2,
    "1 h",
  ],
  [
    "Alejandro Vega",
    "whatsapp",
    "los-cabos",
    "Quiero celebrar un cumpleaños.",
    0,
    "2 h",
  ],
  [
    "Lucas Martin",
    "instagram",
    "riviera-maya",
    "Do you have a 60ft yacht?",
    1,
    "2 h",
  ],
  [
    "Charlotte King",
    "instagram",
    "miami",
    "We arrive on November 18.",
    0,
    "3 h",
  ],
  [
    "Fernando Silva",
    "facebook",
    "los-cabos",
    "Necesitamos chef privado.",
    2,
    "3 h",
  ],
  [
    "Isabella Moore",
    "whatsapp",
    "miami",
    "Please send the itinerary.",
    0,
    "4 h",
  ],
  [
    "Mateo García",
    "instagram",
    "riviera-maya",
    "¿Incluye bebidas el charter?",
    1,
    "5 h",
  ],
  [
    "Amelia Wilson",
    "facebook",
    "los-cabos",
    "Our group is six people.",
    0,
    "Ayer",
  ],
  [
    "Nicolás Peña",
    "whatsapp",
    "riviera-maya",
    "Confirmamos para el sábado.",
    0,
    "Ayer",
  ],
  ["Henry Adams", "instagram", "miami", "Could we add a DJ?", 3, "Ayer"],
  [
    "Valentina Cruz",
    "facebook",
    "los-cabos",
    "Busco transporte y cena.",
    0,
    "Ayer",
  ],
] as const;

const assignees = [undefined, "Andrea", undefined, "Sofía", "Matías", "Carlos"];
const statuses = [
  "Nuevo",
  "En conversación",
  "Esperando cliente",
  "Seguimiento",
  "Cerrado",
] as const;

export const conversations: Conversation[] = seeds.map((seed, index) => {
  const [name, channel, destinationId, lastMessage, unread, time] = seed;
  const first = name.split(" ")[0];
  const isJames = index === 0;
  return {
    id: `CONV-${String(index + 1).padStart(3, "0")}`,
    name,
    channel,
    destinationId,
    lastMessage,
    unread,
    time,
    assignee: assignees[index % assignees.length],
    status: statuses[index % statuses.length],
    clientId: index === 1 ? "roberto-hernandez" : undefined,
    lead:
      index === 2
        ? {
            id: "L-1052",
            dates: "20–23 nov",
            guests: 6,
            interests: ["Yacht", "Dining"],
          }
        : undefined,
    identity:
      channel === "whatsapp"
        ? { whatsappPhone: "+1 305 555 0100" }
        : channel === "instagram"
          ? { instagramHandle: `@${name.toLowerCase().replaceAll(" ", ".")}` }
          : { facebookId: `fb_${index + 190}` },
    messages: isJames
      ? [
          {
            id: "j1",
            author: "contact",
            body: "Hi, we are 8 people going to Miami next weekend. We are looking for a yacht.",
            time: "14:22",
          },
          {
            id: "j2",
            author: "agent",
            body: "Absolutely. Do you already know what day you would like the yacht?",
            time: "14:25",
            authorName: "Yacht RM",
          },
          {
            id: "j3",
            author: "contact",
            body: "Saturday afternoon.",
            time: "14:27",
          },
          {
            id: "j4",
            author: "agent",
            body: "Perfect. Are you interested in food, DJ or transport as well?",
            time: "14:29",
            authorName: "Yacht RM",
          },
          {
            id: "j5",
            author: "contact",
            body: "Transport and dinner would be great.",
            time: "14:32",
          },
        ]
      : [
          {
            id: `${index}-1`,
            author: "contact",
            body: lastMessage,
            time: "10:14",
          },
          {
            id: `${index}-2`,
            author: "agent",
            body: `Gracias, ${first}. Permítenos revisar las mejores opciones para ti.`,
            time: "10:18",
            authorName: "Yacht RM",
          },
        ],
  };
});

export const replyTemplates = [
  {
    name: "Disponibilidad",
    text: "Hola {name}, estamos verificando disponibilidad para tu solicitud.",
  },
  {
    name: "Cotización",
    text: "Hola {name}, ya tenemos preparada tu propuesta.",
  },
  {
    name: "Seguimiento",
    text: "Hola {name}, quería saber si pudiste revisar la propuesta.",
  },
  { name: "Confirmación", text: "Tu experiencia quedó confirmada." },
];
