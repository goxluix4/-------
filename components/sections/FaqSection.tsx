"use client";

import { useState } from "react";
import { FAQS } from "@/lib/constants";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-brand-gray py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 標題 */}
        <div className="text-center mb-12">
          <p className="text-brand-gold text-sm font-medium tracking-widest uppercase mb-3">
            FAQ
          </p>
          <h2 className="section-title text-brand-dark">常見問題</h2>
          <div className="gold-divider mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto text-center">
            詢價前常見疑問，歡迎閱讀後若仍有疑問，直接透過 LINE 或 Email 詢問。
          </p>
        </div>

        {/* FAQ 手風琴 */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                openIdx === idx
                  ? "border-brand-gold shadow-md"
                  : "border-brand-gray-mid hover:border-brand-gold/40"
              }`}
            >
              <button
                className="w-full flex items-start justify-between gap-4
                  px-6 py-5 text-left"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                aria-expanded={openIdx === idx}
              >
                <span
                  className={`font-medium text-sm leading-relaxed transition-colors ${
                    openIdx === idx ? "text-brand-navy" : "text-brand-dark"
                  }`}
                >
                  <span className="text-brand-gold mr-2 font-mono text-xs">
                    Q{String(idx + 1).padStart(2, "0")}
                  </span>
                  {faq.q}
                </span>
                <svg
                  className={`w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5
                    transition-transform duration-200 ${
                      openIdx === idx ? "rotate-180" : ""
                    }`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {openIdx === idx && (
                <div className="px-6 pb-5 border-t border-brand-gray-mid">
                  <p className="text-brand-blue/80 text-sm leading-relaxed pt-4">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 補充說明 */}
        <div
          className="mt-8 p-5 bg-brand-gold/10 border border-brand-gold/30
            rounded-xl text-center"
        >
          <p className="text-brand-navy text-sm leading-relaxed">
            本工作室目前以<strong>個人接案方式</strong>承作，可提供<strong>個人收據</strong>作為付款憑證。
            <br className="hidden sm:block" />
            如需統一發票，請於詢價前先行告知，以便確認合作方式。
          </p>
        </div>
      </div>
    </section>
  );
}
