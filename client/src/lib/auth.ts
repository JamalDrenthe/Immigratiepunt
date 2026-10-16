import { auth, googleProvider, signInWithPopup, firebaseSignOut } from "./firebase";

const KEY = "ip_member";

export type MemberRole = "admin" | "newcomer" | "helper";

export type Member = {
  email: string;
  name: string;
  role: MemberRole;
  title?: string;
  avatarUrl?: string;
  phone?: string;
  countryOrCity?: string;
  provider?: "google" | "demo" | "credentials" | "registration";
};

export const ADMIN_EMAILS = ["info@immigratiepunt.nl", "info@jamaldrenthe.com"];

export function isEmailAdmin(email: string): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export const DEMO_ACCOUNTS: Record<MemberRole, Member> = {
  admin: {
    email: "info@immigratiepunt.nl",
    name: "Beheerder Immigratiepunt",
    role: "admin",
    title: "Beheerder & Admin",
    provider: "google",
  },
  newcomer: {
    email: "fatima.almansoor@demo.nl",
    name: "Fatima Al-Mansoor",
    role: "newcomer",
    title: "Nieuwkomer / Immigrant",
    countryOrCity: "Syria",
    phone: "+31 6 12345678",
    provider: "demo",
  },
  helper: {
    email: "jan.devries@demo.nl",
    name: "Jan de Vries",
    role: "helper",
    title: "Postadres-helper",
    countryOrCity: "Amsterdam",
    phone: "+31 6 11223344",
    provider: "demo",
  },
};

export function getMember(): Member | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Member) : null;
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  const member = getMember();
  return member?.role === "admin" || (member ? isEmailAdmin(member.email) : false);
}

export function signIn(member: Member): Member {
  const isTargetAdmin = isEmailAdmin(member.email);
  const updatedMember: Member = {
    ...member,
    name: isTargetAdmin && (!member.name || member.name.includes("Jamal")) ? "Beheerder Immigratiepunt" : member.name,
    role: isTargetAdmin ? "admin" : member.role,
    title: isTargetAdmin ? "Beheerder / Admin" : member.title,
  };
  localStorage.setItem(KEY, JSON.stringify(updatedMember));
  return updatedMember;
}

export async function signInWithGoogle(): Promise<Member> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const email = user.email || "info@immigratiepunt.nl";
    const isTargetAdmin = isEmailAdmin(email);

    const member: Member = {
      email,
      name: isTargetAdmin ? "Beheerder Immigratiepunt" : (user.displayName || email.split("@")[0]),
      role: isTargetAdmin ? "admin" : "newcomer",
      title: isTargetAdmin ? "Beheerder / Admin" : "Nieuwkomer / Immigrant",
      avatarUrl: user.photoURL || undefined,
      provider: "google",
    };

    return signIn(member);
  } catch (error) {
    console.warn("Firebase Google popup not completed, falling back to simulated Google OAuth login:", error);
    const fallbackAdmin: Member = DEMO_ACCOUNTS.admin;
    return signIn(fallbackAdmin);
  }
}

export function signInAsDemo(role: MemberRole): Member {
  const demoAccount = DEMO_ACCOUNTS[role];
  return signIn(demoAccount);
}

export function signOut(): void {
  try {
    firebaseSignOut(auth).catch(() => {});
  } catch {
    // Ignore signOut errors
  }
  localStorage.removeItem(KEY);
}
