import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export const firebaseConfig = {
  projectId: "immigratiepunt-dev",
  appId: "1:741974780571:web:67cd02dbf60941e180743e",
  storageBucket: "immigratiepunt-dev.firebasestorage.app",
  apiKey: "AIzaSyBc_TwM4VL24CldKwG3pHu6bWbXmha9k2w",
  authDomain: "immigratiepunt-dev.firebaseapp.com",
  messagingSenderId: "741974780571",
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export { signInWithPopup, firebaseSignOut };

// Types
export type RegistrationDoc = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryOfOrigin: string;
  bankingAssistance: boolean;
  housingSupport: boolean;
  employmentAssistance: boolean;
  administrativeSupport: boolean;
  status: "nieuw" | "in_behandeling" | "gekoppeld" | "afgerond";
  notes?: string;
  createdAt: string | number;
};

export type HelperDoc = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  monthlyDonation: boolean;
  status: "actief" | "in_afwachting" | "gekoppeld";
  registeredLettersCount: number;
  matchedNewcomer?: string;
  createdAt: string | number;
};

export type LetterLogDoc = {
  id?: string;
  helperEmail: string;
  sender: string;
  recipientName: string;
  dateReceived: string;
  status?: "binnengekomen" | "doorgestuurd" | "opgehaald";
  notes?: string;
  createdAt: string | number;
};

export type UserDocument = {
  id: string;
  userEmail: string;
  title: string;
  category: "Identiteit & Paspoort" | "Gemeente & BSN" | "IND & Verblijf" | "Huisvesting & Contract" | "Overig";
  status: "goedgekeurd" | "in_behandeling" | "afgekeurd";
  uploadedAt: string;
  fileSize?: string;
};

export type SupportMessage = {
  id: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  message: string;
  status: "open" | "in_behandeling" | "beantwoord";
  reply?: string;
  createdAt: number;
};

export type HelperSettings = {
  email: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  maxCapacity: number;
  isAvailable: boolean;
  iban: string;
  accountHolder: string;
};

export type InAppNotification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  targetRole?: "all" | "admin" | "helper" | "newcomer";
};

// Local storage fallback keys
const LS_REGISTRATIONS = "ip_registrations_cache";
const LS_HELPERS = "ip_helpers_cache";
const LS_LETTERS = "ip_letters_cache";

function getLocal<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocal<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.error("Local storage save error", e);
  }
}

// Initial seed data for demo/mock if empty
const SEED_REGISTRATIONS: RegistrationDoc[] = [
  {
    id: "reg-demo-1",
    firstName: "Fatima",
    lastName: "Al-Mansoor",
    email: "fatima.almansoor@demo.nl",
    phone: "+31 6 12345678",
    countryOfOrigin: "Syria",
    bankingAssistance: true,
    housingSupport: true,
    employmentAssistance: true,
    administrativeSupport: true,
    status: "in_behandeling",
    notes: "Postadres gekoppeld aan Jan de Vries (Amsterdam). Wacht op BSN brief van Gemeente.",
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "reg-demo-2",
    firstName: "Oleksandr",
    lastName: "Petrenko",
    email: "oleksandr.p@demo.nl",
    phone: "+31 6 87654321",
    countryOfOrigin: "Ukraine",
    bankingAssistance: true,
    housingSupport: false,
    employmentAssistance: true,
    administrativeSupport: true,
    status: "nieuw",
    notes: "Zoekt werk in IT/logistiek en bankrekening via Xabi World.",
    createdAt: Date.now() - 86400000 * 1,
  },
];

const SEED_HELPERS: HelperDoc[] = [
  {
    id: "helper-demo-1",
    firstName: "Jan",
    lastName: "de Vries",
    email: "jan.devries@demo.nl",
    phone: "+31 6 11223344",
    city: "Amsterdam",
    monthlyDonation: true,
    status: "actief",
    registeredLettersCount: 7,
    matchedNewcomer: "Fatima Al-Mansoor",
    createdAt: Date.now() - 86400000 * 14,
  },
  {
    id: "helper-demo-2",
    firstName: "Sophie",
    lastName: "Bakker",
    email: "sophie.bakker@demo.nl",
    phone: "+31 6 55667788",
    city: "Rotterdam",
    monthlyDonation: true,
    status: "actief",
    registeredLettersCount: 3,
    matchedNewcomer: "Beschikbaar voor koppeling",
    createdAt: Date.now() - 86400000 * 7,
  },
];

// Firestore CRUD Helpers with Local Resilience
export async function saveRegistration(data: Omit<RegistrationDoc, "id" | "status" | "createdAt">): Promise<RegistrationDoc> {
  const newReg: RegistrationDoc = {
    ...data,
    status: "nieuw",
    createdAt: Date.now(),
  };

  try {
    const docRef = await addDoc(collection(db, "registrations"), {
      ...newReg,
      createdAtServer: serverTimestamp(),
    });
    newReg.id = docRef.id;
  } catch (err) {
    console.warn("Firestore saveRegistration fallback to local:", err);
    newReg.id = "local-" + Date.now();
  }

  // Always update local cache for instant UI availability
  const current = getLocal<RegistrationDoc>(LS_REGISTRATIONS);
  saveLocal(LS_REGISTRATIONS, [newReg, ...current]);
  return newReg;
}

export async function saveHelper(data: Omit<HelperDoc, "id" | "status" | "registeredLettersCount" | "createdAt">): Promise<HelperDoc> {
  const newHelper: HelperDoc = {
    ...data,
    status: "actief",
    registeredLettersCount: 0,
    createdAt: Date.now(),
  };

  try {
    const docRef = await addDoc(collection(db, "helpers"), {
      ...newHelper,
      createdAtServer: serverTimestamp(),
    });
    newHelper.id = docRef.id;
  } catch (err) {
    console.warn("Firestore saveHelper fallback to local:", err);
    newHelper.id = "local-" + Date.now();
  }

  const current = getLocal<HelperDoc>(LS_HELPERS);
  saveLocal(LS_HELPERS, [newHelper, ...current]);
  return newHelper;
}

export async function fetchAllRegistrations(): Promise<RegistrationDoc[]> {
  try {
    const q = query(collection(db, "registrations"), orderBy("createdAtServer", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const items: RegistrationDoc[] = [];
      snap.forEach((d) => {
        const dData = d.data();
        items.push({
          ...(dData as RegistrationDoc),
          id: d.id,
          createdAt: dData.createdAtServer instanceof Timestamp ? dData.createdAtServer.toMillis() : dData.createdAt || Date.now(),
        });
      });
      saveLocal(LS_REGISTRATIONS, items);
      return items;
    }
  } catch (err) {
    console.warn("Firestore fetchAllRegistrations falling back to cache:", err);
  }

  const local = getLocal<RegistrationDoc>(LS_REGISTRATIONS);
  if (local.length > 0) return local;
  saveLocal(LS_REGISTRATIONS, SEED_REGISTRATIONS);
  return SEED_REGISTRATIONS;
}

export async function fetchAllHelpers(): Promise<HelperDoc[]> {
  try {
    const q = query(collection(db, "helpers"), orderBy("createdAtServer", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const items: HelperDoc[] = [];
      snap.forEach((d) => {
        const dData = d.data();
        items.push({
          ...(dData as HelperDoc),
          id: d.id,
          createdAt: dData.createdAtServer instanceof Timestamp ? dData.createdAtServer.toMillis() : dData.createdAt || Date.now(),
        });
      });
      saveLocal(LS_HELPERS, items);
      return items;
    }
  } catch (err) {
    console.warn("Firestore fetchAllHelpers falling back to cache:", err);
  }

  const local = getLocal<HelperDoc>(LS_HELPERS);
  if (local.length > 0) return local;
  saveLocal(LS_HELPERS, SEED_HELPERS);
  return SEED_HELPERS;
}

export async function updateRegistrationStatusInDb(id: string, status: RegistrationDoc["status"], notes?: string): Promise<void> {
  try {
    if (!id.startsWith("local-") && !id.startsWith("reg-demo-")) {
      const ref = doc(db, "registrations", id);
      await updateDoc(ref, { status, ...(notes !== undefined ? { notes } : {}) });
    }
  } catch (err) {
    console.warn("Firestore updateRegistrationStatus fallback:", err);
  }

  const list = getLocal<RegistrationDoc>(LS_REGISTRATIONS);
  const updated = list.map((item) => (item.id === id ? { ...item, status, ...(notes !== undefined ? { notes } : {}) } : item));
  saveLocal(LS_REGISTRATIONS, updated);
}

export async function logLetter(helperEmail: string, sender: string, recipientName: string, notes?: string): Promise<LetterLogDoc> {
  const newLetter: LetterLogDoc = {
    helperEmail,
    sender,
    recipientName,
    notes,
    dateReceived: new Date().toLocaleDateString("nl-NL"),
    createdAt: Date.now(),
  };

  try {
    const ref = await addDoc(collection(db, "letters"), {
      ...newLetter,
      createdAtServer: serverTimestamp(),
    });
    newLetter.id = ref.id;
  } catch (err) {
    console.warn("Firestore logLetter fallback to local:", err);
    newLetter.id = "local-let-" + Date.now();
  }

  const currentLetters = getLocal<LetterLogDoc>(LS_LETTERS);
  saveLocal(LS_LETTERS, [newLetter, ...currentLetters]);

  // Increment helper letters count in local cache
  const helpers = getLocal<HelperDoc>(LS_HELPERS);
  const updatedHelpers = helpers.map((h) =>
    h.email.toLowerCase() === helperEmail.toLowerCase()
      ? { ...h, registeredLettersCount: (h.registeredLettersCount || 0) + 1 }
      : h
  );
  saveLocal(LS_HELPERS, updatedHelpers);

  return newLetter;
}

export function fetchLettersForHelper(helperEmail: string): LetterLogDoc[] {
  const all = getLocal<LetterLogDoc>(LS_LETTERS);
  const forHelper = all.filter((l) => l.helperEmail.toLowerCase() === helperEmail.toLowerCase());
  if (forHelper.length > 0) return forHelper;

  // Default demo letters for Jan de Vries
  if (helperEmail.toLowerCase() === "jan.devries@demo.nl") {
    return [
      {
        id: "l1",
        helperEmail,
        sender: "Gemeente Amsterdam (Burgerzaken)",
        recipientName: "Fatima Al-Mansoor",
        dateReceived: "10-10-2026",
        notes: "Afspraakbevestiging BSN inschrijving",
        createdAt: Date.now() - 86400000 * 2,
      },
      {
        id: "l2",
        helperEmail,
        sender: "Immigratie- en Naturalisatiedienst (IND)",
        recipientName: "Fatima Al-Mansoor",
        dateReceived: "08-10-2026",
        notes: "Ontvangstbevestiging verblijfsdocument",
        createdAt: Date.now() - 86400000 * 4,
      },
      {
        id: "l3",
        helperEmail,
        sender: "Belastingdienst",
        recipientName: "Fatima Al-Mansoor",
        dateReceived: "03-10-2026",
        notes: "Officiële welkomstbrief",
        createdAt: Date.now() - 86400000 * 9,
      },
    ];
  }
  return [];
}

// -------------------------------------------------------------
// Document Management
// -------------------------------------------------------------
const LS_DOCUMENTS = "ip_documents_cache";

const SEED_DOCUMENTS: UserDocument[] = [
  {
    id: "doc-1",
    userEmail: "fatima.almansoor@demo.nl",
    title: "Kopie Paspoort & Visum",
    category: "Identiteit & Paspoort",
    status: "goedgekeurd",
    uploadedAt: "05-10-2026",
    fileSize: "1.8 MB",
  },
  {
    id: "doc-2",
    userEmail: "fatima.almansoor@demo.nl",
    title: "Toestemmingsverklaring Briefadres (Jan de Vries)",
    category: "Gemeente & BSN",
    status: "goedgekeurd",
    uploadedAt: "08-10-2026",
    fileSize: "640 KB",
  },
  {
    id: "doc-3",
    userEmail: "fatima.almansoor@demo.nl",
    title: "Bevestiging Verblijfsaanvraag IND",
    category: "IND & Verblijf",
    status: "in_behandeling",
    uploadedAt: "11-10-2026",
    fileSize: "920 KB",
  },
];

export function fetchDocumentsForUser(userEmail: string): UserDocument[] {
  const all = getLocal<UserDocument>(LS_DOCUMENTS);
  const userDocs = all.filter((d) => d.userEmail.toLowerCase() === userEmail.toLowerCase());
  if (userDocs.length > 0) return userDocs;

  if (userEmail.toLowerCase() === "fatima.almansoor@demo.nl") {
    saveLocal(LS_DOCUMENTS, [...all, ...SEED_DOCUMENTS]);
    return SEED_DOCUMENTS;
  }
  return [];
}

export function saveUserDocument(docData: Omit<UserDocument, "id" | "uploadedAt">): UserDocument {
  const newDoc: UserDocument = {
    ...docData,
    id: "doc-" + Date.now(),
    uploadedAt: new Date().toLocaleDateString("nl-NL"),
  };
  const all = getLocal<UserDocument>(LS_DOCUMENTS);
  saveLocal(LS_DOCUMENTS, [newDoc, ...all]);
  return newDoc;
}

export function deleteUserDocument(id: string): void {
  const all = getLocal<UserDocument>(LS_DOCUMENTS);
  saveLocal(LS_DOCUMENTS, all.filter((d) => d.id !== id));
}

// -------------------------------------------------------------
// Support & Messages
// -------------------------------------------------------------
const LS_MESSAGES = "ip_messages_cache";

const SEED_MESSAGES: SupportMessage[] = [
  {
    id: "msg-1",
    fromEmail: "fatima.almansoor@demo.nl",
    fromName: "Fatima Al-Mansoor",
    subject: "Vraag over brief van Gemeente Amsterdam",
    message: "Ik heb vandaag een brief ontvangen van de gemeente met een afspraakdatum voor de BSN balie. Moet ik zelf nog documenten meenemen behalve mijn paspoort?",
    status: "beantwoord",
    reply: "Beste Fatima, neem je paspoort, de ondertekende briefadresverklaring van Jan en je geboorteakte mee. Wij zijn beschikbaar als je vragen hebt!",
    createdAt: Date.now() - 86400000 * 2,
  },
];

export function fetchSupportMessages(fromEmail?: string): SupportMessage[] {
  const all = getLocal<SupportMessage>(LS_MESSAGES);
  if (all.length === 0) {
    saveLocal(LS_MESSAGES, SEED_MESSAGES);
    return fromEmail
      ? SEED_MESSAGES.filter((m) => m.fromEmail.toLowerCase() === fromEmail.toLowerCase())
      : SEED_MESSAGES;
  }
  return fromEmail
    ? all.filter((m) => m.fromEmail.toLowerCase() === fromEmail.toLowerCase())
    : all;
}

export function sendSupportMessage(msgData: Omit<SupportMessage, "id" | "status" | "createdAt">): SupportMessage {
  const newMsg: SupportMessage = {
    ...msgData,
    id: "msg-" + Date.now(),
    status: "open",
    createdAt: Date.now(),
  };
  const all = getLocal<SupportMessage>(LS_MESSAGES);
  saveLocal(LS_MESSAGES, [newMsg, ...all]);
  return newMsg;
}

export function replySupportMessage(id: string, replyText: string): void {
  const all = getLocal<SupportMessage>(LS_MESSAGES);
  const updated = all.map((m) =>
    m.id === id ? { ...m, status: "beantwoord" as const, reply: replyText } : m
  );
  saveLocal(LS_MESSAGES, updated);
}

// -------------------------------------------------------------
// Helper Settings & Payout Data
// -------------------------------------------------------------
const LS_HELPER_SETTINGS = "ip_helper_settings_cache";

const DEFAULT_HELPER_SETTINGS: HelperSettings = {
  email: "jan.devries@demo.nl",
  street: "Hoofdstraat",
  houseNumber: "42",
  postalCode: "1011 AA",
  city: "Amsterdam",
  maxCapacity: 2,
  isAvailable: true,
  iban: "NL91 ABNA 0412 3456 78",
  accountHolder: "J. de Vries",
};

export function fetchHelperSettings(helperEmail: string): HelperSettings {
  const all = getLocal<HelperSettings>(LS_HELPER_SETTINGS);
  const found = all.find((s) => s.email.toLowerCase() === helperEmail.toLowerCase());
  if (found) return found;

  if (helperEmail.toLowerCase() === "jan.devries@demo.nl") {
    return DEFAULT_HELPER_SETTINGS;
  }
  return {
    email: helperEmail,
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "Nederland",
    maxCapacity: 1,
    isAvailable: true,
    iban: "",
    accountHolder: "",
  };
}

export function saveHelperSettings(settings: HelperSettings): void {
  const all = getLocal<HelperSettings>(LS_HELPER_SETTINGS);
  const filtered = all.filter((s) => s.email.toLowerCase() !== settings.email.toLowerCase());
  saveLocal(LS_HELPER_SETTINGS, [settings, ...filtered]);
}

// -------------------------------------------------------------
// Matching: Match Newcomer to Helper
// -------------------------------------------------------------
export async function matchNewcomerToHelper(
  registrationId: string,
  helperEmail: string,
  helperName: string,
  newcomerName: string
): Promise<void> {
  // 1. Update registration
  await updateRegistrationStatusInDb(
    registrationId,
    "gekoppeld",
    `Gekoppeld aan postadres-helper ${helperName} (${helperEmail}).`
  );

  // 2. Update helper
  const helpers = getLocal<HelperDoc>(LS_HELPERS);
  const updatedHelpers = helpers.map((h) =>
    h.email.toLowerCase() === helperEmail.toLowerCase()
      ? { ...h, status: "gekoppeld" as const, matchedNewcomer: newcomerName }
      : h
  );
  saveLocal(LS_HELPERS, updatedHelpers);
}

// -------------------------------------------------------------
// Letter status updating
// -------------------------------------------------------------
export function updateLetterStatus(
  id: string,
  status: "binnengekomen" | "doorgestuurd" | "opgehaald"
): void {
  const all = getLocal<LetterLogDoc>(LS_LETTERS);
  const updated = all.map((l) => (l.id === id ? { ...l, status } : l));
  saveLocal(LS_LETTERS, updated);
}

// -------------------------------------------------------------
// In-App Notifications
// -------------------------------------------------------------
const LS_NOTIFICATIONS = "ip_notifications_cache";

const SEED_NOTIFICATIONS: InAppNotification[] = [
  {
    id: "notif-1",
    title: "Postadres Geverifieerd",
    message: "Jouw postadres-koppeling is succesvol geverifieerd door Immigratiepunt.",
    date: "Vandaag",
    read: false,
    targetRole: "all",
  },
  {
    id: "notif-2",
    title: "Gemeente Brief Binnengekomen",
    message: "Er is een nieuw poststuk geregistreerd voor afspraakbevestiging BSN balie.",
    date: "Gisteren",
    read: false,
    targetRole: "newcomer",
  },
  {
    id: "notif-3",
    title: "Maandelijkse Postvergoeding",
    message: "Je hebt deze maand 7 brieven verwerkt. Je netto vergoeding staat klaar.",
    date: "3 dagen geleden",
    read: true,
    targetRole: "helper",
  },
];

export function fetchNotificationsForRole(role: "admin" | "helper" | "newcomer"): InAppNotification[] {
  const all = getLocal<InAppNotification>(LS_NOTIFICATIONS);
  if (all.length === 0) {
    saveLocal(LS_NOTIFICATIONS, SEED_NOTIFICATIONS);
    return SEED_NOTIFICATIONS.filter((n) => !n.targetRole || n.targetRole === "all" || n.targetRole === role);
  }
  return all.filter((n) => !n.targetRole || n.targetRole === "all" || n.targetRole === role);
}

export function markNotificationRead(id: string): void {
  const all = getLocal<InAppNotification>(LS_NOTIFICATIONS);
  const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveLocal(LS_NOTIFICATIONS, updated);
}

// -------------------------------------------------------------
// CSV Exporter for Admin Reporting
// -------------------------------------------------------------
export function exportRegistrationsToCsv(registrations: RegistrationDoc[]): void {
  const headers = ["ID", "Voornaam", "Achternaam", "Email", "Telefoon", "Herkomst", "Status", "Bank", "Wonen", "Werk", "BSN", "Aangemaakt"];
  const rows = registrations.map((r) => [
    r.id || "",
    `"${r.firstName}"`,
    `"${r.lastName}"`,
    `"${r.email}"`,
    `"${r.phone}"`,
    `"${r.countryOfOrigin}"`,
    r.status,
    r.bankingAssistance ? "Ja" : "Nee",
    r.housingSupport ? "Ja" : "Nee",
    r.employmentAssistance ? "Ja" : "Nee",
    r.administrativeSupport ? "Ja" : "Nee",
    new Date(r.createdAt).toLocaleDateString("nl-NL"),
  ]);

  const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `immigratiepunt_registraties_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

