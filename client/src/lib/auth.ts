const KEY = "ip_member";

export type Member = {
  email: string;
  name: string;
  role: "newcomer" | "helper";
};

export function getMember(): Member | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Member) : null;
  } catch {
    return null;
  }
}

export function signIn(member: Member) {
  localStorage.setItem(KEY, JSON.stringify(member));
}

export function signOut() {
  localStorage.removeItem(KEY);
}
