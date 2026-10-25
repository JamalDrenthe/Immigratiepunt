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

export type PayoutRecord = {
  id: string;
  helperEmail: string;
  amount: number;
  letterCount: number;
  iban: string;
  status: "uitbetaald" | "in_behandeling";
  date: string;
};

export type IntegrationProfile = {
  userEmail: string;
  bsnAppointmentDate?: string;
  bsnStatus: "in_afwachting" | "gepland" | "afgerond";
  bsnCity?: string;
  bankAccountStatus: "in_afwachting" | "bsn_benodigd" | "actief";
  bankIban?: string;
  housingCityPreference?: string;
  housingBudget?: string;
  housingType?: string;
  housingStatus: "zoekende" | "begeleiding_actief" | "woning_gevonden";
  workCvUploaded?: boolean;
  workSector?: string;
  workStatus: "cv_voorbereiding" | "solliciteren" | "baan_gevonden";
};

export type UrgentieServiceRequest = {
  id: string;
  userEmail: string;
  userName: string;
  type: "brief_schrijven" | "belletje_doen" | "dossier_screening" | "loket_begeleiding" | "anders";
  title: string;
  description: string;
  targetOrganization: string;
  urgency: "normaal" | "spoed" | "zeer_dringend";
  cost: number;
  status: "in_behandeling" | "afgerond" | "in_afwachting_reactie";
  createdAt: number;
  responseNotes?: string;
};

export type AccountSubscription = {
  userEmail: string;
  planType: "immigrant_standaard" | "helper_gift" | "zakelijke_urgentie";
  status: "actief" | "proefperiode" | "gepauzeerd";
  monthlyFee: number;
  trialEndsAt?: string;
  walletBalance: number;
  spentOnServices: number;
  autoRenew: boolean;
  paymentMethod: string;
  registeredAt: number;
};

export type OnboardingData = {
  userEmail: string;
  completed: boolean;
  completedAt?: string;
  // Deel 1: Intake Vragenlijst
  originCountry: string;
  preferredLanguage: string;
  stayGoal: string;
  currentHousing: string;
  bsnStatus: string;
  hasDutchBank: boolean;
  employmentStatus: string;
  // Deel 2: Psychologische & Welzijnstest
  stressLevel: number; // 1-5
  resilienceRating: number; // 1-5
  adaptationComfort: number; // 1-5
  needsMentalSupport: boolean;
  supportIntensity: "zelfstandig" | "lichte_coaching" | "intensieve_begeleiding";
  additionalNotes?: string;
};

export type PotjeGrant = {
  id: string;
  category: "sociale_zekerheid" | "school_onderwijs" | "ind_leges" | "diploma_vertaling" | "juridisch";
  title: string;
  provider: string;
  amountIndication: string;
  frequency: "maandelijks" | "eenmalig" | "per_kind" | "per_aanvraag";
  description: string;
  eligibility: string[];
  documentsNeeded: string[];
  targetAudience: string;
  officialLink?: string;
  iconType: "wallet" | "school" | "passport" | "graduation" | "scale" | "heart";
};

export type PotjeApplication = {
  id: string;
  userEmail: string;
  userName: string;
  potjeId: string;
  potjeTitle: string;
  notes: string;
  status: "ingediend" | "in_behandeling" | "goedgekeurd" | "afgerond";
  createdAt: number;
  consultantNotes?: string;
};

// Local storage fallback keys
const LS_REGISTRATIONS = "ip_registrations_cache";
const LS_HELPERS = "ip_helpers_cache";
const LS_LETTERS = "ip_letters_cache";
const LS_PAYOUTS = "ip_payouts_cache";
const LS_INTEGRATION_PROFILES = "ip_integration_profiles_cache";

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

export function fetchLettersForNewcomer(recipientName?: string): LetterLogDoc[] {
  const all = getLocal<LetterLogDoc>(LS_LETTERS);
  if (recipientName) {
    const queryName = recipientName.toLowerCase();
    const matched = all.filter((l) => l.recipientName.toLowerCase().includes(queryName));
    if (matched.length > 0) return matched;
  }

  // Fallback seed letters for Fatima Al-Mansoor or default newcomer
  const defaultLetters: LetterLogDoc[] = [
    {
      id: "let-seed-1",
      helperEmail: "jan.devries@demo.nl",
      sender: "Gemeente Amsterdam (Burgerzaken)",
      recipientName: recipientName || "Fatima Al-Mansoor",
      dateReceived: "10-10-2026",
      status: "binnengekomen",
      notes: "Afspraakbevestiging BSN inschrijving balie Amstel 1",
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: "let-seed-2",
      helperEmail: "jan.devries@demo.nl",
      sender: "Immigratie- en Naturalisatiedienst (IND)",
      recipientName: recipientName || "Fatima Al-Mansoor",
      dateReceived: "08-10-2026",
      status: "binnengekomen",
      notes: "Bevestiging ontvangst aanvraag verblijfsdocument",
      createdAt: Date.now() - 86400000 * 4,
    },
    {
      id: "let-seed-3",
      helperEmail: "jan.devries@demo.nl",
      sender: "Belastingdienst",
      recipientName: recipientName || "Fatima Al-Mansoor",
      dateReceived: "03-10-2026",
      status: "opgehaald",
      notes: "Officiële welkomstbrief en toelichting toeslagen",
      createdAt: Date.now() - 86400000 * 9,
    },
  ];

  if (all.length === 0) {
    saveLocal(LS_LETTERS, defaultLetters);
  }
  return defaultLetters;
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
// Payout History
// -------------------------------------------------------------
const SEED_PAYOUTS: PayoutRecord[] = [
  {
    id: "pay-1",
    helperEmail: "jan.devries@demo.nl",
    amount: 22.5,
    letterCount: 11,
    iban: "NL91 ABNA 0412 3456 78",
    status: "uitbetaald",
    date: "01-10-2026",
  },
  {
    id: "pay-2",
    helperEmail: "jan.devries@demo.nl",
    amount: 15.0,
    letterCount: 8,
    iban: "NL91 ABNA 0412 3456 78",
    status: "uitbetaald",
    date: "01-09-2026",
  },
];

export function fetchPayoutsForHelper(helperEmail: string): PayoutRecord[] {
  const all = getLocal<PayoutRecord>(LS_PAYOUTS);
  const userPayouts = all.filter((p) => p.helperEmail.toLowerCase() === helperEmail.toLowerCase());
  if (userPayouts.length > 0) return userPayouts;

  if (helperEmail.toLowerCase() === "jan.devries@demo.nl") {
    saveLocal(LS_PAYOUTS, SEED_PAYOUTS);
    return SEED_PAYOUTS;
  }
  return [];
}

export function requestPayout(
  helperEmail: string,
  amount: number,
  letterCount: number,
  iban: string
): PayoutRecord {
  const newPayout: PayoutRecord = {
    id: "pay-" + Date.now(),
    helperEmail,
    amount,
    letterCount,
    iban,
    status: "in_behandeling",
    date: new Date().toLocaleDateString("nl-NL"),
  };
  const all = getLocal<PayoutRecord>(LS_PAYOUTS);
  saveLocal(LS_PAYOUTS, [newPayout, ...all]);
  return newPayout;
}

// -------------------------------------------------------------
// Integration Profile Management (BSN, Bank, Housing, Work)
// -------------------------------------------------------------
const DEFAULT_INTEGRATION_PROFILE: IntegrationProfile = {
  userEmail: "fatima.almansoor@demo.nl",
  bsnAppointmentDate: "2026-10-24",
  bsnStatus: "gepland",
  bsnCity: "Gemeente Amsterdam (Burgerzaken Amstel 1)",
  bankAccountStatus: "in_afwachting",
  bankIban: "",
  housingCityPreference: "Amsterdam / Utrecht",
  housingBudget: "€ 850 - € 1.200 / maand",
  housingType: "Appartement of Studio",
  housingStatus: "begeleiding_actief",
  workCvUploaded: true,
  workSector: "Administratie & Klantenservice",
  workStatus: "cv_voorbereiding",
};

export function fetchIntegrationProfile(userEmail: string): IntegrationProfile {
  const all = getLocal<IntegrationProfile>(LS_INTEGRATION_PROFILES);
  const found = all.find((p) => p.userEmail.toLowerCase() === userEmail.toLowerCase());
  if (found) return found;

  if (userEmail.toLowerCase() === "fatima.almansoor@demo.nl") {
    return DEFAULT_INTEGRATION_PROFILE;
  }

  return {
    userEmail,
    bsnStatus: "in_afwachting",
    bankAccountStatus: "bsn_benodigd",
    housingStatus: "zoekende",
    workStatus: "cv_voorbereiding",
  };
}

export function saveIntegrationProfile(profile: IntegrationProfile): void {
  const all = getLocal<IntegrationProfile>(LS_INTEGRATION_PROFILES);
  const filtered = all.filter((p) => p.userEmail.toLowerCase() !== profile.userEmail.toLowerCase());
  saveLocal(LS_INTEGRATION_PROFILES, [profile, ...filtered]);
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

// -------------------------------------------------------------
// Subscriptions, Zakelijke Urgentieregeling & Dienstensaldo
// -------------------------------------------------------------
const LS_SUBSCRIPTIONS = "ip_subscriptions_cache";
const LS_URGENTIE_REQUESTS = "ip_urgentie_requests_cache";
const LS_ONBOARDING = "ip_onboarding_cache";

export function fetchSubscriptionForUser(userEmail: string, role: string = "newcomer"): AccountSubscription {
  const all = getLocal<AccountSubscription>(LS_SUBSCRIPTIONS);
  const found = all.find((s) => s.userEmail.toLowerCase() === userEmail.toLowerCase());
  if (found) return found;

  // Defaults per role
  let defaultSub: AccountSubscription;
  if (role === "helper") {
    defaultSub = {
      userEmail,
      planType: "helper_gift",
      status: "actief",
      monthlyFee: 5,
      walletBalance: 0,
      spentOnServices: 0,
      autoRenew: true,
      paymentMethod: "SEPA Automatische Incasso",
      registeredAt: Date.now() - 86400000 * 14,
    };
  } else {
    // Immigrant / Newcomer
    defaultSub = {
      userEmail,
      planType: "immigrant_standaard",
      status: "proefperiode",
      monthlyFee: 0, // Eerste 2 maanden gratis
      trialEndsAt: "Nog 48 dagen (eerste 2 maanden gratis, daarna € 300/mnd)",
      walletBalance: 0,
      spentOnServices: 0,
      autoRenew: true,
      paymentMethod: "iDEAL / SEPA (na proefperiode)",
      registeredAt: Date.now() - 86400000 * 12,
    };
  }

  saveLocal(LS_SUBSCRIPTIONS, [defaultSub, ...all]);
  return defaultSub;
}

export function saveSubscription(sub: AccountSubscription): void {
  const all = getLocal<AccountSubscription>(LS_SUBSCRIPTIONS);
  const filtered = all.filter((s) => s.userEmail.toLowerCase() !== sub.userEmail.toLowerCase());
  saveLocal(LS_SUBSCRIPTIONS, [sub, ...filtered]);
}

const SEED_URGENTIE_REQUESTS: UrgentieServiceRequest[] = [
  {
    id: "urg-1",
    userEmail: "fatima.almansoor@demo.nl",
    userName: "Fatima Al-Mansoor",
    type: "brief_schrijven",
    title: "Bezwaarschrift legesverrekening gemeente",
    description: "Opstellen van een formele juridische brief aan de Gemeente Amsterdam voor restitutie van dubbel gefactureerde administratiekosten.",
    targetOrganization: "Gemeente Amsterdam (Burgerzaken)",
    urgency: "normaal",
    cost: 45,
    status: "afgerond",
    createdAt: Date.now() - 86400000 * 4,
    responseNotes: "Brief verzonden naar Burgerzaken loket Amstel. Ontvangstbevestiging gearchiveerd in documentenkluis.",
  },
  {
    id: "urg-2",
    userEmail: "fatima.almansoor@demo.nl",
    userName: "Fatima Al-Mansoor",
    type: "belletje_doen",
    title: "Telefonisch escalatiegesprek IND status",
    description: "Telefonische navraag bij de IND over vertraging in de uitgifte van de verblijfspas en spoednotitie aangemaakt.",
    targetOrganization: "Immigratie- en Naturalisatiedienst (IND)",
    urgency: "spoed",
    cost: 35,
    status: "afgerond",
    createdAt: Date.now() - 86400000 * 2,
    responseNotes: "Gesproken met IND behandelaar Jansen. Verblijfsdocument is vrijgegeven voor afhaallocatie Amsterdam.",
  },
];

export function fetchUrgentieRequests(userEmail?: string): UrgentieServiceRequest[] {
  const all = getLocal<UrgentieServiceRequest>(LS_URGENTIE_REQUESTS);
  if (all.length === 0) {
    saveLocal(LS_URGENTIE_REQUESTS, SEED_URGENTIE_REQUESTS);
    return userEmail
      ? SEED_URGENTIE_REQUESTS.filter((r) => r.userEmail.toLowerCase() === userEmail.toLowerCase())
      : SEED_URGENTIE_REQUESTS;
  }
  return userEmail
    ? all.filter((r) => r.userEmail.toLowerCase() === userEmail.toLowerCase())
    : all;
}

export function createUrgentieRequest(
  req: Omit<UrgentieServiceRequest, "id" | "createdAt">
): { request: UrgentieServiceRequest; error?: string } {
  // Deduct from user subscription wallet if zakelijke urgentie
  const sub = fetchSubscriptionForUser(req.userEmail);
  if (sub.walletBalance < req.cost) {
    return {
      request: {} as UrgentieServiceRequest,
      error: `Onvoldoende dienstentegoed (€ ${sub.walletBalance.toFixed(2)} beschikbaar, service kost € ${req.cost.toFixed(2)}). Waardeer eerst je accountsaldo op.`,
    };
  }

  // Deduct
  sub.walletBalance -= req.cost;
  sub.spentOnServices = (sub.spentOnServices || 0) + req.cost;
  saveSubscription(sub);

  const newReq: UrgentieServiceRequest = {
    ...req,
    id: "urg-" + Date.now(),
    createdAt: Date.now(),
  };

  const all = getLocal<UrgentieServiceRequest>(LS_URGENTIE_REQUESTS);
  saveLocal(LS_URGENTIE_REQUESTS, [newReq, ...all]);

  return { request: newReq };
}

export function topUpWallet(userEmail: string, amount: number): AccountSubscription {
  const sub = fetchSubscriptionForUser(userEmail);
  sub.walletBalance += amount;
  if (sub.planType !== "zakelijke_urgentie") {
    sub.planType = "zakelijke_urgentie";
    sub.monthlyFee = 500;
  }
  saveSubscription(sub);
  return sub;
}

// -------------------------------------------------------------
// Immigrant Onboarding & Psychologische Welzijnstest
// -------------------------------------------------------------
export function fetchOnboardingData(userEmail: string): OnboardingData {
  const all = getLocal<OnboardingData>(LS_ONBOARDING);
  const found = all.find((o) => o.userEmail.toLowerCase() === userEmail.toLowerCase());
  if (found) return found;

  const defaultOnboarding: OnboardingData = {
    userEmail,
    completed: false,
    originCountry: "Syrië",
    preferredLanguage: "Arabisch / Engels",
    stayGoal: "Arbeid & Vestiging",
    currentHousing: "Tijdelijk verblijf bij kennissen",
    bsnStatus: "Afspraak ingepland bij Burgerzaken",
    hasDutchBank: false,
    employmentStatus: "Werkzoekend (ervaring in administratie)",
    stressLevel: 3,
    resilienceRating: 4,
    adaptationComfort: 3,
    needsMentalSupport: false,
    supportIntensity: "lichte_coaching",
    additionalNotes: "",
  };

  saveLocal(LS_ONBOARDING, [defaultOnboarding, ...all]);
  return defaultOnboarding;
}

export function saveOnboardingData(data: OnboardingData): void {
  const all = getLocal<OnboardingData>(LS_ONBOARDING);
  const filtered = all.filter((o) => o.userEmail.toLowerCase() !== data.userEmail.toLowerCase());
  saveLocal(LS_ONBOARDING, [data, ...filtered]);
}

// -------------------------------------------------------------
// Immigrant Subsidie & Tegemoetkomingen "Potjes"
// -------------------------------------------------------------
const LS_POTJES_APPLICATIONS = "ip_potjes_applications_cache";

export const SEED_POTJES: PotjeGrant[] = [
  // 1. Sociale Zekerheid & Toeslagen
  {
    id: "potje-zorgtoeslag",
    category: "sociale_zekerheid",
    title: "Zorgtoeslag & Huurtoeslag",
    provider: "Dienst Toeslagen (Belastingdienst)",
    amountIndication: "Tot € 420,- / maand",
    frequency: "maandelijks",
    description: "Directe maandelijkse financiële bijdrage vanuit de Rijksoverheid om de kosten van een Nederlandse basiszorgverzekering en zelfstandige huurwoning betaalbaar te houden.",
    eligibility: [
      "In bezit van een BSN en Nederlandse IBAN",
      "Nederlandse basiszorgverzekering afgesloten",
      "Toetsingsinkomen onder de wettelijke vermogens- en inkomensgrens",
      "Zelfstandige huurwoning met geregistreerd huurcontract (voor huurtoeslag)",
    ],
    documentsNeeded: ["BSN registratiebevestiging", "Nederlandse IBAN", "Huurcontract (indien huur)", "DigiD"],
    targetAudience: "Alle nieuwkomers met een laag tot modaal inkomen",
    officialLink: "https://toeslagen.nl",
    iconType: "wallet",
  },
  {
    id: "potje-bijzondere-bijstand",
    category: "sociale_zekerheid",
    title: "Bijzondere Bijstand Noodzakelijke Kosten",
    provider: "Lokale Gemeente (Sociale Dienst)",
    amountIndication: "€ 350 - € 1.500,- eenmalig",
    frequency: "eenmalig",
    description: "Gemeentelijke vergoeding voor onvoorziene, noodzakelijke kosten die je zelf niet kunt dragen, zoals leges voor verblijfsdocumenten, eerste inrichtingskosten, of beëdigde aktes.",
    eligibility: [
      "Ingeschreven in de gemeente (ook via briefadres)",
      "Inkomen rond het sociaal minimum (bijstandsniveau)",
      "Kosten zijn noodzakelijk en kunnen niet uit eigen middelen worden voldaan",
    ],
    documentsNeeded: ["Kopie paspoort/ID", "Bankafschriften laatste 3 maanden", "Factuur of offerte van de kosten"],
    targetAudience: "Nieuwkomers in een financieel kwetsbare startfase",
    iconType: "heart",
  },
  {
    id: "potje-kindgebonden-budget",
    category: "sociale_zekerheid",
    title: "Kindgebonden Budget & Kinderbijslag",
    provider: "Sociale Verzekeringsbank (SVB) & Toeslagen",
    amountIndication: "Tot € 380,- per kind / maand",
    frequency: "per_kind",
    description: "Financiële bijdrage van de Nederlandse overheid voor gezinnen met kinderen tot 18 jaar ter dekking van levensonderhoud, kleding en verzorging.",
    eligibility: [
      "Wettelijk verblijf in Nederland van ouder en kind",
      "Kind woont bij ouder of staat geregistreerd op het adres",
      "Geldige BSN-inschrijving van de gezinsleden",
    ],
    documentsNeeded: ["Geboorteakte kind(eren)", "BSN bewijzen", "Bankrekeningnummer"],
    targetAudience: "Nieuwkomers met minderjarige kinderen",
    iconType: "heart",
  },

  // 2. School & Onderwijs
  {
    id: "potje-stichting-leergeld",
    category: "school_onderwijs",
    title: "Stichting Leergeld & Kindpakket",
    provider: "Stichting Leergeld Nederland",
    amountIndication: "€ 300 - € 900,- per kind / jaar",
    frequency: "per_kind",
    description: "Voorkomt dat kinderen uit gezinnen met weinig geld worden buitengesloten. Vergoedt schoolspullen, schoollaptop, rekenmachine, schoolreisjes, een fiets voor de middelbare school en sport-/muziekcontributie.",
    eligibility: [
      "Kinderen in de leeftijd van 4 tot 18 jaar",
      "Gezinsinkomen tot maximaal 120-130% van het sociaal minimum",
      "Schoolgaand in het basis- of voortgezet onderwijs",
    ],
    documentsNeeded: ["Inkomensspecificatie of bewijs van bijstand/toeslag", "Schoolinschrijving kind", "Factuur/offerte schoolspullen"],
    targetAudience: "Gezinnen met schoolgaande kinderen",
    officialLink: "https://leergeld.nl",
    iconType: "school",
  },
  {
    id: "potje-duo-inburgering",
    category: "school_onderwijs",
    title: "DUO Inburgeringslening & Taalsubsidie",
    provider: "Dienst Uitvoering Onderwijs (DUO)",
    amountIndication: "Tot € 10.000,- budget",
    frequency: "eenmalig",
    description: "Overheidsbudget voor het volgen van erkende Nederlandse taallessen (A2/B1/B2 niveau), Kennis van de Nederlandse Maatschappij (KNM) en participatieverklaring. Voor asielstatushouders volledig kwijtgescholden; voor overige migranten een zeer gunstige sociale lening.",
    eligibility: [
      "Inburgeringsplichtig of vrijwillig inburgeraar in Nederland",
      "Taalschool met het officiële keurmerk 'Blik op Werk'",
      "Aanvraag via DUO portaal",
    ],
    documentsNeeded: ["DUO beschikking inburgering", "Geldig verblijfsdocument / paspoort", "Offerte taalschool"],
    targetAudience: "Alle nieuwkomers die Nederlands willen of moeten leren",
    officialLink: "https://inburgeren.nl",
    iconType: "school",
  },

  // 3. Diploma Waardering & Vertaling
  {
    id: "potje-idw-diploma",
    category: "diploma_vertaling",
    title: "IDW Internationale Diplomawaardering",
    provider: "Nuffic & SBB (Ministerie van OCW)",
    amountIndication: "100% vergoed (€ 150,- subsidie)",
    frequency: "per_aanvraag",
    description: "Officiële verklaring waarin staat met welk Nederlands onderwijsniveau jouw buitenlandse diploma (middelbare school, bachelor of master) vergelijkbaar is. Essentieel voor werkgevers en vervolgopleidingen. Volledig kosteloos voor inburgeraars en statushouders.",
    eligibility: [
      "In bezit van een officieel buitenlands schooldiploma of getuigschrift",
      "Originele cijferlijst en vakkenoverzicht aanwezig",
      "Geregistreerd in Nederland",
    ],
    documentsNeeded: ["Kopie origineel diploma", "Cijferlijst / Transcript of Records", "Vertaling (indien niet in EN/FR/DE/NL)"],
    targetAudience: "Nieuwkomers met buitenlandse opleiding of beroepskwalificatie",
    officialLink: "https://idw.nl",
    iconType: "graduation",
  },
  {
    id: "potje-vertalingen-aktes",
    category: "diploma_vertaling",
    title: "Vergoeding Beëdigde Vertalingen Documenten",
    provider: "Gemeente / UWV Participatiebudget",
    amountIndication: "Tot € 500,- vergoeding",
    frequency: "per_aanvraag",
    description: "Subsidie voor het beëdigd laten vertalen van officiële aktes (geboorteakte, huwelijksakte, echtscheidingsvonnis, diploma's) door een in het register (Wbtv) ingeschreven beëdigde vertaler.",
    eligibility: [
      "Documenten vereist voor BRP-inschrijving, IND-aanvraag of toelating tot de arbeidsmarkt",
      "Laag inkomen of begeleidingstraject via gemeente / UWV",
    ],
    documentsNeeded: ["Scan van de originele akte(s)", "Offerte van beëdigd vertaler", "Aanvraagformulier bijzondere bijstand"],
    targetAudience: "Nieuwkomers met documenten in niet-Europese talen",
    iconType: "graduation",
  },

  // 4. IND & Legescompensatie
  {
    id: "potje-ind-legesvrijstelling",
    category: "ind_leges",
    title: "IND Legesvrijstelling Onvermogenden",
    provider: "Immigratie- en Naturalisatiedienst (IND)",
    amountIndication: "100% kwijtschelding (€ 210 - € 1.200,-)",
    frequency: "per_aanvraag",
    description: "Vrijstelling of kwijtschelding van de hoge legeskosten bij aanvragen voor bepaalde humanitaire verblijfsvergunningen, artikel 8 EVRM (gezinsleven) of medische behandeling, indien kan worden aangetoond dat je onder het bestaansminimum leeft.",
    eligibility: [
      "Aanvraag valt onder een categorie waarin legesvrijstelling wettelijk is toegestaan",
      "Aantoonbaar geen eigen inkomsten of vermogen boven de bijstandsnorm",
      "Formulier 'Beroep op vrijstelling van leges' bijgevoegd bij IND-aanvraag",
    ],
    documentsNeeded: ["Inkomens- en vermogensverklaring", "Bankafschriften", "IND aanvraagformulier"],
    targetAudience: "Nieuwkomers met gezins- of humanitaire verblijfsprocedures",
    officialLink: "https://ind.nl",
    iconType: "passport",
  },

  // 5. Juridische Ondersteuning & Rechtsbijstand
  {
    id: "potje-gesubsidieerde-rechtsbijstand",
    category: "juridisch",
    title: "Gesubsidieerde Rechtsbijstand (Toevoeging)",
    provider: "Raad voor Rechtsbijstand (RvR)",
    amountIndication: "Advocaatkosten 90-95% vergoed",
    frequency: "per_aanvraag",
    description: "De overheid betaalt het grootste deel van de advocaatkosten bij juridische geschillen, zoals bezwaar tegen een IND-afwijzing, huurconflicten of arbeidsgeschillen. Je betaalt enkel een kleine inkomensafhankelijke eigen bijdrage (vanaf ca. € 160,-).",
    eligibility: [
      "Inkomen en vermogen onder de grens van de Wet op de rechtsbijstand",
      "Juridisch geschil met gegronde kans van slagen",
      "Ingediend via een erkende toevoegingsadvocaat",
    ],
    documentsNeeded: ["Inkomensverklaring Belastingdienst (of peiljaarverlegging)", "IND-besluit of juridische correspondentie", "Diagnosedocument Juridisch Loket"],
    targetAudience: "Nieuwkomers met IND-bezwaar, huurconflict of arbeidsconflict",
    officialLink: "https://rvr.org",
    iconType: "scale",
  },
  {
    id: "potje-juridisch-loket",
    category: "juridisch",
    title: "Gratis Advies & Eerstelijnscheck",
    provider: "Het Juridisch Loket",
    amountIndication: "100% Gratis + € 61,- korting op advocaat",
    frequency: "per_aanvraag",
    description: "Onafhankelijk gratis juridisch advies over verblijfsrechten, contracten, arbeid en huurbescherming. Bij doorverwijzing naar een advocaat ontvang je tevens een wettelijke korting van € 61,- op de eigen bijdrage.",
    eligibility: [
      "Iedereen met een inkomen onder de toevoegingsgrens",
      "Eerstelijns adviesgesprek telefonisch, online of op inlooplocatie",
    ],
    documentsNeeded: ["Brief of contract waar het geschil over gaat", "Identiteitsbewijs"],
    targetAudience: "Alle nieuwkomers met vragen over hun rechten in Nederland",
    officialLink: "https://juridischloket.nl",
    iconType: "scale",
  },
];

export function fetchAvailablePotjes(): PotjeGrant[] {
  return SEED_POTJES;
}

export function fetchPotjeApplications(userEmail?: string): PotjeApplication[] {
  const all = getLocal<PotjeApplication>(LS_POTJES_APPLICATIONS);
  if (all.length === 0) {
    const seedApps: PotjeApplication[] = [
      {
        id: "pot-app-1",
        userEmail: "fatima.almansoor@demo.nl",
        userName: "Fatima Al-Mansoor",
        potjeId: "potje-zorgtoeslag",
        potjeTitle: "Zorgtoeslag & Huurtoeslag",
        notes: "Aanvraag voor zorgtoeslag na activering BSN en Nederlandse IBAN bij Xabi World.",
        status: "goedgekeurd",
        createdAt: Date.now() - 86400000 * 5,
        consultantNotes: "Toeslag toegekend door Dienst Toeslagen. Maandelijkse uitbetaling van ca. € 123,- gestart.",
      },
    ];
    saveLocal(LS_POTJES_APPLICATIONS, seedApps);
    return userEmail ? seedApps.filter((a) => a.userEmail.toLowerCase() === userEmail.toLowerCase()) : seedApps;
  }
  return userEmail ? all.filter((a) => a.userEmail.toLowerCase() === userEmail.toLowerCase()) : all;
}

export function submitPotjeApplication(
  app: Omit<PotjeApplication, "id" | "createdAt" | "status">
): PotjeApplication {
  const newApp: PotjeApplication = {
    ...app,
    id: "pot-app-" + Date.now(),
    status: "in_behandeling",
    createdAt: Date.now(),
    consultantNotes: "Aanvraag ontvangen door Immigratiepunt consulententeam. Dossiercheck gestart.",
  };

  const all = getLocal<PotjeApplication>(LS_POTJES_APPLICATIONS);
  saveLocal(LS_POTJES_APPLICATIONS, [newApp, ...all]);
  return newApp;
}

// -------------------------------------------------------------
// VACATURES & CAREER APPLICATIONS (NO CURE, NO PAY)
// -------------------------------------------------------------
export interface JobApplicationDoc {
  id?: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  hoursPerWeek: string;
  motivation: string;
  trackrecord?: string;
  status: "nieuw" | "gesprek_gepland" | "aangenomen" | "afgewezen";
  createdAt: number;
}

const LS_JOB_APPLICATIONS = "immigratiepunt_job_applications";

export function fetchJobApplications(): JobApplicationDoc[] {
  return getLocal<JobApplicationDoc>(LS_JOB_APPLICATIONS);
}

export function submitJobApplication(
  application: Omit<JobApplicationDoc, "id" | "status" | "createdAt">
): JobApplicationDoc {
  const newDoc: JobApplicationDoc = {
    ...application,
    id: "job-app-" + Date.now(),
    status: "nieuw",
    createdAt: Date.now(),
  };

  const all = getLocal<JobApplicationDoc>(LS_JOB_APPLICATIONS);
  saveLocal(LS_JOB_APPLICATIONS, [newDoc, ...all]);
  return newDoc;
}


