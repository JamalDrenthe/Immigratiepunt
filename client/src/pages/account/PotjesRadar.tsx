import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  GraduationCap,
  Scale,
  School,
  Wallet,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Send,
  Clock,
  ShieldCheck,
  Check,
  Info,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Member } from "@/lib/auth";
import {
  PotjeGrant,
  PotjeApplication,
  fetchAvailablePotjes,
  fetchPotjeApplications,
  submitPotjeApplication,
} from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PotjesRadarProps {
  member: Member;
  onOpenUrgentie?: () => void;
}

export default function PotjesRadar({ member, onOpenUrgentie }: PotjesRadarProps) {
  const { t } = useTranslation();

  const allPotjes = fetchAvailablePotjes();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickScanFilters, setQuickScanFilters] = useState<{
    lowIncome: boolean;
    hasChildren: boolean;
    foreignDiploma: boolean;
    indProcedure: boolean;
    rentingHouse: boolean;
  }>({
    lowIncome: true,
    hasChildren: false,
    foreignDiploma: false,
    indProcedure: false,
    rentingHouse: true,
  });

  const [applications, setApplications] = useState<PotjeApplication[]>(() =>
    fetchPotjeApplications(member.email)
  );

  // Application Modal state
  const [selectedPotje, setSelectedPotje] = useState<PotjeGrant | null>(null);
  const [appNotes, setAppNotes] = useState("");
  const [appSubmitting, setAppSubmitting] = useState(false);
  const [appSuccess, setAppSuccess] = useState(false);

  // Filter logic
  const filteredPotjes = allPotjes.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.provider.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleApply = (potje: PotjeGrant) => {
    setSelectedPotje(potje);
    setAppNotes("");
    setAppSuccess(false);
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPotje) return;

    setAppSubmitting(true);
    const newApp = submitPotjeApplication({
      userEmail: member.email,
      userName: member.name,
      potjeId: selectedPotje.id,
      potjeTitle: selectedPotje.title,
      notes: appNotes || "Ondersteuningsverzoek voor aanvraag en documentcontrole.",
    });

    setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
    setAppSubmitting(false);
    setAppSuccess(true);
    setTimeout(() => {
      setAppSuccess(false);
      setSelectedPotje(null);
    }, 1500);
  };

  const getCategoryBadge = (cat: PotjeGrant["category"]) => {
    switch (cat) {
      case "sociale_zekerheid":
        return { label: "Sociale Zekerheid & Toeslagen", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "school_onderwijs":
        return { label: "School & Onderwijs", bg: "bg-blue-100 text-blue-800 border-blue-200" };
      case "ind_leges":
        return { label: "IND & Legescompensatie", bg: "bg-amber-100 text-amber-900 border-amber-200" };
      case "diploma_vertaling":
        return { label: "Diploma Waardering & Vertaling", bg: "bg-purple-100 text-purple-800 border-purple-200" };
      case "juridisch":
        return { label: "Juridische Ondersteuning", bg: "bg-rose-100 text-rose-800 border-rose-200" };
    }
  };

  const getCategoryIcon = (cat: PotjeGrant["category"]) => {
    switch (cat) {
      case "sociale_zekerheid":
        return <Wallet className="h-5 w-5 text-emerald-600" />;
      case "school_onderwijs":
        return <School className="h-5 w-5 text-blue-600" />;
      case "ind_leges":
        return <ShieldCheck className="h-5 w-5 text-amber-600" />;
      case "diploma_vertaling":
        return <GraduationCap className="h-5 w-5 text-purple-600" />;
      case "juridisch":
        return <Scale className="h-5 w-5 text-rose-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-300 bg-linear-to-br from-emerald-50/80 via-white to-amber-50/50 p-6 md:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
              <Coins className="h-4 w-4 text-emerald-600" />
              <span>Financiële Regelingen & Subsidies voor Immigranten</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[#141413]">
              De Potjes & Subsidies Wijzer
            </h2>
            <p className="mt-2 text-xs md:text-sm text-[#3d3d3a] leading-relaxed">
              Nederland kent tientallen officiële voorzieningen en vergoedingen die speciaal zijn ingericht om nieuwkomers financieel en maatschappelijk te ondersteunen. Veel immigranten lopen jaarlijks duizenden euro's mis door onbekendheid met deze regelingen.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs text-right min-w-[240px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c887f] block">
              Beschikbare Potjes
            </span>
            <div className="text-3xl font-extrabold text-emerald-700 my-1">
              10+ Regelingen
            </div>
            <p className="text-[11px] text-[#6c6a64]">
              Van huurtoeslag tot gratis diplomawaardering & schoollaptop
            </p>
          </div>
        </div>

        {/* Quick Scan Filters Bar */}
        <div className="mt-6 border-t border-emerald-200/80 pt-5">
          <div className="text-xs font-bold text-[#141413] mb-2.5 flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-emerald-600" />
            <span>Persoonlijke Quick-Scan: Vink aan wat op jou van toepassing is</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <label className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all ${
              quickScanFilters.lowIncome
                ? "border-emerald-500 bg-emerald-100/60 text-emerald-900 font-semibold"
                : "border-[#e6dfd8] bg-white text-[#6c6a64]"
            }`}>
              <input
                type="checkbox"
                checked={quickScanFilters.lowIncome}
                onChange={(e) => setQuickScanFilters({ ...quickScanFilters, lowIncome: e.target.checked })}
                className="hidden"
              />
              <span>{quickScanFilters.lowIncome ? "✓" : "+"} Laag / nog geen inkomen</span>
            </label>

            <label className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all ${
              quickScanFilters.hasChildren
                ? "border-blue-500 bg-blue-100/60 text-blue-900 font-semibold"
                : "border-[#e6dfd8] bg-white text-[#6c6a64]"
            }`}>
              <input
                type="checkbox"
                checked={quickScanFilters.hasChildren}
                onChange={(e) => setQuickScanFilters({ ...quickScanFilters, hasChildren: e.target.checked })}
                className="hidden"
              />
              <span>{quickScanFilters.hasChildren ? "✓" : "+"} Kinderen op school (4-18j)</span>
            </label>

            <label className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all ${
              quickScanFilters.foreignDiploma
                ? "border-purple-500 bg-purple-100/60 text-purple-900 font-semibold"
                : "border-[#e6dfd8] bg-white text-[#6c6a64]"
            }`}>
              <input
                type="checkbox"
                checked={quickScanFilters.foreignDiploma}
                onChange={(e) => setQuickScanFilters({ ...quickScanFilters, foreignDiploma: e.target.checked })}
                className="hidden"
              />
              <span>{quickScanFilters.foreignDiploma ? "✓" : "+"} Buitenlands diploma / opleiding</span>
            </label>

            <label className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all ${
              quickScanFilters.indProcedure
                ? "border-amber-500 bg-amber-100/60 text-amber-900 font-semibold"
                : "border-[#e6dfd8] bg-white text-[#6c6a64]"
            }`}>
              <input
                type="checkbox"
                checked={quickScanFilters.indProcedure}
                onChange={(e) => setQuickScanFilters({ ...quickScanFilters, indProcedure: e.target.checked })}
                className="hidden"
              />
              <span>{quickScanFilters.indProcedure ? "✓" : "+"} IND procedure / Juridisch bezwaar</span>
            </label>

            <label className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all ${
              quickScanFilters.rentingHouse
                ? "border-emerald-500 bg-emerald-100/60 text-emerald-900 font-semibold"
                : "border-[#e6dfd8] bg-white text-[#6c6a64]"
            }`}>
              <input
                type="checkbox"
                checked={quickScanFilters.rentingHouse}
                onChange={(e) => setQuickScanFilters({ ...quickScanFilters, rentingHouse: e.target.checked })}
                className="hidden"
              />
              <span>{quickScanFilters.rentingHouse ? "✓" : "+"} Huurder / Op zoek naar woning</span>
            </label>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Alle Categorieën" },
            { id: "sociale_zekerheid", label: "Sociale Zekerheid & Toeslagen" },
            { id: "school_onderwijs", label: "School & Onderwijs" },
            { id: "diploma_vertaling", label: "Diploma Waardering & Vertaling" },
            { id: "ind_leges", label: "IND & Leges" },
            { id: "juridisch", label: "Juridische Hulp" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary text-white shadow-xs"
                  : "border border-[#e6dfd8] bg-white text-[#3d3d3a] hover:bg-[#faf9f5]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8c887f]" />
          <input
            type="text"
            placeholder="Zoek op trefwoord of instantie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#e6dfd8] bg-white pl-9 pr-3 py-2 text-xs text-[#141413] focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Active Potjes Applications (If any submitted) */}
      {applications.length > 0 && (
        <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3 mb-4">
            <h3 className="font-bold text-base text-[#141413] flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Jouw Aangevraagde Potjes & Begeleiding ({applications.length})</span>
            </h3>
            <span className="text-xs text-[#6c6a64]">In behandeling bij consulent</span>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-[#141413]">{app.potjeTitle}</strong>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      app.status === "goedgekeurd"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {app.status === "goedgekeurd" ? "Toegekend / Afgerond" : "In Behandeling"}
                    </span>
                  </div>
                  <p className="text-[#6c6a64] mt-1">{app.notes}</p>
                  {app.consultantNotes && (
                    <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-emerald-900 text-[11px]">
                      <strong>Statusupdate:</strong> {app.consultantNotes}
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-[#8c887f]">
                  Aangevraagd op: {new Date(app.createdAt).toLocaleDateString("nl-NL")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Potjes Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredPotjes.map((potje) => {
          const badge = getCategoryBadge(potje.category);
          const icon = getCategoryIcon(potje.category);
          const hasApplied = applications.some((a) => a.potjeId === potje.id);

          return (
            <div
              key={potje.id}
              className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-xs flex flex-col justify-between transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div>
                {/* Top Badge & Provider */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="text-xs font-semibold text-[#8c887f]">
                    {potje.provider}
                  </span>
                </div>

                {/* Title & Amount Indication */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#faf9f5] border border-[#e6dfd8]">
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#141413]">
                        {potje.title}
                      </h3>
                      <span className="text-xs text-[#6c6a64]">{potje.targetAudience}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-sm text-primary block">
                      {potje.amountIndication}
                    </span>
                    <span className="text-[10px] text-[#8c887f] capitalize">
                      {potje.frequency.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#3d3d3a] leading-relaxed mt-2 mb-4">
                  {potje.description}
                </p>

                {/* Voorwaarden checklist */}
                <div className="rounded-xl bg-[#faf9f5] border border-[#e6dfd8] p-3 text-xs mb-3 space-y-1.5">
                  <strong className="block text-[#141413] text-[11px] uppercase tracking-wider">
                    Belangrijkste Voorwaarden:
                  </strong>
                  {potje.eligibility.map((el, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-[#6c6a64]">
                      <Check className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{el}</span>
                    </div>
                  ))}
                </div>

                {/* Benodigde documenten */}
                <div className="text-[11px] text-[#8c887f] mb-4">
                  <strong>Benodigd:</strong> {potje.documentsNeeded.join(" • ")}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="border-t border-[#f0eae1] pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                {potje.officialLink && (
                  <a
                    href={potje.officialLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#6c6a64] hover:text-[#141413] hover:underline text-[11px]"
                  >
                    <span>Officiële instantie</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                <div className="flex gap-2 ml-auto">
                  {hasApplied ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 text-emerald-800 px-3 py-2 text-xs font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Aanvraag Actief</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApply(potje)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
                    >
                      <span>Hulp Bij Aanvraag</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to action for Urgentie Scheme */}
      <div className="rounded-2xl border border-amber-300 bg-linear-to-r from-amber-50 via-white to-amber-100/40 p-6 shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>Moeite met formulieren of afwijzingen van instanties?</span>
          </div>
          <h4 className="font-bold text-lg text-[#141413]">
            Laat Onze Consulenten de Aanvragen Volledig Uit Handen Nemen
          </h4>
          <p className="text-xs text-[#6c6a64] max-w-xl mt-1 leading-relaxed">
            Met de <strong>Zakelijke Urgentie Regeling</strong> schrijven wij bezwaarschriften, bellen we met gemeentes en de IND en regelen we de vereiste documenten via jouw account dienstentegoed.
          </p>
        </div>

        {onOpenUrgentie && (
          <button
            type="button"
            onClick={onOpenUrgentie}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#a9583e] transition-colors"
          >
            <span>Bekijk Urgentie Diensten</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Application Dialog */}
      <Dialog open={!!selectedPotje} onOpenChange={() => setSelectedPotje(null)}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-[#141413]">
              <Coins className="h-5 w-5 text-primary" />
              <span>Hulp Aanvragen voor {selectedPotje?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6c6a64]">
              Onze consulent helpt je met de documentcontrole, de officiële formulieren en de indiening bij {selectedPotje?.provider}.
            </DialogDescription>
          </DialogHeader>

          {appSuccess ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center text-emerald-900">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-sm">Aanvraagverzoek Ingediend!</h4>
              <p className="text-xs mt-1 text-[#3d3d3a]">
                Je adviseur neemt binnen 2 werkdagen contact met je op om de vereiste stukken door te nemen.
              </p>
            </div>
          ) : (
            <form onSubmit={submitApplication} className="space-y-4 py-2">
              <div className="rounded-xl bg-[#faf9f5] border border-[#e6dfd8] p-3 text-xs space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Regeling:</span>
                  <span className="text-primary">{selectedPotje?.title}</span>
                </div>
                <div className="flex justify-between text-[#6c6a64]">
                  <span>Instantie:</span>
                  <span>{selectedPotje?.provider}</span>
                </div>
                <div className="flex justify-between text-[#6c6a64]">
                  <span>Indicatie:</span>
                  <span className="font-bold text-emerald-700">{selectedPotje?.amountIndication}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#141413] block mb-1">
                  Toelichting / Huidige Situatie
                </label>
                <textarea
                  rows={3}
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  placeholder="Beschrijf kort je situatie (bijv. 'Ik heb twee schoolgaande kinderen en heb een brief van de school ontvangen', of 'Mijn diploma is uit Syrië en ik wil die laten waarderen')..."
                  className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-3 text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Kosteloos voor nieuwkomers:</strong> Begeleiding bij standaardsubsidies valt onder je reguliere Immigratiepunt-integratietraject. Heb je spoed of juridische brieven nodig? Dan kan dit via de Zakelijke Urgentieregeling.
                </span>
              </div>

              <button
                type="submit"
                disabled={appSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#a9583e] disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{appSubmitting ? "Bezig met indienen..." : "Dien Ondersteuningsverzoek In"}</span>
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
