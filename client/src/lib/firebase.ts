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
  notes?: string;
  createdAt: string | number;
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
