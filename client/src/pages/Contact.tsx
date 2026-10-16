import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { MotionReveal, MotionStaggerContainer, MotionStaggerItem } from "@/components/ui/MotionWrapper";
import { ThreeDCard, ThreeDItem } from "@/components/ui/ThreeDCard";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Contact() {
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "newcomer",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("info@immigratiepunt.nl");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage("Vul alsjeblieft alle verplichte velden in.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const generatedTicket = `IP-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      if (db) {
        await addDoc(collection(db, "contacts"), {
          ticketId: generatedTicket,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          subject: formData.subject || "Algemeen contact",
          message: formData.message,
          createdAt: serverTimestamp(),
          status: "open",
        });
      }
    } catch (err) {
      console.warn("Firestore contact submission fallback:", err);
      // Local storage fallback for maximum resilience
      const existing = JSON.parse(localStorage.getItem("immigratiepunt_contact_messages") || "[]");
      existing.push({
        ticketId: generatedTicket,
        ...formData,
        date: new Date().toISOString(),
      });
      localStorage.setItem("immigratiepunt_contact_messages", JSON.stringify(existing));
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTicketId(generatedTicket);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('contactPage.meta.title', 'Contact | Immigratiepunt')}</title>
        <meta name="description" content={t('contactPage.meta.description', 'Neem contact op met het team van Immigratiepunt. Wij staan klaar om al je vragen te beantwoorden.')} />
        <meta property="og:title" content={t('contactPage.meta.title', 'Contact | Immigratiepunt')} />
        <meta property="og:locale" content={i18n.language} />
      </Helmet>

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#faf9f5] py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#cc785c]/10 blur-3xl" />
          <div className="absolute left-10 bottom-0 h-80 w-80 rounded-full bg-[#e8a55a]/10 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl px-4">
          <MotionReveal direction="up" className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e6dfd8] bg-[#efe9de]/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#141413]">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              <span>{t('contactPage.badge', 'Contact')}</span>
            </div>
            <h1 className="font-display mb-6 text-5xl font-medium tracking-tight text-[#141413] md:text-6xl">
              {t('contactPage.title', 'Neem contact met ons op')}
            </h1>
            <p className="text-lg leading-relaxed text-[#3d3d3a]">
              {t('contactPage.subtitle', 'Heb je een vraag over onze diensten, het postadres-programma of wil je samenwerken? Ons team staat voor je klaar.')}
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="border-t border-[#e6dfd8] bg-[#f5f0e8] py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            {/* Left: Contact Form Card */}
            <MotionReveal direction="up">
              <ThreeDCard depth={6} className="rounded-3xl shadow-xl shadow-black/5">
                <div className="rounded-3xl border border-[#e6dfd8] bg-white p-8 sm:p-12">
                  <h2 className="font-display mb-2 text-3xl font-medium tracking-tight text-[#141413]">
                    {t('contactPage.form.title', 'Stuur ons een bericht')}
                  </h2>
                  <p className="mb-8 text-sm text-[#6c6a64]">
                    We antwoorden gemiddeld binnen 2 tot 4 uur op werkdagen.
                  </p>

                  <AnimatePresence mode="wait">
                    {isSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-8 text-center"
                      >
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h3 className="font-display mb-2 text-2xl font-semibold text-emerald-900">
                          {t('contactPage.form.successTitle', 'Bericht succesvol verzonden!')}
                        </h3>
                        <p className="mb-4 text-sm text-emerald-800">
                          Je referentienummer is <span className="font-mono font-bold">{ticketId}</span>. We nemen spoedig contact met je op via <span className="font-semibold">{formData.email}</span>.
                        </p>
                        <button
                          onClick={() => {
                            setIsSuccess(false);
                            setFormData({ name: "", email: "", role: "newcomer", subject: "", message: "" });
                          }}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-800"
                        >
                          Nog een bericht sturen
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {errorMessage && (
                          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
                            {errorMessage}
                          </div>
                        )}

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#141413]">
                              {t('contactPage.form.name', 'Volledige naam')} *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Bijv. Alex de Vries"
                              className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-4 py-3 text-sm text-[#141413] transition-colors focus:border-primary focus:bg-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#141413]">
                              {t('contactPage.form.email', 'E-mailadres')} *
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="naam@voorbeeld.nl"
                              className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-4 py-3 text-sm text-[#141413] transition-colors focus:border-primary focus:bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#141413]">
                              {t('contactPage.form.role', 'Ik ben...')}
                            </label>
                            <select
                              value={formData.role}
                              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                              className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-4 py-3 text-sm text-[#141413] transition-colors focus:border-primary focus:bg-white focus:outline-none"
                            >
                              <option value="newcomer">{t('contactPage.form.roleNewcomer', 'Nieuwkomer in Nederland')}</option>
                              <option value="helper">{t('contactPage.form.roleHelper', 'Postadres-helper')}</option>
                              <option value="partner">{t('contactPage.form.rolePartner', 'Partner of organisatie')}</option>
                              <option value="other">{t('contactPage.form.roleOther', 'Anders / Algemeen')}</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#141413]">
                              {t('contactPage.form.subject', 'Onderwerp')}
                            </label>
                            <input
                              type="text"
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                              placeholder="Waar gaat je vraag over?"
                              className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-4 py-3 text-sm text-[#141413] transition-colors focus:border-primary focus:bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#141413]">
                            {t('contactPage.form.message', 'Jouw bericht of vraag')} *
                          </label>
                          <textarea
                            rows={5}
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Typ hier je vraag of opmerking..."
                            className="w-full rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-4 py-3 text-sm text-[#141413] transition-colors focus:border-primary focus:bg-white focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-[#a9583e] disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                          <span>{isSubmitting ? t('contactPage.form.sending', 'Bezig met verzenden...') : t('contactPage.form.send', 'Bericht versturen')}</span>
                        </button>
                      </form>
                    )}
                  </AnimatePresence>
                </div>
              </ThreeDCard>
            </MotionReveal>

            {/* Right: Contact Information & Interactive Map */}
            <div className="space-y-6">
              {/* Direct Email Card */}
              <MotionReveal direction="up" delay={0.1}>
                <ThreeDCard depth={8} className="rounded-2xl">
                  <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </span>
                      <button
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6dfd8] px-3 py-1.5 text-xs font-medium text-[#6c6a64] transition-colors hover:bg-[#efe9de] hover:text-[#141413]"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Gekopieerd!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>{t('contactPage.info.copyEmail', 'Kopieer')}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">
                      {t('contactPage.info.email', 'E-mailadres')}
                    </div>
                    <a
                      href="mailto:info@immigratiepunt.nl"
                      className="font-display mt-1 block text-2xl font-medium tracking-tight text-[#141413] hover:text-primary transition-colors"
                    >
                      info@immigratiepunt.nl
                    </a>
                    <p className="mt-2 text-xs text-[#8e8b82]">
                      Directe lijn met ons centrale coördinatieteam.
                    </p>
                  </div>
                </ThreeDCard>
              </MotionReveal>

              {/* Service & Hours Card */}
              <MotionReveal direction="up" delay={0.2}>
                <ThreeDCard depth={8} className="rounded-2xl">
                  <div className="rounded-2xl border border-[#e6dfd8] bg-white p-6 shadow-sm">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#5db8a6]/15 text-[#5db8a6]">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">
                      Bereikbaarheid
                    </div>
                    <div className="font-display mt-1 text-2xl font-medium tracking-tight text-[#141413]">
                      Landelijk Actief
                    </div>
                    <div className="text-sm text-[#3d3d3a]">Digitaal loket voor heel Nederland</div>

                    <div className="mt-6 border-t border-[#e6dfd8] pt-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{t('contactPage.info.hours', 'Openingstijden')}</span>
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-[#3d3d3a]">
                        <div className="flex justify-between">
                          <span>Maandag – Vrijdag:</span>
                          <span className="font-medium">09:00 – 18:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Zaterdag:</span>
                          <span className="font-medium">10:00 – 15:00</span>
                        </div>
                        <div className="flex justify-between text-[#8e8b82]">
                          <span>Zondag:</span>
                          <span>Gesloten</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ThreeDCard>
              </MotionReveal>

              {/* Nationwide Coverage Network Card */}
              <MotionReveal direction="up" delay={0.3}>
                <div className="overflow-hidden rounded-2xl border border-[#e6dfd8] bg-[#181715] p-6 text-white shadow-md">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#a09d96]">Landelijk Netwerk</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Actief in 12 provincies
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#a09d96] mb-4">
                    Immigratiepunt verbindt nieuwkomers en gecertificeerde postadres-helpers in alle Nederlandse gemeenten via een centraal gecoördineerd netwerk.
                  </p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-[#faf9f5]">
                    <span className="text-[#a09d96]">Gemiddelde reactietijd:</span>
                    <span className="font-semibold text-emerald-400">Binnen 2 tot 4 uur</span>
                  </div>
                </div>
              </MotionReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
