/**
 * CRMos REST API — AI Agent Bi-directionele Integratiegids
 * 
 * Verbinding tussen Immigratiepunt en CRMos (Ecosysteem Hub):
 * - Lezen: Universeel zoeken, contacten, teams, deals, kandidaten
 * - Schrijven: Upsert van nieuwkomers, helpers, sollicitaties & gespreksnotities
 */

import type { RegistrationDoc, HelperDoc, JobApplicationDoc } from "./firebase";

export const CRMOS_CONFIG = {
  baseUrl: "https://crmos.one/api/v1",
  localUrl: "http://localhost:5173/api/v1",
  apiKey: "crm_live_master_jamaldrenthe_2026_all_ecosystem",
  systemTag: "#immigratiepunt",
};

// -----------------------------------------------------------------
// CRMos Types
// -----------------------------------------------------------------

export interface CrmosContactUpsertPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  company_tags?: string[];
  tags: string[];
  notes?: string;
  status?: "lead" | "qualified" | "customer" | "archived";
}

export interface CrmosCandidatePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience_years?: number;
  location?: string;
  notes?: string;
}

export interface CrmosDealPayload {
  name: string;
  value: number;
  stage: "lead" | "qualified" | "proposal" | "won" | "lost";
  company_name: string;
  contact_id?: string;
  probability?: number;
}

export interface CrmosActivityPayload {
  contact_id?: string;
  type: "call" | "meeting" | "email" | "note";
  title: string;
  description: string;
  performed_by?: string;
}

export interface CrmosSyncLog {
  id: string;
  type: "contact" | "candidate" | "activity" | "deal";
  entityName: string;
  email: string;
  status: "success" | "pending" | "fallback_local";
  timestamp: number;
  message: string;
}

const LS_CRMOS_LOGS = "crmos_sync_logs";

function getLocalLogs(): CrmosSyncLog[] {
  try {
    const raw = localStorage.getItem(LS_CRMOS_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalLog(log: CrmosSyncLog): void {
  try {
    const current = getLocalLogs();
    localStorage.setItem(LS_CRMOS_LOGS, JSON.stringify([log, ...current.slice(0, 49)]));
  } catch {
    // Ignore storage errors
  }
}

// -----------------------------------------------------------------
// API Request Helper with Fallback Resilience
// -----------------------------------------------------------------

async function crmosRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error?: string }> {
  const url = `${CRMOS_CONFIG.baseUrl}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    "X-CRMOS-API-KEY": CRMOS_CONFIG.apiKey,
    ...(options.headers || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      return {
        data: null,
        error: `HTTP ${res.status}: ${errorText.slice(0, 150)}`,
      };
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      return { data };
    }

    return { data: (await res.text()) as unknown as T };
  } catch (err: any) {
    return {
      data: null,
      error: err.name === "AbortError" ? "CRMos Request Timeout" : (err.message || "Netwerkfout"),
    };
  }
}

// -----------------------------------------------------------------
// 1. DATA OPHALEN & ZOEKEN (GET)
// -----------------------------------------------------------------

/**
 * Universeel Zoeken: Doorzoekt contacten, deals, kandidaten en teams tegelijk
 */
export async function searchCrmos(query: string) {
  if (!query || query.trim().length === 0) return { results: [] };
  const res = await crmosRequest<any>(`/search?q=${encodeURIComponent(query)}`);
  return res.data || { results: [] };
}

/**
 * Contacten ophalen of filteren
 */
export async function fetchCrmosContacts(filterQuery?: string) {
  const queryParam = filterQuery ? `?q=${encodeURIComponent(filterQuery)}` : "";
  const res = await crmosRequest<any[]>(`/contacts${queryParam}`);
  return res.data || [];
}

/**
 * Referral Teams & Kernleiders
 */
export async function fetchCrmosTeams() {
  const res = await crmosRequest<any[]>("/teams");
  return res.data || [];
}

/**
 * Bedrijven & Pipelines
 */
export async function fetchCrmosCompanies() {
  const res = await crmosRequest<any[]>("/companies");
  return res.data || [];
}

/**
 * Deals / Verkoopkansen
 */
export async function fetchCrmosDeals(company?: string) {
  const queryParam = company ? `?company=${encodeURIComponent(company)}` : "";
  const res = await crmosRequest<any[]>(`/deals${queryParam}`);
  return res.data || [];
}

/**
 * No Cure No Pay Sollicitanten & Kandidaten
 */
export async function fetchCrmosCandidates() {
  const res = await crmosRequest<any[]>("/candidates");
  return res.data || [];
}

// -----------------------------------------------------------------
// 2. DATA SCHRIJVEN & VERRIJKEN (POST, PATCH)
// -----------------------------------------------------------------

/**
 * Contact Inschrijven of Slim Verrijken (Upsert)
 */
export async function upsertCrmosContact(contact: CrmosContactUpsertPayload) {
  return crmosRequest<any>("/contacts/upsert", {
    method: "POST",
    body: JSON.stringify(contact),
  });
}

/**
 * Nieuw Contact Aanmaken
 */
export async function createCrmosContact(contact: CrmosContactUpsertPayload) {
  return crmosRequest<any>("/contacts", {
    method: "POST",
    body: JSON.stringify(contact),
  });
}

/**
 * Bestaand Contact Bijwerken
 */
export async function updateCrmosContact(id: string, updates: Partial<CrmosContactUpsertPayload>) {
  return crmosRequest<any>(`/contacts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

/**
 * Deal Inschrijven in de Sales Pipeline
 */
export async function createCrmosDeal(deal: CrmosDealPayload) {
  return crmosRequest<any>("/deals", {
    method: "POST",
    body: JSON.stringify(deal),
  });
}

/**
 * Activiteit / Gespreksnotitie Loggen
 */
export async function logCrmosActivity(activity: CrmosActivityPayload) {
  return crmosRequest<any>("/activities", {
    method: "POST",
    body: JSON.stringify(activity),
  });
}

/**
 * No Cure No Pay Sollicitant Inschrijven in CRMos
 */
export async function createCrmosCandidate(candidate: CrmosCandidatePayload) {
  return crmosRequest<any>("/candidates", {
    method: "POST",
    body: JSON.stringify(candidate),
  });
}

// -----------------------------------------------------------------
// 3. IMMIGRATIEPUNT HIGH-LEVEL SYNC HANDLERS
// -----------------------------------------------------------------

/**
 * Synchroniseert een Immigratiepunt registratie naar CRMos als contact
 */
export async function syncRegistrationToCrmos(reg: RegistrationDoc): Promise<CrmosSyncLog> {
  const services: string[] = [];
  if (reg.bankingAssistance) services.push("Bankrekening");
  if (reg.housingSupport) services.push("Huisvesting");
  if (reg.employmentAssistance) services.push("Werk");
  if (reg.administrativeSupport) services.push("BSN / Gemeente");

  const payload: CrmosContactUpsertPayload = {
    first_name: reg.firstName,
    last_name: reg.lastName,
    email: reg.email,
    phone: reg.phone,
    company: "Immigratiepunt Nieuwkomer Dossier",
    company_tags: [CRMOS_CONFIG.systemTag, "#nieuwkomer"],
    tags: [
      CRMOS_CONFIG.systemTag,
      "#nieuwkomer",
      reg.countryOfOrigin ? `#herkomst_${reg.countryOfOrigin.toLowerCase().replace(/\s+/g, "_")}` : "#onbekend",
      ...services.map((s) => `#behoefte_${s.toLowerCase()}`),
    ],
    notes: `Dossier status: ${reg.status}. Gewenste ondersteuning: ${services.join(", ") || "Algemeen"}. ${reg.notes || ""}`,
    status: reg.status === "gekoppeld" ? "customer" : "qualified",
  };

  const res = await upsertCrmosContact(payload);

  const log: CrmosSyncLog = {
    id: "sync-" + Date.now(),
    type: "contact",
    entityName: `${reg.firstName} ${reg.lastName}`,
    email: reg.email,
    status: res.error ? "fallback_local" : "success",
    timestamp: Date.now(),
    message: res.error ? `Lokaal gearchiveerd (${res.error})` : "Succesvol geüpsert in CRMos",
  };

  saveLocalLog(log);
  return log;
}

/**
 * Synchroniseert een Postadres-Helper naar CRMos als partner/contact
 */
export async function syncHelperToCrmos(helper: HelperDoc): Promise<CrmosSyncLog> {
  const payload: CrmosContactUpsertPayload = {
    first_name: helper.firstName,
    last_name: helper.lastName,
    email: helper.email,
    phone: helper.phone,
    company: "Postadres Helper Netwerk",
    company_tags: [CRMOS_CONFIG.systemTag, "#postadres_helper"],
    tags: [
      CRMOS_CONFIG.systemTag,
      "#postadres_helper",
      helper.city ? `#stad_${helper.city.toLowerCase().replace(/\s+/g, "_")}` : "#nederland",
      helper.monthlyDonation ? "#gift_donateur" : "#vrijwilliger",
    ],
    notes: `Helper in ${helper.city}. Status: ${helper.status}. Gekoppeld aan: ${helper.matchedNewcomer || "Nog open"}. Verwerkte brieven: ${helper.registeredLettersCount || 0}.`,
    status: "customer",
  };

  const res = await upsertCrmosContact(payload);

  const log: CrmosSyncLog = {
    id: "sync-" + Date.now(),
    type: "contact",
    entityName: `${helper.firstName} ${helper.lastName}`,
    email: helper.email,
    status: res.error ? "fallback_local" : "success",
    timestamp: Date.now(),
    message: res.error ? `Lokaal gearchiveerd (${res.error})` : "Succesvol geüpsert in CRMos",
  };

  saveLocalLog(log);
  return log;
}

/**
 * Synchroniseert een sollicitant van vacatures naar CRMos Candidates
 */
export async function syncJobApplicationToCrmos(jobApp: JobApplicationDoc): Promise<CrmosSyncLog> {
  const [firstName, ...rest] = (jobApp.fullName || "Kandidaat").split(" ");
  const lastName = rest.join(" ") || "-";

  const payload: CrmosCandidatePayload = {
    first_name: firstName,
    last_name: lastName,
    email: jobApp.email,
    phone: jobApp.phone,
    skills: [jobApp.jobTitle, `${jobApp.hoursPerWeek} uur/week`, "Ecosysteem Partner"],
    location: "100% Remote / NL",
    notes: `Sollicitatie op functie: ${jobApp.jobTitle}. Motivatie: ${jobApp.motivation || ""}. LinkedIn: ${jobApp.linkedinUrl || "Geen"}. Track record: ${jobApp.trackrecord || "N.v.t."}`,
  };

  const res = await createCrmosCandidate(payload);

  const log: CrmosSyncLog = {
    id: "sync-" + Date.now(),
    type: "candidate",
    entityName: jobApp.fullName,
    email: jobApp.email,
    status: res.error ? "fallback_local" : "success",
    timestamp: Date.now(),
    message: res.error ? `Lokaal gearchiveerd (${res.error})` : "Kandidaat ingeschreven in CRMos",
  };

  saveLocalLog(log);
  return log;
}

/**
 * Haalt de meest recente synchronisatielogs op
 */
export function getCrmosSyncLogs(): CrmosSyncLog[] {
  return getLocalLogs();
}
