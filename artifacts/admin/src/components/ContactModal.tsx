import { useState } from "react";
import { sendContactEmail, type Enquiry } from "@/lib/api";

type Props = {
  enquiry: Enquiry;
  onClose: () => void;
};

const TEMPLATES = [
  {
    label: "Initial Outreach",
    text: (e: Enquiry) =>
      `Hi ${e.name},\n\nThank you for your enquiry through Thames Uni Connect! We'd love to help you pursue ${e.course} in ${e.destination}.\n\nCould we arrange a free consultation call to discuss your application in more detail? Please let us know a convenient time.\n\nWarm regards,\nThames Uni Connect Team`,
  },
  {
    label: "Follow-up",
    text: (e: Enquiry) =>
      `Hi ${e.name},\n\nJust following up on your enquiry regarding ${e.course} in ${e.destination}. We have some great university options lined up for you!\n\nWhen would be a good time to connect this week?\n\nBest,\nThames Uni Connect Team`,
  },
  {
    label: "Document Request",
    text: (e: Enquiry) =>
      `Hi ${e.name},\n\nWe're progressing your ${e.course} application for ${e.destination}. To move forward, could you please share:\n\n• Academic transcripts (last 2 years)\n• English language test results (IELTS/TOEFL)\n• Copy of your passport\n\nOnce received, we'll review everything and get back to you within 48 hours.\n\nThames Uni Connect Team`,
  },
  {
    label: "Offer Received",
    text: (e: Enquiry) =>
      `Hi ${e.name},\n\nGreat news! We have received a conditional offer for your ${e.course} application in ${e.destination}. 🎉\n\nPlease call or WhatsApp us to discuss next steps including accepting the offer and arranging your CAS letter.\n\nThames Uni Connect Team`,
  },
];

export default function ContactModal({ enquiry: e, onClose }: Props) {
  const [message, setMessage] = useState(TEMPLATES[0].text(e));
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  function applyTemplate(idx: number) {
    setActiveTemplate(idx);
    setMessage(TEMPLATES[idx].text(e));
    setSent(false);
    setSendError("");
  }

  function openWhatsApp() {
    const clean = e.phone.replace(/\D/g, "");
    const number = clean.startsWith("0") ? "44" + clean.slice(1) : clean;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  async function sendEmail() {
    if (!e.email) {
      setSendError("No email address on file for this student.");
      return;
    }
    setSending(true);
    setSendError("");
    try {
      await sendContactEmail({ toEmail: e.email, toName: e.name, message });
      setSent(true);
    } catch (err: any) {
      setSendError(err.message ?? "Failed to send email");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(ev) => { if (ev.target === ev.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="bg-[#0F2D5E] px-6 py-5 flex items-start justify-between rounded-t-2xl">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-[#D4963A] flex items-center justify-center text-white font-bold text-sm">
                {e.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight">{e.name}</p>
                <p className="text-blue-300 text-xs">{e.course} · {e.destination}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-2 ml-12">
              {e.phone && (
                <span className="text-blue-200 text-xs flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  {e.phone}
                </span>
              )}
              {e.email && (
                <span className="text-blue-200 text-xs flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  {e.email}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl leading-none mt-1 ml-4"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Template picker */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Templates</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => applyTemplate(i)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    activeTemplate === i
                      ? "bg-[#0F2D5E] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message editor */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Message</p>
            <textarea
              value={message}
              onChange={(ev) => { setMessage(ev.target.value); setSent(false); setSendError(""); }}
              rows={10}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 resize-none focus:outline-none focus:border-[#0F2D5E] focus:ring-1 focus:ring-[#0F2D5E] leading-relaxed"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{message.length} chars</p>
          </div>

          {/* Feedback */}
          {sent && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl text-sm border border-green-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              Email sent to {e.email}
            </div>
          )}
          {sendError && (
            <div className="bg-red-50 text-red-700 px-4 py-2.5 rounded-xl text-sm border border-red-200">
              ⚠ {sendError}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3">
          <button
            onClick={openWhatsApp}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5B] text-white font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>
          <button
            onClick={sendEmail}
            disabled={sending || !e.email}
            className={`flex items-center justify-center gap-2 font-semibold text-sm py-3 rounded-xl transition-colors ${
              !e.email
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#0F2D5E] hover:bg-[#1a3d7a] text-white"
            }`}
          >
            {sending ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
            )}
            {sending ? "Sending…" : "Send Email"}
          </button>
        </div>

      </div>
    </div>
  );
}
